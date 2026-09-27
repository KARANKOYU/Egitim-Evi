# sunucu/okullar.js

MEB okul listesini (`data/okullar.json`) belleğe yükler ve kayıt/okul açma ekranlarındaki okul aramasını yapar.

## Bu dosya ne yapar?

Türkiye'deki okulların listesi (il, ilçe, tür, ad, özel mi, kurum kodu) `data/okullar.json`'da durur; ~67 bin okul.
Bu dosya depoya girmez (büyük ve MEB'den çekiliyor), kurulumu yapan bilgisayardan kopyalanır. Sunucu açılırken bu
dosya listeyi okur, her okula sabit bir kimlik verir, adlarını düzeltir ve bir arama dizini kurar. Sonra "okulunu
bul" kutusuna yazılan her harf için hızlı, Türkçe harflere, yazım hatasına ve kısaltmalara ("m.akif") dayanıklı arama
yapar. Liste yoksa sunucu yine çalışır; yalnız okul araması 503 verir.

## İçinde neler var?

- `OKUL_DOSYA` — `DATA/okullar.json`.
- `okulAra` — dışa verilen DİZİ: `{ id, ad, sade, il, ilce, sadeIlce, tip, ozel, kod, resmiTur }`. Yeniden yüklemede
  dizinin kendisi değişmez, içi boşaltılıp doldurulur (başka dosyalar aynı başvuruyu tutar).
- `okulVeri` — ham JSON. DİKKAT: dışa `null` olarak verilir ve öyle kalır (bkz. Dikkat).
- `TR_SADE_HARF`, `sadelestir(metin)` — Türkçe harfleri düzleyip küçültür, kırpar ("ÖĞRETMEN" → "ogretmen"). Okul
  kimliği bununla üretilir; kural değişirse kayıtlı okulların kimliği kayar.
- `aramaSade(metin)` — aramaya özel gevşek hâli: ı/İ/I → i, aksanlar düşer, harf/rakam dışı her şey boşluk.
- `okulKimligi(il, ilce, ad)` — `'meb_' + sha1(sade il|ilçe|ad)`'ın ilk 12 hanesi. Liste yeniden oluşturulsa da aynı
  okul aynı kimliği alır; kayıtlı hesaplar kopmaz. Kimlik ÖZGÜN addan (düzeltilmemiş) üretilir.
- `okullariYukle()` — dosya yoksa konsola uyarı yazıp döner; varsa okur, `okulAra`'yı doldurur,
  `AramaDizini`'ni (`yardimci/bulanik-arama.js`) kurar, konsola "Okul listesi: N okul yuklendi (… il, … ozel)" yazar.
  Bozuk dosyada liste boşaltılır, sunucu düşmez.
- `okulArama(sorgu, il, ilce, tip, limit)` → `{ toplam, yakin, duzeltme, okullar: [{ id, ad, il, ilce, tip, ozel,
  resmiTur, kod, vurgu }] }`. `limit` 1–100 (varsayılan 30). Sorguda harf yoksa: il seçilmediyse boş sonuç ve
  `mesaj: 'İl seç ya da okul adı yaz.'`, seçildiyse o ilin (ve ilçe/tür süzgecinin) okulları Türkçe alfabetik. Sorgu varsa arama
  dizini: `yakin` = bütün kelimeleri tutan okul yok, en çok tutanlar geldi; `duzeltme` = yanlış yazılmış kelime
  düzeltildiyse aranan metin; `vurgu` = adda tutan kelimelerin sırası (ön yüz kalın yazar).
- `okulKimlikBul(id)` — kimlikten okul kaydı ya da `null` (doğrusal tarama).
- İç: `adDuzelt(ad)` — adı TAMAMEN büyük harfle yazılmış okulları ("ÇAM İLKOKULU") "Çam İlkokulu" yapar; Roma rakamları
  ve kısaltmalı adlar ("TOBB …") kalır, "ve"/"ile" küçük.

## Kimle konuşur?

- Çağırdıkları: `fs`, `path`, `crypto`, `./yollar` (`DATA`), `./yardimci/bulanik-arama` (`AramaDizini`).
- Onu çağıranlar (grep):
  - `sunucu/index.js` — açılışta `okullariYukle()`;
  - `sunucu/bolumler/kayit.js` — `GET /api/okullar/iller` (il → ilçeler listesi, türler, toplam) ve
    `GET /api/okullar/ara?q=&il=&ilce=&tip=&limit=` (girişsiz; IP başına dakikada 300 arama, aşılırsa 429; sorgu da
    il de yoksa boş sonuç); `okulAra`, `okulArama`, `okulVeri`;
  - `sunucu/bolumler/yonetici-okul.js` — yönetici okul açarken MEB kimliğinden okulu bulur (`okulKimlikBul`).
- Ön yüzde aynı sadeleştirme kuralı `public/js/parcalar/05-giris.js`'te var; tür listesi `08b-rolsuz.js`'te kullanılır.
- Veritabanına dokunmaz; liste yalnız bellekte.

## Nasıl çalışır (adım adım)?

```
açılış: okullar.json → her satır [ilNo, ilceNo, tipNo, ad, ozel, kod, resmiTurNo]
          → { id: okulKimligi(il, ilce, özgün ad), ad: adDuzelt(ad), sade..., resmiTur }
          → AramaDizini(ad + "il ilçe")

arama:  aramaSade(sorgu) boş mu?
          evet → il yoksa "İl seç..." ; varsa süzgeçten geçen hepsi, alfabetik, ilk `limit`
          hayır → okulDizini.ara(sorgu, süzgeç, limit) → { toplam, yakin, duzeltme, sonuçlar+vurgu }
```

## Dikkat!

- **Bilinen hata (koddan doğrulandı):** `module.exports = { okulVeri, … }` dosya yüklenirken çalışır; o anda
  `okulVeri` `null`'dır. `okullariYukle()` sonra yerel değişkeni değiştirir ama dışa verilen değer `null` kalır (deneme:
  `EE_DATA=<geçici> node -e "const o=require('./sunucu/okullar'); o.okullariYukle(); console.log(o.okulVeri)"` →
  `null`). Bu yüzden `kayit.js`'teki `GET /api/okullar/iller` cevabında `tipler` hep boş dizi gelir; ön yüzdeki okul
  türü seçimi (`08b-rolsuz.js`) boş kalır. Düzeltme `okulAra` gibi değişmez bir nesne ya da bir erişim işlevi
  (`okulVerisi()`) olabilir; belgeleme işinde kod değiştirilmediği için düzeltilmedi.
- Yorumlarda "53 bin" ve "67 bin" iki sayı geçiyor; güncel olan başlıktaki 67 bin (KILAVUZ da 67.661 diyor).
- `sadelestir` ile okul kimliği bağlı: bu işlevi değiştirme. Aramayı gevşetmek istersen `aramaSade`'ye dokun.
- `okulKimlikBul` 67 bin kaydı tek tek tarar; seyrek çağrıldığı (yönetici okul açarken) için dizin kurulmadı.
- Liste yalnız açılışta okunur; `okullar.json`'u değiştirirsen sunucuyu yeniden başlat.

## Testleri

- `testler/test-giris-kayit.js` — `/api/okullar/ara`: büyük/küçük ve Türkçe harf farkı aynı okulu buluyor, noktalı
  kısaltma ("m.akif"), yanlış kelimede `yakin` sonuç, ilçe adı aranıyor, tamamı büyük harfli adlar düzeltilmiş.
- `testler/tumtest.sh` her paketten önce test klasörüne gerçek `data/okullar.json`'u kopyalar; dosya yoksa bu
  kontroller kalır.
- Elle: `curl "http://localhost:3200/api/okullar/ara?q=ataturk%20anadolu&il=Ankara"`.

## Son durum

- Son commit `3d88e18 commit 399` (2026-09-26): bulanık arama — `aramaSade`, `adDuzelt`, `AramaDizini` ile yeni
  `okulArama` (yakın sonuç, düzeltme, vurgu) ve `yardimci/bulanik-arama.js` eklendi. Ondan önce `07e7d97 commit 102`
  `okulKimlikBul`'u ekledi.
- Açık iş: yukarıdaki `okulVeri`/`tipler` hatası (küçük, ayrı bir düzeltme işi olarak önerilir).
