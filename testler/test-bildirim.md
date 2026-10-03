# testler/test-bildirim.js

Bildirimlerin fazladan gitmediğini (aynı olay yeniden kaydedilince tekrar gitmez, yalnız değişen kişiye gider), bildirim
yoklamasının değişiklik yokken listeyi göndermediğini ve öğrencinin bildirimlerinin velisine çocuğun adıyla tek kopya
gittiğini deneyen sunuculu test paketi (27 denetim).

## Bu dosya ne yapar?

Öğretmen bir ödevi sonuçlandırıp sonra küçük bir düzeltme için yeniden kaydedince, öğrencinin telefonuna aynı "ödevin
açıklandı" bildirimi ikinci kez düşmemeli; sınav notunu düzeltince "sınav sonucun açıklandı" yeniden gelmemeli; yoklamayı
tekrar kaydedince devamsızlık bildirimi çoğalmamalı; müdür programa otuz ders saati eklerken öğretmen otuz bildirim
almamalı. Velinin tarafında da kural var: öğrencinin her bildiriminin bir kopyası onaylı velisine gider, başında hangi
çocuk olduğu yazar ("Zeynep Şahin · …"); iki çocuğa aynı şey gidiyorsa veliye tek bildirim gider ("Zeynep Şahin, Burak
Öztürk · …"); devamsızlık gibi veliye zaten kendi metniyle ("Çocuğunuz … gelmedi") gidenler ikinci kez kopyalanmaz.

Bu paket bütün bunları sırayla dener. Kuralların asıl yeri:
[../sunucu/veri/depo/genel.md](../sunucu/veri/depo/genel.md) (veli kopyaları ve "ilk kez mi" anahtarları),
[../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) (sonuçlandırma), [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md)
(not girişi), [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) (yoklama),
[../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) (ders programı) ve
[../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) (bildirim kutusu ve sürüm).

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı.
- `gun(n)` — bugünden `n` gün sonrası: yerel tarihe gün eklenir, sonra `toISOString` ile yazılır (UTC günü;
  "Dikkat!"e bak).
- `sayi(token, parca)` — kişinin `GET /api/notifications` listesinde metni `parca`'yı İÇEREN bildirim sayısı (alt dize
  araması; liste en çok son 100 bildirimdir).

Ortak yardımcılar [giris.md](giris.md) üzerinden: `iste`, `girisYap`, `hesapAc`.

### Hazırlık

Seed hesaplarıyla giriş ([seed.md](seed.md)): müdür (`M`), Matematik öğretmeni Ayşe Kaya (`O`), öğrenciler Zeynep Şahin
(`S1`, `s1`) ve Burak Öztürk (`S2`, `s2`); öğrencilerin `/api/me` bilgisi (kimlik, ad, veli kodu).

### 1) Ödev sonucu yalnız değişene (7 denetim)

- Öğretmen iki öğrenciye "Bildirim deneme ödevi"ni verir (`POST /api/assignments`, bugün → 3 gün sonra). `S1`'de bu ödevi
  anan tam bir bildirim var.
- İlk sonuçlandırma (`POST /api/assignments/<id>/finish`, `s1: yapti`, `s2: gec`) → `bildirilen: 2`. `S2`'nin bildirimi
  ders, ödev ve sonucu yazıyor: `… dersinden "Bildirim deneme ödevi" ödevi açıklandı: Geç yaptı` (satır sonunda).
- Aynı sonuçlar yeniden → `bildirilen: 0`.
- Yalnız `s2` değişir (`gec` → `yapti`) → `bildirilen: 1`. `S1`'de tam bir "… ödevi açıklandı" var; `S2`'de tam bir
  "… ödevi sonucu değişti: Yaptı" var.

### 2) Sınav notu yalnız ilk girişte (3 denetim)

- Öğretmen "Bildirim deneme sınavı"nı açar (`POST /api/exams`, yalnız ad; hazır "Yazılı" ölçümüyle). `s1`'e 80 girer →
  `S1`'de tam bir "… sınavının sonucu" bildirimi.
- `s1`'in notu `85,5` (virgüllü) olarak düzeltilir → bildirim sayısı hâlâ 1.
- `s2` için aynı değer iki biçimde birden gelir: `grades: { s2: '70' }` ve `degerler: { s2: { P: '75' } }` (P, ana ölçümün
  kodu) → 200 ve sınavın öğrenci listesinde `s2`'nin notu **75** (sonra gelen yazılmış, hata yok).

### 3) Yoklama yalnız değişene (5 denetim)

- `GET /api/devamsizlik/derslerim` (öğretmen) → en az bir ders var; ilki alınır (seed'de 6-A Matematik).
- Dünün tarihiyle (`gun(-1)`) `POST /api/devamsizlik/yoklama`: `s1` durumu verilir, `s2` hep `var`. Ölçü, `S1`'in
  bildirimlerinde "<ders> dersi" geçenlerin sayısı; başlangıç sayısı (`once`) önce alınır.
  - `s1: yok` → +1 (devamsızlık bildirildi).
  - Aynısı yeniden → yine +1 (yeni bildirim yok).
  - `s1: gec` → +2 (durum değişti, yeni bildirim).
  - Tek öğrencilik `POST /api/devamsizlik/isaretle` ile aynı `gec` → yine +2 (aynı durum bildirilmiyor).

### 4) Ders programı: öğretmene günde bir (1 denetim)

Müdür okulun ilk sınıfının (`GET /api/school/classes` → 6-A) programına (`GET /api/school/schedule?classId=`) Matematik
dersinden Cumartesi (gün 6) üç ders saati ekler (`POST /api/school/schedule-add`, 08:00–08:40, 08:50–09:30,
09:40–10:20). Öğretmendeki "Ders programına yeni ders saatlerin eklendi" bildirimi başlangıca göre **en fazla bir** artmış
olmalı.

### 5) Bildirim yoklaması (4 denetim)

- `GET /api/notifications` (`S1`) → `notifications` dizisi ve `surum`.
- Aynı `surum` ile yeniden → `{ ayni: true }`, liste yok, cevabın JSON'u 120 karakterden kısa (açık her sekmenin düzenli
  yoklaması küçük kalsın; site, sitenin `bildirimAralikDk` ayarıyla — varsayılan 5 dakika, yönetici 1–30 arası seçer —
  yoklar, bkz. [../public/js/parcalar/24-bildirim-arama-mobil.md](../public/js/parcalar/24-bildirim-arama-mobil.md)).
- `POST /api/notifications/read` (hepsini okundu yap) → eski `surum`'la istek artık `ayni` değil ve `unread: 0`.

### 6) Veliye çocuğun adıyla (7 denetim)

- `bveli<zaman>` adlı yeni bir yetişkin hesabı açılır, iki öğrencinin veli koduyla ikisine de bağlanır (`V`).
- Öğretmen iki öğrenciye "Veli kopyası ödevi"ni verir. Velide **tam bir** bildirim:
  `Zeynep Şahin, Burak Öztürk · Yeni ödev: Veli kopyası ödevi (Matematik)` (adlar `studentIds` sırasıyla) ve bu ödevi anan
  başka "Yeni ödev" bildirimi yok.
- Yalnız `s1`'e sonuç (`yapti`) → velide `Zeynep Şahin · … dersinden "Veli kopyası ödevi" ödevi açıklandı: Yaptı`,
  bağlantısı `#/veli-odevler?c=<s1 kimliği>` (veli dokununca o çocuğun ödevleri açılır); Burak'ın adıyla sonuç bildirimi
  yok.
- İki gün önceki tarih ve `saat: '10:10'` ile yoklama (`s1: yok`, `s2: var`) → velinin bildirim sayısı tam **bir** artmış
  ve en yenisi `Çocuğunuz …` ile başlıyor (veliye kendi metni gitti, ayrıca "Zeynep Şahin · …" kopyası gitmedi).
- `S1`'in kendi bildirimlerinde "Veli kopyası ödevi" geçen tam 2 bildirim var (yeni ödev + sonuç).
- Velinin " · " içeren hiçbir bildirimi bu iki çocuğun adlarından başka bir adla başlamıyor.

Sonunda boş bir satır ve `GECTI: N   KALDI: M` (başında iki boşluk yok; `tumtest.sh` `GECTI: [0-9]+` aradığı için fark
etmez); `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile hata nesnesinin tamamını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `POST /api/assignments`, `POST /api/assignments/<id>/finish` | ödev ve sonuç bildirimleri | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `POST /api/exams`, `POST /api/exams/<id>/grades`, `GET /api/exams/<id>` | sınav notu bildirimi | [../sunucu/bolumler/sinav.md](../sunucu/bolumler/sinav.md) |
  | `GET /api/devamsizlik/derslerim`, `POST /api/devamsizlik/yoklama`, `POST /api/devamsizlik/isaretle` | yoklama bildirimi | [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md) |
  | `GET /api/school/classes`, `GET /api/school/schedule`, `POST /api/school/schedule-add` | öğretmene günde bir program bildirimi | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/notifications`, `GET /api/notifications?surum=`, `POST /api/notifications/read` | bildirim kutusu | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/parent/link` | veliyi iki çocuğa bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/me`, `POST /api/register`, `POST /api/eposta-onay`, giriş uçları | hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu iç kurallar:** `depo.genel.veliKopyalari` (çocuğun adı, birleşik tek bildirim, `#/veli-…?c=` bağlantısı),
  `cokluBildir(…, { veliye: false })` (devamsızlıkta ikinci kopya yok), `ilkKezOlanlar` (sınav ve program bildiriminin
  bir kez gitmesi; `hatirlatmalar` tablosu), `bildirimSurumu` — hepsi
  [../sunucu/veri/depo/genel.md](../sunucu/veri/depo/genel.md).
- **Tablolar** (dolaylı): `bildirimler`, `hatirlatmalar`, `odevler`, `odev_ogrencileri`, `sinavlar`, `sinav_olcumleri`,
  `sinav_degerleri`, `devamsizlik`, `ders_programi`, `veli_baglari`, `kullanicilar`.
- **Ön yüz:** bildirim kutusunu yoklayan [../public/js/parcalar/24-bildirim-arama-mobil.md](../public/js/parcalar/24-bildirim-arama-mobil.md)
  (`?surum=` ile); bu pakette doğrudan denenmez.
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-sinav`'dan sonra, `test-giris-kayit`'ten
  önce); önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
hazırlık: M, O, S1, S2 girer ; s1, s2 = /api/me
1) O: ödev (s1, s2) ─► S1'de 1 bildirim
   finish {s1: yapti, s2: gec} ─► 2 ; aynısı ─► 0 ; {s2: yapti} ─► 1   ("açıklandı" / "sonucu değişti")
2) O: sınav ─► s1 80 ─► 1 bildirim ; 85,5 ─► yine 1 ; s2: grades 70 + degerler P 75 ─► not 75
3) once = S1'de "<ders> dersi" sayısı
   yoklama(s1 yok) +1 ; yine yok +1 ; gec +2 ; isaretle(gec) +2
4) M: Cumartesi'ye 3 ders saati ─► O'da "Ders programına…" ≤ önce + 1
5) notifications ─► surum ; ?surum=aynı ─► {ayni:true} (<120 harf) ; read ─► eski surum farklı, unread 0
6) V = yeni yetişkin + iki çocuğa bağlan
   ödev (s1, s2) ─► V: "Zeynep Şahin, Burak Öztürk · Yeni ödev: …" (tek)
   finish {s1: yapti} ─► V: "Zeynep Şahin · … açıklandı: Yaptı" (#/veli-odevler?c=s1), Burak'ın adıyla yok
   yoklama (2 gün önce, 10:10; s1 yok) ─► V: +1, en yenisi "Çocuğunuz …"
   S1: "Veli kopyası ödevi" 2 tane ; V: başka çocuğun adıyla bildirim yok
```

## Dikkat!

- **Ders programı denetimi zayıf.** "En fazla bir" (`<= programOnce + 1`) diye yazılmış: bildirim HİÇ gitmese de geçer.
  Yani "günde bir" kuralının fazlası denetleniyor, eksiği (öğretmene hiç haber gitmemesi) değil. Ayrıca sunucudaki "gün"
  anahtarı UTC günüdür (`new Date().toISOString()`), Türkiye günü değil. (Kod okumasına göre; kod değiştirilmedi.)
- **"Öğrencinin kendi bildirimi değişmedi (adsız)" adsızlığı denetlemiyor.** Yalnız `S1`'de "Veli kopyası ödevi" geçen
  bildirimlerin 2 olduğuna bakar; öğrencinin bildirimine yanlışlıkla çocuk adı eklense de geçer.
- **Yoklama sayımı alt dizeyle yapılır.** "<ders> dersi" (ör. "Matematik dersi"), 1. ve 2. bölümün "Matematik dersinden …"
  bildirimlerini de yakalar; bu yüzden mutlak sayıya değil başlangıçtaki sayıya (`once`) göre fark ölçülür. 3. bölüm
  sırasında "Matematik dersi" içeren başka bir bildirim gelirse sayım şaşar.
- **Velinin birleşik bildirimindeki ad sırası `studentIds` sırasıdır** (`[s1, s2]` → "Zeynep Şahin, Burak Öztürk").
  Sunucu ödev bildirimini istekteki sırayla gönderdiği için böyle; bu sırayı değiştirirsen beklenen metin de değişir.
- **"En yenisi" varsayımı:** 6. bölümde `vl[0]`'ın yeni gelen devamsızlık bildirimi olduğu varsayılır; liste yeniden eskiye
  sıralı gelir. Sıralama değişirse bu denetim kalır.
- **Tarihler UTC gününe göre:** `gun()` yerel tarihe gün ekleyip `toISOString` ile yazar; Türkiye'de gece 00:00–03:00
  arasında bütün tarihler bir gün geri kayar. Yoklama tarihleri yine geçmişte kaldığı ve ödev tarihleri göreli olduğu için
  bugün etkilenmiyor; ama "ileri tarihe yoklama alınamaz" kuralına yakın bir tarih kullanılırsa (ör. `gun(0)`) gece
  yarısından sonra sonuç değişebilir.
- **Seed'e bağlı:** öğretmenin yoklama alabildiği ilk ders (`dersler[0]`) ve okulun ilk sınıfı (`siniflar[0]`) seed'in
  6-A Matematik'idir; öğrenci adları seed'deki gibidir. Seed'e sınıf ya da ders eklersen hangi dersin seçildiği değişebilir
  ([seed.md](seed.md)).
- **Liste en çok 100 bildirim.** `sayi` sunucunun döndürdüğü son 100 bildirime bakar; bu paketteki sayılar bunun çok
  altında.
- **Koddaki "30 saniyede bir" yorumu eskimiş.** `sunucu/bolumler/kayit.js`'teki `GET /api/notifications` yorumu "30
  saniyede bir yoklanır" der; ön yüz `276c0a0 commit 521`'den beri sitenin `bildirimAralikDk` ayarıyla (varsayılan 5
  dakika) yoklar. Bu paket aralığa bakmaz, yalnız "değişmeyen kutuya küçük cevap" kuralını dener. (Kod değiştirilmedi.)
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda ödev, sınav, yoklama ve hesap açar; her
  zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: `testler/test-veli-coklu.js`
  (veli bağları: öğretmen/müdür aynı zamanda veli, okulun veli bağlaması), `testler/test-push.js` (sunucusuz: telefon
  bildirimi şifrelemesi), `testler/test-sinav.js` ve `testler/test-devamsizlik.js` (bildirimi üreten özelliklerin
  kendileri).
- Elle (Git Bash, proje kökünde; 3200'de seed'lenmiş test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-bildirim.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 27   KALDI: 0`, yaklaşık 3
  saniye; sunucu günlüğünde `API hatası` yok.

## Son durum

- `git log`: 5 commit.
  - `30eed5b commit 501` (2026-09-26): 6. bölümün ilk denetimi değişti — eskiden velinin iki çocuğa giden aynı ödev için
    iki ayrı bildirim ("Zeynep Şahin · Yeni ödev: …" ve "Burak Öztürk · Yeni ödev: …") alması bekleniyordu; artık TEK
    bildirim, başında iki çocuğun adı ("Zeynep Şahin, Burak Öztürk · …") ve bu ödevi anan başka bildirim yok. Aynı commit
    `sunucu/veri/depo/genel.js`'teki `veliKopyalari`'na birleştirmeyi ekledi (KVKK metni ve kılavuz da güncellendi).
  - `a77770a commit 283` (2026-09-25): paketin gövdesi eklendi (1–6. bölümler, 115 satır).
  - `5f90fe8 commit 254`, `4d82fd6 commit 253`, `d3c7711 commit 252` (2026-09-25): sırasıyla `sayi` yardımcısı,
    `kontrol` ve `gun`, dosya başı yorumu ve `require`.
- Açık iş: "Dikkat!"teki iki zayıf denetim (program bildiriminin hiç gitmemesini yakalamaması, "adsız" denetiminin adsızlığa
  bakmaması). Kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Mesaj ayarları … bildirim paneli sekmeler hâlinde"** — bildirim kutusunun biçimi (sekmeler) değişirse
    `/api/notifications` cevabı ve `surum` mantığı gözden geçirilmeli.
  - **"Optimizasyon + saklama süreleri"** — bildirimlerin 90 gün saklanması; bu paket yeni bildirimlerle çalıştığı için
    etkilenmez ama `sayi`'nın baktığı liste kuralı değişirse uyarlanmalı.
  - **"Tek kişi tek hesap + portallar öğrencide de"** — bildirimde kurum adı yazılacak; veli kopyalarının metni (ör.
    "Zeynep Şahin · …") ve bu paketin aradığı tam metinler değişecek.
  - **"Ödev hatırlatma otomasyonu"** ("Mesaj ayarları … Ajanda" işi) — yeni otomatik bildirimler; 1. bölümün "tam bir
    bildirim" sayımları ödevle aynı metni içeren hatırlatmalardan etkilenebilir.
