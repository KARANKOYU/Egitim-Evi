# Eğitim içerikleri · Etkin süzgeç çipleri ve temizleme

**Durum:** Tasarlandı — henüz kodda yok

Sonuçların başındaki özet satırı: kaç video bulunduğu ve o an açık her süzgecin × ile kaldırılan çipi; birden çok süzgeç varken
"Hepsini temizle"; hiç sonuç yoksa "Süzgeçleri temizle".

## Ne işe yarar

Dar ekranda süzgeç sütunu kapalıyken bile neyle süzdüğünü görürsün ve tek dokunuşla geri alırsın. Kullanıcının 1 Ekim isteğindeki
"gerçek filtrelemeli" listenin parçası.

## Nereden açılır

Eğitim içerikleri sayfasında sonuçların hemen üstü ([Video listesi](video-listesi.md)). Süzgeç sütunundaki "Sınıf" ve "Ders"
başlıklarının yanındaki "Temizle" bağlantıları da bu belgede.

## Adım adım

### Herkes (ziyaretçi dahil; bölüm çipi yalnız giriş yapmışta)

1. Özet satırının başında kalın **"N video"** yazar (ör. "6 video").
2. Yanında açık her süzgeç için bir çip, bu sırayla:
   - her seçili sınıf, küçükten büyüğe: **"7. sınıf"**, **"8. sınıf"**;
   - her seçili ders, seçtiğin sırayla: **"Matematik · Ortaokul"**;
   - arama varsa tırnak içinde: **"“kesir”"**;
   - bir bölüm seçiliyse bölümün adı: **"Kaydettiklerim"**, **"İndirdiklerim"**, **"İzleme geçmişim"** ya da listenin adı.
3. Çipin üstündeki × işaretine bas: yalnız o süzgeç kalkar (arama çipi kutuyu da boşaltır; bölüm çipi "Bütün videolar"a döndürür).
   Sesli adı: "7. sınıf süzgecini kaldır".
4. En az iki çip varken satırın sonunda **"Hepsini temizle"** çıkar: sınıf, ders, arama ve bölümü birden sıfırlar (tek çipte
   çipin kendi × işareti yeter).
5. Hiç video kalmadıysa sonuç alanında kesik çizgili kutu: **"Bu süzgeçte video yok."**, altında "Bir süzgeci kaldır ya da başka
   bir sınıf seç." ve (çip varsa) **"Süzgeçleri temizle"** düğmesi — "Hepsini temizle" ile aynı işi yapar.
6. Süzgeç sütununda **"Sınıf"** başlığının yanındaki **"Temizle"** yalnız sınıfları, **"Ders"** başlığının yanındaki
   **"Temizle"** yalnız dersleri kaldırır; ikisi de yalnız o bölümde seçim varken görünür.
7. Dar ekranda **"Süzgeçler"** düğmesindeki rozet, seçili sınıf + ders sayısını gösterir (arama ve bölüm sayılmaz); süzgeç yoksa
   rozet gizlidir.

## Kurallar ve sınırlar

- Sıralama çip değildir ve temizlenmez ([Sıralama](siralama.md)).
- Çipler ve "N video" her değişiklikte yenilenir; özet satırı ekran okuyucuya duyurulur.
- Temizleme sayfayı zıplatmaz: süzgeç sütununun kaydırma yeri korunur ([Süzgeç mantığı](suzgec-mantigi.md)).
- Bir listenin içindeyken (bölüm = liste) çiplerin altında listenin başlık satırı da çıkar ([Oynatma listeleri](oynatma-listeleri.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Süzgeç mantığı](suzgec-mantigi.md) — çiplerin temsil ettiği kural.
- [Sınıf süzgeci](sinif-ve-kademe-suzgeci.md), [Ders süzgeci](ders-suzgeci.md), [Arama](arama.md) — çipleri doğuran süzgeçler.
- [Video listesi](video-listesi.md) — özet satırının yeri.

**İlgili:**

- [Ödev süzgeçleri](../odev/suzgecler.md) — ödevlerdeki "Temizle".

## Kod tarafı

Bugün kodda yok. Benzer "Temizle" ve süzgeç çubuğu: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md).

## Sık sorulanlar

- **Telefonda süzgeç açık mı nasıl anlarım?** "Süzgeçler" düğmesindeki sayı ve sonuçların üstündeki çipler söyler.
- **"Hepsini temizle" sıralamayı da sıfırlar mı?** Hayır.

## Sırada

- Eğitim içerikleri (iş 17): özet satırı ve çipler.
