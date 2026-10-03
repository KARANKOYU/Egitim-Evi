# Sınavlar · Okulun sınavları

**Durum:** Tasarlandı — henüz kodda yok

Müdürün okulun bütün sınavlarını süzgeçli bir listede gördüğü, sınav ve sınav grubu açtığı, açtığı sınavın notlarını hangi
öğretmenlerin gireceğini seçtiği sayfa.

## Ne işe yarar

Kullanıcı ilk isteğinde (28 Ağustos) şunu istedi: **"sınavları da müdür oluştursun ve o sınavın notlarının hangi öğretmen
tarafından ellenebileceğini yapsın."** Ortak denemeler, dönem sınavları, bütün 7. sınıfların aynı gün girdiği sınavlar gibi
okul düzeyindeki sınavları müdür açar; değerleri ilgili öğretmenler girer. Müdür ayrıca okulda hangi sınavın planlandığını, hangisinin
sonucunun beklendiğini, hangisinin girildiğini tek listede izler.

Bugünkü sitede bu yok: müdür yalnız **kendi** sınavlarını açar ve görür ("Kendi Derslerim → Sınavlar"), öğretmenlerin
sınavlarını göremez; sınav yalnız açanınındır, başka biri o sınava not giremez.

## Nereden açılır

- **Tasarımda (Tasarım 1 önizlemesi):** müdürün sol menüsünde **"Okul düzeni"** başlığı altında, "Ders programı"nın hemen altında
  **"Sınavlar"**. Sayfa başlığı **"Sınavlar"**, alt yazısı **"Okulun bütün sınavları ve sınav grupları"**.
- Müdürün menüsündeki **"Kendi derslerim"** bölümü (Sınavlar, Yoklama) kalkar. Kullanıcı 2 Ekim'de bunu sordu: **"müdürün niye
  kendi derslerim var"**.

## Adım adım

### Müdür

**Listeye bakmak**

1. "Okul düzeni → **Sınavlar**".
2. Üstte **"Sınav aç"** ve **"Sınav grubu aç"** düğmeleri.
3. Altında süzgeçler: sınıf çipleri **"Bütün sınıflar"**, "5-A", "7-A", "7-C", "8-A", "8-B" … ve sağda ders seçimi **"Bütün dersler"**,
   "Matematik", "Türkçe", "Fen Bilimleri", "İngilizce", "Ortak" … Bir çipe basınca ya da ders seçince liste hemen süzülür; birden
   çok sınıfın ortak sınavı ("7. sınıflar") o düzeyin her sınıfında da görünür.
4. **"Okulun sınavları"** bölümü, başlığın sağında **"7 sınav"** gibi sayı. Her sınav bir satır:
   - solda gün ve ay ("8 Ekim");
   - başlık "sınav · sınıf" ("1. yazılı · 7-A", "LGS deneme 1 · 7. sınıflar");
   - altında "ders · açan kişi · tarih saat" ("Matematik · açan Ayşe Kaya · 8 Ekim 10:10");
   - altında **"not: Ayşe Kaya"** — değerleri girecek öğretmen(ler) ("not: Ayşe Kaya, Selin Arı, Ali Yıldız");
   - sağda durum: mavi **"Planlı"**, turuncu **"Sonuç bekliyor"** (sınav oldu, değer girilmedi), yeşil **"Sonuç girildi"**.
5. Süzgeçle hiç sınav kalmazsa **"Bu süzgeçle sınav yok."**
6. Satıra dokununca **"Sınav ayrıntısı"** penceresi açılır ([Sınav ayrıntısı](sinav-ayrintisi.md)).

**Sınav açmak ve notu girecek öğretmeni seçmek**

7. **"Sınav aç"** → üç adımlı pencere ([Yeni sınav açma](yeni-sinav.md)); "Sınıflar"da okulun sınıfları çıkar.
8. **"Ders"**in hemen altında **"Notları girecek öğretmen(ler)"** bölümü:
   - seçilen öğretmenler ad çipleri hâlinde, her birinin yanında **"×"** (çıkarır); hiç yoksa **"Henüz öğretmen seçilmedi."**;
   - **"+ Öğretmen ekle"** açılır listesi: önce **"<ders> öğretmenleri"** grubu (seçilen dersin branşındaki öğretmenler, ör.
     "Matematik öğretmenleri"), sonra **"Öbür öğretmenler"** ("Ali Yıldız · Fen Bilimleri" gibi ad · branş);
   - altında **"Varsayılan: dersin öğretmeni. Bu sınavın değerlerini yalnız seçilen öğretmenler girer."**
9. Ders seçimini değiştirirsen (elle öğretmen eklemediysen) seçim yeni dersin öğretmenine döner; bir kez elle ekler ya da
   çıkarırsan seçim artık ders değişince değişmez.
10. **"Sınavı aç"**: hiç öğretmen seçilmemişse **"Notları girecek en az bir öğretmen seç."**; öbür hatalar "Sınav aç" penceresiyle
    aynı. Başarılıysa **"Sınav açıldı: 1. yazılı · 7-A · 15 Ekim 10:00"** ve sınav listenin başına "Planlı" durumla, "not: …"
    satırıyla eklenir.

**Sınav grubu açmak**

11. **"Sınav grubu aç"** → aynı "Sınav grubu aç" penceresi (üst değer, paylar, kaydırıcılar, kilit); okulun sınavlarından grup
    kurarsın ([Sınav grupları](sinav-gruplari.md)).

### Öğretmen

1. Müdürün açıp notunu sana bıraktığı sınav kendi **"Sınavlar"** sayfanda görünür; satırın altında **" · açan: Murat Şahin"**.
2. Sınav olunca "Olmuş sınavlar"da **"Değer gir · 0 / 30"** düğmesiyle değerleri girersin ([Not (değer) girişi](not-girisi.md)).
3. Bu sınavda **"Düzenle"** ve **"Sil"** yoktur: yalnız açan (müdür) düzenler ve siler.
4. Bir sınavın notunu birden çok öğretmen girebilir (ör. ortak denemede her dersin öğretmeni).

### Çalışan

- Müdürün listesindeki "Öbür öğretmenler" grubundan herhangi bir öğretmen (Öğretmen rolü olan çalışan) notu girmeye seçilebilir.
- Önizlemede bu sayfa yalnız müdürün menüsünde. Müdür Yardımcısı gibi bir özel rolün okulun sınavlarını görüp açması için bir
  yetki tanımlanmadı (açık nokta; bugünkü yetki listesinde "Sınav oluşturur" ve "Sınav notu girer" var,
  [Yetki listesi](../roller-yetkiler/yetki-listesi.md)).

## Kurallar ve sınırlar

- **Kim açar:** müdür (tasarımda). Sınavı açan müdürdür ("açan Murat Şahin"); düzenleme ve silme açanın.
- **Kim not girer:** yalnız müdürün seçtiği öğretmenler (en az bir). Varsayılan: seçilen dersin branşındaki öğretmen.
- **Durumlar:** "Planlı" (sınav tarihi gelmedi), "Sonuç bekliyor" (sınav oldu, değer girilmedi), "Sonuç girildi".
- **Süzgeç:** sınıf (tek sınıf ya da bütün sınıflar) ve ders; ikisi birlikte uygulanır.
- **Bugünkü siteden fark:** bugün sınav yalnız açanınındır; müdür başka öğretmenin sınavını göremez, açamaz, notunu giremez; yalnız
  "Sınav notu girer" yetkisi olan öğretmen de başkasının sınavına not giremez. Tasarım bu iki boşluğu kapatır.
- **Yetki:** müdürün bütün yetkileri vardır. Notu girecek öğretmenin "Sınav notu girer" yetkisi olmalıdır (yetkisi kapalı birinin
  seçilip seçilemeyeceği tanımlanmadı).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Yeni sınav açma](yeni-sinav.md) — "Sınav aç" penceresi.
- [Sınav grupları](sinav-gruplari.md) — "Sınav grubu aç".
- [Not (değer) girişi](not-girisi.md) — seçilen öğretmenin değer girmesi.
- [Sınavlar listesi](sinavlar-listesi.md) — öğretmenin listesinde "açan:" satırı.
- [Sınav ayrıntısı](sinav-ayrintisi.md), [Sınav planlama](sinav-planlama.md).
- [Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md).

**İlgili:**

- [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md), [Sol menü](../menu-ve-arama/sol-menu.md).
- [Öğretmenler ve çalışanlar listesi](../ogretmenler-calisanlar/liste.md) — branşlar.
- [Dışarı aktarım](../excel-aktarim/disa-aktarim.md) — "Not çizelgesi".

## Kod tarafı

- Bugün bu sayfanın kodu yok. Bugünkü kısıtlar: sınav uçları sınavın sahibini denetler (`e.teacherId !== me.id` → 403 "Yetkin
  yok"), müdür de dahil ([sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md)); müdürün menüsü
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) ("Kendi Derslerim → Sınavlar"); okulun öğretmenleri ve
  branşları [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md).
- Yeni gereken: sınavın "notu girecek öğretmenler" listesi (yeni tablo) ve değer yazma ucunun bu listeye bakması; okulun bütün
  sınavlarını süzgeçle getiren uç.
- Kodlanınca bu belgenin "Durum" satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Ortak denemeyi kim açar?** Tasarımda müdür açar, her dersin öğretmenini "Notları girecek öğretmen(ler)"e ekler.
- **Öğretmen müdürün sınavını silebilir mi?** Hayır; yalnız değer girer.
- **Bugün müdür öğretmenin sınavına not girebilir mi?** Hayır; bugün sınav yalnız açanınındır.
- **"Sonuç bekliyor" ne demek?** Sınav oldu ama değerleri henüz girilmedi.

## Sırada

- Arayüz önizlemesi (Tasarım 1) koda geçerken: "Okul düzeni → Sınavlar" sayfası ve "Notları girecek öğretmen(ler)" (kullanıcının
  28 Ağustos isteği), müdürün "Kendi derslerim" bölümünün kalkması (kullanıcının 2 Ekim sözü).
- Mesaj ayarları … sınav planlama (iş 8): durumlar ("Planlı", "Sonuç bekliyor", "Sonuç girildi") sınavın saatine göre.
- Özel roller (iş 24, öneri): okulun sınavlarını görme yetkisinin bir role verilip verilmeyeceği.
