# Ödevler · Başlama ve son teslim (tarih ve saat)

**Durum:** Kodda var; tasarımda ek olarak başlama ve son tarih ikisi de zorunlu olur ve takvim kutusu "Bugün" / "Kapat" düğmeli, sınavları ve özel günleri de işaretleyen bir ajanda takvimi olur (Tasarım 1 önizlemesi).

Ödevin ne zaman başladığını ve en son hangi gün, hangi saatte teslim edileceğini takvimden gün, listeden saat seçerek
belirlemek; "süresi doldu", "bugün son gün", "N gün kaldı" bilgilerinin hepsi bu iki andan hesaplanır.

## Ne işe yarar

Kullanıcı 29 Ağustos'ta şöyle istedi: tarih takvimden seçilsin, sonra saat yazılsın, saat varsayılan 12 olsun ("zaten çoğu
12'de bırakır ama derslerinde kontrol eder"); 26 Eylül'de "hoca ödev girerken tarih girmek için o ajanda şeyi" dedi. Bu
yüzden tarih kutusu tarayıcının kendi kutusu değil, günlerin üstünde tatilleri, okul etkinliklerini ve öteki ödevlerin son
gününü gösteren Türkçe bir takvim; saat ayrı bir listedir.

İki an vardır:

- **Başlama anı** — başlama günü + başlama saati. Quiz bu andan önce başlatılamaz ("Quiz … tarihinde açılacak."). Teslim
  dosyası yüklemesi ise saate bakmaz: başlama **gününün** başında (00:00) açılır, ondan önce "Ödev henüz başlamadı.".
- **Son teslim anı** — son gün + son saat. Geçince ödev "Süresi doldu" olur, teslim dosyası yüklenmez, quiz başlatılmaz.

## Nereden açılır

[Yeni ödev](odev-verme.md) ve [Ödevi düzenle](odevi-duzenleme-ve-silme.md) pencerelerinde **"Başlama tarihi \*"** ve
**"Son tarih \*"** alanları. Her alanda bir tarih düğmesi (takvim simgeli) ve yanında saat listesi var.

Öğrenci, veli ve müdür bu anları listelerde ve ödevin penceresinde görür (aşağıda).

## Adım adım

### Tarih düğmesi ve takvim (bugünkü site)

- Düğmede tarih **"08.09.2025"** biçiminde, yanında soluk gün adı ("Pazartesi") ve takvim simgesi. Boşken soluk
  **"gg.aa.yyyy"**.
- Basınca açılan takvim: üstte **‹ Eylül 2025 ›**, Pazartesiyle başlayan altı haftalık ızgara (önceki/sonraki ayın günleri
  soluk), solda hafta numarası. Tatil günleri renkli ve kalın.
- Her günün altında küçük noktalar: **tatil**, **okul etkinliği**, **o gün biten öteki ödevler**.
- Takvimin altında üzerine geldiğin ya da seçtiğin günün kısa ajandası: kalın **"4 Eylül 2026, Cuma"**, altında **"3 dersin
  var · Ödev Oran orantı (Matematik) · Etkinlik Veli toplantısı"** (ödevin yanında parantez içinde dersi); boş günde tarihin
  yanında "· boş gün", veri gelirken "· yükleniyor".
- En altta **"Bugün"**, **"Temizle"**, **"Tamam"**. Bir güne basmak onu seçer, takvim açık kalır; "Tamam", Esc ya da dışarı
  tıklamak kapatır.
- Klavye: oklar bir gün / bir hafta, PageUp / PageDown bir ay, Enter seçer, Esc kapatır.
- "Son tarih" takviminde başlama gününden önceki günler basılamaz.

### Saat listesi

00:00'dan 23:30'a yarım saatlik 48 seçenek. Listede olmayan eski bir saat (ör. 12:10) en başa seçili olarak eklenir,
kaybolmaz.

### Öğretmen

1. "Yeni ödev"de **başlama** günü bugün, saati **bir sonraki yarım saat** (18:54'te açtıysan 19:00) gelir. Ödevin hemen
   başlamasını istiyorsan dokunma; ileri bir güne almak için takvimden gün seç.
2. **"Son tarih"** boş gelir, saati **12:00**. Takvimden son günü seç; gerekirse saati değiştir (ör. dersten önce 08:30).
3. İpucu satırı: "Takvimde her güne düşen tatil, etkinlik ve öteki ödevlerin görünür. Çoğu ödev için son saat 12:00 uygundur."
4. "Ödevi düzenle"de tarihler ödevin kayıtlı değerleriyle gelir (başlama saati yoksa 08:00, son saat yoksa 12:00).

Tasarımda (Tasarım 1 önizlemesi):

- Satırlar **"Başlama:"** ve **"Son tarih:"**; düğmede boşken "gg.aa.yyyy · takvimden seç", seçilince "01.10.2026 ·
  Perşembe".
- Takvim: **‹ Ekim 2026 ›**, "Pzt Sal Çar Per Cum Cmt Paz"; günlerde ödev, sınav, tatil, etkinlik ve özel gün noktaları
  (ör. "Cumhuriyet Bayramı", "Öğretmenler Günü", "7-A veli toplantısı"); altta seçilen günün ajandası: **"1 Ekim 2026
  Perşembe · 4 dersin var · Ödev: Kesirlerle toplama — alıştırma 3 (7-A)"** (ders yoksa "dersin yok"); düğmeler
  **"Bugün"** ve **"Kapat"**. Güne basınca takvim kapanır.
- Yeni ödevde başlama en erken bugün, son tarih en erken başlama günü; başlama günü son tarihten sonraya alınırsa son tarih
  silinir.
- İkisi de **zorunlu**: "Başlama tarihini takvimden seç.", "Son tarihi takvimden seç."; tarih ve saat birlikte
  karşılaştırılır: "Son tarih başlamadan önce olamaz."

### Öğrenci ve veli

Listede satırın alt yazısında **"son teslim 4 Ekim 2026, Pazar · 12:00"**, sağda kalan süre etiketi:

- **"N gün kaldı"** (mavi; yarına kalmışsa turuncu),
- **"Bugün 12:00'e kadar"** (turuncu),
- **"Süresi doldu"** (kırmızı),
- son tarihi olmayan ödevde **"Aktif"** (mavi).

Ödevin penceresinde **"Veriliş: 30 Eylül 2026, Çarşamba"** ve **"Son teslim: 4 Ekim 2026, Pazar · 12:00"** (son tarih yoksa
"Süresiz") yazar ([Ödevin penceresi](odev-penceresi.md)).

Tasarımda etiketler takvim gününe göre: **"Bugün 23:00'e kadar"**, **"Yarın 15:00'e kadar"**, **"2 gün kaldı"**; pencerede
"Başlama: 27 Eylül 2026 Pazar 08:30" ve "Son tarih: 1 Ekim 2026 Perşembe 23:00" + kalan etiketi.

### Müdür

[Müdürün ödev görünümü](mudurun-odev-gorunumu.md)nde her ödevin alt satırında son teslim önünde etiket olmadan yazar ("Ayşe
Kaya · 24 öğrenci · 4 Ekim 2026, Pazar · 12:00"), son tarihsiz ödevde "süresiz"; ödevin süresi dolmuşsa "Süresi geçmiş" grubuna
düşer.

## Kurallar ve sınırlar

- **Varsayılan son saat 12:00.** Saat boş ya da bozuk gelirse 12:00 sayılır; eski kayıtlarda da saati olmayan ödev 12:00'de
  biter.
- **Başlama saati** yalnız başlama günü varsa saklanır; başlama günü yoksa ödev hemen başlamış sayılır.
- **Sıra:** başlama günü son günden sonra olamaz: **"Son tarih başlangıçtan önce olamaz"** (pencere de "Ödevi düzenle"de
  "Son tarih başlangıçtan önce olamaz." der). Aynı gün biten ödevde son saat başlama saatinden sonra olmalı: **"Aynı gün biten
  ödevde son saat başlama saatinden sonra olmalı"** (bu kural yalnız sunucuda; pencere önceden uyarmaz).
- **Son tarih aslında zorunlu değil.** Yanındaki yıldız yalnız görünüş: boş bırakılırsa ödev **süresiz** verilir, hiç
  gecikmez, kalan etiketi "Aktif" olur. Bu durumda teslim dosyalarının silinme kuralı da değişir
  ([Saklama ve silinme](saklama-ve-silinme.md)). Tasarımda son tarih zorunlu.
- **Saat dilimi.** Teslim anı sunucunun yerel saatiyle hesaplanır; sunucu Türkiye saatinde çalışmalı (kurulum belgesi
  `TZ=Europe/Istanbul`). Bilinen açık: "Yeni ödev"in başlama günü tarayıcıda UTC'den alınır; Türkiye saatiyle 00:00–03:00
  arasında açılan pencerede başlama günü bir önceki gün gelir.
- **Başlama gelmeden** ödev listede görünür; teslim dosyası başlama gününe kadar yüklenmez ("Ödev henüz başlamadı."; yalnız
  gün denetlenir, saat değil), quiz başlama anına (gün + saat) kadar başlatılamaz. Bilinen açık: başlama günü gelince dosya
  yüklemesi, öğretmenin seçtiği başlama saatini beklemeden açılır.
- **Teslim payı.** Süre dolmadan başlamış bir dosya yüklemesi en çok 10 dakika geç bitebilir ([Teslim](teslim.md)).
- **Tarih değişince.** Son teslim (gün ya da saat) değiştirilirse öğrencilere "Ödev güncellendi: … (son gün 05.10 12:00)"
  bildirimi gider ve teslim dosyaları değişiklikten sonra en az 7 gün daha kalır ([Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md)).
- **Takvim verisi** ay ay takvim ucundan gelir; takvimdeki noktalar senin görebildiğin tatil, etkinlik ve ödevlerdir
  ([Takvim](../takvim/README.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Ödev verme](odev-verme.md) · [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) ·
[Ödev listesi](liste.md) (kalan etiketleri) · [Süzgeçler](suzgecler.md) (son teslime göre tarih aralığı) ·
[Teslim](teslim.md) · [Ödev hatırlatmaları](hatirlatmalar.md) (son günden önceki bildirim) ·
[Saklama ve silinme](saklama-ve-silinme.md).

**İlgili:** [Takvim: ay görünümü](../takvim/ay-gorunumu.md), [Gün ayrıntısı](../takvim/gun-ayrintisi.md),
[Tatiller ve özel günler](../takvim/tatiller-ve-ozel-gunler.md), [Quiz: süre ve tek deneme](../quiz/sure-ve-tek-deneme.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/04e-tarih-secici.md](../../public/js/parcalar/04e-tarih-secici.md) — `tarihAlani`
  (gizli kutu + düğme, `data-min`), `saatAlani` (yarım saatlik liste), `tsSonrakiYarim`, takvim (`tsCiz`, `tsAjanda`,
  `GET /api/takvim?yil=&ay=`). Pencereler [11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md)
  (`odevYeniModal`: başlama bugün + sonraki yarım saat, son saat 12:00; `odev-duzelt`: 08:00 / 12:00).
  Etiketler [02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) — `tarihGunSaat`, `teslimGecti`, `gunFarki`, `kalanEtiketi`.
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `ODEV_VARSAYILAN_SAAT` ('12:00'), `odevSaati`,
  `odevBitisAni`, `odevBaslamaAni`, `odevGecikti`; tarih kuralları `POST /api/assignments` ve `…/update`'te.
  Bu yardımcıları kullananlar: [ilerleyis.md](../../sunucu/bolumler/ilerleyis.md), [okul.md](../../sunucu/bolumler/okul.md),
  [takvim.md](../../sunucu/bolumler/takvim.md), [odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) (`teslimKapali`),
  [quiz.md](../../sunucu/bolumler/quiz.md).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `baslangic`, `baslangic_saati`, `bitis`,
  `bitis_saati` sütunları; `tarihVeyaNull` (bozuk gün süresiz sayılır).
- Testler: [testler/test-odev-saat.md](../../testler/test-odev-saat.md) (varsayılan 12:00, bozuk saat, saate göre gecikme,
  başlama saati, takvimde saat).

## Sık sorulanlar

- **Saati neden 12:00 öneriyor?** Kullanıcının isteği: çoğu öğretmen saati değiştirmez, ödevi derste kontrol eder.
- **Son tarihi boş bırakırsam?** Bugün ödev süresiz verilir (hiç "Süresi doldu" olmaz). Tasarımda boş bırakılamaz.
- **Ödevi yarın sabah başlatmak istiyorum.** Başlama gününü yarın, saati 08:00 yap; öğrenci ödevi şimdiden görür, quiz yarın
  08:00'de açılır. Teslim dosyası yüklemesi bugün kapalıdır ama yarın gün başında (08:00'i beklemeden) açılır.
- **Takvimdeki noktalar ne?** O güne düşen tatil, okul etkinliği ve son günü o gün olan öteki ödevler; aynı güne iki ödev
  yığılmasın diye.

## Sırada

- Ödev listesi düzeni: kalan süre etiketleri takvim gününe göre ("Yarın 15:00'e kadar") yazılacak.
- Tasarımdaki zorunluluk: başlama ve son tarih boş bırakılamayacak.
- Çok dil: ay ve gün adları çeviri kataloğuna girecek.
