# sunucu/yardimci/bulanik-arama.js

Okul adı arama motoru: büyük/küçük harfe, Türkçe harflere, yazım hatasına, kısaltmaya ve bitişik yazıma dayanıklı; sonuçları
puanlar, düzeltilen kelimeyi söyler ve ekranda koyu yazılacak kelimeleri işaretler.

## Bu dosya ne yapar?

Kayıt olan veli ya da öğretmen okulunu MEB listesinden (yaklaşık 67 bin okul) bulmalı. İnsanlar okul adını her türlü yazar:
"RENK", "rReNk", "ataturk ortaoklu", "AİHL", "ahmetvefikpasa". Bu dosya hepsinden doğru okulu bulmaya çalışır:

- Harf büyüklüğü ve Türkçe harfler fark etmez (`ö/ç/ş/ğ/ü/ı` yazılmasa da bulur).
- Kelimeler sırasızdır; her kelime okulun adında (ya da il/ilçesinde) geçmelidir.
- Yarım kelime baş kısmından tutar ("orta" → "Ortaokulu").
- Yazım hatası hoş görülür: 4–6 harfli kelimede 1, 7 ve daha uzununda 2 harf farkı (eksik, fazla, yanlış ya da yer
  değiştirmiş harf). Ama yalnız kelime hiçbir okulda aynen ya da baş kısmıyla geçmiyorsa; düzeltme cevapta söylenir
  ("… diye aradık").
- Kısaltmalar açılır, bitişik yazılmış kelimeler ayrılır.
- Hiçbir okul bütün kelimeleri tutmuyorsa en çok kelimesi tutanlar "yakın sonuç" olarak döner.

Hız için okul adlarındaki farklı kelimeler bir kez sözlüğe konur; aranan kelime okullarla değil sözlükle karşılaştırılır ve
sonucu önbellekte tutulur. Dosya yorumuna göre 67 bin okulda bir arama birkaç milisaniye sürer.

## İçinde neler var?

### `sade(metin)`

Karşılaştırma biçimi: `ı`, `İ`, `I` → `i`; NFD ile harf işaretleri atılır (`ş→s`, `ö→o`…); küçük harf; `a-z0-9` dışı her şey tek
boşluk; kırpma. `null`/`undefined` → `''`. Örnek: `sade('  İSTANBUL, Şişli! ')` → `'istanbul sisli'`. (Küfür süzgecindeki
`sadelestir`'den farkı: rakamları harfe çevirmez, çift harfleri teke indirmez.)

### `uzaklik(a, b, sinir)`

Kısıtlı Damerau-Levenshtein uzaklığı: ekleme, silme, değiştirme ve yan yana iki harfin yer değiştirmesi birer hata sayılır.
Uzaklık `sinir`'i aşınca erken çıkar ve `sinir + 1` döner (uzunluk farkı sınırı aşıyorsa hiç hesaplamaz). Örnek:
`uzaklik('ortaoklu', 'ortaokulu', 2)` → 1; `uzaklik('abc', 'xyz', 1)` → 2.

### `AramaDizini` sınıfı

- **`new AramaDizini(kayitlar)`** — `kayitlar`: `[{ ad, yer }]`; `ad` okulun adı, `yer` aranabilir ama daha az puanlı ek metin
  (il + ilçe; kayıt ekranında kısa ad da). Kurarken her okul için ad kelimeleri, yer kelimeleri, ekrandaki (boşlukla ayrılmış)
  kelimelerin sade parçaları (vurgu için) ve iki sözlük (`kelime → okul sıraları`) çıkarılır.
- **`ara(sorgu, uygun?, sinir?)`** → `{ toplam, yakin, duzeltme, sonuclar: [{ i, puan, vurgu }] }`.
  - `sorgu`: yazılan metin. Sade kelimeleri tekilleştirilir, en çok 8 kelime (bölünmeden sonra en çok 10).
  - `uygun(i)`: il/ilçe/tür süzgeci (verilmezse hepsi uygun).
  - `sinir`: en çok kaç sonuç (varsayılan 30). `toplam` sınırdan önceki sayıdır.
  - `i`: `kayitlar` dizisindeki sıra; `puan`: sıralama puanı; `vurgu`: adın boşlukla ayrılmış kelimelerinden koyu yazılacakların
    sıra numaraları.
  - `yakin`: `true` ise sonuçlar bütün kelimeleri tutmuyor, en çok kelime tutanlar.
  - `duzeltme`: bir kelime düzeltildiyse ya da bitişik kelime bölündüyse aranan metnin düzeltilmiş hâli
    (`'ortaokulu renk'`); değilse `''`.
  - Boş sorguda `{ toplam: 0, yakin: false, duzeltme: '', sonuclar: [] }`.
- İç yöntemler: `kelimeCoz(k)` (kelimenin sözlükte tuttuğu kelimeler ve puanları, önbellekli), `bol(k)` (bitişik yazımı
  sözlük kelimelerine bölme), `okulPuani(i, c, tutanlar)`, `adaylar(cozumler, uygun)`.

### Puanlar

Bir aranan kelime (`k`) ile sözlük kelimesi (`w`):

| Durum | Puan |
|---|---|
| aynı | 10 |
| `w`, `k` ile başlıyor | 8 (`k` tek harfse 6) |
| `k` (en az 3 harf) `w`'nin içinde | 5 |
| kısaltma açılımının bütün kelimeleri adda | 9 |
| hatalı: `w`'nin tamamıyla 1 fark / 2 fark | 5 / 3 |
| hatalı: `w`'nin `k` uzunluğundaki baş kısmıyla 1 fark / 2 fark | 4 / 2 |
| il/ilçe (yer) kelimesi aynı ya da baş kısmı | 3 (hatalıda, puan ≥ 4 ise 2) |

Okulun kelime puanı: ad kelimelerinden en yükseği; adda hiç tutmuyorsa yer kelimelerinden en yükseği. Okulun toplamı: kelime
puanlarının toplamı + ad, aranan ilk kelimeyle aynen ya da baş kısmıyla (puan ≥ 8) başlıyorsa 3 − ad kelime sayısı × 0,1 (kısa
ad biraz önde). Sıralama: tutan kelime sayısı → puan → sıra numarası.

### Kısaltmalar (`KISALTMALAR`)

`aihl` Anadolu İmam Hatip Lisesi, `ihl` İmam Hatip Lisesi, `iho` İmam Hatip Ortaokulu, `fl` Fen Lisesi, `al` Anadolu Lisesi,
`mtal` Mesleki Teknik Anadolu Lisesi, `sbl` Sosyal Bilimler Lisesi, `gsl` Güzel Sanatlar Lisesi, `oo` Ortaokulu, `io` İlkokulu,
`bilsem` Bilim Sanat Merkezi, `hem` Halk Eğitimi Merkezi, `ram` Rehberlik Araştırma Merkezi.

## Kimle konuşur?

Hiçbir modül çağırmaz. Onu kullananlar:

- [../okullar.md](../okullar.md) — MEB okul listesi yüklenince (`okullariYukle`) `new AramaDizini(okulAra.map(o => ({ ad, yer: il
  + ' ' + ilce })))` bir kez kurulur; `okulArama(sorgu, il, ilce, tip, limit)` bunu `okulDizini.ara(sorgu, uygun, enFazla)` ile kullanır (kayıt ekranının
  okul araması; [../bolumler/kayit.md](../bolumler/kayit.md)'deki `GET /api/okullar/ara`, IP başına dakikada 300 istek), `uygun`
  il/ilçe/tür süzgecidir; `limit` 1–100 arasına çekilir (varsayılan 30). Yalnız noktalama yazılmışsa arama yapılmaz: il
  seçilmemişse "İl seç ya da okul adı yaz.", seçilmişse o ilin okulları ad sırasıyla döner (bu dosya hiç çağrılmaz).
- [../bolumler/kayit.md](../bolumler/kayit.md) — okul adresi araması (`GET /api/okul-adres/ara?q=`, herkese açık): sade hâli 2 harften kısa
  sorguya boş liste; adresi olan okullardan HER İSTEKTE yeni bir dizin kurulur (`yer`: il + ilçe + kısa ad), en çok 20 sonuç.
  `sade` burada `sadeArama` adıyla kullanılır.
- Veritabanı: doğrudan kullanmaz; kayit.js listeyi `depo.okullar.adresliOkullar()` ile alır.

## Nasıl çalışır (adım adım)?

```
ara(sorgu)
  1. kelimeler = sade(sorgu) → tekil, en çok 8
  2. her kelime için kelimeCoz:
        hatasız eşleşmeler (ad sözlüğü; yer sözlüğünde yalnız aynı/baş kısmı)
        kısaltma mı?
        hiçbiri yoksa → hatalı eşleşmeler; en yüksek puanlı (eşitse en çok okulda geçen) kelime "düzeltme" olur
                        ve düzeltilen kelimenin hatasız eşleşmeleri de eklenir ("rReNk" = "renk")
  3. kelime kısaltma değilse ve düzeltilmek zorunda kaldıysa ya da hiç tutmuyorsa → bol(k) (yalnız 6–40 harfli kelimede):
     bitişik yazım sözlük kelimelerine bölünür
     (parça 2–20 harf, en çok 5 parça, en çok 60 aday; parçalarının hepsi aynı okulda geçen, en çok okulu tutan bölünüş;
     eşitlikte az parçalısı; hiçbir bölünüşün parçaları aynı okulda buluşmuyorsa bölünmez)
  4. her kelime tutuyorsa: en az okulda geçen kelimenin okulları aday → her aday bütün kelimeleri tutuyor mu → puanla
  5. kimse bütün kelimeleri tutmuyorsa (ve birden çok kelime varsa): ad ya da kısaltma üzerinden tutan okullar arasında
     en çok kelime tutanlar → yakin: true
  6. sırala, sinir kadar al, vurgu kelimelerini çıkar
```

Örnekler (küçük bir listeyle denendi): `rReNk` → düzeltme `renk`, "Renk Ortaokulu" "Örenkaya İlkokulu"nun önünde;
`ortaoklu renk` → düzeltme `ortaokulu renk`; `AİHL` → "… Anadolu İmam Hatip Lisesi", düzeltme yok; `ataturkanadolu` → düzeltme
`ataturk anadolu`; `renk bursa` → "renk" "Örenkaya"nın içinde, "bursa" il olarak tutuyor.

## Dikkat!

- Önbellek (`onbellek`) dizin başınadır, en çok ~2000 kelime tutar, dolunca en eski silinir. Okul listesi değişince dizin
  yeniden kurulmalı (okullar.js yüklemede kurar); eski dizinin önbelleği yeni listeye taşınmaz.
- kayit.js'teki okul adresi araması her istekte `adresliOkullar()` çeker ve dizini baştan kurar. Adresi olan okul sayısı bugün
  az olduğu için hızlı; okul sayısı binlere çıkarsa (IP başına dakikada 3000 istek serbest) sunucuya yük olabilir, dizini
  önbelleğe almak gerekebilir.
- "Yakın sonuç" adayları yalnız AD ve kısaltma eşleşmelerinden toplanır; yalnız il/ilçesi tutan okul yakın sonuçlara aday
  olmaz (ama aday olan okulun il/ilçesi puana katılır).
- Hatalı eşleşme yalnız kelime hiç tutmuyorsa denenir; bu yüzden "renk" araması "Renk"i bulduğunda "Rengin" gibi yakın
  yazılmışları getirmez (bilerek).
- 1–3 harfli kelimelerde yazım hatası hoş görülmez (`hataSiniri` 4 harften kısa kelimede 0).
- Sorgu 8 kelimeyle, bölünmüş hâli 10 kelimeyle sınırlıdır; fazlası yok sayılır.

## Testleri

- `testler/test-giris-kayit.js` (sunucu ister) — okul araması: kelime sırası ve büyük harfin fark etmemesi, noktalı kısaltma
  ("m.akif"), uydurma kelimede boş değil "yakın" sonuç, ilçe adıyla arama, büyük harfli adların düzeltilmiş görünmesi,
  karışık büyük/küçük harfin aynı sonucu vermesi, "ortaoklu" düzeltmesi ve vurgusu, harf eksik "tefik" → Tevfik Fikret, AİHL
  kısaltması, bitişik yazım ("ataturkortaokulu"), kısaltma + ilçe birlikte (MTAL Çankaya).
- Sunucusuz birim testi yok.
- Elle: `node -e "const {AramaDizini}=require('./sunucu/yardimci/bulanik-arama');const d=new AramaDizini([{ad:'Renk Ortaokulu',yer:'Ankara Çankaya'}]);console.log(JSON.stringify(d.ara('rReNk')))"`.

## Son durum

- Dosya üç adımda geldi (hepsi 2026-09-26): `3d88e18 commit 399` `sade`, `uzaklik`, kısaltmalar ve puan işlevleri (okullar.js'e
  bağlanarak); `fef46a8 commit 400` `AramaDizini` sınıfı; `6af78fc commit 401` dışa açılış (`module.exports`). Sonra değişmedi.
- Açık: sunucusuz birim testi yok; kayit.js'teki her istekte dizin kurma (yukarıda).
- Sıradaki işlerden "Kullanıcı arama (/users/<ad>)" kişi araması getirecek; bu motor kişi adları için de kullanılabilir (planda
  açıkça yazılmamış). "Paneller … okul gezgini" okul listesinde arama isteyebilir.
