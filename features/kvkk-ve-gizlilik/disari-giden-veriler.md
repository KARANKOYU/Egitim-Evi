# KVKK ve gizlilik · Dışarı giden veriler

**Durum:** Kodda var; tasarımda ek olarak YouTube videolarının youtube-nocookie.com'dan ve yalnız tıklayınca yüklenmesi, toplantı
bağlantılarının (Zoom, Google Meet, Teams, Jitsi) üçüncü taraf olarak aydınlatma metnine yazılması ve eklentilerin dış adreslerinin
okulun "okul eki"nde listelenmesi.

Eğitim Evi'nin verileri kendi sunucusunda tutması, ama bazı özelliklerde tarayıcının ya da sunucunun başka bir şirketin sunucusuyla
konuşması: hangi bilgi nereye gider, ne gitmez, aydınlatma metninde yazıyor mu.

## Ne işe yarar

Aydınlatma metninin 6. bölümü ("Veriler yurt dışına aktarılıyor mu?") bunun kısa hâlidir: veriler reklam, analiz ya da başka bir
amaçla hiçbir üçüncü şirkete gönderilmez; iki dış hizmet (harita resimleri, telefon bildirimi) isteğe bağlı özelliklerde devreye
girer ([Aydınlatma metni](aydinlatma-metni.md)). Bu belge ikisini ve metinde geçmeyen öbür dış bağlantıları tek yerde toplar. Sitenin
güvenlik başlığı da bunu güvenceye alır: sayfa betik ve stili yalnız kendi sunucusundan yükler, resmi yalnız kendi sunucusundan ve
OpenStreetMap'ten alır; yazı tipleri sitenin kendi klasöründedir; reklam, ziyaretçi sayacı ya da analiz betiği yoktur.

## Nereden açılır

- Aydınlatma metni, 6. bölüm.
- Giriş formunun altındaki not: "Bilgilerin Eğitim Evi'nin sunucusunda tutulur ve yalnız okulunun yetkilileri görür. Giriş bilgilerin
  Google'a ya da başka bir servise gönderilmez." ([Giriş](../giris-hesap/giris.md)).
- Her haritanın köşesindeki atıf: "© OpenStreetMap katkıda bulunanlar".
- "Google Haritalar'da aç", "Servisi Google Haritalar'da aç", "Evi Google Haritalar'da aç" ve servisçinin "Yol tarifi" düğmeleri.
- Bildirim izni isteyen tarayıcı penceresi ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).

## Adım adım

### Dış hizmetler tablosu

| Hizmet | Ne zaman | Ne gider | Ne gitmez | Aydınlatma metninde |
|---|---|---|---|---|
| **OpenStreetMap** harita resimleri (`tile.openstreetmap.org`, OpenStreetMap Vakfı, İngiltere) | Bir harita açınca: servis haritası, evini işaretleme, Çocuğumun telefonu, okulun konumu | Cihazının IP adresi ve bakılan harita bölgesi (resim isteğiyle) | Adın, hesabın, haritada işaretlenen konumlar | Evet (6. bölüm) |
| **Tarayıcının bildirim servisi** (Google, Apple, Mozilla ya da Microsoft) | Telefon bildirimini açtıysan, her bildirimde | Senin cihazının anahtarıyla şifrelenmiş bildirim; şirket içeriği okuyamaz | Bildirimin içeriği (şifreli) | Evet (6. bölüm) |
| **Eğitim Evi telefon uygulaması** | Uygulama yeni bildirimleri sorduğunda | Hiçbir şey dışarı gitmez: uygulama doğrudan Eğitim Evi'nin sunucusuna sorar | — | Evet (6. bölüm) |
| **Google Haritalar** (`google.com/maps`) | Yalnız sen "Google Haritalar'da aç" (Çocuğumun telefonu, okulun konumu), "Servisi … aç", "Evi … aç" ya da servisçide "Yol tarifi"ne basınca | Adreste konumun enlemi ve boylamı (çocuğun telefonu, servis aracı, öğrencinin evi ya da okul) ve senin IP adresin; yeni sekmede açılır | Eğitim Evi'nin sayfa adresi (bağlantı "noreferrer"), adın, hesabın | **Hayır** (yalnız Eğitim Evi Aile belgesinde var; bkz. "Kurallar ve sınırlar") |
| **E-posta sağlayıcısı** (sistemi kuranın seçtiği e-posta sunucusu) | Kayıt onay bağlantısı, iki adımlı giriş kodu, şifre sıfırlama, e-posta değişikliği | Alıcının e-posta adresi, adı, kod ya da bağlantı | Şifren | **Hayır** |
| **GitHub** (sunucu tarafı) | İndirme sayfasının sürüm tablosu için sunucu uygulamanın GitHub'daki sürümlerini okur (15 dakika bellekte tutar) | Sunucudan GitHub'a yalnız sabit bir adrese istek; kişisel veri yok | — | Gerek yok |
| **GitHub** (senin tarayıcın) | "İndir" ile APK'yı indirince, "Kaynak kodu", "Yapımcılar" ya da kullanım koşullarındaki GitHub bağlantılarına basınca | Senin IP adresin GitHub'a (bağlantıyı açan sensin) | — | Gerek yok |

### Ziyaretçi

- Açılış sayfası, okul sayfaları, aydınlatma metni ve SSS dışarıya bir şey göndermez; yazı tipleri ve simgeler sitenin kendisinden
  gelir.
- "Kaynak kodu", "Yapımcılar" ve indirme sayfasındaki APK bağlantıları GitHub'ı açar; bastığında tarayıcın GitHub'a gider.
- Giriş ve kayıt bilgilerin hiçbir dış servise gitmez; kayıt onay bağlantısı e-posta sağlayıcısı üzerinden gelir.

### Öğrenci

- Evini haritada işaretlerken ya da servis haritasına bakarken harita resimleri OpenStreetMap'ten iner (IP'n ve bakılan bölge).
- Servis sayfasındaki "Servisi Google Haritalar'da aç" ve "Evi Google Haritalar'da aç" düğmeleri o konumu Google'a götürür; basmazsan
  gitmez ([Canlı konum ve harita](../servis/canli-konum-ve-harita.md)).
- Telefon bildirimlerini açtıysan bildirimler tarayıcının bildirim servisi üzerinden şifreli gelir.
- Eğitim Evi Aile ile paylaşılan konumun yalnız Eğitim Evi'nin sunucusuna gider ([Kim görür, ne kadar saklanır](../aile/mahremiyet.md)).

### Veli

- Çocuğumun telefonu sayfasındaki harita OpenStreetMap'ten iner; "Google Haritalar'da aç"a basarsan çocuğunun son konumu Google'a gider
  (basmazsan gitmez).
- Servis haritası ve "Servisi / Evi Google Haritalar'da aç" öğrencideki gibi.

### Öğretmen ve çalışan

- Telefon bildirimi tarayıcının bildirim servisi üzerinden şifreli gelir; Eğitim Evi telefon uygulamasında araya başka şirket girmez.
- **Tasarımda:** toplantı ve uzaktan ders bağlantısı (Zoom, Google Meet, Teams, Jitsi) eklediğinde "Katıl"a basan kişi o şirketin
  sitesine gider; toplantıyı Eğitim Evi kaydetmez; bu üçüncü taraf aydınlatma metnine yazılır ([Uzaktan ders bağlantısı](../toplanti/uzaktan-ders-baglantisi.md)).

### Müdür

- Okul ayarlarındaki okul konumu haritası OpenStreetMap'ten iner; konumun yanındaki "Google Haritalar'da aç" okulun konumunu Google'da
  açar (okulun konumu kişisel veri değildir).
- Okul sayfasına yüklediğin fotoğraflar Eğitim Evi'nin sunucusunda durur; konum, tarih ve cihaz bilgisi yüklenirken silinir; dışarıdan
  resim adresi gömülemez.
- Aydınlatma metnine göre sunucu Türkiye dışındaysa bu yurt dışına aktarım sayılır ve **okul** bunu ayrıca bildirmekle yükümlüdür.
- **Tasarımda:** okulun kurduğu eklentilerin dış adresleri ve dışarı gönderdikleri veri, kurulum ekranında ve okulun "okul eki"nde
  yazılır; adres yurt dışındaysa bu da söylenir (eklentiler kodlanmayacak, yalnız belgeleniyor) ([Eklentilerin sınırları](../eklentiler/sinirlar.md)).

### Servisçi

- Konumun yalnız Eğitim Evi'nin sunucusuna gider (sitede sayfan açıkken; telefon uygulamasında sefer sürerken arka planda da).
- Yoklama sayfasındaki "Yol tarifi" öğrencinin evinin konumunu Google Haritalar'a götürür; yalnız bastığında ([Yoklama sayfası](../servis/yoklama-sayfasi.md)).

### Yönetici

- Sistemin e-postayı hangi sağlayıcıyla göndereceğini kurulumda sen seçersin; e-posta ayarlanmamışsa kodlar yalnız sunucu penceresine
  yazılır, kimseye e-posta gitmez. Kullanıcı e-posta servisini "sonra bakarım" diye bıraktı; kurulum belgesine seçenekler yazılacak
  (Gmail'in günlük gönderim sınırı yaklaşık 500).
- Sunucu dışarıya yalnız şu isteklerde bulunur: bildirim servisleri (yalnız bilinen bildirim sunucularına), GitHub sürüm listesi,
  e-posta sunucusu. Testlerde dış istekler kapatılır.
- Telefon bildiriminin anahtar dosyası ve e-posta şifresi sunucudaki gizli klasörde durur, depoya girmez.

### Eğitmen

**Tasarımda:** YouTube bağlantısıyla eklenen video `youtube-nocookie.com` üzerinden ve yalnız oynat'a **tıklayınca** yüklenir; tıklamadan
YouTube'a istek gitmez; videonun küçük resmi indirilip Eğitim Evi'nde saklanır. YouTube videosunda YouTube'un kendi gizlilik kuralları
geçerlidir ("İçerik yükleme koşulları"). Bu, aydınlatma metnine yazılır ([YouTube bağlantısı](../egitim-icerikleri/youtube-baglantisi.md),
[Sorumluluk ve koşullar](../egitim-icerikleri/sorumluluk-ve-kosullar.md)).

## Kurallar ve sınırlar

- **Reklam, analiz, satış yok:** veriler hiçbir üçüncü şirkete bu amaçlarla gönderilmez (aydınlatma metni 1. ve 6. bölüm, kullanım
  koşulları 1. bölüm "reklamsız").
- **Güvenlik başlığı:** betik ve stil yalnız sitenin kendisinden; resim yalnız sitenin kendisinden, gömülü veriden ve
  `tile.openstreetmap.org`'dan. Sayfaya gömülü betik çalışmaz.
- **Bildirim servisi:** sunucu bildirimleri yalnız bilinen bildirim sunucularına (Google, Mozilla, Microsoft, Apple) gönderir; abonelik
  başka bir adres gösterse reddedilir.
- **Yurt dışı:** sunucunun ülkesi metinde yazmaz; metin şablonu okulun bunu eklemesini önerir.
- **Dikkat (aydınlatma metninde eksik):**
  - Google Haritalar bağlantıları (Çocuğumun telefonu, servis sayfası, okul konumu, servisçinin "Yol tarifi") 6. bölümde yok. Çocuğumun
    telefonu sayfasının kod belgesi ([27b-aile.md](../../public/js/parcalar/27b-aile.md)) "Google Haritalar'da aç" bağlantısının yalnız
    basılırsa koordinatı Google'a götürdüğünü yazar; bunun karşılığı metne girmeli (öğrencinin evinin ve servis aracının konumu da
    aynı yolla gidebiliyor).
  - E-posta gönderimi (alıcının adresi ve adı sistemi kuranın seçtiği e-posta sağlayıcısına gider) 6. bölümde yok.
  - İkisi KVKK tam denetiminde (iş 18) metne eklenmeli.
- **Dikkat (KILAVUZ):** KILAVUZ'un "Gizlilik ve güvenlik" bölümü "Veriler okulun kullandığı sunucuda durur." der; doğrusu aydınlatma
  metnindeki gibi "Eğitim Evi'nin sunucusunda; her okulun verisi ayrıdır".

## Kardeşler ve ilgili

**Kardeşler** ([KVKK ve gizlilik](README.md)):

- [Aydınlatma metni](aydinlatma-metni.md) — 6. bölüm.
- [Kim neyi görür](kim-neyi-gorur.md) — Eğitim Evi'nin içinde kim görür.
- [Saklama süreleri](saklama-sureleri.md), [Haklar ve başvuru](haklar-ve-basvuru.md), [Onay ve yeniden onay](onay-ve-yeniden-onay.md),
  [Kullanım koşulları](kullanim-kosullari.md).

**İlgili:**

- [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Android uygulaması](../uygulama/android-uygulamasi.md),
  [İndir sayfası](../uygulama/indir-sayfasi.md).
- [Canlı konum ve harita](../servis/canli-konum-ve-harita.md), [Evi işaretleme](../servis/evi-isaretleme.md),
  [Yoklama sayfası](../servis/yoklama-sayfasi.md), [Konum (Eğitim Evi Aile)](../aile/konum.md), [Okul konumu](../okul-sayfasi/okul-konumu.md).
- [E-posta onayı](../giris-hesap/eposta-onayi.md), [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md), [E-posta sağlığı](../yonetim/eposta-sagligi.md).
- [YouTube bağlantısı](../egitim-icerikleri/youtube-baglantisi.md), [Uzaktan ders bağlantısı](../toplanti/uzaktan-ders-baglantisi.md).

## Kod tarafı

- Güvenlik başlığı (CSP `img-src 'self' data: https://tile.openstreetmap.org`, `script-src 'self'`): [sunucu/http.md](../../sunucu/http.md).
- Harita ve Google Haritalar bağlantısı (`HARITA_DOSEME`, `googleHaritaAdresi`, "noopener noreferrer"):
  [public/js/parcalar/19d-harita.md](../../public/js/parcalar/19d-harita.md); servis haritasındaki iki düğme
  [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md); "Yol tarifi"
  [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md); okul konumu
  [public/js/parcalar/16b-okul-ayarlari.md](../../public/js/parcalar/16b-okul-ayarlari.md); Çocuğumun telefonu
  [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md).
- Telefon bildirimi (`PUSH_SUNUCULARI`, şifreleme): [sunucu/push.md](../../sunucu/push.md); uygulamanın kendi yoklaması
  [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md).
- GitHub sürüm listesi: [sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md).
- E-posta: [sunucu/ayarlar.md](../../sunucu/ayarlar.md) (e-posta ayarları); kurulum adımları `belge/KILAVUZ.md` ("E-posta ayarlama") ve
  `belge/SUNUCUYA-KURULUM.md`.
- Testler: [testler/test-push.md](../../testler/test-push.md), [testler/test-uygulama-surum.md](../../testler/test-uygulama-surum.md);
  testlerde dış istekler kapalıdır.

## Sık sorulanlar

- **Bilgilerim Google'a gidiyor mu?** Giriş bilgilerin hayır. Yalnız sen "Google Haritalar'da aç" ya da "Yol tarifi"ne basarsan o
  konum Google'a gider; telefon bildirimi açıksa bildirim (şifreli) tarayıcının bildirim servisi üzerinden geçer.
- **Harita açınca ne paylaşılıyor?** Cihazının IP adresi ve bakılan harita bölgesi OpenStreetMap'e; adın ve işaretlenen konumlar değil.
- **Telefon uygulaması bildirimleri nasıl alıyor?** Doğrudan Eğitim Evi'nin sunucusuna sorar; araya başka şirketin bildirim servisi
  girmez.

## Sırada

- KVKK ve onay metinleri tam denetimi (iş 18): Google Haritalar bağlantıları ve e-posta sağlayıcısı 6. bölüme; dışarı giden her verinin
  listesi.
- Eğitim içerikleri (iş 17): YouTube (nocookie, tıklayınca yükleme) metne.
- Toplantılar (iş 21): Zoom, Google Meet, Teams, Jitsi bağlantıları metne.
- Sistem işi (iş 4): e-posta sağlığı ekranı ve kurulum belgesindeki e-posta servisi seçenekleri.
- Eklentiler (iş 35, yalnız belgeleniyor): okul eki.
