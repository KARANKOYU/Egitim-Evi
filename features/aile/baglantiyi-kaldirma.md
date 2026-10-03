# Çocuğumun telefonu · Bağlantıyı kaldırma

**Durum:** Kodda var

Bir telefonun Eğitim Evi Aile bağlantısını bitirmek: veli sitede, öğrenci telefonunda kaldırır; bazı durumlarda bağlantı
kendiliğinden düşer. Kaldırılan telefonun anahtarı hemen geçersiz olur ve telefon göndermeyi bırakır.

## Ne işe yarar

Telefon değişti, kayboldu ya da paylaşımı bitirmek istiyorsunuz: bağlantıyı kaldırınca o telefondan konum ve süre gelmez.
Paylaşım iki tarafın da elindedir: çocuk kendi onayıyla bağlar, istediğinde kendisi de kaldırır; veli de kaldırabilir.

## Nereden açılır

- **Veli (sitede):** [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)'ndaki **"Bağlı telefon"** kartında, her
  telefonun satırındaki **"Bağlantıyı kaldır"**.
- **Öğrenci (telefonda):** bağlıyken açılan ekranın en altındaki **"Bu telefonun bağlantısını kaldır"**
  ([Telefondaki izinler ve durum](izinler-ve-durum.md#nereden-açılır)).
- **Kendiliğinden:** dördüncü telefon bağlanınca, öğrencinin hesabı kapanınca, site yedeği geri yüklenince (aşağıda).

Tasarımda (Tasarım 1 önizlemesi): önizlemede "Bağlı telefon" kartı ve "Bağlantıyı kaldır" düğmesi görünmez. Kullanıcı bunu
kaldırmayı istemedi; kodlanırken telefon bölümünde yerinde kalır.

## Adım adım

### Veli

1. "Çocuğumun telefonu"nu aç; "Bağlı telefon" kartında kaldırmak istediğin telefonu bul (adı, "Son görülme: …",
   "bağlandı …" tarihi).
2. **"Bağlantıyı kaldır"**a bas. Onay penceresi: **"Bu telefonun bağlantısı kaldırılsın mı? Uygulama konum ve süre
   göndermeyi bırakır."**
3. **Tamam** dersen telefonun kaydı silinir, sayfa yeniden açılır. Başka telefon kalmadıysa kurulum kartı geri gelir.
   **İptal** dersen hiçbir şey olmaz.
4. Çocuğun telefonu sunucuya bir sonraki başvurusunda (internete bağlıysa en geç yarım saat içinde, değilse internet
   gelince) reddedilir: uygulama anahtarını ve bekleyen konumları siler, göndermeyi durdurur, ekranı yeniden giriş formuna
   döner.

Bu yolda kimseye bildirim gitmez: çocuğa da öbür veliye de haber verilmez.

### Öğrenci

1. Telefonundaki bağlı ekranı aç ([Telefondaki izinler ve durum](izinler-ve-durum.md)).
2. En alttaki **"Bu telefonun bağlantısını kaldır"**a bas. Onay sorulmaz.
3. Telefon sunucuya "bağlantıyı kaldır" der; ardından gönderimi durdurur, bekleyen konumları ve anahtarı siler, ekran giriş
   formuna döner.
4. Velilerine bildirim gider: **"Elif Yılmaz telefonunun (samsung SM-A515F) Eğitim Evi Aile bağlantısını kaldırdı."**
   ([Aile bildirimleri](bildirimler.md)).

Yeniden paylaşmak istersen bağlama adımlarını baştan yaparsın ([Çocuğun telefonunu bağlama](telefonu-baglama.md#öğrenci)).

## Kurallar ve sınırlar

- **Kendiliğinden düşme:**
  - **Dördüncü telefon:** öğrenci başına en çok 3 telefon; dördüncüsü bağlanınca en eskisinin kaydı uyarısız silinir.
  - **Hesap kapanınca:** öğrencinin hesabı onaylı değilse (onayı kalkmışsa) ya da öğrenci hesabı olmaktan çıkmışsa
    telefonun ilk isteğinde kayıt silinir; telefon "Hesap artık kullanılamıyor." iletisini alır ve durur. Hesap tümden
    silinince telefon kaydı ve bütün Aile verisi hesapla birlikte hemen silinir; telefon o zaman "Cihaz tanınmadı.
    Uygulamadan yeniden bağlan." alır ve yine durur.
  - **Site yedeği geri yüklenince:** Aile tabloları yedeğe girmez ve geri yüklemede boşaltılır; bütün telefonların
    bağlantısı düşer, çocuklar yeniden bağlamalıdır ([Kim görür](mahremiyet.md#yönetici)).
- **Reddedilen telefon ne görür:** bilinmeyen anahtara sunucu "Cihaz tanınmadı. Uygulamadan yeniden bağlan." der; telefon
  bu tür bir red (401 ya da 403) alınca bağlantının bittiğini anlar ve kendini temizler. "Çok sık istek geldi. Biraz sonra
  dene." (saatte 240 istekten fazlası) bağlantıyı bitirmez.
- **Veri silinmez:** bağlantıyı kaldırmak o ana kadar gelen konumları ve süreleri silmez (7 gün durur, sayfada görünmeye
  devam eder); velinin ayarları ve sınırları da kalır, yeniden bağlanınca aynen geçerlidir.
- **Başkasının telefonu:** veli yalnız kendi çocuğunun telefonunu kaldırabilir; başka bir çocuğun telefonu için sunucu "Bu
  öğrencinin velisi değilsin", o çocuğa ait olmayan telefon için "Cihaz bulunamadı" der.
- **Uygulamadan "Çıkış yap" kaldırmaz:** hazırlanan tek uygulamada hesabın oturumu ile Aile anahtarı ayrıdır; çıkış
  paylaşımı durdurmaz.
- **Bilinen sorunlar:**
  - Öğrenci internet yokken "Bu telefonun bağlantısını kaldır"a basarsa telefon her şeyi siler ama sunucudaki kayıt kalır:
    telefon velinin sayfasında görünmeye devam eder (veli kaldırana ya da üç telefon sınırında düşene kadar), velilere
    bildirim de gitmez.
  - Dördüncü telefonla en eskinin düşmesi sessizdir; ne sayfada ne bildirimde söylenir.
  - "bağlandı …" tarihi UTC gününe göre yazılır: Türkiye saatiyle 00:00–02:59 arasında bağlanan telefon bir gün önce
    bağlanmış görünür.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Çocuğun telefonunu bağlama](telefonu-baglama.md) — yeniden bağlamak.
- [Telefondaki izinler ve durum](izinler-ve-durum.md) — öğrencinin düğmesinin bulunduğu ekran.
- [Aile bildirimleri](bildirimler.md) — "bağlantısını kaldırdı" bildirimi.
- [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md) — "Bağlı telefon" kartı.
- [Paylaşım ayarları](paylasim-ayarlari.md) — bağlantıyı kaldırmadan konumu ya da süreyi kapatmak.
- [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Çocuklarım](../portallar/cocuklarim.md) — çocuğu hesabından kaldırınca Aile verisini de artık göremezsin (telefonun
  bağlantısı ise sürer, öbür veli görmeye devam eder).
- [Site yedekleri](../yonetim/yedekler.md) — geri yüklemenin Aile bağlantılarına etkisi.

## Kod tarafı

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `aileCihazKarti(d)` ("Bağlantıyı
  kaldır", `data-act="aile-cihaz-kaldir"`), eylem `aile-cihaz-kaldir` (onay metni, `POST /api/aile/cihaz-kaldir`,
  `hataGoster`).
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `POST /api/aile/cihaz-kaldir` (veli; bildirim yok,
  "Telefonun bağlantısı kaldırıldı."), `POST /api/aile/cihaz/sil` (telefon; velilere bildirim, "Bağlantı kaldırıldı."),
  `cihazUclari` (401 "Cihaz tanınmadı. Uygulamadan yeniden bağlan.", "Hesap artık kullanılamıyor.");
  [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `cihazSil`, `cihazEkle` (3 sınırı);
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) — geri yüklemede boşaltılan Aile tabloları.
- Tablo: `aile_cihazlari` (öğrenci silinince `ON DELETE CASCADE`; şema 026, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Android: `AileEkrani.java` ("Bu telefonun bağlantısını kaldır": `/api/aile/cihaz/sil`, sonra `IzlemeServisi.durdur`,
  `Kuyruk.temizle`, `Ayarlar.cik`), `IzlemeServisi.java` (`baglantiKoptuMu`: 401/403'te temizlenip durur).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — başka velinin kaldıramaması, veli ve telefon tarafından
  kaldırma, kaldırılan anahtarın 401 alması.

## Sık sorulanlar

- **Çocuğumun telefonu kayboldu, ne yapayım?** Sayfadan o telefonun bağlantısını kaldır; telefon internete bağlanınca
  göndermeyi bırakır. Kayıp telefonu bulmak için son konuma bakabilirsin ([Konum](konum.md)).
- **Bağlantıyı kaldırınca geçmiş konumlar silinir mi?** Hayır; 7 gün sonra kendiliğinden silinir.
- **Çocuğum bağlantıyı kaldırırsa haberim olur mu?** Telefonundan kaldırırsa evet, bildirim gelir (telefon o an internete
  bağlıysa).
- **Yeni telefon aldı, eskisini kaldırmam gerekir mi?** Gerekmez ama iyi olur; kaldırmazsan yeni telefon da bağlanır, eski
  telefon listede kalır (üç telefon sınırına kadar).

## Sırada

- Güvenlik denetimi (iş 3): dördüncü telefonda en eskinin uyarısız düşmesi; sayfada uyarı gerekebilir.
- Android yerel uygulama (iş 10): telefondaki kaldırma düğmesine onay sorusu ve sunucu cevabına bakılması bu işte ele
  alınmalı.
