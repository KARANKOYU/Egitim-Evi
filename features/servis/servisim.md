# Servis · Servisim ve servis kartı

**Durum:** Kodda var; tasarımda ek olarak velide her çocuk ayrı oturum (sayfa yalnız o oturumdaki çocuğu gösterir), "Bugün" zaman çizelgesi (Bindi → Okula vardı → Okuldan servise bindi → Yolda → Eve bırakıldı) ve tahmini eve varış saati.

Öğrencinin kendi servisini, velinin çocuğunun servisini gördüğü sayfa: servis kartı her zaman, bugünkü durum ve sıra servis saatlerinde.

## Ne işe yarar

"Çocuğum hangi serviste, şoförün telefonu ne, bu sabah bindi mi, kaçıncı sırada?" sorularının cevabı. Kullanıcının sözleri (26 Eylül):
"müdürün seçtiği aralıkta veli görebilcek ... servise bindi dicek ve kaçıncı olduğu sırada görüntülebilcek ve kaç kişi kaldığı".
Kartın altında servisin haritası durur ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)).

## Nereden açılır

| Rol | Menüdeki yeri |
|---|---|
| Öğrenci | **"Servisim"**: çizginin altında "Yemek Listesi"nin hemen altında |
| Veli | **"Servis"**: "Yemek Listesi" ile "Çocuğumun telefonu" arasında |
| Çocuğu olan öğretmen ("Servisleri ... düzenler" yetkisi yoksa) | "Velisi olduğum" başlığının altında **"Servisi"** |
| Çocuğu olan müdür (ya da yetkili öğretmen) | **"Servisler"** sayfasının en üstünde çocuğun kartı |

Adres `#/servis`. Servis bildirimine dokununca `#/servis?c=<çocuk>` açılır: o çocuk seçilir, birden çok çocukta sayfa onun kartına
kayar. Telefonda ☰ menüsünde aynı satır.

Tasarımda: öğrencide başlık "Servisim", altında "Servis 3 · 07 ABC 123 · Gül Sokak durağı"; velide başlık "Servis", altında "Elif ·
Servis 3 · 07 ABC 123".

## Adım adım

### Öğrenci

1. Menüden **"Servisim"**. Büyük başlık "SERVİS", altında "Servis ve şoför bilgileri, bugünkü durum ve servisin haritası."
2. **Servis kartı** (başlık servisin adı, servis simgeli). Satırlar (boş olan yazılmaz):
   - **"Plaka"**, **"Şoför"** (adı · dokununca arayan telefon bağlantısı "+90 532 …"), **"Rehber"** (adı · telefonu),
     **"Sabah kalkış"**, **"Akşam kalkış"**, **"Durak"**, **"Güzergâh"** (satır sonları korunur).
3. Kartın altındaki **"bugün" bölümü**:
   - Servis saatindeyse başlık **"Bu sabah"** ya da **"Bu akşam"** ve renkli rozet (tablo aşağıda); sırası varsa servis simgesiyle
     "5. sırada, önünde 2 öğrenci kaldı" ya da "… önünde öğrenci kalmadı".
   - Saat dışındaysa soluk satır: "Servisin yeri, sırası ve bugünkü durumu yalnız servis saatlerinde görünür (sabah 07:00–09:20,
     akşam 16:30–19:00). Sıradaki: yarın sabah 07:00–09:20."
   - Servisçinin notları: zarf simgesiyle **"Servisçinin notu · yarın"** (bütün servise yazıldıysa "(bütün servise)") ve metin
     ([Velilere not](gunluk-not.md)).
   - Velinin işaretleri: takvim simgesiyle **"Yarın sabah binmeyecek"** ve notu ([Binmeyecek](binmeyecek.md)).
4. Telefon bildirimleri bu cihazda kapalıysa **"Servis yaklaşınca haber al"** kartı: "Telefon bildirimlerini açarsan uygulama kapalıyken
   de bildirim gelir." ve **"Bildirimleri aç"** ([Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md)).
5. **"Servisin nerede?"** kartı: harita ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)) ve **"Evimi işaretle"**
   ([Evin yerini işaretleme](evi-isaretleme.md)).
6. Servis kaydın yoksa yalnız: "Servis kaydın yok. Servise biniyorsan okul yönetimine söyle."

### Veli

1. Menüden **"Servis"**. Başlık "SERVİS".
2. Her çocuğun için bir kart; başlıkta çocuğun adı soyadı, ilk satır **"Servis"** (servisin adı), sonra öğrencideki satırlar ve "bugün"
   bölümü. Sırada çocuğun adı da yazar: "Zeynep 5. sırada, önünde 2 öğrenci kaldı".
3. Her kartın "bugün" bölümünün altında **"Binmeyecek"** düğmesi ve "Servise binmeyeceği günü servisçiye bildir."
   ([Binmeyecek](binmeyecek.md)).
4. Servisi olmayan çocuğun kartında yalnız adı ve "Servis kaydı yok."
5. Servisli çocuğun varsa öneri kartı ("Servis yaklaşınca haber al") ve **"Servis haritası"** kartı. Birden çok servisli çocuğun varsa
   haritanın üstünde çocukların ilk adlarıyla düğmeler; seçili olan vurgulu, öbürleri gri. Hangi çocuğun haritasının açılacağı: veli
   panelinin şeridinde seçili çocuk (ya da bildirimden gelinen çocuk), yoksa en son baktığın, yoksa ilk servisli çocuk.
6. Hiç çocuğun yoksa: "Servis bilgileri okul yönetimindedir."

**"Bugün" rozetleri** (öğrenci ve velide aynı):

| Dönem | Durum | Rozet | Yanındaki yazı |
|---|---|---|---|
| Sabah | Bindi, okula varıldı | yeşil "Okula vardı 08:05" | "Bindi 07:42" |
| Sabah | Bindi | yeşil "Bindi 07:42" | — |
| Sabah | Binmedi | kırmızı "Bu sabah binmedi" | — |
| Sabah | Veli "binmeyecek" dedi | gri "Bu sabah binmeyecek" | — |
| Sabah | İşaretsiz | gri "Henüz binmedi" (sefer bittiyse "Servis okula vardı") | — |
| Akşam | İndi | yeşil "Eve bırakıldı 17:10" | — |
| Akşam | Geldi | mavi "Okuldan servise bindi 16:40" | "Servis yolda" ya da "Servis henüz yola çıkmadı" |
| Akşam | Gelmedi | kırmızı "Akşam servise gelmedi" | — |
| Akşam | Veli "binmeyecek" dedi | gri "Bu akşam binmeyecek" | — |
| Akşam | İşaretsiz | gri "Henüz servise binmedi" (sefer bittiyse "Akşam seferi bitti") | — |

"Bugün" bölümü harita her yenilendiğinde (sefer varken 5 saniyede, servis saatinde 30 saniyede, saat dışında 2 dakikada bir) kendiliğinden
tazelenir; velide yalnız haritası açık olan çocuğun kartı tazelenir, öbür çocukların kartı sayfa yeniden açılınca güncellenir.

### Öğretmen ve müdür (kendi çocuğu için)

Öğretmende "Velisi olduğum" → "Servisi" sayfası velininkiyle aynıdır ("Binmeyecek" dahil). Müdürde ve servis yetkili öğretmende çocuğun
kartı ve haritası "Servisler" sayfasının en üstünde, yönetim bölümünün üzerinde durur. Bu sayfada bölüm adı "SERVİS", alt yazı yönetimin
alt yazısıdır.

### Servisçi

Bu sayfayı kullanmaz; adresle açarsa "Servis bilgileri okul yönetimindedir."

### Tasarımda (Tasarım 1 önizlemesi)

- **Velide her çocuk ayrı oturum** (kullanıcının 3 Ekim kararı: iki çocuk tek oturumda birlikte gösterilmez). "Servis" sayfası yalnız o
  oturumdaki çocuğun servisini gösterir; çocuk düğmeleri ve birden çok kart yok. Öbür çocuk için Portallarım'dan onun oturumuna geçilir
  ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
- **"Servis bilgisi"** grubu: "Servis:" (Servis 3 · 07 ABC 123), "Şoför:", "Telefon:", "Durak:", "Servis saatleri:" (sabah 07:00–09:20,
  akşam 16:30–19:00).
- Servis saatinde **"Bugün"** grubu (velide "Bugün · Elif"), sağda tarih ("1 Ekim Perşembe"); zaman çizelgesi:
  "Bindi 07:41" (sabah · Gül Sokak durağı) → "Okula vardı 08:12" (sabah) → "Okuldan servise bindi 16:40" (akşam) → "Yolda · 5. sırada,
  önünde 2 öğrenci" (akşam · **tahmini eve varış 17:10**) → "Eve bırakıldı" (bekleniyor). Tamamlananlar yeşil, şimdiki vurgulu,
  bekleyen soluk.
- **"Servis haritası"** grubu, servis saatinde "canlı" rozeti; altında "Servise binmeyeceği(m) günler" ([Binmeyecek](binmeyecek.md)).
- Önizlemede servisçinin notları kartta gösterilmiyor; kullanıcı notların kaldırılmasını istemedi, bugünkü site gibi kalır.
- Tahmini eve varış saati için tanımda hesap kuralı yok (kodlanmadan önce belirlenmeli: ör. kalan duraklar ve ortalama hız).
- Önizlemedeki "Önizleme saati" düğmeleri yalnız denemek içindir.

## Kurallar ve sınırlar

- **Kim görür:** öğrenci kendi servisini, veli yalnız bağlı çocuklarının servisini; okul yönetimi bütün servisleri. Başka çocuğun
  bilgisi hiçbir yoldan gelmez.
- **Şoför ve rehber telefonu** yalnız o servisteki öğrenciye, velisine ve okul yönetimine gider. Şoför satırında, serviste elle yazılmış
  şoför adı yoksa servisçi hesabının adı ve telefonu çıkar.
- **Servis kartı her zaman** görünür; **canlı bilgi** (bugünkü durum, sıra, aracın yeri) yalnız okulun servis saatlerinde ya da sefer
  60 dakikalık uzatmada sürerken ([Servis saatleri](servis-saatleri.md)).
- **"Önünde N"**: sabah, sırada önde olup henüz işaretlenmemiş ve "binmeyecek" denmemiş öğrenciler; akşam, sırada önde olup "Geldi"
  işaretlenmiş ve inmemiş öğrenciler ([Sırayı düzenle](sira-duzenleme.md)).
- **Kapalı bölüm:** okul "Servis"i kapattıysa menüden kalkar; adres açılırsa "Bu bölüm okulunda kapalı. Okul müdürü Özellikler
  sayfasından açabilir." Velide çocuklardan birinin okulunda açıksa sayfa açılır, kapalı okuldaki çocuğun kartında "Servis kaydı yok."
- **Öğrencinin portalına bakarken** (veli, müdür ya da yetkili öğretmen) menüde servis satırı yoktur.
- **Sistem yöneticisi** ve giriş yapmamış ziyaretçi bu sayfayı göremez.
- **Bilinen açık (kod bugün böyle):** "Düzenle → Kaydet" servisçi adını servisin şoför alanına kopyaladığı için, servisçi değişince
  kartta eski servisçinin adı ve telefonu kalabilir ([Servisler sayfası](servisler-sayfasi.md)). Velide harita seçimi veli panelinin
  şeridine bağlıdır: şeritte bir çocuk seçiliyse harita hep onunla açılır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Canlı konum ve servis haritası](canli-konum-ve-harita.md), [Evin yerini işaretleme](evi-isaretleme.md).
- [Binmeyecek](binmeyecek.md), [Velilere not](gunluk-not.md).
- [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md) — rozetlerin kaynağı.
- [Servis saatleri](servis-saatleri.md), [Sırayı düzenle](sira-duzenleme.md).
- [Servis bildirimleri](servis-bildirimleri.md), [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md).
- [Servisler sayfası](servisler-sayfasi.md) — kartta yazanları okul girer.

**İlgili:**

- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Çocuklarım](../portallar/cocuklarim.md).
- [Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md) — servis durumu (Android tasarımında ana sayfada).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Telefonda menü](../menu-ve-arama/telefonda-menu.md).
- [Kapalı bölüm](../ozellikler/kapali-bolum.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).
- [Çocuğumun telefonu](../aile/README.md) — çocuğun kendi telefonunun konumu (servisten ayrı).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/servis` (`benim`, `cocuklar[].servis`,
  `bugun`; `servisGorunumu`, `ogrenciBugunu`, `binmeyecekDuzenleyebilir`); kapalı bölüm
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md).
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `SAYFALAR.servis`, `servisSayfasi`,
  `servisBilgiKarti`, `servisBugunIc`, `servisDurumu`, `servisSiraYazisi`, `telBaglanti`, `servisBugunGuncelle`; öneri kartı
  [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) (`servisBildirimOnerisi`); menü
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md); bildirimden gelinen çocuk
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md). Görünüm `26-anket-okul-hayati.css`,
  `34-servis-yoklama.css` ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) (öğrencinin bugünkü durumu, şoför telefonunu kim görür),
  [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) ("Bindi HH:MM", "Okula vardı HH:MM", "Eve bırakıldı HH:MM"),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md) (iki okullu velide kapalı okul).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yemek listesi, servis …" ve "Servis yoklaması" → "Veli ve öğrenci").

## Sık sorulanlar

- **Servisi nasıl takip ederim?** (sitenin SSS'si) Öğrenci Servisim sayfasında kendi servisini, veli Servis sayfasında çocuğununkini
  görür; servis saatlerinde bugünkü durum ve sıra da görünür, sefer sürerken araç haritada.
- **Saat dışında neden "bugün" bölümü boş?** Bugünkü durum, sıra ve aracın yeri yalnız servis saatlerinde görünür; kart her zaman durur.
- **Şoförün telefonu yanlış.** Okul yönetimine söyle; servisin "Düzenle" penceresinden düzeltilir.
- **İki çocuğum var, ikisinin servisi de görünüyor mu?** Bugün evet, iki kart alt alta ve haritada çocuk düğmeleri. Tasarımda her çocuk
  ayrı oturumda.

## Sırada

- Velide her çocuk ayrı oturum (3 Ekim kararı): servis sayfası yalnız o oturumdaki çocuğu gösterecek; gerçek kod buna göre denetlenecek.
- Linux kodlaması (Tasarım 1): "Bugün" zaman çizelgesi ve tahmini eve varış.
- Android yerel uygulama: öğrencinin ve velinin "Servis" sekmesi (kart, harita, sıra, bugünkü durum, notlar, "Binmeyecek").
- Tek kişi tek hesap + portallar öğrencide de: öğrenci okul ve dershaneye bağlıysa servis kurum başına ayrılacak.
- Çok dil: rozet ve satır yazılarının çeviri kataloğuna girmesi.
