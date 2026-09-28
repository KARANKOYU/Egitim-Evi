# sunucu/bolumler/etut.js

Etütler (`/api/etut`): ders dışında, haftanın belli bir günü ve saatinde yapılan çalışmaların açılması, öğrencileri,
yoklaması ve öğrenciye/veliye görünen etüt dökümü.

## Bu dosya ne yapar?

Okullar ders saatleri dışında etüt yapar: "Salı 15:40–17:00, Matematik etüdü, 12 öğrenci". Bu dosya etüdü açan, gününü,
saatini, öğretmenini ve öğrencilerini değiştiren, her etüt gününde yoklama aldıran ve öğrenciyle velisine etütlerini
ve gelip gelmediğini gösteren uçları sunar. Gelmeyen (ya da izinli sayılan) öğrenciye ve onaylı velilerine bildirim
gider.

Kim ne yapar (dosya başındaki yorum, kodla aynı):

- `etut.yonet` yetkisi (müdür her zaman; "Müdür Yardımcısı" ve "Etüt Sorumlusu" şablonlarında var): etüt açar,
  değiştirir, siler, öğrencilerini yazar, her yoklamayı her gün düzeltir;
- `etut.yoklama` yetkisi ("Nöbetçi Öğretmen" şablonunda da var): bütün etütlerde yoklama alır, geçmiş günler dahil;
- etüdün kendi öğretmeni: yalnız KENDİ etüdünde, yalnız etüt GÜNÜ ve başlangıçtan en erken 15 dakika önce yoklama alır.

Okulda "Etüt" bölümü kapalıysa istek buraya gelmez (`api.js` → [ozellikler.md](ozellikler.md), `etut → etut`).

## İçinde neler var?

### Sabitler

- `DURUMLAR` — `['var', 'yok', 'izinli']` (devamsızlıktaki "geç geldi" burada yok).
- `DURUM_AD` — bildirimdeki adlar: `var` "geldi", `yok` "gelmedi (izinsiz)", `izinli` "gelmedi (izinli)".
- `EN_FAZLA_OGRENCI` — 300 (bir etüdün öğrenci listesi ve bir yoklamada işlenen satır sınırı).

### Dışa açılan işlevler

- `uclar(k)` — aşağıdaki uçlar.
- `tarihGunu(tarih)` — `'2026-09-28'` → 1 (Pazartesi) … 7 (Pazar); biçim bozuk ya da gün takvimde yoksa (ör. 31 Şubat)
  0. Bugün başka dosya çağırmıyor (grep).

### İç işlevler

- `bugun()`, `simdiSaat()` — sunucunun yerel saatiyle `YYYY-AA-GG` ve `SS:DD`. `saatGecerli(s)` (00:00–23:59),
  `dakika(s)`.
- `yonetebilir(me)` = `etut.yonet`; `herYoklama(me)` = `etut.yonet` ya da `etut.yoklama`.
- `yoklamaEngeli(me, e, tarih)` — yoklama alınamıyorsa nedeni (metin), alınabiliyorsa `''`. Sıra: etüt yok → "Etüt
  bulunamadı"; tarih geçersiz → "Tarih geçersiz"; ileri tarih → "İleri bir tarihe yoklama alınmaz"; tarihin günü etüdün
  günü değil → "Bu etüt Salı günleri yapılıyor; seçilen gün Çarşamba."; `herYoklama` varsa serbest; değilse etüdün
  öğretmeni olmalı ("Bu etütte yoklama alma yetkin yok"), tarih bugün olmalı ("…geçmiş günü düzeltmek için etüt
  sorumlusuna söyle.") ve saat başlangıçtan 15 dakika öncesini geçmiş olmalı ("Yoklama etüt başlamadan en erken 15
  dakika önce açılır (15:40).").
- `etutGorunumu(me, e)` — etüt nesnesi + `gunAdi` + `yoklamaAlabilir` (`herYoklama` ya da kendi etüdünün öğretmeni).
- `ogretmenAdaylari(okulId)` — okulun onaylı öğretmenleri ve müdürleri (etüde öğretmen olarak seçilebilecekler).
- `etutGovdesi(me, body)` → `{ d: { ad, gun, baslangic, bitis, yer, ogretmenId } }` ya da `{ hata }`: `ad` zorunlu (80;
  "Etüdün adını yaz (ör. Matematik etüdü)."), `gun` 1–7 ("Günü seç."), saatler `SS:DD` ("Saatleri SS:DD biçiminde yaz
  (ör. 15:40)."), bitiş başlangıçtan sonra, en çok 6 saat ("Bir etüt 6 saatten uzun olamaz."), `yer` 60 harf,
  `ogretmenId` boş olabilir ama verilirse `ogretmenAdaylari` içinde olmalı ("Seçilen öğretmen bu okulda değil.").
- `yoklamaBildir(e, tarih, degisenler)` — durumu DEĞİŞEN ve `var` olmayan öğrenciye "Etüt: <ad> (GG.AA.YYYY) — gelmedi
  (izinsiz)" (`#/etutlerim`), velilerine başında çocuğun adıyla aynı metin; `cokluBildir(…, { veliye: false })`.

### Uçlar

Hepsi `p === 'etut'`; önce `need()` (401/403).

**Öğrenci, veli ve okul için:**

- **`GET /api/etut/ogrenci?studentId=`** — öğrencinin etütleri ve son 60 yoklaması. Öğrenci `studentId` verse de YALNIZ
  kendini görür. Başkası `canSeeStudent` ile geçmeli (yönetici; veli bağı; aynı okulun müdürü; `ogrenci.portal` yetkili öğretmen;
  öğrencinin derslerine giren öğretmen — servisçi geçemez); değilse 403
  "Bu öğrenciyi görme yetkin yok". Cevap `{ etutler: [{ id, ad, gun, gunAdi, baslangic, bitis, yer, ogretmenAdi }],
  yoklamalar: [{ etutId, etutAdi, tarih, durum }] }`. Yoklamalar öğrencinin ŞİMDİKİ okulunun etütlerine süzülür (kod
  yorumu: nakil gelen öğrencinin eski okuldaki yoklamaları yeni okula görünmez).

**Okul personeli (öğretmen ve müdür):** bundan sonra rol `teacher`/`principal` değilse 403 "Bu bölüm okul personeli
içindir", sonra `okulGerek`. Etüt kimliği başka okulunsa "Etüt bulunamadı" (404).

- **`GET /api/etut`** — `herYoklama` olana okulun bütün etütleri, öğretmene yalnız kendi etütleri: `{ etutler: [...,
  gunAdi, yoklamaAlabilir], yonetebilir, herYoklama, bugun }`. Etüt nesnesi `{ id, schoolId, ad, gun, baslangic, bitis,
  yer, ogretmenId, ogretmenAdi, ogrenciSayisi }`; gün, saat, ada göre sıralı.
- **`GET /api/etut/adaylar`** — `etut.yonet` gerekir (403 "Etüt düzenleme yetkin yok"): `{ ogretmenler: [{ id, ad }],
  siniflar: [{ id, ad }], ogrenciler: [{ id, ad, sinifId }] }` (onaylı öğrenciler).
- **`GET /api/etut/detay?id=`** — etüt ve öğrencileri (`{ etut, ogrenciler: [{ id, ad, sinif }] }`); `etut.yonet` ya da
  yoklama alabilen görür, değilse 403 "Bu etüdü görme yetkin yok".
- **`POST /api/etut/kaydet`** — `etut.yonet`. Gövde `{ id?, ad, gun, baslangic, bitis, yer?, ogretmenId? }`; hata 400.
  `id` varsa günceller (işlem kaydı `etut.degistirildi`), yoksa açar (`et` önekli kimlik, `etut.acildi`). Öğretmen yeni
  atandıysa ona "\"<ad>\" etüdü sana verildi (Salı 15:40–17:00)." bildirimi (`#/etutler`). Cevap `{ etut, message:
  'Etüt kaydedildi.' }`.
- **`POST /api/etut/sil`** — `etut.yonet`; gövde `{ id, onay: true }`. `onay` tam `true` değilse 400 "Silmeyi onaylaman
  gerekiyor.". Etüt, öğrencileri ve yoklamaları silinir (tablo ilişkisi `ON DELETE CASCADE`); işlem kaydı `etut.silindi`.
- **`POST /api/etut/ogrenciler`** — `etut.yonet`; gövde `{ id, ogrenciIdler: [...] }`. Tekilleştirilir; 300'den çoksa 400;
  listede okulun öğrencisi olmayan biri varsa (sınıflı sınıfsız fark etmez) 400 "Listede bu okulda olmayan öğrenci var."
  — hiçbiri yazılmaz. Liste bütünüyle yeniden yazılır (tek işlem). İşlem kaydı `etut.ogrenciler`. Cevap `{ ogrenciler,
  message: 'N öğrenci kaydedildi.' }`.
- **`GET /api/etut/yoklama?id=&tarih=`** — yoklama ekranı; `yoklamaAlabilir` değilse 403. `tarih` boşsa bugün, bozuksa
  400 "Tarih geçersiz". Cevap `{ etut, tarih, engel, ogrenciler: [{ id, ad, sinif, durum }] }` — `engel` o tarihte
  kaydetmeyi neyin engelleyeceği (boşsa kaydedilebilir; ekran düğmeyi buna göre kapatır), `durum` henüz alınmadıysa `''`.
- **`POST /api/etut/yoklama`** — gövde `{ id, tarih, kayitlar: [{ ogrenciId, durum }] }`. `yoklamaEngeli` doluysa o
  metinle 400 (etüt yoksa 404). İlk 300 satır işlenir; etüdün öğrencisi olmayan biri varsa 400 "Listede bu etüdün
  öğrencisi olmayan biri var.", geçersiz durum 400 "Geçersiz yoklama durumu", hiç satır yoksa 400 "Yoklamada kimse
  işaretlenmedi.". Depo yalnız durumu DEĞİŞENLERİ yazar (upsert) ve onları döner; onlara bildirim gider, en az biri
  değiştiyse işlem kaydı `etut.yoklama`. Cevap `{ degisen, message }` ("Yoklama kaydedildi." / "Değişiklik yok.").

## Kimle konuşur?

- Çağırdıkları: `../http` (`bad`, `ok`); `../iliskiler` (`GUN_ADLARI`, `canSeeStudent`); `../ortak` (`clean`, `now`,
  `uid`); `../veri` (`depo`); `../yetki` (`okulGerek`, `yetkiVarMi`); `./islem-kaydi` (`islemYaz`,
  [islem-kaydi.md](islem-kaydi.md)).
- Depo ve tablolar:
  - `depo.etutler` (`sunucu/veri/depo/etutler.js`, şema 013) → `etutler`, `etut_ogrencileri`, `etut_yoklamalari`:
    `bul`, `okulun`, `ogretmeninki`, `ogrencininki`, `ekle`, `guncelle`, `sil`, `ogrencileri`, `ogrencileriYaz`,
    `yoklamasi`, `yoklamaYaz`, `ogrenciYoklamalari`;
  - `depo.kullanicilar` → `okulun`, `bul`, `veliHaritasi`; `depo.siniflar.okulun`; `depo.genel.bildir`, `cokluBildir`
    → `bildirimler`.
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM.etut`). Öğrenci okul değiştirince eski okulun etüt üyelikleri
  `sunucu/veri/depo/ogrenci-gecmisi.js`'te silinir.
- Ön yüz: `public/js/parcalar/18b-etut.js` (bütün ekranlar: personelin listesi, düzenleme, öğrenci seçimi, yoklama;
  öğrencinin ve velinin "Etütlerim"i).
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
Müdür / etut.yonet:  adaylar ─> kaydet {ad, gun, saatler, ogretmenId} ─> ogrenciler {ogrenciIdler}
                                   └─ yeni öğretmene bildirim

Yoklama:  GET yoklama?id&tarih  ─> liste + engel ("" ise kaydedilebilir)
          POST yoklama {kayitlar}
             yoklamaEngeli: tarih geçerli? ileri değil? etüdün günü mü?
                            herYoklama ─────────────────────> serbest
                            etüdün öğretmeni + bugün + (başlangıç-15 dk) geçti ─> serbest
             satırlar etüdün öğrencisi mi? durum geçerli mi?
             depo: yalnız değişenleri upsert ─> gelmeyen/izinliye ve velisine bildirim ─> işlem kaydı
```

## Dikkat!

- **Öğretmenin zaman penceresi yalnız alttan sınırlı.** Etüdün öğretmeni başlangıçtan 15 dk önce yoklama alabilir; etüt
  bittikten sonra da aynı gün içinde alabilir (üst sınır yok). Geçmiş bir günü ancak `etut.yoklama`/`etut.yonet` olan
  düzeltebilir.
- Yoklamada "geldi" de yazılır (devamsızlıktan farklı olarak `var` satırı tutulur); böylece "henüz alınmadı" (`''`) ile
  "geldi" ayrılır. Bildirim yalnız `yok` ve `izinli`ye gider; yeniden kaydedilen aynı durum bildirim üretmez.
- Öğrenci listesinden çıkarılan öğrencinin eski yoklama satırları silinmez (`ogrencileriYaz` yalnız
  `etut_ogrencileri`'ni yeniden yazar); öğrencinin dökümünde görünmeye devam eder.
- `detay` ucu `etut.yonet`'i ayrıca kontrol eder, ama `etut.yonet` sahibi zaten `yoklamaAlabilir` sayılır; ikinci koşul
  fazladan.
- `bugun()` ve `simdiSaat()` sunucunun yerel saatini kullanır; sunucu Türkiye saatinde değilse 15 dakika kuralı ve
  "ileri tarih" kayar.
- `ogrenci` ucu okul personeli kapısından ÖNCE durur: öğrenci ve veli de girer. Etüt listesi öğrencinin
  `etut_ogrencileri` satırlarından gelir; okul değişince eski okulun satırları silindiği için yalnız şimdiki okul kalır.
- Silme için gövdede `onay: true` şartı, yanlışlıkla gönderilen bir isteğin etüdü ve bütün yoklamalarını götürmesini
  önler.

## Testleri

- `testler/test-etut.js` — 7 bölüm; etütle ilgili olanlar: hazır Öğretmen rolü ve "Etüt Sorumlusu" şablonu; etüt açma
  (yetkisiz öğretmen açamaz, geçersiz gün/ters saat reddi, öğretmen atama bildirimi, öğrenci ekleme, okul dışı öğrenci
  reddi, öğretmen yalnız kendi etüdünü görür); yoklama (etüdün öğretmeni olmayan açamaz, başka gün ve ileri tarih reddi,
  geçersiz durum ve listede olmayan kişi reddi, aynı yoklama "değişiklik yok", gelmeyene bildirim gider gelene gitmez,
  öğrenci yalnız kendini görür, öğrenci personel listesine giremez, veli yalnız kendi çocuğunu görür, `etut.yoklama`
  verilen öğretmen düzeltebilir, yetkisiz/onaysız silinmez). Aynı paket ödev ve mesaj düzeltmeyi de dener.
- `testler/test-ozellikler.js` — müdür "Etüt"ü kapatınca `GET /api/etut` 403 `ozellikKapali: 'etut'`.
- Elle: müdürle (`testler/seed.js`) `POST /api/etut/kaydet` `{ "ad": "Matematik etüdü", "gun": 2, "baslangic": "15:40",
  "bitis": "17:00", "ogretmenId": "<öğretmen id>" }`, sonra `POST /api/etut/ogrenciler`.

## Son durum

- Tek commit: `bd1f64f commit 346` (2026-09-26) — dosya bütünüyle bu commit'le geldi (261 satır; aynı commit `yetki.js`'in
  yetki listesini ve rol şablonlarını, `hesaplar.js`'e de bir parça ekledi). O günden beri değişmedi.
- Açık iş yok; DEVAM'daki sıradaki işlerden hiçbiri bu dosyayı adıyla anmıyor.
