# Quiz

Öğretmenin bir ödevin içine koyduğu, öğrencinin sitede (ve telefona kurulan site uygulamasında) bir kez çözdüğü kısa test. Ödev başına
tek quiz olur; ayrı bir "Quizler" sayfası yoktur, quiz ödevin "Ekler" listesinin ilk satırında durur. Öğretmen "Yeni ödev" ya da "Ödevi
düzenle" penceresinde "Quiz ekle" ile soruları yazar ya da Word'den "Metinden ekle" ile yapıştırır: Doğru/Yanlış, çoktan seçmeli (bir ya
da birden çok doğru şık) ve puanlanmayan açık uçlu sorular. Süre türünü (Süresiz, Soru başına, Bütün quiz), "Uygulamadan/sekmeden
çıkınca o soru kapanır" seçeneğini ve sonuçların öğrenciye ne zaman görüneceğini (son teslimden 10 dakika sonra ya da bitirince) seçer;
"Önizle" ile öğrenci gözüyle bakar. Bir öğrenci başlayınca quiz kilitlenir. Öğrenci kuralları okuyup "Şimdi başla" der; süre sunucuda
işler, her cevap anında kaydedilir, sekmeden ya da uygulamadan çıkmak kaydedilir; tek hakkı vardır. Puan eşit ağırlıkla hesaplanır ama
yalnız öneridir: ödevin sonucunu öğretmen seçer. Öğretmen kontrol ekranında her öğrencinin rozetini ve soru soru cevaplarını görür,
"Sonuçları şimdi aç" ile sonuçları erken açabilir; açılış kalıcıdır. Veli yalnız durumu ve açılınca puanı görür. Bugünkü sitede bunların
hepsi çalışır (kullanıcının 26 Eylül isteği, 27 Eylül'de kodlandı). Tasarımda (kullanıcının 28 Eylül onayı, Tasarım 1 önizlemesi) soruya
fotoğraf, basit matematik yazımı (üs, kesir, kök) ve soru bankası, soruları Excel'den aktarma, çözme ekranında sayaç ve özet pencereleri,
yerel Android uygulamasında quiz ve 1 yıllık saklama süresi eklenir.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) | "Quiz ekle", ayarlar (süre, çıkınca kapanır, sonuçlar), soru ekleme/taşıma/silme, kaydetme ve hata iletileri, kilit, kaldırma | Kodda var; tasarımda ek olarak araç satırı, "N / 100 soru", ortak yazı düzenleyici |
| [Soru türleri](soru-turleri.md) | Doğru/Yanlış, çoktan seçmeli (tek ve çok doğru), açık uçlu; öğretmenin ve öğrencinin gördüğü; puanlanma | Kodda var; tasarımda ek olarak tür satırı |
| [Metinden ekle](metinden-ekle.md) | Word'den yapıştırma, yazım biçimi, sunucudaki önizleme, bütün uyarı iletileri, "Ekle" | Kodda var; tasarımda ek olarak araç satırından açılan panel |
| [Soruları Excel'den aktarma](excelden-soru-aktarma.md) | A sütunu soru, sonrakiler şıklar, doğru şık işaretli; önizleme | Tasarlandı — henüz kodda yok |
| [Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md) | x², a/b, √, π, ≤, ≥, ×, ÷ düğmeleri, "Görünüşü:", "Fotoğraf ekle" | Tasarlandı — henüz kodda yok |
| [Soru bankası](soru-bankasi.md) | "Bankaya kaydet" (konuyla), "Soru bankası" paneli, "Benim / Zümre" süzgeçleri, "Seçilenleri quize ekle" | Tasarlandı — henüz kodda yok |
| [Önizle (öğrenci gözüyle)](onizle.md) | Düzenleyicide ve kontrol ekranında önizleme; hiçbir şey kaydedilmez | Kodda var; tasarımda ek olarak bütün sorular alt alta |
| [Quiz çözme](quiz-cozme.md) | Ödev penceresindeki quiz satırı, kurallar ekranı, çözme ekranı, cevap kaydı, gezinme, bitirme, bitti ekranı | Kodda var; tasarımda ek olarak sayaç, onay ve özet pencereleri, Android |
| [Süre ve tek deneme](sure-ve-tek-deneme.md) | Başlatma şartları, üç süre türü, son teslim + 10 dakika, tek hak, sonuçlandırma ve "Tekrar aç" | Kodda var |
| [Sekmeden ve uygulamadan çıkış kaydı](cikis-kaydi.md) | Neyin çıkış sayıldığı, 2 saniye, "çıkınca o soru kapanır", öğretmenin gördüğü, sınırları | Kodda var; tasarımda ek olarak sürekli görünen çıkış sayısı, Android |
| [Sonuçlar ve puan](sonuclar.md) | Puanın hesabı, sonuçların ne zaman açıldığı, "Sonuçları şimdi aç", bildirim, veli | Kodda var |
| [Öğretmenin gördüğü cevaplar (quiz rozeti)](ogrencinin-cevaplari.md) | Kontrol ekranındaki quiz satırı, öğrenci rozetleri, soru soru cevap ayrıntısı | Kodda var; tasarımda ek olarak renkli rozet |
| [Listelerde ve ödev penceresinde quiz](listelerde-quiz.md) | "Quiz" etiketi ve durum satırları: öğrenci, veli, öğretmen, müdür | Kodda var; tasarımda ek olarak "N / M çözdü", velide çocuğun adıyla etiket |
| [Saklama ve silinme](saklama-ve-silinme.md) | Ödevle birlikte silinme, yedek; tasarımda 1 yıl, son 1 geçmiş yıl, okul yedeği, mezunlar | Kodda var; tasarımda ek olarak 1 yıl kuralı |

Okuma sırası: öğretmen için önce [Ödeve quiz ekleme](quiz-ekleme.md), [Soru türleri](soru-turleri.md) ve [Metinden ekle](metinden-ekle.md),
sonra [Önizle](onizle.md); öğrenci için [Quiz çözme](quiz-cozme.md) ve [Süre ve tek deneme](sure-ve-tek-deneme.md); sonuçlar için
[Sonuçlar ve puan](sonuclar.md) ve [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md); kurallar için [Çıkış kaydı](cikis-kaydi.md) ve
[Saklama ve silinme](saklama-ve-silinme.md); tasarlananlar için [Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md),
[Soru bankası](soru-bankasi.md) ve [Soruları Excel'den aktarma](excelden-soru-aktarma.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Ödeve quiz ekleme ve düzenleyici | — | — | [ekler, düzenler, kaldırır; kilitliyse yalnız önizler](quiz-ekleme.md#öğretmen) | [rolündeki "Ödev verir"le öğretmen gibi](quiz-ekleme.md#çalışan) | [öğretmeni ayrılmış ödevde düzenler](quiz-ekleme.md#müdür) | — | — | — |
| Soru türleri | [türe göre cevaplar](soru-turleri.md#öğrenci) | — | [türü seçer, doğruyu işaretler](soru-turleri.md#öğretmen) | [öğretmen gibi](quiz-ekleme.md#çalışan) | [sahipsiz ödevde öğretmen gibi](soru-turleri.md#öğretmen) | — | — | — |
| Metinden ekle | — | — | [yapıştırır, önizler, ekler](metinden-ekle.md#öğretmen) | [öğretmen gibi](quiz-ekleme.md#çalışan) | [sahipsiz ödevde öğretmen gibi](metinden-ekle.md#öğretmen) | — | — | — |
| Soruları Excel'den aktarma | — | — | [dosyadan aktarır (tasarım)](excelden-soru-aktarma.md#öğretmen) | [öğretmen gibi (tasarım)](quiz-ekleme.md#çalışan) | — (tanımda yalnız öğretmen) | — | — | — |
| Soruya fotoğraf ve matematik yazımı | [biçimli soruyu ve fotoğrafı görür (tasarım)](soru-resmi-ve-matematik.md#öğrenci) | — | [matematik düğmeleri, "Fotoğraf ekle" (tasarım)](soru-resmi-ve-matematik.md#öğretmen) | [öğretmen gibi (tasarım)](quiz-ekleme.md#çalışan) | — (tanımda yalnız öğretmen) | — | — | — |
| Soru bankası | — | — | [kaydeder, seçer; zümreninkini görür (tasarım)](soru-bankasi.md#öğretmen) | [öğretmen gibi (tasarım)](quiz-ekleme.md#çalışan) | — (tanımda yalnız öğretmen) | — | — | — |
| Önizle | — | — | [düzenleyicide ve kontrol ekranında önizler](onizle.md#öğretmen) | [öğretmen gibi](quiz-ekleme.md#çalışan) | [sahipsiz ödevin kontrol ekranında önizler](onizle.md#nereden-açılır) | — | — | — |
| Quiz çözme | [başlatır, çözer, bitirir](quiz-cozme.md#öğrenci) | [çözemez; `#/quiz` uyarı verir](quiz-cozme.md#veli) | [çözmez; portaldan durumu görür](quiz-cozme.md#öğretmen-ve-müdür) | — | [çözmez; portaldan durumu görür](quiz-cozme.md#öğretmen-ve-müdür) | — | — | — |
| Süre ve tek deneme | [süresi sunucuda işler, tek hakkı var](sure-ve-tek-deneme.md#öğrenci) | — | [süreyi seçer; sonuçlandırır, "Tekrar aç"](sure-ve-tek-deneme.md#öğretmen) | [öğretmen gibi](quiz-ekleme.md#çalışan) | [sahipsiz ödevde öğretmen gibi](sure-ve-tek-deneme.md#öğretmen) | — | — | — |
| Çıkış kaydı | [uyarılır; çıkışı kaydedilir](cikis-kaydi.md#öğrenci) | [görmez](cikis-kaydi.md#veli) | [seçeneği açar, rozette görür](cikis-kaydi.md#öğretmen) | [öğretmen gibi](quiz-ekleme.md#çalışan) | [sahipsiz ödevde görür](cikis-kaydi.md#müdür) | — | — | — |
| Sonuçlar ve puan | [puanı, cevapları, doğruları görür; bildirim](sonuclar.md#öğrenci) | [bildirim kopyası; durum ve puan](sonuclar.md#veli) | [ne zaman açılacağını seçer; "Sonuçları şimdi aç"](sonuclar.md#öğretmen) | [rolündeki "Ödev sonuçlandırır"la öğretmen gibi](quiz-ekleme.md#çalışan) | [sahipsiz ödevde açar; portaldan puanı görür](sonuclar.md#müdür) | — | — | — |
| Öğretmenin gördüğü cevaplar | — | — | [rozet ve soru soru ayrıntı](ogrencinin-cevaplari.md#öğretmen) | [öğretmen gibi](quiz-ekleme.md#çalışan) | [sahipsiz ödevde aynısı](ogrencinin-cevaplari.md#müdür) | — | — | — |
| Listelerde ve ödev penceresinde quiz | [etiket, durum, quiz satırı](listelerde-quiz.md#öğrenci) | [etiket, durum, açılınca puan](listelerde-quiz.md#veli) | ["12 öğrenciden 3 kişi bitirdi"](listelerde-quiz.md#öğretmen) | [öğretmen gibi](quiz-ekleme.md#çalışan) | [ders ödevlerinde etiket; portaldan durum](listelerde-quiz.md#müdür) | — | — | — |
| Saklama ve silinme | [cevapları ödev ya da hesapla silinir; 1 yıl (tasarım)](saklama-ve-silinme.md#öğrenci-ve-veli) | [son 1 geçmiş yıl (tasarım)](saklama-ve-silinme.md#öğrenci-ve-veli) | [ödevi silince quiz gider](saklama-ve-silinme.md#öğretmen) | — | [sahipsiz ödevi sunucu silmeye izin verir, ekranda düğme yok](saklama-ve-silinme.md#nereden-açılır) | — | [site yedeğinde quizler de var](saklama-ve-silinme.md#yönetici) | — |

Çalışan sütunu: bugünkü sitede öğretmen hesapları okulun Öğretmen rolüyle çalışır; müdür bu rolden "Ödev verir" ya da "Ödev
sonuçlandırır" yetkisini kaldırırsa ya da derse göre daraltırsa quiz de ona göre kapanır. Tasarımda öğretmen de okula çalışan olarak
eklenir ve müdürün verdiği Öğretmen rolüyle aynı şeyi yapar; rolsüz çalışan, servisçi ve yönetici quiz ekranı görmez (adres çubuğuna
`#/quiz` yazan öğrenci olmayan herkese "Quizi yalnız öğrencinin kendisi çözer." çıkar). Ziyaretçi quizi yalnız açılış sayfasındaki SSS'den
("Quiz nasıl çözülür, kaç hakkım var?", "Öğretmen quiz nasıl hazırlar?") okur. Tasarımdaki eğitmen ve tahta hesaplarında quiz yoktur.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## Açık noktalar

Kodlamadan önce kullanıcıya sorulacak ya da tasarımda netleşecekler:

- **Varsayılanlar:** Tasarım 1 önizlemesinde yeni quiz "Bütün quiz · 20 dakika" seçili ve yeni soru 60 saniyeyle açılıyor; bugünkü
  sitede yeni quiz "Süresiz", yeni soru (soru başına sürede) son sorunun süresiyle ya da 30 saniyeyle geliyor. Kullanıcı bu konuda bir şey
  demedi; bugünkü varsayılanlar kalır ya da sorulur.
- **Önizlemenin kısalttıkları:** önizlemede öğrencinin soru başına süreli akışı, açılmış sonuç ekranı, kontrol ekranındaki "Önizle /
  Quizi düzenle / Sonuçları şimdi aç" düğmeleri, ayrıntıdaki başlama-bitiş saati ve geçen süre çizilmedi; düzenleyicideki hata
  iletileri ve "Metinden ekle" iletileri sitedekilerden kısa, soru taşıma okları yok. Bunlarda bugünkü sitenin davranışı ve metinleri
  kalır (önizleme yalnız taklit eder).
- **Excel'den aktarma:** "sınavları Excel'le olur" sözünün sınav notlarını da kapsayıp kapsamadığı soruldu, cevap bekleniyor; doğru şıkkın
  Excel'de nasıl işaretleneceği, Doğru/Yanlış ve açık uçlu sorunun yazımı, örnek dosya kararlaştırılmadı.
- **Soru bankası:** "zümre"nin tanımı (aynı okulda aynı dersi verenler mi), bankadan silme ve düzeltme, fotoğraflı sorunun bankaya nasıl
  gideceği, öğretmen okul değiştirince bankanın ne olacağı.
- **Fotoğraf:** boyut ve quiz başına sayı sınırı; KVKK metni.
- **Ortak yazı düzenleyici:** soru metninde matematik satırıyla nasıl birleşeceği; "quiz talimatı" alanı tanımda anılıyor ama bugün yok ve
  önizlemede çizilmedi.
- **"Doldurmayanlara hatırlat"** (anket/quiz/ödev; günde bir) öneri olarak sunuldu, onay bekliyor.
- **Velide her çocuk ayrı oturum** (3 Ekim kararı): bugünkü velinin birleşik ödev listesi değişecek; quiz durumları yalnız oturumdaki
  çocuk için görünecek.
- **Bilinen açıklar** (kod belgesinde yazılı, kod değiştirilmedi): hızlı iki şık seçiminde "Tekrar dene"nin eski seçimi gönderebilmesi;
  aynı sekmede çıkış yapıp başka öğrenci girince quiz durumunun sıfırlanmaması; sekmeyi kapatmanın çıkış sayılmaması (tasarım sınırı);
  quiz bölümü kaldırıldıktan sonra pencerenin dışarı tıklayınca yine kapanmaması; öğrenci olmayanın `#/quiz`'deki "Ödevlere dön"ünün
  hata vermesi.
- **KILAVUZ'da küçük yanlış:** [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Quiz" bölümü "Kimse bitirmeden sonuçlandırılan ödevde açılış
  kalıcı olmaz; tekrar açınca başlamamış öğrenci çözebilir." diyor. Kodda sonuçlandırma anında çözmekte olan öğrencinin denemesi biter
  ve "bitiren" sayılır; bu yüzden açılış kalıcı olur. Doğrusu: "hiç kimse quizi başlatmadan sonuçlandırılan ödevde açılış kalıcı olmaz;
  tekrar açınca (son teslim geçmediyse ya da ileri alındıysa) öğrenci çözebilir".

## İlgili öbür klasörler

- [Ödevler](../odev/README.md) — quizin içinde durduğu ödev: verme, pencere, liste, sonuçlandırma, tekrar açma, silme.
- [Bildirimler](../bildirim/README.md) — "… quizinin sonucu açıklandı." ve velideki kopyası.
- [İlerleyiş](../ilerleyis/README.md) — öğrenci ve velinin ödev verisi (quiz özeti buradan gelir; grafikler yalnız öğretmenin sonucunu kullanır).
- [Sınavlar](../sinav/README.md) — not girilen sınavlar quizden ayrıdır; notları Excel'den yükleme. Tasarım 1 önizlemesindeki "Quiz
  (0–10)" sınav şablonu ve "Quiz 1" adlı sınav da not girilen sınavdır, bu klasördeki ödev quizi değildir.
- [Anketler](../anket/README.md) — anket düzenleyici (quizden ayrı), Excel'in sınav tarafına bırakılması.
- [Excel aktarımı](../excel-aktarim/README.md) — sitenin bugünkü Excel aktarımı.
- [Yazı düzenleyici](../yazi-yazma/README.md) — soru metni ve quiz talimatı için ortak düzenleyici (tasarım).
- [Dosya alanı ve küçültme](../okul-disk/README.md) — soru fotoğraflarının küçültülmesi ve disk sınırı (tasarım).
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Ödev verir", "Ödev sonuçlandırır", ders daraltması.
- [Özellikler](../ozellikler/README.md) — Ödevler kapalıysa quiz de kapalı.
- [Eğitim yılı](../egitim-yili/README.md) — geçmiş yıl, okul yedeği, mezunlar.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — quiz cevapları ve sekme kaydı: kim görür, ne kadar saklanır.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrencinin portalını açma, hesabı silme.
- [Ana sayfa](../ana-sayfa/README.md) — öğretmenin "Kontrol bekleyen ödevler"i (tasarım).
- [Uygulama](../uygulama/README.md) — telefona kurulan site uygulaması ve yerel Android uygulaması.
- [Hesap ayarları](../ayarlar/README.md) — Verilerimi indir (tasarım).
- [Yönetim](../yonetim/README.md) — site yedekleri.
- [Dil ve çeviri](../dil/README.md) — quiz ekranlarının yazıları çeviri kataloğuna girecek.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (quizin bütün ekranları),
  [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (ödev pencereleri, kontrol ekranı),
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (öğrencinin listesi ve penceresi),
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (velinin listesi),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) ("Ödevi ver", "Tekrar aç"),
  [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) ("Ekler" kutusunun ilk satırı),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`quiz` sayfası Ödevler bölümüne bağlı),
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`35-quiz.css`).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (bütün quiz uçları, süre, sonuçlar, dakikalık temizlik),
  [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (ayrıştırıcı, doğrulama, puan, süre zinciri),
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (yol yönlendirmesi, ödevle birlikte yazma, sonuçlandırma),
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (öğrenci ve velinin quiz özeti),
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (müdürün ders ödevleri), [sunucu/index.md](../../sunucu/index.md) (dakikalık iş),
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (aydınlatma metni sürümü).
- Veri: [sunucu/veri/depo/quiz.md](../../sunucu/veri/depo/quiz.md), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 029),
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedek).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md), [testler/test-quiz-metin.md](../../testler/test-quiz-metin.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md),
  [testler/girdi-denetimi.md](../../testler/girdi-denetimi.md), [testler/test-yedek.md](../../testler/test-yedek.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Quiz" bölümü.
