# Çocuğumun telefonu · Çocuğumun telefonu sayfası

**Durum:** Kodda var; tasarımda ek olarak her çocuk ayrı oturum (menüde ve başlıkta "Elif'in telefonu", çocuk şeridi yok),
velinin ana sayfasında telefon kutucuğu ve yeni sayfa düzeni (telefon kartı, gün seçilen ekran süresi, sınır türü seçimi).

Velinin, çocuğunun telefonundan gelen konumu, ekran süresini ve bunların ayarlarını tek sayfada gördüğü yer.

## Ne işe yarar

Çocuğunun telefonu Eğitim Evi'ne bağlıysa ([nasıl bağlanır](telefonu-baglama.md)) son konumunu, bugün ve son günlerde
telefonda ne kadar vakit geçirdiğini ve hangi uygulamada geçirdiğini burada görürsün; telefonun konumu ne sıklıkla
göndereceğini ve süre sınırlarını da buradan seçersin. Telefon bağlı değilse sayfa sana nasıl bağlayacağını anlatır.

## Nereden açılır

- **Menü:** sol menüde (telefonda ☰ ile açılan panelde) **"Çocuğumun telefonu"**. Veli menüsündeki sırası: Ana Sayfa,
  Mesajlar, Anketler, Takvim, Hatırlatıcılar, Ödevler, Devamsızlık, İlerleyiş, Etütler, Yemek Listesi, Servis,
  **Çocuğumun telefonu**; listenin en altında, bir ayraçtan sonra Çocuklarım.
- **Adres:** `#/aile`. Bildirimden gelirsen `#/aile?c=<çocuğun kimliği>`: sayfa o çocukla açılır
  ([Aile bildirimleri](bildirimler.md)).
- Yalnız rolü veli olan portalın menüsünde var. Öğretmen ya da müdür hesabında, eski düzende eklenen "Velisi olduğum"
  bölümünde (Çocuklarım, Ödevleri, Devamsızlığı, İlerleyişi; servis yönetme yetkisi olmayan öğretmende bir de Servisi) bu
  sayfa YOK.

Tasarımda (Tasarım 1 önizlemesi, kullanıcının 3 Ekim kararı "velide her çocuk ayrı oturum"): her çocuk ayrı bir veli
oturumudur ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)); menü satırı ve sayfa başlığı o çocuğun
adıyla **"Elif'in telefonu"**, **"Can'ın telefonu"** olur (Türkçe ekiyle), alt yazı "Eğitim Evi Aile kurulu telefon".
Velinin ana sayfasındaki renkli kutucuklar arasında da camgöbeği bir **"Elif'in telefonu"** kutucuğu vardır, altında kısa
durum ("son konum 1 saat önce", "okulda"); dokununca bu sayfa açılır ([Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md),
[Renkli kutucuklar](../ana-sayfa/kutucuklar.md)).

## Adım adım

### Veli

1. Menüden **"Çocuğumun telefonu"**na bas.
2. Hiç çocuğun yoksa sayfada "Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla ekleyebilirsin." yazar;
   [Çocuklarım](../portallar/cocuklarim.md)'dan çocuğunu ekle.
3. Sayfanın başında büyük harfle **"ÇOCUĞUMUN TELEFONU"**, altında "Elif Yılmaz · konum ve ekran süresi. Yalnızca sen ve
   öteki velisi görür; okul görmez. Veriler 7 gün sonra silinir." yazar (gün sayısı sunucudan gelir).
4. Birden çok çocuğun varsa başlığın altındaki şeritte her çocuk tam adıyla bir düğmedir; bakmak istediğine bas. Bu sayfada
   **"Hepsi" yoktur**: her zaman tek çocuk gösterilir. Hiçbirini seçmediysen ilk çocuk açılır.
5. Sonra kartlar şu sırayla gelir:
   - Telefon bağlı değilse **kurulum kartı**: "Elif'in telefonu henüz bağlı değil" ve üç adım
     ([Çocuğun telefonunu bağlama](telefonu-baglama.md#veli)).
   - Telefon bağlıysa **"Bağlı telefon"** kartı: her telefon için telefon simgesi, adı (ör. "samsung SM-A515F", ad yoksa
     "Telefon"), "Son görülme: 3 dakika önce · bağlandı 1 Ekim 2026, Perşembe" ve **"Bağlantıyı kaldır"**
     ([Bağlantıyı kaldırma](baglantiyi-kaldirma.md)). En çok üç telefon görünür.
   - Yan yana iki kart (900 pikselden dar ekranda alt alta): **"Konum"** ([Konum](konum.md)) ve **"Ekran süresi"**
     ([Ekran süresi](ekran-suresi.md)).
   - En altta **"Ayarlar"** kartı: paylaşım ve sıklık ([Paylaşım ayarları](paylasim-ayarlari.md)), süre sınırları
     ([Süre sınırı](sure-siniri.md)) ve tek bir **"Kaydet"**.
6. Sayfa her açılışta sunucudan yeniden okunur; kendiliğinden tazelenmez. Yeni konum ya da süre görmek için üst şeritteki
   "Sayfayı yenile" düğmesine bas ([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)) ya da sayfayı yeniden aç.

Tasarımda (Tasarım 1 önizlemesi): çocuk şeridi yoktur, öbür çocuğa [Portallarım](../portallar/portallarim.md)'dan ya da
Çocuklarım'daki "Oturumuna geç"le geçersin. Sayfa üç bölümdür:

1. **"Elif'in telefonu"** bölümü (sağında uygulama sürümü, ör. "Eğitim Evi 1.0.12"): "Durum:", "Pil:", "Konum: her 15
   dakikada bir gelir" satırları, çocuğun konumunu gösteren harita ve **"Konum gönderme sıklığı"** çipleri
   ([Konum](konum.md), [Paylaşım ayarları](paylasim-ayarlari.md)).
2. **"Ekran süresi · son 7 gün"** bölümü: yedi gün sütunu, dokunulan günün uygulama listesi ([Ekran süresi](ekran-suresi.md)).
3. **"Süre sınırı"** bölümü: "Sınır yok", "Ortak (günlük toplam)", "Uygulama başına" ve kendi **"Kaydet"**i
   ([Süre sınırı](sure-siniri.md)).

Önizlemede kurulum kartı, "Bağlı telefon" kartı, "Bağlantıyı kaldır", "Konumu paylaş" ve "Ekran süresini paylaş" kutuları
görünmez; kullanıcı bunların kaldırılmasını istemedi (1 Ekim sözü "şu an daha ellemediklerim base site gibi olsun",
anlamını 2 Ekim'de onayladı; 3 Ekim kuralı: kullanıcının söylediğinden eksik ya da fazla bir şey olmayacak), bu yüzden
kodlanırken yerlerinde kalırlar.

### Öğretmen, müdür ve çalışan

- Okulun personeli olarak bu sayfayı göremezsin: menünde yoktur, adresi yazarsan sunucu "Bu öğrencinin velisi değilsin"
  der. Okul (müdür, öğretmen, ek görevli çalışan) Aile verisini hiçbir yerden görmez ([Kim görür](mahremiyet.md)).
- Kendi çocuğunun velisiysen: yetişkin hesabının veli portalına geç ([Portallarım](../portallar/portallarim.md)); orada
  menünde "Çocuğumun telefonu" vardır ve veli bölümündeki her şeyi yaparsın.
- Eski düzende okulun açtığı öğretmen/müdür hesabında çocuğun bağlıysa menüdeki "Velisi olduğum" bölümünde bu sayfa yok;
  sayfayı yalnız Aile bildirimindeki bağlantıdan açabilirsin (sunucu veli bağına baktığı için veri gelir).

### Öğrenci

Sitede bu sayfa öğrenciye yoktur. Adresi elle yazarsan "Henüz çocuk eklenmedi…" görürsün; sunucu da öğrencinin
kendi özetine bakmasına izin vermez. Telefonunun ne gönderdiğini telefonundaki ekranda görürsün
([Telefondaki izinler ve durum](izinler-ve-durum.md)).

## Kurallar ve sınırlar

- **Kim açar:** yalnız çocuğa veli bağıyla bağlı hesap (veli kodu ya da okulun bağlaması,
  [Veli kodu](../hesaplar/veli-kodu.md), [Veli bağlama](../hesaplar/veli-baglama.md)). Başka herkese sunucu 403 "Bu
  öğrencinin velisi değilsin".
- **Okul kapatamaz:** bölüm Özellikler listesinde yok ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)); okul öteki
  bölümleri kapatsa da bu sayfa çalışır.
- **Aydınlatma metni:** onayın eskiyse sayfa açılmaz, önce yeni metni onaylarsın
  ([Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)).
- **Bir sayfada bir çocuk.** Şeritten çocuk değiştirmek bütün veli sayfalarının seçili çocuğunu değiştirir (Ödevler,
  Devamsızlık, Takvim de o çocuğa daralır).
- **Bilinen sorunlar (bugünkü kodda):**
  - "Konumu paylaş" kapalıyken ve eski konumlar henüz silinmemişken sayfa açılmaz; kartların yerine kırmızı kutuda
    "Cannot read properties of null (reading 'classList')" çıkar. Son konumun üzerinden 7 gün geçene kadar ayarlara da
    ulaşamazsın ([Paylaşım ayarları](paylasim-ayarlari.md#kurallar-ve-sınırlar)).
  - Çocuğun adında "&" ya da kesme işareti varsa başlıkta `&amp;` ya da `&#39;` gibi görünür (ad iki kez kaçırılıyor).
  - Bu sayfanın şeridinden çocuk değiştirip Ödevler'e geçersen, çocuklar farklı okullardaysa yıl şeridi bir süre öteki
    çocuğun okuluna göre kalabilir (yıl bilgisi yeniden alınmıyor).
  - Ayarlar kartında sınır ekleyip "Kaydet"e basmadan başka sayfaya geçersen eklediğin kaybolur, uyarı çıkmaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Çocuğun telefonunu bağlama](telefonu-baglama.md) — kurulum kartının anlattığı iş.
- [Konum](konum.md), [Ekran süresi](ekran-suresi.md) — sayfanın ortadaki iki kartı.
- [Paylaşım ayarları](paylasim-ayarlari.md), [Süre sınırı ve aşım bildirimi](sure-siniri.md) — "Ayarlar" kartı.
- [Bağlantıyı kaldırma](baglantiyi-kaldirma.md) — "Bağlı telefon" kartındaki düğme.
- [Telefondaki izinler ve durum](izinler-ve-durum.md), [Aile bildirimleri](bildirimler.md),
  [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Portallarım](../portallar/portallarim.md),
  [Çocuklarım](../portallar/cocuklarim.md).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Telefonda menü](../menu-ve-arama/telefonda-menu.md).
- [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md) — tasarımdaki telefon kutucuğu.

## Kod tarafı

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `SAYFALAR.aile` (başlık, çocuk şeridi
  `data-act="aile-cocuk"`, kart sırası), `aileCocugu()` ("Hepsi" yok), `aileCihazKarti`, `aileKurulumKarti`, `AILE`
  durumu; [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) — `veliCocuklar`,
  `veliSeciliCocuk`, `veliCocukYok`; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) —
  `{ k: 'aile', g: 'telefon', ad: 'Çocuğumun telefonu' }`, `veliBolumu()` (bu sayfa yok);
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) — `git()` her geçişte
  `aileHaritaKapat()`, hata iletisini sayfaya yazan `catch`.
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `GET /api/aile/ozet?studentId=` (`bagliMi` denetimi,
  `saklamaGun`); [sunucu/api.md](../../sunucu/api.md) — oturum kapıları (aydınlatma, zorunlu şifre).
- CSS: `33-aile.css` (`.aile-izgara` 900 piksel altında tek sütun), `24-veli.css` (`.cocuk-seridi`) —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/test-aile.md](../../testler/test-aile.md) (bağlı olmayan veli, müdür, öğretmen ve öğrenci 403),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (`aile` sayfası menüde, `aile-cocuk` eylemi var). Sayfanın
  çizimini deneyen tarayıcı testi yok.
- Tasarım: Tasarım 1 önizlemesi, öğrenci-veli paketi (çocuk oturumuna göre başlık, üç bölümlü sayfa).

## Sık sorulanlar

- **Menümde "Çocuğumun telefonu" yok.** Veli portalında değilsin (öğretmen ya da müdür portalındaysan
  [Portallarım](../portallar/portallarim.md)'dan veli portalına geç) ya da hesabına bağlı çocuk yok.
- **Sayfa "henüz bağlı değil" diyor.** Çocuğun telefonu bağlanmamış ya da bağlantı kaldırılmış;
  [Çocuğun telefonunu bağlama](telefonu-baglama.md).
- **Öğretmeni olduğum okulun öğrencisinin telefonunu görebilir miyim?** Hayır; yalnız velisi görür.
- **Sayfa kırmızı bir İngilizce hata gösteriyor.** Büyük olasılıkla "Konumu paylaş"ı kapattın; bugünkü koddaki hata
  (yukarıda). Öbür velisi de aynı sorunu yaşar; düzeltilene kadar son konumun üzerinden 7 gün geçmesi gerekir.

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı): sayfa ve menü "Elif'in telefonu" olur, çocuk şeridi kalkar.
- Tam debug (iş 27): konum paylaşımı kapalıyken sayfanın açılmaması, başlıktaki çift kaçırma, yıl bilgisinin tazelenmemesi.
- Android yerel uygulama (iş 10): uygulamanın veli ekranlarında "Çocuğumun telefonu" (özet, harita, ekran süresi grafiği,
  sınırlar) — aynı sunucu uçlarını kullanacak.
- Çok dil (iş 22): sayfa metinleri ve "'in" ekinin dile göre yazımı.
