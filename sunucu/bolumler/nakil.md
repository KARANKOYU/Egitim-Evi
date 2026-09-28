# sunucu/bolumler/nakil.js

Öğrenci nakli: başka okulda kayıtlı bir öğrencinin T.C. no'su ve doğum tarihi eşleşirse var olan hesabını yeni
okula taşır.

## Bu dosya ne yapar?

Eğitim Evi'nde öğrenci hesabı okula değil KİŞİYE aittir (şema 021). Öğrenci okul değiştirdiğinde yeni okul ona
yeni hesap açamaz: öğrencinin T.C. no'su bütün sistemde tek bir öğrencide olabilir. Bunun yerine yeni okul "Öğrenci
ekle"de T.C. no ile birlikte doğum tarihini yazar; ikisi eşleşirse öğrencinin var olan hesabı bu okula taşınır.
Öğrencinin kullanıcı adı (yeni okulda boşsa), şifresi, velileri ve veli kodu aynı kalır.

Eski okulun ödev, not ve devamsızlık kayıtları O okulun kaydı olarak kalır; yeni okul görmez. Öğrenci ve velisi
eğitim yılı seçicisinde "2025-2026 · Eski Okul · 6-A" gibi bir satırı seçip eski kayıtları salt okunur görür
(bakış [egitim-yili.md](egitim-yili.md)'de). Öğrenci eski okulun etüt, kulüp ve servis listelerinden çıkar.

Kendi ucu yoktur: [hesaplar.md](hesaplar.md)'deki `POST /api/school/hesap-ac` (öğrenci) T.C.'nin başka okulun
öğrencisinde olduğunu görünce bu dosyayı çağırır.

## İçinde neler var?

- `DENEME = 10`, `PENCERE = 60 * 60 * 1000` (iç) — yanlış doğum tarihi denemesi, nakli yapan kişi başına saatte 10:
  T.C.'yi bilen biri doğum tarihini tahmin ederek başkasının çocuğunu okuluna alamasın.
- `baskaOkulOgrencisi(tc, okulId, haricId)` — bu T.C. ile başka okulda (ya da okulsuz kalmış) bir öğrenci var mı;
  varsa o hesap, yoksa `null`. `haricId` düzenlenen hesabın kendisini dışarıda bırakır. Dışa açık.
- `nakilEt(k, st, g)` — taşımayı yapar ve cevabı yazar. `k` istek bağlamı (`req`, `res`, `me`), `st` taşınacak
  öğrenci, `g` formdan gelen alanlar (`tc`, `dogum`, `classId`, `okulNo`). Dışa açık. Cevaplar:
  - `429` — bu kişi son bir saatte 10 yanlış doğum tarihi denedi;
  - `409 { nakil: 'dogum', error }` — doğum tarihi yok ("… doğum tarihini de seç…") ya da eşleşmedi ("T.C. kimlik no
    ile doğum tarihi eşleşmedi…"; deneme sayılır). Ön yüz `nakil: 'dogum'`'u görünce doğum tarihi kutusunu açar;
  - `400 { alan: 'tc' }` — yeni okulda aynı T.C. başka bir hesapta (servisçi, eski usul öğretmen);
  - `400 { alan: 'sinifId' }` sınıf bu okulun değil; `400 { alan: 'okulNo' }` okul no başka öğrencide;
  - `200 { hesap, student, message }` — `hesap: { id, fullName, username, email: '', code, classId,
    varsayilanSifre: false, nakil: true }`, ileti "… okuluna taşındı. Öğrenci kendi şifresiyle girer; velileri bağlı
    kalır."
- `gecmisSatirlari(st, eskiOkul)` (iç) — eski okulun hangi eğitim yılları öğrencinin geçmişine yazılacak: başlangıcı
  bugünden önce olan ve bitişi hesabın açılışından sonra olan yıllar; hiçbiri tutmazsa etkin yıl; okulda hiç yıl
  yoksa tek yılsız satır. Sınıf adı yalnız son yıla yazılır (eski yılların sınıfı tutulmuyor).

## Kimle konuşur?

- Çağırdıkları: `../guvenlik` ([guvenlik.md](../guvenlik.md): `hataSay`, `hataSiniriDoldu`), `../http`
  ([http.md](../http.md): `bad`, `ok`, `sendJSON`), `../ortak` ([ortak.md](../ortak.md): `clean`, `tarihCoz`, `uid`),
  `../veri` (`depo`, `bildir`, `islem`), `./islem-kaydi` (`islemYaz`).
- Veri tabloları:
  - `depo.kullanicilar` → `kullanicilar`: `ogrenciTcIle`, `tcVarMi`, `okulNoVarMi`, `kullaniciAdiVarMi`,
    `bosKullaniciAdi`, `guncelle`, `okulunMuduru`; `velileri`, `cocuklari` → `veli_baglari` + `kullanicilar`;
  - `depo.okullar` → `okullar` (`bul`), `egitim_yillari` (`yillari`);
  - `depo.siniflar.bul` → `siniflar`;
  - `depo.ogrenciGecmisi` → `ogrenci_gecmisi` (`ekle`; aynı okul ve yıl ikinci kez yazılmaz, güncellenir) ve
    `okuldanCikar` → `etut_ogrencileri`, `kulup_uyeleri`, `servis_ogrencileri`, `ogrenci_konumlari`;
  - `bildir` → `bildirimler`; `islemYaz` → `islem_kaydi`.
- Onu çağıranlar: yalnız [hesaplar.md](hesaplar.md) — `hesapDogrula` içinde `baskaOkulOgrencisi` (toplu aktarımda
  da: başka okulun öğrencisi dosyayla eklenemez, tek tek eklenmeli) ve `hesap-ac`'ta `nakilEt`.
- Ön yüz: `public/js/parcalar/10b-hesaplar.js` — `409 nakil: 'dogum'` gelince doğum tarihi alanını gösterir,
  başarılı cevapta `hesap.nakil` ile ayrı bir sonuç penceresi (`nakilSonucu`) açar.
- Android uygulaması kullanmıyor.

## Nasıl çalışır (adım adım)?

```
hesap-ac { rol: student, tc, dogum, classId, okulNo }  (hesaplar.js)
  └ baskaOkulOgrencisi(tc) → st (başka okulda)
      └ nakilEt
          1. kişi saatte 10 yanlış denediyse           → 429
          2. dogum yok                                  → 409 nakil:'dogum'
          3. dogum ≠ st.dogum  (sayaç +1)               → 409 nakil:'dogum'
          4. yeni okulda aynı T.C. başka hesapta        → 400 alan:tc
          5. sınıf / okul no denetimi                   → 400 alan
          6. kullanıcı adı: yeni okulda boşsa aynı; değilse T.C.; o da alınmışsa addan boş ad
          7. TEK İŞLEM:
               ogrenci_gecmisi'ne eski okulun yılları
               eski okulun etüt / kulüp / servis listelerinden çıkar, ev konumu silinir
               kullanicilar: okul, sınıf, kullanıcı adı, okul no güncellenir;
                             müdür notu, seçili yıl ve seçili geçmiş temizlenir
          8. işlem kaydı ogrenci.nakil
          9. bildirimler: öğrenciye; her veliye (eski okulda başka çocuğu kalmadıysa
             velinin okulu da yeni okul olur); eski okulun müdürüne
```

## Dikkat!

- **Güvenlik kararı:** T.C. no tek başına yetmez; doğum tarihi de eşleşmeli ve yanlış deneme kişi başına saatte 10
  ile sınırlı. Yoksa T.C.'si bilinen her çocuk başka bir okula "çekilebilirdi".
- **Veri yerinde kalır:** eski okulun ödev, not ve devamsızlık satırları silinmez ve taşınmaz; o okulun kaydıdır.
  Yeni okul göremez; eski okul da öğrenciyi artık listelerinde görmez. Öğrenci ve velisi yıl seçicisindeki
  `ogrenci_gecmisi` satırlarıyla salt okunur bakar.
- **Yarış:** kullanıcı adı seçimiyle yazma arasında başkası aynı adı alırsa tekil indeks (`kullanicilar_kadi_okul`)
  işlemi durdurur; hiçbir şey değişmez. Hata burada yakalanmaz; `sunucu/index.js`
  veritabanı hatasını `400 { error, alan }`'a çevirir.
- **Yorum ile kod arasındaki fark:** dosyanın baş yorumu öğrencinin "etüt, kulüp ve servis listelerinden" çıktığını
  söyler; depo işlevi `okuldanCikar` bunlara ek olarak öğrencinin haritadaki ev konumunu (`ogrenci_konumlari`) da
  siler. Konum yeni okulda yeniden işaretlenir.
- **Sınıf yetkisi burada denetlenmez:** `nakilEt` gelen `classId`'nin yalnız bu okulun sınıfı olduğuna bakar.
  Normal hesap açmada sınıf seçimi `ogrenci.yerlestir` yetkisini ve rolün sınıf kapsamını ister (`hesapDogrula`,
  [hesaplar.md](hesaplar.md)); nakil yolunda bu denetim yok. Yani `ogrenci.hesap-ac` yetkisi olan ama yerleştirmesi
  belirli sınıflarla sınırlı bir öğretmen, naklettiği öğrenciyi kapsamı dışındaki bir sınıfa koyabilir (koddan
  çıkan davranış; kod değişmedi, "Güvenlik denetimi" işine not).
- Taşınan öğrencinin şifresi değişmez ve açık oturumları kapanmaz; yalnız okul bilgisi değişir. Seçili yıl ve
  seçili geçmiş temizlenir: eski okulun yılına bakılı kalmasın.
- Bildirimlerde öğrenciye giden kopya veliye ayrıca KOPYALANMAZ (`veliye: false`): velilere kendi metinleriyle ayrı
  bildirim gider.

## Testleri

- `testler/test-nakil.js` — okul A öğrenciyi açıp ödev ve devamsızlık girer, veli bağlanır; okul B aynı T.C.'yle
  doğum tarihsiz (409) ve yanlış doğum tarihiyle dener (hesap yerinde kalır), doğrusuyla taşır; aynı okulda ikinci
  kez eklenemez, eski okul aynı T.C.'yle yeni hesap açamaz; öğrenci aynı kullanıcı adı ve şifreyle girer; eski
  okulun ödev/devamsızlığı şimdiki görünümde yok, yıl seçicisinde önceki okul salt okunur; yeni okul eski kayıtları
  ve eski dönemi göremez, eski okul öğrenciyi göremez; veli bağı sürer, veli de önceki okulu seçebilir; ilgisiz
  kişi yıllara bakamaz; yanlış doğum tarihi denemesi kilitlenir.
- `testler/test-cakisma.js` — aynı T.C. iki okulda aynı anda açılırsa tek öğrenci hesabı çıkar, kaybeden okul
  `alan: 'tc'` ya da nakil sorusu (`409 nakil: 'dogum'`) alır; yeni okulda aynı T.C. bir servisçide kayıtlıysa
  öğrenci taşınmaz (`400 alan: 'tc'`) ve eski okulunda kalır.
- Elle: iki okul gerekir (yönetici panelinden ikinci okulu aç); A'da öğrenciyi doğum tarihiyle aç, B'de aynı T.C. ve
  doğum tarihiyle "Öğrenci ekle".

## Son durum

- Son commit `276c0a0 commit 521` (2026-09-27, çakışmalar): yeni okulda aynı T.C. başka hesaptaysa taşımadan önce
  `alan: 'tc'` ile durur (tekil indeks `kullanicilar_tc_okul`'a takılmadan); sınıf ve okul no hataları alanlı
  (`sinifId`, `okulNo`) oldu; kullanıcı adı yarışının nasıl durduğu yoruma yazıldı.
- Ondan önce `fb65e8d commit 422` (2026-09-26): dosya bu hâliyle eklendi (öğrenci nakli).
- Açık iş yok. "Yıl geçişi" işi (mezunlar, yeni yıl sihirbazı) geçmiş satırlarına (`ogrenci_gecmisi`) dokunabilir.
