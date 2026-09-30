# public/js/parcalar/08-ana-sayfa.js

Bütün sayfaların kaydı olan `SAYFALAR` nesnesinin doğduğu yer ve her rolün ana sayfası (`SAYFALAR.ana`): renkli
kutucuklar, sayaçlar, yaklaşan ödevler, müdürde okulun dosya alanı kartı.

## Bu dosya ne yapar?

Giriş yapınca ilk gördüğün ekran "ana sayfa"dır ve herkeste başkadır:

- **Öğrenci:** "Merhaba Elif, bugün ne öğreneceksin?"; ödev serisi şeridi; Ödevler / Sınavlarım / İlerleyişim / Ayarlar
  kutucukları (aktif ödev sayısı, sınav grubu sayısı, not ortalaması); altında aktif ödevlerin listesi.
- **Veli:** "çocuklarının durumu bir arada": Ödevler / Devamsızlık / İlerleyiş / Mesajlar / Çocuklarım / Ayarlar
  kutucukları; altında bütün (ya da seçili) çocukların yaklaşan ilk 6 ödevi, her satırda hangi çocuğun olduğu.
- **Öğretmen:** Ödevler / Sınavlar / Yoklama / Ayarlar; "Sınıfım · Aktif ödev · Sonuçlanan ödev" sayaçları; aktif ödevleri.
- **Müdür:** okulun tamamına bakar: Öğretmenler (bekleyen başvuru varsa sayısı) / Öğrenciler / Sınıflar / Ders Programı /
  Devamsızlık / Excel Aktarım / Ayarlar; öğrenci-öğretmen-sınıf sayaçları; okulun dosya alanı (disk) kartı; okul yeni
  kurulduysa "nereden başlayacağını" söyleyen ipucu. Ödev vermek, sınav açmak öğretmen işidir; müdür yapabilse de ana
  ekranı onlarla dolmaz.
- **Servisçi:** ana sayfası servis yoklamasıdır (`19i-servis-yoklama.js`).
- **Sistem yöneticisi:** ana sayfası yönetim paketindedir (`YONETIM.anaSayfa`).
- **Yetişkin hesabı, portal dışında (ya da rolsüz):** "Portalların" kartları ya da "Henüz bir portalın yok"
  ([08c-kisilikler.md](08c-kisilikler.md) `portalAnaSayfasi`).

Dosyanın ikinci ve daha temel görevi: `var SAYFALAR = {}`. Ön yüzdeki her ekran bu nesneye `SAYFALAR['sayfa-adi'] =
function () {…}` diye kaydolur; `git()` ([07-yonlendirme.md](07-yonlendirme.md)) sayfayı buradan bulur.

## İçinde neler var?

### `SAYFALAR`

Sayfa anahtarı → sayfayı çizen işlev (söz döndürür ya da hiçbir şey). Bu dosya yalnız `ana`'yı ekler; öbür 39 sayfa
sonraki parçalarda (ör. `ogretmenler` ve `okul-ogrenciler` [10-mudur.md](10-mudur.md)'de), 6 sayfa da yönetim paketinde
(`public/js/yonetim/`) eklenir.

### `SAYFALAR.ana()`

`ad` = `S.user.fullName`'in ilk kelimesi. Sırayla:

1. `portalDisindaMi() || !u.role` → `portalAnaSayfasi()` ([08c-kisilikler.md](08c-kisilikler.md)).
2. `servisci` → `servisYoklamaSayfasi()` (`19i-servis-yoklama.js`).
3. `admin` → `YONETIM` doluysa `YONETIM.anaSayfa(ad)` (`public/js/yonetim/09a-yonetim-paneli.js`); boşsa (yönetici
   yönetim paketi olmadan açıldıysa) `bosKutu('kilit', 'Bu hesabın ekranları bu adreste açılmıyor. Sayfayı yenile.')`.
4. **Veli** (`parent`):
   - `GET /api/parent/children` → `S.children` bu listeyle yenilenir.
   - `cocuklarIcin('/progress')` (`27-veli-panel.js`): şeritte bir çocuk seçiliyse (`S.veliCocuk`) yalnız o, değilse her
     çocuk için `GET /api/progress?studentId=<çocuk>`.
   - Durumu `active` olan ödevler toplanır, her birine `cocuk` eklenir, son teslime (`endAt`) göre sıralanır.
   - Kutucuklar: Ödevler (turuncu, "N aktif ödev" / "Aktif ödev yok", rozet N), Devamsızlık (kırmızı, "Derse katılım"),
     İlerleyiş (camgöbeği), Mesajlar (mavi, "Öğretmenlerle yazışma"), Çocuklarım (mor, "N öğrenci bağlı" / "Henüz çocuk
     eklenmedi"), Ayarlar (gri).
   - Çocuk yoksa "Çocuğunu eklemek için Çocuklarım sayfasına git ve veli kodunu gir."; varsa "Yaklaşan ödevler" başlığı
     ve `veliOdevListesi(aktif.slice(0, 6))` (`27-veli-panel.js`) ya da "Şu an açık ödev yok."
5. **Öğrenci**:
   - `GET /api/progress` → `aktif` (durumu `active` olan ödevler), `ort = genelOrtalama(d)`.
   - Ödev bölümü açıksa `seriSeridi(d.seri)` (`14-odev-filtre.js`: ödev serisi).
   - Kutucuklar: Ödevler (turuncu, sayı ve rozet), Sınavlarım (mavi, "N sınav grubu"), İlerleyişim (camgöbeği,
     "Ortalama X" / "Not girilmedi"), Ayarlar (gri, "Hesabın ve veli kodun").
   - "Yaklaşan ödevler": `odevListesiOgrenci(aktif)` (`14-odev-filtre.js`, bütün aktifler) ya da "Aktif ödevin yok. Harika!".
6. **Müdür** (`principal`):
   - `GET /api/school/ozet` — tek küçük istek; okulun bütün öğrenci listesini indirmeden sayılar:
     `{ ogrenci, sinifsiz, ogretmen, bekleyen, sinif, disk? }`.
   - Başlık: "Merhaba Ali — <okul adı> müdürü".
   - Kutucuklar: Öğretmenler (yeşil; `bekleyen` varsa "N başvuru bekliyor" ve rozet, yoksa "N öğretmen"), Öğrenciler
     (lacivert), Sınıflar (camgöbeği), Ders Programı (mavi), Devamsızlık (turuncu, "Okul geneli yoklama özeti"), Excel
     Aktarım (mor; `yetkim('aktarim.yap')` ile — müdürde hep doğru), Ayarlar (gri).
   - Sayaçlar: Öğrenci, Öğretmen, Sınıf (`stat`).
   - `o.disk` geldiyse `okulDiskKarti(o.disk)` ([08d-okul-disk.md](08d-okul-disk.md)).
   - Sınıf yoksa "Henüz sınıf açmadın. Sınıflar sayfasından başlayıp derslerini tanımla, sonra öğretmen ata.";
     sınıf var öğrenci yoksa "Okulda kayıtlı öğrenci yok. Tek tek ekleyebilir ya da Excel Aktarım ile listeyi toplu
     yükleyebilirsin."
7. **Öğretmen** (geri kalan):
   - Ödev bölümü açıksa `GET /api/assignments/hedefler` ve `GET /api/assignments` birlikte; kapalıysa istek atılmaz,
     boş listelerle devam edilir.
   - Başlık: "Merhaba Ayşe — <branş> Öğretmen · <okul adı>" (`ROL_AD`, [02-ikonlar.md](02-ikonlar.md)).
   - Kutucuklar: Ödevler (turuncu, aktif ödev sayısı), Sınavlar (mavi, "Sınav grupları ve notlar"), Yoklama (yeşil,
     "Derse katılım al"), Ayarlar (gri).
   - Sayaçlar: Sınıfım (kimliği olan sınıflar; "Sınıfsız öğrenciler" kutusu sayılmaz), Aktif ödev, Sonuçlanan ödev
     (aktif olmayan her ödev).
   - Sınıf listesi boşsa "Henüz bir dersin yok. Okul müdürünün seni bir derse ataması gerekiyor."
   - Ödev açıksa "Aktif ödevler": `odevListesiOgretmen(aktif)` (`11-ogretmen-odev.js`) ya da "Aktif ödev yok. Ödevler
     sayfasından yeni ödev verebilirsin."

Her kolda sayfa `yaz(...)` ile çizilir (yıl şeridi + alt bilgi, [07-yonlendirme.md](07-yonlendirme.md)); kutucuklar
`kutucuklar()` ile, okulun kapattığı bölümün kutucuğu kendiliğinden düşer.

### Yardımcılar

- `stat(n, l)` — sayaç kutusu: `<div class="stat"><div class="n">42</div><div class="l">Öğrenci</div></div>` (ikisi de
  `esc`'li). Başka kullananlar: `15-aktarim.js` (aktarım önizlemesi), `18-devamsizlik.js` (devamsızlık sayımı),
  `public/js/yonetim/09a-yonetim-paneli.js` (yöneticinin ana sayfası).
- `genelOrtalama(d)` — `/api/progress` cevabındaki `examGroups`'un `average` değerlerinden (her biri 0–100 arası yüzde,
  `null` olanlar atlanır) düz ortalama, bir ondalığa yuvarlanmış; hiç yoksa `null`. Yalnız bu dosyada.

## Kimle konuşur?

- Çağırdıkları:
  - `S`, `YONETIM` ([00-durum.md](00-durum.md)); `api`, `esc` ([01-yardimcilar.md](01-yardimcilar.md)); `ROL_AD`
    ([02-ikonlar.md](02-ikonlar.md));
  - `yaz`, `hero`, `bosKutu`, `kutucuklar` ([07-yonlendirme.md](07-yonlendirme.md)); `ozellikAcik` ([06-menu.md](06-menu.md));
  - `portalDisindaMi`, `portalAnaSayfasi` ([08c-kisilikler.md](08c-kisilikler.md)); `okulDiskKarti` ([08d-okul-disk.md](08d-okul-disk.md));
  - `yetkim` (`21-ders-programi.js`), `servisYoklamaSayfasi` (`19i-servis-yoklama.js`), `cocuklarIcin`,
    `veliOdevListesi` (`27-veli-panel.js`), `seriSeridi`, `odevListesiOgrenci` (`14-odev-filtre.js`),
    `odevListesiOgretmen` (`11-ogretmen-odev.js`).
- Sunucu uçları:
  - `GET /api/parent/children` → `{ children: [{ id, fullName, schoolId, schoolName, code }] }` —
    [../../../sunucu/bolumler/veli.md](../../../sunucu/bolumler/veli.md).
  - `GET /api/progress` (öğrenci) ve `GET /api/progress?studentId=` (veli) → `{ student, assignments, subjects,
    examGroups, exams, kapaliOzellikler, seri? }` (`seri` yalnız öğrencinin kendisine); okulda ödev ya da sınav
    kapalıysa o kısım boş gelir —
    [../../../sunucu/bolumler/ilerleyis.md](../../../sunucu/bolumler/ilerleyis.md).
  - `GET /api/school/ozet` → sayılar (+ yalnız müdüre `disk`) — [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)
    (disk hesabı [../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md)).
  - `GET /api/assignments/hedefler`, `GET /api/assignments` — [../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md).
  - Yöneticinin `GET /api/admin/overview`'u artık `YONETIM.anaSayfa` içinde ([../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md)).
- Onu kullananlar:
  - `SAYFALAR` — [07-yonlendirme.md](07-yonlendirme.md) (`git`, `sayfayiYenile`), [08c-kisilikler.md](08c-kisilikler.md)
    (`oturumuDegistir`: hedef sayfa var mı), `24-bildirim-arama-mobil.js` (bildirimin sayfası var mı), `25-tiklama.js`
    (geri tuşu), `26-baslat.js` (açılış sayfası) ve sayfa ekleyen her parça.
  - `SAYFALAR.ana` — menüdeki "Ana Sayfa"/"Başlangıç"/"Yoklama" (`k: 'ana'`), açılış, portal geçişi.
  - `stat` — yukarıda.
- Görünüm: `public/css/parcalar/10-ana-sayfa-kutucuklari.css` (kutucuklar), `04-kartlar.css` (`.grid.k4`, `.stat`),
  `03-iskelet.css` (`.hero`, `h3.sb`), `02-form.css` (`.msg.bilgi`), disk kartı `36-ayar-kartlari.css`.
- Rol: her rol kendi kolunu görür (yukarıdaki liste).

## Nasıl çalışır (adım adım)?

```
git('ana') ─► SAYFALAR.ana()
   portal dışı / rolsüz ─► portalAnaSayfasi()           (08c)
   servisçi            ─► servisYoklamaSayfasi()       (19i)
   yönetici            ─► YONETIM.anaSayfa(ad)         (yönetim paketi)
   veli     ─► /parent/children ─► her çocuk için /progress?studentId= ─► aktif ödevler (+ çocuk) ─► yaz
   öğrenci  ─► /progress ─► aktif ödevler, ortalama, seri ─► yaz
   müdür    ─► /school/ozet ─► kutucuklar + sayaçlar + disk kartı + ipucu ─► yaz
   öğretmen ─► (ödev açıksa) /assignments/hedefler + /assignments ─► yaz
```

## Dikkat!

- **Öğretmenin kutucukları yetkiye bakmaz.** Menü "Ödevler", "Sınavlar", "Yoklama"yı yetkilere göre gösterir
  ([06-menu.md](06-menu.md)); ana sayfadaki aynı üç kutucuk ise yalnız okulun kapattığı bölümlere göre süzülür. Müdür
  bir öğretmenin sınav yetkilerini kapattıysa menüde "Sınavlar" yoktur ama ana sayfada kutucuğu durur; basan öğretmen
  sayfayı açar (liste `GET /api/exams` ile gelir), sınav açmaya ya da not girmeye kalkınca sunucunun yetki hatasını görür.
  Menü ile ana sayfa tutarsız. Kod okumasına göre; tarayıcıda denenmedi.
- **Ödev bölümü kapalıyken öğretmene yanlış ipucu.** Ödev kapalıysa istekler atılmaz ve sınıf listesi boş kalır; bu
  yüzden dersi olan öğretmen de "Henüz bir dersin yok. Okul müdürünün seni bir derse ataması gerekiyor." iletisini ve
  "Sınıfım 0" sayacını görür. Sınıf sayısı `hedefler`'den geldiği için ödev kapısına takılıyor.
- **Öğrenci ve velide "Yaklaşan ödevler" başlığı ödev kapalıyken de çıkar.** Sunucu ödev kapalı okulda listeyi boş
  döndürür; öğrenci "Aktif ödevin yok. Harika!", veli "Şu an açık ödev yok." görür (kutucuk düşer ama başlık kalır).
  Öğretmen kolu bunu `odevAcik` ile önlüyor, bu iki kol önlemiyor.
- **Ortalama noktalı yazılır.** `'Ortalama ' + ort` sayıyı JavaScript'in biçimiyle yazar: "Ortalama 85.5" (Türkçede
  "85,5" olmalı; başka yerler `sayiTR` kullanıyor). Ayrıca ortalama sınav gruplarının düz ortalamasıdır, ağırlıklı değil.
- **Öğretmen başlığının dil bilgisi.** "Matematik Öğretmen" (branş + `ROL_AD`) çıkar; "Matematik öğretmeni" olmalı.
- **Müdürün "başvuru bekliyor"u eski düzenin kalıntısı.** `bekleyen` eski usul (öğretmenin okulu kendisinin seçtiği
  dönemden) öğretmen başvurularını sayar; bugün öğretmen kişi koduyla eklenir, başvuru oluşmaz. Planlı temizlikte
  kalkacak (Son durum).
- **Excel Aktarım şartı müdürde her zaman doğru.** `yetkim` müdürde `true` döndüğü için `yetkim('aktarim.yap') ? … : null`
  ve arkasındaki `.filter(Boolean)` bugün etkisizdir; zararsız. Öğretmen kolundaki `.filter(Boolean)` de öyle.
- **Veli ana sayfası `S.children`'ı değiştirir.** `/parent/children` cevabı `S.children`'ın yerine yazılır; menü ve
  çocuk şeridi bu listeyle çalışır. Zararsız: `/api/me`'deki `children` da aynı depo işlevinden
  (`depo.kullanicilar.cocuklari`) gelir, biçim aynıdır.
- **Seçili çocuk ana sayfayı daraltır.** Veli portalında bir çocuk seçiliyse (`S.veliCocuk`) yalnız onun ödevleri
  gelir; "Çocuklarım" kutucuğu yine bütün çocukları sayar.
- **Yeni sayfa ekleyen parça bu dosyadan SONRA gelmeli.** `SAYFALAR` burada `var SAYFALAR = {}` ile kurulur; ad
  sırasında 08'den önce gelen bir parça yüklenirken `SAYFALAR.x = …` yazarsa hata verir (bugün öyle bir parça yok).
- Müdür ana sayfası kasıtlı olarak `/school/students`'ı çağırmaz: 720 öğrencilik bir okulda liste büyük; sayılar
  `/school/ozet`'in tek sorgusundan gelir.

## Testleri

- `testler/buton-denetimi.js` (sunucusuz) — kutucuklardaki her `k`'nın (`{ k, …, ikon }`) bir `SAYFALAR` sayfası
  olduğunu denetler.
- `testler/test-okul-disk.js` — müdürün `/school/ozet`'te `disk`'i görmesi, öğretmenin görmemesi (disk kartının verisi).
- `testler/test-ozellikler.js` — ödev/sınav kapalı okulda `/api/progress`'in o kısımları boş döndürmesi.
- `testler/test-siniflarim.js` — ödev serisi (`seri`, öğrencinin şeridi).
- `testler/test-okul-agi.js` — 300 öğrencinin aynı ağdan öğrenci ana sayfasının gerçek isteklerini (eğitim yılı, site,
  ilerleyiş, bildirimler) yapıp 429/503 almaması.
- `testler/test-yetiskin.js` — rolsüz / iki portallı yetişkin hesabının ana sayfası kararını besleyen `kisilikSec`.
- Elle (3200, `testler/seed.js`'in hazır hesaplarıyla): öğrenciyle gir → kutucuklar ve aktif ödevler; müdürle →
  sayaçlar ve "Okulun dosya alanı" kartı; matematik öğretmeniyle → "Sınıfım" sayacı ve aktif ödevler; müdürle Ödevler
  bölümünü kapat, öğretmenle ana sayfaya dön → yukarıdaki "Henüz bir dersin yok" durumu görülür.

## Son durum

- `git log`: 7 commit. Dosya `b325b83 commit 35` (2026-08-28) ile doğdu (`var SAYFALAR = {}` ve `stat`);
  `79ed25d commit 205` (2026-09-25) `genelOrtalama`'yı, `da5e50c commit 257` (2026-09-25) `SAYFALAR.ana`'yı ekledi
  (o commit'te yalnız ekleme var; başka bir dosyadan silinen yok).
- Son değişiklik `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): müdürün ana sayfasına `okulDiskKarti(o.disk)`
  ("Okulun dosya alanı" kartı) eklendi.
- Ondan önce `276c0a0 commit 521` (2026-09-27, gizli yönetim paneli): yöneticinin ana sayfası (`/api/admin/overview`,
  kutucuklar, sayaçlar) bu dosyadan çıktı, `YONETIM.anaSayfa(ad)`'a gitti; yönetim paketi yoksa "Bu hesabın ekranları
  bu adreste açılmıyor." `24050a2 commit 518` (2026-09-27, servis yoklaması): servisçinin ana sayfası `SAYFALAR.seferim()`
  yerine `servisYoklamaSayfasi()`. `0acca75 commit 516` (2026-09-27, portallar): rolsüz hesapta "rol seçimi" sayfası
  yerine `portalAnaSayfasi()`, şart `portalDisindaMi() || !u.role`; yöneticinin ana sayfasında "Onay Bekleyenler"
  kutucuğu ve "Bekleyen başvuru" sayacı kalktı, yerine "Müdürler" kutucuğu geldi, "Okullar"ın alt yazısına "· Okul aç"
  eklendi (o ana sayfa 521'de yönetim paketine taşındı).
- Bilinen açıklar (kod değiştirilmedi): öğretmen kutucuklarının yetkiye bakmaması, ödev kapalıyken "Henüz bir dersin yok",
  öğrenci/velide boş "Yaklaşan ödevler" başlığı, noktalı ortalama, "Matematik Öğretmen" (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Paneller" (iş 5) — tanımdaki "onay bekleme kalıntıları" temizliği, müdürün
  "N başvuru bekliyor" kutucuğunu da ilgilendirir (öğretmen başvurusu kalıntısı "çok gerekli olmayanlar" listesinde);
  "Çalışan olarak ekleme" (iş 2: rolsüz çalışanın "Okul yönetimi sana henüz bir görev vermedi." ana ekranı); "Eğitim
  içerikleri" (iş 17: ana sayfada görünme — kararı bekliyor); "Mesaj ayarları … Ajanda" (iş 8); "Üst şerit" (iş 29:
  portal ana sayfasında bir kez çıkan "telefonuna kur" kartı); "Çok dil" (iş 22).
