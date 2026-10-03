# Eğitim içerikleri · Ses ve sessiz

**Durum:** Tasarlandı — henüz kodda yok

Oynatıcının ses düğmesi (sesi kapat/aç), yanındaki 0–100 ses kaydırıcısı ve yukarı/aşağı ok tuşları; açılışta ses %80.

## Ne işe yarar

Oynatıcının temel denetimlerinden biri (tanım, 28 Eylül: "oynat/durdur, ilerleme çubuğu, 10 sn ileri/geri, ses, hız, tam ekran").
Sınıfta ya da kütüphanede sesi hızla kısarsın.

## Nereden açılır

Oynatıcının alt çubuğunda "+10" düğmesinin sağı: hoparlör simgeli düğme ve yanında kaydırıcı ([Oynatıcı](oynatici.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. **Ses düğmesine** bas (ipucu **"Sesi kapat"**): ses kapanır, simge çarpılı hoparlöre döner, ipucu **"Sesi aç"** olur, ortada
   **"Ses kapalı"** balonu çıkar; kaydırıcı 0'a iner.
2. Yeniden bas: ses önceki düzeyine döner, balon **"Ses açık · %80"**.
3. **Kaydırıcıyı** sürükle (0–100): ses o düzeye gelir. 0'a çekersen ses kapalı sayılır.
4. Klavyede **↑** sesi 5 açar, **↓** 5 kısar; balon **"Ses %85"** ([Klavye kısayolları](klavye-kisayollari.md)). Ses kapalıyken ↑/↓'ye
   basmak sesi de açar.
5. Başka bir video açınca seçtiğin ses düzeyi sürer.

## Kurallar ve sınırlar

- **Başlangıç sesi %80.**
- **m sesi kapatmaz;** m oynat/durdur'dur (kullanıcının isteği "m ile durdurma"). Sesi kapatmanın tuşu yoktur, düğmeyle kapatılır.
- Ses düğmesinin ve kaydırıcının sesli adları: "Sesi kapat" / "Sesi aç", "Ses".
- Ses kaydırıcısı odaktayken de oynatıcı kısayolları çalışır (öbür form alanlarında çalışmaz).
- Telefonda ses, telefonun kendi ses tuşlarıyla da ayarlanır; bazı telefonlarda tarayıcı kaydırıcıyı yok sayar.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatıcı](oynatici.md), [Klavye kısayolları](klavye-kisayollari.md).

**İlgili:**

- [Android uygulaması](../uygulama/android-uygulamasi.md) — telefonda oynatma.

## Kod tarafı

Bugün kodda yok. Yüklenen videoda `volume`/`muted`, YouTube'da IFrame API'nin ses ayarı kullanılır.

## Sık sorulanlar

- **m'ye bastım, ses kapanmadı, video durdu.** Doğru; m durdurur. Ses için ses düğmesi.
- **Ses düzeyim her videoda sıfırlanıyor mu?** Hayır; seçtiğin düzey sürer.

## Sırada

- Eğitim içerikleri (iş 17): ses denetimleri.
