# Servis · Sırayı düzenle

**Durum:** Kodda var; tasarımda ek olarak servisçi sıra penceresinden öğrenci ekler ve listeden çıkarır, sabah ve akşam sırası tek "Kaydet"le birlikte kaydedilir, pencere saat dışındaki "Yoklama şu an kapalı" kartından da açılır.

Servisçinin sabah alma ve akşam bırakma sırasını yukarı / aşağı düğmeleriyle ayarladığı pencere; veli ve öğrenci bu sırayı "5.
sırada, önünde 2 öğrenci" diye görür.

## Ne işe yarar

Kullanıcının isteği (26 Eylül): "servisci kendi öğrenci listesinide gircek veya okul ... ve kaçıncı olduğu sırada görüntülebilcek ve
kaç kişi kaldığı". Servis her sabah evleri aynı sırayla dolaşır; servisçi bu sırayı bir kez kurar, Yoklama listesi ve haritadaki
numaralar bu sıraya göre dizilir, veli de çocuğunun önünde kaç öğrenci kaldığını görür. Sabah (alma) ve akşam (bırakma) sırası
ayrıdır: akşam genellikle ters sıradır.

## Nereden açılır

Servisçinin [Yoklama sayfası](yoklama-sayfasi.md) → liste kartının başlığının sağında **"Sırayı düzenle"** (serviste en az iki
öğrenci varsa). Saat dışında da açılır.

Tasarımda: ayrıca saat dışındaki "Yoklama şu an kapalı" kartının altında **"Sırayı düzenle"**.

## Adım adım

### Servisçi

1. **"Sırayı düzenle"**ye bas. "Sırayı düzenle" penceresi açılır; o anki dönemin sırası seçili gelir (saat dışında sıradaki
   aralığın dönemi).
2. Üstte iki sekme: **"Sabah (alma)"** ve **"Akşam (bırakma)"**.
3. Altında: "Öğrenciyi okla yukarı ya da aşağı taşı, sonra kaydet. Veli "5. sırada, önünde 2 öğrenci" görür."
4. Numaralı liste: sıra numarası, ad, altında durak; her satırda yukarı ve aşağı ok düğmeleri ("Elif Yılmaz bir yukarı" / "bir aşağı";
   ilk satırda yukarı, son satırda aşağı kapalı).
5. Okla öğrenciyi taşı; numaralar hemen yenilenir, odak aynı öğrencinin düğmesinde kalır.
6. **"Kaydet"** ("Kaydediliyor..."): pencere kapanır, liste yenilenir, üstte "Sabah sırası kaydedildi." ya da "Akşam sırası
   kaydedildi." **"Vazgeç"** değişikliği atar.
7. Öbür dönemi de düzenlemek için pencereyi yeniden aç ve öbür sekmeye geç. Kaydetmeden sekme değiştirirsen tarayıcı sorar: "Bu
   sıradaki değişiklik kaydedilmedi. Yine de geçilsin mi?" (bir seferde tek dönem kaydedilir).

### Veli

- Servis saatinde, çocuğunun kartında: "Zeynep 5. sırada, önünde 2 öğrenci kaldı" ya da "… önünde öğrenci kalmadı"; haritanın durum
  satırında "5. sırada, önünde 2 öğrenci" ([Servisim ve servis kartı](servisim.md), [Canlı konum](canli-konum-ve-harita.md)).
- "Önünde N" hesabı:
  - **Sabah:** sırada çocuğundan önce olup henüz "Bindi" / "Binmedi" işaretlenmemiş ve "binmeyecek" denmemiş öğrenciler. Çocuğun
    işaretlendiyse ya da "binmeyecek" dediysen sıra yazmaz.
  - **Akşam:** sırada önde olup okulda "Geldi" işaretlenmiş ve henüz inmemiş öğrenciler. Çocuğun "Geldi" değilse sıra yazmaz.
- Sıra yalnız servis saatlerinde (ve sefer uzatmada sürerken) görünür.

### Öğrenci

"Servisim" sayfasında aynı satır, adsız: "5. sırada, önünde 2 öğrenci kaldı".

### Müdür, öğretmen ve çalışan (servis yönetimi)

Sırayı değiştirmezler. Servisler sayfasında öğrenciler ada göre görünür; sıra numaraları "Bugünkü yoklama" penceresinde
([Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md)). Okul yeni öğrenci ekleyince öğrenci sabah ve akşam sırasının sonuna
girer; başka servise taşınırsa orada sona geçer; yalnız durağı değişirse sırası korunur.

### Tasarımda (Tasarım 1 önizlemesi)

Kullanıcının "servisci kendi öğrenci listesinide gircek" sözüne göre servisçi listeyi de düzenler:

- Sekme altındaki not: "Sabah öğrencileri bu sırayla alırsın." / "Akşam öğrencileri bu sırayla evine bırakırsın." ve "Yukarı / aşağı
  düğmeleriyle değiştir. Veli "5. sırada, önünde 2 öğrenci" görür."
- Satırda ad · sınıf, adres; yeni eklenen öğrencide "yeni eklendi"; ok düğmelerinin yanında **"Çıkar"**. "Çıkar"a basınca satırda
  onay: "Listeden çıkarılsın mı? Velisi servisi artık görmez." — **"Vazgeç"** / **"Çıkar"** ("Elif Yılmaz listeden çıkarıldı;
  "Kaydet"e basınca kaydedilir.").
- Listenin altında **"Öğrenci ekle"**: "Öğrenci ekle" penceresinde "Ad ya da sınıf ara" kutusu, okulun bu servise kayıtlı olmayan
  öğrencileri ve her birinde **"Ekle"**; not "Okulun bu servise kayıtlı olmayan öğrencileri. Eklenen öğrenci sabah ve akşam sırasının
  sonuna konur."; boşsa "Aramana uyan öğrenci yok." ya da "Eklenecek öğrenci kalmadı."; **"Sıraya dön"**. Ekleyince "Elif Yılmaz
  sıranın sonuna eklendi; "Kaydet"e basınca kaydedilir."
- Liste boşsa "Listede öğrenci yok. "Öğrenci ekle" ile ekle."
- Sekmeler arasında geçmek değişikliği atmaz; **"Kaydet"** iki dönemi birlikte kaydeder: "Sabah ve akşam sırası kaydedildi. 1 öğrenci
  eklendi. 1 öğrenci çıkarıldı."
- Müdürün servis penceresindeki not da buna göre: "Sırayı servisçi kendi Yoklama sayfasından düzenler. Eklenen ya da çıkarılan
  öğrencinin velisine bildirim gider." ([Servisler sayfası](servisler-sayfasi.md)).
- Önizlemede yalnız "Sırayı düzenle" ok düğmeleriyle; sürükle-bırak yok (tanım: dış kütüphane yok).

## Kurallar ve sınırlar

- **Kim:** yalnız o servisin servisçisi ("Bu servis sana atanmamış", "Bu işi servisin servisçisi yapar").
- **Dönem** sabah ya da akşam olmalı: "Sıranın dönemini seç: sabah ya da akşam."
- **Liste birebir:** gönderilen sıra servisin öğrencileriyle birebir aynı olmalı (eksik, fazla, tekrar yok). Bu arada okul servise
  öğrenci ekleyip çıkardıysa: "Sıra listesi servisin öğrencileriyle birebir aynı olmalı. Sayfayı yenileyip yeniden dene."
- **Sırası olmayan** öğrenciler listede sona, ada göre dizilir.
- **Yeni öğrenci** sona eklenir; başka servise taşınan orada sona geçer; aynı serviste yalnız durağı değişirse sıra korunur (sunucu
  kuralı; ekranda durak bugün çıkarıp yeniden ekleyerek değişir, o zaman sıra sona düşer); servisten çıkan öğrencinin sırası silinir
  (aydınlatma metninde "Servis, biniş durağı ve servisteki sıra" satırı).
- **Kim görür:** öğrencinin kendisi ve velisi yalnız servis saatlerinde; servisçi ve okul yönetimi servisin listesinde.
- Sıra kaydedilince yaklaşma bildirimi listesi de tazelenir.
- Yedek: sıra okulun kaydıdır, yedeğe girer.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Yoklama sayfası](yoklama-sayfasi.md) — "Sırayı düzenle" düğmesinin yeri; liste bu sırayla dizilir.
- [Sabah seferi](sabah-seferi.md) ve [Akşam seferi](aksam-seferi.md) — alma ve bırakma.
- [Servisim ve servis kartı](servisim.md) — velinin gördüğü sıra.
- [Canlı konum ve servis haritası](canli-konum-ve-harita.md) — haritadaki numaralar.
- [Servisler sayfası](servisler-sayfasi.md) — okulun öğrenci ekleyip çıkarması.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — servisteki sıra.

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/servis/sira { servisId, donem, sira }`,
  `siraliListe`, `onundeKac`.
- Depo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) — `siraYaz`; sütunlar `servis_ogrencileri.sira_sabah`,
  `sira_aksam` (şema 028, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Ön yüz: [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) — `sy-sira`, `sySiraCiz`,
  `sySiraTasi`, `sy-sira-yukari`, `sy-sira-asagi`, `sy-sira-donem`, `sy-sira-kaydet`; velinin yazısı
  [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) (`servisSiraYazisi`).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) ("önünde N öğrenci"),
  [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) (müdürün servis ve sıra listesi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Sırayı düzenle").

## Sık sorulanlar

- **Akşam sırası sabahın tersi mi olur?** Kendiliğinden değil; iki sıra ayrı tutulur, akşamı "Akşam (bırakma)" sekmesinde ayrıca
  düzenle.
- **Sırayı değiştirdim, veli hemen görür mü?** Evet, servis saatinde kart ve harita yenilendiğinde (en geç birkaç saniye ile 30 saniye
  arasında).
- **Yeni gelen öğrenci nerede?** Okul öğrenciyi servisine yazınca sabah ve akşam listesinin sonuna girer; doğru yere taşı.
- **Servisçi öğrenciyi listeden çıkarabilir mi?** Bugün hayır, okul yönetimi çıkarır. Tasarımda evet.

## Sırada

- Linux kodlaması (Tasarım 1): servisçinin sıra penceresinden öğrenci ekleyip çıkarması (velisine bildirimle), iki dönemin tek
  "Kaydet"le kaydedilmesi.
- Android yerel uygulama: servisçinin sıra düzenlemesi.
