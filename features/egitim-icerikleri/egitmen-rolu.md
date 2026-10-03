# Eğitim içerikleri · Eğitmen rolü (Eğitmen yap)

**Durum:** Tasarlandı — henüz kodda yok

Video yalnız eğitmen rolündeki yetişkin hesabı koyar; rolü yönetici ya da destek ekibi kişinin sayfasındaki "Eğitmen yap" ile verir ve
alır; ayrı başvuru ya da ön onay kuyruğu yoktur.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "biri video atmak için eğitmen rolüne sahip olmalı". 28 Eylül'deki ilk istekte "yetişkin hesaplarına
yetki verilerek yapılabilir, bize application yaparlar" deniyordu; 29 Eylül kararıyla başvuru formu ve onay kuyruğu KALKTI (kullanıcının
"atama" ilkesi). Kim video koyabileceği tek bir rolle belli olur.

## Nereden açılır

- **Yönetici ve destek:** kişinin sayfası `egitimevi.org/users/<ad>` → **"Eğitmen yap"** ([Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md)).
- **Eğitmen olmak isteyen kişi:** destek talebiyle ister ([Destek sayfası](../destek/destek-sayfasi.md)).
- **Eğitmen:** rolü verilince hesabına **"Eğitmen · eğitim içerikleri"** oturumu eklenir; oturum ekranında eğitmen görseliyle durur
  ([Eğitmen paneli](egitmen-paneli.md)).

## Adım adım

### Yönetici ve destek

1. Kişiyi bul, sayfasını aç (`/users/<ad>`).
2. **"Eğitmen yap"**a bas. Kişinin kullanıcı adı yalnız rakamdan oluşuyorsa düğme reddeder: **"Önce harf içeren bir kullanıcı adı
   seçmeli"**.
3. Rol verilir; kişinin sayfasında **"Site rolü: Eğitmen (eğitim içerikleri)"** satırı görünür (Tasarım 1'deki kişi sayfasında bu
   satır var).
4. Rolü almak için aynı yerden geri alınır.

**Tasarımda (Tasarım 1 önizlemesi):** kişi sayfasında "Site rolü" kartı var ama **"Eğitmen yap"** düğmesi yok; düğme tanımda.

### Eğitmen

1. Rol verildikten sonra hesabına girince **"Eğitmen · eğitim içerikleri"** oturumu çıkar.
2. İki adımlı giriş eğitmende zorunlu: ayarlarda "Açık — eğitmenlerde zorunlu" yazar ([Şifre ve güvenlik](../ayarlar/guvenlik.md)).
3. Video yükler, listeler açar, istatistiklerine bakar ([Eğitmen paneli](egitmen-paneli.md)).

**Tasarımda (Tasarım 1 önizlemesi; tanımda YOK):** Hesap ayarlarında eğitmene özel iki satır var ([Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)):

- **"Kanal bağlantısı"** → pencere, **"Kanal adresi"** (yer tutucu "youtube.com/@kanalin"), not "Videolarını YouTube'dan eklerken bu
  kanal kullanılır. Bağlantı değişince eski videoların yerinde kalır.", düğme **"Bağla"**. Biçim yanlışsa **"Kanal adresini
  youtube.com/@ad biçiminde yaz."**; bağlanınca **"Kanal bağlandı: youtube.com/@…."**
- **"Kısa tanıtım"** → pencere, **"Tanıtım"** kutusu (10–160 karakter, sayaçlı), not "Videolarının altında ve eğitmen sayfanda
  görünür.", düğme **"Kaydet"**. Kısaysa **"En az 10 karakter yaz."**; kaydedince **"Tanıtımın güncellendi."**

Tanıma göre kanal her videonun kendi YouTube bilgisinden gelir ([YouTube bağlantısı](youtube-baglantisi.md)); bu iki ayarın kalıp
kalmayacağı kullanıcıya sorulmalı (aşağıdaki çelişki notu).

## Kurallar ve sınırlar

- **Site geneli rol** (destek gibi), okula bağlı değil. Bir kişi aynı anda eğitmen + çevirmen + destek olabilir; yönetici de bunları
  taşıyabilir (29 Eylül kararı; ayrı "site rolleri" tablosu).
- **Kim verir:** yalnız yönetici ve destek. Başvuru formu ve onay kuyruğu YOK.
- **Ön onay yok:** eğitmenin videosu hemen yayına girer; denetim "Bildir" ve kaldırmayla ([Videoyu bildir](bildir.md)).
- **Harfli kullanıcı adı şart:** yalnız rakamdan oluşan ad (öğrencinin T.C.'si gibi) hiçbir yerde gösterilmediği için eğitmen olamaz
  ("Paylaşan" satırında görünecek bir ad gerekir).
- **Görünen ad:** videolarda "Paylaşan: @kullanıcı adı" (tıklanmaz) ve YouTube videosunda "Kanal: <kanal adı>" (tıklanır).
- **İki adımlı giriş zorunlu;** okul cihazı ayrıcalığı (öneri) panel rollerine uygulanmaz.
- **Rol alınınca:** videolar yayında kalır (öneri; yönetici isterse kaldırır). 4 liste hakkını aşan listeler silinmez, salt okunur
  kalır; yenisi açılamaz. `/panel/egitmen` artık 404.
- **Hesap silinince** ("eğitmen silinince video kaldırılsın, silinsin", 29 Eylül kararı): videoları (Eğitim Evi'ndekiler dosyalarıyla,
  YouTube bağlantıları kayıtlarıyla), serileri, beğeni ve izlenme sayıları silinir; başkalarının listelerinde "Bu video kaldırıldı"
  satırı kalır.
- **Disk:** eğitmen başına disk sınırı site ayarıdır (varsayılan 5 GB); eğitim videoları günlük yedeğe girmez (ayrı ayar)
  ([Sınırlar ve site ayarları](sinirlar-ve-ayarlar.md)).

**Çelişki notu:** Tasarım 1'deki "Kısa tanıtım" notu "eğitmen sayfanda görünür" diyor; tanımda eğitmenin bir sayfası yok ve kullanıcı
28 Eylül'de "profile tıklanmaz" dedi. Video penceresinde de tanıtım görünmüyor. "Kanal bağlantısı" ayarı da tanımla çelişiyor:
başkasının YouTube videosunu bağlayan eğitmende "asıl kanal" yerine kendi kanalı görünür. İkisinin kalıp kalmayacağı kullanıcıya
sorulmalı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Eğitmen paneli](egitmen-paneli.md) — rolün açtığı panel.
- [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md) — eğitmenin sorumluluğu.
- [Sınırlar ve site ayarları](sinirlar-ve-ayarlar.md) — disk ve liste hakkı.
- [Bildirilenler](bildirilenler.md) — yönetimin kaldırma yetkisi.

**İlgili:**

- [Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md), [Paneller](../yonetim/paneller.md).
- [Destek ekibi ve destek rolü](../destek/destek-ekibi.md), [Çevirmen rolü](../dil/cevirmen-rolu.md) — öbür site rolleri.
- [Kullanıcı adı](../giris-hesap/kullanici-adi.md) — harfli ad kuralı.
- [Hesabımı sil](../ayarlar/hesabimi-sil.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Yöneticinin uçları ve kişi bulma: [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md).
- Yönetim çerezi ve panel kapısı: [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md).
- Hesap tablosu: [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md); hesap silme:
  [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md).
- İki adımlı giriş: [sunucu/guvenlik.md](../../sunucu/guvenlik.md).

## Sık sorulanlar

- **Nasıl eğitmen olurum?** Destek talebi aç; yönetici ya da destek ekibi sana rolü verir.
- **Videom yayından önce onaylanıyor mu?** Hayır; hemen yayına girer. Uygunsuzsa bildirimle kaldırılır.
- **Eğitmenliğim alınırsa videolarım ne olur?** Yayında kalır (öneri); hesabını silersen silinir.
- **Okulumda öğretmenim; eğitmen olmak için ayrı hesap gerekir mi?** Hayır; aynı hesabına eğitmen oturumu eklenir.

## Sırada

- Eğitim içerikleri (iş 17) ve paneller işi (iş 5): "Eğitmen yap", site rolleri tablosu, `/panel/egitmen` kapısı.
- "Kısa tanıtım"ın nerede görüneceği ve hesap düzeyindeki "Kanal bağlantısı"nın kalıp kalmayacağı kullanıcıya sorulacak.
