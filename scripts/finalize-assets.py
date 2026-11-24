from PIL import Image
import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
files={'airport':'exec-a9dd87a2-19dd-43de-b0af-9e999c6f429d.png','luxury':'exec-77fe4673-af48-4471-a994-241cf26d2035.png','hammamet':'exec-484f10e1-b69d-419f-9d79-8124be3e6a1c.png','djerba':'exec-84c4486c-d010-4c15-addf-cd9276f3cf71.png'}
for name,file in files.items():Image.open('/home/cism-i-435/.codex/generated_images/01a20d05-7067-7e43-934a-3071c956cc49/'+file).convert('RGB').save(root/f'public/assets/{name}.webp',quality=87)
p=root/'src/data/banners.json';d=json.loads(p.read_text());d[1]['image']='/assets/airport.webp';d[2]['image']='/assets/luxury.webp';p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
p=root/'src/data/locations.json';d=json.loads(p.read_text())
for x in d:
 if x['airport']:x['image']='/assets/airport.webp'
 if x['id']=='l4':x['image']='/assets/hammamet.webp'
 if x['id']=='l8':x['image']='/assets/djerba.webp'
p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
p=root/'src/data/offers.json';d=json.loads(p.read_text())
for i,x in enumerate(d):x['image']='/assets/'+['hero','hammamet','djerba','luxury','hammamet','djerba'][i]+'.webp'
p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
