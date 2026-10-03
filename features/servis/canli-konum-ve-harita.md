# Servis · Canlı konum ve servis haritası

**Durum:** Kodda var; tasarımda ek olarak servisçinin haritasında kalan yolu gösteren kırmızı kesik çizgi ve vurgulu sıradaki ev, velinin haritasında "canlı" rozeti ve "Servis eve 100 m uzaklıkta" şeridi; telefon uygulamasında arka planda konum gönderen sefer servisi hazır, onu başlatan servisçi ekranı tasarımda.

Sefer sürerken servisçinin telefonunun konumu gönderilir; öğrenci, velisi ve okul yönetimi haritada okulu, evi ve aracı görür.

## Ne işe yarar

Kullanıcının sözleri (26 Eylül): "servisci de telefonuna yükleyince onun konumunu öğrenci görebilecek haritalarda o sekemde google
haritalar ve mark olcak öğrencinin evi ve okul ve servis" ve "haritada 3 buton okula git eve git servisi takip et". Veli kapıda
beklemeden aracın nerede olduğunu, eve ne kadar kaldığını ve çocuğunun kaçıncı sırada olduğunu görür; servisçi evleri ve sırayı aynı
haritada görür.

## Nereden açılır

- **Öğrenci:** "Servisim" sayfasında **"Servisin nerede?"** kartı.
- **Veli:** "Servis" sayfasında **"Servis haritası"** kartı (birden çok servisli çocukta üstte çocuk düğmeleri).
- **Okul yönetimi:** "Servisler" sayfasında öğrencinin satırındaki **"Harita"** → "Elif Yılmaz — servis haritası" penceresi.
- **Servisçi:** Yoklama sayfasının altındaki **"Harita"** kartı; konum gönderimi Yoklama sayfasında sefer başlayınca.

## Adım adım

### Harita bileşeni (herkeste aynı)

- Harita OpenStreetMap döşemeleriyle, sitenin kendi küçük bileşeniyle çizilir (dış kütüphane yok). Sağ üstte üç düğme: **"+"**
  (Yakınlaştır), **"−"** (Uzaklaştır) ve hedef simgeli **"Hepsini göster"**; sağ altta "© OpenStreetMap katkıda bulunanlar".
- Parmakla ya da fareyle sürüklenir; iki parmakla, tekerlekle ya da çift tıklayarak yakınlaşır. Haritaya odaklanınca ok tuşları kaydırır,
  "+" ve "-" yakınlaştırır.
- İşaretler: **okul** ("Okul"), **ev** ("Ev"), sefer sürerken **servis aracı** (etiketi plaka, yoksa "Servis"); servisçide evler sıra
  numarası ve ilk adla ("1. Elif") ve kendi yeri **"Sen"**.

### Öğrenci ve veli

1. Haritanın altında bir düğme sırası (yalnız gösterilecek yer varsa):
   - **"Okula git"** (okulun konumu girildiyse) — haritayı okula ortalar,
   - **"Eve git"** (ev işaretliyse) — eve ortalar,
   - **"Servisi takip et"** (aracın yeri geliyorsa) — açınca düğme **"Servis takipte"** olur ve araç her yenilenişte haritanın
     ortasında kalır; "Okula git" ya da "Eve git"e basınca takip kapanır.
2. Altında durum satırı:
   - Sefer sürüyor, konum geliyor: canlı nokta ve **"Servis yolda"** ("okula gidiş" ya da "eve dönüş") · "konum 12 sn önce" ·
     "eve yaklaşık 1,2 km" (ev işaretliyse) ve servis saatindeyse sıra "5. sırada, önünde 2 öğrenci".
   - Sefer sürüyor ama konum birkaç dakikadır gelmiyor: "Sefer başladı; aracın konumu birkaç dakikadır gelmiyor."
   - Servis saati dışında: "Aracın yeri yalnız servis saatlerinde görünür: sabah 07:00–09:20, akşam 16:30–19:00."
   - Servis saatinde ama sefer yok: "Şu an sefer yok. Servis yola çıkınca aracın yeri burada görünür."
   - Öğrenci servise kayıtlı değilse: "Elif Yılmaz bir servise kayıtlı değil."
3. Bağlantılar: **"Servisi Google Haritalar'da aç"** (araç görünüyorsa), **"Evi Google Haritalar'da aç"** (ev işaretliyse); ikisi de yeni
   sekmede açılır.
4. Ev düğmeleri: **"Evimi işaretle"** ya da **"Evin yerini değiştir"**, ev işaretliyse **"Ev işaretini sil"**
   ([Evin yerini işaretleme](evi-isaretleme.md)). Ev işaretli değilse: "Ev işaretli değil. İşaretlersen servis eve 500 m ve 100 m kala
   bildirim gelir."
5. Okulun konumu girilmediyse: "Okulun konumu henüz girilmedi (okul yönetimi Ayarlar'dan girer)."
6. Harita kendiliğinden yenilenir: sefer varken **5 saniyede**, servis saatinde **30 saniyede**, saat dışında **2 dakikada** bir.
   Sekme arka plandayken ya da ev seçerken durur. Her yenilemede servis kartının "bugün" bölümü de tazelenir.
7. Veli birden çok servisli çocukta haritanın üstündeki ad düğmeleriyle çocuklar arasında geçer.

### Müdür, öğretmen ve çalışan (servis yönetimi)

Öğrencinin satırındaki **"Harita"** ile aynı harita pencerede açılır; düğmeler ve durum satırı öğrencidekiyle aynı, evin yerini de
düzenlersin. Yönetim aracın konumunu yalnız bu öğrenci üzerinden görür; bütün servisleri birlikte gösteren bir harita bugün yok.

### Servisçi — konum gönderimi

1. Sefer Yoklama sayfasından başlar: sabah **"Seferi başlat"** ya da ilk **"Bindi"**, akşam **"Başlat"**
   ([Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md)).
2. Telefon konum izni ister; izin verince konum birkaç saniyede bir gider. Üst karttaki durum kutusu:
   - "Konum bekleniyor..."
   - canlı nokta ve "Konum gönderiliyor · okula gidiş · son gönderim 3 sn önce · ±8 m"
   - "Konum izni verilmedi. Telefonun ayarlarından bu siteye konum izni ver." ya da "Konum alınamıyor (GPS kapalı ya da sinyal yok)."
   - Sefer açık ama bu telefon göndermiyorsa (ör. sayfa yenilendi): "Sefer açık ama bu telefondan konum gitmiyor." ve **"Konum
     göndermeyi sürdür"** düğmesi.
3. Altında not: "Konum yalnızca bu sayfa açıkken gider: telefonu kilitleme, şarja takılı tut." Ekran kararmasın diye sayfa ekran
   kilidini tutar.
4. Sefer bitince (sabah "Okula vardık", akşam son "İndi" ya da **"Seferi bitir"**, saatin bitmesi) gönderim kendiliğinden durur;
   sunucu seferi kapattıysa Yoklama sayfası yeniden açılır ve ileti yazar ("Servis saati bitti; sefer kapandı.").
5. Yoklama sayfasının **"Harita"** kartında okul, evi işaretli öğrenciler (sıra numarasıyla) ve sefer sürerken senin yerin; altında "Okul,
   evi işaretli öğrenciler (sıra numarasıyla) ve sefer sürerken senin yerin." Evi işaretli öğrencinin satırındaki **"Yol tarifi"** Google
   Haritalar'da yol tarifini açar. Servisçi evlerin yerini görür ama değiştiremez.

### Telefon uygulaması (Android)

Eğitim Evi Android uygulamasında, servisçinin seferi sürerken konumu **arka planda ve ekran kapalıyken de** gönderen bir sefer servisi
hazır: bildirim çubuğunda "Sefer sürüyor" (kanal "Servis seferi") görünür; araç dururken de 20 saniyede bir son konumu yeniden yollar;
sefer bitince, sefer yoksa ya da uygulama anahtarı geçersizse kendini durdurur. Bugün uygulamada bu servisi başlatan servisçi ekranı
yok (planlı). Uygulama konumu hesap şifresiyle değil, girişte aldığı uygulama anahtarıyla gönderir; anahtar hesaba giriş vermez.

### Tasarımda (Tasarım 1 önizlemesi)

- Velinin ve öğrencinin **"Servis haritası"**: servis saatinde başlıkta **"canlı"** rozeti; düğmeler "Okula git", "Eve git" ve yalnız
  saat içinde "Servisi takip et"; kırmızı kesik çizgiyle aracın kalan yolu; durum "Servis yolda (eve dönüş) · 5. sırada, önünde 2
  öğrenci · eve yaklaşık 350 m"; saat dışında "Aracın yeri yalnız servis saatlerinde görünür: sabah 07:00–09:20, akşam 16:30–19:00.
  Sıradaki: bugün akşam 16:30–19:00."; araç 100 m'ye girince haritanın üstünde şerit: "Servis eve 100 m uzaklıkta. Elif birazdan evde."
  ([Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md)).
- Servisçinin haritası sefer sürerken **"Sıradaki"** kartının altında: kırmızı kesik çizgi kalan yol, turuncu numara sıradaki ev,
  geçilen evler soluk; "Sen · Servis 3" etiketi; not "Kırmızı kesik çizgi kalan yol; turuncu numara sıradaki ev. Eve dokununca adresi ve
  "Yol tarifi" çıkar." Haritada eve dokununca adres ve **"Yol tarifi"** açılır.
- Müdürün "Servisler" sayfasında "Servisler şu an" haritası (bütün servisler) önizlemede örnektir; kullanıcı bunu ayrıca istemedi.
- Telefon uygulaması tasarımında servisçinin **"Harita"** sekmesi (sıradaki ev, yol tarifi) ve Yoklama'dan başlayan arka plan konumu.
- Önizleme haritayı bir harita kütüphanesiyle çizer; gerçek sitede kendi bileşeni kalır (tek bağımlılık kuralı).

## Kurallar ve sınırlar

- **Aracın konumunu kim görür:** yalnız o servisteki öğrenci, velisi ve okul yönetimi (servis yetkilisi); harita ucu başkasına "Bu
  haritayı görme yetkin yok" der. O servisin servisçisi haritayı görür.
- **Ne zaman:** yalnız sefer sürerken (servis saatinde ya da aralık içinde başlamış seferin 60 dakikalık uzatmasında) ve son konum son
  **3 dakikada** geldiyse. Servis saati dışında harita ucu sefer ve konum döndürmez.
- **Geçmiş iz saklanmaz:** yalnız son konum tutulur; seferler 30 gün sonra silinir. 45 dakika konum gelmeyen sefer kendiliğinden kapanır.
- **Konum yalnız HTTPS'te** (ya da yerel geliştirme adresinde) alınır ve tarayıcı arka planda konum vermez: servisçi Yoklama sayfasını açık
  tutmalı. https değilse sayfanın üstünde "Konum yalnızca güvenli (https) bağlantıda gönderilir; yoklama yine de alınır. Okulun sitesine
  https ile gir.", sabah "Seferi başlat"ta "Bu bağlantıda konum alınamıyor. Okulun sitesine https ile gir."
- **Gönderim sıklığı:** en sık 5 saniyede bir; araç 30 metreden fazla yer değiştirdiyse 2 saniye arayla hemen; araç dururken 20 saniyede
  bir son konum yeniden. Sunucu dakikada en çok 60 konum kabul eder ("Konum çok sık gönderiliyor.").
- **Konumu yalnız servisçi**, yalnız kendi açık seferi için gönderir: "Konumu servisçi gönderir", "Sefer bitmiş ya da sana ait değil";
  bozuk koordinat "Konum anlaşılmadı". Servis başka servisçiye verilirse ya da hesabı silinirse açık sefer kapanır.
- **Yaklaşma bildirimleri** konum geldikçe hesaplanır; GPS doğruluğu 150 metreden kötüyse bildirim gitmez
  ([Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md)).
- **Harita döşemeleri** OpenStreetMap'ten gelir (aydınlatma metninde anılan dış hizmet); işaretlerin konumu oraya gönderilmez. "Google
  Haritalar'da aç" ve "Yol tarifi" kişinin kendi tıklamasıyla, yeni sekmede açılır.
- **Bölüm kapalıysa** harita ucu da kapalıdır; telefon uygulamasının konum gönderimi "Servis bu okulda kapalı." alır.
- **Bilinen açıklar (kod bugün böyle):**
  - "Konum göndermeyi sürdür" güvenli bağlantıya bakmaz; http'de tarayıcı reddeder ve kişi yanıltıcı biçimde "Konum izni verilmedi …"
    görür.
  - "Servisi takip et" açık kalırsa başka çocuğun haritasında da açık kalır.
  - Velinin iki çocuğu arasında hızlı geçişte eski çocuğun cevabı bir yenileme süresince yeni haritada görünebilir.
  - Yönetim penceresinde harita açılınca sayfadaki harita (kendi çocuğununki) boşalır; sayfaya yeniden girince gelir.
  - "Okulun konumu henüz girilmedi (okul yönetimi Ayarlar'dan girer)." yazısındaki yer menüde "Okul Adresi ve Konumu" (müdür) ya da
    "Okulun Konumu" (yetkili) sayfasıdır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Evin yerini işaretleme](evi-isaretleme.md), [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md).
- [Servisim ve servis kartı](servisim.md) — haritanın durduğu sayfa.
- [Yoklama sayfası](yoklama-sayfasi.md), [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md) — seferin başladığı yer.
- [Servis saatleri](servis-saatleri.md), [Sırayı düzenle](sira-duzenleme.md), [Servisler sayfası](servisler-sayfasi.md).

**İlgili:**

- [Okul konumu](../okul-sayfasi/okul-konumu.md) — okulun haritadaki yeri.
- [Çocuğumun telefonu · Konum](../aile/konum.md) — aynı harita bileşeni, çocuğun kendi telefonunun konumu.
- [Android uygulaması](../uygulama/android-uygulamasi.md), [Telefon bildirimi](../bildirim/telefon-bildirimi.md).
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).

## Kod tarafı

- Harita bileşeni: [public/js/parcalar/19d-harita.md](../../public/js/parcalar/19d-harita.md) — `haritaKur`, `googleHaritaBaglantisi`;
  izinli döşeme adresi [sunucu/http.md](../../sunucu/http.md) (CSP `img-src`).
- Ön yüz: [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) — `servisHaritasiAc`,
  `servisHaritasiYenile`, `servisHaritasiZamanla` (5 sn / 30 sn / 2 dk), `servisHaritasiCiz`, `harita-okula`, `harita-eve`,
  `harita-servis`, `servis-harita-cocuk`, `servis-harita-modal`; servisçi: `seferIzlemeyiBaslat`, `seferKonumGonder`, `seferDurumCiz`,
  `sefer-surdur`, `sefer-bitir`, ekran kilidi; servisçinin haritası
  [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) (`seferBenCiz`).
- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/servis/harita?ogrenci=` (`haritaYetkisi`,
  `KONUM_TAZE_MS` 3 dk), `POST /api/servis/konum`, `POST /api/servis/sefer-basla`, `/sefer-bitir`, `seferKonumuYaz`, `servisTemizle`.
  Telefon uygulaması: [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (`POST /api/cihaz/servis-konum`, `GET /api/cihaz/ayar`).
- Depo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) (`servis_seferleri`, `seferKonumYaz`, `seferTemizle`),
  [sunucu/veri/depo/cihazlar.md](../../sunucu/veri/depo/cihazlar.md).
- Testler: [testler/test-servis-konum.md](../../testler/test-servis-konum.md), [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md)
  (aralık dışında haritada canlı veri yok, cihaz anahtarı uçları).
- Android uygulaması (ayrı depo): `SeferServisi` (arka plan konumu).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis haritası ve canlı konum").

## Sık sorulanlar

- **Servisin konumunu kim görür?** Yalnız o servisteki öğrenci, velisi ve okul yönetimi; yalnız sefer sürerken ve servis saatlerinde.
- **Aracı neden göremiyorum?** Servis saati dışındasın, sefer başlamadı ya da servisçinin konumu son 3 dakikada gelmedi (servisçinin
  sayfası kapalı ya da telefonu kilitli olabilir).
- **"Servisi takip et" ne yapar?** Araç her yenilenişte haritanın ortasında kalır; "Okula git" ya da "Eve git" takibi kapatır.
- **Servisçi olarak telefonu kilitlersem ne olur?** Tarayıcı konum vermeyi keser; veliler aracı göremez. Sayfayı açık tut, şarja tak.
  Telefon uygulamasının arka plan konumu servisçi ekranı yazılınca gelecek.
- **Geçmiş güzergâh saklanıyor mu?** Hayır; yalnız son konum tutulur.

## Sırada

- Android yerel uygulama: servisçinin Yoklama ve Harita sekmeleri; seferi arka plan konum servisiyle başlatan düğme.
- Linux kodlaması (Tasarım 1): kalan yol çizgisi, sıradaki ev, "canlı" rozeti, 100 m şeridi.
- KVKK ve onay metinleri TAM denetimi: Google Haritalar bağlantılarının (yol tarifi, "Google Haritalar'da aç") aydınlatma metninde anılması.
- Güvenlik denetimi / TAM DEBUG: "Konum göndermeyi sürdür"ün https denetimi, takip durumunun sıfırlanması, çocuk geçişindeki eski cevap.
