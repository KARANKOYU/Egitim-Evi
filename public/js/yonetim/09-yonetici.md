# public/js/yonetim/09-yonetici.js

Sistem yöneticisinin dört ekranı (Yedekleme, Müdürler, Okullar ile "Okul aç" penceresi, Yorumlar) ve bunların düğme
eylemleri; yalnız gizli yönetim paketinde (`/admin/yonetim.js`) bulunur.

## Bu dosya ne yapar?

Sistem yöneticisi bütün sitenin sahibidir: okulları açar, müdürlüğü verir, yedekleri yönetir, açılış sayfasındaki
yorumları denetler. Bu dosya onun dört ekranını taşır:

1. **Yedekleme** (`#/yedekler`) — sunucunun aldığı yedek kopyalarının listesi; elle yedek alma, indirme, geri yükleme,
   silme.
2. **Müdürler** (`#/mudurler`) — bütün müdür satırları, okulları ve okuldaki öğretmen/öğrenci sayıları; müdürlüğü
   kaldırma ("Hesabı sil").
3. **Okullar** (`#/okullar`) — kayıtlı okullar tablosu (dosya alanı doluluğu ve "Düzenle" ile), sistemin disk kartı ve
   **Okul aç** penceresi. Okulunu açtırmak isteyen kişi kendi yetişkin hesabını açar, hesabındaki "+ Ekle > Müdür"
   ekranında gördüğü **kişi kodunu** yöneticiye verir; yönetici okulu seçer, adresini yazar, kodu "Bul" ile doğrular,
   dosya alanını verir ve okulu açar. Müdür başvurusu diye bir şey yoktur.
4. **Yorumlar** (`#/yorumlar`) — açılış sayfasındaki 0–5 yıldızlı yorumların hepsi (gizliler dahil); tek tıkla gizle ya
   da yeniden göster.

Bu dosya herkese giden `/js/app.js`'e **girmez**. Sunucu onu yalnız geçerli yönetici çereziyle, `/admin/yonetim.js`
adresinden verir ([../../../sunucu/http.md](../../../sunucu/http.md) `yonetimJsOku` → `birlesikOku`): `public/js/parcalar/`
ile `public/js/yonetim/` parçaları **dosya adına göre tek sırada, tek IIFE içinde** birleşir. Bu yüzden bu dosya
`08d-okul-disk.js` ile `09a-yonetim-paneli.js` arasına düşer ve uygulamanın bütün işlevlerini (`api`, `yaz`, `modalAc`,
`SAYFALAR`, `EYLEMLER`…) doğrudan görür. Ekranları yalnız **sistem yöneticisi** görür; sunucudaki uçlar da yönetici
olmayana bilinmeyen adresle aynı 404'ü verir ([../../../sunucu/api.md](../../../sunucu/api.md) `yoneticiUcuMu`).

## İçinde neler var?

### Yedekleme

- **`SAYFALAR.yedekler`** — `GET /api/admin/backups` → `{ yedekler: [{ ad, boyut, tarih }], saklanan, klasor }`.
  Başlık "YEDEKLEME", alt yazı "Tüm veri tek dosyada tutuluyor. Günde bir kez otomatik kopya alınır." (bkz. Dikkat).
  - "Şimdi yedek al" kartı: "Son 14 kopya saklanır, eskiler kendiliğinden silinir." (`saklanan` sunucudan) ve
    **Yedek al** düğmesi (`data-act="yedek-al"`), altında ileti yeri `#yedekMesaj`.
  - Yedek yoksa boş kutu: "Henüz yedek yok. Sunucu açıldıktan kısa süre sonra ilki alınır."
  - Varsa "Yedekler (N)" kartı, en yeni üstte (sıralamayı sunucu yapar). Her satır: dosya adı, adı `yedek-elle-` ile
    başlıyorsa **elle**, `yedek-geri-alma-` ile başlıyorsa **geri alma** etiketi; alt satırda `tarihSaat(tarih)` ve
    `boyutYaz(boyut)` ("2,4 MB"); düğmeler **İndir** (`yedek-indir`), **Geri yükle** (`yedek-geri`), **Sil**
    (`yedek-sil`), üçünde de `data-ad="<dosya adı>"`. Satır `data-ara` ile üstteki arama kutusuna açık.
  - Altta mavi bilgi kutusu: geri yükleme her şeyi o ana döndürür; öncesi `yedek-geri-alma-…` adıyla saklanır.
- **`EYLEMLER['yedek-al']`** — düğmeyi kapatır, `POST /api/admin/backup-now` → `#yedekMesaj`'a yeşil "yedek-elle-… alındı
  (1,2 MB)", 0,9 sn sonra `git('yedekler')` (liste yeniden çizilir). Hata (sunucu 500 ve iletisi) → düğme açılır,
  kırmızı ileti.
- **`EYLEMLER['yedek-indir']`** — `dosyaIndir('/api/admin/backup-download?ad=…', ad)`
  ([../parcalar/03-mesaj-modal.md](../parcalar/03-mesaj-modal.md)): dosya `Authorization` başlığıyla çekilir, tarayıcıda
  bir `Blob`'a çevrilip aynı adla indirilir (oturum anahtarı adres satırına konmaz). Hata → `hataGoster` (tarayıcının
  uyarı kutusu).
- **`EYLEMLER['yedek-geri']`** — onay: "<ad> geri yüklensin mi? Bu yedekten sonraki bütün değişiklikler kaybolur. Şimdiki
  hâl geri-alma kopyası olarak saklanacak." Evet → `POST /api/admin/backup-restore { ad }` → `alert(message + …)`;
  cevapta `oturumKaldi` doğruysa sayfa yenilenir (`location.reload()`), değilse sitenin köküne gidilir
  (`location.replace('/')`; yöneticinin oturumu yüklenen veride yok demektir). Hata → düğme açılır, `hataGoster`.
- **`EYLEMLER['yedek-sil']`** — onay "<ad> silinsin mi?" → `POST /api/admin/backup-delete { ad }` → `git('yedekler')`;
  hata → `hataGoster`.

### Müdürler

- **`SAYFALAR.mudurler`** — `GET /api/admin/principals` → `{ principals: [{ id, fullName, username, email, status, city,
  district, schoolName, schoolStatus, teachers, students, createdAt }] }`. Başlık "MÜDÜRLER", alt yazı "N müdür hesabı
  kayıtlı."; boşsa "Henüz müdür hesabı yok.". Her satır: müdür simgesi + ad, kullanıcı adı · e-posta (varsa; yönetici tam
  adresi görür), "okul adı · il / ilçe", "N öğretmen · M öğrenci"; durum etiketi `approved` → yeşil **Etkin**, `pending` →
  turuncu **Giremiyor**, başka → kırmızı **Kapalı**; **Hesabı sil** düğmesi (`data-act="mudur-sil"`, `data-id`,
  `data-ad`, `data-okul`). `data-ara` = ad + okul + il.
- **`EYLEMLER['mudur-sil'](el, id)`** — onay: "<ad> hesabı silinsin mi? (<okul>) Okul kapanır, kimse giremez. Öğretmen
  ve öğrenci hesapları silinmez; Okullar > Okul aç ile okula yeni müdür atayabilirsin." → `POST
  /api/admin/principal-delete { userId: id }` → `git('mudurler')`. Sunucu müdür rol satırını siler ve okulu `pending`'e
  çeker (ayrıntı [../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md)); cevaptaki `{ silinen, okul }`
  kullanılmaz.

### Okullar

- **`SAYFALAR.okullar`** — `GET /api/admin/overview` → `{ stats, schools, disk }`. Önce okul listesini ve sistem disk
  bilgisini `ADMIN_OKULLAR.liste` / `ADMIN_OKULLAR.disk`'e koyar ([09d-okul-disk.md](09d-okul-disk.md); "Düzenle" penceresi
  ve "Okul aç"taki varsayılan sınır buradan okur). Sayfa:
  - başlık "KAYITLI OKULLAR", "N okul kayıtlı." (bütün okullar, kapalılar dahil);
  - "Okul aç" kartı: açıklama ("Okulunu açtırmak isteyen kişi kişi kodunu sana verir. Okulu seç, adresini yaz, müdürü
    koduyla bul, dosya alanını (disk sınırı) ver.") ve **Okul aç** düğmesi (`admin-okul-ac`);
  - `d.disk` varsa sistemin **Disk** kartı (`okulDiskSistemKarti`, 09d);
  - okul yoksa "Henüz okul yok."; varsa tablo (`table.t.okul-tablo`, dar ekranda `.tablo-sar` içinde yana kayar):
    **Okul**, **İl / İlçe**, **Müdür** (müdür yoksa `-`), **Öğretmen** (onaylı), **Öğrenci**, **Dosya alanı**
    (`okulDiskHucresi`: sıkışık doluluk çubuğu, altında "Özel sınır" ya da "Varsayılan"), **Durum** (`approved` →
    **Açık**, `pending` → **Müdür bekliyor**, başka → **Kapalı**) ve son sütunda **Düzenle** (`data-act="okul-ekrani"`,
    `data-id`, `aria-label="<okul> okulunu düzenle"`; pencere 09d'de). Satırın `data-ara`'sı ad + il + müdür;
  - en altta "Okulların giriş adreslerini Site Ayarları sayfasında değiştirebilirsin." ve **Site Ayarları**
    (`data-nav="site-ayarlari"`, [09b-site-ayarlari.md](09b-site-ayarlari.md)).

### "Okul aç" penceresi

- **`adminKisi`** — `{ kod: '' }`: "Bul" ile sahibi gösterilmiş kişi kodu (tiresiz). Okul yalnız bu kodla açılır; kod
  kutusu değişince boşalır.
- **`EYLEMLER['admin-okul-ac']`** — `adminKisi.kod`'u sıfırlar ve `modalAc('Okul aç', …)` açar. Pencerede sırayla:
  1. `okulSecimAlani()` ([../parcalar/08b-rolsuz.md](../parcalar/08b-rolsuz.md)): il `#bIl`, ilçe `#bIlce`, MEB
     listesinde arama `#bOkulAra` + tür `#bOkulTip` + sonuçlar, seçilen okul `seciliOkul`; açılır "Okul listede yok"
     bölümünde elle ad `#bOkulAd`.
  2. **Okulun adresi** `#aoKisa` (`maxlength 40`), önünde `<site>/school/` yazısı (`.adres-girdi`); ipucu "Küçük harf,
     rakam ve tire; 3–40 karakter. Okulu seçince adından önerilir."
  3. **Müdür** bölümü: açıklama (kişi kodu "+ Ekle > Müdür" ekranından gelir; adı ve e-postayı kişiyle karşılaştır),
     **Müdürün kişi kodu** `#aoKod` (`kisiKoduGirdisi`, [../parcalar/05-giris.md](../parcalar/05-giris.md): tire
     kendiliğinden gelir, en çok 19 karakter) ve **Bul** (`admin-kisi-bul`); sonuç yeri `#aoKisi`.
  4. **Dosya alanı** bölümü: açıklama (okulun teslim dosyaları, ekler, okul sayfası fotoğrafları bu sınıra sayılır;
     dolunca yeni yükleme durur; sonradan Okullar listesinde değişir), **Öğrenci sayısı (yaklaşık)** `#aoOgrenci`
     (sayı, "Bilmiyorsan boş bırak") ve `diskSiniriAlani('aoDisk', diskVarsayilanMb(), null)` (kutu `#aoDiskDeger`, birim
     `#aoDiskBirim` GB/MB, **Öneriyi kullan**, öneri satırı `#aoDiskOneri`; 09d).
  5. Hata yeri `#aoMesaj`; altta **Vazgeç** (`modal-kapat`) ve **Okulu aç** (`admin-okul-ac-kaydet`).

  Pencere açılınca bağlanan davranışlar:
  - `okulSecimiKur()` (08b) il listesini ve okul aramasını kurar.
  - Disk kutusu ya da birimi elle değiştirilirse `diskElle = true` olur.
  - Öğrenci sayısı yazıldıkça (1–6 hane): öneri satırı `diskOneriYazisi(n)` olur ("Öneri: 3,1 GB (320 öğrenci × 10 MB,
    en az 2 GB)."), **Öneriyi kullan** düğmesinin `data-ogrenci`'si güncellenir; kutu elle değiştirilmediyse öneriyi
    (`diskOneriMb(n)`, öğrenci yoksa varsayılanı) alır.
  - `#aoKisa`'ya odaklanınca ve kutu boşsa okulun adından adres önerilir: `aramaSadeTR(ad)` (Türkçe harfler düzlenir,
    noktalama boşluk olur), boşluklar tire, en çok 40 karakter, sondaki tire atılır ("Cumhuriyet Ortaokulu" →
    `cumhuriyet-ortaokulu`). Ad, seçilen MEB okulundan ya da elle yazılan addan.
  - `#aoKod` değişince önce bulunan kod artık tutmuyorsa `adminKisi.kod` ve `#aoKisi` boşalır; Enter "Bul"a basar.
- **`EYLEMLER['admin-kisi-bul']`** (`el`: basılan düğme) — kutunun hatasını ve `#aoKisi`'yi temizler, `adminKisi.kod`'u boşaltır;
  `kisiKoduDenetle` (boş → "Kişi kodunu yaz.", 16 karakter değil → "Kişi kodu 16 karakterdir.") hatası kutunun altına.
  Geçerliyse düğme "Aranıyor..." olur, `POST /api/admin/kisi-bul { kod }` → `{ ad, eposta (maskeli, "ay****@…"),
  kullaniciAdi, rolSayisi }` ([../../../sunucu/bolumler/yonetici-okul.md](../../../sunucu/bolumler/yonetici-okul.md)).
  Başarıda `adminKisi.kod = kod` ve kart: "Bu kodun sahibi", ad, "e-posta · kullanıcı adı · N okulda rolü var" ve ipucu
  "Adı ve e-postası okulunu açtırmak isteyen kişiyle uyuşuyorsa "Okulu aç"a bas." Hata (404 "Bu kodla bir hesap yok.",
  400 yönetici ya da okul hesabı, 429 çok deneme) kutunun altına.
- **`EYLEMLER['admin-okul-ac-kaydet']`** (`el`: basılan düğme) — penceredeki hataları siler ve gövdeyi kurar: `{ city: #bIl, district:
  #bIlce, kisaAd: #aoKisa (küçük harfe), mudurKodu: tiresiz kod }` + listeden seçildiyse `mebSchoolId`, değilse
  `schoolName` (`#bOkulAd`). İstemci denetimleri: okul yoksa `#bOkulAra` altına "Okulu listeden seç ya da "Okul listede
  yok" bölümüne adını yaz."; adres boşsa "Okulun adresini yaz."; kod biçimi (`kisiKoduDenetle(…, 'Müdürün kişi kodu')`);
  kod "Bul" ile bulunmamışsa "Önce "Bul" ile kodun kime ait olduğuna bak."; disk kutusu `diskSiniriOku('aoDisk')` (geçerliyse
  `diskMb`). Hata varsa ilk hatalı kutuya gider. Yoksa "Açılıyor..." → `POST /api/admin/okul-ac`. Cevap `{ okul: { id,
  ad, kisaAd, diskSiniriMb }, mudur: { ad, kullaniciAdi }, message }` → yeni pencere **Okul açıldı**: yeşil ileti,
  "Okulun adresi" (`location.host + /school/<kisaAd>`, **Kopyala** = `kod-kopyala`), "Müdür" (ad ve kişinin yetişkin
  hesabının kullanıcı adı; okulda açılan müdür satırının adı bundan farklı olabilir, çünkü sunucu o okulda boş bir ad
  seçer — `okuldaBosAd`), "Disk sınırı" (`diskYaz`; sınır boşsa varsayılan ve "(varsayılan)"), "Müdüre bildirim gitti; okuluna sol üstteki menüden
  geçer." ve **Tamam** (`admin-okul-bitti`). Sunucu hatasında `e.veri.alan` kutuya eşlenir: `okul` → `#bOkulAra`, `il` →
  `#bIl`, `ilce` → `#bIlce`, `kisaAd` → `#aoKisa`, `mudurKodu`/`kod` → `#aoKod` (bulunan kişi de silinir, yeniden "Bul"
  gerekir), `diskMb` → `#aoDiskDeger`; alan yoksa ileti `#aoMesaj`'a.
- **`EYLEMLER['admin-okul-bitti']`** — pencereyi kapatır, `git('okullar')` (yeni okul listede görünür).

### Yorumlar

- **`SAYFALAR.yorumlar`** — `GET /api/yorumlar/hepsi` → `{ yorumlar: [{ id, adKisa, rol, yildiz, metin, gizli, tarih }] }`
  ([../../../sunucu/bolumler/yorum.md](../../../sunucu/bolumler/yorum.md); son yazılan ya da düzeltilen 300 yorum,
  `guncelleme`ye göre yeniden eskiye; ekrandaki tarih de bu). Başlık "YORUMLAR", açıklama:
  uygunsuz kelimeler `badwordsfilter.json` ile zaten engellenir, geçeni buradan gizleyebilirsin. Boşsa "Henüz yorum
  yok.". Her satır: `avatar` (baş harfler), "Ay. Ka. · Öğretmen, veli" + `yildizCiz(yildiz)`, metin (satır sonları
  korunur), "tarih · gizli"; gizli yorum soluk satır (`.soluk-satir`). Düğme **Gizle** ya da **Göster**
  (`data-act="yorum-gizle"`, `data-id`, `data-gizli="1"` gizlemek / `"0"` göstermek için).
- **`EYLEMLER['yorum-gizle'](el, id)`** — `POST /api/yorumlar/gizle { id, gizli: true|false }` → `git('yorumlar')`;
  hata → `hataGoster`. Sunucu işlem kaydına yazar ve açılış sayfasının önbelleğini boşaltır.

### Eylem özeti

| `data-act` | Nerede | Ne yapar |
|---|---|---|
| `yedek-al` | Yedekleme | elle yedek (`POST /api/admin/backup-now`) |
| `yedek-indir` | Yedekleme satırı | `GET /api/admin/backup-download?ad=` (başlıklı indirme) |
| `yedek-geri` | Yedekleme satırı | onay → `POST /api/admin/backup-restore` → yenile ya da köke dön |
| `yedek-sil` | Yedekleme satırı | onay → `POST /api/admin/backup-delete` |
| `mudur-sil` | Müdürler satırı | onay → `POST /api/admin/principal-delete` |
| `admin-okul-ac` | Okullar | "Okul aç" penceresi |
| `admin-kisi-bul` | Okul aç | `POST /api/admin/kisi-bul` |
| `admin-okul-ac-kaydet` | Okul aç | `POST /api/admin/okul-ac` → "Okul açıldı" |
| `admin-okul-bitti` | Okul açıldı | kapat, Okullar'ı yeniden çiz |
| `yorum-gizle` | Yorumlar satırı | `POST /api/yorumlar/gizle` |

Bu dosyanın ürettiği ama başka yerde ele alınan eylemler: `okul-ekrani`, `disk-oneri-kullan` ([09d-okul-disk.md](09d-okul-disk.md)),
`modal-kapat`, `kod-kopyala` ([../parcalar/25-tiklama.md](../parcalar/25-tiklama.md)); `data-nav="site-ayarlari"` 09b'nin sayfasını açar.

## Kimle konuşur?

- **Birleşme ve sıra.** Yönetim paketinde ad sırası: `… 08c-kisilikler.js, 08d-okul-disk.js, 09-yonetici.js,
  09a-yonetim-paneli.js, 09b-site-ayarlari.js, 09c-yonetici-dosyasi.js, 09d-okul-disk.js, 10-mudur.js …`. Dosya
  yüklenirken çalışan satırlar (`SAYFALAR.x = …`, `EYLEMLER[...] = …`, `var adminKisi`) `SAYFALAR`'ın
  ([../parcalar/08-ana-sayfa.md](../parcalar/08-ana-sayfa.md)) ve `EYLEMLER`'in
  ([../parcalar/01-yardimcilar.md](../parcalar/01-yardimcilar.md)) önceden kurulmuş olmasına dayanır. 09d'deki
  `ADMIN_OKULLAR`, `OKUL_DISK_MB`, `disk…` adları bu dosyadan SONRA gelir ama yalnız sayfa çizilirken ve tıklamada
  kullanıldığı için sorun olmaz.
- **Çağırdıkları (ön yüz):**
  - [../parcalar/01-yardimcilar.md](../parcalar/01-yardimcilar.md) — `$`, `esc`, `api`, `boyutYaz`, `EYLEMLER`;
  - [../parcalar/02-ikonlar.md](../parcalar/02-ikonlar.md) — `ik('mudur')`, `avatar`, `tarihSaat`;
  - [../parcalar/03-mesaj-modal.md](../parcalar/03-mesaj-modal.md) — `mesajGoster`, `modalAc`, `modalKapat`, `dosyaIndir`;
  - [../parcalar/04a-form-alanlari.md](../parcalar/04a-form-alanlari.md) — `alanHatasi`, `alanTemizle`,
    `formHatalariniSil`, `ilkHatayaGit`;
  - [../parcalar/05-giris.md](../parcalar/05-giris.md) — `kisiKoduGirdisi`, `kisiKoduDenetle`, `kisiKoduSade`,
    `aramaSadeTR`, `dugmeBekle`, `dugmeBitir`;
  - [../parcalar/05a-dis-sayfalar.md](../parcalar/05a-dis-sayfalar.md) — `okulYolu`, `yildizCiz`;
  - [../parcalar/07-yonlendirme.md](../parcalar/07-yonlendirme.md) — `hero`, `yaz`, `bosKutu`, `git`;
  - [../parcalar/08b-rolsuz.md](../parcalar/08b-rolsuz.md) — `okulSecimAlani`, `okulSecimiKur`, `seciliOkul`;
  - [../parcalar/08d-okul-disk.md](../parcalar/08d-okul-disk.md) — `diskYaz`;
  - [09d-okul-disk.md](09d-okul-disk.md) — `ADMIN_OKULLAR`, `OKUL_DISK_MB`, `okulDiskSistemKarti`, `okulDiskHucresi`,
    `diskSiniriAlani`, `diskSiniriOku`, `diskSiniriYaz`, `diskVarsayilanMb`, `diskOneriMb`, `diskOneriYazisi`;
  - [../parcalar/25-tiklama.md](../parcalar/25-tiklama.md) — `hataGoster`; tıklamayı `EYLEMLER[act](el, data-id)` diye
    buraya yönlendiren `islem`.
- **Sunucu uçları:**
  - [../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md) — `GET backups`, `POST backup-now`,
    `GET backup-download`, `POST backup-restore`, `POST backup-delete`, `GET principals`, `POST principal-delete`,
    `GET overview` (hepsi `/api/admin/…`); yedek dosyalarının kendisi
    [../../../sunucu/veri/yedek.md](../../../sunucu/veri/yedek.md) (`data/yedek/`, 14 kopya, günlük otomatik, geri almadan önce
    `yedek-geri-alma-…`).
  - [../../../sunucu/bolumler/yonetici-okul.md](../../../sunucu/bolumler/yonetici-okul.md) — `POST /api/admin/kisi-bul`,
    `POST /api/admin/okul-ac` (adres kuralı, sahipsiz okulun yeniden açılması, kodun yenilenmesi, bildirim, işlem kaydı).
  - [../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md) — `overview`'daki okul ve sistem
    `disk` alanları, `okul-ac`'taki `diskMb` kuralı.
  - [../../../sunucu/bolumler/yorum.md](../../../sunucu/bolumler/yorum.md) — `GET /api/yorumlar/hepsi`,
    `POST /api/yorumlar/gizle` (bunlar `/api/admin` altında değil ama aynı gizlilik kapısından geçer).
  - MEB okul listesi ve il/ilçe: `GET /api/okullar/iller` ve okul araması `GET /api/okullar/ara` — 08b üzerinden. Uçlar
    [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)'de (herkese açık okul uçları), okul listesinin
    kendisi ve araması [../../../sunucu/okullar.md](../../../sunucu/okullar.md)'de.
- **Onu kullananlar:**
  - [09a-yonetim-paneli.md](09a-yonetim-paneli.md) — yöneticinin menüsü (Müdürler, Okullar, Yorumlar, Yedekleme) ve ana
    sayfa kutucukları (Okullar, Müdürler, Yedekleme) bu dosyadaki sayfaları açar.
  - [09b-site-ayarlari.md](09b-site-ayarlari.md) — "Varsayılan okul disk sınırı" kartındaki **Okullar** düğmesi
    (`data-nav="okullar"`); [09d-okul-disk.md](09d-okul-disk.md) — `okul-disk-kaydet` bittikten sonra `git('okullar')`.
  - `araclar/gezinti.js` (ekran turu) — Müdürler, Okullar, "Okul aç" penceresi (okul seçme, adres önerisi, kodla kişi
    bulma), Yedekler (elle yedek), Yorumlar adımları.
- **CSS:** `public/css/parcalar/04-kartlar.css` (`.kart`, `.satir`, `.buyu`, `.ad`, `.alt`, `.etiket` renkleri,
  `.stat`), `05-tablo-grafik.css` (`.tablo-sar`, `table.t`), `36-ayar-kartlari.css` (`.okul-tablo`, `.yonetim-gecis`,
  doluluk çubuğu renkleri, `.sikisik`, `.disk-siniri`), `27-harita-ortak.css` (`.adres-girdi`, `.ayrac-cizgi`,
  `.alt-baslik`, `.dugme-satir`), `09-kayit-ekrani.css` (`.rolsuz-satir`: kod kutusu ve "Bul" yan yana),
  `32-tarih-secici.css` (`.gizli-etiket`: "Düzenle" sütun başlığı yalnız ekran okuyucuya), `22-cesitli.css`
  (`.soluk-satir`). `.ao-kisi` ve `.disk-hucre` için ayrı kural yok.
- **Rol:** yalnız sistem yöneticisi (`admin`). Destek ekibi bugün yok (planlı).
- **Android** uygulaması bu ekranları ve uçları kullanmaz.

## Nasıl çalışır (adım adım)?

### Okul açma

```
Okullar ─► "Okul aç" ─► admin-okul-ac: adminKisi.kod = ''; modalAc(okulSecimAlani + adres + kod + dosya alanı)
   okulSecimiKur() ─► GET /api/okullar/iller ; yazdıkça okul araması
   okul seçildi ─► #aoKisa'ya gelince "cumhuriyet-ortaokulu" önerisi
   öğrenci sayısı 320 ─► öneri satırı "3,1 GB", kutu 3200 MB (yalnız kutu elle değiştirilmediyse)
   kod yazıldı ─► "Bul" ─► POST /api/admin/kisi-bul ─► "Bu kodun sahibi: Ayşe Kaya · ay****@ornek.org · ayse.k"
                                                       adminKisi.kod = kod
"Okulu aç" ─► istemci denetimi (okul, adres, kod = bulunan kod, disk 1 MB–10 TB)
   ─► POST /api/admin/okul-ac { city, district, mebSchoolId | schoolName, kisaAd, mudurKodu, diskMb }
        sunucu: adres kuralı, aynı okul / sahipsiz okul, kodun sahibi, kodu harca + okul + müdür rol satırı (tek işlem),
                işlem kaydı, kişiye bildirim
   ─► "Okul açıldı" (adres + Kopyala, müdür, disk sınırı) ─► Tamam ─► git('okullar')
   hata ─► e.veri.alan ─► ilgili kutunun altında kırmızı yazı
```

### Yedekten geri yükleme

```
"Geri yükle" ─► confirm ─► POST /api/admin/backup-restore { ad }
   sunucu: şimdiki veri → yedek-geri-alma-… ; seçilen yedek tek işlemde içe aktarılır
   ─► alert(message)
        oturumKaldi ─► location.reload()      (yönetim çerezi de yüklenen veride var)
        değilse     ─► location.replace('/')  (oturum yok: yeniden giriş)
```

### Müdürlüğü kaldırma

```
Müdürler ─► "Hesabı sil" ─► confirm ─► POST /api/admin/principal-delete { userId }
   sunucu: okul → pending ("Müdür bekliyor"), müdür rol satırı silinir (kişinin yetişkin hesabı durur)
   ─► git('mudurler') ; okul Okullar'da "Müdür bekliyor" ─► yeniden "Okul aç" ile aynı okul, aynı adresle yeni müdür
```

## Dikkat!

- **Yedekleme sayfasının alt yazısı bayat.** "Tüm veri tek dosyada tutuluyor." veri JSON dosyasındayken doğruydu; bugün
  veri PostgreSQL'de, yalnız her yedek tek bir JSON dosyasıdır ([../../../sunucu/veri/yedek.md](../../../sunucu/veri/yedek.md)).
  Metin değiştirilmedi.
- **"Okul aç" penceresinden açılan her okul ÖZEL sınır alır.** Pencerede "varsayılanı kullan" seçeneği yok: disk kutusu
  varsayılan değerle dolu gelir ve kaydederken geçerli her değer `diskMb` olarak gönderilir (geçersizse pencere hiç
  gönderilmez). Sunucu da verilen değeri okulun kendi sınırı yapar. Sonuç: okul tabloda "Özel sınır" görünür, Site
  Ayarları'nda varsayılan sonradan değişse bu okulun sınırı değişmez, "Okul açıldı" penceresindeki "(varsayılan)" eki bu
  yoldan hiç görünmez. Varsayılana bağlamak için sonradan **Düzenle** > "Varsayılan sınırı kullan" gerekir. Kod okumasına
  göre; tarayıcıda denenmedi. KILAVUZ'daki "yazılmazsa öneri varsayılan sınırdır" cümlesi değerin kendisi için doğru,
  okulun varsayılanı izlemesi için değil.
- **"Okul kapanır, kimse giremez" her giriş yolu için doğru görünmüyor.** Müdür kaldırılınca okul `pending` olur: okulun
  `/school/<ad>` adresi açılmaz (sunucu yalnız onaylı okulu bulur) ve yetişkinlerin okula portal geçişi kapanır. Ama okul
  seçmeden `/login`'den kullanıcı adıyla girişte okulun durumuna bakan bir denetim yok: `girisKimligiyle` okul
  hesaplarını yalnız rol ve kullanıcı adıyla arar, `api.js`'teki `need` de yalnız hesabın kendi durumuna bakar; okulun
  `pending` olması hiçbir yerde sorulmuyor. Bu yüzden kullanıcı adı yalnız o okulda olan öğrenci ya da servisçi bu yoldan
  girip okulun uçlarını kullanabilir gibi görünüyor. Kod okumasına göre (iki ayrı okumada aynı sonuç), tarayıcıda
  denenmedi; ileti ve sunucudaki "kimse giremesin" yorumu buna göre gözden geçirilmeli. Ayrıca bu işlem işlem kaydına
  yazılmaz ve kişiye bildirim gitmez.
- **"Hesabı sil" adı tam doğru değil.** Bugünkü düzende müdür, kişinin yetişkin hesabına bağlı bir rol satırıdır:
  sunucu yalnız o satırı siler, kişinin kendi hesabı ve öteki rolleri durur (yalnız müdürlüğü kalkar). Sunucu satırın
  türüne bakmadığı için eski düzenden kalmış, yetişkin hesabına bağlı OLMAYAN bir müdür hesabında hesabın kendisi silinir
  ([../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md) `principal-delete`).
- **Eski düzenden kalan etiketler.** Müdür satırındaki **Giremiyor** (`pending`) ve okul satırındaki **Müdür bekliyor**
  eski "müdür başvurur → yönetici onaylar" düzeninin kalıntısı. Planlı "Paneller" işi bunları "Müdürü yok" + "Müdür ata"
  yapacak; "bekliyor", "onay", "Giremiyor" sözleri müdür ve okul için kalmayacak.
- **Sayılar iki ekranda farklı sayılabilir.** Müdürler sayfasındaki "N öğretmen" okulun bütün öğretmen satırlarını,
  Okullar tablosundaki yalnız onaylıları sayar. Ana sayfa kutucuğundaki "N okul kayıtlı" yalnız onaylı (açık) okulları,
  Okullar başlığındaki "N okul kayıtlı." bütün okulları sayar.
- **Geri yüklemeden sonra oturum yalnız bellekteyse.** Girişte "hiçbir şey kaydetme" seçildiyse anahtar tarayıcıda
  saklanmaz: `location.reload()` de oturumu düşürür (yeniden giriş kartı), `location.replace('/')` ise giriş kartını
  değil açılış sayfasını açar; uyarıdaki "Giriş sayfası açılacak." o durumda tam tutmaz. Kod okumasına göre.
- **Yedek indirme bütün dosyayı tarayıcı belleğine alır** (`dosyaIndir` → `Blob`); ilerleme göstergesi yok. Yedekler
  büyüdükçe (çok okullu sunucu) yavaşlar; planlı "Optimizasyon" işi yedeği `.tar.gz` yapacak.
- **Silme ve geri yükleme düğmeleri.** `yedek-sil` düğmeyi kapatmaz (iki hızlı tıklamada ikincisi "Yedek bulunamadı"
  uyarısı verir); `backup-now` ve `backup-delete` sunucuda işlem kaydına yazılmaz. Geri yükleme bütün veriyi değiştirir;
  önce sunucu kendiliğinden `yedek-geri-alma-…` alır, yanlış yedek yüklenirse o dosya geri yüklenerek dönülür. Ama o
  kopya yazılamazsa (disk dolu, izin) sunucu bunu "kritik değil" sayıp geri yüklemeyi YİNE yapar
  ([../../../sunucu/veri/yedek.md](../../../sunucu/veri/yedek.md) `yedekGeriYukle`); onay penceresindeki "Şimdiki hâl
  geri-alma kopyası olarak saklanacak." sözü o durumda tutmaz ve ekran bunu bilmez.
- **14 kopyaya her tür sayılır.** "Son 14 kopya saklanır" sınırına elle alınanlar ve geri-alma kopyaları da girer
  (`yedekTemizle` yazılma anına göre en yeni 14'ü bırakır). Arka arkaya elle yedek alan otomatik yedekleri, sonraki
  yedekler de eski geri-alma kopyasını sildirebilir.
- **Adres kutusunun istemcide yalnız boş olup olmadığına bakılır.** "Okul aç"ta biçim (küçük harf, tire, 3–40, yasak adlar) sunucuda
  denetlenir ve hata `kisaAd` alanıyla kutunun altına gelir; gönderirken yalnız küçük harfe çevrilir. Site Ayarları'ndaki
  adres penceresi ise yazarken düzeltir ve istemcide de denetler (`okulAdresiSorunuTR`). Ayrıca `.adres-girdi` içindeki
  kutunun kendi çerçevesi yok (`27-harita-ortak.css`): hata olunca kırmızı çerçeve görünmez, yalnız alttaki yazı çıkar
  (aynı durum [../parcalar/16b-okul-ayarlari.md](../parcalar/16b-okul-ayarlari.md)'de not edildi).
- **"Bul" zorunlu.** Okul yalnız "Bul" ile sahibi gösterilmiş kodla açılır (`adminKisi.kod`). Kod değişirse, sunucu kod
  hatası dönerse ya da pencere yeniden açılırsa "Bul" baştan gerekir. Kod tek kullanımlıktır: okul açılınca kişinin kodu
  yenilenir. Sunucuda iki hız sınırı var ([../../../sunucu/bolumler/yonetici-okul.md](../../../sunucu/bolumler/yonetici-okul.md)
  `kodunSahibi`): aynı bağlantıdan (IP) saatte en çok 30 YANLIŞ kod — "Bul" ile "Okulu aç" birlikte sayılır, aşılınca
  429 "Çok fazla yanlış kod denendi. Bir saat sonra tekrar dene."; ayrıca "Bul" yönetici başına dakikada 30 istek (doğru
  kod da sayılır), aşılınca 429 "Çok fazla deneme. Biraz bekle." İkisi de kutunun altında görünür.
- **Sunucunun `mudurKodu` hatalarında da "Bul" baştan gerekir.** Kişinin o okulda zaten bir rolü varsa ya da 10 okulda rolü
  varsa hata kod kutusuna gelir ve bulunan kişi silinir; kod doğru olsa da yeniden "Bul"a basmak gerekir.
- **"Okul açıldı" penceresi perdeye tıklanarak kapatılırsa** `admin-okul-bitti` çalışmaz, Okullar listesi yenilenmez; yeni
  okul ancak sayfa yenilenince görünür.
- **Okul türü seçicisi bugün boş.** "Okul aç"taki "Tüm türler" listesi `/api/okullar/iller`'in `tipler`'inden dolar;
  sunucudaki bilinen hata yüzünden bu liste hep boş gelir
  ([../parcalar/08b-rolsuz.md](../parcalar/08b-rolsuz.md) Dikkat; düzeltmesi "Güvenlik denetimi" işinde).
- **Liste işlemleri sayfayı baştan çizer.** `yorum-gizle`, `mudur-sil`, `yedek-sil` sonrası `git(...)` çağrılır: arama
  kutusu boşalır, sayfa en üste döner. Çok yorumu tek tek gizleyen için yorucu olabilir.
- **Yorumlar son güncellenen 300 ile sınırlı** (sunucu, `guncelleme` sırası); sayfa bunu söylemez, sayfalama yok.
- **Gizlilik:** bu dosyadaki uç adları ve `/admin` sözü herkese giden `app.js`'te olmamalı; buraya yazılan her yeni
  yönetici ekranı bu klasörde kalmalı (`testler/test-admin-gizli.js` denetler). Aynı IIFE'de olduğu için burada
  tanımlanan bir işlev uygulama parçalarındaki aynı adlı işlevi sessizce ezer; `test-kucult.js` yalnız dosya adlarının
  çakışmasına bakar, işlev adlarına bakmaz. Yeni ad seçerken `grep` ile dene.
- Sunucudan gelen her metin `esc` ile basılır; `yildizCiz` ve `ik` güvenli HTML üretir. Müdürler sayfası yöneticiye tam
  e-postayı gösterir; "Bul" sonucu ise maskeli e-posta verir (yalnız karşılaştırmak için).

## Testleri

- `testler/buton-denetimi.js` (sunucusuz, `tumtest.sh` sonunda) — yönetim parçalarını uygulama parçalarıyla aynı sırada
  birleştirir: bu dosyadaki her `data-act`'ın bir `EYLEMLER` karşılığı, her `data-nav`'ın bir sayfası var mı.
- `testler/test-kucult.js` — yönetim paketi (`parcalar/` + `yonetim/`) yorumları silinmiş hâliyle derleniyor mu, iki
  klasörde aynı adlı dosya var mı.
- `testler/yazim-denetimi.js` — bu dosyadaki kullanıcıya görünen metinlerde yaygın yazım hataları.
- `testler/test-admin-gizli.js` — `/admin/yonetim.js` yalnız geçerli çerezle iniyor, derleniyor, `no-store`; çerezsiz
  `/js/yonetim/09-yonetici.js` bilinmeyen adresle aynı 404; herkese giden `app.js`'te `/admin`, `yorumlar/hepsi`,
  `yorumlar/gizle`, `backup-restore` gibi yönetim dizeleri yok.
- Sunucu tarafı (bu ekranların uçları): `testler/test-yedek.js` (liste, elle yedek, indirme, geri yükleme, `oturumKaldi`,
  silme), `testler/test-yonetim.js` (müdür listesi, okul açma), `testler/test-kisi-kodu.js` (kişi bulma, maskeli e-posta,
  hız sınırı, okul açınca kodun yenilenmesi, yönetici/okul hesabına müdürlük verilememesi), `testler/test-okul-disk.js`
  (okul açarken `diskMb`, `overview`'daki disk alanları), `testler/test-etut.js` (müdürü kaldırılan okulun yeniden
  açılması), `testler/test-yorum-ek.js` (`yorumlar/hepsi` ve `gizle`), `testler/test-cakisma.js` (aynı anda okul açma),
  `testler/yetki-denetimi.js`, `testler/girdi-denetimi.js`.
- Bu dosyanın ekranını tarayıcıda çalıştıran otomatik test YOK; `araclar/gezinti.js` ekran turunda adımları var (tur
  çalıştırılmadan bir şey denetlemez).
- Elle: `testler/seed.js`'teki yönetici hesabıyla `/login`'den gir → kendiliğinden `/admin`. Okullar → **Okul aç**: il seç,
  okul ara ve seç, adres kutusuna gel (öneri), bir yetişkin hesabının "+ Ekle > Müdür"deki kodunu yaz → **Bul** → kişi
  kartı; öğrenci sayısı 320 yaz (öneri satırı "3,1 GB", kutu 3200 MB: GB'a iki ondalıkla tam çevrilmediği için MB kalır) →
  **Okulu aç** → "Okul açıldı". Yedekleme →
  **Yedek al** → listede "elle" etiketli satır; **İndir** dosyayı indirmeli. Yorumlar → **Gizle** → satır soluklaşır,
  açılış sayfasında yorum görünmez.

## Son durum

- `git log --follow`: 8 commit. Dosya `37c286d commit 43` (2026-08-28) ile `public/js/parcalar/09-yonetici.js` olarak
  doğdu; sonra `282c495 commit 44` (2026-08-28), `7e8cf07 commit 174` (2026-09-08), `b0bd2bf commit 193` (2026-09-25),
  `e038265 commit 412` (2026-09-26).
- `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): müdür başvurusu kalktı — "Onay bekleyen başvurular" sayfası
  (`SAYFALAR.onaylar`) ve şifre üretici (`admin-sifre-uret`) silindi; "Okul aç" penceresi e-posta/ad/şifre alanları
  yerine kişi kodu + **Bul** (`adminKisi`, `admin-kisi-bul`) oldu; adres önü `/school/`; durum etiketleri "Onaylı /
  Beklemede / Reddedildi" yerine "Etkin / Giremiyor / Kapalı" ve okulda "Açık / Müdür bekliyor / Kapalı".
- `276c0a0 commit 521` (2026-09-27, gizli yönetim paneli): dosya `public/js/yonetim/`'e taşındı (artık herkese giden
  `app.js`'te yok); yedek ve müdür eylemleri (`yedek-al`, `yedek-indir`, `yedek-geri`, `yedek-sil`, `mudur-sil`) ortak
  tıklama dosyasından buraya `EYLEMLER` olarak geldi; `boyutYaz` ortak yardımcılara gitti; geri yüklemede `oturumKaldi`'ye
  göre yenileme ya da köke dönüş; Okullar'a "Site Ayarları" geçişi; sunucunun `kod` alanı da kod kutusuna eşlendi.
- `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): Okullar sayfası `ADMIN_OKULLAR`'ı doldurur, sistemin Disk kartını
  gösterir; tabloya **Dosya alanı** sütunu ve **Düzenle** düğmesi geldi (sayılar da `esc`'li); "Okul aç"a **Dosya alanı**
  bölümü (öğrenci sayısı, öneri, sınır kutusu), gövdeye `diskMb`, sonuç penceresine "Disk sınırı", hata eşlemesine
  `diskMb`.
- Bilinen açıklar (kod değiştirilmedi): bayat "tek dosyada" yazısı, okul açarken hep özel sınır verilmesi, "kimse
  giremez" iletisinin okulsuz girişte tutmaması (okulun durumuna bakılmıyor), eski "Giremiyor / Müdür bekliyor" etiketleri, adres kutusunda
  görünmeyen kırmızı çerçeve, perdeyle kapatılan "Okul açıldı"dan sonra listenin yenilenmemesi, geri-alma kopyası
  yazılamasa da geri yüklemenin sürmesi (ekran haber vermez), "Hesabı sil" adının bugün yalnız müdürlüğü kaldırması.
- Planlı işlerden bu dosyaya dokunacaklar:
  - "Paneller" (iş 5): adres `/panel/admin` olur; Okullar tablosunun yerine okul gezgini (boş masaüstü + serbest ızgara,
    klasörler, simgenin altında açılış tarihi ve boyut); "Okul aç" penceresinin yerine tam sayfa `/duzenle/okul/yeni`
    (birden çok müdür, "Sınırlar": disk sınırı + okul yedeği sınırı); müdür çıkarma kuralları (son müdür çıkarılamaz,
    ortak karar); "Müdürü yok" + "Müdür ata" etiketleri; destek ekibi aynı ekranların bir kısmını görür.
  - "Optimizasyon + saklama süreleri" (iş 7): günlük yedek `.tar.gz` (en yeni 7 otomatik + elle alınanlar; eski `.json`
    yedekler de geri yüklenebilir) — Yedekleme sayfası buna göre değişecek.
  - "Yıl geçişi" (iş 9): önemli işlerde çift doğrulama (yöneticinin hesap silmesi dahil) — "Hesabı sil" ondan geçecek.
  - "Kullanıcı arama" (iş 6): `/users/<ad>` sayfasında kişinin yorumları ve hesap işlemleri.
  - "Güvenlik denetimi" (iş 3): `tipler` hatası düzelince "Okul aç"taki tür seçicisi dolacak.
  - "Çok dil" (iş 22): bu ekranların metinleri çeviri kataloğuna (`c()`) girecek. "Ekran turu" (iş 12) bu ekranları
    yeniden çekecek.
