# Dil ve çeviri

Eğitim Evi bugün yalnız Türkçedir. Tasarımda üst şeridin sağında bir dil seçici durur: **"TR ▾"** (dil kodu ve aşağı ok; tire ve
bayrak yok). Basınca her dil kendi adıyla ve ne kadar çevrildiğiyle listelenir; seçim girişliyken hesapta, her zaman tarayıcıda
saklanır, girişsiz sayfalarda da çalışır. Çevrilen yalnız Eğitim Evi'nin kendi yazılarıdır (menü, düğme, alan adı, ileti, e-posta
ve bildirim şablonları — bunlar alıcının dilinde gider); insanların yazdıkları (mesaj, ödev, duyuru, video açıklaması) ve hukuki
metinler çevrilmez, eksik çeviriler Türkçe görünür. Arapça gibi sağdan sola diller sayfayı aynalar. Çeviriler
`/panel/translate`'teki (Türkçe eşi `/panel/ceviri`) uzun tabloda yapılır: ilk sütun Türkçe, sonra diller gerçek adlarıyla,
"+ Dil ekle" ve .po dosyasıyla dışa/içe aktarma; hücreye yazılan kendiliğinden kaydolur, onay beklemez. Çevirileri site geneli
**çevirmen** rolündeki kişiler yapar (yönetici ya da destek verir; çevirmen yalnız kendisine verilen dilleri düzenler, güvenlik
e-postalarını ve hukuki metinleri yalnız yönetici çevirir). İngilizcenin temel arayüzünü Eğitim Evi ekibi önceden çevirir; Android
uygulaması aynı kataloğu kullanır. Bütün klasör tasarım aşamasında: bugünkü sitede ve uygulamada bu bölüm yok; kaynaklar
kullanıcının 29 Eylül istekleri ve kararları (dil tanımı), 2 Ekim sözü ("çevirme sadece değişince eng yazsın ve bikaç kelim belli
etsin yeter") ve Tasarım 1 önizlemesi.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Dil seçici (TR ▾)](dil-secici.md) | Şeritteki ve girişsiz sayfalardaki düğme, açılan liste (ad, kod, oran, çubuk, not), Ayarlar'daki "Dil", seçimin saklanması | Tasarlandı — henüz kodda yok |
| [Neler çevrilir, neler çevrilmez](ceviri-kapsami.md) | Arayüz, iletiler, e-posta ve bildirim şablonları; kullanıcı içeriği, hukuki metinler; düz metin kuralı; korunan metinler | Tasarlandı — henüz kodda yok |
| [Sağdan sola diller](sagdan-sola.md) | Arapça, Farsça, İbranice; sayfanın aynalanması, menü, simgeler, düzenleyici, çeviri tablosu | Tasarlandı — henüz kodda yok |
| [Çeviri paneli (/panel/translate)](ceviri-paneli.md) | Uzun tablo, dil kartları, kendiliğinden kayıt, denetimler, geçmiş ve geri al, kimin açtığı | Tasarlandı — henüz kodda yok |
| [Dil ekleme ve .po dışa/içe aktarma](dil-ekleme-ve-po.md) | "Dil ekle" penceresi ve dil listesi, yeni dilin %0 ile seçiciye girmesi, .po ile çeviri | Tasarlandı — henüz kodda yok |
| [Çevirmen rolü](cevirmen-rolu.md) | Site geneli rol; yönetici ve destek verir; dil kısıtı, iki adımlı giriş, onaysız yayın, KVKK | Tasarlandı — henüz kodda yok |
| [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md) | TR ve EN hazır, Arapça önerisi, Korece sorusu; önizlemedeki İngilizce sözlük ve örnek katalog | Tasarlandı — henüz kodda yok |
| [Uygulamada dil (Android)](uygulamada-dil.md) | Uygulamanın Ayarlar'ında dil seçici, aynı katalog, önbellek, sağdan sola, hukuki metinler | Tasarlandı — henüz kodda yok |

Okuma sırası: önce [Dil seçici](dil-secici.md) ve [Neler çevrilir, neler çevrilmez](ceviri-kapsami.md) (dil seçen herkesin
gördüğü); sonra [Sağdan sola diller](sagdan-sola.md) ve [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md);
çeviriyi yapanlar için [Çevirmen rolü](cevirmen-rolu.md), [Çeviri paneli](ceviri-paneli.md) ve
[Dil ekleme ve .po](dil-ekleme-ve-po.md); telefon için [Uygulamada dil](uygulamada-dil.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz. Çevirmen ayrı
bir rol kapısı olmadığı için yalnız bu tabloda ayrı sütundur.

| Alt özellik | Ziyaretçi | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Eğitmen | Yönetici | Destek | Çevirmen |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Dil seçici | [girişsiz sayfalarda "TR ▾" ile seçer](dil-secici.md#ziyaretçi-giriş-yapmadan) | [şeritten ya da Ayarlar'dan seçer](dil-secici.md#oturumdaki-herkes) | [seçer; çocuk oturumlarında dil aynı kalır](dil-secici.md#veli) | [şeritten ya da Ayarlar'dan seçer](dil-secici.md#oturumdaki-herkes) | [şeritten ya da Ayarlar'dan seçer](dil-secici.md#oturumdaki-herkes) | [şeritten ya da Ayarlar'dan seçer](dil-secici.md#oturumdaki-herkes) | [şeritten ya da Ayarlar'dan seçer](dil-secici.md#oturumdaki-herkes) | [şeritten ya da Ayarlar'dan seçer](dil-secici.md#oturumdaki-herkes) | [sitede seçer; panel şeridinde seçici yok](dil-secici.md#yönetici-ve-destek) | [sitede seçer; panel şeridinde seçici yok](dil-secici.md#yönetici-ve-destek) | [seçer; oran çevirdikçe artar](dil-secici.md#çevirmen) |
| Neler çevrilir | [arayüz çevrilir; yorumlar ve hukuki metinler değil](ceviri-kapsami.md#ziyaretçi) | [öğretmenin yazdığı çevrilmez](ceviri-kapsami.md#öğrenci-ve-veli) | [bildirimin kopyası kendi dilinde](ceviri-kapsami.md#öğrenci-ve-veli) | [yazdığı çevrilmez; alıcı kendi dilinde bildirim alır](ceviri-kapsami.md#öğretmen-çalışan-ve-müdür) | [yazdığı çevrilmez](ceviri-kapsami.md#öğretmen-çalışan-ve-müdür) | [yazdığı ve okulun açtığı adlar çevrilmez](ceviri-kapsami.md#öğretmen-çalışan-ve-müdür) | [ekranlar çevrilir; velilere yazdığı not çevrilmez](ceviri-kapsami.md#servisçi) | [video başlığı ve açıklaması çevrilmez](ceviri-kapsami.md#eğitmen) | [korunan metinleri yalnız o çevirir](ceviri-kapsami.md#yönetici) | [talep yazışmaları çevrilmez](ceviri-kapsami.md#destek) | [yalnız arayüz kataloğu; korunan metinler kapalı](ceviri-kapsami.md#çevirmen) |
| Sağdan sola diller | [seçince sayfa aynalanır](sagdan-sola.md#sağdan-sola-dil-seçen-herkes) | [seçince sayfa aynalanır](sagdan-sola.md#sağdan-sola-dil-seçen-herkes) | [seçince sayfa aynalanır](sagdan-sola.md#sağdan-sola-dil-seçen-herkes) | [aynalanır; yazdığı çevrilmez, düzenleyicide yön tanımda yok](sagdan-sola.md#yazı-yazanlar) | [aynalanır; yazdığı çevrilmez](sagdan-sola.md#yazı-yazanlar) | [aynalanır; yazdığı çevrilmez](sagdan-sola.md#yazı-yazanlar) | [seçince sayfa aynalanır](sagdan-sola.md#sağdan-sola-dil-seçen-herkes) | [seçince sayfa aynalanır](sagdan-sola.md#sağdan-sola-dil-seçen-herkes) | [panelde sağdan sola sütun](sagdan-sola.md#çevirmen-ve-yönetici) | [seçince sayfa aynalanır](sagdan-sola.md#sağdan-sola-dil-seçen-herkes) | [sağdan sola sütunu çevirir](sagdan-sola.md#çevirmen-ve-yönetici) |
| Çeviri paneli | — | — | — | — | — | — | — | — | [bütün dilleri düzenler; menüde "Çeviri"](ceviri-paneli.md#yönetici) | [açamaz (çevirmen değilse)](ceviri-paneli.md#destek) | [verilen dilleri düzenler](ceviri-paneli.md#çevirmen) |
| Dil ekleme ve .po | — | — | — | — | — | — | — | — | [dil ekler, .po indirir ve yükler](dil-ekleme-ve-po.md#yönetici) | [tanımda yeri yok](dil-ekleme-ve-po.md#destek) | [kendi dilinin .po dosyası](dil-ekleme-ve-po.md#çevirmen) |
| Çevirmen rolü | — | — | — | — | — | — | — | — | [verir, alır, dil seçer](cevirmen-rolu.md#yönetici) | [verir, alır](cevirmen-rolu.md#destek) | [rolle paneli açar; iki adım zorunlu](cevirmen-rolu.md#çevirmen) |
| Hazır diller ve ön çeviri | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [ön çeviriyi düzeltir](hazir-diller-ve-on-ceviri.md#yönetici) | [TR ve EN hazır](hazir-diller-ve-on-ceviri.md#ziyaretçi-ve-oturumdaki-herkes) | [öbür dilleri çevirir](hazir-diller-ve-on-ceviri.md#çevirmen) |
| Uygulamada dil | — | [Ayarlar'dan seçer](uygulamada-dil.md#uygulamayı-kullanan-herkes) | [Ayarlar'dan seçer](uygulamada-dil.md#uygulamayı-kullanan-herkes) | [Ayarlar'dan seçer](uygulamada-dil.md#uygulamayı-kullanan-herkes) | [Ayarlar'dan seçer; kendi ekranları belirlenmedi](uygulamada-dil.md#uygulamayı-kullanan-herkes) | [Ayarlar'dan seçer](uygulamada-dil.md#uygulamayı-kullanan-herkes) | [Ayarlar'dan seçer](uygulamada-dil.md#uygulamayı-kullanan-herkes) | [Ayarlar'dan seçer; kendi ekranları belirlenmedi](uygulamada-dil.md#uygulamayı-kullanan-herkes) | [uygulamada özel ekranı yok](uygulamada-dil.md#yönetici-ve-destek) | [uygulamada özel ekranı yok](uygulamada-dil.md#yönetici-ve-destek) | — |

Notlar: Eğitmen, destek ve çevirmen site geneli rollerdir (okula bağlı değil); bir kişi üçünü birden taşıyabilir. Çevirmen bütünüyle
tanımdadır, Tasarım 1 önizlemesinde çevirmen hesabı yok; önizlemede çeviri panelini yalnız yönetici açıyor. Tahta hesabı için dil
konusunda tanımda bir şey yazmıyor.

Rol kapıları: [Ziyaretçi](../roller/ziyaretci.md) · [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) ·
[Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md). Bütün özellikler: [features/](../README.md).

## Açık noktalar

Kodlamadan önce kullanıcıya sorulacak ya da tasarımda netleşecekler:

- **Altyapı önce (karar verildi, kayıtlar eski):** kullanıcı 29 Eylül'de, çok dil mesajından birkaç dakika sonra "evet altyapı önce
  olsun" dedi; yapılış sırasında çeviri altyapısı birinci iş. Dil tanımında ve iş listesinde bu soru hâlâ açık diye yazıyor; orası
  güncellenmeli.
- **İngilizcenin kodu:** tasarım "ENG" (kullanıcının 2 Ekim sözü, tanımdaki "EN"in yerine); öbür diller iki harf kaldığı için
  kodlanırken bir kez teyit edilebilir ([Dil seçici](dil-secici.md#kurallar-ve-sınırlar)).
- **"(yarım)" rozeti:** eşiği belirlenmedi; Tasarım 1'de rozet yok, ilerleme çubuğu var.
- **Seçimin önceliği:** tarayıcıdaki seçimle hesaptaki farklıysa hangisi geçerli; uygulama ilk açılışta telefonun dilini mi alır.
- **Ayarlar ile şerit:** Tasarım 1'de Ayarlar'daki "Dil" penceresi iki dil gösteriyor ve şeritteki seçiciye bağlı değil; tanımda
  ikisi tek ayar.
- **Panel şeridi:** panel ekranları seçilen dille açılır (mantık denetiminin 24. maddesi bunu varsayar), ama Tasarım 1'de panel
  şeridinde dil seçici yok; şeride de seçici konup konmayacağı açık ([Dil seçici](dil-secici.md#yönetici-ve-destek)).
- **"/panel/translate" notu:** dil listesinin altındaki "Çeviriye yardım etmek için: egitimevi.org/panel/translate" notu, panel
  adreslerinin gizli kalması kuralıyla çelişiyor ([Dil seçici](dil-secici.md#kurallar-ve-sınırlar)).
- **Çevirmen:** rol verme düğmesinin adı, rolle birlikte dil seçimi, panel bağlantısının yeri, öbür dillerin sütunlarının
  görünürlüğü, rol alınınca ya da hesap silinince çeviri geçmişindeki ad, kişinin rolü nasıl isteyeceği.
- **.po ve diller:** .po düğmeleri, içe aktarmada çakışma kuralı, hatalı satırların gösterimi, dil kaldırma; tanım "ihtiyaç olursa
  çevirmen ekler" diyor ama çevirmenin eklediği dilin ona kendiliğinden verilip verilmeyeceği yazmıyor.
- **Bildirimler:** bugün bildirim hazır Türkçe metin olarak saklanıyor; "alıcının diliyle" için saklama biçimi seçilmeli
  ([Neler çevrilir](ceviri-kapsami.md#kod-tarafı)).
- **Biçimler ve yön:** sayı ve tarih yazımı dile göre değişecek mi; düzenleyicinin sağdan sola davranışı; yön işaretlerinin
  silinmesi; okların aynalanması.
- **Sözcükler:** önizlemedeki iki listenin farklı karşılıkları ("Bus" / "School bus", "Settings" / "Account settings"). 3 Ekim
  kararlarıyla "portal" sözcükleri "oturum" oldu, giriş yapılmış cihaz anlamındaki "oturum" yazıları da "giriş" / "cihaz" oldu
  (karar çeviri tablosunu da sayıyor); Tasarım 1 buna göre güncellendi, ön çeviri bu yeni yazılarla yapılmalı
  ([Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md#kurallar-ve-sınırlar)).

## İlgili öbür klasörler

- [Hesap ayarları](../ayarlar/README.md) — "Görünüm ve dil" bölümü ([Görünüm ve dil](../ayarlar/gorunum-ve-dil.md)), Verilerimi indir.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — şeritteki "TR ▾", profil menüsü, aynalanan menü.
- [Açılış sayfası ve girişsiz sayfalar](../acilis-sayfasi/README.md) — girişsiz şeritteki seçici, düz sayfalar, `/panel/translate` adresi.
- [Giriş ve hesap](../giris-hesap/README.md) — korunan güvenlik e-postaları, iki adımlı giriş.
- [Bildirimler](../bildirim/README.md) — bildirimlerin alıcının dilinde gitmesi.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — Türkçe kalan hukuki metinler, dil tercihi kişisel ayar.
- [Site yönetimi](../yonetim/README.md) — paneller, gizli giriş, kullanıcı arama (rol verme).
- [Destek talepleri](../destek/README.md) — destek ekibi; talep yazışmaları çevrilmez.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — eğitmen rolü, girişsiz sayfalarda seçici, video açıklaması ve altyazı.
- [Yazı düzenleyici](../yazi-yazma/README.md) — sağdan sola yazı, </> düğmesi çevirmende de.
- [Uygulama ve indirme](../uygulama/README.md) — Android'de dil.
- [Eklentiler](../eklentiler/README.md) — okulun kendi dil eklentisi.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — hazır rol şablonlarının adları çevrilir.
- [Mesajlar ve duyurular](../mesaj/README.md) — kullanıcı içeriği çevrilmez.
- [Portallar ve + Ekle](../portallar/README.md) — velide her çocuk ayrı oturum; "oturum" sözcükleri.

## Kod belgeleri

Bugün kodda yok; site ve uygulama yalnız Türkçe, metinler koda gömülü. Kodlanınca dokunacağı bugünkü kod belgeleri:

- Ön yüz: [public/KLASOR.md](../../public/KLASOR.md) (`index.html` ve düz sayfalar, `<html lang="tr">`),
  [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md) (`esc`; çeviri işlevi buraya),
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (gün ve ay adları, simgeler),
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar),
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) (üst şerit),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (girişte hesaptaki tercih),
  [public/js/tema.md](../../public/js/tema.md) (tarayıcıda saklama örneği), [public/js/belge.md](../../public/js/belge.md) (düz sayfalar),
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (sağdan sola için mantıksal özellikler),
  [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (yönetim ekranlarının ayrı paketi).
- Sunucu: [sunucu/http.md](../../sunucu/http.md) (`ok` / `bad`; bugün 509 `bad(res, '…')` iletisi),
  [sunucu/guvenlik.md](../../sunucu/guvenlik.md) ve [sunucu/yardimci/eposta.md](../../sunucu/yardimci/eposta.md) (e-posta metinleri),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) ve [sunucu/push.md](../../sunucu/push.md) (bildirim metinleri),
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`POST /api/profile`; hesaptaki tercih),
  [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md) (gizli panel kapısı), [sunucu/yetki.md](../../sunucu/yetki.md),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (çeviri ve site rolleri tabloları).
- Android: ayrı depo `KARANKOYU/Egitim-Evi-App` (`AyarlarSayfasi.md`, `Zaman.md`; ayrıntı [Uygulamada dil](uygulamada-dil.md#kod-tarafı)).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) — bugün dil bölümü yok (yanlış bir bilgi de yok); bölüm
  kodlanınca eklenecek.
