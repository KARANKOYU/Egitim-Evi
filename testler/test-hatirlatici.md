# testler/test-hatirlatici.js

Kişisel hatırlatıcı uçlarını (`/api/hatirlaticilar`) öğrenci, öğretmen, müdür ve rolsüz yetişkinle deneyen sunuculu paket:
kurma, doğrulama, yalnız sahibinin görmesi, düzenle/durdur/sil ve kişi başına 50 sınırı (22 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nde herkes kendine hatırlatıcı kurabilir: öğrenci "her pazartesi ve çarşamba 07:30: beden eğitimi kıyafeti", veli
"ayın 1'i: servis ücreti", öğretmen "cuma 16:00: sınav kâğıtları". Hatırlatıcı kişisel bir nottur; başkası görmemeli,
değiştirmemeli, silmemeli. Bu paket bunu gerçek uçlar üzerinden, sıfırlanmış test veritabanında dener: dört sıklık türünün
kurulması ve sunucunun hesapladığı "sonraki hatırlatma" anı, bozuk girdilerin 400 alması (500 değil), sahiplik, düzenleme,
durdurup yeniden başlatma, silme ve kişi başına en çok 50 hatırlatıcı.

Saf zaman hesabı ayrı ve sunucusuz bir pakette denenir: [test-hatirlatici-zaman.md](test-hatirlatici-zaman.md). Bu paket
o hesabın sunucuya doğru bağlandığını (Türkiye saatiyle `sonraki`) uç düzeyinde görür.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (220 harflik JSON, hata satırı için).
- `yarin()` — Türkiye'de yarının tarihi: `Date.now() + 3 saat + 1 gün`'ün UTC günü (sunucudaki gibi sabit +3).
- `z` — `Date.now().toString(36)`: bu koşuya özgü ek (yeni yetişkinin adı için).
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`.

### Hesaplar

Seed'den ([seed.md](seed.md)): `ogrenci1@test.com` (`o1`), `ogrenci2@test.com` (`o2`), `mat@test.com` (`mat`, Matematik
öğretmeni), `mudur@test.com` (`M`), hepsi `Test1234!`. Paketin açtığı: `hveli<z>` — "Hatırlatıcı Veli" adlı **rolsüz
yetişkin** hesabı (`hesapAc`: kayıt + e-posta onayı; adı veli ama hiçbir çocuğa bağlanmaz), kullanıcı adıyla girer.

### 1) Kurma (7)

- `GET /api/hatirlaticilar` (öğrenci): 200, `hatirlaticilar` dizi, `sinir === 50`.
- `o1` haftalık kurar (`baslik: 'Beden eğitimi kıyafeti'`, açıklama, `siklik: 'her-hafta'`, `gunler: [1, 3]`, `saat: '07:30'`):
  200, `gunler` `[1,3]`, `sonraki` dolu.
- O `sonraki` anına 3 saat eklenince günü pazartesi ya da çarşamba, saati `07:30` (Türkiye).
- Bir kez (`tarih: yarin()`, `15:00`): 200, `tarih` yarın.
- Her gün 21:00 ve ayda bir (`ayGunu: 31`, 09:00): ikisi de 200, `ayGunu === 31`.
- `mat` haftalık (cuma 16:00) ve `M` bir kezlik (yarın 10:00): ikisi de 200.
- Rolsüz yetişkin ayda bir (`ayGunu: 1`, 10:00): 200 — rolü olmayan hesap da kurabiliyor.

### 2) Denetimler (7) — hepsi `o1` ile, hepsi 400 beklenir

| Gönderilen | Sunucunun cevabı |
|---|---|
| `baslik: ' '` | "Başlık yaz." |
| haftalık, `gunler: []` | "Haftanın en az bir gününü seç." (test `/gün/` arar) |
| haftalık, `gunler: [8, 0, 'a']` | aynı ileti: geçersizler süzülünce liste boş kalır |
| `saat: '25:61'` | "Saati seç (ör. 08:30)." |
| bir kez, `tarih: '2020-01-01'` | "Bu gün ve saat geçti; ileri bir zaman seç." (test `/geçti/` arar) |
| ayda bir, `ayGunu: 32` | "Ayın kaçında hatırlatılacağını seç (1-31)." |
| `baslik: { a: 1 }` (nesne) | "Başlık yaz." — `clean` nesneyi boş metne çevirir; amaç 500 değil 400 almak |

### 3) Yalnız sahibi (3)

- `o1`'in listesinde tam 4 hatırlatıcı (1. bölümde kurduğu dört).
- `o2`'nin listesinde `o1`'in "Kitap oku"su yok.
- `o2` `o1`'in haftalığını düzeltmeye (`POST /api/hatirlaticilar/<id>`) ve silmeye (`…/<id>/sil`), `mat` da silmeye kalkar: üçü
  de 404 ("Hatırlatıcı bulunamadı" — başkasınınki "yok" sayılır).

### 4) Düzenle, durdur, sil (4)

- Düzenle: `gunler: [2, 4]`, `saat: '07:45'`, boş açıklama → 200, yeni günler ve saat.
- `…/<id>/durum { aktif: false }` → `aktif === false`, `sonraki` boş.
- `{ aktif: true }` → yeniden başladı, `sonraki` dolu.
- Her gün hatırlatıcısı silinir → 200, listede 3 kalır.

### 5) Sınır (1)

`o2` 49 hatırlatıcı kurar (49'uncusu 200), 50'nci de 200, 51'inci 400 ve iletide `50` geçiyor ("En fazla 50 hatırlatıcı
kurabilirsin; kullanmadığını sil.").

Toplam 7 + 7 + 3 + 4 + 1 = 22. Sonunda `GECTI: 22   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile
yığını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`): `iste`, `girisYap`, `hesapAc`.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/hatirlaticilar`, `POST /api/hatirlaticilar`, `POST /api/hatirlaticilar/<id>`, `POST …/<id>/durum`, `POST …/<id>/sil` | denenen bölüm | [../sunucu/bolumler/hatirlatici.md](../sunucu/bolumler/hatirlatici.md) |
  | `GET /api/challenge`, `POST /api/login`, `POST /api/login/dogrula`, `POST /api/register`, `POST /api/eposta-onay` | giriş ve rolsüz yetişkinin kaydı | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** `sunucu/bolumler/hatirlatici.js` (`dogrula`, `gorunum`, `uclar`); `sunucu/veri/depo/hatirlaticilar.js`
  ([../sunucu/veri/depo/hatirlaticilar.md](../sunucu/veri/depo/hatirlaticilar.md): `kisinin`, `bul`, `sayisi`, `ekle`,
  `guncelle`, `aktifYaz`, `sil`); `sonraki` hesabı için [../sunucu/yardimci/hatirlatici-zaman.md](../sunucu/yardimci/hatirlatici-zaman.md);
  rolsüz yetişkinin bu bölüme girebilmesi için `sunucu/api.js`'teki `ROLSUZ_SERBEST` listesi ([../sunucu/api.md](../sunucu/api.md));
  nesne gövdeyi boş metne çeviren `clean` ([../sunucu/ortak.md](../sunucu/ortak.md)).
- **Tablolar:** `hatirlaticilar`, `hatirlatici_gunleri` (şema 024, [../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md));
  dolaylı `kullanicilar`, `eposta_onaylari`, `oturumlar`.
- **Ön yüz** (bu pakette tarayıcı yok): aynı uçları kullanan [../public/js/parcalar/19h-hatirlaticilar.md](../public/js/parcalar/19h-hatirlaticilar.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde `test-ozellikler`'den sonra, `test-siniflarim`'den önce;
  her paketten önce `testler/testdata` sıfırlanır, [test-ayarlari.md](test-ayarlari.md) ayarı yazar, sunucu boş
  `egitimevi_test` ile açılır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
o1, o2, mat, M girer (seed hesapları)
1) o1: GET liste ─► haftalık / bir kez / her gün / ayda bir kurar ─► sonraki anı Türkiye saatiyle denetlenir
   mat ve M birer tane kurar ; hesapAc(hveli<z>) ─► rolsüz yetişkin kurar
2) o1: 7 bozuk gövde ─► hepsi 400
3) o1 listesi 4 ; o2 göremez ; o2 düzeltemez/silemez, mat silemez ─► 404
4) o1: düzenle ─► durdur (sonraki yok) ─► başlat (sonraki var) ─► her günü sil (3 kaldı)
5) o2: 49 + 1 = 50 kurar ─► 51'inci 400 "En fazla 50…"
```

## Dikkat!

- **Taze veritabanı ister.** Beklentiler sayılara bağlı: `o1`'in listesinde tam 4, silmeden sonra tam 3, `o2`'nin 50'yi yeni
  doldurması. Aynı veritabanında ikinci koşuda `o1`'de önceki koşudan 3 hatırlatıcı kalır ve `o2` zaten 50'dedir. 3 Ekim'de
  denendi: ikinci koşu `GECTI: 19   KALDI: 3` verdi — 3. bölümde liste 7, 4. bölümde silmeden sonra 6 kaldı (3 beklenir),
  5. bölümde 49'uncu ve 50'nci kayıt da 400 aldı. `tumtest.sh` her paketten önce veritabanını sıfırladığı için orada sorun yok.
- **Hız sınırı bellekte.** Listeden sonraki her istek (reddedilenler dahil) kişi başına saatte 120'ye sayılır; bu paket
  `o1` ile 15, `o2` ile 53 istek yapar. Aynı sunucuyu yeniden başlatmadan art arda koşarsan sayaçlar birikir, üçüncü koşuda
  `o2` 429 alır.
- **Başlıktaki "veli" aslında rolsüz yetişkin.** Dosya başı yorumu "öğrenci, öğretmen, müdür, veli ve rolsüz yetişkin" der;
  denenen hesap hiçbir çocuğa bağlanmaz. Çocuğu bağlı veli rolü ve servisçi bu pakette denenmez.
- **Geçersiz günler sessizce atılır.** `[8, 0, 'a']` hepsi süzülünce boş kaldığı için reddedilir; ama `[1, 8]` gibi karışık
  bir liste 8'i atıp yalnız pazartesiyle kaydedilir (koddan; test denemez).
- **50 sınırı kilitsiz.** Uç önce sayar (`sayisi`), sonra ekler; ikisi aynı işlemde değil. Aynı kişiden aynı anda gelen iki
  istek 51'e çıkabilir (koddan çıkarım; paket istekleri sırayla gönderir, denenmedi). Sınır `me.id` başına: okul rolüyle
  girmiş bir öğretmenin rol satırı ile yetişkin hesabı ayrı sayılır.
- **Dakikalık gönderim denenmez.** Zamanı gelen hatırlatıcıya bildirim yazan `hatirlaticilariGonder` bu pakette (ve
  `testler/` altında hiçbir yerde) çağrılmaz; yalnız uçlar denenir.
- **Hata metnine bağlı.** `/gün/`, `/geçti/`, `/50/` düzenli ifadeleri sunucunun Türkçe iletilerini arar; iletiler
  değişirse test kalır.
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan istekler kendi (gerçek veritabanlı) sunucuna gider ve orada
  öğrencilere hatırlatıcı açar; her zaman 3200'deki test sunucusunu kullan.
- **Günlüğe bağlı.** Öğretmen, müdür ve yetişkin girişindeki iki adımlı kod ve kayıt onay anahtarı `EE_LOG`'daki sunucu
  günlüğünden okunur ([giris.md](giris.md)); öğrenci girişi tek adımdır.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi sıfırlanmış `egitimevi_test` ile açılmış ve [seed.md](seed.md)
  ile tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-hatirlatici.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le çalıştırıldı (belgenin denetiminde bir kez
  daha): `GECTI: 22   KALDI: 0`, çıkış 0, yaklaşık 1,5 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok.
  Aynı veritabanında ikinci koşunun sonucu "Dikkat!"te.
- Saf zaman hesabı: [test-hatirlatici-zaman.md](test-hatirlatici-zaman.md).

## Son durum

- `git log`: tek commit. Dosya `6f68597 commit 438` (2026-09-26) ile 100 satır olarak, [test-hatirlatici-zaman.md](test-hatirlatici-zaman.md)
  ve ön yüzdeki `19h-hatirlaticilar.js`'in eylemleri (yeni, düzenle, kaydet, durdur/başlat, sil) ile birlikte eklendi; o günden
  beri değişmedi. Test ettiği bölüm (`sunucu/bolumler/hatirlatici.js`) bir önceki commit'te (`630d9f2 commit 437`, aynı gün)
  geldi, o da değişmedi.
- Bilinen açıklar (kod değiştirilmedi): kilitsiz 50 sınırı, karışık gün listesinin sessizce süzülmesi, dakikalık gönderimin
  hiçbir testte denenmemesi.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `hesapAc` ile açılan rolsüz yetişkin T.C. no'suz
    kaydolamayacak; paket `hveli<z>` kaydına T.C. eklemeli.
  - **"Mesaj ayarları (çark), … Ajanda, … duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu"** — duyurudan
    hatırlatıcı kurma bu uçlara bağlanacak; yeni yol buraya eklenmeli. Tanıma göre duyurudan düşen hatırlatıcılar ayrı bir
    türdür ve kişi başı 50 sınırına sayılmaz; 5. bölümün sınır beklentisi bu ayrımı da sınamalı.
  - **"Optimizasyon + saklama süreleri"** — dakikalık döngüyü ve saklama süresini değiştirirse gönderim için ayrı bir test
    yazmanın zamanı.
  - **"Çok dil"** — hata iletileri katalogdan gelirse `/gün/`, `/geçti/`, `/50/` aramaları gözden geçirilmeli.
