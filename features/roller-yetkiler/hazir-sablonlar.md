# Roller ve yetkiler · Hazır rol şablonları

**Durum:** Kodda var; tasarımda ek olarak şablonlar açılır liste yerine çip olarak seçilir, "Öğretmen", "Kodlayıcı / Tasarımcı",
"BT sorumlusu", "Okul sekreteri" ve "Sınıf öğretmeni" şablonları gelir, var olan şablonların yetkileri genişler, şablon rolün
kapsamını da doldurur (ör. "Zümre başkanı": Matematik · bütün sınıflar) ve Çalışanlar sayfasındaki "+ Rol ata" listesinden
"Kodlayıcı / Tasarımcı (şablondan yeni rol)" açılabilir.

Yeni bir rolü sıfırdan kurmak yerine okullarda sık görülen bir görevin yetkileriyle başlatan hazır listeler.

## Ne işe yarar

Müdür yardımcısının, rehber öğretmenin, etüt sorumlusunun yetkileri çoğu okulda benzerdir. Şablon bu yetkileri senin yerine
işaretler; sonra istediğin gibi eklersin, çıkarırsın. **Şablon yalnızca başlangıçtır:** rol kaydedildikten sonra şablonla bağı
kalmaz, şablon sonradan değişse de senin rolün değişmez.

Kullanıcı 29 Eylül'de istedi: "preset'ler zümre başkanı, öğretmen, müdür yardımcısı, coder-designer Türkçesi gibi biraz preset ekle";
yetkiler de "şifre değiştirebilir öğrencilerin, okul fotosu ekleyebilir gibi çeşitli olsun". Tasarım 1 önizlemesi bu isteği ve
özel roller önerisini (yeni şablonlar: BT sorumlusu, Okul sekreteri, Sınıf öğretmeni) içerir.

## Nereden açılır

- **Müdür:** **"Roller ve Yetkiler"** → "Ek roller" kartındaki **"Rol oluştur"** → pencerenin en üstündeki **"Şablondan başla
  (isteğe bağlı)"** seçicisi. Seçici yalnız **yeni** rolde çıkar; var olan rolü düzenlerken ve hazır Öğretmen rolünde yoktur.
- Tasarımda: **"Roller ve yetkiler"** → **"Rol ekle"** → pencerenin en üstünde **"Şablondan başla"** çipleri. Ayrıca
  **"Çalışanlar"** → kişinin penceresi → **"+ Rol ata"** listesinde, okulda henüz yoksa **"Kodlayıcı / Tasarımcı (şablondan yeni
  rol)"**.

## Adım adım

### Müdür

**Bugün (kodda):**

1. "Rol oluştur"a bas. En üstte **"Şablondan başla (isteğe bağlı)"**; seçenekler: **"— boş başla —"** ve şablonların adları.
   Altında ipucu: "Şablon yalnızca yetkileri işaretler; sonra istediğin gibi değiştirirsin."
2. Bir şablon seç. Olanlar:
   - şablondaki yetkilerin kutuları işaretlenir, öbür kutuların işareti kalkar;
   - hazır Öğretmen rolünden gelen **kilitli** kutulara ("Öğretmen rolünde var") dokunulmaz;
   - daraltılabilen bir yetki işaretlenince altında "Dersler" / "Sınıflar" kutuları açılır (hepsi "Tümü" seçili);
   - **"Rol adı"** boşsa şablonun adıyla dolar (doluysa değişmez).
3. Başka bir şablon seçersen işaretler o şablona göre baştan kurulur. **"— boş başla —"** seçersen kilitsiz bütün kutuların
   işareti kalkar; ad silinmez.
4. Yetkileri istediğin gibi değiştir, adı düzelt, **"Kaydet"** ([Rol ekle / düzenle](rol-duzenleyici.md)).

**Bugünkü şablonlar** (ekranda bu sırayla):

| Şablon | İşaretlediği yetkiler (ekrandaki adlarıyla) |
|---|---|
| **Müdür Yardımcısı** | "Ders programını düzenler", "Sınıfa ders ekler ve çıkarır", "Derse öğretmen atar", "Sınıf açar ve siler", "Öğrenciyi sınıfa yerleştirir", "Öğrenci hesabı açar ve okula öğrenci ekler", "Öğrenci bilgilerini düzenler", "Öğretmen bilgisi ve branşını düzenler", "Okulun tüm devamsızlığını görür", "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler", "Bütün etütlerde yoklama alır", "Sınıfa veya gruba toplu mesaj atar", "Okuldaki herkese mesaj atar", "Okul takvimine etkinlik ve tatil ekler", "İşlem kaydını görür" |
| **Rehber Öğretmen** | "Okulun tüm devamsızlığını görür", "Öğrenci portalına girer", "Sınıfa veya gruba toplu mesaj atar" |
| **Etüt Sorumlusu** | "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler", "Bütün etütlerde yoklama alır" |
| **Nöbetçi Öğretmen** | "Bütün etütlerde yoklama alır", "Okulun tüm devamsızlığını görür" |
| **Servis Sorumlusu** | "Servisleri ve servis öğrencilerini düzenler" |
| **Zümre Başkanı** | "Sınav oluşturur", "Sınıfa veya gruba toplu mesaj atar" |
| **Kodlayıcı** | "Okulun giriş sayfasını düzenler", "Okulun haritadaki yerini ayarlar" |

Dikkat: "Sınav oluşturur" hazır Öğretmen rolünde ilk açık gelir; o zaman ek rol penceresinde kilitlidir ve **Zümre Başkanı**
rolüne yazılmaz (rol yalnız "Sınıfa veya gruba toplu mesaj atar"la kaydolur). Şablonların hiçbirinde "Rol oluşturur ve düzenler",
"Öğrenci şifresi sıfırlar", "Okula öğretmen ekler, başvuru onaylar", "Öğretmeni okuldan çıkarır", "Eğitim yılı açar ve değiştirir",
"Excel ile içe ve dışa aktarım yapar" ve "Yemek listesini düzenler" yoktur; gerekirse elle işaretlersin.

**Tasarımda:**

1. "Rol ekle" penceresinin en üstünde **"Şablondan başla"** ve çipler: **"Öğretmen"**, **"Müdür yardımcısı"**, **"Rehber öğretmen"**,
   **"Etüt sorumlusu"**, **"Nöbetçi öğretmen"**, **"Servis sorumlusu"**, **"Zümre başkanı"**, **"Kodlayıcı / Tasarımcı"**,
   **"BT sorumlusu"**, **"Okul sekreteri"**, **"Sınıf öğretmeni"** ve en sonda **"Boş başla"**. Seçtiğin çip vurgulu görünür.
2. Bir çipe bas: rolün yetkileri şablonunkiler olur (öncekiler silinir); **"Rol adı"** boşsa ya da başka bir şablonun adını
   taşıyorsa şablonun adını alır; **"Kapsam"** da şablona göre dolar (aşağıdaki tablo). "Boş başla" bütün yetkileri kaldırır, ad bir
   şablonun adıysa adı da siler.
3. Yetkiler bölümünde şablonun yetkileri işaretli gruplar açık gelir; istediğin gibi değiştir, **"Rolü ekle"**.

| Şablon (tasarım) | Yetkiler (Tasarım 1'deki adlarıyla) | Kapsam |
|---|---|---|
| **Öğretmen** | "Derse atanabilir", "Ödev verir", "Sınav açar", "Not girer", "Yoklama alır", "Sınıfa ve gruba toplu mesaj", "Toplantı açar" | Kendi dersleri · kendi sınıfları |
| **Müdür yardımcısı** | "Ders programını düzenler", "Sınıfları düzenler", "Sınıflara yerleştirir", "Hesap açar", "Bilgilerini düzenler", "Şifresini değiştirir", "Oturumuna bakar", "Başarı ekler", "Öğretmeni düzenler", "Sonuçlarını görür", "Devamsızlığı görür", "Etüt planlar", "Sınıfa ve gruba toplu mesaj", "Bütün okula mesaj", "Anket açar", "Toplantı açar", "Takvim ve etkinlikler", "Tahta hesapları", "Okul simgesi", "Excel aktarımı", "İşlem kaydını görür" (21) | Bütün dersler · bütün sınıflar |
| **Rehber öğretmen** | "Derse atanabilir", "Oturumuna bakar", "Devamsızlığı görür", "Sınıfa ve gruba toplu mesaj", "Başarı ekler", "Toplantı açar", "Etüt planlar" | Bütün dersler · bütün sınıflar |
| **Etüt sorumlusu** | "Derse atanabilir", "Etüt planlar", "Devamsızlığı görür" | Bütün dersler · bütün sınıflar |
| **Nöbetçi öğretmen** | "Derse atanabilir", "Yoklama alır", "Devamsızlığı görür" | Bütün dersler · bütün sınıflar |
| **Servis sorumlusu** | "Derse atanabilir", "Servisler", "Sınıfa ve gruba toplu mesaj" | Bütün dersler · bütün sınıflar |
| **Zümre başkanı** | "Derse atanabilir", "Sonuçlarını görür", "Sınav açar", "Sınav grubu açar", "Not girer", "Toplantı açar" | Matematik · bütün sınıflar |
| **Kodlayıcı / Tasarımcı** | "Okul sayfası (fotoğraf, tanıtım)", "Okulun haritadaki yeri", "Okul simgesi", "Görünümü (CSS) düzenler", "Eklentileri görür", "Eklenti yazar", "Eklenti yayımlar" | Bütün dersler · bütün sınıflar |
| **BT sorumlusu** | "Tahta hesapları", "Şifresini değiştirir", "Excel aktarımı", "Okul cihazları", "Eklentileri görür", "Eklenti kurar, kaldırır" | Bütün dersler · bütün sınıflar |
| **Okul sekreteri** | "Hesap açar", "Bilgilerini düzenler", "Sınıflara yerleştirir", "Excel aktarımı", "Takvim ve etkinlikler", "Yemek listesi" | Bütün dersler · bütün sınıflar |
| **Sınıf öğretmeni** | "Derse atanabilir", "Devamsızlığı görür", "Sınıfa ve gruba toplu mesaj", "Toplantı açar", "Başarı ekler", "Oturumuna bakar" | Kendi dersleri · kendi sınıfları |

"Zümre başkanı"nın "Matematik" kapsamı önizlemedeki örnektir: zümrenin dersini sen seçersin. "Kapsam" sütunu ekrandaki özettir
(ikinci parça küçük harfle yazar). "Oturumuna bakar" öğrencinin ekranını açma yetkisidir; 3 Ekim kararıyla arayüzde "portal" sözü
"oturum" olduğu için bu adla görünür. Yetkilerin anlamı: [Yetki listesi](yetki-listesi.md).

**Çalışanlar sayfasından şablonla rol (tasarımda):** kişinin penceresindeki **"+ Rol ata"** listesinde okulun rolleri durur; okulda
henüz "Kodlayıcı / Tasarımcı" rolü yoksa listede **"Kodlayıcı / Tasarımcı (şablondan yeni rol)"** de çıkar. Seçince bu şablondan
yeni bir rol açılır (açıklaması "Okul sayfası, görünüm ve eklentiler", kapsamı bütün okul) ve kişiye hemen verilir
([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).

### Çalışan

Bugün: "Rol oluşturur ve düzenler" yetkili öğretmen de yeni rolde aynı seçiciyi kullanır. Şablon yalnız kutuları işaretler; sunucu
yetkileri kişinin kendi yetkileriyle karşılaştırmaz, yani şablonun bütün yetkilerini bir role koyabilir (bilinen açık:
["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md)).

Tasarımda: rol penceresindeki "Kendinden fazla yetki veremezsin." kuralı genel olduğu için şablonla açılan rolde de geçer: rol
yöneten çalışan kendisinde olmayan bir yetkiyi şablondan da veremez (önizlemede ayrıca çizilmedi). Eklenti yetkilerini (Kodlayıcı / Tasarımcı ve BT sorumlusu şablonlarında var) yalnız müdür verir
(eklenti tanımı).

## Kurallar ve sınırlar

- **Şablon yalnız başlangıçtır;** rol kaydedilince şablonla bağı kalmaz.
- **Kilitli kutular:** hazır Öğretmen rolünde açık olan yetkiler şablondan da ek role yazılmaz (bugün).
- **Ad boşsa dolar:** bugün yalnız ad kutusu boşken; tasarımda ad boşken ya da başka bir şablonun adıyken.
- **Şablon listesi sunucudan gelir;** okul kendi şablonunu kaydedemez. Bir rolün benzerini istiyorsan yeni rolde aynı yetkileri
  elle işaretlersin.
- **Müdüre özel işler şablona konamaz:** müdür atama, ortak karar, okulu kapatma (özel roller tanımı ve rol penceresindeki not).
- **Öneri durumu:** kullanıcının adını verdiği şablonlar (Öğretmen, Zümre başkanı, Müdür yardımcısı, Kodlayıcı / Tasarımcı)
  isteğe dayanır; yetkilerin "çeşitli olsun" isteği de kullanıcının ("şifre değiştirebilir öğrencilerin", "okul fotosu
  ekleyebilir"). Hangi şablona hangi yeni yetkinin gireceği (ör. Rehber öğretmene "Başarı ekler") ve "BT sorumlusu", "Okul
  sekreteri", "Sınıf öğretmeni" şablonları özel roller önerisindendir. Önerinin bütünü onay bekliyor; Tasarım 1 önizlemesi hepsini
  içeriyor.
- **"Öğretmen" şablonunun adı:** çip rol adını "Öğretmen" yapar; bu ad hazır Öğretmen rolünde olduğu için önizlemede kaydederken
  **"Bu adda bir rol zaten var."** çıkar, adı değiştirmen gerekir (tasarımda çözülmemiş küçük bir çakışma).
- **Ad yazımı:** bugün her kelime büyük harfle ("Müdür Yardımcısı"), tasarımda yalnız ilk kelime ("Müdür yardımcısı").
- **Çeviri:** şablon adları çok dil işinde çeviri kataloğuna girer.

## Kardeşler ve ilgili

**Kardeşler:** [Rol ekle / düzenle](rol-duzenleyici.md) · [Yetki listesi](yetki-listesi.md) · [Özel roller](ozel-roller.md) ·
[Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) · [Ders ve sınıf daraltması](ders-ve-sinif-daraltmasi.md) ·
[Roller ve yetkiler ekranı](roller-ekrani.md).

**İlgili:**

- [Etütler · Etüt yetkileri ve hazır roller](../etut/etut-yetkileri.md), [Sınavlar · Yetkiler ve kapsam](../sinav/yetki-ve-kapsam.md),
  [Başarılar · "Başarı ekler" yetkisi](../basarilar/basari-ekleme-yetkisi.md), [Yemek · Düzenleme yetkisi](../yemek/duzenleme-yetkisi.md),
  [İşlem kaydı · Görme yetkisi](../islem-kaydi/gorme-yetkisi.md).
- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md).
- [Eklentiler](../eklentiler/README.md) — Kodlayıcı / Tasarımcı ve BT sorumlusu şablonlarındaki eklenti yetkileri.
- [Dil ve çeviri](../dil/README.md) — şablon adlarının çevirisi.

## Kod tarafı

- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) — `ROL_SABLONLARI` (ad + yetki anahtarları); `GET /api/school/permissions`
  katalogla birlikte `sablonlar`'ı verir ([sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md)).
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — `#rSablon` seçicisi (yalnız yeni rolde),
  `rolSablonuUygula` (kilitsiz kutuları şablona göre işaretler, ad boşsa doldurur).
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (şablonların gelmesi, Etüt Sorumlusu),
  [testler/test-okul-sayfasi.md](../../testler/test-okul-sayfasi.md) (Kodlayıcı şablonu yalnız okul sayfası ve konum).

## Sık sorulanlar

- **Şablondan açtığım rolü değiştirebilir miyim?** Evet; şablon yalnız kutuları işaretler, sonra istediğin gibi değiştirirsin.
- **Zümre Başkanı şablonunu seçtim, "Sınav oluşturur" kilitli.** Bu yetki hazır Öğretmen rolünde açık; her öğretmende zaten var,
  ek role yazılmaz.
- **Kodlayıcı ne yapar?** Bugün okulun sayfasını (fotoğraf, logo, tanıtım, renkler ve kısıtlı CSS) ve okulun haritadaki yerini
  düzenler ([Özel roller](ozel-roller.md#kodlayıcı)).

## Sırada

- Özel roller (iş 24): yeni şablonlar ("Öğretmen", "Kodlayıcı / Tasarımcı", "BT sorumlusu", "Okul sekreteri", "Sınıf öğretmeni"),
  genişleyen Rehber, Zümre başkanı ve Müdür yardımcısı, şablonla gelen kapsam, çip seçimi (onay bekliyor).
- Eklentiler (iş 35): Kodlayıcı / Tasarımcı şablonuna "Eklenti yazar" ve "Eklenti yayımlar" (şimdilik kod yok).
- Çok dil (iş 22): şablon adlarının çevirisi.
