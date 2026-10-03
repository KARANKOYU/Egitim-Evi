# Açılış sayfası ve girişsiz sayfalar · İletişim bilgileri

**Durum:** Kodda var; tasarımda ek olarak ayar `/panel/admin`'deki "Alt bilgideki iletişim" kartından yapılır ve satır aydınlatma metni, koşullar ve bulunamadı sayfalarının altında da görünür

Eğitim Evi yöneticisine ulaşmak için sitenin e-posta adresi ve telefonu: girişsiz sayfaların alt bilgisinde, Hakkında'da, uygulamanın
her sayfasının altında ve "+ Ekle → Müdür" penceresinde.

## Ne işe yarar

Okulunu Eğitim Evi'ne açtırmak isteyen müdür, kişi kodunu ve okulunun adını sistem yöneticisine iletmelidir; genel bir soru ya da sorun
için de yöneticiye yazılır. Kullanıcının isteği (26 Eylül): "altta iletişim bilgileri", kişisel e-posta adresi sayfanın kaynağında
görünmeden; telefon başta boş; değerler sunucudaki bir ayar dosyasına yazılınca siteye geçsin. Bugün değer ya yönetim panelinden
ya da sunucudaki `data/config.yml` dosyasından gelir; depoya (herkese açık) hiç yazılmaz.

## Nereden açılır

- **Girişsiz sayfaların alt bilgisi**, sağda, "Aydınlatma metni"nin yanında: zarf simgeli e-posta ve telefon simgeli numara
  ([Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md)).
- **Hakkında** sayfasında **"İletişim"** bölümü ([Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md)).
- **Giriş yaptıktan sonra** uygulamanın her sayfasının en altında, "Aydınlatma metni · Bu sistem hakkında" satırının altında.
- **"+ Ekle" → "Müdür"** penceresinde **"Yöneticimize ulaş"** başlığı altında ([+ Ekle penceresi](../portallar/ekle-penceresi.md)).
- **Yönetici için** (değiştirmek): yönetim panelinde **"Site Ayarları"** → **"İletişim bilgileri"** kartı.

## Adım adım

### Ziyaretçi

1. Açılışın, Hakkında'nın, SSS'nin ya da giriş kartının en altına in. Sağda e-posta ve telefon görünür (yalnız ayarlanmış olanlar).
2. **E-postaya bas:** cihazındaki e-posta programı alıcısı dolu yeni bir iletiyle açılır.
3. **Telefona dokun:** telefonda arama ekranı açılır (numaradaki boşluk, tire ve parantezler aramada atılır; ekranda yöneticinin
   yazdığı gibi görünür).
4. Hakkında'da aynı iki bağlantı **"İletişim"** başlığı altında durur; ikisi de yoksa bu bölüm hiç görünmez.
5. SSS'deki "Eğitim Evi yöneticisine nasıl ulaşırım?" cevabı da buraya yönlendirir: "Sayfanın altındaki e-posta ve telefon Eğitim Evi
   yöneticisinindir …" ([Sık sorulan sorular](sss.md)).

### Giriş yapmış herkes

Öğrenci, veli, öğretmen, çalışan, müdür, servisçi, yönetici:

- Uygulamadaki her sayfanın altında kısa bir alt bilgi: "**Eğitim Evi** — okul yönetim sistemi", "Aydınlatma metni · Bu sistem
  hakkında" ve altında iletişim satırı (e-posta ve telefon; ikisi de yoksa satır gizli). Bilgi uygulama açılınca bir kez sunucudan
  alınır, her sayfa çizildiğinde satıra yazılır.
- **Tasarımda** (Tasarım 1 önizlemesi): portal sayfalarının altında bu satır yok; yöneticiye ulaşmak için "Ana siteye dön" ile açılışın
  alt bilgisine ya da Hakkında'ya gidilir. Kullanıcı bu konuda ayrıca karar vermedi. Okul içi konular için tasarımda "Destek"
  sayfası da var ([Destek sayfası](../destek/destek-sayfasi.md)).

### Veli, öğretmen, çalışan ve müdür

Okulunu açtırmak isteyen yetişkin için:

1. Giriş yap, sağ üstteki **"+ Ekle"** → **"Müdür"**.
2. Pencere: "Yöneticimize okulunun adını ve bu kodu ver. Okulunu ve adresini (…/school/okulun-adi) açıp seni müdür yapar; okul sol
   üstteki menüde görünür." ve altında kişi kodun ([Kişi kodu](../portallar/kisi-kodu.md)).
3. Altında **"Yöneticimize ulaş"** başlığı ve e-posta ile telefon bağlantıları. Hiçbiri ayarlanmamışsa yalnız: "Yöneticimize sayfanın
   altındaki iletişim bilgilerinden ulaşabilirsin." (Bu durumda alt bilgide de bir şey görünmez; aşağıdaki "Kurallar".)
4. E-postaya basıp kişi kodunu ve okulun adını yaz ya da yöneticiyi ara.

### Yönetici

**Bugünkü yönetim paneli** — "Site Ayarları" → **"İletişim bilgileri"** kartı:

1. Açıklama: "Sayfaların altında ve Hakkında sayfasında görünür. Okulunu açtırmak isteyen kişi de **+ Ekle > Müdür** penceresinde sana bu
   bilgilerle ulaşır. İkisi de boş bırakılabilir."
2. **"Şu anki değer:"** ve kaynağı: **"Panelden kaydedildi"** (kaydeden ve zaman), **"data/config.yml"** ya da **"Varsayılan"** (boş).
3. İki kutu yan yana: **"E-posta"** (en çok 254 karakter; yer tutucu örnek bir adres) ve **"Telefon"** (en çok 24 karakter; yer tutucu
   örnek bir numara; altında "Ülke koduyla ya da başında 0 ile yaz; sayfada yazdığın gibi görünür.").
4. **"Kaydet"**'e bas (düğme "Kaydediliyor..."). Hata varsa kutunun altında kırmızı ileti (aşağıdaki liste). Olursa kart yeniden çizilir,
   altında yeşil "İletişim bilgileri kaydedildi."; yönetim sekmesindeki alt bilgi hemen değişir.
5. Panelden kaydedilmiş değer varsa **"Varsayılana dön"**: "Panelden kaydedilen değer silinsin mi? Ayar sunucudaki data/config.yml
   dosyasındaki değere, orada da yoksa varsayılana döner." Onaylarsan "İletişim bilgileri panelden kaydedilen değeri bıraktı."
6. Her kayıt işlem kaydına yazılır (tür `site.iletisim`, "e-posta: …, telefon: …"; boş alan "(boş)"); okulsuz yazıldığı için müdürler
   görmez.

Panel yerine sunucudaki `data/config.yml` dosyasına da yazılabilir (`iletisim:` altında `eposta:` ve `telefon:`; örneği
`belge/config.ornek.yml`); dosyadaki değişiklik en geç 30 saniyede siteye geçer. Panelde kaydedilen değer dosyadakinden önce gelir.

**Tasarımda** (`/panel/admin`, Tasarım 1 önizlemesi — [Site ayarları](../yonetim/site-ayarlari.md)): kartın adı **"Alt bilgideki
iletişim"**; açıklaması "Sayfaların alt bilgisinde ve Hakkında’da görünür. İkisi de boş bırakılabilir."; aynı iki kutu ve ipucu, altta
(panelden kaydedilmişse) **"Varsayılana dön"** ve **"Kaydet"**, en altta "Şu anki değer:". Kullanıcının isteği (27 Eylül): panelde
"alttaki footer'daki e-postayı elleme" gibi site ayarları.

### Destek

Destek rolü bugün yok. Tasarımda iletişim bilgilerini yalnız yönetici değiştirir; destek herkes gibi görür.

## Kurallar ve sınırlar

- **Kaynak sırası:** panelden kaydedilen (veritabanı) > `data/config.yml` > boş. Değişiklik sunucu yeniden başlamadan geçerli olur.
- **Boşsa görünmez:** e-posta da telefon da yoksa alt bilgideki yer, Hakkında'daki "İletişim" bölümü ve uygulamadaki satır gizlenir;
  "+ Ekle → Müdür"de yalnız "Yöneticimize sayfanın altındaki iletişim bilgilerinden ulaşabilirsin." kalır. Bu durumda okulunu açtırmak
  isteyen kişi yöneticiye ulaşamaz: sunucu açılışta "! Iletisim bilgisi yok" diye uyarır; yayından önce en az birinin doldurulması
  gerekir (KILAVUZ).
- **E-posta HTML'e yazılmaz:** girişsiz sayfalarda ve uygulamanın alt bilgisinde adres sayfanın kaynağında düz yazı olarak durmaz, tarayıcıda
  sonradan yazılır (adres toplayan botlar bulamasın); bağlantının adresi yoktur, tıklayınca `mailto:` açılır. "+ Ekle → Müdür"
  penceresinde ise (yalnız giriş yapmış kişi görür) normal `mailto:` bağlantısıdır.
- **E-posta kuralı** (hesap e-postalarıyla aynı, üstüne sayfaya bağlantı olarak girdiği için daha sıkı): yalnız İngilizce harf, rakam ve
  işaretler; `< > " '` olmaz. İletiler:
  - "E-posta adresinde Türkçe ya da başka alfabeden harf olamaz (ı, ş, ğ, ü, ö, ç gibi); İngilizce harflerle yaz."
  - "E-posta adresi geçerli değil (ör. …)." (parantezde örnek bir adres yazar)
- **Telefon kuralı:** en çok 24 karakter; yalnız rakam, boşluk, `+`, tire ve parantez; ülke koduyla ya da başında 0 ile. İletiler:
  - "Telefonda yalnız rakam, boşluk, +, tire ve parantez olabilir (en fazla 24 karakter)."
  - "Telefon numarasını ülke koduyla yaz (ör. …)" (parantezde örnek bir numara yazar)
  - "Türkiye numarası 10 haneli olmalı (5xx xxx xx xx)"
  - Sunucunun öbür iletileri: "İletişim bilgisi eksik.", "İletişim bilgisi geçersiz.", "Değer yok."
- **Aynı değer:** yeniden kaydedilirse "İletişim bilgileri zaten böyle."; dosyadaki değerle aynısı kaydedilirse "İletişim bilgileri panelden
  kaydedildi; değer aynı kaldı." (artık panel değeri geçerlidir; dosya sonra değişse de panel değeri kalır).
- **Yükleme:** bilgi sayfa başına bir kez gelir; yönetici değiştirince öbür açık sayfalar yenilenene kadar eskisini gösterir.
- `/api/site` cevabında yönetim adresini ele veren hiçbir şey olmaz (gizli yönetim ilkesi).
- **Bilinen açık (kod değiştirilmedi):** düz sayfalarda (aydınlatma metni, kullanım koşulları, indirme, "Sayfa bulunamadı", "Okul
  bulunamadı") alt bilgideki iletişim satırı boş kalır.
- **Bilinen açık (kod değiştirilmedi):** girişsiz sayfalardaki e-posta bağlantısı adressiz olduğu için klavyeyle (Tab) odaklanılamaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) — satırın durduğu alt bilgi.
- [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md) — "İletişim" bölümü; "Bu sistem hakkında".
- [Rakamlar](rakamlar.md) — aynı `/api/site` cevabı.
- [Sık sorulan sorular](sss.md) — "Eğitim Evi yöneticisine nasıl ulaşırım?", "Bir hata buldum."
- [Açılış sayfası](acilis.md) — "Okulun nasıl başlar?" 2. adım.

**İlgili:**

- [Portallar ve + Ekle](../portallar/README.md) — [+ Ekle penceresi](../portallar/ekle-penceresi.md),
  [Kişi kodu](../portallar/kisi-kodu.md).
- [Site yönetimi](../yonetim/README.md) — [Site ayarları](../yonetim/site-ayarlari.md), [Okul açma](../yonetim/okul-acma.md).
- [Destek talepleri](../destek/README.md) — tasarımdaki "Destek" sayfası.
- [İşlem kaydı](../islem-kaydi/README.md) — `site.iletisim`.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`iletisimCiz`, `iletisimleriDoldur`,
  `EYLEMLER['site-eposta']`), [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`altBilgi`,
  `[data-iletisim]`), [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) (`yoneticiIletisimi`,
  `yoneticiIletisimHtml`: "Yöneticimize ulaş"), [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (uygulama
  açılınca `siteBilgisiYukle`), [public/js/belge.md](../../public/js/belge.md) (düz sayfalar; iletişimi doldurmuyor).
- Yönetim: [public/js/yonetim/09b-site-ayarlari.md](../../public/js/yonetim/09b-site-ayarlari.md) ("İletişim bilgileri" kartı).
- Sunucu: [sunucu/site.md](../../sunucu/site.md) (`ayar('iletisim')`, `iletisimVarMi`, `EPOSTA`, `config.yml` okuma),
  [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (doğrulama, kayıt), [sunucu/ortak.md](../../sunucu/ortak.md)
  (`epostaSorunu`, `telefonSorunu`), [sunucu/index.md](../../sunucu/index.md) (açılıştaki uyarı).
- Biçim: `29-dis-sayfalar.css` (`.site-iletisim`, `.site-iletisim-bag`), `06-modal.css` (`.footer-iletisim`),
  `28-yetiskin-hesap.css` (`.ekle-iletisim-bag`) — [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md), [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İletişim bilgileri kodda değil").

## Sık sorulanlar

- **Eğitim Evi yöneticisine nasıl ulaşırım?** Sayfanın altındaki e-posta ve telefon yöneticinindir; hesabın varsa "+ Ekle → Müdür"
  ekranında da yazar. Okulunu açtırmak, müdür olarak eklenmek ya da genel bir soru için oradan yaz. Öğrenci, not ve devamsızlık gibi okul
  içi konular için okulunun yönetimine başvur (SSS'deki cevap).
- **Alt bilgide iletişim görünmüyor.** Ya hiç ayarlanmamış ya da düz bir sayfadasın (aydınlatma metni, koşullar, indirme, bulunamadı);
  açılışın ya da Hakkında'nın altına bak.
- **E-postaya basınca bir şey olmuyor.** Cihazında e-posta programı tanımlı değil; adresi elle kopyalayıp kendi e-postandan yaz.

## Sırada

- Düz sayfaların alt bilgisinde iletişim satırının doldurulması (bilinen açık; `belge.js` aynı `/api/site` cevabını zaten alıyor;
  e-posta yine HTML'e yazılmadan ve tıklama işleviyle).
- "Paneller /panel/admin ve /panel/destek" (DEVAM iş 5): ayar `/panel/admin`'e taşınır.
- "Kullanıcı arama … destek talepleri (/destek)" (iş 6): okul içi olmayan konular için destek talebi yolu.
