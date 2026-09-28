# sunucu/api.js

`/api/...` isteklerinin yönlendiricisi: kişiyi tanır, gövdeyi okur, ortak kapılardan geçirir, yolun ilk parçasına göre
isteği ilgili bölüme (`sunucu/bolumler/`) verir.

## Bu dosya ne yapar?

Tarayıcıdan ya da telefon uygulamasından gelen her `/api/...` isteği `sunucu/index.js`'ten buraya düşer. Bu dosya
işin kendisini yapmaz (ödev açmak, mesaj göndermek bölümlerin işi); bütün uçlarda aynı olması gereken kuralları TEK
yerde uygular:

- kim olduğunu bulur (`currentUser`),
- aydınlatma metni onayı güncel değilse, şifresini değiştirmesi gerekiyorsa ya da hesabı bir okula bağlı değilse
  yalnız izinli uçlara geçirir,
- müdürün kapattığı bölüme (ödev, sınav…) isteği sokmaz,
- geçmiş eğitim yılına bakan personelin kayıt yazmasını engeller,
- yönetici uçlarını yönetici olmayana "böyle bir adres yok" gibi gösterir,
- sonra `BOLUM` tablosundan doğru bölümü seçip `uclar(k)`'ı çağırır.

Bölümler bu kapıları ayrıca yazmak zorunda kalmaz; bir kapıyı gevşetmek ya da sıkılaştırmak için tek yere bakarsın.

## İçinde neler var?

- `handleApi(req, res, segs, method)` — asıl işlev (dışa açık). `segs`, adresin `/` ile bölünmüş parçaları
  (`['api', 'school', 'students']`); `p = segs[1]` bölüm anahtarı. Cevabı kendisi ya da bölüm yazar; hiçbir bölüm
  cevap yazmazsa `404 {"error":"Böyle bir adres yok"}`.
- `yoneticiUcuMu(p, segs)` — dışa açık: `/api/admin/...` ve `/api/yorumlar/hepsi|gizle` yöneticiye özel mi.
- `BOLUM` — yolun ilk parçası → bölüm modülü tablosu (ör. `'assignments' → bolumler/odev`, `'school' → okul`,
  `'site'` ve `'uygulama' → sunucu/site.js`, `'admin' → bolumler/yonetici`). Bir yol yalnız bir bölüme gider.
- `KVKK_SERBEST` — aydınlatma onayı beklenirken de açık uçlar: `me`, `kvkk-onay`, `logout`, `meta`, `challenge`,
  `okullar`, `schools`, `login`, `register`, `sifre-unuttum`, `sifre-yenile`, `okul-adres`, `okul-foto`, `site`,
  `uygulama`, `eposta-onay`, `yorumlar`.
- `SIFRE_SERBEST` — `KVKK_SERBEST` + `password`: şifresini okul ya da yönetici belirlemiş kişi kendi şifresini
  koyana kadar yalnız bunları kullanır.
- `ROLSUZ_SERBEST` — `KVKK_SERBEST` + `profile`, `password`, `notifications`, `parent`, `push`, `kisilikler`,
  `kisilik`, `hesap`, `yorumlar`, `hatirlaticilar`, `cihaz`: rolü olmayan (henüz okula bağlanmamış) yetişkin
  hesabının girebildikleri.
- `arsivYazmasiMi(p, segs, body)` (iç) — yıla bağlı kayıt yazan istek mi: ödev (`assignments`), sınav grubu,
  sınav (şablonlar hariç), yoklama ve işaretleme, takvim etkinliği, ders programı ekleme/güncelleme/silme ve
  programın Excel'den içe aktarımı.
- `need(roles)` (her isteğe kurulan iç işlev, bölümlere verilir) — giriş yoksa 401 "Giriş yapmalısın", hesap onaylı
  değilse 403, rol listede yoksa 403 "Bu işlem için yetkin yok"; geçerse `true`.

Bölüme giden bağlam nesnesi `k`: `{ req, res, me, body, q, p, segs, method, need }` (`q` = `URLSearchParams`).

## Kimle konuşur?

- Çağırdıkları:
  - `./guvenlik` → `currentUser` (Authorization başlığındaki oturum);
  - `./http` → `bad`, `readBody` (2 MB, 30 sn), `sendJSON`;
  - `./site` → `goruldu` (açılış sayfasındaki "şu an açık" sayısı), ayrıca `site` ve `uygulama` uçlarının bölümü;
  - `./veri` → `depo.ozellikler.kapaliMi` (yükleme uçlarında);
  - `BOLUM` tablosundaki 26 bölüm (her birinin belgesi `bolumler/` altında): [anket](bolumler/anket.md),
    [devamsizlik](bolumler/devamsizlik.md), [egitim-yili](bolumler/egitim-yili.md), [ekler](bolumler/ekler.md),
    [etut](bolumler/etut.md), [ilerleyis](bolumler/ilerleyis.md), [islem-kaydi](bolumler/islem-kaydi.md),
    [kayit](bolumler/kayit.md), [kisilik](bolumler/kisilik.md), [mesaj](bolumler/mesaj.md), [odev](bolumler/odev.md),
    [odev-dosya](bolumler/odev-dosya.md), [okul-hayati](bolumler/okul-hayati.md),
    [okul-sayfasi](bolumler/okul-sayfasi.md), [push](bolumler/push.md), [ogretmen](bolumler/ogretmen.md),
    [okul](bolumler/okul.md), [sinav](bolumler/sinav.md), [takvim](bolumler/takvim.md), [yorum](bolumler/yorum.md),
    [ozellikler](bolumler/ozellikler.md), [hatirlatici](bolumler/hatirlatici.md), [aile](bolumler/aile.md),
    [cihaz](bolumler/cihaz.md), [veli](bolumler/veli.md), [yonetici](bolumler/yonetici.md). Bölümlerden özel olarak:
    `kayit.kvkkGuncelMi`, `ozellikler.kapaliysaReddet`, `egitim_yili.arsivdeMi`, `odev_dosya.uclar`, `ekler.yukle`,
    `okul_sayfasi.fotoYukle`, `aile.cihazUclari`, `cihaz.anahtarUclari`.
  - Klasördeki öteki 7 bölüm buradan değil, başka bölümlerden çağrılır: [hesaplar](bolumler/hesaplar.md) ve
    [kisi-aktarim](bolumler/kisi-aktarim.md) `okul.js`'ten, [nakil](bolumler/nakil.md) `hesaplar.js`'ten,
    [quiz](bolumler/quiz.md) `odev.js`'ten (ayrıca `okul.js`, `ilerleyis.js` ve `index.js` yardımcılarını kullanır),
    [yonetici-okul](bolumler/yonetici-okul.md) ve [site-ayarlari](bolumler/site-ayarlari.md) `yonetici.js`'ten,
    [okul-disk](bolumler/okul-disk.md) yükleme yapan bölümlerden (`ekler`, `odev-dosya`, `okul-sayfasi`), `okul.js`'ten,
    üç yönetici bölümünden ve `index.js`'ten.
- Onu çağıran: yalnız `sunucu/index.js` (`handleApi`). `yoneticiUcuMu` bugün dışarıdan çağrılmıyor (grep), dışa açık
  duruyor.
- Doğrudan tabloya dokunmaz; `ozellikler` üzerinden okulun kapalı bölümlerine bakar.

## Nasıl çalışır (adım adım)?

```
handleApi
 1. me = currentUser(req); me varsa site.goruldu(anaHesap)
 2. gizli = yönetici ucu && yönetici değil  →  kp = '' (kapılara "boş ad" görünür)
 3. DOSYA YÜKLEMELERİ (gövde JSON değil, akış):
      POST /api/odev-dosya/yukle   (okulda ödev kapalıysa 403 ozellikKapali)
      POST /api/ek/yukle           (tur=odev ve ödev kapalıysa 403)
      POST /api/okul-sayfa/foto
 4. body = POST ise readBody (JSON), değilse {}
 5. CİHAZ ANAHTARLI UÇLAR (oturum kapılarından geçmez):
      /api/aile/cihaz/...           → aile.cihazUclari  (X-Aile-Cihaz)
      /api/cihaz/<x> (sil hariç ya da X-Cihaz başlıklı sil) → cihaz.anahtarUclari
 6. KAPILAR (sırayla):
      aydınlatma onayı eski ve kp KVKK_SERBEST'te değil → 403 kvkkGerek
      sifreDegismeli ve kp SIFRE_SERBEST'te değil     → 403 sifreDegismeli
      rolsüz, kp var olan bir bölüm ve ROLSUZ_SERBEST'te değil → 403 rolsuz
      okulda bölüm kapalı                              → ozellikler.kapaliysaReddet cevaplar
      öğretmen/müdür + POST + arşiv yazması + geçmiş yıl → 409 arsiv
 7. bolum = gizli ? null : BOLUM[p] → bolum.uclar(k)
 8. cevap yazılmadıysa → 404 "Böyle bir adres yok"
```

## Dikkat!

- **Yönetici uçları gizli.** Yönetici olmayana (girişsiz tarayıcı, öğrenci, öğretmen, müdür, veli, servisçi, rolsüz
  yetişkin) `/api/admin/...` bilinmeyen bir API adresiyle AYNI cevabı verir: aynı kapılardan boş adla (`kp = ''`)
  geçer ve sonunda aynı 404'ü alır. 401/403 dönmez; dışarıdan bakan yönetici uçlarının var olduğunu anlayamasın. Bu
  denetim YALNIZ burada; yeni bir yönetici ucu `/api/admin/` altında değilse `yoneticiUcuMu`'ya eklemelisin.
- Kapılar `kp` ile bakar, `p` ile değil: yoksa yönetici ucu için kapı "rolsüz" ya da "kvkk" cevabı verip ucun var
  olduğunu ele verirdi. Şifresini değiştirmesi gereken kişi ise hem yönetici ucunda hem bilinmeyen adreste aynı 403'ü
  alır (test bunu bilerek kabul eder).
- Rolsüz kapısı yalnız VAR OLAN bölümleri kapatır (`BOLUM[kp]`); olmayan ya da kaldırılmış yol (ör. eski
  `okul-basvurusu`) rolsüz kişiye de 404'tür.
- Dosya yüklemeleri `readBody`'den ÖNCE ayrılır: 2 MB JSON sınırına takılmasınlar, diske akarak yazılsınlar. Bu uçlar
  kvkk/şifre durumunu bağlamda (`kvkkGuncel`, `sifreTamam`) alır ve kendileri denetler — yeni bir yükleme ucu
  eklersen aynısını yapmalısın.
- Cihaz uçları oturum kapılarından geçmez; hesabın onayı ve aydınlatma metni uçta (`bolumler/aile.js`,
  `bolumler/cihaz.js`) denetlenir.
- Arşiv kapısı neden var: geçmiş yıla bakarken açılan kayıt eski yıla damgalanıp aktif yılda kaybolurdu. Sınıflar,
  öğrenciler ve sınav şablonları yıllar arası ortak olduğu için kapıya takılmaz.
- Bölümün cevabı yazıp yazmadığı `res.writableEnded || res.headersSent` ile anlaşılır; bölüm `uclar` içinde yolu
  tanımıyorsa hiçbir şey yazmadan dönmeli, 404'ü burası verir.

## Testleri

- `testler/yetki-denetimi.js` — her uç × her rol; yönetici uçlarının yönetici olmayana bilinmeyen adresle aynı 404
  verdiği.
- `testler/test-admin-gizli.js` bölüm 9 — yönetici uçları girişsiz, öğrenci, öğretmen, müdür ve rolsüz yetişkine
  bilinmeyen adresle aynı cevap; rolsüz kişinin okul ucu 403 `rolsuz`.
- `testler/test-yetiskin.js`, `test-kisi-kodu.js` — rolsüz yetişkinin girebildiği/giremediği yollar.
- `testler/test-egitim-yili.js` — arşiv yılında yazma 409.
- `testler/test-ozellikler.js` — kapalı bölüm.
- `testler/girdi-denetimi.js` — bozuk gövdeyle 500 çıkmaması (400'e çevrilir, `index.js`).
- Elle: sunucu açıkken `curl -i http://localhost:3200/api/admin/overview` ile
  `curl -i http://localhost:3200/api/olmayan` aynı 404'ü vermeli.

## Son durum

- Son commit `276c0a0 commit 521` (2026-09-27): gizli yönetim paneli işi. `yoneticiUcuMu` ve `yoneticiMi` eklendi;
  kapılar `p` yerine `kp` ile bakmaya başladı; yönetici olmayana `bolum = null` (yani 404); `yoneticiUcuMu` dışa açıldı.
- Ondan önce `24050a2 commit 518` (servis yoklaması: `cihaz` bölümü, `ROLSUZ_SERBEST`'e `cihaz`, oturumsuz
  `/api/cihaz` anahtar uçları) ve `0acca75 commit 516` (kişi kodu, portallar: eski `okul-basvurusu` yolu hem
  `BOLUM`'dan hem `ROLSUZ_SERBEST`'ten çıktı; rolsüz kapısı yalnız var olan bölümleri kapatır oldu — `BOLUM[p] &&`,
  böylece olmayan yol rolsüz kişiye de 404).
- Açık iş yok. Sıradaki işlerden "Çalışan olarak ekleme" ve "Paneller" (destek rolü: `/panel/destek`) bu dosyanın
  gizli uç kuralına dokunabilir.
