# Sınavlar · Sonuç bildirimi ve sonuçların görünmesi

**Durum:** Kodda var; tasarımda ek olarak puanlı bildirim metni ("Matematik 1. yazılı sonucu açıklandı: 82"), "Değer girilince öğrenci ve veli hemen görsün" seçeneği, bildirim panelinde "Sınav" sekmesi, tarih değişikliği ve sınav öncesi hatırlatma bildirimleri.

Bir sınavın değeri girilince öğrenciye ve velisine giden bildirim ve sonucun öğrenciye ne zaman göründüğü.

## Ne işe yarar

Kullanıcının ilk isteklerinden (28 Ağustos): bildirimde **"sınav sonucu açıklandı"** gibi haberler gelsin. Öğrenci notunu
sormadan öğrenir; veli aynı bildirimin kopyasını çocuğunun adıyla alır. Bildirim yalnız ilk girişte gider: öğretmen bir değeri
düzeltince öğrenci yeniden rahatsız edilmez.

## Nereden açılır

- **Öğrenci ve veli:** üst şeritteki zil (bildirim paneli) ve açıksa telefon bildirimi ([Bildirim paneli](../bildirim/bildirim-paneli.md),
  [Telefon bildirimi ve bildirim izni](../bildirim/telefon-bildirimi.md)). Bildirime dokununca öğrencide **"Sınavlarım"**, velide
  kendi **"İlerleyiş"** sayfası o çocuk seçili açılır.
- **Öğretmen:** bildirimi değer tablosundaki **"Kaydet"** gönderir ([Not (değer) girişi](not-girisi.md)); kaydettikten sonra ekranda
  ileti görür.
- **Tasarımda:** "Sınav aç" penceresinde **"Sonuçlar"** satırı ([Yeni sınav açma](yeni-sinav.md)); bildirim panelinde **"Sınav"**
  sekmesi ([Sekmeler](../bildirim/sekmeler.md)).

## Adım adım

### Öğrenci

**Bugünkü site**

1. Öğretmen senin bir değerini **ilk kez** kaydedince bildirim gelir: **"Matematik dersinden "1. Yazılı" sınavının sonucu
   açıklandı."** (sınavın dersi yoksa baştaki "Matematik dersinden" kısmı yazılmaz).
2. Bildirime dokun: **"Sınavlarım"** açılır ([Sınavlarım](sinavlarim.md)).
3. Sonuç bildirimden bağımsız olarak, öğretmen kaydettiği an Sınavlarım'da ve İlerleyişim'de görünür.
4. Öğretmen sonradan değeri düzeltir, bir ölçüm ekler ya da değeri silerse yeni bildirim gelmez.

**Tasarımda (Tasarım 1 önizlemesi)**

- Bildirimin başlığı sonucu da söyler: **"Matematik 1. yazılı sonucu açıklandı: 82"**, altında **"Ayşe Kaya · 23 Eylül Çarşamba
  sınavı"** (öğretmen ve sınavın günü); dokununca "Sınav ayrıntısı" penceresi ([Sınav ayrıntısı](sinav-ayrintisi.md)).
- Bildirim panelinde "Sınav" sekmesinde durur.
- Planlanan sınavda tanıma göre: sınavdan 1 gün önce 19:00'da hatırlatma; sınavın tarihi ya da saati değişirse bildirim
  ([Sınav planlama](sinav-planlama.md)).

### Veli

1. Çocuğunun bildiriminin kopyası, başında çocuğun adıyla gelir: **"Deniz Aydın · Matematik dersinden "1. Yazılı" sınavının
   sonucu açıklandı."** İki çocuğun aynı sınavdan sonucu aynı anda girildiyse tek bildirim: "Deniz Aydın, Ece Aydın · …"
   ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).
2. Dokununca velinin **"İlerleyiş"** sayfası o çocuk seçili açılır (çocuğun "Sınavları" sayfası değil).
3. Tasarımda metin veliye göre çevrilir: başlık **"Elif'in sınav sonucu açıklandı"** (önizlemedeki örnek çocuk), altında **"Matematik
   1. yazılı: 82"**; ya da çocuğun kısa adıyla **"Can · Sınav sonucu açıklandı"**, altında "Türkçe 1. yazılı: 88". Velide her çocuk ayrı oturum olduğu için bildirim o
   çocuğun oturumundadır.

### Öğretmen

1. Değer tablosunda **"Kaydet"**: başarıda **"12 değer kaydedildi. Öğrencilere bildirim gitti."** Bu ileti her kayıtta aynıdır;
   gerçekte bildirim yalnız o kayıtta değeri ilk kez girilen öğrencilere gider.
2. Bildirim kaydedilen değerin hangi ölçüm olduğuna bakmaz: öğrencinin herhangi bir ölçümü ilk kez girilince gider.

**Tasarımda**

1. "Sınav aç" penceresinde **"Sonuçlar"**: **"Değer girilince öğrenci ve veli hemen görsün"** (işaretli gelir).
2. Değer kaydedilince ileti **"Değerler kaydedildi (14 / 14 öğrenci girildi); öğrenciler sonucu görebilir."**
3. Kutu işaretli değilse sonucun ne zaman açılacağı (öğretmen mi açar, bir tarih mi seçilir) tasarımda tanımlanmadı (açık nokta).
4. "Sınavı düzenle"de tarih ya da saat değişirse **"… · tarih değişti; öğrencilere ve velilere bildirim gitti"**.

### Müdür

- Bugünkü sitede kendi açtığı sınavda ("Kendi Derslerim → Sınavlar") değer kaydedince bildirim öğretmendeki gibi gider; grupsuz
  sınavın dersi müdürün branşıdır, branşı yoksa metin "Müdür dersinden …" diye başlar.
- Tasarımda müdür sınavı açar, değerleri seçtiği öğretmenler girer; bildirimi onların "Kaydet"i gönderir
  ([Okulun sınavları](okulun-sinavlari.md)).

## Kurallar ve sınırlar

- **Bir kez:** her öğrenci, her sınav için bir kez ("sınav + öğrenci" işareti). Düzeltmede, değer silmede ya da yeni ölçüm eklemede
  gitmez.
- **İşaretin ömrü:** "bir kez" işareti 30 gün saklanır; ilk girişten 30 günden uzun süre sonra o öğrencinin bir değeri yeniden
  kaydedilirse bildirim yeniden gidebilir (kod okumasına göre bilinen açık).
- **Metin:** "<ders> dersinden "<sınav adı>" sınavının sonucu açıklandı." Müdürün grupsuz sınavında ders müdürün branşı, branşı
  yoksa "Müdür" yazar ("Müdür dersinden …").
- **Veliye kopya:** onaylı, bağlı her veliye; öğretmen ya da müdür olan veli de alır.
- **Sonucun görünmesi:** bugün kaydedilen değer hemen görünür; gizleme ya da sonradan açma yok (quizdeki "sonuçları şimdi aç"
  gibi bir düğme sınavda yok).
- **Telefona:** telefon bildirimini açan kişiye anında gider (kişi başına dakikada en çok 20 telefon bildirimi).
- **Kapalı bölüm:** okulda "Sınavlar" kapalıysa değer de girilemez, bildirim de gitmez.
- **Saklama:** bildirimler (tasarımda) 90 gün sonra silinir; sınavın sonucu silinmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Not (değer) girişi](not-girisi.md) — bildirimi gönderen "Kaydet".
- [Sınavlarım](sinavlarim.md) — bildirimin açtığı sayfa.
- [Sınav ayrıntısı](sinav-ayrintisi.md) — tasarımda bildirimin açtığı pencere.
- [Sınav planlama](sinav-planlama.md) — hatırlatma ve tarih değişikliği bildirimleri.
- [Yeni sınav açma](yeni-sinav.md) — "Sonuçlar" seçeneği.

**İlgili:**

- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md), [Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md),
  [Sekmeler](../bildirim/sekmeler.md), [Bildirim paneli](../bildirim/bildirim-paneli.md),
  [Telefon bildirimi ve bildirim izni](../bildirim/telefon-bildirimi.md).
- [Quiz · Sonuçlar ve puan](../quiz/sonuclar.md) — quizdeki sonuç açma kuralı (sınavda yok).

## Kod tarafı

- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `POST /api/exams/<id>/grades`: değişen öğrenciler,
  `depo.genel.ilkKezOlanlar('sinav:<sınav>:<öğrenci>')`, `topluBildir(…, '#/sinavlarim')`; bildirim ve veliye kopya
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`topluBildir`, `veliKopyalari`, `ilkKezOlanlar`, `hatirlatmaTemizle`).
- Ön yüz: [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) (`EYLEMLER['sinav-deger-kaydet']`
  iletisi); bildirim paneli [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (sınav sonucu bildirimi yalnız ilk girişte, velisine kopya).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (bildirimler: "Sınav sonucu ilk girildiğinde …").

## Sık sorulanlar

- **Öğretmen notumu düzeltti, bildirim gelmedi.** Doğru; sınav bildirimi yalnız ilk girişte gelir. Sınavlarım'a bak.
- **İki çocuğum aynı sınava girdi, tek bildirim geldi.** Aynı metin iki çocuğa gidiyorsa veliye adları birlikte yazılmış tek bildirim
  gelir.
- **Sonuç bildirimi gelmeden notu görebilir miyim?** Evet; öğretmen kaydettiği an Sınavlarım'da görünür.
- **Öğretmenim "bildirim gitti" dedi ama gelmedi.** Değerin daha önce girilmişse (düzeltme) bildirim gitmez; ekrandaki ileti yine aynı
  cümleyi söyler.

## Sırada

- Mesaj ayarları … sınav planlama (iş 8): sınav öncesi hatırlatma (1 gün önce 19:00), tarih değişikliği bildirimi, bildirim panelinde
  sekmeler.
- Arayüz önizlemesi (Tasarım 1) koda geçerken: puanlı bildirim metni, veliye üçüncü kişiyle çevrilen metin, "Değer girilince öğrenci ve
  veli hemen görsün".
- Optimizasyon + saklama süreleri (iş 7): bildirimlerin 90 gün sonra silinmesi.
- Ekran iletisinin yalnız gerçekten bildirim gittiğinde "bildirim gitti" demesi (belgelemede bulunan açık).
