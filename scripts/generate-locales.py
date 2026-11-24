import json,pathlib
rows='''home|Accueil|Home|الرئيسية
fleet|Nos véhicules|Our fleet|سياراتنا
locations|Nos agences|Locations|وكالاتنا
offers|Nos offres|Offers|عروضنا
about|À propos|About us|من نحن
contact|Contact|Contact|اتصل بنا
account|Mon espace|My account|حسابي
book|Réserver|Book now|احجز الآن
search|Trouver ma voiture|Find my car|ابحث عن سيارة
heroTitle|La Tunisie, en toute liberté.|Tunisia, at your own pace.|تونس، بكل حرية.
heroText|Des routes côtières aux escapades en ville. Trouvez la voiture qui vous ressemble et vivez la Tunisie autrement.|From coastal roads to city escapes. Find your perfect car and discover a different side of Tunisia.|من الطرق الساحلية إلى رحلات المدينة. اختر سيارتك واكتشف تونس بطريقة مختلفة.
airportTitle|Votre voyage commence à l’arrivée.|Your journey starts on arrival.|رحلتك تبدأ عند الوصول.
airportText|Retrouvez votre voiture à l’aéroport. Nous vous accompagnons dès les premiers kilomètres.|Your car awaits at the airport. A seamless start to your Tunisian adventure.|سيارتك بانتظارك في المطار. بداية مريحة لمغامرتك التونسية.
luxuryTitle|Prenez la route. Avec élégance.|Take the road. In style.|انطلق بأناقة.
luxuryText|Une sélection de véhicules premium pour les moments qui méritent une attention particulière.|A considered collection of premium vehicles for extraordinary journeys.|تشكيلة من السيارات الفاخرة لرحلات استثنائية.
eyebrow|VOTRE VOYAGE COMMENCE ICI|YOUR JOURNEY STARTS HERE|رحلتك تبدأ هنا
pickup|Lieu de départ|Pickup location|مكان الاستلام
returnLocation|Lieu de retour|Return location|مكان الإرجاع
pickupDate|Date de départ|Pickup date|تاريخ الاستلام
returnDate|Date de retour|Return date|تاريخ الإرجاع
pickupTime|Heure de départ|Pickup time|وقت الاستلام
returnTime|Heure de retour|Return time|وقت الإرجاع
sameLocation|Retour dans la même agence|Return to the same location|الإرجاع في نفس الوكالة
trusted|Le plaisir de voyager. La tranquillité en plus.|The joy of travel. With peace of mind.|متعة السفر مع راحة البال.
freeCancellation|Annulation flexible|Flexible cancellation|إلغاء مرن
transparent|Tarifs transparents|Transparent pricing|أسعار واضحة
assistance|Assistance 24h/24|24/7 assistance|مساعدة على مدار الساعة
localExpertise|Une équipe locale à vos côtés|Local expertise, always nearby|خبرة محلية بجانبك
selection|UNE VOITURE POUR CHAQUE ENVIE|A CAR FOR EVERY JOURNEY|سيارة لكل رحلة
featured|Votre prochaine escapade commence ici.|Your next escape starts here.|رحلتك القادمة تبدأ هنا.
featuredText|Citadine pratique, SUV spacieux ou berline élégante : choisissez votre compagnon de route.|City-ready hatchback, spacious SUV or refined sedan: meet your travel companion.|سيارة مدينة عملية أو سيارة عائلية واسعة: اختر رفيق رحلتك.
viewAll|Voir tous les véhicules|Explore the fleet|استعرض السيارات
perDay|/ jour|/ day|/ يوم
from|À partir de|From|ابتداءً من
details|Voir les détails|View details|عرض التفاصيل
available|Disponible|Available|متاحة
rented|En location|Rented|مؤجرة
maintenance|Maintenance|Maintenance|صيانة
manual|Manuelle|Manual|يدوية
automatic|Automatique|Automatic|أوتوماتيكية
petrol|Essence|Petrol|بنزين
diesel|Diesel|Diesel|ديزل
economy|Économique|Economy|اقتصادية
compact|Compacte|Compact|مدمجة
sedan|Berline|Sedan|سيدان
suv|SUV|SUV|دفع رباعي
premium|Premium|Premium|فاخرة
family|Familiale|Family|عائلية
offroad|Tout-terrain|Off-road|للطرق الوعرة
category|Catégorie|Category|الفئة
transmission|Transmission|Transmission|ناقل الحركة
fuel|Carburant|Fuel|الوقود
passengers|Passagers|Passengers|ركاب
luggage|Bagages|Bags|أمتعة
doors|Portes|Doors|أبواب
airConditioning|Climatisation|Air conditioning|مكيف هواء
unlimitedSupport|Accompagnement local|Local support|دعم محلي
filters|Filtres|Filters|التصفية
reset|Réinitialiser|Reset|إعادة تعيين
all|Tous|All|الكل
price|Prix|Price|السعر
maxPrice|Budget par jour|Daily budget|الميزانية اليومية
sort|Trier par|Sort by|ترتيب حسب
priceAsc|Prix croissant|Price: low to high|السعر تصاعدياً
priceDesc|Prix décroissant|Price: high to low|السعر تنازلياً
popularity|Popularité|Popularity|الأكثر شعبية
results|véhicules trouvés|vehicles found|سيارات متاحة
noResults|Aucun résultat. Essayez d’autres filtres.|No results. Try different filters.|لا نتائج. جرّب خيارات أخرى.
status|Statut|Status|الحالة
explore|À VOUS LA TUNISIE|DISCOVER TUNISIA|اكتشف تونس
destinations|De belles routes. De belles découvertes.|Beautiful roads. Remarkable places.|طرق جميلة. اكتشافات رائعة.
locationText|9 agences, un même accueil chaleureux. Au plus près de votre destination.|9 locations, one warm welcome. Right where your journey begins.|9 وكالات، وترحيب واحد. بالقرب من وجهتك.
agency|Découvrir l’agence|Explore location|استكشف الوكالة
how|La route s’ouvre à vous.|Your journey, made simple.|رحلتك بكل سهولة.
how1|Choisissez votre voiture|Choose your car|اختر سيارتك
how2|Personnalisez votre voyage|Make it your own|خصص رحلتك
how3|Récupérez les clés|Pick up the keys|استلم المفاتيح
howText|Quelques étapes simples, puis toute la liberté de découvrir.|A few simple steps. A world of discovery.|خطوات بسيطة، ثم حرية الاكتشاف.
reviews|Ils ont pris la route avec nous.|Stories from the road.|تجارب مسافرينا
review1|Accueil chaleureux à l’aéroport. La voiture était impeccable et le départ très simple.|A warm airport welcome. An immaculate car and an effortless start.|ترحيب رائع في المطار وسيارة ممتازة وبداية سهلة.
review2|Une belle expérience pour découvrir la côte en famille.|A wonderful way to explore the coast with family.|تجربة جميلة لاكتشاف الساحل مع العائلة.
review3|Les explications étaient claires et notre séjour très agréable.|Clear explanations and a lovely stay.|شرح واضح وإقامة ممتعة.
review4|La prise en charge à Tunis a été très pratique.|Pickup in Tunis was very convenient.|الاستلام في تونس كان مريحاً جداً.
review5|Un service attentionné du début à la fin.|Thoughtful service from start to finish.|خدمة مميزة من البداية للنهاية.
review6|Nous avons apprécié le confort et la flexibilité.|We loved the comfort and flexibility.|أعجبتنا الراحة والمرونة.
faq|Questions fréquentes|Frequently asked questions|أسئلة شائعة
newsletter|Un peu de Tunisie dans votre boîte mail.|A little Tunisia in your inbox.|القليل من تونس في بريدك.
subscribe|M’inscrire|Subscribe|اشترك
email|Adresse e-mail|Email address|البريد الإلكتروني
newsletterText|Idées d’escapades et offres de saison. Inscription de démonstration.|Travel inspiration and seasonal offers. Demo signup.|أفكار سفر وعروض موسمية. اشتراك تجريبي.
demo|Démonstration interactive · données et tarifs fictifs|Interactive demo · fictional data and prices|عرض تفاعلي · بيانات وأسعار افتراضية
demoNote|Aucune réservation, transaction ou notification réelle. Les modifications sont temporaires.|No real reservation, payment or notification. Changes last only for this session.|لا حجز أو دفع أو إشعار حقيقي. التغييرات مؤقتة لهذه الجلسة.
success|Enregistré pour cette démonstration.|Saved for this demonstration.|تم الحفظ لهذا العرض التجريبي.
validation|Vérifiez les champs et sélectionnez une date de retour après le départ.|Check the fields and choose a return after pickup.|تحقق من الحقول واختر إرجاعاً بعد الاستلام.
next|Continuer|Continue|متابعة
back|Retour|Back|رجوع
save|Enregistrer|Save|حفظ
cancel|Annuler|Cancel|إلغاء
close|Fermer|Close|إغلاق
edit|Modifier|Edit|تعديل
delete|Supprimer|Delete|حذف
add|Ajouter|Add|إضافة
preview|Aperçu|Preview|معاينة
print|Imprimer|Print|طباعة
export|Exporter CSV|Export CSV|تصدير CSV
name|Nom|Name|الاسم
phone|Téléphone|Phone|الهاتف
country|Pays|Country|الدولة
password|Mot de passe|Password|كلمة المرور
login|Connexion|Sign in|تسجيل الدخول
logout|Déconnexion|Sign out|تسجيل الخروج
register|Créer un compte démo|Create demo account|إنشاء حساب تجريبي
forgot|Mot de passe oublié ?|Forgot password?|نسيت كلمة المرور؟
demoLogin|Connexion démo|Demo sign in|دخول تجريبي
credentials|Identifiants de démonstration|Demo credentials|بيانات دخول تجريبية
admin|Administration|Administration|الإدارة
demoAccess|Accès démo|Demo access|دخول العرض
customerPortal|Espace client|Customer portal|بوابة العميل
rentalDetails|Votre location|Rental details|تفاصيل الإيجار
extras|Services additionnels|Additional services|خدمات إضافية
customerInfo|Vos coordonnées fictives|Fictional customer details|بيانات العميل الافتراضية
payment|Paiement simulé|Simulated payment|دفع تجريبي
confirmation|Confirmation|Confirmation|التأكيد
firstName|Prénom fictif|Fictional first name|الاسم الأول الافتراضي
lastName|Nom fictif|Fictional last name|اسم العائلة الافتراضي
licence|Permis fictif (DEMO uniquement)|Fictional licence (DEMO only)|رخصة افتراضية (DEMO فقط)
requests|Demandes particulières|Special requests|طلبات خاصة
basicInsurance|Protection de base|Basic insurance|حماية أساسية
premiumInsurance|Protection premium|Premium insurance|حماية شاملة
gps|Navigation GPS|GPS navigation|ملاحة GPS
childSeat|Siège enfant|Child seat|مقعد طفل
additionalDriver|Conducteur additionnel|Additional driver|سائق إضافي
roadside|Assistance routière|Roadside assistance|مساعدة على الطريق
airportDelivery|Livraison à l’aéroport|Airport delivery|توصيل إلى المطار
pickupPayment|Payer à la prise en charge|Pay on pickup|الدفع عند الاستلام
card|Carte simulée|Simulated card|بطاقة تجريبية
cash|Espèces|Cash|نقداً
transfer|Virement simulé|Simulated transfer|تحويل تجريبي
rental|Location|Rental|إيجار
days|jours|days|أيام
tax|Frais illustratifs (7 %)|Illustrative fee (7%)|رسوم توضيحية (7٪)
total|Total|Total|الإجمالي
confirmBooking|Confirmer la réservation démo|Confirm demo reservation|تأكيد الحجز التجريبي
bookingSuccess|Votre prochaine aventure est réservée.|Your next adventure is booked.|تم حجز مغامرتك القادمة.
bookingRef|Référence|Reference|المرجع
bookings|Réservations|Bookings|الحجوزات
pending|En attente|Pending|قيد الانتظار
confirmed|Confirmée|Confirmed|مؤكد
active|En cours|Active|نشط
completed|Terminée|Completed|مكتمل
cancelled|Annulée|Cancelled|ملغى
paid|Payé|Paid|مدفوع
refunded|Remboursé|Refunded|مسترد
scheduled|Planifiée|Scheduled|مجدول
profile|Mon profil|My profile|ملفي الشخصي
saved|Favoris|Saved vehicles|المفضلة
support|Assistance|Support|الدعم
invoices|Factures|Invoices|الفواتير
payments|Paiements|Payments|المدفوعات
dashboard|Tableau de bord|Dashboard|لوحة التحكم
welcome|Bienvenue chez TuniDrive|Welcome to TuniDrive|مرحباً بك في TuniDrive
fleetManagement|Gestion de flotte|Fleet management|إدارة الأسطول
calendar|Disponibilités|Availability|التوفر
pricing|Tarification|Pricing|التسعير
customers|Clients|Customers|العملاء
reports|Rapports|Reports|التقارير
content|Contenu du site|Website content|محتوى الموقع
settings|Réglages|Settings|الإعدادات
revenue|Chiffre d’affaires démo|Demo revenue|الإيرادات التجريبية
utilization|Utilisation de flotte|Fleet utilization|استخدام الأسطول
recentBookings|Réservations récentes|Recent bookings|الحجوزات الأخيرة
monthlyRevenue|Revenus mensuels|Monthly revenue|الإيرادات الشهرية
searchRecords|Rechercher un enregistrement…|Search records…|ابحث في السجلات…
vehicle|Véhicule|Vehicle|السيارة
customer|Client|Customer|العميل
amount|Montant|Amount|المبلغ
date|Date|Date|التاريخ
actions|Actions|Actions|إجراءات
view|Consulter|View|عرض
invoice|Facture|Invoice|فاتورة
confirm|Confirmer|Confirm|تأكيد
collect|Marquer comme récupérée|Mark as collected|تسجيل الاستلام
complete|Marquer comme retournée|Mark as returned|تسجيل الإرجاع
notifications|Notifications|Notifications|الإشعارات
noNotifications|3 départs à préparer aujourd’hui — exemple.|3 pickups to prepare today — sample.|3 عمليات استلام اليوم — مثال.
visitSite|Voir le site|Visit website|عرض الموقع
week|Semaine|Week|أسبوع
month|Mois|Month|شهر
day|Jour|Day|يوم
cost|Coût|Cost|التكلفة
oil|Vidange|Oil change|تغيير الزيت
tyres|Pneumatiques|Tyre replacement|تغيير الإطارات
inspection|Inspection générale|General inspection|فحص عام
service|Révision annuelle|Annual service|صيانة سنوية
cleaning|Nettoyage|Cleaning|تنظيف
insurance|Assurance et protection|Insurance and protection|التأمين والحماية
technical|Contrôle technique|Technical inspection|الفحص الفني
summer|Saison estivale|Summer season|موسم الصيف
winter|Saison hivernale|Winter season|موسم الشتاء
holiday|Périodes de fêtes|Holiday periods|العطلات
weekend|Offres week-end|Weekend offers|عروض نهاية الأسبوع
early|Réservation anticipée|Early booking|حجز مبكر
weekly|Location à la semaine|Weekly rental|إيجار أسبوعي
monthly|Location au mois|Monthly rental|إيجار شهري
welcomeOffer|Bienvenue en Tunisie|Welcome to Tunisia|مرحباً بك في تونس
weekOffer|Une semaine de liberté|A week of freedom|أسبوع من الحرية
monthOffer|Prenez votre temps|Take your time|خذ وقتك
earlyOffer|L’avenir vous sourit|Plan something wonderful|خطط لرحلة رائعة
coastOffer|L’appel de la Méditerranée|The Mediterranean awaits|المتوسط ينتظرك
familyOffer|Ensemble, plus loin|Further, together|معاً إلى أبعد
terms|Conditions générales|Terms and conditions|الشروط والأحكام
privacy|Confidentialité|Privacy policy|سياسة الخصوصية
cancellation|Politique d’annulation|Cancellation policy|سياسة الإلغاء
requirements|Conditions de location|Rental requirements|شروط الإيجار
airport|Location à l’aéroport|Airport car rental|إيجار في المطار
long-term|Location longue durée|Long-term rental|إيجار طويل المدة
policyNote|Contenu illustratif à valider par l’entreprise et ses conseils juridiques avant publication commerciale.|Illustrative content requiring business and legal approval before commercial publication.|محتوى توضيحي يتطلب موافقة الشركة والمراجعة القانونية قبل النشر التجاري.
aboutText|Née d’une passion pour la Tunisie, TuniDrive imagine une mobilité simple, accueillante et accessible. De Tunis à Djerba, notre réseau fictif vous accompagne à chaque étape.|Born from a love of Tunisia, TuniDrive imagines simple, welcoming mobility. From Tunis to Djerba, our fictional network supports every stage of your journey.|انطلقت TuniDrive من حب تونس لتقدم تنقلاً بسيطاً ومريحاً. من تونس إلى جربة، ترافقك شبكتنا الافتراضية في كل مرحلة.
contactText|Une question sur votre voyage ? Découvrez notre accueil personnalisé grâce à ce formulaire de démonstration.|A question about your journey? Try our personalised service through this demonstration form.|لديك سؤال عن رحلتك؟ جرّب خدمتنا عبر هذا النموذج التجريبي.
message|Votre message fictif|Your fictional message|رسالتك الافتراضية
send|Envoyer la demande démo|Send demo request|إرسال طلب تجريبي
included|Inclus dans votre location|Included with your rental|مشمول في الإيجار
deposit|Dépôt de garantie|Security deposit|مبلغ الضمان
mileage|Kilométrage quotidien|Daily mileage|المسافة اليومية
related|À découvrir aussi|You may also like|قد يعجبك أيضاً
illustration|Illustration de catégorie, modèle non contractuel|Category illustration, not an exact model image|رسم توضيحي للفئة وليس صورة مطابقة للطراز
hours|Horaires d’ouverture|Opening hours|ساعات العمل
address|Adresse illustrative|Sample address|عنوان افتراضي
newsletterDone|Inscription simulée. Aucun e-mail ne sera envoyé.|Demo subscription recorded. No email will be sent.|تم تسجيل اشتراك تجريبي. لن يتم إرسال بريد.
emailDone|Confirmation e-mail simulée.|Email confirmation simulated.|تمت محاكاة التأكيد بالبريد.
whatsappDone|Confirmation WhatsApp simulée.|WhatsApp confirmation simulated.|تمت محاكاة تأكيد واتساب.
empty|Aucun enregistrement pour le moment.|No records yet.|لا سجلات حالياً.
notFound|Cette page est introuvable.|This page could not be found.|الصفحة غير موجودة.
period|Période|Period|الفترة
notes|Notes|Notes|ملاحظات
rulesText|Âge minimum indicatif : 21 ans. Permis valide depuis 2 ans. Présentation de documents en agence uniquement ; aucun document réel ne doit être saisi dans cette démo.|Illustrative minimum age: 21. Licence held for 2 years. Documents checked at the location only; never submit real documents in this demo.|الحد الأدنى التوضيحي للعمر 21 سنة ورخصة منذ سنتين. تُفحص المستندات في الوكالة فقط؛ لا تقدم مستندات حقيقية هنا.
insuranceText|Protection de base incluse avec franchise. La protection premium réduit le dépôt illustratif à 200 TND. Les exclusions et garanties finales seront définies par le contrat commercial.|Basic cover is included with an excess. Premium cover reduces the illustrative deposit to 200 TND. Final exclusions and cover will be set out in the commercial contract.|الحماية الأساسية مشمولة مع تحمل جزئي. الحماية الشاملة تخفض الضمان التوضيحي إلى 200 دينار. التغطية النهائية تحدد في العقد.
cancellationText|Exemple : annulation sans frais jusqu’à 48 h avant le départ. Après ce délai, une journée pourrait être retenue. Aucun frais réel n’est facturé dans cette démo.|Example: free cancellation up to 48 hours before pickup. Later cancellations may incur one day’s charge. No real fees are charged in this demo.|مثال: إلغاء مجاني قبل 48 ساعة. قد تُحتسب تكلفة يوم بعد ذلك. لا توجد رسوم حقيقية هنا.
privacyText|Cette démo utilise uniquement un état temporaire dans le navigateur. Aucun compte réel, paiement, document ou message n’est transmis. Un rechargement réinitialise les modifications.|This demo uses temporary browser memory only. No real account, payment, document or message is transmitted. Reloading resets changes.|يستخدم العرض ذاكرة المتصفح المؤقتة فقط. لا تُرسل حسابات أو دفعات أو مستندات أو رسائل حقيقية. إعادة التحميل تعيد البيانات.
termsText|Les véhicules, tarifs, disponibilités et coordonnées présentés sont fictifs. Toute réservation est une simulation sans engagement. Les conditions définitives seront établies pour la version WordPress de production.|Vehicles, prices, availability and contacts are fictional. Reservations are non-binding simulations. Final terms will be prepared for the production WordPress implementation.|السيارات والأسعار والتوفر وبيانات الاتصال افتراضية. الحجوزات محاكاة غير ملزمة. الشروط النهائية ستُعد لنسخة WordPress الإنتاجية.
longText|Pour une semaine, un mois ou davantage, adaptez votre mobilité à votre séjour. Les exemples de remises vont de 15 % à la semaine à 25 % au mois. Contactez notre équipe fictive pour une proposition.|For a week, a month or longer, match your mobility to your stay. Example discounts range from 15% weekly to 25% monthly. Contact our fictional team for a proposal.|لأسبوع أو شهر أو أكثر، اختر ما يناسب إقامتك. خصومات توضيحية من 15٪ أسبوعياً إلى 25٪ شهرياً. تواصل مع فريقنا الافتراضي.
'''
data={x:{} for x in ['fr','en','ar']}
for row in rows.strip().split('\n'):
 k,*vals=row.split('|')
 for lang,val in zip(data,vals):data[lang][k]=val
qs=[('Quels documents sont nécessaires ?','Which documents are required?','ما المستندات المطلوبة؟','rulesText'),('Puis-je annuler ma réservation ?','Can I cancel my booking?','هل يمكنني إلغاء الحجز؟','cancellationText'),('L’assurance est-elle incluse ?','Is insurance included?','هل التأمين مشمول؟','insuranceText'),('Les paiements sont-ils réels ?','Are payments real?','هل الدفع حقيقي؟','demoNote'),('Où récupérer ma voiture ?','Where can I pick up my car?','أين أستلم السيارة؟','locationText'),('Quel est le dépôt de garantie ?','What is the security deposit?','ما مبلغ الضمان؟','insuranceText'),('Quel âge faut-il avoir ?','What is the minimum age?','ما الحد الأدنى للعمر؟','rulesText'),('Proposez-vous la longue durée ?','Do you offer long-term rentals?','هل تقدمون إيجاراً طويلاً؟','longText'),('Mes données sont-elles conservées ?','Is my data stored?','هل يتم حفظ بياناتي؟','privacyText'),('Puis-je réserver à l’aéroport ?','Can I book at the airport?','هل يمكن الحجز في المطار؟','airportText'),('Comment vous contacter ?','How can I contact you?','كيف أتواصل معكم؟','contactText'),('Les tarifs sont-ils définitifs ?','Are these final prices?','هل الأسعار نهائية؟','termsText')]
for i,(*q,a) in enumerate(qs):
 for j,lang in enumerate(data):data[lang][f'faqQ{i+1}']=q[j];data[lang][f'faqA{i+1}']=data[lang][a]
for lang,d in data.items():pathlib.Path('src/locales/'+lang+'.json').write_text(json.dumps(d,ensure_ascii=False,indent=2))
