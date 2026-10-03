# Giriş ve hesap · İki adımlı giriş

**Durum:** Kodda var; tasarımda ek olarak altı ayrı kutulu kod ekranı ve sol üstte vazgeçme oku, öğrencinin isteğe bağlı açabilmesi (şifre değişse de açık kalır), doğrulama uygulaması kodu ve kurtarma kodu, e-posta gönderilemeyince açık ileti.

Şifreden sonra e-postana giden 6 haneli kodu yazma adımı: öğrenci dışında e-postası olan her hesapta zorunludur ve kapatılamaz.

## Ne işe yarar

Şifren çalınsa bile e-postana erişimi olmayan biri hesabına giremez. Kullanıcı 28 Ağustos'ta "sürekli açık olur, zorunlu 6
haneli" dedi; 26 Eylül'de "kimde zorunlu olsun?" sorusuna "öğrenci dışında diğer herkes de zorunlu, e-posta yetişkine zorunlu,
öğrenciye değil" diye cevap verdi. 29 Eylül'de öğrencinin de isterse açabilmesini istedi: "öğrenci e-posta ile çift doğrulama
açarsa altı haneli veya authenticator her neyse işte, o şifre değişince de işlesin".

## Nereden açılır

[Giriş](giris.md) kartında şifreyi doğru yazınca kart kendiliğinden kod ekranına geçer. Ayrı bir menü yok.

Tasarımda: öğrenci Ayarlar → Şifre ve güvenlik → "İki adımlı giriş" satırından açar ([Güvenlik](../ayarlar/guvenlik.md)).

## Adım adım

### Ekranın düzeni (bugünkü site)

1. Kilit simgesi, başlık **"Giriş kodunu gir"**.
2. Altında sunucunun cümlesi: "Giriş kodu d***z@ornek.com adresine gönderildi." (adres maskeli).
3. **"6 haneli kod"** kutusu (yer tutucu "______"; yalnız rakam, en çok 6; telefon klavyesi rakam açar, tarayıcı gelen kodu
   önerebilir).
4. **"Doğrula ve gir"** düğmesi.
5. Altta **"Kodu tekrar gönder"** (ilk 60 saniye kilitli: "Tekrar gönder (60)", "(59)"…) ve **"← Geri dön"**.

### Veli, öğretmen, çalışan, müdür, yönetici (ve e-postası olan servisçi)

1. Giriş kartında kullanıcı adını (ya da e-postanı) ve şifreni yazıp "Giriş Yap"a bas.
2. Kod ekranı açılır. E-postana şu posta gelir:
   - Konu: "Eğitim Evi giriş kodun: 482915"
   - "Merhaba <Ad Soyad>," / "Eğitim Evi giriş kodun: 482915" / "Bu kod 5 dakika geçerlidir ve yalnızca bir kez kullanılabilir."
     / "Giriş denemesi sana ait değilse şifreni değiştir." / "Eğitim Evi"
3. Kodu kutuya yaz. Altıncı rakamı yazınca kendiliğinden gönderilir (düğmeye basman gerekmez; düğme "Doğrulanıyor..." olur).
4. Kod doğruysa oturum açılır; sonra aydınlatma onayı, gerekirse kendi şifreni belirleme, en sonda portalın
   ([Giriş](giris.md)).
5. Kod yanlışsa kutu boşalır, altında: "Kod hatalı. Kalan hakkın: 4". Altı rakam değilse "Kod 6 rakamdan oluşmalı."
6. Kod gelmediyse 60 saniye bekle, **"Kodu tekrar gönder"**e bas: üstte yeşil "Yeni kod gönderildi.", açıklama "Yeni kod
   d***z@ornek.com adresine gönderildi." olur, sayaç yeniden başlar. Eski kod artık geçmez.
7. Vazgeçmek için **"← Geri dön"**: giriş kartına dönersin, şifre kutusu boşalır.

Kod ekranından kendiliğinden giriş kartına dönülen durumlar (ileti kartın üstünde kırmızı): "Kodun süresi doldu, tekrar giriş
yap", "Giriş oturumu bulunamadı, tekrar giriş yap" (sunucu bu arada yeniden başladıysa), "Çok fazla hatalı kod denemesi. Baştan
giriş yap", "Hesap bulunamadı".

Çalışan: bugün kodda ek görevli kişi öğretmen portalıyla girer, kural aynıdır. Eğitmen ve destek (tasarım) de yetişkin
hesabıdır, kod zorunludur.

### Öğrenci

Bugün kod adımı yoktur: şifren doğruysa hemen girersin (e-postan olsa bile).

Tasarımda (kullanıcının 29 Eylül kararı):

1. Ayarlar → Şifre ve güvenlik'te "İki adımlı giriş · İsteğe bağlı — açarsan girişte e-postana kod gelir · Ayarla" satırı
   (Tasarım 1 önizlemesi).
2. İki yol: e-postana 6 haneli kod (e-postan onaylıysa) ya da doğrulama uygulaması ([Doğrulama uygulaması](dogrulama-uygulamasi.md)).
3. Açtıktan sonra okul (ya da dershane), yönetici ya da destek şifreni değiştirse bile iki adımlı giriş **açık kalır**; yeni
   şifreyle girişte yine kod sorulur. Böylece şifreni değiştiren kurum hesabına tek başına giremez.
4. Yalnız sen kapatırsın; velin ya da okul açamaz, kapatamaz. Erişimini kaybedersen (e-posta, telefon) yönetici ya da destek
   kimliğini doğrulayarak sıfırlar; işlem kaydına yazılır.

### Servisçi

Okulun açtığı servisçi hesabında çoğu zaman e-posta yoktur; o zaman kod sorulmaz. Okul hesabına e-posta yazdıysa kod sorulur.
Tasarım 1'in Ayarlar'ında servisçide "İki adımlı giriş · Kapalı" görünür.

### Tahta

Tasarlandı — henüz kodda yok. Tahtada e-posta yoktur, giriş kodu adımı da yoktur ([Tahta girişi](../tahta/tahta-girisi.md)).

Tasarımda (Tasarım 1 önizlemesi), kod ekranı:

1. Kart yana kayar; sol üstte geri oku (ekran okuyucuya "Vazgeç, girişe dön") ([Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md)).
2. Posta simgesi, **"Giriş kodunu gir"**, "**d***z@ornek.com** adresine 6 haneli bir kod gönderdik. Kod 5 dakika geçerli ve bir
   kez kullanılır."
3. **Altı ayrı kutu** (her hane bir kutu): yazdıkça sonrakine geçer, geri tuşu öncekine döner, yapıştırılan kod kutulara
   dağılır.
4. Eksikse "Kodun 6 hanesini de yaz." (ilk boş kutuya gider); yanlışsa kutular kırmızı, "Kod yanlış. E-postana gelen son kodu
   yaz." ve kutular boşalır.
5. **"Doğrula ve gir"**; altta **"Kodu yeniden gönder (60 sn)"** (geri sayım bitince "Kodu yeniden gönder") ve **"← Geri dön"**.
   Yeniden gönderince kısa bildirim: "Yeni kod e-postana gönderildi; eski kod artık geçmez."
6. Önizlemedeki "Önizleme: e-postaya giden kod …" satırı yalnız önizlemeye aittir.

## Kurallar ve sınırlar

- **Kime uygulanır**: öğrenci dışında e-postası olan her hesaba (veli, öğretmen, müdür, rolsüz yetişkin, yönetici; e-postalı
  servisçi). Kapatılamaz. E-postası olmayan hesap (okulun açtığı servisçi, eski hesaplar) yalnız kullanıcı adı ve şifreyle girer.
- **Kod**: 6 rakam, rastgele; 5 dakika geçerli; tek kullanımlık. Sunucuda yalnız SHA-256 özeti, yalnız bellekte tutulur; diske
  ve tarayıcıya hiç gitmez. Sunucu yeniden başlarsa bekleyen kodlar geçersiz olur.
- **Deneme**: her kodun 5 deneme hakkı ("Kod hatalı. Kalan hakkın: N"); aşılınca kod silinir, baştan giriş gerekir. Aynı
  bağlantıdan 5 dakikada 25 yanlış kod: "Çok fazla yanlış kod denendi. Biraz bekleyip tekrar dene." (doğru kodlar sayılmaz;
  okulda bir sınıf aynı ağdan girer).
- **Yeniden gönderme**: son gönderimden 60 saniye geçmeden olmaz ("N saniye sonra yeni kod isteyebilirsin."); yeni kod eskisini
  geçersiz kılar.
- **Oturum anahtarı** ancak kod doğrulanınca verilir; şifre doğru diye anahtar verilmez.
- **E-posta ayarlı değilse** (deneme ortamı, `.test` gibi adres) kod sunucu penceresine yazılır; ekranda "Kod sunucu penceresine
  (siyah ekran) yazıldı: e-posta ayarlı değil ya da bu bir deneme adresi." E-posta gönderilemezse "E-posta gönderilemedi; kod
  sunucu penceresine (siyah ekran) yazıldı." Canlı sitede e-posta ayarlı olmalıdır.
- **Android uygulaması** aynı adımı kendi kod ekranında yapar (60 saniyelik "Yeni kod gönder"); uygulamadan açılan oturum 30
  gün geçerlidir.
- **Bilinen açık** (kod değiştirilmedi): "Kodu tekrar gönder" hata alınca kod ekranı açık kalır (sunucu "baştan giriş yap" dese
  de); "← Geri dön"e basmak gerekir.

Tasarımda (tanımlar):

- **Doğrulama uygulaması kuruluysa** girişte e-posta kodu yerine uygulamanın 6 haneli kodu sorulur; kurtarma kodu da kabul
  edilir ([Doğrulama uygulaması](dogrulama-uygulamasi.md)). Yönetici ve destekte uygulama zorunludur.
- **E-posta gönderilemiyorsa** girişte açık ileti: "Kod e-postası şu an gönderilemiyor; biraz sonra yeniden dene" ve yöneticiye
  bildirim (saatte en çok bir) ([E-posta sağlığı](../yonetim/eposta-sagligi.md)).
- **Şifre değişikliği iki adımı asla kapatmaz** (bütün hesaplar için yazılı kural).
- **SMS yok**: tanımda "SMS YOK (ücretli, SIM kopyalama riski)"; kullanıcı da 28 Ağustos'ta iki adımlı girişin e-posta koduyla
  olmasını konuşurken "bir phone number falan istemesin" demişti.
- **Tasarım 1 ile çelişen yerler** (kullanıcının sözü esas alınır, önizleme HTML işinde düzeltilir): Ayarlar'daki "İki adımlı
  giriş" penceresinde (1) veli ve öğretmende kapatma anahtarı var — kullanıcının 26 Eylül kararına göre yetişkinde kapatılamaz;
  (2) "Yeni bir cihazdan girerken şifrene ek olarak bir kod sorulur." yazıyor — kod her girişte sorulur; (3) "Kod nereye:
  E-posta / SMS" seçimi var — SMS yok.
- **Okul cihazı** (Tasarım 1'de müdürün "Okul cihazları" ekranı: "Bu bilgisayardan okulun sayfasından girişte iki adımlı
  doğrulama sorulmaz."): kullanıcı 29 Eylül'de "yaz, sonra ben bakarım" dedi; karar yok, bu yüzden kural olarak yazılmadı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Giriş](giris.md) — kodu isteyen ilk adım.
- [Doğrulama uygulaması](dogrulama-uygulamasi.md) — e-posta kodu yerine uygulama kodu (tasarım).
- [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md) — kod denemesi sınırları.
- [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md) — "← Geri dön" ve sol üstteki ok.
- [E-posta onayı](eposta-onayi.md) — kodların gittiği adresi değiştirmek.
- [Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md).

**İlgili:**

- [Güvenlik](../ayarlar/guvenlik.md) — Ayarlar'daki "İki adımlı giriş" ve "Doğrulama uygulaması" satırları.
- [E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md) — e-postası olmayan eski yetişkine "E-posta eklemek ister misin?".
- [E-posta sağlığı](../yonetim/eposta-sagligi.md) — kod e-postaları gitmezse.
- [Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — öğrencinin iki adımlı girişini yönetici ya da destekçinin
  sıfırlaması (tasarım; bugün yazılmayanlar arasında).

## Kod tarafı

- Sunucu: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `girisKoduGonder`, `girisKoduDogrula`, `KOD_OMRU_MS`,
  `KOD_EN_FAZLA_DENEME`, `epostaMaskele`, `kodKonsolaYaz`; [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) —
  `POST /api/login` (`twoFactor`, `challengeId`, `mesaj`), `POST /api/login/dogrula`, `POST /api/login/tekrar`.
- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `kodEkraniAc`, `kodEkraniKapat`,
  `tekrarSayaciBaslat`, `#formKod`, `#kodTekrar`, `#kodVazgec`. HTML `public/index.html` (`#kodEkran`).
- Testler: [testler/guvenlik-test.md](../../testler/guvenlik-test.md) (öğrenciye kod gitmemesi, şifre doğruyken kodsuz anahtar
  verilmemesi, kodun cevapta sızmaması, yanlış/tekrar kullanılan kod), [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md),
  [testler/giris.md](../../testler/giris.md) (testlerin kodu günlükten okuması).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İki adımlı giriş (2FA)", "E-posta ayarlanmamışsa ne
  olur?").
- Android: uygulamanın kod ekranı ([Android uygulaması](../uygulama/android-uygulamasi.md)).

## Sık sorulanlar

- **Girişte e-postama gelen kod ne?** Öğrenci dışındaki hesaplar, e-posta adresi varsa iki adımlı girer: şifreden sonra
  e-postana 6 haneli bir kod gelir. Kod 5 dakika geçerlidir ve bir kez kullanılır; yeni kod 60 saniye sonra istenebilir.
  Gelmediyse istenmeyen (spam) klasörüne bak (sitenin SSS'si).
- **İki adımlı girişi kapatabilir miyim?** Yetişkin hesabında hayır; zorunludur.
- **Okulun bilgisayarında e-postam açık değil, kodu nasıl okurum?** Telefonundaki e-postadan okuyup bilgisayara yazabilirsin.
  Tasarımda doğrulama uygulaması da bu işi görür.
- **Kod gelmiyor.** Spam klasörüne bak; 60 saniye sonra "Kodu tekrar gönder"e bas. Hâlâ gelmiyorsa e-posta adresin yanlış
  olabilir: "← Geri dön" ile dön, e-postanla girmeyi dene ya da yöneticiye yaz.

## Sırada

- Sistem: doğrulama uygulaması (yöneticiye ve desteğe zorunlu, öbür yetişkinlere isteğe bağlı), e-posta sağlığı ve açık ileti,
  yeni cihaz uyarısı.
- Tek kişi tek hesap + portallar öğrencide de: öğrenciye isteğe bağlı iki adımlı giriş (karar 6).
- Üst şerit sadeleştirme: kod ekranında sol üstte "←".
- Çok dil: ekran ve posta metinleri çeviri kataloğuna.
