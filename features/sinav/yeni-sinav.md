# Sınavlar · Yeni sınav açma

**Durum:** Kodda var; tasarımda ek olarak üç adımlı "Sınav aç" penceresi (şablon kartları, ders ve sınıf seçimi, tarih ve saat, süre, konular, ölçüm tablosu, "okulun şablonu olarak da kaydet", sonuçların görünmesi) ve "Sınavı düzenle".

Bir sınavın kaydını açan pencere: adı, tarihi, şablonu (değer alanları) ve isteğe bağlı grubu burada seçilir.

## Ne işe yarar

Sınav açılmadan değer girilemez: sınav, öğrencilerin hangi alanlara (Puan, Doğru, Yanlış, Net, LGS Puanı …) değer alacağını
ve bu değerlerin hangi tarihe ait olduğunu tutan kaptır. Kullanıcı 2 Ekim'de **"sınav ve sınav grubu aç da preset seç vb ui
yok hepsinin ui ı ayrı olcak"** dedi: tasarımda sınav açmak kendi penceresiyle, önce şablon (preset) seçilerek yapılır.
1 Ekim'de de "ilk tarih bizim sınav olmadan önce kaydını girdiğimiz" dedi: sınavın tarihi (ve tasarımda saati) açılırken
girilir, sonucun yazıldığı an ayrıca tutulur ([Sınav ayrıntısı](sinav-ayrintisi.md)).

## Nereden açılır

- **Öğretmen ve müdür (bugünkü site):** "Sınavlar" sayfasının **"Sınavlarım"** sekmesinde **"Yeni sınav"** düğmesi; bir
  grubun ekranında **"Sınav ekle"** (pencere o grup seçili açılır). İki düğme de yalnız "Sınav oluşturur" yetkin varsa
  görünür.
- **Tasarımda:** öğretmenin "Sınavlar" sayfasında sağ üstteki **"Sınav aç"**; müdürün "Okul düzeni → Sınavlar" sayfasında
  **"Sınav aç"** ([Okulun sınavları](okulun-sinavlari.md)). Kendi açtığın sınavın satırındaki **"Düzenle"** (önizlemede hem
  gelecek hem olmuş sınavda) aynı pencereyi dolu açar.

## Adım adım

### Öğretmen

**Bugünkü site: "Yeni sınav" penceresi**

1. **"Yeni sınav"**e bas. Pencere başlığı **"Yeni sınav"**.
2. **"Sınav adı"** — en çok 100 karakter, yer tutucu "1. Yazılı". Zorunlu.
3. **"Tarih"** — tarayıcının tarih kutusu; bugün dolu gelir. Saat yoktur.
4. **"Şablon"** — açılır liste: önce okulun şablonları (ör. "Yazılı (0-100)"), sonra okulda henüz olmayan hazır şablonlar
   **"… (hazır)"** diye ("LGS Denemesi (hazır)"). İlk seçenek seçili gelir. Altında ipucu: **"Değer alanlarını şablon belirler.
   Sonradan sınava yeni alan da ekleyebilirsin."** Hazır bir şablon seçersen o şablon bu sınavla birlikte okula da eklenir
   ([Şablonlar](sablonlar.md)).
5. **"Grup"** — **"Grupsuz"** ya da senin sınav gruplarından biri. Grubun ekranındaki "Sınav ekle"den geldiysen o grup seçili.
6. **"Etki oranı (%)"** — 50 dolu gelir; ipucu: **"Yalnızca bir gruba eklersen kullanılır: sınavın grup ortalamasındaki
   ağırlığı."** "Grupsuz" seçiliyken bu kutu görünür ama gönderilmez.
7. **"Vazgeç"** ya da **"Aç ve değer gir"**. Başarılıysa pencere kapanır ve sınavın değer tablosu hemen açılır
   ([Not (değer) girişi](not-girisi.md)).
8. Hata olursa pencerenin içinde kırmızı yazı çıkar (aşağıda "Kurallar ve sınırlar").

Sınavın **dersi** pencerede sorulmaz: gruba koyduysan grubun dersi, koymadıysan senin branşın olur.

**Tasarımda: "Sınav aç" penceresi (Tasarım 1 önizlemesi)**

1. **"Sınav aç"**a bas. Pencere başlığı **"Sınav aç"**.
2. **"1. Şablon"** — yanında "Ölçümleri hazır getirir; sonra değiştirebilirsin". Şablonlar kart kart dizilir; her kartta ad,
   kısa açıklama ve ölçüm kodları:
   - "Yazılı (0–100)" — "Tek puan" — P
   - "Test (D/Y/B/N)" — "Doğru, yanlış, boş; net = D − Y/4" — D · Y · B · N
   - "LGS Denemesi" — "90 soru; net = D − Y/3; LGS puanı" — D · Y · B · H · N · NY · LGS
   - "Quiz (0–10)" — "Kısa sınav" — P
   - "Sözlü / performans" — "Ölçütlü puan" — K · S · T
   - "Proje" — "Fikir, uygulama, sunum" — F · U · S · T
   - okulun kendi şablonları, adın yanında küçük **"okulun"** rozetiyle (önizlemede "7. sınıf ortak deneme" — "Okulun
     şablonu" — TR · MAT · FEN · TOP)
   - "Boş (serbest)" — "Ölçümleri kendin eklersin" — "—"

   Şablon seçmeden önce pencerede yalnız **"Bir şablon seç; ölçümler ve aralıkları gelir."** ve **"Vazgeç"** vardır.
   Şablonların ayrıntısı: [Şablonlar](sablonlar.md).
3. **"2. Bilgiler"**:
   - **"Sınav adı"** — yer tutucu "ör. 1. dönem 1. yazılı". Ad boşken "LGS Denemesi" seçilirse "LGS deneme sınavı" kendiliğinden
     yazılır.
   - **"Ders"** — açılır liste: Matematik, Türkçe, Fen Bilimleri, Sosyal Bilgiler, İngilizce, **"Ortak (birden çok ders)"**
     (okul kendi derslerini açınca liste okulun dersleri olur, [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md)).
   - **"Sınıflar"** — ders verdiğin sınıflar çip çip (ör. "7-A", "7-C", "8-B"); birden çok seçilebilir.
   - **"Tarih ve saat"** — tarih-saat kutusu (geçmiş bir an seçilemez) ve yanında süre kutusu (5–240, 40 dolu) + "dakika";
     altında **"Sınavdan önce girdiğin tarih. Sonuç tarihi, değerler yazılınca kendiliğinden kaydedilir."**
   - **"Sınav grubu"** — **"Gruba koyma"** ya da gruplarından biri ([Sınav grupları](sinav-gruplari.md)).
   - **"Konular"** — ortak yazı düzenleyicisi (kalın, liste, bağlantı …) ([Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md)).
4. **"3. Ölçümler"** — yanında "Sıra · kod · ad; hesaplanan ölçüm formülle (kodlarla) yazılır". Şablonun ölçümleri tabloda
   gelir; "Sıra · Kod · Ad · Tür · Formül · Aralık · Ana · Örnek" sütunları, satır silme, **"Ölçüm ekle"**
   ([Ölçümler ve formül](olcumler-ve-formul.md)).
5. **"Şablon"** — **"Bu ölçümleri okulun şablonu olarak da kaydet"** kutusu; işaretlenince altında **"Şablonun adı"** kutusu.
6. **"Sonuçlar"** — **"Değer girilince öğrenci ve veli hemen görsün"** kutusu, işaretli gelir ([Sonuç bildirimi](sonuc-bildirimi.md)).
7. **"Salon ve koltuk"** bölümü (öğretmende) — salon çipleri, "Otomatik / Elle" koltuk ([Sınav planlama](sinav-planlama.md)).
8. **"Vazgeç"** ya da **"Sınavı aç"**. Eksik varsa pencerenin altında kırmızı ileti çıkar ve pencere o satıra kayar; sıra:
   1. **"Sınavın adını yaz."**
   2. **"En az bir sınıf seç."**
   3. **"En az bir ölçüm ekle."**
   4. **"Kırmızı satırlardaki ölçümleri düzelt."**
   5. **'Bir ölçümü "Ana" seç (sonuç olarak görünen).'**
   6. **"Şablonun adını yaz."** (kutu işaretliyse)
   7. **"Sınavın tarihini ve saatini seç."**
   8. **"En az bir salon seç."**, **"Seçili salonlara 52 öğrenci sığmıyor; salon ekle."**, **"Elle koltukta eksik ya da aynı
      sıra var; kırmızı satırları düzelt."** (salon ve koltuk bölümü)
9. Başarılıysa pencere kapanır, kısa ileti: **"Sınav açıldı: 1. yazılı · 7-A, 7-C · 15 Ekim 10:00 · Derslik 208, Derslik 210."**
   Birden çok sınıf seçtiysen her sınıf için ayrı bir sınav açılır ve listede ayrı satırlar olur ("7-A · 1. yazılı",
   "7-C · 1. yazılı"). Şablon olarak kaydettiysen şablon "okulun" rozetiyle listeye eklenir.

**Tasarımda: sınavı düzenlemek**

1. Kendi açtığın sınavın satırında (gelecek ya da olmuş) **"Düzenle"**: pencere başlığı **"Sınavı düzenle"**, her şey dolu; düğme **"Sınavı aç"** yerine
   **"Kaydet"**. Sınıf değiştirilemez: seçili olmayan sınıf çipleri kapalıdır, üstüne gelince **"Düzenlerken sınıf değişmez"**.
2. "Kaydet" → **"Sınav güncellendi: 7-A · 1. yazılı"**; tarih ya da saat değiştiyse sonuna **" · tarih değişti; öğrencilere
   ve velilere bildirim gitti"** eklenir.

### Müdür

- Bugünkü sitede pencere öğretmeninkiyle aynıdır; sınavın dersi grubun dersi, grupsuzsa senin branşın, branşın yoksa
  **"Müdür"** olur (öğrencinin bildiriminde de "Müdür dersinden …" yazar).
- Tasarımda "Okul düzeni → Sınavlar"daki **"Sınav aç"** aynı üç adımlı penceredir; "Sınıflar"da okulun sınıfları çıkar ve
  "Ders"in hemen altına **"Notları girecek öğretmen(ler)"** bölümü eklenir ([Okulun sınavları](okulun-sinavlari.md)).
  Önizlemede müdürün penceresinde salon ve koltuk bölümü yoktur; başarı iletisi **"Sınav açıldı: 1. yazılı · 7-A · 15 Ekim
  10:00"** (şablon kaydedildiyse sonuna " · şablon kaydedildi").

### Çalışan

- Bugünkü sitede "Sınav oluşturur" yetkisi olan her öğretmen hesabı sınav açar. Yetki yalnız bir ek rolden geliyor ve rol
  derslere daraltılmışsa, başka dersin sınavında sunucu **"Türkçe dersinde sınav açma yetkin yok"** gibi bir iletiyle reddeder
  ([Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md)).
- Tasarımda: Öğretmen rolü verilmiş çalışan öğretmen gibi açar; rolsüz çalışan açamaz.

## Kurallar ve sınırlar

- **Ad:** zorunlu, en çok 100 karakter. Boşsa **"Sınav adı gerekli"**.
- **Yetki:** "Sınav oluşturur" yoksa **"Sınav açma yetkin yok"**; sınavın dersi yetkinin kapsamı dışındaysa **"<ders> dersinde
  sınav açma yetkin yok"** (ör. "Matematik dersinde sınav açma yetkin yok").
- **Grup:** başkasının grubu ya da olmayan grup **"Sınav grubu bulunamadı"**. Gruba konan sınavda etki oranı 0'dan büyük, en
  çok 100 olmalı: **"Etki oranı 0'dan büyük, en fazla 100 olmalı"** (virgüllü yazılabilir: "33,5"). Etki oranı ve grup
  sonradan değiştirilemez (bugün bunun için düğme ve uç yok).
- **Şablon:** başka okulun ya da silinmiş şablon **"Şablon bulunamadı"**; bilinmeyen hazır şablon **"Hazır şablon
  bulunamadı"**. Hiç şablon seçilmezse sunucu hazır "Yazılı (0-100)"u kullanır.
- **Tarih:** boşsa bugün (sunucunun günü); gün-ay-yıl geçersizse **"Tarih geçersiz"**. Bugünkü sitede saat tutulmaz.
- **Ölçümler kopyalanır:** sınav açılırken şablonun alanları sınava kopyalanır; şablon sonradan değişse de bu sınav bozulmaz,
  sınavın alanlarını değiştirmek de şablonu etkilemez ([Ölçümler ve formül](olcumler-ve-formul.md)).
- **Yıl:** sınav açıldığı eğitim yılına damgalanır; geçmiş yıla bakarken açılamaz (409, "Geçmiş bir eğitim yılına bakıyorsun;
  kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön.").
- **Tasarımda:** ders seçilir (bugünkü sitedeki "dersi seçilemez" açığı kapanır); tarih saatle birlikte (Türkiye saati) ve
  süreyle girilir; sınav bir ya da birden çok sınıfa açılır, her sınıf ayrı sınav olur; ana ölçüm seçmek zorunludur;
  kodlar ve formüller kaydetmeden önce denetlenir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Şablonlar](sablonlar.md), [Ölçümler ve formül](olcumler-ve-formul.md) — pencerenin şablon ve ölçüm bölümleri.
- [Sınav grupları](sinav-gruplari.md) — "Grup" / "Sınav grubu" seçimi ve etki oranı.
- [Sınav planlama](sinav-planlama.md) — tarih, saat, süre, salon ve koltuk.
- [Okulun sınavları](okulun-sinavlari.md) — müdürün "Notları girecek öğretmen(ler)" bölümü.
- [Not (değer) girişi](not-girisi.md) — "Aç ve değer gir"in açtığı tablo.
- [Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md) — "Değer girilince öğrenci ve veli hemen görsün".
- [Sınavlar listesi](sinavlar-listesi.md).

**İlgili:**

- [Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md) — "Konular" alanı.
- [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md) — "Ders" listesi.
- [Takvime ekle](../takvim/etkinlik-ekleme.md), [Ajanda](../takvim/ajanda.md) — tasarımda açılan sınav takvime ve ajandaya girer.

## Kod tarafı

- Ön yüz: [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) — `EYLEMLER['sinav-yeni']`
  (pencere), `EYLEMLER['sinav-kaydet']` (gövde `{ name, tarih, templateId | hazir, groupId?, weight? }`), `sinavAc`.
- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `POST /api/exams` (ad, yetki, grup ve etki oranı,
  ölçümler şablondan / elle / hazır "Yazılı", `tarihDogrula`, ders, yıl damgası), `hazirSablon`; depo
  [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`ekle`: sınav ve ölçüm kopyası tek işlemde); yetki
  [sunucu/yetki.md](../../sunucu/yetki.md) (`sinav.olustur`); ders [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`branchOf`).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (grupsuz sınav, grupta etki oranının şart olması, hazır şablonla
  açma).

## Sık sorulanlar

- **Sınavın dersini nereden seçiyorum?** Bugünkü sitede seçilmez: grubun dersi ya da senin branşın olur. Başka bir dersin
  sınavını açacaksan önce o dersin grubunu açıp sınavı o gruba koy (müdür grup açarken ders seçebilir). Tasarımda pencerede
  "Ders" var.
- **Sınava saat yazabilir miyim?** Bugün hayır, yalnız gün. Tasarımda tarih ve saat birlikte girilir, süresi de yazılır.
- **Yanlış şablonla açtım.** Sınavın alanlarını "+ Yeni değer ekle / alanları düzenle" ile değiştirebilirsin; şablon etkilenmez.
- **Etki oranını yanlış yazdım.** Bugün sonradan değiştirilemiyor; sınavı silip yeniden açman gerekir (girilmiş değerler de
  gider). Tasarımda paylar grup ekranındaki kaydırıcılarla ayarlanır.

## Sırada

- Sınav: formüllü ölçüm + notları Excel'den yükleme/indirme + sınav grubu üst değeri (iş 14): ölçüm türü (elle / hesaplanır),
  formül, sıra numaralı kodlar.
- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama (iş 8): tarih + saat + süre, sınıflar, salon ve koltuk, düzenleme.
- Arayüz önizlemesi (Tasarım 1) koda geçerken: üç adımlı "Sınav aç" penceresi, "Ders" ve "Sınıflar" seçimi, "Konular".
- Düzenleyiciler (iş 15): "Konular" alanında ortak yazı düzenleyicisi.
- Özel branş / ders (iş 36): "Ders" listesinin okulun dersleri olması.
