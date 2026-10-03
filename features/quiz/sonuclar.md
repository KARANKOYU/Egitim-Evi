# Quiz · Sonuçlar ve puan

**Durum:** Kodda var

Quizin puanının nasıl hesaplandığı, sonuçların (puan, cevaplar, doğru cevaplar) öğrenciye ne zaman açıldığı, öğretmenin
"Sonuçları şimdi aç"ı, sonuç bildirimi ve velinin gördüğü.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: öğretmen "hangi soruda yanlış yaptığını vb. kontrol ederken" görür; açık uçlu sorunun "doğru yanlışı
olmaz", "puan vermesin, sadece dursun". Puan otomatik hesaplanır ama yalnız öneridir: ödevin sonucunu (Yaptı, Geç yaptı, Eksik …)
öğretmen yine kendisi seçer. Doğru cevaplar erken açılırsa sınıfta yayılır; bu yüzden öğretmen sonuçların ne zaman açılacağını seçer
ve açılış bir kez olunca geri alınmaz.

## Nereden açılır

- **Öğretmen:** düzenleyicide **"Sonuçlar öğrenciye"** seçimi ([Ödeve quiz ekleme](quiz-ekleme.md)); kontrol ekranında quiz satırındaki
  **"Sonuçları şimdi aç"** ([Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md)).
- **Öğrenci:** quizin bitti ekranı (ödev penceresinde **"Sonucu gör"** ya da **"Quizi aç"**), ödev listesindeki quiz satırı ve sonuç
  bildirimi ([Quiz çözme](quiz-cozme.md)).
- **Veli:** çocuğunun ödev listesi, satır penceresi ve bildirimi ([Listelerde ve ödev penceresinde quiz](listelerde-quiz.md)).

## Adım adım

### Öğretmen

**Ne zaman açılacağını seçmek**

1. Düzenleyicide **"Sonuçlar öğrenciye"**:
   - **"Son teslimden 10 dakika sonra görünsün"** (varsayılan) — son teslim + 10 dakika geçince (o ana kadar bütün denemeler biter)
     bitiren herkese açılır. Ödevin son tarihi yoksa sonuçlar sen açınca ya da ödevi sonuçlandırınca açılır.
   - **"Hemen görünsün (bitirince)"** — her öğrenci kendi quizini bitirince kendi sonucunu görür. Not: "Hemen" seçilirse önce bitiren
     doğru cevapları görür; herkes aynı anda çözmüyorsa cevaplar yayılabilir.
2. Kontrol ekranında quiz satırının alt yazısı seçimi söyler: **"sonuçlar son teslimden 10 dakika sonra açılır"**, **"sonuçları sen açınca
   görünür"** (son tarihsiz ödev), **"öğrenci sonucunu bitirince görür"** (Hemen) ya da açıldıktan sonra **"sonuçlar öğrencilere açık"**.

**Sonuçları şimdi açmak**

3. Kontrol ekranında quiz satırındaki **"Sonuçları şimdi aç"**a bas (sonuçlar açık değilse ve "Ödev sonuçlandırır" yetkin varsa
   görünür).
4. Onay: **"Quiz sonuçları öğrencilere şimdi açılsın mı?"** ve altında **"Bitiren öğrenciler puanlarını ve doğru cevapları görür;
   kendilerine ve velilerine bildirim gider. Henüz başlamamış öğrenciler artık quizi başlatamaz."** Çözmekte olan varsa sonuna:
   **" Çözmekte olan 2 öğrencinin quizi şimdi biter."** (sayı ekranın açıldığı andaki).
5. Onaylayınca düğmede **"Açılıyor..."**; kontrol ekranı yenilenir ve yeşil ileti: **"Quiz sonuçları öğrencilere açıldı; çözmekte olan 2
   öğrencinin quizi bitti; 5 öğrenciye bildirim gitti."** (biten ya da bildirim yoksa o parçalar yazmaz; ör. "Quiz sonuçları
   öğrencilere açıldı.").
6. Açılış kalıcıdır: o andan sonra başlamamış öğrenci quizi başlatamaz, süren denemeler biter (bitiş nedeni "Öğretmen quizi kapattı").

**Ödevi sonuçlandırmak**

7. Kontrol ekranında **"Sonuçlandır ve kaydet"** quizi de kapatır: süren denemeler biter, quizi bitiren varsa sonuçlar açılır ve bu
   açılış kalıcıdır; bitirenlere sonuç bildirimi gider ([Sonuçlandırma](../odev/sonuclandirma.md)).

**Puanı kullanmak**

8. Puan her öğrencinin rozetinde ("Quiz: 8/10") ve cevap ayrıntısında görünür; ödevin sonucunu kutudan sen seçersin. Ödev serisi,
   grafikler ve öğrencinin ödev sonucu yalnız senin seçtiğin sonucu kullanır.

### Öğrenci

1. Quizi bitirince bitti ekranında sonuç açıksa:
   - puan kutusu: **"8/10 (%80)"** ve yanında **"2 açık uçlu soru puanlanmaz"** (puanlı soru yoksa **"Puanlı soru yok"**);
   - **"Cevapların"** başlığı altında her soru: numara, tür (çok doğrulu soruda **"Çoktan seçmeli · birden çok doğru"**), etiket —
     yeşil **"Doğru"**, kırmızı **"Yanlış"** ya da **"Boş"**, açık uçluda gri **"Puanlanmaz"** —, kapandıysa **"Süre doldu"** ya da
     **"Çıkınca kapandı"**, soru metni; şıklarda doğru şık yeşil ve **"Doğru cevap"**, senin yanlış seçimin kırmızı, seçtiğin şıkkın
     yanında **"Senin seçimin"**; açık uçluda yazdığın metin ya da **"Cevap yazılmadı."**
2. Sonuç henüz açık değilse bitti ekranında mavi kutu: **"Puanın ve doğru cevaplar son teslimden 10 dakika sonra (30 Eylül 2026,
   Çarşamba · 17:10) açılır; öğretmenin daha önce de açabilir. Açılınca bildirim gelir."** ya da son tarihsiz ödevde **"Puanın ve doğru
   cevaplar öğretmenin sonuçları açınca görünür; açılınca bildirim gelir."** Bu arada sorular da gösterilmez.
3. Sonuç açılınca bir kez bildirim gelir: **"Matematik dersinden "Oran orantı" quizinin sonucu açıklandı."** Bildirime basınca ödevlerin
   açılır.
4. Ödev listesinde quiz satırı: **"Quiz: bitirdin · 8/10 (%80)"** ya da **"Quiz: bitirdin · sonuç henüz açılmadı"**; ödev penceresinde
   **"Bitirdin · 8/10 (%80) · 2 açık uçlu soru puanlanmaz"** ve **"Sonucu gör"** ([Listelerde ve ödev penceresinde quiz](listelerde-quiz.md)).

### Veli

1. Bildirimin kopyası çocuğunun adıyla gelir: **"Deniz Aydın · Matematik dersinden "Oran orantı" quizinin sonucu açıklandı."**
   ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).
2. Çocuğunun ödev listesinde ve satıra basınca açılan pencerede yalnız durum ve sonuç açılınca puan: **"Quiz: bitirdi · 8/10 (%80)"**.
   Soruları, cevapları, doğru cevapları ve çıkış kaydını görmez.

### Müdür

- Öğretmeni ayrılmış ödevin kontrol ekranında öğretmenle aynı: "Sonuçları şimdi aç", sonuçlandırma, puanlar.
- Bir öğrencinin portalını açınca ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)) veli gibi yalnız durum ve açılınca
  puan görür; öğrencinin portalından bakan öğretmen de öyle.

## Kurallar ve sınırlar

- **Puan:** her puanlı soru (Doğru/Yanlış ve çoktan seçmeli) eşit ağırlıktadır. Seçilen şıklar doğru şıklarla birebir aynıysa doğru;
  kısmi puan yok, fazladan bir yanlış şık puanı sıfırlar; boş soru yanlış sayılır. Açık uçlu soru puana girmez. Yüzde = doğru / puanlı,
  tam sayıya yuvarlanır.
- **Kimin sonucu açık:** öğrencinin kendi denemesi bitmeden asla. "Hemen" seçiliyse bitirince; değilse öğretmen açtıysa, ödev
  sonuçlandıysa ya da (son tarihli ödevde) son teslim + 10 dakika + 3 saniye geçtiyse.
- **Kalıcılık:** bitiren biri doğru cevapları görebildiği an açılış kalıcı olur (öğretmenin açması, sonuçlandırma, son teslimle açılıp
  öğrencinin bakması, dakikalık temizlik ya da "Ödevi düzenle"den önce): son teslim ileri alınsa da sonuçlar kapanmaz, quiz yeniden
  başlatılamaz; "Tekrar aç" da sonuçları kapatmaz ([Süre ve tek deneme](sure-ve-tek-deneme.md)).
- **Doğru şık sızmaz:** doğru bilgisi öğrenciye yalnız kendi denemesi bitip sonucu açılınca gider; ödev listesine, ilerleyiş verisine,
  ödevin kendisine ve veliye hiç gitmez.
- **Bildirim:** her öğrenciye bir kez (tekrar gitmez), velisine kopyası; dakikada bir çalışan iş de açılan sonuçları bildirir.
- **Yetki:** sonuçları açmak "Ödev sonuçlandırır" ister (ödevin dersine göre): yoksa düğme görünmez, ders kapsamı dışında sunucu 403
  "Bu ödevin sonuçlarını açma yetkin yok".
- **Puan yalnız öneridir:** ödev sonucunu, seriyi ve grafikleri değiştirmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md) — rozetler ve öğrenci öğrenci cevap ayrıntısı.
- [Süre ve tek deneme](sure-ve-tek-deneme.md) — sonuçların açılmasının quizi kapatması, "Tekrar aç".
- [Quiz çözme](quiz-cozme.md) — bitti ekranı.
- [Listelerde ve ödev penceresinde quiz](listelerde-quiz.md) — listelerdeki puan ve durum.
- [Soru türleri](soru-turleri.md) — hangi tür puanlanır.

**İlgili:**

- [Sonuçlandırma](../odev/sonuclandirma.md), [Sonuçları düzeltme ve tekrar açma](../odev/sonuclari-duzeltme.md).
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md), [Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md).
- [Ödev serisi](../odev/seri.md), [Ödev sonuçları grafiği](../ilerleyis/odev-grafigi.md) — yalnız öğretmenin seçtiği sonucu kullanır.
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`sonucAcikMi`, `sonucGenelAcik`, `POST …/quiz/sonuc-ac`,
  `sonuclariBildir`, `odevSonuclandi`, `teslimSonuclariniSabitle`, `ogrenciSorusu` — sonuçlu değilse doğru bilgisi yok,
  `ilerleyisOzetleri`), [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (`puanHesapla`),
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (sonuçlandırma → `odevSonuclandi`),
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (öğrenci ve velinin quiz özeti),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirim ve veliye kopya).
- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (`quizPuanMetni`, `quizSonucListesi`, `quizBittiHtml`,
  `quiz-sonuc-ac`, `quizOgretmenSatiri`), [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (veli listesi).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (puan, sonuç görünürlüğü: öğretmen açar, "Hemen", sonuçlandırınca; doğru
  şıkkın sızmaması: soru ucu, ilerleyiş, ödev, veli).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Quiz" bölümü ("Puan", "Sonucun açılması").

## Sık sorulanlar

- **Puanım neden 7/9, quizde 10 soru vardı?** Açık uçlu sorular puanlanmaz; puan yalnız Doğru/Yanlış ve çoktan seçmeli sorulardan çıkar.
- **İki doğrudan birini buldum, yarım puan alır mıyım?** Hayır; kısmi puan yok. Doğruların hepsini seçip yanlış şık seçmemelisin.
- **Sonucumu ne zaman görürüm?** Öğretmenin seçimine göre bitirince ya da son teslimden 10 dakika sonra; öğretmen erken açarsa ya da
  ödevi sonuçlandırırsa o an. Açılınca bildirim gelir.
- **Quiz puanı ödevin sonucu mu?** Hayır; puan yalnız öneridir. Ödevin sonucunu (Yaptı, Eksik …) öğretmen seçer.
- **Velim cevaplarımı görür mü?** Hayır; velin yalnız durumu ve sonuç açılınca puanı görür.
- **Sonuçları erken açtım, geri alabilir miyim?** Hayır; açılış kalıcıdır (doğru cevaplar dağılmış olabilir).

## Sırada

- Android yerel uygulama: öğretmenin sonuç ayrıntısı ve öğrencinin sonuç ekranı uygulamada.
- Arayüz çalışması: Tasarım 1 önizlemesinde öğrencinin açılmış sonuç ekranı ve öğretmenin "Sonuçları şimdi aç" düğmesi çizilmedi;
  bugünkü sitedeki ekranlar kalır.
