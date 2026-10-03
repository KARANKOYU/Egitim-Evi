# testler/test-uygulama-surum.js

İndirme sayfasının sürüm listesini kuran saf işlevleri (`surumleriAyikla`, `duzMetin`) uydurma bir GitHub cevabıyla
deneyen, sunucusuz ve internete çıkmayan test paketi (13 denetim).

## Bu dosya ne yapar?

Sitedeki indirme sayfası (`/indir/indir.html`) Android uygulamasının sürümlerini bir tabloda gösterir. Sunucu bu listeyi
uygulamanın GitHub deposundaki "Releases" bölümünden alır ([../sunucu/uygulama-surum.md](../sunucu/uygulama-surum.md)). Bu
dışarıdan gelen bir veridir: GitHub cevabında taslaklar, ön sürümler, bozuk numaralar, başka depolara giden dosya
adresleri, Markdown biçimli notlar, hatta görünmez yön karakterleri olabilir. Sunucu cevabı doğrudan sayfaya koymaz; önce
yalnız güvendiği alanları alır ve süzer.

Bu paket o süzgeci dener. GitHub'a hiç istek atmaz: GitHub cevabına benzeyen bir diziyi elle kurar, `surumleriAyikla`'ya
verir ve çıkan listeye bakar. Dosya başındaki yorumun maddeleri:

- taslak, ön sürüm ve sürüm numarası bozuk olanlar atılıyor;
- APK adresi yalnız uygulamanın kendi deposunun sürüm dosyası olabilir;
- SHA-256 özeti 64 onaltılık hane değilse boş kalıyor;
- not Markdown'dan düz metne çevriliyor, kontrol karakterleri atılıyor, kısaltılıyor;
- en yeni sürüm en üstte (sürüm numarasına göre).

## İçinde neler var?

### Sabitler ve yardımcılar

- `DEPO` — `https://github.com/KARANKOYU/Egitim-Evi-App/releases/download/` (uygulamanın deposunun sürüm dosyalarının öneki).
- `OZET` — `sha256:` + 64 haneli `abab…` (geçerli biçimde uydurma özet).
- `apk(etiket, ad, ek)` — GitHub'ın "asset" nesnesine benzer: `{ name, size: 30724, digest: OZET, browser_download_url:
  DEPO + etiket + '/' + ad }`, `ek` ile alanlar ezilebilir.
- `surum(etiket, ek)` — GitHub'ın "release" nesnesine benzer: `{ tag_name, name: 'Sürüm <etiket>', body: 'Not', published_at:
  '2026-09-26T17:23:37Z', draft: false, prerelease: false, assets: [apk(etiket, 'egitim-evi.apk')] }`.
- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı, sayaçlar.

Kullandığı modül: `sunucu/uygulama-surum.js` → `surumleriAyikla`, `duzMetin` (başka hiçbir şey yüklenmez; veri klasörü,
veritabanı, ağ yok).

### Uydurma GitHub cevabı (`ham`, 15 öğe)

| Öğe | Ne bekleniyor |
|---|---|
| `v1.0.1` (notu Markdown: başlık, liste, kalın, bağlantı, kod) | kalır, not düz metne çevrilir |
| `v1.0.10`, `v1.0.2` | kalır |
| `v2.0.0` taslak | atılır |
| `v1.9.0` ön sürüm | atılır |
| `son-surum` (numara değil) | atılır |
| `v1.0.3` APK adresi `https://kotu.example.com/…` | atılır |
| `v1.0.4` dosya `.aab` | atılır |
| `v1.0.5` adres başka bir kullanıcının aynı adlı deposu | atılır |
| `v1.0.6` özet `sha256:kisa` | kalır, `sha256` boş |
| `v1.0.7` tarih `'dün'` | atılır |
| `v1.0.8` boyut `-5` | atılır |
| `null`, `'metin'`, `42` | atılır |

### Denetimler (13)

1. Kalan sürümler sırasıyla tam olarak `1.0.10,1.0.6,1.0.2,1.0.1`.
2. En üstte `1.0.10` (sayısal karşılaştırma: 10 > 2; metin sıralaması olsaydı "1.0.2" üste çıkardı).
3. Her APK adresi `.apk` ile bitiyor (AAB gösterilmez).
4. Her APK adresi `DEPO` ile başlıyor.
5. `1.0.1`'in `sha256`'sı 64 haneli özetin kendisi (`sha256:` öneki atılmış).
6. `1.0.6`'nın `sha256`'sı boş.
7. `1.0.1`'in notu tam olarak `Yenilikler Şifre kutusu gizli yazar durum çubuğu` (başlık işareti, liste tireleri, `**`,
   bağlantı adresi ve ters tırnaklar gitmiş, satırlar tek boşluğa inmiş).
8. Her sürümde yalnız `ad, apk, notlar, surum, tarih` alanları; `apk`'da yalnız `ad, adres, boyut, sha256` (GitHub'ın öbür
   alanları sızmıyor).
9. Dizi olmayan cevap (`{ message: 'rate limit' }` ve `null`) boş liste.
10. `duzMetin('a\u0000b<U+202E>c\u0007d', 50)` → `abcd` (NUL, sağdan sola geçersiz kılma ve zil karakteri atıldı).
11. 500 karakterlik metin 400 sınırıyla tam 400 karakter ve `…` ile bitiyor.
12. `<img src=x onerror=alert(1)>` olduğu gibi metin kalıyor (HTML'i kaçırmak sayfanın işi).
13. 80 sürümlük cevaptan en çok 30 sürüm çıkıyor.

Sonunda boş satır ve `  GECTI: 13   KALDI: 0`; `KALDI` varsa çıkış kodu 1. Paket `async` değil; beklenmeyen hata Node'un
kendi hata çıktısıyla süreci düşürür (`TEST HATASI` satırı yok).

## Kimle konuşur?

- **Çağırdığı:** [../sunucu/uygulama-surum.md](../sunucu/uygulama-surum.md) → `surumleriAyikla` (taslak/ön sürüm eleme,
  `SURUM_DESENI`, tarih denetimi, `DOSYA_ADRESI`, boyut 0 ile 500 MB arası, `OZET_DESENI`, sürüm numarasına göre sıralama,
  en çok 30) ve `duzMetin` (kontrol ve yön karakterleri, Markdown temizliği, kısaltma).
- **Koruduğu kod:** yalnız bu iki işlev. Aynı dosyadaki ağ kısmı (`surumler`, `githubtanAl`: 15 dakikalık önbellek,
  ulaşılamazsa 2 dakika bekleme, 6 saniye zaman aşımı, 2 MB cevap sınırı, yönlendirmeyi reddetme, `EE_DIS_ISTEK=0`'da hiç
  istek atmama) denenmez.
- **Bu listeyi kullananlar:** `GET /api/uygulama` ([../sunucu/site.md](../sunucu/site.md)) → indirme sayfasının betiği
  [../public/js/indir.md](../public/js/indir.md) (sürüm, ad, tarih, not, boyut ve özeti `esc` ile kaçırarak tabloya basar).
- **Onu çalıştıran:** `testler/tumtest.sh`'in sunucusuz paket döngüsü (`test-vekil-ip`'ten sonra, `test-quiz-metin`'den önce).
  Sunucu, veritabanı ya da `EE_*` değişkeni gerekmez.

## Nasıl çalışır (adım adım)?

```
ham (15 öğe: 3 geçerli, 1 bozuk özetli ama kalan, 11 atılacak)
   └─► surumleriAyikla(ham) ─► l
          ├─ sıra 1.0.10, 1.0.6, 1.0.2, 1.0.1 ?
          ├─ .apk, DEPO öneki, sha256 (64 hane / boş), not düz metin, alan listesi ?
surumleriAyikla({ message }) ve (null) ─► [] ?
duzMetin: kontrol/yön karakteri, 400 sınırı + "…", HTML metin kalır ?
80 sürüm ─► 30 ?
```

## Dikkat!

- **Dosyada görünmez karakter var.** 10. denetimin satırında (55. satır) denenen metnin ortasında gerçek bir U+202E
  (sağdan sola geçersiz kılma) karakteri duruyor; aynı metin satırın sonundaki hata ayrıntısında bir kez daha yazıldığı
  için satırda iki tane var. Düzenleyicide görünmez, kopyala-yapıştırda kaybolabilir. Dosyayı düzenlerken o satıra
  dokunursan karakterin yerinde kaldığından emin ol (yoksa denetim yine geçer ama artık yön karakterini denemez). Aynı
  karakter `sunucu/uygulama-surum.js`'teki düzenli ifadede de (`duzMetin`'in sildiği U+202A–U+202E ve U+2066–U+2069
  aralıklarının içinde) gerçek karakter olarak yazılı.
- **Tablodaki HTML'i kaçırmak sayfanın işi.** 12. denetim bilerek "HTML metin olarak kalır" diyor: sunucu notu HTML'den
  arındırmaz, düz metne çevirir. Bu yüzden `public/js/indir.js` her alanı `esc` ile basmak zorunda; orada `innerHTML`'e
  kaçırılmamış bir alan eklenirse GitHub'daki bir sürüm notu sayfaya betik sokabilir. Bu paket sayfayı denemez.
- **Yalnız ilk 60 öğeye bakılır.** `surumleriAyikla` gelen dizinin ilk 60 öğesini işler, en çok 30 sürüm döner. 13. denetim
  yalnız 30 sınırını dener (80 öğenin ilk 60'ı geçerli olduğu için).
- **Depo adı iki yerde.** Paketteki `DEPO` öneki ile sunucudaki `DOSYA_ADRESI` deseni aynı depoyu (`KARANKOYU/Egitim-Evi-App`)
  anlatır. Depo taşınır ya da adı değişirse ikisi birlikte değişmeli.
- **Sabit tarih.** Bütün uydurma sürümlerin tarihi 2026-09-26; sıralama tarihe değil numaraya göre olduğu için önemli değil.
- **Ağ kısmı denenmez.** GitHub cevabının zaman aşımı, önbellek ve hata sonrası bekleme hiçbir pakette denenmez.
  [test-etut.md](test-etut.md) yalnız test sunucusunda (`EE_DIS_ISTEK=0`) `/api/uygulama`'nın girişsiz açık olduğuna, alan
  listesine, `alindi: false` ve boş bir `surumler` dizisi döndüğüne bakar.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` sunucusuz paketler arasında her tam koşuda çalıştırır.
- Aynı alanda: [test-etut.md](test-etut.md) (`GET /api/uygulama` girişsiz açık), [test-site-ayarlari.md](test-site-ayarlari.md)
  (`/api/uygulama`'daki `playStore` ve `Cache-Control: no-store`).
- Elle (proje kökünde; sunucu gerekmez):

  ```
  node testler/test-uygulama-surum.js
  ```

- 3 Ekim 2026'da bu belge için çalıştırıldı: `GECTI: 13   KALDI: 0`, yaklaşık 0,1 saniye; hiçbir dosya yazmaz, ağa çıkmaz
  (yalnız `sunucu/uygulama-surum.js`'i yükler, o da hiçbir modül yüklemez; ağ isteği yapan `surumler()` çağrılmaz). Belge
  denetiminde aynı gün yeniden çalıştırıldı, sonuç aynı.

## Son durum

- `git log`: tek commit. Dosya `fa9a072 commit 510` (2026-09-26) ile 65 satır olarak eklendi ve o günden beri değişmedi.
  Aynı commit korunan kodu getirdi: `sunucu/uygulama-surum.js` (yeni, 110 satır), `public/indir.html` (sonra
  `public/indir/indir.html`'e taşındı), `public/js/indir.js`, `sunucu/site.js`'teki `/api/uygulama` ucu; `tumtest.sh`'te bu
  paket sunucusuz listeye girdi ve test sunucusu `EE_DIS_ISTEK=0` ile açılmaya başladı (testler GitHub'a istek atmasın).
- Korunan dosyada sonra yalnız yorum değişti: `b6bfc03 commit 517` (2026-09-27) dosya başındaki "egitimevi.org/indir"
  sözünü "egitimevi.org/indir/indir.html" yaptı (sayfa klasörleri işi).
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden bu dosyayı etkileyecek olan: **"Android yerel uygulama … + apk/aab + sürüm"** ve onun istek denetimi ekinde
  yazılı **"uygulama kendini güncellesin"** — uygulama yeni sürümü bu listeden (ya da aynı GitHub kaynağından) öğrenecekse
  liste biçimi (alanlar, sıralama, `sha256`) bir sözleşmeye dönüşür; 8. denetimdeki alan listesi o zaman bilerek
  genişletilmeli. AAB dosyaları Play Store içindir; listeye girmemeleri (3. denetim) bilinçli bir karar.
