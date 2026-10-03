# Uygulama ve indirme · Doğrulayıcı

**Durum:** Tasarlandı — henüz kodda yok

Eğitim Evi Android uygulamasının, giriş yapmadan da açılan ve 30 saniyede bir değişen 6 haneli giriş kodlarını üreten bölümü
(Google Authenticator'ın yaptığı iş): hem Eğitim Evi hesabın hem GitHub, Google gibi başka hesapların için.

## Ne işe yarar

Doğrulama uygulaması (TOTP) açık olan hesapta girişte ve önemli işlerde e-posta kodu yerine telefondaki uygulamanın kodu sorulur
([Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md)). Kodu üretmek için ayrı bir uygulama kurmana gerek kalmasın diye
Eğitim Evi'nin kendi uygulaması da bu kodları üretir. Kullanıcının 27 Eylül sözü (yazıldığı gibi): "atchontucator u bizim app e de
eklesek? … oturum ekranına normalde giriş yap kayıt ol yazan yerde hesaba gir -> butonu vo orada athunticator … bunu github ımıda
buna bağlamak mümkün şekilde olur mu". Tanım aynı gün onaylandı: Eğitim Evi hesabı ve GitHub gibi başka hesaplar aynı yerde.

## Nereden açılır

- **Uygulamanın açılış ekranında:** "Giriş yap / Kayıt ol" yerine iki düğme: **"Hesaba gir →"** ve **"Doğrulayıcı"**.
  "Doğrulayıcı" **giriş yapmadan** açılır.
- **Eğitim Evi hesabını eklemek için** (girişliyken): **Ayarlar → Güvenlik → "Bu telefonu doğrulayıcı yap"**.
- **Başka bir hesabı eklemek için:** o sitenin gösterdiği QR kodunu telefonun kamerasıyla ya da Google Lens'le okut; açılan
  seçeneklerden **"Eğitim Evi ile aç"**. Ya da Doğrulayıcı'da **"Hesap ekle"**.
- Tanımdaki sol menüde (yorumu kullanıcıya soruldu) her durumda "Doğrulayıcı" bağlantısı ([Android uygulaması](android-uygulamasi.md)).

## Adım adım

### Herkes (giriş yapmadan)

1. Uygulamayı aç, açılış ekranında **"Doğrulayıcı"**ya dokun.
2. Telefonun kilidi sorulur (PIN, desen ya da parmak izi). Bu soruyu uygulamanın ayarlarından kapatabilirsin.
3. Hesapların listesi gelir. Her satırda:
   - yayıncı ve hesap adı (ör. "Eğitim Evi · deniz.aydin", "GitHub · ornek-kullanici");
   - kod: 6 (ya da 8) hane, üçer üçer gruplu (ör. "482 193");
   - kalan süreyi gösteren halka.
4. Bir satıra dokununca kod kopyalanır: **"Kod kopyalandı"**. Giriş ekranına yapıştırırsın. Kopyalanan kod 30 saniye sonra panodan
   silinir (Android'in izin verdiği kadar).
5. Bir satıra uzun basınca: yeniden adlandır ya da sil (silmek onay ister).

#### Başka bir hesap eklemek (GitHub, Google…)

- **QR koduyla:** hesabın sitesinde iki adımlı girişi açarken çıkan QR kodu telefonun kamerasıyla ya da Lens'le okut →
  **"Eğitim Evi ile aç"** → hesap listeye eklenir. (Uygulamanın kendi QR okuyucusu yok; şimdilik telefonun kamerası kullanılır.)
- **Elle:** Doğrulayıcı'da **"Hesap ekle"** → yayıncı, hesap adı ve **"Kurulum anahtarı"** (sitenin "QR'ı okutamıyorsan" diye
  verdiği harf dizisi; aradaki boşluklar yok sayılır, anahtar geçerli mi diye denetlenir).
- Ekleme bitince uyarı: telefonu kaybedersen o hesaba o sitenin kurtarma kodlarıyla girersin; kurtarma kodlarını sakla.

### Veli, öğretmen, çalışan, müdür ve eğitmen

Kendi Eğitim Evi hesabını doğrulayıcıya eklemek:

1. Uygulamada hesabına gir.
2. **Ayarlar → Güvenlik → "Bu telefonu doğrulayıcı yap"**.
3. QR okutman gerekmez: kurulum anahtarı sunucudan **bir kez** gelir, uygulama kendi ürettiği kodla kurulumu doğrular ve tamamlar.
4. Ekranda **10 kurtarma kodu** gösterilir; telefonu kaybedersen bunlardan biriyle girersin. Kaydet.
5. Bundan sonra Eğitim Evi'ne girerken (sitede de) ve önemli işlerde e-posta kodu yerine Doğrulayıcı'daki kodu yazarsın.

Müdüre önerilir (müdürün ana sayfasında ve Ayarlar'ında kapatılabilir "Hesabını daha güvenli yap" kartı); öbür yetişkinler isterse
açar. Sitedeki kurulum yolu (QR ile) ve girişte kodun sorulması: [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md).

### Yönetici ve destek

Senin için doğrulama uygulaması **zorunlu**dur: kurulu değilse girişten sonra yalnız kurulum ekranı açılır
([Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md)). Kodu Eğitim Evi'nin Doğrulayıcı'sından ya da Google,
Microsoft, Oracle doğrulama uygulamalarından birinden alabilirsin. Uygulamada yönetici ekranı olmasa da girip "Bu telefonu
doğrulayıcı yap" diyebilirsin.

### Öğrenci

29 Eylül kararıyla öğrenci de isterse iki adımlı girişi ve doğrulama uygulamasını açar. Uygulamanın tanımı Doğrulayıcı'yı öğrenci
için ayrıca anmıyor; tanıma göre Ayarlar → Güvenlik herkeste olduğundan aynı adımlar öğrenciye de uyar (kodlanırken netleşecek).

## Kurallar ve sınırlar

- **Standart:** TOTP (RFC 6238). Başka hesaplar için kurulum bağlantısındaki ayarlar geçerlidir: SHA1, SHA256 ya da SHA512; 6 ya da
  8 hane; 30 ya da 60 saniye. Eğitim Evi'nin kendi kodu SHA1, 6 hane, 30 saniye (sunucu bir adım önce ve sonrasını da kabul eder).
- **Saat:** kod telefonun saatiyle üretilir; telefonun saati yanlışsa kod tutmaz.
- **Kilit:** Doğrulayıcı açılırken telefonun kilidi sorulur (ayarlardan kapatılabilir).
- **Gizlilik:** hesapların gizli anahtarları telefonda, Android'in anahtar deposundaki bir anahtarla şifreli saklanır; telefonun
  yedeğine girmez, yeni telefona taşınmaz. Doğrulayıcı ekranında **ekran görüntüsü alınamaz**. Anahtarlar **sunucuya hiç
  gitmez** (Eğitim Evi hesabınınki de: sunucunun kendi kopyası zaten var, uygulama geri göndermez).
- **Telefonu kaybedersen:** Eğitim Evi hesabına kurtarma kodlarından biriyle girersin (her kod bir kez). Kodların da yoksa yönetici
  doğrulama uygulamanı sıfırlayabilir (işlem kaydına yazılır, sana e-posta gider). Başka hesaplar için o sitenin kendi kurtarma yolu.
- **iPhone'da yok:** iPhone'da Eğitim Evi'nin yerel uygulaması olmadığı için Doğrulayıcı da yok; orada Google ya da Microsoft
  Authenticator önerilir.
- **SMS yok.**
- **Tanımdaki ekran metinleri:** "Doğrulayıcı", "Hesap ekle", "Kurulum anahtarı", "Kod kopyalandı", "Hesaba gir →".
- **Tasarım 1 önizlemesi** sitenin tasarımıdır, Doğrulayıcı'yı çizmez. Önizlemedeki (bugünkü sitede henüz olmayan) "Doğrulama
  uygulamasını kur" penceresi "Telefonunda Google Authenticator, Microsoft Authenticator ya da Oracle Mobile Authenticator'ı aç."
  diyor; Eğitim Evi uygulamasını anmıyor (açık nokta: kodlanırken bu cümleye eklenebilir).

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [Android uygulaması](android-uygulamasi.md) ·
[Kendini güncelleme](kendini-guncelleme.md) · [Android geri tuşu](geri-tusu.md) · [İndir sayfası](indir-sayfasi.md).

**İlgili:** [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md) · [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md) ·
[Güvenlik](../ayarlar/guvenlik.md) · [Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md) ·
[Hesaba müdahale](../yonetim/hesaba-mudahale.md) (yöneticinin sıfırlaması) ·
[Doğrulama ekranından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md).

## Kod tarafı

Bugün kodda yok (ne Android uygulamasında ne sunucuda doğrulama uygulaması var). Kodlanınca:

- **Android deposu:** yeni Doğrulayıcı ekranları (liste, hesap ekle, ayarlar), `otpauth://` bağlantılarını açan kayıt, kilit
  sorusu; açılış ekranı `GirisSayfasi` ile `AyarlarSayfasi`'na "Güvenlik" bölümü. Testler: RFC 6238 örnek vektörleri, `otpauth`
  ayrıştırıcı (bozuk girdiler), Base32.
- **Sunucu:** doğrulama uygulaması kurulum ve doğrulama uçları (iki adımlı girişin bugünkü yeri
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md), güvenlik kuralları [sunucu/guvenlik.md](../../sunucu/guvenlik.md)).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (bölüm kodlanınca eklenecek) ve Android deposunun
  `TANITIM.md`'si.

## Sık sorulanlar

- **Google Authenticator kullanıyorum, Eğitim Evi'ninkine geçmem gerekir mi?** Hayır; ikisi aynı kodu üretir. İstediğini kullan.
- **Doğrulayıcı'yı açmak için giriş yapmam gerekir mi?** Hayır; açılış ekranındaki "Doğrulayıcı" girişsiz açılır, yalnız telefonun
  kilidi sorulur.
- **Telefonumu değiştirdim, kodlarım gelmedi.** Anahtarlar telefondan çıkmaz. Yeni telefonda Eğitim Evi'ne kurtarma koduyla gir,
  doğrulayıcıyı yeniden kur; başka hesapları o sitelerin kendi yoluyla yeniden ekle.
- **Kod "yanlış" diyor.** Telefonun saati doğru mu bak (otomatik saat açık olsun); kodun süresi dolmadan yaz.
- **iPhone'um var.** Google ya da Microsoft Authenticator kur; Eğitim Evi'nin sitesindeki QR'ı onunla okut.

## Sırada

- Android yerel uygulama işi: doğrulayıcı (TOTP üretici), açılış ekranındaki "Hesaba gir →" ve "Doğrulayıcı".
- Sistem işi: yöneticiye ve desteğe zorunlu doğrulama uygulaması, bütün yetişkinlere isteğe bağlı; sunucunun kurulum uçları.
- Çok dil işi: Doğrulayıcı metinleri de katalogdan.
