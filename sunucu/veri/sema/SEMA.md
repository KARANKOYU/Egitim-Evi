# sunucu/veri/sema/SEMA.md

Eğitim Evi veritabanının yapısını kuran 35 numaralı SQL dosyasının (`001-ilk.sql` … `035-okul-disk-siniri.sql`) her birinin
ne eklediğini, neden eklendiğini ve hangi depo dosyasının kullandığını anlatan tek belge; sonunda bütün tabloların dizini var.

## Bu dosya ne yapar?

Bu klasörde JavaScript yok: 35 numaralı `.sql` dosyası ve bu belge var. Bu belge klasörün belgesidir, yani öteki klasörlerdeki
`KLASOR.md`'nin buradaki karşılığı.

Veritabanının bugünkü hâli tek bir dosyada yazmaz. `001-ilk.sql` ilk yapıyı kurar; sonraki her dosya üstüne bir şey ekler,
bir kısıtı değiştirir ya da eski veriyi yeni kurala taşır. "Şu tabloda hangi sütunlar var, bu kural nereden geliyor?"
sorusunun cevabı bu yüzden birkaç dosyaya dağılmış olabilir. Bu belge o dağınıklığı toplar:

- **İçinde neler var?** bölümü her dosyayı sırayla anlatır: ne ekler ya da değiştirir (tablolar, sütunlar, kısıtlar,
  indeksler, tetikleyiciler, veri taşıma), neden (dosyanın baş yorumu ve git geçmişi), depoya hangi commit'le girdi, hangi depo
  dosyası kullanıyor, bugün hâlâ geçerli mi. Bölümün sonunda **Tablo dizini** var: her tablo için kuran dosya, değiştiren
  dosyalar, kullanan depo dosyası ve yedeğe girip girmediği.
- **Kimle konuşur?** bölümü bu dosyaları kimin okuduğunu, kimin hangi adlarına dayandığını söyler.
- **Nasıl çalışır (adım adım)?** bölümü şemanın açılışta nasıl uygulandığını ve yeni bir şema dosyası yazarken uyman gereken
  kuralları anlatır.

Bir şema dosyasının baş yorumu yazıldığı günü anlatır; sonraki bir dosya o kuralı değiştirmiş olabilir. Eski dosya hiç
değişmediği için yorumu da değişmez. Her dosyanın bölümündeki **Bugün** satırı bu yüzden var: yorumla bugünkü kod arasındaki
farkı orada bulursun.

Commit numaraları hakkında: her dosya depoya tek bir commit'le girdi ve sonra hiç değişmedi (35 dosyanın hepsinde
`git log --follow` tek satır). `commit 177`–`commit 460` arası commit'ler aynı iki günde parça parça atıldığı için commit
sırası dosya numarası sırasını izlemez (ör. `008-odev-dosyalari.sql` `commit 363`'te, `009-okul-adresi-hesaplar.sql`
`commit 333`'te girdi). Commit numarası yalnız dosyanın depoya girdiği yeri gösterir; uygulanma sırası dosya numarasıdır.

## İçinde neler var?

Aşağıda her şema dosyasının bir bölümü var, en sonda da Tablo dizini. Kısalık için bir kural: hemen her tabloda `id`
(uygulamanın ürettiği metin kimlik, birincil anahtar) ve `olusturma` (`timestamptz`, varsayılan `now()`) sütunu var; ayrıca
söylenecek bir şey yoksa bunlar tek tek yazılmadı. Öteki bütün sütunlar, adlı kısıtlar ve indeksler yazıldı. "Silinince gider"
`ON DELETE CASCADE`, "silinince boşalır" `ON DELETE SET NULL` demektir.

### 001-ilk.sql

**Depoya girdiği commit:** `ce69ce9 commit 7` (2026-08-28).

**Ne ekler:** İlk şemanın tamamı: 29 tablo. Gruplar hâlinde:

- **Okullar ve yıllar**
  - `okullar`: `id`, `meb_kodu` (MEB kurum kodu; elle yazılan okulda `''`), `ad` (2–140), `il`, `ilce`, `tur`
    ("Ortaokul", "Lise"…), `durum` (`'pending'`/`'approved'`/`'rejected'`, varsayılan `'pending'`), `olusturma`.
    `okullar_meb_kodu_tekil`: aynı MEB okuluna reddedilmemiş ikinci kayıt olamaz (`WHERE meb_kodu <> '' AND durum <>
    'rejected'`); `okullar_il_durum` (il + durum araması).
  - `egitim_yillari`: `okul_id`, `ad` `'2026-2027'` biçiminde (`^[0-9]{4}-[0-9]{4}$`), `baslangic`/`bitis` (bitiş
    başlangıçtan sonra), `aktif`; `UNIQUE (okul_id, ad)`; `egitim_yillari_tek_aktif`: okul başına en çok bir aktif yıl.
- **Okulun yapıları**
  - `siniflar` (`okul_id`, `ad` 1–30, "7-A"; okulda tek), `roller` (müdürün tanımladığı rol, `okul_id`, `ad` 1–60; okulda
    tek), `rol_yetkileri` (`rol_id` + `yetki`, rol silinince gider), `rol_yetki_kapsamlari` (yetkinin daraltılması: `rol_id`,
    `yetki`, `tur` `'ders'`/`'sinif'`, `deger` ders adı, sınıf kimliği ya da `'*'` = hepsi; `(rol_id, yetki)` ile
    `rol_yetkileri`'ne bağlı, yetki kalkınca gider; hiç satır yoksa yetki okulun tamamında geçer).
- **Kullanıcılar**
  - `kullanicilar`: beş rol tek tabloda (`admin`, `principal`, `teacher`, `student`, `parent`). `eposta` (zorunlu, tek —
    PostgreSQL'in verdiği adla `kullanicilar_eposta_key` —, küçük harf ve `%_@_%` biçimi), `sifre_ozeti` (scrypt tuzu +
    özeti; düz şifre asla), `ad_soyad` (3–80), `rol`, `durum` (`'pending'`/`'approved'`/`'rejected'`, varsayılan
    `'approved'`), `okul_id`, `sinif_id` (sınıf silinince boşalır), `ozel_rol_id` (rol silinince boşalır), `secili_yil_id`
    (baktığı eğitim yılı; yıl silinince boşalır), `olusturan_id` (hesabı açan; kendi tablosuna bağlı, silinince boşalır),
    `telefon` (`''` ya da `05XXXXXXXXX`), `il`, `ilce`, `adres`, `dogum_tarihi` (1920'den sonra), `brans`, `sinif_etiketi`,
    `veli_kodu`, `okul_notu`, `tema` (`sistem`/`acik`/`koyu`), `mesaj_kimden` (`herkes`/`personel`/`kapali`), KVKK onayı
    (`kvkk_onay`, `kvkk_tarih`, `kvkk_surum`), `olusturma`. Tablo kısıtı: `admin` ve `parent` dışındaki roller bir okula bağlı
    olmak zorunda. İndeksler: `kullanicilar_veli_kodu_tekil` (boş olmayan veli kodu tek), `kullanicilar_okul_rol`,
    `kullanicilar_sinif`.
  - `mesaj_engelleri` (kişinin "bana yazamasın" listesi: `kullanici_id`, `engellenen_id`; ikisi de silinince gider; kişi
    kendini engelleyemez), `veli_baglari` (veli ↔ çocuk: `veli_id`, `ogrenci_id`, ikisi de silinince gider;
    `UNIQUE (veli_id, ogrenci_id)`, çocuğa göre `veli_baglari_ogrenci`).
- **Ders ve program**
  - `dersler`: bir sınıfta okutulan bir branş ("7-A Matematik"); `okul_id`, `sinif_id` (sınıf silinince gider), `konu`,
    `ogretmen_id` (silinince boşalır), `haftalik_saat` 0–20, `UNIQUE (sinif_id, konu)`; `dersler_ogretmen`, `dersler_okul`.
    Öğretmen–öğrenci ilişkisi YALNIZ buradan türer: öğretmen, dersine girdiği sınıfların öğrencilerinin öğretmenidir.
  - `ders_programi`: `okul_id`, `sinif_id` ve `ders_id` (ikisi de silinince gider), `gun` 1–7 (1 = Pazartesi),
    `baslangic`/`bitis` (`time`; bitiş sonra ve en çok 8 saat), `yil_id` (silinince boşalır);
    `ders_programi_sinif_gun` (sınıf + gün + başlangıç), `ders_programi_ders`, `ders_programi_okul`.
- **Ödevler**
  - `odevler`: `okul_id`, `ogretmen_id` (silinince boşalır), `ders` (metin), `baslik` (1–200), `aciklama`,
    `baslangic`/`bitis` (`date`; bitiş boşsa süresiz; ikisi de doluysa bitiş ≥ başlangıç), `bitis_saati` (varsayılan
    `12:00`), `durum` (`active`/`finished`), `yil_id`, `sonuclanma`. İndeksler: `odevler_ogretmen` (öğretmen + oluşturma),
    `odevler_okul` (okul + oluşturma), `odevler_bitis` (açık ödevlerin bitişi).
  - `odev_siniflari` (ödevin verildiği sınıflar: `odev_id`, `sinif_id`; ikisi de silinince gider), `odev_ogrencileri`
    (ödevi alan öğrenci: `odev_id`, `ogrenci_id`, ikisi de silinince gider; `sonuc`: boş = henüz değerlendirilmedi; `yapti`,
    `yapmadi`, `eksik`, `gec`, `izinli` (başarı oranını düşürmez), `gelmedi` (düşürür); `acilma` = öğrencinin ödevi ilk açtığı
    an); öğrenciye göre `odev_ogrencileri_ogrenci`.
- **Sınavlar**
  - `sinav_sablonlari` ("Yazılı", "LGS Denemesi"): `okul_id`, `olusturan_id`, `ad` 1–60 (okulda tek).
  - `sablon_olcumleri`: `sablon_id` (şablon silinince gider), `sira`, `kod` 1–12 ("01.D"), `ad` 1–60,
    `alt_sinir`/`ust_sinir` (`numeric(12,3)`, varsayılan 0 ve 100; −10000…10000 arası ve alt < üst), `ana` = ortalamaya ve
    grafiğe giren ölçüm; `UNIQUE (sablon_id, kod)`; `sablon_olcumleri_tek_ana`: şablonda en çok bir ana ölçüm.
  - `sinav_gruplari` ("1. Dönem Yazılıları"): `okul_id`, `ogretmen_id`, `ders`, `ad` 1–100, `yil_id`;
    `sinav_gruplari_ogretmen`.
  - `sinavlar`: `okul_id`, `grup_id` (isteğe bağlı; grup silinince sınav gider), `sablon_id` (silinince boşalır),
    `ogretmen_id`, `ders`, `ad` 1–100, `tarih` (varsayılan bugün), `agirlik` (`numeric(5,2)`: 0'dan büyük, en çok 100;
    gruptaki sınavda zorunlu), `yil_id`; `sinavlar_grup`, `sinavlar_ogretmen` (öğretmen + tarih), `sinavlar_sablon`.
  - `sinav_olcumleri`: sınav açılırken şablonun ölçümleri buraya KOPYALANIR (şablon sonradan değişse de eski sonuçlar
    bozulmaz): `sinav_id` (sınav silinince gider), `sira`, `kod`, `ad`, `alt_sinir`/`ust_sinir` (yalnız alt < üst
    denetlenir), `ana`; `UNIQUE (sinav_id, kod)`; `sinav_olcumleri_tek_ana`.
  - `sinav_degerleri`: öğrencinin bir ölçümdeki değeri: `olcum_id`, `ogrenci_id` (ikisi de silinince gider), `deger`
    (−10000…10000, ondalıklı); öğrenciye göre `sinav_degerleri_ogrenci`.
- **Devamsızlık**: `devamsizlik`: `okul_id`, `sinif_id` ve `ders_id` (silinince boşalır), `ogrenci_id` (silinince gider),
  `tarih`, `durum` (`var`/`yok`/`gec`/`izinli`; yalnız "var" dışındaki durumlar yazılır, kaydı olmayan öğrenci derste
  sayılır), `aciklama`, `alan_id` (yoklamayı alan), `yil_id`; `devamsizlik_ogrenci` (öğrenci + tarih),
  `devamsizlik_ders_gun`, `devamsizlik_okul_gun`.
- **Mesajlar**: `mesajlar` (`okul_id`, `gonderen_id` (silinince boşalır), `tur` `mesaj`/`duyuru`, `konu` 1–120, `govde`
  ≤ 4000, `hedef_ozet` "7-A velileri", `tarih`; `mesajlar_gonderen`), `mesaj_alicilari` (`mesaj_id`, `alici_id`; öğrenciye
  giden mesajın velisine giden kopyasında `ogrenci_id` "kimin için"; `UNIQUE NULLS NOT DISTINCT (mesaj_id, alici_id,
  ogrenci_id)`; `mesaj_alicilari_alici`), `mesaj_okumalari` (`mesaj_id`, `kullanici_id`, `tarih`: kim, ne zaman okudu).
- **Takvim**: `takvim_etkinlikleri` (okulun etkinlikleri: `okul_id`, `tarih`, `bitis` (boş ya da ≥ tarih), `baslik` 1–120,
  `tur`, `aciklama`, `ekleyen_id`, `yil_id`; `takvim_okul_tarih`). Resmî tatiller kodda hesaplanır.
- **Bildirim, oturum, işaret, kayıt**:
  - `bildirimler` (`kullanici_id`, `metin`, `baglanti`, `okundu`; `bildirimler_kullanici`).
  - `oturumlar` (anahtarın kendisi değil SHA-256 özeti, `anahtar_ozeti`, birincil anahtar: veritabanı sızsa bile açık
    oturumlar ele geçirilemez; `kullanici_id`, `olusturma`; `oturumlar_kullanici`, `oturumlar_olusturma`).
  - `hatirlatmalar` (gönderilmiş otomatik hatırlatmaların `anahtar`ı, "odev:<ödev>:<öğrenci>", ve `gonderilme`: aynısı iki
    kez gitmesin).
  - `islem_kaydi` (kim, ne zaman, ne yaptı: `okul_id`, `kullanici_id` (silinince boşalır), kişi silinse de okunsun diye
    ayrıca `kullanici_ad` ve `kullanici_rol`, `islem`, `detay`, `ip inet`, `tarih`; `islem_kaydi_okul_tarih`).

**Neden:** Uygulama önce tek bir JSON dosyasında (`db.json`) veri tutuyordu; PostgreSQL'e geçişin ilk şeması bu. Kimliklerin
metin olması ve silme kurallarının uygulamanın davranışını birebir izlemesi bu geçiş yüzünden: eski `db.json` açılışta
kimlik değişmeden taşınır ([../index.md](../index.md) `baslat`, [../json-aktarim.md](../json-aktarim.md) `iceAktar`).

**Kullanan depo dosyaları:** `okullar`, `egitim_yillari` → [../depo/okullar.md](../depo/okullar.md);
`siniflar`, `dersler`, `ders_programi` → [../depo/siniflar.md](../depo/siniflar.md); `roller`, `rol_yetkileri`,
`rol_yetki_kapsamlari` → [../depo/roller.md](../depo/roller.md); `kullanicilar`, `mesaj_engelleri`, `veli_baglari` →
[../depo/kullanicilar.md](../depo/kullanicilar.md); ödev tabloları → [../depo/odevler.md](../depo/odevler.md); sınav
tabloları → [../depo/sinavlar.md](../depo/sinavlar.md); `devamsizlik` → [../depo/devamsizlik.md](../depo/devamsizlik.md);
mesaj tabloları → [../depo/mesajlar.md](../depo/mesajlar.md); `takvim_etkinlikleri`, `bildirimler`, `hatirlatmalar`,
`islem_kaydi` → [../depo/genel.md](../depo/genel.md); `oturumlar` → [../depo/oturumlar.md](../depo/oturumlar.md).
Satır ↔ nesne çevirisi [../esleme.md](../esleme.md)'de.

**Bugün:** Birkaç kural sonraki dosyalarla değişti: `okullar` yorumundaki "müdür başvurusuyla açılır, sistem yöneticisi
onaylar" `027`'den beri geçerli değil (okulu yönetici açar); `eposta` ve `rol` artık boş olabilir (`003`); rol listesi
`009`'da, telefon biçimi `015`'te, veli kodu biçimi `027` ve `032`'de değişti. Dosyanın baş yorumundaki "müdür silinince okul
beklemede'ye alınır" kuralı ise bugün de öyle çalışır (aşağıda "Dikkat!").

### 002-hiz.sql

**Depoya girdiği commit:** `4a7ca51 commit 8` (2026-08-28).

**Ne ekler:** Üç indeks: `odev_siniflari_sinif` (`odev_siniflari (sinif_id)`), `odevler_okul_bitis` (`odevler (okul_id,
bitis)`), `hatirlatmalar_zaman` (`hatirlatmalar (gonderilme)`).

**Neden:** Bir yıllık, 720 öğrencilik bir okulla yapılan yük testinde (`araclar/yuk-testi.js`) üç sorgu tablonun tamamını
tarıyordu: müdürün "Ders ödevleri" ekranı ödevleri sınıftan buluyor (birincil anahtar `(odev_id, sinif_id)` sırasında
olduğu için sınıftan aramada işe yaramıyordu); takvim, ayın içinde biten ödevleri okula göre arıyor; hatırlatma işaretleri
30 günden eskiyse siliniyor.

**Kullanan depo dosyaları:** [../depo/odevler.md](../depo/odevler.md), [../depo/genel.md](../depo/genel.md)
(`hatirlatmaTemizle`).

**Bugün:** Geçerli.

### 003-kullanici-adi.sql

**Depoya girdiği commit:** `5b9f47f commit 177` (2026-09-25).

**Ne ekler / değiştirir:**

- `kullanicilar.kullanici_adi` sütunu. Var olan her hesaba (en eskiden yeniye) e-postanın `@` öncesinden bir ad türetilir:
  küçük harf, yalnız `a-z 0-9 . _`, baştaki harf olmayan karakterler atılır, 3 karakterden kısaysa başına `kullanici`
  eklenir, en çok 24 karakter; alınmışsa sonuna 2, 3… eklenir. Sonra sütun `NOT NULL` olur, `kullanici_adi_bicimi`
  kısıtı (`^[a-z][a-z0-9._]{2,29}$`) ve tekil `kullanicilar_kullanici_adi` indeksi gelir.
- `rol` ve `eposta` sütunlarından `NOT NULL` kalkar: rolsüz hesap ve e-postasız hesap (küçük öğrenciler) mümkün olur.
- `tc_kimlik` sütunu: `NULL` ya da 11 hane, 0 ile başlamaz (sağlama algoritması uygulamada); tekil
  `kullanicilar_tc_kimlik` indeksi.
- Bütün öğrencilerin veli kodu yeniden üretilir: 10 karakter, `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` alfabesinden (32 karakter;
  her bayt mod 32 eşit dağılır), `gen_random_uuid()`'nin baytlarından; UUID'nin sürüm/çeşit bitleri sabit olan baytları
  (6. ve 8.) kullanılmaz; kod başka bir hesapta varsa yeniden üretilir.

**Neden:** Herkes girişte e-posta ya da kullanıcı adı yazabilsin; kayıt olan kişinin rolü olmasın (okul onu ekler, veli
kodunu giren veli olur); okulun açtığı hesapta e-posta zorunlu olmasın; T.C. no isteğe bağlı ama iki hesapta aynı olmasın;
eski veli kodlarında büyük/küçük harf ve işaretler karışıktı.

**Kullanan depo dosyası:** [../depo/kullanicilar.md](../depo/kullanicilar.md).

**Bugün:** Kullanıcı adı kısıtı ve tekil indeksi `009`'da değişti (okul içi / genel ayrımı); T.C. indeksi de `009`'da
bırakıldı. Bu dosyanın ürettiği 10 haneli veli kodlarının hepsi `027`'de boşaltıldı; bugünkü biçim `032`'de.

### 004-okul-davetleri.sql

**Depoya girdiği commit:** `fc6626a commit 178` (2026-09-25).

**Ne ekler:** `okul_davetleri` tablosu: `id`, `okul_id`, `kullanici_id` (ikisi de silinince davet gider), `rol`
(`teacher`/`student`), `brans`, `sinif_id` (silinince boşalır), `dogum_tarihi`, `davet_eden_id`, `olusturma`;
`UNIQUE (okul_id, kullanici_id)` (bir okul bir kişiye tek davet); kişiye göre `okul_davetleri_kullanici`.

**Neden:** Okul, rolsüz bir kişiyi kullanıcı adıyla öğretmen ya da öğrenci olarak ekliyordu; kişi daveti kendi başlangıç
sayfasından kabul edene kadar okula bağlanmasın ki bir okul, adını bildiği herhangi bir hesabı haberi olmadan kendine
bağlayıp üzerinde söz sahibi olamasın.

**Kullanan depo dosyası:** Yok.

**Bugün:** Tablo `009`'da `DROP TABLE` ile kaldırıldı (öğrenci ve öğretmen artık kendisi kaydolmuyor). Bu dosya yalnız
sırayla uygulandığı için duruyor.

### 005-son-giris.sql

**Depoya girdiği commit:** `fc6626a commit 178` (2026-09-25).

**Ne ekler:** `kullanicilar.son_giris` (`timestamptz`). Var olan hesaplara açık oturumlarının en yenisinin zamanı yazılır.

**Neden:** Okul öğrencilere toplu giriş bilgisi (kullanıcı adı + yeni şifre) dağıtırken yalnız "hiç giriş yapmamış"
hesapları seçebilsin: kendi şifresini koyup kullanan öğrencinin şifresi yanlışlıkla değişmesin.

**Kullanan depo dosyası:** [../depo/kullanicilar.md](../depo/kullanicilar.md) (girişte yazılır, toplu şifre dağıtımında
okunur).

**Bugün:** Oturumu süresi dolmuş hesaplar bu dosyada "hiç girmemiş" göründü; `009` onları KVKK onay tarihinden doldurdu.

### 006-anketler.sql

**Depoya girdiği commit:** `8a537cf commit 297` (2026-09-26).

**Ne ekler:** Dört tablo:

- `anketler`: `okul_id` (okul silinince gider), `olusturan_id` (silinince boşalır), `soru` (1–200), `aciklama` (≤ 1000),
  `hedef_ozet`, `gizli` (açan kimin neyi seçtiğini görmez, yalnız sayıları), `bitis` (zorunlu), `kapandi` (süresinden önce
  kapatıldıysa), `olusturma`; `anketler_okul` (okul + oluşturma).
- `anket_secenekleri`: `anket_id`, `sira`, `metin` (1–120); `UNIQUE (anket_id, sira)` ve bileşik anahtar için
  `UNIQUE (anket_id, id)`.
- `anket_hedefleri`: kimin oy verebileceği (`anket_id`, `kullanici_id`), anket açılırken yazılır; kişiye göre
  `anket_hedefleri_kisi`.
- `anket_oylari`: `anket_id`, `kullanici_id`, `secenek_id`, `tarih`; birincil anahtar `(anket_id, kullanici_id)` = kişi
  başına tek oy; `(anket_id, kullanici_id)` hedef listesine, `(anket_id, secenek_id)` anketin kendi seçeneklerine yabancı
  anahtarla bağlı.

**Neden:** Okul (toplu mesaj yetkisi olan kişi) bir gruba tek soruluk anket açar ("Gezi için hangi gün uygun?"). Hedef
listesinde olmayan kişinin ya da başka anketin seçeneğine verilmiş oy veritabanına hiç yazılamasın; kişi bitişe kadar
fikrini değiştirebilsin (aynı satır güncellenir).

**Kullanan depo dosyası:** [../depo/anketler.md](../depo/anketler.md).

**Bugün:** Geçerli.

### 007-okul-hayati.sql

**Depoya girdiği commit:** `ee23aa2 commit 304` (2026-09-26).

**Ne ekler:** Beş tablo (hepsi okul silinince gider):

- `yemek_listesi`: birincil anahtar `(okul_id, tarih)` = güne bir menü; `menu` (1–500, her satır bir yemek), `kalori`
  (1–5000, isteğe bağlı).
- `servisler`: `okul_id`, `ad` (1–60, okulda tek), `plaka` (≤ 15), `sofor`, `rehber` (≤ 80), `sofor_tel`, `rehber_tel`
  (≤ 20, serbest metin), `sabah`/`aksam` (`''` ya da `SS:DD`), `guzergah` (≤ 500), `olusturma`.
- `servis_ogrencileri`: birincil anahtar `ogrenci_id` = bir öğrenci tek serviste; `servis_id` (servis silinince gider),
  `durak` (≤ 120); servise göre `servis_ogrencileri_servis`.
- `kulupler`: `okul_id`, `ad` (1–80, okulda tek), `aciklama` (≤ 1000), `danisman_id` (silinince boşalır), `kontenjan`
  (1–1000; boş = sınırsız), `basvuru_acik` (varsayılan açık), `gun_saat` (≤ 60, "Çarşamba 15.00"), `olusturma`.
- `kulup_uyeleri`: `(kulup_id, ogrenci_id)`, `tarih`; öğrenciye göre `kulup_uyeleri_ogrenci`.

**Neden:** Okul hayatı bölümü: günlük menü; servis araçları ve hangi öğrencinin hangi serviste, hangi durakta bindiği
(şoför ve rehber telefonu yalnız o servisteki öğrenciye, velisine ve okul yönetimine görünür); kulüpler. Kontenjan kulüp
satırı kilitlenerek denetlenir: aynı anda gelen iki katılma isteği kontenjanı aşamaz (kilit koddadır).

**Kullanan depo dosyaları:** [../depo/okul-hayati.md](../depo/okul-hayati.md); nakilde servis ve kulüp kayıtlarını
[../depo/ogrenci-gecmisi.md](../depo/ogrenci-gecmisi.md), yoklamada servis öğrencilerini
[../depo/servis-yoklama.md](../depo/servis-yoklama.md) okur.

**Bugün:** `servisler`'e `010`'da servisçi, `servis_ogrencileri`'ne `028`'de sıra eklendi; telefonlar `015`'te `+90`'a
çevrildi.

### 008-odev-dosyalari.sql

**Depoya girdiği commit:** `942bcfd commit 363` (2026-09-26).

**Ne ekler:** `odev_dosyalari`: `id` (32 küçük onaltılık hane = diskteki dosya adı), `odev_id`, `ogrenci_id`, `ad` (1–150),
`boyut` (> 0), `crc32`, `sha256` (64 hane), `yuklenme`. `(odev_id, ogrenci_id)` ödevin öğrenci listesine
(`odev_ogrencileri`) bileşik yabancı anahtarla bağlı: öğrenci ödevden çıkarılırsa ya da ödev silinirse kayıtları da
silinir. İndeks: `odev_dosyalari_odev (odev_id, ogrenci_id)`.

**Neden:** Öğrenci ödevine dosya yükler (fotoğraf, PDF, sunum, video…). Dosyanın kendisi diskte, `public` klasörünün
DIŞINDA (`data/dosyalar`) tahmin edilemeyen bir adla durur, yalnız yetki denetleyen uçtan indirilir; veritabanında yalnız
bilgisi tutulur. Diskte kalan artıklar periyodik temizlikte kaldırılır.

**Kullanan depo dosyaları:** [../depo/odev-dosyalari.md](../depo/odev-dosyalari.md),
[../depo/okul-disk.md](../depo/okul-disk.md) (okulun kullandığı yer). Uçlar: [../../bolumler/odev-dosya.md](../../bolumler/odev-dosya.md).

**Bugün:** Dosyanın ne zaman silineceği `033` ve `034`'teki kurallarla ödevden hesaplanır (son teslim + 7 gün …).

### 009-okul-adresi-hesaplar.sql

**Depoya girdiği commit:** `0d59e0f commit 333` (2026-09-26).

**Ne ekler / değiştirir:**

- `okullar.kisa_ad`: okulun adresi; `NULL` ya da `^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$` (3–40 karakter, tireyle başlayıp
  bitmez); tekil `okullar_kisa_ad`.
- Rol listesine `servisci`: eski rol kısıtı `pg_constraint`'te aranır (tanımında `'student'` geçen ama `okul_id` geçmeyen
  CHECK) ve bırakılır; yerine `kullanicilar_rol_gecerli` (`rol IS NULL OR rol IN ('admin', 'principal', 'teacher',
  'student', 'parent', 'servisci')`). Servisçinin okula bağlı olma şartı `001`'deki tablo kısıtından gelir.
- `kullanici_adi_bicimi` yeniden: harfle başlayan ad YA DA 11 haneli T.C. no (`^[1-9][0-9]{10}$`). Kısıt T.C. biçimli adı her
  hesapta kabul eder; onu yalnız okulun açtığı hesaba veren kuraldır, uygulamadadır.
- Kullanıcı adı tekilliği ikiye ayrılır: `kullanicilar_kullanici_adi` bırakılır; `kullanicilar_kadi_okul` (`okul_id,
  kullanici_adi`; müdür, öğretmen, öğrenci, servisçi = okul içinde tek) ve `kullanicilar_kadi_genel` (rolsüz, yönetici,
  veli = kendi aralarında tek).
- T.C. tekilliği de aynı biçimde: `kullanicilar_tc_kimlik` bırakılır; `kullanicilar_tc_okul` ve `kullanicilar_tc_genel`.
- `okul_no` (≤ 20, varsayılan `''`); `kullanicilar_okul_no`: öğrencide boş olmayan okul no okul içinde tek.
- `sifre_degismeli` (varsayılan `false`): şifreyi başkası belirlediyse kişi ilk girişte kendi şifresini koymadan devam
  edemez.
- Veri: `son_giris` boş ama KVKK onayı olan hesaplara `kvkk_tarih` yazılır (`005`'in açığı).
- `DROP TABLE okul_davetleri`.

**Neden:** Her okulun kendi adresi olsun ve o adreste yalnız o okulun girişi olsun; öğrenci, öğretmen, müdür ve servisçi
hesapları OKULA ait olsun (iki okulda aynı "ahmet.yilmaz" olabilsin); servis şoförü rolü gelsin (hesabını müdür açar);
öğrenci ve öğretmen artık kendisi kaydolmasın, hesabı okul açsın (davetlere gerek kalmadı).

**Kullanan depo dosyaları:** [../depo/okullar.md](../depo/okullar.md) (`kisa_ad`), [../depo/kullanicilar.md](../depo/kullanicilar.md).
Tekil indeks adları [../baglanti.md](../baglanti.md)'deki `CAKISMALAR`'da iletiye çevrilir.

**Bugün:** Geçerli. Öğrencinin T.C. no'su `021`'den beri ayrıca bütün sistemde tek (`kullanicilar_tc_ogrenci`); yöneticinin
kullanıcı adı `031`'den beri hiçbir hesapla çakışamaz. Yorumdaki `egitimevi.org/<kisa_ad>` biçimi yazıldığı günün adresidir;
okul sayfasının bugünkü yolu `/school/<okul>` ([../../http.md](../../http.md)).

### 010-servis-konum.sql

**Depoya girdiği commit:** `aced02f commit 312` (2026-09-26).

**Ne ekler:**

- `okullar.enlem`, `okullar.boylam` (−90…90, −180…180): servis haritasında okulun işareti; müdür haritadan seçer.
- `servisler.sofor_id` (servisçi hesabı; silinince boşalır) ve kısmi indeksi `servisler_sofor`.
- `ogrenci_konumlari`: öğrenci başına tek satır (`ogrenci_id` birincil anahtar), `enlem`, `boylam`, `giren_id`,
  `guncelleme`. Öğrenci, velisi ya da okul yönetimi işaretler.
- `servis_seferleri`: `id`, `servis_id` (servis silinince gider), `sofor_id`, `yon` (`gidis`/`donus`), `baslangic`,
  `bitis`, aracın YALNIZ son konumu (`son_enlem`, `son_boylam`, `son_dogruluk`, `son_konum`); `servis_seferleri_tek_acik`:
  bir serviste aynı anda tek açık sefer (`WHERE bitis IS NULL`).
- `sefer_bildirimleri`: `(sefer_id, ogrenci_id, esik)` = yaklaşma bildirimi her seferde öğrenci ve eşik başına bir kez;
  `tarih`.

**Neden:** Canlı servis takibi: servisçi "sefere başla" deyince sefer açılır, "bitir" deyince kapanır; geçmiş iz
saklanmaz. Ev konumunu yalnız öğrenci, velisi, o servisin servisçisi ve okul yönetimi görür; aracın konumu yalnız açık
seferde, o servisteki öğrencilere ve velilerine gösterilir. Yaklaşma eşikleri 500 m ve 100 m
([../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md) `YAKLASMA_ESIKLERI`).

**Kullanan depo dosyaları:** [../depo/okul-hayati.md](../depo/okul-hayati.md) (seferler bitişlerinden 30 gün sonra silinir),
[../depo/okullar.md](../depo/okullar.md) (okul konumu), [../depo/ogrenci-gecmisi.md](../depo/ogrenci-gecmisi.md) (nakilde).

**Bugün:** Geçerli. `servis_seferleri` ve `sefer_bildirimleri` yedeğe girmez; geri yüklemede `servisler`'e bağlı oldukları
için boşalır (Tablo dizini).

### 011-push.sql

**Depoya girdiği commit:** `bd7d108 commit 322` (2026-09-26).

**Ne ekler:** `push_abonelikleri`: `id`, `kullanici_id` (silinince gider), `endpoint` (tek, 10–1000), `p256dh` (base64url
80–100 karakter), `auth` (base64url 16–30), `olusturma`, `son_basari`; kişiye göre `push_abonelikleri_kisi`.

**Neden:** Telefon bildirimi (Web Push). Kişi "Telefon bildirimlerini aç" deyince tarayıcı bir abonelik verir: push
servisinin adresi ve uçtan uca şifreleme anahtarları. İçerik bu anahtarlarla şifrelenir, push servisi okuyamaz. Aynı cihaz
başka hesaba geçerse abonelik yeni hesaba taşınır (`endpoint` tek olduğu için).

**Kullanan depo dosyası:** [../depo/push.md](../depo/push.md); gönderim [../../push.md](../../push.md).

**Bugün:** Geçerli. Yedeğe girmez; geri yüklemede önce okunup sonra hâlâ var olan kişiler için geri yazılır.

### 012-yetiskin-hesap.sql

**Depoya girdiği commit:** `d6b0f4f commit 338` (2026-09-26).

**Ne ekler:**

- `kullanicilar.ana_hesap_id` (aynı tabloya yabancı anahtar, `ON DELETE CASCADE`) ve kısmi indeksi
  `kullanicilar_ana_hesap`: bir okul rolü satırı hangi yetişkin hesabına ait.
- `kullanicilar_rol_satiri` kısıtı: `ana_hesap_id` doluysa satır yalnız `teacher` ya da `principal`, bir okula bağlı ve
  e-postasız olabilir.
- `kullanicilar_ana_okul`: bir kişi bir okulda tek rol (`ana_hesap_id, okul_id`).
- `eslesme_kodu` (`''` ya da `^[A-Z0-9]{10}$`; kısıt adsız, PostgreSQL adlandırdı) ve tekil `kullanicilar_eslesme_kodu`
  (boş olmayan kod tek).
- `kullanicilar_bekleyen_basvuru`: bir hesabın aynı anda tek bekleyen müdür başvurusu (`rol = 'principal' AND durum =
  'pending'`); aynı anda gönderilen iki başvuru birbirini geçemez.

**Neden:** Kendisi kaydolan tek hesap türü yetişkin hesabıdır (veli, öğretmen, müdür adayı); girişi o yapar. Bir yetişkin
birden çok okulda rol alabilir (A'da öğretmen, B'de müdür): her okul rolü ayrı bir kullanıcı satırıdır ve yetişkin
hesabına bağlıdır; oturum her zaman seçilen satırla açılır, ödev/ders/yetki/mesaj kayıtları rolün kendisine bağlı kalır.
Rol satırının e-postası ve kullanılabilir şifresi yoktur. Yetişkin hesabı silinince rolleri de silinir. Öğretmen kendi
eşleme kodunu müdüre verir, müdür kodu girince öğretmen rolü açılır ve kod yenilenir.

**Kullanan depo dosyaları:** [../depo/kullanicilar.md](../depo/kullanicilar.md); `ana_hesap_id`'yi ayrıca
[../depo/oturumlar.md](../depo/oturumlar.md), [../depo/cihazlar.md](../depo/cihazlar.md), [../depo/push.md](../depo/push.md)
ve [../depo/genel.md](../depo/genel.md) (`siteSayilari`: açılış sayfasındaki kişi sayısı rol satırlarını saymaz) kullanır.
Uçlar: [../../bolumler/kisilik.md](../../bolumler/kisilik.md).

**Bugün:** Kod biçimi `027`'de (15 karakter), sonra `032`'de (16 karakter) değişti. Müdür başvurusu `027`'de kalktı;
`kullanicilar_bekleyen_basvuru` indeksi duruyor ama bugün hiçbir uç kullanıcı satırını `'pending'` durumuyla yazmıyor
(yalnız eski bir yedek geri yüklenirse [../json-aktarim.md](../json-aktarim.md) `iceAktar` eski `'pending'` satırlarını
olduğu gibi alır). Yani indeks bugün boşta.

### 013-ogretmen-rolu-etut.sql

**Depoya girdiği commit:** `e9b0754 commit 344` (2026-09-26).

**Ne ekler:**

- `roller.tur` (`'ozel'`/`'ogretmen'`, varsayılan `'ozel'`) ve `roller_okul_ogretmen`: okulda tek hazır Öğretmen rolü.
- `etutler`: `okul_id` (okul silinince gider), `ad` (1–80), `gun` (1–7, ders programı gibi), `baslangic`/`bitis` (bitiş
  sonra), `yer` (≤ 60), `ogretmen_id` (silinince boşalır); `etutler_okul` (okul + gün + başlangıç), `etutler_ogretmen`.
- `etut_ogrencileri` (`etut_id`, `ogrenci_id`; öğrenciye göre `etut_ogrencileri_ogrenci`), `etut_yoklamalari`
  (`(etut_id, tarih, ogrenci_id)` = günde öğrenci başına tek satır; `durum` `var`/`yok`/`izinli`; `alan_id`, `guncelleme`;
  `etut_yoklamalari_ogrenci` (öğrenci + tarih)).
- `mesajlar.duzenlenme`: gönderen mesajı sonradan düzeltebilir, ne zaman düzeltildiği görünür.

**Neden:** Her okulun hazır bir "Öğretmen" rolü olsun: okuldaki her öğretmen bu rolün yetkilerine kendiliğinden sahip
olsun, müdür bu yetkileri öteki roller gibi açıp kapatabilsin; öğretmene ayrıca özel rol verilirse iki rolün yetkileri
birleşsin. Etüt: ders dışı çalışma; öğretmeni ya da "etüt yoklaması" yetkisi olan kişi yoklamayı alır.

**Kullanan depo dosyaları:** [../depo/roller.md](../depo/roller.md), [../depo/etutler.md](../depo/etutler.md),
[../depo/mesajlar.md](../depo/mesajlar.md), [../depo/ogrenci-gecmisi.md](../depo/ogrenci-gecmisi.md) (nakilde etüt
üyelikleri).

**Bugün:** Geçerli. Dikkat: bu dosya rol SATIRINI kurmaz, yalnız sütunu ekler. Hazır rol, `rol.yonet` yetkisi olan biri
(müdür) Roller sayfasını ilk açtığında `GET /api/school/roles` içinde `depo.roller.ogretmenRolu` ile kurulur
([../../bolumler/okul.md](../../bolumler/okul.md)); o zamana kadar öğretmenler [../../yetki.md](../../yetki.md)'deki
`OGRETMEN_VARSAYILAN` yetkilerini alır.

### 014-okul-acti.sql

**Depoya girdiği commit:** `d21a935 commit 386` (2026-09-26).

**Ne ekler:** `kullanicilar.okul_acti` (varsayılan `false`); `olusturan_id`'si dolu hesaplarda `true` yapılır.

**Neden:** Öğrenci ve servisçi hesabını okul açar; böyle hesapta T.C. no'yu ve e-postayı okul yönetimi düzenler. Bu bilgi
eskiden `olusturan_id`'den çıkarılıyordu; açan kişi (ör. okuldan ayrılan öğretmenin rol satırı) silinince sütun boşalıyor,
hesap "kendisi kaydolmuş" sayılıyordu. Artık silinmeyen ayrı bir işaret var.

**Kullanan depo dosyaları:** [../depo/kullanicilar.md](../depo/kullanicilar.md) ([../esleme.md](../esleme.md) üzerinden).

**Bugün:** Geçerli.

### 015-telefon-ulke-kodu.sql

**Depoya girdiği commit:** `468813f commit 383` (2026-09-26).

**Ne değiştirir:**

- `001`'in otomatik adlı telefon kısıtı (`kullanicilar_telefon_check`) `DROP CONSTRAINT IF EXISTS` ile bırakılır.
- `0XXXXXXXXXX` biçimindeki numaralar `+90XXXXXXXXXX`'e çevrilir.
- Aynı adla yeni kısıt: `telefon = '' OR telefon ~ '^\+[1-9][0-9]{6,14}$'` (E.164).
- `servisler.sofor_tel` ve `rehber_tel`'de yalnız Türkiye biçimindekiler çevrilir (bu sütunlar serbest yazılmış olabilir;
  kısıtları değişmez, yalnız uzunluk ≤ 20).

**Neden:** Yurt dışındaki veli ya da servisçi de numarasını yazabilsin; telefon uluslararası biçimde saklansın.

**Kullanan depo dosyaları:** [../depo/kullanicilar.md](../depo/kullanicilar.md), [../depo/okul-hayati.md](../depo/okul-hayati.md).
Numarayı bu biçime getiren `normTelefon` [../../ortak.md](../../ortak.md)'de.

**Bugün:** Geçerli.

### 016-eposta-onayi.sql

**Depoya girdiği commit:** `c3343cb commit 381` (2026-09-26).

**Ne ekler:** `eposta_onaylari`: `anahtar_ozeti` (birincil anahtar; bağlantıdaki anahtarın SHA-256 özeti), `tur`
(`kayit`/`eposta`), `eposta` (3–254), `kullanici_id` (e-posta değişikliğinde adresi değişecek hesap; silinince gider),
kayıtta açılacak hesabın bilgileri (`kullanici_adi`, `ad_soyad`, `sifre_ozeti`, `telefon`, `tc_kimlik`, `adres`,
`kvkk_surum`), `olusturma`, `bitis`. Kısıt: `eposta` türünde `kullanici_id`, `kayit` türünde kullanıcı adı, ad soyad, şifre
özeti ve KVKK sürümü zorunlu. İndeksler: `eposta_onaylari_eposta`, `eposta_onaylari_bitis`.

**Neden:** Hesap, e-postadaki bağlantıya tıklanmadan açılmasın: kimse sahibi olmadığı bir adresle hesap açamasın. Kayıt
formu doldurulunca bilgiler burada bekler (şifre özetlenmiş), adrese tek kullanımlık bağlantı gider, tıklanınca hesap açılır
ve satır silinir. Yetişkin hesabında e-posta değiştirmek de aynı yoldan geçer. Bağlantı 24 saat geçerlidir.

**Kullanan depo dosyası:** [../depo/onaylar.md](../depo/onaylar.md) (süresi geçenler `suresiGecenleriSil` ile silinir).

**Bugün:** Geçerli. Yedeğe girmez; geri yüklemede `kullanicilar`'a bağlı olduğu için boşalır (bekleyen kayıtlar yeniden
yapılmalı).

### 017-odev-yildizi.sql

**Depoya girdiği commit:** `fc44576 commit 370` (2026-09-26).

**Ne ekler:** `odev_ogrencileri.yildiz` (varsayılan `false`).

**Neden:** Öğrenci önemli bulduğu ödevi yıldızlar ve listeyi "yıldızlı" diye süzer. Yıldız yalnız öğrencinin kendisi
içindir (öğretmen, müdür, veli görmez); ödevi alan öğrencinin satırında durduğu için ödev ya da öğrenci silinince kendiliğinden
gider.

**Kullanan depo dosyası:** [../depo/odevler.md](../depo/odevler.md).

**Bugün:** Geçerli.

### 018-okul-sayfasi.sql

**Depoya girdiği commit:** `44c2bb6 commit 388` (2026-09-26).

**Ne ekler:**

- `okul_sayfalari`: okul başına tek satır (`okul_id` birincil anahtar, okul silinince gider), `tanitim` (≤ 1500),
  `ayarlar` (`jsonb`: renk, zemin, başlık ve kapak boyu, hiza), `css` (≤ 8000), `guncelleyen_id` (silinince boşalır),
  `guncelleme`.
- `okul_fotolari`: `id` (32 onaltılık hane), `okul_id` (okul silinince gider), `yer` (`kapak`/`logo`/`galeri`), `tur`
  (`image/png`, `image/jpeg`, `image/webp`), `boyut` (> 0), `aciklama` (≤ 120), `olusturma`; `okul_fotolari_okul`
  (okul + zaman).

**Neden:** Okulun giriş sayfasında, giriş kartının üstünde okulun kendi tanıtımı: kapak ve logo, tanıtım yazısı, galeri,
renk ve boyut ayarları, kısıtlı CSS. Müdür ya da "okul.sayfa" yetkisi verilen kişi ("Kodlayıcı" rolü) düzenler. CSS yazıldığı
gibi saklanır (düzenlerken geri gelsin) ama sayfaya her gidişte yeniden temizlenir
([../../yardimci/css-temizle.md](../../yardimci/css-temizle.md)); temizlenmemiş CSS dışarı çıkmaz. Fotoğrafın kendisi
`data/okul-fotolari/<id>` içinde, konum ve cihaz bilgisi silinmiş hâlde durur.

**Kullanan depo dosyaları:** [../depo/okul-sayfalari.md](../depo/okul-sayfalari.md), [../depo/okul-disk.md](../depo/okul-disk.md)
(fotoğraflar okulun disk sınırına sayılır). Uçlar: [../../bolumler/okul-sayfasi.md](../../bolumler/okul-sayfasi.md).

**Bugün:** Geçerli. `yer` kısıtında "simge" yok; planlanan okul simgesi (aşağıda "Son durum") yeni bir şema dosyası ister.

### 019-yorumlar.sql

**Depoya girdiği commit:** `28e484d commit 410` (2026-09-26).

**Ne ekler:** `yorumlar`: `id`, `hesap_id` (tek; yetişkin ana hesabı; silinince gider), `yildiz` (0–5), `metin` (3–500),
`ad_kisa` (≤ 40), `rol` (≤ 60, "Veli", "Öğretmen, veli"), `gizli`, `olusturma`, `guncelleme`; `yorumlar_gorunen`
(`guncelleme DESC`, yalnız gizli olmayanlar).

**Neden:** Eğitim Evi'ni kullanan yetişkinler açılış sayfasının altında görünen bir yorum ve yıldız bırakır; hesap başına
tek yorum (sonradan değiştirilebilir). Ad tam yazılmaz, yazıldığı anda kısaltılıp saklanır (örneğin "Ayşe Demir" →
"Ay. De."). Uygunsuz kelime süzgeci [../../yardimci/kufur-suzgeci.md](../../yardimci/kufur-suzgeci.md)'de. Yönetici bir
yorumu gizleyebilir (silinmez, görünmez olur).

**Kullanan depo dosyası:** [../depo/yorumlar.md](../depo/yorumlar.md). Uçlar: [../../bolumler/yorum.md](../../bolumler/yorum.md).

**Bugün:** Geçerli.

### 020-ekler.sql

**Depoya girdiği commit:** `7daee9c commit 414` (2026-09-26).

**Ne ekler:** `ekler`: `id` (32 onaltılık hane = diskteki ad), `yukleyen_id` (silinince gider), `okul_id` (boş olabilir;
okul silinince gider), `tur` (`mesaj`/`odev`), `mesaj_id`, `odev_id` (hedef silinince gider), `ad` (1–150), `boyut`,
`sha256`, `yuklenme`, `bitis` (zorunlu), `silindi`. Kısıtlar: aynı ek hem mesaja hem ödeve bağlı olamaz; `tur` hangi
hedefe bağlanabileceğini belirler. İndeksler: `ekler_mesaj`, `ekler_odev`, `ekler_taslak` (yükleyene göre, hedefsiz
olanlar), `ekler_bitis` (silinmemişler).

**Neden:** Mesaja ve öğretmenin verdiği ödeve dosya eklenir. Dosya seçilir seçilmez yüklenir; önce "taslak"tır (hedefsiz,
yalnız yükleyen görür), mesaj gönderilince ya da ödev kaydedilince bağlanır. Dosya bir süre sonra diskten silinir, satır
"silindi" diye kalır ki mesajda "süresi doldu" yazsın. Dosyanın kendisi `data/ekler/<id>` içinde.

**Kullanan depo dosyaları:** [../depo/ekler.md](../depo/ekler.md) (`bitis` = yükleme + 7 gün; bağlanmayan taslak 6 saat
sonra silinir), [../depo/okul-disk.md](../depo/okul-disk.md). Uçlar: [../../bolumler/ekler.md](../../bolumler/ekler.md).

**Bugün:** Yorumdaki sınırlar eskidi: "bir mesajın ya da ödevin ekleri toplam 150 MB" bugün 50 MB'tır (`EK_SINIR`), 150 MB
kişinin gönderilmemiş taslaklarının toplamıdır (`TASLAK_SINIR`) — ikisi de [../../bolumler/ekler.md](../../bolumler/ekler.md)'de.
Öğrenci teslim dosyalarının "7 gün" kuralı da değişti: silinme anı artık ödevden hesaplanır (`033`, `034`). `035` bu
tabloya okula göre bir indeks ekledi. Tablo yedeğe girmez ve geri yüklemede bütün satırları kaybolur
([../json-aktarim.md](../json-aktarim.md) "Dikkat!").

### 021-ogrenci-gecmisi.sql

**Depoya girdiği commit:** `fb65e8d commit 422` (2026-09-26).

**Ne ekler:**

- `ogrenci_gecmisi`: `id`, `ogrenci_id`, `okul_id`, `yil_id` (üçü de silinince satır gider), `okul_adi`, `yil_adi`,
  `sinif_adi` (o anki hâliyle saklanır), `ayrilis`. Tekil ifade indeksi `ogrenci_gecmisi_tekil (ogrenci_id, okul_id,
  COALESCE(yil_id, ''))`.
- `kullanicilar.secili_gecmis` (`ogrenci_gecmisi`'ne bağlı, silinince boşalır): kişinin baktığı geçmiş dönem.
- `kullanicilar_tc_ogrenci`: öğrencinin T.C. no'su bütün sistemde tek (`WHERE tc_kimlik IS NOT NULL AND rol = 'student'`)
  — ama YALNIZ eski veride aynı T.C.'li iki öğrenci yoksa kurulur; varsa `RAISE NOTICE` yazılır, dosya yine başarıyla biter.

**Neden:** Öğrenci hesabı okula değil kişiye aittir. Başka okul aynı T.C. ile öğrenci eklemek isterse doğum tarihi de
eşleşirse hesap o okula taşınır (nakil); eşleşmezse eklenemez. Eski okulun ödevleri, notları, devamsızlığı o okulun kaydı
olarak kalır, yeni okul görmez; öğrenci ve velisi yıl seçicide "2025-2026 · Eski Okul · 6-A" diye seçip salt okunur görür.
Taşınırken eski okulun her eğitim yılı için bir satır yazılır (okulda yıl yoksa `yil_id` boş tek satır).

**Kullanan depo dosyaları:** [../depo/ogrenci-gecmisi.md](../depo/ogrenci-gecmisi.md), [../depo/kullanicilar.md](../depo/kullanicilar.md).
Uçlar: [../../bolumler/nakil.md](../../bolumler/nakil.md), [../../bolumler/egitim-yili.md](../../bolumler/egitim-yili.md).

**Bugün:** Geçerli. İndeks kurulamadıysa `031` bir kez daha dener (aşağıda "Dikkat!": ikisi de kuramadıysa bir daha
kendiliğinden denenmez).

### 022-okul-ozellikleri.sql

**Depoya girdiği commit:** `f2330da commit 430` (2026-09-26).

**Ne ekler:** `okul_kapali_ozellikler`: `(okul_id, ozellik)` birincil anahtar (okul silinince gider); `ozellik` şu
sekizinden biri: `odev`, `sinav`, `devamsizlik`, `etut`, `servis`, `yemek`, `kulup`, `anket`; `kapatan_id` (silinince
boşalır), `kapanma`. Satır yoksa özellik açıktır.

**Neden:** Müdür "Özellikler" sayfasından okulunda kullanmadığı bölümleri kapatır; kapalı bölüm menülerden kalkar, sunucu da
o bölümün isteklerini reddeder. Kayıtlar silinmez: yeniden açılınca eskisi gibi görünür.

**Kullanan depo dosyası:** [../depo/ozellikler.md](../depo/ozellikler.md) (açılışta belleğe yüklenir). Uçlar:
[../../bolumler/ozellikler.md](../../bolumler/ozellikler.md).

**Bugün:** Geçerli. Kapatılabilir yeni bir bölüm eklenirse `ozellik` kısıtı yeni bir şema dosyasıyla genişletilmeli (quiz
bugün `odev`'e bağlıdır).

### 023-ogretmen-yetkileri.sql

**Depoya girdiği commit:** `e8ebe76 commit 448` (2026-09-26).

**Ne ekler:** Yalnız veri: var olan her hazır Öğretmen rolüne (`roller.tur = 'ogretmen'`) `sinav.olustur` ve
`ogretmen.sonuclar` yetkileri eklenir (`ON CONFLICT DO NOTHING`, iki kez yazılmaz). Yapı değişmez.

**Neden:** "Sınav oluşturur" yetkisi sunucuda eskiden denetlenmiyordu, her öğretmen sınav açabiliyordu; artık
denetleniyor. Öğretmenler sınav açmaya devam etsin diye yetki hazır role eklenir; müdür istemezse Roller ve Yetkiler
sayfasından kapatır. Aynı anda gelen yeni yetki "Girdiği sınıfların öğrenci sonuçlarını görür" (Sınıflarım bölümü) de açık
gelir.

**Kullanan depo dosyası:** [../depo/roller.md](../depo/roller.md). Hazır rolü henüz kurulmamış okullarda iki yetki zaten
`OGRETMEN_VARSAYILAN`'da ([../../yetki.md](../../yetki.md)).

**Bugün:** Geçerli.

### 024-hatirlaticilar.sql

**Depoya girdiği commit:** `37b3ef2 commit 436` (2026-09-26).

**Ne ekler:**

- `hatirlaticilar`: `id`, `kullanici_id` (silinince gider), `baslik` (1–120), `aciklama` (≤ 1000), `siklik` (`bir-kez`,
  `her-gun`, `her-hafta`, `her-ay`), `tarih` (`bir-kez`te zorunlu), `saat` (zorunlu), `ay_gunu` (1–31; `her-ay`da zorunlu),
  `aktif`, `son_gonderim`, `olusturma`; `hatirlaticilar_kisi` (kişi + oluşturma) ve `hatirlaticilar_aktif` (yalnız aktifler).
- `hatirlatici_gunleri`: `her-hafta` için seçilen günler: `hatirlatici_id` (hatırlatıcı silinince gider), `gun`
  (1 Pazartesi … 7 Pazar).

**Neden:** Her kullanıcı kendine hatırlatıcı kurar; zamanı gelince bildirim (ve telefon bildirimi) gider. Saatler Türkiye
saatidir; kısa ayda `ay_gunu` ayın son gününe düşer.

**Kullanan depo dosyası:** [../depo/hatirlaticilar.md](../depo/hatirlaticilar.md); zaman hesabı
[../../yardimci/hatirlatici-zaman.md](../../yardimci/hatirlatici-zaman.md), uçlar [../../bolumler/hatirlatici.md](../../bolumler/hatirlatici.md).

**Bugün:** Geçerli.

### 025-odev-baslama-saati.sql

**Depoya girdiği commit:** `cfe3da0 commit 456` (2026-09-26).

**Ne ekler:** `odevler.baslangic_saati` (`time`, boş olabilir).

**Neden:** Öğretmen başlama tarihinin yanında saatini de seçsin (yaygın okul yazılımlarındaki gibi: "Başlama 08.09 ·
08:00, Son tarih 15.09 · 23:00"). Eski ödevlerde boştur, yalnız gün yazılır.

**Kullanan depo dosyası:** [../depo/odevler.md](../depo/odevler.md) ([../esleme.md](../esleme.md) `startTime` olarak çevirir).

**Bugün:** Geçerli.

### 026-aile.sql

**Depoya girdiği commit:** `df4b66b commit 460` (2026-09-26).

**Ne ekler:** Eğitim Evi Aile'nin altı tablosu (hepsinde `ogrenci_id` var ve öğrenci silinince gider):

- `aile_cihazlari`: `id`, `ogrenci_id`, `anahtar_ozeti` (tek, 64 karakter), `ad` (≤ 80), `platform` (varsayılan
  `android`), `surum`, `son_gorulme`, `olusturma`; öğrenciye göre `aile_cihazlari_ogrenci`.
- `aile_konumlari`: `bigserial` kimlik (`id`), `ogrenci_id`, `cihaz_id` (cihaz silinince boşalır), `enlem`, `boylam`,
  `dogruluk` (0–100000), `ag` (`''`/`wifi`/`mobil`), `pil` (0–100), `zaman`; `UNIQUE (ogrenci_id, zaman)` ve
  `aile_konumlari_ogrenci_zaman` (öğrenci + zaman, yeniden eskiye).
- `aile_kullanim`: `(ogrenci_id, gun, paket)` = günlük uygulama süresi; `ad` (uygulamanın adı, 1–100), `dakika` 0–1440; aynı
  gün yeniden gelince üzerine yazılır.
- `aile_ayarlari`: çocuk başına tek satır; `wifi_dk`/`mobil_dk` (1, 5, 10, 15, 30, 60; varsayılan 5 ve 15),
  `konum_acik`, `kullanim_acik`, `toplam_sinir` (5–1440), `guncelleyen` (silinince boşalır), `guncelleme`.
- `aile_sinirlari`: uygulama başına günlük sınır: `(ogrenci_id, paket)`, `ad`, `dakika` (5–1440).
- `aile_uyarilari`: `(ogrenci_id, gun, anahtar)` = sınır aşımı bildirimi günde bir kez (`anahtar` `'toplam'` ya da paket).

**Neden:** Öğrencinin telefonundaki uygulama (ayrı Android deposu) velinin seçtiği aralıkla konumu ve uygulama kullanım
sürelerini gönderir. Yalnız öğrenciye bağlı onaylı veliler görür; okul görmez. Konumlar ve kullanım 7 gün sonra silinir.
Uygulama kapatma ya da kilitleme yoktur; sınır aşılınca veliye bildirim gider. Cihaz öğrenci hesabıyla bir kez bağlanır ve
kendi anahtarını alır; anahtar yalnız bu tablolara yazmaya yarar, hesaba giriş vermez; veritabanında yalnız özeti durur.

**Kullanan depo dosyası:** [../depo/aile.md](../depo/aile.md) (`aile_konumlari`, `aile_kullanim`, `aile_uyarilari` 7 günden
eskiyse silinir). Uçlar: [../../bolumler/aile.md](../../bolumler/aile.md).

**Bugün:** Geçerli. Altı tablo da yedeğe girmez ve geri yüklemede boşaltılır. [../json-aktarim.md](../json-aktarim.md)
hepsine "7 günlük geçici veri" der, ama bu yalnız konum, kullanım ve uyarı tabloları için doğru: cihaz bağları, veli
ayarları ve uygulama sınırları kalıcıdır ve geri yüklemede onlar da gider (aşağıda "Dikkat!").

### 027-kisi-kodu.sql

**Depoya girdiği commit:** `0acca75 commit 516` (2026-09-27).

**Ne değiştirir:**

- `kullanicilar` üzerinde tanımında `eslesme_kodu` geçen bütün CHECK kısıtları (`012`'nin otomatik adlı kısıtı)
  `pg_constraint`'ten bulunup `format('… %I', ad)` ile bırakılır.
- Yeni desene (`^[A-Za-z][A-Za-z0-9!?#*+-]{14}$`, 15 karakter) uymayan `eslesme_kodu` ve `veli_kodu` değerleri `''`
  yapılır; yani eski 10 haneli kodların hepsi geçersiz olur.
- Adlı iki kısıt: `kullanicilar_eslesme_kodu_bicimi`, `kullanicilar_veli_kodu_bicimi` (`''` ya da 15 karakterlik desen).
  `veli_kodu`'nun bu dosyadan önce biçim kısıtı yoktu. Tekil indeksler (`kullanicilar_veli_kodu_tekil`,
  `kullanicilar_eslesme_kodu`) aynen kalır.
- Veri: yetişkin hesabına bağlı bekleyen müdür satırları (`rol = 'principal' AND durum = 'pending' AND ana_hesap_id IS NOT
  NULL`) silinir (kişinin hesabı ve öteki rolleri durur). Eski usul, kendi e-postasıyla açılmış bekleyen müdür hesabına
  dokunulmaz (yönetici "Müdürler" listesinden kaldırır).
- Veri: içinde onaylı kimse kalmayan bekleyen okullar `rejected` yapılır ve `kisa_ad`'ı boşaltılır. Adres boşa çıkar; MEB
  kodu da boşa çıkar, çünkü `okullar_meb_kodu_tekil` reddedilmiş okulu saymaz.

**Neden:** Herkesin kendine ait bir kişi kodu olsun: öğrencide "veli kodu" (veli çocuğunu onunla ekler), yetişkin hesabında
"kişi kodu" (`eslesme_kodu`: müdür onunla öğretmen ekler, yönetici onunla müdür yapar; tek kullanımlık). Servisçi, yönetici
ve okul rolü satırlarında kod yoktur. Karışan karakterler (I, L, O, l, o, 0, 1) üretilmez; "her sınıftan en az bir karakter"
koşulu uygulamada denetlenir. Aynı dosyada müdür başvurusu kalktı: okulu yönetici açar ve kişiyi kişi koduyla müdür yapar;
öğretmeni ya da öğrencisi olan bekleyen okul (müdürü kaldırılmış) kalır, yönetici "Okul aç" ile ona yeni müdür atar.
Boşaltılan kodların yerine sunucu açılışta yenilerini üretir (`depo.kullanicilar.eksikKodlariDoldur`, [../index.md](../index.md)
`baslat`).

**Kullanan depo dosyaları:** [../depo/kullanicilar.md](../depo/kullanicilar.md), [../depo/okullar.md](../depo/okullar.md).

**Bugün:** 15 karakterlik desen `032`'de 16 karaktere çıktı (bu dosyanın kodları da boşaltıldı). Müdür atama yolu
kullanıcının 29 Eylül düzeltmesiyle yeniden ele alınacak (aşağıda "Son durum").

### 028-servis-yoklama.sql

**Depoya girdiği commit:** `24050a2 commit 518` (2026-09-27).

**Ne ekler / değiştirir:**

- `okullar`'a servis saatleri: `servis_sabah_bas` (`'07:00'`), `servis_sabah_bit` (`'09:20'`), `servis_aksam_bas`
  (`'16:30'`), `servis_aksam_bit` (`'19:00'`) — `text`, `SS:DD`. `okullar_servis_saat_bicimi` (00:00–23:59) ve
  `okullar_servis_saat_sirasi` (sabah başı < sabah sonu ≤ akşam başı < akşam sonu).
- `servis_ogrencileri.sira_sabah`, `sira_aksam` (≥ 1): alma ve bırakma sırası. Var olan öğrencilere servis içinde ad
  sırasıyla numara verilir.
- `servis_yoklamalari`: `(tarih, donem, ogrenci_id)` birincil anahtar; `servis_id` (servis silinince gider); `donem`
  `sabah`/`aksam`; `durum` sabahta `bindi`/`binmedi`, akşamda `geldi`/`gelmedi`/`indi`; `bindi_zaman`, `indi_zaman`,
  `alan_id`, `guncelleme`; `servis_yoklamalari_servis` (servis + gün + dönem).
- `servis_gunleri`: `(servis_id, tarih, donem)`; `basladi` (sabah ilk "Bindi" ya da "Seferi başlat"; akşam "Başlat"),
  `bitti` (sabah "Okula vardık"; akşam son öğrenci indi).
- `servis_olaylari`: `(tarih, donem, ogrenci_id, olay)`; `olay` `bindi`, `binmedi`, `vardi`, `geldi`, `gelmedi`, `indi`,
  `duzeltme`; `gonderilme` — veliye giden yoklama bildirimi bir kez gitsin.
- `servis_notlari`: servisçinin tarihli notu: `id`, `servis_id`, `ogrenci_id` (boşsa bütün servise), `tarih`, `metin`
  1–200, `yazan_id`, `olusturma`; `servis_notlari_servis` (servis + gün), `servis_notlari_ogrenci`.
- `servis_binmeyecek`: velinin "binmeyecek" işareti, `(ogrenci_id, tarih)`; `sabah`/`aksam` (en az biri), `aciklama`
  (≤ 200), `yazan_id`, `guncelleme`.
- `cihaz_anahtarlari`: telefon uygulamasının cihaz anahtarı: `id`, `kullanici_id` (silinince gider), `anahtar_ozeti` (tek,
  64 karakter), `ad`, `platform`, `surum`, `olusturma`, `son_gorulme`, `son_bildirim` (son verilen imleç, ≤ 200); kişiye göre
  `cihaz_anahtarlari_kullanici`.
- `oturumlar.uygulama` (varsayılan `false`).

**Neden:** Servisçi yoklamayı ve seferi yalnız okulun servis saatlerinde açar; veli canlı bilgiyi (aracın yeri, bugünkü
durum, sıra) yalnız bu aralıkta ya da açık sefer sürerken görür ("en az 30 dakika" kuralı uygulamada:
[../../yardimci/servis-pencere.md](../../yardimci/servis-pencere.md)). Yoklama, olaylar, notlar ve işaretler 30 gün sonra
silinir. Cihaz anahtarı: telefon uygulaması girişten sonra bir kez alır; yalnız bildirim yoklamaya ve servisçinin sefer
konumunu göndermeye yarar, hesaba giriş vermez; yalnız özeti saklanır; anahtar yetişkinin ana hesabına (ya da öğrenci /
servisçi hesabına) aittir. Uygulamadan açılan oturum 30 gün, tarayıcıdaki 7 gün geçerlidir.

**Kullanan depo dosyaları:** [../depo/servis-yoklama.md](../depo/servis-yoklama.md) (beş yoklama tablosu; 30 gün temizliği),
[../depo/okul-hayati.md](../depo/okul-hayati.md) (sıra), [../depo/okullar.md](../depo/okullar.md) (servis saatleri),
[../depo/cihazlar.md](../depo/cihazlar.md) (cihaz anahtarları), [../depo/oturumlar.md](../depo/oturumlar.md) (7/30 gün).
Uçlar: [../../bolumler/cihaz.md](../../bolumler/cihaz.md), [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md).

**Bugün:** Geçerli. `servisler` tablosunun `007`'den kalan `sabah`/`aksam` sütunları (servisin kendi saat bilgisi) hâlâ
okunup yazılıyor; okulun servis penceresi bu yeni dört sütundur, ikisi ayrı şeylerdir.

### 029-quiz.sql

**Depoya girdiği commit:** `3b8fd36 commit 519` (2026-09-27).

**Ne ekler:** Beş tablo (ödev ya da quiz silinince hepsi gider):

- `quizler`: `odev_id` birincil anahtar (ödev başına tek quiz); `sure_turu` (`yok`/`soru`/`quiz`), `toplam_sn` (60–10800,
  yalnız `quiz` türünde ve orada zorunlu), `cikinca_kapanir`, `sonuc_gorunum` (`teslim`/`hemen`), `sonuc_acildi`,
  `olusturma`, `guncelleme`.
- `quiz_sorulari`: `id`, `odev_id` (quize bağlı), `sira` (1–100), `tur` (`dy` Doğru/Yanlış, `coktan`, `acik`), `metin`
  (1–1000), `sure_sn` (10–600); `UNIQUE (odev_id, sira)` ve bileşik anahtar için `UNIQUE (odev_id, id)`.
- `quiz_secenekleri`: `id`, `soru_id` (soru silinince gider), `sira` (1–10), `metin` (1–300), `dogru`;
  `UNIQUE (soru_id, sira)`.
- `quiz_denemeleri`: `(odev_id, ogrenci_id)` birincil anahtar = TEK deneme; ödevin öğrenci listesine bileşik yabancı
  anahtar; `baslama`, `bitis` + `bitis_nedeni` (`ogrenci`, `sure`, `teslim`, `sonuclandi`, `cikis`; ikisi birlikte dolu ya
  da boş), `soru_sira` (1–101), `soru_baslama`, `cikis_sayisi`, `cikis_sn`, `dogru`, `puanli`, `sonuc_bildirildi`;
  `quiz_denemeleri_ogrenci` ve açık denemeler için `quiz_denemeleri_acik`.
- `quiz_cevaplari`: `(odev_id, ogrenci_id, soru_id)`; `secilenler` (`text[]`, en çok 10 şık kimliği), `metin` (≤ 2000,
  açık uçlu), `kayit`, `acilis`, `kapanis`, `kapandi` (`sure`/`cikis`/`gecildi`). Üç yabancı anahtar: ödevin öğrenci
  listesine, o öğrencinin denemesine ve aynı ödevin sorusuna.

**Neden:** Öğretmen ödeve bir quiz ekler, öğrenci ödevi açıp çözer. Tek deneme kuralı ve "ödevde olmayan öğrencinin denemesi
ya da cevabı yazılamaz" kuralı veritabanında durur. Açık uçlu sorular puanlanmaz, öğretmen okur. Sekme/uygulama değiştirme
sayılır (`cikis_*`). Doğru şıklar yalnız bu tablolarda durur, ödev nesnesine hiç girmez.

**Kullanan depo dosyası:** [../depo/quiz.md](../depo/quiz.md). Uçlar ve süre: [../../bolumler/quiz.md](../../bolumler/quiz.md),
saf hesaplar [../../yardimci/quiz.md](../../yardimci/quiz.md).

**Bugün:** Geçerli.

### 030-yonetim-paneli.sql

**Depoya girdiği commit:** `276c0a0 commit 521` (2026-09-27).

**Ne ekler:**

- `site_ayarlari`: `anahtar` (birincil anahtar, `^[a-zA-Z][a-zA-Z0-9]{1,39}$`), `deger` (`jsonb`), `guncelleyen_id`
  (bilerek yabancı anahtarsız), `guncelleyen_ad`, `guncelleme`.
- `yonetim_cerezleri`: `ozet` (64 onaltılık hane; çerezin SHA-256 özeti), `oturum_ozeti` (`oturumlar`'a bağlı, oturum
  silinince gider), `olusturma` (`clock_timestamp()` varsayılanı: aynı işlemde yazılan iki çerez bile farklı an alır);
  `yonetim_cerezleri_oturum` (oturum + zaman, yeniden eskiye).

**Neden:** Gizli yönetim paneli (`/admin`). Site ayarları (iletişim, yapımcılar, Play Store bağlantısı, bildirim yoklama
aralığı, çevrimiçi sayma süresi, yönetici dosyası okuma aralığı…) panelden değişir; öncelik: bu tablo > `data/config.yml` >
kodun varsayılanı; doğrulama sunucudadır. Güncelleyene yabancı anahtar yok, çünkü geri yüklemede `kullanicilar`
`TRUNCATE … CASCADE` ile boşalır ve site ayarları silinmemeli; adı ayrıca yazılır. Site ayarları yedeğe girmez. Yönetim
çerezi yönetici oturumuna bağlıdır; oturum kapanınca (çıkış, süre dolumu, şifre değişimi, hesap silinmesi) çerez de gider;
her girişte ve `/api/me`'de yenilenir.

**Kullanan depo dosyaları:** [../depo/site-ayarlari.md](../depo/site-ayarlari.md) (ayarlar [../../site.md](../../site.md)),
[../depo/oturumlar.md](../depo/oturumlar.md) (bir oturumun en yeni `YONETIM_CEREZ_SAKLA` = 3 çerezi geçerli kalır; çerez
düzeni [../../yonetim-cerezi.md](../../yonetim-cerezi.md)).

**Bugün:** Geçerli.

### 031-cakismalar.sql

**Depoya girdiği commit:** `276c0a0 commit 521` (2026-09-27).

**Ne ekler:**

- `kullanicilar_tc_ogrenci` yoksa (`pg_indexes`) ve çift T.C.'li öğrenci yoksa kurulur; çift varsa `RAISE NOTICE`.
- `kullanicilar_yonetici_adi`: `kullanicilar (kullanici_adi) WHERE rol = 'admin'` (tetikleyicinin araması hızlı olsun).
- `kullanicilar_yonetici_adi_denetle()` işlevi ve `kullanicilar_yonetici_adi` tetikleyicisi (`BEFORE INSERT OR UPDATE OF
  kullanici_adi, rol`, satır başına): ad boşsa ya da güncellemede ad ve rol değişmediyse geçer. Yönetici yazılırken tablo
  `SHARE ROW EXCLUSIVE` kipinde kilitlenir (o sırada hesap yazan öteki işlemler bitene kadar beklenir) ve ad BÜTÜN hesaplarda
  aranır; okul hesabı (müdür, öğretmen, öğrenci, servisçi) yazılırken yalnız aynı adlı yönetici aranır. Çakışmada hata
  `unique_violation` (23505) ve kısıt adı `kullanicilar_kadi_yonetici` ile döner (böyle bir kısıt yok; ad yalnız iletiyi
  seçmek için verilir).
- Var olan çakışmalar değiştirilmez; sayısı `RAISE NOTICE` ile yazılır.

**Neden:** Kurallar ve onları koruyan yerler dosyanın başında tek listede: e-posta bütün sistemde tek (`001`), kullanıcı adı
okul hesaplarında okul içinde, yetişkinlerde kendi aralarında tek (`009`), T.C. okulda ve yetişkinlerde tek (`009`),
öğrencide bütün sistemde tek (`021`). YENİ kural: yöneticinin kullanıcı adı hiçbir hesapla (hiçbir okulunkiyle de) aynı
olamaz. Bu iki ad alanını aşan bir kural olduğu için tekil indeksle değil tetikleyiciyle korunur. Aynı anda gelen iki
istek tekil indekse takılırsa sunucu bunu alanıyla birlikte açık bir iletiye çevirir. Yönetici çok seyrek açıldığı için
(yönetici dosyası, ilk kurulum) kilit beklemesi kısadır.

**Kullanan depo dosyaları:** [../depo/kullanicilar.md](../depo/kullanicilar.md) (`cakismaRaporu`, `kullaniciAdiHerhangiYerde`);
iletiler [../baglanti.md](../baglanti.md) `CAKISMALAR`; açılış uyarıları [../index.md](../index.md) `cakismaRaporu`.

**Bugün:** Geçerli. Bilinen açık için "Dikkat!"e bak (T.C. indeksi kurulamadıysa bir daha denenmez).

### 032-kisi-kodu-16.sql

**Depoya girdiği commit:** `153d63d commit 522` (2026-09-27).

**Ne değiştirir:** `027`'nin adlı iki kısıtı (`kullanicilar_eslesme_kodu_bicimi`, `kullanicilar_veli_kodu_bicimi`)
`IF EXISTS` ile bırakılır; yeni desene (`^[A-Za-z][A-Za-z0-9!?#*+=]{15}$`, 16 karakter) uymayan kodlar `''` yapılır; iki
kısıt aynı adla yeni desenle geri gelir. Tekil indeksler boş kodu saymadığı için aynen kalır.

**Neden:** Kişi kodu 16 karakter olsun ve ekranda, kâğıtta, Excel'de tireyle 4'erli dört grup hâlinde görünsün (örnek
biçim: `Ab3#-kQx9-+mPt-7?zR`). Tire ayırıcıdır, kodun karakteri değildir: alfabeden çıktı, yerine `=` girdi. İlk karakter
harf; büyük/küçük harf duyarlı. Boşaltılan kodların yerine sunucu açılışta yenilerini üretir. Veli bağları ve okul rolü
satırları koda bağlı değildir, etkilenmez.

**Kullanan depo dosyası:** [../depo/kullanicilar.md](../depo/kullanicilar.md). Daha sıkı uygulama deseni (`KISI_KODU_DESENI`:
her sınıftan en az bir karakter; I, L, O, l, o, 0, 1 yok) [../../ortak.md](../../ortak.md)'de.

**Bugün:** Geçerli.

### 033-odev-dosya-izni.sql

**Depoya girdiği commit:** `566b917 commit 524` (2026-09-27).

**Ne ekler:**

- `odevler.dosya_yukleme`: önce `DEFAULT true` ile eklenir (var olan ödevlerin hepsi `true` olur), sonra varsayılan
  `false` yapılır (yeni ödevde kapalı).
- `okul_dosya_uyarilari`: okul başına tek satır (`okul_id`, okul silinince gider), `seviye` (80 ya da 100), `zaman`.

**Neden:** Öğretmen ödevi verirken "Öğrenciler bu ödeve dosya yükleyebilsin" kutusunu işaretler; kapalıysa öğrenci teslim
dosyası yükleyemez, önceden yüklenmiş dosyalar silinmez; quiz bundan bağımsızdır. Bu dosyadan önce verilmiş ödevlerin
davranışı değişmesin diye onlarda izin açık kalır. Teslim dosyasının silinme zamanı yüklemeye değil ödeve bağlıdır ve her
seferinde ödevden hesaplanır (ayrı sütun yok; `SILINME`). `okul_dosya_uyarilari`: okulun teslim dosyası alanı %80'i geçince
ve dolunca müdüre ve yöneticiye birer kez bildirim gitsin; kullanım %70'in altına inince satır silinir. Yedeğe girmez.

**Kullanan depo dosyaları:** [../depo/odevler.md](../depo/odevler.md), [../depo/odev-dosyalari.md](../depo/odev-dosyalari.md)
(`SILINME`), [../depo/okul-disk.md](../depo/okul-disk.md) (uyarılar). Uçlar: [../../bolumler/okul-disk.md](../../bolumler/okul-disk.md).

**Bugün:** Yorumdaki `EE_OKUL_DOSYA_GB` genel alanı `035`'ten beri okulun kendi sınırına dönüştü; %80 ve "doldu" artık o
sınıra göre ve bütün dosyalar sayılarak hesaplanır.

### 034-odev-dosya-saklama.sql

**Depoya girdiği commit:** `566b917 commit 524` (2026-09-27).

**Ne ekler:** `odevler.dosya_saklama` (`timestamptz`, boş olabilir): bu ödevin teslim dosyaları bu andan önce silinmez.

**Neden:** Silinme anı ödevden hesaplanır (son teslim + 7 gün; son teslimsiz ödevde sonuçlanma + 7 gün ya da yüklemeden 60
gün). Öğretmen son teslimi yanlışlıkla geçmişe yazarsa (yılı 2025 gibi) bu an da geçmişte kalır ve saatlik temizlik
bütün öğrencilerin dosyalarını uyarısız, geri dönüşsüz silerdi. Son teslim değiştirilince, kaldırılınca ya da ödev yeniden
açılınca `dosya_saklama` "şimdi + 7 gün"e çekilir (daha ilerideyse değişmez); silinme anı iki andan geç olanıdır
(`GREATEST(hesap, dosya_saklama)`, boşsa yalnız hesap).

**Kullanan depo dosyaları:** [../depo/odevler.md](../depo/odevler.md) (yazar), [../depo/odev-dosyalari.md](../depo/odev-dosyalari.md)
(`SILINME` okur).

**Bugün:** Geçerli.

### 035-okul-disk-siniri.sql

**Depoya girdiği commit:** `40fc7e7 commit 525` (2026-09-27).

**Ne ekler:** `okullar.disk_siniri_mb` (`integer`, boş olabilir, 1–10485760 = en çok 10 TB) ve `ekler_okul` indeksi
(`ekler (okul_id) WHERE NOT silindi AND okul_id IS NOT NULL`).

**Neden:** Her okulun dosyaları (ödev teslim dosyaları, ödev ve mesaj ekleri, okul sayfası fotoğrafları) bir diskin
bölümleri gibi kendi sınırına sayılsın. Sınırı yönetici okulu açarken verir (öneri: öğrenci sayısı × 10 MB, en az 2 GB) ve
Okullar ekranında değiştirir. Boşsa site ayarındaki varsayılan geçerlidir (`okulDiskMb`; o da yoksa `EE_OKUL_DOSYA_GB` ya
da 5 GB: [../../site.md](../../site.md)). Sınır küçültülürse var olan dosya silinmez, yalnız yeni yükleme durur. Kullanım
dosya kayıtlarından toplanır (dizin gezilmez): `odev_dosyalari`, silinmemiş `ekler` ve `okul_fotolari`; eklerde okula göre
toplamak için indeks.

**Kullanan depo dosyaları:** [../depo/okul-disk.md](../depo/okul-disk.md), [../depo/okullar.md](../depo/okullar.md). Uçlar:
[../../bolumler/okul-disk.md](../../bolumler/okul-disk.md), [../../bolumler/yonetici-okul.md](../../bolumler/yonetici-okul.md).

**Bugün:** Geçerli; son şema dosyası.

### Tablo dizini

Bugün veritabanında 75 uygulama tablosu ve düzeneğin kendi `sema_surumleri` tablosu var (`okul_davetleri` `004`'te kurulup
`009`'da kaldırıldı). "Değiştirenler" sütununda yapıyı (sütun, kısıt, indeks) ya da eski veriyi değiştiren dosyalar var.
"Yedek" sütunu [../json-aktarim.md](../json-aktarim.md)'ye göre: **girer** = yedekte var; **geçici** = `TABLOLAR`'da ama
yedeğe girmez, geri yüklemede boşalır; **boşalır** = `TABLOLAR`'da değil ama yedekteki bir tabloya bağlı olduğu için geri
yüklemede `CASCADE` ile boşalır; **korunur** = yedekte yok, geri yüklemede okunup geri yazılır; **dokunulmaz** = hiçbir
tabloya bağlı değil.

| Tablo | Kuran | Değiştirenler | Kullanan depo | Yedek |
|---|---|---|---|---|
| `okullar` | `001` | `009` (`kisa_ad`), `010` (konum), `027` (bekleyenler reddedildi), `028` (servis saatleri), `035` (`disk_siniri_mb`) | [okullar](../depo/okullar.md); ayrıca [okul-hayati](../depo/okul-hayati.md), [okul-disk](../depo/okul-disk.md), [kullanicilar](../depo/kullanicilar.md), [genel](../depo/genel.md), [push](../depo/push.md), [cihazlar](../depo/cihazlar.md) | girer |
| `egitim_yillari` | `001` | — | [okullar](../depo/okullar.md) | girer |
| `siniflar` | `001` | — | [siniflar](../depo/siniflar.md); ayrıca [kullanicilar](../depo/kullanicilar.md), [mesajlar](../depo/mesajlar.md), [anketler](../depo/anketler.md), [etutler](../depo/etutler.md), [okul-hayati](../depo/okul-hayati.md) | girer |
| `roller` | `001` | `013` (`tur`) | [roller](../depo/roller.md) | girer |
| `rol_yetkileri` | `001` | `023` (veri) | [roller](../depo/roller.md) | girer |
| `rol_yetki_kapsamlari` | `001` | — | [roller](../depo/roller.md) | girer |
| `kullanicilar` | `001` | `003`, `005`, `009`, `012`, `014`, `015`, `021`, `027`, `031`, `032` | [kullanicilar](../depo/kullanicilar.md); ayrıca hemen bütün depo dosyaları okur | girer |
| `mesaj_engelleri` | `001` | — | [kullanicilar](../depo/kullanicilar.md) | girer |
| `veli_baglari` | `001` | — | [kullanicilar](../depo/kullanicilar.md); ayrıca [genel](../depo/genel.md), [anketler](../depo/anketler.md) | girer |
| `dersler` | `001` | — | [siniflar](../depo/siniflar.md); ayrıca [odevler](../depo/odevler.md), [devamsizlik](../depo/devamsizlik.md), [kullanicilar](../depo/kullanicilar.md) | girer |
| `ders_programi` | `001` | — | [siniflar](../depo/siniflar.md) | girer |
| `odevler` | `001` | `002` (indeks), `025`, `033`, `034` | [odevler](../depo/odevler.md); ayrıca [odev-dosyalari](../depo/odev-dosyalari.md), [okul-disk](../depo/okul-disk.md), [quiz](../depo/quiz.md) | girer |
| `odev_siniflari` | `001` | `002` (indeks) | [odevler](../depo/odevler.md) | girer |
| `odev_ogrencileri` | `001` | `017` (`yildiz`) | [odevler](../depo/odevler.md); ayrıca [odev-dosyalari](../depo/odev-dosyalari.md) | girer |
| `sinav_sablonlari` | `001` | — | [sinavlar](../depo/sinavlar.md) | girer |
| `sablon_olcumleri` | `001` | — | [sinavlar](../depo/sinavlar.md) | girer |
| `sinav_gruplari` | `001` | — | [sinavlar](../depo/sinavlar.md) | girer |
| `sinavlar` | `001` | — | [sinavlar](../depo/sinavlar.md) | girer |
| `sinav_olcumleri` | `001` | — | [sinavlar](../depo/sinavlar.md) | girer |
| `sinav_degerleri` | `001` | — | [sinavlar](../depo/sinavlar.md) | girer |
| `devamsizlik` | `001` | — | [devamsizlik](../depo/devamsizlik.md) | girer |
| `mesajlar` | `001` | `013` (`duzenlenme`) | [mesajlar](../depo/mesajlar.md) | girer |
| `mesaj_alicilari` | `001` | — | [mesajlar](../depo/mesajlar.md) | girer |
| `mesaj_okumalari` | `001` | — | [mesajlar](../depo/mesajlar.md) | girer |
| `takvim_etkinlikleri` | `001` | — | [genel](../depo/genel.md) | girer |
| `bildirimler` | `001` | — | [genel](../depo/genel.md); ayrıca [cihazlar](../depo/cihazlar.md) | girer |
| `oturumlar` | `001` | `028` (`uygulama`) | [oturumlar](../depo/oturumlar.md); ayrıca [kullanicilar](../depo/kullanicilar.md) | girer |
| `hatirlatmalar` | `001` | `002` (indeks) | [genel](../depo/genel.md) | girer |
| `islem_kaydi` | `001` | — | [genel](../depo/genel.md) | girer |
| `anketler` | `006` | — | [anketler](../depo/anketler.md) | girer |
| `anket_secenekleri` | `006` | — | [anketler](../depo/anketler.md) | girer |
| `anket_hedefleri` | `006` | — | [anketler](../depo/anketler.md) | girer |
| `anket_oylari` | `006` | — | [anketler](../depo/anketler.md) | girer |
| `yemek_listesi` | `007` | — | [okul-hayati](../depo/okul-hayati.md) | girer |
| `servisler` | `007` | `010` (`sofor_id`), `015` (telefon verisi) | [okul-hayati](../depo/okul-hayati.md); ayrıca [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `servis_ogrencileri` | `007` | `028` (sıra) | [okul-hayati](../depo/okul-hayati.md); ayrıca [servis-yoklama](../depo/servis-yoklama.md), [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `kulupler` | `007` | — | [okul-hayati](../depo/okul-hayati.md); ayrıca [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `kulup_uyeleri` | `007` | — | [okul-hayati](../depo/okul-hayati.md); ayrıca [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `odev_dosyalari` | `008` | — | [odev-dosyalari](../depo/odev-dosyalari.md); ayrıca [okul-disk](../depo/okul-disk.md) | girer (yalnız bilgisi; dosya diskte) |
| `ogrenci_konumlari` | `010` | — | [okul-hayati](../depo/okul-hayati.md); ayrıca [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `servis_seferleri` | `010` | — | [okul-hayati](../depo/okul-hayati.md) | boşalır |
| `sefer_bildirimleri` | `010` | — | [okul-hayati](../depo/okul-hayati.md) | boşalır |
| `push_abonelikleri` | `011` | — | [push](../depo/push.md) | korunur |
| `etutler` | `013` | — | [etutler](../depo/etutler.md); ayrıca [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `etut_ogrencileri` | `013` | — | [etutler](../depo/etutler.md); ayrıca [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `etut_yoklamalari` | `013` | — | [etutler](../depo/etutler.md) | girer |
| `eposta_onaylari` | `016` | — | [onaylar](../depo/onaylar.md) | boşalır |
| `okul_sayfalari` | `018` | — | [okul-sayfalari](../depo/okul-sayfalari.md) | girer |
| `okul_fotolari` | `018` | — | [okul-sayfalari](../depo/okul-sayfalari.md); ayrıca [okul-disk](../depo/okul-disk.md) | girer (yalnız bilgisi) |
| `yorumlar` | `019` | — | [yorumlar](../depo/yorumlar.md) | girer |
| `ekler` | `020` | `035` (indeks) | [ekler](../depo/ekler.md); ayrıca [okul-disk](../depo/okul-disk.md) | boşalır |
| `ogrenci_gecmisi` | `021` | — | [ogrenci-gecmisi](../depo/ogrenci-gecmisi.md) | girer |
| `okul_kapali_ozellikler` | `022` | — | [ozellikler](../depo/ozellikler.md) | girer |
| `hatirlaticilar` | `024` | — | [hatirlaticilar](../depo/hatirlaticilar.md) | girer |
| `hatirlatici_gunleri` | `024` | — | [hatirlaticilar](../depo/hatirlaticilar.md) | girer |
| `aile_cihazlari` | `026` | — | [aile](../depo/aile.md) | geçici |
| `aile_konumlari` | `026` | — | [aile](../depo/aile.md) | geçici |
| `aile_kullanim` | `026` | — | [aile](../depo/aile.md) | geçici |
| `aile_ayarlari` | `026` | — | [aile](../depo/aile.md) | geçici |
| `aile_sinirlari` | `026` | — | [aile](../depo/aile.md) | geçici |
| `aile_uyarilari` | `026` | — | [aile](../depo/aile.md) | geçici |
| `servis_yoklamalari` | `028` | — | [servis-yoklama](../depo/servis-yoklama.md) | geçici |
| `servis_gunleri` | `028` | — | [servis-yoklama](../depo/servis-yoklama.md) | geçici |
| `servis_olaylari` | `028` | — | [servis-yoklama](../depo/servis-yoklama.md) | geçici |
| `servis_notlari` | `028` | — | [servis-yoklama](../depo/servis-yoklama.md) | geçici |
| `servis_binmeyecek` | `028` | — | [servis-yoklama](../depo/servis-yoklama.md) | geçici |
| `cihaz_anahtarlari` | `028` | — | [cihazlar](../depo/cihazlar.md); ayrıca [oturumlar](../depo/oturumlar.md), [kullanicilar](../depo/kullanicilar.md) | korunur |
| `quizler` | `029` | — | [quiz](../depo/quiz.md) | girer |
| `quiz_sorulari` | `029` | — | [quiz](../depo/quiz.md) | girer |
| `quiz_secenekleri` | `029` | — | [quiz](../depo/quiz.md) | girer |
| `quiz_denemeleri` | `029` | — | [quiz](../depo/quiz.md) | girer |
| `quiz_cevaplari` | `029` | — | [quiz](../depo/quiz.md) | girer |
| `site_ayarlari` | `030` | — | [site-ayarlari](../depo/site-ayarlari.md) | dokunulmaz (yedeğe de girmez) |
| `yonetim_cerezleri` | `030` | — | [oturumlar](../depo/oturumlar.md) | korunur (oturumu yedekte varsa) |
| `okul_dosya_uyarilari` | `033` | — | [okul-disk](../depo/okul-disk.md) | boşalır (bilerek) |
| `okul_davetleri` | `004` | `009` (kaldırıldı) | — | — |
| `sema_surumleri` | [../sema.md](../sema.md) (`semayiGuncelle`) | — | — | dokunulmaz |

"Kullanan depo" sütunu tablonun adının SQL içinde (`FROM`, `JOIN`, `INTO`, `UPDATE`) geçtiği depo dosyalarından çıkarıldı;
bunun dışında [../json-aktarim.md](../json-aktarim.md) yedekteki bütün tabloları, [../index.md](../index.md) açılışta
`kullanicilar`'ı sayar. Kural gereği SQL yalnız `sunucu/veri/` altında yazılır (`testler/sql-denetimi.js` denetler).
`cihaz_anahtarlari` `TABLOLAR`'da da durur (geri yüklemede boşalır), ama önce okunup sahibi hâlâ varsa geri yazıldığı için
"korunur" yazıldı.

## Kimle konuşur?

Bu klasördeki dosyaları doğrudan okuyan tek kod [../sema.md](../sema.md)'dir; öteki dosyalar şemanın adlarına (tablo, sütun,
kısıt, indeks) dayanır:

- **[../sema.md](../sema.md)** (`semayiGuncelle`, `testIcinSifirla`): klasördeki `^\d{3}-[a-z0-9-]+\.sql$` adlarını ad
  sırasıyla okur, uygulanmamış olanları çalıştırır, `sema_surumleri` tablosunu kurar ve doldurur.
- **[../index.md](../index.md)** (`baslat`): her açılışta önce `semayiGuncelle()`'yi çağırır; sonra `027` ve `032`'nin
  boşalttığı kodları `depo.kullanicilar.eksikKodlariDoldur` ile yeniden üretir, en sonda `021`/`031`'in kuramadığı indeks ve
  yöneticiyle aynı ad gibi çakışmaları `cakismaRaporu` ile pencereye yazar.
- **[../baglanti.md](../baglanti.md)**: şema dosyası `metinCalistir` ile tek parça çalışır, `islem` ile bir işleme sarılır;
  her bağlantıda `statement_timeout=15000` vardır. `CAKISMALAR` tekil indeks adlarını (`kullanicilar_eposta_key`,
  `kullanicilar_kadi_okul`, `kullanicilar_kadi_genel`, `kullanicilar_kadi_yonetici`, `kullanicilar_tc_okul`,
  `kullanicilar_tc_genel`, `kullanicilar_tc_ogrenci`, `kullanicilar_okul_no`, `kullanicilar_ana_okul`, `okullar_kisa_ad`,
  `okullar_meb_kodu_tekil`) alanıyla birlikte kullanıcıya giden iletiye çevirir: bir indeksin adı değişirse ya da listede
  yoksa ileti alansız genel "Bu kayıt zaten var"a düşer (`HATA_KODLARI`).
- **[../json-aktarim.md](../json-aktarim.md)**: `TABLOLAR` listesi (yedekteki ve geri yüklemede boşaltılan tablolar) ve
  `iceAktar`'daki `TRUNCATE … RESTART IDENTITY CASCADE`; `push_abonelikleri`, `cihaz_anahtarlari`, `yonetim_cerezleri` önce
  okunup sonra geri yazılır. Yeni bir tablo buraya ya eklenir ya da bilerek dışarıda bırakılır (Kurallar 10).
- **`sunucu/veri/depo/*.js`**: SQL'in yazıldığı tek yer; hangi tabloyu hangisinin kullandığı Tablo dizininde.
  [../esleme.md](../esleme.md) satır ↔ nesne çevirisini yapar (sütun adı değişirse orası da değişir),
  [../yazici.md](../yazici.md) tablo ve sütun adlarını doğrulayan ortak ekleme/güncelleme yardımcısıdır.
- **Testler:** her test paketi şemayı sıfırdan kurar (aşağıda "Testleri"); `testler/test-gizli-dosyalar.js` `001-ilk.sql`'in
  depoda izlendiğini denetler.
- **PostgreSQL 17** (en az 15: `001`'deki `UNIQUE NULLS NOT DISTINCT`).

## Nasıl çalışır (adım adım)?

### Şema açılışta nasıl uygulanır

Düzeneğin tamamı [../sema.md](../sema.md)'de; kısaca:

1. Sunucu her açılışta ([../index.md](../index.md) `baslat`) `semayiGuncelle()`'yi çağırır. Testte (`EE_DB_SIFIRLA=1` ve adı
   `_test` ile biten veritabanı) ondan önce `testIcinSifirla()` `public` şemasını silip boş kurar; yani her test paketi
   35 dosyayı `001`'den yeniden uygular.
2. `semayiGuncelle()` önce `sema_surumleri` (`surum integer PRIMARY KEY`, `dosya`, `uygulanma`) tablosunu yoksa kurar ve
   uygulanmış numaraları bir kez okur.
3. Bu klasörde adı `^\d{3}-[a-z0-9-]+\.sql$` kalıbına uyan dosyaları ad sırasıyla dolaşır; numarası uygulanmışlarda olan
   dosyayı atlar.
4. Kalan her dosya **kendi işleminde** (transaction) çalışır: önce dosyanın tamamı ([../baglanti.md](../baglanti.md)
   `metinCalistir`), sonra `sema_surumleri`'ne `(numara, dosya adı)` satırı. Pencereye "Şema uygulandı: 035-okul-disk-siniri.sql"
   gibi bir satır düşer.
5. Bir dosya hata verirse yalnız o dosyanın işlemi geri alınır, hata yukarı çıkar ve sunucu açılmaz; düzeltip yeniden
   açınca kalan yerden devam eder.

Bu belge (`SEMA.md`) kalıba uymadığı için düzenek onu görmez; klasörde durması güvenlidir. Her bağlantıda
`statement_timeout=15000` vardır: şema dosyasındaki tek bir komut 15 saniyeyi geçerse kesilir ve sunucu açılmaz
([../sema.md](../sema.md) "Dikkat!").

### Yeni bir şema dosyası yazarken (kurallar)

1. **Uygulanmış dosya DEĞİŞMEZ.** Canlı sunucu dosyayı bir kez uyguladı; sonradan değiştirirsen o sunucuda hiçbir şey olmaz
   (numara "uygulanmış" görünür), yalnız sıfırdan kurulan veritabanlarında yeni hâli çalışır ve iki yapı sessizce ayrışır.
   Bir kuralı değiştirmek gerekince yeni dosya yazılır: `009` `003`'ün kullanıcı adı kısıtını, `027` `012`'nin kod kısıtını,
   `032` de `027`'ninkini böyle değiştirdi.
2. **Yeni iş, yeni numara.** Sıradaki numara `036`. Ad küçük harf, rakam ve tire: `036-kisa-ad.sql`. Kalıba uymayan ad
   (`036_yeni.sql`, `36-yeni.sql`, `036-Yeni.sql`) uyarısız yok sayılır. Grup arkadaşın da GitHub'a dosya yüklediği için
   yazmadan hemen önce son numarayı yeniden kontrol et. Aynı numaralı iki dosya (`036-a.sql`, `036-b.sql`) olursa ikisi de
   ilk açılışta çalışmaya kalkar: ikincisinin `sema_surumleri` satırı birincil anahtara takılır, işlemi geri alınır ve
   sunucu açılmaz; sonraki açılışta numara "uygulanmış" göründüğü için ikinci dosya hiç çalışmaz.
3. **Her dosya kendi işleminde çalışır.** Dosyaya `BEGIN`/`COMMIT` yazma; işlem içinde çalışamayan komut
   (`CREATE INDEX CONCURRENTLY`, `VACUUM`) koyma. Bugünkü 35 dosyada böyle bir komut yok.
4. **Veri varken de çalışmalı.** Yeni sütun `ADD COLUMN … DEFAULT …` ile eklenir, eski satırlar `UPDATE` ile doldurulur
   (`005`, `014`, `028`); bir kısıt eklenmeden önce ona uymayan eski değer düzeltilir ya da boşaltılır (`015`, `027`,
   `032`). Eski veride kurala aykırı kayıt varsa sunucu açılmaz hâle gelmemeli: `021` ve `031` tekil indeksi yalnız çift
   yoksa kurar, varsa `RAISE NOTICE` ile geçer ve açılıştaki `cakismaRaporu` pencereye yazar.
5. **Adlandırma** (`001`'in baş yorumu): tablo ve sütun adları Türkçe, küçük harf, alt çizgili, ASCII. Kimlikler
   metindir (`u_6eec2a1a…` gibi), uygulama üretir; eski JSON verisi ve yedekler kimlik değişmeden içeri alınabilsin diye.
   Yalnız iki tabloda sayaçlı kimlik var: `mesaj_alicilari` (`bigint GENERATED ALWAYS AS IDENTITY`) ve `aile_konumlari`
   (`bigserial`).
6. **Silme kuralları uygulamanın davranışıyla aynıdır** (`001`): okullar silinmez; bir kullanıcı silinince KENDİSİNE ait
   kayıtlar silinir (`ON DELETE CASCADE`: bildirim, oturum, veli bağı, ödev sonucu, notu, devamsızlığı); BAŞKALARINI
   ilgilendiren kayıtlarda (verdiği ödev, gönderdiği mesaj) adı boşa düşer (`ON DELETE SET NULL`), kayıt kalır; sınıf
   silinince dersleri ve programı gider, öğrencileri sınıfsız kalır.
7. **CHECK kısıtları ikinci katmandır**: kodda bir doğrulama unutulsa bile veritabanı geçersiz değeri kabul etmez. Asıl
   doğrulama ve kullanıcıya giden ileti koddadır.
8. **Kısıtlara ad ver.** `001`'deki sütun kısıtlarının adını PostgreSQL kendisi verdi (`kullanicilar_telefon_check`,
   `kullanicilar_rol_check` …). Onları değiştirmek için ya bu otomatik ad tahmin edildi (`015`) ya da `pg_constraint`'te
   tanımın metnine bakılarak bulundu (`009`, `027`). Yeni kısıtlara açık ad ver (`kullanicilar_rol_gecerli`,
   `kullanicilar_eslesme_kodu_bicimi` gibi); sonra bırakmak kolay olur.
9. **Kullanıcıya dönen tekil indeks** eklersen adını [../baglanti.md](../baglanti.md)'deki `CAKISMALAR`'a da yaz: aynı anda
   gelen iki isteğin ikincisi 23505 hatasına takılınca sunucu onu alanıyla birlikte açık bir iletiye çevirir.
10. **Yeni tablo yedeğe girecek mi?** Karar ver: girecekse [../json-aktarim.md](../json-aktarim.md)'deki `TABLOLAR`'a (SONA)
    ve `iceAktar`/`disaAktar`'a ekle; girmeyecekse ve yedekteki bir tabloya yabancı anahtarla bağlıysa geri yüklemede
    `TRUNCATE … CASCADE` ile boşalacağını bil ve dosyanın yorumuna yaz (`030`, `033` böyle yaptı).
11. **Dosyanın başına ne yaptığını ve NEDEN yaptığını yorum olarak yaz** (öteki 35 dosya gibi) ve bu belgeye yeni bir
    `### NNN-ad.sql` bölümü ekle; Tablo dizinini de güncelle.
12. **PostgreSQL sürümü**: `001` `UNIQUE NULLS NOT DISTINCT` kullanır (PostgreSQL 15 ve sonrası ister); `003`
    `gen_random_uuid()` kullanır (13 ve sonrası). Proje PostgreSQL 17 ile çalışır.

## Dikkat!

- **Öğrencinin T.C. tekil indeksi (`kullanicilar_tc_ogrenci`) bir kez kurulamadıysa bir daha kendiliğinden kurulmaz.**
  `021` ve `031` indeksi yalnız eski veride aynı T.C.'li iki öğrenci yoksa kurar. İkisi de uygulanmış bir veritabanında
  çiftler sonradan düzeltilse bile hiçbir dosya yeniden çalışmaz. Açılıştaki uyarı ([../index.md](../index.md)
  `cakismaRaporu`) "Çiftleri düzeltip sunucuyu yeniden başlat" der, ama yeniden başlatmak indeksi kurmaz: çift kalmayınca
  uyarı da susar ve indeks sessizce eksik kalır (uygulama kendi denetimini sürdürür, ama aynı anda gelen iki istek
  arasındaki yarışı yalnız indeks keser). Çözüm yeni bir şema dosyası (`031`'deki bloğun aynısı) ya da elle
  `CREATE UNIQUE INDEX`; kod değiştirilmedi. Canlı veritabanında indeksin var olup olmadığına bakılmadı.
- **`okullar.durum = 'pending'` bugün "müdürü yok" demek.** Müdür başvurusu `027`'de kalktı, ama yönetici bir müdürü
  silince okul `'pending'`e çekiliyor ([../../bolumler/yonetici.md](../../bolumler/yonetici.md) `principal-delete`) ki kimse
  giremesin; `001`'in baş yorumu da bunu söyler ("müdür silinince okul beklemede'ye alınır"). Sütunun varsayılanı
  (`'pending'`) ve `001`'deki `okullar` yorumu ("müdür başvurusuyla açılır, yönetici onaylar") ise eski düzenden kalma.
  Kullanıcının 29 Eylül "onay bekleme değil, müdür atayarak" düzeltmesi bu kalıntıları "Müdürü yok / Müdür ata" diliyle
  değiştirmeyi planlıyor; anlam değişirse değer kümesi (`CHECK (durum IN …)`) ve eski satırlar yeni bir şema dosyasıyla
  taşınmalı.
- **`kullanicilar_bekleyen_basvuru` (012) boşta.** Bugün hiçbir uç kullanıcı satırını `'pending'` durumuyla yazmıyor (yalnız
  eski bir yedeğin geri yüklenmesi eski `'pending'` satırları getirebilir); indeks kaldırılmadı, zararı yok ama "bekleyen
  başvuru" diye bir akış olduğunu sanma.
- **Aile verisinin kalıcı kısmı geri yüklemede kaybolur.** `aile_*` tabloların altısı da `TABLOLAR`'da ve yedeğe girmez
  ([../json-aktarim.md](../json-aktarim.md) hepsine "7 günlük geçici veri" der). Ama `aile_cihazlari` (çocuğun telefonunun
  bağı ve anahtarının özeti), `aile_ayarlari` ve `aile_sinirlari` kalıcıdır: bir yedek geri yüklenince bunlar da boşalır,
  çocuğun telefonu yeniden bağlanmalı, veli ayarları ve sınırları yeniden girilmeli. `push_abonelikleri` ve
  `cihaz_anahtarlari` gibi okunup geri yazılmıyorlar.
- **Yorumlar yazıldığı günü anlatır.** Özellikle `001` (okulun açılışı), `012` (10 haneli kod), `020` (150 MB / 7 gün),
  `027` (15 karakterlik kod) ve `009` (adres biçimi) yorumları bugünkü kurallarla aynı değil; her bölümün **Bugün** satırına
  bak. Eski dosyanın yorumunu düzeltmek için bile dosyayı değiştirme.
- **Rolsüz hesap ve `NULL` kuralı.** `001`'deki `CHECK (rol IN ('admin', 'parent') OR okul_id IS NOT NULL)`, `rol` boşken
  (rolsüz yetişkin hesabı, `003`) "bilinmiyor" sonucu verir ve PostgreSQL bunu kabul sayar; rolsüz hesabın okulsuz
  durabilmesi buna dayanır. `kullanicilar_rol_gecerli` (`009`) de `rol IS NULL`'u açıkça kabul eder. Yeni bir kısıt yazarken
  `NULL` rolü unutma.
- **Otomatik adlı kısıtlar kırılgan.** `009` rol kısıtını "tanımında `'student'` geçen ama `okul_id` geçmeyen CHECK" diye,
  `027` kod kısıtını "tanımında `eslesme_kodu` geçen her CHECK" diye bulup bıraktı. O gün başka eşleşen kısıt yoktu. Aynı
  yöntemi bugün kullanırsan istemediğin bir kısıtı da bırakabilirsin; adıyla (`DROP CONSTRAINT IF EXISTS ad`) bırak.
- **`UNIQUE NULLS NOT DISTINCT` (001) PostgreSQL 15+ ister.** Daha eski bir sunucuda `001` hata verir ve sunucu hiç
  açılmaz.
- **Servis saatleri metin olarak karşılaştırılır.** `okullar_servis_saat_sirasi` (`028`) `'07:00' < '09:20'` gibi metin
  karşılaştırmasıdır; `okullar_servis_saat_bicimi` saati hep iki haneli `SS:DD` tuttuğu için doğru çalışır. Biçim kısıtını
  gevşetirsen (ör. `7:00`) sıra kısıtı yanlış sonuç verir.
- **`quiz_cevaplari.secilenler` yabancı anahtar değildir** (`text[]`). Şıkların o soruya ait olduğunu veritabanı değil
  [../../bolumler/quiz.md](../../bolumler/quiz.md) denetler ("Seçilen şık bu soruya ait değil.").
- **`eposta_onaylari` kişisel veri tutar** (T.C. no, adres, telefon, şifre özeti) — ama yalnız onay bağlantısı geçerliyken
  (24 saat); süresi geçenleri [../depo/onaylar.md](../depo/onaylar.md) `suresiGecenleriSil` siler.
- **`RAISE NOTICE` iletileri pencereye düşmez.** `021` ve `031`'in uyarıları PostgreSQL bildirimi olarak gider;
  [../baglanti.md](../baglanti.md) bildirim dinlemediği için görünmez. Aynı durumları açılışta `cakismaRaporu` ayrıca yazar;
  yeni bir dosyada uyarı gerekiyorsa aynı yolu izle (şema dosyasında NOTICE + açılışta rapor).
- **Okul silinemez (bilerek).** `001`'deki tabloların `okullar`'a bağı `ON DELETE` kuralı taşımaz; okulun bir sınıfı, dersi
  ya da kullanıcısı varsa `DELETE FROM okullar` hata verir. Sonraki dosyaların tabloları (`004` ve sonrası) okula
  `ON DELETE CASCADE` ile bağlı. Okul silme hiç planlanırsa bu karışıklık yeni bir şema dosyasıyla çözülmeli.
- **Saklama süresi olmayan tablolar büyür.** `bildirimler`, `mesajlar` ve alıcıları, `quiz_*` için süreli silme yok
  (`islem_kaydi` satır sayısıyla, `hatirlatmalar` 30 günle, `ekler` 7 günle, aile konum/kullanım/uyarı tabloları 7 günle,
  servis yoklaması 30 günle, seferler 30 günle, onaylar 24 saatle sınırlı). Planlı "Optimizasyon + saklama süreleri" işi
  bunu çözecek.

## Testleri

- **Her test paketi şemayı sıfırdan kurar**: `testler/tumtest.sh` sunucuyu `EE_DB_SIFIRLA=1` ile açar; `testIcinSifirla` +
  35 dosyanın 001'den uygulanması her pakette yeniden sınanır. Bir dosya bozuksa sunucu açılmaz, bütün paketler kalır.
- `testler/test-cakisma.js` — veritabanında her tekil indeksin (`kullanicilar_eposta_key`, `kullanicilar_kadi_okul`,
  `kullanicilar_kadi_genel`, `kullanicilar_tc_okul`, `kullanicilar_tc_genel`, `kullanicilar_tc_ogrenci`,
  `kullanicilar_okul_no`, `kullanicilar_ana_okul`, `kullanicilar_yonetici_adi`) ve `kullanicilar_yonetici_adi`
  tetikleyicisinin var olduğunu, tetikleyicinin ekleme ve güncellemede durdurduğunu ve iki yarışta kilidin beklettiğini
  sınar (`031`, `009`, `012`, `021`).
- Tablo gruplarının davranışını koruyan paketler (dosya adıyla): `test-kisi-kodu.js` (`027`, `032`), `test-yetiskin.js`
  (`012`), `test-nakil.js` (`021`), `test-anket.js` (`006`), `test-okul-hayati.js` (`007`), `test-servis-konum.js` (`010`),
  `test-push.js` (`011`), `test-etut.js` (`013`), `test-giris-kayit.js` (`016`), `test-okul-sayfasi.js` (`018`),
  `test-yorum-ek.js` (`019`, `020`), `test-ozellikler.js` (`022`), `test-siniflarim.js` (`023`), `test-hatirlatici.js`
  (`024`), `test-odev-saat.js` (`017` yıldız, `025` başlama saati), `test-aile.js` (`026`), `test-servis-yoklama.js`
  (`028`), `test-quiz.js` (`029`), `test-site-ayarlari.js` ve `test-admin-gizli.js` (`030`), `test-odev-dosya.js` (`008`,
  `033`, `034`), `test-okul-disk.js` (`033`, `035`), `test-yedek.js` (yedeğe giren tablolar; `035`'in `disk_siniri_mb`'si
  dahil).
- `testler/test-gizli-dosyalar.js` — `sunucu/veri/sema/001-ilk.sql`'in depoya girdiğini (gizli dosya kurallarına takılmadığını)
  denetler.
- Elle: yeni bir şema dosyası ekleyip sunucuyu aç → pencerede "Şema uygulandı: …" görülür, ikinci açılışta görülmez;
  `psql` ile `\d tablo` yapıyı, `SELECT * FROM sema_surumleri ORDER BY surum` uygulanan dosyaları gösterir.

## Son durum

- Belge ilk kez yazıldı (belgeleme 3. parça) ve aynı parçada SQL dosyalarına karşı ayrıca denetlendi: her `CREATE TABLE`,
  `ALTER TABLE`, sütun, adlı kısıt ve indeks bu belgede adıyla geçiyor. 35 dosyanın hiçbiri depoya girdikten sonra
  değişmedi; son dosya `035-okul-disk-siniri.sql` (`40fc7e7 commit 525`, 2026-09-27). Sıradaki numara `036`.
- Belgelerken görülen, kodda duran açıklar (kod değiştirilmedi; hepsi "Dikkat!"te): `kullanicilar_tc_ogrenci` kurulamadıysa
  bir daha denenmemesi ve açılış iletisinin yanıltıcı olması; `okullar.durum 'pending'`'in "müdürü yok" anlamında
  kullanılması; boşta kalan `kullanicilar_bekleyen_basvuru` indeksi; geri yüklemede aile cihaz bağlarının, ayarlarının ve
  sınırlarının kaybolması.
- Planlı işlerden yeni şema dosyası getirecek olanlar (DEVAM'daki sıra; ayrıntı tanımlarda):
  - **Paneller ve okul gezgini** (iş 5): gezgin klasörleri (klasörler ve okulun klasörü), simgelerin ızgara konumu
    (`gezgin_konumlari`: öğe türü, öğe, klasör, satır, sütun), müdürün yüklediği 128×128 okul simgesi (`okul_fotolari.yer`
    kısıtında bugün yok; yeni değer ya da yeni tablo), birden çok müdür ve müdürün başka bir müdürü ONAYSIZ ataması
    (`kullanicilar_rol_satiri`, `kullanicilar_ana_okul`), eski `'pending'` müdür/okul satırlarının "müdürü yok" durumuna
    taşınması. Bu iş kullanıcının 29 Eylül "mantık hatası" düzeltmesini (onay bekleme değil müdür atama; boş masaüstü gibi
    sürüklenebilir ızgara; okul simgesi) içerir.
  - **Çalışan olarak ekleme** (iş 2) ve **tek kişi tek hesap + öğrencide portallar** (iş 19): rol satırı kuralları
    (`012`'nin `kullanicilar_rol_satiri`'si bugün yalnız öğretmen ve müdüre izin verir; servisçi ya da öğrenci portalı buna
    takılır), T.C. + doğum tarihiyle eşleşme.
  - **Güvenlik** (iş 3) ve **Sistem** (iş 4): ilk girişte şifre değiştirme, yöneticiye zorunlu TOTP, oturumlara cihaz özeti,
    bakım modu ve site duyurusu, tarayıcı hata günlüğü.
  - **Destek ve kullanıcı arama** (iş 6): destek talepleri tabloları.
  - **Optimizasyon + saklama süreleri** (iş 7): eksik indeksler için ayrı bir `0NN-indeksler.sql`, bildirim/mesaj/quiz
    saklama süreleri (yukarıdaki "Saklama süresi olmayan tablolar").
  - Sonrakiler: mesaj ayarları ve ajanda (iş 8), yıl geçişi (iş 9), anket düzenleyici (iş 13), sınav formülü (iş 14),
    başarılarım (iş 16), eğitim içerikleri (iş 17), toplantılar (iş 21) — her biri yeni tablolar getirir.
- Her yeni şema dosyası yazıldığında bu belgeye yeni bir `### NNN-ad.sql` bölümü eklenmeli ve Tablo dizini güncellenmeli.
