# public/js/parcalar/02-ikonlar.js

Çizgi ikonlar (`IKONLAR`, `ik`), baş harfli renkli yuvarlak (`avatar`), tarih ve gün yazıcıları, ödev süresi etiketi,
Türkçe harfleri sadeleştiren arama yardımcısı (`nrm`) ve ödev sonucu / rol adı tabloları.

## Bu dosya ne yapar?

Adı "ikonlar" ama içi bir çekmece: ekranların ortak kullandığı küçük GÖRÜNÜM yardımcılarının hepsi burada.

- **İkonlar.** Arayüzde emoji kullanılmaz (kullanıcının kuralı). Onun yerine elle yazılmış 50 çizgi ikon var; hepsi 24×24,
  `currentColor` ile çizilir, yani bulunduğu yazının rengini ve boyunu alır. `ik('odev')` bir `<svg>` metni döner.
- **Profil yuvarlağı.** Fotoğraf yüklenmez (KVKK: çocuk fotoğrafı). Kişinin adının baş harfleri renkli bir yuvarlakta
  gösterilir; renk kişinin kimliğinden türetildiği için aynı kişi her ekranda aynı renktedir.
- **Tarihler.** Sunucu tarihleri `2026-09-04` ya da ISO zaman metni olarak gönderir; burada `04.09.2026`,
  `4 Eylül 2026, Cuma`, `04.09.2026 14:05` gibi Türkçe biçimlere çevrilir.
- **Ödevin kalan süresi.** "Süresi doldu", "Bugün 12:00'e kadar", "3 gün kaldı" etiketleri.
- **Arama.** "ogretmen", "ÖĞRETMEN", "öğretmen" aynı sonucu versin diye harfleri sadeleştiren `nrm`.
- **Sabit tablolar.** Ödev sonuç kodlarının Türkçe adı ve rengi (`SONUC`), rol kodlarının Türkçe adı (`ROL_AD`).

## İçinde neler var?

### İkonlar

- `IKONLAR` — ad → SVG yolları. 50 ikon: `ev`, `takvim`, `grafik`, `odev`, `sinav`, `ayar`, `cikis`, `ogrenci`,
  `ogretmen`, `veli`, `okul`, `sinif`, `onay`, `hayir`, `uyari`, `izinli`, `ara`, `ekle`, `geri`, `mudur`, `ders`,
  `bildirim`, `profil`, `indir`, `anahtar`, `kilit`, `saat`, `igne`, `telefon`, `posta`, `soru`, `grup`, `kutu`, `belge`,
  `goz`, `gozKapali`, `anket`, `yemek`, `servis`, `kulup`, `yukle`, `ek`, `konum`, `harita`, `hedef`, `yildiz`, `oynat`,
  `resim`, `muzik`, `alev`. `14c-quiz.js` yüklenirken tabloya `yukari` ve `asagi` oklarını ekler (tek dışarıdan ekleyen).
- `ik(ad, ek)` — `<svg class="ikon [ek]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>`. Bilinmeyen ad → `''` (hata vermez).
  `ek` ek CSS sınıfıdır (ör. `'buyuk'`).

### Profil yuvarlağı

- `AVATAR_RENKLERI` — 8 renk (kırmızı, turkuaz, turuncu, koyu turkuaz, mor, yeşil, kiremit, mavi).
- `basHarfler(ad)` — ilk ve son kelimenin ilk harfi, Türkçe büyük harfle: `"Ayşe Kaya"` → `"AK"`, `"ismail"` → `"İ"`;
  boş ad → `"?"`.
- `avatar(ad, anahtar, ek)` — `anahtar` (yoksa ad) üzerinden basit bir sayı özeti (`h * 31 + karakter`) → renk. Çıktı
  `<span class="avatar [ek]" style="--av:#…" aria-hidden="true">AK</span>`; baş harfler `esc`'ten geçer. Sağ üstteki
  profil düğmesinde anahtar `S.user.anaHesapId || S.user.id` (`26-baslat.js`): yetişkinin bütün portallarında aynı renk.

### Tarih ve gün

- `tarih(iso)` — `GG.AA.YYYY`; boşsa `-`; okunamazsa metnin kendisi (`esc`'li).
- `tarihSaat(iso)` — `GG.AA.YYYY SS:DD`, tarayıcının yerel saatiyle.
- `HAFTA_GUNLERI` — `['Pazar', 'Pazartesi', …, 'Cumartesi']` (JavaScript'in `getDay()` sırası: Pazar 0).
- `AY_ADI` — `['Ocak', …, 'Aralık']`. [04a-form-alanlari.md](04a-form-alanlari.md) (gün/ay/yıl seçici),
  [04e-tarih-secici.md](04e-tarih-secici.md) (takvim başlığı) ve `19c-okul-hayati.js` de kullanır.
- `tarihGun(iso)` — `"4 Eylül 2026, Cuma"`. 10 karakterlik tarih (`YYYY-AA-GG`) yerel gece yarısı sayılır.
- `tarihGunSaat(iso, saat)` — `"4 Eylül 2026, Cuma · 12:00"` (saat `esc`'li); saat yoksa yalnız gün.
- `gunAdi(iso)` — `"Cuma"`; boş ya da okunamazsa `''`.

### Ödev süresi

- `teslimGecti(iso, saat)` — `iso + 'T' + (saat || '12:00') + ':00'` anı (tarayıcının yerel saati) geçti mi. Saatsiz ödev
  12:00'de biter; sunucudaki kural da aynı ([../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md),
  `odevBitisAni`).
- `gunFarki(iso)` — son güne kaç takvim günü var (bugün 0, yarın 1, dün -1); boş/okunamaz → `null`.
- `kalanEtiketi(a)` — `a.endAt`, `a.endTime`'dan etiket: saat geçtiyse kırmızı "Süresi doldu"; son tarih yoksa mavi
  "Aktif"; son gün bugünse turuncu "Bugün 12:00'e kadar"; 1 gün kaldıysa turuncu, daha çoksa mavi "N gün kaldı".

### Arama

- `TR_SADE` — `ı İ I ş ğ ü ö ç â î û` (büyük/küçük) → `i s g u o c a i u`.
- `nrm(s)` — harf harf sadeleştirir, küçük harfe çevirir, baş/son boşluğu atar. İki metin karşılaştırılmadan önce ikisi de
  `nrm`'den geçer.

### Sabit tablolar

- `SONUC` — ödev sonuç kodu → `{ ad, renk }`: `yapti` "Yaptı" yeşil, `gec` "Geç yaptı" mavi, `yapmadi` "Yapmadı" kırmızı,
  `eksik` "Eksik" turuncu, `izinli` "Gelmedi (izinli)" gri, `gelmedi` "Gelmedi (izinsiz)" bordo. Kodlar sunucudaki
  sonuçlarla aynı ([../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md), `results`).
- `ROL_AD` — `student` Öğrenci, `parent` Veli, `teacher` Öğretmen, `principal` Müdür, `admin` Yönetici, `servisci`
  Servisçi.

## Kimle konuşur?

- Çağırdıkları: yalnız `esc` ([01-yardimcilar.md](01-yardimcilar.md)). İstek atmaz, `S`'ye dokunmaz.
- Onu kullananlar (işlev çağrısı olarak sayıldı):
  - `ik` — 28 parça ve 4 yönetim parçası; bu gruptan [04a-form-alanlari.md](04a-form-alanlari.md) (göz, uyarı),
    [04b-bildirim-izni.md](04b-bildirim-izni.md), [04d-ekler.md](04d-ekler.md), [04e-tarih-secici.md](04e-tarih-secici.md);
    menü (`06-menu.js`, ikon adları menü tanımlarında `g: 'ev'` gibi metin olarak durur), `14c-quiz.js`,
    `19i-servis-yoklama.js`, `19c-okul-hayati.js`, `09b-site-ayarlari.js` en çok kullananlar. `05a-dis-sayfalar.js`
    açılışta `index.html`'deki `data-ikon="…"` yerlerini `ik()` ile doldurur.
  - `avatar` — `05a-dis-sayfalar.js`, `10-mudur.js`, `11b-siniflarim.js`, `19-mesajlar.js`, `22-programim.js`,
    `25-tiklama.js`, `26-baslat.js`, `09-yonetici.js`.
  - `tarih` — `12-ogretmen-sinav.js`, `13-ogrenci-veli.js`, `28-grafik.js`; `tarihSaat` — 8 parça ve 4 yönetim parçası
    (mesajlar, anketler, teslimler, quiz, hatırlatıcılar, bildirim paneli, yedekler…); `tarihGun` —
    [04e-tarih-secici.md](04e-tarih-secici.md), `05a`, `11b`, `14c`, `16-egitim-yili.js`, `18-devamsizlik.js`,
    `19h-hatirlaticilar.js`, `27b-aile.js`; `tarihGunSaat` — `11-ogretmen-odev.js`, `11b-siniflarim.js`,
    `14-odev-filtre.js`, `27-veli-panel.js`; `gunAdi` — 04e, `17-takvim.js`, `27b-aile.js`.
  - `teslimGecti` — `11-ogretmen-odev.js`, `14-odev-filtre.js`, `27-veli-panel.js`; `gunFarki` — `11-ogretmen-odev.js`;
    `kalanEtiketi` — `11b-siniflarim.js`, `14-odev-filtre.js`, `27-veli-panel.js`.
  - `nrm` — `10-mudur.js`, `14-odev-filtre.js`, `19-mesajlar.js`, `19b-anketler.js`, `19c-okul-hayati.js`,
    `24-bildirim-arama-mobil.js`.
  - `SONUC` — `11-ogretmen-odev.js`, `11b-siniflarim.js`, `14-odev-filtre.js`, `27-veli-panel.js`; `ROL_AD` —
    `08-ana-sayfa.js`, `10-mudur.js`, `10b-hesaplar.js`, `15-aktarim.js`, `19-mesajlar.js`, `19b-anketler.js`,
    `23-veli-ayarlar.js`.
  - Yalnız bu dosyanın içinde kullanılanlar: `AVATAR_RENKLERI`, `basHarfler`, `HAFTA_GUNLERI`, `TR_SADE`.
- CSS: `.ikon` boyu ve hizası `public/css/parcalar/12-ikonlar.css` (başka parçalar yerinde büyütür); `.avatar` ve
  `.avatar.kucuk/.buyuk` yine `12-ikonlar.css` (`--av` değişkeni zemin rengi); `kalanEtiketi`'nin `.etiket.kirmizi/mavi/
  turuncu` renkleri ve `SONUC`'taki `yesil/gri/bordo` `public/css/parcalar/04-kartlar.css`.
- Rol: herkes; açılış sayfasının ikonları giriş yapmamış ziyaretçide de çizilir.

## Nasıl çalışır (adım adım)?

### Bir ikonun yolculuğu

```
06-menu.js:  { k: 'odevler', g: 'odev', ad: 'Ödevler' }
                 │
                 ▼
ik('odev') ──► IKONLAR.odev (SVG yolları) ──► '<svg class="ikon" … stroke="currentColor">…</svg>'
                 │
                 ▼
innerHTML'e yazılır; rengi menü yazısının rengi, boyu 12-ikonlar.css'teki .ikon
```

### Tarihin iki yolu

```
'2026-09-04'            ─ tarihGun ─► new Date('2026-09-04T00:00:00')  (yerel gece yarısı) ─► "4 Eylül 2026, Cuma"
'2026-09-04'            ─ tarih    ─► new Date('2026-09-04')           (UTC gece yarısı!)  ─► "04.09.2026" (Türkiye'de)
'2026-09-04T11:05:00Z'  ─ tarihSaat ─► yerel saat                                          ─► "04.09.2026 14:05" (UTC+3)
```

### Ödev etiketi

```
kalanEtiketi({ endAt: '2026-10-05', endTime: '15:40' })
  teslimGecti? ── evet ─► "Süresi doldu" (kırmızı)
  gunFarki = null ─► "Aktif" (mavi)       gunFarki ≤ 0 ─► "Bugün 15:40'e kadar" (turuncu)
  gunFarki = 1 ─► "1 gün kaldı" (turuncu) gunFarki > 1 ─► "N gün kaldı" (mavi)
```

## Dikkat!

- **Dosya adı içeriği anlatmıyor.** Tarih, arama ve sonuç tabloları da burada; bir tarih yardımcısı ararken bu dosyaya
  bak. [01-yardimcilar.md](01-yardimcilar.md)'nin baş yorumu "tarih/gün adları" orada diyor ama burada.
- **`ik(ad, ek)`'in açıklama yorumu yanlış yerde:** "ad: ikon adı, ek: ek CSS sınıfı" satırı `avatar` bölümünün üstünde
  duruyor; `ik`'i anlatıyor.
- **`ek` kaçırılmaz.** `ik`, `avatar` sınıf adını olduğu gibi yazar. Buraya yalnız sabit sınıf adı ver; kullanıcıdan gelen
  bir şeyi asla.
- **`tarih()` 10 karakterlik tarihi UTC sayar.** `new Date('2026-09-04')` UTC gece yarısıdır; Türkiye'de (UTC+3) aynı güne
  düşer, ama saati UTC'nin gerisinde olan bir ülkede bir gün önceyi gösterir. `tarihGun` ve `gunAdi` bunu `T00:00:00`
  ekleyerek önler. Yurt dışından kullanım önemli olursa `tarih()`'e de aynı düzeltme gerekir (kod değiştirilmedi).
- **Süre hesapları cihazın saatine dayanır.** `teslimGecti` ve `gunFarki` tarayıcının saatini kullanır; saati yanlış bir
  telefonda etiket yanlış olabilir. Asıl karar sunucuda (sunucunun yerel saati, Türkiye).
- **"'e kadar" eki sabit.** `kalanEtiketi` her saate `'e` ekler: `13:00'e` doğru, ama Türkçe okunuşa göre `12:00'ye`,
  `15:30'a`, `09:00'a` olmalı. Kod değiştirilmedi; saatin okunuşuna göre ek seçen küçük bir işlevle düzeltilebilir.
- **`index.html`'de ikonların kopyası var.** Üst çubuktaki Bildirimler, Ayarlar, Uygulamayı yükle, Profil düğmelerinin
  `<svg>`'leri sayfaya elle yazılmış; `IKONLAR`'da bir ikonu değiştirmek onları değiştirmez.
- **`igne` ikonu bugün hiçbir yerde ad olarak geçmiyor** (parçalarda ve `index.html`'de metin taraması; harita `ik(t.ikon)`
  ile `okul`, `ev`, `servis`, `konum`, `hedef` kullanıyor).
- **`HAFTA_GUNLERI` Pazar'la başlar** (JavaScript sırası). Pazartesiyle başlayan takvimler kendi kısaltmalarını tutar
  ([04e-tarih-secici.md](04e-tarih-secici.md) `TS_GUN_KISA`).
- **Avatar rengi kimliğe bağlı, isme değil** (anahtar verilirse). Adı değişen kişinin rengi değişmez; anahtar verilmeyen
  yerde renk addan çıkar.

## Testleri

- Bu dosyanın doğrudan birim testi yok.
- `testler/test-resim-kucult.js` — dosyayı başsız tarayıcıya yükler; ek satırlarında `ik('belge')` kullanılır.
- `testler/test-quiz-metin.js` — `14c-quiz.js`'i bir vm bağlamında `ik`, `tarihGun`, `tarihSaat`, `teslimGecti`
  taklitleriyle çalıştırır (bu dosyanın kendisi yüklenmez, imzaları taklit edilir).
- `testler/test-kucult.js` (paket derleniyor mu), `testler/yazim-denetimi.js` (Türkçe metinler).
- Elle: ödev listesinde son günü bugün olan bir ödev "Bugün … kadar" (turuncu), geçmiş saatli ödev "Süresi doldu"
  göstermeli; arama kutusuna "ogretmen" yaz, "Öğretmen" geçen satırlar da bulunmalı.

## Son durum

- `git log`: 3 commit, üçü de 2026-09-26. Dosya parça parça kuruldu: `aaaa2aa commit 419` `IKONLAR` tablosunu (50 ikon),
  `beef629 commit 420` avatar, `ik`, tarih/gün yazıcıları, `teslimGecti`, `gunFarki`, `kalanEtiketi`, `TR_SADE`, `nrm`'i,
  `15659b2 commit 421` `SONUC` ve `ROL_AD` tablolarını ekledi. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): "'e kadar" eki, `tarih()`'in UTC okuması, yanlış yerdeki yorum, kullanılmayan
  `igne` ikonu.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Çok dil" (`AY_ADI`, `HAFTA_GUNLERI`, `SONUC`, `ROL_AD`, "gün kaldı"
  gibi metinler çeviri kataloğundan gelecek; sağdan sola dillerde ok ikonlarının yönü de düşünülmeli); "Paneller"
  (okul gezgini klasör ve dosya simgeleri isteyecek — bugün `IKONLAR`'da klasör simgesi yok). Birkaç iş yeni rol adı
  getiriyor: "Paneller" destek ekibi, "Eğitim içerikleri" eğitmen, "Çok dil" çevirmen, "Çalışan olarak ekleme" çalışan ve
  özel roller (Kodlayıcı vb.). Bunlardan `role` değeri olanlar `ROL_AD`'a satır ister.
