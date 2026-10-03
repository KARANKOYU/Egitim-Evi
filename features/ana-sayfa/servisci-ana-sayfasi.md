# Ana sayfa · Servisçinin ana sayfası

**Durum:** Kodda var; tasarımda ek olarak servisçinin Yoklama'dan ayrı bir ana sayfası olur: başlıkta bugünün tarihi ve servisin adı, plakası, dört kutucuk (Yoklama, Mesajlar, Takvim, Hatırlatıcılar), "Bugünkü seferler" ve "Gelmeyecekler" sütunları; Yoklama menüde ikinci satıra iner (kullanıcı 1 Ekim: "servisci e ana sayfa olabilir bence"; Tasarım 1 önizlemesi).

Servisçinin girişten sonra ilk gördüğü sayfa: bugünkü kodda doğrudan servis yoklaması, tasarımda günün seferlerini ve gelmeyecek öğrencileri özetleyen ayrı bir ana sayfa.

## Ne işe yarar

Servisçi (şoför) telefonundan, araç başında girer; ilk işi yoklamadır. Bu yüzden bugünkü kodda servisçinin ana sayfası
yoklama ekranının kendisidir: girer girmez "Bindi / Binmedi" düğmeleri önündedir. Kullanıcı 1 Ekim'de servisçiye de bir ana
sayfa olabileceğini söyledi; tasarımda ana sayfa günün özetidir (sabah ve akşam seferinin durumu, velilerin "binmeyecek"
dediği öğrenciler), yoklama bir dokunuş ötededir.

## Nereden açılır

- **Girişten sonra kendiliğinden.** Servisçi hesabını okul açar; servisçi okulunun adresinden (`/school/<okulun-adı>`) girer.
- **Bugünkü kodda:** sol menünün ilk satırı **"Yoklama"** (servis simgesi) ana sayfanın kendisidir. Servisçinin menüsünde
  yalnız **"Yoklama"**, **"Mesajlar"**, **"Takvim"**, **"Hatırlatıcılar"** vardır (en altta Ayarlar ve Çıkış). Girişte ya da
  sayfa yenilenince adres çubuğundaki sayfa bu dördünden ya da Ayarlar'dan biri değilse ana sayfa açılır.
- **Tasarımda:** menü **"Ana sayfa"**, **"Yoklama"**, **"Mesajlar"**, **"Takvim"**, **"Hatırlatıcılar"**
  ([Sol menü](../menu-ve-arama/sol-menu.md)).

## Adım adım

### Servisçi

**Bugünkü kodda (ana sayfa = Yoklama):**

1. Başlık **"YOKLAMA"**; altında tek servisin varsa servisin adı ve plakası (ör. "Servis 3 · <plaka>"), birden çok servisin
   varsa okulun adı ve servis düğmeleri (seçili olan vurgulu; basınca o servisin yoklaması açılır).
2. Servisin yoksa yalnız: **"Sana henüz bir servis atanmadı. Okul yönetimi servise atayınca öğrenciler burada görünür."**
3. Bağlantı güvenli değilse turuncu uyarı: **"Konum yalnızca güvenli (https) bağlantıda gönderilir; yoklama yine de alınır.
   Okulun sitesine https ile gir."**
4. Altında sırasıyla: dönemin kartı (**"Sabah yoklaması"** + **"Bugün · 07:00–09:20"**, sayılar, "Seferi başlat"), öğrenci
   listesi (sabah **"Bindi" / "Binmedi"**, akşam **"Geldi" / "Gelmedi"** → **"Başlat"** → **"İndi"**), en altta **"Okula
   vardık"** ya da **"Başlat"**, **"Notlar"** kartı (**"Not yaz"**), velilerin "binmeyecek" işaretleri ve **"Harita"**. Bunların
   hepsi [Yoklama sayfası](../servis/yoklama-sayfasi.md), [Sabah seferi](../servis/sabah-seferi.md) ve
   [Akşam seferi](../servis/aksam-seferi.md)'nde adım adım anlatılır.
5. Servis saatleri dışında liste bir sonraki aralığın sırasıyla görünür, işaret düğmesi çıkmaz ("Sıradaki: yarın sabah
   07:00–09:20."; [Servis saatleri](../servis/servis-saatleri.md)).
6. Sayfa açıkken dakikada bir kendiliğinden tazelenir (velinin az önceki "binmeyecek"i, dönem değişimi).
7. Okul "Servis" bölümünü kapattıysa: başlık "YOKLAMA" ve **"Servis bölümü okulunda kapalı. Okul müdürü Özellikler sayfasından
   açabilir."** ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).

**Tasarımda (Tasarım 1 önizlemesi; ayrı ana sayfa):**

1. Başlık bugünün tarihi (**"Perşembe, 1 Ekim"**), altında **"Servis 3 · <plaka> · bugün 2 sefer"**.
2. Dört kutucuk, hepsi aynı boyda ([Kutucuklar](kutucuklar.md)):

   | Kutucuk | Renk | Alt yazı | Sayı | Bastığında |
   |---|---|---|---|---|
   | **Yoklama** | sarı | saate göre: "sabah yoklaması açık", "sabah seferi yolda", "sabah bitti", "eve dönüş açık", "eve dönüş yolda", "bugün bitti"; iki aralığın arasında "eve dönüş 16:30" (akşam aralığının başı) | — | [Yoklama sayfası](../servis/yoklama-sayfasi.md) |
   | **Mesajlar** | yeşil | "1 okunmamış" | okunmamış sayısı | [Mesajlar](../mesaj/kutu.md) |
   | **Takvim** | turuncu | "29 Ekim tatil" (yaklaşan tatil ya da değişiklik) | — | [Takvim sayfası](../takvim/takvim-sayfasi.md) |
   | **Hatırlatıcılar** | gri | "araç muayenesi" (sıradaki hatırlatıcın) | — | [Hatırlatıcılar sayfası](../hatirlatici/hatirlaticilar-sayfasi.md) |

3. Kutucukların altında iki sütun (telefonda alt alta):
   - **Solda "Bugünkü seferler"**, sağında **"hepsi →"** (Yoklama'ya). İki satır:
     - **"Sabah"** · **"Sabah seferi · 07:00–09:20"** · altında sayılar, ör. **"6 öğrenci · 5 bindi · 1 binmedi"**, bittiyse
       sonuna **"· okula varış 08:05"**;
     - **"Akşam"** · **"Eve dönüş · 16:30–19:00"** · altında ör. **"6 öğrenci · 1 binmeyecek"**, sefer başlayınca **"… serviste ·
       … gelmedi · … eve bırakıldı"**.
     Sağda seferin durumu: **"Başlamadı"** (turuncu), **"Yolda"** (mavi), **"Bitti"** (yeşil), işaretlenmeden aralığı biten
     dönemde **"Kapandı"** (gri). İşaretlenmemişler sayılarda "bekliyor", dönem kapandıysa "işaretlenmedi" diye geçer. Satıra
     basınca Yoklama açılır.
   - **Sağda "Gelmeyecekler"**: velilerin (ya da öğrencinin) "binmeyecek" dediği öğrenciler, bugünden 7 gün sonrasına:
     solda baş harfler, **"Deniz Koç · 7-A"**, altında **"bugün · sabah ve akşam · veli bildirdi"** ya da **"yarın · akşam · veli
     bildirdi"**, sağda **"Bugün"**, **"Yarın"** ya da tam tarih ("3 Ekim Cumartesi"). Kimse bildirmediyse **"Bildirilen yok"** ·
     "velilerin "binmeyecek" işaretleri burada görünür". Satıra basınca Yoklama açılır ([Binmeyecek işareti](../servis/binmeyecek.md)).
4. Yoklama ayrı sayfadır (başlığı "Yoklama", altında "Servis 3 · <plaka> · 1 Ekim Perşembe"); ayrıntısı
   [Yoklama sayfası](../servis/yoklama-sayfasi.md).
5. Bildirim izni verilmemişse **"Bildirimlere izin ver"** şeridi, uygulamayı kurmamışsan **"Eğitim Evi'ni telefonuna kur"**
   kartı, başlığın önünde **"Yenile"**.
6. **Tanımda olup önizlemede çizilmeyen:** eğitim içerikleri öneri şeridi tanımda "giriş yapmış kişinin ana sayfasına" konur;
   servisçide olup olmayacağı açık ([Ana sayfadaki öneri şeridi](../egitim-icerikleri/ana-sayfa-seridi.md)).

## Kurallar ve sınırlar

- **Dönemi sunucu söyler,** telefonun saati değil: okulun servis saatleri (müdür seçer) ve Türkiye saati
  ([Servis saatleri](../servis/servis-saatleri.md)). Tasarımdaki kutucuğun ve sefer satırlarının durumu da bu aralıklara göre değişir.
- **Servisçinin sayfaları** yalnız Yoklama (ana sayfa), Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar'dır; açılışta başka bir
  adres ana sayfaya döner. Servisçide "+ Ekle" ve portal listesi yoktur.
- **Kapalı bölüm:** "Servis" kapalıysa yoklama uçlarının hepsi reddedilir (403) ve sayfa kapalı iletisini gösterir.
- **"Gelmeyecekler"** yalnız servisin öğrencilerini ve bugünden en çok 7 gün sonrasını gösterir; aynı öğrencinin aynı gün için
  sabah ve akşam işaretleri tek satırda birleşir ("sabah ve akşam").
- Yoklamanın kendi kuralları (işaretin kilitlenmesi, "Okula vardık"tan sonra değişmemesi, 60 dakikalık uzatma…)
  [Yoklama sayfası](../servis/yoklama-sayfasi.md)'ndadır.

## Kardeşler ve ilgili

**Kardeşler:** [Kutucuklar](kutucuklar.md) · [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) ·
[Müdürün ana sayfası](mudur-ana-sayfasi.md) · [Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) ·
[Velinin ana sayfası](veli-ana-sayfasi.md) · [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) ·
[Yöneticinin ana sayfası](yonetici-ana-sayfasi.md). Klasör: [Ana sayfa](README.md).

**İlgili:**

- [Yoklama sayfası](../servis/yoklama-sayfasi.md), [Sabah seferi](../servis/sabah-seferi.md), [Akşam seferi](../servis/aksam-seferi.md),
  [Servis saatleri](../servis/servis-saatleri.md), [Binmeyecek işareti](../servis/binmeyecek.md),
  [Velilere not yaz](../servis/gunluk-not.md), [Sırayı düzenle](../servis/sira-duzenleme.md),
  [Canlı konum ve harita](../servis/canli-konum-ve-harita.md), [Servisçi hesabı](../servis/servisci-hesabi.md).
- [Takvim sayfası](../takvim/takvim-sayfasi.md), [Hatırlatıcılar sayfası](../hatirlatici/hatirlaticilar-sayfasi.md),
  [Mesaj kutusu](../mesaj/kutu.md).
- Rol kapısı: [Servisçi](../roller/servisci.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — `SAYFALAR.ana` servisçide
  `servisYoklamaSayfasi()` döner; [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) —
  sayfanın tamamı; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — servisçinin menüsü;
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — servisçinin açabildiği sayfalar.
- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) (`GET /api/servis/yoklama` ve işaret uçları).
- Görünüm: `public/css/parcalar/34-servis-yoklama.css` — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md).

## Sık sorulanlar

- **Girer girmez yoklama açılıyor; ana sayfam yok mu?** Bugünkü kodda servisçinin ana sayfası yoklamadır. Tasarımda ayrı bir ana
  sayfa olur, yoklama menüde ikinci satıra iner.
- **Saat aralığı dışında neden düğmeler yok?** Yoklama yalnız okulun servis saatlerinde açıktır; dışında sıradaki aralığın
  listesi görünür.
- **Velinin "binmeyecek" dediği öğrenciyi nereden görürüm?** Bugün Yoklama'daki listede (soluk satır ve "Velisi: bugün
  binmeyecek") ve altta velilerin işaretleri kartında; tasarımda ayrıca ana sayfadaki "Gelmeyecekler"de.

## Sırada

- Servisçinin ayrı ana sayfası (Tasarım 1: tarihli başlık, dört kutucuk, "Bugünkü seferler", "Gelmeyecekler") — Linux kodlaması.
- "Tek kişi tek hesap" (iş 19): servisçi de oturum olur (iki okulda tek hesap); ana sayfa oturuma göre.
- Android uygulaması: servisçinin Yoklama ekranı aynı uçlarla.
