# Açılış sayfası ve girişsiz sayfalar · Açılış sayfası

**Durum:** Kodda var; tasarımda ek olarak üst şeritte "Eğitim içerikleri" bağlantısı ve "TR ▾" dil seçici, giriş yapmış kişinin "Ana siteye dön" ile açılışa gelip "Hesaba gir" ile portalına dönmesi, yönetici ve destek için alt bilgide panel düğmeleri

`egitimevi.org` adresini açan herkesin ilk gördüğü sayfa: Eğitim Evi'nin ne olduğunu anlatır, rakamları ve yorumları gösterir,
"Hesap aç" ve "Giriş yap"a götürür.

## Ne işe yarar

Siteye ilk gelen bir veli, öğretmen ya da okul müdürü "bu nedir, kimin için, nasıl başlanır?" diye bakar. Açılış bunu tek sayfada
anlatır: ne işe yaradığı, neler olduğu, bir okulun nasıl başladığı, kimin ne yaptığı ve kullananların ne dediği. Kullanıcının kararı:
açılış yalnız "ne olduğunu, amacını" anlatır, okulların adresleri (`egitimevi.org/school/okulun-adi`) burada tanıtılmaz; öğrenci
okulunu giriş sayfasında seçer ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)). Çizimler "gerçek hayata
yakın", elle çizilmiş gibi sade resimlerdir (bir öğretmen ve sınıf gibi); fotoğraf yoktur.

Sayfa girişsizdir; giriş yapmış kişi bugün açılışı görmez (adres onu kendi portalına götürür). Tasarımda giriş yapmış kişi de
"Ana siteye dön" ile açılışa gelir.

## Nereden açılır

- **Adres:** `egitimevi.org/` (kök). `/index.html` da aynı sayfayı açar. Bütün adresler: [Kısa adresler](adresler.md).
- **Her dış sayfanın sol üstündeki** ev simgeli **"Eğitim Evi"** yazısı (logo) açılışa döner: Hakkında, Sık sorulan sorular, giriş ve
  kayıt kartı, okulun giriş sayfası; aydınlatma metni, kullanım koşulları, indirme sayfası ve "bulunamadı" sayfaları.
- **"Sayfa bulunamadı" ve "Okul bulunamadı"** sayfalarındaki **"Ana sayfaya dön"** düğmesi ([Bulunamadı sayfaları](bulunamadi-sayfalari.md)).
- **Kurulu uygulama (telefona ya da bilgisayara eklenmiş site)** açılınca da kök adres açılır; oturum yoksa açılış gelir.
- **Tasarımda** (30 Eylül kararı, Tasarım 1 önizlemesi): giriş yapmışken profil menüsündeki (ve portal seçme ekranındaki)
  **"Ana siteye dön"** satırı; simgesi kapıdan sola çıkan ok ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).

## Adım adım

### Ekranın düzeni (bugünkü site)

Yukarıdan aşağıya:

1. **Üst şerit** (sayfayı kaydırınca da üstte kalır): solda "Eğitim Evi", yanında **"Giriş"** ve **"Kayıt ol"**; sağda **"İndir"**,
   ay/güneş düğmesi, **"Hakkında"**, **"SSS"**, **"Yapımcılar"**. Ayrıntı: [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md).
2. **Renkli bant** (ekranı boydan boya kaplar, üstünde ince kareli defter dokusu, alt kenarı hafif eğik kesik):
   - solda küçük bir hap etiket: **"Okul portalı"**;
   - büyük başlık: **"Ödev, not, devamsızlık ve servis tek yerde."** — "tek yerde." sözcüklerinin altı sarı fosforlu kalemle
     çizilmiş gibidir;
   - alt yazı: "Eğitim Evi; öğrencinin, velinin, öğretmenin ve okul yönetiminin her gün baktığı şeyleri bir araya getirir.
     Telefonda da bilgisayarda da tarayıcıdan açılır, kurulum istemez.";
   - iki yuvarlak düğme: **"Hesap aç"** (beyaz dolu; kayıt kartına, `/signup`) ve **"Giriş yap"** (beyaz çizgili; giriş kartına,
     `/login`);
   - sağda bir **sınıf çizimi**: koyu temada da beyaz bir kartın içinde, hafif yana yatık durur.
3. **Rakamlar kartı** (bandın alt kenarına biner): **"okul kullanıyor"**, **"kayıtlı kişi"**, **"kişi şu an açık"**. Sayılar gelene
   kadar "–" yazar. Ayrıntı: [Rakamlar](rakamlar.md).
4. **"Neler var?"** — 12 kart; her kartta renkli bir simge, kalın başlık ve bir cümle. Üstüne gelince kart hafifçe yükselir:

   | Başlık | Kartın cümlesi |
   |---|---|
   | Ödev, quiz ve teslim | Öğretmen ödev verir, isterse quiz ekler; öğrenci dosyasını yükler, quizi çözer. Açılıp açılmadığı ve sonucu görünür. |
   | Sınavlar | Yazılı, test ya da LGS şablonuyla sınav; doğru, yanlış, net ve gelişim grafiği. |
   | Ders programı | Pazartesiden pazara haftalık program; boş saatler de görünür. |
   | Devamsızlık | Geldi, gelmedi, izinli; veli aynı gün öğrenir. |
   | Mesaj ve anket | Sınıfa, veliye ya da öğretmene mesaj; duyurunun kimde okunduğu belli. |
   | Servis yoklaması | Servisçi "Bindi" ya da "İndi" işaretleyince veliye bildirim gider; servis saatinde araç haritada. |
   | Telefon bildirimi | Uygulama kapalıyken de yeni not, ödev ve mesaj haber verilir. |
   | Toplu kayıt | Öğrenci listesi Excel (.xlsx, .xls), ODS ya da düz metinden bir seferde açılır. |
   | Hatırlatıcılar | Herkes kendine kurar: bir kez, her gün, haftanın seçtiği günleri ya da ayda bir. |
   | Ödev serisi | Öğrenci arka arkaya yaptığı ödevleri görür; kaçırınca önce uyarı gelir. |
   | Okulun sayfası | Her okulun kendi adresi, kapağı, tanıtımı ve fotoğraf galerisi olur. |
   | Okul değiştirme | Hesap öğrenciye aittir; yeni okula geçer, eski okulun kayıtları orada kalır. |

5. **"Okulun nasıl başlar?"** — numaralı dört adım:
   1. **Müdür hesabını açar** — "Kayıt ol, sonra sağ üstteki **+ Ekle → Müdür**'de kişi kodunu görür." ("Kayıt ol" kayıt kartına
      götürür.)
   2. **Okul açılır** — "Müdür okulun adını ve kodunu Eğitim Evi yöneticisine verir; yönetici okulu ve adresini açıp onu müdür yapar."
   3. **Sınıflar ve öğrenciler eklenir** — "Öğrenci listesi Excel ile bir seferde gelir; giriş bilgileri yazdırılıp dağıtılır."
   4. **Öğretmenler ve veliler katılır** — "Öğretmen kişi kodunu müdüre verir, veli çocuğunun veli koduyla bağlanır."

   Altında: "Aklına takılan bir şey mi var? **Sık sorulan sorular**" (bağlantı; [Sık sorulan sorular](sss.md)).
6. **Kimin için** — dört kart, her birinin üstünde kendi çizimi:
   - **Öğrenci** — "Hesabını okulu açar. Ödevlerini, notlarını, ders programını ve servisinin yerini görür."
   - **Veli** — "Kendi hesabını açar, çocuğunun veli koduyla bağlanır. Birden çok çocuğu olan da tek hesapla girer."
   - **Öğretmen** — "Kendi hesabını açar, kişi kodunu müdüre verir. Birden çok okulda ders veriyorsa hepsi tek hesapta."
   - **Okul yönetimi** — "Öğrenci ve servisçi hesaplarını açar, öğretmenleri ekler, kimin neyi yapacağını kişi kişi ayarlar."
7. **"Kullananlar ne diyor?"** — kullanıcı yorumları: sağ üstte ortalama (virgüllü, ör. "4,7"), beş yıldız ve "N yorum"; altında en
   son yazılan ya da düzeltilen 12 yorumun kartı (yıldız, metin, baş harfli yuvarlak, kısaltılmış ad, rol ve tarih; gizlenen yorum
   görünmez). Yüklenirken "Yorumlar yükleniyor...", hiç
   yorum yoksa "Henüz yorum yok. İlk yorumu sen yaz.", yüklenemezse "Yorumlar şu an yüklenemedi." yazar. En altta: "Veli, öğretmen ya
   da müdür hesabınla **giriş yap**, **Ayarlar** sayfasından sen de yorumunu yaz." Ayrıntı:
   [Açılış sayfasındaki yorumlar bölümü](../yorumlar/yorumlar-bolumu.md).
8. **Alt bilgi**: solda "Eğitim Evi · Okul portalı · 2026", ortada GitHub simgeli **"Kaynak kodu"**, sağda **"Hakkında"**, **"SSS"**,
   **"Kullanım koşulları"**, **"Aydınlatma metni"** ve sitenin iletişim bilgileri ([İletişim bilgileri](iletisim-bilgileri.md)).

Sekmenin başlığı **"Eğitim Evi"**dir.

### Ziyaretçi

1. `egitimevi.org` adresini aç. Sayfa önce üst şeridi ve bandı çizer; rakamlar ve yorumlar sunucudan gelince yerine oturur.
2. Aşağı kaydırarak tanıtımı oku: "Neler var?", "Okulun nasıl başlar?", kimin için, yorumlar.
3. Hesabın yoksa **"Hesap aç"**'a bas: kayıt kartı açılır, adres `/signup` olur. Veli, öğretmen ve müdür aynı yetişkin hesabını açar
   ([Kayıt olma](../giris-hesap/kayit-olma.md)). Öğrenci ve servisçi kaydolmaz; hesabını okul açar.
4. Hesabın varsa **"Giriş yap"**'a bas: giriş kartı açılır, adres `/login` olur ([Giriş](../giris-hesap/giris.md)). Öğrenci ya da
   servisçiysen kartın altındaki "Öğrenci ya da servisçiysen önce okulunu seç" kutusundan okulunu bulursun
   ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).
5. Okulunu açtırmak isteyen müdür adayıysan "Okulun nasıl başlar?" adımlarını izle: kayıt ol, girişten sonra **+ Ekle → Müdür**
   ([+ Ekle penceresi](../portallar/ekle-penceresi.md)), kişi kodunu ve okulun adını Eğitim Evi yöneticisine ver
   ([İletişim bilgileri](iletisim-bilgileri.md)).
6. Sayfadaki iç bağlantılar (üst şerit, "Sık sorulan sorular", "Kayıt ol", yorum notundaki "giriş yap") sayfayı **yeniden yüklemeden**
   açılır; sayfa başına kaydırılır, tarayıcının geri ve ileri tuşları çalışır. Ctrl, ⌘ ya da Shift'e basılıyken ya da farenin orta
   tuşuyla tıklarsan bağlantı yeni sekmede açılır.

### Giriş yapmış herkes

Öğrenci, veli, öğretmen, çalışan, müdür, servisçi (ve tasarımda eğitmen) için:

- **Bugünkü site:** giriş yapmışken `egitimevi.org`'u açarsan açılış değil kendi portalının ana sayfası açılır. `/hakkinda`, `/login`
  gibi bir dış adresteyken giriş yaparsan adres çubuğu `/`'a döner; bir okuldaki rolünle (öğrenci, öğretmen, müdür, servisçi) girdiysen
  `/school/<okul>` olur. Açılışı görmek için çıkış yapman gerekir ([Çıkış yap](../giris-hesap/cikis-yap.md)). Çıkınca adres
  çubuğunda okulun adresi varsa (okuldaki bir rolle girince adres kendiliğinden o olur) o okulun giriş sayfası, değilse `/login`
  açılır; açılışa logodan geçersin.
- **Tasarımda** (30 Eylül kararı, Tasarım 1 önizlemesi):
  1. Portalın içinde sağ üstteki baş harfli yuvarlağa (profil menüsü) dokun → **"Ana siteye dön"**. Önizlemedeki açıklama:
     "Oturumun açık kalır.", "egitimevi.org açılış sayfasına gidersin.", "Sağ üstteki "Hesaba gir" ile geri dönersin."
  2. Açılış ziyaretçininkiyle aynıdır; tek fark sağ üstte "Giriş" ve "Kayıt ol" yerine tek bir **"Hesaba gir"** düğmesi (tanımdaki
     yazımı "Hesaba gir →").
  3. Hakkında, SSS, Eğitim içerikleri arasında gezebilirsin; oturumun açık kalır.
  4. **"Hesaba gir"**'e bas: kaldığın portal sayfasına dönersin (portal seçmeden). Oturumun bu arada kapanmışsa giriş kartı açılır.
  - "Ana siteye dön" (sola ok, oturum açık kalır) ile **"Çıkış yap"** (sağa ok, oturum kapanır, kırmızımsı yazı) iki ayrı simgedir;
    karıştırılmasın diye ayrıldı (30 Eylül kararı).

### Yönetici ve destek

- **Bugünkü site:** sistem yöneticisi giriş yapınca tarayıcı onu tam sayfa geçişle gizli yönetim adresine götürür
  ([Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md)); açılışı görmez. Destek rolü bugün yok.
- **Tasarımda** (27 Eylül kararı: "otomatik yönlendirme YOK"): yönetici ve destek giriş yapınca panele atılmaz; herkes gibi açılışta
  sağ üstte **"Hesaba gir"** görür. Alt bilginin solunda yalnız onlara görünen düğmeler çıkar: yöneticiye **"Yönetim"**
  (→ `/panel/admin`) ve **"Destek paneli"** (→ `/panel/destek`), desteğe yalnız **"Destek paneli"**. Ayrıntı:
  [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md#yönetici-ve-destek), [Paneller](../yonetim/paneller.md).

### Tasarımda (Tasarım 1 önizlemesi)

Kullanıcının 2 Ekim sözü: "ana sayfayı direk gerçektekini yap". Önizlemedeki açılış bugünkü sitenin kendisidir (aynı metinler, aynı
kartlar, aynı yorum bölümü; sayılar ve üç yorum örnektir). Eklenenler:

- Üst şeritte **"Eğitim içerikleri"** bağlantısı (29 Eylül isteği; giriş gerekmez, videoları herkes izler —
  [Eğitim içerikleri](../egitim-icerikleri/README.md), [Girişsiz izleme](../egitim-icerikleri/girissiz-izleme.md)). Dar ekranda
  (640 px ve altı) yalnız simgesi görünür.
- Üst şeridin başında **"TR ▾"** dil seçici: dokununca dil listesi açılır ([Dil seçici](../dil/dil-secici.md)).
- Giriş yapmış kişiye **"Hesaba gir"** ve yönetici ile desteğe alt bilgide panel düğmeleri (yukarıda).
- Tanımlarda ayrıca: yöneticinin koyduğu **site duyurusu** açılış dahil bütün sayfaların üstünde şerit olarak görünür ("Bilgi" ve
  "Uyarı" kapatılabilir, "Önemli" kapatılamaz — [Site duyurusu](../yonetim/site-duyurusu.md)); **bakım modunda** açılış yerine "Kısa
  bir bakım yapıyoruz; birazdan döneceğiz." sayfası gelir ([Bakım modu](../yonetim/bakim-modu.md)).

## Kurallar ve sınırlar

- **Tek sayfalık uygulama:** açılış, Hakkında, SSS, giriş ve kayıt kartı aynı `index.html`'in parçalarıdır; hangisinin görüneceğine
  adres çubuğundaki yol karar verir. Aralarındaki geçiş sayfayı yeniden yüklemez.
- **Metinler sabittir:** açılıştaki yazılar koddadır; yönetici panelden değiştiremez. Panelden değişenler yalnız rakamların sayma
  süresi ([Rakamlar](rakamlar.md)), iletişim bilgileri ([İletişim bilgileri](iletisim-bilgileri.md)) ve yapımcı listesidir
  ([Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md)).
- **Sunucudan gelenler bir kez yüklenir:** rakamlar, iletişim ve yapımcılar (`/api/site`) sayfa başına bir kez; yorumlar
  (`/api/yorumlar`) yalnız açılışta ve bir kez. Rakamlar gelemezse rakam kartı gizlenir; bilgi bir sonraki sayfa geçişinde yeniden
  istenir ama gizlenen kart sayfa yenilenene kadar açılmaz ([Rakamlar](rakamlar.md)). Yorumlar gelemezse "Yorumlar şu an
  yüklenemedi." yazar, açılış bir daha açılınca yeniden denenir.
- **Ağ yokken:** telefona kurulmuş sitede sayfanın kabuğu önbellekten açılabilir; o zaman rakam kartı görünmez, yorumlarda
  "Yorumlar şu an yüklenemedi." yazar.
- **Okul adresi açılışta yok:** kullanıcının kararı. Okul bulma yalnız `/login`'deki arama ve okulun kendi bağlantısıyla olur.
- **Dar ekran:** 960 px ve altında "Neler var?" iki sütun; 860 px ve altında bant tek sütun olur (çizim altta, düz), "Okulun nasıl
  başlar?" ve kimin için kartları iki sütun; 640 px ve altında üst şeritteki "İndir" yazısı gizlenir (simge kalır); 560 px ve altında
  üst şeridin sağ yanı ikinci satıra iner, "Hesap aç" ile "Giriş yap" yan yana eşit genişlikte durur, rakamlar küçülür, bütün kartlar
  tek sütun olur; 520 px ve altında "Okulun nasıl başlar?" tek sütun. Dokunma hedefleri en az 44 px.
- **Görünüm:** açık ya da koyu tema; çizim her temada beyaz kartta (çizgileri açık temanın renkleriyle). Telefon tarayıcısının adres
  çubuğu açık temada sitenin kırmızısı, koyuda koyu gri olur.
- **Arama motorları için** sayfanın açıklaması: "Eğitim Evi - okul, öğretmen, öğrenci ve veli için ödev, sınav ve ilerleme takip
  sistemi."
- **Kişisel veri:** açılış kimseye ait bilgi göstermez. Yorumlarda tam ad yerine kısaltılmış ad, rakamlarda yalnız sayı vardır
  ("şu an açık"ta kimin açık olduğu tutulmaz). E-posta adresi sayfanın kaynağına düz yazı olarak girmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) — şeritteki düğmeler, alt bilgi, "Hesaba gir", panel düğmeleri.
- [Rakamlar](rakamlar.md) — "okul kullanıyor", "kayıtlı kişi", "kişi şu an açık".
- [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md) — `/hakkinda` sayfası ve "Yapımcılar" listesi.
- [İletişim bilgileri](iletisim-bilgileri.md) — alt bilgideki e-posta ve telefon.
- [Sık sorulan sorular](sss.md) — "Okulun nasıl başlar?"ın altındaki bağlantı.
- [Bulunamadı sayfaları](bulunamadi-sayfalari.md) — "Ana sayfaya dön".
- [Kısa adresler](adresler.md) — `/`, `/index.html` ve öbür adresler.

**İlgili:**

- [Yorumlar](../yorumlar/README.md) — [Açılış sayfasındaki yorumlar bölümü](../yorumlar/yorumlar-bolumu.md),
  [Yorum yazma](../yorumlar/yorum-yazma.md).
- [Giriş ve hesap](../giris-hesap/README.md) — [Kayıt olma](../giris-hesap/kayit-olma.md), [Giriş](../giris-hesap/giris.md),
  [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md), [Çıkış yap](../giris-hesap/cikis-yap.md).
- [Portallar ve + Ekle](../portallar/README.md) — [+ Ekle penceresi](../portallar/ekle-penceresi.md) ("Okulun nasıl başlar?"
  1. adımı), [Kişi kodu](../portallar/kisi-kodu.md).
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md),
  [Profil menüsü](../menu-ve-arama/profil-menusu.md).
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — üst şeritteki bağlantı (tasarım).
- [Dil ve çeviri](../dil/README.md) — "TR ▾" (tasarım).
- [Site yönetimi](../yonetim/README.md) — [Paneller](../yonetim/paneller.md), [Site duyurusu](../yonetim/site-duyurusu.md),
  [Bakım modu](../yonetim/bakim-modu.md), [Site ayarları](../yonetim/site-ayarlari.md).
- [Okul sayfası](../okul-sayfasi/README.md) — "Neler var?"daki "Okulun sayfası" kartının anlattığı şey.
- [Uygulama ve indirme](../uygulama/README.md) — üst şeritteki "İndir".

## Kod tarafı

- Sayfanın işaretlemesi: `public/index.html` (`#dis`, `#vitrin`, `#vAna`) — [public/KLASOR.md](../../public/KLASOR.md).
- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`disSayfa`, `girisEkraniGoster`,
  `siteGit`, `siteBilgisiYukle`, `sayilariCiz`, `yorumlariYukle`, `disSayfalariKur`, `okulYolunuAyarla`),
  [public/js/parcalar/02b-cizimler.md](../../public/js/parcalar/02b-cizimler.md) (sınıf ve kimin için çizimleri),
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) ("Neler var?" simgeleri, yıldızlar),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (açılışta oturum var mı, çıkışta hangi sayfa),
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) (yöneticinin yönetim adresine geçişi),
  [public/js/tema.md](../../public/js/tema.md) (açık/koyu görünüm), [public/sw.md](../../public/sw.md) (ağ yokken açılış).
- Biçim: `public/css/parcalar/29-dis-sayfalar.css` — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Sunucu: [sunucu/http.md](../../sunucu/http.md) (`UYGULAMA_YOLLARI`: kök için kabuk), [sunucu/site.md](../../sunucu/site.md)
  (`GET /api/site`), [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) (`GET /api/yorumlar`).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Açılış sayfası, giriş ve site ayarları").

## Sık sorulanlar

- **Eğitim Evi ücretli mi?** Hayır; SSS'nin cevabı: ücretsizdir, reklam göstermez ([Sık sorulan sorular](sss.md)).
- **Okulumun adresi açılışta neden yok?** Kullanıcının kararı: açılış yalnız Eğitim Evi'ni tanıtır. Okulunu `/login`'deki "Öğrenci ya
  da servisçiysen önce okulunu seç" kutusunda adıyla, ilinle ya da ilçenle ara; okulun bağlantısını okul yönetiminden de alabilirsin.
- **Giriş yaptım; açılışı nasıl görürüm?** Bugün çıkış yaparak. Tasarımda profil menüsündeki "Ana siteye dön" ile; geri dönmek için
  sağ üstteki "Hesaba gir".
- **Rakamların yerinde neden "–" var?** Sayılar sunucudan gelmedi ya da hâlâ geliyor. Gelemezse kart tamamen gizlenir; sayfayı
  yenile ([Rakamlar](rakamlar.md)).
- **Öğrenciyim; "Hesap aç"a basmalı mıyım?** Hayır. Öğrenci ve servisçi hesabını okul açar; kullanıcı adını ve ilk şifreni okulundan
  alırsın.

## Sırada

- "Üst şerit sadeleştirme" (DEVAM iş 29): "Ana siteye dön" ve "Hesaba gir" akışı, telefonda öncelikli düzen.
- "Paneller /panel/admin ve /panel/destek … alt bilgide yalnız yönetici/destek için Yönetim düğmesi" (iş 5): yöneticinin otomatik
  yönlendirilmesi kalkar.
- "Eğitim içerikleri" (iş 17): üst şeritteki bağlantı ve girişsiz izleme.
- "Çok dil" (iş 22): "TR ▾" ve açılış metinlerinin çeviri kataloğuna geçmesi.
- "Sistem" (iş 4): site duyurusu şeridi ve bakım modu.
- "Arama motorunda görünme" (iş 23): açılış için başlık, açıklama, önizleme resmi, `robots.txt`, `sitemap.xml`.
- "Çalışan olarak ekleme" (iş 2): açılıştaki "Öğretmen kişi kodunu müdüre verir" cümlesi ve "Öğretmen" kartı bugünkü dille duruyor;
  Tasarım 1'deki SSS cevapları "+ Ekle → Çalışan" der, açılış metni önizlemede değişmedi — iş yapılırken ikisi aynı dile getirilmeli.
- Android uygulamasında girişsiz bir sol menüyle açılışın karşılığı (Ana sayfa, Yorumlar, Hakkında, SSS …) istek denetiminde "emin
  değil" diye soruya kaldı ([Android uygulaması](../uygulama/android-uygulamasi.md)).
