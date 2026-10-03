# Yazı düzenleyici · Klavye kısayolları (Ctrl+Z, Y, B, I, U)

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Yazı alanındayken araç çubuğuna gitmeden biçim vermeyi sağlayan tuş birleşimleri ve düğmelerin ipucunda görünmeleri.

## Ne işe yarar

Bilgisayarda hızlı yazan öğretmen ve müdür için: kalın için fareye uzanmadan Ctrl+B. Tanımın kesin maddesi: düğmelerin üstüne
gelince "ipucu (Türkçe ad + kısayol: Ctrl+Z/Y/B/I/U)".

## Nereden açılır

Odak yazı alanındayken klavyeden. Her düğmenin kısayolu, üstüne gelince çıkan ipucunda parantez içinde yazar
([Araç çubuğunun düzeni](arac-cubugu.md)).

## Adım adım

### Bugün (kodda)

Düzenleyici yok. Bugünkü düz yazı kutularında yalnız tarayıcının kendi kısayolları (kes, kopyala, yapıştır, geri al) çalışır.

### Yazan herkes (bilgisayarda, tasarım)

1. Yazı alanına tıkla.
2. Kısayola bas; araç çubuğundaki düğmeye basmışsın gibi olur ve düğmenin koyu hâli güncellenir.
3. Mac'te Ctrl yerine Cmd de çalışır (önizleme ikisini aynı sayar).

**Tanımdaki kısayollar (kullanıcının onayladığı):**

| Tuş | İş |
|---|---|
| Ctrl+Z | Geri al ([Geri al · Yinele](geri-al-yinele.md)) |
| Ctrl+Y | Yinele |
| Ctrl+B | Kalın ([Kalın](kalin.md)) |
| Ctrl+I | İtalik ([İtalik](italik.md)) |
| Ctrl+U | Altı çizili ([Altı çizili](alti-cizili.md)) |

**Önizlemenin eklediği kısayollar (önerisi; kullanıcı ayrıca onaylamadı):**

| Tuş | İş |
|---|---|
| Ctrl+Alt+1 / 2 / 3 | Büyük / orta / küçük başlık ([Başlıklar](basliklar.md)) |
| Alt+Shift+5 | Üstü çizili ([Üstü çizili](ustu-cizili.md)) |
| Ctrl+Shift+8 | Madde listesi ([Madde listesi](madde-listesi.md)) |
| Ctrl+Shift+7 | Numaralı liste ([Numaralı liste](numarali-liste.md)) |
| Ctrl+Shift+L / E / R / J | Sola yasla / Ortala / Sağa yasla / İki yana yasla ([Hizalama](hizalama.md)) |
| Ctrl+] / Ctrl+[ | Girintiyi artır / azalt ([Girinti](girinti.md)) |
| Ctrl+K | Bağlantı ekle ([Bağlantı ekle](baglanti-ekle.md)) |

**Bağlantı kutusunun içinde:** Enter = **"Ekle"** (ya da **"Kaydet"**), Esc = **"Vazgeç"**.

### Telefonda

Kısayol yok; her iş düğmeyle ([Telefonda araç çubuğu](telefonda.md)).

## Kurallar ve sınırlar

- Kısayollar yalnız odak **düzenleyicinin yazı alanındayken** çalışır. </> açıkken kod kutusunda düzenleyicinin kısayolları
  çalışmaz; kutunun kendi Ctrl+Z / Ctrl+Y'si çalışır ([HTML görünümü](html-gorunumu.md)).
- Fotoğraf ekle, HTML görünümü ve renklerin kısayolu yoktur.
- Tab tuşu girinti yapmaz; odağı bir sonraki öğeye geçirir (klavyeyle sayfada gezinme bozulmasın).
- Önizlemenin bazı kısayolları tarayıcıların kendi kısayollarıyla aynı tuşlara düşüyor (ör. Ctrl+Shift+R zorla yenileme,
  Ctrl+Shift+J geliştirici araçları, Ctrl+K arama, Ctrl+U sayfa kaynağı). Önizleme yazı alanındayken Ctrl+Shift+R, Ctrl+Shift+J ve
  Ctrl+K'yi kendi işine çeviriyor (Ctrl+Z/Y/B/I/U'yu tarayıcının kendi düzenleme komutuna bırakıyor) ama tarayıcıya göre her zaman
  engellenemeyebilir; kodlanırken bütün tarayıcılarda denenmeli, gerekirse başka tuşlar seçilmeli.
- **Türkçe Q klavye çakışması (önizlemede):** Windows'ta AltGr tuşu tarayıcıya Ctrl+Alt olarak gelir. Türkçe Q klavyede `#`
  AltGr+3, `>` AltGr+1 ile yazılır; önizleme bunları "Küçük başlık (Ctrl+Alt+3)" ve "Büyük başlık (Ctrl+Alt+1)" sanıp yazdırmıyor,
  paragrafı başlığa çeviriyor. Ayrıca önizleme Ctrl+[ ve Ctrl+]'yi tuşun klavyedeki yerine göre tanıyor; Türkçe Q klavyede o
  tuşlar Ğ ve Ü'dür (girinti Ctrl+Ğ / Ctrl+Ü ile olur, ipucundaki Ctrl+[ / Ctrl+] Türkçe klavyede yazılamaz). Kodlanırken başlık ve
  girinti kısayolları AltGr ile çakışmayan tuşlara alınmalı ya da kaldırılmalı.
- Video izleme sayfasının kısayolları (m, k, f, j, l…) yazı alanındayken çalışmaz; tuşlar yazıya gider
  ([Eğitim içerikleri · Klavye kısayolları](../egitim-icerikleri/klavye-kisayollari.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Araç çubuğunun düzeni](arac-cubugu.md) · [Geri al · Yinele](geri-al-yinele.md) · [Kalın](kalin.md) ·
[İtalik](italik.md) · [Altı çizili](alti-cizili.md) · [Telefonda araç çubuğu](telefonda.md).

**İlgili:** [Eğitim içerikleri · Klavye kısayolları](../egitim-icerikleri/klavye-kisayollari.md),
[Okul sayfası · Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md) (CSS kutusunda "Ctrl+S uygular" gibi kendi tuşları var).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında (yalnız yazı alanındayken dinleyen tuş işleyicisi); Durum satırı
güncellenir.

## Sık sorulanlar

- **Mac'te hangi tuş?** Ctrl yerine Cmd (Cmd+B kalın gibi).
- **Ctrl+Shift+R basınca sayfa yenilendi.** Önizlemenin bu kısayolu bazı tarayıcılarda tarayıcının kendi tuşuyla çakışıyor; sağa
  yaslamak için düğmeyi kullan.
- **`#` yazmak istedim, satır başlık oldu.** Önizlemenin Ctrl+Alt+3 kısayolu Türkçe klavyedeki AltGr+3 ile çakışıyor (yukarıda);
  kodlanırken düzeltilecek.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Yapı belgesi: Ctrl+Z/Y/B/I/U dışındaki kısayolların kesinleşmesi ya da değiştirilmesi (Türkçe klavyedeki AltGr çakışması dahil).
