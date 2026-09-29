# sunucu/veri/depo/aile.js

Eğitim Evi Aile'nin (öğrencinin telefonundaki uygulama) verisi: bağlı telefonlar, konumlar, günlük uygulama süreleri,
velinin ayar ve sınırları, "bugün bildirim gitti mi" işaretleri ve 7 günlük temizlik.

## Bu dosya ne yapar?

Öğrenci kendi hesabıyla telefonunu bir kez bağlar; telefon kendine özel bir anahtar alır ve velinin seçtiği aralıkla
konumunu ve uygulama kullanım sürelerini gönderir. Veli bunları sitede görür, gönderme sıklığını ve uygulama sınırlarını
seçer; sınır aşılınca veliye günde bir kez bildirim gider (uygulama kapatılmaz). Okul (müdür, öğretmen) bu verileri
görmez. Bütün bu kayıtların SQL'i burada; kuralların (kim bağlar, kim görür, hangi değer geçerli) hepsi
[../../bolumler/aile.md](../../bolumler/aile.md)'dedir.

Konum ve kullanım kişisel veridir; bu yüzden şema (026) "7 gün sonra silinir" der ve bu dosyadaki `temizle` bunu yapar.
Telefonun anahtarı veritabanında düz değil, yalnız SHA-256 özeti olarak durur: veritabanı sızsa bile anahtar elde
edilemez.

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md) kullanmaz; satırları kendi içindeki küçük dönüştürücülerle nesneye çevirir.

### Sabit

- `SAKLAMA_GUN = 7` — veliye gösterilen saklama süresi (`GET /api/aile/ozet` cevabındaki `saklamaGun`). `temizle`'deki
  SQL bu sabiti KULLANMAZ, 7 günü kendi içinde yazar (Dikkat!).

### Cihazlar (`aile_cihazlari`)

İç dönüştürücü `cihaz(r)` → `{ id, ogrenciId, ad, platform, surum, sonGorulme, olusturma }` (anahtar özeti nesneye
girmez).

- `cihazEkle(d)` — `d = { id, ogrenciId, ozet, ad, platform, surum }`: `INSERT INTO aile_cihazlari (id, ogrenci_id,
  anahtar_ozeti, ad, platform, surum)`; ardından öğrencinin en yeni 3 cihazı dışındakileri siler
  (`DELETE … WHERE ogrenci_id = $1 AND id NOT IN (SELECT id … ORDER BY olusturma DESC LIMIT 3)`). Dönüş yok. Aynı özet
  ikinci kez gelirse `anahtar_ozeti UNIQUE` → `23505` (32 baytlık rastgele anahtarda pratikte olmaz).
- `cihazOzetle(ozet)` — özetten cihaz ya da `null` (`WHERE anahtar_ozeti = $1`; tekil kısıtın indeksiyle).
- `cihazGoruldu(id)` — `son_gorulme = now()`.
- `cihazSil(id)` — cihazı siler; o cihazın konumlarındaki `cihaz_id` `ON DELETE SET NULL` ile boşalır, konumlar kalır.
- `cihazlari(ogrenciId)` — öğrencinin cihazları, en yeni önce.

### Ayar ve sınırlar (`aile_ayarlari`, `aile_sinirlari`)

- `ayar(ogrenciId)` — `{ wifiDk, mobilDk, konumAcik, kullanimAcik, toplamSinir }`. Satır yoksa şemadaki varsayılanların
  aynısı döner (`5`, `15`, `true`, `true`, `null`); satır hiç yazılmadan da her şey çalışır.
- `sinirlari(ogrenciId)` — uygulama sınırları `[{ paket, ad, dakika }]`, uygulama adına göre (`ORDER BY ad`, Türkçe
  sıralama eki yok).
- `ayarYaz(ogrenciId, a, sinirlar, veliId)` — tek işlemde: `aile_ayarlari`'na `INSERT … ON CONFLICT (ogrenci_id) DO
  UPDATE` (upsert; `guncelleyen = veliId`, `guncelleme = now()`), sonra öğrencinin bütün sınırları silinip listedeki
  sınırlar tek sorguda `unnest($2::text[], $3::text[], $4::int[])` ile yazılır. Değerler şemada da denetlenir
  (`wifi_dk`/`mobil_dk` ∈ {1, 5, 10, 15, 30, 60}, `toplam_sinir` 5–1440, sınır dakikası 5–1440 → aykırıysa `23514`);
  aynı paket iki kez gelirse `PRIMARY KEY (ogrenci_id, paket)` → `23505` (bölüm tekrarları önceden ayıklar).

### Konumlar (`aile_konumlari`)

- `konumEkle(ogrenciId, cihazId, liste)` — `liste = [{ enlem, boylam, dogruluk, ag, pil, zaman }]`; boşsa sorgu atmadan
  `0`. Hepsi tek `INSERT … SELECT … FROM unnest(float8[], float8[], int[], text[], int[], timestamptz[])` ile girer;
  `ON CONFLICT (ogrenci_id, zaman) DO NOTHING` aynı anın ikinci kez yazılmasını önler (telefon aynı paketi yeniden
  gönderirse). `RETURNING id` ile gerçekten eklenen sayıyı döner.
- `sonKonumlar(ogrenciId, adet)` — en yeni `adet` konum `[{ enlem, boylam, dogruluk, ag, pil, zaman }]` (`ORDER BY zaman
  DESC LIMIT $2`; `aile_konumlari_ogrenci_zaman` indeksiyle).

### Kullanım (`aile_kullanim`)

- `kullanimYaz(ogrenciId, satirlar)` — `satirlar = [{ gun, paket, ad, dakika }]`; boşsa hiçbir şey yapmaz. Tek
  `INSERT … unnest(date[], text[], text[], int[]) ON CONFLICT (ogrenci_id, gun, paket) DO UPDATE SET ad, dakika`: telefon
  aynı günü yeniden gönderince süre üzerine yazılır (toplanmaz; telefon günün toplamını gönderir).
- `kullanimlari(ogrenciId, enEskiGun)` — `gun >= enEskiGun` satırları `[{ gun: 'YYYY-AA-GG', paket, ad, dakika }]`,
  güne göre, gün içinde çoktan aza (`ORDER BY gun, dakika DESC`). `gun` SQL'de `to_char` ile metne çevrilir.

### Uyarı işaretleri (`aile_uyarilari`) ve temizlik

- `uyariIlkMi(ogrenciId, gun, anahtar)` — "bu gün bu anahtar için bildirim ilk kez mi?": `INSERT … ON CONFLICT DO
  NOTHING RETURNING anahtar`; satır girdiyse `true` (ve artık işaretli), girmediyse `false`. Anahtar `'toplam'` ya da
  uygulamanın paket adı. Tek sorgu olduğu için iki eşzamanlı istekten yalnız biri `true` alır.
- `temizle()` — üç `DELETE`: `aile_konumlari` `zaman < now() - interval '7 days'`, `aile_kullanim` ve `aile_uyarilari`
  `gun < current_date - 7`.

### Tablolar ve şema

| Tablo | Şema dosyası |
|---|---|
| `aile_cihazlari` (`anahtar_ozeti` 64 karakter, `UNIQUE`; `aile_cihazlari_ogrenci` indeksi), `aile_konumlari` (`bigserial`, enlem/boylam/doğruluk/pil CHECK'leri, `ag` '' / wifi / mobil, `UNIQUE (ogrenci_id, zaman)`, `aile_konumlari_ogrenci_zaman` indeksi), `aile_kullanim` (`PRIMARY KEY (ogrenci_id, gun, paket)`, dakika 0–1440), `aile_ayarlari`, `aile_sinirlari`, `aile_uyarilari` | `026-aile.sql` |

Bütün tablolar `kullanicilar (id)`'ye `ON DELETE CASCADE` bağlıdır: öğrenci hesabı silinince Aile verisinin hepsi gider.

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.aile`):
  - [../../bolumler/aile.md](../../bolumler/aile.md) — bütün işlevler: öğrencinin telefonu bağlaması (`cihazEkle`,
    `ayar`), cihaz uçları (`cihazOzetle`, `cihazGoruldu`, `ayar`, `konumEkle`, `kullanimYaz`, `kullanimlari`,
    `sinirlari`, `uyariIlkMi`, `cihazSil`), velinin özeti (`cihazlari`, `ayar`, `sinirlari`, `sonKonumlar(…, 30)`,
    `kullanimlari`, `SAKLAMA_GUN`), ayarı (`ayarYaz`) ve telefon kaldırması (`cihazlari` + `cihazSil`).
  - [../../index.md](../../index.md) — saatte bir `temizle()` (`setInterval`, hatası yutulur).
- Tablolar: `aile_cihazlari`, `aile_konumlari`, `aile_kullanim`, `aile_ayarlari`, `aile_sinirlari`, `aile_uyarilari`.

## Nasıl çalışır (adım adım)?

### Telefonun bir gönderimi

```
X-Aile-Cihaz: <64 hex>  → bölüm: SHA-256 → cihazOzetle(ozet)      yoksa 401
                         cihaz başına saatte 240 istek (hizSinir)  aşarsa 429
                         onaylı öğrenci mi? değilse cihazSil + 401
                         cihazGoruldu(id) ; ayar(ogrenci)
POST …/konum    konumAcik değilse "kapali"  →  konumEkle (tek INSERT, aynı an atlanır) → { alinan }
POST …/kullanim kullanimAcik değilse "kapali" → kullanimYaz (gün+paket upsert)
                → sinirlariDenetle: kullanimlari(bugün) → toplam > sınır? uyariIlkMi('toplam') → velilere bildirim
                                   her sınır: süre > sınır? uyariIlkMi(paket) → velilere bildirim
```

### Velinin ayarı kaydetmesi

```
POST /api/aile/ayar → bölüm doğrular → ayarYaz: islem { upsert aile_ayarlari ; DELETE sınırlar ; INSERT unnest(...) }
                    → ayar() + sinirlari() yeniden okunup döner
```

### Temizlik

```
sunucu/index.js  her 60 dk → temizle(): konum (zaman) ; kullanım ve uyarı (gun) 7 günden eskiyse silinir
```

## Dikkat!

- **Kapsam bölümde:** bu dosyadaki hiçbir sorgu "bu veli bu öğrencinin velisi mi?" diye bakmaz. Bölüm her veli ucunda
  `depo.kullanicilar.bagliMi(me.id, ogrenci.id)` ile denetler; cihaz silerken de cihazı önce ÖĞRENCİNİN cihazları
  arasında arar (`cihazlari(ogrenci.id).find(...)`), sonra `cihazSil(id)` der. `cihazSil`, `cihazGoruldu` kimlikle
  çalışır; yeni bir çağıran bu sırayı korumalı.
- **Anahtar özeti:** `cihazOzetle`'ye düz anahtar değil özet verilir (özeti bölüm hesaplar). Özet tekil indeksli
  olduğu için arama hızlıdır; anahtar yalnız bu uçlara yarar, oturum yerine geçmez.
- **3 cihaz sınırı işlem dışında:** `cihazEkle`'deki `INSERT` ve fazlaları silme iki ayrı sorgudur. Aynı anda iki bağlama
  gelirse kısa bir an 4 cihaz olabilir; sonraki silme onu 3'e indirir. Aynı `olusturma` anındaki satırlarda hangisinin
  düşeceği belli değildir (pratikte önemsiz). Düşen eski cihaz bir sonraki gönderiminde 401 alır.
- **`SAKLAMA_GUN` ile SQL ayrı:** sabit 7'yi değiştirirsen `temizle`'deki `'7 days'` ve `current_date - 7` değişmez;
  veliye gösterilen süre ile gerçek silme ayrışır. İkisini birlikte değiştir.
- **Saat dilimi:** bağlantı `timezone=UTC` ile açılır ([../baglanti.md](../baglanti.md)), yani `current_date` UTC günüdür;
  `gun` ise Türkiye günüdür (bölüm `trGun` ile hesaplar). Türkiye'de 00:00–03:00 arası UTC bir gün geridedir; bu yalnız
  kullanım/uyarı satırlarının birkaç saat daha geç silinmesine yol açar, veri kaybı olmaz.
- **Kullanım üzerine yazılır:** `kullanimYaz` dakikaları toplamaz; telefon günün o ana kadarki TOPLAMINI göndermelidir
  (uygulama öyle yapar). Aynı gün eski bir paket gelirse süre geri düşebilir.
- **`uyariIlkMi` yarışa dayanıklıdır** (tek `INSERT … ON CONFLICT DO NOTHING RETURNING`): iki gönderim aynı anda sınırı
  aşsa da veliye bir bildirim gider.
- **Cihaz silinince konumlar kalır** (`cihaz_id` `NULL` olur); 7 gün sonra `temizle` onları da siler. Öğrenci hesabı
  silinirse bütün Aile verisi CASCADE ile hemen gider.
- **`temizle` hataları yutulur** (`.catch(() => {})`): veritabanı o an ulaşılamazsa bir sonraki saatte yeniden dener,
  günlüğe bir şey yazılmaz.
- **Güvenlik:** bütün değerler parametreyle; toplu yazmalar `unnest` dizi parametreleriyle tek sorgu. Uygulama adı düz
  metin saklanır; ön yüz kaçışla basar (test ediliyor). Sınır, aralık, konum aralığı ve paket biçimi hem bölümde hem
  şemada denetlenir.

## Testleri

- `testler/test-aile.js` — bağlama (onaysız olmaz, veli bağlayamaz, 64 haneli anahtar, veliye bildirim), anahtarın oturum
  yerine geçmemesi, anahtarsız/yanlış/biçimsiz 401, konum (geçerliler alınır, aynı zaman damgası iki kez yazılmaz, bir
  istekte en çok 500), kullanım (bozuk paket, 1440 üstü, eski gün atılır), velinin özeti, okulun göremediği, ayar ve
  sınırlar, toplam ve uygulama sınırı bildirimi ve günde bir kez kuralı, konum kapalıyken alınmaması, cihaz kaldırma
  (veli ve öğrenci), kaldırılan anahtarın 401 alması.
- `testler/test-servis-yoklama.js` — servis uygulamasının anahtarının Aile uçlarında geçmediği.
- `temizle` için otomatik test yok. Elle (yalnız `egitimevi_test` veritabanında): bir konumun `zaman`'ını 8 gün geriye
  çek, test sunucusunu açık bırak (ilk temizlik bir saat sonra çalışır); satır silinmeli.

## Son durum

- Son değişiklik `833e7b4 commit 461` (2026-09-26): dışa açılan adlar (`module.exports`) eklendi. İlk hâli `df4b66b commit
  460` (aynı gün, 026 şema dosyasıyla birlikte): bütün işlevler. Toplam 2 commit.
- Bilinen açıklar (kod değiştirilmedi): `SAKLAMA_GUN`'un SQL'de kullanılmaması, 3 cihaz sınırının işlem dışında olması,
  `temizle` hatalarının sessizce yutulması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "KVKK ve onay metinleri TAM denetimi" konum ve kullanım tablolarını
  aydınlatma metniyle karşılaştıracak (bu dosyadaki 7 günlük saklama orada yazılı olmalı); "Optimizasyon + saklama
  süreleri" saklama sürelerini tek yerde toplayabilir. Bu tablolara yazan istemci telefondaki Aile uygulamasıdır (026'daki
  yoruma göre ayrı bir depoda); gönderim biçimi değişirse `konumEkle`/`kullanimYaz` etkilenir.
