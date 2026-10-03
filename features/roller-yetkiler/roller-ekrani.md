# Roller ve yetkiler · Roller ve yetkiler ekranı

**Durum:** Kodda var; tasarımda ek olarak hazır Öğretmen rolü öbür rollerle aynı listede ("hazır rol" rozetiyle), her satırda
kişi sayısı, yetki sayısı, kapsam özeti ve kişilerin adları, rolün branş rozeti, sayfanın başında "Rol ekle" düğmesi, listenin
başında "N rol · N yetki · 10 grup" sayacı; "Öğretmenlerin ek rolleri" kartı kalkar, rol kişiye rolün penceresindeki "Kişiler"den
ya da Çalışanlar sayfasındaki "+ Rol ata"dan verilir; silme listeden değil rolün penceresinden ("Rolü sil").

Okulun bütün rollerini gördüğün, yeni rol açtığın, rolleri düzenleyip sildiğin ve bugün öğretmenlere ek rol verdiğin sayfa.

## Ne işe yarar

Okulda herkes aynı işi yapmaz: biri yalnız derse girer, biri ders programını düzenler, biri etütleri planlar, biri okulun sayfasını
güzelleştirir. Eğitim Evi bunu **rollerle** çözer. Bu sayfa rollerin evidir: okulun hazır **Öğretmen** rolünü (her öğretmenin
temel yetkileri), müdürün tanımladığı **ek rolleri** ("Müdür Yardımcısı", "Etüt Sorumlusu"…) ve bugün hangi öğretmenin hangi ek
rolü taşıdığını tek yerde gösterir.

Kullanıcı bunu 29 Ağustos'ta istedi: müdür "custom role" ekler, "adını kendi koyar, yetkilerini kendi seçer" (öğrenci portalına
girme, ders düzenleme, öğretmen düzenleme gibi). 2 Ekim'de "custom role çeşitli ve gruplu permler" diye genişletti; Tasarım 1
önizlemesi bu sayfayı o isteğe göre yeniden çizdi.

Bu sayfa yalnız **seçim** yapar; kimin neyi yapabileceğine her istekte sunucu karar verir
([Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md)).

## Nereden açılır

- **Müdür:** sol menüde **"Okul Düzeni"** başlığının altında **"Roller ve Yetkiler"** ("Ders Programı" ile "Eğitim Yılı"
  arasında). Adres: `#/roller`. Satır müdürün menüsünde her zaman vardır.
- **Öğretmen (ek rolüyle):** rolünde **"Rol oluşturur ve düzenler"** yetkisi varsa menünün ek bölümünde (rolünün adını taşıyan
  başlığın altında; rolün adı yoksa "Ek Yetkiler") **"Roller ve Yetkiler"** çıkar. Sayfa açılırken öğretmen ve sınıf listesini de
  çektiği için rolde ayrıca **"Öğretmen bilgisi ve branşını düzenler"** ve **"Sınıf açar ve siler"** olmalı; biri eksikse sayfada
  yalnız **"Bu işlem için yetkin yok"** yazar (kod okumasına göre; denenmedi). Ayrıntı:
  ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md).

Tasarımda (Tasarım 1 önizlemesi): sol menüde **"Okul düzeni"** → **"Roller ve yetkiler"**. Sayfanın başlığı "Roller ve yetkiler",
altında "Öğretmenlere ve çalışanlara verilen ek yetkiler", sağ üstte **"Rol ekle"** düğmesi.

## Adım adım

### Müdür

**Sayfanın düzeni (bugün, kodda)** — başlık **"ROLLER VE YETKİLER"**, altında: "Her öğretmen "Öğretmen" rolünün yetkilerine
sahiptir. Ek görev verdiğin öğretmene ayrıca bir rol ver." Altında üç kart:

1. **"Öğretmen"** kartı, başlığın yanında **"hazır rol"** etiketi. Altında "Okuldaki N öğretmenin hepsinde. Silinmez; istemediğin
   yetkiyi kapatabilirsin.", sonra rolün yetkileri etiket etiket (ör. "Ödev verir", "Yoklama alır"), sağda **"Düzenle"**
   ([Hazır Öğretmen rolü](hazir-ogretmen-rolu.md)).
2. **"Ek roller (N)"** kartı. Hiç ek rol yoksa: "Henüz ek rol yok. Müdür yardımcısı, etüt sorumlusu gibi görevler için bir rol
   oluştur; hazır şablonlardan başlayabilirsin." Her ek rol bir satır (adına göre Türkçe alfabe sırasıyla):
   - kalın **rol adı**;
   - altında "5 yetki · 2 kişide" ya da rol kimseye verilmemişse "5 yetki · kimseye verilmemiş";
   - rolün yetkileri etiket etiket; bir yetki belli derslere ya da sınıflara daraltılmışsa etiketin sonunda daraltma yazar:
     "Ders programını düzenler — 7-A, 7-B", "Ödev verir — Matematik / 8-A" ([Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md));
     rolde hiç yetki yoksa gri **"yetki yok"** etiketi;
   - sağda **"Düzenle"** ve kırmızı **"Sil"**.
   Kartın altında **"Rol oluştur"** düğmesi.
3. **"Öğretmenlerin ek rolleri"** kartı: okulun onaylı her öğretmeni bir satır — adı, altında branşı, sağda bir seçici. Seçicide
   **"— yalnızca Öğretmen —"** ve okulun bütün ek rolleri; öğretmenin şu anki ek rolü seçili gelir. Okulda öğretmen yoksa
   "Okulda öğretmen yok."

Sayfanın üstündeki arama kutusu ek rol satırlarında (rol adına göre) ve öğretmen satırlarında (öğretmenin adına göre) süzer
([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).

**Bu sayfadaki işler:**

1. **Yeni rol aç:** "Ek roller" kartındaki **"Rol oluştur"** → rol penceresi ([Rol ekle / düzenle](rol-duzenleyici.md)); istersen
   hazır bir şablondan başlarsın ([Hazır rol şablonları](hazir-sablonlar.md)).
2. **Bir rolü düzenle:** satırındaki **"Düzenle"**. Hazır Öğretmen rolünün "Düzenle"si bütün öğretmenlerin temel yetkilerini
   değiştirir ([Hazır Öğretmen rolü](hazir-ogretmen-rolu.md)).
3. **Bir rolü sil:** ek rolün satırındaki kırmızı **"Sil"** ([Rol silme](rol-silme.md)). Hazır Öğretmen rolünde "Sil" yoktur.
4. **Öğretmene ek rol ver ya da al:** "Öğretmenlerin ek rolleri" kartında öğretmenin seçicisinden rolü seç; geri almak için
   **"— yalnızca Öğretmen —"**. Seçici kısa süre kilitlenir, kaydedilir, sayfa baştan çizilir. Rol **verilince** öğretmene
   bildirim gider ("Sana "…" rolü verildi. Menünde yeni bölümler görebilirsin."); rol **geri alınınca** bildirim de işlem kaydı da
   yazılmaz ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).

**Tasarımda** sayfa tek bir bölümdür:

1. Bölümün başlığı **"Roller"**, sağında sayaç: "5 rol · 44 yetki · 10 grup" (önizlemedeki örnek okulda).
2. İlk satır hazır **"Öğretmen"** rolü, adının yanında **"hazır rol"** rozeti; sonra okulun öbür rolleri (önizlemede "Müdür
   yardımcısı", "Rehber öğretmen", "Etüt sorumlusu", "Otizm destek öğretmeni").
3. Her satırda: renkli kilit simgesi, kalın rol adı, varsa **branş rozeti** (ör. "Rehberlik", "Özel eğitim · Otizm"; bkz.
   [Role branş](rol-bransi.md)); ikinci satırda "2 kişi · 21 yetki · Bütün dersler · bütün sınıflar · Hasan Uçar, Ali Yıldız" (kişi
   sayısı, yetki sayısı, kapsam özeti ve rolü taşıyanların adları; hazır rolde ve kimseye verilmemiş rolde adlar yazmaz); sağda
   **"Düzenle"** rozeti. Satırın tamamı tıklanır ve rolün penceresini açar.
4. Listenin altında ipucu: "Rol bir başlangıç şablonudur; yetkileri istediğin gibi değiştirirsin. Kendinden fazla yetki veremezsin;
   müdür atama ve okulu kapatma role verilemez."
5. Yeni rol için sağ üstteki **"Rol ekle"** ([Rol ekle / düzenle](rol-duzenleyici.md)).
6. Silme listede yoktur: rolün penceresinin sol altındaki **"Rolü sil"** ([Rol silme](rol-silme.md)).
7. "Öğretmenlerin ek rolleri" kartı yoktur. Rolü kişiye iki yoldan verirsin: rolün penceresindeki **"Kişiler"** alanında
   **"+ Kişi ekle"** ya da **"Çalışanlar"** sayfasında kişinin penceresindeki **"+ Rol ata"**
   ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)). Bir kişi birden çok rol taşıyabilir.

### Çalışan

Bugün: rolünde **"Rol oluşturur ve düzenler"** olan öğretmen aynı sayfayı görür ve aynı işleri yapar; üç sınır vardır:

1. Kendi taşıdığı ek rolün ve hazır Öğretmen rolünün **"Düzenle"**si açılır ama **"Kaydet"** şu iletiyle döner: **"Kendi
   taşıdığın rolü değiştiremezsin; müdürden iste."**
2. "Öğretmenlerin ek rolleri" kartında kendi satırındaki seçiciyi değiştirirse tarayıcının uyarı kutusunda **"Kendine rol
   veremezsin"** çıkar. Seçici yeni değerde kalır, sayfayı yenileyince doğrusu görünür.
3. Sayfanın açılması için yukarıdaki iki ek yetki gerekir.

Ayrıntı ve bilinen açık: ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md).

Tasarımda: aynı sayfa; rol penceresinin altındaki not her yerde geçerlidir: "Kendinden fazla yetki veremezsin. Müdür atama, ortak
karar ve okulu kapatma role verilemez." Rol yöneten çalışanın ekranı önizlemede ayrıca çizilmedi.

### Öğretmen

Rolsüz öğretmen (yalnız hazır Öğretmen rolü) bu sayfayı görmez. Müdürün burada yaptığı değişiklikler onun menüsünde görünür: hazır
roldeki bir yetki kapatılınca o bölüm ("Ödevler", "Sınavlar", "Yoklama", "Sınıflarım") menüsünden kalkar; ona bir ek rol
verilince bildirim gelir ve menüsünde rolün adını taşıyan yeni bir bölüm açılır ([Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md)).

## Kurallar ve sınırlar

- **Kim görür:** müdür; "Rol oluşturur ve düzenler" yetkili öğretmen (iki ek yetkiyle birlikte). Okulun bölümüne müdür ve
  öğretmenden başkası giremez: **"Yetkin yok"** (403). Yetkisi eksik olan: **"Bu işlem için yetkin yok"** (403).
- **Sayfa açılırken** okulun rolleri, yetki kataloğu ve şablonlar, öğretmen listesi, sınıf listesi ve ders listesi birlikte
  istenir; biri reddedilirse sayfa hiç çizilmez.
- **Hazır rol ilk açılışta kurulur:** okulun hazır Öğretmen rolü yoksa sayfa ilk açıldığında ilk yetkileriyle kurulur.
- **"Okuldaki N öğretmenin hepsinde"** sayısına onay bekleyen öğretmen başvuruları da girer (onların yetkisi yoktur ve alttaki
  listede görünmezler).
- **"Öğretmenlerin ek rolleri"** kartında yalnız onaylı öğretmenler durur; bir öğretmen bugün en çok **bir** ek rol taşır.
- **Hatalar:** rol seçicinin ve "Sil"in hatası sayfada değil, tarayıcının uyarı kutusunda çıkar; rol penceresinin hatası
  pencerenin altında kırmızı yazılır.
- **Değişiklik ne zaman geçer:** sunucu yeni yetkiyle hemen karar verir; ama öğretmenin menüsü sayfayı yenileyince ya da yeniden
  girince değişir.
- **İşlem kaydı:** rol oluşturma "Rol oluşturuldu", düzenleme "Rol yetkileri değiştirildi", silme "Rol silindi", rol verme
  "Kullanıcıya rol atandı" diye yazılır ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)). Rolü geri alma kaydedilmez.
- **Tasarımda:** kimse kendinden fazla yetki veremez; müdür atama, ortak karar ve okulu kapatma hiçbir role verilemez; kişiye
  birden çok rol verilebilir; rolsüz çalışana da özel rol verilebilir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Roller ve yetkiler](README.md)):

- [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) — sayfanın ilk kartı.
- [Rol ekle / düzenle](rol-duzenleyici.md), [Hazır rol şablonları](hazir-sablonlar.md), [Role branş](rol-bransi.md),
  [Rol silme](rol-silme.md).
- [Yetki listesi](yetki-listesi.md), [Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md),
  [Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md), ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md),
  [Özel roller](ozel-roller.md).

**İlgili:**

- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md), [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md),
  [Öğretmenler ve çalışanlar listesi](../ogretmenler-calisanlar/liste.md).
- [Sol menü](../menu-ve-arama/sol-menu.md) — rolün adıyla açılan menü bölümü.
- [İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — `SAYFALAR.roller` (beş isteği birlikte
  atar, üç kartı çizer), `yetkiEtiketleri` (daraltmalı etiketler), `rolSecBagla` (öğretmenin seçicisi), `rol-yeni`,
  `rol-duzenle`, `rol-sil` eylemleri. Menü satırı: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md).
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `GET /api/school/roles` (hazır rolü gerekirse kurar),
  `GET /api/school/permissions`, `role`, `role-update`, `role-delete`, `role-assign`; [sunucu/yetki.md](../../sunucu/yetki.md) —
  yetki kataloğu, şablonlar, `rolOzeti`; [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md) — rollerin tabloları.
- Testler: [testler/test-rol.md](../../testler/test-rol.md), [testler/test-kapsam.md](../../testler/test-kapsam.md),
  [testler/test-etut.md](../../testler/test-etut.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Roller ve yetkiler".

## Sık sorulanlar

- **Müdür yardımcısı ya da rehber öğretmen gibi görevler nasıl verilir?** Bu sayfada rol oluşturup yetkilerini tek tek seçer,
  sonra öğretmene verirsin; hazır şablonlardan başlayabilirsin (sitenin SSS'si). Tasarımda rolü okulun bir çalışanına verirsin.
- **"Roller ve Yetkiler"e girdim, "Bu işlem için yetkin yok" yazıyor.** Müdür değilsen rolünde "Rol oluşturur ve düzenler"in
  yanında "Öğretmen bilgisi ve branşını düzenler" ve "Sınıf açar ve siler" de olmalı; müdürden iste.
- **Öğretmenin menüsünde değişiklik yok.** Öğretmen sayfayı yenileyince (ya da yeniden girince) gelir.
- **Hazır Öğretmen rolünü silebilir miyim?** Hayır; istemediğin yetkileri kapatırsın.

## Sırada

- Çalışan olarak ekleme (iş 2): rolün Çalışanlar sayfasından "+ Rol ata" ile verilmesi, kişiye birden çok rol, "Öğretmenlerin ek
  rolleri" kartının kalkması.
- Özel roller (iş 24): yeni yetkiler ve şablonlar, gruplu ve aranabilir yetki listesi, rol başına kapsam, açıklama ve branş.
- Özel branş / ders (iş 36): rolün branşı ve kapsamdaki ders listesinin okulun kendi derslerinden gelmesi.
- Güvenlik denetimi (iş 3): rol yönetiminde kendinden fazla yetki verememe.
- Çok dil (iş 22): sayfa, yetki ve şablon adları çeviri kataloğuna girer.
