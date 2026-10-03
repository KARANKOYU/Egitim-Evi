# Bildirimler · Bildirim sekmeleri

**Durum:** Tasarlandı — henüz kodda yok

Bildirim paneli tür sekmelerine ayrılır: **Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis**; her sekmenin yanında o
türün okunmamış sayısı durur.

## Ne işe yarar

Bir günde ödev, mesaj, servis ve devamsızlık bildirimleri karışık gelir. Sekmeyle yalnız bakmak istediğin türü görürsün: veli
"Servis"e basıp çocuğunun servise binip binmediğine, öğretmen "Mesaj"a basıp yalnız yazışmalarına bakar. Kullanıcının isteği
(25 Eylül, başka bir okul sisteminin bildirim ekranını gösterirken): "bildirimler böyle olucak ama bizimki dah düzenli sekmeler
halinde". Bugünkü sitede panel düz bir listedir ([Bildirim paneli](bildirim-paneli.md)).

## Nereden açılır

Sağ üstteki zil → panelin üst kısmında, "Bildirimler" başlığının altında yan yana yuvarlak sekme düğmeleri. Panel ilk açılışta
**"Tümü"** sekmesiyle gelir; sayfayı yenilemeden paneli yeniden açarsan son seçtiğin sekme kalır (Tasarım 1 önizlemesi).

## Adım adım

### Herkes (tasarım)

1. Zile bas. Panel "Tümü" sekmesinde (ya da son seçtiğin sekmede) açılır; bildirimler en yeniden eskiye sıralı.
2. Bir sekmeye bas (ör. **"Ödev"**). Liste yalnız o türe süzülür; seçili sekme koyu renkle görünür.
3. Sekmenin adının yanındaki küçük renkli sayı o türün okunmamış bildirim sayısıdır ("Ödev 2"). Okunmamışı olmayan sekmede sayı
   yoktur.
4. **"Tümünü okundu say"** yalnız gösterilen sekmeyi okundu sayar: "Ödev" sekmesindeyken basınca kısa ileti
   **"Ödev bildirimleri okundu sayıldı."**, "Tümü"ndeyken **"Bütün bildirimler okundu sayıldı."** çıkar
   ([Okundu sayma](okundu-sayma.md)).
5. Sekmede hiç bildirim yoksa **"Ödev bildirimin yok."** (sekmenin adıyla) yazar; "Tümü" boşsa **"Henüz bildirimin yok."**
6. Her satırın en altında türü ve tarihi yazar: **"Servis · 2 Ekim 2026 Cuma 08:12"**. "Tümü" sekmesinde de satırın hangi türden
   olduğunu buradan görürsün.

### Rol rol hangi sekmeler var (Tümü her zaman başta)

Sekmeler hep aynı sırada durur: Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis. Her rol yalnız kendisini ilgilendirenleri
görür:

| Rol | Sekmeler |
|---|---|
| Öğrenci | Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis |
| Veli | Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis |
| Öğretmen | Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru |
| Müdür | Tümü · Sınav · Devamsızlık · Mesaj · Duyuru · Servis (Ödev yok: müdür ödev kontrol etmez) |
| Servisçi | Tümü · Mesaj · Duyuru · Servis |
| Eğitmen | Tümü · Mesaj · Duyuru |
| Öğrencinin dershane portalı | Tümü · Ödev · Sınav · Duyuru |
| Henüz portalı olmayan yetişkin | Tümü · Duyuru |

- Birden çok kurumda portalı olan hesapta (ör. okul + dershane) panel bütün portalların sekmelerini birleştirir
  ([Kurum adı](kurum-adi.md)).
- **Çalışan:** önizlemede rolsüz çalışana ayrı bir sekme listesi yazılmamış; ek görevi olan çalışan öğretmen hesabıyla
  çalıştığı için öğretmenin sekmelerini görür. Tanıma göre okulda açık olan bölümlerin sekmeleri görünür.
- **Yönetici ve destek:** bu hesaplar için önizlemede sekme listesi yok; tanımda da yazılmamış.

### Hangi bildirim hangi sekmeye düşer

- Tanımdaki karar: bildirimin türü sunucuda, bildirim yazılırken belirlenir ve kaydedilir (yeni "tür" alanı); türü olmayan eski
  bildirimlerin türü bağlantısından çıkarılır.
- Tasarım 1 önizlemesinde tür, bildirimin açtığı yerden ve başlığından bulunur:
  - ödev, quiz ya da ödev kontrolü açan bildirim → **Ödev**;
  - sınav, deneme ya da yazılı → **Sınav**;
  - Mesajlar'ı açan bildirim → **Mesaj** ("Ödev hakkında" konulu bir mesaj da Mesaj'dır);
  - servis geçen ya da Servis'i açan → **Servis**;
  - devamsızlık, yoklama, "geç kaldı", "gelmedi" → **Devamsızlık**;
  - geri kalan her şey → **Duyuru**.
- Rolün sekmesi olmayan türdeki bildirim **Duyuru**'da durur (ör. müdüre ödevle ilgili bir şey gelirse).
- Önizlemede türü olmayan bildirimler de Duyuru'ya düşer: hatırlatmalar, toplantı ("Toplantı başladı · …"), Eğitim Evi Aile
  bildirimleri, "3. ders 10 dakika sonra başlıyor", hesap bildirimleri. Tanımda ayrı bir "Diğer" sekmesi yok.

## Kurallar ve sınırlar

- **Kapalı bölüm:** okul bir bölümü kapattıysa (ör. Servis) o bölümün sekmesi görünmez
  ([Bölüm aç/kapat](../ozellikler/bolum-ac-kapat.md)).
- **Sayılar:** sekmedeki sayı yalnız okunmamışları sayar; zilin rozetindeki sayı bütün sekmelerin toplamıdır.
- **Hız korunur:** tanıma göre sekmeler gelince de bugünkü sürümlü yoklama ve "değişmedi" diye dönen birkaç baytlık cevap
  bozulmaz ([Zilin tazelenmesi](yoklama-araligi.md)); türler aynı cevapla gelir.
- **Telefon uygulaması:** Android uygulamasındaki Bildirimler sayfası da aynı sekmeleri kullanır
  ([Android uygulaması](../uygulama/android-uygulamasi.md)).
- **Testler (tanım):** tür eşlemesi, türü olmayan eski kayıtlar, kapalı bölümün sekmesi.

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim paneli](bildirim-paneli.md) · [Okundu sayma](okundu-sayma.md) ·
[Bildirim türleri ve metinleri](bildirim-metinleri.md) · [Kurum adı](kurum-adi.md) ·
[Öğrencinin bildirimi veliye de](velinin-bildirimleri.md).

**İlgili:** [Okulun özellikleri: bölüm aç/kapat](../ozellikler/bolum-ac-kapat.md) ·
[Mesaj etiketleri](../mesaj/etiketler.md) (mesaj kutusundaki etiket süzgeci, ayrı bir şey) ·
[Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- Bugün kodda yok. Değişecek yerler: ön yüzde [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md)
  (`bildirimPaneliCiz`), sunucuda [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`GET /api/notifications` cevabına
  tür), depoda [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirim yazılırken tür; yeni şema dosyası).
- Tasarım: Tasarım 1 önizlemesi, herkes-a paketi (sekmeler, sayılar, "Tümünü okundu say", tür ve tarih satırı).
- Tanım: mesaj-ajanda tanımının "bildirim paneli sekmeler hâlinde" eki (istek denetimi 28 Eylül).

## Sık sorulanlar

- **Bir bildirim yanlış sekmede.** Türü olmayan bildirimler Duyuru'da durur. Ödevle ilgili bir bildirim müdürde Duyuru'dadır,
  çünkü müdürde Ödev sekmesi yok.
- **Servis sekmesini göremiyorum.** Okulun servis bölümü kapalıdır ya da rolünün servisle ilgisi yoktur (öğretmen).
- **Sekmeyi değiştirince okunmamışlar okundu oluyor mu?** Hayır; yalnız bastığın bildirim ve "Tümünü okundu say" okundu sayar.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu (iş 8):
  sekmeler bu işle kodlanır.
- Android yerel uygulama (iş 10): uygulamadaki Bildirimler sayfası aynı sekmelerle.
