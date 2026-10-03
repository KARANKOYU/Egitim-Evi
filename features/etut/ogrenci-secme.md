# Etütler · Etüdün öğrencilerini seçme

**Durum:** Kodda var; tasarımda ek olarak öğrenciler ayrı bir pencerede değil, "Etüt planla" penceresinin içinde seçilir: seçilenler üstte çip olarak durur, sınıf çipleri, "Öğrenci ara (en az 2 harf)" kutusu ve "… sınıfının hepsini ekle" düğmesi vardır; her eklenen öğrenci [boş zaman ızgarasını](bos-zaman-izgarasi.md) anında değiştirir.

Bir etüde hangi öğrencilerin katılacağını okulun bütün öğrencileri arasından sınıf sınıf ya da tek tek işaretleyerek seçtiğin pencere.

## Ne işe yarar

Etüdün öğrenci listesi üç şeyi belirler: etüdün yoklamasında kimlerin adı çıkar ([Etüt yoklaması](etut-yoklamasi.md)), etüt hangi
öğrencinin "Etütlerim"inde ve hangi velinin "Etütler"inde görünür ([Etütlerim](etutlerim.md)) ve satırdaki "12 öğrenci" sayısı.
Liste sınıflar arası olabilir: 7-A'dan beş, 7-B'den üç öğrenci aynı etütte durabilir. Kullanıcının 29 Eylül isteği etüt sorumlusunun
"herkese" etüt yazabilmesi; etüt planlama tanımı bunu "istediği öğrencilere (sınıftan toplu ya da tek tek, sınıflar arası)" diye
açar. Bugünkü pencere bunu karşılar; tasarım seçimi planlama penceresine taşır.

## Nereden açılır

[Etütler sayfası](etutler-sayfasi.md) → etüdün satırındaki **"Öğrenciler"** düğmesi. Düğme yalnız etüt düzenleme yetkisi olana çıkar
(müdür her zaman; rolünde "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" olan kişi). Pencerenin başlığı
**"<etüdün adı> — öğrenciler"**: "8. sınıf Matematik etüdü — öğrenciler".

Yeni açtığın etüdün öğrencisi yoktur; önce [Etüt açma](etut-acma.md) ile etüdü kaydet, sonra satırındaki "Öğrenciler"e bas.

Tasarımda (Tasarım 1 önizlemesi): Etütler → sağ üstte **"Etüt ekle"** → **"Etüt planla"** penceresinin ortasındaki
**"Öğrenciler · <sayı>"** bölümü.

## Adım adım

### Pencerede ne var (bugünkü site)

- Üstte yan yana:
  - **"Sınıf"** — açılır liste: **"Bütün sınıflar"** ve okulun sınıfları;
  - **"Ara"** — arama kutusu, yer tutucu **"Öğrenci adı"**.
- Altında **"Görünenleri seç"** ve **"Görünenleri kaldır"** düğmeleri ve sayaç: **"12 öğrenci seçili"**.
- Kaydırılabilir bir kutuda okulun **bütün onaylı öğrencileri**, ad sırasıyla. Her satırda bir onay kutusu, öğrencinin adı ve yanında
  soluk sınıf adı ("Elif Yılmaz 7-A"; sınıfsız öğrencide sınıf yazmaz). Etüde kayıtlı olanlar işaretli gelir.
- Okulda hiç öğrenci yoksa kutuda **"Okulda öğrenci yok."** yazar.
- Altta **"Vazgeç"** ve **"Kaydet"**.

### Müdür

1. Menüden "Okul Düzeni" → **"Etütler"** → etüdün satırında **"Öğrenciler"**.
2. Bir sınıfın hepsini eklemek için **"Sınıf"**tan sınıfı seç (liste yalnız o sınıfın öğrencilerine daralır) → **"Görünenleri seç"**.
3. Başka bir sınıftan da öğrenci eklemek için "Sınıf"ı değiştir ya da **"Ara"**ya adının bir parçasını yaz, öğrencinin kutusunu
   işaretle. Arama büyük-küçük harfe ve Türkçe harflere takılmaz: "ozturk" yazınca "Öztürk" de çıkar.
4. Çıkarmak istediğin öğrencinin işaretini kaldır; görünen herkesi birden çıkarmak için **"Görünenleri kaldır"**.
5. Sayaç her işaretlemede güncellenir. Süzgeç yalnız görünümü daraltır: gizli kalan ama işaretli öğrenciler de sayılır ve kaydedilir.
6. **"Kaydet"**e bas. Düğme "Kaydediliyor..." olur; bitince pencere kapanır, Etütler sayfası yeniden çizilir, üstte yeşil
   **"12 öğrenci kaydedildi."** çıkar (6 saniye sonra kaybolur) ve satırdaki sayı "12 öğrenci" olur.
7. Bir sorun olursa pencere açık kalır, ileti pencerenin altında kırmızı çıkar (ör. **"Bir etüde en fazla 300 öğrenci
   eklenebilir."**); düzeltip yeniden "Kaydet".
8. **"Vazgeç"** (ya da pencereyi kapatmak) hiçbir şeyi değiştirmez.

### Öğretmen

Müdür sana "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" yetkisini verdiyse adımlar müdürünkiyle aynıdır. Yetkin
yoksa "Öğrenciler" düğmesi çıkmaz: etüdün öğretmeni olsan da öğrenci ekleyip çıkaramazsın, yalnız yoklamada listeyi görürsün. Listede
eksik ya da fazla öğrenci varsa etüt sorumlusuna söyle.

### Çalışan

Bugün kodda: etüt sorumlusu (ya da müdür yardımcısı) öğretmen hesabındaki ek rolüyle çalışır; adımlar müdürünkiyle aynı. Nöbetçi
öğretmen şablonundaki "Bütün etütlerde yoklama alır" yetkisi öğrenci seçtirmez.

Tasarımda (çalışan tanımı): özel rolünde etüt yetkisi olan çalışan öğretmen olmasa da öğrenci seçer; rolsüz çalışan seçemez.

### Öğrenci ve veli

Seçilen kişidir; hiçbir şey yapmaz. Bugün etüde eklenince ya da çıkarılınca bildirim gitmez; etüt öğrencinin
[Etütlerim](etutlerim.md)'inde ve velinin "Etütler"inde kendiliğinden görünür (ya da kalkar).

Tasarımda: yeni etüt planlanınca öğrenciye ve velisine bildirim gider ("Can · Yeni etüt") — [Etüt bildirimleri](etut-bildirimleri.md).

### Tasarımda: "Etüt planla" penceresinde öğrenci seçme (Tasarım 1 önizlemesi)

1. **"Etüt ekle"** → **"Etüt planla"**. Ortadaki bölümün başlığı **"Öğrenciler · <sayı>"**; en az bir öğrenci varsa yanında
   **"Hepsini çıkar"** bağlantısı.
2. Seçilen öğrenciler başlığın altında çip olarak durur; her çipte **"×"** (ekran okuyucuda "<ad> çıkar") öğrenciyi çıkarır. Hiç öğrenci
   yoksa **"Henüz öğrenci yok; sınıf seç ya da ara."** yazar.
3. **Sınıf çipleri** (önizlemede 5-A'dan 8-D'ye): birine basınca altında o sınıfın öğrencileri ve en üstte **"<sınıf> sınıfının hepsini
   ekle"** düğmesi açılır. Düğmeye basınca sınıfta olup listede olmayanlar eklenir, kısa ileti çıkar: **"7-A sınıfının öğrencileri
   eklendi."** Aynı çipe yeniden basınca sınıf listesi kapanır.
4. **"Öğrenci ara (en az 2 harf)"** kutusu: iki harf yazınca okulun bütün sınıflarında adı uyan ilk 12 öğrenci, sınıflarıyla çıkar.
   Hiçbiri uymazsa **""<yazdığın>" bulunamadı."** Arama kutusu doluyken sonuçlar sınıf listesinin yerini alır ve "… sınıfının hepsini
   ekle" düğmesi gizlenir; bir sınıf çipine basmak aramayı temizler.
5. Bir öğrenciye basınca eklenir (yanında onay işareti çıkar); yeniden basınca çıkar.
6. Her ekleme ve çıkarmada alttaki [boş zaman ızgarası](bos-zaman-izgarasi.md) yeniden hesaplanır: öğrencinin dolu olduğu saatler
   sarıya ya da kırmızıya döner.
7. **"Etüdü kaydet"**te hiç öğrenci yoksa pencerenin altında kırmızı **"En az bir öğrenci ekle."** Kayıttan sonra öğrenci listesi,
   arama ve sınıf seçimi temizlenir.

Önizlemede açılışta örnek olarak üç öğrenci seçili gelir ("Öğrenciler · 3"); bu örnek veridir. Var olan bir etüdün öğrencilerini
sonradan değiştirmek önizlemede gösterilmiyor (satırlarda "Öğrenciler" düğmesi yok); kullanıcı bu konuda bir şey söylemedi, bugünkü
"Öğrenciler" penceresi kalır (kullanıcının 2 Ekim'de doğruladığı kural: üzerine yorum yapmadığı ekranlar bugünkü site gibi kalır).

## Kurallar ve sınırlar

- **Kim seçer:** yalnız etüt düzenleme yetkisi olan (müdür her zaman). Yetkisiz istek **"Etüt düzenleme yetkin yok"** alır; öğrenci,
  veli ve servisçi **"Bu bölüm okul personeli içindir"**.
- **Kimler seçilebilir:** yalnız bu okulun öğrencileri; listede yalnız **onaylı** öğrenciler görünür. Elle gönderilen listede okulun
  öğrencisi olmayan biri varsa **"Listede bu okulda olmayan öğrenci var."** — o kayıtta kimse yazılmaz.
- **Sayı sınırı:** bir etüde en çok **300** öğrenci: **"Bir etüde en fazla 300 öğrenci eklenebilir."** Pencere bunu kaydetmeden
  denetlemez; ileti sunucudan gelir. Aynı öğrenci iki kez gönderilirse bir kez sayılır.
- **Kaydet bütün listeyi yeniden yazar:** işaretli olanlar (gizli kalanlar dahil) etüdün yeni listesidir; işareti kaldırılan çıkar.
  Liste tek işlemde yazılır; yarım kalmaz.
- **Çıkarılan öğrencinin eski yoklamaları silinmez:** öğrenci etütten çıkarılsa da o etütteki geçmiş "gelmedi" kayıtları onun
  "Etütlerim"indeki "Gelmediği günler"de kalır; etüdün yoklama sayfasında artık adı çıkmaz.
- **Çakışma denetimi yok:** aynı öğrenci aynı gün ve saatteki iki etüde de eklenebilir; uyarı çıkmaz. Tasarımda ızgara gösterir.
- **Bildirim yok:** bugün öğrenci eklenince ya da çıkarılınca kimseye bildirim gitmez (tasarımda yeni etüt bildirilir).
- **İşlem kaydı:** her kayıtta okulun işlem kaydına **"Etüdün öğrencileri değişti"** ve "<etüdün adı>: 12 öğrenci" yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Aday listesi oturum boyunca saklanır:** pencere okulun sınıflarını ve öğrencilerini ilk açılışta bir kez yükler; çıkış yapana ya da
  portal değiştirene kadar aynı listeyi kullanır. Bu arada okula eklenen öğrenci ya da sınıfı değişen öğrenci pencerede eski hâliyle
  görünür; tarayıcıyı yenile ya da yeniden gir (üst şeritteki "Yenile" bu listeyi tazelemez). Etüdün **kayıtlı** öğrencileri ise her
  açılışta sunucudan gelir.
- **Nakil:** öğrenci başka okula geçince bu okulun bütün etüt listelerinden kendiliğinden çıkar; buradaki yoklamaları bu okulun kaydı
  olarak kalır ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)). Hesabı silinen öğrenci de listeden düşer.
- **Mezun (tasarım):** yıl geçişinde mezun olan öğrenci etüt listelerinden çıkar ([Mezunlar](../egitim-yili/mezunlar.md)).
- **Bölüm kapalıysa** pencere açılmaz: **"Etütler bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."**
- **Eğitim yılı:** öğrenci listesi yıla bağlı değil; geçmiş yıla bakarken de değiştirilebilir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etütler sayfası](etutler-sayfasi.md) — "Öğrenciler" düğmesi ve satırdaki öğrenci sayısı.
- [Etüt açma](etut-acma.md) — öğrenci seçmeden önceki adım.
- [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md) — silinen etüdün listesi de gider.
- [Boş zaman ızgarası](bos-zaman-izgarasi.md) — tasarımda öğrenciler ızgarayı değiştirir.
- [Etüt yoklaması](etut-yoklamasi.md) — yoklamada bu listedeki öğrenciler çıkar.
- [Etütlerim](etutlerim.md) — seçilen öğrencinin ve velisinin sayfası.
- [Etüt yetkileri ve hazır roller](etut-yetkileri.md), [Etüt bildirimleri](etut-bildirimleri.md).

**İlgili:**

- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Etüdün öğrencileri değişti".
- [Öğrenci nakli](../hesaplar/ogrenci-nakli.md), [Mezunlar](../egitim-yili/mezunlar.md) — listeden kendiliğinden çıkma.
- [Sınıf açma ve düzenleme](../siniflar-dersler/sinif-acma.md) — "Sınıf" süzgecindeki sınıflar.
- [Öğrenciler listesi](../hesaplar/ogrenci-listesi.md) — onaylı öğrenciler.
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `EYLEMLER['etut-ogrenciler']` (`etutAdaylari()` ve
  `GET /api/etut/detay?id=` birlikte; `#etoSinif`, `#etoAra`, `aramaSadeTR` ile süzme), `etutSeciliSay()` (`#etoSayi`),
  `EYLEMLER['etut-gorunenleri-sec']` (`data-deger` 1/0, yalnız görünen satırlar), `EYLEMLER['etut-ogrenci-kaydet']` (bütün işaretliler,
  hata `#etoMesaj`).
- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — `GET /api/etut/adaylar` (onaylı öğrenciler `{ id, ad, sinifId }`,
  sınıflar), `GET /api/etut/detay` (etüdün öğrencileri `{ id, ad, sinif }`), `POST /api/etut/ogrenciler` (`EN_FAZLA_OGRENCI` 300,
  tekilleştirme, okul denetimi, işlem kaydı `etut.ogrenciler`).
- Depo: [sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md) — `ogrencileri` (ada göre), `ogrencileriYaz` (tek işlemde
  sil ve yaz); `etut_ogrencileri` tablosu (şema 013, [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
  [sunucu/veri/depo/ogrenci-gecmisi.md](../../sunucu/veri/depo/ogrenci-gecmisi.md) — `okuldanCikar` (nakilde eski okulun etüt
  listelerinden çıkarma).
- İşlem kaydı adı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`'etut.ogrenciler': 'Etüdün öğrencileri
  değişti'`).
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (öğrenci ekleme, okul dışı öğrenci reddi),
  [testler/test-nakil.md](../../testler/test-nakil.md) (nakilde listeden çıkma), [testler/buton-denetimi.md](../../testler/buton-denetimi.md)
  (`etut-ogrenciler`, `etut-gorunenleri-sec`, `etut-ogrenci-kaydet`).

## Sık sorulanlar

- **Bir sınıfın hepsini tek seferde nasıl eklerim?** "Sınıf"tan sınıfı seç, "Görünenleri seç"e bas, "Kaydet".
- **İki sınıftan öğrenci ekleyebilir miyim?** Evet. Birinci sınıfı seç, işaretle; sonra ikinci sınıfı seç, işaretle; en sonda bir kez
  "Kaydet". Önceki sınıftaki işaretler gizlense de durur.
- **Sınıfı seçtim ama başka sınıftaki öğrenciler gitti mi?** Hayır; süzgeç yalnız görünümü daraltır. Sayaçta bütün işaretliler sayılır.
- **Yeni gelen öğrenci listede yok.** Liste oturum boyunca saklanır; tarayıcıyı yenile ya da çıkıp yeniden gir.
- **Öğrenciyi çıkardım, eski "gelmedi" kaydı ne olur?** Kalır; öğrencinin "Etütlerim"inde görünmeye devam eder.
- **Öğrenci etüde eklendiğini nasıl öğrenir?** Bugün bildirim gitmez; "Etütlerim"de görür. Tasarımda yeni etüt bildirilir.

## Sırada

- Etüt planlama (öneri, 29 Eylül; Tasarım 1 önizlemesi): öğrenci seçimi "Etüt planla" penceresine girecek (sınıf çipleri, en az iki
  harfle arama, "… sınıfının hepsini ekle", seçilenler çip), her eklenen öğrencinin dolu saatleri ızgarada görünecek; yeni etüt
  öğrenciye ve veliye bildirilecek.
- Yıl geçişi: yeni yıl sihirbazında etütler "öğrencisiz ya da atlatılmış sınıflarıyla" yeni yıla taşınabilecek; mezunlar etüt
  listelerinden çıkacak.
- Çalışan olarak ekleme: öğretmen olmayan etüt sorumlusu da öğrenci seçebilecek.
- Çok dil: pencere metinleri çeviri kataloğuna girecek.
