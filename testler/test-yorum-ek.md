# testler/test-yorum-ek.js

İki ayrı özelliği tek pakette deneyen sunuculu test (38 denetim): açılış sayfasındaki yorumlar (kim yazar, ad kısaltma, uygunsuz kelime
ve bağlantı süzgeci, hesap başına tek yorum, yöneticinin gizlemesi, silme) ve mesaj/ödev ekleri (taslak yükleme, bağlama, kimin
indirebildiği, izinsiz uzantı, 50 MB sınırı, başkasının taslağı, bir mesajın toplam 50 MB'ı).

## Bu dosya ne yapar?

**Yorumlar.** Açılış sayfasının altında Eğitim Evi'ni kullananların 0–5 yıldızlı kısa yorumları durur
([../sunucu/bolumler/yorum.md](../sunucu/bolumler/yorum.md)). Yorumu yalnız gerçekten kullanan yetişkinler yazar (okulda öğretmen ya
da müdür rolü ya da bağlı çocuğu olan); adı tam görünmez ("Ayşe Kaya" → "Ay. Ka."); küfür ve reklam bağlantısı kabul edilmez; herkesin
tek yorumu olur; yönetici uygunsuz bir yorumu gizler.

**Ekler.** Öğretmen (ve müdür) ödeve, mesaj yazabilen herkes (öğrenci, veli, öğretmen, müdür, servisçi) mesajına dosya ekleyebilir
([../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md)). Dosya seçilir
seçilmez **taslak** olarak yüklenir (yalnız yükleyen görür), mesaj gönderilince ya da ödev kaydedilince ona bağlanır; sonra yalnız
mesajın alıcıları/göndereni ya da ödevi veren öğretmen, okulun müdürü, ödevin öğrencileri ve onların velileri indirebilir
(`ekler.js` `gorebilir`; bu paket öğretmen, öğrenci ve dışarıdaki öğrenciyi dener). İndirme tek kullanımlık, 60 saniyelik biletle
ve her zaman "ek" olarak (tarayıcı dosyayı açmaz) yapılır.

Dosyanın başındaki yorum maddeleri paketin kanıtladıklarını sayar: yorumu yalnız rolü ya da çocuğu olan yetişkin yazar; ad kısaltılır,
yıldız 0–5, uygunsuz kelime ve internet adresi reddedilir; hesap başına tek yorum, yönetici gizler; ek taslak yüklenir ve bağlanır,
alıcı ve ödevin öğrencisi indirir, başkası indiremez; ödeve eki yalnız öğretmen koyar; izinsiz uzantı ve 50 MB üstü reddedilir; başka
pencerede bırakılmış taslak yeni mesajın yüklemesini engellemez, bir mesaja 50 MB'tan fazlası kaydederken reddedilir; başkasının taslağı
bağlanamaz; indirme `attachment` ve `nosniff`'tir.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — `GECTI`/`KALDI` satırı. `J(x)` — 200 karakterlik JSON. `gun(n)` — bugünden `n` gün sonrası (UTC
  takvim günü). `MB` — 1024 × 1024.
- `ekYukle(token, tur, ad, veri)` — `POST /api/ek/yukle?tur=<tur>`; gövde dosyanın kendisi, `Content-Type: application/octet-stream`,
  `X-Dosya-Adi: encodeURIComponent(ad)`, varsa `Authorization`. Cevabı `{ status, body }` (JSON okunamazsa boş nesne).
- `indir(token, id)` — `GET /api/ek/bilet?id=` → `{ yol }`; bilet 200 değilse o cevap döner. Sonra `GET <yol>` (oturumsuz) →
  `{ status, headers, veri }` (veri bayt dizisi).
- `buyukBildir(token)` — Node'un `http` modülüyle `Content-Length: 62914560` (60 MB) BİLDİREN ama yalnız 1 KB gönderen bir yükleme
  başlatır, sunucunun cevabını bekleyip bağlantıyı keser. Sunucunun büyük dosyayı gövdeyi okumadan reddettiğini kanıtlar.
- Ortak yardımcılar [giris.md](giris.md) üzerinden: `BASE` (`EE_BASE` ya da 3000), `iste`, `girisYap`, `hesapAc`; Node'un `crypto`'su
  (4000 baytlık rastgele "PDF" içeriği).

### Hesaplar ve veriler

Sunucunun ilk sistem yöneticisi (`A`) ve seed'den ([seed.md](seed.md)): müdür (`M`, adı "Mehmet Demir" → "Me. De."), Matematik öğretmeni (`mat`, "Ayşe
Kaya" → "Ay. Ka."), öğrenciler `ogrenci1` (`o1`) ve `ogrenci2` (`o2`). Paketin açtıkları (`z = Date.now().toString(36)`): rolsüz
yetişkin "Rolsuz Yorumcu" (`yorumcu<z>`), "Ekli ödev <z>" (yalnız `o1`'e, son teslim 5 gün sonra), `o1`'in "Ödev sorusu <z>" mesajı;
dosyalar: `Çalışma kâğıdı.pdf` (rastgele 4000 bayt), `ek2.png` ("ikinci"), `soru.jpg` ("fotograf"), `baska.txt`, 26 MB ve 25 MB'lık
sıfır dolu `.mp4` taslakları.

### 1) Yorum: kim yazar (3)

- `GET /api/yorumlar` girişsiz açık: 200, `sayi` bir sayı.
- Öğrenci `POST /api/yorumlar` → 403.
- Rolü ve çocuğu olmayan yetişkin: `GET /api/yorumlar/benim` → `yazabilir: false`; `POST` → 403.

### 2) Yorum: yazma ve süzgeç (11)

- Öğretmen `benim` → `yazabilir: true`, `adKisa: 'Ay. Ka.'`, `rol` "Öğretmen" içerir.
- Hepsi 400: "Bu sistem SALAAAK işi" (büyük harf + uzatılmış kelime; iletide "uygun olmayan"); "tam bir a p t a l programı" (harf harf
  aralıklı); reddedilen yorum kaydedilmedi (`benim.yorum === null`); "www.reklam.com" (internet adresi); 6 yıldız; "ok" (çok kısa).
- "Sıkıntısız çalışıyor, ödevleri sık sık buradan veriyorum." → 200 ("sık", "sıkıntı" masum sayılır).
- Müdür 3 yıldızla yazar, sonra 4 yıldızla günceller: açılışta `sayi: 2`, `ortalama: 4.5` (güncelleme yeni satır açmaz).
- Açılış listesinde her yorumda `adKisa` var, `id` ve `hesapId` yok; birinde `adKisa: 'Me. De.'` ve `rol` "Müdür".

### 3) Yorum: yönetici gizler (3)

- Yönetici `GET /api/yorumlar/hepsi` ile müdürün yorumunun kimliğini bulur. Öğretmen `POST /api/yorumlar/gizle` → 404 (yönetici olmayana
  bu uç bilinmeyen adrestir).
- Yönetici `gizle { id, gizli: true }` → 200; açılışta `sayi: 1`, müdürün yorumu yok.
- Öğretmen `POST /api/yorumlar/sil` → 200; açılışta `sayi: 0`.

### 4) Ek: ödeve dosya (11)

- Öğrenci `tur=odev` yüklerse 403; öğretmen `virus.exe` yüklerse 415.
- `buyukBildir` (öğretmen, `tur=mesaj`, 60 MB bildirilmiş) → 413 ve iletide "50 MB": gövde okunmadan.
- Öğretmen `Çalışma kâğıdı.pdf`'yi taslak yükler → 200, `ek.id` 32 onaltılık. `o1` o taslağın biletini isterse 404 (taslağı yalnız
  yükleyen görür).
- `POST /api/assignments { title, description, startAt, endAt, studentIds: [o1], ekIdler: [taslak] }` → 200.
- `o1` `GET /api/progress`'te ödevin `ekler`'inde o dosya: ad aynı, `suresiDoldu: false`, `bitis` 6 günden ileride (dosya 7 gün durur).
- `o1` indirir: 200, içerik bayt bayt aynı, `Content-Disposition` `attachment`, `X-Content-Type-Options: nosniff`. Ödevde olmayan `o2`
  → 404.
- Öğretmen `GET /api/assignments/<id>` → `ekler` 1.
- Öğretmen `ek2.png`'yi taslak yükler; `POST /api/assignments/<id>/update { …, ekIdler: [yeni], ekSilIdler: [eski] }` → 200 ve ödevin tek
  eki `ek2.png`.

### 5) Ek: mesaja dosya (10)

- `o1` `soru.jpg`'yi mesaj taslağı olarak yükler (200). Alıcı olarak "Ayşe Kaya" `GET /api/mesajlar/hedefler`'den bulunur.
- `o1`, öğretmenin `baska.txt` taslağıyla mesaj göndermeye kalkarsa 400.
- `POST /api/mesajlar { tur: 'mesaj', konu, govde, hedef: { tur: 'kisi', kisiler: [öğretmen] }, ekIdler: [soru.jpg] }` → 200.
- Öğretmen `GET /api/mesajlar/<id>` → `ekler` 1, `soru.jpg`; indirir: içerik "fotograf". Mesajın dışındaki `o2` → 404.
- Aynı eki ikinci bir mesaja bağlamak → 400 (artık taslak değil).
- `o1` 26 MB ve 25 MB'lık iki taslak yükler: ikisi de 200 (yüklerken sınır kişinin bütün taslakları için 150 MB'tır, bir mesajın 50 MB'ı
  değil). İkisini tek mesaja bağlamak → 400, iletide "50 MB" (bir mesajın toplamı kaydederken denetlenir). Sonra iki taslak
  `POST /api/ek/sil` ile silinir.
- `GET /api/ek/indir?bilet=uydurma` → 410.

Sonunda boş satır ve `GECTI: 38   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md) (`BASE`, `iste`, `girisYap`, `hesapAc`); Node'un `http`, `crypto`'su ve yerleşik `fetch`'i.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/yorumlar`, `GET /api/yorumlar/benim`, `POST /api/yorumlar`, `POST /api/yorumlar/sil`, `GET /api/yorumlar/hepsi`, `POST /api/yorumlar/gizle` | yorumlar | [../sunucu/bolumler/yorum.md](../sunucu/bolumler/yorum.md) |
  | `POST /api/ek/yukle?tur=`, `GET /api/ek/bilet?id=`, `GET /api/ek/indir?bilet=`, `POST /api/ek/sil` | ekler | [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md) |
  | `GET /api/assignments/hedefler`, `POST /api/assignments`, `GET /api/assignments/<id>`, `POST /api/assignments/<id>/update` | ödev ve ekleri | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/progress` | öğrencinin ödev listesi | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `GET /api/mesajlar/hedefler`, `POST /api/mesajlar`, `GET /api/mesajlar/<id>` | mesaj ve ekleri | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `POST /api/register`, `POST /api/eposta-onay`, girişler | rolsüz yetişkin, oturumlar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/yorum.md](../sunucu/bolumler/yorum.md) — `yazarBilgisi` (öğretmen/müdür rolü ya da çocuk), `adKisalt`, yıldız
    0–5, en az 3 harf, `BAGLANTI`, uygunsuz kelimede ret, hesap başına tek yorum, açılış listesinin kimliksiz görünümü, `hepsi`/`gizle`/`sil`
    ve önbelleğin her yazmada boşaltılması; [../sunucu/veri/depo/yorumlar.md](../sunucu/veri/depo/yorumlar.md) — `yaz` (hesap başına
    tekil), `gorunenler` (gizliler hariç sayı ve ortalama).
  - [../sunucu/yardimci/kufur-suzgeci.md](../sunucu/yardimci/kufur-suzgeci.md) — `uygunsuzKelime`: büyük harf, harf uzatma, harf
    aralarına boşluk; "sık" ve "sıkıntı" gibi masum kelimelerin geçmesi.
  - [../sunucu/bolumler/ekler.md](../sunucu/bolumler/ekler.md) — `yukleyebilir` (ödeve yalnız öğretmen/müdür, `odev.ver`), `EK_SINIR`
    (gövde okunmadan 413), izinli uzantılar (415), `TASLAK_SINIR` (kişi başına 150 MB), `ekleriDogrula` (başkasının ve bağlanmış ekin
    reddi, bir hedefin toplam 50 MB'ı), `gorebilir`, bilet ve indirme; [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md) —
    paylaşılan `UZANTILAR`, `ekBasliklari` (`attachment`, `nosniff`), `biletVer`/`biletKullan`; [../sunucu/veri/depo/ekler.md](../sunucu/veri/depo/ekler.md).
  - [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) (`ekIdler`, `ekSilIdler`) ve [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md)
    (`ekIdler`) — bağlama; [../sunucu/api.md](../sunucu/api.md) — `yorumlar/hepsi` ve `yorumlar/gizle`'nin yönetici ucu sayılması (404).
- **Tablolar:** uçlar üzerinden `yorumlar`, `ekler`, `odevler`, `mesajlar`, `mesaj_alicilari`, `islem_kaydi` (reddedilen yorum
  `yorum.reddedildi`, gizleme `yorum.gizlendi` olarak yazılır; paket bunlara bakmaz). Disk: `testler/testdata/ekler/`.
- **Ön yüz** (bu pakette tarayıcı yok): açılış sayfasındaki yorumlar [../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md),
  yorum yazma Ayarlar'da [../public/js/parcalar/23-veli-ayarlar.md](../public/js/parcalar/23-veli-ayarlar.md), yöneticinin Yorumlar
  ekranı [../public/js/yonetim/09-yonetici.md](../public/js/yonetim/09-yonetici.md); ek kutusu ve indirme
  [../public/js/parcalar/04d-ekler.md](../public/js/parcalar/04d-ekler.md), mesajlar [../public/js/parcalar/19-mesajlar.md](../public/js/parcalar/19-mesajlar.md),
  öğretmenin ödevi [../public/js/parcalar/11-ogretmen-odev.md](../public/js/parcalar/11-ogretmen-odev.md), öğrencinin ödev ayrıntısı
  [../public/js/parcalar/14-odev-filtre.md](../public/js/parcalar/14-odev-filtre.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paketlerde `test-okul-sayfasi`'ndan sonra, `test-nakil`'den önce (sıfırlanmış
  veritabanı + seed). Ek ortam değişkeni almaz.

## Nasıl çalışır (adım adım)?

```
A, M, mat, o1, o2 girer
1) GET /yorumlar (girişsiz) ; öğrenci 403 ; rolsüz yetişkin: yazabilir=false, 403
2) mat: süzgeç (küfür, aralıklı, bağlantı, 6★, kısa) 400 ─► masum metin 200 ; M: yaz + güncelle ─► 2 yorum, ort. 4,5
3) A: hepsi ─► mat gizle 404 ─► A gizle ─► 1 yorum ─► mat sil ─► 0
4) ek: öğrenci ödeve 403, .exe 415, 60 MB 413 ─► taslak ─► başkası 404
      ödev ver (ekIdler) ─► o1 görür, indirir (attachment, nosniff) ; o2 404 ─► update: ek değiştir
5) o1: soru.jpg ─► başkasının taslağıyla 400 ─► mesaj gönder ─► alıcı görür, indirir ; o2 404 ; ikinci mesaja 400
      26 MB + 25 MB taslak 200 ─► tek mesaja 400 (50 MB) ─► sil ; uydurma bilet 410
```

## Dikkat!

- **Aynı veritabanında ikinci koşu düşer.** 3 Ekim'de 3200'de sıfırlamadan ikinci kez koşuldu: `GECTI: 33   KALDI: 5`. Nedenleri:
  (1) yorum yazma hesap başına saatte 10 kez sınırlı (bellekte) — öğretmen bir koşuda 6 kez `POST` eder, ikinci koşuda "çok kısa yorum"
  ve "öğretmen yorum yazdı" 429 alır; (2) ilk koşuda gizlenen müdür yorumu gizli kalır (güncelleme `gizli`'ye dokunmaz), bu yüzden
  açılış listesi denetimleri boş liste görür. Elle koşarken sunucuyu sıfırla.
- **`buyukBildir` sunucunun gövdeyi okumadan cevap vermesine yaslanır.** İstek 60 MB bildirip 1 KB gönderir ve paket cevabı
  kendi zaman aşımı OLMADAN bekler; `tumtest.sh` da paket başına zaman aşımı koymaz. Sunucu bir gün sınırı gövdeyi okumaya başladıktan
  sonra denetlerse paket sunucunun kendi sınırlarına kalır: bugünkü yükleme kodu 60 saniye veri gelmeyince keser (`odev-dosya.js`
  `BOSTA_MS`, 408), isteğin tamamının sınırı 65 dakikadır (`sunucu/index.js` `requestTimeout`). Yani paket en iyi ihtimalle bir dakika
  bekleyip 413 yerine 408 ile `KALDI` verir, okuma başka bir yoldan yapılırsa çok daha uzun takılır (koddan; denenmedi). Böyle bir
  değişiklikte bu yardımcıya süre sınırı ekle.
- **Bölüm adı ile istek türü.** 60 MB denemesi "4) Ek: ödeve dosya" bölümünde ama `tur=mesaj` ile yapılır; iki türün dosya sınırı aynı
  (`EK_SINIR`) olduğu için sonuç değişmez. Ödeve eki "yalnız öğretmen koyar" denir; sunucuda kural "öğretmen ya da müdür, `odev.ver`
  yetkisiyle"dir.
- **Gereksiz bir istek.** 4. bölümdeki `GET /api/assignments/hedefler` cevabı (`hedefler`) hiç kullanılmaz; ödev doğrudan `o1`'in
  kimliğiyle verilir.
- **"biletsiz indirme yok" aslında "uydurma bilet".** Denetim `bilet=uydurma` gönderir ve 410 bekler (değişkenin adı da yazım hatalı:
  `bilgesiz`). Hiç bilet vermeden istek de aynı yoldan 410 alır.
- **Bellekte büyük tampon.** 5. bölüm 26 MB ve 25 MB'lık tamponları bellekte üretip yükler; okulun disk sınırına sayılırlar. Okul disk
  sınırı küçük bir sunucuda (ör. `EE_OKUL_DOSYA_GB=0.001` ile açılmış) bu yüklemeler 507 alır; bu paketi o değişkenle açılmış
  sunucuda koşma (`tumtest.sh` o değişkeni yalnız `test-okul-disk`'e verir).
- **Seed adlarına bağlı.** Ad kısaltma denetimleri "Ay. Ka." ve "Me. De."yi, mesaj alıcısı "Ayşe Kaya"yı arar; seed'deki adlar
  değişirse bu denetimler de değişmeli.
- **Kalan dosyalar.** Öğretmenin `baska.txt` taslağı bağlanmadan kalır (bağlanmayan taslağı sunucu 6 saatte siler). Ödev
  düzeltilirken `ekSilIdler` ile kaldırılan `Çalışma kâğıdı.pdf`'nin yalnız KAYDI silinir; dosyası `testdata/ekler/`'de kalır ve
  sunucunun saatlik süpürmesi (`ekSupur`: kaydı olmayan, 2 saatten eski dosya) onu sonra siler. Belge denetimindeki koşudan hemen
  sonra `testdata/ekler/`'de 4 dosya vardı: kabul edilen 6 yüklemeden `ek/sil` ile diskten de silinen iki büyük taslak dışındakiler,
  yani kaydı silinmiş `Çalışma kâğıdı.pdf` de diskte duruyordu (sayıma göre; diskteki adlar rastgele olduğu için tek tek eşlenmedi).
  `tumtest.sh` sonraki paketten önce `testdata`'yı zaten siler.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler 3000'deki sunucuna gider; her zaman sıfırlanmış test sunucusunu ver.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: [test-odev-dosya.md](test-odev-dosya.md)
  (öğrencinin teslim dosyaları ve mesaj ekinin de en çok 50 MB olması), [test-okul-disk.md](test-okul-disk.md) (eklerin okulun disk
  sınırına sayılması, dolunca 507), [test-ozellikler.md](test-ozellikler.md) (ödev bölümü kapalıyken `tur=odev` yüklemesi 403),
  [test-resim-kucult.md](test-resim-kucult.md) (sunucusuz, başsız Edge'de: ek kutusunun resmi tarayıcıda küçültüp küçülmüş dosyayı
  yeni adıyla göndermesi), [test-mesaj.md](test-mesaj.md) (mesajlaşmanın kendisi), [yetki-denetimi.md](yetki-denetimi.md)
  (`yorumlar/hepsi` yalnız yöneticiye) ve [test-admin-gizli.md](test-admin-gizli.md) (`yorumlar/hepsi` ve `yorumlar/gizle`
  yönetici olmayan herkese bilinmeyen adresle aynı cevap).
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test` ve [seed.md](seed.md) ile açık olmalı:

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-yorum-ek.js
  ```

  Tarayıcıda: öğretmenle Ayarlar'dan yorum yaz, açılış sayfasında "Ay. Ka." adıyla görünmeli; içine bir web adresi koyunca reddedilmeli.
  Öğretmenle ekli ödev ver, öğrenciyle "İndir"e bas: dosya inmeli, tarayıcıda açılmamalı.
- 3 Ekim 2026'da bu belge için 3200'de (sıfırlanmış `egitimevi_test`, seed) koşuldu: `GECTI: 38   KALDI: 0`, yaklaşık 1 saniye; sunucu
  günlüğünde `API hatası` ya da `Veritabanı hatası` yoktu. Aynı sunucuda hemen ikinci koşu 33/5 ("Dikkat!"). Belge denetiminde (aynı gün)
  yeniden koşuldu: 38/0 (~2 sn), ardından 33/5 — düşen beş denetim "çok kısa yorum", "öğretmen yorum yazdı" (ikisi de "Yorumunu çok sık
  değiştirdin", 429), "hesap başına tek yorum", "açılışta ad kısaltması var" ve "gizlenen yorum açılışta görünmüyor" (açılış listesi boş).

## Son durum

- `git log`: 4 commit. Son üçü:
  - `566b917 commit 524` (2026-09-27, canlı hazırlık) — ek sınırı 150 MB'tan 50 MB'a indi: büyük dosya denemesi 160 MB yerine 60 MB
    bildirir ve iletide "50 MB" arar; "başka pencerede 26 MB taslak varken yeni mesaja 25 MB eklenebiliyor" ve "bir mesaja toplam 50 MB
    üstü ek bağlanamıyor (kaydederken)" denetimleri eklendi (eskiden kişinin bütün taslakları 50 MB'a sayılıyordu); dosya başı yorumu
    buna göre güncellendi.
  - `276c0a0 commit 521` (2026-09-27, gizli `/admin`) — yönetici olmayanın `yorumlar/gizle` isteğinde 403 yerine 404 bekleniyor.
  - `3295948 commit 417` (2026-09-26) — paketin gövdesi (128 satır): yorum ve ek bölümlerinin hepsi.
- Dosyanın ilk hâli `e038265 commit 412` (2026-09-26; 48 satır).
- Açık iş yok; kod değiştirilmedi. Zayıf noktalar (ikinci koşu, zaman aşımsız büyük istek) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Mesaj ayarları (çark) …"** — tanım: mesaja dosya ekleyebilenler öğretmen ve müdür her zaman, öğrenciler VARSAYILAN KAPALI,
    veliler varsayılan açık. 5. bölümdeki bütün yüklemeler öğrenciyle (`o1`) yapılıyor; kural gelince paket ya ayarı açmalı ya da bu
    adımları izinli bir rolle yapmalı.
  - **"Sunucuda küçültme … aynı dosya tek kopya"** — tanıma göre sunucu 1,5 MB üstü ya da büyük boyutlu JPEG/PNG'yi arka planda küçültecek
    ve aynı içerikli dosyaları tek kopya tutacak. Bu paketin resimleri birkaç baytlık sahte içeriklerdir ve indirilen içerik yüklenenle
    karşılaştırılır; etkisinin küçük olması beklenir (tanımdan çıkarım), ama tek kopyada `POST /api/ek/sil`'in dosyayı son başvuru
    gidince silmesi yeni bir kural olur.
  - **"Paneller /panel/admin …"** — Yorumlar ekranı `/panel/admin`'e taşınacak; uçlar değişirse 3. bölüm de değişir.
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — rolsüz yorumcu `hesapAc` ile T.C.'siz açılıyor.
  - **"Sistem: yöneticiye ZORUNLU TOTP"** — 3. bölümdeki yönetici girişi değişir.
