# Etütler · Etüt yetkileri ve hazır roller

**Durum:** Kodda var; tasarımda ek olarak etüt görevi öğretmen olmayan çalışana da verilebilir ve rolsüz çalışan etütleri görmez; Tasarım 1 önizlemesinin rol düzenleyicisinde etüt yetkisi "Devamsızlık ve etüt" grubunda tek satır, "Etüt planlar" olarak görünür (öneri, onay bekliyor).

Etütlerde kimin neyi görüp neyi yapacağını belirleyen iki yetki ("Etüt açar; …" ve "Bütün etütlerde yoklama alır"), onları taşıyan
hazır rol şablonları ve etüdün öğretmeninin kendi hakkı.

## Ne işe yarar

Okulda etütleri genelde müdür değil bir müdür yardımcısı ya da "etüt sorumlusu" öğretmen düzenler; nöbetçi öğretmen de gelmeyen
öğretmenin etüdünde yoklamayı alır. Eğitim Evi bunu rol düzeniyle çözer: müdür yetkileri bir role koyar, rolü bir öğretmene verir.
Kullanıcı 26 Eylül'de bunu tarif etti: etüde öğretmen "eğer ona giriyorsa veya yetkiliyse custom role ile verilmiş" girebilecek;
29 Eylül'de de "etüt sorumlusu: bu kişi herkese istediği dersten istediği hoca ile etüt yazabilir" dedi.

## Nereden açılır

- Yetkiler: sol menüde "Okul Düzeni" → **"Roller ve Yetkiler"** → **"Rol oluştur"** ya da bir rolün **"Düzenle"**si; pencerede
  **"Etüt"** grubu. Sayfayı müdür ve "Rol oluşturur ve düzenler" yetkisi olan görür ([Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md)).
- Rolü vermek: aynı sayfanın altındaki **"Öğretmenlerin ek rolleri"** kartında öğretmenin yanındaki seçici
  ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).
- Yetkinin sonucu: [Etütler sayfası](etutler-sayfasi.md) (kim neyi görür ve hangi düğmeler çıkar).

Tasarımda (Tasarım 1 önizlemesi): "Roller ve yetkiler" → **"Rol ekle"**; yetkiler gruplu, "Şablondan başla" çipleri
([Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md)).

## Adım adım

### Bugünkü yetkiler ve kim ne yapar

Rol penceresinin **"Etüt"** grubunda iki yetki vardır:

- **"Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler"** — etüt açar, düzenler, siler, öğrencilerini seçer ve bütün
  etütlerde, geçmiş günler dahil yoklama alır (bütün etütlerde yoklamayı da içerir).
- **"Bütün etütlerde yoklama alır"** — açıklaması: "Etüdün öğretmeni kendi etüdünde bu yetki olmadan da yoklama alır." Okulun bütün
  etütlerini görür ve her etütte, geçmiş günler dahil yoklama alır; etüt açamaz, düzenleyemez.

Bu iki yetki ders ya da sınıfa **daraltılamaz** (pencerede altlarında "Dersler"/"Sınıflar" kutusu çıkmaz); verilen kişi okulun bütün
etütlerinde geçerlidir.

| İş | Müdür | "Etüt açar; …" | "Bütün etütlerde yoklama alır" | Etüdün öğretmeni (yetkisiz) | Öbür öğretmen | Öğrenci | Veli |
|---|---|---|---|---|---|---|---|
| "Etütler" sayfasında görülen | bütün etütler | bütün etütler | bütün etütler | öğretmeni olduğu etütler | boş liste ("Sana verilmiş bir etüt yok.") | — | — |
| Etüt açma, düzenleme, silme, öğrenci seçme | evet | evet | hayır | hayır | hayır | hayır | hayır |
| Yoklama | her etüt, bugün ve geçmiş günler | aynı | aynı | yalnız kendi etüdü, yalnız etüt günü, başlangıçtan 15 dk önceden | hayır | hayır | hayır |
| Etütlerim | — | — | — | — | — | kendi | çocuğunun |

### Müdür: etüt sorumlusu atamak

1. Menüden "Okul Düzeni" → **"Roller ve Yetkiler"** → **"Rol oluştur"**.
2. Açılan **"Yeni rol"** penceresinde şablon seçicisinden **"Etüt Sorumlusu"**nu seç: iki etüt yetkisi işaretlenir, "Rol adı" boşsa
   "Etüt Sorumlusu" yazılır. (Şablon yalnız kutuları işaretler; istediğini değiştirebilirsin.)
3. **"Kaydet"**. Rol "Ek roller" listesine girer ("2 yetki · kimseye verilmemiş").
4. Sayfanın altındaki **"Öğretmenlerin ek rolleri"** kartında öğretmenin yanındaki seçiciden **"Etüt Sorumlusu"**nu seç; rol hemen
   verilir.
5. O öğretmen "Etütler" sayfasını bir sonraki açışında müdürün gördüğü sayfayı görür: bütün etütler, "Etüt aç" kartı, her satırda
   "Yoklama", "Öğrenciler", "Düzenle", "Sil".

Nöbetçi öğretmen için aynı yolu **"Nöbetçi Öğretmen"** şablonuyla izle: rol "Bütün etütlerde yoklama alır" ve "Okulun tüm
devamsızlığını görür" yetkilerini taşır. Etüt yetkilerini bütün öğretmenlere vermek istersen **hazır "Öğretmen" rolünün** "Düzenle"sinden
işaretleyebilirsin; o zaman okuldaki her öğretmen alır.

### Hazır şablonlarda etüt yetkileri (bugün)

- **"Müdür Yardımcısı"** — iki etüt yetkisi de var (öbür yetkilerinin yanında).
- **"Etüt Sorumlusu"** — yalnız iki etüt yetkisi.
- **"Nöbetçi Öğretmen"** — "Bütün etütlerde yoklama alır" ve "Okulun tüm devamsızlığını görür".
- Öbür şablonlarda ve hazır Öğretmen rolünün ilk hâlinde etüt yetkisi yok.

([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md), [Özel roller](../roller-yetkiler/ozel-roller.md))

### Öğretmen

- Hiç etüt yetkin yoksa "Etütler" menüde yine durur; yalnız öğretmeni olarak seçildiğin etütleri görürsün ve onlarda etüt günü
  yoklama alırsın.
- Sana ek rolle etüt yetkisi verildiyse sayfayı yeniden aç; yetki her istekte sunucuda yeniden hesaplanır. Rolün kendi bölümüne
  ("Ek Yetkiler" ya da rolün adıyla) etüt için ayrı satır eklenmez; aynı "Etütler" satırı kullanılır.
- Kendine rol veremezsin; rolü müdür (ya da "Rol oluşturur ve düzenler" yetkili) verir.

### Çalışan

Bugün kodda: "çalışan" ayrı bir hesap türü değil; ek görevli kişi öğretmen hesabındaki ek rolle çalışır (yukarıdaki tablo).

Tasarımda (çalışan tanımı, kullanıcı onayladı 27 Eylül): kişi okula **"çalışan"** olarak eklenir, müdür görev vermedikçe **rolsüzdür**.
Rolsüz çalışanın menüsünde "Etütler" yoktur ve etüt uçları ona kapalıdır (yalnız duyurular, Mesajlar, Takvim, Hatırlatıcılar ve
Ayarlar). Müdür ona **öğretmen olmadan da** özel rol verebilir: "Etüt Sorumlusu" rolü verilen çalışan etüt açar ve düzenler, rolün
yetkisi kadar yoklama alır ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md), [Rol atama](../ogretmenler-calisanlar/rol-atama.md)).

### Öğrenci, veli, servisçi

Etüt yetkisi alamaz. Öğrenci ve veli yalnız [Etütlerim](etutlerim.md)'i görür; servisçi etüt bölümünü hiç görmez.

### Tasarımda: önizlemenin rol düzenleyicisi (Tasarım 1 önizlemesi)

- Yetkiler **"Devamsızlık ve etüt"** grubunda: "Yoklama alır", "Devamsızlığı görür" ve tek etüt yetkisi **"Etüt planlar"**. Etüt
  yetkisi ders ve sınıfa daraltılabilen yetkiler arasındadır.
- Şablonlarda: **"Müdür yardımcısı"** ve **"Rehber öğretmen"**de "Etüt planlar" var; **"Etüt sorumlusu"** (açıklama "Etütleri
  planlar") "Derse atanabilir", "Etüt planlar" ve "Devamsızlığı görür" taşır; **"Nöbetçi öğretmen"**de etüt yetkisi yok.
- Örnek rol listesinde "Etüt sorumlusu" bir öğretmene (Ayşe Kaya) verilmiştir; önizlemede o öğretmenin Etütler sayfasında da
  "Etüt ekle" vardır (önizleme düğmeyi yetkiye bağlamaz; örnek öğretmen zaten etüt sorumlusu).

Bu düzen özel roller önerisinin (29 Eylül) parçasıdır ve **onay bekliyor**. Bugünkü iki yetkinin (açma/düzenleme ve bütün etütlerde
yoklama) tek "Etüt planlar"a inip inmeyeceği, nöbetçinin etüt yoklamasını kimin alacağı kodlanırken kararlaşacak; o güne kadar bugünkü
iki yetki geçerli.

## Kurallar ve sınırlar

- **Müdür** her zaman bütün etüt yetkilerine sahiptir; kapatılamaz.
- **Yetkiler birleşir:** öğretmenin yetkisi hazır Öğretmen rolü ile ek rolünün birleşimidir.
- **Yetkisiz istekler:** **"Etüt düzenleme yetkin yok"** (açma, düzenleme, silme, öğrenci seçme, aday listesi), **"Bu etütte yoklama
  alma yetkin yok"**, **"Bu etüdü görme yetkin yok"** (etüdün ayrıntısı), **"Bu bölüm okul personeli içindir"** (öğrenci, veli,
  servisçi), **"Bu öğrenciyi görme yetkin yok"** (başkasının etüt dökümü).
- **Düğmeler sunucunun cevabına göre** çizilir; gizli düğmenin işi elle istense de sunucu reddeder.
- **Etüdün öğretmeni** olmak yetki değildir: kendi etüdünde yoklama hakkı verir, açma/düzenleme vermez. Öğretmen olarak okulun
  **onaylı öğretmenleri ve müdürü** seçilebilir.
- **Başka okul:** yetki yalnız kendi okulunda geçer; başka okulun etüdü **"Etüt bulunamadı"**.
- **Kapalı bölüm** yetkiden önce gelir: okul "Etütler"i kapattıysa yetkili de giremez ("Etütler bu okulda kapalı. Okul müdürü
  Özellikler sayfasından açabilir.").
- **İşlem kaydı:** rol değişiklikleri "Rol yetkileri değiştirildi" gibi kayda geçer; etüt işleri yetkilinin adıyla kaydedilir
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Tasarımda (etüt planlama tanımı):** boş zaman ucu kapsam denetimli olacak ve öğrenci adları değil yalnız sayılar dönecek.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etütler sayfası](etutler-sayfasi.md) — yetkiye göre değişen liste ve düğmeler.
- [Etüt açma](etut-acma.md), [Etüdün öğrencilerini seçme](ogrenci-secme.md), [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md) —
  "Etüt açar; …" yetkisinin işleri.
- [Etüt yoklaması](etut-yoklamasi.md) — kim, hangi gün yoklama alır.
- [Boş zaman ızgarası](bos-zaman-izgarasi.md) — tasarımda etüt sorumlusunun planlama penceresi.
- [Etütlerim](etutlerim.md), [Etüt ayrıntısı](etut-ayrintisi.md), [Etüt bildirimleri](etut-bildirimleri.md).

**İlgili:**

- [Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md),
  [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md),
  [Özel roller](../roller-yetkiler/ozel-roller.md), [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md).
- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md), [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md).
- [Kim yoklama alır, kim kimi görür](../devamsizlik/yetki-ve-kapsam.md) — ders yoklamasının yetkileri (ayrı).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) — `YETKILER` ("Etüt" grubu: `etut.yonet`, `etut.yoklama` ve açıklaması),
  `ROL_SABLONLARI` ("Müdür Yardımcısı", "Etüt Sorumlusu", "Nöbetçi Öğretmen"), `OGRETMEN_VARSAYILAN` (etüt yetkisi yok),
  `kullaniciYetkileri` (müdüre hepsi; öğretmene hazır rol + ek rol), `yetkiVarMi`.
  [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — `yonetebilir` (`etut.yonet`), `herYoklama` (`etut.yonet` ya da
  `etut.yoklama`), `yoklamaEngeli`, `etutGorunumu` (`yoklamaAlabilir`), `ogretmenAdaylari`, personel kapısı ve `okulGerek`.
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — rol uçları (`/api/school/roles`, `role`, `role-update`, `role-assign`).
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — rol penceresi ve şablon seçici;
  [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `yonetebilir`e ve `yoklamaAlabilir`e göre düğmeler;
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — öğretmen menüsünde her zaman "Etütler".
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (hazır Öğretmen rolü ve "Etüt Sorumlusu" şablonu, yetkisiz öğretmen
  açamaz, öğretmen yalnız kendi etüdünü görür, `etut.yoklama` verilen öğretmen düzeltebilir),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Roller ve yetkiler", "Yetki listesi", "Etütler"). Kılavuzun
  yetki tablosunda ilk etüt yetkisi kısaca "Etüt açar ve düzenler" diye geçer; ekrandaki tam adı "Etüt açar; gününü, saatini,
  öğretmenini ve öğrencilerini düzenler".

## Sık sorulanlar

- **Etüt sorumlusu verdim ama öğretmen hâlâ "Etüt aç"ı görmüyor.** Sayfayı yeniden açsın; görmüyorsa rolün kaydedildiğini ve
  öğretmene verildiğini "Roller ve Yetkiler"de denetle.
- **Nöbetçi öğretmen etüt açabilir mi?** "Nöbetçi Öğretmen" şablonuyla hayır; yalnız bütün etütlerde yoklama alır.
- **Bir öğretmen yalnız 8. sınıf etütlerini düzenlesin istiyorum.** Bugün etüt yetkileri daraltılamaz. Önizlemedeki öneride etüt
  yetkisi ders ve sınıfa daraltılabiliyor; onay bekliyor.
- **Etüdün öğretmeni olmak için yetki gerekir mi?** Hayır; etüt sorumlusu seni etüdün öğretmeni seçer, kendi etüdünde yoklama hakkın
  olur.
- **Müdür etüt yetkisini kendinden kaldırabilir mi?** Hayır; müdür her zaman bütün yetkilere sahiptir.

## Sırada

- Özel roller (öneri, 29 Eylül; onay bekliyor): gruplu yetkiler, yeni şablonlar, etüt yetkisinin "Etüt planlar" adıyla ve ders/sınıf
  kapsamıyla gösterilmesi.
- Çalışan olarak ekleme (onaylı, 27 Eylül): "Çalışanlar → Kodla ekle", rolsüz çalışan, öğretmen olmadan özel rol; etüt görevi çalışana
  da verilebilecek.
- Etüt planlama (öneri, 29 Eylül): etüt sorumlusu istediği dersten, istediği öğretmenle, istediği öğrencilere etüt yazacak
  ([Boş zaman ızgarası](bos-zaman-izgarasi.md)).
- Tam debug (Linux): rol rol her yetkinin denenmesi (ör. etüt sorumlusunun ve nöbetçinin yapabildikleri).
