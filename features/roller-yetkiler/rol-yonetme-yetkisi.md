# Roller ve yetkiler · "Rol oluşturur ve düzenler" yetkisi

**Durum:** Kodda var; tasarımda ek olarak yetkinin adı "Rolleri yönetir" olur ve kurala "Kendinden fazla yetki veremezsin." girer
(bugün kodda yok, bilinen açık); müdür atama, ortak karar ve okulu kapatma hiçbir role verilemez; eklenti yetkilerini yalnız
müdür verir.

Müdürün rol yönetimini bir başkasına (ör. müdür yardımcısına) bıraktığı yetki ve onun sınırları.

## Ne işe yarar

Büyük bir okulda rolleri hep müdürün kurması zor olabilir; müdür bu işi güvendiği birine verebilir. **"Rol oluşturur ve
düzenler"** (kodda `rol.yonet`) yetkisi olan kişi rol açar, rolleri düzenler, siler ve öğretmenlere rol verir. Yetkinin açıklaması
uyarır: **"Bu yetkiyi verdiğin kişi başkalarına yetki dağıtabilir."** Bu yüzden hiçbir hazır şablonda yoktur; müdür elle açar.

## Nereden açılır

- **Vermek (müdür):** **"Roller ve Yetkiler"** → rolün **"Düzenle"**si → **"Yönetim"** grubunda **"Rol oluşturur ve düzenler"**
  ([Rol ekle / düzenle](rol-duzenleyici.md)).
- **Kullanmak (öğretmen):** yetki gelince menünün ek bölümünde (rolünün adını taşıyan başlığın altında) **"Roller ve Yetkiler"**.
- Tasarımda: rol penceresinde **"Yönetim"** grubunda **"Rolleri yönetir"** (`rol.yonet`).

## Adım adım

### Müdür

1. Rolün penceresinde "Yönetim" grubundaki **"Rol oluşturur ve düzenler"**i işaretle, **"Kaydet"**.
2. Rolü vereceğin öğretmene ver ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).
3. **Bugün sayfanın açılması için** aynı role **"Öğretmen bilgisi ve branşını düzenler"** ve **"Sınıf açar ve siler"**i de koy:
   sayfa öğretmen ve sınıf listesini de çeker; biri eksikse kişi sayfada yalnız **"Bu işlem için yetkin yok"** görür (kod okumasına
   göre; denenmedi).
4. Kişinin dağıtabileceği yetkiler bugün sınırsızdır (aşağıda "Bilinen açık"); bu yetkiyi yalnız çok güvendiğin kişiye ver.

Tasarımda: aynı yetki "Rolleri yönetir" adıyla durur; pencerenin notu sınırları söyler: **"Kendinden fazla yetki veremezsin.
Müdür atama, ortak karar ve okulu kapatma role verilemez."** Hazır şablonların hiçbirinde (Müdür yardımcısı dahil) yoktur.

### Çalışan

Yetkiyi taşıyan öğretmen (bugün) şunları yapar:

1. **"Roller ve Yetkiler"**i açar (yukarıdaki iki ek yetkiyle).
2. **Rol açar** ("Rol oluştur", şablon dahil) ve **başkalarının rollerini düzenler**.
3. **Rol siler** — sunucu, kişinin kendi taşıdığı rolü silmesini de engellemez.
4. **Öğretmenlere ek rol verir ve alır** ("Öğretmenlerin ek rolleri" kartı).

Yapamadıkları:

- **Kendine rol vermek:** **"Kendine rol veremezsin"** (403). Kendi satırındaki seçiciyi değiştirirse ileti tarayıcının uyarı
  kutusunda çıkar ve seçici yeni değerde kalır (sayfa yenilenince doğrusu görünür).
- **Kendi taşıdığı rolü ya da hazır Öğretmen rolünü değiştirmek:** "Düzenle" açılır ama **"Kaydet"** şu iletiyle döner: **"Kendi
  taşıdığın rolü değiştiremezsin; müdürden iste."** (403). Hazır rol ona da uygulandığı için onu yalnız müdür değiştirir.
Sunucu, öğretmenin hesap penceresinden ya da kişi koduyla öğretmen eklerken gelebilecek rolü de aynı kuralla denetler: yetkisi
olmayana **'Rol vermek için "rol yönetir" yetkisi gerekir'**, kendine **"Kendine rol veremezsin"**. (Bugünkü ekranda bu
pencerelerde rol alanı yok; rol yalnız "Roller ve Yetkiler"den verilir.)

Tasarımda: rol yöneten çalışan **kendisinde olmayan bir yetkiyi** hiçbir role koyamaz; müdür atama, ortak karar ve okulu kapatma
hiçbir role konamaz; dört eklenti yetkisini ("Eklentileri görür", "Eklenti kurar, kaldırır", "Eklenti yazar", "Eklenti yayımlar")
yalnız müdür verir.

## Kurallar ve sınırlar

- **Bilinen açık (bugün, güvenlik bulgusu):** sunucu, yeni ya da düzenlenen roldeki yetkileri yalnız katalogla karşılaştırır,
  isteyenin kendi yetkileriyle değil. Rol yöneten bir öğretmen kendisinde olmayan yetkileri (ör. "Öğrenci şifresi sıfırlar" ya da
  "Rol oluşturur ve düzenler"in kendisi) içeren bir rol açıp başka bir öğretmene verebilir, başkasının rolünü genişletebilir; bu
  yetkiyi taşıyan iki öğretmen birbirinin rolünü büyütebilir. Özel roller tanımı "rol yönetiminde kendinden fazla yetki verme"yi
  **müdüre özel** sayar; kural güvenlik denetiminde koda girecek. Canlıya çıkmadan önce kapanması gereken bulgular arasındadır.
- **Müdüre özel kalanlar** (hiçbir role konamaz): müdür atama ve ortak karar, okulu kapatma, kendinden fazla yetki verme.
- **Eklenti yetkileri:** yalnız müdür verir; bu açık kapanmadan eklenti yetkileri eklenmez (eklenti tanımı §4).
- **İşlem kaydı:** rol yöneten kişinin her işi kendi adıyla yazılır ("Rol oluşturuldu", "Rol yetkileri değiştirildi", "Rol silindi",
  "Kullanıcıya rol atandı"); bir kişiden rolü geri almak kaydedilmez ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Yetki yalnız onaylı öğretmende geçer;** bekleyen başvuru kullanamaz.

## Kardeşler ve ilgili

**Kardeşler:** [Roller ve yetkiler ekranı](roller-ekrani.md) · [Rol ekle / düzenle](rol-duzenleyici.md) ·
[Rol silme](rol-silme.md) · [Yetki listesi](yetki-listesi.md) · [Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) ·
[Hazır rol şablonları](hazir-sablonlar.md) · [Özel roller](ozel-roller.md).

**İlgili:**

- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md) — bugün ve tasarımda rolü kişiye verme.
- [Müdür yapma](../ogretmenler-calisanlar/mudur-yapma.md), [Ortak karar](../ogretmenler-calisanlar/ortak-karar.md) — role verilemeyen
  müdür işleri.
- [Eklentiler](../eklentiler/README.md) — yalnız müdürün verdiği eklenti yetkileri.
- [İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `roles`, `role`, `role-update` (kendi rolü ve hazır rol için 403),
  `role-delete`, `role-assign` (kendine 403) uçlarının hepsi `rol.yonet` ister; [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md)
  — `hesap-guncelle` ve `ogretmen-ekle`'deki `rolId` denetimi; [sunucu/yetki.md](../../sunucu/yetki.md) — katalogdaki açıklama.
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) ("Dikkat!" bölümü: sayfanın iki ek yetki
  istemesi, kendi satırındaki seçicinin geri alınmaması); [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md).
- Testler: [testler/test-rol.md](../../testler/test-rol.md) ("Rol oluşturur ve düzenler" olmadan rol açılamaması),
  [testler/test-etut.md](../../testler/test-etut.md) (hesap penceresinden rol vermenin bu yetkiyi istemesi; "Kendine rol
  veremezsin" kolu ve "Kendi taşıdığın rolü değiştiremezsin" kuralı hiçbir pakette denenmiyor),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (rol uçlarına yalnız müdür).

## Sık sorulanlar

- **Müdür yardımcısı rolleri yönetebilir mi?** Hazır şablonda bu yetki yok; istersen elle eklersin. Bugün kendinden fazla yetki
  dağıtabildiği için dikkatli ol.
- **Rol yöneten öğretmen kendini müdür yapabilir mi?** Hayır; müdür atama hiçbir role verilemez, rol yöneten de müdür atayamaz.
- **Kendi rolüne bir yetki eklemek istiyor.** Yapamaz: "Kendi taşıdığın rolü değiştiremezsin; müdürden iste."

## Sırada

- Güvenlik denetimi (iş 3): "kendinden fazla yetki veremezsin" kuralının sunucuya girmesi; sayfanın ek yetki istemeden açılması;
  kendi satırındaki seçicinin hata sonrası geri alınması.
- Eklentiler (iş 35): eklenti yetkilerini yalnız müdürün vermesi.
- Özel roller (iş 24): yetkinin "Rolleri yönetir" adı.
