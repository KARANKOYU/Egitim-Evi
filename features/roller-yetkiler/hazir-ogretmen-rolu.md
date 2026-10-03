# Roller ve yetkiler · Hazır Öğretmen rolü

**Durum:** Kodda var; tasarımda ek olarak rol öbür rollerle aynı listede durur, açıklaması ("Derse girer, ödev ve sınav verir,
yoklama alır") ve kapsamı ("Kendi dersleri · kendi sınıfları") olur, kapsamı değiştirilebilir, ilk yetkileri farklıdır (toplu
mesaj ve toplantı açma dahil), "Öğretmen" adıyla şablon olarak da seçilir ve okula çalışan olarak eklenen kişiye Çalışanlar
sayfasından "+ Rol ata" ile verilir.

Okuldaki her öğretmenin kendiliğinden sahip olduğu temel yetkileri tutan, silinmeyen rol.

## Ne işe yarar

Bir okulda öğretmenlerin çoğu aynı işleri yapar: derse girer, ödev verir, sınav açar, not girer, yoklama alır. Bu yetkileri her
öğretmene tek tek vermek yerine okulun **hazır bir Öğretmen rolü** vardır; okuldaki her öğretmen bu rolün yetkilerine kendiliğinden
sahiptir. Müdür bu rolün kutularını açıp kapatarak bütün öğretmenlerin temel yetkisini birden değiştirir (ör. "öğretmenler sınav
oluşturmasın, yalnız not girsin").

Kullanıcı 26 Eylül'de bunu böyle tarif etti: öğretmen de "aslında belli parametreler seçilmiş bi custom rol olarak işleyecek bir
preset". Ek görevler (müdür yardımcılığı, etüt sorumluluğu…) bu rolün **üstüne** ek rolle verilir; kişinin yetkisi ikisinin
birleşimidir ([Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md)).

## Nereden açılır

- **Müdür:** **"Okul Düzeni"** → **"Roller ve Yetkiler"** → ilk kart **"Öğretmen"** (yanında "hazır rol" etiketi) →
  **"Düzenle"**. Pencerenin başlığı **"Öğretmen rolü"**.
- Tasarımda: **"Roller ve yetkiler"** listesinin ilk satırı **"Öğretmen"** ("hazır rol" rozeti) → satıra bas. Pencerenin başlığı
  **"Öğretmen · hazır rol"**.

## Adım adım

### Müdür

**Kartta ne görürsün (bugün):** "Okuldaki N öğretmenin hepsinde. Silinmez; istemediğin yetkiyi kapatabilirsin." ve rolün açık
yetkileri etiket etiket.

**İlk yetkiler.** Okulun Öğretmen rolü ilk kurulduğunda (ilk kez "Roller ve Yetkiler" açılınca) şu yedi yetkiyle gelir:

| Yetki (ekrandaki adı) | Menüde açtığı |
|---|---|
| "Derse öğretmen olarak atanabilir" | — (sınıfın derslerine öğretmen seçilirken listede çıkar) |
| "Ödev verir" | "Ödevler" |
| "Ödev sonuçlandırır" | "Ödevler" |
| "Sınav oluşturur" | "Sınavlar" |
| "Sınav notu girer" | "Sınavlar" |
| "Yoklama alır" | "Yoklama" |
| "Girdiği sınıfların öğrenci sonuçlarını görür" | "Sınıflarım" |

Rol henüz kurulmamış bir okulda öğretmenler yine bu yedi yetkiyle çalışır.

**Yetkileri değiştirmek:**

1. "Öğretmen" kartındaki **"Düzenle"**ye bas. Pencerenin üstünde ipucu: "Buradaki yetkiler okuldaki her öğretmende açıktır.
   Kapattığın yetki, ek rolü olmayan öğretmenlerden kalkar."
2. Pencerede ad kutusu ve şablon seçici **yoktur** (adı hep "Öğretmen"dir); ders ve sınıf daraltması da yoktur. Altında bütün
   yetkiler grup grup kutu kutu durur ([Yetki listesi](yetki-listesi.md)).
3. İstemediğin yetkinin kutusunu kaldır (ör. "Sınav oluşturur"), eklemek istediğini işaretle (ör. "Yemek listesini düzenler":
   bütün öğretmenler menüyü düzenleyebilir).
4. **"Kaydet"** (düğme "Kaydediliyor..." olur). Pencere kapanır, kart yeni etiketlerle çizilir; işlem kaydına "Rol yetkileri
   değiştirildi" — "Öğretmen" yazılır. Vazgeçmek için **"Vazgeç"**.

**Kapatınca ne olur:**

- Bölüm öğretmenlerin menüsünden kalkar: "Ödevler" ("Ödev verir" ve "Ödev sonuçlandırır" ikisi de kapalıysa), "Sınavlar" ("Sınav
  oluşturur" ve "Sınav notu girer" ikisi de kapalıysa), "Yoklama", "Sınıflarım". Sunucu da o işi hemen reddeder.
- Öğretmen bir ek rol taşıyorsa ve o ek rolde bu yetki **ayrıca yazılıysa** yetki onda kalır. Ek rol penceresinde hazır rolde açık
  yetkiler kilitli olduğu için çoğu ek rolde yazılı değildir; yani yetki ek rolü olanların çoğundan da kalkar (ipucundaki "ek
  rolü olmayan öğretmenlerden" sözü bu yüzden eksik).
- Bütün kutuları kapatırsan öğretmenler ilk yedi yetkiye geri **dönmez**; gerçekten hiç yetkileri kalmaz.

**Eklenince ne olur:** eklenen yetki her öğretmende açılır. Menüde ek bölümle gelen bir yetkiyse (ör. "Excel ile içe ve dışa
aktarım yapar") öğretmenin menüsünde ayrı bir başlık altında çıkar; öğretmenin ek rolü yoksa başlık **"Ek Yetkiler"**dir.

**Ek rol penceresine etkisi:** bir ek rolü açtığında hazır rolde açık olan yetkiler işaretli ve kilitli gelir, yanlarında gri
**"Öğretmen rolünde var"** etiketi olur; onları ek role yazamaz, ders ve sınıfa daraltamazsın ([Rol ekle / düzenle](rol-duzenleyici.md),
[Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md)).

**Tasarımda:**

1. Listede ilk satır: **"Öğretmen"** + "hazır rol" rozeti; altında "28 kişi · 7 yetki · Kendi dersleri · kendi sınıfları"
   (önizlemedeki örnek okul).
2. Pencerede **"Rol adı"** yerine kalın "Öğretmen" ve not: **"Hazır rol: silinmez, adı değişmez; yetkilerini ve kapsamını
   değiştirebilirsin."** "Açıklama" ve "Branş" alanı yok.
3. **"Kapsam"** var ve ilk değeri "Kendi dersleri" · "Kendi sınıfları": öğretmenin yetkileri yalnız kendi ders ve sınıflarında
   geçer. Müdür kapsamı değiştirebilir ([Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md)).
4. **"Yetkiler"** öbür rollerdeki gibi 10 grupta, aranabilir. İlk yetkiler ("Öğretmen" şablonu): "Derse atanabilir", "Ödev verir",
   "Sınav açar", "Not girer", "Yoklama alır", "Sınıfa ve gruba toplu mesaj", "Toplantı açar". (Tasarım 1'in yetki listesinde "Ödev
   sonuçlandırır" diye ayrı bir satır yok; "Sonuçlarını görür" yetkisi "Öğretmenler ve çalışanlar" grubunda ayrı durur ve bu
   rolde ilk açık gelmez.)
5. **"Kişiler"** alanında yalnız sayı ("28 kişi") ve not: **"Bu rolü kişiye Çalışanlar sayfasında, kişinin "+ Rol ata" listesinden
   verirsin."**
6. Pencerenin altında "Rolü sil" yok; düğmeler **"Vazgeç"** ve **"Kaydet"**.
7. "Rol ekle" penceresinin **"Şablondan başla"** çiplerinin ilki de **"Öğretmen"**dir: aynı yedi yetki ve "Kendi dersleri · kendi
   sınıfları" kapsamıyla yeni bir rol başlatır ([Hazır rol şablonları](hazir-sablonlar.md)). Çip rolün adını da "Öğretmen" yapar;
   bu ad hazır rolde olduğu için önizlemede "Rolü ekle" **"Bu adda bir rol zaten var."** der, adı değiştirmen gerekir.

### Çalışan

Bugün: "Rol oluşturur ve düzenler" yetkili öğretmen hazır rolün "Düzenle"sini açabilir ama **"Kaydet"** şu iletiyle döner:
**"Kendi taşıdığın rolü değiştiremezsin; müdürden iste."** — hazır rol ona da uygulandığı için yalnız müdür değiştirir.

Tasarımda (çalışan tanımı): okula kişi koduyla eklenen kişi önce **rolsüz çalışan**dır; müdür ona **"Öğretmen"** görevini verince
bugünkü öğretmen gibi çalışır (branş seçimi burada) ve kişiye **"Sana Öğretmen görevi verildi."** bildirimi gider. Öğretmen görevi
olmayan çalışan ders programına, ödeve, sınava ve yoklamaya atanamaz ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md),
[Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).

### Öğretmen

Hazır rolün yetkileri seninkilerdir; ayrıca bir şey yapmazsın. Müdür bir yetkiyi kapatınca ilgili bölüm menünden kalkar, açınca
gelir; değişiklik menüne sayfayı yenileyince ya da yeniden girince yansır. Sana ayrıca "Öğretmen" rolü verilmez (zaten
taşırsın).

## Kurallar ve sınırlar

- **Silinmez:** "Hazır Öğretmen rolü silinemez; istemediğin yetkileri kapatabilirsin." (ekranda bu rolde "Sil" düğmesi yok; ileti
  sunucunun).
- **Ayrıca verilmez:** "Öğretmen rolü her öğretmende zaten var; ayrıca verilmez." Öğretmenin seçicisinde bu rol yer almaz.
- **Adı ve daraltması yok:** sunucu bu rol için gelen adı ve ders/sınıf daraltmasını yok sayar.
- **Yalnız müdür değiştirir:** rol yöneten öğretmen bu rolü değiştiremez (kendisine de uygulanır).
- **Okul başına bir tane:** her okulun tek bir hazır rolü olur; başka okulun hazır rolü bu okulda geçmez.
- **Ad çakışması:** rol adı okul içinde tektir. Hazır rol kurulurken okulda "Öğretmen" adlı bir ek rol zaten varsa hazır rol
  **"Öğretmen (hazır)"** adıyla kurulur (kartın başlığı yine "Öğretmen" yazar).
- **Kişi sayısı:** kartta yazan "N öğretmen" onay bekleyen başvuruları da sayar.
- **Bekleyen öğretmen** hazır rolün yetkilerini kullanamaz; yetki yalnız onaylı hesapta geçer.
- **Tasarımda:** kapsam ilk değeri "Kendi dersleri · kendi sınıfları"; göçte bugünkü bütün öğretmenler Öğretmen rolünü taşıyarak
  devam eder (çalışan tanımı).

## Kardeşler ve ilgili

**Kardeşler:** [Roller ve yetkiler ekranı](roller-ekrani.md) · [Rol ekle / düzenle](rol-duzenleyici.md) ·
[Hazır rol şablonları](hazir-sablonlar.md) · [Yetki listesi](yetki-listesi.md) ·
[Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) · [Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) ·
[Özel roller](ozel-roller.md).

**İlgili:**

- [Sınavlar · Yetkiler ve kapsam](../sinav/yetki-ve-kapsam.md), [Devamsızlık · Kim yoklama alır](../devamsizlik/yetki-ve-kapsam.md),
  [Ödev verme](../odev/odev-verme.md) — hazır roldeki yetkilerin işleri.
- [Sınıflarım](../siniflar-dersler/siniflarim.md) — "Girdiği sınıfların öğrenci sonuçlarını görür".
- [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md), [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md).
- [Sol menü](../menu-ve-arama/sol-menu.md).

## Kod tarafı

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) — `OGRETMEN_VARSAYILAN` (yedi ilk yetki), `kullaniciYetkileri` (hazır rol ∪ ek
  rol), `yetkiVarMi` (hazır roldeki yetki kapsamla daraltılmaz); [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) —
  `GET /api/school/roles` hazır rolü yoksa kurar, `role-update`'te ad ve kapsam yok sayılır, `role-delete` ve `role-assign`'da
  hazır rol reddi; [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md) — `ogretmenRolu` (kurulum),
  `ogretmenYetkileri` (bütün kutuları kapatılmış rol boş liste döner, varsayılana dönmez).
- Şema: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) — 013 (hazır Öğretmen rolü), 023 (hazır role "Sınav oluşturur"
  ve "Girdiği sınıfların öğrenci sonuçlarını görür" eklendi).
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — "Öğretmen · hazır rol" kartı, `rolModal`'ın
  hazır rol hâli, kilitli kutular; [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — öğretmen menüsünün
  yetkiye bağlı satırları.
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (hazır rolün varsayılanları, silinemez, ayrıca verilemez, "Yoklama
  alır" kapatılıp açılınca), [testler/test-siniflarim.md](../../testler/test-siniflarim.md), [testler/test-kapsam.md](../../testler/test-kapsam.md).

## Sık sorulanlar

- **Öğretmenler sınav oluşturmasın, yalnız not girsin istiyorum.** Hazır rolde "Sınav oluşturur"un kutusunu kaldır, "Sınav notu
  girer" açık kalsın.
- **Bir yetkiyi kapattım, ek rolü olan öğretmende hâlâ duruyor.** O ek rolde yetki ayrıca yazılı demektir; ek rolden de kaldır.
- **Bütün kutuları kapattım, öğretmenler varsayılana döner mi?** Hayır; yetkisiz kalırlar. İstediğin yetkileri yeniden aç.
- **Hazır rolü bir öğretmenden alabilir miyim?** Hayır; okuldaki her öğretmen onu taşır. Tasarımda kişi rolsüz çalışan olarak
  eklenir ve Öğretmen görevi Çalışanlar sayfasından verilir ya da alınır.

## Sırada

- Çalışan olarak ekleme (iş 2): Öğretmen rolünün görev olarak verilmesi, "Sana Öğretmen görevi verildi." bildirimi, göç.
- Özel roller (iş 24): rolün listede durması, kapsamı, yeni ilk yetkileri ("Sınıfa ve gruba toplu mesaj", "Toplantı açar").
- Yoklamaya ders programından girilir (3 Ekim kararı): öğretmen menüsündeki ayrı "Yoklama" satırı kalkar.
