# sunucu/yardimci/kucult.js

Tarayıcıya giden birleşik JS ve CSS paketlerinden yorumları atar; JS sonucunu derleyerek denetler, bir sorun olursa yorumlu
hâli gönderir (uygulama asla bozulmaz).

## Bu dosya ne yapar?

Ön yüz kodu (`public/js/parcalar/*.js`, `public/js/yonetim/*.js`, `public/css/parcalar/*.css`) bol açıklamalıdır: hangi
denetim neden var, hangi uç ne yapar. Bunlar geliştirici için; tarayıcıda "İncele" diyen herkesin okuması gerekmiyor. Güvenlik
bu yorumlara dayanmıyor (bütün kurallar sunucuda), ama gereksiz bilgi verilmesin ve dosya küçülsün diye `sunucu/http.js`
parçaları birleştirdikten sonra paketi buradan geçirir.

Bu gerçek bir "minify" değildir: değişken adları kısaltılmaz, boşluklar sıkıştırılmaz. Yalnız yorumlar, satır sonu boşlukları
ve boş satırlar gider.

## İçinde neler var?

- **`jsYorumSil(kaynak)`** — JS kaynağından `//` ve `/* */` yorumlarını atar, sonucu döndürür.
  - Tek/çift tırnaklı dizgilere dokunmaz (`'http://x.com/*y*/'` olduğu gibi kalır). Kapanmamış dizgi satır sonunda biter,
    olduğu gibi bırakılır.
  - Düzenli ifadelere dokunmaz. `/`'nin düzenli ifade mi bölme mi olduğuna önceki anlamlı karaktere bakarak karar verir:
    `( , = : [ ! & | ? { } ; + - * % < > ~ ^` ya da dosya başı → düzenli ifade; ya da hemen önce `return`, `typeof`,
    `instanceof`, `in`, `of`, `new`, `delete`, `void`, `throw`, `case`, `do`, `else`, `yield`, `await` kelimelerinden biri
    varsa → düzenli ifade. Düzenli ifadenin içinde `[...]` sınıfı (içindeki `/` kapatmaz), kaçışlar ve sondaki bayraklar
    (`gimsuy`…) doğru atlanır.
  - Satır sonu içeren `/* */` yorumu yerine bir satır sonu, tek satırlık olanın yerine bir boşluk konur; böylece otomatik noktalı
    virgül (ASI) davranışı değişmez.
  - Şablon dizgisi (`` ` ``) görürse `Error('şablon dizgisi desteklenmiyor')` atar (ön yüz ES5'tir, şablon dizgisi yoktur).
  - Sonda satır sonu boşlukları silinir, art arda boş satırlar teke iner.
- **`cssYorumSil(kaynak)`** — CSS'ten `/* */` yorumlarını atar; dizgilere (`content: "/*x*/"`) dokunmaz. Kapanmamış yorum dosya
  sonuna kadar silinir. JS'ten farklı olarak kapanmamış dizgi satır sonunda durmaz, dosya sonuna kadar dizgi sayılır (içindeki
  yorumlar da kalır). Aynı boşluk toparlaması. Hata atmaz.
- **`kucultKontrollu(kaynak, tur)`** — dışarının kullandığı güvenli sarmalayıcı. `tur` `'css'` ise `cssYorumSil`; değilse
  `jsYorumSil` + sonucu `new vm.Script(sonuc)` ile YALNIZ DERLER (çalıştırmaz). Herhangi bir hata (şablon dizgisi, derleme hatası)
  olursa sunucu penceresine `Uyarı: js yorumları atılamadı (…); yorumlu hâli gönderiliyor.` yazar ve kaynağı değiştirmeden
  döndürür. Ortam değişkeni `EE_ACIK_KAYNAK=1` ise hiçbir şey yapmadan kaynağı döndürür (geliştirirken hata ayıklamak için:
  yorumlar ve `/* ==== parcalar/... ==== */` işaretleri kalır).

İç sabitler: `IFADE_ONCESI` (yukarıdaki karakter kümesi), `IFADE_KELIMESI` (yukarıdaki kelimeler için düzenli ifade).

## Kimle konuşur?

- Çağırdığı: yalnız Node'un `vm` modülü (derleme denetimi).
- Onu çağıran: [../http.md](../http.md) — parça birleştirici, `/js/app.js`, `/admin/yonetim.js` ve `/css/style.css`
  paketlerini üretirken (`kucultKontrollu(tanim.bas + parcalar + tanim.son, 'js' | 'css')`). Sonuç bellekte önbelleğe alınır;
  parça dosyalarının `mtime`/boyut imzası değişmedikçe yeniden hesaplanmaz.
- Testte doğrudan: `testler/test-kucult.js`.
- Veritabanı kullanmaz.

## Nasıl çalışır (adım adım)?

`jsYorumSil` kaynağı karakter karakter tek geçişte okur:

```
karakter ' ya da "   → dizgiyi sonuna kadar kopyala
karakter `           → hata (sarmalayıcı yorumlu hâle döner)
// ...               → satır sonuna kadar atla
/* ... */            → satır sonu içeriyorsa "\n", yoksa " " yaz
/  (tek)             → önceki anlamlı karakter/kelime düzenli ifade başlatıyor mu?
                         evet → sınıf/kaçış/bayrak farkında kopyala
                         hayır → bölme işareti, olduğu gibi yaz
başka                → yaz; boşluk değilse "son anlamlı karakter" olarak hatırla
sonunda              → satır sonu boşlukları ve fazla boş satırlar temizlenir
```

`kucultKontrollu` bunun üstüne güvenlik ağıdır: sonuç derlenemiyorsa yorumlu hâl gider.

## Dikkat!

- Düzenli ifade tanıma bir sezgidir. `)` önceki karakter listesinde yok: `if (x) /a\/\//.test(y)` gibi kapanan parantezden
  hemen sonra gelen düzenli ifade bölme sanılır; içindeki `//` yorum sanılıp satırın kalanı silinebilir. Çoğu durumda sonuç
  derlenmez ve güvenlik ağı yorumlu hâli gönderir; ama silinen parça sözdizimini bozmuyorsa kod SESSİZCE değişebilir. Ön yüzde
  böyle bir yazım kullanma (düzenli ifadeyi önce bir değişkene ata). `test-kucult.js` gerçek paketin yorumsuz hâlinin
  derlendiğini denetler, ama davranışın aynı kaldığını yalnız örnek parçada dener.
- CSS için derleme denetimi yok: CSS sonucu hiç denetlenmeden gönderilir. Test, `style.css`'in süslü parantez dengesine bakar.
- `EE_ACIK_KAYNAK=1` yalnız geliştirme içindir; canlıda açık kalırsa bütün yorumlar tarayıcıya gider.
- Yorumsuz paket bellekteki önbellekte tutulur; bu dosya değiştirilince sunucu yeniden başlatılmalı (parça dosyası değişmediği
  için imza tutar).

## Testleri

- `testler/test-kucult.js` (sunucusuz; `tumtest.sh` sunucusuz paket listesinde) —
  1) zor durumlar: dizgi içinde `/*` ve `//`, düzenli ifade içinde `/*` ve `[/*]` sınıfı, bölme işareti, `return /x\/y/`,
  `typeof /a/`, çok satırlı yorumun ASI'yi bozmaması; yorumlar gitti mi ve yorumlu/yorumsuz kod `vm` içinde aynı sonucu veriyor
  mu; şablon dizgisinde sarmalayıcının yorumlu hâli vermesi; CSS'te dizgi içinin korunması.
  2) gerçek paketler: `app.js`'in yorumsuz hâliyle derlenmesi, parça adı işaretlerinin kalmaması, en az %5 küçülmesi; yönetim ve
  uygulama parçalarında aynı adlı dosya olmaması; `/admin/yonetim.js` paketinin derlenmesi; `style.css`'in yorumsuz ve
  parantezlerinin dengeli olması.
- Elle: sunucuyu `EE_ACIK_KAYNAK=1` ile ve onsuz başlatıp `/js/app.js`'e bak (kendi deneme portunda; 3000'deki sunucuya değil).

## Son durum

- Dosya `4020378 commit 3` (2026-08-28) ile `jsYorumSil` ve `cssYorumSil` olarak geldi; `89eb5fa commit 77` (2026-08-29) derleme
  denetimli `kucultKontrollu` sarmalayıcısını ve `EE_ACIK_KAYNAK` kaçışını ekledi. O günden beri değişmedi.
- Açık iş yok. Sıradaki işlerden "Optimizasyon + saklama süreleri" paket boyutuna dokunabilir; planlı bir değişiklik yazılmamış.
