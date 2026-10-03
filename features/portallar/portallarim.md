# Portallar · Portallarım

**Durum:** Kodda var; tasarımda ek olarak her satırda okulun renkli baş harf rozeti (ya da okulun simgesi), okul adı ve
"buradasın" işareti, profil menüsünden açılan "Portallarım" penceresi (uzun kartlar), velide her çocuğun sınıfıyla ayrı satırı,
öğrencide, servisçide ve eğitmende de portal listesi, okula eklenenin "Çalışan · okul" satırı.

Yetişkin hesabının bütün portallarının (okuldaki öğretmenlik ve müdürlükler, velisi olduğun her çocuk) sol menünün en üstünde
alt alta durduğu liste; dokununca o portala geçersin.

## Ne işe yarar

Bir hesapla birden çok yerde olabilirsin: Test Ortaokulu'nda öğretmen, Deneme Lisesi'nde müdür, Elif Yılmaz'ın velisi. Her biri
bir portaldır ve bir anda yalnız birinin içindesin. "Portallarım" sana hepsini bir arada gösterir: nerede olduğunu (işaretli
satır), başka nerelere geçebileceğini ve yeni bir portal eklemeyi ("Portal ekle"). Portalların yönetimi (okuldan ayrılmak,
çocuğu kaldırmak) Ayarlar'daki "Portallarım" kartındadır.

Portal türleri bugün:

| Portal | Satırın yazısı | Nereden gelir |
|---|---|---|
| Öğretmen | "Öğretmen · Test Ortaokulu" | Müdür kişi kodunla seni okula ekler ([Kişi kodu](kisi-kodu.md)) |
| Müdür | "Müdür · Deneme Lisesi" | Yönetici kişi kodunla okulunu açar ([+ Ekle penceresi](ekle-penceresi.md)) |
| Veli (her çocuk ayrı) | "Veli · Elif Yılmaz" | Çocuğun veli koduyla eklersin ([Çocuklarım](cocuklarim.md)) |

Sol menüde satır iki katlıdır: üstte kalın portal adı ("Öğretmen", "Müdür", "Veli"), altında küçük ve soluk yazıyla okulun adı
(velide çocuğun adı). Ayarlar'daki "Portallarım" kartında ikisi tek satırda, aralarında "·" ile yazar ("Öğretmen · Test
Ortaokulu"). Sunucu tanımadığı bir rolü "Okul" adıyla gösterir.

## Nereden açılır

- **Sol menünün en üstü:** "Portallarım" başlığı, altında portallar, en altta **"Portal ekle"**, sonra çizgi ve bulunduğun
  portalın kendi menüsü. Masaüstünde sol menü yanda durur (üç çizgili düğmeyle daraltılabilir); telefonda sol üstteki üç
  çizgili düğmeyle kayan panel olarak açılır ([Telefonda menü](../menu-ve-arama/telefonda-menu.md)). Liste sen bir portalın
  içindeyken de görünür.
- **Ayarlar:** sol menünün altındaki **"Ayarlar"** → **"Portallarım"** kartı (sağ üstünde "Ekle" düğmesi).
- **Portal dışındaki ana sayfa:** birden çok portalın varsa girişte gördüğün kartlar ([Portal seçme ekranı](portal-secme-ekrani.md)).

Kim görür: yetişkin hesabı (rolsüz ya da veli) ve ona bağlı okul rolü (öğretmen, müdür). Öğrencide, servisçide ve yöneticide
sunucu portal listesi göndermez: menüde "Portallarım", üstte "+ Ekle" yoktur.

Tasarımda:

- Sol menüde "Portallarım" yine en üstte; altta ayrı bir "Portal ekle" satırı yok (ekleme üst şeritteki ve profil menüsündeki
  **"Ekle"**den).
- Sağ üstteki profil menüsünde ve sol menünün en altında (Hesap ayarları, Destek, Çıkış yap'ın yanında) **"Portallarım"**
  satırı bir pencere açar. Okulun sayfasından girdiysen üst şeritteki **"Portallarıma dön"** düğmesi de aynı pencereyi açar
  ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).
- Menünün başlığı bulunduğun portalı ve okulu yazar: "Veli · Elif · 7-A · Test Ortaokulu", "Öğretmen · Matematik · Test
  Ortaokulu".

## Adım adım

### Öğretmen

1. Sol menüyü aç. En üstte "Portallarım" başlığının altında "Öğretmen" satırını (altında "Test Ortaokulu") görürsün; şu an
   oradaysan satır vurgulu ve işaretlidir.
2. Başka portalın varsa (ör. "Müdür · Deneme Lisesi", "Veli · Elif Yılmaz") onlar da alt altadır. Birine dokun: o portala
   geçersin ([Portala geçiş](portala-gecis.md)).
3. Yeni portal eklemek için listenin sonundaki **"Portal ekle"**ye bas: "Ne eklemek istiyorsun?" penceresi açılır
   ([+ Ekle penceresi](ekle-penceresi.md)).
4. Yönetmek için **Ayarlar → "Portallarım"** kartına git. Her satırda simge, "Öğretmen · Test Ortaokulu", bulunduğun yerde
   yeşil **"şu an buradasın"** etiketi ve düğmeler:
   - **"Geç"** — o portala geçer (bulunduğun satırda ve girilemeyen satırda çıkmaz);
   - **"Okuldan ayrıl"** — yalnız öğretmen satırlarında ([Bu okuldan ayrıl](okuldan-ayrilma.md)).
5. Bir okul seni eklediğinde "Test Ortaokulu seni öğretmen olarak ekledi. Sol üstteki menüden okuluna geçebilirsin." bildirimi
   gelir; liste yeni bildirim gelince kendiliğinden tazelenir.

Tasarımda:

- Her satırın solunda okulun renkli kare rozeti ve baş harfleri ("TO"); müdür okul simgesi yüklediyse rozetin yerinde simge
  görünür ([Okul simgesi](../okul-sayfasi/okul-simgesi.md)). Ortada kalın başlık ("Öğretmen · Matematik"), altında küçük yazıyla
  okulun adı; bulunduğun satırda okul adının yanında " · buradasın" ve sağda onay işareti.
- Profil menüsü → **"Portallarım"** penceresi: her portal uzun bir kart — rozet, başlık, **"Okul: Test Ortaokulu"**, **"Okul
  kodu: test-ortaokulu"**, bulunduğun kartta yeşil **"buradasın"**, sağda "›". En altta **"Başka hesapla gir"** kartı ("bu
  hesaptan çıkılır, giriş ekranı açılır"). Listen boşsa "Henüz portalın yok. Sağ üstteki + Ekle ile başla."
- Okuldan ayrılma Ayarlar'daki portal kartından değil, Hesap ayarlarının **"Okulum"** bölümünden yapılır
  ([Bu okuldan ayrıl](okuldan-ayrilma.md)). Tasarım 1 önizlemesinde Hesap ayarlarında ayrı bir "Portallarım" kartı yoktur.

### Çalışan

Bugün kodda "çalışan" diye ayrı bir portal yok: okula kodla eklenen herkes öğretmen satırıdır ve "Öğretmen · okul" diye
görünür; ek görevi (Müdür Yardımcısı, Rehber Öğretmen…) olan da öğretmen portalından girer.

Tasarımda (çalışan tanımı): müdürün eklediği kişi önce rolsüz çalışandır ve satırı **"Çalışan · Test Ortaokulu"** olur; müdür
ona görev verince satır "Öğretmen · Test Ortaokulu" ya da özel rolün adıyla görünür
([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md), [Rol atama](../ogretmenler-calisanlar/rol-atama.md)).

### Müdür

1. Sol menüde "Müdür · Deneme Lisesi" satırı. Başka okullarda öğretmenliğin ya da çocukların varsa onlar da listededir.
2. Ayarlar → "Portallarım" kartında müdür satırında **"Okuldan ayrıl" yoktur**; satırın altında "Müdürlüğü bırakmak için sistem
   yöneticisiyle iletişime geç." yazar.
3. Okulunu yönetici açınca "Deneme Lisesi okulunun müdürü olarak eklendin. Sol üstteki menüden okuluna geçebilirsin." bildirimi
   gelir.

Tasarımda: müdür son müdür değilse müdürlükten ayrılabilir ([Bu okuldan ayrıl](okuldan-ayrilma.md)); müdür okulun simgesini
yüklerse bütün personelin "Portallarım"ında rozetin yerinde o simge görünür. Kaydedince "Okul simgesi kaydedildi; Portallarım'da
ve sol üstte görünür.", kaldırınca onay "Okul simgesi kaldırılsın mı?" — "Portallarım'da yine okulun baş harfleri görünür."

### Veli

1. Velisi olduğun her çocuk ayrı satırdır: "Veli" (altında "Elif Yılmaz"), "Veli" (altında "Can Yılmaz"). Satırın ikinci
   yazısı çocuğun adıdır.
2. Bir çocuğun satırına dokun: o çocuğun veli portalına geçersin (yalnız seçili çocuk değişir, yeni oturum açılmaz —
   [Portala geçiş](portala-gecis.md)).
3. İşaretli satır: veli portalındaysan seçili çocuğun satırı. Ödevler, Devamsızlık, İlerleyiş gibi sayfalardaki şeritten
   **"Hepsi"**ni seçtiysen hiçbir satır işaretli değildir; tek çocuğun varsa o çocuk işaretlidir
   ([Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md)).
4. Ayarlar → "Portallarım" kartında her çocuğun satırı "Veli · Elif Yılmaz", altında çocuğun okulu ("Test Ortaokulu") ve
   **"Geç"**, **"Kaldır"** düğmeleri ([Çocuklarım](cocuklarim.md)).

Tasarımda: her çocuk ayrı oturumdur ve satır çocuğun sınıfını da yazar: **"Veli · Elif Yılmaz · 7-A"**, **"Veli · Can Yılmaz ·
5-B"**. Portallarım penceresinin üstünde "Her çocuğun ayrı oturumu var; geçince menü ve bütün sayfalar o çocuğa göre açılır."
yazar; çocuğun kartında ayrıca **"Öğrenci: Elif Yılmaz (7-A)"** satırı vardır. "Hepsi" seçimi yoktur.

### Öğrenci

Bugün öğrencide "Portallarım" yok: öğrenci hesabı tek okuldadır.

Tasarımda öğrenci hesabı da birden çok kurumda olabilir; Tasarım 1'de Elif'in listesi: **"Öğrenci · 7-A"** (Test Ortaokulu,
rozet "TO") ve **"Öğrenci · 7. sınıf B grubu"** (Örnek Dershanesi, rozet "ÖD"). Öğrencide "+ Ekle" yoktur; portal kurum
öğrenciyi eklediğinde kendiliğinden düşer ([Öğrencide birden çok kurum](ogrencide-portallar.md)).

### Servisçi

Bugün yok. Tasarımda servisçi de portaldır (aynı servisçi iki okulda tek hesap, iki portal: "Servisçi · okul"); Tasarım 1'de
servisçinin listesinde "Servisçi · Servis 3" (Test Ortaokulu) görünür ([Öğrencide birden çok kurum](ogrencide-portallar.md)).

### Eğitmen

Tasarımda eğitmen rolü olan kişinin listesinde **"Eğitmen · eğitim içerikleri"** satırı vardır; rozeti "EE", ikinci yazısı
"Eğitim Evi"; Portallarım penceresindeki kartında okul satırı yerine "Eğitim Evi · eğitim içerikleri" yazar
([Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)).

### Yönetici

Yöneticide portal listesi yoktur; portal uçları "Yönetici hesabında portal seçimi yok." der. Tasarımda da tahta hesabında
"Portallarım" hiç gösterilmez ([Tahtanın gördükleri ve sınırları](../tahta/tahtanin-sinirlari.md)).

## Kurallar ve sınırlar

- **Kimde var:** yalnız yetişkin hesabında ve ona bağlı okul rolü satırında. Öğrenci, servisçi ve yönetici hesabında sunucu
  `portallar` alanını hiç göndermez (bugün).
- **Sıra:** önce okul rolleri (eklenme sırasıyla), sonra çocuklar (bağlanma sırasıyla).
- **En çok 10 okulda rol:** bir hesap en fazla 10 okulda öğretmen ya da müdür olabilir. Müdür onuncudan sonrasını kodla
  eklemeye çalışırsa "Bu kişi en fazla sayıda okulda rol almış.", yönetici okul açarken "Bu kişi en fazla sayıda okulda (10) rol
  almış." Bir okulda yalnız tek rolün olur: "Bu kişi okulunda zaten öğretmen." / "Bu kişi okulunda zaten müdür."
- **Kapalı okul:** müdürü kaldırılmış okulun satırı soluk görünür, üzerine gelince "Okul şu an kapalı" yazar; Ayarlar kartında
  turuncu "okul kapalı" etiketi ve "Geç" yok ([Kapalı okulun portalı](kapali-okul.md)).
- **İşaret tarayıcıdadır:** okul rolünde işaretli satır oturumun açıldığı satırdır; velide hangi çocuğun seçili olduğunu yalnız
  tarayıcı bilir (sunucu her istekte veliliği çocuk kimliğiyle ayrıca denetler).
- **Tazeleme:** liste girişte, portal değiştirince ve site her açıldığında (sayfa yenilenince) oturumla gelir; ayrıca portal
  dışındaki ana sayfa açılınca, çocuk ekleyip kaldırınca, okuldan ayrılınca ve yeni bir bildirim gelince sunucudan yeniden
  alınır. Sunucuya ulaşılamazsa menü eski listeyle kalır.
- **Hatalar:** menüden geçiş sırasında çıkan iletiler tarayıcının uyarı kutusunda görünür (ör. "Bu okul şu an kapalı; sistem
  yöneticisi yeni müdürünü atayınca açılır.").
- **Bilinen sorunlar:** "okul kapalı" etiketi ve soluk satır, okul açık olsa da onaylanmamış (eski usul başvuru) rol satırında
  da çıkar; menüdeki kapalı satıra basılabilir, sonuç sunucunun uyarısıdır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Portal seçme ekranı](portal-secme-ekrani.md) — aynı portalların girişteki büyük kartları.
- [Portala geçiş](portala-gecis.md) — satıra dokununca ne olur.
- [+ Ekle penceresi](ekle-penceresi.md) — "Portal ekle"nin açtığı pencere.
- [Çocuklarım](cocuklarim.md), [Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md) — veli satırları.
- [Bu okuldan ayrıl](okuldan-ayrilma.md), [Kapalı okulun portalı](kapali-okul.md), [Öğrencide birden çok kurum](ogrencide-portallar.md).

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md), [Profil menüsü](../menu-ve-arama/profil-menusu.md),
  [Üst şerit](../menu-ve-arama/ust-serit.md).
- [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md) — "Portallarıma dön" (tasarım).
- [Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md), [Okul açma](../yonetim/okul-acma.md) — öğretmen ve müdür
  portalının nasıl geldiği.
- [Okul simgesi](../okul-sayfasi/okul-simgesi.md) — rozetin yerine geçen simge (tasarım).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — `portalMenusu` (menünün başı),
  `portalAktifMi` (işaretli satır), `portalYonetimKarti` (Ayarlar kartı), `portallariTazele`, `PORTAL_SIMGE`;
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — `navCiz` listeyi menünün başına koyar;
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — kartın Ayarlar'daki yeri;
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) — yeni bildirimde
  tazeleme; CSS `28-yetiskin-hesap.css` (`.portal-link`, `.portal-satir`; [CSS.md](../../public/css/parcalar/CSS.md)).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `portalBilgisi` (`portallar`: `tur`, `id`, `rol`, `ad`,
  `alt`, `okulAdi`, `girilebilir`, `aktif`), `kisilikListesi`; [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) —
  `GET /api/kisilikler`; [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) ve
  [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md) — 10 okul sınırı ve "eklendin" bildirimleri.
- Android: `PortalSecici.java` (ayrı depo) — aynı listenin uygulamadaki penceresi.
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md) — "Öğretmen · okul" satırı, iki okulda rol + velilik;
  [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md) — portalların yalnız yetişkin hesabında ve rol satırında olması.

## Sık sorulanlar

- **Menümde "Portallarım" neden yok?** Öğrenci, servisçi ve yönetici hesabında portal listesi yoktur; bu hesapları okul ya da
  sistem açar ve tek yerdedirler (bugün).
- **Okul beni ekledi ama listede göremiyorum.** Bildirim gelince liste kendiliğinden tazelenir; gelmediyse sayfayı yenile.
- **Aynı okulda hem öğretmen hem müdür olabilir miyim?** Hayır, bir okulda tek rolün olur.
- **Hem öğretmen hem veli olabilir miyim?** Evet. Çocuğun yetişkin hesabına bağlanır, listede "Veli · çocuğun adı" satırı
  çıkar; öğretmen portalındayken çocuğunun ödevine bakmak için o satıra geçersin.
- **Kaç okulda olabilirim?** En çok 10 okulda rol alabilirsin.

## Sırada

- Çalışan olarak ekleme (iş 2): okula eklenen kişinin satırı "Çalışan · okul", görev verilince "Öğretmen · okul" ya da özel
  rolün adı.
- Tek kişi tek hesap + portallar öğrencide de (iş 19): öğrencide ve servisçide de "Portallarım".
- Velide her çocuk ayrı oturum (3 Ekim kararı; kodu Linux'ta): "Veli · Elif Yılmaz · 7-A" satırları, "Hepsi" kalkar.
- Paneller (iş 5): okul simgesinin rozetin yerine geçmesi, birden çok müdür, "okul kapalı" yerine "Müdürü yok".
- Üst şerit sadeleştirme (iş 29): "Portallarım" ve "+ Ekle" profil menüsüne, dar ekranda menüye.
- Eğitim içerikleri (iş 17): eğitmen portalı.
- Çok dil (iş 22): satır yazılarının çevirisi.
