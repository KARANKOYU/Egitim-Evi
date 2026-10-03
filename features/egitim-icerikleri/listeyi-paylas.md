# Eğitim içerikleri · Listeyi paylaş ve paylaşmayı durdur

**Durum:** Tasarlandı — henüz kodda yok

Kişisel listenin "Listeyi paylaş" düğmesi: `egitimevi.org/watchlist/<kimlik>` bağlantısını ve "Kopyala"yı verir; bağlantıyı açan herkes
listeyi salt okunur görür ve oynatır; "Paylaşmayı durdur" bağlantıyı öldürür.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "listeyi paylaş butonu (zaten hepsi duruyor): ip/watchlist/id". Öğretmen ya da öğrenci hazırladığı
listeyi arkadaşına, sınıfına gönderir.

## Nereden açılır

- **"Listeye ekle"** penceresinde her listenin yanında **"Listeyi paylaş"** ([Oynatma listeleri](oynatma-listeleri.md)).
- Eğitim içerikleri sayfasında listenin çipi seçiliyken, listenin başlık satırında **"Listeyi paylaş"**.
- Eğitmen: panelde **"Oynatma listelerim"** → listenin satırında **"Paylaş"** ([Eğitmen serileri](egitmen-serileri.md)).

## Adım adım

### Giriş yapmış herkes (listenin sahibi)

1. **"Listeyi paylaş"**a bas. **"Listeyi paylaş"** penceresi açılır.
2. Liste henüz paylaşılmadıysa: "Bu liste şu an yalnız sana açık." ve **"Bağlantı oluştur"** düğmesi; altında "Bağlantıyı alan herkes
   listeyi açıp izleyebilir; listeyi değiştiremez. İstediğin zaman durdurursun." **"Bağlantı oluştur"**a bas → ileti **"Paylaşım
   bağlantısı oluşturuldu."**
3. Paylaşılmış listede: "Bağlantıyı alan herkes listeyi açıp izleyebilir; listeyi değiştiremez.", salt okunur bağlantı kutusu
   (`https://egitimevi.org/watchlist/k3m9xq2wd7ra` gibi) ve yanında **"Kopyala"**.
4. **"Kopyala"**ya bas: bağlantı panoya kopyalanır, düğme 2 saniye **"Kopyalandı"** olur, ileti **"Bağlantı panoya kopyalandı."**
   (eğitmen panelinde "Bağlantı kopyalandı."). Kopyalanamazsa: **"Kopyalanamadı; bağlantıyı seçip kendin kopyala."**
5. **"Paylaşmayı durdur"** (kırmızı) — altında "Durdurunca bu bağlantı artık açılmaz." Basınca ileti **"Paylaşım durdu; eski bağlantı
   artık açılmıyor."**; pencere yeniden "Bu liste şu an yalnız sana açık." olur.
6. **"Kapat"** ile pencere kapanır.

**Tasarımda (Tasarım 1 önizlemesi):** eğitmen dışındaki rollerde "Listeyi paylaş" penceresi doğrudan bağlantıyı ve "Kopyala"yı
gösteriyor; "Bağlantı oluştur" ve "Paylaşmayı durdur" yalnız eğitmen panelinde var. Tanıma göre (29 Eylül, onaylı) liste başta yalnız
sahibine açıktır ve "Paylaşmayı durdur" HER sahipte vardır; yukarıdaki adımlar herkes için geçerlidir. Önizlemede öğrencinin
bağlantısı sayıyla bitiyor (`/watchlist/4821`); gerçek kimlik 12 karakter rastgele.

### Bağlantıyı açan (ziyaretçi dahil herkes)

1. `/watchlist/<kimlik>` (ya da `/izleme-listesi/<kimlik>`) bağlantısını aç: listenin adı ve videoları görünür.
2. Videoları sırayla oynatırsın; listeyi DEĞİŞTİREMEZSİN (ekleme, çıkarma, sıralama yok).
3. Giriş yaptıysan oradaki bir videoyu kendi **Kaydettiklerim**'ine ekleyebilirsin.
4. Sahibi paylaşmayı durdurduysa bağlantı **sayfa bulunamadı (404)** verir.

## Kurallar ve sınırlar

- **Kimlik 12 karakter rastgele** (a–z, 0–9). "Paylaşmayı durdur" kimliği YENİLER: eski bağlantı 404 olur; yeniden paylaşınca yeni
  bir bağlantı çıkar.
- **Sahibin adı gösterilmez:** paylaşılan listede sahibinin adı ya da kullanıcı adı yazmaz, yalnız listenin adı (öğrenci gizliliği;
  tanımdaki öneri).
- **Girişsiz açılır** (29 Eylül onaylı karar). Arama motoru için tanım yalnız "özel/paylaşılmamış listeler dizine girmez" diyor;
  paylaşılmış kişisel listenin dizine girip girmeyeceği yazılmamış.
- **Eğitmenin herkese açık serisi** aynı adres biçimini kullanır ve her zaman açıktır ([Eğitmen serileri](egitmen-serileri.md)).
- Liste silinince bağlantısı da ölür ("Paylaşılan bağlantı da artık açılmaz.").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatma listeleri](oynatma-listeleri.md) — paylaşılan liste.
- [Eğitmen serileri](egitmen-serileri.md) — her zaman açık seri.
- [Adresler](adresler.md) — `/watchlist/<kimlik>`.
- [Girişsiz izleme](girissiz-izleme.md) — bağlantıyı girişsiz açan.
- [Kaydet ve Kaydettiklerim](kaydedilenler.md) — paylaşılan listeden kaydetme.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Bağlantı kimliği `crypto.randomBytes` ile üretilir; adres eşleri [sunucu/http.md](../../sunucu/http.md)'deki adres
tablosuna girer.

## Sık sorulanlar

- **Paylaştığım listeyi arkadaşım değiştirebilir mi?** Hayır; yalnız izler.
- **Bağlantıyı yanlış kişiye gönderdim.** "Paylaşmayı durdur"a bas; eski bağlantı artık açılmaz.
- **Arkadaşım listede adımı görür mü?** Hayır; yalnız listenin adını görür.

## Sırada

- Eğitim içerikleri (iş 17): listeyi paylaş, bağlantı oluştur, paylaşmayı durdur, salt okunur liste sayfası.
- Önizlemede öğrenci tarafına "Bağlantı oluştur" ve "Paylaşmayı durdur" eklenecek (HTML işi).
