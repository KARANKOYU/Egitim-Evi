# public/js/parcalar/11b-siniflarim.js

Öğretmenin "Sınıflarım" sayfası: ders verdiği sınıfların kartları, seçili sınıfın öğrenci listesi ve bir öğrenciye
dokununca açılan pencere (o öğretmenin verdiği ödevlerde öğrencinin durumu ve öğrencinin sınav sonuçları).

## Bu dosya ne yapar?

Öğretmen bir öğrenci hakkında "bu çocuk benim ödevlerimi yapıyor mu, sınavları nasıl?" sorusuna tek yerden bakmak
ister. Bu sayfa üç adımda cevap verir:

1. **Sınıf kartları.** Öğretmenin ders verdiği her sınıf bir kart: büyük sınıf adı ("7-B") ve altında "Matematik, Fen
   Bilimleri · 24 öğrenci". İlk açılışta ilk sınıf seçili gelir; seçim bellekte kalır (sayfadan çıkıp dönünce aynı
   sınıf seçilidir).
2. **Öğrenci listesi.** Seçili sınıfın öğrencileri okul numarasına, sonra ada göre: avatar, ad, "No 123" ve sağda "›".
   Başka karta basınca eski liste solar ve tıklanamaz olur, yenisi gelince yerine geçer (liste boşalıp sayfa zıplamasın).
3. **Öğrenci penceresi.** Öğrenciye dokununca: üstte ad, sınıf ve okul no; **"Verdiğim ödevler (N)"** — sonuç sayımı
   ("Yaptı: 5", "Eksik: 1"…) ve her ödev için ad, ders, son teslim, aktif ödevde "açtı" / "açmadı", sağda sonucu
   (sonuçlanıp değerlendirilmemişse "Değerlendirilmedi", aktifse "3 gün kaldı" / "Bugün 12:00'e kadar" / "Süresi doldu");
   **"Sınav sonuçları"** — sınav grupları (her sınavın notu ve "Ortalama (100 üzerinden): 87,5") ve gruba bağlı olmayan
   sınavlar (tarih, şablon adı, her ölçümün değeri: "Doğru: 18 · Yanlış: 2 · Net: 17,5").

Sayfa yalnız okuma içindir; hiçbir şey kaydetmez. Ondalık ayırıcı ekranda virgüldür.

Kim görür: menüde "Sınıflarım" yalnız öğretmende ve `ogretmen.sonuclar` yetkisiyle çıkar ("Girdiği sınıfların öğrenci
sonuçlarını görür"; hazır Öğretmen rolünde açık gelir, müdür Roller sayfasından kapatabilir — [06-menu.md](06-menu.md)).
Müdürün menüsünde yok; adresi (`#/siniflarim`) elle açan müdür yalnız kendi ders verdiği sınıfları görür.

Ön yüz parçaları ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`, [../../../sunucu/http.md](../../../sunucu/http.md)
`birlesikOku`); buradaki `SAYFALAR.siniflarim`, `snfListeHtml` ve iki eylem bütün parçalara açıktır.

## İçinde neler var?

- `SAYFALAR.siniflarim` — `GET /api/teacher/siniflarim`. Başlık "SINIFLARIM — Ders verdiğin sınıflar. Sınıfa, sonra
  öğrenciye dokun: verdiğin ödevler ve sınav sonuçları.". Sınıf yoksa "Henüz bir sınıfa dersin yok. Müdür seni bir derse
  atayınca burada görünür.". `S.snfSinif` boşsa ya da artık listede yoksa ilk sınıf seçilir. `div.snf-kartlar` içinde her
  sınıf `button.snf-kart[data-act="snf-sinif"][data-id]` (seçiliyse `.secili`): `.snf-ad` ve `.snf-alt` ("dersler ·
  N öğrenci"). Sonra seçili sınıf için `GET /api/teacher/sinif?id=` ve sayfa TEK SEFERDE yazılır (`yaz`): kartlar +
  `div#snfOgrenciler` (`snfListeHtml`). Sınıf isteği düşerse kartlar yine çizilir, listenin yerine kırmızı ileti.
- `snfListeHtml(d)` — öğrenci yoksa "Bu sınıfta öğrenci yok."; varsa `h3.sb` "7-B — 24 öğrenci" ve `div.kart` içinde her
  öğrenci `button.satir.tikla.snf-ogrenci[data-act="snf-ogrenci"][data-id][data-ara]` (`data-ara`: ad + okul no; üst
  çubuktaki genel arama bu satırları süzer): `avatar`, ad, varsa "No 123", `span.snf-ok` "›".
- `EYLEMLER['snf-sinif']` — `S.snfSinif = id`; kartların `.secili`'si yenilenir; `#snfOgrenciler`'e `.snf-bekliyor`
  (soluk, tıklanamaz) eklenir; `GET /api/teacher/sinif?id=`. Cevap geldiğinde kullanıcı bu arada başka karta bastıysa
  (`S.snfSinif !== id`) cevap atılır; değilse liste değişir. Hata listenin yerine kırmızı ileti.
- `EYLEMLER['snf-ogrenci']` — `GET /api/teacher/ogrenci?id=` → pencere (`modalAc(ad, …)`; alt düğmesi varsayılan
  "Kapat"):
  - `.snf-kisi`: avatar, ad, "7-B · No 123";
  - "Verdiğim ödevler (N)": ödev varsa `.snf-ozet` (sonucu olan ödevlerin `SONUC` sırasıyla renkli sayımı: "Yaptı: 5"),
    sonra her ödev bir `.satir`: ad; "ders · son teslim 4 Ekim 2026, Pazar · 12:00" (son teslim yoksa yazmaz); aktif
    ödevde " · açtı" ya da soluk " · açmadı"; sağda sonuç etiketi (`SONUC[result]`), yoksa sonuçlanmışsa gri
    "Değerlendirilmedi", değilse `kalanEtiketi(a)`. Ödev yoksa "Bu öğrenciye henüz ödev vermedin.";
  - "Sınav sonuçları": hiç yoksa "Girilmiş sınav sonucu yok."; her grup `.snf-sinav`: "Grup adı (ders)", "Sınav 1: 80 ·
    Sınav 2: —" (not girilmemişse "—"), `.snf-ort` "Ortalama (100 üzerinden): **87,5**" (hesaplanamıyorsa "—"); her tek
    sınav `.snf-sinav`: "Sınav adı (ders · şablon adı)", "tarih · Ölçüm: **değer** · …" (yalnız değeri girilmiş ölçümler
    gelir).
  Hata (403 "Bu öğrencinin sınıfına dersin yok" vb.) `hataGoster` ile tarayıcı uyarı kutusunda.

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de):
  - `S`, `$`, `esc`, `api`, `EYLEMLER`, `SAYFALAR` ([00-durum.md](00-durum.md), [01-yardimcilar.md](01-yardimcilar.md));
  - `avatar`, `SONUC`, `kalanEtiketi` (son teslim geçtiyse kırmızı "Süresi doldu", son günse turuncu "Bugün 12:00'e kadar",
    değilse "N gün kaldı" — 1 gün kaldıysa turuncu; son teslim yoksa "Aktif"), `tarihGunSaat`, `tarihGun`
    ([02-ikonlar.md](02-ikonlar.md));
  - `modalAc` ([03-mesaj-modal.md](03-mesaj-modal.md)); `yaz`, `hero`, `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md));
    `hataGoster` (`25-tiklama.js`).
- Sunucu uçları ([../../../sunucu/bolumler/ogretmen.md](../../../sunucu/bolumler/ogretmen.md); hepsi yalnız GET, rol
  öğretmen ya da müdür ve `ogretmen.sonuclar` yetkisi; yoksa 403 "Öğrenci sonuçlarını görme yetkin yok"):
  - `GET /api/teacher/siniflarim` → `{ siniflar: [{ id, ad, dersler, ogrenciSayisi }] }` — yalnız öğretmenin DERS
    VERDİĞİ sınıflar.
  - `GET /api/teacher/sinif?id=` → `{ sinif: { id, ad, dersler }, ogrenciler: [{ id, fullName, okulNo }] }`; girmediği
    sınıfta 403 "Bu sınıfa dersin yok". Sıralama sunucuda (okul no, sonra ad).
  - `GET /api/teacher/ogrenci?id=` → `{ ogrenci: { id, fullName, sinif, okulNo }, odevler: [{ id, title, subject, endAt,
    endTime, status, result, acildi }], sinavGruplari: [{ id, name, subject, ortalama, sinavlar: [{ name, grade, alt, ust,
    weight }] }], sinavlar: [{ name, tarih, subject, templateName, olcumler: [{ ad, deger, … }] }] }`. Ödevler YALNIZ bu
    öğretmenin verdikleri; sınav grupları ve sınavlar öğrencinin bu okuldaki BÜTÜN sonuçları (başka öğretmenlerinkiler
    dahil); hepsi bakılan eğitim yılına süzülü.
- Onu kullananlar: menü ([06-menu.md](06-menu.md), `yetkim('ogretmen.sonuclar')` ile "Sınıflarım"); düğmeleri
  `25-tiklama.js`'in `EYLEMLER` yolu çağırır. Bu dosyanın işlevlerini başka parça çağırmıyor. `S.snfSinif` yalnız burada
  kullanılır (ilk değeri yok; ilk açılışta kurulur). `26-baslat.js`'in `oturumDurumunuSifirla`'sı onu çıkışta ya da rol
  değişince silmez; zararsız, çünkü sayfa her açılışta seçili sınıfın yeni listede olup olmadığına bakar.
- Görünüm (`public/css/parcalar/22-cesitli.css`): `.snf-kartlar` (ızgara), `.snf-kart` (`.secili`, `:focus-visible`),
  `.snf-ad`, `.snf-alt`, `#snfOgrenciler.snf-bekliyor` (soluk, `pointer-events: none`), `.snf-ogrenci`, `.snf-ok`,
  `.snf-kisi`, `.snf-ozet`, `.snf-sinav`, `.snf-ort`. Ayrıca `04-kartlar.css` (`.kart`, `.satir`, `.etiket` renkleri;
  öğrenci satırındaki `.tikla`'nın kuralı yalnız `.kart.tikla` için yazıldığından `button.satir`'a etkisi yok),
  `12-ikonlar.css` (`.avatar`), `03-iskelet.css` (`h3.sb`), `25-grafik-sinav.css` / `27-harita-ortak.css`
  (`.soluk`), `02-form.css` (`.hint`, `.msg`). `.snf-tablo` sınıfının kuralı yok (ödev satırlarını saran kutu; görünüşü
  `.satir`'dan gelir).
- Rol: öğretmen (`ogretmen.sonuclar`). Öğrenci ve veli bu uçlara giremez (403 "Bu bölüm öğretmenler içindir").

## Nasıl çalışır (adım adım)?

```
menü "Sınıflarım" ─► SAYFALAR.siniflarim ─► GET /teacher/siniflarim
     sınıf yok ─► "Henüz bir sınıfa dersin yok…"
     S.snfSinif geçerli değil ─► ilk sınıf
     GET /teacher/sinif?id=<seçili> ─► yaz(kartlar + öğrenci listesi)    (tek seferde; sayfa zıplamaz)
karta bas ─► snf-sinif ─► .secili · liste solar ─► GET /teacher/sinif?id=
     cevap geldiğinde hâlâ bu sınıf mı? ─► evet: liste değişir │ hayır: cevap atılır
öğrenciye bas ─► snf-ogrenci ─► GET /teacher/ogrenci?id= ─► pencere:
     kişi · Verdiğim ödevler (sayım + satırlar) · Sınav sonuçları (gruplar + tek sınavlar)
```

## Dikkat!

- **Kapalı bölümün verisi burada görünür.** Okul "Ödevler" ya da "Sınavlar" bölümünü kapatsa da (Özellikler) bu sayfa
  açılır ve öğrenci penceresi ödevleri ve sınav sonuçlarını gösterir: sayfa `SAYFA_OZELLIK`'te yok
  ([06-menu.md](06-menu.md)), sunucudaki `/api/teacher` yolu özellik kapısına bağlı değil ve
  [../../../sunucu/bolumler/ogretmen.md](../../../sunucu/bolumler/ogretmen.md)'deki `ogrenci` ucu (ilerleyişin aksine)
  kapalı bölümü atlamıyor. Kod okumasına göre; tarayıcıda denenmedi, kod değiştirilmedi.
- **Sınav sonuçları yalnız bu öğretmeninki değil.** "Verdiğim ödevler" yalnız bu öğretmenin ödevleridir ama "Sınav
  sonuçları" öğrencinin bu okuldaki bütün sınav gruplarını ve sınavlarını getirir (başka öğretmenlerin notları da). Başlık
  bunu söylemez; yetkinin adı "girdiği sınıfların öğrenci sonuçlarını görür".
- **Geç gelen hata yeni listeyi ezebilir.** `snf-sinif` başarılı cevapta "hâlâ bu sınıf mı?" diye bakar ama hata
  dalında bakmaz: A'ya sonra hemen B'ye basılır ve A'nın isteği B'ninkinden sonra hatayla dönerse B'nin listesinin
  yerine A'nın hata iletisi yazılır (seyrek; kod okumasına göre).
- **Öğrenci penceresinde bekleme işareti yok.** `snf-ogrenci` düğmeyi kilitlemez, "Yükleniyor" göstermez; yavaş
  bağlantıda iki kez basılırsa iki istek gider, pencere iki kez açılır (ikincisi birincinin yerine).
- **Yalnız ders verdiği sınıflar.** Sınıf listesi öğretmenin derslerinden çıkar; müdür de (adresle açarsa) yalnız kendi
  ders verdiği sınıfları görür. Başka sınıfın öğrencisinin kimliği elle yazılsa bile sunucu 403 döner.
- **Nakil gelen öğrencinin eski okul kayıtları** öğretmenin okuluna ve yılına süzüldüğü için görünmez.
- **Grup ortalaması 100 üzerindendir** ve yalnız notu girilmiş sınavlarla hesaplanır (girilmemiş sınav payı öbürlerine
  dağılır); sınav grubu önerisi (üst değer, katkı puanı) bu hesabı değiştirecek (Son durum).
- **Ondalık:** notlar ve ölçümler `String(x).replace('.', ',')` ile yazılır (ilk nokta virgül olur); ölçümlerde kod
  (`D`, `Y`) değil ad ("Doğru") görünür.
- **HTML güvenliği:** ad, sınıf, ders, sınav ve ölçüm adları, değerler `esc`'ten geçer.

## Testleri

- `testler/test-siniflarim.js` (sunucu) — öğretmen ders verdiği sınıfı görüyor, ders vermediği listede yok ve
  açılamıyor (403); sınıfın öğrencileri geliyor; öğrencinin sınıfına dersi olmayan öğretmen öğrenciye bakamıyor;
  öğrenci bu bölüme giremiyor; "verdiğim ödevler sonuçlarıyla" (7 ödev); öğrencinin sınav sonucu (87,5); hazır Öğretmen
  rolünde yetki açık, kapanınca 403. Aynı paket ödev serisini, yoklama bildirimini ve programdaki ders kimliğini de dener.
- `testler/buton-denetimi.js` — `snf-sinif`, `snf-ogrenci` eylemlerinin karşılığı, `siniflarim` sayfasının menüde
  olması; `testler/yazim-denetimi.js` metinleri tarar.
- Ekran turu (`araclar/gezinti.js`; ÇALIŞTIRMA): "Sınıflarım (ders verdiğim sınıflar ve öğrenciler)" ve "Sınıflarım —
  öğrencinin ödevleri (yaptı mı) ve sınav sonuçları".
- Elle (3200): `testler/seed.js`'teki Matematik öğretmeniyle menüden "Sınıflarım" → 6-A kartı seçili, öğrenciler
  listede → bir öğrenciye dokun → "Verdiğim ödevler" ve "Sınav sonuçları". Müdürle Roller sayfasında hazır Öğretmen
  rolünden "Girdiği sınıfların öğrenci sonuçlarını görür"ü kapat → öğretmen sayfayı yenileyince menüsünden "Sınıflarım"
  kalkar; adresi elle açarsa sunucu 403 "Öğrenci sonuçlarını görme yetkin yok" der.

## Son durum

- `git log`: 2 commit. Dosya `e8ebe76 commit 448` (2026-09-26) ile doğdu (93 satır: kartlar, liste, öğrenci penceresi).
- Son değişiklik `3162077 commit 508` (2026-09-26): liste çizimi `snfOgrencileriCiz`'den (önce "Yükleniyor..." yazıp
  sonra dolduran) `snfListeHtml`'e (HTML döndüren) geçti; sayfa artık kartlar ve seçili sınıfın listesiyle TEK SEFERDE
  çiziliyor; sınıf değişince eski liste "Yükleniyor..." ile silinmiyor, `.snf-bekliyor` ile soluklaşıyor; geç gelen
  cevap, kullanıcı başka sınıfa geçtiyse atılıyor. Aynı commit `22-cesitli.css`'e `.snf-bekliyor` kuralını ekledi.
- Bilinen açıklar (kod değiştirilmedi): kapalı bölümün (ödev/sınav) bu sayfada görünmesi, hata dalındaki yarış,
  öğrenci penceresinde bekleme işaretinin olmaması (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Sınav: formüllü ölçüm + Excel + sınav grubu üst değeri" (iş 14, öneri
  onay bekliyor: tanıma göre grup sonucu "98,5 / 125" gibi üst değerle ve katkı puanıyla gösterilecek, bu penceredeki
  "Ortalama (100 üzerinden)" değişir; formülle hesaplanan ölçümler de öteki ölçümler gibi listelenecek); "Çalışan olarak
  ekleme" (iş 2: öğretmen rolü olmayan çalışanda bu bölüm açılmaz); "Güvenlik denetimi" (iş 3: yetki ve özellik kapıları
  rol rol taranacak — yukarıdaki kapalı bölüm açığı buraya düşer); "Optimizasyon + saklama süreleri" (iş 7: eski yılların
  verisi); "Çok dil" (iş 22).
