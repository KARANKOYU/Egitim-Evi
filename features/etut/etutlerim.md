# Etütler · Etütlerim (öğrenci ve veli)

**Durum:** Kodda var; tasarımda ek olarak her etüt tarihli bir satırda saat aralığı, öğretmen ve yerle görünür, sağında "Bugün", "Yarın", "3 gün sonra", "Geldin" gibi bir rozet olur, satıra basınca [etüt ayrıntısı](etut-ayrintisi.md) açılır; velide her çocuk ayrı oturumdur (çocuk şeridi ve "Hepsi" kalkar).

Öğrencinin kayıtlı olduğu etütleri ve gelmediği etüt günlerini, velinin de çocuğununkileri gördüğü sayfa.

## Ne işe yarar

Öğrenci hangi gün, hangi saatte, nerede, hangi öğretmenle etüdü olduğunu buradan öğrenir; etüde gelmediği ya da izinli yazıldığı
günler de burada listelenir. Veli aynı bilgiyi çocuğu için görür. Kullanıcının 26 Eylül tarifi: etüt "belli güne belli saatler
arasında bir öğretmen"le yapılır; sayfa tam bunu gösterir.

## Nereden açılır

- **Öğrenci:** sol menüde saat simgeli **"Etütlerim"** ("Sınavlarım"ın altında, ayraçtan ve "Yemek Listesi"nden önce). Adres
  `#/etutlerim`.
- **Veli:** sol menüde saat simgeli **"Etütler"** ("İlerleyiş"in altında, "Yemek Listesi"nin üstünde). Adres aynı: `#/etutlerim`.
- Bildirimden: "Etüt: … — gelmedi (izinsiz)" bildirimine basınca öğrencide "Etütlerim", velide "Etütler" açılır
  ([Etüt bildirimleri](etut-bildirimleri.md)).
- Okulun "Etütler" bölümü kapalıysa satır menüde yoktur. Velide satır, çocuklarından **birinin** okulunda bölüm açıksa görünür.
- Öğretmen ya da müdür olup aynı zamanda veli olan kişinin menüsündeki **"Velisi olduğum"** bölümünde etüt satırı yoktur; öğrenci
  portalını açan (veli, müdür, öğretmen) portalın menüsünde de etüt bağlantısı görmez. Tasarımda (3 Ekim kararı: hesap = kişi,
  oturum = rol) bu kişinin her çocuğu için ayrı bir veli oturumu olur; çocuğun etütlerini o oturumun "Etütler"inde görür.

Tasarımda (Tasarım 1 önizlemesi): öğrencide "Başarılarım"ın altında **"Etütlerim"**, velide "Başarıları"nın altında **"Etütler"**.
Velide her çocuk ayrı oturumdur ("Veli · Elif (7-A)", "Veli · Can (5-B)"); sayfa yalnız o oturumun çocuğunu gösterir.

## Adım adım

### Öğrenci

1. Menüden **"Etütlerim"**.
2. Başlık **"ETÜTLERİM"**, altında **"Katıldığın etütler ve yoklamaları."**
3. Bir kartta kayıtlı olduğun her etüt bir satır (gün, saat ve ada göre sıralı):
   - kalın etüt adı ("8. sınıf Matematik etüdü");
   - altında gün ve saat, varsa yer ve öğretmen: **"Salı 15:40–16:20 · Kütüphane · Ayşe Kaya"** (yer ya da öğretmen yoksa o parça
     yazmaz).
   - Hiçbir etüde kayıtlı değilsen: **"Kayıtlı etüt yok."**
4. Etüde gelmediğin ya da izinli yazıldığın günler varsa altında **"Gelmediği günler"** başlığı ve her biri bir satır:
   **"29.09.2026 · 8. sınıf Matematik etüdü"** ve sağda etiket: kırmızı **"Gelmedi (izinsiz)"** ya da mavi **"Gelmedi (izinli)"**.
   Yeniden eskiye sıralıdır.
5. Son yoklamaların hepsinde "Geldi" yazılmışsa başlık yerine **"Son yoklamaların hepsinde gelmiş."** yazar. Hiç yoklama
   alınmamışsa bu bölüm hiç çıkmaz.
6. Satırlara basılmaz; ayrıntı penceresi yoktur.

### Veli

1. Menüden **"Etütler"**.
2. Başlık **"ETÜTLER"**, altında **"Çocuklarının etütleri ve etüt yoklamaları."**
3. İki ya da daha çok çocuğun varsa üstte **çocuk şeridi**: **"Hepsi"** ve her çocuğun adı. "Hepsi" seçiliyken her çocuk için ayrı bir
   kart, bir çocuğa basınca yalnız onun kartı.
4. Her kartın başlığı çocuğun adı soyadı; içi öğrencinin kartıyla aynı (etütler, "Gelmediği günler", "Kayıtlı etüt yok." ve "Son
   yoklamaların hepsinde gelmiş.").
5. Hiç çocuk eklemediysen: **"Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla ekleyebilirsin."**
   ([Çocuklarım](../portallar/cocuklarim.md)).

### Öğretmen, müdür, çalışan

Bu sayfayı kullanmaz; kendi listeleri [Etütler sayfası](etutler-sayfasi.md). (Sunucu, öğrenciyi görme hakkı olan okul personeline bu
dökümü verir ama ekranda bağlantısı yoktur.)

### Tasarımda: Etütlerim (Tasarım 1 önizlemesi)

**Öğrenci:**

1. Başlık **"Etütlerim"**, alt yazı **"Sana atanan etütler"**, tek grup **"Etütler"**.
2. Her etüt bir satır: solda gün rozeti ("Cum", "Sal"), etüt adı, altında **"2 Ekim · 15:30–16:10 · Ayşe Kaya · 204 nolu sınıf"**
   (tarih, saat aralığı, öğretmen, yer).
3. Sağda rozet:
   - yapılacak etütte kalan gün: **"Bugün"**, **"Yarın"** (sarı), **"3 gün sonra"** (6 güne kadar), **"1 hafta sonra"** (mavi);
   - bitmiş etütte yeşil **"Geldin"** (yoklaması alınmışsa) ya da **"Bitti"**.
4. Sıra: yapılacaklar önce, en yakın tarih üstte; bitenler en altta.
5. Satıra basınca [etüt ayrıntısı](etut-ayrintisi.md) açılır (gün, saat, öğretmen, yer, konu, "14 öğrenci · sen de varsın", durum).

**Veli** (oturum "Veli · Elif (7-A)"):

1. Başlık **"Etütler"**, alt yazı **"Elif'in etütleri"** (Can'ın oturumunda "Can'ın etütleri"), tek grup **"Etütler"**.
2. Her satırda solda çocuğun baş harfleri kendi renginde ("EY"), etüt adı, altında **"Cuma 2 Ekim · 15:30–16:10 · Ayşe Kaya · 204 nolu
   sınıf"**, sağda aynı rozetler; bitmiş etütte **"Geldi"**.
3. Satıra basınca ayrıntı ("14 öğrenci · Elif de var"; planlı etütte "Elif gelemeyecekse öğretmenine mesajla bildir; etüt
   yoklamasında "izinli" yazılır.").
4. Çocuk şeridi ve "Hepsi" yoktur; öbür çocuğun etütleri için onun oturumuna geçersin ([Velide her çocuk ayrı
   oturum](../portallar/velide-cocuk-oturumlari.md)).

Önizlemede "Gelmediği günler" bölümü yok; gelmediği etüt satırın rozetinden ve ayrıntıdan anlaşılır. Kullanıcı bu bölüm için bir şey
söylemedi; hangisinin kalacağı kodlanırken kararlaşacak.

Etütler tasarımda **Takvim**'de de görünür: günün altındaki listede saat simgeli satır, kalın "Matematik etüdü", altında "Etüt ·
15:30–16:10 · 204 nolu sınıf · Ayşe Kaya" (öğretmenin kendi takviminde öğretmen adı yazmaz); takvimin altındaki ajandada ayrı bir
"Etüt" kutucuğu yoktur, etütler "Etkinlik" kutucuğuyla süzülür. Satıra basınca aynı ayrıntı açılır
([Ajanda](../takvim/ajanda.md), [Gün ayrıntısı](../takvim/gun-ayrintisi.md)).

## Kurallar ve sınırlar

- **Kim görür:** öğrenci yalnız **kendini** görür (istekte başka öğrencinin kimliğini yazsa da kendi dökümü gelir); veli yalnız
  **bağlı çocuğunu** (başkası için **"Bu öğrenciyi görme yetkin yok"**). Servisçi göremez.
- **Hangi etütler:** öğrencinin bugün kayıtlı olduğu etütler. Etütten çıkarılınca etüt listeden kalkar, eski "gelmedi" kayıtları kalır.
- **Hangi yoklamalar:** öğrencinin **şimdiki okulunun** etütlerinden, yeniden eskiye en çok **60** yoklama kaydı; bunlardan yalnız
  "Geldi" olmayanlar listelenir. Nakil gelen öğrencinin eski okuldaki etüt yoklamaları yeni okulda görünmez (o okulun kaydıdır).
- **Silinen etüt:** etüt silinince o etüdün yoklamaları da silinir; "Gelmediği günler"den de gider.
- **Bölüm kapalıysa:** menüde satır yoktur; adres yazılırsa **"Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından
  açabilir."** İki çocuğu farklı okullarda olan velide bölüm birinin okulunda kapalıysa, "Hepsi" seçiliyken sayfa kırmızı
  **"Etütler bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."** iletisiyle açılmaz; şeritten öbür çocuğu seç.
- **Eğitim yılı:** döküm yıla göre süzülmez; yıl seçicide geçmiş yıla bakarken de aynı liste görünür.
- **Güncellik:** sayfa her açılışta sunucudan gelir; açıkken alınan yoklama için üst şeritteki "Yenile"ye bas.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etüt yoklaması](etut-yoklamasi.md) — "Gelmediği günler"i yazan ekran.
- [Etüt bildirimleri](etut-bildirimleri.md) — bu sayfayı açan bildirimler.
- [Etüt ayrıntısı](etut-ayrintisi.md) — tasarımda satıra basınca açılan pencere.
- [Etüdün öğrencilerini seçme](ogrenci-secme.md) — öğrencinin hangi etütlerde olduğunu belirleyen pencere.
- [Etütler sayfası](etutler-sayfasi.md) — personelin listesi.
- [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md), [Etüt yetkileri ve hazır roller](etut-yetkileri.md).

**İlgili:**

- [Devamsızlığım](../devamsizlik/devamsizligim.md) — ders devamsızlığı (etüt yoklaması ayrı).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Çocuklarım](../portallar/cocuklarim.md).
- [Ajanda](../takvim/ajanda.md), [Gün ayrıntısı](../takvim/gun-ayrintisi.md) — tasarımda etütlerin takvimdeki yeri.
- [Sol menü](../menu-ve-arama/sol-menu.md) — "Etütlerim" ve "Etütler" satırları.
- [Öğrenci nakli](../hesaplar/ogrenci-nakli.md), [Mezunlar](../egitim-yili/mezunlar.md).
- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `SAYFALAR.etutlerim` (öğrencide `GET
  /api/etut/ogrenci`, velide `cocuklarIcin('/etut/ogrenci')`), `etutOgrenciKarti` ("Kayıtlı etüt yok.", "Gelmediği günler", "Son
  yoklamaların hepsinde gelmiş."), `ETUT_DURUM_AD`, `tarihYazisi`.
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) — `veliCocuklar`, `veliCocukYok`, `cocuklarIcin`,
  `veliCocukSeridi` ("Hepsi" ve çocuk adları; iki çocuktan azsa çıkmaz). [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md)
  — menü satırları ve `SAYFA_OZELLIK`.
- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — `GET /api/etut/ogrenci?studentId=` (öğrenci kendisi; öbürleri
  `canSeeStudent`; yoklamalar şimdiki okula süzülür, en çok 60). [sunucu/iliskiler.md](../../sunucu/iliskiler.md) — `canSeeStudent`.
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) — velide çocuğun okuluna göre bölüm kapısı.
- Depo: [sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md) — `ogrencininki`, `ogrenciYoklamalari`.
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (öğrenci yalnız kendini görür, öğrenci personel listesine giremez, veli
  yalnız kendi çocuğunu görür), [testler/test-ozellikler.md](../../testler/test-ozellikler.md).
- Android uygulaması bu sayfayı bugün göstermiyor; tanımdaki öğrenci ve veli ekran listesinde de etüt yok
  ([Android uygulaması](../uygulama/android-uygulamasi.md)).

## Sık sorulanlar

- **Etütlerim boş, "Kayıtlı etüt yok." yazıyor.** Henüz hiçbir etüde eklenmedin; etüt sorumlusu seni eklediğinde burada görünür
  (bugün bildirim gelmez).
- **Etüde gittim ama "Gelmediği günler"de görünüyorum.** Öğretmen yanlış işaretlemiş olabilir; öğretmenine ya da etüt sorumlusuna
  söyle. Düzeltilince listeden kalkar.
- **"İzinli" ile "İzinsiz" farkı ne?** İzinli: önceden izin aldın, gelmedin. İzinsiz: haber vermeden gelmedin. İkisi de "Gelmediği
  günler"de çıkar; etiketleri farklıdır (kırmızı ve mavi).
- **İki çocuğum var; birinin etütlerini ayrı görebilir miyim?** Bugün şeritten çocuğun adına bas. Tasarımda her çocuk ayrı oturum
  olur.
- **Etütlerim telefon uygulamasında var mı?** Bugün yok; tarayıcıdan bak.
- **Eski okulumdaki etütler neden yok?** Nakilden sonra yalnız şimdiki okulunun etütleri ve yoklamaları görünür.

## Sırada

- Etüt planlama (öneri, 29 Eylül; Tasarım 1 önizlemesi): tarihli satırlar ve kalan gün rozeti, satıra basınca etüt ayrıntısı, yeni
  etüdün ve "yarın etüdün var" hatırlatmasının bildirilmesi, etütlerin ajandaya girmesi.
- Hesap ve oturum kararı (3 Ekim): velide her çocuk ayrı oturum; çocuk şeridi ve "Hepsi" kalkar.
- Optimizasyon ve saklama süreleri: öğrenci ve veli eski yılın etüt kayıtlarını isteyemeyecek.
- Yıl geçişi: mezun portalında etüt yoklaması salt okunur görünecek.
- Çok dil: başlık ve iletiler çeviri kataloğuna girecek (önizlemenin İngilizcesinde "Etütlerim" "My study hours", "Etütler" "Study
  hours").
