# testler/test-odev-dosya.js

Öğrencinin ödeve yüklediği teslim dosyalarını baştan sona deneyen sunuculu test paketi (67 denetim): yükleme ve ad temizliği,
kimin görüp indirebildiği, öğretmenin zip'i, sayı sınırı ve silme, tarayıcıda açma (fotoğraf, video parça parça), "Öğrenciler bu
ödeve dosya yükleyebilsin" izni, 50 MB sınırı, dosyaların ne zaman silineceği ve okulun disk sınırı.

## Bu dosya ne yapar?

Dosya yükleme sitenin en tehlikeli işlerinden biri. Kötü niyetli ya da sadece meraklı bir öğrenci dosya adına
`../../windows\system32\` yazabilir, `.exe` yükleyebilir, 300 MB'lık bir video gönderip sunucunun belleğini doldurmaya
çalışabilir, başkasının dosyasının kimliğini tahmin edip indirmeye kalkabilir. Yüklenen bir HTML dosyası tarayıcıda sayfa olarak
açılırsa oturum çalınabilir. Öte yandan öğretmenin işi kolay olmalı: bütün teslimleri öğrenci klasörlerine ayrılmış tek bir zip
olarak indirmeli, öğrencinin çektiği fotoğrafı ya da videoyu tarayıcıda açıp ileri sarabilmeli.

Bu paket [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md)'deki her güvenlik kararını ve her sınırı gerçek
isteklerle dener. Dosya başındaki yorum sözünü şöyle veriyor (kısaltarak): yalnız ödevdeki öğrenci, teslim açıkken, izinli
türde ve sınır içinde yükler; dosya adı temizlenir, içerik bayt bayt geri gelir; indirme her zaman "ek" olarak gider; başka
öğrenci, başka öğretmen, bağsız veli erişemez; zip geçerlidir; sayı sınırı, sonuçlandırılmış ve süresi geçmiş ödev, büyük dosya
reddedilir; "dosya yükleyebilsin" varsayılan kapalıdır; tek dosya ve öğrencinin bir ödevdeki toplamı 50 MB'tır; silinme anı son
teslim + 7 gündür (son teslimsiz ödevde yüklemeden 60 gün, sonuçlandırılınca + 7 gün; yanlışlıkla geçmişe yazılan son teslim
dosyaları hemen sildirmez); okulun disk sınırının %80'inde ve dolunca müdüre ve yöneticiye birer kez haber gider. Eklerin ve
okul sayfası fotoğraflarının disk sayımı ayrı pakettedir: [test-okul-disk.md](test-okul-disk.md).

## İçinde neler var?

### Yardımcılar

- `BASE` — `EE_BASE` ya da `http://localhost:3000` (dosyanın kendi kopyası; [giris.md](giris.md)'dekiyle aynı kural). `MB`
  (`1024 * 1024`).
- `kontrol(ad, sart, detay)`, `J(x)` (180 karakterlik JSON), `gun(n)` (`Date.now() + n gün`, `YYYY-AA-GG`; UTC takvim günü).
- `yukle(token, odevId, ad, veri)` — `fetch` ile `POST /api/odev-dosya/yukle?odev=<id>`; gövde dosyanın kendisi,
  `Content-Type: application/octet-stream`, `X-Dosya-Adi: encodeURIComponent(ad)`, token verilirse `Authorization`. Cevap JSON
  değilse `body` `{}`. Döner: `{ status, body }`.
- `indir(token, yol)` — oturumlu `GET`; döner: `{ status, headers, veri }` (`veri` bir `Buffer`).
- `buyukBildir(token, odevId, boyut, yol)` — Node'un `http.request`'iyle **büyük boyut bildirip yalnız 1 KB gönderir**
  (`Content-Length` varsayılan 300 MB, `X-Dosya-Adi: video.mp4`). Sunucu gövdeyi okumadan cevap vermeli; cevap gelince istek
  kesilir. `yol` verilirse başka bir yükleme adresi (6. bölümde mesaj eki). Döner: `{ status, body }` (`body` düz metin);
  bağlantı hatasında `{ status: 0 }`.
- `zipOku(buf)` — zip'i baştan okur: her yerel başlığı (`0x04034b50`) ayırır, adı ve verisini alır, verinin CRC32'sini
  (`zlib.crc32`) başlıktakiyle karşılaştırır; sondaki merkez dizin kaydının (`0x06054b50`) yerinde olduğunu ve girdi sayısını
  tuttuğunu denetler. Döner: `{ girdiler: [{ ad, veri, crcDogru }], sonDogru }`.
- `supurmeDene()` — saatlik temizliğin silme sorgusunu **test sürecinin içinden** çalıştırır: `EE_DATA`'yı `testler/testdata`
  yapar, ayarları oradan yükler (`ayarlariYukle`), bağlanılan veritabanının adı `_test` ile bitmiyorsa `null` döner; bitiyorsa
  `depo/odev-dosyalari.js`'in `eskileriSil()`'ini çağırır (silinme anı gelmiş kayıtları gerçekten SİLER), havuzu kapatır ve
  silinen kimlikleri döner.

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`.

### Hesaplar ve veriler

Seed'den ([seed.md](seed.md)): Matematik öğretmeni (`mat`; ödevleri veren), Fen öğretmeni (`fen`; ödevi vermeyen öğretmen),
öğrenciler `ogrenci1` (`o1`, seed adı Zeynep Şahin) ve `ogrenci2` (`o2`, Burak Öztürk); 8. bölümde müdür (`mudur@test.com`) ve
sistem yöneticisi. Paketin açtığı tek hesap: rolsüz yetişkin `dosyaveli<z>` (`z = Date.now()`); `o1`'in veli kodunu
(`GET /api/me` → `user.code`) `POST /api/parent/link` ile girerek velisi olur.

`odevAc(baslik, bitis)` — `mat` ödevi `o1` ve `o2`'ye verir: Matematik, başlangıç dün, son teslim `bitis` 23:59 ve
`dosyaYukleme: true` (izin yeni ödevde varsayılan kapalı olduğu için açıkça açılır). Paketin ödevleri (hepsinin adı `<z>` ile
biter): "Proje ödevi" (3 gün sonra), "Eski ödev" (dün), "Medya ödevi", "İzin ödevi" ve "Dizgi izin" (izni kapalı başlar; `odevAc`
kullanılmaz), "Sınır ödevi", "Silinme ödevi" (10 gün sonra), "Süresiz ödev" (son teslimsiz, yalnız `o1`), "Geçmiş tarih ödevi"
(5 gün sonra), "Kota ödevi".

### 1) Yükleme (9)

`o1` "Proje ödevi"ne `Ödev 1.pdf` (5000 rastgele bayt) yükler: 200, kimlik 32 haneli onaltılık, boyut 5000. Adı
`../../windows\system32\gizli.pdf` olan dosya `gizli.pdf` adıyla kaydedilir (yol parçaları atılır). `oyun.exe` 415; boş dosya
411 (400 de kabul edilir); oturumsuz 401; öğretmen öğrenci yerine yükleyemez (403). 300 MB bildiren istek gövdesi okunmadan
413; 50 MB + 1 bayt da 413 ve iletide "50 MB". `o2` `burak.docx` yükler (200).

### 2) Görme ve indirme (12)

- `o1`'in listesinde yalnız kendi iki dosyası, `yukleyebilir: true`.
- Kendi dosyasını indirir: içerik bayt bayt aynı; başlıklar `Content-Disposition: attachment; …; filename*=UTF-8''%C3%96dev%201.pdf`,
  `Content-Type: application/octet-stream`, `X-Content-Type-Options: nosniff`, CSP'de `sandbox`.
- `o2` o dosyayı indiremez (403); `fen` ne listeyi ne dosyayı görür (403, 403).
- Veli `?ogrenci=<o1>` ile listeyi görür (2 dosya, `yukleyebilir: false`) ve indirir (200); `o2`'nin listesi ve dosyası 403.
- Uydurma kimlik (`../../ayarlar.json`) 404: kimlik bir dosya yoluna dönüşmez.
- Öğretmenin listesi `yonetir: true`, üç dosya, aralarında "Burak Öztürk"ün dosyası.
- Öğretmenin zip'i (`GET /api/odev-dosya/zip?odev=`): 200, üç girdi, hepsinin CRC32'si doğru, merkez dizin yerinde, boyut
  `Content-Length` ile aynı; girdiler öğrenci klasörlerinde (`Zeynep Şahin/Ödev 1.pdf`, `Burak Öztürk/burak.docx`) ve ilk
  dosyanın içeriği yüklenenle aynı. Öğrenci zip alamaz (403).

### 3) Sınırlar ve silme (6)

`o1` sekiz küçük dosya daha yükler (toplam 10); on birinci 400 ve iletide "10 dosya". `o1` `gizli.pdf`'i siler (200; sonra
indirmek 404); `o2`'nin dosyasını silemez (403); öğretmen silebilir (200). Ödev sonuçlandırılınca (`POST …/finish`) yükleme de
silme de 400. Son teslimi dün olan "Eski ödev"e yükleme 400 ve iletide "süresi doldu".

### 4) Fotoğraf, video, ses: tarayıcıda açma (9)

"Medya ödevi"ne `deney.png` (PNG imzası + 3000 rastgele bayt), `sunum.mp4` (50 000 bayt) ve `rapor.pdf` yüklenir (üçü de 200).

- Öğretmen fotoğraf için `GET /api/odev-dosya/bilet?tur=goster&id=` ister: 200, `tur: 'resim'`, yol `…/goster?bilet=…`.
  Oturumsuz açılır: 200, `image/png`, `inline`, `nosniff`, CSP'de `sandbox`.
- Videonun gösterme biletiyle `Range: bytes=100-199` → 206, tam 100 bayt, `Content-Range: bytes 100-199/50000`, `video/mp4`;
  aynı bilet ikinci kez (`bytes=0-9`) yine 206: gösterme bileti video parça parça inerken yeniden kullanılır.
- PDF tarayıcıda açılmaz (bilet isteği 400); başka öğrenci fotoğrafın biletini alamaz (403).
- `tur=dosya` indirme bileti ise tek kullanımlık: ilk açılış 200 ve `attachment`, ikincisi 410.
- "Proje ödevi" silinince (`POST …/delete`) ilk dosyası 404.

### 5) Dosya yükleme izni (11)

"İzin ödevi" `dosyaYukleme` gönderilmeden verilir: `dosyaYukleme: false`. Yükleme 403, `dosyaKapali: true`, ileti tam olarak
"Bu ödev için dosya yüklenmiyor."; öğrencinin listesinde `dosyaYukleme: false`, `yukleyebilir: false`, `kapali` aynı ileti.
"Ödevi düzenle" (`POST …/update { dosyaYukleme: true }`) izni açar; öğrenciye ödevin adını ve "dosya yükleyebilirsin"i içeren
bildirim gider; yükleme 200. Alanı göndermeyen bir düzenleme izni değiştirmez. İzin kapatılınca yeni yükleme 403
`dosyaKapali`; yüklenmiş dosya silinmez (öğretmen de öğrenci de görür; öğrencide `yukleyebilir` ve `silebilir` `false`) ve
öğrenci onu silemez (403 `dosyaKapali`: teslim donar). İzin yalnız gerçek `true` ile açılır: `'true'` metni kapalı sayılır.

### 6) 50 MB sınırı ve doluluk (3)

"Sınır ödevi"ne 20 000 bayt yüklenince liste `kullanilan: 20000` ve `sinir: { dosya: 50 MB, adet: 10, toplam: 50 MB }`
verir. Toplamı 50 MB'ı geçecek bir dosya (50 MB − 10 000 bayt bildirilir) gövdesi okunmadan 413; iletide "sığmıyor", "boş yerin
kaldı" ve "50 MB". Mesaj eki de en çok 50 MB: öğretmenin `POST /api/ek/yukle?tur=mesaj`'a 50 MB + 1 bayt bildirmesi 413.

### 7) Silinme zamanı (8; test veritabanı değilse 7)

Karşılaştırmalar 3 dakika payla (`yakin`) ve yerel saatle (`an(gün, saat)`) yapılır.

- "Silinme ödevi" (son teslim 10 gün sonra 23:59): dosyanın `bitis`'i öğrencide de öğretmende de son teslim + 7 gün; `saklama`
  "Dosyalar son teslimden 7 gün sonra silinir.". Son teslim 20 gün sonra 10:00'a alınınca `bitis` yeniden hesaplanır.
- "Süresiz ödev": `bitis` yüklemeden 60 gün sonra; sonuçlandırılınca şimdi + 7 gün; yeniden açılınca yine yüklemeden 60 gün.
- "Geçmiş tarih ödevi": öğretmen son teslimi yanlışlıkla bir yıl öncesine yazar (başlangıç 400, son teslim 365 gün önce) →
  dosya hemen silinmez, `bitis` şimdi + 7 gün (şema 034'teki `dosya_saklama`). Ardından `supurmeDene()` saatlik temizliğin
  sorgusunu çalıştırır: dönen kimliklerde bu dosya yok, listede hâlâ var. (Veritabanı `_test` değilse bu denetim atlanır, ekrana
  "(test veritabanı değil: temizlik sorgusu denenmedi)" yazılır.) Tarih düzeltilince `bitis` yine son teslim + 7 gün.

### 8) Okulun disk sınırı: %80 ve dolu (9)

- Yönetici okulun sınırını 1 MB yapar (`POST /api/admin/okul-disk-siniri { okulId, mb: 1 }`; cevapta `disk.sinir` 1 MB).
  Okulun o anki kullanımı yönetim panelinden (`GET /api/admin/overview`) okunur; %80 denemesine yer olmalı.
- "Kota ödevi"ne `o2` önce %80'in 1000 bayt altına kadar yükler: müdüre de yöneticiye de bildirim yok. 2000 bayt daha → müdüre
  "Okulun dosya alanının %80'i doldu", yöneticiye "…dosya alanının %80'i doldu" birer kez. 1000 bayt daha → yine birer tane.
- `o1` sığmayacak kadar büyük bir dosya bildirir → 507, ileti tam olarak "Okulunun dosya alanı doldu. Okul yönetimi eski
  dosyaları sildirebilir ya da yöneticiden alan isteyebilir." ve `"okulDolu":true`. "Doldu" bildirimi yüklemeyi bekletmeden
  gittiği için 150 ms aralıkla en çok 20 kez bakılır: müdüre ve yöneticiye birer tane. İkinci 507'den sonra (400 ms beklenir)
  yine birer tane.
- Sınır küçüldü diye dosya silinmez: liste üç dosya; yönetici sınırı varsayılana döndürür (`mb: null`, cevapta `ozel: false`) ve
  yükleme yeniden 200.

Sonunda boş satır ve `GECTI: 67   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile yazılır, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) (`iste`, `girisYap`, `hesapAc`); 7. bölümde test sürecinin içinden
  [../sunucu/ayarlar.md](../sunucu/ayarlar.md) (`ayarlariYukle`), [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)
  (`veritabaniAdi`, `kapat`) ve [../sunucu/veri/depo/odev-dosyalari.md](../sunucu/veri/depo/odev-dosyalari.md) (`eskileriSil`);
  Node'un `http`, `zlib` (`crc32`), `crypto` (`randomBytes`) ve (`supurmeDene` içinde) `path` modülleri.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula`, `POST /api/register`, `POST /api/eposta-onay`, `GET /api/me`, `GET /api/notifications` | giriş, velinin hesabı, veli kodu, bildirimler | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/parent/link` | veli çocuğa bağlanır | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/assignments`, `POST /api/assignments/<id>/finish`, `…/update`, `…/reopen`, `…/delete` | ödevler, izin, tarihler | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `POST /api/odev-dosya/yukle?odev=`, `GET /api/odev-dosya?odev=[&ogrenci=]`, `GET /api/odev-dosya/indir?id=`, `GET /api/odev-dosya/zip?odev=`, `GET /api/odev-dosya/bilet?tur=goster\|dosya&id=`, `GET /api/odev-dosya/goster?bilet=`, `GET /api/odev-dosya/indir?bilet=`, `POST /api/odev-dosya/sil` | teslim dosyaları | [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) |
  | `POST /api/ek/yukle?tur=mesaj` | mesaj ekinin 50 MB sınırı | [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md) |
  | `POST /api/admin/okul-disk-siniri` | okulun disk sınırı | [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md) |
  | `GET /api/admin/overview` | okulun kullanımı | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) — `yukle`'nin denetim sırası (401/403/404/400/411/413/415,
    `dosyaKapali`, `teslimKapali`, `SAYI_DOLDU`, `sigmiyor`), `dosyaAdi`, `reddet` (gövdeyi okumadan cevap), `ekBasliklari`,
    `medyaGonder` (`inline`, `Range` → 206), `zipGonder` (öğrenci klasörleri, önceden hesaplanmış CRC32), bilet kuralları
    (`goster` 5 dakika ve çok kullanımlık, öbürleri tek kullanımlık), `gorebilir` / `yonetir`, silme kuralları.
  - [../sunucu/veri/depo/odev-dosyalari.md](../sunucu/veri/depo/odev-dosyalari.md) — `SILINME` (son teslim + 7 gün / sonuçlanma
    + 7 gün / yükleme + 60 gün, `dosya_saklama`'dan önce değil), `ekle`'nin kilitli satırla sayı ve toplam denetimi, `eskileriSil`.
  - [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) — `dosyaYukleme: body.dosyaYukleme === true`, düzenlemede
    gönderilmezse değişmemesi, izin açılınca "Artık ödeve dosya yükleyebilirsin." bildirimi;
    [../sunucu/veri/depo/odevler.md](../sunucu/veri/depo/odevler.md) — son teslim değişince ve ödev yeniden açılınca
    `dosya_saklama`'nın "şimdi + 7 gün"e çekilmesi.
  - [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md) — `sigmaz`, `doldu`, `yuklendi`, `uyar` (bildirim
    metinleri, seviye başına bir kez), `OKUL_DOLU`, `siniriDegistir`.
  - [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md) — ekin tek dosya sınırı.
  - Şema ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)): `008-odev-dosyalari.sql`, `033-odev-dosya-izni.sql`
    (izin ve `okul_dosya_uyarilari`), `034-odev-dosya-saklama.sql`, `035-okul-disk-siniri.sql`.
- **Tablolar:** uçlar üzerinden `odev_dosyalari`, `odevler`, `odev_ogrencileri`, `kullanicilar`, `veli_baglari`, `bildirimler`,
  `okullar`, `okul_dosya_uyarilari`; 7. bölümde `odev_dosyalari`'na doğrudan `DELETE` (yalnız `_test`'te). Disk: sunucunun
  `testler/testdata/dosyalar/` klasörü.
- **Ön yüz** (bu pakette tarayıcı yok): öğrencinin teslim kutusu, öğretmen ve veli listesi, önizleme ve zip
  [../public/js/parcalar/14b-odev-teslim.md](../public/js/parcalar/14b-odev-teslim.md); ödev formundaki izin kutusu
  [../public/js/parcalar/11-ogretmen-odev.md](../public/js/parcalar/11-ogretmen-odev.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde `test-aile`'den sonra, `test-okul-disk`'ten önce; bu pakete
  ek ortam değişkeni verilmez (okul varsayılan 5 GB'la açılır, 8. bölüm sınırı kendisi 1 MB yapar).

## Nasıl çalışır (adım adım)?

```
mat, fen, o1, o2 girer ; dosyaveli<z> kaydolur, girer, o1'in veli koduyla bağlanır
1) Proje ödevi: yükle (ad temizliği, .exe 415, boş 411, oturumsuz 401, öğretmen 403, 300 MB / 50 MB+1 413)
2) listeler ve indirmeler (öğrenci, başka öğrenci, fen, veli, uydurma kimlik) ─► öğretmen listesi ─► zip'i zipOku ile çöz
3) 10 dosya sınırı ─► silme yetkileri ─► finish ─► yükleme/silme 400 ; Eski ödev: süresi doldu
4) Medya ödevi: bilet goster ─► inline png ; video Range 206 (bilet iki kez) ; pdf 400 ; tek kullanımlık indirme 410
   Proje ödevi delete ─► dosya 404
5) İzin ödevi: kapalı ─► 403 dosyaKapali ─► update true ─► bildirim, yükleme ─► update false ─► dosya kalır, silinemez
6) Sınır ödevi: kullanilan, sinir ; 50 MB'ı aşan toplam 413 ; mesaj eki 413
7) silinme anı: son teslim + 7 gün ; ileri alınca yeniden ; son teslimsiz 60 gün / sonuçlanınca +7 / yeniden açınca 60 gün
   geçmişe yazılan son teslim ─► şimdi + 7 gün ─► supurmeDene (eskileriSil, test veritabanında) silmedi ─► düzeltince yine +7
8) yönetici sınırı 1 MB ─► %80 altı / üstü / bir kez ─► 507 okulDolu + "doldu" bir kez ─► sınır varsayılana ─► yükleme 200
```

## Dikkat!

- **7. bölüm test veritabanından gerçekten siler.** `supurmeDene()` `eskileriSil()`'i sunucunun saatlik işini beklemeden, test
  sürecinin içinden çalıştırır: silinme anı geçmiş bütün teslim kayıtları (yalnız bu paketinkiler değil) silinir; dosyaların kendisi diskte kalır
  (onları sunucunun `dosyaSupur`'u bir saat sonra "kaydı olmayan dosya" diye siler). Koruma, adı `_test` ile bitmeyen veritabanında
  hiçbir şey yapmamaktır. Ad `testler/testdata/ayarlar.json`'dan (ya da ortamda `DATABASE_URL` varsa ondan) okunur; bu yüzden
  3200'deki sunucu ile paketin doğrudan bağlandığı veritabanı aynı olmalı.
- **`EE_DATA` sırası kırılgan.** `supurmeDene` `EE_DATA`'yı `sunucu/ayarlar` ilk kez yüklenmeden hemen önce değiştirir. Dosyanın
  başındaki `require`'lar (`http`, `zlib`, `crypto`, `./giris`) bugün `sunucu/yollar.js`'i yüklemediği için bu çalışır; başa
  `yollar`'ı yükleyen bir modül eklenirse ayarlar gerçek `data/`'dan okunur ve koruma devreye girip denetimi atlar (zarar vermez
  ama 7. bölümün bir denetimi eksik kalır, toplam 66 olur).
- **8. bölüm `EE_OKUL_DOSYA_GB`'ye bağlı değil.** Bölüm okulun sınırını kendisi açıkça 1 MB yapar, sonda "varsayılana" döndürür
  ve yüklemenin yeniden açılmasını bekler. `tumtest.sh` bu pakete değişken vermez (varsayılan 5 GB). Sunucu
  `EE_OKUL_DOSYA_GB=0.001` ile (test-okul-disk'in ayarıyla) açılırsa varsayılan da 1 MB (1 048 576 bayt) olur, ama son yüklemeden
  önce okulun kullanımı yalnız %80 eşiği + 2000 bayttır (~0,84 MB), 1000 baytlık son dosya yine sığar (koşudan sonra okulun
  kullanımı 841 861 bayttı).
  3 Ekim öğlen denetiminde böyle açılmış sunucuda (site ayarının kaynağı `ortam`, değer 1 MB) da `GECTI: 67   KALDI: 0` çıktı.
  Yani son denetim "5 GB'a dönüldü"yü değil, "özel sınır kalktı (`ozel: false`) ve yükleme yeniden açıldı"yı kanıtlar.
- **Okulun sınırı paket sonunda geri alınır.** Sınır varsayılana (5 GB) dönünce kullanım yeni sınırın %70'inin çok altında kalır;
  sunucu bu sırada okulun %80 / "doldu" uyarı kaydını da siler (`siniriDegistir` → `uyarilariSifirla`). Gönderilmiş bildirimler ve
  yüklenen dosyalar kalır; sonraki paket zaten sıfırlanmış veritabanıyla başlar.
- **Silinen ödevin dosyaları diskte kalır.** "Proje ödevi" silinince kayıtlar (`ON DELETE CASCADE`) gider, dosyalar gitmez. 3 Ekim
  koşusundan sonra `testler/testdata/dosyalar/`'da 21 dosya vardı: kaydı olan 12'si ve silinen ödevin 9'u. Sunucuda bu dosyaları
  saatlik temizlik siler; testte önemli değil.
- **Seed adlarına bağlı.** Zip ve öğretmen listesi denetimleri "Zeynep Şahin" ve "Burak Öztürk" adlarını arar ([seed.md](seed.md)).
- **Aynı veritabanında ikinci koşu tutmaz, paket çöker.** 3 Ekim öğlen denetiminde aynı sunucuda arka arkaya üç kez koşuldu:
  - 1. koşu `GECTI: 67   KALDI: 0`.
  - 2. koşu: 1–7. bölümler geçer, 8. bölümde "okulun kullanımı sınırın altında" `KALDI` olur (kullanım 914 932 bayt: ilk koşunun
    "Kota ödevi" ve öbür dosyaları kaydıyla duruyor). Hemen ardından `alt` (`%80 eşiği − kullanım − 1000`) eksi çıkar,
    `crypto.randomBytes(-77071)` `RangeError` atar ve paket `TEST HATASI` ile durur; `GECTI:` satırı hiç basılmaz.
  - 3. koşu (aynı saat içinde): sunucu öğrenci başına saatte 60 yükleme isteği sayar (`hizSinir('dosyaYukle:' + id, 60, 1 saat)`;
    rol denetiminden hemen sonra geldiği için reddedilen yüklemeler de sayılır). Bu paket `o1` ile 30, `o2` ile 5 yükleme isteği
    yapar; çöken 2. koşu da `o1` ile 28 yapmıştı. 3. koşuda `o1`'in iki yüklemesi geçer, üçüncüden (`oyun.exe`) itibaren hepsi 429
    "Bu saat içinde çok fazla dosya yükledin." alır ve 4. bölümde `TypeError` ile `TEST HATASI`.

  `tumtest.sh` her paketten önce veritabanını sıfırlayıp sunucuyu yeniden açtığı için orada sorun yok; elle koşarken her seferinde
  sunucuyu yeniden aç.
- **Zaman payları.** Silinme karşılaştırmaları 3 dakika paylıdır; "doldu" bildirimi en çok 20 × 150 ms beklenir. Çok yavaş bir
  makinede bildirim 3 saniyede yazılmazsa denetim `KALDI` olabilir.
- **`gun()` UTC günü verir** (Türkiye'de 00:00–03:00 arası bir gün geri). Hem paket hem sunucu son teslimi aynı metinden ve yerel
  saatle hesapladığı için silinme denetimleri tutarlı kalır (koddan çıkarım; gece denenmedi).
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider; seed hesapları orada yoksa paket ilk girişte
  durur. Her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-okul-disk.md](test-okul-disk.md)
  (eklerin ve okul fotoğraflarının disk sayımı, site ayarındaki varsayılan sınır, saatlik mutabakat), `testler/test-yorum-ek.js`
  (ekler), `testler/test-ozellikler.js` (Ödevler bölümü kapalı okulda teslim listesi 403), `testler/test-yedek.js` (teslim
  kaydının yedekten dönmesi), `testler/test-resim-kucult.js` (tarayıcının küçültüp teslim adresine gönderdiği istek),
  [yetki-denetimi.md](yetki-denetimi.md) (teslim listesi ve çocuğun teslim listesi rol rol) ve
  [girdi-denetimi.md](girdi-denetimi.md) (8. bölümün kullandığı `POST /api/admin/okul-disk-siniri`'ne bozuk değerler).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış, [seed.md](seed.md) ile tohumlanmış ve **yeni açılmış** test sunucusu varken;
  `EE_OKUL_DOSYA_GB` verilse de olur, "Dikkat!"e bak):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-odev-dosya.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 67   KALDI: 0`, yaklaşık
  4 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. Öğlen denetiminde yeniden: değişkensiz açılmış sunucuda
  67/0 (koşudan sonra `testler/testdata/dosyalar/`'da 21 dosya), `EE_OKUL_DOSYA_GB=0.001` ile açılmış sunucuda da 67/0; aynı
  sunucuda ikinci ve üçüncü koşular çöktü ("Dikkat!"e bak).

## Son durum

- `git log`: dört commit.
  - `4386173 commit 367` (2026-09-26) — dosya açıldı: başlık yorumu ve yardımcılar (`yukle`, `indir`, `buyukBildir`, `zipOku`).
  - `b87a4cb commit 368` (2026-09-26) — ana gövde: bugünkü 1–4. bölümler (yükleme, görme/indirme, zip, sınırlar, tarayıcıda açma).
    O zaman büyük gövde denetimi "200 MB üstü" diye adlanıyordu.
  - `566b917 commit 524` (2026-09-27, canlı hazırlık) — 5–8. bölümler eklendi: dosya yükleme izni, 50 MB sınırı (`buyukBildir`'e
    `boyut` ve `yol`), silinme anı ve `supurmeDene`, okulun dosya alanı. `odevAc` artık `dosyaYukleme: true` gönderiyor; "300 MB"
    ve "50 MB + 1" denetimleri geldi. 8. bölüm o gün `EE_OKUL_DOSYA_GB` ile çalışıyordu (verilmezse atlanıyordu).
  - `40fc7e7 commit 525` (2026-09-27, okul disk sınırı) — 8. bölüm yönetici ucuna geçti: ortam değişkeni (`OKUL_GB`) kalktı,
    yönetici okulun sınırını 1 MB yapıyor, kullanımı yönetim panelinden okuyor; 507 cevabında tam ileti ve `okulDolu`
    bekleniyor; sonda "dosyalar duruyor, sınır varsayılana dönünce yükleme açılıyor" denetimi eklendi. Aynı commit
    `tumtest.sh`'te `EE_OKUL_DOSYA_GB=0.001`'i bu paketten alıp `test-okul-disk`'e verdi.
- Açık iş yok; kod değiştirilmedi. Bilinen zayıflıklar "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Sunucuda küçültme … aynı dosya tek kopya"** (sıradaki iş 1) — sunucunun çözebildiği resimler sunucuda küçültülecek ve meta
    verileri silinecek; videolar ise tanımın sonundaki kullanıcı kararına (29 Eylül) göre sunucuda değil tarayıcıda küçültülecek
    (sunucuda ffmpeg planı kalktı). Aynı içerik diskte tek kopya tutulacak. Bu paketin dosyaları rastgele baytlı PDF'ler
    ve çözülemeyen PNG / MP4 olduğu için içerik ve boyut denetimleri büyük olasılıkla etkilenmez (tanımdan çıkarım); ama tek kopya
    düzeni dosyanın diskteki yerini, zip'in ve silmenin dosyayı nasıl bulduğunu değiştirir, "silinen ödevin dosyaları diskte kalır"
    davranışı da (referans sayısıyla silme) değişir. (Öneri: o iş bu pakete küçültülebilir gerçek bir resim de eklesin.)
  - **"Paneller … /duzenle okul sayfaları (disk + yedek sınırı alanları)"** — okulun disk sınırının ayarlandığı yer değişebilir;
    8. bölüm bugün `POST /api/admin/okul-disk-siniri`'ni kullanıyor.
  - **"Sistem: yöneticiye ZORUNLU TOTP"** — 8. bölüm yöneticiyle e-posta koduyla girer (`girisYap`); doğrulama uygulaması zorunlu
    olunca girişin yolu değişir.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — paketin `hesapAc` ile açtığı veli hesabı T.C.'siz kaydolur;
    tanıma göre kayıtta T.C. zorunlu olunca bu kayıt reddedilecek, `hesapAc` (ya da paketin çağrısı) T.C. göndermeli.
