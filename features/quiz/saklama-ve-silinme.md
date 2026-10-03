# Quiz · Saklama ve silinme

**Durum:** Kodda var; tasarımda ek olarak quiz (sorular, şıklar, denemeler, cevaplar) ödevin son teslim anından 1 yıl sonra silinir ve ödevde kısa bir iz kalır; öğrenci ve veli eski yıllardan yalnız son bir geçmiş yılı görür; quizler okul yedeğine, mezunun salt okunur portalına ve "Verilerimi indir"e girer.

Quizin sorularının, öğrencilerin denemelerinin ve cevaplarının ne kadar saklandığı, ne zaman ve neyle birlikte silindiği.

## Ne işe yarar

Quiz cevapları ve çıkış kaydı öğrencinin kişisel verisidir; gerektiğinden uzun saklanmamalıdır. Kullanıcı 27 Eylül'de "quiz ekleri de
silinsin belli süre sonra" dedi; tanımda bu süre 1 yıl olarak yazıldı. Bugün quiz ödevle birlikte durur ve ödevle birlikte silinir.

## Nereden açılır

Ayrı bir ekranı yoktur. Silinmeye yol açan işler:

- **Öğretmen:** "Ödevler" listesinde ödevin satırındaki kırmızı **"Sil"** ile ödevi silmek ([Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md));
  "Ödevi düzenle"de **"Quizi kaldır"** ve **"Kaydet"** ([Ödeve quiz ekleme](quiz-ekleme.md)).
- **Müdür:** sunucu öğretmeni ayrılmış (sahipsiz) ödevi silmeye izin verir, ama müdürün ders ödevleri ekranında ve kontrol ekranında
  silme düğmesi yoktur. Hesap penceresindeki **"Hesabı sil"** yalnız öğretmen ve servisçi hesaplarında çıkar
  ([Hesap penceresi](../hesaplar/hesap-penceresi.md)); bugün öğrenci hesabını silen bir düğme yoktur.
- **Öğrenci hesabının silinmesi:** veritabanı kuralı gereği öğrencinin hesabı silinirse denemeleri ve cevapları da onunla gider
  (aydınlatma metni de böyle yazar); ama bugün ekranda bunun bir yolu yoktur. Ayarlar'daki **"Hesabımı sil"** yalnız yetişkin
  hesabında vardır, okulun açtığı öğrenci hesabında çıkmaz ([Hesabımı sil](../ayarlar/hesabimi-sil.md)).

## Adım adım

### Öğretmen

1. **Ödevi silmek:** ödevi silince ("Bu ödev silinsin mi? Geri alınamaz.") quizi, soruları, şıkları, bütün öğrencilerin denemeleri ve
   cevapları da silinir; geri alınamaz.
2. **Quizi kaldırmak:** "Quizi kaldır" ve "Kaydet" quizi ödevden siler. Bu ancak hiçbir öğrenci başlamadıysa olur (başlayan varsa quiz
   kilitlidir); bu yüzden kaldırılan quizde silinecek öğrenci cevabı olmaz.
3. **Geçmiş yıl:** yıl geçişinden sonra geçmiş yılın quizli ödevleri ve sonuçları yıl seçiciyle salt okunur görülür
   ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).

### Öğrenci ve veli

1. Quiz cevapları ödevle birlikte saklanır; ödev silinince gider. Öğrencinin hesabı silinirse onun denemeleri ve cevapları da
   silinir (bugün ekranda öğrenci hesabını silen bir düğme yok).
2. Bugün öğrenci ve veli geçmiş yılları da yıl seçiciyle görebilir.

### Yönetici

1. Sitenin yedeği quiz tablolarını da içerir (quizler, sorular, şıklar, denemeler, cevaplar); yedekten geri yüklenince quizler de
   döner ([Site yedekleri](../yonetim/yedekler.md)).

Tasarımda:

- **1 yıl kuralı** (Optimizasyon ve saklama süreleri tanımı, kullanıcının 27 Eylül sözüne dayanır): quizin soruları, şıkları, denemeleri
  ve cevapları ödevin son teslim anından (son teslimi yoksa açılışından) **1 yıl** sonra silinir. Ödevin kendisi ve öğretmenin seçtiği
  ödev sonucu kalır; ödevde **"Quiz 1 yıl sonra silindi"** gibi kısa bir iz görünür (listeler ve pencere bozulmasın). Aynı işte
  aydınlatma metni güncellenir.
- **Öğrenci ve veli yalnız son 1 geçmiş yılı görür:** daha eski bir yıl istenirse sunucu açık bir hata verir ("Eski yıllar yalnız okul
  yönetimine açık"); yıl seçicide de gösterilmez. Öğretmen ve müdür bütün yılları görür.
- **Okul yedeği** (yıl geçişi tanımı): müdürün aldığı okul yedeğine quizler (sorular, denemeler, cevaplar) girer; dosyalar girmez
  ([Okul yedeği](../egitim-yili/okul-yedegi.md)).
- **Mezunlar** (yıl geçişi tanımı): mezun öğrencinin o okuldaki portalında eski quiz sonuçları salt okunur kalır
  ([Mezunlar](../egitim-yili/mezunlar.md)).
- **Verilerimi indir** (destek tanımı): kişinin indirdiği verilerde quiz cevapları ve puanları da bulunur
  ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).
- **Eklentiler** (tanım; kullanıcı 2 Ekim'de "kodlanmayacak, belgelenecek" dedi): bir eklentinin değiştirebileceği ayarlar arasında
  quizin saklama süresi de anılır (öneri adı `quiz.saklamaGun`, tanımdaki değeri 1 yıl); süreler en az 7 gün, en çok 1 yıl olabilir
  ([Eklentiler](../eklentiler/README.md)).

## Kurallar ve sınırlar

- **Bugün:** quiz ödevle birlikte saklanır, ödevle birlikte silinir; öğrencinin denemesi ve cevapları öğrencinin hesabıyla birlikte
  silinir. Ayrı bir süre yoktur.
- **Aydınlatma metni** (bugün): quiz cevapları, süreleri ve sekme değiştirme kaydı için "Ödev ya da öğrencinin hesabı silinince silinir."
  Hangi sekmeye ya da uygulamaya geçildiği, ekran görüntüsü, kamera ya da ses alınmaz ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).
- Ödevin teslim dosyalarının silinme kuralı (son teslimden 7 gün sonra) quize uygulanmaz; quiz dosya değil veridir
  ([Teslim dosyalarının saklanması ve silinmesi](../odev/saklama-ve-silinme.md)).
- Silme geri alınamaz; yalnız yönetimin site yedeği eski hâli taşır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — "Quizi kaldır" ve kilit.
- [Sonuçlar ve puan](sonuclar.md), [Çıkış kaydı](cikis-kaydi.md) — saklanan veriler.
- [Listelerde ve ödev penceresinde quiz](listelerde-quiz.md) — silinen quizin izinin görüneceği yer (tasarım).

**İlgili:**

- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).
- [Teslim dosyalarının saklanması ve silinmesi](../odev/saklama-ve-silinme.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Okul yedeği](../egitim-yili/okul-yedegi.md), [Mezunlar](../egitim-yili/mezunlar.md).
- [Site yedekleri](../yonetim/yedekler.md), [Verilerimi indir](../ayarlar/verilerimi-indir.md).

## Kod tarafı

- Veri: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 029: quiz tabloları ödeve bağlı, ödev silinince birlikte
  silinir; deneme ve cevaplar ödevin öğrencisine bağlı), [sunucu/veri/depo/quiz.md](../../sunucu/veri/depo/quiz.md).
- Yedek: [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (quiz tabloları yedeğe girer),
  [testler/test-yedek.md](../../testler/test-yedek.md).
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (ödev silme), [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md)
  (Son durum: saklama süresi planı), [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (aydınlatma metni sürümü).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (ödev silinince quizin gitmesi).

## Sık sorulanlar

- **Ödevi silersem quiz cevapları da gider mi?** Evet; quiz, denemeler ve cevaplar ödevle birlikte silinir, geri alınamaz.
- **Quiz cevaplarım ne kadar saklanıyor?** Bugün ödevle birlikte; ödev ya da hesabın silinince silinir. Tasarımda son teslimden 1 yıl
  sonra silinecek.
- **Quiz silinince ödevin sonucu da gider mi?** Hayır; tasarımdaki 1 yıl kuralında ödev ve öğretmenin seçtiği sonuç kalır, yalnız quiz
  verisi silinir.

## Sırada

- Optimizasyon + saklama süreleri işi: quiz 1 yıl sonra silinecek, ödevde "Quiz 1 yıl sonra silindi" izi; öğrenci ve veli yalnız son 1
  geçmiş yılı görecek; aydınlatma metni aynı işte güncellenecek.
- Yıl geçişi işi: okul yedeği (quizler dahil) ve mezunların salt okunur portalı.
- Destek işi: "Verilerimi indir" (quiz cevapları ve puanları dahil).
