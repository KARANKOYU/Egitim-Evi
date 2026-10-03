# Anketler

Okulun bir gruba sorduğu anketler. Bugünkü sitede anket tek sorudur: "Sınıfa veya gruba toplu mesaj atar" yetkisi olan kişi (müdür ya
da bu yetki verilmiş öğretmen veya ek görevli) Anketler → "Yeni anket" ile okula, bir rol grubuna ya da sınıflara 2–10 seçenekli bir soru
sorar, bitiş günü ve saatini (en çok 90 gün) ve istenirse gizliliği seçer. Kimin oy verebileceği açılış anında hedef listesine yazılıp
dondurulur; öğrencilere açılan anket onaylı velilerine de gider ve hedefteki herkese "Anket: <soru>" bildirimi gelir. Hedefteki kişi
bitişe kadar tek oy verir, oyunu değiştirir ya da geri alır. Anketi açan ve okulun müdürü sayıları ve kimin oy verip vermediğini her an
görür, hedefteki herkes sayıları anket bitince görür; gizli ankette kimin neyi seçtiği hiç kimseye gönderilmez, sayılar da ancak anket
bitince açılır. Anket erken bitirilir ya da silinir. Bunların hepsi bugün çalışır (kullanıcının 26 Eylül seçimi, aynı gün kodlandı).
Kullanıcının 28 Eylül kararıyla (Tasarım 1 önizlemesi) anket Google Forms gibi çok sorulu olur: Excel'le değil, tam sayfa "Anket
oluştur" düzenleyicisinde sırayla soru kartları (Tek seçim, Birden çok seçim, Açılır liste, Kısa yanıt, Uzun yanıt), "Zorunlu" anahtarı,
"Taslağı kaydet" (adıyla, "Taslaklarım"da), "Katılımcı gözüyle önizle" ve "Yayınla"; katılımcı "Kaydet, sonra devam et" ile yarıda
bırakır, "Gönder"de boş zorunlu soruya götürülür; anket bir ödeve ya da mesaja eklenebilir; ilk yanıttan sonra sorular değişmez;
sonuçlar Excel'e indirilir; anketler bitişinden 1 yıl sonra silinir; velide her çocuğun anketleri kendi oturumundadır.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Anketler sayfası](anketler-sayfasi.md) | Menüdeki "Anketler": kartlar, "Açtığın anketler" / "Okulun anketleri", boş durum, sıralama, veli ve çalışan | Kodda var; tasarımda ek olarak "Açtığım anketler", "Taslaklarım", "Sana sorulan anketler", durum rozetleri, velide çocuk oturumu |
| [Anket açma](anket-acma.md) | "Yeni anket" penceresi: soru, açıklama, 2–10 seçenek, "Kime", bitiş, gizli; bütün hata iletileri, yetki, bildirim | Kodda var; tasarımda ek olarak "Anket oluştur" sayfası, ileri tarihli gönderim, "Anket açar" yetkisi (öneri) |
| [Anketin kimlere gittiği](kimlere-gider.md) | "Tüm okula", "Rol grubuna", "Sınıflara"; velilerin eklenmesi, dondurma, servisçi, "Veliler" grubu | Kodda var; tasarımda ek olarak "7-A öğrencileri" / "7-A velileri" çipleri, ödevin ve mesajın hedefi |
| [Oy verme ve oyu geri alma](oy-verme.md) | Seçenek düğmeleri, "Oyumu geri al", tek oy, iletiler, sınırlar | Kodda var; tasarımda ek olarak çok sorulu doldurma penceresi |
| [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) | Sonuç penceresi (çubuklar, "12 / 40 kişi oy verdi", sekmeler, arama), "Bitir", "Sil", hedefteki kişinin sonucu | Kodda var; tasarımda ek olarak soru soru sonuçlar, yazılı yanıtlar, Excel'e indirme, bitiş uzatma, kilit |
| [Gizli anket](gizli-anket.md) | Kimin neyi seçtiğinin hiç gönderilmemesi, sayıların bitince açılması, kimin oy verdiği | Kodda var; tasarımda ek olarak yeni kutu metni, kişisiz yazılı yanıtlar, kişisiz katılım listesi (tanım) |
| [Anket oluştur](anket-olustur.md) | Tam sayfa düzenleyici: ad, açıklama, soru kartları, beş tür, "Zorunlu", taşı/kopyala/sil, taslak, önizleme, "Yayınla" ve iletileri | Tasarlandı — henüz kodda yok |
| [Çok sorulu anketi doldurma](anket-doldurma.md) | Soru türlerine göre yanıt, "Kaydet, sonra devam et", "Gönder" ve zorunlu soru, "Yanıtını değiştir" | Tasarlandı — henüz kodda yok |
| [Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md) | "Ödeve ekle", "Mesaja ekle", "Anket:" → "Anket ekle", kontrol ekranındaki anket satırı, hedef | Tasarlandı — henüz kodda yok |
| [Saklama ve silinme](saklama-ve-silinme.md) | Elle silme, hesap ve okul silinince, bölüm kapatma, yedek; tasarımda 1 yıl | Kodda var; tasarımda ek olarak 1 yıl kuralı |

Okuma sırası: herkes için önce [Anketler sayfası](anketler-sayfasi.md); oy veren için [Oy verme](oy-verme.md) ve [Sonuçlar](sonuclar.md#öğrenci);
anketi açan için [Anket açma](anket-acma.md), [Anketin kimlere gittiği](kimlere-gider.md), [Gizli anket](gizli-anket.md) ve
[Sonuçlar](sonuclar.md); saklama için [Saklama ve silinme](saklama-ve-silinme.md); tasarlananlar için [Anket oluştur](anket-olustur.md),
[Çok sorulu anketi doldurma](anket-doldurma.md) ve [Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Anketler sayfası | [kendisine sorulanlar kart olarak](anketler-sayfasi.md#öğrenci) | [bütün çocuklarının anketleri; tasarımda çocuk oturumuna göre](anketler-sayfasi.md#veli) | [sorulanlar; yetkiyle "Açtığın anketler"](anketler-sayfasi.md#öğretmen) | [ek rolündeki yetkiyle öğretmen gibi; rolsüzde yok (tasarım)](anketler-sayfasi.md#çalışan) | ["Okulun anketleri"](anketler-sayfasi.md#müdür) | [giremez](anketler-sayfasi.md#servisçi-ve-yönetici) | [giremez](anketler-sayfasi.md#servisçi-ve-yönetici) | — |
| Anket açma | [açamaz](anket-acma.md#öğrenci-ve-veli) | [açamaz](anket-acma.md#öğrenci-ve-veli) | [yetkisi varsa "Yeni anket"](anket-acma.md#öğretmen) | [ek rolündeki yetkiyle](anket-acma.md#çalışan) | [açar; "Tüm okula" da](anket-acma.md#müdür) | — | — | — |
| Anketin kimlere gittiği | [Tüm okul, "Öğrenciler" ya da sınıfı](kimlere-gider.md#öğrenci) | [çocuğu üzerinden ya da "Veliler"](kimlere-gider.md#veli) | [hedefi seçer; tasarımda kendi sınıflarının çipleri](kimlere-gider.md#öğretmen) | [öğretmen gibi; sınıf daraltması işlemez](kimlere-gider.md#çalışan) | [okul / rol / sınıf seçer](kimlere-gider.md#müdür) | ["Tüm okul"da listeye girer, oy veremez](kimlere-gider.md#servisçi) | — | — |
| Oy verme ve oyu geri alma | [verir, değiştirir, geri alır](oy-verme.md#öğrenci) | [kendi oyunu verir](oy-verme.md#veli) | [hedefteyse oy verir](oy-verme.md#öğretmen) | [öğretmen gibi](oy-verme.md#çalışan) | [bütün okula açılmış ankette](oy-verme.md#müdür) | — | — | — |
| Sonuçlar, bitirme, silme | [bitince sayılar ve kendi seçimi](sonuclar.md#öğrenci) | [bitince sayılar](sonuclar.md#veli) | [açtığının sonucu, katılım, "Bitir", "Sil"](sonuclar.md#öğretmen) | [öğretmen gibi](sonuclar.md#çalışan) | [okulun bütün anketleri](sonuclar.md#müdür) | — | — | [SSS'de okur](../acilis-sayfasi/sss.md) |
| Gizli anket | [kartta "kimin neyi seçtiği görünmez"](gizli-anket.md#öğrenci) | [öğrenci gibi](gizli-anket.md#veli) | [açarken seçer; seçimleri görmez](gizli-anket.md#öğretmen) | [öğretmen gibi](gizli-anket.md#çalışan) | [seçimleri görmez, sayılar bitince](gizli-anket.md#müdür) | — | [site yedeğinde oylar var](gizli-anket.md#kurallar-ve-sınırlar) | [SSS'de okur](../acilis-sayfasi/sss.md) |
| Anket oluştur | [oluşturamaz](anket-olustur.md#öğrenci-ve-veli) | [oluşturamaz](anket-olustur.md#öğrenci-ve-veli) | [tam sayfa düzenleyici, taslak, yayınla (tasarım)](anket-olustur.md#öğretmen) | ["Anket açar" yetkisiyle (tasarım)](anket-olustur.md#çalışan) | [aynı sayfa (tasarım)](anket-olustur.md#müdür) | — | — | — |
| Çok sorulu anketi doldurma | [doldurur, taslak, gönderir (tasarım)](anket-doldurma.md#öğrenci) | [her çocuğun oturumunda (tasarım)](anket-doldurma.md#veli) | ["Sana sorulan anketler" (tasarım)](anket-doldurma.md#öğretmen) | [rolü varsa (tasarım)](anket-doldurma.md#çalışan) | [kendisine sorulursa (tasarım)](anket-doldurma.md#müdür) | — | — | — |
| Anketi ödeve ya da mesaja ekleme | [ödevden ya da mesajdan doldurur (tasarım)](odeve-mesaja-ekleme.md#öğrenci) | [mesajdaki anketi doldurur (tasarım)](odeve-mesaja-ekleme.md#veli) | ["Ödeve ekle", "Mesaja ekle", "Anket ekle" (tasarım)](odeve-mesaja-ekleme.md#öğretmen) | [ödev veriyorsa ödevine (tasarım)](odeve-mesaja-ekleme.md#çalışan) | [netleşmedi (tasarım)](odeve-mesaja-ekleme.md#müdür) | — | — | — |
| Saklama ve silinme | [oyunu geri alır; hesapla silinir](saklama-ve-silinme.md#öğrenci-ve-veli) | [öğrenci gibi](saklama-ve-silinme.md#öğrenci-ve-veli) | [açtığını siler](saklama-ve-silinme.md#öğretmen) | [öğretmen gibi](saklama-ve-silinme.md#öğretmen) | [okuldaki her anketi siler; bölüm kapatma silmez](saklama-ve-silinme.md#müdür) | — | [site yedeğinde; okul silinince gider](saklama-ve-silinme.md#yönetici) | — |

Çalışan sütunu: bugünkü sitede ek görevli kişi öğretmen hesabıyla bir ek rol taşır; Müdür Yardımcısı, Rehber Öğretmen ve Zümre Başkanı
şablonlarında "Sınıfa veya gruba toplu mesaj atar" vardır (Müdür Yardımcısı'nda "Okuldaki herkese mesaj atar" da). Hazır Öğretmen
rolünde bu yetki ilk kurulumda yoktur; müdür eklemedikçe öğretmen anket açamaz, yalnız kendisine sorulanları görür. Tasarımda öğretmen de
okula çalışan olarak eklenir, anket açma ayrı bir "Anket açar" yetkisine geçer (öneri) ve rolsüz çalışanın Anketler sayfası yoktur.
Servisçi ve site yöneticisi anket sayfasına giremez. Ziyaretçi anketleri yalnız açılış sayfasından tanır: "Mesaj ve anket" özellik
kartı ve SSS'deki "Anketlerde oyumu kim görür?" ([Açılış sayfası](../acilis-sayfasi/acilis.md), [Sık sorulan sorular](../acilis-sayfasi/sss.md)).
Tasarımdaki eğitmen ve tahta hesaplarında anket yoktur.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## Açık noktalar

Kodlamadan önce kullanıcıya sorulacak ya da tasarımda netleşecekler:

- **Müdürün düzenleyicisi:** Tasarım 1 önizlemesinde müdürün "Anket aç" düğmesi eski bir pencere sürümünü açıyor ve orada "Excel'den
  aktar" düğmesi duruyor. Kullanıcının kararı ("Excel ile değil, editörle", "tam sayfa") geçerli; müdür de "Anket oluştur" sayfasını
  kullanır. Müdürün okul / rol / sınıf hedefinin "Kimler:"de nasıl seçileceği çizilmedi.
- **Yetki:** bugün anket açma "Sınıfa veya gruba toplu mesaj atar"a bağlı. Ayrı "Anket açar" yetkisi öneri (onay bekliyor). Önizlemedeki
  hazır Öğretmen rolünde "Sınıfa ve gruba toplu mesaj" var, "Anket açar" yok; yine de önizlemedeki öğretmen anket oluşturuyor.
- **Hedef:** tasarımda öğretmen "7-A öğrencileri" ile "7-A velileri"ni ayrı seçer; bugün öğrencilere açılan anket velilerine
  kendiliğinden gider. Hangisinin kalacağı belirlenmeli.
- **Sınırlar:** soru ve seçenek sayısı (Excel önerisinde "en çok 50 soru, soru başına 20 seçenek" önerilmişti), kısa ve uzun yanıtın
  uzunluğu, son günün saati (önizlemede yalnız gün), 90 günlük üst sınırın kalıp kalmayacağı tanımda yok.
- **Taslak yanıt:** "Kaydet, sonra devam et" taslağının sunucuda mı (her cihazdan devam) cihazda mı saklanacağı.
- **Oyu geri alma:** bugün "Oyumu geri al" var; tasarımda gönderilen yanıt değiştirilir ama geri çekilmez. Kalıp kalmayacağı sorulmalı.
- **Velinin iki çocuğu:** her çocuk ayrı oturum olunca aynı okul anketi iki çocuğun oturumunda görünür; bir kez mi çocuk başına mı
  yanıtlanacağı kararlaştırılmadı (bugün veli tek oy verir).
- **Gizli ankette katılım:** tanım "katılım listesi (gizli ankette kişi yok)" diyor; bugünkü kodda gizli ankette de kimin oy verdiği
  (neyi seçtiği değil) görünüyor.
- **Ödeve / mesaja ekleme:** eklenen taslak anketin ne zaman yayına gireceği, son gününün ödevin son teslimi mi olacağı, ödeve eklenen
  anketi velinin de yanıtlayıp yanıtlamayacağı, ödev ya da mesaj silinince anketin ne olacağı, müdürün mesajına anket ekleyip
  ekleyemeyeceği, mesaja anket eklemek için hangi yetkinin gerektiği (tanım "toplu mesaj yetkisi olmadan" kuralını yalnız öğretmenin
  kendi ödevi için yazıyor), "Anketi doldur (3/10)"daki sayının anlamı.
- **Öneriler 2–5 onay bekliyor** (tanım): "Doldurmayanlara hatırlat" (anket/quiz/ödev; günde bir), "Veli onay formu" (Katılır/Katılmaz +
  not, liste yazdır/Excel), "Anketi kopyala / şablon", "Koşullu soru" (cevaba göre sonraki soru).
- **Bilinen açıklar** (kod belgelerinde yazılı, kod değiştirilmedi): "Tüm okula" açılan anket servisçilere de gidiyor (bildirim alır,
  hedef sayısına girer) ama servisçi anket sayfasına giremiyor — bu kod belgesinde yazılı değildi, bu belgede bulundu; rol grubunda
  "Yöneticiler" seçeneği yok (sunucu kabul ediyor); "Yeni anket" penceresi yalnız sınıf listesi için bütün mesaj rehberini indiriyor;
  yetkisi alınan öğretmen kendi anketinin listesine ulaşamıyor; "Bitir" onay metni "sonuç oy verenlere de açılır" diyor (gerçekte hedefteki
  herkese); bitiş sunucunun yerel saatiyle yorumlanıyor (sunucu Türkiye saatinde değilse kayar); bitiş anındaki yarışta ileti "Bu ankete
  oy veremezsin" olabiliyor; son açılan sonuç penceresinin katılım listesi aynı sekmede çıkıştan sonra bellekte kalıyor (ekrana gelmez).
- **KILAVUZ'da yanlış ve eksikler** ([belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Anketler ve duyuru okundu bilgisi"):
  - "oy verenler sonucu anket bitince görür" diyor; kodda bitmiş anketin sayıları hedefteki HERKESE (oy vermemiş olana da) açılır.
    Doğrusu: "anketin sorulduğu kişiler sonucu anket bitince görür" (sitenin SSS'si böyle der).
  - "Gizli anket: kimin neyi seçtiği hiç kimseye (açan dahil) gönderilmez, yalnızca sayılar." eksik: gizli ankette sayılar da anket
    bitene kadar açana ve müdüre gösterilmez; oy zamanı hiç gösterilmez; yöneten yalnız kimin oy verdiğini görür.
  - "Toplu mesaj yetkisi olan kişi … okula, rol grubuna ya da sınıflara … anket açar" diyor; bütün okula açmak ayrıca "Okuldaki herkese
    mesaj atar" yetkisi ister.
  - (Yanlış değil, uyumsuzluk) "Yetki listesi" tablosunda Mesajlaşma satırı "Sınıfa/gruba toplu mesaj ve anket · Herkese mesaj" diye
    kısaltır; anlamı doğru (anket açma bu yetkiye bağlı), ama rol ekranındaki adlar "Sınıfa veya gruba toplu mesaj atar" ve "Okuldaki
    herkese mesaj atar"dır ve ekranda "anket" geçmez.

## İlgili öbür klasörler

- [Mesajlar ve duyurular](../mesaj/README.md) — anketin hedefi duyuru kuralıyla çözülür; okundu listesiyle aynı düzen; tasarımda anketi
  mesaja ekleme, ileri tarihli gönderim.
- [Ödevler](../odev/README.md) — tasarımda ödeve anket ekleme ve kontrol ekranındaki anket satırı.
- [Quiz](../quiz/README.md) — quiz düzenleyicisi ve "Soruları Excel'den aktarma" (Excel'in anket yerine gittiği yer).
- [Sınavlar](../sinav/README.md) — "sınavları Excel'le olur" sözü.
- [Bildirimler](../bildirim/README.md) — "Anket: <soru>"; veli de hedef olduğu için ayrıca kopya gelmez.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Sınıfa veya gruba toplu mesaj atar", "Okuldaki herkese mesaj atar", tasarımda
  "Anket açar"; hazır şablonlar.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — rolsüz çalışan, okuldan çıkarma.
- [Özellikler](../ozellikler/README.md) — "Anketler" bölümünü kapatma.
- [Yazı düzenleyici](../yazi-yazma/README.md) — anket açıklaması ve soru açıklaması (tasarım).
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — anket cevapları kimde görünür, ne kadar saklanır.
- [Hesap ayarları](../ayarlar/README.md) — Hesabımı sil, Verilerimi indir.
- [Site yönetimi](../yonetim/README.md) — site yedekleri.
- [İşlem kaydı](../islem-kaydi/README.md) — anketler işlem kaydına girmez.
- [Açılış sayfası](../acilis-sayfasi/README.md) — "Mesaj ve anket" kartı, SSS.
- [Uygulama](../uygulama/README.md) — tasarımda yerel Android uygulamasında "Anketler (oy ver, sonuç)".
- [Dil ve çeviri](../dil/README.md) — anket ekranlarının yazıları çeviri kataloğuna girecek (anketin kendi metni çevrilmez).

## Kod belgeleri

- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (sayfanın, oy kartının, sonuç penceresinin ve
  "Yeni anket" penceresinin tamamı), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menüdeki "Anketler",
  `SAYFA_OZELLIK`), [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) (`secililer`, okundu listesiyle ortak
  görünüm), [public/js/parcalar/16c-ozellikler.md](../../public/js/parcalar/16c-ozellikler.md) (bölüm kapatma),
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`26-anket-okul-hayati.css`).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (bütün uçlar), [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md)
  (`mesajAlicilariCoz`, `GET /api/mesajlar/hedefler`), [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) (`anketler →
  anket` kapısı), [sunucu/yetki.md](../../sunucu/yetki.md) (`mesaj.toplu`, `mesaj.herkese`, şablonlar), [sunucu/api.md](../../sunucu/api.md).
- Veri: [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)
  (şema 006), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (toplu bildirim),
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedek).
- Testler: [testler/test-anket.md](../../testler/test-anket.md), [testler/test-yedek.md](../../testler/test-yedek.md),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md), [testler/test-servis-konum.md](../../testler/test-servis-konum.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md), [testler/test-ozellikler.md](../../testler/test-ozellikler.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Anketler ve duyuru okundu bilgisi"; aydınlatma metni
  [public/kvkk/KLASOR.md](../../public/kvkk/KLASOR.md) ("Anket cevapları" satırı).
