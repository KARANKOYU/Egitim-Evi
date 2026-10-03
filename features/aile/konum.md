# Çocuğumun telefonu · Konum

**Durum:** Kodda var; tasarımda ek olarak haritada çocuğun adıyla iğne ve "12 dk önce" etiketi, telefon bölümünde "Durum:"
(ör. "Okulda · 12 dakika önce") ve "Pil:" satırları.

Çocuğun telefonunun en son gönderdiği konumu ve ondan önceki birkaç noktayı haritada gösteren kart.

## Ne işe yarar

Çocuğun nerede olduğunu (en son ne zaman nerede olduğunu) görürsün. Kullanıcının 26 Eylül isteği: veli aralığı seçer,
telefon internete bağlıyken o aralıkla konum gönderir, bağlı değilken "en son ne zaman nerede olduğu" görünür ve internete
bağlandığı ilk anda biriken konumlar gelir.

## Nereden açılır

[Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)'nda, "Bağlı telefon" kartının altındaki **"Konum"** kartı
(geniş ekranda "Ekran süresi" kartının solunda, dar ekranda üstünde).

Tasarımda (Tasarım 1 önizlemesi): sayfanın ilk bölümü olan **"Elif'in telefonu"** bölümünün içinde, "Durum / Pil / Konum"
satırlarının altında.

## Adım adım

### Veli

1. Sayfayı aç; "Konum" kartına bak.
2. Kart üç hâlden birindedir:
   - Paylaşım kapalı: "Konum paylaşımı kapalı (aşağıdaki ayarlardan açılır)." — [Paylaşım ayarları](paylasim-ayarlari.md)'ndan
     "Konumu paylaş"ı aç.
   - Henüz konum yok: "Henüz konum gelmedi. Telefon internete bağlanınca gelir."
   - Konum var: harita ve altında bilgi satırı.
3. Haritada:
   - **Son konum** ayrı bir işaretle durur, etiketi "Son konum · 3 dakika önce".
   - Ondan önceki **en çok 11 nokta** küçük işaretlerle görünür; her birinin etiketi o konumun zamanıdır ("25 dakika önce",
     "bugün 08:12", "2 Ekim 2026, Cuma 21:40").
   - Sağ üstteki düğmeler: **"+"** (Yakınlaştır), **"−"** (Uzaklaştır) ve hedef simgeli üçüncü düğme (adı "Hepsini
     göster": bütün noktaları sığdırır).
     Haritayı fareyle ya da parmağınla sürükleyerek kaydırırsın; iki parmakla, fare tekerleğiyle ya da çift tıklayarak
     yakınlaşırsın; haritaya tıklayınca ok tuşları ve artı/eksi de çalışır. Harita son konuma ortalanmış ve yakın (sokak
     düzeyinde) açılır; sağ altta "© OpenStreetMap katkıda bulunanlar" yazar.
4. Haritanın altında kalın **"Son konum: 3 dakika önce"** ve yanında:
   - konumun alındığı bağlantı: **"Wi-Fi"**, **"Mobil veri"** ya da **"Bağlantısız alındı"** (telefon o an internete bağlı
     değildi, konum sonradan geldi),
   - varsa doğruluk: "yaklaşık 12 m",
   - varsa pil: "pil %64".
5. Düğmeler:
   - **"Google Haritalar'da aç"** — son konumu Google Haritalar'da yeni sekmede işaretli açar (yol tarifini oradan
     alırsın).
   - **"Servisi"** — velinin Servis sayfasına götürür (servis aracının konumu, [Servisim ve servis kartı](../servis/servisim.md)).

Zaman nasıl yazılır: bir dakikadan yeniyse "az önce", bir saatten yeniyse "N dakika önce", bugünse "bugün 21:40", daha
eskiyse "2 Ekim 2026, Cuma 21:40" (tarayıcının saatiyle).

Tasarımda (Tasarım 1 önizlemesi):

- Bölümün başındaki satırlar: **"Durum:"** (ör. "Okulda · 12 dakika önce" ya da "Son konum 1 saat önce · okulda"), **"Pil:"**
  ("%64"), **"Konum:"** ("her 15 dakikada bir gelir"). "okulda" sözü çocuğun okulda olduğunu söyler; hangi kurala göre
  yazılacağı (ör. okulun haritadaki yerine uzaklık, [Okul adresi ve haritadaki yeri](../okul-sayfasi/okul-konumu.md))
  önizlemede tanımlı değil, kodlanırken belirlenmeli.
- Haritada çocuğun rengiyle telefon simgeli bir iğne ve üstünde sürekli duran etiket: "Can · 12 dk önce". Bugünkü haritadan
  farklı olarak fare tekerleği haritayı yakınlaştırmaz, sayfa kayar.
- Önizleme yalnız son konumu çizer; önceki noktalar, "Google Haritalar'da aç", "Servisi", ağ ve doğruluk bilgisi
  önizlemede yok. Kullanıcı bunları kaldırmayı istemedi; kodlanırken kalırlar.

### Öğrenci

Telefonun her konumla birlikte şunları gönderir: enlem ve boylam, doğruluk (metre), konumun alındığı an, bağlantı türü
(Wi-Fi, mobil veri ya da bağlantısız) ve pil yüzdesi. Ne sıklıkla gönderileceğini velin seçer; telefonunda bağlıyken bunu
görürsün ([Telefondaki izinler ve durum](izinler-ve-durum.md)).

## Kurallar ve sınırlar

- **Sunucunun süzgeci:** enlemi −90…90, boylamı −180…180 dışında olan; 7 günden eski ya da şimdiden 5 dakikadan ileri
  zamanlı konum atılır. Doğruluk 0–100 000 metreye kırpılır; pil 0–100 arası tam sayı değilse boş kalır; bağlantı türü
  "wifi" ya da "mobil" değilse "Bağlantısız alındı" sayılır.
- **Aynı an bir kez:** aynı zaman damgalı konum ikinci kez yazılmaz (telefon aynı parçayı yeniden gönderse de çift olmaz).
- **Bir gönderimde en çok 500 konum**; telefon fazlasını 500'erli parçalarla yollar.
- **Paylaşım kapalıyken** telefonun gönderdiği konum alınmaz; telefon da yeni ayarı alınca (en geç yarım saatte) konum
  almayı bırakır. Daha önce gelen konumlar silinmez, 7 gün durur.
- **Sayfaya gelen:** son 30 konum (yeniden eskiye); haritada bunların ilk 12'si (son konum + 11).
- **Saklama:** konumlar 7 gün sonra silinir (saatte bir temizlenir); yedeğe girmez ([Kim görür](mahremiyet.md)).
- **Dışarı giden:** harita resimleri OpenStreetMap'in sunucularından iner (bakılan bölgeyi ve IP adresini OpenStreetMap'e
  söyler; aydınlatma metninde yazılı). Konum Google'a yalnız "Google Haritalar'da aç"a basarsan gider.
- **Acil durum:** kullanım koşullarındaki söz: "Konumun doğruluğu telefona ve bağlantıya bağlıdır; acil durumlarda buna
  güvenilmemeli, resmî yardım hatları aranmalıdır." ([Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md))
- **Servis aracının konumu ayrı bir şeydir:** o, servisçinin telefonundan gelir ve servis sayfasında görünür
  ([Canlı konum ve servis haritası](../servis/canli-konum-ve-harita.md)).
- **Bilinen sorunlar:**
  - "Konumu paylaş" kapalıyken eski konumlar dururken sayfa hiç açılmaz (kartın yerine kırmızı "Cannot read properties of
    null (reading 'classList')"); kart "Konum paylaşımı kapalı" iletisini yalnız hiç konum kalmamışsa gösterebilir
    ([Paylaşım ayarları](paylasim-ayarlari.md#kurallar-ve-sınırlar)).
  - "Servisi" düğmesi bu çocuğa özel değildir: Servis sayfası bütün çocukların kartlarını gösterir; haritası şeritte seçili
    çocuğa, seçim yoksa son bakılan ya da ilk servisli çocuğa açılır. Servis bölümü çocukların okulunda kapalıysa "Bu bölüm
    okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir." çıkar.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Paylaşım ayarları](paylasim-ayarlari.md) — konumun ne sıklıkla geleceği ve açık/kapalı.
- [Ekran süresi](ekran-suresi.md) — yanındaki kart.
- [Telefondaki izinler ve durum](izinler-ve-durum.md) — konumun gelmesi için gereken izinler.
- [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md), [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Canlı konum ve servis haritası](../servis/canli-konum-ve-harita.md), [Servisim ve servis kartı](../servis/servisim.md).
- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `aileKonumKarti(d)`, `aileOnce(iso)`,
  sayfa işlevindeki `haritaKur($('aileHarita'), { merkez, zoom: 15, etiket: 'Çocuğun son konumu' })` ve işaretler (`secim`,
  `ben`), `aileHaritaKapat()`; [public/js/parcalar/19d-harita.md](../../public/js/parcalar/19d-harita.md) — `haritaKur`,
  `googleHaritaBaglantisi` ("Google Haritalar'da aç").
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `POST /api/aile/cihaz/konum` (süzgeç, 500 sınırı,
  paylaşım kapalıyken `{ alinan: 0, kapali: true }`), `GET /api/aile/ozet` (`sonKonum`, `konumlar` son 30);
  [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `konumEkle`, `sonKonumlar`, `temizle`.
- Tablo: `aile_konumlari` (şema 026, `UNIQUE (ogrenci_id, zaman)`; [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Android: `IzlemeServisi.java` (`onLocationChanged`, `konumlariGonder`), `Kuyruk.java`.
- CSS: `33-aile.css` (`.aile-konum-bilgi`, `.aile-dugmeler`), `27-harita-ortak.css` (`.harita-kap`) —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — süzgeç (sekiz öğeden iki geçerli), aynı zaman bir kez, 500
  sınırı, özette en yeni konum, paylaşım kapalıyken alınmaması.
- Tasarım: Tasarım 1 önizlemesi, öğrenci-veli paketi (çocuğun haritası, telefon bölümü).

## Sık sorulanlar

- **Konum neden eski?** Telefon internete bağlı değil, kapalı ya da "her zaman" konum izni verilmemiş olabilir; "Bağlı
  telefon" kartındaki "Son görülme"ye ve [Telefondaki izinler ve durum](izinler-ve-durum.md)'a bak.
- **"Bağlantısız alındı" ne demek?** Telefon o konumu internet yokken aldı, sonra internet gelince gönderdi.
- **Geçmiş bir günün bütün yolunu görebilir miyim?** Haritada son 12 nokta görünür; tam iz çizilmez. 7 günden eskisi zaten
  silinir.
- **Okul çocuğumun konumunu görür mü?** Hayır ([Kim görür](mahremiyet.md)).

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı) ve Tasarım 1 düzeni: telefon bölümünde "Durum / Pil / Konum"
  satırları, çocuğun adıyla iğne.
- Tam debug (iş 27): konum paylaşımı kapalıyken sayfanın açılmaması (harita kutusu yokken harita kurulmaya çalışılıyor).
- KVKK ve onay metinleri tam denetimi (iş 18): harita ve Google aktarımlarının aydınlatma metniyle karşılaştırılması.
