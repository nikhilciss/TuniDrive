import json,pathlib
rows='''id|Identifiant|ID|المعرّف
vehicleId|Véhicule|Vehicle|السيارة
customerId|Client|Customer|العميل
bookingId|Réservation|Booking|الحجز
pickupLocation|Agence de départ|Pickup location|وكالة الاستلام
returnLocation|Agence de retour|Return location|وكالة الإرجاع
manufacturer|Constructeur|Manufacturer|الشركة المصنعة
model|Modèle|Model|الطراز
registration|Immatriculation fictive|Fictional registration|رقم تسجيل افتراضي
year|Année|Year|السنة
image|Image locale|Local image|صورة محلية
city|Ville|City|المدينة
airport|Service aéroport|Airport service|خدمة المطار
method|Mode de paiement|Payment method|طريقة الدفع
type|Type|Type|النوع
start|Début|Start|البداية
end|Fin|End|النهاية
adjustment|Ajustement (%)|Adjustment (%)|التعديل (٪)
discount|Remise (%)|Discount (%)|الخصم (٪)
code|Code promotionnel|Promo code|رمز العرض
rating|Évaluation|Rating|التقييم
textKey|Témoignage ou clé de traduction|Review or translation key|تقييم أو مفتاح ترجمة
titleKey|Titre ou clé de traduction|Title or translation key|عنوان أو مفتاح ترجمة
descriptionKey|Description ou clé de traduction|Description or translation key|وصف أو مفتاح ترجمة
questionKey|Question ou clé de traduction|Question or translation key|سؤال أو مفتاح ترجمة
answerKey|Réponse ou clé de traduction|Answer or translation key|إجابة أو مفتاح ترجمة
link|Lien|Link|الرابط
position|Position de l’image|Image position|موضع الصورة
description|Description|Description|الوصف
title|Titre|Title|العنوان
body|Contenu|Content|المحتوى
published|Publié|Published|منشور
draft|Brouillon|Draft|مسودة
categories|Catégories|Categories|الفئات
banners|Bannières d’accueil|Homepage banners|لافتات الرئيسية
media|Médiathèque|Media library|مكتبة الوسائط
testimonials|Témoignages|Testimonials|التقييمات
faqs|Questions fréquentes|FAQs|الأسئلة الشائعة
blog|Articles|Blog posts|المقالات
menus|Menus de navigation|Navigation menus|قوائم التنقل
footer|Pied de page|Footer|تذييل الصفحة
seo|Référencement SEO|SEO settings|إعدادات تحسين البحث
general|Général|General|عام
company|Entreprise|Company|الشركة
bookingPlugin|Plugin de réservation|Booking plugin|إضافة الحجز
currency|Devise|Currency|العملة
languages|Langues|Languages|اللغات
durationRules|Durée de location|Rental duration|مدة الإيجار
gateways|Passerelles de paiement|Payment gateways|بوابات الدفع
emailNotifications|Notifications e-mail|Email notifications|إشعارات البريد
whatsappNotifications|Notifications WhatsApp|WhatsApp notifications|إشعارات واتساب
users|Utilisateurs|Users|المستخدمون
roles|Rôles et permissions|Roles and permissions|الأدوار والصلاحيات
security|Sécurité|Security|الأمان
tagline|Signature de marque|Tagline|الشعار اللفظي
timezone|Fuseau horaire|Timezone|المنطقة الزمنية
minimumAge|Âge minimum|Minimum age|الحد الأدنى للعمر
licenceYears|Ancienneté du permis (années)|Licence held (years)|مدة الرخصة (سنوات)
minimumDays|Durée minimum (jours)|Minimum days|الحد الأدنى للأيام
maximumDays|Durée maximum (jours)|Maximum days|الحد الأقصى للأيام
decimals|Décimales|Decimal places|المنازل العشرية
defaultLanguage|Langue par défaut|Default language|اللغة الافتراضية
rtl|Langue de droite à gauche|Right-to-left language|لغة من اليمين لليسار
graceMinutes|Tolérance (minutes)|Grace period (minutes)|فترة السماح (دقائق)
freeCancellationHours|Annulation gratuite (heures)|Free cancellation (hours)|إلغاء مجاني (ساعات)
lateFeeDays|Frais tardifs (jours)|Late fee (days)|رسوم التأخير (أيام)
basicDeposit|Dépôt de base (TND)|Basic deposit (TND)|الضمان الأساسي (دينار)
premiumDeposit|Dépôt premium (TND)|Premium deposit (TND)|الضمان الشامل (دينار)
premiumPrice|Protection premium / jour (TND)|Premium cover / day (TND)|حماية شاملة / يوم (دينار)
mode|Mode|Mode|الوضع
sender|Expéditeur fictif|Fictional sender|المرسل الافتراضي
bookingConfirmation|Confirmation de réservation|Booking confirmation|تأكيد الحجز
template|Modèle de notification|Notification template|قالب الإشعار
role|Rôle|Role|الدور
administrator|Administrateur|Administrator|المشرف
manager|Responsable|Manager|المدير
authentication|Authentification|Authentication|المصادقة
persistence|Persistance|Persistence|الاستمرارية
deleteReferenced|Suppression simulée : cet élément est lié à des réservations et reste conservé pour préserver la cohérence des données.|Deletion preview: this record is linked to bookings and is retained to preserve data consistency.|معاينة الحذف: هذا السجل مرتبط بحجوزات ويُحتفظ به لضمان تناسق البيانات.
viewMode|Mode de présentation|View mode|طريقة العرض
illustrativeGallery|Galerie illustrative de la catégorie|Illustrative category gallery|معرض توضيحي للفئة
subtotal|Sous-total|Subtotal|المجموع الفرعي
extrasTotal|Total des services|Extras total|مجموع الخدمات
paymentStatus|État du paiement|Payment status|حالة الدفع
paymentMethod|Mode de paiement|Payment method|طريقة الدفع
joined|Date d’inscription|Joined|تاريخ التسجيل
imageNote|Note sur l’image|Image note|ملاحظة الصورة
popularity|Popularité|Popularity|الشعبية
vehiclePerformance|Performance des véhicules|Vehicle performance|أداء السيارات
seasonal|Tendances saisonnières|Seasonal trends|الاتجاهات الموسمية
'''
for i,lang in enumerate(['fr','en','ar']):
 p=pathlib.Path('src/locales/'+lang+'.json');d=json.loads(p.read_text())
 for row in rows.strip().split('\n'):
  key,*v=row.split('|');d[key]=v[i]
 p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
