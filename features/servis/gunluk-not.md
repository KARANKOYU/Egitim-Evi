# Servis · Velilere not yaz

**Durum:** Kodda var; tasarımda ek olarak pencerede hazır cümleler ("07:35'te hazır ol.", "16:00'da erken alacağım.", "Servis yok.") ve her öğrenci satırında doğrudan o öğrencinin velisine not yazan zarf düğmesi.

Servisçinin bir öğrencinin velisine ya da bütün servise, bugünden 7 gün sonrasına kadar bir gün için kısa tarihli not bıraktığı özellik.

## Ne işe yarar

Kullanıcının isteği (26 Eylül): "servisci ona oradan kaçta inmesi gerektiğini söyleyrbilcek her gün için yazabilcek şu gün şu yok
erken alıcam şu saat gibi". Örnek: "Yarın 07:35'te hazır ol.", "Bugün 16:00'da erken alacağım." Not velilere bildirim olarak gider,
öğrencinin ve velinin servis kartında, servisçinin o günkü listesinde de görünür.

Velinin servisçiye yazdığı karşı yönü [Binmeyecek](binmeyecek.md) işaretidir (iki yönlü günlük not).

## Nereden açılır

Servisçinin [Yoklama sayfası](yoklama-sayfasi.md) → **"Notlar"** kartının başlığında **"Not yaz"**.

Tasarımda: ayrıca her öğrenci satırının sonundaki zarf simgeli düğme ("Elif Yılmaz için not yaz"); pencere o öğrenci seçili açılır.

## Adım adım

### Servisçi

1. **"Not yaz"**a bas. "Velilere not" penceresi:
   - **"Kime?"**: "Bütün servis (bütün velilere)" (ilk seçenek) ve servisteki öğrencilerin adları.
   - **"Hangi gün için?"**: "Bugün · 3 Ekim Cumartesi", "Yarın · 4 Ekim Pazar", sonra 7 gün sonrasına kadar her gün ("5 Ekim
     Pazartesi" …).
   - **"Not"**: üç satırlık kutu, örnek yazı "ör. Yarın 07:35'te hazır ol.", en çok 200 karakter. Altında sayaç "0/200 · Velisine
     bildirim gider; not o günün listesinde de görünür."
2. **"Gönder"** ("Gönderiliyor..."). Not boşsa pencerede "Notu yaz (en çok 200 harf)."
3. Pencere kapanır, "Notlar" kartı yenilenir, üstte "Not kaydedildi. Velilere haber gitti." (veli yoksa yalnız "Not kaydedildi.").
4. **"Notlar"** kartında her not bir satır: kime ("Elif Yılmaz" ya da "Bütün servise"), gri gün rozeti ("bugün", "yarın", "5 Ekim
   Pazartesi"), notun metni ve **"Sil"**. Not yoksa: "Velilere tarihli not yazabilirsin ("Yarın 07:35'te hazır ol."); velisine
   bildirim gider."
5. Öğrenciye yazılmış not, listenin günü için yazıldıysa (saat dışında liste yarının olabilir) o öğrencinin satırında da görünür:
   "Notun: 07:35'te hazır ol."
6. Silmek için **"Sil"**: "Not silinsin mi? Velilerin ekranından da kalkar." → "Not silindi." Silmek bildirimi geri almaz (gitmiş olan
   bildirim durur).

### Veli

1. Bildirim gelir: "Servisçiden not: Yarın 07:35'te hazır ol." Dokununca çocuğunun servis sayfası açılır.
2. Çocuğunun servis kartının "bugün" bölümünde: zarf simgesiyle "Servisçinin notu · yarın" (bütün servise yazıldıysa yanında "(bütün
   servise)") ve notun metni. Bugünden sonraki günlerin notları da görünür, günü geçen not kalkar.
3. İki çocuğun aynı serviste ve servisçi bütün servise yazdıysa tek bildirim gelir.

### Öğrenci

Notu "Servisim" sayfasındaki kartında görür; bildirim öğrenciye gitmez, yalnız veliye.

### Müdür, öğretmen ve çalışan (servis yönetimi)

"Bugünkü yoklama" penceresinde: öğrenciye yazılmış o günkü not öğrencinin satırında "Servisçinin notu: …"; bütün servise yazılmış notlar
en altta "Servisçinin notu (yarın): …". Not yazamaz, silemez.

### Tasarımda (Tasarım 1 önizlemesi)

- "Velilere not" penceresi: "Kime?" seçeneklerinde ad · sınıf ve "(velisine)" ("Elif Yılmaz · 7-A (velisine)"); "Hangi gün için?";
  **"Hazır cümleler:"** düğmeleri **"07:35'te hazır ol."**, **"16:00'da erken alacağım."**, **"Servis yok."** (basınca not kutusuna
  eklenir); "Not" kutusu (örnek yazı "Ör. 07:35'te hazır ol."), sayaç "0/200", "Velisine bildirim gider; not o günün listesinde de
  görünür."; **"Vazgeç"** / **"Gönder"**. Başarıda "Not gönderildi; velisine bildirim gitti." ya da "… bütün velilere bildirim gitti."
- Silme onayı ayrı pencere: "Not silinsin mi?" — '"Pazartesi 10 dakika erken geleceğim; durakta hazır olun." (bütün servise, 5 ekim
  pazartesi). Velilerin ekranından da kalkar.' → **"Sil"** → "Not silindi; velilerin ekranından da kalktı."
- Hazır cümleler kullanıcının örneklerinden ("erken alacağım", "şu gün şu yok"); kodda bugün yok.

## Kurallar ve sınırlar

- **Kim yazar ve siler:** yalnız servisin servisçisi ("Bu servis sana atanmamış"; başkası silmeye kalkarsa "Notu yazan servisçi siler",
  bulunamazsa "Not bulunamadı").
- **Kime:** bir öğrenci (velisi) ya da bütün servis. Öğrenci serviste değilse "Öğrenci bu serviste değil".
- **Tarih:** bugün ile 7 gün sonrası arası: "Notun tarihi bugün ile 7 gün sonrası arasında olmalı." Gün seçenekleri telefonun saatiyle
  hesaplanır; telefonun saati çok yanlışsa seçilen gün bu aralığa düşmeyebilir.
- **Uzunluk:** en çok 200 karakter; boş not "Notu yaz (en çok 200 harf)." Satır sonları ve fazla boşluklar tek boşluğa iner.
- **Sıklık:** saatte en çok 60 not: "Çok sık not yazdın. Biraz sonra dene."
- **Bildirim:** yalnız velilere ("Servisçiden not: …", bağlantı o çocuğun servis sayfası); bir veli (kardeşler) tek bildirim alır.
  Öğrenciye bildirim gitmez.
- **Kim görür:** öğrencinin kendisi ve velisi (kartta), servisçi ve okul yönetimi.
- **Saklama:** notlar 30 gün sonra silinir ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- Servis saatine bağlı değil: not her saatte yazılır ve kartta her zaman görünür.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Binmeyecek](binmeyecek.md) — velinin servisçiye bildirdiği karşı yön.
- [Yoklama sayfası](yoklama-sayfasi.md) — "Notlar" kartı.
- [Servisim ve servis kartı](servisim.md) — velinin gördüğü not.
- [Servis bildirimleri](servis-bildirimleri.md) — "Servisçiden not: …".
- [Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md).

**İlgili:**

- [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [Bildirim paneli](../bildirim/bildirim-paneli.md).
- [Hazır şablonlar](../mesaj/hazir-sablonlar.md) — mesajlardaki hazır metinler (benzer fikir, tasarım).
- [Bana kim yazabilir](../mesaj/bana-kim-yazabilir.md) — bugün servisçinin mesaj kutusunda yazabileceği kişi listesi boştur; veli de
  servisçiye mesaj yazamaz, iki yönlü kısa iletişim not ve "binmeyecek" işaretiyle olur.

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/servis/not { servisId, ogrenciId?, tarih?,
  metin }` (saatte 60; velilere tek bildirim), `POST /api/servis/not-sil { id }`, `ileriTarih`, `notGorunumu`.
- Depo: [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md) — `notEkle`, `notSil`, `servisinNotlari`,
  `ogrencilerinNotlari`; tablo `servis_notlari`.
- Ön yüz: [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) — `sy-not-yaz`, `sy-not-kaydet`,
  `sy-not-sil`, `syNotlarHtml`; velinin kartı [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md)
  (`servisBugunIc`).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (notlar, notu kim görür).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Not yaz").

## Sık sorulanlar

- **Notu yalnız bir veliye mi gönderebilirim?** "Kime?" listesinden öğrenciyi seç; yalnız onun velilerine gider.
- **Notu sildim, veli görmeye devam eder mi?** Kartından kalkar; ama telefonuna düşmüş bildirim silinmez.
- **Uzun bir açıklama yazmam lazım.** Not 200 karakterle sınırlı; birkaç not yazabilir ya da okul yönetimine haber verebilirsin.
- **Veli bana not yazabilir mi?** "Binmeyecek" işaretine en çok 200 karakterlik kısa not ekleyebilir; sana bildirim olarak gelir.

## Sırada

- Linux kodlaması (Tasarım 1): hazır cümleler ve satırdaki not düğmesi.
- Android yerel uygulama: servisçinin not yazması.
