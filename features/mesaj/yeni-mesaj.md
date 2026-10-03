# Mesajlar · Yeni mesaj ve alıcı seçimi

**Durum:** Kodda var; tasarımda ek olarak türlere basılan çipli alıcı seçici ("Öğretmenler / Sınıflar / Veliler / Öğrenciler / Yönetim"), "Başlık:" ve "Açıklama:" alanları, ortak yazı düzenleyici, etiket, şablon, gönderim zamanı ve "Yanıtla" (Tasarım 1 önizlemesi).

"Yeni mesaj" penceresi: kime yazacağını seçer, konuyu ve metni yazar, istersen dosya ekleyip gönderirsin.

## Ne işe yarar

Okul içinde birine ya da (yetkin varsa) bir sınıfa, bir rol grubuna ya da bütün okula yazmak için. Öğrenciye yazılan her
mesaj onaylı velisine de gider (kullanıcı 29 Ağustos: "bir öğrenciye gelen mesaj veliye de gelecek"). Öğrenci ve veli okulun
bütün rehberini görmez; yalnız ilgili öğretmenleri ve müdürü görür.

## Nereden açılır

"Mesajlar" → sağ üstte **"Yeni mesaj"**. Tasarımda ayrıca açık mesajın penceresindeki **"Yanıtla"**.

## Adım adım

### Öğretmen ve müdür — bugünkü site

1. **"Yeni mesaj"**e bas; **"Yeni mesaj"** başlıklı pencere açılır.
2. Duyuru yetkin varsa en üstte seçim: **"Kişisel mesaj"** (seçili gelir) / **"Duyuru (cevaplanmaz, herkese ulaşır)"**
   ([Duyuru](duyuru.md)).
3. **"Kime"** açılır listesi:
   - **"Seçtiğim kişilere"** (herkeste),
   - **"Sınıflara"** ve **"Rol grubuna"** (yalnız "Sınıfa veya gruba toplu mesaj atar" yetkisi olana),
   - **"Tüm okula"** (yalnız "Okuldaki herkese mesaj atar" yetkisi olana). Müdürde hepsi açıktır.
4. **Kişiler:** **"Kişi ara"** kutusuna (yer tutucu "Ad yaz") adın bir parçasını yaz; altında en çok 60 kişi listelenir. Her
   satırda onay kutusu, ad, rol (öğretmende branşı da: "Öğretmen · Matematik"). Mesaj almayı kapatmış ya da seni engellemiş
   kişi soluk ve seçilemez: **"· mesaj almıyor"**. Eşleşme yoksa **"Eşleşen kişi yok."** Aramayla gizlenen seçili kişi seçili kalır.
5. **Sınıflar:** her sınıf bir onay kutusu, ör. **"7-A (28 öğrenci)"**; mesaj seçilen sınıfların öğrencilerine (ve velilerine) gider.
6. **Rol grubu:** **"Öğrenciler"**, **"Veliler"**, **"Öğretmenler"** kutuları.
7. **Tüm okul:** bilgi kutusu **"Mesaj okuldaki herkese gidecek."**
8. **"Konu"** (yer tutucu "Kısa bir başlık", en çok 120) ve **"Mesaj"** (yer tutucu "Yazmak istediklerin", en çok 4000; altında
   **"0 / 4000"** sayacı).
9. İstersen dosya ekle ([Mesaj ekleri](ekler.md)).
10. **"Gönder"**: pencere kapanır, sayfa yenilenir, üstte sunucunun iletisi: **"Mesaj gönderildi — 3 kişiye ulaştı."** (duyuruda
    **"Duyuru yayımlandı — 120 kişiye ulaştı."**); mesaj almayı kapatmış kişi elendiyse sonuna **" 1 kişi mesaj almayı
    kapatmış."** eklenir. **"Vazgeç"** pencereyi kapatır.

### Öğrenci ve veli — bugünkü site

1. Aynı pencere; ama yalnız **"Kime: Seçtiğim kişilere"** vardır, duyuru seçimi yoktur.
2. Kişi listesinde yalnız:
   - **öğrencide:** kendi sınıfının derslerine atanmış öğretmenler ve okulun müdürü (öğrenci öğrenciye yazamaz);
   - **velide:** çocuklarının sınıflarının derslerine atanmış öğretmenler ve müdür.
3. Konu, metin, ek ve "Gönder" aynı.

### Servisçi — bugünkü site

"Yeni mesaj" görünür ama kişi listesi boştur (**"Eşleşen kişi yok."**); konu ve metin yazıp "Gönder"e basarsan **"En az bir
kişi seç"** hatası alırsın. Servisçinin velilere bugünkü yolu servis notlarıdır ([Günlük not](../servis/gunluk-not.md);
öğrenciye ya da bütün servise, velilere bildirimle).

### Tasarımda (Tasarım 1 önizlemesi)

1. Pencere **"Yeni mesaj"** (yanıtta **"Yanıtla"**). Satırlar: **"Alıcı:"**, **"Başlık:"** (yer tutucu "Başlık"),
   **"Etiket:"** ([Etiketler](etiketler.md)), **"Şablon:"** ([Hazır şablonlar](hazir-sablonlar.md); öğrencide yok),
   **"Açıklama:"** ve altında ortak yazı düzenleyicisinin araç çubuğu ([Yazı düzenleyici](../yazi-yazma/README.md)),
   **"Gönderim:"** ([İleri tarihli gönderim](ileri-tarihli-gonderim.md); öğrencide yok), açılır **"Ekler (0)"** kutusu, onay
   kutusu **"Alıcılar bu mesaja dosya yükleyebilsin"** ([Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md)) ve altta
   geniş **"Gönder"**.
2. Öğretmende ve müdürde ayrıca **"Alıcıların ajandasına ekle"** anahtarı ve **"Hatırlatıcı:"** çipleri
   ([Ajandaya ve hatırlatıcıya ekle](ajandaya-ve-hatirlaticiya-ekle.md)); öğretmende **"Anket:"** satırında **"Anket ekle"**
   ([Ödeve ve mesaja anket](../anket/odeve-mesaja-ekleme.md)). Müdürde en üstte **"Tür:"** **"Mesaj"** | **"Duyuru"** ([Duyuru](duyuru.md)).
3. **Alıcı seçici:**
   - Seçilenler kutunun içinde çip olur; her çipte kişi sayısı (grupta, ör. "28 kişi") ve **"×"** (çıkarır).
   - Arama kutusu: **"Kişi, sınıf ya da grup ara"** (bir alıcı seçtikten sonra **"Bir alıcı daha ara"**). Yazınca bütün
     türlerde aranır, sonucun yanında türü yazar; bulunamazsa **"\"…\" bulunamadı."** Enter ilk sonucu ekler; arama boşken
     geri silme (Backspace) son çipi çıkarır.
   - Tür çipleri (role göre):
     - **öğrenci:** "Öğretmenler" (kendi öğretmenleri ve sınıf öğretmeni) · "Yönetim" (müdür, müdür yardımcısı);
     - **veli:** "Öğretmenler" (çocuğunun öğretmenleri) · "Yönetim" · "Servis" (çocuğunun servisçisi);
     - **servisçi:** "Veliler" (servisindeki velilerin hepsi tek satırda, ör. "Servis 3 velileri · 22 kişi", ya da tek tek) · "Yönetim";
     - **öğretmen:** "Öğretmenler" · "Sınıflar" ("7-A öğrencileri") · "Veliler" ("7-A velileri") · "Öğrenciler" · "Yönetim"
       (sınıf ve veli satırlarında yalnız girdiği sınıflar);
     - **müdür:** öğretmendekiler + "Bütün öğretmenler", "Bütün veliler" ve okulun bütün sınıfları.
   - Altta özet: **"Mesaj 28 kişiye gidecek"** ya da **"Henüz alıcı seçmedin"**.
4. "Gönder"de denetim: alıcı yoksa **"En az bir alıcı seç: yukarıdaki türlere bas ya da ara."**; başlık boşsa **"Mesajın
   başlığını yaz."** Başarıda pencere kapanır, **"Mesaj 28 kişiye gönderildi."** yazar ve mesaj "Gönderilen"e düşer (ileri
   tarihliyse "Planlanan"a).
5. **"Yanıtla"**: alıcı gönderen olarak hazır gelir, başlık **"Ynt: <konu>"**.

## Kurallar ve sınırlar

- **Kime yazabilirsin (bugün, sunucuda):**
  - müdür ve öğretmen: okulun onaylı herkesi (kendisi hariç);
  - öğrenci: kendi sınıfının derslerine atanmış öğretmenler + müdür; veli: çocuklarının öğretmenleri + müdür;
  - servisçi ve yönetici: kimse.
  - Seçilen kişi listende yoksa **"Seçtiğin kişilere yazma yetkin yok"**; hiç kişi seçilmediyse **"En az bir kişi seç"**.
- **Toplu ve bütün okul:** "Sınıflara" ve "Rol grubuna" için **"Sınıfa veya gruba toplu mesaj atar"** yetkisi
  ("Toplu gönderme yetkin yok"), "Tüm okula" için **"Okuldaki herkese mesaj atar"** ("Tüm okula gönderme yetkin yok") gerekir.
  Müdürde ikisi de vardır; hazır şablonlardan Müdür Yardımcısı'nda ikisi, Rehber Öğretmen ve Zümre Başkanı'nda yalnız toplu
  mesaj vardır; okulun hazır Öğretmen rolünde ikisi de yoktur ([Yetki listesi](../roller-yetkiler/yetki-listesi.md),
  [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md)). Tasarım 1 önizlemesinde Öğretmen rolünde toplu mesaj açık gelir.
  Sınıf seçmeden: **"En az bir sınıf seç"**, sınıflar okulda değilse **"Sınıf bulunamadı"** (en çok 100 sınıf); rol seçmeden
  **"En az bir rol seç"**; tanınmayan hedef **"Geçersiz hedef"**.
- **Alıcının ayarı:** kişisel mesaj alıcının "Bana kim yazabilir?" ayarına ve engel listesine takılır; takılan elenir ve
  iletinin sonunda sayılır. Hepsi elenirse **"Alıcı kalmadı. Seçtiğin kişiler mesaj almayı kapatmış olabilir."** Duyuru bu
  ayarlara takılmaz ([Bana kim yazabilir](bana-kim-yazabilir.md)).
- **Veliye kopya:** alıcılardaki her öğrencinin onaylı velileri de alıcı olur ([Velinin kopyası](velinin-kopyasi.md)).
- **Boş alan:** konu boşsa **"Konu yaz"**, metin boşsa **"Mesaj metni boş olamaz"** (bugün pencere kendisi denetlemez, sunucu söyler).
- **Hız sınırı:** kişi başına saatte en çok 30 gönderme denemesi (**"Saatlik mesaj sınırına ulaştın. Biraz bekle."**); hatalı
  denemeler de sayılır. Tasarımda okul ayrıca öğrenci ve veli için günlük sınır koyar ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).
- **Dosya yüklenirken** "Gönder"e basarsan: **"Dosyalar yükleniyor; bitince gönder."**
- **Bildirim:** her alıcıya **"<gönderenin adı>: <konu>"** (duyuruda **"Duyuru: <konu>"**) bildirimi gider, telefonda da
  ([Bildirim metinleri](../bildirim/bildirim-metinleri.md), [Telefon bildirimi](../bildirim/telefon-bildirimi.md)); aynı kişiye tek bildirim.
- **Sayı:** "N kişiye ulaştı" veli kopyalarını da sayar; bir veli birden çok çocuğu için birden çok kez sayılabilir.
- **Bilinen açıklar** (kod okumasına göre):
  - "Tüm okula" ya da kendi rolünün grubuna ("Öğretmenler") gönderende gönderenin kendisi de listeye girip elendiği için
    ileti, kimse kapatmamış olsa bile **"1 kişi mesaj almayı kapatmış."** der.
  - Kişi araması şapkaya duyarlı: "ayse" yazınca "Ayşe" bulunmaz; yalnız ad aranır, branş aranmaz; 60'tan fazla eşleşmede ipucu
    yok; aramayla gizlenen seçili kişilerin sayısı ekranda yazmaz.
  - Rol grubunda "Yöneticiler" seçeneği yok (sunucu kabul eder).
  - Servisçide "Yeni mesaj" görünür ama kimseye yazamaz.
  - Çocuğu okulda olan öğretmen ya da müdür, alıcıları arasında kendi çocuğu bulunan bir mesaj gönderirse mesaj kendi gelen
    kutusuna da (veli kopyası olarak) düşer.

## Kardeşler ve ilgili

**Kardeşler:** [Duyuru](duyuru.md) · [Mesaj ekleri](ekler.md) · [Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md) ·
[Velinin kopyası](velinin-kopyasi.md) · [Bana kim yazabilir](bana-kim-yazabilir.md) · [Okulun mesaj ayarları](okulun-mesaj-ayarlari.md) ·
[Etiketler](etiketler.md) · [Hazır şablonlar](hazir-sablonlar.md) · [İleri tarihli gönderim](ileri-tarihli-gonderim.md) ·
[Ajandaya ve hatırlatıcıya ekle](ajandaya-ve-hatirlaticiya-ekle.md) · [Mesajı okuma](mesaj-okuma.md) (Yanıtla).

**İlgili:** [Yazı düzenleyici](../yazi-yazma/README.md) · [Nerelerde var](../yazi-yazma/nerelerde-var.md) ·
[Yetki listesi](../roller-yetkiler/yetki-listesi.md) · [Özel roller](../roller-yetkiler/ozel-roller.md) ·
[Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md) · [Ödeve ve mesaja anket](../anket/odeve-mesaja-ekleme.md) ·
[Bildirim metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) — `mesajYeniModal`
  (`GET /api/mesajlar/hedefler`), `mesajModalBagla` (kişi araması, 60 sınırı, panel değişimi, sayaç), `mesajGonderIslemi`
  (`POST /api/mesajlar`), `secililer`; [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) (`ekAlani`, `ekYukleniyor`, `ekIdleri`).
- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) — `GET /api/mesajlar/hedefler`, `POST /api/mesajlar`,
  `mesajYazilabilirler`, `mesajAlicilariCoz`, `mesajGidebilirMi`, `MESAJ_SAATLIK_SINIR`; [sunucu/yetki.md](../../sunucu/yetki.md)
  (`mesaj.toplu`, `mesaj.herkese`); [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`teachersOfStudent`);
  [sunucu/guvenlik.md](../../sunucu/guvenlik.md) (`hizSinir`).
- Depo: [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) (`ekle`: mesaj ve alıcılar tek işlemde),
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) (`ogrencininOgretmenleri`, `veliHaritasi`,
  `engelHaritasi`), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`topluBildir`).
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md), [testler/test-servis-konum.md](../../testler/test-servis-konum.md)
  (servisçinin listesi boş), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md), [testler/girdi-denetimi.md](../../testler/girdi-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kim ne yapar", "Yetki listesi").

## Sık sorulanlar

- **Öğretmenimi listede bulamıyorum.** Öğrenci ve veli yalnız sınıfın derslerine atanmış öğretmenleri görür; öğretmen derse
  atanmamışsa listede çıkmaz.
- **Birini seçemiyorum, "mesaj almıyor" yazıyor.** O kişi mesaj almayı kapatmış ya da seni engellemiş.
- **Bütün sınıfa yazamıyorum.** Bunun için "Sınıfa veya gruba toplu mesaj atar" yetkisi gerekir; müdürden iste.
- **Mesaj veliye de gitti mi?** Öğrenciye yazdığın her mesaj onaylı velilerine de gider; "N kişiye ulaştı" sayısında onlar da var.

## Sırada

- Mesaj tasarımı (Tasarım 1): çipli alıcı seçici, "Başlık:" / "Açıklama:", "Yanıtla".
- Düzenleyiciler: mesaj ve duyuru metni ortak yazı düzenleyicisiyle; hazır mesaj şablonları; ileri tarihli gönderim.
- Mesaj ayarları (çark): öğrenci ve velinin kime yazabileceği, günlük sınır, mesaja dosya ekleyebilenler.
- Mesaj etiketleri (Şikâyet, Önemli, Durum).
- Çalışan olarak ekleme: rolsüz çalışan Mesajlar'dan yönetime yazabilecek.
- Anket düzenleyici: anketin mesaja ek olarak konması.
