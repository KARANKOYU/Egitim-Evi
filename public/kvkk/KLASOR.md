# public/kvkk/KLASOR.md

Kişisel verilerin korunması aydınlatma metninin klasörü; içindeki tek dosya `kvkk.html`, sitede `/kvkk/kvkk.html` adresinde
açılan, kayıtta herkesin onayladığı ve sürümü değişince herkesin yeniden onayladığı düz HTML sayfadır (bugün sürüm 1.16).

## Bu dosya ne yapar?

Eğitim Evi kişisel veri işler: ad, e-posta, telefon, T.C. kimlik no, öğrencinin ödev ve not kayıtları, servis konumu… 6698
sayılı KVKK'nın 10. maddesi, veriyi işleyenin kişiyi önceden bilgilendirmesini (aydınlatma yükümlülüğü) ister. `kvkk.html` bu
bilgilendirmenin kendisidir: hangi veri, kimden, hangi amaçla, hangi hukuki sebeple alınıyor; kim görüyor; ne kadar saklanıyor;
nasıl korunuyor; kişinin hakları neler.

Metin yalnız okunmak için durmaz, **onaylanır**:

- Kendisi kaydolan herkes (veli, öğretmen, müdür) "Kayıt ol" formundaki kutuyu (`#kKvkk`) işaretlemeden hesap açamaz; sunucu da
  `kvkkOnay: true` gelmezse kaydı reddeder ([../../sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)).
- Okulun açtığı hesaplar (öğrenci, servisçi) metni ilk girişte görür ve onaylar. Bu hesaplarda kayıtlı onay hiç yoktur; pencere
  "güncellendi" demez, başlığı yalnız "Aydınlatma metni"dir. Onaydan sonra, okulun verdiği şifreyle girildiyse "Kendi şifreni
  belirle" penceresi gelir (sıra `05b-sifre-zorunlu.js` `girisSonrasi`'nda: önce onay, sonra şifre).
- Metin değişince sunucudaki `KVKK_SURUM` artırılır; onayı eski sürümde kalan herkes girişte "Aydınlatma metni güncellendi"
  penceresini görür ve onaylamadan uygulamaya giremez. Tek istisna sistem yöneticisi: `kvkkGuncelMi` ona hep "güncel" der
  (kayıt formundan geçmez, sistemi kuran kişidir).

Neden ayrı bir klasör? 27 Eylül'deki "sayfa klasörleri" işinde (`commit 517`) düz sayfaların asıl adresi klasörlü yapıldı:
`egitimevi.org/kvkk/kvkk.html`. Kısa ve eski adresler (`/kvkk`, `/kvkk/`, `/kvkk.html`, büyük harfli yazılışları) oraya kalıcı
olarak (301) yönlenir ([../../sunucu/http.md](../../sunucu/http.md), `YONLENDIRMELER`). Dosya ondan önce `public/kvkk.html`
adıyla duruyordu.

Kullanıcının kesin kuralı (28 Eylül, "eksik metin olmasın"): kişisel veri işleyen ya da gösteren her yeni özellik **aynı
commit'te** bu metni ve onay kutusunun metnini günceller, `KVKK_SURUM`'u artırır (herkes yeniden onaylar).

Bu `KLASOR.md` de bu klasörde durur ama web'den okunamaz: sunucu `.md` uzantılı her adrese bilinmeyen adresle aynı 404'ü verir.

## İçinde neler var?

### `kvkk.html`

Klasördeki tek dosya (326 satır, ~33 KB). Uygulama paketi (`/js/app.js`) yüklenmez; düz bir belgedir.

**Baş kısmı (`<head>`):** `/js/tema.js` (eş zamanlı; açık/koyu tema sayfa çizilmeden uygulanır), `/js/belge.js` (`defer`), arama
motoru açıklaması (`<meta name="description">`), başlık "Aydınlatma Metni · Eğitim Evi", `/css/style.css`, sekme simgesi
`/simge-192.png?v=2` ve sayfaya gömülü küçük bir `<style>` (`.belge`, `.belge-ust`, `.kutu`, tablo ve `footer` düzeni; aynı blok
`kosullar.html`, `indir.html`, `404.html` ve `okul-bulunamadi.html`'de de var).

**Üst şerit ve alt bilgi:** sitenin bütün düz sayfalarındaki ortak iskelet — logo, "Giriş", "Kayıt ol", "İndir", ay/güneş tema
düğmesi (`data-act="tema-degis"`), "Hakkında", "SSS", "Yapımcılar" açılır listesi (`data-act="yapimcilar"`); altta "Kaynak kodu",
Hakkında, SSS, Kullanım koşulları, Aydınlatma metni bağlantıları ve boş bir iletişim yeri (`#sIletisim`). Tema düğmesini ve
Yapımcılar listesini [../js/belge.md](../js/belge.md) çalıştırır.

**Sürüm satırı:** başlığın altında "Sürüm 1.16 · Yürürlük tarihi: 02.10.2026" ve sayfanın sonundaki `footer`'da aynısı. İki
yerde de elle yazılır.

**On bir bölüm:**

| # | Başlık | Ne anlatır |
|---|---|---|
| 1 | Veri sorumlusu kim? | Veri sorumlusu okulun kendisidir; Eğitim Evi bir hizmettir ve verileri okul adına işler. Veriler Eğitim Evi'nin sunucusunda durur, her okulunki ayrıdır, yalnız o okulun yetkilileri erişir; reklam, analiz ya da satış için kimseye aktarılmaz. |
| 2 | Hangi veriler işleniyor? | 37 satırlık "Veri türü / Kimden" tablosu (aşağıda gruplandı) ve altında: özel nitelikli veri (sağlık, din, biyometrik…) toplanmaz; T.C. kimlik no yalnız kişileri doğru eşleştirmek için kullanılır. |
| 3 | Hangi amaçla işleniyor? | 15 maddelik liste: ödev/sınav/devamsızlık takibi, velinin izlemesi, ders programı, ödev dosyaları, quiz, mesaj ve anket, yemek/servis/kulüp, servis konumu ve sırası, servis yoklaması, telefon bildirimi, giriş bilgilerinin ulaştırılması, kodla okula eklenme, T.C. ile eşleştirme, acil durumda telefonla ulaşma, hesap güvenliği. |
| 4 | Hukuki sebep nedir? | KVKK 5. madde: sözleşmenin kurulması ve ifası, hukuki yükümlülük, açık rıza. Kutu içinde: reşit olmayan öğrencinin verileri velinin bilgisi ve onayıyla işlenir, veli onayı geri çekebilir. |
| 5 | Verilere kimler erişebilir? | Beş rol tek tek: öğrenci (kendi), veli (bağlı çocuğu; çocuğa giden bildirimlerin kopyası), öğretmen (atandığı ders ve öğrenciler; quizde cevaplar ve sekme kaydı), servisçi (kendi servisindeki öğrenciler, yoklama, "binmeyecek" işaretleri), müdür ve yetkilendirilmiş personel (okulunun verisi). |
| 6 | Veriler yurt dışına aktarılıyor mu? | Sunucu Türkiye dışındaysa bu KVKK 9. madde kapsamında aktarımdır, okul bildirmekle yükümlüdür. İki dış hizmet: OpenStreetMap harita döşemeleri (IP adresi ve bakılan bölge o sunuculara gider) ve tarayıcının telefon bildirimi servisi (içerik şifreli). Eğitim Evi telefon uygulaması bildirimi doğrudan Eğitim Evi sunucusundan sorar. |
| 7 | Ne kadar süre saklanıyor? | Okulla ilişik sürdükçe; hesabımı sil; teslim dosyaları (son teslim + 7 gün, son teslimsiz ödevde sonuçlandırma + 7 gün, hiç sonuçlanmazsa 60 gün), ekler 7 gün, quiz ödevle birlikte, servis seferi/yoklama/notlar 30 gün (yedeğe alınmaz), Eğitim Evi Aile verileri 7 gün, oturum tarayıcıda 7 gün / uygulamada 30 gün, cihaz anahtarı. |
| 8 | Veriler nasıl korunuyor? | 11 madde: scrypt, iki adımlı giriş, tahmin edilemeyen dosya adları, okulun verdiği şifreyle girenin şifre değiştirmesi, e-posta doğrulaması, güçlü yetişkin şifresi, uçtan uca şifreli bildirim, oturum ve cihaz anahtarının yalnız SHA-256 özeti, hesap kilidi ve hız sınırı, HTTPS, düzenli yedek. |
| 9 | Haklarınız neler? (KVKK madde 11) | 8 hak; başvuru okul yönetimine yazılı yapılır, okul en geç 30 günde sonuçlandırır. |
| 10 | Kullanım sırasında yaşanan sorunlar | Yazılım "olduğu gibi" sunulur; sorumluluğun sınırı kısaca ve ayrıntı için [../kosullar/KLASOR.md](../kosullar/KLASOR.md)'deki `kosullar.html`'e bağlantı. |
| 11 | Bu metin değişirse ne olur? | Sürüm numarası değişir, onay yeniden istenir; onay tarihi hesapta kayıtlıdır. |

**2. bölümün tablosu, gruplanmış hâliyle** (satır sırası sayfadaki gibi değil, okunabilsin diye gruplandı):

- Kimlik ve iletişim: ad soyad, kullanıcı adı, e-posta (kendisi kaydolanda zorunlu; onay bağlantısı 24 saat), telefon, T.C.
  kimlik numarası (bütün hesaplarda zorunlu, eşleştirme amaçlı; yetişkininki okulla paylaşılmaz), kişi kodu (öğrencide veli kodu;
  kim görür, nasıl kullanılır, bir kez kullanılıp yenilenir), okul numarası, adres ile okulun il/ilçesi, doğum tarihi (yalnız
  öğrencide).
- Okul kayıtları: okul/sınıf/şube, ödev durumu, ödev yıldızları, ödeve yüklenen dosyalar, quiz cevapları ve sekme değiştirme kaydı,
  mesaj ve ödev ekleri, öğrencinin önceki okulları, sınav notları, devamsızlık ve etüt yoklaması, ders programı, veli–öğrenci
  bağlantısı, kulüp üyelikleri, anket cevapları, duyuruların okunma zamanı.
- Servis: servis, durak ve sıra; şoför ve rehber personelin adı/telefonu; servis yoklaması; servisçinin notları ve velinin
  "binmeyecek" işareti; öğrencinin evinin haritadaki yeri; servis aracının anlık konumu.
- Telefon ve uygulama: telefon bildirimi aboneliği, telefon uygulamasının cihaz anahtarı (hesap başına en çok 5 telefon), Eğitim Evi
  Aile uygulamasının konum ve uygulama kullanım süreleri (yalnız bağlı veliler görür, okul görmez).
- Diğer: kişisel hatırlatıcılar, açılış sayfası yorumu, giriş kayıtları (tarih, IP) ve son giriş, okul sayfasındaki fotoğraflar ve
  tanıtım yazısı.

**Sayfanın sonu:** "← Giriş sayfasına dön" (`/login`) ve `footer`: "Bu metin genel bir şablondur…" — okulun adını, iletişim
bilgilerini ve sunucunun ülkesini ekleyip bir hukukçuya danışma önerisi.

Sayfanın kendine ait betiği yoktur; tıklanan her şey ya bağlantıdır ya da `belge.js`'in iki düğmesi.

### Sürüm geçmişi (sunucudaki `KVKK_SURUM` yorumundan ve `git log`'dan)

| Sürüm | Commit | Ne eklendi / değişti |
|---|---|---|
| 1.10 | `0acca75 commit 516` (27.09) | kişi kodu (öğrencide veli kodu), yöneticinin kodla müdür ataması; müdür başvurusu ve yetişkinden doğum tarihi kalktı |
| 1.11 | `24050a2 commit 518` (27.09) | servis yoklaması, sıra, servisçinin notu, "binmeyecek", servis saatleri, uygulamada arka plan konumu, cihaz anahtarı, 30 günlük uygulama oturumu |
| 1.12 | `3b8fd36 commit 519` (27.09) | ödevin quizi: cevaplar, süreler, sekme kaydı, kim ne görür |
| 1.13 | `566b917 commit 524` (27.09) | ödev teslim dosyaları yalnız öğretmen açtıysa, 50 MB; yeni saklama süreleri |
| 1.14 | `7fda2ee commit 543` (30.09) | verilerin yeri düzeltildi: "okulun kendi sunucusu" değil, Eğitim Evi'nin sunucusu; okul adına işleme |
| 1.15 | `77353fe commit 552` (02.10) | T.C. kimlik no bütün hesaplarda zorunlu, amacı eşleştirme, geçerlilik kuralı |
| 1.16 | `4d392e0 commit 554` (02.10) | 6. bölümde kalan "okulun kullandığı sunucu" yanlışı düzeltildi |

Daha eski sürümlerin (1.2–1.9) ne getirdiği de aynı yorumda yazılıdır ([../../sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)).

## Kimle konuşur?

- **Sunan:** [../../sunucu/http.md](../../sunucu/http.md) — `serveStatic` dosyayı okur, `htmlSurumle` içindeki `/css/style.css` ve
  `/js/tema.js` adreslerine `?v=<ETag>` ekler, `statikGonder` gönderir. Kısa adresler `YONLENDIRMELER` ile buraya 301.
- **Sürümün sunucudaki karşılığı:** `KVKK_SURUM` ([../../sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)): `kvkkGuncelMi`
  kişinin onayladığı sürümü bununla karşılaştırır; [../../sunucu/api.md](../../sunucu/api.md)'deki kapı onayı eski olana yalnız
  `KVKK_SERBEST` listesindeki uçları açar, ötekilere 403 `{ kvkkGerek: true }` döner. Onay `POST /api/kvkk-onay` ile verilir.
- **Bu sayfaya bağlananlar:**
  - `public/index.html` ([../KLASOR.md](../KLASOR.md)): kayıt formundaki onay kutusu (`#kKvkk`, bağlantı yeni sekmede açılır),
    Hakkında'daki "Bilgiler nerede?", SSS'teki gizlilik ve hesap cevapları, alt bilgi.
  - [../js/parcalar/26-baslat.md](../js/parcalar/26-baslat.md) — `kvkkOnayIste`: yeniden onay penceresinde "Aydınlatma metnini
    yeni sekmede aç" ve onay kutusu (kutunun metninde kullanım koşulları da var); "Onaylıyorum" `data-act="kvkk-onayla"`
    ([../js/parcalar/25-tiklama.md](../js/parcalar/25-tiklama.md)).
  - [../js/parcalar/07-yonlendirme.md](../js/parcalar/07-yonlendirme.md) — `altBilgi`: uygulamanın her sayfasının altındaki
    "Aydınlatma metni" bağlantısı.
  - [../js/parcalar/05-giris.md](../js/parcalar/05-giris.md) — kayıt gönderilirken `kvkkOnay: $('kKvkk').checked`.
  - Bütün düz sayfaların üst şerit/alt bilgisi (`404.html`, `okul-bulunamadi.html`, `indir/indir.html`, `kosullar/kosullar.html`)
    ve `kosullar.html`'in giriş paragrafı.
  - Android uygulaması (ayrı depo): onay sayfası `KvkkSayfasi` beş maddelik bir özet gösterir, metnin tamamı için bu adresi
    tarayıcıda açar.
- **Çağırdığı:** yalnız `belge.js` üzerinden `GET /api/site` (Yapımcılar listesi için; [../../sunucu/site.md](../../sunucu/site.md)).
- **Görünüm:** ortak stiller [../css/parcalar/CSS.md](../css/parcalar/CSS.md) (`29-dis-sayfalar.css`: üst şerit, alt bilgi,
  Yapımcılar); belge düzeni sayfanın kendi `<style>`'ında.
- **Kim görür:** herkes, girişsiz.

## Nasıl çalışır (adım adım)?

```
Kayıt:   "Kayıt ol" formu ─► kutu: "Aydınlatma metnini okudum…" (bağlantı /kvkk/kvkk.html, yeni sekme)
         POST /api/register { …, kvkkOnay: true } ─► (kvkkOnay true değilse kvkk alanında hata)
           ─► bekleyen kayda o anki KVKK_SURUM yazılır, e-postaya onay bağlantısı gider
         bağlantı tıklanınca (eposta-onay) hesap açılır: kvkk { onay: true, tarih: kayıt anı, surum: bekleyen kaydınki }

Metin değişti (geliştirici):
   kvkk.html'i düzenle (üstteki ve alttaki sürüm satırı) ─► kayit.js'te KVKK_SURUM'u artır (+ yorumuna satır)
   ─► aynı commit

Sonraki girişte:  /api/me ─► kvkkGuncel: false ─► 26-baslat kvkkOnayIste: "Aydınlatma metni güncellendi (sürüm 1.16)"
                  bu arada KVKK_SERBEST dışındaki her API isteği 403 { kvkkGerek: true }
                  "Onaylıyorum" ─► POST /api/kvkk-onay ─► uygulama açılır

Adres:  /kvkk, /kvkk/, /kvkk.html, /KVKK ─► 301 /kvkk/kvkk.html (sorgu dizesi korunur)
        /kvkk/kvkk.html ─► 200 text/html (stil ve tema betiği ?v=ETag'li)
```

## Dikkat!

- **Sürüm üç yerde elle eşit tutulur:** sayfanın üstündeki ve altındaki "Sürüm …" satırları ile `KVKK_SURUM`. Bunları
  karşılaştıran bir test yok. Sayfayı değiştirip `KVKK_SURUM`'u artırmazsan kimseden yeniden onay istenmez; tersini yaparsan
  herkes eski metni yeniden onaylar.
- **Metin koddan önde olabilir.** Sürüm 1.15 "T.C. kimlik numarası bütün hesaplarda zorunlu" diyor; ama kayıt formu bugün hâlâ
  "T.C. kimlik no (isteğe bağlı)" yazıyor ([../js/parcalar/05-giris.md](../js/parcalar/05-giris.md)'deki `tcSorunuTR` boşu kabul
  eder). Zorunluluğun kodu planlı bir iştir ("T.C. kimlik no bütün hesaplarda zorunlu", Linux oturumunda yapılacak). Metin
  bu arada kodun önündedir.
- **Kulüp satırları:** 2. bölümde "Kulüp üyelikleri", 3. bölümde "…kulüp çalışmalarının yürütülmesi" geçiyor. Kulüpler kaldırılacak
  (planlı iş); kaldırılınca bu satırlar da çıkmalı ve sürüm artmalı.
- **Hukuki metin şablondur.** Sayfanın kendi notu söylüyor: okulun adı, iletişim bilgisi ve sunucunun ülkesi eklenip bir hukukçuya
  gösterilmeden gerçek bir okulda yayına alınmamalı.
- **Kullanım koşullarının kendi sürüm sabiti yok.** Yeniden onay penceresindeki kutu koşulları da kapsar, ama pencere yalnız
  `KVKK_SURUM` değişince çıkar. Bu yüzden koşulların her yeni sürümünde aydınlatma metninin sürümü de aynı commit'te artırıldı
  (koşullar 1.1 ile KVKK 1.10 `commit 516`, 1.2 ile 1.11 `commit 518`, 1.3 ile 1.13 `commit 524`).
- **Bağlantılar mutlak yolla yazılmalı** (`/css/style.css`, `/kosullar/kosullar.html`): sayfa `/kvkk/` altında durduğu için göreli
  bir yol yanlış klasörü gösterir. `testler/test-adresler.js` bunu denetler.
- **Satır içi betik yazma.** Sunucunun güvenlik başlığı (`script-src 'self'`) sayfaya gömülü `<script>`'i çalıştırmaz; gereken
  davranış `belge.js` gibi ayrı bir dosyaya konur. Gömülü `<style>` ise serbesttir (`style-src 'unsafe-inline'`).
- **İletişim satırı boş:** alt bilgideki `#sIletisim`'i bu sayfada dolduran yok (açılış sayfasında uygulama paketi doldurur);
  ayrıntı [../js/belge.md](../js/belge.md).
- Bu klasöre konan `.md` dosyaları web'den sunulmaz; `testler/test-admin-gizli.js` buraya geçici bir `.md` yazıp 404 aldığını
  dener ve sonunda siler.

## Testleri

- `testler/test-adresler.js` (sunucu ister) — `/kvkk/kvkk.html` 200, `text/html` ve içinde "Aydınlatma"; `/kvkk`, `/kvkk/`,
  `/kvkk.html`, `/KVKK`, `/Kvkk.HTML`, `/kvkk/kvkk.html/` gibi yazılışların 301 ile asıl adrese gitmesi, sorgu dizesinin korunması,
  `%0d%0a` ve `//evil.com` denemelerinin başlığa satır ekleyememesi, `/kvkk/olmayan.html` 404; sayfada eski adrese bağlantı
  olmaması ve bütün varlıkların mutlak yolla yüklenmesi.
- `testler/test-sifre.js` — aydınlatma metni yayında (200).
- `testler/test-admin-gizli.js` — `/kvkk/x.md` ve diskte duran geçici `/kvkk/<ad>.md` bilinmeyen adresle bayt bayt aynı 404.
- `testler/yazim-denetimi.js` (sunucusuz) — `public/kvkk/kvkk.html` Türkçe yazım listesinden geçer.
- Onayın sunucu tarafı (sayfanın kendisini değil, ona bağlı kapıyı korur): `testler/test-yonetim.js` — okulun açtığı hesap
  girer ama `kvkkGuncel: false`; onaysız istek 403 `kvkkGerek`, `/api/me` serbest, `onay: 'evet'` 400, `onay: true` ile
  açılır. `testler/test-giris-kayit.js` — `kvkkOnay: false` ile kayıt `kvkk` alanında hata verir.
- Hepsi `bash testler/tumtest.sh` içinde koşar (3200 portu, `egitimevi_test`). Elle: sunucuyu aç, `/kvkk` yaz → adres
  `/kvkk/kvkk.html` olmalı; sürüm satırı üstte ve altta aynı; ay/güneş ve Yapımcılar çalışmalı.

## Son durum

- `git log` (eski adıyla birlikte): 17 commit. İlk hâli `95f5952 commit 160` (2026-09-08, `public/kvkk.html`); klasöre taşınması
  `b6bfc03 commit 517` (2026-09-27).
- `4d392e0 commit 554` (2026-10-02): sürüm 1.15 → 1.16; 6. bölümdeki "Veriler okulun kullandığı sunucuda tutulur" cümlesi
  "Veriler Eğitim Evi'nin sunucusunda tutulur (her okulun verisi ayrıdır)" oldu (üst ve alt sürüm satırı da).
- `77353fe commit 552` (2026-10-02): sürüm 1.14 → 1.15; T.C. satırı baştan yazıldı (bütün hesaplarda zorunlu, 11 hane ve
  geçerlilik kuralı, yetişkininki okulla paylaşılmaz, okul veliyi bağlarken yalnız eşleşme var/yok görür); tablonun altındaki
  "T.C. zorunlu değildir" cümlesi "yalnız eşleştirme için" oldu; 3. bölüme "T.C. ile doğru eşleştirme" maddesi eklendi.
- `7fda2ee commit 543` (2026-09-30): sürüm 1.13 → 1.14; 1. bölüm "Eğitim Evi bir yazılımdır; verileri okulun kendi sunucusunda
  tutar" yerine "bir hizmettir ve verileri okul adına işler… Eğitim Evi'nin sunucusunda… her okulun verisi ayrıdır"; 6. bölümde
  telefon uygulamasının bildirimi "okulun sunucusundan" değil "Eğitim Evi'nin sunucusundan" sorduğu.
- Bilinen açık: T.C. zorunluluğu metinde var, kayıt formunda yok (yukarıda). Kod değiştirilmedi.
- Planlı işlerden bu klasörü etkileyecekler: "T.C. kimlik no bütün hesaplarda zorunlu" (kayıt formu metne uyacak, eski
  yetişkinlerden T.C. istenecek); "Kulüpler kaldırılacak" (kulüp satırları çıkacak); "KVKK ve onay metinleri TAM denetimi"
  (her tablo/sütun ve dışarı giden veri bu metinle karşılaştırılacak, canlıdan önce); "Çok dil" (hukuki metin çevrilmez,
  seçili dil ne olursa olsun Türkçe gösterilir ve "Bu metin yalnız Türkçedir" notu eklenir); "Site duyurusu" (Sistem işi;
  duyuru şeridi bu sayfanın da üstünde görünecek); "Arama motorunda görünme" (canlıda başlık, açıklama, kanonik adres). Kişisel
  veri işleyen her yeni özellik (mesaj etiketleri, toplantılar, başarılarım, eğitim içerikleri…) bu metne satır ekleyecek.
