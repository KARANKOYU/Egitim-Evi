# public/js/parcalar/19f-roller.js

"Roller ve Yetkiler" sayfası: okulun hazır Öğretmen rolü, müdürün tanımladığı ek roller (şablondan başlatma, yetki
kutuları, ders/sınıf daraltması), rol silme ve öğretmenlere ek rol verme seçicisi.

## Bu dosya ne yapar?

Bir okulda her öğretmen aynı işleri yapmaz: biri müdür yardımcısıdır, biri etütleri düzenler, biri okulun giriş sayfasını
güzelleştirir. Eğitim Evi bunu iki katlı bir rol düzeniyle çözer ve bu dosya o düzenin **ekranıdır**:

1. **Hazır "Öğretmen" rolü.** Okuldaki her öğretmen bu rolün yetkilerini taşır (varsayılanı: derse atanabilir, ödev verir
   ve sonuçlandırır, sınav oluşturur ve not girer, yoklama alır, girdiği sınıfların sonuçlarını görür). Müdür buradaki
   kutuları açıp kapatarak bütün öğretmenlerin temel yetkisini değiştirir. Bu rol silinmez, adı değişmez, ders/sınıf
   daraltması olmaz.
2. **Ek roller.** Müdür "Müdür Yardımcısı", "Etüt Sorumlusu" gibi roller açar, yetkileri tek tek seçer, isterse bir yetkiyi
   belli derslere ya da sınıflara daraltır ve rolü bir öğretmene verir. O öğretmenin yetkisi iki rolün **birleşimidir**.
   Yeni rol sunucunun verdiği hazır şablonlardan biriyle başlatılabilir (bugün sekiz şablon var: Müdür Yardımcısı, Rehber
   Öğretmen, Etüt Sorumlusu, Nöbetçi Öğretmen, Servis Sorumlusu, Kulüp Danışmanı, Zümre Başkanı, Kodlayıcı).
3. **Rol verme.** Sayfanın altındaki listede her onaylı öğretmenin yanında bir seçici durur; seçince rol hemen verilir ya
   da ("— yalnızca Öğretmen —") alınır.

Burada hiçbir yetki **denetlenmez**; dosyanın baş yorumunun dediği gibi "burada yalnızca seçim yapılır". Kimin ne
yapabileceğine her istekte sunucu karar verir ([../../../sunucu/yetki.md](../../../sunucu/yetki.md)). Sayfayı müdür
ve "Rol oluşturur ve düzenler" (`rol.yonet`) yetkisi verilmiş öğretmen görür (menü: [06-menu.md](06-menu.md)).

## İçinde neler var?

### Durum

- `ROL` — `{ liste, gruplar, sablonlar, siniflar, dersler }`. Sayfa her açılışta beşini de sunucudan yeniden doldurur:
  `liste` okulun rolleri (önce hazır rol, sonra ek roller ada göre), `gruplar` yetki kataloğu (`[{ grup, liste: [{ k, ad,
  kapsam?, aciklama? }] }]`), `sablonlar` (`[{ ad, yetkiler }]`), `siniflar` (`[{ id, name, … }]`), `dersler` (okulun ders
  adları listesi, ör. `Matematik`). Çıkışta ve portal değişince `26-baslat.js`'in `oturumDurumunuSifirla`'sı yalnız
  `ROL.liste`'yi boşaltır.
- `ogretmenRolu()` — `ROL.liste` içinde `tur === 'ogretmen'` olan hazır rolü, yoksa `null` döner.

### Sayfa

- `SAYFALAR.roller` — aynı anda beş istek atar: `GET /api/school/roles`, `/api/school/permissions`,
  `/api/school/teachers`, `/api/school/classes`, `/api/meta`. Hepsi gelince üç kart çizer:
  - **Öğretmen · hazır rol** kartı: "Okuldaki N öğretmenin hepsinde. Silinmez; istemediğin yetkiyi kapatabilirsin.",
    yetki etiketleri ve **Düzenle** (`data-act="rol-duzenle"`).
  - **Ek roller (N)**: hiç yoksa "Henüz ek rol yok…" ipucu; her rolde ad, "5 yetki · 2 kişide" (ya da "kimseye
    verilmemiş"), daraltmalı etiketler, **Düzenle** ve kırmızı **Sil** (`data-act="rol-sil"`, `data-ad`); altta
    **Rol oluştur** (`data-act="rol-yeni"`). Satırlar `data-ara` ile üst arama kutusuna açıktır.
  - **Öğretmenlerin ek rolleri**: yalnız `status === 'approved'` öğretmenler; ad, branş ve `select.rol-sec`
    (`data-id` öğretmen; seçenekler "— yalnızca Öğretmen —" ve bütün ek roller, şu anki `customRoleId` seçili).
    Öğretmen yoksa "Okulda öğretmen yok.".
  Çizdikten sonra `rolSecBagla()` çağrılır.
- `rolSecBagla()` — her `.rol-sec`'e `onchange`: seçiciyi kilitler, `POST /api/school/role-assign { userId, roleId }`
  (`roleId` boşsa rol alınır); başarıda `git('roller')` sayfayı baştan çizer; hata olursa seçici açılır ve hata tarayıcının
  uyarı kutusuyla (`hataGoster`) gösterilir.

### Etiket yardımcıları

- `yetkiAdi(anahtar)` — `"odev.ver"` → `"Ödev verir"`; katalogda yoksa anahtarın kendisi.
- `yetkiEtiketleri(liste, kapsam)` — her yetki için `<span class="etiket">`; yetki yoksa gri "yetki yok". Ek rolde kapsam
  varsa ad sonuna " — Matematik, Türkçe / 7-A, 8-B" eklenir (`*` "hepsi" demektir ve yazılmaz; silinmiş sınıf `?` olur).

### Rol penceresi

- `rolModal(rolId)` — `rolId` boşsa yeni rol. Üç hâl:
  - **Hazır Öğretmen rolü** ("Öğretmen rolü" başlığı): ad kutusu ve şablon yok; ipucu "Buradaki yetkiler okuldaki her
    öğretmende açıktır. Kapattığın yetki, ek rolü olmayan öğretmenlerden kalkar."; kapsam alanı yok.
  - **Yeni ek rol** ("Yeni rol"): şablon varsa `#rSablon` ("— boş başla —" + şablon adları; değer şablonun sırası) ve "Şablon
    yalnızca yetkileri işaretler…" ipucu; `#rAd` (en çok 40 karakter, "ör. Etüt Sorumlusu").
  - **Var olan ek rol** ("Rolü düzenle"): `#rAd` dolu, şablon yok.
  Altında katalog gruplar hâlinde (`.yetki-liste` › `.yetki-grup` › `.yetki-blok`): her yetki bir `input.yetki-kutu`
  (değeri yetki anahtarı), kalın adı ve varsa açıklaması. **Ek rolde, hazır Öğretmen rolünde zaten açık olan yetkiler
  işaretli ve kilitli** (`disabled`) gelir, yanında gri "Öğretmen rolünde var" etiketi olur; onlar her öğretmende zaten var,
  ek role yazılmaz. Kilitsiz ve kapsamlı bir yetkinin altında `.kapsam-alan[data-izin]` durur (yetki kapalıyken gizli):
  yetkinin `kapsam`'ında `ders` varsa "Dersler" (`ROL.dersler`), `sinif` varsa "Sınıflar" (`ROL.siniflar`) kutusu. En altta
  `#rolMesaj`; düğmeler **Vazgeç** (`modal-kapat`) ve **Kaydet** (`data-act="rol-kaydet"`, `data-id`, hazır rolde
  `data-hazir="1"`). Pencere açılınca `rolKapsamBagla()` ve şablon seçicisine `rolSablonuUygula` bağlanır.
- `kapsamSecici(tur, izin, baslik, liste, deger, etiket, secili)` — bir daraltma kutusunun HTML'i: başlıkta "Tümü"
  (`input.kapsam-tumu`, `data-izin`, `data-tur`), altında `.kapsam-secenekler` içinde her ders/sınıf için
  `input.kapsam-oge` (değeri ders adı ya da sınıf kimliği). `secili` boşsa ya da `*` içeriyorsa "Tümü" işaretli ve
  seçenekler gizli gelir.
- `rolSablonuUygula(sira)` — seçilen şablonun yetkilerini işaretler, öteki **kilitsiz** kutuları kaldırır ve her kutunun
  `onchange`'ini elle çağırıp kapsam alanlarını açar/kapatır. Ad kutusu boşsa şablonun adını yazar. "— boş başla —"
  seçilirse bütün kilitsiz kutular boşalır (ad değişmez).
- `rolKapsamBagla()` — yetki kutusu kapanınca o yetkinin kapsam alanı gizlenir; "Tümü" işaretlenince tek tek seçenekler
  gizlenir ve işaretleri silinir, kaldırılınca seçenekler görünür.
- `rolKapsamiTopla(izinler)` — açık yetkilerin daraltmasını toplar: `{ 'odev.ver': { dersler: ['Matematik'],
  siniflar: ['*'] } }`. "Tümü" işaretliyse ya da tek tek hiçbir şey seçilmediyse `['*']` ("hepsi") yazılır; yalnız
  `ders` kapsamlı yetkide yalnız `dersler` anahtarı olur.

### Eylemler (`EYLEMLER`)

- `rol-yeni` → `rolModal('')`; `rol-duzenle` → `rolModal(id)`.
- `rol-sil` — `confirm("<ad> silinsin mi? Bu roldeki öğretmenler yalnızca Öğretmen rolüyle kalır.")` →
  `POST /api/school/role-delete { roleId }` → `git('roller')`; hata `hataGoster`.
- `rol-kaydet` — ek rolde ad boşsa "Rol adı yaz." (`#rolMesaj`) ve odak ad kutusuna. Gövde: `permissions` = işaretli ve
  **kilitsiz** kutular; ek rolde ayrıca `name` ve `kapsam` (`rolKapsamiTopla`). Düğme "Kaydediliyor..." olur; `id` varsa
  `POST /api/school/role-update { roleId, … }`, yoksa `POST /api/school/role`. Başarıda pencere kapanır, sayfa yeniden
  çizilir; hata `#rolMesaj`'a kırmızı yazılır, düğme geri gelir.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosyanın çağırdıkları:
  - (`S`'ye dokunmaz) `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `modalAc`, `modalKapat`,
    `mesajGoster` ([03-mesaj-modal.md](03-mesaj-modal.md)); `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md));
    `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)); `git`, `yaz`, `hero` ([07-yonlendirme.md](07-yonlendirme.md));
    `hataGoster` (`25-tiklama.js`, tarayıcının `alert`'i); `data-ara` süzgeci `araUygula` (`24-bildirim-arama-mobil.js`,
    `yaz` çağırır).
- Sunucu uçları — hepsi [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)'de, `/api/school/...` kapısı:
  giriş yapmış ve onaylı **müdür ya da öğretmen** (değilse 403 "Yetkin yok"); her uç kendi yetkisini ayrıca ister:
  - `GET /api/school/permissions` (yetki istemez) → `{ gruplar, ogretmenVarsayilan, sablonlar }`; katalog ve şablonlar
    [../../../sunucu/yetki.md](../../../sunucu/yetki.md)'deki `YETKILER`, `OGRETMEN_VARSAYILAN`, `ROL_SABLONLARI`.
  - `GET /api/school/roles` (`rol.yonet`) → `{ roles: [{ id, name, tur: 'ogretmen'|'ozel', permissions, kapsam, kisiSayisi,
    createdAt }] }`. Okulun hazır rolü yoksa bu istekte kurulur; hazır rolün `kisiSayisi`'ı okuldaki öğretmen
    satırlarının sayısıdır (`depo.kullanicilar.okulun(…, { rol: 'teacher' })` durum süzmez: bekleyen başvurular da sayılır);
    ek rolünkü o rolü taşıyan kişi sayısı.
  - `GET /api/school/teachers` (`ogretmen.duzenle`) → `{ teachers: [kullanıcı görünümü + bagli] }` — bu dosya `id`,
    `fullName`, `branch`, `status`, `customRoleId`'yi kullanır.
  - `GET /api/school/classes` (`sinif.yonet`) → `{ classes: [{ id, name, … }], … }`.
  - `GET /api/meta` (herkese açık; [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)) →
    `{ cities, subjects }`; buradan yalnız `subjects` alınır.
  - `POST /api/school/role` (`rol.yonet`) `{ name, permissions, kapsam }` → `{ role }`. Ad 40 karakter, okulda aynı ad
    (Türkçe büyük/küçük harf ayrımsız) varsa 400 "Bu adda bir rol zaten var"; katalogda olmayan yetkiler sessizce atılır;
    kapsam `kapsamTemizle` ile süzülür (yalnız açık yetkiler, gerçek dersler, okulun kendi sınıfları; ikisi de "hepsi" olan
    kayıt hiç yazılmaz). İşlem kaydı `rol.olusturuldu`.
  - `POST /api/school/role-update` (`rol.yonet`) `{ roleId, name?, permissions, kapsam? }` → `{ role }`. Müdür olmayan
    kişi kendi taşıdığı rolü ve hazır Öğretmen rolünü değiştiremez: 403 "Kendi taşıdığın rolü değiştiremezsin; müdürden
    iste.". Hazır rolde gelen ad ve kapsam yok sayılır. İşlem kaydı `rol.degistirildi`.
  - `POST /api/school/role-delete` (`rol.yonet`) `{ roleId }`. Hazır rol 400 "Hazır Öğretmen rolü silinemez; istemediğin
    yetkileri kapatabilirsin."; taşıyanların rolü veritabanı kuralıyla boşalır. İşlem kaydı `rol.silindi`.
  - `POST /api/school/role-assign` (`rol.yonet`) `{ userId, roleId }` → `{ user }`. Yalnız bu okulun öğretmenine
    (değilse 400 "Öğretmen bulunamadı"); kendine 403 "Kendine rol veremezsin"; hazır rol ayrıca verilmez. Rol verilince
    öğretmene bildirim ("Sana "Etüt Sorumlusu" rolü verildi. Menünde yeni bölümler görebilirsin.") ve işlem kaydı
    `rol.atandi`; rol alınınca bildirim de kayıt da yok.
- Veri: [../../../sunucu/veri/depo/roller.md](../../../sunucu/veri/depo/roller.md) → `roller`, `rol_yetkileri`,
  `rol_yetki_kapsamlari`; öğretmenin ek rolü `kullanicilar.ozel_rol_id`.
- Onu kullananlar: bu dosyanın adları başka parçada çağrılmaz. `26-baslat.js` (`oturumDurumunuSifirla`) `ROL.liste = []`
  yapar; [06-menu.md](06-menu.md) menüye "Roller ve Yetkiler"i (`roller`) müdürde her zaman, öğretmende `rol.yonet` varsa
  koyar ve öğretmenin ek bölümlerini rolünün adıyla başlıklar (`customRoleName`).
- CSS: `public/css/parcalar/15-roller.css` (`.yetki-liste`, `.yetki-grup`, `.yetki-grup-ad`, `.yetki-satir`,
  `.yetki-aciklama`, kilitli kutunun soluk yazısı), `17-odev-secim.css` (`.yetki-blok`, `.kapsam-alan`, `.kapsam-kutu`,
  `.kapsam-basi`, `.kapsam-hepsi`, `.kapsam-secenekler`, `.kapsam-secenek`), `04-kartlar.css` (`.kart`, `.satir`, `.etiket`,
  `.etiket.gri`), `16-giris-sekme.css` (`.onay`), `02-form.css` (`.btn`, `.kucuk`, `.ghost`, `.gri`, `.tehlike`, `.hint`,
  `.field`), `27-harita-ortak.css` (`.dugme-satir`, "Rol oluştur"un satırı). `.rol-sec`'in kendi kuralı yok.
- Rol: müdür; `rol.yonet` yetkili öğretmen (bu yetkiyi hiçbir hazır şablon içermez, müdür elle açar).

## Nasıl çalışır (adım adım)?

```
menü "Roller ve Yetkiler" ─► SAYFALAR.roller
   Promise.all ─► roles · permissions · teachers · classes · meta
   ROL doldu ─► [Öğretmen · hazır rol] [Ek roller (N)] [Öğretmenlerin ek rolleri] ─► rolSecBagla

"Rol oluştur" ─► rolModal('')
   şablon seç ─► rolSablonuUygula: kutular işaretlenir, ad boşsa şablonun adı
   kutu aç ─► kapsam alanı açılır ─► "Tümü"yü kaldır ─► Matematik, 7-A seç
   "Kaydet" ─► permissions (kilitsiz işaretliler) + name + rolKapsamiTopla
            ─► POST /api/school/role ─► modalKapat ─► git('roller')

öğretmenin satırında seçici ─► POST /api/school/role-assign { userId, roleId }
   ─► sunucu: rol yazılır, öğretmene bildirim ─► git('roller')
   (öğretmenin menüsü, kendi sayfası yenilenince ya da yeniden girince değişir)
```

Yetkinin gerçekte nasıl hesaplandığı (sunucuda): hazır rolün yetkileri ∪ ek rolün yetkileri; hazır rolde açık olan
bir yetkiyi ek rolün daraltması kısıtlamaz; ek rolde daraltılmış yetki yalnız seçilen ders/sınıfta geçer
([../../../sunucu/yetki.md](../../../sunucu/yetki.md) `yetkiVarMi`).

## Dikkat!

- **Öğretmen bu sayfayı yalnız `rol.yonet` ile açamaz (kod okumasına göre; denenmedi).** Menü "Roller ve Yetkiler"i
  `rol.yonet` olan öğretmene gösterir; ama sayfa açılırken `GET /api/school/teachers` `ogretmen.duzenle`, `GET
  /api/school/classes` `sinif.yonet` ister. `Promise.all` tek bir 403'te bütünüyle düşer ve sayfada yalnız "Bu işlem için
  yetkin yok" yazar. Yani rol yöneten öğretmenin bu iki yetkiye de sahip olması gerekir (Müdür Yardımcısı şablonunda
  ikisi var, `rol.yonet` yok). Düzeltme önerisi: sayfa `rol.yonet`'li kişiye öğretmen ve sınıf listesini başka bir yoldan
  almalı ya da sunucu bu iki ucu `rol.yonet`'e de açmalı.
- **`rol.yonet` pratikte her yetkiyi dağıtabilir.** Sunucu yeni ya da düzenlenen ek rolde yetkileri yalnız katalogla
  karşılaştırır, isteyenin kendi yetkileriyle değil. Rol yöneten bir öğretmen, kendisinde olmayan yetkileri (ör.
  "Öğrenci şifresi sıfırlar", `rol.yonet`'in kendisi) içeren bir rol açıp başka bir öğretmene verebilir, başkasının taşıdığı
  rolü genişletebilir; `rol.yonet`'li iki öğretmen birbirinin rolünü büyütebilir. Engellenen yalnız: kendi rolünü ve hazır
  rolü değiştirmek, kendine rol vermek. Yetkinin açıklaması bunu söylüyor ("Bu yetkiyi verdiğin kişi başkalarına yetki
  dağıtabilir."), ama tanımdaki "rol yönetiminde kendinden fazla yetki verme" kuralı "bugünkü kural" diye anılıyor ve
  kodda yok. Güvenlik denetimi işinde karara bağlanmalı.
- **Öğretmenin göremediği ret yolları.** `rol.yonet`'li öğretmen kendi ek rolünün ve hazır rolün "Düzenle"sini görür;
  Kaydet 403 "Kendi taşıdığın rolü değiştiremezsin; müdürden iste." ile döner. Kendi satırındaki seçiciyi değiştirirse 403
  "Kendine rol veremezsin" uyarı kutusunda çıkar ve **seçici yeni değerde kalır** (geri alınmaz; sayfa yenilenene kadar
  yanlış rolü gösterir). Kendi rolünü silmesini ise sunucu engellemez.
- **Kilitli kutular ek role yazılmaz.** Hazır rolde açık bir yetki ek rolde işaretli ama kilitli görünür ve kaydedilmez.
  Sonradan müdür o yetkiyi hazır rolden kapatırsa, ek rolünde açıkça yazılı olmayan herkesten kalkar — kilit yüzünden
  çoğu ek rolde yazılı değildir. Hazır rol penceresindeki "Kapattığın yetki, ek rolü olmayan öğretmenlerden kalkar." metni
  bu yüzden eksik: ek rolü olanlardan da kalkar (ek rolü o yetkiyi ayrıca taşımıyorsa). Aynı nedenle şablonlardaki bazı
  yetkiler (ör. Zümre Başkanı'nda "Sınav oluşturur") hazır rolde açıkken ek role hiç girmez. Bir de tersi: eskiden ek
  rolde yazılı olan bir yetki sonradan hazır role de eklenmişse, o ek rolü açıp **Kaydet**'e basmak (kutu artık kilitli
  olduğu için) o yetkiyi ve ders/sınıf daraltmasını ek rolden sessizce siler.
- **"Okuldaki N öğretmenin hepsinde" sayısı bekleyenleri de sayar.** Sunucu hazır rolün kişi sayısını okulun bütün
  öğretmen satırlarından alır; onay bekleyen başvurular da girer, oysa onların yetkisi yoktur (yetki yalnız onaylıda
  geçer) ve aşağıdaki listede de görünmezler.
- **"Tümü"yü kaldırıp hiçbir şey seçmemek "hepsi" demektir.** `rolKapsamiTopla` boş seçimi `['*']` yazar; daraltma
  istemişsen en az bir ders/sınıf seç.
- **Şablon kilitli kutulara dokunmaz** ve "— boş başla —"ya dönmek bütün kilitsiz işaretleri siler, adı silmez.
- **Değişiklik öğretmenin açık ekranına hemen yansımaz.** Sunucu bir sonraki istekte yeni yetkiyle karar verir, ama menü
  `yetkim()` (`21-ders-programi.js`) ile `S.user.yetkiler`'e bakarak çizildiği için öğretmenin menüsü sayfayı yenileyene
  ya da yeniden girene kadar eski kalır.
- **Rol silinince ya da alınınca öğretmene bildirim gitmez** (yalnız rol verilince gider); rol alınırken işlem kaydı da
  yazılmaz.
- Rol seçicinin hatası ve `rol-sil`'in hatası sayfadaki ileti alanına değil, tarayıcının uyarı kutusuna çıkar.
- Bekleyen (`pending`) öğretmenler ek rol listesinde görünmez; rol ancak onaylı öğretmene verilir.
- Bütün metinler `esc`'ten geçer (rol adı, öğretmen adı, branş, ders/sınıf adı); ders listesi `/api/meta`'nın sabit
  listesidir, okulun derslerinden gelmez.

## Testleri

- `testler/test-rol.js` — yetki kataloğu ve öğretmen varsayılanı, rol oluşturma, aynı adın reddi, uydurma yetkinin
  ayıklanması, rolsüz öğretmenin sınıf açamaması, rol atama ve `customRoleName`, rollü öğretmenin yetkisi, verilmeyen
  yetkinin kullanılamaması, `rol.yonet` olmadan rol açılamaması, rol güncelleme ve silme (yetkilerin düşmesi, kişi
  sayısı), `okul.konum` yetkisi, müdürün tam yetkisi.
- `testler/test-kapsam.js` — birleşim (hazır roldeki yetkiyi ek rol daraltmaz), kapsamlı rol, kapsam içi/dışı erişim,
  ödev ve derse atanma kapsamı, kapsam genişletme, müdürün kapsamdan etkilenmemesi.
- `testler/test-etut.js` — her okulun hazır Öğretmen rolü (varsayılan yetkiler, kişi sayısı), şablonların gelmesi (Etüt
  Sorumlusu), hazır rolün silinememesi (400) ve ayrıca verilememesi (400), müdür hazır rolden "Yoklama alır"ı kapatınca
  adın değişmemesi, yetkinin öğretmenden kalkması ve geri açınca dönmesi; rol vermenin `rol.yonet` istemesi ve kimsenin
  kendi rolünü değiştirememesi (öğretmen düzenleme penceresi yolundan, `hesap-guncelle`).
- `testler/test-siniflarim.js` — hazır rolde `ogretmen.sonuclar` açık geliyor; müdür onu hazır rolden kapatınca öğretmenin
  "Sınıflarım" ucu 403 oluyor (sonra eski hâline döndürülür).
- `testler/test-okul-sayfasi.js` — Kodlayıcı şablonu yalnız `okul.sayfa` ve `okul.konum`; rol verilen öğretmenin okul
  sayfasını açabilmesi. `testler/test-okul-hayati.js` rol açıp verir.
- `testler/yetki-denetimi.js` — rol oluşturma ve rol listesi uçlarına yalnız müdürün girebilmesi.
- `testler/buton-denetimi.js` — `rol-yeni`, `rol-duzenle`, `rol-sil`, `rol-kaydet` eylemlerinin karşılığı.
- Bu dosyanın tarayıcıda çalışan testi yok; `rol.yonet`'li öğretmenin bu sayfayı kullanması (yukarıdaki 403'ler)
  doğrudan sınanmıyor.
- Elle (sunucu 3200'de, `testler/seed.js` hesapları): müdürle **Roller ve Yetkiler** → **Rol oluştur** → şablondan
  "Kodlayıcı" → kutular ve ad dolar → Kaydet; listede bir öğretmenin seçicisinden "Kodlayıcı"yı seç; o öğretmenle gir:
  menüde rolün adıyla "Okul Sayfası" görünür. Yeni bir rolde hazır rolde olmayan kapsamlı bir yetkiyi (ör. "Ders
  programını düzenler") aç, sınıflarda "Tümü"yü kaldır, seed'in sınıfı "6-A"yı seç ve kaydet; etikette "Ders programını
  düzenler — 6-A" yazmalı. ("Ödev verir" gibi hazır roldeki yetkiler ek rolde kilitli olduğu için daraltılamaz.)

## Son durum

- `git log`: tek commit — `d49d136 commit 350` (2026-09-26). Dosya bugünkü 313 satırıyla bu commit'te eklendi (aynı
  commit `18b-etut.js` ve `19-mesajlar.js`'e de satır ekledi) ve o günden beri değişmedi: sayfa, rol penceresi,
  şablondan başlatma, kilitli kutular, ders/sınıf daraltması, rol silme ve verme.
- Bilinen açıklar (kod değiştirilmedi): `rol.yonet`'li öğretmenin sayfayı `ogretmen.duzenle` ve `sinif.yonet` olmadan
  açamaması; `rol.yonet`'in kendinden fazla yetki dağıtabilmesi (tanımla çelişki); kendine rol verme reddinde seçicinin
  geri alınmaması; hazır rol penceresindeki eksik metin; ek rolü yeniden kaydetmenin hazır rolde de olan yetkileri ek
  rolden silmesi; hazır rol kartındaki kişi sayısına bekleyen başvuruların girmesi.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Özel roller" (öneri, onay bekliyor): yeni yetkiler (okul simgesi, tahta hesapları, toplantı, uzaktan bağlantı,
    Başarılarım, anket, okul yedeği, özellikler, çalışan ekleme, mesaj şablonları) ve yeni şablonlar ("Kodlayıcı /
    Tasarımcı", "Bilişim Teknolojileri Sorumlusu", "Okul Sekreteri / Memur", "Sınıf Öğretmeni"; Rehber, Zümre Başkanı,
    Müdür Yardımcısı genişler). Katalog ve şablonlar sunucudan geldiği için pencere onları kendiliğinden gösterir; "müdüre
    özel kalan" işler için ekranda ayrı bir işaret gerekebilir.
  - "Çalışan olarak ekleme": kodla eklenen kişi rolsüz "çalışan" olur; müdür (ya da "Okula çalışan ekler" yetkilisi)
    çalışanın satırından Öğretmen rolünü ya da bir özel rolü atar, özel rol öğretmen olmadan da verilebilir. Tanım bu
    atamanın hangi ekranda yapılacağını söylemiyor; bu sayfanın "Öğretmenlerin ek rolleri" listesi (bugün yalnız onaylı
    öğretmenler) ve sunucunun "hazır rol ayrıca verilmez" kuralı bu işten etkilenir.
  - "Okul cihazı": `okul.cihaz` yetkisi. "Çok dil": şablon ve yetki adları çeviri kataloğuna. "Güvenlik denetimi":
    yukarıdaki yetki dağıtma kuralı. "Tam debug": rol rol her yetki (ör. Müdür Yardımcısı şifre değiştirir).
