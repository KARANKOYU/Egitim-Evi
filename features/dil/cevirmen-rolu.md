# Dil ve çeviri · Çevirmen rolü

**Durum:** Tasarlandı — henüz kodda yok

Eğitim Evi'nin arayüzünü başka dillere çevirenlerin site geneli rolü: yönetici ya da destek ekibi verir, çevirmen yalnız kendisine
verilen dilleri çeviri panelinde düzenler; başvuru ya da onay kuyruğu yoktur.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: "çevirileri çevirtmenler yapabilsin biz eğitmen rolü ile paylaşım gibi birde çeviri rolü". Eğitim
Evi ekibi yalnız İngilizcenin temelini çevirir; Arapça, Rusça, Farsça gibi öbür diller çevirmenlere kalır
([Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md)). Rol, kimin hangi dili değiştirebileceğini belli eder.

## Nereden açılır

- **Yönetici ve destek:** rolün nereden verileceği dil tanımında yazmıyor. Eğitmen rolü kişinin sayfasından
  (`egitimevi.org/users/<ad>` → "Eğitmen yap") verildiği için çevirmen rolünün de orada verilip alınması beklenir
  ([Kullanıcı arama](../yonetim/kullanici-arama.md)); düğmenin adı belirlenmedi.
- **Çevirmen:** rol verilince [Çeviri paneli](ceviri-paneli.md) (`/panel/translate`) açılır.

## Adım adım

### Yönetici

1. Kişiyi bul, sayfasını aç (`/users/<ad>`; eğitmen rolündeki gibi — yukarıya bak).
2. Çevirmen rolünü ver ve hangi dil(ler)i düzenleyeceğini seç; çevirmen yalnız o dilleri değiştirebilir (dil seçiminin ekranı
   tasarlanmadı).
3. Rol kişinin site rollerine eklenir (site rolleri tablosunda veren ve tarihle); geri alınabilir.
4. Sen bütün dilleri düzenlersin; korunan metinleri (giriş kodu, şifre sıfırlama, e-posta değişikliği, yeni cihaz uyarısı
   e-postalarının şablonları ve hukuki metinler) yalnız sen çevirir ve yayına alırsın.
5. Çevirmenin kaydettiği her çeviriyi hücrenin geçmişinde görür, gerekirse "geri al"ırsın.

### Destek

1. Yönetici gibi kişinin sayfasından çevirmen rolünü verir ve alırsın.
2. Destek rolüyle çeviri panelini açamazsın (Tasarım 1'de destek panelinin menüsünde "Çeviri" yok); kendin de çevirmen rolü
   taşıyorsan paneli çevirmen olarak açarsın.
3. Yönetici hesabına dokunamazsın; bir yöneticinin site rollerini değiştirmek destek ekibinin işi değildir (yönetici destek
   hesaplarını yönetir, destek yöneticiyi ellemez — 29 Eylül kararı).

### Çevirmen

1. Rol verildikten sonra hesabına gir; iki adımlı giriş bu rolde zorunlu ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md),
   [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md)).
2. Çeviri panelini aç; yalnız sana verilen dillerin hücrelerini düzenleyebilirsin ([Çeviri paneli](ceviri-paneli.md#çevirmen)).
3. Kaydettiğin çeviri onay beklemeden yayına girer.
4. Korunan metinlere dokunamazsın; çeviri düz metin olmalı (HTML etiketi, bağlantı, telefon numarası reddedilir).
5. İstersen .po dosyasıyla kendi programında çevirirsin ([Dil ekleme ve .po](dil-ekleme-ve-po.md#çevirmen)).

**Tasarımda (Tasarım 1 önizlemesi):** çevirmen bütünüyle tanımdadır; önizlemede çevirmen hesabı, rol verme düğmesi ve dil seçimi
yok. Kişi sayfasındaki **"Site rolü"** satırı yalnız **"Site yöneticisi"**, **"Destek ekibi"** ve **"Eğitmen (eğitim içerikleri)"**
gösteriyor.

## Kurallar ve sınırlar

- **Site geneli rol:** okula bağlı değildir. Site rolleri ayrı bir tabloda tutulur (kişi, rol — yönetici, destek, eğitmen,
  çevirmen —, veren, tarih). Bir kişi aynı anda eğitmen + çevirmen + destek olabilir; yönetici de bunları taşıyabilir (29 Eylül
  kararı). Okuldaki rolü (öğretmen, veli…) bundan etkilenmez.
- **Kim verir:** yönetici ya da destek. **Onay kuyruğu yok**, başvuru formu yok (kullanıcının "atama" ilkesi). Rolü isteyen kişinin
  nasıl başvuracağı tanımda yazmıyor; eğitmen rolünde kişi destek talebiyle istiyor ([Destek sayfası](../destek/destek-sayfasi.md)).
- **Kim olabilir:** yalnız yetişkin hesabı; iki adımlı giriş zorunlu (29 Eylül kararları).
- **Okul cihazı ayrıcalığı uygulanmaz:** önerilen "okul cihazında iki adımlı kod sorulmaz" kolaylığı panel rollerine (yönetici,
  destek, eğitmen, çevirmen) hiç uygulanmaz; panelde iki adım hep zorunlu.
- **Panel kapısı:** `/panel/translate` için tek kapı tablosu; bağlantı yalnız sunucudan yetkiliye gelir, herkese giden kodda
  "/panel" yazmaz; yetkisi olmayana bilinmeyen adresle aynı 404 ([Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md)).
- **Dil kısıtı:** çevirmen yalnız kendisine verilen dil(ler)i düzenler; yönetici hepsini.
- **Korunan metinler** yalnız yöneticide; hukuki metinlerin çevirisi şimdilik hiç yok ([Neler çevrilir](ceviri-kapsami.md)).
- **KVKK:** çevirmenin adı yalnız panelde ve çeviri geçmişinde görünür; kullanıcılar bir yazıyı kimin çevirdiğini görmez.
- **Tanımda yazmayanlar:** rol alınınca ya da hesap silinince kişinin çevirilerinin ve geçmişteki adının ne olacağı; rolün yanında
  dil seçiminin nasıl yapılacağı; kullanıcı adının harfli olma şartının (eğitmende var) çevirmende de olup olmadığı.
- **Benzer roller:** eğitmen (videolar) ve tasarımdaki eklenti yayıncısı da aynı biçimde ayrı panel rolüdür
  ([Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Çeviri paneli](ceviri-paneli.md) — çevirmenin çalıştığı yer.
- [Dil ekleme ve .po](dil-ekleme-ve-po.md) — .po ile çeviri.
- [Neler çevrilir, neler çevrilmez](ceviri-kapsami.md) — korunan metinler.
- [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md) — çevirmene kalan diller.

**İlgili:**

- [Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md) — aynı biçimde verilen öbür site rolü.
- [Destek ekibi](../destek/destek-ekibi.md), [Kullanıcı arama](../yonetim/kullanici-arama.md), [Paneller](../yonetim/paneller.md).
- [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md), [Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md).
- [HTML görünümü](../yazi-yazma/html-gorunumu.md) — yazı düzenleyicinin </> düğmesi çevirmende de var.

## Kod tarafı

Bugün kodda yok. Bugün yalnız yönetici rolü var (gizli `/admin` paneli); destek, eğitmen ve çevirmen site rolleri panel işiyle
gelecek. Dokunacağı yerler: [sunucu/yetki.md](../../sunucu/yetki.md) (rol denetimi), [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md)
(gizli panel kapısı ve 404 eşitliği), [sunucu/yonetici-dosyasi.md](../../sunucu/yonetici-dosyasi.md) (bugün yöneticilerin dosyası),
[sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md) (yönetici uçları), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)
(site rolleri tablosu).

## Sık sorulanlar

- **Çevirmen olmak istiyorum, nasıl başvururum?** Başvuru formu yok; rolü yönetici ya da destek verir. Nasıl isteneceği tanımda
  yazmıyor; destek talebi açman en yakın yol.
- **Çevirim birinin onayından geçiyor mu?** Hayır; hemen yayına girer. Yanlışsa geçmişten geri alınır.
- **Öğretmenim, çevirmen de olabilir miyim?** Evet; çevirmenlik site geneli bir roldür, okuldaki rolünü etkilemez.
- **Şifre sıfırlama e-postasını da çevirebilir miyim?** Hayır; güvenlik e-postalarını yalnız yönetici çevirir.

## Sırada

- Paneller işi (yapılış sırası önerisinde 5. iş: paneller, destek, okul gezgini, eğitmen ve çevirmen rolleri): site rolleri tablosu,
  `/panel/<ad>` tek kapı, rol verme.
- Çok dil işi (22): çeviri paneli ve çevirmenin dil kısıtı.
- Kodlanmadan önce netleşecekler: rol verme düğmesinin adı ve dil seçimi; rol alınınca çeviri geçmişi; çevirmenin panel
  bağlantısının yeri.
