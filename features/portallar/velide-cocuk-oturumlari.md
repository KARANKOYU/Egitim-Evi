# Portallar · Velide her çocuk ayrı oturum

**Durum:** Kodda var; tasarımda ek olarak her çocuğun tamamen ayrı bir oturum olması (menü, bildirimler, mesajlar, hatırlatıcılar
ve bütün sayfalar yalnız o çocuğa göre), "Hepsi" seçiminin ve birleşik listelerin kalkması.

Birden çok çocuğu olan velinin çocuklarını nasıl ayrı ayrı (bugün ayrıca "Hepsi" diye bir arada) gördüğü.

## Ne işe yarar

Bugün her çocuk Portallarım'da ayrı bir "Veli · çocuğun adı" satırıdır, ama veli portalı tek bir oturumdur: çocuklar arasında
geçince yalnız seçili çocuk değişir ve bazı sayfalarda **"Hepsi"** seçilerek bütün çocukların ödevleri, devamsızlığı ve
ilerleyişi tek listede görülür. Kullanıcı 3 Ekim'de bunu değiştirdi: **velide her çocuk ayrı oturumdur, iki çocuk tek oturumda
birlikte gösterilmez ("Hepsi" yok).** Tasarım 1 önizlemesi buna göre yapıldı; kodda henüz bugünkü düzen var.

## Nereden açılır

- Sol menüdeki [Portallarım](portallarim.md): "Veli · Elif Yılmaz", "Veli · Can Yılmaz".
- Velinin **Ödevler**, **Devamsızlık**, **İlerleyiş**, **Takvim** ve **Etütler** sayfalarının üstündeki çocuk şeridi: **"Hepsi"** ·
  "Elif Yılmaz" · "Can Yılmaz" (yalnız iki ya da daha çok çocuk varsa).
- Velinin bildirimi bir çocukla ilgiliyse bildirime basınca o çocuk seçili açılır.

Tasarımda: Portallarım'daki "Veli · Elif Yılmaz · 7-A" / "Veli · Can Yılmaz · 5-B" satırları ve kartları, girişteki "Oturumunu
seç" ekranı, Çocuklarım'daki **"Oturumuna geç"** ve çocuğun penceresindeki **"Portalını aç"** ([Çocuklarım](cocuklarim.md)).
Çocuk şeridi yoktur.

## Adım adım

### Veli

**Bugün (kodda):**

1. Girişte okul rolün yok ve tek çocuğun varsa o çocukla açılırsın. Birden çok çocuğun (ya da çocuk + okul rolün) varsa önce portal kartlarını
   görürsün ([Portal seçme ekranı](portal-secme-ekrani.md)); bir çocuğun kartına basınca o çocuk seçili veli portalı açılır.
2. Menü: "Ana Sayfa", "Mesajlar", "Anketler", "Takvim", "Hatırlatıcılar", "Ödevler", "Devamsızlık", "İlerleyiş", "Etütler", "Yemek
   Listesi", "Servis", "Çocuğumun telefonu", çizgi, "Çocuklarım".
3. Sayfalar seçili çocuğa göredir; seçili çocuk yoksa ("Hepsi") bütün çocuklar bir arada:
   - **Ana sayfa:** "EĞİTİM EVİNE HOŞ GELDİNİZ" — "Merhaba Zeynep, çocuklarının durumu bir arada."; kutucuklar ve "Yaklaşan ödevler"
     (en çok 6) seçili çocuğun ya da hepsinin.
   - **Ödevler:** "ÖDEVLER" — "Çocuklarının bütün ödevleri bir arada; her satırda kimin olduğu yazar."; şerit; "Aktif ödevler (N)"
     ve "Geçmiş ödevler (N)" (en çok 40); her satırın başında çocuğun ilk adı rozet olarak ("Elif").
   - **Devamsızlık:** "DEVAMSIZLIK" — "Çocuklarının derse katılım kayıtları."; şerit; her çocuk için özet kart ("N gelmedi", "N geç
     geldi", "N izinli"); altında bütün kayıtlar tarihe göre, başında çocuğun rozeti.
   - **İlerleyiş:** "İLERLEYİŞ" — "Çocuk çocuk ödev başarısı ve sınav ortalamaları."; şerit; her çocuk ayrı başlık altında.
   - **Takvim:** şerit; "Hepsi" seçiliyken bile tek çocuğun takvimi açılır (ilk çocuğun): başlığın altında "Elif Yılmaz adına
     görüntülüyorsun."
   - **Etütler:** "ETÜTLER" — "Çocuklarının etütleri ve etüt yoklamaları."; şerit.
   - **Servis:** her çocuğun servis kartı alt alta; haritada çocuk seçilir.
   - **Çocuğumun telefonu:** seçili çocuğun telefonu ([Çocuğumun telefonu sayfası](../aile/cocugumun-telefonu-sayfasi.md)).
4. Şeritte bir çocuğun adına bas: sayfa o çocuğa daralır, yıl seçici o çocuğun okuluna göre yeniden yüklenir. **"Hepsi"**ye bas:
   bütün çocuklar yeniden bir arada.
5. Sol menüde başka bir çocuğun satırına dokunursan seçili çocuk değişir, ana sayfa açılır (yeni oturum açılmaz —
   [Portala geçiş](portala-gecis.md)).
6. Hiç çocuk yoksa bu sayfalar "Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla ekleyebilirsin." der.

**Tasarımda (3 Ekim kararı):**

1. Her çocuk ayrı bir oturumdur. İki çocuklu veli girişte **"Oturumunu seç"**te iki kart görür: "Veli · Elif Yılmaz · 7-A" ve
   "Veli · Can Yılmaz · 5-B" (kartta "Okul: Test Ortaokulu", "Okul kodu: test-ortaokulu", "Öğrenci: Elif Yılmaz (7-A)").
2. Bir oturumdayken her şey yalnız o çocuğa göredir; menünün başlığı "Veli · Elif · 7-A · Test Ortaokulu". Sayfaların alt
   başlıkları çocuğu söyler:
   - Ana sayfa: "Perşembe, 1 Ekim" — "Elif · 7-A · bugünkü durumu"; kutucuklar (Ödevler, Devamsızlık, İlerleyiş, Servis, Mesajlar,
     telefon…), "Bugün olanlar" ve "Yaklaşanlar";
   - Ödevler: "Elif · 7-A"; Devamsızlık: "Elif · 7-A · tarih aralığı, gün gün ya da ders ders"; İlerleyiş: "Elif · 7-A";
   - **"Başarıları"**: "Elif Yılmaz · belgeleriyle"; Etütler: "Elif'in etütleri"; Servis: "Elif · Servis 3 · …";
   - menüdeki telefon satırı **"Elif'in telefonu"**; Anketler: "Elif'in velilerine açılan anketler"; Takvim: "Elif'in ödevleri,
     sınavları ve okul etkinlikleri";
   - Hatırlatıcılar: "Bu oturumda koyduğun hatırlatmalar" (her oturumun hatırlatıcıları ayrı);
   - Toplantılar: sınıfa özel toplantılar yalnız o çocuğun oturumunda görünür (ör. 7-A veli toplantısı Elif'in, 5-B veli toplantısı
     Can'ın oturumunda);
   - bildirimler ve mesajlar o çocuğun; çocuğa giden mesajın kopyasında "Bu mesaj Elif'e gönderildi; sana kopyası geldi." yazar
     ([Velinin kopyası](../mesaj/velinin-kopyasi.md)).
3. Öbür çocuğa geçmek için Portallarım'daki satırına ya da kartına, Çocuklarım'daki **"Oturumuna geç"**e ya da çocuğun penceresindeki
   **"Portalını aç"**a bas; ileti "Can oturumuna geçildi." Bütün sayfalar Can'a göre açılır.
4. Hesap ayarları hesabındır, iki oturumda da aynıdır (ad, e-posta, şifre, kişi kodu). "Gizlilik ve verilerim"deki **"Çocuğumun
   verilerini indir"** bulunduğun oturumun çocuğu içindir ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).
5. Profil menüsündeki "Hesap değiştir" listesinde öbür çocuğun oturumu ayrı bir hesap gibi görünmez.
6. Bulunduğun oturumun çocuğunu Çocuklarım'dan kaldırırsan öbür çocuğun oturumuna geçersin ("Elif hesabından kaldırıldı; Can
   oturumuna geçildi.").

### Öğretmen, çalışan ve müdür (aynı zamanda veliysen)

Okul portalındayken çocuklarının sayfaları açılmaz; Portallarım'dan çocuğunun satırına geçersin. Geçtikten sonra yukarıdaki veli
düzeni geçerlidir (bugün tek veli oturumu ve "Hepsi", tasarımda her çocuk ayrı oturum).

## Kurallar ve sınırlar

- **Seçim yalnız tarayıcıdadır (bugün):** hangi çocuğun seçili olduğunu sunucu bilmez; her istekte veliliği o çocuğun kimliğiyle
  ayrıca denetler. Başkasının çocuğunu seçmek mümkün değildir.
- **Şerit iki çocuktan sonra çıkar;** tek çocukta "Hepsi" o çocuktur ve Portallarım'da o satır işaretlidir.
- **"Hepsi" seçiliyken** Portallarım'da hiçbir çocuk satırı işaretli değildir.
- **Yıl seçici:** velinin Ödevler, İlerleyiş ve Devamsızlık sayfalarında yıl seçici seçili çocuğun (tek çocukta o çocuğun) yıllarını
  gösterir; nakil gelmiş çocukta önceki okulun dönemleri ayrı gruptadır ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Bildirimden gelince** adreste çocuk bilgisi (`?c=`) varsa o çocuk seçilir.
- **Tasarımda:** "Hepsi" ve çocuk şeridi yoktur; iki çocuk hiçbir sayfada birlikte gösterilmez. Bu karar Tasarım 1, 2 ve 3
  önizlemelerinin hepsine uygulanacak; gerçek kodun buna uyması Linux'taki kodlamada yapılacak.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Çocuklarım](cocuklarim.md) — "Bu oturum / Oturumuna geç".
- [Portala geçiş](portala-gecis.md) — çocuklar arası geçiş.
- [Portallarım](portallarim.md), [Portal seçme ekranı](portal-secme-ekrani.md) — veli satırları ve kartları.
- [Öğrencide birden çok kurum](ogrencide-portallar.md) — çocuk birden çok kurumdaysa her kurumu ayrı satır.

**İlgili:**

- [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md).
- [Ödev listesi](../odev/liste.md), [Devamsızlığım](../devamsizlik/devamsizligim.md), [Velinin ilerleyiş sayfası](../ilerleyis/velinin-ilerleyis-sayfasi.md),
  [Etütlerim](../etut/etutlerim.md), [Servisim](../servis/servisim.md).
- [Velinin kopyası](../mesaj/velinin-kopyasi.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md).
- [Başarılarım](../basarilar/basarilarim.md), [Toplantılar listesi](../toplanti/toplantilar.md), [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md).
- [Çocuğumun telefonu sayfası](../aile/cocugumun-telefonu-sayfasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) — `veliSeciliCocuk`, `veliCocukSeridi`
  ("Hepsi"), `cocuklarIcin` (her çocuk için aynı uç, sonuçlar birleşir), `cocukRozet`, velinin Ödevler/Devamsızlık/İlerleyiş
  sayfaları; [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — velinin ana sayfası;
  [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) — takvimde çocuk (`takvimOgrenciParam`);
  [public/js/parcalar/16-egitim-yili.md](../../public/js/parcalar/16-egitim-yili.md) — `yilOgrencisi`;
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `veli-cocuk` (şerit);
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — `portalAktifMi`, veli geçişi;
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — veli menüsü.
- Sunucu: veli için yeni uç yok; her sayfa çocuk başına `?studentId=` ile var olan uçları çağırır, veli yetkisi sunucuda denetlenir
  ([sunucu/iliskiler.md](../../sunucu/iliskiler.md) `canSeeStudent`, [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md)
  `kisilik/gec` `tur: 'veli'`).
- Testler: [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md).

## Sık sorulanlar

- **İki çocuğumun ödevlerini bir arada görebilir miyim?** Bugün evet: Ödevler sayfasının şeridinden "Hepsi"yi seç. Tasarımda
  hayır: her çocuk ayrı oturumdur, çocuklar arasında Portallarım'dan geçersin.
- **Takvimde neden yalnız bir çocuğum var?** Takvim her zaman tek çocuğun takvimidir; şeritten öbür çocuğu seç.
- **Çocuklar arasında geçince çıkış yapmış olur muyum?** Hayır. Bugün yalnız seçili çocuk değişir; tasarımda öbür çocuğun oturumuna
  geçersin, hesabından çıkmazsın.

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı; kodu Linux'ta): "Hepsi" şeridi ve birleşik listeler kalkar, her
  çocuğun menüsü, bildirimleri, mesajları, hatırlatıcıları ve toplantıları ayrı; gerçek kodun buna uyup uymadığı denetlenecek.
- HTML işi: Tasarım 2 ve 3 önizlemelerinden de "Hepsi" çipi ve birleşik görünüm kaldırılacak.
- Tek kişi tek hesap + portallar öğrencide de (iş 19): çocuk birden çok kurumdaysa "Veli · Ali · Okul A" / "Veli · Ali · Dershane B".
