# Portallar · Portala geçiş

**Durum:** Kodda var; tasarımda ek olarak geçişte kısa ileti ("… portalına geçildi."), velide çocuklar arası geçişin ayrı oturum
olması, okulun sayfasından girince "Portallarıma dön" ve çok kurumlu hesapta bildirime basınca önce o kurumun portalına geçilmesi.

Bir portaldan ötekine geçmek: okul rolüne geçmek yeni oturum açar (eskisi kapanır), velide yalnız seçili çocuk değişir.

## Ne işe yarar

Bir anda yalnız bir portalın içindesin: öğretmenken müdürlük ekranlarını, veliyken öğretmenlik ekranlarını görmezsin. Geçiş,
seni seçtiğin portala sokar; menü, ana sayfa, bildirimler ve yetkiler o portala göre olur. Güvenlik için okul rolüne her geçiş
yeni bir oturum demektir: eski oturum anahtarı sunucuda hemen kapanır, önceki portalın ekranda açık kalan bilgileri silinir.

## Nereden açılır

- Sol menünün en üstündeki [Portallarım](portallarim.md) satırına dokun.
- Portal dışındaki ana sayfanın kartına bas ([Portal seçme ekranı](portal-secme-ekrani.md)).
- **Ayarlar → "Portallarım"** kartında satırın **"Geç"** düğmesi.
- Okul rolündeyken **Çocuklarım** sayfasındaki **"Veli · Elif Yılmaz"** gibi düğmeler ([Çocuklarım](cocuklarim.md)).
- Telefon bildirimi başka bir portala geldiyse, bildirime dokununca site o portalda açılır.

Tasarımda ayrıca: profil menüsü → **"Portallarım"** penceresi, "Oturumunu seç" ekranı, okulun sayfasından girince üst şeritteki
**"Portallarıma dön"**, velinin Çocuklarım sayfasındaki **"Oturumuna geç"** ve çocuğun penceresindeki **"Portalını aç"**.

## Adım adım

### Öğretmen ve müdür

1. Sol menüde başka bir okul rolüne dokun (ör. öğretmenken "Müdür · Deneme Lisesi").
2. Bir kez gösterilen şifreler ekranda açıksa (giriş bilgisi listesi, aktarım sonucu, yeni hesabın şifresi) önce bir soru çıkar;
   **"İptal"** dersen hiçbir şey olmaz, bulunduğun yerde kalırsın. Yeni oturum bu bilgileri sileceği için sorulur.
3. Düğme kilitlenir, sunucu eski oturumunu kapatıp o rol için yenisini açar.
4. Önceki portalın ekranda açık kalan her şeyi silinir, açık pencere kapanır, uygulama yeni portalla baştan açılır ve **ana
   sayfası** gelir. Aydınlatma metninin yeni sürümünü onaylaman ya da kendi şifreni belirlemen gerekiyorsa önce o sorulur.
5. Zaten o portaldaysan satıra dokunmak yalnız ana sayfayı açar.
6. Velisi olduğun bir çocuğun satırına dokunursan sunucu oturumu yetişkin hesabında açar ve o çocuğun veli portalına geçersin.

### Veli

1. Veli portalındayken başka bir çocuğun satırına dokun ("Veli · Can Yılmaz").
2. Portal geçişi için sunucuya istek gitmez, yeni oturum açılmaz: yalnız seçili çocuk değişir, yıl seçici o çocuğun okuluna
   göre yeniden yüklenir (bunun için yalnız o çocuğun eğitim yılı bilgisi sunucudan alınır) ve ana sayfa açılır.
3. Okul rolündeyken (ör. öğretmen portalında) çocuğunun satırına dokunursan yeni oturum açılır ve o çocuğun veli portalına
   geçersin (yukarıda 6. adım).

Tasarımda: her çocuk ayrı oturumdur. Çocuğun satırına, Portallarım penceresindeki kartına, Çocuklarım'daki **"Oturumuna
geç"**e ya da çocuğun penceresindeki **"Portalını aç"**a basınca o çocuğun oturumuna geçersin; ileti "Can oturumuna geçildi."
Menü, bildirimler, mesajlar, hatırlatıcılar ve bütün sayfalar yalnız o çocuğa göre açılır
([Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md)). Profil menüsündeki "Hesap değiştir" listesinde öbür çocuğun oturumu
başka bir hesap gibi görünmez.

### Çalışan

Bugün öğretmenle aynı. Tasarımda "Çalışan · okul" satırına geçiş öğretmen portalına geçiş gibidir; görevi verilmemiş çalışan
yalnız duyuruları, Mesajlar'ı, Takvim'i, Hatırlatıcılar'ı ve Ayarlar'ı görür ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

### Öğrenci

Bugün yok. Tasarımda iki kurumlu öğrenci "Öğrenci · 7-A" ile "Öğrenci · 7. sınıf B grubu" arasında aynı yoldan geçer; bildirim
panelinde öbür kurumun bildirimine basınca önce o kurumun portalına geçilir, sonra bildirimin götürdüğü yer açılır
([Öğrencide birden çok kurum](ogrencide-portallar.md)).

### Servisçi ve eğitmen

Bugün yok. Tasarımda iki okulda çalışan servisçi okullar arasında, eğitmen rolü olan yetişkin "Eğitmen · eğitim içerikleri"
portalına aynı yoldan geçer.

### Yönetici

Yöneticide portal yoktur; portal uçları "Yönetici hesabında portal seçimi yok." der.

### Tasarımda geçiş iletisi ve "Portallarıma dön"

- Okul rolüne geçince kısa bir ileti çıkar: **"<portal> · <okul> portalına geçildi."** (ör. "Öğretmen · Matematik · Test
  Ortaokulu portalına geçildi.").
- Okulun sayfasından girdiysen portal seçmeden o okuldaki portalına girersin; üst şeritte logonun yanında **"Portallarıma
  dön"** düğmesi çıkar ve Portallarım penceresini açar ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).
- Portallarım penceresinin en altındaki **"Başka hesapla gir"** portal geçişi değildir: bu hesaptan çıkılır, giriş ekranı açılır
  ([Çıkış yap](../giris-hesap/cikis-yap.md), [Beni hatırla](../giris-hesap/beni-hatirla.md)).

## Kurallar ve sınırlar

- **Yalnız kendi portalların:** bir rol satırına geçmek için o satır senin yetişkin hesabına bağlı olmalı; bir çocuğa veli olarak
  geçmek için o çocukla aranda veli bağı olmalı. Tarayıcının gönderdiği kimliğe güvenilmez, her şey sunucuda denetlenir.
- **Oturum uzamaz:** yeni oturum eskisinin türünü (tarayıcıda 7 gün, telefon uygulamasında 30 gün) ve açılış anını devralır;
  portal değiştirerek oturum süresi uzatılamaz.
- **Hız sınırı:** hesap başına dakikada 60 geçiş; fazlası "Çok hızlı. Biraz bekle."
- **Hata iletileri** (tarayıcının uyarı kutusunda):
  - "Bu rol hesabında yok." — satır senin değil ya da artık yok;
  - "Bu okul şu an kapalı; sistem yöneticisi yeni müdürünü atayınca açılır." — okulun müdürü kaldırılmış
    ([Kapalı okulun portalı](kapali-okul.md));
  - "Bu role şu an girilemez." — rol satırı onaylı değil (eski usul başvurudan kalan satır);
  - "Bu öğrenci hesabına bağlı değil." — çocukla bağın yok;
  - "Geçersiz seçim" — tanınmayan bir istek;
  - "Yönetici hesabında portal seçimi yok." / "Bu işlem yetişkin hesabıyla yapılır. Hesabını okul yönetimi düzenler." — yönetici,
    öğrenci ve servisçi hesabında.
- **Telefon bildiriminden:** bildirim başka bir portala aitse site açılırken o role geçilir ve bildirimin sayfası açılır;
  geçilemezse (ör. okul kapandıysa) bulunduğun oturumla devam edilir. Velinin bildirimi hangi çocukla ilgiliyse sayfa o çocuk
  seçili açılır.
- **Veli seçimi görünüştür:** velide hangi çocuğun seçili olduğunu yalnız tarayıcı bilir; sunucu her istekte veliliği çocuk
  kimliğiyle ayrıca denetler.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Portallarım](portallarim.md), [Portal seçme ekranı](portal-secme-ekrani.md) — geçişin başladığı yerler.
- [Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md), [Çocuklarım](cocuklarim.md) — veli geçişi.
- [Kapalı okulun portalı](kapali-okul.md), [Öğrencide birden çok kurum](ogrencide-portallar.md).

**İlgili:**

- [Beni hatırla](../giris-hesap/beni-hatirla.md) — oturumun saklandığı yer, 7 ve 30 gün.
- [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md) — doğrudan o okulun portalı (tasarım).
- [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md) — velide yıl seçicinin seçili çocuğa göre olması.
- [Profil menüsü](../menu-ve-arama/profil-menusu.md) — tasarımdaki "Portallarım" ve "Hesap değiştir".

## Kod tarafı

- Ön yüz: [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — `EYLEMLER['kisilik-gec']`,
  `oturumuDegistir` (`tokenYenile`, `oturumDurumunuSifirla`, `girisSonrasi`); [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md)
  — `tekSeferAyrilabilir('oturum')` (bir kez gösterilen şifreler); [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md)
  — telefon bildiriminden (`?k=`) geçiş; [public/js/parcalar/16-egitim-yili.md](../../public/js/parcalar/16-egitim-yili.md) —
  `yilBilgisiYukle`; [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — okul rolündeyken
  Çocuklarım'daki "Veli · …" düğmeleri.
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `POST /api/kisilik/gec { tur: 'rol'|'veli'|'hesap', id }`
  (dakikada 60, `oturumSecenegi`); [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `oturumCevabi` (giriş cevabıyla
  aynı cevap, yeni anahtar).
- Android: `PortalSecici.java` (`gec`) — uygulamadaki geçiş.
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md) — rol ve veli portalına geçiş, eski oturumun kapanması,
  başkasının rolüne/çocuğuna geçilememesi; [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md) — veli olarak geçince
  çocuğun ilerleyişi ve devamsızlığı.

## Sık sorulanlar

- **Geçince neden "Ayrılınsın mı?" gibi bir soru çıktı?** Ekranda bir kez gösterilen şifreler (ör. giriş bilgisi listesi) açıktı;
  yeni oturum onları silecek. Önce indir ya da ilet, sonra geç.
- **Aynı tarayıcıda bir sekmede öğretmen, ötekinde veli olabilir miyim?** Her sekme kendi oturumunu tutar
  ([Beni hatırla](../giris-hesap/beni-hatirla.md)); ama okul rolüne geçiş, geçtiğin oturumun eski anahtarını kapatır. O eski
  anahtarla açık kalmış başka bir sekme varsa yeniden girmesi gerekir.
- **Veliyken çocuklar arasında geçmek oturumu yeniler mi?** Bugün hayır, yalnız seçili çocuk değişir. Tasarımda her çocuk ayrı
  oturumdur.
- **"Bu okul şu an kapalı" diyor.** Okulun müdürü kaldırılmış; yönetici yeni müdür atayınca girebilirsin.

## Sırada

- Velide her çocuk ayrı oturum (3 Ekim kararı; kodu Linux'ta).
- Tek kişi tek hesap + portallar öğrencide de (iş 19): öğrenci ve servisçi portalları, okulun sayfasından girişte doğrudan o okul
  ve "Portallarıma dön".
- Üst şerit sadeleştirme (iş 29): çıkıştan sonra ileri/geri tuşunun hesaba sokmaması, geçiş kaydının oturum kimliğiyle tutulması.
- HTML (Tasarım 1) → kod: geçiş iletisi ("… portalına geçildi.").
