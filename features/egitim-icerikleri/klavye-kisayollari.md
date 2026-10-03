# Eğitim içerikleri · Klavye kısayolları

**Durum:** Tasarlandı — henüz kodda yok

Oynatıcının klavye tuşları: m, k ya da boşluk oynat/durdur; f tam ekran; j ve l 10 saniye geri/ileri; sol ve sağ ok 5 saniye; yukarı
ve aşağı ok ses; 0–9 videonun yüzdesine atlama; ? kısayol listesi.

## Ne işe yarar

Kullanıcının 2 Ekim sözü: "kısayollar m, ok tuşları, f ile full screen, m ile durdurma, jkl". YouTube'a alışkın öğrenci aynı
tuşlarla yönetir; tek fark: **m sesi kapatmaz, durdurur** (kullanıcının açık isteği).

## Nereden açılır

- Video oynatıcısı açıkken klavyeden ([Oynatıcı](oynatici.md)).
- Liste: oynatıcının çubuğundaki **"?"** düğmesi (ipucu "Kısayollar (?)") ya da klavyede **?** — videonun üstünde
  **"Klavye kısayolları"** kutusu açılır.

## Adım adım

### Herkes (ziyaretçi dahil)

1. Videoyu aç; oynatıcı odaklanır.
2. Tuşlar (kısayol listesindeki sırayla ve yazımla):

   | Tuş | İş |
   |---|---|
   | **m, k ya da boşluk** | Oynat / durdur |
   | **f** | Tam ekran (çift tık da) |
   | **j · l** | 10 sn geri · ileri |
   | **← · →** | 5 sn geri · ileri |
   | **↑ · ↓** | Sesi aç · kıs |
   | **0 – 9** | Videonun %0–90'ına git |
   | **?** | Bu liste |

3. Her tuşta ekranın ortasında kısa balon: "Oynatılıyor" / "Durduruldu", "−10 sn", "+5 sn", "Ses %85", "%30" gibi.
4. Kısayol listesini kapatmak için listedeki **"Kapat"**, yeniden **?** ya da **Esc**.

## Kurallar ve sınırlar

- **m = oynat/durdur.** Kullanıcı "m ile durdurma" dedi. Tasarım 1 önizlemesinin ilk hâlinde m YouTube'daki gibi sesi kapatıyordu;
  sonraki düzeltmede (Tasarım 1 kararları: "m = DURDUR/OYNAT") oynat/durdur yapıldı. Sesi kapatmanın kısayolu yoktur, ses
  düğmesiyle kapatılır ([Ses ve sessiz](ses.md)).
- **Ses adımı** ↑/↓ ile 5 puan (0–100).
- **0–9:** 0 baş, 1 %10, … 9 %90.
- **Ne zaman çalışır:** yalnız oynatıcının penceresi/sayfası açıkken ya da oynatıcı tam ekrandayken. Kapanmış bir pencerede kalan
  oynatıcı tuşları yakalamaz.
- **Yazarken çalışmaz:** odak bir yazı kutusundaysa (arama kutusu, bildir formu, yazı düzenleyici) ya da bir seçicideyse (hız,
  kalite, altyazı) tuşlar yazıya gider. İstisna: ses kaydırıcısı odaktayken de çalışır.
- **Ctrl, Alt ya da Cmd** ile basılan tuş oynatıcıya gitmez (tarayıcının kısayolları bozulmasın).
- **Boşluk** yalnız odak sayfanın kendisinde ya da oynatıcının içindeyken oynat/durdur yapar (bir düğmedeyken düğmeye basar).
- Harf tuşları Türkçe küçük harfe çevrilerek okunur (Caps Lock açıkken de çalışır).
- Kısayol listesi açıkken Esc yalnız listeyi kapatır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatıcı](oynatici.md), [Tam ekran](tam-ekran.md), [Ses ve sessiz](ses.md), [Oynatma hızı](hiz.md).

**İlgili:**

- [Yazı düzenleyici · Klavye kısayolları](../yazi-yazma/kisayollar.md) — yazı yazarken geçerli öbür kısayollar.

## Kod tarafı

Bugün kodda yok.

## Sık sorulanlar

- **m'ye basınca ses kapanmıyor.** Doğru; m videoyu durdurur. Sesi ses düğmesinden kapat.
- **Arama kutusuna "k" yazınca video durmuyor.** Yazı kutusundayken kısayollar çalışmaz.
- **Kısayolları nerede görürüm?** Oynatıcıdaki "?" düğmesinde ya da ? tuşunda.

## Sırada

- Eğitim içerikleri (iş 17): kısayollar.
- "m durdursun mu?" bir ara kullanıcıya soru olarak soruldu; kullanıcının sözü ("m ile durdurma") ve Tasarım 1 kararları m = durdur
  diyor, bu belge ona göre yazıldı.
