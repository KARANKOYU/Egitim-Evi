# Etütler · Etüt yoklaması

**Durum:** Kodda var; tasarımda ek olarak yoklama [etüt ayrıntısındaki](etut-ayrintisi.md) "Etüt yoklaması" düğmesiyle bir pencerede açılır, seçenekler "Geldi · Gelmedi (izinli) · Gelmedi (izinsiz)" olur, etüt başlamadan "Etüt henüz başlamadı" penceresi çıkar, herkes işaretlenmeden kaydedilmez ve kayıttan sonra öğrenciye ve velisine giden bildirimler listelenir.

Etüdün öğretmeninin (ya da yetkilinin) bir etüt gününde her öğrenciyi "Geldi", "İzinli" ya da "İzinsiz" diye işaretleyip kaydettiği
sayfa.

## Ne işe yarar

Etüde kimin gelip kimin gelmediğini kaydeder; gelmeyen ya da izinli yazılan öğrenciye ve velisine aynı gün bildirim gider, öğrenci
ve veli [Etütlerim](etutlerim.md)'de "Gelmediği günler"i görür. Kullanıcı 26 Eylül'de etüdü isterken bunu da söyledi: öğretmen
"eğer ona giriyorsa veya yetkiliyse … ona girebilecek ve sonra geldi gelmedi - izinli/izinsiz girebilecek".

Etüt yoklaması ders yoklamasından ayrıdır: devamsızlık sayılarına girmez, ders yoklamasındaki "Geç geldi" burada yoktur
([Ders yoklaması](../devamsizlik/ders-yoklamasi.md)).

## Nereden açılır

- [Etütler sayfası](etutler-sayfasi.md) → etüdün satırındaki **"Yoklama"** düğmesi. Düğme yalnız o etütte yoklama alabilene çıkar:
  etüdün öğretmeni, "Bütün etütlerde yoklama alır" yetkisi olan, etüt düzenleme yetkisi olan ve müdür.
- Düğme hangi tarihi açar: bugün etüdün günüyse **bugünü**, değilse **etüdün en son geçmiş gününü** (ör. Salı etüdünde Perşembe günü
  basınca iki gün önceki Salı).
- Sayfanın adresi `#/etut-yoklama`; tarayıcıyı yenilersen sayfa "Etütler"e döner (hangi etüt seçildiği yalnız bellekte durur).

Tasarımda (Tasarım 1 önizlemesi): Etütler → etüdün satırına bas → [etüt ayrıntısı](etut-ayrintisi.md) → **"Etüt yoklaması"**
(öğretmende ve müdürde). Yoklama ayrı sayfa değil, bir penceredir.

## Adım adım

### Ne görürsün (bugünkü site)

- Başlık etüdün adı büyük harfle ("8. SINIF MATEMATİK ETÜDÜ"), altında gün, saat ve yer: "Salı 15:40–16:20 · Kütüphane".
- **Tarih kartı:** solda geri oku (**"Önceki hafta"**), ortada kalın tarih "29.09.2026" ve soluk gün adı "Salı", sağda ileri oku
  (**"Sonraki hafta"**) ve **"Etütlere dön"**.
- O tarihte kaydetmeni engelleyen bir şey varsa tarih kartının altında mavi bilgi kutusu (aşağıdaki "Kurallar"daki iletiler).
- Etüdün öğrencisi yoksa: **"Bu etüde henüz öğrenci eklenmedi."**
- Öğrenci varsa:
  - kaydedebiliyorsan üstte **"Hepsi geldi"**;
  - her öğrenci bir satır (ad sırasıyla): adı, altında sınıfı (sınıfsızsa **"sınıfsız"**) ve sağda üç düğme **"Geldi"**, **"İzinli"**,
    **"İzinsiz"**. Seçili düğme belirginleşir: Geldi yeşil, İzinli mavi, İzinsiz kırmızı. Daha önce alınmış yoklama seçili gelir; henüz
    alınmamışsa hiçbiri seçili değildir;
  - en altta **"Yoklamayı kaydet"** ve ileti yeri.
- Kaydedemiyorsan (mavi kutu varsa) düğmeler soluk ve basılmaz; "Hepsi geldi" ve "Yoklamayı kaydet" görünmez. Önceki kayıt yine
  görünür.
- Telefonda (dar ekranda) her satırda ad üstte, düğmeler altta durur.

### Öğretmen

1. Etüt günü, etüdün başlamasına **15 dakika** kala ya da sonra menüden **"Etütler"** → etüdünün satırında **"Yoklama"**.
2. Gelen öğrencilerin çoğuysa **"Hepsi geldi"**ye bas: henüz işaretlenmemiş herkes "Geldi" olur; önceden "İzinli" ya da "İzinsiz"
   seçtiklerine dokunmaz.
3. Gelmeyenleri **"İzinsiz"**, izin alanları **"İzinli"** yap. Yanlış seçimi başka düğmeye basarak değiştir.
4. **"Yoklamayı kaydet"**e bas.
   - Hiç kimse işaretli değilse kaydetmez, altta kırmızı: **"Kimse işaretlenmedi. "Hepsi geldi" ile başlayabilirsin."**
   - İşaretsiz öğrenci kaldıysa sorar: **"3 öğrenci işaretlenmedi. Yalnızca işaretlenenler kaydedilsin mi?"** "Tamam" dersen yalnız
     işaretliler kaydedilir; işaretsizler "henüz alınmadı" kalır.
5. Düğme "Kaydediliyor..." olur; bitince altta yeşil **"Yoklama kaydedildi."** (ya da hiçbir durum değişmediyse **"Değişiklik
   yok."**). Sayfa yeniden çizilmez; aynı gün içinde düzeltip yeniden kaydedebilirsin.
6. "İzinsiz" ya da "İzinli" yazdığın her öğrenciye ve onaylı velilerine bildirim gider ([Etüt bildirimleri](etut-bildirimleri.md)).
7. **"Etütlere dön"** ile listeye dönersin.

Etüt günü değilse ya da 15 dakika kuralı dolmadıysa sayfa açılır ama kilitlidir; mavi kutuda nedeni yazar. Saat gelince sayfa
kendiliğinden açılmaz: **"Etütlere dön"** → yeniden **"Yoklama"**.

Geçmiş bir etüt gününün yoklamasını sen düzeltemezsin (mavi kutu: "Etüdün yoklamasını yalnızca etüt günü alabilirsin; geçmiş günü
düzeltmek için etüt sorumlusuna söyle."); bunu "Bütün etütlerde yoklama alır" ya da etüt düzenleme yetkisi olan yapar.

### Müdür

1. Menüden "Okul Düzeni" → **"Etütler"** → herhangi bir etüdün satırında **"Yoklama"**.
2. Açılan tarih bugün ya da etüdün en son geçmiş günüdür. Başka bir haftaya geçmek için geri ve ileri oklarını kullan; ileri ok
   bugünden sonrasına gitmez, üstte **"İleri bir tarihe yoklama alınmaz."** der.
3. İşaretle ve **"Yoklamayı kaydet"** (adımlar öğretmeninkiyle aynı). Saat sınırı yoktur: etüt günü etüt başlamadan da, geçmiş bir etüt
   gününde de kaydedebilirsin.
4. Düzeltmede yalnız durumu **değişen** öğrencilere bildirim gider; "Geldi"ye çevirdiğin öğrenciye bildirim gitmez.

### Çalışan

Bugün kodda: ek görevli kişi öğretmen hesabıyla çalışır.

- **"Nöbetçi Öğretmen"** şablonundan gelen rol ("Bütün etütlerde yoklama alır") ya da **"Etüt Sorumlusu"** / **"Müdür Yardımcısı"**
  (ikisinde de etüt düzenleme ve bütün etütlerde yoklama var): okulun bütün etütlerinde, geçmiş günler dahil, müdür gibi yoklama alır.
- Rolünde etüt yetkisi olmayan öğretmen yalnız öğretmeni olduğu etütte, yukarıdaki öğretmen kurallarıyla alır.

Tasarımda (çalışan tanımı): rolsüz çalışan etütleri görmez; özel rolünde etüt yetkisi olan çalışan öğretmen olmasa da yetkisi kadar
yoklama alır.

### Öğrenci ve veli

Yoklamayı almaz, sonucunu görür: "İzinsiz" ya da "İzinli" yazılınca bildirim gelir ve [Etütlerim](etutlerim.md)'de "Gelmediği günler"
altında tarih, etüt ve "Gelmedi (izinsiz)" (kırmızı) ya da "Gelmedi (izinli)" (mavi) görünür.

### Tasarımda: yoklama penceresi (Tasarım 1 önizlemesi)

1. Etütler → etüdün satırına bas → ayrıntı penceresinde **"Etüt yoklaması"**.
2. **Etüt henüz başlamadıysa** pencere "Etüt yoklaması" başlığıyla açılır: etüdün adı, "Cuma 2 Ekim 2026 · 15:30–16:10 · 204 nolu
   sınıf", saat simgeli bilgi: **"Etüt henüz başlamadı. Yoklamayı etüt başlayınca (Cuma 2 Ekim 15:30) alırsın: her öğrenci için
   Geldi, Gelmedi (izinli) ya da Gelmedi (izinsiz)."**, altında **"Etüde yazılan öğrenciler (14)"** başlıklı numaralı liste ve
   **"Kapat"**.
3. **Etüt başladıysa** pencere: üstte etüdün adı ve "gün · saat · yer" (daha önce kaydedildiyse sonuna " · kaydedildi: 15:42"), sağda
   **"Hepsi geldi"**. Her öğrenci bir satır: baş harfli yuvarlak, adı ve üç düğme **"Geldi"**, **"Gelmedi (izinli)"**,
   **"Gelmedi (izinsiz)"**. Öğrenciler **işaretsiz** başlar; işaretsiz satır belirgin görünür.
4. Altta sabit şerit: sayaç **"12 geldi · 1 gelmedi · 1 işaretlenmedi"** (işaretsiz sayısı kalın), **"Vazgeç"** ve **"Kaydet"**.
5. İşaretsiz öğrenci varken **"Kaydet"**: kaydetmez, işaretsiz satırları vurgular, ilkine kaydırır ve kısa ileti verir:
   **"1 öğrenci işaretlenmedi; önce herkesi işaretle."**
6. Herkes işaretliyse kaydeder ve **"Etüt yoklaması kaydedildi"** penceresi açılır: "Matematik etüdü · Salı 29 Eylül · 15:30–16:10",
   altında **"8 geldi · 1 gelmedi (izinli) · 1 gelmedi (izinsiz)"**, sonra **"Öğrenciye ve velisine giden bildirimler (1)"** başlığı
   ve her biri için "<öğrenci> ve velisi" ile giden metin (ör. "Çocuğunuz Elif Yılmaz Salı 29 Eylül saat 15:30 Matematik etüdüne
   gelmedi (izinsiz)."). Yeni bildirim yoksa **"Değişiklik yok; yeni bildirim gitmedi."**, herkes geldiyse **"Herkes geldi; bildirim
   gitmedi."** En altta **"Tamam"**.
7. Etütler listesinde satırın alt satırındaki sayı güncellenir ("8 / 10 geldi"). Rozet, tarihi geçmiş etütte **"Bitti"** kalır;
   henüz "Bitti" olmamış etütte yoklama kaydedilince **"Yoklama alındı"** olur.

Önizlemede yoklaması alınabilen tek örnek, öğretmenin 29 Eylül'deki "Matematik etüdü"dür (10 öğrenci); "Cuma 2 Ekim" etüdü önizlemenin
saatine göre henüz başlamadığı için 2. adımdaki pencere çıkar.
8. Düzeltme: kaydedilmiş yoklamayı yeniden açıp değiştirirsen yalnız durumu değişen öğrenciye ve velisine bildirim gider; "Geldi"ye
   çevrilen için "Etüt yoklaması düzeltildi: …", "İzinli" ile "İzinsiz" arasında değişen için "Etüt yoklaması güncellendi: …".

Önizleme ile bugünkü kod arasındaki farklar (kullanıcı bunlar için ayrıca karar vermedi; kodlanırken netleşecek):

- Önizlemede yoklama **etüt başlayınca** açılır; bugünkü kodda etüdün öğretmeni için **başlangıçtan 15 dakika önce** açılır.
- Önizlemede öğretmen geçmiş etüdünün ("Bitti") yoklamasını açıp düzeltebiliyor; bugünkü kodda geçmiş günü yalnız yetkili düzeltir.
- Önizlemede herkes işaretlenmeden kaydedilmez; bugünkü kodda yalnız işaretliler kaydedilir. (Tasarımdaki ders yoklaması da işaretsiz
  başlar ve herkes işaretlenmeden kaydetmez; iki yoklama aynı düzende olur.)
- Önizlemede tarih değiştirme okları yok; yoklama ayrıntıdaki etüdün kendi tarihine açılır (etütler tarihlidir).

## Kurallar ve sınırlar

- **Kim alır:**
  - **etüdün öğretmeni:** yalnız kendi etüdünde, yalnız **etüt günü (bugün)** ve **başlangıçtan en erken 15 dakika önce**; günün
    sonuna kadar alabilir ve düzeltebilir (üst saat sınırı yok);
  - **"Bütün etütlerde yoklama alır"** yetkisi olan: okulun bütün etütlerinde, bugün ve geçmiş bütün etüt günlerinde, saat sınırı
    olmadan;
  - **etüt düzenleme yetkisi olan** ve **müdür**: aynı, bütün etütlerde (bu yetki "bütün etütlerde yoklama"yı içerir).
  - Öğrenci, veli ve servisçi alamaz (**"Bu bölüm okul personeli içindir"**).
- **Kilit iletileri** (mavi kutuda; elle istekte sunucunun cevabı):
  - **"İleri bir tarihe yoklama alınmaz"** — tarih bugünden sonra;
  - **"Bu etüt Salı günleri yapılıyor; seçilen gün Çarşamba."** — tarih etüdün gününe denk gelmiyor;
  - **"Bu etütte yoklama alma yetkin yok"** — etüdün öğretmeni değilsin ve yetkin yok (bu durumda satırda "Yoklama" düğmesi zaten
    çıkmaz);
  - **"Etüdün yoklamasını yalnızca etüt günü alabilirsin; geçmiş günü düzeltmek için etüt sorumlusuna söyle."** — öğretmen, geçmiş gün;
  - **"Yoklama etüt başlamadan en erken 15 dakika önce açılır (15:40)."** — öğretmen, erken;
  - **"Tarih geçersiz"**, **"Etüt bulunamadı"**.
- **Kayıt iletileri:** **"Yoklamada kimse işaretlenmedi."** (boş gönderim), **"Listede bu etüdün öğrencisi olmayan biri var."**,
  **"Geçersiz yoklama durumu"**. Bir kayıtta en çok 300 satır işlenir.
- **Üç durum:** Geldi, İzinli (gelmedi, izinli), İzinsiz (gelmedi, izinsiz). "Geldi" de kayıt olarak saklanır; böylece "henüz
  alınmadı" ile "geldi" ayrılır. İşaretsiz bırakılan öğrencinin önceki kaydı (varsa) olduğu gibi kalır.
- **Yalnız değişenler yazılır:** aynı yoklamayı yeniden kaydedersen "Değişiklik yok." çıkar; bildirim ve işlem kaydı oluşmaz.
- **Bildirim:** durumu yeni "İzinsiz" ya da "İzinli" olan öğrenciye "Etüt: 8. sınıf Matematik etüdü (29.09.2026) — gelmedi (izinsiz)"
  ve onaylı velilerine başında öğrencinin adıyla aynı metin; "Geldi" bildirim üretmez (gelmedi → geldi düzeltmesinde de bugün
  bildirim gitmez) — [Etüt bildirimleri](etut-bildirimleri.md).
- **İşlem kaydı:** en az bir durum değiştiyse okulun işlem kaydına **"Etüt yoklaması alındı"** ve "<etüt> 2026-09-29: 3 değişiklik"
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Liste etüdün bugünkü öğrencileridir:** etütten çıkarılan öğrencinin eski kaydı silinmez ama yoklama sayfasında adı çıkmaz.
- **Saat sunucunun saatidir:** "bugün" ve 15 dakika kuralı sunucunun yerel saatine göre hesaplanır; sunucu Türkiye saatinde değilse
  kayar (bilinen açık).
- **Devamsızlığa girmez:** etüt yoklaması öğrencinin ders devamsızlığı sayılarında ve gün durumunda yer almaz.
- **Eğitim yılı:** etüt yoklaması yıl seçicisine bağlı değil; geçmiş yıla bakarken de alınır.
- **Bölüm kapalıysa** sayfa açılmaz: menüde yoktur, adres yazılırsa **"Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından
  açabilir."**; kayıtlar silinmez.
- **Nakil:** başka okula geçen öğrencinin buradaki etüt yoklamaları bu okulun kaydı olarak kalır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etütler sayfası](etutler-sayfasi.md) — "Yoklama" düğmesi.
- [Etüt ayrıntısı](etut-ayrintisi.md) — tasarımda "Etüt yoklaması" düğmesinin yeri.
- [Etüdün öğrencilerini seçme](ogrenci-secme.md) — yoklamada kimlerin çıktığı.
- [Etüt yetkileri ve hazır roller](etut-yetkileri.md) — kim, hangi gün alır.
- [Etüt bildirimleri](etut-bildirimleri.md) — "Etüt: … — gelmedi (izinsiz)".
- [Etütlerim](etutlerim.md) — öğrencinin ve velinin "Gelmediği günler"i.
- [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md) — gün değişince ve silinince yoklamalar.

**İlgili:**

- [Ders yoklaması](../devamsizlik/ders-yoklamasi.md) — ders yoklaması (ayrı kayıt, ayrı kurallar; "Hepsi geldi" farkı).
- ["Gelmedi" bildirimi](../devamsizlik/devamsizlik-bildirimi.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md),
  [Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Etüt yoklaması alındı".
- [Özel roller](../roller-yetkiler/ozel-roller.md) — "Nöbetçi Öğretmen", "Etüt Sorumlusu".
- [Android uygulaması](../uygulama/android-uygulamasi.md) — tanımda öğretmenin "Diğer" sekmesinde "Etüt yoklaması".
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) — etüt
  yoklaması kayıtları.

## Kod tarafı

- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `EYLEMLER['etut-yoklama-ac']` (`etutSonTarihi`),
  `SAYFALAR['etut-yoklama']` (tarih kartı, `engel` → mavi kutu ve kilit), `EYLEMLER['etut-hafta']` (±7 gün, bugünden ileri değil),
  `EYLEMLER['etutler-don']`, `etutDurumYaz`, `EYLEMLER['etut-durum']`, `EYLEMLER['etut-hepsi-geldi']` (yalnız boşlar),
  `EYLEMLER['etut-yoklama-kaydet']` (onay, `#etyMesaj`); `ETUT_DURUMLAR` ("Geldi", "İzinli", "İzinsiz"). Görünüm
  `20-devamsizlik.css`'in etüt bölümü ve ortak `.durum-dugme` ([CSS.md](../../public/css/parcalar/CSS.md)).
- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — `yoklamaEngeli` (sıra: etüt, tarih, ileri tarih, gün, yetki,
  bugün, 15 dakika), `etutGorunumu` (`yoklamaAlabilir`), `GET /api/etut/yoklama` (`{ etut, tarih, engel, ogrenciler }`),
  `POST /api/etut/yoklama` (`DURUMLAR`, 300 satır, işlem kaydı `etut.yoklama`), `yoklamaBildir`.
- Depo ve tablo: [sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md) — `yoklamasi`, `yoklamaYaz` (yalnız değişenleri yazar
  ve döndürür); `etut_yoklamalari` (anahtar etüt + tarih + öğrenci, durum `var`/`yok`/`izinli`, yoklamayı alan; şema 013,
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Yetki: [sunucu/yetki.md](../../sunucu/yetki.md) — `etut.yoklama`, `etut.yonet`.
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (etüdün öğretmeni olmayan açamaz, başka gün ve ileri tarih reddi, geçersiz
  durum ve listede olmayan kişi reddi, aynı yoklama "değişiklik yok", gelmeyene bildirim gider gelene gitmez, `etut.yoklama` verilen
  öğretmen düzeltebilir), [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (`etut-yoklama-ac`, `etut-hafta`,
  `etutler-don`, `etut-durum`, `etut-hepsi-geldi`, `etut-yoklama-kaydet`).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Etütler").

## Sık sorulanlar

- **"Yoklama"ya bastım, düğmeler soluk.** Mavi kutudaki nedeni oku: etüt günü değilse ya da başlamasına 15 dakikadan fazla varsa
  öğretmen yoklama alamaz. Saat gelince "Etütlere dön" → yeniden "Yoklama".
- **Bugün etüt günü değil ama "Yoklama" geçen haftayı açtı.** Düğme etüdün en son gününü açar; öğretmen için o gün kilitlidir.
- **Dün unuttum, şimdi alabilir miyim?** Etüdün öğretmeni olarak hayır; "Bütün etütlerde yoklama alır" yetkisi olan (ör. nöbetçi
  öğretmen, etüt sorumlusu) ya da müdür geçmiş günü kaydeder.
- **"Hepsi geldi"ye bastım, izinli yazdığım öğrenci değişti mi?** Hayır; "Hepsi geldi" yalnız işaretsizleri "Geldi" yapar.
- **Yanlışlıkla "İzinsiz" yazdım, veli bildirim aldı. Düzeltince ne olur?** Aynı gün "Geldi" yapıp kaydedebilirsin; kayıt düzelir ama
  bugün "düzeltildi" bildirimi gitmez (tasarımda gider). Gerekirse veliye mesaj yaz.
- **Etüt yoklaması devamsızlığa sayılır mı?** Hayır; ayrı tutulur.
- **Sayfayı yeniledim, Etütler'e döndüm.** Yoklama sayfası yenilemede kaybolur; "Yoklama"ya yeniden bas. Kaydetmediğin işaretler gider.

## Sırada

- Etüt planlama (öneri, 29 Eylül; Tasarım 1 önizlemesi): yoklamanın etüt ayrıntısından bir pencerede açılması, işaretsiz başlama ve
  herkes işaretlenmeden kaydetmeme, "Gelmedi (izinli) / Gelmedi (izinsiz)" adları, kayıttan sonra giden bildirimlerin listesi,
  düzeltme bildirimleri.
- Android uygulaması: öğretmenin "Diğer" sekmesinde "Etüt yoklaması".
- Optimizasyon ve saklama süreleri: öğrenci ve veli eski yılın etüt kayıtlarını isteyemeyecek; okul yönetimi bütün geçmişi görmeye
  devam edecek.
- Çok dil: düğme ve kilit iletileri çeviri kataloğuna girecek.
