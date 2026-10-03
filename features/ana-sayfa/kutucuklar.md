# Ana sayfa · Renkli kutucuklar

**Durum:** Kodda var; tasarımda ek olarak kutucukların hepsi aynı boyda ve düzgün ızgarada (geniş ekranda sütun sayısı kutucuk sayısına göre seçilir, son satırda tek kutucuk kalmaz; telefonda iki sütun), alt yazılar günün durumunu söyler ("2 tanesi bugün", "1 getirmedi", "eve dönüş yolda"), köşedeki sayı dikkat isteyen işi sayar, Mesajlar kutucuğu her rolde vardır, Ayarlar kutucuğu hiçbir rolde yoktur (Tasarım 1 önizlemesi; kullanıcının 3 Ekim sözü: "logolar eski aynı boyutta idi ve bu çok karışık").

Her rolün ana sayfasının üstündeki renkli, büyük düğmeler: her biri bir bölümün adını, kısa durumunu ve gerekiyorsa bir sayıyı
taşır, basınca o bölüme götürür.

## Ne işe yarar

Okul yazılımlarındaki renkli panel görünümü: her bölüm kendi rengiyle, arkasında soluk bir simgeyle durur; telefonda başparmakla
rahat basılır. Kutucuk yalnız bir kısayol değil, küçük bir özettir: "3 aktif ödev", "Ortalama 85.5", "2 öğrenci bağlı".

Yerleşimin geçmişi: kullanıcı 8 Eylül'de "tüm hepsi karışık hepsi farklı yerlerde olucak şekilde kutucuk dolu olsun" dedi;
tasarımda bir süre farklı boyda, karışık ("bento") bir yerleşim denendi. 3 Ekim akşamı önizlemeyi gezen kullanıcı
"logolar eski aynı boyutta idi ve bu çok karışık" dedi; karışık yerleşim geri alındı. **Son karar: hepsi aynı boyda.**

## Nereden açılır

Her rolün ana sayfasında, başlığın (ve öğrencide ödev serisi şeridinin) hemen altında:
[öğrenci](ogrenci-ana-sayfasi.md), [veli](veli-ana-sayfasi.md), [öğretmen](ogretmen-ana-sayfasi.md), [müdür](mudur-ana-sayfasi.md),
[yönetici](yonetici-ana-sayfasi.md) (bugünkü kod); tasarımda ayrıca [servisçi](servisci-ana-sayfasi.md) ve eğitmenin panelinin
ana sayfası ([Eğitmen paneli](../egitim-icerikleri/egitmen-paneli.md)). Rolsüz çalışanın ana sayfasında kutucuk yoktur
([Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md)). Tasarımdaki tahta hesabı sınıf seçerken aynı görünüşte kutucuklar
kullanır ([Sınıf seçme](../tahta/sinif-secme.md)).

## Adım adım

### Herkes (öğrenci, veli, öğretmen, müdür; tasarımda servisçi; kodda yönetici)

1. Ana sayfayı aç. Kutucuklar bir ızgara hâlinde dizilir.
2. Her kutucukta:
   - renkli zemin (tek ton, geçişsiz);
   - sol altta kalın **ad** ("Ödevler");
   - adın altında küçük **alt yazı** (kısa durum: "3 aktif ödev", "Aktif ödev yok");
   - sağ altta büyük, soluk **simge** (yalnız süs; ekran okuyucu okumaz);
   - gerekiyorsa sağ üstte beyaz bir hap içinde **sayı** (sıfırsa hiç çıkmaz).
3. Kutucuğa bas (ya da klavyeyle gelip Enter): o bölümün sayfası açılır (menüdeki aynı satır gibi).
4. Okulun kapattığı bir bölümün kutucuğu hiç görünmez ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).

**Bugünkü kodda rol rol kutucuklar** (sırasıyla):

| Rol | Kutucuklar (alt yazı) |
|---|---|
| Öğrenci | Ödevler ("N aktif ödev", sayı) · Sınavlarım ("N sınav grubu") · İlerleyişim ("Ortalama X" / "Not girilmedi") · Ayarlar ("Hesabın ve veli kodun") |
| Veli | Ödevler ("N aktif ödev", sayı) · Devamsızlık ("Derse katılım") · İlerleyiş ("Ödev ve sınav durumu") · Mesajlar ("Öğretmenlerle yazışma") · Çocuklarım ("N öğrenci bağlı", sayı) · Ayarlar ("Hesap bilgilerin") |
| Öğretmen | Ödevler ("N aktif ödev", sayı) · Sınavlar ("Sınav grupları ve notlar") · Yoklama ("Derse katılım al") · Ayarlar ("Hesap bilgilerin") |
| Müdür | Öğretmenler ("N öğretmen" / "N başvuru bekliyor", sayı) · Öğrenciler ("N öğrenci") · Sınıflar ("N sınıf") · Ders Programı ("Haftalık program ve ders atamaları") · Devamsızlık ("Okul geneli yoklama özeti") · Excel Aktarım ("Toplu öğrenci ve program") · Ayarlar ("Hesap bilgilerin") |
| Sistem yöneticisi | Okullar ("N okul kayıtlı · Okul aç") · Müdürler ("N müdür") · Site Ayarları ("İletişim, yapımcılar, okul adresleri") · Yönetici Dosyası ("admins.json") · Yedekleme ("Veri kopyaları") · Ayarlar ("Yönetici hesabın") |

**Tasarımda (Tasarım 1 önizlemesi):**

1. **Hepsi aynı boyda**, düzgün ızgarada:
   - geniş ekranda (700 px ve üstü) sütun sayısı kutucuk sayısına göre: 5'e kadar kutucuk tek satırda (kaç tane ise o kadar
     sütun), 6 ya da 9 kutucuk 3 sütun, öbür sayılar (7, 8) 4 sütun; böylece son satırda tek başına bir kutucuk kalmaz;
   - orta genişlikte her sütun en az 176 px;
   - telefonda (520 px ve altı) **iki sütun**.
2. Köşeleri yuvarlak, gölgeli; üstüne gelince yükselmek yerine hafifçe büyür.
3. **Alt yazılar günün durumunu** söyler, sabit açıklama değil: öğrencide "2 tanesi bugün", "yeni sonuç var", "şimdi: Matematik",
   "ortalama 84,4"; velide "1 getirmedi", "sabah bindi · 07:41"; öğretmende "2 dersin yoklaması alınmadı", "2 kontrol bekliyor";
   müdürde "bugün 14 öğrenci", "3 servis yolda"; servisçide "sabah yoklaması açık", "eve dönüş yolda". Sayılar Türkçe yazılır
   (virgüllü ondalık).
4. **Köşedeki sayı dikkat isteyen işi** sayar: bugün son günü olan ödev, okunmamış mesaj, yoklaması alınmamış ders, kontrol
   bekleyen ödev, bugün gelmeyen öğrenci.
5. **Rol rol kutucuklar:**

   | Rol | Kutucuklar (renk) |
   |---|---|
   | Öğrenci | Ödevler (kırmızı) · Sınavlarım (mavi) · Mesajlar (yeşil) · Ders programı (turuncu) · İlerleyişim (camgöbeği) · Devamsızlık (mor) |
   | Veli (çocuğun oturumu) | Ödevler (kırmızı) · Devamsızlık (mor) · İlerleyiş (mavi) · Servis (sarı) · Mesajlar (yeşil) · "<çocuk>'in telefonu" (camgöbeği) |
   | Öğretmen | Yoklama (kırmızı) · Ödevler (turuncu) · Sınavlar (mavi) · Mesajlar (yeşil) · Sınıflarım (mor) · Ders programım (camgöbeği) |
   | Müdür | Öğrenciler (mor) · Çalışanlar (mavi) · Devamsızlık (kırmızı) · Sınıflar (turuncu) · Mesajlar (yeşil) · Servisler (sarı) · Özellikler (gri) |
   | Servisçi | Yoklama (sarı) · Mesajlar (yeşil) · Takvim (turuncu) · Hatırlatıcılar (gri) |
   | Eğitmen (eğitmen paneli) | Videolarım (kırmızı) · Video yükle (mavi) · Oynatma listelerim (mor) · Bildirilenler (turuncu) · İstatistikler (camgöbeği) — [Eğitmen paneli](../egitim-icerikleri/egitmen-paneli.md) |

   Ayarlar kutucuğu yoktur: Hesap ayarları her rolde sağ üstteki profil menüsündedir ([Profil menüsü](../menu-ve-arama/profil-menusu.md)).
   Öğrencinin dershane oturumunun ve yöneticinin panelinin ana sayfasında kutucuk yoktur.
6. **Kapalı bölüm** (müdürün Özellikler'inde): kapatılan bölümün kutucuğu bütün rollerin ana sayfasından kalkar; o bölüme giden
   "hepsi →" bağlantılı liste de kalkar. Önizlemede kapatılabilen bölümler: Ödevler, Sınavlar, Devamsızlık, Etütler, Servis, Yemek
   listesi, Anketler, Mesajlar ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).
7. Okul kendi CSS'iyle kutucukların görünüşünü (ör. köşe yuvarlaklığı) değiştirebilir; önizlemedeki örnek "Ana sayfa
   kutucuklarını biraz daha yuvarlak yap" ([Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md)).

## Kurallar ve sınırlar

- **Görünüş (bugünkü kod):** kutucuk en az 116 px yüksek; ızgarada her sütun en az 168 px, aralık 14 px. 520 px altında sütun en
  az 140 px, kutucuk 100 px, ad 15 px. Sayfa açılınca kutucuklar 50 ms arayla sırayla belirir. Üstüne gelince 3 px yükselir,
  gölgesi büyür; klavyeyle gelince 3 px'lik çerçeve alır. Cihazda "hareketi azalt" açıksa kıpırdamaz, belirme canlandırması da
  olmaz.
- **Renkler** iki temada (açık, koyu) aynıdır ve beyaz yazının her zeminde okunur kalması (en az 4,5:1) için koyu tonlar
  seçilmiştir (2026-09-27'de kontrast için koyulaştırıldı). Bugünkü sarı ton beyaz yazıyla yetersiz kaldığı için kodda **hiçbir
  kutucuk sarı değildir**. Tasarımda Servis / Servisler / servisçinin Yoklama kutucuğu sarıdır; önizlemedeki sarı daha koyu bir
  hardal tonudur — kodlanırken bu ton kontrast denetiminden geçirilmeli.
- **Kapalı bölüm:** kutucuğun gittiği sayfa okulun kapattığı bir bölümdeyse (Ödevler, Sınavlar, Devamsızlık, Etütler, Servis,
  Yemek listesi, Anketler) kutucuk çizilmez. Bir bölüme bağlı olmayan kutucuklar (Ayarlar, Öğretmenler, Sınıflar, Çocuklarım…)
  hep durur.
- **Yetki:** bugünkü kodda kutucuklar yalnız okulun kapattığı bölüme bakar, kişinin yetkisine bakmaz. Öğretmende menüde olmayan bir
  bölümün kutucuğu durabilir ([Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md), bilinen açık). Müdürün "Excel Aktarım"ı
  "Excel ile içe ve dışa aktarım yapar" (`aktarim.yap`) yetkisine bağlıdır (müdürde her zaman vardır).
- **Güvenlik:** ad, alt yazı, sayı ve gidilecek sayfanın adı ekrana kaçışlı yazılır (bir okul adı ya da sayı sayfaya kod sokamaz).
- **Test:** her kutucuğun gittiği sayfanın gerçekten var olduğu sunucusuz denetlenir (kırık kutucuk olmaz).

## Kardeşler ve ilgili

**Kardeşler:** [Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) · [Velinin ana sayfası](veli-ana-sayfasi.md) ·
[Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) · [Müdürün ana sayfası](mudur-ana-sayfasi.md) ·
[Servisçinin ana sayfası](servisci-ana-sayfasi.md) · [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) ·
[Yöneticinin ana sayfası](yonetici-ana-sayfasi.md). Klasör: [Ana sayfa](README.md).

**İlgili:**

- [Kapalı bölüm](../ozellikler/kapali-bolum.md), [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md).
- [Sol menü](../menu-ve-arama/sol-menu.md) — kutucukların gittiği sayfalar menüde de durur.
- [Profil menüsü](../menu-ve-arama/profil-menusu.md) — tasarımda Hesap ayarları buradadır.
- [Görünüm ve dil](../ayarlar/gorunum-ve-dil.md) — açık / koyu tema (kutucuk renkleri iki temada aynı).
- [Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md) — okulun kendi CSS'i.
- [Onay bekleyenler](../ogretmenler-calisanlar/onay-bekleyenler.md) — müdür kutucuğundaki "başvuru bekliyor".

## Kod tarafı

- Ön yüz: [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) — `kutucuklar(liste)` (liste öğesi
  `{ k, ad, renk, ikon, alt, rozet }`, kapalı bölümü `sayfaAcik` ile atlar); [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md)
  — `SAYFA_OZELLIK`, `sayfaAcik`, `ozellikAcik`; [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) —
  her rolün kutucuk listesi; [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) — yöneticinin
  kutucukları; [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `data-nav` tıklaması.
- Görünüm: `public/css/parcalar/10-ana-sayfa-kutucuklari.css` (ızgara, kutucuk, rozet, renkler), `00-temel.css` (`--kutu-*`
  renkleri), `23-hareket.css` (sırayla belirme) — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (her kutucuğun `k`'sı bir sayfaya gider).

## Sık sorulanlar

- **Bir kutucuk kayboldu.** Okulun müdürü o bölümü Özellikler'den kapatmış olabilir; açınca geri gelir.
- **Köşedeki sayı ne?** Bugünkü kodda aktif ödev sayısı (öğrenci, veli, öğretmen), bağlı çocuk sayısı (veli) ya da bekleyen
  başvuru sayısı (müdür).
- **Kutucukları kendim dizebilir miyim?** Hayır; sıra rol için sabittir. Okul, kendi CSS'iyle görünüşü değiştirebilir (tasarım).

## Sırada

- Tasarım 1'deki kutucuklar (aynı boy, sütun kuralı, canlı alt yazılar ve sayılar, rol rol yeni liste, Ayarlar'ın kalkması) —
  Linux kodlaması.
- Sarı kutucuğun kontrast denetimi (tasarımdaki Servis kutucukları).
- Tam debug: öğretmen kutucuklarının yetkiye bakmaması.
