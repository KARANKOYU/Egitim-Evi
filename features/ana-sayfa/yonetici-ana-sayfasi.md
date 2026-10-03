# Ana sayfa · Sistem yöneticisinin ana sayfası

**Durum:** Kodda var; tasarımda ek olarak yöneticinin ilk ekranı ayrı yönetim panelinin (/panel/admin) "Okullar" bölümü olur: her okulun bir dosya simgesi olduğu "boş masaüstü" görünümlü okul gezgini (Tasarım 1 önizlemesi; paneller tanımı).

Sistem yöneticisinin gizli yönetim adresinden girince gördüğü sayfa: sitenin bütününe giden kutucuklar ve okul, müdür, öğretmen,
öğrenci, veli sayıları.

## Ne işe yarar

Sistem yöneticisi okulları açar, müdürleri görür, site ayarlarını ve yedekleri yönetir; ana sayfası bu işlere kısayol ve
sitenin büyüklüğünün özetidir. Yöneticinin ekranları herkese giden sayfada yoktur; yalnız yönetici çereziyle inen ayrı
pakette bulunur (gizli yönetim adresi).

## Nereden açılır

- **Girişten sonra kendiliğinden.** Yönetici herkes gibi girer (iki adımlı); giriş bitince sunucu yönetim çerezini yazar ve sayfa
  tam yüklemeyle yönetim adresine (`/admin`) geçer; oturumu açık yönetici sitenin kökünü açınca da oraya geçer. Yönetim
  adresinde oturum yoksa açılış sayfası değil doğrudan giriş kartı çıkar ([Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md)).
- Sol menünün ilk satırı **"Ana Sayfa"**. Yöneticinin menüsü: **Ana Sayfa**, **Müdürler**, **Okullar**, **Yorumlar**,
  **Hatırlatıcılar**; **"Site"** başlığı altında **Site Ayarları**, **Yönetici Dosyası**, **Yedekleme**, **İşlem Kaydı**.
- **Tasarımda:** oturum ekranında yöneticinin kartı **"Site yöneticisi"** · "Eğitim Evi · yönetim paneli"; basınca
  **/panel/admin** açılır ve ilk bölüm **"Okullar"**dır. Sitenin alt bilgisinde yalnız yönetici ve destek ekibine görünen bir
  **"Yönetim"** düğmesi vardır; kendiliğinden panele yönlendirme yoktur ([Paneller](../yonetim/paneller.md)).

## Adım adım

### Sistem yöneticisi

**Bugünkü kodda:**

1. Başlık **"EĞİTİM EVİNE HOŞ GELDİNİZ"**, altında **"Merhaba Ali, sistem yöneticisi panelindesin."** (adının ilk kelimesi).
2. Altı renkli kutucuk ([Kutucuklar](kutucuklar.md)):

   | Kutucuk | Renk | Alt yazı | Bastığında |
   |---|---|---|---|
   | **Okullar** | lacivert | "12 okul kayıtlı · Okul aç" | [Okul açma](../yonetim/okul-acma.md) |
   | **Müdürler** | yeşil | "14 müdür" | [Müdürler](../yonetim/mudurler.md) |
   | **Site Ayarları** | mor | "İletişim, yapımcılar, okul adresleri" | [Site ayarları](../yonetim/site-ayarlari.md) |
   | **Yönetici Dosyası** | turuncu | "admins.json" | [Yönetici dosyası](../yonetim/yonetici-dosyasi.md) |
   | **Yedekleme** | camgöbeği | "Veri kopyaları" | [Site yedekleri](../yonetim/yedekler.md) |
   | **Ayarlar** | gri | "Yönetici hesabın" | [Ayarlar](../ayarlar/hesap-ayarlari-sayfasi.md) |

   Kutucuklarda sayı rozeti yoktur.
3. Altında beş sayaç: **"Okul"**, **"Müdür"**, **"Öğretmen"**, **"Öğrenci"**, **"Veli"** (sitenin bütünü).
4. Yönetici, yönetim paketi yüklenmeden herkese giden sayfayı açarsa (ör. başka sekmede kalmış bir adres) menüde yalnız
   "Ana Sayfa" durur ve ana sayfada kilit simgesiyle **"Bu hesabın ekranları bu adreste açılmıyor. Sayfayı yenile."** yazar.
   Normalde girişte ve sayfa yenilenince zaten yönetim adresine geçirilir.
5. Yönetim adresinde yönetici olmayan bir oturum açıksa (aynı tarayıcının başka sekmesinden kalan anahtar) sitenin köküne
   gönderilirsin.

**Tasarımda (Tasarım 1 önizlemesi; /panel/admin):**

1. Panelin solunda bölümler: **Okullar**, **Kullanıcılar**, **Destek talepleri**, **Site ayarları**, **Duyuru koy**, **Çeviri**
   (destek ekibinin panelinde /panel/destek yalnız ilk üçü).
2. İlk açılan bölüm **"Okullar"**: başlığın altında **"Her okul bir dosya, klasörler yalnız bu panelin düzeni (okula, müdüre,
   adrese etkisi yok). Sürükleyip istediğin yere bırak; boş yere ya da bir okula sağ tıkla."** Altında boş masaüstü gibi bir
   gezgin (yol çubuğu, okul simgeleri, klasörler, durum satırı) ve en altta **"Okul aç: okulu seç, adresini ver, müdürünü kişi
   koduyla ekle."** ipucuyla **"Okul ekle"** düğmesi ([Okul gezgini](../yonetim/okul-gezgini.md),
   [Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md)).
3. Bugünkü ana sayfanın kutucukları ve sayaçları panelde yoktur; okul sayıları ve diskler okulların simgelerinde ve durum
   satırında görünür.
4. Yetkisi olmayan (giriş yapmamış ya da başka hesap açık) panel adresinde sitenin **"Sayfa bulunamadı"** sayfasını görür.

## Kurallar ve sınırlar

- **Veri:** `GET /api/admin/overview` → sayılar (`okul`, `mudur`, `ogretmen`, `ogrenci`, `veli`), her okulun özeti ve sistem
  geneli disk. Aynı uç yönetim panelinin Okullar ekranını da besler.
- **Yalnız yönetici:** yönetim ekranları ve uç adları herkese giden pakette yoktur; uçlar yönetici çerezi ister.
- Kutucuklar bir okul bölümüne bağlı olmadığı için hiçbiri "kapalı bölüm" yüzünden düşmez.

## Kardeşler ve ilgili

**Kardeşler:** [Kutucuklar](kutucuklar.md) · [Müdürün ana sayfası](mudur-ana-sayfasi.md) ·
[Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) · [Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) ·
[Velinin ana sayfası](veli-ana-sayfasi.md) · [Servisçinin ana sayfası](servisci-ana-sayfasi.md) ·
[Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md). Klasör: [Ana sayfa](README.md).

**İlgili:**

- [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md), [Paneller](../yonetim/paneller.md),
  [Okul gezgini](../yonetim/okul-gezgini.md), [Okul açma](../yonetim/okul-acma.md), [Müdürler](../yonetim/mudurler.md),
  [Site ayarları](../yonetim/site-ayarlari.md), [Yönetici dosyası](../yonetim/yonetici-dosyasi.md), [Site yedekleri](../yonetim/yedekler.md).
- [Okulun dosya alanı](../okul-disk/doluluk.md), [Disk sınırı](../okul-disk/disk-siniri.md).
- [İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md), [Yorumlar bölümü](../yorumlar/yorumlar-bolumu.md).
- Rol kapısı: [Yönetici](../roller/yonetici.md).

## Kod tarafı

- Ön yüz (yönetim paketi): [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) —
  `YONETIM.menu`, `YONETIM.anaSayfa`, `disariMi`; [public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) —
  Okullar ve Müdürler ekranları.
- Ortak parça: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — `SAYFALAR.ana` yöneticide
  `YONETIM.anaSayfa`'ya devreder, paket yoksa kilitli kutu; [public/js/parcalar/00-durum.md](../../public/js/parcalar/00-durum.md) —
  `YONETIM` kancası.
- Sunucu: [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md) (`GET /api/admin/overview`).
- Testler: [testler/test-yonetici-dosyasi.md](../../testler/test-yonetici-dosyasi.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).

## Sık sorulanlar

- **Ana sayfada "Bu hesabın ekranları bu adreste açılmıyor" yazıyor.** Yönetici ekranları ayrı pakettedir; sayfayı yenile ya da
  gizli yönetim adresinden gir.
- **Sayaçlar neyi sayar?** Bütün siteyi tek sorguda: "Okul" onaylı okulları, "Müdür" ve "Öğretmen" onaylı müdür ve öğretmen
  satırlarını (iki okulda öğretmen olan kişi iki kez sayılır), "Öğrenci" öğrenci hesaplarını, "Veli" veli rolündeki hesapları
  (hiç çocuğu ya da okulu olmayan yetişkin hesabı sayılmaz).

## Sırada

- "Paneller" (iş 5): /panel/admin ve /panel/destek, okul gezgini, alt bilgideki "Yönetim" düğmesi — yöneticinin ilk ekranı
  bugünkü ana sayfanın yerine panelin "Okullar"ı olur.
- "Sistem" (iş 4): yöneticiye zorunlu doğrulama uygulaması, sistem durumu (panelde).
