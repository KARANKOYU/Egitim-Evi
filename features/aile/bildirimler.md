# Çocuğumun telefonu · Aile bildirimleri

**Durum:** Kodda var; tasarımda ek olarak bildirimin başında çocuğun kısa adı ("Can · …") ve sınır bildiriminin alt
satırında "uygulama kapatılmaz".

Eğitim Evi Aile'nin velilere gönderdiği dört bildirim: telefon bağlandı, telefon bağlantısını kendisi kaldırdı, günlük
toplam sınır geçildi, bir uygulamanın sınırı geçildi.

## Ne işe yarar

Paylaşımda olan her önemli değişiklikten haberin olur: çocuğun telefonunu bağladığında ya da kendi telefonundan bağlantıyı
kaldırdığında ve koyduğun bir süre sınırı geçildiğinde. Kullanıcının 26 Eylül isteği: birden çok çocuk karışmasın, "velide
başında hangi çocuğu olduğu yazsın"; bugünkü metinler çocuğun tam adıyla başlar.

## Nereden açılır

- Sağ üstteki zil: [Bildirim paneli](../bildirim/bildirim-paneli.md). Telefon bildirimlerini açtıysan telefonuna da düşer
  ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- Her Aile bildirimi `#/aile?c=<çocuğun kimliği>` adresine götürür: basınca
  [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md) o çocukla açılır.

## Adım adım

### Veli

Gelebilecek bildirimler (örnek ad "Elif Yılmaz", örnek telefon "samsung SM-A515F"):

1. **Telefon bağlandı** — çocuk telefonunu kendi hesabıyla bağlayınca
   ([Çocuğun telefonunu bağlama](telefonu-baglama.md)):
   "Elif Yılmaz telefonunu (samsung SM-A515F) Eğitim Evi Aile'ye bağladı. Konum ve ekran süresi Aile sayfasında."
2. **Bağlantı telefondan kaldırıldı** — çocuk telefonundaki "Bu telefonun bağlantısını kaldır"a basınca
   ([Bağlantıyı kaldırma](baglantiyi-kaldirma.md)):
   "Elif Yılmaz telefonunun (samsung SM-A515F) Eğitim Evi Aile bağlantısını kaldırdı."
3. **Günlük toplam sınır geçildi** ([Süre sınırı](sure-siniri.md)):
   "Elif Yılmaz bugün telefonda toplam 2 sa 40 dk geçirdi (sınır 2 sa)."
4. **Uygulama sınırı geçildi**:
   "Elif Yılmaz bugün YouTube uygulamasında 1 sa 20 dk geçirdi (sınır 1 sa)."

Bildirime bas; sayfa o çocukla açılır. Birden çok çocuğun varsa şeritte o çocuk seçili gelir.

Tasarımda (Tasarım 1 önizlemesi): her çocuk ayrı oturum olduğu için bildirim o çocuğun oturumunun zilinde durur ve çocuğun
kısa adıyla başlar. Sınır bildirimi iki satırdır:

- üst satır: "Can · YouTube günlük sınırı (1 sa) geçti"
- alt satır: "dün 1 sa 20 dk kullandı · uygulama kapatılmaz"

Basınca o çocuğun telefon sayfası açılır. Önizlemede bağlama ve kaldırma bildirimi örneği yok; onlar da aynı kuralla
çocuğun adıyla başlar.

### Öğrenci

Bu bildirimler sana gelmez; yalnız velilerine gider. Telefonunun bildirim çubuğunda sürekli duran "Eğitim Evi Aile —
Konumun ve ekran süren velinle paylaşılıyor." bu dört bildirimden biri değildir: Android'in arka planda konum alan
uygulamadan istediği, paylaşımın sürdüğünü gösteren kalıcı bildirimdir ([Telefondaki izinler ve durum](izinler-ve-durum.md)).

## Kurallar ve sınırlar

- **Kime gider:** çocuğa bağlı ve hesabı onaylı bütün velilere (anne ve baba ayrı ayrı alır). Okula (müdür, öğretmen)
  gitmez.
- **Sınır bildirimi günde bir kez:** toplam sınır için bir, her uygulama için bir; gün Türkiye saatine göre. Sınır bugün bir
  kez geçildiyse o gün aynı sınır için yeni bildirim gelmez.
- **Ne zaman gider:** sınır bildirimi telefon süreleri gönderdiğinde (15 dakikada bir) denetlenir; telefon internete
  bağlanmadıysa gecikir. Bağlama bildirimi bağlandığı anda, kaldırma bildirimi telefon sunucuya ulaştığı anda gider.
- **Bildirim gitmeyen durumlar:** velinin sitede "Bağlantıyı kaldır"ı; dördüncü telefonun en eskisini düşürmesi; öğrencinin
  hesabı kapanınca bağlantının silinmesi; öğrencinin internet yokken bağlantıyı kaldırması.
- **Metin:** sunucunun yazdığı düz metin, en çok 300 harf. Uygulama adı çocuğun telefonundan gelir (denetim karakterleri
  atılmış, 100 harf).
- **Saklama:** bildirimler öteki bildirimler gibi bildirimler tablosunda durur ([Bildirim paneli](../bildirim/bildirim-paneli.md));
  Aile verisinin 7 günlük silinmesi bildirimleri silmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Süre sınırı ve aşım bildirimi](sure-siniri.md) — 3. ve 4. bildirimin kaynağı.
- [Çocuğun telefonunu bağlama](telefonu-baglama.md), [Bağlantıyı kaldırma](baglantiyi-kaldirma.md) — 1. ve 2. bildirim.
- [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md) — bildirimin açtığı sayfa.
- [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Bildirim paneli](../bildirim/bildirim-paneli.md), [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md),
  [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `velilerineBildir(ogrenci, metin)` (`#/aile?c=` bağlantısı),
  bağlama (`POST /api/aile/cihaz`), telefonun kaldırması (`POST /api/aile/cihaz/sil`), `sinirlariDenetle` ve `sureYaz`;
  [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `uyariIlkMi` (günde bir kez);
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `veliHaritasi` (onaylı veliler).
- Ön yüz: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) — bildirime
  basınca adresteki çocuğun seçilmesi; [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) —
  `veliSeciliCocuk` (`S.adresCocuk`).
- Tablo: `aile_uyarilari` (öğrenci + gün + anahtar; anahtar `'toplam'` ya da paket adı; şema 026,
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — bağlama bildirimi, toplam ve uygulama sınırı bildirimi, günde bir
  kez, bildirimin Aile sayfasına götürmesi.
- Tasarım: Tasarım 1 önizlemesi, öğrenci-veli paketi (Can'ın oturumundaki sınır bildirimi örneği).

## Sık sorulanlar

- **Sınır bildirimi geç geldi.** Telefon süreleri 15 dakikada bir gönderir; internet yoksa bağlanınca gönderir.
- **Bildirim gelmedi ama sınır geçilmiş görünüyor.** O gün aynı sınır için daha önce bildirim gitmiştir (günde bir kez) ya
  da bildirim telefonuna değil yalnız zile düşmüştür (telefon bildirimini aç).
- **Öbür veli de aynı bildirimi alıyor mu?** Evet, çocuğa bağlı her veli ayrı ayrı alır.

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı): bildirim çocuğun oturumuna düşer, başında kısa adı.
- Mesaj ayarları ve bildirim paneli sekmeleri (iş 8): bildirim panelinin sekmelere ayrılması Aile bildirimlerinin yerini
  de belirleyecek.
- Çok dil (iş 22): bildirim metinleri.
