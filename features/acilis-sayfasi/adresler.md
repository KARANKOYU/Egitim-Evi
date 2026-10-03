# Açılış sayfası ve girişsiz sayfalar · Kısa adresler

**Durum:** Kodda var; tasarımda ek olarak yeni adresler (eğitim içerikleri ve izleme, paneller, okul düzenleme, kullanıcı sayfası, destek, okulun Türkçe eş adresi `/okul/<okul>`)

Girişsiz sayfaların adresleri, Türkçe ve İngilizce eş adları, kısa ve eski adreslerin kalıcı yönlendirmesi (301) ve tanınmayan
adreslerin ne verdiği.

## Ne işe yarar

Kişi adresi elle yazabilsin, aklına gelen biçimde yazsa da doğru sayfaya ulaşsın. Kullanıcının isteği (26 Eylül): "`egitimevi.org/login`
– `giris` aynı şey olacak ve ikisi de olacak; `indir` – `download` ikisi de olacak … bazıları indir bilir bazıları download"; sayfalar
"`egitimevi.org/kvkk/kvkk.html` gibi olacak, böylece direkt yazarak da olabilecek; `./sss/sss.html` de ok". Asıl adres klasörlüdür ve
adres çubuğunda o görünür; kısa adlar oraya yönlenir.

## Nereden açılır

Adres çubuğuna yazarak, bağlantılardan (üst şerit, alt bilgi, SSS cevapları, e-postalar, okulun dağıttığı bağlantı) ve yer
imlerinden. Bütün sitedeki bağlantılar ve Android uygulaması asıl adresleri kullanır.

## Adım adım

### Ziyaretçi

**Tek sayfalık uygulamanın adresleri** (sayfa yeniden yüklenmeden birinden ötekine geçilir; `/about`, `/giris` ve `/index.html` adres
çubuğunda olduğu gibi kalır, `/kayit` açılınca `/signup` olur — aşağıda 5. adım):

| Adres | Eş adı | Ne açılır | Sekme başlığı |
|---|---|---|---|
| `/` | `/index.html` | [Açılış sayfası](acilis.md) | Eğitim Evi |
| `/hakkinda` | `/about` | [Hakkında](hakkinda-ve-yapimcilar.md) | Hakkında — Eğitim Evi |
| `/sss/sss.html` | (kısa adlar aşağıda) | [Sık sorulan sorular](sss.md) | Sık sorulan sorular — Eğitim Evi |
| `/login` | `/giris` | giriş kartı + "Öğrenci ya da servisçiysen önce okulunu seç" ([Giriş](../giris-hesap/giris.md)) | Eğitim Evi |
| `/signup` | `/kayit` | kayıt kartı ([Kayıt olma](../giris-hesap/kayit-olma.md)) | Eğitim Evi |
| `/school/<okul>` | — | okulun giriş sayfası ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)) | <okulun adı> — Eğitim Evi |

**Düz sayfalar ve kısa adları** (kısa ve eski adlar **301** ile asıl adrese gider; adres çubuğu asıl adresi gösterir):

| Asıl adres | Kısa ve eski adlar | Sayfa |
|---|---|---|
| `/kvkk/kvkk.html` | `/kvkk`, `/kvkk/`, `/kvkk.html` | [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) |
| `/kosullar/kosullar.html` | `/kosullar`, `/kosullar/`, `/kosullar.html` | [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md) |
| `/indir/indir.html` | `/indir`, `/indir/`, `/indir.html`, `/download`, `/download/` | [İndir sayfası](../uygulama/indir-sayfasi.md) |
| `/sss/sss.html` | `/sss`, `/sss/`, `/faq`, `/faq/` | [Sık sorulan sorular](sss.md) |

Adım adım:

1. Adres çubuğuna kısa bir ad yaz, ör. `egitimevi.org/indir` ya da `egitimevi.org/download`.
2. Sunucu "taşındı" (301) der ve tarayıcı asıl adrese (`/indir/indir.html`) geçer; adres çubuğunda asıl adres görünür.
3. Büyük harfle ya da Türkçe klavyede Caps Lock açıkken yazsan da olur: `/KVKK`, `/İNDİR`, `/ındır` aynı yere gider. Sonda `/` olsa da olur.
4. Adresin `?` sonrası (sorgu) yönlendirmede korunur (ör. `/kvkk.html?x=1` → `/kvkk/kvkk.html?x=1`).
5. Uygulamanın adresleri de harf ve sondaki `/` farkını önemsemez: `/Login/`, `/HAKKINDA` doğru sayfayı açar. `/giris` ile açılan
   giriş kartında adres öyle kalır. `/kayit` ile açılınca kart "Hesap Aç" sekmesine geçerken adres hemen `/signup` olur (büyük harfle
   yazılmış `/SIGNUP` da öyle). Kartın sekmesini değiştirince (Giriş Yap ↔ Hesap Aç) adres `/login` ↔ `/signup` olur.
6. Yazdığın adres tanınmıyorsa "Sayfa bulunamadı", okul adresi doğru biçimde ama öyle bir okul yoksa "Okul bulunamadı" gelir
   ([Bulunamadı sayfaları](bulunamadi-sayfalari.md)).

### Giriş yapmış herkes

- Giriş yaptıktan sonra adres çubuğu kişinin yerine döner, sayfa yenilenince aynı yerde kalırsın:
  - bir okuldaki rolünle (öğrenci, öğretmen, müdür, servisçi) girdiysen `/school/<okulun adresi>` olur;
  - okulsuz hesapla (yetişkin hesabı, veli) `/login`, `/signup`, `/hakkinda` gibi bir dış adresteysen `/` olur;
  - sistem yöneticisi girişten sonra tam sayfa geçişle gizli yönetim adresine gider
    ([Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md)).
  - Adresin `#` kısmı (bulunduğun sayfa, ör. `#/odevler`) korunur.
- Giriş yapmışken bir dış adresi (`/hakkinda`, `/sss/sss.html`) açarsan bugün portalın açılır. Tasarımda "Ana siteye dön" ile bu
  sayfalara oturum açıkken de gidilir ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).
- Çıkınca adres çubuğunda okulun adresi varsa (okuldaki bir rolle girince adres kendiliğinden o olur) o okulun giriş sayfasında
  kalırsın; değilse adres `/login` olur; yönetim adresinden çıkan yönetici `/login`'e gider ([Çıkış yap](../giris-hesap/cikis-yap.md)).
- Kısa adlar ve 301'ler giriş yapmışken de aynıdır.

### Müdür ve yönetici

- Okulun adresi (`/school/<kısa ad>`) okul açılırken verilir; müdür "Okul Adresi ve Konumu" sayfasından, sistem yöneticisi yönetim
  panelindeki "Site Ayarları → Okul adresleri"nden değiştirir. Değiştiği an eski adres "Okul bulunamadı" verir; yönetici değiştirirse
  müdürlere bildirim gider. Okul adı kuralları (3–40 karakter, küçük harf, rakam, tire, iki tire yan yana olmaz, sitenin kendi sayfa
  adları alınamaz) ve iletileri: [Sayfa adresi](../okul-sayfasi/sayfa-adresi.md).
- Gizli yönetim adresi yetkisi olmayana tanınmayan bir adresle bayt bayt aynı "Sayfa bulunamadı"yı verir
  ([Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md)).

### Tasarımda (Tasarım 1 önizlemesi ve tanımlar)

Önizleme adresleri `#/…` biçiminde taklit eder (aynı eş adlarla: `login`/`giris`, `signup`/`kayit`, `about`/`hakkinda`,
`indir`/`download`, `sss`/`faq`, `kvkk`, `kosullar`; harf ve sondaki `/` farkı önemsiz); gerçek sitenin asıl adresleri değişmez.
Tanımlarla gelen yeni adresler:

| Adres | Eş adı | Kim | Ne | Belge |
|---|---|---|---|---|
| `/egitim-icerikleri` | `/videos` | herkes (girişsiz) | eğitim videoları listesi, arama, süzgeç | [Adresler (eğitim içerikleri)](../egitim-icerikleri/adresler.md) |
| `/izle/<kimlik>` | `/watch/<kimlik>` | herkes | video izleme sayfası | [İzleme sayfası](../egitim-icerikleri/izleme-sayfasi.md) |
| `/watchlist/<kimlik>` | `/izleme-listesi/<kimlik>` | herkes (paylaşılmış listeler ve eğitmen serileri) | oynatma listesi | [Listeyi paylaş](../egitim-icerikleri/listeyi-paylas.md) |
| `/panel/admin` | — | yalnız yönetici | yönetim paneli | [Paneller](../yonetim/paneller.md) |
| `/panel/destek` | — | destek ve yönetici | destek paneli | [Paneller](../yonetim/paneller.md) |
| `/panel/egitmen` | — | yalnız eğitmen | eğitmen paneli | [Eğitmen paneli](../egitim-icerikleri/egitmen-paneli.md) |
| `/panel/translate` | `/panel/ceviri` | çevirmen | çeviri paneli | [Çeviri paneli](../dil/ceviri-paneli.md) |
| `/duzenle/okul/yeni`, `/duzenle/okul/<kısa ad>` | — | destek ve yönetici | okul ekle / düzenle (tam sayfa) | [Okul ekle ve düzenle](../yonetim/okul-ekle-duzenle.md) |
| `/users/<kullanıcı adı>` | — | destek ve yönetici | kişi sayfası | [Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md) |
| `/destek` | — | herkes | destek talebi açma sayfası | [Destek sayfası](../destek/destek-sayfasi.md) |
| `/okul/<okul>` | `/school/<okul>`'un Türkçe eşi | herkes | okulun sayfası (bugün yok; `login`/`giris` gibi eklenecek) | [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md) |

- `/panel/...`, `/duzenle/...`, `/users/...` yetkisi olmayana (giriş yapmamış kişiye de) "Sayfa bulunamadı" verir; panele otomatik
  yönlendirme yoktur.
- Arama motorları için (iş 23): `/robots.txt` girişi, `/api`'yi, `/school/*` okul sayfalarını, `/panel` ve `/duzenle`'yi dizine
  sokmaz (okul sayfaları okul isterse açılır); `/sitemap.xml` yalnız herkese açık sayfaları listeler.

## Kurallar ve sınırlar

- **Yönlendirme yalnız `GET` ve `HEAD`** isteğinde olur. Cevap `301`, gövdesi "Taşındı: <asıl adres>", tarayıcı yönlendirmeyi bir gün
  saklar. Hedef her zaman tablodaki sabit yoldur; başka bir siteye yönlendirilemez. Sorgu yalnız görünür ASCII karakterlerdense eklenir
  (boşluk, satır sonu gibi denetim karakterleri varsa sorgu atılır; başlığa satır eklenemez).
- **Asıl adresin kendisi** büyük harfle ya da sonunda `/` ile yazılırsa (ör. `/KVKK/KVKK.HTML`) asıl yazılışına 301 ile döner.
- **Tanınmayan her adres 404** ("Sayfa bulunamadı"): `/olmayan`, `/kvkk/olmayan.html`, `/school/` (boş). Şunlar da bilerek aynı 404'ü
  verir: `.md` belgeleri (kod belgeleri yalnız depoda okunur), `_` ya da `.` ile başlayan dosya adları (`.well-known` hariç), ön yüzün parça
  klasörleri (tarayıcıya yalnız birleşik `/js/app.js` ve `/css/style.css` gider), içinde boş bayt (`%00`) olan adres.
- **Okul adresi biçimi** (sunucuda ve sayfada aynı): `school/` ve ardından bir harf ya da rakamla başlayıp bitti, arada küçük harf, rakam
  ve tire olan en çok 40 karakter. Okul var mı diye bakılır (30 saniye önbellek); yoksa "Okul bulunamadı". Okul adresi yalnız `/school/`
  ile başlayan adreste aranır; sitenin kendi sayfa adları (`login`, `hakkinda` …) okul sayılmaz.
- **Sitenin bağlantıları** hep asıl adresi kullanır (üst şerit, alt bilgi, SSS cevapları, kayıt formundaki onay kutusu, Android
  uygulaması); testler bulunamadı sayfalarında eski adrese bağlantı kalmadığını denetler.
- **Son girilen okul** bu tarayıcıda hatırlanır (yalnız okulun adı, kısa adı, ili, ilçesi); giriş sayfasında "Son girdiğin okul" olarak
  çıkar.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Bulunamadı sayfaları](bulunamadi-sayfalari.md) — tanınmayan adresin cevabı.
- [Açılış sayfası](acilis.md), [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md), [Sık sorulan sorular](sss.md) — adreslerin açtığı
  sayfalar.
- [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) — adreslere götüren bağlantılar.
- [İletişim bilgileri](iletisim-bilgileri.md), [Rakamlar](rakamlar.md).

**İlgili:**

- [Giriş ve hesap](../giris-hesap/README.md) — `/login`, `/signup`, `/school/<okul>`.
- [Okul sayfası](../okul-sayfasi/README.md) — [Sayfa adresi](../okul-sayfasi/sayfa-adresi.md).
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md), [Uygulama ve indirme](../uygulama/README.md) — düz sayfalar.
- [Site yönetimi](../yonetim/README.md), [Eğitim içerikleri](../egitim-icerikleri/README.md), [Destek talepleri](../destek/README.md),
  [Dil ve çeviri](../dil/README.md) — tasarımdaki yeni adresler.

## Kod tarafı

- Sunucu: [sunucu/http.md](../../sunucu/http.md) (`YONLENDIRMELER`, `yonlendirmeAnahtari` (Türkçe İ/ı), `yonlendirmeAdresi`, `yonlendir`,
  `UYGULAMA_YOLLARI`, `OKUL_YOLU`, `okulVarMi`, `serveStatic`, `bulunamadi`), [sunucu/ortak.md](../../sunucu/ortak.md) (`kisaAdSorunu`,
  ayrılmış adlar).
- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`SITE_SAYFALARI`, `OKUL_ADRESI_DESENI`,
  `disSayfa`, `adrestenOkul`, `sekmeAdresiYaz`, `okulYolunuAyarla`, son girilen okul), [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md)
  (çıkışta adres).
- Sayfa dosyaları: [public/KLASOR.md](../../public/KLASOR.md), [public/kvkk/KLASOR.md](../../public/kvkk/KLASOR.md),
  [public/indir/KLASOR.md](../../public/indir/KLASOR.md).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md) (her kısa adın 301'i ve hedefi, asıl adreslerin 200'ü, harf ve
  sondaki `/`, sorgunun korunması, başlık enjeksiyonu denemeleri, `/olmayan` 404, parça klasörleri 404).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Sayfa adresleri ve kısa adlar", "Okul adresi").

## Sık sorulanlar

- **`egitimevi.org/indir` mi `download` mı?** İkisi de; ikisi de indirme sayfasına gider.
- **Okulumun adresi neydi?** `egitimevi.org/school/okulun-adi` biçimindedir. Bilmiyorsan giriş sayfasında okulunu adıyla ara; bir kez
  girdiğin okul bu tarayıcıda "Son girdiğin okul" olarak hatırlanır.
- **`/sss` yazdım, adres `/sss/sss.html` oldu.** Doğru: kısa adlar asıl adrese yönlenir.

## Sırada

- "Eğitim içerikleri" (DEVAM iş 17): `/egitim-icerikleri`, `/videos`, `/izle`, `/watch`, `/watchlist`, `/izleme-listesi`.
- "Paneller" (iş 5), "Kullanıcı arama" ve "destek talepleri" (iş 6), "Çok dil" (iş 22: `/panel/translate`): yeni adresler.
- "Tek kişi tek hesap + portallar öğrencide de" (iş 19) ve "Toplantılar … tahta hesabı" (iş 21): `/okul/<okul>` Türkçe eş adresi.
- "Arama motorunda görünme" (iş 23): `robots.txt`, `sitemap.xml`, sayfa başına başlık ve açıklama.
