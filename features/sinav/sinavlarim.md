# Sınavlar · Sınavlarım

**Durum:** Kodda var; tasarımda ek olarak sınav satırları (ders rozeti, "Form:", tarih, sağda sonuç ya da "Sonuç yok"), "Yazılılar ve testler" / "Deneme sınavları" bölümleri, en üstte "Sınav grupları" satırı ve ayrıntı penceresi, satıra dokununca "Sınav ayrıntısı".

Öğrencinin sınav sonuçlarını, sınav grafiğini ve sınav gruplarını gördüğü sayfa; veli aynı sayfayı çocuğunun portalından görür.

## Ne işe yarar

Öğrenci "hangi sınavdan ne aldım, gidişim nasıl, dönem ortalamam ne" sorularının cevabını tek sayfada bulur. Sonuç girilir
girilmez burada görünür; ilk girişte bildirim de gelir ([Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md)). Kullanıcı 28
Eylül'de sınav grubunun öğrencide nasıl görüneceğini anlattı: **"sınav grubunun solunda orada çıkan sayı yazar; üzerine
tıklayınca ayrıntılar"**; 1 Ekim'de de bir sınava basınca açılan ayrıntı ekranını istedi ([Sınav ayrıntısı](sinav-ayrintisi.md)).

## Nereden açılır

- **Öğrenci:** sol menüde **"Sınavlarım"**; ana sayfada mavi **"Sınavlarım"** kutucuğu (alt yazısı "2 sınav grubu" gibi —
  yalnız grupları sayar). Adres `#/sinavlarim`. Sınav sonucu bildirimine dokununca da bu sayfa açılır.
- **Veli (bugünkü site):** "Çocuklarım"da çocuğun kartına basınca açılan çocuğun portalında menüde **"Sınavları"**. Velinin
  kendi menüsündeki **"İlerleyiş"** de çocuğun sınav kartlarını gösterir ([Velinin İlerleyiş sayfası](../ilerleyis/velinin-ilerleyis-sayfasi.md)).
- **Öğretmen ve müdür:** bir öğrencinin portalını **"Portalını aç"** ile açınca menüde **"Sınavları"**
  ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).
- **Tasarımda (Tasarım 1 önizlemesi):** öğrencinin menüsünde **"Sınavlarım"**; sayfa başlığı **"Sınavlarım"**, alt yazısı
  **"Sonuçlar açıklandıkça burada görünür"**. Ana sayfa kutucuğunun alt yazısı duruma göre ("yeni sonuç var"). Velinin
  menüsünde "Sınavları" yok; veli sınavları "İlerleyiş"teki "Son sınavlar"da, ana sayfada ve bildirimlerde görür.

## Adım adım

### Öğrenci

**Bugünkü site**

1. **"Sınavlarım"**ı aç. Başlık **"SINAVLAR"**, altında **"Sınav sonuçların, grafiğin ve ortalamaların."**
2. Hiç sonucun yoksa yalnız **"Henüz sınav sonucun yok."**
3. Sırayla:
   - **Sınav grafiği** — aynı şablonla yapılmış sınavlarının çizgi grafiği; şablonu ve ölçümü seçersin, "En düşük / en yüksek"
     bandı, "Grafik / Liste" ([Sınav grafiği](../ilerleyis/sinav-grafigi.md));
   - **"Sınavlar"** kartı — gruba konmamış sınavların, en yenisi üstte: adı, altında "25.09.2026 · Matematik · Ayşe Kaya", ana
     ölçüm dışındaki girilmiş ölçümler çip olarak ("**Türkçe Net** 12,5"), sağda etiket: ana ölçümün adı ve değeri ("LGS Puanı
     455,5"), yoksa gri "Değer yok" ([Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md));
   - her **sınav grubu** ayrı kart: grubun adı, "ders · öğretmen", **"Sınav · Etki · Not"** tablosu ve **"Grup ortalaması"**
     (**"100 üzerinden"**, çubuk, 50 ve üstü yeşil / altı kırmızı) ([Sınav grupları](sinav-gruplari.md#öğrenci)).
4. Üst şeritteki **"İçerik Ara"** kutusu "Sınavlar" kartındaki satırları ve grup kartlarını sınavın / grubun adına ve dersine göre süzer.
5. Satırlara dokunulmaz (ayrıntı penceresi yok).

**Tasarımda (Tasarım 1 önizlemesi)**

1. En üstte **"Sınav grupları"** bölümü: her grup bir satır; solda büyük grup sonucu ve küçük "/ 100" (üst değer), ortada grubun
   adı ("7-A · Matematik 1. dönem"), altında "öğretmen · 3 sınav · 1 tanesi sonuçlandı", sağda **"Ayrıntı"**; dokununca grup
   ayrıntı penceresi ([Sınav grupları](sinav-gruplari.md#öğrenci)).
2. Sonra **"Yazılılar ve testler"** ve **"Deneme sınavları"** bölümleri. Her sınav bir satır:
   - solda dersin kısaltması dersin renginde bir rozet içinde ("MAT", "İNG", "FEN", denemede "DNM");
   - ortada sınavın adı ("Matematik 1. yazılı");
   - altında **"Form: Yazılı (0–100) · 23 Eylül 09:20 (2. ders)"** (form = şablon; tarih, saat, ders numarası);
   - sağda ana ölçümün değeri ("82", "17,5", "488,888") ya da henüz sonucu olmayan (gelecek) sınavda **"Sonuç yok"**.
3. Satıra dokununca **"Sınav ayrıntısı"** penceresi: sınav, ders · öğretmen, form, sınav tarihi, sonuç tarihi, sıra numaralı
   ölçümler tablosu, **"Raporla"** ([Sınav ayrıntısı](sinav-ayrintisi.md)). Gelecek sınavda **"Sınav … tarihinde yapılacak."**
4. Önizlemede bu sayfada grafik yok; sınav grafikleri İlerleyişim'de ("Sınav sonuçları" sütun grafiği,
   [Sınav sonuçları sütun grafiği](../ilerleyis/sinav-sonuclari-grafigi.md)). Bugünkü çizgi grafiğin bu sayfada kalıp kalmayacağı
   kodlamada netleşir.
5. Okul dışında bir dershanede de öğrenciysen o kurumun portalında **"Deneme sınavları"** sayfası ayrıca durur
   ([Dershane portalında deneme sınavları](dershane-denemeleri.md)).

### Veli

**Bugünkü site**

1. "Çocuklarım" → çocuğun kartı → çocuğun portalı → **"Sınavları"**. Başlık **"SINAVLAR"**, altında **"Deniz Aydın adına
   görüntülüyorsun."**
2. Sayfa öğrencininkiyle aynıdır (grafik, "Sınavlar", grup tabloları). Boşsa öğrencideki gibi "Henüz sınav sonucun yok." yazar.
3. Kendi menündeki **"İlerleyiş"** sayfasında her çocuğun sınav kartları da var.
4. Çocuğun **eski okullarının** sınavlarını da görürsün (yıl seçicide o dönem seçilince); öğrencinin yeni okulu bunları görmez.

**Tasarımda (Tasarım 1 önizlemesi)**

- Her çocuk ayrı oturumdur (kullanıcının 3 Ekim kararı); velinin menüsünde "Sınavları" yok. Çocuğun sınavlarını **"İlerleyiş"**teki
  **"Son sınavlar"** listesinde ("Matematik 1. yazılı · 82", "Unit 2 quiz · 17,5", "LGS Deneme 1 · 488,888"), ana sayfadaki "Bugün
  olanlar" ("Matematik 1. yazılı · sonuç açıklandı · 82") ve "Yaklaşanlar"da ("15 Eki · Fen 1. yazılı"), bildirimlerde görürsün;
  dokununca "Sınav ayrıntısı" açılır.
- Önizleme velide sınav grubu sonucunu çizmedi; tanıma göre veli çocuğunun grup sonucunu da görür. Nerede göreceği (menüye
  "Sınavları" eklenmesi ya da İlerleyiş'te bir bölüm) kodlamadan önce netleşecek.

### Müdür

- Bugünkü sitede okulunun herhangi bir öğrencisinin portalını açınca menüde **"Sınavları"**: öğrencinin sayfasının aynısı,
  başlığın altında "… adına görüntülüyorsun." Yalnız **senin okulunda** yapılmış sınavlar görünür (nakil gelen öğrencinin eski
  okulundakiler görünmez).
- Tasarımda okulun bütün sınavları "Okul düzeni → Sınavlar"da ([Okulun sınavları](okulun-sinavlari.md)).

### Öğretmen

- "Öğrenci portalına girer" yetkisi varsa (ör. rehber öğretmen) okulun öğrencilerinin portalını açar ve "Sınavları"na bakar; ders
  verdiği öğrencilerin sınav sonuçlarını ayrıca **"Sınıflarım"**daki öğrenci penceresinde görür
  ([Sınıflarım](../siniflar-dersler/siniflarim.md)).

## Kurallar ve sınırlar

- **Hangi sınavlar:** öğrencinin herhangi bir ölçümde değeri olan sınavlar (grupsuzlar "Sınavlar" kartında, gruptakiler grup
  kartlarında); değeri hiç girilmemiş sınav bugünkü sitede görünmez. Tasarımda planlanmış (gelecek) sınav da "Sonuç yok" diye görünür.
- **Hangi gruplar:** grubun herhangi bir sınavının ana ölçümünde öğrencinin değeri varsa.
- **Eğitim yılı:** bakılan yılın sınavları. Öğrenci ve veli (tasarımda) yalnız aktif yılı ve bir önceki yılı görür
  ([Silme, eğitim yılı ve saklama](silme-ve-saklama.md)).
- **Okul sınırı:** öğrenci ve velisi bütün okullarının sınavlarını görür; okul personeli yalnız kendi okulundakileri.
- **Görme yetkisi:** öğrenci kendisi; bağlı veli (öğretmen ya da müdür olan veli de kendi çocuğunu); aynı okulun müdürü;
  öğrencinin öğretmeni; "Öğrenci portalına girer" yetkili aynı okulun öğretmeni; site yöneticisi. Başkası **"Bu öğrenciyi görme
  yetkin yok"**.
- **Kapalı bölüm:** okulda "Sınavlar" kapalıysa menüden ve ana sayfadan kalkar, sınav verisi gelmez; adresle açılırsa "Bu bölüm
  okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir."
- **Sayılar** Türkçe biçimde (virgüllü), en çok üç ondalık; tarih "25.09.2026".
- **Ana sayfa kutucuğu** yalnız grup sayısını yazar ("0 sınav grubu" da yazabilir, grupsuz sonuçların olsa bile).
- **Gizlilik:** veli kodu, adres, telefon gibi bilgiler bu sayfanın verisinde yoktur; sayfa yalnız ad, sınıf ve sonuçları taşır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Sınav ayrıntısı](sinav-ayrintisi.md) — tasarımda satıra dokununca.
- [Sınav grupları](sinav-gruplari.md) — grup tabloları ve tasarımdaki grup sonucu.
- [Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md) — ilk girişte bildirim.
- [Dershane portalında deneme sınavları](dershane-denemeleri.md) — tasarımda ikinci kurumun sınavları.
- [Silme, eğitim yılı ve saklama](silme-ve-saklama.md), [Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md).

**İlgili:**

- [Sınav grafiği](../ilerleyis/sinav-grafigi.md), [Sınavlar ve grup ortalamaları](../ilerleyis/sinavlar-ve-grup-ortalamalari.md),
  [Sınav sonuçları sütun grafiği](../ilerleyis/sinav-sonuclari-grafigi.md), [İlerleyişim sayfası](../ilerleyis/ilerleyisim.md).
- [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md), [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md),
  [Kutucuklar](../ana-sayfa/kutucuklar.md).
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Çocuklarım](../portallar/cocuklarim.md),
  [Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Öğrenci nakli](../hesaplar/ogrenci-nakli.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `SAYFALAR.sinavlarim` (başlık, boş kutu,
  grup tabloları); [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) — `hedefOgrenci`,
  `tekSinavKarti`, `ilerleyisGrafikleriniYukle`; grafik [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md)
  (`sinavGrafigiKutusu`); menü [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) ("Sınavlarım", çocuğun
  portalında "Sınavları"); kutucuk [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md); velinin
  İlerleyiş'i [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md).
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `GET /api/progress?studentId=` (`examGroups`, `exams`,
  kapalı bölüm, yıl ve okul süzgeci); grafik [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) (`GET /api/exams/grafik`);
  depo [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`ogrencininGruplari`, `ogrencininTekSinavlari`);
  görme yetkisi [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`canSeeStudent`).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (ilerleyişte grupsuz sınavlar ve grup ortalaması),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "İlerleyişim", "Veli tarafı".

## Sık sorulanlar

- **Öğretmen notu girdi, neden görmüyorum?** Sayfayı yenile; ilk girişte bildirim de gelir. Görmüyorsan okulda "Sınavlar" kapalı
  olabilir ya da üstteki yıl seçicide başka bir yıl seçilidir.
- **Ana sayfada "0 sınav grubu" yazıyor ama sonuçlarım var.** Kutucuk yalnız grupları sayar; grupsuz sınavların "Sınavlar"
  kartındadır.
- **Velim notlarımı görür mü?** Evet; bağlı velin bütün sınav sonuçlarını görür.
- **Sınavın ayrıntısını nasıl açarım?** Bugünkü sitede satırlar açılmaz; tasarımda satıra dokununca "Sınav ayrıntısı" açılır.

## Sırada

- Sınav ayrıntı ekranı (kullanıcının 1 Ekim kararı) ve sınav grubu üst değeri / grup sonucu (iş 14).
- Arayüz önizlemesi (Tasarım 1) koda geçerken: sınav satırları, "Sınav grupları" satırı ve ayrıntı penceresi; velide grup sonucunun
  yeri.
- Optimizasyon + saklama süreleri (iş 7): öğrenci ve velinin yalnız aktif ve bir önceki yılı görmesi.
- Mesaj ayarları … sınav planlama (iş 8): planlanmış sınavın "Sonuç yok" diye görünmesi.
