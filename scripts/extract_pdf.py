import fitz, re, json
p=fitz.open('pdf/horarios.pdf')[0]
spans=[]
for b in p.get_text('dict')['blocks']:
    for l in b.get('lines',[]):
        for s in l['spans']:
            t=s['text'].strip()
            if t: spans.append((t,(s['bbox'][0]+s['bbox'][2])/2,(s['bbox'][1]+s['bbox'][3])/2,s['bbox'],s['size']))
T=re.compile(r'^\d\d:\d\d$')
mid=p.rect.width/2
out={}
for name,(x0,x1) in {'verde':(0,mid),'vermelha':(mid,9999)}.items():
    S=[s for s in spans if x0<=s[1]<x1]
    times=[s for s in S if T.match(s[0])]
    # first column of times: smallest x among times
    xs=sorted(set(round(s[1]) for s in times))
    col0=xs[0]
    rows=sorted([s for s in times if abs(s[1]-col0)<4],key=lambda s:s[2])
    print(name,'cols',xs,'rows',len(rows))
    # names: spans to the left of col0
    names=[s for s in S if not T.match(s[0]) and s[3][2]<col0-10 and s[2]>rows[0][2]-8 and s[2]<rows[-1][2]+8]
    res=[]
    for r in rows:
        ys=r[2]
        mine=sorted([n for n in names if abs(n[2]-ys)<9],key=lambda n:n[2])
        cells=sorted([s for s in times if abs(s[2]-ys)<3],key=lambda s:s[1])
        res.append(([m[0] for m in mine],[c[0] for c in cells]))
    out[name]=res
    for a,b in res: print(a,b[:3],len(b))
json.dump(out,open('raw.json','w'),ensure_ascii=False,indent=1)
# dots
print([ (s[0],s[1],s[2]) for s in spans if s[0] in ('•',)])
