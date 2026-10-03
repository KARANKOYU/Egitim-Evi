# Roller ve yetkiler · Rol ekle / düzenle

**Durum:** Kodda var; tasarımda ek olarak pencerede "Açıklama", "Branş" ve rol başına "Kapsam" alanları, 10 grupta açılıp
kapanan ve aranabilen yetkiler ("Yetki ara", her grupta "s / n" sayacı ve "Hepsi" kutusu), "Kişiler" alanı ("+ Kişi ekle"),
"en az bir yetki" kuralı, "Kendinden fazla yetki veremezsin…" notu ve pencerenin içinde "Rolü sil".

Yeni bir rolün açıldığı ya da var olan bir rolün adının, yetkilerinin ve daraltmalarının değiştirildiği pencere.

## Ne işe yarar

Rol, bir göreve verilen **yetkilerin listesidir**: "Etüt Sorumlusu" etüt açar ve bütün etütlerde yoklama alır; "Kodlayıcı" okulun
sayfasını düzenler. Bu pencerede rolün adını koyar, yetkilerini tek tek seçer, gerekiyorsa bir yetkiyi belli ders ve sınıflara
daraltırsın. Kullanıcının 29 Ağustos isteği: müdür rolün "adını kendi koyar, yetkilerini kendi seçer"; 2 Ekim'de: yetkiler
"çeşitli ve gruplu" olsun, role branş da atanabilsin.

## Nereden açılır

- **Yeni rol:** **"Roller ve Yetkiler"** → "Ek roller" kartının altındaki **"Rol oluştur"**. Pencerenin başlığı **"Yeni rol"**.
- **Var olan rol:** rolün satırındaki **"Düzenle"**. Başlık **"Rolü düzenle"** (hazır Öğretmen rolünde **"Öğretmen rolü"**:
  [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md)).
- Tasarımda: sayfanın sağ üstündeki **"Rol ekle"** (başlık **"Rol ekle"**) ya da listede rolün satırına basmak (başlık
  "<rolün adı> · düzenle", ör. "Etüt sorumlusu · düzenle"; hazır rolde "Öğretmen · hazır rol").

## Adım adım

### Müdür

**Pencerenin düzeni (bugün, kodda)**, yukarıdan aşağı:

1. **"Şablondan başla (isteğe bağlı)"** — yalnız yeni rolde: "— boş başla —" ve şablonlar; altında "Şablon yalnızca yetkileri
   işaretler; sonra istediğin gibi değiştirirsin." ([Hazır rol şablonları](hazir-sablonlar.md)).
2. **"Rol adı"** — en çok 40 karakter, içinde soluk örnek "ör. Etüt Sorumlusu". Var olan rolde dolu gelir.
3. **Yetkiler**, grup grup ve bu sırayla: "Ders ve program", "Sınıf ve öğrenci", "Öğretmenler", "Ödev ve sınav", "Devamsızlık",
   "Etüt", "Mesajlaşma", "Okul hayatı", "Yönetim". Her yetki bir satır: kutu, **kalın adı**, varsa altında soluk açıklaması (ör.
   "Öğrenci şifresi sıfırlar" → "Hassas yetki — dikkatli ver."). Bütün liste: [Yetki listesi](yetki-listesi.md).
4. **Kilitli yetkiler:** hazır Öğretmen rolünde açık olan yetkiler işaretli ve soluk (değiştirilemez) gelir, adın yanında gri
   **"Öğretmen rolünde var"** etiketi olur. Onlar her öğretmende zaten vardır; ek role yazılmaz.
5. **Daraltma kutuları:** ders ya da sınıfa daraltılabilen bir yetkiyi (kilitli değilse) işaretleyince altında **"Dersler"** ve/veya
   **"Sınıflar"** kutusu açılır, başlığında işaretli **"Tümü"**. "Tümü"yü kaldırınca tek tek dersler ya da okulun sınıfları görünür
   ([Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md)). Yetkinin kutusunu kaldırınca daraltma kutuları gizlenir.
6. Pencerenin altında ileti alanı, sonra **"Vazgeç"** ve **"Kaydet"**.

**Yeni rol açmak:**

1. "Rol oluştur"a bas.
2. İstersen **şablon** seç; kutular ve (boşsa) ad dolar.
3. **"Rol adı"**nı yaz (ör. "Kütüphane Sorumlusu").
4. Rolün yapacağı işlerin kutularını işaretle; gerekiyorsa daraltmayı seç (ör. "Ders programını düzenler" → "Sınıflar"da "Tümü"yü
   kaldır → "7-A", "7-B").
5. **"Kaydet"** (düğme "Kaydediliyor..." olur). Pencere kapanır, rol "Ek roller" kartında "N yetki · kimseye verilmemiş" diye
   çıkar. İşlem kaydına "Rol oluşturuldu" ve rolün adı yazılır.
6. Rolü bir öğretmene ver: sayfanın altındaki "Öğretmenlerin ek rolleri" kartında öğretmenin seçicisi
   ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).

**Var olan rolü düzenlemek:**

1. Rolün satırındaki **"Düzenle"**: ad ve yetkiler dolu gelir; şablon seçici yoktur.
2. Adı ya da yetkileri değiştir, daraltmaları düzelt.
3. **"Kaydet"**. İşlem kaydına "Rol yetkileri değiştirildi" ve rolün adı yazılır. Rolü taşıyanlar yeni yetkilerle çalışır (sunucu
   hemen uygular; menüleri sayfayı yenileyince değişir). Onlara bildirim **gitmez**.

**Tasarımda** pencere ("Rol ekle"), yukarıdan aşağı:

1. **"Şablondan başla"** — yalnız yeni rolde; şablon çipleri ve "Boş başla" ([Hazır rol şablonları](hazir-sablonlar.md)).
2. **"Rol adı"** — içinde soluk örnek "ör. Kütüphane sorumlusu".
3. **"Açıklama"** — "Bu rol ne iş yapar? (isteğe bağlı)" (ör. "Etütleri planlar").
4. **"Branş"** — seçici: "Branşsız", okulun ders ve branşları, en sonda "Yeni branş adı yaz…"; altında not "Branş listesi
   "Dersler ve branşlar"dan gelir." ([Role branş](rol-bransi.md)).
5. **"Kapsam"** — iki satır: **"Ders"** ("Bütün dersler", "Kendi dersleri", tek tek dersler) ve **"Sınıflar"** ("Bütün sınıflar",
   "Kendi sınıfları", tek tek sınıflar); altında özet, ör. "Kapsam: Bütün dersler · bütün sınıflar · "Derse atanabilir" gibi
   yetkiler yalnız bu ders ve sınıflarda geçer." Kapsam bugünkü gibi yetki başına değil, **rol başınadır**
   ([Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md)).
6. **"Yetkiler"** başlığı, yanında "N seçili" ve **"Yetki ara"** kutusu. Altında 10 grup: "Ders ve program", "Öğrenciler",
   "Öğretmenler ve çalışanlar", "Ödev, sınav ve not", "Devamsızlık ve etüt", "İletişim", "Okul hayatı", "Okul", "Yönetim",
   "Eklentiler". Her grubun başlığı bir düğmedir: ok simgesi, grup adı ve "seçili / toplam" (ör. "2 / 6"); sağda **"Hepsi"**
   kutusu. İçinde seçili yetki olan gruplar açık, öbürleri kapalı gelir; başlığa basınca açılır, kapanır.
7. Her yetki: kutu, adı ve altında küçük harflerle kodu (ör. "Ödev verir" altında `odev.ver`). Kapsama uyan bir yetki
   işaretliyse adının yanında kapsam özeti yazar (ör. "Kendi dersleri · kendi sınıfları").
8. **"Hepsi"**yi işaretlemek o gruptaki bütün yetkileri seçer (grup açılır); kaldırmak hepsini kaldırır. Gruptaki bütün yetkiler
   seçiliyse "Hepsi" kendiliğinden işaretli görünür.
9. **"Yetki ara"**ya yazdıkça yalnız adı ya da grubunun adı aranan sözü içeren yetkiler kalır ve eşleşen gruplar açılır (ör.
   "şifre" → "Öğrenciler" grubunda "Şifresini değiştirir").
10. **"Kişiler"** — rolü taşıyanlar çip olarak (her çipte **×**) ve **"+ Kişi ekle"** seçicisi (okulun çalışanları, alfabe sırasıyla;
    rolde olanlar listede çıkmaz). Hazır rolde bu alan yalnız sayıdır ([Hazır Öğretmen rolü](hazir-ogretmen-rolu.md)).
11. Soluk not: **"Kendinden fazla yetki veremezsin. Müdür atama, ortak karar ve okulu kapatma role verilemez."**
12. Altta: var olan (hazır olmayan) rolde solda **"Rolü sil"** ([Rol silme](rol-silme.md)); sağda **"Vazgeç"** ve yeni rolde
    **"Rolü ekle"**, var olanda **"Kaydet"**.

Kaydedince (tasarımda) pencere kapanır, liste yenilenir ve altta kısa bir ileti çıkar: "Kütüphane sorumlusu rolü eklendi · 4 yetki
· 2 kişiye bildirim gitti" (var olan rolde "… rolü kaydedildi · …"; kişi yoksa son parça yazmaz).

### Çalışan

Bugün: "Rol oluşturur ve düzenler" yetkili öğretmen aynı pencereyle rol açar ve **başkalarının** rollerini düzenler. Kendi taşıdığı
rolü ve hazır Öğretmen rolünü kaydedemez: **"Kendi taşıdığın rolü değiştiremezsin; müdürden iste."** Ayrıntı:
["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md).

Tasarımda: aynı pencere; kendisinde olmayan yetkiyi veremez ve eklenti yetkilerini veremez (yalnız müdür).

## Kurallar ve sınırlar

- **Ad:** zorunlu; boşsa pencerede **"Rol adı yaz."** (imleç ad kutusuna gider), sunucuda **"Rol adı gerekli"**. En çok 40 karakter
  (fazlası kesilir). Okulda aynı ad ikinci kez olamaz, büyük/küçük harf (Türkçe kuralıyla) fark etmez: **"Bu adda bir rol zaten
  var"** ("etüt sorumlusu" ile "Etüt Sorumlusu" aynı sayılır).
- **Yetki sayısı:** bugün sınır yok; hiç yetkisiz rol de kaydedilir (listede gri "yetki yok"). Rol sayısında da sınır yok.
- **Bilinmeyen yetki** sessizce atılır; aynı yetki bir kez yazılır.
- **Daraltma** sunucuda temizlenir: yalnız rolde açık yetkiler, gerçek dersler ve okulun kendi sınıfları kalır; "Tümü / Tümü" hiç
  yazılmaz.
- **Kilitli yetkiler ek role yazılmaz.** Dikkat: eskiden ek rolde yazılı olan bir yetki sonradan hazır Öğretmen rolüne de eklenmişse,
  ek rolü açıp **"Kaydet"**e basmak (kutu artık kilitli olduğu için) o yetkiyi ve daraltmasını ek rolden sessizce siler.
- **Olmayan ya da başka okulun rolü:** **"Rol bulunamadı"**.
- **Yetkisiz:** "Bu işlem için yetkin yok" (403).
- **Hatalar** pencerenin altında kırmızı yazılır; düğme eski hâline döner.
- **Bildirim:** rolün yetkileri değişince rolü taşıyanlara bildirim gitmez (yalnız rol verilince gider).
- **Tasarımda:** ad boşsa **"Rolün adını yaz."**; hiç yetki seçilmediyse **"Bu role en az bir yetki ver."**; aynı ad **"Bu adda bir
  rol zaten var."**; kendinden fazla yetki verilemez; müdür atama, ortak karar ve okulu kapatma hiçbir role konamaz.

## Kardeşler ve ilgili

**Kardeşler:** [Roller ve yetkiler ekranı](roller-ekrani.md) · [Hazır rol şablonları](hazir-sablonlar.md) ·
[Role branş](rol-bransi.md) · [Rol silme](rol-silme.md) · [Yetki listesi](yetki-listesi.md) ·
[Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) · [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) ·
[Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) · ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md) ·
[Özel roller](ozel-roller.md).

**İlgili:**

- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md) — rolün kişiye verilmesi.
- [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md) — tasarımdaki "Dersler ve branşlar".
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Rol oluşturuldu", "Rol yetkileri değiştirildi".
- [Eklentiler](../eklentiler/README.md) — "Eklentiler" grubundaki yetkiler.

## Kod tarafı

- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — `rolModal` (üç hâl: hazır rol, yeni rol,
  var olan rol), `kapsamSecici`, `rolKapsamBagla`, `rolKapsamiTopla`, `rol-kaydet` eylemi.
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `POST /api/school/role` (ad, aynı ad reddi, yetkileri katalogla
  süzme, işlem kaydı `rol.olusturuldu`), `POST /api/school/role-update` (kendi rolünü değiştirememe, hazır rolde ad ve kapsamın yok
  sayılması, `rol.degistirildi`); [sunucu/yetki.md](../../sunucu/yetki.md) — `YETKILER`, `kapsamTemizle`, `rolOzeti`;
  [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md) — `ekle`, `guncelle`, `yetkileriYaz`.
- Testler: [testler/test-rol.md](../../testler/test-rol.md) (rol oluşturma, aynı adın reddi, uydurma yetkinin ayıklanması,
  güncelleme), [testler/test-kapsam.md](../../testler/test-kapsam.md).

## Sık sorulanlar

- **"Ödev verir"i ek role koyamıyorum, kutu soluk.** Yetki hazır Öğretmen rolünde açık; her öğretmende zaten var ("Öğretmen
  rolünde var"). Daraltmak istiyorsan önce hazır rolden kapatman gerekir.
- **Rolün adını değiştirirsem taşıyanlar etkilenir mi?** Yetkileri değişmez; menülerindeki bölüm başlığı yeni adı alır (sayfayı
  yenileyince).
- **"Bu adda bir rol zaten var" diyor ama listede göremiyorum.** Büyük/küçük harf farkıyla aynı ad var; listede ara.

## Sırada

- Özel roller (iş 24): gruplu ve aranabilir yetki listesi, "Hepsi", açıklama, rol başına kapsam, "Kişiler" alanı, "en az bir yetki"
  kuralı, yeni yetkiler.
- Özel branş / ders (iş 36): "Branş" alanı.
- Güvenlik denetimi (iş 3): "Kendinden fazla yetki veremezsin." kuralının sunucuya girmesi.
- Çalışan olarak ekleme (iş 2): rolün öğretmen olmayan çalışana da verilmesi.
