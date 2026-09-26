# Eğitim Evi — kılavuz

**[egitimevi.org](https://egitimevi.org)** · okul portalı

Bu belge projenin ne olduğunu, kurulumu, her bölümün nasıl çalıştığını, güvenlik
kararlarını ve testleri anlatır. Her ekranın fotoğrafı ve müdürün gözünden anlatımı
[ekran-goruntuleri/index.html](../ekran-goruntuleri/index.html)'de. Sunucuya (VPS) kurulum ve
`egitimevi.org` adımları [SUNUCUYA-KURULUM.md](SUNUCUYA-KURULUM.md)'de; kişisel veriler
[aydınlatma metninde](../public/kvkk.html), kurallar [kullanım koşullarında](../public/kosullar.html).

## Eğitim Evi nedir?

Eğitim Evi; öğrencinin, velinin, öğretmenin ve okul yönetiminin her gün baktığı
şeyleri tek yerde toplar: ödevler, sınav notları, devamsızlık, ders programı,
mesajlar, takvim, yemek listesi ve okul servisi. Tarayıcıdan açılır; telefona ve
bilgisayara uygulama gibi kurulabilir, ayrıca bir şey indirmek gerekmez.

Her okulun kendi adresi vardır (`egitimevi.org/okulun-adi`). Öğrenci ve öğretmen
okulunun adresinden girer; okul o sayfayı kendi fotoğrafları ve renkleriyle düzenler.


### Kim ne yapar

| Kim | Ne görür, ne yapar |
|---|---|
| **Öğrenci** | Ödevlerini görür, dosya teslim eder, önemli ödevi yıldızlar; sınav notlarını, grafiğini, devamsızlığını, ders programını ve etütlerini takip eder |
| **Veli** | Çocuğunun ödevlerini, notlarını, devamsızlığını ve servisinin nerede olduğunu görür; birden çok çocuğu tek hesaptan izler |
| **Öğretmen** | Ödev verir ve sonuçlandırır, sınav açar ve not girer, yoklama alır, sınıfına ya da velilere mesaj yazar |
| **Müdür** | Sınıfları, dersleri, ders programını, öğretmen ve öğrenci hesaplarını, rolleri ve yetkileri yönetir; okulun giriş sayfasını düzenler |
| **Servisçi** | Seferi başlatır; öğrenci ve veli servisin yaklaştığını telefonunda görür |
| **Sistem yöneticisi** | Okul başvurularını onaylar ya da okulu kendisi açar, yedek alır |

**Tek hesap, birden çok rol.** Bir kişi aynı hesapla bir okulda öğretmen, başka bir
okulda müdür ve kendi çocuğunun velisi olabilir; girişte hangisiyle devam edeceğini seçer.

**Öğrenci hesabı kişiye aittir.** Öğrenci okul değiştirince yeni okul, T.C. kimlik no ve
doğum tarihi eşleşirse aynı hesabı kendi okuluna alır. Eski okulun kayıtları orada kalır;
öğrenci ve velisi eski yılları ("2025-2026 · Eski Okul · 6-A") seçip görebilir.


### Neler var

- **Ödev:** sınıfa ya da seçilen öğrencilere ödev, teslim dosyası (fotoğraf, belge,
  video; öğretmen fotoğrafı, videoyu ve sesi indirmeden açar), öğrencinin ödevi açıp açmadığı, sonuç (yaptı, geç yaptı, eksik, yapmadı,
  gelmedi), sonradan düzeltme, yıldız ve süzgeçler.
- **Sınav:** hazır şablonlar (Yazılı 0–100, LGS 0–500, doğru/yanlış/boş/net), ondalıklı
  notlar, sınav grupları ve ağırlıklı ortalama, öğrencinin gelişim grafiği.
- **Devamsızlık ve etüt:** ders yoklaması, etüt günü ve saatinde "geldi / izinli / izinsiz".
- **İletişim:** okul içi mesajlar, sınıfa ya da herkese duyuru, okundu bilgisi, anketler,
  telefona bildirim. Mesaja ve ödeve sürükle-bırak ile birden çok dosya eklenir
  (toplam 150 MB, 7 gün saklanır).
- **Okul hayatı:** ders programı, takvim ve tatiller, yemek listesi, kulüpler, servis
  haritası ve canlı servis konumu.
- **Yönetim:** roller ve yetkiler (hazır şablonlar: Müdür Yardımcısı, Rehber Öğretmen,
  Etüt Sorumlusu, Kodlayıcı...), Excel ile toplu öğrenci ve ders programı aktarımı,
  eğitim yılı arşivi, işlem kaydı, günlük yedek.
- **Okul sayfası:** okulun giriş adresinde kapak, logo, tanıtım yazısı ve fotoğraf
  galerisi; renkler ve kısıtlı CSS ile okul kendi görünümünü seçer.
- **Okul araması:** MEB'in 67 bin okulu içinde; büyük/küçük harf, Türkçe harf, yazım
  hatası ve kısaltma (AİHL, MTAL, BİLSEM...) fark etmez.
- **Görünüm:** açık ve koyu tema (üstteki ay / güneş düğmesiyle), telefonda parmakla
  rahat kullanım, reklam yok; fotoğraf yerine adın baş harfleri.
- **Ödev serisi:** öğrenci arka arkaya "Yaptı" aldığı ödevleri sayar; tek kaçırmada
  uyarı, iki kaçırmada seri bozulur.
- **Ders programından yoklama:** öğretmen o anki dersine dokunur, her öğrenciye Geldi /
  Gelmedi (izinli) / Gelmedi (izinsiz) seçer; veliye ders adı ve saatiyle bildirim gider.
- **Sınıflarım:** öğretmen ders verdiği sınıfları, öğrencilerini, verdiği ödevlerin
  sonuçlarını ve öğrencinin sınav sonuçlarını görür (müdür rolden açar/kapatır).
- **Hatırlatıcılar:** herkes kendine kurar: bir kez, her gün, haftanın seçilen günleri
  ya da ayda bir; zamanı gelince bildirim gelir.
- **Özellikler:** müdür okulunda kullanmadığı bölümü (ödev, sınav, devamsızlık, etüt,
  servis, yemek, kulüp, anket) kapatır; kimsenin menüsünde görünmez, kayıtlar silinmez.
- **Yorumlar:** açılış sayfasında kullanıcıların 0–5 yıldızlı yorumları; yalnızca
  yetişkinler yazar, adı kısaltılır, uygunsuz kelime süzgecinden geçer.


### Gizlilik ve güvenlik

- Veriler okulun kullandığı sunucuda durur. Reklam, analiz ya da başka bir amaçla hiçbir
  şirkete veri gönderilmez. [Aydınlatma metni (KVKK)](../public/kvkk.html) sitede herkese açıktır.
- T.C. kimlik numarasını yalnızca kişinin kendisi ve okul yönetimi görür.
- Kendisi kaydolan kişinin e-posta adresi, gönderilen bağlantıyla doğrulanır; girişte
  e-postaya giden kodla iki adımlı doğrulama yapılır.
- Yetişkin hesaplarında güçlü şifre zorunludur; kaba kuvvet denemelerine karşı hesap
  kilidi, bot sorusu ve hız sınırı vardır.
- Her API ucu her rol için otomatik olarak denenir: yetkisiz geçen istek var mı, bozuk
  veri sunucuyu düşürüyor mu, SQL'e kullanıcı değeri karışıyor mu.

Listesi [yapimcilar.json](../yapimcilar.json) dosyasındadır; sitede üst şeritteki
**Yapımcılar** düğmesinde görünür.

---

## Nasıl çalıştırılır (Linux)

Gerekenler: **Node.js 20+** (24 önerilir) ve **PostgreSQL 17**. Ubuntu/Debian'da:

```
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo bash -
sudo apt install -y nodejs git postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y   # PostgreSQL'in kendi deposu (17 için)
sudo apt install -y postgresql-17
```

Veritabanı kümesinin yerel ayarı varsayılan (`C.UTF-8` / `en_US.UTF-8`) kalsın; Türkçe
yerel ayar seçilmez (büyük İ/ı yüzünden e-posta karşılaştırması bozulur). Türkçe
alfabe sırası sorgularda ayrıca sağlanır.

**İlk kurulum (bir kez):**

```
git clone https://github.com/KARANKOYU/Egitim-Evi.git egitimevi
cd egitimevi
npm ci                                             # tek paket: pg
mkdir -p data && sudo chown -R postgres data
sudo -u postgres node araclar/veritabani-kur.js --yerel-soket
sudo chown -R "$USER" data && chmod 600 data/ayarlar.json
```

Kurulum aracı şunları yapar:
- uygulamaya özel, yetkisi kısıtlı `egitimevi` kullanıcısını açar ve ona 32 karakterlik
  rastgele bir şifre üretir (ekrana yazmaz),
- `egitimevi` (asıl) ve `egitimevi_test` (testler) veritabanlarını açar,
- bağlantı bilgisini `data/ayarlar.json`'a yazar (depoya girmez).

**Okul listesi** (`data/okullar.json`, MEB'in 67 bin okulu) depoda yoktur; kurulumu
yapan kişi dosyayı `data/` altına ayrıca kopyalar. Dosya yoksa uygulama çalışır, yalnızca
MEB listesinde okul araması kapalı olur.

**Çalıştırmak:** `npm start`, sonra tarayıcıda http://localhost:3000
(`node sunucu/index.js` ile aynı; kökteki `server.js` de aynı işi yapan 3 satırlık kabuktur.)
Tablolar ilk açılışta `sunucu/veri/sema/` altındaki SQL dosyalarından kendiliğinden kurulur.
Kapatmak için Ctrl+C. Sunucuda kalıcı çalıştırma (systemd) SUNUCUYA-KURULUM.md'de.

> "PostgreSQL çalışmıyor" hatası çıkarsa: `sudo systemctl start postgresql`.

**Aynı ağdaki telefondan denemek için:** terminalde yazan `Telefondan: http://192.168.x.x:3000`
adresini telefonun tarayıcısına yaz (telefon ve bilgisayar aynı wifi'de olmalı).

---

## İlk giriş (admin)

İlk çalıştırmada otomatik bir yönetici hesabı oluşur. E-postası
`admin@egitimevi.com`; şifresi **rastgele üretilir ve terminale yalnızca
bir kez yazılır** (kod herkese açık depoda olduğu için sabit bir şifre yok).

**Önemli:** Giriş yaptıktan sonra **Ayarlar → Şifre değiştir** bölümünden bu şifreyi hemen değiştir.

---

## İki adımlı giriş (2FA)

Giriş kartında kaydırmalı bir seçim var: **Kullanıcı adı | E-posta** (seçim bu
tarayıcıda hatırlanır; kullanıcı adı kutusuna `@` yazılırsa kendiliğinden e-postaya
geçer). Büyük/küçük harf fark etmez.

**Öğrenci dışında herkes** (veli, öğretmen, müdür, servisçi, yönetici) e-postası
varsa **iki adımlı** girer ve bu kapatılamaz:

1. Kullanıcı adı (ya da e-posta) + şifre girilir
2. Hesabın e-posta adresine **6 haneli kod** gider, o girilir

Öğrenci kodsuz girer (e-postası olsa bile). E-postası olmayan hesaba kod
gönderilemez; o hesap yalnızca kullanıcı adı ve şifreyle girer. Yetişkin hesabı
açarken e-posta zorunludur; eski düzenden kalıp e-postası olmayan yetişkine girişte
bir kez "E-posta eklemek ister misin?" sorulur (**Ayarlar → Giriş bilgileri**).

Hata mesajları ayrıdır: "Bu kullanıcı adıyla kayıtlı bir hesap yok" ya da
"Şifre yanlış. 3 deneme hakkın kaldı" — kutunun altında kırmızı yazar.

Kod 5 dakika geçerlidir, **tek kullanımlıktır**, 5 hatalı denemede iptal olur.
Kod hiçbir zaman tarayıcıya gönderilmez — sunucuda özetlenerek (SHA-256) tutulur
ve diske hiç yazılmaz.

### E-posta ayarlanmamışsa ne olur?

Sistem kimseyi dışarıda bırakmaz: kod **sunucu penceresine (siyah ekran)** yazılır.
Test ederken bu yeterli, ama gerçek kullanımda e-postayı ayarlaman gerekir.

### E-posta ayarlama (kolay yol)

`npm run eposta-ayarla` komutunu çalıştır. Sorulara sırayla cevap ver:
sağlayıcını listeden seç, kullanıcı adını ve şifreni yaz (şifre ekranda görünmez),
deneme maili gönder. Ayarlar kendiliğinden kaydedilir.

Şifren sadece bu bilgisayardaki `data/ayarlar.json` dosyasına yazılır.

### E-posta ayarlama (elle)

`data/ayarlar.json` dosyasını aç ve doldur:

```json
{
  "eposta": {
    "etkin": true,
    "sunucu": "smtp.gmail.com",
    "port": 465,
    "guvenli": true,
    "kullanici": "senin@gmail.com",
    "sifre": "16-haneli-uygulama-sifresi",
    "gonderen": "senin@gmail.com",
    "gorunenAd": "Eğitim Evi"
  }
}
```

Sonra sunucuyu yeniden başlat.

**Gmail kullanacaksan:** Normal şifren çalışmaz, **Uygulama Şifresi** gerekir.
Google Hesabım → Güvenlik → **2 Adımlı Doğrulama**'yı aç → sonra
**Uygulama şifreleri** → yeni şifre üret → çıkan 16 haneli kodu yukarıya yaz.

**Telefon numarası istemeyen alternatifler** (ücretsiz):

**Kendi posta kutusu veren (yeni adres alırsın):**

| Servis | Sunucu | Port | Not |
|---|---|---|---|
| GMX | `mail.gmx.com` | 587 (`guvenli: false`) | Genelde telefon istemez. Ayarlardan POP3/IMAP erişimini aç. |
| Yandex | `smtp.yandex.com` | 465 (`guvenli: true`) | Uygulama şifresi gerekir |
| Zoho | `smtp.zoho.com` | 465 (`guvenli: true`) | Uygulama şifresi gerekir |
| Gmail | `smtp.gmail.com` | 465 (`guvenli: true`) | Uygulama şifresi gerekir (2 Adımlı Doğrulama açık olmalı) |

**Sadece gönderim yapan (posta kutusu vermez, mevcut adresini kullanır):**

| Servis | Sunucu | Port | Ücretsiz sınır |
|---|---|---|---|
| Brevo | `smtp-relay.brevo.com` | 587 (`guvenli: false`) | 300 e-posta/gün |
| Mailjet | `in-v3.mailjet.com` | 587 (`guvenli: false`) | 200/gün |
| SMTP2GO | `mail.smtp2go.com` | 587 (`guvenli: false`) | 1000/ay |

> **Outlook/Hotmail çalışmaz:** Microsoft 2024 sonunda kişisel hesaplarda
> şifreyle SMTP girişini kapattı, artık OAuth2 istiyor.

> **Görünen ad numarası:** Alıcılar `gorunenAd` alanını görür. Yani adres
> `okulunuz.egitimevi@gmail.com` olsa bile e-posta **"Eğitim Evi"**den gelmiş
> gibi görünür. Yeni hesap açmadan da kurumsal duruyor.

> Port 465 → `"guvenli": true` · Port 587 → `"guvenli": false` (STARTTLS)

> `data/ayarlar.json` web'den **servis edilmez**, şifre tarayıcıya sızmaz.
> Yine de dosyayı kimseyle paylaşma.

---

## Okul listesi (MEB)

Sistemde **Millî Eğitim Bakanlığı'nın 67.661 okulu** hazır kayıtlı — 55.109 devlet, 12.552 özel; 81 il, 926 ilçe.
Müdür adayı kaydolduktan sonra **Okulunu kaydet** bölümünde okulunu bu listeden arayıp seçer.

**Arama iki şekilde çalışır:**
- **İl seçmeden** okul adı yaz → Türkiye genelinde arar
- **İl (ve istersen ilçe) seç** → sadece orada arar

Okul türüne göre de süzebilirsin (Ortaokul, Lise, İlkokul, Anaokulu, Meslek Lisesi,
Sanat Okulu, Halk Eğitim Merkezi).

Arama yazana yardım eder (`sunucu/yardimci/bulanik-arama.js`):

- **Büyük/küçük harf ve Türkçe harf fark etmez:** `rReNk`, `RENK`, `renk` aynıdır;
  `sisli` yazınca **Şişli Anadolu Lisesi** gelir.
- **Kelimeler sırasız:** `renk ortaokulu` ile `ortaokulu renk` aynı sonucu verir;
  noktalama önemsizdir (`m.akif`).
- **Yazım hatası düzeltilir:** 4-6 harfli kelimede 1, daha uzununda 2 harf farkı
  (eksik, fazla, yanlış ya da yer değiştirmiş harf): `ortaoklu` → Ortaokulu,
  `anadlu` → Anadolu, `rekn` → Renk. Düzeltilen kelime doğru yazılmış gibi
  sıralanır; ekranda "… diye aradık" yazar ve eşleşen kelimeler koyu görünür.
- **Kısaltmalar:** AİHL, İHL, İHO, FL, AL, MTAL, SBL, GSL, OO, İO, BİLSEM, HEM, RAM.
- **Bitişik yazılan kelimeler ayrılır:** `ahmetvefikpasa` → Ahmet Vefik Paşa.
- Hiçbir okul bütün kelimeleri tutmazsa en çok kelimesi tutanlar "yakın sonuç"
  olarak gelir. Yalnızca noktalama yazılırsa (il de seçilmemişse) arama yapılmaz.

67 bin okulda bir arama birkaç milisaniye sürer: okul adlarındaki kelimeler bir
kez sözlüğe konur, aranan kelime okullarla değil sözlükle karşılaştırılır.

> Listede olmayan (yeni açılmış) okullar için **"Okulum listede yok"** bölümü
> var; adı elle yazılır, yönetici onaylar.

Bir okula **yalnızca bir müdür** kaydolabilir; ikincisi reddedilir.

### Liste nerede?

Liste `data/okullar.json` dosyasındadır ve **depoda yer almaz**. MEB'in açık okul
arama servislerinden (`meb.gov.tr`, özel okullar için `ookgm.meb.gov.tr`) bir kez
çekildi; çeken araç da yalnızca kurulumu yapan bilgisayarda durur.

Sunucuya kurarken dosyayı ayrıca kopyala (belge/SUNUCUYA-KURULUM.md). Dosya yoksa
sistem yine çalışır; yalnızca müdür kaydında okul listeden aranamaz, adı elle yazılır.

---

## Hesap türleri ve onay zinciri

İki tür hesap var:

- **Yetişkin hesabı**: veli, öğretmen ve müdür kendisi açar (**Hesap Aç**). Tek hesap,
  birden çok rol: A okulunda öğretmen, B okulunda müdür, çocuğunun velisi olabilir.
- **Okulun açtığı hesap**: öğrenci ve servisçi kaydolmaz, hesabını okul açar (tek
  tek ya da dosyadan toplu).

| Kim | Nasıl | Kim onaylar |
|---|---|---|
| **Müdür** | Yetişkin hesabıyla **Ekle → Okulumu kaydet** (MEB listesinden) | **Admin (sen)** |
| **Öğretmen** | Yetişkin hesabıyla **Ekle → Öğretmen olarak katıl**: kişisel kodunu müdüre verir; müdür **Öğretmenler → Kodla ekle** ile kodu girer, maskeli adı ("Ay** Yı****") görüp ekler | Gerekmez |
| **Veli** | Yetişkin hesabıyla **Ekle → Çocuğumu ekle** (veli kodu); ya da okul, velinin T.C. no'su veya kullanıcı adıyla bağlar | Gerekmez |
| **Öğrenci** | Müdür (ya da yetkili) **Öğrenciler → Öğrenci ekle** ya da dosyayla açar | Gerekmez |
| **Servisçi** | Müdür (ya da servis yetkilisi) **Servisler → Servisçi ekle** ya da dosyayla açar | Gerekmez |

**Rol seçimi.** Yetişkin girişten sonra rolleri alt alta görür: *Öğretmen — okul adı*,
*Müdür — okul adı*, *Veli — çocuğun adı*. Birini seçip devam eder; menüdeki **Hesap
değiştir** ile aralarında geçer. Tek rolü varsa doğrudan o açılır. Sağdaki **Ekle**
yeni rol açar. Rol değişince yeni oturum açılır, eskisi kapanır; her şeyi sunucu denetler.

**Öğretmen kodu** tek kullanımlıktır: bir okul öğretmeni eklediği an kod yenilenir,
başkası görse de kullanamaz. Öğretmen **Yeni kod üret** ile eskisini geçersiz kılabilir.
Bir hesap en fazla 10 okula öğretmen olarak eklenebilir; bir okulda yalnızca tek rolü olur.

**Bırakma ve silme.** Öğretmen **Hesap değiştir → Okuldan ayrıl** der; bekleyen okul
başvurusu geri çekilebilir. **Ayarlar → Hesabımı sil** yetişkin hesabını, çocuk bağlarını
ve öğretmenlik rollerini siler (KVKK silme hakkı); onaylı bir okulun müdürü önce
müdürlüğü devretmelidir. Verilen ödev ve notlar okulda kalır; ayrılan öğretmenin
açık ödevlerini müdür **Ödevler** sayfasından sonuçlandırır.

Okulun gördüğü: öğretmenin adı, telefonu, okuldaki kullanıcı adı ve branşı. E-postası,
şifresi ve T.C. no'su yetişkin hesabındadır; okul bunları görmez, değiştiremez. Okul
yalnızca branşı düzenler ya da öğretmeni okuldan çıkarır.

Okulun açtığı hesapta **ad, soyad ve T.C. kimlik no** zorunludur. Kullanıcı adı boş
bırakılırsa T.C. no, şifre boş bırakılırsa yine T.C. no olur; kişi ilk girişte **kendi
şifresini belirlemeden** hiçbir şey yapamaz (sunucu da bu durumdaki her isteği reddeder).
Yeni şifre eskisiyle aynı olamaz, T.C. no'yu ya da kullanıcı adını içeremez.

Kullanıcı adı ve T.C. no **okul içinde** tektir: iki okulda aynı "ayse.kaya" olabilir.
Öğrencide T.C. no **bütün sistemde** tektir: öğrenci hesabı okula değil kişiye aittir
(aşağıda "Öğrenci nakli").
Bu yüzden öğrenci, öğretmen ve servisçi **okulunun adresinden** girer (aşağıda
"Okul adresi"). E-posta her yerde tektir. T.C. no'yu kişinin kendisi ve okul yönetimi
görür; öğretmenler ve öğrenciler görmez.

Bir kişi **hem öğretmen (ya da müdür) hem veli** olabilir: çocuğu yetişkin hesabına
bağlanır, rol seçiminde *Veli — çocuğun adı* satırı çıkar.

### Açılış sayfası, giriş ve site ayarları

Giriş yapmamış ziyaretçi şu sayfaları görür; hepsinde aynı üst şerit (sol
üstte **Giriş** ve **Kayıt ol**, sağda **Hakkında** ve **Yapımcılar**) ve alt
bilgi (ortada GitHub'daki kaynak koduna bağlantı) vardır. **Yapımcılar**'a
basınca projede emeği geçenlerin listesi açılır; liste depodaki
`yapimcilar.json` dosyasındadır, projeye katılan kendini oraya ekler:

```json
[
  { "ad": "KARANKOYU", "github": "KARANKOYU", "katki": "Proje sahibi" }
]
```

| Adres | Sayfa |
|---|---|
| `/` | Eğitim Evi nedir, neler var, kimin için; okul, kişi ve **şu an açık** sayısı |
| `/hakkinda` | Proje, bilgilerin nerede tutulduğu, nasıl yapıldığı, yapımcılar, iletişim |
| `/login` | Giriş; öğrenci ve servisçi için "okulunu seç" (seçince okulun sayfasına gider) |
| `/signup` | Yetişkin hesabı açma |
| `/okulun-adi` | Okulun giriş sayfası (aşağıda) |

"Şu an açık": son 5 dakikada uygulamaya istek gönderen farklı kişi sayısı;
yalnızca sayı tutulur, kimin açık olduğu tutulmaz. Rakamlar dakikada bir
yenilenir (`/api/site`).

**Yorumlar.** Açılış sayfasının altında kullanıcı yorumları durur (0-5 yıldız ve
en fazla 500 harf). Yalnızca **yetişkinler** yazar: rolü (öğretmen, müdür) ya da
çocuğu olan hesap; öğrenci ve servisçi yazamaz. Hesap başına tek yorum olur,
kişi onu düzeltip silebilir. Yazanın adı kısaltılarak görünür: *Ayşe Kaya* →
"Ay. Ka.", iki isimliyse isimlerin baş harfi: *Ayşe Nur Kaya* → "A. N. Ka.".
Uygunsuz kelime süzgeci depodaki `badwordsfilter.json` listesine bakar:
büyük/küçük harf, Türkçe harf, harf uzatma ("salaaak") ve harf aralarına
konan boşluk/nokta ("a p t a l") fark etmez. İnternet adresi de kabul edilmez.
Yönetici **Yorumlar** sayfasından bir yorumu gizler ya da yeniden gösterir.

**İletişim bilgileri kodda değil**, sunucudaki `data/config.yml` dosyasındadır
(depoya girmez; örneği `belge/config.ornek.yml`). Dosyaya e-posta ve telefon
yazılınca en geç 30 saniyede Hakkında sayfasına ve alt bilgiye eklenir; boş
alan görünmez. E-posta sayfanın HTML kaynağında düz yazı olarak durmaz
(adres toplayan botlar için), tarayıcıda kurulur.

```yaml
iletisim:
  eposta: ""
  telefon: ""
```

### Okul adresi (egitimevi.org/okulun-adi)

Her okulun kendi adresi vardır: `egitimevi.org/doruk-koleji` gibi. Okul onaylanınca
adından bir adres önerilir; müdür **Okul Adresi ve Konumu** sayfasından kendisi
değiştirir (küçük harf, rakam, tire; 3–40 karakter; sitenin kendi sayfa adları alınamaz).
Adres değişince eski adres çalışmaz.

- Okul adresi açılış sayfasında tanıtılmaz. Öğrenci `/login` sayfasında okulunu seçer, okulun
  sayfasına gider; müdür okulun bağlantısını dağıtabilir. Son girilen okul bu tarayıcıda hatırlanır.
- **Okul sayfası** (`egitimevi.org/doruk-koleji`): giriş kartının üstünde okulun kendi
  tanıtımı (aşağıda); giriş o okulun içinde aranır (kullanıcı adı, T.C. no ya da e-posta).
  Veli de buradan girebilir.
- Okulsuz girişte aynı kullanıcı adı birden çok okulda varsa sunucu "önce okulunu seç" der.
- Girişten sonra adres çubuğu kişinin okuluna döner; sayfa yenilenince aynı okulda kalır.

**Okul sayfasını düzenleme.** Müdür ya da **okul.sayfa** yetkisi verilen kişi (hazır rol
şablonu: **Kodlayıcı**) menüdeki **Okul Sayfası**'ndan düzenler; sağda canlı önizleme vardır.

| Ne | Nasıl |
|---|---|
| Fotoğraflar | Kapak, logo ve en fazla 8 galeri fotoğrafı; PNG, JPEG ya da WebP, en fazla 3 MB |
| Tanıtım yazısı | Düz metin, en fazla 1500 karakter; paragraflar boş satırla ayrılır |
| Görünüm | Ana renk, zemin, yazı rengi; okul adının boyu ve yeri; kapak yüksekliği; sayfa genişliği; galeride yan yana kaç fotoğraf |
| Kendi CSS'i | İsteğe bağlı, kısıtlı (aşağıda) |

Sayfa serbest kod değildir: HTML ve betik (JavaScript) yazılamaz, yapı sabittir.
Güvenlik için:

- **CSS kısıtlı.** Yalnızca sayfanın parçaları seçilebilir (`.os-kutu`, `.os-kapak`,
  `.os-ust`, `.os-logo`, `.os-baslik`, `.os-yer`, `.os-tanitim`, `.os-galeri`, `.os-foto`;
  yanında `:hover`, `:first-child`, `:last-child`, `:nth-child()`). Renk, yazı, boşluk,
  çerçeve, köşe, gölge, boyut (sınırlı), flex/grid gibi özellikler kullanılabilir.
  `url()`, `@import` ve bütün @ kuralları, `position`, `z-index`, `transform`, `content`,
  eksi boşluk, ters bölü ve başka seçiciler atılır; kişiye neyin neden atıldığı söylenir
  (`sunucu/yardimci/css-temizle.js`). Kalan kurallar yalnızca sayfanın içine uygulanır;
  sayfanın kutusu `contain: paint` ile dışına, giriş kartının üstüne hiçbir şey çizemez.
  Kişinin yazdığı CSS olduğu gibi saklanır, sayfaya giderken her seferinde yeniden temizlenir.
- **Fotoğrafın türü** adından değil ilk baytlarından anlaşılır; SVG hiç kabul edilmez.
  Çekildiği yerin konumu, tarih ve cihaz bilgisi (EXIF/XMP, PNG yazıları) kaydetmeden
  önce silinir; JPEG'de yalnızca yön bilgisi kalır (`sunucu/yardimci/resim.js`).
- Değişiklikler **İşlem Kaydı**'na yazılır. Sayfa herkese açıktır; öğrencilerin yüzü
  görünen fotoğraflar için veli izni okulun sorumluluğundadır.

### Sistemi ilk kez kurma sırası

1. `admin@egitimevi.com` ile gir.
2. Müdür adayı yetişkin hesabı açsın, **Ekle → Okulumu kaydet** ile başvursun.
3. Admin panelinde **Onay Bekleyenler** → Onayla. Okul artık aramada görünür.
4. Müdür **Okul Adresi ve Konumu** sayfasında adresi ve okulun haritadaki yerini seçer.
5. Müdür öğrenci ve servisçi hesaplarını açar: tek tek ya da **Excel Aktarım** ile
   (iki sayfalı şablon ya da kendi XLS/ODS/CSV/TXT listesi). Olmayan sınıflar açılır.
   Öğretmenler yetişkin hesabı açıp kodlarını verir; müdür **Öğretmenler → Kodla ekle**.
6. Müdür dersleri açar, derslere öğretmen atar, servisleri kurar.
7. Öğretmen artık ödev verebilir ve sınav açabilir.
> 81 il hazır tanımlı.

---

## Sınıflar ve ders programı

Bu bölümü **müdür** yönetir.

### Sınıflar

**Sınıflar** sayfasından sınıf açılır (`7-A`, `8-C` gibi). Her sınıf kartında
kaç öğrenci ve kaç ders olduğu, öğretmeni atanmamış ders varsa uyarısı görünür.

- **Öğrenciler** butonu → okuldaki tüm öğrencileri listeler, her birinin sınıfı
  açılır listeden değiştirilir
- **Dersler** butonu → sınıfa ders eklenir, her derse **haftalık saat** ve
  **öğretmen** atanır
- **Ders programı** butonu → doğrudan o sınıfın programını açar
- **Sil** → sınıf silinir; öğrenciler sınıfsız kalır, dersleri ve programı temizlenir
  (öğrenci hesapları silinmez)

Sınıfa yerleştirilmemiş öğrenci varsa sayfanın üstünde uyarı çıkar.

### Ders programı

**Ders Programı** sayfasında sınıf seçilir. İki görünüm var, üstteki
**Gün / Hafta** düğmesiyle geçilir. Tercih hatırlanır.

**Gün görünümü** — ekranda tek gün. Dersler yan yana sütunlar hâlinde:
*Ders 1, Ders 2, Ders 3…* Her sütunda saat aralığı, ders adı, öğretmen ve
Düzenle/Sil düğmeleri. Sonda kesikli **+ Ders ekle**.

- `‹ önceki gün` / `sonraki gün ›` ile gezilir
- Üstteki şeritte her günün ders sayısı yazar — hangi gün dolu, tek bakışta
- Bugün işaretli; devam eden ders **şimdi** etiketiyle çerçevelenir
- Ekran genişledikçe sütunlar yayılır, daraldıkça alt alta iner

**Hafta görünümü** — günler satır, ders sıraları sütun. Her hücrede yine
tam detay: saat, ders, öğretmen. Satır sonundaki **+** ile o güne ders eklenir.

Saatleri okulunun zil düzenine göre serbestçe yazarsın; sabit ders saati
kutusu yok. Bir ders haftada istediğin kadar saate konabilir.

### Çakışma uyarısı

Bir öğretmen aynı gün ve saatte iki farklı sınıfa düşerse sistem uyarır:

- Yerleştirme anında kırmızı uyarı çıkar
- Sayfanın üstünde çakışma listesi durur: *"Ayşe Kaya — Pazartesi 1. ders: 7-A Matematik ↔ 8-C Türkçe"*
- Çakışan ders satırı kırmızı ve ⚠️ işaretli görünür
- Saatler **kesişirse** çakışmadır; bitişik saatler (10:00 biten ile 10:00 başlayan) çakışma sayılmaz
- Öğretmen kendi programında da uyarıyı görür, çakışan iki dersi birlikte okur

### Kim ne görür

| Rol | Görünüm |
|---|---|
| **Müdür** | Tüm sınıfların programını düzenler |
| **Öğretmen** | *Ders Programım* — kendi haftalık programı, hangi sınıfa girdiği, ders yükü |
| **Öğrenci** | *Ders Programı* — kendi sınıfının programı, hangi derse hangi öğretmen |
| **Veli** | Çocuğunun sınıf programı |

---

## Hesap yönetimi

### Hesap açma (öğrenci, servisçi)

İki rol de aynı pencereyi kullanır: ad, soyad, T.C. no (zorunlu); kullanıcı adı, şifre,
e-posta, doğum tarihi, adres (isteğe bağlı); öğrencide sınıf ve okul no, servisçide
telefon. Kaydedince kullanıcı adı, şifre (ya da "T.C.
kimlik numarası"), okulun giriş adresi ve öğrencinin veli kodu **bir kez** gösterilir.

### Öğrenci nakli (başka okuldan gelen öğrenci)

Öğrenci hesabı kişiye aittir; okul değiştirince yeni hesap açılmaz. Yeni okul
**Öğrenci ekle**'de öğrencinin T.C. no'sunu yazar:

- T.C. no başka okulda kayıtlı bir öğrencinin ise pencere **doğum tarihini** de ister.
  T.C. no ile doğum tarihi eski kayıtla eşleşirse hesap bu okula taşınır;
  eşleşmezse eklenmez. Yanlış doğum tarihi denemesi kişi başına saatte 10 ile sınırlı.
- Öğrencinin kullanıcı adı (yeni okulda boşsa), şifresi, veli kodu ve velileri aynı kalır.
  Velinin "okulu" da (duyuru ve takvim) yeni okula geçer.
- Eski okulun ödev, not, devamsızlık ve etüt yoklamaları **o okulun kaydı** olarak
  kalır: yeni okul görmez, eski okul da öğrenciyi artık göremez. Öğrenci eski okulun
  etüt, kulüp ve servis listelerinden çıkar.
- Öğrenci ve velisi üstteki **eğitim yılı** seçicisinde eski okulun dönemlerini
  "2025-2026 · Eski Okul · 6-A" diye görür; seçince eski kayıtlar salt okunur açılır.
- Excel ile toplu aktarımda başka okuldaki T.C. no hata olarak gösterilir; o öğrenci
  doğum tarihiyle tek tek eklenir.
- Eski okulun müdürüne, öğrenciye ve velilere bildirim gider; işlem kayda geçer.

### Toplu hesap açma (Excel .xlsx/.xls, ODS, CSV, düz metin)

**Excel Aktarım → İçeri aktar → Kişi listesi.** Şablonda iki sayfa var: Öğrenciler ve
Servisçiler (üçüncü sayfada nasıl doldurulacağı yazar). Öğretmenler dosyayla eklenmez;
dosyada öğretmen sayfası varsa o sayfa neden eklenmediği yazılarak atlanır. Kendi
dosyan da olur: sütun başlıkları benzer olsun yeter ("İsim", "Ad(İsim)", "TC", "e posta",
"doğum tarihi gg.mm.yyyy"...). Sayfa adı "Sayfa1" gibi genelse tür dosya adından
(`öğrenci.ods`) ya da yüklerken yapılan seçimden anlaşılır.

- Öğrencide **sınıf ve şube ayrı sütun**: 7 + Çiçek → "7-Çiçek" sınıfı; yoksa açılır.
- Okulda aynı T.C. no ile kayıtlı kişi yeniden açılmaz, sınıfı ve bilgileri güncellenir
  (yıl sonunda sınıf atlatma bu yolla yapılır).
- Önce **kontrol**: her satırın ne olacağı (açılacak / güncellenecek / hata ve nedeni)
  gösterilir; onaylanınca tek işlemde (transaction) uygulanır. Tek seferde en fazla 600
  kişi; okul başına saatte 20 aktarım.
- Açılan hesapların giriş bilgileri bir kez gösterilir; **Giriş kâğıtlarını yazdır** ile
  her kişiye kesilip verilecek kâğıt çıkar.
- **Metinden Excel'e:** alt alta yazılmış isimleri (ya da bir .txt dosyasını) şablon
  biçiminde Excel'e çevirir; satır başındaki sıra numaraları atılır, yazılmışsa T.C.
  no sütununa geçer. Eksikleri doldurup içeri aktarırsın.
- **Dışarı aktar → Kişi listesi** aynı iki sayfayı verir (şifreler dosyada olmaz).

Eski Excel (.xls, 97-2003) için ayrı bir okuyucu var (sunucu/yardimci/xls.js): birleşik
belge biçimi ve BIFF8 kayıtları elle çözülür, ek paket yoktur. Şifreli .xls reddedilir.
Ders programı aktarımı da .xlsx, .xls, .ods ve .csv kabul eder.

Dosya zip bombasına karşı sınırlıdır (açılmış hâli en fazla 60 MB; en fazla 20 000
satır, 200 sütun); dosya yalnızca okunur, sunucuda saklanmaz.

### Kullanıcı adı ve şifre

Her öğrencinin satırındaki **Hesap** butonundan:

- Ad soyad ve **kullanıcı adı** değiştirilebilir
- **Şifre sıfırlanabilir** (elle yaz ya da **Rastgele üret**)
- **Veli kodu** görüntülenir, kopyalanır, gerekirse yenilenir

> **Şifreler görüntülenemez.** `scrypt` ile geri döndürülemez biçimde saklanıyor;
> sunucu bile mevcut şifreyi bilmiyor, yalnızca doğru olup olmadığını kontrol
> edebiliyor. Öğrenci şifresini unuttuysa yenisini belirlersin.

Şifre değişince o kişinin açık oturumları kapanır. **İlk girişte kendi şifresini
belirlesin** işaretliyse (varsayılan) kişi girer girmez yeni şifre koyar;
**Şifreyi T.C. no yap** ile şifre T.C. no'ya döner. Servisçi hesabı aynı pencereden
silinir, öğretmen **Okuldan çıkar** ile okuldan çıkarılır (hesabı kendisinde kalır);
öğrencininki silinmez, okuldan ayrılan öğrenci sınıfsız bırakılır.

### Toplu giriş bilgisi dağıtımı

**Öğrenciler → Giriş bilgisi dağıt** (şifre sıfırlama yetkisi gerekir): bir sınıf
ya da bütün okul seçilir. Varsayılan olarak **yalnızca henüz giriş yapmamış**
öğrenciler seçilir; kendi şifresiyle giren öğrencinin şifresi yanlışlıkla değişmez.

- Yeni şifreleri **sunucu** üretir (okunaklı, karışan harfler yok, `crypto.randomInt`);
  veritabanına yalnızca özetleri yazılır, seçilenlerin açık oturumları kapanır.
- Liste **bir kez** gösterilir: **Excel indir** ya da **Yazdır / PDF**. Yazdırmada her
  öğrenciye kesilip verilecek bir kâğıt çıkar: adres, kullanıcı adı, şifre ve veliye
  veli kodu. Pencere kapanınca liste tarayıcı belleğinden de silinir.
- Kâğıdını kaybeden öğrenci için tekrar "henüz giriş yapmamış" seçilir: yeni şifreyle
  giriş yapana kadar öyle sayılır.
- İşlem kaydına yazılır; okul başına saatte 30 dağıtım, tek seferde en fazla 600 öğrenci.

### Öğrenci portalına giriş

**Portalını aç** ile müdür, öğrencinin gördüğü ekranı birebir açar — ödevleri,
notları, ders programı. Menüdeki **Öğrenci Listesi** ile geri döner.

### Admin: müdür yönetimi

**Müdürler** sayfasında tüm müdür hesapları listelenir (okul, il, öğretmen ve
öğrenci sayısı, onay durumu). **Hesabı sil** ile müdür kaldırılır; okul
*beklemede* durumuna döner, öğretmen ve öğrenci hesapları silinmez, okula yeni
bir müdür başvurabilir.

### Admin: okul açma

Başvuru beklemeden okulu yönetici de açabilir: **Okullar → Okul aç**. Okul MEB
listesinden aranır (listede yoksa adı, ili ve ilçesi yazılır), okulun adresi
(`egitimevi.org/<uzantı>`) ve müdür yazılır:

- Müdürün e-postası sistemde kayıtlı bir yetişkin hesabıysa müdürlük o hesaba eklenir;
  kişi **Hesap değiştir**'den okuluna geçer, bildirim alır.
- Değilse yeni yetişkin hesabı açılır: ad, soyad, kullanıcı adı, telefon ve güçlü bir
  şifre (en az 8; büyük, küçük harf, rakam, özel karakter). **Rastgele üret** okunması kolay
  bir şifre önerir. Müdür ilk girişte kendi şifresini belirlemeden hiçbir role geçemez.
- Okul ve müdür onaylı açılır; işlem kaydına yazılır.

---

## Otomatik bildirimler

Sunucu beş dakikada bir kontrol eder:

| Bildirim | Kime | Ne zaman |
|---|---|---|
| Ders başlıyor | Öğretmene | Dersten 15 dakika önce |
| Ödevin son günü yarın | Öğrenciye | Son günden bir gün önce |
| Ders programa eklendi | Öğretmene | Müdür programa ders koyunca |
| Sınıfa yerleştirildin | Öğrenciye | Müdür sınıfa atayınca |

Aynı bildirim iki kez gönderilmez. Ödevi zaten sonuçlanmış öğrenciye hatırlatma
gitmez.

Öğretmen ödevi sonuçlandırınca öğrenciye **"Matematik dersinden "Oran orantı" ödevi
açıklandı: Yaptı"** gider; sonuç sonradan değişirse "... ödevi sonucu değişti: Geç yaptı".
Sınav sonucu ilk girildiğinde **"Matematik dersinden "2. Yazılı" sınavının sonucu açıklandı."**

### Öğrencinin bildirimi veliye de gider

Öğrenciye giden her bildirimin bir kopyası onaylı velilerine de gider; başında hangi
çocuk olduğu yazar: **"Zeynep Şahin · Matematik dersinden "Oran orantı" ödevi açıklandı:
Yaptı"**. Birden çok çocuklu velide her bildirim kendi çocuğunun adını taşır, karışmaz;
dokununca velinin o çocuğa ait sayfası açılır (Ödevler, Devamsızlık, İlerleyiş...; üstteki
çocuk şeridinde o çocuk seçili gelir). Telefon bildirimi de aynı metinle gider.

- Veliye zaten kendi metniyle haber veren bildirimler (devamsızlık: "Çocuğunuz ... dersine
  gelmedi", etüt yoklaması, servis yaklaşıyor, okul değiştirme) ikinci kez gitmez.
- Aynı bildirim velinin iki çocuğuna birden gidiyorsa (ör. kardeşler aynı sınıfta) veliye tek
  bildirim gider: "Zeynep Şahin, Burak Öztürk · Yeni ödev: ..."
- Aynı bildirimi kendisi de alan veliye (ör. öğrencilere ve velilere giden mesaj) kopya gitmez.
- Öğrencinin kendi kurduğu hatırlatıcılar yalnızca ona gider.

### Telefon bildirimi (Web Push)

Kişi **Ayarlar → Telefon bildirimleri → Bildirimleri aç** derse uygulamadaki her bildirim
(servis yaklaştı, yeni mesaj, ödev...) uygulama kapalıyken de telefonuna gelir. Paket
kullanılmadı; Node'un kendi `crypto` modülüyle yazıldı (`sunucu/push.js`):

- **RFC 8291** uçtan uca şifreleme (aes128gcm): içerik cihazın anahtarıyla şifrelenir,
  push servisi (Google, Apple, Mozilla, Microsoft) okuyamaz. Test RFC'nin örneğini birebir
  üretir.
- **RFC 8292 VAPID** kimliği: sunucunun anahtar çifti ilk açılışta `data/push-anahtar.json`
  dosyasına yazılır (depoya girmez; **yedeklenmeli**, kaybolursa herkes yeniden açmalı).
- Abonelik adresi yalnızca bilinen push servislerinden kabul edilir (https, 443, izinli
  alan adları): sunucu kullanıcının verdiği rastgele adrese istek atmaz.
- Kişi başına en fazla 5 cihaz, dakikada en fazla 20 bildirim; geçersizleşen abonelik
  (404/410) silinir. Çıkışta cihazın aboneliği bırakılır; aynı cihaza başka hesap girerse
  öncekinin aboneliği düşer.
- iPhone'da yalnızca **ana ekrana eklenmiş** uygulamada çalışır (iOS 16.4+).

---

## Telefona uygulama olarak kurma

Site bir **PWA** — telefona ya da bilgisayara uygulama gibi kurulabilir.
Kurulunca ayrı simgeyle açılır, tarayıcı çubuğu görünmez.

Üst çubuktaki **Uygulamayı yükle** düğmesi, tarayıcı kuruluma izin verdiğinde
kendiliğinden çıkar. Çıkmazsa düğmeye basınca elle kurulum adımları anlatılır.

Kurulu uygulamada tarayıcının yenile düğmesi yoktur. Üst çubuktaki **Yenile** açık
sayfayı sunucudan yeniden çizer (sen içerideyken girilen yeni ödev, mesaj ya da not
görünsün); seçili filtreler ve kaydırma yeri korunur. Sayfada yazılmış ama kaydedilmemiş
bir şey varsa silmeden önce sorar, dosya yüklenirken beklemeni söyler.

> **Önemli:** Otomatik kurulum önerisi ve çevrimdışı çalışma **HTTPS** gerektirir.
> `http://192.168.x.x` ile telefondan girildiğinde tarayıcı kurulum önermez —
> ama yine de menüden **Ana ekrana ekle** diyebilirsin. Tam PWA deneyimi için
> siteyi HTTPS arkasına almak gerekir (ör. Cloudflare Tunnel).

Simgeleri yeniden üretmek için: `node araclar/simge-uret.js`

---

## Roller ve yetkiler

Müdürün bütün yetkileri vardır ve bu değiştirilemez — okulda her şeyi
yapabilen en az bir kişi kalmalı.

Her okulun hazır bir **Öğretmen** rolü vardır: okuldaki her öğretmen bu
rolün yetkilerine kendiliğinden sahiptir. Müdür bu yetkileri öteki roller
gibi açıp kapatır (ör. öğretmenler sınav oluşturmasın). Bu rol silinmez ve
ayrıca verilmez; kapatılan yetkinin bölümü öğretmen menüsünden de kalkar.

Bunun dışında müdür **ek roller tanımlar**: adını kendi koyar ("Müdür
Yardımcısı", "Etüt Sorumlusu", "Zümre Başkanı"), yetkilerini tek tek seçer,
sonra bir öğretmene verir; o öğretmenin yetkileri iki rolün birleşimidir.
Yeni rol **hazır şablondan** başlatılabilir: Müdür Yardımcısı, Rehber
Öğretmen, Etüt Sorumlusu, Nöbetçi Öğretmen, Servis Sorumlusu, Kulüp
Danışmanı, Zümre Başkanı. Şablon yalnızca kutuları işaretler; sonra
istediğin gibi değiştirirsin.

**Roller ve Yetkiler** sayfasından yönetilir. Rol vermek (öğretmen düzenleme
penceresinden de olsa) "rol yönetir" yetkisi ister; kimse kendine rol veremez,
kendi taşıdığı rolü ya da hazır Öğretmen rolünü de (kendine uygulandığı için)
yalnızca müdür değiştirir. Hazır Öğretmen rolünde açık olan bir yetkiyi ek rolün
ders/sınıf daraltması kısıtlamaz (birleşim). **Öğrenci portalına girer** yetkisi
(ör. rehber öğretmen) okulun öğrenci listesini dar hâliyle (ad, sınıf, okul no)
ve her öğrencinin portalını açar.

### Yetki listesi

| Grup | Yetkiler |
|---|---|
| **Ders ve program** | Derse öğretmen olarak atanabilir · Ders programını düzenler · Sınıfa ders ekler/çıkarır · Derse öğretmen atar |
| **Sınıf ve öğrenci** | Sınıf açar/siler · Öğrenciyi sınıfa yerleştirir · Öğrenci hesabı açar · Öğrenci bilgilerini düzenler · Öğrenci şifresi sıfırlar · Öğrenci portalına girer |
| **Öğretmenler** | Başvuru onaylar · Bilgi ve branş düzenler · Okuldan çıkarır |
| **Ödev ve sınav** | Ödev verir · Ödev sonuçlandırır · Sınav oluşturur · Sınav notu girer · Girdiği sınıfların öğrenci sonuçlarını görür |
| **Devamsızlık** | Yoklama alır · Okulun tüm devamsızlığını görür |
| **Etüt** | Etüt açar ve düzenler · Bütün etütlerde yoklama alır |
| **Mesajlaşma** | Sınıfa/gruba toplu mesaj ve anket · Herkese mesaj |
| **Okul hayatı** | Yemek listesini düzenler · Servisleri düzenler · Kulüp açar ve düzenler |
| **Yönetim** | Rol oluşturur · İşlem kaydını görür · Takvim · Eğitim yılı · Excel/CSV aktarım · Okul sayfası |

### Ders ve sınıf daraltması

Bir yetkiyi açtığında, yanında **Dersler** ve **Sınıflar** kutuları çıkar.
Varsayılan "Tümü"dür; işareti kaldırıp tek tek seçebilirsin.

Örnek — matematik zümre başkanı:

| Yetki | Dersler | Sınıflar |
|---|---|---|
| Derse öğretmen olarak atanabilir | Matematik | Tümü |
| Ödev verir | Matematik | Tümü |
| Sınav notu girer | Matematik | Tümü |
| Ders programını düzenler | — | 7-A, 7-B |

Bu kişi Matematik dersine atanabilir ama Türkçe'ye atanamaz; 7-A ve 7-B'nin
programını düzenler ama 8-A'yı **göremez bile**.

Daraltılabilen yetkiler: derse atanabilir, ders programı, sınıfa ders ekleme,
derse öğretmen atama, öğrenci yerleştirme, ödev verme ve sonuçlandırma,
sınav oluşturma ve not girme, yoklama alma.

Kapsam dışı bir işlem denenirse sunucu 403 döner — arayüzde gizlemek yetmez,
kontrol sunucuda.

### Öğretmen rolünün ilk yetkileri

Derse atanabilir · Ödev verir · Ödev sonuçlandırır · Sınav oluşturur · Sınav notu girer · Yoklama alır ·
Girdiği sınıfların öğrenci sonuçlarını görür

Okulun Öğretmen rolü ilk açıldığında bu yetkilerle kurulur; müdür sonra
değiştirebilir. Ek rol penceresinde Öğretmen rolünde zaten açık olan yetkiler
**Öğretmen rolünde var** etiketiyle kilitli görünür.

### Etütler

Etüt, okulun belli bir gününde belli saatler arasında yapılan ders dışı
çalışmadır (ör. "8. sınıf Matematik etüdü, Salı 15:40–16:20, Kütüphane").

- **Etüt açar ve düzenler** yetkisi olan (müdür ya da rolüyle verilen kişi)
  etüdü açar, gününü/saatini/yerini/öğretmenini değiştirir, öğrencilerini
  sınıf sınıf ya da tek tek seçer.
- Etüdün **öğretmeni** yoklamayı yalnızca etüt günü, başlangıçtan 15 dakika
  önceden itibaren alır: **Geldi · İzinli · İzinsiz**.
- **Bütün etütlerde yoklama alır** yetkisi olan (ör. nöbetçi öğretmen) her
  etütte, geçmiş günler dahil yoklama alır ve düzeltir.
- Gelmeyen öğrenciye ve velisine bildirim gider. Öğrenci **Etütlerim**,
  veli **Etütler** sayfasında etütleri ve gelmediği günleri görür.

### Sonradan düzeltme

- **Ödev**: sonuçlanmış ödevin sonuçları ("Sonuçları düzenle") ve ödevin
  kendisi (ad, açıklama, tarihler: "Ödevi düzenle") sonradan değiştirilebilir.
  Ad ya da son teslim değişirse öğrencilere haber gider.
- **Mesaj**: gönderilmiş mesajın konusunu ve metnini yalnızca gönderen
  düzeltir ("Düzelt"). Alıcıya yeniden bildirim gitmez; mesajda
  "düzenlendi" ve saati görünür.

> Yetki kontrolü sunucuda yapılır. Rol silinince ya da yetki daraltılınca
> kişi anında o işlemi yapamaz hâle gelir.

---

## Hatırlatıcılar

Herkes (öğrenci, veli, öğretmen, müdür, servisçi, rolsüz yetişkin) menüdeki
**Hatırlatıcılar** sayfasından kendine hatırlatma kurar: **başlık**, isteğe bağlı
**açıklama**, **sıklık** ve **saat**.

| Sıklık | Örnek |
|---|---|
| Bir kez | 30 Eylül 15:00 "Kütüphane kitabını iade et" |
| Her gün | her gün 21:00 "Kitap oku" |
| Her hafta | yalnızca pazartesi ve çarşamba 07:30 "Beden eğitimi kıyafeti" |
| Her ay | her ayın 1'i 10:00 "Servis ücreti" (31 seçilirse kısa ayda ayın son günü) |

- Zamanı gelince bildirim gider (telefon bildirimi açıksa telefona da). Saatler
  Türkiye saatidir; sunucu başka saat diliminde olsa da doğru çalışır.
- Listede her hatırlatıcının **sonraki** zamanı yazar; durdurulabilir, düzenlenebilir,
  silinebilir. Bir kezlik hatırlatıcı gönderilince kapanır.
- Yalnızca sahibi görür. Kişi başına en fazla 50. Sunucu bir süre kapalı kaldıysa
  6 saate kadar geciken hatırlatma yine gider, daha eskisi gitmez.
- Tablolar: `hatirlaticilar`, `hatirlatici_gunleri` (şema 024); zaman hesabı
  `sunucu/yardimci/hatirlatici-zaman.js`, dakikada bir çalışır.

---

## Okulun özellikleri (bölüm aç / kapat)

Müdür menüdeki **Özellikler** sayfasından okulunda kullanmadığı bölümleri kapatır:
**Ödevler, Sınavlar, Devamsızlık, Etütler, Servis, Yemek listesi, Kulüpler, Anketler.**

- Kapalı bölüm o okuldaki herkesin (öğretmen, öğrenci, veli, servisçi, müdürün
  kendisi) menüsünden ve ana sayfa kutucuklarından kalkar; adres çubuğuna
  yazılırsa "Bu bölüm okulunda kapalı" der.
- Sunucu da reddeder: kapalı bölümün her ucu 403 döner (`ozellikKapali`). Veli,
  çocuğunun okulunun kuralına tabidir. İlerleyiş ve takvim kapalı bölümü atlar;
  ödevler kapalıysa ödev hatırlatması da gitmez.
- **Kayıtlar silinmez.** Yeniden açılınca ödevler, notlar, yoklamalar eskisi gibi görünür.
- Değişiklik işlem kaydına yazılır. Tablo: `okul_kapali_ozellikler` (şema 022);
  sunucu listeyi açılışta belleğe okur, her istekte veritabanına gitmez.

---

## Eğitim yılı

Müdür (ya da "Eğitim yılı açar" yetkisi olan) **Eğitim Yılı** sayfasından yeni yıl
açar; yeni yıl aktif olur. Ödev, sınav, yoklama, ders programı ve takvim etkinliği
açıldıkları yıla damgalanır; sınıflar, öğrenciler ve sınav şablonları ortaktır.
Yıl tanımlanmadan önceki kayıtlar okulun ilk yılına sayılır.

Sayfanın üstündeki **yıl seçici** ile geçmiş yıla bakılır. Geçmiş yıla bakarken
kayıtlar **salt okunur**dur: yeni ödev, sınav, yoklama, program ya da etkinlik
eklenemez, var olan da değiştirilemez; sunucu "aktif yıla dön" der.

Nakil gelen öğrencide (ve velisinde) seçicinin altında **Önceki okullar** grubu
çıkar: eski okulun dönemleri "yıl · okul · sınıf" diye listelenir.

---

## Ödev sistemi

- Öğretmen **Ödevler → Yeni ödev ver**: ders, ad, açıklama, tarih aralığı.
- **Kimlere gideceğini sen seçersin.** Sınıflar listelenir, altlarında öğrenciler
  onay kutusuyla durur. Sınıf kutusunu işaretleyince o sınıfın hepsi seçilir;
  bir öğrenciyi çıkarınca sınıf kutusu yarım işaretli olur.
  **Tümünü seç** ve **Tümünü kaldır** düğmeleri var, üstte kaç kişi seçili yazar.
- Birden fazla sınıfa aynı anda ödev verilebilir.
- Aynı anda **birden fazla aktif ödev** olabilir.
- Ödev bitince **Sonuçlandır** → ödev kontrol ekranı: üstte ödevin adı, altında konusu,
  altında ödevin verildiği öğrenciler alt alta. Her öğrencinin yanındaki kutudan sonuç
  seçilir: **Yaptı · Geç yaptı · Eksik · Yapmadı · Gelmedi (izinli) · Gelmedi (izinsiz)**.
  "Seçilmemişlerin hepsi: Yaptı" düğmesi kalabalık sınıfta işi kısaltır; altta canlı sayım durur.
- Her öğrencinin altında **"Ödev 20.05.2026 16:20 tarihinde açıldı"** ya da
  **"Ödev açılmadı"** yazar. Açılma zamanı, öğrenci ödevin ayrıntısını ilk açtığında
  kaydedilir ve sonradan değişmez.
- Öğrencinin listesinde henüz açmadığı ödev **turuncu** görünür; açınca normale döner.
  Veli panelinde de çocuğun açmadığı ödev turuncudur.
- Sonuçlananlar **Geçmiş Ödevler**'e düşer, silinmez.
- Öğrenci ve velisi sonucu anında görür.

### Ödev serisi

Öğrencinin ana sayfasında ve **Ödevler** sayfasının üstünde ödev serisi durur
(yalnızca öğrencinin kendisi görür; veli ve öğretmen görmez). Sonuçlanmış ödevler
son teslim sırasıyla sayılır:

- **Yaptı** seriyi bir artırır.
- **Yaptı** dışında bir sonuç (geç yaptı, eksik, yapmadı, gelmedi) seriyi bozmaz ama
  **uyarı** verir: "Bir sonraki ödevi de yapmazsan serin bozulur."
- Arka arkaya **iki kez** Yaptı alınmazsa seri **bozulur** ve sıfırlanır.
- Değerlendirilmemiş ödev seriyi etkilemez. En uzun seri de yazar.

### Ödev teslim dosyaları

Öğrenci ödevin penceresinden **Dosya yükle** ile dosya teslim eder (ilerleme
çubuğu, iptal). Öğretmenin kontrol ekranında her öğrencinin altında "2 dosya teslim
etti" yazar; **Teslimleri indir** hepsini öğrenci klasörlerine ayrılmış tek zip
olarak indirir. Veli, ödevler listesinde satıra tıklayınca çocuğunun dosyalarını görür.

| Kural | Değer |
|---|---|
| Öğrenci başına, bir ödevde | en fazla 10 dosya, toplam 150 MB |
| Saklama | yüklendikten 7 gün sonra silinir (satırda "N gün sonra silinir" yazar) |
| Okul başına | 20 GB (`EE_OKUL_DOSYA_GB` ile değişir) |
| Türler | belge, tablo, sunum, resim, ses, video, zip, Scratch/GeoGebra, kod dosyaları (`.exe` gibi çalıştırılabilirler yok) |
| Ne zaman | ödev başladıktan teslim saatine kadar; ödev sonuçlandırılınca kapanır |

- Dosyalar `data/dosyalar/` altında, `public/` dışında, 32 haneli rastgele adla durur;
  her indirmede yetki yeniden denetlenir (öğrencinin kendisi, velisi, ödevi veren
  öğretmen, müdür). İndirme her zaman "ek" olarak gider (tarayıcıda açılmaz, çalışmaz).
- Yükleme diske akarak yazılır (bellek şişmez); boyut, CRC32 ve SHA-256 akarken
  hesaplanır. Sayı ve toplam sınırı veritabanında kilitli satırla denetlenir: aynı
  anda iki yükleme sınırı aşamaz. Diskte 2 GB'tan az yer kalacaksa yükleme reddedilir.
- Öğretmen uygunsuz bir dosyayı silebilir; ödev silinince dosyaları da silinir.
  Süresi dolan, yarıda kalan ve kaydı silinen dosyalar saatte bir temizlenir.

**Öğretmenin kontrol ekranında ekler.** Her öğrencinin altında **"3 ek"** gibi teslim
sayısı yazar. Tıklayınca ekler simge, ad ve MB boyutuyla listelenir; hiçbiri kendiliğinden
yüklenmez (boşuna internet harcanmaz). **Fotoğraf** (jpg, png, gif, webp), **video** (mp4,
webm, mov) ve **ses** (mp3, m4a, wav, ogg) tıklayınca pencerede açılır ya da oynar; video
ileri sarılabilir. Öbür dosyalar "indirilsin mi?" diye sorup iner. Tarayıcıda açılan
dosya da güvenlidir: tür uzantıdan belirlenir, içerik sezdirilmez (nosniff), betik
çalışamaz (sandbox); SVG ve HTML hiçbir zaman açılmaz, yalnızca iner. Açma bağlantısı
5 dakika geçerlidir ve yine yalnızca yetkili kişide çalışır.

### Ekler (mesaj ve ödev)

Mesaj yazarken ve öğretmen ödev verirken **Ekler** kutusuna dosya sürüklenir ya da
basıp cihazdan seçilir; birden çok dosya olur. Öğrenci ödevi açınca altta **Ekler**
listesini görür; mesaj alıcısı mesajın altında görür.

| Kural | Değer |
|---|---|
| Bir mesajda ya da ödevde | toplam en fazla 150 MB |
| Saklama | 7 gün, sonra dosya silinir (ek satırı "süresi doldu" der) |
| Kim indirir | mesajın göndereni ve alıcıları; ödevin öğretmeni, öğrencileri, velileri ve müdür |

Yüklenen dosya önce "taslak"tır; mesaj gönderilince ya da ödev kaydedilince bağlanır.
Bağlanmayan taslaklar da 7 günde silinir. Başkasının taslağı bağlanamaz.

### Müdürün ödev görünümü

Müdür ödev vermez — **Ödevler** sayfasında derse göre bakar. Her ders bloğunda
sınıf, ders adı, dersin öğretmeni ve haftalık saati yazar; altında o derse
verilmiş ödevler sıralanır: **kim verdi**, kaç öğrenciye, son teslim ne zaman,
açıklaması ne.

Üstteki sınıf seçiciyle tek sınıfa daraltılır.

### Filtreleme ve arama

Ödevler sayfasının üstündeki çubuktan liste daraltılabilir:

| Filtre | Seçenekler |
|---|---|
| **Ders** | Listedeki derslerden biri (tek ders varsa gizlenir) |
| **Durum — öğrenci** | Aktif · Geçmiş · Açılmamış · Yaptı · Geç yaptı · Yapmadı · Eksik · Gelmedi (izinli) · Gelmedi (izinsiz) · Değerlendirilmedi |
| **Durum — öğretmen** | Aktif · Sonuçlananlar · Süresi dolmuş ama sonuçlanmamış |
| **Tarih aralığı** | Son teslim tarihine göre başlangıç ve bitiş |

**Yıldız.** Öğrenci önemli bulduğu ödevi satırın solundaki yıldızla işaretler, **Yıldız**
filtresiyle yalnızca yıldızlıları ya da yıldızsızları görür. Yıldız yalnızca öğrencinin
kendisi içindir: öğretmen, müdür ve veli görmez (017 şema dosyası).

Üstteki **İçerik Ara** kutusu ödev adı, ders, öğretmen adı ve açıklamada arar.
Türkçe karakterler esnek eşleşir — `gunes` yazınca `Güneş sistemi maketi`,
`ayse` yazınca `Ayşe Kaya`'nın ödevleri gelir. Filtreler birlikte çalışır;
**Temizle** hepsini sıfırlar.

---

## Yoklama (ders programından)

Öğretmen **Ders programım** sayfasında o gün başlamış dersinin altındaki
**Yoklama** düğmesine dokunur (şu an süren dersin düğmesi **Şu an — yoklama al** diye öne çıkar).
Pencerede o dersin öğrencileri alt alta durur; her birinin yanında üç seçenek:
**Geldi · Gelmedi — izinli · Gelmedi — izinsiz**. **Hepsi geldi** düğmesi kalabalık
sınıfta işi kısaltır; altta **Kaydet**. Pencere telefonda tam ekran açılır, düğmeler
parmakla basılacak büyüklüktedir.

Gelmedi işaretlenen öğrencinin velisine bildirim gider:
"Çocuğunuz Zeynep Şahin bugün saat 09:20 Matematik dersine gelmedi (izinsiz)."
Sonradan izinliye çevrilirse veliye yeni durum yazılır. Yoklamayı yalnızca o
sınıfa dersi olan öğretmen (ya da **Yoklama alır** yetkisi daraltılmamış biri) alır.

## Sınıflarım (öğretmen)

**Girdiği sınıfların öğrenci sonuçlarını görür** yetkisi olan öğretmenin menüsünde
**Sınıflarım** çıkar (hazır Öğretmen rolünde açık gelir; müdür **Roller**'den kapatabilir
ya da ek rolle başka birine verebilir).

- Üstte öğretmenin ders verdiği sınıflar kart olarak durur (dersleri ve öğrenci sayısıyla).
- Sınıfa dokununca öğrencileri okul numarası sırasıyla listelenir.
- Öğrenciye dokununca pencere açılır: **o öğretmenin verdiği ödevler** ve yanında
  sonucu (Yaptı, Geç yaptı...; süren ödevde kalan süre ve "açtı/açmadı"), üstte sonuçların
  sayımı; altında öğrencinin **sınav sonuçları** (grup ortalaması 100 üzerinden, tek
  sınavların değerleri).
- Öğretmen ders vermediği sınıfı ya da o sınıftaki öğrenciyi açamaz (sunucu 403 döner).

## Sınav sistemi

Öğretmenin **Sınavlar** sayfasında üç sekme var: **Sınavlarım**, **Gruplar**, **Şablonlar**.

**Şablon** bir sınavın değer alanlarıdır; bir kez tanımlanır, her sınavda yeniden
yazılmaz. Hazır üç şablon gelir, "Okula ekle" ile okulun olur ve düzenlenebilir:

| Şablon | Değer alanları |
|---|---|
| Yazılı (0-100) | Puan 0–100 |
| Test (Doğru / Yanlış / Net) | Doğru, Yanlış, Net |
| LGS Denemesi | Türkçe, Matematik, Fen, İnkılap, Din, İngilizce netleri; LGS Puanı 100–500 |

- Her alanın kendi aralığı var, sınır **-10000 ile 10000**. Değerler **ondalıklı** ve
  **virgülle** yazılabilir: `490,161`.
- Bir alan **ana değer**dir: ortalamaya ve grafiğe o girer.
- Açık bir sınavda **+ Yeni değer ekle** ile sınava sonradan alan eklenir, adı ve
  aralığı değiştirilir. Girilmiş bir değeri dışarıda bırakacak daraltma reddedilir.
- Şablon sonradan değişse de eski sınavlar bozulmaz: sınav, alanların kopyasını taşır.

**Değer girişi:** öğrenciler satır, alanlar sütun. Enter ile alttaki öğrenciye geçilir.
Aralık dışı ya da sayı olmayan değer kırmızı olur ve kaydedilmez. Yalnızca değişen kutular
sunucuya gider. Birden çok sınıfa giren öğretmen üstten sınıf seçip daraltır.

**Grup isteğe bağlı.** Dönem ortalaması gibi etki oranlı bir hesap istenirse sınav bir
gruba eklenir. Ağırlıklı ortalama **100 üzerinden** hesaplanır; böylece 0–100'lük yazılı ile
0–500'lük deneme aynı grupta birleşebilir:

```
1. Yazılı  → 80 / 100        etki %50   → 80
Deneme     → 400 / 500       etki %50   → 80
Grup ortalaması = (80×50 + 80×50) / 100 = 80
```

---

## İlerleyişim

- **Ödevler grafiği**, iki görünüm:
  - *Sonuçlara göre:* Yaptı · Geç yaptı · Eksik · Yapmadı · İzinli · Gelmedi · Belirsiz
    sütunları. Eksen sayıya göre yuvarlanır (en büyük değer 174 ise 0–200, 50'şer).
  - *Derslere göre:* her dersin sütunu sonuç renklerine bölünür, üstünde başarı oranı.
  - **Grafiği gizle** düğmesi var; tercih tarayıcıda hatırlanır.
- **Sınav grafiği:** şablon seçilir (ör. LGS Denemesi), o şablonla yapılmış sınavlar tarih
  sırasıyla çizgi grafikte. Alttan hangi değerin çizileceği seçilir (LGS Puanı, Türkçe Net...).
  **En düşük / en yüksek bandı** sınavı girenlerin aralığını ve ortalamasını gölge olarak
  gösterir. **Liste** görünümü aynı veriyi tablo olarak verir.
- **Sınavlar:** grupsuz sınavlar, ana değer ve öteki değerlerle.
- **Sınav grubu ortalamaları:** 100 üzerinden, çubuk hâlinde.

Başarı oranında yaptı tam, geç ve eksik yarım sayılır; izinli gelmemek oranı düşürmez.

---

## Veli tarafı

1. Öğrenci **Ayarlar** sayfasında **veli kodunu** görür (örn. `7H39D-AAJQ7`).
   Kod 10 karakterdir, yalnızca büyük harf ve rakam; karışabilen 0/O, 1/I yoktur.
   Yanındaki **Kopyala** ile panoya alınır.
2. Veli bu kodu başlangıç sayfasına ya da **Çocuklarım → Çocuk ekle** kısmına girer.
   Büyük/küçük harf, boşluk ve tire fark etmez.
3. Çocuğun kartına tıklayınca doğrudan onun portalı açılır:
   ilerleyiş, ödevler, sınavlar, başarılar.

Kod olmadan kimse başkasının çocuğunu göremez. Veli kodu dışında okul da veliyi
bağlayabilir: öğrencinin **Hesap** penceresinde **Veliler** bölümünden velinin T.C.
kimlik no'su ya da kullanıcı adıyla bulup bağlar, gerekirse kaldırır.

## Eğitim Evi Aile (çocuğun telefonu)

İsteğe bağlı Android uygulaması; ayrı depoda:
[KARANKOYU/Egitim-Evi-App](https://github.com/KARANKOYU/Egitim-Evi-App). Çocuğun
telefonuna kurulur, **velinin seçtiği aralıkla** telefonun konumunu ve **uygulama
uygulama ekran süresini** gönderir. Veli bunları sitede **Çocuğumun telefonu** sayfasında
görür. Uygulama hiçbir uygulamayı kapatmaz ya da kilitlemez; **sınır geçilince veliye
bildirim** gider (günde bir kez).

- **Bağlama:** uygulamada çocuğun **öğrenci hesabıyla** giriş yapılır; çocuk paylaşımı
  kendisi onaylar. Sunucu telefona yalnızca konum ve süre göndermeye yarayan bir
  **cihaz anahtarı** verir (hesaba giriş vermez; veritabanında özeti tutulur); öğrencinin
  oturumu telefonda kalmaz. Öğrenci başına en fazla 3 telefon. Velilere "telefonunu bağladı"
  bildirimi gider.
- **İzinler (uygulama sırayla ister):** Konum — **Her zaman izin ver** (uygulama kapalıyken
  de), **Kullanım erişimi** (ekran süresi), **Bildirimler**, **arka planda çalışma** (pil
  kısıtlaması yok). Android, arka planda konum alan uygulamanın bildirim çubuğunda
  görünmesini şart koşar: "Konumun ve ekran süren velinle paylaşılıyor".
- **Sıklık:** veli Wi-Fi'de ve mobil veride ayrı seçer: 1, 5, 10, 15, 30 ya da 60 dakikada
  bir (varsayılan Wi-Fi 5, mobil 15). İnternet yokken konumlar telefonda birikir (en fazla
  5000), **bağlandığı ilk anda** 500'erli gönderilir. Telefon yeni ayarı en geç yarım saatte alır.
- **Veli sayfası:** son konum haritada (son görülme, Wi-Fi/mobil, doğruluk, pil) ve önceki
  birkaç nokta, Google Haritalar bağlantısı, çocuğun servisi; bugünün ekran süresi uygulama
  uygulama, son 8 günün günlük toplamı; ayarlar: konum ve süre paylaşımı açık/kapalı, **günlük
  toplam (ortak) sınır** ve **uygulama başına sınır**. Birden çok çocukta üstteki şeritten çocuk
  seçilir; bildirimde hangi çocuk olduğu yazar.
- **Kim görür:** yalnızca öğrenciye bağlı onaylı veliler. **Okul (müdür, öğretmen) görmez**;
  öğrenci de siteden kendi özetine bakamaz (telefonunda uygulama durumunu görür).
- **Saklama:** konum ve kullanım **7 gün** sonra silinir (salı günü bakan önceki salıdan
  eskisini göremez); yedeğe ve dışarı aktarıma girmez.
- **Bağlantıyı kaldırma:** öğrenci uygulamadan, veli sayfadan; anahtar hemen geçersiz olur,
  uygulama göndermeyi bırakır.
- iPhone'da çalışmaz: Apple öteki uygulamaların kullanım süresini okumaya yalnızca kendi
  izniyle (Screen Time API) olanak veriyor.

Uçlar: `POST /api/aile/cihaz` (öğrenci bağlar), `GET /api/aile/cihaz/ayar`,
`POST /api/aile/cihaz/konum`, `POST /api/aile/cihaz/kullanim`, `POST /api/aile/cihaz/sil`
(cihaz anahtarıyla, `X-Aile-Cihaz` başlığı), `GET /api/aile/ozet`, `POST /api/aile/ayar`,
`POST /api/aile/cihaz-kaldir` (veli). Tablolar şema 026'da; testi `testler/test-aile.js`.

---

## Anketler ve duyuru okundu bilgisi

**Duyuru okundu bilgisi:** Gönderilenler listesinde her duyurunun yanında
"34 / 120 okudu" yazar. Duyuruyu açınca kimin okuduğu **tam liste** hâlinde, okuma
zamanıyla görünür; rollere göre sayılar (Öğrenciler 20/30, Veliler 10/40), "Okuyanlar /
Okumayanlar" süzgeci ve isim araması vardır. Velinin hangi çocuğu için aldığı yazar.
Bunu duyuruyu gönderen ve okulun müdürü görür; alıcılar görmez.

**Anketler:** Toplu mesaj yetkisi olan kişi **Anketler → Yeni anket** ile okula, rol
grubuna ya da sınıflara tek soruluk anket açar (2-10 seçenek, bitiş günü ve saati,
en fazla 90 gün). Öğrenciye açılan anket velisine de gider.

- Hedefteki kişi bitişe kadar **bir** oy verir; fikrini değiştirebilir ya da geri alabilir.
- Kimin oy verebileceği anket açılırken listeye yazılır. Oy yalnızca açık ankette, bu
  listedeki kişi için ve anketin kendi seçeneğine kaydolur — bu veritabanında yabancı
  anahtarla da bağlıdır.
- Anketi açan ve müdür sonuçları ve katılımı (kim oy verdi, kim vermedi) her an görür;
  oy verenler sonucu anket bitince görür.
- **Gizli anket:** kimin neyi seçtiği hiç kimseye (açan dahil) gönderilmez, yalnızca sayılar.
- Anket erken bitirilebilir ya da silinebilir.

---

## Yemek listesi, servis, kulüpler

**Yemek listesi:** Haftalık görünüm (bugün vurgulu, hafta hafta gezilir). Müdür ya da
yemek yetkisi verilen kişi **Bu haftayı düzenle** ile her güne satır satır yemek ve
isteğe bağlı kalori yazar; boş bırakılan günün menüsü silinir. Okuldaki herkes görür;
veli çocuğunun okulununkini görür.

**Servis:** Müdür (ya da servis yetkisi olan) servis ekler: ad, plaka, servisçi hesabı,
şoför ve rehber personel (adı, telefonu), sabah/akşam saati, güzergâh; öğrencileri
durağıyla servise yazar. Bir öğrenci tek serviste olur (başkasına yazılınca taşınır).
Öğrenci **Servisim** sayfasında kendi servisini, veli çocuğununkini görür; şoför telefonu
yalnızca o servisteki öğrenciye, velisine ve yönetime gider.

**Servis haritası ve canlı konum:**

- **Servisçi** telefonundan okulun adresine girer; **Seferlerim** sayfasında "Okula gidiş"
  ya da "Eve dönüş" seferini başlatır. Telefonun konumu birkaç saniyede bir (araç
  dururken 20 saniyede bir) gönderilir; ekran kararmasın diye ekran kilidi tutulur.
  **Seferi bitir** deyince konum kesilir. Servis başka servisçiye verilirse ya da
  servisçi hesabı silinirse açık sefer kapanır. 45 dakika konum gelmeyen sefer kendiliğinden
  kapanır; seferler 30 gün sonra silinir.
- **Öğrenci ve velisi** haritada okulu, evi ve (sefer sürerken) aracı görür; 5 saniyede bir
  yenilenir, "eve yaklaşık 1,2 km" yazar. Aracın yeri yalnızca açık seferde ve son 3
  dakikada geldiyse gösterilir. Geçmiş iz saklanmaz, yalnızca son konum.
- **Ev konumu:** öğrenci, velisi ya da okul yönetimi haritaya dokunarak (ya da "Bulunduğum
  yeri kullan") işaretler. Servisçi evin yerini görür (yol tarifi bağlantısı) ama değiştiremez.
- **Yaklaşma bildirimi:** servis eve **500 m** ve **100 m** kala öğrenciye ve velilerine
  birer kez bildirim gider (her sefer için). GPS doğruluğu 150 m'den kötüyse gitmez.
- Harita dış kütüphane kullanmaz: OpenStreetMap döşemeleri kendi küçük bileşenimizle
  çizilir (sürükleme, iki parmakla ve tekerlekle yakınlaştırma, klavye). Her konumun
  yanında **Google Haritalar'da aç** bağlantısı vardır.
- Konum yalnızca **HTTPS**'te (ya da localhost'ta) alınabilir ve tarayıcı arka planda
  konum vermez: servisçi uygulamayı açık tutmalıdır.

**Kulüpler:** Müdür (ya da kulüp yetkisi olan) kulüp açar: danışman öğretmen,
kontenjan, gün ve saat, başvurunun açık olup olmadığı. Öğrenci başvurusu açık kulübe
kendisi katılır ya da ayrılır; başvuru kapalıyken yalnızca danışman ve yönetim üye
ekleyip çıkarır. Kontenjan, kulüp satırı kilitlenerek denetlenir: aynı anda gelen iki
istek son boş yeri ikisine birden vermez. Üye listesini yalnızca danışman ve yönetim
görür; veli çocuğunun kulüplerini görür.

---

## Müdür yetkileri

Müdür, öğretmenin yapabildiği **her şeyi** yapabilir (ödev verme, sınav açma, not girme)
ve ek olarak:

- Öğretmen başvurularını onaylar/reddeder
- Okuldaki tüm öğrencileri görür
- Sınıf açar, öğrencileri sınıflara yerleştirir, derslere öğretmen atar

Öğretmen-öğrenci ilişkisi yalnızca **sınıf ve ders** üzerinden kurulur: bir öğretmen,
dersine girdiği sınıfların öğrencilerinin öğretmenidir. Öğrenciyi tek tek öğretmene
bağlayan bir düzen yoktur.

Öğretmen sadece kendi branşında ders açabilir; müdür istediği dersi seçebilir.

**Branşlar:** Matematik, Türkçe, İngilizce, Din Kültürü ve Ahlak Bilgisi,
Sosyal Bilgiler, Fen Bilimleri, Müzik, Resim, Beden Eğitimi.
Aynı branşta birden fazla öğretmen olabilir (2 fen öğretmeni gibi).

---

## Veriler

Veriler **PostgreSQL** veritabanında tutulur. Şema okunur SQL dosyalarıyla sürümlenir
(`sunucu/veri/sema/001-ilk.sql` ...); sunucu açılışta uygulanmamış olanları sırayla
uygular ve hangisinin uygulandığını `sema_surumleri` tablosuna yazar.

- 41 tablo: okullar, eğitim yılları, sınıflar, roller ve yetkileri, kullanıcılar,
  okul davetleri, veli bağları, dersler, ders programı, ödevler, öğrencileri ve teslim
  dosyaları, sınav şablonları, sınavlar, ölçümler ve değerler, devamsızlık, mesajlar,
  alıcıları ve okunmaları, anketler (seçenek, hedef, oy), yemek listesi, servisler ve
  öğrencileri, kulüpler ve üyeleri, takvim, bildirimler, oturumlar, işlem kaydı.
- Yabancı anahtarlar uygulamanın silme kuralını taşır: sınıf silinince dersleri ve
  programı gider (CASCADE), öğrenciler sınıfsız kalır (SET NULL).
- CHECK kısıtları geçersiz veriyi veritabanı katında da durdurur (telefon biçimi, puan
  aralığı, ödev sonucu türü...).
- Sorgular yalnızca `$1, $2` parametreleriyle yazılır; kullanıcıdan gelen değer SQL
  metnine karışmaz. `testler/sql-denetimi.js` bunu her çalıştırmada denetler.
- Toplu işler (Excel ile 300 hesap açma, yoklama, mesaj alıcıları) tek işlemde
  (transaction): yarıda hata olursa hiçbiri yazılmaz.
- Oturum anahtarının kendisi değil SHA-256 özeti saklanır: veritabanı sızsa bile
  açık oturumlar kullanılamaz.
- Uygulama `postgres` süper kullanıcısıyla değil, yalnızca kendi veritabanına yetkili
  `egitimevi` kullanıcısıyla bağlanır.
- **Eski `data/db.json`** varsa ilk açılışta tek işlemde veritabanına aktarılır ve
  `db.json.tasindi` adıyla saklanır.
- **Yedek:** Yönetici → Yedekler (günlük otomatik, 14 tane saklanır; en yeniler
  kalır). Adlar: `yedek-2026-09-26_0300.json` (otomatik), `yedek-elle-…` (elle alınan),
  `yedek-geri-alma-…` (geri yüklemeden hemen önceki hâl). Yedek elle okunabilir
  JSON'dur. Sunucuda bunun yanında
  günlük `pg_dump` alınır (belge/SUNUCUYA-KURULUM.md).
- **Ödev dosyaları** JSON yedeğe girmez (yalnızca bilgileri girer): dosyaların kendisi
  `data/dosyalar/` klasöründedir, sunucu yedeğinde bu klasör de alınmalı.

Şifreler `scrypt` ile şifrelenmiş olarak saklanır — düz metin şifre hiçbir yerde tutulmaz
ve sunucudan dışarı çıkmaz.

**Sunucudaki korumalar:**

| Koruma | Ne yapar |
|---|---|
| Kaba kuvvet kilidi | 5 hatalı giriş sonrası o hesap+cihaz 15 dakika kilitlenir (e-posta ile kullanıcı adını sırayla denemek kilidi aşmaz); aynı bağlantıdan 15 dakikada en fazla 50 hatalı giriş, 25 yanlış giriş kodu |
| Genel hız sınırı | Oturum başına dakikada 300 API isteği; aynı okul ağından (tek IP) gelen bir sınıf engellenmesin diye IP başına 1500 |
| Bot doğrulaması | Kayıt formunda toplama sorusu; cevap sunucuda tutulur, tarayıcıya gönderilmez; yalnızca hesap açılınca harcanır |
| Şifre değişimi | Şifre değişince o oturum dışındaki bütün oturumlar kapanır |
| T.C. kimlik no | İsteğe bağlı, algoritmayla denetlenir; yalnızca kişinin kendisine gösterilir |
| Veli kodu sınırı | Hesap başına dakikada 5, bağlantı başına saatte 30 yanlış kod — çok hesap açıp denemek de sayılır |
| Oturum ömrü | Oturumlar 7 gün sonra kendiliğinden düşer, eskiler temizlenir |
| Güvenlik başlıkları | CSP, X-Frame-Options, nosniff, Referrer-Policy — XSS ve çerçeveleme engeli |
| Girdi temizliği | Gelen JSON'daki `__proto__` gibi tehlikeli anahtarlar ve NUL karakteri ayıklanır |
| Hata gizliliği | Veritabanı hatasında tablo/kısıt adı istemciye gitmez; ayrıntı yalnızca günlükte |
| Yavaş bağlantı koruması | Açık tutulan boş bağlantılar 20-30 sn sonra kapatılır (slowloris) |
| Şifre politikası | En az 8 karakter, harf ve rakam zorunlu |
| İki adımlı giriş | E-postası olan hesapta her girişte e-posta ile 6 haneli kod — kapatılamaz |
| Dosya yükleme | Gövde okunmadan boyut/tür/kota/boş yer denetimi; 60 sn veri gelmezse kesilir; kişi başına aynı anda 3, saatte 60 yükleme |
| Dosya indirme | Her indirmede yetki; ek olarak (octet-stream, nosniff, sandbox); dosya adları temizlenir |
| Akıllı doğrulama sorusu | Girişte soru **yalnızca hatalı denemeden sonra** çıkar; normal kullanıcı hiç görmez, otomatik deneme aracı ikinci denemede takılır |
| Kod koruması | 5 dk ömür, tek kullanım, 5 hatalı denemede iptal, yeniden gönderme 60 sn kilitli |

Şifre doğrulama asenkron çalışır: çok sayıda eşzamanlı giriş denemesi sunucuyu kilitlemez.

---

## İnternete açma

Uygulama LAN'da çalışacak şekilde tasarlandı ama internete de açılabilir.
Alan adı + küçük bir VPS yeterli; adım adım anlatım **SUNUCUYA-KURULUM.md**
dosyasında.

Özetle: VPS kirala, alan adını IP'ye yönlendir, Node kur, uygulamayı kopyala,
systemd servisi yap, önüne Caddy koy (HTTPS'i kendisi halleder).

İnternete açınca `data/ayarlar.json` içinde iki şeyi ayarla:

```json
"site":  { "adres": "https://egitimevi.org" },
"vekil": { "guven": true, "baslik": "x-forwarded-for" }
```

> **`vekil.guven` neden var?** Ters vekil arkasında her isteğin IP'si
> `127.0.0.1` görünür; o hâlde bütün ziyaretçiler tek hız-sınırı sayacını
> paylaşır ve koruma çöker. Bu ayar gerçek adresi vekilin başlığından okutur.
> **Vekil arkasında değilken açma** — açıkken herkes başlığı uydurup sınırı aşar.

İnternete açılınca uygulama olarak kurma, telefon bildirimi ve servisçinin konum
göndermesi de çalışmaya başlar (üçü de HTTPS istiyor).

### Yük ve saldırı koruması

Uygulamanın kendi korumaları (vekil olmasa da çalışır):

- IP başına dakikada 1500 API isteği, oturum başına 300; girişte kaba kuvvet kilidi ve bot sorusu.
- Aynı anda en fazla 400 API isteği işlenir; olay döngüsü ortalama 150 ms'den fazla
  gecikirse (sunucu boğuluyor) yeni API istekleri `503 Retry-After` ile geri çevrilir,
  statik dosyalar ve açık işler sürer.
- Gövdesi 30 saniyede gelmeyen istek kesilir (yavaş gönderim saldırısı); en fazla 1024
  bağlantı, vekil yokken IP başına 256.
- Dosya yüklemede okul başına aynı anda 20 yükleme ve en düşük hız sınırı.

Bunlar tek sunucuyu korur; **gerçek DDoS'a** (binlerce makineden trafik) karşı sunucunun
önüne **Cloudflare** (ücretsiz plan) koy: alan adının DNS'ini Cloudflare'e taşı, turuncu
bulutu aç, SSL/TLS "Full (strict)", "Under Attack" modunu gerektiğinde aç, `/api/login`
ve `/api/register` için hız kuralı ekle. O zaman `vekil.guven: true` ve
`"baslik": "cf-connecting-ip"` yap. Ayrıntı **belge/SUNUCUYA-KURULUM.md**'de.

---

## Uyumluluk

- Chrome, Firefox, Edge, Safari, Opera — hepsinde çalışır
- Adres çubuğu sayfayı takip eder (`#/program` gibi) — tarayıcı geri tuşu
  çalışır, sayfa yenilenince aynı yerde kalırsın
- Telefon, tablet ve bilgisayar uyumlu — sol menü her ekranda ☰ butonuyla açılıp kapanır
  (masaüstünde tercih hatırlanır)
- **Reklam yok**, dış servis yok, internet bağlantısı gerekmez
- Tek npm paketi `pg` (PostgreSQL sürücüsü); gerisi Node.js'in kendi kütüphaneleri

---

## Ekran görüntüleri

`araclar/gezinti.js` her rolün bütün ekranlarını gerçek bir tarayıcıda gezer, özellikleri
kullanır (pencereleri açar, süzgeç seçer, değer yazar) ve her adımın fotoğrafını çeker:
açık tema, koyu tema ve telefon boyutu. Aynı sırada hata toplar (konsol hataları, 400+
dönen istekler, yüklenirken kayma, bulunamayan düğmeler). Fotoğraflar JPEG; masaüstü 1,5
kat, telefon 3 kat çözünürlükte (`EE_OLCEK=1` ile küçük çekilir).

Çıktı depodaki `ekran-goruntuleri/` klasörüne yazılır: `index.html` ekranlarla kılavuzdur
(önce müdürün gözünden bütün okul yönetimi, sonra her rol; her fotoğrafın altında ne
gösterdiği anlatılır). Fotoğraflardaki bütün kişiler ve okullar test verisidir. Hata raporu
(`hata-raporu.md`, adım başına API sayısı ve kayma) depoya girmeyen `testler/testdata/gezinti/`
altına yazılır. Test sunucusu açıkken (tohum ve zengin veriyle):

```
export EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log
node araclar/zengin-veri.js      # dolu bir okul: sınıflar, program, ödevler, sınavlar
node araclar/gorsel-veri.js      # çok rollü hesaplar, okul sayfası, etüt, servis, kulüp, anket
node araclar/gezinti.js
```

Chrome ya da Edge'i başsız açar (DevTools protokolü); ayrı bir program kurmaya gerek yok.

---

## Test örneği çalıştırma

Gerçek verine dokunmadan ayrı bir kopya çalıştırabilirsin:

```
EE_DATA=/tmp/egitimevi-test EE_ADMIN_SIFRE=admin123 PORT=3200 node sunucu/index.js
```

`EE_DATA` ayrı bir veri klasörü kullandırır, `PORT` farklı bir port açar.
Bu örnekte e-posta ayarı olmayacağı için giriş kodları terminale yazılır.

---

## Dosyalar

Kod ikiye ayrılır: **`sunucu/`** arka uç (Node.js, API, veri), **`public/`** ön yüz
(tarayıcıda çalışan HTML/CSS/JS). Her dosyanın başında ne işe yaradığı yazar.

```
eğitim evi/
├── ekran-goruntuleri/         ← ekranlarla kılavuz: index.html (müdürün gözünden her bölüm) ve fotoğraflar
├── package.json               ← tek bağımlılık (pg) ve komutlar: start, veritabani-kur, eposta-ayarla, test
├── server.js                  ← 3 satırlık kabuk: sunucu/index.js'i çağırır
├── yapimcilar.json            ← "Yapımcılar" listesi (ad, GitHub kullanıcı adı, katkı)
├── .gitignore                 ← data/ ve gizli dosyalar depoya girmez
│
├── sunucu/                    ← ARKA UÇ
│   ├── index.js               ← giriş noktası: veriyi yükler, HTTP sunucuyu açar
│   ├── api.js                 ← /api yönlendiricisi: isteği ilgili bölüme dağıtır
│   ├── yollar.js              ← klasör yolları, port, dinleme adresi (EE_DATA, PORT, HOST)
│   ├── ortak.js               ← sabitler ve küçük yardımcılar (ders listesi, iller, tarih, temizleme)
│   ├── ayarlar.js             ← data/ayarlar.json (e-posta, site adresi, ters vekil)
│   ├── veri/                  ← VERİ KATMANI (SQL yalnızca burada)
│   │   ├── index.js           ← tek giriş noktası: depo, bildir, açılış, yedek
│   │   ├── baglanti.js        ← bağlantı havuzu, sorgu(), islem() (transaction), hata çevirisi
│   │   ├── sema.js            ← şema dosyalarını sırayla uygular
│   │   ├── sema/001-ilk.sql   ← tablolar, anahtarlar, kısıtlar, indeksler
│   │   ├── sema/002...018     ← sonraki değişiklikler, sırayla (009 okul adresi ve hesaplar,
│   │   │                        010 servis konumu, 011 telefon bildirimi aboneliği,
│   │   │                        012 yetişkin hesabı ve okul rolleri, 013 hazır Öğretmen
│   │   │                        rolü + etütler + mesaj düzeltme, 014 "okul açtı" işareti,
│   │   │                        015 telefon ülke kodu, 016 e-posta onayı, 017 ödev yıldızı,
│   │   │                        018 okul sayfası)
│   │   ├── esleme.js          ← satır <-> uygulama nesnesi (ad_soyad <-> fullName)
│   │   ├── yazici.js          ← genel INSERT/UPDATE (ad doğrulamalı)
│   │   ├── depo/              ← tablo gruplarına göre sorgular (kullanıcılar, ödevler, sınavlar...)
│   │   ├── json-aktarim.js    ← eski db.json ve yedekler <-> veritabanı
│   │   └── yedek.js           ← günlük yedek, geri yükleme
│   ├── guvenlik.js            ← hız sınırı, kaba kuvvet kilidi, bot sorusu, 2FA, oturum
│   ├── sifre.js               ← scrypt ile şifre özetleme
│   ├── http.js                ← JSON cevap, gövde okuma, sıkıştırma, statik dosya, parça birleştirme
│   ├── yetki.js               ← roller, yetkiler, kapsam, dışarı verilen kullanıcı görünümü
│   ├── iliskiler.js           ← kim kimin öğretmeni; sınıf, ders, program yardımcıları
│   ├── okullar.js             ← MEB okul listesi ve arama
│   ├── hatirlatma.js          ← ders/ödev hatırlatma bildirimleri
│   ├── push.js                ← telefon bildirimi: RFC 8291 şifreleme, VAPID, gönderim kuyruğu
│   ├── site.js                ← /api/site: açılış sayfası rakamları, data/config.yml'deki iletişim
│   ├── bolumler/              ← her bölüm kendi uçlarını sunar (uclar(k))
│   │   ├── kayit.js           ← kayıt, giriş, şifre, profil, bildirimler
│   │   ├── kisilik.js         ← yetişkin hesabı: rol seçimi, Ekle, öğretmen kodu, hesap bilgisi, hesabı sil
│   │   ├── yonetici.js        ← /api/admin: onaylar, okullar, yedekler
│   │   ├── yonetici-okul.js   ← /api/admin/okul-ac: yöneticinin okul açması
│   │   ├── okul-sayfasi.js    ← /api/okul-sayfa, /api/okul-foto: okulun giriş sayfası
│   │   ├── okul.js            ← /api/school: sınıf, ders, program, roller, ders programı Excel'i
│   │   ├── hesaplar.js        ← /api/school: öğrenci/servisçi hesabı, öğretmeni kodla ekleme, veli bağlama, okul adresi
│   │   ├── kisi-aktarim.js    ← /api/school: kişi listesi şablonu, içeri/dışarı aktarım, metinden Excel
│   │   ├── okul-hayati.js     ← /api/yemek, /api/servis (harita, sefer, konum), /api/kulupler
│   │   ├── anket.js           ← /api/anketler
│   │   ├── odev-dosya.js      ← /api/odev-dosya: teslim dosyası yükleme ve indirme
│   │   ├── push.js            ← /api/push: bildirim aboneliği
│   │   ├── odev.js            ← /api/assignments
│   │   ├── sinav.js           ← /api/examgroups, /api/exams
│   │   ├── ilerleyis.js       ← /api/progress, /api/myschedule
│   │   ├── veli.js            ← /api/parent
│   │   ├── ogretmen.js        ← /api/teacher
│   │   ├── egitim-yili.js     ← /api/egitim-yili
│   │   ├── takvim.js          ← /api/takvim
│   │   ├── islem-kaydi.js     ← /api/islem-kaydi
│   │   ├── devamsizlik.js     ← /api/devamsizlik
│   │   ├── etut.js            ← /api/etut: etüt açma, öğrencileri, yoklama
│   │   └── mesaj.js           ← /api/mesajlar
│   └── yardimci/
│       ├── xlsx.js            ← Excel okuma/yazma (zip + XML, sıfır bağımlılık)
│       ├── aktarim.js         ← Excel sütun eşleme ve doğrulama
│       ├── tablo-oku.js       ← XLSX, XLS, ODS, CSV ve düz metin listesini okur
│       ├── xls.js             ← eski Excel (.xls, 97-2003) okuyucu: birleşik belge + BIFF8
│       ├── kucult.js          ← tarayıcıya giden JS/CSS'ten yorumları atar
│       ├── css-temizle.js     ← okul sayfasının kısıtlı CSS'i: izinli seçici/özellik/değer
│       ├── resim.js           ← fotoğraf türü (ilk baytlar) ve konum bilgisini silme
│       └── eposta.js          ← SMTP istemcisi
│
├── public/                    ← ÖN YÜZ (tarayıcıya giden her şey)
│   ├── index.html             ← giriş ekranı + uygulama iskeleti
│   ├── kvkk.html              ← aydınlatma metni
│   ├── manifest.json, sw.js   ← telefona kurulabilir uygulama (PWA)
│   ├── js/tema.js             ← açık/koyu tema; sayfa çizilmeden önce çalışır
│   ├── js/parcalar/           ← arayüz mantığı, 48 parça (00-durum ... 28-grafik; 04c-telefon, 19g-okul-sayfasi)
│   ├── css/parcalar/          ← stiller, 33 parça (00-temel: renk/tema değişkenleri)
│   └── yazitipi/              ← IBM Plex Sans ve Newsreader (woff2, kendi sunucumuzdan)
│
├── data/                      ← VERİ (depoya girmez)
│   ├── ayarlar.json           ← veritabanı bağlantısı ve e-posta (SMTP) ayarları
│   ├── push-anahtar.json      ← telefon bildirimi anahtar çifti (ilk açılışta üretilir; yedekle)
│   ├── dosyalar/              ← ödev teslim dosyaları
│   ├── okul-fotolari/         ← okul sayfalarının fotoğrafları (konum bilgisi silinmiş)
│   ├── config.yml             ← sitenin iletişim bilgileri (örneği belge/config.ornek.yml)
│   ├── okullar.json           ← 67.661 okulluk arama listesi (sunucuya ayrıca kopyalanır)
│   └── yedek/                 ← günlük yedekler
│
├── araclar/                   ← yardımcı araçlar (elle çalıştırılır)
│   ├── eposta-ayarla.js       ← e-posta kurulum sihirbazı
│   ├── veritabani-kur.js      ← ilk kurulum: PostgreSQL kullanıcısı ve veritabanları
│   ├── yazitipi-indir.js      ← yazı tiplerini indirir, @font-face üretir
│   ├── gezinti.js             ← her rolün ekranlarını gerçek tarayıcıda gezer, fotoğraflar, hata toplar
│   ├── tema-ornekleri.js      ← tema seçim sayfasının örnek görüntüleri
│   ├── zengin-veri.js         ← ekran görüntüleri için dolu bir okul
│   ├── gorsel-veri.js         ← ekran görüntüleri için ek veri: çok rollü hesaplar, okul sayfası, etüt, servis
│   └── giris.js               ← araçların ortak giriş yardımcısı (2FA kodunu günlükten okur)
│
├── testler/                   ← TESTLER ve DENETİMLER
│   ├── tumtest.sh             ← hepsini koşturur (1000'i aşkın test + 5 denetim), egitimevi_test üzerinde
│   ├── test-*.js              ← paket paket uç testleri
│   ├── test-ayarlari.js       ← testlere test veritabanı bağlantısını yazar
│   ├── sql-denetimi.js        ← SQL metnine kullanıcı değeri karışıyor mu
│   ├── yetki-denetimi.js      ← her uç × her rol: yetkisiz geçen var mı
│   ├── girdi-denetimi.js      ← bozuk/kötü niyetli veriyle 500 var mı
│   ├── yazim-denetimi.js      ← Türkçe yazım ve karaktersiz metin
│   └── buton-denetimi.js      ← ölü düğme, ölü kod, tanımsız API yolu
│
├── belge/                     ← BELGELER
│   ├── KILAVUZ.md             ← bu dosya: kurulum ve her bölümün ayrıntısı
│   ├── SUNUCUYA-KURULUM.md    ← internete açma rehberi (Linux VPS + egitimevi.org)
│   ├── config.ornek.yml       ← data/config.yml örneği (iletişim bilgileri)
│   ├── NASIL-YAPILDI.html     ← projenin nasıl yazıldığının hikâyesi
│   └── ekran-goruntuleri/     ← albüm (üretilir, depoya girmez)
│
└── tasarim/                   ← tasarım denemeleri (uygulamaya girmez)
    ├── tema-secimi.html       ← renk/font/köşe/hareket seçme sayfası
    └── ornekler/              ← seçilmiş kombinasyonların görüntüleri
```

### Ön yüz nasıl tek dosya oluyor?

`public/js/parcalar/` ve `public/css/parcalar/` altındaki dosyalar geliştirirken ayrı
durur; sunucu bunları ad sırasıyla birleştirip `/js/app.js` ve `/css/style.css` olarak
sunar, bir parça değişince yeniden okur. Derleyici, paket, kurulum yok.

Tarayıcıya giden dosyada **yorumlar yoktur** (`sunucu/yardimci/kucult.js`): dizgi ve
düzenli ifade içindeki `//`, `/*` işaretlerine dokunmayan küçük bir ayrıştırıcı yorumları
atar, sonuç derlenip denetlenir; derlenmezse yorumlu hâli gider (uygulama asla bozulmaz).
Güvenlik buna dayanmaz, bütün kurallar sunucuda. Geliştirirken hatanın hangi parçadan
geldiğini görmek için sunucuyu `EE_ACIK_KAYNAK=1` ile başlat: yorumlar ve
`/* ==== parcalar/... ==== */` işaretleri kalır. Tarayıcının geliştirici konsolunda
kullanıcıya "Dur!" uyarısı çıkar (biri ona kod yapıştırtmaya çalışıyorsa).

---

## Görünüm: açık/koyu tema ve yazı tipleri

- **Ayarlar → Görünüm**: Sistem · Açık · Koyu. Seçim hem tarayıcıda hem hesapta saklanır;
  telefondan girince de aynı gelir. "Sistem" işletim sisteminin ayarına uyar.
- Üst şeritte (giriş yapmadan da) ve uygulamanın üst çubuğunda **ay / güneş** düğmesi:
  açık görünümde ay (koyuya geç), koyuda güneş (açığa geç). Girişliyse seçim hesaba da yazılır.
- Bütün renkler `public/css/parcalar/00-temel.css` içinde değişkendir; başka dosyada sabit
  renk yoktur. Koyu temada marka rengi açılmış hâliyle kullanılır (koyu zeminde titremesin).
- Yazı tipleri: başlıklarda **Newsreader**, gövdede **IBM Plex Sans**; kodlarda sistem
  eş genişlikli fontu. Dosyalar `public/yazitipi/` altında, dışarıya istek gitmez.
  Toplam 248 KB, bir kez iner, sonra tarayıcı bir yıl önbellekte tutar.
- Hareket: sayfa içeriği sırayla belirir, kartlar üstüne gelince hafif kalkar. İşletim
  sisteminde "hareketi azalt" açıksa hepsi kapanır.
- Profil fotoğrafı yok: her kişinin yanında adının **baş harfleri** yuvarlak içinde
  durur (menüde, mesajlarda, listelerde). Renk kişiye göre sabittir; fotoğraf
  yüklenmediği için saklanacak kişisel görsel de yoktur.

---

## Kayıt kuralları

- **E-posta onayı.** Yetişkin hesabı açan kişiye "hesap açma isteği aldık, açmak
  istiyorsan bağlantıya tıkla" e-postası gider; hesap **ancak bağlantıya tıklanınca**
  açılır (bağlantı 24 saat geçerli). Böylece başkasının adresiyle ya da olmayan bir
  adresle hesap açılamaz. E-posta ayarlıysa adresin alan adının gerçekten e-posta alıp
  almadığına (MX kaydı) da bakılır. Aynı adrese saatte en fazla 3 bağlantı gider.
  E-posta değiştirirken de yeni adrese onay bağlantısı gider; tıklanana kadar eski adres geçerlidir.
- **Şifre.** Yetişkin hesaplarında (veli, öğretmen, müdür, yönetici) en az 8 karakter;
  en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter (`!`, `?`, `*`, `.`
  gibi). Öğrenci ve servisçi hesaplarında en az 8 karakter, harf ve rakam. Yazarken
  kurallar tek tek işaretlenir.
- **Telefon** ülke koduyla yazılır: kutunun solundan ülke seçilir (+90 Türkiye hazır),
  numara o ülkenin düzenine göre gruplanır (`+90 532 123 45 67`). Sunucu uluslararası
  biçimde (E.164, `+905321234567`) saklar; eski `0532...` kayıtlar 015 şema dosyasıyla çevrildi.
- **Doğum tarihi** kayıtta ve Ayarlar'da alınır; öğrencide zorunlu, diğer rollerde isteğe
  bağlı. Gelecek tarih, olmayan gün (30 Şubat) ve 1920 öncesi reddedilir.
- **Okul müdürü 18 yaşından büyük olmalı.** Okul başvurusunda doğum tarihi istenir
  (hesapta yoksa) ve "bu okulun yöneticisiyim, bilgilerim doğru" beyanı işaretlenir.
  İnternette yaş kanıtlanamaz; asıl denetim yöneticinin onayıdır: yönetici başvuranın
  yaşını, hesabın ne zaman açıldığını, e-postasını ve telefonunu görür. Şakasına art arda
  başvuruya karşı: hesap başına tek bekleyen başvuru, aynı bağlantıdan günde en fazla 20
  başvuru, e-postası onaylanmamış hesap zaten yok.

---

## Veli paneli

Veli çocuğunun portalına girmeden de her şeyi görür: **Ödevler**, **Devamsızlık**,
**İlerleyiş** ve **Takvim** bütün çocuklar için tek listede gelir, her satırın başında
hangi çocuğun olduğu yazar. Üstteki şeritten tek çocuğa daraltılır. Öğrenciye gönderilen
her mesaj velisine de düşer; mesajda "Zeynep için" notu görünür. Eski yol da duruyor:
Çocuklarım → çocuğun kartı → portalı.

---

## Hız

- Sunucu API'si 1–1,5 ms cevap verir; `localhost` için IPv4+IPv6 birlikte dinlenir
  (yalnızca IPv4 dinlenince tarayıcı önce IPv6'yı deneyip ~200 ms bekliyordu).
- Betik ve stil adresleri kendi sürümünü taşır (`/js/app.js?v=…`): tarayıcı bir yıl
  saklar, dosya değişince adres değişir. İkinci açılışta yalnızca HTML sorulur.
- Yazı tipi ve simgeler de bir yıl önbellekte; arayüz kodu brotli ile 229 KB → 53 KB.

---

## Testler ve denetimler

```
bash testler/tumtest.sh
```

Her paketten önce ayrı bir test sunucusu (3200 portu, kendi veri klasörü) açılır;
gerçek veriye dokunulmaz. Denetim betikleri de aynı klasörde; değişiklikten sonra
çalıştırmakta yarar var:

```
node testler/yetki-denetimi.js     # sunucu açıkken (EE_BASE=http://localhost:3200)
node testler/girdi-denetimi.js     # sunucu açıkken
node testler/yazim-denetimi.js     # sunucusuz
node testler/buton-denetimi.js     # sunucusuz
```

---

## Depo ve gizli bilgiler

Depo herkese açıktır; **`data/` asla girmez** (`.gitignore`): veritabanı bağlantısı,
e-posta şifresi, iletişim bilgileri (`config.yml`), yedekler, yüklenen dosyalar ve
telefon bildirimi anahtarı sunucuda kalır. Commit atmadan önce `git status` çıktısında
`data/` görünmediğini kontrol et.

---

## Henüz eklenmeyenler

- Eğitim Evi Aile için iPhone sürümü (Apple'ın Screen Time izni gerekir) ve Google Play'de yayın.
- Tanıtım sayfası, arama motoru ve bağlantı önizlemesi (internete çıkınca)
- Canlı ders, kitap kurdu, yılın öğrencisi (sonra ele alınacak)
