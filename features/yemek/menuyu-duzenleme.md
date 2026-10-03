# Yemek listesi · Bu haftayı düzenle

**Durum:** Kodda var; tasarımda ek olarak düzenleyen kişi öğretmen olmayan bir çalışan da olabilir (çalışan tanımı) ve "Okul sekreteri" hazır rolü bu yetkiyle gelir (öneri).

Müdürün ya da yetkili kişinin bir haftanın yedi gününün menüsünü ve kalorisini tek pencerede yazdığı, değiştirdiği ve sildiği yer.

## Ne işe yarar

Menüyü girmenin tek yolu bu pencere. Her güne yemekleri alt alta yazarsın (her satır listede ayrı bir madde olur), istersen
günün kalorisini de; bir günün kutusunu boşaltırsan o günün menüsü silinir. Kaydedince okuldaki herkes yeni menüyü
[Haftanın yemek listesi](yemek-listesi.md)'nde görür.

## Nereden açılır

[Yemek listesi](yemek-listesi.md) sayfası → kartların altındaki **"Bu haftayı düzenle"** düğmesi. Düğme yalnız müdürde ve
["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md) olan kişide çıkar. Şeritte hangi hafta açıksa o hafta düzenlenir;
gelecek haftayı girmek için önce [hafta gezgini](hafta-gezgini.md)'nde "Sonraki hafta"ya bas.

Pencerenin başlığı haftanın aralığıdır: **"28 Eylül – 4 Ekim menüsü"**.

Tasarımda (Tasarım 1 önizlemesi): düğme sayfanın üstünde, başlığın altındaki satırda sağa yaslı, artı simgeli
**"Haftayı düzenle"**; pencere başlığı "Yemek listesi · bu hafta".

## Adım adım

### Pencerede ne var (bugünkü site)

- En üstte ipucu: **"Her satıra bir yemek yaz. Boş bırakılan günün menüsü silinir."**
- Pazartesi'den Pazar'a yedi satır. Her satırda:
  - solda menü kutusu, etiketi gün adı ve tarihi: "Pazartesi · 28 Eylül";
  - sağda **"Kalori"** kutusu (yer tutucu "kcal") ([Kalori](kalori.md)).
- Hafta içi menü kutusu üç satır yüksekliğinde, boşken soluk örnek yazı gösterir: "Mercimek çorbası", "Tavuk sote", "Pirinç
  pilavı", "Ayran" (alt alta). Cumartesi ve Pazar kutusu tek satır yüksekliğinde, örnek yazısı "Hafta sonu (isteğe bağlı)".
- O hafta için kayıtlı menü ve kalori varsa kutular dolu gelir.
- Altta **"Vazgeç"** ve **"Kaydet"**.
- Telefonda (520 pikselden dar) kalori kutusu menü kutusunun altına iner.

### Müdür

1. Menüden "Okul Düzeni" → **"Yemek Listesi"**.
2. Düzenleyeceğin haftaya geç (gerekirse **"Sonraki hafta"**).
3. **"Bu haftayı düzenle"**ye bas.
4. Her güne yemekleri **alt alta** yaz; yeni yemek için Enter ile yeni satıra geç. Ör.:
   ```
   Ezogelin çorbası
   Kuru fasulye
   Bulgur pilavı
   Turşu
   ```
5. İstersen günün **"Kalori"** kutusuna tam sayı yaz (1–5000).
6. Bir günün menüsünü silmek için kutusunu tamamen boşalt.
7. **"Kaydet"**e bas. Düğme "Kaydediliyor..." olur; kayıt bitince pencere kapanır ve sayfa yeni menüyle yeniden çizilir. Ayrıca
   "kaydedildi" diye bir ileti çıkmaz; kartlarda yeni menüyü görürsün.
8. Bir sorun olursa pencere açık kalır ve sunucunun iletisi pencerenin altında kırmızı çıkar (aşağıda "Kurallar"); düzeltip yeniden
   "Kaydet".
9. **"Vazgeç"** (ya da pencereyi kapatmak) hiçbir şeyi kaydetmez.

### Öğretmen

Müdür sana "Yemek listesini düzenler" yetkisini verdiyse (hazır Öğretmen rolünde ya da ek rolünde —
[nasıl verilir](duzenleme-yetkisi.md)) adımlar müdürünkiyle aynı: menüde "Yemek Listesi" → "Bu haftayı düzenle" → yaz →
"Kaydet". Menüne yeni bir satır eklenmez; düğme yalnız sayfada çıkar. Yetki yeni verildiyse sayfayı yeniden aç.

Çocuğunun okulunun menüsü de sayfanda görünüyorsa bile pencere hep **kendi okulunun** menüsünü açar ve onu kaydeder.

### Çalışan

Bugün kodda: ek görevli kişi öğretmen hesabıyla bir ek rol taşır (ör. müdürün "Müdür Yardımcısı" rolüne bu yetkiyi eklemesiyle);
adımlar öğretmeninkiyle aynı.

Tasarımda: kişi okula "çalışan" olarak eklenir; öğretmen olmasa da müdürün verdiği özel rolde bu yetki varsa (ör. "Okul
sekreteri" hazır rolü: öğrenci hesabı açar, öğrenci bilgilerini düzenler, sınıflara yerleştirir, Excel aktarımı, takvim, yemek
listesi) menüyü düzenler. Rolsüz çalışan sayfayı hiç görmez.

### Tasarım 1 önizlemesindeki pencere (örnek)

Önizlemede müdür "Haftayı düzenle"ye basınca "Yemek listesi · bu hafta" penceresi açılır: yalnız hafta içi beş gün, her biri tek
satırlık bir kutu (etiketi "Pzt · 28 Eylül"), yemekler aynı satırda " · " ile ayrılır. Altta not: "Yemekleri " · " ile ayır.
Aylık listeyi Excel aktarımıyla da yükleyebilirsin." Boş gün kabul edilmez: "Pzt günü boş kalamaz; yemek yoksa "Yemek yok" yaz."
Başarıda "Bu haftanın yemek listesi kaydedildi." iletisi çıkar.

Bunlar örnektir, karar değil: kullanıcı yemek ekranı için bir şey söylemedi; 2 Ekim'de onayladığı karara göre üzerine yorum
yapmadığı ekranlar bugünkü siteye benzer. Bu yüzden bugünkü kurallar geçerli (satır satır yazım, boş gün = silme, hafta sonu ve kalori kutuları).
Excel'den yemek listesi yükleme bugün yok ve kararlaştırılmış bir iş de değil ([İçeri aktarım](../excel-aktarim/ice-aktarim.md)
bugün öğrenci, servisçi listeleri ve ders programı içindir).

## Kurallar ve sınırlar

- **Kim düzenler:** müdür her zaman; öğretmen yalnız "Yemek listesini düzenler" yetkisiyle. Veli, öğrenci ve servisçi hiçbir
  koşulda (bu yetki onlara verilemez). Hesap onaylı olmalı. Düğme yalnız sunucu "düzenleyebilir" derse çizilir; yetkisiz biri yine
  de istek gönderirse sunucu **"Yemek listesini düzenleme yetkin yok"** der.
- **Hangi okul:** yalnız kendi okulun. Velinin ve başka okulun menüsü düzenlenmez.
- **Kaç gün:** pencere her seferinde haftanın yedi gününü birlikte gönderir. Sunucu bir seferde 1–31 gün kabul eder; boş istek ya
  da 31'den fazlası **"Bir seferde 1-31 gün kaydedilebilir"**.
- **Hangi tarihler:** bugünden 60 gün öncesi ile 400 gün sonrası arası. Dışındaki bir haftayı kaydetmeye çalışırsan
  **"Tarih bu yılın dışında"** çıkar ve hiçbir gün kaydedilmez (ör. üç ay önceki bir haftayı artık düzenleyemezsin). Bozuk tarih
  **"Geçersiz tarih"** (yalnız elle gönderilen istekte olur).
- **Menü metni:**
  - kutuya en çok 500 karakter yazılır;
  - her satırın başındaki ve sonundaki boşluk silinir, boş satırlar atılır;
  - her satır 120 karakterde kesilir;
  - bir günde **en çok 8 satır** tutulur: 9. satır ve sonrası uyarısız atılır;
  - toplam 500 karakteri geçerse **"Bir günün menüsü çok uzun"** (pencereden yazarken bu sınıra zaten varılmaz).
- **Boş gün:** kayıtlı menüsü kalorisiyle birlikte silinir. Menüsü boş bir güne yazılan kalori saklanmaz.
- **Hepsi ya da hiçbiri:** bir gün hatalıysa hiçbir gün kaydedilmez; yedi gün tek işlemde yazılır.
- **Aynı anda iki kişi:** iki yetkili aynı haftayı aynı anda düzenlerse sonra "Kaydet"e basanın yedi günü geçerli olur; uyarı yok.
- **İşlem kaydı:** her kayıtta okulun işlem kaydına "Yemek listesi kaydedildi" ve gün sayısı ("7 gün") yazılır; kimin kaydettiği
  görünür ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Bildirim:** menü kaydedilince kimseye bildirim gitmez.
- **Eğitim yılı:** menü yıla bağlı değil; yıl seçicide geçmiş bir yıla bakarken de kaydedilir (geçmiş yılın salt okunur kuralı
  ödev, sınav, yoklama, takvim ve ders programı içindir).
- **Bölüm kapalıysa** düzenlenemez: "Yemek listesi bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."
- **Kayıt yeri:** her okul için gün başına bir satır (okul, tarih, menü, kalori); okul silinirse menüleri de silinir. Sistem
  yedeklerine girer.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yemek listesi](README.md)):

- [Haftanın yemek listesi](yemek-listesi.md) — kaydedilen menünün göründüğü yer.
- [Hafta gezgini](hafta-gezgini.md) — düzenlenecek haftaya geçmek.
- [Kalori](kalori.md) — kalori kutusunun kuralları.
- ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md) — bu pencereyi kimin açabileceği.
- [Çocukların okullarının menüsü](cocuklarin-okullari.md) — sayfada görünen ama düzenlenmeyen okullar.

**İlgili:**

- [Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md).
- [İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).
- [İçeri aktarım](../excel-aktarim/ice-aktarim.md) — yemek listesi bugün Excel'le yüklenmez.
- [Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `EYLEMLER['yemek-duzenle']`
  (pencere: `textarea.yMenu` `data-tarih` `maxlength="500"`, `input.yKalori` `min="1" max="5000"`; yalnız `okullar[0]`, yani
  kendi okulun), `EYLEMLER['yemek-kaydet']` (yedi kutuyu sırayla eşler, `POST /api/yemek { gunler: [{ tarih, menu, kalori }] }`,
  hata `#yMesaj`'a).
- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/yemek`: yetki (`yemek.yonet`, veli
  hariç), 1–31 gün, tarih aralığı, satır temizliği (120 / 8 / 500), kalori 1–5000 değilse boş, işlem kaydı `yemek.kaydedildi`,
  cevap `{ message: 'Yemek listesi kaydedildi.' }` (ön yüz göstermez).
- Depo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) — `yemekYaz(okulId, liste)`: tek işlem; boş
  menü satırı siler, dolu olan `ON CONFLICT (okul_id, tarih)` ile yazılır. Tablo `yemek_listesi` (şema 007,
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)); menü 1–500 karakter, kalori 1–5000.
- Yetki: [sunucu/yetki.md](../../sunucu/yetki.md) — `yemek.yonet` ("Okul hayatı" grubu). İşlem kaydı adı:
  [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`'yemek.kaydedildi': 'Yemek listesi kaydedildi'`).
- Geçmiş yıl kapısı: [sunucu/api.md](../../sunucu/api.md) (`arsivYazmasiMi` yemeği kapsamaz).
- Görünüm: `public/css/parcalar/26-anket-okul-hayati.css` — `.yemek-duzen` (menü + 96 piksellik kalori sütunu; dar ekranda tek
  sütun).
- Testler: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) (öğrenci ve yetkisiz öğretmen 403, müdür yazar, boş
  satırların atılması, kalori, boş menünün silmesi, bozuk tarih ve 32 gün 400, yetki verilen öğretmen yazar; satır/uzunluk
  sınırları ve tarih aralığı denenmiyor), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (`POST /api/yemek`: yedi
  kimlikten yalnız müdür geçer; öğretmen, öğrenci, veli, yönetici, servisçi ve giriş yapmamış geçemez).

## Sık sorulanlar

- **Bir günün menüsünü nasıl silerim?** "Bu haftayı düzenle" → o günün kutusunu boşalt → "Kaydet".
- **Kaydettim ama bazı yemekler listede yok.** Bir günde en çok 8 satır tutulur; fazlası uyarısız atılır. Uzun satırlar da 120
  karakterde kesilir. Yemekleri birleştir ya da kısalt.
- **Kaydet'e bastım, "kaydedildi" yazmadı.** Normal: pencere kapanıp kartlar yeni menüyle çizildiyse kayıt tamam.
- **Gelecek ayın menüsünü önceden girebilir miyim?** Evet; "Sonraki hafta" ile her haftaya geçip ayrı ayrı gir (400 gün sonrasına
  kadar).
- **Aylık listeyi tek seferde ya da Excel'le yükleyebilir miyim?** Bugün hayır; ekran haftalık çalışır.
- **"Tarih bu yılın dışında" çıktı.** Düzenlediğin hafta 60 günden eski (ya da 400 günden ileri). Eski haftalar yalnız görünür.
- **Öğretmene nasıl düzenletirim?** ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md).

## Sırada

- Çalışan olarak ekleme: öğretmen olmayan çalışan da görevindeki yetkiyle düzenleyecek.
- Özel roller: yeni hazır şablon "Okul Sekreteri / Memur" bu yetkiyi taşıyacak (öneri, onay bekliyor).
- Çok dil: ipucu, etiketler ve gün adları çeviri kataloğuna girecek.
