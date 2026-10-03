# İşlem kaydı

Okulun "kim, ne zaman, ne yaptı" günlüğü. Hesap açma ve silme, şifre yenileme, rol verme, veli bağlama, öğretmen ekleme ve
çıkarma, Excel aktarımı, eğitim yılı, bölüm açıp kapama, okul sayfası, yemek listesi, servis saatleri ve etüt işleri gibi geri
alması zor ya da önemli işler, işi yapanın adı, rolü, kısa bir ayrıntı ve IP adresiyle kendiliğinden yazılır; ödev, not, ders
yoklaması ve mesaj gibi günlük ders işleri ise bugün yazılmaz. Müdür kendi okulunun kaydını menüdeki "İşlem Kaydı"nda her zaman
görür, başka biri ancak müdürün verdiği bir rolde "İşlem kaydını görür" yetkisiyle görür (hazır şablonlardan yalnız "Müdür
Yardımcısı"nda var); sistem yöneticisi bütün okulların kaydını ve velilerin kendi hesap işleri ile yöneticinin işleri gibi hiçbir
okula ait olmayan satırları birlikte görür. Kayıt yalnız okunur: en yeni 300 satır gösterilir, türe göre süzülür, "İçerik Ara" ile
aranır; bütün sistemde en çok 5000 satır tutulur ve kimse satır silemez. Bütün bunlar bugün kodda var. Tasarımda değişenler:
saklamanın okul başına 2 yıla geçmesi, yeni özelliklerin işlerinin (müdür yapma, çalışana görev verme, kullanıcı arama, Verilerimi
indir, yeni yıl, okul yedeği, tahta, eğitim içerikleri …) kayda girmesi, yöneticinin bölümünün /panel/admin'e taşınması, Android
uygulamasında müdüre salt okunur İşlem kaydı ve yetkinin öğretmen olmayan çalışana da verilebilmesi. Tasarım 1 önizlemesindeki
liste görünümü örnektir; kullanıcının bu ekran için tek sözü başlığın altındaki açıklamanın gereksiz olduğu (bugünkü sitede de
yok), onun dışında ekran bugünkü site gibi kalır.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [İşlem kaydı sayfası](islem-kaydi-sayfasi.md) | Menüdeki yeri, sayfanın düzeni (Tarih · Kişi · İşlem · Ayrıntı · IP), müdürün, yetkili öğretmenin ve yöneticinin gördüğü | Kodda var; tasarımda ek olarak /panel/admin, Android'de salt okunur ekran, çalışan |
| [Neler kaydedilir](neler-kaydedilir.md) | Her işlem türü: ekrandaki adı, ne zaman yazıldığı, kimin yapabildiği, ayrıntı örneği, okulun mu yöneticinin mi kaydına düştüğü; yazılmayan işler | Kodda var; tasarımda ek olarak yeni özelliklerin işleri |
| [Türe göre süzme ve arama](suzme-ve-arama.md) | "Hepsi" ve tür düğmeleri, sıraları, "İçerik Ara" ile arama ve sınırları | Kodda var |
| ["İşlem kaydını görür" yetkisi](gorme-yetkisi.md) | Yetkiyi verme ve geri alma, kimin hangi satırları gördüğü, okulsuz satırlar, hata iletileri | Kodda var; tasarımda ek olarak çalışan ve destek ekibi |
| [Saklama ve sınırlar](saklama-ve-sinirlar.md) | 300 satır gösterim, sistem geneli 5000 satır, silinme, yedekten dönme, yazılamayan satır, aydınlatma metni | Kodda var; tasarımda ek olarak okul başına 2 yıl |

Okuma sırası: önce [İşlem kaydı sayfası](islem-kaydi-sayfasi.md), sonra [Neler kaydedilir](neler-kaydedilir.md) ve
[Türe göre süzme ve arama](suzme-ve-arama.md); müdür ayrıca ["İşlem kaydını görür" yetkisi](gorme-yetkisi.md); yönetici ve
"bu satır nereye gitti?" diyen herkes [Saklama ve sınırlar](saklama-ve-sinirlar.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Destek | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|---|
| İşlem kaydı sayfası | — (giremez: "İşlem kaydını görme yetkin yok") | — (giremez) | [ek rolünde yetki varsa açar](islem-kaydi-sayfasi.md#öğretmen) | [görev yetkisi varsa açar; rolsüz açamaz](islem-kaydi-sayfasi.md#çalışan) | [her zaman açar, okulunun bütün satırları](islem-kaydi-sayfasi.md#müdür) | — (giremez) | [yönetim panelinde açar, bütün okullar](islem-kaydi-sayfasi.md#yönetici) | — (tasarımda panelinde yok) | — |
| Neler kaydedilir | ["Şifremi unuttum"la şifre yenilemesi okulun kaydına düşer](neler-kaydedilir.md#okulun-kaydına-düşen-işler) | [kendi hesap işleri yalnız yöneticinin kaydına düşer](neler-kaydedilir.md#yalnız-yöneticinin-gördüğü-kayıtlar) | [kayıtlı işleri ve okuldan ayrılması düşer](neler-kaydedilir.md#öğretmen) | [görevindeki kayıtlı işler düşer](neler-kaydedilir.md#çalışan) | [bütün okul satırlarını görür](neler-kaydedilir.md#müdür) | [şifre yenilemesi okulun kaydına düşer](neler-kaydedilir.md#okulun-kaydına-düşen-işler) | [her şeyi görür; kendi işleri okulsuz](neler-kaydedilir.md#yönetici) | [tasarımda işleri kayda girer](neler-kaydedilir.md#tasarımda-kayda-girecek-işler) | — |
| Türe göre süzme ve arama | — | — | [yetkiyle süzer, arar](suzme-ve-arama.md#öğretmen) | [görev yetkisiyle süzer, arar](suzme-ve-arama.md#çalışan) | [süzer, arar](suzme-ve-arama.md#müdür) | — | [bütün sistemin türleriyle süzer](suzme-ve-arama.md#yönetici) | — | — |
| "İşlem kaydını görür" yetkisi | — (verilemez) | — (verilemez) | [rolle alır; rol yönetiyorsa başkasına verir](gorme-yetkisi.md#öğretmen) | [tasarımda özel rolle alır](gorme-yetkisi.md#çalışan) | [her zaman var; verir, geri alır](gorme-yetkisi.md#müdür) | — (verilemez) | [her zaman var](gorme-yetkisi.md#yönetici) | [tasarımda tamamını göremez](gorme-yetkisi.md#destek) | — |
| Saklama ve sınırlar | — | — | [müdürle aynı sınırlar](saklama-ve-sinirlar.md#öğretmen) | [aynı](saklama-ve-sinirlar.md#çalışan) | [300 gösterim, 5000 sistem sınırı](saklama-ve-sinirlar.md#müdür) | — | [yedekten dönme etkisi](saklama-ve-sinirlar.md#yönetici) | — | — |

Öğretmen ve çalışan sütunları: bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol (ör. "Müdür Yardımcısı") taşır; tasarımda
(çalışan tanımı) kişi okula "çalışan" olarak eklenir, görevini müdür verir, rolsüz çalışan işlem kaydını görmez. Eğitmen ve tahta
hesapları (tasarımdaki roller) bu bölümü kullanmaz; tahtadan öğrenci seçmek tasarımda kayda yazılır.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Destek](../roller/destek.md) · [Ziyaretçi](../roller/ziyaretci.md).
Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Roller ve yetkiler](../roller-yetkiler/README.md) — "İşlem kaydını görür" yetkisi, rol penceresi, "Müdür Yardımcısı" şablonu;
  rol işleri kayda düşer.
- [Öğrenci hesapları](../hesaplar/README.md) — hesap açma, şifre işlemleri, giriş bilgisi dağıtma, veli bağlama, nakil.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — kodla ekleme, okuldan çıkarma; tasarımda müdür yapma ve görev
  verme.
- [Excel aktarım](../excel-aktarim/README.md) — toplu hesap açma ve ders programı kayda düşer; dışarı aktarım düşmez.
- [Okulun özellikleri](../ozellikler/README.md) — bölüm açıp kapama kayda düşer; işlem kaydı kapatılabilen bölümlerden değil.
- [Eğitim yılı](../egitim-yili/README.md) — yıl açma ve aktif yıl; tasarımda yeni yıl sihirbazı ve okul yedeği.
- [Okul sayfası](../okul-sayfasi/README.md), [Yemek listesi](../yemek/README.md), [Servis](../servis/README.md),
  [Etütler](../etut/README.md) — kayda düşen okul işleri.
- [Site yönetimi](../yonetim/README.md) — yöneticinin İşlem Kaydı, site ayarları, yedekler, yönetici dosyası; tasarımda paneller,
  kullanıcı arama.
- [Yorumlar](../yorumlar/README.md) — uygunsuz kelimeli yorum, yorum gizleme.
- [Hesap ayarları](../ayarlar/README.md) — yetişkinin e-posta ve bilgi değişikliği okulsuz yazılır; tasarımda Verilerimi indir.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "İşlem Kaydı" satırı, "İçerik Ara", yenile düğmesi.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — kim neyi görür, saklama süreleri, aydınlatma metni.
- [Destek talepleri](../destek/README.md), [Tahta hesabı](../tahta/README.md), [Eğitim içerikleri](../egitim-icerikleri/README.md),
  [Eklentiler](../eklentiler/README.md) — tasarımda kayda girecek işler.
- [Uygulama ve indirme](../uygulama/README.md) — Android uygulamasında İşlem kaydı bugün yok; tasarımda müdüre salt okunur.

## Kod belgeleri

- Sunucu: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`ISLEM_AD`, `islemYaz`, `GET /api/islem-kaydi`),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`islemYaz`, `islemKayitlari`, `ISLEM_SINIR`),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (tablo `islem_kaydi`), [sunucu/yetki.md](../../sunucu/yetki.md)
  (`islem-kaydi.gor`), [sunucu/api.md](../../sunucu/api.md).
- Ön yüz: [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) (`SAYFALAR['islem-kaydi']`),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  (`islem-suz`), [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) (arama),
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (yöneticinin menüsü),
  [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) (yetkiyi verme).
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md), [testler/test-rol.md](../../testler/test-rol.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/test-okul-sayfasi.md](../../testler/test-okul-sayfasi.md),
  [testler/test-okul-disk.md](../../testler/test-okul-disk.md), [testler/test-giris-bilgisi.md](../../testler/test-giris-bilgisi.md),
  [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md), [testler/test-servis-konum.md](../../testler/test-servis-konum.md),
  [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md); ayrıca `testler/test-yonetici-dosyasi.js`.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) — işlem kaydının ayrı bir bölümü yok; kayda düşen işler
  ilgili bölümlerde (yönetici dosyası, site ayarları, okul açma, okul sayfası, toplu giriş bilgisi, özellikler, okul disk sınırı,
  servis saatleri) geçer.
