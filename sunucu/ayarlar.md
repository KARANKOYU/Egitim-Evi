# sunucu/ayarlar.js

`data/ayarlar.json`'u (e-posta, site adresi, ters vekil, veritabanı bağlantısı) okur, yoksa varsayılanla oluşturur.

## Bu dosya ne yapar?

Sunucunun kurulumdan kuruluma değişen ama sık değişmeyen ayarları `data/ayarlar.json`'da durur: e-posta (SMTP)
bilgileri, sitenin internetteki adresi, ters vekil (Cloudflare, Caddy, nginx) arkasında olup olmadığı ve veritabanı
bağlantısı. Bu dosya o JSON'u okuyup bellekte tek bir `ayarlar` nesnesinde tutar. `data/` klasörü web'den hiç
sunulmadığı için e-posta şifresi tarayıcıya sızamaz.

Site ayarları (iletişim, Play Store bağlantısı, aralıklar) BURADA DEĞİL; onlar `sunucu/site.js`'te (veritabanı >
`data/config.yml` > varsayılan).

## İçinde neler var?

- `AYAR_DOSYA` — `DATA/ayarlar.json` yolu.
- `VARSAYILAN_AYAR` — dosya yokken yazılan ve eksik alanları dolduran şablon:
  - `site.adres` (boş) — bağlantılar ve e-posta metinlerinde kullanılır;
  - `vekil.guven` (`false`), `vekil.baslik` (`'cf-connecting-ip'`) — gerçek istemci adresinin hangi başlıktan
    okunacağı;
  - `eposta` — `etkin` (false), `sunucu` (`smtp.gmail.com`), `port` (465), `guvenli` (true), `kullanici`, `sifre`,
    `gonderen`, `gorunenAd`;
  - `_aciklama` — Gmail uygulama şifresinin nasıl alınacağını anlatan not.
- `ayarlar` — DEĞİŞMEZ başvurulu nesne. Başka dosyalar bunu bir kez `require` eder ve hep aynı nesneye bakar;
  yükleme içini boşaltıp yeniden doldurur, nesnenin kendisini değiştirmez.
- `ayarlariYaz(yeni)` — `ayarlar`'ın bütün anahtarlarını silip `yeni`'yi içine kopyalar.
- `ayarlariYukle()` — `DATA` yoksa oluşturur; `ayarlar.json` yoksa varsayılanı dosyaya yazar ve belleğe alır; varsa
  okur, üst düzeyi ve `eposta`, `vekil`, `site` alt nesnelerini varsayılanla birleştirir (dosyada olmayan alan
  varsayılandan gelir, dosyada olan fazladan anahtar — ör. `veritabani` — korunur). JSON bozuksa konsola
  "ayarlar.json okunamadi" yazar ve varsayılanla devam eder (sunucu düşmez).
- `epostaKurulu()` — `eposta.etkin`, `sunucu`, `kullanici` ve `sifre` doluysa `true`. Değilse giriş kodları ve
  onay bağlantıları konsola/günlüğe yazılır.

## Kimle konuşur?

- Çağırdığı: `fs`, `path`, `./yollar` (`DATA`).
- Onu çağıranlar (grep):
  - `sunucu/index.js` — açılışta `ayarlariYukle()`; `vekil.guven` ile IP başına bağlantı sınırı; açılış kutusunda
    site adresi ve e-posta durumu;
  - `sunucu/guvenlik.js` — `eposta` ile kod/onay/şifre sıfırlama postası, `site.adres` ile bağlantı, `vekil` ile
    istemci IP'si;
  - `sunucu/push.js` — VAPID "konu" adresi için `site.adres`;
  - `sunucu/yonetim-cerezi.js` — sitenin https olup olmadığı (çereze `Secure`);
  - `sunucu/veri/baglanti.js` — `ayarlar.veritabani` (bağlantı havuzu);
  - `sunucu/bolumler/site-ayarlari.js` — okul adreslerini gösterirken `site.adres`;
  - testler: `test-admin-gizli`, `test-cakisma`, `test-kisi-kodu`, `test-odev-dosya`, `test-okul-agi`,
    `test-okul-disk`, `test-quiz`, `test-servis-yoklama`, `test-site-ayarlari`, `test-yonetici-dosyasi`
    (test veritabanına bağlanmak için `ayarlariYukle()`); `test-vekil-ip` ise dosya okumaz, bellekteki
    `ayarlar.vekil`'i doğrudan değiştirip `istemciIp`'i dener; araçlar `deneme-okulu.js`, `yuk-testi.js`.
- `araclar/eposta-ayarla.js` ve `araclar/veritabani-kur.js` aynı dosyayı bu modülü kullanmadan kendileri yazar.

## Nasıl çalışır (adım adım)?

```
ayarlariYukle()
  DATA yok mu? ── evet ─> klasörü aç
  ayarlar.json yok mu? ── evet ─> VARSAYILAN_AYAR'ı dosyaya yaz, belleğe kopyala, bitti
  oku + JSON.parse
     ├─ olursa: {varsayılan + dosya}; eposta/vekil/site ayrı ayrı birleşir → ayarlariYaz
     └─ bozuksa: konsola uyarı, varsayılan → ayarlariYaz
```

Sunucu çalışırken dosyayı değiştirirsen etkisi yeniden başlatınca görünür; canlı okunan bir dosya değildir.

## Dikkat!

- `vekil.guven`'i YALNIZ gerçekten bir vekilin arkasındaysan aç. Açıkken herkes `X-Forwarded-For` / `cf-connecting-ip`
  başlığını uydurup hız sınırını ve kaba kuvvet kilidini aşabilir (dosyadaki yorum da bunu söyler; `test-vekil-ip.js`
  vekilin eklediği SON girdiyi aldığını denetler).
- `ayarlar` nesnesini yeni bir nesneyle DEĞİŞTİRME (`ayarlar = {...}` olmaz; zaten `const`); başka dosyalar eski
  başvuruya bakmaya devam eder. Hep `ayarlariYaz` kullan.
- Bu dosya gizli bilgi taşır (SMTP şifresi, veritabanı şifresi): depoya girmez (`.gitignore`, `test-gizli-dosyalar.js`),
  içeriğini hiçbir belgeye yazma.
- Varsayılan yazılırken dosyaya `chmod 600` uygulanmaz; `araclar/veritabani-kur.js` kendi yazdığında uygular.

## Testleri

- `testler/test-vekil-ip.js` (sunucusuz) — `vekil` ayarının istemci adresine etkisi.
- `testler/test-gizli-dosyalar.js` — `data/ayarlar.json` depoya giremez.
- Dolaylı: bütün sunuculu paketler; `testler/test-ayarlari.js` test klasörüne veritabanı bağlantısını yazar.
- Elle: boş bir klasörle `EE_DATA=/tmp/bos node server.js` → klasörde varsayılan `ayarlar.json` oluşur (veritabanı
  ayarı olmadığı için sunucu "Veritabanı ayarı yok" deyip kapanır — beklenen).

## Son durum

- Tek commit: `acefabc commit 1` (2026-08-28). O günden beri değişmedi; veritabanı ayarı sonradan eklendiğinde bu
  dosyaya dokunulmadı çünkü fazladan anahtarlar birleştirmede zaten korunuyor.
- Açık iş yok. Sıradaki "Sistem" işinde (e-posta sağlığı + sayaç) e-posta tarafı genişleyebilir.
