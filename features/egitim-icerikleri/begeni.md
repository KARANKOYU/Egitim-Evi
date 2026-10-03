# Eğitim içerikleri · Beğen

**Durum:** Tasarlandı — henüz kodda yok

Her videonun altındaki "Beğen" düğmesi: kişi başına bir beğeni, geri alınır; beğeni sayısı herkese görünür.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: eğitmen "/panel/egitmen ile video izlenmelerine, beğenilere bakabilsin". Beğeni izleyene iyi videoyu,
eğitmene hangi anlatımın tuttuğunu gösterir; "En çok beğenilen" sıralaması bu sayıyla çalışır.

## Nereden açılır

İzleme sayfasında oynatıcının altındaki düğme satırının ilki: **"Beğen · 312"** ([İzleme sayfası](izleme-sayfasi.md)).

## Adım adım

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. **"Beğen · 312"**e bas: düğme dolar, **"Beğendin · 313"** olur.
2. Yeniden bas: beğeni geri alınır, **"Beğen · 312"**ye döner.

### Ziyaretçi (giriş yapmamış)

**"Beğen"**e basınca **"Bunun için giriş yap"** penceresi; girince aynı videoya döner ve beğeni yazılır ([Girişsiz izleme](girissiz-izleme.md)).

### Eğitmen

Kendi videolarının beğeni sayısını Videolarım'da ve İstatistikler'de görür; kimin beğendiğini görmez ([Videolarım](videolarim.md),
[İstatistikler](istatistikler.md)).

## Kurallar ve sınırlar

- **Kişi başına bir beğeni** her videoda; geri alınabilir.
- **Sayı herkese görünür**, kimin beğendiği kimseye görünmez (eğitmene de).
- **Beğenmeme (dislike) yok;** yorum da yok (kullanıcıya önerildi: denetim yükü; istenirse sonra).
- Eğitmenin hesabı silinince videolarıyla birlikte beğeni sayıları da silinir; video kaldırılınca da.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [İzleme sayfası](izleme-sayfasi.md) — düğmenin yeri.
- [Sıralama](siralama.md) — "En çok beğenilen".
- [İstatistikler](istatistikler.md) — eğitmenin gördüğü toplam.
- [Kaydet ve Kaydettiklerim](kaydedilenler.md) — yanındaki düğme.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kişi + video birincil anahtarlı bir beğeni tablosu (yeni şema dosyası,
[sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).

## Sık sorulanlar

- **Beğendiğimi eğitmen görür mü?** Hayır; yalnız toplam sayıyı görür.
- **Yanlışlıkla beğendim.** Yeniden bas, geri alınır.

## Sırada

- Eğitim içerikleri (iş 17): beğeni.
