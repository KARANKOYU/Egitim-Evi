# Devamsızlık ve yoklama · Günün durumu (geç geldi, yarım gün)

**Durum:** Tasarlandı — henüz kodda yok.

Bir öğrencinin bir gününün "Geldi", "Geç geldi", "Yarım gün", "Gelmedi" ya da "İzinli" sayılmasının, o günün ilk ve son dersine bakan
kuralları ve gün sayımı.

## Ne işe yarar

Yoklama ders ders alınır; ama veli ve okul çoğu zaman "çocuk bugün okula geldi mi, kaç gün devamsızlığı var?" diye sorar. Kullanıcının
2 Ekim kuralı:

- "gün olarak, yani **ilk ders son ders** bakılır";
- "**ilk derse geç kalmak o güne geç kalmaktır**";
- "**son dersten önce gitmek** ve bir daha gelmemek **yarım gün**";
- "**birinci dersten sonra gelmek** de yarım gün";
- "ama **4. derse gelip 5'e gelmeyip son derse gelirsen tam gün** gene";
- "ama son ders yoksa günün geri kalanı olduğu için yarım gün görünür";
- "filtrelerde de yarım gün vb. olacak".

Tanım (spec) bu sözleri kurallara çevirdi; sayımda yarım gün 0,5 gündür, özürlü/özürsüz ayrımı korunur. Kurallar
[Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md) ekranının "Gün gün" görünümünde, Excel raporunda ve
[Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md)nın gün sayımında kullanılır.

## Nereden açılır

Ayrı bir sayfası yok; "Gün gün" görünümünün **"Günün durumu"** sütununda ve **"Ayrıntı"** sütununda görünür (öğrencinin
"Devamsızlığım"ı, velinin "Devamsızlık"ı, müdürün "Devamsızlık"ı, sınıf sayfasının "Devamsızlık" sekmesi). Tablonun altında kural notu
durur: **"Günün durumu ilk ve son derse bakılarak hesaplanır: ilk derse geç kalmak güne geç kalmaktır; ilk derse gelmeyip sonra gelmek
ya da son dersten önce gidip dönmemek yarım gündür; ilk ve son derste olup aradaki bir derse gelmemek tam gün sayılır (o ders "Ders
ders"te görünür)."**

## Adım adım

### Kurallar (tanım; Tasarım 1 önizlemesi aynı sırayla uygular)

Bir günün dersleri, öğrencinin sınıfının **o günkü programındaki** dersler ve **okulun ders saatleri**dir; "ilk ders" o günün ilk, "son
ders" son ders saatidir. Ders ders durumlar: **Geldi**, **Geç** (dakikasıyla), **Gelmedi**, **İzinli**. "Geldi" ve "Geç" derste
**var** sayılır.

1. Hiçbir derste **var** değilse: bütün dersler izinliyse **"İzinli"**, değilse **"Gelmedi"** (tam gün).
2. İlk derste ya da son derste **var** değilse: **"Yarım gün"** (ilk derse gelmeyip sonradan geldi; ya da son dersten önce gitti,
   dönmedi; ilk ve son derste yok ama arada var da yarım gündür).
3. İlk ve son derste **var**, ilk derste **"Geç"** ise: **"Geç geldi"**.
4. Öbür durumlarda: **"Geldi"** (tam gün). Aradaki bir derse gelmemek günü bozmaz; o ders yalnız "Ders ders" görünümünde **"Gelmedi"**
   görünür. Sonraki bir derse geç kalmak da günü bozmaz ("Ders ders"te **"Geç"**).

### Örnekler (6 ders saatli bir gün, 1. ders 08:30–09:10 … 6. ders 12:40–13:20)

| Ders ders durumlar | Günün durumu | "Ayrıntı" sütununda (önizleme) |
|---|---|---|
| hepsi Geldi | Geldi | "bütün derslerde var" |
| 1. ders Geç (10 dk), öbürleri Geldi | Geç geldi | "1. derse 10 dakika geç" |
| 1. ders Gelmedi, öbürleri Geldi | Yarım gün | "1. derse gelmedi, 2. dersten itibaren var" |
| 1.–2. ders Gelmedi, 3.–6. Geldi | Yarım gün | "1.–2. derslere gelmedi, 3. dersten itibaren var" |
| 1.–4. Geldi, 5.–6. Gelmedi | Yarım gün | "4. dersten sonra gitti, 5.–6. derslerde yok" |
| 4. ders Gelmedi, öbürleri Geldi | Geldi | "4. derste yok (ilk ve son derste var, gün tam sayılır)" |
| 1. ve 6. ders Gelmedi, 2.–5. Geldi | Yarım gün | müdür ekranında "1., 6. derslerde yok · 2.–5. derslerde var" |
| 1. ders Geç (10 dk), 4. ders Gelmedi, öbürleri Geldi | Geç geldi | müdür ekranında "1. derse 10 dakika geç · 4. derste yok" |
| 1. ders Geç, 6. ders Gelmedi | Yarım gün | "5. dersten sonra gitti, …" |
| hepsi Gelmedi | Gelmedi | "bütün gün · özürsüz" |
| hepsi İzinli | İzinli | "bütün gün" ve izin açıklaması (önizlemede "bütün gün · sağlık raporu") |

### Sayım

- **"Gelmedi"** = 1 gün **özürsüz**; **"Yarım gün"** = 0,5 gün **özürsüz**; **"İzinli"** = 1 gün **izinli** (özürlü); **"Geç geldi"** ve
  **"Geldi"** devamsızlık gününe sayılmaz.
- Özet satırı: **"Bu aralıkta 1,5 gün özürsüz devamsızlık, 1 gün izinli · yarım gün 0,5 sayılır."**
- Süzgeç çiplerindeki sayılar gün sayısıdır (gün gün görünümde) ya da ders saati sayısıdır (ders ders görünümde).

### Öğrenci, veli, öğretmen, müdür

Hepsi aynı kuralı görür; kimse günün durumunu elle seçmez. Durum, ders ders kayıtlardan **hesaplanır**: müdür bir dersi düzeltince
(ör. 1. dersteki "Gelmedi"yi "İzinli" yapınca) günün durumu ve ayrıntısı kendiliğinden değişir
([Okulun devamsızlığı](okulun-devamsizligi.md)).

## Kurallar ve sınırlar

- **Hesaplanır, saklanmaz:** tanıma göre günün durumu kayıtlardan hesaplanır, ayrıca bir tabloya yazılmaz; yoklama bugünkü gibi ders +
  gün anahtarlı kalır.
- **Yoklaması alınmamış ders "Geldi" sayılır** (bugün de öyle: yalnız devamsızlık saklanır). Öğretmen ilk dersin yoklamasını almadıysa
  öğrenci o derste "var" sayılır.
- **Blok ders:** bugün aynı dersin aynı gündeki iki saati tek kayıttır; ilk iki saat aynı dersse ikisi aynı durumu gösterir. Günün durumu
  bu kayda göre hesaplanır.
- **Programsız gün:** öğrencinin sınıfının o gün dersi yoksa günün listelenmemesi ve sayılmaması beklenir (tanımda ayrıca yazmıyor;
  önizleme hafta içi her günü listeler).
- **Sınıf değiştiren öğrenci:** günün dersleri öğrencinin o günkü sınıfının programına göre bulunmalıdır (tanımda ayrıca yazmıyor).
- **Kararlaştırılmayanlar:**
  - Karışık izin: bazı dersler "İzinli", bazıları "Gelmedi" ve hiç "var" yoksa önizleme günü **"Gelmedi"** sayar; yarım günün izinli mi
    özürsüz mü sayılacağı (ör. ilk ders "İzinli", sonra var) tanımda yok — önizleme yarım günü hep özürsüz 0,5 sayar, oysa tanım
    "özürlü/özürsüz ayrımı korunur" der.
  - "Geç" dakikasının nerede girileceği: tasarımda öğretmenin yoklama penceresinde "Geç" seçeneği yok; dakika yalnız müdürün düzeltmesinde
    girilir ([Ders yoklaması](ders-yoklamasi.md)).
  - Bugünün henüz bitmemiş günü: son dersin yoklaması alınmadan gün "Geldi" görünür.
  - Yoklaması hiç alınmamış ders: tasarımda yoklamanın "alındı" bilgisi ayrıca tutulacak
    ([Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md)); böyle bir dersin gün hesabında yine "var" mı sayılacağı, yoksa günün
    "yoklama eksik" diye mi gösterileceği kararlaştırılmadı.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md) ·
[Devamsızlığım](devamsizligim.md) · [Okulun devamsızlığı](okulun-devamsizligi.md) · [Ders yoklaması](ders-yoklamasi.md) ·
[Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md).

**İlgili:** [Okulun ders saatleri](../ders-programi/ders-saatleri.md) (ilk ve son dersin saatleri) ·
[Ders programı kurma](../ders-programi/program-kurma.md) (günün dersleri) · [Dışarı aktarım](../excel-aktarim/disa-aktarim.md)
(Excel raporunda "Günün durumu" ve "Ayrıntı" sütunları).

## Kod tarafı

- Bugün kodda yok. Bugün yoklama kaydı ders + gün anahtarlıdır ve yalnız devamsızlıkları tutar
  ([sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md), [sunucu/veri/depo/devamsizlik.md](../../sunucu/veri/depo/devamsizlik.md));
  bir öğrencinin bir günündeki dersleri programdan çıkaran uç var (`GET /api/devamsizlik/gun`), günün durumunu hesaplayan bir şey yok.
- Kodlanınca gerekenler (tanım): kayıtlar + o günkü program + okulun ders saatlerinden günün durumu; yukarıdaki her kural için örnek
  günlü test.
- Tasarım: Tasarım 1 önizlemesinin ortak devamsızlık ekranı (gün durumu ve ayrıntı yazısı) ve müdür modülü (düzeltmeden sonra karışık
  günlerin ayrıntısı).

## Sık sorulanlar

- **Çocuğum ilk derse 10 dakika geç kaldı; devamsızlık mı?** Hayır; gün "Geç geldi" görünür, devamsızlık gününe sayılmaz.
- **Öğle arasında çıkıp dönmedi.** Son derste yoksa gün "Yarım gün" olur, 0,5 gün özürsüz sayılır.
- **Yalnız 4. derse girmedi, gün neden "Geldi"?** İlk ve son derste var; aradaki ders günü bozmaz. "Ders ders" görünümünde o ders
  "Gelmedi" görünür.
- **Raporla bütün gün izinliydi.** Bütün dersler "İzinli" yazılınca gün "İzinli" olur, izinli günlere sayılır.

## Sırada

- **Devamsızlık: tarih aralığı + "gün gün / ders ders" + süzgeç** (kullanıcı 2 Ekim 19:20; kod Linux'ta; DEVAM.md iş 34) — bu kuralların
  kodu ve testleri.
- **Okulun ders saatleri** (kullanıcı 1 Ekim) — "ilk ders" ve "son ders"in okulun zil düzeninden gelmesi.
- **Devamsızlık sınırı uyarısı** (kullanıcı 3 Ekim) — sınıra sayılan günler bu kuralla.
