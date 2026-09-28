# sunucu/veri/yedek.js

JSON yedekleri: bütün veriyi `data/yedek/` altına dosya olarak yazar (günde bir otomatik, istenince elle), en yeni 14
dosyayı saklar, seçilen yedeğe önce o anki hâli "geri-alma" kopyası olarak saklayıp geri döner.

## Bu dosya ne yapar?

Veri PostgreSQL'de durur; bu dosya onun uygulamanın kendi biçiminde (JSON) kopyasını alır. Neden `pg_dump` değil: JSON
yedek elle okunabilir, PostgreSQL sürüm farkından etkilenmez ve yönetim panelinden tek tıkla geri yüklenebilir. Canlı
sunucuda ayrıca günlük `pg_dump` alınır (`belge/SUNUCUYA-KURULUM.md`); ikisi birbirinin yedeğidir.

Dökümün kendisi ve geri yazma [json-aktarim.md](json-aktarim.md)'dedir (`disaAktar`, `iceAktar`); bu dosya dosya işlerini
yapar: adlandırma, güvenli yazma, listeleme, eskileri silme, günlük zamanlama ve geri yüklemenin güvenlik adımları.
Yedekleri yalnız sistem yöneticisi görür ve kullanır (yönetim paneli → Yedekleme;
[../bolumler/yonetici.md](../bolumler/yonetici.md)).

## İçinde neler var?

### Sabitler

- `YEDEK_KLASOR` — `<veri klasörü>/yedek` ([../yollar.md](../yollar.md) `DATA`; varsayılan `data/yedek`, testlerde
  `EE_DATA` ile `testler/testdata/yedek`).
- `YEDEK_SAKLA` — 14: klasörde en çok kaç yedek dosyası kalsın (otomatik, elle ve geri-alma HEPSİ birlikte sayılır).
- `YEDEK_ARALIK_MS` — 6 saat: [../index.md](../index.md) `yedekKontrol`'ü bu aralıkla çağırır.

### Adlar

- `yedekAdi(d)` — `yedek-YYYY-AA-GG_SSDD.json`, sunucunun YEREL saatiyle (ör. `yedek-2026-09-26_0300.json`).
- Üç tür dosya: otomatik `yedek-2026-…json`, elle alınan `yedek-elle-2026-…json`, geri yüklemeden hemen önceki hâl
  `yedek-geri-alma-2026-…json`.

### İşlevler

- `yedekListesi()` — klasör yoksa `[]`; `^yedek-.*\.json$` kalıbına uyan dosyalar `{ ad, boyut, tarih }` (tarih: dosyanın
  değişme zamanı, ISO), YENİDEN ESKİYE dosyanın yazıldığı ana göre. (Ada göre sıralanınca `yedek-elle-…` adları
  otomatiklerin önüne geçiyordu; bu yüzden zamana göre.)
- `yedekTemizle()` — listede 14'ten sonraki (en eski) dosyaları siler; silinemeyen dosya yok sayılır.
- `dosyayaYaz(hedef)` (iç) — `disaAktar()` → klasörü gerekirse kurar → `JSON.stringify` (tek satır, girintisiz) →
  önce `<hedef>.tmp`'ye yazar, sonra `rename` ile asıl ada taşır. Yarım yazılmış bir dosya hiçbir zaman `yedek-….json`
  adıyla görünmez.
- `yedekAl(elle)` — ad üretir (`elle` ise `yedek-elle-` önekli), yazar, `yedekTemizle()`; cevap `{ ad, boyut }`. Hata olursa
  günlüğe "Yedek alınamadı" yazar ve `{ hata: mesaj }` döner (fırlatmaz).
- `yedekGerekliMi()` — yalnız OTOMATİK yedeklere bakar (`yedek-elle-` ve `yedek-geri-alma-` hariç): hiç yoksa ya da en
  yenisi 20 saatten eskiyse `true`.
- `yedekKontrol()` — gerekliyse `yedekAl(false)`; alınırsa "Günlük yedek alındı: …" yazar. Hiçbir hatayı dışarı atmaz.
- `yedekGeriYukle(ad)` — geri yükleme (adımlar aşağıda). Cevap `{ ad, kullanici, atlanan }` ya da `{ hata }`:
  "Geçersiz yedek adı", "Yedek bulunamadı", "Yedek dosyası okunamadı: …", "Yedek geçerli görünmüyor (kullanıcı listesi
  yok)", "Geri yüklenemedi: yedekte kurallara aykırı bir çift kayıt var (…). Veri değişmedi." ya da
  "Geri yüklenemedi: …".

Dışa açılanlar: `YEDEK_KLASOR`, `YEDEK_SAKLA`, `YEDEK_ARALIK_MS`, `yedekAdi`, `yedekListesi`, `yedekTemizle`, `yedekAl`,
`yedekGerekliMi`, `yedekKontrol`, `yedekGeriYukle` (hepsi [index.md](index.md) üzerinden de).

## Kimle konuşur?

- Çağırdıkları: Node `fs`, `path`; [../yollar.md](../yollar.md) → `DATA`; [json-aktarim.md](json-aktarim.md) →
  `disaAktar`, `iceAktar`; [baglanti.md](baglanti.md) → `cakisma`.
- Onu çağıranlar (hepsi `require('../veri')` üzerinden, [index.md](index.md) bu dosyanın her şeyini dışa açar):
  - [../index.md](../index.md) — `setInterval(yedekKontrol, YEDEK_ARALIK_MS)` ve açılıştan 20 sn sonra bir kez
    `yedekKontrol`.
  - [../bolumler/yonetici.md](../bolumler/yonetici.md) (yalnız sistem yöneticisi; başkasına bilinmeyen adres gibi 404):
    - `GET /api/admin/backups` → `{ yedekler: yedekListesi(), saklanan: YEDEK_SAKLA, klasor: YEDEK_KLASOR }`;
    - `POST /api/admin/backup-now` → `yedekAl(true)`; hata 500;
    - `GET /api/admin/backup-download?ad=…` — adı aynı kalıpla temizleyip dosyayı `Content-Disposition: attachment` ile
      indirir (bu dosyanın işlevini kullanmaz, `YEDEK_KLASOR`'u kullanır);
    - `POST /api/admin/backup-restore` `{ ad }` → `yedekGeriYukle`; başarıda işlem kaydına `yedek.geri-yuklendi` yazılır ve
      yöneticinin oturumu yüklenen veride de var mı (`oturumKaldi`) söylenir;
    - `POST /api/admin/backup-delete` `{ ad }` — dosyayı siler (yine yalnız `YEDEK_KLASOR`).
  - Ön yüz: `public/js/yonetim/09-yonetici.js` (yönetim paneli → Yedekleme). Android uygulaması kullanmaz.
- Dosyalar: `data/yedek/yedek-*.json` (ve yazarken geçici `*.json.tmp`). Tablolar: [json-aktarim.md](json-aktarim.md)
  üzerinden hepsi.

## Nasıl çalışır (adım adım)?

### Günlük yedek

```
sunucu açıldı ──20 sn──► yedekKontrol ──► yedekGerekliMi?  (son OTOMATİK yedek > 20 saat ya da hiç yok)
     └── her 6 saatte ──► yedekKontrol       evet → yedekAl(false)
                                                   disaAktar → yedek-….json.tmp → rename → yedek-….json
                                                   yedekTemizle (14'ten fazlası silinir)
```

Sonuç: sunucu sürekli açıksa günde bir otomatik yedek; 20 saat eşiği ve 6 saatlik yoklama yüzünden alınma saati gün gün
kayar.

### Geri yükleme

```
yedekGeriYukle(ad)
  1. ad: [a-zA-Z0-9._-] dışındaki her karakter atılır; ^yedek-.*\.json$ değilse "Geçersiz yedek adı"
     ("../" ve "/" kalmaz: klasör dışına çıkılamaz)
  2. dosya yoksa "Yedek bulunamadı"; JSON okunamazsa ya da users dizisi yoksa hata (veri değişmez)
  3. ŞİMDİKİ hâl → yedek-geri-alma-….json   (başarısız olursa yok sayılır!)
  4. iceAktar(içerik)  — tek işlem: tabloları boşalt + yaz; hata → ROLLBACK, veri değişmez
       23505 (kurallara aykırı çift) → "Geri yüklenemedi: yedekte kurallara aykırı bir çift kayıt var (…). Veri değişmedi."
  5. → { ad, kullanici, atlanan }
```

## Dikkat!

- **Geri-alma kopyası sessizce atlanabilir.** 3. adımda kopya yazılamazsa (disk dolu, izin yok, `disaAktar` hatası) hata
  "kritik değil" diye yutulur ve geri yükleme YİNE DE yapılır: o anki veri bir kopyası olmadan silinmiş olur. Disk doluyken
  geri yükleme yapma; önce elle yedek al ve alındığını gör. (Kod değiştirilmedi; öneri: kopya yazılamazsa geri yüklemeyi
  durdurmak.)
- **14 sınırı bütün türleri birlikte sayar.** Aynı gün birkaç elle yedek ve geri yükleme yapılırsa otomatik yedekler
  sınırın dışına itilip SİLİNEBİLİR; geri-alma kopyası da elle yedekler gibi eski otomatikleri iter. Silme yalnız
  `yedekAl` sonunda çalışır: geri yükleme kopyası sonrası sayı geçici olarak 14'ü aşabilir.
- **Aynı dakikada iki yedek aynı adı alır.** Ad dakika çözünürlüğündedir; aynı dakikada ikinci bir elle yedek (ya da iki
  geri yükleme) öncekinin ÜSTÜNE yazar (`rename` hedefi değiştirir).
- **Hangi yedek "son"?** `yedekGerekliMi` dosyanın değişme zamanına bakar, adına değil. Klasöre dışarıdan kopyalanan eski bir
  yedek (kopyalama zamanı yeni olduğu için) otomatik yedeği bir gün geciktirebilir; listede de en üstte görünür.
- **Yerel saat:** adlar sunucunun yerel saatiyle yazılır (sunucu Türkiye saatinde çalışmalı); liste ise ISO (UTC) zaman
  döner.
- **Geri yüklenen veri neyi kapsamaz:** yüklenen dosyalar (teslim dosyaları `data/dosyalar`, okul fotoğrafları
  `data/okul-fotolari`, mesaj/ödev ekleri `data/ekler`), panelden kaydedilen site ayarları (`site_ayarlari`), telefon
  bildirim anahtarı (`data/push-anahtar.json`) yedekte yok. Daha önemlisi, geri yükleme `ekler` tablosunu BOŞALTIR (mesaj ve
  ödev ekleri kaybolur; saatlik temizlik kaydı kalmayan dosyaları da diskten siler), onay bekleyen e-posta kayıtlarını ve
  servis seferlerini siler; ayrıntı [json-aktarim.md](json-aktarim.md) "Dikkat!".
- **Geri yükleme zamanı geri alır:** şifreler, oturumlar ve kişi kodları yedekteki hâline döner; yedekten sonra açılan
  oturumlar (geri yükleyen yöneticininki dahil) kapanır, yedekten sonra kapatılan oturumlar yeniden geçerli olabilir.
  Geri yükleme sürerken bütün tablolar kilitlidir; uzun sürerse istekler 503 alır.
- **Yedek dosyaları kişisel veri ve şifre özetleri taşır.** Dosyalar `fs.writeFileSync`'e izin (mode) verilmeden yazılır:
  Linux'ta süreç `umask`'ına göre (çoğunlukla herkes okuyabilir: 644) oluşur. Koruma, kurulum belgesindeki `data/`
  klasörünün sahipliğine dayanır; yedek klasörüne ayrıca `700`/dosyalara `600` verilmesi ya da kodda `mode: 0o600`
  kullanılması önerilir (bugün `data/ayarlar.json` (`araclar/veritabani-kur.js` `chmod`), test ayar dosyası
  (`testler/test-ayarlari.js`), telefon bildirim anahtarı ([../push.md](../push.md)), teslim dosyaları ve okul fotoğrafları
  `0o600` ile yazılıyor; yedekler değil).
- **Bellek:** `dosyayaYaz` bütün veriyi tek bir metne çevirir; çok büyük veride bellek ve V8 metin sınırı sorun olur
  (planlı `.tar.gz` işi bunu çözecek).
- **Ham hata iletisi yöneticiye gider:** çakışma dışındaki geri yükleme hatası ("Geri yüklenemedi: …") ve `yedekAl`'ın
  hatası (`{ hata }`, panelde 500) `e.message`'ı olduğu gibi taşır; PostgreSQL'in İngilizce iletisi tablo ya da kısıt adı
  içerebilir. [baglanti.md](baglanti.md)'deki "kısıt adı dışarı sızmaz" kuralının dışında kalır, ama bu uçları yalnız
  sistem yöneticisi görür.
- **Belge çelişkisi:** `belge/SUNUCUYA-KURULUM.md` geri-alma kopyasının adını `yedek-elle-geri-alma-…` diye yazıyor; kod
  `yedek-geri-alma-…` üretiyor (`belge/KILAVUZ.md` doğru). Kurulum belgesi düzeltilmeli.
- **Testte gerçek veriye dokunma:** yedek klasörü `EE_DATA` ile değişir; testler `testler/testdata/yedek`'i kullanır.
  Geri yüklemeyi yalnız test veritabanında dene.

## Testleri

- `testler/test-yedek.js` (sunucu gerekir) — elle yedek alma ve boyutu, listede görünmesi, indirme, yol kaçışı denemeleri
  (indirme ve silmede `../` 400/404), müdürün yedeklere erişememesi (404), geri yükleme (yedekten sonraki değişiklik
  gidiyor, `yedek-geri-alma-` kopyası oluşuyor, yeni tabloların verisi geri geliyor), `/admin` çerezinin ve telefon
  uygulaması anahtarının korunması, oturumu yedekte olmayan yöneticinin çıkışı, olmayan yedek adının reddi (400), silme.
- `testler/test-cakisma.js` — kurallara aykırı çiftli bir yedeğin `iceAktar` ile yüklenmesi ([json-aktarim.md](json-aktarim.md)).
- Testi olmayanlar: `yedekTemizle`'nin 14 sınırı, `yedekGerekliMi`'nin 20 saat kuralı ve günlük zamanlama, geri-alma
  kopyası yazılamayınca davranış, aynı dakikadaki ad çakışması.
- Elle (test veritabanıyla): yönetim paneli → Yedekleme → "Şimdi yedek al"; bir değişiklik yap; yedeğe geri dön; listede
  `yedek-geri-alma-…` görünmeli, değişiklik gitmeli.

## Son durum

- Son değişiklik `276c0a0 commit 521` (2026-09-27): geri yüklemede `23505` (kurallara aykırı çift) hatası `cakisma` ile
  hangi alan olduğunu söyleyen Türkçe bir iletiye çevrildi ("… Veri değişmedi."). Dosya 2026-09-25'te `d47ce8d commit 182`
  … `94361a9 commit 192` ile parça parça eklendi (192'de `module.exports`, 191'de `yedekGeriYukle`).
- Bilinen açıklar (kod değiştirilmedi): geri-alma kopyası yazılamayınca geri yüklemenin sürmesi; 14 sınırının türleri
  ayırmaması; dosya izinleri; kurulum belgesindeki ad yanlışı.
- Planlı: "Optimizasyon + saklama süreleri" günlük yedeği akışlı `.tar.gz`'ye çevirecek (tablo tablo JSON satırları +
  isteğe bağlı yüklenen dosyalar; "en yeni 7 otomatik + elle alınanlar" saklanacak; geri yükleme `.tar.gz`'yi ve eski
  `.json`'ları okuyacak) — bu dosya büyük ölçüde yeniden yazılacak. "Yıl geçişi" okul başına yedek (şifreli, imzalı, okul başına sınır)
  getirecek; "Paneller" işinde `/duzenle` okul sayfalarına yedek sınırı alanı var.
