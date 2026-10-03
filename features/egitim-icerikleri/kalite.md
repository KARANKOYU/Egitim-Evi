# Eğitim içerikleri · Kalite

**Durum:** Tasarlandı — henüz kodda yok

Oynatıcının kalite seçicisi: Eğitim Evi'ne yüklenen videoda 720p, 360p ya da Otomatik; YouTube videosunda kaliteyi YouTube
kendisi ayarlar.

## Ne işe yarar

Kullanıcının 28 Eylül sözleri: "720p olsun" ve "kaliteli şeyler". Zayıf internette (telefon, okul ağı) düşük kaliteye geçilir,
iyi bağlantıda 720p izlenir.

## Nereden açılır

Oynatıcının alt çubuğunda hız seçicisinin sağındaki seçici (sesli adı "Kalite") ([Oynatıcı](oynatici.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. Eğitim Evi'ne yüklenen bir videoda kalite seçicisini aç: **720p · 360p · Otomatik**.
2. Birini seç; video aynı yerden o kalitede sürer.
3. **Otomatik**, bağlantının hızına göre ikisinden birini seçer.
4. YouTube videosunda kaliteyi YouTube kendisi ayarlar (tanım: "kalite YouTube'ca otomatik"); seçicinin bu videoda nasıl
   görüneceği tanımda yazmıyor.

**Tasarımda (Tasarım 1 önizlemesi):** seçicide **1080p · 720p · 480p** (720p seçili) yazıyor ve seçim bir şey değiştirmiyor (önizleme
tek örnek kayıt oynatır). Bu tanımla çelişiyor: yüklenen video tarayıcıda 720p'ye dönüştürüldüğü için 1080p olamaz; tanımdaki
seçenekler 720p, 360p ve Otomatik.

## Kurallar ve sınırlar

- **En yüksek kalite 720p:** 720p'nin üstündeki video yüklenirken eğitmenin tarayıcısında 720p'ye dönüştürülür
  ([Bilgisayardan video yükleme](video-yukleme.md)).
- **İki kalite hazırlanır:** yüklemede 720p ve 360p (kalite seçimi için).
- **YouTube videosunda** seçim yoktur; YouTube'un kendi uyarlamalı kalitesi geçerlidir (YouTube'un kuralı, kullanıcıya söylendi).
- **İndirilen video** cihazda tek kalitede saklanır (hangisi olduğu tanımda yok).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatıcı](oynatici.md), [Oynatma hızı](hiz.md).
- [Bilgisayardan video yükleme](video-yukleme.md) — 720p'ye dönüşüm ve iki kalite.
- [İndir ve İndirdiklerim](indirdiklerim.md).

**İlgili:**

- [Sunucuda küçültme](../okul-disk/sunucuda-kucultme.md) — sitedeki öbür video küçültme işi.

## Kod tarafı

Bugün kodda yok.

## Sık sorulanlar

- **1080p neden yok?** Eğitim Evi'ne yüklenen videolar 720p'ye dönüştürülür; YouTube videosunda kaliteyi YouTube seçer.
- **Video takılıyor.** Kaliteyi 360p yap ya da "Otomatik"te bırak.

## Sırada

- Eğitim içerikleri (iş 17): kalite seçici ve 360p kopyasının hazırlanması.
- Önizlemedeki "1080p / 720p / 480p" seçicisi HTML işinde tanıma göre ("720p / 360p / Otomatik") düzeltilecek.
- İndirilen kopyanın kalitesi (720p mi 360p mi, kişi mi seçer) tanımda yok — kullanıcıya sorulmalı.
