# Öğrenci hesapları

Öğrenci Eğitim Evi'ne kendisi kaydolmaz; hesabını okul açar ve yönetir. Müdür (ya da rolünde ilgili yetki olan çalışan) **Öğrenciler**
sayfasında okulun bütün öğrencilerini görür ve arar; **"Öğrenci ekle"** ile ad, soyad ve T.C. kimlik no'yla hesap açar (kullanıcı adı
ve şifre boşsa T.C. no olur, öğrenci ilk girişte kendi şifresini belirler), "Hesap açıldı" penceresi kullanıcı adını, bir kez
gösterilen şifreyi, okulun giriş adresini ve öğrencinin **veli kodunu** verir. Her öğrencinin **"Hesap"** penceresinden bilgileri
düzeltir, yeni şifre verir ("Rastgele üret", "İlk girişte kendi şifresini belirlesin", "Şifreyi T.C. no yap"), veli kodunu yeniler ve
velileri T.C. no ya da kullanıcı adıyla bağlar veya kaldırır. **"Giriş bilgisi dağıt"** bir sınıfın ya da bütün okulun şifrelerini
yenileyip Excel'e ve kesilip dağıtılacak giriş kâğıtlarına döker; **"Portalını aç"** öğrencinin ödevine, notuna, devamsızlığına onun
gözünden bakar. Başka okuldan gelen öğrenci yeni hesap açılmadan, T.C. ve doğum tarihi eşleşirse var olan hesabıyla okula **taşınır**
(nakil); eski okulun kayıtları o okulda kalır. Öğrenci hesabı kişiye aittir, okul onu silemez. Bunların hepsi bugün kodda var.
Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek olarak: "Öğrenci ekle"de "ad.soyad" kullanıcı adı
önerisi, hazır üretilmiş şifre, "Ekle ve yenisini aç", zorunlu okul no; nakil yerine **eşleme** (yeni kurum oturum ekler, eski okulun
oturumu öğrenci okuldan çıkarılınca "geçmiş" olur; Excel'de "Eşleyelim mi?"); listede sınıf çipleri ve 50'şerli sayfa; satıra basınca
açılan kişi penceresi (kullanıcı adını ayrı pencerede değiştirme, okulun verdiği şifreyi görme, "Şifre ver", "Portalını aç", "Başarı
ekle"); öğrencinin portalında "Müdür olarak … portalındasın · Çık" şeridi; toplu dağıtımdan önce 6 haneli doğrulama kodu ve Excel
sonrası "Şifre listesi"; okulun verdiği her şifrenin ilk girişte değişmesi; T.C. no'nun her hesapta zorunlu olması.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Öğrenciler listesi](ogrenci-listesi.md) | Öğrenciler sayfası: arama, sıralama, satırdaki bilgiler, düğmelerin yetki şartları, dar liste | Kodda var; tasarımda ek olarak sınıf çipleri, 50'şerli sayfa, satıra basınca pencere, "Mezunlar" |
| [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) | "Öğrenci ekle" / "Yeni öğrenci hesabı" penceresi, "Hesap açıldı", tek seferlik şifre, iletiler | Kodda var; tasarımda ek olarak "ad.soyad" önerisi, şifre üretme, "Ekle ve yenisini aç", zorunlu okul no, eşleme |
| [Hesap penceresi](hesap-penceresi.md) | "Hesap" penceresi: bilgileri düzeltme, "Bilgileri kaydet", bölümleri | Kodda var; tasarımda ek olarak kişi penceresi, kullanıcı adını ayrı pencerede değiştirme, "Başarı ekle" |
| [Şifre işlemleri](sifre-islemleri.md) | Yeni şifre, "Rastgele üret", "İlk girişte kendi şifresini belirlesin", "Şifreyi T.C. no yap" | Kodda var; tasarımda ek olarak okulun verdiği şifreyi görme, "Şifre ver" penceresi, her şifrenin ilk girişte değişmesi |
| [Veli kodu](veli-kodu.md) | Öğrencinin 16 karakterlik kodu: görüldüğü yerler, yenileme, velinin kullanması, sınırlar | Kodda var; tasarımda ek olarak "Veli kodun" bölümü, velide "Yakınlığın" ve "Çocuğunu bağla" onayı |
| [Veli bağlama](veli-baglama.md) | Okulun veliyi T.C. ya da kullanıcı adıyla bulup bağlaması, "Kaldır" | Kodda var; tasarımda ek olarak T.C. zorunluluğuyla T.C. ile bağlama ve yeni iletiler |
| [Öğrenci nakli](ogrenci-nakli.md) | Başka okuldan gelen öğrenci: T.C. + doğum tarihi, taşıma, eski okulun kayıtları, bildirimler | Kodda var; tasarımda ek olarak taşıma yerine eşleme ve yeni oturum, Excel'de "Eşleyelim mi?" |
| [Toplu giriş bilgisi](toplu-giris-bilgisi.md) | "Giriş bilgisi dağıt": seçim, tek seferlik liste, Excel, giriş kâğıdı, ayrılırken sorma | Kodda var; tasarımda ek olarak çift doğrulama, Excel sonrası "Şifre listesi" |
| [Öğrencinin portalını açma](ogrenci-portalini-acma.md) | "Portalını aç": öğrencinin görünümü, menü, kimin bakabileceği | Kodda var; tasarımda ek olarak birebir görünüm, "Çık" şeridi, işlem kaydı |
| [Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md) | Ayrılan ya da mezun öğrencinin okuldan çıkarılması, "geçmiş" oturum; bugün sınıfsız bırakma | Tasarlandı — henüz kodda yok |

Okuma sırası:

- **Müdür:** [Öğrenciler listesi](ogrenci-listesi.md) → [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) →
  [Toplu giriş bilgisi](toplu-giris-bilgisi.md) → [Hesap penceresi](hesap-penceresi.md) → [Şifre işlemleri](sifre-islemleri.md) →
  [Veli kodu](veli-kodu.md) → [Veli bağlama](veli-baglama.md) → [Öğrenci nakli](ogrenci-nakli.md) →
  [Öğrencinin portalını açma](ogrenci-portalini-acma.md) → [Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md).
- **Çalışan (ek rolü olan öğretmen):** [Öğrenciler listesi](ogrenci-listesi.md) (hangi yetkiyle ne görürsün) →
  [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) → [Hesap penceresi](hesap-penceresi.md) → [Şifre işlemleri](sifre-islemleri.md) →
  [Öğrencinin portalını açma](ogrenci-portalini-acma.md).
- **Öğrenci:** [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) (ilk giriş) → [Veli kodu](veli-kodu.md) →
  [Şifre işlemleri](sifre-islemleri.md) → [Öğrenci nakli](ogrenci-nakli.md).
- **Veli:** [Veli kodu](veli-kodu.md) → [Veli bağlama](veli-baglama.md) → [Toplu giriş bilgisi](toplu-giris-bilgisi.md) (kâğıttaki
  "Veli için") → [Öğrenci nakli](ogrenci-nakli.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Öğrenciler listesi | — | — | — | [ek rolündeki yetkiyle görür; portal yetkisinde dar liste](ogrenci-listesi.md) | [bütün öğrencileri görür, arar](ogrenci-listesi.md) | — | — | — |
| Öğrenci hesabı açma | [hesabı açılır, ilk girişte şifresini belirler](ogrenci-hesabi-acma.md) | [veli kodunu kâğıttan alır](ogrenci-hesabi-acma.md) | — | ["Öğrenci hesabı açar" yetkisiyle açar](ogrenci-hesabi-acma.md) | [tek tek açar](ogrenci-hesabi-acma.md) | — | — | — |
| Hesap penceresi | [bilgilerini Ayarlar'da görür, adını bugün kendisi de düzeltir; T.C. salt okunur](hesap-penceresi.md) | — | — | ["Öğrenci bilgilerini düzenler" ile düzeltir](hesap-penceresi.md) | [bilgileri düzeltir](hesap-penceresi.md) | — | [— bugün; tasarımda kullanıcı sayfasından](hesap-penceresi.md) | — |
| Şifre işlemleri | [bildirim alır, yeni şifreyle girer](sifre-islemleri.md) | [bildirimin kopyasını alır](sifre-islemleri.md) | — | ["Öğrenci şifresi sıfırlar" ile verir](sifre-islemleri.md) | [yeni şifre verir, T.C. no'ya döndürür](sifre-islemleri.md) | — | [— bugün; tasarımda şifre verir](sifre-islemleri.md) | — |
| Veli kodu | [Ayarlar'da görür, velisiyle paylaşır](veli-kodu.md) | [kodla çocuğunu ekler](veli-kodu.md) | [velisiyse kodla çocuğunu ekler](veli-kodu.md) | [görür, yeniler](veli-kodu.md) | [görür, kopyalar, yeniler](veli-kodu.md) | — | — | — |
| Veli bağlama | [— (okul bağlayınca bildirim gitmez)](veli-baglama.md) | [okul bağlar, bildirim alır](veli-baglama.md) | [kendi çocuğuna veli olarak bağlanabilir](veli-baglama.md) | [bağlar, kaldırır](veli-baglama.md) | [T.C. ya da kullanıcı adıyla bağlar, kaldırır](veli-baglama.md) | — | — | — |
| Öğrenci nakli | [hesabı yeni okula geçer; eski kayıtlar yıl seçicisinde](ogrenci-nakli.md) | [bildirim alır, bağı sürer](ogrenci-nakli.md) | — | ["Öğrenci hesabı açar" yetkisiyle alır](ogrenci-nakli.md) | [yeni okul alır; eski okul bildirim alır](ogrenci-nakli.md) | — | — | — |
| Toplu giriş bilgisi | [kâğıdını ve bildirimi alır](toplu-giris-bilgisi.md) | [kâğıttaki "Veli için"; bildirim kopyası](toplu-giris-bilgisi.md) | — | ["Öğrenci şifresi sıfırlar" ile dağıtır](toplu-giris-bilgisi.md) | [dağıtır, Excel ve kâğıt alır](toplu-giris-bilgisi.md) | — | — | — |
| Öğrencinin portalını açma | [— (bakıldığını görmez; tasarımda işlem kaydı)](ogrenci-portalini-acma.md) | [aynı görünüm Çocuklarım'dan](ogrenci-portalini-acma.md) | [— (kendi öğrencilerine Sınıflarım'dan)](ogrenci-portalini-acma.md) | ["Öğrenci portalına girer" ile bütün öğrenciler](ogrenci-portalini-acma.md) | [öğrencinin görünümünü açar](ogrenci-portalini-acma.md) | — | — | — |
| Öğrenciyi okuldan çıkarma | [oturumu "geçmiş" olur (tasarım)](ogrenciyi-okuldan-cikarma.md) | [bağ sürer, salt okunur görür (tasarım)](ogrenciyi-okuldan-cikarma.md) | — | — | [bugün sınıfsız bırakır; tasarımda "okuldan çıkar"](ogrenciyi-okuldan-cikarma.md) | — | [tasarımda kullanıcı sayfasında önerilir](ogrenciyi-okuldan-cikarma.md) | — |

Notlar:

- **Çalışan** sütunu: bugün kodda "çalışan", okulun öğretmen hesabıyla bir ek rol (Müdür Yardımcısı, Rehber Öğretmen …) taşıyan
  kişidir; menüsünde rolünün adıyla bir bölüm ve altında **"Okul Öğrencileri"** çıkar. İlgili yetkiler: "Öğrenci hesabı açar ve okula
  öğrenci ekler", "Öğrenci bilgilerini düzenler", "Öğrenci şifresi sıfırlar" (hassas), "Öğrenci portalına girer", "Öğrenciyi sınıfa
  yerleştirir" (sınıfla daraltılabilir). Hazır **Müdür Yardımcısı** şablonunda hesap açma, düzenleme ve yerleştirme vardır, şifre
  yoktur; **Rehber Öğretmen** şablonunda yalnız portal vardır. Tasarımda (çalışan tanımı) öğretmen olmayan çalışan da bu yetkileri
  alabilir; görevi verilmemiş "rolsüz çalışan" hiçbirini kullanamaz.
- **Öğretmen** sütunu: rolünde bu yetkilerden hiçbiri olmayan sıradan öğretmen. Öğrencilere yalnız kendi derslerinden bakar
  ([Sınıflarım](../siniflar-dersler/siniflarim.md)); okulun öğretmeni ya da müdürü kendi çocuğunun velisi de olabilir.
- **Servisçi** hesabı da okulca, aynı pencerenin servisçi biçimiyle açılır ve düzenlenir ([Servisçi hesabı](../servis/servisci-hesabi.md));
  servisçi öğrenci hesaplarına dokunmaz.
- **Yönetici** bugün öğrenci hesaplarını yönetmez. Tasarımda yönetici ve **destek** kullanıcı aramasından kişinin sayfasını açar,
  ad, kullanıcı adı, e-posta ve şifre işlemleri yapar ([Kullanıcı arama](../yonetim/kullanici-arama.md),
  [Hesaba müdahale](../yonetim/hesaba-mudahale.md)). Tasarımdaki **eğitmen** ve **tahta** hesapları bu bölümü kullanmaz; tahta
  hesabını okul ayrı açar ([Tahta hesabı açma](../tahta/tahta-hesabi-acma.md)).
- **Giriş yapmamış ziyaretçi** bu bölümü görmez; açılış sayfasının SSS'i "Öğrenci ve servisçi hesabını kim açar?" sorusunu
  yanıtlar ([SSS](../acilis-sayfasi/sss.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Portallar ve + Ekle](../portallar/README.md) — kişi kodu, velinin "+ Ekle → Veli"si ve Çocuklarım, öğrencide birden çok kurum,
  velide her çocuk ayrı oturum.
- [Giriş ve hesap](../giris-hesap/README.md) — okulun sayfasından giriş, zorunlu şifre belirleme, T.C. kimlik no, kullanıcı adı ve
  şifre kuralları, hatalı giriş kilidi.
- [Excel aktarım](../excel-aktarim/README.md) — toplu hesap açma, "Eşleyelim mi?", öğrenci listesi ve veli kodlarını dışarı aktarma.
- [Hesap ayarları](../ayarlar/README.md) — öğrencinin Ayarlar'ı (veli kodun, salt okunur T.C.), şifre değiştirme, hesabımı sil.
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — sınıf açma, öğrenciyi sınıfa yerleştirme, sınıf sayfası.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — öğrenci yetkileri, hazır şablonlar, sınıf daraltması.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — çalışan, rolsüz çalışan, öğretmeni okuldan çıkarma.
- [Eğitim yılı](../egitim-yili/README.md) — geçmiş yıl ve "Önceki okullar", mezunlar, çift doğrulama.
- [Servis](../servis/README.md) — servisçi hesabı (aynı pencere).
- [Başarılar](../basarilar/README.md) — tasarımda öğrencinin penceresindeki "Başarı ekle".
- [Bildirimler](../bildirim/README.md) — şifre, nakil, veli bağlama bildirimleri ve velinin kopyası.
- [İşlem kaydı](../islem-kaydi/README.md) — "Hesap açıldı", "Şifre yönetici tarafından değiştirildi", "Toplu giriş bilgisi
  dağıtıldı", "Veli öğrenciye bağlandı", "Öğrenci başka okuldan nakil geldi".
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — T.C. kimlik no, kim neyi görür, silme hakkı.
- [Site yönetimi](../yonetim/README.md) — tasarımda yönetici ve desteğin hesap işleri.
- [İlerleyiş](../ilerleyis/README.md), [Ödevler](../odev/README.md), [Sınavlar](../sinav/README.md),
  [Devamsızlık](../devamsizlik/README.md), [Ders programı](../ders-programi/README.md) — "Portalını aç" ile bakılan sayfalar.
- [Çocuğumun telefonu](../aile/README.md) — veli bağı aile uygulamasının da şartıdır.
- [Ana sayfa](../ana-sayfa/README.md) ve [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Öğrenciler" kutucuğu ve menü
  satırları.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) (Öğrenciler sayfası, veli bağlama, "Portalını aç"),
  [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) (yeni hesap, Hesap penceresi, şifre, veli kodu,
  nakil sonucu), [public/js/parcalar/10a-giris-bilgisi.md](../../public/js/parcalar/10a-giris-bilgisi.md) (giriş bilgisi dağıtımı ve
  kâğıt), [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) (`TEK_SEFER`: bir kez gösterilen şifre ve
  liste), [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (T.C., kullanıcı adı, şifre kuralları, kişi kodu
  kutuları), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md), [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md), [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md),
  [public/js/parcalar/16-egitim-yili.md](../../public/js/parcalar/16-egitim-yili.md).
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) (hesap açma, düzenleme, şifre, veli bağlama),
  [sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md), [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (öğrenci listesi,
  giriş bilgisi, veli kodu yenileme), [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) (velinin kodla bağlanması),
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (kim hangi öğrenciye bakar), [sunucu/yetki.md](../../sunucu/yetki.md) (yetkiler ve
  şablonlar), [sunucu/ortak.md](../../sunucu/ortak.md) (doğrulama kuralları).
- Depo: [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md), [sunucu/veri/depo/ogrenci-gecmisi.md](../../sunucu/veri/depo/ogrenci-gecmisi.md),
  [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md), [testler/test-nakil.md](../../testler/test-nakil.md),
  [testler/test-giris-bilgisi.md](../../testler/test-giris-bilgisi.md), [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md),
  [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md), [testler/test-cakisma.md](../../testler/test-cakisma.md),
  [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hesap türleri ve portallar", "Hesap açma (öğrenci,
  servisçi)", "Öğrenci nakli", "Kullanıcı adı ve şifre", "Toplu giriş bilgisi dağıtımı", "Öğrenci portalına giriş", "Veli tarafı").
