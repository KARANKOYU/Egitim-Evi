# public/js/parcalar/24-bildirim-arama-mobil.js

Üst şeridin her sayfada çalışan üç işi: zil (bildirimleri belli aralıkla yoklama, okunmamış rozeti, bildirim paneli,
bildirime basınca ilgili sayfa), "İçerik Ara" kutusunun sayfa içinde süzmesi ve sol menünün telefonda kayan panel,
masaüstünde daraltılabilir menü olarak davranması.

## Bu dosya ne yapar?

**Bildirimler.** Eğitim Evi'nde bildirim, sunucunun bir kişiye yazdığı kısa satırdır: "Yeni ödev: Sayfa 42 (Matematik)",
"Çocuğunuz … dersine gelmedi (izinsiz).", "Hatırlatma: Beden eğitimi kıyafeti". Sağ üstteki zilin yanında okunmamış
sayısı (rozet) durur; zile basınca panel açılır, satıra basınca ilgili sayfa açılır. Sayfa sunucuyu sitenin **yoklama
aralığıyla** sorar (yönetim panelindeki ayar; varsayılan 5 dakika, 1–30). Sorgu ucuzdur: tarayıcı son bildiği **sürümü**
gönderir, kutu değişmediyse liste gelmez, cevap birkaç bayttır. Arka plandaki sekme hiç sormaz; sekmeye dönülünce ve zil
açılınca beklemeden sorar. Telefona düşen "push" bildirimi ayrı bir yoldur ([04b-bildirim-izni.md](04b-bildirim-izni.md));
bu dosya yalnız sayfanın içindeki zili yönetir.

**Arama.** Üstteki "İçerik Ara" kutusu sunucuya gitmez: açık sayfada `data-ara` işaretli satırları anında süzer. Türkçe
harfler sadeleştirilir ("ogretmen", "ÖĞRETMEN", "öğretmen" aynı sonucu verir). Ödev sayfaları kendi aramasını kurar
(filtrelerle birlikte); kutu o sayfalarda onların işlevini çağırır.

**Menü.** 860 piksel ve altı (telefon, dar tablet) "dar ekran"dır: ☰ menüyü soldan kayan panel olarak açar; arkadaki
perdeye basınca, sayfa değişince ya da pencere genişleyince kapanır. 860'ın üstünde ☰ menüyü yerinde gizler/gösterir ve
bu tercih tarayıcıda saklanır.

Herkes kullanır: öğrenci, veli, öğretmen, müdür, servisçi, rolsüz yetişkin; sistem yöneticisinin ekranı da aynı kabuğu
(`public/index.html`) kullanır.

## İçinde neler var?

### Bildirim yoklaması

- `bildirimleriYenile()` — oturum yoksa, sekme arka plandaysa (`document.hidden`) ya da bir yoklama zaten sürüyorsa
  (`S._bildirimYoklaniyor`) hiçbir şey yapmaz. Değilse `GET /api/notifications` (biliniyorsa `?surum=<son sürüm>`).
  Cevap gelince:
  - bayrak kalkar; bu arada çıkış yapıldıysa (`S.token` boş) durur;
  - `S.bildirimSurum`, `S.unread` yazılır; rozet `#bildirimRozet` sayıyı gösterir (99'dan çoksa "99+"), sıfırsa gizlenir;
  - liste değiştiyse (`ayni` değilse): bu ilk yoklama değilse ve kişide portal listesi varsa `portallariTazele()` (yeni
    bildirim "X okulu seni öğretmen olarak ekledi" gibi bir şey olabilir: menüdeki "Portallarım" tazelensin);
    `S._bildirimler` = yeni liste; panel açıksa `bildirimPaneliCiz()`.
  Hata sessizce yutulur (bayrak kalkar).
- Dosya yüklenince bir kez: `visibilitychange` dinleyicisi — sekme öne gelince `bildirimleriYenile()`.
- `bildirimAraligiAl(dk)` — aralığı dakika olarak alır: yuvarlar, 1'den küçük ya da sayı değilse yok sayar, 30'a
  sıkıştırır; aynıysa bir şey yapmaz; değiştiyse `S.bildirimAralikDk`'ya yazar ve sayaç çalışıyorsa yeni aralıkla
  yeniden kurar.
- `bildirimSayaciKur()` — eski sayacı durdurur, `setInterval(bildirimleriYenile, aralık × 60 000)` kurar (aralık yoksa 5
  dakika); kimliği `S._bildirimSayac`'ta.

### Bildirim paneli

- `bildirimPaneliAcKapa()` — zil düğmesi. Panel doluysa boşaltır (kapatır); boşsa `bildirimPaneliCiz()` ve hemen
  `bildirimleriYenile()` (aralık dakikalarca olabilir).
- `bildirimPaneliCiz()` — `#bildirimPanel`'e `.panel` yazar: liste boşsa "Bildirim yok."; değilse her bildirim bir satır
  (`.bildirim`; okunmamışsa `yeni`): metin (`esc`'li) ve altında zaman (`tarihSaat`, `.z`). Bağlantısı uygulama içi bir
  sayfaysa satır tıklanır olur (`tikla`, `data-act="bildirim-git"`, `data-link`, `role="button"`, `tabindex="0"`).
  Okunmamış varsa (`S.unread > 0`) `POST /api/notifications/read` → `S.unread = 0`, rozet gizlenir, bellekteki liste
  okundu işaretlenir. Bu istek açık paneli yeniden çizmez; ama zil açılırken hemen ardından giden yoklama "okundu"dan
  SONRA işlenirse sürüm değişmiş olur (okunmamış sayısı sürümün parçası), liste okundu hâliyle gelir ve panel "yeni"
  vurgusu olmadan yeniden çizilir. Yani vurgu bazen panel açık kaldıkça durur, bazen hemen kaybolur. Hata yutulur.
- `EYLEMLER['bildirim-git']` — `data-link`'i `adrestenParca` ile çözer (`#/veli-odevler?c=<çocuk>` → sayfa + çocuk),
  paneli kapatır; sayfa bilinmiyorsa durur; çocuk varsa `S.adresCocuk`'a yazar (veli sayfaları o çocuğu seçer,
  `27-veli-panel.js`; servis sayfası da o çocuğun kartına kaydırır, [19c-okul-hayati.md](19c-okul-hayati.md)), sonra
  `git(sayfa)`.

### Arama

- `araUygula()` — açık sayfanın arama kancası varsa (`S.araHook`, ör. ödev listelerindeki `odevSonucCiz`) onu çalıştırır
  ve biter. Yoksa kutudaki metni `nrm` ile sadeleştirir; `#sayfa` içindeki her `[data-ara]` öğesi, `data-ara` değeri
  (sadeleştirilmiş) metni içeriyorsa görünür, içermiyorsa `display: none` olur. Önceki "sonuç yok" kutusu (`#araBos`)
  kaldırılır; metin varsa, sayfada `data-ara`'lı öğe varsa ve hiçbiri görünmüyorsa sayfanın sonuna `div#araBos` eklenir:
  boş kutu "\"ogretmen\" için sonuç bulunamadı.".
- `data-ara` koyan parçalar: [10-mudur.md](10-mudur.md), [11-ogretmen-odev.md](11-ogretmen-odev.md),
  [11b-siniflarim.md](11b-siniflarim.md), [12-ogretmen-sinav.md](12-ogretmen-sinav.md), [13-ogrenci-veli.md](13-ogrenci-veli.md),
  [14-odev-filtre.md](14-odev-filtre.md), [15-aktarim.md](15-aktarim.md), [18b-etut.md](18b-etut.md),
  [19f-roller.md](19f-roller.md), [19h-hatirlaticilar.md](19h-hatirlaticilar.md), [20-siniflar.md](20-siniflar.md),
  [22-programim.md](22-programim.md), [23-veli-ayarlar.md](23-veli-ayarlar.md), `27-veli-panel.js`; yönetim paketinde
  `09-yonetici.js`, `09b-site-ayarlari.js`.

### Menü (dar ekran ve masaüstü)

- `sidebarAc()` / `sidebarKapat()` — `#sidebar` ve `#sidebarPerde`'ye `acik` sınıfını ekler / kaldırır (dar ekranda
  kayan panel ve perde; `07-mobil.css`).
- `masaustuMu()` — `window.innerWidth > 860` (CSS'teki `max-width: 860px` / `min-width: 861px` sınırıyla aynı).
- `menuDurumYaz(kapali)` — tercihi `localStorage` `ee_menu`'ye `'1'`/`'0'` yazar; gizli sekmede yazılamazsa sessizce geçer.
- `masaustuDaralt(kapali)` — `body`'ye `sidebar-kapali` sınıfını koyar/kaldırır (masaüstünde menü gizlenir,
  `08-menu-filtre.css`), `#hamburger`'in `aria-expanded`'ini günceller, tercihi yazar.
- `menuDurumOku()` — `ee_menu === '1'` mi; okunamazsa `false`.

### Durum alanları

`S.unread` ve `S.bildirimAralikDk` (5) [00-durum.md](00-durum.md)'de başlar; `S.bildirimSurum`, `S._bildirimler`,
`S._bildirimYoklaniyor`, `S._bildirimSayac` bu dosyada oluşur. `S.araHook` [07-yonlendirme.md](07-yonlendirme.md)'de her
sayfa değişiminde boşaltılır.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları: `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER`
  ([01-yardimcilar.md](01-yardimcilar.md)); `tarihSaat`, `nrm` ([02-ikonlar.md](02-ikonlar.md)); `git`, `bosKutu`,
  `adrestenParca` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  `portallariTazele` ([08c-kisilikler.md](08c-kisilikler.md)). Kabuktaki öğeler `public/index.html`'de: `#araKutu`,
  `#btnBildirim`, `#bildirimRozet`, `#bildirimPanel`, `#hamburger`, `#sidebar`, `#sidebarPerde`, `#sayfa`.
- Onu kullananlar:
  - `25-tiklama.js` (`tiklamaKur`): zil düğmesi → `bildirimPaneliAcKapa`; arama kutusu `oninput` → `araUygula`; ☰ →
    masaüstünde `masaustuDaralt`, dar ekranda `sidebarAc`/`sidebarKapat`; açılışta masaüstündeyse kaydedilmiş daraltmayı
    uygular (`menuDurumOku`); pencere masaüstü boyuna büyüyünce `sidebarKapat`; perdeye basınca `sidebarKapat`; panelin
    dışına (eylemsiz bir yere) basınca paneli boşaltır; `mesaj-sil`'den sonra `bildirimleriYenile`.
  - `26-baslat.js`: `uygulamayiBaslat` → `bildirimleriYenile()` ve `bildirimSayaciKur()`; çıkış ve rol değişimi
    (`oturumDurumunuSifirla`) sürümü, listeyi, paneli ve rozeti sıfırlar; çıkışta sayaç durur.
  - [07-yonlendirme.md](07-yonlendirme.md): `git()` → `sidebarKapat()`; `yaz()` → `araUygula()` (sayfa çizilince arama
    yeniden uygulanır); `sayfayiYenile()` → `bildirimleriYenile()`.
  - [19-mesajlar.md](19-mesajlar.md): mesaj açılınca ve gönderilince `bildirimleriYenile()`.
  - `bildirimAraligiAl`: [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md) (`girisSonrasi`: giriş ve `/me` cevabı),
    [05a-dis-sayfalar.md](05a-dis-sayfalar.md) (`siteBilgisiYukle`: `/site` cevabı), yönetim paketindeki
    `public/js/yonetim/09b-site-ayarlari.js` (yönetici ayarı değiştirince). Yine `09b-site-ayarlari.js` okul adresini
    değiştirince `araUygula()`'yı çağırır.
- Sunucu uçları ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)):
  - `GET /api/notifications[?surum=]` — giriş gerekir (401). Sürüm aynıysa `{ ayni: true, surum, unread }`; değilse
    `{ notifications: [{ id, userId, text, link, read, createdAt }] (en yeni 100), unread, surum }`. Sürüm "toplam.
    okunmamış.son bildirimin anı"dır ([../../../sunucu/veri/depo/genel.md](../../../sunucu/veri/depo/genel.md)
    `bildirimSurumu`); okununca da değişir.
  - `POST /api/notifications/read` — kişinin okunmamış bütün bildirimlerini okundu yapar.
  - Aralık ayarı: [../../../sunucu/site.md](../../../sunucu/site.md) (`bildirimAralikDk`: 1–30, varsayılan 5; giriş,
    `/me` ve `/site` cevaplarında) ve yöneticinin ayar ekranı
    [../../../sunucu/bolumler/site-ayarlari.md](../../../sunucu/bolumler/site-ayarlari.md).
  - Her API isteği gibi yoklama da kişiyi "şu an açık" sayar ([../../../sunucu/api.md](../../../sunucu/api.md)
    `site.goruldu`); sitenin çevrimiçi sayma süresi bu yüzden yoklama aralığından en az 1 dakika uzundur.
- Bildirimleri yazan: [../../../sunucu/veri/index.md](../../../sunucu/veri/index.md) `bildir` / toplu bildirim →
  `bildirimler` tablosu ([../../../sunucu/veri/depo/genel.md](../../../sunucu/veri/depo/genel.md)); aynı olay telefona
  da gider ([../../../sunucu/push.md](../../../sunucu/push.md)).
- CSS: `public/css/parcalar/03-iskelet.css` (üst şerit, `.rozet`, `#bildirimPanel { display: contents }`),
  `06-modal.css` (`.panel`, `.panel .bildirim`, `.yeni`, `.tikla`, `.z`; perdenin temel hâli `.sidebar-perde { display:
  none }`), `23-hareket.css` (panelin açılış animasyonu), `07-mobil.css` (860 px ve altında `.sidebar`
  kayan panel, `.sidebar.acik`, `.sidebar-perde.acik`), `08-menu-filtre.css` (861 px üstünde `body.sidebar-kapali
  .sidebar { display: none }` ve açılış animasyonu), `04-kartlar.css` (`.bos`). `#araBos`'un kendi kuralı yok.
- Rol: herkes.

## Nasıl çalışır (adım adım)?

```
giriş ─► 26-baslat: bildirimleriYenile() + bildirimSayaciKur() (5 dk)
   GET /notifications                ─► { notifications[100], unread: 3, surum: "41.3.1727…" } ─► rozet "3"
   5 dk sonra GET ?surum=41.3.1727…  ─► { ayni: true }  (liste gelmez)
   sekme arka planda                 ─► yoklama yok;  öne gelince ─► hemen yoklama

zil ─► panel (eldeki liste) ─► unread > 0 ─► POST /notifications/read ─► rozet gizli
    └► aynı anda GET /notifications ─► yeni liste geldiyse panel yeniden çizilir
satır "Yeni ödev …" (#/odevler) ─► bildirim-git ─► panel kapanır ─► git('odevler')
veli satırı (#/veli-odevler?c=ogr7) ─► S.adresCocuk = 'ogr7' ─► git('veli-odevler') ─► o çocuk seçili

arama kutusu "7-a" ─► araUygula ─► #sayfa [data-ara]: "7-A" görünür, öbürleri gizli
☰ (masaüstü) ─► masaustuDaralt(true) ─► body.sidebar-kapali, ee_menu = '1'
☰ (telefon)  ─► sidebarAc ─► perdeye ya da bir menü maddesine bas ─► sidebarKapat
```

## Dikkat!

- **Zili açmak her şeyi okundu sayar.** Panel açıldığı anda (kişi satırları okumasa da) sunucudaki bütün okunmamışlar
  okundu olur ve rozet kaybolur — yalnız listedeki 100'ü değil, hepsi. Panel açık dururken gelen yeni bildirim de
  aynı yoldan geçer: yoklama rozeti yazar ve paneli yeniden çizer, `S.unread > 0` olduğu için hemen yine "okundu" gider;
  rozet bir an görünüp kaybolur.
- **"Okundu" sürümü değiştirir, portallar boşuna tazelenir.** Okunmamış sayısı sürümün parçası olduğu için zil
  açıldıktan sonraki ilk yoklama "değişmedi" yerine tam listeyi alır; `S.portallar` olan (yetişkin hesabı) kişide bu
  her seferinde fazladan bir `portallariTazele()` isteği demektir. Zararsız, küçük bir israf.
- **"Okundu" ile yeni yoklama yarışır.** Panel açılınca önce eldeki liste çizilip "okundu" isteği gider, hemen ardından
  yoklama başlar. Sunucu "okundu"yu önce işlerse, son yoklamadan beri gelmiş yeni bildirimler de okundu sayılır ve
  panelde "yeni" vurgusu olmadan görünür. Kod okumasına göre; denenmedi.
- **Takılan istek yoklamayı durdurur.** Aynı anda tek yoklama kuralı (`S._bildirimYoklaniyor`) istek bitene kadar yenisini
  engeller; `fetch`'in zaman aşımı yoktur. Bağlantı asılı kalırsa (telefonda ağ değişimi) tarayıcı isteği bitirene kadar o
  sekmede rozet tazelenmez.
- **Rol değişiminde süren yoklama yeni oturuma yazılabilir.** `oturumDurumunuSifirla` sürümü ve listeyi siler ama
  `S._bildirimYoklaniyor`'u sıfırlamaz: o sırada eski rolün yoklaması sürüyorsa yeni oturumun ilk yoklaması atlanır ve
  eski rolün cevabı (rozet, liste) yeni oturumun ekranına yazılır. Bir sonraki yoklamada sürüm tutmayacağı için düzelir.
  Kod okumasına göre.
- **Panel, menüden sayfa değiştirince kapanmaz.** `25-tiklama.js` paneli yalnız `data-act` ya da `data-nav` taşımayan bir
  yere basılınca boşaltır; sol menüdeki bir maddeye (`data-nav`) ya da başka bir düğmeye basmak paneli açık bırakır.
  Bildirim satırına basmak (`bildirim-git`) ve zile yeniden basmak kapatır. Kod okumasına göre.
- **Bildirim satırı klavyeyle açılmaz.** Satırlar `role="button"` ve `tabindex="0"` ile odak alır ama Enter/Boşluk'u
  dinleyen bir işleyici yok (tıklama dağıtıcısı yalnız `click`'e bakar).
- **Yalnız uygulama içi bağlantılar tıklanır.** `adrestenParca` yalnız `#/sayfa` ya da `#/sayfa?c=<kimlik>` biçimini kabul
  eder; başka bir bağlantı (dış adres, `javascript:`) taşıyan bildirim düz metin kalır. Bilerek böyle: bildirim metni ve
  bağlantısı sunucudan gelse de sayfayı başka yere götüremez.
- **Aralık değişikliği herkese hemen geçmez.** Yönetici ayarı değiştirince yalnız kendi sekmesi hemen uyar; öbür kişiler
  yeni aralığı girişte, `/me`'de ya da sayfa yeniden yüklenince `/site`'tan alır.
- **Arama yalnız işaretli öğelerde çalışır.** Sayfada `data-ara`'lı öğe yoksa kutu hiçbir şey yapmaz (ileti de çıkmaz).
  Gizlenen satırın kartı ve başlıktaki sayı ("Sınıf listesi (12)") değişmez. Pencereler (`#modalKok`) süzülmez. "Sonuç
  bulunamadı" kutusu sayfanın EN SONUNA, alt bilginin altına eklenir ve metni sadeleştirilmiş hâliyle gösterir
  ("ÖĞRETMEN" yazana "ogretmen"). `git()` kutuyu boşaltır; yenile düğmesi (`sayfayiYenile`) korur ve `yaz()` aramayı
  yeniden uygular.
- **Dar ekranda `aria-expanded` güncellenmez.** Yalnız masaüstü daraltması `#hamburger`'in durumunu yazar; telefonda menü
  açıkken ekran okuyucu bunu bilmez.
- **Tercihler tarayıcıya özel.** `ee_menu` (menü daraltma) yalnız bu tarayıcıda ve yalnız masaüstünde uygulanır; gizli
  sekmede yazılamazsa her açılışta menü açık gelir.

## Testleri

- `testler/test-bildirim.js` — 5) bildirim yoklaması: ilk yoklamada liste ve sürüm geliyor; değişiklik yoksa liste
  gönderilmiyor (`ayni: true`); `notifications/read` sonrası sürüm değişiyor, liste yeniden geliyor, `unread` 0. 6) velinin
  bildirim bağlantısı `#/veli-odevler?c=<öğrenci>` (bu dosyanın `bildirim-git`'i o çocuğu seçtirir).
- `testler/test-site-ayarlari.js` — `bildirimAralikDk`'nın config dosyasından okunması ve sınır dışı değerin yok
  sayılması; varsayılan 5 ve sınırlar 1–30; yöneticinin kaydettiği aralığın `/api/me` ve `/api/site` cevaplarına geçmesi;
  çevrimiçi sayma süresinin en az "aralık + 1" olması; 0, 31, 2,5 ya da harf gibi bozuk aralıkların reddi.
  `testler/test-etut.js` — `/site` cevabında `bildirimAralikDk` tam sayı; `testler/girdi-denetimi.js` — site ayarı
  anahtarlarına bozuk değer.
- Bildirim metinlerini `GET /api/notifications` ile okuyan pek çok paket (ör. `test-siniflarim`, `test-yetiskin`,
  `test-aile`, `test-quiz`) yoklama ucunu dolaylı olarak dener.
- `testler/buton-denetimi.js` — `bildirim-git` eyleminin karşılığı.
- Bu dosyanın tarayıcıda çalışan testi yok.
- Elle (sunucu 3200'de): iki sekmede iki hesap aç; birinden öbürüne mesaj gönder; alıcının sekmesini arka plana alıp öne
  getir → rozet hemen artar; zile bas → rozet kaybolur, satıra bas → Mesajlar açılır. Bir sayfada arama kutusuna
  olmayan bir şey yaz → en altta "… için sonuç bulunamadı.". Pencereyi 860 pikselin altına daralt → ☰ kayan menüyü açar.

## Son durum

- `git log`: 8 commit. Dosya 2026-09-25'te parça parça kuruldu: `1421112 commit 246` (`bildirimleriYenile` — o zaman 30
  saniyelik yoklama — ve `visibilitychange`), `3918dcc commit 247` (`bildirim-git`, `bildirimPaneliAcKapa`, okundu
  işareti), `c9294bb commit 248` (`araUygula`), `c28dfb2 commit 249` (`sidebarAc`, `sidebarKapat`, `masaustuMu`,
  `menuDurumYaz`), `9d40f2d commit 250` (`masaustuDaralt`), `9709271 commit 251` (`menuDurumOku`).
- `0acca75 commit 516` (2026-09-27, portallar): yeni bildirim gelince (ilk yoklama değilse) `portallariTazele()`.
- Son değişiklik `276c0a0 commit 521` (2026-09-27, gizli /admin + site ayarları): yoklama sabit 30 saniye yerine sitenin
  ayarıyla (`bildirimAraligiAl`, `bildirimSayaciKur`; varsayılan 5 dakika); aynı anda tek yoklama (`S._bildirimYoklaniyor`)
  ve "bu arada çıkış yapıldı" denetimi; panel çizimi `bildirimPaneliCiz`'e ayrıldı, panel açılınca hemen yoklama, açık
  paneli yeni bildirimle tazeleme. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): zili açınca her şeyin okundu sayılması ve okundu/yoklama yarışı, takılan isteğin
  yoklamayı durdurması, rol değişiminde süren yoklamanın yeni oturuma yazılabilmesi, panelin menüden sayfa değişince
  kapanmaması, klavyeyle açılmayan satırlar, telefonda `aria-expanded`.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Mesaj ayarları …" (iş 8, istek denetimi eki): bildirim paneli SEKMELER hâlinde — Tümü · Ödev · Sınav · Devamsızlık ·
    Mesaj · Duyuru · Servis (kapalı bölümün sekmesi görünmez, sekmede okunmamış sayısı), "Tümünü okundu say", tarih
    "25 Eylül 2026 Cuma 15:57" biçiminde; sunucuda bildirimlere `tur` sütunu; sürümlü yoklama ve küçük "değişmedi" cevabı
    korunacak. Bugün "panel açılınca hepsi okundu" kuralı bu işte değişebilir.
  - "Üst şerit sadeleştirme" (iş 29, öneri): şerit ☰ · ⌂ · arama · + Ekle · TR ▾ · tema · zil · profil; dar ekranda
    şeritte yalnız ☰ · ⌂ · zil · profil, dil/tema/+ Ekle/"Ana siteye dön" menüye. Aynı tanıma 1 Ekim'de eklenen önizleme
    çözümü (onay bekliyor): telefon sınırı 1100 px'e çıkar (bugünkü `masaustuMu` 860), kayan menü Esc ile de kapanır,
    üst şerit aşağı kaydırınca gizlenir — kabul edilirse `masaustuMu`, `sidebarAc`/`sidebarKapat` ve `07-mobil.css` /
    `08-menu-filtre.css`'teki 860/861 sınırı birlikte değişir. Tanımdaki "çıkıştan sonra ileri/geri tuşu hesaba
    sokmasın" kuralı bu dosyanın değil `25-tiklama.js`'teki `hashchange` işleyicisinin işidir.
  - "Arayüz önizlemesi" (iş 31): kullanıcının seçeceği tasarım dili yan menüyü ve bildirim panelini de yeniden
    biçimlendirecek.
  - "Optimizasyon + saklama süreleri" (iş 7): bildirimler 90 gün sonra silinecek (panel listesi kısalır).
  - "Android yerel uygulama" (iş 10): uygulamadaki Bildirimler sayfası aynı sekmeleri kullanacak; "Çok dil" (iş 22):
    arama sadeleştirmesi (`nrm`) ve ekran metinleri dil kataloğuyla birlikte düşünülmeli.
