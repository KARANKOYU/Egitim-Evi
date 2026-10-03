# Servis

Okulun servis araçları ve servis yoklaması. Okul yönetimi (müdür ya da "Servisleri ve servis öğrencilerini düzenler" yetkisi olan,
hazır şablonu "Servis Sorumlusu") servisleri açar, öğrencileri durağıyla servislere yazar, servisçi hesaplarını açar ve okulun sabah /
akşam servis saatlerini seçer. Servisçi telefonundan okulun adresine girer; ana sayfası olan Yoklama'da sabah her öğrenciyi "Bindi" /
"Binmedi" diye işaretler ve "Okula vardık" der, akşam okulda "Geldi" / "Gelmedi" işaretleyip "Başlat"a basar ve her öğrenciyi evine
bırakınca "İndi"ye basar; alma ve bırakma sırasını kendisi düzenler, velilere tarihli not yazar. Sefer sürerken telefonunun konumu
gönderilir. Veli her işaretin bildirimini bir kez alır ("Zeynep 07:42'de servise bindi."), çocuğunun "binmeyecek" olduğu günü servisçiye
bildirir; öğrenci ve veli servis kartını her zaman, bugünkü durumu, sırayı ("5. sırada, önünde 2 öğrenci") ve aracın yerini yalnız
servis saatlerinde görür; evin yeri işaretliyse servis eve 500 m ve 100 m kala bildirim gelir. Bunların hepsi bugün kodda var.
Tasarımda (Tasarım 1 önizlemesi ve kullanıcının kararları) ek olarak: servisçinin ayrı ana sayfası, servisçinin listeye öğrenci ekleyip
çıkarması, öğrencinin "binmeyecek"i kendisinin işaretlemesi, velide her çocuğun ayrı oturumu, "Sıradaki" kartı ve kalan yol çizgisi,
hazır not cümleleri ve 3 Ekim kararıyla sefer bitince binmeyen öğrenci için "Önemli" öncelikli "bugün servise binmedi" uyarısı.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Servisler sayfası](servisler-sayfasi.md) | Servis açma, düzenleme, silme; öğrenciyi durağıyla ekleme, taşıma, çıkarma | Kodda var; tasarımda ek olarak servis penceresi sekmeleri, durum rozetleri |
| [Servisçi hesabı açma](servisci-hesabi.md) | Hesap penceresi, Excel ile toplu açma, servise atama, şifre, silme, servisçinin girişi | Kodda var; tasarımda ek olarak "Servis ekle"de hesap açma, servisçi de portal |
| [Servis saatleri](servis-saatleri.md) | Sabah ve akşam aralığı, kurallar, 60 dakikalık uzatma, Türkiye saati | Kodda var; tasarımda ek olarak velinin kartında "Servis saatleri:" satırı |
| [Yoklama sayfası](yoklama-sayfasi.md) | Servisçinin ekranının düzeni: servis seçici, sayılar, liste, satırlar, kendiliğinden tazelenme | Kodda var; tasarımda ek olarak ayrı ana sayfa, kilit kartı, "Sıradaki" kartı |
| [Sabah seferi](sabah-seferi.md) | "Seferi başlat", Bindi / Binmedi, "Okula vardık" | Kodda var; tasarımda ek olarak "Sıradaki" kartı, binmedi uyarısı |
| [Akşam seferi](aksam-seferi.md) | Geldi / Gelmedi, "Başlat", İndi, "Seferi bitir" | Kodda var; tasarımda ek olarak "Sıradaki" kartı, binmedi uyarısı |
| [Sırayı düzenle](sira-duzenleme.md) | Sabah (alma) ve akşam (bırakma) sırası; "önünde N öğrenci" | Kodda var; tasarımda ek olarak servisçinin öğrenci ekleyip çıkarması |
| [Velilere not yaz](gunluk-not.md) | Servisçinin tarihli notu, bildirimi, silme | Kodda var; tasarımda ek olarak hazır cümleler |
| [Binmeyecek işareti](binmeyecek.md) | Velinin bugün–7 gün için sabah / akşam / ikisi işareti, kilit, servisçiye bildirim | Kodda var; tasarımda ek olarak öğrencinin işaretlemesi, takvimden gün seçimi |
| [Servisim ve servis kartı](servisim.md) | Öğrenci ve velinin servis sayfası, kart, "bugün" rozetleri | Kodda var; tasarımda ek olarak her çocuk ayrı oturum, "Bugün" zaman çizelgesi |
| [Canlı konum ve servis haritası](canli-konum-ve-harita.md) | Harita, "Okula git / Eve git / Servisi takip et", servisçinin konum gönderimi, Android | Kodda var; tasarımda ek olarak kalan yol çizgisi, sıradaki ev |
| [Evin yerini işaretleme](evi-isaretleme.md) | "Evimi işaretle", "Bulunduğum yeri kullan", silme | Kodda var |
| [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md) | 500 m ve 100 m bildirimi, kime gider, "Servis yaklaşınca haber al" | Kodda var; tasarımda ek olarak 100 m şeridi |
| [Bugünkü yoklama (yönetim)](yonetimin-yoklama-gorunumu.md) | Okul yönetiminin salt okunur yoklama penceresi | Kodda var; tasarımda ek olarak sabah ve akşam yan yana tablo |
| [Servis bildirimleri](servis-bildirimleri.md) | Bütün servis bildirimlerinin metinleri, alıcıları, tekrar yok kuralı | Kodda var; tasarımda ek olarak "Servis" sekmesi |
| [Servise binmedi uyarısı](servise-binmedi-uyarisi.md) | Sefer bitince binmeyen öğrenci için "Önemli" öncelikli uyarı | Tasarlandı — henüz kodda yok |

Okuma sırası: öğrenci ve veli önce [Servisim ve servis kartı](servisim.md), sonra [Canlı konum ve servis haritası](canli-konum-ve-harita.md),
[Evin yerini işaretleme](evi-isaretleme.md), [Binmeyecek işareti](binmeyecek.md) ve [Servis bildirimleri](servis-bildirimleri.md).
Servisçi önce [Servisçi hesabı açma](servisci-hesabi.md)'nın "Servisçi" bölümü, sonra [Yoklama sayfası](yoklama-sayfasi.md),
[Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md), [Sırayı düzenle](sira-duzenleme.md), [Velilere not yaz](gunluk-not.md).
Müdür önce [Servis saatleri](servis-saatleri.md), sonra [Servisler sayfası](servisler-sayfasi.md), [Servisçi hesabı açma](servisci-hesabi.md)
ve [Bugünkü yoklama](yonetimin-yoklama-gorunumu.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz. "Öğretmen" sütunu:
"Servisleri ve servis öğrencilerini düzenler" yetkisi olan öğretmen (bugün "Servis Sorumlusu" ek rolü) okul yönetimi gibi çalışır;
yetkisi olmayan öğretmen servisi yalnız kendi çocuğu için (veli olarak) görür.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Servisler sayfası | — | — | [yetkisi varsa yönetir](servisler-sayfasi.md#öğretmen) | [Servis Sorumlusu rolüyle yönetir](servisler-sayfasi.md#çalışan) | [servis açar, öğrenci yazar, taşır, çıkarır](servisler-sayfasi.md#müdür) | — (adresle açarsa "Servis bilgileri okul yönetimindedir.") | — | — |
| Servisçi hesabı açma | — | — | [yetkisi varsa açar, şifre verir, siler](servisci-hesabi.md#öğretmen-ve-çalışan) | [rolünde yetki varsa aynı](servisci-hesabi.md#öğretmen-ve-çalışan) | [açar, servise atar, şifre verir, siler](servisci-hesabi.md#müdür) | [okulun adresinden girer, kendi şifresini belirler](servisci-hesabi.md#servisçi) | — | — |
| Servis saatleri | [canlı bilgiyi yalnız bu saatlerde görür](servis-saatleri.md#öğrenci-ve-veli) | [canlı bilgiyi yalnız bu saatlerde görür](servis-saatleri.md#öğrenci-ve-veli) | [yetkisi varsa değiştirir](servis-saatleri.md#öğretmen-ve-çalışan) | [rolünde yetki varsa değiştirir](servis-saatleri.md#öğretmen-ve-çalışan) | [seçer, değiştirir](servis-saatleri.md#müdür) | [yoklamayı ve seferi yalnız bu saatlerde açar](servis-saatleri.md#servisçi) | — | — |
| Yoklama sayfası | — | — | — (yönetimde [salt okunur](yonetimin-yoklama-gorunumu.md)) | — (yönetimde [salt okunur](yonetimin-yoklama-gorunumu.md)) | — (yönetimde [salt okunur](yonetimin-yoklama-gorunumu.md)) | [ana sayfası; işaretler, seferi yönetir](yoklama-sayfasi.md) | — | — |
| Sabah seferi | [durumunu ve sırasını görür](sabah-seferi.md#öğrenci) | [bildirim alır, kartta görür](sabah-seferi.md#veli) | [yetkisi varsa salt okunur görür](sabah-seferi.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [rolünde yetki varsa görür](sabah-seferi.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [salt okunur görür](sabah-seferi.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [Bindi / Binmedi, "Okula vardık"](sabah-seferi.md#servisçi) | — | — |
| Akşam seferi | [durumunu ve sırasını görür](aksam-seferi.md#öğrenci) | [bildirim alır, kartta görür](aksam-seferi.md#veli) | [yetkisi varsa salt okunur görür](aksam-seferi.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [rolünde yetki varsa görür](aksam-seferi.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [salt okunur görür](aksam-seferi.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [Geldi / Gelmedi, "Başlat", İndi](aksam-seferi.md#servisçi) | — | — |
| Sırayı düzenle | [sırasını görür](sira-duzenleme.md#öğrenci) | [çocuğunun sırasını görür](sira-duzenleme.md#veli) | [değiştirmez; sıra numaralarını görür](sira-duzenleme.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [değiştirmez](sira-duzenleme.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [değiştirmez; yeni öğrenci sona girer](sira-duzenleme.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [sabah ve akşam sırasını düzenler](sira-duzenleme.md#servisçi) | — | — |
| Velilere not yaz | [kartında görür](gunluk-not.md#öğrenci) | [bildirim alır, kartta görür](gunluk-not.md#veli) | [yetkisi varsa salt okunur görür](gunluk-not.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [rolünde yetki varsa görür](gunluk-not.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [salt okunur görür](gunluk-not.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [yazar, siler](gunluk-not.md#servisçi) | — | — |
| Binmeyecek işareti | [görür; tasarımda kendisi işaretler](binmeyecek.md#öğrenci) | [işaretler, değiştirir, kaldırır](binmeyecek.md#veli) | [kendi çocuğu için koyar; yönetimde görür](binmeyecek.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [yönetimde görür](binmeyecek.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [görür; kendi çocuğu için koyar](binmeyecek.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [bildirim alır, listede görür](binmeyecek.md#servisçi) | — | — |
| Servisim ve servis kartı | ["Servisim" sayfası](servisim.md#öğrenci) | ["Servis" sayfası, her çocuğun kartı](servisim.md#veli) | [çocuğu varsa "Servisi"](servisim.md#öğretmen-ve-müdür-kendi-çocuğu-için) | — | [çocuğu varsa "Servisler"in üstünde](servisim.md#öğretmen-ve-müdür-kendi-çocuğu-için) | — | — | — |
| Canlı konum ve servis haritası | [okulu, evi, aracı görür](canli-konum-ve-harita.md#öğrenci-ve-veli) | [okulu, evi, aracı görür](canli-konum-ve-harita.md#öğrenci-ve-veli) | [yetkisi varsa öğrencinin haritası](canli-konum-ve-harita.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [rolünde yetki varsa aynı](canli-konum-ve-harita.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [öğrencinin haritası](canli-konum-ve-harita.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [konumunu gönderir, evleri görür](canli-konum-ve-harita.md#servisçi--konum-gönderimi) | — | — |
| Evin yerini işaretleme | [işaretler, değiştirir, siler](evi-isaretleme.md#öğrenci) | [çocuğunun evini işaretler](evi-isaretleme.md#veli) | [yetkisi varsa işaretler](evi-isaretleme.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [rolünde yetki varsa işaretler](evi-isaretleme.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [işaretler](evi-isaretleme.md#müdür-öğretmen-ve-çalışan-servis-yönetimi) | [görür, yol tarifi alır; değiştiremez](evi-isaretleme.md#servisçi) | — | — |
| Servis yaklaşıyor bildirimi | [alır](yaklasma-bildirimi.md#öğrenci) | [alır](yaklasma-bildirimi.md#veli) | — (çocuğu varsa veli olarak alır) | — | — (çocuğu varsa veli olarak alır) | [konumuyla tetikler](yaklasma-bildirimi.md#servisçi) | — | — |
| Bugünkü yoklama (yönetim) | — | — | [yetkisi varsa görür](yonetimin-yoklama-gorunumu.md#öğretmen-ve-çalışan) | [rolünde yetki varsa görür](yonetimin-yoklama-gorunumu.md#öğretmen-ve-çalışan) | [her servisin bugünkü yoklaması](yonetimin-yoklama-gorunumu.md#müdür) | [aynı veriyi Yoklama'da işaretler](yonetimin-yoklama-gorunumu.md#servisçi) | — | — |
| Servis bildirimleri | [yalnız yaklaşma bildirimleri](servis-bildirimleri.md) | [yoklama, not, yaklaşma bildirimleri](servis-bildirimleri.md) | — (çocuğu varsa veli olarak) | — | — (çocuğu varsa veli olarak) | ["binmeyecek" bildirimleri](servis-bildirimleri.md) | — | — |
| Servise binmedi uyarısı (tasarım) | — | [uyarı alır](servise-binmedi-uyarisi.md#veli-tasarım) | [servis sorumlusuysa akşam bilgi alır](servise-binmedi-uyarisi.md#okul-idaresi-servis-sorumlusu-tasarım) | [servis sorumlusuysa akşam bilgi alır](servise-binmedi-uyarisi.md#okul-idaresi-servis-sorumlusu-tasarım) | [okul idaresi olarak akşam bilgi alır](servise-binmedi-uyarisi.md#okul-idaresi-servis-sorumlusu-tasarım) | ["Okula vardık" ve "Başlat" tetikler](servise-binmedi-uyarisi.md#servisçi-tasarım) | — | — |

Çalışan sütunu: bugün kodda ek görevli kişi öğretmen hesabıyla ve bir ek rolle çalışır; tasarımda (çalışan tanımı) kişi okula "çalışan"
olarak eklenir ve müdür ona "Servis Sorumlusu" rolünü verince öğretmen olmasa da servisleri yönetir; rolsüz çalışan servis bölümünü
görmez. Sistem yöneticisi servis uçlarına giremez (okul içi bölüm). Giriş yapmamış ziyaretçi yalnız açılış sayfasındaki tanıtımı ("Servis
yoklaması" kartı) ve SSS'deki servis sorularını görür ([Açılış](../acilis-sayfasi/acilis.md), [SSS](../acilis-sayfasi/sss.md)).
Destek, eğitmen ve tahta hesapları (tasarımdaki roller) bu bölümü kullanmaz.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Öğrenci hesapları](../hesaplar/README.md) — hesap penceresi, şifre işlemleri, toplu giriş bilgisi (servisçi hesabı aynı pencereyi kullanır).
- [Excel aktarım](../excel-aktarim/README.md) — şablonun "Servisçiler" sayfası.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — `servis.yonet`, hazır şablon "Servis Sorumlusu".
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — çalışana rol verme (tasarım).
- [Okulun özellikleri](../ozellikler/README.md) — "Servis" bölümünü açma / kapatma.
- [Bildirimler](../bildirim/README.md) — bildirim paneli, telefon bildirimi, velinin bildirimleri.
- [Mesajlar ve duyurular](../mesaj/README.md) — "Önemli" etiketi (binmedi uyarısının önceliği).
- [Ana sayfa](../ana-sayfa/README.md) — servisçinin ana sayfası (tasarım).
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Servisim", "Servis", "Servisi", "Servisler", "Yoklama" satırları.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum; servisçi de portal (tasarım).
- [Okul sayfası](../okul-sayfasi/README.md) — okulun haritadaki konumu.
- [Çocuğumun telefonu](../aile/README.md) — aynı harita bileşeni, çocuğun kendi telefonunun konumu.
- [Giriş ve hesap](../giris-hesap/README.md) — servisçinin okulun adresinden girişi, zorunlu şifre belirleme.
- [Hesap ayarları](../ayarlar/README.md) — servisçinin giriş bilgileri, bildirim ayarları.
- [Uygulama ve indirme](../uygulama/README.md) — Android uygulaması, arka plan sefer konumu, bildirim yoklaması.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — servis verilerini kim görür, 30 günlük saklama.
- [İşlem kaydı](../islem-kaydi/README.md) — "Servis saatleri değişti", "Hesap açıldı".
- [Eğitim yılı](../egitim-yili/README.md) — yıl geçişinde servis listeleri, mezunlar (tasarım).
- [Devamsızlık ve yoklama](../devamsizlik/README.md) — derslerin yoklaması (servis yoklamasının örnek aldığı ekran).
- [Yemek listesi](../yemek/README.md) — okul hayatının öbür sayfası (aynı sunucu bölümü).
- [Açılış sayfası](../acilis-sayfasi/README.md) — tanıtım ve SSS.

## Kod belgeleri

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) (`/api/servis` uçlarının hepsi: servisler, harita, ev,
  yoklama, okula varış, sıra, not, binmeyecek, sefer, konum, saatler; yaklaşma bildirimi; temizlik),
  [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (telefon uygulamasının anahtarı, bildirim yoklaması, sefer konumu),
  [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) (servisçi hesabı), [sunucu/bolumler/kisi-aktarim.md](../../sunucu/bolumler/kisi-aktarim.md)
  (Excel), [sunucu/yardimci/servis-pencere.md](../../sunucu/yardimci/servis-pencere.md) (servis saatleri hesabı),
  [sunucu/yetki.md](../../sunucu/yetki.md) (`servis.yonet`), [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md).
- Depo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) (servisler, öğrencileri, ev konumu, seferler),
  [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md) (yoklama, günler, olaylar, notlar, binmeyecek),
  [sunucu/veri/depo/cihazlar.md](../../sunucu/veri/depo/cihazlar.md); şema [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (028).
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) (servis kartı, yönetim, binmeyecek),
  [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) (servisçinin Yoklama sayfası),
  [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) (harita, ev, konum gönderimi),
  [public/js/parcalar/19d-harita.md](../../public/js/parcalar/19d-harita.md) (harita bileşeni),
  [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) (servisçi hesabı penceresi),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menü satırları).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md), [testler/test-servis-pencere.md](../../testler/test-servis-pencere.md),
  [testler/test-servis-konum.md](../../testler/test-servis-konum.md), [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yemek listesi, servis …" bölümünün servis kısmı ve "Servis yoklaması").
