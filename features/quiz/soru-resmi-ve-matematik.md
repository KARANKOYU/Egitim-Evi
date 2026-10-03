# Quiz · Soruya fotoğraf ve matematik yazımı

**Durum:** Tasarlandı — henüz kodda yok

Quiz düzenleyicide soru metninin altına gelen matematik düğmeleri (üs, kesir, kök, π, ≤, ≥, ×, ÷) ve soruya fotoğraf ekleme.

## Ne işe yarar

Kullanıcının 28 Eylül akşamı onayladığı "quiz soru düzenleyici" önerisinin iki parçası: "soruya resim, basit matematik yazımı
(üs, kesir, kök)". Matematik öğretmeni "2³ × 2²" ya da "3/4 + 1/8" gibi ifadeleri düz yazı yerine okunur biçimde yazar; geometri
ya da grafik sorusunun şeklini fotoğrafla koyar. Bugün quizde resim ve formül yok; soru metni düz yazıdır.

## Nereden açılır

- **Öğretmen:** "Yeni ödev" ya da "Ödevi düzenle" penceresi → quiz bölümünde **"Quizi düzenle"** → her soru kartında soru metni
  kutusunun hemen altındaki matematik satırı ve aynı satırın sonundaki **"Fotoğraf ekle"** düğmesi (Tasarım 1 önizlemesi).

## Adım adım

### Öğretmen

**Matematik yazımı** (Tasarım 1 önizlemesi)

1. Soru metnini yazarken imleci formülün geleceği yere koy.
2. Soru metni kutusunun altındaki düğmelerden birine bas (üzerine gelince adı görünür):
   - **x²** ("Üs") — imlecin yerine `^2` yazar; `2^3` biçimi üs olur;
   - **a/b** ("Kesir") — `/` yazar; `3/4` biçimi üst üste kesir olur;
   - **√** ("Karekök") — `√()` yazar ve imleci parantezin içine koyar; bir yazı seçiliyken basarsan seçili yazıyı köke alır
     (`√(16)`);
   - **π**, **≤**, **≥**, **×**, **÷** — işaretin kendisini yazar.
3. Metinde üs, kesir ya da kök varsa kutunun altında **"Görünüşü:"** satırı açılır ve ifadenin öğrencide nasıl görüneceğini
   gösterir: `2^3` üst simge, `3/4` kesir çizgili, `√(16)` kök işaretli. Yazdıkça güncellenir.
4. Şıklar da aynı yazımla yazılabilir (`2^5`, `19/15`); düzenleyicinin önizlemesinde ve öğrenci cevaplarının ayrıntısında
   biçimli görünür. Soru bankası listesinde ve "Metinden ekle" önizlemesinde soru metni biçimli görünür.

**Fotoğraf ekleme**

1. Soru kartında **"Fotoğraf ekle"**ye bas; dosya seçici yalnız JPEG, PNG ve WebP gösterir. Fotoğraf olmayan dosya seçilirse kısa
   ileti: **"Yalnız fotoğraf eklenebilir (JPEG, PNG, WebP)."**
2. Seçilen fotoğraf soru metninin altında küçük resim olarak görünür, yanında dosyanın adı ve **"Kaldır"** bağlantısı.
3. **"Kaldır"** fotoğrafı sorudan çıkarır.
4. Fotoğraf [Önizle](onizle.md)'de sorunun metninin altında görünür.

Tanımın (ortak yazı düzenleyicinin fotoğraf kuralları, 1 Ekim) fotoğrafa getirdiği kurallar: fotoğraf yüklenmeden önce
tarayıcıda küçültülür, içindeki gizli bilgiler (konum, tarih, cihaz) silinir, sunucuya ek olarak yüklenir ve okulun disk alanına
sayılır; sunucu fotoğraf adresini yalnız kendi ek adresi olarak kabul eder (dışarıdan resim adresi yok).

### Öğrenci

Quizi çözerken soru metni biçimli görünür (üst simge, kesir, kök) ve fotoğraf soru metninin altında durur. Tasarım 1
önizlemesinde öğrencinin çözme ekranı bu biçimleri henüz göstermiyor (metin düz yazıyla görünüyor); kodlanırken öğrenci ekranı,
sonuç listesi ve öğretmenin cevap ayrıntısı aynı biçimi kullanmalı.

## Kurallar ve sınırlar

- Matematik yazımı "basit"tir (tanımın sözü): üs, kesir, karekök ve birkaç işaret. Tam formül dili yok.
- Biçim yazının kendisinde durur (`^`, `/`, `√( )`); öğrenciye giden metin aynıdır, yalnız gösterilirken biçimlenir.
- Fotoğraf: JPEG, PNG, WebP; soru başına bir fotoğraf (önizlemede). Boyut ve quiz başına fotoğraf sayısı sınırı yapı belgesinde
  belirlenecek (ortak düzenleyici tanımı: "yazı başına fotoğraf sayısı ve boyutu yapi/ belgesinde sınırlanır").
- Fotoğraf okulun disk alanına sayılır ([Okulun dosya alanı](../okul-disk/doluluk.md)); telefonda yüklenmeden önce küçültülür
  ([Yüklemeden önce telefonda küçültme](../okul-disk/telefonda-kucultme.md)).
- Fotoğraf soru metninin bir parçası sayılır: bugünkü soru metni kuralı gibi öğrenciye ancak quizi başlattıktan sonra (soru başına
  sürede yalnız o soru açılınca) gitmeli (öneri; tanımda ayrıca yazılı değil).
- KVKK: fotoğraf kişisel veri taşıyabilir; kodlandığı işte aydınlatma metni ve sürümü güncellenir.
- Soru bankasına kaydedilen soru (önizlemede) fotoğrafsız kaydedilir; bankadan gelen soruya fotoğraf yeniden eklenir
  ([Soru bankası](soru-bankasi.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — kartların bulunduğu düzenleyici.
- [Soru bankası](soru-bankasi.md) — aynı onaylı önerinin üçüncü parçası.
- [Önizle](onizle.md), [Quiz çözme](quiz-cozme.md), [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md) — biçimin göründüğü yerler.

**İlgili:**

- [Fotoğraf ekle](../yazi-yazma/fotograf-ekle.md) — ortak yazı düzenleyicideki fotoğraf ekleme (aynı küçültme ve güvenlik kuralları).
- [Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md) — quiz soru metni de ortak düzenleyiciyi kullanacak.
- [Sunucuda küçültme](../okul-disk/sunucuda-kucultme.md) — yüklenen fotoğrafların sunucuda küçültülmesi (tasarım).
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (`quizAlaniIc`, `quizDuzenSorusu`, `quizSoruHtml`,
  `quizSonucListesi`, "Metinden ekle" ve önizleme değişecek; kod belgesi: "soru metni düz yazı olmaktan çıkınca `esc` ile basılan
  her yer yeniden düşünülmeli"), [public/js/parcalar/04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md)
  (tarayıcıda küçültme), [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) (yükleme).
- Sunucu: [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (doğrulama), [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md)
  (soru metninin öğrenciye gidişi), [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) (fotoğrafın ek olarak yüklenmesi).
- Veri: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (`quiz_sorulari`'na fotoğraf bağı).

## Sık sorulanlar

- **Bugün soruya resim koyabilir miyim?** Hayır; bugün quizde resim ve formül yok.
- **Kesri nasıl yazacağım?** Tasarımda "a/b" düğmesiyle ya da doğrudan `3/4` yazarak; "Görünüşü:" satırı sonucu gösterir.
- **Şıklarda da kesir olur mu?** Evet, aynı yazımla; önizleme ve sonuç ekranlarında biçimli görünür.

## Sırada

- Düzenleyiciler işi (onaylı, 28 Eylül): quiz soru düzenleyicisi — soruya fotoğraf, basit matematik yazımı (üs, kesir, kök),
  soru bankası. Fotoğraf boyutu ve sayısı yapı belgesinde sınırlanacak; KVKK aynı işte.
- Ortak yazı düzenleyicinin soru metninde nasıl matematik satırıyla birleşeceği bu işte belirlenecek.
