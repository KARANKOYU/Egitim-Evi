# testler/test-okul-hayati.js

Okulun gündelik hayatını (`/api/yemek`, `/api/servis`, `/api/kulupler`) müdür, iki öğretmen, iki öğrenci, bir veli ve başka
bir okulun müdürüyle deneyen sunuculu paket: kim görür, kim düzenler, şoför telefonu kime gider, başka okul neye dokunamaz,
kulüp kontenjanı aynı anda gelen isteklerde de aşılmıyor mu (42 denetim).

## Bu dosya ne yapar?

[../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) üç konuyu tek dosyada toplar; bu paket de üç bölümde
onların değişmez kurallarını dener:

- **Yemek listesi:** okuldaki herkes (veli de çocuğunun okulununkini) haftalık menüyü görür; yalnız müdür ya da `yemek.yonet`
  yetkili öğretmen yazar. Menü satırları temizlenir, hafta pazartesiden başlar, boş menü o günü siler.
- **Servis:** şoför telefonu kişisel veridir; yalnız o servisteki öğrenciye, velisine ve yönetime gider. Başka bir okul bizim
  servisimize öğrenci yazamaz, onu silemez; kendi servisine bizim öğrencimizi de yazamaz. Bir öğrenci tek bir serviste olur.
- **Kulüpler:** kontenjan aynı anda gelen iki "katıl" isteğinde de aşılmaz; başvuru kapalıyken öğrenci ne katılır ne ayrılır;
  üye listesini yalnız yönetim ve kulübün danışmanı görür; `kulup.yonet` yetkisi öğretmene kulüp açtırır.

Paket sıfırlanmış test veritabanında seed'in okulunu kullanır; kendisi bir veli, ikinci bir okul ve özel bir rol kurar.

## İçinde neler var?

### Yardımcılar ve hesaplar

- `kontrol(ad, sart, detay)`; `J(x)` — `JSON.stringify(x).slice(0, 180)` (yalnız ayrıntı satırında).
- `pazartesi(n)` — bu haftanın pazartesisi (`n` verilirse ondan `n` gün sonrası), `YYYY-AA-GG`. Bugünü
  `new Date().toISOString()` ile, yani UTC günüyle bulur; yorumu "sunucunun hesabıyla aynı" der (sunucunun yemek listesi de
  UTC günüyle hesaplar, "Dikkat!"e bak).
- `z` — `Date.now()` (milisaniye sayısı): paketin açtığı adların eki.
- **Seed hesapları** ([seed.md](seed.md)): müdür `mudur@test.com` (`M`), yönetici `admin@egitimevi.com` (`A`, şifresi
  `EE_ADMIN_SIFRE`), öğrenciler `ogrenci1` (`o1`) ve `ogrenci2` (`o2`), öğretmenler `mat` ve `fen` (bu paket kullanıcı adıyla
  girer). Kulüp denetimleri seed'deki adları arar: Matematik öğretmeni "Ayşe Kaya", `ogrenci1` "Zeynep Şahin".
- **Paketin açtıkları** (şifreler `Test1234!`): veli `hayatveli<z>` — `hesapAc` ile açılır, `POST /api/parent/link
  { code: <o1'in kodu> }` ile `o1`'e bağlanır; ikinci müdür `hayat.mudur<z>` (`M2`) — yönetici "Hayat Okulu <z>"
  (Ankara / Mamak) okulunu açıp onu müdür yapar (`mudurYap`).
- Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `iste`, `girisYap`, `hesapAc`,
  `mudurYap`.

### 1) Yemek listesi (10)

| Deneme | Beklenen |
|---|---|
| `o1` `GET /api/yemek` | 200; `okullar` tek okul, `duzenleyebilir: false`, `bas` bu haftanın pazartesisi |
| `o1` ve `mat` (yetkisiz öğretmen) `POST /api/yemek` | ikisi de 403 |
| `M` iki gün yazar: pazartesi `"Mercimek çorbası\n\n  Tavuk sote \nPilav\n"` (`kalori: '650'`), salı "Makarna" | 200 |
| `o1` `GET /api/yemek?bas=<salı>` | `bas` yine pazartesi; iki gün; menü `"Mercimek çorbası\nTavuk sote\nPilav"` (boş satır ve uç boşluklar gitti), `kalori` sayı `650` |
| veli `GET /api/yemek` | 200; tek okul (çocuğununki), iki gün, `duzenleyebilir: false` |
| `M2` `GET /api/yemek` | 200; kendi okulunun listesi boş (bizim menümüz yok) |
| `M` salıyı boş menüyle yazar, `o1` bakar | tek gün kaldı (boş menü günü siler) |
| `M` `{ tarih: '2026-13-45' }` ve 32 günlük liste | ikisi de 400 |
| `M` `POST /api/school/role { name: 'Okul hayatı <z>', permissions: ['yemek.yonet', 'kulup.yonet'] }` | 200, rolde 2 yetki; sonra `POST /api/school/role-assign` ile `fen`'e verilir |
| `fen` salıya "Kuru fasulye" yazar | 200 (`yemek.yonet` yetkisi yetiyor) |

### 2) Servis (16)

- `o1` `GET /api/servis` → `benim: null`, `servisler` yok (yönetim listesi gelmiyor).
- `o1` ve `mat` `POST /api/servis/kaydet { ad: 'Kaçak' }` → 403.
- `M` "1. Servis"i açar: plaka `07 abc 123`, şoför adı, telefonu `0532 111 22 33`, sabah `7:30`, akşam `16:10`, güzergâh → 200.
- Aynı ad başka harf büyüklüğüyle ("1. servis") ve bozuk telefonlu ("12345") servis → ikisi de 400. "2. Servis" (alansız)
  açılır (denetlenmez).
- `M` `o1`'i "Market önü" durağıyla 1. servise yazar (`POST /api/servis/ogrenci`) → 200.
- `o1`'in `benim`'i: `soforTel` `+905321112233` (uluslararası biçime çevrildi), `plaka` `07 ABC 123` (büyük harf), `sabah`
  `07:30`, `durak` "Market önü".
- `o1`'in `benim.bugun`'ü: `canli: true`, `sira: 1`, `onunde` sabah döneminde `0`, akşam döneminde `null` (öğrenci okulda
  "Geldi" işaretlenmediği için), `saatler` dolu, `notlar` ve `binmeyecek` dizi.
- Veli `GET /api/servis` → tek çocuk, kartındaki `servis.soforTel` `+905321112233`.
- `o2` (servisi yok) ve `mat` `GET /api/servis` → cevabın hiçbir yerinde `5321112233` geçmiyor.
- `M2` kendi okulunda "Yabancı" servisini açar: o servise `o2`'yi yazmak → 404; bizim 1. servisimize `o2`'yi yazmak → 404;
  bizim 1. servisimizi silmek → 404.
- `M` `GET /api/servis` → 1. servisin tek öğrencisi `6-A` sınıfında, `siraSabah: 1`, `siraAksam: 1`; `okulOgrencileri`
  içinde `o2` var.
- `M` `o1`'i 2. servise yazar → 1. serviste 0, 2. serviste 1 öğrenci (taşındı, iki serviste birden değil).
- `POST /api/servis/ogrenci-cikar { ogrenciId: o1 }` → 200; ikinci kez → 404.
- `POST /api/servis/sil` (1. servis) → 200.

### 3) Kulüpler (16)

- "Satranç"ı danışman olarak `o1` ile açmak → 400 ("Danışman bu okulun öğretmeni olmalı").
- "Satranç" (`k1`): danışman `mat`, kontenjan 1, "Çarşamba 15.00" → 200; "satranç" adıyla ikincisi → 400.
- `o1` `GET /api/kulupler` → Satranç görünür, `uyesin` ve `uyeleriGorur` yanlış, `danisman` "Ayşe Kaya".
- `o1` katılır (200); `o2` → 400, iletide "dolu" ("Kulübün kontenjanı dolu").
- "Resim" (`k2`, kontenjan 1): `o1` ve `o2` AYNI ANDA katılmaya çalışır → yalnız biri 200.
- Satranç üye listesi (`GET /api/kulupler/uyeler?id=`): `o1` → 403; danışman `mat` → 200, tek üye "Zeynep Şahin".
- Danışman `o1`'i çıkarır, `o2`'yi ekler (`uye-cikar`, `uye-ekle`) → ikisi 200; `o1`'i de eklemeye kalkınca → 400 (kontenjan).
- `M` Satranç'ı kontenjan 5 ve `basvuruAcik: false` ile yeniden kaydeder: `o2` ayrılamaz (400), `o1` katılamaz (400).
- "Müzik" (`k3`, "Cuma 14.00") açılır, `M` `o1`'i ekler. Veli `GET /api/kulupler` → `cocuklar` tek, içinde "Müzik" ve günü;
  okulun kulüp listesi (`kulupler`) boş.
- Veli `POST /api/kulupler/katil` → 403 ("Kulübe öğrenci kendisi katılır").
- `M2` Satranç'ın üye listesine ve kaydetmesine (`{ id: k1, ad: 'Ele geçti' }`) → ikisi de 404.
- `kulup.yonet` yetkili `fen` "Bilim Kulübü <z>"i kendisi danışman olarak açar → 200; yetkisiz `mat` → 403.
- `M` Resim'i siler → 200.

Toplam 10 + 16 + 16 = 42. Sonunda `GECTI: 42   KALDI: 0` (satır başında boşluk yok); `KALDI` varsa çıkış kodu 1; beklenmeyen
hata `TEST HATASI:` ile hata nesnesinin tamamını yazar.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET/POST /api/yemek` | yemek listesi | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `GET /api/servis`, `POST /api/servis/kaydet`, `ogrenci`, `ogrenci-cikar`, `sil` | servisler | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `GET /api/kulupler`, `GET /api/kulupler/uyeler`, `POST /api/kulupler/kaydet`, `katil`, `ayril`, `uye-ekle`, `uye-cikar`, `sil` | kulüpler | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `POST /api/school/role`, `POST /api/school/role-assign` | `yemek.yonet` + `kulup.yonet` rolü | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/me`, `POST /api/parent/link` | velinin bağlanması | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md), [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/challenge`, `POST /api/register`, `POST /api/eposta-onay`, `POST /api/login`, `POST /api/login/dogrula`, `GET /api/kisilikler`, `POST /api/admin/okul-ac`, `POST /api/logout` | hesaplar, girişler, ikinci okul (`hesapAc`, `girisYap`, `mudurYap`) | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) (kayıt, onay, giriş, çıkış), [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) (`kisilikler`: kişi kodu), [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) (`okul-ac`) |

- **Koruduğu kod:** `sunucu/bolumler/okul-hayati.js` — `uclar` içindeki yemek, servis yönetimi ve kulüp uçları, `haftaBasi`,
  `ogrenciBugunu` ve `onundeKac` (`bugun` nesnesi), `servisGorunumu` ve `cocuklar` (telefonun kime gittiği), `kulupGorunumu`;
  depo [../sunucu/veri/depo/okul-hayati.md](../sunucu/veri/depo/okul-hayati.md) (`yemekYaz`, `servisKaydet`, `servisAdVarMi`,
  `servisOgrenciYaz` (aynı okul şartı ve taşıma), `kulupAdVarMi`, `uyeEkle` (kontenjan kilidi)); yetkiler `yemek.yonet`,
  `kulup.yonet`, `servis.yonet` ([../sunucu/yetki.md](../sunucu/yetki.md)); telefon biçimi `normTelefon` / `telefonSorunu`
  ([../sunucu/ortak.md](../sunucu/ortak.md)).
- **Tablolar:** `yemek_listesi`, `servisler`, `servis_ogrencileri`, `kulupler`, `kulup_uyeleri`, `roller`, `rol_yetkileri`,
  `veli_baglari` ([../sunucu/veri/sema/SEMA.md](../sunucu/veri/sema/SEMA.md)).
- **Ön yüz** (bu pakette tarayıcı yok): [../public/js/parcalar/19c-okul-hayati.md](../public/js/parcalar/19c-okul-hayati.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu döngüde `test-anket`'ten sonra, `test-servis-konum`'dan önce; her paketten
  önce veritabanı sıfırlanır ve [seed.md](seed.md) çalışır.

## Nasıl çalışır (adım adım)?

```
M, A, o1, o2, mat, fen girer ; veli açılır ─► o1'e bağlanır ; A ─► M2 (Hayat Okulu)
1) yemek: o1 okur ─► o1/mat yazamaz ─► M iki gün yazar ─► temizlik ve pazartesi ─► veli görür, M2 görmez
          ─► boş menü siler ─► bozuk tarih / 32 gün 400 ─► rol (yemek.yonet + kulup.yonet) ─► fen yazar
2) servis: o1'in servisi yok ─► o1/mat açamaz ─► M "1. Servis" (biçimler düzelir) ─► aynı ad / bozuk telefon 400
          ─► o1 servise ─► o1 kendi kartını ve "bugün"ü görür ─► veli görür ; o2/mat telefonu görmez
          ─► M2: üç deneme 404 ─► M sıraları görür ─► 2. servise taşı ─► çıkar (ikinci kez 404) ─► sil
3) kulüp: öğrenci danışman olamaz ─► Satranç (kontenjan 1) ─► aynı ad 400 ─► o1 katılır, o2 "dolu"
          ─► Resim'e aynı anda iki istek: tek kazanan ─► üye listesi: o1 403, danışman 200
          ─► danışman çıkar/ekle, kontenjanı aşamaz ─► başvuru kapalı: ayrılma/katılma 400
          ─► veli: yalnız çocuğun kulüpleri, katılamaz ─► M2 404 ─► fen (kulup.yonet) açar, mat açamaz ─► sil
```

## Dikkat!

- **Taze veritabanı ister.** "2. Servis", "Satranç" ve "Müzik" silinmeden kalır (adlarında `z` yok). 3 Ekim'de 3200'de aynı
  veritabanında ikinci kez çalıştırıldı (denetimde bir kez daha denendi, sonuç aynı): "öğrenci ikinci servise taşındı (tek serviste)" ve "kulüp açıldı" (`Bu adda bir kulüp
  zaten var`) kaldı, ardından paket `TEST HATASI: TypeError … reading 'slice'` ile durdu (Satranç bulunamayınca `J(undefined)`
  patladı; `JSON.stringify(undefined)` metin dönmez). İlk koşu her zaman `tumtest.sh`'deki gibi sıfırlanmış veritabanında
  yapılmalı.
- **`J` boş değerde patlar.** Bir denetimin ayrıntısı olarak verilen değer yoksa paket `KALDI` yerine `TEST HATASI` ile durur
  ve sonraki denetimler hiç çalışmaz (yukarıdaki ikinci koşuda olduğu gibi).
- **Bir değişkenin adı yanıltıcı:** üye listesi denetimindeki `fenUye` aslında `mat`'ın oturumuyla istenir; danışman `mat`
  olduğu için denetim doğrudur, ad yanlıştır.
- **Gün hesabı UTC.** `pazartesi()` ve sunucunun yemek listesi aynı biçimde (UTC günüyle) hesaplar, bu yüzden test sunucuyla
  hep uyuşur. Türkiye'de 00:00–03:00 arasında ikisi birlikte bir gün geride kalır; sunucu Türkiye gününe geçirilirse
  (bölümün belgesindeki tutarsızlık) bu yardımcı da değişmeli.
- **"Bugün" denetimi seed'in servis saatlerine dayanır.** Seed sabah 00:00–11:59, akşam 12:00–23:59 yazar; bu yüzden `canli`
  günün her anında `true` olur. `onunde` beklentisi dönemle değişir: sabah önde bekleyen yok (0), akşam öğrenci okulda
  "Geldi" işaretlenmediği için `null`.
- **Denenmeyenler:** yemekte tarih aralığı ("Tarih bu yılın dışında"), satır/uzunluk sınırları (120 harf, 8 satır, 500) ve
  kalori aralığı; serviste harita, ev konumu, yoklama, sefer, sıra, not ve "binmeyecek" (bunlar `testler/test-servis-konum.js`
  ve `testler/test-servis-yoklama.js`'te); kulüpte "başvuru kapalıyken danışman yine de ekleyebilir" (kapalı Satranç'a üye
  eklenmiyor), kontenjanın 1000 sınırı, "Zaten bu kulübün üyesisin".
- **Seed'e bağlı adlar:** "Ayşe Kaya", "Zeynep Şahin", `6-A`; seed değişirse bu denetimler kalır.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi sunucuna gider (yemek listesi yazar, servis ve kulüp açar,
  hesap ve okul kurar). Kodlar `EE_LOG`'daki günlükten okunur ([giris.md](giris.md)).

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Aynı bölümün başka yönleri:
  `testler/test-servis-konum.js` (harita, ev, sefer, konum, yaklaşma bildirimleri), `testler/test-servis-yoklama.js` (servis
  saatleri, yoklama, sıra, not, binmeyecek), [test-ozellikler.md](test-ozellikler.md) (servis kapalıyken uçlar),
  `testler/test-yedek.js` (yemek ve kulüp tabloları yedekte), [yetki-denetimi.md](yetki-denetimi.md) (her uç × her rol).
- Elle (Git Bash, proje kökünde; 3200'de sıfırlanmış `egitimevi_test` ile açılmış ve [seed.md](seed.md) ile tohumlanmış test
  sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-okul-hayati.js
  ```

- 3 Ekim'de bu belge için 3200'de, yeni sıfırlanmış test veritabanı ve seed'le iki ayrı sunucu açılışında çalıştırıldı: ikisinde
  de `GECTI: 42   KALDI: 0`, çıkış 0, yaklaşık 2 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. İkinci
  açılışta aynı veritabanında yapılan ikinci koşunun sonucu "Dikkat!"te.

## Son durum

- `git log`: 3 commit.
  - `203f9a4 commit 307` (2026-09-26): dosya 23 satırla başladı — baş yorumu, `require`, `kontrol`, `J` ve `pazartesi`.
  - `20efcf3 commit 317` (2026-09-26): asıl gövde (162 satır) eklendi: hesaplar, ikinci okul, yemek listesi, özel rol, servis ve
    kulüp bölümlerinin hepsi.
  - `24050a2 commit 518` (2026-09-27, servis yoklaması): öğrencinin `benim.bugun` nesnesini (canlı, sıra, `onunde`, saatler,
    notlar, binmeyecek) deneyen denetim eklendi; müdürün servis listesi denetimi "ve sıralarıyla" diye genişleyip `siraSabah` ve
    `siraAksam`'a da bakar oldu. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): taze veritabanı şartı, `J`'nin boş değerde patlaması, `fenUye` adı.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"KULÜPLER KALDIRILACAK"** (kullanıcı 1 Ekim) — tanıma göre kulüp uçları, depo, tablolar ve "testler" kalkacak: 3. bölümün
    tamamı (16 denetim) ve 1. bölümdeki rolün `kulup.yonet` yetkisi çıkarılmalı (rol tek yetkiyle kalırsa "rolde 2 yetki"
    denetimi de değişir); baş yorumu ve paketin adı/kapsamı buna göre güncellenmeli.
  - **"Sistem: yöneticiye ZORUNLU TOTP …"** — yönetici girişi günlükteki e-posta koduyla yapılamayacak; ikinci okulu açan
    `mudurYap` için yönetici girişi yeniden yazılmalı.
  - **"T.C. KİMLİK NO BÜTÜN HESAPLARDA ZORUNLU"** (kod Linux'ta) — veli ve ikinci müdürün `hesapAc` kaydı T.C. no göndermeli.
  - **"Güvenlik denetimi"** (okulun verdiği her şifrede ilk girişte değiştirme) — seed öğrencileri `okulHesabi` ile şifre
    verilerek açıldığı için bugün şifre değiştirmeden girer; bu iş gelince `Test1234!` ile girseler de `api.js`'teki
    `sifreDegismeli` kapısına takılırlar, seed ya da giriş yardımcısı şifreyi önce değiştirmeli.
  - **"Özel roller"** (öneri, onay bekliyor) — yeni hazır şablonlardan "Okul Sekreteri / Memur" `yemek.yonet` taşıyacak; paketin
    kendi kurduğu rol etkilenmez.
