# sunucu/bolumler/yonetici-okul.js

Sistem yöneticisinin okul açması (`POST /api/admin/okul-ac`) ve kişi koduyla kişi bulması
(`POST /api/admin/kisi-bul`).

## Bu dosya ne yapar?

Eğitim Evi'nde müdür başvurusu yoktur. Okulunu açtırmak isteyen kişi önce kendi yetişkin hesabını açar
([kayit.md](kayit.md)) ve "+ Ekle > Müdür"de gördüğü kişi kodunu sistem yöneticisine verir. Yönetici kişiyi
dışarıdan (telefon, e-posta) doğrular; "Bul" ile kodun kime ait olduğunu görür (tam ad, maskeli e-posta); okulu MEB
listesinden seçer ya da adını yazar, okulun adresini (`egitimevi.org/school/<uzantı>`), müdürün kişi kodunu ve
isterse okulun disk sınırını girer. Okul ve müdür rolü onaylı açılır; kişinin kodu aynı işlemde yenilenir (tek
kullanımlık). Kişi okuluna sol üstteki menüden ("Portallarım") geçer.

E-postayla ya da yeni hesap açarak müdür yapma yolu yoktur. Müdürü kaldırılmış ("sahipsiz") bir okul da aynı
formla yeni müdürüyle yeniden açılır ve kendi eski adresini koruyabilir.

Uçlar [yonetici.md](yonetici.md)'den çağrılır; oraya gelen istek zaten giriş yapmış yöneticidir.

## İçinde neler var?

### Dışa açık

- `kisiBul(req, res, me, body)` — `POST /api/admin/kisi-bul { kod }` → `{ ad, eposta (maskeli), kullaniciAdi,
  rolSayisi }`. Hata `{ error, alan: 'kod' }` ve `kodunSahibi`'nin durumu (404, 400, 429).
- `okulAc(req, res, me, body)` — `POST /api/admin/okul-ac`. Gövde: `mebSchoolId` (MEB listesinden) YA DA
  `schoolName` + `city` + `district`; `kisaAd` (okul adresi); `mudurKodu`; isteğe bağlı `diskMb`. Hatalar
  `400 { error, alan }` (`alan`: `okul`, `il`, `ilce`, `kisaAd`, `diskMb`, `mudurKodu`); kod bulunamazsa 404, sınır
  aşılırsa 429. Başarıda `{ okul: { id, ad, kisaAd, diskSiniriMb }, mudur: { ad, kullaniciAdi }, message }`.

### İç

- `kodunSahibi(req, me, kodHam, bulma)` → `{ kisi, kod }` ya da `{ hata, durum }`:
  - yalnız "Bul"da yönetici başına dakikada 30 istek (429);
  - IP başına saatte 30 YANLIŞ kod — "Bul" ve "Aç" birlikte sayılır (429 "Bir saat sonra");
  - kod `kisiKoduSade` ile boşluk ve tirelerden arınır (büyük/küçük harf duyarlı); sahibi yoksa 404 "Bu kodla bir
    hesap yok." (yanlış kod sayılır);
  - sahibi yönetici ya da isteği yapanın kendisiyse 400 "Sistem yöneticisi hesabı müdür yapılamaz.";
  - sahibi yetişkin hesabı değilse (okulun açtığı hesap, rol satırı) 400 "Bu kod bir okul hesabına ait…".
- `epostaKisalt(adres)` — ilk iki harf (kısa adreste bir), SABİT dört yıldız, sonra `@` ve alan adı olduğu gibi: `ay****@<alan adı>`.
  Yıldız sayısı sabit olduğu için adresin uzunluğu belli olmaz.

### `okulAc`'ın denetimleri, sırasıyla

1. **Okul:** `mebSchoolId` verildiyse `okulKimlikBul` ([okullar.md](../okullar.md)) — listede yoksa `alan: 'okul'`;
   ad, il, ilçe ve tür MEB'den gelir. Verilmediyse ad (140 karaktere kadar) zorunlu, il `CITIES`'ten, ilçe zorunlu.
2. **Adres:** `kisaAd` küçük harfe çevrilir, `kisaAdSorunu` ile denetlenir.
3. **Okul zaten var mı** (`depo.okullar.cakisan(mebId, il, ad)`): varsa ve onaylıysa "zaten kayıtlı ve müdürü var";
   onaylı değil ama müdürü varsa "müdürünü 'Müdürler' listesinde bul". Onaylı değil VE müdürü yoksa okul
   **sahipsizdir**: yeniden açılır.
4. **Adres başka okulda mı** (sahipsiz okulun kendi adresi sayılmaz).
5. **Disk sınırı:** `okulDisk.mbOku(diskMb, true)` — boş (yok, `null`, `''`) varsayılan demektir; değilse 1 MB ile
   10 TB arası tam sayı MB. Sahipsiz okulda verilmezse eski sınır kalır.
6. **Müdürün kodu:** boşsa `alan: 'mudurKodu'`; `kodunSahibi`; kişinin sahipsiz okulda zaten bir rolü varsa (ör.
   öğretmenlik) "Önce o rolü okuldan çıkar"; kişi en çok 10 okulda rol alabilir.
7. **Tek işlem:** kod harcanır (`eslesmeKoduTuket`: kod hâlâ eskisiyse yenisini yazar; değilse hiçbir şey yazılmaz →
   404 "Bu kod az önce kullanıldı…"), yeni okul eklenir (sahipsizde adres yazılır, durum `approved` olur, disk
   verildiyse yazılır), müdür rol satırı eklenir: `anaHesapId` = kişi, e-posta yok, şifre alanı `'kullanilmaz'`,
   okulda boş bir kullanıcı adı (`okuldaBosAd`), branş "Müdür", aydınlatma onayı kişiden kopyalanır.
8. Tekil indeks yarışları: adres (`kisaAd`), kişinin bu okulda az önce açılmış rolü (`kod`), kullanıcı adı
   (`kullaniciAdi`) ayrı iletilerle; başka bir `23505` "Bu okul ya da adres az önce kaydedildi…"; tanınmayan hata
   yukarı atılır.
9. Okul önbelleği boşaltılır (`okulOnbellekBosalt`: adres az önce "yok" diye önbelleğe girmiş olabilir), işlem kaydı
   `okul.acildi` ("<ad> (<adres>) — müdür <kullanıcı adı>, disk sınırı <…>"), kişiye bildirim ("… müdürü olarak
   eklendin. Sol üstteki menüden okuluna geçebilirsin.").

## Kimle konuşur?

- Çağırdıkları: `../http` ([http.md](../http.md): `ok`, `sendJSON`, `okulOnbellekBosalt`), `../ortak`
  ([ortak.md](../ortak.md): `CITIES`, `clean`, `kisaAdSorunu`, `kisiKoduSade`, `now`, `uid`), `../okullar`
  ([okullar.md](../okullar.md): `okulKimlikBul`), `../guvenlik` ([guvenlik.md](../guvenlik.md): `hataSay`,
  `hataSiniriDoldu`, `hizSinir`, `istemciIp`), `../veri` (`depo`, `bildir`, `islem`, `cakisma`), `./islem-kaydi`
  (`islemYaz`), `./okul-disk` ([okul-disk.md](okul-disk.md): `mbOku`, `sinirAdi`).
- Veri tabloları:
  - `depo.kullanicilar` → `kullanicilar`: `eslesmeKoduSahibi`, `yetiskinMi`, `rolleri`, `okulunMuduruVarMi`,
    `eslesmeKoduTuket`, `okuldaBosAd`, `ekle`;
  - `depo.okullar` → `okullar`: `cakisan`, `kisaAdVarMi`, `ekle`, `kisaAdYaz`, `durumYaz`, `diskSiniriYaz`;
  - `bildir` → `bildirimler`; `islemYaz` → `islem_kaydi`.
- Onu çağıran: [yonetici.md](yonetici.md) (`okul-ac`, `kisi-bul`).
- Ön yüz: `public/js/yonetim/09-yonetici.js` (okul açma formu, "Bul" düğmesi).
- Testlerin kurulumu da okulu bu uçla açar: `araclar/giris.js`'teki `mudurYap` (testler onu `testler/giris.js`
  üzerinden alır; `testler/seed.js` de kullanır). `araclar/deneme-okulu.js` aynı işi doğrudan veritabanında yapar.
- Android uygulaması kullanmıyor.

## Nasıl çalışır (adım adım)?

```
kişi:      kayıt → + Ekle > Müdür → kişi kodu (16 hane)
yönetici:  kisi-bul { kod }      → "Ayşe Yılmaz", "ay****@<alan adı>", kullanıcı adı, rol sayısı
           okul-ac { mebSchoolId, kisaAd, mudurKodu, diskMb? }
             okul? adres? sahipsiz mi? disk? kod sahibi?
             ┌ TEK İŞLEM ───────────────────────────────┐
             │ eslesmeKoduTuket (kod eskiyse → dur, 404) │
             │ okullar: yeni okul / sahipsizi yeniden aç │
             │ kullanicilar: müdür rol satırı            │
             └───────────────────────────────────────────┘
             önbellek boşalt → işlem kaydı → kişiye bildirim
kişi:      Portallarım → "Müdür · <okul>"
```

## Dikkat!

- **Kod tahmin aracına dönmesin:** yanlış kodlar IP başına sayılır ("Bul" ve "Aç" birlikte), "Bul" ayrıca
  yönetici başına dakikada 30. Yönetici tam adı görür (kişiyi doğrulaması için) ama e-postanın yalnız maskeli
  hâlini.
- **Kod tek kullanımlık ve yarışa dayanıklı:** kodun harcanması, okulun ve müdür satırının yazılması aynı işlemde.
  Aynı kodla aynı anda beş okul açılmaya çalışılırsa yalnız biri geçer; geçmeyenlerin okulu ve adresi yarım kalıp
  başkasını engellemez (işlem geri alınır).
- **Kimler müdür yapılamaz:** sistem yöneticisi (kendisi dahil), okulun açtığı hesaplar (öğrenci, servisçi) ve rol
  satırları — onlarda kişi kodu yoktur ya da yetişkin hesabı değildirler.
- **Sahipsiz okul:** müdürü kaldırılan okul (`principal-delete`, [yonetici.md](yonetici.md)) `pending` olur;
  yöneticinin aynı okulu yeniden açması eski kaydı (öğretmenler, öğrenciler, veriler) devralır, yeni okul açmaz.
  Kişinin o okulda zaten bir rolü varsa önce o rol çıkarılmalı: bir kişinin bir okulda tek satırı olur.
- **Adres değişince önbellek:** statik sunucu okul adreslerini 30 saniye önbellekte tutar; okul açılınca boşaltılır
  ki yeni adres hemen çalışsın.
- Okul adı MEB listesinden seçildiyse listenin yüklenirken düzeltilmiş adı (`okullar.js`'in kendi `adDuzelt`'i)
  kullanılır; elle yazılan ad olduğu gibi kalır (140 karaktere kırpılır).
- Dosya başındaki yorumdaki disk önerisi ("öğrenci sayısı × 10 MB, en az 2 GB") formun önerisidir; hesabı
  `okul-disk.js` `oneriMb` yapar, bu dosya kullanmaz.

## Testleri

- `testler/test-kisi-kodu.js` — yönetici kişi koduyla kişiyi bulur (tam ad, maskeli e-posta), yalnız yönetici; hız
  sınırı; okul açarken kod yenilenir; yöneticiye ve okul hesabına müdürlük verilemez.
- `testler/test-yonetim.js` — `okul-ac`'ın kapıları: müdür bu ucu hiç göremez (404); bozuk adres `alan: 'kisaAd'`;
  kişi kodu boşsa ya da e-postayla müdür yapılmaya çalışılırsa `alan: 'mudurKodu'`; kimsede olmayan kod 404; kod
  tireli/boşluklu yazılsa da okul açılır ve kod aynı işlemde yenilenir. (`kisi-bul`'u bu test çağırmaz; onu
  `test-kisi-kodu.js` dener.)
- `testler/test-giris-kayit.js` — aynı kodla aynı anda 5 okul açılmaya çalışılınca yalnız biri geçer; geçmeyen
  açılışın okulu ve adresi başkasını engellemez.
- `testler/test-etut.js` — müdürü kaldırılan okulun yeni müdürle, eski adresiyle yeniden açılması.
- `testler/test-okul-disk.js` — okul açarken `diskMb` (verilmezse varsayılan, bozuk değer `400 alan: diskMb`).
- `testler/test-cakisma.js`, `testler/test-site-ayarlari.js`, `testler/girdi-denetimi.js` — adres ve kullanıcı adı
  çakışmaları, bozuk girdi.
- Elle: kayıt olan bir kişinin kişi kodunu al (+ Ekle > Müdür), yöneticiyle `/admin` panelinde "Okul aç".

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): `diskMb` alanı (boşsa varsayılan; sahipsiz okulda
  verilmezse eskisi kalır), cevapta ve işlem kaydında disk sınırı.
- `276c0a0 commit 521` (çakışmalar): tekil indeks yarışları alanına göre ayrı iletiyle (`kisaAd`, `kod`,
  `kullaniciAdi`) karşılanır; okul açılınca okul önbelleği boşaltılır.
- `0acca75 commit 516` (kişi kodu, portallar): müdür başvurusu yerine kişi koduyla okul açma.
- Açık iş yok. Sıradaki "Paneller" işi (birden çok müdür, `/duzenle` okul sayfalarında disk ve yedek sınırı) bu
  dosyanın "okulun tek müdürü" varsayımına dokunacak.
