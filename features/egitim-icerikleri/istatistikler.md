# Eğitim içerikleri · İstatistikler (yalnız toplamlar)

**Durum:** Tasarlandı — henüz kodda yok

Eğitmenin panelindeki "İstatistikler": toplam izlenme, beğeni, kaydeden ve indirme; son 30 günün günlük izlenme çizgisi ve video
başına toplamlar tablosu — kimin izlediği, beğendiği, kaydettiği ya da indirdiği hiçbir yerde görünmez.

## Ne işe yarar

Kullanıcının 29 Eylül sözleri: "/panel/egitmen ile video izlenmelerine, beğenilere bakabilsin" ve "Eğitmen videolarını kimin izlediğini
görmesin. Eğitmen panelinde yalnız toplam sayılar olsun: izlenme, beğeni, kaydeden, indirme. İzleyen öğrencilerin adları olmasın."
Eğitmen neyin tuttuğunu görür; öğrencinin mahremiyeti korunur.

## Nereden açılır

Eğitmen paneli → sol menü **"İstatistikler"** ya da ana sayfadaki kutucuk ("bu hafta 1,8 B izlenme") ([Eğitmen paneli](egitmen-paneli.md)).
Sayfanın alt başlığı: "Yalnız toplam sayılar · kimin izlediği görünmez".

## Adım adım

### Eğitmen

1. Üstte dört büyük sayı: **"toplam izlenme"**, **"toplam beğeni"**, **"toplam kaydeden"**, **"toplam indirme"** (binlik ayırıcı noktalı:
   "14.100").
2. Altında kilit simgeli not: **"Kimin izlediğini, beğendiğini, kaydettiğini ya da indirdiğini göremezsin; burada yalnız toplamlar var."**
3. **"Son 30 günde izlenme"** kutusu (başlıkta toplam, ör. "9.820 izlenme"): günlük izlenmenin çizgi grafiği. Yatay eksende tarihler
   ("2 Eyl", "9 Eyl" … en sağda "bugün"; dar ekranda üç etiket), dikeyde "güzel" sayılarla ölçek ("1,5 B").
   - Fareyle grafiğin üstünde gezin ya da dokun: o günün dikey çizgisi ve noktası, kutucukta **"312 izlenme"** ve "28 Eylül Pazartesi"
     (son gün için "· bugün").
   - Klavyeyle: grafiğe sekmeyle gel, **←/→** gün gün, **Home/End** ilk/son gün.
   - Altında açılır **"Günlere göre tablo"**: her gün ve izlenmesi, en yeni üstte.
4. **"Video başına toplamlar"** kutusu (başlıkta "N video"): sütunlar **Video · İzlenme · Beğeni · Kaydeden · İndirme**; her satırda videonun
   adı, altında "7. sınıf · YouTube" / "· Yüklenen" (YouTube'dan kalkmışsa "· YouTube'dan kaldırılmış"); YouTube videosunda indirme yerine
   **"—"** ve "indirilemez".

## Kurallar ve sınırlar

- **Yalnız toplamlar:** kişi adı, sınıf, okul, tarih-saat bazında kişi izi YOK (29 Eylül, onaylı). Kaldığın yer ve izleme geçmişi yalnız
  izleyenin kendisinde ([Kaldığın yerden devam](kaldigi-yerden-devam.md)).
- **İzlenme nasıl sayılır:** girişsiz izlemede aynı yerden (IP) aynı videoya saatte bir kez; IP saklanmaz; bot ve tekrar süzgeci
  ([Girişsiz izleme](girissiz-izleme.md)).
- **"Kaydeden"** = Kaydettiklerim'e ekleyen kişi sayısı; **"indirme"** = indirme sayısı (yalnız Eğitim Evi'ne yüklenen videoda).
- **İşlenmekte olan video** (yükleniyor) istatistiğe girmez.
- **Sayı biçimi:** ana sayfada ve kartlarda "4,2 B"; istatistikte tam sayı ("4.200").

**Tasarımda (Tasarım 1 önizlemesi):** sayılar örnek; günlük dağılım videoların yayın gününden bugüne yayılarak üretiliyor.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Eğitmen paneli](egitmen-paneli.md), [Videolarım](videolarim.md) — video başına aynı sayılar.
- [Beğen](begeni.md), [Kaydet ve Kaydettiklerim](kaydedilenler.md), [İndir ve İndirdiklerim](indirdiklerim.md) — sayıları doğuran işler.
- [Sıralama](siralama.md) — "En çok izlenen", "En çok beğenilen".

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).
- [İlerleyiş](../ilerleyis/README.md) — sitedeki öbür grafikler.

## Kod tarafı

Bugün kodda yok. Grafik için bugünkü kütüphanesiz SVG grafik parçası ("güzel" eksen sayıları, çizgi grafik):
[public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md).

## Sık sorulanlar

- **Videomu kimin izlediğini görebilir miyim?** Hayır; yalnız toplamlar.
- **Grafik neden bugün düşük?** Gün daha bitmedi; sayı gün boyunca artar.

## Sırada

- Eğitim içerikleri (iş 17): istatistikler (günlük izlenme sayacı, toplamlar).
