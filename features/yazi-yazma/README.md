# Yazı düzenleyici

Eğitim Evi'nin bütün uzun yazı alanlarında (ödev açıklaması, öğrencinin teslim metni, mesaj ve duyuru, hazır şablon, anket, quiz,
sınav, takvim etkinliği ve ajanda notu, hatırlatıcı, toplantı, eğitim videosu, başarı, destek talebi ve yanıtı, site duyurusu, okul
sayfası tanıtım yazısı) kullanılacak **tek ortak düzenleyici**. Üstte gruplanmış gri düğme bloklarından bir araç çubuğu vardır:
[Geri al · Yinele] [H1 · H2 · H3] [Kalın · İtalik · Altı çizili · Üstü çizili] [Madde listesi · Numaralı liste] [Sola yasla · Ortala ·
Sağa yasla · İki yana yasla · Girintiyi artır · Girintiyi azalt] [HTML görünümü (</>) · Fotoğraf ekle · Bağlantı ekle] [renk kutuları:
varsayılan, kırmızı, yeşil, mavi + sarı vurgu]; düğmelerin üstüne gelince Türkçe adı ve kısayolu (Ctrl+Z/Y/B/I/U) görünür, etkin
biçimin düğmesi koyu durur. Altında yazı alanı, en altta alanın sınırıyla bir karakter sayacı ve geniş "Gönder"/"Kaydet" düğmesi
yer alır. Bağlantı, seçili yazıya yalnız `https://` adresle verilir ve yeni sekmede açılır; fotoğraf tarayıcıda küçültülüp konum
bilgisinden arındırılır, okulun dosya alanına ek olarak yüklenir ve imlecin olduğu yere girer. </> yalnız öğrencide yoktur. Sunucu
her kayıtta ve her gösterimde yalnız araç çubuğunun üretebildiği biçimleri tutar: izin listesi dışındaki etiket silinmez, çalışmaz,
düz metin olarak görünür; görünmez yapan hiçbir şey (gizli stil, zemin rengi yazı, görünmez karakter, HTML yorumu) geçmez; kural
öğrenci dahil herkese aynıdır. Word ya da Docs'tan yapıştırılan biçim temizlenir; telefonda araç çubuğu tek satır olup yana kayar;
kısa alanlar (ad, başlık, kullanıcı adı) düz yazı kalır; kullanıcının kendi yazısında emoji serbesttir. **Bunların hiçbiri bugün
kodda yok:** bugün sitedeki uzun yazı alanları düz yazı kutusudur ve yazılan her şey harf harf gösterilir (yalnız üç kutuda
karakter sayacı var). Düzenleyici kullanıcının 28 Eylül – 2 Ekim kararlarıyla tasarlandı (1 Ekim: "tasarım kesin"), Tasarım 1
önizlemesinde çalışır hâlde duruyor; kodlaması Linux'ta (iş 15, onaylı).

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Düzenleyicinin bulunduğu yerler](nerelerde-var.md) | Hangi pencerede, hangi alanda, kim yazar; düz kalan alanlar; site duyurusu ve destek yanıtı farkı | Tasarlandı — henüz kodda yok |
| [Araç çubuğunun düzeni](arac-cubugu.md) | Yedi grup, düğme ve ipucu metinleri, etkin biçim, </> açıkken soluk düğmeler | Tasarlandı — henüz kodda yok |
| [Geri al · Yinele](geri-al-yinele.md) | Ctrl+Z / Ctrl+Y, alan başına geçmiş, geçmişe girmeyen işler | Tasarlandı — henüz kodda yok |
| [Başlıklar](basliklar.md) | H1 · H2 · H3 → h3 · h4 · h5, aynı düğmeyle geri dönüş | Tasarlandı — henüz kodda yok |
| [Kalın](kalin.md) | Ctrl+B, `b`/`strong` | Tasarlandı — henüz kodda yok |
| [İtalik](italik.md) | Ctrl+I, `i`/`em` | Tasarlandı — henüz kodda yok |
| [Altı çizili](alti-cizili.md) | Ctrl+U, `u`, bağlantıyla karışma | Tasarlandı — henüz kodda yok |
| [Üstü çizili](ustu-cizili.md) | Alt+Shift+5, `s`/`del` | Tasarlandı — henüz kodda yok |
| [Madde listesi](madde-listesi.md) | `ul`, iç içe liste, listeden çıkma | Tasarlandı — henüz kodda yok |
| [Numaralı liste](numarali-liste.md) | `ol`, hep 1'den başlar | Tasarlandı — henüz kodda yok |
| [Hizalama](hizalama.md) | Sola, ortala, sağa, iki yana; `text-align` | Tasarlandı — henüz kodda yok |
| [Girinti](girinti.md) | 40 pikselin 1–5 katı, listede alt madde | Tasarlandı — henüz kodda yok |
| [Renkler](renkler.md) | Varsayılan, kırmızı, yeşil, mavi, sarı vurgu; yalnız palet | Tasarlandı — henüz kodda yok |
| [Bağlantı ekle](baglanti-ekle.md) | Seçili yazıya adres, "Görünecek yazı" + "Adres", düzenleme ve kaldırma, "Adres https:// ile başlamalı." | Tasarlandı — henüz kodda yok |
| [Fotoğraf ekle](fotograf-ekle.md) | JPEG/PNG/WebP, küçültme, meta veri, ek olarak yükleme, disk, KVKK | Tasarlandı — henüz kodda yok |
| [HTML görünümü (</>)](html-gorunumu.md) | Kod kutusu, dönüşte temizlik; öğrencide yok | Tasarlandı — henüz kodda yok |
| [İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) | İzin listesi, düz metne dönüş, gizleme yok, görünmez karakterler, testler | Tasarlandı — henüz kodda yok |
| [Yapıştırma](yapistirma.md) | Word / Docs biçiminden korunanlar ve atılanlar | Tasarlandı — henüz kodda yok |
| [Karakter sayacı](karakter-sayaci.md) | Alanın sınırı, bugünkü sınırlar ve sayaçlar | Kodda var; tasarımda ek olarak her düzenleyicide (bugün yalnız üç düz yazı kutusunda) |
| [Telefonda araç çubuğu](telefonda.md) | Tek satır, yana kaydırma, 44 piksel düğmeler, Android geri tuşu | Tasarlandı — henüz kodda yok |
| [Klavye kısayolları](kisayollar.md) | Tanımdaki beş kısayol ve önizlemenin ekledikleri, çakışmalar | Tasarlandı — henüz kodda yok |
| [Okurken görünüm](okurken-gorunum.md) | Okuyanın gördüğü biçim, bağlantı, fotoğraf; eski düz kayıtlar; liste önizlemeleri | Tasarlandı — henüz kodda yok |

Okuma sırası:

- **Yazan herkes:** [Düzenleyicinin bulunduğu yerler](nerelerde-var.md) → [Araç çubuğunun düzeni](arac-cubugu.md) →
  [Kalın](kalin.md) · [İtalik](italik.md) · [Altı çizili](alti-cizili.md) · [Üstü çizili](ustu-cizili.md) →
  [Başlıklar](basliklar.md) → [Madde listesi](madde-listesi.md) · [Numaralı liste](numarali-liste.md) →
  [Hizalama](hizalama.md) · [Girinti](girinti.md) → [Renkler](renkler.md) → [Bağlantı ekle](baglanti-ekle.md) →
  [Fotoğraf ekle](fotograf-ekle.md) → [Karakter sayacı](karakter-sayaci.md) → [Telefonda](telefonda.md) → [Kısayollar](kisayollar.md).
- **HTML bilenler (öğrenci dışında herkes):** [HTML görünümü](html-gorunumu.md) → [İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) →
  [Yapıştırma](yapistirma.md).
- **Okuyan herkes:** [Okurken görünüm](okurken-gorunum.md).
- **Kodlayacak olan:** [İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) → [Fotoğraf ekle](fotograf-ekle.md) →
  [Okurken görünüm](okurken-gorunum.md) → [Karakter sayacı](karakter-sayaci.md) → [Düzenleyicinin bulunduğu yerler](nerelerde-var.md)
  → aşağıdaki açık noktalar.

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. Çalışan sütunu özel rolleri de
kapsar (yetkisine göre). Tanımda planlı çevirmen rolünde de </> vardır (tabloda ayrı sütunu yok). Tahta hesabı yazı yazmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Eğitmen | Destek | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|---|---|
| Bulunduğu yerler | [mesaj, teslim metni, hatırlatıcı, destek talebi](nerelerde-var.md) | [mesaj, hatırlatıcı, destek talebi](nerelerde-var.md) | [ödev, mesaj, şablon, anket, quiz, sınav, toplantı, hatırlatıcı](nerelerde-var.md) | [yetkisine göre öğretmenin yerleri; mesaj, hatırlatıcı](nerelerde-var.md) | [duyuru, etkinlik, toplantı, başarı, okul sayfası, anket, sınav](nerelerde-var.md) | [mesaj, hatırlatıcı, destek talebi](nerelerde-var.md) | [video açıklaması, destek talebi](nerelerde-var.md) | [talep yanıtı](nerelerde-var.md) | [site duyurusu, talep yanıtı](nerelerde-var.md) | — |
| Araç çubuğunun düzeni | [</> olmadan kullanır](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | [bütün düğmeler](arac-cubugu.md) | — |
| Geri al · Yinele | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | [kullanır](geri-al-yinele.md) | — |
| Başlıklar | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [kullanır](basliklar.md) | [okul sayfasında görür](okurken-gorunum.md) |
| Kalın | [kullanır](kalin.md) | [kullanır](kalin.md) | [kullanır](kalin.md) | [kullanır](kalin.md) | [kullanır](kalin.md) | [kullanır](kalin.md) | [kullanır](kalin.md) | [kullanır](kalin.md) | [kullanır](kalin.md) | [görür](okurken-gorunum.md) |
| İtalik | [kullanır](italik.md) | [kullanır](italik.md) | [kullanır](italik.md) | [kullanır](italik.md) | [kullanır](italik.md) | [kullanır](italik.md) | [kullanır](italik.md) | [kullanır](italik.md) | [kullanır](italik.md) | [görür](okurken-gorunum.md) |
| Altı çizili | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [kullanır](alti-cizili.md) | [görür](okurken-gorunum.md) |
| Üstü çizili | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [kullanır](ustu-cizili.md) | [görür](okurken-gorunum.md) |
| Madde listesi | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [kullanır](madde-listesi.md) | [görür](okurken-gorunum.md) |
| Numaralı liste | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [kullanır](numarali-liste.md) | [görür](okurken-gorunum.md) |
| Hizalama | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [kullanır](hizalama.md) | [görür](okurken-gorunum.md) |
| Girinti | [kullanır](girinti.md) | [kullanır](girinti.md) | [kullanır](girinti.md) | [kullanır](girinti.md) | [kullanır](girinti.md) | [kullanır](girinti.md) | [kullanır](girinti.md) | [kullanır](girinti.md) | [kullanır](girinti.md) | [görür](okurken-gorunum.md) |
| Renkler | [kullanır](renkler.md) | [kullanır](renkler.md) | [kullanır](renkler.md) | [kullanır](renkler.md) | [kullanır](renkler.md) | [kullanır](renkler.md) | [kullanır](renkler.md) | [kullanır](renkler.md) | [kullanır; eski duyuru tanımında 6 renk](renkler.md) | [görür](okurken-gorunum.md) |
| Bağlantı ekle | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [ekler](baglanti-ekle.md) | [tıklar, yeni sekmede açılır](okurken-gorunum.md) |
| Fotoğraf ekle | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [ekler](fotograf-ekle.md) | [görür](okurken-gorunum.md) |
| HTML görünümü | — (düğme yok) | [kullanır](html-gorunumu.md) | [kullanır](html-gorunumu.md) | [kullanır](html-gorunumu.md) | [kullanır](html-gorunumu.md) | [kullanır](html-gorunumu.md) | [kullanır](html-gorunumu.md) | [kullanır](html-gorunumu.md) | [kullanır](html-gorunumu.md) | — |
| İzinli ve izinsiz kod | [yazdığı ve yapıştırdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [yazdığı temizlenir](izinli-ve-izinsiz-kod.md) | [temizlenmiş yazıyı okur](izinli-ve-izinsiz-kod.md) |
| Yapıştırma | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | [yapıştırır](yapistirma.md) | — |
| Karakter sayacı | [görür](karakter-sayaci.md) | [görür](karakter-sayaci.md) | [görür](karakter-sayaci.md) | [görür](karakter-sayaci.md) | [görür](karakter-sayaci.md) | [görür](karakter-sayaci.md) | [görür](karakter-sayaci.md) | [görür](karakter-sayaci.md) | [görür; site duyurusu 500](karakter-sayaci.md) | — |
| Telefonda araç çubuğu | [kullanır](telefonda.md) | [kullanır](telefonda.md) | [kullanır](telefonda.md) | [kullanır](telefonda.md) | [kullanır](telefonda.md) | [kullanır](telefonda.md) | [kullanır](telefonda.md) | [kullanır](telefonda.md) | [kullanır](telefonda.md) | — |
| Klavye kısayolları | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | [bilgisayarda kullanır](kisayollar.md) | — |
| Okurken görünüm | [ödev, mesaj, toplantı, başarı okur](okurken-gorunum.md) | [çocuğunun ödevini, mesajları okur](okurken-gorunum.md) | [okur](okurken-gorunum.md) | [okur](okurken-gorunum.md) | [okur](okurken-gorunum.md) | [okur](okurken-gorunum.md) | [okur](okurken-gorunum.md) | [talepleri okur](okurken-gorunum.md) | [okur](okurken-gorunum.md) | [okul sayfası, açık videolar, site duyurusu](okurken-gorunum.md) |

## Tanım, önizleme ve bugünkü kod arasındaki açık noktalar

Kodlanmadan önce karara bağlanması gerekenler (ayrıntısı ilgili belgede):

- Site duyurusu: eski tanım maddesi ve panelin önizlemesi ayrı, küçük bir düzenleyici çiziyor (6 renk, "Biçimi temizle", farklı
  hata iletisi); kullanıcının sonraki kararı ortak düzenleyiciyi istiyor ([Bulunduğu yerler](nerelerde-var.md), [Renkler](renkler.md)).
- Destek ekibinin yanıtı önizlemede düz yazı kutusu; tanımda düzenleyicili ([Bulunduğu yerler](nerelerde-var.md)).
- Önizlemede düzenleyici olmayan tanım alanları: öğrencinin teslim metni, anket soru açıklaması, quiz talimatı ve soru metni, ajanda
  notu ([Bulunduğu yerler](nerelerde-var.md)).
- Fotoğraf: önizleme fotoğrafı yazıya gömülü veri olarak koyuyor, tanım yalnız sitenin ek adresini kabul ediyor; bugünkü küçültme
  parçası küçük fotoğrafa dokunmadığı için konum bilgisi kalabilir; yazıdaki fotoğrafın saklama süresi (ekler 7 günde siliniyor);
  açıklama metni (`alt`) yok ([Fotoğraf ekle](fotograf-ekle.md)).
- Görünmez karakter silme, emoji dizilerini (birleştiren karakter) ve sağdan sola yazıyı etkileyebilir
  ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Koyu temada sarı vurgunun okunurluğu ([Renkler](renkler.md)).
- Girintinin başlıklarda olup olmayacağı; önizlemede "Girintiyi artır" 5. katta durmuyor, fazlası kayıtta 200 piksele iniyor
  ([Girinti](girinti.md)).
- Ctrl+Z/Y/B/I/U dışındaki kısayolların kesinleşmesi, tarayıcı kısayollarıyla çakışmalar ve Türkçe klavyede AltGr çakışması
  (önizlemede `#` ve `>` yazılamıyor) ([Klavye kısayolları](kisayollar.md)).
- Biçimli yapıştırmada izinsiz parçaların atılması ile "izinsiz kod düz metin olur" kuralının ilişkisi; bağlantıdaki `target` ve
  `rel` nitelikleri ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Yazıdaki fotoğrafın gösterme adresi: bugünkü ekler yalnız biletle ve indirme olarak açılıyor ([Fotoğraf ekle](fotograf-ekle.md)).
- Alan alan karakter sınırı ve sınır aşılınca ne olacağı; bugün "Yeni ödev" açıklaması 1000 karakterde uyarısız kesiliyor
  ([Karakter sayacı](karakter-sayaci.md)).
- Eski düz kayıtla yeni HTML kaydın ayırt edilmesi ([Okurken görünüm](okurken-gorunum.md)).

## İlgili klasörler

- [Ödevler](../odev/README.md) — ödev açıklaması ve [teslim metni](../odev/teslim-metni.md).
- [Mesajlar ve duyurular](../mesaj/README.md) — mesaj, duyuru, toplu mesaj, hazır şablonlar.
- [Anketler](../anket/README.md) — anket açıklaması ve soru açıklaması.
- [Quiz](../quiz/README.md) — talimat ve soru metni (quiz soru düzenleyicisiyle birlikte).
- [Sınavlar](../sinav/README.md) — sınav açarken "Konular".
- [Takvim ve ajanda](../takvim/README.md) — etkinlik notu, ajanda notu.
- [Hatırlatıcılar](../hatirlatici/README.md) — açıklama.
- [Toplantılar ve uzaktan ders](../toplanti/README.md) — toplantı açıklaması.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — video açıklaması.
- [Başarılar](../basarilar/README.md) — başarı açıklaması.
- [Destek talepleri](../destek/README.md) — talep ve yanıt.
- [Site yönetimi](../yonetim/README.md) — site duyurusu.
- [Okul sayfası](../okul-sayfasi/README.md) — tanıtım yazısı, yazı bloğu, CSS'in izin listesi.
- [Dosya alanı ve küçültme](../okul-disk/README.md) — fotoğrafın küçültülmesi ve disk sınırı.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — fotoğraf ve aydınlatma metni.
- [Uygulama ve indirme](../uygulama/README.md) — Android geri tuşunda "Yazdıkların silinsin mi?".
- [Dil ve çeviri](../dil/README.md) — sağdan sola diller, çevirmen rolü.
- [Eklentiler](../eklentiler/README.md) — "izin dışı her şey düz metin" ilkesi.
