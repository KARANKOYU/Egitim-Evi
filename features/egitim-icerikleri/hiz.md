# Eğitim içerikleri · Oynatma hızı

**Durum:** Tasarlandı — henüz kodda yok

Oynatıcının hız seçicisi: 0,25x'ten 3x'e on kademe; Eğitim Evi'ne yüklenen videoda hepsi, YouTube videosunda en çok 2x.

## Ne işe yarar

Kullanıcının 28 Eylül sözü: "kendi araçlarımızla 3x, 0.25x". Konuyu bilen öğrenci hızlı geçer; zor yeri yavaşlatıp izler.

## Nereden açılır

Oynatıcının alt çubuğunda, zamanın sağındaki ilk seçici (sesli adı "Hız"), varsayılan **"1x"** ([Oynatıcı](oynatici.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. Hız seçicisini aç. Seçenekler: **0,25x · 0,5x · 0,75x · 1x · 1,25x · 1,5x · 1,75x · 2x · 2,5x · 3x**.
2. Birini seç: video o hızda oynar, ortada **"Hız 1,5x"** balonu çıkar.
3. Başka bir video açınca seçtiğin hız sürer.

## Kurallar ve sınırlar

- **Eğitim Evi'ne yüklenen videoda** 0,25x–3x (on seçenek).
- **YouTube videosunda** 0,25x–2x: YouTube kendi videolarında 2x'ten hızlıya izin vermez (tanım; kullanıcıya söylendi). Bu videoda
  2x'ten yukarısı seçilemez.
- Ondalık ayırıcı virgüldür ("1,25x").
- Hızın klavye kısayolu yoktur.

**Tasarımda (Tasarım 1 önizlemesi):** bütün videolarda 3x'e kadar on seçenek görünüyor (önizlemedeki videolar YouTube'dan değil,
tek bir örnek kayıttan oynuyor); YouTube'daki 2x sınırı gerçek sitede uygulanır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatıcı](oynatici.md), [Kalite](kalite.md), [YouTube bağlantısı](youtube-baglantisi.md).

**İlgili:**

- [Sık sorulan sorular](../acilis-sayfasi/sss.md) — "Eğitim içerikleri" bölümü.

## Kod tarafı

Bugün kodda yok. Yüklenen videoda tarayıcının `playbackRate`'i, YouTube'da IFrame API'nin hız ayarı kullanılır.

## Sık sorulanlar

- **3x seçeneği yok.** YouTube videosu izliyorsun; YouTube en çok 2x'e izin veriyor.
- **Ses tizleşiyor mu?** Tarayıcılar hızlandırırken sesin perdesini korur.

## Sırada

- Eğitim içerikleri (iş 17): hız seçici (iki kaynak için ayrı üst sınır).
