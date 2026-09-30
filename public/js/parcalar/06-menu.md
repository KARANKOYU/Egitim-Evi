# public/js/parcalar/06-menu.js

Sol menünün içeriği: role ve müdürün verdiği yetkilere göre bölüm listesi, okulun kapattığı bölümlerin ayıklanması,
en üstte "Portallarım", en altta Ayarlar ile Çıkış Yap; ayrıca üst çubuktaki "+ Ekle" düğmesinin görünürlüğü.

## Bu dosya ne yapar?

Eğitim Evi'ne giren herkes solda bir menü görür ama herkesin menüsü farklıdır: öğrenci ödevlerini ve sınavlarını,
veli çocuklarının ödevlerini ve devamsızlığını, müdür okulun bütün düzenini (sınıflar, ders programı, roller, Excel
aktarım…) görür. Öğretmenin menüsü de sabit değildir: müdür "Roller ve Yetkiler"den bir öğretmene "Müdür
Yardımcısı" gibi bir rol verirse o öğretmenin menüsünün altında o rolün adıyla yeni bir bölüm açılır. Bu dosya "şu an
giriş yapmış kişi menüde neyi görmeli?" sorusunu cevaplar ve menüyü çizer.

İkinci işi okulun kapattığı bölümlerdir. Müdür Özellikler sayfasından (ör. servisi olmayan okulda) Servis'i,
Anketler'i kapatabilir ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)). Kapalı bölüm
menüden kalkar; adresi elle yazılsa bile `git()` onu açmaz ([07-yonlendirme.md](07-yonlendirme.md)); ana sayfa
kutucuklarından da düşer. Bu kararların hepsi buradaki `sayfaAcik`'a sorulur. Sunucu da aynı bölümün isteklerini
ayrıca reddeder; menüdeki süzgeç yalnız görünüştür.

Menü her sayfa değişiminde baştan çizilir (`git()` → `navCiz()`); bulunduğun sayfanın satırı işaretli durur.

## İçinde neler var?

### Okulun kapattığı bölümler

- `SAYFA_OZELLIK` — sayfa anahtarı → özellik anahtarı. Sunucudaki özellik adlarıyla aynı:
  - `odev`: `ogr-odevler`, `odevler`, `ders-odevleri`, `veli-odevler`, `quiz`
  - `sinav`: `ogr-sinavlar`, `sinavlarim`
  - `devamsizlik`: `yoklama`, `devamsizlik`, `devamsizligim`, `veli-devamsizlik`
  - `etut`: `etutler`, `etutlerim`, `etut-yoklama`
  - `servis`: `servis`; `yemek`: `yemek`; `kulup`: `kulupler`; `anket`: `anketler`

  Haritada OLMAYAN sayfalar (ana sayfa, takvim, ilerleyiş, "Sınıflarım", mesajlar…) hiçbir özelliğe bağlı değildir;
  birden çok bölümün verisini birlikte gösterenler kapalı bölümü kendi içlerinde atlar.
- `ozellikAcik(k)` — `S.kapali` listesinde `k` yoksa `true`. `S.kapali` hiç yoksa (`null`) her şey açıktır.
  Başka kullananlar: [08-ana-sayfa.md](08-ana-sayfa.md) (öğrencinin ödev serisi şeridi, öğretmenin ödev istekleri) ve
  `22-programim.js` (ders programındaki "yoklama al" kısayolu).
- `sayfaAcik(sayfa)` — sayfanın bağlı olduğu özellik açık mı; haritada yoksa her zaman `true`. `07-yonlendirme.js`'teki
  `git()` ve `kutucuklar()` da bunu kullanır.
- `menuSuz(liste)` — üç geçişte süzer: (1) kapalı sayfaların satırlarını atar; (2) altında (bir sonraki başlığa ya da
  ayraca kadar) hiç bağlantı kalmayan başlığı atar; (3) arkasından bağlantı ya da başlık gelmeyen ayracı atar (üst üste
  iki ayraçtan öndeki gider, en sonda kalan ayraç da gider). Böylece "Okul Düzeni" başlığı altı boşken tek başına
  asılı kalmaz.

### Menü satırlarının biçimi

`navTanim()`'in döndürdüğü dizide üç tür öğe vardır:

- `{ k: 'sayfa-anahtari', g: 'simge-adi', ad: 'Görünen ad' }` — bağlantı; `k` `SAYFALAR`'daki sayfa, `g` `ik()`
  simgesi ([02-ikonlar.md](02-ikonlar.md)).
- `{ ayrac: 1 }` — ince çizgi.
- `{ baslik: 'Okul Düzeni' }` — küçük gri başlık.

`testler/buton-denetimi.js` bu biçime güvenir: `{ k: '…', g: '…' }` kalıbındaki her anahtarın `SAYFALAR`'da bir sayfası
olmalı. Yeni satır eklerken aynı biçimi koru.

### `navTanim()` — kime hangi menü

`S.user` yoksa boş dizi. Sırayla şu durumlara bakar:

1. **Öğrenci portalı görünümü** (`S.viewStudentId` dolu ve kişi öğrenci değil): veli çocuğunun kartına, müdür ya da
   yetkili öğretmen "Portalını aç"a basınca ([10-mudur.md](10-mudur.md) `ogrenciPortalAc`). Menü: Ana Sayfa, geri dönüş
   (`k: 'geri-veli'`; velide "Çocuk Listesi", ötekilerde "Öğrenci Listesi"), ayraç, başlık olarak öğrencinin adı
   (`S.viewStudentName`), sonra Ders Programı (`programim`), Takvimi, İlerleyişi (`ilerleyisim`), Ödevleri (`odevler`),
   Sınavları (`sinavlarim`), Devamsızlığı (`devamsizligim`). `geri-veli` bir sayfa değil: `25-tiklama.js` bunu yakalar,
   `S.viewStudentId`'i siler ve velide `cocuklarim`'a, ötekilerde `okul-ogrenciler`'e gider.
2. **Portal dışındaki yetişkin hesabı ya da rolsüz hesap** (`portalDisindaMi()` ya da `!u.role`,
   [08c-kisilikler.md](08c-kisilikler.md)): yalnız Başlangıç (`ana`) ve Hatırlatıcılar. Portallar menünün başında zaten
   durur, Ayarlar en altta.
3. **Servisçi**: Yoklama (`ana` anahtarı, servis simgesiyle — servisçinin ana sayfası yoklamadır), Mesajlar, Takvim,
   Hatırlatıcılar.
4. **Öğrenci**: Ana Sayfa, Mesajlar, Anketler, Takvim, Hatırlatıcılar, Devamsızlığım, Ders Programı, İlerleyişim,
   Ödevler, Sınavlarım, Etütlerim; ayraç; Yemek Listesi, Servisim, Kulüpler.
5. **Veli**: Ana Sayfa, Mesajlar, Anketler, Takvim, Hatırlatıcılar, Ödevler (`veli-odevler`), Devamsızlık
   (`veli-devamsizlik`), İlerleyiş (`veli-ilerleyis`), Etütler (`etutlerim`), Yemek Listesi, Servis, Çocuğumun telefonu
   (`aile`), Kulüpler; ayraç; Çocuklarım.
6. **Öğretmen**: her öğretmende Ana Sayfa, Mesajlar, Anketler, Takvim, Hatırlatıcılar, Ders Programım (`programim`).
   Okulun "Öğretmen" rolündeki yetkilere bağlı olanlar (müdür bir yetkiyi kapatırsa satır da kalkar):

   | Satır | Görünme şartı (`yetkim`) |
   |---|---|
   | Ödevler (`ogr-odevler`) | `odev.ver` ya da `odev.sonuclandir` |
   | Sınavlar (`ogr-sinavlar`) | `sinav.olustur` ya da `sinav.not-gir` |
   | Yoklama | `devamsizlik.al` |
   | Sınıflarım | `ogretmen.sonuclar` |

   Sonra her öğretmende Etütler, Yemek Listesi, Kulüpler. Ardından **ek bölüm** — müdürün verdiği özel rolden gelen
   yetkiler; en az biri varsa ayraç ve başlık (`u.customRoleName`, yoksa "Ek Yetkiler") altında:

   | Satır | Görünme şartı |
   |---|---|
   | Sınıflar | `sinif.yonet` ya da `ders.yonet` |
   | Ders Programı (`program`, düzenleme) | `program.duzenle` |
   | Okul Öğrencileri (`okul-ogrenciler`) | `ogrenci.duzenle`, `ogrenci.hesap-ac` ya da `ogrenci.portal` |
   | Eğitim Yılı | `yil.yonet` |
   | Öğretmenler | `ogretmen.onayla` ya da `ogretmen.duzenle` |
   | Roller ve Yetkiler | `rol.yonet` |
   | Excel Aktarım | `aktarim.yap` |
   | Devamsızlık (okul geneli) | `devamsizlik.gor` |
   | İşlem Kaydı | `islem-kaydi.gor` |
   | Servisler | `servis.yonet` |
   | Okul Sayfası | `okul.sayfa` |
   | Okulun Konumu (`okul-ayarlari`) | `okul.konum` |

   En sonda `veliBolumu()`.
7. **Müdür**: Ana Sayfa, Mesajlar, Anketler, Takvim, Hatırlatıcılar, Öğretmenler, Öğrenciler; ayraç; "Okul Düzeni"
   başlığı altında Sınıflar, Ders Programı, Roller ve Yetkiler, Eğitim Yılı, Özellikler, Devamsızlık, Etütler, Ödevler
   (`ders-odevleri`), Yemek Listesi, Servisler, Kulüpler, Excel Aktarım, İşlem Kaydı, Okul Adresi ve Konumu
   (`okul-ayarlari`), Okul Sayfası; ayraç; "Kendi Derslerim" altında Sınavlar (`ogr-sinavlar`) ve Yoklama; en sonda
   `veliBolumu()`. Müdürde `yetkim` her zaman `true` olduğu için süzme yoktur.
8. **Sistem yöneticisi**: menü bu dosyada değil, `YONETIM.menu()`'dedir (`public/js/yonetim/09a-yonetim-paneli.js`:
   Ana Sayfa, Müdürler, Okullar, Yorumlar, Hatırlatıcılar; "Site" altında Site Ayarları, Yönetici Dosyası, Yedekleme,
   İşlem Kaydı). `YONETIM` boşsa (yönetim paketi yüklenmemiş, ör. yönetici sitenin olağan adresinde) yalnız Ana Sayfa.
9. Tanınmayan rol: boş dizi (menüde yalnız Portallarım — varsa —, Ayarlar ve Çıkış kalır).

### `veliBolumu()`

Öğretmen ya da müdür aynı zamanda veliyse (`S.children` doluysa) menüsünün sonuna ayraç, "Velisi olduğum" başlığı,
Çocuklarım, Ödevleri, Devamsızlığı, İlerleyişi; öğretmende, servis yönetme yetkisi (`servis.yonet`) yoksa bir de
Servisi ekler (yetkisi olan öğretmende "Servisler" zaten ek bölümde durur, aynı `servis` anahtarı iki kez çıkmasın).
Çocuk yoksa boş dizi. Bugünkü düzende bu bölüm nadiren görünür; bkz. Dikkat.

### Çizim

- `navCiz()` — `menuSuz(navTanim())` listesini `#navListe`'ye (`public/index.html`) yazar. Önce `portalMenusu()`
  ([08c-kisilikler.md](08c-kisilikler.md)): yetişkin hesabında ve okul rolünde "Portallarım" başlığı, her portal bir
  satır, "Portal ekle" ve ayraç. Sonra satırlar: ayraç `div.nav-ayrac`, başlık `div.nav-baslik` (`esc`'li), bağlantı
  `button.navlink[data-nav="<k>"]` (simge + ad; `S.page === k` ise `on` sınıfı). En altta her zaman ayraç, Ayarlar
  (`data-nav="profil"`, profildeyken işaretli) ve Çıkış Yap (`data-act="cikis"`). Sonunda `ekleDugmesiniAyarla()`.
  Tıklamalar burada değil, `25-tiklama.js`'in tek tıklama dinleyicisinde ele alınır: `data-nav` → `git(k)`,
  `data-act="cikis"` → `cikisYap()`.
- `ekleDugmesiniAyarla()` — üst çubuktaki `#btnEkle` ("+ Ekle", `data-act="kisilik-ekle"`) yalnız
  `S.user.yetiskin` ya da `S.user.rolSatiri` doğruysa görünür: yetişkin hesabında ve ona bağlı okul rolünde evet;
  öğrenci, servisçi ve yöneticide gizli. İki alan da sunucunun `benimGorunum`'undan gelir
  ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)).

Dosyanın dışa açık bir `module.exports`'u yok: bütün parçalar tek IIFE'de birleştiği için
([../../../sunucu/http.md](../../../sunucu/http.md) `birlesikOku`) buradaki her ad öbür parçalardan doğrudan çağrılır.

## Kimle konuşur?

- Çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)): `user` (`role`, `yetkiler`, `customRoleName`, `yetiskin`, `rolSatiri`), `kapali`,
    `children`, `page`, `viewStudentId`, `viewStudentName`; `YONETIM` kancası da orada tanımlıdır.
  - `$`, `esc` ([01-yardimcilar.md](01-yardimcilar.md)); `ik` ([02-ikonlar.md](02-ikonlar.md)).
  - `yetkim(izin)` — `21-ders-programi.js`'te tanımlı (müdür ve yöneticide her zaman `true`, ötekilerde
    `S.user.yetkiler`'e bakar). Ad sırasında bu dosyadan sonra gelse de sorun yok: bütün parçalar tek işlevin içinde
    birleştiği için `function yetkim` bildirimi en başa taşınır (hoisting); üstelik çağrı çizim anında yapılır.
  - `portalDisindaMi`, `portalMenusu` ([08c-kisilikler.md](08c-kisilikler.md)).
- Sunucu ucu çağırmaz. Beslendiği veri:
  - `S.kapali` ← `kapaliOzellikler`: giriş ve `/api/me` cevabı ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md);
    hesap `ozellikler.js`'teki `kullanicininKapalilari`), portal geçişi (`08c-kisilikler.js`), sayfa yenilenince
    (`26-baslat.js`); müdür Özellikler'i kaydedince `16c-ozellikler.js` `S.kapali`'yi günceller ve `navCiz()`'i çağırır.
  - `S.user.yetkiler` ve `customRoleName` ← [../../../sunucu/yetki.md](../../../sunucu/yetki.md) (`pub`).
- Onu kullananlar:
  - `navCiz` — [07-yonlendirme.md](07-yonlendirme.md) `git()` (her sayfa değişiminde), [08c-kisilikler.md](08c-kisilikler.md)
    `portallariTazele`, `16c-ozellikler.js`.
  - `sayfaAcik` — [07-yonlendirme.md](07-yonlendirme.md) (`git`, `kutucuklar`).
  - `ozellikAcik` — [08-ana-sayfa.md](08-ana-sayfa.md), `22-programim.js`.
  - `SAYFA_OZELLIK`, `menuSuz`, `navTanim`, `veliBolumu`, `ekleDugmesiniAyarla` yalnız bu dosyada kullanılır.
- Görünüm: `public/css/parcalar/03-iskelet.css` (`.navlink`, `.navlink.on`, `.nav-ayrac`, `.nav-baslik`),
  `12-ikonlar.css` (satırdaki simgenin boyutu, işaretli satırda tam opaklık), `30-dokunmatik.css` (dokunmatik ekranda
  satır en az 46 px), `23-hareket.css` (hareket azaltma tercihinde kayma yok), `08-menu-filtre.css` (masaüstünde ☰ ile
  menüyü daraltma), `28-yetiskin-hesap.css` (Portallarım satırları ve `.iconbtn.ekle-dugme`). Menü kutusu
  `public/index.html`'deki `#sidebar` / `#navListe`; telefonda kayan panel olarak açılıp kapanması
  `24-bildirim-arama-mobil.js`'tedir (`sidebarAc`, `sidebarKapat`).
- Rol: giriş yapmış herkes görür; içerik yukarıdaki tabloya göre değişir.

## Nasıl çalışır (adım adım)?

```
git('ogr-odevler')                                  (07-yonlendirme.js; her sayfa değişiminde)
  └─ navCiz()
       h = portalMenusu()        yetişkin/okul rolü: "Portallarım" + portallar + "Portal ekle"
       liste = navTanim()        rol → dizi; öğretmende yetkim(...) ile satır ekle/çıkar
       liste = menuSuz(liste)    S.kapali'deki bölümler gider, boş başlık/ayraç temizlenir
       her öğe → nav-ayrac / nav-baslik / button.navlink[data-nav] (+ 'on' işareti)
       + ayraç + Ayarlar + Çıkış Yap
       #navListe.innerHTML = h
       ekleDugmesiniAyarla()    #btnEkle görünür mü
kişi bir satıra basar ─► 25-tiklama.js: data-nav="k" ─► git(k)  (ya da 'geri-veli' özel yolu)
```

Örnek: müdür Özellikler'den Anketler'i kapattı → `16c-ozellikler.js` `S.kapali = ['anket']` yapar ve `navCiz()`'i
çağırır → `menuSuz` "Anketler" satırını atar. Okuldaki öğretmen bir sonraki girişinde (ya da `/api/me` tazelendiğinde)
aynı listeyi alır. Adrese `#/anketler` yazan kişiye `git()` "Bu bölüm okulunda kapalı…" kutusunu gösterir; sunucu da
`/api/anketler` isteklerine 403 verir.

## Dikkat!

- **Menü güvenlik değildir.** Bir satırın gizlenmesi yalnız görünüştür; her ucun yetkisini sunucu ayrıca denetler
  ([../../../sunucu/yetki.md](../../../sunucu/yetki.md), [../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)).
  Menüye satır ekleyip sunucuda yetkisini unutursan açık kalır.
- **`SAYFA_OZELLIK` sunucudaki özellik listesiyle elle eş tutulur.** Yeni bir bölüm sayfası (ör. yeni bir "…lerim"
  sayfası) ekleyip haritaya yazmazsan, okul o bölümü kapattığında menüde yine görünür; tıklayan kişi ancak sunucunun 403
  iletisini görür. Sunucudaki `YOL` (yol → özellik) ile buradaki harita (sayfa → özellik) ayrı şeylerdir; ikisini de güncelle.
- **Veli için "kapalı" anlamı farklıdır.** İki çocuğu iki ayrı okuldaysa bir bölüm ancak İKİ okulda da kapalıysa
  `S.kapali`'ye girer (sunucu `kullanicininKapalilari`). Birinde açık birinde kapalıysa menüde görünür; kapalı okuldaki
  çocuğu ilgili sayfa kendi içinde atlar.
- **Yetki satırları ile sayfanın kendi istekleri ayrı yetki isteyebilir.** Menü "Öğretmenler"i `ogretmen.onayla` ya da
  `ogretmen.duzenle` ile açar, ama sayfanın listesi (`GET /api/school/teachers`) `ogretmen.duzenle` ister; yalnız
  `ogretmen.onayla`'sı olan kişi sayfayı açar, listeyi göremez (bkz. [10-mudur.md](10-mudur.md) Dikkat).
- **`veliBolumu()` bugünkü düzende pratikte eski usul hesaplarda çıkar.** 516'dan beri öğretmenlik ve müdürlük
  yetişkin hesabına bağlı AYRI rol satırlarıdır; sunucu rol satırında `children`'ı boş döner (`sunucu/iliskiler.js`
  `childrenOf`: `anaHesapId` varsa `[]`). Veli olunan çocuklar "Portallarım"da ayrı satırdır; oraya geçilince menü
  zaten veli menüsüdür. "Velisi olduğum" bölümü yalnız rolü yetişkin hesabının kendisinde duran (eski usul onaylanmış)
  öğretmen/müdür hesabında görünür. Kod okumasına göre; tarayıcıda denenmedi. Kaldırılıp kaldırılmayacağı "çok gerekli
  olmayanlar" listesine aday.
- **Servisçinin ana sayfası özelliğe bağlı değildir.** Servisçi menüsündeki "Yoklama" `ana` anahtarıdır, haritada
  yoktur; okul Servis'i kapatırsa servisçinin menüsü yine görünür, sayfa açılınca `GET /api/servis/yoklama` 403 alır ve
  sayfada kırmızı "Servis bu okulda kapalı…" iletisi çıkar (kod okumasına göre).
- **Menü baştan çizilir.** `navCiz` her çağrıda `#navListe`'yi yeniden yazar; menüde tutulan bir durum (açık alt
  bölüm vb.) yoktur. Masaüstündeki daraltma tercihi `localStorage`'dadır (`24-bildirim-arama-mobil.js`), bu dosyada değil.
- **Başlıklar kaçırılır.** Özel rol adı müdürün yazdığı metindir; `navCiz` onu `esc` ile yazar. Yeni bir başlık ya da
  ad eklerken de `esc`'ten geçir.
- **`yetkim` bu dosyada tanımlı değil.** `21-ders-programi.js`'te durur. Parçalar tek bir `(function () { … })()`
  içinde birleştiği için `function` bildirimleri en başa taşınır: sıra hata doğurmaz. Yine de `yetkim`'i yalnız
  işlevlerin içinden çağır: dosya yüklenirken (tepe düzeyde) çağrılsa hata vermez ama `S.user` henüz boş olduğu için
  her zaman `false` döner, menü yanlış kurulur. (`var` ile kurulan nesnelerde durum farklıdır: bkz.
  [08-ana-sayfa.md](08-ana-sayfa.md)'deki `SAYFALAR` uyarısı.)
- Sistem yöneticisinin menüsü herkese giden `/js/app.js`'te yoktur (yönetim ekranlarının adı dışarı sızmasın diye);
  `testler/test-admin-gizli.js` app.js'te yönetim uç adlarının geçmediğini denetler. Buraya yönetici satırı ekleme,
  `YONETIM.menu()`'ye ekle.

## Testleri

- `testler/buton-denetimi.js` (sunucusuz) — parçaları sunucu gibi ad sırasıyla birleştirir; menüdeki her
  `{ k, g }` satırının ve her `data-nav`'ın bir `SAYFALAR` karşılığı olduğunu, `data-act="cikis"`'in ele alındığını denetler.
- `testler/test-ozellikler.js` — `/api/me`'nin kapalı listeyi (`kapaliOzellikler`) söylemesi, velinin çocuğun
  okulundaki kapalıları bilmesi, kapalı bölüm uçlarının 403 vermesi (menünün beslendiği veri).
- `testler/test-rol.js` — özel rol ve yetkiler (menü satırlarını açan `yetkiler` listesi).
- `testler/test-yetiskin.js` — `yetiskin`/`rolSatiri` alanları ve portallar (Portallarım ve "+ Ekle"nin şartı).
- `testler/yazim-denetimi.js` — menüdeki görünen metinlerin Türkçe yazımı.
- Elle (test sunucusu 3200, `testler/seed.js` hesapları): müdürle gir → menüde "Okul Düzeni" ve "Kendi Derslerim";
  Özellikler'den Anketler'i kapat → "Anketler" satırı kalkar; bir öğretmene yalnız "Excel Aktarım" yetkili bir rol ver →
  öğretmenle girince menünün altında rolün adıyla bir başlık ve "Excel Aktarım" görünür.

## Son durum

- `git log`: 8 commit. Dosya `7506855 commit 22` (2026-08-28) ile ilk kez eklendi (aynı commit'te `07-yonlendirme.js`
  de doğdu).
- Son değişiklik `276c0a0 commit 521` (2026-09-27, gizli yönetim paneli): yöneticinin menüsü bu dosyadan çıkarıldı;
  artık `YONETIM ? YONETIM.menu() : [Ana Sayfa]` — menünün kendisi yalnız yönetim paketindeki
  `public/js/yonetim/09a-yonetim-paneli.js`'te.
- Ondan önce `3b8fd36 commit 519` (2026-09-27, quiz): `SAYFA_OZELLIK`'e `quiz: 'odev'` eklendi (quiz sayfası ödevle
  birlikte kapanır). `24050a2 commit 518` (2026-09-27, servis yoklaması): servisçinin menüsündeki "Seferlerim" "Yoklama"
  oldu, `seferim` sayfası haritadan çıktı. `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar): "Hesap
  değiştir" satırı kalktı, yerine menünün başında `portalMenusu()` ("Portallarım") ve `ekleDugmesiniAyarla()` geldi;
  rolsüz menü şartı `portalDisindaMi() || !u.role` oldu; Ayarlar satırı işaretlenir oldu; yöneticinin menüsündeki "Onay
  Bekleyenler" (`onaylar`) satırı kalktı (müdür başvurusu artık yok). `7a8b555 commit 504` (2026-09-26): öğretmen ek
  bölümüne `okul.konum` → "Okulun Konumu".
- Bilinen açıklar (kod değiştirilmedi): `veliBolumu`'nun yeni düzende neredeyse hiç görünmemesi; "Öğretmenler" satırının
  yalnız `ogretmen.onayla` ile açılıp boş liste göstermesi (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Çalışan olarak ekleme" (iş 2: kodla eklenen rolsüz çalışanın menüsü, rolsüz
  çalışan portalı); "Özel roller" (iş 24: `okul.simge`, `tahta.yonet`, `toplanti.ac`, `basari.ekle`, `anket.olustur`,
  `okul.yedek` gibi yeni yetkiler → yeni ek bölüm satırları); "Tek kişi tek hesap + portallar öğrencide de" (iş 19:
  öğrencide de Portallarım); "Üst şerit sadeleştirme" (iş 29: Ayarlar, Portallarım ve Çıkış'ın profil menüsüne
  taşınması — `navCiz`'in başındaki `portalMenusu()` ve sonundaki Ayarlar/Çıkış satırları etkilenir —, "+ Ekle"nin dar
  ekranda menüye alınması, tanımda bu dosyanın satır 210'undaki Çıkış simgesi anılıyor); "Paneller" (iş 5:
  `/panel/admin`, `/panel/destek` — yönetici menüsü `YONETIM` tarafında); "Çok dil" (iş 22: menü adları `c()`
  kataloğuna); ayrıca yeni sayfa getiren işler (Toplantılar, Başarılarım, Eğitim içerikleri, Ajanda) menüye satır ekleyecek.
