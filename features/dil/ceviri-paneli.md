# Dil ve çeviri · Çeviri paneli (/panel/translate)

**Durum:** Tasarlandı — henüz kodda yok

Arayüz metinlerinin bütün dillerdeki karşılıklarının yazıldığı uzun tablo: ilk sütun Türkçe, sonra her dil kendi adıyla; hücreye
yazarsın, kendiliğinden kaydolur ve dil seçicideki oran hemen güncellenir.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: "çevirileri çevirtmenler yapabilsin … birde çeviri rolü gui ile .po çevirisi uzun tablo ilk satır
türkçe normali ikinci ingilizce vb gibi biz + diyerek oluyor hepsi o gui da gerçek dilz yazsın". Hemen ardından adresi verdi:
"ip/panel/translate". Çeviri bir programcıya ihtiyaç duymadan, tarayıcıdan yapılır; her dilin ne kadar çevrildiği tek bakışta
görünür.

## Nereden açılır

- **Adres:** `egitimevi.org/panel/translate`. Türkçe eşi `egitimevi.org/panel/ceviri` aynı sayfayı açar (sitenin "login / giris"
  alışkanlığı gibi) ([Adresler](../acilis-sayfasi/adresler.md)).
- **Yönetici:** Tasarım 1'de alt bilgideki **"Yönetim"** düğmesi → panelin sol menüsünde en altta **"Çeviri"** (menü sırası: "Okullar",
  "Kullanıcılar", "Destek talepleri", "Site ayarları", "Duyuru koy", "Çeviri") ([Paneller](../yonetim/paneller.md)).
- **Çevirmen:** tanıma göre panel bağlantıları yalnız yetkiliye sunucudan gelir; çevirmenin bağlantısının nerede duracağı
  (alt bilgide bir düğme mi, oturum ekranında mı) Tasarım 1'de çizilmedi ([Çevirmen rolü](cevirmen-rolu.md)).
- **Yetkisi olmayan:** adres bilinmeyen bir adresle aynı "Sayfa bulunamadı" sayfasını verir; panelin varlığı belli olmaz
  ([Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md)).

## Adım adım

Sayfanın düzeni (Tasarım 1 önizlemesi):

- **Üst şerit:** solda Eğitim Evi işareti (basınca siteye döner), yanında etiket **"Çeviri"**; sağda tema düğmesi, adın ve rolün,
  **"Siteye dön"**.
- **Sol menü:** yönetim bölümleri, "Çeviri" seçili.
- **Başlık:** **"Çeviri"**, altında **"100 arayüz metni · 3 dil · dil seçicideki oranlar buradan gelir"**.
- **Dil kartları:** her dil için kendi adı (English, Deutsch, العربية), kodu (ENG, DE, AR), iri yazıyla oranı (%82, %12, %41)
  ve yeşil ilerleme çubuğu; en sonda kesik çizgili **"Dil ekle"** kartı (artı simgeli).
- **İpucu:** **"Hücreye bas, yaz; Enter ya da başka yere basınca kendiliğinden kaydedilir. Boş hücre o dilde Türkçe görünür.
  Kullanıcıların yazdığı içerik (mesaj, ödev, duyuru) çevrilmez."**
- **Tablo:** başlık satırında **"Türkçe"** ve her dil için gerçek adı ile oranı ("English %82"); her satırın başında Türkçe metin
  ("Ana sayfa", "Kaydet", "Şifremi unuttum"…). Tablo kendi içinde kayar (ekran yüksekliğinin yaklaşık %70'i); başlık satırı üstte,
  Türkçe sütun solda sabit kalır, yana kaydırınca kaybolmaz. Her hücre bir yazı kutusu; boş hücre sarımsı zeminde **"çevrilmedi"**
  yazısıyla; kaydedilen hücre bir an yeşil yanar.

### Yönetici

1. Paneli aç (yukarıdaki yoldan ya da adresi yazarak).
2. Bir hücreye bas ve çeviriyi yaz.
3. **Enter**'a bas ya da başka bir yere bas: hücre kendiliğinden kaydolur. Enter seni bir alt satırın aynı dil hücresine götürür;
   uzun bir sütunu aşağı doğru hızla doldurabilirsin.
4. Kaydedilince dilin kartındaki oran, çubuk, sütun başlığındaki oran ve [Dil seçici](dil-secici.md)'deki "%… çevrildi" hemen
   güncellenir.
5. Çeviri bir HTML etiketi ya da bağlantı içeriyorsa kaydedilmez, hücre eski hâline döner ve ileti çıkar: **"Çeviri düz metin
   olmalı: HTML etiketi ya da bağlantı olamaz."**
6. Bir hücreyi boşaltıp kaydedersen o yazı o dilde yeniden Türkçe görünür; oran düşer.
7. Yeni dil için **"Dil ekle"**ye bas ([Dil ekleme ve .po](dil-ekleme-ve-po.md)).
8. Bütün dilleri düzenleyebilirsin. Korunan metinleri (güvenlik e-postalarının şablonları, hukuki metinler) yalnız sen çevirir ve
   yayına alırsın ([Neler çevrilir](ceviri-kapsami.md)).

Tanımda olup Tasarım 1'de çizilmeyenler:

- **"Çevrilmemişler" süzgeci:** yalnız seçili dilde boş olan satırları gösterir.
- **Arama:** Türkçe metinde ya da çeviride arar.
- **"Nerede geçiyor":** her metnin hangi sayfada kullanıldığı (sayfa adı); kısa bir kelimenin ("Ekle") yerini bilmeden çevirmemek için.
- **Yer tutucu denetimi:** Türkçe metinde `{n}` ya da `{ad}` gibi bir yer tutucu varsa çeviride de olmalı; eksikse kaydetmez.
- **Uzunluk uyarısı:** çeviri düğmeye sığmayacak kadar uzunsa uyarır.
- **Her hücrenin geçmişi ve "geri al":** kim, ne zaman, ne yazdı; eski bir değere tek tıkla dönülür.
- **Telefon numarası deseni** de reddedilir (önizleme yalnız etiketi ve bağlantıyı yakalıyor).
- **.po dışa / içe aktarma** ([Dil ekleme ve .po](dil-ekleme-ve-po.md)).

### Çevirmen

1. Paneli aç; iki adımlı giriş senin rolünde zorunlu ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).
2. Yalnız sana verilen dil(ler)in hücrelerini düzenleyebilirsin; yazma, kaydetme, Enter ile aşağı inme yöneticininkiyle aynı.
3. Kaydettiğin çeviri **onay beklemeden** yayına girer; yanlışsa geçmişten "geri al" ile düzeltilir.
4. Korunan metinler (güvenlik e-postaları, hukuki metinler) sana kapalıdır.
5. Adın yalnız panelde ve hücrenin geçmişinde görünür.

**Tasarımda (Tasarım 1 önizlemesi):** önizlemede çevirmen hesabı yok; panel yalnız yöneticiyle açılır. Öbür dillerin sütunlarının
çevirmene salt okunur mu görüneceği, hiç mi görünmeyeceği tanımda yazmıyor.

### Destek

Destek panelinin menüsünde "Çeviri" yoktur ("Okullar", "Kullanıcılar", "Destek talepleri"); Tasarım 1'de `/panel/translate` destek
rolüyle açılmaz. Destek çevirmen rolünü verir ve alır ([Çevirmen rolü](cevirmen-rolu.md)). Bir kişi hem destek hem çevirmen
olabilir; o zaman paneli çevirmen olarak açar.

## Kurallar ve sınırlar

- **Kim:** çevirmen (yalnız kendisine verilen diller) ve yönetici (bütün diller). Başka herkese bilinmeyen adresle aynı 404.
- **Onay kuyruğu yok:** kullanıcının "atama" ilkesi; kaydedilen çeviri hemen geçerli. Denetim geçmiş ve "geri al" ile.
- **Düz metin:** çeviri HTML üretmez; HTML etiketi, bağlantı (http, www, alan adı deseni) ve telefon numarası deseni reddedilir.
  Tasarım 1'deki denetim: etiket (`<…>`), "http:" / "https:", "www." ve ".com", ".org", ".net", ".tr" ile biten adlar.
- **Hücre:** en çok 200 karakter (Tasarım 1); kaydederken art arda boşluklar teke iner, baştaki ve sondaki boşluk atılır.
- **Yer tutucular** korunmak zorunda; **çoğul** biçimleri dile göre (İngilizce tekil/çoğul, Arapça altı biçim) basit sayı kuralıyla.
- **Oran:** dolu hücre sayısı / bütün arayüz metinleri; dil seçicideki oran buradan gelir.
- **Korunan metinler:** giriş kodu, şifre sıfırlama, e-posta değişikliği ve yeni cihaz uyarısı e-postalarının şablonları ve hukuki
  metinler yalnız yöneticide; hukuki metinlerin çevirisi şimdilik hiç yok.
- **Kullanıcı içeriği** bu tabloda yoktur; yalnız arayüz kataloğu.
- **Katalog:** veritabanında (dil, kaynak, çeviri, durum, çeviren, tarih); ön yüze dil başına tek sıkıştırılmış dosya olarak gider
  (önbellekli, sürüm değişince yenilenir). Bu yüzden kaydedilen çeviri kullanıcılara kataloğun yeni sürümüyle ulaşır.
- **Panel kuralları:** panel rollerinde iki adımlı giriş zorunlu; panel bağlantısı herkese giden kodda yazmaz, yalnız sunucu
  yetkiliye gönderir ([Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md)).
- **KVKK:** çevirmenin adı yalnız panelde ve geçmişte görünür.
- **Okul eklentisinin eklediği dil** bu tabloya karışmaz; yalnız o okulda görünür ([Eklenti sınırları](../eklentiler/sinirlar.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Dil ekleme ve .po](dil-ekleme-ve-po.md) — "Dil ekle" penceresi, .po dosyaları.
- [Çevirmen rolü](cevirmen-rolu.md) — paneli kimin açtığı.
- [Dil seçici](dil-secici.md) — oranların göründüğü yer.
- [Neler çevrilir, neler çevrilmez](ceviri-kapsami.md) — tablonun kapsamı ve korunan metinler.
- [Sağdan sola diller](sagdan-sola.md) — sağdan sola sütun.
- [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md) — tablonun ilk dolu sütunu.

**İlgili:**

- [Paneller](../yonetim/paneller.md), [Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md),
  [Panelde zorunlu doğrulama](../yonetim/panelde-zorunlu-dogrulama.md).
- [Adresler](../acilis-sayfasi/adresler.md) — `/panel/translate` ve `/panel/ceviri`.
- [Destek ekibi](../destek/destek-ekibi.md).

## Kod tarafı

Bugün kodda yok; `/panel` adresleri de henüz yok. Bugünkü gizli yönetim panelinin adresi `/admin`; çeviri paneli onun yerine gelecek
panel yapısının üstüne kurulur:

- Gizli adres ve 404 eşitliği: [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md), [sunucu/http.md](../../sunucu/http.md),
  [public/KLASOR.md](../../public/KLASOR.md) (`/admin` satırı).
- Yönetim ekranlarının ayrı paketi: [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md).
- Yetki ve rol: [sunucu/yetki.md](../../sunucu/yetki.md); yeni tablolar (çeviriler, site rolleri) [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Tasarım 1 önizlemesinde tablo 100 örnek metinle kurulu (`PNL_CV_HAM`), kaydetme `pnlCvKaydet`, "Dil ekle" penceresi
  `pnlDilEklePencere`; paneli yalnız yönetici rolü açar.

## Sık sorulanlar

- **Çevirim ne zaman görünür?** Onay beklemeden kaydolur; kullanıcılara kataloğun yeni sürümüyle ulaşır.
- **Bir düğmenin yazısına bağlantı koyabilir miyim?** Hayır; çeviri düz metin olmalı. Bağlantı, HTML etiketi ve telefon numarası
  reddedilir.
- **`{n}` ne demek?** Ekranda sayıyla ya da adla değişen yerin işareti; çeviride aynen kalmalı ("{n} öğrenci" → "{n} students").
- **Hücreyi boş bırakırsam ne olur?** O yazı o dilde Türkçe görünür.
- **Yanlış bir çeviriyi nasıl geri alırım?** Tanımda her hücrenin geçmişi ve "geri al" var.

## Sırada

- Çok dil işi (22): çeviri paneli ve .po; panel adresleri işi (/panel/admin, /panel/destek) ile aynı kapı tablosuna bağlanır.
- Paneller işi: site rollerinin (yönetici, destek, eğitmen, çevirmen) tek tablosu ve `/panel/<ad>` için tek kapı.
- Kodlanmadan önce netleşecekler: çevirmenin panel bağlantısının yeri; öbür dillerin çevirmene görünüp görünmeyeceği; yer tutucu ve
  uzunluk uyarılarının ileti metinleri.
