# Açılış sayfası ve girişsiz sayfalar

Giriş yapmamış herkesin gördüğü sayfalar: açılış (`egitimevi.org/`), Hakkında, Sık sorulan sorular ve yanlış adreste çıkan "Sayfa
bulunamadı" / "Okul bulunamadı"; bunları saran ortak üst şerit (Giriş, Kayıt ol, İndir, ay/güneş, Hakkında, SSS, Yapımcılar) ve alt
bilgi (Kaynak kodu, Kullanım koşulları, Aydınlatma metni, iletişim); sayfaların adresleri ve kısa adları. Açılış Eğitim Evi'ni tanıtır
(renkli bant, "Neler var?", "Okulun nasıl başlar?", kimin için, yorumlar) ve "Hesap aç" ile "Giriş yap"a götürür; okulların adresleri
burada tanıtılmaz. Açılış, Hakkında, SSS, giriş ve kayıt aynı tek sayfalık uygulamanın parçasıdır, aralarında sayfa yenilenmeden
geçilir. Rakamlar ("okul kullanıyor", "kayıtlı kişi", "kişi şu an açık"), iletişim bilgileri ve yapımcı listesi sunucudan gelir; sistem
yöneticisi iletişimi, yapımcıları ve "şu an açık" sayma süresini "Site Ayarları"ndan değiştirir. Bütün parçalar bugün kodda var;
bugün giriş yapmış kişi açılışı, Hakkında'yı ve SSS'yi göremez (adres onu portalına götürür), "bulunamadı" sayfalarını ise herkes gibi
görür. Kullanıcının kararlaştırdığı tasarımda (Tasarım 1
önizlemesi ve tanımlar) ek olarak: üst şeritte "Eğitim içerikleri" ve "TR ▾"; giriş yapmış kişi "Ana siteye dön" ile açılışa gelir,
sağ üstte "Giriş / Kayıt ol" yerine "Hesaba gir" görür; yönetici ve destek girişten sonra panele atılmaz, alt bilginin solunda
"Yönetim" ve "Destek paneli" düğmelerini görür; SSS aramalı, bölüm gezginli ayrı bir sayfa olur ve güncellenir; eğitim içerikleri,
paneller ve kullanıcı sayfası için yeni adresler gelir.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Açılış sayfası](acilis.md) | Bant, "Hesap aç" / "Giriş yap", "Neler var?" 12 kart, "Okulun nasıl başlar?", kimin için, yorumlar; dar ekran | Kodda var; tasarımda ek olarak "Eğitim içerikleri", "TR ▾", "Ana siteye dön" ve "Hesaba gir" |
| [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) | Şeritteki her düğme, Yapımcılar listesi, alt bilginin üç parçası, yenilemeden geçiş, düz sayfalardaki kopya | Kodda var; tasarımda ek olarak "Eğitim içerikleri", "TR ▾", "Hesaba gir", "Yönetim" / "Destek paneli" |
| [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md) | `/hakkinda` bölümleri, Yapımcılar listesi, "Bu sistem hakkında" penceresi, yöneticinin listeyi düzenlemesi | Kodda var; tasarımda ek olarak liste `/panel/admin`'den, Hakkında "Ana siteye dön" ile |
| [Rakamlar](rakamlar.md) | "okul kullanıyor", "kayıtlı kişi", "kişi şu an açık": ne sayılır, önbellek, sayma süresi ayarı | Kodda var; tasarımda ek olarak ayar `/panel/admin`'den, "Sistem durumu"nda da sayı |
| [İletişim bilgileri](iletisim-bilgileri.md) | Alt bilgide, Hakkında'da, uygulamanın altında, "+ Ekle → Müdür"de e-posta ve telefon; yöneticinin ayarı | Kodda var; tasarımda ek olarak "Alt bilgideki iletişim" kartı, düz sayfalarda da görünmesi |
| [Sık sorulan sorular](sss.md) | 6 bölüm, 46 soru ve her birinin ayrıntı belgesi; açılır satırlar | Kodda var; tasarımda ek olarak arama, soru sayısı, bölüm gezgini, 10 güncel cevap, 8 yeni soru |
| [Sayfa bulunamadı ve Okul bulunamadı](bulunamadi-sayfalari.md) | İki 404 sayfası, hangisi ne zaman, "Ana sayfaya dön", "Okulunu ara", gizli adreslerde aynı 404 | Kodda var; tasarımda ek olarak yeni gizli adreslerde de aynı sayfa |
| [Kısa adresler](adresler.md) | Asıl adresler, eş adlar (`/giris`, `/about` …), 301 yönlendirmeleri, okul adresi biçimi, 404 kuralları | Kodda var; tasarımda ek olarak eğitim içerikleri, panel, kullanıcı ve `/okul/<okul>` adresleri |

Planda bu klasör için altı belge vardı; **[Rakamlar](rakamlar.md)** ve **[İletişim bilgileri](iletisim-bilgileri.md)** sonradan eklendi:
ikisi de birden çok sayfada görünür ve yöneticinin ayrı bir ayarı vardır.

Okuma sırası:

- **Ziyaretçi:** [Açılış sayfası](acilis.md) → [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md) →
  [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md) → [Sık sorulan sorular](sss.md) → [Kısa adresler](adresler.md) →
  [Bulunamadı sayfaları](bulunamadi-sayfalari.md); sonra [Giriş ve hesap](../giris-hesap/README.md).
- **Giriş yapmış kişi:** [Açılış sayfası](acilis.md#giriş-yapmış-herkes) ("Ana siteye dön" ve "Hesaba gir"),
  [İletişim bilgileri](iletisim-bilgileri.md#giriş-yapmış-herkes), [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes)
  ("Bu sistem hakkında").
- **Müdür adayı:** [Açılış sayfası](acilis.md) ("Okulun nasıl başlar?") → [İletişim bilgileri](iletisim-bilgileri.md#veli-öğretmen-çalışan-ve-müdür)
  → [Kısa adresler](adresler.md#müdür-ve-yönetici) (okulun adresi).
- **Sistem yöneticisi:** [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md#yönetici), [İletişim bilgileri](iletisim-bilgileri.md#yönetici),
  [Rakamlar](rakamlar.md#yönetici), [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md#yönetici-ve-destek),
  [Bulunamadı sayfaları](bulunamadi-sayfalari.md#müdür-ve-yönetici).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Ziyaretçi | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Eğitmen | Destek | Yönetici | Tahta |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Açılış sayfası | [okur; "Hesap aç", "Giriş yap"](acilis.md#ziyaretçi) | [bugün göremez; tasarımda "Ana siteye dön"](acilis.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](acilis.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](acilis.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](acilis.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](acilis.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](acilis.md#giriş-yapmış-herkes) | [tasarımda "Ana siteye dön", "Hesaba gir"](acilis.md#giriş-yapmış-herkes) | [tasarımda "Hesaba gir" ve "Destek paneli"](acilis.md#yönetici-ve-destek) | [bugün girişte yönetim adresine geçer; tasarımda açılışta kalır](acilis.md#yönetici-ve-destek) | — |
| Açılışın üst şeridi ve alt bilgisi | [kullanır](ust-serit-ve-alt-bilgi.md#ziyaretçi) | [uygulamanın şeridi; tasarımda "Hesaba gir"](ust-serit-ve-alt-bilgi.md#giriş-yapmış-herkes) | [uygulamanın şeridi; tasarımda "Hesaba gir"](ust-serit-ve-alt-bilgi.md#giriş-yapmış-herkes) | [uygulamanın şeridi; tasarımda "Hesaba gir"](ust-serit-ve-alt-bilgi.md#giriş-yapmış-herkes) | [uygulamanın şeridi; tasarımda "Hesaba gir"](ust-serit-ve-alt-bilgi.md#giriş-yapmış-herkes) | [uygulamanın şeridi; tasarımda "Hesaba gir"](ust-serit-ve-alt-bilgi.md#giriş-yapmış-herkes) | [uygulamanın şeridi; tasarımda "Hesaba gir"](ust-serit-ve-alt-bilgi.md#giriş-yapmış-herkes) | [tasarımda "Hesaba gir"](ust-serit-ve-alt-bilgi.md#giriş-yapmış-herkes) | [tasarımda alt bilgide "Destek paneli"](ust-serit-ve-alt-bilgi.md#yönetici-ve-destek) | [yapımcıları ve iletişimi değiştirir; tasarımda "Yönetim"](ust-serit-ve-alt-bilgi.md#yönetici-ve-destek) | — |
| Hakkında ve Yapımcılar | [okur, listeyi açar](hakkinda-ve-yapimcilar.md#ziyaretçi) | ["Bu sistem hakkında"](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes) | ["Bu sistem hakkında"](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes) | ["Bu sistem hakkında"](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes) | ["Bu sistem hakkında"](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes) | ["Bu sistem hakkında"](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes) | ["Bu sistem hakkında"](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes) | [tasarımda "Ana siteye dön" ile okur](hakkinda-ve-yapimcilar.md#giriş-yapmış-herkes) | [tasarımda okur, düzenlemez](hakkinda-ve-yapimcilar.md#destek) | [yapımcı listesini düzenler](hakkinda-ve-yapimcilar.md#yönetici) | — |
| Rakamlar | [görür](rakamlar.md#ziyaretçi) | [şu an açık sayılır](rakamlar.md#giriş-yapmış-herkes) | [şu an açık sayılır](rakamlar.md#giriş-yapmış-herkes) | [şu an açık sayılır](rakamlar.md#giriş-yapmış-herkes) | [şu an açık sayılır](rakamlar.md#giriş-yapmış-herkes) | [şu an açık sayılır](rakamlar.md#giriş-yapmış-herkes) | [şu an açık sayılır](rakamlar.md#giriş-yapmış-herkes) | [tasarımda aynı](rakamlar.md#giriş-yapmış-herkes) | [tasarımda görür](rakamlar.md#destek) | [sayma süresini ayarlar](rakamlar.md#yönetici) | — |
| İletişim bilgileri | [alt bilgide ve Hakkında'da](iletisim-bilgileri.md#ziyaretçi) | [sayfaların altında](iletisim-bilgileri.md#giriş-yapmış-herkes) | [altta; "+ Ekle → Müdür"de](iletisim-bilgileri.md#veli-öğretmen-çalışan-ve-müdür) | [altta; "+ Ekle → Müdür"de](iletisim-bilgileri.md#veli-öğretmen-çalışan-ve-müdür) | [altta; "+ Ekle → Müdür"de](iletisim-bilgileri.md#veli-öğretmen-çalışan-ve-müdür) | [altta; "+ Ekle → Müdür"de](iletisim-bilgileri.md#veli-öğretmen-çalışan-ve-müdür) | [sayfaların altında](iletisim-bilgileri.md#giriş-yapmış-herkes) | [tasarımda yetişkin hesabıyla aynı](iletisim-bilgileri.md#veli-öğretmen-çalışan-ve-müdür) | [tasarımda görür, değiştirmez](iletisim-bilgileri.md#destek) | [değiştirir](iletisim-bilgileri.md#yönetici) | — |
| Sık sorulan sorular | [okur](sss.md#ziyaretçi) | [bugün göremez; tasarımda "Ana siteye dön"](sss.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](sss.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](sss.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](sss.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](sss.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda "Ana siteye dön"](sss.md#giriş-yapmış-herkes) | [tasarımda okur](sss.md#giriş-yapmış-herkes) | [tasarımda okur](sss.md#giriş-yapmış-herkes) | [bugün göremez; tasarımda okur](sss.md#giriş-yapmış-herkes) | — |
| Sayfa bulunamadı ve Okul bulunamadı | [yanlış adreste görür; "Okulunu ara"](bulunamadi-sayfalari.md#ziyaretçi) | [aynısını görür](bulunamadi-sayfalari.md#giriş-yapmış-herkes) | [aynısını görür](bulunamadi-sayfalari.md#giriş-yapmış-herkes) | [aynısını görür](bulunamadi-sayfalari.md#giriş-yapmış-herkes) | [aynısını görür](bulunamadi-sayfalari.md#giriş-yapmış-herkes) | [adres değişince eski adres "Okul bulunamadı"](bulunamadi-sayfalari.md#müdür-ve-yönetici) | [aynısını görür](bulunamadi-sayfalari.md#giriş-yapmış-herkes) | [tasarımda başka panel adresinde 404](bulunamadi-sayfalari.md#tasarımda-tasarım-1-önizlemesi) | [tasarımda `/panel/admin`'de 404](bulunamadi-sayfalari.md#tasarımda-tasarım-1-önizlemesi) | [okul adresini değiştirir](bulunamadi-sayfalari.md#müdür-ve-yönetici) | — |
| Kısa adresler | [kısa adlarla gelir](adresler.md#ziyaretçi) | [girişten sonra `/school/<okul>`](adresler.md#giriş-yapmış-herkes) | [girişten sonra `/`](adresler.md#giriş-yapmış-herkes) | [girişten sonra `/school/<okul>`](adresler.md#giriş-yapmış-herkes) | [okuldaki rolüyle `/school/<okul>`](adresler.md#giriş-yapmış-herkes) | [okulun adresini değiştirir](adresler.md#müdür-ve-yönetici) | [girişten sonra `/school/<okul>`](adresler.md#giriş-yapmış-herkes) | [tasarımda `/panel/egitmen`](adresler.md#tasarımda-tasarım-1-önizlemesi-ve-tanımlar) | [tasarımda `/panel/destek`, `/duzenle`, `/users`](adresler.md#tasarımda-tasarım-1-önizlemesi-ve-tanımlar) | [okul adreslerini değiştirir; tasarımda `/panel/admin`](adresler.md#müdür-ve-yönetici) | [tasarımda okulun adresinden girer](../tahta/tahta-girisi.md) |

Notlar:

- **Çalışan:** bugün kodda ek görevli kişi (Müdür Yardımcısı, Rehber Öğretmen …) öğretmen portalıyla girer; bu klasörde öğretmenle
  aynıdır. Tasarımda (çalışan tanımı) kişi okula "çalışan" olarak eklenir; "+ Ekle → Çalışan" ile kişi kodunu verir.
- **Eğitmen, destek ve tahta** tasarımdaki rollerdir. Eğitmen hesabı yetişkin hesabıdır; giriş yapmış herkes gibi davranır. Destek bu
  klasörde yöneticinin yaptıklarını yapmaz (site ayarları yalnız yönetici); alt bilgide "Destek paneli"ni görür. Tahta hesabı okulun
  sayfasından girer ve açılışı kullanmaz; yanlış bir adreste herkes gibi "Sayfa bulunamadı" görür.
- **Bir kişinin birden çok rolü** olabilir (ör. bir okulda öğretmen, başka bir çocuğun velisi): girişten sonraki adres o an hangi
  portaldaysa ona göre olur (okuldaki rolle `/school/<okul>`, okulsuz hesapla `/`).

Rol kapıları: [Ziyaretçi](../roller/ziyaretci.md) · [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) ·
[Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Eğitmen](../roller/egitmen.md) · [Destek](../roller/destek.md) · [Tahta](../roller/tahta.md) · [Yönetici](../roller/yonetici.md).
Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Giriş ve hesap](../giris-hesap/README.md) — "Giriş" ve "Kayıt ol"un açtığı kartlar; [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)
  ("Okulunu ara", son girilen okul), [Çıkış yap](../giris-hesap/cikis-yap.md) (çıkınca hangi sayfa).
- [Yorumlar](../yorumlar/README.md) — açılışın altındaki "Kullananlar ne diyor?" ([Açılış sayfasındaki yorumlar bölümü](../yorumlar/yorumlar-bolumu.md)).
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — portalın kendi şeridi, [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md),
  [Profil menüsü](../menu-ve-arama/profil-menusu.md).
- [Portallar ve + Ekle](../portallar/README.md) — [+ Ekle penceresi](../portallar/ekle-penceresi.md) ("Yöneticimize ulaş"),
  [Kişi kodu](../portallar/kisi-kodu.md).
- [Uygulama ve indirme](../uygulama/README.md) — üst şeritteki "İndir" ([İndir sayfası](../uygulama/indir-sayfasi.md)), Android
  uygulaması.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — alt bilgideki "Aydınlatma metni" ve "Kullanım koşulları".
- [Okul sayfası](../okul-sayfasi/README.md) — `/school/<okul>` ve okulun adresi ([Sayfa adresi](../okul-sayfasi/sayfa-adresi.md)).
- [Site yönetimi](../yonetim/README.md) — [Site ayarları](../yonetim/site-ayarlari.md), [Paneller](../yonetim/paneller.md),
  [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md), [Site duyurusu](../yonetim/site-duyurusu.md),
  [Bakım modu](../yonetim/bakim-modu.md), [Sistem durumu](../yonetim/sistem-durumu.md).
- [Hesap ayarları](../ayarlar/README.md) — ay/güneşin hesaptaki karşılığı ([Görünüm ve dil](../ayarlar/gorunum-ve-dil.md)).
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — tasarımda üst şeritteki bağlantı ve girişsiz izleme.
- [Dil ve çeviri](../dil/README.md) — tasarımda "TR ▾" ([Dil seçici](../dil/dil-secici.md)).
- [Destek talepleri](../destek/README.md) — tasarımda "Destek paneli" ve SSS'de cevabı bulamayanın yolu.
- [İşlem kaydı](../islem-kaydi/README.md) — `site.iletisim`, `site.yapimcilar`, `site.aralik`.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (dış sayfaların hepsi: adres → sayfa,
  yenilemesiz geçiş, rakamlar, iletişim, yapımcılar, yorumlar, okul adresi), [public/js/belge.md](../../public/js/belge.md) (düz
  sayfalar ve bulunamadı sayfaları), [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (uygulamanın alt
  bilgisi), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) ("Bu sistem hakkında", ay/güneş),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (açılış ve çıkış akışı), [public/js/tema.md](../../public/js/tema.md).
- Yönetim: [public/js/yonetim/09b-site-ayarlari.md](../../public/js/yonetim/09b-site-ayarlari.md),
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md).
- Sunucu: [sunucu/http.md](../../sunucu/http.md) (adresler, 301, 404, okul var mı), [sunucu/site.md](../../sunucu/site.md) (`/api/site`,
  ayarların okunması, "şu an açık"), [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (ayarların yazılması),
  [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md), [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)
  (`/api/okul-adres`).
- Sayfalar ve biçim: [public/KLASOR.md](../../public/KLASOR.md) (`index.html`, `404.html`, `okul-bulunamadi.html`),
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`29-dis-sayfalar.css`).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md), [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md),
  [testler/test-etut.md](../../testler/test-etut.md), [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Açılış sayfası, giriş ve site ayarları", "Okul adresi").
