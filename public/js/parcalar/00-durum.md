# public/js/parcalar/00-durum.js

Ön yüzün ortak hafızası: bütün parçaların okuyup yazdığı `S` durum nesnesi ve sistem yöneticisinin ekranlarının takıldığı
`YONETIM` kancası.

## Bu dosya ne yapar?

Eğitim Evi'nin ön yüzü çerçevesiz (React, Vue yok) ve derleyicisiz yazıldı. `public/js/parcalar/` altındaki 57 parça,
sunucu tarafından ad sırasıyla uç uca eklenip tek bir `(function () { 'use strict'; ... })();` içine konur ve tarayıcıya
`/js/app.js` olarak gider (ayrıntı: [../../../sunucu/http.md](../../../sunucu/http.md), `birlesikOku`). Hepsi aynı işlevin
içinde olduğu için bir parçada `var` ile tanımlanan her ad öteki bütün parçalarda doğrudan görünür.

Bu dosya `00-` ile başladığı için paketin EN BAŞINA oturur. Görevi iki ortak değişkeni herkesten önce kurmak:

- `S` — uygulamanın o anki hâli: kim giriş yaptı, anahtarı ne, hangi sayfa açık, hangi öğrenciye bakılıyor, ödev
  süzgeçleri, ders programı ekranının seçimleri… Sayfa çizen her işlev bilgiyi buradan okur, kullanıcının seçimini buraya
  yazar.
- `YONETIM` — sistem yöneticisinin ekranları için boş bir kanca. Herkese giden `app.js`'te hep `null` kalır; yalnız yönetim
  adresinden, yönetici çereziyle yüklenen `/admin/yonetim.js` paketinde `public/js/yonetim/09a-yonetim-paneli.js` onu
  doldurur.

Kod yok denecek kadar az (31 satır, hiç işlev yok) ama uygulamanın en çok kullanılan adı burada: `S`'ye 46 parça ve 2
yönetim parçası dokunuyor.

## İçinde neler var?

### `S` — başlangıç alanları

| Alan | Başlangıç | Ne tutar | Başlıca yazan / okuyan |
|---|---|---|---|
| `token` | `null` | Oturum anahtarı. `api()` ve dosya indirme/yükleme istekleri `Authorization: Bearer …` başlığına koyar | yazan: `05-giris.js` (giriş), `26-baslat.js` (açılışta saklanan anahtar), `08c-kisilikler.js` (portal değişimi `oturumuDegistir`); silen: `cikisYap` |
| `user` | `null` | `/api/me` ya da giriş cevabındaki kullanıcı (`id`, `fullName`, `role`, `status`, `yetiskin`, `rolSatiri`, `anaHesapId`, `tema`, `sifreDegismeli`…) | 31 parça ve `09a-yonetim-paneli.js`; menü ve sayfalar `S.user.role`'e göre dallanır. [01-yardimcilar.md](01-yardimcilar.md)'deki `api()` 403 `sifreDegismeli` gelince `S.user.sifreDegismeli = true` yapar |
| `children` | `[]` | Velinin çocukları (`/api/me` → `children`) | `26-baslat.js`, `06-menu.js`, `27-veli-panel.js`, `23-veli-ayarlar.js` … |
| `meta` | `{ cities: [], subjects: [] }` | İl listesi ve branşlar; `uygulamayiBaslat` boşsa bir kez `GET /api/meta`'dan doldurur ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)) | `05-giris.js`, `08b-rolsuz.js`, `10b-hesaplar.js`, `12-ogretmen-sinav.js`, `23-veli-ayarlar.js` |
| `page` | `'ana'` | Açık sayfanın adı (`SAYFALAR` tablosundaki anahtar) | yazan `07-yonlendirme.js` (`git`); okuyan menü, yenile düğmesi, geri tuşu (`25-tiklama.js`) |
| `viewStudentId`, `viewStudentName` | `null`, `''` | Veli ya da okul yönetimi bir öğrencinin ekranına bakarken o öğrenci (null = kendi ekranı) | `10-mudur.js`, `13-ogrenci-veli.js`, `14-odev-filtre.js`, `18-devamsizlik.js`, `22-programim.js`, `28-grafik.js` … |
| `veliCocuk` | `null` | Veli panelinde şeritten seçilen çocuk (null = hepsi) | `27-veli-panel.js`, `27b-aile.js`, `08c-kisilikler.js` |
| `portallar`, `hesapAktif`, `portalDisi` | `null`, `false`, `false` | Yetişkin hesabı: sol menüdeki "Portallarım" satırları (öteki hesaplarda null), oturum yetişkin hesabının kendisinde mi, portal dışında mı | `08c-kisilikler.js`, `26-baslat.js`, `23-veli-ayarlar.js`, `24-bildirim-arama-mobil.js` |
| `unread` | `0` | Okunmamış bildirim sayısı | `24-bildirim-arama-mobil.js` |
| `bildirimAralikDk` | `5` | Bildirimlerin kaç dakikada bir yoklanacağı; sitenin ayarı giriş, `/me` ve `/site` cevabıyla gelir (`bildirimAraligiAl`, en çok 30) | `24-bildirim-arama-mobil.js` |
| `odevF` | `{ ders:'', yildiz:'', durum:'', bas:'', bit:'', mod:'ogrenci' }` | Ödev listesinin süzgeçleri | `14-odev-filtre.js`, `11-ogretmen-odev.js`, `07-yonlendirme.js` |
| `odevHam` | `[]` | Sunucudan gelen süzülmemiş ödev listesi; süzgeçler bunun üstünde tarayıcıda uygulanır (`odevFiltrele`) | `14-odev-filtre.js`, `11-ogretmen-odev.js`, `14c-quiz.js` |
| `araHook` | `null` | Sayfaya özel arama kancası: üstteki arama kutusu yazılınca `araUygula` önce buna bakar | yazan `11-ogretmen-odev.js`, `14-odev-filtre.js` (`odevSonucCiz`); sayfa değişince `git` null yapar |
| `programSinif`, `programSiniflar`, `programVeri`, `programUyari`, `programGun`, `programGorunum`, `cakismaAcik` | `''`, `[]`, `null`, `''`, `0`, `'gun'`, `false` | Ders programı ekranının seçimleri; `programGorunum` açılışta `localStorage`'daki `ee_program_gorunum`'dan (`gun`/`hafta`) okunur | `21-ders-programi.js`, `25-tiklama.js` |
| `sinifBilgi`, `dersBilgi` | `null` | Sınıflar ekranında açılan sınıfın ve derslerinin son cevabı | `20-siniflar.js`, `25-tiklama.js` |
| `bekleyenKayit` | `null` | Hiçbir parça kullanmıyor (bkz. Dikkat) | — |
| `odevHedef`, `odevSinif` | `null`, `''` | "Yeni ödev" penceresinin hedef listesi (`/api/assignments/hedefler` cevabı: sınıflar, öğrenciler, dersler) ve öğretmenin ödev ekranında seçili sınıf süzgeci | `11-ogretmen-odev.js` |

### `S` — sonradan eklenen alanlar

Başlangıçta yazılı olmayan 67 alan daha var; parçalar ihtiyaç duyunca ekler. Örnekler: `S.kapali` (okulda kapalı
bölümler, `/me` → `kapaliOzellikler`), `S.acilis` (girişten sonra açılacak sayfa), `S.yilBilgi` (eğitim yılı şeridi),
`S._sefer` (servisçinin süren seferi), `S._sayfaDegisti` (sayfada yazılmış ama kaydedilmemiş metin var mı),
`S._bildirimler`, `S._bildirimSayac`. Alt çizgiyle başlayanlar çoğunlukla geçici iç işaretler ve ekran önbellekleridir.

### `YONETIM`

`null`. Yönetim paketinde `09a-yonetim-paneli.js` şunu yazar:

- `menu()` — yöneticinin sol menüsü (Ana Sayfa, Müdürler, Okullar, Yorumlar, Hatırlatıcılar, Site Ayarları, Yönetici
  Dosyası, Yedekleme, İşlem Kaydı);
- `anaSayfa(ad)` — `/api/admin/overview` ile yöneticinin ana sayfası;
- `disariMi()` — yönetim adresinde yönetici OLMAYAN bir hesap açıldıysa (aynı tarayıcının başka sekmesinden gelen
  anahtar) `location.replace('/')` ile siteye döner ve `true` verir.

## Kimle konuşur?

- Çağırdıkları: hiçbir şey. Dosya yalnız iki değişken tanımlar; ne işlev çağırır ne istek atar.
- Onu kullananlar:
  - `S` — 46 parça: bu gruptan [01-yardimcilar.md](01-yardimcilar.md) (`api` → `token`, `user`),
    [03-mesaj-modal.md](03-mesaj-modal.md) (`dosyaIndir` → `token`), [04b-bildirim-izni.md](04b-bildirim-izni.md) (`token`),
    [04d-ekler.md](04d-ekler.md) (yükleme isteğinin başlığı); en yoğun kullananlar `25-tiklama.js`, `26-baslat.js`,
    `14c-quiz.js`, `19c-okul-hayati.js`, `11-ogretmen-odev.js`, `08c-kisilikler.js`, `18-devamsizlik.js`,
    `12-ogretmen-sinav.js`. Yönetim parçalarından `09a-yonetim-paneli.js` ve `09b-site-ayarlari.js`.
  - `YONETIM` — `06-menu.js` (yöneticinin menüsü: `YONETIM ? YONETIM.menu() : [Ana Sayfa]`), `08-ana-sayfa.js`
    (yöneticinin ana sayfası), `05b-sifre-zorunlu.js` (`girisSonrasi`: `YONETIM.disariMi()`), `26-baslat.js` (`cikisYap`:
    yönetim adresinden çıkışta `/login`'e tam sayfa geçiş), dolduran `public/js/yonetim/09a-yonetim-paneli.js`.
- Sunucu: dosyanın kendisi yok; birleştirme [../../../sunucu/http.md](../../../sunucu/http.md)'de (`BIRLESIK`,
  `YONETIM_JS`), yönetim paketinin kapısı [../../../sunucu/yonetim-cerezi.md](../../../sunucu/yonetim-cerezi.md).
- CSS: yok (ekrana bir şey çizmez).
- Rol: herkes; `YONETIM` yalnız yöneticinin tarayıcısında dolar.

## Nasıl çalışır (adım adım)?

### Paketteki yeri

```
/js/app.js            = (function () { 'use strict';
                           00-durum.js        ← S, YONETIM burada doğar
                           01-yardimcilar.js  ← $, esc, api, EYLEMLER …
                           …
                           26-baslat.js       ← açılış kodu burada çalışır
                           27-veli-panel.js, 27b-aile.js, 28-grafik.js   ← 26'dan SONRA eklenir
                         })();
/admin/yonetim.js     = aynı sıra, araya public/js/yonetim/09-… parçaları girer
                        (09a-yonetim-paneli.js: YONETIM = { menu, anaSayfa, disariMi })
```

Parçaların çoğu yüklenirken yalnız tanım yapar (`function`, `var`, `SAYFALAR[...] =`, `EYLEMLER[...] =`). Birkaçı
yüklenir yüklenmez belgeye olay dinleyicisi ya da gözlemci de kurar: bu gruptan [04c-telefon.md](04c-telefon.md) (telefon
kutularını hemen dönüştürür) ve [04e-tarih-secici.md](04e-tarih-secici.md) (klavye, üzerine gelme, dışarı tıklama);
ötekilerden `05-giris.js`, `11-ogretmen-odev.js`, `12-ogretmen-sinav.js`, `14b-odev-teslim.js`, `14c-quiz.js`,
`24-bildirim-arama-mobil.js`, `28-grafik.js`. İşin kendisini `26-baslat.js`'in sonundaki açılış kodu başlatır. O anda `S`,
`YONETIM` ve bütün `function` tanımları hazırdır (işlev tanımları IIFE'nin başına "kaldırılır"). Ama `27-veli-panel.js`,
`27b-aile.js` ve `28-grafik.js`'in `SAYFALAR`/`EYLEMLER` satırları o an henüz çalışmamıştır; açılışın asıl işi
(`GET /api/me` ve ilk sayfa) eşzamansız olduğu için, cevap geldiğinde paketin tamamı çalışmış olur. `26-baslat.js`'in eşzamanlı
kısmına bu üç parçanın kaydına dayanan bir şey eklersen bunu hesaba kat.

### Bir oturumun `S` üzerindeki izi

1. Açılış (`26-baslat.js`): saklı anahtar varsa `S.token`'a yazılır → `GET /api/me` → `S.user`, `S.children`,
   `S.kapali`, portallar (`portalDurumuAl`).
2. Uygulama: sayfalar `S.page`'i, süzgeçleri, seçili öğrenciyi okuyup yazar. `S` değişince ekran KENDİLİĞİNDEN yenilenmez;
   değiştiren kod ilgili çizim işlevini ya da `git(sayfa)`'yı kendisi çağırır.
3. Portal değişimi (`08c-kisilikler.js` `oturumuDegistir`): yeni `token`, `oturumDurumunuSifirla()`, yeni `user`.
4. Çıkış (`26-baslat.js` `cikisYap`): `token`, `user`, `children`, `veliCocuk`, `kapali`, portallar sıfırlanır,
   `oturumDurumunuSifirla()` kişiye bağlı ekran durumunu siler. Sayfa YENİDEN YÜKLENMEZ (yönetim adresi hariç); aynı `S`
   nesnesi sonraki girişte de kullanılır.

## Dikkat!

- **`S` pencereye açık değildir.** Paket tek işlevin içinde olduğu için tarayıcı konsolunda `S` ya da `window.S` yazınca
  bir şey çıkmaz. Bu bilinçli: uygulama durumu ve oturum anahtarı sayfadaki başka betiklerin eline kolayca geçmesin.
  Hata ayıklarken konsola yazdırmak için geçici `console.log` gerekir.
- **Kişiye bağlı yeni bir alan eklersen `oturumDurumunuSifirla`'ya da ekle** (`26-baslat.js`). Çıkışta sayfa yenilenmediği
  için silinmeyen alan aynı sekmede giren sonraki kişiye kalır. Bugün sıfırlanmayan başlangıç alanları: `page`,
  `viewStudentName`, `unread`, `meta`, `bildirimAralikDk`, `programSiniflar`, `programUyari`, `programGun`,
  `programGorunum`, `cakismaAcik`, `sinifBilgi`, `dersBilgi`, `odevHedef`, `odevSinif` (`araHook`'u `git` siler).
  Çoğu sayfa açılınca yeniden doldurulur ya da yalnız tercih bilgisidir; ama `odevSinif` (ödev ekranında seçili sınıf)
  sonraki hesabın ilk ödev isteğine `?classId=` olarak gider. Sunucu yetkiyi kendisi denetlediği için bu bir veri
  sızıntısı değil; ekranda boş ya da tuhaf bir ilk süzgeç çıkabilir (denenmedi).
- **`bekleyenKayit` ölü alan:** ne ön yüzde ne yönetim parçalarında kullanılıyor. Kod değiştirilmedi; bir sonraki ön yüz
  işinde silinebilir.
- **`YONETIM` yalnız bir kancadır, güvenlik değildir.** Yönetici ekranlarının kodu ve uç adları herkese giden `app.js`'e
  hiç girmez (`test-admin-gizli.js` denetler); asıl yetki sunucuda. `YONETIM`'in dolu olması "bu sayfa yönetim paketidir"
  demektir; `cikisYap` buna bakıp yönetim dosyası bellekte kalmasın diye tam sayfa `/login`'e geçer.
- Başlangıç değerleri ilk çizimde anlamlı olmalı: ör. `meta.cities` boş dizi olduğu için `/api/meta` gelmeden açılan bir
  form hata vermez, yalnız boş liste gösterir.

## Testleri

- `testler/test-kucult.js` (sunucusuz) — parçaları sunucunun yaptığı gibi ad sırasıyla tek IIFE'ye birleştirir, yorumsuz
  hâliyle derlendiğini denetler; bu dosyanın başta durmasına dayanan her şey burada kırılırsa görünür.
- `testler/test-admin-gizli.js` — herkese giden `/js/app.js`'in yönetim kodu ve uç listesi taşımadığını, yönetim
  paketinin yalnız yönetici çereziyle geldiğini dener (`YONETIM` kancasının dolduğu tek yer oraya gider).
- `testler/test-resim-kucult.js` — bu dosyayı `01-yardimcilar`, `02-ikonlar`, `03-mesaj-modal`, `04d-ekler`,
  `04f-resim-kucult`, `14b-odev-teslim`, `19g-okul-sayfasi` parçalarıyla başsız tarayıcıya yükler (her biri ayrı betik
  olarak, genel alanda); `S.token` yazıp ek yüklemesini dener.
- `testler/buton-denetimi.js` — parçaları aynı sırayla birleştirip düğmeleri denetler.
- Elle: giriş yap, sayfalar arasında gez, çıkış yapıp aynı sekmede başka bir hesapla gir; önceki kişinin seçimleri
  (açık öğrenci, ödev süzgeçleri, ders programı sınıfı) görünmemeli.

## Son durum

- `git log`: 3 commit. Son değişiklik `276c0a0 commit 521` (2026-09-27, gizli /admin ve site ayarları): `S`'ye
  `bildirimAralikDk: 5` eklendi (bildirim yoklama aralığı artık sitenin ayarından geliyor) ve `YONETIM = null` kancası
  kondu — yönetici ekranları o committe `public/js/yonetim/` klasörüne taşındı. Ondan önce `0acca75 commit 516`
  (2026-09-27, kayıt/kişi kodu/portallar): yetişkin hesabı için `portallar`, `hesapAktif`, `portalDisi` alanları eklendi.
  Dosyanın ilk hâli `a780f62 commit 4` (2026-08-28).
- Açık iş: `bekleyenKayit` ölü alanı (yukarıda). Kod değiştirilmedi.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Tek kişi tek hesap + portallar öğrencide de" (`portallar` bugün
  yalnız yetişkin hesabında dolu, öğrencide de dolacak); "Paneller /panel/admin ve /panel/destek" (destek ekibi aynı
  paneli kullanacağı için `YONETIM` kancası ve onu okuyan yerler yalnız `admin` rolüne bakmaktan çıkacak); "Çok dil"
  (seçili dilin ön yüzde nerede tutulacağı henüz belirlenmedi).
