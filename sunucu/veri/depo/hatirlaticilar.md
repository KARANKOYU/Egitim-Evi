# sunucu/veri/depo/hatirlaticilar.js

Kişisel hatırlatıcıların (`hatirlaticilar`) ve haftalık hatırlatıcının günlerinin (`hatirlatici_gunleri`) SQL'i:
kişinin listesi, tek hatırlatıcı, sayı, zamanlayıcı için açık olanlar, ekleme/düzenleme, durdurma/başlatma, silme ve
"gönderildi" işareti.

## Bu dosya ne yapar?

Herkes (öğrenci, veli, öğretmen, müdür, servisçi, rolsüz yetişkin) kendine hatırlatıcı kurar: başlık, açıklama, saat
ve sıklık — `bir-kez` (belli gün), `her-gun`, `her-hafta` (seçilen günler, 1 Pazartesi … 7 Pazar), `her-ay` (ayın belli
günü; kısa ayda ayın son günü). Zamanı gelince kişiye bildirim (ve telefon bildirimi) gider. Saatler Türkiye saatidir
(şema 024).

Bu dosya kayıtları tutar. "Zamanı geldi mi, sonraki an ne?" hesabı [../../yardimci/hatirlatici-zaman.md](../../yardimci/hatirlatici-zaman.md)'de,
uçlar ve dakikalık gönderici [../../bolumler/hatirlatici.md](../../bolumler/hatirlatici.md)'dedir. Okulun otomatik
hatırlatmaları (öğretmenin günlük dersleri, yarın teslim edilecek ödev) bu tabloyla ilgisizdir:
[../../hatirlatma.md](../../hatirlatma.md).

## İçinde neler var?

İç dönüştürücü `nesne(r)` → `{ id, kullaniciId, baslik, aciklama, siklik, tarih ('YYYY-AA-GG' ya da ''), saat
('SS:DD'), ayGunu (sayı ya da null), gunler: [1..7], aktif, sonGonderim (ISO ya da ''), olusturma }`.
[../esleme.md](../esleme.md) kullanılmaz.

### Ortak sorgu `SEC`

`hatirlaticilar h LEFT JOIN hatirlatici_gunleri g` ve `coalesce(array_agg(g.gun ORDER BY g.gun) FILTER (WHERE g.gun IS
NOT NULL), '{}') AS gunler`; her kullanımda `GROUP BY h.id` eklenir (günler tek satırda dizi olarak gelir).

### İşlevler

- `kisinin(kullaniciId)` — kişinin bütün hatırlatıcıları, `olusturma` sırasıyla (`hatirlaticilar_kisi (kullanici_id,
  olusturma)` indeksiyle).
- `bul(id)` — tek hatırlatıcı ya da `null`. Kişi süzmez.
- `sayisi(kullaniciId)` — kişinin hatırlatıcı sayısı (`Number`).
- `aktifler()` — zamanlayıcı için AÇIK olanların hepsi (bütün kullanıcılar; `WHERE h.aktif`).
- `ekle(h)` — işlemde: `INSERT INTO hatirlaticilar (id, kullanici_id, baslik, aciklama, siklik, tarih, saat, ay_gunu)`
  (boş tarih ve ay günü `NULL`), sonra günleri yazar; sonunda `bul`. Şema: başlık 1–120, açıklama ≤ 1000, sıklık dört
  değerden biri, `bir-kez`'de tarih ve `her-ay`'da ay günü zorunlu, gün 1–7, ay günü 1–31 (aykırıysa `23514`).
- `guncelle(id, h)` — işlemde bütün alanları yazar VE `aktif = true`, `son_gonderim = NULL`, `olusturma = now()` yapar,
  sonra günleri yeniden yazar; sonunda `bul`. Düzenlenen hatırlatıcı "baştan sayılır": yeni saat bugün geçmişse ilk
  hatırlatma yarın gelir, geçmiş anlar topluca gelmez.
- `aktifYaz(id, aktif)` — durdurur ya da yeniden başlatır; başlatırken `olusturma = now()` da yazılır (aynı "baştan
  sayma" nedeniyle).
- `sil(id)` — siler; günleri CASCADE ile gider.
- `gonderildi(id, zaman, bitti)` — `son_gonderim = zaman`; `bitti` doğruysa (bir kezlik) `aktif = false`.
- İç yardımcı `gunleriYaz(id, gunler)` — günleri silip tek tek ekler (her zaman `islem` içinden çağrılır).

### Tablolar ve şema

| Tablo / kısıt / indeks | Şema dosyası |
|---|---|
| `hatirlaticilar` (`kullanici_id` `ON DELETE CASCADE`, sıklık CHECK'i, `bir-kez` → tarih, `her-ay` → ay günü, `aktif`, `son_gonderim`, `olusturma`; `hatirlaticilar_kisi (kullanici_id, olusturma)` ve `hatirlaticilar_aktif (id) WHERE aktif` indeksleri), `hatirlatici_gunleri` (`PRIMARY KEY (hatirlatici_id, gun)`, gün 1–7, CASCADE) | `024-hatirlaticilar.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.hatirlaticilar`): yalnız
  [../../bolumler/hatirlatici.md](../../bolumler/hatirlatici.md) — `GET /api/hatirlaticilar` (`kisinin`), `POST`
  (`sayisi` ile 50 sınırı + `ekle`), `POST /api/hatirlaticilar/<id>` (`bul` + sahiplik + `guncelle`), `/<id>/durum`
  (`aktifYaz` + `bul`), `/<id>/sil` (`sil`) ve dakikalık `hatirlaticilariGonder` (`aktifler`, `gonderildi`).
- Dakikalık gönderici [../../index.md](../../index.md)'de `setInterval(…, 60 * 1000)` ile kurulur.
- Tablolar: `hatirlaticilar`, `hatirlatici_gunleri`.

## Nasıl çalışır (adım adım)?

### Dakikalık gönderim

```
sunucu/index.js her 60 sn → hatirlaticilariGonder()
  (bir önceki tur sürüyorsa atla: "calisiyor")
  aktifler()                          → bütün açık hatırlatıcılar, günleriyle
  her biri: zaman.zamaniGeldi(h, şimdi)
              bugün ya da dün uygun gün mü? an ≤ şimdi, en çok 6 saat gecikmiş,
              an > son_gonderim ve an > olusturma ("baştan sayma")
            → gonderildi(id, an, bir kezlikse kapat)   ← ÖNCE işaret
            → bildir(kişi, 'Hatırlatma: …', { veliye: false })
```

### Düzenleme

```
POST /api/hatirlaticilar/<id> → bul → sahibi mi? (değilse 404) → dogrula
  guncelle: islem { UPDATE … aktif = true, son_gonderim = NULL, olusturma = now() ; DELETE günler ; INSERT günler }
```

## Dikkat!

- **Sahiplik bölümde:** `bul`, `guncelle`, `aktifYaz`, `sil` kimlikle çalışır. Bölüm `h.kullaniciId !== me.id` ise
  "Hatırlatıcı bulunamadı" (404) der; başkasının hatırlatıcısının varlığı bile belli olmaz.
- **`olusturma` "kuruluş anı" değil "sayım başlangıcı"dır:** düzenleme ve yeniden başlatma onu `now()` yapar. Liste
  `olusturma`'ya göre sıralandığı için düzenlenen hatırlatıcı listenin sonuna geçer.
- **Önce işaret, sonra bildirim:** `gonderildi` bildirimden önce yazılır; bildirim yazılırken hata olursa hatırlatma
  yeniden gönderilmez (çift bildirim yerine kaybı seçen bir düzen). Gönderici tek süreç içinde `calisiyor` bayrağıyla
  üst üste binmez; birden çok sunucu süreci aynı hatırlatmayı iki kez gönderebilirdi.
- **50 sınırı kilitsiz:** `sayisi` ile `ekle` ayrı adımlardır; aynı anda iki ekleme 51. hatırlatıcıyı geçirebilir
  (zararsız).
- **Ölçek:** `aktifler` her dakika BÜTÜN açık hatırlatıcıları (günleriyle) okur ve zaman hesabı JavaScript'te yapılır.
  Kişi başına en çok 50; kullanıcı sayısı çok büyürse "şu saat aralığında olanlar" diye SQL'de süzmek gerekir.
- **Saat dilimi:** `tarih` ve `saat` Türkiye saatidir; ana dönüştürme `hatirlatici-zaman.js`'tedir. `son_gonderim`
  gönderilen ANIN kendisidir (ISO), gönderim zamanı değil.
- **Güvenlik:** bütün değerler parametreyle. Hatırlatıcı yalnız sahibine gider (`veliye: false`: öğrencinin kendi
  hatırlatıcısı velisine kopyalanmaz).

## Testleri

- `testler/test-hatirlatici.js` — öğrencinin listesi, haftalık/bir kezlik/her gün/ayda bir kurma ve sonraki anın
  hesaplanması, öğretmen/müdür/rolsüz yetişkinin de kurabilmesi, geçersiz girdilerin reddi (başlıksız, gün yok, 8 ve 0.
  gün, bozuk saat, geçmiş gün, ayın 32'si, nesne başlık → 400), başkasının görememesi/düzeltememesi/silememesi,
  düzenleme, durdurma ("sonraki" boşalır), yeniden başlatma, silme, kişi başına 50.
- `testler/test-hatirlatici-zaman.js` — zaman hesabı (Türkiye saati, hafta günü, ayın son günü) — bu dosyayı değil
  yardımcıyı sınar.
- Elle: iki dakika sonrasına bir kezlik hatırlatıcı kur → dakikalık turda bildirim gelmeli ve hatırlatıcı "durdu"
  görünmeli (bir kezlik kapanır).

## Son durum

- Tek commit: `37b3ef2 commit 436` (2026-09-26) — dosya 024 şema dosyasıyla bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): `aktifler`'in her dakika tüm açık hatırlatıcıları okuması, 50 sınırının kilitsiz
  olması, çok süreçli çalışmada çift gönderim olasılığı.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Mesaj ayarları … Ajanda, … duyurudan ajanda + hatırlatıcı, ödev
  hatırlatma otomasyonu"** bu dosyayı en çok etkileyecek iş: duyurudan tek tıkla hatırlatıcı kurulacak (hatırlatıcıya
  kaynak mesaj bağlantısı gerekebilir) ve ajanda hatırlatıcıları gösterecek. "Optimizasyon" işi `aktifler`'in yükünü
  gözden geçirebilir.
