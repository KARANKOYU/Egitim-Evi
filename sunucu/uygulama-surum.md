# sunucu/uygulama-surum.js

Android uygulamasının sürüm listesini GitHub "Releases"tan okur, güvenilir alanları süzer ve 15 dakika bellekte tutar;
indirme sayfasındaki tablo buradan beslenir.

## Bu dosya ne yapar?

`egitimevi.org/indir/indir.html` sayfasında telefon uygulamasının sürümleri (ad, tarih, not, APK boyutu, SHA-256
özeti, indirme bağlantısı) listelenir. Sürümler elle bir yere yazılmıyor: uygulamanın GitHub deposunda
(`KARANKOYU/Egitim-Evi-App`) her yeni sürüm "Release" olarak yayımlanıyor, sunucu listeyi oradan çekiyor. Tarayıcı
GitHub'a doğrudan gitmez (CSP `connect-src 'self'`); sayfa `/api/uygulama`'yı çağırır, o da bu dosyanın `surumler()`'ini.

Dışarıdan gelen veriye güvenilmez: indirme adresi yalnız bu deponun sürüm dosyası olabilir, not düz metne çevrilir,
özet 64 onaltılık hane değilse boş kalır, taslak ve ön sürümler atılır.

## İçinde neler var?

- `surumler()` → `Promise<{ surumler, alindi, zaman? }>` — önbellek tazeyse (15 dk) ondan; son başarısız denemeden bu
  yana 2 dk geçmediyse eldeki listeden; değilse GitHub'dan çeker. Aynı anda tek istek (`suAnki`): o sırada gelen
  çağrılar aynı sözü bekler. `EE_DIS_ISTEK=0` ise dışarıya hiç gitmez: `{ surumler: [], alindi: false }`.
- `surumleriAyikla(ham)` — saf işlev; GitHub cevabından gösterilecek listeyi çıkarır:
  - dizi değilse `[]`; en çok ilk 60 kayda bakar, en çok 30 döndürür;
  - `draft` / `prerelease` atılır; `tag_name` `v?1.2(.3(.4))` biçiminde değilse atılır; `published_at` tarih değilse
    atılır;
  - APK: `browser_download_url` `https://github.com/KARANKOYU/Egitim-Evi-App/releases/download/<etiket>/<ad>.apk`
    kalıbına uyan ve boyutu 0–500 MB arası ilk dosya; yoksa sürüm atılır; `digest` `sha256:<64 hex>` değilse özet `''`;
  - çıktı: `{ surum, ad (≤90), tarih (ISO), notlar (≤400), apk: { ad, adres, boyut, sha256 } }`;
  - sıralama: sürüm numarasına göre, en yeni en üstte.
- `duzMetin(s, sinir)` — Markdown'u düz metne çevirir: denetim karakterleri ve yön değiştiren Unicode karakterleri
  (U+202A–202E, U+2066–2069) atılır; resimler silinir, bağlantı yazısına iner; kod işaretleri, başlık/liste/alıntı
  işaretleri, kalın/italik/üstü çizili işaretleri kalkar; boşluklar teke iner; sınırı aşarsa `…` ile kısaltılır.
- `SAYFA_ADRESI` — `https://github.com/KARANKOYU/Egitim-Evi-App/releases` (sayfada "bütün sürümler" bağlantısı).
- İç: `githubtanAl()` — `fetch` (User-Agent, `redirect: 'error'`, 6 sn zaman aşımı); 2 MB'tan büyük cevap reddedilir.

## Kimle konuşur?

- Çağırdıkları: yalnız Node'un yerleşik `fetch`'i ve sabit GitHub API adresi.
- Onu çağıranlar (grep): `sunucu/site.js` — `GET /api/uygulama` cevabı
  `{ playStore, sayfa: SAYFA_ADRESI, alindi, surumler }`; `testler/test-uygulama-surum.js` (`surumleriAyikla`,
  `duzMetin`).
- Ön yüzde `public/js/indir.js` `/api/uygulama`'yı çağırıp tabloyu çizer.
- Veri tablosu yok; önbellek bellekte.

## Nasıl çalışır (adım adım)?

```
surumler()
  EE_DIS_ISTEK=0 ─────────────────────────────> { [], alindi:false }
  önbellek taze (15 dk) ya da son deneme < 2 dk ─> önbellek
  süren istek yok mu? ─> githubtanAl() başlat (sonDeneme = şimdi)
        başarı ─> önbellek = { liste, zaman, alindi:true }
        hata   ─> eski önbellek kalır (sessizce)
  bekle ─> önbellek
```

## Dikkat!

- Sunucu YALNIZ bu sabit adrese istek atar; adres kullanıcı girdisinden oluşmaz. `redirect: 'error'` yönlendirmeyle
  başka yere gitmeyi engeller.
- Başarısız istekten sonra 2 dk beklenir: GitHub kapalıyken her sayfa açılışı 6 sn beklemesin, GitHub'ın hız sınırına
  da takılmasın.
- Depo adı (`KARANKOYU/Egitim-Evi-App`) hem `DEPO`'da hem `DOSYA_ADRESI` kalıbında elle yazılı; depo taşınırsa ikisini
  birlikte değiştir.
- Notlar tarayıcıda düz metin olarak gösterilmeli; `duzMetin` HTML kaçışı yapmaz, kaçış ön yüzün işi.
- Testlerde `EE_DIS_ISTEK=0` verilir: test ortamı internete çıkmaz, liste boş gelir.

## Testleri

- `testler/test-uygulama-surum.js` (sunucusuz) — taslak, ön sürüm, bozuk sürüm numarası atılıyor; APK adresi yalnız bu
  deponun sürüm dosyası; SHA-256 64 hane değilse boş; not düz metne, denetim karakterleri atılıyor, kısaltılıyor; en
  yeni en üstte.
- Dolaylı: `testler/test-etut.js` (`/api/uygulama` girişsiz açık, testte dışarı istek yok) ve
  `testler/test-site-ayarlari.js` (Play Store bağlantısı `/api/uygulama`'da görünüyor).
- Elle: `EE_DIS_ISTEK` vermeden aç, `curl http://localhost:3200/api/uygulama` → `alindi: true` ve GitHub'daki sürümler
  (v1.0.0, v1.0.1).

## Son durum

- Son commit `b6bfc03 commit 517` (2026-09-27): yalnız baştaki yorumda sayfanın adresi `/indir` → `/indir/indir.html`
  oldu (sayfa klasörleri işi). Dosya `fa9a072 commit 510`'da (2026-09-26) yazıldı.
- Açık iş yok. "Android yerel uygulama" işinde yeni sürümler (apk/aab) yayımlandıkça burada kod değişmeden listeye
  girer.
