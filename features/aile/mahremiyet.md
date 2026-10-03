# Çocuğumun telefonu · Kim görür, ne kadar saklanır

**Durum:** Kodda var

Eğitim Evi Aile'nin hangi veriyi topladığı, kimin gördüğü, kimin göremediği, ne kadar sakladığı ve bunların aydınlatma
metninde nasıl yazıldığı.

## Ne işe yarar

Konum ve uygulama kullanımı çocuğun kişisel verisidir. Bu yüzden özellik baştan dar kurallarla yapıldı: paylaşımı çocuk
kendi açık onayıyla başlatır, veriyi yalnız velisi görür, okul görmez ve veriler bir hafta sonra silinir. Kullanıcının 26
Eylül sözü: "veriler 1 hafta sonra silinecek; salı günüyse önceki salının arkası gözükmeyecek".

## Nereden açılır

- Sayfanın başlığı her açılışta söyler: "… Yalnızca sen ve öteki velisi görür; okul görmez. Veriler 7 gün sonra silinir."
  ([Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)).
- Telefondaki bağlama ekranı: "Velin bunları Eğitim Evi'nde görür; okulun görmez. Veriler 7 gün sonra silinir. Hiçbir
  uygulama kapatılmaz ya da kilitlenmez." ([Çocuğun telefonunu bağlama](telefonu-baglama.md)).
- Aydınlatma metni `/kvkk/kvkk.html` ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)), kullanım koşulları
  `/kosullar/kosullar.html` ([Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md)), açılış sayfasının
  [Sık sorulan sorular](../acilis-sayfasi/sss.md)'ı, indir sayfasının "Uygulama ne yapar?" bölümü.

## Adım adım

### Veli

- **Gördüklerin:** haritada son 12 konum (sunucu son 30'unu gönderir, sayfa 12'sini çizer), son konumun doğruluğu,
  bağlantı türü ve pili; bugünün uygulama uygulama ekran süresi ve son 8 günün günlük toplamı (sınır koyarken son 8 günün
  uygulama toplamları da listede çıkar); bağlı telefonların adı, son görülmesi ve bağlanma günü.
- **Öbür velisi de aynısını görür:** çocuğa veli koduyla ya da okulun bağlamasıyla bağlı her veli. Ayarlar ve sınırlar da
  ortaktır; birinin değiştirdiğini öbürü görür.
- **Çocuğu hesabından kaldırırsan** ([Çocuklarım](../portallar/cocuklarim.md)) Aile verisini artık göremezsin; telefonun
  bağlantısı ise sürer, öbür velisi görmeye devam eder.
- **Yeni bağlanan veli** o ana kadar tutulan veriyi (en çok son 7 gün) görür.

### Öğrenci

- Paylaşımı **sen** başlatırsın: kendi hesabınla girip "Konumumun ve ekran süremin velimle paylaşılacağını okudum, kabul
  ediyorum." kutusunu işaretlemeden telefon bağlanmaz.
- Telefonun şunları gönderir: konum (enlem, boylam, doğruluk, an, bağlantı türü, pil yüzdesi) ve her gün hangi uygulamanın
  ön planda kaç dakika açık kaldığı (uygulamanın adı ve paket adı). Mesajların, fotoğrafların, uygulamaların içi, gezdiğin
  siteler gönderilmez.
- Kendi verine siteden bakamazsın; telefonunda yalnız durumu (son konum ve son gönderim zamanı) görürsün
  ([Telefondaki izinler ve durum](izinler-ve-durum.md)).
- İstediğin an "Bu telefonun bağlantısını kaldır"la bitirebilirsin; velilerine bildirim gider
  ([Bağlantıyı kaldırma](baglantiyi-kaldirma.md)).

### Öğretmen, müdür ve çalışan

Okul bu verileri **görmez**: müdür, öğretmen ya da ek görevli çalışan özet ve ayar isteğinde sunucudan 403 "Bu öğrencinin
velisi değilsin" alır; okulun hiçbir ekranında, raporunda ya da Excel dışarı aktarımında Aile verisi yoktur. Okul bu bölümü
Özellikler'den kapatamaz da açamaz da: özellik okula değil, veli ile çocuğa aittir. Kendi çocuğunun velisi olan öğretmen,
yalnız veli portalında ve yalnız kendi çocuğununkini görür.

### Yönetici

- Sistem yöneticisinin de bu verileri gösteren bir ekranı yoktur.
- **Site yedeği:** Aile tabloları (telefonlar, konumlar, kullanım, ayarlar, sınırlar, sınır uyarıları) yedeğe ve dışarı
  aktarıma girmez. Bir yedek **geri yüklenince** bu tablolar boşaltılır: bütün telefonların bağlantısı düşer, velilerin
  sıklık ayarları ve sınırları ilk hâline döner (Wi-Fi 5, mobil 15 dakika, sınır yok); çocukların telefonlarını yeniden
  bağlaması gerekir ([Site yedekleri](../yonetim/yedekler.md)).

### Ziyaretçi

Açılış sayfasındaki SSS'te: "Çocuğumun telefonunun konumunu ve ekran süresini görebilir miyim?" sorusunun cevabı: "Evet,
isteğe bağlı Android uygulamasıyla. Uygulama çocuğun telefonuna kurulur, çocuk kendi öğrenci hesabıyla ve onayıyla bağlar.
Veli sitede Çocuğumun telefonu sayfasında son konumu ve uygulama ekran süresini görür, gönderme sıklığını ve günlük sınırları
seçer; sınır geçilince bildirim gelir. Hiçbir uygulama kapatılmaz. Okul bu bilgileri görmez; 7 gün sonra silinir."

## Kurallar ve sınırlar

- **Saklama süreleri:**
  - Konumlar: 7 gün (zamanı 7 günden eski olan saatte bir silinir).
  - Ekran süreleri ve günlük sınır uyarısı kayıtları: bugün ve önceki 7 gün kalır, daha eskisi saatte bir silinir.
  - Telefon kaydı (adı, Android sürümü, bağlanma zamanı, son görülme): bağlantı sürdükçe.
  - Velinin ayarları ve sınırları: öğrencinin hesabı durdukça (kimin son değiştirdiği de tutulur, sayfada gösterilmez).
  - Öğrencinin hesabı silinince bütün Aile verisi hesapla birlikte silinir.
  - Aile bildirimleri öteki bildirimler gibi bildirimler arasında durur; 7 günlük silme onlara dokunmaz.
- **Yedek:** Aile verisi yedeğe ve dışarı aktarıma girmez, geri yüklemede boşaltılır (yukarıda "Yönetici").
- **Anahtar:** telefona verilen anahtar hesaba giriş vermez; sunucuda yalnız özeti (SHA-256) durur; uygulamanın öbür
  anahtarlı işlerinde de geçmez.
- **Telefonun verisi:** telefondaki ayar dosyası buluta yedeklenmez, yeni telefona taşınmaz.
- **Dışarı giden:** harita resimleri OpenStreetMap'ten iner (bakılan bölge ve IP adresi OpenStreetMap'e gider); konum
  Google'a yalnız veli "Google Haritalar'da aç"a basarsa gider. Veriler reklam, analiz ya da satış için kimseye verilmez.
- **Aydınlatma metni** (sürüm 1.9'da eklendi; bugün 1.16) iki satır taşır: "Eğitim Evi Aile: telefonun konumu" ("İsteğe
  bağlı. Yalnızca öğrencinin telefonuna Eğitim Evi Aile uygulaması kurulup öğrenci kendi hesabıyla ve açık onayıyla
  bağladıysa. Velinin seçtiği aralıkla (Wi-Fi'de ve mobil veride ayrı) konum, konumun doğruluğu, bağlantı türü ve pil düzeyi
  gönderilir. Yalnızca öğrenciye bağlı veliler görür; okul (müdür, öğretmen) görmez. 7 gün sonra silinir.") ve "Eğitim Evi
  Aile: uygulama kullanım süreleri"; saklama bölümünde: "Eğitim Evi Aile uygulamasından gelen konumlar ve uygulama kullanım
  süreleri 7 gün sonra silinir; yedeğe alınmaz."
- **Kullanım koşulları:** "İsteğe bağlı Eğitim Evi Aile uygulaması telefonun konumunu ve uygulama kullanım sürelerini
  yalnızca bağlı velilere gösterir. Konumun doğruluğu telefona ve bağlantıya bağlıdır; acil durumlarda buna güvenilmemeli,
  resmî yardım hatları aranmalıdır."
- **Yeni alan kuralı:** bu özelliğe kişisel veri gösteren ya da toplayan yeni bir şey eklenirse aynı işte aydınlatma metni
  güncellenir ve sürümü artırılır (herkes yeniden onaylar; [Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)).
- **Dikkat (kodda):** telefonun Aile anahtarı, öğrencinin aydınlatma metninin yeni sürümünü onaylamasını beklemez: metin
  güncellenip öğrenci henüz onaylamamışken de bağlı telefon konum ve süre göndermeyi sürdürür (sunucu yalnız hesabın öğrenci
  ve onaylı olduğuna bakar). Telefon uygulamasının öbür anahtarı (bildirim yoklama) bu durumda silinir. Veli ise sayfayı
  ancak kendi onayını yeniledikten sonra açabilir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Çocuğun telefonunu bağlama](telefonu-baglama.md) — açık onay.
- [Bağlantıyı kaldırma](baglantiyi-kaldirma.md) — paylaşımı bitirmek ve kendiliğinden düşen bağlantılar.
- [Konum](konum.md), [Ekran süresi](ekran-suresi.md) — toplanan veri.
- [Paylaşım ayarları](paylasim-ayarlari.md) — konumu ya da süreyi kapatmak.
- [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md), [Telefondaki izinler ve durum](izinler-ve-durum.md),
  [Aile bildirimleri](bildirimler.md), [Süre sınırı](sure-siniri.md).

**İlgili:**

- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md),
  [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md).
- [Veli kodu](../hesaplar/veli-kodu.md), [Veli bağlama](../hesaplar/veli-baglama.md) — veriyi kimin göreceğini belirleyen bağ.
- [Site yedekleri](../yonetim/yedekler.md), [Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `bagliMi` denetimi ("Bu öğrencinin velisi değilsin"),
  `onay: true`, anahtarın yalnız özeti, `cihazUclari` (öğrenci ve onaylı mı; aydınlatma onayına bakılmaz);
  [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `SAKLAMA_GUN` (7), `temizle` (konum 7 gün, kullanım ve
  uyarılar 7 günden eski gün); [sunucu/index.md](../../sunucu/index.md) — temizliğin saatte bir çalışması;
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) — Aile tablolarının yedeğe girmemesi ve geri yüklemede
  boşaltılması; [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) — öbür anahtarın aydınlatma denetimi;
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `KVKK_SURUM` (1.9: Eğitim Evi Aile).
- Tablolar: `aile_cihazlari`, `aile_konumlari`, `aile_kullanim`, `aile_ayarlari`, `aile_sinirlari`, `aile_uyarilari` (hepsi
  öğrenci silinince `ON DELETE CASCADE`; şema 026, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Metinler: `public/kvkk/kvkk.html` ([public/kvkk/KLASOR.md](../../public/kvkk/KLASOR.md)), `public/kosullar/kosullar.html`
  ([public/kosullar/KLASOR.md](../../public/kosullar/KLASOR.md)), açılış sayfasının SSS'i `public/index.html`
  ([public/KLASOR.md](../../public/KLASOR.md)).
- Android: manifestte `allowBackup="false"` (telefon verisi buluta yedeklenmez).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — bağlı olmayan veli, müdür, öğretmen ve öğrencinin özete 403
  alması, anahtarın oturum yerine geçmemesi.

## Sık sorulanlar

- **Okul çocuğumun konumunu görebilir mi?** Hayır; müdür ve öğretmen dahil okulun hiçbir hesabı görmez.
- **Veriler nerede tutuluyor?** Eğitim Evi'nin sunucusunda; her okulun verisi ayrıdır. Aile verisi yedeklere de girmez.
- **Bir hafta önceki konumu görebilir miyim?** Hayır; 7 günden eski konum silinir. Ekran süresinde bugün ve önceki 7 gün
  görünür.
- **Çocuğum paylaşımı istemiyorsa?** Paylaşım isteğe bağlıdır; çocuk onay vermeden bağlanmaz, istediği an kaldırabilir.

## Sırada

- KVKK ve onay metinleri tam denetimi (iş 18): sayfadaki "okul görmez", "7 gün sonra silinir" sözleri ve harita/Google
  aktarımları aydınlatma metniyle karşılaştırılacak; Aile anahtarının aydınlatma onayını beklememesi bu işte ya da güvenlik
  denetiminde ele alınmalı.
- Optimizasyon + saklama süreleri (iş 7): saklama tablosunda Aile verisinin 7 günü.
- Güvenlik denetimi (iş 3): "aile 3 cihaz sınırı sessiz".
