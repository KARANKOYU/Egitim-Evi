# Yazı düzenleyici · Araç çubuğunun düzeni

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde her düğmesi çalışır hâlde var).

Yazı alanının üstündeki düğmelerin sırası ve grupları, üstüne gelince çıkan ipuçları, etkin biçimin görünmesi ve düğmelerin
hangi durumda basılamadığı.

## Ne işe yarar

Kullanıcı 1 Ekim'de ilk örneği (sohbette çizilen etkileşimli bir düzenleyici) "onaylıyorum, geri al yinele ve hizalama da olsun"
diye onayladı. Sonra başka bir okul sisteminin düzenleyicisinin ekran görüntüsünü gösterip "bunla bir yapsan bu daha güzel; resim
düğmesi tıklayınca fotoğrafı koyar, bağlantıda bağlantı" dedi; ikinci örnek o düzende çizildi: **gruplanmış gri düğme blokları,
iki satır, altta renk kutuları**. Bu düzen kesinleşti ("tasarım kesin", 1 Ekim). Kullanıcının ekran görüntüleri yalnız örnektir,
depoya konmaz; o sistemin adı ve markası hiçbir yerde anılmaz.

Amaç: her uzun yazı alanında aynı düğmelerin aynı yerde olması; bir kez öğrenen her yerde kullanır.

## Nereden açılır

Ayrı bir düğmesi yok; düzenleyicinin bulunduğu her alanın hemen üstünde kendiliğinden görünür
([Düzenleyicinin bulunduğu yerler](nerelerde-var.md)).

## Adım adım

### Bugün (kodda)

Araç çubuğu yok; uzun yazı alanları düz yazı kutusudur.

### Yazan herkes (tasarım)

Düğmeler soldan sağa yedi grup hâlindedir. Her grup açık gri zeminli, köşeleri yuvarlak bir bloktur; gruplar arasında küçük boşluk
var. Masaüstünde genişlik yetmezse gruplar alt satıra geçer (kullanıcının seçtiği örnekteki gibi iki satır, renk kutuları altta);
telefonda tek satır olup yana kayar ([Telefonda araç çubuğu](telefonda.md)). Simgeler düz çizgilidir.

| Grup (ekran okuyucunun okuduğu ad) | Düğme (yüzündeki işaret) | İpucu — üstüne gelince aynen | Belge |
|---|---|---|---|
| "Geri al ve yinele" | sola kıvrık ok | "Geri al (Ctrl+Z)" | [Geri al · Yinele](geri-al-yinele.md) |
| | sağa kıvrık ok | "Yinele (Ctrl+Y)" | [Geri al · Yinele](geri-al-yinele.md) |
| "Başlıklar" | H1 | "Büyük başlık (Ctrl+Alt+1)" | [Başlıklar](basliklar.md) |
| | H2 | "Orta başlık (Ctrl+Alt+2)" | [Başlıklar](basliklar.md) |
| | H3 | "Küçük başlık (Ctrl+Alt+3)" | [Başlıklar](basliklar.md) |
| "Yazı biçimi" | kalın **B** | "Kalın (Ctrl+B)" | [Kalın](kalin.md) |
| | eğik *I* | "İtalik (Ctrl+I)" | [İtalik](italik.md) |
| | altı çizili U | "Altı çizili (Ctrl+U)" | [Altı çizili](alti-cizili.md) |
| | üstü çizili S | "Üstü çizili (Alt+Shift+5)" | [Üstü çizili](ustu-cizili.md) |
| "Listeler" | noktalı satırlar | "Madde listesi (Ctrl+Shift+8)" | [Madde listesi](madde-listesi.md) |
| | 1, 2 numaralı satırlar | "Numaralı liste (Ctrl+Shift+7)" | [Numaralı liste](numarali-liste.md) |
| "Hizalama ve girinti" | sola dayalı satırlar | "Sola yasla (Ctrl+Shift+L)" | [Hizalama](hizalama.md) |
| | ortalı satırlar | "Ortala (Ctrl+Shift+E)" | [Hizalama](hizalama.md) |
| | sağa dayalı satırlar | "Sağa yasla (Ctrl+Shift+R)" | [Hizalama](hizalama.md) |
| | eşit satırlar | "İki yana yasla (Ctrl+Shift+J)" | [Hizalama](hizalama.md) |
| | sağa ok ve satırlar | "Girintiyi artır (Ctrl+])" | [Girinti](girinti.md) |
| | sola ok ve satırlar | "Girintiyi azalt (Ctrl+[)" | [Girinti](girinti.md) |
| "Ekle" | </> | "HTML görünümü" (öğrencide düğme yok) | [HTML görünümü](html-gorunumu.md) |
| | resim | "Fotoğraf ekle" | [Fotoğraf ekle](fotograf-ekle.md) |
| | zincir halkası | "Bağlantı ekle (Ctrl+K)" | [Bağlantı ekle](baglanti-ekle.md) |
| "Renk" | koyu kutuda A | "Yazı rengi: varsayılan" | [Renkler](renkler.md) |
| | kırmızı kutuda A | "Yazı rengi: kırmızı" | [Renkler](renkler.md) |
| | yeşil kutuda A | "Yazı rengi: yeşil" | [Renkler](renkler.md) |
| | mavi kutuda A | "Yazı rengi: mavi" | [Renkler](renkler.md) |
| | sarı kutuda A | "Sarı vurgu" | [Renkler](renkler.md) |

Kullanım:

1. Yazı alanına tıkla. Alan boşken içinde soluk **"Yaz…"** yazar; alan en az 150 piksel yüksekliğindedir (takvimdeki "Not" gibi
   dar pencerelerde 110 piksel). Odaklanınca çerçevesi sitenin ana rengine döner.
2. Biçimlemek istediğin yazıyı seç ya da imleci koy, düğmeye bas. Düğmeye basmak yazıdaki seçimi **bozmaz**; seçili yazı seçili kalır,
   ikinci bir düğmeyle devam edebilirsin.
3. İmlecin durduğu yerdeki biçimin düğmesi **koyu (vurgulu)** görünür: H1–H3, Kalın, İtalik, Altı çizili, Üstü çizili, iki liste,
   dört hizalama ve Sarı vurgu bu hâli alır; </> açıkken o da dolu görünür. Geri al, Yinele, iki girinti düğmesi, Fotoğraf ekle,
   Bağlantı ekle ve dört yazı rengi kutusunun "basılı" hâli yoktur.
4. Fareyle bir düğmenin üstüne gelince ipucu çıkar: Türkçe adı ve varsa kısayolu ([Klavye kısayolları](kisayollar.md)).
5. **</> açıkken** öbür bütün düğmeler soluklaşır ve basılamaz; yalnız </> basılabilir (geri dönmek için).
6. Klavyeyle de kullanılır: Tab ile düğmeler arasında gezilir, odaktaki düğmenin çevresinde çizgi görünür; Enter ya da boşluk basar.

### Öğrenci (tasarım)

Aynı araç çubuğu; yalnız "Ekle" grubunda **</> yoktur**, grupta "Fotoğraf ekle" ve "Bağlantı ekle" kalır. Önizlemede düğme açık
olan oturumun rolüne bakar: öğrenci oturumunda görünmez.

### Veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici (tasarım)

Bütün düğmeler, </> dahil. Tanımda planlı çevirmen rolünde de </> var.

## Kurallar ve sınırlar

- **Kesin liste** (1 Ekim) yukarıdaki yedi gruptur; fazlası yok. Tanımın 30 Eylül maddesi "satır içi kod yok" diyor. Site
  duyurusu için eski tanımdaki **"Biçimi temizle"** düğmesi kesin listede yoktur. Yazı tipi, yazı boyutu, tablo, alıntı bloğu,
  serbest renk seçici yoktur.
- Tanımdaki ipucu kuralı: "Türkçe ad + kısayol: Ctrl+Z/Y/B/I/U". Önizleme öbür düğmelere de kısayol koymuş (tabloda); bunlar
  önizlemenin önerisidir, kullanıcı ayrıca onaylamadı ([Klavye kısayolları](kisayollar.md)).
- "Etkin biçim düğmesi koyu görünür" tanımın sözüdür.
- Erişilebilirlik (önizlemedeki gibi): araç çubuğunun adı "Yazı biçimi"; her grup yukarıdaki adla okunur; her düğmenin adı
  (ör. "Kalın") ve basılı olup olmadığı ekran okuyucuya söylenir; yazı alanı "Yazı" adlı çok satırlı bir metin kutusudur (bazı
  pencerelerde adı "Açıklama", "Hatırlatıcının açıklaması", "Anketin açıklaması" olur).
- Araç çubuğu ve kurallar her alanda aynıdır; bir alana özel düğme eklenmez (quiz soru düzenleyicisinin resim ve matematik
  araçları ayrı bir düzenleyicidir: [Soru resmi ve matematik](../quiz/soru-resmi-ve-matematik.md)).
- Önizlemede düğme boyutu masaüstünde 38×38, telefonda 44×44 pikseldir.

## Kardeşler ve ilgili

**Kardeşler:** her düğmenin kendi belgesi (tabloda) · [Düzenleyicinin bulunduğu yerler](nerelerde-var.md) ·
[Telefonda araç çubuğu](telefonda.md) · [Klavye kısayolları](kisayollar.md) · [Karakter sayacı](karakter-sayaci.md).

**İlgili:** [Mesajlar · Yeni mesaj](../mesaj/yeni-mesaj.md), [Ödevler · Ödev verme](../odev/odev-verme.md),
[Site yönetimi · Site duyurusu](../yonetim/site-duyurusu.md) (eski tanımdaki küçük araç çubuğu).

## Kod tarafı

Bugün kodda yok. Sitenin ikonları [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md)'de; düzenleyici
kodlanınca yeni simgeler (zincir, listeler, hizalama, girinti, </>) oraya ya da düzenleyicinin kendi parçasına eklenir. Pencereler
tek bir pencere kökü kullandığı için ([public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md))
düzenleyicinin bağlantı kutusu ikinci bir pencere değil, araç çubuğunun altında açılan bir kutudur (önizlemedeki gibi). Kodlanınca
bu bölüm ve Durum satırı güncellenir.

## Sık sorulanlar

- **Düğmeler neden iki satır?** Kullanıcının seçtiği örnek böyleydi; ekran darsa gruplar alt satıra geçer. Telefonda tek satır kayar.
- **Hangi biçimin açık olduğunu nasıl anlarım?** İmlecin olduğu yerdeki biçimin düğmesi koyu görünür.
- **Yazı boyutunu değiştirebilir miyim?** Hayır; büyük yazı için başlık düğmelerini (H1–H3) kullan.

## Sırada

- Düzenleyiciler (iş 15, onaylı): araç çubuğu ortak bileşen olarak kodlanacak.
- Kısayolların (Ctrl+Z/Y/B/I/U dışındakiler) kesinleşmesi yapı belgesinde.
