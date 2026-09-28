# sunucu/bolumler/hesaplar.js

Okulun hesap işleri (`/api/school/...`): öğrenci ve servisçi hesabı açma/düzenleme/şifre/silme, öğretmeni kişi
koduyla okula ekleme, veliyi öğrenciye bağlama, okulun adresi ve haritadaki konumu.

## Bu dosya ne yapar?

Öğrenci ve servisçi siteye kendileri kaydolmaz; hesaplarını okul açar. Öğretmen ise kendi yetişkin hesabını açar
ve "kişi kodunu" müdüre verir; müdür kodu girince öğretmenin bu okuldaki rol satırı açılır. Bu dosya bu işlerin
tek tek yapılanlarını anlatır (toplu Excel/ODS/TXT aktarımı [kisi-aktarim.md](kisi-aktarim.md)'de; o dosya buradaki
doğrulayıcıyı kullanır).

Okulun açtığı hesapta kural müdürün tablosundaki gibidir:

- ad, soyad ve T.C. kimlik no zorunlu;
- kullanıcı adı boşsa T.C. no olur; şifre boşsa T.C. no olur ve kişi ilk girişte kendi şifresini koymadan devam
  edemez (`sifreDegismeli`);
- kullanıcı adı ve T.C. no okul içinde tektir (başka okulda aynısı olabilir), e-posta her yerde tektir;
- öğrencinin T.C. no'su bütün sistemde tektir: hesap kişiye aittir. Başka okulda kayıtlı T.C. yazılırsa yeni hesap
  açılmaz, doğum tarihi de eşleşirse var olan hesap bu okula taşınır ([nakil.md](nakil.md)).

Okul yönetimi hesabın T.C. numarasını görür (kendisi girdi); öğretmen ve öğrenciler görmez.

Veli bağlama da buradadır: okul, velinin T.C. no'su ya da kullanıcı adıyla onu öğrenciye bağlar (velinin kendisinin
veli koduyla bağlanma yolu ayrıca açıktır, [kisilik.md](kisilik.md)).

Uçlar [okul.md](okul.md)'nin kapısından sonra çağrılır: kişi zaten giriş yapmış, onaylı bir müdür ya da öğretmendir;
buradaki her uç kendi yetkisini ayrıca denetler.

## İçinde neler var?

### Sabitler

- `ROL_AD` — `{ student: 'öğrenci', teacher: 'öğretmen', servisci: 'servisçi' }` (işlem kaydı ve iletiler için).
  Dışa açık.
- `YETKI` — hangi rolün hesabında hangi işin hangi yetkiyi istediği. Dışa açık.

  | Rol | `ac` (aç) | `duzenle` | `sifre` | `sil` |
  |---|---|---|---|---|
  | `student` | `ogrenci.hesap-ac` | `ogrenci.duzenle` | `ogrenci.sifre` | — (okul öğrenci silemez) |
  | `teacher` | `ogretmen.onayla` | `ogretmen.duzenle` | `ogretmen.duzenle` | `ogretmen.cikar` |
  | `servisci` | `servis.yonet` | `servis.yonet` | `servis.yonet` | `servis.yonet` |

### Dışa açık işlevler

- `hesapDogrula(me, rol, g, mevcut, dosya)` — bir hesabın alanlarını doğrular (açarken `mevcut = null`, düzenlerken
  düzenlenen hesap). `g` gelen alanlar (`ad`, `soyad`, `fullName`, `tc`, `kullaniciAdi`, `eposta`, `dogum`,
  `telefon`, `adres`, `okulNo`, `sinifId`, `not`, `brans`, `rolId`, `sifre`); `dosya` toplu aktarımda aynı dosyanın
  öbür satırlarıyla çakışmayı yakalayan haritalar (`tc`, `kadi`, `eposta`, `no`). Döner: `{ sorunlar, alanlar, d,
  sifre, varsayilanSifre }` — `d` yazılacak alanlar (uygulama adlarıyla), `alanlar[i]` `sorunlar[i]`'nin form
  kutusu. Kurallar:
  - ad: yeni hesapta ya da gelmişse en az iki kelime (`adDuzelt`);
  - T.C.: yeni hesapta zorunlu; geçerli olmalı; okulda başka hesapta olmamalı; öğrencide başka okulun öğrencisinde
    olmamalı ("… 'Öğrenci ekle'den doğum tarihiyle birlikte tek tek ekle"); dosyada başka satırda olmamalı;
  - kullanıcı adı: boşsa T.C.; yalnız rakamsa kişinin kendi T.C.'si olmalı; kurala uymalı, okulda ve dosyada tek
    olmalı. Düzenlemede T.C. değişir ve kullanıcı adı eski T.C. ise o da yeni T.C. olur (T.C. silinecekse önce
    kullanıcı adı değişmeli);
  - e-posta: isteğe bağlı; biçim, her yerde tek, dosyada tek. Kişinin KENDİ açtığı hesabın e-postası okulca
    değiştirilemez ("… yalnızca kendisi değiştirebilir"): o onun kurtarma yoludur;
  - doğum: `gg.aa.yyyy` gibi yazılabilir (`tarihCoz`); olmayan gün ("Böyle bir gün yok") ya da anlaşılmayan biçim
    ayrı ileti; düzenlemede boş gelirse silinir;
  - telefon, adres (200);
  - öğrencide: okul no (okulda ve dosyada tek, boşluksuz, 20), sınıf (değişiyorsa `ogrenci.yerlestir` yetkisi ESKİ ve
    YENİ sınıfın ikisinde de), müdür notu (300);
  - öğretmende: branş (`SUBJECTS`'ten, büyük/küçük harf fark etmez), özel rol (değişiyorsa `rol.yonet` ister; kendine
    rol veremezsin; hazır Öğretmen rolü verilmez);
  - şifre yalnız yeni hesapta: boşsa ya da T.C.'ye eşitse `varsayilanSifre: true` (ilk girişte değiştirecek); değilse
    rolün şifre kuralı (`gucluSifreli({ role })`).
- `hesapNesnesi(me, rol, s, ozet)` — doğrulanmış alanlardan yeni hesap nesnesi: `approved`, okulun kimliği, müdürün
  il/ilçesi, `createdBy`, `okulActi: true`, `sifreDegismeli` = `varsayilanSifre`, şifre özeti. Öğrenciye yeni veli
  kodu (`yeniKisiKodu`) üretilir; servisçide kod yok.
- `adMaskele(ad)` — "Ayşe Yılmaz" → "Ay** Yı****": arama sonuçlarında tam ad verilmez. Dışa açık ama bugün yalnız
  bu dosyada kullanılıyor.
- `uclar(k, sub)` — okul.js'ten `sub` (= `segs[2]`) ile çağrılır; tanımadığı yolda `false`.

### İç işlevler

- `adSoyad(g)` — `ad` + `soyad` ayrı geldiyse birleştirir, yoksa `fullName`.
- `sorunCevabi(res, s)` — `400 { error: <bütün sorunlar '; ' ile>, alan: <ilk sorunun alanı> }`.
- `yonetilenHesap(me, id, islemAdi, rol)` — hesabı düzenleyecek kişinin yetkisi var mı ve hesap bu okulun mu? Hiçbir
  rol için yetkisi olmayan kişi hesabı ARAMADAN 403 alır (hesabın varlığını da öğrenmesin). Başka okulun ya da
  yönetilmeyen türün (veli, müdür) hesabı 404; öğrencide rolün sınıf kapsamı (`ogrenciKapsamindaMi`) → 403 "Bu
  sınıfın öğrencisi için yetkin yok".
- `hesapGorunumu(u, sinifAdi)` — düzenleme penceresine giden görünüm, T.C. dahil: `{ id, rol, fullName, username,
  email, tc, dogum, telefon, adres, okulNo, classId, className, brans, rolId, not, code (öğrencide), olusturan,
  girisYapti, sifreDegismeli, bagli }`. `bagli`: kendi yetişkin hesabından eşlenmiş öğretmen.
- `govdedenAlanlar(body)` — gövdedeki İngilizce ve Türkçe adları (`username`/`kullaniciAdi`, `password`/`sifre`,
  `email`/`eposta`, `classId`, `note`/`not`, `branch`/`brans`…) tek biçime çevirir. Yalnız gövdede OLAN alanlar
  alınır: düzenlemede dokunulmayan alan değişmez.
- `okulOgrencisi(me, id)` — bu okulun öğrencisi mi.
- `veliOlabilir(me, u)` — veli olarak bağlanabilir mi: onaylı ve rol satırı değil; rolsüz ya da veli hesabı, ya da
  bu okulun (kendi hesabıyla açılmış) öğretmeni/müdürü.
- `veliHesabi(u)` — aramada okul rolü satırı çıktıysa velilik onun yetişkin hesabınındır.

### Uçlar (`/api/school/<alt>`)

| Alt yol | Yöntem | Yetki | Gövde / sorgu → cevap |
|---|---|---|---|
| `hesap-ac` (eski ad `student-create`) | POST | rolün `ac` yetkisi | `{ rol: 'student'\|'servisci', ad, soyad, tc, kullaniciAdi, sifre, eposta, dogum, telefon, adres, okulNo, classId, not }` → `{ hesap, message }` |
| `hesap` | GET | rolün `duzenle` yetkisi | `?id=` → `{ hesap }` (T.C. dahil) |
| `hesap-guncelle` (eski ad `student-update`) | POST | rolün `duzenle` yetkisi | `{ id, …alanlar }` (eski adda `studentId`) → `{ hesap, student, message: 'Kaydedildi.' }` |
| `hesap-sifre` (eski ad `student-password`) | POST | rolün `sifre` yetkisi | `{ id, password?, degistirsin? }` (eski adda `studentId`; `sifre` da olur) → `{ message }` |
| `hesap-sil` | POST | rolün `sil` yetkisi | `{ id, onay: true }` → `{ message }` |
| `ogretmen-bul` | POST | `ogretmen.onayla` | `{ kod }` → `{ kisi: { ad (maskeli), zatenOkulda } }` |
| `ogretmen-ekle` | POST | `ogretmen.onayla` | `{ kod, brans?, rolId? }` → `{ hesap, message }` |
| `servisciler` | GET | `servis.yonet` | `{ servisciler: [{ id, fullName, username, telefon, girisYapti }] }` |
| `ogrenci-velileri` | GET | `ogrenci.duzenle` | `?studentId=` → `{ veliler: [{ id, fullName, username, role }] }` |
| `veli-bul` | GET | `ogrenci.duzenle` | `?kimlik=` (T.C. ya da kullanıcı adı) → `{ kisi }` |
| `veli-bagla` | POST | `ogrenci.duzenle` | `{ studentId, veliId }` → `{ message }` |
| `veli-coz` | POST | `ogrenci.duzenle` | `{ studentId, veliId }` |
| `adres` | GET | müdür ya da `okul.konum` | `{ kisaAd, ad, enlem, boylam }` |
| `adres` | POST | yalnız müdür | `{ kisaAd }` → `{ kisaAd, message }` |
| `konum` | POST | `okul.konum` | `{ enlem, boylam }` ya da `{ sil: true }` → `{ message }` |

Ayrıntılar:

- **`hesap-ac`** — `rol: 'teacher'` 400 ("Öğretmen hesabını öğretmen kendisi açar… 'Kodla ekle' ile kodu gir.");
  başka rol 400 ("Öğrenci ya da servisçi seç"). Kişi başına saatte 120 hesap (429, "Excel ile toplu açabilirsin").
  Öğrencide geçerli T.C. başka okulun öğrencisindeyse hesap açılmaz, `nakil.nakilEt` çağrılır (cevabı o verir;
  bu yolda `hesapDogrula` çalışmaz, dolayısıyla sınıf seçiminin `ogrenci.yerlestir` kapsamı da denetlenmez —
  ayrıntı [nakil.md](nakil.md) "Dikkat!").
  Hatada `sorunCevabi`. İşlem kaydı `hesap.acildi`. Cevaptaki `hesap`: `{ id, fullName, username, email, code,
  classId, varsayilanSifre }`; öğrencide aynı nesne eski istemciler için `student` adıyla da gelir. Varsayılan
  şifrede ileti "Kullanıcı adı ve şifre T.C. kimlik no; ilk girişte kendi şifresini belirleyecek."
- **`hesap-guncelle`** — eşlenmiş (kendi hesabından gelen) öğretmende yalnız `brans` ve `rolId` düzenlenir; başka
  alan gelirse 400 ("… kendisi kendi hesabından değiştirir"). `student-update` adıyla yalnız öğrenci ve 404 iletisi
  "Öğrenci bulunamadı".
- **`hesap-sifre`** — eşlenmiş öğretmende 400 ("… kendi hesabından değiştirir; unuttuysa 'Şifremi unuttum'"). Şifre
  boşsa ve hesabın T.C.'si varsa şifre T.C. olur; aksi hâlde hesabın şifre kuralı. `sifreDegismeli`: T.C.'ye
  döndüyse, `degistirsin: true` ise ya da şifre T.C.'ye eşitse. Şifre yazılması ve kişinin BÜTÜN oturumlarının (ve
  cihaz anahtarlarının) kapanması tek işlemde. Sonra hesabın hata kilidi kalkar (`girisBasarili`): e-postası olmayan
  öğrencinin "şifremi unuttum"u budur. Kişiye bildirim, işlem kaydı `sifre.mudur-degistirdi`.
- **`hesap-sil`** — yalnız öğretmen ve servisçi (öğrenci için `sil` yetkisi tanımlı değil, 403; depo sorgusu da
  yalnız bu iki rolü siler). Kendi hesabını silemezsin; `onay: true` şart. Bağlı kayıtlar şema kurallarıyla ya
  silinir ya sahipsiz kalır (ders, ödev: `SET NULL`). İşlem kaydı `ogretmen.cikarildi` ya da `hesap.silindi`.
  Eşlenmiş öğretmende yalnız bu okuldaki rol satırı gider, yetişkin hesabı durur; ona "… seni öğretmen listesinden
  çıkardı." bildirimi.
- **`ogretmen-bul` / `ogretmen-ekle`** — kod GÖVDEDE gelir (POST): adrese ve erişim günlüklerine düşmesin, içindeki
  `# + ? =` bozulmasın. Büyük/küçük harf duyarlı; boşluk ve tireler silinir (`kisiKoduSade`). Sınırlar: kişi başına
  dakikada 30 istek; IP başına saatte 30 YANLIŞ kod (429 "Bir saat sonra"). Kod bulunamazsa 404 ("… kod bir kez
  kullanılınca yenilenir."). `ogretmen-bul` yalnız maskeli adı ve kişinin zaten bu okulda olup olmadığını söyler.
  `ogretmen-ekle`: kişi bu okulda zaten müdür/öğretmense 400; en çok 10 okulda rol alabilir; `brans`/`rolId`
  `hesapDogrula` ile denetlenir. Rol satırı: `anaHesapId` = yetişkin hesabı, kullanıcı adı okulda boş bir ad
  (`okuldaBosAd`), e-posta yok, şifre alanı `'kullanilmaz'` (giriş yetişkin hesabıyla yapılır), aydınlatma onayı
  kişiden kopyalanır. Kodun harcanması (`eslesmeKoduTuket`: kod hâlâ eskisiyse yenisini yazar) ve satırın yazılması
  TEK işlemde. Kod bu arada kullanıldıysa 404 "Bu kod az önce kullanıldı…"; tekil indekse takılırsa (kişi bu arada
  okula eklendi ya da kullanıcı adı alındı) `400 { alan: 'kod' }` ve hiçbir şey yazılmaz. Kişiye bildirim ("… seni
  öğretmen olarak ekledi…"), işlem kaydı `ogretmen.eklendi`.
- **`veli-bul`** — kişi başına dakikada 60 arama. Kimlik yalnız rakamsa T.C. olarak doğrulanır; değilse kullanıcı
  adı olmalı. İki aday bakılır: okuldan bağımsız hesap ve bu okuldaki hesap (okul rolü satırıysa onun yetişkin
  hesabı). Uygun aday varsa `{ kisi: { id, fullName (maskeli), username, durum: 'uygun' } }`; hesap var ama veli
  olamıyorsa `{ kisi: { durum: 'uygun-degil' } }`. Okul araması yalnız BU okulun hesaplarında yapıldığı için
  "uygun değil" şunlardır: bu okulun öğrencisi ya da servisçisi, sistem yöneticisi, onaylı olmayan hesap. Bu
  okulun öğretmeni/müdürü uygundur (bağ onun yetişkin hesabına kurulur); hiç yoksa 404 ("Veli önce
  Eğitim Evi'ne kaydolmalı.").
- **`veli-bagla`** — bağ zaten varsa 400. Tek işlemde: rolsüz hesap veli yapılır (YALNIZ hâlâ rolsüzse; aynı anda
  başka bir role bağlandıysa 400 "… bu arada başka bir role bağlandı"), bağ yazılır, velinin okulu yoksa çocuğun
  okulu olur. Öğretmen/müdür rolünü korur. Veliye bildirim (`#/cocuklarim`), işlem kaydı `veli.baglandi`.
- **`veli-coz`** — bağı kaldırır; velinin okulu kalan çocuklarından yeniden hesaplanır, son çocuğu da giden veli
  rolsüz yetişkin hesabına döner (depo `bagiCoz`). İşlem kaydı `veli.cozuldu`.
- **`adres` (POST)** — okulun adresi `egitimevi.org/school/<kısa ad>`. Küçük harfe çevrilir, `kisaAdSorunu` ile
  denetlenir, başka okulda varsa 400. Aynı adres yeniden kaydedilirse "Okulun adresi zaten bu." (sayılmaz). Okul başına
  günde 10 GERÇEK değişiklik (reddedilenler ve aynısı sayılmaz; 429). Kaydedince statik sunucunun okul önbelleği
  boşaltılır (`okulOnbellekBosalt`): eski adres hemen "Okul bulunamadı" olur. İşlem kaydı `okul.adres`.
- **`konum`** — servis haritasındaki okul işareti. `enlem`/`boylam` sayı olmalı, sınırlar içinde, (0, 0) değil;
  6 ondalığa yuvarlanır. İşlem kaydı `okul.konum` (4 ondalık). `sil: true` konumu siler (kayıt yazılmaz).

## Kimle konuşur?

- Çağırdıkları:
  - `../guvenlik` ([guvenlik.md](../guvenlik.md)) — `hizSinir`, `hataSay`, `hataSiniriDoldu`, `istemciIp`,
    `girisBasarili`;
  - `../http` ([http.md](../http.md)) — `bad`, `ok`, `sendJSON`, `okulOnbellekBosalt`;
  - `../ortak` ([ortak.md](../ortak.md)) — `normTc`, `normEmail`, `normKullaniciAdi`, `normTelefon`, `tcSorunu`,
    `epostaSorunu`, `kullaniciAdiSorunu`, `telefonSorunu`, `sifreSorunu`, `dogumSorunu`, `kisaAdSorunu`,
    `kisiKoduSade`, `gucluSifreli`, `tarihCoz`, `metinYap`, `adDuzelt`, `clean`, `SUBJECTS`, `uid`, `now`;
  - `../sifre` ([sifre.md](../sifre.md)) — `hashPw`;
  - `../yetki` ([yetki.md](../yetki.md)) — `yetkiVarMi`, `ogrenciKapsamindaMi` (`pub` içe alınmış, kullanılmıyor);
  - `../veri` — `depo`, `bildir`, `islem`, `cakisma`;
  - bölümler: [nakil.md](nakil.md) (`baskaOkulOgrencisi`, `nakilEt`), `./islem-kaydi` (`islemYaz`).
- Veri tabloları:
  - `depo.kullanicilar` → `kullanicilar`: `bul`, `ekle`, `guncelle`, `tcVarMi`, `kullaniciAdiVarMi`, `epostaVarMi`,
    `okulNoVarMi`, `yeniKisiKodu`, `hesabiSil`, `eslesmeKoduyla`, `eslesmeKoduTuket`, `rolleri`, `okuldaBosAd`,
    `okulun`, `tcIle`, `kullaniciAdiyla`, `rolsuzuVeliYap`; veli bağları → `veli_baglari`: `velileri`, `bagliMi`,
    `bagla`, `bagiCoz`;
  - `depo.oturumlar.hepsiniKapat` → `oturumlar`, `cihaz_anahtarlari`;
  - `depo.okullar` → `okullar`: `bul`, `kisaAdVarMi`, `kisaAdYaz`, `konumYaz`;
  - `depo.siniflar.bul` → `siniflar`; `depo.roller.bul` → `roller` (+ yetki tabloları);
  - `bildir` → `bildirimler`; `islemYaz` → `islem_kaydi`.
- Onu çağıranlar: [okul.md](okul.md) (`hesaplar.uclar(k, sub)`, bütün `/api/school` isteklerinde önce buraya
  sorulur) ve [kisi-aktarim.md](kisi-aktarim.md) (`hesapDogrula`, `hesapNesnesi`, `ROL_AD`, `YETKI`).
- Ön yüz (`public/js/parcalar/`): `10b-hesaplar.js` (hesap-ac, hesap, hesap-guncelle, hesap-sifre, hesap-sil,
  ogretmen-bul, ogretmen-ekle), `10-mudur.js` (ogrenci-velileri, veli-bul, veli-bagla, veli-coz),
  `16b-okul-ayarlari.js` (adres, konum), `19c-okul-hayati.js` (servisciler). Eski adlar (`student-create`,
  `student-update`, `student-password`) yalnız testlerde kullanılıyor.
- Android uygulaması bu uçları çağırmıyor.

## Nasıl çalışır (adım adım)?

Öğrenci ekleme:

```
POST /api/school/hesap-ac { rol: 'student', ad, soyad, tc, dogum, ... }
  rol öğretmen mi? → 400 "kodla ekle"
  yetki (ogrenci.hesap-ac), saatte 120
  T.C. geçerli ve başka okulun öğrencisinde mi?
     evet → nakil.nakilEt (doğum tarihi eşleşirse hesap bu okula taşınır)
  hesapDogrula → sorun varsa 400 { error, alan }
  hesapNesnesi (+ veli kodu) → şifre özeti → kullanicilar'a ekle → işlem kaydı
```

Öğretmeni kodla ekleme:

```
öğretmen:  + Ekle > Öğretmen → kişi kodunu müdüre verir
müdür:     ogretmen-bul { kod }  → "Ay** Yı****", zatenOkulda?
           ogretmen-ekle { kod, brans, rolId }
             ├ tek işlem: eslesmeKoduTuket(kişi, kod, yeniKod)  (kod eskiyse → 0 satır → 404)
             │            kullanicilar'a rol satırı (anaHesapId = kişi)
             └ bildirim + işlem kaydı
öğretmen:  menüdeki "Portallarım"dan okuluna geçer
```

Veli bağlama: `veli-bul ?kimlik=` (maskeli ad) → `veli-bagla { studentId, veliId }` (rolsüzse veli yapılır) →
`veli-coz` ile geri alınır.

## Dikkat!

- **Kişinin kendi açtığı hesabın e-postasına okul dokunamaz**: o e-posta şifre sıfırlamanın tek yoludur; okul
  değiştirebilseydi hesabı ele geçirebilirdi.
- **Maskeli adlar:** `ogretmen-bul` ve `veli-bul` tam adı vermez; aksi hâlde kod ya da T.C. ile ad öğrenme aracına
  dönerlerdi. Kodlar yanlış denemede IP başına sayılır.
- **Yetkisi olmayan hesabı aramadan 403 alır** (`yonetilenHesap`): hesabın var olup olmadığını öğrenemez.
- **Kod tek kullanımlık ve yarışa dayanıklı:** kodun harcanması ile rol satırının yazılması aynı işlemde; aynı kod
  aynı anda iki kez kullanılırsa yalnız biri geçer (öteki 0 satır görür, 404 "Bu kod az önce kullanıldı…").
  `test-cakisma.js` aynı kodla eş zamanlı iki `ogretmen-ekle` gönderir ve tek rol satırı açıldığını denetler.
- **`veli-bul` T.C.'yi sorgu dizesinde (adreste) alır.** `ogretmen-bul` kodu "adrese ve günlüklere düşmesin" diye
  POST'a taşınmıştı; `veli-bul` hâlâ GET. Uygulamanın kendisi istek adreslerini günlüğe yazmaz, ama önündeki ters
  vekil (kurulum belgesindeki Caddy) erişim günlüğü tutuyorsa T.C. oraya düşer — "Güvenlik denetimi" işinde bakılmalı.
- **Şifre değişince oturumlar kapanır:** `hesap-sifre` kişinin bütün oturumlarını ve telefon cihaz anahtarlarını
  siler (şifresini bilen biri açık oturumla devam edemesin).
- **Öğrenci hesabı okulca silinemez** (hesap kişiye aittir, nakille taşınır). Okulun öğretmen silmesi eşlenmiş
  öğretmende yalnız rol satırını kaldırır.
- **Adres değişince eski adres hemen ölür** (önbellek boşaltılır); eski bağlantıları paylaşan okul uyarılmalı —
  yönetim panelindeki Site Ayarları bunu ayrıca söyler.
- `hesap-ac`'ta öğretmen yolu kapalı: öğretmen kendi yetişkin hesabını açar ve okula kişi koduyla eklenir
  (dosyanın baş yorumu). `YETKI.teacher.ac` bugün yalnız `ogretmen-bul`/`ogretmen-ekle`'nin `ogretmen.onayla`
  yetkisiyle aynı addır.
- `pub` içe alınmış ama kullanılmıyor (zararsız).

## Testleri

- `testler/test-yonetim.js` — okulun açtığı hesaplar: zorunlu alanlar, boş kullanıcı adı/şifrenin T.C. olması ve
  ilk girişte şifre zorunluluğu, okul içi benzersiz kullanıcı adı (okul adresinden giriş), öğretmen/servisçi
  düzenleme (okul, kodla eklenen öğretmenin kullanıcı adını değiştiremez; yalnız branş), şifre yenileme (boş şifre →
  T.C. ve "değiştirmesi isteniyor"), silme (öğrenci hesabı bu uçtan silinmez; kodla eklenen öğretmen çıkarılınca
  yetişkin hesabı durur), öğretmen hesabı açılamaması ("koda yönlendiriyor"), servisçi hesabı ve listesi, yetkisiz
  öğretmen ve başka okulun hesabı, eski uç adları.
- `testler/test-veli-coklu.js` — veli-bul (T.C. boşluklu da olur, ad maskeli, geçersiz T.C., kayıtsız T.C. 404,
  kullanıcı adıyla), öğrencinin veli olamaması, veli-bagla (aynı bağ iki kez olmaz, rolsüz hesap veli olur,
  bildirim), ogrenci-velileri, veli-coz, başka okulun müdürünün ve yetkisiz öğretmenin bağlayamaması; başka okulun
  öğretmeninin YETİŞKİN hesabının bulunup rol satırının veli yapılamaması.
- `testler/test-kisi-kodu.js`, `testler/test-yetiskin.js` — ogretmen-bul/ogretmen-ekle (tek kullanımlık kod, kod
  yenileme, tireli yazım), eşlenmiş öğretmenin okuldan çıkarılması.
- `testler/test-cakisma.js` — aynı T.C./kullanıcı adı/e-postanın hesap açma, düzenleme, kodla öğretmen ekleme ve veli
  bağlamada yarışla bile çift olmaması.
- `testler/test-nakil.js` — başka okulun öğrencisinin T.C.'siyle `hesap-ac` (nakil).
- `testler/test-rol.js` — `konum` yetkisi (yetkisiz öğretmen konum ayarlayamaz, yetkili kaydeder, adres değişmez,
  işlem kaydı), `student-password` yetkisiz reddi.
- `testler/test-site-ayarlari.js`, `testler/test-servis-konum.js`, `testler/test-okul-agi.js` — adres, servisçi
  listesi ve konum; müdürün verdiği yeni şifrenin kilidi kaldırması.
- `testler/yetki-denetimi.js`, `testler/girdi-denetimi.js` — rol × uç, bozuk girdi.
- Elle: `testler/seed.js`'teki müdürle gir, Öğrenciler > Öğrenci ekle; Öğretmenler > Kodla ekle.

## Son durum

- Son commit `566b917 commit 524` (2026-09-27): `hesap-sifre` yeni şifreden sonra hesabın hata kilidini kaldırır
  (`girisBasarili`).
- `153d63d commit 522`: yorum — kişi kodunda boşlukların yanında tireler de silinir (16 haneli, 4'erli tireli kod).
- `276c0a0 commit 521`: doğrulayıcı her sorunun alanını (`alan`) döndürmeye başladı (form kutuyu kırmızı gösterir);
  e-posta denetimi `epostaSorunu`'na geçti; `ogretmen-ekle` tekil indeks çakışmasını açık iletiyle karşılar; adres
  değişince okul önbelleği boşalır.
- Açık iş: `veli-bul`'un T.C.'yi adreste taşıması (yukarıda). Sıradaki "Çalışan olarak ekleme" işi (+ Ekle'de
  "Çalışan"; kodla eklenen rolsüz, müdür rol atar) `ogretmen-bul`/`ogretmen-ekle`'nin yerini alacak ya da
  genişletecek.
