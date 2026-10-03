# Ana sayfa · Öğretmenin ana sayfası

**Durum:** Kodda var; tasarımda ek olarak başlıkta bugünün tarihi ve günün özeti ("Test Ortaokulu · Matematik öğretmeni · bugün 4 dersin var · şu an 3. ders (10:10–10:50)"), altı kutucuk (Yoklama alınmamış ders sayısıyla; basınca Ders programım açılır ve şu anki dersin yoklaması üstünde gelir; Ödevler kontrol bekleyen sayısıyla; Sınavlar, Mesajlar, Sınıflarım, Ders programım), "Kontrol bekleyen ödevler" ve "Bugünkü derslerin" sütunları; sayaçlar, Ayarlar kutucuğu ve "Aktif ödevler" listesi kalkar (Tasarım 1 önizlemesi; kullanıcının 3 Ekim 19:20 yoklama kararı).

Öğretmenin girişten sonra ilk gördüğü sayfa: ödev, sınav ve yoklamaya giden kutucuklar, sınıf ve ödev sayaçları ve aktif ödevleri.

## Ne işe yarar

Öğretmen derse girip çıkarken ana sayfasından o günün işlerine ulaşır: hangi ödevin sonucu bekleniyor, kaç ödev aktif,
yoklamaya nereden girilir. Tasarımda ana sayfa günün akışına göre konuşur: hangi derstesin, hangi dersin yoklaması alınmadı,
hangi ödev kontrol bekliyor.

## Nereden açılır

- **Girişten sonra kendiliğinden.** Öğretmen yetişkin hesabıyla girer; tek okulu varsa doğrudan o okulun öğretmen oturumuna,
  birden çok oturumu varsa önce seçme ekranına düşer ([Portal seçme ekranı](../portallar/portal-secme-ekrani.md)).
- **Sol menünün ilk satırı:** **"Ana Sayfa"** (tasarımda **"Ana sayfa"**; [Sol menü](../menu-ve-arama/sol-menu.md)).
- Başka bir okuldaki öğretmen oturumuna geçince o okulun öğretmen ana sayfası açılır ([Portala geçiş](../portallar/portala-gecis.md)).

## Adım adım

### Öğretmen

**Bugünkü kodda:**

1. Başlık **"EĞİTİM EVİNE HOŞ GELDİNİZ"**, altında **"Merhaba Ayşe — Matematik Öğretmen · Test Ortaokulu"** (adının ilk
   kelimesi, branşın varsa branşın, rolün ve okulun). Okulda birden çok eğitim yılı varsa en üstte "Eğitim yılı" seçicisi.
2. Dört renkli kutucuk ([Kutucuklar](kutucuklar.md)):

   | Kutucuk | Renk | Alt yazı | Sağ üstteki sayı | Bastığında |
   |---|---|---|---|---|
   | **Ödevler** | turuncu | "3 aktif ödev" ya da "Aktif ödev yok" | aktif ödev sayısı | [Ödevler](../odev/liste.md) |
   | **Sınavlar** | mavi | "Sınav grupları ve notlar" | — | [Sınavlar](../sinav/sinavlar-listesi.md) |
   | **Yoklama** | yeşil | "Derse katılım al" | — | [Ders yoklaması](../devamsizlik/ders-yoklamasi.md) |
   | **Ayarlar** | gri | "Hesap bilgilerin" | — | [Ayarlar](../ayarlar/hesap-ayarlari-sayfasi.md) |

3. Üç sayaç yan yana: **"Sınıfım"** (ödev verebildiğin sınıfların sayısı; "Sınıfsız öğrenciler" kutusu sayılmaz),
   **"Aktif ödev"**, **"Sonuçlanan ödev"** (aktif olmayan her ödevin).
4. Hiçbir derse atanmadıysan mavi bilgi kutusu: **"Henüz bir dersin yok. Okul müdürünün seni bir derse ataması gerekiyor."**
5. Okulda "Ödevler" bölümü açıksa **"Aktif ödevler"** başlığı ve verdiğin, henüz sonuçlandırmadığın bütün ödevler; hiç yoksa
   **"Aktif ödev yok. Ödevler sayfasından yeni ödev verebilirsin."** Her satırda:
   - ödevin adı, quizli ödevde **"Quiz"** etiketi;
   - "Matematik · 28 öğrenci · Son teslim: …" (son teslimsiz ödevde "süresiz");
   - **"28 öğrenciden 18 kişi açtı"** (herkes açmadıysa turuncu; [Açıldı / açılmadı](../odev/acilma-bilgisi.md));
   - quizli ödevde quiz özeti (soru sayısı, süre, kaç öğrencinin bitirdiği);
   - sağda durum: **"Aktif · 3 gün"**, **"Aktif · bugün son gün"** (mavi) ya da teslim saati geçtiyse **"Süresi doldu"** (kırmızı);
   - **"Sonuçlandır"** düğmesi: ödevin kontrol penceresini açar ([Sonuçlandırma](../odev/sonuclandirma.md));
   - kırmızı **"Sil"**: "Bu ödev silinsin mi? Geri alınamaz." onayından sonra siler ve seni Ödevler sayfasına götürür
     ([Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md)).

**Tasarımda (Tasarım 1 önizlemesi):**

1. Başlık bugünün tarihi (**"Perşembe, 1 Ekim"**), altında **"Test Ortaokulu · Matematik öğretmeni · bugün 4 dersin var · şu an
   3. ders (10:10–10:50)"**.
2. Altı kutucuk, hepsi aynı boyda:

   | Kutucuk | Renk | Alt yazı (örnek) | Sayı | Bastığında |
   |---|---|---|---|---|
   | **Yoklama** | kırmızı | "2 dersin yoklaması alınmadı" ya da "bu hafta hepsi alındı" | bu hafta saati gelmiş ve yoklaması alınmamış ders sayısı | Ders programım açılır ve şu anki dersin yoklama penceresi üstünde açılır ([Ders programından yoklama](../devamsizlik/programdan-yoklama.md)) |
   | **Ödevler** | turuncu | "2 kontrol bekliyor" | kontrol bekleyen ödev sayısı | [Ödevler](../odev/liste.md) |
   | **Sınavlar** | mavi | "1 değer girilecek" | — | [Sınavlar](../sinav/sinavlar-listesi.md) |
   | **Mesajlar** | yeşil | "2 okunmamış" | okunmamış sayısı | [Mesajlar](../mesaj/kutu.md) |
   | **Sınıflarım** | mor | "3 sınıf · 82 öğrenci" | — | [Sınıflarım](../siniflar-dersler/siniflarim.md) |
   | **Ders programım** | camgöbeği | "şimdi: 7-A" ya da (ders yokken) "bugün 4 ders" | — | [Ders programım](../ders-programi/programim.md) |

   Menüde ayrı **"Yoklama"** satırı yoktur (kullanıcı 3 Ekim: yoklamaya ders programından girilir); ana sayfadaki kutucuk ve
   eski "yoklama" adresi seni Ders programım'a götürür. Ayarlar kutucuğu yoktur (Hesap ayarları profil menüsünde), sayaçlar yoktur.
3. Kutucukların altında iki sütun (telefonda alt alta):
   - **Solda "Kontrol bekleyen ödevler"**, sağında **"hepsi →"** (Ödevler'e). Satırda dersin kısaltması (MAT), ödevin adı,
     altında **"7-A · 18 / 28 teslim · son gün bugün"** ya da quizli ödevde **"8-B · quiz · 24 / 26 çözdü"**, sağda **"Kontrol
     et"**. Satıra basınca ödevin kontrol ekranı açılır ([Sonuçlandırma](../odev/sonuclandirma.md),
     [Teslimleri inceleme](../odev/teslimleri-inceleme.md)).
   - **Sağda "Bugünkü derslerin"**, sağında **"hepsi →"** (Ders programım'a). Yalnız o gün dersin olan saatler, her biri bir
     satır (önizlemede Perşembe: 1. ders 8-B, 3. ders 7-A, 5. ders 7-C, 6. ders 8-B): solda **"3. ders"**, ortada **"7-A ·
     Matematik · şu an"**, altında saat **"10:10–10:50"**, sağda durum: geçmiş ya da şu anki derste **"Alındı"** (yeşil) ya da
     **"Yoklama al"** (turuncu); gelecek derste durum yok. Şu anki ders vurguludur. Geçmiş ya da şu anki derse basınca o dersin
     yoklaması açılır; gelecek derse basınca dersin ayrıntısı.
4. Yoklamayı kaydedince ana sayfadaki "Bugünkü derslerin" satırı "Alındı" olur, "Yoklama" kutucuğunun sayısı düşer ve o derse
   ait **"Yoklama alınmadı"** bildirimi kalkar ([Yoklama alınmadı uyarısı](../devamsizlik/yoklama-alinmadi-uyarisi.md)).
5. Bildirim panelinde ders başlamadan **"3. ders 10 dakika sonra başlıyor"** bildirimi ([Ders öncesi bildirim](../bildirim/ders-oncesi-bildirim.md)).
6. Uygulamayı kurmamışsan **"Eğitim Evi'ni telefonuna kur"** kartı, bildirim izni verilmemişse **"Bildirimlere izin ver"**
   şeridi, başlığın önünde **"Yenile"**.
7. **Tanımda olup önizlemede çizilmeyen:** eğitim içerikleri öneri şeridi ([Ana sayfadaki öneri şeridi](../egitim-icerikleri/ana-sayfa-seridi.md)).

### Ek rolü olan öğretmen ve veli olan öğretmen

- Müdürün verdiği **ek rol** (Müdür Yardımcısı, Rehber Öğretmen…) bugünkü kodda ana sayfayı değiştirmez: ek bölümler menüde rolün
  adıyla bir başlık altında durur, kutucuk olmaz ([Roller ve yetkiler](../roller-yetkiler/README.md)).
- Öğretmen aynı zamanda veliyse bugünkü kodda menünün sonunda **"Velisi olduğum"** bölümü durur; ana sayfa yine öğretmenindir.
  Tasarımda çocuğun ayrı veli oturumu olur ([Velinin ana sayfası](veli-ana-sayfasi.md)).

## Kurallar ve sınırlar

- **Veri:** ödev bölümü açıksa `GET /api/assignments/hedefler` (sınıfların) ve `GET /api/assignments` (verdiğin ödevler, seçili
  eğitim yılı) birlikte istenir; kapalıysa hiç istek atılmaz.
- **"Aktif"** = henüz sonuçlandırmadığın ödev; son teslim saati geçmiş olsa da burada kalır ("Süresi doldu").
- **Kapalı bölüm:** okul "Ödevler"i kapattıysa Ödevler kutucuğu ve "Aktif ödevler" listesi çıkmaz; "Sınavlar" ya da
  "Devamsızlık" kapalıysa o kutucuk düşer ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Bilinen açıklar (kod okumasına göre, kod değiştirilmedi):**
  - **Kutucuklar yetkiye bakmaz.** Menü "Ödevler", "Sınavlar", "Yoklama"yı Öğretmen rolündeki yetkilere göre gösterir; ana
    sayfadaki aynı kutucuklar yalnız okulun kapattığı bölümlere bakar. Müdür sınav yetkisini kapattıysa menüde "Sınavlar" yoktur
    ama kutucuk durur; basarsan sayfa açılır, sınav açmaya ya da not girmeye kalkınca sunucu yetki hatası verir.
  - **Ödev bölümü kapalıyken yanlış ileti.** Sınıf sayısı da ödev ucundan geldiği için dersi olan öğretmen de "Sınıfım 0" ve
    "Henüz bir dersin yok. Okul müdürünün seni bir derse ataması gerekiyor." görür.
  - **Dil bilgisi:** başlıkta "Matematik Öğretmen" çıkar ("Matematik öğretmeni" olmalı; tasarımda düzeltilmiş).

## Kardeşler ve ilgili

**Kardeşler:** [Kutucuklar](kutucuklar.md) · [Müdürün ana sayfası](mudur-ana-sayfasi.md) ·
[Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) · [Velinin ana sayfası](veli-ana-sayfasi.md) ·
[Servisçinin ana sayfası](servisci-ana-sayfasi.md) · [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) ·
[Yöneticinin ana sayfası](yonetici-ana-sayfasi.md). Klasör: [Ana sayfa](README.md).

**İlgili:**

- [Ödev listesi](../odev/liste.md), [Ödev verme](../odev/odev-verme.md), [Sonuçlandırma](../odev/sonuclandirma.md),
  [Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md), [Açıldı / açılmadı](../odev/acilma-bilgisi.md).
- [Ders yoklaması](../devamsizlik/ders-yoklamasi.md), [Ders programından yoklama](../devamsizlik/programdan-yoklama.md),
  [Yoklama alınmadı uyarısı](../devamsizlik/yoklama-alinmadi-uyarisi.md).
- [Ders programım](../ders-programi/programim.md), [Sınıflarım](../siniflar-dersler/siniflarim.md),
  [Sınavlar listesi](../sinav/sinavlar-listesi.md).
- [Ders öncesi bildirim](../bildirim/ders-oncesi-bildirim.md).
- [Roller ve yetkiler](../roller-yetkiler/README.md) — Öğretmen rolündeki yetkiler, ek roller.
- Rol kapıları: [Öğretmen](../roller/ogretmen.md), [Çalışan](../roller/calisan.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — `SAYFALAR.ana`'nın öğretmen kolu,
  `stat`; [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `odevListesiOgretmen`,
  `odevAc`; [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — "Sonuçlandır" ve "Sil" düğmeleri;
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — menünün yetkiye bakan kuralları.
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`GET /api/assignments`, `GET /api/assignments/hedefler`).
- Görünüm: `public/css/parcalar/10-ana-sayfa-kutucuklari.css`, `04-kartlar.css` (`.grid.k4`, `.stat`), `02-form.css`
  (`.msg.bilgi`) — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (her kutucuğun bir sayfası var).

## Sık sorulanlar

- **"Henüz bir dersin yok" yazıyor ama derslerim var.** Okulun "Ödevler" bölümü kapalı olabilir (bilinen açık); ders
  programına ve Sınıflarım'a bak. Gerçekten dersin yoksa müdürün seni bir derse ataması gerekir.
- **Ana sayfada "Sınavlar" var ama menüde yok.** Müdür sınav yetkini kapatmış; kutucuk yetkiye bakmıyor (bilinen açık).
- **Yoklamaya nereden girerim?** Bugünkü kodda "Yoklama" kutucuğundan ya da menüden; tasarımda Ders programım'daki dersten (ana
  sayfadaki "Yoklama" kutucuğu da oraya götürür).

## Sırada

- Tasarım 1'deki ana sayfa (tarihli başlık, altı kutucuk, "Kontrol bekleyen ödevler", "Bugünkü derslerin") ve 3 Ekim yoklama
  kararı (menüdeki "Yoklama"nın kalkması, kutucuğun alınmamış ders sayısı) — Linux kodlaması.
- "Çalışan olarak ekleme" (iş 2): öğretmen görevi olmayan çalışanın ana sayfası ([Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md)).
- Tam debug: kutucukların yetkiye bakması, ödev kapalıyken ileti, "Matematik öğretmeni".
- Android uygulaması: öğretmenin ana sayfası (bugünkü dersler; "Şu an — yoklama al").
