# İlerleyiş · Sınav grafiği

**Durum:** Kodda var

Aynı şablonla yapılmış sınavları tarih sırasıyla bir çizgide gösteren grafik: alttan çizilecek ölçüm seçilir, arkada
sınava girenlerin en düşük ve en yüksek değeri bant olarak durur, istenirse aynı veri tablo olarak görülür.

## Ne işe yarar

Öğrenci "deneme sınavlarında puanım artıyor mu?" sorusunu bir çizgide görür. Sınavlar ancak **aynı şablonla** yapıldıysa
yan yana konabilir (ör. bütün "LGS Denemesi"ler, bütün "Yazılı (0-100)"ler); bu yüzden grafik önce şablonu, sonra o
şablonun ölçümlerinden birini (LGS Puanı, Türkçe Net…) seçtirir. Bant, öğrencinin değerini sınavı girenlerin aralığıyla ve
ortalamasıyla karşılaştırır.

Sitenin tanıtımında bu "gelişim grafiği" diye geçer ("Yazılı, test ya da LGS şablonuyla sınav; doğru, yanlış, net ve
gelişim grafiği.").

## Nereden açılır

- [İlerleyişim sayfası](ilerleyisim.md)nda "Ödevler" kartının altındaki **"Sınav grafiği"** kartı.
- **"Sınavlarım"** sayfasının en üstünde aynı kutu ([Sınavlarım](../sinav/sinavlarim.md)).
- Velinin [İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)nda her çocuk için ayrı bir kutu; çocuğun portalında
  "İlerleyişi" ve "Sınavları".
- Müdür ve "Öğrenci portalına girer" yetkili öğretmen: öğrencinin portalında.

Tasarım 1 önizlemesinde bu çizgi grafik çizilmemiş; İlerleyişim'de onun yerinde her sınavın bir sütun olduğu "Sınav
sonuçları" grafiği var ([Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md)). Kullanıcı çizgi grafiğin kalkmasını
söylemedi; 2 Ekim kararına göre (üzerine yorum yapmadığı ayrıntılar bugünkü site gibi) kalır.

## Adım adım

### Grafiğin düzeni (bugünkü site)

1. Kartın başlığı **"Sınav grafiği"**. Veri gelene kadar kutuda parlayan boş bir yer tutucu durur (yaklaşık 300 piksel;
   sayfa kaymaz).
2. Öğrencinin şablonlu bir sınav sonucu yoksa: "Grafik, aynı şablonla yapılmış sınavları yan yana koyar. Henüz şablonlu
   bir sınav sonucu yok."
3. Üstte solda şablon: birden çok şablonun varsa sekmeler (ör. **"Yazılı (0-100)"**, **"LGS Denemesi"**), tek şablon
   varsa yalnız adı. Sağda iki sekme: **"Grafik"** ve **"Liste"**.
4. **Grafik** görünümü:
   - Yatayda sınavlar, eskiden yeniye. Her sınavın altında tarihi ("10.09.2026"; dar ekranda "10.09") ve onun altında
     sınavın adı (sığmazsa "…" ile kısaltılır; çok sıkışınca etiketlerden biri atlanır, sonuncusu hep yazılır).
   - Dikeyde seçili ölçümün değerleri; eksen "güzel" sayılara yuvarlanır, en büyük değerin üstünde biraz boşluk kalır.
     Eksi değerler (ör. eksi net) desteklenir.
   - Öğrencinin değerleri noktalar ve onları birleştiren çizgi; her noktanın üstünde değeri (iki ondalığa kadar; dar ekranda
     bir). Değeri olmayan sınavda çizgi kesilir.
   - Fareyle noktanın üstüne gelince: "LGS Deneme 1 (10.09.2026): 490,161 · en düşük 300, en yüksek 490,161".
   - Bant açıksa arkada gölgeli alan (sınavı girenlerin en düşük – en yüksek aralığı) ve kesik çizgi (ortalama). Bandı olan
     tek sınav varsa kalın dikey bir çizgi.
   - Grafiğin altında solda ölçüm sekmeleri (şablonun ölçümleri; ör. "Türkçe Net", "Matematik Net", …, "LGS Puanı"; ilk
     açılışta ana ölçüm seçili), sağda **"En düşük / en yüksek bandı"** düğmesi (açıkken vurgulu).
   - Bant açıkken gösterge: "Senin değerin" (öğrenci kendine bakarken) ya da "Öğrencinin değeri" (başkası bakarken),
     "Sınavı girenlerin en düşük - en yüksek aralığı", "Ortalama".
   - Hareketi azaltma ayarı kapalıysa çizgi açılışta soldan sağa çizilerek gelir.
5. **Liste** görünümü: tablo; sütunlar **"Tarih"**, **"Sınav"** ve şablonun her ölçümü. Sayılar sağa yaslı, ana ölçüm kalın
   ve sitenin ana renginde, değer yoksa "-".

### Öğrenci

1. [İlerleyişim](ilerleyisim.md)i (ya da Sınavlarım'ı) aç; kutu kendiliğinden dolar. Sunucu ilk şablonu seçer, ana ölçüm
   çizilir.
2. Başka bir şablonun sınavlarını görmek için üstteki sekmesine bas (yeni veri istenir; ölçüm seçimi sıfırlanır, o şablonun
   ana ölçümü gelir).
3. Başka bir ölçümü çizmek için grafiğin altındaki sekmesine bas (ör. "Türkçe Net"); anında çizilir.
4. Bandı kapatmak ya da açmak için **"En düşük / en yüksek bandı"**. Seçim bu tarayıcıda hatırlanır.
5. Sayıları tablo olarak görmek için **"Liste"**; dönmek için **"Grafik"**.

### Veli

1. Menüde **"İlerleyiş"**: her çocuğun kendi "Sınav grafiği" kutusu var. Çocuğun portalında "İlerleyişi" ya da
   "Sınavları"nda da aynı kutu.
2. Düğmeler öğrencidekiyle aynı; her kutu kendi şablonunu, ölçümünü ve görünümünü tutar.
3. Göstergede "Öğrencinin değeri" yazar.
4. Çocuğun eski okullarındaki şablonlu sınavlar da grafiğe girer.

Tasarımda: yalnız o oturumdaki çocuğun kutusu ([Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)).

### Müdür, öğretmen ve çalışan

1. Öğrencinin portalını aç ("Portalını aç") → "İlerleyişi" ya da "Sınavları".
2. Grafikte **yalnız senin okulunda yapılmış** sınavlar görünür; nakil gelen öğrencinin eski okulundaki sınavlar görünmez.
   Şablon listesi de buna göredir.
3. Göstergede "Öğrencinin değeri" yazar.

## Kurallar ve sınırlar

- **Hangi sınavlar:** seçili şablonla yapılmış ve öğrencinin o sınavda değeri olan sınavlar, tarih sırasıyla. Şablonsuz
  sınavlar grafiğe girmez (onlar "Sınavlar" kartında: [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md)).
- **Kim görür:** öğrencinin kendisi, bağlı velisi (öğretmen ya da müdür de kendi çocuğunun velisi olabilir), okulun
  müdürü, öğrencinin öğretmeni, "Öğrenci portalına girer" yetkili aynı okulun öğretmeni, sistem yöneticisi. Başkası:
  "Bu öğrenciyi görme yetkin yok". Servisçi göremez.
- **Okul sınırı:** okul personeli yalnız kendi okulunda yapılan sınavları görür; öğrenci ve velisi bütün okullardakini
  (nakil öncesi dahil). Sunucu bunu bakanın rolüne göre ayırır: eski usul öğretmen ya da müdür hesabıyla kendi çocuğuna
  bakan kişide de okul personeli kuralı işler (yalnız kendi okulunda yapılmış sınavlar).
- **Eğitim yılı süzülmez:** bu grafik yıl seçiciye bakmaz; öğrencinin o şablondaki bütün sınavları (geçmiş yıllar dahil)
  gelir. İlerleyişim'deki öbür kartlar ise bakılan yıla süzülür.
- **Bant:** her sınavın her ölçümünde o sınava girenlerin en düşük, en yüksek ve ortalama değeri (ortalama üç ondalığa
  yuvarlanır). Bilinen açık (kod okumasına göre): sınava çok az öğrenci girdiyse bant sınıf arkadaşının değerini ele
  verebilir (iki kişide en düşük ya da en yüksekten biri öbürünün tam değeridir). Kod değiştirilmedi; güvenlik ve KVKK tam
  denetiminde ele alınmalı (aydınlatma metninde öğrenci için "yalnızca kendi verilerine" yazıyor).
- **Okulda "Sınavlar" kapalıysa** kutunun içinde kırmızı: "Sınavlar bu okulda kapalı. Okul müdürü Özellikler sayfasından
  açabilir." Sayfanın kalanı bozulmaz; öbür hatalar da yalnız kutuda gösterilir.
- **Şablonu kullanılmış sınav silinemez:** öğretmen sınav açtığı bir şablonu silmek isterse "Bu şablonla yapılmış N sınav
  var; öğrenci grafikleri bozulmasın diye silinemez. Adını ya da değer alanlarını değiştirebilirsin." uyarısını alır
  ([Şablonlar](../sinav/sablonlar.md)).
- **Ana ölçüm değişirse** (öğretmen sınavın ana ölçümünü değiştirebilir; [Ölçümler ve formül](../sinav/olcumler-ve-formul.md))
  grafik site yeniden yüklenince yeni ana ölçümle açılır; aynı oturumda daha önce açılmış kutu son seçilen ölçümü tutar.
- **Telefonda:** grafik kutunun gerçek genişliğinde çizilir, yazılar 11–12 piksel kalır; telefon yan çevrilince yeniden
  çizilir.
- **Ekran okuyucu:** çizgi grafik yalnız başlığını okur ("LGS Puanı grafiği"); değerler için "Liste" görünümü kullanılır.
- **Tercih tarayıcıda:** bant seçimi bu tarayıcıda hatırlanır (varsayılan açık), hesaba bağlı değildir. Velinin
  sayfasında bir çocuğun bandını kapatmak açık duran öbür kutuyu değiştirmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [İlerleyişim sayfası](ilerleyisim.md), [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md).
- [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md) — tasarımda sınav sonuçlarının sütun hâli.
- [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md) — şablonsuz sınavlar ve grup ortalaması.
- [Derslere göre ortalama](derslere-gore-ortalama.md), [Ödev sonuçları grafiği](odev-grafigi.md),
  [Derslere göre başarı oranı](ders-oranlari.md).

**İlgili:**

- [Şablonlar](../sinav/sablonlar.md), [Ölçümler ve formül](../sinav/olcumler-ve-formul.md),
  [Not girişi](../sinav/not-girisi.md), [Sınavlarım](../sinav/sinavlarim.md), [Sınav ayrıntısı](../sinav/sinav-ayrintisi.md).
- [Öğrenci nakli](../hesaplar/ogrenci-nakli.md) — eski okulun sınavları kime görünür.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — bant ve mahremiyet.
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `GET /api/exams/grafik?ogrenci=&sablon=` →
  `{ sablonlar: [{ id, name }], sablonId, olcumler: [{ kod, ad, alt, ust, ana, sira }], sinavlar: [{ id, name, tarih,
  degerler, bant }] }`; depo [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`ogrencininSablonlari`,
  `ogrencininSerisi`, `bantlar`); yetki [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`canSeeStudent`); kapalı bölüm
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) (`exams → sinav`).
- Ön yüz: [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md) — `cizgiGrafik`, `guzelEksen`,
  `sinavGrafigiKutusu`, `sinavGrafigiYukle`, `sinavGrafigiCiz`, `S.sg`, eylemler `sg-sablon`, `sg-olcum`, `sg-bant`,
  `sg-gorunum`; kutuyu yerleştiren [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md)
  (`ilerleyisKartlari`, `ilerleyisGrafikleriniYukle`) ve [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md)
  (Sınavlarım). Görünüm `public/css/parcalar/25-grafik-sinav.css` ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) ("Grafik": öğrenci kendi grafiğini görür, sınavlar tarih
  sırasıyla, bant, başka öğrencinin grafiği 403), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İlerleyişim": "Sınav grafiği").

## Sık sorulanlar

- **Yazılı sınavım grafikte görünmüyor.** Sınav bir şablonla açılmadıysa grafiğe girmez; gruba bağlı değilse "Sınavlar"
  kartında, gruptaysa "Sınav grubu ortalamaları"nda ve Sınavlarım'daki grup tablosunda görünür.
- **"En düşük / en yüksek bandı" ne?** O sınava girenlerin en düşük ve en yüksek değeri (gölge) ve ortalaması (kesik
  çizgi). Kendi noktanın nerede durduğunu gösterir.
- **Çizgim kesik.** Arada değerin olmayan bir sınav var; çizgi orada kesilir, noktalar kalır.
- **Eski okulumun denemeleri neden görünüyor?** Öğrenci ve veli bütün okullarındaki sınavları görür; yeni okulun
  öğretmenleri görmez.

## Sırada

- Sınav: formüllü ölçüm (öneri, onay bekliyor): hesaplanan ölçümler (ör. N = D − Y/4) grafikte yeni ölçüm sekmeleri olur.
- Sınav ayrıntı ekranı ve sıra numaralı ölçümler (kullanıcının 1 Ekim kararı): ölçüm sekmeleri "01.D Doğru Sayısı",
  "05.N Net Sayısı" gibi sıra numaralı adlarla gelir; hazır şablonlar kendi ölçüm listesini getirir.
- Güvenlik denetimi ve KVKK tam denetimi: az kişili sınavda bandın başkasının değerini ele vermesi ele alınacak; çözümü
  henüz kararlaştırılmadı (kullanıcıya sorulacak).
- Optimizasyon + saklama süreleri: öğrenci ve veli eski yılları göremeyince grafikteki sınav dizisi kısalabilir.
- Arayüz önizlemesi (Tasarım 1) koda geçerken çizgi grafiğin yerinin (İlerleyişim mi, yalnız Sınavlarım mı) kullanıcıya
  sorulması.
- Android yerel uygulama: öğrencinin "Diğer" sekmesinde "Sınavlar/İlerleyiş grafiği".
