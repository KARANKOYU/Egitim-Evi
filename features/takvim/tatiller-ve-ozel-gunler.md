# Takvim ve ajanda · Tatiller ve özel günler

**Durum:** Kodda var; tasarımda ek olarak 12 Mart İstiklal Marşı'nın Kabulü ve 28 Ekim "öğleden sonra yarım gün" arifesi özel gün olur, okulun eğitim yılı günleri (ders yılının başı ve sonu, dönem sonu ve karne günleri, yarıyıl tatili) takvime kendiliğinden düşer, güne basınca açılan pencerede "Resmî tatil · okul kapalı" ya da "Özel gün · okul açık" yazar ve ajandada kalan gün sayılır (Tasarım 1 önizlemesi).

Resmî tatillerin, dinî bayramların ve anma günlerinin takvime kendiliğinden yazılması; okulun kendi tatil günleri de aynı biçimde görünür.

## Ne işe yarar

Kimse 23 Nisan'ı, 29 Ekim'i ya da bayramları takvime elle yazmaz: sistem bilir. Kullanıcı 29 Ağustos'ta takvimde "23 Nisan, 15 Temmuz
gibi kullanışlı" günlerin olmasını istedi. Tatil günü takvimde ayrı renkte durur ve adı yazar; öğretmen ödevin son gününü seçerken tatile
denk getirmez ([Ödevin tarih ve saati](../odev/tarih-ve-saat.md)).

## Nereden açılır

- **Takvim** → ay görünümündeki gün kutusu (tatil rengi ve adı) → güne basınca gün ayrıntısındaki **"Tatil"** ya da **"Özel gün"**
  satırı ([Ay görünümü](ay-gorunumu.md), [Gün ayrıntısı](gun-ayrintisi.md)).
- Öğretmenin ödev verirken açtığı tarih seçicisinde tatil günleri marka renginde ve kalın görünür.
- Tasarımda ayrıca **Ajanda** sekmesinde ("Özel gün" kutucuğuyla süzülür) ve servisçinin ana sayfasındaki **"Takvim"** kutucuğunda
  ("29 Ekim tatil").

## Adım adım

### Bütün roller (bugünkü site)

1. Takvim'i aç. Aşağıdaki günler kendiliğinden yazılıdır; her yıl aynı tarihte:

   | Tarih | Ad (takvimde yazdığı gibi) | Tür |
   |---|---|---|
   | 1 Ocak | Yılbaşı | Tatil |
   | 18 Mart | Çanakkale Zaferi | Özel gün |
   | 23 Nisan | Ulusal Egemenlik ve Çocuk Bayramı | Tatil |
   | 1 Mayıs | Emek ve Dayanışma Günü | Tatil |
   | 19 Mayıs | Atatürk'ü Anma, Gençlik ve Spor Bayramı | Tatil |
   | 15 Temmuz | Demokrasi ve Millî Birlik Günü | Tatil |
   | 30 Ağustos | Zafer Bayramı | Tatil |
   | 29 Ekim | Cumhuriyet Bayramı | Tatil |
   | 10 Kasım | Atatürk'ü Anma Günü | Özel gün |
   | 24 Kasım | Öğretmenler Günü | Özel gün |

2. **Dinî bayramlar** her yıl kaydığı için hesaplanmaz, koddaki tablodan okunur. Bugün tabloda **yalnız 2026** var:
   - **Ramazan Bayramı:** 19–22 Mart 2026; ilk gün **"Ramazan Bayramı (arife)"**, sonraki günler "Ramazan Bayramı".
   - **Kurban Bayramı:** 26–30 Mayıs 2026; ilk gün **"Kurban Bayramı (arife)"**.
   Arife günü de tatil sayılır (yarım gün ayrıca ayrılmaz).
3. **Tatil** olan gün: kutu ana rengin açık tonunda, içinde ana renk nokta ve tatilin adı. **Özel gün** (okul açık): mavi nokta ve adı.
4. Güne basınca gün ayrıntısında **"Tatil"** ya da **"Özel gün"** etiketli satır ve adı. Bu satırlarda "Kaldır" yoktur.
5. **Okulun kendi tatili** (ör. kar tatili, ara tatil): takvim yetkilisi "Takvime ekle"de türü **"Tatil"** seçerek ekler; resmî tatil
   gibi görünür (kutu rengi, adı, "Tatil" satırı) ve "Kaldır"la kaldırılabilir ([Takvime ekle](etkinlik-ekleme.md)).
6. Telefonda (720 piksel altı) tatilin adı kutuda gizlenir, renk ve nokta kalır.

### Tasarımda (Tasarım 1 önizlemesi)

1. Türler **"Resmî tatil"** (okul kapalı, ana renk) ve **"Özel gün"** (okul açık, turuncu) diye adlandırılır. Liste:

   | Tarih | Ad | Tür |
   |---|---|---|
   | 1 Ocak | Yılbaşı | Resmî tatil |
   | 12 Mart | İstiklal Marşı'nın Kabulü | Özel gün |
   | 18 Mart | Çanakkale Zaferi ve Şehitleri Anma Günü | Özel gün |
   | 23 Nisan | Ulusal Egemenlik ve Çocuk Bayramı | Resmî tatil |
   | 1 Mayıs | Emek ve Dayanışma Günü | Resmî tatil |
   | 19 Mayıs | Atatürk'ü Anma, Gençlik ve Spor Bayramı | Resmî tatil |
   | 15 Temmuz | Demokrasi ve Millî Birlik Günü | Resmî tatil |
   | 30 Ağustos | Zafer Bayramı | Resmî tatil |
   | 28 Ekim | Cumhuriyet Bayramı arifesi · öğleden sonra yarım gün | Özel gün |
   | 29 Ekim | Cumhuriyet Bayramı | Resmî tatil |
   | 10 Kasım | Atatürk'ü Anma Günü | Özel gün |
   | 24 Kasım | Öğretmenler Günü | Özel gün |

2. **Okulun eğitim yılı günleri** müdürün Eğitim yılı sayfasındaki tarihlerden gelir ([Yeni eğitim yılı açma](../egitim-yili/yil-acma.md)).
   Önizlemedeki 2026–2027 örneği (alt satırında okulun adı, ör. "Test Ortaokulu"):
   - **"2026–2027 ders yılı başladı"** (14 Eylül) — Özel gün;
   - **"1. dönem sona eriyor · karne günü"** (22 Ocak) — Özel gün;
   - **"Yarıyıl tatili"** (25 Ocak – 5 Şubat arasındaki hafta içi günler) — Resmî tatil, altında **"25 Ocak – 5 Şubat · okul kapalı"**;
   - **"2. dönem başlıyor"** (8 Şubat) — Özel gün;
   - **"Ders yılı sona eriyor · karne günü"** (18 Haziran) — Özel gün.
3. Ay görünümünde tatil gününün numarası ana renkte; kutuda adı renkli şerit olarak (bütün gün süren kayıtlar günün başında).
4. Gün listesinde satır: **"Resmî tatil · okul kapalı"** ya da **"Özel gün"** (okulun yıl günlerinde "Özel gün · Test Ortaokulu").
5. Satıra bas → pencere: başlıkta günün adı; **"Tarih:"** ("29 Ekim 2026 Perşembe"), **"Tür:"** (**"Resmî tatil · okul kapalı"** ya da
   **"Özel gün · okul açık"**), varsa **"Ayrıntı:"** (ör. "25 Ocak – 5 Şubat · okul kapalı"), **"Kalan:"** ("28 gün kaldı"); **"Kapat"**
   ([Takvimdeki kayda basınca](kayit-pencereleri.md)).
6. Ajandada tatil ve özel günler **"Özel gün"** kutucuğuyla süzülür; bütün gün süren kayıt olduğu için kalan süre gün olarak yazar
   ("bugün", "yarın", "5 gün kaldı"). Çok günlük **yarıyıl tatili ajandada tek satırdır** (sıradaki günü; geçen günleri "Geçmiş"te),
   takvimde her gün ayrı
   ([Ajanda](ajanda.md), [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md)).
7. Önizlemenin listesinde **dinî bayramlar yok** (Ekim örneğinde düşmüyor); bugünkü sitedeki dinî bayram tablosu korunmalı ve her yıl
   için doldurulmalı (öneri).

### Servisçi

- **Tasarımda:** ana sayfasındaki "Takvim" kutucuğunda yaklaşan tatil yazar ("29 Ekim tatil"); takvimin alt yazısı "Okulun tatilleri ve
  servis değişiklikleri" ([Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md)).

## Kurallar ve sınırlar

- **Resmî tatil listesi kodda sabittir:** okul değiştiremez, kaldıramaz; yeni bir gün eklemek kod değişikliği ister.
- **Dinî bayram tablosu her yıl elle doldurulur:** kodda yalnız 2026 var. **2027'den itibaren Ramazan ve Kurban bayramları takvimde
  görünmez** (bilinen açık iş; canlıdan sonraki ilk yıl geçişinden önce eklenmeli).
- **Arife yarım günü ayrılmaz** (bugünkü site): arife bütün gün tatil sayılır. Tasarımda 28 Ekim arifesi "öğleden sonra yarım gün"
  diye özel gün olarak yazar.
- **Bir günde tatil olup olmadığı** o gün "Tatil" türünde herhangi bir kayıt (resmî ya da okulun) olup olmamasıyla belirlenir.
- **Ders sayısı tatilde de yazar:** ay görünümündeki "6 ders" haftalık programdan sayılır, tatili bilmez.
- **Tatil, yoklamayı ya da ödevi kendiliğinden değiştirmez:** tatil gününe son günü düşen ödev yine o gündür; öğretmen tarih seçerken
  tatili görür.
- Tatiller okulun kapatabileceği bir bölüm değildir; her okulda görünür.

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Ay görünümü](ay-gorunumu.md) · [Gün ayrıntısı](gun-ayrintisi.md) ·
[Takvim kimin gözünden](kimin-takvimi.md) · [Takvime ekle](etkinlik-ekleme.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) ·
[Ajanda](ajanda.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) · [Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Ödevin tarih ve saati](../odev/tarih-ve-saat.md) · [Yeni eğitim yılı açma](../egitim-yili/yil-acma.md) ·
[Ders programım](../ders-programi/programim.md) · [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md) ·
[Renkli kutucuklar](../ana-sayfa/kutucuklar.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`SABIT_GUNLER`, `DINI_BAYRAMLAR` (yalnız 2026), `ozelGunler`:
  arife ve tatil/özel ayrımı; "Dikkat!" bölümünde 2027 notu).
- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (kutuda tatil ve özel günün adı, `.tatil` rengi,
  `OLAY_AD`), [public/js/parcalar/04e-tarih-secici.md](../../public/js/parcalar/04e-tarih-secici.md) (ödev tarih seçicisinde tatil
  günleri).
- Testler: [testler/test-takvim.md](../../testler/test-takvim.md) (Nisan 2026 sabit günleri, 15 Temmuz, Mart 2026 Ramazan Bayramı).
- Tasarımdaki genişletilmiş liste ve okulun yıl günleri Tasarım 1 önizlemesindedir; kodlanınca bu bölüm güncellenir.

## Sık sorulanlar

- **2027'de bayramlar takvimde neden yok?** Dinî bayramlar tablodan okunur ve tabloda bugün yalnız 2026 var. Her yıl eklenmesi gerekir.
- **Okulumuz kar yüzünden tatil; takvime nasıl yazılır?** Takvim yetkilisi "Etkinlik ekle"de türü "Tatil" seçerek ekler. Herkesin
  takviminde tatil renginde görünür; ayrıca duyuru göndermek iyi olur.
- **Arife yarım gün değil mi?** Bugünkü takvim arifeyi bütün gün tatil gösterir. Tasarımda 28 Ekim arifesi "öğleden sonra yarım gün"
  diye yazar.
- **Yarıyıl tatili takvimde yok.** Bugünkü sitede yarıyıl tatili kendiliğinden gelmez; okul "Tatil" türüyle ekleyebilir. Tasarımda Eğitim
  yılı sayfasındaki dönem tarihlerinden gelir.

## Sırada

- Güvenlik denetimi (kod okumasında bulunanlar): dinî bayram tablosuna 2027 ve sonrası.
- Arayüz önizlemesi (Tasarım 1): genişletilmiş özel gün listesi, okulun eğitim yılı günleri, tatil penceresi.
- Yıl geçişi: okul yedeğinde takvim kayıtları. (Eğitim yılının dönem tarihleri Tasarım 1'in Eğitim yılı sayfasında var; tanımlarda
  ayrıca yazılı değil.)
- Çok dil: tatil ve özel gün adlarının çevirisi.
