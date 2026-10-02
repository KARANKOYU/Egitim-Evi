# public/js/yonetim/09c-yonetici-dosyasi.js

Yönetim paneli > Yönetici Dosyası: sunucudaki `data/admins.json` dosyasının son okunuşunu (açılan yönetici hesapları,
atlanan satırlar ve nedenleri) gösterir ve **Şimdi oku** ile dosyayı beklemeden okutur; şifre hiçbir zaman görünmez.

## Bu dosya ne yapar?

Sistem yöneticisi hesapları web'den açılmaz: sunucuyu kuran kişi `data/admins.json` dosyasına yönetici satırları yazar
(örnek: depodaki `belge/admins.ornek.json`), sunucu dosyayı açılışta ve sonra "admins.json okuma aralığı"nda (Site
Ayarları; varsayılan 1 dakika) değişti mi diye yoklayarak okur ve yeni satırlar için hesap açar. Dosya sunucu çalışırken
de düzenlenebilir. Kuralların ve okumanın kendisi [../../../sunucu/yonetici-dosyasi.md](../../../sunucu/yonetici-dosyasi.md)'de.

Bu ekran o okumanın **sonucunu** yöneticiye gösterir; böylece sunucu penceresine (konsola) bakmadan "yazdığım satır
açıldı mı, açılmadıysa neden?" sorusunun cevabı görülür:

- dosya şu an var mı, son ne zaman okundu, dosya son ne zaman değişti, okuma aralığı;
- son okumada açılan hesaplar (e-posta, kullanıcı adı, şifre dosyadan mı geldi yoksa üretildi mi);
- atlanan satırlar ve nedenleri ("şifre en az 8 karakter olmalı", "bu e-posta yönetici olmayan bir hesapta…");
- dosyanın kuralları.

**Şimdi oku** dosyayı aralığı beklemeden okutur; okuma işlem kaydına yazılır. Üretilen şifre bu ekranda ASLA
görünmez: yalnız sunucu penceresine bir kez yazılır. Ekranı yalnız **sistem yöneticisi** görür; dosya yalnız yönetim
paketindedir (`/admin/yonetim.js`, bkz. [09-yonetici.md](09-yonetici.md) "Bu dosya ne yapar?").

## İçinde neler var?

- **`SAYFALAR['yonetici-dosyasi']`** (`#/yonetici-dosyasi`) — `GET /api/admin/yonetici-dosyasi` → `yoneticiDosyasiCiz`.
- **`yoneticiDosyasiCiz(d)`** — sayfayı baştan çizer. Kullandığı alanlar (sunucunun `gorunum()` + `aralikDk`):
  `dosya` (`'data/admins.json'`), `simdiVar`, `sonOkuma`, `dosyaDegisme`, `aralikDk`, `okunmadanDegisti`, `hata`,
  `uyari`, `eklenen: [{ eposta, kullaniciAdi, sifreUretildi }]`, `atlanan: [{ sira, eposta, neden }]`. Görünümde ayrıca
  `dosyaVar` (SON OKUMADA dosya var mıydı; `simdiVar` ise dosyanın şimdiki hâli) gelir; çizim onu kullanmaz, yalnız
  `yd-oku` iletinin rengini ona göre seçer.
  Önce `atlanan` ikiye ayrılır: nedeni "zaten yönetici" ile başlayanlar (`zaten`; her okumada tekrarlanır, sorun değil)
  ve gerçekten atlananlar. Çizilenler:
  1. Başlık "YÖNETİCİ DOSYASI", "Sistem yöneticisi hesapları sunucudaki data/admins.json dosyasından açılır. Dosya sunucu
     çalışırken de düzenlenebilir."
  2. **Son okuma** kartı (`.ayar-kart`): "Dosya — data/admins.json [Var | Yok]" (dosyanın ŞU ANKİ hâli), "Son okuma —
     tarih saat" ya da "Henüz okunmadı", "Dosyanın son değişikliği — tarih saat" ya da "—", "Okuma aralığı — N dakika"
     ("Sunucu bu aralıkla dosyanın değişip değişmediğine bakar; değiştiyse okur.") ve yanında **Aralığı değiştir**
     (`data-nav="site-ayarlari"`). Sonra koşullu kutular:
     - `okunmadanDegisti` → sarı: "Dosya son okumadan sonra değişti / silindi. Sunucu en geç N dakika içinde okuyacak;
       beklemeden okutmak için **Şimdi oku**'ya bas. Aşağıdaki sonuçlar son okumaya ait.";
     - `hata` → kırmızı: "Dosya okunamadı: <hata>. Dosyadaki hiçbir satır uygulanmadı." (ör. bozuk JSON, satır
       numarasıyla);
     - `uyari` → sarı, ilk harfi büyütülmüş (bugün tek uyarı: Windows dışında dosya başkalarınca okunabiliyorsa
       "Dosyayı yalnız sunucu kullanıcısı okuyabilmeli: chmod 600 <yol>.");
     - dosya yok ve son okumadan beri değişmedi → mavi: "Dosya yok. Yönetici eklemek için depodaki belge/admins.ornek.json
       dosyasını sunucuda data/admins.json olarak kopyala ve doldur."
     ve **Şimdi oku** düğmesi (`data-act="yd-oku"`), ileti yeri `#ydMesaj`.
  3. **Son okumada açılan hesaplar (N)** kartı: yoksa "Son okumada yeni hesap açılmadı."; varsa her satır e-posta,
     "Kullanıcı adı: …" ve etiket — `sifreUretildi` ise turuncu "Şifre üretildi, yalnız sunucu penceresinde", değilse gri
     "Şifre dosyadan"; altında "Açılan yönetici ilk girişte kendi şifresini belirler; ondan sonra dosyadaki şifre
     geçersizdir."
  4. **Atlanan satırlar (N)** kartı (yalnız gerçekten atlananlar sayılır): yoksa "Atlanan satır yok."; varsa her satır
     "Dosyadaki 3. yönetici · e-posta", nedeni (ilk harf büyük) ve kırmızı **Açılmadı** etiketi. `zaten` varsa altında
     soluk not: "Zaten yönetici olan N satır değiştirilmedi: a@…, b@…."
  5. Mavi **Dosyanın kuralları** kutusu: dosya yalnız hesap açar (var olan hesabı değiştirmez, dosyadan silinen
     yöneticiyi silmez); başka bir hesabın e-postası ya da kullanıcı adıyla yazılan satır yönetici yapılmaz; şifreyi
     dosyaya yazmak önerilir, boş bırakılırsa rastgele üretilir ve yalnız sunucu penceresine bir kez yazılır; dosyayı
     yalnız sunucu kullanıcısı okuyabilmeli (chmod 600); örnek `belge/admins.ornek.json`.
- **`EYLEMLER['yd-oku']`** (`el`: basılan düğme) — düğme "Okunuyor..." → `POST /api/admin/yonetici-dosyasi/oku` → cevap (aynı görünüm —
  içindeki `dosyaVar` artık bu okumanın — + `message`) ile sayfa baştan çizilir, en üste ileti: dosya yoksa sarı "data/admins.json dosyası yok.",
  okunamadıysa kırmızı "Dosya okunamadı: …", değilse yeşil "Dosya okundu: N yönetici açıldı, M satır atlandı." (6 sn).
  Hata (ağ, yetki) → düğme açılır, `#ydMesaj`'a kırmızı ileti.
- İç yardımcı `bilgi(etiket, deger)` — "etiket üstte soluk, değer altta" satırı (`deger` hazır HTML; çağıranlar `esc`
  eder).

## Kimle konuşur?

- **Sunucu uçları** ([../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md)):
  - `GET /api/admin/yonetici-dosyasi` → `yoneticiDosyasi.gorunum()` + `aralikDk` (site ayarı `adminsAralikDk`);
  - `POST /api/admin/yonetici-dosyasi/oku` → dosyayı hemen okur, işlem kaydına `yonetici.dosya-okundu` ("dosya yok",
    "dosya atlandı: …" ya da "N hesap açıldı, M satır atlandı" — "zaten yönetici" satırları atlanan sayılmaz), cevap aynı
    görünüm + `message`.
  - Okumanın kuralları, atlama nedenlerinin metinleri, "son okuma"nın tutulması, aralıkla yoklama, şifresiz özet
    (`sifresiz`) ve "dosya değişti mi" imzası (değişme zamanı + boyut): [../../../sunucu/yonetici-dosyasi.md](../../../sunucu/yonetici-dosyasi.md).
- **Çağırdıkları (ön yüz):** `api`, `esc`, `EYLEMLER` ([../parcalar/01-yardimcilar.md](../parcalar/01-yardimcilar.md)),
  `ik('belge' | 'onay' | 'uyari')`, `tarihSaat` ([../parcalar/02-ikonlar.md](../parcalar/02-ikonlar.md)), `mesajGoster`,
  `sayfaMesaji` ([../parcalar/03-mesaj-modal.md](../parcalar/03-mesaj-modal.md)), `dugmeBekle`, `dugmeBitir`
  ([../parcalar/05-giris.md](../parcalar/05-giris.md)), `hero`, `yaz` ([../parcalar/07-yonlendirme.md](../parcalar/07-yonlendirme.md)).
- **İlişkili ekranlar:** [09b-site-ayarlari.md](09b-site-ayarlari.md) — "admins.json okuma aralığı" ayarı; o kartta bu
  sayfaya **Yönetici Dosyası** geçişi var, bu sayfada da oraya **Aralığı değiştir**. [09a-yonetim-paneli.md](09a-yonetim-paneli.md)
  — menüde ve ana sayfa kutucuğunda "Yönetici Dosyası" (alt yazı "admins.json"). İşlem kaydı sayfası
  ([../parcalar/15-aktarim.md](../parcalar/15-aktarim.md)) "Şimdi oku" kayıtlarını gösterir.
- **Açılan yöneticinin ilk girişi:** dosyadan açılan hesap ilk girişte kendi şifresini belirler
  ([../parcalar/05b-sifre-zorunlu.md](../parcalar/05b-sifre-zorunlu.md)); yönetim çerezini ancak ondan sonra alır
  ([../../../sunucu/yonetim-cerezi.md](../../../sunucu/yonetim-cerezi.md)).
- **CSS:** `public/css/parcalar/36-ayar-kartlari.css` (`.ayar-kart`, başlık simgesi), `04-kartlar.css` (`.satir`,
  `.etiket` yeşil/gri/turuncu/kırmızı), `09-kayit-ekrani.css` (`.okul-bilgi`), `27-harita-ortak.css` (`.dugme-satir`).
- `araclar/gezinti.js` ekran turunda "Yönetici dosyası" ve "Şimdi oku" adımları var.
- **Rol:** yalnız sistem yöneticisi.

## Nasıl çalışır (adım adım)?

```
Sunucu açılışı ─► data/admins.json okunur (son okuma = açılış) ─► her "aralık" dakikada değişme zamanı + boyut yoklanır
                                                                   değiştiyse yeniden okunur (yeni satır → hesap)
Yönetici: Yönetici Dosyası ─► GET /api/admin/yonetici-dosyasi
   ─► yoneticiDosyasiCiz: dosya var/yok (şimdi) · son okuma · son değişiklik · aralık
                          okunmadan değişti mi? hata? uyarı?
                          açılan hesaplar (şifre üretildi mi) · atlanan satırlar (nedenler) · "zaten yönetici" notu
"Şimdi oku" ─► POST /api/admin/yonetici-dosyasi/oku ─► sunucu okur + işlem kaydı
   ─► sayfa yeniden çizilir ─► "Dosya okundu: 1 yönetici açıldı, 0 satır atlandı."
Açılan yönetici ─► /login (dosyadaki ya da üretilen şifre; üretilen şifre yalnız sunucu penceresinde)
   ─► kendi şifresini belirler ─► yönetim çerezi ─► /admin
```

## Dikkat!

- **Şifre asla bu ekrana gelmez.** Sunucu sonucu şifresiz özetler (`sifreUretildi` yalnız doğru/yanlış). Yeni bir alan
  eklerken bu kuralı bozma; üretilen şifreyi görmek için sunucu penceresine (ya da sunucu günlüğüne) bakılır, bir kez
  yazılır.
- **"Zaten yönetici" ayrımı metne bağlı.** Hangi satırların sorun sayılmayacağı nedenin `zaten yönetici` ile başlamasından
  anlaşılır (`/^zaten yönetici/`). Sunucudaki metin değişirse ("zaten yönetici (değiştirilmedi)") bu satırlar kırmızı
  "Açılmadı" olarak görünmeye başlar; sunucuda da aynı düzenli ifade iki yerde (işlem kaydı ve konsol) kullanılıyor.
  Daha sağlamı sunucunun ayrı bir alan (ör. `zaten: true`) göndermesi olurdu; kod değiştirilmedi.
- **Dosyanın şu anki hâli ile son okuma ayrı.** "Var/Yok" ve "son değişiklik" dosyanın şimdiki durumudur; açılan ve
  atlanan satırlar son okumanındır. Dosya son okumadan sonra değiştiyse sayfa çelişkili iki bilgiyi yan yana koymaz, sarı
  kutuyla "sonuçlar son okumaya ait" der.
- **Sayfa kendiliğinden yenilenmez.** Sunucu aralıkla okuyup hesap açsa da açık sayfa eski sonucu gösterir; yeniden açmak
  ya da "Şimdi oku" gerekir.
- **Uyarı sunucunun dosya yolunu gösterebilir.** `chmod 600` uyarısı dosyanın sunucudaki tam yolunu içerir; ekran
  yalnız yöneticiye açık olduğu için sorun sayılmadı.
- **E-postalar görünür.** Açılan ve atlanan satırlarda e-posta adresleri açık yazılır (yalnız yönetici görür); ekran
  görüntüsü paylaşılırken dikkat.
- **Dosya yalnız açar.** Var olan yöneticinin şifresini dosyadan değiştirmek ya da dosyadan silinen yöneticiyi kaldırmak
  bu yolla olmaz; dosya şifre sıfırlama yolu değildir (kurallar kutusu bunu söyler).
- `yd-oku` başarıda `dugmeBitir` çağırmaz: sayfa baştan çizildiği için düğme zaten yenisiyle değişir.
- Okuma aralığı bu sayfada yalnız gösterilir; değiştirmek Site Ayarları'nda.

## Testleri

- `testler/test-yonetici-dosyasi.js` — dosyadaki yöneticinin açılması ve ilk girişte şifre değiştirmesi; şifre yazılmadıysa
  üretilmesi; var olan yöneticiye dokunulmaması; başka hesabın e-postası/kullanıcı adının yönetici yapılmaması; zayıf
  şifre, bozuk e-posta, eksik ya da tek harfli ad, tekrarlanan satırın Türkçe nedenle atlanması; bozuk JSON'un sunucuyu
  düşürmemesi; kartın dosyanın var/yok hâlini ve son okumadan sonra değiştiğini söylemesi; işlem kaydı; "Şimdi oku" ile
  canlı okuma ve aralıkla kendiliğinden okuma; cevapta şifre olmaması.
- `testler/test-admin-gizli.js` — `yonetici-dosyasi` dizesi herkese giden `app.js`'te yok; uç yönetici olmayana 404.
- `testler/test-cakisma.js` — "admins.json" bölümü (sunucu modülünün `uygula`'sı doğrudan): büyük harfle ya da tam
  genişlikli karakterle yazılmış başka bir hesabın e-postası, bir okul hesabının kullanıcı adı ve Türkçe harfli e-posta
  yönetici yapılmıyor; nedenler bu ekranda görünecek metinler.
- `testler/buton-denetimi.js` (`yd-oku` ve `data-nav` karşılıkları), `testler/test-kucult.js`, `testler/yazim-denetimi.js`.
- Bu ekranı tarayıcıda çalıştıran otomatik test YOK (yalnız `araclar/gezinti.js` ekran turu adımları).
- Elle (yalnız test sunucusunda, gerçek `data/` klasörüne dokunmadan): test sunucusu `EE_DATA` ile ayrı bir veri
  klasöründe çalışır (`testler/tumtest.sh` geçici bir `testdata` klasörü verir). Oradaki
  `admins.json`'a geçerli bir satır (güçlü şifreli) ve şifresi kısa bir satır yaz → Yönetici Dosyası → sarı "son okumadan
  sonra değişti" → **Şimdi oku** → "1 yönetici açıldı, 1 satır atlandı"; açılan hesap "Şifre dosyadan", atlanan satırda
  "Şifre en az 8 karakter olmalı".

## Son durum

- `git log`: 1 commit. Dosya `276c0a0 commit 521` (2026-09-27, gizli yönetim paneli) ile doğdu (sunucudaki
  `yonetici-dosyasi.js`, `belge/admins.ornek.json` ve test paketiyle birlikte) ve o günden beri değişmedi.
- Açık iş yok; bilinen zayıf nokta "zaten yönetici" ayrımının metne bağlı olması (yukarıda).
- Planlı işlerden bu dosyaya dokunacaklar:
  - "Paneller" (iş 5): `data/destek.json` aynı kalıpla gelir (sunucu modülü genelleştirilir); panelde yalnız yöneticiye
    "Destek dosyası" kartı (son okuma, açılan/atlanan satırlar, Şimdi oku) — bu ekranın ortak hâle getirilmesi beklenir.
    Kullanıcının 29 Eylül kararıyla yönetici destek hesaplarını yönetir ve "Destekten çıkar" dosyadaki satırı da siler; aynı
    e-posta iki dosyadaysa yönetici sayılır.
  - "Sistem" (iş 4): bütün kurtarma kodları kaybolursa `data/admins.json` satırına `"totpSifirla": true` yazılarak
    doğrulama uygulaması bir kez sıfırlanır (işlem kaydı, e-posta bildirimi). Bu, "dosya yalnız hesap açar, var olan hesabı
    değiştirmez" kuralına bir istisna olacak; kurallar kutusu ve atlanan/uygulanan satır gösterimi buna göre değişmeli.
  - "Çok dil" (iş 22): metinler çeviri kataloğuna.
