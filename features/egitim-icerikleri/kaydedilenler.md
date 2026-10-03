# Eğitim içerikleri · Kaydet ve Kaydettiklerim

**Durum:** Tasarlandı — henüz kodda yok

Videonun altındaki "Kaydet" düğmesi videoyu "Kaydettiklerim"e (sonra izle) koyar; Kaydettiklerim oynatma listelerinden ayrıdır ve
liste hakkına sayılmaz.

## Ne işe yarar

Kullanıcının 29 Eylül istekleri: "videoyu kaydet ve oynatma listesi mantığı" ve "tamam, kaydedilenler ayrı olsun". Öğrenci sonra
izlemek istediği videoyu tek dokunuşla ayırır; liste açmakla uğraşmaz.

## Nereden açılır

- İzleme sayfasında düğme satırının ikincisi: **"Kaydet"** ([İzleme sayfası](izleme-sayfasi.md)).
- Eğitim içerikleri sayfasının bölüm çiplerinde **"Kaydettiklerim · N"** ([Video listesi](video-listesi.md)).

## Adım adım

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. Videoda **"Kaydet"**e bas: düğme dolar, **"Kaydedildi"** olur; ileti **"Kaydettiklerine eklendi."**
2. Yeniden bas: çıkar; ileti **"Kaydettiklerinden çıkarıldı."**
3. Eğitim içerikleri sayfasında **"Kaydettiklerim · N"** çipine bas: yalnız kaydettiğin videolar kalır; süzgeçler, arama ve Sırala
   bunların içinde çalışır. Özet satırında **"Kaydettiklerim"** çipi çıkar; × ile "Bütün videolar"a dönersin.
4. Kaydettiğin videonun kartında bilgi satırının sonunda **"· kaydettin"** yazar.
5. Paylaşılmış birinin listesini açtıysan (salt okunur), oradaki videoları kendi Kaydettiklerim'ine ekleyebilirsin
   ([Listeyi paylaş](listeyi-paylas.md)).

### Ziyaretçi (giriş yapmamış)

**"Kaydet"**e basınca **"Bunun için giriş yap"**; girince aynı videoya döner ve video kaydedilir ([Girişsiz izleme](girissiz-izleme.md)).

### Eğitmen

Kendi videosunu kaç kişinin kaydettiğini ("kaydeden" sayısı) görür; kimin kaydettiğini görmez ([İstatistikler](istatistikler.md)).

## Kurallar ve sınırlar

- **Liste hakkına sayılmaz:** kişi başına 2 (eğitmende 4) liste hakkı Kaydettiklerim'i kapsamaz (29 Eylül, onaylı).
- **Yalnız sahibi görür;** paylaşılamaz.
- **YouTube videosu da kaydedilir** (indirilemez ama kaydedilir).
- **Sayı sınırı:** tanımda Kaydettiklerim için ayrı bir sınır yazılmamış (listelerdeki 100 sınırı listeler için).
- **Video kaldırılınca:** tanımda kişisel listeler için "Bu video kaldırıldı" satırı kalır (sessizce kaybolmaz). Tasarım 1'de video
  Kaydettiklerim'den sessizce düşüyor; Kaydettiklerim'in de listeler gibi davranması tanımın ruhuna uygun (karar yok).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatma listeleri](oynatma-listeleri.md) — ayrı, adlı listeler.
- [Süzgeç mantığı](suzgec-mantigi.md) — "Kaydettiklerim" bir bölümdür.
- [İzleme geçmişi](izleme-gecmisi.md), [İndir ve İndirdiklerim](indirdiklerim.md) — öbür kişisel bölümler.
- [İstatistikler](istatistikler.md) — "kaydeden" sayısı.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca yalnız video kimliği tutan kişi + video tablosu (yeni şema dosyası,
[sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).

## Sık sorulanlar

- **Kaydettiklerim ile oynatma listesi farkı ne?** Kaydettiklerim tek bir "sonra izle" kutusudur, adı yoktur, liste hakkını yemez.
  Oynatma listeleri adlıdır, en çok 2 tane (eğitmende 4), paylaşılabilir.
- **Kaydettiğim video kayboldu.** Eğitmen kaldırmış ya da YouTube'dan silinmiş olabilir.

## Sırada

- Eğitim içerikleri (iş 17): Kaydet ve Kaydettiklerim.
- Kaldırılan videonun Kaydettiklerim'de "Bu video kaldırıldı" satırı olarak kalıp kalmayacağı kullanıcıya sorulmalı.
