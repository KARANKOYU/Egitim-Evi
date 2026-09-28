# sunucu/yardimci/xls.js

Eski Excel (.xls, Excel 97-2003) okuyucusu, paketsiz: önce dosyanın içindeki küçük dosya sisteminden (birleşik belge) "Workbook"
akışını çıkarır, sonra o akıştaki BIFF8 kayıtlarından sayfaları ve hücreleri okur. Yalnız okur, yazmaz.

## Bu dosya ne yapar?

Pek çok okulun elindeki listeler hâlâ eski `.xls` biçiminde (e-Okul ve eski Excel çıktıları). Müdürden "Excel'de .xlsx olarak
kaydet" istemek yerine bu dosya eski biçimi doğrudan okur. Çıktısı `xlsx.oku` ile aynı biçimdedir, böylece aktarım kodu dosyanın
eski mi yeni mi olduğunu bilmez.

Yeni gelen biri için .xls iki katmandır:

**1. Birleşik belge (Compound File Binary, MS-CFB)** — dosyanın içinde küçük bir FAT dosya sistemi:

```
[512 bayt başlık: imza D0 CF 11 E0 A1 B1 1A E1, sektör boyu, FAT/dizin/mini FAT'ın yerleri, ilk 109 FAT sektörünün numarası]
[sektör 0][sektör 1][sektör 2] ...          her sektör 512 (ya da 4096) bayt
```

- **FAT** (sektör tablosu): her sektör için "zincirde sonraki sektör hangisi". Bir akış = bir sektör zinciri (`SON` = zincir sonu).
  109'dan çok FAT sektörü varsa listenin kalanı **DIFAT** zincirindedir.
- **Dizin**: 128 baytlık girişler — ad (UTF-16), tür (5 kök, 2 akış), ilk sektör, boyut.
- **Mini akış**: başlıktaki mini akış sınırından (hemen her dosyada 4096 bayt; kod bu değeri başlıktan okur) küçük akışlar 64 baytlık "mini sektörlere" bölünüp kökün mini akışının içinde durur; zinciri
  **mini FAT**'tadır.

**2. BIFF8 kayıtları (MS-XLS)** — "Workbook" akışı art arda kayıtlardır: `[tür 2 bayt][uzunluk 2 bayt][veri]`. Önce çalışma
kitabının genel kayıtları (sayfa listesi, ortak metin tablosu), sonra her sayfanın kendi `BOF … EOF` bölümü gelir.

## İçinde neler var?

### `xlsOku(buf)` → `[{ ad, satirlar: [[metin, …], …] }]`

- Okunan kayıtlar:
  - `BOF` (0x0809) — sürüm 0x0600 (BIFF8) değilse "Bu .xls sürümü okunamıyor. Excel'de .xlsx olarak kaydedip yükle."
  - `FILEPASS` (0x002F) — "Dosya parolayla korunuyor. Parolayı kaldırıp yeniden kaydet."
  - `BOUNDSHEET` (0x0085) — sayfa adı ve sayfa bölümünün akıştaki yeri. Yalnız çalışma sayfaları (grafik ve makro sayfaları
    değil); aynı yeri gösteren ikinci kayıt atlanır; en çok 20 sayfa. Gizli sayfalar da okunur.
  - `SST` (0x00FC) + `CONTINUE` (0x003C) — ortak metin tablosu (en çok 500 000 metin).
  - Hücreler: `LABELSST` (0x00FD, ortak tablodan metin), `LABEL` (0x0204) ve `RSTRING` (0x00D6, kayıt içi metin), `NUMBER` (0x0203),
    `RK` (0x027E, sıkıştırılmış sayı), `MULRK` (0x00BD, yan yana birden çok RK), `BOOLERR` (0x0205, yalnız mantıksal; hata değeri
    atlanır), `FORMULA` (0x0006, yalnız SONUCU; metin sonucu bir sonraki `STRING` (0x0207) kaydındadır).
  - Biçim, grafik, formül metni, yorum, birleştirme vb. atlanır.
- Değerler: metinler KIRPILIR (`trim`); sayılar `sayiMetni` ile (tam sayı kesirsiz: `12345678901`; kesirde kayan nokta artıkları
  15 basamağa yuvarlanır: `0.30000000000000004` → `0.3`); tarih Excel gün sayısı olarak gelir (`tarihCoz` çözer); mantıksal
  `DOĞRU`/`YANLIŞ`.
- Satırlar: 0'dan en son dolu satıra kadar; boş satır `[]`; her satır YALNIZ kendi en son dolu sütununa kadar `''` ile doldurulur
  (satırların uzunluğu farklı olabilir).
- Hata mesajları (Türkçe): "Bu bir .xls dosyası değil.", ".xls dosyası bozuk (başlık | tablo | sektör dışı | zincir | dizin |
  metin tablosu | metin).", ".xls dosyası çok büyük.", "Bu dosya çok eski bir Excel sürümünün (Excel 95 ya da öncesi). Excel'de .xlsx
  olarak kaydedip yükle." ("Book" akışı varsa), ".xls dosyasında çalışma kitabı bulunamadı.", ".xls dosyasında çok fazla metin var.",
  "Dosya çok büyük. Listeyi bölüp birkaç dosya hâlinde yükle."

### `cfbAkislari(buf)` → `akis(ad)`

Birleşik belgeyi açar ve ada göre (büyük/küçük harf duyarsız) akış döndüren bir işlev verir; akış yoksa `null`. Dışa açık
ama bugün bu dosya dışında kullanan yok (testler de `xlsOku`/`tabloOku` üzerinden dener). Sektör boyu 512
(sürüm 3) ya da 4096 (sürüm 4), mini sektör 64 olmalı.

### Sınırlar (bozuk ya da kötü niyetli dosyaya karşı)

- Tek akış en çok 60 MB (`EN_BUYUK_AKIS`).
- Zincirler: döngü (aynı sektör ikinci kez), tablo dışı sektör ya da sektör sayısından uzun zincir → "bozuk (zincir)".
- FAT/DIFAT/mini FAT sayısı dosyadaki sektör sayısını aşamaz; dosya dışını gösteren sektör → "bozuk (sektör dışı)".
- 20 000. satır ve 200. sütunun ötesindeki hücreler ATLANIR; bütün sayfalarda en çok 1 000 000 DOLU hücre (aşarsa hata).
- En çok 500 000 ortak metin, 20 sayfa.

### İç yardımcılar

- `rkSayi(v)` — RK: 30 bitlik sayı; bit 1 ise tam sayı, değilse IEEE double'ın üst 30 biti; bit 0 ise 100'e bölünür.
- `parcaliOkuyucu(parcalar)` — `SST` + `CONTINUE` kayıtlarına bölünmüş veriyi tek akış gibi okur. Bir metnin karakterleri kayıt
  sınırını aşarsa YENİ KAYDIN İLK BAYTI yeniden "1 bayt mı 2 bayt mı" bayrağıdır (MS-XLS 2.5.293) — en çok hata çıkan yer burası;
  biçimli metin (rich text) ve ek (phonetic) bilgisi atlanır.
- `kayitMetni(veri, ofs, uzunBayt)` — kayıt içi kısa (1 bayt uzunluklu) ya da uzun (2 bayt) metin; ardından 1 bayt bayrak
  (bit 0: UTF-16), sonra karakterler (değilse Latin-1).
- `kayitlar(akis, bas, eofDur)` — kayıtları sırayla listeler; `eofDur` ile sayfanın `EOF` kaydında durur (her sayfa için akışın
  sonuna kadar okumak işi sayfa sayısıyla katlardı).

## Kimle konuşur?

- Çağırdığı: hiçbir modül (yalnız `Buffer`).
- Onu çağıran: [tablo-oku.md](tablo-oku.md) — uzantı `.xls` ise ya da dosya birleşik belge imzasıyla başlıyorsa `xlsOku(buf)`.
  Tablo okuyucusunu da [../bolumler/okul.md](../bolumler/okul.md) (ders programı aktarımı) ve
  [../bolumler/kisi-aktarim.md](../bolumler/kisi-aktarim.md) (kişi listesi) kullanır.
- Veritabanı kullanmaz.

## Nasıl çalışır (adım adım)?

```
xlsOku(buf)
  cfbAkislari: imza + başlık → FAT sektörleri (başlık 109 + DIFAT) → FAT → dizin zinciri → girişler; kök (tür 5) şart
  akis('Workbook')   yoksa: 'Book' varsa "çok eski Excel", yoksa "çalışma kitabı yok"
                     boyut < başlıktaki mini sınır (genelde 4096) ise mini FAT + kökün mini akışından, değilse FAT'tan
  genel kayıtlar: BOF(BIFF8)? → FILEPASS? → BOUNDSHEET'ler → SST(+CONTINUE) → ilk EOF'ta dur
  her sayfa: BOUNDSHEET'in gösterdiği yerden kayıtlar (EOF'ta dur)
             hücre kayıtları → Map(satır → Map(sütun → metin))   (sınır dışı ve boş değer atlanır, bütçe düşer)
             Map → satır dizileri
```

## Dikkat!

- Mantıksal değerler burada `DOĞRU`/`YANLIŞ`; `.xlsx` ve `.ods` okuyucularında `EVET`/`HAYIR`. Aynı tablo iki biçimde farklı
  metin verir; bugün aktarımda mantıksal sütun beklenmediği için etkisi yok, ama ileride "evet/hayır" sütunu okuyan bir aktarım iki
  yazımı da tanımalı.
- Metinler burada kırpılır, `.xlsx`'te kırpılmaz; satır doldurma da farklı (burada satır kendi uzunluğunda, `.xlsx`'te en geniş
  sütuna kadar). Çağıranlar hücreyi okurken eksik hücreye ve boşluklara dayanıklı olmalı (`aktarim.js`'teki `metin()` `undefined`'ı `''`
  yapar ve kırpar).
- Sınır dışı hücreler sessizce atlanır (20 000 satır / 200 sütun).
- Tarih biçimi (hücrenin tarih olarak biçimlendirildiği) okunmaz; tarih sayı olarak gelir.
- Excel 95 ve öncesi (BIFF5, "Book" akışı) desteklenmez; parolalı dosyalar desteklenmez.
- Formülün kendisi değil yalnız son hesaplanmış sonucu okunur (dosyada kayıtlı olan).

## Testleri

- `testler/test-xlsx.js` (sunucusuz) "8) ESKİ EXCEL" bölümü — `testler/ornek-eski-liste.xls` (LibreOffice ile kaydedilmiş sentetik
  liste; 900 farklı metinle ortak metin tablosu `CONTINUE` sınırını aşar): iki sayfa ve Türkçe harfli adları, 451 satır, bütün
  hücrelerin doğru olması, uzantısız dosyanın imzadan tanınması; `testler/ornek-eski-sayilar.xls` (küçük dosya, mini akış): T.C.
  numarası, ondalık, eksi sayılar ve tarih hücresinin `tarihCoz` ile çözülmesi; kesilmiş dosya, kendine dönen dizin zinciri, dosya
  dışını gösteren sektör ve imzası doğru içi bozuk dosyada hata (çökme ya da sonsuz döngü yok).
- Elle: `node testler/test-xlsx.js`.

## Son durum

- Dosya `84bdc19 commit 395` ve `ec9bc06 commit 396` (2026-09-26) ile iki parçada eklendi (birleşik belge + BIFF8) ve o günden beri
  değişmedi.
- Açık: mantıksal değer yazımının `.xlsx`/`.ods` ile farklı olması (yukarıda).
- Sıradaki işlerden "Sınav … notları Excel'den yükleme" ve "quiz sorularını Excel'den aktarma" eski `.xls` dosyalarını da bu
  okuyucudan geçirecek (tablo okuyucusu üzerinden).
