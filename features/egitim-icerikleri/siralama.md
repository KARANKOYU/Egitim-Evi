# Eğitim içerikleri · Sıralama

**Durum:** Tasarlandı — henüz kodda yok

Üst satırdaki "Sırala:" seçicisi: süzgeçten geçen videoları en yeni, en çok izlenen, en çok beğenilen ya da en kısa önce diye dizer.

## Ne işe yarar

29 Eylül tanımı: "sıralama en yeni / en çok izlenen / en çok beğenilen". Öğrenci yeni gelen videoyu ya da herkesin izlediğini
önce görür; kısa bir tekrar arayan "En kısa"yı seçer.

## Nereden açılır

Eğitim içerikleri sayfasının üst satırının sağı: **"Sırala:"** yazısı ve açılır seçici (dar ekranda yalnız seçici). Ziyaretçide de
var ([Video listesi](video-listesi.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. **"Sırala:"** seçicisini aç. Seçenekler, sırasıyla:
   - **"En yeni"** (varsayılan) — en son eklenen en üstte,
   - **"En çok izlenen"** — izlenme sayısı büyükten küçüğe,
   - **"En çok beğenilen"** — beğeni sayısı büyükten küçüğe,
   - **"En kısa"** — süresi kısadan uzuna.
2. Seçince ızgara hemen yeniden dizilir; süzgeçler ve arama olduğu gibi kalır.

### Giriş yapmış kişi, "İzleme geçmişim"de

"İzleme geçmişim" bölümü her zaman en son izlediğin en üstte dizilir; "Sırala:" orada sırayı değiştirmez
([İzleme geçmişi](izleme-gecmisi.md)).

## Kurallar ve sınırlar

- Sıralama süzgeçten SONRA uygulanır; sonuç sayısını değiştirmez ([Süzgeç mantığı](suzgec-mantigi.md)).
- Sıralama bir süzgeç değildir: özet satırında çipi yoktur, "Hepsini temizle" onu "En yeni"ye döndürmez.
- **Tasarımda (Tasarım 1 önizlemesi):** "En kısa" tanımda yoktu; tanımdaki "süre" süzgecinin yerine önizlemeye eklendi.
- İzlenme sayısına girişsiz izlemeler de girer (aynı yerden aynı videoya saatte bir kez sayılır, [Girişsiz izleme](girissiz-izleme.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Süzgeç mantığı](suzgec-mantigi.md), [Arama](arama.md) — sıralanan sonuçları belirleyenler.
- [Beğen](begeni.md) — "En çok beğenilen"in sayısı.
- [İstatistikler](istatistikler.md) — eğitmenin gördüğü aynı sayılar.

**İlgili:**

- [Ödev listesi](../odev/liste.md) — ödevlerin sırası (ayrı kural).

## Kod tarafı

Bugün kodda yok. Kodlanınca sıralama sunucudaki sorguda yapılır (sayfalı liste); bugün benzer bir sıralı liste kalıbı
[public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md)'dedir.

## Sık sorulanlar

- **Sırala'yı değiştirince süzgeçlerim gitti mi?** Hayır; yalnız sıra değişir.
- **"En yeni" neye göre?** Videonun yayına girdiği tarihe göre.

## Sırada

- Eğitim içerikleri (iş 17): sıralama.
- "En kısa"nın gerçek sitede kalıp kalmayacağı kullanıcıya sorulmalı (tanımda süre süzgeci vardı).
