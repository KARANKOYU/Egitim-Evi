# public/js/parcalar/04c-telefon.js

Telefon alanı: sayfadaki her `<input type="tel">`'i solda ülke kodu seçimi, sağda yazarken gruplanan numara ("532 123 45
67") olan bir alana çevirir; numarayı uluslararası biçimde (E.164, `+905321234567`) okur, yazar, gösterir ve denetler.

## Bu dosya ne yapar?

Telefon numarası çok farklı yazılır: `0532 123 45 67`, `532-123-4567`, `+90 532…`, `0090…`. Sunucu hepsini tek biçimde,
`+905321234567` olarak saklar. Bu dosya ön yüzde aynı işi yapar ve kişiye yardım eder:

- Numara kutusunun soluna bir ülke kodu listesi (TR +90 varsayılan; Türkiye'den çok aranan 22 ülke) konur.
- Kişi yazarken rakamlar o ülkenin düzenine göre gruplanır; Türkiye'de başa yazılan `0` atılır ("0532" alışkanlığı).
- Başa `+49…` ya da `0049…` yapıştırılırsa ülke kodu listeden kendiliğinden seçilir.
- Okurken kutudaki değer `+<ülke kodu><numara>` olarak alınır; ekranlar metni kendileri ayrıştırmaz.

Hiçbir ekran bu alanı elle kurmaz: dosya yüklenir yüklenmez sayfadaki telefon kutularını dönüştürür ve bir gözlemciyle
sonradan açılan pencerelerdekileri de yakalar.

## İçinde neler var?

### Ülkeler ve biçim

- `ULKE_KODLARI` — `[kısaltma, ülke kodu, grup boyları]`, 22 satır: TR 90 (3-3-2-2), DE 49, NL 31, BE 32, FR 33, AT 43, CH 41,
  SE 46, GB 44, US 1, AZ 994, RU 7, UA 380, GE 995, BG 359, GR 30, IQ 964, SY 963, IR 98, SA 966, AE 971, QA 974.
- `ulkeBilgisi(kod)` — o koddaki satır; bilinmiyorsa Türkiye.
- `telefonNorm(t)` — sunucudaki `normTelefon`'un aynısı ([../../../sunucu/ortak.md](../../../sunucu/ortak.md)): boşluk,
  parantez, tire, nokta, eğik çizgi atılır; `00` → `+`; `+` ile başlıyorsa olduğu gibi; `0` ile başlayan her yazım
  Türkiye (`+90` + sıfırsız); `5` ile başlayan 10 hane → `+90…`; `90` ile başlayan 12 hane → `+90…`; başka her şey
  dokunulmadan döner.
- `telefonParcala(e164)` — `['90', '5321234567']`: listedeki EN UZUN eşleşen ülke kodu. `+` yoksa Türkiye sayılır; kod
  listede yoksa `['', rakamlar]`.
- `telefonGrupla(ulusal, gruplar)` — rakamları grup boylarına böler, artan rakamları sona ekler.
- `telefonGoster(e164)` — `"+90 532 123 45 67"`; kod listede yoksa `+` ve bitişik rakamlar; boşsa `''`.
- `telefonSorunuTR(t)` — sunucudaki `telefonSorunu` kuralının aynısı, iletisi kısa: boş → "Telefon numaranı yaz.";
  `+` ve 7–15 rakam değilse → "Telefon numarasını ülke koduyla yaz."; `+90` ile başlayıp 13 karakter değilse → "Türkiye
  numarası 10 haneli olmalı (5xx xxx xx xx)."; sorun yoksa `''`.

### Alan

- `telefonAlaniKur(kutu)` — kutuyu bir kez dönüştürür (`data-tel="1"`): önüne `<select class="tel-ulke" aria-label="Ülke
  kodu">` ("TR +90" …), ikisini `<div class="tel-kutu">` içine alır, `inputmode="tel"` koyar, `maxlength`'i kaldırır
  (gruplama boşluk ekler). Olaylar:
  - `input`: değer `+`/`00` ile başlıyorsa `telefonYaz` (ülke oradan seçilir); değilse rakamlar alınır, Türkiye'de baştaki
    `0` atılır, en çok 15 rakam gruplanıp yazılır;
  - ülke değişince: yeniden gruplanır, yer tutucu güncellenir (Türkiye `532 123 45 67`, öteki ülkeler grup düzeninde
    sıfırlar).
  - Kutudaki ilk değer (sunucudan gelen `+90…`) hemen `telefonYaz` ile ayrılıp yazılır.
- `telefonYaz(kutu, deger)` — değeri ayrıştırır, ülke kodu listedeyse seçer, ulusal kısmı gruplar. Kutu dönüştürülmemişse
  değeri olduğu gibi yazar.
- `telefonOku(kutu)` — boşsa `''`; dönüştürülmemiş kutuda `telefonNorm(değer)`; dönüştürülmüşte `'+' + seçili kod + rakamlar`
  (Türkiye'de baştaki `0` atılır).
- `telefonAlanlariniKur(kok)` — `kok` içindeki dönüştürülmemiş bütün `input[type="tel"]`'ler.
- Dosya yüklenince (paketin kurulum sırasında, `26-baslat.js`'i beklemeden): `telefonAlanlariniKur(document)` ve belgeye
  bağlı bir `MutationObserver`: yeni düğüm eklenen her değişiklikte bütün belge yeniden taranır.

## Kimle konuşur?

- Çağırdıkları: yalnız tarayıcının DOM'u; bu gruptaki öteki yardımcıları bile kullanmaz. İstek atmaz.
- Sunucudaki eşi: `sunucu/ortak.js` → `normTelefon`, `telefonSorunu` ([../../../sunucu/ortak.md](../../../sunucu/ortak.md)).
  Sunucu gelen numarayı yine kendisi normalleştirir ve denetler; buradaki kontrol yalnız kişiye erken haber vermek için.
- Dönüşen kutular (bugün `type="tel"` olanlar):
  - `index.html` → `kTelefon` (kayıt formu; `05-giris.js` `telefonOku` + `telefonSorunuTR`; zorunlu);
  - `10b-hesaplar.js` → `hfTelefon` (müdürün hesap açma/düzeltme penceresi; `telefonOku`, `telefonSorunuTR`);
  - `23-veli-ayarlar.js` → `hTelefon` (profil; `telefonOku` ile okunur ve sunucudan gelen ilk değerle — `data-ilk` —
    karşılaştırılır, `telefonSorunuTR`);
  - `19c-okul-hayati.js` → `sv_soforTel`, `sv_rehberTel` (okul yönetiminin servis penceresi; `telefonOku`).
- Başka kullananlar: `19c-okul-hayati.js` servis kartında `tel:` bağlantısı (`telefonNorm`) ve görünen numara
  (`telefonGoster`); `09b-site-ayarlari.js` site iletişim telefonunu `telefonSorunuTR` ile denetler (o kutu `type="text"`,
  dönüştürülmez, serbest yazılır).
- CSS: `public/css/parcalar/02-form.css` → `.tel-kutu` (yan yana), `.field .tel-kutu .tel-ulke` (dar liste),
  `.field .tel-kutu input` (rakamlar eşit genişlikte).
- Rol: kayıt olan ziyaretçi, profilini düzelten herkes, müdür/okul yönetimi (hesaplar, servis).

## Nasıl çalışır (adım adım)?

```
sunucu:  phone = '+905321234567'
   profil çizilir: <input type="tel" id="hTelefon" value="+905321234567" data-ilk="+905321234567">
   gözlemci ─► telefonAlaniKur ─► telefonYaz: ['90', '5321234567'] ─► [TR +90 ▾] [532 123 45 67]
kişi "0 5 4 4 …" yazar ─► input ─► rakamlar, baştaki 0 atılır, 3-3-2-2 ─► "544 …"
kaydet ─► telefonOku ─► '+90544…' ─► data-ilk'ten farklı mı? ─► telefonSorunuTR ─► api(...)
sunucu ─► normTelefon + telefonSorunu (asıl karar)
```

## Dikkat!

- **Listede olmayan ülke kodu bozulur.** Ülke kodu `ULKE_KODLARI`'nda yoksa (ör. Avustralya `+61…`) `telefonParcala`
  `['', rakamlar]` döner; `telefonYaz` listeyi TR'de bırakır ve rakamları (ülke kodu dahil) kutuya yazar; `telefonOku`
  sonra `+90` ekler: `+61412345678` → `+9061412345678`. Böyle bir numara web'den girilemez (Türkiye numarası 10 haneli
  olmalı hatası), ama başka yoldan kayıtlıysa (içe aktarma, uygulama) profilde e-posta ya da kullanıcı adı değiştirmek bile
  bu telefon hatasıyla durur, çünkü `telefonOku` değeri `data-ilk`'ten farklı okur. Kod değiştirilmedi; düzeltmek için
  bilinmeyen kodda kutuyu dönüştürmemek ya da listeye "Diğer" seçeneği eklemek gerekir.
- **`+` ya da `00` tuş tuş yazılamaz, yalnız yapıştırılabilir.** Her tuşta `input` olayı çalışır. İlk tuş `+` ise
  kutudaki tek karakter `telefonYaz('+')` ile ayrıştırılır, içinde rakam olmadığı için kutu boşalır. Türkiye seçiliyken
  ilk `0` da "0532 alışkanlığı" diye atılır, yani `00` hiç birikmez. Sonuç: `+49 151 …`'i elle yazan kişinin rakamları
  Türkiye numarası gibi gruplanır ve kayıtta "Türkiye numarası 10 haneli olmalı" hatası çıkar (yanlış numara
  kaydedilmez). Yabancı numara için ülke listeden seçilmeli ya da numara başıyla birlikte yapıştırılmalı. Kod
  okumasına ve işlevlerin Node'da tuş tuş benzetimine göre; tarayıcıda denenmedi. Kod değiştirilmedi; düzeltmek için
  `+`/`00` ile başlayan değer, `telefonParcala` listeden bir ülke kodu bulana kadar olduğu gibi bırakılmalı (`+4` ya da
  `004` henüz hiçbir koda uymaz, bugün bunlar da `4`'e iner).
- **Öteki ülkelerde baştaki `0` atılmaz.** Almanya'da alışkanlıkla `0151 …` yazan biri `+490151…` gönderir; kural (7–15
  rakam) bunu kabul eder ama numara uluslararası biçimde yanlıştır. Yalnız Türkiye için `0` atılıyor.
- **İleti metinleri sunucudakinden farklı.** Kural aynı, iletiler farklı: sunucu "Telefon numarası gerekli" ve "… ülke
  koduyla yaz (ör. +90 532 123 45 67)" der. Birini değiştirirsen öbürünü de gözden geçir; kuralı DEĞİŞTİRİRSEN ikisini birlikte
  değiştir (`sunucu/ortak.js`).
- **Gözlemci geniş.** Belgeye eklenen her düğümde bütün belge taranır (`querySelectorAll`); [04a-form-alanlari.md](04a-form-alanlari.md)'nin
  şifre gözlemcisiyle birlikte her çizimde iki tarama. Bugünkü sayfalarda sorun yok.
- **Bu dosya yüklenir yüklenmez çalışır.** Paket `index.html`'in sonunda yüklendiği için `document.body` hazırdır; paket
  `<head>`'e taşınırsa `observe(document.body …)` hata verir.
- **`maxlength` kaldırılır:** HTML'deki `maxlength="20"` gruplama boşlukları yüzünden işe yaramazdı; sınır 15 rakamdır.
- Ekranlar kutunun `value`'suna doğrudan bakmamalı (gruplanmış, ülke kodsuz metin); her zaman `telefonOku` kullan. Değer
  yazarken de `telefonYaz` (ya da HTML'de `value="+90…"` ver; gözlemci ayrıştırır).

## Testleri

- Bu dosyanın doğrudan (tarayıcılı) testi yok.
- Sunucudaki eş kuralı dolaylı deneyenler: `testler/test-giris-kayit.js` (kayıtta `phone: '05321234567'` kabul, `'123'` →
  `alan: 'telefon'` hatası), `testler/test-site-ayarlari.js` (site iletişim telefonu), `testler/girdi-denetimi.js` (bozuk
  türde telefon değeri).
- `testler/yazim-denetimi.js` (iletiler).
- Elle: kayıt ekranında telefona `0532 123 45 67` yaz → kutu `532 123 45 67` göstermeli; `+49 151 23456789` yapıştır →
  liste DE +49'a geçmeli, numara `151 2345 6789` gibi gruplanmalı. Profilde telefonu değiştir, kaydet, sayfayı yenile →
  aynı numara aynı ülkeyle gelmeli.

## Son durum

- `git log`: 2 commit, ikisi de 2026-09-26. `fa8a8bc commit 384` dosyanın ilk 134 satırını (ülke listesi, `telefonNorm`,
  ayrıştırma, gruplama, gösterim, denetim, `telefonAlaniKur`, `telefonYaz`) getirdi; `37f867d commit 385` `telefonOku`,
  `telefonAlanlariniKur` ve açılışta kurulum + gözlemciyi ekledi. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): listede olmayan ülke kodu, `+`/`00`'ın tuş tuş yazılamaması, öteki ülkelerde
  baştaki `0`.
- Planlı işlerden bu dosyaya dokunması beklenenler: "Tek kişi tek hesap … Excel 'Eşleyelim mi?'" (tanım, içe aktarmada
  sütunlardaki telefonu da tanıyacak; içe aktarılan yabancı numaralar yukarıdaki açığı görünür kılabilir); "Çok dil"
  (iletiler; varsayılan ülkenin dile göre seçilmesi de düşünülebilir, tanımda yok).
