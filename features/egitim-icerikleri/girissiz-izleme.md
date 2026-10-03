# Eğitim içerikleri · Girişsiz izleme ("Bunun için giriş yap")

**Durum:** Tasarlandı — henüz kodda yok

Giriş yapmamış ziyaretçi eğitim içeriklerinin listesini, aramayı, süzgeçleri, videoları, herkese açık serileri ve paylaşılmış
listeleri açar ve izler; Beğen, Kaydet, liste, İndir, Bildir ve kaldığın yer için giriş ister; ondan hiçbir kişisel veri tutulmaz.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "eğitim içerikleri oturuma girmeden önce ana sitede header'da bir satır". Önerilen yorum (EBA ve YouTube
gibi liste, arama ve izleme girişsiz açık; kişisel işler girişli) kullanıcıya bu yorumla söylendi, cevap: "evet bu" (29 Eylül). Böylece
okulu Eğitim Evi'ni kullanmayan öğrenci de videoları izler, arama motorları sayfaları bulur.

## Nereden açılır

- Açılış sayfasının üst şeridinde **"Eğitim içerikleri"** bağlantısı (dar ekranda yalnız simgesi) →
  `egitimevi.org/egitim-icerikleri` ([Açılışın üst şeridi ve alt bilgisi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md)).
- Sana gönderilen bir video (`/izle/<kimlik>`) ya da liste (`/watchlist/<kimlik>`) bağlantısı ([Adresler](adresler.md)).
- Arama motorundan gelen bağlantı.

## Adım adım

### Ziyaretçi (giriş yapmamış)

1. Üst şeritte **"Eğitim içerikleri"**ne bas. Sayfanın başında: **"Eğitim içerikleri"** ve "Eğitmenlerin anlattığı ders videoları — 1.
   sınıftan 12. sınıfa. Giriş yapmadan izleyebilirsin; kaydetmek ve listeye eklemek için giriş yap."
2. Arama, Sınıf ve Ders süzgeçleri, Sırala giriş yapmış kişidekiyle aynı ([Süzgeç mantığı](suzgec-mantigi.md)). Bölüm çipleri
   (Kaydettiklerim, İndirdiklerim, İzleme geçmişim, listeler) yoktur.
3. Bir karta bas: video açılır ve oynar. YouTube videosu da oynar; YouTube'a istek yalnız oynat'a basınca gider.
4. Giriş isteyen bir düğmeye bas (**Beğen**, **Kaydet**, **Listeye ekle**, **İndir**, **Bildir**): **"Bunun için giriş yap"** penceresi
   açılır.
5. Pencereden giriş yap: aynı videoya dönersin ve bastığın düğmenin işi kaldığı yerden sürer (ör. "Kaydet"e basmıştın → video
   kaydedilir).
6. Paylaşılmış bir liste bağlantısını açtıysan listeyi salt okunur görür ve sırayla oynatırsın ([Listeyi paylaş](listeyi-paylas.md)).

**Tasarımda (Tasarım 1 önizlemesi):** ziyaretçinin video penceresinde giriş isteyen düğmeler yerine tek bir **"Kaydetmek için giriş
yap"** düğmesi var (giriş ekranına gider, sonra aynı videoya dönmez) ve **"Bildir"** girişsiz de açılıyor. Tanım (29 Eylül, onaylı):
Bildir de giriş ister; her düğme kendi "Bunun için giriş yap" penceresini açar ve girince aynı işe döner.

## Kurallar ve sınırlar

- **Girişsiz açık:** `/egitim-icerikleri` (`/videos`) listesi, arama ve süzgeçler, `/izle/<kimlik>` (`/watch/<kimlik>`), herkese açık
  eğitmen serileri, PAYLAŞILMIŞ kişisel listeler (`/watchlist/<kimlik>`, `/izleme-listesi/<kimlik>`).
- **Giriş gereken:** Beğen, Kaydet, liste oluşturma ve listeye ekleme, Listeyi paylaş, İndir, Bildir, kaldığın yer ve izleme geçmişi.
- **Kişisel veri tutulmaz:** çerez yok, kimlik yok. İzlenme yalnız SAYI olarak artar: aynı IP'den aynı videoya saatte bir kez sayılır;
  IP saklanmaz (bellekte kısa süreli bir özet), bot ve tekrar süzgeci vardır.
- **Hız sınırı:** girişsiz video isteklerine IP başına dakikada makul bir sınır (bant genişliği koruması); Eğitim Evi'ndeki videolar
  parça parça (HTTP Range) sunulur.
- **Arama motorları** liste, izleme sayfaları ve herkese açık serileri dizinler (başlık, açıklama, küçük resim); paylaşılmamış listeler
  ve kişisel sayfalar dizine girmez (`noindex`).
- **Okul kapatamaz:** girişsiz açık olduğu için okulun "eğitim içeriklerini kapatma" seçeneği eklenmedi (kullanıcıya söylendi).
- **KVKK:** aydınlatma metnine girişsiz izleme (kişisel veri tutulmadığı) ve arama motoru dizini yazılır.
- Dil seçici ("TR ▾") girişsiz eğitim içeriklerinde de çalışır; videonun başlığı ve açıklaması çevrilmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Adresler](adresler.md) — hangi adres girişsiz açık.
- [Video listesi](video-listesi.md), [İzleme sayfası](izleme-sayfasi.md) — ziyaretçinin gördükleri.
- [Beğen](begeni.md), [Kaydet ve Kaydettiklerim](kaydedilenler.md), [Oynatma listeleri](oynatma-listeleri.md),
  [İndir ve İndirdiklerim](indirdiklerim.md), [Videoyu bildir](bildir.md), [Kaldığın yerden devam](kaldigi-yerden-devam.md) — giriş
  isteyen işler.
- [Listeyi paylaş](listeyi-paylas.md), [Eğitmen serileri](egitmen-serileri.md) — girişsiz açılan listeler.

**İlgili:**

- [Açılış sayfası](../acilis-sayfasi/acilis.md), [Giriş](../giris-hesap/giris.md).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).
- [Dil seçici](../dil/dil-secici.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Girişsiz sayfalar ve üst şerit: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md).
- IP başına hız sınırları ve istemci IP'si: [sunucu/guvenlik.md](../../sunucu/guvenlik.md).
- Giriş sonrası aynı sayfaya dönme: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md),
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md).

## Sık sorulanlar

- **Videoları izlemek için hesap gerekiyor mu?** Hayır. Beğenmek, kaydetmek, indirmek ve bildirmek için gerekir.
- **Girişsiz izlerken beni takip ediyor musunuz?** Hayır; çerez ve kimlik yok, izlenme yalnız sayı olarak artar.
- **Kaydet'e bastım, giriş istedi; girince ne olur?** Aynı videoya dönersin ve video kaydedilir.

## Sırada

- Eğitim içerikleri (iş 17): girişsiz erişim, "Bunun için giriş yap" penceresi ve girişten sonra aynı işe dönüş.
- Önizlemedeki fark (tek "Kaydetmek için giriş yap" düğmesi, girişsiz açılan Bildir) HTML işinde tanıma göre düzeltilecek.
