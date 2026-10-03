# Giriş ve hesap · Doğrulama uygulaması

**Durum:** Tasarlandı — henüz kodda yok.

Girişte e-posta kodu yerine telefondaki doğrulama uygulamasının (Google Authenticator, Microsoft Authenticator, Oracle Mobile Authenticator ya da Eğitim Evi uygulamasının "Doğrulayıcı"sı) 30 saniyede bir değişen 6 haneli kodu; yöneticide ve destekte zorunlu, öbür hesaplarda isteğe bağlı.

## Ne işe yarar

E-posta hesabı ele geçse bile panele ya da hesaba girilemesin. Kullanıcı 27 Eylül'de önerilerden "Yönetici ve destek için
doğrulama uygulaması (TOTP)" maddesini seçti ve ekledi: "bu GitHub'da da vardı, Oracle doğrulama yüklü, onunla okudum". Aynı
gün tanım genişletildi: bütün yetişkin hesapları açabilir; yönetici için zorunlu. 29 Eylül'de öğrenciye de isteğe bağlı açıldı
("altı haneli veya authenticator her neyse işte, o şifre değişince de işlesin"). SMS yok (tanımda: ücretli, SIM kopyalama
riski; kullanıcı da 28 Ağustos'ta iki adımlı giriş konuşulurken "bir phone number falan istemesin" demişti).

## Nereden açılır

- Ayarlar → Şifre ve güvenlik → **"Doğrulama uygulaması"** satırı ("kurulu değil" · **"Kur"**; kuruluysa "Açık · <tarih>'dan
  beri" · **"Yönet"**) ([Güvenlik](../ayarlar/guvenlik.md)).
- Yöneticide kurulu değilse girişten hemen sonra kurulum ekranı kendiliğinden açılır
  ([Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md)).
- Müdürün ana sayfasında ve Ayarlar'ında kapatılabilir **"Hesabını daha güvenli yap"** kartı (öneri kartı).
- Android uygulamasında: Ayarlar → Güvenlik → "Bu telefonu doğrulayıcı yap" ([Doğrulayıcı](../uygulama/dogrulayici.md)).

## Adım adım

### Kurmak (veli, öğretmen, çalışan, müdür, eğitmen, öğrenci; yönetici ve destek için zorunlu)

Tasarım 1 önizlemesindeki ekranlar:

1. Ayarlar → Şifre ve güvenlik → "Doğrulama uygulaması" satırında **"Kur"**. Satırın altında: "Google, Microsoft ya da Oracle
   Authenticator ile 6 haneli kod".
2. Önce **"Kimliğini doğrula"** ekranı: "Doğrulama uygulamasını kurmak için önce şifreni yaz." → "Şifre:" → **"Doğrula ve devam
   et"** ([Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md)).
3. **"Doğrulama uygulamasını kur"** penceresi, üç adım:
   1. "Telefonunda Google Authenticator, Microsoft Authenticator ya da Oracle Mobile Authenticator'ı aç."
   2. "Bu QR kodu okut ya da anahtarı elle yaz."
   3. "Uygulamanın gösterdiği 6 haneli kodu aşağıya yaz."
   Altında QR kodu (altında "Eğitim Evi · @kullaniciadi"), "Anahtar:" satırında 4'erli gruplu gizli anahtar ve **"Kopyala"**,
   "Uygulamadaki kod:" kutusu (yer tutucu "6 rakam"). Düğmeler **"Vazgeç"** ve **"Doğrula"**. Kod 6 rakam değilse
   "Uygulamanın gösterdiği 6 haneli kodu yaz."
4. Kod doğrulanınca **"Kurtarma kodların"** penceresi: "Telefonunu kaybedersen bu kodlardan biriyle girersin. Her kod **bir kez**
   kullanılır. Kodları bir daha gösteremeyiz; şimdi kaydet." 10 kod (numaralı liste), **"Kopyala"** ve **"İndir (.txt)"**
   (`egitim-evi-kurtarma-kodlari.txt`), **"Bu kodları güvenli bir yere kaydettim"** kutusu; kutu işaretlenmeden **"Bitti"**
   basılmaz.
5. "Bitti": "Doğrulama uygulaması açıldı; girişte ve önemli işlerde kodu sorulacak."

### Yönetmek

"Yönet" penceresi: "Durum: Açık · <tarih>'dan beri", "Kurtarma kodu: N / 10 kaldı" ve "Girişte ve önemli işlerde (hesap silme,
verilerini indirme, oturumları kapatma) uygulamanın 6 haneli kodu sorulur." Düğmeler:

- **"Yeni kurtarma kodları"** — önce kimlik doğrulama; yeni 10 kod; "Yeni kurtarma kodların kaydedildi; eskileri artık geçmez."
- **"Kaldır"** (kırmızı) — önce kimlik doğrulama; "Doğrulama uygulaması kaldırıldı; girişte yine e-posta kodu sorulur." (yönetici
  ve destek kaldıramaz: zorunlu).
- **"Kapat"**.

### Girişte kullanmak

1. Kullanıcı adı ya da e-posta ve şifreyle gir ([Giriş](giris.md)).
2. Uygulama kuruluysa e-postana kod gitmez; uygulamanın o anki 6 haneli kodunu yazarsın.
3. Telefonun yanında değilse kurtarma kodlarından birini yazarsın; o kod bir daha geçmez.
4. Aynı kod iki kez kabul edilmez; 5 yanlış kodda bugünkü kilit kuralları geçerli
   ([Hatalı giriş ve kilit](hatali-giris-ve-kilit.md)).

Tasarım 1 önizlemesinde girişteki uygulama kodu ekranı ayrıca çizilmedi (önizlemenin kod ekranı e-posta kodunu gösterir);
kural tanımdadır.

### Önemli işlerde

Uygulama kuruluysa önemli işlerde (okul yedeğini geri yükleme, yeni yıl açma, okul silme, hesap silme, toplu giriş bilgisi
dağıtma; Tasarım 1'de ayrıca verileri indirme, oturumları kapatma, okuldan ayrılma) e-posta kodu yerine uygulamanın kodu
sorulur ([Çift doğrulama](../egitim-yili/cift-dogrulama.md)). Tasarım 1'deki "Kimliğini doğrula" ekranında şifrenin altında
"Doğrulama kodu:" kutusu çıkar; boşsa "Uygulamadaki 6 haneli kodu yaz."

### Yönetici

- **Zorunlu** (site ayarı değil, her zaman). Kurulu değilse girişten sonra yalnız kurulum ekranı açılır; panel, panel uçları ve
  yönetim çerezi kurulum bitene kadar yoktur.
- İlk yönetici (yönetici dosyasından ya da varsayılan) ilk girişte önce şifresini değiştirir, sonra uygulamayı kurar
  ([İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md)).
- Kendi kurtarma yolu: kurtarma kodları; hepsi kaybolursa sunucudaki yönetici dosyasında kendi satırına `"totpSifirla": true`
  yazılır (dosya okununca bir kez sıfırlanır, işlem kaydına yazılır, e-posta bildirimi gider)
  ([Yönetici dosyası](../yonetim/yonetici-dosyasi.md)).
- Bir destekçinin ya da başka bir yetişkinin uygulamasını sıfırlar (telefon kayboldu): hesap sayfasında "doğrulama uygulamasını
  sıfırla"; işlem kaydına yazılır, kişiye e-posta gider ([Hesaba müdahale](../yonetim/hesaba-mudahale.md)).

### Destek

Zorunlu (önerildi; kullanıcı itiraz ederse site ayarıyla kapatılabilir). Kurulum ve giriş yöneticiyle aynı
([Destek ekibi](../destek/destek-ekibi.md)).

### Müdür

İsteğe bağlı ama önerilir: ana sayfada ve Ayarlar'da kapatılabilir "Hesabını daha güvenli yap" kartı. (Tasarım 1'in Ayarlar'ında
müdürün iki adımlı giriş satırı "Açık — müdürlerde zorunlu · kod doğrulama uygulamasından" görünür; yani e-posta kodu yerine
uygulama kodu.)

### Öğretmen, veli, çalışan, eğitmen

İsterse açar. Okulun ortak bilgisayarında e-postası açık olmayan öğretmen için asıl çözüm budur: kod telefondan okunur, e-posta
gerekmez.

### Öğrenci

İsteğe bağlı açar (e-posta kodu ya da uygulama). Açtıktan sonra okul, yönetici ya da destek şifresini değiştirse de açık kalır;
yalnız öğrenci kapatır ([İki adımlı giriş](iki-adimli-giris.md)).

### Servisçi ve tahta

Servisçinin (e-postası yoksa) iki adımlı girişi yoktur; tasarımda doğrulama uygulaması ondan da istenmez. Tahtada iki adım yok.

## Kurallar ve sınırlar

- **Standart**: TOTP (RFC 6238), SHA1, 6 hane, 30 saniye, ±1 adım pay. Kurulum bağlantısı
  `otpauth://totp/Eğitim Evi:<e-posta>?secret=…&issuer=Eğitim Evi`.
- **QR kodu** sunucunun kendi üreticisiyle (dış paket yok) çizilir; elle yazmak için gizli anahtar Base32, 4'erli gruplu.
- **Kurtarma kodları**: 10 adet, tek kullanımlık, bir kez gösterilir; sunucuda yalnız özetleri tutulur.
- **Tekrar engeli**: aynı kod iki kez kabul edilmez.
- **Gizli anahtar** veritabanında şifreli saklanır (sunucu anahtarı ayrı bir dosyada, depoya girmez); yedekte nasıl taşındığı
  kurulum belgesine yazılır.
- **Yönetici ve destek için zorunlu**; müdürde önerilir; öbür yetişkinlerde ve öğrencide isteğe bağlı.
- **Şifre değişince kapanmaz**; yalnız kişinin kendisi (ya da kimlik doğrulamasıyla yönetici/destek) kapatır veya sıfırlar.
- **SMS yok.** Tasarım 1'in Ayarlar'ındaki "Kod nereye: E-posta / SMS" seçimi kullanıcının sözüyle çelişir
  ([İki adımlı giriş](iki-adimli-giris.md)).
- **Eğitim Evi'nin Android uygulaması da doğrulayıcıdır**: girişsiz açılan "Doğrulayıcı" ekranı (telefon kilidiyle), Eğitim Evi
  hesabı QR'sız eklenir, başka hesaplar (GitHub, Google…) `otpauth://` bağlantısıyla; anahtarlar telefonda şifreli durur,
  sunucuya gitmez, ekran görüntüsü alınamaz. iPhone'da yok; orada Google ya da Microsoft Authenticator önerilir
  ([Doğrulayıcı](../uygulama/dogrulayici.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [İki adımlı giriş](iki-adimli-giris.md) — e-posta kodu; uygulama kurulunca onun yerine geçen adım.
- [Giriş](giris.md), [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md).
- [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md) — ilk yöneticide önce şifre, sonra uygulama.
- [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md) — "Kimliğini doğrula" ekranı.

**İlgili:**

- [Güvenlik](../ayarlar/guvenlik.md), [Açık oturumlar](../ayarlar/acik-oturumlar.md) — Ayarlar'daki satırlar.
- [Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md), [Hesaba müdahale](../yonetim/hesaba-mudahale.md),
  [Yönetici dosyası](../yonetim/yonetici-dosyasi.md).
- [Çift doğrulama](../egitim-yili/cift-dogrulama.md) — önemli işlerde kod.
- [Doğrulayıcı](../uygulama/dogrulayici.md) — Android uygulamasındaki üretici.

## Kod tarafı

Bugün kodda yok. Tanımlar: Sistem işi (doğrulama uygulaması, panel rollerinde zorunluluk, bütün yetişkinlere açılması),
Android uygulaması işi (doğrulayıcı), öğrenci portalı işinin 6. kararı (öğrenciye isteğe bağlı). Kodlanınca değişecek yerler:

- Sunucu: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) (`girisKoduDogrula`'nın yanına uygulama kodu ve kurtarma kodu),
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`POST /api/login` ve `/login/dogrula`), yeni QR üretici
  (`sunucu/yardimci/qr.js`, tanımdaki ad).
- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (kod ekranı),
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) (`girisSonrasi` sırasına kurulum
  kapısı), [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (kodlanınca bölüm eklenecek).

## Sık sorulanlar

- **Hangi uygulamayı kullanayım?** Google Authenticator, Microsoft Authenticator ya da Oracle Mobile Authenticator; Android'de
  Eğitim Evi uygulamasının "Doğrulayıcı"sı da olur.
- **Telefonumu kaybettim.** Kurtarma kodlarından biriyle gir, sonra uygulamayı yeniden kur. Kodların da yoksa yönetici ya da
  destek kimliğini doğrulayıp sıfırlar.
- **SMS ile kod alabilir miyim?** Hayır; SMS kullanılmaz.
- **Şifremi okul değiştirdi, uygulama hâlâ soruluyor mu?** Evet; şifre değişikliği iki adımlı doğrulamayı kapatmaz.

## Sırada

- Sistem: doğrulama uygulaması (TOTP), panel rollerinde zorunlu, bütün yetişkinlere isteğe bağlı; kurtarma kodları;
  `totpSifirla`.
- Android yerel uygulama: doğrulayıcı.
- Tek kişi tek hesap + portallar öğrencide de: öğrenciye isteğe bağlı iki adım (karar 6).
- Yıl geçişi: önemli işlerde çift doğrulamanın uygulama koduna bağlanması.
- HTML (Tasarım 1): girişteki uygulama kodu ekranı ve kurtarma kodu girişi henüz çizilmedi.
