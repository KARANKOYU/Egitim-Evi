# Yemek listesi · Haftanın yemek listesi

**Durum:** Kodda var; tasarımda ek olarak velide her çocuğun ayrı oturumu (sayfa yalnız o oturumdaki çocuğun okulunun menüsünü gösterir) ve bir güne dokununca açılan gün penceresi.

Okulun bu haftaki menüsünü gün gün gösteren sayfa: öğrenci, veli, öğretmen ve müdür açar, bugünün günü vurgulu durur.

## Ne işe yarar

"Bugün yemekte ne var?", "Cuma ne çıkacak?" sorularının tek cevabı burası. Müdür (ya da yetkisi olan kişi) haftanın menüsünü
bir kez girer ([Bu haftayı düzenle](menuyu-duzenleme.md)); okulun öğrencileri, öğretmenleri ve çocuğu o okulda olan veliler aynı
listeyi görür. Her günün kartında o günün yemekleri alt alta yazar, girildiyse kalorisi de ([Kalori](kalori.md)). Başka haftalara
[hafta gezgini](hafta-gezgini.md) ile bakarsın.

Bu bölüm 26 Eylül'de kullanıcının önerilerden seçtikleri arasında ("3 4 5 10 9 11 olabilir ve her şey server side olsun"): menü
sunucuda tutulur, herkes aynı yerden okur; kimin neyi göreceğine de sunucu karar verir.

## Nereden açılır

Sol menüdeki **"Yemek Listesi"** satırı (kâse simgeli). Telefonda sol üstteki ☰ ile açılan menüde aynı satır var
([Telefonda menü](../menu-ve-arama/telefonda-menu.md)). Adres: sitenin adresinin sonuna `#/yemek`.

| Rol | Menüdeki yeri |
|---|---|
| Öğrenci | Çizginin altındaki ilk satır: "Etütlerim"den sonra, "Servisim"den önce |
| Veli | "Etütler" ile "Servis" arasında |
| Öğretmen | "Etütler"in hemen altında (ek rolü ne olursa olsun yeri değişmez) |
| Müdür | "Okul Düzeni" başlığının altında, "Ödevler" ile "Servisler" arasında |

Ana sayfada yemek kutucuğu yok; sayfaya yalnız menüden (ya da adresten) gidilir.

Tasarımda: menüdeki ad "Yemek listesi" (küçük l); yerleri aynı (öğrencide çizgiden sonra "Servisim"in üstünde, velide "Etütler"
ile "Servis" arasında, öğretmende "Etütler"in altında, müdürde "Okul düzeni" altında "Ödevler" ile "Servisler" arasında).

## Adım adım

### Ekranın düzeni (bugünkü site)

1. En üstte büyük başlık **"YEMEK LİSTESİ"**, altında "Okulun haftalık menüsü."
2. Hafta şeridi: solda **"Önceki hafta"**, ortada haftanın aralığı (ör. "28 Eylül – 4 Ekim"), sağda **"Sonraki hafta"**
   ([Hafta gezgini](hafta-gezgini.md)).
3. Gün kartları Pazartesi'den başlar. Her kartın üstünde gün adı (kalın) ve tarihi ("28 Eylül"); altında yemekler madde madde
   (düzenlerken yazılan her satır bir madde); kalori girildiyse en altta "650 kcal".
4. Menüsü girilmemiş hafta içi günün kartında "Menü girilmedi" yazar. **Cumartesi ve Pazar** kartı yalnız o güne menü
   girildiyse çıkar.
5. **Bugünün kartı** çerçevesi renkli ve hafif parlak; başka bir haftaya bakarken vurgulu kart olmaz.
6. Kartlar ekranın genişliğine göre yan yana dizilir (her biri en az yaklaşık 170 piksel); telefonda alt alta düşer.
7. Düzenleme yetkin varsa kartların altında **"Bu haftayı düzenle"** düğmesi ([Bu haftayı düzenle](menuyu-duzenleme.md)).
8. Sayfada birden çok okulun menüsü varsa (velinin çocukları ayrı okullardaysa) her okulun kartları o okulun adının başlığı
   altında alt alta sıralanır; tek okul varsa başlık yazılmaz
   ([Çocukların okullarının menüsü](cocuklarin-okullari.md)).

Tasarımda (Tasarım 1 önizlemesi): başlık "Yemek listesi", altında haftanın aralığı ("28 Eylül – 2 Ekim"; velide okulun adıyla:
"Test Ortaokulu · 28 Eylül – 2 Ekim"). Kartlar yerine "Bu hafta" başlıklı tek bir grup var; her gün bir satır: solda kısa gün adı
(Pzt, Sal, Çar, Per, Cum), ortada yemekler " · " ile yan yana ("Mercimek çorbası · Tavuk sote · Pilav · Ayran"), altında tarih;
bugünün satırı vurgulu ve sağında **"Bugün"** rozeti. Bir satıra dokununca o günün penceresi açılır: başlığında günün yemekleri,
altında tarih, bugünse "Bugün" rozeti. Bu pencere kullanıcının 1 Ekim isteğine dayanır: "her şey ... önizleme yazmicak gerçekte
neyse" (hiçbir tıklama boş önizleme açmasın). Önizlemede hafta gezgini, hafta sonu ve kalori yok. Kullanıcı yemek ekranı için
ayrıca bir şey söylemedi; 2 Ekim'de onayladığı karara göre (kendisine sorulan yorumu doğruladı) üzerine yorum yapmadığı
ekranlar bugünkü siteye benzer. Bu yüzden bugünkü kurallar (hafta gezgini, hafta sonu kartları, kalori) kalır;
önizlemedeki liste görünümü örnektir.

### Öğrenci

1. Menüden **"Yemek Listesi"**ne dokun. Kendi okulunun bu haftası açılır; okulun adı başlık olarak yazılmaz (tek okul).
2. Bugünün kartına bak (vurgulu olan).
3. Gelecek haftayı merak ediyorsan **"Sonraki hafta"**, geçen haftaya **"Önceki hafta"**.
4. Düzenleme düğmesi sende hiç çıkmaz: öğrenciye bu yetki verilemez.

### Veli

1. Menüden **"Yemek Listesi"**.
2. Çocuğunun okulunun menüsü gelir. Çocukların tek okuldaysa okulun adı başlık olarak yazılmaz (veli hesabı ilk çocuğunu
   eklerken o çocuğun okuluna bağlanır, sayfa bunu "kendi okulun" sayar). İki çocuğun ayrı okullardaysa iki okul, her biri kendi
   adının başlığı altında, alt alta gelir; aynı okuldaysa okul bir kez ([Çocukların okullarının menüsü](cocuklarin-okullari.md)).
3. Haftalar arasında gezmek öğrencidekiyle aynı. Veli menüyü düzenleyemez.

Tasarımda: velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı: iki çocuk tek oturumda birlikte gösterilmez). Hangi çocuğun
oturumundaysan sayfa yalnız onun okulunun menüsünü gösterir; öbür çocuğun okulu için Portallarım'dan onun oturumuna geçersin
([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen

1. Menüden **"Yemek Listesi"**. Kendi okulun gelir; okulun adı başlık olarak yazılmaz.
2. Aynı zamanda veliysen çocuğunun okulunun menüsü öğretmen portalında görünmez: çocuk bağların yetişkin hesabındadır, Portallarım'dan
   veli portalına geçip orada bakarsın ([Çocukların okullarının menüsü](cocuklarin-okullari.md)).
3. Sende "Yemek listesini düzenler" yetkisi varsa kartların altında "Bu haftayı düzenle" çıkar
   ([Yemek listesini düzenler yetkisi](duzenleme-yetkisi.md)); yoksa yalnız bakarsın.

### Çalışan

Bugün kodda "çalışan" ayrı bir hesap türü değil: ek görevli kişi (Müdür Yardımcısı, Rehber Öğretmen, Servis Sorumlusu…) öğretmen
hesabıyla ve bir ek rolle çalışır, bu sayfayı öğretmen gibi görür; ek rolünde "Yemek listesini düzenler" varsa düzenler.

Tasarımda (çalışan tanımı, kullanıcı 27 Eylül'de onayladı): kişi okula kişi koduyla "çalışan" olarak eklenir. **Rolsüz çalışan**
bu sayfayı göremez (ona yalnız okulun duyuruları, Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar açık). Müdür Öğretmen görevi
verince kişi bugünkü öğretmen gibi çalışır, listeyi görür. Rolünde "Yemek listesini düzenler" olan çalışan (öğretmen olmasa da)
menüyü düzenler. Öğretmen olmayan, yalnız başka işler için özel rol verilmiş çalışanın listeyi görüp görmeyeceği tanımda açık
yazmıyor; bu belge okul personeli olarak öğretmen gibi göreceğini varsayar (kullanıcıya sorulacak).

### Müdür

1. Menüde "Okul Düzeni" başlığının altında **"Yemek Listesi"**.
2. Okulunun menüsü açılır; "Bu haftayı düzenle" düğmesi sende her zaman var ([Bu haftayı düzenle](menuyu-duzenleme.md)).
3. Başka bir haftayı düzenlemek için önce [hafta gezgini](hafta-gezgini.md) ile o haftaya geç.

Tasarımda: müdürün sayfasında başlığın altındaki satırda, sağa yaslı, artı simgeli "Haftayı düzenle" düğmesi (ayrıntısı
[Bu haftayı düzenle](menuyu-duzenleme.md) belgesinde).

## Kurallar ve sınırlar

- **Kim görür:** öğrenci, veli, öğretmen ve müdür (hesabı onaylı olmalı; değilse "Hesabın henüz onaylanmadı").
  - **Servisçi** göremez: menüsünde yok; adresi elle yazarsa sayfada kırmızı kutuda "Bu işlem için yetkin yok" çıkar.
  - **Sistem yöneticisi** de aynı iletiyi alır; yemek listesi okul içi bir sayfadır.
  - **Rolsüz yetişkin hesabı** (henüz okula bağlı değil): "Hesabın henüz bir okula bağlı değil. Okul yönetimi seni ekleyince bu
    bölüm açılır."
  - **Giriş yapmamış ziyaretçi** için herkese açık bir yemek sayfası yok (okulun tanıtım sayfasında da menü gösterilmez).
- **Hangi menüler:** öğrencide, öğretmende ve müdürde kendi okulu; velide hesabına bağlı çocuklarının okulları (aynı okul bir kez).
  Başka bir okulun menüsü hiçbir yoldan görünmez.
- **Öğrencinin portalına bakarken** (veli, müdür ya da "Öğrenci portalına girer" yetkili öğretmen) menüde Yemek Listesi yoktur;
  kendi menüne dönünce yine görünür.
- **Hafta:** Pazartesi'den Pazar'a. Sayfa ilk açılışta bu haftayı getirir; [hafta gezgini](hafta-gezgini.md) ile başka bir
  haftaya geçtiysen sayfaya dönünce o hafta açılır. Başka bir gün istense de o günün haftasının pazartesisinden başlar.
- **"Bugün" iki ayrı saatle bulunur:** vurgulu kart cihazının tarihine göre seçilir; "bu hafta"yı ise sunucu UTC günüyle bulur.
  Pazarı pazartesiye bağlayan gece, Türkiye saatiyle pazartesi 00:00–03:00 arasında sunucu için gün hâlâ pazardır: sayfa bir
  önceki haftayı açar (vurgulu kart da olmaz); "Sonraki hafta" ile geçersin.
- **Bölüm kapatılabilir:** müdür [Özellikler](../ozellikler/bolum-ac-kapat.md) sayfasında "Yemek listesi" ("Günlük yemek listesi.")
  anahtarını kapatırsa satır o okuldaki herkesin menüsünden kalkar. Adres elle açılırsa "Bu bölüm okulunda kapalı. Okul müdürü
  Özellikler sayfasından açabilir." yazar; sunucu da "Yemek listesi bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."
  diye reddeder. Girilmiş menüler silinmez, bölüm açılınca geri gelir ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Velide kapalı bölüm:** satır, çocuklarının okullarının hepsinde kapalıysa menüden kalkar. Bilinen açık (kod bugün böyle): bir
  çocuğun okulunda kapalı ama öbürününkinde açıksa sayfa açılır ve kapalı okulun menüsü de gösterilir; sunucu o okulu ayıklamıyor.
- **Arama:** üst şeritteki "İçerik Ara" kutusu bu sayfada süzme yapmaz; kartlar aranabilir işaretli değil
  ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).
- **Eğitim yılı:** menü yıla bağlı değil. Yıl seçicide geçmiş bir yıla bakarken de aynı tarihlerin menüsü görünür
  ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Bildirim yok:** menü girilince ya da değişince kimseye bildirim gitmez; bakmak için sayfayı açarsın.
- **Kişisel veri:** menüde kişisel veri yok; yalnız menüyü kimin kaydettiği okulun işlem kaydına yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Telefonda:** hafta düğmeleri "Önceki" ve "Sonraki" diye kısalır (520 pikselden dar ekranda "hafta" sözcüğü gizlenir).
- **Yüklenemezse:** sunucunun iletisi sayfada kırmızı kutuda gösterilir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yemek listesi](README.md)):

- [Hafta gezgini](hafta-gezgini.md) — "Önceki hafta" / "Sonraki hafta".
- [Bu haftayı düzenle](menuyu-duzenleme.md) — menüyü girme, değiştirme, silme.
- [Kalori](kalori.md) — günün kalorisi.
- [Çocukların okullarının menüsü](cocuklarin-okullari.md) — velinin gördüğü okullar.
- ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md) — düzenlemeyi başkasına bırakma.

**İlgili:**

- [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md) ve [Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Telefonda menü](../menu-ve-arama/telefonda-menu.md),
  [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamada yemek ekranı bugün yok.
- [Servis](../servis/README.md) — okul hayatının öbür sayfası (aynı sunucu bölümünde).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/yemek?bas=YYYY-AA-GG` (cevap
  `{ bas, bit, okullar: [{ id, ad, gunler: [{ tarih, menu, kalori }] }], duzenleyebilir }`), `haftaBasi`, `cocuklar`.
- Depo ve tablo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) — `yemekler(okulIdler, bas, bit)`;
  tablo `yemek_listesi` (okul, tarih, menü, kalori; şema 007 — [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Kapılar: [sunucu/api.md](../../sunucu/api.md) (giriş, onay, rol, rolsüz kapısı),
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) (`yemek` bölümü kapalıysa 403 `ozellikKapali`).
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `SAYFALAR.yemek`, `YEMEK_GUN`,
  `gunKisa`, `bugunYerel`; menü satırları [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`SAYFA_OZELLIK`:
  `yemek → yemek`); kapalı bölüm ekranı [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md);
  simge [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (`yemek`). Görünüm
  `public/css/parcalar/26-anket-okul-hayati.css` (`.hafta-gezgin`, `.yemek-hafta`, `.yemek-gun`, `.bugun`, `.yemek-gun-ust`).
- Testler: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) (görme, yetki, pazartesi başlangıcı, veli, başka
  okul), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (`GET /api/yemek`: müdür, öğretmen, öğrenci, veli),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (yemek listesi bölümü).
- Android: bugün yemek ekranı yok; yalnız simgesi hazır (`ik_yemek`).

## Sık sorulanlar

- **Ana sayfada bugünün yemeği görünür mü?** Hayır; ne bugünkü sitede ne Tasarım 1'de ana sayfada yemek kutucuğu var. Menüden
  "Yemek Listesi"ni açarsın.
- **Hafta sonu neden görünmüyor?** Cumartesi ve Pazar kartı yalnız o güne menü girildiyse çıkar.
- **Bugünün kartı yanlış günü gösteriyor.** Vurgu cihazının tarihine göredir; telefonunun ya da bilgisayarının tarihi doğru mu bak.
  Gece yarısından sonraki ilk saatlerde sayfa bir önceki haftayı açabilir (yukarıda "Bugün iki ayrı saatle bulunur").
- **Servisçi yemek listesini görebilir mi?** Hayır; servisçinin menüsünde bu sayfa yok.
- **Okulumuz yemek vermiyor, bu bölüm kapatılabilir mi?** Evet. Müdür Özellikler sayfasından "Yemek listesi"ni kapatır; kimsenin
  menüsünde görünmez, girilmiş menüler silinmez, yeniden açılınca geri gelir (sitenin SSS'sindeki "Okulumuz bazı bölümleri
  kullanmıyor, kapatılabilir mi?" sorusu).
- **Menü değişince haber gelir mi?** Hayır, yemek listesi için bildirim gitmez.

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı): velinin yemek sayfası yalnız o oturumdaki çocuğun okulunu gösterecek;
  önizlemelerde ve gerçek kodda denetlenecek.
- Çok dil: ekran metinleri, gün ve ay adları çeviri kataloğuna girecek (Tasarım 1'deki İngilizce karşılığı "Lunch menu").
- Android yerel uygulama: rollerin "Diğer" sekmesinde Yemek listesi (bugün uygulamada yok).
- Güvenlik denetimi: yemek listesinde "bugün"ün UTC yerine Türkiye günüyle hesaplanması (belgelemede bulunan kod bulgusu).
- Çalışan olarak ekleme: rolsüz çalışan bu sayfayı görmeyecek, görev verilen çalışan görecek.
