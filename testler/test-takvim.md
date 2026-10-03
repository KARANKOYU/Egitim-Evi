# testler/test-takvim.js

Takvimi (resmî tatiller ve özel günler, dinî bayramlar, haftanın Pazartesi'den başlaması, okulun etkinlikleri, öğrencinin
ödev teslimleri ve ders programı, velinin çocuğunun takvimi, silme, hatalı girdi) uçtan uca deneyen sunuculu test paketi
(33 denetim).

## Bu dosya ne yapar?

Takvim üç kaynaktan beslenir ([../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md)):

1. **Sabit özel günler** — her yıl aynı tarihte (23 Nisan, 15 Temmuz, 18 Mart…); bazıları tatil, bazıları yalnız anma günü.
2. **Dinî bayramlar** — ay takvimine göre kaydığı için koddaki tablodan okunur (arife günü işaretli).
3. **Okulun kendi kayıtları** — müdürün eklediği tatil, sınav haftası, toplantı, etkinlik (birden çok güne yayılabilir).

Üstüne öğrencinin (ya da velinin bakmakta olduğu çocuğun) ödev teslim günleri ve haftalık ders programındaki ders sayısı
bindirilir; bir güne tıklanınca o günün dersleri, teslimleri ve yaklaşan ödevleri gelir.

Bu paket önce kendine küçük bir dünya kurar (bir sınıf, Matematik dersi, Pazartesi 09:20 dersi, öğrenciyi o sınıfa
taşır), sonra bu üç kaynağın, bindirmelerin, yetkilerin ve hatalı girdilerin hepsini sırayla dener. Sabit günler ve
bayramlar için **2026** yılına, okul etkinlikleri ve ödevler için **bugünün ayına** bakar.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar.
- `kayit(govde)` — bot sorusunu çözer, `POST /api/register` (`kvkkOnay: true`, `phone: '05321234567'` ve gövde); cevap 200
  ve `onayGerekli` ise `epostaOnayla(govde.email)` ile onay bağlantısına "tıklar". Cevabın durumunu denetlemez.
- `iki(n)` — iki haneli sayı (`3` → `03`); ana gövdede `t(d)` → bu yılın bu ayının `d`. günü (`YYYY-AA-GG`).

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `epostaOnayla`,
`girisYap`, `botCevabi`.

### Hesaplar ve hazırlık

Seed'den ([seed.md](seed.md)): müdür `mudur@test.com` (`M`), Matematik öğretmeni `mat@test.com` (`O`, Ayşe Kaya), öğrenciler
`ogrenci1@test.com` (`S`) ve `ogrenci2@test.com`; şifreler `Test1234!`.

Hazırlık (müdürle): `TK-SINIF` sınıfı, içinde haftada 4 saat Matematik dersi, ders Ayşe Kaya'ya atanır; `ogrenci1`
`POST /api/school/class-assign` ile 6-A'dan `TK-SINIF`'a taşınır; `POST /api/school/schedule-add { day: 1, start: '09:20',
end: '10:00' }` ile Pazartesi'ye ders konur. 10. bölümde veli `veli-takvim@test.com` kaydolur.

### 1) Nisan 2026 — sabit özel günler (3)

`GET /api/takvim?yil=2026&ay=4` (müdür) → 30 gün; 23 Nisan `tatil: true` ve olaylarında "Çocuk Bayramı" geçen başlık.

### 2) Temmuz — 15 Temmuz (2)

`?yil=2026&ay=7` → 15 Temmuz tatil, başlığında "Demokrasi".

### 3) Dinî bayram — Mart 2026 Ramazan (3)

`?yil=2026&ay=3` → "Ramazan" geçen olay tam 4 günde (19–22 Mart), birinde "(arife)"; 18 Mart `tatil: false` ama
"Çanakkale" olayı var.

### 4) Hafta başlangıcı (2)

`?yil=2026&ay=1` → `basSutun` 3 (1 Ocak 2026 Perşembe; Pazartesi başlı ızgarada önünde 3 boş sütun) ve `haftaSonu`
işaretli 9 gün (3, 4, 10, 11, 17, 18, 24, 25, 31).

### 5) Okul etkinliği (4)

Bu ayın günleriyle (`t(…)`): `POST /api/takvim/etkinlik { baslik: 'Veli toplantısı', tur: 'toplanti', tarih: t(14) }` → 200;
`{ baslik: 'Sınav haftası', tur: 'sinav', tarih: t(20), bitis: t(24) }` → 200. Bu ayın görünümünde "Sınav haftası" 5 güne
yayılmış, 14'ünde `tur: 'toplanti'` olay var.

### 6) Ters tarih aralığı ve boş başlık (2)

`tarih: t(20), bitis: t(10)` → 400; `baslik: '  '` → 400.

### 7) Yetki (3)

Öğrenci `POST /api/takvim/etkinlik` → 403; öğrenci bu ayın takvimini görür (200) ve `yonetebilir: false`.

### 8) Öğrencinin günü (4)

- Öğretmen `GET /api/assignments/hedefler` ile ulaşabildiği bütün öğrencileri toplar, "Takvim ödevi"ni verir: başlangıç
  ayın 1'i, son teslim `teslimGun = t(min(28, bugün + 1))`.
- Öğrencinin ay görünümünde `teslimGun`'de `tur: 'odev'`, başlık "Takvim ödevi".
- `GET /api/takvim/gun?tarih=<teslimGun>` → 200; `teslim` listesinde ödev; `gunAdi` Türkçe bir gün adı.

### 9) Ders programı takvimde (3)

Bu ayın ilk Pazartesi'si bulunur; öğrencinin ay görünümünde o günün `dersSayisi` en az 1; `GET /api/takvim/gun` o gün için
`dersler`'de "Matematik" ve öğretmeni "Ayşe Kaya".

### 10) Veli çocuğunun takvimini görür (3)

- Veli kaydolur (`kayit`, onaylanır), girer, `ogrenci1`'in veli koduyla (`POST /api/parent/link`) bağlanır.
- `GET /api/takvim?…&studentId=<ogrenci1>` → 200, `ogrenci.id` çocuğun kimliği; teslim gününde `tur: 'odev'` olay var.
- `studentId=<ogrenci2>` (bağlı olmadığı çocuk) → `ogrenci: null`.

### 11) Silme (2)

`POST /api/takvim/etkinlik-sil { id: <Veli toplantısı> }` → 200; ay görünümünde artık "Veli toplantısı" yok.

### 12) Geçersiz girdi (2)

`?yil=2026&ay=13` → 400 (denetim "ya 400 ya `ay: 12`" diye yazılmış, sunucu 400 veriyor); `GET /api/takvim/gun?tarih=abc` →
400.

Sonunda boş satır ve `  GECTI: 33   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile iletiyi ve
yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); veritabanına doğrudan bağlanmaz.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/takvim`, `GET /api/takvim/gun`, `POST /api/takvim/etkinlik`, `POST /api/takvim/etkinlik-sil` | takvim | [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md) |
  | `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/lesson`, `GET /api/school/teacher-list`, `POST /api/school/lesson-update`, `GET /api/school/students`, `POST /api/school/class-assign`, `POST /api/school/schedule-add` | hazırlık | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/assignments/hedefler`, `POST /api/assignments` | ödev | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `POST /api/parent/link` | veliyi bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/register`, `POST /api/eposta-onay`, giriş uçları | veli hesabı, girişler | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** `sunucu/bolumler/takvim.js` — `SABIT_GUNLER`, `DINI_BAYRAMLAR` (yalnız 2026: Ramazan 19–22 Mart, Kurban
  26–30 Mayıs), `ozelGunler` (ilk güne "(arife)"), `takvimHedefi` (öğrenci kendisi; veli yalnız bağlı çocuğu; personel
  yalnız kendi okulunun öğrencisini), `takvimOdevleri`, `takvimProgrami`, ay görünümü (`basSutun`, `haftaSonu`, `tatil`,
  `dersSayisi`, `yonetebilir`, `ogrenci`), gün ayrıntısı (`dersler`, `teslim`, `yaklasan`, `gunAdi`), etkinlik ekleme
  (`takvim.yonet` yetkisi, tarih biçimi, başlık, `bitis < tarih` reddi) ve silme. Ayrıca `GUN_ADLARI`
  ([../sunucu/iliskiler.md](../sunucu/iliskiler.md)), `depo.genel.takvimEkle` / `takvimAraligi` / `takvimBul` / `takvimSil`
  ([../sunucu/veri/depo/genel.md](../sunucu/veri/depo/genel.md)), `depo.odevler.takvimIcin`
  ([../sunucu/veri/depo/odevler.md](../sunucu/veri/depo/odevler.md)), `depo.siniflar.sinifinProgrami`
  ([../sunucu/veri/depo/siniflar.md](../sunucu/veri/depo/siniflar.md)).
- **Tablolar** (uçlar üzerinden): `takvim_etkinlikleri`, `odevler`, `odev_ogrencileri`, `ders_programi`, `dersler`,
  `siniflar`, `kullanicilar`, `veli_baglari`, `eposta_onaylari`.
- **Ön yüz** (bu pakette tarayıcı yok): takvim sayfası ve gün penceresi [../public/js/parcalar/17-takvim.md](../public/js/parcalar/17-takvim.md)
  (`/takvim?yil=…&ay=…`, `/takvim/gun?tarih=…`); ortak tarih seçicisi de ayın takvimini bu uçtan çeker
  [../public/js/parcalar/04e-tarih-secici.md](../public/js/parcalar/04e-tarih-secici.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde (`test-devamsizlik`'ten sonra, `test-odev-saat`'ten önce).

## Nasıl çalışır (adım adım)?

```
M, O girer
hazırlık: TK-SINIF + Matematik (Ayşe Kaya) ; ogrenci1 ─► TK-SINIF ; Pazartesi 09:20-10:00
1-4) 2026: Nisan (23 tatil) ; Temmuz (15 tatil) ; Mart (Ramazan 4 gün, arife, 18 Mart tatil değil) ; Ocak (basSutun 3, 9 hafta sonu)
5) bu ay: "Veli toplantısı" (14) + "Sınav haftası" (20-24) ─► 5 gün, 14'te toplantı
6) bitiş < başlangıç ─► 400 ; boş başlık ─► 400
7) öğrenci: etkinlik 403 ; takvim 200, yonetebilir false
8) O: hedefler ─► "Takvim ödevi" (son teslim yarın, en geç ayın 28'i) ─► S takvimde ve gün ayrıntısında görür
9) ilk Pazartesi: dersSayisi ≥ 1 ; gün ayrıntısında Matematik / Ayşe Kaya
10) veli kaydolur ─► parent/link ─► studentId=ogrenci1 ─► çocuğun takvimi + ödev ; studentId=ogrenci2 ─► ogrenci null
11) etkinlik-sil ─► görünümden kalktı
12) ay=13 ─► 400 ; tarih=abc ─► 400
```

## Dikkat!

- **Sabit günler ve bayramlar 2026'ya gömülü.** 1–4. bölümler hep 2026'ya bakar, bu yüzden paket ileriki yıllarda da
  geçer. Ama sunucudaki `DINI_BAYRAMLAR` tablosunda yalnız 2026 var: 2027'nin Ramazan ve Kurban bayramları eklenmezse
  takvim o yıl bayram göstermez ve bu paket bunu fark etmez (3 Ekim'de 3200'de bakıldı: `?yil=2027&ay=3`'te "Bayram"
  geçen gün yok). Yeni yıl eklenince buraya o yılın bir denetimi eklenmeli.
- **5., 8. ve 9. bölümler bugünün ayına bakar.** Günler 14, 20–24 ve en çok 28 seçildiği için her ayda geçerlidir. Ayın
  28'inden sonra koşulursa `teslimGun` 28 olur (bugün ya da geçmiş); ödev yine o ayın içinde kaldığı için denetimler
  geçer. Ayın ilk Pazartesi'si her zaman ilk 7 günün içindedir.
- **Öğrenciyi başka sınıfa taşır.** Hazırlık `ogrenci1`'i 6-A'dan `TK-SINIF`'a taşır (9. bölümdeki ders sayısı buna
  dayanır). Aynı sunucuda ardından koşulan bir paket `ogrenci1`'i 6-A'da sanmasın (`tumtest.sh` her pakette sıfırlar).
- **12. bölümün "ya da" kolu hiç kullanılmıyor.** Sunucu sınır dışı ayda 400 "Yıl (2000-2100) ve ay (1-12) gerekli" verir
  (bu belge için 3 Ekim'de 3200'de denendi); denetimdeki `body.ay === 12` seçeneği eski bir davranıştan kalma görünüyor.
- **Başkasının çocuğu 403 değil, boş takvim.** Velinin bağlı olmadığı öğrenciye bakan istek 200 döner: `ogrenci: null`,
  ödev yok (veli rolünde `takvimOdevleri` kapsamsız kalır), okul etkinlikleri isteği yapanın `me.schoolId`'sinden gelir —
  velide bu, kayıtta okul seçmediği için ilk bağlandığı çocuğun okuludur (çocuk bağlanınca `veli.js` ya da `hesaplar.js`
  yazar; eski hesaplarda `yetki.js`'teki `okulGerek` tamamlar).
  3 Ekim'de denendi: 0 ödevli gün. Paket yalnız `ogrenci: null`'a bakar; bu davranış bilerek mi, kod yorumunda yazılı
  değil — bir gün 403'e çevrilirse bu denetim de değişmeli.
- **Etkinlik tarihinin yalnız biçimi denetlenir.** Sunucu `YYYY-AA-GG` biçimine bakar (`gunBicimi`); "2026-02-31" gibi
  takvimde olmayan bir gün ya da bilinmeyen bir `tur` (sessizce "etkinlik" olur) bu pakette denenmez.
- **Kayıt gövdesindeki `role: 'parent'`, `city`, `district` kullanılmıyor.** `register` bunları okumaz; hesap rolsüz açılır,
  veli kodunu girince veli olur.
- **`kayit()` sonucu denetlemez.** Kayıt reddedilirse sorun ancak sonraki `girisYap`'ta `TEST HATASI` olarak görünür.
- **Saat dilimi:** ay ızgarası ve "bugün" sunucunun yerel saatiyle kurulur; paket de bugünü kendi yerel saatiyle hesaplar.
  İkisi aynı makinede olduğu için tutarlı.
- **Arşiv yılı denenmez.** Etkinlik ekleme ve silme yıla bağlı yazma sayılır (`api.js`'in arşiv kapısı, geçmiş yıla bakana
  409); bu paket hep bugünkü yılla çalışır.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider (sınıf, ders, etkinlik, veli hesabı açar,
  öğrenciyi taşır). Her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Aynı alanda: [test-odev-saat.md](test-odev-saat.md) (takvimde ve gün ayrıntısında ödevin teslim saati),
  [test-ozellikler.md](test-ozellikler.md) (okul ödevleri kapatınca takvimin ödevsiz gelmesi),
  [test-program.md](test-program.md) (ders programı); `testler/yetki-denetimi.js` (takvimi görme ve etkinlik ekleme
  yetkileri), `testler/girdi-denetimi.js` (bozuk etkinlik başlığı).
- Elle (Git Bash, proje kökünde; 3200'de [seed.md](seed.md) ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-takvim.js
  ```

- 3 Ekim 2026'da bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 33   KALDI: 0`, yaklaşık
  1 saniye; sunucu günlüğünde `API hatası` / `Veritabanı hatası` yoktu. Aynı sunucuda ayrıca `ay=13`'ün 400 aldığı ve
  bağlı olmayan çocuğa bakan velinin 200 + `ogrenci: null` + ödevsiz takvim aldığı denendi. Belge denetiminde aynı gün
  yeniden koşuldu (sonuç aynı); 2027 Mart'ında bayram günü olmadığı da o sırada görüldü.

## Son durum

- `git log`: 2 commit, ikisi de 2026-08-29. `0442457 commit 122` (19 satır: başlık yorumu, `require`, `kontrol`, `kayit`,
  `iki`) ve `2565f18 commit 123` (195 satır: on iki bölümün hepsi). O günden beri değişmedi.
- Açık iş yok; kod değiştirilmedi. "Ya da" kolu kullanılmayan 12. bölüm denetimi ve 2026'ya bağlılık "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama (salon/koltuk), duyurudan ajanda+hatırlatıcı"** — ajanda ve
    sınav planlaması takvime yeni olay türleri ekleyecek; ay görünümü ve gün ayrıntısı denetimleri genişlemeli.
  - **"Toplantılar"** (istendi) — toplantılar ajandaya/takvime girecek ve bir hafta sonra silinecek.
  - **"Yıl geçişi"** — yeni eğitim yılı sihirbazı; `DINI_BAYRAMLAR`'a yeni yılların girilmesi de bu sırada düşünülmeli.
  - **"Özel branş / ders"** — hazırlıktaki "Matematik" dersi okulun kendi listesinden gelecek.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** — 10. bölümdeki veli kaydı T.C. göndermiyor; o iş gelince eklenmeli.
