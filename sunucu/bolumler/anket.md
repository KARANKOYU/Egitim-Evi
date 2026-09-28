# sunucu/bolumler/anket.js

Tek soruluk okul anketleri (`/api/anketler`): anket açma, oy verme/değiştirme/geri alma, kapatma, silme ve sonuçlar;
gizli ankette kimin neyi seçtiğinin hiç gönderilmemesi.

## Bu dosya ne yapar?

Toplu mesaj yetkisi olan kişi (müdür ya da `mesaj.toplu` verilmiş öğretmen) okula, bir rol grubuna ya da sınıflara tek
soruluk bir anket açar: "Veli toplantısı hangi gün olsun? Pazartesi / Salı". Hedefteki herkes bitişe kadar bir oy verir,
fikrini değiştirebilir ya da oyunu geri alabilir. Anketi açan ve okulun müdürü sonuçları her an görür; hedefteki kişiler
anket bitince görür. "Gizli" ankette kimin neyi seçtiği hiç kimseye gönderilmez (dosya başı yorumu).

Kurallar hem sunucuda hem veritabanı sorgusunda: hedef listesi açılışta çözülüp `anket_hedefleri`'ne yazılır; oy yalnız
açık ankette, listedeki kişi için ve o anketin seçeneğine yazılır (`depo.anketler.oyVer` tek `INSERT … SELECT … WHERE`
ile). Hedef, mesajlardaki duyuru kuralıyla çözülür ([mesaj.md](mesaj.md) → `mesajAlicilariCoz`): öğrencilere giden
anket onaylı velilerine de gider. Okul "Anket" bölümünü kapatabilir (`api.js` → [ozellikler.md](ozellikler.md),
`anketler → anket`).

## İçinde neler var?

### Sabitler

- `SECENEK_EN_AZ` — 2; `SECENEK_EN_FAZLA` — 10; `EN_UZUN_GUN` — 90 (anket en çok 90 gün açık kalır).

### Dışa açılan

- `uclar(k)` — `p === 'anketler'` ise `anketUclari(k)`'ya verir, değilse `false`.

### İç işlevler

- `yonetebilir(me, a)` — sonuç, kapatma, silme: anket kişinin okulundaysa ve kişi anketi açan ya da müdürse.
- `gorunum(a)` — liste görünümü: `{ id, soru, aciklama, hedefOzet, gizli, bitis, acik, kapandi, olusturma, olusturan
  (silinmişse "Silinmiş kullanıcı"), hedefSayisi, oySayisi, secenekler: [{ id, metin }] }`. `acik` veritabanında
  hesaplanır: kapatılmamış ve bitişi gelmemiş.
- `anketUclari(k)` — uçların kendisi.

### Uçlar

Hepsi önce `need(['student', 'parent', 'teacher', 'principal'])`: girişsiz 401, onaysız 403, başka rol (servisçi,
yönetici) 403 "Bu işlem için yetkin yok".

- **`GET /api/anketler`** → `{ gelen, yonetilen, olusturabilir }`.
  - `gelen` — kişiye açılmış anketler, HANGİ OKULDAN olursa olsun (kod yorumu: veli iki okulda çocuğu olsa da iki okulun
    anketini görür; liste hedef tablosundan gelir). Açıklar önce, en çok 80. Her öğeye `benimOyum` (seçenek kimliği ya
    da `''`); BİTMİŞ olanlara `sayimlar: { secenekId: n }`.
  - `olusturabilir` — okulu var ve `mesaj.toplu` yetkisi var.
  - `yonetilen` — `olusturabilir` ya da müdürse: kişinin açtıkları; müdürde okulun bütün anketleri (en yeni 100).
- **`POST /api/anketler`** — yeni anket. `okulGerek`; `mesaj.toplu` yoksa 403 "Anket açma yetkin yok"; kişi başına saatte
  20 (429 "Bu saat içinde çok fazla anket açtın."). Gövde `{ soru, aciklama?, secenekler: [...], bitisGun, bitisSaat?,
  gizli?, hedef: { tur: 'okul'|'rol'|'sinif', roller?, siniflar? } }`:
  - `soru` zorunlu (200; 400 "Soruyu yaz"), `aciklama` 1000;
  - seçenekler: ilk 30 öğe okunur, her biri 120 harf, boşlar ve (Türkçe küçük harfe göre) aynıları atılır; 2'den azsa
    400 "En az iki farklı seçenek yaz", 10'dan çoksa 400;
  - bitiş: `bitisGun` `YYYY-AA-GG` (400 "Bitiş tarihini seç"), `bitisSaat` yoksa/bozuksa 23:59, SUNUCU SAATİYLE
    yorumlanır (kod yorumu: ödevlerdeki gibi); en az 5 dakika sonrası (400 "Bitiş en az birkaç dakika sonrası olmalı"),
    en çok 90 gün (400);
  - hedef yalnız `okul`, `rol`, `sinif` (kişi seçimi yok; 400 "Anketin kime gideceğini seç"); `mesajAlicilariCoz(me,
    hedef, 'duyuru')` — okul için `mesaj.herkese`, rol ve sınıf için `mesaj.toplu` ister; duyuru olduğu için alıcıların
    mesaj ayarları aşılır; öğrencilerin velileri eklenir; hedef tekilleştirilir, açan kişi çıkarılır; kimse kalmazsa 400
    "Seçtiğin grupta kimse yok";
  - `gizli` yalnız `true` gelirse.
  Anket, seçenekler ve hedefler tek işlemde yazılır; hedefe "Anket: <soru>" bildirimi (`#/anketler`). Cevap `{ id,
  hedefSayisi, message: 'Anket açıldı — N kişiye ulaştı.' }`.
- **`POST /api/anketler/oy`** — gövde `{ id, secenekId }`. Kişi başına dakikada 120 (429 "Çok hızlı. Biraz bekle.").
  Anket yoksa 404. `secenekId` boşsa oyu geri alır (kapalıysa 400 "Bu anket kapandı."; "Oyun geri alındı."). Doluysa
  `oyVer` yazar ya da değiştirir ("Oyun kaydedildi."); yazamadıysa nedeni ayrıca bulunur: kapalı → 400 "Bu anket
  kapandı.", seçenek bu anketin değil → 400 "Geçersiz seçenek", değilse (hedefte değil) 403 "Bu ankete oy veremezsin".
- **`POST /api/anketler/kapat`** — gövde `{ id }`; `yonetebilir` değilse 403 "Bu anketi yönetme yetkin yok". Bitiş
  tarihine dokunmaz; `kapandi` sütununa şimdiki zamanı yazar (`depo.anketler.kapat`: yalnız henüz kapatılmamış ve bitişi
  gelmemiş ankette), `acik` böylece `false` olur ("Anket kapatıldı; artık oy verilemez."). Zaten kapalı ya da süresi
  bitmişse bir şey değişmez, yine aynı cevap.
- **`POST /api/anketler/sil`** — gövde `{ id }`; aynı yetki. Anket, seçenekleri, hedefleri ve oyları gider ("Anket
  silindi.").
- **`GET /api/anketler/sonuc?id=`** — anket yoksa 404.
  - Yöneten (açan ya da müdür): `{ anket, sayimlar, katilim: [{ ad, rol, sinif, cocuklar, oyVerdi, tarih, secim }],
    yonetici: true }`. `cocuklar` velinin bu okuldaki çocuklarının adları. Gizli ankette `secim` `''` ve `tarih` `null`
    (her zaman); gizli anket AÇIKKEN `sayimlar` da `null`.
  - Başkası: hedefte değilse 403 "Bu anketi görme yetkin yok"; anket açıksa 403 "Sonuç anket bitince açılır."; bittiyse
    yalnız `{ anket, sayimlar }` (katılım listesi yok).

## Kimle konuşur?

- Çağırdıkları: `../guvenlik` (`hizSinir`); `../http` (`bad`, `ok`); `../iliskiler` (`saatDuzelt`); `../ortak`
  (`clean`, `uid`: anket `an`, seçenek `as` önekli); `../veri` (`depo`, `topluBildir`); `../yetki` (`okulGerek`,
  `yetkiVarMi`); `./mesaj` (`mesajAlicilariCoz`).
- Depo ve tablolar: `depo.anketler` (`sunucu/veri/depo/anketler.js`, şema 006) → `anketler`, `anket_secenekleri`,
  `anket_hedefleri`, `anket_oylari` (+ adlar için `kullanicilar`, sınıf için `siniflar`, velinin çocukları için
  `veli_baglari`): `ekle`, `bul`, `kisiyeGelenler`, `yonetilenler`, `sayimlar`, `hedefteMi`, `katilim`, `oyVer`,
  `oyGeriAl`, `kapat`, `sil`. Bildirimler → `bildirimler`.
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM.anketler`).
- Ön yüz: `public/js/parcalar/19b-anketler.js` (liste, oy, sonuç, kapat/sil, yeni anket; hedef seçimi için
  `/api/mesajlar/hedefler`'e de bakar).
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
Açan:   POST /api/anketler {soru, secenekler, bitis, hedef, gizli}
          yetki (mesaj.toplu) ─ hız ─ seçenekleri tekilleştir ─ bitiş (5 dk .. 90 gün)
          mesajAlicilariCoz(hedef, 'duyuru') ─ öğrenci + velileri ─ açan hariç
          anketler + anket_secenekleri + anket_hedefleri (tek işlem) ─ bildirim
Hedef:  GET /api/anketler ─ POST oy {secenekId}  (açık + hedefte + bu anketin seçeneği ise yazılır)
Sonuç:  yöneten her an (gizli + açıkken sayı yok) ; hedef anket bitince yalnız sayılar
```

## Dikkat!

- **Gizli ankette sızıntıya karşı iki kural** (kod yorumu): kimin neyi seçtiği ve oy zamanı hiç gönderilmez; anket
  açıkken sayılar da gönderilmez — sık sık bakıp yeni oy verenle artan seçeneği eşleştirmek kimin neyi seçtiğini ele
  verirdi. Ama yöneten, gizli ankette de kimin oy VERDİĞİNİ (`oyVerdi`) görür.
- **Yorum ile kod arasında küçük fark:** dosya başı "oy verenler anket bitince görür" diyor; kod hedefteki HERKESE (oy
  vermemiş olsa da) bitmiş anketin sayılarını açar — hem `sonuc` ucunda (`hedefteMi`) hem listedeki `sayimlar`da.
- Bitiş sunucunun yerel saatiyle yorumlanır (`new Date('YYYY-AA-GGTSS:DD:00')`); sunucu Türkiye saatinde değilse bitiş
  kayar.
- Hedef açılışta dondurulur: sonradan okula katılan öğrenci ya da yeni bağlanan veli ankette yer almaz.
- Müdür, okulundaki başka birinin açtığı anketi de kapatıp silebilir; başka okulun müdürü göremez (test).
- Yetkisi sonradan alınan öğretmen kendi açtığı anketi yönetmeye devam eder (`yonetebilir` açan kişiye bakar); ama
  `yonetilen` listesi yalnız `olusturabilir` ya da müdür olana dolu gelir.
- `oy` ucunda sayılar anlık değil: yazılamayan oyun nedeni sonradan, bir önceki okumaya bakılarak söylenir; bitişin tam o
  anda gelmesi gibi yarışta mesaj "Bu ankete oy veremezsin" olabilir.

## Testleri

- `testler/test-anket.js` — açma yetkisi (yetkisiz öğretmen ve öğrenci açamaz), aynı seçenek bir kez, geçmiş ve çok uzun
  bitiş reddi, kişi seçimiyle açılmaz, hedef (2 öğrenci + 1 veli), gizli anket; oy (başka anketin seçeneği ve hedefte
  olmayan öğretmen reddi, değiştirme, geri alma); müdürün sayıları ve katılım (veli çocuğuyla, geri alan "oy vermemiş");
  gizli ankette seçim/zaman ve açıkken sayı gelmemesi, bitince sayıların açılması; başka okulun müdürü; silme ve
  kapatma; bitmiş ankete oy yazılmaması, öğrencinin bitmiş sonucu katılımsız görmesi. Aynı paket duyurunun okundu
  bilgisini de dener (bkz. [mesaj.md](mesaj.md)).
- `testler/test-yedek.js` — anket ve oyu yedeğe girer.
- `testler/yetki-denetimi.js`, `testler/test-servis-konum.js` (servisçi `/api/anketler`'e giremez).
- Elle: müdürle (`testler/seed.js`) `POST /api/anketler` `{ "soru": "Gezi hangi gün?", "secenekler": ["Cuma",
  "Cumartesi"], "bitisGun": "<yarın>", "hedef": { "tur": "rol", "roller": ["parent"] } }`.

## Son durum

- Son commit `60a5a49 commit 298` (2026-09-26): uçların büyük kısmı (`gorunum`, liste, yeni anket, oy, kapat/sil, sonuç;
  148 satır) ve ön yüzün `19b-anketler.js` / `04a-form-alanlari.js` parçaları.
- `8a537cf commit 297` (2026-09-26): dosyanın ilk 29 satırı (başlık, sabitler, `yonetebilir`) ile depo, `veri/index.js`
  ve şema `006-anketler.sql`.
- Yarım kalan iş yok. Sıradaki planlı değişiklik: "Anket düzenleyici" işi (kullanıcı 28 Eylül'de onayladı) anketi tek
  sorudan çok soruluya çevirecek — Excel'le değil, "Anket oluştur" düzenleyicisiyle: tek/çoklu seçim, açılır liste,
  kısa/uzun yanıt, zorunlu soru, taslağı kaydetme, ödeve ya da mesaja ek olarak anket. Bugünkü tek soru yapısı bu işte
  genişleyecek. "Optimizasyon + saklama süreleri" işi de genel saklama kuralları getirecek. "Düzenleyiciler" işi
  (onaylı) anketlere ileri tarihli gönderimi ("şu gün şu saatte gönder") ve anket açıklaması için ortak yazı
  düzenleyiciyi getirecek.
