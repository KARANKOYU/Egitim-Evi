# sunucu/bolumler/takvim.js

Okul takvimi (`/api/takvim`): ay görünümü ve tek gün ayrıntısı; resmî ve dinî tatiller, okulun kendi etkinlikleri,
ödev teslimleri ve ders programı tek takvimde birleşir.

## Bu dosya ne yapar?

"Takvim" sayfasındaki ay tablosunu ve bir güne dokununca açılan ayrıntıyı bu dosya hazırlar. Takvim üç kaynaktan
beslenir (kod yorumu):

1. **Sabit özel günler** — her yıl aynı tarihte (23 Nisan, 29 Ekim…), koddaki `SABIT_GUNLER` listesi;
2. **Dinî bayramlar** — ay takvimine göre her yıl kaydığı için hesaplanmaz, `DINI_BAYRAMLAR` tablosundan okunur;
3. **Okulun kendi kayıtları** — müdürün (ya da `takvim.yonet` yetkilisinin) eklediği tatil, sınav, toplantı, etkinlik.

Bunların üstüne bakan kişinin ödev teslim tarihleri ve haftalık ders programından "o gün kaç ders var" sayısı bindirilir.
Öğrenci kendi takvimini, veli çocuğununkini (`studentId` ile), öğretmen kendi verdiği ödevleri ve kendi programını,
müdür okulun bütün ödevlerini görür. Ön yüzdeki tarih seçici de (`04e-tarih-secici.js`) günlerin üstüne tatil ve ders
bilgisini yazmak için bu ucu kullanır.

## İçinde neler var?

### Sabitler

- `SABIT_GUNLER` — `{ ay, gun, ad, tatil }` listesi: Yılbaşı, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos,
  29 Ekim (tatil) ile 18 Mart, 10 Kasım, 24 Kasım (tatil değil, "özel gün").
- `DINI_BAYRAMLAR` — yıl → `[{ bas, bit, ad }]`. Bugün YALNIZ 2026 var: Ramazan Bayramı 2026-03-19…22, Kurban Bayramı
  2026-05-26…30. İlk gün "(arife)" diye yazılır. Kod yorumu: yeni yıl eklerken Diyanet takvimine bakıp buraya yaz.

### Dışa açılan işlevler

- `tarihEkle(harita, tarih, kayit)` — `tarih → [olay]` haritasına ekler.
- `ozelGunler(yil, ay)` — o ayın sabit günleri ve dinî bayram günleri: `{ 'YYYY-AA-GG': [{ tur: 'tatil'|'ozel',
  baslik }] }`.
- `takvimHedefi(me, istenenId)` — takvime kimin gözünden bakılıyor. Öğrenci: kendisi. Başkası: `studentId` verilmemişse
  `null`; verilmişse öğrenci olmalı ve ya bakan kişiye veli bağıyla bağlı (rolü ne olursa olsun), ya da bakan veli değil
  ve aynı okulda. Öteki durumlarda `null` (hata vermez, kişinin kendi takvimi gelir).
- `uclar(k)` — aşağıdaki uçlar.

### İç işlevler

- `takvimOdevleri(me, hedef, bas, bit)` — takvime düşen ödevler: hedef öğrenci varsa onun ödevleri; yoksa öğretmende
  verdikleri, müdürde okulun hepsi; başka rolde (veli, servisçi) boş. Yalnız `[bas, bit]` arasında BİTENLER ve öğrenci
  listesi olmadan (`depo.odevler.takvimIcin`). Okulda "Ödevler" kapalıysa (`depo.ozellikler.kapaliMi(…, 'odev')`) boş.
  Sonuç bakılan eğitim yılına süzülür (`yilSuz`; velide `bakisKisisi` ile çocuğun gözünden).
- `takvimProgrami(me, hedef, gun)` — hedef öğrencinin sınıfı varsa sınıfın programı, yoksa öğretmende kendi programı,
  başkasında boş. `gun` verilmezse haftanın bütün günleri.

### Uçlar

Hepsi `p === 'takvim'`; önce `need()` (401/403), sonra `okulGerek` (okulsuz hesap 403). "Takvim" okulun kapatabileceği
bir bölüm değildir (`ozellikler.js`'teki listede yok); kapalı "Ödevler" bölümünü kendisi atlar.

- **`GET /api/takvim?yil=&ay=&studentId=`** — ay görünümü. `yil` 2000–2100 ve `ay` 1–12 değilse 400 "Yıl (2000-2100) ve
  ay (1-12) gerekli". Cevap:
  `{ yil, ay, basSutun, bugun, yonetebilir, ogrenci: { id, ad }|null, gunler: [{ tarih, gun, haftaGun, haftaSonu,
  bugun, tatil, dersSayisi, olaylar }] }`.
  - `basSutun` — ayın ilk gününün sütunu (Pazartesi = 0); `haftaGun` Pazartesi = 1 … Pazar = 7; `haftaSonu` 6 ve 7.
  - `olaylar` öğeleri: özel gün `{ tur: 'tatil'|'ozel', baslik }`; okul kaydı `{ tur, baslik, aciklama, id,
    silinebilir: true }` (çok günlük kayıt her güne yazılır); ödev `{ tur: 'odev', baslik, aciklama: ders, saat, durum,
    id }` (`saat` = `odevSaati`, saatsiz ödev 12:00).
  - `tatil` — o gün `tur === 'tatil'` olan herhangi bir olay var mı; `dersSayisi` — o haftanın gününe düşen program
    satırı sayısı.
  - Okul kayıtları hedef öğrencinin okulundan (veli başka okuldaki çocuğuna bakabilir), yoksa kişinin okulundan.
- **`GET /api/takvim/gun?tarih=&studentId=`** — tek gün. `tarih` bozuksa 400 "Tarih gerekli". Cevap `{ tarih, haftaGun,
  gunAdi, olaylar, dersler: [{ ders, sinif, bas, bit, ogretmen }], teslim: [...], yaklasan: [...], yonetebilir }`.
  `teslim` o gün biten ödevler, `yaklasan` sonraki günlerde (en çok 7 gün; saat dilimi notu "Dikkat!"te) bitenler (tarihe
  göre sıralı, en çok 10); ödev öğeleri
  `{ id, baslik, ders, tarih, saat, durum, aciklama }`.
- **`POST /api/takvim/etkinlik`** — okul kaydı ekler. `takvim.yonet` yoksa 403 "Takvime ekleme yetkin yok" (müdürde her
  zaman var). Gövde `{ tarih, bitis?, baslik, tur?, aciklama? }`: `tarih` `YYYY-AA-GG` olmalı (400 "Tarihi GG.AA.YYYY
  biçiminde seç" — ekrandaki biçimi anlatır), `baslik` zorunlu (100 harf; 400 "Başlık yaz"), `tur` `tatil|etkinlik|
  sinav|toplanti` (başka her şey `etkinlik`), `bitis` boşsa `tarih`; önce olamaz (400 "Bitiş tarihi başlangıçtan önce
  olamaz"); `aciklama` 300 harf. Kayıt yıl damgası alır (`yilDamgasi`). Cevap `{ etkinlik, message: '<başlık> takvime
  eklendi.' }`. Geçmiş yıla bakan personelin eklemesi `api.js`'in arşiv kapısında 409 alır.
- **`POST /api/takvim/etkinlik-sil`** — gövde `{ id }`. `takvim.yonet` yoksa 403 "Yetkin yok"; kayıt yoksa ya da başka
  okulunsa 404 "Kayıt bulunamadı". Silme de POST: kod yorumu, projenin geri kalanı GET/POST kullanıyor, DELETE için ayrı
  gövde okuma yolu açmaya değmez. Cevap `{ message: 'Silindi.' }`.

## Kimle konuşur?

- Çağırdıkları:
  - `../http` → `bad`, `ok`; `../iliskiler` → `GUN_ADLARI`; `../ortak` → `clean`, `now`, `uid` (`tk` önekli kimlik);
  - `../veri` → `depo`; `../yetki` → `okulGerek`, `yetkiVarMi`;
  - `./devamsizlik` → `bugun`, `gunBicimi` ([devamsizlik.md](devamsizlik.md));
  - `./egitim-yili` → `bakisKisisi`, `yilDamgasi`, `yilSuz` ([egitim-yili.md](egitim-yili.md));
  - `./odev` → `odevSaati` ([odev.md](odev.md)).
- Depo ve tablolar:
  - `depo.genel` → `takvim_etkinlikleri`: `takvimEkle`, `takvimBul`, `takvimSil`, `takvimAraligi` (ayla kesişen kayıtlar
    veritabanında süzülür);
  - `depo.odevler.takvimIcin` → `odevler` (+ öğrenci kapsamında `odev_ogrencileri`);
  - `depo.siniflar` → `ders_programi`, `dersler`: `sinifinProgrami`, `ogretmeninProgrami`;
  - `depo.kullanicilar` → `bul`, `bagliMi` (`kullanicilar`, `veli_baglari`); `depo.ozellikler.kapaliMi` (bellekten).
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM.takvim`); dışa açılan sabit ve işlevleri başka dosya kullanmıyor (grep).
- Ön yüz: `public/js/parcalar/17-takvim.js` (ay ve gün), `25-tiklama.js` (etkinlik ekle/sil), `04e-tarih-secici.js`
  (tarih seçicinin ay önbelleği).
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
GET /api/takvim?yil=2026&ay=4[&studentId=...]
  hedef = takvimHedefi(me, studentId)          (öğrenci kendisi; veli çocuğu; personel aynı okuldan)
  harita = ozelGunler(yil, ay)                 (SABIT_GUNLER + DINI_BAYRAMLAR[yil])
  + takvimAraligi(hedefin ya da benim okulum)  (çok günlük kayıt her güne)
  + takvimOdevleri(me, hedef, ayBaşı, aySonu)  (ödev kapalıysa boş; yıla süzülü)
  dersSayisi = takvimProgrami(me, hedef) → her haftanın gününe sayılır
  gunler[1..son] = { tatil?, bugun?, dersSayisi, olaylar }
```

## Dikkat!

- **Dinî bayramlar yalnız 2026 için var.** 2027 ve sonrasında takvim Ramazan ve Kurban bayramlarını göstermez; her yıl
  `DINI_BAYRAMLAR`'a elle eklenmeli. Resmî tatil olan "arife" yarım günleri ayrıca ayrılmaz (arife de `tatil` sayılır).
- **Okul etkinlikleri yıla süzülmez.** Etkinlik eklenirken `yilId` damgalanır, ama `takvimAraligi` yalnız okul ve tarih
  aralığına bakar: geçmiş yıla bakan kişi de, aktif yıldaki kişi de o ayın bütün kayıtlarını görür (tarihler zaten
  yıla göre ayrık olduğu için pratikte sorun çıkmıyor). Ödevler ise `yilSuz` ile süzülür.
- **`studentId` ile bakma kuralı geniş.** `takvimHedefi` veli olmayan ve aynı okulda olan herkese (öğretmen, müdür; aynı
  koşulu servisçi hesabı da sağlar) o okuldaki herhangi bir öğrencinin takvimini (ödev başlıkları, sınıf programı)
  açar; `yetki` denetimi yapılmaz. Geçersiz ya da izinsiz `studentId` hata vermez, kişinin kendi takvimi döner.
- Veli `studentId` vermezse ödev ve program gelmez (yalnız tatiller ve kendi okulunun kayıtları). Ön yüz
  (`17-takvim.js` → `takvimOgrenciParam`) velide şeritte seçili çocuğu, yoksa ilk çocuğu gönderir; portal açıksa o
  öğrenciyi.
- `etkinlik` ucunda `tarih` biçimi `YYYY-AA-GG`'dir; hata metnindeki "GG.AA.YYYY" ön yüzdeki tarih kutusunu anlatır.
- `etkinlik-sil` kaydın hangi yıla damgalandığına bakmaz. Geçmiş yıla bakan personelin hem eklemesi hem silmesi
  `api.js`'in arşiv kapısında 409 alır (`arsivYazmasiMi`: `etkinlik` ve `etkinlik-sil`; bkz. [api.md](../api.md)).
- Günler sunucunun yerel saatiyle kurulur (`new Date(yil, ay-1, g)`); `bugun` alanı da sunucunun bugünüdür.
- **`gun` ucundaki "yaklaşan" penceresi saat dilimine bağlı.** Sınır, günün yerel gece yarısına 7 gün eklenip
  `toISOString()` ile (UTC) yazılır. Sunucu Türkiye saatindeyse (UTC+3) yerel gece yarısı UTC'de önceki günün 21:00'i
  olduğu için sınır `tarih + 6` gün çıkar (denendi: `2026-04-10` → `2026-04-16`); UTC'de çalışan sunucuda `tarih + 7`.
  Yani Türkiye saatli sunucuda "yaklaşan" listesi 7 değil 6 günü kapsar.
- Müdürün takvimi eskiden okulun BÜTÜN ödevlerini yüklüyordu (kod yorumu: bir yıllık okulda 700 ms); şimdi yalnız ayın
  içinde bitenler ve öğrenci listesi olmadan gelir.

## Testleri

- `testler/test-takvim.js` — 12 bölüm: Nisan 2026 sabit özel günleri, 15 Temmuz, Mart 2026 Ramazan Bayramı, haftanın
  Pazartesi başlaması, okul etkinliği ekleme, ters tarih aralığı, yetki, öğrencinin günü, ders programının takvime
  düşmesi, velinin çocuğunun takvimini görmesi, silme, geçersiz girdi.
- `testler/test-odev-saat.js` — takvimde ve gün ayrıntısında ödevin saati (09:20) görünüyor.
- `testler/test-ozellikler.js` — okulda ödev kapalıyken takvimde ödev yok.
- `testler/test-giris-kayit.js` (rolsüz hesap 403), `yetki-denetimi.js`, `girdi-denetimi.js`.
- Elle: öğrenci hesabıyla (`testler/seed.js`) `GET /api/takvim?yil=2026&ay=4` → 23 Nisan `tatil: true` olmalı; müdürle
  `POST /api/takvim/etkinlik` `{ "tarih": "2026-10-05", "baslik": "Veli toplantısı", "tur": "toplanti" }`.

## Son durum

- Son commit `56869a9 commit 348` (2026-09-26): `takvimOdevleri` eklendi — ödevler bakana göre (öğrenci, öğretmen,
  müdür) ve yalnız istenen aralıkta biten, öğrenci listesiz; okulda ödev kapalıysa boş; yıla süzülü.
- `6490596 commit 314` (2026-09-26): `tarihEkle` ve `ozelGunler` eklendi. `3a49412 commit 119` (2026-08-29)
  `module.exports`'u ekledi (aynı commit `06-menu.js`'i getirdi); `d0cebfc commit 118` dosyanın ilk hâli.
- Açık iş: `DINI_BAYRAMLAR`'a 2027 eklenmeli (canlıdan sonraki ilk yıl geçişinden önce). Sıradaki planlı değişiklik:
  "Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama…" işi (duyurudan ajanda + hatırlatıcı) takvimin
  yanına bir ajanda getirecek.
