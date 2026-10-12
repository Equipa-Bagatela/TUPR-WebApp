import json, urllib.request, re, unicodedata
raw=json.load(open('raw.json'))
# ---- stop catalogue: key -> (name, detail, coords or None)
S={}
def st(k,name,detail=None,c=None): S[k]=(name,detail,c)
FAB=('R. Fernando Augusto Bandeira','entre a Rtd. Baden Powell e Prç. Renato Aguiar')
st('fab',*FAB,(41.16604,-7.79539))
st('estacao','Lrg. da Estação',None,(41.15834,-7.78400))
st('ponte','Rtd. da Ponte',None,(41.15615,-7.77900))
st('jac','Av. Sacadura Cabral','Escola Sec. João de Araújo Correia',(41.16344,-7.80280))
st('lous_mat','R. da Lousada','antigo Matadouro Municipal',(41.16827,-7.79701))
st('lous_inv','R. da Lousada (INVERSÃO DE SENTIDO)','sentido oposto à EPDR do Rodo',(41.17790,-7.79526))
st('lous_frente','R. da Lousada','em frente à entrada para o Armazém 30',(41.17250,-7.79633))
st('lous_caves','R. da Lousada','em frente às Caves Vale do Rodo',(41.16935,-7.79653))
st('alagoas_ce','Centro Escolar das Alagoas',None,(41.16731,-7.80082))
# Verde
st('v_tondela','R. de Tondela','junto às Oficinas Municipais',(41.16743,-7.79616))
st('v_lous_cruz','R. da Lousada','Cruzamento Armazém 30',(41.17193,-7.79623))
st('v_lacerda_eb','R. Prof. José Lacerda','junto B.º das Alagoas - Cruzamento Eb2,3',(41.16760,-7.79844))
st('v_julio','R. Dr. Júlio Vasques','Junta de Freguesia de Godim',(41.16880,-7.80161))
st('v_igreja_godim','Igreja de S. José de Godim',None,(41.17123,-7.80313))
st('v_nogueiras','Cruzamento R. Padre Alberto Teixeira de Carvalho com a R. das Nogueiras',None,(41.17073,-7.80578))
st('v_dourolar','Dourolar','Cruzamento R. Cândida Lima com a R. das Cerdeiras',(41.16824,-7.80660))
st('v_candida','R. Cândida Lima','Cruzamento Loteamento das Lajes',(41.16487,-7.80454))
st('v_tanque','Lrg. do Tanque Redondo',None,(41.16299,-7.80442))
st('v_augusto','R. Augusto Vieira','Salgueiral',(41.16079,-7.80576))
st('v_augusto_douro','Cruzamento da R. Augusto Vieira e Av. do Douro',None,(41.15833,-7.80708))
st('v_douro','Av. do Douro','interseção com a Barroca',(41.16099,-7.80348))
st('v_fomento','Av. Sacadura Cabral','junto ao B.º Fundo Fomento de Habitação',(41.16431,-7.79982))
st('v_alameda','Av. Dr. Antão de Carvalho','Centro Escolar da Alameda',(41.16508,-7.79218))
st('v_camara','Av. Dr. Antão de Carvalho','Rtd. junto à Câmara Municipal',(41.16357,-7.78902))
st('v_galerias','Av. Dr. Manuel de Arriaga','junto Galerias S. João',(41.16156,-7.78808))
st('v_pt','Av. Dr. Manuel de Arriaga','junto ao Edf. da PT',(41.16117,-7.78603))
st('v_arriaga','Av. Dr. Manuel de Arriaga',None,(41.16162,-7.78575))
st('v_tabau','Av. Dr. Manuel de Arriaga','Edf. Tabau',(41.16349,-7.78675))
st('igreja_matriz','Igreja Matriz',None,(41.16510,-7.78499))
st('v_jfig_cem','R. João de Figueiredo','acesso ao Cemitério do Peso da Régua',(41.16441,-7.78398))
st('v_jfig_socorro','R. João de Figueiredo','B.º Nossa Senhora do Socorro',(41.16420,-7.78093))
st('v_dio_jfig','Av. Diocese de Vila Real','após intersecção com a R. João de Figueiredo',(41.16462,-7.78043))
st('v_dio_ped','Av. Diocese de Vila Real','cruzamento R. das Pedreiras com a Urb. S.Domingos',(41.16240,-7.78059))
st('v_dio_bairro','Av. Diocese de Vila Real','B.º da Av. Diocese de Vila Real',(41.15789,-7.77782))
st('v_camilos','R. dos Camilos','em frente à Sede do IVDP',(41.16080,-7.78759))
st('v_camilos_cruz','Cruzamento R. dos Camilos, R. Serpa Pinto e R. João de Lemos','antigo Sinaleiro',(41.16176,-7.78912))
st('v_ferreirinha','R. da Ferreirinha','sede da ADIN',(41.16406,-7.79216))
# Vermelha
st('r_ovar','Av. de Ovar','em frente à Biblioteca Municipal',(41.16266,-7.79214))
st('r_meia','Meia Laranja','Av. da Galiza',(41.15997,-7.78830))
st('r_dio_bairro','Av. Diocese de Vila Real','em frente ao B.º da Av. Diocese de Vila Real',(41.15778,-7.77756))
st('r_dio_sd','Av. Diocese de Vila Real','acesso à Urb. de S. Domingos',(41.16226,-7.78033))
st('r_freguesias','Rtd. das Freguesias',None,(41.16493,-7.77953))
st('r_boamorte','Av. Dr. Manuel de Arriaga','cruzamento com a R. da Boa Morte',(41.16623,-7.78352))
st('r_eiro','Lrg. do Eirô',None,(41.16608,-7.78576))
st('r_tabau','Av. Dr. Manuel de Arriaga','em frente ao Edf. Tabau',(41.16362,-7.78688))
st('r_arriaga','Av. Dr. Manuel de Arriaga',None,(41.16180,-7.78674))
st('r_pt','Av. Dr. Manuel de Arriaga','em frente ao Edf. da PT',(41.16123,-7.78618))
st('r_aviadores','Lrg. dos Aviadores',None,(41.16277,-7.78879))
st('r_junta','Junta de Freguesia','Edf. Junta Peso da Régua',(41.16465,-7.78972))
st('r_tribunal','Prç. Gen. Humberto Delgado','em frente ao Tribunal',(41.16581,-7.79202))
st('r_torre','Av. Sacadura Cabral','em frente ao Edf. Torre do Sol',(41.16484,-7.79830))
st('r_casapovo','Cruzamento da Casa do Povo de Godim',None,None)  # sem coordenadas fiáveis
st('r_dourolar','Dourolar','cruzamento R. das Laranjeiras com a R. das Cerdeiras',(41.16833,-7.80689))
st('r_nogueiras','Cruzamento da R. das Nogueiras com a R. Padre Alberto Teixeira de Carvalho',None,(41.17060,-7.80566))
st('r_cem_godim','Cemitério de Godim',None,(41.17132,-7.80323))
st('r_jf_godim','Cruzamento do Edf. da Junta de Freguesia de Godim com a R. Prof. José Lacerda',None,(41.16851,-7.80241))
st('r_eb23','Eb 2,3',None,(41.16746,-7.79833))
st('r_lous_entrada','R. da Lousada','entrada para o Armazém 30',(41.17193,-7.79623))
st('r_gnr','Junto ao Posto da GNR',None,(41.16752,-7.79599))

VERDE=['fab','v_tondela','lous_mat','v_lous_cruz','lous_inv','lous_frente','lous_caves','v_lacerda_eb','alagoas_ce','v_julio','v_igreja_godim','v_nogueiras','v_dourolar','v_candida','v_tanque','v_augusto','v_augusto_douro','v_douro','jac','v_fomento','fab','v_alameda','v_camara','v_galerias','v_pt','v_arriaga','v_tabau','igreja_matriz','v_jfig_cem','v_jfig_socorro','v_dio_jfig','v_dio_ped','v_dio_bairro','ponte','estacao','v_camilos','v_camilos_cruz','v_ferreirinha','fab']
VERM=['fab','r_ovar','r_meia','estacao','ponte','r_dio_bairro','r_dio_sd','r_freguesias','r_boamorte','r_eiro','r_tabau','r_arriaga','r_pt','r_aviadores','r_junta','r_tribunal','fab','r_torre','jac','r_casapovo','r_dourolar','r_nogueiras','r_cem_godim','r_jf_godim','alagoas_ce','r_eb23','lous_mat','r_lous_entrada','lous_inv','lous_frente','lous_caves','r_gnr','fab']
assert len(VERDE)==len(raw['verde'])==39, (len(VERDE),len(raw['verde']))
assert len(VERM)==len(raw['vermelha'])==33, (len(VERM),len(raw['vermelha']))
# sanity: Vermelha stop 'estacao' must be 4th row 08:07, ponte 08:08 etc
def slug(k): return k.replace('_','-')
lines={}
for lid,seq in (('verde',VERDE),('vermelha',VERM)):
    rows=raw[lid]
    grids=[r[1] for r in rows]
    assert all(len(g)==12 for g in grids)
    # each trip column must be strictly increasing
    for c in range(12):
        col=[g[c] for g in grids]; assert col==sorted(col) and len(set(col))==len(col),(lid,c,col)
    lines[lid]=[(seq[i],grids[i]) for i in range(len(seq))]
used=[k for k in S if any(k==s for l in lines.values() for s,_ in l)]
assert set(used)==set(S), set(S)-set(used)
# --- OSRM shapes
def shape(seq):
    pts=[S[k][2] for k in seq if S[k][2]]
    coords=';'.join(f'{p[1]},{p[0]}' for p in pts)
    u=f'https://router.project-osrm.org/route/v1/driving/{coords}?overview=full&geometries=geojson'
    import subprocess
    d=json.loads(subprocess.check_output(['curl','-s','-m','60',u]))
    g=d['routes'][0]['geometry']['coordinates']
    out=[]; 
    for lng,lat in g:
        q=(round(lat,5),round(lng,5))
        if not out or out[-1]!=q: out.append(q)
    return out
shapes={l:shape([s for s,_ in v]) for l,v in lines.items()}
for l,v in shapes.items(): print(l,len(v))
json.dump(shapes,open('shapes.json','w'))
# --- write TS
D='/Users/josep/Desktop/Bagatela/TUPR-WEBAPP/src/data/'
def ts(s): return json.dumps(s,ensure_ascii=False)
with open(D+'stops.ts','w') as f:
    f.write('''import type { Stop } from '../types'

/**
 * Paragens do TUPR, transcritas do PDF oficial "horarios_tupr_2025.pdf" (CM Peso da Régua).
 *
 * - `name` / `detail` seguem o texto do PDF (detail = a indicação entre parênteses).
 * - O PDF NÃO inclui coordenadas. As coordenadas (`coords`) são APROXIMADAS e foram
 *   obtidas das paragens "bus_stop" com nomes equivalentes no OpenStreetMap (© colaboradores
 *   do OpenStreetMap, licença ODbL). Servem apenas para o mapa — nunca para horários.
 * - Paragem sem `coords` (ex.: "Cruzamento da Casa do Povo de Godim") não tem posição fiável
 *   e não é desenhada no mapa.
 * - AMBIGUIDADE: o PDF não indica o lado da via. Paragens com o mesmo nome E a mesma indicação
 *   nas duas linhas (ex.: "Lrg. da Estação") foram unificadas numa só paragem; as restantes
 *   (ex.: "Av. Dr. Manuel de Arriaga" sem indicação, em cada linha) mantêm-se separadas.
 */
export const stops: Stop[] = [
''')
    for k,(n,d,c) in S.items():
        f.write(f"  {{ id: {ts(slug(k))}, name: {ts(n)}, "+(f"detail: {ts(d)}, " if d else '')+(f"coords: [{c[0]}, {c[1]}], " if c else '')+"},\n")
    f.write(']\n')
def trips_ts():
    return '[\n'+''.join(f"      {{ id: {{ID}}{i}, departure: {ts(t)}, days: {ts('mon-fri' if t[:2] in ('18','19') else 'mon-sat')} }},\n" for i,t in enumerate(lines['verde'][0][1]))+'    ]'
with open(D+'schedules.ts','w') as f:
    f.write('''import type { LineTimetable } from '../types'

/**
 * Horários transcritos do PDF oficial "horarios_tupr_2025.pdf".
 *
 * Cada linha é CIRCULAR e tem 12 viagens por dia, de segunda-feira a sábado
 * (partidas às 08:00, 09:00 … 19:00 na R. Fernando Augusto Bandeira).
 * O PDF assinala (•) as viagens das 18:00 e das 19:00 com "NÃO SE REALIZA AO SÁBADO",
 * pelo que essas duas viagens circulam apenas de segunda a sexta (`days: 'mon-fri'`).
 * O PDF não refere domingos nem feriados — assume-se que não há serviço (não confirmado).
 *
 * `stops[i].times[j]` = hora de passagem da viagem `trips[j]` na paragem `stops[i]`.
 * A ordem das paragens é a do percurso; a mesma paragem pode aparecer mais de uma vez
 * (ex.: R. Fernando Augusto Bandeira no início, a meio e no fim do circuito).
 */
''')
    f.write('export const timetables: Record<string, LineTimetable> = {\n')
    for lid,seq in lines.items():
        f.write(f'  {lid}: {{\n    trips: [\n')
        for i,t in enumerate(seq[0][1]):
            f.write(f"      {{ id: '{lid}-{i+1}', departure: '{t}', days: '{'mon-fri' if t[:2] in ('18','19') else 'mon-sat'}' }},\n")
        f.write('    ],\n    stops: [\n')
        for s,g in seq:
            f.write(f"      {{ stopId: '{slug(s)}', times: {json.dumps(g)} }},\n")
        f.write('    ],\n  },\n')
    f.write('}\n')
with open(D+'shapes.ts','w') as f:
    f.write("/** Traçado aproximado dos percursos (calculado sobre a rede viária OSM; ver stops.ts). [lat, lng] */\nimport type { LatLng } from '../types'\n\nexport const shapes: Record<string, LatLng[]> = {\n")
    for l,v in shapes.items():
        f.write(f"  {l}: {json.dumps(v)},\n")
    f.write('}\n')
print('ok')
