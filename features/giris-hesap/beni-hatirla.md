# Giriş ve hesap · Beni hatırla

**Durum:** Kodda var; tasarımda ek olarak giriş kartının üstünde "Bu cihazdaki oturumların" listesi ve "Bilgilerimi bu cihaza kaydetme" seçilince tarayıcının şifreyi kaydetmeyi önermemesi.

Girişin bu cihazda ne kadar süreceğini seçtiğin iki kutu: "Beni hatırla" (tarayıcıyı kapatıp açsan da girişin sürer) ve "Bilgilerimi bu cihaza kaydetme" (oturum hiçbir yere yazılmaz).

## Ne işe yarar

Evdeki kendi bilgisayarında her seferinde yeniden girmek istemezsin; okulun ortak bilgisayarında ise hiçbir iz bırakmamak
istersin. Kullanıcı 29 Ağustos'ta istedi: "beni hatırla butonu checkbox ve bilgilerimi kaydetme, tamamen hiçbir şeyini
kaydetmez, Google'a kaydettirmez". İki kutu da bugün kodda var; Google'a (tarayıcının şifre yöneticisine) kaydettirmeme kısmı
tasarımda tamamlanır.

## Nereden açılır

[Giriş](giris.md) kartında, robot sorusunun altında iki kutu: **"Beni hatırla"** (başta işaretli) ve **"Bilgilerimi bu cihaza
kaydetme"**. Okulun sayfasındaki kartta da aynı.

## Adım adım

### Herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, yönetici)

1. Kendi cihazındaysan **"Beni hatırla"** işaretli kalsın: tarayıcıyı kapatıp açsan da girişin sürer (en çok 7 gün).
2. İkisini de kaldırırsan sekmeyi kapatınca çıkmış olursun; aynı sekmede sayfayı yenilemek seni çıkarmaz.
3. Ortak bir bilgisayardaysan **"Bilgilerimi bu cihaza kaydetme"**yi işaretle: oturum yalnız bellekte durur; sayfayı yenilesen
   bile yeniden girersin.
4. İki kutu birbirini dışlar: birini işaretleyince öbürü kalkar.
5. Seçimin bu sekmedeki oturuma aittir; portal değiştirince (Portallarım) yeni oturum da aynı biçimde saklanır.
6. İşin bitince [Çıkış yap](cikis-yap.md).

"Kullanıcı adı | E-posta" seçimin de bu tarayıcıda hatırlanır (yalnız seçim; adın ya da adresin değil).

### Yönetici

"Bilgilerimi bu cihaza kaydetme" seçili girişte yönetim adresine tam sayfa geçilirken oturum kaybolmasın diye anahtar bir an bu
sekmenin deposuna bırakılır ve yeni sayfa açılır açılmaz silinir. Yönetim sayfasını yenilersen yeniden girersin.

### Tahta

Tasarlandı — henüz kodda yok. "Beni hatırla" tahtada kullanılabilir; tahta oturumu 30 gündür ve kullanıldıkça uzar
([Tahta girişi](../tahta/tahta-girisi.md)).

Tasarımda (Tasarım 1 önizlemesi):

1. Kartın en üstünde **"Bu cihazdaki oturumların"** başlığı ve "Birine dokun ve gir" alt yazısı; altında bu cihazda "Beni
   hatırla" ile girilmiş hesaplar: her satırda renkli baş harf, ad soyad, "@kullaniciadi · <portal>" (portalı yoksa "Henüz
   portalı yok") ve sağda **"Gir"**. Fazlası "Bu cihazdaki öbür hesaplar (N)" başlıklı açılır kutuda. Altında "ya da hesabınla
   gir" ayracı, sonra normal giriş formu. Liste boşsa bu bölüm görünmez.
2. Okulun sayfasında listede yalnız o okulda portalı olan hesaplar görünür.
3. "Beni hatırla" ile girilen hesap listeye eklenir; **"Bilgilerimi bu cihaza kaydetme"** ile girilen eklenmez (varsa çıkarılır).
4. "Bilgilerimi bu cihaza kaydetme" işaretlenince altında not çıkar: "Bu cihaza hiçbir şey kaydedilmez: tarayıcı şifreni
   kaydetmeyi önermez, giriş yapınca kutular boşalır ve hesabın bu cihazın oturum listesine eklenmez." Tarayıcının kutuları
   doldurması ve şifre kaydetme önerisi kapatılır.
5. Önizlemede listedeki bir satıra dokununca doğrudan girilir. Liste, kullanıcının 1 Ekim'deki "oturumlarımda öğrenci öğretmen
   hazır gelsin" isteğinden doğdu; bu istek önizlemede hızlı giriş için de okunabilir. Gerçek sitede böyle bir liste olacak mı,
   olacaksa nasıl güvenceye alınacağı (hatırlanan oturumun süresi dolmuşsa şifre sorulması gibi) tanımda yazılı değil;
   kodlanmadan önce kullanıcıya sorulacak.

## Kurallar ve sınırlar

- **Üç saklama biçimi** (sekme başına):
  - "Beni hatırla": anahtar tarayıcının kalıcı deposunda (bütün sekmeler görür) ve bu sekmede;
  - ikisi de değil: yalnız bu sekmenin deposunda (sekme kapanınca gider);
  - "Bilgilerimi bu cihaza kaydetme": hiçbir yere yazılmaz, yalnız bellekte.
- **Her sekme kendi oturumunu önce okur**: aynı tarayıcıda bir sekmede müdür, ötekinde veli açık kalabilir. Bir sekmede "Beni
  hatırla" ile girilen hesap, başka sekmedeki girişle ezilmez; çıkışta hatırlanan anahtar yalnız o hesabınsa silinir.
- **Oturumun ömrü sunucuda**: tarayıcıda 7 gün, Android uygulamasında 30 gün; ikisi de mutlaktır (kullandıkça uzamaz).
  Portal değiştirmek süreyi uzatmaz.
- **Şifre değişince ya da sıfırlanınca** bu oturum dışındaki bütün oturumlar (hatırlananlar ve telefonun cihaz anahtarları dahil)
  kapanır; şifremi unuttum'da bu oturum da kapanır. Kişinin kendi e-posta değişikliği bugün oturumları kapatmaz. Tasarımda
  yönetici ya da destekçi bir kişinin e-postasını değiştirince de bütün oturumlar kapanır; kullanıcının 28 Eylül sözü: "beni
  hatırla diyenlerde çalışmaz, eski çalıntı oturum varsa diye".
- **Gizli sekmede** depo yazılamazsa sessizce bellekte kalır.
- **"Beni hatırla" başta işaretlidir**: okulun ortak bilgisayarında kutuyu kaldırmayan kişinin oturumu tarayıcı kapansa da 7 gün
  kalır. Ortak bilgisayarda "Bilgilerimi bu cihaza kaydetme"yi seç ve çık.
- **Bugün "kaydetme" tarayıcının şifre yöneticisini durdurmaz**: kutular yine "kullanıcı adı / mevcut şifre" diye işaretli
  olduğu için tarayıcı şifreyi kaydetmeyi önerebilir. Tasarım bunu kapatır.
- **Ölü bir kayıt**: son girişin saklama biçimi tarayıcıya ayrıca yazılıyor ama hiçbir yerde okunmuyor (zararsız; kod
  belgesinde not).
- Oturum anahtarı 48 hanelik rastgele değerdir; sunucuda yalnız SHA-256 özeti tutulur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Giriş](giris.md) — kutuların durduğu kart.
- [Çıkış yap](cikis-yap.md) — oturumun silinmesi.
- [Şifremi unuttum](sifremi-unuttum.md) — bütün oturumların kapanması.
- [Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md) — tanınmayan cihazdan girişte haber (tasarım).

**İlgili:**

- [Açık oturumlar](../ayarlar/acik-oturumlar.md) — hangi cihazlarda girişin açık, tek tek çıkış (tasarım).
- [Portala geçiş](../portallar/portala-gecis.md) — portal değişince saklama biçiminin korunması.
- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamanın 30 günlük oturumu.

## Kod tarafı

- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `tokenSakla`, `tokenYenile`, `tokenOku`,
  `tokenSil`, kutuların birbirini dışlaması, `girisKimlikAyarla` (kimlik türünün hatırlanması);
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) — yönetim geçişinde `ee_gecis`;
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — açılışta kayıtlı oturumun okunması.
- Sunucu: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `OTURUM_OMRU_MS`; [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md)
  — oturum tablosu, `hesabinOturumlariniKapat`; [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `oturumCevabi`.
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (şifre değişince öbür oturumun kapanması).
- Kullanıcıya dönük anlatım: sitenin SSS'si ("Beni hatırla" ile "Bilgilerimi bu cihaza kaydetme" farkı ne?).

## Sık sorulanlar

- **"Beni hatırla" ile "Bilgilerimi bu cihaza kaydetme" farkı ne?** Beni hatırla işaretliyse tarayıcıyı kapatıp açsan da girişin
  sürer. İkisi de işaretli değilse sekmeyi kapatınca çıkmış olursun. Bilgilerimi bu cihaza kaydetme ortak bilgisayarlar içindir:
  oturum hiçbir yere yazılmaz, sayfa yenilenince bile yeniden girersin. İkisi aynı anda seçilemez (sitenin SSS'si).
- **"Beni hatırla" seçtim ama bir hafta sonra yeniden giriş istedi.** Tarayıcıdaki oturum 7 gün geçerlidir; süre dolunca yeniden
  girersin.
- **Okulda girdim, çıkmayı unuttum.** Başka bir cihazdan şifreni değiştir; o bilgisayardaki oturum kapanır. Tasarımda Ayarlar →
  Açık oturumlarım'dan tek tek çıkış yapılabilir.

## Sırada

- HTML (Tasarım 1) → kod: "Bu cihazdaki oturumların" listesi ve "Bilgilerimi bu cihaza kaydetme"de tarayıcının şifre kaydetmesini
  kapatma.
- Sistem: Açık oturumlarım (cihaz, ilk/son görülme, "bu cihaz", tek tek "Çıkış yap", "Diğer bütün cihazlardan çık").
- Öneri, karar yok: okulun ortak bilgisayarı için "Bu ortak bir bilgisayar" seçeneği ("Beni hatırla" kapalı, 30 dakika
  hareketsizlikte çıkış, "Çıkmayı unutma" şeridi) — özel roller önerisiyle sunuldu, onay bekliyor.
