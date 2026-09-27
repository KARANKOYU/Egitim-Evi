# sunucu/site.js

Herkese açık site bilgisi (`/api/site`: rakamlar, iletişim, yapımcılar, aralıklar), indirme sayfasının sürüm listesi
(`/api/uygulama`) ve site ayarlarının okunması (veritabanı > `data/config.yml` > varsayılan).

## Bu dosya ne yapar?

Açılış ve "Hakkında" sayfasında "şu kadar okul, şu kadar kişi, şu an şu kadar kişi açık" rakamları, sayfanın altında
yöneticiye ulaşma bilgileri (e-posta, telefon), "Yapımcılar" listesi ve indirme sayfasındaki Play Store düğmesi
görünür. Bunlar girişsiz, herkese açık bilgilerdir ve bu dosyadan gelir.

İkinci ve daha önemli işi **site ayarlarının tek okuma noktası** olmak. Sistem yöneticisi yönetim panelindeki "Site
ayarları"ndan değer kaydeder (yazan taraf `bolumler/site-ayarlari.js`); kaydedilmemişse sunucudaki `data/config.yml`,
o da yoksa kodun varsayılanı kullanılır. Sunucunun başka her yeri ayarı `site.ayar('anahtar')` ile okur.

Kişisel iletişim bilgileri depoya yazılmaz (depo herkese açık): sunucuyu kuran kişi `config.yml`'e ya da panelden
veritabanına yazar.

## İçinde neler var?

Uçlar (`uclar(k)`, `api.js` `BOLUM`'da `site` ve `uygulama`):

- `GET /api/site` — herkes (girişsiz de; aydınlatma onayı beklenirken de serbest):
  `{ sayilar: { okul, kisi, cevrimici }, iletisim: { eposta, telefon }, yapimcilar: [{ ad, github, katki }],
  bildirimAralikDk, cevrimiciDk }`. `okul`/`kisi` bir dakika önbellekli (`depo.genel.siteSayilari`); `cevrimici`
  kayıtlı kişi sayısından büyük gösterilmez.
- `GET /api/uygulama` — herkes: `{ playStore, sayfa, alindi, surumler }` (`uygulama-surum.js`).
- Başka yol/yöntemde `false` döner (yol bulunamadı → `api.js` 404).

Ayarlar:

- `ayar(anahtar)` → değer; `ayarKaynakli(anahtar)` → `{ deger, kaynak, guncelleyen, zaman }`; `kaynak`:
  `'veritabani'`, `'config'`, `'dosya'` (yapımcılar için depodaki `yapimcilar.json`), `'ortam'`, `'varsayilan'`.
- `AYAR_ANAHTARLARI`: `iletisim`, `yapimcilar`, `playStore`, `bildirimAralikDk` (1–30, varsayılan 5; config
  `araliklar.bildirim_dk`), `cevrimiciDk` (1–60, 5; `cevrimici_dk`), `adminsAralikDk` (1–60, 1; `admins_dk`),
  `okulDiskMb` (1 MB–10 TB, varsayılan 5120 MB; config'de yok, panelden kaydedilmediyse `EE_OKUL_DOSYA_GB` ortam
  değişkeni).
- `cevrimiciEtkinDk()` — `max(cevrimiciDk, bildirimAralikDk + 1)`: açık sayfa ancak yoklama aralığıyla istek atar;
  süre daha kısa olsaydı açık kişi iki yoklama arasında "kapalı" görünürdü.
- `istemciAyarlari()` — giriş yapmış uygulamanın bilmesi gerekenler (`{ bildirimAralikDk }`; `/api/me` ve giriş
  cevabına eklenir).
- `iletisimVarMi()` — e-posta ya da telefon var mı (yoksa açılışta uyarı).
- Doğrulayıcılar ve sınırlar (dışa açık, `site-ayarlari.js` yazarken kullanır): `EPOSTA` (yalnız ASCII; boşluk,
  `< > " '` yok), `PLAY_STORE` (`https://play.google.com/...`), `GITHUB_ADI`, `ARALIKLAR`, `OKUL_DISK`,
  `okulDiskTemizle`, `YAPIMCI_EN_COK` (50), `YAPIMCI_AD_EN_COK` (60), `YAPIMCI_KATKI_EN_COK` (80).
- `yamlOku(metin)` — YAML'ın küçük bir alt kümesi (paketsiz): `anahtar: değer` (tırnaklı ya da değil), bir düzey
  girintili bölüm, `#` yorumları. `configGuncel()` — `config.yml`'i en çok 30 sn'de bir yoklar (mtime), değiştiyse
  yeniden okur; bozuk alanlar boş/yok sayılır.

"Şu an açık":

- `goruldu(kisiId)` — `api.js` her kimlikli istekte çağırır (yetişkin hesabı ya da okul hesabı kimliğiyle). Yalnız
  bellekte, kişi → son görülme.
- `acikSayisi()` — son `cevrimiciEtkinDk` dakikada görülen farklı kişi sayısı; eskileri siler. 10 dakikada bir de
  temizlik için çağrılır.

## Kimle konuşur?

- Çağırdıkları: `fs`, `path`, `./yollar` (`DATA`), `./http` (`ok`), `./veri` → `depo.siteAyarlari.oku`,
  `depo.genel.siteSayilari`; `./uygulama-surum`.
- Onu çağıranlar (grep): `sunucu/api.js` (`goruldu`; `site`/`uygulama` uçları), `sunucu/index.js` (`iletisimVarMi`,
  `ayar('adminsAralikDk')`), `sunucu/bolumler/kayit.js` (`istemciAyarlari`), `bolumler/site-ayarlari.js`
  (`ayarKaynakli`, `cevrimiciEtkinDk`, doğrulayıcılar), `bolumler/okul-disk.js` (`ayar('okulDiskMb')`,
  `okulDiskTemizle`), `bolumler/yonetici.js` (`ayar('adminsAralikDk')`), `testler/test-site-ayarlari.js`.
- Dosyalar: `data/config.yml` (örnek `belge/config.ornek.yml`), depodaki `yapimcilar.json`. Tablo: `site_ayarlari`
  (şema `030`; depo `siteAyarlari`, bellekte önbellekli).

## Nasıl çalışır (adım adım)?

```
ayar('bildirimAralikDk')
  depo.siteAyarlari.oku → değer var ve geçerli? → veritabani
  configGuncel().araliklar.bildirimAralikDk var? → config
  ARALIKLAR.bildirimAralikDk.varsayilan (5)       → varsayilan

GET /api/site → siteSayilari (1 dk önbellek) + acikSayisi + ayar(iletisim, yapimcilar, bildirimAralikDk) + cevrimiciEtkinDk
```

## Dikkat!

- Ayar değişince sunucu yeniden başlamadan geçerli olur: yazan taraf veritabanını ve deponun bellek önbelleğini birlikte
  günceller. Bu **tek süreçli sunucu** varsayar; birden çok süreç çalıştırılırsa önbellekler ayrışır.
- `config.yml` web'den yazılamaz; yalnız sunucudaki dosya. Değişiklik en geç 30 sn'de görülür.
- Veritabanındaki değer de okunurken yeniden doğrulanır (bozuk değer yazılmış olsa bile sayfaya bozuk gitmez).
- İletişim e-postası sayfada bağlantıya girdiği için izinli karakter listesi dar tutuldu.
- "Şu an açık"ta kimin açık olduğu değil, yalnız kaç kişi olduğu dışarı verilir.
- JSON cevapları `no-store` (`http.js sendJSON`): ayar değişince sayfa yenilenince hemen görünür.
- `/api/site` cevabında `/admin` ya da "admin" geçmez (`test-admin-gizli.js` denetler) — buraya alan eklerken dikkat.

## Testleri

- `testler/test-site-ayarlari.js` — öncelik (veritabanı > config.yml > varsayılan; geçici config.yml ile), iletişim,
  yapımcılar, Play Store, aralıklar: kaydetme, doğrulama, hata alanları, sıfırlama; değişikliğin yeniden başlatmadan
  `/api/site`, `/api/me`, `/api/uygulama`'da görünmesi; çevrimiçi süresinin yoklama + 1 dk'dan kısa olamaması.
- `testler/test-okul-disk.js` — `okulDiskMb` ve `EE_OKUL_DOSYA_GB`.
- `testler/test-admin-gizli.js` — `/api/site` `/admin`'i ele vermiyor.
- `testler/test-uygulama-surum.js` — `/api/uygulama`'nın süzdüğü liste (sunucusuz).
- Elle: `curl http://localhost:3200/api/site`.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): `okulDiskMb` ayarı, `OKUL_DISK` sınırları,
  `okulDiskTemizle`, `EE_OKUL_DOSYA_GB` ortam değişkeni (`ortamOkulDiskMb`) ve `'ortam'` kaynağı eklendi.
- `276c0a0 commit 521`: veritabanı > config.yml > varsayılan düzeni, `ayarKaynakli`, aralık ayarları, `adminsAralikDk`;
  `b6bfc03 commit 517` yalnız yorumdaki indirme sayfası adresini
  (`/indir/indir.html`) düzeltti; `0acca75 commit 516` `iletisimVarMi()`'yi ekledi (açılıştaki "iletişim bilgisi yok"
  uyarısı için).
- Açık iş yok. "Sistem" işindeki site duyurusu ve bakım modu büyük olasılıkla buraya yeni ayar anahtarları ekleyecek.
