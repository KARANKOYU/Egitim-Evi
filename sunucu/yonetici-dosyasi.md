# sunucu/yonetici-dosyasi.js

`data/admins.json`'daki sistem yöneticisi hesaplarını açar; dosyayı açılışta ve sunucu çalışırken aralıkla yoklar,
yönetim panelindeki "Yönetici dosyası" kartına şifresiz özet verir.

## Bu dosya ne yapar?

Sistem yöneticisi (okulları açan, site ayarlarını yapan kişi) kayıt formundan olunamaz; yönetici hesabı ancak sunucuya
erişimi olan birinin elle yazdığı bir dosyayla açılır: `data/admins.json` (depoya girmez; örneği
`belge/admins.ornek.json`). Biçim:

```json
{ "yoneticiler": [ { "ad": "Ayşe Yılmaz", "eposta": "ayse@ornek.com", "kullaniciAdi": "ayse", "sifre": "..." } ] }
```

(Düz dizi de kabul edilir; `email`, `fullName`, `username` İngilizce adları da okunur.)

Bu dosya o JSON'u okur, her satırı denetler ve veritabanında olmayan yöneticiyi açar. Dosya yalnız hesap AÇAR:
var olana dokunmaz, dosyadan silinen yönetici veritabanından silinmez; bir şifre sıfırlama yolu da değildir.

## İçinde neler var?

- `DOSYA` — `DATA/admins.json`. Dosya başına en çok 50 yönetici (`EN_COK`).
- `dosyayiOku(dosya)` → `{ liste }`, `{ liste: null }` (dosya yok) ya da `{ hata }`. BOM atılır; JSON hatası Türkçe ve
  satır numaralı anlatılır (`jsonHatasi`: "JSON biçimi bozuk (dosyanın 4. satırı): virgül, tırnak ya da parantez eksik
  ya da fazla olabilir", "dosya boş", "dosya yarıda bitiyor"); `yoneticiler` yoksa ya da 50'yi aşıyorsa hata.
- `uygula(depo, { dosya?, sifreUret? })` → `{ dosyaVar, hata, uyari, eklenen: [{ eposta, kullaniciAdi, uretilenSifre }],
  atlanan: [{ sira, eposta, neden }] }`. Her satır için sırayla:
  1. nesne mi; 2. e-posta (`normEmail`, `epostaSorunu`, ≤120; Türkçe/başka alfabe harfi ayrıca söylenir); 3. aynı e-posta
  dosyada iki kez mi; 4. ad (`metinYap` → `adDuzelt`, ≤80, en az 2 harf); 5. e-posta veritabanında var mı — yöneticiyse
  "zaten yönetici (değiştirilmedi)", değilse "bu e-posta yönetici olmayan bir hesapta; o hesap yönetici yapılmadı";
  6. kullanıcı adı: yazıldıysa `kullaniciAdiSorunu` ve başka hesapta mı, yazılmadıysa `kullaniciAdiBul` (e-postanın @
  öncesi, harfle başlamazsa `yonetici` öneki, alınmışsa sayı eki); 7. şifre: yazıldıysa yetişkin şifre kuralı
  (`sifreSorunu(…, true)`), yazılmadıysa `sifreUret()`; 8. `depo.kullanicilar.ekle` (`role: 'admin'`,
  `status: 'approved'`, `sifreDegismeli: true`); tekillik çakışması (`23505`) olursa satır atlanır; 9. işlem kaydı
  `yonetici.eklendi`.
  Atlanma nedenleri küçük harfle, sonda noktasız (`nedenYap`); panel ilk harfi büyütür. Linux'ta dosya başkalarınca
  okunabiliyorsa `uyari`: "chmod 600 …" (`izinUyarisi`; Windows'ta sessiz).
- `yaz(sonuc)` — sonucu sunucu penceresine yazar: açılan hesabın e-postası, kullanıcı adı ve yalnız ÜRETİLEN şifre ("Bu
  şifre bir daha gösterilmez"); dosyada yazılan şifre asla yazılmaz. "zaten yönetici" satırları her açılışta
  tekrarlamasın diye yazılmaz.
- `oku(depo, { dosya?, sifreUret?, sessiz? })` — dosyayı (değişmemiş olsa da) okur, uygular, pencereye yazar (sessiz
  değilse), son okuma durumunu (imza, zaman, şifresiz sonuç) saklar. Okumalar dosya başına SIRAYA girer.
- `denetle(depo, secenek)` — son okumadan beri imza (mtime + boyut) değiştiyse ya da hiç okunmadıysa `oku`, değilse
  `null`.
- `zamanla(depo, { sifreUret, aralikMs })` — `aralikMs()` (her turda yeniden sorulur, en az 1 sn) aralıkla `denetle`;
  zamanlayıcı `unref`. `aralikDegisti()` bekleyen turu yeni aralıkla yeniden kurar.
- `gorunum(dosya?)` — panel kartı: `{ dosya: 'data/admins.json', sonOkuma, dosyaDegisme, simdiVar, okunmadanDegisti,
  dosyaVar, hata, uyari, eklenen: [{ eposta, kullaniciAdi, sifreUretildi }], atlanan }`.
- `sifresiz(sonuc)`, `imzaAl(dosya)` — yardımcılar (dışa açık, testler kullanır).

## Kimle konuşur?

- Çağırdıkları: `fs`, `path`, `./yollar` (`DATA`), `./ortak` (`uid`, `now`, `epostaSorunu`, `normEmail`,
  `normKullaniciAdi`, `kullaniciAdiSorunu`, `sifreSorunu`, `metinYap`, `adDuzelt`), `./sifre` (`hashPw`); `depo`
  parametre olarak gelir: `depo.kullanicilar.epostayla`, `kullaniciAdiHerhangiYerde`, `ekle`; `depo.genel.islemYaz`.
- Onu çağıranlar (grep):
  - `sunucu/veri/index.js` — açılışta (`baslat`) `oku` (ilk okuma);
  - `sunucu/index.js` — `zamanla` (site ayarı `adminsAralikDk`, varsayılan 1 dk);
  - `sunucu/bolumler/yonetici.js` — `GET /api/admin/yonetici-dosyasi` (kart: `gorunum()` + `aralikDk`) ve
    `POST /api/admin/yonetici-dosyasi/oku` ("Şimdi oku": `oku`, işlem kaydı `yonetici.dosya-okundu`, ileti);
    yalnız yönetici (öbürlerine bilinmeyen adres, bkz. `api.js`);
  - `sunucu/bolumler/site-ayarlari.js` — `adminsAralikDk` değişince `aralikDegisti()`;
  - `testler/test-yonetici-dosyasi.js`, `testler/test-cakisma.js`.
- Tablo: kullanıcılar (ekleme), işlem kaydı.

## Nasıl çalışır (adım adım)?

```
açılış: veri.baslat → oku (pencereye yazar)        sunucu açık: zamanla → her aralıkta denetle
                                                       imza (mtime:boyut) aynı → hiçbir şey
panel "Şimdi oku" → oku (sessiz değil)                 değişti / hiç okunmadı → oku
     └── hepsi aynı sıradan geçer (d.sira): iki okuma aynı yöneticiyi iki kez açmaya çalışmaz
oku → imzaAl (uygulamadan ÖNCE) → uygula → yaz → durum = { imza, sonOkuma, sonuc: sifresiz }
```

## Dikkat!

- **Sessiz yetki yükseltme yok:** dosyaya yazılan e-posta ya da kullanıcı adı yönetici olmayan bir hesaptaysa o hesap
  yönetici YAPILMAZ. Aksi hâlde sunucu dosyasına bir satır yazabilen biri herhangi bir hesabı yönetici yapabilirdi.
- **Şifre hiçbir yere gitmez:** dosyadaki şifre ne pencereye, ne panele, ne işlem kaydına yazılır. Üretilen şifre
  YALNIZ pencereye bir kez yazılır; panel kartı yalnız `sifreUretildi: true` görür. Sunucu çalışırken eklenen satırda
  pencereye bakılmayabilir, bu yüzden şifreyi dosyaya yazmak önerilir. İki durumda da ilk girişte şifre değiştirilir
  (`sifreDegismeli`); dosyadaki şifre sonra geçersizdir ve dosyadan silinebilir.
- Şifresini değiştirmemiş yönetici `/admin` çerezi almaz (`yonetim-cerezi.js`).
- İmza uygulamadan ÖNCE alınır: okuma sürerken dosya değişirse bir sonraki yoklama yeni hâli yakalar.
- `fs.watch` kullanılmaz (platformlar arası güvenilmez); yalnız `fs.stat` ile yoklama.
- Bozuk dosya sunucuyu durdurmaz: sorun yazılır, dosya atlanır.
- Yönetici e-postasına gelen kodla iki adımlı girer: e-posta gerçek olmalı.
- Dosya depoya girmez (`.gitignore`; `test-gizli-dosyalar.js` denetler); yetkiler `chmod 600` olmalı.

## Testleri

- `testler/test-yonetici-dosyasi.js` — dosyadaki yönetici açılır, ilk girişte şifre değişimi; şifre yazılmadıysa
  üretilir, kullanıcı adı e-postadan türetilir; var olan yöneticiye dokunulmaz; yönetici olmayan hesap yönetici
  yapılmaz; zayıf şifre, bozuk e-posta, eksik/tek harfli ad, tekrarlanan satır atlanır (Türkçe nedenler); bozuk JSON
  iletisi satırlı; kart dosyanın şu anki hâlini ve son okumadan sonra değiştiğini söyler; işlem kaydı; şifresini
  değiştirmemiş yönetici çerez almaz; canlı okuma ("Şimdi oku", imza yoklaması, `zamanla`).
- `testler/test-cakisma.js` — admins.json yolunda aynı e-posta/kullanıcı adı çakışmaları.
- `testler/test-gizli-dosyalar.js` — `data/admins.json` depoya giremez, `sunucu/yonetici-dosyasi.js` girer.
- Elle: test sunucusunun `testler/testdata/admins.json`'una bir satır yaz; en geç 1 dk içinde pencerede "Yönetici
  hesabı açıldı" çıkmalı; panelde kart "1 açıldı" göstermeli.

## Son durum

- Tek commit: `276c0a0 commit 521` (2026-09-27; gizli /admin + site ayarları + admins.json canlı okuma + çakışmalar)
  — dosya bu işte yazıldı.
- Açık iş yok. "Paneller" işinde `destek.json` benzer bir düzenle gelecek; bu dosya örnek alınabilir.
