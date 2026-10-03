# Sınavlar · Yetkiler, kapalı bölüm ve geçmiş yıl

**Durum:** Kodda var; tasarımda ek olarak müdürün notu girecek öğretmeni seçmesi, rolsüz çalışanın sınav görmemesi ve Zümre Başkanı şablonuna "Sınav notu girer".

Sınav ekranlarını kimin açabildiği, kimin sınav açıp not girebildiği; ders ve sınıf daraltması, sınavın sahipliği, okulda
"Sınavlar" bölümünün kapatılması ve geçmiş eğitim yılının salt okunur olması.

## Ne işe yarar

Okul her öğretmene her şeyi açmak istemeyebilir: "öğretmenler sınav oluşturmasın, yalnız not girsin" ya da "zümre başkanı yalnız
Matematik sınavı açsın" gibi. Müdür bunu okulun hazır **Öğretmen** rolünden ve ek rollerden ayarlar. Sınavı hiç kullanmayan okul da
bölümü tamamen kapatabilir. Eski yılların notları ise değiştirilmeden korunur.

## Nereden açılır

- **Müdür:** **"Roller ve Yetkiler"** sayfası — hazır Öğretmen rolü ve ek roller; yetki listesinin **"Ödev ve sınav"** grubunda
  **"Sınav oluşturur"** ve **"Sınav notu girer"**, yanlarında **"Dersler"** ve **"Sınıflar"** daraltması
  ([Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md)).
- **Müdür:** **"Özellikler"** sayfasında **"Sınavlar"** ("Sınav ve sınav grupları, not girişi, öğrencinin sınav grafiği.") aç /
  kapat ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).
- **Herkes:** üst şeritteki eğitim yılı seçicisi ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).

## Adım adım

### Müdür

**Öğretmenlerin sınav yetkilerini ayarlamak**

1. "Roller ve Yetkiler" → hazır **Öğretmen** rolü. İlk kurulumda **"Sınav oluşturur"** ve **"Sınav notu girer"** açıktır.
2. Birini kapatırsan bütün öğretmenler için kapanır; ikisi de kapanınca öğretmen menüsünden **"Sınavlar"** kalkar.
3. Bir kişiye fazladan yetki vermek için ek rol aç (ör. hazır şablondan **"Zümre Başkanı"**: "Sınav oluşturur" ve "Sınıfa veya
   gruba toplu mesaj atar"), yetkinin yanında **"Dersler"** ve **"Sınıflar"**ı daralt (ör. yalnız Matematik), rolü öğretmene ver. Kişinin
   yetkileri Öğretmen rolü + ek rolün birleşimidir.
4. Daraltma yalnız **ek rolden gelen** yetkiye uygulanır; Öğretmen rolünde açık olan bir yetkiyi ek rolün daraltması kısıtlamaz.

**Bölümü kapatmak**

5. "Özellikler" → **"Sınavlar"**ı kapat. O andan itibaren hiçbir rolde sınav menüsü ve kutucuğu görünmez, sunucu sınav isteklerini
   reddeder; öğrencinin İlerleyişim'inde sınav kartları boş kalır. Kayıtlar silinmez; yeniden açınca geri gelir.

**Kendi yetkin**

6. Müdürün bütün yetkileri vardır (değiştirilemez). Ama bugünkü sitede sınav **açanınındır**: müdür de başka öğretmenin sınavını ve
   grubunu açamaz, değer giremez, silemez (sunucu **"Yetkin yok"**). Müdür yalnız okulun **şablonlarını** (kim açmış olursa olsun)
   düzenler ve siler.
7. Tasarımda müdür okulun bütün sınavlarını görür ve kendi açtığı sınavın notlarını hangi öğretmenlerin gireceğini seçer
   ([Okulun sınavları](okulun-sinavlari.md)).

### Öğretmen

- **"Sınav oluşturur"** — "Yeni sınav", "Yeni sınav grubu", "Sınav ekle" düğmelerini gösterir; sınav ve grup açmayı, sınavın
  alanlarını değiştirmeyi ("+ Yeni değer ekle / alanları düzenle"), sınav silmeyi sağlar.
- **"Sınav notu girer"** — değer tablosundaki "Kaydet"i çalıştırır.
- İkisinden biri varsa menüde "Sınavlar" çıkar. İkisi de yoksa menüden kalkar; ana sayfa kutucuğu durur ve sayfa açılır (eski
  sınavların görünür), ama işlemler reddedilir.
- Düğmelerin bir kısmı yetkiye bakmaz: **"Değer gir"**, **"Sil"** ve **"+ Yeni değer ekle / alanları düzenle"** her zaman çizilir;
  yetkisizse işlem sırasında ileti çıkar. **"Grubu sil"** yetkiye hiç bakmaz (sunucu da yalnız sahipliğe bakar): "Sınav oluşturur"u
  kaldırılmış öğretmen tek bir sınavı silemez ama kendi grubunu içindeki bütün sınavlarla silebilir (bilinen açık).
- Şablon açmak ("Yeni şablon", "Okula ekle") hiçbir sınav yetkisi istemez; düzenleme ve silme açanın ve müdürün.

### Çalışan

- Bugünkü sitede okulda görevli herkes öğretmen hesabıyla çalışır ve Öğretmen rolünü taşır; ek rolündeki sınav yetkileri ders ve sınıf
  daraltmasıyla gelir:
  - **ders** daraltması: başka dersin sınavını açmak **"<ders> dersinde sınav açma yetkin yok"**, değer girmek **"Not girme yetkin
    yok"**, alan değiştirmek **"Sınav düzenleme yetkin yok"**, silmek **"Sınav silme yetkin yok"**;
  - **sınıf** daraltması: değer tablosunda kapsam dışındaki sınıfın öğrencisine yazılan değer **sessizce** atlanır (ekran yine
    "kaydedildi" der; bilinen açık).
- Yalnız "Sınav notu girer" yetkisi olan biri bugün başkasının sınavına not giremez (sınav açanın).
- Tasarımda (spec-calisan): kişi okula **çalışan** olarak eklenir; müdür ona Öğretmen rolünü verince bugünkü öğretmen gibi sınav
  açar ve not girer. **Rolsüz çalışan** sınava atanamaz ve sınav ekranı görmez. Özel rol önerisinde "Zümre Başkanı" şablonu
  genişler: + "Sınav notu girer" (zümre sınavları) (spec-roller, öneri).

### Öğrenci

- Kendi sonuçlarını görür; sınav açamaz, not giremez. Okulda bölüm kapalıysa "Sınavlarım" menüden kalkar, sayfası "Bu bölüm okulunda
  kapalı. Okul müdürü Özellikler sayfasından açabilir." der.

### Veli

- Yalnız bağlı olduğu çocuğun sonuçlarını görür. Bölüm kapatma, **çocuğun okulunun** kuralına göre uygulanır.

## Kurallar ve sınırlar

- **Sunucu iletileri:**
  - öğretmen ya da müdür olmayan biri sınav uçlarına gelirse **"Yetkin yok"** (403);
  - "Sınav oluşturur" yoksa **"Sınav açma yetkin yok"**; ders kapsam dışıysa **"<ders> dersinde sınav açma yetkin yok"**;
  - değer girmede **"Not girme yetkin yok"**; alan değiştirmede **"Sınav düzenleme yetkin yok"**; silmede **"Sınav silme yetkin yok"**;
  - başkasının sınavı ya da grubu **"Yetkin yok"**; olmayanı **"Sınav bulunamadı"** / **"Sınav grubu bulunamadı"** (404);
  - başkasının şablonunu değiştirmek **"Bu şablonu yalnızca açan kişi ya da müdür değiştirebilir"**.
- **Sınıf daraltması** yalnız değer girmede öğrencinin sınıfına bakar ("Sınav oluşturur"un sınıf daraltması bugün hiçbir yerde
  denetlenmez, çünkü sınav bir sınıfa bağlı değildir). Sınıfı olmayan öğrenci bu denetimden geçer (kod okumasına göre).
- **Kapalı bölüm:** sunucu her rolde **"Sınavlar bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."** (403); sayfa
  **"Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir."**; kayıtlar silinmez.
- **Geçmiş yıl:** üstteki yıl seçicide eski bir yıl seçiliyken öğretmen ve müdürün sınav ve grup açma, değer girme, alan değiştirme,
  silme istekleri **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla
  dön."** ile reddedilir (409). Şablonlar yıla bağlı olmadığı için bu kuraldan muaftır.
- **Hesap onayı:** onaylanmamış hesap sınav uçlarına giremez.
- **Arayüzde gizlemek yetmez:** her denetim sunucuda yapılır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Sınavlar listesi](sinavlar-listesi.md), [Yeni sınav açma](yeni-sinav.md), [Not (değer) girişi](not-girisi.md),
  [Sınav grupları](sinav-gruplari.md), [Şablonlar](sablonlar.md).
- [Okulun sınavları](okulun-sinavlari.md) — tasarımda notu kimin gireceği.
- [Silme, eğitim yılı ve saklama](silme-ve-saklama.md).

**İlgili:**

- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md),
  [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md), [Özel roller](../roller-yetkiler/ozel-roller.md).
- [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md), [Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).
- [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md), [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md).

## Kod tarafı

- Yetki: [sunucu/yetki.md](../../sunucu/yetki.md) — `sinav.olustur` ("Sınav oluşturur"), `sinav.not-gir` ("Sınav notu girer"),
  kapsam `['ders', 'sinif']`, `OGRETMEN_VARSAYILAN`, `ROL_SABLONLARI` ("Zümre Başkanı"), `yetkiVarMi` (Öğretmen rolündeki yetki
  daraltılmaz).
- Sınav uçları: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `isTeacherLike`, sahiplik denetimleri, yetki iletileri;
  kapalı bölüm [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) (`exams`, `examgroups` → `sinav`) ve
  [sunucu/veri/depo/ozellikler.md](../../sunucu/veri/depo/ozellikler.md); arşiv kapısı [sunucu/api.md](../../sunucu/api.md) ve
  [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md).
- Ön yüz: menü [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`yetkim`, `SAYFA_OZELLIK`, `menuSuz`),
  [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) (düğmelerin yetkiye bakması).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (başka öğretmenin not girememesi, şablon yetkisi),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md) (Sınavlar kapalı okulda 403),
  [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md) (arşiv yılında grup açma 409).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Roller ve yetkiler", "Ders ve sınıf daraltması".

## Sık sorulanlar

- **Öğretmenler yalnız not girsin, sınav açmasın istiyorum.** Öğretmen rolünde "Sınav oluşturur"u kapat. Dikkat: bugün sınav
  açanınındır; o zaman not girilecek sınavları kimin açacağı sorunu doğar. Tasarımda sınavı müdür açar ve notu girecek öğretmenleri
  seçer.
- **Zümre başkanına Matematik sınavlarının notunu girme yetkisi verdim; öbür öğretmenlerin sınavına giremiyor.** Bugün bir sınava
  yalnız onu açan not girer; yetki kendi sınavları içindir.
- **Bölümü kapatınca notlar silinir mi?** Hayır; yeniden açınca hepsi geri gelir.
- **Geçen yılın bir notunu düzeltmem gerekiyor.** Geçmiş yıl salt okunurdur; düzeltme yapılamaz.

## Sırada

- Çalışan olarak ekleme (iş 2): rolsüz çalışanın sınav görmemesi; Öğretmen rolünün çalışana verilmesi.
- Özel roller (iş 24, öneri): "Zümre Başkanı"na "Sınav notu girer" (zümre sınavları).
- Okulun sınavları (tasarım): müdürün notu girecek öğretmenleri seçmesi; sahipliğin genişlemesi.
- Güvenlik denetimi (iş 3): "Grubu sil"in "Sınav oluşturur" yetkisine bakması (spec-guvenlik'te not edildi).
