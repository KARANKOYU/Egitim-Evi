# Roller ve yetkiler · Özel roller

**Durum:** Kodda var; tasarımda ek olarak özel rol öğretmen olmayan bir çalışana da verilebilir, kişiye birden çok rol verilir,
rolün açıklaması ve branşı olur, şablonlar genişler (Müdür yardımcısına "Şifresini değiştirir", "Başarı ekler", "Toplantı açar",
"Tahta hesapları"; Rehber öğretmene "Başarı ekler", "Toplantı açar"; Zümre başkanına "Not girer", "Sınav grubu açar", "Toplantı
açar"…) ve yeni roller gelir ("Kodlayıcı / Tasarımcı", "BT sorumlusu", "Okul sekreteri", "Sınıf öğretmeni").

Müdürün okulda açtığı ek görevler — Müdür Yardımcısı, Rehber Öğretmen, Etüt Sorumlusu, Nöbetçi Öğretmen, Servis Sorumlusu, Zümre
Başkanı, Kodlayıcı ve okulun kendi adını verdiği roller — ve bu rolü taşıyan kişinin ne görüp ne yaptığı.

## Ne işe yarar

"Özel rol", müdürün hazır Öğretmen rolünün üstüne bir kişiye verdiği ek görevdir. Adını okul koyar ("custom name"); yetkilerini
müdür seçer. Bu belge rolü **taşıyanın gözünden** anlatır: hangi rolle menüde ne açılır, hangi sayfada hangi düğme çıkar, bugün
nerede takılır. Rolün nasıl kurulduğu: [Rol ekle / düzenle](rol-duzenleyici.md); hazır şablonların yetki listesi:
[Hazır rol şablonları](hazir-sablonlar.md).

Kullanıcının sözleri: 29 Ağustos "custom role müdür ekle, adını kendi koyar, yetkilerini kendi seçer"; 26 Eylül etüde öğretmen
"eğer ona giriyorsa veya yetkiliyse custom role ile verilmiş" girebilsin; 29 Eylül "preset'ler zümre başkanı, öğretmen, müdür
yardımcısı, coder-designer" ve "etüt sorumlusu bu kişi herkese istediği dersten istediği hoca ile etüt yazabilir, boş yerler o an
yazarken görülür"; 2 Ekim "custom role çeşitli ve gruplu permler … bi role branş atanabilsin".

## Nereden açılır

- **Müdür:** rolü **"Roller ve Yetkiler"**de açar ve öğretmene verir ([Roller ve yetkiler ekranı](roller-ekrani.md)). Tasarımda
  rolü "Roller ve yetkiler"de rolün "Kişiler"inden ya da **"Çalışanlar"**da kişinin **"+ Rol ata"**sından verir
  ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).
- **Rolü taşıyan:** bildirim gelir; sol menünün altında **rolün adını taşıyan bir başlık** ve rolün açtığı satırlar çıkar (rolün
  açtığı satırlar yalnız mevcut sayfalardaki düğmelerse yeni başlık çıkmaz). Tasarımda rolsüz çalışanın oturumunun adı görevine
  göre değişir: "Çalışan · Test Ortaokulu" → özel rolün adı ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

## Adım adım

### Müdür

1. "Roller ve Yetkiler" → **"Rol oluştur"** → şablondan başla (ör. "Etüt Sorumlusu") → yetkileri gözden geçir → **"Kaydet"**.
2. "Öğretmenlerin ek rolleri" kartında öğretmenin seçicisinden rolü seç. Öğretmene bildirim gider; işlem kaydına "Kullanıcıya rol
   atandı — Ayşe Kaya → Etüt Sorumlusu" yazılır.
3. Görev bitince seçiciyi **"— yalnızca Öğretmen —"** yap ya da rolü sil ([Rol silme](rol-silme.md)).

Tasarımda: "Rol ekle" → şablon çipi → "Kişiler"de "+ Kişi ekle" → **"Rolü ekle"** ("… · 1 kişiye bildirim gitti"); ya da
"Çalışanlar" → kişi → **"+ Rol ata"**. Bir kişiye birden çok rol verebilirsin.

### Rolü taşıyan (öğretmen ya da çalışan)

Ortak olanlar:

1. Rol verilince bildirim: **"Sana "Etüt Sorumlusu" rolü verildi. Menünde yeni bölümler görebilirsin."**
2. Sayfayı yenile (ya da yeniden gir): menünün altında rolünün adıyla bir başlık ve satırlar. Hazır Öğretmen rolündeki işlerin
   ("Ödevler", "Sınavlar", "Yoklama", "Sınıflarım") yerinde durur.
3. Rolün alınınca ya da silinince bildirim gelmez; menün yenileyince eski hâline döner.

Aşağıda bilinen roller tek tek. "Bugün" kodun hazır şablonudur (müdür değiştirmediyse); "Tasarımda" Tasarım 1 önizlemesinin
şablonudur.

#### Müdür Yardımcısı

**Bugün** menünde rolün başlığı altında: **"Sınıflar"**, **"Ders Programı"**, **"Okul Öğrencileri"**, **"Öğretmenler"**,
**"Devamsızlık"**, **"İşlem Kaydı"**. Ayrıca:

- "Sınıflar"da sınıf açar, siler, sınıfa ders ekler ve çıkarır, derslere öğretmen atar; "Ders Programı"nda programı düzenler
  ([Program kurma](../ders-programi/program-kurma.md)).
- "Okul Öğrencileri"nde öğrenci hesabı açar, bilgilerini düzenler, öğrenciyi sınıfa yerleştirir ([Öğrenciler listesi](../hesaplar/ogrenci-listesi.md)).
- "Öğretmenler"de öğretmenin bilgisini ve branşını düzenler.
- "Devamsızlık"ta okulun bütün devamsızlığını görür.
- "Etütler"de **"Etüt aç"** görür, etütleri düzenler ve bütün etütlerde yoklama alır ([Etüt açma](../etut/etut-acma.md)).
- "Takvim"de **"Etkinlik ekle"** ([Etkinlik ekleme](../takvim/etkinlik-ekleme.md)).
- "Mesajlar"da sınıfa/gruba toplu mesaj, duyuru ve bütün okula mesaj; "Anketler"de anket açar.

Yapamadıkları (şablonda yok): öğrenci şifresi sıfırlamak, öğretmen eklemek ya da çıkarmak, rol yönetmek, eğitim yılı, Excel aktarım,
okul sayfası. Kullanıcının tam debug örneği "bir müdür yardımcısının şifre değiştirmesi"dir: bunun için müdür rolüne "Öğrenci şifresi
sıfırlar"ı eklemelidir.

**Tasarımda** (21 yetki, bütün okul): "Ders programını düzenler", "Sınıfları düzenler", "Sınıflara yerleştirir", "Hesap açar",
"Bilgilerini düzenler", **"Şifresini değiştirir"**, "Oturumuna bakar", **"Başarı ekler"**, "Öğretmeni düzenler", "Sonuçlarını görür",
"Devamsızlığı görür", "Etüt planlar", "Sınıfa ve gruba toplu mesaj", "Bütün okula mesaj", **"Anket açar"**, **"Toplantı açar"**,
"Takvim ve etkinlikler", **"Tahta hesapları"**, **"Okul simgesi"**, **"Excel aktarımı"**, "İşlem kaydını görür".

#### Rehber Öğretmen

**Bugün:** "Okulun tüm devamsızlığını görür", "Öğrenci portalına girer", "Sınıfa veya gruba toplu mesaj atar". Menünde:

- **"Okul Öğrencileri"** — dar liste: yalnız öğrencinin adı, sınıfı ve okul numarası (veli kodu, e-posta, doğum tarihi gitmez); her
  öğrencinin **portalını açar** ve öğrencinin gördüğü ekranı birebir görür ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).
- **"Devamsızlık"** — satır çıkar ama sayfa bugün açılmaz: sayfa ayrıca "Sınıf açar ve siler" ister ve **"Bu işlem için yetkin
  yok"** der (bilinen açık; [Devamsızlık · Kim yoklama alır](../devamsizlik/yetki-ve-kapsam.md)).
- "Mesajlar"da toplu mesaj ve duyuru; "Anketler"de anket açar.

**Tasarımda:** "Derse atanabilir", "Oturumuna bakar", "Devamsızlığı görür", "Sınıfa ve gruba toplu mesaj", **"Başarı ekler"**,
**"Toplantı açar"**, **"Etüt planlar"**; önizlemedeki örnekte branşı "Rehberlik". Dikkat: 3 Ekim kararıyla devamsızlık sınırı
uyarısı **"sınıfın rehber öğretmeni"ne** de gider; okullardaki olağan anlamıyla bu, sınıftan sorumlu öğretmendir ve okulun
"Rehber öğretmen" rolüyle aynı kişi olmayabilir. Sistemde kimin olduğu kararlaştırılmadı ([Devamsızlık sınırı uyarısı](../devamsizlik/devamsizlik-siniri-uyarisi.md)).

#### Etüt Sorumlusu

**Bugün:** "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler", "Bütün etütlerde yoklama alır". Menüye yeni
satır eklenmez ("Etütler" her öğretmende zaten var); "Etütler" sayfası değişir:

- Başlığın altı: "Etüt aç, öğretmenini ve öğrencilerini seç; yoklamaları buradan alınır." (rolsüz öğretmende "Sana verilen etütler.
  Yoklamayı etüt günü alırsın.").
- **"Yeni etüt"** satırı ("Gün, saat ve yer; sonra öğretmenini ve öğrencilerini seç.") ve **"Etüt aç"** düğmesi.
- Her etütte yoklama alır, geçmiş günler dahil ([Etüt yoklaması](../etut/etut-yoklamasi.md)).

**Tasarımda:** "Derse atanabilir", **"Etüt planlar"**, "Devamsızlığı görür". Kullanıcının 29 Eylül isteğine göre etüdü yazarken
seçtiği dersin, öğretmenin ve öğrencilerin **boş zamanları canlı görünür** ([Boş zaman ızgarası](../etut/bos-zaman-izgarasi.md)).
Ayrıntı: [Etüt yetkileri ve hazır roller](../etut/etut-yetkileri.md).

#### Nöbetçi Öğretmen

**Bugün:** "Bütün etütlerde yoklama alır", "Okulun tüm devamsızlığını görür". Gelmeyen öğretmenin etüdünde yoklamayı alır (geçmiş
günler dahil). Menüde **"Devamsızlık"** çıkar ama Rehber Öğretmen'deki gibi bugün açılmaz (bilinen açık).

**Tasarımda:** "Derse atanabilir", **"Yoklama alır"**, "Devamsızlığı görür"; kapsam **Bütün dersler · bütün sınıflar** — gelmeyen
öğretmenin dersine de yoklama alabilir.

#### Servis Sorumlusu

**Bugün:** "Servisleri ve servis öğrencilerini düzenler" ("Şoför telefonlarını ve öğrencilerin durağını görür."). Menüde
**"Servisler"**: servis ekler, öğrencileri servise atar, servisçi hesabı açar, servis saatlerini düzenler, bugünkü servis
yoklamasını salt okunur görür ([Servisler sayfası](../servis/servisler-sayfasi.md),
[Bugünkü yoklama](../servis/yonetimin-yoklama-gorunumu.md)). Çocuğu okulda olan bir servis sorumlusunun menüsündeki "Velisi
olduğum" bölümünde ayrıca "Servisi" satırı çıkmaz (servisleri zaten "Servisler"den görür).

**Tasarımda:** "Derse atanabilir", "Servisler", "Sınıfa ve gruba toplu mesaj". 3 Ekim kararıyla akşam servisine binmeyen öğrenci
için velinin bildiriminin yanında **okul idaresine (servis sorumlusu)** bilgi gider ([Servise binmedi uyarısı](../servis/servise-binmedi-uyarisi.md)).

#### Zümre Başkanı

**Bugün:** şablonda "Sınav oluşturur" ve "Sınıfa veya gruba toplu mesaj atar". "Sınav oluşturur" hazır Öğretmen rolünde ilk açık
olduğu için ek rolde kilitlidir ve role yazılmaz; rol pratikte yalnız toplu mesaj ekler (zümreye mesaj). Menüde yeni satır çıkmaz.

**Tasarımda:** "Derse atanabilir", **"Sonuçlarını görür"**, "Sınav açar", **"Sınav grubu açar"**, **"Not girer"**, **"Toplantı
açar"**; kapsam **Matematik · bütün sınıflar** (önizlemedeki örnek; zümrenin dersini sen seçersin): zümre sınavlarını açar, notlarını
girer, zümre toplantısı yapar ([Sınav grupları](../sinav/sinav-gruplari.md), [Sınavlar · Yetkiler ve kapsam](../sinav/yetki-ve-kapsam.md)).

#### Kodlayıcı

**Bugün:** "Okulun giriş sayfasını düzenler", "Okulun haritadaki yerini ayarlar". Menüde **"Okul Sayfası"** (kapak ve logo
fotoğrafı, tanıtım yazısı, renkler ve kısıtlı CSS; sayfa herkese açıktır) ve **"Okulun Konumu"** (servis haritasında ve velinin
haritasında okul işareti). Okulun giriş adresini yine müdür seçer ([Okul sayfası](../okul-sayfasi/README.md),
[Okul konumu](../okul-sayfasi/okul-konumu.md)). Kullanıcının 26 Eylül kararı: "serbest kod değil ama css ve görünüm büyüklük ve photo
ekleyebilir, script yok".

**Tasarımda — "Kodlayıcı / Tasarımcı"** (kullanıcının "coder-designer Türkçesi"): + **"Okul simgesi"**, **"Görünümü (CSS)
düzenler"**, **"Eklentileri görür"**, **"Eklenti yazar"**, **"Eklenti yayımlar"** ([Okul simgesi](../okul-sayfasi/okul-simgesi.md),
[Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md), [Kodlayıcı: deneme ve yayınlama](../eklentiler/kodlayici-deneme-ve-yayinlama.md)).
"Çalışanlar"daki "+ Rol ata" listesinde okulda bu rol yoksa **"Kodlayıcı / Tasarımcı (şablondan yeni rol)"** çıkar; açıklaması "Okul
sayfası, görünüm ve eklentiler". Çalışan tanımına göre yalnız Kodlayıcı rolü olan (öğretmen olmayan) çalışan yalnız okul sayfasını
düzenler.

#### Tasarımdaki yeni roller

- **BT sorumlusu:** "Tahta hesapları", "Şifresini değiştirir", "Excel aktarımı", "Okul cihazları", "Eklentileri görür", "Eklenti
  kurar, kaldırır" — okulun tahta hesaplarını açar ([Tahta hesabı açma](../tahta/tahta-hesabi-acma.md)), öğrenci şifresi sıfırlar,
  eklenti kurar.
- **Okul sekreteri:** "Hesap açar", "Bilgilerini düzenler", "Sınıflara yerleştirir", "Excel aktarımı", "Takvim ve etkinlikler",
  "Yemek listesi" — öğrenci kayıtları, takvim ve yemek listesi.
- **Sınıf öğretmeni** (ilkokul ve ortaokul): "Derse atanabilir", "Devamsızlığı görür", "Sınıfa ve gruba toplu mesaj", "Toplantı
  açar", "Başarı ekler", "Oturumuna bakar"; kapsam **Kendi dersleri · kendi sınıfları** — kendi sınıfının devamsızlığı, velileriyle
  toplantı, öğrencilerine başarı belgesi ([Başarı ekler yetkisi](../basarilar/basari-ekleme-yetkisi.md)). Devamsızlık sınırı
  uyarısının gittiği "sınıfın rehber öğretmeni" için önerilen adaylardan biri bu roldür (karar yok).

Bu üç rol özel roller önerisindendir (onay bekliyor).

#### Okulun kendi rolleri

Rolün adı serbesttir; okul kendi görevini açar: "Kütüphane sorumlusu" (rol penceresindeki örnek), "Otizm destek öğretmeni"
(önizlemede: açıklama "Kaynaştırma öğrencileriyle bireysel çalışma", branş "Özel eğitim · Otizm", kapsam "Kendi dersleri · kendi
sınıfları", yetkiler "Derse atanabilir", "Oturumuna bakar", "Devamsızlığı görür", "Sınıfa ve gruba toplu mesaj", "Toplantı açar").
Kullanıcının sözüyle: "custom name custom thing" ([Role branş](rol-bransi.md)).

### Çalışan

Tasarımda özel rol **öğretmen olmadan da** verilir: okula kişi koduyla eklenen kişi rolsüz çalışandır; müdür ona yalnız bir özel rol
(ör. "Kodlayıcı / Tasarımcı" ya da "Okul sekreteri") verirse kişi derse girmez, yalnız o rolün işini yapar. Rol alınınca kişi
yeniden rolsüz çalışan olur, okuldan çıkmaz ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)). Bugün özel rol yalnız
okulun onaylı öğretmenine verilir.

## Kurallar ve sınırlar

- **Bugün tek ek rol, yalnız öğretmene:** bir öğretmen hazır rolün yanında en çok bir ek rol taşır; rol yalnız okulun onaylı
  öğretmenine verilir ("Öğretmen bulunamadı"), kimse kendine rol veremez ("Kendine rol veremezsin").
- **Şablon bir başlangıçtır:** müdür yetkileri değiştirdiyse rol burada anlatılandan farklı çalışır; doğrusu rolün etiketleridir.
- **Kilitli yetkiler:** hazır Öğretmen rolünde açık bir yetki (ör. "Sınav oluşturur") ek role yazılmaz.
- **Birden çok yetki isteyen sayfalar** (bilinen açıklar): "Devamsızlık" sayfası "Sınıf açar ve siler"i ve öğrenci listesi yetkisini
  de ister (Rehber ve Nöbetçi'de "Sınıf açar ve siler" yok, Nöbetçi'de öğrenci listesi de yok; Müdür Yardımcısı'nda ikisi de var);
  "Roller ve Yetkiler" sayfası "Öğretmen bilgisi ve branşını düzenler" ve "Sınıf açar ve siler"i de ister.
- **Müdüre özel kalanlar** hiçbir özel role konamaz: müdür atama ve ortak karar, okulu kapatma, kendinden fazla yetki verme.
- **Müdür bir rol değildir:** okulun müdürü ayrı atanır (tasarımda Çalışanlar'da "Müdür yap"; [Müdür yapma](../ogretmenler-calisanlar/mudur-yapma.md)).
- **Bildirim:** rol verilince gider; rol alınınca, silinince ya da yetkileri değişince gitmez.
- **Okul dışı roller bu klasörde değil:** site yöneticisi, destek ekibi, eğitmen, çevirmen ve tahta hesabı okulun rolleri değildir
  ([Site yönetimi](../yonetim/README.md), [Destek ekibi](../destek/destek-ekibi.md), [Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md),
  [Çevirmen rolü](../dil/cevirmen-rolu.md), [Tahta hesabı](../tahta/README.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Hazır rol şablonları](hazir-sablonlar.md) · [Rol ekle / düzenle](rol-duzenleyici.md) ·
[Yetki listesi](yetki-listesi.md) · [Role branş](rol-bransi.md) · [Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) ·
[Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) · ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md) ·
[Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) · [Roller ve yetkiler ekranı](roller-ekrani.md) · [Rol silme](rol-silme.md).

**İlgili:**

- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md), [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md).
- [Sol menü](../menu-ve-arama/sol-menu.md) — rolün adıyla açılan menü bölümü.
- [Etüt yetkileri ve hazır roller](../etut/etut-yetkileri.md), [Sınavlar · Yetkiler ve kapsam](../sinav/yetki-ve-kapsam.md),
  [Devamsızlık · Kim yoklama alır](../devamsizlik/yetki-ve-kapsam.md), [İşlem kaydını görür](../islem-kaydi/gorme-yetkisi.md),
  [Yemek listesini düzenler](../yemek/duzenleme-yetkisi.md), [Başarı ekler](../basarilar/basari-ekleme-yetkisi.md).
- [Toplantı açma](../toplanti/toplanti-acma.md) — "Toplantı açar" yetkisinin işi.

## Kod tarafı

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) — `ROL_SABLONLARI` (şablonlar), `kullaniciYetkileri`;
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `role-assign` (bildirim "Sana "…" rolü verildi. Menünde yeni bölümler
  görebilirsin.", işlem kaydı `rol.atandi`), `students` (öğrenci portalı yetkisinde dar liste); [sunucu/iliskiler.md](../../sunucu/iliskiler.md)
  — öğrenci portalını açma; [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md), [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md),
  [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md), [sunucu/bolumler/okul-sayfasi.md](../../sunucu/bolumler/okul-sayfasi.md).
- Ön yüz: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — ek bölümün başlığı (`customRoleName` ya da "Ek
  Yetkiler") ve yetkiye bağlı satırlar; [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md).
- Testler: [testler/test-rol.md](../../testler/test-rol.md) (rol atama ve `customRoleName`, rollü öğretmenin yetkisi),
  [testler/test-etut.md](../../testler/test-etut.md) (Etüt Sorumlusu), [testler/test-okul-sayfasi.md](../../testler/test-okul-sayfasi.md)
  (Kodlayıcı), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Müdür yardımcısı ya da rehber öğretmen gibi görevler nasıl verilir?** "Roller ve Yetkiler"de rol oluşturup yetkilerini seçer,
  öğretmene verirsin; hazır şablonlar var (sitenin SSS'si). Tasarımda rol okulun herhangi bir çalışanına verilir.
- **Rehber öğretmenim "Devamsızlık"ı açamıyor.** Bugünkü bir açık: sayfa "Sınıf açar ve siler"i de istiyor. Düzelene kadar role bu
  yetkiyi de ekleyebilirsin (o zaman sınıf açıp silebilir; dikkat).
- **Bir öğretmen hem rehber hem nöbetçi olabilir mi?** Bugün tek ek rol: iki rolün yetkilerini tek bir rolde topla. Tasarımda kişiye
  iki rol verirsin.
- **Kodlayıcı öğretmen olmak zorunda mı?** Bugün evet (rol yalnız öğretmene verilir); tasarımda öğretmen olmayan çalışan da yalnız
  Kodlayıcı rolüyle çalışır.

## Sırada

- Özel roller (iş 24): yeni yetkiler, yeni ve genişleyen şablonlar (onay bekliyor).
- Çalışan olarak ekleme (iş 2): özel rolün öğretmen olmayan çalışana verilmesi, birden çok rol.
- Etüt planlama (iş 25): Etüt sorumlusunun canlı boş zaman ızgarası.
- Okul cihazı (iş 26): "Okul cihazları" yetkisi ve BT sorumlusu (öneri; kullanıcı "sonra bakarım").
- Tam debug (iş 27): rol rol her yetki (ör. müdür yardımcısının şifre değiştirmesi).
- Güvenlik denetimi (iş 3): birden çok yetki isteyen sayfalar, rol yönetiminde kendinden fazla yetki verememe.
