# Ödevler · Sonuçlandırma (Yaptı · Geç yaptı · Eksik · Yapmadı · Gelmedi izinli / izinsiz)

**Durum:** Kodda var; tasarımda ek olarak kontrol ekranı kaydedince açık kalır ("Kaydedildi: saat" satırı ve "Sonuçlar kaydedildi …" iletisi), üstte "Ödevi gör" düğmesi ve ödeve eklenen anket durur (Tasarım 1 önizlemesi).

Öğretmenin ödevin kontrol ekranında her öğrenciye sonucunu seçip kaydetmesi; öğrenci ve velisinin sonucu anında görmesi ve bildirim alması.

## Ne işe yarar

Kullanıcının ilk isteği (28 Ağustos): "bir ödev varsa ona tıklayınca sonuçlandır'a basacak ve her öğrenciye yaptı, yapmadı,
eksik ve gelmedi-izinli, gelmedi-izinsiz yazabilecek". 25 Eylül'de "geç yaptı"yı ekledi ve ekranı tarif etti: "ödev
kontrolünde üstte ismi, bir altında konusu, altında öğrenciler ödeve atanmış sırayla alt alta, yanında kutucuk; tıklayınca
seçenekler". 26 Eylül'de bildirimini istedi: "ödev-dersinden ödev-ismi açıklandı: yaptı/yapmadı her neyse".

Sonuçlar öğrencinin [ödev serisini](seri.md), [ilerleyiş grafiklerini](../ilerleyis/odev-grafigi.md) ve öğretmenin
[Sınıflarım](../siniflar-dersler/siniflarim.md) ekranını besler.

## Nereden açılır

- **Öğretmen:** "Ödevler" → ödevin satırında **"Sonuçlandır"** (sonuçlanmışta **"Sonuçları düzenle"**). Ana sayfadaki "Aktif
  ödevler" listesindeki aynı düğme de açar. Ekranın kendi adresi yoktur: adres açtığın sayfada ("Ödevler" ya da ana sayfa)
  kalır, "Yenile" o sayfayı yeniden çizer.
- **Müdür:** yalnız öğretmeni okuldan ayrılmış (sahipsiz) ödevde: "Ödevler" (ders ders) → dersin dalı → ödevin yanında
  **"Sonuçlandır"** ([Müdürün ödev görünümü](mudurun-odev-gorunumu.md)).

## Adım adım

### Kontrol ekranında ne var (bugünkü site)

1. **Üstte ödevin adı** (büyük başlık), altında **"Konusu"** ve ödevin açıklaması (açıklama yoksa dersin adı).
2. Bilgi satırı: **"Matematik · son teslim 4 Ekim 2026, Pazar · 12:00 · 24 öğrenci · 9 kişi açtı · öğrenciler dosya
   yükleyebilir"** (ya da "süresiz", "dosya yükleme kapalı").
3. **"Ekler"**: quizli ödevde ilk satır quiz ("Quiz · 10 soru · 20 dk", "5 öğrenci başladı · sonuçlar son teslimden 10 dakika
   sonra açılır"; düğmeler **"Önizle"**, **"Quizi düzenle"**, **"Sonuçları şimdi aç"**), sonra ödevin ekleri.
4. Süresi geçmiş ya da sonuçlanmış ödevde mavi bilgi: **"Bu ödevin süresi doldu ve sonuçlandırıldı. Sonuçları yine de
   değiştirip yeniden kaydedebilirsin."** (yalnız süresi dolduysa "Bu ödevin süresi doldu. …").
5. **"Öğrenciler"** kartı; başlığın yanında **"Seçilmemişlerin hepsi: Yaptı"** ve dosya teslim edildiyse **"Teslimleri indir
   (… MB)"** ([Teslimleri inceleme](teslimleri-inceleme.md)).
6. Öğrenciler **ad sırasıyla alt alta**; her satırda sıra numarası, ad, altında **"Ödev 20.05.2026 16:20 tarihinde açıldı"** /
   **"Ödev açılmadı"**, quizli ödevde quiz rozeti (**"Quiz: 8/10 · 2 kez çıktı (35 sn)"**, "Quiz: devam ediyor", "Quiz:
   başlamadı"; basınca cevapları), dosya yüklediyse **"3 ek"**; sağda sonuç kutusu.
7. Sonuç kutusunun seçenekleri bu sırayla: **"— Seç —"**, **"Yaptı"**, **"Geç yaptı"**, **"Eksik"**, **"Yapmadı"**,
   **"Gelmedi (izinli)"**, **"Gelmedi (izinsiz)"**. Seçilen sonuç kutuyu renklendirir (Yaptı yeşil, Geç yaptı mavi, Eksik
   turuncu, Yapmadı kırmızı, Gelmedi (izinli) gri, Gelmedi (izinsiz) bordo).
8. Kartın altında canlı sayım: **"Yaptı 12"**, **"Geç yaptı 2"**, … ve **"Seçilmemiş 3"** (yalnız sayısı olanlar).
9. Altta düğmeler: **"Sonuçlandır ve kaydet"** (sonuçlanmışta **"Değişiklikleri kaydet"**), sonuçlanmışta **"Tekrar aç"**,
   **"Ödevi düzenle"**, **"Geri dön"**.

### Öğretmen

1. "Ödevler" listesinde ödevin **"Sonuçlandır"** düğmesine bas.
2. Önce teslimlere ve quiz rozetlerine bak (ekler, cevaplar).
3. Her öğrencinin kutusundan sonucunu seç. Kalabalık sınıfta önce istisnaları seç (ör. 2 "Yapmadı", 1 "Gelmedi (izinli)"),
   sonra **"Seçilmemişlerin hepsi: Yaptı"**ye bas: yalnız boş kutular "Yaptı" olur.
4. Sayımı kontrol et; "Seçilmemiş" kalan varsa o öğrencilere sonuç girilmemiş olur (öğrenci "Değerlendirilmedi" görür).
5. **"Sonuçlandır ve kaydet"**e bas. Ödev "Sonuçlandı" olur, "Ödevler" sayfasına dönersin; ödev "Geçmiş ödevler"e geçer, satırında
   altı renkli sayı görünür.
6. Sonucu yeni verilen her öğrenciye bildirim gider: **"Matematik dersinden "Oran orantı" ödevi açıklandı: Yaptı"**; velisine
   **"Elif Yılmaz · Matematik dersinden "Oran orantı" ödevi açıklandı: Yaptı"** (dokununca velide o çocuğun ödevleri açılır).
7. Quizli ödevde sonuçlandırma quizi kapatır: süren denemeler biter, sonuçlar öğrencilere açılır ve quiz bildirimi gider
   ([Quiz sonuçları](../quiz/sonuclar.md)).
8. Sonuçlandırınca teslim dosyası yüklemesi kapanır ("Ödev sonuçlandırıldı; dosya yüklenemez.").

### Öğrenci

Ödev listende sonuç etiketi görünür (**"Yaptı"** yeşil … **"Gelmedi (izinsiz)"** bordo); sana sonuç girilmediyse
**"Değerlendirilmedi"**. Bildirim panelinde "… ödevi açıklandı: Yaptı". Sonuç ödev serine ve ilerleyişine işlenir.

### Veli

Çocuğunun ödev listesinde aynı etiket ve bildirim (başında çocuğunun adı). Sonuç değişirse yeni bildirim gelir.

### Müdür

Öğretmeni ayrılmış (sahipsiz) ödevde aynı ekranı açar ve öğretmen gibi sonuçlandırır; kaydedince "Ödevler" (ders ders)
sayfasına döner. Bilinen açık: bu ekrandaki **"Geri dön"** müdürü kendi (boş) öğretmen ödev listesine götürür.

### Tasarımda (Tasarım 1 önizlemesi)

- Sayfa **"Ödev kontrolü"**; altyazısı **"Konusu: Kesirlerle toplama"**. Üstte **"Ödevlere dön"**, **"Ödevi gör"** (ödevin
  penceresini açar) ve **"Ödevi düzenle"**.
- Bilgi satırı: **"7-A · Matematik · son teslim 1 Ekim 2026 Perşembe 23:00 · 28 öğrenci · 25 kişi açtı · öğrenciler dosya
  yükleyebilir"**; altında anket, quiz ("Quiz · 10 soru (1 açık uçlu, puansız) · 20 dakika" — "5 öğrenci başladı · sonuçlar son
  teslimden 10 dakika sonra açılır") ve **"Ödevin ekleri (2)"**.
- Süre dolduysa: **"Bu ödevin süresi doldu ve sonuçlandırıldı. Sonuçları yine de değiştirip yeniden kaydedebilirsin; adını,
  açıklamasını ve tarihlerini Ödevi düzenle ile değiştirirsin."**
- **"Öğrenciler"** bölümü, sağında **"Seçilmemişlerin hepsi: Yaptı"** bağlantısı; satırlar sıra no, ad, **"Ödev 20.05.2026
  16.20 tarihinde açıldı"**, "3 ek", quiz rozeti ve renkli sonuç kutusu ("— Seç —" + altı sonuç, aynı sıra).
- Sayım satırı ve altta yapışık çubuk: solda **"Sonuçlanmadı"** / **"Sonuçlandırıldı"** / **"Kaydedildi: 10:34"**, sağda
  **"Sonuçlandır ve kaydet"** / **"Değişiklikleri kaydet"**. Kaydedince sayfa açık kalır ve **"Sonuçlar kaydedildi (3 öğrenci
  seçilmedi); öğrenciler ve veliler görebilir."** iletisi çıkar.
- **Müdür sonuç ekranını kullanmaz:** kullanıcı 29 Ağustos'ta "ödev sonuçları vb. müdürü ilgilendirmez" dedi; tasarımın
  kararı "müdür ödev kontrol etmez". Öğretmeni ayrılmış ödevin kimin tarafından sonuçlandırılacağı tasarımda yazmıyor (bugün
  müdür sonuçlandırıyor); açık soru.

## Kurallar ve sınırlar

- **Yetki:** "Ödev sonuçlandırır" (`odev.sonuclandir`, ders kapsamlı); yoksa kaydetme düğmesi çıkmaz, sunucu **"Bu ödevi
  sonuçlandırma yetkin yok"** der. Yalnız ödevi veren öğretmen (ya da sahipsiz ödevde okulun müdürü) açabilir; başkası
  **"Yetkin yok"**.
- **Yalnız dokunduğun kutular gider.** Kaydet, yalnız değiştirdiğin kutuları gönderir; hiç dokunmadığın öğrencinin sonucu
  değişmez. Bir kutuyu **"— Seç —"**e geri almak o öğrencinin eski sonucunu kaldırır.
- **Bildirim yalnız yeni ya da değişen sonuca.** Aynı ekranı yeniden kaydetmek sınıfa yeniden bildirim yağdırmaz. Sonuç
  kaldırılınca bildirim gitmez.
- **Süre şartı yok.** Ödevi son teslimden önce de sonuçlandırabilirsin; sonuçlandırınca teslim kapanır, quiz biter.
- **Sonuç yalnız sonuçlanınca görünür.** Ödev aktifken öğretmen bir sonuç seçip kaydetmeden çıkarsa hiçbir şey yazılmaz;
  öğrenci sonucu ödev "Sonuçlandı" olunca görür.
- **İlerleyişe etkisi:** "Gelmedi (izinli)" öğrencinin ödev oranını düşürmez; "Gelmedi (izinsiz)" ve "Yapmadı" düşürür;
  "Geç yaptı" ve "Eksik" yarım sayılır ([Ders oranları](../ilerleyis/ders-oranlari.md)). Seride "Yaptı" dışındaki her sonuç
  kaçırma sayılır ([Ödev serisi](seri.md)).
- **Geçmiş yıl:** yıl seçicide geçmiş yıla bakarken kaydedilmez: **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt
  okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."**
- **İşlem kaydı:** sonuçlandırma okulun işlem kaydına yazılmaz.
- **Bilinen açıklar** (kod okumasına göre): kaydetmeden "Ödevi düzenle"yle kaydetmek, quizin "Sonuçları şimdi aç"ı, "Geri dön",
  menü ya da "Yenile" seçtiğin ama kaydetmediğin sonuçları uyarısız siler; kaydet düğmesi istek sırasında kilitlenmez (iki kez
  basılabilir; sunucu yalnız değişene bildirim gönderdiği için çoğunlukla zararsız); yetkisi olmayan da kutuları değiştirebilir
  ama kaydedemez (uyarı yok); ekran açıldığı anı gösterir; "Ödevler" sayfasından açılan kontrol ekranında üstteki arama kutusu
  öğrencileri süzmez ([Ödevlerde arama](arama.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Sonuçları düzeltme ve tekrar açma](sonuclari-duzeltme.md) · [Açıldı / açılmadı](acilma-bilgisi.md) ·
[Teslimleri inceleme ve indirme](teslimleri-inceleme.md) · [Ödev listesi](liste.md) · [Ödev serisi](seri.md) ·
[Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) · [Müdürün ödev görünümü](mudurun-odev-gorunumu.md).

**İlgili:** [Quiz sonuçları](../quiz/sonuclar.md), [Öğrencinin cevapları](../quiz/ogrencinin-cevaplari.md),
[Bildirim metinleri](../bildirim/bildirim-metinleri.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md),
[İlerleyiş: ödev grafiği](../ilerleyis/odev-grafigi.md), [Sınıflarım](../siniflar-dersler/siniflarim.md),
[Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md) (sahipsiz ödev), [Yetki listesi](../roller-yetkiler/yetki-listesi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `odevAc` (kontrol ekranı,
  `GET /api/assignments/<id>`), `ODEV_SONUC_SIRA`, `odevSayimYaz`, `change` dinleyicisi (`S._sonuclar`),
  `EYLEMLER['sonuc-hepsi']`; kaydetme [25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`odev-bitir` →
  `POST …/finish { results }` → öğretmen `ogr-odevler`'e, müdür `ders-odevleri`'ne). Sonuç adları ve renkleri
  [02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (`SONUC`). Quiz satırı ve rozeti [14c-quiz.md](../../public/js/parcalar/14c-quiz.md).
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `POST /api/assignments/<id>/finish` (yetki, geçerli
  değerler, boş = kaldır, `finished`, yalnız değişene bildirim `SONUC_AD`, `quiz.odevSonuclandi`); sahipsiz ödev kuralı.
  [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`odevSonuclandi`).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `sonuclandir` (tek işlem; `odev_ogrencileri.sonuc`,
  `odevler.durum`, `sonuclanma`); [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`cokluBildir`, veli kopyası).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (6. bölüm: geç yaptı, boş seçimle kaldırma, tanımsız sonuç),
  [testler/test-bildirim.md](../../testler/test-bildirim.md) (yalnız değişene, velisine kopya),
  [testler/test-odev-saat.md](../../testler/test-odev-saat.md) (süresi geçmiş ödevin sonucunu değiştirme),
  [testler/test-quiz.md](../../testler/test-quiz.md) (sonuçlandırmada quizin kapanması).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ödev sistemi").

## Sık sorulanlar

- **Bir öğrenciye sonuç girmeyi unuttum.** "Sonuçları düzenle" → kutusunu seç → "Değişiklikleri kaydet"; yalnız ona bildirim gider.
- **Yanlış sonuç girdim.** Aynı yoldan düzelt; öğrenciye "… sonucu değişti: Geç yaptı" bildirimi gider.
- **"Seçilmemişlerin hepsi: Yaptı" seçtiklerimi bozar mı?** Hayır; yalnız boş kutuları doldurur.
- **Süresi dolmadan sonuçlandırabilir miyim?** Evet; ama teslim yüklemesi ve quiz kapanır.
- **Öğretmen okuldan ayrıldı, açık ödevleri ne olacak?** Müdür "Ödevler" sayfasından sonuçlandırır (bugünkü site).

## Sırada

- Ödev listesi düzeni: öğretmenin listesinde "Kontrol et" etiketi ve ana sayfada "Kontrol bekleyen ödevler".
- Tasarımdaki kontrol ekranı: kaydedince sayfada kalma, "Kaydedildi: saat" satırı, "Ödevi gör" düğmesi.
- Sahipsiz ödevin tasarımdaki sahibi (müdür sonuç ekranını kullanmayacaksa) kullanıcıya sorulacak.
- Android uygulaması: öğretmenin kontrol ekranı ve sonuçlandırma uygulamaya gelecek.
