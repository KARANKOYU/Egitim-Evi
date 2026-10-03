# Quiz · Listelerde ve ödev penceresinde quiz

**Durum:** Kodda var; tasarımda ek olarak öğretmenin ana sayfasındaki "Kontrol bekleyen ödevler"de quizli ödev "24 / 26 çözdü" diye görünür, velinin ödev penceresinde çocuğun adıyla durum etiketi olur ve quizi bitiren öğrencinin ödevinde "Quiz gönderildi" yazar.

Quizli ödevin ödev listelerinde ve ödev pencerelerinde her role göre nasıl göründüğü: "Quiz" etiketi, durum satırı ve özet.

## Ne işe yarar

Quiz ödevin içindedir; ayrı bir "Quizler" sayfası yoktur (kullanıcının 26 Eylül sözü: "ödevin içine tanımlanır, eklerde gözükür").
Bu yüzden quizin varlığı ve durumu ödevin gösterildiği her yerde kısaca yazar: öğrenci hangi ödevde çözmediği quiz olduğunu, veli
çocuğunun bitirip bitirmediğini, öğretmen kaç öğrencinin bitirdiğini listeden görür. Soru, şık ve doğru cevap listelerde hiç yer almaz.

## Nereden açılır

- **Öğrenci:** sol menüde **"Ödevler"** ([Ödev listesi](../odev/liste.md)) ve ödevin penceresi ([Ödevin penceresi](../odev/odev-penceresi.md)).
- **Veli:** sol menüde **"Velisi olduğum"** altında **"Ödevler"** — bugün bütün çocuklarının ödevleri bir aradadır, her satırın
  başında çocuğun adı yazar — ve satıra basınca açılan pencere; ya da bir çocuğun portalını açınca menüdeki **"Ödevleri"**
  (öğrencinin listesinin aynısı, düğmesiz).
- **Öğretmen:** **"Ödevler"** listesi.
- **Müdür:** "Okul Düzeni" altında **"Ödevler"** (ders ödevleri, [Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md)) ve
  öğrencinin portalı ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).

## Adım adım

### Öğrenci

1. Ödev listesinde quizli ödevin adının yanında küçük **"Quiz"** etiketi (soru simgeli); üzerine gelince özet yazar: **"Quiz · 10 soru ·
   20 dk"**.
2. Satırın altında quizin durumu:
   - **"Quiz: çözmedin"**;
   - **"Quiz: devam ediyor"**;
   - **"Quiz: bitirdin · 8/10 (%80) · 2 açık uçlu soru puanlanmaz"** (sonuç açıksa) ya da **"Quiz: bitirdin · sonuç henüz açılmadı"**.
3. Satıra basınca açılan ödev penceresinin **"Ekler"** kutusunun ilk satırı quizdir: özet, durum ve **"Quizi başlat"**, **"Devam et"**,
   **"Sonucu gör"** ya da **"Quizi aç"** düğmesi (bütün durumlar: [Quiz çözme](quiz-cozme.md)).

### Veli

1. Çocuğunun ödev listesinde aynı **"Quiz"** etiketi ve durum, üçüncü kişi diliyle: **"Quiz: başlamadı"**, **"Quiz: devam
   ediyor"**, **"Quiz: bitirdi · 8/10 (%80)"** ya da **"Quiz: bitirdi · sonuç henüz açılmadı"**.
2. Satıra basınca açılan pencerenin (teslim dosyaları penceresi) en üstünde düğmesiz bir quiz kutusu: **"Quiz · 10 soru · 20 dk"** ve
   altında **"Henüz başlamadı"**, **"Devam ediyor"**, **"Bitirdi · 8/10 (%80) · 2 açık uçlu soru puanlanmaz"**, **"Bitirdi · sonuçlar henüz
   açılmadı"** ya da çözmeden ödev sonuçlandırıldıysa **"Çözülmedi; ödev sonuçlandırıldı."**
3. Puan yalnız sonuç açılınca görünür; sorular, cevaplar ve çıkış kaydı velide yoktur.

### Öğretmen

1. "Ödevler" listesinde quizli ödevin adının yanında **"Quiz"** etiketi.
2. Satırın altında quiz özeti ve ilerleme: **"Quiz · 5 soru · 20 dk · 12 öğrenciden 3 kişi bitirdi"**; çözmekte olan varsa sonuna
   **", 2 kişi çözüyor"**.
3. Ayrıntı için **"Sonuçlandır"** → kontrol ekranı ([Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md)).

### Müdür

1. "Ödevler" (ders ödevleri) listesinde quizli ödevin adının yanında **"Quiz"** etiketi; ilerleme sayısı yazmaz.
2. Bir öğrencinin portalını açınca o öğrencinin ödev listesini ve penceresini veli gibi görür: durum ve açılınca puan, düğme yok.
   Öğrencinin portalından bakan öğretmen de öyle.

Tasarımda (Tasarım 1 önizlemesi):

- Öğretmenin ödev listesindeki satır: **"7-A · son 1 Ekim 23:00 · 18 / 28 teslim · quiz"** ([Ödev listesi](../odev/liste.md)).
- Öğretmenin ana sayfasında **"Kontrol bekleyen ödevler"**: quizli ödevde **"8-B · quiz · 24 / 26 çözdü"** ve **"Kontrol et"**
  ([Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md)).
- Öğrencinin ödev penceresinde quiz satırı **"Quiz · 10 soru · 20 dakika"**, altında **"tek deneme"**; quizi bitirince satırda yeşil
  **"Cevapların gönderildi"** ve ödevin süre etiketinde **"Quiz gönderildi"**.
- Velinin ödev penceresinde quiz satırının sağında çocuğun adıyla etiket: **"Deniz: bitirdi"**, **"Deniz: devam ediyor"** ya da **"Deniz:
  başlamadı"**. Kullanıcının 3 Ekim kararıyla velide her çocuk ayrı oturumdur: listede ve pencerede yalnız o oturumdaki çocuğun quizi
  görünür ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
- Öğretmenin ve müdürün salt okunur ödev penceresinde (kontrol ekranındaki **"Ödevi gör"**) **"Quiz · 10 soru · 20 dakika"** ve
  **"öğrenci çözünce sonuç görünür"**.
- Öğrencinin "son günü yarın" bildiriminin alt satırında quiz de anılır: **"son gün 1 Ekim Perşembe 23:00 · quiz 10 soru"**
  ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).

## Kurallar ve sınırlar

- Listelerdeki quiz bilgisi kısa özettir: durum ve (sonuç açıksa) puan. Soru metni, şıklar, doğru bilgisi ve çıkış kaydı öğrencinin ve
  velinin listesine hiç gelmez.
- Öğretmenin listesindeki sayılar (başlayan, biten) listenin yüklendiği ana aittir.
- Ödevlerde arama quiz sorularını aramaz ([Ödevlerde arama](../odev/arama.md)).
- Ödevler bölümü okulda kapalıysa ödev listeleriyle birlikte quiz bilgisi de görünmez ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- Geçmiş yıla bakarken o yılın quizli ödevleri aynı biçimde, salt okunur görünür ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Quiz çözme](quiz-cozme.md) — ödev penceresindeki quiz satırının bütün durumları ve düğmeleri.
- [Sonuçlar ve puan](sonuclar.md) — puanın ne zaman göründüğü.
- [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md) — listeden açılan kontrol ekranı.

**İlgili:**

- [Ödev listesi](../odev/liste.md), [Ödevin penceresi](../odev/odev-penceresi.md), [Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md).
- [Süzgeçler](../odev/suzgecler.md) — ödev listesinin süzgeçleri (quiz için ayrı süzgeç yok).
- [Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md), [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) ("Listelerde ve eklerde": `quizListeEtiketi`,
  `quizListeDurumu`, `quizOgretmenListeSatiri`, `quizOdevSatiri`; `veli-teslim` sarması), [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md)
  (öğrenci listesi ve penceresi), [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (veli listesi),
  [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (öğretmen listesi ve müdürün ders ödevleri).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`listeOzetleri`, `ilerleyisOzetleri`),
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`GET /api/progress`: öğrenci ve velinin `assignments[].quiz`),
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`GET /api/assignments`: öğretmen listesi),
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`GET /api/school/assignments`: müdürün ders ödevleri).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (doğru şıkkın ilerleyiş verisine ve veliye sızmaması).

## Sık sorulanlar

- **Hangi ödevde quiz olduğunu nasıl anlarım?** Ödevin adının yanında "Quiz" etiketi durur.
- **Listede "sonuç henüz açılmadı" yazıyor.** Quizi bitirdin ama öğretmenin seçtiği an henüz gelmedi; açılınca bildirim gelir.
- **Veli olarak çocuğumun cevaplarını görebilir miyim?** Hayır; yalnız bitirip bitirmediğini ve sonuç açılınca puanını görürsün.
- **Müdür quiz puanlarını görebilir mi?** Ders ödevleri listesinde yalnız "Quiz" etiketini görür; tek bir öğrencinin portalını açınca o
  öğrencinin durumunu ve açılmışsa puanını görür.

## Sırada

- Arayüz çalışması (Tasarım 1): öğretmenin ana sayfasındaki "N / M çözdü", velinin pencere etiketi, "Quiz gönderildi".
- Velide her çocuk ayrı oturum kararı (3 Ekim): bugünkü velinin birleşik ödev listesi bu karara göre değişecek; quiz satırları da
  yalnız oturumdaki çocuğu gösterecek.
- Optimizasyon + saklama süreleri: 1 yılı dolan quizde listede ve pencerede "Quiz 1 yıl sonra silindi" gibi kısa bir iz görünecek
  ([Saklama ve silinme](saklama-ve-silinme.md)).
