# public/js/parcalar/19c-okul-hayati.js

Okulun gündelik hayatının üç sayfası: haftalık **Yemek listesi**, **Servis** (öğrencinin ve velinin servis kartı, bugünkü
durum, "binmeyecek" işareti; yönetimin servisleri, servis saatleri ve servisçileri) ve **Kulüpler** (katıl/ayrıl, kulüp
açma, üye listesi).

## Bu dosya ne yapar?

Derslerin dışında da sorulan sorular var: bu hafta yemekte ne var, çocuğum hangi serviste, servis bugün bindi mi, hangi
kulübe üye. Bu dosya bu üç konunun ekranlarını çizer. Sunucu tarafı tek bir bölümdür
([../../../sunucu/bolumler/okul-hayati.md](../../../sunucu/bolumler/okul-hayati.md)); kimin neyi göreceğine ve
düzenleyeceğine orası karar verir, bu dosya yalnız sunucunun "yapabilirsin" dediği kişiye düğme çizer (`duzenleyebilir`,
`yonetir`, `uyeleriGorur`, `binmeyecekDuzenleyebilir` gibi bayraklarla).

- **Yemek listesi** (`#/yemek`): haftanın günleri kart kart, bugün vurgulu; "Önceki hafta / Sonraki hafta" ile gezilir.
  Hafta sonu kartı yalnız menü girildiyse görünür. Müdür ya da `yemek.yonet` yetkili öğretmen "Bu haftayı düzenle" ile
  yedi günü tek pencerede yazar. Veli çocuğunun okulunun menüsünü görür; birden çok okul varsa okul okul başlık konur.
- **Servis** (`#/servis`): rolüne göre üç ayrı görünüm.
  - Öğrenci ("Servisim"): kendi servis kartı (plaka, şoför, rehber, telefonlar, kalkış saatleri, durak, güzergâh) ve
    kartın altında "bugün" bölümü; altında "Servisin nerede?" haritası.
  - Veli ("Servis"; çocuğu olan öğretmende "Servisi"): her çocuğun kartı, "bugün" bölümü ve **Binmeyecek** düğmesi; altta
    tek bir "Servis haritası" (birden çok servisli çocuk varsa çocuk düğmeleriyle).
  - Yönetim ("Servisler"; müdür ya da `servis.yonet` yetkilisi): okulun **servis saatleri** kartı, servis listesi
    (bugünkü yoklamaya bakma, öğrenci ekleme, düzenleme), her servisin öğrencileri (harita, çıkar) ve servisçi hesapları.
  Harita bu dosyada değil: [19e-servis-konum.md](19e-servis-konum.md) çizer; harita bileşeni
  [19d-harita.md](19d-harita.md)'dedir. Servisçinin kendi Yoklama ekranı da ayrı (`19i-servis-yoklama.js`).
- **Kulüpler** (`#/kulupler`): okulun kulüpleri; öğrenci başvurusu açık kulübe kendisi katılır ya da ayrılır. Yönetim
  (müdür ya da `kulup.yonet`) kulüp açar ve düzenler; yönetim ve kulübün danışmanı üye listesini görüp üye ekler/çıkarır.
  Veli yalnız çocuklarının üye olduğu kulüpleri görür.

## İçinde neler var?

### Yemek listesi

- `YEMEK_GUN` — Pazartesi'den Pazar'a gün adları (sunucunun haftası pazartesiden başlar).
- `gunEkleYerel(gun, n)` — `'YYYY-AA-GG'` gününe `n` gün ekler. Adı "yerel" olsa da öğle 12:00 UTC üstünden hesaplar;
  cihazın saat diliminden etkilenmez. Bu dosyanın servis kısmı da kullanır (`svGunEtiketi`'nin "yarın"ı, "binmeyecek"
  penceresinin gün listesi). Başka parça onu doğrudan çağırmaz; `19i` yalnız `svGunEtiketi` üzerinden dolaylı kullanır.
- `gunKisa(gun)` — "29 Eylül" (`AY_ADI`, [02-ikonlar.md](02-ikonlar.md)).
- `bugunYerel()` — cihazın yerel takvim günü; yalnız "bugün" kartını vurgulamak için.
- `SAYFALAR.yemek()` — `GET /api/yemek[?bas=…]`. `S.yemekBas` doluysa o hafta istenir. Cevap `S.yemekVeri`'ye konur.
  Çizilenler: hero "YEMEK LİSTESİ"; hafta gezgini (`yemek-hafta` düğmeleri `data-bas` = `bas` ∓ 7 gün; dar ekranda
  "hafta" sözcüğü `span.genis` ile gizlenir); hiç okul yoksa boş kutu "Bağlı olduğun bir okul yok."; her okul için
  (birden çok okul varsa ya da kişinin kendi okulu yoksa `h3.sb` başlıkla) yedi gün kartı: gün adı ve tarihi, menü
  satır satır (`<li>`, `esc`'li), varsa "650 kcal", menü yoksa "Menü girilmedi". Cumartesi/Pazar menüsüz ise hiç
  çizilmez. `duzenleyebilir` ise "Bu haftayı düzenle".
- `EYLEMLER['yemek-hafta']` — `S.yemekBas`'ı düğmenin `data-bas`'ı yapar, sayfayı yeniden çizer.
- `EYLEMLER['yemek-duzenle']` — "29 Eylül – 5 Ekim menüsü" penceresi: her gün için menü kutusu (`textarea.yMenu`,
  `data-tarih`, en çok 500 karakter; hafta içi 3, hafta sonu 1 satır yüksekliğinde, örnek yazılı) ve kalori kutusu
  (`input.yKalori`, 1–5000). Üstte "Her satıra bir yemek yaz. Boş bırakılan günün menüsü silinir." Yalnız ilk okulu
  (`okullar[0]`) düzenler; sunucu kişinin kendi okulunu hep ilk sıraya koyduğu için bu doğru okuldur.
- `EYLEMLER['yemek-kaydet']` — sayfadaki bütün `.yMenu` ve `.yKalori` kutularını sırayla eşleyip
  `POST /api/yemek { gunler: [{ tarih, menu, kalori }] }` (7 gün) gönderir. Başarıda pencere kapanır, sayfa yeniden
  çizilir (ayrı bir "kaydedildi" iletisi yok); hata pencerede (`#yMesaj`).

### Servis: tarih ve yazı yardımcıları (çoğunu `19e` ve `19i` de kullanır; kimin neyi kullandığı "Kimle konuşur?"da)

- `SV_GUN_ADI` — Pazar'dan başlayan gün adları (`getUTCDay` sırası).
- `svTrGun(n)` — Türkiye günü (`Date.now()` + 3 saat, UTC gününe çevrilir) + `n` gün: `'2026-09-29'`. Türkiye 2016'dan beri
  yaz saati uygulamadığı için sabit +3 yeterli.
- `svGunAdi(t)` — "29 Eylül Salı".
- `svGunEtiketi(t, bugun?)` — "bugün", "yarın" ya da "29 Eylül Salı" (`bugun` verilmezse `svTrGun(0)`).
- `svBuyukBas(s)` — Türkçe kurala göre ilk harfi büyütür ("yarın" → "Yarın", "işaret" → "İşaret").
- `svIlkAd(ad)` — soyadını atar: "Zeynep Şahin" → "Zeynep", "Ayşe Nur Yılmaz" → "Ayşe Nur"; tek sözcükse kendisi
  (bildirimlerdeki gibi).
- `servisAralikMetni(s)` — `{ sabahBas, sabahBit, aksamBas, aksamBit }` → "sabah 07:00–09:20, akşam 16:30–19:00".
- `servisSonrakiMetni(s)` — sunucunun `sonraki` nesnesi `{ donem, tarih, bas, bit }` → "yarın sabah 07:00–09:20".
- `svIsaretDonemi(x)` — "binmeyecek" işaretinden "sabah ve akşam" / "sabah" / "akşam".
- `servisSiraYazisi(b, ad, kaldi)` — "Zeynep 5. sırada, önünde 2 öğrenci kaldı" ya da "… önünde öğrenci kalmadı".
  Yalnız canlıyken (`b.canli`) ve sunucu `sira` ile `onunde`'yi doldurduysa; değilse `''`. `kaldi` "kaldı" sözcüğünü ekler
  (kartta var, haritanın durum satırında yok).
- `servisDurumu(b)` — bugünkü durumu `{ renk, metin, ek? }` olarak verir (`etiket <renk>` rozeti):

  | Dönem | Durum | Rozet | Ek yazı |
  |---|---|---|---|
  | sabah | `bindi` ve okula varıldı | yeşil "Okula vardı 08:05" | "Bindi 07:42" |
  | sabah | `bindi` | yeşil "Bindi 07:42" | — |
  | sabah | `binmedi` | kırmızı "Bu sabah binmedi" | — |
  | sabah | velisi "binmeyecek" dedi | gri "Bu sabah binmeyecek" | — |
  | sabah | işaretsiz | gri "Servis okula vardı" (sefer bittiyse) / "Henüz binmedi" | — |
  | akşam | `indi` | yeşil "Eve bırakıldı 17:10" | — |
  | akşam | `geldi` | mavi "Okuldan servise bindi 16:40" | "Servis yolda" / "Servis henüz yola çıkmadı" |
  | akşam | `gelmedi` | kırmızı "Akşam servise gelmedi" | — |
  | akşam | velisi "binmeyecek" dedi | gri "Bu akşam binmeyecek" | — |
  | akşam | işaretsiz | gri "Akşam seferi bitti" / "Henüz servise binmedi" | — |

### Servis kartı (öğrenci ve veli)

- `servisBugunIc(b, ogrenciId, ad, veli)` — kartın "bugün" bölümü. Canlıysa "Bu sabah"/"Bu akşam" + durum rozeti + sıra
  satırı; canlı değilse soluk satır: "Servisin yeri, sırası ve bugünkü durumu yalnız servis saatlerinde görünür (sabah …,
  akşam …). Sıradaki: yarın sabah …". Sonra servisçinin notları ("Servisçinin notu · bugün", genel nota "(bütün
  servise)") ve velinin "binmeyecek" işaretleri ("Yarın sabah binmeyecek" + not). `veli` doğruysa **Binmeyecek** düğmesi
  (`data-act="servis-binmeyecek" data-id="<öğrenci>"`) ve "Servise binmeyeceği günü servisçiye bildir.".
- `telBaglanti(tel)` — `<a class="servis-tel" href="tel:+90…">+90 532 …</a>` (`telefonNorm`, `telefonGoster`;
  [04c-telefon.md](04c-telefon.md)).
- `servisBilgiKarti(s, baslik, bugun, ogrenciId, veli)` — `div.kart.servis-kart#servisKart_<öğrenci|ben>`: başlık
  (veli için çocuğun adı, öğrenci için servisin adı), satırlar (boş olan çizilmez): Servis (yalnız velide), Plaka, Şoför
  (+ telefon bağlantısı), Rehber (+ telefon), Sabah kalkış, Akşam kalkış, Durak, Güzergâh (satır sonları korunur);
  `bugun` varsa altında `div.servis-bugun#servisBugun_<öğrenci|ben>`.
- `servisBugunGuncelle(ogrenciId, bugun)` — harita her yenilendiğinde ([19e-servis-konum.md](19e-servis-konum.md)
  `servisHaritasiYenile`) kartın "bugün" bölümünü yeni `bugun` ile yeniden çizer. Öğrencide (`ogrenciId` boş) `benim`,
  velide çocuğun kaydı güncellenir. Harita ucunun `bugun`'unda `binmeyecekDuzenleyebilir` olmadığı için eski değer
  korunur.
- `svCocukBul(id)` — `S.servisVeri.cocuklar` içinde çocuk.

### Servis sayfası

- `SAYFALAR.servis()` — önce `servisHaritasiDurdur()` (eski haritanın sayacı dursun), sonra `GET /api/servis`. Cevap
  gelince iki iş aynı anda beklenir: `yonetir` ise `GET /api/school/servisciler` (hata olursa boş liste; yönetim
  değilse istek atılmaz, boş liste) ve HER rolde `servisBildirimOnerisi()` ([19e-servis-konum.md](19e-servis-konum.md);
  telefon bildirimi bu cihazda kapalıysa "Servis yaklaşınca haber al" kartı). Sonra `servisSayfasi`. Öneri kartı yalnız
  öğrencinin ve çocukların bölümüne konur; yönetim bölümünde hesaplansa da gösterilmez.
- `servisSaatKarti(s)` — yönetimin "Servis saatleri" kartı (`#servisSaatleriKart`): açıklama (veli ve öğrenci canlı
  bilgiyi, servisçi yoklamayı yalnız bu saatlerde görür; saat bitince yoldaki sefer en çok 60 dakika daha sürer; her gün
  geçerli), iki `fieldset`: "Sabah (evden okula)" `#ssSabahBas`/`#ssSabahBit`, "Akşam (okuldan eve)"
  `#ssAksamBas`/`#ssAksamBit` (`input type="time" required`), `#ssMesaj`, "Saatleri kaydet".
- `servisSayfasi(d, servisciler, bildirimOneri)` — `S.servisVeri = d`, `S.servisciListe = servisciler`; hero alt yazısı
  yönetime ayrı. Sırayla:
  1. **Öğrenci:** `d.benim` varsa kart + öneri kartı + "Servisin nerede?" kartı (`#servisHaritaKart`); yoksa boş kutu
     "Servis kaydın yok. Servise biniyorsan okul yönetimine söyle."
  2. **Çocuklar** (veli, çocuğu olan öğretmen/müdür): her çocuğa kart (Binmeyecek düğmesi `bugun.binmeyecekDuzenleyebilir`
     ile) ya da "Servis kaydı yok.". Servisli çocuk varsa öneri kartı ve "Servis haritası" kartı; birden çok servisli
     çocukta ad düğmeleri (`servis-harita-cocuk`, seçili olan gri değil). Haritası açılacak çocuk: önce
     `veliSeciliCocuk()` (`27-veli-panel.js`; veli panelinin şeridinden ya da bildirimin `#/servis?c=<çocuk>` adresinden
     — `S.adresCocuk`), sonra `S.servisHaritaCocuk` (en son bakılan), yoksa ilk servisli çocuk. Şeritte seçili çocuğun
     servisi yoksa `S.servisHaritaCocuk`'a hiç bakılmaz, doğrudan ilk servisli çocuk açılır (`hedefId` seçili çocuk olur
     ve servisliler arasında bulunamaz). Bildirimden gelinmişse, o çocuk servisliyse ve birden çok çocuk varsa sayfa o
     çocuğun kartına kaydırılır.
  3. **Yönetim** (`d.yonetir`): `saatDuzenleyebilir` ise saat kartı; özet kartı ("3 servis" / "Henüz servis eklenmedi",
     "Şoför ve rehber telefonu yalnızca o servisteki öğrenciye ve velisine görünür.", **Yeni servis**). Her servis için
     kart: ad + plaka rozeti; alt satır "Servisçi <hesap adı>" ya da "Şoför <ad>" ya da "Servisçi atanmadı" · "sabah
     kalkış 07:15" · "akşam kalkış 16:40" · "12 öğrenci"; düğmeler **Bugünkü yoklama** (`servis-yoklama-bak`), **Öğrenci
     ekle** (`servis-ogrenci-ac`), **Düzenle** (`servis-duzenle`); altında öğrenciler ada göre (ad, sınıf · durak,
     **Harita** `servis-harita-modal`, **Çıkar** `servis-cikar`). Sonra "Servisçiler (N)": açıklama, **Servisçi ekle**
     (`hesap-yeni data-rol="servisci"`), her servisçi: ad, kullanıcı adı · atandığı servisler ya da "servise atanmadı" ·
     "henüz giriş yapmadı", **Hesap** (`hesap-duzenle`) — ikisi [10b-hesaplar.md](10b-hesaplar.md)'nin eylemleri.
  4. Öğrenci değil, çocuğu yok ve yönetim değilse: "Servis bilgileri okul yönetimindedir."
  Sayfa `yaz` ile basıldıktan sonra kaydırma yapılır ve harita açılır (`servisHaritasiAc('servisHaritaKart', id)`;
  öğrencide `id` boş).

### Servis eylemleri

- `EYLEMLER['servis-saat-kaydet']` — `POST /api/servis/saatler { sabahBas, sabahBit, aksamBas, aksamBit }`; başarıda
  `S.servisVeri.saatler` güncellenir ve "Servis saatleri kaydedildi. Yeni aralıklar: sabah …, akşam …." (sunucunun
  iletisi + düzeltilmiş aralıklar) `#ssMesaj`'da görünür; sayfa yeniden çizilmez. Hata (bozuk saat, ters aralık, 30
  dakikadan kısa aralık, çakışma) aynı yerde.
- `EYLEMLER['servis-yoklama-bak']` — "1. Servis — bugünkü yoklama" penceresi, önce "Yükleniyor...", sonra
  `GET /api/servis/yoklama?servisId=` cevabı `syYonetimGorunumu(d)` (`19i-servis-yoklama.js`) ile salt okunur çizilir;
  hata pencerede kırmızı.
- `EYLEMLER['servis-binmeyecek']` — velinin "binmeyecek" penceresi ("Zeynep servise binmeyecek"): **Hangi gün?**
  (`#bmTarih`; bugün ile 7 gün sonrası, "Bugün · …", "Yarın · …", işaretli günlerde "(işaretli: sabah)"), **Hangi
  servise binmeyecek?** (Sabah / Akşam / İkisi; `input[name=bmDonem]`), **Kısa not** (`#bmNot`, en çok 200). Başlangıçta
  seçili gün: bugün hâlâ servis saati varsa (canlı ya da sıradaki aralık bugünse) bugün, yoksa yarın. İşaretler
  `S.svBinmez = { id, isaretler: { tarih → işaret } }`'e konur. Düğmeler: **İşareti kaldır** (yalnız seçili günde işaret
  varsa görünür), Vazgeç, Kaydet. Günün sunucu "bugün"ü `bugun.tarih`'ten alınır, yoksa `svTrGun(0)`.
- `svBinmezDoldur()` — gün değişince o günün işaretini pencereye doldurur (dönem, not; işaret yoksa "İkisi" ve boş
  not) ve "İşareti kaldır"ı gösterir/gizler.
- `svBinmezGonder(el, sabah, aksam)` — `POST /api/servis/binmeyecek { ogrenciId, tarih, sabah, aksam, not }`; başarıda
  pencere kapanır, `S.servisHaritaCocuk` bu çocuk olur, sayfa yeniden çizilir ve sunucunun iletisi sayfanın üstünde
  (`sayfaMesaji`). Hata (ör. "o dönemin yoklaması alındı" 409) pencerede.
- `EYLEMLER['servis-binmeyecek-kaydet']` — seçili dönemden `sabah`/`aksam` çıkarır ("İkisi" → ikisi de `true`).
- `EYLEMLER['servis-binmeyecek-kaldir']` — ikisi de `false` gönderir; sunucu işareti siler.
- `EYLEMLER['servis-duzenle']` — "Yeni servis" ya da servisin adıyla pencere: Servis adı, Plaka, Servisçi hesabı
  (`#sv_soforId`; "— atanmadı —" + `S.servisciListe`; liste boşsa "önce aşağıdan Servisçi ekle ile aç" ipucu), Şoför adı
  (hesabı yoksa), Şoför telefonu, Rehber personel, Rehber telefonu (telefon kutuları `type="tel"`; 04c onları kendiliğinden
  ülke kodlu alana çevirir), Sabah kalkış, Akşam kalkış (`type="time"`), Güzergâh (en çok 500). Düzenlemede **Sil**
  (`servis-sil`). Kutular `S.servisVeri.servisler`'deki değerlerle doldurulur (aşağıda "Dikkat!"teki şoför sorunu).
- `EYLEMLER['servis-kaydet']` — `POST /api/servis/kaydet { id, ad, plaka, sofor, soforTel, rehber, rehberTel, sabah,
  aksam, guzergah, soforId }` (telefonlar `telefonOku` ile E.164; `soforId` her zaman gider, boşsa atama kalkar);
  başarıda pencere kapanır, sayfa yeniden çizilir; hata `#svMesaj`'da.
- `EYLEMLER['servis-sil']` — `confirm('Servis silinsin mi? İçindeki öğrencilerin servis kaydı da kalkar.')` →
  `POST /api/servis/sil { id }`; hata `hataGoster` (tarayıcının uyarı kutusu).
- `EYLEMLER['servis-cikar']` — **onay sormadan** `POST /api/servis/ogrenci-cikar { ogrenciId }` → sayfa yeniden çizilir.
- `servisHaritasi()` — DİKKAT: coğrafi harita değil; öğrenci kimliği → bulunduğu servisin adı eşlemesi (`{ id: ad }`).
- `EYLEMLER['servis-ogrenci-ac']` — `S.servisSecim = { servisId, servisAdi: servisHaritasi() }`; "Servise öğrenci ekle"
  penceresi: önce **Durak** (`#svDurak`, isteğe bağlı, 120), sonra **Öğrenci ara** (`#svAra`, odaklanır), sonuç listesi
  `#svListe`, ileti `#svoMesaj`; yalnız "Kapat" düğmesi.
- `servisAdayCiz()` — `S.servisVeri.okulOgrencileri` (okulun bütün onaylı öğrencileri: ad, sınıf) içinde `nrm` ile
  (Türkçe harf ve büyük/küçük farkı gözetmeden) "ad sınıf" araması; en çok 60 satır. Her satırda "· bu serviste" ya da
  "· şu an 2. Servis"; bu serviste olmayan için **Ekle** ya da (başka serviste ise) **Taşı**. Arama boşken de ilk 60
  öğrenci listelenir.
- `EYLEMLER['servis-ogrenci-ekle']` — `POST /api/servis/ogrenci { servisId, ogrenciId, durak }`. Pencere açık kalır (arka
  arkaya ekleme): arkadaki sayfa yeniden çizilir, eşleme ve liste tazelenir, arama kutusu ve durak olduğu gibi kalır,
  sunucunun iletisi `#svoMesaj`'da.

### Kulüpler

- `SAYFALAR.kulupler()` — `GET /api/kulupler` → `S.kulupVeri`. Hero (öğrenciye "Başvurusu açık kulübe
  katılabilirsin."). Sırayla: her çocuk için kart (çocuğun kulüpleri: ad, "Danışman: …", gün-saat; yoksa "Bir kulübe üye
  değil."); yönetime özet kartı ("4 kulüp" / "Henüz kulüp yok", başvuru kapalıyken öğrencinin kendisi katılıp
  ayrılamayacağı açıklaması, **Yeni kulüp**); hiçbir şey yoksa "Okulda henüz kulüp yok."; okulun her kulübü için
  `div.kart.kulup-kart`: ad + "Üyesin" rozeti; "Danışman: …" ya da "Danışman atanmadı" · gün-saat · "12 / 20 üye";
  sağda "Başvuru kapalı" (gri) ya da kontenjan dolduysa "Dolu" (turuncu); açıklama (satır sonları korunur); düğmeler:
  öğrenciye ve başvuru açıkken üyeyse **Ayrıl**, değilse ve dolu değilse **Katıl**; `uyeleriGorur` ise **Üyeler**;
  yönetime **Düzenle**.
- `EYLEMLER['kulup-katil']` — `POST /api/kulupler/katil { id }` → sayfa yeniden + sunucunun iletisi (`sayfaMesaji`).
- `EYLEMLER['kulup-ayril']` — `confirm('Kulüpten ayrılmak istiyor musun?')` → `POST /api/kulupler/ayril { id }` → sayfa.
- `EYLEMLER['kulup-duzenle']` — "Yeni kulüp" ya da kulübün adıyla pencere: Kulüp adı (`#kuAd`, 80), Açıklama
  (`#kuAciklama`, 1000), Danışman öğretmen (`#kuDanisman`; "— danışman yok —" + `d.ogretmenler`; "Danışman üye listesini
  görür, üye ekleyip çıkarabilir."), Kontenjan (`#kuKontenjan`, 1–1000, boş = sınırsız), Gün ve saat (`#kuGunSaat`, 60),
  "Başvuru açık (öğrenci kendisi katılıp ayrılabilir)" (`#kuAcik`); düzenlemede **Sil**.
- `EYLEMLER['kulup-kaydet']` — `POST /api/kulupler/kaydet { id, ad, aciklama, danismanId, kontenjan, gunSaat,
  basvuruAcik }` → pencere kapanır, sayfa yeniden; hata `#kuMesaj`.
- `EYLEMLER['kulup-sil']` — `confirm('Kulüp ve üyelik kayıtları silinsin mi?')` → `POST /api/kulupler/sil { id }`.
- `EYLEMLER['kulup-uyeler']` → `kulupUyeleriAc(id, '')`.
- `kulupUyeleriAc(id, ara)` — `GET /api/kulupler/uyeler?id=` → `S.kulupUye = { id, adaylar }`; "Satranç Kulübü — Üyeler"
  penceresi: "12 / 20 üye", üye listesi (ad, sınıf, **Çıkar** `kulup-uye-cikar`) ya da "Henüz üye yok.", **Üye ekle**
  arama kutusu (`#kuAra`; `ara` geri yazılır, doluysa odaklanır), aday listesi `#kuAdaylar`, ileti `#kuuMesaj`. Hata
  `hataGoster`.
- `kulupAdayCiz()` — arama boşsa "Eklemek için ad yaz."; değilse adaylardan en çok 40 eşleşme, her birinde **Ekle**
  (`kulup-uye-ekle`).
- `kulupUyeIslem(el, yol, ogrenciId)` — `POST yol { id: S.kulupUye.id, ogrenciId }`; başarıda arkadaki sayfa sessizce
  yeniden çizilir (hatası yutulur) ve pencere aynı aramayla yeniden açılır; hata `#kuuMesaj`.
- `EYLEMLER['kulup-uye-ekle']` (`/kulupler/uye-ekle`), `EYLEMLER['kulup-uye-cikar']` (`/kulupler/uye-cikar`; onay
  sorulmaz).

### `S` üzerinde tuttuğu durum

`S.yemekBas` (gezilen hafta), `S.yemekVeri`, `S.servisVeri` (son `GET /api/servis` cevabı; yönetimde okulun öğrenci
listesi de içinde), `S.servisciListe`, `S.servisHaritaCocuk` (haritası en son açılan çocuk), `S.svBinmez`,
`S.servisSecim`, `S.kulupVeri`, `S.kulupUye`. Okudukları: `S.user` (`role`, `schoolId`), `S.adresCocuk` (yalnız "bildirimden
mi gelindi" sorusu için; asıl tüketen `veliSeciliCocuk`). Çıkışta ve portal (rol) değişince çağrılan
`oturumDurumunuSifirla` (`26-baslat.js`; portal geçişi [08c-kisilikler.md](08c-kisilikler.md)) bunlardan yalnız
`S.servisHaritaCocuk`, `S.servisVeri` ve `S.svBinmez`'i sıfırlar.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`); bu dosya `19b`'den sonra, `19d-harita.js`'ten önce gelir. Bütün çağrılar sayfa açılırken ya da
  tıklamada olduğu için sonra gelen parçaların işlevleri de hazırdır. Çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik`,
    `AY_ADI`, `nrm` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`
    ([03-mesaj-modal.md](03-mesaj-modal.md)); `telefonNorm`, `telefonGoster`, `telefonOku`
    ([04c-telefon.md](04c-telefon.md)); `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `hero`, `yaz`,
    `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  - [19e-servis-konum.md](19e-servis-konum.md) — `servisHaritasiDurdur`, `servisHaritasiAc`, `servisBildirimOnerisi`
    (onun içindeki `bildirim-ac` düğmesi [04b-bildirim-izni.md](04b-bildirim-izni.md)'nindir);
  - `19i-servis-yoklama.js` — `syYonetimGorunumu` (yönetimin salt okunur yoklama penceresi);
  - `27-veli-panel.js` — `veliSeciliCocuk`; `25-tiklama.js` — `hataGoster`;
  - [10b-hesaplar.md](10b-hesaplar.md) — `hesap-yeni` (servisçi hesabı açma) ve `hesap-duzenle` düğmelerinin eylemleri;
    `modal-kapat` ([03-mesaj-modal.md](03-mesaj-modal.md), `25-tiklama.js`'in `islem`'i karşılar).
- Sunucu uçları — hepsi [../../../sunucu/bolumler/okul-hayati.md](../../../sunucu/bolumler/okul-hayati.md)'de (biri hariç):
  - `GET /api/yemek?bas=` → `{ bas, bit, okullar: [{ id, ad, gunler: [{ tarih, menu, kalori }] }], duzenleyebilir }`;
    `POST /api/yemek { gunler }` — müdür ya da `yemek.yonet` (veli değil); 1–31 gün; menü satırı 120, en çok 8 satır,
    toplam 500; kalori 1–5000 değilse boş; boş menü o günü siler.
  - `GET /api/servis` → `{ yonetir, benim, cocuklar: [{ id, ad, servis, bugun }], saatler?, servisler?, okulOgrencileri?,
    saatDuzenleyebilir? }`. `saatler` öğrenci, servisçi ve okul personeline gelir (veliye gelmez); `servisler`,
    `okulOgrencileri`, `saatDuzenleyebilir` yalnız yönetime. Yönetimin servis satırı: `id, ogrenciSayisi, soforId,
    soforAdi` + öğrencinin gördüğü alanlar (`ad, plaka, sofor, soforTel, rehber, rehberTel, sabah, aksam, guzergah`) +
    `ogrenciler: [{ id, ad, sinif, durak, siraSabah, siraAksam }]`. `bugun` nesnesi (sunucuda `ogrenciBugunu`): `canli,
    donem, tarih, saatler, aralik, sonraki, seferVar, durum, bindiSaat, indiSaat, vardiSaat, seferBasladi, seferBitti,
    sira, toplam, onunde, binmeyecekBugun, notlar, binmeyecek`; çocukların `bugun`'unda ayrıca
    `binmeyecekDuzenleyebilir: true`. Bu dosya `aralik`, `seferVar` ve `toplam`'ı kullanmaz.
  - `POST /api/servis/saatler`, `/kaydet`, `/sil`, `/ogrenci`, `/ogrenci-cikar` — yalnız yönetim (403 "Servisleri
    düzenleme yetkin yok"); `GET /api/servis/yoklama?servisId=` — yönetim salt okunur, servisçi kendi servisi.
  - `POST /api/servis/binmeyecek` — yalnız bağlı veli; bugün–7 gün; o dönemin yoklaması alındıysa 409; saatte 60.
  - `GET /api/kulupler`, `GET /api/kulupler/uyeler?id=`, `POST /api/kulupler/katil`, `/ayril` (yalnız öğrenci),
    `/uye-ekle`, `/uye-cikar` (yönetim ya da danışman; kontenjanı aşamaz), `/kaydet`, `/sil` (yalnız yönetim).
  - `GET /api/school/servisciler` → `{ servisciler: [{ id, fullName, username, telefon, girisYapti }] }` — `servis.yonet`
    ([../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md); `/api/school` yolu
    [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)'den oraya devredilir).
  - Okul "Yemek", "Servis" ya da "Kulüp" bölümünü kapattıysa uçlar 403 `ozellikKapali`
    ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)); veli için, çocuklarından birinin
    okulunda açıksa geçer, kapalı okuldaki çocuğun servis kartı `null` gelir.
- Onu kullananlar:
  - [19e-servis-konum.md](19e-servis-konum.md) — `servisSiraYazisi`, `servisAralikMetni`, `servisBugunGuncelle`.
  - `19i-servis-yoklama.js` — `svTrGun`, `svGunAdi`, `svGunEtiketi`, `svBuyukBas`, `svIlkAd`, `servisAralikMetni`,
    `servisSonrakiMetni`, `svIsaretDonemi`.
  - Menü ([06-menu.md](06-menu.md)): öğrencide "Yemek Listesi", "Servisim", "Kulüpler"; velide "Yemek Listesi",
    "Servis", "Kulüpler"; öğretmende "Yemek Listesi", "Kulüpler", `servis.yonet` ile "Servisler", yetkisiz ama çocuğu
    varsa "Velisi olduğum" altında "Servisi"; müdürde üçü ("Servisler"). `SAYFA_OZELLIK`: `yemek → yemek`,
    `servis → servis`, `kulupler → kulup` (okul kapatınca menüden kalkar). Servisçinin menüsünde bu sayfalar yok; onun
    ana sayfası `19i`'nin Yoklama ekranıdır.
  - Bildirimler `#/servis?c=<öğrenci>` adresine bağlanır (servis bildirimleri; adresteki çocuğu
    [07-yonlendirme.md](07-yonlendirme.md) `adrestekiCocuguAl` ve bildirim paneli `24-bildirim-arama-mobil.js`
    `S.adresCocuk`'a yazar). [10b-hesaplar.md](10b-hesaplar.md) servisçi hesabında
    bir değişiklikten sonra kişi Servis sayfasındaysa sayfayı yeniden çizer (`HESAP_ROL.servisci.sayfa = 'servis'`).
- CSS:
  - `public/css/parcalar/26-anket-okul-hayati.css` — `.hafta-gezgin`, `.genis`, `.yemek-hafta`, `.yemek-gun` (`.bugun`),
    `.yemek-gun-ust`, `.yemek-duzen`, `.servis-kart`, `.servis-yonetim`, `.alt-satir`, `.bilgi-satir`; kulüp kartı anket
    düzenini paylaşır: `.anket-ust`, `.anket-soru`, `.anket-aciklama`, `.kulup-dugmeler` (`.kulup-kart`'ın kendi kuralı
    yok).
  - `public/css/parcalar/34-servis-yoklama.css` — `.servis-bugun`, `.servis-bugun-ust`, `.servis-bugun-baslik`,
    `.servis-bugun-satir`, `.servis-not` (`.binmez`), `.servis-tel`, `.servis-saat-alan`, `.servis-saat-aciklama`,
    `.servis-saat-izgara`, `.servis-saat-grup`, `.servis-saat-cift`, ayrıca `.servis-kart`/`.bilgi-satir` eki.
  - `22-cesitli.css` — `.secim-dugmeler`, `.secim-dugme`, `.etiket-baslik` (binmeyecek penceresi); `19-mesajlar.css` —
    `.secim-kutu`, `.okuma-liste`, `.alici-satir` (seçim ve üye listeleri); `27-harita-ortak.css` — `.dugme-satir`,
    `.soluk`; `04-kartlar.css` — `.etiket` renkleri (`yesil`, `kirmizi`, `gri`, `mavi`, `turuncu`); `03-iskelet.css` —
    `h3.sb`.
- Rol özeti: yemek — öğrenci, veli, öğretmen, müdür görür; müdür ve `yemek.yonet` yazar. Servis — öğrenci kendi
  servisini, veli çocuğununkini görür, veli "binmeyecek" koyar; müdür ve `servis.yonet` yetkili öğretmen yönetir.
  Kulüp — öğrenci katılır/ayrılır; danışman ve yönetim üyeleri görür/düzenler; müdür ve `kulup.yonet` kulüp açar.
  Servisçi yemek ve kulüp uçlarına giremez (403); `GET /api/servis`'e girebilir ama menüsünde bu sayfa yoktur, adresle
  açsa "Servis bilgileri okul yönetimindedir." görür. Sistem yöneticisi (`admin`) üçüne de giremez.

## Nasıl çalışır (adım adım)?

### Velinin servis sayfası

```
menü "Servis" ─► SAYFALAR.servis
   servisHaritasiDurdur()                       (eski haritanın sayacı dursun)
   GET /api/servis ─┬─ (yönetimse) GET /api/school/servisciler
                    └─ servisBildirimOnerisi()  (bildirim kapalıysa öneri kartı)
   servisSayfasi:
     her çocuk ─► servisBilgiKarti(servis, ad, bugun, id, binmeyecekDuzenleyebilir)
                    └─ servisBugunIc: "Bu sabah · Bindi 07:42", "Zeynep 3. sırada, önünde 1 öğrenci kaldı",
                       servisçinin notları, "Yarın akşam binmeyecek", [Binmeyecek]
     "Servis haritası" (+ çocuk düğmeleri) ─► yaz ─► servisHaritasiAc('servisHaritaKart', seçili çocuk)
   19e her 5 sn / 30 sn / 2 dk: GET /api/servis/harita ─► servisBugunGuncelle ─► kartın "bugün"ü tazelenir
```

### "Binmeyecek"

```
[Binmeyecek] ─► pencere: gün (bugün..+7), Sabah/Akşam/İkisi, not   (işaretli gün seçilirse doldurulur)
   Kaydet ─► POST /api/servis/binmeyecek { ogrenciId, tarih, sabah, aksam, not }
             ├─ 200 ─► pencere kapanır ─► S.servisHaritaCocuk = çocuk ─► sayfa yeniden + "… binmeyecek" iletisi
             └─ 409 (yoklama alındı) / 400 ─► iletisi pencerede
   İşareti kaldır ─► aynı uç, sabah=false aksam=false
```

### Yönetim: servise öğrenci ekleme

```
[Öğrenci ekle] ─► S.servisSecim = { servisId, öğrenci → servis adı }
   Durak yaz ─► ara "7-A" ─► servisAdayCiz (en çok 60) ─► [Ekle] / [Taşı]
   POST /api/servis/ogrenci ─► SAYFALAR.servis (arkada) ─► liste tazelenir, pencere açık kalır
```

### Kulübe katılma

```
öğrenci [Katıl] ─► POST /api/kulupler/katil ─► 200 ─► sayfa yeniden + "Satranç kulübüne katıldın."
                                            └─ kontenjan dolu / başvuru kapalı ─► uyarı kutusu (hataGoster)
danışman [Üyeler] ─► GET /api/kulupler/uyeler ─► ara ─► [Ekle] ─► POST uye-ekle ─► pencere aynı aramayla yeniden
```

## Dikkat!

- **"Düzenle → Kaydet" servisçi hesabının adını ve telefonunu servisin kendi şoför alanlarına kopyalıyor (kod okumasına
  göre; tarayıcıda denenmedi).** Yönetim listesindeki her servisin `sofor`/`soforTel` değeri sunucuda
  `servisGorunumu`'ndan gelir: servisin kendi alanı boşsa **atanmış servisçi hesabının** adı ve telefonu. `servis-duzenle`
  bu değerleri "Şoför adı (hesabı yoksa)" ve "Şoför telefonu" kutularına koyar, `servis-kaydet` de onları
  `POST /api/servis/kaydet`'e `sofor`/`soforTel` olarak geri yollar; sunucu bunları servis satırına yazar. Sonuç: servisçi
  hesabı A olan bir servis düzenlenip kaydedilince A'nın adı ve telefonu servisin "elle yazılmış şoför" alanına geçer.
  Sonradan (ya da aynı pencerede) servisçi B'ye verilse bile öğrenci ve veli kartında **eski servisçi A'nın adı ve
  telefonu** görünmeye devam eder (sunucu elle yazılanı hesabınkinden önce gösterir). Düzeltme önerisi: yönetim cevabında
  servisin kendi alanlarını ayrı göndermek (ya da servisçi atanmışsa bu kutuları boş getirmek). Kod değiştirilmedi.
- **Bazı silmeler onaysız.** `servis-cikar` (öğrenciyi servisten çıkarma; durak ve sıra da gider) ve `kulup-uye-cikar`
  tek tıkla yapılır; `servis-sil`, `kulup-sil`, `kulup-ayril` ise `confirm` sorar.
- **`S.yemekBas` hiç sıfırlanmıyor.** Yemek sayfasında başka haftaya gidildiyse sayfaya sonra dönüldüğünde (çıkış yapıp
  başka biri girse bile, aynı sekmede) yine o hafta açılır; "bu hafta"ya dönmenin düğmesi yok, sayfa yenilenmeli.
  `oturumDurumunuSifirla` bunu, `S.yemekVeri`, `S.servisciListe`, `S.servisSecim`, `S.kulupVeri` ve `S.kulupUye`'yi
  (aday öğrenci adları dahil) sıfırlamaz; ekranda gösterilmezler ve bir sonraki ziyarette üzerine yazılırlar ama bellekte
  kalırlar.
- **"Bugün" üç ayrı saatle hesaplanıyor.** Yemek kartının vurgusu cihazın yerel günüyle (`bugunYerel`), servisin
  "bugün/yarın" yazıları Türkiye günüyle (`svTrGun`, cihazın saatine dayanır), sunucunun varsayılan yemek haftası ise
  UTC günüyle (`haftaBasi`, `new Date().toISOString()`; sunucu belgesi
  [../../../sunucu/bolumler/okul-hayati.md](../../../sunucu/bolumler/okul-hayati.md) bunu "Küçük tutarsızlıklar"
  arasında sayar). Türkiye'de gece 00:00–03:00 arasında, pazartesiye geçen gece sunucu hâlâ önceki haftayı açar.
  Canlı olup olmama kararı her zaman sunucudadır; cihaz saati yanlışsa yalnız yazılar kayar.
- **Yemekte sunucu sessizce kırpar.** Kutuda 500 karakter sınırı var ama sunucu bir günde en çok 8 satır ve satır başına
  120 karakter tutar; fazlası uyarısız atılır. Kaydetmeden sonra "kaydedildi" iletisi çıkmaz, yalnız sayfa yenilenir.
- **Velinin harita seçimi şeride bağlı.** Veli panelinde bir çocuk seçiliyse (`S.veliCocuk`) harita hep o çocukla açılır;
  başka çocuğun düğmesine basıp sonra o çocuk için "binmeyecek" kaydedilince sayfa yeniden çizilir ve harita şeritteki
  çocuğa döner (`S.servisHaritaCocuk` yalnız şerit seçimi yoksa işe yarar).
- **`servisHaritasi` adı yanıltıcı:** coğrafi harita değil, öğrenci → servis adı eşlemesi; `19e`'deki `servisHarita`
  nesnesiyle karıştırma. `servisAdayCiz` "bu serviste mi" sorusunu servis ADIYLA karşılaştırır; okulda servis adı tekil
  olduğu için doğru çalışır.
- **Kapalı okuldaki çocuğun yemeği ve kulüpleri yine gelir (sunucu tarafı; kod okumasına göre).** İki okulda çocuğu olan
  velide bölüm bir okulda açıksa kapı geçer ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)).
  Servis ucu kapalı okuldaki çocuğun kartını `null` yapar, ama `GET /api/yemek` bütün çocukların okullarını, `GET
  /api/kulupler` bütün çocukların kulüplerini özelliğe bakmadan döndürür. Okul "Yemek"i ya da "Kulüp"ü kapattıysa
  veli o okulun eski menüsünü ve çocuğun kulüplerini görmeye devam eder. Kod değiştirilmedi.
- **Servisçi listesi alınamazsa sessiz.** `GET /api/school/servisciler` hata verirse liste boş sayılır: "Servisçiler (0)"
  ve düzenleme penceresinde "Servisçi hesabı yoksa önce … ekle" yazar; asıl hata gösterilmez.
- **Şoför satırında ad boşsa** satır " · +90 …" diye ayraçla başlar (yalnız görünüş).
- **Durak kutusu ekleme penceresinde temizlenmez:** arka arkaya eklenen öğrencilerin hepsine aynı durak gider; farklı
  durak için kutuyu her seferinde değiştirmek gerekir. Liste en çok 60 satır gösterir, "daha fazla var" demez.
- **Ön yüz yalnız çizer.** Binmeyecek'in 7 gün sınırı, yoklama kilidi, kontenjan yarışı, başka okulun verisi, telefonun
  kime görüneceği — hepsi sunucuda denetlenir; bu dosyadaki kısıtlar (seçenek listesi, `maxlength`) yalnız yol göstericidir.
- **Telefon numaraları yalnız ilgili kişiye gelir:** şoför ve rehber telefonu yalnız o servisteki öğrenciye, velisine ve
  yönetime döner; bu dosya gelen ne varsa çizer.
- Hatalar çoğu yerde pencerenin ileti kutusunda, silme/katılma gibi tek düğmeli işlerde `hataGoster` ile tarayıcının
  `alert` kutusunda gösterilir.

## Testleri

- Bu dosyanın tarayıcıda çalışan bir testi yok. Sunucu tarafı (bu ekranların kullandığı uçlar):
  - `testler/test-okul-hayati.js` — yemek (öğrenci görür ama yazamaz, müdür ve `yemek.yonet` verilen öğretmen yazar,
    boş satırlar atılır, kalori, hafta pazartesiden başlar, veli çocuğunun okulununkini görür, başka okul görmez, boş menü
    siler, bozuk tarih ve 31 günden fazlası reddi); servis (ekleme, aynı ad, bozuk telefon, öğrenciyi yazma/taşıma/çıkarma,
    şoför telefonunu kimlerin gördüğü, öğrencinin bugünkü durumu, müdürün servis ve sıra listesi, başka okul); kulüpler
    (danışman kuralı, aynı ad, kontenjan ve aynı anda iki istek, başvuru kapalıyken katılma/ayrılma, üye listesi yetkisi,
    veli yalnız çocuğunun kulüplerini görür, `kulup.yonet`).
  - `testler/test-servis-yoklama.js` — servis saatleri (bozuk/ters/kısa aralık, yetkisiz değiştiremez, işlem kaydı),
    velinin "binmeyecek" işareti (bugün/yarın, kaldırma, 7 gün sınırı, yoklama alınınca kilit, servisçiye haber), "önünde
    N öğrenci", veli kartında "Bindi HH:MM", "Okula vardı HH:MM", "Eve bırakıldı HH:MM", notları kimin gördüğü, müdürün
    salt okunur yoklaması.
  - `testler/test-servis-konum.js` — müdürün servisçi listesi (`/api/school/servisciler`), servisçinin servise atanması.
  - `testler/test-ozellikler.js` — servis kapalıyken uçlar 403 `ozellikKapali`; iki okullu velide bir okulda servis
    kapalıyken sayfa yine açılır, o okuldaki çocuğun servisi gelmez (kartta "Servis kaydı yok."); kapalı okuldaki
    çocuğun haritası 403. Yemek ve kulüp kapanışının ayrı testi yok (aynı kapıdan geçer).
  - `testler/yetki-denetimi.js` (her uç × her rol; ör. yemek yazmayı ve kulüp açmayı yalnız müdür, listeleri müdür,
    öğretmen, öğrenci, veli alır), `testler/girdi-denetimi.js` (bozuk gövde).
- `testler/buton-denetimi.js` — bu dosyanın bütün `data-act`'larının (`yemek-*`, `servis-*`, `kulup-*`) karşılığı ve
  `api('/yemek')`, `api('/servis…')`, `api('/kulupler…')`, `api('/school…')` yollarının sunucuda tanımlı olması.
- `testler/yazim-denetimi.js`, `testler/test-kucult.js` — ekran metinleri ve birleşik paketin derlenmesi.
- `araclar/gezinti.js` ekran turu (test değil; çalıştırması ayrı iş) müdürle "Yemek listesi", "Yemek listesi —
  düzenleme", "Servisler", "Servis saatleri", "Servisin bugünkü yoklaması", "Servis düzenleme penceresi", "Servise
  öğrenci ekleme", "Kulüpler", "Yeni kulüp penceresi"; aynı hesap veli portalına geçince "Servis"; öğretmenle "Yemek listesi",
  "Kulüpler (danışmanı olduğu)";
  öğrenciyle "Yemek listesi", "Servisim (harita, durak)", "Kulüpler (üye)"; veliyle "Yemek listesi", "Servis", "Servis —
  Binmeyecek penceresi", "Kulüpler" (ve telefon boyunda "Servis: bugünkü durum") görüntülerini alır.
- Elle (sunucu 3200'de, `testler/seed.js` hesapları; seed test okulunun servis saatlerini 00:00–11:59 / 12:00–23:59 yapar,
  yani her an canlıdır): müdürle Servisler → "Yeni servis", servisçi hesabını seç, "Öğrenci ekle" ile iki öğrenci ekle;
  veliyle Servis → kartta "Bu sabah"/"Bu akşam" rozetini gör, "Binmeyecek" → yarın, Sabah → Kaydet: sayfanın üstünde
  sunucunun iletisi, kartta "Yarın sabah binmeyecek". Müdürle Yemek listesi → "Bu haftayı düzenle" → iki gün yaz, kaydet;
  öğrenciyle aynı haftayı gör. Kulüpler → "Yeni kulüp" (kontenjan 1) → öğrenciyle "Katıl", ikinci öğrenciyle "Dolu".

## Son durum

- `git log`: 8 commit. Son değişiklik `24050a2 commit 518` (2026-09-27, servis yoklaması işi; bu dosyada 253 satır
  eklendi, 15 satır silindi):
  servis saatleri kartı ve `servis-saat-kaydet`; Türkiye günü ve yazı yardımcıları (`svTrGun`, `svGunAdi`,
  `svGunEtiketi`, `svBuyukBas`, `svIlkAd`, `servisAralikMetni`, `servisSonrakiMetni`, `svIsaretDonemi`); servis kartına
  "bugün" bölümü (`servisDurumu`, `servisSiraYazisi`, `servisBugunIc`, `servisBugunGuncelle`, `svCocukBul`); velinin
  **Binmeyecek** penceresi (`servis-binmeyecek`, `svBinmezDoldur`, `svBinmezGonder`, `-kaydet`, `-kaldir`); yönetime
  "Bugünkü yoklama" (`servis-yoklama-bak`); bildirimden gelen velide o çocuğun seçilip kartına kaydırılması
  (`veliSeciliCocuk`, `S.servisHaritaCocuk`); harita çocuk düğmelerinde ad artık `svIlkAd` (önceden ilk sözcük);
  "Sabah"/"Akşam" satırları "Sabah kalkış"/"Akşam kalkış" oldu (yönetim satırında da "sabah kalkış …"); hero alt
  yazılarına "servis saatleri" / "bugünkü durum" eklendi; telefon bağlantısına `servis-tel` sınıfı; servisçi açıklaması
  "Yoklama sayfasında öğrencileri işaretler" diye güncellendi.
- Ondan önce dosya 2026-09-26'da adım adım kuruldu: `6490596 commit 314` (servis kartı `servisBilgiKarti`, `servisSayfasi`,
  `servis-duzenle`/`-kaydet`/`-sil`/`-cikar`/`-ogrenci-ac`/`-ogrenci-ekle`; aynı commit `19d-harita.js`'i getirdi),
  `0bc0403 commit 311` (`kulupUyeleriAc`), `0eca8d5 commit 310` (kulüp sayfası ve `kulup-duzenle`), `4d11b1c commit 309`
  (`yemek-kaydet`), `3ad40a9 commit 308` (yemek sayfası, `yemek-hafta`, `yemek-duzenle`), `203f9a4 commit 307` (kulüp
  eylemleri: katıl, ayrıl, kaydet, sil, üyeler, üye ekleme/çıkarma, `kulupAdayCiz`, `kulupUyeIslem`), ilk hâli
  `7e3bf79 commit 306` (gün yardımcıları, `telBaglanti`, `SAYFALAR.servis` girişi, servis seçimi
  `servisHaritasi`/`servisAdayCiz`).
- Bilinen açıklar (kod değiştirilmedi): servisçi hesabının ad/telefonunun "Düzenle → Kaydet" ile servise kopyalanması
  (yukarıda), onaysız "Çıkar" düğmeleri, sıfırlanmayan `S.yemekBas`, kapalı okuldaki çocuğun yemek/kulüp bilgisinin
  yine gelmesi (sunucu).
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Çok dil" — ekrandaki her metin `c()` kataloğuna geçecek; gün ve ay adları (`YEMEK_GUN`, `SV_GUN_ADI`, `AY_ADI`)
    de çevrilecek.
  - "Tek kişi tek hesap + portallar öğrencide de" — öğrenci okul ve dershaneye aynı anda bağlı olabilecek; yemek, servis
    ve kulüp sayfaları portal (kurum) başına ayrılmalı; "servisçi de portal" (iki okulda tek servisçi hesabı).
  - "Özel roller" (öneri) — bugünkü "Servis Sorumlusu" ve "Kulüp Danışmanı" şablonlarına "Okul Sekreteri"
    (`yemek.yonet` dahil) gibi yenileri eklenecek; sayfa yetkiyi sunucunun bayraklarından (`duzenleyebilir`, `yonetir`)
    okuduğu için değişmeden çalışmalı.
  - "Yıl geçişi" — yeni yıl sihirbazında servis listeleri ve kulüp üyelerinin taşınıp taşınmayacağı; mezunların bu
    listelerden çıkması.
  - "Mesaj ayarları, …" — bildirim panelinin sekmelere ayrılmasında bir "Servis" sekmesi (bildirimlerin
    `#/servis?c=` bağlantısı aynı kalır).
  - "KVKK ve onay metinleri TAM denetimi" ve "Güvenlik denetimi" — telefonların ve servis bilgisinin kime gittiği;
    güvenlik tanımındaki "yemek 'bugün' UTC" bulgusu sunucu tarafında düzelecek.
  - "Ekran turu + albüm" — yukarıdaki görüntüler baştan alınacak.
