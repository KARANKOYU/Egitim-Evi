# Açılış sayfası ve girişsiz sayfalar · Sayfa bulunamadı ve Okul bulunamadı

**Durum:** Kodda var; tasarımda ek olarak yeni gizli adresler (paneller, okul düzenleme, kullanıcı sayfası) yetkisi olmayana aynı "Sayfa bulunamadı"yı verir

Eğitim Evi'nde olmayan bir adresi açana "Sayfa bulunamadı", olmayan bir okulun adresini açana "Okul bulunamadı" gösteren iki sayfa;
ikisinde de "Ana sayfaya dön" ve "Okulunu ara".

## Ne işe yarar

Yanlış yazılmış, eskimiş ya da hiç olmamış bir adreste boş ya da bozuk bir ekran yerine ne olduğunu söyleyen düzgün bir sayfa çıkar ve
kişiyi doğru yere yönlendirir. Kullanıcının istekleri (26 Eylül): "/ 'tan sonra yazdığımız geçerli değilse 'bu sayfa bulunamadı' yazsın
ve ortada ana ekrana dön butonu olsun"; "`/school/olmayanisim` yazınca 'okul bulunamadı' dönsün ve gene ana sayfaya dön yeri". Aynı
sayfa, yetkisi olmayana gizli yönetim adresini de belli etmez.

## Nereden açılır

Kendiliğinden gelir; menüden açılmaz:

- **"Sayfa bulunamadı"** — sitede karşılığı olmayan her adres (ör. `/olmayan`, `/kvkk/olmayan.html`), `/school/` ile başlayıp okul
  adresi kuralına uymayan adres (ör. alt çizgili ya da Türkçe harfli), `.md` belgeleri, `_` ya da `.` ile başlayan gizli dosyalar
  (`.well-known` hariç), ön yüzün parça klasörleri, içinde boş bayt (`%00`) olan adres ve yetkisi olmayana gizli yönetim adresi.
- **"Okul bulunamadı"** — `/school/<ad>` biçimi doğru ama o adla açık (onaylı) bir okul yok: yanlış yazılmış ya da adresi değişmiş okul.

## Adım adım

### Sayfa bulunamadı

Ekran (sekme başlığı **"Sayfa bulunamadı · Eğitim Evi"**):

1. Üstte girişsiz sayfaların şeridi (Eğitim Evi, Giriş, Kayıt ol, İndir, ay/güneş, Hakkında, SSS, Yapımcılar —
   [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md)).
2. Ortada çok büyük, soluk **"404"**.
3. Başlık **"Sayfa bulunamadı"**.
4. "Aradığın adres Eğitim Evi'nde yok. Adresi yanlış yazmış olabilirsin ya da sayfa kaldırılmış olabilir."
5. "Okulunun sayfasını arıyorsan adresi **egitimevi.org/school/okulun-adi** biçimindedir; okulunu adıyla da arayabilirsin."
6. İki düğme: **"Ana sayfaya dön"** (dolu; açılış, `/`) ve **"Okulunu ara"** (açık renk zeminli; giriş sayfası `/login`, kartın altında
   okul arama kutusu var).
7. Altta alt bilgi (Kaynak kodu, Hakkında, SSS, Kullanım koşulları, Aydınlatma metni).

### Okul bulunamadı

Ekran (sekme başlığı **"Okul bulunamadı · Eğitim Evi"**), aynı düzen; yalnız yazılar farklı:

1. Büyük **"404"**, başlık **"Okul bulunamadı"**.
2. Adreste yazdığın okul adıyla: **'"<yazdığın ad>" adresinde bir okul yok.'** (ad adres çubuğunda nasıl yazıldıysa öyle, en çok 60
   karakter; betik çalışmazsa "Bu adreste bir okul yok.").
3. "Adresi yanlış yazmış olabilirsin ya da okulun adresi değişmiş olabilir. Okulunu adıyla arayabilirsin."
4. **"Ana sayfaya dön"** ve **"Okulunu ara"**.

### Ziyaretçi

1. Bir adres yazarsın ya da eski bir bağlantıya basarsın; sayfa yoksa "Sayfa bulunamadı", okul yoksa "Okul bulunamadı" gelir.
2. Okulunu arıyorsan **"Okulunu ara"**: giriş sayfası açılır; kartın altındaki "Öğrenci ya da servisçiysen önce okulunu seç" kutusuna
   okulunun adını, ilini ya da ilçesini yaz, çıkan okula bas: okulun doğru adresi açılır
   ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).
3. Ya da **"Ana sayfaya dön"** ile açılışa git.
4. Üst şerit ve alt bilgi burada da çalışır (Yapımcılar listesi açılır, ay/güneş görünümü değiştirir); bütün bağlantılar tam sayfa açılır.

### Giriş yapmış herkes

- Bu iki sayfa düz (ayrı dosya) sayfalardır; oturumunu bilmezler. Giriş yapmışken de aynısını görürsün: şeritte yine "Giriş" ve "Kayıt
  ol" yazar. **"Ana sayfaya dön"** seni girişli olarak portalına götürür (kök adres, oturumu bu tarayıcıda saklı kişide portalı açar;
  "Bilgilerimi bu cihaza kaydetme" ile girdiysen oturum sayfa değişince kalmaz, açılış gelir). Ay/güneş burada
  yalnız bu tarayıcıdaki seçimi değiştirir, hesabına yazmaz.
- Okulunun adresi değiştiyse eski bağlantı "Okul bulunamadı" verir; okulunu yeniden ara ya da yeni adresi okul yönetiminden öğren.

### Müdür ve yönetici

- Müdür okulun adresini "Okul Adresi ve Konumu" sayfasından, sistem yöneticisi yönetim panelindeki "Site Ayarları → Okul adresleri"nden
  değiştirebilir. Değiştiği an eski adres **"Okul bulunamadı"** verir (sunucunun okul önbelleği hemen boşalır); yönetici değiştirirse
  okulun müdürlerine bildirim gider: "Okulunun adresi sistem yöneticisi tarafından değiştirildi: /school/<yeni>. Eski adres artık
  açılmıyor." Eski bağlantıyı paylaşmış okul yeni adresi duyurmalıdır. Ayrıntı: [Sayfa adresi](../okul-sayfasi/sayfa-adresi.md).
- Yetkisi olmayan herkes gizli yönetim adresinde bilinmeyen bir adresle **bayt bayt aynı** "Sayfa bulunamadı"yı alır (durum, başlıklar,
  gövde aynı; yanıt süresi de farkı ele vermez) — [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md).

### Tasarımda (Tasarım 1 önizlemesi)

- İki sayfa da gerçek sitenin şeridi ve alt bilgisiyle çizilir; yazılar aynı. "Okul bulunamadı"daki satır önizlemede biraz farklı:
  "Bu adreste bir okul yok: **egitimevi.org/school/<yazdığın ad>**". Kullanıcı bu farkı ayrıca konuşmadı (2 Ekim: üzerine konuşulmamış
  ekranlar bugünkü gibi kalır).
- **"Okulunu ara"** giriş sayfasını açıp imleci doğrudan okul arama kutusuna koyar.
- Giriş yapmış kişide şeritte "Giriş / Kayıt ol" yerine "Hesaba gir" durur (önizlemede bu sayfalar da ana sitenin parçasıdır).
- Önizlemede iletişim satırı bu sayfaların alt bilgisinde de dolu (bugün boş; aşağıda "Bilinen açık").
- Tanımlarda (paneller ve destek): `/panel/...`, `/duzenle/...`, `/users/...` adresleri yetkisi olmayana (destek ve yönetici dışındaki
  herkese; destek `/panel/admin`'e girerse de) aynı "Sayfa bulunamadı"yı verir; giriş yapmamış kişiye de. Otomatik panele yönlendirme
  yoktur. Ayrıntı: [Paneller](../yonetim/paneller.md), [Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md).

## Kurallar ve sınırlar

- **HTTP durumu 404**, tarayıcıda saklanmaz (`no-store`), arama motorlarına kapalı (`noindex`).
- **Hangisi ne zaman:**
  - `/school/` ile başlayıp okul adresi kuralına uyan (küçük harf, rakam ve tire; tireyle başlamaz, bitmez; en çok 40 karakter; büyük
    harfle yazılsa da küçük harfe çevrilip bakılır; sonda `/` olabilir) ve onaylı bir okula ait olmayan adres → "Okul bulunamadı".
  - `/school/` ile başlayıp bu kurala uymayan adres ve öbür tanınmayan her adres → "Sayfa bulunamadı".
  - Uygulamanın kendi adresleri (`/`, `/login`, `/hakkinda` …) ve kısa adlar hiçbir zaman 404 vermez ([Kısa adresler](adresler.md)).
- **"Okul var mı?" önbelleği:** sunucu her okul adresinin sonucunu 30 saniye hatırlar; okul adresi değişince önbellek hemen boşalır.
  Veritabanına ulaşılamazsa okul adresinde yine uygulama açılır; okulun bilgisi de gelemezse sayfa okul adı olmadan, okulsuz giriş
  kartı gibi görünür ve bunu ayrıca söylemez (bilinen açık; sayfayı yenilemek düzeltir —
  [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).
- **Sayfa açıkken okul bulunamazsa** (geri/ileri tuşuyla bu arada adresi değişmiş bir okula dönmek gibi sunucu denetiminden geçmeyen
  durumlar): adres `/login` olur, kartın üstünde: '"<kısa ad>" adresinde bir okul yok. Okulunu aşağıdan seç.'
- **Yazılan okul adı** sayfaya düz yazı olarak konur (HTML işlenmez), en çok 60 karakter.
- **Düz sayfadır:** uygulama paketi yüklenmez; yalnız küçük bir betik (ay/güneş, Yapımcılar listesi, okul adı) çalışır. Yapımcı listesi
  sunucudan çerezsiz istenir.
- **Bilinen açık (kod değiştirilmedi):** alt bilgideki iletişim satırı bu sayfalarda boş kalır ([İletişim bilgileri](iletisim-bilgileri.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Kısa adresler](adresler.md) — hangi adres neyi açar, neler 404 verir.
- [Açılış sayfası](acilis.md) — "Ana sayfaya dön"ün gittiği yer.
- [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) — sayfadaki şerit ve alt bilgi.
- [Sık sorulan sorular](sss.md) — "Okulumun adresi açılmıyor ("Okul bulunamadı")." sorusu.
- [İletişim bilgileri](iletisim-bilgileri.md), [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md), [Rakamlar](rakamlar.md).

**İlgili:**

- [Giriş ve hesap](../giris-hesap/README.md) — [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md) ("Okulunu ara"nın
  açtığı arama).
- [Okul sayfası](../okul-sayfasi/README.md) — [Sayfa adresi](../okul-sayfasi/sayfa-adresi.md).
- [Site yönetimi](../yonetim/README.md) — [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md), [Paneller](../yonetim/paneller.md),
  [Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md).

## Kod tarafı

- Sayfalar: `public/404.html`, `public/okul-bulunamadi.html` (aynı şablon; başlık ve iki paragraf farklı) — [public/KLASOR.md](../../public/KLASOR.md).
- Ön yüz: [public/js/belge.md](../../public/js/belge.md) (yazılan okul adını "… adresinde bir okul yok." diye yazar; ay/güneş;
  Yapımcılar), [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`okulAdresiniYenile`: sayfa açıkken
  404 kolu).
- Sunucu: [sunucu/http.md](../../sunucu/http.md) (`bulunamadi`, `bulunamadiCerezli`, `OKUL_YOLU`, `okulVarMi`, 30 saniyelik önbellek,
  `okulOnbellekBosalt`), [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md) (gizli adreste aynı 404),
  [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (yöneticinin okul adresini değiştirmesi).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md) (`/olmayan` "Sayfa bulunamadı"; bulunamadı sayfalarında eski
  adreslere bağlantı yok), [testler/test-etut.md](../../testler/test-etut.md) (olmayan okulun adresi 404 ve "Okul bulunamadı"),
  [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md) (adres değişince eski adres hemen "Okul bulunamadı"),
  [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md) (gizli adres bilinmeyen adresle aynı).

## Sık sorulanlar

- **Okulumun adresi açılmıyor ("Okul bulunamadı").** Okulun adresi değişmiş olabilir: müdür ya da Eğitim Evi yöneticisi adresi
  değiştirince eski adres hemen çalışmaz. Giriş sayfasında okulunu adıyla arayıp seç; yeni adresi okul yönetiminden de öğrenebilirsin
  (SSS'deki cevap).
- **Doğru yazdım ama yine "Sayfa bulunamadı".** Okul adresinde yalnız İngilizce küçük harf, rakam ve tire olur; Türkçe harf (ç, ğ, ı, ö, ş,
  ü) ya da alt çizgi varsa adres okul sayılmaz. "Okulunu ara" ile okulunu adıyla bul.
- **Giriş yapmıştım, neden "Giriş" yazıyor?** Bu sayfa oturumu bilmez; "Ana sayfaya dön" seni portalına götürür.

## Sırada

- "Paneller /panel/admin ve /panel/destek" (DEVAM iş 5) ve "Kullanıcı arama (/users/<ad>)" (iş 6): yeni gizli adreslerin aynı 404'ü
  vermesi.
- "Tek kişi tek hesap + portallar öğrencide de" (iş 19): okulun Türkçe eş adresi `/okul/<okul>` (bugün yok) — olmayan okulda o adreste de
  "Okul bulunamadı".
- Düz sayfalarda iletişim satırının doldurulması (bilinen açık).
- "Çok dil" (iş 22): iki sayfanın metinleri de çevrilecek (düz sayfa oldukları için ayrıca ele alınmalı).
