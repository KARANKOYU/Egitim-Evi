# Devamsızlık ve yoklama · Kim yoklama alır, kim kimi görür

**Durum:** Kodda var; tasarımda ek olarak daraltmanın yetki başına değil rol başına olması (rolün "Kapsam"ı "Devamsızlığı görür"e de uygulanır), hazır Öğretmen rolünün "kendi dersleri · kendi sınıfları" kapsamı, rolsüz çalışanın yoklamaya atanamaması, müdürün "Kendi derslerim"inin (Yoklama) ve öğretmenin menüsündeki ayrı "Yoklama"nın kalkması (yoklamaya ders programından girilir), yeni rol şablonları (Nöbetçi öğretmene "Yoklama alır", Sınıf öğretmeni — öneri) ve öğrenci/velinin yalnız aktif ve bir önceki yılı görmesi.

Devamsızlık bölümündeki iki yetkinin ("Yoklama alır", "Okulun tüm devamsızlığını görür"), ders ve sınıf daraltmasının, kapalı bölümün
ve geçmiş eğitim yılının kuralları.

## Ne işe yarar

Yoklama bir öğrenciyi "devamsız" yazar ve veliye bildirim gönderir; bu yüzden herkes her derse yoklama alamaz. Kod yorumunun açıkladığı
kaygı: hazır Öğretmen rolünde "Yoklama alır" daraltmasız açık gelir; tek başına yetseydi herhangi bir öğretmen hiç girmediği bir
derste öğrenciyi devamsız yazabilirdi. Kural bu yüzden "kendi dersin, ya da müdürün açıkça verdiği ders". Dökümü görmek de aynı
dikkatle sınırlıdır: öğrenci kendisini, veli çocuğunu, personel ancak ilgili olduğu öğrenciyi görür. Müdür bölümü okulunda hiç
kullanmıyorsa kapatabilir; eski yıllar değiştirilemez.

## Nereden açılır

- **Müdür:** **"Roller ve Yetkiler"** → hazır **Öğretmen** rolü ya da bir ek rol → yetki listesinde **"Devamsızlık"** grubu:
  **"Yoklama alır"** (yanında **"Dersler"** ve **"Sınıflar"** daraltması) ve **"Okulun tüm devamsızlığını görür"**
  ([Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md),
  [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md)).
- **Müdür:** **"Özellikler"** → **"Devamsızlık"** (**"Ders yoklaması, devamsızlık dökümü, veliye devamsızlık bildirimi."**) aç /
  kapat ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).
- **Herkes:** üst şeritteki eğitim yılı seçicisi ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).

Tasarımda: rol düzenleyicinin **"Devamsızlık ve etüt"** grubunda **"Yoklama alır"** ve **"Devamsızlığı görür"**. Daraltma yetki başına
değil **rol başınadır**: rolün tek bir **"Kapsam"** alanı var, **Ders** (**"Bütün dersler"**, **"Kendi dersleri"** ya da seçili dersler)
ve **Sınıflar** (**"Bütün sınıflar"**, **"Kendi sınıfları"** ya da seçili sınıflar); altında **"Kapsam: … · "Derse atanabilir" gibi
yetkiler yalnız bu ders ve sınıflarda geçer."** Bu kapsam rolün bütün yetkilerine, iki devamsızlık yetkisine de uygulanır
([Rol düzenleyici](../roller-yetkiler/rol-duzenleyici.md)).

## Adım adım

### Müdür (bugünkü site)

**Öğretmenlerin yoklama yetkisini ayarlamak**

1. "Roller ve Yetkiler" → hazır **Öğretmen** rolü. İlk kurulumda **"Yoklama alır"** açıktır; **"Okulun tüm devamsızlığını görür"**
   kapalı.
2. "Yoklama alır"ı kapatırsan bütün öğretmenlerin menüsünden **"Yoklama"** ve ders programındaki yoklama düğmesi kalkar (ana sayfa
   kutucuğu kalır; basınca **"Yoklama yetkin yok"**).
3. Öğretmen "Yoklama alır" ile **yalnız kendi derslerine** yoklama alır (ders ona atanmış olmalı: [Derse öğretmen atama](../siniflar-dersler/ders-atama.md)).

**Birine başka derslerin yoklamasını vermek (ör. nöbetçi)**

1. Bir ek rol aç ya da var olanı düzenle ([Özel roller](../roller-yetkiler/ozel-roller.md)).
2. **"Yoklama alır"**ı aç ve **"Dersler"** ve/veya **"Sınıflar"**dan hangi ders ve sınıflar olduğunu **seç**. Seçim yapmadan (daraltmasız)
   verilen "Yoklama alır" öğretmene başkasının dersini AÇMAZ.
3. Rolü kişiye ver. Kişinin "Yoklama" sayfasında o derslerin kutucukları da çıkar; o sınıfların öğrencilerinin dökümünü de görür.

**Okulun bütün devamsızlığını göstermek (ör. müdür yardımcısı, rehber)**

1. Ek rolde **"Okulun tüm devamsızlığını görür"**ü aç. Kişinin menüsünde ek rolün adının altında **"Devamsızlık"** çıkar; okuldaki her
   öğrencinin dökümünü ve gününü görür.
2. Bugün "Devamsızlık" sayfası ayrıca **"Sınıf açar ve siler"** ve öğrenci listesi yetkisi ("Öğrenci bilgilerini düzenler" ya da "Öğrenci
   portalına girer") ister. Hazır şablonlardan **"Müdür Yardımcısı"**nda bunlar var; **"Rehber Öğretmen"** ve **"Nöbetçi Öğretmen"**de
   yok, onlarda sayfa **"Bu işlem için yetkin yok"** der (bilinen açık).

**Bölümü kapatmak**

1. "Özellikler" → "Devamsızlık"ı kapat. Okuldaki herkesin menüsünden ve ana sayfasından "Yoklama", "Devamsızlık", "Devamsızlığım",
   "Devamsızlığı" kalkar; ders programındaki yoklama düğmesi çıkmaz.
2. Kayıtlar silinmez; yeniden açınca eskisi gibi görünür.

### Öğretmen, öğrenci, veli (bugünkü site)

Bu kuralları ayarlamazlar; yetkileri dışındaki işte ekranda sunucunun iletisini görürler (aşağıda).

### Tasarımda (Tasarım 1 önizlemesi ve tanımlar)

- **Hazır Öğretmen rolü:** **"Derse girer, ödev ve sınav verir, yoklama alır"**; yetkileri arasında **"Yoklama alır"**, kapsamı **"Kendi
  dersleri · kendi sınıfları"**.
- **"Devamsızlığı görür"** rolün kapsamına bağlıdır: kapsamı seçili sınıflar (ya da "Kendi sınıfları") olan rol yalnız o sınıfların
  devamsızlığını görür. Önizlemedeki **"Rehber öğretmen"** rolünün kapsamı bütün okuldur; **"Sınıf öğretmeni"** önerisi kendi sınıfıyla
  sınırlıdır.
- **Rol şablonları** (önizleme; tanımı "Özel roller" önerisi, onay bekliyor): **"Müdür yardımcısı"**, **"Rehber öğretmen"**, **"Etüt
  sorumlusu"** — "Devamsızlığı görür"; **"Nöbetçi öğretmen"** — "Yoklama alır" ve "Devamsızlığı görür", kapsam bütün dersler ve
  sınıflar; **"Sınıf öğretmeni"** — "Devamsızlığı görür", kendi sınıfı ([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)).
- **Rolsüz çalışan** (çalışan olarak ekleme): okulda hiçbir bölüm açık değildir; öğretmen rolü olmayan çalışan yoklamaya atanamaz
  ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
- **Müdür:** "Kendi derslerim" (Sınavlar, Yoklama) menüden kalkar; müdür yoklama almaz, "Devamsızlık" sayfasından bakar ve düzeltir.
- **Öğretmen:** menüdeki ayrı **"Yoklama"** kalkar (kullanıcı 3 Ekim 19:20); "Yoklama alır" yetkisi ders programındaki yoklama
  penceresini açar ([Ders programından yoklama](programdan-yoklama.md)). **Açık nokta:** öğretmenin ders programı yalnız kendi derslerini
  gösterdiği için, ek rolde başka ders ve sınıflar için "Yoklama alır" verilen kişinin (ör. nöbetçi) o derslere nereden gireceği
  kararlaştırılmadı.
- **Tahta hesabı** yoklama almaz (öneri); sınıf listesinde yalnız ad soyad ve bugünkü "Geldi/Gelmedi" durumunu görür, izin nedenini görmez
  ([Öğrenci seçme](../tahta/ogrenci-secme.md)).
- **Öğrenci ve veli** yalnız aktif ve bir önceki eğitim yılını görür; eskisini isterse **"Eski yıllar yalnız okul yönetimine açık"**.

## Kurallar ve sınırlar

### Yoklama alma ve düzeltme

| Kim | Hangi derse |
|---|---|
| Müdür | okulun her dersine |
| Öğretmen | kendi dersine (dersin öğretmeni oysa) |
| Öğretmen + ek rolde "Yoklama alır" (ders/sınıf seçilmiş) | ayrıca seçilen ders ve sınıflara |
| Öğretmen + ek rolde daraltmasız "Yoklama alır" | yalnız kendi dersine (daraltmasız yetki başkasının dersini açmaz) |
| Öğrenci, veli, servisçi, yönetici | hiçbirine (**"Yoklama yetkin yok"**) |

Müdürün tek ders düzeltmesi de aynı kurala bağlıdır: açılır kutu ve kayıt, o derse yoklama alabilene açıktır (**"Bu ders için yetkin
yok"**).

### Döküm görme

| Kim | Kimin dökümünü |
|---|---|
| Öğrenci | yalnız kendisininkini |
| Veli (rolü ne olursa olsun: öğretmen ya da müdür de kendi çocuğunun velisidir) | bağlı çocuğununkini (başka okulda olsa da) |
| Müdür | okulundaki her öğrencininkini |
| "Okulun tüm devamsızlığını görür" yetkili | okulundaki her öğrencininkini |
| Öğrencinin derslerine giren öğretmen | o öğrencininkini |
| Ek rolde "Yoklama alır" daraltmayla verilmiş | daraltmadaki sınıfların öğrencilerininkini (yalnız ders seçilip sınıf seçilmediyse bütün sınıfların); yalnız döküm: bir günün ders ders dökümü bu yetkiyle açılmaz |
| Öğrenci, bir günün ders ders dökümünde | kendi gününü (müdür ekranının kullandığı uç öğrenciye de açıktır; bugün öğrencinin ekranı bunu kullanmaz) |
| Öbürleri | göremez: **"Bu öğrencinin devamsızlığını görme yetkin yok"** (bir günün dökümünde **"Bu öğrencinin kaydını görme yetkin yok"**) |

Okulun son 30 günlük öğrenci başına özeti yalnız "Okulun tüm devamsızlığını görür" yetkilisine açıktır (**"Okul geneli devamsızlığı
görme yetkin yok"**); bugün hiçbir ekran bu özeti göstermez.

### Kapalı bölüm, geçmiş yıl, nakil

- **Kapalı bölüm:** sayfada **"Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir."**; sunucu her isteği **"Devamsızlık
  bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."** ile reddeder. Veli çocuğunun okulunun kuralına bağlıdır; çocuklarından
  birinin okulunda açıksa menüde "Devamsızlık" görünür ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Geçmiş yıl:** kayıtlar yıla damgalanır; geçmiş yıla bakarken yoklama ve düzeltme **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt
  okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."** ile reddedilir; dökümler bakılan yılın kayıtlarını gösterir.
- **Nakil:** öğrenci okul değiştirince eski okulun kayıtları eski okulda kalır; yeni okul görmez, eski okul da öğrenciyi artık göremez;
  öğrenci ve velisi yıl seçicisinin **"Önceki okullar"** döneminden görür ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).
- **Okulsuz hesap** (ör. yönetici) devamsızlık uçlarını kullanamaz.

### Bilinen açıklar (bugünkü kod)

- Menü "Devamsızlık"ı "Okulun tüm devamsızlığını görür" yetkili öğretmene gösterir, ama sayfa "Sınıf açar ve siler" ister (yukarıda).
- Ana sayfadaki "Yoklama" kutucuğu yetkiye bakmaz.
- Ders programındaki yoklama düğmesi yalnız yetkinin varlığına bakar, kapsamına değil (öğretmen orada yalnız kendi derslerini gördüğü için
  sorun çıkmaz).
- [Kullanıcı kılavuzundaki](../../belge/KILAVUZ.md) "Yoklama (ders programından)" bölümü "ya da **Yoklama alır** yetkisi daraltılmamış
  biri" der; kodda tersidir: daraltmasız yetki başkasının dersini açmaz, açmak için ders/sınıf seçilmelidir.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Ders yoklaması](ders-yoklamasi.md) · [Ders programından yoklama](programdan-yoklama.md) ·
[Okulun devamsızlığı](okulun-devamsizligi.md) · [Devamsızlığım](devamsizligim.md) · [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md).

**İlgili:** [Yetki listesi](../roller-yetkiler/yetki-listesi.md) · [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md) ·
[Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md) · [Özel roller](../roller-yetkiler/ozel-roller.md) ·
[Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md) · [Rol atama](../ogretmenler-calisanlar/rol-atama.md) ·
[Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md) · [Kapalı bölüm](../ozellikler/kapali-bolum.md) ·
[Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md) · [Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md) ·
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) · [Sınavlar: yetkiler, kapalı bölüm ve geçmiş yıl](../sinav/yetki-ve-kapsam.md)
(aynı kalıp).

## Kod tarafı

- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) — `yoklamaYetkisi` (öğretmende ek şart), `acikSinifKapsami`,
  `veliBakabilir`, `ogrenci` / `gun` / `ozet` / `benim` uçlarındaki görme kuralları. Yetkiler ve şablonlar [sunucu/yetki.md](../../sunucu/yetki.md)
  (`devamsizlik.al` kapsamlı, `devamsizlik.gor`, `OGRETMEN_VARSAYILAN`, `ROL_SABLONLARI`, `yetkiVarMi`, `yetkiKapsami`, `kapsamUyar`).
  Bölüm kapısı [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md); geçmiş yıl kapısı [sunucu/api.md](../../sunucu/api.md)
  (`arsivYazmasiMi`: `yoklama`, `isaretle`); yıl süzgeci [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md);
  öğrencinin öğretmenleri [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`teachersOfStudent`).
- Ön yüz: menü [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`yetkim('devamsizlik.al')` → "Yoklama",
  `yetkim('devamsizlik.gor')` → "Devamsızlık", `SAYFA_OZELLIK`); kapalı sayfa [07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md);
  Özellikler [16c-ozellikler.md](../../public/js/parcalar/16c-ozellikler.md).
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md), [testler/girdi-denetimi.md](../../testler/girdi-denetimi.md),
  [testler/test-devamsizlik.md](../../testler/test-devamsizlik.md) (yetkisiz yoklama, öğrencinin başkasınınkini görememesi),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md),
  [testler/test-nakil.md](../../testler/test-nakil.md).
- Tasarım: Tasarım 1 önizlemesinin müdür modülü (rol düzenleyicide kapsam, hazır Öğretmen rolü, şablonlar).

## Sık sorulanlar

- **Nöbetteki öğretmen boş dersin yoklamasını alsın istiyorum.** Ona bir ek rol ver, "Yoklama alır"da o dersleri ya da sınıfları seç.
  Seçmeden verirsen yalnız kendi derslerine alır.
- **Rehber öğretmen devamsızlığı nasıl görür?** "Okulun tüm devamsızlığını görür" ile öğrencilerin dökümünü görür; bugün "Devamsızlık"
  sayfası "Sınıf açar ve siler" olmadan açılmadığı için öğrencinin portalından ("Devamsızlığı") bakar.
- **Öğrenci arkadaşının devamsızlığını görebilir mi?** Hayır.
- **Bölümü kapattım, kayıtlar silindi mi?** Hayır; açınca geri gelir.
- **Geçen yılın yoklamasını düzeltebilir miyim?** Hayır; geçmiş yıl salt okunurdur.

## Sırada

- **Özel roller** (öneri, onay bekliyor): yeni şablonlar ve gruplu yetkiler; "Devamsızlığı görür"ün sınıf kapsamı.
- **Çalışan olarak ekleme:** rolsüz çalışan; öğretmen olmayan çalışan yoklamaya atanamaz.
- **Optimizasyon + saklama süreleri:** öğrenci ve veli yalnız aktif ve bir önceki yılı görür.
- **Güvenlik denetimi:** yetki dağıtma kuralları ("Rol oluşturur ve düzenler").
- **Eklentiler** (kodlanmayacak, belgelenecek): eklentinin yoklama okuma/yazma izni ve değer geçmişi.
