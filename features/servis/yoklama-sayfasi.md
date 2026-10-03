# Servis · Yoklama sayfası (servisçinin ekranı)

**Durum:** Kodda var; tasarımda ek olarak servisçinin ayrı ana sayfası (Yoklama menüde ikinci satır olur), saat dışında listenin yerine "Yoklama şu an kapalı" kartı, sefer sürerken "Sıradaki" kartı ve kalan yolu gösteren harita, her öğrenci satırında not düğmesi.

Servisçinin o günün servis yoklamasını aldığı, seferi başlatıp bitirdiği, sırayı ve notları yönettiği tek sayfa.

## Ne işe yarar

Kullanıcının isteği (26 Eylül): "hoca gibi yoklama orada yoklama sekmesi o dekmede o günün yoklamsı yoklama sadece müdürün
saatlerinde açık olur ve yanına sabah sa bindi/binmedi yazar birini seçer akşamda geldi seçer başta sonra başlat der indirdiğinde
basar". Öğretmenin ders yoklaması gibi: servisçi telefonundan girer, listede her öğrencinin yanındaki büyük düğmeye basar, işaret
anında velisine bildirim olarak gider.

Bu belge sayfanın genel düzenini anlatır; sabah ve akşamın adımları [Sabah seferi](sabah-seferi.md) ve
[Akşam seferi](aksam-seferi.md)'nde.

## Nereden açılır

- Servisçinin **ana sayfası**dır: girişten sonra doğrudan açılır. Sol menüde ilk satır **"Yoklama"** (servis simgeli); menünün
  geri kalanı "Mesajlar", "Takvim", "Hatırlatıcılar". Adres `#/ana`.
- Velinin "binmeyecek" bildirimine dokununca da buraya gelinir.
- Site açılırken adres Yoklama, Mesajlar, Takvim, Hatırlatıcılar ya da profil dışında bir sayfaysa (ör. eski bir yer imi) servisçi
  Yoklama'ya yönlendirilir.

Tasarımda: servisçinin menüsü **"Ana sayfa"**, **"Yoklama"**, **"Mesajlar"**, **"Takvim"**, **"Hatırlatıcılar"** (kullanıcı 1 Ekim:
"servisci e ana sayfa olabilir bence"). Ana sayfada "Yoklama" kutucuğu, "Bugünkü seferler" ve "Gelmeyecekler" var
([Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md)); Yoklama ayrı sayfa olur. Sayfa başlığı "Yoklama", altında
"Servis 3 · 07 ABC 123 · 1 Ekim Perşembe".

## Adım adım

### Servisçi — sayfanın düzeni (bugünkü site)

1. Büyük başlık **"YOKLAMA"**; altında tek servisin varsa servisin adı ve plakası ("1. Servis · 07 ABC 123"), birden çok servisin
   varsa okulun adı.
2. **Servis seçici** (birden çok servisin varsa): başlığın altında her servis için bir sekme düğmesi ("1. Servis · 07 ABC 123");
   seçili olan vurgulu. Başkasına dokununca sayfa o servisle yeniden açılır.
3. Bağlantı güvenli değilse (https değil) turuncu uyarı: "Konum yalnızca güvenli (https) bağlantıda gönderilir; yoklama yine de
   alınır. Okulun sitesine https ile gir."
4. **Üst kart:**
   - Başlık: **"Sabah yoklaması"** ya da **"Akşam yoklaması"**, yanında rozet "Bugün · 07:00–09:20" (yoklama açıkken yeşil,
     kapalıyken gri). Aralık dışında rozet sıradaki aralığı gösterir ("Yarın · 07:00–09:20").
   - Kapalıysa mavi bilgi kutusu: saat dışında "Yoklama sabah 07:00–09:20 ve akşam 16:30–19:00 arasında açılır. Sıradaki: yarın
     sabah 07:00–09:20."; sabah bitince "Okula varıldı; sabah yoklaması kapandı."; akşam bitince "Akşam seferi bitti; yoklama
     kapandı."
   - Saat bitmiş ama sefer uzatmada sürüyorsa turuncu: "Servis saati bitti; yoldaki sefer en çok 60 dakika daha sürer.
     İşaretlemeyi bitir."
   - **Sayılar** satırı: her zaman "6 öğrenci"; sabah "2 bindi", "1 binmedi"; akşam "3 geldi", "1 gelmedi", "2 indi"; sonra
     "2 bekliyor" (yoklama kapandıysa "2 işaretlenmedi") ve "1 binmeyecek". Sıfır olanlar yazılmaz.
   - Yoklama açıkken sefer bölümü ([Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md),
     [Canlı konum](canli-konum-ve-harita.md)).
5. **Liste kartı:** başlık "Öğrenciler (6)" (akşam sefer başladıktan sonra "Serviste olanlar (N)"), sağda **"Sırayı düzenle"**
   (iki ya da daha çok öğrenci varsa; [Sırayı düzenle](sira-duzenleme.md)). Altında açıklama:
   - aralık dışında: "Sıradaki aralığın listesi: velilerin işaretleri görünür, işaretleme saati gelince açılır."
   - yoklama kapandıysa: "Bugünün işaretleri."
   - sabah: "Alma sırasıyla. Her öğrencide "Bindi" ya da "Binmedi"ye bas; işaret hemen velisine gider."
   - akşam, sefer başlamadan: "Okulda servise gelenleri işaretle; bitince aşağıdaki "Başlat"a bas."
   - akşam, sefer başladıktan sonra: "Bırakma sırasıyla. Öğrenciyi evine bırakınca "İndi"ye bas."
   Serviste öğrenci yoksa: "Bu serviste öğrenci yok. Öğrencileri okul yönetimi ekler."
6. **Öğrenci satırı** (o dönemin sırasıyla):
   - Solda sıra numarası; adı; altında "7-A · durak · ev işaretli değil" (son parça yalnız evi işaretli değilse).
   - İşaretlendiyse saat: "Bindi 07:42" (sabah) ya da "Geldi 16:40 · İndi 17:10" (akşam).
   - Velinin işareti varsa uyarı simgesiyle: "Velisi: bugün binmeyecek · Doktor randevusu var." (işaret öbür dönem içinse "Velisi:
     bugün akşam binmeyecek"). İşaret bu dönem içinse ve öğrenci henüz işaretlenmediyse satır soluk.
   - O gün için yazdığın not: "Notun: Yarın 07:35'te hazır ol."
   - Evi işaretliyse **"Yol tarifi"** (Google Haritalar yol tarifini yeni sekmede açar).
   - Sağda (telefonda altta) büyük işaret düğmeleri: sabah **"Bindi"** / **"Binmedi"**; akşam **"Geldi"** / **"Gelmedi"**, sefer
     başladıktan sonra "Geldi" olan öğrencide tek **"İndi"**. Seçili düğmede onay işareti; basınca "Gönderiliyor..." yazar.
   - Yoklama kapalıysa düğme yerine durum rozeti: "Bindi" / "İndi" (yeşil), "Geldi" (mavi), "Binmedi" / "Gelmedi" (kırmızı),
     "Binmeyecek" / "İşaretlenmedi" (gri); eve bırakılan öğrencide "Eve bırakıldı".
   - İşaret gönderilemediyse satırda kırmızı ileti ve **"Yeniden dene"**.
7. **Alt kart:** sabah **"Okula vardık"**; akşam **"Başlat"**, sefer başladıktan sonra serviste kalan sayısı ve sefer açık olduğu
   sürece küçük **"Seferi bitir"** ([Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md)).
8. **"Notlar"** kartı ve **"Not yaz"** ([Velilere not](gunluk-not.md)); varsa **"Velilerin "binmeyecek" işaretleri"** kartı
   ([Binmeyecek](binmeyecek.md)).
9. **"Harita"** kartı: okul, evi işaretli öğrenciler (sıra numarası ve adıyla, "1. Elif") ve sefer sürerken senin yerin ("Sen");
   altında "Okul, evi işaretli öğrenciler (sıra numarasıyla) ve sefer sürerken senin yerin."
   ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)).

### Servisçi — sayfa kendiliğinden ne yapar

- Sayfa açıkken **dakikada bir** sessizce tazelenir (velilerin yeni "binmeyecek" işaretleri, dönemin değişmesi). Sekme arka plandaysa,
  bir pencere açıksa ya da yolda işaret varsa bekler.
- Her işaret **anında**, tek tek sunucuya gider; aynı anda birkaç işarete basabilirsin, hepsi bitince liste sunucudan yeniden alınır.
- Dönem bu arada değiştiyse (ör. sabah sayfası açık kaldı, saat akşam oldu) işaret yanlış döneme yazılmaz: sayfa baştan yüklenir ve
  "Yoklamanın dönemi değişti; sayfayı yenile." gibi ileti çıkar.
- Klavyeyle ya da ekran okuyucuyla kullanırken işaret gidip satır yeniden çizilince odak aynı öğrencinin düğmesine döner.

### Müdür, öğretmen ve çalışan

Bu sayfayı görmezler; okul yönetimi her servisin bugünkü yoklamasını salt okunur bir pencerede görür
([Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md)).

### Öğrenci ve veli

Bu sayfayı görmezler; işaretler onlara bildirim ve servis kartındaki "bugün" bölümü olarak ulaşır
([Servis bildirimleri](servis-bildirimleri.md), [Servisim ve servis kartı](servisim.md)).

### Tasarımda (Tasarım 1 önizlemesi)

- **Saat dışında** liste gösterilmez; yerine kilit simgeli **"Yoklama şu an kapalı"** kartı: "Yoklama sabah 07:00–09:20 ve akşam
  16:30–19:00 arasında açılır." ve "Sıradaki: bugün akşam 16:30–19:00. Saatleri okul müdürü belirler."; sabah bitmişse özet "Bu sabah:
  5 öğrenci bindi, 1 binmedi · okula varış 08:12."; kartın altında **"Sırayı düzenle"**.
- Üst kart: "Sabah yoklaması" ya da **"Akşam yoklaması · eve dönüş"**, yanında "Bugün · 07:00–09:20"; sayılarda akşam sefer
  başlayınca "geldi" yerine **"serviste"**, "indi" yerine **"eve bırakıldı"**.
- Sefer sürerken listenin üstünde **"Sıradaki"** kartı ve haritası ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)).
- Her öğrenci satırının sonunda zarf simgeli **"Not yaz"** düğmesi; sıradaki öğrencinin satırı vurgulu ve "sıradaki" yazılı.
- Önizlemedeki "Önizleme saati" düğmeleri (sabah / servis saati dışında / eve dönüş) yalnız denemek içindir; gerçek sitede yoktur,
  dönemi sunucunun saati belirler.

## Kurallar ve sınırlar

- **Kim:** yalnız servisçi, yalnız kendi servisleri. Başka servisçinin servisi: "Bu servis sana atanmamış" (403); servisçi olmayan biri
  işaret atmaya kalkarsa "Bu işi servisin servisçisi yapar" (403). Seçilen servis artık senin değilse sayfa ilk servisine döner.
- **Servis atanmadıysa:** "Sana henüz bir servis atanmadı. Okul yönetimi servise atayınca öğrenciler burada görünür."
- **Bölüm kapalıysa:** "Servis bölümü okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir."
- **Dönem sunucunundur:** sabah mı akşam mı, açık mı kapalı mı kararını sunucu okulun [servis saatlerine](servis-saatleri.md) ve
  Türkiye saatine göre verir; telefonun saatine güvenilmez.
- **İşaret değiştirmek:** sabah "Bindi" ↔ "Binmedi" "Okula vardık"a kadar değişir; akşam "İndi" konan öğrencinin işareti artık
  değişmez ("Öğrenci eve bırakıldı; bu işaret artık değiştirilemez."). Aynı işarete yeniden basmak bir şey yapmaz.
- **Hatalar:** internet yoksa satırda "Gönderilemedi: internet bağlantısı yok." ve "Yeniden dene"; sunucunun iletisi varsa o yazar.
  Dönem değiştiyse ya da yoklama kapandıysa sayfa yeniden yüklenir ve ileti sayfanın üstünde mavi çıkar.
- **Konum** yalnız https'te ve sayfa açıkken gider (telefonu kilitleme, ekran kararmasın diye ekran kilidi tutulur); yoklama https
  olmadan da alınır ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)).
- **Saklama:** yoklama, notlar, "binmeyecek" işaretleri ve bildirim kayıtları 30 gün sonra silinir
  ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- **Bilinen açıklar (kod bugün böyle):**
  - Başka servise geçmek açık seferi durdurmaz: A servisinin seferi sürerken B'ye geçen servisçinin telefonu A için konum
    göndermeyi sürdürür, A'nın durum kutusu ekranda görünmez.
  - Servis seçici sekmesi hata verirse kişi ileti görmez, eski liste ekranda kalır.
  - Sayfadan çıkınca dakikalık tazeleme zamanlayıcısı hemen değil, bir sonraki turda durur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Sabah seferi](sabah-seferi.md) ve [Akşam seferi](aksam-seferi.md) — dönemlerin adımları.
- [Sırayı düzenle](sira-duzenleme.md), [Velilere not](gunluk-not.md), [Binmeyecek](binmeyecek.md).
- [Servis saatleri](servis-saatleri.md) — sayfanın ne zaman açık olduğu.
- [Canlı konum ve servis haritası](canli-konum-ve-harita.md) — sayfadaki harita ve konum gönderimi.
- [Servis bildirimleri](servis-bildirimleri.md) — işaretlerin veliye gidişi; [Servise binmedi uyarısı](servise-binmedi-uyarisi.md) (tasarım).
- [Servisçi hesabı](servisci-hesabi.md) — sayfaya nasıl girilir.

**İlgili:**

- [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md) (tasarım), [Sol menü](../menu-ve-arama/sol-menu.md).
- [Ders yoklaması](../devamsizlik/ders-yoklamasi.md) — öğretmenin yoklaması (bu sayfanın örnek aldığı ekran).
- [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — servisçinin uygulamadaki Yoklama sekmesi (tasarım).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) — `servisYoklamaSayfasi`,
  `syBolumleriCiz`, `syUstHtml`, `sySayilarHtml`, `syListeHtml`, `sySatirHtml`, `syAltHtml`, `syNotlarHtml`, `syZamanla`
  (60 sn), `sy-servis`, `sy-isaret`, `sy-yeniden`; ana sayfa yönlendirmesi
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md), menü
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md). Görünüm `public/css/parcalar/34-servis-yoklama.css`
  ([CSS.md](../../public/css/parcalar/CSS.md)).
- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/servis/yoklama[?servisId=]`
  (`yoklamaCevabi`, `bosYoklama`: dönem, aralık, uzatma, sonraki aralık, sıralı öğrenciler, sayılar, sefer, notlar, "binmeyecek"ler),
  `POST /api/servis/yoklama`, `yoklamaEngeli`. Saat hesabı [sunucu/yardimci/servis-pencere.md](../../sunucu/yardimci/servis-pencere.md).
- Depo: [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md) — `servis_yoklamalari`, `servis_gunleri`,
  `servis_olaylari`, `servis_notlari`, `servis_binmeyecek`.
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md), [testler/test-servis-pencere.md](../../testler/test-servis-pencere.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Servisçinin Yoklama sayfası").

## Sık sorulanlar

- **Yoklamayı neden göremiyorum, düğmeler yok?** Servis saati dışındasın; liste sıradaki aralığın sırasıyla görünür, düğmeler saat
  gelince çıkar. Saatleri okul yönetimi belirler.
- **İnternet gitti, işaretlerim kayboldu mu?** Gönderilemeyen işaretin satırında "Yeniden dene" çıkar; bağlantı gelince bas.
- **İki servisim var, nasıl geçerim?** Başlığın altındaki servis düğmelerinden birine dokun.
- **Velinin "binmeyecek" dediği öğrenciyi yine işaretleyebilir miyim?** Evet; satırı soluktur ama düğmeler çalışır.

## Sırada

- Linux kodlaması (Tasarım 1): servisçinin ayrı ana sayfası, "Yoklama şu an kapalı" kartı, "Sıradaki" kartı ve kalan yol, satırdaki
  not düğmesi.
- Android yerel uygulama: servisçinin "Yoklama" ve "Harita" sekmeleri; seferi arka planda konum gönderen servisle başlatma.
- "Bugün servise binmedi" uyarısı (3 Ekim kararı): sabah seferi bitince binmeyen öğrencinin velisine "Önemli" öncelikli bildirim.
- TAM DEBUG: başka servise geçince açık seferin durması, servis seçicinin hata iletisi.
