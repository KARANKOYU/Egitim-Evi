# sunucu/veri/depo/push.js

Tarayıcı telefon bildirimi (Web Push) aboneliklerinin (`push_abonelikleri`) SQL'i: abonelik yazma/taşıma, kişi başına
sınır, iptal, geçersiz aboneliği silme, başarı zamanı, bildirim alıcılarının abonelikleri ve "bu abonelik benim mi?".

## Bu dosya ne yapar?

Kişi sitede "Telefon bildirimlerini aç" deyince tarayıcı bir abonelik verir: push servisinin adresi (`endpoint`;
Google, Mozilla, Apple…) ve uçtan uca şifreleme anahtarları (`p256dh`, `auth`). Kişiye bildirim düşünce sunucu içeriği bu
anahtarlarla şifreleyip o adrese gönderir; push servisi içeriği okuyamaz (şema 011). Bu dosya abonelikleri tutar.

Abonelik KİŞİYE, yani yetişkinin ana hesabına aittir: okul rolündeyken (öğretmen@okul) açılan abonelik bağlı olduğu
yetişkin hesabına yazılır; bildirim bir okul rolüne düşerse o hesabın cihazlarına gider. Adresin geçerliliği,
şifreleme ve gönderim kuyruğu [../../push.md](../../push.md)'de, uçlar [../../bolumler/push.md](../../bolumler/push.md)'dedir.
Yerel Android uygulamasının bildirim yoklaması ayrı bir düzendir ([cihazlar.md](cihazlar.md)).

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md) kullanmaz; satırlar ham döner.

- `aboneYaz(id, kullaniciId, endpoint, p256dh, auth)` — `INSERT INTO push_abonelikleri … ON CONFLICT (endpoint) DO UPDATE
  SET kullanici_id = EXCLUDED.kullanici_id, olusturma = now() WHERE push_abonelikleri.p256dh = EXCLUDED.p256dh AND
  push_abonelikleri.auth = EXCLUDED.auth RETURNING id`. Adres yeniyse yazar; zaten kayıtlıysa YALNIZ aynı anahtarlarla
  gelmişse (aynı tarayıcı aboneliği, ortak cihazda başka hesaba geçilmiş) kaydı yeni hesaba taşır. Yazdıysa ya da
  taşıdıysa `true`, anahtarlar farklıysa `false` (bölüm 409 verir): adresi bir yerden öğrenip kendi anahtarıyla gönderen
  biri başkasının bildirimlerini devralamaz. Şema: adres 10–1000 karakter, `p256dh` 80–100, `auth` 16–30 base64url
  karakter (aykırıysa `23514`).
- `fazlasiniSil(kullaniciId, n)` — kişinin en yeni `n` aboneliği dışındakileri siler (`ORDER BY olusturma DESC LIMIT
  $2`; bölüm 5 verir).
- `aboneSil(endpoint, kullaniciId)` — yalnız bu kişinin bu adresteki aboneliğini siler (başkasınınkine dokunmaz).
- `gecersizSil(id)` — push servisi 404/410 dediğinde (abonelik artık yok) kaydı siler.
- `basariYaz(id)` — başarılı gönderimde `son_basari = now()`.
- `abonelikler(kullaniciIdler)` — bildirim alıcılarının abonelikleri: `kullanicilar k JOIN push_abonelikleri a ON
  a.kullanici_id = coalesce(k.ana_hesap_id, k.id) LEFT JOIN okullar o`, yalnız onaylı alıcılar (`k.durum =
  'approved'`). Her satır `{ id, alici (bildirimin yazıldığı kullanıcı), endpoint, p256dh, auth, kisa_ad }` (okulun kısa
  adı, bildirime dokununca açılacak adres için).
- `kisiAbonesiMi(kullaniciId, endpoint)` — bu adresteki abonelik bu kişinin mi (`true`/`false`); ortak cihazda başka
  hesaba ait kalmış aboneliği tarayıcı kapatsın diye.

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `push_abonelikleri` (`kullanici_id` `ON DELETE CASCADE`, `endpoint` `UNIQUE`, `p256dh`/`auth` kalıp CHECK'leri, `olusturma`, `son_basari`; `push_abonelikleri_kisi` indeksi) | `011-push.sql` |
| `kullanicilar.ana_hesap_id` (okul rolü satırı → yetişkin hesabı) | `012-yetiskin-hesap.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.push`):
  - [../../bolumler/push.md](../../bolumler/push.md) — `POST /api/push/abone` (`aboneYaz(uid(), sahip, …)` +
    `fazlasiniSil(sahip, 5)`), `/api/push/durum` (`kisiAbonesiMi`), `/api/push/iptal` (`aboneSil`). `sahip = me.anaHesapId
    || me.id`.
  - [../../push.md](../../push.md) — bildirim olayında `abonelikler(kisiler)`, gönderim sonucunda `gecersizSil` (404/410)
    ya da `basariYaz` (2xx).
- Tablolar: yazar `push_abonelikleri`; okur `kullanicilar`, `okullar`.

## Nasıl çalışır (adım adım)?

```
abone ol:  POST /api/push/abone { endpoint, keys } → bölüm: adres bilinen push servisi mi? anahtarlar geçerli mi?
           aboneYaz(yeniId, sahip, …)
             yeni adres            → INSERT                                  → true
             aynı adres + aynı anahtar (ortak cihaz, başka hesap) → taşı      → true
             aynı adres + başka anahtar                                        → false → 409
           fazlasiniSil(sahip, 5)

bildirim:  depo.genel 'bildirim' olayı → push.js bildirimGeldi(liste)
           abonelikler(alıcılar) → alıcı başına dakikada en çok 20 → kuyruk → şifrele + gönder
           cevap 404/410 → gecersizSil(id) ; 2xx → basariYaz(id)
```

## Dikkat!

- **Abonelik ana hesaba yazılır:** `aboneYaz`'a verilen kişi bölümdeki `sahip`tir; `abonelikler` de alıcının
  `ana_hesap_id`'sine bakarak eşler. Yeni bir çağıran okul rolü satırının kimliğini doğrudan yazarsa o abonelik
  yetişkinin öbür rollerine gelen bildirimleri almaz.
- **Taşıma kuralı güvenlik içindir:** adres (endpoint) bir sır değildir; anahtarlar ise tarayıcıdadır. Anahtarlar
  tutmadan taşıma yapılmaması, adresi öğrenen birinin başkasının bildirimlerini kendine çekmesini önler (commit 506'da
  eklendi; öncesinde anahtarlar da üzerine yazılıyordu).
- **Onaysız alıcıya gitmez:** `abonelikler` yalnız `durum = 'approved'` alıcıları döndürür.
- **5 sınırı işlem dışında:** `aboneYaz` ve `fazlasiniSil` ayrı sorgulardır; aynı anda iki abonelikte kısa bir an 6 kayıt
  olabilir.
- **Kişisel veri:** adres ve anahtarlar cihaza özeldir; bu tablo yalnız gönderim için kullanılır, hiçbir uçtan geri
  dönmez. Hesap silinince CASCADE ile gider.
- **Güvenlik:** bütün değerler parametreyle; adres URL'de değil gövdede gelir (günlüklere düşmesin), geçerliliği
  [../../push.md](../../push.md)'deki `adresGecerli` (yalnız bilinen push servisleri, iç ağ ve başka port yok) denetler.

## Testleri

- `testler/test-servis-konum.js` — geçerli abonelik, iç ağ/http/sahte alan/uzun adres/bozuk anahtar reddi, "benim"
  denetimi, aynı cihazın başka hesaba geçmesi, başka anahtarla aynı adresin devralınamaması, başkasının aboneliğini
  iptal edememe, kendi aboneliğini iptal, kişi başına 5 cihaz, okula bağlı olmayan veli adayının ve servisçinin abone
  olabilmesi.
- `testler/test-yetiskin.js` — yetişkin hesabı ile okul rolleri arasında aboneliğin sahibi; `testler/test-push.js` —
  şifreleme ve VAPID (bu dosyayı değil [../../push.md](../../push.md)'yi sınar); `testler/yetki-denetimi.js`.
- Testlerde dışarıya gönderim kapalıdır (`EE_PUSH_GONDERME=0`); `gecersizSil`/`basariYaz` yalnız gerçek gönderimde
  çalışır. Elle: gerçek bir tarayıcıda bildirimleri aç, kendine bir mesaj gönder → telefona gelmeli, `son_basari`
  dolmalı.

## Son durum

- Son değişiklik `86af98a commit 506` (2026-09-26): `aboneYaz` artık yalnız aynı anahtarlarla gelen aboneliği taşıyor ve
  `true`/`false` dönüyor (öncesinde adres çakışmasında anahtarlar dahil üzerine yazıyordu). İlk hâli `bd7d108 commit 322`
  (aynı gün). Toplam 2 commit.
- Bilinen açıklar (kod değiştirilmedi): 5 sınırının işlem dışında olması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Mesaj ayarları … bildirim paneli SEKMELER hâlinde" bildirim türü getirirse
  telefona hangi türlerin gideceği seçilebilir; "Sistem" işindeki "yeni cihaz uyarısı + açık oturumlar" abonelikleri de
  listeleyebilir; "Optimizasyon + saklama süreleri" uzun süre başarısız aboneliklerin (`son_basari`) temizlenmesini
  ekleyebilir.
