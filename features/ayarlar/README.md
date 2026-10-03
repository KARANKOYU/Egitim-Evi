# Hesap ayarları

Herkesin kendi hesabını yönettiği sayfa. Bugün adı "Ayarlar": üst şeritteki dişli ya da profil düğmesinden, sol menünün altından ve
ana sayfadaki gri kutucuktan açılır; kartları hesabın türüne göre değişir. Yetişkin hesabında (veli, öğretmen, müdür, rolsüz yetişkin)
ad, kullanıcı adı, e-posta, telefon, T.C. kimlik no ve şifre tek hesabındır, öğretmen ya da müdür portalındayken de aynı yeri
değiştirirsin; okulun açtığı öğrenci ve servisçi hesabında T.C. kimlik numarasını ve giriş bilgilerini okul yönetir. Bugün kodda
olanlar: kişisel bilgileri güncelleme (ad, il, ilçe, adres, T.C., doğum tarihi), mevcut şifreyle giriş bilgilerini değiştirme (yeni
e-posta onay bağlantısıyla geçerli olur), şifre değiştirme (öbür oturumlar kapanır), cihaz başına telefon bildirimi, Sistem · Açık ·
Koyu görünüm, yetişkinin hesabını silmesi ve e-postasız eski hesaba "E-posta eklemek ister misin?" önerisi. Kullanıcının
kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve tanımlar) ek olarak: sayfanın adı "Hesap ayarları" olur ve bölümlere ayrılır, profil
menüsünden doğrudan bölüme gidilir, her satırın kendi penceresi açılır; bütün hesaplarda zorunlu T.C., şifre alanları "Eski şifre:",
"Yeni şifre:", "Yeni şifre (tekrar):", öğrencinin isteğe bağlı iki adımlı girişi, doğrulama uygulaması, "Açık oturumlarım", önemli
işlerden önce "Kimliğini doğrula", bildirim izin durumu ve e-posta bildirimleri, "Boyut" ve "Dil", "Verilerimi indir" (velide
"Çocuğumun verilerini indir") ve müdürün de hesabını silebilmesi.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) | Sayfanın açıldığı yerler, kartların sırası ve hesap türüne göre farkları; tasarımdaki bölümler, profil menüsü kısayolları, telefon uygulamasının Ayarlar'ı | Kodda var; tasarımda ek olarak "Hesap ayarları" bölümleri ve her satırın kendi penceresi |
| [Kişisel bilgiler](kisisel-bilgiler.md) | "Hesap bilgilerin" ve "Bilgileri güncelle": ad, il, ilçe, adres, T.C. kimlik no, doğum tarihi | Kodda var; tasarımda ek olarak alan pencereleri, zorunlu ve maskeli T.C., eğitmende kanal ve tanıtım |
| [Giriş bilgileri](giris-bilgileri.md) | Kullanıcı adı, e-posta (onay bağlantısıyla), ülke kodlu telefon; mevcut şifreyle | Kodda var; tasarımda ek olarak alan pencereleri, "doğrulandı" rozeti, SMS adımı (karar bekliyor) |
| [Şifre değiştirme](sifre-degistirme.md) | "Şifre değiştir" formu, kurallar, öbür oturumların kapanması | Kodda var; tasarımda ek olarak "Eski şifre:" adları ve "Son değişiklik" |
| [Şifre ve güvenlik](guvenlik.md) | İki adımlı giriş, doğrulama uygulaması, "Kimliğini doğrula" | Kodda var; tasarımda ek olarak "Şifre ve güvenlik" bölümü, öğrencinin isteğe bağlı iki adımı, doğrulama uygulaması |
| [Açık oturumlarım](acik-oturumlar.md) | Hesabına girilmiş cihazlar, tek tek çıkış, "Diğer bütün cihazlardan çık" | Tasarlandı — henüz kodda yok |
| [Bildirim ayarları](bildirim-ayarlari.md) | "Telefon bildirimleri" kartı; tasarımda izin durumu, telefon ve e-posta anahtarları | Kodda var; tasarımda ek olarak "Bildirimler" bölümü ve "Ödev hatırlatmaları" |
| [Görünüm ve dil](gorunum-ve-dil.md) | Sistem · Açık · Koyu, üst şeritteki ay/güneş; tasarımda "Boyut" ve "Dil" | Kodda var; tasarımda ek olarak "Cihaza göre", "Boyut", "Dil" |
| [Verilerimi indir](verilerimi-indir.md) | Saklanan bütün verinin ZIP kopyası; velide "Çocuğumun verilerini indir" | Tasarlandı — henüz kodda yok |
| [Hesabımı sil](hesabimi-sil.md) | Yetişkin hesabını kalıcı silme; ne silinir, ne kalır | Kodda var; tasarımda ek olarak müdür de siler, servisçi ve eğitmende de, "SİL yaz" onayı |
| [E-posta ekleme önerisi](eposta-ekleme-onerisi.md) | E-postasız eski yetişkine girişte "E-posta eklemek ister misin?" | Kodda var; tasarımda ek olarak "eklenmedi" / "Ekle" satırı |

Okuma sırası:

- **Herkes:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) → [Kişisel bilgiler](kisisel-bilgiler.md) → [Giriş bilgileri](giris-bilgileri.md)
  → [Şifre değiştirme](sifre-degistirme.md) → [Şifre ve güvenlik](guvenlik.md) → [Bildirim ayarları](bildirim-ayarlari.md) →
  [Görünüm ve dil](gorunum-ve-dil.md).
- **KVKK hakları:** [Verilerimi indir](verilerimi-indir.md) → [Hesabımı sil](hesabimi-sil.md).
- **Güvenlik sorunu yaşayan:** [Şifre değiştirme](sifre-degistirme.md) → [Açık oturumlarım](acik-oturumlar.md) → [Şifre ve güvenlik](guvenlik.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.
Çalışan bugün kodda ayrı bir rol değildir (ek görevli kişi öğretmen portalıyla girer); eğitmen ve destek tasarımdaki site rolleridir.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Eğitmen | Destek | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|---|---|
| Ayarlar sayfası | [veli kodu, bilgiler, bildirim, görünüm, şifre](hesap-ayarlari-sayfasi.md) | [yetişkin hesabının bütün kartları](hesap-ayarlari-sayfasi.md) | [okul rolünde yetişkin bilgileri](hesap-ayarlari-sayfasi.md) | [öğretmen gibi](hesap-ayarlari-sayfasi.md) | [öğretmen gibi + okulun adresi ve konumu](hesap-ayarlari-sayfasi.md) | [bilgiler, bildirim, görünüm, şifre](hesap-ayarlari-sayfasi.md) | [Hesap ayarları](hesap-ayarlari-sayfasi.md) (tasarım) | [panel hesabının Hesap ayarları](hesap-ayarlari-sayfasi.md) (tasarım) | ["Yönetici hesabın" kutucuğundan](hesap-ayarlari-sayfasi.md) | — (giriş gerekir) |
| Kişisel bilgiler | [adres, il, ilçe; T.C. salt okunur, doğum tarihi zorunlu](kisisel-bilgiler.md) | [ad, adres, T.C., doğum tarihi](kisisel-bilgiler.md) | [veli gibi; ad okullardaki satırına geçer](kisisel-bilgiler.md) | [öğretmen gibi](kisisel-bilgiler.md) | [öğretmen gibi](kisisel-bilgiler.md) | [adres; T.C. salt okunur](kisisel-bilgiler.md) | [+ kanal bağlantısı, kısa tanıtım](kisisel-bilgiler.md) (tasarım) | [ad, T.C., il / ilçe](kisisel-bilgiler.md) (tasarım) | [ad, adres, T.C.](kisisel-bilgiler.md) | — |
| Giriş bilgileri | — bugün (okul değiştirir); [tasarımda kendisi](giris-bilgileri.md) | [kullanıcı adı, e-posta, telefon](giris-bilgileri.md) | [veli gibi](giris-bilgileri.md) | [veli gibi](giris-bilgileri.md) | [veli gibi](giris-bilgileri.md) | — bugün; [tasarımda kendisi, velilere görünen telefon](giris-bilgileri.md) | [yetişkin gibi](giris-bilgileri.md) (tasarım) | [yetişkin gibi](giris-bilgileri.md) (tasarım) | — ([yönetici dosyası](giris-bilgileri.md)) | — |
| Şifre değiştirme | [sade kural](sifre-degistirme.md) | [güçlü kural](sifre-degistirme.md) | [yetişkin hesabının şifresi](sifre-degistirme.md) | [öğretmen gibi](sifre-degistirme.md) | [öğretmen gibi](sifre-degistirme.md) | [sade kural](sifre-degistirme.md) | [güçlü kural](sifre-degistirme.md) (tasarım) | [güçlü kural](sifre-degistirme.md) (tasarım) | [yönetim çerezi yenilenir](sifre-degistirme.md) | — |
| Şifre ve güvenlik | — bugün; [iki adımı isteğe bağlı açar](guvenlik.md) (tasarım) | [iki adım hep açık](guvenlik.md); uygulama isteğe bağlı (tasarım) | [veli gibi](guvenlik.md) | [veli gibi](guvenlik.md) | [iki adım hep açık](guvenlik.md); uygulama önerilir (tasarım) | [e-postası varsa kod](guvenlik.md) | [iki adım zorunlu](guvenlik.md) (tasarım) | [uygulama zorunlu](guvenlik.md) (tasarım) | [uygulama zorunlu](guvenlik.md) (tasarım) | — |
| Açık oturumlarım | [cihazlarını görür, çıkar](acik-oturumlar.md) (tasarım) | [yetişkin hesabının cihazları](acik-oturumlar.md) (tasarım) | [okul bilgisayarındaki oturumu kapatır](acik-oturumlar.md) (tasarım) | [öğretmen gibi](acik-oturumlar.md) (tasarım) | [öğretmen gibi](acik-oturumlar.md) (tasarım) | [cihazlarını görür](acik-oturumlar.md) (tasarım) | [cihazlarını görür](acik-oturumlar.md) (tasarım) | [kendi oturumları](acik-oturumlar.md) (tasarım) | [kendi oturumları](acik-oturumlar.md) (tasarım) | — |
| Bildirim ayarları | [cihazda açar; tasarımda ödev hatırlatmaları](bildirim-ayarlari.md) | [cihazda açar; çocuğunun kopyaları gelir](bildirim-ayarlari.md) | [cihazda açar](bildirim-ayarlari.md) | [cihazda açar](bildirim-ayarlari.md) | [cihazda açar](bildirim-ayarlari.md) | [cihazda açar](bildirim-ayarlari.md) | [cihazda açar](bildirim-ayarlari.md) (tasarım) | [cihazda açar](bildirim-ayarlari.md) (tasarım) | [cihazda açar](bildirim-ayarlari.md) | — |
| Görünüm ve dil | [Sistem · Açık · Koyu](gorunum-ve-dil.md) | [Sistem · Açık · Koyu](gorunum-ve-dil.md) | [Sistem · Açık · Koyu](gorunum-ve-dil.md) | [Sistem · Açık · Koyu](gorunum-ve-dil.md) | [Sistem · Açık · Koyu](gorunum-ve-dil.md) | [Sistem · Açık · Koyu](gorunum-ve-dil.md) | [tema, boyut, dil](gorunum-ve-dil.md) (tasarım) | [tema, boyut, dil](gorunum-ve-dil.md) (tasarım) | [Sistem · Açık · Koyu](gorunum-ve-dil.md) | [ay / güneş; tasarımda dil](gorunum-ve-dil.md) |
| Verilerimi indir | [kendi verisi](verilerimi-indir.md) (tasarım) | [kendi + çocuğunun](verilerimi-indir.md) (tasarım) | [kendi verisi](verilerimi-indir.md) (tasarım) | [kendi verisi](verilerimi-indir.md) (tasarım) | [kendi verisi; başkasınınkini indiremez](verilerimi-indir.md) (tasarım) | [kendi verisi](verilerimi-indir.md) (tasarım) | [kendi verisi](verilerimi-indir.md) (tasarım) | [kendi verisi](verilerimi-indir.md) (tasarım) | [kendi; KVKK talebiyle kişinin sayfasından](verilerimi-indir.md) (tasarım) | — |
| Hesabımı sil | — ([okul kapatır](hesabimi-sil.md)) | [siler](hesabimi-sil.md) | [siler; rolleri okuldan çıkar](hesabimi-sil.md) | [siler](hesabimi-sil.md) | [bugün silemez; tasarımda siler](hesabimi-sil.md) | — bugün; [tasarımda siler](hesabimi-sil.md) | [siler](hesabimi-sil.md) (tasarım) | [karar yok](hesabimi-sil.md) (tasarım) | — ([yönetici dosyası](hesabimi-sil.md)) | — |
| E-posta ekleme önerisi | — | [e-postasız eski hesapta](eposta-ekleme-onerisi.md) | [e-postasız eski hesapta](eposta-ekleme-onerisi.md) | [e-postasız eski hesapta](eposta-ekleme-onerisi.md) | [e-postasız eski hesapta](eposta-ekleme-onerisi.md) | — | — | — | — | — |

Notlar:

- **Okul rolündeyken** (öğretmen, çalışan, müdür portalında) görülen ve değiştirilen her şey yetişkin hesabınındır; ad ve telefon
  okullardaki rol satırlarına da geçer.
- **Velide her çocuk ayrı oturumdur** (3 Ekim kararı): Ayarlar aynı yetişkin hesabını gösterir; tasarımdaki "Çocuğumun verilerini indir"
  bulunduğun oturumun çocuğu içindir ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).
- **Tahta hesabında** (tasarım) Hesap ayarları yoktur; profil menüsünde yalnız "Hesap değiştir" ve "Çıkış yap" vardır
  ([Tahta hesabı](../tahta/README.md)).
- **Portallarım kartı** ve **yorum kartı** bu sayfada durur ama kendi klasörlerinde anlatılır
  ([Portallarım](../portallar/portallarim.md), [Yorum yazma](../yorumlar/yorum-yazma.md)); tasarımdaki "Okulum → Bu okuldan ayrıl"
  ([Okuldan ayrılma](../portallar/okuldan-ayrilma.md)), "Kişi kodun / Veli kodun" ([Kişi kodu](../portallar/kisi-kodu.md)) ve "Ödev
  hatırlatmaları" ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)) bölümleri de öyle.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Giriş ve hesap](../giris-hesap/README.md) — kayıt, giriş, iki adımlı giriş, doğrulama uygulaması, şifre kuralları, T.C. kimlik
  numarası, kullanıcı adı, e-posta onayı, yeni cihaz uyarısı, çıkış.
- [Portallar](../portallar/README.md) — Ayarlar'daki "Portallarım" kartı, kişi kodu ve veli kodu, çocuklarım, okuldan ayrılma.
- [Bildirimler](../bildirim/README.md) — telefon bildirimi, velinin kopyaları, bildirimlerin saklanması.
- [Ödevler](../odev/README.md) ve [Hatırlatıcılar](../hatirlatici/README.md) — tasarımdaki "Ödev hatırlatmaları" bölümü.
- [Yorumlar](../yorumlar/README.md) — Ayarlar'daki "Eğitim Evi hakkında yorumun" kartı.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — aydınlatma metni, saklama süreleri, kim neyi görür; silme ve erişim hakları.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — profil menüsü, sol menünün altı, ay/güneş, "Yenilikler".
- [Ana sayfa](../ana-sayfa/README.md) — "Ayarlar" kutucuğu.
- [Çok dil](../dil/README.md) — dil seçici ve çeviri.
- [Uygulama](../uygulama/README.md) — telefon uygulamasının Ayarlar sekmesi, doğrulayıcı.
- [Eğitim Evi Aile](../aile/README.md) — uygulamadaki "Bu telefonu velimle paylaş".
- [Öğrenci hesapları](../hesaplar/README.md) — okulun öğrenci ve servisçi bilgilerini, şifresini, veli kodunu değiştirmesi.
- [Site yönetimi](../yonetim/README.md) — yönetici dosyası, hesaba müdahale, panelde zorunlu doğrulama.
- [Destek](../destek/README.md) — müdürlük devri ve hesap sorunları için talep.
- [Eğitim yılı](../egitim-yili/README.md) — önemli işlerde çift doğrulama, mezunların verisi.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — birden çok müdür, okuldan çıkarma.
- [Okul sayfası](../okul-sayfasi/README.md) — müdürün "Okulun adresi ve konumu" kartı.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — eğitmenin kanal bağlantısı; "İzleme geçmişini temizle".
- [İşlem kaydı](../islem-kaydi/README.md) — giriş bilgisi değişikliği ve "veri indirildi" kaydı.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar sayfasının tamamı, giriş bilgileri,
  hesap silme, e-posta önerisi), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`profil-kaydet`,
  `sifre-kaydet`, `tema-sec`, `tema-degis`), [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md)
  (telefon bildirimleri), [public/js/parcalar/04c-telefon.md](../../public/js/parcalar/04c-telefon.md) (ülke kodlu telefon),
  [public/js/parcalar/04a-form-alanlari.md](../../public/js/parcalar/04a-form-alanlari.md) (doğum tarihi seçici, göz düğmesi),
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (şifre, kullanıcı adı, T.C. kuralları),
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md), [public/js/tema.md](../../public/js/tema.md).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`POST /api/profile`, `POST /api/password`, `POST /api/eposta-onay`),
  [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) (`GET /api/hesap`, `POST /api/hesap/bilgi`, `POST /api/hesap/sil`),
  [sunucu/bolumler/push.md](../../sunucu/bolumler/push.md), [sunucu/guvenlik.md](../../sunucu/guvenlik.md),
  [sunucu/ortak.md](../../sunucu/ortak.md).
- Depo: [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md), [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md),
  [sunucu/veri/depo/onaylar.md](../../sunucu/veri/depo/onaylar.md), [sunucu/veri/depo/push.md](../../sunucu/veri/depo/push.md).
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md),
  [testler/test-cakisma.md](../../testler/test-cakisma.md), [testler/test-yonetim.md](../../testler/test-yonetim.md),
  [testler/test-push.md](../../testler/test-push.md), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kayıt kuralları", "İki adımlı giriş (2FA)", "Görünüm: açık/koyu
  tema ve yazı tipleri", "Telefon bildirimi (Web Push)", "Hesap türleri ve portallar").
