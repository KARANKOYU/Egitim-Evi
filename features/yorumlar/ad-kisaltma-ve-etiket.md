# Yorumlar · Adın kısaltılması ve rol etiketi

**Durum:** Kodda var

Açılıştaki yorumun altında tam adın yerine kısaltılmış adın ("De. Ka."), baş harfli renkli bir yuvarlağın ve "Öğretmen, veli" gibi
bir rol etiketinin görünmesi.

## Ne işe yarar

Yorumlar herkese açık bir sayfada durur; giriş yapmamış herkes okur. Yazanın tam adı orada görünmemeli, ama yorumun gerçek bir
kullanıcıdan geldiği de anlaşılmalı. Kullanıcının 26 Eylül isteği: ad ve soyadın ilk iki harfi, iki isimliyse isimlerin baş harfi;
profil fotoğrafı yerine de baş harfler ("Fotoğraf yerine baş harfler"). Etiket, yorumu yazanın Eğitim Evi'ni hangi gözle
kullandığını söyler (veli mi, öğretmen mi, müdür mü). Okulun adı yazılmaz.

## Nereden açılır

Ayrı bir ekranı yok; üç yerde görünür:

- **Açılış sayfasındaki yorum kartının altı:** baş harfli yuvarlak, kalın kısaltılmış ad ("De. Ka."), altında küçük yazıyla etiket ve
  tarih: "Veli · 24 Eylül 2026, Perşembe" ([Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md)).
- **Ayarlar'daki yorum kartının notu:** "Açılış sayfasında **De. Ka. · Veli** olarak görünür; adın tam yazılmaz. Küfür, hakaret ve
  internet adresi kabul edilmez." ([Yorum yazma](yorum-yazma.md)). Tasarımda aynı not yorum penceresinin üstünde.
- **Yöneticinin Yorumlar ekranı:** her satırda yuvarlak, "De. Ka. · Veli" ve yıldızlar ([Yorumu gizleme](yorum-gizleme.md)).

## Adım adım

### Veli, öğretmen ve müdür (yorumu yazan)

1. Ayarlar'da yorum kartını aç; üstteki not kısaltılmış adını ve etiketini o anki hâliyle gösterir.
2. Yorumunu gönder: kısa ad ve etiket o an hesaplanıp yorumla birlikte saklanır.
3. Sonradan adını değiştirirsen ([Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)), yeni bir okulda rol alırsan ya da çocuğunu
   eklersen açılıştaki yorum ESKİ ad ve etiketle kalır. Güncellemek için Ayarlar'da **"Yorumu güncelle"**'ye bas (metni değiştirmen
   gerekmez; [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md)).

### Çalışan ve eğitmen

Bugünkü kodda ek görevli çalışan öğretmen hesabıyla çalıştığı için etiketi "Öğretmen" olur; özel rolün adı (Müdür Yardımcısı, Rehber
Öğretmen …) etikete girmez. Eğitmen rolü (tasarım) de etikete girmez. Tasarımda (çalışan tanımı) öğretmen olmayan çalışan
öğretmenden ayrı tutulur; bu yüzden "Öğretmen" etiketi yalnız öğretmen görevi verilen çalışana uyar. Tanım yorum etiketi için
ayrıca bir şey söylemiyor (açık nokta, aşağıda "Sırada").

### Ziyaretçi (okuyan)

Yorumun altında yalnız kısa adı, etiketi ve tarihi görürsün. Kimin yazdığını, hangi okulda olduğunu ya da kullanıcı adını göremezsin;
açılışa giden veride kişinin kimliği ve hesap numarası hiç yoktur.

### Yönetici

Yorumlar ekranında da yalnız kısa ad ve etiket var; yazanın tam adını ve kullanıcı adını bu ekranda göremezsin. Tasarımda kişi
sayfası (`/users/<kullanıcı adı>`) yorumu kişinin kendisiyle birlikte gösterir ([Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md)).

## Kurallar ve sınırlar

**Ad kısaltma** — hesaptaki "Ad Soyad" boşluklara göre parçalanır (fazla boşluk önemsenmez); SON parça soyad sayılır:

| Hesaptaki ad | Açılışta görünen | Kural |
|---|---|---|
| Deniz | De. | Tek kelime: ilk iki harf ve nokta |
| Deniz Kaya | De. Ka. | Bir ad + soyad: adın ve soyadın ilk iki harfi |
| Ayşe Nur Kaya | A. N. Ka. | İki ve daha çok ad: her adın baş harfi, soyadın ilk iki harfi |
| Mehmet Ali Can Demir | M. A. C. De. | Aynı kural |
| ilker ışık | İl. Iş. | Türkçe büyük harf: i → İ, ı → I |
| ÇAĞLA YILMAZ | Ça. Yı. | İlk harf büyük, ikincisi küçük |

- Kısa ad en çok 40 karakter olabilir (veritabanı sınırı).
- Kısa ad, yorumun kaydedildiği an hesabın (yetişkin ana hesabın) adından yapılır; okul portalındaki görünen adın değil.

**Baş harfli yuvarlak** — kısa adın ilk parçasının ve son parçasının ilk harfi: "De. Ka." → "DK", "A. N. Ka." → "AK", tek kelimede
yalnız ilk harf ("De." → "D"). Rengi sekiz renklik sabit bir paletten, kısa ad ile etiketin birleşimine göre seçilir: aynı kısa ad
ve etiket hep aynı rengi alır (kısa adı aynı iki kişi de aynı rengi alabilir; etiketi değişen kişinin rengi değişir). Fotoğraf
yüklenmez (kullanıcının kararı). Tasarım 1 önizlemesinde yuvarlağın rengi hesabın kendi rengidir.

**Rol etiketi** — yetişkin hesabın bütün okullardaki rollerine ve çocuklarına bakılır:

- Herhangi bir okulda ONAYLI müdür rolü → "Müdür"
- Herhangi bir okulda ONAYLI öğretmen rolü → "Öğretmen"
- En az bir bağlı çocuk → "Veli"
- Sıra hep Müdür, Öğretmen, Veli; ilk kelime büyük harfle, ötekiler küçük, virgülle: "Müdür, öğretmen, veli", "Öğretmen, veli",
  "Müdür, veli".
- Hiçbiri yoksa etiket olmaz ve yorum da yazılamaz ([Yorum yazma](yorum-yazma.md#kurallar-ve-sınırlar)).
- Etiket en çok 60 karakter (veritabanı sınırı); bugünkü en uzun etiket 21 karakter.
- Etiket de yazıldığı an saklanır; rol ya da çocuk değişince yorum yeniden kaydedilene kadar eski kalır.

**Tarih** — etiketin yanında yorumun SON değişikliğinin tarihi, "24 Eylül 2026, Perşembe" biçiminde (yönetici ekranında "24.09.2026
14:05").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yorumlar](README.md)):

- [Yorum yazma](yorum-yazma.md) — kısa adın ve etiketin önceden gösterildiği kart.
- [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md) — kısa adı ve etiketi tazelemenin yolu.
- [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md) — göründükleri yer.
- [Uygunsuz kelime ve internet adresi süzgeci](uygunsuz-kelime-suzgeci.md), [Yorumu gizleme (yönetici)](yorum-gizleme.md).

**İlgili:**

- [Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md) — ad soyadı değiştirme.
- [Çocuklarım](../portallar/cocuklarim.md) — "Veli" etiketini getiren bağ.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) ve [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) — "adın
  kısaltması ("Ay. Ka.") ve rolü herkese açık görünür; tam ad gösterilmez".

## Kod tarafı

- Sunucu: [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) — `adKisalt(tamAd)` ve `buyukBas` (Türkçe büyük/küçük harf),
  `yazarBilgisi(me)` (etiket: onaylı `principal` → "Müdür", onaylı `teacher` → "Öğretmen", çocuk → "Veli"); açılış listesi yalnız
  `adKisa`, `rol`, `yildiz`, `metin`, `tarih` taşır.
- Depo ve tablo: [sunucu/veri/depo/yorumlar.md](../../sunucu/veri/depo/yorumlar.md) — `ad_kisa` (≤ 40) ve `rol` (≤ 60) sütunları
  yazıldığı anda saklanır; rollerin ve çocukların okunması [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md)
  (`rolleri`, `cocuklari`).
- Ön yüz: [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) — `avatar(ad, anahtar)` ve `basHarfler`
  (renk anahtarı `adKisa + rol`), `tarihGun` ve `tarihSaat`; [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md)
  (açılıştaki kart altı), [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar'daki not).
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) — öğretmenin adının kısaltılması, müdürün yorumunda `adKisa`
  ve "Müdür" etiketi, açılış listesinde `id` ve `hesapId` olmaması.

## Sık sorulanlar

- **Adımı değiştirdim, açılışta eskisi yazıyor.** Kısa ad yorum kaydedildiğinde saklanır; Ayarlar'da "Yorumu güncelle"'ye bas.
- **Etiketimde okulumun adı neden yok?** Yorum Eğitim Evi hakkındadır, okul hakkında değil; okul adı mahremiyet için yazılmaz.
- **Müdür Yardımcısıyım, etiketim neden "Öğretmen"?** Özel rollerin adı etikete girmez; bugün ek görevliler öğretmen hesabıyla
  çalışır.
- **Fotoğrafımı koyabilir miyim?** Hayır; kullanıcının kararıyla fotoğraf yerine baş harfler gösterilir.

## Sırada

- Çalışan olarak ekleme: rolsüz çalışan için etiket ve yazma hakkı karara bağlanmalı ("Öğretmen" etiketi yalnız öğretmen görevi
  olana).
- Çok dil: "Müdür", "Öğretmen", "Veli" etiketleri bugün yazıldığı anda Türkçe saklanıyor; çeviri işinde etiketin dile göre
  gösterilmesi ayrıca ele alınmalı (tanımda karar yok).
