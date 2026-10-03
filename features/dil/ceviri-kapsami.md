# Dil ve çeviri · Neler çevrilir, neler çevrilmez

**Durum:** Tasarlandı — henüz kodda yok

Bir dil seçince Eğitim Evi'nin kendi yazıları (menü, düğme, alan adı, ileti, e-posta, bildirim) o dile geçer; insanların
yazdıkları (mesaj, ödev, duyuru, video açıklaması) ve hukuki metinler olduğu gibi kalır.

## Ne işe yarar

Dil seçen kişinin neyi kendi dilinde göreceğini, neyi Türkçe göreceğini bilmesi için. Kullanıcı 29 Eylül'de kapsamı şöyle
anlattı: "basic şeyleri biz önceden çevirebilirz açıklama disciripton … konu: subject: vb" — yani ekrandaki alan adları,
düğmeler gibi temel yazılar. Kişilerin yazdıklarını çevirecek bir dış çeviri servisi yoktur (tanım: "dış çeviri servisi yok");
bu yüzden insanların yazdıkları yazıldıkları dilde kalır.

## Nereden açılır

Ayrı bir ekranı yok; [Dil seçici](dil-secici.md) ile seçilen dil her ekranda bu kurala göre uygulanır.

| Ne | Çevrilir mi | Not |
|---|---|---|
| Menü adları, düğmeler, sayfa başlıkları, alan adları ("Açıklama", "Konu"), boş durum yazıları | Evet | arayüz kataloğu |
| Ekranda çıkan hata ve bilgi iletileri, sunucudan gelen hata iletileri (ör. "Şifre yanlış") | Evet | sunucu iletisi isteği yapanın dilinde |
| E-posta şablonları (giriş kodu, şifre sıfırlama, e-posta onayı…) | Evet, **alıcının** diliyle | güvenlik e-postalarını yalnız yönetici çevirir |
| Bildirim şablonları (zil ve telefon bildirimi) | Evet, **alıcının** diliyle | velinin kopyası velinin dilinde |
| Hazır rol şablonlarının adları ("Müdür Yardımcısı", "Rehber Öğretmen"…) | Evet | rol tanımının kararı |
| Gün, ay ve resmî tatil adları | Evet | Eğitim Evi'nin kendi yazısı (tanımda adıyla geçmez; arayüz metni sayılır) |
| Düz sayfalar (sayfa bulunamadı, okul bulunamadı, indir) | Evet | tarayıcıda seçili dile göre |
| Mesaj, duyuru, ödev metni, site duyurusu, video başlığı ve açıklaması | Hayır | kullanıcı içeriği |
| Anket ve quiz soruları, yorumlar, okul sayfasının tanıtımı, destek talebi yazışmaları | Hayır | kullanıcı içeriği (aynı ilke) |
| Okulun kendi açtığı rol, ders ve sınıf adları; kişi ve okul adları | Hayır | kullanıcı içeriği (aynı ilke) |
| Aydınlatma metni ve kullanım koşulları | Hayır, şimdilik | her dilde Türkçe gösterilir |
| Video altyazısı | Ayrı iş | eğitmen her dil için ayrı dosya ekler |

Tanımda adıyla geçen kullanıcı içerikleri mesaj, ödev metni, duyuru ve video açıklamasıdır; tablodaki öbür "Hayır" satırları
(site duyurusu, video başlığı, anket, quiz, yorum, okulun yazdığı adlar…) aynı ilkeden ("kullanıcı içeriği çevrilmez") çıkar.

## Adım adım

### Ziyaretçi

1. Açılış sayfasında dil seçersin; şerit, bölüm başlıkları, düğmeler, giriş ve kayıt formu o dile geçer.
2. "Kullananlar ne diyor?" bölümündeki yorumlar yazıldıkları dilde kalır; bölümün başlığı ve iletileri çevrilir
   ([Yorumlar bölümü](../yorumlar/yorumlar-bolumu.md)).
3. Girişsiz eğitim içeriklerinde süzgeçler, oynatıcının düğmeleri çevrilir; video başlığı ve açıklaması çevrilmez
   ([Video bilgileri](../egitim-icerikleri/video-bilgileri.md)).
4. Aydınlatma metnini ya da kullanım koşullarını açınca metin Türkçe gelir, yanında "Bu metin yalnız Türkçedir" notuyla ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md)).

### Öğrenci ve veli

1. Menü, sayfa başlıkları, süzgeçler, durum yazıları ("Teslim edildi", "Süresi doldu", "Yaptı" gibi) seçtiğin dilde görünür.
2. Öğretmenin yazdığı ödev metni, mesaj, duyuru, anket ve quiz soruları yazıldıkları dilde (çoğunlukla Türkçe) kalır. Tasarım 1'deki
   Ayarlar penceresinin notu da bunu söyler: "Öğretmenlerin yazdığı ödev ve mesajlar çevrilmez."
3. Zildeki ve telefondaki bildirimler, Eğitim Evi'nin gönderdiği e-postalar senin dilinde gelir. Veli, çocuğunun bildiriminin
   kopyasını kendi dilinde alır ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).

### Öğretmen, çalışan ve müdür

1. Ekranlar senin dilinde; yazdığın ödev, mesaj, duyuru, anket ve quiz olduğu gibi gider. Türkçe yazarsan Arapça seçmiş bir veli de
   Türkçe okur.
2. Okulun açtığı özel rol, ders ve sınıf adları yazıldığı gibi görünür; hazır rol şablonlarının adları ise çevrilir
   ([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)).
3. Bir olayın bildirimi (ödev, sınav sonucu, devamsızlık) her alıcıya kendi dilinde gider; sen hangi dili seçmiş olursan ol.

### Servisçi

Servis ekranları, sefer düğmeleri ve bildirimleri seçtiğin dilde. Velilere yazdığın not çevrilmez; veli onu senin yazdığın gibi
okur ([Velilere not yaz](../servis/gunluk-not.md)).

### Eğitmen

Eğitmen panelinin yazıları çevrilir; videonun başlığı, açıklaması ve etiketleri çevrilmez. Başka dilde altyazı istersen o dilin
.srt ya da .vtt dosyasını eklersin ([Altyazı](../egitim-icerikleri/altyazi.md)).

### Yönetici

1. Sitenin arayüzü seçtiğin dilde. Panel ekranları da seçtiğin dille açılır: düz metin kararının dayandığı mantık denetimi
   (madde 24, kullanıcı "1 çözülsün" dedi) yöneticinin de dil seçtiğini ve yönetim panelinin o dille açıldığını varsayar. Tasarım
   1'de panelin şeridinde dil seçici yok; dili sitede seçersin ([Dil seçici](dil-secici.md#yönetici-ve-destek)).
2. **Korunan metinleri yalnız sen çevirir ve yayına alırsın:** giriş kodu, şifre sıfırlama, e-posta değişikliği ve yeni cihaz
   uyarısı e-postalarının şablonları ve hukuki metinler. Hukuki metinlerin çevirisi şimdilik hiç yapılmayacak (kullanıcı 29 Eylül:
   "ing vb için kvkk düşünürüz").
3. Yazdığın site duyurusu çevrilmez ([Site duyurusu](../yonetim/site-duyurusu.md)).

### Destek

Sitenin ve panelin arayüzü seçtiğin dilde (dili sitede seçersin; yönetici bölümündeki nota bak); destek taleplerindeki
yazışmalar yazıldıkları dilde kalır ([Talep yazışması](../destek/talep-yazismasi.md)).

### Çevirmen

Çeviri panelinde yalnız arayüz kataloğunu görürsün; kullanıcıların yazdıkları orada yoktur. Korunan e-posta şablonlarına ve hukuki
metinlere dokunamazsın ([Çevirmen rolü](cevirmen-rolu.md)).

## Kurallar ve sınırlar

- **Yalnız arayüz:** dış çeviri servisi yok; kullanıcı içeriği hiçbir zaman otomatik çevrilmez.
- **Düz metin:** çeviri hiçbir zaman HTML üretmez; ekrana düz yazı olarak basılır. Sunucu bir çeviride HTML etiketini, bağlantıyı
  (http, www, alan adı deseni) ve telefon numarası desenini **reddeder** (kullanıcının 29 Eylül kararı). Böylece kimse bir düğmenin
  ya da iletinin yazısına bağlantı veya numara koyup okuyanı yanıltamaz.
- **Korunan metinler:** güvenlik e-postalarının (giriş kodu, şifre sıfırlama, e-posta değişikliği, yeni cihaz uyarısı) şablonları
  ve hukuki metinler yalnız yönetici tarafından çevrilir ve yayına alınır.
- **Hukuki metinler şimdilik Türkçe:** seçili dil ne olursa olsun aydınlatma metni ve kullanım koşulları Türkçe gösterilir; Tasarım
  1'deki dil listesinin notu: "Aydınlatma metni ve kullanım koşulları yalnız Türkçedir." (İlk öneride "Bağlayıcı olan Türkçe
  metindir" notuyla çeviri vardı; 29 Eylül kararıyla kalktı.)
- **Eksik çeviri Türkçe görünür.**
- **Yer tutucular korunur:** "{n} öğrenci", "{ad}" gibi değişen kısımlar çeviride de bulunur; çoğul biçimleri dile göre basit bir
  sayı kuralıyla seçilir (İngilizcede tekil/çoğul, Arapçada altı biçim).
- **Alıcının dili:** e-posta ve bildirim, gönderenin değil alıcının seçtiği dilde gider; sunucunun hata iletisi isteği yapanın
  dilinde döner.
- **Okul eklentileri** (tasarım, şimdilik kodlanmayacak): okulun kurduğu bir dil eklentisi yazıları değiştirebilir ya da yeni dil
  ekleyebilir; aynı düz metin kuralına uyar, korunan yazılar (giriş, şifre, iki adım, güvenlik e-postaları, hukuki metinler,
  silme ve onay düğmeleri) değişmez, eklediği dil yalnız o okulda görünür ([Eklenti sınırları](../eklentiler/sinirlar.md)).
- **Tanımda yazmayanlar:** sayı ve tarih biçimi (bugün ondalık ayırıcı virgül, tarih "3 Ekim" gibi Türkçe yazılır) dile göre
  değişecek mi; dil sonradan değişince eski bildirimler hangi dilde görünecek (bugün bildirim hazır metin olarak saklanıyor, aşağıya
  bak); hazır mesaj şablonlarının ([Hazır şablonlar](../mesaj/hazir-sablonlar.md)) Eğitim Evi'nin verdiği örnekleri çevrilecek mi.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Dil seçici](dil-secici.md) — dilin seçildiği yer.
- [Çeviri paneli](ceviri-paneli.md) — arayüz kataloğunun yazıldığı yer; düz metin denetimi orada.
- [Çevirmen rolü](cevirmen-rolu.md) — kimin neyi çevirebileceği.
- [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md), [Sağdan sola diller](sagdan-sola.md).

**İlgili:**

- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md), [Telefon bildirimi](../bildirim/telefon-bildirimi.md).
- [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md), [Şifremi unuttum](../giris-hesap/sifremi-unuttum.md),
  [E-posta onayı](../giris-hesap/eposta-onayi.md), [Yeni cihaz uyarısı](../giris-hesap/yeni-cihaz-uyarisi.md) — korunan e-postalar.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md).
- [Mesajlar ve duyurular](../mesaj/README.md), [Yazı düzenleyici](../yazi-yazma/README.md) — kullanıcı içeriği.
- [Video bilgileri](../egitim-icerikleri/video-bilgileri.md), [Altyazı](../egitim-icerikleri/altyazi.md).

## Kod tarafı

Bugün kodda yok; bütün metinler Türkçe ve koda gömülü. Tanımın sayımı: ön yüz parçalarında 970'ten fazla ayrı metin, sunucuda
yaklaşık 510 hata iletisi (bugün `bad(res, '…')` biçiminde tam 509 tane), e-posta ve bildirim metinleri; toplam 2.000–3.000 metin.

- Sunucu iletileri: `ok` / `bad` yardımcıları [sunucu/http.md](../../sunucu/http.md).
- E-posta metinleri: konular [sunucu/guvenlik.md](../../sunucu/guvenlik.md)'de kurulur ("Eğitim Evi giriş kodun: …", "Eğitim Evi
  şifre sıfırlama", "Eğitim Evi hesabını aç", "Eğitim Evi e-posta adresini onayla"); gönderim [sunucu/yardimci/eposta.md](../../sunucu/yardimci/eposta.md)
  (yalnız düz metin).
- Bildirimler: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — bildirim `bildirimler.metin` sütununa hazır Türkçe
  metin olarak (en çok 300 karakter) yazılıyor; toplu bildirimde herkese aynı metin. "Alıcının diliyle" için ya her alıcıya kendi
  dilinde kurulmalı ya da kalıp ile değerleri saklanmalı; tanım bunu seçmedi. Telefon bildirimi [sunucu/push.md](../../sunucu/push.md).
- Gün ve ay adları ön yüzde birkaç ayrı dizide (ör. `02-ikonlar.js`'te gün ve ay adları, `17-takvim.js`, `18b-etut.js`,
  `19c-okul-hayati.js`), sayılar `toLocaleString('tr-TR')` ile yazılıyor ([public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md),
  [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md)). Resmî tatil ve özel gün adları ("Cumhuriyet Bayramı"
  gibi) sunucuda sabit liste ([sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md)).
- Ekrana basma: bugün kullanıcı yazıları `esc()` ile kaçırılıyor ([public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md));
  tasarımda çeviriler de düz metin olarak basılır.
- Tasarım (tanım): ön yüzde `c('Açıklama')`, `c('{n} öğrenci', {n: 5})`; kaynak metin (Türkçe) anahtardır; sunucu iletileri aynı
  katalogdan istemcinin diline göre; katalog veritabanında, ön yüze dil başına tek sıkıştırılmış dosya (önbellekli, sürüm değişince
  yenilenir). Öneri (tanımda yok), kodlanırken dikkat: ada Türkçe ek gelen yazılar ("…'in telefonu" gibi) kodda ad ile ek birleştirilerek değil, bütün
  kalıp tek metin olarak ("{ad}'in telefonu") kataloğa girmeli ki her dil eki ve kelime sırasını kendisi kurabilsin.

## Sık sorulanlar

- **Arapça seçtim; öğretmenin yazdığı ödevi Arapça görür müyüm?** Hayır. Ödevin metni öğretmenin yazdığı gibi kalır; çevresindeki
  düğmeler ve başlıklar Arapça olur.
- **Aydınlatma metni neden Türkçe?** Hukuki metinlerin çevirisi şimdilik yok; her dilde Türkçe gösterilir.
- **E-postalar hangi dilde gelir?** Hesabında seçili dilde.
- **Okulumuzun açtığı "Robotik" dersi çevrilir mi?** Hayır; okulun yazdığı adlar olduğu gibi görünür.

## Sırada

- Çok dil işi (22): altyapı ve katalog; metinlerin koddan ayıklanması ikinci aşamada, parça parça ve araçla toplanarak.
- Kodlanmadan önce netleşecekler: bildirimlerin saklanma biçimi (hazır metin mi, kalıp mı); sayı ve tarih biçimi; hazır mesaj
  şablonlarının örnekleri.
- KVKK ve onay metinleri tam denetimi: dil tercihi satırı.
