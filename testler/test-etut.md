# testler/test-etut.js

Adı etüt olsa da yedi bölümde birbirinden ayrı konuları (hazır Öğretmen rolü, etüt açma ve yoklaması, sonuçlanmış ödevi
düzeltme, gönderilmiş mesajı düzeltme, açılış sayfasının herkese açık rakamları ve adresleri, inceleme düzeltmeleri ve
müdürü kaldırılan okulun yeniden açılması) gerçek uçlardan deneyen sunuculu test paketi (50 denetim).

## Bu dosya ne yapar?

Paket, 26 Eylül sabahı birkaç commit'e dağılarak gelen bir işin (Öğretmen rolü, etütler, ödev ve mesaj düzeltme, açılış
sayfası rakamları, incelemeden gelen düzeltmeler) bütün parçalarını tek dosyada dener: şema `013-ogretmen-rolu-etut.sql`
ve `sunucu/veri/depo/etutler.js` commit 344'te, `sunucu/bolumler/etut.js` 346'da, ön yüzün `18b-etut.js` ve `19f-roller.js`
parçaları 349–350'de, bu test dosyası da 351'de geldi. Sonraki günlerde indirme sayfası, sayfa adresleri ve 404'ler de
buraya eklendi. Bu yüzden içi bir "torba" gibidir. Dosya başı yorumu sözünü şöyle özetliyor:

- her okulun silinmeyen, ayrıca verilmeyen bir **Öğretmen rolü** var; müdür yetkilerini kapatınca öğretmenden de kalkar;
  yeni rol hazır şablondan başlatılabilir;
- **etüdü** `etut.yonet` yetkisi olan açar; etüdün öğretmeni yalnız etüt günü yoklama alır; başka öğretmen, başka gün,
  ileri tarih reddedilir; gelmeyen öğrenciye ve velisine bildirim gider; öğrenci ve veli görür;
- **sonuçlanmış ödevin** kendisi düzeltilebilir (yalnız sahibi);
- **gönderilmiş mesajı** yalnız gönderen düzeltir; "düzenlendi" görünür;
- `/api/site` girişsiz açıktır, yalnız sayılar, iletişim, yapımcılar (`yapimcilar.json`) ve iki aralık (bildirim yoklama,
  çevrimiçi sayma; dakika) döner;
- `/api/uygulama` (indirme sayfasının sürüm tablosu) girişsiz açıktır; testte dışarı istek atılmaz.

Sunucu tarafında başlıca belgeler: etüt [../sunucu/bolumler/etut.md](../sunucu/bolumler/etut.md), roller
[../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) ve [../sunucu/yetki.md](../sunucu/yetki.md), ödev
[../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md), mesaj [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md),
açılış rakamları [../sunucu/site.md](../sunucu/site.md), sayfa adresleri [../sunucu/http.md](../sunucu/http.md).

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)`, `J(x)` (240 harflik JSON).
- `iki(n)` (iki haneli sayı), `gunYaz(d)` — `Date`'i **yerel** takvimle `YYYY-AA-GG` yazar, `saatYaz(dk)` — gece
  yarısından dakikayı `SS:DD` yazar.
- `z = Date.now().toString(36)` — bu koşuya özgü ek (etüt, rol, hesap ve okul adlarında).

Ortak yardımcılar [giris.md](giris.md) üzerinden ([../araclar/giris.md](../araclar/giris.md)): `BASE`, `iste`,
`girisYap`, `hesapAc`, `kisiKodu`, `mudurYap` (ayrıca `okulHesabi` alınır ama hiç kullanılmaz).

### Hesaplar

Seed hesapları ([seed.md](seed.md)): yönetici (`A`), müdür (`M`), öğretmenler `mat` (Ayşe Kaya) ve `fen` (Ali Yıldız),
öğrenciler `ogr1` (`ogrenci1`, Zeynep Şahin) ve `ogr2` (`ogrenci2`, Burak Öztürk); `girisYap`'ın döndürdüğü oturumlar
(`.token`, `.user.id`) kullanılır. Pakette ayrıca açılanlar: "Etüt Velisi" (`etutveli<z>`), "Birinci Mudur" (`bm<z>`) ve
okulu "Sahipsiz Okul <z>" (Ankara / Mamak), "Ikinci Mudur" (`im<z>`), roller "Nöbetçi <z>" ve "Düzenleyici <z>".

### 1) Hazır Öğretmen rolü (7)

- `GET /api/school/roles` (müdür): `tur === 'ogretmen'` olan rol var, yetkilerinde `devamsizlik.al`, `kisiSayisi >= 2`
  (okuldaki öğretmen sayısı).
- `GET /api/school/permissions`: hazır şablonlar arasında "Etüt Sorumlusu" ve onun yetkilerinde `etut.yonet`.
- Hazır rol silinemez (`POST /api/school/role-delete` → 400) ve kimseye ayrıca verilemez (`POST /api/school/role-assign`
  → 400).
- Müdür hazır rolü `{ name: 'Başka ad', permissions: <devamsizlik.al'sız> }` ile günceller → 200; `devamsizlik.al` kalktı
  ama ad değişmedi (hazır rolün adı sabit).
- `mat`'ın `GET /api/me`'sindeki `yetkiler`'den `devamsizlik.al` kalktı, `odev.ver` duruyor. Yetkiler geri verilince
  `devamsizlik.al` yeniden var.

### 2) Etüt açma (8)

Etüt bugünün gününe (`gun`: 1 pazartesi … 7 pazar) ve **şimdiden bir saat önce başlayıp iki saat sürecek** biçimde
açılır (`bas = max(0, şimdi − 60 dk)`, `bit = min(23:59, bas + 120 dk)`); böylece öğretmenin yoklaması her saatte açık
olur.

- `mat` (`etut.yonet` yok) `POST /api/etut/kaydet` → 403.
- Müdür gün 9 ile → 400; geçerli günde 11:00–10:00 (ters saat) → 400.
- Müdür "Matematik etüdü <z>"ü yer "Kütüphane", öğretmen `mat` ile açar → 200 ve `etut.ogretmenId === mat`.
- `mat`'ın bildirimlerinde "etüdü sana verildi" geçiyor.
- `POST /api/etut/ogrenciler` ile `ogr1` ve `ogr2` eklenir → 200, liste 2; listeye öğretmen `mat` da konursa → 400
  (okulun öğrencisi değil).
- `GET /api/etut`: `mat` kendi etüdünü `yoklamaAlabilir: true` ile görür; `fen` görmez. `fen` bu etüdün yoklamasını
  açamaz (`GET /api/etut/yoklama` → 403).

### 3) Yoklama (13)

- `mat` dünün tarihine (`ogr1` geldi, `ogr2` gelmedi) → 400; 7 gün sonrasına → 400.
- Geçersiz durum (`'uydurma'`) → 400; listede olmayan kişi (`mat`'ın kendisi) → 400.
- Bugün için aynı yoklama → 200 ve `degisen === 2`; aynısını yeniden kaydetmek → 200 ve `degisen === 0`.
- `GET /api/etut/yoklama?id&tarih=<bugün>` → `ogr2`'nin durumu `yok`, `engel === ''`.
- `ogr2`'nin bildirimlerinde `Etüt: … gelmedi` var; `ogr1`'inkilerde `Etüt: ` ile başlayan bildirim yok.
- `GET /api/etut/ogrenci` (`ogr2`): etüdünü ve `durum: 'yok'` yoklamasını görüyor. `ogr2` `studentId=<ogr1>` verse de
  yalnız kendi kaydını alır (cevapta `var` yoklaması yok). Öğrenci personel listesine (`GET /api/etut`) giremez → 403.
- **Veli:** müdür `GET /api/school/hesap?id=<ogr2>`'den veli kodunu alır; "Etüt Velisi" açılır, `POST /api/kisilik/cocuk`
  ile `ogr2`'ye bağlanır ve yeniden girer. `GET /api/etut/ogrenci?studentId=<ogr2>` → 200 ve etüt listede; `ogr1` için →
  403.
- Müdür "Nöbetçi <z>" rolünü (`etut.yoklama`) `fen`'e verir; `fen` aynı günün yoklamasında `ogr2`'yi `izinli` yapar → 200
  ve `degisen === 1`. Sonra rol geri alınır.
- Rolü alınmış `fen` etüdü silemez (`POST /api/etut/sil` → 403); müdür `onay: true` göndermeden silemez → 400. (Etüt
  pakette hiç silinmez.)

### 4) Sonuçlanmış ödevi düzeltme (3)

`mat` `ogr1`'e "Sayfa 10" ödevini verir (bugün, 12:00) ve `yapti` sonucuyla sonuçlandırır
(`POST /api/assignments/<id>/finish`).

- `POST /api/assignments/<id>/update` ile ad "Sayfa 10-12", son gün 7 gün sonrası 17:00 → 200; ödev hâlâ `finished`
  ve `ogr1`'in sonucu `yapti`.
- `fen` aynı ödevi düzeltemez → 403. Başlangıcı son günden sonra olan düzeltme → 400.

### 5) Mesaj düzeltme (4)

`mat` `fen`'e kişi mesajı gönderir ("Toplantı" / "Yarın saat 10") → 200 ve mesaj kimliği. Alıcı `fen`
`POST /api/mesajlar/duzenle` → 403. Gönderen "Toplantı (saat değişti)" / "Yarın saat 11" yapar; `fen`
`GET /api/mesajlar/<id>`'de yeni metni ve dolu `duzenlenme`'yi görür. Boş konuyla düzeltme → 400.

### 6) Açılış sayfası rakamları ve adresler (8)

- `GET /api/site` (girişsiz) → 200; `sayilar.okul >= 1`, `sayilar.kisi >= 4`, `sayilar.cevrimici >= 1`.
- Cevabın anahtarları **tam olarak** `bildirimAralikDk, cevrimiciDk, iletisim, sayilar, yapimcilar`; iki aralık tam sayı;
  `iletisim`'in anahtarları tam olarak `eposta, telefon`; her yapımcının anahtarları tam olarak `ad, github, katki`.
- `GET /api/uygulama` (girişsiz) → 200; anahtarlar tam olarak `alindi, playStore, sayfa, surumler`; `surumler` dizi,
  `alindi === false`, `sayfa` `https://github.com/` ile başlıyor.
- `/indir/indir.html` indirme sayfası ("Eğitim Evi'ni indir" başlığı ve `/js/indir.js`); `/indir` ve `/download/` → 301,
  `Location: /indir/indir.html`.
- `/boyle-bir-sayfa-yok` → 404, "Sayfa bulunamadı" ve "Ana sayfaya dön"; eski biçim `/test-ortaokulu` → 404;
  `/school/boyle-bir-okul-yok` → 404, "Okul bulunamadı" ve "Ana sayfaya dön".
- `/giris`, `/kayit`, `/login`, `/signup`, `/about`, `/hakkinda`, `/sss/sss.html`, `/school/test-ortaokulu` ve
  `/school/test-ortaokulu/` → 200 ve sayfada `id="authWrap"` (uygulamanın sayfası).

### 7) İncelemeden gelen düzeltmeler (7)

- Müdür "Düzenleyici <z>" rolünü (`ogretmen.duzenle`) `fen`'e verir. `fen` (yeniden girmiş)
  `POST /api/school/hesap-guncelle` ile `mat`'a bu rolü vermeye kalkar → 400; kendi rolünü boşaltmaya kalkar → 400;
  `mat`'ın branşını `Matematik` yapar → 200. Sonra `fen`'in rolü alınır.
- `GET /api/progress?studentId=<ogr1>` (`mat`) → öğrenci nesnesinde `code`, `address`, `phone`, `email`, `dogum`,
  `username` yok.
- **Müdürü kaldırılan okul:** "Birinci Mudur" için yönetici "Sahipsiz Okul <z>"u açar (`mudurYap`); müdür bir öğrenci
  ("Kalan Ogrenci", sabit bir T.C. no ile) açar ve okul adresini (`GET /api/school/adres`) not eder; yönetici müdürü kaldırır
  (`POST /api/admin/principal-delete`). Eski müdür başvurusu ucu (`POST /api/okul-basvurusu`) → 404. Yönetici okulu aynı
  ad ve **eski adresle**, "Ikinci Mudur"un kişi koduyla yeniden açar → 200, aynı okul kimliği ve aynı `kisaAd`. Yeni müdür
  girince rolü `principal`, okulu eskisi ve öğrenci listesinde "Kalan Ogrenci" var. Müdürü olan okul ikinci kez açılamaz →
  400, `alan: 'okul'`.
- Veli `POST /api/kisilik/cocuk-kaldir { id: ogr2 }` ile tek çocuğunu kaldırınca `GET /api/me`'de okulu (`schoolId`) boş.

Sonunda `  GECTI: 50   KALDI: 0` (öncesinde boş satır, başında iki boşluk); `KALDI` varsa çıkış kodu 1. Beklenmeyen hata
`TEST HATASI:` ile iletiyi ve hata nesnesini yazar, çıkış kodu 1.

## Kimle konuşur?

- **Modüller:** yalnız [giris.md](giris.md) (`araclar/giris.js`); sayfalar için Node'un genel `fetch`'i (`BASE` ile).
- **Sunucu uçları:**

  | Uç | Ne için | Belge |
  |---|---|---|
  | `GET /api/etut`, `POST /api/etut/kaydet`, `POST /api/etut/ogrenciler`, `GET` ve `POST /api/etut/yoklama`, `GET /api/etut/ogrenci`, `POST /api/etut/sil` | etüt | [../sunucu/bolumler/etut.md](../sunucu/bolumler/etut.md) |
  | `GET /api/school/roles`, `GET /api/school/permissions`, `POST /api/school/role`, `POST /api/school/role-update`, `POST /api/school/role-delete`, `POST /api/school/role-assign` | roller | [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) |
  | `GET /api/school/hesap`, `POST /api/school/hesap-guncelle`, `POST /api/school/hesap-ac`, `GET /api/school/adres` | veli kodu, rol/branş düzenleme, kalan öğrenci, okul adresi | [../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md) |
  | `POST /api/assignments`, `POST /api/assignments/<id>/finish`, `POST /api/assignments/<id>/update` | ödev düzeltme | [../sunucu/bolumler/odev.md](../sunucu/bolumler/odev.md) |
  | `GET /api/mesajlar/hedefler`, `POST /api/mesajlar`, `POST /api/mesajlar/duzenle`, `GET /api/mesajlar/<id>` | mesaj düzeltme | [../sunucu/bolumler/mesaj.md](../sunucu/bolumler/mesaj.md) |
  | `GET /api/site`, `GET /api/uygulama` | açılış rakamları, sürüm tablosu | [../sunucu/site.md](../sunucu/site.md), [../sunucu/uygulama-surum.md](../sunucu/uygulama-surum.md) |
  | `/indir/indir.html`, `/indir`, `/download/`, 404 sayfaları, `/school/<okul>` | sayfa adresleri | [../sunucu/http.md](../sunucu/http.md) |
  | `GET /api/progress` | öğretmenin gördüğü öğrenci | [../sunucu/bolumler/ilerleyis.md](../sunucu/bolumler/ilerleyis.md) |
  | `POST /api/admin/principal-delete`, `POST /api/admin/okul-ac`, `POST /api/okul-basvurusu` (yok) | okulu yeniden açma | [../sunucu/bolumler/yonetici.md](../sunucu/bolumler/yonetici.md), [../sunucu/bolumler/yonetici-okul.md](../sunucu/bolumler/yonetici-okul.md) |
  | `POST /api/kisilik/cocuk`, `POST /api/kisilik/cocuk-kaldir`, `GET /api/kisilikler` | veli bağı, kişi kodu | [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md) |
  | `GET /api/me`, `GET /api/notifications`, giriş ve kayıt uçları | yetkiler, bildirimler, hesaplar | [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md) |

- **Koruduğu kod:** [../sunucu/bolumler/etut.md](../sunucu/bolumler/etut.md) (`yoklamaEngeli`, `etutGovdesi`,
  `yoklamaBildir`, öğrencinin yalnız kendini görmesi) ve [../sunucu/veri/depo/etutler.md](../sunucu/veri/depo/etutler.md)
  (`yoklamaYaz` yalnız değişenleri döndürür); [../sunucu/yetki.md](../sunucu/yetki.md) (`OGRETMEN_VARSAYILAN`,
  `ROL_SABLONLARI`); roller için [../sunucu/bolumler/okul.md](../sunucu/bolumler/okul.md) ve
  [../sunucu/veri/depo/roller.md](../sunucu/veri/depo/roller.md); `hesapDogrula`'daki "rol vermek `rol.yonet` ister"
  kuralı ([../sunucu/bolumler/hesaplar.md](../sunucu/bolumler/hesaplar.md)); ödev düzeltme; mesaj düzeltme
  ([../sunucu/veri/depo/mesajlar.md](../sunucu/veri/depo/mesajlar.md)); `/api/site`'nin dar cevabı; sayfa adresleri.
- **Tablolar** (dolaylı): `etutler`, `etut_ogrencileri`, `etut_yoklamalari`, `roller`, `rol_yetkileri`, `kullanicilar`,
  `veli_baglari`, `odevler`, `odev_ogrencileri`, mesaj tabloları, `bildirimler`, `okullar`, `islem_kaydi`.
- **Ön yüz** (aynı uçları çağırır, bu pakette tarayıcı yok): [../public/js/parcalar/18b-etut.md](../public/js/parcalar/18b-etut.md),
  [../public/js/parcalar/19f-roller.md](../public/js/parcalar/19f-roller.md),
  [../public/js/parcalar/11-ogretmen-odev.md](../public/js/parcalar/11-ogretmen-odev.md),
  [../public/js/parcalar/19-mesajlar.md](../public/js/parcalar/19-mesajlar.md),
  [../public/js/parcalar/05a-dis-sayfalar.md](../public/js/parcalar/05a-dis-sayfalar.md), indirme sayfası
  [../public/js/indir.md](../public/js/indir.md).
- **Onu çalıştıran:** `testler/tumtest.sh`, sunuculu paket döngüsünde (`test-kisi-kodu`'ndan sonra, `test-adresler`'den
  önce); her paketten önce sıfırlanmış veritabanı ve [seed.md](seed.md). Sunucu `EE_DIS_ISTEK=0` ile açılır.

## Nasıl çalışır (adım adım)?

```
A, M, mat, fen, ogr1, ogr2 girer
1) hazır Öğretmen rolü: var · şablonlar · silinmez · verilmez · yetki kapat/aç ─► mat'ın yetkileri izler
2) bugün, şimdi-60 dk ... +120 dk ─► M etüdü açar (öğretmen mat) ─► mat'a bildirim
   öğrenciler ogr1, ogr2 ; mat görür, fen görmez
3) dün / +7 gün ─► 400 ; bugün: ogr1 var, ogr2 yok ─► degisen 2 ; tekrar ─► 0
   ogr2'ye "Etüt: … gelmedi" ; ogr2 kendini görür ; veli bağlanır ─► çocuğunu görür
   fen + "Nöbetçi" (etut.yoklama) ─► ogr2 izinli ─► degisen 1 ; rol geri
   silme: fen 403, onaysız 400
4) mat: ödev ver ─► sonuçlandır ─► ad/tarih düzelt (sonuç korunur) ; fen 403 ; ters tarih 400
5) mat ─► fen mesaj ─► fen düzeltemez ─► mat düzeltir ─► fen "düzenlendi"yi görür ; boş konu 400
6) /api/site · /api/uygulama · /indir · 404'ler · uygulama adresleri
7) rol verme rol.yonet ister ; ilerleyiş dar ;
   Sahipsiz Okul: müdür kaldır ─► başvuru ucu yok ─► aynı adresle yeni müdür ─► okul ve öğrenci devralındı ─► ikinci açılış 400
   veli çocuğunu kaldırır ─► okulu boşalır
```

## Dikkat!

- **Saate bağlı.** Etüdün günü ve saati paketin çalıştığı ana göre hesaplanır; sunucu da aynı bilgisayarda yerel saati
  kullanır. Gece yarısını geçerken çalışırsa (`simdi`, `bugun` ve `gun` 2. bölümün başında bir kez hesaplanır) "bugün"ün
  yoklaması reddedilebilir: sunucunun günü değişince etüdün öğretmeni dünkü tarihe yoklama alamaz.
- **"Yalnız etüt günü" kuralı aslında denenmiyor.** Sunucu, etüdün öğretmenine geçmiş bir etüt gününü ("geçen haftanın
  aynı günü") yasaklar ("Etüdün yoklamasını yalnızca etüt günü alabilirsin…"); paket ise **dünü** dener, o da daha önceki
  "bu etüt … günleri yapılıyor" denetimine takılır. Aynı biçimde "yoklama başlangıçtan en erken 15 dakika önce açılır"
  kuralı da denenmez (etüt bilerek bir saat önce başlatılır).
- **Velinin bildirimi denenmiyor.** Başlık yorumu "gelmeyen öğrenciye ve velisine bildirim gider" der; ama veli yoklamadan
  sonra bağlanır ve onun bildirimine hiç bakılmaz. `fen`'in `izinli` düzeltmesi sırasında veli bağlıdır ve sunucu ona da
  bildirim gönderir (`yoklamaBildir`, hesabı onaylı veliler): 3 Ekim denetiminde paket koşulduktan sonra "Etüt Velisi"yle
  girilip bakıldı, tek bildirimi "Burak Öztürk — Etüt: Matematik etüdü <z> (<gün.ay.yıl>) — gelmedi (izinli)" idi. Paket
  buna bakmadığı için bu yol bozulsa da geçer.
- **"Kendi rolünü değiştiremiyor" başka bir kurala takılır.** `fen`'de `rol.yonet` olmadığı için kendi rolünü boşaltma
  isteği "Rol vermek için "rol yönetir" yetkisi gerekir" ile reddedilir; sunucudaki "Kendine rol veremezsin" kolu
  (`hesapDogrula`) bu pakette çalışmaz. `testler/` altında bu iletiyi arayan bir denetim yok (3 Ekim).
- **`/api/site` ve `/api/uygulama` anahtarları tam eşitlikle denetlenir.** Bu bilerek böyledir (açılış sayfasından kişi
  bilgisi sızmasın); ama bu uçlara yeni bir alan eklersen (ör. site duyurusu, bakım modu) bu paket kalır — testi de aynı
  işte güncelle.
- **`alindi === false` test ortamına bağlı.** Sunucu `EE_DIS_ISTEK=0` ile açılmadıysa GitHub'dan sürüm listesini çekmeye
  kalkar (internete çıkar) ve bu denetim kalabilir. `tumtest.sh` bu değişkeni verir.
- **Seed'e bağlı:** okul adresi `test-ortaokulu`, `kisiSayisi >= 2` (iki seed öğretmeni), `sayilar.kisi >= 4`, iki seed
  öğrencisi; "Kalan Ogrenci" için koddaki sabit T.C. no (`10000000078`) taze veritabanında boştur. Aynı veritabanında
  ikinci koşu (3 Ekim denetiminde denendi) `GECTI: 48   KALDI: 2` verir: bu T.C. artık ilk koşudaki "Sahipsiz Okul"un
  öğrencisinde olduğu için `hesap-ac` 409 alır (koddan: `nakil.nakilEt`, doğum tarihi gönderilmediği için
  `nakil: 'dogum'` sorusu); "müdürü kaldırılan okul yeni müdürle yeniden açıldı" ve "yeni müdür aynı okulu ve
  öğrencilerini devraldı" kalır. Öbür adlar `z` ile tekleştiği için sorun çıkarmaz.
- **Paket iz bırakır:** etüt silinmez; "Nöbetçi" ve "Düzenleyici" rolleri silinmez (yalnız `fen`'den alınır); ikinci bir
  okul ve üç yetişkin hesabı açılır. `tumtest.sh` her pakette veritabanını sıfırladığı için birikmez.
- **Kullanılmayan alım:** `okulHesabi` `require` edilir ama hiç çağrılmaz (zararsız).
- **Varsayılan adres 3000.** `EE_BASE` vermeden çalıştırırsan kendi sunucunda etüt, rol, ödev, mesaj açar, okulunun hazır
  rolünü değiştirir ve bir okulun müdürünü kaldırıp yeniden açar; her zaman test sunucusunu kullan.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Etüt uçlarına (`/api/etut…`) bundan başka
  yalnız `testler/test-ozellikler.js` dokunur (bölüm kapalıyken `GET /api/etut` 403); [yetki-denetimi.md](yetki-denetimi.md)
  ve [girdi-denetimi.md](girdi-denetimi.md) etüt uçlarını denemez (`testler/` altında `etut` araması, 3 Ekim).
  Mesaj düzeltme (`/api/mesajlar/duzenle`), müdürü kaldırma (`/api/admin/principal-delete`) ve çocuğu kaldırma
  (`/api/kisilik/cocuk-kaldir`) da yalnız bu pakette denenir.
- Öbür konuların başka paketleri: `testler/test-adresler.js` (sayfa adresleri ve 301'ler ayrıntılı; dosyadaki yorum buna
  gönderir), `testler/test-rol.js` ve `testler/test-kapsam.js` (roller ve kapsam; rol açma ve listesi
  [yetki-denetimi.md](yetki-denetimi.md)'nde de), `testler/test-odev-saat.js`, `testler/test-odev-dosya.js`,
  `testler/test-quiz.js` ve `testler/test-yorum-ek.js` (ödevin `update` ucu), `testler/test-site-ayarlari.js` (`/api/site`
  ve `/api/uygulama`; `/api/site` ayrıca `testler/test-admin-gizli.js`, `testler/test-okul-agi.js` ve
  [girdi-denetimi.md](girdi-denetimi.md)'nde), `testler/test-mesaj.js` (mesajlaşmanın geri kalanı),
  [test-devamsizlik.md](test-devamsizlik.md) (`devamsizlik.al`'ın anlamı).
- Elle (Git Bash, proje kökünde; 3200'de `tumtest.sh`'deki gibi — `EE_DIS_ISTEK=0` ile — açılmış ve [seed.md](seed.md) ile
  tohumlanmış test sunucusu varken):

  ```
  EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-etut.js
  ```

- 3 Ekim sabahı (yerel saat 10:10 civarı) bu belge için 3200'de, sıfırlanmış `egitimevi_test` ve seed'le koşuldu:
  `GECTI: 50   KALDI: 0`, yaklaşık 3 saniye; sunucu günlüğünde `API hatası` ya da `Veritabanı hatası` yok. Belgenin
  denetiminde (10:49 civarı) yeniden koşuldu, sonuç aynı; ardından velinin bildirimine bakıldı ve aynı veritabanında ikinci
  koşu yapıldı ("Dikkat!"e bak).

## Son durum

- `git log`: 8 commit. Son üçü:
  - `276c0a0 commit 521` (2026-09-27): `/api/site`'nin beklenen anahtarlarına `bildirimAralikDk` ve `cevrimiciDk` eklendi,
    ikisinin tam sayı olması denetleniyor; başlık yorumu buna göre.
  - `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri): indirme sayfası artık `/indir/indir.html`; `/indir` ve `/download/`
    301 ile oraya yönleniyor (önceden ikisi de sayfanın kendisini veriyordu); uygulama adreslerinden `/faq` ve `/sss`
    çıktı, `/sss/sss.html` girdi.
  - `0acca75 commit 516` (2026-09-27, kişi kodu ve portallar): müdürü kaldırılan okul artık **başvuruyla değil**, yöneticinin
    kişi koduyla yeniden açmasıyla devralınıyor (`okul-basvurusu` → 404, `admin/okul-ac` + eski `kisaAd`, "müdürü olan okul
    ikinci kez açılmıyor"); 18 yaş / beyan / doğum tarihi başvuru denetimleri ve `admin/pending`, `admin/decide` adımları
    silindi; `kisiKodu` alındı; indirme sayfası başlığı "Eğitim Evi'ni indir" oldu.
- Öncekiler: `115a906 commit 515` (olmayan okul 404 "Okul bulunamadı"), `dc17651 commit 514` (adresler ve 404 denetimleri),
  `fa9a072 commit 510` (`/api/uygulama` ve `/indir`, `/download`; `/api/site`'den `android` adresi çıktı),
  `f9a3978 commit 505` (`/api/site`'ye `android` adresi), dosyanın ilk hâli `7bc7a7c commit 351` (2026-09-26, 248 satır; aynı commit
  `15-roller.css`, `17-odev-secim.css`, `20-devamsizlik.css` eklemeleri).
- Açık iş yok; kod değiştirilmedi. Denenmeyen kurallar "Dikkat!"te.
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Etüt planlama"** (istediği ders/öğretmen/öğrenci, yazarken canlı boş zaman ızgarası ve çakışma uyarısı; öneri) —
    `POST /api/etut/kaydet`'in gövdesi ve cevabı değişebilir; 2. bölüm.
  - **"Özel roller"** (yeni yetkiler ve hazır şablonlar; öneri) ve **"Kulüpler kaldırılacak"** (Kulüp Danışmanı
    şablonu) — `GET /api/school/permissions`'ın şablon listesi değişir; paket yalnız "Etüt Sorumlusu"na baktığı için o
    kaldıkça geçer.
  - **"Çalışan olarak ekleme"** — kişi koduyla eklenen kişi rolsüz çalışan olacak, Öğretmen rolünü müdür verecek; 1.
    bölümdeki `kisiSayisi` ve `mat`'ın yetkileri bu modele göre gözden geçirilmeli.
  - **"Sistem"** (bakım modu, site duyurusu) ve **"Çok dil"** — `/api/site`'ye alan eklenirse 6. bölümün tam eşitlik
    denetimi güncellenmeli.
  - **"Paneller … okul gezgini"** ("Müdürü yok" + "Müdür ata", müdürün başka müdürü onaysız ataması) — 7. bölümdeki
    "müdürü kaldırılan okulu yeniden açma" akışı değişebilir.
  - **"Mesaj ayarları …"** ve **"Mesaj etiketleri"** — 5. bölümdeki mesaj düzeltme yoluna dokunabilir.
