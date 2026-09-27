# sunucu/ortak.js

Her yerde kullanılan küçük yardımcılar ve sabitler: ders ve il listesi, kimlik ve zaman, istek gövdesinin temizlenmesi,
kişi kodu, kullanıcı adı / e-posta / T.C. / telefon / doğum tarihi / şifre kuralları, okul adresi (kısa ad), tarih ve
sayı çözme.

## Bu dosya ne yapar?

Bir kural birden çok yerde geçiyorsa (kayıtta, şifre değiştirmede, okulun açtığı hesapta, Excel'le toplu hesapta,
yönetici dosyasında…) burada TEK kez yazılır. Böylece "şifre en az 8 karakter" kuralı bir yerde 8, başka yerde 6
olmaz; "Ayse@X.com " ile "ayse@x.com" her yolda aynı hesap sayılır. Dosya hiçbir proje modülüne bağımlı değildir
(yalnız Node `crypto`); en alttaki katmandır, döngüsel bağımlılık yaratmaz.

## İçinde neler var?

Sabitler:

- `SUBJECTS` — okulun ders listesi (Matematik, Türkçe, İngilizce, Din Kültürü ve Ahlak Bilgisi, Sosyal Bilgiler, Fen
  Bilimleri, Müzik, Resim, Beden Eğitimi). Kapsam doğrulaması (`yetki.js`) buna bakar.
- `CITIES` — 81 il. `RESULT_TYPES` — ödev sonuçları: `yapti`, `yapmadi`, `eksik`, `gec`, `izinli`, `gelmedi`.
- `OKUL_ROLLERI` (`principal`, `teacher`, `student`, `servisci`) ve `okulHesabiMi(rol)` — kullanıcı adı ve T.C. no
  okul içinde benzersiz olan roller.
- `ESKI_SAATLER` — eski "ders saati numarası → saat aralığı" tablosu; yalnız eski JSON verisini aktarırken
  (`veri/json-aktarim.js`).

Kimlik, zaman, gövde:

- `uid(onek)` → `onek_<18 hex>` (9 rastgele bayt). `now()` → ISO zaman.
- `govdeTemizle(v)` — `http.js readBody` her JSON gövdesini buradan geçirir: metinlerden NUL (`\u0000`, PostgreSQL'de
  yasak) atılır; diziler en çok 500 eleman; derinlik 6'dan sonrası olduğu gibi; nesneler `Object.prototype`'sız bir
  ilkörnekten (`GOVDE_ILKORNEK`) üretilir ve `__proto__`, `constructor`, `prototype`, `toString`, `valueOf` anahtarları
  atılır (prototip kirlenmesi olmaz); ilkörneğin `toString`'i `''` döndürür, bu yüzden metin beklenen alana nesne
  gelirse alan boş sayılır (500 değil 400).
- `metinYap(v)` — `null`/nesne → `''`, değilse `String(v)`. `clean(s, max=200)` — metin değilse `''`; NUL atılır,
  kırpılır, kısaltılır.

Kişi kodu (öğrencide "veli kodu", yetişkinde müdüre/yöneticiye verilen kod; servisçi ve yöneticide yok):

- `KISI_KODU_UZUNLUK = 16`, `KISI_KODU_DESENI` — ilk karakter harf; büyük, küçük, rakam ve `! ? # * + =`'den en az
  birer tane; karışan karakterler (`I L O l o 0 1`) ve Türkçe harf yok; tire yok (tire ayırıcı). 61 simgelik alfabe
  (ilk karakter 47 harften biri).
- `kisiKoduUret()` — kurala uyana kadar `crypto.randomInt` ile üretir.
- `kisiKoduSade(girdi)` — boşlukları, tireleri ve tire kılığındaki Unicode karakterleri, görünmez karakterleri siler
  (`KISI_KODU_AYIRICI`; ön yüzdeki `05-giris.js` ve Android'deki `KisiKodu.java` ile aynı küme), harf durumunu korur;
  geçerli değilse (eski 10 ve 15 haneli biçimler dahil) `''`.
- `kisiKoduBicim(kod)` — `XXXX-XXXX-XXXX-XXXX`.

Kimlik alanları (e-posta, kullanıcı adı, T.C.):

- `kimlikSade(v)` — NFKC (tam genişlikli harf/rakam, bitişik harf, birleşik aksan tek biçime), görünmez biçim
  karakterleri (`\p{Cf}`) silinir, `İ` → `i` ("İ".toLowerCase() "i̇" verdiği için; `i̇` de `i` olur), kırpılır,
  küçültülür. `normEmail` ve `normKullaniciAdi` bunun adlarıdır.
- `EPOSTA_DESENI`, `epostaSorunu(e)` → ileti ya da `''` — yalnız ASCII; Türkçe ya da başka alfabeden harf varsa ayrı ve
  açık ileti ("ı, ş, ğ… olamaz"), ≤254.
- `kullaniciAdiSorunu(ad)` — 3–30, harfle başlar, yalnız `a-z 0-9 . _`, Türkçe harf yok.
- `tcSorunu(tc)` — 11 hane, 0 ile başlamaz, 10. ve 11. hane resmî algoritmayla (yazım hatasını yakalar, numaranın
  gerçekten var olduğunu değil); boşsa `''`. `normTc(tc)` — NFKC, boşluk ve görünmez karakterler silinir.

Kişi bilgileri:

- `adDuzelt(ad)` — hep küçük ya da hep büyük yazılmış adı Türkçe kurala göre kelime başları büyük yapar ("AYŞE
  YILMAZ" → "Ayşe Yılmaz"); karışık yazılmışa dokunmaz.
- `normTelefon(t)` → E.164 (`+905321234567`): `00` → `+`; `0…`, `5xxxxxxxxx`, `90…` Türkiye sayılır.
  `telefonSorunu(t)` — `+` ve 7–15 hane; Türkiye numarası 10 hane.
- `dogumSorunu(deger, zorunlu)` — `YYYY-AA-GG`, gerçek gün, gelecekte değil, 1920'den eski değil; öğrencide zorunlu.
- `sifreSorunu(pw, guclu)` → ileti ya da `null` — en az 8, en çok 200; güçlü kural (yetişkin: veli, öğretmen, müdür,
  yönetici): büyük harf, küçük harf, rakam ve özel karakter — eksikler tek iletide sayılır; zayıf kural (okulun açtığı
  öğrenci ve servisçi): harf ve rakam. `gucluSifreli(u)` — öğrenci ve servisçi dışında herkes (u yoksa da güçlü).
  Kural yalnız şifre BELİRLENİRKEN uygulanır; eski şifreyle giriş sürer.

Okul adresi:

- `asciiYap(s)` — Türkçe harfleri ASCII'ye çevirir (iç kullanım).
- `KISA_AD_YASAK` (iç) — sitenin kendi yollarıyla karışacak adlar (`api`, `admin`, `school`, `kvkk`, `indir`, `sss`…).
- `kisaAdSorunu(s)` — 3–40, `a-z 0-9 -`, tireyle başlayıp bitmez, `--` yok, yasak listede değil.
- `kisaAdUret(ad)` — "Özel Doruk Koleji" → `ozel-doruk-koleji` (40'ı aşarsa kelime sınırında kısaltır, çok kısaysa
  `okul-` öneki, yasaksa `-okulu` eki).

Tarih ve sayı:

- `tarihCoz(v)` — "12.05.2011", "12/05/2011", "2011-05-12" ya da Excel gün sayısı (40675) → `YYYY-AA-GG`; boşsa `''`,
  anlaşılamazsa `null`.
- `ondalik(v)` — "490,161" → 490.161; değilse `null`. `gunTarih(iso)` → "GG.AA.YYYY".

## Kimle konuşur?

- Çağırdığı: yalnız `crypto`.
- Onu çağıranlar (grep): hemen bütün bölümler (`sunucu/bolumler/*`), `sunucu/http.js` (`govdeTemizle`),
  `sunucu/yetki.js` (`SUBJECTS`), `sunucu/yonetici-dosyasi.js`, veri katmanı (`veri/index.js`, `veri/json-aktarim.js`,
  `veri/depo/genel.js`, `kullanicilar.js`, `quiz.js`, `sinavlar.js`), araçlar (`deneme-okulu.js`, `giris.js`,
  `gorsel-veri.js`, `yuk-testi.js`) ve testler (`test-cakisma.js`, `test-kisi-kodu.js`, `test-xlsx.js` — `tarihCoz`,
  `test-okul-agi.js`, `test-push.js`, `test-yetiskin.js`, `test-yonetim.js`). `tarihCoz`'u sunucuda `hesaplar.js`,
  `nakil.js` ve `hatirlatici.js` kullanır (`yardimci/` altındaki dosyalar bu modülü çağırmaz). Örnekler: kişi kodu → `veri/depo/kullanicilar.js`, `bolumler/hesaplar.js`, `veli.js`,
  `yonetici-okul.js`, `okul.js`; `kisaAdSorunu` → `hesaplar.js`, `site-ayarlari.js`, `yonetici-okul.js`, `veri/index.js`;
  `telefonSorunu` → `kayit.js`, `hesaplar.js`, `kisilik.js`, `okul-hayati.js`, `site-ayarlari.js`.
- Veri tablosu yok. Ama şemadaki kurallar buna paraleldir: kişi kodu CHECK'i (`032`, daha gevşek; sınıf koşulu burada),
  e-posta/kullanıcı adı/T.C. tekil indeksleri (`031`).

## Nasıl çalışır (adım adım)?

Tipik kullanım, bir kayıt ucunda:

```
body (readBody → govdeTemizle)
  email = normEmail(body.email)      → epostaSorunu(email)       → 400 "Geçerli bir e-posta adresi gir."
  username = normKullaniciAdi(...)   → kullaniciAdiSorunu(...)
  sifreSorunu(body.password, gucluSifreli(u))
  telefon = normTelefon(...)         → telefonSorunu(...)
  fullName = adDuzelt(clean(body.fullName, 80))
  → depo'ya yaz (tekil indeks yarışta son sözü söyler)
```

## Dikkat!

- `kimlikSade` kuralını değiştirirsen eski kayıtlarla karşılaştırma bozulur; veritabanında saklanan biçim buna göredir
  (`veri/` açılışta eski biçimleri düzeltir — bkz. `test-cakisma.js`). Değişiklik bir şema/geçiş işi gerektirir.
- Kişi kodu kümesi (ayırıcılar, alfabe) ön yüzde (`05-giris.js`) ve Android'de (`KisiKodu.java`) de var; üçü birlikte
  değişmeli.
- Kişi kodunun ilk karakteri harf: Excel'e yapıştırılınca `+ - =` ile başlayan hücre formül sanılmasın.
- `clean` ve `metinYap` neden nesneyi boş sayar: `govdeTemizle` prototipsiz nesne ürettiği için `String(nesne)` eskiden
  "Cannot convert object to primitive value" atıyor, herkes istediği uca 500 aldırabiliyordu.
- Dosyanın başında (28–31. satırlar) şifre özetlemeyle ilgili sahipsiz bir yorum var ("senkron sürüm yalnızca açılışta
  … ilk admin hesabı için"); kod `sifre.js`'e taşınmış, `hashPwSync`'i bugün çağıran yok. Yorum eskidir.
- `ESKI_SAATLER` yalnız eski JSON aktarımı için duruyor; yeni kodda kullanma.

## Testleri

- `testler/test-kisi-kodu.js` — kişi kodu biçimi (16, sınıflar, karışan karakter yok, tireli/tiresiz/boşluklu
  yapıştırma, eski 10/15 haneli kod geçmez).
- `testler/test-cakisma.js` — `normEmail`, `normKullaniciAdi`, `normTc` (büyük/küçük, Türkçe İ/ı, tam genişlikli harf,
  birleşik aksan, görünmez karakter).
- `testler/test-xlsx.js` — tarih çözme ve toplu aktarım yardımcıları.
- `testler/girdi-denetimi.js` — gövdeye nesne/dizi/NUL/`__proto__` göndererek 500 aranır (`govdeTemizle`, `clean`).
- `testler/test-giris-kayit.js`, `test-sifre.js`, `test-yetiskin.js` — e-posta, kullanıcı adı, şifre kuralları;
  `test-okul-sayfasi.js`, `test-site-ayarlari.js` — kısa ad kuralları.
- Elle: `node -e "const o=require('./sunucu/ortak'); console.log(o.kisiKoduBicim(o.kisiKoduUret()))"`.

## Son durum

- Son commit `153d63d commit 522` (2026-09-27): kişi kodu 15'ten 16 karaktere çıktı; alfabeden `-` çıkıp `=` girdi,
  tire artık ayırıcı; ekranda 5'erli boşluklu gruplar yerine 4'erli tireli gruplar (`kisiKoduBicim`); girişte tire ve
  tire benzerleri de silinir (`KISI_KODU_AYIRICI`).
- `276c0a0 commit 521`: `kimlikSade` (NFKC, görünmez karakter, Türkçe İ), `normTc`, yalnız ASCII e-posta kuralı
  (`EPOSTA_DESENI`, `epostaSorunu`) — aynı e-posta/kullanıcı adı/T.C. çakışmaları işi; `0acca75 commit 516`: kişi kodu
  (o zaman 15 karakter) ve portallar.
- Açık iş yok.
