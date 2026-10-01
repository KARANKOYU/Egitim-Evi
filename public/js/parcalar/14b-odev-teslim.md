# public/js/parcalar/14b-odev-teslim.js

Ödev teslim dosyalarının ön yüzü: öğrencinin ödev penceresindeki "Teslim dosyaları" bölümü (sırayla, ilerleme çubuklu,
gerekirse önce küçülten yükleme; doluluk çubuğu; silme), velinin bakışı, öğretmenin kontrol ekranındaki "N ek" rozetleri, ek
penceresi, tarayıcıda fotoğraf/video/ses önizleme ve hepsini tek zip indirme.

## Bu dosya ne yapar?

Öğretmen ödev verirken "Öğrenciler bu ödeve dosya yükleyebilsin" kutusunu işaretlerse öğrenci ödevini dosya olarak teslim
edebilir: fotoğrafını çektiği defter sayfası, bir sunum, bir Scratch projesi… Bu dosya bu işin üç yüzünü taşır:

1. **Öğrenci.** "Ödevler"de ödevin satırına basınca açılan pencerenin altına "Teslim dosyaları" bölümü eklenir: yüklediği
   dosyalar ("2,4 MB · 05.10.2026 14:20 · 5 gün sonra silinir", İndir, Sil), doluluk çubuğu ("Dosya alanın · 32 / 50 MB")
   ve sürükle-bırak / basıp seç kutusu. Seçilen dosyalar sırayla, her biri kendi ilerleme çubuğuyla yüklenir; büyük
   fotoğraf önce tarayıcıda küçültülür ("Küçültülüyor…", sonra "8,4 MB → 620 KB"). Öğretmen izin vermediyse kutu hiç
   çıkmaz, "Bu ödev için dosya yüklenmiyor." yazar.
2. **Veli.** Kendi "Ödevler" listesinde çocuğunun ödev satırına basınca yalnız teslim dosyalarını gösteren bir pencere açılır;
   çocuğunun portalından ("Ödevleri") ödev penceresine bakınca da aynı bölüm altta durur. Veli görür ve indirir, yükleyemez,
   silemez.
3. **Öğretmen / müdür.** Ödev kontrol ekranında her öğrencinin altına yüklediği dosya sayısı ("3 ek") düğmesi, üste
   "Teslimleri indir (12,4 MB)" eklenir. "3 ek"e basınca öğrencinin dosyaları simge + ad + MB kutuları olarak açılır; hiçbir
   dosya kendiliğinden inmez (boşuna internet harcanmasın). Fotoğraf, video ve ses tıklayınca pencerede açılır; öbürleri
   sorulup iner. Uygunsuz dosya buradan silinir.

Sınırlar (10 dosya, toplam 50 MB, tek dosya 50 MB, izinli uzantılar) ve yetki sunucuda denetlenir
([../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md)); buradaki ön denetimler yalnız boşuna
yükleme yapılmasın diye. İndirme her zaman tek kullanımlık, 60 saniyelik bir biletle yapılır: oturum anahtarı adres satırına
girmez, büyük dosya ya da zip tarayıcı belleğine alınmadan doğrudan diske iner.

Ön yüz parçaları ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`, [../../../sunucu/http.md](../../../sunucu/http.md)
`birlesikOku`). Bu dosya `14-odev-filtre.js`'ten SONRA gelir ve onun `odev-oku` eylemini sarar; `14c-quiz.js` de bunu sarar.
Yüklenir yüklenmez pencereye bir `beforeunload` dinleyicisi kurar.

## İçinde neler var?

### Ortak durum

- `teslimDurum` — `{ odevId, ogrenciId, veri, yukleniyor, hatalar }`:
  - `odevId`, `ogrenciId` — en son açılan teslim görünümünün ödevi ve öğrencisi (öğrencinin kendisinde `''`);
  - `veri` — en son `GET /api/odev-dosya` cevabı (yükleme ön denetimleri buna bakar);
  - `yukleniyor` — süren yükleme sayısı (küçültülmekte olanlar dahil);
  - `hatalar` — liste bir sonraki yenilenişinde BİR KEZ gösterilecek satırlar: reddedilen dosyalar, yarıda kalan yüklemeler
    ve "küçültülerek yüklendi, 8,4 MB → 620 KB" notları.
  `ogretmenTeslimleri` ayrıca `teslimDurum.ogretmen = { dosyalar, baslik }` yazar; bunu okuyan yok.

### Öğrenci ve veli: teslim bölümü

- `EYLEMLER['odev-oku']` (sarma) — dosya yüklenirken önceki kaydı `odevOkuIlk`'e alır (`14-odev-filtre.js`'in pencereyi
  açan işlevi). Tıklamada önce onu çalıştırır; pencere açıldıysa (`#modalGovde` varsa) sonuna
  `div.teslim-bolum#teslimKap` ("Teslim dosyaları yükleniyor...") ekler, `hatalar`'ı boşaltır ve
  `teslimCiz(id, S.viewStudentId || '')` der. Pencere açılmadıysa hiçbir şey yapmaz.
- `EYLEMLER['veli-teslim']` — velinin ödev listesindeki satır (`27-veli-panel.js`: `data-id` ödev, `data-ogrenci` çocuk,
  `data-baslik` ödevin adı). Pencereyi HEMEN açar (başlık ödevin adı, yoksa "Teslim dosyaları"; gövde üst çizgisiz
  `#teslimKap` + "Yükleniyor..."), sonra `teslimCiz(ödev, çocuk)`. Söz döner. `14c-quiz.js` bunu da sarar ve pencerenin en
  üstüne quiz durumunu koyar.
- `teslimCiz(odevId, ogrenciId)` — `teslimDurum.odevId/ogrenciId`'yi yazar, `GET /api/odev-dosya?odev=<id>[&ogrenci=<id>]`
  ister, cevabı `teslimDurum.veri`'ye koyar. `#teslimKap` bu arada kalktıysa (pencere kapandı) çizmez. Çizdiği:
  - başlık `h4`: ek ikonu + "Teslim dosyaları";
  - öğretmen yüklemeyi açmadıysa (`dosyaYukleme === false`) `.hint.teslim-kapali` ile sunucunun nedeni ya da "Bu ödev için
    dosya yüklenmiyor." — daha önce yüklenmiş dosyalar yine listelenir;
  - açıksa ve dosya yoksa "Henüz dosya yüklemedin." (yükleyebilen öğrenci) ya da "Yüklenmiş dosya yok." (öteki herkes);
  - her dosya `teslimSatiri(f, silebilir)` (`silebilir` sunucudan; gelmezse `yukleyebilir`);
  - `#teslimYuklemeler` (o ana kadar biriken `hatalar` içine yazılır, sonra liste boşaltılır);
  - yükleyebiliyorsa: `dolulukCubugu(kullanılan, 50 MB, "Bu ödev için dosya alanın doldu (50 MB). Yer açmak için bir
    dosyanı sil.")` ([04d-ekler.md](04d-ekler.md)); dosya sayısı dolduysa (alan dolmadan) "Bir ödeve en fazla 10 dosya
    yükleyebilirsin. Yer açmak için bir dosyanı sil."; ikisi de dolmadıysa gizli `input#teslimDosya[multiple]` ve
    `label.ek-birak#teslimBirak` ("**Dosya yükle**: buraya sürükle ya da basıp seç" / "En fazla 10 dosya, toplam 50 MB; büyük
    fotoğraflar küçültülerek yüklenir. <saklama kuralı> Teslim süresi dolana kadar silip yeniden yükleyebilirsin.");
  - yükleyemeyen öğrencinin kendisinde (yükleme açık ama teslim kapalı) sunucunun nedeni: "Teslim süresi doldu.", "Ödev henüz
    başlamadı." ya da "Ödev sonuçlandırıldı; dosya yüklenemez.".
  Çizimden sonra dosya kutusunun `onchange`'i (`teslimKuyruk`, sonra kutu boşaltılır) ve bırakma kutusunun sürükleme olayları
  (`dragenter`/`dragover` → `uzerinde`, `dragleave`/`drop` → kaldır, `drop` → `teslimKuyruk`) bağlanır. Hata olursa
  `#teslimKap`'a iletisi yazılır (ör. 403 "Bu dosyaları görme yetkin yok").
- `teslimSatiri(f, silinebilir)` — `div.teslim-dosya`: ad; "boyut (`boyutYaz`) · yükleme anı (`tarihSaat`) · N gün sonra
  silinir" (`silinmeYazisi`, üzerine gelince tam silinme anı); "İndir" (`teslim-indir`) ve izin varsa "Sil" (`teslim-sil`).

### Yükleme

- `teslimBoyutSorunu(boyut, sinir, toplam)` — `''` (sığıyor) ya da "bir dosya en fazla 50 MB olabilir", "sığmıyor: bu ödev
  için 3,2 MB boş yerin kaldı", "bu ödev için dosya alanın doldu (50 MB)". `toplam`: o ana kadar ayrılmış yer.
- `teslimKuyruk(dosyalar)` — öğrencinin seçtiği/bıraktığı dosyalar. `veri.yukleyebilir` değilse çıkar. Yer hesabı var olan
  dosyaların toplamından başlar; izinli uzantılar sunucunun gönderdiği listeden (`veri.sinir.uzantilar`). Her dosya için
  sırayla:
  1. boşsa "boş dosya";
  2. küçültülebilir bir resimse (izinli uzantı + `resimKucultulebilir`, [04f-resim-kucult.md](04f-resim-kucult.md)) boyut
     denetimi SONRAYA kalır; değilse `teslimBoyutSorunu`;
  3. uzantı izinli değilse "bu tür yüklenemez"; kalan dosya hakkı dolduysa "en fazla 10 dosya yüklenir".
  Sorunlu dosya `#teslimYuklemeler`'e kırmızı satır ("**ad** — neden") olarak yazılır ve `hatalar`'a da eklenir; sorunsuz
  olan sıraya girer (küçültülmeyenin boyutu yer hesabına hemen eklenir). Küçülen fotoğraf için `yerAyir(k)`: küçülmüş
  boyutla `teslimBoyutSorunu`, sığarsa yer ayrılır. Sıradakiler `teslimTekYukle` ile TEK TEK gider; hepsi bitince (en az
  biri gittiyse) `teslimCiz(odevId, '')` listeyi yeniler.
- `teslimTekYukle(f, yerAyir, bitince)` — `#teslimYuklemeler` yoksa (pencere kapandı) hemen çıkar. Satır ekler
  (`div.yukleme-satir#yk<an><rastgele>`: ad, `.kucultme`, `.yuzde` — küçültülecekse "Küçültülüyor…", değilse "%0" —, "İptal"
  `data-act="teslim-iptal"`, `.cubuk`), `yukleniyor`'u bir artırır.
  - Küçültülecekse: `resimKucult(f)` beklenir (bu arada iptal edilebilir, `satir.__iptal`); gelince satırdaki ad küçülmüş
    dosyanın adı olur (ör. `.png` → `.jpg`), `.kucultme`'ye "8,4 MB → 620 KB" (`kucultmeYazisi`), yer `yerAyir` ile ayrılır;
    sığmazsa satır o nedenle biter, sığarsa küçülmüş dosya gider.
  - `gonder`: `XMLHttpRequest` (yükleme ilerlemesi için; `fetch` bunu vermez) `POST /api/odev-dosya/yukle?odev=<odevId>`,
    başlıklar `Authorization: Bearer …`, `Content-Type: application/octet-stream`, `X-Dosya-Adi: encodeURIComponent(ad)`,
    gövde dosyanın kendisi. İlerleme çubuğa ve "%37"ye yazılır.
  - Bitiş (`son`, bir kez çalışır): "İptal" kalkar, sayaç bir azalır. 200 → satır silinir (küçültüldüyse "**ad** —
    küçültülerek yüklendi, 8,4 MB → 620 KB" notu `hatalar`'a); başka her durum → satır kırmızı, yüzdenin yerine sunucunun
    `error`'u ya da "Yüklenemedi (kod)", ağ hatasında "Bağlantı koptu", iptalde "İptal edildi"; aynı satır `hatalar`'a da
    yazılır. Sonra `bitince()` (sıradaki dosya).
- `EYLEMLER['teslim-iptal']` — satırın `XMLHttpRequest`'i varsa `abort()`, küçültülüyorsa `__iptal()` (küçültme bitince
  dosya gönderilmez).
- `window`'a `beforeunload` — `yukleniyor > 0` iken sekmeyi kapatmak ya da yenilemek tarayıcının "Siteden ayrılınsın mı?"
  sorusunu açar.
- `EYLEMLER['teslim-sil']` — `confirm("Dosya silinsin mi?")` → `POST /api/odev-dosya/sil { id }`. Başarıda açık görünüm
  yenilenir: `#teslimKap` varsa `teslimCiz`, öğretmenin ek penceresi (`#teslimOgretmen`) açıksa `teslimOgrenciAc`. Hata →
  düğme açılır, `hataGoster` (tarayıcı uyarı kutusu). Öğrenci ve öğretmen/müdür aynı eylemi kullanır.

### İndirme

- `biletleIndir(yol)` — `api(yol)` ile bilet ister (`{ yol: '/api/odev-dosya/indir?bilet=…' }`), görünmez bir
  `<a download>` yaratıp tıklar, siler. Tarayıcı dosyayı ek olarak indirir; sayfa değişmez.
- `EYLEMLER['teslim-indir']` — düğmeyi kilitler, `biletleIndir('/odev-dosya/bilet?tur=dosya&id=<dosya>')`, sonra açar;
  hata → `hataGoster`.

### Öğretmen ve müdür: kontrol ekranı

- `ogretmenTeslimleri(odevId, baslik)` — ödev kontrol ekranı çizildikten sonra çağrılır. `GET /api/odev-dosya?odev=<id>`
  (yöneten için bütün dosyalar); öğrenci başına sayar ve her `.ok-satir .sonuc-kutu[data-sid]`'nin satırındaki `.buyu`'ya
  `button.baglanti.teslim-rozet[data-act="teslim-ogrenci"][data-id=<ödev>][data-ogrenci=<öğrenci>]` ("ek ikonu + 3 ek")
  ekler (dosyası olmayana eklenmez). Hiç dosya yoksa düğme yok; varsa `.odev-kontrol .ok-ust`'e "Teslimleri indir (12,4
  MB)" (`teslim-zip`). Hata yutulur: teslim bilgisi gelmezse kontrol ekranı yine çalışır.
- `EYLEMLER['teslim-ogrenci']` — `teslimOgrenciAc(el, odevId, data-ogrenci)`.
- `teslimOgrenciAc(el, odevId, ogrenciId)` — ödevin bütün dosyalarını yeniden ister, o öğrencininkileri süzer; pencere
  başlığı "<öğrencinin adı> — 3 ek" (dosya kalmadıysa "Öğrenci — 0 ek" ve "Dosya kalmadı."); gövde `#teslimOgretmen`:
  `.teslim-ogeler` ızgarasında her dosya `teslimOgesi`, altında "Fotoğraf, video ve ses tıklayınca burada açılır; öbür
  dosyalar sorup bilgisayarına iner. Uygunsuz bir dosyayı silebilirsin." + saklama kuralı. Hata → `hataGoster`.
- `TESLIM_MEDYA` — tarayıcıda açılabilen uzantılar: `jpg jpeg png gif webp bmp` → `resim`, `mp4 m4v webm mov` → `video`,
  `mp3 m4a wav ogg aac` → `ses`. Sunucudaki `MEDYA` listesinin aynısı (SVG ve HTML bilerek yok).
- `teslimMedyaTuru(ad)` — uzantıdan `resim`/`video`/`ses` ya da `''`.
- `mbYaz(b)` — "0,1 MB'tan küçük" ya da bir ondalıklı "2,4 MB" (`tr-TR`).
- `teslimOgesi(f)` — `div.teslim-oge-kap`: `button.teslim-oge.<resim|video|ses|dosya>[data-act="teslim-oge"][data-id]
  [data-ad][data-tur][data-boyut]` (simge `resim`/`oynat`/`muzik`/`belge`, ad, MB, "N gün sonra silinir"; `title` "Fotoğraf
  — aç", "Video — oynat", "Ses — dinle", "Dosya — indir") ve altında küçük "Sil" (`teslim-sil`).
- `EYLEMLER['teslim-oge']` — medya değilse `confirm('"ad" (2,4 MB) indirilsin mi?')` → `biletleIndir(tur=dosya)`. Medyaysa
  düğmeyi kilitler, `GET /api/odev-dosya/bilet?tur=goster&id=` → `{ yol }` ile yeni bir pencere: resim `<img>`, video
  `<video controls autoplay playsinline>`, ses `<audio controls autoplay>`; resim ve video sabit yükseklikli `.medya-kap`'ta
  (dosya yüklenince pencere büyüyüp kaymasın), ses `.medya-kap.ses`'te; altında MB. Pencerenin alt düğmeleri "Eklere dön"
  (`teslim-ogrenci`, `teslimDurum`'daki ödev ve öğrenciyle) ve "İndir" (`teslim-indir`). Hata → düğme açılır, `hataGoster`.
- `EYLEMLER['teslim-zip']` — düğmeyi kilitler, `biletleIndir('/odev-dosya/bilet?tur=zip&odev=<ödev>')` (sunucu öğrenci
  klasörlerine ayrılmış `<Ödev adı> - teslimler.zip` gönderir), sonra açar.

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de):
  - `S` (`token`, `user.role`, `viewStudentId`; [00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER`, `boyutYaz`
    ([01-yardimcilar.md](01-yardimcilar.md)); `ik` (`ek`, `yukle`, `indir`, `resim`, `oynat`, `muzik`, `belge`), `tarihSaat`
    ([02-ikonlar.md](02-ikonlar.md)); `modalAc` ([03-mesaj-modal.md](03-mesaj-modal.md));
  - `dolulukCubugu`, `silinmeYazisi`, `boyutYazi` ([04d-ekler.md](04d-ekler.md)); `resimKucultulebilir`, `resimKucult`,
    `kucultmeYazisi` ([04f-resim-kucult.md](04f-resim-kucult.md));
  - `EYLEMLER['odev-oku']`'nun önceki hâli (`14-odev-filtre.js`, [14-odev-filtre.md](14-odev-filtre.md)); `hataGoster`
    (`25-tiklama.js`).
- Sunucu uçları — hepsi [../../../sunucu/bolumler/odev-dosya.md](../../../sunucu/bolumler/odev-dosya.md):
  - `GET /api/odev-dosya?odev=<id>[&ogrenci=<id>]` — rol öğrenci, veli, öğretmen, müdür. Ödevi yöneten (veren öğretmen ya da
    okulun müdürü) `ogrenci` vermezse bütün dosyalar: `{ dosyalar, yonetir: true, toplam, dosyaYukleme, saklama }`. Öteki
    durumlar (öğrencinin kendisi; veli `?ogrenci=` ile bağlı çocuğu; yöneten tek öğrenci): `{ dosyalar, dosyaYukleme,
    yukleyebilir, silebilir, kapali, kullanilan, saklama, sinir: { dosya, adet, toplam, uzantilar } }`; görme hakkı yoksa
    403 "Bu dosyaları görme yetkin yok". Her dosya `{ id, ad, boyut, yuklenme, bitis, ogrenciId, ogrenci }`.
  - `POST /api/odev-dosya/yukle?odev=<id>` — gövde dosyanın kendisi; `api.js` bunu JSON okuyucusuna sokmaz. Yalnız ödevdeki
    onaylı öğrenci; yükleme kapalıysa 403 `{ dosyaKapali }`; teslim kapalıysa 400; 50 MB'tan büyük ya da alana sığmayan
    413; izinsiz uzantı 415; 10 dosya dolduysa 400; okulun disk alanı ya da sunucu dolduysa 507; saatte 60'tan sık ya da
    aynı anda çok yükleme 429. Cevap `{ dosya: { id, ad, boyut, yuklenme }, message }`. Okulda Ödevler kapalıysa 403
    `ozellikKapali: 'odev'` (gövde okunmadan).
  - `POST /api/odev-dosya/sil { id }` — yöneten her zaman; öğrenci yalnız kendi dosyasını, teslim ve yükleme açıkken.
  - `GET /api/odev-dosya/bilet?tur=dosya&id=` / `?tur=goster&id=` (`{ yol, tur }`; medya olmayana 400) / `?tur=zip&odev=`
    (yalnız yöneten) → `{ yol }`; ardından tarayıcı `…/indir?bilet=`, `…/goster?bilet=`, `…/zip?bilet=` adreslerini oturum
    başlığı olmadan açar (bilet 60 sn ve tek kullanımlık; gösterme bileti 5 dk ve çok kullanımlık). Saatte 300 indirme,
    20 zip.
- Onu kullananlar:
  - [14-odev-filtre.md](14-odev-filtre.md) — sardığı `odev-oku`: öğrencinin "Ödevler"i ve portal görünümündeki "Ödevleri".
  - [14c-quiz.md](14c-quiz.md) — `odev-oku`'yu (bu dosyanınkini) ve `veli-teslim`'i yeniden sarar: zincir 14 → 14b → 14c.
  - [11-ogretmen-odev.md](11-ogretmen-odev.md) — `odevAc` kontrol ekranını çizdikten sonra `ogretmenTeslimleri(a.id, a.title)`;
    rozetlerin oturduğu `.ok-satir`, `.sonuc-kutu[data-sid]`, `.buyu` ve `.odev-kontrol .ok-ust` düzeni orada.
  - `27-veli-panel.js` — velinin ödev listesi satırları `data-act="veli-teslim"` (velinin ana sayfasındaki "Yaklaşan ödevler"
    de aynı listeyi kullanır).
  - [07-yonlendirme.md](07-yonlendirme.md) — `sayfayiYenile` `teslimDurum.yukleniyor > 0` iken yenilemez ("Dosya yükleniyor.
    Yükleme bitince yenileyebilirsin.").
  - `testler/test-resim-kucult.js` — `teslimDurum`, `teslimKuyruk`, `teslimCiz`, `EYLEMLER['teslim-iptal']`'i doğrudan kullanır.
  - Ekran turu `araclar/gezinti.js` (ÇALIŞTIRMA): "Ödev kontrolü — öğrencinin altında "3 ek"", "Öğrencinin ekleri: simge ve MB",
    "Fotoğrafa tıklayınca burada açılır", "Videoya tıklayınca oynatıcı açılır", velinin teslim penceresi; örnek teslim
    dosyalarını `araclar/gorsel-veri.js` yükler.
- Görünüm (`public/css/parcalar/`): `26-anket-okul-hayati.css` (`.teslim-bolum` ve `h4`, `.teslim-dosya`, `#teslimYuklemeler`
  — uzun ad üç noktayla kısalır —, `.yukleme-satir` ve `.hata`, `.yukleme-ust`, `.kucultme` (boşken gizli), `.yuzde`,
  `.teslim-rozet`); `02-form.css` (`.ek-birak` ve `.uzerinde`, `.doluluk`, `.doluluk-uyari`, `.hint`, `.btn`);
  `22-cesitli.css` (`.teslim-ogeler`, `.teslim-oge-kap`, `.teslim-oge` ve `.resim/.video/.ses` renkleri, `.teslim-oge-ikon`,
  `-ad`, `-boyut`, `-silinme`, `.kucuk-baglanti`, `.medya-kap`, `.medya-oge`); `05-tablo-grafik.css` (`.cubuk`);
  `09-kayit-ekrani.css` (`.baglanti`). `.teslim-kapali` için ayrı kural yok (yalnız `.hint`).
- Rol: öğrenci (yükler, siler, indirir); veli (görür, indirir); ödevi veren öğretmen ve okulun müdürü (rozet, ek penceresi,
  önizleme, indirme, zip, silme). Müdür ve `ogrenci.portal` yetkili öğretmen öğrenci portalında ödev penceresini açınca bu
  bölüm onlara da çizilir (aşağıda "Dikkat!"). Android uygulaması bu dosyayı kullanmaz.

## Nasıl çalışır (adım adım)?

### Öğrencinin yüklemesi

```
"Ödevler" ─► satır ─► odev-oku (14c ─► 14b ─► 14) ─► pencere + #teslimKap
teslimCiz ─► GET /api/odev-dosya?odev=O ─► liste + doluluk + bırakma kutusu
3 dosya bırakıldı ─► teslimKuyruk
   odev.pdf   2 MB  ─► uzantı tamam, sığıyor ─► sıraya (2 MB ayrıldı)
   foto.jpg 8,4 MB  ─► küçültülebilir ─► sıraya (yer sonra)
   oyun.exe         ─► "bu tür yüklenemez" (kırmızı satır, hatalar'a)
sıra: teslimTekYukle(odev.pdf) ─► XHR POST /api/odev-dosya/yukle?odev=O ─► %0…%100 ─► 200 ─► satır silinir
      teslimTekYukle(foto.jpg) ─► "Küçültülüyor…" ─► resimKucult ─► "8,4 MB → 620 KB" ─► yerAyir(620 KB) ─► XHR
      bitti ─► teslimCiz ─► liste yenilenir; #teslimYuklemeler'de "oyun.exe — bu tür yüklenemez" ve
               "foto.jpg — küçültülerek yüklendi, 8,4 MB → 620 KB" bir kez görünür
```

### Öğretmenin bakışı

```
kontrol ekranı (11: odevAc) ─► ogretmenTeslimleri ─► GET /api/odev-dosya?odev=O (hepsi)
   öğrenci satırlarına "3 ek" ─► teslim-ogrenci ─► teslimOgrenciAc ─► pencere: simge + ad + MB
      fotoğraf/video/ses ─► GET …/bilet?tur=goster ─► pencerede <img>/<video>/<audio> ─► "Eklere dön" | "İndir"
      öbürü ─► "indirilsin mi?" ─► GET …/bilet?tur=dosya ─► <a download> ─► …/indir?bilet=B
   üstte "Teslimleri indir (12,4 MB)" ─► GET …/bilet?tur=zip ─► …/zip?bilet=B (öğrenci klasörleriyle tek zip)
```

## Dikkat!

- **Kuyruk açık olan ödeve yükler.** `teslimTekYukle` adresi gönderme ANINDA `teslimDurum.odevId`'den kurar. Öğrenci birkaç
  dosyayı sıraya koyup pencereyi kapatır ve başka bir ödevin penceresini açarsa (`teslimCiz` `odevId`'yi hemen değiştirir)
  ve süren yükleme ikinci pencere çizildikten sonra biterse, ilk ödevin sırada bekleyen dosyaları yeni pencerenin
  `#teslimYuklemeler`'ine düşer ve İKİNCİ ödeve gönderilir (o ödevde yükleme açıksa sunucu kabul eder; yer ön denetimi ise
  hâlâ birinci ödevin verisiyle yapılır). Kod okumasına göre; tarayıcıda denenmedi, kod değiştirilmedi. Öneri: `teslimKuyruk`
  ödev kimliğini başta yakalayıp `teslimTekYukle`'ye geçirsin.
- **Pencere kapanınca kuyruk sessizce durur.** Pencereyi kapatmak ("Kapat" ya da perdeye basmak) ve geri tuşu
  (`25-tiklama.js`'in `hashchange`'i önce `modalKapat` der) hiçbir şey sormaz. Perde bütün ekranı kapladığı için menüye
  ya da üst şeride basmak da önce yalnız pencereyi kapatır. Süren XHR arka planda biter. Küçültülmekte olan fotoğraf da
  durmaz: küçültme bitince kopuk satırla yine gönderilir (adres o anki `teslimDurum.odevId`). Sıradaki dosya ise
  `#teslimYuklemeler`'i bulamadığı için hiç yüklenmez ve bunu kimse söylemez. Yalnız sekmeyi kapatma/yenileme
  (`beforeunload`) ve üstteki "Yenile" düğmesi (`sayfayiYenile`) yükleme sürerken uyarır.
- **Biten dosya listede geç görünür.** Başarılı yüklemenin satırı hemen silinir; dosyanın kendisi listede ancak bütün kuyruk
  bitince (`teslimCiz`) görünür. Çok dosyalı kuyrukta öğrenci arada bitenleri hiçbir yerde görmez.
- **Yükleme sürerken liste yenilenirse süren satır kaybolur.** Bu sırada bir dosyayı "Sil"mek `teslimCiz`'i çağırır,
  `#teslimYuklemeler` yeniden yazılır: süren yüklemenin ilerleme satırı ve "İptal"i ekrandan gider, yükleme sürer.
- **İkinci kuyruk ilkini bilmez.** Yükleme sürerken bırakma kutusu açık kalır; yeni dosyalar ikinci bir kuyruk başlatır,
  yer ve sayı hesabı yine `veri.dosyalar`'dan (süren yüklemeler hariç) başlar. Sınır aşılırsa sunucu reddeder (satırda
  hata); iki kuyruk aynı anda yükler (sunucunun kişi başına aynı anda 3 sınırının içinde).
- **Küçültülecek fotoğraf yeri en son ayırır.** Küçültülmeyen dosyalar kuyruk kurulurken yer ayırır, fotoğraf ise sırası
  gelip küçülünce. Alanı dolduracak kadar dosya seçilirse listede önce gelen fotoğraf, arkasındaki PDF'ler yüzünden
  "sığmıyor" alabilir.
- **"50 MB" metinleri sabit.** Dosya sayısı (`d.sinir.adet`) ve karşılaştırmalar sunucunun `sinir`'inden gelir ama
  kullanıcıya görünen "toplam 50 MB", "bir dosya en fazla 50 MB olabilir", "dosya alanın doldu (50 MB)" yazıları elle
  yazılıdır; sunucuda sınır değişirse bu yazılar da değişmeli.
- **`TESLIM_MEDYA` sunucuyla elle eşit tutulur.** Sunucu `MEDYA`'ya bir tür eklerse burada da eklenmezse dosya önizleme
  yerine iner; burada fazla bir tür olursa sunucu 400 "Bu dosya tarayıcıda açılamaz; indir." der. İzinli uzantılar ise
  04d'deki gibi elle kopyalanmaz, sunucudan gelir.
- **Medya penceresinde "Kapat" yok.** Alt düğmeler "Eklere dön" ve "İndir"; pencereyi kapatmak için dışına (perdeye) basmak
  gerekir. Video ve ses pencere açılınca kendiliğinden çalar. Gösterme bileti 5 dakika yaşar: pencere uzun açık kalırsa
  videoda ileri sarma bileti süresi dolmuş isteğe çarpabilir (kod okumasına göre).
- **İndirme hatası ekranda görünmez.** `biletleIndir` yalnız bilet isteğinin hatasını yakalar; asıl indirme isteği (ör.
  bilet bu arada dolduysa 410, dosya diskte yoksa 404) tarayıcının indirme çubuğunda başarısız görünür.
- **XHR oturum düşmesini tanımaz.** `api()` 401'de çıkış yapar; yükleme ise yalnız satıra sunucunun iletisini yazar.
- **Öğretmen silince kontrol ekranı tazelenmez.** Ek penceresi yenilenir ama arkadaki "3 ek" rozeti ve "Teslimleri indir
  (… MB)" düğmesi kontrol ekranı yeniden açılana kadar eski sayıyı gösterir.
- **Portal görünümünde kim ne görür.** Müdür (ödevi yöneten sayılır) çocuğun portalında dosyaları görür ve indirir ama bu
  görünümde "Sil" çıkmaz (`silebilir` yalnız öğrencinin kendisine). `ogrenci.portal` yetkili öğretmen ödevi kendisi
  vermediyse bölümde 403 "Bu dosyaları görme yetkin yok" görür.
- **Velinin kendi listesinden açılan pencere yalnız teslimi gösterir.** `veli-teslim` penceresinde ödevin açıklaması ve
  öğretmenin ekleri yok (14c yalnız quiz durumunu ekler); onlar için çocuğun portalındaki "Ödevleri"ne bakmak gerekir.
- **Ölü parçalar.** `teslimDurum.ogretmen` yazılır ama okunmaz; `ogretmenTeslimleri`'nin `baslik` parametresi yalnız oraya
  gider; "İndir" düğmesindeki `data-ad` okunmaz. Silinebilirler; kod değiştirilmedi.
- **Kılavuzla küçük fark.** `belge/KILAVUZ.md` "alan ya da dosya sayısı dolunca … "Bu ödev için dosya alanın doldu (50 MB)…"
  yazar" diyor; dosya SAYISI dolunca çıkan cümle aslında "Bir ödeve en fazla 10 dosya yükleyebilirsin. Yer açmak için bir
  dosyanı sil.".
- **Sarma sırası dosya adına bağlı.** `odevOkuIlk` yüklenme anında okunur; bu dosya `14-odev-filtre.js`'ten önce birleşseydi
  (ad değişirse) `odevOkuIlk` boş kalır, tıklama hata verirdi.
- **HTML güvenliği:** dosya adları, öğrenci adları ve bilet adresleri `esc`'ten geçer; önizleme yalnız sunucunun bilet
  adresini kullanır. Yüklenen içerik sunucuda hiçbir zaman sayfa olarak çalışmaz (indirme `attachment`, önizleme yalnız
  resim/video/ses, `sandbox`).

## Testleri

- `testler/test-resim-kucult.js` (başsız Edge/Chrome, sunucusuz; `node testler/test-resim-kucult.js`, tarayıcı yoksa atlanır)
  — bu dosyayı `00-durum`, `01-yardimcilar`, `02-ikonlar`, `03-mesaj-modal`, `04d-ekler`, `04f-resim-kucult`, `19g-okul-sayfasi`
  ile ayrı betikler olarak yükler, `XMLHttpRequest`'i sahtesiyle değiştirir ve `teslimCiz`'i sayaçla değiştirir. Teslim
  bölümü: 1 MB'lık alana 3 MB'tan büyük, fotoğraf gibi bir PNG (`odev.png`) bırakılınca satırda "Küçültülüyor…", sayaç 1
  ve erken hata yok; küçülmüş dosya `odev.jpg` adıyla ve 1 MB'tan küçük gövdeyle gidiyor; satırda "3,3 MB → … KB" ve
  "%0"; 200 gelince liste bir kez yenileniyor, "küçültülerek yüklendi" notu kalıyor, sayaç 0; alan 100 KB iken küçülünce de sığmayan dosya gönderilmiyor ve
  "sığmıyor: bu ödev için 100 KB boş yerin kaldı" yazıyor; küçültülürken "İptal" edilen dosya gönderilmiyor ("İptal
  edildi", sayaç 0).
- Sunucu tarafı (`testler/tumtest.sh`, 3200): `testler/test-odev-dosya.js` (yükleme, ad temizliği, içeriğin bayt bayt geri
  gelmesi, başkasının erişememesi, zip, `goster` ve Range, sayı/alan sınırı, yükleme izni, silinme anı, okul disk sınırı),
  `testler/test-okul-disk.js`, `testler/test-ozellikler.js` (Ödevler kapalıyken teslim listesi 403), `testler/test-yedek.js`,
  `testler/yetki-denetimi.js`.
- `testler/buton-denetimi.js` — `teslim-indir`, `teslim-sil`, `teslim-iptal`, `teslim-ogrenci`, `teslim-oge`, `teslim-zip`,
  `veli-teslim` eylemlerinin karşılığı. `testler/yazim-denetimi.js` ve `testler/test-kucult.js` bütün parçalar gibi.
- Elle (3200): `testler/seed.js`'teki öğretmenle "Öğrenciler bu ödeve dosya yükleyebilsin" işaretli bir ödev ver; öğrenciyle
  ödevi aç, bir PDF ve büyük bir telefon fotoğrafı bırak (fotoğraf satırı "Küçültülüyor…", sonra "… MB → … KB"); bir dosyayı
  sil. Öğretmenle ödevi aç: öğrencinin altında "2 ek", fotoğraf pencerede açılmalı, PDF sorup inmeli, "Teslimleri indir" zip
  vermeli. Veliyle "Ödevler"de satıra bas: dosyalar görünür, "Sil" yok.

## Son durum

- `git log`: 6 commit. Dosya 2026-09-26'da iki commit'le kuruldu:
  - `7332f32 commit 365`: ilk 60 satır (`teslimDurum`, `odev-oku` sarması, `teslimCiz`). Aynı commit'te sunucu tarafı
    `sunucu/bolumler/odev-dosya.js`'e 194 satır eklendi (sunucu dosyası 363'te başlamıştı).
  - `5540278 commit 366`: geri kalan 202 satır. Satır, indirme, silme, kuyruk, iptal, `beforeunload`, öğretmen rozetleri,
    ek penceresi, önizleme, zip ve `veli-teslim` bu commit'le geldi. O zaman silinme yazısını `teslimKalanGun` yazıyordu.
- `51974f1 commit 443` (2026-09-26): `teslimOgesi` — öğretmenin ek penceresinde her dosya simge + ad + MB kutusu.
  `3162077 commit 508` (2026-09-26): medya önizlemesi sabit yükseklikli kutuda (pencere kaymasın), ses için `.medya-kap.ses`.
- `566b917 commit 524` (2026-09-27, canlı hazırlık): yükleme izni ("Bu ödev için dosya yüklenmiyor." ve önceden yüklenenlerin
  listelenmesi), doluluk çubuğu ve dolunca bırakma kutusunun yerine uyarı, dosya sayısı uyarısı, `silebilir`'in
  `yukleyebilir`'den ayrılması (teslim donunca silme yok), silinme yazısının `silinmeYazisi`'ne geçmesi (eski `teslimKalanGun`
  silindi), sınırın 150 MB'tan 50 MB'a inmesi ve tek dosya 50 MB ön denetimi, öğretmenin ek kutularında "N gün sonra
  silinir" ve pencerede saklama kuralı.
- Son değişiklik `40fc7e7 commit 525` (2026-09-27, okul disk sınırı + telefonda küçültme): `teslimBoyutSorunu` ayrıldı,
  küçültülebilir resim kuyruğa `kucult` işaretiyle girer, yer küçülmüş boyutla `yerAyir` ile ayrılır, `teslimTekYukle`'ye
  "Küçültülüyor…", `.kucultme` notu, küçültülürken iptal (`__iptal`), küçülmüş adla gönderim ve "küçültülerek yüklendi"
  notu; bırakma kutusuna "büyük fotoğraflar küçültülerek yüklenir".
- Bilinen açıklar (kod değiştirilmedi): kuyruğun açık olan ödeve yüklemesi, pencere kapanınca kuyruğun sessizce durması
  (küçültülmekte olan fotoğrafın ise yine gönderilmesi), bitenlerin listede geç görünmesi, öğretmen silince rozetin eski
  kalması, ölü `teslimDurum.ogretmen` (Dikkat).
- Planlı işlerden bu dosyaya dokunması beklenenler (`.claude/gelistirme/DEVAM.md` 4. bölüm):
  - "Sunucuda küçültme … aynı dosya tek kopya" (iş 1, tanımı kesinleşmiş kararlarla): BÜTÜN videolar da tarayıcıda
    küçültülecek (WebCodecs; küçültülemezse ve sınırı aşıyorsa "Videoyu 720p olarak kaydet"); `teslimKuyruk`'un "küçültülebilir"
    kararı videoyu da kapsayacak. Sunucu sonradan küçülttüğü dosyanın satırına "Otomatik küçültüldü (…)" notu koyacak:
    `teslimSatiri` ve `teslimOgesi` bunu gösterecek.
  - "Düzenleyiciler" — ortak yazı düzenleyicisinin alanlarından biri "ödev teslim metni (öğrenci)": teslim bölümüne metin
    alanı gelecek.
  - "Mesaj ayarları … ödev hatırlatma otomasyonu" — öğrenci teslim edince (dosya yükleyince) hatırlatmalar duracak
    (sunucu tarafı; bölümde bir "teslim edildi" göstergesi gerekebilir).
  - "Android yerel uygulama" — uygulamanın teslim yüklemesi bu dosyadaki düzene (gövde dosyanın kendisi, `X-Dosya-Adi`,
    ilerleme) ve bilet adresiyle indirmeye bakacak; uçlar değişirse ikisi birlikte güncellenmeli.
  - "Kullanıcı arama … Verilerimi indir" — öğrencinin teslim dosyalarının listesi (duruyorsa dosyaları da) indirilecek veriye
    girecek (sunucu tarafı).
  - "Çok dil" (bütün metinler), "Ekran turu + albüm" (teslim görüntüleri baştan çekilecek).
