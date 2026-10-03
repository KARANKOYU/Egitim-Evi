# Servis · Servis saatleri (sabah ve akşam aralığı)

**Durum:** Kodda var; tasarımda ek olarak velinin ve öğrencinin servis sayfasındaki "Servis bilgisi" grubunda her zaman görünen "Servis saatleri:" satırı.

Okulun iki servis aralığı (sabah evden okula, akşam okuldan eve): servisçi yoklamayı ve seferi yalnız bu saatlerde açar, öğrenci ve
veli canlı bilgiyi yalnız bu saatlerde görür.

## Ne işe yarar

Kullanıcının isteği (26 Eylül): "müdür saat aralığı seçicek sabah ve akşam için sabah için ben 7 ile 9.20 seçerdim bizim okul akşam
için 16.30 ve 19.00 müdürün seçtiği aralıkta veli görebilcek" ve "yoklama sadece müdürün saatlerinde açık olur". Böylece:

- Servisçi gece ya da öğlen yanlışlıkla yoklama işaretleyemez, sefer başlatamaz.
- Veli ve öğrenci aracın yerini, bugünkü durumu ("Bindi 07:42") ve sırayı ("5. sırada, önünde 2 öğrenci") yalnız bu aralıklarda
  görür; geri kalan zamanda servis kartı (plaka, şoför, durak) yine görünür ama canlı bilgi gelmez.
- Telefon uygulaması bu saatlerde bildirimleri daha sık sorar ("servise bindi" gecikmesin).

## Nereden açılır

[Servisler sayfası](servisler-sayfasi.md)'nın yönetim bölümünün en üstündeki **"Servis saatleri"** kartı (müdür ve "Servisleri ve servis
öğrencilerini düzenler" yetkilisi). Başka rollerde kart yoktur; saatler onların ekranlarında yazı olarak görünür (aşağıda).

## Adım adım

### Müdür

1. Menüden **"Servisler"**. En üstte **"Servis saatleri"** kartı (saat simgeli).
2. Kartın açıklaması: "Veli ve öğrenci servisin yerini, sırasını ve bugünkü durumunu yalnız bu saatlerde görür; servisçi yoklamayı ve
   seferi yalnız bu saatlerde açar. Saat bitince yoldaki sefer en çok 60 dakika daha sürer. Her gün geçerlidir."
3. İki grup:
   - **"Sabah (evden okula)"**: **"Başlangıç"** ve **"Bitiş"** saat kutuları,
   - **"Akşam (okuldan eve)"**: **"Başlangıç"** ve **"Bitiş"**.
   Okul hiç seçmediyse varsayılan 07:00–09:20 ve 16:30–19:00 gelir.
4. Saatleri değiştir, **"Saatleri kaydet"**e bas ("Kaydediliyor...").
5. Kartın altında yeşil: "Servis saatleri kaydedildi. Yeni aralıklar: sabah 07:00–09:20, akşam 16:30–19:00." Sayfa yeniden çizilmez.
   Hata olursa aynı yerde kırmızı yazar (aşağıda).

### Öğretmen ve çalışan

"Servisleri ve servis öğrencilerini düzenler" yetkin varsa (bugün "Servis Sorumlusu" ek rolü; tasarımda çalışana da verilebilir)
kart sende de çıkar, müdür gibi değiştirirsin. Yetkin yoksa kartı görmezsin; okul personeli olarak sunucu sana saatleri yine
gönderir ama ekranda gösterilmez.

### Servisçi

- Yoklama sayfası saatleri kendi başlığında gösterir: "Sabah yoklaması" yanında yeşil "Bugün · 07:00–09:20" (açıkken), gri (kapalıyken).
- Aralık dışında: "Yoklama sabah 07:00–09:20 ve akşam 16:30–19:00 arasında açılır. Sıradaki: yarın sabah 07:00–09:20."; liste sıradaki
  aralığın sırasıyla görünür, işaret düğmeleri çıkmaz ([Yoklama sayfası](yoklama-sayfasi.md)).
- Aralık bitince başlamış sefer 60 dakika daha sürer; o sürede üstte turuncu "Servis saati bitti; yoldaki sefer en çok 60 dakika daha
  sürer. İşaretlemeyi bitir." yazar.
- Aralık dışında "Seferi başlat"a basılırsa: "Sefer yalnız servis saatlerinde başlar: sabah 07:00–09:20 ve akşam 16:30–19:00."

### Öğrenci ve veli

- Servis kartının "bugün" bölümü aralık dışında soluk satırla: "Servisin yeri, sırası ve bugünkü durumu yalnız servis saatlerinde
  görünür (sabah 07:00–09:20, akşam 16:30–19:00). Sıradaki: yarın sabah 07:00–09:20." ([Servisim ve servis kartı](servisim.md)).
- Haritanın durum satırı: "Aracın yeri yalnız servis saatlerinde görünür: sabah 07:00–09:20, akşam 16:30–19:00."
  ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)).
- Aralık içinde (ya da sefer uzatmada sürerken) "Bu sabah" / "Bu akşam" başlığıyla bugünkü durum ve sıra görünür.
- Velinin "binmeyecek" penceresi, bugün için hâlâ servis saati varsa bugünü, yoksa yarını seçili açar ([Binmeyecek](binmeyecek.md)).

Tasarımda (Tasarım 1 önizlemesi): müdürün "Servisler" sayfasının üstünde "Servis saatleri" grubu ("her gün geçerli"), "Sabah" ve
"Akşam" satırlarında iki saat kutusu, not "Servisçinin yoklaması ve seferi yalnız bu saatlerde açılır; veli de servisin yerini bu
saatlerde görür." ve **"Kaydet"**; başarıda "Servis saatleri kaydedildi: sabah 07:00–09:20, akşam 16:30–19:00." Hata iletileri
önizlemede "Saatlerin hepsini doldur.", "Sabah bitişi başlangıcından sonra olmalı.", "Sabah aralığı en az 30 dakika olmalı.", "Sabah
aralığı akşam aralığı başlamadan bitmeli." Kural aynı; kullanıcı yazılar için ayrıca bir şey söylemediği için bugünkü metinler
geçerlidir. Velinin ve öğrencinin servis sayfasında "Servis bilgisi" grubunda **"Servis saatleri:"** satırı da var
("sabah 07:00–09:20, akşam 16:30–19:00").

## Kurallar ve sınırlar

- **Kim değiştirir:** müdür ve `servis.yonet` yetkilisi. Başkası: "Servisleri düzenleme yetkin yok".
- **Biçim:** saat `SS:DD`; "7:00" yazılırsa "07:00" olur. Boş ya da bozuksa "Saatleri 07:00 biçiminde yaz." (dört kutunun hepsi
  dolu olmalı).
- **Sıra ve uzunluk:**
  - "Sabah aralığının bitişi başlangıcından sonra olmalı."
  - "Akşam aralığının bitişi başlangıcından sonra olmalı."
  - "Her aralık en az 30 dakika olmalı."
  - "Sabah aralığı akşam aralığı başlamadan bitmeli." (Sabahın bitişi akşamın başlangıcına eşit olabilir.)
  - İkisi de gece yarısını geçmez (bitiş başlangıçtan sonra olmak zorunda).
- **Bitiş dakikası dahil:** 07:00–09:20 aralığı 09:20'nin sonuna kadar açıktır.
- **Her gün geçerli:** hafta sonu ya da tatil ayrımı yok.
- **Türkiye saati:** hesap sunucuda Türkiye saatiyle yapılır; sunucunun ya da telefonun saat dilimi önemli değil. Dönemi (sabah mı
  akşam mı) her zaman sunucu belirler, telefonun saatine güvenilmez.
- **60 dakikalık uzatma:** aralık bitince, aralığın içinde başlamış sefer en çok 60 dakika daha sürer (trafik); o sürede o seferin
  işaretleri de konur, harita da aracı gösterir. Sonra sefer kapanır.
- **Sefer yalnız aralık içinde başlar** ve yalnız kendi aralığında başladıysa sürer. Saatler sonradan değişip başlamış sefer yeni
  aralığın dışında kalırsa sefer hemen kapanır (haritada görünmez, konum gönderimi "Servis saati bitti; sefer kapandı." alır).
  Saatler kaydedilince kapanması gereken seferler o anda kapatılır.
- **İşlem kaydı:** her değişiklik "Servis saatleri değişti" diye, yeni aralıklarla ("sabah 07:00–09:20 ve akşam 16:30–19:00") yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Yedek:** servis saatleri okulun kaydıdır, yedeğe girer.
- **Telefon uygulaması:** bildirim sorarken sunucudan saatleri de alır; Türkiye saatiyle aralığın 10 dakika öncesinden 60 dakika
  sonrasına kadar 1–3 dakikada bir, başka zamanlarda 15 dakikada bir sorar. Çocukları farklı okullarda olan velide saatlerin
  hepsini kapsayan en geniş aralık kullanılır. Saatler yalnız hesabın servisle ilgisi varsa gönderilir (servisçi, servisteki öğrenci ya
  da velisi) ve okul servisi kapattıysa o okul sayılmaz.
- **Kalkış saatleriyle karışmasın:** servisin "Sabah kalkış" / "Akşam kalkış" saatleri yalnız bilgidir, hiçbir şeyi açıp kapamaz.
- **Bölüm kapalıysa** kart da, saatler de kimseye görünmez ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Servisler sayfası](servisler-sayfasi.md) — kartın durduğu sayfa.
- [Yoklama sayfası](yoklama-sayfasi.md), [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md) — saat aralığının servisçiye etkisi.
- [Servisim ve servis kartı](servisim.md), [Canlı konum ve servis haritası](canli-konum-ve-harita.md) — veli ve öğrenciye etkisi.
- [Binmeyecek](binmeyecek.md) — pencerenin hangi günle açıldığı.

**İlgili:**

- [İşlem kaydı](../islem-kaydi/README.md) — "Servis saatleri değişti".
- [Telefon bildirimi](../bildirim/telefon-bildirimi.md) ve [Android uygulaması](../uygulama/android-uygulamasi.md) — servis
  saatlerinde sık bildirim yoklaması.
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md) — `servis.yonet`.

## Kod tarafı

- Saf hesap: [sunucu/yardimci/servis-pencere.md](../../sunucu/yardimci/servis-pencere.md) — `VARSAYILAN`, `saatlerSorunu`,
  `servisPenceresi(okul, simdi)` (dönem, uzatma, sonraki aralık), `seferSuruyorMu`, `saatZarfi`; Türkiye saati
  [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md).
- Uç: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/servis/saatler`, `servisTemizle`;
  `GET /api/servis` cevabındaki `saatler`. Depo: [sunucu/veri/depo/okullar.md](../../sunucu/veri/depo/okullar.md)
  (`servisSaatleriYaz`; sütunlar `servis_sabah_bas` … `servis_aksam_bit`, şema 028 —
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Telefon: [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) — `servisSaatleri` (bildirim ve ayar uçları).
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `servisSaatKarti`,
  `servis-saat-kaydet`, `servisAralikMetni`, `servisSonrakiMetni`; servisçide
  [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) (`syUstHtml`).
- Testler: [testler/test-servis-pencere.md](../../testler/test-servis-pencere.md) (sunucusuz),
  [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (bozuk, ters, kısa aralık; yetkisiz değiştiremez; işlem kaydı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Servis saatleri").

## Sık sorulanlar

- **Cumartesi servisimiz yok, yoklama açık kalır mı?** Aralıklar her gün geçerlidir; o gün servisçi işaretlemezse kimseye bildirim
  gitmez. Hafta sonu ayrımı bugün yok.
- **Akşam aralığını 15:30'a çektim; yoldaki sefer ne olur?** Kaydettiğin anda, yeni aralığın dışında başlamış sefer kapanır. Kendi
  aralığında başlamış sefer 60 dakikalık uzatmasıyla sürer.
- **Veli saat dışında neden aracı göremiyor?** Gizlilik ve kuralı gereği aracın yeri, sıra ve bugünkü durum yalnız servis saatlerinde
  (ve 60 dakikalık uzatmada) gelir; servis kartı her zaman görünür.
- **Saatler neden telefonumun saatinden farklı davranıyor?** Karar sunucunun Türkiye saatine göre verilir; telefonun saati yanlışsa
  yalnız "bugün / yarın" yazıları kayabilir.

## Sırada

- Linux kodlaması (Tasarım 1): velinin ve öğrencinin "Servis bilgisi" grubunda "Servis saatleri:" satırı.
- Optimizasyon + saklama süreleri: servis saatlerinde canlı harita ve yoklama yenilemesinin yükü ölçülecek.
- Android yerel uygulama: servisçi ekranları; seferi saatlere göre başlatan düğme.
- Çok dil: aralık ve "sıradaki" yazılarının çeviri kataloğuna girmesi.
