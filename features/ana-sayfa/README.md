# Ana sayfa

Girişten sonra ilk açılan, her rolde başka olan sayfa. Bugünkü kodda öğrenci, veli, öğretmen ve müdür ana sayfasında büyük
"EĞİTİM EVİNE HOŞ GELDİNİZ" başlığı, adınla bir karşılama satırı ("Merhaba Elif, bugün ne öğreneceksin?"), rolün bölümlerine
giden renkli kutucuklar (aktif ödev, sınav grubu, bağlı çocuk, öğretmen sayısı gibi kısa durumlarıyla) ve rolüne göre bir liste
ya da kart görürsün: öğrencide ödev serisi şeridi ve "Yaklaşan ödevler", velide çocuklarının ilk 6 aktif ödevi, öğretmende
"Sınıfım · Aktif ödev · Sonuçlanan ödev" sayaçları ve aktif ödevleri, müdürde okulun sayıları, "Okulun dosya alanı" kartı ve
yeni okula "nereden başlarım" ipucu. Servisçinin ana sayfası servis yoklamasının kendisidir; sistem yöneticisininki gizli yönetim
adresindeki kutucuklar ve site sayaçlarıdır. Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek
olarak: başlık bugünün tarihi ve altında günün tek satırlık özeti ("7-A · bugün 2 ödevin var · şu an 3. ders: Matematik"),
kutucukların hepsi aynı boyda ve alt yazıları günün durumunu söyler, Ayarlar kutucuğu kalkar, Mesajlar her rolde kutucuk olur,
altında iki sütun durur (öğrencide "Yaklaşan ödevler" / "Bugünkü dersler", velide "Bugün olanlar" / "Yaklaşanlar", öğretmende
"Kontrol bekleyen ödevler" / "Bugünkü derslerin", müdürde "Bugün dikkat" / okulun o günkü dersleri ve "Gün seç"); velide her
çocuğun ayrı oturumu ve ayrı ana sayfası olur; öğretmenin "Yoklama" kutucuğu alınmamış ders sayısını gösterir, basınca Ders
programım açılır ve şu anki dersin yoklaması üstünde gelir (menüdeki ayrı "Yoklama" kalkar; 3 Ekim kararı); müdürün ana
sayfasında ödev ve "Kendi derslerim" yoktur; servisçiye "Bugünkü seferler" ve "Gelmeyecekler"li ayrı bir ana sayfa gelir; rolsüz çalışan "Okul yönetimi sana henüz bir görev vermedi." der; yöneticinin ilk ekranı /panel/admin'in "Okullar"
gezgini olur.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) | Karşılama, ödev serisi şeridi, dört (tasarımda altı) kutucuk, "Yaklaşan ödevler"; tasarımda "Bugünkü dersler" ve dershane oturumunun ana sayfası | Kodda var; tasarımda ek olarak tarihli başlık, günün özeti, iki sütun, dershane ana sayfası |
| [Velinin ana sayfası](veli-ana-sayfasi.md) | Altı kutucuk, çocukların ilk 6 aktif ödevi; tasarımda çocuk başına ana sayfa, "Bugün olanlar", "Yaklaşanlar" | Kodda var; tasarımda ek olarak her çocuk ayrı oturum, Servis ve telefon kutucukları |
| [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) | Dört kutucuk, üç sayaç, "Aktif ödevler" ("Sonuçlandır", "Sil"); tasarımda "Kontrol bekleyen ödevler", "Bugünkü derslerin" | Kodda var; tasarımda ek olarak yoklama kutucuğu ders programına gider, altı kutucuk |
| [Müdürün ana sayfası](mudur-ana-sayfasi.md) | Yedi kutucuk, üç sayaç, "Okulun dosya alanı", yeni okul ipucu; tasarımda "Bugün dikkat", "Bugünün dersleri" ve "Gün seç" | Kodda var; tasarımda ek olarak ödevsiz ve "Kendi derslerim"siz yeni düzen, e-posta şeridi |
| [Servisçinin ana sayfası](servisci-ana-sayfasi.md) | Bugün ana sayfa = Yoklama; tasarımda ayrı ana sayfa: dört kutucuk, "Bugünkü seferler", "Gelmeyecekler" | Kodda var; tasarımda ek olarak ayrı ana sayfa |
| [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) | Görev verilmemiş çalışanın boş ekranı ve açık kalan bölümler | Tasarlandı — henüz kodda yok |
| [Sistem yöneticisinin ana sayfası](yonetici-ana-sayfasi.md) | Gizli yönetim adresinde altı kutucuk ve beş site sayacı; tasarımda /panel/admin "Okullar" | Kodda var; tasarımda ek olarak panelin okul gezgini |
| [Renkli kutucuklar](kutucuklar.md) | Kutucuğun görünüşü, ızgara, renkler, sayı rozeti, kapalı bölüm; rol rol kutucuk listeleri | Kodda var; tasarımda ek olarak aynı boy, sütun kuralı, canlı alt yazılar |

Not: "Sistem yöneticisinin ana sayfası" plan listesinde yoktu; kodda olduğu için bu klasöre eklendi.

Okuma sırası:

- **Öğrenci:** [Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) → [Kutucuklar](kutucuklar.md).
- **Veli:** [Velinin ana sayfası](veli-ana-sayfasi.md) → [Kutucuklar](kutucuklar.md).
- **Öğretmen:** [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) → [Kutucuklar](kutucuklar.md) → (veliysen)
  [Velinin ana sayfası](veli-ana-sayfasi.md).
- **Çalışan:** [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) → (görev verilince) [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md).
- **Müdür:** [Müdürün ana sayfası](mudur-ana-sayfasi.md) → [Kutucuklar](kutucuklar.md).
- **Servisçi:** [Servisçinin ana sayfası](servisci-ana-sayfasi.md).
- **Yönetici:** [Sistem yöneticisinin ana sayfası](yonetici-ana-sayfasi.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı ya da gördüğü (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Öğrencinin ana sayfası | [kendi ana sayfasını görür; seriyi, ödevleri, tasarımda bugünkü derslerini](ogrenci-ana-sayfasi.md) | — | — | — | — | — | — | — |
| Velinin ana sayfası | — | [çocuklarının (tasarımda o oturumdaki çocuğun) durumunu görür](veli-ana-sayfasi.md) | [veliyse veli portalına (tasarımda çocuğun oturumuna) geçince görür](veli-ana-sayfasi.md) | [veliyse veli portalına (tasarımda çocuğun oturumuna) geçince görür](veli-ana-sayfasi.md) | [veliyse veli portalına (tasarımda çocuğun oturumuna) geçince görür](veli-ana-sayfasi.md) | — | — | — |
| Öğretmenin ana sayfası | — | — | [kendi ana sayfasını görür; aktif ödevleri sonuçlandırır, siler; tasarımda yoklamaya geçer](ogretmen-ana-sayfasi.md) | [bugün ek rollü öğretmen aynısını görür; tasarımda Öğretmen görevi verilince](ogretmen-ana-sayfasi.md) | — | — | — | — |
| Müdürün ana sayfası | — | — | — | — | [okulun sayılarını, dosya alanını görür; tasarımda "Bugün dikkat" ve okulun günlük derslerini, "Gün seç"](mudur-ana-sayfasi.md) | — | — | — |
| Servisçinin ana sayfası | — | — | — | — | — | [bugün doğrudan Yoklama; tasarımda seferler ve gelmeyecekler özeti](servisci-ana-sayfasi.md) | — | — |
| Rolsüz çalışanın ana sayfası | — | — | — | [görev beklerken boş ekranı görür (tasarım)](calisan-ana-sayfasi.md) | [görmez; Çalışanlar'dan görev verir](calisan-ana-sayfasi.md) | — | — | — |
| Sistem yöneticisinin ana sayfası | — | — | — | — | — | — | [site sayaçlarını ve yönetim kutucuklarını görür; tasarımda /panel/admin "Okullar"](yonetici-ana-sayfasi.md) | — |
| Renkli kutucuklar | [4 kutucuk; tasarımda 6](kutucuklar.md) | [6 kutucuk; tasarımda çocuk başına 6](kutucuklar.md) | [4 kutucuk; tasarımda 6](kutucuklar.md) | [bugün öğretmeninkiler; rolsüzde kutucuk yok](kutucuklar.md) | [7 kutucuk; tasarımda başka 7](kutucuklar.md) | [bugün yok; tasarımda 4](kutucuklar.md) | [6 kutucuk](kutucuklar.md) | — |

Notlar:

- **Ziyaretçi** (giriş yapmamış kişi) portal ana sayfası görmez; onun "ana sayfası" sitenin açılışıdır
  ([Açılış sayfası](../acilis-sayfasi/acilis.md)). Kullanıcı 2 Ekim'de "ana sayfayı direk gerçektekini yap" dediğinde kastedilen
  oydu; bu klasör girişten sonraki sayfayı anlatır.
- **Henüz hiçbir okula ya da çocuğa bağlı olmayan yetişkin** ve **birden çok oturumu olan yetişkin** girişte okul ana sayfası
  yerine hesabın kendi sayfasını görür ("Henüz bir portalın yok" ya da portal kartları): [Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md),
  [Portal seçme ekranı](../portallar/portal-secme-ekrani.md). Tasarımda (kullanıcının 3 Ekim kararları) "portal" kelimesi
  kalkar, yerine "oturum" gelir: oturum ekranı iki adımdır ("Hesabını seç", sonra o hesabın oturumları); bir oturuma basınca o
  oturumun ana sayfası açılır, "Oturum değiştir" ile başkasına geçilir.
- **Çalışan** sütunu: bugünkü kodda okulda her çalışan öğretmen hesabıdır; ek rol (Müdür Yardımcısı, Rehber Öğretmen…) ana
  sayfayı değiştirmez. Tasarımda kişi önce rolsüz çalışan olur.
- **Tasarımdaki öbür hesaplar:** eğitmenin ilk ekranı eğitmen panelidir; onun ana sayfasında da beş renkli kutucuk, "Son
  videoların" ve "Dikkat" durur ([Eğitmen paneli](../egitim-icerikleri/egitmen-paneli.md), [Kutucuklar](kutucuklar.md)),
  tahta hesabınınki sınıf seçmedir ([Sınıf seçme](../tahta/sinif-secme.md)), destek ekibininki /panel/destek'tir
  ([Paneller](../yonetim/paneller.md)).
- **Her rolün ana sayfasında ortak (tasarım):** uygulamayı kurmamış kişiye bir kez "Eğitim Evi'ni telefonuna kur" kartı
  ([Telefonuna kur kartı](../uygulama/telefonuna-kur-karti.md)), bildirim izni sorulmamışsa "Bildirimlere izin ver" şeridi
  ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)), başlığın önünde "Yenile" ([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)),
  tanımda eğitim içerikleri öneri şeridi ([Ana sayfadaki öneri şeridi](../egitim-icerikleri/ana-sayfa-seridi.md)).
  Tanımda ayrıca her sayfanın (ana sayfa da) üstünde iki şerit: "Önemli" etiketli mesaj ya da duyurunun kapatılana kadar
  duran şeridi (kullanıcının 3 Ekim kararı; [Önemli etiketi](../mesaj/onemli-etiketi.md)) ve yöneticinin site geneli duyurusu
  ([Site geneli duyuru](../yonetim/site-duyurusu.md)).
- **Okulda bir bölüm kapalıysa** o bölümün kutucuğu bütün rollerin ana sayfasından kalkar ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Açılış sayfası](../acilis-sayfasi/README.md) — giriş yapmamış kişinin gördüğü sitenin ana sayfası.
- [Portallar](../portallar/README.md) — portal dışındaki ana sayfa, portal seçme ekranı, velide her çocuk ayrı oturum, öğrencide okul ve dershane.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — menüdeki "Ana Sayfa", ev (⌂) düğmesi, profil menüsü, "Yenile".
- [Ödevler](../odev/README.md) — "Yaklaşan ödevler", "Aktif ödevler", ödev serisi, "Kontrol bekleyen ödevler".
- [Sınavlar](../sinav/README.md), [İlerleyiş](../ilerleyis/README.md) — Sınavlarım ve İlerleyişim kutucukları, ortalama.
- [Devamsızlık ve yoklama](../devamsizlik/README.md) — öğretmenin "Yoklama" kutucuğu, müdürün "Bugün dikkat"i.
- [Ders programı](../ders-programi/README.md) — "Bugünkü dersler", müdürün "Bugünün dersleri".
- [Mesajlar ve duyurular](../mesaj/README.md) — tasarımdaki Mesajlar kutucuğu.
- [Servis](../servis/README.md) — servisçinin Yoklama'sı, velinin Servis kutucuğu, "Gelmeyecekler".
- [Eğitim Evi Aile](../aile/README.md) — velinin "<çocuk>'in telefonu" kutucuğu.
- [Takvim ve ajanda](../takvim/README.md), [Hatırlatıcılar](../hatirlatici/README.md), [Toplantılar](../toplanti/README.md) — "Yaklaşanlar".
- [Okul dosya alanı](../okul-disk/README.md) — müdürün "Okulun dosya alanı" kartı.
- [Okulun özellikleri](../ozellikler/README.md) — kapalı bölüm kutucukları.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — rolsüz çalışan, "başvuru bekliyor".
- [Hesap ayarları](../ayarlar/README.md) — "E-posta eklemek ister misin?", Ayarlar kutucuğu.
- [Eğitim yılı](../egitim-yili/README.md) — sayfanın üstündeki yıl seçici, mezunun ana sayfası.
- [Uygulama](../uygulama/README.md) — "telefonuna kur" kartı; Android uygulamasının rol rol ana sayfaları.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — ana sayfadaki öneri şeridi, eğitmen paneli.
- [Site yönetimi](../yonetim/README.md) — yöneticinin paneli ve okul gezgini.
- [Tahta](../tahta/README.md) — tahta hesabının sınıf seçme ekranı.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) (`SAYFALAR.ana`: her rolün kolu,
  `stat`, `genelOrtalama`), [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`hero`,
  `kutucuklar`, `bosKutu`, `yaz`), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menüler,
  `sayfaAcik`), [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) (portal dışındaki ana sayfa),
  [public/js/parcalar/08d-okul-disk.md](../../public/js/parcalar/08d-okul-disk.md) (müdürün disk kartı),
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (seri şeridi, öğrencinin ödev listesi),
  [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (öğretmenin ödev listesi),
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (velinin ödev listesi, çocuklar),
  [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) (servisçinin ana sayfası),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (açılışta hangi sayfa),
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (yöneticinin ana sayfası).
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`/api/progress`),
  [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) (`/api/parent/children`),
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`/api/assignments`),
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`/api/school/ozet`),
  [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) (`/api/servis/yoklama`),
  [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md) (`/api/admin/overview`).
- Görünüm: `public/css/parcalar/10-ana-sayfa-kutucuklari.css` ve öbürleri — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/buton-denetimi.md](../../testler/buton-denetimi.md), [testler/test-okul-agi.md](../../testler/test-okul-agi.md),
  [testler/test-okul-disk.md](../../testler/test-okul-disk.md), [testler/test-yetiskin.md](../../testler/test-yetiskin.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ödev serisi", "Okulun özellikleri", "Servisçinin
  Yoklama sayfası", "Portallar").
