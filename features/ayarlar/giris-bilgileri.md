# Hesap ayarları · Giriş bilgileri

**Durum:** Kodda var; tasarımda ek olarak her alanın kendi penceresi (kullanıcı adında canlı "alınmış mı" denetimi, e-postada "doğrulandı" rozeti, telefonda adlı ülke listesi ve SMS kodu adımı) ve tek kişi tek hesapla öğrencinin ve servisçinin de kendi giriş bilgilerini görmesi.

Girişte kullandığın kullanıcı adını, kodların ve sıfırlama bağlantısının gittiği e-postanı ve telefonunu mevcut şifrenle değiştirdiğin yer.

## Ne işe yarar

Kullanıcı adınla ya da e-postanla girersin; iki adımlı girişin 6 haneli kodu ve "Şifremi unuttum" bağlantısı e-postana gelir. Bu
bilgileri değiştirmek hesabın anahtarını değiştirmek demektir; bu yüzden her değişiklik **mevcut şifreni** ister (açık unutulmuş bir
cihazdan hesap ele geçirilemesin) ve yeni e-posta, ancak o adrese giden bağlantıya tıklayınca geçerli olur. Kullanıcı 26 Eylül'de
telefon için "telefon numarası +.. seçme ve ek ... ... .. .. hani + ya göre şekil alma" dedi: numara ülke koduyla yazılır.

## Nereden açılır

- **Bugün:** Ayarlar → **"Giriş bilgileri"** kartı (yalnız yetişkin hesabında ve ona bağlı öğretmen/müdür portalında)
  ([Ayarlar sayfası](hesap-ayarlari-sayfasi.md)). "E-posta eklemek ister misin?" penceresindeki **"E-posta ekle"** de buraya, E-posta
  kutusuna getirir ([E-posta ekleme önerisi](eposta-ekleme-onerisi.md)).
- **Tasarımda:** Hesap ayarları → **"Giriş bilgileri"** bölümü; profil menüsünde **"Giriş bilgileri — kullanıcı adı, e-posta,
  telefon"**.

## Adım adım

### Bugün: veli, rolsüz yetişkin, öğretmen, çalışan, müdür

Kartın düzeni:

- E-postan yoksa en üstte sarı kutu: **"Hesabında e-posta yok. Ekle: giriş kodu ve şifre sıfırlama bağlantısı oraya gelir."**
- **"Kullanıcı adı"** — en çok 30 karakter.
- **"E-posta"** — en çok 120 karakter (yer tutucu "e-posta adresin"); altında "İki adımlı giriş: her girişte bu adrese bir kod gelir.
  Yetişkin hesaplarında hep açıktır."
- **"Telefon"** — solda ülke kodu listesi ("TR +90" hazır seçili; 22 ülke), sağda numara; yazdıkça ülkenin düzenine göre gruplanır
  ("532 123 45 67"), Türkiye'de baştaki 0 atılır, başına "+49…" ya da "0049…" yapıştırırsan ülke kendiliğinden seçilir.
- **"Mevcut şifren"** — altında "Değişikliği onaylamak için."
- **"Kaydet"**.

Değiştirmek için:

1. Yalnız değiştirmek istediğin kutuyu değiştir (kullanıcı adı küçük harfe çevrilir, "İ" "i" olur).
2. **"Mevcut şifren"**i yaz, **"Kaydet"**e bas (düğme "Kaydediliyor..." olur).
3. Hiçbir kutu değişmediyse: **"Değişiklik yok."**
4. Tarayıcı önce denetler, hata ilgili kutunun altında kırmızı yazar ve ilk hatalı kutuya gidilir:
   - kullanıcı adı: "Bir kullanıcı adı belirle.", "Kullanıcı adı en az 3 karakter olmalı.", "Kullanıcı adı en fazla 30 karakter
     olabilir.", "Kullanıcı adında Türkçe harf kullanma (ç yerine c, ş yerine s gibi).", "Kullanıcı adı bir harfle başlamalı.",
     "Kullanıcı adında yalnızca harf, rakam, nokta ve alt çizgi olabilir.";
   - e-posta: "Geçerli bir e-posta adresi yaz.";
   - telefon: "Telefon numaranı yaz.", "Telefon numarasını ülke koduyla yaz.", "Türkiye numarası 10 haneli olmalı (5xx xxx xx xx).";
   - şifre boşsa: "Mevcut şifreni yaz."
5. Başarıda sayfa yeniden çizilir ve kartın altında yeşil ileti:
   - kullanıcı adı ya da telefon değiştiyse **"Bilgilerin kaydedildi."**;
   - e-posta da değiştiyse arkasına **"<maskeli adres> adresine bir bağlantı gönderdik; tıklayınca e-postan değişir."** (yalnız e-posta
     değiştiyse yalnız bu cümle). Kutuda hâlâ **eski** adres görünür; değişiklik bağlantıya tıklanınca olur
     ([E-posta onayı](../giris-hesap/eposta-onayi.md)).
6. Kullanıcı adın değişince okullardaki rol satırların da yeni adı alır; bir okulda o ad başkasındaysa o okuldaki giriş adının sonuna
   sayı eklenir. Telefonun da okullardaki rol satırlarına geçer (okul yönetimi öğretmenin telefonunu görür).

### Bugün: öğrenci, servisçi, eski düzendeki okulun açtığı öğretmen/müdür

"Giriş bilgileri" kartı yoktur. Kullanıcı adını, e-postayı, telefonu ve şifreyi okul yönetimi öğrencinin (servisçinin) **Hesap**
penceresinden değiştirir ([Hesap penceresi](../hesaplar/hesap-penceresi.md), [Şifre işlemleri](../hesaplar/sifre-islemleri.md)).
Sunucuya doğrudan istek gelse de **"Bu işlem yetişkin hesabıyla yapılır. Hesabını okul yönetimi düzenler."** der.

### Bugün: yönetici

"Giriş bilgileri" kartı yoktur; sunucu bu isteğe **"Yönetici hesabında portal seçimi yok."** der. Yöneticinin e-postası yönetici
dosyasıyla belirlenir ([Yönetici dosyası](../yonetim/yonetici-dosyasi.md)).

### Tasarımda (Tasarım 1 önizlemesi): "Giriş bilgileri" bölümü

Satırlar (bütün hesaplarda, öğrenci ve servisçi dahil):

- **"Kullanıcı adı"** — "@ad" biçiminde, **"Değiştir"**, altında "Giriş yaparken kullanırsın."
- **"E-posta"** — adres ve yanında yeşil **"doğrulandı"** rozeti ya da soluk "eklenmedi"; **"Değiştir"** / **"Ekle"**; altında
  "Şifreni unutursan sıfırlama bağlantısı buraya gelir."
- **"Telefon"** — "+90 5XX XXX XX XX" biçiminde ya da "eklenmedi"; **"Değiştir"** / **"Ekle"**; altında "Ülke koduyla; SMS ile
  doğrulanır."

Pencereler:

1. **"Kullanıcı adı"** — **"Yeni ad"** kutusu, önünde "@". Yazdıkça altında: "Şu anki kullanıcı adın", "Kullanılabilir" (yeşil) ya da
   "Bu kullanıcı adı alınmış." (kırmızı). Not: "Giriş yaparken bu adı yazarsın. Değişince öbür cihazlarındaki oturumlar açık kalır;
   bir sonraki girişte yeni adı kullanırsın." Kaydedince **"Kullanıcı adın artık @<ad>."** (aynıysa "Kullanıcı adın aynı kaldı.").
2. **"E-postanı değiştir"** (e-posta yoksa **"E-posta ekle"**) — **"Şu anki"** (varsa), **"Yeni adres"** (yazdıkça "Geçerli adres" ya da
   "Geçerli bir e-posta adresi yaz (ör. …)"), **"Şifren"**. Not: "Yeni adrese doğrulama bağlantısı gider; bağlantıya tıklayınca e-postan
   değişir. Şifreni unutursan sıfırlama bağlantısı bu adrese gelir." Düğme **"Doğrulama bağlantısı gönder"**. Şifre boşsa **"Onay için
   şifreni yaz."** Başarıda **"<adres> adresine doğrulama bağlantısı gitti."**
3. **"Telefonunu değiştir"** (yoksa **"Telefon ekle"**) — **"Cep telefonu"**: ülke listesi (**"+90 Türkiye"**, "+49 Almanya", "+31 Hollanda",
   "+44 Birleşik Krallık", "+33 Fransa", "+1 ABD / Kanada", "+994 Azerbaycan") ve numara kutusu (yer tutucu ülkenin biçimi, ör.
   "5XX XXX XX XX"). Yazdıkça numara o ülkenin biçimiyle boşluklanır; altında "Geçerli: +90 5XX XXX XX XX" ya da "Türkiye için 5 ile
   başlayan 10 haneli cep numarası yaz." gibi. Not: "Önce ülke kodunu seç; numara o ülkenin biçimiyle yazılır. Numaran yalnız okul
   yönetimine görünür; bildirimler ve şifre sıfırlama için kullanılır." (servisçinin "Telefon (velilere görünür)" satırında: "Bu numara
   servisine binen öğrencilerin velilerine görünür."). Düğme **"Kod gönder"** → altta **"SMS kodu"** kutusu açılır ("6 haneli kod"),
   "<numara> numarasına kod gönderildi" yazar, düğme **"Doğrula"** olur. Kod 6 rakam değilse **"SMS ile gelen 6 haneli kodu yaz."**
   Başarıda **"Telefonun doğrulandı: <numara>."**

## Kurallar ve sınırlar

- **Yalnız yetişkin hesabı** (ve ona bağlı okul rolü) kendi giriş bilgilerini değiştirir; değişiklik yetişkin hesabına yazılır.
- **Mevcut şifre şart**; yanlışsa Şifre kutusunun altında **"Mevcut şifre yanlış."**
- **Sıklık:** hesap başına **saatte 10** değişiklik isteği (**"Çok sık değiştirdin. Biraz sonra dene."**); e-posta değişikliği ayrıca
  **saatte 3** (**"Çok sık denedin. Biraz sonra tekrar dene."**).
- **Kullanıcı adı:** yukarıdaki biçim kuralı (sunucu ve tarayıcı aynı); site genelinde tek olmalı: **"Bu kullanıcı adı alınmış. Başka bir
  ad dene."** Aynı anda iki kişi aynı adı isterse ikincisi aynı iletiyle durur ([Kullanıcı adı](../giris-hesap/kullanici-adi.md)).
- **E-posta:** yetişkinde zorunludur, silinemez (giriş kodu ve sıfırlama oraya gider). Sunucunun iletileri (E-posta kutusunun altında):
  **"E-posta adresini yaz."**, **"E-posta adresi çok uzun."** (254'ten uzun), **"E-posta adresinde Türkçe ya da başka alfabeden harf
  olamaz (ı, ş, ğ, ü, ö, ç gibi); İngilizce harflerle yaz."**, **"Geçerli bir e-posta adresi gir."**, **"Bu e-posta başka bir hesapta
  kayıtlı."**, alan adı posta almıyorsa **""<alan adı>" alan adı e-posta almıyor."** Büyük/küçük harf ve baştaki/sondaki boşluk fark
  etmez.
- **E-posta hemen değişmez:** yeni adrese onay bağlantısı gider (24 saat geçerli, bir kez kullanılır); hesabın bekleyen eski onay
  bağlantıları silinir. Tıklanana kadar giriş kodları eski adrese gider ([E-posta onayı](../giris-hesap/eposta-onayi.md)).
- **Telefon** uluslararası biçimde saklanır (+905321234567 gibi). Sunucunun iletileri: **"Telefon numarası gerekli"**, **"Telefon
  numarasını ülke koduyla yaz (ör. +90 532 123 45 67)"**, **"Türkiye numarası 10 haneli olmalı (5xx xxx xx xx)"**. Telefon bugün
  **silinemez**, yalnız değiştirilir.
- **İşlem kaydı:** değişiklik "hesap.bilgi" olarak (değişen alanların adı) okulsuz yazılır; okul yönetimi görmez
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Bilinen açıklar (telefon kutusu, kod değiştirilmedi):** listede olmayan ülke kodu (ör. +61) kutuda bozulur; o durumda e-posta ya
  da kullanıcı adı değiştirmek bile telefon hatasıyla durabilir. "+" ya da "00" tuş tuş yazılamaz, yalnız yapıştırılır; yabancı numara
  için ülkeyi listeden seç. Öbür ülkelerde baştaki 0 atılmaz.
- **Tasarım ile kod arasındaki farklar** (kodlanırken kod kuralı ve kullanıcının sözü esas):
  - Önizlemenin kullanıcı adı penceresindeki canlı yazı "3–20 karakter; küçük harf, rakam ve nokta." der; bugünkü kural 3–30 karakter,
    harfle başlar, harf, rakam, nokta ve alt çizgi. Kullanıcının bu konuda farklı bir kararı yok; bugünkü kural geçerli.
  - Önizlemede kullanıcı adı ve telefon pencereleri şifre sormaz; bugünkü güvenlik kuralı (mevcut şifre) korunur.
  - **SMS:** önizlemede telefon SMS koduyla doğrulanır. Tanımlarda telefon doğrulaması için SMS kararı yok; iki adımlı girişte ise
    "SMS YOK (ücretli, SIM kopyalama riski)" kararı var. Kodlanmadan önce kullanıcıya sorulmalı.
- **Yönetici ve destek (tasarım):** başkasının adını, kullanıcı adını ve e-postasını hesap penceresinden değiştirebilir; e-postada
  güvence: yöneticiden o an doğrulama kodu, eski adrese "E-postan değiştirildi" bildirimi ve 7 gün "Bu ben değilim, geri al" bağlantısı,
  yeni adres bağlantıyla onaylanınca geçerli, bütün oturumlar kapanır, işlem kaydı (kullanıcı 28 Eylül)
  ([Hesaba müdahale](../yonetim/hesaba-mudahale.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Kişisel bilgiler](kisisel-bilgiler.md) ·
[Şifre değiştirme](sifre-degistirme.md) · [Şifre ve güvenlik](guvenlik.md) · [E-posta ekleme önerisi](eposta-ekleme-onerisi.md).

**İlgili:** [E-posta onayı](../giris-hesap/eposta-onayi.md), [Kullanıcı adı](../giris-hesap/kullanici-adi.md),
[Giriş](../giris-hesap/giris.md), [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md),
[Şifremi unuttum](../giris-hesap/sifremi-unuttum.md), [Hesap penceresi](../hesaplar/hesap-penceresi.md),
[Hesaba müdahale](../yonetim/hesaba-mudahale.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — `girisBilgileriKarti`, `HESAP_ALAN`,
  `EYLEMLER['benim-bilgi-kaydet']`; [public/js/parcalar/04c-telefon.md](../../public/js/parcalar/04c-telefon.md) — ülke kodlu telefon
  kutusu (`telefonOku`, `telefonSorunuTR`); [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) —
  `kullaniciAdiSorunuTR`, `EPOSTA_DESENI`.
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `POST /api/hesap/bilgi`;
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/eposta-onay` (`tur: 'eposta'`);
  [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `onayBaglantisiGonder`, `epostaAlaniVarMi`, `epostaMaskele`, `hizSinir`;
  [sunucu/ortak.md](../../sunucu/ortak.md) — `kullaniciAdiSorunu`, `epostaSorunu`, `telefonSorunu`, `normTelefon`.
- Depo: [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) (`kullaniciAdiBaskasinda`, `epostaVarMi`,
  `okuldaBosAd`, `rolSatirlariniGuncelle`), [sunucu/veri/depo/onaylar.md](../../sunucu/veri/depo/onaylar.md) (e-posta onayı).
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md)
  (e-posta değişikliği bağlantıyla), [testler/test-cakisma.md](../../testler/test-cakisma.md) (aynı ad/e-posta yarışı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kayıt kuralları", "İki adımlı giriş (2FA)").

## Sık sorulanlar

- **E-postamı değiştirdim ama eski adres görünüyor.** Yeni adrese giden bağlantıya tıklamadın; tıklayınca değişir. Bağlantı 24 saat
  geçerlidir.
- **E-postamı silebilir miyim?** Yetişkin hesabında hayır; giriş kodu ve şifre sıfırlama oraya gelir.
- **Kullanıcı adımı değiştirince öbür cihazlardan çıkar mıyım?** Hayır; bir sonraki girişte yeni adı kullanırsın.
- **Öğrenciyim, kullanıcı adımı nasıl değiştiririm?** Okul yönetimine söyle; Hesap penceresinden değiştirir.

## Sırada

- Arayüz önizlemesi / Tasarım 1 → kod: her alanın kendi penceresi, "doğrulandı" rozeti, adlı ülke listesi.
- Tek kişi tek hesap + portallar öğrencide de: öğrencinin ve servisçinin kendi hesabı; e-posta site genelinde tek.
- Kullanıcı arama + hesap penceresinde yöneticinin ve desteğin ad, kullanıcı adı ve e-posta değiştirmesi (güvenceli).
- Telefonun SMS ile doğrulanması: karar yok (kullanıcıya sorulacak).
