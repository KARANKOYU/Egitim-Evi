# KVKK ve gizlilik · Saklama süreleri

**Durum:** Kodda var; tasarımda ek olarak bildirimlerin 90 gün, mesaj ve duyuruların 1 yıl, quizin 1 yıl, anketlerin bitişten 1 yıl
sonra silinmesi, işlem kaydının okul başına 2 yıl tutulması, öğrenci ve velinin yalnız aktif ve bir önceki eğitim yılını görmesi,
sunucu yedeğinin .tar.gz ve 7 kopya olması ve tasarlanan özelliklerin (destek talebi, şikâyet etiketi, "Bu mesajı bildir",
toplantı, mezunlar, eğitim içerikleri) kendi süreleri.

Hangi verinin ne kadar durduğu, ne zaman ve nasıl kendiliğinden silindiği, neyin hiç silinmediği: bugün kodda olan ve tasarımda
kararlaştırılan süreler tek tabloda.

## Ne işe yarar

Kişisel veri gerektiğinden uzun tutulmamalı (KVKK'nın genel ilkesi); tablolar yıllarca büyüyüp siteyi de yavaşlatmamalı. Kullanıcının
sözleri: 27 Eylül'de "öğrenci dediğim şekilde ilk müdür açınca duracak, öğrenci geçmiş yılını da sadece son 1 yıl görebilecek ve quiz
ekleri de silinsin belli süre sonra ve eski mesajlar"; aynı gün önerilen "bildirimler 90 gün" ve "işlem kaydı okul başına 2 yıl"a
itiraz etmedi. Aydınlatma metninin 7. bölümü ("Ne kadar süre saklanıyor?") bu sürelerin kullanıcıya dönük hâlidir
([Aydınlatma metni](aydinlatma-metni.md)).

## Nereden açılır

Ayrı bir ekranı yok. Süreleri şuralarda görürsün:

- Aydınlatma metni, 7. bölüm "Ne kadar süre saklanıyor?" ve 2. bölümün satırları (`/kvkk/kvkk.html`).
- Kullanım koşulları, 5. bölüm "Sorun yaşarsanız": "mesaj ve ödev ekleri 7 gün sonra, ödev teslim dosyaları ödevin son tesliminden 7
  gün sonra silinir" ([Kullanım koşulları](kullanim-kosullari.md)).
- SSS: "Yüklenen dosyalar ne kadar saklanır?" ve "Servisin konumunu kim görür?" ([SSS](../acilis-sayfasi/sss.md)).
- Dosya satırlarında: teslim dosyasında ve ekte "N gün sonra silinir", süresi geçen ekte "süresi doldu" ([Teslim](../odev/teslim.md),
  [Ekler](../mesaj/ekler.md)).
- Çocuğumun telefonu sayfasının başlığı: "… Veriler 7 gün sonra silinir." ([Kim görür, ne kadar saklanır](../aile/mahremiyet.md)).
- **Tasarımda:** destek talebinin yanında "5 gün sonra kapanır", "2 gün sonra silinir"; "Verilerimi indir" penceresinde "son 90 günün
  bildirimleri" ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).

## Adım adım

### Bugün kodda: süreler

| Veri | Ne kadar durur | Nasıl silinir | Ayrıntı |
|---|---|---|---|
| Giriş oturumu | Tarayıcıda 7 gün, Eğitim Evi telefon uygulamasında 30 gün (kullandıkça uzamaz) | Süresi dolunca; çıkışta hemen; şifre değişince öteki oturumların hepsi; 10 dakikada bir temizlik | [Beni hatırla](../giris-hesap/beni-hatirla.md) |
| İki adımlı giriş kodu, robot doğrulama sorusu | 5 dakika | Kendiliğinden (sunucunun belleğinde) | [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md) |
| Şifre sıfırlama bağlantısı | 1 saat | Süresi dolunca | [Şifremi unuttum](../giris-hesap/sifremi-unuttum.md) |
| Kayıt ve e-posta değişikliği onay bağlantısı (bekleyen bilgilerle) | 24 saat | Tıklanmayan istek bekleyen bilgileriyle silinir (10 dakikada bir) | [E-posta onayı](../giris-hesap/eposta-onayi.md) |
| "Tanıdık bağlantı" kaydı (hesabın girdiği IP) | 30 gün | Sunucunun belleğinde; sunucu yeniden başlayınca boşalır | [Hatalı giriş ve kilit](../giris-hesap/hatali-giris-ve-kilit.md) |
| Ödev teslim dosyaları | Son teslimden 7 gün sonra; son teslimsiz ödevde sonuçlandırmadan 7 gün sonra; hiç sonuçlandırılmazsa yüklemeden 60 gün sonra | Saatte bir süpürme; son teslim ileri alınırsa silinme de kayar; son teslim değişir ya da ödev yeniden açılırsa en az 7 gün daha; ödev silinince hemen | [Ödev · saklama ve silinme](../odev/saklama-ve-silinme.md) |
| Mesaj ve ödev ekleri | Yüklendikten 7 gün sonra | Saatte bir; mesaj ya da ödev daha önce silinirse onunla; bir mesaja ya da ödeve bağlanmayan taslak ek 6 saat sonra | [Ekler](../mesaj/ekler.md) |
| Quiz cevapları, süreleri, sekme değiştirme kaydı | Ödevle birlikte | Ödev ya da öğrencinin hesabı silinince | [Quiz · saklama ve silinme](../quiz/saklama-ve-silinme.md) |
| Servis seferleri (son konum dahil) | 30 gün | 10 dakikada bir; geçmiş iz hiç tutulmaz, yalnız son konum | [Canlı konum ve harita](../servis/canli-konum-ve-harita.md) |
| Servis yoklaması, servis olayları ve veliye giden servis bildirimlerinin kaydı, servisçinin notları, velinin "binmeyecek" işaretleri | 30 gün (Türkiye günüyle) | 10 dakikada bir; yedeğe girmez | [Yoklama sayfası](../servis/yoklama-sayfasi.md), [Binmeyecek](../servis/binmeyecek.md) |
| Öğrencinin evinin haritadaki yeri | İşaret durdukça | İşaret kaldırılınca ya da öğrencinin hesabı silinince | [Evi işaretleme](../servis/evi-isaretleme.md) |
| Eğitim Evi Aile: konumlar | 7 gün | Saatte bir; yedeğe girmez | [Kim görür, ne kadar saklanır](../aile/mahremiyet.md) |
| Eğitim Evi Aile: ekran süreleri ve sınır uyarıları | Bugün ve önceki 7 gün | Saatte bir; yedeğe girmez | aynı belge |
| Telefon bildirimi aboneliği | Bildirim açık kaldıkça | Çıkışta, "Kapat"ta, hesap silinince; kişi başına en çok 5, yenisi gelince en eskisi | [Telefon bildirimi](../bildirim/telefon-bildirimi.md) |
| Telefon uygulamasının cihaz anahtarı | Uygulamada oturum açık kaldıkça | Çıkışta, şifre değişince, hesap silinince; aydınlatma metni onayı eskiyse ya da hesap kullanılamıyorsa ilk kullanıldığında; hesap başına en çok 5 telefon | [Android uygulaması](../uygulama/android-uygulamasi.md) |
| "Bir kez gitsin" işaretleri (sabah ders özeti, "yarın ödevin var"…) | 30 gün | Kendiliğinden | [Bildirim · saklama ve silinme](../bildirim/saklama-ve-silinme.md) |
| Zil bildirimleri | **Süresiz** (zil en yeni 100'ü gösterir) | Yalnız hesap silinince ya da o portal kapanınca | aynı belge |
| İşlem kaydı | Bütün sistemde en çok 5000 satır | Her yeni satırdan sonra en eskiler; elle silinmez | [İşlem kaydı · saklama ve sınırlar](../islem-kaydi/saklama-ve-sinirlar.md) |
| Kişisel hatırlatıcılar | Kişi silene kadar | Kişi siler; hesapla birlikte | [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md) |
| Açılış sayfası yorumu | Kişi silene kadar | Kişi siler; hesapla birlikte | [Yorumu düzeltme ve silme](../yorumlar/yorumu-duzeltme-ve-silme.md) |
| Okul sayfası fotoğrafları | Okul silene kadar | Okul siler; artık dosyalar 6 saatte bir süpürülür; konum, tarih ve cihaz bilgisi yüklenirken silinir | [Tanıtım ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md) |
| Sunucunun günlük yedeği (JSON) | En yeni 14 yedek (otomatik, elle alınan ve geri yükleme öncesi kopyalar birlikte sayılır) | Daha eskiler silinir; yedek 6 saatte bir denetlenir, günde bir alınır | [Site yedekleri](../yonetim/yedekler.md) |

### Bugün kodda: kendiliğinden silinmeyenler

- **Öğrenci hesabı ve ders kayıtları** (ödevler ve sonuçları, sınav notları, devamsızlık, etüt yoklaması, nakil geçmişi) kendiliğinden
  silinmez; okul yönetimi bütün geçmişi görür. Öğrenci ve velisi bugün bütün geçmiş yılları seçip görebilir.
- **Mesajlar ve duyurular, anketler, zil bildirimleri** bugün süresizdir.
- **Hesap silinince:** yetişkin "Hesabımı sil" dediğinde hesap, çocuk bağları, öğretmenlik rolleri, bildirimler ve oturumlar hemen
  silinir; verdiği ödevler ve girdiği notlar okulda kalır ([Hesabımı sil](../ayarlar/hesabimi-sil.md)). Öğrenci ve servisçi hesabını
  okul kapatır. Aydınlatma metni "sistem yöneticisi hesabı sildiğinde kişisel veriler kayıtlardan kaldırılır" der; bugün yöneticinin
  "Hesabı sil"i yalnız müdürün okul rolünü siler, yetişkin hesabı durur ([Haklar ve başvuru](haklar-ve-basvuru.md#yönetici)).
- **Öğrenci okul değiştirince** eski okulun ödev, not ve devamsızlık kayıtları eski okulda kalır; yeni okul görmez
  ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).

### Tasarımda: yeni süreler

Optimizasyon ve saklama işinin (iş 7) kararları:

| Veri | Tasarımdaki süre | Not |
|---|---|---|
| Zil bildirimleri | **90 gün** | Tablo yıllarca büyümesin; zil daha kısa geçmiş gösterir |
| Mesajlar ve duyurular (alıcı ve okunma satırları dahil) | Gönderildikten **1 yıl** | Ekler zaten 7 günde siliniyor |
| Anketler | Bitişinden **1 yıl** | |
| Quiz (sorular, şıklar, denemeler, cevaplar) | Ödevin son tesliminden (son teslimi yoksa açılışından) **1 yıl** | Ödevin kendisi ve öğretmenin girdiği sonuç kalır; ödevde "Quiz 1 yıl sonra silindi" gibi kısa bir iz görünür |
| İşlem kaydı | Okul başına **2 yıl** | Bugünkü sistem geneli 5000 satır sınırı kalkar; yerine okul başına makul bir üst sınır (ör. 50 000) |
| İşlem kaydındaki "Başarısız giriş denemesi" satırları | **90 gün** | |
| Gönderilmiş ve kapanmış tek seferlik hatırlatıcılar | **30 gün** | |
| Kaydı olmayan (sahipsiz) dosyalar | 1 günden eskiyse silinir | Teslim dosyaları, ekler ve okul fotoğrafları klasörleri |
| Süresi dolmuş oturumlar, kod ve doğrulama kayıtları | Siliniyor; doğrulanır | Bugün zaten siliniyor |
| E-postası doğrulanmamış yeni kayıt | Tanımda "7 gün"; bugünkü kod 24 saatte siliyor | Tanımdaki madde eskimiş: bugünkü 24 saat zaten daha kısa, ek iş gerekmiyor (öneri) |
| Sunucunun günlük yedeği | **.tar.gz**, en yeni **7 otomatik** + elle alınanlar | Akışla yazılır (bellek taşmaz); yüklenen dosyaları yedeğe katma ayarı; eski .json yedekleri de geri yüklenebilir |

Silinmeyecekler (değişmedi): öğrenci hesabı ve ders kayıtları, aktif ve bir önceki eğitim yılı, okul ayarları, roller. Temizlik küçük
parçalarla (ör. 5 000 satırlık) yapılır; aktif yılın verisine, öğrenci hesaplarına ve ders kayıtlarına hiç dokunmaz. Yedekten eski
veri geri gelirse sonraki temizlik onu yine siler.

**Öğrenci ve velinin görebildiği yıllar:** yalnız **aktif** eğitim yılı ve **ondan bir önceki** yıl (nakil öğrencisinin "Önceki
okullar" dönemleri de). Kural sunucudadır: daha eski bir yıl istenirse açık bir hata döner: "Eski yıllar yalnız okul yönetimine
açık"; seçicide de gösterilmez. Öğretmen ve müdür bütün yılları görür. Veri silinmez, yalnız öğrenciye ve veliye kapanır
([Geçmiş yıl](../egitim-yili/gecmis-yil.md)).

### Tasarımda: yeni özelliklerin süreleri

| Özellik | Süre | Belge |
|---|---|---|
| Destek talepleri | Ekip yanıtlayınca kullanıcı 1 hafta yanıt vermezse kapanır; kapalı talep 1 hafta sonra (talep, yazışmalar, ekler) tamamen silinir; kullanıcı kendi talebini hemen silebilir; yanıtsız talep kendiliğinden kapanmaz; ekran görüntüsü ekleri 7 gün | [Talep sınırları](../destek/talep-sinirlari.md) |
| Şikâyet etiketi | "Çözüldü" işaretlenince 1 gün sonra silinir; gönderildikten 1 hafta içinde hiç bakılmazsa silinir ve gönderene "yeniden gönder" bildirimi; bakılmış ama çözülmemiş kayıt çözülene kadar durur (öneri: en çok 60 gün, kullanıcıya soruldu) | [Şikâyet etiketi](../mesaj/sikayet-etiketi.md) |
| "Bu mesajı bildir" kayıtları | 30 gün | [Bu mesajı bildir](../mesaj/bu-mesaji-bildir.md) |
| Toplantılar | Bittikten 1 hafta sonra kaydı silinir | [Hatırlatma ve silinme](../toplanti/hatirlatma-ve-silinme.md) |
| Mezunların okul kayıtları | Okulun kaydı olarak saklanır; öğrenci ve velisi 1 yıl görür, sonra kart görünmez ama veri durur ve "Verilerimi indir"de vardır | [Mezunlar](../egitim-yili/mezunlar.md) |
| Okul yedeği (.7z, şifreli; yıl sonu arşivinin yerine geçer) | Okul başına sayı sınırı (yönetici verir; varsayılan 1, 0–20); geri yüklemeden önce kendiliğinden alınan "önceki hâl" yedeği 24 saat durur; dosyalar yedeğe girmez; hesabını silmiş kişinin verisi geri yüklemede geri gelmez | [Okul yedeği](../egitim-yili/okul-yedegi.md) |
| Başarılar | **Kalıcı:** öğrencinin hesabında durur; "son 1 yıl" kuralının istisnası; okul silinse de kişide kalır; yalnız ekleyen kurum siler | [Kalıcılık ve silme](../basarilar/kalicilik-ve-silme.md) |
| Eğitim içerikleri | İzleme geçmişi ve kaldığın yer yalnız sende, Ayarlar'da "İzleme geçmişini temizle"; indirilen video cihazda şifreli; YouTube'da kaldırılan video günlük denetimle Eğitim içeriklerinden de silinir | [İzleme geçmişi](../egitim-icerikleri/izleme-gecmisi.md), [YouTube denetimi](../egitim-icerikleri/youtube-denetimi.md) |
| Açık oturumlar ve yeni cihaz uyarısı | Oturumla birlikte; cihaz özeti tutulur, IP'nin kendisi saklanmaz (yalnız özeti) | [Açık oturumlar](../ayarlar/acik-oturumlar.md) |
| Tarayıcı hata günlüğü | Son 24 saat; kişisel veri ve kullanıcı kimliği olmadan | [Sistem durumu](../yonetim/sistem-durumu.md) |
| Eklentilerin saklama ayarı (öneri; eklentiler kodlanmayacak) | Okul süreleri değiştirebilir: en az 7 gün, en çok 1 yıl; kısaltma 7 gün bekler ve geriye dönük siler; işlem kaydının süresi değiştirilemez; kaldırılan eklentinin verisi 30 gün sonra silinir | [Eklentilerin sınırları](../eklentiler/sinirlar.md) |

Tasarım 1 önizlemesinde Hesabımı sil penceresi silmeyi hemen yapmaz: "Silme isteğin alındı; hesabın … silinecek. O güne kadar iptal
edebilirsin." (7 gün; bu sürede giriş yaparsan silme iptal olur). Bu, tanımlarda yazılı bir karar değil; ayrıntı
[Hesabımı sil](../ayarlar/hesabimi-sil.md)'de.

### Öğrenci

- Teslim dosyalarının satırında kaç gün sonra silineceği yazar; kalıcı olması gerekeni kendi cihazına indir.
- Quiz cevapların ödevle birlikte durur; tasarımda 1 yıl sonra quiz silinir, ödevin sonucu kalır.
- Tasarımda eski yıllardan yalnız bir öncekini görürsün; başarıların ise kalıcıdır.

### Veli

- Servis yoklaması, notlar ve "binmeyecek" işaretleri 30 gün; Eğitim Evi Aile verileri 7 gün durur.
- Çocuğunun ödev, not ve devamsızlık kayıtları okulda kalır; tasarımda sen de yalnız aktif ve bir önceki yılı görürsün.
- Tasarımda "Çocuğumun verilerini indir" ile saklama süresi içindeki her şeyin kopyasını alırsın.

### Öğretmen ve çalışan

- Öğrencinin teslim dosyası son teslimden 7 gün sonra silinir; bakacağın dosyayı bu sürede incele ya da indir.
- Okuldan ayrılsan da verdiğin ödevler ve girdiğin notlar okulda kalır.
- Tasarımda gönderdiğin mesajlar ve duyurular 1 yıl sonra silinir.

### Müdür

- Okulun ders kayıtları kendiliğinden silinmez; geçmiş yıllara her zaman bakarsın.
- İşlem kaydı bugün bütün sistemde 5000 satırla sınırlıdır (kalabalık okullar öbürlerinin eski satırlarını iter); tasarımda okul
  başına 2 yıl.
- Okul sayfasındaki fotoğrafları sen silene kadar durur.

### Servisçi

- Yoklama, notlar ve işaretler 30 gün; seferler ve son konum 30 gün; geçmiş iz tutulmaz.

### Yönetici

- Temizlik işleri sunucuda kendiliğinden çalışır (10 dakikada, saatte, 6 saatte bir); elle başlatılan bir "temizle" düğmesi yok.
- Günlük yedekte en yeni 14 dosya kalır; yedeğe girmeyen geçici veriler (Eğitim Evi Aile, servis yoklaması ve olayları) geri
  yüklemede boşaltılır; ödev dosyalarının ve eklerin kendisi JSON yedeğe girmez, yalnız bilgileri girer ([Site yedekleri](../yonetim/yedekler.md)).

### Destek ve eğitmen

**Tasarımda:** destek ekibi talepleri yukarıdaki sürelerle görür; işlem kaydına talep içeriği yazılmaz. Eğitmenin videoları hesabı
silinince seriler, izlenme ve beğeni sayılarıyla birlikte silinir; eğitmenlik rolü alınınca videolar yayında kalır (öneri)
([Videolarım](../egitim-icerikleri/videolarim.md)).

## Kurallar ve sınırlar

- **Zaman:** servis kayıtlarının günü Türkiye günüdür; öbür süreler kaydın yazıldığı andan sayılır.
- **Temizlik sıklığı:** oturumlar, onay bağlantıları, servis kayıtları 10 dakikada bir; teslim dosyaları, ekler ve Eğitim Evi Aile
  saatte bir; okul fotoğraflarının artıkları 6 saatte bir; quiz denemeleri dakikada bir kapanır; yedek 6 saatte bir denetlenir.
- **Kimse elle silemez:** işlem kaydı ve bildirimler tek tek silinmez (ne bugün ne tasarımda).
- **Dikkat (metinle kod arasında):** aydınlatma metninin 7. bölümünde zil bildirimlerinin, mesajların, duyuruların, anketlerin ve
  işlem kaydının saklama süresi yazmıyor; bugün bunların süresi yok. İş 7 bu süreleri kodlayınca metne de yazılacak (kalıcı kural).
- **Dikkat (KILAVUZ):** KILAVUZ'un "Veriler" bölümü yedek için "14 tane saklanır" der (bugünkü kodla uyumlu); tasarımda 7 otomatik +
  elle alınanlar olacak.
- **Eklenti ↔ Verilerimi indir:** bir okul saklama süresini değiştirirse (öneri) "Verilerimi indir"deki sabit süreler ("son 90 günün
  bildirimleri", "7 günlük" Aile verisi) okulun geçerli süresine göre okunur.

## Kardeşler ve ilgili

**Kardeşler** ([KVKK ve gizlilik](README.md)):

- [Aydınlatma metni](aydinlatma-metni.md) — 7. bölüm.
- [Kullanım koşulları](kullanim-kosullari.md) — 5. bölümdeki dosya süreleri.
- [Kim neyi görür](kim-neyi-gorur.md) — süre dolana kadar kimin gördüğü.
- [Haklar ve başvuru](haklar-ve-basvuru.md) — silme hakkı, Verilerimi indir.
- [Dışarı giden veriler](disari-giden-veriler.md), [Onay ve yeniden onay](onay-ve-yeniden-onay.md).

**İlgili:**

- [Ödev · saklama ve silinme](../odev/saklama-ve-silinme.md), [Quiz · saklama ve silinme](../quiz/saklama-ve-silinme.md),
  [Bildirim · saklama ve silinme](../bildirim/saklama-ve-silinme.md), [İşlem kaydı · saklama ve sınırlar](../islem-kaydi/saklama-ve-sinirlar.md).
- [Ekler](../mesaj/ekler.md), [Teslim](../odev/teslim.md).
- [Yoklama sayfası](../servis/yoklama-sayfasi.md), [Servis bildirimleri](../servis/servis-bildirimleri.md), [Kim görür, ne kadar saklanır](../aile/mahremiyet.md).
- [Site yedekleri](../yonetim/yedekler.md), [Okul yedeği](../egitim-yili/okul-yedegi.md), [Geçmiş yıl](../egitim-yili/gecmis-yil.md),
  [Mezunlar](../egitim-yili/mezunlar.md).
- [Verilerimi indir](../ayarlar/verilerimi-indir.md), [Hesabımı sil](../ayarlar/hesabimi-sil.md).

## Kod tarafı

- Zamanlayıcılar: [sunucu/index.md](../../sunucu/index.md) — temizlik (`guvenlikTemizle` 10 dk), quiz (dakikada), servis (10 dk),
  Aile (saatte), dosya ve ek süpürme (saatte), okul fotoğrafı artıkları (6 saatte), yedek (6 saatte denetim).
- Oturum, kod, bağlantı süreleri: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) (`OTURUM_OMRU_MS` 7 gün, `SIFIRLAMA_OMRU_MS`
  1 saat, `ONAY_OMRU_MS` 24 saat, `TANIDIK_OMUR_MS` 30 gün), [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md)
  (uygulama oturumu 30 gün), [sunucu/veri/depo/onaylar.md](../../sunucu/veri/depo/onaylar.md).
- Dosyalar ve ekler: [sunucu/veri/depo/odev-dosyalari.md](../../sunucu/veri/depo/odev-dosyalari.md) (silinme anı hesabı),
  [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) (`dosyaSupur`), [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md)
  (`ekSupur`), [sunucu/veri/depo/ekler.md](../../sunucu/veri/depo/ekler.md) (7 gün).
- Servis: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) (`SAKLAMA_GUN` 30, `servisTemizle`),
  [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md).
- Aile: [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) (`SAKLAMA_GUN` 7).
- Bildirim işaretleri ve işlem kaydı: [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) (30 gün),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`ISLEM_SINIR` 5000, bildirimlerin en yeni 100'ü).
- Yedek: [sunucu/veri/yedek.md](../../sunucu/veri/yedek.md) (`YEDEK_SAKLA` 14), [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md)
  (yedeğe girmeyen tablolar, geri yüklemede boşaltma).
- Testler: [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md), [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md),
  [testler/test-aile.md](../../testler/test-aile.md), [testler/test-yedek.md](../../testler/test-yedek.md). Tasarımdaki süreler için
  yeni bir saklama testi paketi yazılacak (tarihleri test veritabanında geriye çekerek).

## Sık sorulanlar

- **Yüklenen dosyalar ne kadar saklanır?** (SSS) Ödev teslim dosyaları ödevin son tesliminden 7 gün sonra kendiliğinden silinir (son
  teslimi olmayan ödevde ödev sonuçlandırıldıktan 7 gün sonra, hiç sonuçlandırılmazsa yüklendikten 60 gün sonra). Mesaj ve ödev ekleri
  yüklendikten 7 gün sonra silinir. Her dosyanın satırında kaç gün sonra silineceği yazar. Kalıcı olması gereken belgeyi kendi
  bilgisayarına indir.
- **Notlarım bir gün silinir mi?** Hayır; ders kayıtları okulda kalır. Tasarımda öğrenci ve veli yalnız aktif ve bir önceki yılı görür.
- **Servisin geçmiş yolunu görebilir miyim?** Hayır; yalnız son konum tutulur, seferler 30 gün sonra silinir.
- **Eski bildirimlerim neden yok?** Bugün silinmiyorlar ama zil en yeni 100'ü gösterir; tasarımda 90 gün sonra silinirler.

## Sırada

- Optimizasyon ve saklama süreleri (iş 7): yukarıdaki "Tasarımda: yeni süreler" tablosu, öğrenci ve veliye son bir geçmiş yıl,
  .tar.gz yedek, saklama testi, aydınlatma metninin 7. bölümü.
- Destek talepleri (iş 6), mesaj etiketleri ve "Bu mesajı bildir" (iş 28, iş 8), toplantılar (iş 21), yıl geçişi ve mezunlar (iş 9),
  başarılar (iş 16), eğitim içerikleri (iş 17): kendi süreleri.
- Sistem işi (iş 4): açık oturumlar, tarayıcı hata günlüğü.
- KVKK ve onay metinleri tam denetimi (iş 18): saklama süresi yazmayan her tablo bulgu sayılır.
