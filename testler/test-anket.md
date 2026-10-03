# testler/test-anket.js

Okul anketlerini (açma yetkisi, hedef, tek oy, oyu değiştirme/geri alma, sonuçların kime ne zaman açıldığı, gizli anket,
kapatma ve silme) ve duyurunun "kim okudu" bilgisini gerçek uçlardan deneyen sunuculu test paketi (40 denetim).

## Bu dosya ne yapar?

Müdür (ya da toplu mesaj yetkisi verilmiş bir öğretmen) okula, bir rol grubuna ya da sınıflara tek soruluk bir anket
açar: "Gezi hangi gün olsun? Pazartesi / Salı". Hedefteki öğrenciler ve onların velileri bitişe kadar bir oy verir,
değiştirebilir ya da geri alabilir; anketi yöneten sonuçları her an görür, hedefteki kişiler anket bitince görür; "gizli"
ankette kimin neyi seçtiği hiç gönderilmez. Sunucu tarafı [../sunucu/bolumler/anket.md](../sunucu/bolumler/anket.md).

Aynı paket, anketlerle aynı "duyuru" hedef çözümünü kullanan bir komşu özelliği de dener: duyuruyu gönderen kimin ne
zaman okuduğunu tam listeyle görür, alıcı göremez ([../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md)).

Dosya başı yorumu sözünü şöyle özetliyor: anketi yalnız toplu mesaj yetkisi olan açar; hedef açılışta çözülür; hedefte
olmayan, kapanmış ankete ya da başka anketin seçeneğine oy yazılmaz; kişi başına tek oy (değiştirilebilir, geri
alınabilir); sonuç yöneten için her an, oy veren için anket bitince; gizli ankette seçim gitmez; duyurunun okundu listesi
yalnız gönderene.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (180 harflik JSON).
- `gun(n)` — bugünden `n` gün sonrası, `YYYY-AA-GG` (`toISOString`, yani UTC takvim günü).

Ortak yardımcılar [giris.md](giris.md) üzerinden: `iste`, `girisYap`, `hesapAc`, `mudurYap`.

### Hazırlık

- Seed hesaplarıyla giriş ([seed.md](seed.md)): müdür (`M`), öğrenciler `ogrenci1` (Zeynep Şahin, `o1`) ve `ogrenci2`
  (Burak Öztürk, `o2`), öğretmenler `mat` ve `fen` (kullanıcı adıyla giriş). Okulun `6-A` sınıfı
  `GET /api/school/classes`'tan bulunur.
- Sistem yöneticisi (`A`) de girer; yalnız 3. bölümde ikinci okulu açmak için. Bu hesap seed'in değil, test sunucusunun
  açılışta `EE_ADMIN_SIFRE` ile kurduğu ilk yöneticidir ([../sunucu/veri/index.md](../sunucu/veri/index.md) → `baslat`).
- `anketveli<zaman>` adlı yeni bir yetişkin hesabı açılır, Zeynep'in veli koduyla ona bağlanır → "Anket Veli". Anket
  hedefi açılışta dondurulduğu için veli anket açılmadan ÖNCE bağlanır.

### 1) Anket açma (8 denetim)

Temel gövde: soru "Gezi hangi gün olsun?", seçenekler `['Pazartesi', 'Salı', ' pazartesi ']`, hedef
`{ tur: 'sinif', siniflar: [6-A] }`, bitiş `gun(3)` saat 17:00.

- Yetkisiz öğretmen (`mat`; `mesaj.toplu` yok) → 403. Öğrenci → 403.
- Seçenekler `['Evet', 'evet']` → 400 (Türkçe küçük harfe göre aynı; en az iki farklı seçenek gerekir).
- Bitiş `gun(-1)` → 400 (geçmiş); `gun(120)` → 400 (en çok 90 gün).
- Hedef `{ tur: 'kisi', kisiler: [...] }` → 400 (anket kişi seçimiyle açılmaz).
- Temel gövdeyle müdür açar → 200, `hedefSayisi: 3` (6-A'nın iki öğrencisi + Zeynep'in velisi; ' pazartesi ' tekrar
  sayılmaz).
- Aynı hedefle **gizli** ikinci anket ("Servis saati", `07:30` / `08:00`, `gizli: true`) → 200.

### 2) Oy (15 denetim)

- `GET /api/anketler` (`o1`): anket `gelen` listesinde, açık, iki seçenek, `sayimlar` yok (açıkken sayılar gelmez);
  `yonetilen` boş, `olusturabilir: false`.
- `o1` birinci ankete ikinci anketin seçeneğiyle oy verir → 400. Hedefte olmayan `fen` öğretmeni oy verir → 403.
- `o1` önce Pazartesi, sonra Salı → ikisi de 200; listede `benimOyum` Salı. Anket açıkken `o1` sonucu isteyince 403.
- Veli Salı'ya oy verir → 200. `o2` Pazartesi'ye oy verir, sonra `secenekId: ''` ile geri alır → 200.
- Müdürün sonucu (`GET /api/anketler/sonuc?id=`): Salı **2**, Pazartesi 0 (`o2`'nin geri alınan oyu sayılmaz). Katılım
  listesinde "Anket Veli" `oyVerdi`, seçimi Salı, `cocuklar` içinde "Zeynep Şahin"; "Burak Öztürk" `oyVerdi: false`,
  `sinif: '6-A'`.
- Gizli anket: `o1` oy verir; müdürün sonucunda katılımda en az bir `oyVerdi` var ama HERKESİN `secim`'i `''` ve `tarih`'i
  `null`; anket açıkken `sayimlar: null` (sık bakıp yeni oyla artan seçeneği eşleştirmek kimin neyi seçtiğini ele
  verirdi). Müdür gizli anketi kapatınca sayılar açılıyor: seçilen seçenekte 1.

### 3) Yönetim (7 denetim)

- Yönetici ikinci bir okul açıp yeni bir hesabı müdürü yapar (`hesapAc` + `mudurYap`: "Anket Okulu <zaman>", Ankara /
  Mamak). Bu başka okulun müdürü birinci anketin sonucunu göremez, kapatamaz → ikisi de 403.
- Öğrenci anketi silemez → 403.
- Müdür birinci anketi kapatır → 200. `o2` artık oy veremez → 400, iletide "kapandı".
- `o1`'in listesinde anket `acik: false` ve `sayimlar` geliyor (Salı 2). `o1` sonucu isteyince 200 ama `katilim` YOK.
- Müdür gizli anketi siler → 200; `o1`'in listesinden düşmüş.

### 4) Duyuru okundu bilgisi (10 denetim)

- Müdür 6-A'ya duyuru gönderir (`POST /api/mesajlar`, `tur: 'duyuru'`, konu "Veli toplantısı <zaman>") → 200.
- Müdürün "Gönderilenler"inde (`GET /api/mesajlar?kutu=giden`) `kisiSayisi: 3`, `okuyanSayisi: 0`.
- `o1` ve veli duyuruyu açar (`GET /api/mesajlar/<id>` okundu yazar) → `okuyanSayisi: 2`.
- `GET /api/mesajlar/okuma?id=` (müdür): Zeynep'in okuma zamanı var ve sınıfı `6-A`; Burak'ın okuma zamanı yok; velinin
  `cocuklar[0]` "Zeynep Şahin" ve okuma zamanı var; cevabın hiçbir yerinde `"id"`, `email`, `eposta`, `telefon` geçmiyor.
- Öğrenci aynı listeyi isteyince 403.
- Müdürün tek mesaj cevabında `okumaGorur: true`, `okuyanSayisi: 2`, `kisiSayisi: 3`, `alicilar` YOK (adlar ayrı uçtan);
  öğrencinin (`o2`) tek mesaj cevabında `okumaGorur` yok.

Sonunda boş bir satır ve `GECTI: N   KALDI: M` (öbür paketlerden farklı olarak başında iki boşluk yok; `tumtest.sh`
`GECTI: [0-9]+` aradığı için fark etmez); `KALDI` varsa çıkış kodu 1. Beklenmeyen hata `TEST HATASI:` ile hata nesnesinin
tamamını yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/anketler`, `POST /api/anketler`, `POST /api/anketler/oy`, `POST /api/anketler/kapat`, `POST /api/anketler/sil`, `GET /api/anketler/sonuc` | anketin bütün yaşamı | [../sunucu/bolumler/anket.md](../sunucu/bolumler/anket.md) |
  | `POST /api/mesajlar`, `GET /api/mesajlar?kutu=giden`, `GET /api/mesajlar/<id>`, `GET /api/mesajlar/okuma` | duyuru ve okundu bilgisi | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `GET /api/school/classes` | 6-A'nın kimliği | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `POST /api/parent/link` | veliyi çocuğa bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `POST /api/admin/okul-ac` (`mudurYap` içinde) | ikinci okul ve müdürü | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /api/me`, `POST /api/register`, `POST /api/eposta-onay`, giriş uçları | hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Hedefin çözümü:** anket hedefi mesajlardaki duyuru kuralıyla (`mesajAlicilariCoz(…, 'duyuru')`) çözülür: öğrencilere
  giden anket onaylı velilerine de gider; açan kişi çıkarılır. Yetki: `mesaj.toplu` (rol, sınıf), `mesaj.herkese` (okul)
  — [../sunucu/yetki.md](../sunucu/yetki.md).
- **Tablolar** (dolaylı, şema 006): `anketler`, `anket_secenekleri`, `anket_hedefleri`, `anket_oylari`
  ([../sunucu/veri/depo/anketler.md](../sunucu/veri/depo/anketler.md)); duyuru için mesaj tabloları
  ([../sunucu/veri/depo/mesajlar.md](../sunucu/veri/depo/mesajlar.md)); `bildirimler`, `veli_baglari`.
- **Ön yüz:** [../public/js/parcalar/19b-anketler.md](../public/js/parcalar/19b-anketler.md) (anket listesi, oy, sonuç,
  yeni anket) ve [../public/js/parcalar/19-mesajlar.md](../public/js/parcalar/19-mesajlar.md) (okuma listesi); bu
  pakette doğrudan denenmezler, aynı uçları çağırırlar.
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-giris-bilgisi`'nden sonra,
  `test-okul-hayati`'ndan önce); önce sıfırlanmış veritabanı ve [seed.md](seed.md).

## Nasıl çalışır (adım adım)?

```
hazırlık: M, A, o1, o2, mat, fen girer ; 6-A ; "Anket Veli" açılır + Zeynep'e bağlanır
1) mat / o1 açamaz (403) ; aynı seçenek, geçmiş/çok uzun bitiş, kişi hedefi → 400
   M açar: hedefSayisi 3 ; gizli ikinci anket
2) o1 görür (sayı yok) ; yanlış seçenek 400 ; fen 403 ; o1 Pzt→Salı ; erken sonuç 403
   veli Salı ; o2 Pzt → geri al
   M sonuç: Salı 2, Pzt 0 ; katılım (veli + çocuğu, Burak oy vermemiş)
   gizli: o1 oy ─► M: secim '' / tarih null / sayimlar null ─► kapat ─► sayımlar açılır
3) başka okulun müdürü (A ile açılır): sonuç/kapat 403 ; o1 silemez 403
   M kapatır ─► o2 oy 400 "kapandı" ; o1: sayımlar var, katılım yok ; M gizli anketi siler
4) M duyuru (6-A) ─► giden: 0/3 ─► o1 ve veli açar ─► 2/3
   okuma listesi (zaman, sınıf, çocuklar; kimlik/iletişim yok) ; öğrenci 403
   M detay: okumaGorur, 2, 3 ; o2 detay: okumaGorur yok
```

## Dikkat!

- **Veli anketten önce bağlanmalı.** Anketin hedefi açılışta çözülüp dondurulur; veli bağlantısı anket açıldıktan sonra
  yapılsaydı `hedefSayisi` 2 olur ve velinin oyu 403 alırdı. Hazırlık adımlarının sırasını değiştirme.
- **Seed'e sıkı bağlı:** 6-A'da tam iki öğrenci (Zeynep Şahin, Burak Öztürk) ve o sınıfa bağlı başka veli olmaması
  (`hedefSayisi === 3`, `kisiSayisi === 3`); `mat`'ın `mesaj.toplu` yetkisinin olmaması; `fen`'in hedefte olmaması.
  Seed'e öğrenci ya da veli eklersen bu sayılar değişir ([seed.md](seed.md)).
- **Yorumla kod arasındaki küçük fark bu pakette görünmez:** sunucu bitmiş anketin sayılarını hedefteki HERKESE açar (oy
  vermemiş olsa da; bkz. [../sunucu/bolumler/anket.md](../sunucu/bolumler/anket.md) "Dikkat!"). Bu paketteki "bitince oy
  verene sonuç açıldı" denetimi yalnız oy vermiş `o1`'e bakar; oy vermemiş bir hedef kişinin sayıları görüp görmediği
  denenmiyor.
- **Bitiş saati sunucunun yerel saatidir.** `gun(3)` UTC günü verir ama ileri tarih olduğu için sorun çıkmaz; `gun(-1)`
  her saatte geçmişte kalır. Sunucu Türkiye saatinde değilse bile bu paketin bitiş denetimleri etkilenmez (5 dakika–90 gün
  arası geniş).
- **Gizlilik denetimi "en az bir oy var" şartına bağlı.** `secim === ''` ve `tarih === null` kuralının boş geçmemesi için
  önce `o1` gizli ankete oy verir; o adımı kaldırırsan denetim anlamını yitirir (yine geçer).
- **`listede kimlik ya da iletişim bilgisi yok` denetimi metin aramasıdır** (`"id"`, `email`, `eposta`, `telefon`). Okuma
  listesine bu sözcükleri içeren yeni bir alan adı eklenirse (sızıntı olmasa da) kalır; tersine, başka adla eklenen bir
  kimlik alanını yakalamaz.
- Paket her koşuda iki yetişkin hesabı ve bir okul açar (adlar zaman damgalı); `tumtest.sh` her paketten önce veritabanını
  sıfırladığı için birikmez.
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda anket, duyuru, hesap ve okul açar; her zaman
  test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı alanda: `testler/test-mesaj.js`
  (mesaj ve duyuru kuralları), `testler/test-yedek.js` (gizli anket ve oyu yedekten geri gelir, sayılar yine gizli),
  `testler/test-servis-konum.js` (servisçi `/api/anketler`'e giremez), [yetki-denetimi.md](yetki-denetimi.md). Okulun
  "Anketler" bölümünü kapatması (`ozellikKapali: 'anket'`) bugün hiçbir pakette denenmiyor (`testler/` altında grep, 3
  Ekim).
- Elle (Git Bash, proje kökünde; 3200'de seed'lenmiş test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-anket.js
  ```

- 3 Ekim sabahı bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu: `GECTI: 40   KALDI: 0`, yaklaşık 3
  saniye; sunucu günlüğünde `API hatası` yok.

## Son durum

- `git log`: tek commit. Dosya `c4cc6b7 commit 300` (2026-09-26) ile 153 satır olarak eklendi (aynı commit ön yüzün
  `19b-anketler.js` parçasına ve `26-anket-okul-hayati.css`'e eklemeler yaptı); o günden beri değişmedi.
- Açık iş yok; kapsam boşluğu: oy vermemiş hedef kişinin bitmiş anketin sayılarını görmesi denenmiyor (yukarıda).
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Anket düzenleyici"** (kullanıcı onayladı) — anket tek sorudan çok soruluya geçecek (tek/çoklu seçim, açılır liste,
    kısa/uzun yanıt, zorunlu soru, taslağı kaydetme, ödeve ya da mesaja ek). `POST /api/anketler`'in gövdesi ve oy ucu
    değişeceği için bu paketin 1–3. bölümleri yeniden yazılmalı; gizlilik ve "sonuç bitince" kuralları her soru için
    korunmalı. Öneri 2–5 (doldurmayanlara hatırlatma, veli onay formu, anketi kopyalama, koşullu soru) kullanıcının
    kararını bekliyor.
  - **"Düzenleyiciler"** — ileri tarihli gönderim ("şu gün şu saatte gönder") anketlere de gelecek; açılış zamanı yeni bir
    durum olacak.
  - **"Mesaj ayarları … Ajanda … duyurudan ajanda + hatırlatıcı"** ve **"Mesaj etiketleri"** — 4. bölümün duyuru ve
    okundu uçlarına dokunabilir.
  - **"Optimizasyon + saklama süreleri"** — anket ve mesaj saklama süreleri.
