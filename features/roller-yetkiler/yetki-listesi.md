# Roller ve yetkiler · Yetki listesi

**Durum:** Kodda var; tasarımda ek olarak yetkiler 10 grupta yeniden düzenlenir, kısa adlar alır ve yeni yetkiler gelir ("Başarı
ekler", "Okula çalışan ekler", "Sınav grubu açar", "Anket açar", "Mesaj şablonlarını düzenler", "Toplantı açar", "Tahta
hesapları", "Okul simgesi", "Okul cihazları", "Bölümleri açar, kapatır", "Görünümü (CSS) düzenler" ve dört eklenti yetkisi).

Bir role konabilen bütün yetkiler: ekrandaki adları, açıklamaları, daraltılıp daraltılamadıkları ve açtıkları bölümler.

## Ne işe yarar

Rol penceresinde kutu kutu gördüğün her satır bir **yetkidir**: tek bir iş yapma hakkı ("Ödev verir", "Öğrenci şifresi
sıfırlar"…). Bu belge hangi yetkinin ne açtığını bir arada gösterir; rol kurarken neyi işaretleyeceğini seçmen için.

Müdür bütün yetkilere sahiptir ve bu değiştirilemez — okulda her şeyi yapabilen en az bir kişi kalmalı. Yetkiler öğretmenlere
(tasarımda çalışanlara) roller aracılığıyla verilir ([Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md)).

## Nereden açılır

- **Müdür:** **"Roller ve Yetkiler"** → **"Rol oluştur"** ya da bir rolün **"Düzenle"**si → pencerede grup grup yetki kutuları
  ([Rol ekle / düzenle](rol-duzenleyici.md)). Hazır Öğretmen rolünün penceresinde de aynı liste vardır.
- Rol listesinde her rolün yetkileri etiket etiket yazar ([Roller ve yetkiler ekranı](roller-ekrani.md)).
- Tasarımda: aynı pencerede "Yetkiler" başlığı, "Yetki ara" kutusu ve açılıp kapanan 10 grup.

## Adım adım

### Müdür

**Bugünkü yetkiler** (rol penceresinde bu sırayla). "Daraltma" sütunu: yetkinin altında hangi kutuların açıldığı
([Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md)). "Hazır": hazır Öğretmen rolünde ilk açık gelenler. "Açtığı": yetkiyi
taşıyan öğretmenin menüsünde ya da ekranında ne değiştiği.

**Ders ve program**

| Yetki (ekrandaki adı) | Açıklama (ekranda) | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Derse öğretmen olarak atanabilir" | "Hangi derslere atanabileceğini seç." | Dersler | evet | sınıfın derslerine öğretmen seçilirken listede çıkar ([Ders atama](../siniflar-dersler/ders-atama.md)) |
| "Ders programını düzenler" | — | Sınıflar | — | menü "Ders Programı" ([Program kurma](../ders-programi/program-kurma.md)) |
| "Sınıfa ders ekler ve çıkarır" | — | Sınıflar | — | menü "Sınıflar" (sayfa sınıf listesini "Sınıf açar ve siler" ile çektiği için bu yetki tek başına sayfayı açmaz) |
| "Derse öğretmen atar" | — | Dersler, Sınıflar | — | sınıfın sayfasında dersin öğretmenini seçme |

**Sınıf ve öğrenci**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Sınıf açar ve siler" | — | — | — | menü "Sınıflar" ([Sınıf açma](../siniflar-dersler/sinif-acma.md)) |
| "Öğrenciyi sınıfa yerleştirir" | — | Sınıflar | — | öğrencinin sınıfını değiştirme |
| "Öğrenci hesabı açar ve okula öğrenci ekler" | — | — | — | menü "Okul Öğrencileri" ([Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md)) |
| "Öğrenci bilgilerini düzenler" | — | — | — | menü "Okul Öğrencileri" ([Hesap penceresi](../hesaplar/hesap-penceresi.md)) |
| "Öğrenci şifresi sıfırlar" | "Hassas yetki — dikkatli ver." | — | — | hesap penceresindeki şifre işlemleri, toplu giriş bilgisi ([Şifre işlemleri](../hesaplar/sifre-islemleri.md), [Giriş bilgisi dağıt](../hesaplar/toplu-giris-bilgisi.md)) |
| "Öğrenci portalına girer" | "Öğrencinin gördüğü ekranı birebir açar." | — | — | menü "Okul Öğrencileri" (dar liste: ad, sınıf, okul no) ve öğrencinin portalını açma ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)) |

**Öğretmenler**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Okula öğretmen ekler, başvuru onaylar" | — | — | — | menü "Öğretmenler" ([Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md)) |
| "Öğretmen bilgisi ve branşını düzenler" | — | — | — | menü "Öğretmenler" |
| "Öğretmeni okuldan çıkarır" | — | — | — | öğretmeni okuldan çıkarma ([Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md)) |

**Ödev ve sınav**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Ödev verir" | — | Dersler, Sınıflar | evet | menü "Ödevler" ([Ödev verme](../odev/odev-verme.md)) |
| "Ödev sonuçlandırır" | — | Dersler | evet | menü "Ödevler" ([Sonuçlandırma](../odev/sonuclandirma.md)) |
| "Sınav oluşturur" | — | Dersler, Sınıflar | evet | menü "Sınavlar" ([Yeni sınav](../sinav/yeni-sinav.md)) |
| "Sınav notu girer" | — | Dersler, Sınıflar | evet | menü "Sınavlar" ([Not girişi](../sinav/not-girisi.md)) |
| "Girdiği sınıfların öğrenci sonuçlarını görür" | "Sınıflarım bölümü: sınıf, öğrenci, verdiği ödevler ve öğrencinin sınav sonuçları." | — | evet | menü "Sınıflarım" ([Sınıflarım](../siniflar-dersler/siniflarim.md)) |

**Devamsızlık**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Yoklama alır" | — | Dersler, Sınıflar | evet | menü "Yoklama" ([Ders yoklaması](../devamsizlik/ders-yoklamasi.md)) |
| "Okulun tüm devamsızlığını görür" | — | — | — | menü "Devamsızlık" ([Okulun devamsızlığı](../devamsizlik/okulun-devamsizligi.md)) |

**Etüt**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" | — | — | — | "Etütler" sayfasında "Etüt aç" ([Etüt açma](../etut/etut-acma.md)) |
| "Bütün etütlerde yoklama alır" | "Etüdün öğretmeni kendi etüdünde bu yetki olmadan da yoklama alır." | — | — | her etütte, geçmiş günler dahil yoklama ([Etüt yoklaması](../etut/etut-yoklamasi.md)) |

**Mesajlaşma**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Sınıfa veya gruba toplu mesaj atar" | — | — | — | yeni mesajda toplu alıcılar ve duyuru; anket açma ([Yeni mesaj](../mesaj/yeni-mesaj.md), [Anket açma](../anket/anket-acma.md)) |
| "Okuldaki herkese mesaj atar" | — | — | — | yeni mesajda "bütün okul" alıcısı |

**Okul hayatı**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Yemek listesini düzenler" | — | — | — | "Yemek Listesi"nde "Bu haftayı düzenle" ([Düzenleme yetkisi](../yemek/duzenleme-yetkisi.md)) |
| "Servisleri ve servis öğrencilerini düzenler" | "Şoför telefonlarını ve öğrencilerin durağını görür." | — | — | menü "Servisler" ([Servisler sayfası](../servis/servisler-sayfasi.md)) |

**Yönetim**

| Yetki | Açıklama | Daraltma | Hazır | Açtığı |
|---|---|---|---|---|
| "Rol oluşturur ve düzenler" | "Bu yetkiyi verdiğin kişi başkalarına yetki dağıtabilir." | — | — | menü "Roller ve Yetkiler" (["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md)) |
| "İşlem kaydını görür" | — | — | — | menü "İşlem Kaydı" ([Görme yetkisi](../islem-kaydi/gorme-yetkisi.md)) |
| "Okul takvimine etkinlik ve tatil ekler" | — | — | — | "Takvim"de "Etkinlik ekle" ([Etkinlik ekleme](../takvim/etkinlik-ekleme.md)) |
| "Eğitim yılı açar ve değiştirir" | "Yeni yıl açınca eski yılın kayıtları arşive düşer." | — | — | menü "Eğitim Yılı" ([Yıl açma](../egitim-yili/yil-acma.md)) |
| "Excel ile içe ve dışa aktarım yapar" | "Öğrenci listesi ve ders programını Excel dosyasıyla toplu işler." | — | — | menü "Excel Aktarım" ([Excel aktarım](../excel-aktarim/README.md)) |
| "Okulun giriş sayfasını düzenler" | "Kapak ve logo fotoğrafı, tanıtım yazısı, renkler ve kısıtlı CSS. Sayfa herkese açıktır." | — | — | menü "Okul Sayfası" ([Okul sayfası](../okul-sayfasi/README.md)) |
| "Okulun haritadaki yerini ayarlar" | "Servis haritasında ve velinin haritasında okul işareti buraya konur. Okulun giriş adresini yine müdür seçer." | — | — | menü "Okulun Konumu" ([Okul konumu](../okul-sayfasi/okul-konumu.md)) |

**Menüde nerede çıkar (bugün):** "Ödevler", "Sınavlar", "Yoklama" ve "Sınıflarım" öğretmen menüsünün ana kısmındadır (yetkisi
yoksa satır hiç çıkmaz). Öbürleri menünün altında, rolün adını taşıyan başlığın altında bu sırayla çıkar: "Sınıflar", "Ders
Programı", "Okul Öğrencileri", "Eğitim Yılı", "Öğretmenler", "Roller ve Yetkiler", "Excel Aktarım", "Devamsızlık", "İşlem Kaydı",
"Servisler", "Okul Sayfası", "Okulun Konumu" ([Sol menü](../menu-ve-arama/sol-menu.md)). Okulun kapattığı bir bölümün satırı yetki
olsa da çıkmaz ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).

**Tasarımda** (Tasarım 1 önizlemesi) yetkiler 10 grupta ve kısa adlarla durur. "Bugün" sütunu bugünkü karşılığıdır; "yeni"
olanlar bugün yoktur. 3 Ekim kararıyla (hesap = kişi, oturum = rol) arayüzde "portal" sözü "oturum" olur; kullanıcı yetki
listesindeki **"Oturumuna bakar"**ın böyle kalmasını onayladı.

| Grup | Yetki (tasarımdaki adı) | Kodu (önizlemede) | Bugün |
|---|---|---|---|
| Ders ve program | "Derse atanabilir" | `ders.atanabilir` | "Derse öğretmen olarak atanabilir" |
| | "Ders programını düzenler" | `program.duzenle` | aynı |
| | "Ders ekler, dersin adını koyar" | `ders.ekle` | yeni (okulun kendi dersi: [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md)); bugünkü "Sınıfa ders ekler ve çıkarır"ı da içerip içermediği önizlemede belirtilmedi |
| | "Sınıfları düzenler" | `sinif.duzenle` | "Sınıf açar ve siler" |
| Öğrenciler | "Sınıflara yerleştirir" | `ogrenci.yerlestir` | "Öğrenciyi sınıfa yerleştirir" |
| | "Hesap açar" | `ogrenci.hesap-ac` | "Öğrenci hesabı açar ve okula öğrenci ekler" |
| | "Bilgilerini düzenler" | `ogrenci.duzenle` | "Öğrenci bilgilerini düzenler" |
| | "Şifresini değiştirir" | `ogrenci.sifre` | "Öğrenci şifresi sıfırlar" |
| | "Oturumuna bakar" | `ogrenci.portal` | "Öğrenci portalına girer" (önizlemenin kodunda "Portalına bakar" yazar; ekranda "Oturumuna bakar" görünür, 3 Ekim kararı) |
| | "Başarı ekler" | `basari.ekle` | yeni ([Başarı ekler yetkisi](../basarilar/basari-ekleme-yetkisi.md)) |
| Öğretmenler ve çalışanlar | "Okula çalışan ekler" | `calisan.ekle` | "Okula öğretmen ekler, başvuru onaylar" (çalışan tanımındaki yeni adı) |
| | "Öğretmeni düzenler" | `ogretmen.duzenle` | "Öğretmen bilgisi ve branşını düzenler" |
| | "Okuldan çıkarır" | `ogretmen.cikar` | "Öğretmeni okuldan çıkarır" |
| | "Sonuçlarını görür" | `ogretmen.sonuc` | "Girdiği sınıfların öğrenci sonuçlarını görür" |
| Ödev, sınav ve not | "Ödev verir" | `odev.ver` | aynı |
| | "Sınav açar" | `sinav.ac` | "Sınav oluşturur" |
| | "Sınav grubu açar" | `sinav.grup` | yeni ([Sınav grupları](../sinav/sinav-gruplari.md)) |
| | "Not girer" | `sinav.not-gir` | "Sınav notu girer" |
| Devamsızlık ve etüt | "Yoklama alır" | `devamsizlik.al` | aynı |
| | "Devamsızlığı görür" | `devamsizlik.gor` | "Okulun tüm devamsızlığını görür" |
| | "Etüt planlar" | `etut.planla` | "Etüt açar; …" ([Boş zaman ızgarası](../etut/bos-zaman-izgarasi.md)) |
| İletişim | "Sınıfa ve gruba toplu mesaj" | `mesaj.toplu` | "Sınıfa veya gruba toplu mesaj atar" |
| | "Bütün okula mesaj" | `mesaj.herkese` | "Okuldaki herkese mesaj atar" |
| | "Anket açar" | `anket.olustur` | yeni; bugün anket açmak toplu mesaj yetkisine bağlı ([Anket oluştur](../anket/anket-olustur.md)) |
| | "Mesaj şablonlarını düzenler" | `mesaj.sablon` | yeni ([Hazır mesaj şablonları](../mesaj/hazir-sablonlar.md)) |
| | "Toplantı açar" | `toplanti.ac` | yeni ([Toplantı açma](../toplanti/toplanti-acma.md)) |
| Okul hayatı | "Yemek listesi" | `yemek.yonet` | "Yemek listesini düzenler" |
| | "Servisler" | `servis.yonet` | "Servisleri ve servis öğrencilerini düzenler" |
| | "Takvim ve etkinlikler" | `takvim.yonet` | "Okul takvimine etkinlik ve tatil ekler" (bugün "Yönetim" grubunda) |
| | "Tahta hesapları" | `tahta.yonet` | yeni ([Tahta hesabı açma](../tahta/tahta-hesabi-acma.md)) |
| Okul | "Okul sayfası (fotoğraf, tanıtım)" | `okul.sayfa` | "Okulun giriş sayfasını düzenler" |
| | "Okul simgesi" | `okul.simge` | yeni ([Okul simgesi](../okul-sayfasi/okul-simgesi.md)) |
| | "Okulun haritadaki yeri" | `okul.konum` | "Okulun haritadaki yerini ayarlar" |
| | "Eğitim yılı ve yıl geçişi" | `egitim-yili` | "Eğitim yılı açar ve değiştirir" (+ [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md)) |
| | "Excel aktarımı" | `aktarim.yap` | "Excel ile içe ve dışa aktarım yapar" |
| | "Okul cihazları" | `okul.cihaz` | yeni; okul cihazı önerisi (kullanıcı "sonra bakarım" dedi) |
| | "Bölümleri açar, kapatır" | `ozellik.yonet` | yeni; bugün yalnız müdür ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)) |
| | "Görünümü (CSS) düzenler" | `okul.css` | yeni; bugün okul sayfası yetkisinin içinde ("kısıtlı CSS") ([Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md)) |
| Yönetim | "Rolleri yönetir" | `rol.yonet` | "Rol oluşturur ve düzenler" |
| | "İşlem kaydını görür" | `islem-kaydi` | aynı |
| Eklentiler | "Eklentileri görür" | `eklenti.gor` | yeni ([Eklentiler](../eklentiler/README.md)) |
| | "Eklenti kurar, kaldırır" | `eklenti.kur` | yeni |
| | "Eklenti yazar" | `eklenti.yaz` | yeni ([Kodlayıcı: deneme ve yayınlama](../eklentiler/kodlayici-deneme-ve-yayinlama.md)) |
| | "Eklenti yayımlar" | `eklenti.yayinla` | yeni |

Toplam 44 yetki. Bugünkü yetkilerden üçü Tasarım 1 listesinde ayrı satır olarak yok: "Derse öğretmen atar", "Ödev sonuçlandırır",
"Bütün etütlerde yoklama alır". Bugünkü "Sınıfa ders ekler ve çıkarır" da listede ayrı durmaz ("Ders ekler, dersin adını koyar"ın
onu da kapsayıp kapsamadığı yazılı değil). Bunların tasarımdaki yeri (başka bir
yetkinin içinde mi, kaldırılıyor mu) önizlemede belirtilmedi (açık nokta). Özel roller tanımında olup önizlemede çizilmeyen iki
yetki daha var: sınıfın uzaktan ders bağlantısını düzenleme ([Uzaktan ders bağlantısı](../toplanti/uzaktan-ders-baglantisi.md)) ve
okul yedeği alma/yükleme ([Okul yedeği](../egitim-yili/okul-yedegi.md)).

Tasarımda her yetkinin altında küçük harflerle kodu yazar; "Yetki ara" hem yetki adında hem grup adında arar
([Rol ekle / düzenle](rol-duzenleyici.md)).

### Öğretmen

Hangi yetkilerin olduğunu ayrı bir sayfada görmezsin; menün söyler. "Ödevler", "Sınavlar", "Yoklama", "Sınıflarım" hazır Öğretmen
rolünden gelir; ek rolün varsa onun açtığı satırlar rolünün adını taşıyan başlığın altında çıkar. Yetkin olmayan bir işi denersen
sunucu **"Bu işlem için yetkin yok"** ya da (daraltılmış yetkide) **"Bu ders ya da sınıf için yetkin yok"** der.

### Çalışan

Ek rolündeki yetkiler yukarıdaki tablodakilerdir; açtıkları satırlar menünde rolünün adıyla çıkar. Tasarımda öğretmen olmayan
çalışan yalnız rolündeki yetkilerle çalışır (ör. yalnız "Okul sayfası (fotoğraf, tanıtım)" olan biri yalnız okul sayfasını
düzenler); rolsüz çalışanın hiç yetkisi yoktur ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

## Kurallar ve sınırlar

- **Müdür hep tam yetkili;** müdürün yetkisi kısılamaz, daraltılamaz.
- **Denetim sunucuda:** ekranda bir düğmeyi gizlemek yetmez; her istekte sunucu yetkiye bakar. Yetkisi yoksa **"Bu işlem için yetkin
  yok"** (403), daraltma dışıysa **"Bu ders ya da sınıf için yetkin yok"** (403); okulun bölümüne müdür ve öğretmenden başkası
  giremez: **"Yetkin yok"**.
- **Yalnız onaylı hesap:** onay bekleyen öğretmenin hiçbir yetkisi geçmez.
- **Bilinmeyen yetki** role yazılmaz (sunucu katalogda olmayanı atar).
- **Bazı sayfalar birden çok yetki ister** (bilinen açıklar): "Devamsızlık" sayfası "Okulun tüm devamsızlığını görür"ün yanında
  "Sınıf açar ve siler" ve öğrenci listesi yetkisi de ister ([Devamsızlık · yetki ve kapsam](../devamsizlik/yetki-ve-kapsam.md));
  "Roller ve Yetkiler" sayfası "Rol oluşturur ve düzenler"in yanında "Öğretmen bilgisi ve branşını düzenler" ve "Sınıf açar ve
  siler" ister; "Sınıflar" sayfası "Sınıfa ders ekler ve çıkarır"la menüde çıkar ama "Sınıf açar ve siler" olmadan açılmaz (kod
  okumasına göre; denenmedi).
- **Müdüre özel kalanlar** (hiçbir role konamaz): müdür atama ve ortak karar, okulu kapatma; tasarımda bölümleri açıp kapatmak da
  bugün yalnız müdürün işidir (yeni yetkiyle role verilebilir hâle gelir).
- **Eklenti yetkilerini yalnız müdür verir** (eklenti tanımı; sebep: rol yöneten kişinin kendinde olmayan yetkiyi dağıtabilmesi
  açığı kapanmadan eklenti yetkileri eklenmez). Eklentiler şimdilik kodlanmayacak, yalnız belgelenir.
- **Öneri durumu:** yeni yetkiler (Başarı, Toplantı, Tahta, Okul simgesi, Okul cihazları, Bölümleri açar, Anket açar, Mesaj
  şablonları…) özel roller önerisindendir; öneri onay bekliyor, Tasarım 1 önizlemesi hepsini içeriyor.

## Kardeşler ve ilgili

**Kardeşler:** [Rol ekle / düzenle](rol-duzenleyici.md) · [Hazır rol şablonları](hazir-sablonlar.md) ·
[Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) · [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) ·
[Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) · ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md) ·
[Özel roller](ozel-roller.md).

**İlgili** (yetkinin kendi klasöründeki ayrıntısı):

- [Etüt yetkileri ve hazır roller](../etut/etut-yetkileri.md), [Sınavlar · Yetkiler ve kapsam](../sinav/yetki-ve-kapsam.md),
  [Devamsızlık · Kim yoklama alır](../devamsizlik/yetki-ve-kapsam.md), [İşlem kaydını görür](../islem-kaydi/gorme-yetkisi.md),
  [Yemek listesini düzenler](../yemek/duzenleme-yetkisi.md), [Başarı ekler](../basarilar/basari-ekleme-yetkisi.md).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) — `YETKILER` (gruplu katalog: anahtar, ad, kapsam, açıklama), `TUM_YETKILER`,
  `OGRETMEN_VARSAYILAN`, `yetkiVarMi`; yetkiyi soran bölümler: [okul](../../sunucu/bolumler/okul.md),
  [hesaplar](../../sunucu/bolumler/hesaplar.md), [devamsizlik](../../sunucu/bolumler/devamsizlik.md),
  [etut](../../sunucu/bolumler/etut.md), [mesaj](../../sunucu/bolumler/mesaj.md), [okul-hayati](../../sunucu/bolumler/okul-hayati.md),
  [okul-sayfasi](../../sunucu/bolumler/okul-sayfasi.md), [islem-kaydi](../../sunucu/bolumler/islem-kaydi.md);
  öğrenci portalı: [sunucu/iliskiler.md](../../sunucu/iliskiler.md).
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — katalog `GET /api/school/permissions`'tan
  gelir, pencerede grup grup çizilir; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — yetkiye bağlı menü
  satırları.
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (her uç × her rol), [testler/test-rol.md](../../testler/test-rol.md)
  (katalog, öğretmen varsayılanı, verilmeyen yetkinin kullanılamaması).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Yetki listesi".

## Sık sorulanlar

- **Rehber öğretmen öğrencinin ekranını nasıl görür?** Rolüne "Öğrenci portalına girer" koy; "Okul Öğrencileri"nde öğrencinin
  adı, sınıfı ve okul numarasını görür ve portalını açar (veli kodu, e-posta, doğum tarihi gitmez).
- **Bir öğretmene öğrenci şifresi sıfırlatmak istiyorum.** "Öğrenci şifresi sıfırlar" hassas bir yetkidir; yalnız güvendiğin role
  ver (ör. müdür yardımcısı; tasarımda "BT sorumlusu" şablonunda da var).
- **"Yemek listesini düzenler"i bütün öğretmenlere vermek istiyorum.** Hazır Öğretmen rolünde işaretle.

## Sırada

- Özel roller (iş 24): yeni yetkiler, 10 grup, kısa adlar (onay bekliyor).
- Çalışan olarak ekleme (iş 2): "Okula çalışan ekler" adı.
- Eklentiler (iş 35): "Eklentiler" grubu (şimdilik kod yok).
- Güvenlik denetimi (iş 3): birden çok yetki isteyen sayfaların düzeltilmesi; rol yönetiminde kendinden fazla yetki verememe.
- Çok dil (iş 22): yetki adları çeviri kataloğuna girer.
