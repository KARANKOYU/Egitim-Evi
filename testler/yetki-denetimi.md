# testler/yetki-denetimi.js

89 uç satırını (84 ayrı uç; beşi başka bir öğrenci ya da kayıtla ikinci kez denenir) yedi kimlikle (müdür, öğretmen,
öğrenci, veli, yönetici, servisçi, giriş yapmamış) tek tek deneyip izni olmadığı hâlde geçen (200/201) var mı diye bakan;
ayrıca yalnız yöneticiye ait 12 ucun yönetici olmayana bilinmeyen bir adresle birebir aynı 404'ü verdiğini doğrulayan
sunuculu denetim (toplam 695 kontrol).

## Bu dosya ne yapar?

Eğitim Evi'nde "kim neyi yapabilir" kuralı tek bir yerde değil, birkaç katmanda durur: rol kapısı (bölümlerdeki `need([...])`),
yetki (`yetkiVarMi(me, 'odev.ver')`, [../sunucu/yetki.md](../sunucu/yetki.md)), kapsam (aynı okul, kendi sınıfı, kendi
çocuğu; [../sunucu/iliskiler.md](../sunucu/iliskiler.md)) ve yönetici uçlarını gizleyen yönlendirici kapısı
([../sunucu/api.md](../sunucu/api.md)). Yeni bir uç eklenirken ya da bir kapı değiştirilirken biri unutulursa "403 dönmesi
gereken yerde 200 dönen" bir uç doğar; bu bir güvenlik açığıdır ve kimse fark etmeyebilir.

Bu dosya bir **yetki matrisi** kurar: her uç için "hangi roller izinli" listesini yazar, sonra her ucu yedi kimlikle sırayla
çağırır. İzinli olmayan bir kimlik 200/201 alırsa bu bir **GÜVENLİK AÇIĞI**dır: sayılır, listelenir, çıkış kodu 1 olur. İzinli
bir kimlik engellenirse bu yalnız bir **ENGEL** uyarısıdır (iş akışını bozar ama güvenlik açığı değildir); sonucu etkilemez.

İkinci bölüm yönetici uçlarının gizliliğini sınar: yönetici olmayan biri (giriş yapmamış tarayıcı dahil) `/api/admin/...`
ya da `/api/yorumlar/hepsi`'yi çağırdığında, var olmayan bir adresi (`/api/boyle-bir-uc-yok-denetim`) çağırmış gibi **aynı
durum kodunu ve aynı gövdeyi** (404 `{"error":"Böyle bir adres yok"}`) almalı; 401 ya da 403 değil. Dışarıdan bakan, yönetici
uçlarının var olduğunu bile anlayamamalı.

`testler/tumtest.sh` onu denetimler döngüsünün ilki olarak çalıştırır: sunucu yeniden açılır (`_test` veritabanı sıfırlanır),
[seed.md](seed.md) çalışır, sonra bu dosya. Çıktıda `GUVENLIK ACIGI (` ya da `KALDI  ` varsa, ya da denetim sırasında sunucu
günlüğüne `API hatası`/`Veritabanı hatası` düştüyse "DENETIM SORUNU" sayılır.

## İçinde neler var?

### `bekleniyor(ad, cevap, izinliMi)`

Her kontrolün yargıcı. Durum 200 ya da 201 ise "geçti" sayar. İzinli değilken geçtiyse `sorun`'u artırır ve `ACIK` bulgusu
ekler (gövdenin ilk 110 karakteriyle); izinliyken geçmediyse `ENGEL` bulgusu ekler (sunucunun `error`'uyla).

### Kimlikler

| Ad | Kim | Nasıl |
|---|---|---|
| `mudur` (`M`) | Mehmet Demir | seed, `mudur@test.com` |
| `ogretmen` (`O`) | Ayşe Kaya, Matematik, 6-A | seed, `mat@test.com` |
| `ogrenci` (`S`) | Zeynep Şahin | seed, `ogrenci1@test.com` |
| `veli` (`V`) | "Denetim Veli" | burada kaydolur (`veli-denetim@test.com`), e-posta onayı, giriş; **ilk öğrencinin** (`o1`) veli koduyla çocuk bağlar |
| `admin` (`A`) | sistem yöneticisi | seed'in kullandığı `admin@egitimevi.com` |
| `servisci` (`SV`) | "Denetim Servisci" (`denetim.servisci`) | okulun açtığı servisçi hesabı (`okulHesabi`), hiçbir servise atanmamış |
| `yok` | giriş yapmamış | anahtar gönderilmez |

`o1` okulun öğrenci listesinin ilkidir; liste ada göre sıralı olduğu için bugün **Burak Öztürk** (`ogrenci2`). `o2` öbürü,
yani giriş yapan öğrenci Zeynep Şahin. Velinin "kendi çocuğu" `o1`, "başkasının verisi" denemeleri `o2` üzerinden yapılır.

### Hazırlık

- `DENETIM` sınıfı (öğrenci yerleştirme ucu için hedef).
- Velinin kişi kodu `vKod` (müdürün "kişi koduyla öğretmen bul"u ve yöneticinin "kişi bul"u bununla denenir).
- `DENETIM-GB` sınıfı ve içinde "Dagitim Denetim" öğrencisi: toplu giriş bilgisi ucu yalnız bu sınıfın şifrelerini yeniler,
  denetimde kullanılan hesapların oturumu düşmesin diye (dosyadaki yorum).
- "Denetim ödevi" (`o1`, `o2`; son teslim yarın) — ödev teslim dosyası uçları için.
- İki quizli ödev: "Denetim quizi" (bir Doğru/Yanlış + bir açık uçlu soru; öğrencinin çözdüğü) ve "Denetim quizi (yazılan)"
  (öğretmenin yeniden yazdığı; kimse başlamadığı için kilitli değil).
- "Denetim yoklama servisi" ve `o1` o serviste (binmeyecek işareti için).
- `denOkulId`: yönetici genel bakışındaki ilk okul (disk sınırı ucu için).

### `UCLAR`: denenen uçlar ve izinli roller

Her satır `[ad, yol, yöntem, gövde, izinliRoller]`. Giriş yapmamış (`yok`) hiçbir uçta izinli değildir. Yer tutucular: `<o1>`,
`<o2>` öğrenciler; `<ödev>` "Denetim ödevi"; `<quizli ödev>` "Denetim quizi"; `<quizli ödev 2>` "(yazılan)"; `<servis>`
denetim servisi.

| Ad (çıktıdaki) | Uç | İzinli |
|---|---|---|
| sinif ac | `POST /api/school/class` | müdür |
| sinif listesi | `GET /api/school/classes` | müdür |
| ogrenci hesabi ac | `POST /api/school/student-create` | müdür |
| ogrenci duzenle | `POST /api/school/student-update` | müdür |
| ogrenci sinifa yerlestir | `POST /api/school/class-assign` | müdür |
| ogrenci sifresi sifirla | `POST /api/school/student-password` | müdür |
| rol olustur | `POST /api/school/role` | müdür |
| rol listesi | `GET /api/school/roles` | müdür |
| ogretmen listesi | `GET /api/school/teacher-list` | müdür |
| kisi koduyla ogretmen bul | `POST /api/school/ogretmen-bul` | müdür |
| kisi koduyla kisi bul | `POST /api/admin/kisi-bul` | yönetici |
| yedek listesi | `GET /api/admin/backups` | yönetici |
| yedek al | `POST /api/admin/backup-now` | yönetici |
| yonetici genel bakis | `GET /api/admin/overview` | yönetici |
| okulun disk siniri | `POST /api/admin/okul-disk-siniri` | yönetici |
| mudur listesi (yonetici) | `GET /api/admin/principals` | yönetici |
| site ayarlari | `GET /api/admin/site-ayarlari` | yönetici |
| site ayari kaydet | `POST /api/admin/site-ayarlari` | yönetici |
| okul adresleri (yonetici) | `GET /api/admin/okul-adresleri` | yönetici |
| yonetici dosyasi | `GET /api/admin/yonetici-dosyasi` | yönetici |
| yonetici dosyasi simdi oku | `POST /api/admin/yonetici-dosyasi/oku` | yönetici |
| yorumlarin hepsi (yonetici) | `GET /api/yorumlar/hepsi` | yönetici |
| excel sablonu | `GET /api/school/aktarim-sablon?tur=program` | müdür |
| kisi listesi sablonu | `GET /api/school/kisi-sablon` | müdür |
| kisi listesi disa | `GET /api/school/kisi-disa` | müdür |
| metinden excel | `POST /api/school/txt-excel` | müdür |
| excel disa aktar | `GET /api/school/aktarim-disa?tur=ogrenci` | müdür |
| yil listesi | `GET /api/egitim-yili` | müdür, öğretmen, öğrenci, veli, servisçi |
| yil ac | `POST /api/egitim-yili/ekle` | müdür |
| takvim gorme | `GET /api/takvim?yil=2026&ay=9` | müdür, öğretmen, öğrenci, veli, servisçi |
| takvime etkinlik ekle | `POST /api/takvim/etkinlik` | müdür |
| okul devamsizlik ozeti | `GET /api/devamsizlik/ozet` | müdür |
| yoklama alinabilir dersler | `GET /api/devamsizlik/derslerim` | müdür, öğretmen |
| islem kaydi | `GET /api/islem-kaydi` | müdür, yönetici |
| mesaj hedefleri | `GET /api/mesajlar/hedefler` | müdür, öğretmen, öğrenci, veli, servisçi |
| tum okula duyuru | `POST /api/mesajlar` | müdür |
| okul ogrencileri | `GET /api/school/students` | müdür |
| baskasinin devamsizligi | `GET /api/devamsizlik/ogrenci?studentId=<o2>` | müdür, öğretmen |
| kendi cocugunun devamsizligi | `GET /api/devamsizlik/ogrenci?studentId=<o1>` | müdür, öğretmen, veli |
| toplu giris bilgisi | `POST /api/school/giris-bilgisi` | müdür |
| anket ac | `POST /api/anketler` | müdür |
| anket listesi | `GET /api/anketler` | müdür, öğretmen, öğrenci, veli |
| yemek listesi yaz | `POST /api/yemek` | müdür |
| yemek listesi | `GET /api/yemek` | müdür, öğretmen, öğrenci, veli |
| servis ekle | `POST /api/servis/kaydet` | müdür |
| servis bilgisi | `GET /api/servis` | müdür, öğretmen, öğrenci, veli, servisçi |
| servis haritasi | `GET /api/servis/harita?ogrenci=<o1>` | müdür, öğrenci, veli |
| baskasinin servis haritasi | `GET /api/servis/harita?ogrenci=<o2>` | müdür, öğrenci (öğrenci başkasını isteyemez, kendi haritası gelir) |
| ev konumu yaz | `POST /api/servis/ev` | müdür, öğrenci |
| seferlerim | `GET /api/servis/seferim` | servisçi |
| sefer baslat (atanmamis) | `POST /api/servis/sefer-basla` | — (hiç kimse) |
| konum gonder (sefersiz) | `POST /api/servis/konum` | — |
| servis yoklamasi | `GET /api/servis/yoklama` | müdür, servisçi |
| baska servisin yoklamasi | `GET /api/servis/yoklama?servisId=<servis>` | müdür |
| yoklama isareti (atanmamis) | `POST /api/servis/yoklama` | — |
| okula vardik (atanmamis) | `POST /api/servis/okula-vardik` | — |
| servis sirasi (atanmamis) | `POST /api/servis/sira` | — |
| servis notu (atanmamis) | `POST /api/servis/not` | — |
| servis notu sil | `POST /api/servis/not-sil` | — |
| binmeyecek (kendi cocugu) | `POST /api/servis/binmeyecek` | veli |
| binmeyecek (baskasinin cocugu) | `POST /api/servis/binmeyecek` | — |
| servis saatleri | `POST /api/servis/saatler` | müdür |
| uygulama anahtari al | `POST /api/cihaz` | giriş yapan herkes (yönetici dahil) |
| uygulama telefonlari | `GET /api/cihaz` | giriş yapan herkes |
| baskasinin telefonunu sil | `POST /api/cihaz/sil` | — |
| anahtar ucu oturumla (bildirim) | `GET /api/cihaz/bildirimler` | — (bu uçlar oturumla değil telefon anahtarıyla açılır) |
| anahtar ucu oturumla (ayar) | `GET /api/cihaz/ayar` | — |
| anahtar ucu oturumla (konum) | `POST /api/cihaz/servis-konum` | — |
| okul adresi | `GET /api/school/adres` | müdür |
| okul konumu yaz | `POST /api/school/konum` | müdür |
| servisci listesi | `GET /api/school/servisciler` | müdür |
| servisci hesabi ac | `POST /api/school/hesap-ac` | müdür |
| baska hesabi gor | `GET /api/school/hesap?id=<o2>` | müdür |
| bildirim anahtari | `GET /api/push/anahtar` | giriş yapan herkes |
| bildirim aboneligi durumu | `POST /api/push/durum` | giriş yapan herkes |
| ic aga abonelik | `POST /api/push/abone` (adres `https://127.0.0.1/x`) | — |
| kulup ac | `POST /api/kulupler/kaydet` | müdür |
| kulup listesi | `GET /api/kulupler` | müdür, öğretmen, öğrenci, veli |
| odev teslim listesi | `GET /api/odev-dosya?odev=<ödev>` | müdür, öğretmen, öğrenci |
| cocugun teslim listesi | `GET /api/odev-dosya?odev=<ödev>&ogrenci=<o1>` | müdür, öğretmen, öğrenci, veli |
| quiz metin onizlemesi | `POST /api/assignments/quiz-metin` | müdür, öğretmen |
| quiz yaz | `POST /api/assignments/<quizli ödev 2>/quiz` | öğretmen |
| quiz gorunumu | `GET /api/assignments/<quizli ödev>/quiz` | öğretmen, öğrenci |
| quiz baslat | `POST …/quiz/basla` | öğrenci |
| quiz cevap | `POST …/quiz/cevap` | öğrenci |
| quiz sekme kaydi | `POST …/quiz/odak` | öğrenci |
| quiz bitir | `POST …/quiz/bitir` | öğrenci |
| quiz ogrenci ayrintisi | `GET …/quiz/ayrinti?ogrenci=<o1>` | öğretmen |
| quiz sonuclari ac | `POST …/quiz/sonuc-ac` | öğretmen |

Quiz satırlarının sırası bilerek böyledir (dosyadaki yorum): yazma, başlatmadan önce; bitir, cevaptan sonra. Öğrenci uçları
yalnız ödevin öğrencisine, öğretmen uçları yalnız ödevi verene (müdür yalnız sahipsiz ödevde) açıktır; veli hiçbirine giremez
(puanı `/api/progress`'ten görür).

### Çıktı

- `=== HER UC x HER ROL ===` — her uç için bir satır, yedi sütun: `+` izin verildi (doğru), `.` engellendi (doğru), `!`
  YETKİSİZ GEÇTİ, `x` izinli olması gerekirken engellendi.
- `=== YONETICI UCLARI … ===` — `N yonetici ucu x rol denendi` (12 uç × 6 kimlik = 72).
- `=== GUVENLIK ACIGI (N) ===` ve her açık (`! <uç> [<rol>] -> <durum> <gövde>`) ya da `=== GUVENLIK ACIGI YOK ===`.
- Varsa `=== IZINLI OLMASI GEREKIRKEN ENGELLENEN (N) ===` ve her engel.
- `  K kontrol yapildi, N acik bulundu.` — açık varsa çıkış 1, yoksa 0. Beklenmeyen hata: `DENETIM HATASI: …`, çıkış 1.

### 3 Ekim'deki çıktı

Gece 3200'de yeni sıfırlanmış test veritabanında (seed'den sonra) koşuldu: **695 kontrol** (89 × 7 + 72), **0 açık**,
21 saniye, sunucu günlüğünde `API hatası` yok. Bir ENGEL çıktı: `kendi cocugunun devamsizligi [ogretmen] -> 403 Bu öğrencinin
devamsızlığını görme yetkin yok`. Nedeni sunucu değil, denetimin kendi sırası ("Dikkat!"e bak).

## Kimle konuşur?

- **Çağırdıkları:** [giris.md](giris.md) üzerinden `araclar/giris.js` → `iste`, `epostaOnayla`, `girisYap`, `botCevabi`,
  `tcUret`, `okulHesabi` ([../araclar/giris.md](../araclar/giris.md)).
- **Sınadığı sunucu kodu:**

  | Konu | Nerede |
  |---|---|
  | yönetici uçlarının gizlenmesi (`yoneticiUcuMu`, aynı 404), rolsüz hesabın girebildiği yollar | [../sunucu/api.md](../sunucu/api.md) |
  | yetki adları, hazır roller, `yetkiVarMi` | [../sunucu/yetki.md](../sunucu/yetki.md) |
  | öğretmen–öğrenci ve veli–çocuk ilişkisi | [../sunucu/iliskiler.md](../sunucu/iliskiler.md) |
  | sınıf, sınıfa yerleştirme, öğrenci listesi, rol, öğretmen listesi, Excel aktarım şablonu ve dışa aktarımı (`aktarim-sablon`, `aktarim-disa`), toplu giriş bilgisi | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | öğrenci/servisçi hesapları, öğretmen bulma, okul adresi ve konumu | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | kişi listesi şablonu, dışa aktarım, metinden Excel | [../sunucu/bolumler/kisi-aktarim.md](../sunucu/bolumler/kisi-aktarim.md) |
  | yönetici uçları (yönlendirici `yonetici.js`; kişi bulma `yonetici-okul.js`, yedekler `veri/yedek.js`, yönetici dosyası `yonetici-dosyasi.js`) | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md), [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md), [../sunucu/veri/yedek.md](../sunucu/veri/yedek.md), [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md), [../sunucu/bolumler/site-ayarlari.md](../sunucu/bolumler/site-ayarlari.md), [../sunucu/bolumler/okul-disk.md](../sunucu/bolumler/okul-disk.md), [../sunucu/bolumler/yorum.md](../sunucu/bolumler/yorum.md) |
  | eğitim yılı, takvim, devamsızlık, işlem kaydı | [../sunucu/bolumler/egitim-yili.md](../sunucu/bolumler/egitim-yili.md), [../sunucu/bolumler/takvim.md](../sunucu/bolumler/takvim.md), [../sunucu/bolumler/devamsizlik.md](../sunucu/bolumler/devamsizlik.md), [../sunucu/bolumler/islem-kaydi.md](../sunucu/bolumler/islem-kaydi.md) |
  | mesaj, anket | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md), [../sunucu/bolumler/anket.md](../sunucu/bolumler/anket.md) |
  | yemek, servis, kulüp | [../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md) |
  | telefon anahtarları, bildirim aboneliği | [../sunucu/bolumler/cihaz.md](../sunucu/bolumler/cihaz.md), [../sunucu/bolumler/push.md](../sunucu/bolumler/push.md) |
  | ödev teslim dosyaları, quiz | [../sunucu/bolumler/odev-dosya.md](../sunucu/bolumler/odev-dosya.md), [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), [../sunucu/bolumler/quiz.md](../sunucu/bolumler/quiz.md) |
  | veli kodu, kişi kodu, kayıt | [../sunucu/bolumler/veli.md](../sunucu/bolumler/veli.md), [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md), [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Ön koşulu:** [seed.md](seed.md) (müdür, `mat`, `ogrenci1`, yönetici, iki öğrenci, 6-A ve dersleri).
- **Onu çalıştıran:** `testler/tumtest.sh` (denetimler döngüsünün ilki). Başka hiçbir dosya çağırmaz.
- **Tablolara yazdıkları** (yalnız test veritabanında): sınıflar, öğrenciler, rol, eğitim yılı `2040-2041`, takvim etkinliği,
  duyuru, anket, yemek listesi, servisler, kulüp, telefon anahtarları, ödevler ve quiz denemesi, bir yedek dosyası
  (`EE_DATA` altında), site ayarı (`bildirimAralikDk = 5`).

## Nasıl çalışır (adım adım)?

```
tumtest: sunucu (3200, _test sıfır) ─► seed.js ─► yetki-denetimi.js
  M, O, S, A girer · veli kaydolur, onaylar, girer · servisçi açılır, girer
  hazırlık: DENETIM sınıfı, veli ─► o1, vKod, DENETIM-GB + öğrenci, ödev, 2 quizli ödev, servis + o1
  for uç in UCLAR (89, sırayla):
      for rol in mudur, ogretmen, ogrenci, veli, admin, servisci, yok:
          istek ─► 200/201 mi? ─► izinli mi? ─► + . ! x
  for uç in UCLAR (yalnız ['admin'] olan 12):
      for rol in (yönetici dışı 6):
          aynı anda: uç + /api/boyle-bir-uc-yok-denetim ─► ikisi de 404 ve gövdeler aynı mı?
  açık listesi · engel listesi · "695 kontrol yapildi, 0 acik bulundu."
tumtest: "GUVENLIK ACIGI (" ya da günlükte "API hatası" ─► DENETIM SORUNU
```

Elle (test sunucusu `tumtest.sh`'teki ortam değişkenleriyle 3200'de açık, çıktısı `testler/test-sunucu.log`'a):

```
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/seed.js
EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/yetki-denetimi.js
```

Yeni bir uç eklediğinde buraya bir satır ekle: doğru `izinliRoller` listesiyle ve izinli rol için geçerli bir gövdeyle (yoksa
izinli rol de 400 alır, `x` görünür).

## Dikkat!

- **Liste politikanın kendisidir.** `izinliRoller` bugünkü kararları yazar. Bir yetkiyi bilerek genişletirsen listeyi de
  güncelle; ama listeyi "denetim geçsin" diye genişletmek açığı gizler. Her genişletmeyi gerekçesiyle yap.
- **Satırlar gerçek değişiklik yapar ve sonrakileri etkiler.** Uçlar sırayla, her biri önce müdürle çağrılır; müdürün başarılı
  istekleri veriyi değiştirir. Örneğin "ogrenci sinifa yerlestir" `o1`'i (Burak) 6-A'dan `DENETIM` sınıfına taşır; Ayşe Kaya
  artık onun dersine girmediği için matrisin 39. satırındaki "kendi cocugunun devamsizligi [ogretmen]" 403 alır. 3 Ekim'deki tek ENGEL
  budur (aynı öğretmen 6-A'da kalan `o2` için "+" aldı). "ogrenci sifresi sifirla" Burak'ın şifresini `YeniSifre123` yapar,
  "site ayari kaydet" `bildirimAralikDk`'yı 5'te bırakır, "yedek al" `EE_DATA` altına gerçek bir yedek yazar, "quiz sonuclari ac"
  quizin sonuçlarını açar. Yeni satırı nereye koyduğuna dikkat et.
- **Tekil adlı "oluştur" satırları sonraki rollerde açığı göremez.** Gövde dizi kurulurken bir kez hesaplanır ve yedi rolde
  aynıdır. Müdür önce başarıyla oluşturduğu için, yanlışlıkla yetki verilmiş başka bir rol aynı gövdeyle "zaten var" (400)
  alır ve denetim bunu "engellendi" (`.`) sayar. Bu durumdaki satırlar: "sinif ac" (`X-<zaman>` adı), "ogrenci hesabi ac"
  (sabit kullanıcı adı, e-posta ve T.C.), "rol olustur" (sabit ad), "yil ac" (`2040-2041`), "servisci hesabi ac" (sabit T.C.).
  Yani bu uçlarda bir yetki açığı olsa bu denetim **yakalayamaz** (koddan çıkarım). Düzeltme önerisi: gövdeyi rol başına
  üreten bir işlev (`govde(rol)`) ya da müdürü bu satırlarda en sona almak. Kod değiştirilmedi.
- **Hiç kimsenin izinli olmadığı satırlar kapıyı kanıtlamaz.** "sefer baslat (atanmamis)" (`servisId: 'yok'`), "konum gonder
  (sefersiz)", "servis notu sil" (`id: 'yok'`), "baskasinin telefonunu sil" gibi satırlarda kimlikler gerçek bir kayıt yerine
  uydurma bir kimlikle gelir; herkesin almasını beklediği 4xx "bulunamadı"dan da gelebilir. Bu satırlar "geçmiyor" der, "yetki
  kapısı çalışıyor" demez. Gerçek kayıtla denenenler ("yoklama isareti (atanmamis)", "servis sirasi (atanmamis)",
  "binmeyecek (baskasinin cocugu)") daha anlamlıdır.
- **ENGEL sonucu etkilemez ve `tumtest`'te hiç görünmez.** İzinli bir rolün yanlışlıkla kilitlenmesi (bir özelliği kullanılmaz
  yapan gerileme) sorun sayılmaz. `tumtest.sh` bu denetimin çıktısından yalnız `GUVENLIK ACIGI`, `acik bulundu`, `KALDI` ya da
  `GECTI:` geçen ilk 6 satırı gösterir; engel satırları (`  x …`) bu süzgece takılmaz. Elle koşup listeye bak.
- **Çökerse `tumtest` bunu sorun saymaz.** Hazırlıkta bir adım fırlatırsa (`DENETIM HATASI: …`) çıktıda `GUVENLIK ACIGI (` olmaz;
  `tumtest.sh` bu döngüde çıkış kodunu ve seed'in çıkış kodunu denetlemez. Bu en çok veli kaydında olur: kayıt reddedilirse
  günlükte onay anahtarı olmaz, `epostaOnayla` fırlatır. `tumtest` çıktısında `695 kontrol yapildi` satırını gördüğünden emin
  ol.
- **Kayıt gövdesindeki `role: 'parent'`, `city`, `district` yok sayılır.** Kayıt rolsüz bir yetişkin açar; hesap `/api/parent/link`
  ile veli olur. Velinin oturumu bağdan önce alınmıştır; sunucu rolü her istekte hesaptan okuduğu için bu yeterli (3 Ekim'deki
  koşuda velinin bütün izinli satırları `+`).
- **"rol olustur" yetkileri `yetkiler` alanında gönderir;** sunucu `permissions` okur, rol yetkisiz açılır. Burada yalnız kapı
  denendiği için sonucu etkilemez ([debug-hazirlik.md](debug-hazirlik.md)'de aynı alan adı gerçek bir eksikliğe yol açar).
- **Tek okul.** Okullar arası ayrım burada denenmez; denetimler içinde ona [girdi-denetimi.md](girdi-denetimi.md)'nin 6.
  bölümü bakar (ikinci okulun müdürü birinci okulun öğrencisini göremez, düzenleyemez). Rolün ders/sınıf kapsamını
  `testler/test-kapsam.js` dener.
- **Yönetici uçları denetimi eşzamanlıdır.** Her rol için uç ile bilinmeyen adres `Promise.all` ile aynı anda çağrılır; gövde
  ve durum birebir karşılaştırılır (`JSON.stringify`). Yönetici olmayana dönen 404'ün iletisi değişirse (ör. çeviri) iki taraf
  birlikte değişmeli.
- **Varsayılan adres 3000.** `EE_BASE` vermezsen yüzlerce istek kendi (gerçek veritabanlı) sunucuna gider ve orada sınıf,
  öğrenci, rol, yedek açar, bir öğrencinin şifresini değiştirir. Her zaman `EE_BASE=http://localhost:3200`.

## Testleri

- Kendisi bir denetim. Koruduğu dosyalar: [../sunucu/api.md](../sunucu/api.md) (yönetici uçlarının gizliliği, rolsüz hesabın
  sınırı), [../sunucu/yetki.md](../sunucu/yetki.md), [../sunucu/iliskiler.md](../sunucu/iliskiler.md) ve yukarıdaki tablodaki
  bütün bölüm dosyalarının rol kapıları. Aynı konuları daha ayrıntılı deneyenler: `testler/test-rol.js` (özel roller),
  `testler/test-kapsam.js` (ders/sınıf kapsamı), `testler/test-admin-gizli.js` (gizli `/admin`), `testler/test-ozellikler.js`
  (okulda kapalı bölümler), `testler/test-quiz.js` (quiz yetkileri).
- Elle: yukarıdaki komutlar. 3 Ekim gecesi böyle koşuldu (695/0, 1 ENGEL, 21 sn); sunucu iş bitince kapatıldı.

## Son durum

- `git log`: 7 commit. `088f3f2 commit 28` (2026-08-28) ilk 22 satır (`bekleniyor`); `58e3f2d commit 320` (2026-09-26) ana
  gövde (203 satır: kimlikler, hazırlık, `UCLAR`, matris çıktısı). `0acca75 commit 516` (2026-09-27, kişi kodu): velinin kişi
  kodu `vKod`, "kisi koduyla ogretmen bul" ve "kisi koduyla kisi bul" satırları; kalkan müdür başvurusunun "bekleyen
  basvurular" (`/api/admin/pending`) satırı silindi. `24050a2 commit 518` (2026-09-27, servis yoklaması): denetim servisi ve
  `o1`'in servise eklenmesi; servis yoklaması, okula vardık, sıra, not, binmeyecek, servis saatleri satırları ve telefon
  uygulamasının altı satırı (anahtar al, telefonlar, başkasının telefonunu sil, oturumla açılmaması gereken üç anahtar ucu).
- `3b8fd36 commit 519` (2026-09-27, quiz): iki quizli ödevin hazırlığı ve dokuz quiz satırı (sıra yorumuyla).
- `276c0a0 commit 521` (2026-09-27, gizli `/admin`): açıklamaya yönetici uçları kuralı; yönetici genel bakış, müdür listesi,
  site ayarları (okuma/kaydetme), okul adresleri, yönetici dosyası (okuma/şimdi oku), yorumların hepsi satırları; ve "yönetici
  uçları bilinmeyen adres gibi" bölümü.
- `40fc7e7 commit 525` (2026-09-27, okul disk sınırı): `denOkulId` hazırlığı ve "okulun disk siniri" satırı. O günden beri
  değişmedi.
- Bilinen açıklar (kod değiştirilmedi): tekil adlı "oluştur" satırlarının yanlış negatifi, uydurma kimlikli satırların kapıyı
  kanıtlamaması, çökmenin `tumtest`'te görünmemesi, `yetkiler` alan adı.
- Planlı işlerden etkileyecekler: "Kulüpler kaldırılacak" — "kulup ac" ve "kulup listesi" satırları uçlarla birlikte
  silinmeli; "Çalışan olarak ekleme" — tanımı rolsüz çalışanın hiçbir okul bölümüne giremediğini "yetki-denetimi bunu
  kanıtlar" diye bu dosyaya bağlıyor: yeni bir kimlik sütunu (rolsüz çalışan) ve satırlar eklenecek; "Kullanıcı arama + destek
  talepleri" (destek rolü), "Toplantılar" (tahta hesabı), "Eğitim içerikleri" (eğitmen), "Çok dil" (çevirmen), "Özel roller"
  (yeni yetkiler) — her yeni rol yeni bir sütun, her yeni uç yeni bir satır demek; "Paneller" (`/panel/admin`, `/panel/destek`)
  yönetici uçları bölümünü genişletecek; "Sistem" işindeki yöneticiye zorunlu TOTP yönetici girişini değiştirecek; "T.C. kimlik
  no bütün hesaplarda zorunlu" — veli kaydı T.C. göndermiyor, hazırlıkta çöker.
