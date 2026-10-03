# Roller ve yetkiler · Yetkiler nasıl birleşir

**Durum:** Kodda var; tasarımda ek olarak bir kişi birden çok rol taşır ve yetkileri hepsinin birleşimidir, okula çalışan olarak
eklenen kişi rol verilene kadar hiçbir yetkiye sahip olmaz ("rolsüz"), öğretmen olmayan çalışan yalnız özel rolünün yetkileriyle
çalışır ve hazır Öğretmen rolü de bir kapsamla ("Kendi dersleri · kendi sınıfları") sınırlanır.

Bir kişinin okulda neyi yapabileceğinin nasıl hesaplandığı: müdür, öğretmen, ek rol ve daraltmanın birlikte nasıl işlediği.

## Ne işe yarar

Rolleri kurarken "bu öğretmen sonunda neyi yapabilecek?" sorusunun cevabını bilmen gerekir. Kural kısadır: **müdür her şeyi**,
öğretmen **hazır Öğretmen rolü + ek rolü** kadarını yapar; ek rol bir yetkiyi daraltmışsa o yetki (hazır rolde de yoksa) yalnız
seçilen ders ve sınıflarda geçer. Karar her istekte sunucuda verilir; ekrandaki menü yalnız bunun bir yansımasıdır.

## Nereden açılır

Ayrı bir ekranı yoktur. Sonucu şuralarda görürsün:

- **"Roller ve Yetkiler"** sayfası: hazır rolün ve ek rollerin yetki etiketleri ([Roller ve yetkiler ekranı](roller-ekrani.md)).
- Öğretmenin **sol menüsü**: hazır rolden gelen satırlar ana kısımda, ek rolden gelenler rolün adını taşıyan başlığın altında
  ([Sol menü](../menu-ve-arama/sol-menu.md)).
- Yetkisiz bir işi denediğinde gelen ileti: **"Bu işlem için yetkin yok"** ya da **"Bu ders ya da sınıf için yetkin yok"**.

## Adım adım

### Müdür

**Kural (bugün, kodda), sırayla:**

1. Hesap **onaylı** değilse (ör. onay bekleyen öğretmen başvurusu) hiçbir yetki geçmez.
2. **Müdür** bütün yetkilere sahiptir; daraltma ona uygulanmaz. Bu değiştirilemez.
3. **Öğretmenin** yetkileri = okulun hazır Öğretmen rolündeki yetkiler (rol henüz kurulmadıysa ilk yedi yetki) **∪** taşıdığı ek
   rolün yetkileri. Ek rol başka bir okulunsa sayılmaz.
4. İstenen yetki bu birleşimde yoksa iş reddedilir: **"Bu işlem için yetkin yok"**.
5. Yetki **hazır rolde** açıksa ders ve sınıfa bakılmaz: hazır rol daraltılmaz, ek rolün daraltması onu kısmaz.
6. Yetki yalnız **ek rolden** geliyorsa ve ek rol onu daraltmışsa, işin dersi ve sınıfı daraltmanın içinde olmalı; değilse **"Bu ders
   ya da sınıf için yetkin yok"**.
7. Öğrenci, veli ve servisçinin okul yetkisi yoktur; okulun yönetim bölümüne müdür ve öğretmenden başkası giremez (**"Yetkin
   yok"**).

**Örnek:** Ayşe Kaya okulun öğretmeni (hazır rol: "Ödev verir", "Yoklama alır"…) ve ona "Müdür Yardımcısı" rolü verildi, rolde
"Ders programını düzenler — 7-A, 7-B". Sonuç: Ayşe kendi derslerine ödev verir ve yoklama alır (hazır rolden), 7-A ve 7-B'nin
programını düzenler (ek rolden, daraltmayla), 8-A'nın programını açamaz.

**Kilitli kutular ve birleşimin bir yan etkisi:** ek rol penceresinde hazır rolde açık olan yetkiler kilitli gelir ve ek role
yazılmaz. Bu yüzden sonradan bir yetkiyi hazır rolden kapatırsan, o yetkiyi ek rolünde ayrıca yazılı tutmayan herkesten kalkar —
ek rolü olanların çoğundan da ([Hazır Öğretmen rolü](hazir-ogretmen-rolu.md)).

**Değişiklik ne zaman geçer:** sunucu bir sonraki istekte yeni yetkilerle karar verir. Öğretmenin menüsü ise girişte alınan yetki
listesiyle çizildiği için sayfayı yenileyince ya da yeniden girince değişir. Kullanıcı kılavuzunun sözüyle: rol silinince ya da
yetki daraltılınca kişi o işlemi hemen yapamaz hâle gelir.

**Tasarımda:**

1. Kişiye **birden çok rol** verilebilir; kişinin yetkileri bütün rollerinin birleşimidir. Çalışanın penceresinde: "Kişi bu rollerin
   yetkileriyle çalışır." ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).
2. Okula kişi koduyla eklenen kişi **rolsüz çalışan**dır: "Rol atanana kadar okulda görünür ama hiçbir yetkisi yoktur."
   ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
3. **Öğretmen görevi** de bir roldür (hazır Öğretmen rolü); onu taşımayan çalışan ders programına, ödeve, sınava ve yoklamaya
   atanamaz. Yalnız "Kodlayıcı" rolü olan çalışan yalnız okul sayfasını düzenler.
4. Hazır Öğretmen rolü de **kapsamlıdır** ("Kendi dersleri · kendi sınıfları"); kapsam yetki başına değil rol başınadır
   ([Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md)).
5. Müdür yine her şeyi yapar; okulun birden çok müdürü olabilir, hepsi bütün yetkilere sahiptir
   ([Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md)).

### Öğretmen

Yetkilerin hazır Öğretmen rolünden gelir. Sana ek rol verilince bildirim gelir: **"Sana "Etüt Sorumlusu" rolü verildi. Menünde yeni
bölümler görebilirsin."** Sayfayı yenileyince menünün altında rolünün adını taşıyan bir başlık ve rolün açtığı satırlar çıkar. Ek
rolün alınınca ya da silinince bildirim gelmez; menün yenileyince eski hâline döner.

### Çalışan

Bugün "çalışan" ek rolü olan öğretmendir: yetkilerin hazır rol + ek rolündür. Tasarımda öğretmen görevi olmayan bir çalışan da özel
rol taşıyabilir; o zaman yalnız o rolün yetkileri geçer.

## Kurallar ve sınırlar

- **Bugün tek ek rol:** bir öğretmen hazır rolün yanında en çok bir ek rol taşır.
- **Hazır rol daraltılmaz;** birleşimde geniş olan geçer.
- **Daraltmasız ek-rol yoklaması:** "Yoklama alır" ek rolde ders/sınıf seçilmeden verilirse kişiye başkasının dersini açmaz
  ([Devamsızlık · Kim yoklama alır](../devamsizlik/yetki-ve-kapsam.md)).
- **Sınıfsız öğrenci:** öğrenciye dokunan ve sınıfla daraltılmış bir yetkide sınıfı olmayan öğrenci kapsam dışında sayılır.
- **Site yöneticisi** kodda bütün yetkilere sahip sayılır, ama bir okula ait olmadığı için okulun yönetim bölümüne giremez
  ([Site yönetimi](../yonetim/README.md)).
- **Tasarımda:** birden çok rolün kapsamları nasıl birleşir (ör. bir rol "Kendi sınıfları", öbürü "Bütün sınıflar") tanımda yazılı
  değil (açık nokta).

## Kardeşler ve ilgili

**Kardeşler:** [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) · [Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) ·
[Yetki listesi](yetki-listesi.md) · [Rol ekle / düzenle](rol-duzenleyici.md) · [Özel roller](ozel-roller.md) ·
["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md) · [Roller ve yetkiler ekranı](roller-ekrani.md).

**İlgili:**

- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md), [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md),
  [Müdür yapma](../ogretmenler-calisanlar/mudur-yapma.md).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) — `kullaniciYetkileri` (müdür ve yönetici hepsi; öğretmende hazır rol ∪ ek rol),
  `yetkiVarMi` (onaylı mı, müdür mü, birleşimde var mı, hazır rolde mi, daraltmaya uyuyor mu), `yetkiKapsami`, `kapsamUyar`,
  `ogrenciKapsamindaMi`; kullanıcıya hazır rolün yetkileri ve ek rol okunurken iliştirilir:
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md), [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md).
- Ön yüz: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — menünün `yetkim()` ile kişinin yetki listesine
  bakması, ek bölümün başlığı (rolün adı ya da "Ek Yetkiler").
- Testler: [testler/test-kapsam.md](../../testler/test-kapsam.md) (hazır roldeki yetkiyi ek rol daraltmaz),
  [testler/test-rol.md](../../testler/test-rol.md) (rolsüz ve rollü öğretmen, müdürün tam yetkisi),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Hazır rolde açık bir yetkiyi (ör. "Yoklama alır") ek rolde 7-A'ya daraltabilir miyim?** Hayır; ek rol penceresinde o kutu
  kilitlidir ("Öğretmen rolünde var"). Hazır rolde açık yetki her öğretmende geniş geçer; daraltma yalnız ek rolün **fazladan**
  verdiğini sınırlar ([Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md)).
- **Rolü verdim, öğretmenin menüsü değişmedi.** Sayfayı yenilemesi ya da yeniden girmesi yeter; sunucu yeni yetkiyi zaten
  uyguluyor.
- **Müdürün bir yetkisini kapatabilir miyim?** Hayır; müdür her zaman tam yetkilidir.

## Sırada

- Çalışan olarak ekleme (iş 2): rolsüz çalışan, kişiye birden çok rol, öğretmen görevinin rol olması.
- Özel roller (iş 24): rol başına kapsam ve hazır rolün kapsamı.
- Tam debug (iş 27): rol rol her yetkinin denenmesi (ör. müdür yardımcısının şifre değiştirmesi).
