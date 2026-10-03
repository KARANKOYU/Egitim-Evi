# Yorumlar · Uygunsuz kelime ve internet adresi süzgeci

**Durum:** Kodda var

Açılış sayfasına gidecek bir yorumda küfür, hakaret ya da internet adresi varsa yorumun hiç kaydedilmeden geri çevrilmesi.

## Ne işe yarar

Yorumlar giriş yapmamış herkesin gördüğü açılış sayfasında durur. Bir ön onay yok (yorum hemen yayına girer), bu yüzden kaba bir söz
ya da reklam bağlantısı oraya hiç ulaşmamalı. Kullanıcının 26 Eylül kararı: yalnız yetişkinler yazar ve depodaki
`badwordsfilter.json` listesindeki bir kelimeyle büyük/küçük harf fark etmeden eşleşen yorum kabul edilmez; listeyi de "sen doldur
biraz" dedi. İnsanlar süzgeci atlatmak için harfi uzatır, rakam koyar, harflerin arasına boşluk ya da nokta koyar; süzgeç bunları
düzleştirip öyle karşılaştırır. İnternet adresi yasağı da reklamı keser.

Süzgecin yakalayamadığını sistem yöneticisi sonradan gizler ([Yorumu gizleme](yorum-gizleme.md)).

## Nereden açılır

- **Yorumu yazan için:** ayrı bir ekranı yok; Ayarlar'daki **"Eğitim Evi hakkında yorumun"** kartında **"Yorumu gönder"** ya da
  **"Yorumu güncelle"**'ye bastığında çalışır ([Yorum yazma](yorum-yazma.md)). Kartın notu önceden uyarır: "Küfür, hakaret ve
  internet adresi kabul edilmez."
- **Kelime listesi:** depo kökündeki `badwordsfilter.json` dosyası. Arayüzden düzenlenmez; sunucuyu işleten kişi dosyayı değiştirir.
  Depo herkese açık olduğu için liste de açıktır.
- **Yönetici için:** yönetim panelinin Yorumlar ekranının açıklaması: "Açılış sayfasında görünen yorumlar. Uygunsuz kelimeler
  badwordsfilter.json ile zaten engellenir; geçeni buradan gizleyebilirsin."

## Adım adım

### Veli, öğretmen ve müdür (yorumu yazan)

1. Yorumunu yaz, **"Yorumu gönder"**'e bas.
2. Metinde internet adresi varsa kırmızı ileti: "Yoruma internet adresi eklenemez."
3. Metinde listedeki bir kelime (ya da onun gizlenmiş bir yazılışı) varsa kırmızı ileti: "Yorumunda uygun olmayan bir kelime var.
   Düzeltip yeniden gönder." Hangi kelimenin yakalandığı sana söylenmez.
4. Yorumun KAYDEDİLMEZ: eski bir yorumun varsa o olduğu gibi kalır, yoksa hiç yorum açılmaz. Kutudaki metin silinmez, düzeltip yeniden
   gönderebilirsin.
5. Her deneme saatlik 10 gönderim hakkından düşer ([Yorum yazma](yorum-yazma.md#kurallar-ve-sınırlar)).

Çalışan ve eğitmen yorum yazabiliyorsa aynı süzgeçten geçer.

Tasarımda (Tasarım 1 önizlemesi): aynı kelime listesi ve aynı kurallar uygulanır; ileti yorum penceresinin içinde, uyarı simgeli
kırmızı kutuda çıkar ve yazmaya başlayınca kaybolur. Pencere kapanmaz.

### Müdür

Okulunun bir öğretmeni ya da müdürü, okulun portalındayken (okul rolüyle girmişken) uygunsuz kelimeli bir yorum gönderirse okulunun
işlem kaydına "Uygunsuz kelimeli yorum reddedildi" satırı düşer; ayrıntısı "uygunsuz kelime: …" (yakalanan kelime), kişinin adı ve
IP adresiyle. "İşlem kaydını görür" yetkisi olan öğretmen de görür ([İşlem kaydı: neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
Yorum metni kayda yazılmaz.

### Yönetici

1. Kişi veli olarak (yetişkin hesabının kendisiyle) yazmışsa kayıt okulsuzdur, yalnız sen görürsün: yönetim panelinde **"İşlem
   Kaydı"** → "Uygunsuz kelimeli yorum reddedildi".
2. Süzgeçten geçen uygunsuz bir yorum görürsen yönetim panelinde **"Yorumlar"** → **"Gizle"** ([Yorumu gizleme](yorum-gizleme.md)).
3. Listeye kelime eklemek ya da çıkarmak için sunucudaki `badwordsfilter.json`'u düzenle. Biçim: `{ "kelimeler": [ … ] }` (bugünkü
   dosyada bir de `aciklama` alanı var) ya da düz bir dizi `[ … ]`. Kelimeyi küçük harfle, Türkçe harfleriyle yazman yeter; süzgeç
   listeyi de düzleştirir. Değişiklik sunucuyu yeniden başlatmadan en geç 30 saniye sonra geçerli olur.

### Ziyaretçi, öğrenci, servisçi

Süzgeçle karşılaşmazlar (yorum yazamazlar); açılışta yalnız süzgeçten geçmiş ve gizlenmemiş yorumları görürler.

## Kurallar ve sınırlar

**Denetim sırası** (ilk takılan iletiyi verir): giriş → yazma hakkı → saatlik sınır → yıldız → uzunluk (3–500) → internet adresi →
uygunsuz kelime.

**İnternet adresi** — şunlardan biri varsa yorum reddedilir (büyük/küçük harf fark etmez):

- `http://` ya da `https://`
- `www.`
- `.com`, `.net`, `.org`, `.tr`, `.io`, `.info`, `.xyz`, `.biz` ile biten bir kelime: "ornek.com", "okul.k12.tr", e-posta adresi
  ("ad@ornek.com") ve Eğitim Evi'nin kendi adresi ("egitimevi.org") da sayılır.
- Bu listede olmayan uzantılar (ör. ".de") yakalanmaz.
- Noktadan sonra boşluk bırakmadan bu uzantılardan biri gelirse ("iyi.Net" gibi) adres sanılır; noktadan sonra boşluk bırak.

**Düzleştirme** — karşılaştırmadan önce hem yorum hem liste aynı biçime getirilir:

1. Rakam ve simgeler harfe çevrilir: 0 → o, 1 → i, 3 → e, 4 → a, 5 → s, 7 → t, @ → a, $ → s (2, 6, 8, 9 rakam kalır).
2. ı, İ, I → i; sonra Türkçe ve aksanlı harfler düzlenir: ş → s, ç → c, ğ → g, ö → o, ü → u, â → a.
3. Hepsi küçük harfe çevrilir.
4. Harf ve rakam dışındaki her şey (noktalama, boşluk dizileri, emoji) tek boşluk olur.
5. Art arda aynı harf teke iner ("güzeeel" → "guzel").

Örnek: "Şu Ç0K GÜZEEEL!" → "su cok guzel".

**Harf harf yazılan kısım** — yan yana en az 3 tek harf birleştirilip ayrıca denenir: "g ü z e l" ya da "g.ü.z.e.l" → "guzel". Yalnız
iki tek harf ("a b") birleştirilmez.

**Eşleşme türleri** (listedeki kelimenin düzleşmiş uzunluğuna göre):

- **1–3 harfli kelimeler** yalnız TEK BAŞINA yazılınca yakalanır; başka bir kelimenin içinde ya da başında geçmeleri sayılmaz (yoksa
  masum kelimeler de yakalanırdı).
- **4 ve daha uzun kelimeler** bir kelimenin BAŞINDA geçince yakalanır; ekli hâller de ("…lar", "…sın") yakalanır.
- **Birden çok kelimelik ifadeler** düzleşmiş metinde bir kelimenin başından itibaren geçince yakalanır.

**Bilinen boşluklar** (bugünkü kod):

- Bir kelimenin ORTASINDA geçen liste kelimesi yakalanmaz (süzgeç kelime başına bakar).
- Hem harf harf aralıklı hem de bir harfi uzatılmış yazım (aralıklı yazıp bir harfi iki kez koymak) yakalanmaz: teke indirme,
  harfler birleştirilmeden önce yapılır; o sırada aralıklı iki aynı harf yan yana olmadığı için teke inmez, birleşen kelimede de
  uzatma kalır.
- Birden çok kelimelik bir ifade bitişik yazılırsa (iki kelime arasına boşluk koymadan) yakalanmaz; ifadeler yalnız aralarında boşluk
  ya da işaret varken eşleşir.
- 4+ harfli bir liste kelimesiyle BAŞLAYAN masum bir kelime de yakalanır; listeye kelime eklerken bunu düşün. Testte "sık" ve "sıkıntı"
  gibi kelimelerin masum kaldığı ayrıca deneniyor.

**Liste dosyası:**

- 30 saniyede bir dosyanın değişme zamanına bakılır; değiştiyse yeniden okunur.
- Dosya silinirse süzgeç sessizce kapanır (hiçbir kelime yakalanmaz). Dosya bozuk JSON olursa sunucu günlüğüne "badwordsfilter.json
  okunamadı" yazılır ve ESKİ liste kullanılmaya devam eder.
- Süzgeç yalnız açılış sayfası yorumlarına uygulanır; mesajlar, duyurular, okul sayfası ve ödevler bu süzgeçten geçmez.

**Kayıt:** reddedilen yorum hiçbir yere kaydedilmez; işlem kaydına yalnız yakalanan kelime düzleşmiş biçimiyle yazılır (4+ harfli
kelimede ve ifadede metindeki ekli hâli değil, listedeki kelime). Okul
rolüyle gönderildiyse okulun kaydına, yetişkin hesabıyla gönderildiyse yalnız yöneticinin kaydına düşer.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yorumlar](README.md)):

- [Yorum yazma](yorum-yazma.md) — bütün hata iletilerinin tablosu.
- [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md) — değiştirmede de aynı süzgeç.
- [Yorumu gizleme (yönetici)](yorum-gizleme.md) — süzgeçten geçen uygunsuz yorum için.
- [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md), [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md).

**İlgili:**

- [İşlem kaydı: neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Uygunsuz kelimeli yorum reddedildi".
- [İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md) — süzme ve kimin gördüğü.
- [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md) — hakaret, tehdit, ayrımcılık yasağı ve yazdığın yorumdan senin
  sorumlu olman.

## Kod tarafı

- Süzgeç: [sunucu/yardimci/kufur-suzgeci.md](../../sunucu/yardimci/kufur-suzgeci.md) — `sadelestir(metin)` (düzleştirme),
  `uygunsuzKelime(metin)` (`tek` / `onek` / `ikili` kümeleri, harf harf birleştirme), 30 saniyelik dosya yoklaması.
- Bölüm: [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) — `BAGLANTI` deseni, ret sırası, `islemYaz(me,
  'yorum.reddedildi', 'uygunsuz kelime: …')`.
- İşlem kaydı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) — "Uygunsuz kelimeli yorum reddedildi" adı;
  yetişkin hesabının işlemi okulsuz yazılır.
- Kelime listesi: depo kökündeki `badwordsfilter.json` (bu belgede kelimeler yazılmaz).
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) — büyük harfli ve uzatılmış kelime, harf harf aralıklı yazım,
  reddedilen yorumun kaydedilmemesi, "www.reklam.com" reddi, masum kelimelerin geçmesi. Süzgecin sunucusuz birim testi yok.

## Sık sorulanlar

- **Hiç kötü kelime yazmadım ama "uygun olmayan bir kelime var" dedi.** Kelimelerinden biri listedeki 4+ harfli bir kelimeyle
  başlıyor olabilir. Farklı bir kelime seç. Listeyi okulun değil Eğitim Evi'nin sistem yöneticisi tutar; yanlış yakalanan kelimeyi
  ona bildir (bugün sitenin alt bilgisindeki iletişim adresinden; tasarımda destek talebiyle — [Destek sayfası](../destek/destek-sayfasi.md)).
- **Hangi kelime yakalandı?** Ekran söylemez. Kelime yalnız işlem kaydında görünür: veli olarak yazdıysan yalnız sistem yöneticisi,
  okul portalından yazdıysan okulunun işlem kaydını görenler (müdür ve "İşlem kaydını görür" yetkisi olanlar) de görür.
- **Okulumuzun sitesinin adresini yazabilir miyim?** Hayır; hiçbir internet adresi (Eğitim Evi'ninki de) kabul edilmez.
- **Mesajlarda da bu süzgeç var mı?** Hayır; yalnız açılış sayfası yorumlarında.

## Sırada

- Süzgecin mesajlara ya da başka metinlere uygulanması planlanmadı. Bu mesajı bildir (Mesaj ayarları işi) mesajlar için ayrı bir yol
  getirecek.
- Çok dil: hata iletileri çeviri kataloğuna girecek; kelime listesi Türkçe kalır.
