# Ders programı · Çakışma uyarısı

**Durum:** Kodda var; tasarımda ek olarak çakışan yere ders konamaz ("Konamadı: …"), öğretmenin programında çakışan hücrede "!" ünlemi ve üstte "N çakışma var" düğmesi, Excel'den yüklemede çakışan satır alınmaz.

Aynı öğretmenin ya da aynı sınıfın aynı gün kesişen iki dersini bulup programı kurana ve öğretmene gösteren uyarı.

## Ne işe yarar

Bir öğretmen aynı anda iki sınıfta olamaz, bir sınıf aynı anda iki ders göremez. Program serbest saatlerle kurulduğu için bu kolayca
olur: 7-A'ya 09:00–09:40 Matematik, 7-B'ye 09:20–10:00 Matematik yazıldıysa ve ikisinin öğretmeni aynıysa bu bir **çakışmadır**.
Kullanıcı başta istedi (28 Ağustos): öğretmenin programında bir çakışma varsa ünlem olsun.

Çakışma sayılan iki durum:

- **Öğretmen çakışması:** aynı öğretmenin iki dersi (hangi sınıfta olursa olsun) aynı gün kesişen saatlerde.
- **Sınıf çakışması:** aynı sınıfın iki dersi aynı gün kesişen saatlerde (aynı dersin aynı saate iki kez yazılması da).

**Kesişme:** biri öbürü bitmeden başlıyorsa. Bitişik saatler çakışma değildir: 10:00'da biten dersle 10:00'da başlayan ders çakışmaz.

## Nereden açılır

- **Ders Programı** sayfası (müdür ve programı düzenleyen kişi): kaydedince çıkan uyarı ve sayfanın üstündeki çakışma listesi
  ([Ders programı kurma](program-kurma.md)).
- **Ders Programım** (öğretmen): kendi derslerindeki çakışma ([Ders programım](programim.md)).
- **Excel Aktarım** → ders programı yükleme önizlemesi ([Programı Excel'den kurma](excelden-program.md)).

## Adım adım

### Müdür

**Kaydederken:**

1. "Ders ekle" ya da "Ders saatini düzenle" penceresinde **"Kaydet"**e bastın; yeni saat başka bir dersle kesişiyor.
2. Sunucu dersi **yine kaydeder** ve neyle çakıştığını söyler; pencere kapanır, sayfanın üstünde **bir kez** kırmızı uyarı çıkar:
   - öğretmen çakışmasında: **"Bu öğretmen aynı saatte 7-B sınıfında Matematik dersinde de görünüyor (09:20-10:00)."**
   - sınıf çakışmasında: **"Bu sınıfın aynı saatte başka dersi var: Müzik (09:00-09:40)."**
   Birden çok ders kesişiyorsa yalnız biri (saat sırasıyla ilk bulunan) yazılır; bütünü aşağıdaki listededir.
3. Sayfayı yeniden açınca ya da başka bir şey yapınca bu uyarı kaybolur; çakışma ise aşağıdaki listede durur.

**Okulun çakışma listesi:**

1. Okulda en az bir çakışma varsa Ders Programı sayfasının üstünde kırmızı kutu: uyarı simgesiyle **"N çakışma var"**.
2. Altında her çakışma bir satır:
   - **"Öğretmen Ayşe Kaya — Pazartesi: 7-A Matematik (09:00-09:40) ↔ 7-B Matematik (09:20-10:00)"**
   - **"Sınıf 7-A — Salı: 7-A Matematik (10:10-10:50) ↔ 7-A Müzik (10:30-11:10)"**
   Sıra: güne göre, sonra saate göre. Üç ders birbirini kesiyorsa her ikili ayrı satırdır.
3. İlk beşi görünür; fazlası için **"3 tanesini daha göster"**, açınca **"Daha azını göster"**.
4. Liste **bütün okulun** çakışmalarıdır; hangi sınıfı seçersen seç aynı liste görünür.

**Programda:**

- Çakışan ders kartı kırmızıdır ve altında **"Aynı saatte başka bir derse de yazılmış"** yazar; Hafta görünümünde hücre kırmızı. Bu
  işaret yalnız ekrandaki sınıfın derslerine düşer.

**Çözmek:** kırmızı kartta **"Düzenle"** ile saati ya da günü değiştir veya **"Sil"**; ya da Sınıflar → "Dersler" penceresinde
derslerden birinin öğretmenini değiştir. Liste her işlemden sonra kendiliğinden tazelenir; çakışma kalmayınca kutu kaybolur.

### Çalışan

Programı kuran çalışan (ya da ek rollü öğretmen) uyarıyı ve listeyi müdür gibi görür. Yetkisi yalnız bazı sınıflarla daraltılmış olsa da
liste bütün okulun çakışmalarını gösterir (başka sınıfların adları, dersleri ve öğretmen adlarıyla); ama yalnız kendi sınıflarındaki
dersleri düzenleyebilir.

### Öğretmen

1. **"Ders Programım"**da kendi derslerin aynı gün kesişiyorsa sayfanın üstünde kırmızı kutu:
   **"Programında çakışma var — aynı saatte birden fazla sınıf görünüyor. Müdürüne bildir."**
2. Çakışan derslerin kartı kırmızı ve "Aynı saatte başka bir derse de yazılmış".
3. Programı öğretmen düzeltemez; müdüre ya da programı kurana mesajla bildir
   ([Yeni mesaj](../mesaj/yeni-mesaj.md)).

Öğretmenin ekranında yalnız kendi derslerinin birbiriyle çakışması görünür; girdiği sınıfın başka bir dersle çakışması burada sayılmaz.

### Öğrenci ve veli

Uyarı görmezler. Sınıfın aynı saatte iki dersi varsa ikisi programda aynı "Ders N" başlığıyla yan yana (Hafta görünümünde aynı hücrede
alt alta) durur.

### Tasarımda (Tasarım 1 önizlemesi)

**Müdür ve programı kuran kişi — çakışma engellenir:**

- Dersler listesinden seçilen dersi boş bir saate koyarken çakışma varsa ders konmaz, hücre kısa bir süre kırmızı yanıp söner ve ileti:
  - **"Konamadı: Bu saatte 7-A'da Türkçe var (Pazartesi 08:30–09:10)."** (sınıf)
  - **"Konamadı: Ayşe Kaya bu saatte 7-B'de ders veriyor (Pazartesi 08:30–09:10)."** (öğretmen)
- Ders penceresinde ("Ekle" / "Kaydet") aynı iletiler ("Konamadı:" olmadan) pencerenin altında kırmızı çıkar, kayıt yapılmaz.
- Sürükleyerek taşırken: **"Taşınamadı: …"**; ders eski yerinde kalır.
- Bu yüzden önizlemedeki program sayfasında çakışma listesi yok.
- Öğretmen çakışmasına yalnız dersin öğretmeni seçiliyse bakılır ("Atanmadı" ise yalnız sınıf).

**Öğretmen — ünlem:**

- Sayfanın üstünde kırmızı düğme: **"1 çakışma var"** ve yanında "Salı 2. ders (09:20–10:00) · 8-B ile 7-C aynı saatte"; basınca o ders
  açılır.
- Haftalık tablonun hücresinde iki sınıf "8-B · 7-C" ve kırmızı **"!"** ünlemi; üstüne gelince "8-B ile 7-C çakışıyor".
- Hücreye basınca açılan pencerede (gelecekteki ders): **"8-B ile 7-C aynı saate düşmüş. Ders programını müdür düzenler."**
- Sayfanın alt başlığı: "Bu hafta 20 ders saati · 1 çakışma".

**Excel'den yükleme:** dosyadaki satırlar birbirine göre denetlenir; çakışan satır kırmızıdır ve alınmaz:
**"Çakışma: 3. satırla aynı saatte"** (aynı sınıf), **"Öğretmen çakışması: Ayşe Kaya, 3. satırda 7-B'de"**.

Not: kullanıcının sözü "ünlem olsun" (uyarı) idi; önizlemede müdür ekranında çakışma **engel** olarak yapıldı. Kodlanırken hangisinin
geçerli olacağı netleşmeli (bugünkü site uyarır ve kaydeder).

## Kurallar ve sınırlar

- **Engellemez (bugünkü site):** çakışan ders kaydedilir; uyarı yalnız kaydettikten sonra bir kez görünür.
- **Öğretmen çakışması** yalnız iki dersin öğretmeni aynıysa ve boş değilse sayılır; öğretmeni atanmamış derslerde yalnız sınıf
  çakışmasına bakılır.
- **Öğretmen atarken uyarı yok:** Sınıflar → "Dersler" penceresinde bir derse öğretmen atadığında, o öğretmenin başka bir dersiyle
  çakışma doğsa da pencere bir şey söylemez; çakışma Ders Programı sayfasının listesinde ve öğretmenin programında görünür.
- **Kilit yok:** iki kişi aynı anda kesişen saat eklerse ikisi de yazılır; sonra listede görünür.
- **Excel önizlemesi** (bugünkü site) satırları yalnız **kayıtlı** programla karşılaştırır ("Dikkat" durumu, yine eklenir); aynı
  dosyadaki iki satırın birbiriyle çakışması önizlemede görünmez, yükledikten sonra listeye düşer.
- **Silinmiş öğretmen:** listede adının yerine "(silinmiş öğretmen)".
- **Bildirim yok:** çakışma için kimseye bildirim gitmez; öğretmen programını açınca görür.
- **Kim görür:** liste ve uyarı yalnız programı kurabilenlerde (müdür, "Ders programını düzenler" yetkilisi); öğretmenin kutusu yalnız
  kendi programında. Öğrenci ve veli görmez.

KILAVUZ'la ayrılıklar (rapor edildi): KILAVUZ'daki liste örneği "Ayşe Kaya — Pazartesi 1. ders: 7-A Matematik ↔ 8-C Türkçe" ekrandaki
biçimle uyuşmuyor (ekranda "Öğretmen" öneki ve saatler var, "1. ders" yok); KILAVUZ yalnız öğretmen çakışmasını anlatıyor, sınıf
çakışmasını anmıyor; çakışan ders satırının kırmızı ve bir emojiyle işaretli olduğunu söylüyor, oysa ekranda emoji yok: dersin
kartında simge yerine "Aynı saatte başka bir derse de yazılmış" yazısı var; sitenin kendi uyarı simgesi (emoji değil) yalnız "N çakışma
var" kutusunun başında ve kaydettikten sonraki uyarıda durur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Ders programı kurma](program-kurma.md) — uyarının çıktığı pencere ve düzeltme.
- [Ders programım](programim.md) — öğretmenin uyarısı.
- [Programı Excel'den kurma](excelden-program.md) — önizlemedeki "Dikkat" satırları.
- [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md) — kırmızı kart ve hücre.
- [Okulun ders saatleri](ders-saatleri.md), [Programı Excel olarak indirme](programi-indirme.md),
  [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md).

**İlgili:**

- [Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md) — öğretmen değiştirerek çakışmayı çözmek.
- [Etüt: boş zaman ızgarası](../etut/bos-zaman-izgarasi.md) — etüt planlarken öğretmenin ve öğrencinin dolu saatleri.
- [Yeni mesaj](../mesaj/yeni-mesaj.md) — öğretmenin müdüre bildirmesi.

## Kod tarafı

- Sunucu: [sunucu/iliskiler.md](../../sunucu/iliskiler.md) — `aralikCakismasi` (kaydetmeden önce saat sırasıyla ilk kesişen;
  her derste önce sınıf, sonra öğretmen denetlenir), `cakismalariBul` (okulun bütün ikilileri; `tur`, `ad`, `dayName`, `saat`, `lessons`), `araliklarKesisiyor` (bitişik
  saat çakışmaz).
- Depo: [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) — `cakismalar` (tek SQL sorgusu: aynı gün, kesişen,
  aynı öğretmen ya da aynı sınıf), `aralikKesisenler`.
- Uçlar: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `schedule-add` / `schedule-update` cevabındaki `uyari` ve
  `cakismalar`; `GET /api/school/schedule` her çağrıda okulun bütün çakışmalarını döner; `GET /api/school/cakismalar` (ön yüz kullanmıyor);
  Excel önizlemesinde `uyariMetni`. Öğretmenin kendi çakışması: [sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md)
  (`GET /api/teacher/schedule`, hücredeki `cakisma`).
- Ön yüz: [public/js/parcalar/21-ders-programi.md](../../public/js/parcalar/21-ders-programi.md) — çakışma kutusu (ilk 5, `cakisma-ac`),
  `cakisanKimlikler`, `dersSutunu` (kırmızı kart); [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) —
  `saat-kaydet`'teki uyarı metinleri; [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) — öğretmenin kutusu.
- Testler: [testler/test-program.md](../../testler/test-program.md) (aynı öğretmenle kesişen saat `uyari` verir ve listeye düşer;
  bitişik aralık çakışma sayılmaz; sınıf silinince çakışma temizlenir).

## Sık sorulanlar

- **Uyarı çıktı ama ders kaydedildi mi?** Evet; bugün uyarı engellemez. İstemiyorsan "Düzenle" ya da "Sil".
- **10:00'da biten ve 10:00'da başlayan dersler çakışma mı?** Hayır.
- **Listede başka sınıfların çakışmaları da var.** Liste bütün okulundur; sınıf seçimi yalnız aşağıdaki programı değiştirir.
- **Öğretmen "Programında çakışma var" diyor, ben görmüyorum.** Ders Programı sayfasının üstündeki "N çakışma var" kutusuna bak;
  ilk beşte değilse "… tanesini daha göster".
- **Öğretmen ataması yaptım, çakışma çıktı ama uyarı gelmedi.** Öğretmen atamada uyarı yok; listeden takip et.

## Sırada

- Tasarım 1: müdür ekranında çakışan yere ders konamaması, öğretmenin tablosunda "!" ünlemi, Excel yüklemesinde çakışan satırın
  alınmaması (uyarı mı engel mi — netleşecek).
- Etüt planlama: canlı boş zaman ızgarası çakışmayı ders programından okuyacak (öneri).
- Tam debug: daraltılmış rolde bütün okulun çakışma listesinin görünmesi.
