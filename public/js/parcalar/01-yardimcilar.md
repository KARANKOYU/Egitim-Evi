# public/js/parcalar/01-yardimcilar.js

Bütün ön yüzün temel aletleri: kimlikle öğe bulan `$`, HTML kaçıran `esc`, sunucuyla konuşan `api`, düğme eylemleri
tablosu `EYLEMLER`, Türkçe sayı ve dosya boyutu biçimleri, tarayıcıya küçük tercih yazma.

## Bu dosya ne yapar?

Paketin ikinci dosyası ([00-durum.md](00-durum.md)'den hemen sonra). Burada tanımlanan adlar ön yüzün neredeyse her
satırında geçer: `esc` 48 parçada, `api` 45 parçada, `$` 42 parçada (yönetim parçaları da kullanır). Bu yüzden bir değişiklik
burada yapılınca bütün ekranlar etkilenir; dikkatli dokun.

Dosya üç sorunu tek yerde çözer:

1. **Güvenli ekran yazımı.** Ekranlar `innerHTML` ile metin birleştirerek çizilir. Kullanıcıdan gelen her şey (ad, ödev
   başlığı, mesaj) `esc()`'ten geçmezse sayfaya betik sokulabilir (XSS). `esc` bunun tek kapısıdır.
2. **Sunucuyla tek biçimde konuşma.** `api()` her isteğe oturum anahtarını ekler, cevabı JSON'a çevirir, hatayı Türkçe
   iletiyle `Error` olarak fırlatır; oturum düştüyse kişiyi sessizce çıkarır, sunucu "önce şifreni belirle" derse o
   pencereyi açar.
3. **Düğmelerin dağıtımı.** `EYLEMLER` tablosu sayesinde bir ekranın düğmesi (`data-act="…"`) o ekranın kendi dosyasında
   ele alınır; tek bir dev `if` zincirine eklemek gerekmez.

Dosya başındaki yorum "tarih/gün adları" da diyor; onlar bugün [02-ikonlar.md](02-ikonlar.md)'de.

## İçinde neler var?

### `$(id)`

`document.getElementById(id)`'nin kısası. jQuery değildir: yalnız kimlik alır, seçici (`.sinif`, `#id`) almaz; bulamazsa
`null` döner.

### `esc(s)`

`&`, `<`, `>`, `"`, `'` karakterlerini `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;` yapar; `null`/`undefined` → `''`, sayı →
metin. Hem öğe içine (`<b>' + esc(ad) + '</b>`) hem çift tırnaklı öznitelik değerine (`value="' + esc(x) + '"`) güvenle
yazılır.

### `api(path, method, body)`

- Girdi: `path` `/api`'den SONRAKİ kısım (`'/me'`, `'/push/abone'`); `method` varsayılan `'GET'`; `body` varsa JSON olarak
  gider (`Content-Type: application/json`).
- `S.token` varsa `Authorization: Bearer <anahtar>` başlığı eklenir. Anahtar adrese ya da çereze konmaz.
- Cevap metin olarak okunup JSON'a çevrilir; boşsa ya da bozuksa `{}`.
- Başarılıysa (2xx) JSON nesnesini döner (Promise).
- Başarısızsa:
  - **401** ve oturum açıksa → `cikisYap(true)` (`26-baslat.js`): sessiz çıkış, giriş ekranı. Giriş denemesindeki 401'de
    (`S.token` yok) çıkış yapılmaz.
  - **403 + `sifreDegismeli`** (ve istek `/password` değilse, oturum açıksa) → `S.user.sifreDegismeli = true` ve
    `sifreBelirleIste()` (`05b-sifre-zorunlu.js`): "Kendi şifreni belirle" penceresi açılır. Örnek: kişi girişliyken okul
    şifresini sıfırladı.
  - Her durumda `Error` fırlatılır: ileti sunucunun `error` alanı, yoksa `Bir hata oluştu (<kod>)`. Hataya iki alan eklenir:
    `hata.durum` (HTTP kodu) ve `hata.veri` (bütün JSON). Çağıranlar bunlara bakar: ör. `11-ogretmen-odev.js` 409
    `veri.kilitli` (quiz kilitli), `10b-hesaplar.js` `veri.alan` (hangi kutu kırmızı olacak), `05a-dis-sayfalar.js`
    `durum === 404`.
- Sunucu tarafı: bütün `/api` istekleri [../../../sunucu/api.md](../../../sunucu/api.md)'deki `handleApi`'den geçer (kapılar:
  `kvkkGerek`, `sifreDegismeli`, `rolsuz`, kapalı bölüm, arşiv yılı).

### `EYLEMLER`

Boş nesne. Parçalar içine `EYLEMLER['ad'] = function (el, id) { … }` yazar. Bir `data-act="ad"` öğesine tıklanınca
`25-tiklama.js`'teki `islem()` önce bu tabloya bakar ve `EYLEMLER[ad](el, el.getAttribute('data-id'))` çağırır;
yoksa kendi `if (act === …)` zincirine geçer. Bugün 34 parça 230 ayrı ad (233 atama; fazladan üçü aşağıdaki "sarma"
kalıbı), 4 yönetim parçası 21 eylem kaydediyor. Bu gruptan kayıt
yapanlar: [04b-bildirim-izni.md](04b-bildirim-izni.md) (`bildirim-ac`, `bildirim-kapat`), [04d-ekler.md](04d-ekler.md)
(`ek-kaldir`, `ek-indir`), [04e-tarih-secici.md](04e-tarih-secici.md) (`tarih-ac`, `tarih-ay`, `tarih-sec`,
`tarih-temizle`, `tarih-kapat`).

### Sayılar ve boyutlar

- `sayiTR(n, basamak)` — Türkçe yazım: `1234.5` → `"1.234,5"`, `490.161` → `"490,161"`. `basamak` en çok kaç ondalık
  (varsayılan 3). `null`, `undefined`, `''` ya da sayı olmayan → `''`. Kullananlar: [04d-ekler.md](04d-ekler.md),
  `08d-okul-disk.js`, `12-ogretmen-sinav.js`, `13-ogrenci-veli.js`, `14-odev-filtre.js`, `19e-servis-konum.js`,
  `28-grafik.js`, `09d-okul-disk.js`.
- `boyutYaz(n)` — bayt → `812 B`, `34 KB`, `2,4 MB` (MB'da bir ondalık). Kullananlar: `14b-odev-teslim.js` (teslim
  dosyaları, "Teslimleri indir (…)"), `09-yonetici.js` (yedek boyutu).
- `sayiGirdi(n)` — kutuya yazılacak hâl: binlik ayracı yok, ondalık virgül (`12.5` → `"12,5"`); boşsa `''`. Kullananlar:
  `12-ogretmen-sinav.js`, `09d-okul-disk.js`.
- `sayiOku(metin)` — kutudan okuma: boşlukları atar, İLK virgülü noktaya çevirir; `"85,5"` → `85.5`, boş → `null`, sayı
  değilse `NaN`. Kullanan: `12-ogretmen-sinav.js` (ölçüm değeri).

### Tarayıcı tercihleri

- `tercihOku(ad, varsayilan)` / `tercihYaz(ad, deger)` — `localStorage`'da `ee_<ad>` anahtarı. Gizli pencerede ya da
  depolama kapalıyken hata vermez: okuma varsayılanı döner, yazma sessizce vazgeçer. Değerler metin olarak saklanır.
  Bugünkü adlar: `giris_turu` (`05-giris.js`), `eposta_sorma` (`23-veli-ayarlar.js`), `odev_grafik_kapali`,
  `odev_grafik_gorunum` (`13-ogrenci-veli.js`, `28-grafik.js`), `sg_bant` (`28-grafik.js`).

## Kimle konuşur?

- Çağırdıkları: `fetch` (tarayıcı), `S.token`/`S.user` ([00-durum.md](00-durum.md)), `cikisYap` (`26-baslat.js`),
  `sifreBelirleIste` (`05b-sifre-zorunlu.js`), `localStorage`. Bu iki işlev dosyada tanımlı değildir; paket birleşince
  görünür olurlar (ancak bir hata cevabı gelince çağrıldıkları için sıra sorun olmaz).
- Sunucu: `api()` her `/api/...` ucuna gider; kapılar ve 401/403 cevapları
  [../../../sunucu/api.md](../../../sunucu/api.md), oturum anahtarı [../../../sunucu/guvenlik.md](../../../sunucu/guvenlik.md)
  (`istekAnahtari`), uçların kendileri `sunucu/bolumler/*.md`.
- Onu kullananlar: `esc` 48, `api` 45, `$` 42 parça ve yönetim parçalarının çoğu (`api` 5, `esc` 4, `$` 3); `EYLEMLER`'e
  kayıt yapan 34 parça, okuyan `25-tiklama.js` (`islem`). Bu gruptan `$` kullananlar [03-mesaj-modal.md](03-mesaj-modal.md),
  [04-pwa.md](04-pwa.md), [04a-form-alanlari.md](04a-form-alanlari.md), [04b-bildirim-izni.md](04b-bildirim-izni.md),
  [04d-ekler.md](04d-ekler.md), [04e-tarih-secici.md](04e-tarih-secici.md); `esc` kullananlar [02-ikonlar.md](02-ikonlar.md),
  03, 04a, 04d, 04e; `api` kullananlar 04b, 04d, 04e.
- CSS: yok (ekrana doğrudan bir şey çizmez).
- Rol: herkes (giriş ekranındaki ziyaretçi de: giriş/kayıt formları `api` ve `$` kullanır).

## Nasıl çalışır (adım adım)?

### Bir istek

```
ekran:  api('/assignments', 'POST', { title: … })
  │  Authorization: Bearer <S.token>, Content-Type: application/json
  ▼
fetch('/api/assignments') ──► sunucu/api.js handleApi ──► kapılar ──► bölüm
  ▼
cevap metni → JSON (bozuksa {})
  ├─ 2xx ─────────────────────────────► resolve(JSON)
  ├─ 401 ve oturum açık ───► cikisYap(true) ─┐
  ├─ 403 sifreDegismeli ───► "Kendi şifreni belirle" penceresi ─┤
  └─ her hata ──────────────────────────────┴► throw Error(error) { durum, veri }
ekran:  .catch(function (e) { mesajGoster('…Mesaj', 'hata', e.message); })
```

### Bir düğme

```
<button data-act="ek-indir" data-id="…">   ── tıklama ──► 25-tiklama.js islem(act, el)
                                                  EYLEMLER['ek-indir'] var mı? ── evet ─► EYLEMLER['ek-indir'](el, id)
                                                                              └ hayır ─► if (act === …) zinciri
```

## Dikkat!

- **`esc`'siz `innerHTML` yazma.** Kural: kullanıcıdan ya da sunucudan gelen her metin `esc`'ten geçer. Sabit metin ve
  kendi ürettiğin HTML (ör. `ik()` çıktısı) geçmez, yoksa etiketler yazı olarak görünür. `esc` tek tırnaklı öznitelik
  değeri için de yeterli (`'` → `&#39;`), ama `href="…"` gibi adres alanlarına kullanıcı adresi koyacaksan ayrıca
  `javascript:` gibi şemaları süzmen gerekir; `esc` bunu yapmaz.
- **Ağ hatası Türkçe değildir.** Bağlantı hiç kurulamazsa `fetch` tarayıcının kendi iletisiyle reddeder (Chrome/Edge'de
  "Failed to fetch"); `api` bunu yakalayıp çevirmediği için ekranlar `e.message`'ı olduğu gibi gösterir ve kişi İngilizce
  bir ileti görür. Kod değiştirilmedi; ileride `api` içinde tek yerden "Sunucuya ulaşılamadı" gibi bir iletiye
  çevrilebilir.
- **`kvkkGerek` özel ele alınmaz.** `sifreDegismeli` 403'ü pencere açar, ama oturum açıkken aydınlatma metni sürümü
  yükselirse gelen 403 `kvkkGerek` yalnız sunucunun iletisiyle ("Aydınlatma metni güncellendi…") hata olarak düşer;
  onay penceresi girişte ya da sayfa yenilenince (`girisSonrasi` → `kvkkOnayIste`) açılır.
- **401 sessiz çıkış yapar ama yine de hata fırlatır.** Çağıranın `catch`'i çalışır; ekran bu arada giriş ekranına dönmüş
  olabilir, iletinin yazılacağı kutu artık olmayabilir (`mesajGoster` kutu yoksa sessizce vazgeçer).
- **`sayiOku` binlik ayracı bilmez:** `"1.250"` 1,25 okunur, `"1.234,5"` `NaN` olur. Bugün yalnız sınav ölçümünde
  kullanılıyor (küçük sayılar); para ya da büyük sayı alanına koyacaksan önce noktaları sil.
- **İki ayrı boyut yazıcısı var:** `boyutYaz` (bu dosya; `B`/`KB`/`MB`, KB tam sayı) ve `boyutYazi`
  ([04d-ekler.md](04d-ekler.md); en az `1 KB`, `sayiTR` ile). Ekranlar arasında küçük farklar bundandır.
- **`tercihOku` metin döner.** `tercihYaz('x', true)` sonra `tercihOku('x')` → `"true"` (metin). Karşılaştırmayı metinle
  yap. Bazı parçalar `localStorage`'a doğrudan da yazar (`ee_token`, `ee_program_gorunum`, `ee_kuruldu`, `ee_menu` …); onlar
  bu işlevlerden geçmez.
- **`EYLEMLER` adları tek olmalı.** İki parça aynı adı kaydederse ad sırasında sonraki kazanır, uyarı çıkmaz.
  `testler/buton-denetimi.js` her `data-act`'ın bir karşılığı olduğunu denetler ama çift kaydı yakalamaz. Bu "sonraki
  kazanır" kuralı bugün bilerek de kullanılıyor (sarma): `14b-odev-teslim.js` `odev-oku`'yu, `14c-quiz.js` hem `odev-oku`'yu
  hem `veli-teslim`'i önceki kaydı bir değişkende saklayıp (`var odevOkuIlk = EYLEMLER['odev-oku']` gibi) kendi işlevleriyle
  sarıyor. Böyle bir sarmayı bozmamak için bu adları yeni bir kayıtla ezmeden önce o parçalara bak.

## Testleri

- `testler/buton-denetimi.js` (sunucusuz, `tumtest.sh` sonunda) — her `data-act`'ın `EYLEMLER`'de ya da `islem()`'de
  karşılığı var mı; hiç düğmesi olmayan eylem (ölü kod) var mı.
- `testler/test-kucult.js` (sunucusuz) — birleşik paket yorumsuz hâliyle derleniyor mu.
- `testler/guvenlik-test.js` — parça dosyalarının kendisi web'den okunamıyor: `/js/./parcalar/01-yardimcilar.js` ve
  `/js/x/../parcalar/01-yardimcilar.js` 404; birleşik `/js/app.js` 200.
- `testler/test-resim-kucult.js` — bu dosyayı başsız tarayıcıda öteki parçalarla yükleyip ek alanını çalıştırır
  (`sayiTR`, `esc`, `api` dolaylı olarak).
- `testler/yazim-denetimi.js` — iletilerdeki Türkçe yazım.
- Elle: girişliyken başka bir sekmeden aynı hesaptan çık (oturum silinsin), ilk sekmede bir düğmeye bas → giriş ekranına
  dönmeli. Okul yönetimi girişli bir öğrencinin şifresini sıfırlasın → öğrencinin sonraki isteğinde "Kendi şifreni
  belirle" penceresi açılmalı.

## Son durum

- `git log`: 3 commit. Son değişiklik `276c0a0 commit 521` (2026-09-27, gizli /admin ve site ayarları): `boyutYaz(n)`
  eklendi (yönetim ekranı yedek boyutlarını yazıyordu; teslim ekranı da kullanıyor). Ondan önce `1d576e0 commit 15`
  (2026-08-28): `api()` bu dosyaya geldi — 401'de sessiz çıkış, 403 `sifreDegismeli`'de şifre penceresi, hatada `durum`
  ve `veri` alanları. İlk hâl `a780f62 commit 4` (2026-08-28).
- Bilinen açıklar (kod değiştirilmedi): ağ hatasının İngilizce iletisi, `sayiOku`'nun binlik ayracı, dosya başı yorumunda
  artık burada olmayan "tarih/gün adları".
- Planlı işlerden bu dosyaya dokunması beklenenler: "Sistem" işindeki bakım modu (API 503 `{ bakim: true }` dönecek; tanım
  ön yüzün yarım yazılanı kaybettirmeden şerit gösterip yeniden denemesini istiyor — doğal yeri `api()`) ve tarayıcı hata
  günlüğü (yakalanmamış hatalar sunucuya); "Çok dil" (`c()` çeviri işlevi ve katalog; bu dosyadaki `Bir hata oluştu`
  gibi metinler de oradan geçecek); "Güvenlik denetimi" (okulun verdiği her şifrede ilk girişte değiştirme —
  `sifreDegismeli` yolunu daha sık çalıştıracak).
