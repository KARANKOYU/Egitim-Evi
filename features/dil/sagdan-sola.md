# Dil ve çeviri · Sağdan sola diller

**Durum:** Tasarlandı — henüz kodda yok

Arapça, Farsça, İbranice gibi sağdan sola yazılan bir dil seçilince sayfa aynalanır: menü sağ kenara geçer, yazılar sağdan
başlar.

## Ne işe yarar

Tanıma göre Türkiye'deki yabancı uyruklu öğrencilerin büyük bölümü Arapça konuşuyor; bu yüzden Arapça hazır diller arasında
önerildi ve sağdan sola desteğinin çeviri altyapısıyla **baştan** kurulması kararlaştırıldı. Sonradan eklemek, bütün ekranların
görünümünü yeniden elden geçirmek demek.

## Nereden açılır

- [Dil seçici](dil-secici.md)'de sağdan sola dilin satırında oranın yanında **"· sağdan sola"** yazar (Tasarım 1'de
  "%41 çevrildi · sağdan sola"). O dili seçmek sayfayı çevirir.
- Çeviri panelinin **"Dil ekle"** penceresinde sağdan sola diller **"sağdan sola"** notuyla işaretlidir (Tasarım 1'de فارسی)
  ([Dil ekleme ve .po](dil-ekleme-ve-po.md)).
- Telefon uygulamasında: [Uygulamada dil](uygulamada-dil.md).

## Adım adım

### Sağdan sola dil seçen herkes

Ziyaretçi, öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, yönetici ve destek için aynı:

1. Üst şeritteki **"TR ▾"**ye bas, listede **العربية** (AR) satırına bas.
2. Kısa ileti çıkar: **"العربية seçildi · %41 çevrildi · sayfa sağdan sola"**. Düğmede "AR ▾" yazar.
3. Sayfa sağdan sola döner: sol menü **sağ** kenara geçer; geniş ekranda (1100 piksel ve üstü) içerik de ona göre sola kayar.
   Telefonda menü düğmesiyle açılan panelin de sağ kenardan kayarak açılması beklenir (Tasarım 1'de menü yalnız sağa alındı,
   kayma yönü ayrıca ele alınmadı).
4. Çevrilmiş yazılar Arapça, henüz çevrilmemiş yazılar Türkçe görünür; yön yine sağdan soladır. Kişi ve okul adları, ödev ve mesaj
   metinleri yazıldıkları gibi (çoğunlukla Türkçe) kalır ([Neler çevrilir](ceviri-kapsami.md)).
5. Türkçeye (ya da başka bir soldan sağa dile) dönünce sayfa eski yönüne döner.

**Tasarımda (Tasarım 1 önizlemesi):** Arapça seçilince sayfanın yönü (`dir="rtl"`) ve dili değişir; yalnız menünün yeri ve
içeriğin boşluğu aynalanır, yazılar Arapçaya çevrilmez. Öbür ekran parçalarının sağdan sola görünümü önizlemede gözden
geçirilmedi.

### Yazı yazanlar

Öğretmen, müdür, çalışan, veli, öğrenci — yazı düzenleyiciyle yazan herkes:

1. Seçtiğin dil sağdan sola olsa da yazdığın ödev, mesaj ya da duyuru çevrilmez; okuyan kendi diliyle değil senin yazdığınla görür.
2. Düzenleyicinin sağdan sola yazıdaki yönü ve "sola yasla / sağa yasla" düğmelerinin anlamı tanımda yazmıyor
   ([Hizalama](../yazi-yazma/hizalama.md)).
3. Düzenleyici bugünkü tasarımda yön işaretlerini (U+200E, U+200F, U+202A–U+202E, U+2066–U+2069) siliyor; bu karakterler karışık
   yönlü yazıyı (Arapça içinde Türkçe kelime gibi) düzgün göstermek için bazen gerekir. Kodlanırken sağdan sola yazıyla denenmeli
   ([İzinli ve izinsiz kod](../yazi-yazma/izinli-ve-izinsiz-kod.md)).

### Çevirmen ve yönetici

1. [Çeviri paneli](ceviri-paneli.md)'nde sağdan sola dilin sütun başlığı (ör. "العربية") ve o sütunun hücreleri sağdan sola
   yazılır; Türkçe sütun ve öbür diller soldan sağa kalır.
2. Dil kartlarında sağdan sola dilin adı da sağdan sola yazılır.
3. Yeni dil eklerken **"Dil ekle"** penceresinde sağdan sola diller **"sağdan sola"** notuyla durur; eklenen dil seçicide
   kendiliğinden "· sağdan sola" olarak işaretlenir.

## Kurallar ve sınırlar

- **Hangi diller:** tanımda Arapça, Farsça ve İbranice. Tasarım 1'de dil seçicide العربية, "Dil ekle" listesinde فارسی sağdan
  soladır.
- **Nasıl:** sayfanın kökü `<html dir="rtl">` olur; görünüm kuralları sola/sağa yerine mantıksal özelliklerle yazılır
  (`margin-inline-start` gibi: "satırın başı" sağdan sola dilde sağ, soldan sağa dilde sol olur). Bunun için bütün görünüm
  dosyalarının gözden geçirilmesi gerekir (aşağıda "Kod tarafı").
- **Simgeler:** yön bildiren simgeler aynalanır; tanımda adıyla geçen çıkış simgesi ("Sağdan sola dillerde simge aynalanır").
  Geri/ileri okları ve "Ana siteye dön" okunun da aynalanıp aynalanmayacağı kodlanırken bakılmalı
  ([Geri, ileri ve ev düğmeleri](../menu-ve-arama/geri-ileri-ve-ev.md), [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).
- **Karışık yön:** Türkçe kalan adlar sağdan sola sayfada yerinden kaymasın diye ayrı yön kutusuyla yazılmalı; Tasarım 1'de çeviri
  tablosunun başlığında dil adları `<bdi>` içinde.
- **Çoğul:** Arapçanın altı çoğul biçimi var; tanım bunu basit bir sayı kuralıyla seçmeyi öngörüyor ([Çeviri paneli](ceviri-paneli.md)).
- **Telefon uygulaması:** Android'in sağdan sola desteğiyle (başlangıç/bitiş yerleşimi) ([Uygulamada dil](uygulamada-dil.md)).
- **Tanımda yazmayanlar:** sayıların ve tarihlerin sağdan sola sayfada nasıl yazılacağı; tablo sütunlarının sırasının da dönüp
  dönmeyeceği.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Dil seçici](dil-secici.md) — sağdan sola dilin seçildiği yer.
- [Çeviri paneli](ceviri-paneli.md), [Dil ekleme ve .po](dil-ekleme-ve-po.md) — sağdan sola sütun ve dil ekleme.
- [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md) — Arapçanın neden önerildiği.
- [Uygulamada dil](uygulamada-dil.md) — Android'de sağdan sola.

**İlgili:**

- [Hizalama](../yazi-yazma/hizalama.md), [İzinli ve izinsiz kod](../yazi-yazma/izinli-ve-izinsiz-kod.md) — düzenleyicide yön.
- [Sol menü](../menu-ve-arama/sol-menu.md), [Telefonda menü](../menu-ve-arama/telefonda-menu.md) — aynalanan menü.
- [Çıkış yap](../giris-hesap/cikis-yap.md) — aynalanan çıkış simgesi.

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı yerler:

- Görünüm: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) — bugün CSS parçalarında yön bildiren fiziksel özellik
  (`margin-left`, `padding-right`, `left:`, `text-align: left`, `border-left`…) yüzün üstünde yerde geçiyor; yöne bağlı mantıksal
  karşılığı (`margin-inline-start` gibi) hiç kullanılmıyor. Tek mantıksal özellik `29-dis-sayfalar.css`'teki iki yanı eşit
  `margin-inline` (yönden etkilenmez).
- Sayfanın kökü `public/index.html` (`<html lang="tr">`) ve düz sayfalar ([public/KLASOR.md](../../public/KLASOR.md),
  [public/js/belge.md](../../public/js/belge.md)).
- Simgeler: [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md).
- Telefonda menü paneli: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).
- Tasarım 1 önizlemesinde sağdan sola kuralları yalnız iki satır: menü sağa (`[dir=rtl] .menu`, her genişlikte) ve geniş ekranda
  içeriğin sağ boşluğu (`[dir=rtl] main`, 1100 piksel ve üstü).

## Sık sorulanlar

- **Arapça seçtim, sayfanın bir kısmı hâlâ Türkçe.** O yazılar henüz Arapçaya çevrilmemiş; yön yine sağdan sola olur.
- **Menü neden sağa geçti?** Sağdan sola dillerde sayfanın başı sağ taraftır; menü de oraya geçer.
- **Türkçeye nasıl dönerim?** Üstteki "AR ▾"ye bas, "Türkçe"yi seç.

## Sırada

- Çok dil işi (22): sağdan sola desteği altyapıyla birlikte; CSS parçalarının mantıksal özelliklere geçirilmesi.
- Android yerel uygulama işi: başlangıç/bitiş yerleşimi.
- Kodlanmadan önce netleşecekler: düzenleyicinin sağdan sola davranışı, yön işaretlerinin silinmesi, okların aynalanması, sayı ve
  tarih yazımı.
