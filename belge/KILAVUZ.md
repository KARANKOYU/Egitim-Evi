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

