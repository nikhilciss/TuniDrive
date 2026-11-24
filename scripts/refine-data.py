import json,pathlib,datetime
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
def read(n):return json.loads((root/'src/data'/f'{n}.json').read_text())
def save(n,x):(root/'src/data'/f'{n}.json').write_text(json.dumps(x,ensure_ascii=False,indent=2))
assets={'clio':'exec-1612df88-14ae-4cf4-905b-9f430f34f0e8.png','duster':'exec-795b38d4-1c1b-4387-b1cd-5ffa8f324f9a.png','mercedes':'exec-0cc05819-7c00-4316-a5b3-2f423bd335ec.png'}
for name,file in assets.items():Image.open('/home/cism-i-435/.codex/generated_images/01a20d05-7067-7e43-934a-3071c956cc49/'+file).convert('RGB').save(root/f'public/assets/{name}.webp',quality=88)
vs=read('vehicles')
for id,name in [('v3','clio'),('v13','duster'),('v17','mercedes')]:
 v=next(v for v in vs if v['id']==id);v['image']=f'/assets/{name}.webp';v['imageNote']='AI-generated model illustration, not a fleet photograph'
bookings=read('bookings')
for i,b in enumerate(bookings):
 group=i//5;s=b['status']
 if s=='completed':d=datetime.date(2026,group*2+1,10)
 elif s=='cancelled':d=datetime.date(2026,group*2+2,12)
 elif s=='confirmed':d=datetime.date(2026,11,25+group)
 elif s=='pending':d=datetime.date(2026,12,1+group)
 else:d=datetime.date(2026,11,22)
 if i==23:b['vehicleId']='v16';v=vs[15];b['subtotal']=v['price']*b['days'];b['tax']=round(b['subtotal']*.07,2);b['total']=round(b['subtotal']+b['tax'],2)
 b['pickupDate']=str(d);b['returnDate']=str(d+datetime.timedelta(days=b['days']))
 v=next(v for v in vs if v['id']==b['vehicleId']);b['pickupLocation']=v['locations'][0];b['returnLocation']=v['locations'][0]
save('bookings',bookings)
for name in ['payments','invoices']:
 rows=read(name)
 for r in rows:
  b=next(b for b in bookings if b['id']==r['bookingId']);r['date']=b['pickupDate']
  if name=='payments':r['amount']=b['total']
  else:r.update(subtotal=b['subtotal'],tax=b['tax'],total=b['total'])
 save(name,rows)
maintenance=read('maintenance');maintenance[4]['vehicleId']='v20';save('maintenance',maintenance)
for v in vs:
 v['status']='rented' if any(b['vehicleId']==v['id'] and b['status']=='active' for b in bookings) else 'maintenance' if any(m['vehicleId']==v['id'] and m['start']<='2026-11-24'<=m['end'] for m in maintenance) else 'available'
save('vehicles',vs)
# Independent CMS records, all editable only in temporary application memory.
cms={
 'blog':[{'id':'post1','title':'coastOffer','body':'aboutText','status':'published','image':'/assets/hero.webp'},{'id':'post2','title':'familyOffer','body':'longText','status':'published','image':'/assets/location-4.svg'}],
 'menus':[{'id':k,'title':k,'link':'/' if k=='home' else '/'+k,'status':'published'} for k in ['home','fleet','locations','offers','about']],
 'footer':[{'id':k,'title':k,'link':'/'+k,'status':'published'} for k in ['terms','privacy','cancellation']],
 'contact':[{'id':'contact','name':'TuniDrive','email':'contact@tunidrive.demo','phone':'+216 XX XXX XXX','address':'Tunis, Tunisie (demo)'}],
 'seo':[{'id':'home','title':'TuniDrive — Your Journey Starts Here','description':'Location de voitures en Tunisie — démonstration','status':'published'}]
}
save('cms',cms)
