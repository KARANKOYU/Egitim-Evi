# sunucu/veri/depo/okul-hayati.js

Okulun gündelik hayatının SQL'i: yemek listesi, servisler ve servisteki öğrenciler (durak, sabah/akşam sırası),
servisçi ataması, öğrencinin ev konumu, canlı seferler (yalnız son konum), yaklaşma bildirimi işareti ve kulüpler.

## Bu dosya ne yapar?

"Okul hayatı" menüsündeki üç şeyin (Yemek, Servis, Kulüpler) verisi burada okunur ve yazılır. Uçlar ve kim neyi görür
kuralları [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md)'dedir; servis yoklaması (bindi/indi) ayrı dosyada:
[servis-yoklama.md](servis-yoklama.md).

Bu dosyanın asıl işi aynı anda gelen isteklere dayanıklı yazmak:

- Bir serviste aynı anda tek açık sefer olur; iki servisçi isteği (ya da "Başlat"a iki kez basmak) iki sefer açmasın diye
  `seferAcYaDaBul` servis satırını kilitleyip tek işlemde bakar ve açar.
- Kulüp kontenjanı kulüp satırı kilitlenerek denetlenir: aynı anda gelen iki "Katıl" kontenjanı aşamaz (`uyeEkle`).
- Servise öğrenci yazılırken servis ile öğrencinin aynı okulda olması SQL'in içinde şarttır (`servisOgrenciYaz`).

Konum konusunda gizlilik kararı: aracın yalnız SON konumu tutulur, geçmiş iz saklanmaz; seferler 30 gün sonra silinir.

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md)'yi kullanmaz: işlevler ham satır (sütun adlarıyla, `okul_id`, `sofor_id` …) döner,
nesneyi bölüm kurar.

### Yemek listesi (`yemek_listesi`)

- `yemekler(okulIdler, bas, bit)` — okulların `[bas, bit]` aralığındaki menüleri: `{ okul_id, tarih, menu, kalori }`,
  tarih sırasıyla. Birden çok okul alır (velinin çocukları farklı okullarda olabilir).
- `yemekYaz(okulId, liste)` — `liste = [{ tarih, menu, kalori }]`; tek işlemde: menüsü boş gün silinir, öbürleri
  `ON CONFLICT (okul_id, tarih) DO UPDATE` ile yazılır (`kalori` yoksa `NULL`).

### Servisler (`servisler`, `servis_ogrencileri`)

- `SERVIS_ALANLARI` (iç) — servisin sütunları + servisçi hesabının adı ve telefonu (`sofor_hesap_adi`,
  `sofor_hesap_tel`, alt sorgu) + öğrenci sayısı (`ogrenci_sayisi`).
- `okulunServisleri(okulId)` — okulun servisleri, ada göre.
- `servisBul(id)` — tek servis ya da `null`. Okul süzmez.
- `servisOgrencileri(okulId)` — yönetim ekranı: okulun bütün servislerindeki öğrenciler `{ servis_id, ogrenci_id, durak,
  sira_sabah, sira_aksam, ad, sinif }`.
- `ogrencilerinServisi(ogrenciIdler)` — öğrenci ve veli ekranı: her öğrencinin servisi, `SERVIS_ALANLARI` + `ogrenci_id,
  durak, sira_sabah, sira_aksam`.
- `servisKaydet(s, yeni)` — `s = { id, okulId, ad, plaka, sofor, soforTel, rehber, rehberTel, sabah, aksam, guzergah }`.
  Yeniyse `INSERT ... ON CONFLICT (okul_id, ad) DO NOTHING` (aynı adlı servis varsa 0 döner); değilse `UPDATE ... WHERE
  id = $1 AND okul_id = $2` (başka okulun servisi değişmez, 0 döner). Dönüş etkilenen satır sayısı.
- `servisAdVarMi(okulId, ad, haricId)` — büyük/küçük harfe duyarsız (`lower(ad)`) ad denetimi.
- `servisSil(id, okulId)` — okul koşullu silme; servisteki öğrenci satırları, seferler (ve onların yaklaşma bildirimi
  işaretleri), servis yoklamaları, sefer günleri ve servisçi notları yabancı anahtarla `CASCADE` gider.
- `servisOgrenciYaz(servisId, ogrenciId, durak)` — `INSERT ... SELECT FROM servisler s JOIN kullanicilar k ON k.okul_id =
  s.okul_id WHERE ... k.rol = 'student'`: servis ve öğrenci aynı okulda değilse hiçbir şey yazılmaz (0). Öğrenci başka
  servisteyse oraya TAŞINIR (`ON CONFLICT (ogrenci_id)`; bir öğrenci tek serviste). Yeni gelen öğrenci sabah ve akşam
  sırasının sonuna (`max + 1`) eklenir; aynı serviste kalıp yalnız durağı değişiyorsa sırası korunur.
- `siraYaz(servisId, donem, idler)` — servisçinin düzenlediği sıra: `unnest($2) WITH ORDINALITY` ile `sira_sabah` ya da
  `sira_aksam` 1, 2, 3 … yazılır (yalnız o servisin satırları). İki ayrı sabit SQL (`SIRA_SABAH_YAZ`, `SIRA_AKSAM_YAZ`):
  sütun adı değişkenden kurulmaz.
- `servisOgrenciCikar(ogrenciId, okulId)` — öğrenciyi, yalnız bu okulun bir servisindeyse çıkarır.
- `servisSoforYaz(servisId, okulId, soforId)` — tek işlemde: servisçi atanır ya da (boşsa) kaldırılır; atanan hesap bu
  okulun servisçisi (`rol = 'servisci'`) değilse hiçbir şey yazılmaz (0). Servisçi değiştiyse servisin eski servisçiyle
  açık seferi kapanır (konumu artık bu servisin öğrencilerine gitmez). Dönüş değişen satır sayısı.
- `soforunServisleri(soforId)` — servisçinin servisleri.
- `servisinOgrencileri(servisId)` — servisçi ekranı, yoklama ve yaklaşma hesabı: öğrenciler + sınıf + ev konumu
  (`enlem`, `boylam`; yoksa `NULL`) + sıralar.

### Ev konumu (`ogrenci_konumlari`)

- `evKonumu(ogrenciId)` — `{ ogrenci_id, enlem, boylam, guncelleme }` ya da `null`.
- `evKonumuYaz(ogrenciId, enlem, boylam, girenId)` — upsert; kimin girdiği ve `guncelleme = now()` yazılır.
- `evKonumuSil(ogrenciId)`.

### Seferler (`servis_seferleri`, `sefer_bildirimleri`)

- `SEFER_ALANLARI` (iç) — `id, servis_id, sofor_id, yon ('gidis'|'donus'), baslangic, bitis, son_enlem, son_boylam,
  son_dogruluk, son_konum`.
- `acikSefer(servisId)` — servisin açık seferi ya da `null`.
- `seferBul(id)`.
- `seferAcYaDaBul(s, surerMi)` — `s = { id, servisId, soforId, yon }`. İşlemde: servis satırı `FOR UPDATE`; açık sefer
  varsa ve `surerMi(acik)` "kullanılabilir" derse `{ sefer: acik, yeni: false }`; değilse açık sefer kapanır, yenisi açılır
  → `{ sefer, yeni: true }`. `surerMi` (saat aralığı, yön, servisçi) bölümün kararıdır ve kilit içinde çağrılır.
- `seferBitir(id, soforId)` — yalnız seferin servisçisi, yalnız açıkken kapatır.
- `seferKonumYaz(id, soforId, enlem, boylam, dogruluk)` — son konumu yazar; yalnız açık seferde ve seferin servisçisi
  (`WHERE id AND sofor_id AND bitis IS NULL`). Dönüş 0 ise konum kabul edilmedi.
- `seferBildirimiIsaretle(seferId, ogrenciId, esik)` — yaklaşma bildirimi (500 m, 100 m) bu seferde bu öğrenciye bu eşikte
  gitti mi: `INSERT ... ON CONFLICT DO NOTHING`; 1 dönerse yeni (bildirim gönderilmeli), 0 ise daha önce gitmiş.
- `seferTemizle()` — servisçisi olmayan ya da 45 dakikadır konum gelmeyen (konum hiç gelmediyse başlangıçtan beri) açık
  seferler kapanır; 30 günden eski kapanmış seferler silinir. Saat aralığı ve 60 dakikalık uzatması biten seferleri
  bölüm kapatır (Türkiye saatiyle, JavaScript'te).
- `acikSeferler()` — bütün açık seferler, okullarının servis saatleriyle (`servis_sabah_bas` …; aralık dışında kalanları
  bulmak için).
- `seferleriKapat(idler)` — verilen açık seferleri kapatır (boş listede sorgu atmaz, 0).
- `servisSeferiniBitir(servisId)` — servisin açık seferini kapatır ("Okula vardık", akşam son öğrenci indi).
- `seferiGeriTarihle(id, dakika)` — başlangıcı dakika kadar geri çeker (bakım ve testler; uzatma denenir).

### Kulüpler (`kulupler`, `kulup_uyeleri`)

- `KULUP_ALANLARI` (iç) — kulüp sütunları + danışmanın adı + üye sayısı.
- `okulunKulupleri(okulId)`, `kulupBul(id)` (okul süzmez).
- `ogrencilerinKulupleri(ogrenciIdler)` — `[{ ogrenci_id, kulup_id, ad, gun_saat, danisman_adi }]`.
- `kulupUyeleri(kulupId)` — `[{ id, ad, sinif, tarih }]`.
- `kulupKaydet(u, yeni)` — `servisKaydet` gibi: yenide `ON CONFLICT (okul_id, ad) DO NOTHING`, güncellemede okul koşullu.
  `danismanId`, `kontenjan` boşsa `NULL` (kontenjan `NULL` = sınırsız).
- `kulupAdVarMi(okulId, ad, haricId)`, `kulupSil(id, okulId)` (okul koşullu).
- `uyeEkle(kulupId, ogrenciId, sadeceAcikken)` — işlemde, kulüp satırı `FOR UPDATE`: kulüp yoksa ya da öğrenci aynı okulun
  öğrencisi değilse `'yok'`, zaten üyeyse `'zaten'`, `sadeceAcikken` (öğrenci kendisi katılıyor) ve başvuru kapalıysa
  `'kapali'`, kontenjan doluysa `'dolu'`, yazdıysa `'tamam'`.
- `uyeCikar(kulupId, ogrenciId, sadeceAcikken)` — `sadeceAcikken` ise yalnız başvuru açıkken; dönüş silinen satır sayısı.

### Tablolar ve şema

| Tablo / sütun | Şema dosyası |
|---|---|
| `yemek_listesi` (`(okul_id, tarih)`, menü 1–500, kalori 1–5000), `servisler` (`UNIQUE (okul_id, ad)`, saat biçimi CHECK'leri), `servis_ogrencileri` (anahtar `ogrenci_id`: bir öğrenci tek serviste; `servis_ogrencileri_servis`), `kulupler` (`UNIQUE (okul_id, ad)`, kontenjan 1–1000), `kulup_uyeleri` (`(kulup_id, ogrenci_id)`, `kulup_uyeleri_ogrenci`) | `007-okul-hayati.sql` |
| `okullar.enlem/boylam`, `servisler.sofor_id` + `servisler_sofor`, `ogrenci_konumlari`, `servis_seferleri` (`servis_seferleri_tek_acik`: serviste tek açık sefer), `sefer_bildirimleri` | `010-servis-konum.sql` |
| servis telefonlarının `+90` biçimine çevrilmesi | `015-telefon-ulke-kodu.sql` |
| okulun servis saatleri (`servis_sabah_bas` …), `servis_ogrencileri.sira_sabah/sira_aksam` (eskilere ad sırasıyla numara) | `028-servis-yoklama.sql` |

## Kimle konuşur?

- Çağırdıkları: yalnız [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.okulHayati`):
  - [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md) — neredeyse her işlev; oradaki `servisTemizle`
    (sunucu/index.js'teki zamanlayıcıyla 10 dakikada bir, ayrıca servis saatleri değişince) `seferTemizle`,
    `acikSeferler`, `seferleriKapat`'ı çağırır.
  - [../../bolumler/cihaz.md](../../bolumler/cihaz.md) — telefon uygulaması: `ogrencilerinServisi`, `soforunServisleri`.
  - [../../bolumler/kisi-aktarim.md](../../bolumler/kisi-aktarim.md) — Excel'den servisçi aktarırken `okulunServisleri`,
    `servisSoforYaz`.
  - `testler/test-servis-yoklama.js` — doğrudan `require`: `seferiGeriTarihle`.

## Nasıl çalışır (adım adım)?

### Sefer açma (ilk "Bindi" ya da "Seferi başlat")

```
islem {
  servisler satırı FOR UPDATE              ← aynı servise gelen ikinci istek burada bekler
  açık sefer var mı?
     var ve surerMi(sefer) → { sefer, yeni: false }
     yoksa ya da sürmüyorsa → açık seferi kapat → yeni sefer INSERT → { sefer, yeni: true }
}
```

Veritabanındaki `servis_seferleri_tek_acik` kısmi tekil indeksi de ikinci açık seferi reddeder; kilit, bu hatanın hiç
oluşmamasını sağlar.

### Kulübe katılma

```
islem { kulüp FOR UPDATE → öğrenci aynı okulda mı → zaten üye mi → başvuru açık mı → kontenjan → INSERT }
```

## Dikkat!

- **Bazı okumalar okul süzmez:** `servisBul`, `kulupBul`, `seferBul`, `acikSefer`, `servisinOgrencileri`,
  `kulupUyeleri`, `evKonumu`/`evKonumuYaz`/`evKonumuSil`, `siraYaz`. Bölüm sonucu `okul_id === me.schoolId` ya da
  `sofor_id === me.id` ile denetler (ör. servisçinin kendi servisi, kulübün kendi okulu); yeni bir çağıran da denetlemeli.
  Yazmalardan okul koşulunu SQL'de taşıyanlar: `servisKaydet` (güncelleme), `servisSil`, `servisOgrenciYaz`,
  `servisOgrenciCikar`, `servisSoforYaz`, `kulupKaydet` (güncelleme), `kulupSil`, `uyeEkle`.
- **Yeni sıra numarası yarışı:** `servisOgrenciYaz`'daki `max(sira) + 1` kilitsizdir; aynı servise aynı anda iki öğrenci
  eklenirse ikisi aynı sıra numarasını alabilir (sıra sütunlarında tekillik yok). Sonuç yalnız sıralamada eşitliktir;
  servisçi sırayı yeniden kaydedince (`siraYaz`) düzelir.
- **`siraYaz` listeyi denetlemez:** listede olmayan öğrencinin sırası eski kalır. Bölüm, listenin servisin öğrencileriyle
  birebir aynı olmasını ister ("Sıra listesi servisin öğrencileriyle birebir aynı olmalı").
- **`seferAcYaDaBul`'daki `surerMi` kilit içinde çalışır;** içinde veritabanı sorgusu ya da uzun iş yapma (bugün saf
  hesap).
- **`servisKaydet` / `kulupKaydet` yeni kayıtta ad çakışmasını sessizce yutar** (`DO NOTHING` → 0). Bölüm önce
  `servisAdVarMi`/`kulupAdVarMi` ile büyük/küçük harfe duyarsız bakar; `UNIQUE (okul_id, ad)` ise harfe duyarlıdır. İkisi
  arasında "Servis 1" ile "servis 1" ayrımı yalnız ön denetimle yakalanır.
- **Saat:** `seferTemizle`'deki 45 dakika ve 30 gün `now()` ile (UTC, mutlak süre) hesaplanır, saat dilimi fark etmez;
  servis saat aralığı ise Türkiye saatiyle bölümde hesaplanır.
- **Gizlilik:** sefer satırında yalnız son konum durur; konum bildirimi ve yaklaşma hesabı ev konumunu kullanır; ev konumu
  yalnız öğrenci, velisi, o servisin servisçisi ve okul yönetimine gösterilir (kural bölümde, 010 şema açıklamasında).

## Testleri

- `testler/test-okul-hayati.js` — yemek listesi, servis bilgisi görünürlüğü (şoför telefonu yalnız o servisin öğrencisine,
  velisine, yönetime), başka okulun servisine öğrenci yazılamaması (`servisOgrenciYaz`'ın okul şartı), aynı anda gelen
  isteklerde kulüp kontenjanının aşılmaması (`uyeEkle` kilidi), başvuru kapalıyken katılıp ayrılamama.
- `testler/test-servis-konum.js` — servisçi ataması (yalnız kendi okulunun servisine; başka servisçiye verilince eskisinin
  seferi kapanır), konumu yalnız seferin servisçisinin açık seferde yazması, 500 m / 100 m yaklaşma bildiriminin birer
  kez gitmesi, ev konumu görünürlüğü.
- `testler/test-servis-yoklama.js` — sefer açma/kapama, sıra, servis saatleri; `seferiGeriTarihle` ile uzatma.
- `testler/test-servis-pencere.js` (sunucusuz) — saat aralığı hesabı ([../../yardimci/servis-pencere.md](../../yardimci/servis-pencere.md)),
  bu dosyaya dolaylı.
- Elle: müdür bir servis açıp servisçi ata; servisçi hesabından "Seferi başlat"a iki kez hızlıca bas → tek sefer açılmalı.

## Son durum

- Son değişiklik `24050a2 commit 518` (2026-09-27): servis yoklaması işiyle sabah/akşam sırası (`sira_sabah`,
  `sira_aksam`, `siraYaz`), `servisOgrencileri`/`ogrencilerinServisi`/`servisinOgrencileri`'ne sıra sütunları, yeni
  öğrencinin sona eklenmesi. Öncesi `aced02f commit 312`, `3ad40a9 commit 308`, `c9e9a89 commit 305`; ilk hâli
  `ee23aa2 commit 304` (2026-09-26); toplam 5 commit.
- Bilinen açıklar (kod değiştirilmedi): sıra numarası yarışı ve ad çakışmasının harf duyarlılığı (yukarıda).
- Sıradaki planlı işler (DEVAM.md 4. bölüm): bu dosyaya doğrudan bir tanım yok. "Android yerel uygulama" servisçi ve veli
  ekranlarını uygulamaya taşıyacak (aynı sorgular [../../bolumler/cihaz.md](../../bolumler/cihaz.md) üzerinden);
  "Optimizasyon + saklama süreleri" seferlerin 30 günlük silinmesini genel saklama kurallarıyla birleştirebilir.
