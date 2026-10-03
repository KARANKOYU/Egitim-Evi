# Sınavlar · Not (değer) girişi

**Durum:** Kodda var; tasarımda ek olarak okul no sütunu, hesaplanan sütunların kendiliğinden dolması, "N / M öğrenci girildi" sayacı, sınav bitmeden girişin kapalı olması, "Excel'den aktar" ve "Excel olarak indir", müdürün seçtiği öğretmenin de not girmesi.

Bir sınavın sonuçlarının girildiği tablo: satırlar öğrenciler, sütunlar sınavın ölçümleri (Puan; ya da Doğru, Yanlış, Net …).

## Ne işe yarar

Sınav bittikten sonra öğretmen her öğrencinin değerini girer; girilen değer öğrencinin Sınavlarım'ına, ilerleyişine,
grafiğine ve grup hesabına düşer, ilk girişte öğrenciye ve velisine bildirim gider. Tablo hızlı yazmak için yapılmıştır:
klavyeyle alt satıra geçilir, hatalı kutu anında kırmızı olur, yalnız değişen kutular kaydedilir. Kullanıcı ilk isteğinde
(28 Ağustos) bunu şöyle anlattı: **"üzerine tıklayınca her öğrenci ve yanında not girme olacak"**. Hesaplanan ölçümlerin
kendiliğinden dolması tasarımdadır ([Ölçümler ve formül](olcumler-ve-formul.md)).

## Nereden açılır

- **Bugünkü site:** "Sınavlar" → "Sınavlarım"da sınavın satırındaki **"Değer gir"**; bir grubun ekranındaki sınav satırında
  **"Değer gir"**; yeni sınavda **"Aç ve değer gir"** ([Yeni sınav açma](yeni-sinav.md)). Sayfanın adresi değişmez
  (`#/ogr-sinavlar`).
- **Tasarımda (Tasarım 1 önizlemesi):** öğretmenin "Olmuş sınavlar" bölümünde satırdaki **"Değer gir · 12 / 14"** (ya da "14 / 14
  girildi") düğmesi ([Sınavlar listesi](sinavlar-listesi.md)). Sayfa başlığı sınavın adı ("LGS Deneme 1"), alt yazısı "sınıf ·
  sınavın adı" ("7-A · LGS deneme 1").

## Adım adım

### Öğretmen

**Tabloyu açmak (bugünkü site)**

1. **"Değer gir"**e bas. Başlıkta sınavın adı büyük harfle, altında "25.09.2026 · Matematik · Yazılı (0-100) · Dönem 1 · etki %50"
   (şablonsuzsa "Şablonsuz", grupsuzsa "Grupsuz").
2. Başlığın altında sınavın ölçümleri çip çip ("**Puan** 0 – 100") ve **"+ Yeni değer ekle / alanları düzenle"** düğmesi
   ([Ölçümler ve formül](olcumler-ve-formul.md)).
3. Birden çok sınıfa giriyorsan üstte sınıf süzgeci: **"Tüm sınıflar"**, sonra sınıfların adları ("6-A", "7-B" …; sınıfı
   olmayan öğrenci "Sınıfsız"). Bir sınıfa basınca yalnız onun satırları görünür; seçim bir sonraki sınava da taşınır (o
   sınavda o sınıf yoksa "Tüm sınıflar"a döner).
4. Tablo: **"Öğrenci"**, (birden çok sınıfta) **"Sınıf"**, sonra her ölçüm bir sütun: başlıkta ölçümün adı ve altında aralığı
   ("0 – 100"); ana ölçümün başlığı renkli. Öğrenciler ada göre sıralıdır; ders verdiğin sınıfların **bütün** öğrencileri
   gelir (müdürde okulun bütün öğrencileri).
5. Ders verdiğin sınıflarda hiç öğrenci yoksa tablo yerine yalnız **"Ders verdiğin sınıflarda öğrenci yok."** yazar (alttaki
   düğmeler de çıkmaz; menüden dönülür).

**Değer yazmak**

6. Kutuya sayıyı yaz; ondalık için virgül ya da nokta: "87,5", "490,161". Boş kutuda yer tutucu "-".
7. Her tuşta kutu denetlenir:
   - sayı değilse ya da aralığın dışındaysa kutu **kırmızı** olur; üstüne gelince **"0 ile 100 arasında bir sayı yaz"** (kendi
     aralığıyla);
   - geçerli ve ilk hâlinden farklıysa **mavi** kenar alır (değişti).
8. **Enter** aynı sütunda alttaki (görünen) öğrenciye, **Shift+Enter** üsttekine geçer ve kutunun içini seçer.
9. Bir değeri silmek için kutuyu boşalt.

**Kaydetmek**

10. Altta **"Kaydet"** (grup sınavında yanında **"Gruba dön"**, değilse **"Sınavlara dön"**) ve ipucu **"Enter ile alttaki
    öğrenciye geçersin. Boş bırakılan kutu değeri siler."**
11. **"Kaydet"**e bas:
    - kırmızı kutu varsa kaydetmez: **"3 kutuda aralık dışı ya da sayı olmayan değer var (kırmızı). Önce onları düzelt."**
      (kırmızı kutu gizli bir sınıfın satırındaysa "Tüm sınıflar"a dönüp bulman gerekir);
    - hiçbir kutu değişmediyse **"Değişiklik yok."**;
    - değişen kutular gönderilir; düğme bir süre kilitlenir; başarıda yeşil **"12 değer kaydedildi. Öğrencilere bildirim gitti."**
      ve mavi kenarlar kalkar;
    - sunucu bazı değerleri yazamadıysa kırmızı **"2 değer yazılmadı: Net: 25 (-100 ile 100 arası olmalı); …"** (ilk 5 hata).
12. Değeri **ilk kez** girilen öğrenciye ve velisine bildirim gider; düzeltmede yeniden gitmez
    ([Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md)).
13. Değerler kaydedilir kaydedilmez öğrenci ve velisi görür ([Sınavlarım](sinavlarim.md)).

**Tasarımda: değer girişi (Tasarım 1 önizlemesi)**

1. Üstte: **"Sınavlara dön"**, sınıfın çipi ("7-A"), **"Form: LGS Denemesi"**, tarih ve saat ("10 Eylül · 10:00").
2. Sınav henüz bitmediyse tablo yerine: **"Sınav 15 Ekim 2026 Perşembe, saat 11:50. Değer girişi sınav bitince açılır."**
   ([Sınav planlama](sinav-planlama.md)).
3. Bittiyse araç satırı: **"Excel'den aktar"**, **"Excel olarak indir"** ([Excel'den not yükleme ve indirme](excelden-not.md)),
   son kayıt saati (**"Kaydedildi: 10:34"**) ve sağda **"Kaydet"**.
4. **"Değerler"** bölümü; başlığın sağında sayaç **"12 / 14 öğrenci girildi"** (elle girilen bütün ölçümleri tam olan öğrenci;
   yazdıkça güncellenir).
5. Tablo: **"No"** (okul no), **"Öğrenci"**, sonra her ölçüm: başlıkta kod ("D"), altında küçük adı ("Doğru Sayısı") ve aralığı
   ("0–90") ya da hesaplanan ölçümde formülü ("= D - Y/3"); üstüne gelince "ad · formül · aralık".
6. Bir sınavın tek sınıfı vardır: tabloda yalnız o sınıfın öğrencileri, sınıf süzgeci yok.
7. Hesaplanan sütunlar (Net, Net Yüzdesi …) gri ve yazılamaz; elle girilen değer değişince kendiliğinden dolar (iki ondalık).
8. Hatalı kutu kırmızı; üstüne gelince **"Sayı yaz"** ya da **"0–90 arasında olmalı"**.
9. **"Kaydet"**: kırmızı kutu varsa **"Kırmızı kutulardaki değerleri düzelt (sayı değil ya da aralık dışında)."** ve imleç o
   kutuya gider; yoksa **"Kaydedildi: 10:34"** ve kısa ileti **"Değerler kaydedildi (14 / 14 öğrenci girildi); öğrenciler
   sonucu görebilir."**
10. İlk kayıtla o öğrencinin **sonuç tarihi** kendiliğinden yazılır ([Sınav ayrıntısı](sinav-ayrintisi.md)).

### Müdür

- Bugünkü sitede yalnız **kendi açtığın** sınavlara değer girersin ("Kendi Derslerim → Sınavlar"); tabloda okulun bütün
  öğrencileri gelir (sınıf süzgeciyle). Öğretmenin sınavına giremezsin (sunucu "Yetkin yok").
- Tasarımda müdür sınavı açar ve notları **girecek öğretmenleri** seçer; değerleri o öğretmenler girer
  ([Okulun sınavları](okulun-sinavlari.md)).

### Çalışan

- Bugünkü sitede değer kaydetmek **"Sınav notu girer"** yetkisi ister (sınavın dersine göre); yetki yoksa tablo açılır ama
  "Kaydet" **"Not girme yetkin yok"** der.
- Yetki bir ek rolden geliyor ve rol **sınıflara** daraltılmışsa, kapsam dışındaki sınıfın öğrencisine yazılan değer
  **sessizce** atlanır: ekran "N değer kaydedildi" der, kutular kaydedilmiş görünür ama sayfa yeniden açılınca değer yoktur
  (bilinen açık, kod okumasına göre).
- Sınav açanınındır: yalnız "Sınav notu girer" yetkisi olan biri başkasının sınavına bugün not giremez. Tasarımda müdürün
  "Notları girecek öğretmen(ler)" seçimi bunu çözer.

## Kurallar ve sınırlar

- **Aralık:** her değer kendi ölçümünün alt ve üst sınırı arasında olmalı (sınırlar dahil). Sayı olmayan ya da aralık dışı
  değer ekranda kırmızı olur; sunucu da yazmaz ve "atlanan" sayar.
- **Sayı biçimi:** virgül ya da nokta ondalık sayılır; binlik ayırıcı yazılmaz. "1.234" bin iki yüz otuz dört değil **1,234**
  olarak okunur (aralıktaysa kabul edilir); "1.234,5" geçersizdir. Sunucu değeri 3 ondalığa yuvarlar.
- **Yalnız değişenler:** "Kaydet" yalnız ilk hâlinden farklı kutuları gönderir; gizli (süzülmüş) satırlardaki değişen kutular
  da gönderilir.
- **Boş kutu siler:** bir kutuyu boşaltıp kaydedersen o değer silinir.
- **Kimin öğrencisi:** tablo ders verdiğin sınıfların bugünkü öğrencileridir. Sınıfı değişen ya da okuldan ayrılan öğrencinin
  eski değeri bu tabloda görünmez (kayıtta durur).
- **Yetki ve sahiplik:** sınava yalnız açanı değer girer; "Sınav notu girer" yetkisi gerekir (**"Not girme yetkin yok"**).
- **Kaydedilmemiş değer:** "Sınavlara dön", "Gruba dön", sekme düğmeleri ve menü kaydetmeden çıkar, sormaz. Yalnız üst şeritteki
  "Yenile" sorar ("Sayfada yazdıkların kaydedilmedi…"); o da açık sınavı değil sekme listesini yeniden açar.
- **Bildirim iletisi:** ekran her kayıtta "Öğrencilere bildirim gitti." der; oysa bildirim yalnız değeri ilk kez girilen
  öğrenciye gider.
- **Kısmi hata:** sunucu bazı değerleri yazamasa da bütün kutular "kaydedildi" sayılır; yazılmayan değer mavi kenarını kaybeder.
- **Geçmiş yıl:** geçmiş yıla bakarken kaydetmek reddedilir (409).
- **Tasarımda:** sınav bitmeden (başlangıç + süre) giriş kapalı; hesaplanan ölçüm elle girilemez; sayaç elle girilen bütün
  ölçümleri tam olan öğrenciyi sayar; değerleri açanla birlikte müdürün seçtiği öğretmenler girer; her öğrencinin ilk yazılma
  ve son düzeltme anı tutulur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Sınavlar listesi](sinavlar-listesi.md) — "Değer gir".
- [Ölçümler ve formül](olcumler-ve-formul.md) — sütunlar, "+ Yeni değer ekle / alanları düzenle", hesaplanan ölçümler.
- [Excel'den not yükleme ve indirme](excelden-not.md) — tasarımda tabloyu Excel'le doldurmak.
- [Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md) — ilk girişte bildirim.
- [Sınav ayrıntısı](sinav-ayrintisi.md) — tasarımda sonuç tarihi.
- [Okulun sınavları](okulun-sinavlari.md) — tasarımda notu kimin gireceği.
- [Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md).

**İlgili:**

- [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md).
- [Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md), [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md) (öğrenci adına göre süzer).
- [Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md), [Sınav grafiği](../ilerleyis/sinav-grafigi.md) — girilen değerin göründüğü yerler.
- [Sınıflarım](../siniflar-dersler/siniflarim.md) — öğretmenin öğrenci penceresindeki sınav sonuçları.

## Kod tarafı

- Ön yüz: [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) — `sinavAc` (tablo, sınıf
  süzgeci), `EYLEMLER['sinav-sinif']`, `degerKutusuDenetle`, belge düzeyinde `input` ve `keydown` (Enter / Shift+Enter)
  dinleyicileri, `EYLEMLER['sinav-deger-kaydet']`; sayı yardımcıları
  [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md) (`sayiOku`, `sayiGirdi`, `sayiTR`).
- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `GET /api/exams/<id>` (öğrenciler ve değerleri),
  `POST /api/exams/<id>/grades` (`sinav.not-gir`, sınıf kapsamı, aralık, 3 ondalık, `atlanan` ve `hatalar`, ilk girişte
  `topluBildir`); depo [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`degerleri`, `degerleriYaz`);
  öğrenci listesi [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`ogretmeninOgrencileri`).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (virgüllü değer `490,161`, aralık dışı ve sayı olmayanın atlanması,
  başka öğretmenin not girememesi), [testler/test-bildirim.md](../../testler/test-bildirim.md) (yalnız ilk girişte bildirim).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Sınav sistemi" ("Değer girişi").

## Sık sorulanlar

- **Değeri yazdım, kutu kırmızı oldu.** Aralığın dışında ya da sayı değil; kutunun üstüne gelince doğru aralık yazar.
- **"Kaydet" kırmızı kutu var diyor ama göremiyorum.** Kutu süzgeçle gizlenmiş bir sınıfta olabilir; "Tüm sınıflar"a bas.
- **Bir öğrencinin notunu silmek istiyorum.** Kutuyu boşalt ve "Kaydet"e bas.
- **Notu düzelttim, öğrenciye yeniden bildirim gitti mi?** Hayır; bildirim yalnız ilk girişte gider (ekrandaki ileti yine
  "bildirim gitti" der).
- **Net'i de mi yazacağım?** Bugün evet. Tasarımda Net hesaplanır ve kendiliğinden dolar.
- **LGS puanını "455.500" diye yazdım, 455,5 mi oldu?** Evet; nokta ondalık sayılır. Binlik ayırıcı yazma.

## Sırada

- Sınav: formüllü ölçüm + notları Excel'den yükleme/indirme (iş 14): hesaplanan sütunlar, "Excel'den aktar", "Excel olarak indir".
- Mesaj ayarları … sınav planlama (iş 8): sınav bitmeden girişin kapalı olması.
- Sınav ayrıntı ekranı (kullanıcının 1 Ekim kararı): her öğrencinin ilk yazılma ve son düzeltme anının tutulması.
- Arayüz önizlemesi (Tasarım 1) koda geçerken: okul no sütunu, sayaç, "Kaydedildi: …".
- Müdürün "Notları girecek öğretmen(ler)" seçimi (tasarım).
