# sunucu/bolumler/mesaj.js

Okulun iç mesajlaşması ve duyuruları (`/api/mesajlar`): kime yazılabileceği, alıcı listesinin çözülmesi, velinin kopyası,
izin ayarları, okundu bilgisi, düzeltme ve silme.

## Bu dosya ne yapar?

Eğitim Evi'nde herkesin bir mesaj kutusu var. Burada iki tür kayıt aynı tabloda yaşar:

- **mesaj** — kişiye (ya da yetkisi varsa bir sınıfa, bir role, bütün okula) yazılır; alıcının "kimden mesaj alırım"
  ayarına ve engel listesine takılabilir;
- **duyuru** — müdür ya da toplu gönderme yetkisi olan öğretmen yayımlar; alıcının ayarlarını AŞAR (kar tatili duyurusu
  herkese ulaşmalı), cevaplanmaz.

İki büyük kural bu dosyada: öğrenciye giden her şeyin bir kopyası onaylı velilerine de düşer (veli çocuğuna ne
söylendiğini görebilmeli), ve öğrenci/veli yalnız kendi (çocuğunun) öğretmenlerine ve müdüre yazabilir — okulun bütün
rehberi herkese açılmaz. Dosyanın `mesajAlicilariCoz` işlevi anketlerde de kullanılır ([anket.md](anket.md)).

## İçinde neler var?

### Sabitler

- `MESAJ_KONU_SINIR` — 120 karakter; `MESAJ_GOVDE_SINIR` — 4000 karakter (fazlası `clean` ile kırpılır, hata vermez).
- `MESAJ_SAATLIK_SINIR` — 30: kişi başına saatte en çok 30 yeni mesaj/duyuru denemesi.
- `KIMDEN` (iç) — `['herkes', 'personel', 'kapali']`: "kimden mesaj alırım" seçenekleri.
- `ROL_AD` (iç) — rol hedefinde seçilebilen roller ve özet adları: `student` "Öğrenciler", `parent` "Veliler",
  `teacher` "Öğretmenler", `principal` "Yöneticiler". Servisçi bu listede yok (rol hedefiyle seçilemez; "tüm okul"
  hedefinde ise onaylı her hesap gibi o da alıcıdır).

### Dışa açılan işlevler

- `velileriBul(ogrenciId)` — öğrencinin onaylı velileri (`depo.kullanicilar.velileri`). Bugün başka dosya çağırmıyor (grep).
- `mesajKimden(u)` — kişinin ayarı (`u.mesajAyar.kimden`); tanınmayan ya da boşsa `'herkes'`.
- `mesajGidebilirMi(gonderen, alici, tur, engelli)` — tek alıcı için karar. Alıcı yoksa ya da onaylı değilse, kendisine
  yazıyorsa `false`; duyuruysa `true`; mesajda: gönderen alıcının engel listesindeyse, alıcı `kapali` seçtiyse ya da
  `personel` seçip gönderen öğretmen/müdür değilse `false`.
- `mesajYazilabilirler(me)` — kişinin mesaj kutusunda görebildiği ve yazabildiği kişiler. Müdür ve öğretmen: okulun onaylı
  herkesi (kendisi hariç). Öğrenci: kendi öğretmenleri (`teachersOfStudent`) + müdürler. Veli: çocuklarının öğretmenleri +
  müdürler. Başka rol (servisçi, yönetici): boş liste.
- `mesajAlicilariCoz(me, hedef, tur)` → `{ alicilar: [{ id, ogrenciId }], ozet, elenen }` ya da `{ hata }`. Hedef türleri:
  - `{ tur: 'okul' }` — `mesaj.herkese` yetkisi gerekir ("Tüm okula gönderme yetkin yok"); okulun onaylı herkesi, özet
    "Tüm okul";
  - `{ tur: 'rol', roller: [...] }` — `mesaj.toplu` gerekir ("Toplu gönderme yetkin yok"); `ROL_AD`'da olmayan roller
    atılır, hiç kalmazsa "En az bir rol seç"; özet rol adları;
  - `{ tur: 'sinif', siniflar: [...] }` — `mesaj.toplu` gerekir; en çok 100 sınıf; başka okulun sınıfı sessizce atlanır,
    hiçbiri kalmazsa "Sınıf bulunamadı"; alıcılar sınıfların öğrencileri; özet sınıf adları;
  - `{ tur: 'kisi', kisiler: [...] }` — yetki gerekmez ama yalnız `mesajYazilabilirler` listesindekiler kalır, hiçbiri
    kalmazsa "Seçtiğin kişilere yazma yetkin yok"; özet en çok 3 kişide adlar, fazlasında "N kişi";
  - başka her şey "Geçersiz hedef".
  Sonra (duyuru değilse) alıcıların engel listeleri TEK sorguda çekilir (`engelHaritasi`), `mesajGidebilirMi`'den
  geçmeyenler elenir, `elenen` sayılır. Kalan her öğrencinin velileri `{ id: veliId, ogrenciId }` olarak listeye eklenir
  (bir veli iki çocuğu için iki satır alabilir; tabloda `(mesaj_id, alici_id, ogrenci_id)` ayrı satırdır). Veli kopyası
  velinin kendi ayarına ya da engel listesine bakmaz.
- `mesajOzeti(m, benimId)` — tam mesaj nesnesinden (`depo.mesajlar.bul`) liste satırı: `{ id, tur, konu, onizleme (ilk
  140 harf), gonderenId, gonderen (silinmişse "Silinmiş kullanıcı"), gonderenRol, tarih, duzenlenme, hedefOzet,
  aliciSayisi, okundu, cocukIcin }`. `cocukIcin`: veliyse bu mesajın hangi çocuk(lar)ı için geldiği.
- `uclar(k)` — aşağıdaki uçlar.

### İç yardımcılar

- `okumaGorebilir(me, m)` — okundu bilgisini kim görür: gönderen; duyuruysa aynı okulun müdürü de.
- `kutuSatiri(r, giden)` — kutu listesinin hafif satırı (`depo.mesajlar.kutuOzeti`); `kisiSayisi` ve `okuyanSayisi`
  YALNIZ gönderilenler kutusunda doldurulur.

### Uçlar

Hepsi `p === 'mesajlar'`. Önce `need()` (giriş yoksa 401, hesap onaylı değilse 403), sonra `okulGerek` (okulu olmayan
hesap 403; veli okulsuzsa ilk çocuğunun okulu tamamlanır, çocuğu da yoksa "Önce çocuğunu hesabına bağlaman gerekiyor.").
Yönetici hesabı okula bağlı olmadığı için burada 403 alır.

- **`GET /api/mesajlar/hedefler`** — yeni mesaj penceresi için:
  `{ kisiler: [{ id, ad, rol, brans, kapali }], topluIzin, okulIzin, duyuruIzin, siniflar: [{ id, ad, sayi }] }`.
  `kapali: true` olan kişi listede görünür ama mesaj ona gitmez (ayarı ya da engeli). `brans` yalnız öğretmende.
  `topluIzin`/`duyuruIzin` = `mesaj.toplu`, `okulIzin` = `mesaj.herkese`; `siniflar` yalnız toplu izni olana dolu.
  Liste Türkçe alfabetik.
- **`GET /api/mesajlar/ayar`** — kendi ayarın: `{ kimden, engelli: [{ id, ad, rol }] }` (engel listesindekilerden yalnız
  hâlâ okulda olanlar).
- **`POST /api/mesajlar/ayar`** — gövde `{ kimden: 'herkes'|'personel'|'kapali', engelli: [id...] }`. `kimden` geçersizse
  400 "Geçersiz seçim". Engel listesi tekilleştirilir, yalnız okulundaki kişiler ve kendin dışındakiler kalır, en çok 200.
  Liste bütünüyle yeniden yazılır (`engelleriYaz`: önce sil, sonra ekle). Cevap `{ kimden, engelli: <sayı> }`.
- **`GET /api/mesajlar?kutu=gelen|giden&tur=|mesaj|duyuru`** — kutu (varsayılan `gelen`), en yeni 200 kayıt:
  `{ kutu, okunmamis, mesajlar: [kutuSatiri...] }`. `okunmamis` gelen kutusundaki okunmamış mesaj sayısı (tür süzgecinden
  bağımsız).
- **`GET /api/mesajlar/duyurular`** — gelen kutusundaki son 5 duyuru: `{ duyurular: [...] }`. Ön yüz bugün çağırmıyor
  (grep; yalnız `test-mesaj.js`).
- **`POST /api/mesajlar`** — yeni mesaj ya da duyuru. Gövde `{ tur: 'mesaj'|'duyuru', konu, govde, hedef: {...},
  ekIdler?: [...] }`. Sıra:
  1. hız sınırı `mesaj:<kişi>` saatte 30 → aşılırsa 429 "Saatlik mesaj sınırına ulaştın. Biraz bekle." (sayaç her
     denemede artar, hatalı istek de sayılır);
  2. `tur` `duyuru` değilse `mesaj`; duyuru için `mesaj.toplu` yoksa 403 "Duyuru yayımlama yetkin yok";
  3. `konu` boşsa 400 "Konu yaz", `govde` boşsa 400 "Mesaj metni boş olamaz";
  4. `mesajAlicilariCoz` hatası 400; hiç alıcı kalmadıysa 400 "Alıcı kalmadı. Seçtiğin kişiler mesaj almayı kapatmış
     olabilir.";
  5. ekler `ekleriDogrula(me, 'mesaj', ekIdler)` (sahiplik, toplam 50 MB; bkz. [ekler.md](ekler.md)); hata 400;
  6. mesaj + alıcılar (`depo.mesajlar.ekle`) ve eklerin bağlanması TEK İŞLEMDE (`islem`);
  7. bütün alıcılara bildirim: duyuruda "Duyuru: <konu>", mesajda "<gönderenin adı>: <konu>", bağlantı `#/mesajlar`
     (`topluBildir` aynı kişiye tek bildirim gönderir).
  Cevap `{ mesaj: {...özet}, gonderilen, elenen, message }`; `message` ör. "Mesaj gönderildi — 3 kişiye ulaştı. 1 kişi
  mesaj almayı kapatmış." (`gonderilen` veli kopyalarını da sayar).
- **`POST /api/mesajlar/duzenle`** — gövde `{ id, konu, govde }`. Mesaj yoksa 404, gönderen değilsen 403 "Yalnızca gönderen
  düzeltebilir"; hız sınırı `mesajDuzelt:<kişi>` saatte 60 (429 "Çok sık düzelttin. Biraz bekle."); boş konu/metin 400.
  Aynıysa `{ message: 'Değişiklik yok.' }`. Yalnız konu ve metin değişir, `duzenlenme` zamanı yazılır; alıcıya yeni
  bildirim GİTMEZ, alıcı "düzenlendi" görür.
- **`POST /api/mesajlar/sil`** — gövde `{ id }`. Gönderen: mesaj bütünüyle silinir ("Mesaj silindi."). Alıcı: yalnız
  kendi kutusundan kalkar ("Mesaj kutundan kaldırıldı."; gönderenin "Gönderilenler"inde kalır). İkisi de değilse 403
  "Yetkin yok"; mesaj yoksa 404.
- **`GET /api/mesajlar/okuma?id=<mesaj>`** — kimlerin okuduğu: `{ konu, tarih, alicilar: [{ ad, rol, sinif, cocuklar,
  okuma }] }`. Her alıcı bir kez (veli iki çocuk için iki kopya almışsa `cocuklar` iki ad). Yalnız `okumaGorebilir`
  (gönderen; duyuruda okulun müdürü); değilse 403 "Bu bilgiyi görme yetkin yok". Sınır yok: bütün alıcılar gelir.
- **`GET /api/mesajlar/<id>`** — tek mesaj. Alıcı ya da gönderen değilsen 403 "Bu mesajı görme yetkin yok". Alıcı ilk
  kez açıyorsa okundu yazılır. Cevap `{ mesaj: { ...mesajOzeti, govde, ekler, okumaGorur?, kisiSayisi?, okuyanSayisi? } }`;
  son üçü yalnız okuma bilgisini görebilene. `ekler` `hedefinEkleri('mesaj', id)`.

Bunlardan hiçbirine uymayan istek (ör. `DELETE`) `false` döner, yönlendirici 404 verir.

## Kimle konuşur?

- Çağırdıkları:
  - `../guvenlik` → `hizSinir`;
  - `../http` → `bad`, `ok`;
  - `../iliskiler` → `branchOf`, `sinifOgrencileri`, `teachersOfStudent`;
  - `../ortak` → `clean`, `now`, `uid` (mesaj kimliği `m` önekli);
  - `../veri` → `depo`, `topluBildir` (bildirimler tablosu), `islem`;
  - `./ekler` → `ekleriDogrula`, `ekleriBagla`, `hedefinEkleri`;
  - `../yetki` → `okulGerek`, `yetkiVarMi` (`admin` ve `principal` her yetkiye sahip; öğretmende rolündeki yetkiler).
- Depo ve tablolar:
  - `depo.mesajlar` (`sunucu/veri/depo/mesajlar.js`) → `mesajlar`, `mesaj_alicilari`, `mesaj_okumalari` (+ adlar için
    `kullanicilar`, sınıf için `siniflar`): `kutuOzeti`, `okunmamisSayisi`, `ekle`, `bul`, `duzelt`, `sil`,
    `alicidanKaldir`, `okumaDurumu`, `okundu`;
  - `depo.kullanicilar` → `kullanicilar`, `mesaj_engelleri`, `veli_baglari`: `okulun`, `cocukIdleri`, `velileri`,
    `veliHaritasi`, `engelliler`, `engelleriYaz`, `engelHaritasi`, `guncelle` (`mesaj_kimden` sütunu);
  - `depo.siniflar` → `bul`, `ozetleri`.
- Onu çağıranlar: `sunucu/api.js` (`BOLUM.mesajlar`); `sunucu/bolumler/anket.js` (`mesajAlicilariCoz`, hep `'duyuru'`
  türüyle).
- Ön yüz: `public/js/parcalar/19-mesajlar.js` (kutu, yeni mesaj, düzeltme, okuma listesi), `25-tiklama.js` (silme,
  ayar kaydı), `19b-anketler.js` (anket hedefi seçerken `/mesajlar/hedefler`), menü ve ana sayfa kutucuğu
  (`06-menu.js`, `08-ana-sayfa.js`).
- Android uygulaması bu uçları bugün çağırmıyor (grep; uygulama bildirimleri `/api/notifications` ve `/api/cihaz`
  üzerinden alır).

## Nasıl çalışır (adım adım)?

```
POST /api/mesajlar  { tur, konu, govde, hedef, ekIdler }
  hizSinir(30/saat) -> tur/yetki -> konu, govde
  mesajAlicilariCoz:
     hedef.tur ─┬─ okul  (mesaj.herkese) ─┐
                ├─ rol   (mesaj.toplu)  ──┤
                ├─ sinif (mesaj.toplu)  ──┼─> seçilenler (tekil)
                └─ kisi  (yazılabilirler)─┘
     duyuru değilse: engel + kimden ayarı süzgeci  -> elenen
     öğrenciler -> onaylı velileri de { id, ogrenciId }
  ekleriDogrula -> islem { mesajlar + mesaj_alicilari ; ekleri bağla }
  topluBildir(alıcılar) -> cevap { gonderilen, elenen, message }
```

Okuma: gelen kutusu satırı açılınca `GET /api/mesajlar/<id>` okundu yazar; gönderen (duyuruda müdür) "N/M okudu"
sayısını ayrıntıda görür, adları `GET /api/mesajlar/okuma` ile çeker.

## Dikkat!

- **Duyuru ayarları aşar.** `mesajGidebilirMi` duyuruda engel ve "kimden" ayarına bakmaz; bu bilinçli (kod yorumu: kar
  tatili duyurusu herkese ulaşmalı). Anketler de bu yüzden `'duyuru'` türüyle çözülür.
- **Okundu sayıları yalnız gönderene.** Kod yorumu: alıcı, velilerin ya da başkalarının okuyup okumadığını bu sayılardan
  çıkaramasın. Bu yüzden `kutuSatiri` gelen kutusunda `kisiSayisi`/`okuyanSayisi` göndermez; `aliciSayisi` ise her iki
  kutuda da gider (veli kopyaları dahil satır sayısı).
- Küçük tutarsızlık: müdür, kendisine gönderilmemiş (ör. bir öğretmenin sınıfa yayımladığı) bir duyuruyu tek mesaj
  ucunda açamaz (403 "Bu mesajı görme yetkin yok"), ama `okuma` ucundan o duyurunun okundu listesini alabilir.
- `kutuOzeti` metnin yalnız ilk 400 harfini çeker; önizleme 140 harf. Kutuda en çok 200 satır gelir, sayfalama yok.
- Gönderen mesajı silince `DELETE FROM mesajlar` çalışır (alıcılar, okumalar ve mesajın `ekler` satırları tablo
  ilişkisiyle — `ON DELETE CASCADE` — gider; kaydı kalmayan ek dosyalarını diskten `ekler.js`'in saatlik `ekSupur`'u,
  2 saatten eskiyse, siler). Alıcı kaldırınca yalnız kendi `mesaj_alicilari` satırı silinir; gönderenin hesabı da silinmişse ve hiç alıcı kalmadıysa mesaj da silinir.
- **Mesajın ekleri mesajdan kısa yaşar.** Mesaj silinene kadar durur, ama her ekin yüklendiği anda konan bir bitişi var
  (yükleme + 7 gün, [ekler.md](ekler.md)); süresi dolan ekin dosyası silinir, mesajda ek `suresiDoldu: true` olarak
  görünür ve indirme 410 "Dosyanın süresi doldu (7 gün)." alır.
- Eklenen mesaj geri okunmaz (depo yorumu: okula duyuruda 1360 alıcının adlarıyla yeniden toplanması gereksizdi); cevaptaki
  `mesaj` nesnesi eldeki bilgilerle kurulur.
- Hız sınırı `hizSinir` her çağrıda sayar: 30 hatalı deneme de sınırı doldurur. Düzeltme sınırı ise ancak sahiplik
  denetiminden sonra sayılır.
- Hedef listesindeki `kapali` kişiye mesaj yazılırsa istek hata vermez; o kişi elenir ve `elenen` artar. Hepsi elenirse
  400 "Alıcı kalmadı…".
- Engel listesi 200 kişiyle sınırlı ve yalnız okuldaki kişileri tutar; başka okula geçen kişi sonraki kayıtta listeden düşer.

## Testleri

- `testler/test-mesaj.js` — 11 bölüm: hedefler (öğrencinin görebildikleri), kişiye mesaj, veli kopyası, okundu işareti,
  yetkisiz hedef, izin ayarı (`personel`: veli yazamaz, öğretmen yazabilir), engel listesi, duyurunun ayarları aşması,
  sınıfa duyuru, uzun metin ve boşluk, silme (gönderen/alıcı).
- `testler/test-anket.js` — anketin duyuru olarak gitmesi, `?kutu=giden` ve `okuma?id=`.
- `testler/test-etut.js` bölüm 5 "Mesaj düzeltme" — alıcı düzeltemez (403), gönderen düzeltir, alıcı yeni metni görür,
  boş konu 400.
- `testler/test-yorum-ek.js` — ekli mesaj (`ekIdler`): başkasının ekiyle gönderilemez, alıcı eki görür, aynı ek ikinci
  mesaja bağlanamaz, toplam sınırı aşan iki ek reddedilir.
- `testler/yetki-denetimi.js` (her rol × uç), `testler/girdi-denetimi.js` (bozuk gövde 500 vermemeli),
  `testler/test-servis-konum.js` (servisçinin hedef listesi boş, `topluIzin` yok), `test-servis-yoklama.js` (mesaj
  bildiriminin telefona `/api/cihaz/bildirimler` ile gelmesi), `test-giris-kayit.js` (rolsüz hesap mesaj uçlarında 403).
- Elle: öğretmen hesabıyla (`testler/seed.js`) giriş yap, `POST /api/mesajlar` ile
  `{ "tur": "mesaj", "konu": "Deneme", "govde": "Merhaba", "hedef": { "tur": "kisi", "kisiler": ["<öğrenci id>"] } }`
  gönder; öğrencinin velisinin gelen kutusunda da görünmeli.

## Son durum

- Son commit `566b917 commit 524` (2026-09-27): yalnız yorum değişti — ek sınırı notu "toplam 150 MB" yerine "toplam
  50 MB" (canlı hazırlığında bir mesajın ek toplamı 50 MB'a indi; sınırın kendisi `ekler.js`'te).
- `a6665fb commit 105` (2026-08-29): dosyanın sonuna `module.exports` eklendi (aynı commit ön yüzdeki
  `19-mesajlar.js`'i de getirdi); `22169af commit 104` (aynı gün) dosyanın ilk hâli (389 satır).
- Açık iş yok. Sıradaki planlı değişiklikler: "Mesaj ayarları (çark), Bu mesajı bildir, Ajanda…" işi (adından: mesaj
  ayarları ve mesaj bildirme) bu dosyaya dokunacak; "Optimizasyon + saklama süreleri" işi mesajların 1 yıl
  saklanmasını getirecek. "Anket düzenleyici" işi (onaylı) anketin mesaja ek olarak konmasını getirecek (mesajın
  alıcıları anketin hedefi olur). "Düzenleyiciler" işi (kullanıcı 28 Eylül akşamı onayladı) buraya üç şey getirecek:
  mesaj ve duyuru metni için ortak yazı düzenleyici (kalın, liste, bağlantı…; sunucu izinli biçim dışındakini siler),
  hazır mesaj şablonları ve kişiye özel alanlar (`{öğrenci}`, `{sınıf}`, `{veli}`: toplu mesaj her veliye kendi
  çocuğunun adıyla gider) ve ileri tarihli gönderim ("şu gün şu saatte gönder").
