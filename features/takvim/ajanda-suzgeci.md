# Takvim ve ajanda · Ajandanın süzgeç kutucukları

**Durum:** Tasarlandı — henüz kodda yok

Ajandanın başındaki onay kutulu çipler: "Ödev", "Sınav", "Duyuru", "Özel gün", "Toplantı", "Etkinlik", "Hatırlatıcılarım". İşaretini
kaldırdığın türü ajandadan gizler; seçimin bu tarayıcıda hatırlanır.

## Ne işe yarar

Ajanda kalabalıklaşınca yalnız ilgilendiğin türlere bakarsın: sınav haftasında yalnız sınavlar, servis değişikliği beklerken yalnız
duyurular. Kullanıcı 27 Eylül'de ajandanın "checkbox ile ödev / özel gün / duyuru / sınav gibi" süzülmesini istedi; tanım yedi kutucuk
koydu ve seçimin tarayıcıda hatırlanmasını yazdı.

## Nereden açılır

- **Tasarımda:** Takvim → **"Ajanda"** sekmesi → başlık satırının hemen altındaki çip sırası ([Ajanda](ajanda.md)).
- Ay görünümünde ve gün listesinde süzgeç **yoktur**; takvim her şeyi gösterir ([Ay görünümü](ay-gorunumu.md),
  [Gün ayrıntısı](gun-ayrintisi.md)).
- Bugünkü sitede ajanda olmadığı için bu süzgeç de yok.

## Adım adım

### Bütün takvimi olan roller (tasarımda)

1. Ajanda sekmesini aç. Çipler soldan sağa, her birinde onay kutusu ve türün renginde bir nokta:

   | Çip | Hangi kayıtları süzer | Renk |
   |---|---|---|
   | **"Ödev"** | ödevler (yalnız öğrenci, veli ve öğretmende görünür) | kırmızı |
   | **"Sınav"** | sınavlar | mavi |
   | **"Duyuru"** | ajandana eklenmiş duyurular | yeşil |
   | **"Özel gün"** | resmî tatiller ve özel günler (okulun eğitim yılı günleri ve yarıyıl tatili dahil) | ana renk |
   | **"Toplantı"** | toplantılar | lacivert |
   | **"Etkinlik"** | okul etkinlikleri **ve etütler** | mor |
   | **"Hatırlatıcılarım"** | kendi hatırlatıcıların | gri |

2. İlk açılışta **hepsi işaretli** gelir.
3. Bir çipin işaretini kaldır: o türün kayıtları ajandadan hemen kalkar; "Bugün", "Bu hafta", "Sonra" ve "Geçmiş"in sayıları ile
   başlıktaki "<n> kayıt" yeniden sayılır. İşaretsiz çip soluk ve kesik çizgili kenarlı görünür.
4. Yeniden işaretle: kayıtlar geri gelir. Odak bastığın çipte kalır (klavyeyle gezenler için).
5. Seçimin **bu tarayıcıda hatırlanır**: Takvim'i kapatıp açtığında, sayfayı yenilediğinde aynı çipler işaretsiz kalır. Başka cihazda
   ya da başka tarayıcıda yeniden seçersin.
6. Çipler parmakla basılacak büyüklüktedir (telefonda 44 piksel yüksek); sığmazsa alt satıra geçer.

### Öğrenci, veli, öğretmen

- Yedi çipin hepsi. Örnek: öğrenci sınav haftasında "Ödev", "Duyuru", "Özel gün", "Toplantı", "Etkinlik", "Hatırlatıcılarım"ın işaretini
  kaldırır, ajandada yalnız sınavları kalır.

### Müdür ve servisçi

- **"Ödev"** çipi yoktur (takvimlerinde ödev yok); altı çip. Servisçi örneği: yalnız "Duyuru"yu açık bırakıp servis değişikliklerini
  izler.

## Kurallar ve sınırlar

- **Yalnız ajandayı süzer:** ay görünümü ve gün listesi süzgeçten etkilenmez.
- **Yalnız gösterir/gizler:** kayıtları silmez, hatırlatıcıları kapatmaz; "Hatırlatıcılarım"ın işaretini kaldırmak hatırlatma
  bildirimlerini durdurmaz ([Durdurma ve yeniden başlatma](../hatirlatici/durdurma-ve-baslatma.md)).
- **Seçim tarayıcıya özeldir:** hesabına ya da sunucuya yazılmaz. Tasarım 1 önizlemesinde aynı tarayıcıdaki bütün oturumlar (velinin
  çocuk oturumları dahil) aynı seçimi paylaşır.
- **Adlar:** tanımda kutucuğun adı "Özel gün/tatil"; önizlemede "Özel gün". "Etkinlik" çipinin etütleri de kapsaması önizlemenin
  kararıdır; tanımda etüt ayrıca anılmaz.
- **Kapalı bölüm:** okul bir bölümü kapattıysa (ör. Ödevler) o türün kayıtları zaten gelmez (tanım). Önizlemede kapalı bölüm durumu
  çizilmemiş; kodlanırken kapalı bölümün çipi de gizlenmeli (öneri; bildirim panelinin sekmelerindeki kuralla aynı).
- **Ödev çipi** yalnız ödevi olan rollerdedir (öğrenci, veli, öğretmen).

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Ay görünümü](ay-gorunumu.md) · [Gün ayrıntısı](gun-ayrintisi.md) ·
[Takvim kimin gözünden](kimin-takvimi.md) · [Takvime ekle](etkinlik-ekleme.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) ·
[Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) · [Ajanda](ajanda.md) · [Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md) ·
[Durdurma ve yeniden başlatma](../hatirlatici/durdurma-ve-baslatma.md) · [Bildirim paneli sekmeleri](../bildirim/sekmeler.md) ·
[Kapalı bölüm](../ozellikler/kapali-bolum.md) · [Ödevlerde süzgeçler](../odev/suzgecler.md).

## Kod tarafı

- **Bugün kodda yok.** Tanım: mesaj-ajanda tanımının Ajanda bölümü ("Filtre KUTUCUKLARI: Ödev · Sınav · Duyuru · Özel gün/tatil ·
  Toplantı · Etkinlik · Hatırlatıcılarım (seçim tarayıcıda hatırlanır)").
- Tasarım: Tasarım 1 önizlemesi (Ajanda sekmesindeki çipler, seçimin tarayıcıda saklanması); kodlanınca bu belgenin Durum satırı ve bu
  bölüm güncellenir.
- Bugünkü takvimin renk adları ve türleri: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (`OLAY_AD`).

## Sık sorulanlar

- **Bir türü kapattım, takvimde hâlâ görünüyor.** Süzgeç yalnız ajandayı süzer; takvim her şeyi gösterir.
- **Telefonda seçtiğim süzgeç bilgisayarda yok.** Seçim her tarayıcıda ayrı saklanır.
- **Etütlerim hangi çipte?** "Etkinlik" çipinde.
- **Müdürüm, "Ödev" çipi neden yok?** Müdürün takviminde ve ajandasında ödev yer almaz.

## Sırada

- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: ajanda ve
  süzgeç kutucukları.
- Arayüz önizlemesi (Tasarım 1): Ajanda sekmesindeki çipler.
