# Öğretmenler ve çalışanlar · Çalışana görev (rol) verme

**Durum:** Kodda var; tasarımda ek olarak görevin (Öğretmen dahil) çalışanın kendi penceresinden "+ Rol ata" ile verilmesi, bir
kişiye birden çok rol, rol "×" ile alınınca kişinin rolsüz çalışana dönmesi, öğretmen olmayana da özel rol ve "Sana Öğretmen
görevi verildi." bildirimi.

Okuldaki bir kişiye görev vermek: bugün bir öğretmene ek rol (Müdür Yardımcısı, Etüt Sorumlusu…); tasarımda rolsüz çalışana
Öğretmen görevi ya da özel bir rol.

## Ne işe yarar

Okulda herkesin yaptığı iş farklıdır: biri derse girer, biri etütleri planlar, biri okul sayfasını düzenler. Kimin neyi
yapabileceğini **roller** belirler; rolün yetkilerini müdür "Roller ve Yetkiler" sayfasında seçer
([Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md)). Bu belge rolün **kişiye verilmesini** anlatır.

**Bugün:** okula eklenen herkes öğretmendir ve okulun hazır **Öğretmen** rolünün yetkilerini taşır. Ek görev verilecek öğretmene
müdür ayrıca **bir** ek rol verir; o öğretmenin yetkileri iki rolün birleşimidir.

**Tasarımda** (kullanıcı 27 Eylül: "müdür kodu girer; ona rol — öğretmen, custom, coder — atamadığı sürece rolsüz gözükür"):
kişi okula rolsüz **çalışan** olarak girer; müdür ona görev verir:

- **Öğretmen** (okulun hazır Öğretmen rolü): derse atanabilir, ödev ve sınav verir, yoklama alır — bugünkü öğretmen. Branş seçimi
  burada yapılır.
- **Özel roller** (Müdür yardımcısı, Rehber öğretmen, Kodlayıcı / Tasarımcı…): öğretmen olmadan da verilebilir (ör. yalnız
  Kodlayıcı). Yetkiler bugünkü birleşim kuralıyla toplanır.
- Rol kaldırılınca kişi yeniden **rolsüz çalışan** olur; okuldan çıkmaz ("Okuldan çıkar" ayrı iştir: [Okuldan çıkarma](okuldan-cikarma.md)).

## Nereden açılır

- Bugün: sol menüde "Okul Düzeni" → **"Roller ve Yetkiler"** → sayfanın altındaki **"Öğretmenlerin ek rolleri"** kartı. Menü satırı
  müdüre ve "Rol oluşturur ve düzenler" yetkisi olana görünür. Sayfa açılırken öğretmen listesini de çektiği için ek görevli
  öğretmende ayrıca **"Öğretmen bilgisi ve branşını düzenler"** gerekir; o yoksa sayfada yalnız "Bu işlem için yetkin yok" yazar
  (kod okumasına göre; denenmedi).

Tasarımda:

- **"Çalışanlar"** → kişinin satırına bas → kişi penceresindeki **"Roller"** alanı ve **"+ Rol ata"** seçicisi
  ([Hesap penceresi](hesap-penceresi.md)).
- **"Roller ve yetkiler"** → bir rolün penceresinde **"Kişiler"** alanı: özel rollerde kişi çipleri (×) ve **"+ Kişi ekle"**
  seçicisi; hazır **Öğretmen** rolünde yalnız sayı ve not: "Bu rolü kişiye Çalışanlar sayfasında, kişinin "+ Rol ata" listesinden
  verirsin." ([Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md)).

## Adım adım

### Müdür

Bugün (kodda):

1. **"Roller ve Yetkiler"** sayfasını aç. Başlığın altı: "Her öğretmen "Öğretmen" rolünün yetkilerine sahiptir. Ek görev verdiğin
   öğretmene ayrıca bir rol ver."
2. Önce rolü oluştur (yoksa): **"Ek roller"** kartında **"Rol oluştur"** (hazır şablonlardan başlayabilirsin:
   [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md)).
3. Sayfanın altındaki **"Öğretmenlerin ek rolleri"** kartında her öğretmen bir satır: adı, altında branşı, sağda bir seçici.
   Seçicide **"— yalnızca Öğretmen —"** ve okulun ek rolleri.
4. Öğretmenin seçicisinden rolü seç. Seçici kısa süre kilitlenir, rol kaydedilir ve sayfa yenilenir. Öğretmene bildirim gider:
   **"Sana "Etüt Sorumlusu" rolü verildi. Menünde yeni bölümler görebilirsin."**; işlem kaydına **"Kullanıcıya rol atandı"** —
   "Ayşe Kaya → Etüt Sorumlusu".
5. Rolü kaldırmak için seçiciyi **"— yalnızca Öğretmen —"** yap. Öğretmen yalnız hazır Öğretmen rolünün yetkileriyle kalır (bu
   kaldırma için bildirim ve işlem kaydı yazılmaz).
6. Okulda öğretmen yoksa kartta "Okulda öğretmen yok." yazar.

Ek rolü taşıyan öğretmenin menüsünde, rolün adını taşıyan bir başlığın altında yeni satırlar çıkar (ör. "Müdür Yardımcısı" başlığı
altında "Sınıflar", "Ders Programı", "Okul Öğrencileri", "Öğretmenler", "Devamsızlık", "İşlem Kaydı"; [Sol menü](../menu-ve-arama/sol-menu.md)).

Tasarımda:

1. **"Çalışanlar"**da kişinin satırına bas. Pencerede **"Roller"**: taşıdığı görevler çip olarak, yoksa **"Rolsüz"**.
2. **"+ Rol ata"** seçicisini aç: kişinin henüz taşımadığı roller ("Öğretmen", "Müdür yardımcısı", "Rehber öğretmen", "Etüt
   sorumlusu"…) ve okulda Kodlayıcı rolü yoksa **"Kodlayıcı / Tasarımcı (şablondan yeni rol)"** (seçilince şablondan yeni rol
   açılır: "Okul sayfası, görünüm ve eklentiler").
3. Bir rol seç. Hemen verilir: "Etüt sorumlusu rolü Ayşe Kaya kişisine verildi; kişiye bildirim gitti." Çip eklenir, satırın
   "Rolsüz" etiketi kalkar, ikinci satırda rol adı görünür; işlem kaydına "rol atadı — Ayşe Kaya · Etüt sorumlusu" yazılır.
   Öğretmen görevi verilince kişiye giden bildirim: **"Sana Öğretmen görevi verildi."**
4. Kişiye istediğin kadar rol verebilirsin; yetkileri rollerin birleşimidir. Pencerede "Kişi bu rollerin yetkileriyle çalışır."
5. Bir görevi almak için çipindeki **×**: onay kutusu "Etüt sorumlusu rolü Ayşe Kaya kişisinden alınsın mı?" — "Kişi okulda kalır;
   bu rolün yetkileri kalkar." — **"Vazgeç"** / **"Rolü al"**. Sonra: "Etüt sorumlusu rolü Ayşe Kaya kişisinden alındı." Son rolü
   alınan kişi **"Rolsüz"** olur.
6. Aynı işi rolün tarafından da yapabilirsin: "Roller ve yetkiler" → rol → **"Kişiler"** → **"+ Kişi ekle"** ya da çipteki ×.

### Çalışan

Bugün: rolünde **"Rol oluşturur ve düzenler"** olan öğretmen "Roller ve Yetkiler" sayfasını açar ve öbür öğretmenlere ek rol verir
(sayfanın açılması için rolünde "Öğretmen bilgisi ve branşını düzenler" de olmalı; yukarıda). Kendi rolünü değiştiremez
("Kendine rol veremezsin") ve kendi taşıdığı rolün yetkilerini düzenleyemez ("Kendi taşıdığın rolü değiştiremezsin; müdürden
iste."). Katalogdaki uyarı: "Bu yetkiyi verdiğin kişi başkalarına yetki dağıtabilir."

Tasarımda: çalışan tanımına göre müdür ya da **"Okula çalışan ekler"** yetkisi olan çalışan, çalışanın satırından rol atar. Rol
yönetiminde kimse kendinden fazla yetki veremez; **müdür atama, ortak karar ve okulu kapatma role verilemez** (Tasarım 1'in rol
penceresindeki not: "Kendinden fazla yetki veremezsin. Müdür atama, ortak karar ve okulu kapatma role verilemez.").

### Görevi alan kişi (öğretmen ya da çalışan)

1. Bildirim gelir (bugün "Sana "<rol>" rolü verildi. Menünde yeni bölümler görebilirsin."; tasarımda Öğretmen görevinde "Sana
   Öğretmen görevi verildi.").
2. Sunucu yeni yetkileri hemen uygular; menünde rolün açtığı bölümler sayfayı yenileyince (ya da yeniden girince) belirir.
3. Tasarımda rolsüzken boş olan oturumun adı görevine göre değişir: "Çalışan · Test Ortaokulu" → "Öğretmen · Test Ortaokulu" ya da
   özel rolün adı ([Rolsüz çalışan](rolsuz-calisan.md)).

## Kurallar ve sınırlar

- **Yetki (bugün):** "Rol oluşturur ve düzenler". Yetkisiz: "Bu işlem için yetkin yok" (403).
- **Bugün tek ek rol:** bir öğretmen hazır Öğretmen rolünün yanında en çok bir ek rol taşır. Hazır Öğretmen rolü ayrıca verilmez:
  "Öğretmen rolü her öğretmende zaten var; ayrıca verilmez."
- **İletiler:** başka okulun ya da olmayan kişi "Öğretmen bulunamadı"; okulda olmayan rol "Rol bulunamadı"; kendine "Kendine rol
  veremezsin" (403).
- **Rol silinince** onu taşıyan herkesin ek rolü boşalır; kişiler okulda kalır ([Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md)).
- **Bilinen açık (bugün):** sunucu rol yöneten kişinin verdiği yetkileri kendi yetkileriyle karşılaştırmaz; tanımdaki "kendinden
  fazla yetki veremezsin" kuralı güvenlik denetimi işinde koda girecek ([Özel roller](../roller-yetkiler/ozel-roller.md)).
- **Tasarımda:**
  - Öğretmen görevi olmayan çalışan ders programına, ödeve, sınava, yoklamaya **atanamaz**; "Öğretmenler" seçicilerinde görünmez.
  - Yalnız Kodlayıcı rolü olan çalışan yalnız okul sayfasını düzenler (tanımın testi).
  - Rol alınınca kişi rolsüz çalışan olur, okulda kalır; işlem kaydına yazılır (Tasarım 1: "rol aldı"). Rolü alınan kişiye
    bildirim gidip gitmeyeceği tanımda yazılı değil (açık nokta; bugün kaldırmada bildirim de işlem kaydı da yok).
  - Göç: bugünkü bütün öğretmenler Öğretmen rolünü taşıyarak devam eder.
  - Veri modeli (tanım): rol satırında "öğretmen" yerine yeni bir değer (ör. "çalışan") ya da "öğretmen değil" işareti — hangisi daha
    az kırılgansa.

## Kardeşler ve ilgili

**Kardeşler:** [Rolsüz çalışan](rolsuz-calisan.md) · [Hesap penceresi](hesap-penceresi.md) · [Kodla ekleme](kodla-ekleme.md) ·
[Müdür yapma](mudur-yapma.md) · [Öğretmenler ve çalışanlar listesi](liste.md) · [Okuldan çıkarma](okuldan-cikarma.md).

**İlgili:**

- [Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md),
  [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md),
  [Özel roller](../roller-yetkiler/ozel-roller.md), [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md).
- [Sol menü](../menu-ve-arama/sol-menu.md) — rol adıyla açılan menü bölümü.
- [Ders atama](../siniflar-dersler/ders-atama.md), [Program kurma](../ders-programi/program-kurma.md) — öğretmen olmayan atanamaz.
- [Bildirim metinleri](../bildirim/bildirim-metinleri.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — `SAYFALAR.roller` ("Öğretmenlerin ek
  rolleri" kartı, `.rol-sec`), `rolSecBagla` (`POST /api/school/role-assign { userId, roleId }` → sayfa yenilenir);
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — rol adıyla açılan "Ek Yetkiler" bölümü.
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `role-assign` (yalnız bu okulun öğretmeni, kendine yok, hazır
  rol verilmez, bildirim, işlem kaydı `rol.atandi`), `role-update`, `role-delete`; [sunucu/yetki.md](../../sunucu/yetki.md) —
  `kullaniciYetkileri` (Öğretmen rolü + ek rol birleşimi), `ROL_SABLONLARI`; [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md)
  — `hesapDogrula`'daki `rolId` kuralları; [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md).
- Testler: [testler/test-rol.md](../../testler/test-rol.md), [testler/test-kapsam.md](../../testler/test-kapsam.md),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Bir öğretmene iki ek rol verebilir miyim?** Bugün hayır, tek ek rol; gerekirse iki rolün yetkilerini tek rolde topla. Tasarımda
  bir kişiye birden çok rol verilir.
- **Rolü kaldırınca öğretmen okuldan çıkar mı?** Hayır. Bugün yalnız Öğretmen rolüyle kalır; tasarımda son rolü alınan kişi rolsüz
  çalışan olarak okulda kalır.
- **Rol verdim, öğretmenin menüsünde değişiklik yok.** Öğretmen sayfayı yenileyince (ya da yeniden girince) yeni bölümler gelir.

## Sırada

- Çalışan olarak ekleme (iş 2): Öğretmen dahil her görevin çalışan penceresinden verilmesi, birden çok rol, rol alınınca rolsüzlük,
  "Sana Öğretmen görevi verildi." bildirimi.
- Özel roller (iş 24): yeni yetkiler ve şablonlar ("Okula çalışan ekler" adı çalışan tanımında zaten kararlı; iş 2).
- Güvenlik denetimi (iş 3): rol yönetiminde kendinden fazla yetki verememe.
