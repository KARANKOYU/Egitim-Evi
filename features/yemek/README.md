# Yemek listesi

Okulun haftalık yemek menüsü. Müdür ya da "Yemek listesini düzenler" yetkisi verilen kişi bir haftanın yedi gününe yemekleri
satır satır (isteğe bağlı kalorisiyle) yazar; okulun öğrencileri, öğretmenleri ve müdürü kendi okulunun, veliler çocuklarının
okullarının menüsünü pazartesiden başlayan gün kartlarında görür, bugün vurgulu durur, haftalar "Önceki hafta" / "Sonraki hafta"
ile gezilir. Servisçi, sistem yöneticisi ve giriş yapmamış ziyaretçi bu sayfayı görmez; menü değişince bildirim gitmez; müdür
bölümü Özellikler'den kapatabilir (menüler silinmez). Bütün parçalar bugün kodda var. Tasarımda değişenler: velide her çocuk ayrı
oturum (sayfa yalnız o çocuğun okulunu gösterir), öğretmen olmayan "çalışan"ın da özel rolle düzenleyebilmesi ve bir güne
dokununca açılan gün penceresi; Tasarım 1 önizlemesindeki liste görünümü ise örnektir (kullanıcı bu ekran için ayrıca karar
vermedi, bugünkü site gibi kalır).

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Haftanın yemek listesi](yemek-listesi.md) | Sayfanın düzeni, menüdeki yeri, kim görür, bugün vurgusu, hafta sonu, kapalı bölüm | Kodda var; tasarımda ek olarak velide her çocuk ayrı oturum ve gün penceresi |
| [Hafta gezgini](hafta-gezgini.md) | "Önceki hafta" / "Sonraki hafta", seçilen haftanın akılda kalması | Kodda var |
| [Bu haftayı düzenle](menuyu-duzenleme.md) | Düzenleme penceresi, satır satır yazım, silme, sınırlar ve hata iletileri | Kodda var; tasarımda ek olarak çalışan ve "Okul sekreteri" rolü |
| [Kalori](kalori.md) | Günün kalorisi: 1–5000, "kcal" satırı | Kodda var |
| [Çocukların okullarının menüsü](cocuklarin-okullari.md) | Velinin gördüğü okullar, okul başlıkları, öğretmen/müdür portalında çocuğun okulu | Kodda var; tasarımda ek olarak velide her çocuk ayrı oturum |
| ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md) | Yetkiyi bir kişiye ya da bütün öğretmenlere verme, geri alma | Kodda var; tasarımda ek olarak çalışan ve "Okul sekreteri" rolü |

Okuma sırası: önce [Haftanın yemek listesi](yemek-listesi.md), sonra [Hafta gezgini](hafta-gezgini.md); menüyü giren kişi
[Bu haftayı düzenle](menuyu-duzenleme.md) ve [Kalori](kalori.md); veli [Çocukların okullarının menüsü](cocuklarin-okullari.md);
müdür ayrıca ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Haftanın yemek listesi | [okulunun menüsünü görür](yemek-listesi.md#öğrenci) | [çocuğunun okulununkini görür](yemek-listesi.md#veli) | [okulunun menüsünü görür](yemek-listesi.md#öğretmen) | [görevi varsa görür; rolsüz göremez](yemek-listesi.md#çalışan) | [görür](yemek-listesi.md#müdür) | — (giremez: "Bu işlem için yetkin yok") | — (giremez) | — |
| Hafta gezgini | [haftalar arasında gezer](hafta-gezgini.md#öğrenci-veli-öğretmen-ve-çalışan) | [gezer](hafta-gezgini.md#öğrenci-veli-öğretmen-ve-çalışan) | [gezer](hafta-gezgini.md#öğrenci-veli-öğretmen-ve-çalışan) | [gezer](hafta-gezgini.md#öğrenci-veli-öğretmen-ve-çalışan) | [düzenleyeceği haftaya geçer](hafta-gezgini.md#müdür) | — | — | — |
| Bu haftayı düzenle | — | — | [yetkisi varsa düzenler](menuyu-duzenleme.md#öğretmen) | [rolünde yetki varsa düzenler](menuyu-duzenleme.md#çalışan) | [her zaman düzenler](menuyu-duzenleme.md#müdür) | — | — | — |
| Kalori | [görür](kalori.md#öğrenci) | [görür](kalori.md#veli) | [görür; yetkisi varsa girer](kalori.md#öğretmen) | [görür; yetkisi varsa girer](kalori.md#çalışan) | [girer](kalori.md#müdür) | — | — | — |
| Çocukların okullarının menüsü | — | [çocuklarının okullarını görür](cocuklarin-okullari.md#veli) | [çocuğunun okulunu veli portalında görür](cocuklarin-okullari.md#öğretmen) | — | [çocuğunun okulunu veli portalında görür](cocuklarin-okullari.md#müdür) | — | — | — |
| "Yemek listesini düzenler" yetkisi | — | — | [yetkiyi alır; rol yönetiyorsa dağıtır](duzenleme-yetkisi.md#öğretmen) | [özel rolle alır](duzenleme-yetkisi.md#çalışan) | [verir, geri alır](duzenleme-yetkisi.md#müdür) | — | — | — |

Çalışan sütunu: bugün kodda ek görevli kişi öğretmen hesabı ve bir ek rolle çalışır; tasarımda (çalışan tanımı) kişi okula
"çalışan" olarak eklenir, rolsüz çalışan yemek listesini görmez. Destek, eğitmen ve tahta hesapları (tasarımdaki roller) bu
bölümü kullanmaz.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Okulun özellikleri](../ozellikler/README.md) — "Yemek listesi" bölümünü açma/kapatma; kapalı bölümde ne olur.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Yemek listesini düzenler" yetkisi, rol penceresi, hazır şablonlar.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Yemek Listesi" satırı, telefonda menü, "Yenile" düğmesi.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum, Portallarım, Çocuklarım.
- [İşlem kaydı](../islem-kaydi/README.md) — "Yemek listesi kaydedildi".
- [Eğitim yılı](../egitim-yili/README.md) — menü yıla bağlı değil.
- [Servis](../servis/README.md) — okul hayatının öbür sayfası (aynı sunucu bölümü).
- [Uygulama](../uygulama/README.md) — Android uygulamasında yemek ekranı bugün yok, planlı.
- [Dil ve çeviri](../dil/README.md) — gün ve ay adlarının çevrilmesi.

## Kod belgeleri

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) (`GET` ve `POST /api/yemek`),
  [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) (`yemekler`, `yemekYaz`; tablo `yemek_listesi`),
  [sunucu/yetki.md](../../sunucu/yetki.md) (`yemek.yonet`), [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md).
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) (sayfa, hafta gezgini, düzenleme
  penceresi), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menü satırları),
  [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) (yetkiyi verme).
- Testler: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (yemek listesi bölümü).
