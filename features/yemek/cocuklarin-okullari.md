# Yemek listesi · Çocukların okullarının menüsü

**Durum:** Kodda var; tasarımda ek olarak velide her çocuk ayrı oturum: sayfa yalnız o oturumdaki çocuğun okulunun menüsünü gösterir.

Velinin yemek sayfası: hesabına bağlı çocukların okullarının menüsü, her okul kendi adının başlığı altında.

## Ne işe yarar

Veli çocuğunun okulunda bu hafta ne yendiğini görür. Sunucu veli hesabının kendi okulunu saymaz; sayfaya çocuklarının okullarını
getirir. İki çocuğu ayrı okullardaysa iki okulun menüsü aynı sayfada alt alta durur; aynı okuldaysa okul bir kez gösterilir.

## Nereden açılır

Veli menüsünde **"Yemek Listesi"** ("Etütler" ile "Servis" arasında). Adres `#/yemek`. Ekranın geri kalanı
[Haftanın yemek listesi](yemek-listesi.md) ile aynı.

Tasarımda: veli menüsünde "Yemek listesi" (aynı yerde); sayfanın başlığının altında okulun adı ve hafta yazar ("Test Ortaokulu ·
28 Eylül – 2 Ekim").

## Adım adım

### Veli

1. Menüden **"Yemek Listesi"**ne dokun.
2. Çocukların ayrı okullardaysa her okulun adı kalın bir başlık olarak yazılır, altında o okulun gün kartları. Okulların sırası
   çocuklarını hesabına ekleme sırandır. Hepsi tek okuldaysa başlık yazılmaz, yalnız o okulun kartları gelir (aşağıda "Okul
   başlığı").
3. [Hafta gezgini](hafta-gezgini.md) bütün okulları birlikte bir hafta ileri ya da geri kaydırır.
4. Bir okulun o hafta menüsü yoksa başlığının altında hafta içi kartları "Menü girilmedi" der.
5. Veli portalında hangi çocuğu seçmiş olursan ol, bugün bu sayfa bütün çocuklarının okullarını birlikte gösterir.
6. Menüyü düzenleyemezsin; düzenleme düğmesi velide hiç çıkmaz.

Tasarımda: **velide her çocuk ayrı oturum** (kullanıcı 3 Ekim: iki çocuk tek oturumda birlikte gösterilmez, "Hepsi" seçeneği
yok). Portallarım'da her çocuk ayrı bir satırdır; bir çocuğun oturumuna geçince menü ve bütün sayfalar o çocuğa göre açılır.
Yemek listesi de yalnız o çocuğun okulunun menüsünü gösterir; öbür çocuğun okulu için Portallarım'dan (ya da Çocuklarım'daki
"Oturumuna geç" ile) onun oturumuna geçersin. Başlığın altında okulun adı yazar. Ayrıntı:
[Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).

### Öğretmen

Bugünkü hesap düzeninde öğretmenlik bir okul rolüdür (Portallarım'da "Öğretmen" satırı, altında okulun adı) ve çocuk bağları
yetişkin hesabındadır. Bu yüzden öğretmen portalındaki Yemek Listesi yalnız kendi okulunu gösterir; çocuğunun okulunun menüsüne
bakmak için Portallarım'dan veli portalına (altında çocuğunun adı yazan "Veli" satırı) geçersin.

### Müdür

Öğretmenle aynı: müdür portalında yalnız kendi okulunun menüsü (ve onu düzenleme); çocuğunun okulunun menüsü veli portalında.

## Kurallar ve sınırlar

- **Hangi çocuklar:** hesabına veli koduyla bağlı çocuklar ([Çocuklarım](../portallar/cocuklarim.md)). Okula bağlı olmayan
  çocuk sayılmaz; hiç okul kalmazsa sayfada "Bağlı olduğun bir okul yok." yazar.
- **Okul başlığı:** sayfada birden çok okul varsa ya da hesabın kayıtlı bir okulu yoksa yazılır. Veli hesabı ilk çocuğunu
  eklerken o çocuğun okuluna bağlanır; bu yüzden çocukları tek okulda olan velide başlık çıkmaz, iki ayrı okulda olanda her okulun
  adı yazar. Öğrencide, öğretmende ve müdürde tek okul olduğu için yazılmaz.
- **Yalnız çocuğunun okulu:** veli başka hiçbir okulun menüsünü göremez.
- **Eski tip hesaplar:** okul rolü satırı olmayan, yetişkin hesabından önceki düzende açılmış ve kendisi giriş yapan bir öğretmen
  ya da müdür hesabına veli koduyla çocuk bağlandıysa kod o çocukların okullarını da ekler: önce kendi okulu, sonra çocuğunun
  okulu (çocuk başka okuldaysa; ikisi de başlıklı). Düzenleme penceresi yine yalnız kendi okulunu açar. Bugünkü kayıt
  düzeninde yeni açılan hesaplarda bu durum doğmaz.
- **Bölüm kapalıysa:** "Yemek Listesi" satırı velinin menüsünden ancak çocuklarının okullarının **hepsinde** yemek bölümü
  kapalıysa kalkar. Bilinen açık (kod bugün böyle): bir okulda kapalı, öbüründe açıksa sayfa açılır ve kapalı okulun menüsü de
  gösterilir; sunucu o okulu ayıklamıyor (servis sayfası ayıklıyor). Kapalı okulun menüleri silinmediği için eski menüler görünür.
- **Bildirim yok:** çocuğunun okulunun menüsü değişince veliye bildirim gitmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yemek listesi](README.md)):

- [Haftanın yemek listesi](yemek-listesi.md) — sayfanın genel düzeni.
- [Hafta gezgini](hafta-gezgini.md) — bütün okulları birlikte kaydırır.
- [Kalori](kalori.md) — kartın altındaki "kcal" satırı.
- [Bu haftayı düzenle](menuyu-duzenleme.md), ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md) — velide yok.

**İlgili:**

- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Portallarım](../portallar/portallarim.md),
  [Portala geçiş](../portallar/portala-gecis.md), [Çocuklarım](../portallar/cocuklarim.md).
- [Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md).
- [Servisim ve servis kartı](../servis/servisim.md) — velinin öbür "okul hayatı" sayfası (kapalı okuldaki çocuğun kartını
  ayıklar).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/yemek`: kendi okul (veli değilse,
  ilk sırada) + `cocuklar(me)` ile çocukların okulları, aynı okul bir kez; `cocuklar` öğrenci ve yöneticide boş.
- Çocuk bağları: depo `kullanicilar.cocuklari` (`veli_baglari`; [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md));
  okul rolü satırında çocukların yetişkin hesabında durduğu kural [sunucu/iliskiler.md](../../sunucu/iliskiler.md)
  (`childrenOf`) ve [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md).
- Kapalı bölüm: [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) — `kapaliysaReddet` (çocuk seçmeyen veli
  isteği, bölüm bir çocuğun okulunda açıksa geçer), `kullanicininKapalilari` (velide hepsinde kapalı olanlar menüden kalkar).
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `SAYFALAR.yemek`: birden çok
  okul varsa ya da kişinin kendi okulu yoksa her okul için `h3.sb` başlık; `S.veliCocuk`'a bakmaz. Portallar:
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md).
- Test: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) — veli çocuğunun okulunun menüsünü görür, düzenleyemez;
  başka okul görmez.

## Sık sorulanlar

- **İki çocuğum farklı okullarda, ikisini de görebilir miyim?** Bugün evet, aynı sayfada alt alta. Tasarımda her çocuğun
  oturumunda o çocuğun okulu görünecek; öbürü için oturum değiştirirsin.
- **Öğretmenim, çocuğum başka okulda; onun menüsünü nerede görürüm?** Portallarım'dan çocuğunun veli portalına geç.
- **Çocuğumun okulu yemek bölümünü kapattı ama menü hâlâ görünüyor.** Öbür çocuğunun okulunda bölüm açıksa bugün kod kapalı okulun
  eski menüsünü de gösteriyor (bilinen açık).

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı): yemek sayfası yalnız oturumdaki çocuğun okulunu gösterecek; gerçek
  kodun bu karara uyup uymadığı denetlenecek.
- Kapalı okulun menüsünün veliye gelmesi: bilinen açık olarak kod belgesinde kayıtlı; planlı ayrı bir iş yok.
