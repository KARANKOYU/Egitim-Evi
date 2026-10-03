# Hesap ayarları · Hesabımı sil

**Durum:** Kodda var; tasarımda ek olarak müdürün de hesabını silebilmesi (kullanıcının 29 Eylül kararı: kişi hesabını her zaman siler), servisçi ve eğitmende de "Hesabımı sil", öğrencide "Öğrenci hesabını okulun kapatır" notu ve onay için kutuya "SİL" yazma.

Yetişkin hesabını, çocuklarınla bağını ve okullardaki öğretmenlik rollerini kalıcı olarak sildiğin yer (KVKK silme hakkı).

## Ne işe yarar

Kullanıcı 26 Eylül'de önerilerden şunu onayladı: "Kişi kendi rolünden çıkabilmeli. Öğretmen "bu okuldan ayrıl" diyebilmeli, herkes
"hesabımı sil" diyebilmeli; bu KVKK'da silme hakkı." Yalnız bir okuldan ayrılmak istiyorsan hesabını silmen gerekmez
([Okuldan ayrılma](../portallar/okuldan-ayrilma.md)); çocuğunu hesabından çıkarmak için de "Kaldır" yeter ([Çocuklarım](../portallar/cocuklarim.md)).

## Nereden açılır

- **Bugün:** Ayarlar → en alttaki **"Hesabımı sil"** kartı (yalnız yetişkin hesabında ve ona bağlı öğretmen/müdür portalında)
  ([Ayarlar sayfası](hesap-ayarlari-sayfasi.md)).
- **Tasarımda:** Hesap ayarları → en alttaki kırmızı çerçeveli **"Hesabımı sil"** bölümü: "Hesabı sil" — "Hesabın silinir; okulun kayıtları
  okulda kalır." ve **"Hesabımı sil"** (öğrenci dışında herkeste).
- Telefon uygulamasında yok; "Ayarlar → Siteyi aç".

## Adım adım

### Bugün: veli, rolsüz yetişkin, öğretmen, çalışan

1. Ayarlar → "Hesabımı sil" kartı: "Hesabın, çocuklarınla bağın, öğretmeni olduğun okullardaki yerin ve bildirimlerin silinir; geri
   alınamaz. Verdiğin ödevler ve notlar okulda kalır. Bir okulun müdürüysen önce müdürlüğü devretmelisin."
2. **"Mevcut şifren"** kutusuna şifreni yaz. Boşsa kutunun altında **"Mevcut şifreni yaz."**
3. Kırmızı **"Hesabımı sil"**e bas.
4. Tarayıcı sorar: **"Hesabın ve bütün bilgilerin kalıcı olarak silinsin mi? Bu geri alınamaz."** — "Tamam" de.
5. Düğme "Siliniyor..." olur.
6. Silinince bu cihazın telefon bildirimi aboneliği bırakılır, oturumun kapanır ve giriş ekranında yeşil **"Hesabın ve bütün bilgilerin
   silindi."** yazar.
7. Hata olursa: şifre yanlışsa kutunun altında **"Mevcut şifre yanlış."**; öbürleri kartın altında.

Okul rolündeyken (öğretmen portalında) bassan da silinen yetişkin hesabının tamamıdır: bütün okullardaki öğretmenlik rollerin ve veli
bağların birlikte gider.

### Bugün: müdür

Bir okulun müdürüysen silinmez: **"Bir okulun müdürüsün. Hesabını silmeden önce müdürlüğü devretmek için sistem yöneticisiyle iletişime
geç."** Müdürlüğü yönetici değiştirir ([Okuldan ayrılma](../portallar/okuldan-ayrilma.md)).

### Bugün: öğrenci, servisçi, eski düzendeki okulun açtığı öğretmen/müdür, yönetici

Kart yoktur. Bu hesapları okul (yöneticiyi yönetici dosyası) yönetir; sunucu da öğrenci ve servisçiye **"Bu işlem yetişkin hesabıyla
yapılır. Hesabını okul yönetimi düzenler."**, yöneticiye **"Yönetici hesabında portal seçimi yok."** der
([Yönetici dosyası](../yonetim/yonetici-dosyasi.md)). Öğrenci hesabı okuldan ayrılınca silinmez, sınıfsız kalır; servisçi hesabını okul siler
([Hesap penceresi](../hesaplar/hesap-penceresi.md)).

### Tasarımda (Tasarım 1 önizlemesi): pencere

1. "Hesabımı sil"e basınca **"Hesabını sil"** penceresi: uyarı kutusu **"Bu işlem geri alınmaz"** — "Giriş bilgilerin silinir. Okulun
   kayıtları (notlar, devamsızlık) yasal süre boyunca okulda kalır. 7 gün içinde giriş yaparsan silme iptal olur."
2. **"Şifren"** ve **"Onay"** (yer tutucu "SİL yaz") kutuları.
3. Hatalar: **"Şifreni yaz."**, **"Onaylamak için kutuya SİL yaz."**
4. **"Vazgeç"** / kırmızı **"Hesabımı sil"**. Başarıda: **"Silme isteğin alındı; hesabın <tarih>'da silinecek. O güne kadar iptal
   edebilirsin."**
5. Bölüm artık **"Silme isteği"** gösterir: "Hesabın <tarih> tarihinde silinecek", altında "O güne kadar buradan iptal edebilir ya da
   giriş yaparak durdurabilirsin", düğme **"Silmeyi iptal et"** → **"Silme isteğin iptal edildi; hesabın duruyor."**

### Tasarımda: role göre

- **Müdür (kullanıcının 29 Eylül kararı):** kişi kendi hesabını **her zaman** silebilir; bugünkü "müdür silemez" engeli kalkar. Son müdür
  hesabını silerse okul "Müdürü yok" olur; yöneticiye ve desteğe bildirim gider, yeni müdürü yönetici ya da destek atar
  ([Kapalı okulun portalı](../portallar/kapali-okul.md), [Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md)).
  Tasarım 1 önizlemesi müdürde hâlâ eski kuralı gösterir — **"Hesabını sil"** penceresinde "Önce müdürlüğü devret": "<okul>'nun
  müdürüsün. Müdürlüğü başka birine devretmeden hesabını silersen okul sahipsiz kalır. Devir için yöneticimize Destek'ten yaz; devir
  bitince hesabını buradan silebilirsin.", düğmeler **"Kapat"** ve **"Destek'e yaz"** (Destek sayfasına götürür; "Talebine okulunun adını
  ve kişi kodunu yaz."). Geçerli olan kullanıcının kararıdır; önizleme HTML işinde düzeltilecek.
- **Öğrenci:** "Hesabımı sil" yok; "Gizlilik ve verilerim" bölümünde "Hesabını silmek — Öğrenci hesabını okulun kapatır; okul yönetimine
  söyle."
- **Servisçi, eğitmen:** tek kişi tek hesapla kendi hesaplarının sahibidirler; "Hesabımı sil" görünür.
- **Veli, öğretmen, çalışan:** bugünkü gibi; öğretmende ayrıca "Okulum → Bu okuldan ayrıl" (yalnız o okulun portalı kapanır).

## Kurallar ve sınırlar

- **Yalnız yetişkin hesabı** (bugün); şifre ve açık onay şart. Onay gelmezse **"Silmeyi onaylaman gerekiyor."**
- **Sıklık:** hesap başına saatte 5 deneme (**"Çok fazla deneme. Biraz sonra dene."**).
- **Ne silinir:** yetişkin hesabı; bütün okullardaki öğretmen rol satırları (okuldan çıkar); çocuklarınla bağların; bildirimlerin;
  oturumların (bütün cihazlarda çıkış); telefon bildirimi abonelikleri; açılış sayfasındaki yorumun
  ([Yorumu düzeltme ve silme](../yorumlar/yorumu-duzeltme-ve-silme.md)).
- **Ne kalır:** verdiğin ödevler, girdiğin notlar ve yoklamalar okulda kalır (okulun kaydı). Okuldan ayrılan öğretmenin açık ödevlerini
  müdür sonuçlandırır ([Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md)).
- **Geri alınamaz** (bugün hemen silinir). İşlem kaydına yazılmaz; okula bildirim gitmez (okuldan ayrılmada gider).
- **Bilinen küçük durum (zararsız):** silmeden sonra telefon bildirimini bırakma isteği yetkisiz döner, sessiz çıkış iki kez çalışır;
  sunucudaki abonelik hesapla zaten silinmiştir.
- **Tasarımda karar bekleyenler:**
  - Tasarım 1'deki **7 günlük bekleme** ("7 gün içinde giriş yaparsan silme iptal olur", "Silme isteği", "Silmeyi iptal et") tanımlarda
    ve kullanıcının sözlerinde yok; bugünkü kod hemen siler. Kodlanmadan önce kullanıcıya sorulmalı.
  - "SİL yaz" onayı Tasarım 1'in; tanımda yok (öneri olarak kalabilir).
  - Tasarım 1 önizlemesinde panel hesaplarında (yönetici, destek) da "Hesabımı sil" bölümü görünür; tanımlarda bunun kuralı yok.
  - **Çift doğrulama:** tanımın "önemli işler" listesindeki hesap silme, **yöneticinin** bir hesabı silmesidir
    ([Çift doğrulama](../egitim-yili/cift-dogrulama.md)); kişinin kendi hesabını silmesinde kod sorulup sorulmayacağı tanımda açık
    değil. Tasarım 1'de doğrulama uygulamasının "Yönet" penceresi "hesap silme"de uygulama kodunun sorulacağını yazar
    ([Şifre ve güvenlik](guvenlik.md)), ama "Hesabını sil" penceresi yalnız şifre ve "SİL" ister.
- **Saklama:** okulun kayıtları okulun saklama sürelerine göre durur ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Verilerimi indir](verilerimi-indir.md) (silmeden önce kopyanı al) ·
[Şifre ve güvenlik](guvenlik.md) · [Bildirim ayarları](bildirim-ayarlari.md).

**İlgili:** [Okuldan ayrılma](../portallar/okuldan-ayrilma.md), [Çocuklarım](../portallar/cocuklarim.md),
[Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md), [Kapalı okulun portalı](../portallar/kapali-okul.md),
[Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md), [Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md),
[Hesap penceresi](../hesaplar/hesap-penceresi.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md),
[Quiz verisinin saklanması](../quiz/saklama-ve-silinme.md), [Destek sayfası](../destek/destek-sayfasi.md),
[Sık sorulanlar](../acilis-sayfasi/sss.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — "Hesabımı sil" kartı,
  `EYLEMLER['benim-hesap-sil']`; [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md) —
  `bildirimAboneligiBirak`; [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — `cikisYap`.
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `POST /api/hesap/sil`.
- Depo: [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `rolSatiriniSil`, `sil` (bağlı tablolar şema
  kurallarıyla silinir; [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md) (müdürken silinemez, şifre ve onay ister, silinen hesap giremez,
  öğrenci kendi hesabını silemez).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hesap türleri ve portallar" → Bırakma ve silme).

## Sık sorulanlar

- **Hesabımı kapatmak istiyorum.** Yetişkin hesabını Ayarlar → Hesabımı sil ile kendin silebilirsin; bugün bir okulun müdürüysen önce
  müdürlüğü devretmek için Eğitim Evi yöneticisiyle görüşmen gerekir. Öğrenci ve servisçi hesabını okul yönetimi kapatır. Kişisel
  verilerinle ilgili haklarını aydınlatma metninde bulabilirsin.
- **Sildikten sonra aynı e-postayla yeniden hesap açabilir miyim?** Evet; hesap tamamen silindiği için e-posta ve kullanıcı adı boşa çıkar.
- **Verdiğim ödevler ne olur?** Okulda kalır; açık olanları müdür sonuçlandırır.

## Sırada

- Paneller … birden çok müdür: müdürün de hesabını silebilmesi, son müdür silinince "Müdürü yok" ve yöneticiye bildirim.
- Tek kişi tek hesap + portallar öğrencide de: servisçinin kendi hesabını silmesi; öğrencide okulun kapatması.
- Arayüz önizlemesi / Tasarım 1 → kod: "SİL yaz" onayı; 7 günlük bekleme için karar beklenir.
