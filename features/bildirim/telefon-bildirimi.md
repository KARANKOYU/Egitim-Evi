# Bildirimler · Telefon bildirimi ve bildirim izni

**Durum:** Kodda var; tasarımda ek olarak sayfanın başında "Bildirimlere izin ver" şeridi, Hesap ayarları → Bildirimler bölümü
(bu cihazdaki izin, uygulama ve e-posta anahtarları), "Önemli" bildirimler için ayrı sesli kanal ve bildirim başlığında kurum adı.

Eğitim Evi kapalıyken de bildirimlerin telefonuna (ya da bilgisayarına) düşmesi: tarayıcıdan izin vererek ya da Eğitim Evi Android
uygulamasıyla.

## Ne işe yarar

Zil yalnız Eğitim Evi açıkken işe yarar. Telefon bildirimini açarsan "Servis evine 100 metreden yakın, hazırlan.", yeni mesaj, yeni
ödev, devamsızlık gibi her bildirim telefonun bildirim çubuğuna gelir. Kullanıcının isteği (25 Eylül): "web site bildirim ler için
izin isteyebilcek". Zamanı önemli bildirimler (servis yaklaştı, derse gelmedi) bu yolla anında gider; sayfanın kendi yoklaması
yalnız yedektir ([Zilin tazelenmesi](yoklama-araligi.md)).

## Nereden açılır

- **Ayarlar** (sol menünün altındaki "Ayarlar") → **"Telefon bildirimleri"** kartı → **"Bildirimleri aç"**.
- Servisi olan öğrenci ve velinin **Servis** sayfasında öneri kartı: **"Servis yaklaşınca haber al"** → **"Bildirimleri aç"**.
- Android'de Eğitim Evi uygulaması: uygulamaya giriş yapman yeter ([Android uygulaması](../uygulama/android-uygulamasi.md)).
- iPhone'da önce Safari'de **Paylaş → Ana Ekrana Ekle**, sonra ana ekrandaki Eğitim Evi'nden aç ve yukarıdaki gibi aç
  ([Tarayıcıdan uygulama olarak yükleme](../uygulama/tarayicidan-yukleme.md)).
- Tasarımda ayrıca: her sayfanın başındaki **"Bildirimlere izin ver"** şeridi ve **Hesap ayarları → Bildirimler**.

## Adım adım

### Herkes — tarayıcıdan (bugünkü site)

1. **Ayarlar**'ı aç. "Telefon bildirimleri" kartı yüklenirken "Yükleniyor..." yazar, sonra bu cihazdaki durumu gösterir:
   - kapalıysa: **"Bu cihazda kapalı"** — "Servis eve yaklaşınca, yeni mesaj ve ödevde telefonuna bildirim gelsin." ve
     **"Bildirimleri aç"** düğmesi;
   - açıksa: **"Bu cihazda açık"** — "Uygulama kapalıyken de bildirim gelir." ve **"Kapat"** düğmesi;
   - tarayıcıda bu site için bildirim engellenmişse: **"Bu cihazda kapalı"** — "Tarayıcıda bu site için bildirim engellenmiş; site
     ayarlarından izin ver." (düğme yok);
   - tarayıcı desteklemiyorsa: "Bu tarayıcı telefon bildirimini desteklemiyor. iPhone'da önce Paylaş > Ana Ekrana Ekle ile
     uygulamayı kur, oradan aç."; bağlantı güvenli değilse: "Telefon bildirimi yalnızca güvenli (https) bağlantıda çalışır."
2. **"Bildirimleri aç"**'a bas. Düğme "Açılıyor..." olur; tarayıcı küçük bir pencerede izin ister.
3. Tarayıcının penceresinde **İzin ver**'i seç. Kartın altında yeşil **"Telefon bildirimleri açıldı."** yazar, kart "Bu cihazda açık"
   olur.
4. Kapatmak için **"Kapat"** ("Kapatılıyor..."): bu cihazın aboneliği sunucudan ve tarayıcıdan silinir.
5. Bundan sonra zile düşen her bildirim telefonuna da gelir: başlığı **"Eğitim Evi"**, metni bildirimin metni, yanında Eğitim Evi
   simgesi.
6. Telefondaki bildirime dokun: Eğitim Evi açık bir pencerede varsa o öne gelir ve bildirimin sayfasına gider; yoksa yeni pencerede
   açılır. Bildirim başka bir portalına geldiyse (ör. veli portalındayken öğretmen olarak gelen) o portala geçilir.

Hata iletileri (kartın altında kırmızı):

- "Bildirim izni verilmedi. Tarayıcının site ayarlarından izin verip tekrar dene."
- "Uygulama bileşeni yüklenemedi. Sayfayı yenileyip tekrar dene." (sayfanın arka plan bileşeni 8 saniyede hazır olmadıysa)
- "Bu tarayıcının bildirim adresi tanınmadı." · "Bu tarayıcının bildirim anahtarı geçersiz." ·
  "Çok sık denedin. Biraz sonra tekrar dene." (saatte 20'den sık) ·
  "Bu bildirim adresi başka bir abonelikte kayıtlı. Bildirimleri kapatıp yeniden aç."

### Öğrenci ve veli — Servis sayfasındaki öneri

Servis sayfasında, tarayıcı destekliyorsa, izin engellenmemişse ve bu cihazda abonelik yoksa üstte **"Servis yaklaşınca haber al"**
kartı çıkar: "Telefon bildirimlerini açarsan uygulama kapalıyken de bildirim gelir." ve **"Bildirimleri aç"**. Basınca yukarıdaki
2–3. adımlar olur. Abonelik açıldıktan sonra kart kaybolmaz, düğme "Açılıyor..." kalır; sayfa yenilenince gider (bilinen açık).

### Yetişkin hesabı (veli, öğretmen, müdür, çalışan)

Abonelik portala değil **kişiye** aittir: bir kez açarsın, bütün portallarına (öğretmenlik, müdürlük, veliliğin) gelen bildirimler
aynı telefona düşer. Portal değiştirmek aboneliği değiştirmez. Öğrenci ve servisçinin hesabı tek olduğu için abonelik o hesabındır.

### Android uygulaması (bugünkü)

1. Eğitim Evi uygulamasına giriş yap. Uygulama sunucudan yalnız bildirim sormaya yarayan bir **cihaz anahtarı** alır (hesabına
   giriş vermez).
2. Uygulama yeni bildirimleri kendisi sorar (Google'ın bildirim servisi kullanılmaz): 15 dakikada bir; servisle ilgili hesapta
   servis saatlerinde dakikada bir.
3. İlk kurulumda eski bildirimler gelmez (telefon kurulunca geçmiş bildirimler yağmasın); sonra her soruşta en çok 20 yeni ve
   **okunmamış** bildirim gelir. Metin ve dokununca açılacak yer tarayıcıdaki telefon bildirimiyle aynıdır.
4. Aydınlatma metni güncellendiyse uygulama "Aydınlatma metni güncellendi. Uygulamada onayladıktan sonra bildirimler yeniden gelir."
   alır ve anahtarı unutur; onaylayınca bildirimler yeniden gelir. Hesap kullanılamıyorsa "Hesap artık kullanılamıyor."

### iPhone

App Store uygulaması yok. Safari'de Eğitim Evi'ni aç, **Paylaş → Ana Ekrana Ekle**; ana ekrandaki simgeden açıp Ayarlar'dan
"Bildirimleri aç" de (iOS 16.4 ve üstü). Safari sekmesinin içinden telefon bildirimi açılmaz.

### Tasarımda (Tasarım 1 önizlemesi ve tanımlar)

- **Sayfanın başında izin şeridi** (tahta hesabı hariç herkes): tarayıcıda izin henüz sorulmamışsa sayfanın en üstünde
  **"Bildirimlere izin ver"** — "Yeni ödev, mesaj ve sınav sonucu geldiğinde bu cihazda bildirim alırsın." ve iki düğme:
  - **"İzin ver"**: önce kısa ileti 'Tarayıcının açtığı küçük pencereden "İzin ver"i seç.'; sonra sonuca göre "Bildirimlere izin
    verildi; bu cihazda bildirim alacaksın." / "Bildirim izni engellendi. Açmak için tarayıcının site ayarlarından izin ver." /
    "İzin verilmedi; istediğin zaman Hesap ayarları → Bildirimler'den açabilirsin."; tarayıcı desteklemiyorsa "Bu tarayıcı
    bildirimleri desteklemiyor; telefonda Eğitim Evi uygulamasını kurabilirsin.";
  - **"Şimdi değil"**: şerit kapanır, bu tarayıcıda bir daha çıkmaz; ileti "İstediğin zaman Hesap ayarları → Bildirimler'den izin
    verebilirsin."
  Tanımdaki karar: bildirim izni vermemiş kişiye bir kez "Anında haber almak için bildirimlere izin ver" denir.
- **Hesap ayarları → Bildirimler** ("telefon ve e-posta"; profil menüsünden açılır):
  - **"Bu cihazda bildirim"**: "İzin verildi" (Bu cihazda yeni ödev, mesaj ve sınav sonucu bildirimi alırsın) · "Engellendi" (Açmak
    için tarayıcının site ayarlarından bildirimlere izin ver) · "Henüz izin verilmedi" (İzin verirsen bu cihazda bildirim alırsın) ve
    **"İzin ver"** düğmesi · "Bu tarayıcı desteklemiyor" (Telefonda Eğitim Evi uygulamasını kurarak bildirim alabilirsin);
  - **"Telefon bildirimleri"**: "Eğitim Evi uygulamasında açık" — "ödev, mesaj, sınav sonucu, devamsızlık" ve açma/kapama anahtarı;
  - **"E-posta bildirimleri"**: "Yalnız önemli olanlar" — "şifre değişikliği, okul duyuruları"; anahtar kapalı gelir
  ([Bildirim ayarları](../ayarlar/bildirim-ayarlari.md)).
- **Ana sayfada kurulum kartı**: "Eğitim Evi'ni telefonuna kur" — "Bildirimler anında gelir; uygulamayı Android, iOS ve bilgisayar
  için indirebilirsin." ve **"Uygulamayı indir"**; sağdaki "×" ile bir daha gösterilmez
  ([Telefonuna kur kartı](../uygulama/telefonuna-kur-karti.md)).
- **"Önemli" bildirimler** (3 Ekim kararı): "Önemli" etiketli mesaj ya da duyuru telefonda ayrı, sesli bir bildirim kanalından
  ("Önemli duyurular") gelir; normal bildirimleri sessize alsan da bu kanal ayrıdır ([Önemli etiketi](../mesaj/onemli-etiketi.md)).
- **Kurum adı**: birden çok kurumda portalın varsa bildirimin başında kurum adı ("Dershane B · Yeni ödev") ([Kurum adı](kurum-adi.md)).
- **Yeni cihaz uyarısı**: daha önce görülmemiş bir cihazdan girişte e-posta ve bildirim
  ([Yeni cihaz uyarısı](../giris-hesap/yeni-cihaz-uyarisi.md)).

## Kurallar ve sınırlar

- **Kim kullanır:** giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, sistem yöneticisi; rolsüz yetişkin de).
  Tasarımda destek ve eğitmen hesapları da; tahta hesabına bildirim gelmez.
- **Cihaz sayısı:** kişi başına en çok 5 tarayıcı aboneliği; altıncı açılınca en eskisi silinir. Android uygulamasında da hesap başına
  en çok 5 cihaz anahtarı.
- **Hız sınırı:** kişi başına dakikada en çok 20 telefon bildirimi (toplu duyuru yağmuru olmasın). Fazlası telefona gitmez ama zile
  yine yazılır. Abonelik açmayı saatte en çok 20 kez deneyebilirsin.
- **Gizlilik:** bildirim içeriği telefonunun anahtarıyla şifrelenir; aradaki bildirim servisi (Google, Apple, Mozilla, Microsoft)
  okuyamaz. Sunucu yalnız bilinen bu servislerin adreslerine gönderir. Android uygulamasında araya başka şirket girmez.
- **Çıkış:** çıkış yapınca bu cihazın aboneliği sunucudan ve tarayıcıdan silinir (çıkış en çok 3 saniye bekler, hiçbir hata çıkışı
  durdurmaz): aynı cihaza başka biri girerse senin bildirimlerin ona gelmez. Çıkış yapmadan kapanmış ortak bir cihazda, sonraki
  açılışta abonelik başka hesaba aitse tarayıcıda bırakılır ([Çıkış yap](../giris-hesap/cikis-yap.md)).
- **Bekleme süresi:** telefon kapalıysa bildirim servisi bildirimi 1 gün bekletir; daha uzun kapalı kalırsa o bildirim telefona
  gelmez (zilde durur). Android uygulamasında iki soruş arasında 20'den fazla bildirim biriktiyse eskileri telefona gelmez.
- **Okundu:** Android uygulaması yalnız okunmamışları getirir; zili sitede açıp hepsini okundu saydıysan uygulamanın henüz almadıkları
  telefona düşmez ([Okundu sayma](okundu-sayma.md)).
- **Bozulan abonelik:** telefon aboneliği geçersiz olduysa (bildirim servisi "yok" derse) sunucu onu siler; yeniden açman gerekir.
  Sunucunun bildirim anahtarı kaybolursa herkes yeniden açmalıdır (sunucunun yedeklenecek dosyası).
- **Güvenli bağlantı:** yalnız https (ya da geliştirmede localhost) üzerinde çalışır.
- **Bilinen açıklar (kod okumasına göre):** sunucu aboneliği reddederse tarayıcıdaki abonelik kalır; Ayarlar "Bu cihazda açık" der
  ama bildirim gelmez. Eğitim Evi bir sonraki açılışında sunucuya bu aboneliğin kimin olduğunu sorar, kayıtlı olmadığını görünce
  tarayıcıdaki aboneliği bırakır; kart yeniden "Bu cihazda kapalı" der, yeniden açman gerekir. Servis sayfasındaki öneride
  başarıdan sonra düğme "Açılıyor..." kalır.
- **Kişisel veri:** abonelik (tarayıcının bildirim adresi ve şifreleme anahtarı) çıkışta ya da kapatınca silinir; aydınlatma metninde
  yazılı ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim paneli](bildirim-paneli.md) · [Okundu sayma](okundu-sayma.md) · [Zilin tazelenmesi](yoklama-araligi.md) ·
[Bildirim türleri ve metinleri](bildirim-metinleri.md) · [Kurum adı](kurum-adi.md) · [Saklama ve silinme](saklama-ve-silinme.md).

**İlgili:** [Bildirim ayarları](../ayarlar/bildirim-ayarlari.md) · [Android uygulaması](../uygulama/android-uygulamasi.md) ·
[Tarayıcıdan uygulama olarak yükleme](../uygulama/tarayicidan-yukleme.md) · [Telefonuna kur kartı](../uygulama/telefonuna-kur-karti.md) ·
[Servis yaklaşıyor](../servis/yaklasma-bildirimi.md) · [Önemli etiketi](../mesaj/onemli-etiketi.md) · [Çıkış yap](../giris-hesap/cikis-yap.md) ·
[Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md) — `bildirimDestegi`, `bildirimAc`
  (izin, `/api/push/anahtar`, abonelik, `/api/push/abone`), `bildirimKapat`, `bildirimAboneligiBirak` (çıkış), `bildirimEsitle`
  (açılış), `bildirimKartiCiz`, `EYLEMLER['bildirim-ac']`, `EYLEMLER['bildirim-kapat']`;
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar'daki "Telefon bildirimleri" kartı);
  [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) (`servisBildirimOnerisi`);
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (açılışta eşitleme, çıkışta bırakma, `?k=` ile portala
  geçiş); [public/sw.md](../../public/sw.md) (telefona düşen bildirimi gösterme ve dokununca açma);
  [public/js/parcalar/04-pwa.md](../../public/js/parcalar/04-pwa.md) (arka plan bileşeninin kaydı).
- Sunucu: [sunucu/bolumler/push.md](../../sunucu/bolumler/push.md) (`/api/push/anahtar`, `abone`, `durum`, `iptal`; kişi başına 5,
  saatte 20); [sunucu/push.md](../../sunucu/push.md) (şifreleme, gönderim kuyruğu, dakikada 20, `bildirimAdresi`);
  [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (Android uygulamasının `GET /api/cihaz/bildirimler`).
- Depo: [sunucu/veri/depo/push.md](../../sunucu/veri/depo/push.md) (abonelikler, yetişkin hesabına bağlanması),
  [sunucu/veri/depo/cihazlar.md](../../sunucu/veri/depo/cihazlar.md) (imleç, okunmamış yeni bildirimler).
- Testler: [testler/test-push.md](../../testler/test-push.md), [testler/test-yetiskin.md](../../testler/test-yetiskin.md) (abonelik
  yetişkin hesabının), [testler/test-servis-konum.md](../../testler/test-servis-konum.md) (abonelik uçları, 5 cihaz, yaklaşma).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Telefon bildirimi (Web Push)", "Eğitim Evi telefon
  uygulaması").
- Tasarım: Tasarım 1 önizlemesi, herkes-a paketi (izin şeridi, Hesap ayarları → Bildirimler, uygulama kartı).

## Sık sorulanlar

- **Telefon bildirimleri gelmiyor.** Önce Eğitim Evi'nde bildirimleri açtığından ve tarayıcıya izin verdiğinden emin ol. Telefonun
  ayarlarında tarayıcının (ya da uygulamanın) bildirimleri kapalı olabilir. iPhone'da bildirim yalnızca ana ekrana eklenmiş Eğitim
  Evi'nden açılınca çalışır. Bildirimler güvenli (https) bağlantı ister.
- **"Bildirimleri aç" düğmesi yok.** Tarayıcıda bu site için bildirim engellenmiştir; tarayıcının site ayarlarından izin ver.
- **Telefonumu başkasına verdim, bildirimlerim ona gelir mi?** Çıkış yaptıysan hayır: çıkışta abonelik silinir.
- **Çok fazla bildirim geliyor.** Telefona dakikada en çok 20 bildirim gider. Tasarımda Hesap ayarları → Bildirimler'den telefon
  bildirimlerini kapatabilirsin; okulun sessiz saatleri öğrenci ve veli mesajlarını sabaha bırakır.

## Sırada

- Sistem (iş 4): yeni cihaz uyarısı ve açık oturumlar.
- Mesaj etiketleri (iş 28) ve 3 Ekim kararı: "Önemli duyurular" ayrı kanal.
- Tek kişi tek hesap + portallar öğrencide de (iş 19): bildirimde kurum adı.
- Android yerel uygulama (iş 10): uygulamanın Bildirimler sayfası, bildirim kanalı ve kendini güncelleme.
- Mesaj ayarları … (iş 8): kişinin bildirim tercihleri ve sessiz saatler.
- Çok dil (iş 22): kart metinleri ve bildirimler dil kataloğundan.
