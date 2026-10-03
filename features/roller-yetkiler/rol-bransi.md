# Roller ve yetkiler · Role branş

**Durum:** Tasarlandı — henüz kodda yok

Okulun kendi adını verdiği bir role (ör. "Otizm destek öğretmeni") bir branş ("Özel eğitim · Otizm") bağlamak; rolü alan kişi o
branşla görünür ve o branşın dersine atanabilir.

## Ne işe yarar

Bugün rolün yalnız adı ve yetkileri vardır; branş öğretmenin kendi bilgisidir ve sabit dokuz derslik listeden seçilir. Oysa okullar
kendi görevlerini ve alanlarını açmak ister: kaynaştırma öğrencileriyle çalışan bir özel eğitim öğretmeni, robotik ya da satranç
dersine giren bir eğitmen gibi.

Kullanıcı 2 Ekim'de istedi: "bi role branş atanabilsin; seçince otizm isimli rol yapıp ona branş atanabilir yapabilirim". Sorulan
"Otizm rolüne Özel eğitim branşı verilir. Rolü alan öğretmen o branşla görünür ve o dersi alabilir. Böyle mi düşündün?" sorusuna
cevabı: "yani nası desem custom name custom thing demek istedim" — yani okul hem rolün **adını** hem **branşın / dersin adını**
kendisi koyabilsin, yalnız hazır listeden seçmek zorunda kalmasın.

## Nereden açılır

Tasarımda (Tasarım 1 önizlemesi): **"Roller ve yetkiler"** → **"Rol ekle"** ya da bir rolün satırı → pencerede **"Branş"** alanı
(Rol adı ve Açıklama'nın altında, Kapsam'ın üstünde). Branş listesinin kaynağı **"Okul düzeni"** → **"Dersler ve branşlar"**
sayfası ([Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md)).

Bugünkü sitede bu alan yok.

## Adım adım

### Müdür

Tasarımda:

1. Rolün penceresinde **"Branş"** seçicisini aç. Seçenekler:
   - **"Branşsız"** (ilk değer);
   - okulun ders ve branş listesi, "Dersler ve branşlar" sayfasındaki sırayla (önizlemede "Matematik", "Türkçe", "Fen Bilimleri",
     "Sosyal Bilgiler", "İngilizce", "Din Kültürü", "Beden Eğitimi", "Müzik", "Görsel Sanatlar", "Bilişim", "Rehberlik", "Seçmeli:
     Satranç", "Özel eğitim · Otizm");
   - en sonda **"Yeni branş adı yaz…"**.
2. Listeden birini seç ya da "Yeni branş adı yaz…"u seçip açılan kutuya adı yaz (içinde soluk örnek "ör. Özel eğitim · Otizm").
   Altındaki not: **"Branş listesi "Dersler ve branşlar"dan gelir."**
3. Rolün öbür alanlarını doldur (adı, açıklaması, kapsamı, yetkileri, kişileri) ve **"Rolü ekle"** / **"Kaydet"**
   ([Rol ekle / düzenle](rol-duzenleyici.md)).
4. Rol listesinde rolün adının yanında branş **rozeti** çıkar (ör. "Rehber öğretmen" yanında "Rehberlik").

**Önizlemedeki örnek rol:**

| Alan | Değer |
|---|---|
| Rol adı | "Otizm destek öğretmeni" |
| Açıklama | "Kaynaştırma öğrencileriyle bireysel çalışma" |
| Branş | "Özel eğitim · Otizm" |
| Kapsam | Kendi dersleri · kendi sınıfları |
| Yetkiler | "Derse atanabilir", "Oturumuna bakar", "Devamsızlığı görür", "Sınıfa ve gruba toplu mesaj", "Toplantı açar" |
| Kişiler | 1 kişi (listede "1 kişi · 5 yetki · Kendi dersleri · kendi sınıfları · Burcu Er") |

"Dersler ve branşlar" sayfasında bir kaydın türü **"Ders (programa konur)"** ya da **"Yalnız branş"** olur. "Özel eğitim · Otizm"
önizlemede "Yalnız branş"tır: programa konmaz ama role ve öğretmene branş olarak verilir; sayfadaki satırında "N öğretmen · yalnız
branş" yazar. Bir dersin "N öğretmen" sayısına o branşı taşıyan rolün kişileri de girer.

### Çalışan

Tasarımda: branşlı rolü alan kişi o branşla görünür ve branşın dersine atanabilir (rolde "Derse atanabilir" varsa; kapsamı
izin veriyorsa). Branş "Dersler ve branşlar"da **"Ders (programa konur)"** türündeyse (ör. "Seçmeli: Satranç") kişi programda o
derse öğretmen olarak seçilebilir. **"Yalnız branş"** türündeyse (ör. "Otizm destek öğretmeni" rolünün "Özel eğitim · Otizm"
branşı) programa konmaz; kişi yalnız o branşla görünür ve branşın öğretmen sayısına girer.

## Kurallar ve sınırlar

- **Tek branş:** rolün bir branşı olur ya da hiç olmaz ("Branşsız").
- **Liste okulundur:** branşlar "Dersler ve branşlar"dan gelir; okul orada çok sayıda ders ve branş açabilir (kullanıcı 2 Ekim:
  "derse de branş eklenebilecek baya bir"; öneri: okul başına 200'e kadar, ad okul içinde tek). Rol penceresindeki "Yeni branş
  adı yaz…" o rol için yeni bir ad yazmayı sağlar.
- **Rol ile branş birlikte:** "Otizm" rolü + "Otizm" branşı kullanılabilir; istenirse rol kapsamla belirli sınıflarla sınırlanır
  (eklenti tanımı §4).
- **Bugünkü engel:** ders listesi sabittir ("Matematik", "Türkçe", "İngilizce", "Din Kültürü ve Ahlak Bilgisi", "Sosyal Bilgiler",
  "Fen Bilimleri", "Müzik", "Resim", "Beden Eğitimi"); listede olmayan branş ve ders reddedilir ve rolün ders daraltmasında okulun
  kendi dersi sessizce düşer. Özel branş / ders işi bunu değiştirecek; branşlı rol o işe bağlıdır.
- **Önizlemede ayrıntısı belirsiz:** iki rolün farklı branşları olan bir kişinin nasıl görüneceği, kişinin kendi branşıyla rolün
  branşının nasıl birleşeceği tasarımda çizilmedi (açık nokta).

## Kardeşler ve ilgili

**Kardeşler:** [Rol ekle / düzenle](rol-duzenleyici.md) · [Roller ve yetkiler ekranı](roller-ekrani.md) ·
[Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) · [Özel roller](ozel-roller.md) · [Yetki listesi](yetki-listesi.md).

**İlgili:**

- [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md) — "Dersler ve branşlar" sayfası (ad, kısaltma, renk,
  tür).
- [Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md) — branşlı rolü taşıyanın derse atanması.
- [Program kurma](../ders-programi/program-kurma.md) — okulun kendi dersinin programa konması.
- [Eklentiler](../eklentiler/README.md) — aynı konuşmada istenen eklenti yetkileri.

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü kod belgeleri:

- [sunucu/ortak.md](../../sunucu/ortak.md) — sabit ders listesi `SUBJECTS`.
- [sunucu/yetki.md](../../sunucu/yetki.md) — `kapsamTemizle` ders adlarını bu listeyle süzüyor.
- [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — rol uçları (yeni alan), derse atama.
- [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — öğretmen branşının listeyle denetimi ("branş listesinde yok").
- [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md) — rol tablosuna yeni alan.
- [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — rol penceresi.

## Sık sorulanlar

- **Branşlı rol yetki verir mi?** Hayır; yetkileri rolün "Yetkiler"i belirler. Branş, kişinin hangi alanda göründüğünü ve hangi
  derse atanabileceğini söyler.
- **Listede istediğim branş yok.** "Dersler ve branşlar"dan ekle ya da rol penceresinde "Yeni branş adı yaz…"u seç.

## Sırada

- Özel branş / ders (iş 36): okulun kendi branşları ve dersleri, "Dersler ve branşlar" sayfası, listenin her yerde kullanılması.
- Özel roller (iş 24): rol penceresindeki "Branş" alanı ve listedeki branş rozeti.
