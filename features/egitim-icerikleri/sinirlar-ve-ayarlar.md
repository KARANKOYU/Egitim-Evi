# Eğitim içerikleri · Sınırlar ve site ayarları

**Durum:** Tasarlandı — henüz kodda yok

Eğitim içeriklerinin bütün sayısal sınırları tek yerde (liste hakları, video ve etiket sayıları, dosya boyutları, süreler) ve yöneticinin
site ayarlarından değiştirdiği üç ayar: YouTube denetim aralığı, eğitmen başına disk sınırı, eğitim videolarının yedeğe girip girmemesi.

## Ne işe yarar

Sınırlar öbür belgelere dağılmış durumda; kodlayan kişi (ve merak eden kullanıcı) hepsini burada bulur. Kaynakları: kullanıcının 28–29
Eylül kararları ("liste başına 100", "kişi başına 2 liste", "eğitmene 4 liste hakkı, destek vb. admin sınırsız", "720p olsun", "günde 1
ya da admin panelinden config ile") ve tanımın önerileri.

## Nereden açılır

- Sınırlar, ilgili düğmede ya da formda iletiyle görünür (her satırda bağlantı).
- Site ayarları: yönetici → `/panel/admin` → site ayarları ([Site ayarları](../yonetim/site-ayarlari.md)).

## Adım adım

### Yönetici

1. Panelde site ayarlarını aç.
2. **"YouTube denetim aralığı"** — varsayılan 24 saat, en az 1 saat ([YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md)).
3. **Eğitmen başına disk sınırı** — varsayılan 5 GB ([Bilgisayardan video yükleme](video-yukleme.md)).
4. **Eğitim videolarının günlük yedeğe girmesi** — varsayılan girmez (ayrı ayar).
5. Kaydet; değişiklik işlem kaydına yazılır.

### Herkes

Aşağıdaki sınırlar her rolde aynıdır; farklı olanlar satırında yazar.

## Kurallar ve sınırlar

**Listeler** ([Oynatma listeleri](oynatma-listeleri.md), [Eğitmen serileri](egitmen-serileri.md)):

| Sınır | Değer |
|---|---|
| Kişi başına oynatma listesi | 2 (öğrenci, veli, öğretmen, çalışan, müdür, servisçi) |
| Eğitmen | 4 (herkese açık seriler de bundan) |
| Destek ve yönetici | sınırsız (teknik tavan 1000) |
| Kaydettiklerim | liste hakkına sayılmaz |
| Liste başına video | 100 (herkes) |
| Liste adı | en çok 60 karakter; aynı adla iki liste olmaz |
| Liste açıklaması (eğitmen) | en çok 200 karakter |

**Video bilgileri** ([Video bilgileri](video-bilgileri.md), [Etiketler](etiketler.md), [Altyazı](altyazi.md)):

| Sınır | Değer |
|---|---|
| Başlık | zorunlu, en çok 100 karakter |
| Sınıf | en az 1, 1–12 arası, birden çok |
| Ders | tek ders |
| Etiket | en çok 5; her biri 2–24 karakter |
| Altyazı dosyası | .srt ya da .vtt, en çok 1 MB, dil başına bir dosya (Tasarım 1'de 7 dil) |
| Kısa tanıtım (eğitmen ayarı; yalnız Tasarım 1'de, tanımda yok) | 10–160 karakter |

**Video dosyası ve oynatma** ([Bilgisayardan video yükleme](video-yukleme.md), [Kalite](kalite.md), [Oynatma hızı](hiz.md)):

| Sınır | Değer |
|---|---|
| En yüksek kalite | 720p (kısa kenarı 720 px'ten büyük video tarayıcıda 1280×720'ye dönüştürülür) |
| Hazırlanan kaliteler | 720p ve 360p |
| Hız | Eğitim Evi'ndeki videoda 0,25x–3x; YouTube videosunda 0,25x–2x |
| Video başına ve kişi başına boyut | sınır var (tanım); değeri yazılmamış |
| Eğitmen başına disk | 5 GB (site ayarı) |

**İndirme** ([İndir ve İndirdiklerim](indirdiklerim.md)):

| Sınır | Değer |
|---|---|
| Cihaz başına | 2 GB (herkes) |
| Anahtar geçerliliği | 30 gün; internete bağlanınca yenilenir |
| YouTube videosu | indirilemez |

**Adresler ve kimlikler** ([Adresler](adresler.md)):

| Sınır | Değer |
|---|---|
| Video ve liste kimliği | 12 karakter, rastgele, a–z ve 0–9 |

**Girişsiz izleme** ([Girişsiz izleme](girissiz-izleme.md)):

| Sınır | Değer |
|---|---|
| İzlenme sayımı | aynı IP'den aynı videoya saatte 1; IP saklanmaz |
| Girişsiz video isteği | IP başına dakikada makul bir sınır (bant genişliği koruması; değeri tanımda yok) |

**YouTube denetimi** ([YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md)):

| Sınır | Değer |
|---|---|
| Aralık | varsayılan 24 saat, en az 1 saat |
| Silme koşulu | iki art arda 404 ya da 401/403 |
| İstek hızı | saniyede en çok 1 |

**Oynatıcı** (Tasarım 1; [Oynatıcı](oynatici.md), [Klavye kısayolları](klavye-kisayollari.md), [Ses ve sessiz](ses.md)):

| Sınır | Değer |
|---|---|
| Başlangıç sesi | %80; ↑/↓ adımı 5 |
| Atlama | j/l 10 sn, ←/→ 5 sn, 0–9 → %0–90 |
| Çubuğun gizlenmesi | oynarken 2,5 sn hareketsizlikten sonra |
| Kaldığın yer | %1'in altı sayılmaz; %98 ve üstü "izledin" |

**Liste sayfası** ([Video listesi](video-listesi.md)):

| Sınır | Değer |
|---|---|
| Süzgeç sütunu | 250 px; 860 px ve altında "Süzgeçler" düğmesine geçer |
| Video kartı | en az 220 px |

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)): her tablonun başındaki bağlantılar; ayrıca [Eğitmen rolü](egitmen-rolu.md).

**İlgili:**

- [Site ayarları](../yonetim/site-ayarlari.md), [Site yedekleri](../yonetim/yedekler.md).
- [Okulun dosya alanı](../okul-disk/doluluk.md) — okul başına disk sınırı (ayrı şey; eğitim videoları okula değil eğitmene sayılır).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Site ayarları: [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md), [sunucu/veri/depo/site-ayarlari.md](../../sunucu/veri/depo/site-ayarlari.md),
  [sunucu/site.md](../../sunucu/site.md).
- Günlük yedek: [sunucu/veri/yedek.md](../../sunucu/veri/yedek.md).
- Hız sınırları: [sunucu/guvenlik.md](../../sunucu/guvenlik.md).

## Sık sorulanlar

- **Eğitim videoları okulumun disk alanını yer mi?** Hayır; eğitmen başına ayrı sınır var.
- **Destek ekibinin listeleri neden sınırsız?** Kullanıcının kararı (29 Eylül): "destek vb. admin sınırsız".

## Sırada

- Eğitim içerikleri (iş 17): sınırlar ve üç site ayarı.
- Video başına / kişi başına boyut sınırının ve girişsiz istek sınırının değerleri kodlamadan önce belirlenmeli.
