"""
Aplica a src/data/stops.ts as coordenadas das paragens da API de tracking do TUPR
(https://tupr.elevensystems.pt/api, © Eleven Systems) e recalcula o traçado (src/data/shapes.ts, via OSRM).

Também valida o PDF: a API tem de ter as mesmas paragens, pela mesma ordem e com as mesmas horas
(viagem das 08:00) que src/data/schedules.ts. Se houver diferenças, o script pára.

Uso:  python3 scripts/apply_api_coords.py
"""
import json, re, subprocess, sys, math

API = 'https://tupr.elevensystems.pt/api'
ROOT = __file__.rsplit('/scripts/', 1)[0]
get = lambda path: json.loads(subprocess.check_output(['curl', '-sS', '-m', '60', API + path]))

def first_journey(route):  # primeira viagem do dia da linha (08:00)
    js = get(f'/routes/{route}/journeys')
    j = min(js, key=lambda x: x['startTime'])
    return get(f'/routes/{route}/journeys/{j["id"]}')['circulations']

api = {'verde': first_journey(1), 'vermelha': first_journey(2)}
sched = open(f'{ROOT}/src/data/schedules.ts').read()
stops_ts = open(f'{ROOT}/src/data/stops.ts').read()

def tm(s):
    h, m = s.split(':'); return int(h) * 60 + int(m)

seqs, positions = {}, {}
for lid, circ in api.items():
    blk = sched.split(f'  {lid}: {{')[1].split('\n  },')[0]
    st = re.findall(r"stopId: '([\w-]+)', times: \[\"(\d\d:\d\d)\"", blk)
    if len(st) != len(circ):
        sys.exit(f'{lid}: {len(st)} paragens no PDF vs {len(circ)} na API')
    base = circ[0]['departureTime']
    for (sid, t), c in zip(st, circ):
        if (c['arrivalTime'] - base) // 60 != tm(t) - tm(st[0][1]):
            sys.exit(f'{lid}: hora diferente em {sid}')
        p = (c['stage']['position']['lat'], c['stage']['position']['lon'])
        positions.setdefault(sid, set()).add(p)
    seqs[lid] = [sid for sid, _ in st]
print('PDF e API coincidem (paragens, ordem e horas).')

# paragem partilhada por duas linhas (lados diferentes da via): ponto médio das posições da API
coords = {sid: (sum(p[0] for p in ps) / len(ps), sum(p[1] for p in ps) / len(ps)) for sid, ps in positions.items()}

def repl(m):
    sid = m.group(1)
    line = m.group(0)
    c = coords[sid]
    line = re.sub(r',? ?coords: \[[^\]]*\],?', '', line)
    line = re.sub(r',\s*\},$', ' },', line)
    line = line.rstrip()
    assert line.endswith(' },'), line
    return line[:-3].rstrip(', ') + f', coords: [{c[0]:.6f}, {c[1]:.6f}] }},'
out = re.sub(r'  \{ id: "([\w-]+)".*\},', repl, stops_ts)
out = re.sub(r" \* - O PDF NÃO inclui coordenadas.*?Servem apenas para o mapa — nunca para horários\.\n",
 " * - O PDF NÃO inclui coordenadas. As coordenadas (`coords`) vêm das paragens (\"stages\") da API de tracking do TUPR\n"
 " *   (https://tupr.elevensystems.pt/api, © Eleven Systems), validadas contra este PDF (mesmas paragens, ordem e horas).\n"
 " *   Paragens partilhadas por duas linhas têm o ponto médio das duas posições. Servem só para o mapa — nunca para horários.\n", out, flags=re.S)
out = re.sub(r" \* - Paragem sem `coords`.*?não é desenhada no mapa\.\n", "", out, flags=re.S)
open(f'{ROOT}/src/data/stops.ts', 'w').write(out)

def shape(seq):
    pts = ';'.join(f'{coords[s][1]},{coords[s][0]}' for s in seq)
    d = get_raw(f'https://router.project-osrm.org/route/v1/driving/{pts}?overview=full&geometries=geojson')
    pts_out = []
    for lng, lat in d['routes'][0]['geometry']['coordinates']:
        q = (round(lat, 5), round(lng, 5))
        if not pts_out or pts_out[-1] != q: pts_out.append(q)
    return pts_out
get_raw = lambda u: json.loads(subprocess.check_output(['curl', '-sS', '-m', '60', u]))
shapes = {l: shape(s) for l, s in seqs.items()}
with open(f'{ROOT}/src/data/shapes.ts', 'w') as f:
    f.write("/** Traçado aproximado dos percursos (calculado sobre a rede viária OSM/OSRM a partir das paragens; ver stops.ts). [lat, lng] */\nimport type { LatLng } from '../types'\n\nexport const shapes: Record<string, LatLng[]> = {\n")
    for l, v in shapes.items():
        f.write(f"  {l}: {json.dumps(v)},\n")
    f.write('}\n')
print({l: len(v) for l, v in shapes.items()}, 'pontos de traçado;', len(coords), 'paragens atualizadas')
