# Roller ve yetkiler

Okulda kimin neyi yapabileceğini roller ve yetkiler belirler. **Müdür** her zaman bütün yetkilere sahiptir ve bu değiştirilemez.
Okuldaki her **öğretmen**, okulun silinmeyen hazır **Öğretmen** rolünün yetkileriyle çalışır ("Ödev verir", "Yoklama alır"…); müdür
bu rolün kutularını açıp kapatarak bütün öğretmenlerin temel yetkisini değiştirir. Ek görevler için müdür "Roller ve Yetkiler"
sayfasında **ek roller** açar ("Müdür Yardımcısı", "Etüt Sorumlusu", "Kodlayıcı"…): hazır bir şablondan başlayabilir, yetkileri
gruplar hâlinde tek tek seçer, gerekirse bir yetkiyi belli derslere ve sınıflara daraltır, rolü bir öğretmene verir; o öğretmenin
yetkisi iki rolün birleşimidir ve sunucu her istekte buna bakar. Tasarımda (Tasarım 1 önizlemesi, özel roller ve çalışan tanımları,
kullanıcının 2 Ekim "custom name custom thing" sözü) hazır Öğretmen rolü öbür rollerle aynı listede durur ve kapsamı olur ("Kendi
dersleri · kendi sınıfları"); 44 yetki 10 grupta, aranabilir ve "Hepsi" kutulu; yeni yetkiler (başarı, toplantı, tahta, okul
simgesi, eklentiler…) ve yeni şablonlar (Öğretmen, Kodlayıcı / Tasarımcı, BT sorumlusu, Okul sekreteri, Sınıf öğretmeni) gelir;
role açıklama ve branş verilir; kapsam rol başına seçilir; rol kişiye doğrudan rolün penceresinden ya da Çalışanlar sayfasından
verilir, bir kişi birden çok rol taşır ve öğretmen olmayan çalışan da özel rol alır; kimse kendinden fazla yetki veremez, müdür
atama, ortak karar ve okulu kapatma hiçbir role verilemez.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Roller ve yetkiler ekranı](roller-ekrani.md) | Sayfanın yeri ve düzeni: hazır rol kartı, "Ek roller", "Öğretmenlerin ek rolleri"; tasarımdaki tek liste | Kodda var; tasarımda ek olarak |
| [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) | Her öğretmenin temel yetkileri, ilk yedi yetki, kapatınca ne olur, silinmez | Kodda var; tasarımda ek olarak |
| [Hazır rol şablonları](hazir-sablonlar.md) | "Şablondan başla"; bugünkü ve tasarımdaki şablonların yetkileri ve kapsamları | Kodda var; tasarımda ek olarak |
| [Rol ekle / düzenle](rol-duzenleyici.md) | Rol penceresi: ad, gruplu yetkiler, kilitli kutular, kaydetme ve hata iletileri; tasarımda açıklama, kapsam, arama, kişiler | Kodda var; tasarımda ek olarak |
| [Role branş](rol-bransi.md) | Okulun kendi adını verdiği role branş bağlamak ("Otizm destek öğretmeni") | Tasarlandı — henüz kodda yok |
| [Rol silme](rol-silme.md) | Ek rolü silmek; taşıyanlar okulda kalır | Kodda var; tasarımda ek olarak |
| [Yetki listesi](yetki-listesi.md) | Bütün yetkiler: ekrandaki adları, açıklamaları, daraltma, açtıkları; tasarımdaki 44 yetki | Kodda var; tasarımda ek olarak |
| [Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) | Yetkiyi derslere ve sınıflara daraltmak, kilitli yetkiler, kapsam dışı iletiler; tasarımda rol başına kapsam | Kodda var; tasarımda ek olarak |
| [Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) | Müdür, hazır rol, ek rol ve daraltmanın birlikte hesabı; değişikliğin ne zaman geçtiği | Kodda var; tasarımda ek olarak |
| ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md) | Rol yönetimini bir başkasına vermek, sınırları ve bilinen açık | Kodda var; tasarımda ek olarak |
| [Özel roller](ozel-roller.md) | Müdür Yardımcısı, Rehber Öğretmen, Etüt Sorumlusu, Nöbetçi Öğretmen, Servis Sorumlusu, Zümre Başkanı, Kodlayıcı ve tasarımdaki yeni roller: taşıyanın gördükleri | Kodda var; tasarımda ek olarak |

Planda olmayıp eklenen belgeler: [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md), [Role branş](rol-bransi.md),
[Rol silme](rol-silme.md), [Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md), ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md).

**Okuma sırası:** önce [Roller ve yetkiler ekranı](roller-ekrani.md) ve [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) (sayfa ve
temel rol); rol kurmak için [Rol ekle / düzenle](rol-duzenleyici.md), [Hazır rol şablonları](hazir-sablonlar.md),
[Yetki listesi](yetki-listesi.md) ve [Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md); kuralların bütünü için
[Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) ve ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md); rolü taşıyanın
gözünden [Özel roller](ozel-roller.md); tasarımdaki yenilik için [Role branş](rol-bransi.md); en son [Rol silme](rol-silme.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz. "Çalışan":
özel rolü olan kişi — bugün ek rolü olan öğretmen, tasarımda öğretmen olmayan çalışan da.

| Alt özellik | Müdür | Öğretmen | Çalışan | Yönetici |
|---|---|---|---|---|
| Roller ve yetkiler ekranı | [rolleri görür, açar, düzenler, siler; öğretmene ek rol verir](roller-ekrani.md#müdür) | [sayfayı görmez; değişiklik menüsüne yansır](roller-ekrani.md#öğretmen) | ["Rol oluşturur ve düzenler" ile kullanır; kendi rolüne dokunamaz](roller-ekrani.md#çalışan) | — |
| Hazır Öğretmen rolü | [yetkilerini açıp kapatır](hazir-ogretmen-rolu.md#müdür) | [temel yetkileri bunlardır](hazir-ogretmen-rolu.md#öğretmen) | [değiştiremez; tasarımda "Öğretmen" görevi olarak alır](hazir-ogretmen-rolu.md#çalışan) | — |
| Hazır rol şablonları | [yeni rolü şablondan başlatır](hazir-sablonlar.md#müdür) | — | [rol yönetiyorsa kullanır](hazir-sablonlar.md#çalışan) | — |
| Rol ekle / düzenle | [rol açar, adını ve yetkilerini seçer](rol-duzenleyici.md#müdür) | — | [rol yönetiyorsa başkalarının rollerini düzenler](rol-duzenleyici.md#çalışan) | — |
| Role branş | [tasarımda role branş verir](rol-bransi.md#müdür) | — | [tasarımda branşla görünür, o derse atanır](rol-bransi.md#çalışan) | — |
| Rol silme | [ek rolü siler](rol-silme.md#müdür) | [rolü silinince hazır rolle kalır](rol-silme.md#öğretmen) | [rol yönetiyorsa siler; tasarımda rolsüz kalır](rol-silme.md#çalışan) | — |
| Yetki listesi | [yetkileri role koyar](yetki-listesi.md#müdür) | [yetkilerini menüsünden anlar](yetki-listesi.md#öğretmen) | [rolündeki yetkilerle çalışır](yetki-listesi.md#çalışan) | — |
| Ders ve sınıf daraltması | [yetkiyi derse ve sınıfa daraltır](ders-ve-sinif-daraltmasi.md#müdür) | [hazır rolü daraltılmaz; çoğu işi kendi dersiyle sınırlı](ders-ve-sinif-daraltmasi.md#öğretmen) | [kapsam içinde çalışır](ders-ve-sinif-daraltmasi.md#çalışan) | — |
| Yetkiler nasıl birleşir | [her zaman tam yetkili](yetkilerin-birlesmesi.md#müdür) | [hazır rol + ek rol](yetkilerin-birlesmesi.md#öğretmen) | [tasarımda birden çok rol; rolsüzken yetkisiz](yetkilerin-birlesmesi.md#çalışan) | [kodda tam yetkili sayılır, okulun bölümüne giremez](yetkilerin-birlesmesi.md#kurallar-ve-sınırlar) |
| "Rol oluşturur ve düzenler" yetkisi | [yetkiyi role koyar](rol-yonetme-yetkisi.md#müdür) | — | [rol açar, verir; kendine ve kendi rolüne dokunamaz](rol-yonetme-yetkisi.md#çalışan) | — |
| Özel roller | [rolü açar, kişiye verir](ozel-roller.md#müdür) | [ek rolle görev alır, menüsü genişler](ozel-roller.md#rolü-taşıyan-öğretmen-ya-da-çalışan) | [tasarımda öğretmen olmadan da rol taşır](ozel-roller.md#çalışan) | — |

Öğrenci, veli, servisçi ve ziyaretçi bu klasördeki hiçbir ekranı kullanmaz; yalnız sonuçlarını görür (ör. rehber öğretmen
öğrencinin portalını açar). Site yöneticisi ve destek ekibi okulun rollerine dokunmaz; eğitmen, çevirmen ve tahta hesabı okulun
rolleri değildir (kendi klasörlerinde).

Rol kapıları: [Müdür](../roller/mudur.md) · [Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) ·
[Yönetici](../roller/yonetici.md). Bütün özellikler: [features/](../README.md).

## Açık noktalar

Kodlamadan önce kullanıcıya sorulacak ya da tasarımda netleşecekler:

- **Özel roller önerisi onay bekliyor** (yeni yetkiler ve "BT sorumlusu", "Okul sekreteri", "Sınıf öğretmeni" şablonları;
  Rehber, Zümre başkanı, Müdür yardımcısı genişlemeleri). Kullanıcının adını verdiği şablonlar (Öğretmen, Zümre başkanı, Müdür
  yardımcısı, Kodlayıcı / Tasarımcı) isteğe dayanır; Tasarım 1 önizlemesi hepsini içeriyor.
- **Tasarım 1'in yetki listesinde olmayan bugünkü yetkiler:** "Derse öğretmen atar", "Ödev sonuçlandırır", "Bütün etütlerde yoklama
  alır", "Sınıfa ders ekler ve çıkarır" — başka bir yetkinin içinde mi kalacak, kalkacak mı belirtilmedi.
- **Özel roller tanımında olup önizlemede olmayan yetkiler:** sınıfın uzaktan ders bağlantısını düzenleme, okul yedeği.
- **Rol başına kapsam:** bir kişinin birden çok rolü olunca kapsamların nasıl birleşeceği; "Kendi dersleri / sınıfları"nın tam
  tanımı; "Başarı ekler"in kapsama uyup uymadığı ([Başarılar](../basarilar/README.md) da soruyor).
- **Role branş:** iki rolün farklı branşları ya da kişinin kendi branşıyla rolün branşı nasıl görünür.
- **Bildirim:** rol alınınca, silinince ya da yetkileri değişince kişiye bildirim gitsin mi (bugün gitmiyor, tanımda yazılı değil).
- **Çizilmeyen ekranlar:** rol yöneten çalışanın ekranı ve özel rollü kişinin menüsü Tasarım 1'de çizilmedi.
- **Okul cihazı** ("Okul cihazları" yetkisi): kullanıcı "sonra bakarım" dedi.
- **"Öğretmen" şablonunun adı:** önizlemede "Öğretmen" çipi rol adını "Öğretmen" yapar ve hazır rolle çakışır ("Bu adda bir rol
  zaten var."); şablonla açılan rolün adı nasıl olacak, belirlenmedi.
- **"Sınıfın rehber öğretmeni":** 3 Ekim kararındaki devamsızlık sınırı uyarısının alıcısı; olağan anlamıyla sınıftan sorumlu
  öğretmen, okulun "Rehber öğretmen" rolüyle aynı kişi olmayabilir. Sistemde nasıl belirleneceği (ör. "Sınıf öğretmeni" rolü)
  kararlaştırılmadı.
- **Bilinen açıklar (bugünkü kod, güvenlik denetimine):** rol yöneten kişi kendinde olmayan yetkiyi dağıtabiliyor; "Roller ve
  Yetkiler" ve "Devamsızlık" sayfaları ek yetki istiyor (Rehber ve Nöbetçi "Devamsızlık"ı açamıyor); kendine rol verme reddinde
  seçici geri alınmıyor; ek rolü yeniden kaydetmek hazır rolde de olan yetkiyi ek rolden siliyor; hazır rol penceresindeki ipucu
  eksik ("ek rolü olmayan öğretmenlerden kalkar"); hazır rol kartındaki öğretmen sayısına bekleyen başvurular giriyor; "Sınıfa ders
  ekler ve çıkarır" menüye "Sınıflar"ı koyar ama sayfa "Sınıf açar ve siler" olmadan açılmıyor; rol yöneten kişi kendi taşıdığı
  rolü silebiliyor.
- **KILAVUZ yanlışları** ([belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Roller ve yetkiler"): şablon listesinde "Kodlayıcı" yok;
  "Ders ve sınıf daraltması" örneği hazır Öğretmen rolünde açık olduğu için ek rolde kilitli olan yetkileri ("Derse öğretmen olarak
  atanabilir", "Ödev verir", "Sınav notu girer") daraltıyor ve "Derse öğretmen olarak atanabilir"e "Sınıflar" yazıyor (bu yetkinin
  yalnız "Dersler" kutusu var); "Rol vermek (öğretmen düzenleme penceresinden de olsa)" diyor ama bugünkü ekranda o pencerede rol
  alanı yok.

## İlgili öbür klasörler

- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — rolün kişiye verilmesi, rolsüz çalışan, müdür yapma.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — rolün adıyla açılan menü bölümü.
- [Etütler](../etut/README.md), [Sınavlar](../sinav/README.md), [Devamsızlık ve yoklama](../devamsizlik/README.md),
  [İşlem kaydı](../islem-kaydi/README.md), [Yemek listesi](../yemek/README.md), [Başarılar](../basarilar/README.md) — kendi
  yetkilerinin ayrıntısı.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrenci yetkilerinin işleri (hesap, şifre, portal).
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — ders atama, okulun kendi branşı ve dersi.
- [Ders programı](../ders-programi/README.md), [Servis](../servis/README.md), [Okul sayfası](../okul-sayfasi/README.md),
  [Toplantılar](../toplanti/README.md), [Tahta hesabı](../tahta/README.md), [Eklentiler](../eklentiler/README.md) — yetkilerin
  açtığı bölümler.
- [Okulun özellikleri](../ozellikler/README.md) — kapalı bölüm yetkiye rağmen menüde çıkmaz.
- [Site yönetimi](../yonetim/README.md), [Destek talepleri](../destek/README.md), [Eğitim içerikleri](../egitim-icerikleri/README.md),
  [Dil ve çeviri](../dil/README.md) — okul dışı roller (yönetici, destek, eğitmen, çevirmen).
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — kim neyi görür.

## Kod belgeleri

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) (yetki kataloğu, hazır rolün ilk yetkileri, şablonlar, birleşim ve kapsam),
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (rol uçları), [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md)
  (öğretmen penceresinden rol), [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md) (rol tabloları),
  [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (rol kayıtlarının adları).
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) (sayfa ve rol penceresi),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (yetkiye bağlı menü).
- Şema: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (`roller`, `rol_yetkileri`, `rol_yetki_kapsamlari`; 013 ve 023).
- Testler: [testler/test-rol.md](../../testler/test-rol.md), [testler/test-kapsam.md](../../testler/test-kapsam.md),
  [testler/test-etut.md](../../testler/test-etut.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Roller ve yetkiler".
