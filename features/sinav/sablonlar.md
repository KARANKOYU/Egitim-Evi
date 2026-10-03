# Sınavlar · Şablonlar

**Durum:** Kodda var; tasarımda ek olarak "Sınav aç"ın ilk adımında şablon kartları, sıra numaralı ve formüllü hazır şablonlar (Yazılı, Test, LGS Denemesi ve yenileri), şablonu "okulun" rozetiyle kaydetme.

Okulun hazır ölçüm listeleri: bir sınavın değer alanları (Puan; Doğru, Yanlış, Net; ders netleri ve LGS Puanı …) bir kez
tanımlanır, her sınavda yeniden yazılmaz.

## Ne işe yarar

Her yazılıda "Puan 0–100"ü, her denemede altı dersin netini ve LGS Puanı'nı yeniden yazmak hem yorucu hem hataya açık.
Şablon bunu bir kez tanımlar; sınav açarken seçilir. Şablon aynı zamanda grafiğin anahtarıdır: öğrencinin sınav grafiği
aynı şablonla yapılmış sınavları yan yana koyar ([Sınav grafiği](../ilerleyis/sinav-grafigi.md)). Kullanıcı 1 Ekim'de
**"presetlere preset değerler de olsun"** dedi: tasarımda her hazır şablon kendi sıra numaralı, adlı, aralıklı ve formüllü
ölçüm listesini getirir; okul kendi şablonunu da aynı biçimde kaydeder.

## Nereden açılır

- **Bugünkü site:** "Sınavlar" sayfasının **"Şablonlar"** sekmesi (öğretmen menüsünde "Sınavlar", müdürde "Kendi Derslerim →
  Sınavlar"). Şablon ayrıca **"Yeni sınav"** penceresindeki **"Şablon"** listesinden seçilir ([Yeni sınav açma](yeni-sinav.md)).
- **Tasarımda (Tasarım 1 önizlemesi):** ayrı bir "Şablonlar" sekmesi yok; şablonlar **"Sınav aç"** penceresinin **"1. Şablon"**
  adımında kart kart durur, okulun yeni şablonu aynı pencerede **"Bu ölçümleri okulun şablonu olarak da kaydet"** ile açılır.

## Adım adım

### Öğretmen

**Şablonlar sekmesi (bugünkü site)**

1. "Sınavlar" → **"Şablonlar"**.
2. Üstte **"Yeni şablon"** düğmesi ve ipucu: **"Şablon, bir sınavın değer alanlarıdır (Puan, Doğru, Yanlış, Net...). Okuldaki
   bütün öğretmenler kullanabilir; yalnızca açan kişi ve müdür değiştirir."**
3. **"Hazır şablonlar"** — okulda henüz aynı adla şablon yoksa çıkan kartlar. Her kartta şablonun adı, alanları küçük çipler
   hâlinde ("**Puan** 0 – 100"; ana alanın çipi vurgulu, üstüne gelince **"Ana değer: ortalamaya ve grafiğe girer"**) ve
   **"Okula ekle"** düğmesi. Üç hazır şablon:

   | Şablon | Alanlar (kod · ad · aralık) | Ana |
   |---|---|---|
   | **Yazılı (0-100)** | P · Puan · 0–100 | Puan |
   | **Test (Doğru / Yanlış / Net)** | D · Doğru · 0–100; Y · Yanlış · 0–100; N · Net · −100–100 | Net |
   | **LGS Denemesi** | TR · Türkçe Net · −10–20; MAT · Matematik Net · −10–20; FEN · Fen Bilimleri Net · −10–20; INK · İnkılap Tarihi Net · −5–10; DIN · Din Kültürü Net · −5–10; ING · İngilizce Net · −5–10; LGS · LGS Puanı · 100–500 | LGS Puanı |

4. **"Okula ekle"**ye basınca şablon okulun olur ve kart **"Okulun şablonları (N)"** altına geçer. Hazır şablonu "Yeni sınav"da
   "(hazır)" diye seçmek de aynı işi yapar.
5. **"Okulun şablonları (N)"** — okulun bütün şablonları. Kartta ad ve çipler; altta, değiştirebiliyorsan **"Düzenle"** ve
   kırmızı **"Sil"**, değiştiremiyorsan **"Açan öğretmen ya da müdür değiştirebilir."** Hiç yoksa **"Henüz şablon yok.
   Hazırlardan birini ekle ya da yenisini aç."**
6. Üst şeritteki "İçerik Ara" kutusu okulun şablon kartlarını adına göre süzer.

**Yeni şablon açmak**

1. **"Yeni şablon"** → pencere **"Yeni şablon"**.
2. **"Şablon adı"** — en çok 60 karakter, yer tutucu "Yazılı (0-100)". Zorunlu, okulda tek olmalı.
3. Değer alanları düzenleyicisi: tek satırla gelir ("Puan", 0–100, ana). Satır ekle / sil, ad ve aralık yaz, "Ana"yı seç
   ([Ölçümler ve formül](olcumler-ve-formul.md)).
4. **"Vazgeç"** ya da **"Kaydet"**. Başarılıysa pencere kapanır, sekme yeniden çizilir; hata pencerenin içinde kırmızı çıkar.

**Şablonu düzenlemek**

1. Kartta **"Düzenle"** → pencere **"Şablonu düzenle"**, ad ve alanlar dolu.
2. Pencerede ipucu: **"Değişiklik yalnızca bundan sonra açılan sınavlara uygulanır; eski sınavlar olduğu gibi kalır."**
3. **"Kaydet"**.

**Şablonu silmek**

1. Kartta **"Sil"** → tarayıcı onayı: **"Şablon silinsin mi? Bu şablonla açılmış sınavlar değerleriyle birlikte kalır."**
2. Şablon hiç kullanılmadıysa silinir. Kullanıldıysa silinmez; tarayıcı uyarısında **"Bu şablonla yapılmış 3 sınav var; öğrenci
   grafikleri bozulmasın diye silinemez. Adını ya da değer alanlarını değiştirebilirsin."** (Onay metni "kalır" dese de
   kullanılmış şablon hiç silinmez.)

**Tasarımda: "Sınav aç"ta şablon seçmek ve kaydetmek (Tasarım 1 önizlemesi)**

1. "Sınav aç" penceresinin **"1. Şablon"** adımı (yanında "Ölçümleri hazır getirir; sonra değiştirebilirsin"): her kartta ad,
   kısa açıklama ve ölçüm kodları; okulun şablonlarında adın yanında küçük **"okulun"** rozeti.
2. Bir karta basınca kart seçili olur ve ölçümleri **"3. Ölçümler"** tablosuna kopyalanır; tablodaki her şey değiştirilebilir.
   Başka karta basarsan tablo o şablonla yeniden dolar.
3. Kendi ölçüm listeni okula kalıcı kazandırmak istersen pencerenin altında **"Bu ölçümleri okulun şablonu olarak da kaydet"**i
   işaretle, **"Şablonun adı"**nı yaz. Ad boşsa **"Şablonun adını yaz."** Sınav açılınca şablon "okulun" rozetiyle kartlara
   eklenir (önizlemede kartlar "Boş (serbest)"in hemen önüne eklenir).
4. Önizlemedeki kartlar ve getirdikleri ölçümler (kod · ad · tür · aralık; ana ölçüm kalın):

   | Kart | Açıklaması | Ölçümler |
   |---|---|---|
   | Yazılı (0–100) | Tek puan | **P · Puan** · elle · 0–100 |
   | Test (D/Y/B/N) | Doğru, yanlış, boş; net = D − Y/4 | D · Doğru Sayısı · elle · 0–40; Y · Yanlış Sayısı · elle · 0–40; B · Boş Sayısı · elle · 0–40; **N · Net Sayısı** · hesaplanır `D - Y/4` · −10–40 |
   | LGS Denemesi | 90 soru; net = D − Y/3; LGS puanı | D · Doğru Sayısı · 0–90; Y · Yanlış Sayısı · 0–90; B · Boş Sayısı · 0–90; H · Hatalı Sayısı · 0–90; N · Net Sayısı · hesaplanır `D - Y/3` · −30–90; NY · Net Yüzdesi · hesaplanır `N / 90 * 100` · −34–100; **LGS · LGS Puanı** · elle · 100–500 |
   | Quiz (0–10) | Kısa sınav | **P · Puan** · elle · 0–10 |
   | Sözlü / performans | Ölçütlü puan | K · Katılım · 0–40; S · Sunum · 0–60; **T · Toplam** · hesaplanır `K + S` · 0–100 |
   | Proje | Fikir, uygulama, sunum | F · Fikir · 0–25; U · Uygulama · 0–50; S · Sunum · 0–25; **T · Toplam** · hesaplanır `F + U + S` · 0–100 |
   | 7. sınıf ortak deneme (okulun) | Okulun şablonu | TR · Türkçe neti · 0–20; MAT · Matematik neti · 0–20; FEN · Fen neti · 0–20; **TOP · Toplam net** · hesaplanır `TR + MAT + FEN` · 0–60 |
   | Boş (serbest) | Ölçümleri kendin eklersin | — |

5. **Tanımdaki hazır şablonlar** (kullanıcının 1 Ekim kararı, spec): ekranda ve Excel'de her ölçüm "sıra.kod ad" biçiminde
   görünür.
   - **Yazılı:** 01.P Puan (0–100).
   - **Test:** 01.D Doğru, 02.Y Yanlış, 03.B Boş, 04.N Net (= D − Y/4).
   - **LGS Denemesi:** 01.D Doğru Sayısı, 02.Y Yanlış Sayısı, 03.B Boş Sayısı, 04.H Hatalı Sayısı, 05.N Net Sayısı (= D − Y/3,
     hesaplanır), 06.N% Net Yüzdesi (= N / soru sayısı × 100, hesaplanır; soru sayısı şablonun sabiti), LGS puanı (elle; ana) ve
     bugünkü gibi ders ders netler (TR, MAT, FEN …).
   - Yeni şablonlar eski sınavları bozmaz.

### Müdür

- Bugünkü sitede okulun **bütün** şablonlarını düzenler ve siler (açan kim olursa olsun). Hazır şablonlar ("Okula ekle" ile
  eklenenler) okulun ortak şablonudur: ilk ekleyen öğretmenin olmaz, **yalnız müdür** değiştirir.
- Tasarımda "Sınav aç" penceresinde öğretmen gibi şablon seçer ve "okulun şablonu olarak da kaydet"i kullanır.

### Çalışan

- Bugünkü sitede her öğretmen hesabı (ek rolü ne olursa olsun) şablonları görür ve yeni şablon açar; "Okula ekle" de "Yeni
  şablon" da hiçbir sınav yetkisi istemez. Düzenleme ve silme yalnız şablonu açan kişide ve müdürdedir.
- Tasarımda Öğretmen rolü olan çalışan öğretmen gibi; rolsüz çalışan şablon görmez.

## Kurallar ve sınırlar

- **Ad:** zorunlu, en çok 60 karakter, okulda tek. Boşsa **"Şablon adı gerekli (örn: Yazılı (0-100))"**; aynı adla varsa **"Bu
  adla bir şablon zaten var"**.
- **Alanlar:** 1–30 alan, her birinin adı ve alt < üst aralığı (−10000 ile 10000 arası); tek ana alan. Hata iletileri
  [Ölçümler ve formül](olcumler-ve-formul.md#kurallar-ve-sınırlar)de.
- **Kim değiştirir:** şablonu açan kişi ve müdür. Başkası denerse **"Bu şablonu yalnızca açan kişi ya da müdür
  değiştirebilir"**. Hazır şablonun açanı yoktur: yalnız müdür. Şablonu açan öğretmenin hesabı silinirse şablon yine yalnız
  müdürün olur.
- **Görünürlük:** şablon okulundur; okuldaki bütün öğretmenler görür ve kullanır. Başka okulun şablonu **"Şablon bulunamadı"**.
- **Kopyalama:** sınav açılırken şablonun alanları sınava kopyalanır; şablonu değiştirmek eski sınavları değiştirmez, sınavın
  alanlarını değiştirmek de şablonu.
- **Silme:** yalnız hiç kullanılmamış şablon silinir; kullanılmış şablon grafik bozulmasın diye kalır (adı ve alanları
  değişebilir).
- **Eğitim yılı:** şablonlar yıla bağlı değildir; geçmiş bir yıla bakarken de açılıp düzenlenebilir (sınavlar salt okunurken).
- **Hazır şablon bir kez:** "Okula ekle" okulda aynı adla şablon varsa yenisini açmaz, var olanı kullanır; okulda o ad varsa
  hazır kart da görünmez.
- **Tasarımda:** kod sınav içinde tek ve büyük harfle başlar (en çok 6 karakter); ölçümlerin sırası sürükleyerek
  değiştirilebilir (tanım; önizlemede sürükleme yok); şablonun ölçümleri formülleriyle kaydedilir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Ölçümler ve formül](olcumler-ve-formul.md) — alan düzenleyicisi, kodlar, formül.
- [Yeni sınav açma](yeni-sinav.md) — şablonun seçildiği pencere.
- [Sınav ayrıntısı](sinav-ayrintisi.md) — tasarımda "Form:" satırı şablonun adıdır.
- [Excel'den not yükleme ve indirme](excelden-not.md) — Excel sütunları şablonun ölçümleridir.
- [Sınavlar listesi](sinavlar-listesi.md).

**İlgili:**

- [Sınav grafiği](../ilerleyis/sinav-grafigi.md) — grafik şablona göre çizilir.
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md).
- [Eklenti nedir](../eklentiler/eklenti-nedir.md) — tasarımda bir eklenti okula kendi sınav şablonunu getirebilir (dış sınav
  uygulamasından sonuç aktarımı).

## Kod tarafı

- Ön yüz: [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) — `sablonListesi`,
  `olcumCipleri`, `sablonModal`, `EYLEMLER['sablon-hazir']`, `['sablon-yeni']`, `['sablon-duzenle']`, `['sablon-kaydet']`,
  `['sablon-sil']`.
- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `HAZIR_SABLONLAR`, `hazirSablon`, `sablonDuzenleyebilir`,
  `GET/POST /api/exams/sablonlar`, `POST /api/exams/sablonlar/<id>`, `…/<id>/delete`; depo
  [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`sablonlar`, `sablonEkle`, `sablonGuncelle`,
  `sablonunSinavSayisi`, `sablonSil`); tablolar `sinav_sablonlari`, `sablon_olcumleri`
  ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (üç hazır şablon önerisi, hazır LGS'nin okula bir kez eklenmesi,
  elle şablon ve kod üretimi, aynı ad, başka öğretmenin değiştirememesi, şablonun okulun tamamına görünmesi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Sınav sistemi" (şablon tablosu).

## Sık sorulanlar

- **Hazır LGS şablonunu okula ekledim, neden düzenleyemiyorum?** Hazır şablonlar okulun ortak şablonudur; yalnız müdür değiştirir.
  Kendine ait bir kopya istersen "Yeni şablon" ile aç.
- **Şablonu değiştirdim, eski sınavlarım değişmedi.** Doğru: sınav açılırken alanlar kopyalanır; eski sınavlar olduğu gibi kalır.
- **Şablonu silemiyorum.** O şablonla açılmış sınav var; öğrenci grafikleri bozulmasın diye silinmez. Adını değiştirebilirsin.
- **Şablonsuz sınav açabilir miyim?** Bugünkü pencerede hep bir şablon seçilir (seçilmezse sunucu "Yazılı (0-100)"u kullanır);
  alanları sonradan değiştirebilirsin. Tasarımda "Boş (serbest)" kartı var; tanıma göre şablonsuz sınavın ayrıntısında "Form:" satırında "Serbest" yazar.

## Sırada

- Sınav: formüllü ölçüm + Excel + grup üst değeri (iş 14): hazır şablonların formüllü ve sıra numaralı gelmesi (Test'te
  N = D − Y/4; LGS'de D, Y, B, H, N = D − Y/3, N% ve LGS puanı), "Şablon olarak kaydet".
- Arayüz önizlemesi (Tasarım 1) koda geçerken: "Sınav aç"ın şablon kartları ve "okulun" rozeti.
- Eklentiler (iş 35, şimdilik yalnız belge): eklentinin getirdiği sınav şablonu.
