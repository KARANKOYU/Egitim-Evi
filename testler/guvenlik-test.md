# testler/guvenlik-test.js

Güvenlik başlıklarını, kayıttaki bot sorusunu, şifre kuralını, yol kaçışını, prototip kirlenmesini, giriş kilidini, veli kodu
deneme sınırını, girişteki koşullu bot sorusunu, iki adımlı girişi ve ön yüz parçalarının web'den okunamamasını gerçek
uçlardan deneyen 43 kontrollük sunuculu test paketi.

## Bu dosya ne yapar?

Sitenin güvenlik önlemleri birçok dosyaya dağılmıştır: başlıklar ve statik dosya kapısı [../sunucu/http.md](../sunucu/http.md)'de,
bot sorusu, kilitler ve iki adımlı giriş kodları [../sunucu/guvenlik.md](../sunucu/guvenlik.md)'de, kayıt ve giriş akışı
[../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md)'de, veli kodu sınırı [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md)'de.
Bu paket hepsini bir saldırganın gözünden, sırayla dener: başlıklar yerinde mi, bot sorusu atlanabiliyor mu, soru ikinci kez
kullanılabiliyor mu, zayıf şifre geçiyor mu, art arda yanlış şifre hesabı kilitliyor mu, kod cevapta sızıyor mu, aynı kod iki
kez kullanılabiliyor mu, öğrenci yönetici ucunu fark edebiliyor mu…

Bu önlemlerden biri bir düzeltme sırasında yanlışlıkla gevşerse (ör. bir başlık silinir, bot sorusu harcanmaz olur) bu paket
"KALDI" verir. `testler/tumtest.sh` onu sunuculu paketlerin **sonuncusu** olarak çalıştırır: sunucu 3200'de yeniden açılır
(`_test` veritabanı sıfırlanır, kilit ve hız sayaçları bellekte olduğu için onlar da sıfırlanır), [seed.md](seed.md) çalışır,
sonra bu paket.

## İçinde neler var?

### Yardımcılar

- `BASE` — `EE_BASE` ya da `http://localhost:3000` (ortak yardımcınınkiyle aynı kural, ayrı kopya).
- `iste(yol, method, body, token)` — [../araclar/giris.md](../araclar/giris.md)'deki `iste`'nin kopyası: HTTP hatasında
  fırlatmaz, `{ status, body, headers }` döner (başlıkları okumak için `headers` gerekir).
- `kontrol(ad, sart, detay)` — `  GECTI  <ad>` / `  KALDI  <ad>  -> <detay>`.
- `cevapla(soruMetni)` — `"3 + 4 = ?"` gibi bot sorusunu çözer. Soru bu kalıpta değilse `TypeError` ile paket çöker.
- Ortak yardımcıdan ([giris.md](giris.md)): `girisYap`, `sonKod`, `botCevabi`, `epostaOnayla`.

### Bölümler ve kontroller

| Bölüm | Ne dener | Beklenen | Sayı |
|---|---|---|---|
| 1) GUVENLIK BASLIKLARI | `GET /` cevabının başlıkları | `Content-Security-Policy` var, içinde `script-src 'self'` ve `frame-ancestors` geçiyor; `X-Frame-Options: DENY`; `X-Content-Type-Options: nosniff`; `Referrer-Policy` var | 6 |
| 2) BOT DOGRULAMASI | `POST /api/register` | soru cevabı yoksa 400; `GET /api/challenge` `id` ve `soru` veriyor, cevapta `cevap` sözcüğü yok; yanlış cevap (99999) 400; doğru cevapla kayıt 200 (sonra günlükteki anahtarla e-posta onayı); **aynı soruyla** ikinci kayıt 400 | 6 |
| 3) SIFRE POLITIKASI | kayıtta `abc` ve `sadeceharf` | ikisi de 400 | 2 |
| 4) YOL KACISI | `/../data/db.json`, `/..%2fdata%2fdb.json`, `/js/../../data/db.json`, `/../server.js` | gövdede `scryptAsync`, `"users"`, `sessions` yok | 4 |
| 5) PROTOTYPE POLLUTION | `POST /api/login` gövdesinde `"__proto__": { "kirlendi": true }` (`JSON.parse` ile, yani gerçekten gönderilir) | test sürecinde `{}.kirlendi` tanımsız | 1 |
| 6) KABA KUVVET KILIDI | `admin@egitimevi.com`'a bot cevaplı 8'e kadar yanlış şifre | bir noktada 429 (sunucuda 5 hatadan sonra; 6. denemede); kilitliyken **doğru** şifre de 429 | 2 |
| 7) NORMAL AKIS BOZULMADI | `ogrenci1@test.com` girer | oturum anahtarı geliyor; `/api/progress`'te tam **5** ödev; `GET /api/admin/overview` öğrenciye 404 `{"error":"Böyle bir adres yok"}` (403 değil); `sahtetoken123` ile `/api/progress` 401 | 4 |
| 8) VELI KODU KABA KUVVET | 2. bölümde açılan veli girer, 8 kez yanlış kodla `POST /api/parent/link` | 429 geliyor (hesap başına dakikada 5 deneme) | 1 |
| 8b) GIRISTE KOSULLU BOT DOGRULAMASI | `fen@test.com` | soru göndermeden doğru şifre 200 `twoFactor: true`; yanlış şifre 401 `soruGerekli: true`; artık sorusuz doğru şifre 400 `soruGerekli`; yanlış soru cevabı 400; doğru cevap 200 | 5 |
| 9) IKI ADIMLI GIRIS (2FA) | öğrenci ve `mat@test.com` | öğrenciye kod gitmiyor (doğrudan anahtar); öğretmende şifre doğruyken anahtar YOK, `twoFactor: true`; günlükteki son kod cevapta yok; `maskeliEposta` yıldızlı; `000000` 401; doğru kod anahtar veriyor; aynı kod ikinci kez 401; uydurma `challengeId` 401 | 8 |
| (9 devamı) parça kapısı | `/js/parcalar/06-menu.js`, `/CSS/Parcalar/00-temel.css`, `/js/./parcalar/01-yardimcilar.js`, `/js/x/../parcalar/01-yardimcilar.js`, `/js/app.js`, `/css/style.css` | parçalar 404 (büyük harfle de), birleşik `app.js` ve `style.css` 200 | 4 |

Toplam **43** kontrol. Sonunda `====` çizgileri arasında `  GECTI: N   KALDI: M`; bir kontrol kaldıysa çıkış 1. Beklenmeyen
hata: `TEST HATASI: <ileti> <yığın>`, çıkış 1.

## Kimle konuşur?

- **Çağırdıkları:** [giris.md](giris.md) üzerinden `araclar/giris.js` (`girisYap`, `sonKod`, `botCevabi`, `epostaOnayla`),
  genel `fetch`.
- **Sınadığı sunucu kodu:**

  | Konu | Nerede |
  |---|---|
  | `GUVENLIK_BASLIKLARI` (CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy: no-referrer`…), statik dosya kapısı, parçaların tek tek sunulmaması, birleşik `app.js`/`style.css` | [../sunucu/http.md](../sunucu/http.md) |
  | bot sorusu (`botCevapDogru`, tek kullanım), giriş kilidi (5 hata → 15 dk), koşullu soru, iki adımlı giriş kodları, `epostaMaskele` | [../sunucu/guvenlik.md](../sunucu/guvenlik.md) |
  | `register`, `challenge`, `login`, `login/dogrula`, `eposta-onay` uçları | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | şifre kuralı (`sifreSorunu`: yetişkinde en az 8 karakter, büyük ve küçük harf, rakam, özel karakter), gövde temizliği (`govdeTemizle`) | [../sunucu/ortak.md](../sunucu/ortak.md) |
  | veli kodu deneme sınırı (`cocukBagla`) | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | yönetici uçlarının yönetici olmayana "Böyle bir adres yok" demesi | [../sunucu/api.md](../sunucu/api.md) |
  | öğrencinin ödev listesi | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |

- **Ön koşulu:** [seed.md](seed.md) — `admin@egitimevi.com` (şifresi `EE_ADMIN_SIFRE`), `ogrenci1@test.com`, `fen@test.com`,
  `mat@test.com` ve `ogrenci1`'in **5** ödevi.
- **Onu çalıştıran:** `testler/tumtest.sh` (sunuculu paketler döngüsünün sonuncusu; çıktıdaki `GECTI: N` satırı toplama
  eklenir, satır yoksa "PAKET CALISMADI" sayılır).
- **Roller:** yönetici (yalnız kilit hedefi), öğrenci, öğretmen (`mat`, `fen`), paketin kendi açtığı rolsüz yetişkin → veli
  denemesi.

## Nasıl çalışır (adım adım)?

```
tumtest: sunucu (3200, _test sıfır, sayaçlar sıfır) ─► seed.js ─► guvenlik-test.js
  1) GET /  ─► başlıklar
  2) register: sorusuz ✗ · challenge ✓ · yanlış cevap ✗ · doğru ✓ (veli<zaman>@test.com, onay) · aynı soru ✗
  3) register: "abc" ✗ · "sadeceharf" ✗
  4) dört kaçış yolu ─► gövdede gizli veri işareti yok
  5) login gövdesinde __proto__
  6) admin'e yanlış şifreler ─► 429 ─► doğru şifre de 429
  7) ogrenci1: anahtar · 5 ödev · admin ucu 404 · sahte anahtar 401
  8) veli: 8 yanlış veli kodu ─► 429
  8b) fen: sorusuz giriş ✓ · yanlış şifre ─► artık soru şart · yanlış soru ✗ · doğru soru ✓
  9) öğrenci kodsuz · mat: kod günlükte, cevapta değil · yanlış/doğru/tekrar kod · uydurma kimlik
     parça dosyaları 404, birleşik dosyalar 200
  GECTI: 43   KALDI: 0
```

Elle (test sunucusu `tumtest.sh`'teki gibi 3200'de açık, çıktısı `testler/test-sunucu.log`'a giderken):

```
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/seed.js
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/guvenlik-test.js
```

## Dikkat!

- **Seed'e bağlı.** 7. bölüm `ogrenci1`'in tam 5 ödevini bekler; seed'e ödev eklersen ya da aynı veritabanında
  [debug-hazirlik.md](debug-hazirlik.md) gibi ödev ekleyen bir betik çalıştıysa "odevler geliyor (5 adet)" kalır.
- **Sıra önemli, paket bir kez çalışır.** 6. bölüm yöneticiyi bu bağlantıdan 15 dakika kilitler; 8b `fen` için soru şartını
  açar; 2. bölümün açtığı veli 8. bölümde kullanılır. Aynı sunucuda ikinci kez koşarsan kilitler ve sayaçlar hâlâ bellekte olduğu
  için sonuçlar değişebilir. `tumtest.sh` her paketten önce sunucuyu yeniden başlatır.
- **Yönetici kilitli kalır.** 6. bölümden sonra aynı sunucuda (aynı bağlantıdan) 15 dakika `admin@egitimevi.com` ile
  girilemez. Paketin kendisi sonra yöneticiyle girmediği için sorun değil.
- **4. bölümün işaretleri `server.js`'e uymuyor.** `"users"` JSON veri biçiminin anahtarıdır: hem eski `db.json`'da hem
  bugünkü `data/yedek/*.json` yedeklerinde geçer; `sessions` yalnız eski `db.json`'dadır (yedekler oturumları `oturumlar` adıyla
  yazar; [../sunucu/veri/json-aktarim.md](../sunucu/veri/json-aktarim.md), [../sunucu/veri/yedek.md](../sunucu/veri/yedek.md)).
  `scryptAsync` bugün yalnız `sunucu/sifre.js`'te geçer. Bugünkü `server.js` ise 4 satırlık bir kabuktur
  (`require('./sunucu/index.js')`) ve bu üçünden hiçbirini içermez (git geçmişinde de hiç içermedi: tek commit'i `commit 1`):
  sunucu `server.js`'i düz metin olarak verse bile bu kontrol geçerdi.
  Uygulama artık PostgreSQL kullanıyor; `db.json` yalnız eski düzenden kalmış bir kurulumda bulunur ve ilk açılışta içeri
  alınıp `db.json.tasindi` adını alır ([../sunucu/veri/index.md](../sunucu/veri/index.md), `baslat`). Yani hedeflenen
  `data/db.json` çoğu zaman diskte hiç yoktur; kaçış koruması bozulsa bile bu kontrol düşmezdi. Ayrıca `fetch` adresteki `..`
  parçalarını göndermeden çözer: `/../data/db.json` ve `/js/../../data/db.json` sunucuya `/data/db.json`, `/../server.js`
  `/server.js` olarak gider (`public/` içinde aranır, orada böyle dosya yok); ham `..` ile yalnız yüzde kodlu
  `/..%2fdata%2fdb.json` sınanır. `server.js` sızıntısını başka bir denetim de yakalamıyor:
  [girdi-denetimi.md](girdi-denetimi.md)'nin 3. bölümü `require(` işaretine bakar ama oradaki yolların hiçbiri projenin
  kökündeki `server.js`'e varmaz (ayrıntı o belgenin "Dikkat!"inde). Kod değiştirilmedi.
- **"Dolambaçlı yol" kontrolü de aynı nedenle boş.** `/js/./parcalar/01-yardimcilar.js` ve `/js/x/../parcalar/01-yardimcilar.js`
  istekleri `fetch` tarafından `/js/parcalar/01-yardimcilar.js`'e çevrilir (3 Ekim'de Node'un adres ayrıştırıcısıyla denendi);
  yani bu kontrol düz parça yolunu ikinci kez dener. Sunucunun büyük/küçük harf ve yol normalleştirmesini asıl sınayan
  `/CSS/Parcalar/00-temel.css` kontrolüdür.
- **Prototip kontrolü test sürecine bakar.** 5. bölüm `__proto__`'yu gerçekten gönderir (gövde `JSON.parse` ile kurulduğu için,
  girdi denetimindeki nesne yazımından farklı olarak), ama sonra **kendi** sürecinin `Object.prototype`'ına bakar; sunucuda
  kirlenme olsaydı bu kontrol onu göremezdi. Asıl koruma [../sunucu/ortak.md](../sunucu/ortak.md)'deki `govdeTemizle`.
- **Bazı adlar yanıltıcı.** "CSP frame-ancestors none" yalnız `frame-ancestors` sözcüğünün geçtiğine bakar (`'none'`'a değil);
  "mevcut kullanici 2FA ile giris yapabiliyor" öğrenciyle girer ve öğrenciye iki adımlı kod gitmez (9. bölüm bunu ayrıca
  doğrular). Kayıt gövdelerindeki `role: 'parent'` ve `city` sunucuda yok sayılır: kayıt her zaman rolsüz bir yetişkin açar.
- **`sonKod()` kişisiz çağrılır.** 9. bölüm "kod cevapta sızmıyor" için ve doğru kodu girmek için günlükteki **en son** kodu
  alır; `mat`'in girişinden hemen sonra çağrıldığı için doğru kod odur. Araya başka bir giriş girerse yanlış kodu dener.
- **Varsayılan adres 3000.** Hem bu dosyanın `BASE`'i hem ortak yardımcınınki `EE_BASE` verilmezse `http://localhost:3000`'e
  gider; orada (gerçek veritabanında) yöneticiyi 15 dakika kilitler ve yeni bir yetişkin hesabı açar. Her zaman
  `EE_BASE=http://localhost:3200`.
- `tumtest.sh` paket çıktısından yalnız `KALDI`/`HATASI` geçen ilk 8 satırı ve `GECTI:` satırını gösterir.

## Testleri

- Kendisi bir test paketi. Koruduğu dosyalar: [../sunucu/http.md](../sunucu/http.md), [../sunucu/guvenlik.md](../sunucu/guvenlik.md),
  [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md), [../sunucu/ortak.md](../sunucu/ortak.md) (`sifreSorunu`),
  [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md), [../sunucu/api.md](../sunucu/api.md) (yönetici uçlarının 404'ü).
  Aynı konuları daha ayrıntılı deneyenler: `testler/test-giris-kayit.js` (kayıt ve giriş), `testler/test-sifre.js` (şifre),
  `testler/test-admin-gizli.js` (gizli `/admin`, aynı 404, `.md` kapısı), `testler/test-adresler.js` (adresler, `%00`).
- 3 Ekim gecesi 3200'de yeni sıfırlanmış test veritabanında (seed'den sonra) koşuldu: **43 GECTI, 0 KALDI**, 2,4 saniye.
  Sunucu iş bitince kapatıldı.

## Son durum

- `git log`: 4 commit. `088f3f2 commit 28` (2026-08-28) ilk 28 satır (`BASE`, kopya `iste`, `kontrol`, `cevapla`);
  `ec4046b commit 282` (2026-09-25) 1–9. bölümlerin hepsi (o gün 7. bölümde öğrenci yönetici ucundan **403** bekleniyordu).
- `86af98a commit 506` (2026-09-26): 9. bölümün sonuna parça kapısı eklendi — parça dosyaları 404 (büyük harfle ve
  dolambaçlı yolla da), birleşik `app.js` ve `style.css` 200.
- `276c0a0 commit 521` (2026-09-27, gizli `/admin`): öğrencinin `GET /api/admin/overview` denemesinde 403 yerine 404 ve
  `"Böyle bir adres yok"` beklenir oldu (yorum: yönetici ucu yönetici olmayana bilinmeyen adres gibi görünür). O günden beri
  değişmedi.
- Bilinen açıklar (kod değiştirilmedi): 4. bölümün `server.js`'e uymayan işaretleri ve çoğu zaman diskte olmayan
  `data/db.json` hedefi, `fetch`'in çözdüğü `..` yolları, prototip kontrolünün istemci sürecine bakması.
- Planlı işlerden etkileyecekler: "T.C. kimlik no bütün hesaplarda zorunlu" (kod Linux'ta) — 2. ve 3. bölümdeki kayıtlar
  T.C. no göndermiyor; gövdelere geçerli bir T.C. (`tcUret`) eklenmezse "dogru cevapla kayit gecti" kalır, 3. bölümün de
  gerçekten şifre kuralını mı yoksa eksik T.C.'yi mi sınadığı sunucudaki denetim sırasına bağlı olur (bugün şifre T.C.'den önce
  denetleniyor). "Sistem" işindeki yöneticiye zorunlu TOTP — 6. bölümün hedefi yönetici; kilit davranışı aynı kalmalı.
  "Güvenlik denetimi" (IPv6 /64 anahtarı, okulun verdiği şifrede ilk girişte değiştirme) — 7. ve 9. bölümdeki öğrenci girişi
  şifre değiştirme ekranına düşebilir. "Çok dil" — sunucu iletileri istemcinin diline göre katalogdan verilecek; 7. bölüm
  `"Böyle bir adres yok"` metnini harfi harfine karşılaştırdığı için dil belirtmeyen isteğe Türkçe cevap dönmeye devam etmeli
  (dönmezse kontrol kalır). "Üst şerit sadeleştirme" yalnız arayüzü değiştirir, bu paketi etkilemez.
