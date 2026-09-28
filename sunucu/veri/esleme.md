# sunucu/veri/esleme.js

Veritabanı satırı (Türkçe, alt çizgili sütunlar: `ad_soyad`, `okul_id`) ile uygulamanın ve API'nin baştan beri kullandığı
nesne (`fullName`, `schoolId`) arasındaki çevirmen; boş değer kuralını (veritabanında NULL, uygulamada `''`) iki yönde de
uygular.

## Bu dosya ne yapar?

Eğitim Evi ilk sürümlerinde veriyi tek bir `db.json` dosyasında tutuyordu; nesnelerin alan adları (İngilizce ve
camelCase: `fullName`, `teacherId`, `studentIds`) o zamandan kaldı ve ön yüz, API cevapları, testler hep bu adları
kullanıyor. Veri PostgreSQL'e taşınınca tablolar Türkçe ve alt çizgili adlarla kuruldu. Bu dosya ikisini birbirine
çevirir: böylece ön yüze ve API'ye hiç dokunmadan veri katmanı değişebildi.

Her tablo grubu için bir "satır → nesne" işlevi vardır. Ters yön (nesne → sütunlar) yalnız kullanıcı için ayrıca yazılmıştır
(`kullaniciSutunlari`), çünkü kullanıcı kaydı pek çok yerden kısmi güncellenir; öteki depolar yazarken sütunları kendileri
adlandırır.

Kural: veritabanında "yok" `NULL`'dur, uygulamada ise boş metin (`teacherId: ''`, `schoolId: ''`). `bos()` okurken NULL'u
`''`'ye, `yokIse()` yazarken `''`'yi NULL'a çevirir.

## İçinde neler var?

### Boş değer yardımcıları

- `bos(v)` — `null`/`undefined` ise `''`, değilse `v`.
- `yokIse(v)` — `''`/`undefined` ise `null`, değilse `v`.

### Satır → nesne işlevleri

Hepsi satır `null` ise `null` döner. `_` ile başlayan alanlar sorgu JOIN ile ek sütun getirdiyse iliştirilir; ayrıca sorgu
atılmaz.

- `okul(r)` → `{ id, mebId, name, city, district, type, status, kisaAd, enlem, boylam, servisSaatleri, diskSiniriMb,
  createdAt }`. `enlem`/`boylam` yoksa `null`, varsa sayı. `servisSaatleri` = `{ sabahBas, sabahBit, aksamBas, aksamBit }`
  (şema 028; sütun boşsa `'07:00'`, `'09:20'`, `'16:30'`, `'19:00'`). `diskSiniriMb` (şema 035): `null` = site ayarındaki
  varsayılan sınır.
- `yil(r)` (eğitim yılı) → `{ id, schoolId, ad, bas, bit, aktif, createdAt }`.
- `sinif(r)` → `{ id, schoolId, name, createdAt }`.
- `kullanici(r)` → `{ id, username, email, pass, fullName, role, tc, status, schoolId, classId, customRoleId, seciliYil,
  seciliGecmis, createdBy, okulActi, phone, city, district, address, dogum, branch, grade, code, note, tema, mesajAyar:
  { kimden }, kvkk, sonGiris, okulNo, sifreDegismeli, anaHesapId, eslesmeKodu, createdAt }`. Önemli olanlar:
  `role: ''` rolsüz hesap (okul henüz eklememiş); `pass` şifre ÖZETİ (`sifre_ozeti`); `code` öğrencinin veli kodu
  (`veli_kodu`); `eslesmeKodu` yetişkin hesabının tek kullanımlık kişi kodu; `anaHesapId` okul rolü satırının bağlı
  olduğu yetişkin hesabı; `seciliGecmis` nakilden sonra bakılan geçmiş okul dönemi (021); `okulActi` hesabı okul açtıysa
  `true` (T.C. ve e-postayı okul düzenler); `kvkk` onay varsa `{ onay: true, tarih, surum }`, yoksa `null`. Satırda
  `okul_adi`, `okul_kisa_ad`, `okul_durum` varsa `_okulAdi`, `_okulKisaAd`, `_okulDurum` iliştirilir:
  [../yetki.md](../yetki.md)'deki `pub()` ilk ikisini `schoolName` ve `schoolSlug` olarak dışarı verir; `_okulDurum`'a
  [../bolumler/kayit.md](../bolumler/kayit.md) ve [../bolumler/kisilik.md](../bolumler/kisilik.md) bakar (okul onaylı
  değilse o okul rolüne girilmez). Koddaki yorumda geçen `_rol` (özel rol nesnesi) bu dosyada değil, `depo/kullanicilar.js`'te
  `customRoleId`'ye bakılarak iliştirilir.
- `rol(r, yetkiler, kapsamSatirlari)` → `{ id, schoolId, name, tur, permissions, kapsam, createdAt }` (+ `_kisiSayisi`).
  `tur` boşsa `'ozel'`. `kapsam` = `{ <yetki>: { dersler: [...], siniflar: [...] } }`; bir yetkinin yalnız ders ya da yalnız
  sınıf kapsamı tanımlıysa öteki `['*']` ("hepsi") olur.
- `ders(r)` → `{ id, schoolId, classId, subject, teacherId, weeklyHours, createdAt }` (+ `_sinifAdi`, `_ogretmenAdi`,
  `_yerlesen`).
- `program(r)` (ders programı satırı) → `{ id, schoolId, classId, lessonId, day, start, end, yilId, createdAt }`
  (+ `_ders`, `_ogretmenId`, `_sinifAdi`).
- `odev(r)` → `{ id, teacherId, schoolId, subject, title, description, startAt, endAt, endTime, startTime, studentIds,
  classIds, results, acilma, status, yilId, dosyaYukleme, dosyaSaklama, createdAt, finishedAt }`. `ogrenci_idler`,
  `sonuclar`, `sinif_idler`, `acilmalar` sorguda JSON olarak toplanıp gelir (`depo/odevler.js`). `dosyaYukleme` sütun
  `false` değilse `true` (033; eski ödevlerde açık). `dosyaSaklama` (034) ve `finishedAt` yoksa `undefined` (JSON'a hiç
  girmez).
- `sinavGrubu(r)` → `{ id, teacherId, schoolId, subject, name, yilId, createdAt }`.
- `sinav(r)` → `{ id, groupId, schoolId, templateId, templateName, teacherId, subject, name, tarih, weight, yilId,
  olcumler, grades, createdAt }`. `grades` ana ölçümün değerleri (`{ ogrenciId: deger }`, eski API ile uyum), `olcumler`
  `[{ id, kod, ad, alt, ust, ana, sira }]`.
- `mesaj(r)` → `{ id, schoolId, gonderenId, tur, konu, govde, hedefOzet, alicilar: [{ id, ogrenciId }], okuyanlar, tarih,
  duzenlenme }` (`ogrenciId` velinin hangi çocuğu için aldığı).
- `devamsizlik(r)` → `{ id, schoolId, classId, lessonId, ogrenciId, tarih, durum, not, alanId, yilId, createdAt }`.
- `takvim(r)` → `{ id, schoolId, tarih, bitis, baslik, tur, aciklama, ekleyenId, yilId, createdAt }`.
- `bildirim(r)` → `{ id, userId, text, link, read, createdAt }`.
- `islemKaydi(r)` → `{ id, schoolId, userId, userAd, userRol, islem, detay, ip, tarih }`.

### Nesne → sütunlar (yalnız kullanıcı)

- `KULLANICI_ALANLARI` — alan → sütun eşlemesi (`username` → `kullanici_adi`, `pass` → `sifre_ozeti`, `code` →
  `veli_kodu`, `note` → `okul_notu`, `grade` → `sinif_etiketi`, `okulActi` → `okul_acti` …). Dışa açık ama bugün yalnız
  bu dosyada kullanılıyor.
- `NULL_OLABILIR` (iç) — bu sütunlarda `''` NULL olarak yazılır: `okul_id`, `sinif_id`, `ozel_rol_id`, `secili_yil_id`,
  `secili_gecmis`, `olusturan_id`, `dogum_tarihi`, `rol`, `eposta`, `tc_kimlik`, `ana_hesap_id` (yabancı anahtarlar, tarih
  ve tekil indeksli alanlar: boş e-postalı iki hesap tekillik kuralına takılmasın).
- `kullaniciSutunlari(u)` — nesnede TANIMLI olan alanları sütunlara çevirir (`undefined` alan atlanır: kısmi güncelleme
  böyle çalışır). Ayrıca `mesajAyar.kimden` doluysa `mesaj_kimden`; `kvkk` tanımlıysa `kvkk_onay`, `kvkk_tarih`,
  `kvkk_surum`; `createdAt` doluysa `olusturma`. Çıktı [yazici.md](yazici.md)'deki `ekle`/`guncelle`'ye gider.

Dışa açılanlar: `bos`, `yokIse`, `okul`, `yil`, `sinif`, `kullanici`, `kullaniciSutunlari`, `KULLANICI_ALANLARI`, `rol`,
`ders`, `program`, `odev`, `sinavGrubu`, `sinav`, `mesaj`, `devamsizlik`, `takvim`, `bildirim`, `islemKaydi`.

## Kimle konuşur?

- Çağırdıkları: hiçbir şey (saf işlevler; `require` yok).
- Onu çağıranlar (`const e = require('../esleme')`):
  - `depo/kullanicilar.js` — `kullanici`, `kullaniciSutunlari`, `bos`;
  - `depo/okullar.js` — `okul`, `yil`; `depo/siniflar.js` — `sinif`, `ders`, `program`, `bos`, `yokIse`;
  - `depo/roller.js` — `rol`; `depo/odevler.js` — `odev`, `bos`, `yokIse`;
  - `depo/sinavlar.js` — `sinav`, `sinavGrubu`, `bos`, `yokIse`; `depo/mesajlar.js` — `mesaj`, `yokIse`;
  - `depo/devamsizlik.js` — `devamsizlik`, `bos`, `yokIse`; `depo/genel.js` — `takvim`, `bildirim`, `islemKaydi`, `yokIse`;
  - [json-aktarim.md](json-aktarim.md) — `disaAktar` yedeği bu işlevlerle yazar (`okul`, `yil`, `sinif`, `rol`,
    `kullanici`, `ders`, `program`, `odev`, `sinavGrubu`, `sinav`, `devamsizlik`, `mesaj`, `takvim`, `bildirim`,
    `islemKaydi`, `bos`).
- Öteki depolar (quiz, anket, okul hayatı, etüt, servis…) kendi satır çevirilerini kendi dosyalarında yapar.
- Biçimine dayanan: `sunucu/yardimci/servis-pencere.js` `require` etmez ama `okul()`'un döndürdüğü nesnedeki
  `servisSaatleri`'ni okur (yorumunda "esleme.okul() nesnesi" der); o alanın adını ya da biçimini değiştirirsen oraya da bak.
- Tablolar: doğrudan hiçbirine gitmez; çevirdiği satırlar `okullar`, `egitim_yillari`, `siniflar`, `kullanicilar`,
  `roller`/`rol_yetkileri`/`rol_yetki_kapsamlari`, `dersler`, `ders_programi`, `odevler` (+ `odev_ogrencileri`,
  `odev_siniflari`), `sinav_gruplari`, `sinavlar` (+ ölçüm ve değerler), `mesajlar` (+ alıcılar, okumalar), `devamsizlik`,
  `takvim_etkinlikleri`, `bildirimler`, `islem_kaydi` tablolarından gelir.

## Nasıl çalışır (adım adım)?

### Okuma

```
depo: satır = await tek('SELECT k.*, o.ad AS okul_adi ... FROM kullanicilar k ...')
      return e.kullanici(satır)
         ad_soyad     → fullName
         okul_id NULL → schoolId ''          (bos)
         okul_adi     → _okulAdi             (varsa iliştirilir)
```

### Kullanıcı yazma

```
depo/kullanicilar.js guncelle(id, { schoolId: '', grade: '5-A' })
  → kullaniciSutunlari → { okul_id: null, sinif_etiketi: '5-A' }   ('' NULL_OLABILIR'da → null)
  → yazici.guncelle('kullanicilar', id, sütunlar)                  (UPDATE ... SET okul_id = $1, sinif_etiketi = $2 WHERE id = $3)
```

## Dikkat!

- **`kullanici()` şifre özetini (`pass`) nesneye koyar.** Bu nesne istemciye olduğu gibi gönderilmez: dışarı giden kullanıcı
  görünümü [../yetki.md](../yetki.md)'deki `pub()`'dan geçer ve orada `pass` yoktur. Yeni bir uçta ham kullanıcı nesnesini
  `sendJSON` ile gönderme. Yedek dosyası ise bu nesneyi (özetle birlikte) olduğu gibi yazar ([yedek.md](yedek.md)).
- **Yeni sütun eklerken** (yeni şema dosyasıyla) üç yere bak: burada satır → nesne alanı; kullanıcıysa
  `KULLANICI_ALANLARI` (ve NULL olabiliyorsa `NULL_OLABILIR`); yedeğe girecekse [json-aktarim.md](json-aktarim.md)'deki
  `iceAktar`. `disaAktar` bu dosyanın işlevlerini kullandığı için alan buraya eklenince yedeğe de girer; `iceAktar`'a
  eklenmezse geri yüklemede sessizce varsayılana döner (033, 034, 035 böyle ikisine birden eklendi).
- **`NULL_OLABILIR`'da olmayan bir sütuna `''` yazılır, NULL değil.** Yabancı anahtar ya da tekil indeksli yeni bir
  kullanıcı sütunu eklersen buraya da ekle; yoksa boş değer yabancı anahtarı ya da tekilliği bozar.
- **`undefined` ile `''` farklıdır:** `kullaniciSutunlari`'na `{ schoolId: '' }` verirsen okul bağı SİLİNİR, `schoolId`'yi hiç
  vermezsen dokunulmaz.
- **`rol()`'deki `['*']`:** kapsam satırı hiç yoksa yetkinin kapsamı da yoktur (her yerde geçerli); yalnız ders tanımlıysa
  sınıf "hepsi" sayılır. Yetki denetimi ([../yetki.md](../yetki.md)) bu biçime dayanır.
- **`odev()`'de `dosyaSaklama` ve `finishedAt` `undefined` olabilir** (JSON'da hiç görünmez); ön yüz bunların yokluğunu
  "yok" diye okur.
- Tarih/saat alanları burada çevrilmez: [baglanti.md](baglanti.md)'deki tür ayrıştırıcıları zaten metin verir (`date`
  `'YYYY-AA-GG'`, `time` `'SS:DD'`, `timestamptz` ISO). `odev()`'deki `startTime` yine de `slice(0, 5)` ile kesilir.

## Testleri

- Ayrı bir birim testi yok; her API testi bu çeviriden geçen nesneleri denetler. En yakından ilgilenenler:
  `testler/test-yedek.js` (yedeğe giren alanlar: okulun `diskSiniriMb`'si, servis saatleri, ödevin `dosyaYukleme` izni
  geri geliyor mu; `dosyaSaklama`'nın yedekten dönüşü orada denenmiyor), `testler/test-servis-yoklama.js` (okulun `servisSaatleri`), `testler/test-okul-disk.js`
  (`diskSiniriMb`), `testler/test-odev-dosya.js` (`dosyaYukleme`, `dosyaSaklama`), `testler/test-cakisma.js` ve
  `testler/test-kisi-kodu.js` (kullanıcı yazma, `NULL_OLABILIR`).
- Elle: bir API cevabında (ör. `GET /api/me`) şifre özeti olmamalı, boş okul `schoolId: ''` gelmeli.

## Son durum

- Son değişiklikler (hepsi 2026-09-27): `40fc7e7 commit 525` okula `diskSiniriMb` (şema 035, okul disk sınırı);
  `566b917 commit 524` ödeve `dosyaYukleme` (033) ve `dosyaSaklama` (034); `24050a2 commit 518` okula `servisSaatleri`
  (028, servis yoklaması); `0acca75 commit 516` yalnız `eslesmeKodu` yorumu ("kişi kodu (tek kullanımlık)"). İlk hâli
  `873ce6a commit 9` (2026-08-28).
- Açık iş yok. Planlı işlerden "Çalışan olarak ekleme" (rolsüz çalışan, Kodlayıcı rolü) ve "Başarılarım" gibi yeni
  tablo/sütun getiren işler buraya yeni alanlar ekleyebilir; kural yukarıda (buraya + `iceAktar`).
