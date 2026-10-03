# Sınavlar · Dershane portalında deneme sınavları

**Durum:** Tasarlandı — henüz kodda yok

Okulunun yanında bir dershaneye de giden öğrencinin, dershane portalındaki **"Deneme sınavları"** sayfası: yaklaşan denemeler,
denemeye kayıt olma ve deneme sonuçları (puan, gruptaki sıra, ders ders net).

## Ne işe yarar

Kullanıcı 28 Eylül'de dershane ve okulun ikisinin de Eğitim Evi'ni kullanmasını, öğrencinin aynı anda ikisinde de olabilmesini
istedi ([Öğrencide portallar](../portallar/ogrencide-portallar.md)). Tasarım 1 önizlemesinde öğrencinin ikinci portalı bir dershanedir
("Örnek Dershanesi · 7. sınıf B grubu") ve menüsünde "Deneme sınavları" vardır. Bu sayfa önizlemenin örneğidir: **denemeye kayıt
olma ("Kayıt ol" / "Kaydımı iptal et")** ve **gruptaki sıra** kullanıcının sözlerinde ve tanımlarda geçmez; yalnız önizlemede
çizildi. Kodlamadan önce kullanıcıya sorulmalı (açık nokta). Dershane de bir kurum olarak Eğitim Evi'nin bütün sınav özelliklerini
(şablon, değer girişi, gruplar) kullanır; bu belge yalnız öğrencinin dershane portalında gördüğünü anlatır.

## Nereden açılır

- Öğrenci **"Portallarım"**dan dershane portalına geçer ("Öğrenci · 7. sınıf B grubu · Örnek Dershanesi") → menüde **"Deneme
  sınavları"** (menünün tamamı: "Ana sayfa", "Ödevler", "Deneme sınavları", "Ders programı").
- Dershane portalının ana sayfasında **"Deneme sınavları"** bölümü (yaklaşan ve son sonuç; "hepsi →").
- Dershanenin bildirimleri: **"Deneme 4 için kayıtlar açıldı"** ("11 Ekim Pazar 10:00 · 2. kat salon"), **"Deneme 3 sonucu açıklandı:
  452,600"** ("7. sınıf B grubunda 4. (26 öğrenci)"); birden çok kurumun varsa başında kurumun adı ("Örnek Dershanesi · …").

## Adım adım

### Öğrenci

**Listeye bakmak**

1. **"Deneme sınavları"**: başlık "Deneme sınavları", alt yazısı **"Örnek Dershanesi · 90 soru · puan 500 üzerinden"**.
2. **"Yaklaşan"** bölümü: her deneme bir satır — solda "DNM" rozeti, adı ("Deneme 4"), altında "11 Ekim Pazar 10:00 · Örnek
   Dershanesi · 2. kat salon", sağda **"Kayıt açık"** (turuncu) ya da **"Kayıtlısın"** (yeşil).
3. **"Sonuçlar"** bölümü: adı ("Deneme 3"), altında "27 Eylül Pazar 10:00 · grupta 4 / 26", sağda puan ("452,600").

**Denemeye kayıt olmak**

4. Yaklaşan denemeye dokun. Pencere başlığı denemenin adı; bilgiler: **"Kurum:"** ("Örnek Dershanesi · 7. sınıf B grubu"),
   **"Tarih:"** ("11 Ekim 2026 Pazar 10:00"), **"Yer:"** ("Örnek Dershanesi · 2. kat salon"), **"Süre:"** ("135 dakika · 90 soru"),
   **"Kaydın:"** **"Kayıtlı değilsin"** ya da **"Kayıtlısın"**.
5. Altında not: **"Kayıt olursan sınav günü salonda yerin hazırlanır; gelemeyeceksen kaydını sınavdan önce iptal et."**
6. Düğmeler: **"Kapat"** ve **"Kayıt ol"** (kayıtlıysan **"Kaydımı iptal et"**).

**Sonuca bakmak**

7. Sonuçlanmış denemeye dokun. Pencere başlığı "Deneme 3 · sonuç"; bilgiler: **"Kurum:"**, **"Sınav:"** (sınavın günü ve saati),
   **"Sonuç:"** (sonucun açıklandığı an, "28 Eylül 2026 Pazartesi 17:45"), **"Puan:"** ("**452,600** / 500"), **"Grupta:"** ("4 / 26.
   sırada").
8. Altında ders ders tablo: **"Ders · Soru · D · Y · B · Net"** (Türkçe 20 soru, Matematik 20, Fen Bilimleri 20, Sosyal Bilgiler 10,
   Din Kültürü 10, İngilizce 10); son satır **"Toplam"** (90 soru ve toplam net). Altında **"Net = Doğru − Yanlış / 3"**.
9. **"Kapat"**.

### Veli

- Çocuğu birden çok kurumdaysa her kurum velide ayrı bir portal satırıdır; dershanenin deneme sonuçlarını ve kayıtlarını velinin
  nasıl göreceği önizlemede çizilmedi (açık nokta; [Öğrencide portallar](../portallar/ogrencide-portallar.md#veli)).

## Kurallar ve sınırlar

- **Yalnız önizlemede:** denemeye kayıt (kayıt ol / iptal), "Kayıt açık" durumu ve gruptaki sıra ("4 / 26") kullanıcının sözlerinde ve
  tanımlarda yok; kodlamadan önce sorulacak. Gruptaki sıra öğrencinin başka öğrencilerle karşılaştırılmasıdır; okulun bugünkü
  ekranlarında böyle bir sıralama yok (ödev serisinde bile "kimseyle karşılaştırılmaz").
- **Puan ve net:** önizlemede net = Doğru − Yanlış / 3 ve puan 500 üzerinden; bu, okulun "LGS Denemesi" şablonunun hesaplanan net
  ölçümüyle aynı mantıktır ([Ölçümler ve formül](olcumler-ve-formul.md)).
- **Kurumlar ayrı:** dershanenin sınavları dershanede, okulunkiler okulda kalır; okul dershanenin notlarını, dershane okulunkini görmez.
  Öğrenci her ikisini kendi portallarında görür.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Sınavlarım](sinavlarim.md) — okul portalındaki sınav sayfası.
- [Sınav ayrıntısı](sinav-ayrintisi.md) — okulda sınava dokununca açılan pencere.
- [Sınav planlama](sinav-planlama.md) — salon ve koltuk (dershanedeki "salonda yerin hazırlanır" buna benzer).
- [Şablonlar](sablonlar.md), [Ölçümler ve formül](olcumler-ve-formul.md).

**İlgili:**

- [Öğrencide portallar](../portallar/ogrencide-portallar.md), [Portallarım](../portallar/portallarim.md),
  [Portala geçiş](../portallar/portala-gecis.md).
- [Bildirim paneli](../bildirim/bildirim-paneli.md) — birden çok kurumda bildirimin başında kurumun adı.

## Kod tarafı

- Bugün bu sayfanın kodu yok. Öğrencinin birden çok kurumda olması ve kurum portalları tasarımdadır (spec-ogrenci-portal, onaylı; iş 19).
  Dershane de okul gibi bir kurum olarak bugünkü sınav kodunu kullanır ([sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md)).
  Denemeye kayıt ve gruptaki sıra için yeni tablo ve uç gerekir (onaylanırsa).
- Kodlanınca bu belgenin "Durum" satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Okul notlarım dershanede görünür mü?** Hayır; her kurum kendi kayıtlarını görür. Sen ikisini kendi portallarında görürsün.
- **Denemeye kaydımı nasıl iptal ederim?** Önizlemede yaklaşan denemenin penceresinde "Kaydımı iptal et"; bu özellik henüz onaylı
  değil.

## Sırada

- Tek kişi tek hesap + portallar öğrencide de (iş 19, onaylı): dershane portalı.
- Arayüz önizlemesi (Tasarım 1): dershane "Deneme sınavları" sayfası — denemeye kayıt ve gruptaki sıra kullanıcıya sorulacak.
