# Giriş ve hesap · Hatalı giriş ve kilit

**Durum:** Kodda var.

Yanlış şifre ya da olmayan hesap denemelerinin sayılması: kalan hak uyarısı, 5 hatada 15 dakikalık kilit, hesaba her yerden 20 hatada tanımadığı bağlantılara kilit ve okul ağına göre ayarlı bağlantı sınırları.

## Ne işe yarar

Bir okul portalında iki şey aynı anda sağlanmalı: 300 öğrenci okulun ağından (tek IP'den) aynı dakikada rahatça girsin; ama
şifre tarayan biri, bir öğretmeni dışarıda bırakmak isteyen biri ya da sunucuyu istek yağmuruna tutan biri dursun. Bu yüzden
asıl koruma **hesap başınadır**; bağlantı (IP) sınırları okul ölçeğinde bol tutulur. Kişi kalan hakkını görür, kilitlenirse
ne kadar bekleyeceğini öğrenir; hesabı başkaları kilitlediyse "Şifremi unuttum" ile yeni şifre koyup hemen girer.

## Nereden açılır

Ayrı bir ekran yok; [Giriş](giris.md) kartında ve [İki adımlı giriş](iki-adimli-giris.md)'in kod ekranında iletiler olarak
görünür.

## Adım adım

### Herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, yönetici)

1. Şifreni yanlış yazarsın: şifre kutusunun altında "Şifre yanlış." ve yanında **"Şifremi unuttum"**; robot sorusu açılır
   ([Robot doğrulaması](robot-dogrulamasi.md)).
2. Yanlışlar sürerse son üç hakta ileti uzar: "Şifre yanlış. 3 deneme hakkın kaldı.", "… 2 deneme hakkın kaldı.", "… 1 deneme
   hakkın kaldı."
3. Beşinci yanlışta: "Şifre yanlış. Giriş 15 dakika kilitlendi."
4. Kilitliyken doğru şifreyi yazsan da girilmez; kartın üstünde: "Çok fazla hatalı deneme yapıldı. 14 dakika sonra tekrar dene
   ya da "Şifremi unuttum" ile yeni şifre al." (kalan süre 90 saniyenin altındaysa saniye: "45 saniye sonra…").
5. İleti "Şifremi unuttum" yolunu da söyler; ama bugünkü kodda yeni şifre **yalnız hesabın her yerden sayılan kilidini**
   (aşağıda "20 hata") kaldırır ve bulunduğun bağlantıyı tanıdık yapar. Aynı bağlantıdan 5 yanlışla gelen 15 dakikalık kilit,
   şifreyi yenilesen de süresi dolana kadar sürer (bilinen açık; aşağıda Kurallar).
   - E-postan varsa [Şifremi unuttum](sifremi-unuttum.md) ile yeni şifre koy.
   - Öğrenci ya da servisçiysen okul yönetimi şifreni yenilesin ([Şifre işlemleri](../hesaplar/sifre-islemleri.md)).
   - Aynı bağlantıdan kilitlendiysen süre dolana kadar bekle (ileti kalan süreyi söyler).

Olmayan bir hesabı denemek de sayılır ("Bu kullanıcı adıyla kayıtlı bir hesap yok." gibi) ve aynı kilide gider.

### Kod ekranında (iki adımlı giriş)

- Her kodun kendi 5 deneme hakkı var: "Kod hatalı. Kalan hakkın: 4" … "Kalan hakkın: 0"; sonraki denemede "Çok fazla hatalı
  kod denemesi. Baştan giriş yap" ve giriş kartına dönülür.
- Aynı bağlantıdan 5 dakikada 25 yanlış kod: "Çok fazla yanlış kod denendi. Biraz bekleyip tekrar dene."

## Kurallar ve sınırlar

Hata sayaçları 15 dakikalık penceredir (bağlantının toplam giriş isteği sayacı ve yanlış kod sayacı 5 dakikalık); hepsi
sunucunun belleğinde durur (sunucu yeniden başlayınca sıfırlanır).

- **Hesap + bağlantı**: aynı hesaba aynı bağlantıdan 5 hata → o bağlantıdan 15 dakika kilit. İlk hatadan sonra o hesaba o
  bağlantıdan her girişte robot sorusu istenir.
- **Kilidin anahtarı hesabın kendisidir**: e-postayla ve kullanıcı adıyla sırayla deneyerek 5 hatalık hak ikiye katlanamaz.
  Hesap bulunamazsa anahtar "okul + yazılan kimlik"tir.
- **Hesap, her bağlantıdan**: 3 hatada her yerden robot sorusu; 20 hatada hesap **tanımadığı** bağlantılara 15 dakika kilitlenir.
  Tanıdık bağlantı = hesabın son 30 günde doğru şifreyle girdiği bağlantı; sahibi okulda ya da evinde girmeye devam eder. Böylece
  kullanıcı adını bilen biri başka yerlerden yanlış deneyerek bir öğretmeni dışarıda bırakamaz.
- **Bağlantı (IP)**: 15 dakikada 50 hatadan sonra o bağlantıdan girişte herkese robot sorusu; bağlantının durduğu hata sayısı
  50 + 2 × (o bağlantıdan son 30 günde girmiş okul hesabı sayısı), en çok 300 (okulun ağı). Ayrıca 5 dakikada en çok 1200
  giriş isteği. Aşılırsa: "Bu bağlantıdan çok fazla giriş denemesi yapıldı. Biraz bekleyip tekrar dene."
- **Bağlantı sınırını yalnız okul hesapları büyütür** (öğrenci, servisçi); herkesin kendi açabildiği yetişkin hesapları
  büyütmez, yoksa biri kendi açtığı hesaplarla girip şifre taramasını hızlandırırdı.
- **Doğru şifre** hesabın sayaçlarını sıfırlar (bağlantınınkini değil) ve bağlantıyı tanıdık yapar. Okulda aynı adla bir öğrenci
  varken yetişkin hesabının şifresiyle girildiyse öğrenci hesabının sayacı sıfırlanmaz (biri öbür hesabın kilidini
  sıfırlayamasın).
- **Yeni şifre neyi kaldırır**: "Şifremi unuttum" ile şifre yenilenince (ya da okul yönetimi bir öğrencinin şifresini tek tek
  ya da toplu dağıtımla yenileyince) hesabın her yerden sayılan hata sayacı silinir (20 hatalık kilit kalkar); "Şifremi
  unuttum"da ayrıca şifreyi yenileyen bağlantı tanıdık olur. Böylece başkaları hesabı kilitlediyse sahibi hemen girer. **Bilinen açık** (kod değiştirilmedi): hesap + bağlantı
  sayacı (5 hata) silinmez; kişi kendi bağlantısından 5 kez yanlış girip kilitlendiyse şifreyi yenilese de 15 dakika dolana kadar
  o bağlantıdan giremez, oysa kilit iletisi "… ya da "Şifremi unuttum" ile yeni şifre al." der.
- **Boş alan sayılmaz**: boş kullanıcı adı ya da boş şifre yalnız kutuyu gösterir.
- **Başarısız girişler okulun işlem kaydına yazılmaz** (adı listede durur ama bugün hiçbir iş yazmaz)
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Hesap yok / şifre yanlış ayrı söylenir**: bilinçli karar; tahmine karşı koruma bu sayaçlar ve robot sorusudur.
- Sayaçlar tek süreçte tutulur; sunucu birden çok süreçle çalıştırılırsa sınırlar süreç başına olur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Giriş](giris.md) — iletilerin göründüğü kart.
- [Robot doğrulaması](robot-dogrulamasi.md) — hatadan sonra açılan soru.
- [İki adımlı giriş](iki-adimli-giris.md) — kod denemeleri.
- [Şifremi unuttum](sifremi-unuttum.md) — kilidi hemen kaldırmanın yolu.
- [Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md) — tanımadık cihazdan girişte haber (tasarım).

**İlgili:**

- [Şifre işlemleri](../hesaplar/sifre-islemleri.md) — okulun şifre yenilemesi kilidi kaldırır.
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — başarısız girişler yazılmaz.

## Kod tarafı

- Sunucu: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `GIRIS_SINIR`, `KILIT_ESIGI`, `girisIpEngeli`, `girisKilitSn`,
  `girisSoruLazim`, `girisHatasi`, `girisBasarili`, `girisTanidik`, `kalanDeneme`, `ipHataSiniri`;
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/login` (kilit anahtarı, iletiler, yedek hesap),
  `POST /api/login/dogrula` (yanlış kod sınırı), `POST /api/sifre-yenile` (kilidi kaldırma).
- Testler: [testler/test-okul-agi.md](../../testler/test-okul-agi.md) (300 öğrenci tek IP; tek hesaba şifre denemesi; tanıdık
  bağlantı; yeni şifrenin kilidi kaldırması; kendi açtığı yetişkin hesaplarının sınırı büyütmemesi),
  [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (kalan hak, beşinci yanlışta kilit, öbür kimlikle de kilit),
  [testler/guvenlik-test.md](../../testler/guvenlik-test.md) (kilitliyken doğru şifre de geçmez).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İki adımlı giriş (2FA)", "Yük ve saldırı koruması").

## Sık sorulanlar

- **Hesabım kilitlendi, ne yapayım?** İletide yazan süre kadar bekle. Başka yerlerden yapılan denemeler yüzünden kilitlendiysen
  "Şifremi unuttum" ile yeni şifre koymak kilidi hemen kaldırır (öğrenci ya da servisçiysen okul yönetimi şifreni yeniler);
  kendi bağlantından 5 kez yanlış girdiysen bugün 15 dakikanın dolmasını beklemen gerekir.
- **Ben hiç yanlış girmedim ama robot sorusu çıkıyor.** Aynı ağdan (ör. okulun ağı) başkaları çok hatalı deneme yapmış
  olabilir; soruyu cevaplaman yeter.
- **Biri benim hesabımı kilitleyebilir mi?** Başka yerlerden yapılan yanlış denemeler hesabını yalnız tanımadığı bağlantılara
  kilitler; son 30 günde girdiğin yerden girmeye devam edersin.

## Sırada

- Güvenlik denetimi: IPv6 adreslerinin /64 ağı olarak sayılması (bugün her IPv6 adresi ayrı sayılıyor); belgelemede bulunan
  "yeni şifre aynı bağlantının 5 hatalık kilidini kaldırmıyor, ileti ise kaldırır gibi konuşuyor" bulgusu.
- Sistem: yeni cihazdan girişte e-posta ve bildirim ([Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md)).
