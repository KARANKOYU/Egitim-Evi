# Servis · Servis yaklaşıyor bildirimi (500 m ve 100 m)

**Durum:** Kodda var; tasarımda ek olarak velinin haritasının üstünde "Servis eve 100 m uzaklıkta" şeridi.

Servis aracı öğrencinin evine 500 metre ve 100 metre kala öğrenciye ve velisine birer kez giden bildirim.

## Ne işe yarar

Kullanıcının isteği (26 Eylül): "eve yaklaştğında 100m kladı faln bildirim olcak"; aynı gün sorulan "'Servis 100 m kaldı' bildirimi
uygulama kapalıyken de telefona düşsün mü?" sorusuna cevabı: "Evet, telefon bildirimi". Sabah öğrenci kapıya zamanında çıkar, akşam veli
çocuğunu karşılamaya iner.

## Nereden açılır

Ayrı bir ekranı yok; bildirim olarak gelir: sitenin bildirim paneli (zil), telefon bildirimi açıksa telefonun bildirim çubuğu ve Eğitim
Evi telefon uygulaması. Bildirime dokununca servis sayfası (`#/servis`) açılır.

Servis sayfasında, bu cihazda telefon bildirimleri kapalıysa öneri kartı çıkar: **"Servis yaklaşınca haber al"** — "Telefon bildirimlerini
açarsan uygulama kapalıyken de bildirim gelir." ve **"Bildirimleri aç"** ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).

## Adım adım

### Öğrenci

1. Evini işaretle ("Servisim" → "Evimi işaretle"; [Evin yerini işaretleme](evi-isaretleme.md)).
2. İstersen "Servis yaklaşınca haber al" kartında **"Bildirimleri aç"**a bas ve tarayıcının sorusuna izin ver.
3. Sefer sürerken servis evine 500 m'ye girince: "Servis evine yaklaşıyor (yaklaşık 500 m)."; 100 m'ye girince: "Servis evine 100
   metreden yakın, hazırlan."

### Veli

1. Çocuğunun evi işaretli olmalı (sen, çocuğun ya da okul işaretleyebilir).
2. Bildirimler çocuğun adıyla gelir: "Elif Yılmaz: servis evine yaklaşıyor (yaklaşık 500 m)." ve "Elif Yılmaz: servis evine 100
   metreden yakın, hazırlan."
3. Bildirime dokununca "Servis" sayfası açılır; haritada aracı ve "eve yaklaşık 350 m" yazısını görürsün.

### Servisçi

Bir şey yapmaz; bildirimler onun telefonundan gelen konuma göre kendiliğinden gider. Yoklama sayfası açık ve konum gönderiliyor olmalı
([Canlı konum ve servis haritası](canli-konum-ve-harita.md)). Sabah öğrenciyi "Bindi" / "Binmedi" diye işaretleyince o öğrenciye artık
yaklaşma bildirimi gitmez.

### Tasarımda (Tasarım 1 önizlemesi)

Velinin "Servis haritası"nda araç 100 m'ye girince haritanın üstünde bildirim simgeli şerit: "Servis eve 100 m uzaklıkta. Elif birazdan
evde." Velinin bildirim listesine "Elif · Servis eve 100 m kaldı" (altında "Servis 3 · eve dönüş") düşer ve ekranda kısa ileti "Elif:
servis eve 100 m kaldı." çıkar. Bugünkü bildirim metinleri ("… evine 100 metreden yakın, hazırlan.") kullanıcı başka bir şey demediği
için geçerlidir; şerit önizlemede eklenen gösterimdir.

## Kurallar ve sınırlar

- **Eşikler:** 500 m ve 100 m; her sefer için her öğrenciye her eşikten **bir kez**. Araç ilk konumunda zaten 100 m içindeyse iki bildirim
  birden gidebilir.
- **Kime:** öğrencinin kendisine ve velilerine (yoklama bildirimlerinden farkı: bunlar öğrenciye de gider). Velinin metni çocuğun adıyla
  başlar; çocuk bildiriminin ayrıca veliye kopyası gitmez.
- **Hangi öğrenciler:**
  - **Sabah:** henüz "Bindi" / "Binmedi" işaretlenmemiş ve velisi o sabah için "binmeyecek" dememiş öğrenciler.
  - **Akşam:** okulda "Geldi" işaretlenmiş ve henüz "İndi" işaretlenmemiş öğrenciler.
- **Ev işaretli olmalı;** değilse bu öğrenciye yaklaşma bildirimi gitmez (haritada "Ev işaretli değil. İşaretlersen servis eve 500 m ve
  100 m kala bildirim gelir.").
- **GPS doğruluğu** 150 metreden kötü olan konumla bildirim gitmez (yanlış "yaklaştı" olmasın).
- **Yalnız sefer sürerken:** sefer servis saatinde başlar; saat bitince en çok 60 dakika daha sürer.
- **Hız:** liste sunucuda kısa süre (1 dakika) bellekte tutulur; yoklama, sıra, "binmeyecek" ya da öğrenci değişince hemen yenilenir.
- **Nasıl ulaşır:** sitenin bildirim paneli; telefon bildirimi açıksa anında telefona; Eğitim Evi Android uygulaması servis saatlerinde
  1–3 dakikada bir sorar ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- **Kayıt:** hangi seferde kime hangi eşiğin gittiği sefer kaydıyla tutulur; seferler 30 gün sonra silinir.
- **"Bildirimleri aç" kartı:** tarayıcı bildirimi desteklemiyorsa ya da izin daha önce reddedildiyse çıkmaz. Bilinen küçük açık: başarıdan
  sonra düğme "Açılıyor..." yazısıyla kapalı kalır, "Telefon bildirimleri açıldı." iletisi yine görünür (yalnız görünüş).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Evin yerini işaretleme](evi-isaretleme.md) — bildirimin dayandığı ev konumu.
- [Canlı konum ve servis haritası](canli-konum-ve-harita.md) — konumun gelişi.
- [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md), [Binmeyecek](binmeyecek.md) — kimin bildirim alacağını belirler.
- [Servis bildirimleri](servis-bildirimleri.md) — bütün servis bildirimleri.
- [Servisim ve servis kartı](servisim.md) — öneri kartı.

**İlgili:**

- [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Bildirim paneli](../bildirim/bildirim-paneli.md),
  [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [Bildirim ayarları](../ayarlar/bildirim-ayarlari.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamanın bildirim yoklaması.

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `YAKLASMA_ESIKLERI` (500, 100), `EN_KOTU_DOGRULUK`
  (150), `yaklasmaAdaylari` (1 dakikalık bellek), `yaklasmaBildir`, `seferKonumuYaz`; telefon uygulamasının konumu
  [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md). Bildirim gönderimi [sunucu/push.md](../../sunucu/push.md).
- Depo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) — `seferBildirimiIsaretle` (tablo `sefer_bildirimleri`,
  her sefer · öğrenci · eşik bir kez).
- Ön yüz: [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) — `servisBildirimOnerisi`; izin düğmesi
  [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md) (`bildirim-ac`).
- Testler: [testler/test-servis-konum.md](../../testler/test-servis-konum.md) (400 m'de öğrenciye "yaklaşıyor", eşik başına bir kez).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis haritası ve canlı konum" → "Yaklaşma bildirimi").

## Sık sorulanlar

- **Bildirim gelmedi.** Evin işaretli mi, sefer başladı mı, servisçinin konumu geliyor mu bak; sabah çocuk zaten "Bindi" işaretlendiyse
  gelmez. Telefona düşmesi için telefon bildirimlerini açmış olmalısın.
- **Uygulama kapalıyken de gelir mi?** Telefon bildirimi (Web Push) açıksa evet; Android uygulaması da servis saatlerinde 1–3 dakikada
  bir sorar.
- **Her gün aynı bildirim iki kez gelir mi?** Hayır; her sefer için eşik başına bir kez. Sabah ve akşam ayrı seferdir.

## Sırada

- Linux kodlaması (Tasarım 1): velinin haritasında 100 m şeridi.
- Optimizasyon + saklama süreleri: zamanı önemli bildirimlerin (servis yaklaştı) telefon bildirimiyle anında gitmesi; bildirim izni
  vermemiş kişiye bir kez "Anında haber almak için bildirimlere izin ver".
- Mesaj ayarları (bildirim paneli sekmeleri): servis bildirimlerinin "Servis" sekmesinde toplanması.
