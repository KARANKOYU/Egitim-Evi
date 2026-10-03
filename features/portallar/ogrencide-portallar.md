# Portallar · Öğrencide birden çok kurum

**Durum:** Tasarlandı — henüz kodda yok

Öğrenci hesabının da yetişkin hesabı gibi "tek kişi, tek hesap, birden çok portal" olması: aynı öğrenci aynı anda bir okulda ve
bir dershanede olabilir, kurum onu eklediğinde portalı kendiliğinden düşer.

## Ne işe yarar

Bugün öğrenci hesabı kişiye aittir ama tek okuldadır: başka bir okul öğrenciyi T.C. kimlik no ve doğum tarihiyle eklerse hesap o
okula **taşınır** (nakil; eski okul artık göremez, eski kayıtlar yıl seçicisinde salt okunur). İki kurumu aynı anda kullanmak
mümkün değildir.

Kullanıcı 28 Eylül'de şunu istedi: dershane ve okul ikisi de Eğitim Evi'ni kullanacak, öğrenci aynı anda ikisinde de olabilsin;
ana sayfada "Öğrenci · okul adı" portalları dursun; yeni bir kurum öğrenciyi eklediğinde portal kendiliğinden ana ekrana düşsün,
öğrenci önceki bilgileriyle girsin; "+ Ekle"de "öğrenci oturumu ekle" olmasın. Bu belge o tasarımı anlatır.

## Nereden açılır

- Öğrencinin sol menüsünün en üstünde **"Portallarım"** (bugün öğrencide yok) — [Portallarım](portallarim.md).
- Girişte iki kurumu olan öğrencinin gördüğü **"Oturumunu seç"** ekranı ([Portal seçme ekranı](portal-secme-ekrani.md)).
- Okulun ya da dershanenin sayfasından (`/school/<kurum>`) girerse doğrudan o kurumun portalı, üst şeritte "Portallarıma dön".
- Kurum tarafında: **Öğrenciler → "Öğrenci ekle"** penceresi ve Excel aktarımının önizlemesi ("Eşleyelim mi?").

## Adım adım

### Öğrenci

1. Okulun seni ekledi: "Öğrenci · 7-A" portalın var (Tasarım 1'de Elif Yılmaz, Test Ortaokulu).
2. Dershane de seni öğrencisi olarak ekler (T.C. kimlik no ve doğum tarihin tutar). Yeni hesap açılmaz: aynı kullanıcı adın ve
   şifrenle girersin; Portallarım'a **"Öğrenci · 7. sınıf B grubu"** (Örnek Dershanesi) satırı kendiliğinden eklenir.
3. Giriş sayfasından girince "Oturumunu seç" ekranında iki kart görürsün; okulun ya da dershanenin sayfasından girersen doğrudan
   o kurumun portalına girersin.
4. Sol menüde Portallarım: "Öğrenci · 7-A" (rozet "TO", Test Ortaokulu) ve "Öğrenci · 7. sınıf B grubu" (rozet "ÖD", Örnek
   Dershanesi). Birine dokununca o kurumun portalına geçersin: "Öğrenci · 7. sınıf B grubu · Örnek Dershanesi portalına geçildi."
5. Her portal kendi kurumunun menüsüyle açılır. Tasarım 1'deki dershane portalı:
   - menü: "Ana sayfa", "Ödevler", "Deneme sınavları", "Ders programı";
   - ana sayfa: başlık "Örnek Dershanesi", alt yazı "7. sınıf B grubu · hafta sonu dersleri · Cumartesi ve Pazar 09:00–12:10";
     "Bu Cumartesi · 3 Ekim" ders listesi, "Ödevler", "Deneme sınavları";
   - "Deneme sınavları": "Yaklaşan" ve "Sonuçlar" (puan 500 üzerinden, grupta sıra), kayıt açık denemeye "Kayıtlısın" /
     "Kayıt açık".
6. Bildirim panelinde iki kurumun bildirimleri birliktedir; birden çok kurumun varsa her bildirimin başında kurumun adı yazar
   ("Örnek Dershanesi · Deneme 4 için kayıtlar açıldı"). Öbür kurumun bildirimine basınca önce o kurumun portalına geçilir, sonra
   bildirimin götürdüğü yer açılır. Tek kurumun varsa bildirimler bugünkü gibidir.
7. Öğrencide **"+ Ekle" yoktur**; kendin kuruma katılamazsın, kurum seni ekler.

### Veli

1. Çocuğun bir kurumdaysa bugünkü gibi tek satır: "Veli · Elif Yılmaz · 7-A".
2. Çocuğun birden çok kurumdaysa her kurumu ayrı bir portal satırıdır (tanım): **"Veli · Ali · Okul A"** / **"Veli · Ali ·
   Dershane B"**. Tanım bu satırların oturumlarını ayrıca anlatmaz; 3 Ekim kararıyla her çocuk ayrı oturumdur
   ([Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md)).
3. Bildirimlerde çocuğun birden çok kurumu varsa kurumun adı başta yazar.

### Müdür (kurum)

1. **Öğrenciler → "Öğrenci ekle"** penceresinde ad, soyad, T.C. kimlik no, doğum tarihi, sınıf ve okul no'yu yaz.
2. T.C. kimlik no Eğitim Evi'nde kayıtlı bir hesapta varsa:
   - doğum tarihi tutarsa yeni hesap açılmaz, öğrenci o hesapla **eşlenir**. Sonuç penceresi **"Öğrenci eşlendi"**: "Kullanıcı
     adı: mevcut hesabıyla girer", "Şifre: gösterilmez", "Giriş yeri: egitimevi.org/school/test-ortaokulu" ve not "Öğrencinin Eğitim
     Evi'nde hesabı vardı (T.C. ve doğum tarihi tuttu); yeni hesap açılmadı. Önceki kullanıcı adı ve şifresiyle girer; ana ekranına
     "Öğrenci · Test Ortaokulu" düşer." İşlem kaydına "öğrenciyi Eğitim Evi hesabıyla eşledi" yazılır;
   - doğum tarihi boşsa: "Bu T.C. kimlik no Eğitim Evi'nde kayıtlı bir hesapta var. Eşlemek için öğrencinin doğum tarihini yaz.";
   - tutmuyorsa: "Bu T.C. kimlik no Eğitim Evi'nde kayıtlı bir hesapta var. Doğum tarihi tutmuyor; kontrol et."
3. Excel'le toplu eklemede önizlemenin altında **"Bazı öğrencilerin kaydı bulundu, eşleyelim mi?"**: "N öğrencinin Eğitim Evi'nde
   hesabı var; T.C. kimlik no ve doğum tarihi tuttu. Eşlersen yeni hesap açılmaz: öğrenci önceki kullanıcı adı ve şifresiyle girer,
   ana ekranına "Öğrenci · Test Ortaokulu" düşer. Eşlemediğin satır alınmaz." ([Eşleme](../excel-aktarim/eslestirme.md)).
4. Giriş bilgisi kâğıdında eşlenen öğrencinin satırı "mevcut hesabıyla girer" / "gösterilmez" der.
5. Eşlenen hesabın öbür kurumu sana **gösterilmez**: kurumlar birbirini görmez, birbirine bildirim gitmez.
6. Öğrenciyi okuldan çıkarınca öğrencinin senin kurumundaki portalı **"geçmiş"** olur (o kayıtları salt okunur görür); öbür
   kurumdaki portalı sürer.

### Servisçi

Tanımda (kullanıcı 29 Eylül: "servisçi de portal") servisçi de aynı modeli kullanır: T.C. kimlik no kişi başına sistem genelinde
tektir; iki okulda servis süren aynı kişi tek hesapla girer, Portallarım'da iki portalı olur ("Servisçi · okul").

### Yetişkin

Bir yetişkin de dershaneye öğrenci olarak gidebilir: kurum onu T.C. kimlik no + doğum tarihiyle eklerse yetişkin hesabının
Portallarım'ına bir "Öğrenci · kurum" portalı düşer. Yetişkin hesabında T.C. kayıtlı değilse kurum onu **"Öğrenciler → Kodla
ekle"** ile kişinin (öğretmende kullanılan) kişi koduyla ekler (öneri — [Kişi kodu](kisi-kodu.md)).

## Kurallar ve sınırlar

- **Tek kişi, tek hesap:** öğrenci hesabı da ana hesap (giriş bilgileri, T.C., doğum tarihi, e-posta) + kurum başına bir rol satırı
  olur. Bugünkü öğrenci satırı rol satırı olarak kalır (kimliği aynı: ödev, not, devamsızlık, servis bağları bozulmaz); giriş
  bilgileri yeni ana hesaba taşınır.
- **Eşleme şartı T.C. + doğum tarihi:** e-posta tek başına yetmez (öğrencide isteğe bağlı, çoğu zaman velinin ortak e-postası).
  Yanlış doğum tarihi denemesi tek tek eklemede saatte 10 ile sınırlıdır; Excel'deki uyuşmayan doğum tarihi toplu işi kilitlemez,
  o satır "tek tek ekle" diye listelenir.
- **"+ Ekle"de "Kuruma katıl / öğrenci oturumu ekle" yok** (kullanıcı 28 Eylül): portal yalnız kurum ekleyince düşer.
- **Nakil artık taşıma değil:** yeni kurum portal ekler; eski okul öğrenciyi okuldan çıkarınca o portal "geçmiş" (salt okunur) olur.
- **Kurumlar birbirini görmez:** eşleme listesinde ve hesap penceresinde bulunan hesabın başka kurumu gösterilmez.
- **Bildirim:** tek kurumda bugünkü gibi; birden çok kurumda başlıkta kurum adı ("Dershane B · Yeni ödev").
- **Kullanıcı adı site genelinde tek** olur (bugün okul içinde tek); çakışan okul hesaplarına ek (ali.kaya → ali.kaya2), değişenler
  müdürün ekranında listelenir ve kişiye bildirim gider ([Kullanıcı adı](../giris-hesap/kullanici-adi.md)).
- **E-posta tekliği aynen kalır:** bir e-posta tek hesaptadır (28 Eylül'deki "bir e-posta birden çok hesapta" kararı 29 Eylül'de
  geri alındı). Kardeşlerde öğrenci e-postası boş bırakılır.
- **Kurum şifreyi değiştirebilir:** okul ya da dershane öğrencinin şifresini bugünkü gibi değiştirir (kullanıcı 29 Eylül: kurumlar
  güvenilir); değişiklik işlem kaydına ve kişiye bildirim olarak düşer. Öğrenci isterse iki adımlı doğrulama açar; şifreyi kim
  değiştirirse değiştirsin iki adım açık kalır ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).
- **Yaş kuralı yok** (kullanıcı 29 Eylül: "yaş şeyi olmasın").
- **KVKK:** ana hesap/portal modeli aydınlatma metnine girer, KVKK sürümü artar (herkes yeniden onaylar).
- **Sıra:** canlıdan önce; "Çalışan olarak ekleme" işiyle birlikte ya da hemen ardından.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Portallarım](portallarim.md), [Portal seçme ekranı](portal-secme-ekrani.md), [Portala geçiş](portala-gecis.md).
- [Velide her çocuk ayrı oturum](velide-cocuk-oturumlari.md) — çocuğun her kurumu ayrı satır.
- [+ Ekle penceresi](ekle-penceresi.md) — öğrencide neden yok.
- [Kişi kodu](kisi-kodu.md) — T.C.'siz yetişkini kodla ekleme önerisi.

**İlgili:**

- [Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md), [Öğrenci nakli](../hesaplar/ogrenci-nakli.md) — bugünkü ekleme ve taşıma.
- [Eşleme ("Eşleyelim mi?")](../excel-aktarim/eslestirme.md) — Excel'de toplu eşleme.
- [T.C. kimlik numarası](../giris-hesap/tc-kimlik-no.md) — bütün hesaplarda zorunlu olacak T.C.
- [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md) — doğrudan o kurumun portalı.
- [Bildirim paneli](../bildirim/bildirim-paneli.md) — kurum adlı bildirimler.
- [Mezunlar](../egitim-yili/mezunlar.md) — mezun portalı ("geçmiş kayıtlarını yalnız okur, yeni okuluna portal ekleyebilir").
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Bugünkü düzen: öğrenci hesabı kişiye aittir (şema 021), nakil hesabı taşır
([sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md)); öğrencide portal listesi gelmez
([sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) `portalBilgisi` yalnız yetişkinde). Kodlanınca dokunulacak yerler:
[sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) (öğrenci ekleme, kodla ekleme),
[sunucu/bolumler/kisi-aktarim.md](../../sunucu/bolumler/kisi-aktarim.md) (Excel eşleme),
[sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (portallar, giriş),
[sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) (ana hesap + rol satırı),
[public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) (Portallarım öğrencide),
[public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) (kurum adlı bildirim),
`public/kvkk/kvkk.html` (aydınlatma metni). Tasarım: Tasarım 1 önizlemesinde Elif'in dershane portalı ve müdürün "Öğrenci ekle" /
"Eşleyelim mi?" pencereleri.

## Sık sorulanlar

- **Dershaneye de kaydoldum, yeni hesap mı açacağım?** Hayır. Dershane seni T.C. kimlik no ve doğum tarihinle ekler; aynı
  kullanıcı adın ve şifrenle girersin, dershane portalın kendiliğinden gelir.
- **Okulum dershanedeki notlarımı görür mü?** Hayır. Kurumlar birbirini görmez.
- **Okul değiştirirsem eski okulumun kayıtları ne olur?** Eski okul seni çıkarınca o portal "geçmiş" olur; kayıtlarını salt okunur
  görürsün.
- **Kendim "+ Ekle" ile kuruma katılabilir miyim?** Hayır; öğrencide "+ Ekle" yoktur, kurum seni ekler.

## Sırada

- Tek kişi tek hesap + portallar öğrencide de (iş 19; onaylı, canlıdan önce): ana hesap + rol satırı, kendiliğinden düşen portal,
  "Eşleyelim mi?", nakil yerine portal, servisçi portalı, kullanıcı adının site genelinde tek olması, giriş yolları, KVKK.
- Çalışan olarak ekleme (iş 2): aynı rol modeli değişikliği.
- T.C. kimlik no bütün hesaplarda zorunlu (iş 32; kodu Linux'ta): eşlemenin dayanağı.
