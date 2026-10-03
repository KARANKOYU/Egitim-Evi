# Devamsızlık ve yoklama · Yoklama alınmadı uyarısı

**Durum:** Tasarlandı — henüz kodda yok.

Saati geçmiş ama yoklaması alınmamış dersi öğretmene ve müdüre hatırlatan işaretler: ders programında parlayan hücre ve ünlem, ana
sayfa kutucuğundaki sayı, "Yoklama alınmadı" bildirimi ve müdürün "Bugün dikkat" satırı.

## Ne işe yarar

Yoklaması alınmayan derste bütün öğrenciler "Geldi" sayılır (yalnız devamsızlık saklanır); öğretmen unutursa gelmeyen öğrencinin velisi
haber alamaz, günün durumu da yanlış çıkar ([Günün durumu](gun-durumu.md)).

Kullanıcının 3 Ekim 19:20 kararı: **saati GEÇMİŞ ve yoklaması ALINMAMIŞ ders, ders programında PARLAR** (dikkat çeken vurgu) ve hücrede
**ünlem (!)** olur ("Yoklama alınmadı"); **yoklama kaydedilince kalkar**; çakışma ünleminden ayrı görünür. Aynı kararla ana sayfadaki
"Yoklama" kutucuğu **alınmamış ders sayısını** gösterir. Tasarım 1 önizlemesi bunları uygular; öğretmene ve müdüre giden bildirimler
ile müdürün "Bugün dikkat" kutusu önizlemenin önceki hâlinden gelir (ayrı tanımı yok).

Bugünkü sitede yoklamanın alınıp alınmadığı hiçbir yerde görünmez: kaydı olmayan ders ile herkesin geldiği ders aynıdır.

## Nereden açılır

Tasarımda (Tasarım 1 önizlemesi):

- **Öğretmen:**
  - **"Ders programım"**: saati geçmiş, yoklaması alınmamış dersin hücresi kırmızı kenarlı ve açık kırmızı zeminli, yavaşça atan bir
    ışıkla parlar; sağ üstünde turuncu, köşeli **"!"**; altında **"yoklama alınmadı"**; üzerine gelince **"Yoklama alınmadı"**. Tablonun
    üstünde kırmızı kutu: **"!"** **"1 dersin yoklaması alınmadı"** / **"Saati geçti; derse bas, yoklamasını al."**
  - Ana sayfa kutucuğu: **"Yoklama"** — **"2 dersin yoklaması alınmadı"**, kırmızı rozette sayı; hepsi alınınca **"bu hafta hepsi
    alındı"**.
  - Ana sayfanın **"Bugünkü derslerin"** kutusu: süren ya da biten derste **"Yoklama al"**, alınmışta **"Alındı"**.
  - Bildirim zili: **"Yoklama alınmadı"** / **"7-A · 3. ders (10:10–10:50)"** (önizlemede saat 10:34'te "14 dk" önce gelmiş, yani
    ders başladıktan 10 dakika sonra; bu yalnız örnek veridir, kural olarak kararlaştırılmadı).
- **Müdür:**
  - Bildirim zili: **"3 sınıfta yoklama alınmadı"** / **"2. ders · 6-B, 7-C, 8-A"** — basınca **"Devamsızlık"** sayfası.
  - Ana sayfanın **"Bugün dikkat"** kutusu: **"3 sınıfta yoklama alınmadı"**, **"2. ders · 6-B, 7-C, 8-A"**, düğme **"Bak"**; yanında
    bugünün özeti **"14 öğrenci gelmedi"**, **"9 izinli · 5 izinsiz"**, düğme **"Liste"**.

## Adım adım

### Öğretmen (tasarımda)

1. Bir dersin saati geçti ve yoklamasını almadın: ders programında o hücre parlar ve **"!"** taşır; ana sayfa kutucuğu **"N dersin
   yoklaması alınmadı"** der; zilde **"Yoklama alınmadı"** bildirimi durur.
2. Kutucuğa ya da bildirime bas: **"Ders programım"** açılır, üstünde o anki dersin (süren ders yoksa bugünün son biten dersinin)
   **"Yoklama"** penceresi gelir. Başka bir dersse penceredeki **"Önceki ders"** / **"Sonraki ders"** ile geç ya da pencereyi kapatıp
   parlayan hücreye bas ([Ders programından yoklama](programdan-yoklama.md)). "Bugünkü derslerin"deki satıra (**"Yoklama al"**) basarsan
   o dersin penceresi ana sayfanın üstünde açılır.
3. Herkesi işaretle, **"Kaydet"**. Kayıttan sonra:
   - hücre **"yoklama alındı"** olur, parlama ve **"!"** kalkar; tablonun üstündeki kutu azalır ya da kaybolur;
   - kutucuk kalan ders sayısını yazar ya da **"bu hafta hepsi alındı"** olur, rozet azalır;
   - "Bugünkü derslerin"de satır **"Alındı"** olur; o dersin **"Yoklama alınmadı"** bildirimi zilden kalkar.

### Müdür (tasarımda)

1. Zilde ve ana sayfanın "Bugün dikkat" kutusunda yoklaması alınmamış sınıfları ders saatiyle görürsün (**"2. ders · 6-B, 7-C, 8-A"**).
2. **"Bak"** ya da bildirim **"Devamsızlık"** sayfasını açar ([Okulun devamsızlığı](okulun-devamsizligi.md)). Müdür yoklamayı kendisi
   almaz (tasarımda "Kendi derslerim" yok); dersin öğretmenine haber verir ya da [Mesajlar](../mesaj/README.md)dan yazar.

### Öğrenci ve veli

Bu uyarıyı görmezler.

## Kurallar ve sınırlar

- **"Alınmadı" ne demek (önizleme):** dersin başlangıç saati gelmiş ve o dersin o günkü yoklaması kaydedilmemiş. Gelecek ders sayılmaz.
  - Ders programındaki parlama, "!" ve üstteki kutu yalnız **saati bitmiş** dersleri sayar (bu haftanın önceki günleri ve bugünün biten
    dersleri). Süren ders "şimdi · yoklama al" yazar, parlamaz.
  - Ana sayfa kutucuğu **bu haftanın** süren ve bitmiş alınmamış derslerini birlikte sayar (önizlemede kutu "1", kutucuk "2").
  - Çakışan saatte iki sınıfın yoklaması da alınmadan hücre "alındı" sayılmaz.
- **Kalkma:** yoklama kaydedilince o dersin bütün işaretleri ve öğretmenin bildirimi kalkar.
- **Kayıt anlamı:** uyarı için "yoklamanın alındığı" bilgisi gerekir; bugün yalnız devamsızlıklar saklandığı için "herkes geldi" diye
  kaydedilmiş yoklama ile hiç alınmamış yoklama ayırt edilemez. Uyarının kodlanması, her dersin her günü için yoklamanın alındığını
  (ders + gün + saat) ayrıca tutmayı gerektirir.
- **Kararlaştırılmayanlar:**
  - öğretmene bildirimin ne zaman gideceği (ders başladıktan kaç dakika sonra, ders bitince mi) ve telefon bildirimi olarak da gidip
    gitmeyeceği;
  - müdürün bildiriminin nasıl toplanacağı (önizlemede ders saati başına bir satır: "2. ders · 6-B, 7-C, 8-A") ve kimlere gideceği
    (müdür yardımcısı, "Devamsızlığı görür" yetkililer);
  - önceki haftaların alınmamış derslerinin sayılıp sayılmayacağı (önizleme yalnız bu haftayı gösterir);
  - öğretmen derse gelmediyse (izin, rapor) ya da ders yapılmadıysa (tatil, gezi) uyarının ne olacağı;
  - okulun bu uyarıyı kapatıp kapatamayacağı.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Ders programından yoklama](programdan-yoklama.md) ·
[Ders yoklaması](ders-yoklamasi.md) · [Okulun devamsızlığı](okulun-devamsizligi.md) · ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) ·
[Günün durumu](gun-durumu.md).

**İlgili:** [Ders programım](../ders-programi/programim.md) · [Çakışma uyarısı](../ders-programi/cakisma-uyarisi.md) (öbür ünlem) ·
[Bildirim metinleri](../bildirim/bildirim-metinleri.md) · [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md) ·
[Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md) · [Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md) ·
[Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md) · [Kutucuklar](../ana-sayfa/kutucuklar.md).

## Kod tarafı

- Bugün kodda yok. Bugün yoklama kaydı yalnız devamsızlıkları tutar ([sunucu/veri/depo/devamsizlik.md](../../sunucu/veri/depo/devamsizlik.md));
  öğretmenin ana sayfa kutucuğu sabit **"Yoklama — Derse katılım al"** der ([public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md));
  ders programında yalnız çakışma uyarısı var ([public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md):
  "Programında çakışma var — aynı saatte birden fazla sınıf görünüyor. Müdürüne bildir."); zamanlı bildirimler
  [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md)'dadır (sabah ders özeti gibi).
- Tasarım: Tasarım 1 önizlemesinin 3 Ekim akşamı geri bildirim modülü (parlayan hücre ve turuncu "!", tablonun üstündeki kutu, kutucukta
  "N dersin yoklaması alınmadı"), öğretmen modülü ("Bugünkü derslerin", "Yoklama alınmadı" bildiriminin kayıtla kalkması) ve müdür ana
  sayfası ("Bugün dikkat", "3 sınıfta yoklama alınmadı").

## Sık sorulanlar

- **Yoklamayı aldım ama hücre hâlâ parlıyor.** Tasarımda kayıt parlamayı kaldırır; kaldırmıyorsa kaydın gerçekten gittiğini ("Yoklama
  kaydedildi" penceresi) kontrol et. Çakışan saatte iki sınıfın yoklamasını da almalısın.
- **Kırmızı yuvarlak ünlemle turuncu köşeli ünlem farklı mı?** Evet: kırmızı yuvarlak çakışma (aynı saate iki sınıf), turuncu köşeli
  "yoklama alınmadı".
- **Bu uyarı bugün sitede var mı?** Hayır; tasarım.

## Sırada

- **Yoklamaya ders programından girilir** (kullanıcı 3 Ekim 19:20; kod Linux'ta) — parlayan hücre, ünlem, kutucuktaki sayı.
- **Öğretmen ve müdür ekranlarının tasarımı** (Tasarım 1): "Bugünkü derslerin", "Bugün dikkat", bildirimler.
- Kodlanmadan önce yukarıdaki kararlaştırılmayan noktaların kullanıcıya sorulması ve yoklamanın "alındı" bilgisinin saklanması.
- **Android yerel uygulama:** öğretmenin ana sayfasında "Şu an — yoklama al".
