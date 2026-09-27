# sunucu/yetki.js

Okul içindeki yetki sistemi: yetki kataloğu, hazır Öğretmen rolü ve rol şablonları, ders/sınıf kapsamı, "bu kişinin bu
yetkisi var mı" sorusu ve dışarı verilen kullanıcı görünümü (`pub`).

## Bu dosya ne yapar?

Okulda herkes aynı işi yapmaz: bir öğretmen yalnız ödev verir, müdür yardımcısı ders programını da düzenler, rehber
öğretmen öğrencinin ekranını açabilir. Eğitim Evi bunu **yetkiler** ve **rollerle** çözer:

- Müdür bütün yetkilere sahiptir, bu değiştirilemez (okulda her şeyi yapabilen en az bir kişi kalmalı). Sistem
  yöneticisi de bütün yetkilere sahip sayılır.
- Her öğretmen, okulun hazır **"Öğretmen" rolünün** yetkilerine sahiptir; müdür bu rolün yetkilerini açıp kapatabilir
  (okulda rol henüz kurulmamışsa `OGRETMEN_VARSAYILAN`).
- Müdür kendi **özel rollerini** tanımlar ("Müdür Yardımcısı", "Etüt Sorumlusu"…), yetkilerini tek tek seçer, bir
  öğretmene verir. O öğretmenin yetkileri iki rolün birleşimidir.
- Özel rol bir yetkiyi belirli **derslere ve sınıflara** daraltabilir (kapsam): "yalnız 9-A ve 9-B'de yoklama alır".

Bölümler bu dosyaya "şu kişi şu yetkiyle şu sınıfta şunu yapabilir mi" diye sorar; kural tek yerde kalır. Ayrıca
kullanıcı nesnesi dışarı giderken şifre özeti gibi iç alanlar sızmasın diye her cevap `pub(u)`'dan geçer.

## İçinde neler var?

- `YETKILER` — gruplu katalog (`{ grup, liste: [{ k, ad, kapsam?, aciklama? }] }`), ekranda bu sırayla gösterilir.
  Gruplar: Ders ve program (`derse-atanabilir`, `program.duzenle`, `ders.yonet`, `ders.ogretmen-ata`), Sınıf ve öğrenci
  (`sinif.yonet`, `ogrenci.yerlestir`, `ogrenci.hesap-ac`, `ogrenci.duzenle`, `ogrenci.sifre`, `ogrenci.portal`),
  Öğretmenler (`ogretmen.onayla`, `ogretmen.duzenle`, `ogretmen.cikar`), Ödev ve sınav (`odev.ver`,
  `odev.sonuclandir`, `sinav.olustur`, `sinav.not-gir`, `ogretmen.sonuclar`), Devamsızlık (`devamsizlik.al`,
  `devamsizlik.gor`), Etüt (`etut.yonet`, `etut.yoklama`), Mesajlaşma (`mesaj.toplu`, `mesaj.herkese`), Okul hayatı
  (`yemek.yonet`, `servis.yonet`, `kulup.yonet`), Yönetim (`rol.yonet`, `islem-kaydi.gor`, `takvim.yonet`, `yil.yonet`,
  `aktarim.yap`, `okul.sayfa`, `okul.konum`). `kapsam: ['ders']`, `['sinif']` ya da ikisi olan yetkiler daraltılabilir.
- `TUM_YETKILER` — düz anahtar listesi (doğrulama için).
- `OGRETMEN_VARSAYILAN` — `derse-atanabilir`, `odev.ver`, `odev.sonuclandir`, `sinav.olustur`, `sinav.not-gir`,
  `devamsizlik.al`, `ogretmen.sonuclar`.
- `ROL_SABLONLARI` — yeni rol açarken başlangıç: Müdür Yardımcısı, Rehber Öğretmen, Etüt Sorumlusu, Nöbetçi Öğretmen,
  Servis Sorumlusu, Kulüp Danışmanı, Zümre Başkanı, Kodlayıcı (`okul.sayfa`, `okul.konum`). Şablon yalnız başlangıçtır.
- `pub(u)` — dışarı giden kullanıcı: `id, username, email, fullName, role, status, city, district, address, phone, dogum,
  kvkkSurum, schoolId, schoolName, schoolSlug, branch, code, grade, createdAt, customRoleId, tema, customRoleName,
  yetkiler`. Şifre özeti ve iç alanlar YOK.
- `kullaniciYetkileri(u)` — yönetici ve müdürde hepsi; öğretmende hazır rol (`u._ogretmenYetkileri` ya da varsayılan)
  + aynı okuldaki özel rolün (`u._rol`, `tur !== 'ogretmen'`) yetkileri; başkalarında boş.
- `yetkiVarMi(u, izin, baglam?)` — onaylı değilse `false`; yönetici/müdür `true`; yetki listede yoksa `false`; bağlam
  (`{ ders, sinif }`) yoksa ya da yetki hazır Öğretmen rolünden geliyorsa `true`; değilse özel rolün kapsamına uyuyor mu.
- `yetkiKapsami(u, izin)` — özel rolün o yetki için kapsamı (`{ dersler, siniflar }`) ya da `null` ("hepsi").
- `kapsamUyar(k, baglam)` — kapsam `null` ya da `'*'` içeriyorsa her şeye uyar; değilse bağlamdaki ders/sınıf listede
  olmalı.
- `ogrenciKapsamindaMi(u, izin, sinifId)` — öğrenciye dokunan yetkinin sınıf kapsamı: rol belirli sınıflarla
  sınırlıysa sınıfsız öğrenci kapsam DIŞINDA sayılır.
- `kapsamTemizle(gelen, izinler, schoolId)` — müdürün gönderdiği kapsamı temizler: yalnız rolde açık yetkiler, gerçek
  dersler (`ortak.SUBJECTS`) ve okulun kendi sınıfları kalır; "hepsi" seçiliyse kapsam hiç yazılmaz.
- `rolOzeti(r)` — `{ id, name, tur, permissions, kapsam, kisiSayisi, createdAt }`.
- `roleById(id)` — `depo.roller.bul`.
- `okulGerek(res, me)` → `Promise<boolean>` — kişinin okulu yoksa: veli ise ilk çocuğunun okulunu hesabına yazar (eski
  bağlanmış hesaplar için) ya da 403 "Önce çocuğunu hesabına bağlaman gerekiyor."; başkasına 403 "Bu işlem bir okula
  bağlı olmayı gerektirir…".

## Kimle konuşur?

- Çağırdıkları: `./http` (`bad`), `./ortak` (`SUBJECTS`), `./veri` → `depo.roller.bul`, `depo.siniflar.okulun`,
  `depo.kullanicilar.ilkCocugununOkulu`, `depo.kullanicilar.guncelle`.
- Onu çağıranlar (grep): `sunucu/iliskiler.js` (`yetkiVarMi` — `ogrenci.portal`), bölümlerden `anket`, `devamsizlik`,
  `egitim-yili`, `ekler`, `etut`, `hesaplar`, `islem-kaydi`, `kayit`, `kisi-aktarim`, `mesaj`, `odev`, `ogretmen`,
  `okul-hayati`, `okul-sayfasi`, `okul`, `quiz`, `sinav`, `takvim`; `pub`'un ve yetki denetiminin kullandığı ekler
  (`_okulAdi`, `_rol`, `_ogretmenYetkileri`…) `sunucu/veri/esleme.js` ve `veri/depo/kullanicilar.js`'te hazırlanır
  (o dosyalar `pub`'u çağırmaz, yalnız yorumda anar); katalog, şablonlar, `kapsamTemizle`, `rolOzeti`, `roleById` → `bolumler/okul.js`
  (roller ekranı); `okulGerek` → `anket`, `devamsizlik`, `egitim-yili`, `etut`, `mesaj`, `takvim`.
- Tablolar (depo üzerinden): roller (özel ve hazır Öğretmen rolü, kapsam), kullanıcılar.

## Nasıl çalışır (adım adım)?

```
yetkiVarMi(öğretmen, 'devamsizlik.al', { ders:'Matematik', sinif:'c_9a' })
  onaylı mı? ── hayır → false
  müdür/yönetici? → true
  kullaniciYetkileri = hazır Öğretmen rolü ∪ özel rol
  'devamsizlik.al' yok → false
  bağlam yok ya da yetki hazır rolde → true   (hazır rol kapsamla daraltılmaz)
  özel rolün kapsamı: dersler ['Matematik'], siniflar ['c_9a','c_9b'] → uyuyor → true
```

Bölümlerdeki tipik kullanım: `if (!yetkiVarMi(me, 'odev.ver', { ders, sinif })) return bad(res, 'Bu işlem için yetkin yok', 403);`

## Dikkat!

- **Hazır rol kapsamla daraltılmaz:** bir yetki hazır Öğretmen rolünde açıksa özel rolün kapsamı onu kısmaz
  (`temelRoldeMi`). Yetkiler iki rolün birleşimi; biri geniş veriyorsa geniştir.
- `ogrenciKapsamindaMi` neden ayrı: `yetkiVarMi` bağlamda sınıf boşsa sınıfı denetlemeden geçiriyordu; sınıfsız bir
  öğrenci böylece "yalnız 9-A" rolünün kapsamına kaçıyordu. Öğrenciye dokunan uçlarda bunu kullan.
- Özel rol başka okulunsa (`r.schoolId !== u.schoolId`) yok sayılır.
- `pub`'a yeni bir alan eklerken düşün: bu nesne kişinin kendisine, öğretmenine, müdürüne gidiyor. Şifre özeti, iki
  adımlı giriş sırları, oturum bilgisi asla eklenmez (`guvenlik-test.js` sızıntıya bakar).
- `rol.yonet` yetkisi verilen kişi başkalarına yetki dağıtabilir — katalogdaki açıklama bunu müdüre söyler.
- `okulGerek` veli için hesaba YAZAR (yan etkili): eski bağlanmış veli hesaplarının okulunu tamamlamak için.

## Testleri

- `testler/test-rol.js` — yetki kataloğu, rol oluşturma/atama/güncelleme/silme, rolsüz ve rollü öğretmen, öğretmenin
  varsayılan yetkileri, `okul.konum` yetkisi, müdürün her zaman tam yetkili olması.
- `testler/test-kapsam.js` — hazır roldeki yetkiyi ek rolün daraltmaması, kapsam içi erişim, kapsam dışının
  engellenmesi, ödev ve derse atanma kapsamı, kapsam genişletme, müdürün kapsamdan etkilenmemesi.
- `testler/yetki-denetimi.js` — her uç × her rol.
- `testler/test-etut.js`, `test-devamsizlik.js`, `test-okul-sayfasi.js`, `test-servis-konum.js` — ilgili yetkiler
  (`etut.*`, `devamsizlik.*`, `okul.sayfa`, `okul.konum`).
- `ogrenciKapsamindaMi`'nin "sınıfsız öğrenci kapsam dışı" kuralını adıyla deneyen bir kontrol bulamadım (grep); ayrı
  bir test eklemek iyi olur.
- Elle: müdürle "Rehber Öğretmen" şablonundan rol aç, bir öğretmene ver; o öğretmen öğrenci portalına girebilmeli.

## Son durum

- Son commit `7a8b555 commit 504` (2026-09-26): yeni yetki `okul.konum` ("Okulun haritadaki yerini ayarlar") eklendi,
  Kodlayıcı şablonuna da verildi.
- `bd1f64f commit 346`: hazır Öğretmen rolü ile özel rolün birleşimini anlatan açıklama bloğu; daha öncekiler
  (`309fed3 commit 48`, `4737d72 commit 47`…) katalog ve kapsam.
- Sıradaki "Çalışan olarak ekleme" işi (kodla eklenen rolsüz çalışan; müdür Öğretmen / özel rol / Kodlayıcı atar) bu
  dosyadaki rol mantığını genişletecek.
