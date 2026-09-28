# sunucu/veri/json-aktarim.js

Bütün veritabanını tek bir JSON nesnesine döken `disaAktar` (yedeklerin biçimi) ve böyle bir nesneyi — yedek dosyasını ya
da eski `data/db.json`'u — tabloları boşaltıp tek işlemde, her kaydı doğrulayarak geri yazan `iceAktar`.

## Bu dosya ne yapar?

İki yönlü bir köprü:

- **Dışarı (`disaAktar`)**: [yedek.md](yedek.md) günlük ve elle alınan yedekleri bununla yazar. Biçim uygulamanın kendi
  nesne biçimidir (`users`, `schools`, `assignments` …; eski `db.json` ile aynı adlar): elle okunabilir, PostgreSQL
  sürümünden bağımsızdır, eski sürümün yedekleri de geri yüklenebilir.
- **İçeri (`iceAktar`)**: yönetim panelindeki "Geri yükle" ([../bolumler/yonetici.md](../bolumler/yonetici.md) →
  [yedek.md](yedek.md)) ve ilk açılışta eski `db.json`'un taşınması ([index.md](index.md) `baslat`). Önce yedeğe giren
  bütün tablolar BOŞALTILIR, sonra kayıtlar tek tek yazılır; hepsi TEK işlemdedir: yarıda bir hata olursa hiçbir şey
  değişmez, veri eski hâlinde kalır.

Eski verilerde kopuk bağlar olabilir (silinmiş bir öğretmenin ödevi, silinmiş bir sınıfın dersi), eski sürümler bugünkü
kuralları bilmezdi (aynı e-posta iki hesapta, geçersiz T.C., yöneticiyle aynı kullanıcı adı). Veritabanının yabancı anahtar
ve tekillik kuralları bunları kabul etmeyeceği için `iceAktar` her kaydı yazmadan önce temizler: kopuk "yazar" bağı boşa
düşer (ör. ödevin öğretmeni `null`), kopuk "sahip" bağı olan kayıt atlanır (ör. okulu olmayan sınıf), bozuk alan
varsayılana döner. Kaç kaydın neden atlandığı `atlanan` sayacında raporlanır.

## İçinde neler var?

### `TABLOLAR`

İçeri aktarmada `TRUNCATE … RESTART IDENTITY CASCADE` ile boşaltılan ve dışarı aktarmada `SELECT *` ile okunan 67 tablo.
Sıra önemlidir (aşağıda "Dikkat!"). Gruplar:

- Yedeğe giren kalıcı veri: okullar, eğitim yılları, sınıflar, roller (yetkileri ve kapsamları), kullanıcılar, mesaj
  engelleri, veli bağları, dersler, ders programı, ödevler (sınıfları, öğrencileri), sınav şablonları ve ölçümleri, sınav
  grupları, sınavlar (ölçümleri, değerleri), devamsızlık, mesajlar (alıcıları, okumaları), takvim, bildirimler, oturumlar,
  hatırlatma işaretleri, işlem kaydı, anketler (seçenekleri, hedefleri, oyları), yemek listesi, servisler ve öğrencileri,
  kulüpler ve üyeleri, ödev teslim dosyalarının bilgisi, öğrenci ev konumları, etütler (öğrencileri, yoklamaları), okul
  sayfaları ve fotoğraflarının bilgisi, yorumlar, öğrenci geçmişi (nakil), okulların kapattığı özellikler, kişisel
  hatırlatıcılar (günleri), quizler (soruları, şıkları, denemeleri, cevapları).
- Listede olup yedeğe GİRMEYEN geçici veri (içeri aktarmada boşaltılır): Eğitim Evi Aile'nin 7 günlük verisi
  (`aile_cihazlari`, `aile_konumlari`, `aile_kullanim`, `aile_ayarlari`, `aile_sinirlari`, `aile_uyarilari`), servisin
  30 günlük verisi (`servis_yoklamalari`, `servis_gunleri`, `servis_olaylari`, `servis_notlari`, `servis_binmeyecek`) ve
  telefon uygulamasının cihaz anahtarları (`cihaz_anahtarlari`; aşağıda korunuyor).

### `iceAktar(veri)`

Girdi: `users` dizisi olan bir nesne (yoksa `Error('Veri geçerli değil (kullanıcı listesi yok)')`). Öteki anahtarların
hepsi isteğe bağlıdır; olmayan liste boş sayılır. Dönüş: `{ kullanici: <yüklemeden sonraki kullanıcı sayısı>, atlanan:
{ <tür>: sayı } }`.

Tek işlemde, bu sırayla:

1. **Korunacakları oku**: `push_abonelikleri`, `cihaz_anahtarlari`, `yonetim_cerezleri` (üçü de yedekte yok ama
   kullanıcılara/oturumlara bağlı olduğu için `CASCADE` onları da siler).
2. **Boşalt**: `TRUNCATE <TABLOLAR> RESTART IDENTITY CASCADE`.
3. **Yaz** (her bölüm bir öncekine bakarak doğrular; kimlik kümeleri bellekte tutulur):
   - **Okullar** (`schools`): aynı kimlik ikinci kez gelirse atlanır; durum `pending/approved/rejected` değilse `pending`;
     MEB kodu reddedilmemiş okullarda tek (tekrarı boşaltılır); adres adı (`kisaAd`) geçerli ve tekse korunur, değilse
     boş kalır (açılışta yeniden önerilir); koordinat ikisi birden geçerliyse; servis saatleri geçerliyse
     (`saatlerSorunu`), yoksa varsayılan; disk sınırı 1–10.485.760 MB tam sayıysa, yoksa boş (varsayılan).
   - **Eğitim yılları**: okulu olmalı, adı `2026-2027` biçiminde; okul başına tek aktif (ikinci aktif pasif yazılır);
     başlangıç/bitiş yoksa 1 Eylül / 30 Haziran.
   - **Sınıflar**: okulu olmalı, adı dolu ve okulda tek.
   - **Roller**: okulu ve adı olmalı; hazır Öğretmen rolü (`tur: 'ogretmen'`) okul başına tek, fazlası `ozel`. Yetkiler ve
     ders/sınıf kapsamları tekrarsız yazılır.
   - **Kullanıcılar** (en uzun bölüm):
     - Okul rolü satırları (`anaHesapId` dolu) bağlı oldukları yetişkin hesabından SONRA yazılsın diye sona dizilir.
     - Rol boşsa hesap rolsüzdür; `admin/principal/teacher/student/parent/servisci` dışındaki rol atlanır.
     - E-posta [../ortak.md](../ortak.md) `normEmail` ile sadeleştirilir; aynı e-posta ikinci kez gelirse sonraki hesap
       atlanır. E-postası da kullanıcı adı da olmayan hesap atlanır. Okul isteyen rolde (yönetici ve veli dışında) geçerli
       okul yoksa atlanır.
     - Okul rolü satırı yalnız öğretmen/müdür, okullu, e-postasız ve (yetişkin + okul) başına bir tane olabilir; bağlı
       yetişkin yüklenmemişse atlanır.
     - Kullanıcı adı ([../ortak.md](../ortak.md) `normKullaniciAdi`): geçerli ve kendi ad alanında boşsa korunur (okul
       hesapları okul içinde, ötekiler kendi aralarında tek; 11 haneli ad yalnız o kişinin T.C.'siyse geçerli). Değilse
       e-postanın `@` öncesinden türetilir (yalnız `a-z 0-9 . _`, harfle başlar, en çok 24 karakter; kök 3 karakterden
       kısaysa başına `kullanici` eklenir; alınmışsa `2`, `3` … eki). Yöneticilerin
       yedekteki adları baştan ayrılır: okul hesapları o adları alamaz; yönetici de o ana kadar herhangi bir hesaba verilmiş
       adı alamaz (031).
     - T.C. ([../ortak.md](../ortak.md) `normTc`, `tcSorunu`): geçersizse ya da ad alanında başkasındaysa hesap ATLANMAZ,
       T.C.'siz yazılır. Öğrencinin T.C.'si hem kendi okulunda hem bütün öğrenciler arasında tek olmalı (021).
     - Okul numarası okulda tek (tekrarı boşaltılır). Telefon `+` ile başlayan uluslararası biçimde değilse boş.
     - Kişi kodları: öğrencinin veli kodu ve yetişkin hesabının kişi kodu (`KISI_KODU_DESENI`, 16 karakter) geçerli ve
       tekse KORUNUR (veliye verilmiş kod geçersiz kalmasın); eski biçimse (10 ya da 15 haneli) ya da çakışıyorsa yeniden
       üretilir. Okul rolü satırında, servisçide ve yöneticide kişi kodu yok.
     - Ad soyad 3 karakterden kısaysa tireyle tamamlanır; durum geçersizse `approved`; tema `sistem/acik/koyu`; mesaj
       ayarı `herkes/personel/kapali`; KVKK onayı, tarih ve sürümüyle; `okul_acti` = `okulActi === true` ya da hesabı birisi
       açmışsa (`createdBy`).
     - İkinci geçiş: `olusturan_id` (iki hesap da yüklendiyse) ve mesaj engelleri.
   - **Veli bağları**: iki uç da yüklenmiş ve tekrarsız olmalı.
   - **Dersler**: sınıfı ve okulu olmalı, konu sınıfta tek; öğretmen yoksa boş; haftalık saat 0–20.
   - **Ders programı**: dersi/sınıfı/okulu olmalı; eski "kaçıncı ders" (`slot`) kayıtları `ESKI_SAATLER` ile saate
     çevrilir; gün 1–7, bitiş başlangıçtan sonra ve en çok 8 saat.
   - **Ödevler**: okulu ve başlığı olmalı; bitiş başlangıçtan önceyse başlangıç silinir; bitiş saati yoksa `12:00`;
     `dosyaYukleme` yoksa açık (033 öncesi yedekler); öğrenciler (sonuç, açılma zamanı, yıldız) ve sınıflar.
   - **Sınav şablonları, grupları, sınavlar**: eski biçimde (tek "Puan" + `grades`) ya da yeni biçimde (`olcumler` +
     `degerler`); gruptaki sınavın ağırlığı 0'dan büyük ve en çok 100 değilse 100, grupsuz sınavda geçersiz ağırlık boş
     (`null`) yazılır; `groupId` verilmiş ama grubu yüklenmemiş sınav atlanır; tarih yoksa oluşturma günü, o da yoksa
     bugün; değerler −10.000…10.000 arasında ve öğrenci yüklenmişse.
   - **Devamsızlık, mesajlar (alıcı + hangi çocuk için, okuyanlar), takvim, bildirimler**: sahipleri olmalı; metinler
     sınırda kırpılır.
   - **Oturumlar**: eski `sessions` (düz anahtar) SHA-256 özetlenerek, yeni `oturumlar` (64 haneli özet) olduğu gibi;
     kullanıcısı olmalı; telefon uygulaması oturumu (`uygulama`) korunur.
   - **Hatırlatma işaretleri, işlem kaydı** (IP geçerli değilse boş).
   - **Anketler**: okulu, sorusu, bitişi ve en az 2 seçeneği olmalı (en çok 10; seçenek kimliği bütün anketlerde tek);
     hedefler yüklenmiş kişiler; oy yalnız hedeften, o anketin seçeneğine, kişi başına bir.
   - **Yemek listesi** (okul + gün başına bir; kalori 1–5000), **servisler** (okulda ad tek; şoför hesabı yalnız aynı
     okulun servisçisiyse; öğrenci yalnız aynı okulun öğrencisiyse ve tek serviste; sabah/akşam sırası korunur, yoksa
     listedeki sıra), **kulüpler** (okulda ad tek; üyeler aynı okulun öğrencileri; kontenjan 1–1000).
   - **Ödev teslim dosyalarının bilgisi**: kimlik 32 haneli onaltılık, ödev + öğrenci eşleşmesi yüklenmiş olmalı, boyut,
     CRC32 ve SHA-256 geçerli. Dosyanın kendisi yedekte YOK (diskte `data/dosyalar` altında).
   - **Quizler**: ödevi yüklenmiş ve ödev başına bir; süre türü `yok/soru/quiz`, bütün quiz süresi 60–10.800 sn;
     en çok 100 soru, soru başına en çok 10 şık; soru ve şık kimlikleri birlikte tek; soru başına sürede her soruda
     10–600 sn. Denemeler yalnız o ödevin öğrencisine, öğrenci başına bir; cevaplar yalnız o quizin sorularına, seçilen
     şıklar yalnız o sorunun şıkları.
   - **Etütler** (gün 1–7, saatler geçerli; öğretmen yalnız aynı okulun öğretmeni/müdürüyse; öğrenciler aynı okuldan) ve
     **etüt yoklamaları** (etüt + gün + öğrenci başına bir; `var/yok/izinli`).
   - **Öğrenci ev konumları**, **okul sayfaları** (okul başına bir; yalnız 8 bilinen görünüm ayarı, her biri en çok 20
     karakter; tanıtım 1500, CSS 8000 karakter — sayfaya giderken her seferinde yeniden temizlenir) ve **fotoğraf
     bilgileri** (yer `kapak/logo/galeri`, tür PNG/JPEG/WebP; dosyalar diskte `data/okul-fotolari`).
   - **Yorumlar** (hesap başına bir; 0–5 yıldız; en az 3 karakter), **öğrenci geçmişi** (sonra öğrencinin baktığı geçmiş
     dönem `secili_gecmis` yazılır), **kapalı özellikler** (yalnız `depo/ozellikler.js` `ANAHTARLAR`'daki anahtarlar),
     **kişisel hatırlatıcılar** (sıklık `bir-kez/her-gun/her-hafta/her-ay`, saat `SS:DD`, "bir kez"de tarih, "her ay"da
     1–31 gün; haftanın günleri 1–7).
4. **Korunanları geri yaz** (aynı işlemde): `abonelikleriGeriYaz`, `cihazAnahtarlariniGeriYaz` — sahibi olan kullanıcı
   yüklenen veride hâlâ varsa; `yonetimCerezleriniGeriYaz` — bağlı olduğu oturum yedekte de varsa (çerezin süresi ve
   yöneticiliği her istekte yine denetlenir, [../yonetim-cerezi.md](../yonetim-cerezi.md)). Hepsi `ON CONFLICT DO NOTHING`.
5. İşlem bittikten sonra `depo.ozellikler.yukle()`: bellekteki "kapalı özellikler" kopyası yüklenen veriyle aynı olsun.

`atlanan` anahtarları: `okul`, `yil`, `sinif`, `rol`, `kullanici`, `veliBag`, `ders`, `program`, `odev`, `sablon`,
`sinavGrubu`, `sinav`, `devamsizlik`, `mesaj`, `takvim`, `bildirim`, `islemKaydi`, `anket`, `yemek`, `servis`, `kulup`,
`odevDosyasi`, `quiz`, `quizSorusu`, `quizSecenegi`, `quizDenemesi`, `quizCevabi`, `etut`, `etutYoklama`, `evKonumu`,
`okulSayfasi`, `okulFotosu`, `yorum`, `ogrenciGecmisi`, `kapaliOzellik`, `hatirlatici`.

### `disaAktar()`

`TABLOLAR`'ın hepsini `Promise.all` ile `SELECT *` okur (adlar [yazici.md](yazici.md) `adDogrula`'dan geçer) ve
[esleme.md](esleme.md)'nin işlevleriyle uygulama nesnelerine çevirir. Çıktı:

```
{ _surum: 2, _alindi: <ISO zaman>,
  schools, egitimYillari, classes, roles, users, parentLinks, lessons, schedule, assignments,
  sinavSablonlari, examGroups, exams, devamsizlik, mesajlar, takvim, notifications,
  oturumlar, hatirlatmalar, islemKaydi, anketler, yemekListesi, evKonumlari, servisler, kulupler,
  odevDosyalari, etutler, etutYoklamalari, okulSayfalari, okulFotolari, yorumlar, ogrenciGecmisi,
  kapaliOzellikler, hatirlaticilar, quizler, quizDenemeleri }
```

Ayrıntılar: `users[].mesajAyar.engelli` engellenenlerin kimlikleri; `users[].pass` şifre ÖZETİ; `assignments[]` ayrıca
`yildizlar`; `exams[]` hem `grades` (ana ölçüm) hem `degerler` (her ölçüm); `oturumlar` `{ <özet>: { userId, createdAt,
uygulama } }`; `hatirlatmalar` `{ <anahtar>: ms }`; `quizler[].sorular[].secenekler[].dogru` doğru şık bilgisi;
`servisler[].ogrenciler` sabah sırasına göre.

### Küçük doğrulayıcılar (iç)

`dizi` (dizi değilse `[]`), `metin(v, max)` (metne çevirip keser; varsayılan 10.000), `gun` (`YYYY-AA-GG` ve gerçek bir
gün), `saat` (`S:DD`/`SS:DD` → `SS:DD`), `dakika`, `zaman` (tarih okunamazsa ŞİMDİ), `secim(v, liste, varsayılan)`,
`sayi` (sonlu sayı ya da `null`), `ekle` ([yazici.md](yazici.md) `ekle`'ye iletir).

Dışa açılanlar: `TABLOLAR`, `iceAktar`, `disaAktar`.

## Kimle konuşur?

- Çağırdıkları: Node `crypto` (eski oturum anahtarlarını özetlemek), `net` (`isIP`); [baglanti.md](baglanti.md) →
  `sorgu`, `islem`, `metinCalistir`; [../ortak.md](../ortak.md) → `ESKI_SAATLER`, `KISI_KODU_DESENI`, `kisaAdSorunu`,
  `kisiKoduUret`, `kullaniciAdiSorunu`, `normEmail`, `normKullaniciAdi`, `normTc`, `normTelefon`, `okulHesabiMi`,
  `tcSorunu`, `uid`; `sunucu/yardimci/servis-pencere.js` → `saatlerSorunu`; [esleme.md](esleme.md); [yazici.md](yazici.md)
  → `ekle`, `adDogrula`; `sunucu/veri/depo/ozellikler.js` → `ANAHTARLAR`, `yukle` (geç yükleme).
- Onu çağıranlar: [yedek.md](yedek.md) (`disaAktar` yedek alırken, `iceAktar` geri yüklerken); [index.md](index.md)
  (`iceAktar` eski `db.json` için); `testler/test-cakisma.js` (ikisini de doğrudan).
- Tablolar: `TABLOLAR`'daki 67 tablo; ayrıca okuyup geri yazdığı `push_abonelikleri`, `cihaz_anahtarlari`,
  `yonetim_cerezleri`, ve varlığına baktığı `kullanicilar`, `oturumlar`.

## Nasıl çalışır (adım adım)?

```
iceAktar(veri)
  users dizi mi? ─ hayır → hata (hiçbir şey değişmez)
  islem {
     oku: push aboneliklerini, cihaz anahtarlarını, /admin çerezlerini
     TRUNCATE 67 tablo … CASCADE          ← bağlı başka tablolar da boşalır (aşağıda)
     okullar → yıllar → sınıflar → roller → kullanıcılar (2 geçiş) → veli bağları → dersler → program → ödevler
       → sınavlar → devamsızlık → mesajlar → takvim → bildirimler → oturumlar → hatırlatmalar → işlem kaydı → anketler
       → yemek → servis → kulüp → teslim dosyaları → quiz → etüt → ev konumu → okul sayfası → yorum → geçmiş
       → kapalı özellik → hatırlatıcı
       (her kayıt: bağları yüklenmiş mi? tekil mi? alanlar geçerli mi? → yaz / boşalt / atla)
     geri yaz: abonelikler, cihaz anahtarları, /admin çerezleri (sahipleri hâlâ varsa)
  } hata → ROLLBACK, veri olduğu gibi
  ozellikler.yukle()
  → { kullanici, atlanan }
```

## Dikkat!

Bu dosya veri güvenliği açısından en hassas dosyalardan biridir: `iceAktar` bütün veritabanını SİLİP yeniden yazar.

- **`CASCADE` listede olmayan tabloları da boşaltır.** `TRUNCATE … CASCADE`, bu tablolara yabancı anahtarla bağlı HER
  tabloyu da boşaltır. Bugün `TABLOLAR` dışında olup böyle boşalanlar:
  - `ekler` (mesaj ve ödev ekleri, 020) — **yedeğe girmez ve geri yüklemede bütün satırları kaybolur**: mesajlar ve
    ödevler eksiz görünür. Diskteki dosyalar (`data/ekler/`) de kısa sürede gider: [../bolumler/ekler.md](../bolumler/ekler.md)'deki
    saatlik `ekSupur` kaydı olmayan ve 2 saatten eski her dosyayı siler. Ekler zaten yüklendikten 7 gün sonra silindiği için
    kayıp son 7 günün ekleridir, ama geri dönüşü yoktur (geri-alma kopyasında da ek yok). Bilinen bir kusur; kod
    değiştirilmedi.
  - `eposta_onaylari` (016) — onay bağlantısı bekleyen kayıtlar ve e-posta değişiklikleri kaybolur; kişi yeniden kayıt
    olmalı.
  - `servis_seferleri`, `sefer_bildirimleri` (010) — bütün sefer kayıtları ve yaklaşma bildirimi işaretleri silinir; o an
    açık bir servis seferi kapanmış olur.
  - `okul_dosya_uyarilari` (033) — bilerek yedek dışı; uyarılar gerektiğinde yeniden gider.
  - `push_abonelikleri`, `cihaz_anahtarlari`, `yonetim_cerezleri` — okunup geri yazıldıkları için korunur.
  - Etkilenmeyenler: `site_ayarlari` (bağı yok; yedeğe de girmez) ve `sema_surumleri`.
  Yeni bir tablo eklediğinde (yeni şema dosyası) karar ver: yedeğe girecekse `TABLOLAR`'a ekle ve `iceAktar`/`disaAktar`'a
  yaz; girmeyecekse ve `TABLOLAR`'daki bir tabloya bağlıysa geri yüklemede silineceğini bil ve yorumuna yaz.
- **`TABLOLAR`'da SIRA bozulmamalı.** `disaAktar` ilk 50 tabloyu dizideki SIRAYLA değişkenlere açar
  (`const [okullar, yillar, …] = hepsi`). Araya bir tablo eklersen sonraki bütün değişkenler kayar ve yedek sessizce
  bozulur (ör. `kullanicilar` yerine `mesaj_engelleri` yazılır). Yeni tablo SONA eklenir ve adıyla alınır (quiz tabloları
  gibi: `tablo('quizler')`).
- **`disaAktar` tutarlı bir anlık görüntü değildir.** Sorgular işlem dışında, havuzdaki ayrı bağlantılardan paralel çalışır.
  Yedek alınırken yazılan bir kayıt yarım yakalanabilir (ör. ödev satırı yok ama öğrenci satırları var); böyle yetim alt
  satırlar yedeğe hiç girmez ya da geri yüklemede atlanır. Gündüz yoğun saatte elle alınan yedekte olasıdır. Aynı
  paralellik yüzünden yedek alınırken havuzun 10 bağlantısının hepsi dolar; o arada gelen istekler sırada bekler, 5 sn'de
  bağlantı alamayan 500 döner ([baglanti.md](baglanti.md) "Havuz dolunca").
- **Bütün veri bellekte:** `disaAktar` her tabloyu bütünüyle belleğe alır, [yedek.md](yedek.md) sonra tek bir
  `JSON.stringify` yapar; yedeğe girmeyen aile ve servis tabloları da boşuna okunur. Çok okullu bir sunucuda bellek ve V8'in
  metin sınırı aşılabilir ("Optimizasyon" işinde akışlı `.tar.gz` yedeğe geçilecek).
- **Geri yükleme sırasında site durur gibi olur:** `TRUNCATE` bütün tabloları işlem bitene kadar tam kilitler; satırlar
  tek tek yazıldığı için büyük veride bu uzun sürebilir. Bu arada gelen istekler bekler; 15 saniyeyi aşanlar
  ([baglanti.md](baglanti.md) `statement_timeout`) 503 "İşlem çok uzun sürdü" alır. Geri yüklemeyi sakin bir saatte yap.
- **Geri yükleme zamanı geri alır:** şifre özetleri, oturumlar, kişi kodları yedekteki hâline döner. Yedekten SONRA
  şifresini değiştiren kişinin eski şifresi yeniden geçerli olur; yedekten sonra kapatılmış (çıkış yapılmış, "bütün
  oturumları kapat" denmiş) bir oturum, süresi dolmadıysa yeniden açılır. Yedekten sonra açılan oturumlar kapanır (geri
  yükleyen yönetici dahil; ön yüz bunu söyler).
- **`atlanan` her şeyi saymaz:** yalnız ana kayıtlar sayılır. Alt satırlar (ödevin tanımsız öğrencisi, sınav değeri, mesaj
  alıcısı, servis/kulüp/etüt öğrencisi, anket oyu, oturum, mesaj engeli) koşulu tutmazsa SESSİZCE düşer. T.C., okul numarası,
  MEB kodu, adres adı çakışınca kayıt yazılır ama o alan boşaltılır; kullanıcı adı değiştirilir.
- **Yalnız `users` denetlenir:** `users` dizisi olan ama başka listeleri eksik (kesilmiş, elle düzenlenmiş) bir dosya da
  kabul edilir ve eksik listelerin karşılığı olan tablolar BOŞ kalır. `_surum` hiç okunmaz. Güvence: geri yüklemeden önce
  [yedek.md](yedek.md) o anki hâli `yedek-geri-alma-…` olarak saklar.
- **Birkaç alan yalnız biçimle denetlenir:** hatırlatıcının `saat`'i `^\d{2}:\d{2}$` kalıbına bakar, saat/dakika sınırına
  bakmaz; elle düzenlenmiş bir yedekte `99:99` gibi bir değer `time` sütununa yazılırken PostgreSQL hatası verir ve BÜTÜN
  geri yükleme geri alınır ("Geri yüklenemedi: …", veri değişmez). Rol yetkileri (`permissions`) bilinen yetki listesine
  karşı denetlenmez, her metin yazılır (bilinmeyen yetki hiçbir şey açmaz). `disaAktar`'ın ürettiği yedekte ikisi de
  sorun çıkarmaz.
- **Tarih okunamazsa "şimdi" yazılır** (`zaman`): bozuk bir `createdAt` hata vermez, kaydın tarihi geri yükleme anı olur.
- **Durum yoksa `approved`:** kullanıcı `status`'u geçersiz ya da boşsa hesap ONAYLI yazılır (eski `db.json`'da alan
  olmayabilirdi). Elle düzenlenmiş bir yedekte bekleyen hesaplar böylece onaylanmış olabilir.
- **Yedek dosyası kişisel veri taşır:** ad, T.C., telefon, adres, doğum tarihi, ev konumu, şifre özetleri, oturum özetleri,
  quizlerin doğru şıkları. `data/` depoya girmez; yedeği indirdiğinde de öyle sakla.
- **Döngüsel yükleme:** `depo/ozellikler.js` işlevin içinde `require` edilir.

## Testleri

- `testler/test-yedek.js` — yönetim panelinden elle yedek, liste, indirme (`users` dizisi, okulun disk sınırı), yol kaçışı
  denemeleri, müdürün erişememesi (404), geri yükleme: yedekten sonraki değişiklik gidiyor, `yedek-geri-alma-` kopyası
  oluşuyor; anket (gizlilik, oy), yemek, servis (durak, saatler, sabah sırası), kulüp (danışman, üyelik, kontenjan),
  teslim dosyası kaydı ve ödevin dosya izni, quiz (ayarlar, sorular, doğru şıklar, deneme, puan, cevaplar), disk sınırı geri
  geliyor; oturumu yedekte olan yöneticinin `/admin` çerezi korunuyor, olmayanın oturumu kapanıyor; telefon uygulamasının
  cihaz anahtarı geri yüklemeden sonra çalışıyor.
- `testler/test-cakisma.js` — "11) YEDEKTEN GERİ YÜKLEME": `disaAktar` çıktısına kurallara aykırı hesaplar ekleyip
  `iceAktar` eder (yöneticinin adını taşıyan öğrenci, okulda öğrencinin T.C.'sini taşıyan servisçi, başka okulda aynı
  T.C.'li öğrenci, boşluklu/büyük harfli aynı e-posta): 23505 çıkmadan yükleniyor, adlar/T.C.'ler kurala göre düzeltiliyor.
- `testler/sql-denetimi.js` — `TABLOLAR.join(', ')` ve `yaz.adDogrula(tablo)` izinli birleştirmeler.
- `ekler`'in geri yüklemede kaybolmasını, `disaAktar`'ın anlık görüntü olmamasını ve eksik listeli bir dosyayı deneyen test
  yok.
- Elle: yalnız test veritabanıyla. Yönetim paneli → Yedekleme → "Şimdi yedek al", bir sınıf ekle, yedeğe geri dön: sınıf
  gitmeli, listede `yedek-geri-alma-…` görünmeli.

## Son durum

- Son değişiklikler (hepsi 2026-09-27): `40fc7e7 commit 525` okulun disk sınırı (`diskSiniriMb`, 035) içeri aktarılıyor;
  `566b917 commit 524` ödevin `dosyaYukleme` (033; yedekte yoksa açık) ve `dosyaSaklama` (034) alanları;
  `153d63d commit 522` yalnız yorum (kişi kodu 16 karakter, 032); `276c0a0 commit 521` kullanıcı bölümü 031 çakışma
  kurallarına göre yeniden yazıldı (e-posta/kullanıcı adı/T.C. sadeleştirme, yönetici adlarının ayrılması, öğrencinin
  T.C.'sinin sistem genelinde tekliği) ve `yonetim_cerezleri` korunuyor. Daha önce: `3b8fd36 commit 519` quiz tabloları,
  `24050a2 commit 518` servis yoklaması tabloları ve cihaz anahtarları, `0acca75 commit 516` veli kodu yerine ortak kişi
  kodu (`KISI_KODU_DESENI`, `kisiKoduUret`; yetişkin hesabının kodu da). Dosya 2026-09-25/26'da parça parça kuruldu
  (`691ea79 commit 180` ile başladı; `iceAktar`'ın gövdesi `b7ded5b commit 345`, `disaAktar` `37b3ef2 commit 436`).
- Bilinen açıklar (kod değiştirilmedi): `ekler` tablosunun geri yüklemede silinmesi; `disaAktar`'ın tek işlemde (anlık
  görüntü) okumaması; bütün verinin belleğe alınması.
- Planlı: "Optimizasyon + saklama süreleri" günlük yedeği akışlı `.tar.gz`'ye çevirecek (tablo tablo JSON satırları +
  isteğe bağlı yüklenen dosyalar: `data/dosyalar`, `data/ekler`, `data/okul-fotolari`); geri yükleme eski `.json`
  yedekleri de okumaya devam edecek — bu dosyanın iki işlevi de akışlı hâle gelecek. "Yıl geçişi" okul başına yedek
  (şifreli, imzalı; hesaplar yedekten yaratılmaz) getirecek.
