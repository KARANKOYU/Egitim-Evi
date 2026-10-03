# Dil ve çeviri · Uygulamada dil (Android)

**Durum:** Tasarlandı — henüz kodda yok

Eğitim Evi'nin Android uygulaması sitenin çeviri kataloğunu kullanır: Ayarlar'daki dil seçiciyle seçilen dilde açılır, sağdan
sola dilleri destekler, hukuki metinleri Türkçe gösterir.

## Ne işe yarar

Kullanıcı 29 Eylül'de çok dil kararlarını verirken ayrıca hatırlattı: "android unutma". Uygulama yerel (native) yazıldığı için
sitenin çevirisi ona kendiliğinden geçmez; aynı kataloğu kullanması, bir yazının sitede ve telefonda aynı çevrilmesini sağlar.

## Nereden açılır

- Uygulamanın alt çubuğundaki **"Ayarlar"** → dil seçici (tanıma göre: dil kodu ve çevrilme oranı, sitedekiyle aynı biçim).
  Seçicinin Ayarlar'daki yeri ve satırın adı tasarlanmadı; bugünkü Ayarlar'ın bölümleri için
  [Android uygulaması](../uygulama/android-uygulamasi.md).
- Bugün uygulamada dil seçimi yok; uygulama yalnız Türkçe.

## Adım adım

### Uygulamayı kullanan herkes

Uygulamaya giren herkes için aynı. Bugün alt çubuktaki üç sekme (Ana sayfa, Bildirimler, Ayarlar) herkese aynıdır; uygulama
tanımındaki rol ekranları öğrenci, veli, öğretmen, müdür ve servisçi için yazıldı, rolsüz çalışanın ve eğitmenin ekranları
belirlenmedi ([Android uygulaması](../uygulama/android-uygulamasi.md#çalışan-ve-eğitmen)). Ayarlar herkeste olduğu için dil
seçici de herkeste olur:

1. **"Ayarlar"**a dokun, dil seçiciye gir.
2. Dilleri kodları ve oranlarıyla görürsün (sitedeki [Dil seçici](dil-secici.md) gibi). Birini seç.
3. Uygulama o dilin kataloğunu indirir ve telefonda saklar; ekranlar seçtiğin dille yeniden açılır. Bir sonraki açılışta katalog
   önbellekten gelir.
4. Sağdan sola bir dil seçtiysen ekranlar aynalanır ([Sağdan sola diller](sagdan-sola.md)).
5. Sunucudan gelen hata iletileri de seçtiğin dilde gelir.
6. "Aydınlatma metni" gibi hukuki metinler seçtiğin dil ne olursa olsun Türkçe açılır.
7. Kişilerin yazdıkları (ödev, mesaj, duyuru) çevrilmez ([Neler çevrilir](ceviri-kapsami.md)).

### Yönetici ve destek

Uygulamada yöneticiye özel ekran yok; çeviri paneli yalnız sitede ([Çeviri paneli](ceviri-paneli.md)). Uygulamada başka bir
oturumla (ör. veli) giriyorsan dil herkesteki gibi seçilir.

## Kurallar ve sınırlar

- **Aynı katalog:** uygulama sitenin çeviri kataloğunu kullanır; ayrı bir uygulama çevirisi yok. Çeviri panelinde düzeltilen bir
  yazı uygulamaya da gelir (katalog sürümü yenilenince).
- **İndirme ve önbellek:** açılışta seçili dilin kataloğu (dosya) indirilir ve önbelleğe alınır.
- **Sağdan sola:** Android'in sağdan sola desteğiyle (başlangıç/bitiş yerleşimi).
- **Hukuki metinler Türkçe kalır.**
- **Sunucu iletileri** uygulamanın seçili diliyle gelir.
- **Seçim:** tanıma göre dil tercihi hesapta saklanır ([Dil seçici](dil-secici.md#kurallar-ve-sınırlar)); sitede seçilen dilin
  uygulamaya da gelip gelmeyeceği, uygulamanın ilk açılışta telefonun dilini mi alacağı tanımda ayrıca yazmıyor.
- **Bugün:** uygulama yalnız Türkçe. Telefonun ayarlarında sağdan sola desteği (`android:supportsRtl="true"`) zaten açık, ama
  ekranlar Java koduyla kurulduğu için (XML ekran düzeni yok) başlangıç/bitiş yerleşimi kod içinde gözden geçirilmeli. Tarih ve
  saat biçimleri Türkçe yerel ayarla sabit yazılıyor ("d MMMM" gibi).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Dil seçici](dil-secici.md) — sitedeki seçici; uygulamadaki onun eşi.
- [Sağdan sola diller](sagdan-sola.md), [Neler çevrilir, neler çevrilmez](ceviri-kapsami.md).
- [Çeviri paneli](ceviri-paneli.md) — kataloğun yazıldığı yer.

**İlgili:**

- [Android uygulaması](../uygulama/android-uygulamasi.md), [Uygulama ve indirme](../uygulama/README.md).
- [Kendini güncelleme](../uygulama/kendini-guncelleme.md) — yeni sürümle gelen değişiklikler.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

Bugün kodda yok.

- **Android deposu** (ayrı depo, `KARANKOYU/Egitim-Evi-App`; her Java dosyasının yanında aynı adlı `.md`): `AyarlarSayfasi.md`
  (dil seçicinin gireceği ekran), `Zaman.md` (tarih ve saat biçimleri bugün Türkçe yerel ayarla), `Arayuz.md` ve `Tema.md` (ekran
  parçaları, büyük harf çevirisi Türkçe yerel ayarla), `Api.md` (sunucu iletileri). `AndroidManifest.xml`'de
  `android:supportsRtl="true"` açık; `strings.xml`'de yalnız uygulamanın adı var, ekran yazıları Java kodunda.
- **Site deposu:** kataloğun sunulacağı uç ve sunucu iletilerinin dili [sunucu/http.md](../../sunucu/http.md); uygulamanın oturumu
  [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md).

## Sık sorulanlar

- **Uygulama İngilizce olabilir mi?** Bugün hayır; tasarımda Ayarlar'daki dil seçiciyle.
- **Sitede çevrilen bir yazı uygulamada da çevrilir mi?** Evet; ikisi aynı kataloğu kullanır.
- **İnternet yokken dil değişir mi?** Seçili dilin kataloğu telefonda saklandığı için açılışta kullanılır; yeni bir dili seçmek için
  kataloğu indirmek gerekir.

## Sırada

- Android yerel uygulama işi (sıradaki işler listesinde 10): Ayarlar'da dil seçici, katalog indirme ve önbellek, sağdan sola
  yerleşim.
- Çok dil işi (22): uygulamanın kullanacağı katalog ve uç.
- Kodlanmadan önce netleşecekler: seçicinin Ayarlar'daki yeri; ilk açılışta telefonun dili mi hesaptaki dil mi.
