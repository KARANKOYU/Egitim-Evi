# Eğitim içerikleri · Ana sayfadaki öneri şeridi

**Durum:** Tasarlandı — henüz kodda yok

Giriş yapmış kişinin ana sayfasında son ve önerilen videolardan bir şerit ile "Tümünü gör" bağlantısı; öğrenciye kendi sınıf
düzeyine göre öneri.

## Ne işe yarar

Kullanıcının 28 Eylül isteği: "EBA gibi eğitim içerikleri koymak, ana sayfada içerikler". 29 Eylül'deki istek denetiminde
tanıma eklendi: "Eğitim içerikleri" ana sayfada (giriş yapmış kişinin ana sayfasında son/önerilen videolardan bir şerit +
"Tümünü gör") ve sol menüde ayrı sayfa olur; telefon uygulamasında da aynı. Aynı gün tanıma: "Ana sayfada kişinin sınıf
düzeyine göre öneri."

## Nereden açılır

Giriş yapmış kişinin ana sayfası ([Ana sayfa](../ana-sayfa/README.md)). Şeridin "Tümünü gör" bağlantısı Eğitim içerikleri
sayfasını açar ([Video listesi](video-listesi.md)).

**Tasarım 1 önizlemesinde bu şerit YOK:** ana sayfalarda renkli kutucuklar var, video şeridi yok; eğitim içeriklerine sol
menüden gidiliyor. Aşağıdaki adımlar tanımdan.

## Adım adım

### Öğrenci

1. Ana sayfanda bir şerit: kendi sınıf düzeyinin (ör. 7. sınıf) son ve önerilen videoları, video kartlarıyla (küçük resim,
   süre, başlık, ders, paylaşan) ([Video listesi](video-listesi.md)).
2. Karta basınca video açılır ([İzleme sayfası](izleme-sayfasi.md)).
3. **"Tümünü gör"** Eğitim içerikleri sayfasını açar.

### Veli, öğretmen, çalışan, müdür ve servisçi

1. Ana sayfada aynı şerit son ve önerilen videolarla durur; karta basınca video açılır, "Tümünü gör" listeyi açar.
2. Bu rollerde önerinin neye göre seçileceği (velide çocuğunun sınıfı mı, öğretmende dersi mi) tanımda yazmıyor.
3. Servisçi de giriş yapmış kişidir; tanım şeridi "giriş yapmış kişinin ana sayfasına" koyar. Servisçinin ana sayfası kullanıcının
   1 Ekim isteğiyle ("servisçiye ana sayfa olabilir") tasarlandı ([Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md));
   bugünkü kodda servisçinin ana sayfası servis yoklamasıdır.

## Kurallar ve sınırlar

- Yalnız giriş yapmış kişinin ana sayfasında. Açılış sayfasında (giriş yapmamış ziyaretçiye) bir şerit olup olmayacağı açık
  soruydu (29 Eylül istek denetimi); sonradan karar: ziyaretçi üst şeritteki "Eğitim içerikleri" bağlantısından listeye gider, video girişsiz
  izlenir ([Girişsiz izleme](girissiz-izleme.md)). Açılışa ayrıca şerit konacağına dair karar yok.
- Öğrencide öneri sınıf düzeyine göre: 7-A'daki öğrenciye 7. sınıf videoları.
- Velide her çocuk ayrı oturum olduğundan (3 Ekim kararı) şerit, açık oturumdaki çocuğa göre düşünülmeli (öneri; karar yok).
- Telefon uygulamasında da aynı şerit (tanım).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Video listesi](video-listesi.md) — "Tümünü gör"ün açtığı sayfa ve kartın görünüşü.
- [Sınıf süzgeci](sinif-ve-kademe-suzgeci.md) — sınıf düzeyi.
- [Kaldığın yerden devam](kaldigi-yerden-devam.md) — yarım kalan videolar.

**İlgili:**

- [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md), [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md),
  [Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md), [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md),
  [Rolsüz çalışanın ana sayfası](../ana-sayfa/calisan-ana-sayfasi.md), [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parça: her rolün ana sayfası ve kutucukları,
[public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md).

## Sık sorulanlar

- **Ana sayfamda video şeridi yok.** Bu tasarlanan bir özellik; bugün sitede eğitim içerikleri henüz yok.
- **Şeritteki videolar neye göre?** Öğrencide kendi sınıf düzeyine göre.

## Sırada

- Eğitim içerikleri (iş 17): ana sayfa şeridi.
- Tasarım 1 önizlemesine eklenmesi (HTML işi) ve öğrenci dışındaki rollerde önerinin ölçütü — kullanıcıya sorulacak.
