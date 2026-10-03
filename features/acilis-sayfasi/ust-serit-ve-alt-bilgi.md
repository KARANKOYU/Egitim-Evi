# Açılış sayfası ve girişsiz sayfalar · Açılışın üst şeridi ve alt bilgisi

**Durum:** Kodda var; tasarımda ek olarak "Eğitim içerikleri" bağlantısı, "TR ▾" dil seçici, giriş yapmış kişiye "Giriş / Kayıt ol" yerine "Hesaba gir", alt bilginin solunda yöneticiye "Yönetim" ve "Destek paneli", desteğe "Destek paneli" düğmesi

Girişsiz bütün sayfaların üstündeki şerit (Giriş, Kayıt ol, İndir, ay/güneş, Hakkında, SSS, Yapımcılar) ve altındaki alt bilgi
(Kaynak kodu, Hakkında, SSS, Kullanım koşulları, Aydınlatma metni, iletişim).

## Ne işe yarar

Ziyaretçi hangi girişsiz sayfada olursa olsun aynı yerde aynı şeyleri bulur: girmek, hesap açmak, uygulamayı indirmek, görünümü
değiştirmek, projeyi tanımak, soruların cevabına bakmak, yapanları görmek, yöneticiye ulaşmak. Kullanıcının isteği (26 Eylül):
giriş ve kayıt "sol üstte iki buton", üstte "Hakkında" ve "Yapımcılar", altta herkeste olan bir alt bilgi, ortasında projeye götüren
GitHub simgesi, altta iletişim bilgileri. Şerit ve alt bilgi bütün dış sayfalarda aynıdır.

## Nereden açılır

Ayrı bir sayfası yoktur; şu sayfaların hepsinde üstte şerit, altta alt bilgi vardır:

- tek sayfalık uygulamanın dış sayfaları: açılış (`/`), Hakkında (`/hakkinda`), Sık sorulan sorular (`/sss/sss.html`), giriş kartı
  (`/login`), kayıt kartı (`/signup`), okulun giriş sayfası (`/school/<okul>`);
- düz (ayrı dosya) sayfalar: aydınlatma metni (`/kvkk/kvkk.html`), kullanım koşulları (`/kosullar/kosullar.html`), indirme sayfası
  (`/indir/indir.html`), "Sayfa bulunamadı" ve "Okul bulunamadı".

Giriş yaptıktan sonra uygulamanın kendi üst şeridi ve kendi alt bilgisi vardır (aşağıda "Giriş yapmış herkes").

## Adım adım

### Ekranın düzeni (bugünkü site)

**Üst şerit** (sayfayı kaydırınca da ekranın üstünde kalır, altında ince bir çizgi):

- Solda ev simgesi ve **"Eğitim Evi"** — açılışa (`/`) götürür.
- Hemen yanında iki küçük düğme: **"Giriş"** (dolu; giriş kartı, `/login`) ve **"Kayıt ol"** (açık renk zeminli; kayıt kartı,
  `/signup`).
- Sağda, soldan sağa:
  - **"İndir"** — aşağı ok simgeli; üstüne gelince "Eğitim Evi'ni telefonuna indir (Android ve iPhone)" yazar; indirme sayfasını açar
    (`/indir/indir.html`; [İndir sayfası](../uygulama/indir-sayfasi.md)). İndirme sayfasındayken vurgulu.
  - **Ay / güneş düğmesi** — üstüne gelince "Koyu ya da açık görünüm". Açık görünümdeyken ay (koyuya geç), koyudayken güneş (açığa geç)
    görünür.
  - **"Hakkında"** ([Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md)).
  - **"SSS"** ([Sık sorulan sorular](sss.md)).
  - **"Yapımcılar"** — GitHub simgeli düğme; basınca altında liste açılır.
- Bulunduğun sayfanın bağlantısı ("Hakkında", "SSS") sitenin ana renginde görünür; açılışta hiçbiri işaretlenmez.

**Yapımcılar listesi:** her satırda yapımcının adı ve altında küçük yazıyla katkısı (ör. "Proje sahibi"). GitHub adı olan satırın
başında GitHub simgesi durur ve satır o kişinin GitHub sayfasını yeni sekmede açar; GitHub adı olmayan satır simgesiz, düz yazıdır. Listenin en altında **"Projenin GitHub
sayfası"** bağlantısı (deponun kendisi, yeni sekme). Liste sunucudan gelene kadar (ya da hiç gelmezse) sayfadaki hazır satır, yani
yalnız projenin sahibi görünür. Ayrıntı: [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md).

**Alt bilgi** (üç parça):

- solda kalın **"Eğitim Evi"**, altında "Okul portalı · 2026";
- ortada GitHub simgesi ve altında **"Kaynak kodu"** — üstüne gelince "Kaynak kodu GitHub'da"; projenin deposunu yeni sekmede açar;
- sağda **"Hakkında"**, **"SSS"**, **"Kullanım koşulları"** ([Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md)),
  **"Aydınlatma metni"** ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)) ve sitenin **iletişim bilgileri** (zarf
  simgeli e-posta, telefon simgeli numara; ikisi de yoksa görünmez — [İletişim bilgileri](iletisim-bilgileri.md)).

### Ziyaretçi

1. Herhangi bir girişsiz sayfada üstteki şeridi kullan:
   - girmek için **"Giriş"**, hesap açmak için **"Kayıt ol"**;
   - telefonuna kurmak için **"İndir"**;
   - görünümü değiştirmek için **ay/güneş**: bir dokunuşta açık ↔ koyu. Seçimin bu tarayıcıda saklanır; hiç seçmediysen cihazının
     ayarı (açık ya da koyu) kullanılır ([Görünüm ve dil](../ayarlar/gorunum-ve-dil.md));
   - projeyi tanımak için **"Hakkında"**, soruların cevabı için **"SSS"**.
2. **"Yapımcılar"**'a bas: liste açılır. Bir yapımcıya basınca GitHub sayfası yeni sekmede açılır. Listeyi kapatmak için listenin
   dışında bir yere bas ya da **Esc**'ye bas (Esc'te klavye odağı "Yapımcılar" düğmesine döner). Düğmeye yeniden basmak da kapatır.
3. Sayfanın en altında **"Kaynak kodu"** projenin deposunu, **"Kullanım koşulları"** ve **"Aydınlatma metni"** kendi sayfalarını açar.
   Yöneticiye yazmak için e-postaya bas (e-posta programın açılır) ya da telefon numarasına dokun (telefonda arama açılır).
4. Tek sayfalık uygulamanın dış sayfaları arasında (açılış, Hakkında, SSS, giriş, kayıt) şerit ve alt bilgi bağlantıları sayfayı
   **yeniden yüklemez**: içerik değişir, sayfa başa kaydırılır, adres çubuğu değişir, geri/ileri tuşları çalışır. "İndir", "Kullanım
   koşulları" ve "Aydınlatma metni" ayrı dosyalardır, tam sayfa açılır. Düz sayfalarda (aydınlatma metni, koşullar, indirme,
   bulunamadı) bütün bağlantılar tam sayfa açılır.
5. Bağlantıyı yeni sekmede açmak için Ctrl, ⌘ ya da Shift'e basılıyken ya da farenin orta tuşuyla tıkla.

### Giriş yapmış herkes

Öğrenci, veli, öğretmen, çalışan, müdür, servisçi:

- **Bugünkü site:** giriş yapınca bu şerit kalkar, uygulamanın kendi şeridi gelir (☰ menü, "İçerik Ara", + Ekle, Görünüm, Yenile,
  Bildirimler, Ayarlar, Uygulamayı yükle, Profil — [Üst şerit](../menu-ve-arama/ust-serit.md)). Uygulamadaki her sayfanın altında da
  kısa bir alt bilgi vardır: "**Eğitim Evi** — okul yönetim sistemi", altında "Aydınlatma metni · Bu sistem hakkında" ve iletişim
  satırı ([Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes), [İletişim bilgileri](iletisim-bilgileri.md)).
  Girişsiz şeridi giriş yapmışken yalnız düz sayfalarda (aydınlatma metni, koşullar, indirme, bulunamadı) görürsün; o sayfalar
  oturumu bilmez, orada da "Giriş" ve "Kayıt ol" yazar. Ay/güneş düğmesi giriş yapmışken uygulamada basıldığında seçimi hesabına da
  yazar; düz sayfalardaki düğme yalnız tarayıcıya yazar.
- **Tasarımda** (30 Eylül kararı, Tasarım 1 önizlemesi): "Ana siteye dön" ile açılışa gelirsin; şeritte "Giriş" ve "Kayıt ol" yerine
  tek bir **"Hesaba gir"** düğmesi durur (tanımdaki yazımı "Hesaba gir →"). Basınca kaldığın portal sayfasına dönersin; oturum
  kapanmışsa giriş kartı açılır ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).

### Yönetici ve destek

- **Bugünkü site:** sistem yöneticisi girişten sonra yönetim ekranına geçer; girişsiz şeridi giriş yapmışken kullanmaz. Yönetici bu
  şeridin ve alt bilginin iki parçasını değiştirir: **"Yapımcılar"** listesi ve alt bilgideki **iletişim bilgileri** (yönetim
  panelinde "Site Ayarları" — [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md#yönetici),
  [İletişim bilgileri](iletisim-bilgileri.md#yönetici)). Destek rolü bugün yok.
- **Tasarımda** (kullanıcı 27 Eylül: "adminler oturum açmışsa onlara da sağda hesaba gir olacak ama footer'ın solunda admin ve destek
  butonu olacak seni /panel/'e atan; bu sadece admin vb. giriş yaparsa"):
  1. Yönetici ya da destek giriş yapınca panele otomatik gitmez; açılışta sağ üstte "Hesaba gir" görür.
  2. Alt bilginin **solunda**, "Eğitim Evi" yazısının altında çerçeveli düğmeler çıkar: yöneticiye anahtar simgeli **"Yönetim"**
     (→ `/panel/admin`) ve soru işareti simgeli **"Destek paneli"** (→ `/panel/destek`); desteğe yalnız **"Destek paneli"**.
     860 px ve altında ortalanır.
  3. Bu düğmeler yalnız giriş yapmış yönetici ve destekte, yalnız ana sitedeyken görünür. Düğmenin adresi ve adı sunucunun
     oturum cevabında yalnız bu rollere gelir; herkese giden kodda "/panel" ya da "Yönetim" yazısı yoktur (gizli yönetim ilkesi).
     Ayrıntı: [Paneller](../yonetim/paneller.md).

### Tasarımda (Tasarım 1 önizlemesi)

Önizlemedeki şerit bugünkü sitenin şerididir; eklenenler:

- Sağ grup soldan sağa: **"TR ▾"** (dil seçici; dokununca dil listesi açılır — [Dil seçici](../dil/dil-secici.md)), **"İndir"**,
  ay/güneş, **"Eğitim içerikleri"** (simgeli; girişsiz video sayfası — [Eğitim içerikleri](../egitim-icerikleri/README.md)),
  **"Hakkında"**, **"SSS"**, **"Yapımcılar"**. "Eğitim içerikleri" 29 Eylül isteğiyle eklendi (bir ara fotoğrafta yoktu, geri kondu).
- Önizlemede "İndir" indirme sayfasının yeni hâlini açar (bilgisayar ve iPhone tarayıcıdan yükler, Android .apk ve Google Play —
  [İndir sayfası](../uygulama/indir-sayfasi.md)).
- Dar ekranda: 640 px ve altında "İndir" ve "Eğitim içerikleri" yalnız simge; 420 px ve altında "Yapımcılar" yazısı da gizlenir (GitHub
  simgesi kalır); "Giriş" ve "Kayıt ol" en az 44 px yükseklikte.
- Alt bilgi aynı; giriş yapmış yönetici ve destekte solda panel düğmeleri. Önizlemede iletişim satırı aydınlatma metni, koşullar ve
  bulunamadı sayfalarının altında da dolu görünür (bugünkü sitede orada boş kalıyor — aşağıda "Bilinen açık").
- Tanımdaki öneri (30 Eylül): telefonda kalabalık olmasın diye "Hakkında", "SSS", "Yapımcılar" dar ekranda bir "⋯" menüsüne toplanır;
  önizlemede bu yapılmadı, kullanıcı ayrıca karar vermedi.
- Tanımda: yöneticinin **site duyurusu** şeridi bu şeridin üstünde, bütün sayfalarda görünür ([Site duyurusu](../yonetim/site-duyurusu.md)).

## Kurallar ve sınırlar

- **Aynı şerit, iki kopya:** tek sayfalık uygulamanın şeridi `public/index.html`'de; düz sayfaların her birinde aynı şeridin bir kopyası
  durur. Birine bir şey eklenirse öbürlerine de eklenmeli.
- **Yenilemeden geçiş** yalnız tek sayfalık uygulamanın dış sayfaları arasındadır (açılış, Hakkında, SSS, giriş, kayıt, okul sayfası).
  Giriş yapmışken geri/ileri tuşları bu sayfaları açmaz; uygulamanın kendi geçmişi geçerlidir.
- **Yapımcılar listesi:** en çok 50 kişi, yöneticinin kaydettiği sırayla. Liste yönetim panelinden kaydedilmemişse depodaki
  `yapimcilar.json`'dan gelir. Liste sayfa başına bir kez yüklenir; yönetici değiştirirse açık sayfalar yenilenince görür.
- **İletişim:** yalnız ayarlanmışsa görünür; e-posta adresi sayfanın HTML kaynağında düz yazı olarak durmaz (adres toplayan botlar
  bulamasın), tarayıcıda sonradan yazılır; tıklayınca `mailto:` açılır. Telefon `tel:` bağlantısıdır. Ayrıntı:
  [İletişim bilgileri](iletisim-bilgileri.md).
- **Görünüm seçimi** tarayıcıda (`ee_tema`) saklanır: "sistem", "açık" ya da "koyu". Şeritteki düğme yalnız açık ↔ koyu yapar;
  "sistem"e dönmek giriş yaptıktan sonra Ayarlar'dandır.
- **Dar ekran:** 640 px ve altında "İndir" yalnız simge; 560 px ve altında sağ grup ikinci satıra iner ve satırı boydan boya, aralarında
  eşit boşlukla kaplar; 860 px ve altında alt bilginin üç parçası alt alta ve ortalı. Bütün düğmeler en az 44 px.
- **Yapımcı listesi klavyeyle de kapanır** (Esc) ve açıkken düğme "açık" bilgisini taşır (ekran okuyucu için).
- **Bilinen açık (kod değiştirilmedi):** düz sayfalarda (aydınlatma metni, koşullar, indirme, "Sayfa bulunamadı", "Okul bulunamadı")
  alt bilgideki iletişim satırı **boş kalır**: bu sayfaların küçük betiği yapımcı listesini doldurur ama iletişimi doldurmaz.
- **Bilinen açık (kod değiştirilmedi):** alt bilgideki e-posta bağlantısının adresi (`href`) yoktur; klavyeyle (Tab) odaklanılamaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Açılış sayfası](acilis.md) — şeridin ve alt bilginin en çok görüldüğü sayfa.
- [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md) — "Hakkında" bağlantısı ve "Yapımcılar" listesi.
- [İletişim bilgileri](iletisim-bilgileri.md) — alt bilgideki e-posta ve telefon.
- [Sık sorulan sorular](sss.md) — "SSS" bağlantısı.
- [Bulunamadı sayfaları](bulunamadi-sayfalari.md) — aynı şerit, düz sayfa olarak.
- [Kısa adresler](adresler.md) — şeritteki bağlantıların adresleri.
- [Rakamlar](rakamlar.md).

**İlgili:**

- [Giriş ve hesap](../giris-hesap/README.md) — "Giriş" ve "Kayıt ol"un açtığı kartlar.
- [Uygulama ve indirme](../uygulama/README.md) — [İndir sayfası](../uygulama/indir-sayfasi.md).
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — alt bilgideki iki belge.
- [Hesap ayarları](../ayarlar/README.md) — [Görünüm ve dil](../ayarlar/gorunum-ve-dil.md).
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — portalın kendi şeridi, [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md).
- [Site yönetimi](../yonetim/README.md) — [Paneller](../yonetim/paneller.md), [Site ayarları](../yonetim/site-ayarlari.md),
  [Site duyurusu](../yonetim/site-duyurusu.md).
- [Dil ve çeviri](../dil/README.md), [Eğitim içerikleri](../egitim-icerikleri/README.md) — tasarımda şeride eklenenler.

## Kod tarafı

- İşaretleme: `public/index.html` (`.site-ust`, `.site-hesap`, `.site-menu`, `#btnYapimcilar`, `#yapimciListe`, `.site-alt`,
  `#sIletisim`), düz sayfalar `public/kvkk/kvkk.html`, `public/kosullar/kosullar.html`, `public/indir/indir.html`, `public/404.html`,
  `public/okul-bulunamadi.html` — [public/KLASOR.md](../../public/KLASOR.md), [public/kvkk/KLASOR.md](../../public/kvkk/KLASOR.md),
  [public/indir/KLASOR.md](../../public/indir/KLASOR.md).
- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`siteMenusuIsaretle`, `siteGit`,
  `yapimcilariCiz`, `yapimcilarAcKapa`, `iletisimleriDoldur`, `disSayfalariKur`), [public/js/belge.md](../../public/js/belge.md) (düz
  sayfalarda ay/güneş ve Yapımcılar), [public/js/tema.md](../../public/js/tema.md),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`tema-degis`: girişliyse hesaba da yazar),
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (uygulamanın alt bilgisi `altBilgi`).
- Biçim: `29-dis-sayfalar.css` (üst şerit, yapımcı listesi, alt bilgi, dar ekran) — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Sunucu: [sunucu/site.md](../../sunucu/site.md) (`/api/site`: iletişim ve yapımcılar),
  [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md), [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md),
  [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md) (`/api/site` yönetim adresini ele vermiyor).

## Sık sorulanlar

- **Koyu görünüm var mı?** Evet. Üstteki ay düğmesiyle koyu, güneşle açık görünüme geçersin. Seçimin bu cihazda hatırlanır, giriş
  yaptıysan hesabına da yazılır; seçmediysen telefonunun ya da bilgisayarının ayarı kullanılır (SSS'deki cevap).
- **"Yapımcılar"a basınca neden doğrudan bir GitHub sayfasına gitmiyor?** Kullanıcı öyle istedi: önce her zaman liste açılır, sonra
  istediğin yapımcıyı seçersin.
- **Alt bilgide iletişim bilgisi neden görünmüyor?** Ya sistem yöneticisi henüz e-posta ya da telefon yazmamıştır ya da düz bir
  sayfadasındır (aydınlatma metni, koşullar, indirme, bulunamadı; orada boş kalıyor). Açılışa ya da Hakkında'ya bak.
- **Giriş yaptım ama şeritte hâlâ "Giriş" yazıyor.** Düz bir sayfadasın (ör. aydınlatma metni); bu sayfalar oturumu bilmez. Logoya
  basınca portalına dönersin.

## Sırada

- "Üst şerit sadeleştirme" (DEVAM iş 29): "Hesaba gir", "Ana siteye dön", dar ekranda "⋯" önerisi.
- "Paneller … alt bilgide yalnız yönetici/destek için Yönetim düğmesi" (iş 5).
- "Çok dil" (iş 22): "TR ▾" ve şerit metinlerinin çevrilmesi.
- "Eğitim içerikleri" (iş 17): şeritteki bağlantı.
- "Sistem" (iş 4): site duyurusu şeridi.
- Düz sayfalarda iletişim satırının doldurulması (bilinen açık; `belge.js` aynı `/api/site` cevabını zaten alıyor).
