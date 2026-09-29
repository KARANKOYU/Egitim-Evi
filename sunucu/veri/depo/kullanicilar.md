# sunucu/veri/depo/kullanicilar.js

Hesaplarla ilgili bütün SQL: kullanıcıyı bulmak (kimlik, e-posta, kullanıcı adı, T.C., kişi kodu), girişte yazılan kimliği
çözmek, benzersizlik ön denetimleri, yetişkin hesabının okul rolü satırları, okul/sınıf/öğretmen listeleri, sayaçlar,
veli-çocuk bağları, mesaj engelleri ve açılıştaki kişi kodu / e-posta bakımı.

## Bu dosya ne yapar?

`kullanicilar` tablosu uygulamanın kalbidir: müdür, öğretmen, öğrenci, servisçi, veli, rolsüz yetişkin ve sistem
yöneticisi aynı tabloda durur. Bu dosya o tabloya (ve iki küçük yan tabloya: `veli_baglari`, `mesaj_engelleri`) giden
bütün sorguları toplar. Bölümler (`sunucu/bolumler/*.js`) "şu kişiyi bul", "bu kullanıcı adı alınmış mı", "bu öğretmenin
öğrencileri kim" diye sorar; SQL'i hiç görmez.

Anlaman gereken üç fikir var:

1. **İki ad alanı.** Okulun açtığı hesaplar (müdür, öğretmen, öğrenci, servisçi) okula aittir: kullanıcı adı ve T.C. no
   yalnız o okulun içinde tektir. Veli, yönetici ve rolsüz yetişkin hesapları okuldan bağımsızdır ve kendi aralarında
   tektir (009 şema dosyası). Bu yüzden `kullaniciAdiyla`, `tcIle`, `kullaniciAdiVarMi`, `tcVarMi` hep "okulId verildi mi?"
   diye iki yola ayrılır. Sistem yöneticisinin kullanıcı adı ise hiçbir hesapla aynı olamaz (031).
2. **Yetişkin hesabı ve rol satırları.** Kendisi kaydolan tek tür hesap yetişkin hesabıdır. Bir yetişkin A okulunda
   öğretmen, B okulunda müdür olabilir; her okul rolü `ana_hesap_id` ile yetişkin hesabına bağlı AYRI bir satırdır (012).
   Rol satırlarının e-postası yoktur ve girişte aranmaz (`GIRIS` koşulu).
3. **Zenginleştirme.** Dönen her kullanıcı nesnesine okul adı (`_okulAdi`, `_okulKisaAd`, `_okulDurum`), özel rolü
   (`_rol`) ve öğretmense okulunun hazır Öğretmen rolünün yetkileri (`_ogretmenYetkileri`) iliştirilir. Böylece
   [../../yetki.md](../../yetki.md)'deki `pub()` ve yetki denetimleri ayrıca sorgu atmaz.

Satırı uygulama nesnesine çeviren [../esleme.md](../esleme.md)'deki `kullanici(r)`'dir: `{ id, username, email, pass,
fullName, role, tc, status, schoolId, classId, customRoleId, seciliYil, ... okulNo, sifreDegismeli, anaHesapId,
eslesmeKodu, createdAt }`. Rolsüz hesapta `role` boş metindir (`''`).

## İçinde neler var?

### Ortak iç parçalar

- `SEC` — `kullanicilar k LEFT JOIN okullar o` ile her sütun + `okul_adi`, `okul_kisa_ad`, `okul_durum`.
- `AD_SIRASI()` — `ORDER BY k.ad_soyad` + Türkçe sıralama eki `tr()` ([../baglanti.md](../baglanti.md)).
- `zenginlestir(satirlar)` — satırları `e.kullanici` ile çevirir; özel rolü olanlar için
  `sunucu/veri/depo/roller.js`'teki `haritasi(rolIdler)`'den `_rol`, öğretmenler için `roller.ogretmenYetkileri(okulIdler)`'den
  `_ogretmenYetkileri` ekler (en çok iki ek sorgu, kişi sayısından bağımsız). Dışa açık ama dışarıdan çağıran yok.
- `coklu(kosul, p, sira)` / `bir(kosul, p)` (iç) — `SEC + WHERE kosul` (+ ad sırası ya da `LIMIT 1`) ve zenginleştirme.
  `kosul` hep bu dosyadaki sabit metinlerden kurulur; değerler `$n` ile gider.
- `OKUL_HESABI` = `k.rol IN ('principal','teacher','student','servisci')`; `GENEL_HESAP` = `k.rol IS NULL OR k.rol IN
  ('admin','parent')`; `GIRIS` = `AND k.ana_hesap_id IS NULL` (rol satırları girişte aranmaz).

### Tek kullanıcı bulma (hepsi zenginleştirilmiş nesne ya da `null`)

- `bul(id)` — kimlikle. Boş kimlikte sorgu atmadan `null`. Okul süzmez: kapsamı çağıran denetler.
- `epostayla(eposta)` — `k.eposta = $1`. Adres normalleştirilmiş gelmelidir (`sunucu/ortak.js` `normEmail`).
- `kullaniciAdiyla(ad, okulId)` — `okulId` varsa o okulun okul hesabı, yoksa okuldan bağımsız hesap.
- `tcIle(tc, okulId)` — aynı ayrım, T.C. no ile.
- `ogrenciTcIle(tc)` — `rol = 'student' AND tc_kimlik = $1`, okul fark etmeksizin (öğrencinin T.C.'si bütün sistemde
  tektir, 021). Kayıt ve nakil kullanır.
- `kodlaOgrenci(kod)` — veli koduyla öğrenci (`rol = 'student' AND veli_kodu = $1`). Kod boşluksuz, tiresiz gelmelidir
  (`kisiKoduSade`'den geçmiş; büyük/küçük harf duyarlı).
- `girisKimligiyle(kimlik, okulId)` — girişte yazılan kimliği çözer; dönüş `{ u, yedek?, belirsiz? }`:
  - `@` içeriyorsa: `{ u: e-postası bu olan, rol satırı olmayan hesap }`.
  - `okulId` varsa (okul adresinden girildi): önce o okulun okul hesabı (kullanıcı adıyla; bulunamazsa ve kimlik 11 haneli
    T.C. biçimindeyse `tc_kimlik` ile). Bulunduysa `{ u: okul hesabı, yedek: aynı adlı yetişkin hesabı }`, bulunamadıysa
    `{ u: yetişkin hesabı }`.
  - `okulId` yoksa: yetişkin hesabı varsa `{ u: yetişkin, yedek: ad tek bir okulda varsa o okul hesabı }`; yetişkin yok,
    ad birden çok okulda varsa `{ u: null, belirsiz: true }` (kişiden okulunu seçmesi istenir); yoksa tek okul hesabı ya da
    `null`. "Yedek": şifre birincisinde tutmazsa ikincisinde denenir (karar [../../bolumler/kayit.md](../../bolumler/kayit.md)'de).

### Yetişkin hesabı ve okul rolleri

- `yetiskinMi(u)` — SQL'siz: `anaHesapId` yok ve rolü boş ya da `parent` ise `true` (portallar, kişi kodu, "+ Ekle" bu
  hesaplarda var).
- `rolleri(anaId)` — yetişkinin okul rolü satırları (`ana_hesap_id = $1`, `ORDER BY k.olusturma`), okul adıyla.
- `rolSatirlariniGuncelle(anaId, ad, telefon)` — yetişkin adını/telefonunu değiştirince rol satırlarına da yazar
  (okuldaki listelerde güncel ad görünsün).
- `rolSatirlarinaKvkk(anaId, kvkk)` — aydınlatma metni onayını (`kvkk_onay = true`, `kvkk_tarih`, `kvkk_surum`) rol
  satırlarına da yazar.
- `rolSatiriniSil(id, anaId)` — `DELETE ... WHERE id = $1 AND ana_hesap_id = $2`: yalnız bu yetişkinin o satırı silinir
  (rolü bırakma / kaldırma). Dönüş silinen satır sayısı.

### Kişi kodu

"Kişi kodu" iki sütunda durur: öğrencide `veli_kodu` (veliyle paylaşılır), yetişkinde `eslesme_kodu` (okula verilir, tek
kullanımlık). İkisi de 16 haneli ve aynı biçimde üretilir (`sunucu/ortak.js` `kisiKoduUret`; biçim 027 ve 032).

- `eslesmeKoduyla(kod)` — kodu taşıyan yetişkin hesabı (rol satırı değil, rolü boş ya da `parent`). Okul süzülmez: kod
  kişiye aittir.
- `eslesmeKoduSahibi(kod)` — kod kimdeyse (rolüne bakılmaz); yönetici "Okul aç"ta "kendine / yöneticiye olmaz" diyebilsin.
- `eslesmeKoduYaz(id, kod)` — kodu doğrudan yazar ("kodu yenile", araç ve testler).
- `eslesmeKoduTuket(id, eski, yeni)` — `UPDATE ... SET eslesme_kodu = yeni WHERE id = $1 AND eslesme_kodu = eski`; tam bir
  satır değiştiyse `true`. Aynı kodu aynı anda iki okul kullanmaya kalkarsa yalnız biri geçer, öteki 0 satır görür.
- `kodVarMi(kod)` — kod `veli_kodu` ya da `eslesme_kodu` olarak herhangi bir satırda var mı.
- `yeniKisiKodu()` — `kisiKoduUret()` ile üretir, `kodVarMi` boş çıkana kadar yeniler.
- `eksikKodlariDoldur()` — açılışta: kodu boş öğrencilere veli kodu, rolsüz/veli yetişkin hesaplarına kişi kodu yazar.
  Kullanılan kodları belleğe alır, çakışmasız üretir, iki `UPDATE ... FROM unnest(...)` ile tek işlemde (`islem`) yazar;
  arada biri aynı kodu aldıysa (`23505`) baştan dener, 5 denemede olmazsa hata fırlatır. Dönüş: doldurulan sayı.

### Müdür ve okul

- `okulunMuduru(okulId)` — `rol = 'principal' AND okul_id = $1 AND durum = 'approved'`, `LIMIT 1` (sırasız). Çağıranlar
  bunu müdüre bildirim göndermek için kullanır: öğretmen okuldan ayrılınca ([../../bolumler/kisilik.md](../../bolumler/kisilik.md))
  ve öğrenci başka okula nakledilince eski okulun müdürüne ([../../bolumler/nakil.md](../../bolumler/nakil.md)).
- `okulunMuduruVarMi(okulId)` — durumuna bakmadan bir müdür satırı var mı; yönetici müdürü kaldırılmış (sahipsiz) okula
  yeni müdür atayabilsin diye ([../../bolumler/yonetici-okul.md](../../bolumler/yonetici-okul.md)).
- `okuldaKimseVarMi(okulId)` — müdür dışında biri var mı. Bugün çağıran yok.

### Benzersizlik ön denetimleri (hepsi `true`/`false`)

- `epostaVarMi(eposta, haricId)` — adres başka bir hesapta mı (`id <> haricId`).
- `kullaniciAdiVarMi(ad, haricId, okulId)` — `okulId` varsa: o okulun okul hesaplarında YA DA herhangi bir yöneticide
  (031); yoksa okuldan bağımsız hesaplarda.
- `kullaniciAdiHerhangiYerde(ad)` — ad hiçbir hesapta (okul ya da genel) kullanılmıyor olmalı: kaydolan yetişkin bir
  okuldaki adı alamaz (ana sayfadan girişte kimin kastedildiği karışmasın).
- `kullaniciAdiBaskasinda(ad, anaId)` — yetişkin kendi adını ve kendi rol satırlarındaki kopyaları saymadan (hesap
  bilgisi değiştirirken).
- `tcVarMi(tc, haricId, okulId)` — kullanıcı adındaki iki ad alanı kuralıyla.
- `okulNoVarMi(okulId, no, haricId)` — okul numarası o okulun öğrencilerinde tek mi.

### Ad önerileri

- `bosKullaniciAdi(kok, okulId)` — "Ece Çınar" → `ece.cinar`: Türkçe küçük harf, ı/ş/ğ/ü/ö/ç sadeleşir, aksanlar silinir,
  boşluk nokta olur, `[a-z0-9._]` dışı atılır, baştaki harf olmayanlar kırpılır; 3 karakterden kısaysa başına `ogrenci`
  eklenir; 24 karaktere kesilir; alınmışsa `ece.cinar2`, `3` … (her deneme bir sorgu).
- `okuldaBosAd(ad, okulId)` — öğretmen rol satırı açılırken: yetişkinin kendi adı okulda boşsa o, değilse ilk 27 karakter
  + `2`, `3` …

### Şifre ve giriş

- `girisYazildi(id)` — `son_giris = now()`. Toplu giriş bilgisi dağıtımı "hiç girmemiş" öğrencileri buna bakarak seçer.
- `topluSifreYaz(okulId, liste)` — `liste = [{ id, ozet }]`. Tek `UPDATE ... FROM unnest($2, $3)`: yalnız `okul_id = $1`
  ve `rol = 'student'` olan satırlara yeni şifre özeti, `son_giris = NULL` (yeni şifreyle girene kadar "girmemiş" sayılır),
  `sifre_degismeli = true`. Sonra bu kişilerin `oturumlar` ve `cihaz_anahtarlari` satırları silinir. Dönüş: şifresi
  yazılan öğrenci sayısı.
- `sifreDegisti(id)` — `sifre_degismeli = false`. Bugün çağıran yok (bölümler aynı işi `guncelle(id, { sifreDegismeli:
  false })` ile yapıyor).
- `hesabiSil(id, okulId)` — yalnız bu okulun öğretmen ya da servisçi hesabını siler (`okul_id` ve `rol` koşullu). Bağlı
  kayıtlar şema kurallarıyla ya silinir ya sahipsiz kalır (ders, ödev: `SET NULL`).
- `rolsuzuVeliYap(id)` — `rol IS NULL` ise `parent` yapar (rolsüz kişi veli kodu girince).

### Listeler ve sayaçlar

- `okulun(okulId, secim)` — okulun kullanıcıları, ad sırasıyla. `secim`: `{ rol, roller: [..], durum, sinifsiz }`;
  koşullar sırayla `$2, $3 …` olarak eklenir.
- `sinifOgrencileri(sinifId)` — sınıfın öğrencileri.
- `ogretmeninOgrencileri(ogretmenId)` — öğretmenin ders verdiği sınıflardaki öğrenciler; ayrıca öğretmenle AYNI OKUL
  şartı (okuldan ayrılmış birinin derste kalmış eski bağı başka okuldan kapı açmasın). Öğretmen-öğrenci ilişkisi YALNIZ
  `dersler` tablosundan türer.
- `ogrencininOgretmenleri(ogrenciId)` — öğrencinin sınıfındaki derslere atanmış, aynı okuldaki, onaylı öğretmenler.
- `adminler()` — bütün yöneticiler. Bugün çağıran yok.
- `mudurlerSayimli()` — yönetici paneli: her müdür satırı + okul adı/durumu + okulun öğretmen ve öğrenci sayısı. Ham satır
  döner (`id, ad_soyad, kullanici_adi, eposta, durum, il, ilce, olusturma, okul_adi, okul_durum, ogretmen, ogrenci`);
  rol satırının e-postası olmadığı için `coalesce(k.eposta, a.eposta)` ile yetişkin hesabınınki alınır.
- `okulSayimlari(okulId)` — müdür ana sayfası, tek sorgu: `{ ogrenci, sinifsiz, ogretmen (onaylı), bekleyen (onay
  bekleyen öğretmen), sinif }`.
- `sayimlar()` — yönetici paneli: `{ okul (onaylı), mudur (onaylı), ogretmen (onaylı), ogrenci, veli }`.

### Açılış bakımı (031)

- `eskiEpostalariSadelestir()` — eski sürümün yalnız küçük harfe çevirip sakladığı, ASCII dışı karakter ya da boşluk
  taşıyan adresleri (`eposta !~ '^[!-~]+$'`, en çok 5000) bugünkü `normEmail` biçimine getirir. Aynı biçimde başka hesap
  varsa ya da yazarken `23505` gelirse dokunmaz ve `cakisan`'a ekler; `23514` (001'deki küçük harf CHECK'ine uymayan
  harf) gelirse olduğu gibi bırakır. Dönüş `{ duzeltilen, cakisan: [adres] }`.
- `cakismaRaporu()` — kurallara aykırı kalan eski veriyi sayar: `ogrenciTcCift` (yalnız `kullanicilar_tc_ogrenci` indeksi
  kurulamadıysa, aynı T.C.'li öğrenci grupları), `yoneticiAdCift` (yöneticinin adını taşıyan öbür hesapların adları, en çok
  20), `epostaCift` (`normEmail`'le aynı çıkan farklı yazılmış adresler, `"a = b"`, en çok 500 aday). Sunucu açılışta
  pencereye yazar ([../index.md](../index.md)).

### Yazma

- `ekle(u)` — `e.kullaniciSutunlari(u)` + `id` ile [../yazici.md](../yazici.md)'deki `ekle`; dönüş `bul(u.id)`.
- `guncelle(id, degisiklik)` — uygulama alan adlarıyla (`{ fullName, classId, pass, sifreDegismeli … }`); yalnız
  TANIMLI alanlar yazılır. Dönüş yok.
- `sil(id)` — satırı siler. Bağlı tablolar şemadaki `ON DELETE` kurallarına göre silinir ya da `NULL` olur.

Üçü de okul süzmez; bir tekil indekse takılırsa `23505` yukarı gider ve [../baglanti.md](../baglanti.md)'deki `hataCevir`
alanıyla birlikte ("Bu e-posta başka bir hesapta kayıtlı." gibi) çevirir.

### Veli-çocuk bağı (`veli_baglari`)

- `cocuklari(veliId)` — `[{ id, fullName, schoolId, schoolName, code }]`, bağlanma sırasıyla (burada `esleme` kullanılmaz,
  nesne elle kurulur).
- `bagliMi(veliId, ogrenciId)` — bağ var mı (velinin çocuğa ait her isteğinde kapı bu).
- `bagla(id, veliId, ogrenciId, zaman)` — `ON CONFLICT (veli_id, ogrenci_id) DO NOTHING`: ikinci kez bağlamak hata vermez.
- `bagiCoz(veliId, ogrenciId)` — tek işlemde: bağı siler; veli yetişkin hesabıysa (rol satırı değil, rolü boş ya da
  `parent`) okulunu kalan ilk çocuğunun okulundan yeniden hesaplar (çocuk kalmadıysa `NULL`); son çocuğu da gittiyse
  `rol = NULL` yapar (rolsüz yetişkine döner, boş veli menüsü hata vermez). Okulun öğretmeni/müdürü olan eski usul
  hesabın okuluna dokunmaz.
- `velileri(ogrenciId)` — öğrencinin ONAYLI velileri (zenginleştirilmiş).
- `veliHaritasi(ogrenciIdler)` — tek sorguda `Map(ogrenciId → [veliId])`, yalnız onaylı veliler.
- `ilkCocugununOkulu(veliId)` — okulu olan ilk çocuğun okul kimliği ya da `''` (okulu boş veliler için,
  [../../yetki.md](../../yetki.md)).
- `cocukIdleri(veliId)` — çocukların kimlikleri.

### Mesaj engelleri (`mesaj_engelleri`)

- `engelliler(id)` — kişinin engellediklerinin kimlikleri.
- `engelleriYaz(id, liste)` — tek işlemde eski listeyi siler, yenisini satır satır yazar (`ON CONFLICT DO NOTHING`).
- `engelHaritasi(idler)` — `Map(id → [engellenen])`, tek sorgu.

### Tablolar ve şema dosyaları

| Tablo / sütun | Kuran / değiştiren şema dosyası |
|---|---|
| `kullanicilar` (temel sütunlar, `eposta UNIQUE`, `kullanicilar_veli_kodu_tekil`, `kullanicilar_okul_rol`, `kullanicilar_sinif`) | `001-ilk.sql` |
| `kullanici_adi`, `tc_kimlik`; `rol` ve `eposta` boş olabilir | `003-kullanici-adi.sql` |
| `son_giris` | `005-son-giris.sql` |
| `servisci` rolü, ad biçimi, `kullanicilar_kadi_okul/_genel`, `kullanicilar_tc_okul/_genel`, `okul_no` + `kullanicilar_okul_no`, `sifre_degismeli` | `009-okul-adresi-hesaplar.sql` |
| `ana_hesap_id` + `kullanicilar_ana_hesap`, `kullanicilar_rol_satiri` CHECK, `kullanicilar_ana_okul`, `eslesme_kodu` + tekil indeks, `kullanicilar_bekleyen_basvuru` | `012-yetiskin-hesap.sql` |
| `okul_acti` | `014-okul-acti.sql` |
| telefon biçimi (ülke kodu) | `015-telefon-ulke-kodu.sql` |
| `secili_gecmis`, `kullanicilar_tc_ogrenci` | `021-ogrenci-gecmisi.sql` |
| kişi kodu biçimi | `027-kisi-kodu.sql`, `032-kisi-kodu-16.sql` |
| `kullanicilar_tc_ogrenci` yeniden deneme, `kullanicilar_yonetici_adi` indeksi ve tetikleyicisi (`kullanicilar_kadi_yonetici`) | `031-cakismalar.sql` |
| `veli_baglari` (`UNIQUE (veli_id, ogrenci_id)`, `veli_baglari_ogrenci`), `mesaj_engelleri` (kendini engelleme CHECK'i) | `001-ilk.sql` |

Dokunduğu öbür tablolar: `okullar` (okul adı için `LEFT JOIN`), `dersler` (öğretmen-öğrenci ilişkisi), `siniflar`
(sayaç), `oturumlar` ve `cihaz_anahtarlari` (`topluSifreYaz`), `pg_indexes` (`cakismaRaporu`).

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`, `tr`),
  [../../ortak.md](../../ortak.md) (`kisiKoduUret`, `normEmail`), [../esleme.md](../esleme.md) (`kullanici`,
  `kullaniciSutunlari`, `bos`), [../yazici.md](../yazici.md) (`ekle`, `guncelle`, `sil`), `sunucu/veri/depo/roller.js`
  (`haritasi`, `ogretmenYetkileri`).
- Uygulamaya [../index.md](../index.md)'deki `depo.kullanicilar` olarak açılır. Çağıranlar (başlıcaları):
  - [../../bolumler/kayit.md](../../bolumler/kayit.md) — giriş (`girisKimligiyle`, `girisYazildi`), kayıt (`epostaVarMi`,
    `kullaniciAdiHerhangiYerde`, `tcVarMi`, `ogrenciTcIle`, `bosKullaniciAdi`, `yeniKisiKodu`, `ekle`), KVKK ve ad
    değişikliğinin rol satırlarına yazılması (`rolSatirlarinaKvkk`, `rolSatirlariniGuncelle`).
  - [../../bolumler/hesaplar.md](../../bolumler/hesaplar.md) — okulun hesap açması/silmesi (`kullaniciAdiyla`, `tcIle`,
    `okulNoVarMi`, `okuldaBosAd`, `eslesmeKoduyla`, `eslesmeKoduTuket`, `hesabiSil`, `bagla`, `bagiCoz`, `rolsuzuVeliYap`).
  - [../../bolumler/kisilik.md](../../bolumler/kisilik.md) — portallar, rol bırakma (`rolleri`, `rolSatiriniSil`,
    `kullaniciAdiBaskasinda`, `eslesmeKoduYaz`, `sil`).
  - [../../bolumler/yonetici-okul.md](../../bolumler/yonetici-okul.md) — "Okul aç" (`eslesmeKoduSahibi`,
    `eslesmeKoduTuket`, `okulunMuduruVarMi`, `okuldaBosAd`, `ekle`); [../../bolumler/yonetici.md](../../bolumler/yonetici.md)
    (`mudurlerSayimli`, `sayimlar`, `sil`).
  - [../../bolumler/okul.md](../../bolumler/okul.md) (`okulun`, `okulSayimlari`, `topluSifreYaz`, `guncelle`),
    [../../bolumler/nakil.md](../../bolumler/nakil.md), [../../bolumler/veli.md](../../bolumler/veli.md) (`kodlaOgrenci`,
    `bagla`, `bagiCoz`, `cocuklari`), [../../bolumler/mesaj.md](../../bolumler/mesaj.md) (engeller, `veliHaritasi`,
    `velileri`), [../../bolumler/okul-hayati.md](../../bolumler/okul-hayati.md), ve `bul` / `bagliMi` üzerinden neredeyse
    bütün bölümler (aile, devamsızlık, ekler, etüt, ilerleyiş, ödev, quiz, takvim, yorum …).
  - [../../iliskiler.md](../../iliskiler.md) — kim kimi görür: `okulun`, `sinifOgrencileri`, `ogretmeninOgrencileri`,
    `ogrencininOgretmenleri`, `cocuklari`, `bagliMi`.
  - [../../yetki.md](../../yetki.md) (`guncelle`, `ilkCocugununOkulu`), [../../guvenlik.md](../../guvenlik.md) (`bul`),
    [../../yonetici-dosyasi.md](../../yonetici-dosyasi.md) (`epostayla`, `kullaniciAdiHerhangiYerde`, `ekle`).
  - [../index.md](../index.md) açılışta: `eksikKodlariDoldur`, `eskiEpostalariSadelestir`, `cakismaRaporu`, ilk yönetici
    için `epostaVarMi`, `kullaniciAdiHerhangiYerde`, `ekle`.
  - Araç: `araclar/deneme-okulu.js`. Testler doğrudan `require` ile: `testler/test-cakisma.js`, `testler/test-kisi-kodu.js`,
    `testler/test-yonetici-dosyasi.js`, `testler/test-admin-gizli.js` (`guncelle`).

## Nasıl çalışır (adım adım)?

### Girişte kimlik çözme

```
kimlik "@" içeriyor mu? ── evet → e-postayla (rol satırı hariç) → { u }
        │ hayır
okul adresinden mi (okulId)?
   evet: okul hesabı (ad) ─yoksa & 11 hane─► okul hesabı (T.C.)
         bulundu → { u: okul hesabı, yedek: yetişkin }   bulunamadı → { u: yetişkin }
   hayır: yetişkin var → { u: yetişkin, yedek: ad tek okulda ise o hesap }
          yetişkin yok, ad ≥ 2 okulda → { belirsiz: true }   değilse → { u: tek okul hesabı | null }
```

### Kişi kodunu tüketme ("Okul aç" / öğretmen ekleme)

1. Bölüm kodu `eslesmeKoduyla` / `eslesmeKoduSahibi` ile bulur, `yeniKisiKodu()` ile yenisini üretir.
2. İşlem içinde `eslesmeKoduTuket(id, eski, yeni)`: satır hâlâ eski kodu taşıyorsa yenisi yazılır ve `true`.
3. `false` ise kodu başkası az önce kullanmıştır; bölüm hiçbir şey yazmadan geri döner.

### Veli bağını çözme

`bagiCoz` → işlem: bağ silinir → velinin `okul_id`'si kalan ilk çocuğundan yeniden hesaplanır → çocuk kalmadıysa rolü
`NULL` olur. Üçü birlikte ya olur ya olmaz.

## Dikkat!

- **Kapsamı çoğu işlev denetlemez.** `bul`, `guncelle`, `sil`, `epostayla`, `sinifOgrencileri`, `velileri`,
  `engelleriYaz` … yalnız kimlikle çalışır; "bu kişi bu okulun mu, bu veli bu çocuğun mu" sorusu bölümlerde
  ([../../iliskiler.md](../../iliskiler.md), [../../yetki.md](../../yetki.md)) sorulur. Kapsamı SQL'de taşıyanlar:
  `hesabiSil` (okul + rol), `topluSifreYaz`'ın şifre yazan `UPDATE`'i (okul + öğrenci), `rolSatiriniSil` (ana hesap),
  `ogretmeninOgrencileri` / `ogrencininOgretmenleri` (aynı okul).
- **`topluSifreYaz`'ın oturum silmesi okul süzmez.** Şifre yalnız okulun öğrencilerine yazılır ama `oturumlar` ve
  `cihaz_anahtarlari` silmesi verilen BÜTÜN kimliklere uygulanır. Bugün tek çağıran ([../../bolumler/okul.md](../../bolumler/okul.md))
  listeyi okulun öğrencilerinden süzerek kurduğu için sorun yok; başka bir yerden çağıracaksan listeyi okulla süz.
- **Ön denetim + tekil indeks.** `epostaVarMi`, `kullaniciAdiVarMi`, `tcVarMi`, `okulNoVarMi` güzel bir ileti vermek
  içindir; aynı anda gelen iki istekte asıl korumayı tekil indeksler ve 031'deki tetikleyici yapar (`23505` →
  `hataCevir` alanlı ileti). Bir işlem içinde `23505` yakalayıp devam etmeye çalışma: işlem bozulur
  ([../baglanti.md](../baglanti.md) "İç içe islem").
- **Kişi kodunun iki sütun arasındaki tekliği veritabanında korunmaz.** `veli_kodu` ve `eslesme_kodu`'nun her biri kendi
  içinde tekil indekslidir, ama bir değerin birinde öğrencide, ötekinde yetişkinde durmasını yalnız `kodVarMi` önler
  (denetle-sonra-yaz; aynı anda üretilen iki kodda teorik açık, 16 hanede olasılığı yok denecek kadar küçük).
- **Birden çok müdür.** `okulunMuduru` `LIMIT 1`'dir ve `ORDER BY` yoktur: okulda iki onaylı müdür satırı olursa hangisinin
  döneceği belli değildir ve "öğretmen ayrıldı" / "öğrenci nakledildi" bildirimi yalnız birine gider. `okulunMuduruVarMi` ise durum süzmez: eski usulden kalma `pending` bir müdür satırı okulu
  "müdürlü" gösterir (yönetici yeni müdür atayamaz). "Birden çok müdür" işi ikisini de gözden geçirmeli.
- **Eski onay düzeninin kalıntıları.** Müdür başvurusunu onaylayan `basvuruyuOnayla` 516'da kaldırıldı; ama
  `okulSayimlari`'ndaki `bekleyen` (onay bekleyen öğretmen), `durum = 'approved'` süzgeçleri ve 012'deki
  `kullanicilar_bekleyen_basvuru` indeksi hâlâ o düzenden kalıyor. Bugün öğretmen rol satırı hep `durum = 'approved'` açılır
  ([../../bolumler/hesaplar.md](../../bolumler/hesaplar.md)); `pending` öğretmen yalnız eski veride kalabilir. Onu karara
  bağlayan `teacher-decide` ucu ([../../bolumler/okul.md](../../bolumler/okul.md)) ve girişteki "Hesabın henüz onaylanmadı.
  Okul müdürün onaylayınca…" / "Bu müdür hesabı henüz açılmadı" iletileri ([../../bolumler/kayit.md](../../bolumler/kayit.md))
  da aynı düzenin kalıntısıdır. Kullanıcı 29 Eylül'de "onay bekleme değil, müdür
  atayarak" dedi (aşağıda Son durum).
- **Kullanılmayan dışa açık işlevler:** `sifreDegisti`, `okuldaKimseVarMi`, `adminler`, ve dışarıdan `zenginlestir`.
  Silmeden önce `araclar/` ve `testler/`'de de ara.
- **`girisKimligiyle` e-postayı olduğu gibi arar.** Kimlik [../../bolumler/kayit.md](../../bolumler/kayit.md)'de
  `normEmail`'den geçirilip gelir; başka bir yerden çağırırsan sen de geçir, yoksa "İ" gibi harflerle yazılmış adres
  bulunamaz.
- **`bagiCoz` yalnız yetişkin hesabının okulunu yeniden hesaplar;** öğretmen/müdür olan eski usul veli hesabına dokunmaz.
  Birleşik velide (iki çocuk iki okulda) okul, kalan İLK bağlanan çocuğunkidir.
- **`engelleriYaz` listeyi doğrulamaz:** olmayan bir kimlik `23503` ("Bağlı olduğu kayıt bulunamadı"), kişinin kendisi
  `23514` (CHECK) ile bütün işlemi geri alır. Bugün [../../bolumler/mesaj.md](../../bolumler/mesaj.md) listeyi okulun
  kişileriyle süzüp kişinin kendisini çıkardığı (en çok 200) için bu hatalar oluşmaz; yeni bir çağıran da süzmeli.
- **SQL birleştirme:** `coklu`/`bir`/`okulun` koşulları dizeyle birleştirir ama parçalar hep koddaki sabitlerdir; değerler
  `$n`. `testler/sql-denetimi.js` bunu denetler.
- **Döngüdeki sorgular:** `bosKullaniciAdi` ve `okuldaBosAd` her aday için bir sorgu atar; `eskiEpostalariSadelestir`
  aday başına iki sorgu. Açılışta ve tek tük kayıtta sorun değil.
- **İndeksler:** e-posta (`UNIQUE`), okul + rol (`kullanicilar_okul_rol`), sınıf (`kullanicilar_sinif`), ana hesap
  (`kullanicilar_ana_hesap`), kullanıcı adı ve T.C. kısmi tekil indeksleri; `veli_baglari`'nda öğrenci indeksi ve
  `(veli_id, ogrenci_id)` tekilliği.

## Testleri

- `testler/test-cakisma.js` — bu dosyayı doğrudan `require` eder: `ekle`/`guncelle` ile uygulamayı atlayıp çift e-posta,
  ad, T.C., yönetici adı yazar (tekil indeks ve tetikleyici), `eskiEpostalariSadelestir` ve `cakismaRaporu`'nu dener.
- `testler/test-kisi-kodu.js` — `eslesmeKoduYaz`, `eksikKodlariDoldur`, `bul`, `guncelle` ile kişi kodu üretimi ve
  tüketimi.
- `testler/test-yetiskin.js`, `testler/test-giris-kayit.js` — giriş kimliği (boş kimlik, okul adresinden giriş), yetişkin
  hesabı ve rol satırları; `testler/test-yonetim.js` — aynı kullanıcı adının iki okulda ayrı hesap olabilmesi ve okul
  seçmeden girilince okulun sorulması (`girisKimligiyle`'nin `belirsiz` dalı → `okulSec: true`);
  `testler/test-giris-bilgisi.js` — toplu giriş bilgisi ve "hiç girmemiş" öğrenciler (`topluSifreYaz`, `girisYazildi`);
  `testler/test-sifre.js` — şifremi unuttum akışı.
- `testler/test-veli-coklu.js` — veli bağları, çok çocuklu veli; `testler/test-mesaj.js` — mesaj engelleri (listenin yazılıp
  geri okunması);
  `testler/test-kapsam.js`, `testler/test-rol.js` — öğretmen-öğrenci kapsamı, özel rol zenginleştirmesi.
- `testler/test-nakil.js`, `testler/test-yonetim.js`, `testler/test-yonetici-dosyasi.js` — nakil, yönetici paneli
  sayaçları, ilk yönetici.
- Elle: iki okulda aynı kullanıcı adıyla öğrenci aç, ana sayfadan okul seçmeden o adla gir → "okulunu seç" (belirsiz)
  gelmeli (otomatik karşılığı `testler/test-yonetim.js`'te); okul adresinden (`/school/<adres>`) girince doğrudan o okulun hesabı açılmalı.

## Son durum

- Son değişiklik `153d63d commit 522` (2026-09-27): yalnız bir yorum (kişi kodu "boşluksuz, tiresiz"; kod 16 haneye
  çıktı). Öncesi `276c0a0 commit 521`: `eskiEpostalariSadelestir`, `cakismaRaporu` eklendi, `kullaniciAdiVarMi` okul ad
  alanında yöneticileri de sayar oldu (031 çakışma işi). `24050a2 commit 518`: `topluSifreYaz` telefon cihaz anahtarlarını da
  siler. `0acca75 commit 516`: kişi kodu (`eslesmeKoduSahibi`, `eslesmeKoduTuket`), müdür başvurusunu onaylayan
  `basvuruyuOnayla` kaldırıldı. Dosyanın ilk hâli `d655dd8 commit 13` (2026-08-28); toplam 10 commit.
- Bilinen açıklar (kod değiştirilmedi): kullanılmayan dört dışa açık işlev, `okulunMuduru` / `okulunMuduruVarMi`'nin çok
  müdürlü okuldaki belirsizliği, `topluSifreYaz`'ın süzülmemiş oturum silmesi (yukarıda).
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Paneller ve okul gezgini" — kullanıcının 29 Eylül düzeltmesiyle müdür atama
  ONAYSIZ olacak (müdür öğretmeni ya da kişi koduyla bir yetişkini doğrudan müdür yapar), birden çok müdür, "Müdür
  bekliyor"/`pending` kalıntıları "Müdürü yok" olacak: `okulunMuduru`, `okulunMuduruVarMi`, `mudurlerSayimli`,
  `okulSayimlari` değişir. "Çalışan olarak ekleme" (kodla eklenen rolsüz çalışan) yeni rol satırı türü getirir. "Tek kişi
  tek hesap + portallar öğrencide de" öğrenci hesabını kişiye bağlar (T.C. + doğum tarihi eşleşmesi). "Güvenlik denetimi"
  okulun verdiği her şifrede ilk girişte değiştirmeyi (`sifre_degismeli`) genişletir. "Kullanıcı arama" (`/users/<ad>`)
  yeni sorgular ister.
