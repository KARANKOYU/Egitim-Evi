# Çocuğumun telefonu · Ekran süresi

**Durum:** Kodda var; tasarımda ek olarak bir güne dokununca o günün uygulama listesi, "sınır … geçti" rozetleri ve
"kırmızı: sınır geçti" açıklaması.

Çocuğun telefonda bugün ve son günlerde ne kadar vakit geçirdiğini, bugün hangi uygulamada ne kadar kaldığını gösteren kart.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: "çocuğun ekran süresi grafik hâlinde durur, hangi uygulama ne kadar diye". Günlük toplamı ve
uygulama uygulama dağılımı görürsün; [süre sınırı](sure-siniri.md) koyduysan sınırı geçen gün ve uygulama ayrı renkle
belirir.

## Nereden açılır

[Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)'nda **"Ekran süresi"** kartı (geniş ekranda "Konum" kartının
sağında, dar ekranda altında).

Tasarımda (Tasarım 1 önizlemesi): sayfanın ikinci bölümü **"Ekran süresi · son 7 gün"**.

## Adım adım

### Veli

1. Sayfayı aç; "Ekran süresi" kartına bak. Paylaşım kapalıysa yalnız "Ekran süresi paylaşımı kapalı." yazar
   ([Paylaşım ayarları](paylasim-ayarlari.md)).
2. En üstte bugünün toplamı büyük yazıyla (ör. **"2 sa 40 dk"**), yanında "bugün"; günlük toplam sınır koyduysan "bugün ·
   sınır 2 sa". Toplam sınırı geçtiyse altında uyarı kutusu: **"Bugünkü toplam sınır geçildi."**
3. Altında **son 8 günün** (bugün dahil, en eski solda) günlük toplam çubukları. Çubuğun boyu en uzun güne (sınır daha
   büyükse sınıra) göredir; sınırı geçen gün kırmızıdır (sitenin ana rengi), öbürleri ikinci renktedir. Her çubuğun altında
   günün adının ilk üç harfi ("Per", "Cum"…); farenle üzerine gelince tam tarih ve toplam: "1 Ekim 2026, Perşembe: 2 sa 40 dk".
4. Çubukların altında **bugün** en çok kullanılan uygulamalar (en çoğu üstte, en çok 12 tane): adı, süresi ("1 sa 20 dk"),
   o uygulamaya sınır koyduysan yanında soluk "/ 1 sa"; altında yatay çubuk (en çok kullanılan uygulamaya göre). Sınırı
   geçen uygulamanın çubuğu kırmızıdır. Bugün hiç süre gelmediyse: "Bugün için süre gelmedi."

Süre nasıl yazılır: "45 dk", "2 sa", "2 sa 40 dk".

Tasarımda (Tasarım 1 önizlemesi):

1. Bölüm başlığı **"Ekran süresi · son 7 gün"**, sağında "günlük toplam"; sınırın geçildiği bir gün varsa "günlük toplam ·
   kırmızı: sınır geçti".
2. Her gün dokunulabilen bir sütundur: üstünde kısa toplam ("45 dk", "1,6 sa"), ortada çubuk, altında kalın gün kısaltması
   ("Cum", "Cmt", "Paz", "Pzt", "Sal", "Çar", "Per" — her gün ayrı). Sınırın geçildiği gün kırmızıdır. Ekran okuyucu her
   sütunu tam söyler: "Perşembe, 1 Ekim · bugün: 1 sa 9 dk, sınır geçti".
3. Seçili gün vurgulanır; altında **o günün** başlığı ve toplamı ("Perşembe, 1 Ekim · bugün · toplam 1
   sa 9 dk"), ortak sınır geçildiyse kırmızı rozet "günlük sınır (2 sa) geçti". Başka bir güne dokununca liste o güne geçer
   (bugünkü kodda yalnız bugünün listesi var).
4. O günün uygulamaları en çoktan aza: adı, yatay çubuk, süresi; uygulama sınırı geçildiyse kırmızı rozet "sınır 1 sa geçti",
   geçilmediyse soluk "/ 1 sa".
5. Bölümün altında: "Yalnız son 7 gün tutulur; daha eski veriler silinir."

Sınırı geçen gün kuralı tasarımda: ortak sınırda günün toplamı sınırı geçtiyse; uygulama başına sınırda o gün herhangi bir
uygulama kendi sınırını geçtiyse.

### Öğrenci

Telefonun süreyi Android'in kullanım istatistiklerinden okur ("Kullanım erişimi" izni gerekir,
[Telefondaki izinler ve durum](izinler-ve-durum.md)): her gün için hangi uygulama **ön planda** (ekranda açık) kaç dakika
kaldı. Ana ekran (başlatıcı), sistem arayüzü ve Eğitim Evi uygulamasının kendisi sayılmaz; süre dakikaya yuvarlanır,
yarım dakikadan az kalan (0 dakikaya yuvarlanan) uygulama gönderilmez. Telefon 15 dakikada bir bugünün ve dünün sürelerini
gönderir. Gönderen arka plan hizmeti konum izni olmadan başlamadığı için konum iznini vermezsen ekran süresi de gitmez.

## Kurallar ve sınırlar

- **Günler Türkiye saatine göre**; sunucu son 7 gün ile bugün dışındaki günü almaz. Sayfa bugün ve önceki 7 günü gösterir
  (8 gün): kullanıcının sözüyle "salı günüyse önceki salının arkası gözükmeyecek".
- **Üzerine yazılır:** aynı gün aynı uygulama yeniden gelince eski değerin yerine geçer (toplanmaz).
- **Sunucunun süzgeci:** bir gönderimde en çok 8 gün, günde en çok 300 uygulama; dakika 0–1440 arası tam sayı olmalı; paket
  adı yalnız harf, rakam, nokta, alt çizgi ve tire (en çok 200 harf); aynı gün iki kez gelen paket bir kez sayılır.
  Uygulamanın adı telefondan gelir: denetim ve yön değiştirme karakterleri atılır, 100 harfe kısaltılır, boşsa paket adı
  kullanılır.
- **Ne kadar güncel:** telefon 15 dakikada bir gönderdiği için sayfadaki süre en çok yaklaşık 15 dakika geridedir (telefon
  internete bağlıysa). Sayfa kendiliğinden tazelenmez; yeniden aç.
- **Paylaşım kapalıyken** telefon süre göndermez, gönderse de sunucu almaz; eski süreler 7 gün durur.
- **Uygulama listesi ve "bu hafta":** sınır koyarken seçilebilen uygulamalar son 8 günün toplamına göre ilk 30 uygulamadır
  ([Süre sınırı](sure-siniri.md)).
- **Saklama:** süreler 7 gün sonra silinir, yedeğe girmez ([Kim görür](mahremiyet.md)).
- **Bilinen sorunlar:**
  - Çubukların altındaki üç harf Pazar ile Pazartesi'ye ikisine de "Paz", Cuma ile Cumartesi'ye ikisine de "Cum" yazar; 8
    günlük şeritte bunlar yan yana gelir. Tam tarih yalnız fareyle üzerine gelince görünür (dokunmatik ekranda o da yok).
    Tasarımdaki "Pzt", "Cmt" kısaltmaları bunu çözer.
  - Ekran okuyucu çubuklar için yalnız "Son 8 günün ekran süresi" der, değerleri okumaz.

Tasarımla ilgili not: önizlemede 7 sütun ve "Yalnız son 7 gün tutulur" var; bugünkü kod ve sunucu bugünü ve önceki 7 günü
(8 gün) tutar, kullanıcının "önceki salı" sözü de 8 günü verir. Önizlemenin örnek listesinde "Eğitim Evi" de bir uygulama
olarak görünür; bugünkü telefon uygulaması kendi süresini saymaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Süre sınırı ve aşım bildirimi](sure-siniri.md) — kırmızı çubukların ve "/ 1 sa" yazısının kaynağı.
- [Paylaşım ayarları](paylasim-ayarlari.md) — "Ekran süresini paylaş".
- [Konum](konum.md) — yanındaki kart.
- [Telefondaki izinler ve durum](izinler-ve-durum.md) — "Kullanım erişimi" izni.
- [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md), [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).
- [İlerleyiş](../ilerleyis/README.md) — sitenin öbür grafikleri (ödev ve sınav); aynı renk dili.

## Kod tarafı

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `aileSureKarti(d)` (toplam, 8 gün
  çubukları `div.aile-gunler` `role="img"`, ilk 12 uygulama), `aileSure(dk)`;
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) — `tarihGun`, `gunAdi`.
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `POST /api/aile/cihaz/kullanim` (süzgeç, `uygulamaAdi`,
  paylaşım kapalıyken `{ kapali: true }`), `GET /api/aile/ozet` (`kullanim.bugun`, `kullanim.gunler` 8 gün,
  `kullanim.hafta` ilk 30); [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `kullanimYaz` (üzerine yazma),
  `kullanimlari`; [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) — `trGun`, `gunEkle`.
- Tablo: `aile_kullanim` (birincil anahtar öğrenci + gün + paket; şema 026, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Android: `Kullanim.java` (`sonGunler`, ön planda kalma süresi, atlanan paketler), `IzlemeServisi.java` (`kullanimGonder`,
  15 dakikada bir, bugün ve dün).
- CSS: `33-aile.css` (`.aile-toplam`, `.aile-gunler`, `.aile-cubuk.asti`, `.aile-uygulamalar`, `.aile-bar`) —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — kullanım süzgeci, büyükten küçüğe süreler, 8 günlük toplam,
  uygulama adının düz metin saklanması (ön yüz kaçışla basar).
- Tasarım: Tasarım 1 önizlemesi, öğrenci-veli paketi (gün sütunları, seçilen günün listesi).

## Sık sorulanlar

- **Toplam neden telefonun kendi ekran süresi ayarındakinden farklı?** Telefon kendi hesabını başka türlü yapabilir;
  Eğitim Evi yalnız uygulamaların ön planda kaldığı dakikaları toplar, yarım dakikadan kısa olanları, ana ekranı, sistem
  arayüzünü ve kendisini saymaz.
- **Dünün uygulama listesini görebilir miyim?** Bugünkü kodda yalnız bugünün listesi var; öbür günlerin yalnız toplamı
  görünür. Tasarımda güne dokununca o günün listesi açılır.
- **Gece yarısından sonra kullanılan süre hangi güne yazılır?** Telefonun saatine göre yeni güne.
- **Çocuğum bir uygulamayı silerse?** O güne kadar gönderilen süreleri 7 gün görünmeye devam eder.

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı) ve Tasarım 1 düzeni: dokunulan günün uygulama listesi, "sınır
  geçti" rozetleri, ayırt edici gün kısaltmaları.
- Android yerel uygulama (iş 10): uygulamanın veli ekranında ekran süresi grafiği.
- Optimizasyon + saklama süreleri (iş 7): saklama tablosunda Aile verisinin 7 günü.
