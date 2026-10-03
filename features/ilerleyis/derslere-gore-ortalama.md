# İlerleyiş · Derslere göre ortalama

**Durum:** Tasarlandı — henüz kodda yok

İlerleyişim'in en üstündeki kutu: her ders bir sütun, sütunun üstünde o dersteki not ortalaması, sağında dönemin adı
("1. dönem").

## Ne işe yarar

Öğrenci ve velisi "hangi derste notlarım iyi, hangisinde düşük?" sorusuna sayfanın başında cevap bulur. Bugünkü sitede
dersler yalnız ödev başarı oranıyla ([Derslere göre başarı oranı](ders-oranlari.md)) ayrılır; notlar ise sınav grubu
başına ([Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md)) ve ana sayfadaki tek bir "Ortalama"yla
özetlenir. Tasarım 1 önizlemesi notları ders ders gösteren bu kutuyu İlerleyişim'in başına koyar. Ana sayfadaki
"İlerleyişim" kutucuğunun altında "ortalama 84,4" yazar; bu sayı önizlemedeki beş ders ortalamasının (82, 91, 76, 88, 85)
ortalamasına denk gelir, ama tasarım bunu kural olarak yazmıyor (önizlemedeki sayılar sabit örnektir).

## Nereden açılır

Tasarımda (Tasarım 1 önizlemesi):

- Öğrencinin **"İlerleyişim"** sayfasının en üstü (başlığın ve "Notların ve ödevlerin bir arada" alt yazısının hemen altı).
- Velinin her çocuk oturumundaki **"İlerleyiş"** sayfasının en üstü.
- Ana sayfada "İlerleyişim" kutucuğunun alt yazısı ("ortalama 84,4"; önizlemede bu kutudaki sayıların ortalamasına denk
  gelir) ([Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md)).

## Adım adım

### Kutunun düzeni (tasarım)

1. Başlık **"Derslere göre ortalama"**; sağında **"1. dönem"** (velinin Can oturumunda "Can · 5-B · 1. dönem"; Elif
   oturumunda yalnız "1. dönem").
2. Her ders bir sütun, yan yana: altında dersin kısa adı ("Mat", "Tür", "Fen", "İng", "Sos"), üstünde kalın yazıyla
   ortalaması (önizlemede öğrencide 82, 91, 76, 88, 85; Can'da 74, 88, 81, 92, 79).
3. Sütunun boyu ortalamayla orantılı (100 üzerinden), rengi dersin rengi (Matematik kırmızı, Türkçe turuncu, Fen yeşil,
   İngilizce mavi, Sosyal mor).
4. Altında yan yana "Sınav sonuçları" ve "Ödev sonuçları" grafikleri gelir
   ([Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md), [Ödev sonuçları grafiği](odev-grafigi.md)).

### Öğrenci

1. Menüden **"İlerleyişim"** (ya da ana sayfadaki "İlerleyişim" kutucuğu: alt yazısı genel ortalaman).
2. En üstteki kutuda her dersin ortalamasını gör. Önizlemede sütunlara dokunmak bir şey açmaz; bir dersin sınavları için
   aşağıdaki "Son sınavlar" listesine bak.

### Veli

1. Çocuğun oturumunda **"İlerleyiş"**.
2. Kutu yalnız o çocuğun derslerini gösterir; sağdaki yazıda çocuğun adı ve sınıfı da olabilir ("Can · 5-B · 1. dönem").

### Müdür, öğretmen ve çalışan

Öğrencinin portalını açan kişi aynı kutuyu öğrencinin gözünden görür ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).

## Kurallar ve sınırlar

Tasarımda yazılı olan yalnız görünüş; önizlemedeki sayılar sabit örnektir. Kodlanırken karar verilecekler (öneri,
kullanıcıya sorulmadı):

- **Hesap kuralı:** bir dersin ortalaması neyle hesaplanır? Bugünkü koddaki en yakın kural sınav grubu ortalamasıdır: her
  sonuç önce (değer − alt) / (üst − alt) × 100 ile 100'lüğe çevrilir, ağırlıkla ortalanır, notu girilmemiş sınav hesaba
  katılmaz. Doğal karşılık: dersin bakılan dönemdeki sınav gruplarının (yoksa sınavlarının) 100'lük ortalaması. Grup üst
  değeri (ör. 125) kararı gelirse bu kutudaki ölçek de ona göre düşünülmeli.
- **Dönem:** bugün kodda "dönem" yok, eğitim yılı var. "1. dönem" yazısı için ya dönem kavramı eklenir ya da yazı
  bakılan eğitim yılını gösterir ("2026-2027").
- **Ana sayfadaki ortalama:** bugün ana sayfa kutucuğu sınav grubu ortalamalarının düz ortalamasını "Ortalama 85.5" diye
  (noktalı) yazar; tasarımda "ortalama 84,4" (virgüllü) ve sayı önizlemede ders ortalamalarının ortalamasına denk geliyor.
  Hangi kuralla hesaplanacağı seçilmeli; kutucuk ile bu kutu aynı kurala bağlanmalı.
- **Ödev oranıyla karıştırılmamalı:** "Derslere göre" ödev başarı oranı (%) ile bu kutu (not ortalaması) ayrı şeylerdir;
  ikisi aynı sayfada kalırsa başlıklar ayrıştırılmalı.
- **Hangi dersler:** notu olan dersler. Okul kendi derslerini açabileceği için (özel branş ve ders işi) ders sayısı
  artabilir; kısa adlar ve sütun genişliği buna göre düşünülmeli.
- Görme yetkisi, okul sınırı ve yıl süzgeci bugünkü ilerleyişteki gibi kalır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [Derslere göre başarı oranı](ders-oranlari.md) — bugünkü ödev oranı (ders ders, %).
- [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md) — bugünkü not ortalamaları (grup grup).
- [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md), [Ödev sonuçları grafiği](odev-grafigi.md) — altındaki grafikler.
- [İlerleyişim sayfası](ilerleyisim.md), [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md),
  [Sınav grafiği](sinav-grafigi.md).

**İlgili:**

- [Kutucuklar](../ana-sayfa/kutucuklar.md), [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md).
- [Sınav grupları](../sinav/sinav-gruplari.md) — üst değer ve pay kararları.
- [Özel branş ve ders](../siniflar-dersler/ozel-brans-ve-ders.md).
- [Eğitim yılı açma](../egitim-yili/yil-acma.md) — dönem / yıl.

## Kod tarafı

Bugün kodda yok. Bugünkü karşılıklar:

- Ana sayfa kutucuğu: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) (`genelOrtalama`:
  sınav grubu ortalamalarının düz ortalaması, bir ondalık).
- Grup ortalaması: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`examGroups[].average`).
- Kodlanınca kartların yeri: [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md)
  (`ilerleyisKartlari`); çizim [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md).
- Tasarım kaynağı: Tasarım 1 önizlemesi (`cubukHtml`: "Derslere göre ortalama").

## Sık sorulanlar

- **Bugün sitede ders ders not ortalaması var mı?** Hayır. Bugün ders ders yalnız ödev başarı oranı ("Derslere göre"), not
  ortalaması ise sınav grubu başına var.
- **Ana sayfadaki ortalama neyin ortalaması?** Bugün: sınav gruplarının ortalamalarının düz ortalaması. Tasarımda kural
  yazılı değil; önizlemedeki sayı bu kutudaki ders ortalamalarının ortalamasına denk geliyor.

## Sırada

- Arayüz önizlemesi (Tasarım 1) koda geçerken: "Derslere göre ortalama" kutusu; hesap kuralı ve "dönem" yazısı
  kullanıcıya sorulacak.
- Sınav: sınav grubu üst değeri ve yüzde/katkı puanı (öneri, onay bekliyor) — ortalamanın ölçeğini etkiler.
- Özel branş / ders: dersler okulun kendi listesinden gelecek.
- Android yerel uygulama: İlerleyiş ekranı.
