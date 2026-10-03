# Açılış sayfası ve girişsiz sayfalar · Hakkında ve Yapımcılar

**Durum:** Kodda var; tasarımda ek olarak yapımcı listesi `/panel/admin`'deki "Site ayarları"ndan düzenlenir ve giriş yapmış kişi Hakkında'yı "Ana siteye dön" ile görür

Eğitim Evi'nin ne olduğunu, bilgilerin nerede durduğunu, nasıl yapıldığını ve kimin yaptığını anlatan `/hakkinda` sayfası; üst
şeritteki "Yapımcılar" listesi ve giriş yapmış kişinin alt bilgideki "Bu sistem hakkında" penceresi.

## Ne işe yarar

Ziyaretçi projeyi kısaca tanır: tek hesapla birden çok rol, bilgilerin Eğitim Evi'nin sunucusunda ve her okulun ayrı durduğu, reklam
olmadığı, hangi teknolojiyle yazıldığı, kimlerin yaptığı ve yöneticiye nasıl ulaşılacağı. "Yapımcılar" listesi projede emeği geçenleri
GitHub sayfalarıyla gösterir. Kullanıcının isteği (26 Eylül): üstte "Yapımcılar", oradan projeyi yapanın GitHub sayfasına gidilsin;
aynı gün düzeltme: "Yapımcılar"a basınca doğrudan bir sayfaya atmasın, "her zaman alta liste göstersin".

## Nereden açılır

- **Hakkında:** üst şeritte ya da alt bilgide **"Hakkında"** (girişsiz bütün sayfalarda). Adres `egitimevi.org/hakkinda`; İngilizce eşi
  `/about` aynı sayfayı açar ([Kısa adresler](adresler.md)). Sekme başlığı **"Hakkında — Eğitim Evi"**.
- **Yapımcılar listesi:** üst şeritte GitHub simgeli **"Yapımcılar"** düğmesi (girişsiz bütün sayfalarda; açılır liste). Aynı liste
  Hakkında sayfasında "Yapımcılar" başlığı altında da durur.
- **"Bu sistem hakkında":** giriş yaptıktan sonra uygulamadaki her sayfanın altındaki alt bilgide.
- **Yönetici için** (listeyi düzenlemek): yönetim panelinde sol menüde "Site" başlığı altındaki **"Site Ayarları"** ya da ana sayfadaki
  **"Site Ayarları"** kutucuğu (alt yazısı "İletişim, yapımcılar, okul adresleri") → **"Yapımcılar"** kartı.

## Adım adım

### Hakkında sayfasının düzeni

Yukarıdan aşağıya (üst şerit ve alt bilgi arasında):

1. Küçük hap etiket **"Hakkında"**, başlık **"Eğitim Evi nedir?"**, alt yazı: "Okulların günlük işlerini (ödev, sınav, ders programı,
   devamsızlık, mesaj, servis) tek yerde toplayan, kaynak kodu açık bir okul portalı. Bir okul grup projesi olarak başladı."
2. İki sütunlu (860 px ve altında tek sütun) bölümler:
   - **"Nasıl çalışır?"** — "Öğrenci ve servisçi hesabını okul açar. Veli, öğretmen ve müdür kendi hesabını açar; tek hesapla birden
     çok rol olur: bir okulda öğretmen, başka bir okulda müdür, çocuğunun velisi. Hepsi sol üstteki menüde alt alta durur; aralarında
     oradan geçersin."
   - **"Bilgiler nerede?"** — "Eğitim Evi'nin sunucusunda, PostgreSQL veritabanında; her okulun verisi ayrıdır. Reklam yok; bilgiler
     kimseye satılmaz ya da aktarılmaz. Ayrıntısı **aydınlatma metninde**." (bağlantı `/kvkk/kvkk.html`)
   - **"Nasıl yapıldı?"** — "Sunucu Node.js, veritabanı PostgreSQL. Hazır çatı ya da arayüz kütüphanesi yok; tek dış paket veritabanı
     sürücüsü. Bütün kod GitHub'da:" ve projenin deposuna bağlantı (yeni sekme).
   - **"Yapımcılar"** — yapımcı listesi, yan yana satırlar hâlinde (aşağıda).
   - **"İletişim"** — sitenin e-postası ve telefonu; ikisi de yoksa bu bölüm hiç görünmez ([İletişim bilgileri](iletisim-bilgileri.md)).
3. Altta rakam kartı: "okul kullanıyor", "kayıtlı kişi", "kişi şu an açık" ([Rakamlar](rakamlar.md)).

### Ziyaretçi

**Hakkında'yı okumak:**

1. Üst şeritte ya da alt bilgide **"Hakkında"**'ya bas. Sayfa yeniden yüklenmeden açılır, üst şeritteki "Hakkında" ana renkte görünür.
2. Bölümleri oku. "aydınlatma metninde" bağlantısı aydınlatma metnini tam sayfa açar; GitHub bağlantısı depoyu yeni sekmede açar.
3. Yöneticiye ulaşmak için "İletişim" bölümündeki e-postaya bas (e-posta programın açılır) ya da telefona dokun.

**Yapımcılar listesini açmak:**

1. Üst şeritte **"Yapımcılar"**'a bas. Düğmenin altında bir liste açılır.
2. Her satırda yapımcının adı ve altında küçük yazıyla katkısı (ör. "Proje sahibi"). GitHub adı olan satırın başında GitHub simgesi
   durur; basınca o kişinin GitHub sayfası yeni sekmede açılır. GitHub adı olmayan satır simgesiz, yalnız yazıdır.
3. Listenin altındaki **"Projenin GitHub sayfası"** deponun kendisini açar.
4. Kapatmak için listenin dışına bas, **Esc**'ye bas ya da düğmeye yeniden bas.

### Giriş yapmış herkes

Öğrenci, veli, öğretmen, çalışan, müdür, servisçi:

- **Bugünkü site:** Hakkında'yı giriş yapmışken açamazsın (`/hakkinda` adresinde giriş yaparsan adres `/`'a döner). Bunun yerine
  uygulamadaki her sayfanın altında **"Eğitim Evi** — okul yönetim sistemi" ve altında **"Aydınlatma metni · Bu sistem hakkında"**
  durur. **"Bu sistem hakkında"**'ya basınca **"Kaynakça"** başlıklı bir pencere açılır:
  - "Bu sistem Eğitim Evi projesi kapsamında geliştirilmiştir."
  - (küçük ve soluk) "Tüm veriler Eğitim Evi'nin sunucusunda saklanır; her okul yalnız kendi verisini görür. Veriler üçüncü taraflarla
    paylaşılmaz ve sistemde reklam bulunmaz."
  
  (Kullanıcının 30 Eylül uyarısı: bu pencere önceden "Tüm veriler okulunun kendi sunucusunda saklanır" diyordu; bütün okulların verisi
  tek merkezi sunucuda durduğu için metin düzeltildi.) "Aydınlatma metni" aydınlatma metnini yeni sekmede açar.
- **Tasarımda** (Tasarım 1 önizlemesi): profil menüsündeki **"Ana siteye dön"** ile açılışa gelir, oradan "Hakkında"yı ve
  "Yapımcılar"ı ziyaretçi gibi kullanırsın; sağ üstteki **"Hakkında"** sayfası aynıdır. Önizlemede portal sayfalarının altında bugünkü
  "Bu sistem hakkında" satırı yok; kullanıcı bu satır için ayrıca karar vermedi (2 Ekim: üzerine konuşulmamış ekranlar bugünkü gibi
  kalır).

### Yönetici

Yapımcı listesini sistem yöneticisi düzenler. Liste yönetim panelinde kaydedilmemişse depodaki `yapimcilar.json` dosyasından gelir;
projeye katılan biri kendini o dosyaya ekleyebilir (ad, GitHub adı, katkı). Sunucu dosyanın değişip değişmediğine en çok 30 saniyede
bir bakar.

**Bugünkü yönetim paneli** ("Site Ayarları" sayfası; sayfanın başında: "Sitenin herkese görünen bilgileri ve zamanlamaları. Kaydettiğin
değer hemen geçerli olur; sunucuyu yeniden başlatmak gerekmez."):

1. **"Yapımcılar"** kartını bul. Açıklaması: "Sitenin üst şeridindeki **Yapımcılar** listesi ve Hakkında sayfası. GitHub kullanıcı adı
   yazılırsa ad o kişinin GitHub sayfasına bağlanır. En fazla 50 kişi; sırayı oklarla değiştir."
2. Kartta **"Şu anki değer:"** ve değerin nereden geldiği: **"Panelden kaydedildi"** (yanında kaydeden ve zaman) ya da
   **"yapimcilar.json"**.
3. Her yapımcı numaralı bir satırdır: **"Ad"**, **"GitHub kullanıcı adı"** (yer tutucu "İsteğe bağlı"), **"Katkısı"** (yer tutucu
   "İsteğe bağlı") kutuları ve sağda üç küçük düğme: yukarı ok ("Yukarı taşı"), aşağı ok ("Aşağı taşı"), çarpı ("Listeden çıkar").
   İlk satırın yukarı, son satırın aşağı oku sönüktür.
4. Yeni kişi için **"Yapımcı ekle"**: boş bir satır eklenir, imleç adına geçer. Liste boşsa: "Listede kimse yok. Boş liste kaydedilirse
   sayfalarda yalnız projenin sahibi görünür."
5. **"Listeyi kaydet"**'e bas (düğme "Kaydediliyor..." olur). Tamamen boş bırakılan satırlar gönderilmez. GitHub kutusuna "@ad" ya da
   GitHub sayfasının adresi yapıştırıldıysa yalnız ad alınır. Hata varsa ilgili kutunun altında kırmızı yazar, sayfa ilk hataya gider.
6. Olursa kart yeniden çizilir, kartın altında ileti çıkar (ör. "Yapımcılar kaydedildi."); üst şeritteki liste ve Hakkında hemen
   güncellenir (yönetim sekmesinde; öbür açık sayfalar yenilenince).
7. Panelden kaydedilmiş liste varsa **"yapimcilar.json listesine dön"** düğmesi çıkar. Basınca onay sorulur: "Panelden kaydedilen
   yapımcı listesi silinsin mi? Liste depodaki yapimcilar.json dosyasından gelir." Onaylarsan düğme "Siliniyor..." olur, liste dosyadaki
   hâline döner ("Yapımcılar panelden kaydedilen değeri bıraktı.").

Her kayıt ve geri dönüş yöneticinin işlem kaydına yazılır (tür `site.yapimcilar`; ör. "2 yapımcı: …"); okulsuz yazıldığı için
müdürler görmez ([İşlem kaydı](../islem-kaydi/README.md)).

**Tasarımda** (`/panel/admin`, Tasarım 1 önizlemesi — [Site ayarları](../yonetim/site-ayarlari.md)): "Site ayarları" bölümünde
**"Yapımcılar"** kartı; açıklaması "Üst şeritteki “Yapımcılar” listesi. GitHub adı yazılırsa ad o kişinin GitHub sayfasına bağlanır;
sıra oklarla değişir." Satırlarda yer tutucular "Ad", "GitHub kullanıcı adı (isteğe bağlı)", "Katkısı (ör. Arayüz)"; sağda yukarı,
aşağı ve çöp kutusu düğmeleri; altta **"Yapımcı ekle"**, (panelden kaydedilmişse) **"Varsayılana dön"** ve **"Listeyi kaydet"**;
en altta "Şu anki değer:" ve "Panelden kaydedildi" ya da "Varsayılan". Kaydedince üst şeritteki liste hemen değişir.

### Destek

Destek rolü bugün yok. Tasarımda destek ekibi yapımcı listesini düzenlemez (site ayarları yalnız yöneticinin `/panel/admin`'inde);
Hakkında'yı herkes gibi görür ([Destek ekibi](../destek/destek-ekibi.md)).

## Kurallar ve sınırlar

- **Yapımcı sayısı:** en çok 50. 51.'yi eklemeye çalışınca: "En fazla 50 yapımcı eklenebilir."
- **Ad:** zorunlu, en çok 60 karakter. Boşsa "Adını yaz.", uzunsa "Ad en fazla 60 karakter olabilir."
- **GitHub kullanıcı adı:** isteğe bağlı; yalnız harf, rakam ve tire, tireyle başlayıp bitemez, en çok 39 karakter. Uymazsa: "Yalnız harf,
  rakam ve tire olabilir; tireyle başlayıp bitemez (en fazla 39 karakter)." Sunucunun iletisi satır numarasıyla gelir: "2. yapımcı:
  GitHub kullanıcı adında yalnız harf, rakam ve tire olabilir; tireyle başlayıp bitemez (en fazla 39 karakter)."
- **Katkı:** isteğe bağlı, en çok 80 karakter: "Katkı en fazla 80 karakter olabilir." (Tasarım 1 önizlemesindeki kutu 60 karakter alıyor; kurallı
  sınır 80.)
- Sunucunun öbür iletileri: "Yapımcı listesi geçersiz.", "<n>. yapımcı: bilgisi eksik.", "<n>. yapımcı: adını yaz.", "<n>. yapımcı: ad
  en fazla 60 karakter olabilir.", "<n>. yapımcı: katkı en fazla 80 karakter olabilir."; aynı liste yeniden kaydedilirse "Yapımcılar
  zaten böyle.", dosyadaki listeyle aynısı kaydedilirse "Yapımcılar panelden kaydedildi; değer aynı kaldı."
- **Öncelik:** panelden kaydedilen liste (veritabanı) > depodaki `yapimcilar.json` > boş liste. Liste boşsa sayfadaki hazır satır
  (projenin sahibi) kalır.
- **Gösterim:** ad ve katkı düz yazıdır (HTML işlenmez); GitHub adı olan satır `https://github.com/<ad>` bağlantısıdır, yeni sekmede ve
  açan sayfaya erişim vermeden (`noopener`) açılır.
- **Yükleme:** liste sayfa başına bir kez gelir. Yönetici değiştirince yönetim sekmesindeki şerit hemen, öbür açık sayfalar yenilenince
  değişir.
- **Hakkında'nın metinleri** koddadır; yönetici panelden değiştiremez (yalnız yapımcılar ve iletişim).
- **Kaynak kodu ifadesi:** Hakkında'da "kaynak kodu açık bir okul portalı" yazar; kullanıcının 3 Ekim kararıyla depo açık kaynak değildir
  ("Tüm hakları saklıdır"; kod yalnız incelenebilsin diye herkese açık). Aşağıda "Sırada".

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) — "Hakkında" ve "Yapımcılar" düğmelerinin yeri.
- [İletişim bilgileri](iletisim-bilgileri.md) — Hakkında'daki "İletişim" bölümü.
- [Rakamlar](rakamlar.md) — Hakkında'nın altındaki rakam kartı.
- [Açılış sayfası](acilis.md), [Sık sorulan sorular](sss.md), [Kısa adresler](adresler.md) (`/hakkinda`, `/about`).

**İlgili:**

- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) ("Bilgiler nerede?"
  bölümünün bağlantısı), [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md).
- [Site yönetimi](../yonetim/README.md) — [Site ayarları](../yonetim/site-ayarlari.md), [Paneller](../yonetim/paneller.md).
- [İşlem kaydı](../islem-kaydi/README.md) — `site.yapimcilar` kaydı.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md),
  [Profil menüsü](../menu-ve-arama/profil-menusu.md).
- [Portallar ve + Ekle](../portallar/README.md) — "Nasıl çalışır?"daki "tek hesapla birden çok rol".

## Kod tarafı

- İşaretleme: `public/index.html` (`#vHakkinda`, `#hIletisimBolum`, `#hIletisim`, `[data-yapimcilar]`, `#btnYapimcilar`,
  `#yapimciListe`) — [public/KLASOR.md](../../public/KLASOR.md).
- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`yapimcilariCiz`,
  `yapimcilarAcKapa`, `EYLEMLER['yapimcilar']`, `iletisimCiz`), [public/js/belge.md](../../public/js/belge.md) (düz sayfalarda liste),
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`altBilgi`: "Bu sistem hakkında"),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`kaynakca`: "Kaynakça" penceresi).
- Yönetim: [public/js/yonetim/09b-site-ayarlari.md](../../public/js/yonetim/09b-site-ayarlari.md) ("Yapımcılar" kartı),
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (menü ve kutucuk).
- Sunucu: [sunucu/site.md](../../sunucu/site.md) (`yapimcilar.json` okuma, `YAPIMCI_EN_COK`, `GITHUB_ADI`, `/api/site`),
  [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (doğrulama, kayıt, işlem kaydı).
- Testler: [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md), [testler/test-adresler.md](../../testler/test-adresler.md)
  (`/hakkinda`, `/about`, sekme başlığı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Açılış sayfası, giriş ve site ayarları").

## Sık sorulanlar

- **Bilgilerim nerede duruyor?** Eğitim Evi'nin sunucusunda; her okulun verisi ayrıdır, yalnız o okulun yetkilileri erişir; reklam ya da
  satış için kimseyle paylaşılmaz (Hakkında ve SSS; ayrıntısı [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).
- **Projeye katıldım; adımı listeye nasıl eklerim?** Depodaki `yapimcilar.json` dosyasına kendi satırını ekle (ad, GitHub adı, katkı) ya da
  sistem yöneticisinden panelden eklemesini iste. Panelden kaydedilmiş bir liste varsa dosya değişikliği görünmez; yönetici
  "yapimcilar.json listesine dön" demelidir.
- **Bir yapımcının adına basınca hiçbir şey açılmıyor.** O satırda GitHub adı yok; satır yalnız yazıdır.

## Sırada

- Kullanıcının 3 Ekim kararı ("Tüm hakları saklıdır"; depo açık kaynak değil) Hakkında'daki "kaynak kodu açık bir okul portalı"
  cümlesine henüz yansımadı (SSS'de "kaynak kodu herkese açıktır", kullanım koşullarında da benzer cümleler var) — metin "kaynak kodu
  incelenebilsin diye herkese açık" anlamına çekilmeli.
- "Paneller /panel/admin ve /panel/destek" (DEVAM iş 5): yapımcılar ve öbür site ayarları `/panel/admin`'e taşınır.
- "Üst şerit sadeleştirme" (iş 29): giriş yapmış kişi "Ana siteye dön" ile Hakkında'yı görür.
- "Çok dil" (iş 22): Hakkında metinleri çeviri kataloğuna (yapımcı adları ve katkılar çevrilmez).
