# sunucu/bolumler/islem-kaydi.js

İşlem kaydı: "kim, ne zaman, ne yaptı" günlüğünü yazan ortak `islemYaz` işlevi, işlem türlerinin Türkçe adları
(`ISLEM_AD`) ve kaydı okuyan `GET /api/islem-kaydi` ucu.

## Bu dosya ne yapar?

Hesap açma ve silme, şifre sıfırlama, rol ve yetki değişiklikleri, toplu aktarım, yedekten dönme, okulun özelliklerinin
açılıp kapanması gibi geri alması zor işlemler kaydedilir. Kod yorumu: "Kim sildi?" sorusunun cevabı olmadan bir okul
sistemi güvenilir sayılmaz. Sıradan okuma istekleri kaydedilmez (tablo bir günde şişerdi).

Bölümler bir işlem yaptıktan sonra `islemYaz(me, 'etut.silindi', 'Matematik etüdü', req)` çağırır; bu dosya kaydı yazar
(kişinin adı ve rolü o anki hâliyle, IP adresi, okul). Okulun müdürü ya da `islem-kaydi.gor` yetkilisi kendi okulunun
kaydını, sistem yöneticisi bütün kayıtları görür.

## İçinde neler var?

### Dışa açılanlar

- `ISLEM_AD` — işlem anahtarı → ekrandaki ad; ör. `hesap.acildi` "Hesap açıldı", `rol.degistirildi` "Rol yetkileri
  değiştirildi", `yedek.geri-yuklendi` "Yedekten geri yüklendi", `okul.ozellik` "Okulun özellikleri değişti (bölüm
  açıldı ya da kapandı)", `etut.yoklama` "Etüt yoklaması alındı", `okul.disk-siniri` "Okulun disk sınırı değişti".
  Bugün 53 anahtar var; sistem yöneticisine ait olanlar (`yonetici.eklendi`, `yonetici.dosya-okundu`, `site.iletisim`,
  `site.yapimcilar`, `site.playstore`, `site.aralik`, `site.okul-disk-siniri`, `okul.adres-yonetici`,
  `okul.disk-siniri`) okulsuz yazılır. Listede olmayan anahtar ekranda anahtarın kendisiyle görünür. Bu nesneyi başka
  dosya kullanmıyor (grep).
- `islemYaz(kisi, islem, detay, req)` — kaydı yazar. `kisi` yetişkin (ana) hesapsa (`depo.kullanicilar.yetiskinMi`:
  rolsüz ya da veli ana hesabı) okulu `''` yapılır: kaydı yalnız sistem yöneticisi görür. Kod yorumu: yetişkinin hesabının
  okulu çocuğunun okuludur; o okulun yönetimi velinin kişisel işlemlerini (şifre, e-posta…) ve IP adresini görmemeli.
  IP `istemciIp(req)` ile alınır ([guvenlik.md](../guvenlik.md)); `req` verilmezse boş. Yazma hatası YUTULUR (günlüğe "İşlem kaydı
  yazılamadı: …"): kod yorumu, kayıt yazılamazsa asıl işlem bozulmasın.
- `uclar(k)` — aşağıdaki uç.

### Uç

- **`GET /api/islem-kaydi?islem=<anahtar>`** — `need()` (401/403). Yönetici (`admin`) bütün okulların ve okulsuz
  kayıtların hepsini görür; başkası `islem-kaydi.gor` yetkisi (müdür her zaman; "Müdür Yardımcısı" şablonunda var)
  olmadan 403 "İşlem kaydını görme yetkin yok", olunca yalnız kendi okulunun kayıtlarını. `islem` (40 harf) verilirse o
  türe süzülür. En yeni 300 kayıt. Cevap:
  `{ toplam, turler: [{ k, ad }], kayitlar: [{ id, tarih, kisi, rol, islem, islemAd, detay, ip }] }` — `toplam` süzgece
  uyan bütün kayıt sayısı; `turler` o okulun kaydında gerçekten geçen türler (son kullanılan önce; süzgeç kutusunu
  doldurmak için).

## Kimle konuşur?

- Çağırdıkları: `../guvenlik` (`istemciIp`); `../http` (`bad`, `ok`); `../ortak` (`clean`); `../veri` (`depo`);
  `../yetki` (`yetkiVarMi`).
- Depo ve tablo: `depo.genel.islemYaz` / `islemKayitlari` → `islem_kaydi` (şema 001; `okul_id`, `kullanici_id`,
  `kullanici_ad`, `kullanici_rol`, `islem`, `detay` (300 harfe kırpılır), `ip` (geçerli IP değilse boş), `tarih`);
  `depo.kullanicilar.yetiskinMi`.
- `islemYaz`'ı çağıranlar (grep): `bolumler/egitim-yili.js`, `etut.js`, `hesaplar.js`, `kayit.js`, `kisi-aktarim.js`,
  `kisilik.js`, `nakil.js`, `okul-disk.js`, `okul-hayati.js`, `okul-sayfasi.js`, `okul.js`, `ozellikler.js`,
  `site-ayarlari.js`, `yonetici-okul.js`, `yonetici.js`, `yorum.js`. `sunucu/yonetici-dosyasi.js` ise bu dosyayı değil,
  aynı adlı depo işlevini (`depo.genel.islemYaz(null, 'yonetici.eklendi', …)`) doğrudan çağırır: kişisiz ve IP'siz,
  okulsuz kayıt.
- Ucu çağıran: `sunucu/api.js` (`BOLUM['islem-kaydi']`).
- Ön yüz: `public/js/parcalar/15-aktarim.js` (okulun "İşlem Kaydı" ekranı); menü öğesi `06-menu.js`'te (yalnız
  `islem-kaydi.gor` yetkisi olana), `25-tiklama.js` ekrana geçişi yapar; yönetim panelinde menü öğesi
  `public/js/yonetim/09a-yonetim-paneli.js`.
- Android uygulaması çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
bölüm: ... işlem yapıldı ... islemYaz(me, 'rol.atandi', 'Ayşe Yılmaz: Etüt Sorumlusu', req)
  yetişkin ana hesap mı? -> okul = '' (yalnız yönetici görür)
  depo.genel.islemYaz: INSERT islem_kaydi ; toplam 5000'i aşan en eskiler silinir
  hata olursa günlüğe yaz, işlemi bozma

GET /api/islem-kaydi?islem=...
  admin -> okul süzgeci yok ; değilse islem-kaydi.gor + kendi okulu
  -> en yeni 300 + toplam + türler (Türkçe adlarıyla)
```

## Dikkat!

- **Üst sınır bütün sistem için 5000 kayıttır, okul başına değil** (`depo.genel.ISLEM_SINIR`; her yazışta en eskiler
  silinir). Çok okullu kurulumda hareketli bir okul, sakin bir okulun eski kayıtlarını da iter. Dosya başı yorumu yalnız
  "en fazla 5000 kayıt" diyor. "Optimizasyon + saklama süreleri" işinde okul başına sınır ya da süre düşünülmeli.
- Kayıt, kişinin adını ve rolünü YAZILDIĞI ANDAKİ hâliyle saklar; kişi silinse de kayıt kalır.
- IP adresi okul yönetimine gösterilir (yetişkinin kişisel işlemleri hariç, bkz. yukarıdaki okulsuz kural). IP geçerli
  değilse (`net.isIP`) boş yazılır.
- `ISLEM_AD`'da olup bugün hiçbir yerden yazılmayan anahtarlar var (grep): `giris.basarisiz`, `kisi.okula-eklendi`,
  `mudur.basvurdu` (adında "eski kayıt" yazar) ve `yedek.silindi`. Eski kayıtlar ekranda doğru adla görünsün diye
  duruyor olabilirler; silinirlerse eski kayıtlar ham anahtarla görünür.
- Yazma hatası yutulduğu için kayıt eksik kalabilir; bunu yalnız sunucu günlüğü söyler.
- Kayıt yalnız okunur: silme ya da düzeltme ucu yok.

## Testleri

- İşlem kaydını okuyan paketler: `testler/test-rol.js` (`?islem=okul.konum`), `test-yonetici-dosyasi.js`
  (`yonetici.eklendi`, `yonetici.dosya-okundu`), `test-site-ayarlari.js` (site ayarları okulsuz yazılır, müdür görmez),
  `test-okul-sayfasi.js`, `test-okul-disk.js`, `test-ozellikler.js`, `test-giris-bilgisi.js`, `test-servis-yoklama.js`
  (servis saatleri), `test-servis-konum.js` (servisçi bu uca giremez), `yetki-denetimi.js`.
- Elle: müdür hesabıyla (`testler/seed.js`) bir rol ata, sonra `GET /api/islem-kaydi?islem=rol.atandi`.

## Son durum

- Son commit `40fc7e7 commit 525` (2026-09-27): okul disk sınırı işi — `site.okul-disk-siniri` ve `okul.disk-siniri`
  adları eklendi.
- `276c0a0 commit 521` (2026-09-27): gizli yönetim paneli ve site ayarları — sistem yöneticisi anahtarları
  (`yonetici.*`, `site.*`, `okul.adres-yonetici`) ve "okulsuz yazılır" notu.
- `24050a2 commit 518` (2026-09-27): `servis.saatler`. `0acca75 commit 516` (kişi kodu işi): `mudur.basvurdu` adına
  "(eski kayıt)" eklendi (okul başvurusu kalktı), `ogretmen.eklendi` "kişi koduyla" oldu. `7a8b555 commit 504`:
  `okul.konum`.
- Açık iş: sistem geneli 5000 sınırı (yukarıda) ve kullanılmayan anahtarlar. Sıradaki planlı değişiklikler: "Optimizasyon
  + saklama süreleri" (saklama kuralları) ve "Sistem: …" işi (sistem durumu, yeni cihaz uyarısı gibi yeni işlem türleri).
