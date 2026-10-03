# Hesap ayarları · Ayarlar sayfası

**Durum:** Kodda var; tasarımda ek olarak sayfanın adı "Hesap ayarları" olur ve bölümlere ayrılır (Kişisel bilgiler, Giriş bilgileri, Şifre ve güvenlik, Bildirimler, Ödev hatırlatmaları, Görünüm ve dil, kod bölümü, Okulum, Gizlilik ve verilerim, Hesabımı sil), profil menüsünden doğrudan bir bölüme gidilir ve her satırın düğmesi kendi penceresini açar.

Herkesin kendi hesabını yönettiği tek sayfa; hangi kartların (tasarımda bölümlerin) göründüğü hesabının türüne göre değişir.

## Ne işe yarar

Kişisel bilgilerin, giriş bilgilerin, şifren, telefon bildirimlerin, görünüm seçimin ve hesabını silme hakkın bu sayfada toplanır.
Kullanıcı 1 Ekim'de tasarımı anlatırken "orada sağ üstteki simgeye basınca hesap ayarları kişisel bilgiler ve diğer gerekliler
çıkcak" dedi; 2 Ekim'de de ayar düğmelerinin hepsinin aynı formu açmasına itiraz etti: "hepsi neden bu şeyi kullanıyor hepsini
kendine göre yap düzgünce … doğum günü değiştirme". Tasarımda bu yüzden her satırın kendi penceresi var.

Önemli kavram: **yetişkin hesabı** (veli, öğretmen, müdür, rolsüz yetişkin) tek bir hesaptır; okullardaki öğretmen ve müdür rolleri
ona bağlı portallardır. Ad, kullanıcı adı, e-posta, telefon, T.C. kimlik no ve şifre yetişkin hesabınındır; öğretmen, müdür ya da
veli portalındayken Ayarlar'ı açsan da aynı bilgileri görür, aynı yeri değiştirirsin.

## Nereden açılır

Bugünkü site:

- Üst şeritte dişli simgeli **"Ayarlar"** düğmesi ve en sağdaki profil düğmesi (adının baş harfleri ve ilk adın; üzerine gelince
  "Profil"). İkisi de bu sayfayı açar.
- Sol menünün en altında **"Ayarlar"** (altında **"Çıkış Yap"**).
- Ana sayfadaki gri **"Ayarlar"** kutucuğu. Altındaki yazı: öğrencide "Hesabın ve veli kodun", veli, öğretmen ve müdürde "Hesap
  bilgilerin", yönetim panelinde "Yönetici hesabın" ([Kutucuklar](../ana-sayfa/kutucuklar.md)).
- Adres: `#/profil`.
- "Giriş bilgilerin okul yönetimi tarafından yenilendi…" bildirimi ve **"E-posta eklemek ister misin?"** penceresindeki **"E-posta
  ekle"** de buraya getirir ([E-posta ekleme önerisi](eposta-ekleme-onerisi.md)).
- Henüz hiçbir portalı olmayan yetişkin ve servisçi de açar. Sayfa yenilenince adresteki sayfa korunur: portal dışındaki
  yetişkinde yalnız Ayarlar ve Hatırlatıcılar, servisçide Ana sayfa, Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar korunur
  (başka bir adres ana sayfaya döner) ([Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md)).

Tasarımda (Tasarım 1 önizlemesi):

- Sağ üstteki profil simgesi büyük bir menü açar (masaüstünde geniş, telefonda neredeyse tam ekran, arkası hafif kararır). En üstte
  adın, "@kullanıcı adın" ve "<rol> · <okul>". Yetişkinde önce **"Ekle"** (çocuğunu ekle, okula katıl, okulunu açtır). Sonra bölüm
  kısayolları, her birinin altında küçük açıklama:
  - **"Kişisel bilgiler"** — ad, doğum tarihi, adres
  - **"Giriş bilgileri"** — kullanıcı adı, e-posta, telefon
  - **"Şifre ve güvenlik"** — şifre, iki adımlı giriş
  - **"Bildirimler"** — telefon ve e-posta
  - **"Görünüm ve dil"** — tema, dil
  - **"Kişi kodun"** (öğrencide **"Veli kodun"**) — kopyala, paylaşma (servisçide yok)
  - **"Gizlilik ve verilerim"** — aydınlatma metni

  Ardından "Hesap değiştir", "Portallarım", "Uygulamayı indir", "Ana siteye dön" ve kırmızı **"Çıkış yap"**
  ([Profil menüsü](../menu-ve-arama/profil-menusu.md)). Bir kısayola basınca menü kapanır, Hesap ayarları açılır ve sayfa o bölüme
  kayar.
- Sol menünün altında: "Hesap değiştir", "Portallarım", **"Hesap ayarları"**, "Destek", "Ana siteye dön", "Çıkış yap"
  ([Sol menü](../menu-ve-arama/sol-menu.md)).
- Sayfanın başlığı **"Hesap ayarları"**, altında **"Kişisel bilgilerin, giriş ve güvenlik ayarların"**.

## Adım adım

### Bugünkü sayfanın düzeni

Başlık **"AYARLAR"**, altında hesabın türü:

| Hesap | Başlığın altındaki yazı |
|---|---|
| Okul rolündeyken (öğretmen ya da müdür portalında) | "Öğretmen · Test Ortaokulu" ya da "Müdür · Test Ortaokulu" |
| Okulun açtığı öğrenci, servisçi; eski düzendeki okul hesabı; yönetici | "Öğrenci hesabı", "Servisçi hesabı", "Öğretmen hesabı", "Müdür hesabı", "Yönetici hesabı" |
| Yetişkin hesabının kendisi (veli ya da rolsüz) | "Yetişkin hesabı" |

Kodda dördüncü bir yazı, **"Hesabın"**, yalnız yedek olarak durur: bugün her veli ve rolsüz hesap yetişkin hesabı sayıldığı için
ekranda görünmez.

Kartlar yukarıdan aşağı (yalnız sana uyanlar çıkar):

1. **"Hesap bilgilerin"** — salt görüntü: Ad Soyad, Kullanıcı adı, E-posta (varsa), okul ("Şu anki okulun" okul rolünde, "Okul" okulun
   açtığı hesapta), Doğum tarihi ("12 Mart 2011 (15 yaşında)" gibi), Branş (varsa), öğrencide **"Veli kodun (velinle paylaş)"** ve
   **"Kopyala"**. Yetişkinde altında: "Bu bilgiler yetişkin hesabınındır; öğretmen, müdür ya da veli olarak girdiğinde de aynıdır."
   ([Kişisel bilgiler](kisisel-bilgiler.md), [Kişi kodu](../portallar/kisi-kodu.md)).
2. **"Portallarım"** — yetişkin hesabında ve okul rolünde: portalların, "Ekle", "Geç", "Okuldan ayrıl", "Kaldır"
   ([Portallarım](../portallar/portallarim.md)).
3. **"Giriş bilgileri"** — yalnız yetişkin hesabında: kullanıcı adı, e-posta, telefon ([Giriş bilgileri](giris-bilgileri.md)).
4. **"Bilgileri güncelle"** — herkeste: ad, il, ilçe, adres, T.C. kimlik no, doğum tarihi, **"Kaydet"**
   ([Kişisel bilgiler](kisisel-bilgiler.md)).
5. **"Veli olarak çocuğunu ekle"** — yalnız eski düzendeki (okulun açtığı) öğretmen ve müdür hesabında
   ([Çocuklarım](../portallar/cocuklarim.md)).
6. **"Telefon bildirimleri"** — herkeste ([Bildirim ayarları](bildirim-ayarlari.md)).
7. **"Okulun adresi ve konumu"** — müdürde: okulun adresi ya da "Henüz seçilmedi", "Öğrenci ve öğretmenler okulun bu adresinden
   girer.", **"Değiştir"** ([Okul sayfasının adresi](../okul-sayfasi/sayfa-adresi.md)).
8. **"Görünüm"** — herkeste: Sistem · Açık · Koyu ([Görünüm ve dil](gorunum-ve-dil.md)).
9. **"Şifre değiştir"** — herkeste ([Şifre değiştirme](sifre-degistirme.md)).
10. **"Eğitim Evi hakkında yorumun"** — yetişkin hesabında ve okul rolünde ([Yorum yazma](../yorumlar/yorum-yazma.md)).
11. **"Hesabımı sil"** — yalnız yetişkin hesabında ([Hesabımı sil](hesabimi-sil.md)).
12. Kırmızı **"Çıkış yap"** ([Çıkış yap](../giris-hesap/cikis-yap.md)).

### Veli ve rolsüz yetişkin

1. Ayarlar'ı aç; sayfa önce yetişkin hesabının bilgilerini sunucudan alır.
2. Kartlar: Hesap bilgilerin, Portallarım, Giriş bilgileri, Bilgileri güncelle, Telefon bildirimleri, Görünüm, Şifre değiştir,
   Eğitim Evi hakkında yorumun, Hesabımı sil, Çıkış yap.
3. Çocuk ekleme bu sayfada değil: "Portallarım"daki "Ekle" ya da üst şeritteki "+ Ekle" ([+ Ekle penceresi](../portallar/ekle-penceresi.md)).

### Öğretmen, çalışan ve müdür (okul rolündeyken)

1. Başlığın altında "Öğretmen · <okul>" (ya da "Müdür · <okul>"); "Hesap bilgilerin"de "Şu anki okulun" ve (varsa) "Branş".
2. Gördüğün ve değiştirdiğin bilgiler yetişkin hesabınındır: burada adını değiştirirsen bütün okullardaki rol satırlarına da geçer.
3. Müdürde ayrıca "Okulun adresi ve konumu" kartı.
4. Bugün çalışan ayrı bir rol değildir; ek görevli kişi öğretmen portalıyla girer ve aynı sayfayı görür.

### Öğrenci

1. Kartlar: Hesap bilgilerin (veli kodun ve "Kopyala" ile), Bilgileri güncelle (T.C. salt okunur, doğum tarihi zorunlu), Telefon
   bildirimleri, Görünüm, Şifre değiştir, Çıkış yap.
2. Giriş bilgileri, yorum ve Hesabımı sil kartları yoktur: hesabını okul açar ve yönetir.

### Servisçi

Kartlar: Hesap bilgilerin, Bilgileri güncelle (T.C. salt okunur), Telefon bildirimleri, Görünüm, Şifre değiştir, Çıkış yap
([Servisçi hesabı](../servis/servisci-hesabi.md)).

### Yönetici

Yönetim panelindeki "Ayarlar" kutucuğundan ("Yönetici hesabın") açar. Kartlar: Hesap bilgilerin, Bilgileri güncelle (T.C. isteğe
bağlı), Telefon bildirimleri, Görünüm, Şifre değiştir, Çıkış yap. Kullanıcı adını ve e-postasını bu sayfadan değiştiremez; şifre
değişince yönetim çerezi yenilenir ([Şifre değiştirme](sifre-degistirme.md)).

### Ziyaretçi

Giriş yapmadan Ayarlar açılmaz; açılış sayfasında yalnız ay/güneş (görünüm) ve tasarımda dil seçimi vardır
([Görünüm ve dil](gorunum-ve-dil.md)).

### Tasarımda (Tasarım 1 önizlemesi): "Hesap ayarları" bölümleri

Her bölüm renkli simgeli bir kutudur; her satırda solda alan adı, ortada değer (altında küçük açıklama), sağda düğme. Düğmeler:
"Düzenle", "Değiştir", "Ekle", "Kopyala", "Ayarla", "Kur" / "Yönet", "Oku", "İndir", "Ayrıl", "Hesabımı sil". Gri **"okulun
değiştirir"** yazısı düğme değildir: o alanı okul yönetimi değiştirir.

1. **Kişisel bilgiler** — role göre satırlar ([Kişisel bilgiler](kisisel-bilgiler.md)).
2. **Giriş bilgileri** — Kullanıcı adı, E-posta, Telefon ([Giriş bilgileri](giris-bilgileri.md)).
3. **Şifre ve güvenlik** — şifre formu, İki adımlı giriş, Doğrulama uygulaması, Açık oturumlarım
   ([Şifre değiştirme](sifre-degistirme.md), [Şifre ve güvenlik](guvenlik.md), [Açık oturumlar](acik-oturumlar.md)).
4. **Bildirimler** — Bu cihazda bildirim, Telefon bildirimleri, E-posta bildirimleri ([Bildirim ayarları](bildirim-ayarlari.md)).
5. **Ödev hatırlatmaları** — yalnız öğrenci ve velide, Görünüm'den hemen önce ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).
6. **Görünüm ve dil** — Tema, Boyut, Dil ([Görünüm ve dil](gorunum-ve-dil.md)).
7. **"Kişi kodun"** ya da öğrencide **"Veli kodun"** — kod, "Kopyala" ve kısa uyarı; velide "Çocuklarım" satırı ("Çocuk ekle" —
   "Çocuğunun veli koduyla eklersin."); müdürde "Okulun adresi ve konumu" ("Aç"). Servisçide bu bölüm yok
   ([Kişi kodu](../portallar/kisi-kodu.md)).
8. **Okulum** — yalnız öğretmende: "Bu okuldan ayrıl", okulun adı, **"Ayrıl"**, altında "Hesabın silinmez; yalnız bu okulun portalı
   kapanır." ([Okuldan ayrılma](../portallar/okuldan-ayrilma.md)).
9. **Gizlilik ve verilerim** — "Aydınlatma metni" (onayladığın sürüm ve tarih, **"Oku"**), "Eğitim Evi hakkında yorumun" (yıldızlar ve
   yorumun ya da "henüz yazmadın"; **"Yorum yaz"** / **"Düzenle"**), "Verilerimi indir", velide "Çocuğumun verilerini indir",
   öğrencide "Hesabını silmek — Öğrenci hesabını okulun kapatır; okul yönetimine söyle."
   ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Yorum yazma](../yorumlar/yorum-yazma.md),
   [Verilerimi indir](verilerimi-indir.md)).
10. **Hesabımı sil** — öğrenci dışında herkeste, kırmızı çerçeveli ([Hesabımı sil](hesabimi-sil.md)).

Ortak davranış:

1. Bir düğmeye basınca o alana özgü küçük pencere açılır (ör. "Doğum tarihi" takvimle, "Telefon" ülke koduyla, "Kullanıcı adı"
   alınmış mı denetimiyle). Altta **"Vazgeç"** ve işin kendi düğmesi ("Kaydet", "Kod gönder", "Doğrulama bağlantısı gönder"…).
2. Hatalı alan kırmızı çerçeve alır, hata alanın altında yazar; pencere açık kalır.
3. Kaydedince pencere kapanır, sayfadaki değer hemen değişir ve kısa bir ileti çıkar (ör. "Doğum tarihin güncellendi: …").
4. Önemli işlerden önce (verileri indirme, "Diğer bütün cihazlardan çık", okuldan ayrılma, doğrulama uygulamasını kurma ya da
   kaldırma, yeni kurtarma kodları üretme) tam ekran **"Kimliğini doğrula"** açılır; tek bir cihazın oturumunu kapatmak bunu
   istemez ([Doğrulama ekranlarından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md)).
5. Silme gibi geri alınmaz işler ayrıca onay ister.

Role göre farklar (Tasarım 1): öğrencide Hesabımı sil yerine "Hesabını silmek" notu; velide "Çocuklarım" ve "Çocuğumun verilerini
indir"; öğretmende "Okulum"; müdürde "Okulun adresi ve konumu"; servisçide kod bölümü yok; eğitmende kişisel bilgilerde "Kanal
bağlantısı" ve "Kısa tanıtım"; tahta hesabında Hesap ayarları hiç yok (profil menüsünde yalnız "Hesap değiştir" ve "Çıkış yap").

### Telefon uygulamasında (bugün)

Android uygulamasının alt çubuğundaki üçüncü sekme **"Ayarlar"**: profil kartı (ad, "Rol · Okul", e-posta ya da kullanıcı adı),
öğrencide **"VELİ KODUN"** ve "Kopyala"; **"HESAP"**: "Portallarım", "Ekle" (yetişkinde), "Şifre değiştir"; **"TELEFON"**: "Telefon
bildirimleri", öğrencide "Bu telefonu velimle paylaş"; **"EĞİTİM EVİ"**: "Siteyi aç" ("Uygulamada olmayan işler için (Excel aktarımı,
roller, ders programı)"), "Aydınlatma metni", "Sık sorulan sorular"; kırmızı "Çıkış yap" ("Çıkış yapılsın mı?" — "Bu telefonda
bildirimler de durur.") ve en altta sürüm. Kişisel bilgileri değiştirme, tema ve hesap silme uygulamada yoktur; onlar için "Siteyi
aç" ([Android uygulaması](../uygulama/android-uygulamasi.md)).

## Kurallar ve sınırlar

- **Giriş gerekir.** Oturum yoksa sayfa açılmaz; giriş ekranı gelir.
- **Yetişkin hesabının bilgileri her rolde aynıdır**; okulun açtığı hesapta (öğrenci, servisçi) bilgiler kişinin kendisinindir, T.C.
  kimlik numarasını ve giriş bilgilerini okul yönetir.
- **Kişisel veri gösterir.** Sayfa T.C. kimlik no, adres, telefon ve doğum tarihi gösterir; bu sayfaya yeni bir kişisel alan eklenirse
  aynı işte aydınlatma metni ve onay sürümü güncellenir ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).
- **İl listesi** sayfa çizildikten sonra dolar; liste henüz gelmediyse kutuda yalnız "Seç..." olur ve kaydedince eski il korunur.
- **Tasarımda:** "Yenilikler" penceresi Hesap ayarlarından yeniden açılabilecek ([Yenilikler penceresi](../menu-ve-arama/yenilikler-penceresi.md));
  eğitim içeriklerinin izleme geçmişi Ayarlar'dan temizlenebilecek ("İzleme geçmişini temizle"; [İzleme geçmişi](../egitim-icerikleri/izleme-gecmisi.md)).
  İkisi Tasarım 1 önizlemesinin Hesap ayarlarında henüz çizilmedi.

## Kardeşler ve ilgili

**Kardeşler:** [Kişisel bilgiler](kisisel-bilgiler.md) · [Giriş bilgileri](giris-bilgileri.md) ·
[Şifre değiştirme](sifre-degistirme.md) · [Şifre ve güvenlik](guvenlik.md) · [Açık oturumlar](acik-oturumlar.md) ·
[Bildirim ayarları](bildirim-ayarlari.md) · [Görünüm ve dil](gorunum-ve-dil.md) · [Verilerimi indir](verilerimi-indir.md) ·
[Hesabımı sil](hesabimi-sil.md) · [E-posta ekleme önerisi](eposta-ekleme-onerisi.md).

**İlgili:** [Portallarım](../portallar/portallarim.md), [Kişi kodu](../portallar/kisi-kodu.md),
[Profil menüsü](../menu-ve-arama/profil-menusu.md), [Sol menü](../menu-ve-arama/sol-menu.md),
[Kutucuklar](../ana-sayfa/kutucuklar.md), [Yorum yazma](../yorumlar/yorum-yazma.md),
[Ödev hatırlatmaları](../odev/hatirlatmalar.md), [Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — `SAYFALAR.profil`, `profilCiz`
  (kartların sırası ve koşulları), `satirBilgi`, `dogumMetni`; [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  — `#btnAyarlar`, `#btnProfil` → `git('profil')`, kaydetme düğmeleri; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md)
  (menünün altındaki "Ayarlar"), [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) (kutucuklar),
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) (`portalYonetimKarti`),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (portal dışında ve serviste açılabilen sayfalar),
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (yöneticinin kutucuğu).
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) (`GET /api/hesap`: okul rolündeyken yetişkin hesabının
  bilgileri), [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`POST /api/profile`, `POST /api/password`).
- Görünüm: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`04-kartlar.css`, `02-form.css`, `28-yetiskin-hesap.css`).
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hesap türleri ve portallar", "Görünüm: açık/koyu tema ve
  yazı tipleri", "Kayıt kuralları").

## Sık sorulanlar

- **Ayarlar'da neden bazı kartları göremiyorum?** Kartlar hesabının türüne göre çıkar: öğrenci ve servisçi hesabını okul açtığı için
  giriş bilgileri ve hesap silme orada yoktur.
- **Öğretmen portalındayken değiştirdiğim adım veli portalımda da değişir mi?** Evet; bilgiler yetişkin hesabınındır.
- **Telefon uygulamasında adımı değiştiremiyorum.** Uygulamada yok; "Ayarlar → Siteyi aç" ile siteden değiştir.

## Sırada

- Arayüz önizlemesi / Tasarım 1 → kod: sayfanın "Hesap ayarları" adıyla bölümlere ayrılması, profil menüsünden bölüme gitme, her
  satırın kendi penceresi.
- Üst şerit sadeleştirme: Ayarlar ve Portallarım düğmeleri profil menüsüne taşınacak.
- Sistem: "Yenilikler" penceresi ve Güvenlik bölümü.
- Eğitim içerikleri: "İzleme geçmişini temizle".
