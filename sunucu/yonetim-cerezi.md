# sunucu/yonetim-cerezi.js

Gizli yönetim panelinin (`/admin`) çerezi: yöneticiye verir, siler, bir isteğin çerezinin geçerli olup olmadığına bakar.

## Bu dosya ne yapar?

Sistem yöneticisinin ekranları herkese giden uygulamada değil, ayrı bir pakette (`/admin/yonetim.js`) durur ve yalnız
`/admin` adresinden açılır. Ama sayfa istekleri (`GET /admin`) tarayıcının kendisinden gelir, `Authorization` başlığı
taşımaz; sunucunun "bu kişi yönetici mi" diye bakabilmesi için bir çerez gerekir. Bu dosya o çerezi yönetir.

Çerezin tek işi `/admin` sayfasını ve paketini açmak. API yine yalnız `Authorization` başlığıyla çalışır; çerezle gelen
bir `/api` isteği hiçbir şey yapamaz, yani çerez yüzünden CSRF yüzeyi açılmaz. Çerezi olmayan herkes `/admin`'de
bilinmeyen bir adresle bayt bayt aynı 404'ü görür (`http.js`).

## İçinde neler var?

- `CEREZ_ADI = 'ee_yonetim'`, `YONETIM_ADRESI = '/admin'`; iç `CEREZ_DESENI` = 64 küçük onaltılık hane.
- `yoneticiMi(u)` — onaylı (`approved`) `admin` rolünde ve `sifreDegismeli` olmayan hesap mı. Şifresini başkası vermiş
  (admins.json'dan açılan) yönetici çerezi ancak şifresini değiştirince alır.
- `cerezDegeri(req)` — `Cookie` başlığından `ee_yonetim` değerini çıkarır; biçime (`^[a-f0-9]{64}$`) uymuyorsa `''`.
  Veritabanına gitmez.
- `httpsMi(req)` — site https mi: `ayarlar.site.adres` `https://` ile başlıyorsa, soket şifreliyse ya da vekile
  güveniliyorken `X-Forwarded-Proto` `https` ise. `true` ise çereze `Secure` eklenir.
- `cerezVer(res, anahtar, u)` → `Promise<boolean>` — `yoneticiMi(u)` ve oturum anahtarı varsa 32 rastgele bayt üretir,
  `depo.oturumlar.yonetimCereziEkle(anahtar, deger)` ile oturuma bağlar, oturum telefon uygulamasındansa
  `UYGULAMA_OMRU_GUN`, değilse `OTURUM_OMRU_GUN` süresiyle `Set-Cookie` yazar:
  `ee_yonetim=<değer>; Path=/admin; Max-Age=<sn>; HttpOnly; SameSite=Strict[; Secure]`. Cevabın kendisini yazmaz
  (sonra `ok`/`sendJSON` yazar).
- `cerezSil(res)` — aynı başlıkla boş değer ve `Max-Age=0`.
- `gecerliMi(req)` → `Promise<boolean>` — çerez yoksa ya da biçimsizse veritabanına GİTMEDEN `false`; biçimliyse
  `depo.oturumlar.yonetimCereziSahibi(deger)`.
- İç `baslik(req, deger, saniye)` — `Set-Cookie` metnini kurar.

## Kimle konuşur?

- Çağırdıkları: `crypto`, `./ayarlar` (site adresi, vekil), `./veri` → `depo.oturumlar` (`yonetimCereziEkle`,
  `oturumBilgisi`, `yonetimCereziSahibi`, `UYGULAMA_OMRU_GUN`, `OTURUM_OMRU_GUN`).
- Onu çağıranlar (grep):
  - `sunucu/bolumler/kayit.js` — `yonetimAlanlari()`: giriş, kod doğrulama, `/api/me`, şifre değiştirme cevaplarında
    yöneticiye çerez verir ve cevaba `yonetimAdresi: '/admin'` ekler; yöneticinin çıkışında `cerezSil`;
  - `sunucu/http.js` — `yonetimSun` ve `bulunamadiCerezli` (`cerezDegeri`, `gecerliMi`).
- Tablo: `yonetim_cerezleri` (şema `030`; SHA-256 özeti ve oturumun özeti durur, düz değer saklanmaz). Oturum başına
  en yeni birkaç çerez tutulur, eskiler depo tarafından silinir (`YONETIM_CEREZ_SAKLA`).

## Nasıl çalışır (adım adım)?

```
yönetici girişi (iki adım biter) ─> kayit.js yonetimAlanlari
      yoneticiMi? ─ hayır ─> {} (çerez yok, yonetimAdresi yok)
      evet ─> cerezVer: 32 bayt → yonetim_cerezleri'ne (oturuma bağlı) → Set-Cookie
            cevap: { ..., yonetimAdresi: '/admin' } → ön yüz tam sayfa /admin'e geçer

GET /admin ─> http.js yonetimSun
      cerezDegeri '' ─> 404 (veritabanına gitmez)
      gecerliMi ─ false ─> 404 ;  true ─> yönetim kabuğu / paketi
```

Çerez geçersiz olur: çıkışta, oturumun süresi dolunca, şifre değişince (oturumlar silinince bağlı çerezler de gider).
`/api/me` her çağrıda yöneticiye yeni çerez verir; oturumun en yeni üç çerezi geçerli kalır ki iki sekme birbirini
düşürmesin.

## Dikkat!

- Çerez YALNIZ yönetici hesabına verilir, silme başlığı da yalnız yöneticinin çıkışında gönderilir: yönetici olmayan
  hiçbir cevapta `/admin` adresi ya da `ee_yonetim` geçmez (panelin varlığı sızmasın).
- `Path=/admin` sayesinde tarayıcı çerezi `/api`'ye göndermez; `HttpOnly` sayfadaki betiğin okumasını, `SameSite=Strict`
  başka siteden gelen gezinmede gönderilmesini engeller.
- Biçimsiz çerezle veritabanına gidilmez; biçimli (uydurma olabilir) çerezle hem `/admin` hem bilinmeyen adres
  veritabanında bir kez arar — yanıt süresi farkı kalmasın (`http.js` `bulunamadiCerezli`).
- İlk açılışta kurulan varsayılan yöneticiye şifre değiştirme zorlanmaz; o çerezi doğrudan girişte alır.
- `X-Forwarded-Proto`'ya yalnız vekile güveniliyorsa bakılır; yoksa herkes başlığı uydurabilirdi.

## Testleri

- `testler/test-admin-gizli.js` — hepsi: çerezsiz/uydurma/biçimsiz çerezle aynı 404, veritabanı ve disk yoklama
  sayıları, girişte `HttpOnly; SameSite=Strict; Path=/admin` çerez, http sitede `Secure` yok, öğretmen/öğrenci/müdüre
  çerez yok, `/api/me` yenilemesi (en yeni 3 çerez geçerli), çıkış/şifre değişimi/oturum süresi dolunca geçersizlik.
- `testler/test-yonetici-dosyasi.js` — şifresini değiştirmemiş (dosyadan açılmış) yönetici çerez almaz, değiştirince
  alır.
- Elle: test sunucusunda yönetici olarak gir, tarayıcının geliştirici araçlarında `ee_yonetim` çerezinin `/admin`
  yoluyla yazıldığını gör; çerezi silince `/admin` "Sayfa bulunamadı" olmalı.

## Son durum

- Tek commit: `276c0a0 commit 521` (2026-09-27) — gizli `/admin` işiyle dosya ilk kez yazıldı.
- Açık iş yok. Sıradaki "Sistem" işi yöneticiye zorunlu TOTP ekleyecek; "Paneller" işi `/panel/admin` ve
  `/panel/destek`'i getirecek — ikisi de bu çerezin verilme koşuluna (ve belki adresine) dokunacak.
