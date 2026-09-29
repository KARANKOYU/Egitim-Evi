# sunucu/veri/depo/roller.js

Okulun rollerinin (`roller`), rollerin yetkilerinin (`rol_yetkileri`) ve yetkilerin ders/sınıf daraltmalarının
(`rol_yetki_kapsamlari`) SQL'i: rol okuma, okulun hazır Öğretmen rolünü kurma, rol ekleme/değiştirme/silme.

## Bu dosya ne yapar?

Müdür okulunda "Müdür Yardımcısı", "Etüt Sorumlusu" gibi roller tanımlar ve bunları öğretmenlere verir; ayrıca her okulun
bir **hazır Öğretmen rolü** vardır: okuldaki her öğretmen o rolün yetkilerine kendiliğinden sahiptir (şema 013). Bu dosya
bu rollerin veritabanı tarafıdır. Bir rol üç tabloya yayılır:

- `roller` — rolün kendisi (`id`, `okul_id`, `ad`, `tur`: `'ozel'` ya da `'ogretmen'`, `olusturma`);
- `rol_yetkileri` — rolün açtığı yetkiler (`'odev.ver'`, `'program.duzenle'` …), rol başına her yetki bir satır;
- `rol_yetki_kapsamlari` — bir yetkinin yalnız belli derslere ya da sınıflara daraltılması (`tur` `'ders'`/`'sinif'`,
  `deger` ders adı, sınıf kimliği ya da `'*'`).

Yetki denetiminin kendisi burada değil, [../../yetki.md](../../yetki.md)'dedir; bu dosya yalnız rolleri okur ve yazar.
Kullanıcı okunurken [kullanicilar.md](kullanicilar.md) bu dosyadaki `haritasi` ve `ogretmenYetkileri` ile kullanıcının
özel rolünü (`_rol`) ve okulunun hazır rol yetkilerini (`_ogretmenYetkileri`) nesneye iliştirir; böylece her yetki
denetiminde ayrıca sorgu atılmaz.

## İçinde neler var?

Satır → nesne [../esleme.md](../esleme.md)'deki `rol(r, yetkiler, kapsamSatirlari)`:
`{ id, schoolId, name, tur, permissions: ['odev.ver', …], kapsam: { 'odev.ver': { dersler: [...], siniflar: [...] } },
createdAt }` ve sayım istendiyse `_kisiSayisi`. Kapsamda yalnız dersler ya da yalnız sınıflar tanımlıysa öteki `['*']`
("hepsi") olur; hiç kapsam satırı olmayan yetki `kapsam` nesnesinde hiç yer almaz (yetki okulun tamamında geçer).

### Okuma

- `haritasi(idler, kisiSayisiyla)` — verilen rol kimliklerini üç sorguyla yükler ve `Map(id → rol)` döner:
  1. `SELECT r.* FROM roller r WHERE r.id = ANY($1::text[])` (`kisiSayisiyla` doğruysa ek sütun
     `(SELECT count(*) FROM kullanicilar k WHERE k.ozel_rol_id = r.id) AS kisi_sayisi`);
  2. `SELECT rol_id, yetki FROM rol_yetkileri WHERE rol_id = ANY(...) ORDER BY yetki`;
  3. `SELECT rol_id, yetki, tur, deger FROM rol_yetki_kapsamlari WHERE rol_id = ANY(...) ORDER BY deger`.
  Satırlar JavaScript'te role göre süzülür. Boş dizi verilirse hiç sorgu atmadan boş harita döner. Bulunamayan kimlik
  haritada yoktur. Okul süzmez.
- `bul(id)` — tek rol (kişi sayısıyla) ya da `null`; `id` boşsa sorgu atmaz.
- `okulun(okulId)` — okulun bütün rolleri: önce hazır Öğretmen rolü, sonra özel roller Türkçe ad sırasıyla
  (`ORDER BY (tur = 'ogretmen') DESC, ad` + [../baglanti.md](../baglanti.md)'deki `tr()`), kişi sayılarıyla.
- `ogretmenYetkileri(okulIdler)` — okulların hazır Öğretmen rolünün yetkileri: `Map(okulId → ['odev.ver', …])`.
  `roller LEFT JOIN rol_yetkileri`, `WHERE r.tur = 'ogretmen' AND r.okul_id = ANY(...)`. LEFT JOIN sayesinde rolü
  kurulmuş ama bütün yetkileri kapatılmış okul haritada **boş diziyle** bulunur; rolü hiç kurulmamış okul haritada
  **yoktur** (o zaman [../../yetki.md](../../yetki.md) `OGRETMEN_VARSAYILAN`'ı kullanır). Bu ayrım önemlidir: müdür
  bütün yetkileri kapatınca öğretmenler varsayılanlara geri dönmez.

### Yazma

- `yetkileriYaz(rolId, izinler, kapsam)` — rolün yetki ve kapsam satırlarını baştan yazar: önce
  `DELETE FROM rol_yetkileri WHERE rol_id = $1` (kapsam satırları yabancı anahtarın `ON DELETE CASCADE`'iyle kendiliğinden
  gider), sonra her izin için bir `INSERT INTO rol_yetkileri`, o iznin kapsamında her ders için `tur = 'ders'`, her sınıf
  için `tur = 'sinif'` satırı (`new Set` ile aynı değer bir kez). Kendi başına işlem açmaz; yalnız bu dosyanın içinden,
  `islem` içinde çağrılır (dışa açık ama dışarıdan çağıran yok).
- `ogretmenRolu(okulId, varsayilanYetkiler, yeniId, zaman)` — okulun hazır Öğretmen rolünü döner; yoksa kurar. Önce
  `SELECT id FROM roller WHERE okul_id = $1 AND tur = 'ogretmen'`; varsa `bul`. Yoksa sırayla `'Öğretmen'` ve
  `'Öğretmen (hazır)'` adlarını dener: her denemede işlem içinde
  `INSERT … (tur = 'ogretmen') ON CONFLICT DO NOTHING RETURNING id`; satır girdiyse `yetkileriYaz(yeniId,
  varsayilanYetkiler, {})`. Her denemeden sonra rol yeniden aranır, bulunursa döner. İki ad da tutmazsa
  `Error('Öğretmen rolü kurulamadı')` fırlatır (bölüm 500 verir).
- `ekle(r)` — işlemde `INSERT INTO roller (id, okul_id, ad, olusturma)` (`tur` şemadaki varsayılanla `'ozel'`) +
  `yetkileriYaz(r.id, r.permissions || [], r.kapsam || {})`; sonunda `bul(r.id)`. Aynı okulda aynı ad (büyük/küçük harf
  dahil birebir) `UNIQUE (okul_id, ad)`'a takılır → `23505` → [../baglanti.md](../baglanti.md) "Bu kayıt zaten var" (bu
  kısıtın özel alan iletisi yok).
- `guncelle(r)` — işlemde `UPDATE roller SET ad = $1 WHERE id = $2` + `yetkileriYaz`; sonunda `bul(r.id)`. `tur` ve
  `okul_id` değişmez.
- `sil(id)` — `DELETE FROM roller WHERE id = $1`. Yetki ve kapsam satırları CASCADE ile gider; rolü taşıyan
  kullanıcıların `ozel_rol_id`'si `ON DELETE SET NULL` ile boşalır.

### Tablolar ve şema

| Tablo / sütun / indeks | Şema dosyası |
|---|---|
| `roller` (`ad` 1–60 karakter, `UNIQUE (okul_id, ad)`), `rol_yetkileri` (`PRIMARY KEY (rol_id, yetki)`, rol silinince CASCADE), `rol_yetki_kapsamlari` (`tur` ders/sinif, `(rol_id, yetki)` → `rol_yetkileri` CASCADE), `kullanicilar.ozel_rol_id` (`ON DELETE SET NULL`) | `001-ilk.sql` |
| `roller.tur` (`'ozel'` varsayılan / `'ogretmen'`) + `roller_okul_ogretmen` (okul başına tek hazır rol, kısmi tekil indeks) | `013-ogretmen-rolu-etut.sql` |
| Var olan hazır rollere `sinav.olustur` ve `ogretmen.sonuclar` yetkileri eklendi (veri göçü) | `023-ogretmen-yetkileri.sql` |

Şema dosyalarını açılışta sırayla uygulayan: [../sema.md](../sema.md) (dosyalar `sunucu/veri/sema/` altında).

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `islem`, `tr`), [../esleme.md](../esleme.md) (`rol`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.roller`):
  - [../../bolumler/okul.md](../../bolumler/okul.md) — Roller ve Yetkiler ekranı: `GET /api/school/roles` önce
    `ogretmenRolu(me.schoolId, OGRETMEN_VARSAYILAN, uid('r'), now())` (yoksa şimdi kurulur), sonra `okulun`;
    `POST /api/school/role` (`okulun` ile ad çakışması ön denetimi, `ekle`), `role-update` (`guncelle`), `role-delete`
    (`sil`), `role-assign` (`roleById` → `bul`).
  - [../../yetki.md](../../yetki.md) — `roleById = id => depo.roller.bul(id)`; okul.js bunu içeri alır.
  - [../../bolumler/hesaplar.md](../../bolumler/hesaplar.md) — kişi kaydı düzenlenirken ek rol verme (`bul`; rolün okulu
    ve hazır rol olmadığı denetlenir).
  - [kullanicilar.md](kullanicilar.md) — `zenginlestir` içinde `haritasi(rolIdler)` (kişi sayısız) ve
    `ogretmenYetkileri(ogretmenOkullari)`: her kullanıcı okumasında çalışır.
- Tablolar: `roller`, `rol_yetkileri`, `rol_yetki_kapsamlari`; sayım için `kullanicilar` okunur.

## Nasıl çalışır (adım adım)?

### Bir öğretmenin yetkileri nereden gelir?

```
kullanicilar.js zenginlestir(satirlar)
  ├─ özel rolü olanlar  → roller.haritasi([ozel_rol_id…])     → u._rol = { permissions, kapsam, tur, schoolId }
  └─ öğretmenler        → roller.ogretmenYetkileri([okul…])     → u._ogretmenYetkileri = [...] (rol kurulmamışsa yok)
yetki.js kullaniciYetkileri(u)
  = (_ogretmenYetkileri || OGRETMEN_VARSAYILAN) ∪ (_rol aynı okuldan ve özel rolse _rol.permissions)
yetki.js yetkiKapsami(u, izin) = _rol.kapsam[izin] || null   (hazır roldeki izni ek rolün kapsamı daraltmaz)
```

### Roller ekranı açılırken hazır rolün kurulması

```
GET /api/school/roles
  ogretmenRolu(okul)  ── var mı? ── evet ──────────────────────────────→ bul(id)
                        └─ hayır → islem { INSERT 'Öğretmen' ON CONFLICT DO NOTHING
                                           (girdiyse) yetkileriYaz(varsayılanlar) }
                                   yeniden ara → bulunduysa döner
                                   bulunamadıysa (okulda "Öğretmen" adlı özel rol var)
                                   → aynı adımlar 'Öğretmen (hazır)' adıyla
  okulun(okul) → [hazır rol, özel roller ad sırasıyla]
```

Aynı anda iki istek gelirse ikisi de `INSERT` dener; `roller_okul_ogretmen` tekil indeksi ikincisini `ON CONFLICT DO
NOTHING` ile sessizce düşürür, ikinci istek yeniden aramada birincinin kurduğu rolü bulur.

### Rolün yetkilerini değiştirme

```
role-update → bölüm: aynı okul mu? kendi rolü mü? ad çakışıyor mu? kapsamı süz (kapsamTemizle)
            → guncelle(r): islem { UPDATE ad ; DELETE yetkiler (kapsamlar CASCADE) ; INSERT yetki + kapsam … }
            → bul(r.id)
```

## Dikkat!

- **Okul kapsamı bölümde.** `bul`, `guncelle`, `sil` yalnız kimlikle çalışır; SQL'de okul koşulu yoktur. Bölüm her
  seferinde `r.schoolId !== me.schoolId` ise "Rol bulunamadı" der; yeni bir çağıran eklerken bu denetimi unutma. Yetki
  tarafı da ayrıca `r.schoolId === u.schoolId` bakar ([../../yetki.md](../../yetki.md)): başka okulun rolü bir kullanıcıya
  bir şekilde yazılsa bile yetki vermez.
- **`yetkileriYaz` işlem dışında çağrılmamalı.** Önce hepsini siler, sonra tek tek ekler; işlem dışında ortada bir hata
  olursa rol yetkisiz kalır. Bugün yalnız `ekle`, `guncelle` ve `ogretmenRolu` içinden, `islem` içinde çağrılıyor.
- **Tam yeniden yazma ve eşzamanlı düzenleme:** iki yönetici aynı rolü aynı anda kaydederse son yazan kazanır (kilit yok);
  iki işlem de önce `DELETE` yaptığı için satırlar karışmaz, ama birinin değişikliği sessizce kaybolur.
- **Ad tekliği iki katmanlı:** bölüm Türkçe küçük harfe çevirip karşılaştırır ("müdür yardımcısı" = "Müdür Yardımcısı");
  veritabanındaki `UNIQUE (okul_id, ad)` ise birebir karşılaştırır. Aynı anda iki istek büyük/küçük harfi farklı iki adı
  geçirirse ikisi de yazılır; birebir aynı adı geçirirse ikincisi `23505` "Bu kayıt zaten var" alır.
- **`kisi_sayisi` rolü taşıyan BÜTÜN satırları sayar** (`kullanicilar.ozel_rol_id`), durumuna bakmaz. Hazır Öğretmen
  rolünde bu sayı anlamsızdır (kimse `ozel_rol_id` olarak taşımaz); bölüm onun yerine okuldaki öğretmen sayısını koyar.
  `count(*)` `bigint` döner; [../baglanti.md](../baglanti.md) `INT8`'i `Number`'a çevirdiği için sayı olarak gelir.
- **Hazır rol silinmez ama ondan önceki okullarda yoktu:** rol ilk kez Roller ekranı açılınca kurulur. O zamana kadar
  öğretmenler `OGRETMEN_VARSAYILAN` ile çalışır; kurulunca aynı varsayılanlar yazıldığı için bir şey değişmez.
- **`'Öğretmen (hazır)'` adı da alınmışsa** `ogretmenRolu` hata fırlatır ve Roller ekranı açılmaz (çok düşük olasılık:
  müdürün hem "Öğretmen" hem "Öğretmen (hazır)" adlı iki özel rol açmış olması gerekir).
- **`roller.okul_id` okul silinince CASCADE değildir** (001). Uygulama okul satırını silmiyor (kapatma `durum`la), bu
  yüzden bugün sorun çıkmaz.
- **Güvenlik:** bütün değerler `$1…` parametresiyle gider; `ANY($1::text[])` dizi parametresidir. Yetki adları bölümde
  `TUM_YETKILER` listesine göre, kapsam değerleri `kapsamTemizle` ile (gerçek dersler, okulun kendi sınıfları)
  süzülür; bu dosya gelen değeri olduğu gibi yazar.
- **İndeksler:** `roller` için `UNIQUE (okul_id, ad)`'ın indeksi `okulun`'daki `okul_id` aramasını da karşılar;
  `rol_yetkileri` ve `rol_yetki_kapsamlari` birincil anahtarları `rol_id` ile başladığı için `ANY(...)` aramaları
  indekslidir. `kullanicilar.ozel_rol_id` üzerinde ayrı indeks yok: kişi sayısı alt sorgusu okul büyüdükçe tabloyu tarar.

## Testleri

- `testler/test-rol.js` — yetki kataloğu, rol oluşturma (aynı ad Türkçe küçük harfle reddedilir, geçersiz yetki
  ayıklanır), rolsüz öğretmenin yapamadıkları, rol atama, öğretmenin kendi rolünü değiştirememesi, yetkileri daraltma,
  kişi sayısı, rol silme, `okul.konum` yetkili rol.
- `testler/test-kapsam.js` — ders/sınıf kapsamlı rol (`rol_yetki_kapsamlari` yazılıyor ve okunuyor mu, kapsam içi/dışı
  sınıf).
- `testler/test-etut.js`, `testler/test-siniflarim.js`, `testler/test-okul-hayati.js`, `testler/test-okul-sayfasi.js`,
  `testler/yetki-denetimi.js` — rol verip yetkiye bağlı uçları sınar (dolaylı).
- Elle: müdür olarak Roller ve Yetkiler sayfasını aç → en üstte "Öğretmen" (hazır) rolü görünmeli; bütün yetkilerini
  kapat → bir öğretmen hesabıyla ödev vermeyi dene, reddedilmeli (varsayılanlara dönmemeli).

## Son durum

- Son değişiklik `b7ded5b commit 345` (2026-09-26): `yetkileriYaz`, `ogretmenYetkileri`, `ogretmenRolu`, `ekle`,
  `guncelle`, `sil` eklendi (dosyanın ikinci yarısı). İlk hâli `e9b0754 commit 344` (aynı gün): `haritasi`, `bul`,
  `okulun`. Toplam 2 commit.
- Bilinen açıklar (kod değiştirilmedi): eşzamanlı rol düzenlemesinde son yazanın kazanması, `kullanicilar.ozel_rol_id`
  indekssiz sayım, adın veritabanında büyük/küçük harf duyarlı tekliği.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Çalışan olarak ekleme"** bu dosyayı en çok etkileyecek iş: kişi koduyla
  eklenen çalışan rolsüz gelir, müdür ona Öğretmen, özel rol ya da "Kodlayıcı" atar; müdür bir çalışanı "Müdür yap" ile
  onaysız müdür yapabilir (rol atama akışı genişler). "Paneller ve okul gezgini" işindeki birden çok müdür ve müdürün
  öğretmeni onaysız müdür yapması da rol verme kurallarına dokunacak.
