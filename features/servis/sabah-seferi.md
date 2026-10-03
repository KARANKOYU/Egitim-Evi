# Servis · Sabah seferi (Bindi / Binmedi, Okula vardık)

**Durum:** Kodda var; tasarımda ek olarak sefer sürerken "Sıradaki" durak kartı ve kalan yol çizgisi, okula varınca "Sabah seferi bitti · okula varış 08:12" satırı ve sefer bitince binmeyen öğrencinin velisine "Önemli" öncelikli uyarı.

Servisçinin sabah öğrencileri evden alırken her birini "Bindi" ya da "Binmedi" diye işaretlediği, okula gelince "Okula vardık" dediği akış.

## Ne işe yarar

Veli çocuğunun servise bindiğini ve okula vardığını anında öğrenir: "Zeynep 07:42'de servise bindi.", "Zeynep 08:05'te okula vardı."
Kullanıcının sözü (26 Eylül): "yanına sabah bindi/binmedi yazar birini seçer". Sefer de bu sırada başlar: servisçinin konumu
servisteki öğrencilere ve velilerine görünür, eve yaklaşınca bildirim gider.

## Nereden açılır

Servisçinin [Yoklama sayfası](yoklama-sayfasi.md); okulun sabah [servis saati](servis-saatleri.md) içinde (varsayılan 07:00–09:20)
üst kartın başlığı **"Sabah yoklaması"** olur ve düğmeler çıkar.

## Adım adım

### Servisçi

1. Sabah servis saati gelince Yoklama sayfasını aç. Üstte "Sabah yoklaması · Bugün · 07:00–09:20" (yeşil), sayılar ("6 öğrenci ·
   6 bekliyor").
2. (İsteğe bağlı) Üst kartta **"Seferi başlat"**: konum paylaşımı başlar. Altındaki not: "Başlatınca konumun servisteki öğrencilerin
   velilerine görünür. Başlatmazsan ilk "Bindi" seferi kendiliğinden başlatır." Sayfanın üstünde "Sefer başladı. Konumun servisteki
   öğrencilere ve velilerine görünüyor." Bağlantı https değilse ya da telefon konum veremiyorsa basınca tarayıcı uyarısı: "Bu
   bağlantıda konum alınamıyor. Okulun sitesine https ile gir."
3. Liste **alma sırasıyla** gelir (sırayı sen belirlersin: [Sırayı düzenle](sira-duzenleme.md)). Açıklama: "Alma sırasıyla. Her
   öğrencide "Bindi" ya da "Binmedi"ye bas; işaret hemen velisine gider."
4. Öğrenciyi aldığında satırındaki büyük **"Bindi"**ye bas. Düğme "Gönderiliyor..." olur, sonra onay işaretiyle seçili kalır; satırda
   "Bindi 07:42" yazar. Velisine "Zeynep 07:42'de servise bindi." gider.
   - Sefer başlatılmadıysa **ilk "Bindi"** seferi kendiliğinden açar: "Sefer başladı; konumun servisteki öğrencilerin velilerine
     görünüyor." ve telefon konum göndermeye başlar.
5. Öğrenci gelmediyse **"Binmedi"**. Velisine "Zeynep bu sabah servise binmedi." gider (velisi bugün sabah için "binmeyecek" dediyse
   gitmez).
6. Yanlış bastıysan öbür düğmeye bas: "Bindi" bildirildikten sonra "Binmedi"ye çevirirsen veliye bir kez "Düzeltme: Zeynep bu sabah
   servise binmedi." gider; "Binmedi"den "Bindi"ye çevirirsen (daha önce gitmediyse) "bindi" bildirimi gider. Aynı bildirim ikinci
   kez gitmez.
7. Evi işaretli öğrencide **"Yol tarifi"** ile Google Haritalar'da yol tarifini açabilirsin; harita kartında evler sıra numarasıyla
   durur.
8. Velisi "binmeyecek" dediği öğrencinin satırı soluktur ve "Velisi: bugün binmeyecek" yazar; yine de işaretleyebilirsin.
9. Okula gelince en alttaki büyük **"Okula vardık"**a bas. Altındaki not: "Sefer biter; servise binen öğrencilerin velilerine "okula
   vardı" bildirimi gider. Bindi ve Binmedi buna kadar değiştirilebilir."
10. Tarayıcı sorar: "Okula varıldı mı? Sefer biter; servise binen öğrencilerin velilerine "okula vardı" bildirimi gider. Sonra
    işaretler değiştirilemez." (işaretlenmemiş öğrenci varsa başında "2 öğrenci işaretlenmedi."; velisi "binmeyecek" diyenler bu
    sayıya girmez).
11. Onaylayınca sefer biter, konum gönderimi durur, sayfa en üste kayar ve "Okula varıldı; sefer bitti. 5 öğrencinin velisine haber
    gitti." yazar. "Bindi" işaretli her öğrencinin velisine "Zeynep 08:05'te okula vardı." gider (bir kez). İkinci kez basılırsa
    "Okula varış zaten kaydedildi."
12. Artık üst kartta "Okula varıldı; sabah yoklaması kapandı." yazar, liste "Bugünün işaretleri." olur, düğmelerin yerinde durum
    rozetleri durur.

"Okula vardık"a hiç basılmazsa: sabah aralığı bitince sefer (aralık içinde başladıysa) 60 dakika daha sürer, sonra kapanır; 45 dakika
konum gelmeyen sefer de kapanır. Bu durumda "okula vardı" bildirimi gitmez, işaretlenmemiş öğrenciler "işaretlenmedi" sayılır.

### Veli

- Bildirimler: "Zeynep 07:42'de servise bindi.", "Zeynep bu sabah servise binmedi.", gerekirse "Düzeltme: Zeynep bu sabah servise
  binmedi.", sonra "Zeynep 08:05'te okula vardı." Bildirime dokununca o çocuğun servis sayfası açılır
  ([Servis bildirimleri](servis-bildirimleri.md)).
- Servis kartında "Bu sabah" başlığı ve rozet: "Bindi 07:42" (yeşil), okula varınca "Okula vardı 08:05" ve yanında "Bindi 07:42";
  "Bu sabah binmedi" (kırmızı); "Bu sabah binmeyecek" (gri, senin işaretin); işaretlenmemişse "Henüz binmedi" ya da sefer bittiyse
  "Servis okula vardı" ([Servisim ve servis kartı](servisim.md)).
- Henüz binmediyse sıra: "Zeynep 5. sırada, önünde 2 öğrenci kaldı" (sabah önünde sayılanlar: sırada önde olup henüz işaretlenmemiş
  ve "binmeyecek" denmemiş öğrenciler).
- Evi işaretliyse servis eve 500 m ve 100 m kala bildirim ([Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md)).

### Öğrenci

Kendi "Servisim" sayfasında aynı rozetleri ve sırayı görür ("5. sırada, önünde 2 öğrenci kaldı"). Yoklama bildirimleri öğrenciye
gitmez, yalnız veliye; yaklaşma bildirimi öğrenciye de gider.

### Müdür, öğretmen ve çalışan (servis yönetimi)

Servisin "Bugünkü yoklama" penceresinde salt okunur: sayılar, "Sefer başladı: 07:36 · Okula varış: 08:12.", her öğrencinin durumu
([Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md)).

### Tasarımda (Tasarım 1 önizlemesi)

- Üst kart: "Sabah yoklaması", "Bugün · 07:00–09:20"; sefer sürerken "Konumun öğrencilere ve velilere görünüyor" ve "başlangıç
  07:36"; bitince "Sabah seferi bitti · okula varış 08:12" ve "İşaretler artık değiştirilemez."
- Sefer sürerken listenin üstünde **"Sıradaki"** kartı: "2. durak · Can Yılmaz · Lale Sok. 3" ve **"Yol tarifi"**; herkes
  işaretlenince "Okul · Test Ortaokulu" ve yol tarifi. Altında harita: kırmızı kesik çizgi kalan yol, turuncu numara sıradaki ev.
- "Okula vardık" onayı ayrı pencere: başlık "Okula varıldı mı?", metin "2 öğrenci işaretlenmedi: Elif, Can. Okula vardıktan sonra
  işaretler değiştirilemez.", düğmeler **"Vazgeç"** / **"Okula vardık"**. Hiç "Bindi" yoksa ileti "Sabah yoklaması kapandı; servise
  binen öğrenci yok."
- 3 Ekim kararı: sefer "Okula vardık" ile bitince "Bindi" işaretlenmemiş ve o gün "binmeyecek" bildirilmemiş her öğrencinin velisine
  "Önemli" öncelikli "bugün servise binmedi" uyarısı ([Servise binmedi uyarısı](servise-binmedi-uyarisi.md)).

## Kurallar ve sınırlar

- **Yalnız sabah servis saatinde** (ya da aralık içinde başlamış seferin 60 dakikalık uzatmasında) işaret atılır. Dışında: "Yoklama
  sabah 07:00–09:20 ve akşam 16:30–19:00 arasında açılır."; "Okula vardık" sabah değilse: ""Okula vardık" sabah yoklamasında, sabah
  servis saatinde işaretlenir."
- **Sabahın seçenekleri** yalnız "Bindi" ve "Binmedi": başka bir değer gelirse "Sabah yoklamasında "Bindi" ya da "Binmedi" seçilir."
- **Sefer yalnız aralık içinde başlar;** yönü saatten gelir (sabah okula gidiş). Aralık dışında "Seferi başlat": "Sefer yalnız servis
  saatlerinde başlar: sabah 07:00–09:20 ve akşam 16:30–19:00." Sefer zaten sürüyorsa "Sefer zaten sürüyor."
- **Aynı anda** iki "ilk Bindi" (ya da "Seferi başlat"a iki kez basmak) tek sefer açar.
- **"Okula vardık"tan sonra** sabah işaretleri değişmez ("Okula varıldı; sabah yoklaması kapandı."); seferi yeniden başlatmak da olmaz.
- **Bildirimler** yalnız velilere (öğrenciye gitmez), saat Türkiye saatiyle, adın yalnız ilk adı (soyadı yok); saatin eki okunuşuna
  göre: "07:42'de", "08:05'te", "07:30'da". Her olay (tarih, dönem, öğrenci, olay) için bir kez.
- **"Binmeyecek" varken** "Binmedi" bildirimi gitmez (önce "Bindi" bildirildiyse yalnız düzeltme gider).
- **Yaklaşma bildirimi** sabah yalnız henüz işaretlenmemiş ve "binmeyecek" denmemiş öğrenciye gider (bindiyse artık gerekmez).
- **Konum** yalnız https'te ve sayfa açıkken gider; yoklama https olmadan da alınır. Bilinen açık: http'de ilk "Bindi" seferi açar ve
  "Sefer başladı; konumun …" yazar ama o telefondan konum gitmez; sefer kutusu "Sefer açık ama bu telefondan konum gitmiyor." der.
- **Saklama:** yoklama ve "okula varış" kaydı 30 gün sonra silinir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Akşam seferi](aksam-seferi.md) — dönüş akışı.
- [Yoklama sayfası](yoklama-sayfasi.md) — sayfanın düzeni.
- [Servis bildirimleri](servis-bildirimleri.md), [Servise binmedi uyarısı](servise-binmedi-uyarisi.md) (tasarım).
- [Sırayı düzenle](sira-duzenleme.md), [Binmeyecek](binmeyecek.md), [Servis saatleri](servis-saatleri.md).
- [Canlı konum ve servis haritası](canli-konum-ve-harita.md), [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md).
- [Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md), [Servisim ve servis kartı](servisim.md).

**İlgili:**

- [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md),
  [Telefon bildirimi](../bildirim/telefon-bildirimi.md).
- [Önemli etiketi](../mesaj/onemli-etiketi.md) — binmedi uyarısının önceliği (tasarım).
- [Devamsızlık bildirimi](../devamsizlik/devamsizlik-bildirimi.md) — derse gelmeyen öğrencinin velisine giden benzer bildirim.

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/servis/yoklama` (sabah `bindi` /
  `binmedi`; ilk `bindi` `seferAc`), `POST /api/servis/sefer-basla`, `POST /api/servis/okula-vardik`, `yoklamaBildir`,
  `onundeKac`; dönem ve uzatma [sunucu/yardimci/servis-pencere.md](../../sunucu/yardimci/servis-pencere.md) (`saatEki`, `ilkAd`).
- Depo: [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md) (`yoklamaYaz`, `gunBasladi`, `gunBitti`,
  `olayIlkMi`), [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) (`seferAcYaDaBul`, `servisSeferiniBitir`).
- Ön yüz: [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) — `sy-isaret`,
  `syIsaretGonder`, `sy-sefer-basla`, `sy-okula-vardik`, `sySeferHtml`, `syAltHtml`; konum
  [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md); velinin kartı
  [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) (`servisDurumu`).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (bindi/binmedi, düzeltme bir kez, binmeyecek varken
  bildirim yok, "Okula vardı HH:MM", aralık dışı engel).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Sabah").

## Sık sorulanlar

- **"Seferi başlat"a basmak zorunda mıyım?** Hayır; ilk "Bindi" seferi kendiliğinden başlatır. Önceden basarsan velilere ilk evden
  önce de aracın yeri görünür.
- **Yanlışlıkla "Bindi"ye bastım.** "Binmedi"ye bas; veliye bir kez "Düzeltme: …" gider. "Okula vardık"tan sonra değiştirilemez.
- **"Okula vardık"ı unuttum.** Sefer saat bitince (60 dakikalık uzatmayla) kendiliğinden kapanır ama velilere "okula vardı"
  bildirimi gitmez.
- **Veli "binmeyecek" demişti, "Binmedi"ye bastım; veliye bildirim gitti mi?** Hayır, o dönem için "binmeyecek" dediyse gitmez.

## Sırada

- 3 Ekim kararı: "bugün servise binmedi" uyarısı ("Önemli" önceliğinde) — kodu Linux'ta, önizlemeye belgeler bitince eklenecek.
- Linux kodlaması (Tasarım 1): "Sıradaki" kartı ve kalan yol çizgisi.
- Android yerel uygulama: sabah yoklaması ve arka planda konum gönderen sefer servisi.
- Güvenlik denetimi / TAM DEBUG: http'de ilk "Bindi"nin yanıltıcı "Sefer başladı" iletisi.
