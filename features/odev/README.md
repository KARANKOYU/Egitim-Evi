# Ödevler

Öğretmenin bir ya da birkaç sınıftaki öğrencilere ödev verdiği, öğrencinin ödevi açıp dosya teslim ettiği ve quizini çözdüğü,
öğretmenin her öğrenciye "Yaptı · Geç yaptı · Eksik · Yapmadı · Gelmedi (izinli) · Gelmedi (izinsiz)" sonucunu seçtiği bölüm.
Öğretmen "Yeni ödev" penceresinde ders, ad, açıklama, takvimden başlama ve son teslim (saat varsayılan 12:00), sınıf sınıf
öğrenci seçimi, ekler, "Öğrenciler bu ödeve dosya yükleyebilsin" izni ve isteğe bağlı quiz seçer; öğrencilere ve velilerine
"Yeni ödev" bildirimi gider. Öğrenci listesinde açmadığı ödevi turuncu görür, ödevi açınca öğretmen "Ödev … tarihinde açıldı"
görür; öğrenci ödevi yıldızlar, süzgeç ve aramayla bulur, teslim dosyası yükler (öğrenci başına ödevde 10 dosya, 50 MB). Sonuç
girilince öğrenciye ve velisine "… ödevi açıklandı: Yaptı" bildirimi gider, öğrencinin ödev serisi ve ilerleyişi güncellenir;
son günden bir gün önce "Yarın … ödevin var" hatırlatması gelir. Müdür ödev vermez, okulun ödevlerine ders ders bakar; yalnız
okuldan ayrılan öğretmenin ödevini sonuçlandırır. Teslim dosyaları son teslimden 7 gün, öğretmenin ekleri yüklemeden 7 gün sonra
silinir; ödev ve sonuçları kalır. Bunların hepsi bugün kodda var. Kullanıcının kararlaştırdığı tasarımda (Tasarım 1 önizlemesi ve
tanımlar) ek olarak: liste tek kutu, 15'erli ve "…" ile devamlı, açılır süzgeçlerle (Durum, Açılma, Yıldız, Sonuç; öğretmende
Sınıf ve Teslim); öğrencinin ve velinin ödev hatırlatma kuralları ve ödeve özel "Hatırlat"; açıklama ve öğrencinin teslim metni
ortak yazı düzenleyicisiyle; ödeve anket eklenmesi; müdürün "Sınıflar / Dersler" ağacı ve salt okunur ödev penceresi; velide her
çocuk ayrı oturum.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Ödev verme](odev-verme.md) | "Yeni ödev" penceresi, alanlar, kurallar, "Yeni ödev" bildirimi | Kodda var; tasarımda ek olarak yazı düzenleyici, anket, yeni pencere düzeni |
| [Başlama ve son teslim](tarih-ve-saat.md) | Takvimli tarih, yarım saatlik saat, 12:00 varsayılanı, süresiz ödev, kalan süre etiketleri | Kodda var; tasarımda ek olarak iki tarih zorunlu |
| [Kime verilecek](alicilar.md) | Sınıf ve öğrenci kutucukları, "Tümünü seç / kaldır", sayaç, ders–sınıf uyumu | Kodda var; tasarımda ek olarak açılır kapanır sınıflar |
| [Ödeve dosya ekleme](dosya-ekleme.md) | Öğretmenin ekleri: sürükle-bırak, 50 MB, 20 dosya, 7 gün, indirme | Kodda var; tasarımda ek olarak açılır "Ekler" kutusu, video küçültme |
| [Dosya yükleme izni](dosya-yukleme-izni.md) | "Öğrenciler bu ödeve dosya yükleyebilsin" (varsayılan kapalı), donan teslim | Kodda var |
| [Ödev listesi](liste.md) | Öğrencinin, velinin, öğretmenin listesi, ana sayfadaki listeler, etiketler | Kodda var; tasarımda ek olarak tek kutu, 15'erli, "…" ile devamı, yeni sıra |
| [Süzgeçler](suzgecler.md) | Ders, Durum, Yıldız, tarih aralığı, "Temizle" | Kodda var; tasarımda ek olarak Durum · Açılma · Yıldız · Sonuç / Sınıf · Teslim açılır süzgeçleri |
| [Ödevlerde arama](arama.md) | "İçerik Ara" ile ad, ders, öğretmen, açıklamada arama | Kodda var; tasarımda ek olarak listenin kendi "Ara" kutusu |
| [Açıldı / açılmadı](acilma-bilgisi.md) | İlk açılış anı, turuncu satır, "Ödev … tarihinde açıldı" | Kodda var; tasarımda ek olarak ayrı "Açılma" süzgeci |
| [Ödevin penceresi](odev-penceresi.md) | Ödevin ayrıntısı: bilgiler, açıklama, ekler, quiz, teslim | Kodda var; tasarımda ek olarak bilgi tablosu, "Hatırlat", velide tam pencere |
| [Teslim](teslim.md) | Öğrencinin dosya yüklemesi, silmesi, sınırlar, velinin görmesi | Kodda var; tasarımda ek olarak "Teslim edilen dosyalar (N)" kutusu |
| [Teslim metni](teslim-metni.md) | Öğrencinin yazı düzenleyiciyle teslim yazısı | Tasarlandı — henüz kodda yok |
| [Teslimleri inceleme ve indirme](teslimleri-inceleme.md) | "N ek", fotoğraf/video/sesi açma, sorup indirme, silme, zip | Kodda var; tasarımda ek olarak silinen teslimin soluk izi |
| [Sonuçlandırma](sonuclandirma.md) | Kontrol ekranı, altı sonuç, "Seçilmemişlerin hepsi: Yaptı", bildirim | Kodda var; tasarımda ek olarak kaydedince ekranda kalma, "Kaydedildi: saat", "Ödevi gör" |
| [Sonuçları düzeltme ve tekrar açma](sonuclari-duzeltme.md) | "Sonuçları düzenle", "Değişiklikleri kaydet", "Tekrar aç" | Kodda var |
| [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) | "Ödevi düzenle" penceresi, "Ödev güncellendi" bildirimi, "Sil" | Kodda var; tasarımda ek olarak "Yeni ödev"le aynı pencere |
| [Yıldızlama](yildizlama.md) | Öğrencinin kendi yıldızı ve "Yıldız" süzgeci | Kodda var; tasarımda ek olarak önizlemede öğretmen ve velide de (karar yok) |
| [Ödev serisi](seri.md) | Arka arkaya "Yaptı" şeridi, uyarı, bozulma | Kodda var; tasarımda ek olarak seriyi bozan ödevin adı |
| [Ödev hatırlatmaları](hatirlatmalar.md) | "Yarın … ödevin var"; tasarımda kurallar ve "Hatırlat" | Kodda var; tasarımda ek olarak varsayılan kural, ödeve özel kural, velinin kuralı |
| [Müdürün ödev görünümü](mudurun-odev-gorunumu.md) | Ders ders bakış, sahipsiz ödev, sayılar | Kodda var; tasarımda ek olarak "Sınıflar / Dersler" ağacı, salt okunur pencere |
| [Teslim dosyalarının saklanması ve silinmesi](saklama-ve-silinme.md) | Silinme kuralları, koruma, temizlik, yedek | Kodda var; tasarımda ek olarak quiz 1 yıl, öğrenci/veli son 1 geçmiş yıl |

Okuma sırası:

- **Öğretmen:** [Ödev verme](odev-verme.md) → [Başlama ve son teslim](tarih-ve-saat.md) → [Kime verilecek](alicilar.md) →
  [Ödeve dosya ekleme](dosya-ekleme.md) → [Dosya yükleme izni](dosya-yukleme-izni.md) → [Ödev listesi](liste.md) →
  [Teslimleri inceleme](teslimleri-inceleme.md) → [Sonuçlandırma](sonuclandirma.md) →
  [Sonuçları düzeltme](sonuclari-duzeltme.md) → [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md).
- **Öğrenci:** [Ödev listesi](liste.md) → [Ödevin penceresi](odev-penceresi.md) → [Teslim](teslim.md) →
  [Açıldı / açılmadı](acilma-bilgisi.md) → [Süzgeçler](suzgecler.md) → [Yıldızlama](yildizlama.md) → [Ödev serisi](seri.md) →
  [Ödev hatırlatmaları](hatirlatmalar.md).
- **Veli:** [Ödev listesi](liste.md) → [Ödevin penceresi](odev-penceresi.md) → [Teslim](teslim.md) →
  [Sonuçlandırma](sonuclandirma.md) (sonucun görünmesi) → [Ödev hatırlatmaları](hatirlatmalar.md).
- **Müdür:** [Müdürün ödev görünümü](mudurun-odev-gorunumu.md) → [Sonuçlandırma](sonuclandirma.md) (sahipsiz ödev) →
  [Saklama ve silinme](saklama-ve-silinme.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Ödev verme | ["Yeni ödev" bildirimini alır](odev-verme.md) | [çocuğunun adıyla bildirimi alır](odev-verme.md) | [ödev verir](odev-verme.md) | [ek rolünde "Ödev verir" varsa kapsamıyla verir; tasarımda öğretmen olmayan veremez](odev-verme.md) | — (ödev vermez) | — | — | — |
| Başlama ve son teslim | [kalan süreyi görür](tarih-ve-saat.md) | [kalan süreyi görür](tarih-ve-saat.md) | [tarih ve saati belirler](tarih-ve-saat.md) | [öğretmen gibi](tarih-ve-saat.md) | [ders ağacında görür](tarih-ve-saat.md) | — | — | — |
| Kime verilecek | — | — | [sınıf ve öğrenci seçer](alicilar.md) | [rolünün sınıf kapsamında seçer](alicilar.md) | — | — | — | — |
| Ödeve dosya ekleme | [ekleri indirir](dosya-ekleme.md) | [portaldan indirir](dosya-ekleme.md) | [ekler, kaldırır](dosya-ekleme.md) | [öğretmen gibi](dosya-ekleme.md) | [portaldan ya da sahipsiz ödevde indirir](dosya-ekleme.md) | — | — | — |
| Dosya yükleme izni | [izin varsa yükler](dosya-yukleme-izni.md) | [izin durumunu görür](dosya-yukleme-izni.md) | [açar, kapatır](dosya-yukleme-izni.md) | [öğretmen gibi](dosya-yukleme-izni.md) | [sahipsiz ödevde değiştirir](dosya-yukleme-izni.md) | — | — | — |
| Ödev listesi | [kendi ödevlerini görür](liste.md) | [çocuklarının ödevlerini görür](liste.md) | [verdiği ödevleri görür](liste.md) | [verdiklerini; portal yetkisiyle öğrencininkini görür](liste.md) | [öğrenci portalından görür](liste.md) | — | — | — |
| Süzgeçler | [süzer](suzgecler.md) | [bugün yalnız portalda; tasarımda süzer](suzgecler.md) | [süzer](suzgecler.md) | [öğretmen gibi](suzgecler.md) | [portalda süzer](suzgecler.md) | — | — | — |
| Ödevlerde arama | [arar](arama.md) | [çocuk, ödev ve ders adıyla arar](arama.md) | [listede ve kontrol ekranında arar](arama.md) | [öğretmen gibi](arama.md) | [ders dallarında arar](arama.md) | — | — | — |
| Açıldı / açılmadı | [açınca kaydedilir](acilma-bilgisi.md) | [turuncu satırı görür](acilma-bilgisi.md) | [açılma tarihini görür](acilma-bilgisi.md) | [öğretmen gibi](acilma-bilgisi.md) | [sahipsiz ödevde görür](acilma-bilgisi.md) | — | — | — |
| Ödevin penceresi | [açar, okur](odev-penceresi.md) | [teslim penceresi; portaldan tamamı](odev-penceresi.md) | [tasarımda "Ödevi gör"](odev-penceresi.md) | [portal yetkisiyle görür](odev-penceresi.md) | [portaldan; tasarımda salt okunur pencere](odev-penceresi.md) | — | — | — |
| Teslim | [dosya yükler, siler](teslim.md) | [çocuğunun dosyalarını görür, indirir](teslim.md) | [izni verir](teslim.md) | [öğretmen gibi](teslim.md) | [portaldan görür](teslim.md) | — | — | — |
| Teslim metni | [yazar (tasarım)](teslim-metni.md) | [karar yok](teslim-metni.md) | [okur (tasarım; yeri karar yok)](teslim-metni.md) | — | — | — | — | — |
| Teslimleri inceleme ve indirme | [kendi dosyalarını indirir](teslimleri-inceleme.md) | [çocuğununkileri indirir](teslimleri-inceleme.md) | ["N ek"i açar, siler, zip indirir](teslimleri-inceleme.md) | [öğretmen gibi](teslimleri-inceleme.md) | [sahipsiz ödevde ve portaldan](teslimleri-inceleme.md) | — | — | — |
| Sonuçlandırma | [sonucu görür, bildirim alır](sonuclandirma.md) | [sonucu görür, bildirim alır](sonuclandirma.md) | [sonuçlandırır](sonuclandirma.md) | ["Ödev sonuçlandırır" yetkisiyle](sonuclandirma.md) | [yalnız sahipsiz ödevde; tasarımda kontrol etmez](sonuclandirma.md) | — | — | — |
| Sonuçları düzeltme ve tekrar açma | [değişen sonucun bildirimini alır](sonuclari-duzeltme.md) | [bildirimini alır](sonuclari-duzeltme.md) | [düzeltir, tekrar açar](sonuclari-duzeltme.md) | [yetkisiyle](sonuclari-duzeltme.md) | [sahipsiz ödevde](sonuclari-duzeltme.md) | — | — | — |
| Ödevi düzenleme ve silme | ["Ödev güncellendi" bildirimini alır](odevi-duzenleme-ve-silme.md) | [bildirimini alır](odevi-duzenleme-ve-silme.md) | [düzenler, siler](odevi-duzenleme-ve-silme.md) | ["Ödev verir" yetkisiyle](odevi-duzenleme-ve-silme.md) | [sahipsiz ödevi düzenler](odevi-duzenleme-ve-silme.md) | — | — | — |
| Yıldızlama | [yıldızlar, süzer](yildizlama.md) | [— (önizlemede var, karar yok)](yildizlama.md) | [— (önizlemede var, karar yok)](yildizlama.md) | — | — | — | — | — |
| Ödev serisi | [şeridi görür](seri.md) | — | — | — | — | — | — | — |
| Ödev hatırlatmaları | [bildirimi alır; tasarımda kural kurar](hatirlatmalar.md) | [kopyasını alır; tasarımda kendi kuralı](hatirlatmalar.md) | — | — | — | — | — | — |
| Müdürün ödev görünümü | — | — | — | — (ekran yolu yok) | [ders ders bakar](mudurun-odev-gorunumu.md) | — | — | — |
| Saklama ve silinme | [silinme gününü görür](saklama-ve-silinme.md) | [silinme gününü görür](saklama-ve-silinme.md) | [görür; son teslimle uzatır](saklama-ve-silinme.md) | [öğretmen gibi](saklama-ve-silinme.md) | [okulun alanında sayılır](saklama-ve-silinme.md) | — | — | — |

Notlar:

- **Çalışan** sütunu: bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol taşır; "Ödev verir" ve "Ödev sonuçlandırır"
  hazır Öğretmen rolünde açık gelir, ek rolden gelirse ders ve sınıf daraltması uygulanır. "Öğrenci portalına girer" yetkili
  kişi (ör. Rehber Öğretmen) öğrencinin ödevlerini portalından görür. Tasarımda (çalışan tanımı) öğretmen olmayan çalışan ödeve
  atanamaz, ödev vermez.
- **Öğretmen ya da müdür olan veli** çocuğunun ödevlerine menüdeki "Velisi olduğum → Ödevleri" ile, veli gibi bakar.
- **Servisçi** ve **sistem yöneticisi** ödev bölümünü kullanmaz (menülerinde yok; ödev verme ve yönetme uçları yalnız öğretmene
  ve müdüre açık); **giriş yapmamış ziyaretçi** de. Tasarımdaki **destek**, **eğitmen** ve **tahta** hesapları da ödev bölümünü kullanmaz.
- Okulda **"Ödevler" bölümü kapalıysa** bütün satırlar o okul için kapanır ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Quiz](../quiz/README.md) — ödevin içindeki quiz: ekleme, çözme, sonuçlar, öğrencinin cevapları.
- [Anketler](../anket/README.md) — anketi ödeve ekleme (tasarım).
- [Bildirimler](../bildirim/README.md) — "Yeni ödev", "… ödevi açıklandı", "Ödev güncellendi", "Yarın … ödevin var"; velinin kopyası, telefon bildirimi.
- [Takvim ve ajanda](../takvim/README.md) — ödevin son günü takvimde; tarih seçicideki noktalar; ajandada ödevler.
- [İlerleyiş](../ilerleyis/README.md) — ödev oranları ve ödev grafiği sonuçlardan hesaplanır.
- [Yazı düzenleyici](../yazi-yazma/README.md) — ödev açıklaması ve teslim metni (tasarım).
- [Dosya alanı ve küçültme](../okul-disk/README.md) — ekler ve teslim dosyaları okulun alanına sayılır; fotoğrafın küçültülmesi.
- [Okulun özellikleri](../ozellikler/README.md) — "Ödevler" bölümünü açma/kapatma.
- [Eğitim yılı](../egitim-yili/README.md) — ödev yıla damgalanır; geçmiş yıl salt okunur.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Ödev verir", "Ödev sonuçlandırır", ders ve sınıf daraltması.
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — öğretmenin derse atanması; "Sınıflarım"da öğrenci öğrenci verilen ödevler.
- [Öğretmenler ve çalışanlar](../ogretmenler-calisanlar/README.md) — okuldan çıkarılan öğretmenin sahipsiz ödevleri.
- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum, Çocuklarım.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrenci portalını açma, nakil.
- [Ana sayfa](../ana-sayfa/README.md) — "Ödevler" kutucuğu, "Yaklaşan ödevler", "Aktif ödevler".
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — "Ödevler" menü satırları, "İçerik Ara", "Yenile".
- [Hatırlatıcılar](../hatirlatici/README.md) ve [Hesap ayarları](../ayarlar/README.md) — tasarımdaki ödev hatırlatma kuralları.
- [Mesajlar](../mesaj/README.md) — aynı ek alanı; sonradan düzeltme.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — saklama süreleri, kim neyi görür.
- [Uygulama](../uygulama/README.md) — Android uygulamasına gelecek ödev ekranları, geri tuşu.
- [İşlem kaydı](../islem-kaydi/README.md) — ödev işlemleri işlem kaydına yazılmaz.
- [Site yönetimi](../yonetim/README.md) — yedekler.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — aynı açılır süzgeç düzeni.

## Kod belgeleri

- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`/api/assignments`: ver, listele, sonuçlandır, düzelt, yeniden
  aç, sil, açıldı, yıldız; teslim anı yardımcıları), [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) (teslim
  dosyaları), [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) (öğretmenin ekleri),
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`/api/progress`: öğrencinin ödev listesi, ödev serisi),
  [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`/api/school/assignments`: müdürün görünümü),
  [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md), [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) ("Yarın … ödevin var"),
  [sunucu/yetki.md](../../sunucu/yetki.md) (`odev.ver`, `odev.sonuclandir`), [sunucu/api.md](../../sunucu/api.md) (özellik ve
  arşiv yılı kapıları).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) (`odevler`, `odev_ogrencileri`, `odev_siniflari`),
  [sunucu/veri/depo/odev-dosyalari.md](../../sunucu/veri/depo/odev-dosyalari.md), [sunucu/veri/depo/ekler.md](../../sunucu/veri/depo/ekler.md),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirim ve veli kopyası), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (öğretmen ve müdür ekranları),
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (öğrencinin listesi, süzgeçler, pencere, yıldız,
  seri), [public/js/parcalar/14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md) (teslim dosyaları),
  [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md), [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md),
  [public/js/parcalar/04e-tarih-secici.md](../../public/js/parcalar/04e-tarih-secici.md), [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md),
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md).
- Testler: [testler/test-odev-saat.md](../../testler/test-odev-saat.md), [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md),
  [testler/test-kapsam.md](../../testler/test-kapsam.md), [testler/test-bildirim.md](../../testler/test-bildirim.md),
  [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md), [testler/test-quiz.md](../../testler/test-quiz.md),
  [testler/test-sinav.md](../../testler/test-sinav.md), [testler/test-siniflarim.md](../../testler/test-siniflarim.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ödev sistemi", "Ödev serisi", "Ödev teslim dosyaları",
  "Ekler (mesaj ve ödev)", "Müdürün ödev görünümü", "Filtreleme ve arama").
