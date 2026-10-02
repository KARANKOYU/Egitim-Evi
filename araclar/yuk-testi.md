# araclar/yuk-testi.js

Bir yıllık, kalabalık bir okulun verisini (720 öğrenci, 40 öğretmen, 600 veli, yanında 30 küçük okul) doğrudan test
veritabanına toplu yazar, sonra her rolün ana ekranlarını, birkaç yazma işlemini ve 10 eşzamanlı öğrenciyi gerçek HTTP
istekleriyle ölçüp yavaş ve ağır olanları işaretler. **Bugün çalışmıyor** (bkz. "Dikkat!").

## Bu dosya ne yapar?

Test paketleri iki öğrencili, birkaç ödevli küçük bir okulla çalışır: bir ekranın doğru olup olmadığını gösterirler ama
"720 öğrencilik bir okul bir yıl kullanınca bu ekran kaç saniyede açılır?" sorusuna cevap vermezler. Bir sorgunun tablonun
tamamını taradığı, bir listenin megabaytlarca büyüdüğü ancak gerçek boyutta veriyle görünür. Bu araç o soruyu sormak için
yazıldı.

İki kısımdan oluşur:

1. **Doldurma** — veriyi API'den tek tek değil, doğrudan SQL ile ve toplu yazar: yüz binlerce satır yaklaşık 40 saniyede
   biter. Bir eğitim yılının büyük kısmı kadar ödev, sınav, yoklama, mesaj ve bildirim; tarihler bugünden en çok 210 gün
   (yaklaşık 7 ay) geriye yayılır, takvimde birkaç ileri tarih de vardır.
2. **Ölçüm** — çalışan sunucuya gerçek HTTP istekleri atar: her rolün (öğrenci, öğretmen, veli, müdür, yönetici) ana
   ekranlarının uçları birer ısınma ve beşer ölçümle, birkaç yazma işlemi birer kez, sonra 10 öğrenci aynı anda. Sonunda hangi
   ekranın 150 ms'den yavaş ya da 150 KB'tan büyük olduğunu bir özetle söyler.

Bu ölçümün somut bir sonucu var: `sunucu/veri/sema/002-hiz.sql`'deki üç indeks (müdürün "Ders ödevleri" ekranı, takvim, eski
hatırlatma işaretlerinin silinmesi) bu araçla yapılan bir ölçümde tablo taraması görüldüğü için eklendi
([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)).

Araç yalnız elle çalıştırılır: `package.json`'da komutu yok, `testler/tumtest.sh` onu çalıştırmaz. Yalnız adı `_test` ile biten,
boş bir test veritabanında çalışmayı kabul eder.

## İçinde neler var?

### Ayar sabitleri

| Sabit | Değer | Ne |
|---|---|---|
| `BASE` | `EE_BASE` ya da `http://localhost:3200` | ölçülen sunucu (varsayılan bilerek test portu) |
| `SINIF`, `SINIF_MEVCUT` | 24, 30 | büyük okulda 24 sınıf × 30 öğrenci = 720 öğrenci |
| `OGRETMEN` | 40 | her derse 5 öğretmen |
| `KUCUK_OKUL` | 30 | yönetici ekranları için yalnız müdürü olan küçük okullar |
| `DERSLER` | 8 ders | Matematik, Türkçe, Fen Bilimleri, İngilizce, Sosyal Bilgiler, Din Kültürü ve Ahlak Bilgisi, Müzik, Beden Eğitimi |
| `YAVAS_MS`, `AGIR_KB` | 150, 150 | bu sürenin ya da boyutun üstü "YAVAŞ" / "AĞIR" |
| `OLCUM_TEKRAR` | 5 | ısınmadan sonraki ölçüm sayısı |
| `ISTEK_ARASI_MS` | 230 | iki ölçüm isteği arasındaki bekleme |

### Küçük yardımcılar

- `bekle(ms)` — `setTimeout`'lu bekleme.
- `say(önek)` — sıralı kimlik üretir: `<önek>_y1`, `<önek>_y2`… (36 tabanında). Ödev, sınav, mesaj, bildirim… kimlikleri böyle.
- `gunOnce(n)` — bugünden `n` gün önceki tarih (`YYYY-AA-GG`, UTC); negatif `n` ileri tarih verir.

### `toplu(tablo, sutunlar, satirlar)`

Satırları 4000'erli parçalar hâlinde tek bir parametreyle yazar:
`INSERT INTO <tablo> (<sütunlar>) SELECT <sütunlar> FROM json_populate_recordset(NULL::<tablo>, $1::json)`. Satırlar JSON olarak
gider, PostgreSQL onları tablonun kendi sütun türlerine çevirir (tarih, sayı, mantıksal). Tablo ve sütun adları koddan gelir,
yine de `^[a-z_]+$`'a uymayan ad "geçersiz ad" hatasıyla reddedilir. Dönen: satır sayısı.

### `doldur()`

1. **Korumalar:** bağlanılan veritabanının adı (`baglanti.veritabaniAdi()`) `_test` ile bitmiyorsa "Yük testi yalnızca test
   veritabanında çalışır (şu an: …)"; `okullar` tablosunda bir satır bile varsa "Test veritabanı boş değil: sunucuyu
   EE_DB_SIFIRLA=1 ile aç". İkisi de hata fırlatır, hiçbir şey yazılmaz.
2. Ortak şifrenin özeti bir kez hesaplanır (`hashPw`; herkes aynı test şifresi, değeri dosyada yazılı).
3. Sırayla yazılanlar (sayılar 3 Ekim'deki çalıştırmadan; "Testleri"ne bak):

| Tablo | Ne | Satır |
|---|---|---|
| `okullar` | `o_buyuk` "Yük Testi Ortaokulu" (Ankara / Çankaya) + `o_kucuk0…29` "Küçük Okul 1…30" (İzmir / Bornova), hepsi onaylı | 31 |
| `kullanicilar` | müdür `u_mudur`, 30 küçük okul müdürü, öğretmenler `u_ogrt0…39` (branşı `DERSLER[i % 8]`), öğrenciler `u_ogr<s>_<k>` (sınıflı, veli kodu `kisiKoduUret()`), veliler `u_veli0…599`; hepsi onaylı, aydınlatma onayı sürümü `'1.2'` | 1391 (+ sunucunun yöneticisi) |
| `veli_baglari` | her veli bir öğrenciye (ilk 600 öğrenci); ilk 120 veli ikinci bir çocuğa (son 120 öğrenci) | 720 |
| `siniflar` | `c_0…c_23`: `5-A`…`5-F`, `6-A`…, `7-A`…, `8-A`…`8-F` | 24 |
| `dersler` | her sınıfta 8 ders, haftada 4 saat; öğretmeni o branşın 5 öğretmeninden `s % 5`'inci | 192 |
| `ders_programi` | her sınıfa 5 gün × 7 saat (08:30–14:50), ders sırası kaydırmalı; bu kuruluşta öğretmen çakışması çıkmaz | 840 |
| `odevler` + `odev_siniflari` | her derse 25 ödev, 8 günde bir; ilk 22'si sonuçlanmış (`finished`), son 3'ü `active` | 4800 + 4800 |
| `odev_ogrencileri` | her ödev sınıfın 30 öğrencisine; sonuçlanmışlarda altı sonuç türünden biri ("yaptı" ağırlıklı), dörtte üçü "açıldı" | 144 000 |
| `sinav_gruplari`, `sinavlar`, `sinav_olcumleri`, `sinav_degerleri` | her derste 2 dönem grubu × 3 yazılı (ağırlık 30/30/40, tek ölçüm "Puan" 0–100); 8. sınıflarda 8 LGS denemesi (7 ölçüm: `TR`, `MAT`, `FEN` net 20 üstünden, `INK`, `DIN`, `ING` net 10 üstünden, `LGS` puanı 100–500) | 384, 1200, 1488, 44 640 |
| `devamsizlik` | 150 gün geriye, her gün her sınıfta öğrencilerin ~33'te 1'i (yok / geç / izinli) | ~3 300 |
| `mesajlar` + `mesaj_alicilari` | 20 okul duyurusu (müdür hariç büyük okuldaki herkese, 1360 kişi) + 400 sınıf mesajı (öğrenciler ve, varsa, velileri) | 420 + 49 280 |
| `bildirimler` | büyük okulda veli olmayan herkese (müdür, 40 öğretmen, 720 öğrenci) 200'er bildirim, 20 saat arayla; ilk 4'ü okunmamış | 152 200 |
| `takvim_etkinlikleri` | 60 etkinlik, 180 gün öncesinden başlayarak 4 günde bir (etkinlik / sınav / toplantı / tatil) | 60 |
| `islem_kaydi` | 3000 "hesap.acildi" kaydı | 3000 |

4. `ANALYZE` (sorgu planlayıcı gerçek satır sayılarıyla çalışsın) ve tek satır özet: "Doldurma 39.9 sn: 1392 kişi, 144000
   öğrenci-ödev, 44640 sınav değeri, 3274 devamsızlık, 49280 mesaj alıcısı, 152200 bildirim".

### `oturum(kullaniciId)`

Ölçüm için iki adımlı girişi atlar: 24 rastgele baytlık (48 onaltılık karakter) bir anahtar üretir ve
[../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md)'deki `ac` ile o kullanıcıya doğrudan bir web oturumu açar.
Dönen: `Authorization: Bearer` başlığında kullanılacak anahtar.

### `iste(yol, anahtar, method, govde)`

`fetch(BASE + yol)`; başlıklar `Authorization: Bearer <anahtar>`, `Accept-Encoding: br, gzip`, gövde varsa JSON. Süreyi
`process.hrtime` ile istekten cevabın gövdesi tamamen okunana kadar ölçer. Dönen: `{ durum, ms, bayt, govde }` (`bayt` gövdenin
**açılmış** metin boyutu, `govde` JSON değilse `null`).

### `olc(rol, ad, yol, anahtar)`

Bir okuma ucunu ölçer: bir ısınma isteği, sonra aralarında 230 ms beklemeyle 5 ölçüm. Süreleri sıralar; ortanca 3. değer, en
kötü 5. değer; durum ve boyut son istekten. İşaret: durum 200 değilse `HATA <durum>`, değilse ortanca 150 ms'yi geçiyorsa `YAVAŞ`,
boyut 150 KB'ı geçiyorsa `AĞIR`. Satırı ekrana yazar, sonucu `sonuclar` dizisine ekler, son cevabı döner.

### `olcumler()`

Önce oturumları açar: öğrenci `u_ogr20_3` (8-C), Matematik öğretmeni `u_ogrt0` (5-A, 5-F, 6-E, 7-D ve 8-C'nin Matematik dersleri),
veli `u_veli560` (tek çocuğu `u_ogr18_20`, 8-A), müdür `u_mudur` ve sunucunun açtığı ilk yönetici. Ölçülecek kayıtları SQL ile
bulur: 8-C Matematik öğretmeninin "LGS Deneme 8"i, öğretmenin bir sınav grubu, sonuçlanmış bir ödevi ve bir dersi. Sonra:

| Rol | Ekranlar (ölçülen uçlar) | Bölüm |
|---|---|---|
| öğrenci | `GET /api/me`; `/api/progress`; `/api/myschedule` | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md), [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
| öğrenci | `/api/exams/grafik` | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
| öğrenci, öğretmen, veli, müdür | `/api/mesajlar` (kutu), `/api/mesajlar/hedefler` (alıcılar; öğretmen ve müdür) | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
| öğrenci | `/api/notifications` (ilk), `/api/notifications?surum=<ilk cevabın sürümü>` (yoklama, değişmedi) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
| öğrenci, müdür | `/api/takvim?yil=…&ay=…` | [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md) |
| öğrenci, öğretmen, veli, müdür | `/api/devamsizlik/benim`, `/derslerim`, `/yoklama?lessonId=…`, `/ogrenci?studentId=…`, `/ozet?gun=180` | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
| öğretmen | `/api/assignments`, `/hedefler`, `/<ödev>` | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
| öğretmen | `/api/exams`, `/api/examgroups`, `/api/examgroups/<grup>`, `/api/exams/sablonlar`, `/api/exams/<LGS>` (7 alanlı değer tablosu, ayrı bir oturumla) | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
| öğretmen | `/api/teacher/schedule` | [../sunucu/bolumler/ogretmen.md](../sunucu/bolumler/ogretmen.md) |
| veli | `/api/parent/children`; `/api/progress?studentId=u_ogr18_20` | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md), [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
| müdür | `/api/school/students` (720), `teachers`, `classes`, `schedule?classId=c_5`, `cakismalar`, `ozet`, `assignments` (tüm okul; `?classId=c_5`; `?lessonId=d_5_0`; `?classId=c_5&detay=1`) | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
| müdür | `/api/islem-kaydi` | [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
| yönetici | `/api/admin/overview` (31 okul), `/api/admin/principals` | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md) |

Okuma ölçümleri: 42 satır (LGS ölçümü, öyle bir sınav bulunursa). Ardından **yazma işlemleri** (her biri bir kez, öncesinde
230 ms bekleme; satırda yalnız süre ve hata varsa `HATA <durum> <gövdenin ilk 80 karakteri>`):

| İşlem | Uç | Bölüm |
|---|---|---|
| Yoklama kaydet (öğretmenin dersi, 30 öğrenci, her 6. "yok") ve aynısını yeniden kaydet | `POST /api/devamsizlik/yoklama` | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
| Ödev ver (hedeflerdeki ilk 2 sınıf, 60 öğrenci, Matematik, bugünden 3 gün sonrasına) | `POST /api/assignments` | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
| O ödevi sonuçlandır (yaptı / geç / eksik) ve aynı sonuçları yeniden kaydet | `POST /api/assignments/<id>/finish` | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
| Hazır LGS şablonundan sınav aç, 60 öğrenciye 7'şer değer (virgüllü: `12,5`, `6,67`) | `POST /api/exams`, `POST /api/exams/<id>/grades` | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
| Müdürden tüm okula duyuru (~1360 alıcı) | `POST /api/mesajlar` | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |

Son olarak **eşzamanlılık**: 10 ayrı öğrencinin oturumuyla `GET /api/progress` aynı anda (`Promise.all`); toplam süre, en yavaşı
ve hepsinin 200 olup olmadığı yazılır. En sonda: `ÖZET: <n> ölçüm, <m> sorunlu: <rol/ekran, …>` — sorunlu = durum 200 değil ya da
ortanca > 150 ms ya da boyut > 150 KB.

### Ana çağrı

`doldur()` → `olcumler()`; hata olursa `HATA: <yığın>` yazılır ve çıkış kodu 1 yapılır (`process.exitCode`); her durumda sonunda
veritabanı havuzu kapatılır. Dışa açılan bir şey yok (`module.exports` yok).

## Kimle konuşur?

- **Çağırdıkları (`require`):**
  - [../sunucu/ayarlar.md](../sunucu/ayarlar.md) — `ayarlariYukle()`, dosya yüklenir yüklenmez: veri klasörünün (`EE_DATA`)
    `ayarlar.json`'unu okur; veritabanı bağlantısı oradan gelir.
  - [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) — `veritabaniAdi` (`_test` koruması), `sorgu` (toplu ekleme,
    `ANALYZE`), `tek` (sayımlar ve ölçülecek kayıtları bulma), `kapat`.
  - [../sunucu/veri/index.md](../sunucu/veri/index.md) — `depo`; yalnız `depo.oturumlar.ac`
    ([../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md)).
  - [../sunucu/ortak.md](../sunucu/ortak.md) — `kisiKoduUret` (öğrencinin veli kodu, bugünkü 16 karakterlik biçim).
  - [../sunucu/sifre.md](../sunucu/sifre.md) — `hashPw` (ortak şifrenin özeti, bir kez).
  - Node'un `crypto`'su (oturum anahtarı) ve genel `fetch`'i.
- **Doğrudan yazdığı tablolar:** yukarıdaki tablodakiler ve `oturumlar` (depo üzerinden). Sunucunun kendi kurallarından
  (uçlardaki denetimler, şema dışındaki uygulama kuralları) geçmez; yalnız veritabanının kısıtları uygulanır.
- **Ölçtüğü uçlar:** yukarıdaki iki tabloda, bölüm belgeleriyle.
- **Onu kullanan:** yok. Hiçbir dosya `require` etmez, `package.json`'da ve `testler/tumtest.sh`'te yok. Başka belgelerde adı
  geçer: [../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md) ve `002-hiz.sql`'in yorumu (indekslerin nedeni),
  [../sunucu/veri/sema.md](../sunucu/veri/sema.md) ve [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) (`_test` koruması),
  [../sunucu/veri/index.md](../sunucu/veri/index.md), [../sunucu/veri/depo/oturumlar.md](../sunucu/veri/depo/oturumlar.md),
  [../sunucu/ortak.md](../sunucu/ortak.md), [../sunucu/sifre.md](../sunucu/sifre.md), [../sunucu/ayarlar.md](../sunucu/ayarlar.md),
  [../server.md](../server.md) (çalıştırma komutu), [deneme-okulu.md](deneme-okulu.md) (`_test` korumasının örneği),
  [../TANITIM.md](../TANITIM.md) (araçlar tablosu).

## Nasıl çalışır (adım adım)?

### Çalıştırma

Dosyanın başındaki yorumdaki iki adım; sunucu satırını `testler/tumtest.sh`'teki gibi tamamlamak iyi olur (dış istek ve telefon
bildirimi kapalı). Proje kökünden:

```
# 1) Boş test veritabanıyla test sunucusu (seed.js'i ÇALIŞTIRMA: araç okullar tablosunu boş ister)
EE_DATA=testler/testdata EE_DB_SIFIRLA=1 EE_PUSH_GONDERME=0 EE_DIS_ISTEK=0 PORT=3200 node server.js > testler/test-sunucu.log 2>&1 &
# 2) Araç: AYNI veri klasörü (aynı veritabanı), aynı sunucu
EE_DATA=testler/testdata EE_BASE=http://localhost:3200 node araclar/yuk-testi.js
# 3) İş bitince sunucuyu kapat
```

`testler/testdata/ayarlar.json` yoksa önce `testler/test-ayarlari.js` onu üretmeli (`tumtest.sh` her pakette yapar). Bugünkü kodla
2. adım hemen düşer; "Dikkat!"in ilk iki maddesine bak.

### Akış

```
ayarlariYukle() → veritabanı: EE_DATA/ayarlar.json
doldur()
  ad _test ile bitiyor mu? okullar boş mu?            → değilse HATA, hiçbir şey yazılmaz
  hashPw (bir kez) → okullar → kullanicilar → veli_baglari → siniflar → dersler → ders_programi
  → odevler, odev_siniflari, odev_ogrencileri → sınav grupları, sınavlar, ölçümler, değerler
  → devamsizlik → mesajlar, alıcılar → bildirimler → takvim → işlem kaydı → ANALYZE → "Doldurma … sn: …"
olcumler()
  depo.oturumlar.ac × 5 (öğrenci, öğretmen, veli, müdür, yönetici)
  her okuma ucu: ısınma + 5 × (230 ms bekle → iste) → satır
  yazma işlemleri: her biri bir kez → satır
  10 öğrenci aynı anda /api/progress → satır
  ÖZET
baglanti.kapat()
```

### Çıktıyı okumak

```
  rol      ekran                              ortanca  en kötü     boyut
  öğrenci  İlerleyiş                           106 ms   150 ms   73.7 KB
  müdür    Okul öğrencileri (720)               71 ms    99 ms  188.2 KB  AĞIR
  yönetici Genel bakış (31 okul)              1667 ms  1723 ms    9.6 KB  YAVAŞ
  …
  yazma işlemleri
  Okula duyuru (tüm okul, ~1360 kişi)           617 ms
  …
  10 öğrenci aynı anda ilerleyiş açtı: toplam 266 ms, en yavaşı 262 ms, hepsi 200

ÖZET: 50 ölçüm, 8 sorunlu: veli/Çocuğun ilerleyişi, müdür/Okul öğrencileri (720), …
```

(Satırlar 3 Ekim'de düzeltilmiş bir kopyayla alındı; "Testleri".) Süreler aynı bilgisayarda, ağ gecikmesi olmadan ölçülür:
mutlak değerden çok "hangi ekran ötekilerden belirgin yavaş" sorusuna bakılır.

## Dikkat!

- **Bugün doldurma ilk kişi satırında düşüyor.** `kullanicilar` tablosunda `kullanici_adi` `003-kullanici-adi.sql`'den beri
  zorunlu (`NOT NULL`; biçim denetimi ve tekillik kuralları 003, 009 ve 031'de); araç bu sütunu hiç yazmıyor. 3 Ekim'de denendi:
  `HATA: error: null value in column "kullanici_adi" of relation "kullanicilar" violates not-null constraint` (satır 111'deki `toplu('kullanicilar', …)`).
  Düzeltmek için `kullanici(…)` yardımcısına geçerli ve tekil bir kullanıcı adı eklenmeli (ör. kimlikten türetilmiş, `^[a-z][a-z0-9._]{2,29}$`'e uyan).
- **Düzeltilse bile ölçümlerin hemen hepsi 403 olur.** Araç her kişiye aydınlatma onayı sürümü olarak sabit `'1.2'` yazar; bugünkü
  sürüm `'1.16'` (`KVKK_SURUM`, [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md)). Sürümü eski olan kişinin her isteği,
  `/api/me` gibi birkaç serbest uç dışında, "Aydınlatma metni güncellendi…" (403) alır ([../sunucu/api.md](../sunucu/api.md)); yalnız
  yönetici bu kapıdan muaftır. Araç bunda durmaz: satırları `HATA 403` diye yazar ve "47 ölçüm, 45 sorunlu" der (3 Ekim'de
  kullanıcı adı eklenmiş kopyayla görüldü). Sürüm sabit yazılmamalı, koddaki güncel değer kullanılmalı; aksi hâlde her KVKK
  güncellemesinde araç yeniden bozulur.
- **Yarım kalan doldurma veriyi bırakır.** Doldurma bir işlem (transaction) içinde değildir: düştüğünde yazılmış tablolar (ör. 31
  okul) kalır ve araç bir sonraki çalıştırmada "Test veritabanı boş değil" der. Sunucuyu `EE_DB_SIFIRLA=1` ile yeniden başlatıp
  tekrar dene.
- **Hesaplar eski düzende yazılır.** Her kişi tek satırdır: kendi e-postası, rolü ve okuluyla; yetişkin hesabı / okul rol
  satırı ayrımı (`ana_hesap_id`), yetişkinlerin kişi kodu, T.C. kimlik no ve kullanıcı adı yoktur (öğrencilerin veli kodu
  vardır); veliler de okula bağlı `parent` satırlarıdır.
  Sunucu bu eski biçimi hâlâ tanıdığı için ekranlar çalışır, ama ölçümler bugünkü çok portallı hesap yolunu (rol seçimi,
  `/api/kisilik/gec`) hiç denemez. Okullara kısa ad (okul adresi) da yazılmaz; sunucu eksik adresleri yalnız açılışta doldurduğu
  için bu okulların adresi olmaz (okul sayfası ölçülmez).
- **İki kanal aynı veritabanını göstermeli.** Araç veriyi ve oturumları `EE_DATA`'daki ayarın veritabanına yazar, istekleri `EE_BASE`'e
  atar. Sunucu başka bir veritabanıyla açıksa oturumları tanımaz: ölçümler 401 ("Giriş yapmalısın"), yönetici uçları ise
  yönetici olmayana verilen 404 ("Böyle bir adres yok") döner. `_test` koruması yalnız aracın kendi
  bağlandığı veritabanına bakar. `EE_DATA` verilmezse `data/ayarlar.json` okunur, ad `egitimevi` olduğu için araç hiçbir şey
  yazmadan durur — bu iyi; ama `EE_DATA` ayar dosyası olmayan bir klasörü gösterirse `ayarlariYukle` oraya varsayılan bir
  `ayarlar.json` yazar ve araç "Veritabanı ayarı yok" hatasıyla durur. `EE_BASE`'i hiçbir zaman 3000'e (kullanıcının kendi sunucusu)
  verme.
- **"Boyut" sıkıştırılmamış JSON'dur.** `fetch` `br`/`gzip` cevabı kendiliğinden açar; `bayt` açılmış metnin boyutudur. "AĞIR"
  (150 KB) sınırı ağdan geçen veriyi değil, tarayıcının ayrıştıracağı JSON'u gösterir; ağda geçen çok daha küçüktür.
- **Ortanca 5 ölçümün ortancasıdır;** durum ve boyut yalnız son istekten alınır. Yazma işlemleri tek ölçümdür: 150 ms'yi geçen
  yazma ÖZET'te "sorunlu" sayılır ama kendi satırında `YAVAŞ` yazmaz (yalnız `HATA`). 10 eşzamanlı ölçüm ÖZET'e girmez.
- **Hız sınırı yorumu eski.** Yorum "dakikada 300 istek" der; bugün sınır oturum başına dakikada 300, IP başına 6000'dir
  (`GENEL_SINIR`, [../sunucu/guvenlik.md](../sunucu/guvenlik.md)). 230 ms aralık her oturumu 300'ün altında tutar.
- **Baştaki sayılar da eski.** "~23 bin devamsızlık" yazar, kural (`% 33`) ~3 300 üretir; "~280 bin bildirim" yazar, veliler
  için bildirim yazılmadığı için 152 200'dür; "~50 bin değer" bugün 44 640. "027 şemasının biçimi" notu da eski: veli kodu bugün 16
  karakterdir (032), `kisiKoduUret` zaten güncel biçimi üretir.
- **Bazı ölçümler boş cevap ölçer.** Öğrencinin "Sınav grafiği" (`/api/exams/grafik`) LGS denemelerini şablona bağlı arar; araç
  sınavları şablonsuz yazdığı için cevap boştur (58 bayt) ve grafiğin gerçek maliyeti ölçülmez. "Çakışmalar" da boş liste döner:
  program öğretmen çakışması çıkmayacak biçimde kurulur.
- **Verideki küçük gerçek dışılıklar:** her derste son üç ödev `active` görünür ama son teslimleri 8–24 gün önce geçmiştir;
  devamsızlık 150 ardışık güne (hafta sonları dahil) yazılır; tarihler UTC'ye göredir (`gunOnce`), Türkiye saatiyle gece yarısından
  sonraki ilk üç saatte bir gün geride kalır.
- **SQL burada uygulamanın kuralı dışında.** "SQL yalnız `sunucu/veri/` altında" kuralını denetleyen `testler/sql-denetimi.js`
  `araclar/`'ı taramaz. `toplu` tablo ve sütun adlarını metne yapıştırır (yalnız koddan gelen, `^[a-z_]+$`'a uyan adlar), değerler
  tek JSON parametresiyle gider; sayımdaki `count(*)` sorgusu da koddaki sabit tablo adlarıyla kurulur.
- **Ortak test şifresi.** Bütün hesapların şifresi aynı ve dosyada yazılı; yalnız test veritabanı içindir. Araç bitince veri ve
  oturumlar test veritabanında kalır; bir sonraki tam test onu zaten sıfırlar.

## Testleri

- Bu aracı çalıştıran ya da denetleyen otomatik test yok. Ölçtüğü uçların doğruluğu ilgili paketlerde denenir (ör. ödev
  `testler/test-odev-saat.js`, sınav `testler/test-sinav.js`, devamsızlık `testler/test-devamsizlik.js`, mesaj
  `testler/test-mesaj.js`, bildirim `testler/test-bildirim.js`); okul ağındaki 300 kişilik ani yük ise ayrı bir pakette,
  `testler/test-okul-agi.js`'te ölçülür.
- **3 Ekim'de (gece yarısından hemen sonra) böyle denendi** (3200'de, yeni sıfırlanmış test veritabanıyla açılan sunucu; iş bitince kapatıldı):
  1. Araç olduğu gibi: 0,6 saniyede "kullanici_adi … not-null" hatası, çıkış 1. Aynı veritabanında ikinci çalıştırma:
     "Test veritabanı boş değil: sunucuyu EE_DB_SIFIRLA=1 ile aç", çıkış 1.
  2. Depoya girmeyen geçici bir kopyada yalnız kullanıcı adı eklendi: doldurma 46,3 sn; `/api/me` ve iki yönetici ucu dışındaki
     her ölçüm ve her yazma `HATA 403` ("Aydınlatma metni güncellendi"); 10 öğrenci "HATALI"; "47 ölçüm, 45 sorunlu".
  3. Kopyada KVKK sürümü de güncel yapıldı: doldurma 39,9 sn, bütün akış ~2 dakika, 50 ölçümün 8'i sorunlu:

     | Ölçüm | Ortanca | En kötü | Boyut | İşaret |
     |---|---|---|---|---|
     | veli / Çocuğun ilerleyişi | 156 ms | 185 ms | 70,6 KB | YAVAŞ |
     | müdür / Okul öğrencileri (720) | 71 ms | 99 ms | 188,2 KB | AĞIR |
     | müdür / Sınıf programı | 153 ms | 165 ms | 5,7 KB | YAVAŞ |
     | müdür / Ders ödevleri (sınıf, hepsi açık) | 171 ms | 180 ms | 59,1 KB | YAVAŞ |
     | yönetici / Genel bakış (31 okul) | 1667 ms | 1723 ms | 9,6 KB | YAVAŞ (2. denemede 1085 ms) |
     | yazma / Ödevi sonuçlandır (60) | 162 ms | | | |
     | yazma / Sınav değerleri (60 × 7) | 219 ms | | | |
     | yazma / Okula duyuru (~1360 kişi) | 617 ms | | | |

     Öteki okuma ölçümlerinin ortancası 27–134 ms arasındaydı; 100 KB'ı geçen öteki iki cevap öğretmenin ve müdürün mesaj alıcı
     listesiydi (~107 KB). 10 öğrenci aynı anda: toplam 266 ms, hepsi 200. Yöneticinin genel bakışının neden bir saniyeyi aştığına
     bakılmadı.
- Elle: "Çalıştırma"daki adımlar. Araç düzeltildikten sonra sonuçlar yukarıdaki tabloyla karşılaştırılabilir.

## Son durum

- `git log --follow`: 7 commit. Dosya parça parça girdi: `af957d0 commit 290` (2026-09-25; baştaki açıklama),
  `5865ff7 commit 291` (`require`'lar, sabitler, `bekle`, `say`, `gunOnce`, `toplu`, `oturum`), `945e9cc commit 292` (`iste`),
  `2aca9af commit 293` (ana çağrı), `280f98a commit 328` (2026-09-26; `doldur`'un tamamı), `e08eaef commit 353` (2026-09-26;
  `olc` ve `olcumler`: bütün okuma ve yazma ölçümleri, eşzamanlılık, ÖZET).
- Son değişiklik `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar işi): öğrencinin veli kodu rastgele 14 onaltılık
  karakter yerine `kisiKoduUret()` ile üretilir oldu (027'den beri veli kodu belirli bir desene uymak zorunda).
- O günden beri araç değişmedi. 3 Ekim'de denendiğinde çalışmadığı görüldü: kullanıcı adı eksik (ilk hata) ve KVKK sürümü eski
  (ikinci engel). Kod değiştirilmedi; öteki açıklar "Dikkat!"te.
- Depo geçmişinde sıra ters: `kullanici_adi`'yi zorunlu yapan `003-kullanici-adi.sql` `5b9f47f commit 177` (2026-09-25 19:00)
  ile, `doldur` ise ondan sonra `280f98a commit 328` (2026-09-26) ile girdi; aracın yorumuna dayanan `002-hiz.sql` ise daha da
  önce, `4a7ca51 commit 8` (2026-08-28) ile. Sabit `'1.2'` sürümü de kullanıcı adından önceki aydınlatma metnine aittir
  (`KVKK_SURUM` yorumu: "1.3: kullanıcı adı ve T.C. kimlik no"). Yani kod, kullanıcı adı gelmeden önce yazılıp depoya sonradan
  parça parça girmiş görünüyor; depodaki hâliyle bu şemada hiç çalışmamış olmalı (geçmişten çıkarım).
- Planlı işlerden bu dosyayı doğrudan ilgilendiren: **"Optimizasyon + saklama süreleri + ölçek raporu"** — tanımı ölçüme bu
  araçla başlamayı ve onu genişletmeyi söyler (birden çok büyük okul, bildirim, mesaj, quiz ve servis yoklaması tabloları, p95
  süreleri, sunucunun bellek kullanımı, 50 ve 200 eşzamanlı kullanıcı, bildirim yoklamasının maliyeti). Önce yukarıdaki iki engel
  giderilmeli. Hesap düzenini değiştirecek işler de buradaki doğrudan yazılan satırları etkiler: "T.C. kimlik no bütün hesaplarda
  zorunlu" (kişilere geçerli T.C. yazılmalı), "Tek kişi tek hesap + portallar öğrencide de" ve "Çalışan olarak ekleme" (yetişkin
  hesabı + okul rol satırı düzeni; ölçümlerin bugünkü hesap yolunu denemesi için de gerekli).
