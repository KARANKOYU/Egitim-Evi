# sunucu/veri/yazici.js

Tek tabloya satır ekleyen, `id` ile güncelleyen ve silen üç genel yardımcı (`ekle`, `guncelle`, `sil`) ile tablo/sütun
adlarını kalıpla doğrulayan `adDogrula`.

## Bu dosya ne yapar?

Bazı yerlerde yazılacak sütunlar önceden belli değildir: kullanıcı kaydı bir seferde iki alan, başka seferde on alan
güncellenir; yedekten içeri aktarma her tabloya farklı sütunlarla satır ekler. Her biri için ayrı SQL yazmak yerine bu
dosya `{ sütun: değer }` nesnesinden `INSERT` ya da `UPDATE` kurar.

SQL'e yalnız ADLAR birleştirilir, değerler her zaman `$1, $2 …` parametresiyle gider. Adlar koddan gelir (ör.
[esleme.md](esleme.md)'deki `KULLANICI_ALANLARI`, [json-aktarim.md](json-aktarim.md)'deki sabit tablo adları), kullanıcıdan
asla; yine de her ad `adDogrula`'dan geçer, beklenmedik bir ad SQL'e hiç ulaşmaz.

## İçinde neler var?

- `adDogrula(ad)` — `^[a-z_][a-z0-9_]*$` kalıbına uymayan adda `Error('Geçersiz tablo ya da sütun adı: …')` fırlatır,
  uyanı aynen döner. Büyük harf, tire, boşluk, tırnak, nokta geçmez (şema adıyla `public.tablo` da yazılamaz).
- `ekle(tablo, sutunlar)` — `INSERT INTO <tablo> (<adlar>) VALUES ($1, …)`; değerler nesnedeki sırayla. Dönüş: etkilenen
  satır sayısı (1). Tekillik ya da kısıt ihlalinde PostgreSQL hatası yukarı gider (ör. `23505`; bkz.
  [baglanti.md](baglanti.md) `hataCevir`).
- `guncelle(tablo, id, sutunlar)` — `UPDATE <tablo> SET a = $1, b = $2 … WHERE id = $N`. `sutunlar` boşsa sorgu atmadan 0
  döner. Dönüş: etkilenen satır sayısı (satır yoksa 0; hata değil).
- `sil(tablo, id)` — `DELETE FROM <tablo> WHERE id = $1`; etkilenen satır sayısı. Bağlı satırlar şemadaki
  `ON DELETE CASCADE / SET NULL` kurallarıyla gider.

Dışa açılanlar: `ekle`, `guncelle`, `sil`, `adDogrula`.

## Kimle konuşur?

- Çağırdıkları: [baglanti.md](baglanti.md) → `calistir` (işlem içindeyse kendiliğinden o işlemin bağlantısı).
- Onu çağıranlar:
  - `sunucu/veri/depo/kullanicilar.js` — kullanıcı `ekle` (`kullaniciSutunlari(u)` ile), `guncelle(id, değişiklik)`,
    `sil(id)`;
  - [json-aktarim.md](json-aktarim.md) — `iceAktar` her satırı `yaz.ekle(tablo, satir)` ile yazar; `disaAktar` tablo
    adlarını `yaz.adDogrula(tablo)` ile doğrulayıp `SELECT *` kurar.
- `testler/sql-denetimi.js` bu dosyayı adıyla tanır: `adlar.join(', ')`, `yerler.join(', ')`, `atamalar.join(', ')` ve
  `(adlar.length + 1)` yalnız burada izinli birleştirmelerdir; başka dosyada `adDogrula(...)` dışında ad birleştirme
  hata sayılır.
- Tablolar: kendisi belirli bir tabloya bağlı değil; bugün `kullanicilar` ve içeri aktarmadaki bütün tablolar.

## Nasıl çalışır (adım adım)?

```
guncelle('kullanicilar', 'u_abc', { ad_soyad: 'Ayşe Yılmaz', telefon: '+905320000000' })
  adlar     = ['ad_soyad', 'telefon']          (her biri adDogrula'dan)
  atamalar  = ['ad_soyad = $1', 'telefon = $2']
  SQL       = UPDATE kullanicilar SET ad_soyad = $1, telefon = $2 WHERE id = $3
  değerler  = ['Ayşe Yılmaz', '+905320000000', 'u_abc']
  → calistir → rowCount
```

## Dikkat!

- **Yalnız `id` sütunlu tablolar:** `guncelle` ve `sil` `WHERE id = $…` yazar. Birleşik anahtarlı tablolarda (ör.
  `odev_ogrencileri`, `quiz_denemeleri`) kullanılamaz; `ekle` ise her tabloda çalışır.
- **Nesne sırası = sütun sırası:** değerler `Object.keys` sırasıyla eşlenir; aynı nesneden hem ad hem değer alındığı için
  karışmaz. Nesneye sonradan anahtar eklemek güvenlidir.
- **`undefined` değer:** nesnede `undefined` değerli bir anahtar varsa sütun yine yazılır (`pg` onu NULL gönderir).
  Kısmi güncellemede "dokunma" demek için anahtarı hiç koyma; [esleme.md](esleme.md)'deki `kullaniciSutunlari` zaten
  `undefined` alanları atlar.
- **Kullanıcıdan gelen ad buraya girmez.** `adDogrula` son savunmadır, ilk değil: bir isteğin gövdesindeki anahtarları
  doğrudan `sutunlar` olarak vermek, kalıba uyan HER sütunu (ör. `rol`, `sifre_ozeti`) yazdırmak demektir. Sütun
  listesi her zaman koddaki bir eşlemeden gelmeli.

## Testleri

- `testler/sql-denetimi.js` (sunucusuz) — bu dosyadaki birleştirmelerin yalnız izinli parçalardan olduğunu denetler.
- Dolaylı: kullanıcı açma/güncelleme/silme yapan bütün paketler (`test-giris-kayit`, `test-yetiskin`, `test-cakisma`,
  `test-kisi-kodu` …) ve yedekten geri yükleme (`test-yedek`, `test-cakisma` "YEDEKTEN GERİ YÜKLEME").
- Elle: `node testler/sql-denetimi.js` → `KALDI` satırı çıkmamalı.

## Son durum

- Dosya `8b95a19 commit 10` (2026-08-28, PostgreSQL'e geçiş) ile eklendi ve o günden beri değişmedi.
- Açık iş yok; planlı bir değişiklik bilinmiyor.
