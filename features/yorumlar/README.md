# Yorumlar

Açılış sayfasının en altındaki "Kullananlar ne diyor?" bölümü: Eğitim Evi'ni gerçekten kullanan yetişkinlerin (bir okulda onaylı
öğretmen ya da müdür olan ya da çocuğunu eklemiş olan kişi) 0–5 yıldızlı, en çok 500 karakterlik yorumları. Her hesabın tek yorumu
olur; Ayarlar'daki "Eğitim Evi hakkında yorumun" kartından yazılır, değiştirilir, silinir. Yorum ön onaysız hemen yayına girer;
yazanın tam adı yerine kısaltılmış adı ("De. Ka."), baş harfli bir yuvarlak ve "Öğretmen, veli" gibi bir etiket görünür. Küfür,
hakaret (depodaki `badwordsfilter.json` listesi; harf uzatma, rakam ve aralıklı yazım düzleştirilerek) ve internet adresi taşıyan
yorum kaydedilmeden geri çevrilir; geçeni sistem yöneticisi silmeden gizler. Öğrenci, servisçi ve sistem yöneticisi yazmaz; giriş
yapmamış herkes okur. Bütün parçalar bugün kodda var. Tasarımda değişenler: Ayarlar profil menüsüne taşınır ve yorum "Hesap
ayarları → Gizlilik ve verilerim" satırından (Tasarım 1 önizlemesinde bir pencerede) yazılır; giriş yapmış kişi "Ana siteye dön" ile
açılışı görür; yönetici ekranı `/panel/admin`'e taşınır ve kişi sayfasında "Yazdığı yorumlar" kartı gelir.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Yorum yazma](yorum-yazma.md) | Ayarlar'daki kart, kim yazar, yıldız ve metin, bütün hata iletileri, saatlik sınır | Kodda var; tasarımda ek olarak profil menüsünden giriş ve yorum penceresi |
| [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md) | "Yorumu güncelle", "Yorumu sil", gizlenmiş yorumun sahibi, yazma hakkını kaybeden kişi | Kodda var; tasarımda ek olarak pencerede iki dokunuşla silme |
| [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md) | "De. Ka.", "A. N. Ka.", baş harfli yuvarlak, "Müdür, öğretmen, veli" | Kodda var |
| [Uygunsuz kelime ve internet adresi süzgeci](uygunsuz-kelime-suzgeci.md) | Düzleştirme, eşleşme türleri, adres yasağı, kelime listesi, bilinen boşluklar | Kodda var |
| [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md) | "Kullananlar ne diyor?": ortalama, sayı, en yeni 12 kart, boş ve hata hâlleri | Kodda var; tasarımda ek olarak "Ana siteye dön" ile giriş yapmışken görme ve SSS'de yorumlar sorusu |
| [Yorumu gizleme (yönetici)](yorum-gizleme.md) | Yönetim panelindeki "Yorumlar", "Gizle" / "Göster", işlem kaydı | Kodda var; tasarımda ek olarak `/panel/admin` ve kişi sayfasındaki "Yazdığı yorumlar" |

Okuma sırası: herkes önce [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md); yorum yazacak veli, öğretmen ve müdür
[Yorum yazma](yorum-yazma.md), [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md),
[Uygunsuz kelime ve internet adresi süzgeci](uygunsuz-kelime-suzgeci.md) ve [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md);
sistem yöneticisi [Yorumu gizleme](yorum-gizleme.md) ve süzgecin "Yönetici" bölümü.

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Ziyaretçi | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Eğitmen | Destek | Yönetici |
|---|---|---|---|---|---|---|---|---|---|---|
| Yorum yazma | [yazamaz; girişe yönlendirilir](yorum-yazma.md#ziyaretçi) | [yazamaz](yorum-yazma.md#öğrenci-ve-servisçi) | [çocuğu bağlıysa yazar](yorum-yazma.md#veli) | [onaylı rolüyle yazar](yorum-yazma.md#öğretmen) | [bugün öğretmen gibi yazar; tasarımda karar yok](yorum-yazma.md#çalışan) | [yazar](yorum-yazma.md#müdür) | [yazamaz](yorum-yazma.md#öğrenci-ve-servisçi) | [yalnız eğitmen olarak yazamaz](yorum-yazma.md#eğitmen) | [karar yok; bugünkü kurala göre yazamaz](yorum-yazma.md#yönetici-ve-destek) | [yazamaz](yorum-yazma.md#yönetici-ve-destek) |
| Yorumu değiştirme ve silme | — | — | [değiştirir](yorumu-duzeltme-ve-silme.md#değiştirmek), [siler](yorumu-duzeltme-ve-silme.md#silmek) | [değiştirir](yorumu-duzeltme-ve-silme.md#değiştirmek), [siler](yorumu-duzeltme-ve-silme.md#silmek) | [yazabiliyorsa aynı](yorumu-duzeltme-ve-silme.md#çalışan-ve-eğitmen) | [değiştirir](yorumu-duzeltme-ve-silme.md#değiştirmek), [siler](yorumu-duzeltme-ve-silme.md#silmek) | — | [yazabiliyorsa aynı](yorumu-duzeltme-ve-silme.md#çalışan-ve-eğitmen) | — | [başkasınınkine dokunamaz](yorumu-duzeltme-ve-silme.md#yönetici) |
| Adın kısaltılması ve rol etiketi | [kısa adı ve etiketi görür](ad-kisaltma-ve-etiket.md#ziyaretçi-okuyan) | [görür](ad-kisaltma-ve-etiket.md#ziyaretçi-okuyan) | ["Veli" etiketi](ad-kisaltma-ve-etiket.md#veli-öğretmen-ve-müdür-yorumu-yazan) | ["Öğretmen" etiketi](ad-kisaltma-ve-etiket.md#veli-öğretmen-ve-müdür-yorumu-yazan) | [bugün "Öğretmen"](ad-kisaltma-ve-etiket.md#çalışan-ve-eğitmen) | ["Müdür" etiketi](ad-kisaltma-ve-etiket.md#veli-öğretmen-ve-müdür-yorumu-yazan) | [görür](ad-kisaltma-ve-etiket.md#ziyaretçi-okuyan) | [etikete girmez](ad-kisaltma-ve-etiket.md#çalışan-ve-eğitmen) | — | [yalnız kısa adı görür](ad-kisaltma-ve-etiket.md#yönetici) |
| Uygunsuz kelime ve internet adresi süzgeci | — | — | [yorumu süzgeçten geçer](uygunsuz-kelime-suzgeci.md#veli-öğretmen-ve-müdür-yorumu-yazan) | [yorumu süzgeçten geçer](uygunsuz-kelime-suzgeci.md#veli-öğretmen-ve-müdür-yorumu-yazan) | [yazabiliyorsa geçer](uygunsuz-kelime-suzgeci.md#veli-öğretmen-ve-müdür-yorumu-yazan) | [okulun kaydında reddi görür](uygunsuz-kelime-suzgeci.md#müdür) | — | [yazabiliyorsa geçer](uygunsuz-kelime-suzgeci.md#veli-öğretmen-ve-müdür-yorumu-yazan) | — | [reddi görür, listeyi düzenler](uygunsuz-kelime-suzgeci.md#yönetici) |
| Açılış sayfasındaki yorumlar bölümü | [okur](yorumlar-bolumu.md#ziyaretçi) | [okur](yorumlar-bolumu.md#öğrenci-ve-servisçi) | [okur, kendi yorumunu görür](yorumlar-bolumu.md#veli-öğretmen-ve-müdür) | [okur, kendi yorumunu görür](yorumlar-bolumu.md#veli-öğretmen-ve-müdür) | [okur](yorumlar-bolumu.md#veli-öğretmen-ve-müdür) | [okur, kendi yorumunu görür](yorumlar-bolumu.md#veli-öğretmen-ve-müdür) | [okur](yorumlar-bolumu.md#öğrenci-ve-servisçi) | [okur](yorumlar-bolumu.md#ziyaretçi) | [okur](yorumlar-bolumu.md#ziyaretçi) | [okur; tam liste Yorumlar'da](yorumlar-bolumu.md#yönetici) |
| Yorumu gizleme (yönetici) | — | — | [yorumu gizlenirse turuncu not](yorum-gizleme.md#yorumu-gizlenen-kişi) | [yorumu gizlenirse turuncu not](yorum-gizleme.md#yorumu-gizlenen-kişi) | [yorumu gizlenirse turuncu not](yorum-gizleme.md#yorumu-gizlenen-kişi) | [gizleyemez; yorumu gizlenebilir](yorum-gizleme.md#öbür-roller) | — | [gizleyemez](yorum-gizleme.md#öbür-roller) | [tasarımda kişi sayfasında görür, gizleyemez](yorum-gizleme.md#destek-tasarım) | [gizler, yeniden gösterir](yorum-gizleme.md#yönetici) |

Notlar:

- **Çalışan:** bugün kodda ek görevli kişi öğretmen hesabı ve bir ek rolle çalışır; yorumda "Öğretmen" sayılır. Tasarımda (çalışan
  tanımı) kişi okula "çalışan" olarak eklenir; öğretmen görevi verilmemiş çalışanın yorum hakkı tanımlarda konuşulmadı.
- **Eğitmen, destek** tasarımdaki rollerdir. Eğitmen hesabı yetişkin hesabıdır: aynı hesapta öğretmen/müdür portalı ya da çocuğu varsa
  o sıfatla yazar. Destek ekibinin yorum yazması konuşulmadı.
- **Tahta hesabı** (tasarım) okulun sınıf tahtası için açtığı hesaptır; yorum yazmaz, yorum ekranlarını kullanmaz.
- Bir kişinin birden çok rolü olabilir (ör. bir okulda öğretmen, başka bir çocuğun velisi): yorum tek kalır, etiketi "Öğretmen, veli"
  olur.

Rol kapıları: [Ziyaretçi](../roller/ziyaretci.md) · [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) ·
[Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Eğitmen](../roller/egitmen.md) · [Destek](../roller/destek.md) · [Tahta](../roller/tahta.md) · [Yönetici](../roller/yonetici.md).
Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Açılış sayfası ve girişsiz sayfalar](../acilis-sayfasi/README.md) — bölümün durduğu sayfa ([Açılış sayfası](../acilis-sayfasi/acilis.md));
  tasarımda [Sık sorulan sorular](../acilis-sayfasi/sss.md)'a "Açılış sayfasındaki yorumları kim yazar?" sorusu eklenir.
- [Hesap ayarları](../ayarlar/README.md) — yorum kartının yeri; [Hesabımı sil](../ayarlar/hesabimi-sil.md) (yorum hesapla silinir),
  [Verilerimi indir](../ayarlar/verilerimi-indir.md) (tasarımda yorum da dosyaya girer), [Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)
  (kısa adın kaynağı).
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — [Profil menüsü](../menu-ve-arama/profil-menusu.md),
  [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md), [Sol menü](../menu-ve-arama/sol-menu.md).
- [Portallar ve + Ekle](../portallar/README.md) — çocuk ekleme ve okul rolleri yazma hakkını ve etiketi belirler; velide her çocuk
  ayrı oturum olsa da yorum tektir.
- [Site yönetimi](../yonetim/README.md) — [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md), [Paneller](../yonetim/paneller.md),
  [Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md), [Site yedekleri](../yonetim/yedekler.md).
- [İşlem kaydı](../islem-kaydi/README.md) — "Uygunsuz kelimeli yorum reddedildi", "Yorum gizlendi", "Yorum yeniden gösterildi".
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — aydınlatma metnindeki "Açılış sayfası yorumu" satırı, kullanım koşullarındaki
  içerik sorumluluğu, kim neyi görür.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — rolsüz çalışan.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — eğitmen rolü; videolarda yorum yok, yalnız "Beğen".
- [Destek talepleri](../destek/README.md) — destek ekibi ve yanlış yakalanan kelimenin bildirilmesi.
- [Dil ve çeviri](../dil/README.md) — ekran metinleri çevrilir, yorum metni çevrilmez.
- [Uygulama ve indirme](../uygulama/README.md) — Android uygulamasında yorumlar bugün yok.

## Kod belgeleri

- Sunucu: [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) (`/api/yorumlar`: liste, `benim`, yaz, `sil`, yönetici `hepsi`
  ve `gizle`; `adKisalt`, `yazarBilgisi`), [sunucu/yardimci/kufur-suzgeci.md](../../sunucu/yardimci/kufur-suzgeci.md) (süzgeç),
  [sunucu/api.md](../../sunucu/api.md) (yönetici uçlarının gizliliği), [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).
- Veri: [sunucu/veri/depo/yorumlar.md](../../sunucu/veri/depo/yorumlar.md) (tablo `yorumlar`, şema 019 —
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)), [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedek).
- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (açılıştaki bölüm),
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar'daki kart),
  [public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) ve
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (yöneticinin Yorumlar ekranı),
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (baş harfli yuvarlak, tarih biçimleri),
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`29-dis-sayfalar.css`, `28-yetiskin-hesap.css`).
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md), [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yorumlar" paragrafı ve "Yönetim paneli").
