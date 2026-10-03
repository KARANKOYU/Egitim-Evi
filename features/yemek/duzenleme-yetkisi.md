# Yemek listesi · "Yemek listesini düzenler" yetkisi

**Durum:** Kodda var; tasarımda ek olarak öğretmen olmayan bir çalışana da özel rolle verilebilir ve "Okul sekreteri" hazır rolünde gelir (öneri).

Müdürün menü girme işini bir öğretmene (ya da bütün öğretmenlere) bıraktığı yetki; Roller ve Yetkiler sayfasında "Okul hayatı"
grubunda durur.

## Ne işe yarar

Menüyü her hafta müdürün kendisinin girmesi gerekmez: müdür bu yetkiyi müdür yardımcısına, okul sekreterine ya da yemekhaneden
sorumlu bir öğretmene verir; o kişinin [Yemek listesi](yemek-listesi.md) sayfasında **"Bu haftayı düzenle"** düğmesi çıkar ve
[menüyü düzenler](menuyu-duzenleme.md). Müdür bu yetkiye her zaman sahiptir.

## Nereden açılır

- **Müdür:** sol menü → "Okul Düzeni" → **"Roller ve Yetkiler"**.
- **"Rol oluşturur ve düzenler" yetkili öğretmen:** sol menüde ek rolünün başlığı (ya da "Ek Yetkiler") altında **"Roller ve
  Yetkiler"**.
- Yetki, rol penceresindeki yetki listesinde **"Okul hayatı"** grubunda: **"Yemek listesini düzenler"**.

Tasarımda (Tasarım 1 önizlemesi): müdür menüsünde "Okul düzeni" → "Roller ve yetkiler"; rol penceresinde yetki "Okul hayatı"
grubunda **"Yemek listesi"** adıyla, altında küçük yazıyla `yemek.yonet`.

## Adım adım

### Müdür

**Bir kişiye vermek (ek rolle):**

1. "Roller ve Yetkiler" sayfasında "Ek roller" kartının altındaki **"Rol oluştur"**a bas.
2. **"Yeni rol"** penceresi açılır:
   - **"Şablondan başla (isteğe bağlı)"**: "— boş başla —" ya da hazır şablonlardan biri (Müdür Yardımcısı, Rehber Öğretmen,
     Etüt Sorumlusu, Nöbetçi Öğretmen, Servis Sorumlusu, Zümre Başkanı, Kodlayıcı…). Bugünkü şablonların hiçbiri bu yetkiyi
     içermez; şablonu seçtikten sonra kutuyu sen işaretlersin. Altındaki not: "Şablon yalnızca yetkileri işaretler; sonra istediğin
     gibi değiştirirsin."
   - **"Rol adı"**: en çok 40 karakter (yer tutucu "ör. Etüt Sorumlusu"); ör. "Yemekhane Sorumlusu".
   - Yetki listesinde **"Okul hayatı"** grubunda **"Yemek listesini düzenler"** kutusunu işaretle. Bu yetkinin ders/sınıf
     daraltması yok (menü bütün okulun).
3. **"Kaydet"**.
4. Aynı sayfadaki **"Öğretmenlerin ek rolleri"** kartında kişinin satırındaki seçim kutusundan yeni rolü seç ("— yalnızca
   Öğretmen —" yerine). Seçer seçmez kaydedilir, sayfa yenilenir. Kişiye bildirim gider: 'Sana "Yemekhane Sorumlusu" rolü
   verildi. Menünde yeni bölümler görebilirsin.'

**Var olan bir role eklemek:** rolün satırındaki **"Düzenle"** → **"Rolü düzenle"** penceresi → "Yemek listesini düzenler"i
işaretle → **"Kaydet"**. O rolü taşıyan herkes düzenleyebilir olur.

**Bütün öğretmenlere vermek:** "Öğretmen (hazır rol)" kartındaki **"Düzenle"** → **"Öğretmen rolü"** penceresi (not: "Buradaki
yetkiler okuldaki her öğretmende açıktır. Kapattığın yetki, ek rolü olmayan öğretmenlerden kalkar.") → "Yemek listesini
düzenler"i işaretle → **"Kaydet"**. Bundan sonra ek rol pencerelerinde bu kutu işaretli ve kilitli görünür, yanında "Öğretmen
rolünde var" yazar.

**Geri almak:** rolden kutuyu kaldır ve "Kaydet"; ya da kişinin ek rolünü "— yalnızca Öğretmen —" yap.

### Öğretmen

- Yetki sana verilince menün değişmez (bu yetki menüye yeni bir satır eklemez); Yemek Listesi sayfasını yeniden açınca "Bu
  haftayı düzenle" çıkar.
- Sende "Rol oluşturur ve düzenler" yetkisi varsa sen de rol açıp bu yetkiyi başka öğretmenlere verebilirsin. Kendine rol
  veremezsin ("Kendine rol veremezsin"); kendi taşıdığın rolü ve hazır Öğretmen rolünü değiştiremezsin ("Kendi taşıdığın rolü
  değiştiremezsin; müdürden iste."). Bilinen açık (kod okumasına göre): sayfa açılırken öğretmen listesi ve sınıf listesi de
  istendiği için "Öğretmen bilgisi ve branşını düzenler" ile "Sınıf açar ve siler" yetkilerin yoksa sayfada yalnız "Bu işlem için
  yetkin yok" yazar.

### Çalışan

Bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol taşır; yetki o ek rolde durur (yukarıdaki "Bir kişiye vermek").

Tasarımda (çalışan tanımı, kullanıcı 27 Eylül'de onayladı): kişi okula kişi koduyla "çalışan" olarak eklenir; müdür ona Öğretmen
rolü ya da bir özel rol verir. Öğretmen olmayan çalışan da yalnız özel rolüyle bu yetkiyi alabilir (ör. yalnız "Okul sekreteri").
Rolü kaldırılan çalışan yeniden rolsüz olur ve yemek listesini görmez.

### Tasarım 1 önizlemesindeki rol penceresi

Müdür "Roller ve yetkiler" sayfasında bir role ya da yeni role dokununca pencere açılır ("Rol ekle" ya da "<rol adı> · düzenle"):

- **"Şablondan başla"** çipleri: Müdür yardımcısı, Rehber öğretmen, Etüt sorumlusu, Nöbetçi öğretmen, Servis sorumlusu, Zümre
  başkanı, Kodlayıcı / Tasarımcı, BT sorumlusu, **Okul sekreteri**, Sınıf öğretmeni, "Boş başla".
- "Rol adı" (yer tutucu "ör. Kütüphane sorumlusu"), "Açıklama" ("Bu rol ne iş yapar? (isteğe bağlı)"), "Branş", "Kapsam" ("Bütün
  okul" / "Yalnız kendi sınıfları ve dersleri").
- **"Yetkiler"**: seçili sayısı, "Yetki ara" kutusu, açılır kapanır gruplar ve her grupta "Hepsi"; bu yetki "Okul hayatı"
  grubunda "Yemek listesi".
- "Kişiler": rolü taşıyanlar ve "+ Kişi ekle".
- Not: "Kendinden fazla yetki veremezsin. Müdür atama, ortak karar ve okulu kapatma role verilemez."
- Düğmeler: "Vazgeç" ve "Rolü ekle" (düzenlerken "Kaydet"; var olan rolde "Rolü sil").
- **"Okul sekreteri"** şablonunun yetkileri: öğrenci hesabı açar, öğrenci bilgilerini düzenler, sınıflara yerleştirir, Excel
  aktarımı, takvim ve etkinlikler, yemek listesi.

Yeni şablonlar kullanıcının 29 Eylül isteğine dayanır ("preset ler zümre başkanı öğretmen müdür yardımcı müdür coder-designer
türkçesi gibi biraz preset ekle"); şablonların listesi (içinde "Okul Sekreteri / Memur") öneri olarak sunuldu, onay bekliyor. Pencerenin ayrıntısı
[Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md) belgesinde.

## Kurallar ve sınırlar

- **Müdür** bu yetkiye her zaman sahiptir; değiştirilemez.
- **Yalnız öğretmen (ve müdür) taşır:** öğrenci, veli ve servisçi hesaplarına yetki verilemez; Roller ve Yetkiler sayfasındaki
  seçim yalnız onaylı öğretmenleri listeler.
- **Bir öğretmenin tek ek rolü olur;** yetkileri hazır Öğretmen rolü ile ek rolün birleşimidir.
- **Ders/sınıf daraltması yok:** yetki bütün okulun menüsünü düzenletir.
- **Hesap onaylı değilse** yetki sayılmaz.
- **Rol kuralları:** rol adı boşsa pencerede "Rol adı yaz." (şablon seçtiysen boş ad şablonun adıyla dolar; elle gönderilen
  istekte sunucu "Rol adı gerekli" der); aynı adda rol varsa "Bu adda bir rol zaten var"; hazır Öğretmen rolü ek rol
  olarak verilemez ("Öğretmen rolü her öğretmende zaten var; ayrıca verilmez."); hazır Öğretmen rolü silinemez.
- **İşlem kaydı:** rol açma, değiştirme, silme ve verme okulun işlem kaydına yazılır; menüyü kaydeden kişi de ayrıca yazılır
  ("Yemek listesi kaydedildi").
- **Bilinen açık (güvenlik bulgusu):** "Rol oluşturur ve düzenler" yetkili bir öğretmen, kendisinde olmayan yetkileri de (bu
  dahil) başkasına dağıtabiliyor. Güvenlik denetimi işinde düzeltilecek; tasarımdaki not ("Kendinden fazla yetki veremezsin")
  bunu kapatır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yemek listesi](README.md)):

- [Bu haftayı düzenle](menuyu-duzenleme.md) — yetkinin açtığı pencere.
- [Haftanın yemek listesi](yemek-listesi.md) — düğmenin çıktığı sayfa.
- [Hafta gezgini](hafta-gezgini.md), [Kalori](kalori.md), [Çocukların okullarının menüsü](cocuklarin-okullari.md).

**İlgili:**

- [Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md),
  [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md),
  [Özel roller](../roller-yetkiler/ozel-roller.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Yetki tanımı: [sunucu/yetki.md](../../sunucu/yetki.md) — `YETKILER` "Okul hayatı" grubu `{ k: 'yemek.yonet', ad: 'Yemek
  listesini düzenler' }`; `kullaniciYetkileri` (müdür hepsi, öğretmen hazır rol + ek rol, ötekiler boş); `ROL_SABLONLARI` (bugün
  hiçbirinde `yemek.yonet` yok).
- Rol uçları: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `POST /api/school/role`, `role-update`, `role-delete`,
  `role-assign` (iletiler, bildirim, işlem kaydı `rol.*`).
- Yetkinin kullanıldığı yer: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/yemek`
  `duzenleyebilir`, `POST /api/yemek` (403 "Yemek listesini düzenleme yetkin yok").
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — Roller ve Yetkiler sayfası, `rolModal`,
  `rolSablonuUygula`, `rolSecBagla`; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — öğretmen menüsü
  (`yemek.yonet` yeni satır eklemez).
- Testler: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) (bu yetkiyi içeren rol verilen öğretmen menüyü yazar),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Bir öğretmene menüyü nasıl girdiririm?** Roller ve Yetkiler → "Rol oluştur" → "Yemek listesini düzenler"i işaretle → Kaydet →
  "Öğretmenlerin ek rolleri"nde ona bu rolü seç.
- **Öğretmenin zaten bir ek rolü var (ör. Müdür Yardımcısı).** Bir öğretmenin tek ek rolü olur; o rolü "Düzenle" ile aç ve bu
  yetkiyi ekle.
- **Yetkiyi verdim ama düğme çıkmadı.** Öğretmen Yemek Listesi sayfasını yeniden açmalı; hesabı onaylı olmalı.
- **Veliye ya da öğrenciye bu yetkiyi verebilir miyim?** Hayır; yetkiler yalnız okulun öğretmenlerine verilir.

## Sırada

- Özel roller: yeni hazır şablon "Okul Sekreteri / Memur" bu yetkiyi taşıyacak (öneri, onay bekliyor).
- Çalışan olarak ekleme: yetki öğretmen olmayan çalışana da özel rolle verilecek.
- Güvenlik denetimi: rol yöneten öğretmenin kendinde olmayan yetkiyi dağıtamaması.
- Çok dil: yetki ve şablon adları çeviri kataloğuna girecek.
