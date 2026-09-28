# sunucu/guvenlik.js

Giriş güvenliği: iki adımlı giriş kodları, şifre sıfırlama ve e-posta onay bağlantıları, istemci IP'si, hız sınırları,
kaba kuvvet kilidi ve okul ağına göre ayarlı giriş sınırları, bot sorusu ve oturumdan kişiyi bulma.

## Bu dosya ne yapar?

Bir okul portalında aynı anda iki şeyi sağlamak gerekir: 300 öğrenci aynı ağdan (tek IP) aynı dakikada rahatça girsin,
ama şifre tarayan biri, bir öğretmeni dışarıda bırakmak isteyen biri ya da sunucuyu istek yağmuruna tutan biri dursun.
Bu dosya bu dengeyi kurar. Sayaçların hepsi BELLEKTEDİR (sunucu yeniden başlayınca sıfırlanır); oturumlar ve e-posta
onayları ise veritabanında.

Ayrıca kimlik doğrulamanın "posta" tarafı burada: iki adımlı giriş kodu, şifre sıfırlama bağlantısı ve kayıt/e-posta
değişikliğinde onay bağlantısı. E-posta ayarlı değilse (ya da adres `.test` gibi teslim edilmeyen bir alandaysa) kod ve
bağlantılar sunucu penceresine/günlüğüne yazılır; testler kodu oradan okur.

## İçinde neler var?

İki adımlı giriş:

- `girisKoduGonder(kullanici)` → `{ kimlik, yontem: 'eposta'|'konsol', hata? }` — 6 haneli kod (`crypto.randomInt`),
  36 hanelik kimlik; kod belleğe yalnız SHA-256 özetiyle yazılır (`girisKodlari`), 5 dk geçerli (`KOD_OMRU_MS`).
  E-posta gidemezse kişi dışarıda kalmasın diye kod pencereye yazılır (`kodKonsolaYaz`).
- `girisKoduDogrula(kimlik, kod)` → `{ kullanici, uygulama }` ya da `{ hata }` — kayıt yok/süresi dolmuş; en çok 5
  deneme (`KOD_EN_FAZLA_DENEME`), sonra kayıt silinir; biçim 6 rakam; karşılaştırma `timingSafeEqual`; başarıda kayıt
  silinir (tek kullanım). `uygulama` bayrağını çağıran (`kayit.js`) kayda iliştirir: telefon uygulamasından açılan
  oturum 30 gün geçerli.
- `kodOzeti`, `epostaMaskele('ayse@x.com')` → `a**e@x.com`, `girisKodlari`, sabitler.

Şifre sıfırlama ve e-posta onayı:

- `sifirlamaGonder(kullanici)` — kişinin eski bağlantılarını düşürür (tek bağlantı geçerli), 32 baytlık anahtar, 1 saat
  (`SIFIRLAMA_OMRU_MS`), bağlantı `<site adresi>/#/yeni-sifre?t=<anahtar>`; anahtar yalnız bellekte (sunucu yeniden
  başlarsa bekleyen bağlantılar geçersiz — bilerek). `sifirlamaKayit`, `sifirlamaTemizle`, `sifirlamaBaglantisi`,
  `sifirlamaKonsolaYaz`.
- `onayBaglantisiGonder(adres, ad, tur)` → `{ anahtar, yontem }` — `tur`: `'kayit'` (hesap açma) ya da `'eposta'`
  (adres değiştirme); 24 saat (`ONAY_OMRU_MS`), `<site>/login#/eposta-onay?t=<anahtar>`. Anahtarın ÖZETİNİ
  veritabanına çağıran yazar (şema `016`); tıklanmadan hesap açılmaz, adres değişmez.
- `epostaAlaniVarMi(adres)` — alan adının MX (yoksa A) kaydı var mı (3 sn zaman aşımı); e-posta ayarlı değilse, `.test`
  gibi alanlarda ya da DNS'e ulaşılamazsa engellemez (`true`).

İstemci adresi ve genel sınır:

- `istemciIp(req)` — soket adresi; vekile güveniliyorsa (`ayarlar.vekil.guven`) vekil başlığının (varsayılan
  `cf-connecting-ip`) SON girdisi, IP'ye benziyorsa (`ipGibiMi`); `::ffff:` öneki atılır.
- `genelIstekSiniri(ip, dosyaMi, oturum)` → `''` ya da `'dosya'|'ip'|'oturum'` — `index.js` her istekte çağırır.
  `GENEL_SINIR`: dakikada IP başına 15000 dosya / 6000 API, oturum başına 300 API. Önce IP; IP doluyken oturum sayacı hiç
  açılmaz; oturum sınırına takılan istek IP sayacından geri düşülür (`genelGeriAl`). Sayaçlar `genelKayit`'te, en çok
  `EN_FAZLA_GENEL_SAYAC` (100000) anahtar; doluysa önce süresi geçenler süpürülür, yine yer yoksa yeni anahtar sayılmaz
  (istek geçer — bellek şişmez). `genelKayit` ve `EN_FAZLA_GENEL_SAYAC` dışa, `test-okul-agi.js` haritayı doldurup
  büyümediğini denetlesin diye açılır.
- `hizSinir(anahtar, adet, pencereMs)` → `boolean` — genel amaçlı pencere sayacı (`hizKayit`, en çok 200000); birçok
  bölüm kullanır (okul araması, kişi kodu, telefon bildirimi…).
- `hataSiniriDoldu(anahtar, adet)` / `hataSay(...)` — yalnız başarısız denemeleri sayan sınır (artırmadan bakma ayrı).

Giriş kilidi ve okul ağı sınırları (`GIRIS_SINIR`, 15 dk pencere):

- **hesap + IP:** 5 hatada o hesap o bağlantıdan 15 dk kilitli (`KILIT_ESIGI`, `kilitKayit`: `basarisizDeneme`,
  `kilitliMi`, `kalanDeneme`, `denemeSifirla`); ilk hatadan sonra o hesaba soru sorulur (`soruGerekliMi`).
- **hesap, her IP'den:** 3 hatada her yerden soru; 20 hatada hesap TANIDIK OLMAYAN bağlantılardan 15 dk kilitli.
- **IP:** 50 hatadan sonra o bağlantıdan her girişte soru; bağlantının durduğu hata sayısı
  `50 + 2 × (oradan son 30 günde girmiş okul hesabı)`, en çok 300 (`ipHataSiniri`); ayrıca 5 dakikada en çok 1200 deneme
  (`girisIpEngeli`).
- `girisTanidik(ip, hesapId, okulHesabi)` — doğru şifreyle girişte bağlantıyı "tanıdık" yazar (`tanidik`); hesap okulun
  açtığı bir hesapsa (öğrenci, servisçi) `ipHesaplari`'na da (bağlantının sınırını büyütür). `tanidikMi`.
- `girisKilitSn(kilitAnahtar, hesapId, ip)` — kalan kilit saniyesi; `girisSoruLazim(...)` — soru gerekli mi;
  `girisHatasi(...)` — üç sayacı birden artırır; `girisBasarili(kilitAnahtar, hesapId)` — hesabın sayaçlarını siler
  (bağlantınınki kalır); `kilitAnahtar` boşsa (şifre yenilendi) yalnız hesabın toplam hatası.
- `kayitSayaci(ip, artir)` — IP başına açılan hesap sayısını döndürür; pencere `KAYIT_PENCERE_MS` (1 saat), sayaç
  `hizKayit`'te `kayitOk:<ip>` anahtarıyla. Yalnız `artir` doğruyken artar, formu yanlış dolduran bu sınıra takılmaz.
  `kayit.js` kayıt başvurusu geçip onay bağlantısı gönderildiği anda artırır (kod yorumu "hesap açılınca" der, ama
  sayılan an bağlantının gönderilmesidir); kayıt isteğinde sayaç 60'a vardıysa (artırmadan bakar) "saatte en çok 60
  hesap" diye 429 döner.

Bot sorusu:

- `botSoruUret()` → `{ id, soru: 'a + b = ?' }` — `a` 3–9, `b` 2–9 arası rastgele; `id` 24 hex. Cevap istemciye gitmez,
  `botSorular` haritasında (`id` → `{ cevap, bitis }`) `BOT_OMRU_MS` (5 dk) tutulur; en çok `EN_FAZLA_BOT_SORU` (5000)
  soru (doluysa önce süresi geçenler, yetmezse en eskiler silinir — hepsi birden silinseydi çok soru isteyen biri
  herkesin sorusunu geçersiz kılardı). `botCevapDogru(id, cevap, tuket)` — doğru cevap tek kullanımlık;
  `tuket === false` ise soru harcanmaz (formda başka alan hatalıysa kullanıcı soruyu yeniden çözmesin);
  `botSoruTuket(id)`.

Oturum:

- `istekAnahtari(req)` — `Authorization: Bearer <48 hex>`; biçimsizse `''` (veritabanına gidilmez).
- `currentUser(req)` → kullanıcı ya da `null` — `depo.oturumlar.kullaniciKimligi(anahtar)` → `depo.kullanicilar.bul`.
- `OTURUM_OMRU_MS` (7 gün), `EN_FAZLA_OTURUM` (20000).
- `guvenlikTemizle()` — `index.js` 10 dakikada bir: süresi geçen sayaçlar, kilitler, bot soruları, giriş kodları, 30
  günü geçen tanıdık kayıtları; veritabanında süresi dolan (ve 20000'i aşan en eski) oturumlar, tıklanmayan onay
  bağlantıları.

## Kimle konuşur?

- Çağırdıkları: `crypto`, `dns`, `./yardimci/eposta` (SMTP), `./ayarlar` (`ayarlar.eposta`, `site.adres`, `vekil`,
  `epostaKurulu`), `./veri` → `depo.kullanicilar.bul`, `depo.oturumlar.kullaniciKimligi`, `depo.oturumlar.temizle`,
  `depo.onaylar.suresiGecenleriSil`.
- Onu çağıranlar (grep):
  - `sunucu/index.js` — `genelIstekSiniri`, `istekAnahtari`, `istemciIp`, `guvenlikTemizle`;
  - `sunucu/api.js` — `currentUser`;
  - `sunucu/bolumler/kayit.js` — giriş, kod, sıfırlama, onay, kilitler, bot sorusu, kayıt sayacı (hemen hepsi);
  - `bolumler/kisilik.js` — onay bağlantısı, alan denetimi, maskeleme;
  - `hataSiniriDoldu`/`hataSay`/`hizSinir`: `hesaplar.js`, `nakil.js`, `veli.js`, `yonetici-okul.js` ve birçok bölüm;
  - `sunucu/push.js` — `hizSinir` (kişi başına dakikada 20 bildirim);
  - testler: `test-okul-agi.js`, `test-vekil-ip.js` (doğrudan), `araclar/giris.js` ve `testler/giris.js` (kodu günlükten
    okur).
- Tablolar: oturumlar, e-posta onayları (temizlik); kullanıcılar (okuma).

## Nasıl çalışır (adım adım)?

Giriş (asıl akış `bolumler/kayit.js`'te; buradaki parçalar):

```
POST /api/login
  girisIpEngeli(ip)? → 429
  girisKilitSn(hesap+ip, hesapId, ip) > 0 → "N dk sonra dene"
  girisSoruLazim → bot sorusu yoksa/yanlışsa → soru iste
  şifre yanlış → girisHatasi (3 sayaç) → kalanDeneme
  şifre doğru → girisBasarili, girisTanidik(ip, id, yetişkin hesabı değil mi)
     öğrenci ya da e-postasız hesap → oturum hemen açılır
     başka herkes (iki adımlı giriş zorunlu) → girisKoduGonder → { twoFactor, challengeId }
POST /api/login/dogrula → girisKoduDogrula(kimlik, kod) → oturum aç
```

Her istekte: `index.js` → `istemciIp` → `genelIstekSiniri` → (API ise) `api.js` → `currentUser`.

## Dikkat!

- **Vekil başlığı:** yalnız ayarda açıkça güveniliyorsa okunur, yoksa herkes başlığı uydurup sınırı aşardı.
  `X-Forwarded-For`'un baştaki girdilerini istemci kendisi yazabilir; bu yüzden vekilin eklediği SON girdi alınır.
- **Tanıdık bağlantı kuralı:** kullanıcı adını bilen biri başka bağlantılardan 20 yanlış deneyerek bir öğretmeni okulda ya
  da evinde dışarıda bırakamaz — hesabın son 30 günde doğru şifreyle girdiği bağlantı bu kilide takılmaz. Kilidi yeni
  şifre kaldırır ("Şifremi unuttum" ya da okulun verdiği yeni şifre).
- **Bağlantı sınırını yalnız okul hesapları büyütür:** herkesin kendi açabildiği yetişkin hesabı sayılsaydı biri kendi
  açtığı hesaplarla girip bağlantısının sınırını 300'e çıkarır, şifre taramasını 6 kat hızlandırırdı.
- Bot sorusu insanı yormadan basit araçları eler ama bir betik onu kolayca çözer: şifre taramasını soru değil sayılar
  durdurur.
- Bütün haritaların üst sınırı var (uydurma Bearer değerleri, çok sayıda adres belleği şişiremez); süresi geçenler
  gerektiğinde en çok saniyede bir süpürülür.
- Giriş kodu ve sıfırlama anahtarı diske YAZILMAZ; giriş kodu bellekte de yalnız özet. Onay anahtarının da yalnız özeti
  veritabanındadır.
- `.test`, `.example`, `.invalid`, `.localhost` adreslerine posta gönderilmez (okulun e-posta hesabına geri dönen hata
  postaları dolmasın); kod pencereye yazılır.
- Dosyada "JSON gövdesindeki tehlikeli anahtarları temizler" diye sahipsiz bir yorum kaldı; o iş `ortak.govdeTemizle`'de.
- Sayaçlar tek süreçte ve bellekte: birden çok süreçle çalıştırılırsa sınırlar süreç başına olur.

## Testleri

- `testler/test-okul-agi.js` — 300 kişi tek IP; tek oturumdan sel, tek hesaba şifre denemesi, bir hesaba birçok
  bağlantıdan deneme (tanıdık bağlantı, yeni şifre kilidi kaldırır), çok hesaba şifre taraması (50 / 70), kendi açtığı
  yetişkin hesaplarının sınırı büyütmemesi, oturumsuz sel; sınırların kendisi sunucusuz da.
- `testler/test-vekil-ip.js` — vekil başlığı, zincirin son girdisi, IP'ye benzemeyen değer.
- `testler/guvenlik-test.js` — bot sorusu (cevap istemciye sızmıyor, tek kullanımlık), hatalı denemelerden sonra kilit
  (kilitliyken doğru şifre de geçmiyor), hatadan sonra soru istenmesi, öğrenciye kod gitmemesi, şifre doğruyken kodsuz
  anahtar verilmemesi, kodun cevapta sızmaması, e-posta maskeleme, yanlış/tekrar kullanılan kod, sahte oturum
  anahtarı, veli kodu deneme sınırı, prototip kirlenmesi; ayrıca güvenlik başlıkları.
- `testler/test-sifre.js` — şifremi unuttum (anahtar günlükten okunur).
- `testler/test-giris-kayit.js`, `test-yetiskin.js` — kayıt, bot sorusu, e-posta onayı, iki adımlı giriş.
- `testler/test-admin-gizli.js` — yöneticinin iki adımlı girişi (kod günlükten, `araclar/giris.js sonKod`).
- Elle: test sunucusunda yanlış şifreyle 5 kez dene → "15 dakika" kilidi; e-posta ayarsızken girişte kod pencereye yazılır.

## Son durum

- Son commit `566b917 commit 524` (2026-09-27, canlı hazırlık / 300 kişilik okul ağı): genel sınır ayrı haritaya
  (`genelKayit`, `genelSinir`, `genelGeriAl`, `genelIstekSiniri`) taşındı ve üst sınırlar kondu; okul ağı giriş
  sınırları (`GIRIS_SINIR`, tanıdık bağlantılar, `ipHataSiniri`, `girisIpEngeli`, `girisKilitSn`, `girisSoruLazim`,
  `girisHatasi`, `girisBasarili`) eklendi.
- `24050a2 commit 518`: `girisKoduDogrula` cevabına `uygulama` bayrağı (telefon uygulamasının 30 günlük oturumu).
  `86af98a commit 506`: vekil zincirinin SON girdisinin alınması.
- Sıradaki işler: "Güvenlik denetimi" (IPv6 için /64 anahtarı — bugün her IPv6 adresi ayrı sayılıyor) ve "Sistem"
  (yöneticiye zorunlu TOTP, yeni cihaz uyarısı + açık oturumlar) bu dosyayı değiştirecek.
