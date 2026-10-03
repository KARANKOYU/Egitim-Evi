# Çocuğumun telefonu · Telefondaki izinler ve durum

**Durum:** Kodda var

Telefon bağlandıktan sonra çocuğun telefonunda görünen ekran: paylaşımın çalışması için gereken izinler, son gönderimin
durumu ve arka planda çalışan gönderici.

## Ne işe yarar

Telefon bağlı olsa da izinler verilmeden konum ve ekran süresi gelmez. Bu ekran hangi iznin eksik olduğunu gösterir, her
eksik izin için ilgili ayara götüren bir düğme koyar ve telefonun en son ne zaman konum aldığını, ne zaman gönderdiğini,
bekleyen konum olup olmadığını söyler. Veli bir şey gelmiyorsa çocuğuyla birlikte önce bu ekrana bakar. Kullanıcının 26
Eylül sözleri: uygulama izinleri "başta" istesin, ayarlarda verilmemiş izin varsa "izinleri ver" düğmesi verilmeyenleri
yeniden istesin, "sıkıntı olmasın diye" konum için arka planda çalışma izni istesin.

## Nereden açılır

- Bağlama ekranının bağlıyken gösterdiği hâli ([Çocuğun telefonunu bağlama](telefonu-baglama.md#nereden-açılır)): yayımdaki
  "Eğitim Evi Aile"de uygulamayı açınca; hazırlanan "Eğitim Evi"de **Ayarlar → "Telefon" → "Bu telefonu velimle paylaş"**
  (bağlıyken alt yazısı "Bağlı: konum ve ekran süresi velinle paylaşılıyor").
- Paylaşım sürerken bildirim çubuğunda duran **"Eğitim Evi Aile"** bildirimine ("Konumun ve ekran süren velinle
  paylaşılıyor.") dokununca.

## Adım adım

### Öğrenci

Ekranda yukarıdan aşağı:

1. **"Bağlı hesap: Elif Yılmaz"** ve açıklama: "Konumun ve ekran süren velinle paylaşılıyor. Velin gönderme sıklığını seçer:
   Wi-Fi'deyken 5 dakikada bir, mobil veride 15 dakikada bir. İnternet yokken konumlar telefonda bekler, bağlanınca
   gönderilir." (sayılar velinin seçtiği aralıklardır, [Paylaşım ayarları](paylasim-ayarlari.md)).
2. **"İzinler"** başlığı altında satırlar. Verilmiş izin yeşil ve başında onay işaretiyle yazılır; verilmemiş olan "•
   … — kapalı" diye yazılır ve altında düğmesi vardır:
   - **"Konum"** — düğme **"Konum iznini ver"**. Bağlanır bağlanmaz telefon bu izni kendisi de sorar.
   - **"Konum: her zaman (uygulama kapalıyken de)"** (Android 10 ve sonrası) — Android 11 ve sonrasında düğme
     **"Ayarlar'da "Her zaman izin ver"i seç"**, Android 10'da **"Her zaman izin ver"**. Önce konum izni verilmemişse
     basınca "Önce konum iznini ver." yazar.
   - **"Ekran süresi (kullanım erişimi)"** — düğme **"Kullanım erişimini aç"**: telefonun "Kullanım erişimi" ayarı açılır,
     listede uygulamayı ("Eğitim Evi Aile" ya da hazırlanan sürümde "Eğitim Evi") bulup izin ver.
   - **"Bildirimler"** (Android 13 ve sonrası) — düğme **"Bildirim iznini ver"**.
   - **"Arka planda çalışma (pil kısıtlaması yok)"** — düğme **"Pil ayarını aç"**: uygulamanın ayar sayfası açılır; altında
     "Açılan sayfada Pil (Uygulama pil kullanımı) > Kısıtlamasız'ı seç." yazar.
3. **"Durum"** başlığı altında:
   - "Son konum: 3 Ekim 14:05" (henüz yoksa "Son konum: henüz yok") — telefonun en son konum aldığı an.
   - "Son gönderim: 3 Ekim 14:06" (ya da "henüz yok") — sunucuya en son başarıyla gönderdiği an.
   - "Gönderilmeyi bekleyen konum: 12" — yalnız bekleyen varsa (internet yokken birikenler).
   - "Son sorun: …" (kırmızı) — yalnız son gönderim bir hatayla bittiyse.
4. En altta **"Bu telefonun bağlantısını kaldır"** ([Bağlantıyı kaldırma](baglantiyi-kaldirma.md#öğrenci)).

İzin verip geri dönünce ekran kendini yeniden çizer; konum izni varsa arka plandaki gönderici başlar.

### Veli

- Kurulum kartının üçüncü adımı aynı izinleri sayar ([Çocuğun telefonunu bağlama](telefonu-baglama.md#veli)): "Konum — Her
  zaman izin ver", "Kullanım erişimi", "Bildirimler", "arka planda çalışma (uygulamanın pil ayarında Kısıtlamasız)".
- Sitede telefonun çalışıp çalışmadığını **"Bağlı telefon"** kartındaki "Son görülme: …" satırından anlarsın: telefon
  sunucuya her başvurduğunda bu zaman tazelenir; internete bağlı ve hizmet çalışırken bu en geç yarım saatte bir olur.
  Saatlerdir "son görülme" değişmiyorsa telefon kapalıdır, internete bağlı değildir ya da konum izni yoktur (hizmet konum
  izni olmadan başlamaz); çocuğunla bu ekrana bak.

## Kurallar ve sınırlar

- **Arka planda ne çalışır:** bağlıyken ve konum izni varken telefon bir ön plan hizmeti çalıştırır; Android bunun bildirim
  çubuğunda görünmesini şart koşar: başlık "Eğitim Evi Aile", metin "Konumun ve ekran süren velinle paylaşılıyor.", bildirim
  kanalı "Aile paylaşımı" ("Konum ve ekran süresi velinle paylaşılırken görünür."). Konum izni yoksa hizmet hiç başlamaz.
- **Dakikada bir tur:** hizmet her dakika şunlara bakar:
  - Konum: Wi-Fi'deyken (kablolu bağlantı da Wi-Fi sayılır) velinin Wi-Fi aralığıyla, mobil veride ve internet yokken
    mobil aralığıyla konum ister (GPS ve ağ konumu). Aralığın beşte dördü dolmadan gelen yeni konum atılır.
  - Ayar: internet varken 30 dakikada bir sunucudan velinin ayarını alır (bu yüzden yeni ayar "en geç yarım saatte"
    gelir).
  - Ekran süresi: "Ekran süresini paylaş" açıksa ve kullanım erişimi varsa 15 dakikada bir bugünün ve dünün sürelerini
    gönderir ([Ekran süresi](ekran-suresi.md)).
  - Bekleyen konumlar: internet varsa 500'erli parçalarla gönderilir (bir turda en çok 10 parça).
- **İnternet yokken:** konumlar telefonda birikir, en çok 5000 (fazlasında en eskiler atılır); 7 günden eski konum
  gönderilmez. İnternet gelince ilk turda gider.
- **Telefon açılınca ya da uygulama güncellenince** hizmet kendiliğinden yeniden başlar.
- **Bağlantı sunucudan kesilirse** (veli kaldırdı, dördüncü telefon en eskiyi düşürdü, öğrencinin hesabı kapandı) telefonun
  sonraki isteği reddedilir; uygulama anahtarı ve bekleyen konumları siler, hizmeti durdurur, ekran yeniden giriş formunu
  gösterir.
- **Pil izni:** doğrudan "pil kısıtlamasından muaf tut" penceresi Play Store kuralına takıldığı için kullanılmaz; uygulamanın
  ayar sayfası açılır, öğrenci elle "Kısıtlamasız"ı seçer.
- **Uygulamadan çıkış paylaşımı durdurmaz:** hazırlanan tek uygulamada hesabın oturumu ile Aile anahtarı ayrı tutulur;
  Ayarlar'daki "Çıkış yap" yalnız oturumu kapatır. Paylaşım ancak "Bu telefonun bağlantısını kaldır" ile (ya da velinin
  sitede kaldırmasıyla) durur.
- **Uygulamanın verisi yedeklenmez:** telefonun bulut yedeğine girmez, yeni telefona taşınmaz.
- **Bilinen sorunlar:**
  - Bağlanınca yalnız konum izni kendiliğinden sorulur; Kılavuz "uygulama sırayla ister" der, kullanıcı da izinlerin
    "başta" istenmesini söyledi, ama "her zaman" konum, kullanım erişimi, bildirim ve pil için satırlardaki düğmelere tek
    tek basmak gerekir; bütün eksikleri bir kerede isteyen tek bir "izinleri ver" düğmesi de yok.
  - "Önce konum iznini ver." her basışta ekranın sonuna yeni bir satır olarak eklenir, ekran yenilenene kadar birikir.
  - "Son sorun:" satırı hatayı olduğu gibi yazar; ağ hatalarında bu çoğu zaman İngilizce bir cümledir.
  - Durumdaki saatler telefonun saat dilimiyle yazılır (uygulamanın geri kalanı Türkiye saatiyle).
  - Ekran koyu temada da açık renklidir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Çocuğun telefonunu bağlama](telefonu-baglama.md) — bu ekrandan önceki adım.
- [Paylaşım ayarları](paylasim-ayarlari.md) — ekrandaki aralıkları belirleyen velinin seçimi.
- [Konum](konum.md), [Ekran süresi](ekran-suresi.md) — telefonun gönderdiklerinin velideki karşılığı.
- [Bağlantıyı kaldırma](baglantiyi-kaldirma.md), [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Android uygulaması](../uygulama/android-uygulamasi.md) — tek uygulamanın Ayarlar sayfası.
- [Telefon bildirimi ve bildirim izni](../bildirim/telefon-bildirimi.md) — aynı telefondaki öteki bildirim izni.

## Kod tarafı

- Android (ayrı depo `Egitim-Evi-App`, `app/src/main/java/org/egitimevi/aile/`):
  - `AileEkrani.java` — `bagliEkran()` (metinler, `izinSatiri`, "Durum"), `izinIste()` (yalnız konum),
    `onRequestPermissionsResult`, `onResume` (hizmeti başlatır).
  - `IzlemeServisi.java` — dakikalık `tur()`, `konumIsteginiAyarla()` (Wi-Fi / mobil aralığı), `onLocationChanged` (beşte
    dört kuralı, pil, ağ), `konumlariGonder()` (500'erli), `kullanimGonder()` (15 dakika), `ayarlariTazele()` (30 dakika),
    `baglantiKoptuMu()` (401/403'te durur), `bildirim()` (kanal ve metin).
  - `Kuyruk.java` (5000 konum, 7 gün), `Kullanim.java` (kullanım erişimi), `Ayarlar.java` (aralıklar, son konum, son
    gönderim, son sorun), `BaslatmaAlici.java` (açılışta ve güncellemede yeniden başlatma), `AyarlarSayfasi.java` (satır ve alt
    yazısı); manifestte `allowBackup="false"`.
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `cihazUclari` (her istekte "son görülme" yazılır;
  `GET /api/aile/cihaz/ayar`).
- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `aileCihazKarti` ("Son görülme").
- Android deposunda otomatik test yok; sunucu sözleşmesini [testler/test-aile.md](../../testler/test-aile.md) korur.

## Sık sorulanlar

- **Bildirim çubuğundaki "Eğitim Evi Aile" bildirimini kapatabilir miyim?** Paylaşım sürdükçe Android onu gösterir; kapatmak
  için bağlantıyı kaldırman gerekir.
- **Pil çabuk bitiyor.** Velin konum aralığını uzatabilir (özellikle mobil veride); 1 dakikalık konum pili en çok yoran
  seçimdir ([Paylaşım ayarları](paylasim-ayarlari.md)).
- **"Gönderilmeyi bekleyen konum" sayısı düşmüyor.** Telefon internete bağlı değil; bağlanınca ilk dakikada gider.
- **Telefonu yeniden başlattım, paylaşım sürüyor mu?** Evet; hizmet telefon açılınca kendiliğinden başlar.

## Sırada

- Android yerel uygulama (iş 10): bu ekran uygulamanın yeni arayüz takımına ve koyu temaya alınacak; izinlerin sırayla
  istenmesi ve "Son sorun" iletilerinin Türkçeleşmesi o işte ele alınmalı.
- Uygulamanın kendini güncellemesi (iş 10 içinde): güncellemeden sonra hizmet bugünkü gibi kendiliğinden başlar.
