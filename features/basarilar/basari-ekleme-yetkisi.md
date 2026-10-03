# Başarılar · "Başarı ekler" yetkisi

**Durum:** Tasarlandı — henüz kodda yok

Müdürün başarı eklemeyi bir role (ve o rolü taşıyan çalışanlara ya da öğretmenlere) verdiği yeni yetki: ekranda
"Başarı ekler", kodda `basari.ekle`.

## Ne işe yarar

Başarılar tanımına göre belgeyi "müdür ve ona yetki verilen" ekler. Müdür her belgeyi kendisi yüklemek zorunda kalmasın
diye bu iş bir role verilebilir: ör. müdür yardımcısı okulun bütün öğrencilerine, sınıf öğretmeni kendi sınıfına belge
ekler. Yetki, özel roller önerisindeki yeni yetkilerden biridir ve Tasarım 1 önizlemesinin "Roller ve yetkiler" ekranında
yer alır.

## Nereden açılır

Müdür: sol menüde "Okul düzeni" → **"Roller ve yetkiler"** → bir rolün satırındaki **"Düzenle"** (ya da yeni rol için
**"Rol ekle"**). Rol penceresinde "Yetkiler" bölümünün **"Öğrenciler"** grubunda:

| Yetki (ekranda) | Kodu |
|---|---|
| "Sınıflara yerleştirir" | `ogrenci.yerlestir` |
| "Hesap açar" | `ogrenci.hesap-ac` |
| "Bilgilerini düzenler" | `ogrenci.duzenle` |
| "Şifresini değiştirir" | `ogrenci.sifre` |
| "Portalına bakar" | `ogrenci.portal` |
| **"Başarı ekler"** | **`basari.ekle`** |

Tablodaki adlar Tasarım 1 önizlemesinden. Bugünkü sitede "Roller ve Yetkiler" ekranı var ama bu yetki yok; oradaki grubun
adı "Sınıf ve öğrenci", yetkilerin adları da başka (ör. "Öğrenci portalına girer")
([Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md)).

## Adım adım

### Müdür

1. "Roller ve yetkiler"de rolün satırına tıkla (ya da "Rol ekle" → "Şablondan başla"dan bir şablon seç).
2. "Yetkiler"de **"Öğrenciler"** grubunu aç (grup başlığında seçili sayı görünür, ör. "1 / 6"); **"Başarı ekler"** kutusunu
   işaretle. Yetkiyi bulmak için "Yetki ara" kutusuna "başarı" yazabilirsin.
3. **"Kapsam"** iki satırdır: "Ders" ("Bütün dersler", "Kendi dersleri" ya da tek tek ders adları) ve "Sınıflar" ("Bütün
   sınıflar", "Kendi sınıfları" ya da tek tek sınıflar, ör. "7-A"). Altında özeti yazar (ör. "Kapsam: Bütün dersler · Bütün
   sınıflar"). Tanıma göre "Başarı ekler" sınıf kapsamına uyar: "Kendi sınıfları" seçilen rol yalnız kendi sınıflarının
   öğrencilerine ekler. (Tasarım 1'de kapsamın notu "'Derse atanabilir' gibi yetkiler yalnız bu ders ve sınıflarda geçer."
   der ve kapsam özeti "Başarı ekler"in yanında görünmez; bu yetkinin kapsama uyduğu ekranda belirlenmedi.)
4. "Kişiler"de **"+ Kişi ekle"** ile rolü alacak kişileri seç. (Ya da sol menüdeki "Çalışanlar" sayfasında kişiye
   tıklayıp **"+ Rol ata"**dan rolü seç.)
5. **"Kaydet"** (yeni rolde **"Rolü ekle"**). O kişiler artık "Başarılar" sayfasından belge ekler
   ([Başarı ekle](basari-ekleme.md#çalışan-ve-yetkili-öğretmen)).
6. Geri almak için kutunun işaretini kaldırıp kaydet ya da kişiyi rolden çıkar.

**Hazır şablonlar** (Tasarım 1 önizlemesi) — içinde "Başarı ekler" olanlar:

| Şablon | Bu yetkinin yanındaki öbür yetkilerden bazıları |
|---|---|
| "Müdür yardımcısı" | öğrenci hesapları, şifre, portal, devamsızlık, toplu mesaj, toplantı, takvim, işlem kaydı |
| "Rehber öğretmen" | derse atanabilir, portalına bakar, devamsızlığı görür, toplu mesaj, toplantı, etüt |
| "Sınıf öğretmeni" | derse atanabilir, devamsızlığı görür, toplu mesaj, toplantı, portalına bakar |

Öbür şablonlarda ("Öğretmen", "Etüt sorumlusu", "Nöbetçi öğretmen", "Servis sorumlusu", "Zümre başkanı", "Kodlayıcı /
Tasarımcı", "BT sorumlusu", "Okul sekreteri") bu yetki yok; okulun hazır "Öğretmen" rolünde de yok. Müdür istediği role elle
ekler. Şablon yalnız başlangıçtır.

### Çalışan ve yetkili öğretmen

Rolü alınca menünde "Başarılar" sayfası açılır, [Başarı ekle](basari-ekleme.md) ile belge eklersin. Rol kaldırılınca yetki
gider; eklediğin belgeler öğrencinin hesabında kalır (belge kişiye, düzeltme hakkı okula bağlı). Tasarımda okula "çalışan"
olarak eklenen kişiye görevi müdür verir ([Çalışana görev verme](../ogretmenler-calisanlar/rol-atama.md)); rolsüz çalışan
başarı ekleyemez.

## Kurallar ve sınırlar

- **Müdür her zaman ekler;** yetki müdürden başkaları içindir.
- **Kendinden fazla yetki verilemez:** rolleri yöneten kişi, kendisinde olmayan yetkiyi başkasına veremez (rol penceresindeki
  not: "Kendinden fazla yetki veremezsin. Müdür atama, ortak karar ve okulu kapatma role verilemez.").
- **Kapsam:** tanıma göre rolün sınıf kapsamı "Kendi sınıfları" (ya da seçili sınıflar) ise yetki o sınıfların
  öğrencileriyle sınırlıdır; özel roller tanımı "Sınıf öğretmeni"nde bunu "kendi sınıfı kapsamında" diye yazar. Tasarım 1
  kapsam özetini bu yetkinin yanında göstermiyor; kodlanmadan önce netleşmeli
  ([Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md)).
- **Silme:** tanıma göre belgeyi ekleyen okul (müdür ya da yetkili) siler; ayrı bir "başarı siler" yetkisi yok.
- **Görmek için yetki gerekmez:** öğrencinin öğretmenleri belgeleri bu yetki olmadan da görür ([Kimler görür](kimler-gorur.md)).
- **Öneri durumu:** yeni yetkiler ve şablon genişlemeleri (özel roller işi) kullanıcıya önerildi, onay bekliyor; Tasarım 1
  önizlemesi onları içeriyor.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Başarılar](README.md)):

- [Başarı ekle](basari-ekleme.md) — yetkinin açtığı iş.
- [Başarılar sayfası](basarilar-sayfasi.md) — yetkilinin gireceği sayfa.
- [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md), [Kimler görür](kimler-gorur.md),
  [Başarılarım ve Başarıları](basarilarim.md), [Başarı penceresi](basari-penceresi.md).

**İlgili:**

- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md),
  [Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md).
- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md).

## Kod tarafı

Bugün kodda yok. Yetki kataloğu ve şablonlar [sunucu/yetki.md](../../sunucu/yetki.md)'de (`YETKILER`, rol şablonları); ön
yüzde rol ekranı [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — bu belge "Özel roller" işinin
getireceği yeni yetkiler arasında Başarılarım'ı anıyor; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md)
`basari.ekle` adını da yazıyor. Yeni yetki eklenince [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md)'deki yetki
denetimi de genişler.

## Sık sorulanlar

- **Sınıf öğretmenine verdim, başka sınıfa ekleyemiyor.** Rolün "Sınıflar" kapsamı "Kendi sınıfları"; "Bütün sınıflar"
  yaparsan her sınıfa ekler.
- **Yetkiyi geri aldım, eklediği belgeler ne oldu?** Öğrencinin hesabında duruyor; okulun belgesi sayılır, müdür düzeltir
  ya da siler.

## Sırada

- Özel roller işi: `basari.ekle` yetkisi ve şablon genişlemeleri (onay bekliyor).
- Başarılarım işi: yetkinin sunucu denetimi ve "Başarılar" sayfasının yetkiliye açılması.
- Çok dil: "Başarı ekler" ve şablon adları çeviri kataloğuna girecek.
