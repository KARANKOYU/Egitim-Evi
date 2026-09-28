# sunucu/yardimci/kufur-suzgeci.js

Açılış sayfası yorumları için küfür ve hakaret süzgeci: kelime listesini depodaki `badwordsfilter.json`'dan okur, metni ve
listeyi aynı sade biçime getirip karşılaştırır.

## Bu dosya ne yapar?

Öğretmen, müdür ya da veli açılış sayfasına yorum yazabiliyor (bkz. [../bolumler/yorum.md](../bolumler/yorum.md)). Yorumlar
herkese açık olduğu için uygunsuz kelime içeren yorum kaydedilmeden reddedilmeli. Ama insanlar süzgeci atlatmak için
"S4LAAAK", "s a l a k" ya da Türkçe harfleri değiştirerek yazar. Bu dosya metni bu hilelere karşı sadeleştirir ve listedeki
kelimelerle karşılaştırır.

Kelime listesi kodda değil, depo kökündeki `badwordsfilter.json` dosyasındadır; dosya değişince sunucuyu yeniden başlatmadan
en geç 30 saniyede yeni liste geçerli olur.

## İçinde neler var?

### Dışa açık işlevler

- **`sadelestir(metin)`** — metni karşılaştırma biçimine getirir. Sırasıyla:
  1. Rakam ve simge harfe çevrilir: `0→o`, `1→i`, `3→e`, `4→a`, `5→s`, `7→t`, `@→a`, `$→s` (2, 6, 8, 9 rakam olarak kalır).
  2. `ı`, `İ`, `I` → `i`.
  3. Unicode NFD ayrıştırması ve birleşen işaretlerin (U+0300–U+036F) atılması: `ş→s`, `ç→c`, `ğ→g`, `ö→o`, `ü→u`, `â→a`…
  4. Küçük harfe çevirme.
  5. `a-z` ve `0-9` dışındaki her şey (noktalama, boşluk dizileri, emoji) tek boşluğa iner.
  6. Art arda aynı harf teke iner: `salaaak → salak`, `yarrak → yarak`. (Rakamlar teke inmez.)
  7. Baştaki/sondaki boşluk kırpılır.

  `null`/`undefined` → `''`. Örnek: `sadelestir('Şu S4LAAAK iş!')` → `'su salak is'`.
- **`uygunsuzKelime(metin)`** — metinde listedeki bir kelime varsa ilk bulunanı (sadeleşmiş hâliyle; günlüğe yazmak için)
  döndürür, yoksa `''`. Hata atmaz.

### Liste nasıl sınıflanır (iç, `listeGuncel`)

Dosyadaki her kelime `sadelestir`'den geçirilir, sonra üç kümeye ayrılır:

- **`tek`** (1–3 harf, ör. "aq" türü kısa kelimeler): yalnız metinde TEK BAŞINA bir kelime olarak geçerse yakalanır. Yoksa
  masum kelimelerin içinde de bulunurdu.
- **`onek`** (4 ve daha uzun harf): metindeki bir kelime bununla BAŞLIYORSA yakalanır — ekli hâller de (`salak → salaklar`).
- **`ikili`** (içinde boşluk olan, birden çok kelimelik ifade): sadeleşmiş metinde bir kelime başından itibaren geçiyorsa
  yakalanır (`' ' + ifade` araması; ifadenin sonu bir kelimenin ortasında bitebilir).

Dosya biçimi: ya düz dizi (`["kelime", ...]`) ya da `{ "kelimeler": [...] }`. Başka bir şeyse liste boş sayılır.

### Önbellek (iç)

- `yoklama` — son dosya denetiminin zamanı; 30 saniye dolmadan dosyaya hiç bakılmaz.
- `zaman` — dosyanın son okunan değişiklik zamanı (`mtimeMs`); değişmediyse yeniden ayrıştırılmaz.
- Dosya yoksa (`statSync` hata verir) liste boşalır: süzgeç hiçbir şeyi yakalamaz.
- Dosya bozuk JSON'sa hata günlüğe yazılır (`badwordsfilter.json okunamadı: …`) ve ESKİ liste kalır.

## Kimle konuşur?

- Çağırdıkları: yalnız Node'un `fs` ve `path` modülleri; `badwordsfilter.json`'u okur (yol: bu dosyadan iki üst klasör, yani
  depo kökü).
- Onu çağıran: [../bolumler/yorum.md](../bolumler/yorum.md) — yorum yazma ucu metni kırpıp, uzunluk ve internet adresi
  denetiminden sonra `uygunsuzKelime` çağırır; bir şey dönerse `islemYaz(me, 'yorum.reddedildi', 'uygunsuz kelime: ' + kotu)`
  ile işlem kaydına yazar ve 400 "Yorumunda uygun olmayan bir kelime var. Düzeltip yeniden gönder." döner. Yorum kaydedilmez.
- Şema dosyası `sunucu/veri/sema/019-yorumlar.sql` yorumunda bu süzgece atıf var; tablo kullanmaz.

## Nasıl çalışır (adım adım)?

```
uygunsuzKelime(metin)
  1. listeGuncel()  — 30 sn geçtiyse dosyanın mtime'ına bak, değiştiyse yeniden oku ve sınıfla
  2. sade = sadelestir(metin); boşsa ''
  3. kelimeler = sade.split(' ')
  4. harf harf yazılmış kısım: art arda en az 3 tek harfli kelime birleştirilip "ekler"e konur
     ("s a l a k" → "salak"; "a q" yalnız 2 harf olduğu için birleşmez)
  5. her kelime ve ek için:  tek kümede mi?  → döner
                             onek'lerden biriyle başlıyor mu? → döner
  6. ' ' + sade + ' ' içinde ' ' + ikili ifade geçiyor mu? → döner
  7. ''
```

## Dikkat!

- Sadeleştirme hem listeye hem metne uygulanır; bu yüzden listeye yazılan kelimenin Türkçe harfli, uzatılmış ya da büyük harfli
  olması fark etmez. Ama çift harfli bir kelime listeye girerken de teke iner; eşleşme bu sade biçimler arasında olur.
- `onek` eşleşmesi kelimenin BAŞINDAN yapılır; 4+ harfli bir liste kelimesiyle başlayan masum bir kelime de yakalanır.
  Listeye kelime eklerken bunu düşün (testte "sık" ve "sıkıntı"nın masum kaldığı ayrıca deneniyor).
- İçinde geçen (başta olmayan) kelimeler yakalanmaz: süzgeç kelime başına bakar.
- Harf harf yazılan kısım birleştirilirken çift harf teke İNDİRİLMEZ: teke indirme `sadelestir` içinde, harfler arasında boşluk
  varken yapılır (`sadelestir('s a a l a k')` → `'s a a l a k'`), birleştirme ondan sonra gelir. Yani "s a a l a k" birleşince
  `saalak` olur ve `salak` ile başlamadığı için yakalanmaz. Kodda bilinen bir boşluk; testte denenmiyor.
- Dönen kelime `onek` ve `ikili` eşleşmesinde metindeki kelime değil, LİSTEDEKİ kelimedir (işlem kaydına o yazılır).
- Dosya silinirse süzgeç sessizce kapanır (liste boş). Bozuk JSON'da ise eski liste korunur — farklı iki davranış.
- Liste ilk `uygunsuzKelime` çağrısında okunur (sunucu açılışında değil); dosyadaki bir değişiklik en geç 30 saniye sonra geçerli
  olur.
- Liste yalnız yorumlar için kullanılır; mesajlar, duyurular, okul sayfası bu süzgeçten geçmez.

## Testleri

- `testler/test-yorum-ek.js` (sunucu ister) — büyük harfli ve uzatılmış kelimenin reddi, harf harf aralıklı yazılan kelimenin
  yakalanması, reddedilen yorumun kaydedilmemesi, "sık"/"sıkıntı" gibi masum kelimelerin geçmesi.
- Sunucusuz birim testi yok; `sadelestir` doğrudan denenmiyor.
- Elle: `node -e "console.log(require('./sunucu/yardimci/kufur-suzgeci').sadelestir('Şu S4LAAAK iş!'))"` → `su salak is`.

## Son durum

- Dosya `28e484d commit 410` (2026-09-26, yorumlar) ile liste okuma ve `sadelestir` olarak geldi; `7daee9c commit 414`
  `uygunsuzKelime`'yi (harf harf yazılanı birleştirme, `tek`/`onek`/`ikili` karşılaştırması) ekledi. O günden beri değişmedi.
- Bilinen açık: `sadelestir` için sunucusuz birim testi yok.
- Sıradaki işlerden "Mesaj ayarları … Bu mesajı bildir" mesajlar için bildirim getiriyor; süzgecin mesajlara uygulanması
  planlanmış değil.
