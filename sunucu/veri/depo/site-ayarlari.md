# sunucu/veri/depo/site-ayarlari.js

Sistem yöneticisinin `/admin` > "Site ayarları"ndan değiştirdiği ayarların (`site_ayarlari`) kaydı ve bellekteki
kopyası: açılışta okuma, bellekten okuma, yazma (upsert) ve silme ("varsayılana dön").

## Bu dosya ne yapar?

Bazı site ayarları (iletişim bilgisi, yapımcılar, Play Store bağlantısı, bildirim yoklama aralığı, çevrimiçi sayma
süresi, `admins.json` okuma aralığı, varsayılan okul disk sınırı) sunucuyu yeniden başlatmadan yönetim panelinden
değiştirilebilir. Bir ayarın değeri üç yerden gelebilir; öncelik: **bu tablodaki değer > `data/config.yml` (ya da
ilgili dosya/ortam değişkeni) > kodun varsayılanı** (şema 030).

Bu dosya yalnız birinci katmanı (veritabanı) tutar: tabloyu açılışta belleğe okur, yönetici değiştirince belleği de
hemen günceller. Hangi anahtarların var olduğu, önceliğin hesaplanması ve değerin temizlenmesi [../../site.md](../../site.md)'de
(`ayarKaynakli`, `ayar`), doğrulama ve işlem kaydı [../../bolumler/site-ayarlari.md](../../bolumler/site-ayarlari.md)'dedir.

## İçinde neler var?

Bellek: `Map(anahtar → { deger, guncelleyenId, guncelleyenAd, zaman (ISO ya da null) })`; iç `satirdan(r)` satırı bu
nesneye çevirir. [../esleme.md](../esleme.md) kullanılmaz.

- `yukle()` — `SELECT anahtar, deger, guncelleyen_id, guncelleyen_ad, guncelleme FROM site_ayarlari` → yeni harita, tek
  hamlede değiştirilir. Açılışta çağrılır.
- `oku(anahtar)` — bellekteki kayıt ya da `null` (veritabanına GİTMEZ). `deger` `jsonb`'den gelen JavaScript değeridir
  (nesne, dizi, sayı ya da metin).
- `yaz(anahtar, deger, kisi)` — `kisi = { id, fullName }`. `INSERT INTO site_ayarlari … VALUES ($1, $2::jsonb, $3, $4,
  now()) ON CONFLICT (anahtar) DO UPDATE SET deger, guncelleyen_id, guncelleyen_ad, guncelleme RETURNING …` (upsert);
  değer `JSON.stringify` ile gider. Dönen satırla belleği günceller ve yeni kaydı döner. Anahtar şemada
  `^[a-zA-Z][a-zA-Z0-9]{1,39}$` kalıbına uymazsa `23514`.
- `sil(anahtar)` — satırı siler ve bellekten çıkarır: ayar bir alt katmana (config.yml, dosya, ortam ya da varsayılan)
  döner.

### Tablolar ve şema

| Tablo | Şema dosyası |
|---|---|
| `site_ayarlari` (`anahtar` birincil anahtar ve kalıp CHECK'i, `deger jsonb`, `guncelleyen_id` — yabancı anahtar YOK, `guncelleyen_ad`, `guncelleme`) | `030-yonetim-paneli.sql` |

`guncelleyen_id` bilerek yabancı anahtarsızdır ve kişinin adı ayrıca yazılır: yedekten geri yüklemede kullanıcılar
tablosu boşaltılır (`TRUNCATE … CASCADE`), site ayarları bundan etkilenmesin diye. Site ayarları yedeğe girmez, geri
yüklemede olduğu gibi kalır.

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.siteAyarlari`):
  - [../index.md](../index.md) — açılışta `yukle()` (özelliklerden hemen sonra).
  - [../../site.md](../../site.md) — `ayarKaynakli(anahtar)` her çağrıda `oku` ile veritabanı katmanına bakar; `ayar()`,
    `cevrimiciEtkinDk()`, istemci ayarları hep bunun üstünde.
  - [../../bolumler/site-ayarlari.md](../../bolumler/site-ayarlari.md) — `POST /api/admin/site-ayarlari`: kaydet (`yaz`,
    değer aynıysa yazmaz) ve "varsayılana dön" (`sil`).
- Testler de doğrudan kullanır: `testler/test-site-ayarlari.js` (`yukle`, `yaz`, `sil`), `testler/test-okul-disk.js`
  (`yukle`).
- Tablo: `site_ayarlari`.

## Nasıl çalışır (adım adım)?

```
açılış:  veri/index.js baslat() → siteAyarlari.yukle() → bellek
okuma:   site.ayar('bildirimAralikDk') → ayarKaynakli → oku(anahtar)
            varsa ve temizlenebiliyorsa → { kaynak: 'veritabani', guncelleyen, zaman }
            yoksa → config.yml / dosya / ortam / varsayılan
yazma:   POST /api/admin/site-ayarlari { anahtar, deger } → bölüm doğrular → değer ve kaynak aynıysa "zaten böyle"
            değilse yaz(anahtar, deger, me) → upsert … RETURNING → bellek → işlem kaydı
sıfırla: { anahtar, sifirla: true } → veritabanındaysa sil(anahtar) → bellekten de çıkar
```

## Dikkat!

- **Bellek tek süreçliktir:** birden çok sunucu süreci aynı veritabanını kullanırsa öbür süreçler değişikliği ancak
  yeniden başlayınca görür (dosyanın yorumu bunu kabul eder). Veritabanını elle değiştirmek de belleğe yansımaz.
- **İçeri aktarım belleği yenilemez:** [../json-aktarim.md](../json-aktarim.md) bu tabloya dokunmaz (ayarlar yedeğe
  girmez), bu yüzden `yukle()`'yi çağırmasına gerek de yoktur.
- **Doğrulama bu dosyada yok:** `yaz` gelen değeri olduğu gibi `jsonb`'ye yazar; değerin biçimi ve sınırları bölümde,
  okurken ayrıca [../../site.md](../../site.md)'deki temizleyicilerde (bozuk bir veritabanı değeri alt katmana düşer)
  denetlenir.
- **Eşzamanlı yazma:** upsert tek sorgudur; iki yönetici aynı anda yazarsa veritabanında son yazan kalır, bellek de her
  `yaz`'ın kendi `RETURNING` satırıyla güncellenir (sıra aynı olur çünkü ikinci upsert birincinin satır kilidini
  bekler).
- **`guncelleyen_ad` kişisel veri değildir ama bir addır:** yönetim panelinde "kim değiştirdi" diye görünür, yalnız
  yöneticiye gider.
- **Güvenlik:** bütün değerler parametreyle; anahtarı hem bölüm ([../../site.md](../../site.md)'deki `AYAR_ANAHTARLARI`
  listesine göre, bilinmeyene 400) hem şema (kalıp CHECK'i) denetler.

## Testleri

- `testler/test-site-ayarlari.js` — öncelik (veritabanı > config.yml > varsayılan; doğrudan `yukle`/`yaz`/`sil` ile),
  panelden kaydetme ve sıfırlama, bozuk değerlerin alanlı hata vermesi, işlem kaydı, "zaten böyle" ve "panelden
  sabitlendi", okul adresleri ekranı.
- `testler/test-okul-disk.js` — varsayılan okul disk sınırının veritabanından okunması (`okulDiskMb`).
- Elle: `/admin` > Site ayarları'nda bildirim aralığını değiştir → sayfa yenilenince istemci ayarlarında yeni değer
  görünmeli; "Varsayılana dön" → config.yml'deki (yoksa kodun) değeri.

## Son durum

- Tek commit: `276c0a0 commit 521` (2026-09-27) — gizli `/admin`, site ayarları ve `admins.json` canlı okuma işiyle
  (030) bu hâliyle eklendi. `okulDiskMb` anahtarı sonradan (commit 525) [../../site.md](../../site.md) tarafında eklendi;
  bu dosya değişmedi.
- Bilinen açıklar (kod değiştirilmedi): belleğin tek süreçlik olması (bilinçli karar).
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Sistem"** işi bu tabloya yeni anahtarlar getirecek: bakım modu, site
  duyurusu (zengin editör), e-posta sağlığı ayarları gibi. **"Paneller ve okul gezgini"** `/panel/admin` ve
  `/panel/destek` ile ayar ekranının yerini değiştirebilir; "Eğitim içerikleri"ndeki YouTube denetim aralığı ("ayarlı")
  da burada tutulabilir.
