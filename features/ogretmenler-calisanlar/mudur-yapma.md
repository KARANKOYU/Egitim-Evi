# Öğretmenler ve çalışanlar · Müdür yap

**Durum:** Tasarlandı — henüz kodda yok

Okulun müdürünün, okuldaki bir çalışanı kimsenin onayını beklemeden, o an gelen doğrulama koduyla okulun müdürlerinden biri
yapması.

## Ne işe yarar

Kullanıcının istekleri: 28 Ağustos — müdür "istediği öğretmeni müdüre terfi ettirebilsin"; 29 Eylül — "onay bekleme değil, müdür
atayarak". Okulda birden çok müdür olabilir ve hepsi eşit, tam yetkilidir ([Birden çok müdür](birden-cok-mudur.md)). Okulun müdürü
yeni bir müdürü yöneticiyi beklemeden kendisi atar; güvence olarak o an doğrulama kodu istenir, işlem kaydına yazılır, yöneticiye
ve okulun öbür müdürlerine bildirim gider.

**Müdür atamanın tek yolu** (29 Eylül, mantık denetimi 21, onaylı): kişi önce kişi koduyla okula **çalışan** olarak eklenir
([Kodla ekleme](kodla-ekleme.md)), sonra müdür Çalışanlar listesinde onun satırından **"Müdür yap"** der. Rolsüz çalışan da müdür
yapılabilir. Yönetici ve destek /duzenle sayfasından kişi koduyla müdür atamaya ayrıca devam eder
([Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md)).

**Bugün kodda yok:** okulun tek müdürü vardır ve onu yalnız yönetici, okulu açarken kişi koduyla atar ([Okul açma](../yonetim/okul-acma.md)).
Müdürün okul içinden kimseyi müdür yapma yolu yoktur; hazır "Müdür Yardımcısı" şablonu müdür değil, ek yetkili bir roldür.

## Nereden açılır

Tasarımda: **"Çalışanlar"** → kişinin satırı → kişi penceresinde **"Müdürlük"** satırı: "Müdür yap — Onay beklemez; senin hesabına
gelen doğrulama koduyla hemen olur." ve **"Müdür yap"** düğmesi ([Hesap penceresi](hesap-penceresi.md)). Kişi zaten müdürse aynı
satırda "Okulun müdürlerinden · bütün yetkiler" ve **"Müdür"** etiketi durur.

## Adım adım

### Müdür

Tasarımda (Tasarım 1 önizlemesi):

1. **"Çalışanlar"**da kişinin satırına bas, pencerede **"Müdür yap"**a bas.
2. Pencere **"Müdür yap · Ayşe Kaya"**: "Ayşe Kaya okulun müdürlerinden biri olur ve müdürün bütün yetkilerini alır. Öbür müdürün ya
   da kişinin onayı beklenmez."
3. Aynı anda e-postana 6 haneli kod gider. **"Doğrulama kodu"** kutusu (altı nokta), altında "6 haneli kod <maskeli e-posta
   adresin> adresine gönderildi." ve **"Yeniden gönder (60 sn)"**: 60 saniye geri sayar, sonra **"Yeniden gönder"** basılabilir
   olur ("Yeni kod e-postana gönderildi.").
4. Kodu yaz, **"Onayla, müdür yap"**a bas. Kod 6 rakam değilse: "E-postana gelen 6 haneli kodu yaz."
5. Olunca: "Ayşe Kaya artık okulun müdürlerinden." Pencere kapanır; kişinin satırında **"Müdür"** etiketi, sayfanın üstündeki
   **"Müdürler"** bölümünde yeni satır: "Müdür · "Müdür yap" ile eklendi". İşlem kaydına "müdür atadı — Ayşe Kaya · doğrulama
   koduyla" düşer.
6. Vazgeçmek için **"Vazgeç"**.

Tanımdaki kurallar (önizlemenin gösterdiğinden fazlası):

- Kod e-postaya gider; doğrulama uygulaması kuruluysa onun kodu da olur. Kod **10 dakika** geçerlidir ve yalnız bu iş içindir
  (başka bir önemli işte kullanılamaz) ([Önemli işlerde çift doğrulama](../egitim-yili/cift-dogrulama.md)). Tanım "Müdür yap" için
  önemli işlerin ortak çift doğrulama kapısını gösterir. Tasarım 1'de o kapının ortak penceresi ("Doğrulama kodu"; yedek yükleme,
  yeni yıl, toplu şifre listesi kullanır) kodun nereden geleceğini seçtirir: **"E-posta"** ya da **"Doğrulama uygulaması"**; ama
  önizlemede "Müdür yap" kendi penceresini kullanır ve yalnız e-posta kodu sorar (HTML işinde birleştirilecek; açık nokta).
- Kodsuz istek sunucuda reddedilir (403, yeniden doğrulama istenir).
- Bildirim: **yöneticiye** ve okulun **öbür müdürlerine** (metinler tanımda yazılı değil).

### Çalışan (müdür yapılan kişi)

Tasarımda:

1. Hesabında hemen **"Müdür · Test Ortaokulu"** oturumu belirir (Portallarım / Oturumlarım). Öğretmen oturumun kalır: aynı okulda
   ayrıca müdür oturumu açılır (28 Eylül önerisi; 29 Eylül'de karar oldu).
2. Müdür oturumunda okulun bütün bölümleri ve müdürün bütün yetkileri açıktır; okulun müdürüne giden her bildirim artık sana da
   gelir.
3. Müdürlüğün ilk **7 günü** "ortak karar" başlatamaz ve onaylayamazsın ([Ortak karar](ortak-karar.md)).
4. E-posta adresin yoksa müdür ana sayfasında "E-posta eklemek ister misin?" şeridi çıkar: "Şifreni unutursan sıfırlama bağlantısı,
   önemli işlerde de doğrulama kodu bu adrese gelir." — **"Sonra"** / **"Ekle"** ([E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md)).

### Yönetici ve destek

Tasarımda:

1. Bildirim gelir: hangi okulda kim, kimi müdür yaptı.
2. Atamadan sonraki **7 gün** içinde atamayı **tek tıkla geri alabilir** (atama bildirimindeki bağlantıyla; 29 Eylül, mantık
   denetimi 23 — cevapsız kaldı, öneriyle karar verildi).
3. Kendileri de /duzenle/okul/<okul> sayfasından kişi koduyla müdür ekler ([Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md)).

## Kurallar ve sınırlar

- **Yalnız müdür:** müdür yapmak bir role verilemez (şablona da konamaz; "Müdür atama, ortak karar ve okulu kapatma role verilemez.").
  Müdür Yardımcısı da dahil hiçbir özel rol bu düğmeyi görmez.
- **Yalnız okulun çalışanı:** kişi önce okula kişi koduyla eklenmiş olmalı; dışarıdan biri doğrudan müdür yapılamaz.
- **Onay yok:** kişinin, öbür müdürlerin ya da yöneticinin onayı beklenmez (kullanıcı 29 Eylül: "onay bekleme değil").
- **Doğrulama kodu şart:** kod 10 dakika geçerli ve işe bağlı; e-postası ve doğrulama uygulaması olmayan müdür bu işi yapamaz
  (önemli işlerin genel kuralı).
- **Geri alma:** müdürlükten çıkarma ortak karardır ([Ortak karar](ortak-karar.md)); kişi kendi isteğiyle de ayrılabilir
  ([Birden çok müdür](birden-cok-mudur.md)). İlk 7 günde yönetici ya da destek atamayı tek tıkla geri alır.
- **İşlem kaydı:** kim, kimi, ne zaman (okulun işlem kaydında; [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **10 okul sınırı** değişmez: kişi zaten bu okulda çalışan olduğu için müdür olmak yeni okul saymaz.
- **Açık noktalar:** bildirim metinleri; tanımdaki "öğretmen portalı kalır, ayrıca müdür portalı açılır" ile bugünkü "bir okulda tek
  rol" kuralının nasıl birleşeceği (veri modeli) kodlamada çözülecek.

## Kardeşler ve ilgili

**Kardeşler:** [Birden çok müdür](birden-cok-mudur.md) · [Ortak karar](ortak-karar.md) · [Kodla ekleme](kodla-ekleme.md) ·
[Rolsüz çalışan](rolsuz-calisan.md) · [Hesap penceresi](hesap-penceresi.md) · [Öğretmenler ve çalışanlar listesi](liste.md).

**İlgili:**

- [Önemli işlerde çift doğrulama](../egitim-yili/cift-dogrulama.md), [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md).
- [Okul açma](../yonetim/okul-acma.md), [Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md), [Müdürler](../yonetim/mudurler.md).
- [Portallarım](../portallar/portallarim.md), [Kişi kodu](../portallar/kisi-kodu.md).
- [E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md).
- [SSS](../acilis-sayfasi/sss.md) — "Müdür yardımcısı ya da rehber öğretmen gibi görevler nasıl verilir?" (tasarımdaki cevapta
  "Müdür yap").

## Kod tarafı

Henüz kodda yok. Bugünkü davranışın yerleri:

- [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md) — yöneticinin okulu açarken kişi koduyla müdür yapması
  (`okul-ac`, `kisi-bul`); okul zaten kayıtlı ve müdürü varsa "Bu okul zaten kayıtlı ve müdürü var."
- [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `ogretmen-ekle`: kişi bu okulda zaten müdürse "Bu kişi okulunda
  zaten müdür."
- [sunucu/yetki.md](../../sunucu/yetki.md) — müdür bütün yetkileri taşır; şablonlarda müdürlük yok.
- [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `okulunMuduru` (bugün tek müdür varsayımı).
- Testler (kodlanınca, tanım): müdür müdür atar (onaysız); öğretmen ya da özel rol atayamaz; çift doğrulamasız 403;
  [testler/test-rol.md](../../testler/test-rol.md) ve çoklu müdür testleri.

## Sık sorulanlar

- **Müdür yardımcısı müdür sayılır mı?** Hayır; "Müdür yardımcısı" bir özel roldür, yetkileri müdürün seçtikleridir. Tasarımda
  gerçekten müdür yapmak için "Müdür yap" kullanılır.
- **Müdür yaparken yöneticinin onayı gerekir mi?** Hayır. Yönetici yalnız bildirim alır; ilk 7 gün içinde gerekirse geri alır.
- **Okulun son müdürüyüm, ayrılmak istiyorum.** Önce bir çalışanı "Müdür yap" ile müdür yap; son müdür ayrılamaz
  ([Birden çok müdür](birden-cok-mudur.md)). Hesabını silmek ise her zaman mümkündür (tasarım).

## Sırada

- Paneller ve birden çok müdür (iş 5) ve çalışan olarak ekleme (iş 2): "Müdür yap", doğrulama kodu, bildirimler, işlem kaydı, 7 gün
  kuralı.
- Yıl geçişi (iş 9): önemli işlerde çift doğrulama penceresi (ortak).
