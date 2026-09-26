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

