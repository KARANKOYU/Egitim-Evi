# testler/test-servis-konum.js

Servisçi hesabını, servis aracının canlı konumunu, eve 500 m / 100 m kala giden yaklaşma bildirimlerini ve tarayıcının telefon
bildirimi (Web Push) aboneliğini kim görür, kim yazar, kim yapamaz diye uçtan uca deneyen sunuculu test paketi (49 denetim).

## Bu dosya ne yapar?

Okulun servisi var; aracı süren kişinin okulun açtığı bir **servisçi** hesabı var. Sefer sürerken servisçinin telefonu ya da
tarayıcısı konum gönderir; o servisteki öğrenci ve velisi aracı haritada görür, araç eve yaklaşınca bildirim alır. Burada iki
kaygı birlikte yürür: kolaylık (veli aracın nerede olduğunu bilsin) ve gizlilik (aracın konumunu, öğrencinin evini ve servisçinin
telefonunu yalnız gerekenler görsün). Ayrıntılı kurallar [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md)'de.

Dosya başındaki yorum maddeleri paketin kapsamını şöyle özetliyor: servisçi hesabını okul açar, yalnız kendi okulunun servisine
atanır; aracın konumunu yalnız o servisteki öğrenci, velisi, servisçisi ve yönetim görür, başka okulun servisçisi ya da başka
öğrencinin velisi görmez; servisçi ev konumunu görür ama değiştiremez, öğrenci listesinde T.C. ya da telefon gelmez; konumu yalnız
seferin servisçisi ve yalnız açık seferde yazar, servis başka servisçiye verilince eskisinin seferi kapanır; eve 500 m ve 100 m kala
öğrenciye ve velisine birer kez bildirim gider, GPS doğruluğu kötüyse gitmez; telefon bildirimi aboneliği yalnız bilinen push
servislerinden kabul edilir, cihaz başka hesaba geçince eskisinden düşer, kişi başına en çok 5 cihaz.

Servis yoklaması (bindi/binmedi, saat aralıkları, uzatma, telefonun cihaz anahtarı) ayrı ve daha büyük bir pakettedir:
[test-servis-yoklama.md](test-servis-yoklama.md).

## İçinde neler var?

### Yardımcılar

- `iste`, `girisYap`, `hesapAc`, `okulHesabi`, `mudurYap` — [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)).
  `okulHesabi(M, 'servisci', …)` `POST /api/school/hesap-ac` ile servisçi açar (rastgele geçerli T.C. ile) ve bir kez girip
  aydınlatma metnini onaylatır.
- `crypto` — Node'un modülü; push aboneliği için gerçek P-256 anahtarı üretmekte kullanılır.
- `kontrol(ad, sart, detay)`, `J(x)` (JSON'un ilk 220 karakteri).
- `EV` — `{ enlem: 36.9, boylam: 30.7 }`; `kuzey(m)` — `EV`'den m metre kuzeydeki nokta (enlemde 1 derece ≈ 111 195 m, 6 haneye
  yuvarlanır). Yaklaşma mesafeleri bununla kurulur.
- `bildirimler(token)` — `GET /api/notifications` → metin listesi (en yenisi başta; sunucu en yeni 100 bildirimi verir).
- `abone()` (7. bölümün içinde) — `crypto.createECDH('prime256v1')` ile anahtar çifti üretir; `endpoint`
  `https://fcm.googleapis.com/fcm/send/<24 hex>`, `keys: { p256dh, auth }` base64url.

### Hesaplar ve veriler

`z = Date.now()` (her koşuda farklı ekler). Seed'den ([seed.md](seed.md)): müdür (`M`), sistem yöneticisi `admin@egitimevi.com` /
`admin123` (`A`; şifre yalnız test sunucusunda `EE_ADMIN_SIFRE` ile), öğrenciler `ogrenci1` ("Zeynep Şahin", `o1`) ve `ogrenci2`
("Burak Öztürk", `o2`), Matematik öğretmeni `mat`. Okul "Test Ortaokulu"; seed servis saatlerini 00:00–11:59 / 12:00–23:59 yaptığı
için günün her anı bir servis dönemidir.

Paketin açtıkları:

- Veli "Servis Veli" (`servisveli<z>`, rolsüz yetişkin hesabı) → `POST /api/parent/link { code: o1'in kodu }` ile yalnız `o1`'e bağlanır.
- Servisçiler "Kemal Sürücü" (`s1`) ve "Nuri Sürücü" (`s2`), kullanıcı adları `kemal`/`nuri` + `z % 100000`.
- İkinci okul: "Konum Mudur" hesabı açılır, yönetici `mudurYap` ile onu "Konum Okulu <z>" (Ankara / Mamak) okulunun müdürü yapar
  (`M2`); o okulun servisçisi "Yabancı Sürücü" (`s3`).
- Servis "Konyaaltı <z>", plaka "07 KNM 12", servisçisi `s1`; `o1` "Park önü" durağıyla, `o2` duraksız yazılır.
- Okulun konumu 36.88, 30.7; `o1`'in evi `EV`. 7. bölümde push abonelikleri ve "Push Rolsuz" (`pushrolsuz<z>`) hesabı.

### 1) SERVİSÇİ HESABI VE ATAMA (7)

- `s1`'in girişinde `user.role === 'servisci'` ve `schoolId` dolu.
- Müdür `GET /api/school/servisciler` → 200; cevapta "Kemal" var, öteki okulun "Yabancı"sı yok.
- `POST /api/servis/kaydet`'te `soforId` başka okulun servisçisi (`s3`) ya da bir öğrenci (`o1`) → ikisi de 400 ("Servisçi bulunamadı").
- Servis `s1` ile açılır → 200 ve `id`.
- İki öğrenci `POST /api/servis/ogrenci` ile servise yazılır → ikisi de 200.
- `s1` okulun başka bölümlerine giremez: `GET /api/anketler`, `/api/yemek`, `/api/school/students`, `/api/devamsizlik/derslerim`,
  `/api/islem-kaydi`, `/api/school/classes` → her biri 403 ya da 404.
- `GET /api/mesajlar/hedefler` (`s1`) → 200, `kisiler` boş, `topluIzin: false`: servisçi okul rehberini görmez.

### 2) OKUL VE EV KONUMU (4)

- `POST /api/school/konum { enlem: 36.88, boylam: 30.7 }`: müdürle 200; `mat`'la 403 (`okul.konum` yok); müdürle `enlem: '36.88'`
  (metin) 400.
- `o1` kendi evini `POST /api/servis/ev` ile `EV`'e koyar → 200.
- Ev değiştiremeyenler, hepsi 403: veli `o2` için (bağlı değil), servisçi `s1` `o1` için (görür ama değiştiremez), başka okulun
  servisçisi `s3`.
- `o2`'nin bozuk koordinatları, hepsi 400 (500 değil): `'abc'`, `{}`, 91, (0, 0), dizi (`[36.9]`), `Infinity`.

### 3) HARİTA YETKİSİ (5)

`GET /api/servis/harita[?ogrenci=<id>]`:

- `o1` → 200; `okul.enlem` 36.88, `ev.enlem` 36.9, `servis` dolu, `sefer: null` (henüz sefer yok).
- `o2` `?ogrenci=<o1>` ile ister → 200 ama KENDİ haritası gelir (öğrenci için sunucu parametreyi yok sayar): öğrenci adı farklı,
  `ev` yok.
- Veli `o1` için 200, `o2` için 403.
- Servisçiler `o1` için: `s1` 200 ve `evDuzenleyebilir: false`; `s2` (bu servise atanmamış) 403; `s3` (başka okul) 403.
- `servis.yonet` yetkisi olmayan `mat` 403.

### 4) SERVİSÇİ EKRANI (3)

`GET /api/servis/seferim`:

- `s1` → 200, tek servis, iki öğrenci.
- Öğrenci satırlarının bütün alanları birleştirilip sıralanınca tam `ad,durak,ev,sinif`: kimlik, T.C., telefon yok.
- `s2` (servisi yok) → 200 ve boş liste; `o1` → 403.

### 5) SEFER VE KONUM (13)

- `s2` ve müdür `POST /api/servis/sefer-basla { servisId, yon: 'donus' }` → ikisi de 403.
- `s1` aynı isteği atar → 200 ve `sefer.id`; yön gövdedeki `yon`'dan değil dönemden gelir: `donem: 'sabah'` ise `gidis`, değilse
  `donus`.
- Cevap `donem: 'aksam'` ise paket `o1` ve `o2`'yi `POST /api/servis/yoklama { durum: 'geldi' }` ile işaretler, çünkü akşam seferinde
  yaklaşma bildirimi yalnız okulda "Geldi" işaretlenmiş öğrenciye gider (sabahta henüz işaretlenmemişlere gider).
- `s2` bu sefere `POST /api/servis/konum` → 409.
- `s1` 5 km kuzeyden (doğruluk 12 m) konum yazar → 200; `o1`'in haritasında `sefer.konum.enlem` gönderilenle aynı (1e-6 farkla);
  velinin haritasında da `sefer.konum` dolu; `o1`'e yeni bildirim yok.
- 400 m (doğruluk 15): `o1`'e bir bildirim gelir ve en yenisi "yaklaşıyor" içerir ("Servis evine yaklaşıyor (yaklaşık 500 m).");
  veliye çocuğun TAM adıyla başlayan aynı metin gider ("Zeynep Şahin: servis evine yaklaşıyor …").
- 350 m: aynı eşik (500 m) ikinci kez bildirilmez.
- 50 m ama doğruluk 400 m: 100 m bildirimi gitmez (150 m'den kötü ölçüm sayılmaz).
- 50 m, doğruluk 8: "100 metreden yakın" bildirimi gider (toplam iki).
- Evi işaretsiz `o2`'ye "Servis evine …" bildirimi hiç gitmez.
- Bozuk istekler: `enlem: 'x'` → 400; `seferId: { $ne: 1 }` → 409; `seferId: 'yok'` → 409 (tarayıcı ucu "sefer bulunamadı"yı da 409'a
  çevirir ki sayfa göndermeyi bıraksın).

### 6) SERVİSÇİ DEĞİŞİNCE (6)

- Müdür aynı servisi `soforId: s2` ile kaydeder → 200.
- `s1` eski sefere konum yazamaz (409) ve `o1`'in haritasında `sefer: null`: servisçi değişince eskisinin açık seferi kapanır.
- `s1`'in `seferim`'i artık boş.
- `s2` sefer başlatır, 3 km'den konum yazar, `POST /api/servis/sefer-bitir` ile bitirir → 200 ve haritada `sefer: null`.
- `s2` yeniden sefer başlatıp konum yazar; müdür `POST /api/school/hesap-sil { id: s2, onay: true }` ile hesabı siler → 200 ve haritada
  ya sefer yok ya da `konum` yok.
- `s1` aynı anda 70 konum isteği (`seferId: 'yok'`) atar → en az 5 tanesi 429 (servisçi başına dakikada 60).

### 7) TELEFON BİLDİRİMİ ABONELİĞİ (11)

- `GET /api/push/anahtar`: girişliyken 200 ve 87 karakterlik base64url açık anahtar (VAPID); oturumsuz 401.
- Geçerli abonelik (`a1`, `o1`) `POST /api/push/abone` → 200.
- Yedi bozuk abonelik, hepsi 400: `https://127.0.0.1/x` (IP adresi), `http://fcm.googleapis.com/…` (https değil),
  `https://fcm.googleapis.com.saldiri.net/x` (sahte alan), 1000 karakteri aşan adres, dizi olarak `endpoint`, kısa `p256dh`,
  `keys: 'yok'`.
- `POST /api/push/durum { endpoint }`: `o1` için `benim: true`, `o2` için `false`.
- Aynı abonelik (aynı adres ve anahtarlar) `o2` ile yazılınca `o1`'den düşer, `o2`'nin olur (ortak cihaz).
- `o1` aynı adresi BAŞKA anahtarlarla yazmaya kalkarsa 409; abonelik `o2`'de kalır (adresi öğrenen biri devralamaz).
- `o1` `POST /api/push/iptal` ile `o2`'nin aboneliğini silmeye çalışır → 200 döner ama abonelik `o2`'de kalır.
- `o2` kendi aboneliğini iptal eder → `benim: false`.
- `mat` art arda 6 abonelik yazar: ilki düşer, altıncısı durur (kişi başına 5).
- Hiçbir okula bağlı olmayan "Push Rolsuz" hesabı ve servisçi `s1` de abone olabilir (200).

Toplam 7 + 4 + 5 + 3 + 13 + 6 + 11 = 49. Sonunda boş satır ve `  GECTI: 49   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Beklenmeyen
hata `  TEST HATASI: <yığın>` ile, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** [giris.md](giris.md); Node'un `crypto`'su. Veritabanına doğrudan bağlanmaz, dosya yazmaz.
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/servis/harita`, `POST /api/servis/ev`, `GET /api/servis/seferim`, `POST /api/servis/sefer-basla`, `/konum`, `/sefer-bitir`, `/kaydet`, `/ogrenci`, `/yoklama` | servis, harita, sefer | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | `GET /api/school/servisciler`, `POST /api/school/hesap-ac`, `/hesap-sil`, `/konum` | okulun servisçileri, hesap açma ve silme, okulun konumu | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `GET /api/push/anahtar`, `POST /api/push/abone`, `/durum`, `/iptal` | Web Push aboneliği | [../sunucu/bolumler/push.md](../sunucu/bolumler/push.md) |
  | `GET /api/mesajlar/hedefler` | servisçinin mesaj hedefleri | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `POST /api/parent/link` | veliyi çocuğa bağlama | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md) |
  | `GET /api/notifications`, `/api/me`, `POST /api/register`, girişler | bildirim sayımı, hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |
  | `POST /api/admin/okul-ac` (`mudurYap` içinde) | ikinci okul | [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `GET /api/anketler`, `/api/yemek`, `/api/school/students`, `/api/devamsizlik/derslerim`, `/api/islem-kaydi`, `/api/school/classes` | servisçinin giremediği yerler | [../sunucu/api.md](../sunucu/api.md) |

- **Koruduğu kod:**
  - [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) — `haritaYetkisi` (öğrenci, bağlı veli, `servis.yonet`
    yetkili yönetim, kendi servisinin servisçisi; servisçiye `evDuzenle: false`), öğrenci için `?ogrenci=`'nin yok sayılması,
    `koordinatAl` / `sayiAl`, `seferim`'in alan listesi, `sefer-basla`'da yönün dönemden gelmesi, `seferKonumuYaz` (sahibi ve açık
    sefer, `EN_KOTU_DOGRULUK` 150 m), `yaklasmaAdaylari` (sabah işaretsiz, akşam "Geldi"), `yaklasmaBildir` (`YAKLASMA_ESIKLERI`
    500/100, tekillik `seferBildirimiIsaretle`), `kaydet`'te `soforId` denetimi ve `servisSoforYaz` ile eski seferin kapanması, konum
    hız sınırı (dakikada 60). Konumun 3 dakikalık tazelik süresi (`KONUM_TAZE_MS`) bu pakette denenmez.
  - [../sunucu/veri/depo/okul-hayati.md](../sunucu/veri/depo/okul-hayati.md) — seferler, son konum, sefer bildirimleri, ev konumları.
  - [../sunucu/bolumler/push.md](../sunucu/bolumler/push.md) ve [../sunucu/push.md](../sunucu/push.md) — `adresGecerli` (yalnız https,
    IP yok, bilinen push sunucuları ve alt alanları), `anahtarGecerli` (65 baytlık P-256 noktası, 16 baytlık `auth`), 1000 karakter
    sınırı, `KISI_BASINA` 5; [../sunucu/veri/depo/push.md](../sunucu/veri/depo/push.md) — `aboneYaz` (aynı adres yalnız AYNI
    anahtarlarla başka hesaba taşınır), `fazlasiniSil`, `aboneSil` (yalnız sahibininkini siler), `kisiAbonesiMi`.
  - [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) — `servisciler` (yalnız `servis.yonet`), okul konumunun yalnız sayı
    kabul etmesi, `hesap-sil`; [../sunucu/api.md](../sunucu/api.md) — servisçinin rol kapıları.
- **Ön yüz** (bu pakette tarayıcı yok): harita, ev konumu ve tarayıcıdan konum gönderme
  [../public/js/parcalar/19e-servis-konum.md](../public/js/parcalar/19e-servis-konum.md); servis sayfaları
  [../public/js/parcalar/19c-okul-hayati.md](../public/js/parcalar/19c-okul-hayati.md); servisçinin yoklama ekranı
  [../public/js/parcalar/19i-servis-yoklama.md](../public/js/parcalar/19i-servis-yoklama.md); okulun haritadaki yeri
  [../public/js/parcalar/16b-okul-ayarlari.md](../public/js/parcalar/16b-okul-ayarlari.md); bildirim izni ve push aboneliği
  [../public/js/parcalar/04b-bildirim-izni.md](../public/js/parcalar/04b-bildirim-izni.md).
- **Tablolar** (uçlar üzerinden): `servisler`, `servis_ogrencileri`, `servis_seferleri`, `sefer_bildirimleri`, `ogrenci_konumlari`,
  `servis_yoklamalari` (akşam dalında), `okullar`, `kullanicilar`, `bildirimler`, `push_abonelikleri`.
- **Onu çalıştıran:** `testler/tumtest.sh` — sunuculu döngüde `test-okul-hayati`'dan sonra, `test-servis-yoklama`'dan önce.

## Nasıl çalışır (adım adım)?

```
M, A, o1, o2, mat girer ; veli açılır → o1'e bağlanır ; s1, s2 (bu okul) ; M2 okulu + s3
1) s1 rolü ; servisciler ; kaydet(soforId s3 | o1) 400 ; kaydet(s1) ; o1 + o2 servise
   s1 → 6 başka bölüm 403/404 ; mesaj hedefleri boş
2) school/konum: M 200, mat 403, metin 400 ; o1 ev ; veli/s1/s3 ev 403 ; 6 bozuk koordinat 400
3) harita: o1 ; o2 ?ogrenci=o1 (kendi haritası) ; veli o1/o2 ; s1/s2/s3 ; mat
4) seferim: s1 (ad, durak, ev, sinif) ; s2 boş ; o1 403
5) sefer-basla: s2, M 403 ; s1 200 (yön dönemden) ─ akşamsa o1, o2 "geldi"
   konum: s2 409 ; 5 km ─► harita ; 400 m ─► 500 m bildirimi (öğrenci + veli) ; 350 m yok
          50 m kötü GPS yok ; 50 m ─► 100 m bildirimi ; o2 (evsiz) yok ; bozuk 400/409/409
6) kaydet(soforId s2) ─► s1 seferi kapandı ; s2 başlat/konum/bitir ; s2 başlat/konum → hesap-sil ; 70 konum → 429
7) push: anahtar ; abone ; 7 bozuk 400 ; durum ; o2'ye geçiş ; başka anahtar 409 ; iptal (başkası/kendisi)
   mat × 6 → 5 ; rolsüz ve servisçi abone
GECTI: n   KALDI: m
```

## Dikkat!

- **Yalnız o anki dönemin dalı denenir.** Seed saatlerinde öğleden önce dönem sabah, öğleden sonra akşamdır. 5. bölüm buna göre ya
  gidiş seferini ve "henüz işaretlenmemiş" öğrencilere giden yaklaşma bildirimini, ya da dönüş seferini ve "Geldi" işaretli
  öğrencilere gideni dener; bir koşuda ikisi birden denenmez. Öğleden sonra sabah dalını denemek için paketten önce müdürle
  `POST /api/servis/saatler` ile saatleri "şu an sabah" olacak biçimde yaz (ör. sabah şimdi−30 dk … şimdi+30 dk, akşam onun
  hemen ardından). 3 Ekim'de iki dal da koşuldu: 13:21'de seed saatleriyle akşam dalı, 13:57'de taze veritabanında saatler
  13:26–14:26 / 14:26–15:26 yazılarak sabah dalı; ikisi de 49/0.
- **Akşam dalı yoklama da yazar.** "Geldi" işaretleri `servis_yoklamalari`'na ve veliye "… okuldan servise bindi." bildirimine yol
  açar. Paket velinin bildirimlerini sayıyla değil `some` ile aradığı için etkilenmez.
- **`Infinity` aslında `null` gider.** `JSON.stringify` `Infinity`'yi `null` yazar; 2. bölümdeki "Infinity" denemesi sunucuya `enlem:
  null` olarak ulaşır. Sonuç yine 400, ama gerçek bir sonsuz sayı denenmiş olmaz (JSON'da zaten yazılamaz).
- **İki konum ucu metni farklı karşılıyor.** Okulun konumu (`/api/school/konum`) yalnız gerçek sayı kabul eder (`'36.88'` → 400,
  denetleniyor); ev konumu ve servis konumu (`koordinatAl` / `sayiAl`) ise sayı yazılmış metni de kabul eder. Bu paket evde metin
  sayıyı denemiyor; 3 Ekim'de test sunucusunda elle denendi: öğrenci `POST /api/servis/ev { enlem: '36.9', boylam: '30.7' }` → 200,
  "Ev konumu kaydedildi.". Bilerek mi böyle, belli değil (kod değiştirilmedi).
- **Veliye giden servis bildirimlerinde ad iki biçimde.** Yaklaşma bildirimi veliye çocuğun TAM adıyla gider ("Zeynep Şahin: servis
  evine …"; paket de tam adı arar), yoklama bildirimleri ise yalnız adıyla ("Zeynep 07:42'de servise bindi."). Küçük bir tutarsızlık;
  kod değiştirilmedi.
- **İki eşik aynı anda geçilirse iki bildirim gider.** Konum ilk kez doğrudan 100 m'nin içine düşerse `yaklasmaBildir` hem 500 m hem
  100 m bildirimini aynı anda gönderir (eşikler tek tek denenir). Paket önce 400 m'den geçtiği için bu durum denenmiyor (kod okumasına
  göre).
- **"Başkasının aboneliğini iptal edemiyor" 200 ile geçer.** `POST /api/push/iptal` yalnız sahibinin satırını sildiği için başkası
  için hiçbir şey silmez ama yine `{ ok: true }` döner; paket de 200 bekler. İstemci "iptal oldu" sanabilir; sonucu `durum` ile
  denetlemek gerekir.
- **"Okur" kısmı denenmiyor.** 1. bölümün son denetiminin adı "servisçi yönetimin mesajını okur ama okul rehberini görmez" diyor;
  denetlenen yalnız hedef listesinin boş ve toplu iznin kapalı olması. Servisçinin gelen mesajı okuyabildiği burada sınanmıyor.
- **Hız sınırı denetimi gevşek.** 70 eşzamanlı isteğin en az 5'inin 429 alması beklenir; `s1` o dakikada zaten birkaç konum gönderdiği
  için 429 sayısı 5'ten çok daha fazla çıkar. Sınır bellekte tutulur; aynı sunucuda arka arkaya koşularda bir önceki koşunun sayacı
  kısa süre kalır (bkz. `tumtest.sh`'in her pakette sunucuyu yeniden başlatma nedeni).
- **Sahte push adresleri veritabanında kalır.** 7. bölüm `fcm.googleapis.com` alanında uydurma abonelikler yazar ve bir kısmını
  silmez (`mat`'ın 5'i, rolsüz hesap, `s1`). Test sunucusu `EE_PUSH_GONDERME=0` ile açıldığı için (`tumtest.sh` ve yerel
  `.claude/gelistirme/betikler/test-sunucu-ac.sh`, git dışında) bu kişilere bildirim düşse de dışarıya istek gitmez. Sunucuyu bu
  değişken olmadan açarsan sonraki bildirimler Google'ın push sunucusuna gerçek istek olarak gider.
- **İkinci okul ve hesaplar her koşuda yeniden açılır.** Kullanıcı adları `z` ile değiştiği için aynı veritabanında ikinci ve üçüncü
  koşu da geçer (3 Ekim'de denendi: 49/0); ama her koşu bir okul, bir müdür adayı, üç servisçi ve iki yetişkin hesabı daha bırakır.
- **Aynı sunucuda bir saat içinde dördüncü koşu kalır.** Seed hesapları her koşuda yeniden kullanılır ve hız sınırları bellekte
  sayılır: `mat` her koşuda 6 abonelik yazar, `POST /api/push/abone` ise kişi başına saatte 20 denemeye izin verir (`pushAbone:`).
  Dördüncü koşuda `mat`'ın 21. denemesinden sonrası 429 alır ve "kişi başına en fazla 5 cihaz" kalır (3 Ekim'de denendi: 48/1,
  `{"benim":true}{"benim":false}`). Kod okumasına göre `o2`'nin ev denemeleri de (her koşuda 6, saatte 30 sınır) altıncı koşuda
  takılır. Sunucuyu yeniden başlatmak sayaçları sıfırlar; `tumtest.sh` bunu her pakette yapar.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen istekler kendi (gerçek veritabanlı) sunucuna gider; her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır.
- Elle (Git Bash, proje kökünde): sunucu 3200'de sıfırlanmış `egitimevi_test`, `EE_PUSH_GONDERME=0` ve [seed.md](seed.md) ile açık
  olmalı; sonra `EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-servis-konum.js`.
- 3 Ekim'de bu belge için 3200'de, sıfırlanmış ve tohumlanmış `egitimevi_test` üzerinde 13:21'de (akşam dalı) koşuldu:
  `GECTI: 49   KALDI: 0`, çıkış 0, yaklaşık 3 saniye; hemen ardından aynı sunucuda ikinci koşu da 49/0. Sunucu günlüğünde `API hatası`
  ya da `Veritabanı hatası` yoktu.
- Belge denetlenirken (13:57) yeni bir test sunucusunda: önce saatler "şu an sabah" yazılıp sabah dalı 49/0 (3,4 sn); saatler seed'e
  döndürülüp aynı veritabanında akşam dalı iki kez 49/0; dördüncü koşu 48/1 (abonelik hız sınırı, "Dikkat!"e bak). Günlükte yine
  `API hatası` ya da `Veritabanı hatası` yoktu.
- Aynı alanda: [test-servis-yoklama.md](test-servis-yoklama.md) (yoklama, aralıklar, uzatma, telefonun cihaz anahtarıyla konum),
  [test-okul-hayati.md](test-okul-hayati.md) (servis ekleme, öğrenciyi taşıma, şoför telefonunu kimin gördüğü),
  [test-servis-pencere.md](test-servis-pencere.md) (saat aralığı hesabı), [test-ozellikler.md](test-ozellikler.md) (servis bölümü
  kapalıyken uçlar), [test-push.md](test-push.md) (Web Push şifrelemesi, sunucusuz), `testler/test-yetiskin.js` (yetişkin hesabının
  aboneliği), [yetki-denetimi.md](yetki-denetimi.md), [girdi-denetimi.md](girdi-denetimi.md), [test-rol.md](test-rol.md)
  (`okul.konum` yetkisi).

## Son durum

- `git log`: 5 commit.
  - `24050a2 commit 518` (2026-09-27, servis yoklaması işi): 5. bölümde seferi başlatma denetimi "yönü dönemden (sabah gidiş, akşam
    dönüş)" oldu ve akşam dönemindeyse iki öğrenciyi "Geldi" işaretleyen satırlar eklendi (o commit'ten beri akşam seferinde yaklaşma
    bildirimi yalnız "Geldi" işaretlilere gidiyor). Aynı commit seed'e 00:00–11:59 / 12:00–23:59 servis saatlerini koydu.
  - `86af98a commit 506` (2026-09-26): "başka anahtarla aynı adres devralınamıyor" (409) denetimi eklendi; aynı commit
    `sunucu/veri/depo/push.js`'te aboneliğin yalnız aynı anahtarlarla başka hesaba taşınmasını sağladı (`aboneYaz` artık
    taşındı/yazıldı mı diye `true`/`false` döner) ve `sunucu/bolumler/push.js` `false`'ta 409 "Bu bildirim adresi başka bir
    abonelikte kayıtlı…" dönmeye başladı.
  - `e6f818b commit 319` (2026-09-26): paketin gövdesi (1–7. bölümler, 213 satır) eklendi.
  - `ab0ed2f commit 318` ve `20efcf3 commit 317` (2026-09-26): dosya baş yorumu, `require`'lar, `kontrol`, `EV`/`kuzey` ile açıldı, sonra
    `bildirimler` yardımcısı eklendi (317'de `test-okul-hayati.js` de geldi).
  - Paketin adı `tumtest.sh` listesinde `f0556ca commit 137`'den (2026-08-29) beri var; dosya ise depoya 317–319'da geldi.
- Açık iş yok; kod değiştirilmedi. Kodda görülen küçük tutarsızlıklar (metin koordinat, veliye giden adın iki biçimi, başkasının
  aboneliğini iptalin 200 dönmesi) "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"T.C. kimlik no bütün hesaplarda zorunlu"** (kod Linux'ta) — `hesapAc` ile açılan veli, müdür adayı ve rolsüz hesap bugün
    T.C.'siz kaydolur; kayıtta T.C. zorunlu olunca bu kayıtlar reddedilir, paketin (ya da `araclar/giris.js`'in) T.C. göndermesi gerekir.
    Servisçiler `okulHesabi` ile zaten geçerli T.C.'yle açılıyor.
  - **"Tek kişi tek hesap + portallar"** — tanımda "servisçi de portal" (aynı servisçi iki okulda tek hesap, iki portal). Servisçi hesabı
    yetişkin hesabının altında bir rol satırına dönerse `s1.user.role`, `servisciler` listesi ve `hesap-sil` denetimleri değişir.
  - **"Sistem: yöneticiye ZORUNLU TOTP"** — paket yöneticiyle e-posta koduyla girip ikinci okulu açar; doğrulama uygulaması zorunlu
    olunca bu giriş yolu değişir.
  - **"Android yerel uygulama"** — servisçinin telefonu konumu bu paketin `/api/servis/konum`'u yerine `/api/cihaz/servis-konum` ile
    gönderir (o yol [test-servis-yoklama.md](test-servis-yoklama.md)'de denenir); uygulama bildirimlerini Firebase'siz, kendisi
    yoklayarak alır (`sunucu/bolumler/cihaz.js` yorumu). Bu yüzden bu paketin 7. bölümü yalnız tarayıcının Web Push aboneliğini korur;
    uygulama işi ilerledikçe ikisinin ayrımı burada da gözetilmeli.
