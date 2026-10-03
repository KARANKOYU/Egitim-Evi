# testler/test-egitim-yili.js

Eğitim yılını (yıl açma ve ad kuralları, kayıtların açıldıkları yıla bağlanması, yeni yılın temiz başlaması, geçmiş yıla
salt okunur bakma, aktif yılı değiştirme, kimin yönetebildiği) gerçek uçlardan deneyen sunuculu test paketi (30 denetim).

## Bu dosya ne yapar?

Okul her eylül sıfırdan başlar: yeni ödevler, yeni yoklamalar. Ama geçen yılın kaydı kaybolmamalı; veli geçen yılın
devamsızlığına, öğretmen geçen yılın ödevlerine dönüp bakabilmeli. Eğitim Evi bunu "yıl damgası"yla çözer: her yeni kayıt
yazanın o an baktığı yıla damgalanır, listeler kişinin baktığı yıla göre süzülür, damgasız eski kayıtlar okulun en eski
yılına sayılır. Geçmiş bir yıla bakan öğretmen ve müdür o yılın kayıtlarını değiştiremez (arşiv salt okunurdur). Sunucu
tarafı [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md), yazma kapısı
[../sunucu/api.md](../sunucu/api.md), ön yüz [../public/js/parcalar/16-egitim-yili.md](../public/js/parcalar/16-egitim-yili.md).

Bu paket o düzeni bir senaryo olarak oynar: okulda hiç yıl yokken "2025-2026" açılır, bu yıla bir ödev ve bir devamsızlık
yazılır, sonra "2026-2027" açılır ve eski kayıtların yeni yılda görünmediği, eski yıla geçince geri geldiği, eski yıla
bakarken yeni kayıt açılamadığı denetlenir.

Dosya başı yorumu: "Egitim yili: kayitlar yila baglaniyor mu, eski yil korunuyor mu." Çıktı iletileri eski düzende Türkçe
harfsizdir.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı yazar, sayaçları artırır.
- `gun(n)` — bugünden `n` gün sonrası, `YYYY-AA-GG`; `toISOString()` ile yazıldığı için UTC takvim günü.

Giriş işleri [giris.md](giris.md) üzerinden: `iste`, `girisYap` ([../araclar/giris.md](../araclar/giris.md)).

### Hesaplar ve hazırlık

Seed hesapları ([seed.md](seed.md)): müdür (`mudur@test.com`, `M`), Matematik öğretmeni Ayşe Kaya (`mat@test.com`, `O`),
9. bölümde öğrenci `ogrenci1@test.com` (Zeynep Şahin, `S`).

Hazırlık (sonuçları denetlenmez): müdür `YIL-SINIF` sınıfını açar, ona haftada 4 saatlik Matematik dersi ekler, dersi
`GET /api/school/schedule?classId=…`'ten bulur, "Ayşe Kaya"ya atar ve `ogrenci1`'i bu sınıfa koyar.

### Denetimler (bölüm bölüm, 30)

**1) Başlangıçta yıl yok (3):** `GET /api/egitim-yili` (müdür) → `yillar` boş; `yonetebilir: true`; `arsiv: false`.
(Seed hiç yıl açmaz.)

**2) İlk yılı aç (2):** `POST /api/egitim-yili/ekle { ad: '2025-2026' }` → 200 ve `yil.aktif: true`.

**3) Geçersiz yıl adı (3):** `'2026'` → 400 (biçim `2026-2027` olmalı); `'2026-2030'` → 400 (ikinci yıl birincinin bir
fazlası olmalı); `'2025-2026'` yeniden → 400 (zaten var).

**4) Eski yıla kayıt gir (3):**
- Öğretmen `GET /api/assignments/hedefler`'deki bütün öğrencilere "Eski yıl ödevi"ni verir (başlangıç `gun(-5)`, son
  `gun(2)`) → 200.
- Bu haftanın pazartesisi hesaplanır; müdür `YIL-SINIF`'ın programına pazartesi 09:20–10:00 Matematik saati ekler
  (`POST /api/school/schedule-add`, sonucu denetlenmez) ve o pazartesi için `ogrenci1`'i bu derste "Gelmedi" işaretler
  (`POST /api/devamsizlik/isaretle`) → 200.
- Öğretmenin ödev listesinde (`GET /api/assignments`) en az bir ödev var.

**5) Yeni yıl aç (3):** `'2026-2027'` → 200; müdürün listesinde iki yıl; aktif olan `2026-2027` (yeni açılan yıl
öbürünü pasife çeker).

**6) Yeni yıl temiz başlıyor (3):** öğretmenin listesinde `bakilan` yıl `2026-2027` (hiç seçim yapmamış kişi aktif yıla
bakar); öğretmenin ödevlerinde "Eski yıl ödevi" yok; müdürün devamsızlık özetinde (`GET /api/devamsizlik/ozet`)
`toplamKayit === 0`.

**7) Eski yıla geri bak (5):**
- Öğretmen `POST /api/egitim-yili/bak { id: <2025-2026> }` → 200 ve `arsiv: true`; ödev listesinde "Eski yıl ödevi"
  yeniden var.
- Eski yıla bakarken `POST /api/examgroups { name: 'Arşivde açılan grup' }` → **409** ve `arsiv: true` (salt okunur).
- Müdür de eski yıla geçer (sonucu denetlenmez); özetinde `toplamKayit >= 1` (pazartesinin "Gelmedi"si geri geldi).

**8) Yeni yıla dön (1):** öğretmen `bak` ile `2026-2027`'ye döner; "Eski yıl ödevi" yine görünmüyor.

**9) Yetki (5):** öğrenci yıl açamaz (`ekle` → 403) ve aktif yılı değiştiremez (`aktif-yap` → 403); ama yılları görür
(200, iki yıl), ona `yonetebilir: false`; eski yıla bakabilir (`bak` → 200).

**10) Aktif yıl değiştirme (2):** müdür `POST /api/egitim-yili/aktif-yap { id: <2025-2026> }` → 200; listede tam bir yıl
aktif ve o `2025-2026`.

Sonunda boş bir satır ve `  GECTI: 30   KALDI: 0` (başında iki boşluk); `KALDI` varsa çıkış kodu 1. Beklenmeyen hata
`TEST HATASI:` ile iletiyi ve yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/egitim-yili`, `POST /api/egitim-yili/ekle`, `POST /api/egitim-yili/bak`, `POST /api/egitim-yili/aktif-yap` | paketin asıl konusu | [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md) |
  | `GET /api/assignments/hedefler`, `POST /api/assignments`, `GET /api/assignments` | yıla damgalanan ve süzülen ödev | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `POST /api/devamsizlik/isaretle`, `GET /api/devamsizlik/ozet` | yıla damgalanan ve süzülen devamsızlık | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `POST /api/examgroups` | arşivde yazma denemesi (409) | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `POST /api/school/class`, `GET /api/school/classes`, `POST /api/school/lesson`, `GET /api/school/schedule`, `POST /api/school/schedule-add`, `GET /api/school/teacher-list`, `POST /api/school/lesson-update`, `GET /api/school/students`, `POST /api/school/class-assign` | hazırlık | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula` | giriş (`girisYap`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md) (`yilBilgisi`, `yilaAitMi`,
  `yilSuz`, `yilDamgasi`, `arsivdeMi` ve dört uç); [../sunucu/api.md](../sunucu/api.md) (`arsivYazmasiMi` ile geçmiş
  yıla bakan öğretmen/müdürün yazmasını 409 ile durduran kapı); [../sunucu/veri/depo/okullar.md](../sunucu/veri/depo/okullar.md)
  (`yillari`, `yilEkle` ve `yilAktifYap` — tek aktif yıl kuralı aynı işlemde); ödevin ve devamsızlığın yıl damgası
  ([../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md)).
- **Tablolar** (dolaylı): `egitim_yillari`, `kullanicilar` (kişinin seçtiği yıl), `odevler`, `odev_ogrencileri`,
  `devamsizlik`, `ders_programi`.
- **Rol:** yılı müdür (`yil.yonet` yetkisi) açar ve aktif yapar; herkes kendi baktığı yılı seçer.
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-odev-saat`'ten sonra, `test-sinav`'dan önce);
  her paketten önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
hazırlık: YIL-SINIF + Matematik (Ayşe Kaya) + ogrenci1 bu sınıfta
1) M: yıl listesi boş, yönetebilir, arşivde değil
2) M: 2025-2026 aç (aktif) ── M'nin baktığı yıl bu olur
3) "2026", "2026-2030", "2025-2026" (tekrar) ─► 400
4) O: "Eski yıl ödevi" ─► damga 2025-2026
   M: pazartesi ogrenci1 "Gelmedi" ─► damga 2025-2026
5) M: 2026-2027 aç ─► aktif o, 2025-2026 pasif ; M'nin baktığı yıl 2026-2027
6) O: baktığı yıl 2026-2027 ; ödevlerinde eski ödev yok ; M: özet 0 kayıt
7) O: 2025-2026'ya bak ─► arsiv ; eski ödev geri ; examgroups POST ─► 409 arsiv
   M: 2025-2026'ya bak ─► özet ≥1 kayıt
8) O: 2026-2027'ye dön ─► eski ödev yok
9) S: ekle 403, aktif-yap 403 ; görür (2 yıl, yönetemez) ; bakabilir
10) M: 2025-2026'yı aktif yap ─► tek aktif yıl: 2025-2026
```

Yıl damgası, kaydı yazan kişinin **o an baktığı** yıldır: 4. bölümde müdür ilk yılı yeni açtığı için ona bakıyordur,
öğretmen hiç seçim yapmadığı için aktif yıla (o da ilk yıl) bakıyordur.

## Dikkat!

- **Taze seed ister.** Yıl adları sabittir (`2025-2026`, `2026-2027`). Aynı veritabanında ikinci koşuda (3 Ekim
  denetiminde denendi) 1. bölümün "yil listesi bos"u kalır, 2. bölümde `2025-2026` "Bu eğitim yılı zaten var" (400) alır
  ve paket hemen sonraki satırda (45. satır, `y1.body.yil.aktif`) `TEST HATASI: Cannot read properties of undefined
  (reading 'aktif')` ile durur; sonraki bölümler hiç çalışmaz. Bugünün tarihine bağlı değildir: "eski" ve "yeni" yalnız
  addır, sunucu yılın başlangıç ve bitişini (`<yıl>-09-01`, `<yıl+1>-06-30`) yalnız saklar.
- **"Eski yılda ödev görülüyor" tek başına kanıt değil.** Seed'in ödevleri yıl açılmadan yazıldığı için damgasızdır ve
  okulun en eski yılına (`2025-2026`) sayılır; öğretmenin listesindeki "en az bir ödev" bunlardan da gelebilir. Asıl kanıt
  6–8. bölümlerdeki "Eski yıl ödevi" adıyla yapılan arama ve devamsızlık özetinin 0 / ≥1 olmasıdır.
- **Baktığın yıl veritabanında kalır.** `bak`, `ekle` ve `aktif-yap` kişinin seçtiği yılı (`kullanicilar` satırındaki
  seçimi) yazar; oturum kapansa da kalır. Bu yüzden bölümlerin sırası önemlidir: öğretmen 7. bölümde eski yıla geçer,
  8. bölümde döner; müdür 7. bölümde eski yıla geçer ve paketin sonuna kadar orada kalır.
- **Arşiv kapısının yalnız bir yolu denenir.** Sunucu geçmiş yıla bakan öğretmen ve müdürün ödev, sınav grubu, sınav,
  yoklama, işaretleme, takvim etkinliği ve program değişikliği isteklerini 409 ile durdurur; bu paket yalnız
  `POST /api/examgroups`'u dener. Kapının `assignments` dalı yalnız quiz istekleriyle (`/api/assignments/<id>/quiz`,
  `…/quiz/sonuc-ac`, `/api/assignments/quiz-metin`) `testler/test-quiz.js`'te denenir; ödevin kendisi (ver, düzelt,
  sonuçlandır), sınav, yoklama, işaretleme, takvim ve program yolları bugün hiçbir pakette (`testler/` altında `arsiv`
  araması, 3 Ekim) denenmiyor. Öğrenci ve velinin istekleri bu kapıya hiç girmez.
- **Devamsızlık özeti son 30 günü sayar** (`ozet`'in varsayılan `gun`'u). Pazartesi her zaman son 7 gün içinde olduğu
  için sorun yok; özetin süresini değiştirirsen 6. ve 7. bölümleri gözden geçir.
- **Pazartesi UTC günüyle yazılır.** Pazartesi yerel saatle bulunur (`getDay()`, saat korunarak geriye sayılır) ama
  `d.toISOString()` ile yazılır; paket hangi gün olursa olsun gece 00:00–03:00 arasında (Türkiye saatiyle) çalışırsa tarih
  bir gün geri, pazara kayar. `isaretle` haftanın gününe ve programa bakmadığı, yalnız tarihin ileri olmadığını denetlediği
  için yine geçer (koddan). Program saatinin eklenmesi bu yüzden denetim için gerekli değil, yalnız gerçekçi bir veri.
- **Seed'e bağlı:** öğretmen "Ayşe Kaya" adıyla, öğrenci e-postasıyla aranır; öğretmenin `hedefler`'i seed'in 6-A'sını da
  içerir (ödev o sınıftaki öğrenciye de gider).
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi okulunda yıl açar ve aktif yılı değiştirir; her zaman
  test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: `testler/test-quiz.js` (arşiv
  yılında quiz yazma 409), `testler/test-nakil.js` (öğrencinin ve velinin önceki okul dönemine bakması, `arsiv: true`),
  `testler/test-okul-agi.js` (yalnız yük altında: 300 öğrencinin sayfa açılışındaki isteklerden biri `GET /api/egitim-yili`),
  [test-devamsizlik.md](test-devamsizlik.md) (özetin kendisi), [yetki-denetimi.md](yetki-denetimi.md) ve
  [girdi-denetimi.md](girdi-denetimi.md).
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-egitim-yili.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 30   KALDI: 0`, yaklaşık 1
  saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. Belgenin denetiminde yeniden koşuldu, sonuç aynı;
  ardından aynı veritabanındaki ikinci koşu "Dikkat!"teki `TEST HATASI`'nı verdi.

## Son durum

- `git log`: tek commit. Dosya `17b9231 commit 358` (2026-09-26) ile 160 satır olarak eklendi (commit yalnız bu dosyayı
  içerir); o günden beri değişmedi.
- Açık iş yok. Kod değiştirilmedi; arşiv kapısının öteki yollarının denenmemesi "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Yıl geçişi: yeni yıl sihirbazı, mezunlar, okul yedeği, önemli işlerde çift doğrulama"** — yıl açma tek bir
    `ekle` isteği olmaktan çıkabilir (sihirbaz, çift doğrulama); 2. ve 5. bölümler yeni akışa göre yazılmalı.
  - **"Optimizasyon + saklama süreleri"** (öğrenci/veli yalnız son 1 geçmiş yıl) — öğrencinin gördüğü yıl sayısı
    (9. bölümde 2) kurala göre değişebilir.
  - **"Devamsızlık: tarih aralığı + gün gün / ders ders + filtre"** — `ozet` cevabındaki `toplamKayit` alanı değişirse 6. ve
    7. bölümler güncellenmeli.
