# public/js/parcalar/04d-ekler.js

Mesaja ve öğretmenin verdiği ödeve dosya ekleme alanı: sürükle-bırak ya da seç, her dosyanın hemen (taslak olarak)
ilerlemeli yüklenmesi, büyük fotoğrafın önce küçültülmesi, 50 MB doluluk çubuğu, kaldırma; okuma tarafında indirme
düğmeli ek listesi.

## Bu dosya ne yapar?

Öğretmen ödev verirken çalışma kâğıdı, sunum, fotoğraf ekleyebilir; herkes mesajına dosya koyabilir. Bu dosya ekleme
kutusunun hem görünümünü hem davranışını taşır:

1. Kişi dosyayı kutuya sürükler ya da kutuya basıp seçer (birden çok dosya olur).
2. Her dosya seçilir seçilmez sunucuya **taslak** olarak yüklenir (`POST /api/ek/yukle`); satırda ilerleme çubuğu akar.
   Böylece "Gönder"e basınca beklemek gerekmez, yalnız yüklenen eklerin kimlikleri gider.
3. Büyük fotoğraf yüklenmeden önce tarayıcıda küçültülür (`04f-resim-kucult.js`): satırda önce "Küçültülüyor…", sonra
   "8,4 MB → 620 KB". Yer denetimi küçülmüş boyutla yapılır.
4. Eklerin toplamı en çok 50 MB; kutunun altında "Dosya alanın · 32 / 50 MB" çubuğu durur, dolunca bırakma kutusu gizlenir
   ve yer açma uyarısı çıkar.
5. Mesaj gönderilince ya da ödev kaydedilince sunucu taslakları ona bağlar. Ek dosyaları yüklendikten 7 gün sonra silinir;
   hiç bağlanmayan taslaklar 6 saatte.

Okuma tarafında `ekListesiGoster` mesajın/ödevin eklerini "İndir" düğmeleriyle listeler; indirme tek kullanımlık biletle
yapılır.

Aynı dosyadaki `dolulukCubugu`, `silinmeYazisi` ve `boyutYazi` öğrencinin ödev teslim ekranında da kullanılır (ekler ve
teslim aynı görünümde).

## İçinde neler var?

### Sabitler ve durum

- `EK_SINIR` — 50 MB (`50 * 1024 * 1024`): bir mesajın/ödevin eklerinin toplamı. Sunucudaki `EK_SINIR` ile aynı.
- `EK_UZANTILAR` — izinli uzantılar: belge (`pdf doc docx odt rtf txt xls xlsx ods csv ppt pptx odp key pages numbers`),
  görsel (`jpg jpeg png gif webp heic heif bmp tif tiff svg psd ai`), ses/görüntü (`mp3 m4a wav ogg aac flac mp4 mov m4v
  webm avi mkv 3gp`), arşiv ve kod (`zip rar 7z sb3 ggb py ipynb html css js java c cpp`). Liste sunucudaki `UZANTILAR`'ın
  aynısı ([../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md)).
- `EKLER` — alan kimliği → `{ tur: 'mesaj'|'odev', dosyalar: [...], silinecek: [ekId…] }`. Her dosya satırı
  `{ ad, boyut, durum, hata, yuzde, id?, xhr?, mevcut?, kucultme?, kaldirildi? }`; `durum`: `kucultuluyor`, `yukleniyor`,
  `tamam`, `hata`.

### Biçim yardımcıları (başka ekranlar da kullanır)

- `boyutYazi(n)` — `"620 KB"`, `"8,4 MB"`; en az `1 KB` (bayt yazmaz). [01-yardimcilar.md](01-yardimcilar.md)'deki
  `boyutYaz`'dan farklı olarak KB'yi de `sayiTR` ile yazar.
- `mbSayi(n)` — doluluk çubuğundaki sayı: 10 MB ve üstü tam sayı (`32`), altı bir ondalık (`0,4`), sıfırdan büyükse en az
  `0,1`; `0` bayt → `0`.
- `dolulukCubugu(kullanilan, sinir, doluMetni)` — `<div class="doluluk [az-kaldi|dolu]">`: "Dosya alanın" + `32 / 50 MB`,
  `role="progressbar"` çubuk (`aria-valuenow` yüzde), dolunca `role="status"` uyarı (`doluMetni`, `esc`'li). %90'da
  `az-kaldi` (turuncu), dolunca `dolu` (kırmızı).
- `silinmeYazisi(bitis)` — takvim gününe göre "bugün silinir" / "yarın silinir" / "5 gün sonra silinir"; okunamazsa `''`.

### Yazma tarafı (ekleme kutusu)

- `ekAlani(kimlik, tur, mevcut)` — HTML döner ve `EKLER[kimlik]`'i SIFIRDAN kurar. `mevcut` düzeltilen ödevin var olan
  ekleri (`{ id, ad, boyut, suresiDoldu }`); süresi dolmuşlar alınmaz, kalanlar "tamam, mevcut" satırı olur. Kutunun
  yazısı: "Dosya ekle: buraya sürükle ya da basıp seç · Birden çok dosya olur. Toplam en fazla 50 MB; dosyalar 7 gün sonra
  silinir. Büyük fotoğraflar küçültülerek yüklenir." Öğeler: `#ekAlan-<kimlik>`, gizli `input#ekDosya-<kimlik>` (`multiple`),
  `#ekDoluluk-<kimlik>`, `ul#ekListe-<kimlik>`.
- `ekAlaniKur(kimlik)` — HTML sayfaya konduktan SONRA çağrılır: sürükleme olayları (`uzerinde` sınıfı), bırakma ve dosya
  seçme → `ekDosyalariEkle`; listeyi çizer.
- `ekToplam(kimlik)` — yüklenen ve yüklenmekte olanların toplamı; hatalılar ve küçültülmekte olanlar (boyutu henüz belli
  değil) sayılmaz.
- `ekSigmiyor(kimlik, boyut)` — `''` ya da "Sığmıyor: 3,2 MB boş yer kaldı." / "Dosya alanın doldu.".
- `ekDosyalariEkle(kimlik, liste)` — her dosya için: boşsa "Boş dosya."; uzantı listede yoksa "Bu dosya türü eklenemez.";
  küçültülebilir bir resimse (`resimKucultulebilir`) yer denetimi sonraya kalır ve `ekKucultYukle`; değilse `ekSigmiyor`,
  sorun yoksa `ekYukle`. Hatalı dosya da satır olarak görünür (kırmızı, nedeniyle).
- `ekKucultYukle(kimlik, d, f)` — `resimKucult(f)`'i bekler (resimler sırayla, tek tek küçülür). Bu arada satır kaldırıldıysa
  ya da pencere kapanıp yeniden açıldıysa hiçbir şey yapmaz. Değilse yeni ad ve boyutu yazar ("8,4 MB → 620 KB"), yer
  denetimini küçülmüş boyutla yapar, sığıyorsa `ekYukle`. `resimKucult` asla reddetmez: küçültemezse dosyayı olduğu gibi
  döner.
- `ekYukle(kimlik, d, dosya, ad)` — `XMLHttpRequest` (ilerleme olayı için `fetch` değil): `POST /api/ek/yukle?tur=<tur>`,
  başlıklar `Authorization: Bearer …` ve `X-Dosya-Adi: encodeURIComponent(ad)`, gövde dosyanın kendisi. İlerleme satırdaki
  çubuğa yazılır (`data-ek-yuzde="<kimlik>-<sıra>"`). 200 ve `{ ek: { id } }` → `tamam`; başka her cevap → `hata` (sunucunun
  `error`'u ya da "Yüklenemedi (kod)"); ağ hatası → "Bağlantı koptu.".
- `ekListesiCiz(kimlik)` — satırları, doluluk çubuğunu ve kutunun `dolu` durumunu yeniden çizer. Satır yazısı:
  "Küçültülüyor…" · "8,4 MB → 620 KB · yükleniyor" · "620 KB · yüklendi" · "… · <hata>"; var olan (düzeltilen ödevin) ekte
  yalnız boyut. Her satırda "Kaldır" (`data-act="ek-kaldir" data-alan="<kimlik>" data-id="<sıra>"`).
- `EYLEMLER['ek-kaldir']` — satırı `kaldirildi` işaretler (küçültülüyorsa sonra yüklenmesin), süren yüklemeyi `abort()`
  eder; var olan ekse kimliğini `silinecek`'e koyar (kaydedince sunucu kaldırır), yeni yüklenmiş taslaksa
  `POST /api/ek/sil { id }` (hatası yok sayılır; taslak zaten 6 saatte silinir); satırı listeden çıkarır.
- `ekIdleri(kimlik)` — kaydederken gönderilecek YENİ eklerin kimlikleri (`tamam` ve `mevcut` değil).
- `ekSilinecekler(kimlik)` — düzeltmede kaldırılan eski eklerin kimlikleri (kopya dizi).
- `ekYukleniyor(kimlik)` — yükleniyor ya da küçültülüyor satırı var mı; ekranlar kaydetmeden önce bakar ("Dosyalar
  yükleniyor; bitince kaydet.").

### Okuma tarafı

- `ekListesiGoster(ekler, ilkSatir)` — `<div class="ekler-kutu"><h4>Ekler</h4><ul class="ek-liste">…`; her ek: ad, boyut,
  "N gün sonra silinir" ya da "süresi doldu, silindi" (soluk satır, düğmesiz); "İndir" (`data-act="ek-indir"`). `ilkSatir`
  listenin başına konan hazır satır (ödevin quizi, `14c-quiz.js`). Ek de ilk satır da yoksa `''`.
- `EYLEMLER['ek-indir']` — `GET /api/ek/bilet?id=<ek>` → `{ yol }` → `location.href = yol` (60 saniyelik tek kullanımlık
  bilet; dosya "ek" olarak iner, sayfa değişmez). Hata → `hataGoster` (tarayıcı uyarı kutusu).

## Kimle konuşur?

- Çağırdıkları: `$`, `esc`, `api`, `sayiTR`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik('ek'|'belge')`
  ([02-ikonlar.md](02-ikonlar.md)); `S.token` ([00-durum.md](00-durum.md)); `resimKucultulebilir`, `resimKucult`,
  `kucultmeYazisi` (`04f-resim-kucult.js`, bu dosyadan SONRA birleşir ama çağrılar tıklamada olduğu için sorun olmaz);
  `hataGoster` (`25-tiklama.js`).
- Sunucu uçları ([../../../sunucu/bolumler/ekler.md](../../../sunucu/bolumler/ekler.md)):
  - `POST /api/ek/yukle?tur=mesaj|odev` — gövde dosya, `X-Dosya-Adi`; `odev` için öğretmen/müdür ve `odev.ver` yetkisi,
    `mesaj` için öğrenci/veli/öğretmen/müdür/servisçi (rolsüz yetişkin yükleyemez). Tek dosya en çok 50 MB (413), izinsiz
    uzantı 415, kişinin bütün taslakları en çok 150 MB (413), okulun disk sınırı dolduysa ya da sunucuda yer kalmadıysa
    507, saatte 100'den sık ya da **aynı anda 3'ten çok yükleme** (bütün sitede de aynı anda en çok 60) 429. Cevap
    `{ ek: { id, ad, boyut }, message }`.
  - `POST /api/ek/sil { id }` — yalnız yükleyen.
  - `GET /api/ek/bilet?id=` → `{ yol: '/api/ek/indir?bilet=…' }`; süresi dolmuşsa 410, göremiyorsa 404.
  - Kaydetme: mesaj `POST /api/mesajlar { …, ekIdler }` ([../../../sunucu/bolumler/mesaj.md](../../../sunucu/bolumler/mesaj.md)),
    ödev `POST /api/assignments { …, ekIdler }` ve düzeltme `{ ekIdler, ekSilIdler }`
    ([../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md)); sunucu `ekleriDogrula` ile en çok 20 ek, toplam
    50 MB, hepsi kişinin süresi dolmamış taslağı mı diye bakar.
- Onu kullananlar:
  - `11-ogretmen-odev.js` — "Yeni ödev" penceresi (`ekAlani('odev', 'odev')`, kaydederken `25-tiklama.js` `ekIdleri('odev')`,
    `ekYukleniyor('odev')`), "Ödevi düzenle" (`ekAlani('odevDuzelt', 'odev', S._acikOdevEkleri)`, `ekIdleri`,
    `ekSilinecekler`, `ekYukleniyor`), ödev ayrıntısında `ekListesiGoster(d.ekler, quizOgretmenSatiri(...))`.
  - `19-mesajlar.js` — "Yeni mesaj" penceresi (`ekAlani('mesaj', 'mesaj')`, `ekIdleri('mesaj')`, `ekYukleniyor('mesaj')`),
    okunan mesajın ekleri (`ekListesiGoster(m.ekler)`).
  - `14-odev-filtre.js` — öğrenci/veli ödev ayrıntısı: `ekListesiGoster(a.ekler, quizOdevSatiri(a, null))`.
  - `14b-odev-teslim.js` — öğrencinin teslim ekranı: `dolulukCubugu`, `silinmeYazisi`, `boyutYazi`.
  - `04f-resim-kucult.js` — `kucultmeYazisi` içinde `boyutYazi`.
- CSS: `public/css/parcalar/02-form.css` — `.ek-alan` (`.dolu` iken `.ek-birak` gizli), `.ek-birak` (`.uzerinde`),
  `.ek-liste`, `.ek-satir` (`.hatali` kırmızı), `.ek-ad`, `.ek-cubuk`, `.doluluk` (`.az-kaldi`, `.dolu`), `.doluluk-ust`,
  `.doluluk-cubuk`, `.doluluk-uyari`, `.ekler-kutu`; quiz satırı için `35-quiz.css`; süresi dolmuş satır `.soluk-satir`
  (`22-cesitli.css`); okul disk çubuğunun renkleri `36-ayar-kartlari.css` (aynı `.doluluk` düzeni).
- Rol: ekleme — mesaj yazan herkes (öğrenci, veli, öğretmen, müdür, servisçi), ödevde öğretmen ve müdür; okuma — mesajın
  alıcısı ve gönderen, ödevin öğrencisi, velisi ve öğretmeni.

## Nasıl çalışır (adım adım)?

```
"Yeni mesaj" ─► modalAc(… ekAlani('mesaj','mesaj') …) ─► ekAlaniKur('mesaj')
kişi 3 dosya bırakır ─► ekDosyalariEkle
   odev.pdf 2 MB      ─► uzantı tamam, sığıyor ─► ekYukle ─► XHR POST /api/ek/yukle?tur=mesaj  (ilerleme çubuğu)
   foto.jpg 8,4 MB    ─► resim ─► "Küçültülüyor…" ─► resimKucult ─► 620 KB, sığıyor ─► ekYukle
   oyun.exe           ─► "Bu dosya türü eklenemez." (kırmızı satır, yüklenmez)
   ekListesiCiz: "Dosya alanın · 2,6 / 50 MB"
"Gönder" ─► ekYukleniyor('mesaj')? ── evet ─► "Dosyalar yükleniyor; bitince gönder."
                                   └ hayır ─► api('/mesajlar', 'POST', { …, ekIdler: ekIdleri('mesaj') })
                                              sunucu: ekleriDogrula ─► ekleriBagla(mesaj)
alıcı mesajı açar ─► ekListesiGoster(m.ekler) ─► "İndir" ─► GET /api/ek/bilet ─► location.href = /api/ek/indir?bilet=…
7 gün sonra ─► sunucu dosyayı siler ─► satır "süresi doldu, silindi"
```

## Dikkat!

- **Seçilen dosyalar aynı anda yüklenir, sunucu kişi başına 3'e izin verir.** `ekDosyalariEkle` küçültülmeyen her dosyanın
  yüklemesini hemen başlatır; sunucu (`AYNI_ANDA_KISI = 3`) dördüncü eşzamanlı yüklemeyi 429 "Aynı anda çok fazla
  yükleme var. Biri bitince dene." ile reddeder. Yani dört ya da daha çok PDF'yi birden bırakan biri, bağlantı yavaşsa
  bazı satırlarda bu hatayı görür ve o dosyaları kaldırıp yeniden eklemesi gerekir. (Resimler sırayla küçültüldüğü için
  daha az etkilenir; öğrencinin teslim ekranı `14b-odev-teslim.js` dosyaları zaten sırayla yükler.) Kod okumasına göre;
  tarayıcıda denenmedi. Düzeltme önerisi: burada da en çok 3 yüklemelik bir kuyruk.
- **20 ek sınırı istemcide yok.** Sunucu bir mesaja/ödeve en çok 20 ek bağlar; ön yüz sayıyı denetlemez, 21. dosya da
  yüklenir, hata ancak "Gönder"de gelir ("En fazla 20 dosya eklenebilir.").
- **`EK_UZANTILAR` ve `EK_SINIR` sunucuyla elle eşit tutulur.** Sunucuda bir uzantı eklersen/çıkarırsan buraya da yaz;
  yoksa kişi "Bu dosya türü eklenemez" görür ya da yükleme 415 alır.
- **`ekAlani` durumu sıfırlar.** Aynı kimlikle pencere yeniden açılınca önceki satırlar unutulur; süren bir yükleme bitse
  bile kimliği kaybolur (sunucuda sahipsiz taslak kalır, 6 saatte silinir). Küçültülmekte olan dosya bu durumda hiç
  yüklenmez (`indexOf(d) < 0` denetimi).
- **Taslak 6 saatte silinir.** Pencereyi saatlerce açık bırakıp sonra gönderen kişi "Eklerden biri bulunamadı ya da süresi
  doldu. Yeniden ekle." alır.
- **Hatalı satır kaydı engellemez.** `ekIdleri` yalnız `tamam` satırları alır; kırmızı satır görünür ama kişi göndermeyi
  seçerse o dosya olmadan gider.
- **Hatalı satırın `hatali` sınıfı form hatalarıyla karışır.** Satır `li.ek-satir.hatali` olarak çizilir; bu sınıf adı
  [04a-form-alanlari.md](04a-form-alanlari.md)'nin alan hatasıyla aynı. "Ödevi düzenle" kaydedilirken
  `formHatalariniSil($('modalGovde'))` bu satırlardan da sınıfı kaldırır: kırmızı çerçeve gider, hata yazısı griye döner
  (bir sonraki `ekListesiCiz`'e kadar). Yalnız görünüş; kod değiştirilmedi.
- **`data-id` satır sırasıdır**, ek kimliği değil; liste her değişiklikte yeniden çizildiği için tutarlı kalır. Okuma
  tarafındaki `ek-indir`'de ise `data-id` gerçek ek kimliğidir.
- **Yükleme `XMLHttpRequest` ile**: `fetch` yükleme ilerlemesi vermiyor. `Content-Length` tarayıcı tarafından konur; sunucu
  onsuz 411 döner.
- **Anahtar yalnız başlıkta.** İndirme için adres satırına oturum anahtarı konmaz; tek kullanımlık, 60 saniyelik bilet
  kullanılır ([03-mesaj-modal.md](03-mesaj-modal.md)'deki `dosyaIndir`'den farklı yol: büyük dosya belleğe alınmaz).
- `ek-indir` hatası tarayıcının `alert` kutusuyla gösterilir (`hataGoster`), ekrandaki ileti düzeninden değil.

## Testleri

- `testler/test-resim-kucult.js` (başsız Edge/Chrome, sunucusuz) — bu dosyayı gerçek tarayıcıda çalıştırır: 3 MB'lık
  fotoğraf PNG eklenince satırda önce "Küçültülüyor…", henüz istek yok ve `ekYukleniyor` doğru; kutuda "Büyük fotoğraflar
  küçültülerek yüklenir."; küçülmüş JPEG yeni adıyla (`odev.jpg`) gönderiliyor; yüklenirken "3,3 MB → … KB · yükleniyor",
  bitince "… · yüklendi" ve `ekIdleri` kimliği veriyor; küçültülürken kaldırılan dosya gönderilmiyor; küçük PDF beklemeden
  gönderiliyor.
- `testler/test-yorum-ek.js` — sunucu tarafı: taslak yükleme, mesaja/ödeve bağlama, alıcının indirmesi, başkasının
  indirememesi, izinsiz uzantı ve 50 MB üstünün reddi, bir mesaja 50 MB'tan fazlasının kaydederken reddi, başkasının
  taslağının bağlanamaması.
- `testler/test-okul-disk.js` — ek yüklemesinin okulun disk kullanımına girmesi, dolunca reddedilmesi.
- `testler/test-ozellikler.js` — okulda ödev bölümü kapalıyken `tur=odev` yüklemesi 403; `testler/test-odev-dosya.js` —
  mesaj eki de en çok 50 MB (413).
- `testler/buton-denetimi.js` — `ek-kaldir`, `ek-indir` eylemlerinin karşılığı.
- Elle: öğretmenle "Yeni ödev ver" → bir PDF ve büyük bir telefon fotoğrafı bırak → fotoğraf satırı "Küçültülüyor…" sonra
  "… MB → … KB"; ödevi ver; öğrenciyle ödevi aç → "Ekler"de ikisi, "İndir" dosyayı indirmeli.

## Son durum

- `git log`: 4 commit. Son değişiklik `40fc7e7 commit 525` (2026-09-27, okul disk sınırı + telefonda küçültme): büyük
  fotoğraf yüklenmeden önce küçültülüyor — `ekKucultYukle`, `kucultuluyor` durumu, "Küçültülüyor…" / "8,4 MB → 620 KB"
  yazısı, yer denetiminin küçülmüş boyutla yapılması (`ekSigmiyor` ayrıldı), `ekYukle`'ye ayrı `ad` (küçülmüş dosyanın yeni
  adı), kaldırılan küçültmenin yüklenmemesi (`kaldirildi`), `ekYukleniyor`'un küçültmeyi de sayması, kutuya "Büyük
  fotoğraflar küçültülerek yüklenir.".
- Ondan önce `566b917 commit 524` (2026-09-27, canlı hazırlık): toplam sınır 150 MB'tan 50 MB'a indi; `mbSayi`,
  `dolulukCubugu`, `silinmeYazisi` eklendi; doluluk çubuğu ve dolunca bırakma kutusunun gizlenmesi; "Sığmıyor: … boş yer
  kaldı" iletisi; okuma tarafında silinme günü takvim gününe göre. `3b8fd36 commit 519` (2026-09-27, quiz):
  `ekListesiGoster`'e `ilkSatir` (ödevin quiz satırı). Dosyanın ilk hâli `c08ff52 commit 416` (2026-09-26).
- Bilinen açıklar (kod değiştirilmedi): eşzamanlı yükleme ile sunucunun 3 sınırı, istemcide 20 ek sınırının olmaması,
  "Ödevi düzenle"de `formHatalariniSil`'in hatalı ek satırlarının kırmızısını silmesi.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Sunucuda küçültme … aynı dosya tek kopya" (iş 1; sunucu tarafı,
  ama istemcideki "kısa kenar 1024 px altına inmez" kuralıyla aynı olacak); "Mesaj ayarları" (tanım: mesaja dosya
  ekleyebilenler öğretmen ve müdür her zaman, öğrenci varsayılan kapalı, veli varsayılan açık — ek kutusu role göre
  gizlenecek); "Başarılarım" (PNG/JPEG/PDF belge ekleme; bu alanın ya da teslim ekranının düzeni kullanılabilir);
  "Android yerel uygulama" (tanım, uygulamanın yüklemesinde bu dosyadaki `X-Dosya-Adi` düzenine bakılmasını söylüyor).
