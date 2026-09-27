# Eğitim Evi — kılavuz

**[egitimevi.org](https://egitimevi.org)** · okul portalı

Bu belge projenin ne olduğunu, kurulumu, her bölümün nasıl çalıştığını, güvenlik
kararlarını ve testleri anlatır. Her ekranın fotoğrafı ve müdürün gözünden anlatımı
[ekran-goruntuleri/index.html](../ekran-goruntuleri/index.html)'de. Sunucuya (VPS) kurulum ve
`egitimevi.org` adımları [SUNUCUYA-KURULUM.md](SUNUCUYA-KURULUM.md)'de; kişisel veriler
[aydınlatma metninde](../public/kvkk/kvkk.html), kurallar [kullanım koşullarında](../public/kosullar/kosullar.html).

## Eğitim Evi nedir?

Eğitim Evi; öğrencinin, velinin, öğretmenin ve okul yönetiminin her gün baktığı
şeyleri tek yerde toplar: ödevler, sınav notları, devamsızlık, ders programı,
mesajlar, takvim, yemek listesi ve okul servisi. Tarayıcıdan açılır; telefona ve
bilgisayara uygulama gibi kurulabilir, ayrıca bir şey indirmek gerekmez.

Her okulun kendi adresi vardır (`egitimevi.org/school/okulun-adi`). Öğrenci ve öğretmen
okulunun adresinden girer; okul o sayfayı kendi fotoğrafları ve renkleriyle düzenler.


### Kim ne yapar

| Kim | Ne görür, ne yapar |
|---|---|
| **Öğrenci** | Ödevlerini görür, dosya teslim eder, ödevdeki quizi çözer, önemli ödevi yıldızlar; sınav notlarını, grafiğini, devamsızlığını, ders programını ve etütlerini takip eder |
| **Veli** | Çocuğunun ödevlerini, notlarını, devamsızlığını görür; servise bindiğini, okula vardığını, eve bırakıldığını ve servisin nerede olduğunu öğrenir; birden çok çocuğu tek hesaptan izler |
| **Öğretmen** | Ödev verir (isterse içine quiz koyar, cevapları okur) ve sonuçlandırır, sınav açar ve not girer, yoklama alır, sınıfına ya da velilere mesaj yazar |
| **Müdür** | Sınıfları, dersleri, ders programını, öğretmen ve öğrenci hesaplarını, rolleri ve yetkileri yönetir; okulun giriş sayfasını düzenler |
| **Servisçi** | Okulun servis saatlerinde **Yoklama** alır (sabah Bindi / Binmedi, akşam Geldi / Gelmedi ve İndi), sırayı düzenler, velilere not yazar; sefer sürerken konumu velilere görünür |
| **Sistem yöneticisi** | Okulu açar ve müdürünü kişi koduyla atar, müdürleri yönetir, sitenin ayarlarını (iletişim, yapımcılar, okul adresleri, zamanlamalar) değiştirir, yedek alır; ekranları ayrı bir adresteki yönetim panelindedir |

**Tek hesap, birden çok rol.** Bir kişi aynı hesapla bir okulda öğretmen, başka bir
okulda müdür ve kendi çocuğunun velisi olabilir. Bunlar **portal**dır: sol üstteki menüde
alt alta durur, kişi aralarında oradan geçer.

**Öğrenci hesabı kişiye aittir.** Öğrenci okul değiştirince yeni okul, T.C. kimlik no ve
doğum tarihi eşleşirse aynı hesabı kendi okuluna alır. Eski okulun kayıtları orada kalır;
öğrenci ve velisi eski yılları ("2025-2026 · Eski Okul · 6-A") seçip görebilir.


### Neler var

- **Ödev:** sınıfa ya da seçilen öğrencilere ödev, teslim dosyası (fotoğraf, belge,
  video; öğretmen fotoğrafı, videoyu ve sesi indirmeden açar), öğrencinin ödevi açıp açmadığı, sonuç (yaptı, geç yaptı, eksik, yapmadı,
  gelmedi), sonradan düzeltme, yıldız ve süzgeçler.
- **Quiz:** ödevin içinde Doğru/Yanlış, çoktan seçmeli (bir ya da birden çok doğru) ve açık
  uçlu sorular; Word'den yapıştırma, süresiz, soru başına ya da bütün quiz için süre, tek
  deneme, sekme değiştirme kaydı; öğretmen her öğrencinin cevaplarını ve yanlışlarını görür.
- **Sınav:** hazır şablonlar (Yazılı 0–100, LGS 0–500, doğru/yanlış/boş/net), ondalıklı
  notlar, sınav grupları ve ağırlıklı ortalama, öğrencinin gelişim grafiği.
- **Devamsızlık ve etüt:** ders yoklaması, etüt günü ve saatinde "geldi / izinli / izinsiz".
- **İletişim:** okul içi mesajlar, sınıfa ya da herkese duyuru, okundu bilgisi, anketler,
  telefona bildirim. Mesaja ve ödeve sürükle-bırak ile birden çok dosya eklenir
  (toplam 50 MB, 7 gün saklanır).
- **Okul hayatı:** ders programı, takvim ve tatiller, yemek listesi, kulüpler, servis
  yoklaması (bindi, okula vardı, eve bırakıldı bildirimleri; sıra; servisçi notu ve velinin
  "binmeyecek" işareti), servis haritası ve okulun servis saatlerinde canlı servis konumu.
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
  şirkete veri gönderilmez. [Aydınlatma metni (KVKK)](../public/kvkk/kvkk.html) sitede herkese açıktır (egitimevi.org/kvkk/kvkk.html).
- T.C. kimlik numarasını yalnızca kişinin kendisi ve okul yönetimi görür.
- Kendisi kaydolan kişinin e-posta adresi, gönderilen bağlantıyla doğrulanır; girişte
  e-postaya giden kodla iki adımlı doğrulama yapılır.
- Yetişkin hesaplarında güçlü şifre zorunludur; kaba kuvvet denemelerine karşı hesap
  kilidi, bot sorusu ve hız sınırı vardır.
- Her API ucu her rol için otomatik olarak denenir: yetkisiz geçen istek var mı, bozuk
  veri sunucuyu düşürüyor mu, SQL'e kullanıcı değeri karışıyor mu.

Projede emeği geçenler sitede üst şeritteki **Yapımcılar** düğmesinde görünür. Liste
yönetim panelinin **Site Ayarları** sayfasından düzenlenir; orada kaydedilmemişse depodaki
[yapimcilar.json](../yapimcilar.json) dosyasından gelir.

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

**İletişim bilgileri**: yayına almadan önce yöneticinin e-postası ya da telefonu yazılır;
yönetim panelinde **Site Ayarları → İletişim bilgileri**'nden ya da sunucudaki
`data/config.yml` dosyasına (örneği `belge/config.ornek.yml`). Müdür adayı kişi kodunu
bu bilgilerle yöneticiye verir; ikisi de boşsa ulaşacak yer göremez (aşağıda
"İletişim bilgileri" ve "Site ayarları").

**Yönetici hesapları** (`data/admins.json`, örneği `belge/admins.ornek.json`; isteğe bağlı):
sistem yöneticileri bu dosyaya yazılır, sunucu açılışta ve çalışırken aralıkla okuyup
hesaplarını açar. Veritabanında hiç yönetici yoksa ve dosyadan da kimse açılmadıysa
varsayılan bir yönetici kurulur (aşağıda "İlk giriş (admin)").

**Çalıştırmak:** `npm start`, sonra tarayıcıda http://localhost:3000
(`node sunucu/index.js` ile aynı; kökteki `server.js` de aynı işi yapan 3 satırlık kabuktur.)
Tablolar ilk açılışta `sunucu/veri/sema/` altındaki SQL dosyalarından kendiliğinden kurulur.
Kapatmak için Ctrl+C. Sunucuda kalıcı çalıştırma (systemd) SUNUCUYA-KURULUM.md'de.

> "PostgreSQL çalışmıyor" hatası çıkarsa: `sudo systemctl start postgresql`.

**Aynı ağdaki telefondan denemek için:** terminalde yazan `Telefondan: http://192.168.x.x:3000`
adresini telefonun tarayıcısına yaz (telefon ve bilgisayar aynı wifi'de olmalı).

---

## İlk giriş (admin)

Sistem yöneticisi hesabı iki yoldan açılır. Sunucu açılışta önce `data/admins.json`
dosyasını uygular (aşağıda "Yönetici dosyası"); ondan sonra veritabanında hâlâ hiç yönetici
yoksa (dosya yok ya da dosyadan kimse açılamadı) **varsayılan ilk yöneticiyi** kurar:

- E-postası `admin@egitimevi.com`, kullanıcı adı `admin` (bu ad bir hesapta varsa `admin2`,
  `admin3`...). Şifresi **rastgele üretilir ve terminale yalnızca bir kez yazılır** (kod
  herkese açık depoda olduğu için sabit bir şifre yok). Testler `EE_ADMIN_SIFRE` ile bilinen
  bir şifre verir.
- `admin@egitimevi.com` başka bir hesapta kayıtlıysa bu yönetici kurulmaz; sunucu yine açılır,
  pencereye uyarı yazar. Yönetici o zaman `data/admins.json` ile eklenir.
- **Önemli:** Sistem şifre değiştirmeyi zorlamaz; giriş yaptıktan sonra **Ayarlar → Şifre
  değiştir** bölümünden bu şifreyi hemen değiştir.
- İki adımlı girişin kodu hesabın e-postasına gider (e-posta ayarlanmamışsa sunucu
  penceresine). `admin@egitimevi.com` senin okuduğun bir kutu değilse canlı sitede yöneticiyi
  `data/admins.json` ile kendi e-postanla aç.

Giriş bitince yönetici kendiliğinden yönetim paneline geçer (aşağıda "Yönetim paneli").

### Yönetici dosyası (data/admins.json)

Sistem yöneticileri elle bu dosyaya yazılır. Örneği depodaki `belge/admins.ornek.json`;
sunucuda `data/admins.json` olarak kopyalanır (`data/` depoya girmez) ve yalnız sunucu
kullanıcısı okuyabilsin diye `chmod 600 data/admins.json` yapılır.

```json
{
  "yoneticiler": [
    { "ad": "Ayşe Yılmaz", "eposta": "ayse.yilmaz@ornek.com", "kullaniciAdi": "ayse.yilmaz", "sifre": "" }
  ]
}
```

- **Dosya yalnız hesap açar.** Dosyada olup veritabanında olmayan yöneticiyi açar. Var olan
  hesabın şifresine ve adına dokunmaz; dosyadan silinen yönetici veritabanından silinmez.
  Dosya bir şifre sıfırlama yolu değildir.
- E-postası ya da kullanıcı adı başka bir hesapta (öğretmen, veli ya da herhangi bir okuldaki
  hesap) olan satır atlanır: var olan hesap dosyaya yazılan bir satırla yönetici **yapılmaz**.
  Karşılaştırma öteki yollardaki gibidir (aşağıda "Aynı e-posta, kullanıcı adı ve T.C.").
- `ad` zorunludur (en az 2 harf). `kullaniciAdi` isteğe bağlıdır: yazılmazsa e-postanın @
  öncesinden türetilir, alınmışsa sonuna sayı eklenir. Dosyada en fazla 50 yönetici olur.
- **Şifre.** Dosyaya yazmak önerilir; yetişkin şifre kuralına uymalı (en az 8 karakter; büyük,
  küçük harf, rakam, özel karakter). Boş bırakılırsa rastgele üretilir ve **yalnız sunucu
  penceresine bir kez** yazılır; sunucu çalışırken eklenen satırda o pencereye bakılmayabilir,
  bu yüzden şifreyi dosyaya yazmak daha rahattır. Şifre yönetim panelinde ve işlem kaydında
  hiçbir zaman görünmez. İki durumda da yönetici **ilk girişte kendi şifresini belirler**;
  ondan sonra dosyadaki şifre geçersizdir, dosyadan silinebilir.
- E-posta gerçek olmalı: iki adımlı girişin kodu oraya gider.
- Bozuk dosya (JSON hatası, `yoneticiler` listesi yok) sunucuyu durdurmaz: sorun yazılır,
  dosya atlanır. Linux'ta dosyanın izinleri sunucu kullanıcısından başkasına açıksa sunucu
  penceresinde ve panelde `chmod 600` uyarısı çıkar.
- **Sunucu çalışırken de düzenlenebilir.** Sunucu her **admins.json okuma aralığı**nda (Site
  Ayarları; varsayılan 1 dakika, 1–60) dosyanın değişme zamanına ve boyutuna bakar (yalnız
  `fs.stat`; dosya izleyicisi kullanılmaz); değiştiyse dosyayı yeniden uygular. Yeniden
  başlatmak gerekmez. Aralık değişince yeni aralık hemen kurulur.
- Yönetim panelindeki **Yönetici Dosyası** sayfası son okumayı gösterir: dosya var mı, son
  okuma, dosyanın son değişikliği, okuma aralığı, açılan hesaplar ("Şifre dosyadan" ya da
  "Şifre üretildi, yalnız sunucu penceresinde") ve atlanan satırlar nedenleriyle ("zaten
  yönetici" satırları ayrı bir notta). Nedenler kısa ve Türkçedir ("şifre en az 8 karakter
  olmalı", "ad en az 2 harf olmalı", "JSON biçimi bozuk (dosyanın 3. satırı): virgül, tırnak ya
  da parantez eksik ya da fazla olabilir"). *Var/Yok* ve son değişiklik dosyanın şu anki
  hâlidir; dosya son okumadan sonra değiştiyse (yazıldı ya da silindi) kart bunu söyler ve
  en geç bir aralık içinde okunacağını yazar, aşağıdaki sonuçlar son okumaya aittir.
  **Şimdi oku** dosyayı aralığı beklemeden okutur.
  Dosyadan açılan her yönetici (`yonetici.eklendi`) ve elle okuma (`yonetici.dosya-okundu`)
  işlem kaydına yazılır.

Kod: `sunucu/yonetici-dosyasi.js`; testi `testler/test-yonetici-dosyasi.js` (yalnız
`testler/testdata/` altındaki dosyalarla çalışır, gerçek `data/admins.json`'a dokunmaz).

### Yönetim paneli (/admin)

Sistem yöneticisinin ekranları (menüde Ana Sayfa, Müdürler, Okullar, Yorumlar,
Hatırlatıcılar, Site Ayarları, Yönetici Dosyası, Yedekleme, İşlem Kaydı) sitenin geri kalanından ayrıdır ve
`egitimevi.org/admin` adresinde açılır.

- **Giriş.** Yönetici herkes gibi `/login`'den iki adımlı girer. Giriş bitince sunucu ayrıca
  bir **yönetim çerezi** yazar ve cevapta yönetim adresini söyler (`yonetimAdresi`); sayfa
  kendiliğinden `/admin`'e geçer. Geçiş tam sayfa yüklemesidir, çünkü tarayıcı çerezi ancak o
  adrese giderken gönderir. Oturumu açık yönetici `/`'i açtığında da `/admin`'e geçer. Şifresini
  başkası vermiş yönetici (`data/admins.json`) önce kendi şifresini belirler, çerezi şifre
  değiştirme cevabıyla alır. Çerez geçerli ama bu sekmede oturum yoksa `/admin` giriş kartını
  gösterir.
- **Çerez.** Adı `ee_yonetim`. Değeri oturum anahtarından bağımsız, rastgele 32 bayttır;
  veritabanında yalnız SHA-256 özeti durur (`yonetim_cerezleri`, şema 030). `HttpOnly`,
  `SameSite=Strict`, `Path=/admin`, site https ise `Secure`; ömrü oturumunki kadardır. Yalnız
  `/admin` altına gider, `/api`'ye gitmez: API yine yalnız `Authorization` başlığıyla çalışır,
  çerezle gelen bir istek hiçbir şey yapamaz (CSRF yüzeyi açılmaz). Her `/api/me`'de yenilenir;
  aynı anda açık iki sekme birbirini düşürmesin diye oturumun en yeni 3 çerezi geçerlidir.
  Çerez çıkışta (tarayıcıdaki de silinir), oturumun süresi dolunca, şifre değişince ya da
  sıfırlanınca, hesap yöneticilikten ya da onaydan düşünce geçersiz olur. Çerez yalnız
  yöneticiye verilir; yönetici olmayan hiçbir cevapta çerez ya da `/admin` adresi geçmez.
- **Çerezsiz `/admin` bilinmeyen bir adrestir.** Çerezi olmayan (ya da geçersiz çerezli) herkes
  `/admin`, `/admin/` ve `/admin/<herhangi>` adreslerinde bilinmeyen bir adresle **bayt bayt
  aynı** cevabı alır: GET ve HEAD'de aynı 404 sayfası, durum, başlıklar ve sıraları, ETag,
  sıkıştırma; POST gibi öteki yöntemlerde bilinmeyen adresin aldığı aynı 405. Çerez yoksa ya da
  biçimsizse veritabanına hiç gidilmez. Biçimi doğru (64 onaltılık hane) ama uydurma bir
  `ee_yonetim` çereziyle gelen istek ise `/admin`'de de bilinmeyen adreste de çerezi veritabanında
  arar, sonra 404 verir. Bilinmeyen adres önce diskte dosyayı yoklar; `/admin` de aynı yoklamayı
  yapar. İki yolun işi aynı kalır, yanıt süresinden adres ayırt edilmez.
  Asıl gizlilik baytların aynılığındadır; ağ gecikmesindeki küçük oynamalar hiçbir adresi ele vermez.
  Böylece dirb, gobuster, ffuf, nikto gibi dizin tarayıcıları adresi bilinmeyen adreslerden
  ayırt edemez. `robots.txt` ve site haritası yoktur; herkese giden sayfalarda ve dosyalarda
  adres geçmez. Gizli dosyalar, boş baytlı adresler ve ön yüz parçaları da aynı 404'ü verir.
- **Geçerli çerezle** `/admin` ve altı yönetim kabuğunu verir: aynı `index.html`, ama
  `/js/app.js` yerine `/admin/yonetim.js`'i yükler. Bu cevaplar önbelleğe alınmaz
  (`Cache-Control: no-store`; servis işçisi de saklamaz) ve arama motorlarına kapalıdır
  (`X-Robots-Tag: noindex, nofollow`).
- **Yönetim kodu ayrı dosyadır.** Herkese giden `/js/app.js`'te yönetim ekranları ve yönetici
  uçlarının adları yoktur. Yönetim ön yüzü `public/js/yonetim/` altındadır ve yalnız geçerli
  çerezle `/admin/yonetim.js`'ten gider (aşağıda "Ön yüz nasıl tek dosya oluyor?").
- **Yönetici uçları da görünmez.** `/api/admin/...` ve yorumların yönetimi
  (`/api/yorumlar/hepsi`, `/api/yorumlar/gizle`) yönetici olmayana (giriş yapmamış tarayıcı,
  öğrenci, öğretmen, müdür, veli, servisçi, rolsüz yetişkin) bilinmeyen bir API adresiyle aynı
  cevabı verir: `404 {"error":"Böyle bir adres yok"}` (401 ya da 403 değil). Bu kararı
  `sunucu/api.js` (`yoneticiUcuMu`) tek yerde verir.
- **Çıkış.** Yönetim adresinden çıkınca sayfa `/login`'e döner, yönetim dosyası bellekte kalmaz
  ve `/admin` yeniden 404 olur. Aynı tarayıcıda çerez hâlâ geçerliyken yönetici olmayan bir
  hesabın anahtarıyla `/admin` açılırsa sayfa sitenin kendi adresine döner.
- **Adres bir parola değildir.** Kod herkese açık depoda; koruma adresin bilinmemesine değil,
  çereze ve sunucudaki yetki denetimine dayanır. Yine de adresi herkese açık yerlerde (okul
  duyurusu, sosyal medya, hata bildirimi) paylaşma. Hata iletileri, bildirimler ve e-postalar
  bu adresi anmaz.

Kod: `sunucu/yonetim-cerezi.js`, `sunucu/http.js` (`yonetimSun`, `bulunamadi`, `bulunamadiCerezli`); testleri
`testler/test-admin-gizli.js` (404 eşitliği, çerez, `app.js`'te yönetim kodu olmaması,
yönetici uçlarının 404'ü) ve `testler/yetki-denetimi.js` (her yönetici ucu × her rol).

---

## Site ayarları

Yönetim panelindeki **Site Ayarları** sayfası sitenin herkese görünen bilgilerini ve
zamanlamalarını değiştirir. Kaydedilen değer hemen geçerli olur; sunucuyu yeniden başlatmak
gerekmez.

| Ayar | Ne işe yarar | Kural |
|---|---|---|
| **İletişim bilgileri** | Sayfaların altı, Hakkında ve **+ Ekle → Müdür** penceresindeki e-posta ve telefon | E-posta biçimi hesap e-postalarındaki gibi (yalnız İngilizce harf, rakam ve işaretler; `ı ş ğ ü ö ç` olmaz); telefon ülke koduyla ya da başında 0 ile (yalnız rakam, boşluk, `+`, tire, parantez; en fazla 24 karakter), yazıldığı gibi görünür. İkisi de boş olabilir |
| **Yapımcılar** | Üst şeritteki **Yapımcılar** listesi ve Hakkında | Ekle, sil, yukarı/aşağı taşı; en fazla 50 kişi. Ad 1–60 karakter; GitHub kullanıcı adı isteğe bağlı (harf, rakam, tire; tireyle başlayıp bitemez; en fazla 39 karakter); katkı en fazla 80 karakter |
| **Play Store bağlantısı** | İndirme sayfasındaki **Google Play'den yükle** düğmesi; boşsa düğme görünmez | Boş ya da `https://play.google.com/...` |
| **Bildirim yoklama aralığı** | Açık sayfanın yeni bildirimleri sorma aralığı (aşağıda "Otomatik bildirimler") | 1–30 dakika, varsayılan 5 |
| **Çevrimiçi sayma süresi** | Açılış sayfasındaki **şu an açık** sayısı: son bu kadar dakikada uygulamaya istek gönderen farklı kişi | 1–60 dakika, varsayılan 5. Yoklama aralığından kısa olamaz: sunucu en az yoklama aralığı + 1 dakika kullanır (varsayılanlarla 6). Kart kullanılan süreyi kutunun altına yazar; kaydedilen (ya da config.yml'deki) süre bu yüzden kullanılamıyorsa ayrıca uyarır |
| **admins.json okuma aralığı** | Sunucunun `data/admins.json`'a bakma aralığı (yukarıda "Yönetici dosyası") | 1–60 dakika, varsayılan 1 |
| **Okul adresleri** | Okulların `egitimevi.org/school/<ad>` adresleri | Aşağıda |

- **Değer nereden gelir?** Öncelik: panelden kaydedilen değer (veritabanı, `site_ayarlari`
  tablosu, şema 030) > sunucudaki `data/config.yml` (örneği `belge/config.ornek.yml`) > kodun
  varsayılanı. Yapımcılarda ikinci adım depodaki `yapimcilar.json` dosyasıdır. Her kart
  değerin nereden geldiğini yazar (*Panelden kaydedildi*, *data/config.yml*,
  *yapimcilar.json*, *Varsayılan*); panelden kaydedildiyse kaydeden kişi ve zaman da görünür.
- **Varsayılana dön** (yapımcılarda **yapimcilar.json listesine dön**) panelden kaydedilen
  değeri siler; ayar `data/config.yml`'deki değere, orada da yoksa varsayılana döner. Panel
  `data/config.yml`'i hiçbir zaman yazmaz. Dosya elle düzenlenir ve değişince en geç 30 saniyede
  yeniden okunur; panelden kaydedilmiş bir ayarı ezmez.
- Doğrulama sunucudadır (`sunucu/bolumler/site-ayarlari.js`); ekran aynı kuralları kayıttan
  önce de uygular. Hata ilgili kutunun altına yazılır (sunucunun cevabında `alan`;
  yapımcılarda ayrıca satırın `sira`'sı ve `altAlan`: `ad`, `github` ya da `katki`).
- Kaydedince yalnız o kart yeniden çizilir; öbür kutulara yazılıp kaydedilmemiş değerler
  kaybolmaz. Yöneticinin sekmesinde sayfanın altındaki iletişim bilgisi, yapımcı listesi ve
  bildirim yoklama aralığı hemen güncellenir. Öteki ziyaretçiler yeni değeri sayfayı yenileyince
  ya da yeniden açınca hemen alır (`/api/site` ve indirme sayfasının `/api/uygulama` cevabı
  tarayıcıda saklanmaz: `Cache-Control: no-store`).
- Değeri değişmeden kaydedilen ayar (ör. varsayılan 1 dakikayı yeniden kaydetmek) panelden
  **sabitlenir**: kaynağı *Panelden kaydedildi* olur, `data/config.yml` ya da varsayılan sonra
  değişse de bu değer kalır. İşlem kaydına "1 → 1 dk" değil "1 dk (varsayılan değeri panelden
  sabitlendi)" yazılır.
- Her değişiklik işlem kaydına okulsuz yazılır (`site.iletisim`, `site.yapimcilar`,
  `site.playstore`, `site.aralik`, `okul.adres-yonetici`); bunları yalnız sistem yöneticisi
  görür. Site ayarları yedeğe girmez; yedekten geri yüklemede olduğu gibi kalır.

**Okul adresleri.** Kartta bütün okullar adresleriyle listelenir (üstteki arama kutusu
süzer; müdürü kaldırılmış okulda *Müdür bekliyor* yazar). **Adresi değiştir** penceresinde
müdürün kullandığı kurallar geçerlidir (küçük harf, Türkçe harf olmadan, rakam ve tire;
3–40 karakter; sitenin kendi sayfa adları (`admin`, `api`, `kvkk`, adresin kendi öneki `school` gibi) ve başka okulun adresi alınamaz). Adres değişince
eski adres **hemen** çalışmaz olur (sunucudaki okul adresi önbelleği boşalır): onu kaydetmiş
öğrenci ve öğretmen okulu bulamaz, yeni adresi okula duyurmak gerekir. Pencere bunu önceden
uyarır; okulun müdürüne bildirim gider. Müdürün kendi okulunun adresini değiştirmesi aynen
durur (aşağıda "Okul adresi").

| Uç (yalnız yönetici; başkasına bilinmeyen adres gibi 404) | Ne yapar |
|---|---|
| `GET /api/admin/site-ayarlari` | Her ayarın değeri, kaynağı (`veritabani`, `config`, `dosya`, `varsayilan`), son değiştiren ve zamanı; aralıklarda sınırlar ve varsayılan, çevrimiçi sürede kullanılan süre ve uyarı |
| `POST /api/admin/site-ayarlari {anahtar, deger}` ya da `{anahtar, sifirla: true}` | Kaydeder ya da panelden kaydedileni siler; hatada `400 {error, alan}` |
| `GET /api/admin/okul-adresleri` | Okullar ve adresleri |
| `POST /api/admin/okul-adres {okulId, kisaAd}` | Okulun adresini değiştirir; hatada `alan: kisaAd` (400) ya da `okulId` (404) |
| `GET /api/admin/yonetici-dosyasi` | `data/admins.json`'un son okuması (şifresiz) ve okuma aralığı |
| `POST /api/admin/yonetici-dosyasi/oku` | Dosyayı hemen okur; işlem kaydına yazılır |

Herkese açık `GET /api/site` sayılar, iletişim ve yapımcılarla birlikte `bildirimAralikDk` ve
`cevrimiciDk` (kullanılan süre) verir; giriş cevabı ve `/api/me` de `bildirimAralikDk` taşır.

**Tek süreç.** Site ayarları açılışta belleğe okunur, kaydedilince bellek de güncellenir.
Sunucunun tek süreç olarak çalıştığı varsayılır (systemd ile tek bir `node sunucu/index.js`).
Aynı veritabanıyla birden çok süreç çalıştırılırsa (cluster, `pm2 -i`, iki makine) bir süreçte
kaydedilen ayar ötekilerde ancak yeniden başlatılınca görünür; `data/admins.json` yoklaması,
okul adresi önbelleği, hız sınırları ve **şu an açık** sayısı da süreç başınadır.

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
sistem yine çalışır; yalnızca yöneticinin **Okul aç** penceresinde okul listeden aranamaz,
adı elle yazılır.

---

## Hesap türleri ve portallar

İki tür hesap var:

- **Yetişkin hesabı**: veli, öğretmen ve müdür aynı hesabı kendisi açar (**Hesap Aç**);
  kayıtta "ne olarak kullanacaksın" diye sorulmaz. Tek hesap, birden çok portal: A okulunda
  öğretmen, B okulunda müdür, çocuğunun velisi olabilir.
- **Okulun açtığı hesap**: öğrenci ve servisçi kaydolmaz, hesabını okul açar (tek
  tek ya da dosyadan toplu).

| Kim | Nasıl | Kim bağlar |
|---|---|---|
| **Müdür** | Yetişkin hesabıyla **+ Ekle → Müdür**: kişi kodunu sistem yöneticisine verir; yönetici **Okullar → Okul aç** ile okulu ve adresini açar, kodla onu müdür yapar (aşağıda "Admin: okul açma") | **Admin (sen)** |
| **Öğretmen** | Yetişkin hesabıyla **+ Ekle → Öğretmen**: kişi kodunu müdüre verir; müdür **Öğretmenler → Kodla ekle** ile kodu girer, maskeli adı ("Ay** Yı****") görüp ekler | Müdür (ya da yetkilisi) |
| **Veli** | Yetişkin hesabıyla **+ Ekle → Veli** (çocuğun veli kodu); ya da okul, velinin T.C. no'su veya kullanıcı adıyla bağlar | Kendisi ya da okul |
| **Öğrenci** | Müdür (ya da yetkili) **Öğrenciler → Öğrenci ekle** ya da dosyayla açar | Okul |
| **Servisçi** | Müdür (ya da servis yetkilisi) **Servisler → Servisçi ekle** ya da dosyayla açar | Okul |

Hiçbirinde ayrıca onay beklenmez: müdürlük başvurusu yoktur (yönetici kişiyi telefon ya da
e-postayla kendisi doğrular), öğretmen ve veli kod girildiği an bağlanır. Veli bağlanınca
öğrenciye, öğretmen ya da müdür eklenince kişiye bildirim gider.

**Portallar.** Yetişkinin her okul rolü ve velisi olduğu her çocuk bir portaldır. Sol üstteki
menünün en üstünde **Portallarım** başlığı altında alt alta durur: *Öğretmen · okul adı*,
*Müdür · okul adı*, *Veli · çocuğun adı*. Bulunulan portal işaretlidir; müdürü kaldırılmış
(kapalı) okul soluk görünür ve girilemez; listenin sonunda **Portal ekle** vardır. Liste kişi
bir portaldayken de görünür. Okul rolüne geçmek yeni oturum demektir, eskisi kapanır; veli
portalına geçince yalnızca seçili çocuk değişir. Her şeyi sunucu denetler.

- Tek portalı olan girişte doğrudan o portala girer.
- Birden çok portalı olan hesabının ana sayfasını görür: "Soldaki menüden bir portal seç"
  ve portal kartları (dokununca geçer).
- Hiç portalı olmayan "Henüz bir portalın yok" kartını ve büyük **+ Ekle** düğmesini görür;
  menüsünde yalnızca **Başlangıç** ve **Hatırlatıcılar** vardır.
- Üst çubuğun sağındaki **+ Ekle** (dar ekranda yalnız + simgesi) yetişkin hesabında ve okul
  rolünde görünür; öğrenci, servisçi ve yöneticide yoktur. Üç yol açar: **Veli** (çocuğun
  veli kodu), **Öğretmen** (kişi kodu ve **Kopyala**, **Yeni kod üret**) ve **Müdür** (kişi
  kodu, **Kopyala** ve sitenin iletişim bilgilerindeki yönetici e-postası ile telefonu; yukarıda
  "Site ayarları").

**Kişi kodu.** Her yetişkin hesabının 16 karakterlik kişi kodu vardır (hesap açılınca
üretilir); öğrencinin kodu **veli kodu**dur. Servisçide ve yöneticide kod yoktur.

- Biçim: yalnızca İngilizce harf, rakam ve `! ? # * + =`. Karışan karakterler yoktur:
  büyük harfte I, L, O; küçük harfte l, o; rakamda 0, 1. Her kodda en az bir büyük harf,
  bir küçük harf, bir rakam ve bir özel karakter bulunur; ilk karakter harftir (Excel'de
  `+`, `-`, `=` ile başlayan hücre formül sanılmasın). Tire kodun karakteri değildir,
  grupları ayırır. Örnek: `Ab3#-kQx9-+mPt-7?zR`.
- **Büyük/küçük harf fark eder.** Ekranda, kâğıtta ve Excel'de 4'erli dört grup hâlinde,
  aralarında tireyle gösterilir; **Kopyala** da kodu tireli kopyalar. Kod yazılan kutuda
  tire her 4 karakterde kendiliğinden eklenir (silerken tire de gider). Girişte boşluklar
  ve tireler silinir: tireli, tiresiz ya da boşluklu yapıştırılan kod da çalışır.
  Yapıştırılan metinde başka yazı da varsa ("Veli kodu: Ab3#-kQx9-+mPt-7?zR") kutuya
  yalnız kod alınır; araya karışmış görünmez karakterler de atılır. Telefon klavyesi
  harfleri birleştirerek yazıyorsa (sözcüğün altı çizili) tireler sözcük bitince gelir. Eski 10
  ve 15 haneli kodlar geçmez: 027 ve 032 şema dosyaları onları siler, sunucu açılışta
  yenilerini üretir (veli bağları ve okul rolleri etkilenmez).
- Yetişkinin kodu **tek kullanımlıktır**: müdür onunla öğretmen eklediğinde ya da yönetici
  onunla müdür yaptığında aynı işlemde yenilenir; başkası görse de ikinci kez kullanamaz.
  Kişi **Yeni kod üret** ile eskisini geçersiz kılabilir (saatte 10).
- Öğrencinin veli kodu kullanılınca **değişmez** (anne ve baba aynı kodla ekleyebilsin);
  okul öğrencinin **Hesap** penceresinden yeniler. Öğrenci kodunu **Ayarlar**'da görür.
- Üretim ve biçim tek yerde: `sunucu/ortak.js` (`kisiKoduUret`, `kisiKoduSade`,
  `kisiKoduBicim`, `crypto.randomInt`). Veritabanında iki sütunda da (`veli_kodu`,
  `eslesme_kodu`) CHECK kısıtı ve tekil indeks vardır.

Bir hesap en fazla 10 okulda rol alabilir (öğretmen ya da müdür); bir okulda yalnızca tek
rolü olur.

**Bırakma ve silme.** Öğretmen **Ayarlar → Portallarım → Okuldan ayrıl** der. Müdürlük
kişinin kendisince bırakılamaz: okul yeni müdürü atanmadan sahipsiz kalmasın diye sistem
yöneticisiyle görüşülür. Çocuk **Ayarlar → Portallarım → Kaldır** ile hesaptan çıkarılır.
**Ayarlar → Hesabımı sil** yetişkin hesabını, çocuk bağlarını ve öğretmenlik rollerini siler
(KVKK silme hakkı); bir okulun müdürü önce müdürlüğü devretmelidir. Verilen ödev ve notlar
okulda kalır; ayrılan öğretmenin açık ödevlerini müdür **Ödevler** sayfasından sonuçlandırır.

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
bağlanır, menüde *Veli · çocuğun adı* portalı çıkar. Okul rolündeyken çocuğun ödevine ya da
notuna bakmak için menüden o veli portalına geçilir.

### Açılış sayfası, giriş ve site ayarları

Giriş yapmamış ziyaretçi şu sayfaları görür; hepsinde aynı üst şerit (sol
üstte **Giriş** ve **Kayıt ol**, sağda **İndir**, ay/güneş, **Hakkında**, **SSS**
ve **Yapımcılar**) ve alt bilgi (ortada GitHub'daki kaynak koduna bağlantı) vardır.
**İndir** indirme sayfasını açar (**egitimevi.org/indir/indir.html**; `/indir` ve `/download` da oraya götürür). **iPhone ve iPad** bölümünde
mavi **iPhone'a ekle** düğmesi Safari'nin **Paylaş → Ana Ekrana Ekle** adımlarını gösterir (App Store uygulaması
yok; ana ekrana eklenen site simgesiyle açılır, iOS 16.4 ve üstünde bildirim alır; ana ekrandan açılınca indirme
sayfası kendiliğinden siteye geçer). **Android** bölümünde üstte
son sürüm ve büyük **İndir** düğmesi, altta PostgreSQL'in indirme sayfasındaki gibi bütün sürümlerin
tablosu (sürüm, tarih, değişiklik notu, boyut, SHA-256 özeti, İndir) ve kurulum adımları. Tablo
uygulama deposunun GitHub **Releases** bölümünden gelir: sunucu listeyi 15 dakikada bir alır, yalnızca
o deponun `.apk` dosyalarını gösterir (taslak ve ön sürüm yok); GitHub'a ulaşılamazsa son liste kalır.
Yeni sürüm çıkarmak için GitHub'da sürüm açıp `egitim-evi.apk` eklemek yeter. Play Store'a çıkınca
oranın adresi yönetim panelinde **Site Ayarları → Play Store bağlantısı**'na (ya da `data/config.yml`
içinde `uygulama: playstore:` satırına) yazılır, sayfada **Google Play'den yükle** düğmesi çıkar.
Testlerde `EE_DIS_ISTEK=0` ile dışarı istek atılmaz. **Yapımcılar**'a
basınca projede emeği geçenlerin listesi açılır. Liste yönetim panelinde **Site Ayarları →
Yapımcılar**'dan düzenlenir; orada kaydedilmemişse depodaki `yapimcilar.json` dosyasından gelir,
projeye katılan kendini oraya ekler:

```json
[
  { "ad": "KARANKOYU", "github": "KARANKOYU", "katki": "Proje sahibi" }
]
```

| Adres | Sayfa |
|---|---|
| `/` | Eğitim Evi nedir, neler var, kimin için; okul, kişi ve **şu an açık** sayısı |
| `/hakkinda` (`/about`) | Proje, bilgilerin nerede tutulduğu, nasıl yapıldığı, yapımcılar, iletişim |
| `/sss/sss.html` | Sık sorulan sorular |
| `/login` (`/giris`) | Giriş; öğrenci ve servisçi için "okulunu seç" (seçince okulun sayfasına gider) |
| `/signup` (`/kayit`) | Yetişkin hesabı açma |
| `/school/okulun-adi` | Okulun giriş sayfası (aşağıda) |
| `/kvkk/kvkk.html` | Aydınlatma metni (KVKK) |
| `/kosullar/kosullar.html` | Kullanım koşulları |
| `/indir/indir.html` | İndirme sayfası (Android sürümleri, iPhone'a ekleme) |

**Sayfa adresleri ve kısa adlar.** Aydınlatma metni, kullanım koşulları, indirme sayfası ve
SSS'nin asıl adresi kendi klasöründedir (`egitimevi.org/kvkk/kvkk.html`); adres çubuğunda bu
görünür, sitedeki ve Android uygulamasındaki bütün bağlantılar bunu gösterir. Kısa ve eski
adresler de çalışır: sunucu onları kalıcı yönlendirmeyle (301) asıl adrese gönderir.
Büyük/küçük harf (Türkçe İ ve ı da: `/İNDİR`, `/ındır`) ve sondaki `/` fark etmez; adresin
`?` sonrası (sorgu) korunur.

| Asıl adres | Kısa ve eski adlar (301 ile asıl adrese) |
|---|---|
| `/kvkk/kvkk.html` | `/kvkk`, `/kvkk/`, `/kvkk.html` |
| `/kosullar/kosullar.html` | `/kosullar`, `/kosullar/`, `/kosullar.html` |
| `/indir/indir.html` | `/indir`, `/indir/`, `/indir.html`, `/download`, `/download/` |
| `/sss/sss.html` | `/sss`, `/sss/`, `/faq`, `/faq/` |

SSS ayrı bir dosya değildir: `/sss/sss.html` tek sayfalık uygulamanın (index.html) adresidir,
açılış ve Hakkında'dan geçişte sayfa yeniden yüklenmez. Yönlendirme yalnız `GET` ve `HEAD`
isteğinde olur; `Location` her zaman bu tablodaki sabit yoldur (başka siteye yönlendirilemez).
Tabloda olmayan adres "Sayfa bulunamadı" (404) verir (ör. `/kvkk/olmayan.html`); içinde boş bayt
(`%00`) olan adres de dosyaya bakılmadan 404 alır (eskiden tek böyle istek sunucuyu düşürüyordu). Adresler
`sunucu/http.js` içindeki `YONLENDIRMELER` ve `UYGULAMA_YOLLARI` listelerindedir; denetimi
`testler/test-adresler.js`.

"Şu an açık": son **çevrimiçi sayma süresi** içinde uygulamaya istek gönderen farklı kişi
sayısı. Süre bir site ayarıdır (varsayılan 5 dakika); açık sayfa ancak bildirim yoklama
aralığıyla istek gönderdiği için sunucu en az yoklama aralığı + 1 dakika kullanır
(varsayılanlarla 6 dakika; yukarıda "Site ayarları"). Yalnızca sayı tutulur,
kimin açık olduğu tutulmaz. Okul ve kişi sayıları sunucuda dakikada bir hesaplanır
(`/api/site`).

**Yorumlar.** Açılış sayfasının altında kullanıcı yorumları durur (0-5 yıldız ve
en fazla 500 harf). Yalnızca **yetişkinler** yazar: rolü (öğretmen, müdür) ya da
çocuğu olan hesap; öğrenci ve servisçi yazamaz. Hesap başına tek yorum olur,
kişi onu düzeltip silebilir. Yazanın adı kısaltılarak görünür: *Ayşe Kaya* →
"Ay. Ka.", iki isimliyse isimlerin baş harfi: *Ayşe Nur Kaya* → "A. N. Ka.".
Uygunsuz kelime süzgeci depodaki `badwordsfilter.json` listesine bakar:
büyük/küçük harf, Türkçe harf, harf uzatma ("salaaak") ve harf aralarına
konan boşluk/nokta ("a p t a l") fark etmez. İnternet adresi de kabul edilmez.
Yönetici **Yorumlar** sayfasından bir yorumu gizler ya da yeniden gösterir.

**İletişim bilgileri kodda değil** (depo herkese açık). Yönetim panelinde **Site Ayarları →
İletişim bilgileri**'nden kaydedilir (veritabanında durur, hemen geçerli olur); orada
kaydedilmemişse sunucudaki `data/config.yml` dosyasından gelir (depoya girmez; örneği
`belge/config.ornek.yml`; dosyaya yazılan değer en geç 30 saniyede sayfaya geçer). Bilgiler
Hakkında sayfasında ve alt bilgide görünür; boş alan görünmez. Aynı bilgiler
**+ Ekle → Müdür** penceresinde de "Yöneticimize ulaş"
diye çıkar: okulunu açtırmak isteyen kişi kodunu buradan verir. E-posta sayfanın HTML
kaynağında düz yazı olarak durmaz (adres toplayan botlar için), tarayıcıda kurulur.
**Yayından önce en az biri (e-posta ya da telefon) doldurulmalıdır:** ikisi de boşsa
pencere yalnızca "sayfanın altındaki iletişim bilgileri" der, alt bilgide de bir şey
görünmez ve kişi yöneticiye ulaşamaz. Sunucu açılışta bunu `! Iletisim bilgisi yok`
diye uyarır.

```yaml
iletisim:
  eposta: ""
  telefon: ""
```

### Okul adresi (egitimevi.org/school/okulun-adi)

Her okulun kendi adresi vardır: `egitimevi.org/school/doruk-koleji` gibi. Adresi okulu
açarken yönetici yazar (okulun adından önerilir); müdür **Okul Adresi ve Konumu**
sayfasından kendisi değiştirir (küçük harf, rakam, tire; 3–40 karakter; sitenin kendi
sayfa adları alınamaz). Sistem yöneticisi de her okulun adresini yönetim panelinde
**Site Ayarları → Okul adresleri**'nden değiştirebilir; o zaman okulun müdürüne bildirim gider.
Adres değişince eski adres hemen çalışmaz ("Okul bulunamadı").

- Okul adresi açılış sayfasında tanıtılmaz. Öğrenci `/login` sayfasında okulunu seçer, okulun
  sayfasına gider; müdür okulun bağlantısını dağıtabilir. Son girilen okul bu tarayıcıda hatırlanır.
- **Okul sayfası** (`egitimevi.org/school/doruk-koleji`): giriş kartının üstünde okulun kendi
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

1. Yönetici hesabınla gir (`data/admins.json`'daki ya da ilk açılışta kurulan
   `admin@egitimevi.com`; yukarıda "İlk giriş (admin)"). Giriş bitince yönetim paneline
   geçersin. Sayfanın altında e-postan ya da telefonun görünmüyorsa önce **Site Ayarları →
   İletişim bilgileri**'ni doldur: müdür adayı sana onlarla ulaşır.
2. Müdür adayı yetişkin hesabını açsın (**Hesap Aç**), girince **+ Ekle → Müdür**'deki
   kişi kodunu ve okulunun adını sana versin. Kişiyi telefon ya da e-postayla doğrula.
3. Yönetim panelinde **Okullar → Okul aç**: okulu seç, adresini yaz, kişi kodunu girip
   **Bul** ile kime ait olduğuna bak, **Okulu aç**. Okul ve müdürü onaylı açılır; okul
   müdürün sol üstteki menüsünde görünür, aramada da çıkar.
4. Müdür **Okul Adresi ve Konumu** sayfasında gerekirse adresi değiştirir, okulun haritadaki
   yerini seçer.
5. Müdür öğrenci ve servisçi hesaplarını açar: tek tek ya da **Excel Aktarım** ile
   (iki sayfalı şablon ya da kendi XLS/ODS/CSV/TXT listesi). Olmayan sınıflar açılır.
   Öğretmenler yetişkin hesabı açıp **+ Ekle → Öğretmen**'deki kişi kodlarını verir; müdür
   **Öğretmenler → Kodla ekle**.
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
kimlik numarası"), okulun giriş adresi ve öğrencinin veli kodu (4'erli tireli gruplar ve **Kopyala**)
gösterilir; şifre bir daha gösterilmez. Öğrencinin veli kodu hesap açılınca üretilir, servisçide
kod yoktur.

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
- **Veli kodu** görüntülenir, kopyalanır, gerekirse **Yeni kod üret** ile yenilenir (eski kod
  artık çalışmaz; bağlı veliler bağlı kalır)

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

**Müdürler** sayfasında bütün müdürler listelenir: ad, kullanıcı adı, e-posta, okul, il,
öğretmen ve öğrenci sayısı ve durum (*Etkin*, *Giremiyor*, *Kapalı*). **Hesabı sil** ile
müdür kaldırılır: kişinin yetişkin hesabı durur, yalnızca müdürlüğü gider (eski düzende
açılmış ayrı müdür hesabı ise silinir). Okul **Okullar** listesinde *Müdür bekliyor*
durumuna döner ve kimse giremez; öğretmen ve öğrenci hesapları silinmez. Yönetici
**Okullar → Okul aç** ile okula yeni müdür atar. Müdürlük başvurusu ve **Onay Bekleyenler**
sayfası yoktur.

### Admin: okul açma

Okulu yönetici açar: **Okullar → Okul aç**. Müdür, kendi hesabını açmış kişinin **kişi
koduyla** atanır.

1. Okulunu açtırmak isteyen kişi yetişkin hesabını açar ve **+ Ekle → Müdür**'deki kişi
   kodunu okulun adıyla birlikte yöneticiye verir. Yönetici kişiyi dışarıdan (telefon,
   e-posta) doğrular; yaş ya da beyan gibi bir form yoktur.
2. Pencerede okul MEB listesinden aranır (listede yoksa adı, ili ve ilçesi yazılır) ve
   okulun adresi yazılır (`egitimevi.org/school/<uzantı>`; kutuya gelince okulun adından
   önerilir).
3. **Müdürün kişi kodu** kutusuna kod yazılır (tire kendiliğinden gelir; tireli ya da tiresiz
   yapıştırılabilir) ve **Bul**'a basılır: kodun sahibinin tam adı, kullanıcı adı,
   e-postasının kısaltılmış hâli
   (`fa****@gmail.com`) ve kaç okulda rolü olduğu görünür. Kod değişirse yeniden **Bul**
   gerekir; **Okulu aç** yalnızca bulunan kodla gider.
4. **Okulu aç**: okul ve müdürlük onaylı açılır, kişinin kodu aynı işlemde yenilenir (tek
   kullanımlık). Kişiye "… okulunun müdürü olarak eklendin. Sol üstteki menüden okuluna
   geçebilirsin." bildirimi gider, işlem kaydına yazılır (`okul.acildi`). Sonuç penceresinde
   okulun adresi (**Kopyala**) ve müdürün adı görünür.

Kurallar sunucuda (`sunucu/bolumler/yonetici-okul.js`, `POST /api/admin/kisi-bul` ve
`POST /api/admin/okul-ac`):

- E-postayla ya da yeni hesap açarak müdür yapma yolu yoktur.
- Sistem yöneticisi ve okulun açtığı hesaplar (öğrenci, servisçi) müdür yapılamaz.
- Müdürü kaldırılmış (sahipsiz) okul yeniden seçilirse yeni okul açılmaz, o okul
  devralınır ve kendi adresini koruyabilir; kişinin o okulda başka bir rolü (ör.
  öğretmenlik) varsa önce o rol çıkarılmalıdır.
- Bir kişi en fazla 10 okulda rol alabilir.
- Kod tahminine karşı: **Bul** yönetici başına dakikada 30; aynı bağlantıdan saatte en
  fazla 30 yanlış kod (**Bul** ve **Okulu aç** birlikte sayılır). Yanlış kodda "Bu kodla bir
  hesap yok." denir. Kod adrese ve sunucu günlüğüne düşmesin diye istekler POST'tur.
- Aynı kod aynı anda iki kez kullanılamaz: kod koşullu olarak harcanır, ikinci istek
  "Bu kod az önce kullanıldı" alır.

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
Quizin sonucu öğrenciye açılınca (bir kez) **"Matematik dersinden "Oran orantı" quizinin sonucu açıklandı."**

### Bildirimler sayfaya nasıl gelir (yoklama aralığı)

Açık sayfa üst çubuktaki zil için sunucuya yeni bildirim olup olmadığını
(`GET /api/notifications`) **bildirim yoklama aralığı**yla sorar. Aralık bir site ayarıdır
(yönetim panelinde **Site Ayarları → Zamanlamalar**; varsayılan 5 dakika, 1–30).

- Sekmeye dönülünce ve bildirim paneli açılınca aralık beklenmeden sorulur; arka plandaki
  sekme hiç sormaz. Panel açıkken yeni bildirim gelirse panel de tazelenir. Aynı anda iki
  yoklama çalışmaz.
- Sunucuya son bilinen sürüm gönderilir; kutu değişmediyse liste gelmez, cevap birkaç bayttır.
- Aralık giriş cevabında, `/api/me`'de ve `/api/site`'ta (`bildirimAralikDk`) gelir; açık sayfa
  değişen aralığı yeniden açılınca ya da yeniden girişte alır.
- Telefon bildirimi (Web Push) ve telefon uygulamasının kendi yoklaması bu aralığa bağlı
  değildir: Web Push bildirim yazılınca gönderilir.

### Öğrencinin bildirimi veliye de gider

Öğrenciye giden her bildirimin bir kopyası onaylı velilerine de gider; başında hangi
çocuk olduğu yazar: **"Zeynep Şahin · Matematik dersinden "Oran orantı" ödevi açıklandı:
Yaptı"**. Birden çok çocuklu velide her bildirim kendi çocuğunun adını taşır, karışmaz;
dokununca velinin o çocuğa ait sayfası açılır (Ödevler, Devamsızlık, İlerleyiş...; üstteki
çocuk şeridinde o çocuk seçili gelir). Telefon bildirimi de aynı metinle gider.

- Veliye zaten kendi metniyle haber veren bildirimler (devamsızlık: "Çocuğunuz ... dersine
  gelmedi", etüt yoklaması, servis yaklaşıyor, okul değiştirme) ikinci kez gitmez.
- Servis yoklaması ("Zeynep 07:42'de servise bindi.") ve servisçinin notu yalnızca veliye
  gider, öğrenciye gitmez (aşağıda "Servis yoklaması").
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

**Telefon uygulamasının bildirimleri** Web Push'la değil, **cihaz anahtarıyla yoklamayla** gelir
(Firebase yok): uygulama `GET /api/cihaz/bildirimler?son=<imleç>` ile yeni bildirimleri sorar. Hesabın
(yetişkinde bütün okul rolü satırlarının da, Web Push'taki kural) okunmamış yeni bildirimleri en çok 20'şer
döner; metin ve bağlantı telefon bildirimindekiyle aynıdır (okul rolünde `/school/<okul>/?k=<alıcı>#/sayfa`). İlk çağrıda
(`son` yokken) eski bildirimler dönmez, yalnızca imleç döner: telefon kurulunca geçmiş bildirimler yağmaz.
Cevaptaki `servisSaatleri` yalnızca servisle ilgisi olan hesapta (servisçi, servisteki öğrenci ya da velisi)
doludur; uygulama bu saatlerde daha sık yoklar. Ayrıntısı aşağıda "Eğitim Evi telefon uygulaması".

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
| **Öğretmenler** | Okula öğretmen ekler (kişi koduyla) · Bilgi ve branş düzenler · Okuldan çıkarır |
| **Ödev ve sınav** | Ödev verir · Ödev sonuçlandırır · Sınav oluşturur · Sınav notu girer · Girdiği sınıfların öğrenci sonuçlarını görür |
| **Devamsızlık** | Yoklama alır · Okulun tüm devamsızlığını görür |
| **Etüt** | Etüt açar ve düzenler · Bütün etütlerde yoklama alır |
| **Mesajlaşma** | Sınıfa/gruba toplu mesaj ve anket · Herkese mesaj |
| **Okul hayatı** | Yemek listesini düzenler · Servisleri, servis öğrencilerini ve servis saatlerini düzenler (bugünkü servis yoklamasını salt okunur görür) · Kulüp açar ve düzenler |
| **Yönetim** | Rol oluşturur · İşlem kaydını görür · Takvim · Eğitim yılı · Excel/CSV aktarım · Okul sayfası · Okulun haritadaki yerini ayarlar |

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
  Ad ya da son teslim değişirse öğrencilere haber gider. Ödevin quizi ise yalnızca hiçbir
  öğrenci başlamadıysa değişir.
- **Mesaj**: gönderilmiş mesajın konusunu ve metnini yalnızca gönderen
  düzeltir ("Düzelt"). Alıcıya yeniden bildirim gitmez; mesajda
  "düzenlendi" ve saati görünür.

> Yetki kontrolü sunucuda yapılır. Rol silinince ya da yetki daraltılınca
> kişi anında o işlemi yapamaz hâle gelir.

---

## Hatırlatıcılar

Herkes (öğrenci, veli, öğretmen, müdür, servisçi, henüz portalı olmayan yetişkin) menüdeki
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
  çocuğunun okulunun kuralına tabidir; istekteki öğrenci ancak kişinin bağlı olduğu çocuksa
  sayılır (başka okulun öğrenci kimliğini eklemek kapıyı açmaz). İlerleyiş ve takvim kapalı bölümü atlar;
  ödevler kapalıysa ödevin quizi de kapanır ve ödev hatırlatması gitmez.
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
- **Öğrenciler bu ödeve dosya yükleyebilsin** kutusu (yeni ödevde **kapalı** gelir; Ödevi
  düzenle'de açılıp kapanır): işaretlenmezse öğrenci teslim dosyası yükleyemez (aşağıda
  "Ödev teslim dosyaları"). Kontrol ekranında ödevin altında "öğrenciler dosya yükleyebilir"
  ya da "dosya yükleme kapalı" yazar.
- Ödeve isteğe bağlı bir **quiz** eklenir (aşağıda "Quiz"); quiz dosya yükleme kutusundan bağımsızdır.
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
çubuğu, iptal) — yalnızca öğretmen o ödevde **Öğrenciler bu ödeve dosya yükleyebilsin**
kutusunu işaretlediyse. İşaretlemediyse yükleme alanı hiç çıkmaz, ödevin penceresinde
"Bu ödev için dosya yüklenmiyor." yazar; sunucu da yüklemeyi `403` ve `{ dosyaKapali: true }`
ile reddeder. Öğretmen kutuyu sonradan kapatırsa önceden yüklenmiş dosyalar silinmez ve
teslim **donar**: öğretmen görmeye devam eder, öğrenci ne yeni dosya yükleyebilir ne yüklediğini
silebilir (`403`, `{ dosyaKapali: true }`) — öğretmen değerlendirirken dosya kaybolmasın.
Uygunsuz dosyayı yalnızca öğretmen siler. 033 şema dosyası bu değişiklikten önce verilmiş ödevlerde
kutuyu **açık** bıraktı (canlıdaki ödevler eskisi gibi çalışır).

Yükleme alanının üstünde doluluk çubuğu durur: **Dosya alanın · 32 / 50 MB**. Alan ya da
dosya sayısı dolunca bırakma kutusu yerine "Bu ödev için dosya alanın doldu (50 MB). Yer
açmak için bir dosyanı sil." yazar; sığmayan dosyada kaç MB boş yer kaldığı söylenir.
Öğretmenin kontrol ekranında her öğrencinin altında "2 ek" yazar; **Teslimleri indir**
hepsini öğrenci klasörlerine ayrılmış tek zip olarak indirir. Veli, ödevler listesinde
satıra tıklayınca çocuğunun dosyalarını görür.

| Kural | Değer |
|---|---|
| Kim yükler | yalnızca ödevdeki öğrenci, öğretmen dosya yüklemeyi açtıysa (yeni ödevde varsayılan kapalı) |
| Öğrenci başına, bir ödevde | en fazla 10 dosya, toplam 50 MB (tek dosya da en fazla 50 MB) |
| Saklama | ödevin son tesliminden 7 gün sonra silinir; son teslimi yoksa ödev sonuçlandırıldıktan 7 gün sonra, hiç sonuçlandırılmazsa yüklendikten 60 gün sonra. Öğrenci ve öğretmen dosya satırında "N gün sonra silinir" görür |
| Okul başına | 20 GB (`EE_OKUL_DOSYA_GB` ile değişir); %80'i geçince müdüre ve sistem yöneticisine bir kez "Okulun dosya alanının %80'i doldu" bildirimi, dolunca yükleme "Okulun dosya alanı doldu" hatasıyla (507) durur ve ikisine bir kez daha bildirim gider |
| Türler | belge, tablo, sunum, resim, ses, video, zip, Scratch/GeoGebra, kod dosyaları (`.exe` gibi çalıştırılabilirler yok) |
| Ne zaman | ödev başladıktan teslim saatine kadar; ödev sonuçlandırılınca kapanır |

- **Silinme zamanı ödevden hesaplanır** (`sunucu/veri/depo/odev-dosyalari.js`
  `SILINME`): son teslim ileri alınınca ya da ödev yeniden açılınca kendiliğinden yeniden
  hesaplanır; zaten silinmiş dosya geri gelmez. Son teslim sunucunun yerel saatiyle yazılır
  (Türkiye saati, sunucu `TZ=Europe/Istanbul` ile çalışmalı; SUNUCUYA-KURULUM), hesap da öyle yapılır.
- **Yanlış tarihe karşı koruma** (şema 034, `odevler.dosya_saklama`): son teslim (gün ya da
  saat) değiştirilince, kaldırılınca ya da ödev yeniden açılınca dosyalar değişiklikten en az
  7 gün daha kalır. Öğretmen son teslimi yanlışlıkla geçmişe yazarsa (yılı 2025 gibi) saatlik
  temizlik bütün teslimleri hemen silmez; tarihi düzeltmeye zaman kalır. Ödevi düzenle
  penceresi de bunu yazar.
- **Okulun dosya alanı uyarısı** `okul_dosya_uyarilari` tablosunda tutulur (hangi uyarı
  verildi: %80 ya da dolu); kullanım %70'in altına inince saatlik temizlikte silinir, alan
  yeniden dolarsa bildirim yeniden gider. Kota yalnızca öğrenci teslim dosyalarını sayar
  (mesaj ve ödev ekleri 7 günde kendiliğinden silindiği için sayılmaz).

- Dosyalar `data/dosyalar/` altında, `public/` dışında, 32 haneli rastgele adla durur;
  her indirmede yetki yeniden denetlenir (öğrencinin kendisi, velisi, ödevi veren
  öğretmen, müdür). İndirme her zaman "ek" olarak gider (tarayıcıda açılmaz, çalışmaz).
- Yükleme diske akarak yazılır (bellek şişmez); boyut, CRC32 ve SHA-256 akarken
  hesaplanır. Sayı ve toplam sınırı veritabanında kilitli satırla denetlenir: aynı
  anda iki yükleme sınırı aşamaz. Diskte 2 GB'tan az yer kalacaksa yükleme reddedilir.
- Öğretmen uygunsuz bir dosyayı silebilir; ödev silinince dosyaları da silinir.
  Silinme zamanı gelen, yarıda kalan ve kaydı silinen dosyalar saatte bir temizlenir.

**Öğretmenin kontrol ekranında ekler.** Her öğrencinin altında **"3 ek"** gibi teslim
sayısı yazar. Tıklayınca ekler simge, ad, MB boyutu ve "N gün sonra silinir" ile listelenir;
hiçbiri kendiliğinden yüklenmez (boşuna internet harcanmaz). **Fotoğraf** (jpg, png, gif, webp), **video** (mp4,
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
| Bir mesajda ya da ödevde | toplam en fazla 50 MB (tek dosya da en fazla 50 MB), en fazla 20 dosya |
| Doluluk | dosya eklenince kutunun altında "Dosya alanın · 32 / 50 MB" çubuğu; dolunca bırakma kutusu gizlenir, "Bu mesaj için dosya alanın doldu (50 MB). Yer açmak için bir dosyanı kaldır." yazar (ödevde "Bu ödev için") |
| Saklama | 7 gün, sonra dosya silinir (satırda "N gün sonra silinir", sonra "süresi doldu" yazar) |
| Kim indirir | mesajın göndereni ve alıcıları; ödevin öğretmeni, öğrencileri, velileri ve müdür |

Yüklenen dosya önce "taslak"tır; mesaj gönderilince ya da ödev kaydedilince bağlanır.
Bağlanmayan taslaklar 6 saat sonra silinir. Başkasının taslağı bağlanamaz. Yüklerken
taslağın hangi mesaja gideceği belli olmadığı için bir mesajın 50 MB'ı pencerede (doluluk
çubuğu, düzeltmede var olan ekler dahil) ve kaydederken denetlenir; yüklemede yalnızca
kişinin gönderilmemiş bütün taslaklarının toplamı sınırlıdır (150 MB, disk dolmasın). Başka
bir pencerede bırakılmış taslak yeni mesajın eklerini engellemez.

### Quiz

Öğretmen ödeve bir quiz ekleyebilir (ödev başına tek quiz); öğrenci ödevi açıp quizi sitede ya da
telefona kurulan site uygulamasında çözer. Quiz ödevin parçasıdır: **Özellikler**'de ödevler kapalıysa
quiz de kapalıdır (403 `ozellikKapali`), ödev silinince quiz, denemeler ve cevaplar da silinir.

**Hazırlama (öğretmen).** **Yeni ödev ver** ve **Ödevi düzenle** pencerelerinde **Quiz ekle**, pencerenin
içinde açılıp kapanan bir bölümdür (ikinci pencere açılmaz; bölüm açıkken pencere genişler ve dışına
tıklayınca kapanmaz, yazılan sorular kaybolmasın diye).

- **Soru türleri:** **Doğru/Yanlış** (doğru cevap Doğru ya da Yanlış seçilir) · **Çoktan seçmeli** (2–10
  şık, her şıkta "Doğru" kutusu; en az bir doğru, birden çok da olabilir; en az bir şık yanlış olmalı, yoksa
  "Birden çok şık seçebilirsin" notu cevabı ele verir: iki şıklı, iki doğrulu soru gibi) · **Açık uçlu** (öğrenci yazar;
  puanlanmaz, yalnızca saklanır, öğretmen kontrol ederken okur). Soru metni çok satırlı olabilir; sorular
  yukarı/aşağı taşınır ve silinir.
- **Süre:** **Süresiz** · **Soru başına** (her soruya 10 sn – 10 dk) · **Bütün quiz** (1–180 dk).
- **Uygulamadan/sekmeden çıkınca o soru kapanır** (isteğe bağlı). Çıkışlar bu seçenek kapalıyken de kaydedilir.
  Düzenleyicide not: kayıt öğrencinin tarayıcısından gelir; caydırıcıdır, kesin kanıt değildir.
- **Sonuçlar öğrenciye:** **Son teslimden 10 dakika sonra görünsün** (varsayılan) ya da **Hemen görünsün
  (bitirince)**. Altındaki not: Son tarihi olmayan ödevde sonuçlar öğretmen açınca ya da ödev
  sonuçlandırılınca görünür; "Hemen" seçilirse önce bitiren doğru cevapları görür; herkes aynı anda
  çözmüyorsa cevaplar yayılabilir.
- **Metinden ekle:** Word'den ya da düz metinden yapıştırılan sorular sunucuda ayrıştırılır
  (`POST /api/assignments/quiz-metin`); yazmayı bırakınca önizleme listesi ve satır hataları çıkar
  ("11. satır: 4. soruda doğru şık işaretli değil."). **Ekle** soruları düzenleyiciye aktarır, orada
  düzeltilir. Biçim:

  ```
  1) Soru metni (sonraki satırlara taşabilir)
  *A) doğru şık
  B) yanlış şık
  C) *doğru şık          ← yıldız şık harfinin arkasında da olabilir
  2) Güneş bir yıldızdır.
  Cevap: Doğru           ← Doğru/Yanlış sorusu (Doğru | Yanlış | D | Y)
  3) Açık uçlu soru      ← şıksız soru açık uçludur
  ```

  Numara `1)` `1.` `1-` (Word'ün tireyi çevirdiği `1–` `1—` de), şık `A)` `a)` `A.` biçiminde olabilir;
  yıldızın benzerleri (`∗` `＊`) de doğru işareti sayılır. Word'den gelen görünmez karakterler (sıfır
  genişlikli boşluk, yumuşak tire, yön işaretleri) temizlenir. "3.5 kg" gibi sayıyla başlayan satır soru
  sayılmaz; sorunun ilk şıkkı A olmalıdır, böylece soru metnindeki "I." "II." öncülleri şık sanılmaz.
  J'den sonraki harf ancak sıradaki şıksa şık sayılır: 11. şık `K)` ise "en fazla 10 şık" hatası çıkar.
  Şıkka benzeyen ama tanınmayan satır (`A- şık`, `A: şık`, ilk şıkkı B olan soru) uyarı verir: "7. satır
  şıkka benziyor ama tanınmadı; önceki şıkka eklendi." Metinde 100'den çok soru varsa sonrası alınmaz ve bu
  bildirilir. İlk sorudan önceki satırlar (başlık, yönerge) tek sorunda toplanır; en çok 50 sorun
  listelenir, sonrası "Ve 12 sorun daha." diye özetlenir. Önizleme isteği öğretmen başına 10 dakikada 300.
  **Ekle**'den sonra sorunlu sorular düzenleyicide kırmızı çerçeveyle ve sorunuyla işaretlenir (soru
  numarası düzenleyicideki sıraya çevrilir; soruya yazınca kalkar); bir soruya bağlanmayan sorunlar
  bilgi kutusunda kalır.
- **Önizle:** öğretmen quizi öğrenci gibi görür (soru başına sürede sırayla); tarayıcıda çalışır, hiçbir
  şey kaydedilmez. Kontrol ekranından da açılır.
- **Sınırlar:** en çok 100 soru; soru metni 1000, şık 300, açık uçlu cevap 2000 karakter; resim ve formül
  yok. İstemci ve sunucu aynı sınırları denetler; sınırı aşan metin kırpılmaz, hata verir, hatalı soru
  kırmızı çerçeveyle gösterilir.
- Yeni ödevde quiz ödevle aynı işlemde yazılır: quiz bozuksa ödev de verilmez. **Ödevi düzenle**'de quiz
  değiştiyse önce quiz kaydedilir. Pencere açıkken bir öğrenci başladıysa quiz kaydedilmez (409 kilitli):
  quiz bölümü kilitli çizilir, ödevin ad, açıklama ve tarih değişiklikleri yine kaydedilir ve pencerede
  "Ödevin öbür değişiklikleri kaydedildi; quiz kaydedilemedi: 1 öğrenci başladı; ..." yazar.
- **Kilit:** öğrencilerden biri başladıysa quiz değiştirilemez ve kaldırılamaz ("3 öğrenci başladı; quiz
  artık değiştirilemez."); yalnızca **Önizle** kalır. Denetim quiz satırı kilitlenerek yapılır, aynı anda
  başlayan öğrenciyle yarışmaz.
- Quizi yazmak **Ödev verir**, sonuçları açmak **Ödev sonuçlandırır** yetkisi ister (derse göre daraltılır).

**Çözme (öğrenci).** Ödev penceresinin **Ekler** listesinin başında "Quiz · 10 soru · 20 dk" satırı ve
**Quizi başlat** düğmesi durur. Düğme önce kurallar sayfasını açar (soru sayısı, süre, tek hak, sekme
kaydı, sonucun ne zaman açılacağı); asıl başlatma oradaki **Şimdi başla**'dır. Öğrencinin ödev listesinde
"Quiz: çözmedin", "Quiz: devam ediyor", "Quiz: bitirdin · 2/4 (%50)" yazar.

- **Başlatma şartları** (sunucu denetler): yalnızca ödevin öğrencisi; ödev sonuçlandırılmamış; başlama
  tarihi ve saati geçmiş; son teslim geçmemiş; sonuçlar kalıcı açılmamış (öğretmen **Sonuçları şimdi aç**
  dedi ya da son teslimle açılan sonucu bitiren biri gördü). Başlatamayan öğrenci nedenini
  görür ("Quiz 03.10.2026 09:00 tarihinde açılacak."). Quizi başlatan öğrencinin ödevi "açıldı" sayılır.
- **Tek deneme:** deneme satırının anahtarı (ödev, öğrenci); aynı anda gelen iki "Başlat" tek deneme açar,
  ikinci başlatma süren denemeyi döndürür. İkinci hak verilmez.
- Soru metinleri yalnızca deneme başladıktan sonra gönderilir. **Doğru şık bilgisi** öğrenciye sonuç
  açılana dek hiç gitmez: ne quiz ucunda, ne `/api/progress`'te, ne ödev nesnesinde.
- Çözme ekranı bir **sayfadır** (perdeye tıklayınca kapanan pencere değil): üstte kalan süre (sunucunun
  saatine göre) ve "Soru 3/10". Tek doğrulu soruda radyo düğmesi, birden çok doğrulu soruda kutucuk ve
  "Birden çok şık seçebilirsin." Şık seçilince hemen, açık uçlu cevap yazmayı bırakınca (1,2 sn) ya da
  kutudan çıkınca kaydedilir: "Kaydedildi · 14:03:12"; kaydedilemezse **Tekrar dene**. Sayfa yenilenince
  kaldığı sorudan sürer (sekmenin belleğinde); sekme kapanıp yeniden açılınca ilk boş sorudan.
  Öğretmenin quizi değiştirdiği anda başlatan öğrenciye güncel sorular gider (başlatma, quiz satırının
  kilidini bekler; sorular ondan sonra okunur).
- **Süresiz ve bütün quiz:** sorular arasında serbest gezinme (**Önceki / Sonraki**, soru numaraları) ve
  onaylı **Bitir**. Bütün quizde süre bitince sunucu denemeyi kapatır. Süresiz quizde kapanmasına (son
  teslim + 10 dk) bir saatten az kalınca "kapanmasına" sayacı çıkar.
- **Soru başına:** sorular sırayla gelir, geri dönülmez; öğrenciye yalnızca o anki soru gönderilir.
  **Sonraki soru** (boş geçerken onay sorar), son soruda onaylı **Bitir**; süre dolunca sonraki soruya
  kendiliğinden geçilir. Süre sunucuda işler: bağlantı koparsa durmaz, dönünce süresi geçmiş sorular
  kapanmış olur ve kaldığı sorudan sürer (bir sorunun süresi bitince sonraki soru o anda başlamış sayılır).
- **Gecikme payı 3 sn:** süre bittikten sonraki 3 saniye içinde sunucuya ulaşan cevap kabul edilir.
- Deneme en geç **son teslim + 10 dakikada** biter (son teslimden hemen önce başlayan da bitirebilsin;
  teslim dosyalarındaki pay gibi). Süresi dolan denemeler okunurken ve dakikada bir çalışan `quizTemizle`
  (sunucu/index.js) ile kapanır.
- Ödev **Sonuçlandır** denince quiz kapanır: yeni başlatma olmaz, süren denemeler biter (süresi zaten
  dolmuşsa o anda ve "süre doldu" nedeniyle). Bitiren varsa doğru cevaplar açılmıştır ve bu açılış
  **kalıcıdır**: **Tekrar aç** yalnızca ödevi yeniden açar, quiz bir daha başlatılamaz (quizi çözmemiş
  öğrenci cevapları arkadaşından öğrenmiş olabilir; tek hak kuralı). Tekrar aç önce sorar: "Quizin doğru
  cevapları açıklandığı için quizi çözmemiş 5 öğrenci quizi başlatamaz; yalnızca ödev yeniden açılır."
  Kimse bitirmeden sonuçlandırılan ödevde açılış kalıcı olmaz; tekrar açınca başlamamış öğrenci çözebilir.

**Sekme ya da uygulama değiştirme.** Yalnızca `visibilitychange` dinlenir (`blur` bildirim perdesinde de
tetiklendiği için sayılmaz); 2 saniyeden kısa çıkış sayılmaz. Quiz sürerken sitenin başka bir sayfasına
geçmek (menü, geri tuşu) de çıkıştır: quiz sayfasına dönünce bildirilir (o arada sekme değişirse aynı çıkış
sürer; başka quize dönülürse eskisinin çıkışı yine gider). Dönünce `POST .../quiz/odak {sure, soruId}`
`fetch` `keepalive` ile gider (oturum `Authorization` başlığında taşındığı için `sendBeacon` işe yaramaz);
sekme dışarıdayken kapanırsa o ana kadarki süre `pagehide` ile gider. Sunucu adedi ve toplam saniyeyi
sayar; dışarıda geçen süre denemenin süresini aşamaz. Öğrenci kurallar sayfasında uyarılır, dönünce
"Quizden çıktığın kaydedildi." görür. **Çıkınca o soru kapanır** seçiliyse çıkarken açık olan soru kapanır
("Quizden çıktığın için kapandı"): soru başına sürede sonraki soruya geçilir; serbest modda yalnızca o
soru kapanır, öbürleri sürer, bütün sorular kapanırsa deneme biter. Kapanacak soruyu sunucu seçer: soru
başına sürede kendi kaydından (istemcinin `soruId`'si kullanılmaz; çıkarken açık olan soru dışarıdayken
süresi dolup kapandıysa öğrenci dışarıdayken açılan sonraki soru kapanmaz), serbest modda ekrandaki soru;
`soruId` boş ya da bu quizin sorusu değilse en son cevaplanan açık soru (o da yoksa ilk açık soru).
Algılama tarayıcıda yapılır ve atlatılabilir (değiştirilmiş istemci hiç bildirmeyebilir; ikinci pencere ya
da başka cihaz görünmez; serbest modda cevaplanmış soruya geçip çıkan öğrencinin kapanan sorusu o olur);
kayıt kanıt değil, caydırıcı bir göstergedir. Öğretmenin ayrıntı penceresinde de bu yazar.

**Puan.** Eşit ağırlık; yalnızca Doğru/Yanlış ve çoktan seçmeli sorular. Seçilen şıklar doğru şıklarla
birebir aynıysa puan alınır (kısmi puan yok; fazladan bir yanlış şık puanı sıfırlar); boş soru yanlış
sayılır. **Açık uçlu soru puanlanmaz.** Gösterim: "8/10 (%80) · 2 açık uçlu soru puanlanmaz". Puan yalnızca
**öneridir**: ödevin sonucunu (Yaptı, Eksik...) öğretmen yine kendisi seçer; ödev serisi ve grafikler
yalnızca öğretmenin seçtiği sonucu kullanır.

**Sonucun açılması.** Sonuç yalnızca denemesi bitmiş öğrenciye açılır:

| Seçenek | Ne zaman açılır |
|---|---|
| Son teslimden sonra (varsayılan) | Son teslim + 10 dakika geçince (o ana kadar bütün denemeler biter); son tarihi olmayan ödevde öğretmen açınca. Öğrenciye açılış saati yazılır ("30 Eylül 2026, Çarşamba · 17:10") |
| Hemen | Öğrenci bitirince (erken bitiren cevapları yayabilir; seçenek bunu bilerek seçilir) |
| İkisinde de | Öğretmen **Sonuçları şimdi aç** deyince ya da ödev sonuçlandırılınca |

- Sonuç açılınca öğrenci puanını, kendi cevaplarını, doğru cevapları (yeşil), yanlış seçimlerini
  (kırmızı) ve açık uçlu cevabını görür. Sonuç kapalıyken bitirmiş öğrenciye sorular gönderilmez; ekranda
  ne zaman açılacağı yazar.
- Sonuç açılınca öğrenciye bir kez bildirim gider, velisine kopyası: **"Matematik dersinden "Oran orantı"
  quizinin sonucu açıklandı."**
- **Sonuçları şimdi aç** sonuçları kalıcı açar: başlamamış öğrenci quizi artık başlatamaz, **çözmekte olan
  öğrencinin denemesi o an biter** (bitirenin gördüğü doğru cevapla cevabını düzeltemesin; neden
  `sonuclandi`: "Öğretmen quizi kapattı"). Onay penceresi kaç öğrencinin quizinin biteceğini söyler.
- Son teslimle açılan sonuç, bitirmiş biri doğru cevapları görebildiği an kalıcı olur (öğrenci quize
  bakınca, dakikalık temizlikte ve **Ödevi düzenle** kaydedilmeden önce): son teslim ileri alınsa da
  sonuçlar kapanmaz, quiz yeniden başlatılamaz; öğretmene "Quizin sonuçları açıklandığı için quiz yeniden
  başlatılamaz." yazar. Bitiren yoksa (kimse doğru cevabı görmediyse) kalıcı olmaz, tarih uzatılınca quiz
  yeniden başlatılabilir.
- **Tekrar aç** açıklanmış sonuçları kapatmaz: bitirenler sonucunu görmeye devam eder, quiz yeniden
  başlatılamaz (yukarıda).

**Veli.** Ödev listesinde ve satıra tıklayınca açılan pencerede yalnızca durum (başlamadı, devam ediyor,
bitirdi) ve sonuç açıldıktan sonra puan görür; soruları, cevapları ve sekme kaydını görmez. Öğrencinin
portalından bakan müdür ve öğretmen de `/api/progress` üzerinden yalnızca bu özeti görür.

**Öğretmenin kontrol ekranı** (ödevin sahibi; öğretmeni ayrılmış ödevde müdür). Ekler listesinin başında
"Quiz · 10 soru · 20 dk" satırı: kaç öğrencinin başladığı, sonuçların ne zaman açılacağı; **Önizle**,
**Quizi düzenle**, onaylı **Sonuçları şimdi aç**. Her öğrencinin altında rozet: "Quiz: başlamadı",
"Quiz: devam ediyor", "Quiz: 8/10 · 2 kez çıktı (35 sn)". Rozete tıklayınca ayrıntı açılır: başlama ve
bitiş (nedeniyle), sekme kaydı, her soru, öğrencinin cevabı, doğru cevap, yanlışlar kırmızı, açık uçlu
metin; soru başına sürede her sorunun geçen süresi ve kapanma nedeni (süre doldu, çıkınca kapandı).
Öğrenci hâlâ çözüyorsa boş sorular "Cevaplanmadı" görünür. Ödev listelerinde (öğretmen, müdürün
**Ödevler**'i, öğrenci, veli) başlığın yanında küçük **Quiz** rozeti durur; öğretmenin listesinde ayrıca
"Quiz · 5 soru · 20 dk · 12 öğrenciden 3 kişi bitirdi" yazar.

**Uçlar** (`/api/assignments` altında; ödevler kapalıysa 403 `ozellikKapali`, geçmiş yıla bakan
öğretmenin ve müdürün POST'u 409; öğrenci ödevde değilse 404, ödevde quiz yoksa 404 `quizYok`):

| Uç | Kim | Ne yapar |
|---|---|---|
| `GET /api/assignments/:id/quiz` | ödevin öğrencisi | Durum: `quiz` özeti, `simdi` (sunucu saati), `sonTeslim`, `sonucAcilis` (son teslim + 10 dk; son tarih yoksa ya da "Hemen" seçiliyse `null`), `durum` (`baslamadi`, `devam`, `bitti`), `baslatabilir`, `engel`, `deneme`, `sorular` (doğru bilgisi yok; soru başına sürede yalnızca o anki soru), `sonucAcik`, `sonuc` |
| `POST .../quiz/basla` | ödevin öğrencisi | Başlatır ya da süren denemeyi döndürür; başlatılamazsa 400 `baslatilamaz` (öğrenci başına 10 dakikada 30) |
| `POST .../quiz/cevap {soruId, secilenler, metin}` | ödevin öğrencisi | Cevabı yazar: `{kaydedildi, soruId}`; quiz bittiyse ya da soru kapandıysa 409 `kapandi` ve güncel durum (10 dakikada 600) |
| `POST .../quiz/sonraki {soruId}` | ödevin öğrencisi | Soru başına sürede sonraki soru (son soruda deneme biter) |
| `POST .../quiz/bitir` | ödevin öğrencisi | Denemeyi bitirir, puanı hesaplar |
| `POST .../quiz/odak {sure, soruId}` | ödevin öğrencisi | Sekmeden, uygulamadan ya da quiz sayfasından çıkış: `cikisSayildi`, `kapananSoru` (kapanacak soruyu sunucu seçer; 10 dakikada 120) |
| `GET /api/assignments/:id/quiz` | ödevin sahibi (sahipsiz ödevde müdür) | Quizin tamamı doğrularıyla, `baslayan`, `biten`, `kilitli`, `sonucAcik`, `sonucAcildi` (kalıcı açık); düzenleyiciye olduğu gibi yüklenir |
| `POST /api/assignments/:id/quiz {quiz}` | ödevin sahibi, Ödev verir | Quizi yazar, `{quiz: null}` kaldırır; öğrenci başladıysa 409 `kilitli` |
| `GET .../quiz/ayrinti?ogrenci=` | ödevin sahibi | Bir öğrencinin cevapları, doğrular, `dogruMu`, `gecenSn`, `kapandi`, deneme ve sekme kaydı |
| `POST .../quiz/sonuc-ac` | ödevin sahibi, Ödev sonuçlandırır | Sonuçları şimdi açar, süren denemeleri bitirir (`biten`), bildirimleri gönderir (`bildirilen`) |
| `POST /api/assignments/quiz-metin {metin}` | öğretmen, müdür | Yapıştırılan metnin önizlemesi: `{sorular, hatalar}` (en çok 300.000 karakter; en çok 50 sorun + özet; kişi başına 10 dakikada 300) |

Var olan uçlara eklenenler: `POST /api/assignments` gövdesinde isteğe bağlı `quiz`; `GET /api/assignments`
ve müdürün `GET /api/school/assignments` listelerinde `quiz` rozeti (soru sayısı, süre, başlayan, biten);
`GET /api/assignments/:id` cevabında `quiz` ve `students[].quiz`; `POST /:id/finish` cevabında
`quizBildirilen`; `GET /api/progress`'te `assignments[].quiz` (durum; puan yalnızca sonuç açılınca).

**Tablolar** (şema 029): `quizler` (`odev_id` anahtar: ödev başına tek quiz; süre türü, bütün quiz süresi,
çıkınca kapanır, sonuç görünümü, `sonuc_acildi`), `quiz_sorulari` (sıra ödev içinde tekil; tür `dy`,
`coktan`, `acik`; metin; soru süresi), `quiz_secenekleri` (metin, `dogru`), `quiz_denemeleri` (anahtar
ödev + öğrenci, yani tek deneme; başlama, bitiş ve nedeni, şu anki soru ve başladığı an, çıkış sayısı ve
saniyesi, doğru ve puanlı soru sayısı, `sonuc_bildirildi`), `quiz_cevaplari` (anahtar ödev + öğrenci +
soru; seçilen şık kimlikleri, açık uçlu metin, kayıt anı, soru başına sürede açılış ve kapanış, kapanma
nedeni `sure`, `cikis`, `gecildi`). Deneme ve cevaplar `odev_ogrencileri`'ne bileşik yabancı anahtarla
bağlıdır (teslim dosyaları gibi): ödevde olmayan öğrencinin satırı yazılamaz; hepsi ödeve CASCADE bağlıdır.
Doğru şıklar ödev nesnesine (`depo.odevler`) girmez. Quiz yedeğe girer (`quizler`, `quizDenemeleri`);
eski yedeklerde bu anahtarlar yoksa boş sayılır.

Kod: `sunucu/bolumler/quiz.js` (yönlendirme `odev.js`'de: öğrenci uçları rol kapısından önce, öğretmen
uçları sahip denetiminden sonra), saf işlevler `sunucu/yardimci/quiz.js` (yapıştırma ayrıştırıcısı,
doğrulama, puan, süre), depo `sunucu/veri/depo/quiz.js`; ön yüz `public/js/parcalar/14c-quiz.js` ve
`public/css/parcalar/35-quiz.css`. Testleri `testler/test-quiz.js` ve sunucusuz `testler/test-quiz-metin.js`.

### Müdürün ödev görünümü

Müdür ödev vermez — **Ödevler** sayfasında derse göre bakar. Her ders bloğunda
sınıf, ders adı, dersin öğretmeni ve haftalık saati yazar; altında o derse
verilmiş ödevler sıralanır: **kim verdi**, kaç öğrenciye, son teslim ne zaman,
açıklaması ne.

Üstteki sınıf seçiciyle tek sınıfa daraltılır. Quizli ödevin adının yanında **Quiz** rozeti durur;
quizin cevaplarını müdür yalnızca öğretmeni ayrılmış (sahipsiz) ödevin kontrol ekranında görür.

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

1. Öğrenci **Ayarlar** sayfasında **veli kodunu** görür (örn. `Ab3#-kQx9-+mPt-7?zR`):
   16 karakter, 4'erli gruplar hâlinde, tireli (biçimi yukarıda, "Kişi kodu"). Okul da kodu
   giriş kâğıdına yazdırır. Yanındaki **Kopyala** kodu tireli panoya alır.
2. Veli kendi hesabını açar ve kodu sağ üstteki **+ Ekle → Veli**'ye (veli olduktan sonra
   **Çocuklarım → Çocuk ekle**'ye de) yazar. **Büyük/küçük harf fark eder**; tireler kutuda
   kendiliğinden gelir, tireli ya da boşluklu yapıştırılsa da olur. Onay beklenmez: çocuk
   hemen bağlanır, öğrenciye bildirim gider. Kod kullanılınca değişmez: anne ve baba aynı
   kodla ayrı ayrı ekleyebilir.
3. Çocuk menüde *Veli · çocuğun adı* portalı olur; yetişkin hesabındayken yeni çocuğun portalı
   hemen açılır. **Çocuklarım**'da çocuğun kartına tıklayınca doğrudan onun portalı açılır:
   ilerleyiş, ödevler, sınavlar, başarılar.

Kod olmadan kimse başkasının çocuğunu göremez. Veli kodu dışında okul da veliyi
bağlayabilir: öğrencinin **Hesap** penceresinde **Veliler** bölümünden velinin T.C.
kimlik no'su ya da kullanıcı adıyla bulup bağlar, gerekirse kaldırır.

## Eğitim Evi telefon uygulaması

Android uygulaması ayrı depodadır:
[KARANKOYU/Egitim-Evi-App](https://github.com/KARANKOYU/Egitim-Evi-App). İki kuşağı var:

- **Bugün yayımda olan: Eğitim Evi Aile (1.0.x).** Yalnızca çocuğun telefonu içindir (aşağıda).
  Kullandığı uçlar (`/api/aile/cihaz/*`, `X-Aile-Cihaz`) **aynen duruyor**; kurulu 1.0.x
  uygulamalar hiçbir şey yapmadan çalışmaya devam eder.
- **Hazırlanıyor, henüz yayımlanmadı: tek uygulama "Eğitim Evi".** Müdür, öğretmen, veli, öğrenci
  ve servisçi aynı uygulamaya girer. Uygulama **yereldir (native)**: siteyi içinde açmaz (WebView
  değil), ekranlarını kendisi çizer ve sunucunun JSON uçlarını kullanır (yoklama, sıra, not uçlarının
  cevapları bu yüzden ekrandan bağımsız ve eksiksizdir). Sitede uygulamaya özel köprü yoktur; servisçi
  tarayıcıdan girerse konum bugünkü gibi sayfa açıkken gider.

Sunucu tarafı yeni uygulama için hazır:

- **Uygulama oturumu 30 gün.** `POST /api/login` (ya da `/api/login/dogrula`) gövdesinde
  `uygulama: true` gelirse açılan oturum 30 gün geçerlidir; tarayıcıdaki oturum 7 gün kalır. İkisi de
  mutlak süredir (kullandıkça uzamaz). Bayrak kod doğrulama adımına ve "kodu yeniden gönder"e taşınır,
  portal değiştirince (okul rolüne geçiş, okuldan ayrılma) yeni oturum da uygulama oturumu olur ve eskisinin
  açılış anını devralır: portal değiştirerek oturumun süresi uzatılamaz.
  Çıkışta, şifre değişince ve hesap silinince bu oturumlar da kapanır. Sütun: `oturumlar.uygulama`.
- **Cihaz anahtarı.** Uygulama girişten sonra oturumla `POST /api/cihaz {ad, platform, surum}` çağırır;
  64 hex'lik anahtar **bir kez** döner (`{cihazAnahtari, cihazId}`), sunucuda yalnızca SHA-256 özeti
  tutulur. Anahtarın sahibi yetişkinin ana hesabıdır (okul rolleri onun altında) ya da öğrenci /
  servisçi hesabıdır; hesap başına en çok 5 anahtar (fazlası en eskiyi siler), saatte en çok 20 yeni
  anahtar. Anahtar yalnızca bildirim yoklamaya ve servisçinin sefer konumunu göndermeye yarar;
  **hesaba giriş vermez** (Bearer yerine kullanılamaz, `/api/me` 401 döner).
- **Anahtarla uçlar** (`X-Cihaz: <64 hex>` başlığı; oturum kapılarından önce yönlendirilir):
  - `GET /api/cihaz/bildirimler[?son=<imleç>]` → `{bildirimler: [{id, metin, baglanti, zaman}], imlec,
    servisSaatleri}` (yukarıda "Telefon bildirimi (Web Push)" altındaki kurallar).
  - `GET /api/cihaz/ayar` → `{rol, servisci, acikSefer: {id, servisId, yon} | null, servisSaatleri}`.
  - `POST /api/cihaz/servis-konum {seferId, enlem, boylam, dogruluk}` → yalnızca servisçi ve seferin
    sahibi; `/api/servis/konum` ile aynı iş (yaklaşma bildirimleri dahil). Sefer yoksa 404, bitmiş,
    başkasının ya da servis saati (uzatmasıyla) bitmişse 409; hesap servisçi değilse ya da servis okulda
    kapalıysa 403 (`ozellikKapali: 'servis'`). Uygulama 409, 404, 401 ve 403'te gönderimi durdurur.
  - `POST /api/cihaz/sil` (gövdesiz) → bu anahtar iptal.
  - Hız: konum anahtar başına dakikada 60, öteki uçlar saatte 240. Tanınmayan anahtar 401. Hesap
    onaylı değilse ya da aydınlatma metninin güncel sürümünü onaylamamışsa anahtar **silinir** ve 403
    (`anahtarGecersiz: true`) döner; uygulama anahtarı unutur, onaydan sonra yenisini alır.
- **Oturumla uçlar:** `GET /api/cihaz` (hesabın telefonları: ad, platform, sürüm, alınma ve son
  görülme), `POST /api/cihaz/sil {id}` ya da `{cihazAnahtari}` (bulunamazsa 404). Telefonda çıkışta
  uygulama önce anahtarını siler, sonra `/api/logout` der. Şifre değişince (kişinin kendisi, okul
  yönetimi ya da şifre sıfırlama) hesabın bütün anahtarları da silinir.
- Tablo `cihaz_anahtarlari` (şema 028); bölüm `sunucu/bolumler/cihaz.js`, depo `depo/cihazlar.js`.
  Geçici veridir: yedeğe girmez; geri yüklemede sahibi hâlâ varsa korunur (push abonelikleri gibi).

### Çocuğun telefonu (Eğitim Evi Aile)

Çocuğun telefonuna kurulur, **velinin seçtiği aralıkla** telefonun konumunu ve **uygulama
uygulama ekran süresini** gönderir. Veli bunları sitede **Çocuğumun telefonu** sayfasında
görür. Uygulama hiçbir uygulamayı kapatmaz ya da kilitlemez; **sınır geçilince veliye
bildirim** gider (günde bir kez).

- **Bağlama:** uygulamada çocuğun **öğrenci hesabıyla** giriş yapılır; çocuk paylaşımı
  kendisi onaylar. Sunucu telefona yalnızca konum ve süre göndermeye yarayan bir
  **cihaz anahtarı** verir (hesaba giriş vermez; veritabanında özeti tutulur); öğrencinin
  oturumu telefonda kalmaz. Öğrenci başına en fazla 3 telefon. Velilere "telefonunu bağladı"
  bildirimi gider.
- **İzinler (uygulama sırayla ister):** Konum — **Her zaman izin ver** (uygulama kapalıyken
  de), **Kullanım erişimi** (ekran süresi), **Bildirimler**, **arka planda çalışma**
  (uygulama kendi ayar sayfasını açar, öğrenci Pil > **Kısıtlamasız**'ı seçer; doğrudan
  "muaf tut" penceresi Play Store kuralına takıldığı için kullanılmaz). Uygulamanın verisi
  buluta yedeklenmez ve yeni telefona taşınmaz; yeni telefonda yeniden bağlanılır. Yayın
  paketi yalnızca HTTPS ile bağlanır (http yalnızca deneme paketinde, yerel ağda).
  Android, arka planda konum alan uygulamanın bildirim çubuğunda
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
şoför ve rehber personel (adı, telefonu), sabah/akşam kalkış saati (yalnızca bilgi; hiçbir şeyi
kısıtlamaz), güzergâh; öğrencileri durağıyla servise yazar. Bir öğrenci tek serviste olur
(başkasına yazılınca taşınır). Öğrenci **Servisim** sayfasında kendi servisini, veli çocuğununkini
görür; şoför telefonu yalnızca o servisteki öğrenciye, velisine ve yönetime gider. Servis bilgi
kartı (ad, plaka, şoför, telefon, durak) her zaman görünür; canlı bilgiler (aracın yeri, bugünkü
durum, sıra) yalnızca okulun **servis saatlerinde** (aşağıda "Servis yoklaması").

**Servis haritası ve canlı konum:**

- Haritanın üstünde üç düğme: **Okula git**, **Eve git**, **Servisi takip et** (açıkken araç
  her yenilenişte haritanın ortasında kalır). Okulun yerini müdür ya da **Okulun haritadaki
  yerini ayarlar** yetkisi verilen kişi (hazır şablon **Kodlayıcı**'da açık) **Okulun Konumu**
  sayfasından seçer; okulun giriş adresini yine yalnızca müdür değiştirir.

- **Servisçi** telefonundan okulun adresine girer; ana sayfası **Yoklama**'dır (eski
  "Seferlerim" buna katıldı). Sefer yalnızca okulun servis saatlerinde başlar, yönünü saat
  belirler: sabah okula gidiş, akşam eve dönüş. Sabah **Seferi başlat** ya da ilk "Bindi",
  akşam **Başlat** seferi açar. Telefonun konumu birkaç saniyede bir (araç dururken 20 saniyede
  bir) gönderilir; ekran kararmasın diye ekran kilidi tutulur. Sabah **Okula vardık**, akşam son
  öğrencinin "İndi"si seferi bitirir (**Seferi bitir** düğmesi de var). Servis saati bitince yoldaki
  sefer en çok 60 dakika daha sürer, sonra kapanır. Servis başka servisçiye verilirse ya da
  servisçi hesabı silinirse açık sefer kapanır. 45 dakika konum gelmeyen sefer kendiliğinden
  kapanır; seferler 30 gün sonra silinir.
- **Öğrenci ve velisi** haritada okulu, evi ve (sefer sürerken) aracı görür; sefer varken 5
  saniyede, servis saatinde 30 saniyede, saat dışında 2 dakikada bir yenilenir; "eve yaklaşık
  1,2 km" ve "5. sırada, önünde 2 öğrenci" yazar. Aracın yeri yalnızca süren seferde ve son 3
  dakikada geldiyse gösterilir; servis saati (ve 60 dakikalık uzatma) dışında harita ucu sefer ve konum döndürmez
  ("Aracın yeri yalnız servis saatlerinde görünür"). Geçmiş iz saklanmaz, yalnızca son konum.
- **Ev konumu:** öğrenci, velisi ya da okul yönetimi haritaya dokunarak (ya da "Bulunduğum
  yeri kullan") işaretler. Servisçi evin yerini görür (yol tarifi bağlantısı) ama değiştiremez.
- **Yaklaşma bildirimi:** servis eve **500 m** ve **100 m** kala öğrenciye ve velilerine
  birer kez bildirim gider (her sefer için). GPS doğruluğu 150 m'den kötüyse gitmez. Sabah
  yalnızca henüz "Bindi" / "Binmedi" işaretlenmemiş ve velisi "binmeyecek" dememiş öğrenciye,
  akşam yalnızca okulda "Geldi" işaretlenip henüz inmemiş öğrenciye gider.
- Harita dış kütüphane kullanmaz: OpenStreetMap döşemeleri kendi küçük bileşenimizle
  çizilir (sürükleme, iki parmakla ve tekerlekle yakınlaştırma, klavye). Her konumun
  yanında **Google Haritalar'da aç** bağlantısı vardır.
- Konum yalnızca **HTTPS**'te (ya da localhost'ta) alınabilir ve tarayıcı arka planda
  konum vermez: sitede servisçi Yoklama sayfasını açık tutmalıdır (yoklama https olmadan da
  alınır, yalnızca konum gitmez). Hazırlanan telefon uygulaması sefer sürerken konumu
  arka planda da gönderecek (`POST /api/cihaz/servis-konum`, yukarıda "Eğitim Evi telefon uygulaması").

**Kulüpler:** Müdür (ya da kulüp yetkisi olan) kulüp açar: danışman öğretmen,
kontenjan, gün ve saat, başvurunun açık olup olmadığı. Öğrenci başvurusu açık kulübe
kendisi katılır ya da ayrılır; başvuru kapalıyken yalnızca danışman ve yönetim üye
ekleyip çıkarır. Kontenjan, kulüp satırı kilitlenerek denetlenir: aynı anda gelen iki
istek son boş yeri ikisine birden vermez. Üye listesini yalnızca danışman ve yönetim
görür; veli çocuğunun kulüplerini görür.

---

## Servis yoklaması

Servisçinin günlük yoklaması, öğretmenin ders yoklaması gibi: veli çocuğunun servise
bindiğini, okula vardığını ve eve bırakıldığını anında öğrenir.

**Servis saatleri.** Okulun iki aralığı vardır: sabah (evden okula) ve akşam (okuldan eve).
Müdür ya da servis yetkisi olan kişi **Servisler** sayfasındaki **Servis saatleri** kartından
seçer; varsayılan **07:00–09:20** ve **16:30–19:00**.

- Kurallar: saat `SS:DD` (`7:00` yazılırsa `07:00` olur), bitiş başlangıçtan sonra, her aralık en
  az 30 dakika, sabah aralığı akşam aralığı başlamadan biter (ikisi de gece yarısını geçmez).
- Her gün geçerlidir (hafta sonu ya da tatil ayrımı yok). Saatler **Türkiye saatidir**; sunucunun
  saat dilimi ne olursa olsun doğru çalışır. Bitiş dakikası dahildir (09:20'nin sonuna kadar açık).
- Değişiklik işlem kaydına "Servis saatleri değişti" diye yazılır.
- Veli ve öğrenci servis bilgi kartını her zaman görür; aracın yeri, bugünkü durum ve sıra yalnızca
  aralık içinde ya da sefer sürerken gelir. Aralık dışında kart "Servisin yeri, sırası ve bugünkü
  durumu yalnız servis saatlerinde görünür" yazar ve sıradaki aralığı gösterir.
- Servisçi yoklamayı ve seferi yalnızca aralıkta açar. Aralık bitince başlamış sefer **60 dakika**
  daha sürer (trafik); bu sürede o seferin işaretleri de konur. Sonra sefer kapanır. Sefer yalnız
  o günün kendi aralığında başladıysa sürer: saatler sonradan değişirse yeni aralığın dışında
  başlamış sefer hemen kapanır (haritada görünmez, konum 409).
- Saf hesap `sunucu/yardimci/servis-pencere.js` (`servisPenceresi(okul, simdi)` → dönem, aralık,
  uzatma, sonraki aralık); sunucusuz testi `testler/test-servis-pencere.js`.

**Servisçinin Yoklama sayfası.** Servisçinin menüsü: **Yoklama** (ana sayfa), Mesajlar, Takvim,
Hatırlatıcılar. Birden çok servisi olana üstte servis seçici çıkar. Dönemi sunucu belirler
(telefonun saatine güvenilmez). Aralık dışında "Yoklama sabah 07:00–09:20 ve akşam 16:30–19:00
arasında açılır." yazar; altında sıradaki aralığın listesi ve velilerin işaretleri salt okunur durur.

- **Sabah:** üstte **Seferi başlat** (konum paylaşımı; basılmazsa ilk "Bindi" seferi kendiliğinden
  başlatır). Sırayla her öğrencide büyük **Bindi / Binmedi** düğmeleri, evi işaretliyse **Yol tarifi**,
  velinin işareti ve notu. En altta **Okula vardık**: sefer biter, "Bindi" işaretli öğrencilerin
  velilerine "okula vardı" gider. Bindi ve Binmedi okula varılana kadar değiştirilebilir.
- **Akşam:** önce okulda her öğrenciye **Geldi / Gelmedi**, sonra **Başlat** (sefer başlar;
  işaretlenmemiş öğrenci varsa adlarıyla sorar). Ardından "Geldi" olanlar bırakma sırasıyla
  listelenir, her birinde **İndi**. Unutulan öğrenci "Serviste olmayanlar" kartından sonradan
  "Geldi" yapılabilir. "Başlat"tan önce "İndi" konmaz; "İndi" konan öğrencinin işareti artık
  değişmez. Servise binen herkes inince sefer kendiliğinden biter ("Herkes eve bırakıldı; sefer bitti.");
  serviste kalan son öğrenci "Gelmedi"ye çevrilirse de biter ("Serviste öğrenci kalmadı; sefer bitti.").
  "Geldi" işaretli öğrenci yokken "Başlat" sorar; o sefer kendiliğinden bitmez, **Seferi bitir** ile kapanır.
- Her işaret **anında**, tek istekle sunucuya gider; gönderilemezse satırda **Yeniden dene** çıkar.
  Aynı anda gelen ilk "Bindi"ler ya da iki "Başlat" tek sefer açar (servis satırı kilitlenir); veliye
  bildirim bir kez gider, önceki deneme yarıda kaldıysa "Yeniden dene" bildirimi de gönderir.
  Dönem değiştiyse (ör. sabah aralığı bitti) sayfa sunucudan yeniden çizilir.
- Velisi "binmeyecek" dediği öğrencinin satırı soluktur ve "Velisi: bugün binmeyecek" yazar;
  servisçi yine de işaretleyebilir.
- **Sırayı düzenle:** sabah (alma) ve akşam (bırakma) sırası ayrıdır; öğrenci ok düğmeleriyle
  yukarı ya da aşağı taşınır, **Kaydet** (dış kütüphane yok). Okul yeni öğrenci ekleyince sıranın
  sonuna gelir; başka servise taşınan öğrenci orada sona geçer; yalnızca durağı değişirse sırası
  korunur. 028 şema dosyası mevcut öğrencilere ad sırasıyla numara verdi.
- **Not yaz:** öğrenciye ya da bütün servise, bugünden 7 gün sonrasına kadar bir gün için en çok
  200 harf ("Yarın 07:35'te hazır ol"). İlgili velilere "Servisçiden not: ..." bildirimi gider
  (kardeşlerin velisine tek bildirim). Not silinebilir.
- Sayfadaki harita: okul, evi işaretli öğrenciler (sıra numarasıyla), sefer sürerken servisçinin
  yeri. Sayfa açıkken dakikada bir kendiliğinden tazelenir.

**Veli ve öğrenci.** Servis kartında "Bu sabah" / "Bu akşam" başlığıyla bugünkü durum ("Bindi
07:42", "Okula vardı 08:05", "Okuldan servise bindi 16:40", "Eve bırakıldı 17:10", "Bu sabah
binmedi"), sıra ("Zeynep 5. sırada, önünde 2 öğrenci kaldı"), servisçinin notları ve "binmeyecek"
işaretleri. Haritanın durum satırında da sıra yazar.

- **Önünde N öğrenci:** sabah, sırada önde olup henüz işaretlenmemiş ve velisi "binmeyecek"
  dememiş öğrenciler; akşam, sırada önde olup okulda "Geldi" işaretlenmiş ve henüz inmemiş öğrenciler.
- **Binmeyecek** (yalnızca veli): gün (bugün ile 7 gün sonrası), **Sabah / Akşam / İkisi** ve isteğe
  bağlı kısa not; **İşareti kaldır** ile geri alınır. Çocuğun o dönemdeki yoklaması işaretlenince
  değiştirilemez. Servisçiye bildirim gider ("Zeynep Şahin yarın sabah servise binmeyecek. Velinin
  notu: ..."). Öğrenci notları ve işaretleri görür, işaretleyemez.
- Bildirimden gelen velide `#/servis?c=<çocuk>` o çocuğun haritasını açar.

**Veliye giden bildirimler** (yalnızca velilere, öğrenciye gitmez; saat Türkiye saatiyle; bağlantı
`#/servis?c=<öğrenci>`):

| Olay | Bildirim |
|---|---|
| Sabah Bindi | "Zeynep 07:42'de servise bindi." |
| Sabah Binmedi | "Zeynep bu sabah servise binmedi." |
| Okula vardık | "Zeynep 08:05'te okula vardı." (yalnızca "Bindi" işaretliler) |
| Akşam Geldi | "Zeynep 16:40'ta okuldan servise bindi." |
| Akşam Gelmedi | "Zeynep akşam servise gelmedi." |
| İndi | "Zeynep 17:10'da eve bırakıldı." |
| Servisçinin notu | "Servisçiden not: Yarın 07:35'te hazır ol" |

- Bildirimde öğrencinin yalnızca adı yazar (soyadı yok); saatin eki okunuşuna göre çekimlenir
  ('de, 'te, 'ta, 'da).
- **Tekrar yok:** her olay (tarih, dönem, öğrenci, olay) için bir kez gider (`servis_olaylari`,
  `INSERT ... ON CONFLICT DO NOTHING RETURNING`). "Bindi" bildirildikten sonra "Binmedi"ye
  çevrilirse bir kez "Düzeltme: Zeynep bu sabah servise binmedi." gider (akşam "Geldi" → "Gelmedi"
  de öyle). Aynı olay ikinci kez hiç gitmez.
- Veli o dönem için "binmeyecek" dediyse "binmedi" / "gelmedi" bildirimi gitmez (önce "bindi"
  bildirilmişse yalnızca düzeltme gider).
- Web Push'ta ve telefon uygulamasının bildirim yoklamasında da aynı metin kullanılır.

**Okul yönetimi.** Servisler sayfasında **Servis saatleri** kartı ve her serviste **Bugünkü
yoklama** düğmesi: salt okunur pencere (sayılar, seferin başlama ve okula varış saati, öğrenci
satırları, velilerin işaretleri, servisçinin notları). Geçmiş günler ekranda gösterilmez.

**Saklama ve temizlik.** `servisTemizle` (sunucu/index.js, 10 dakikada bir; servis saatleri
kaydedilince de) 45 dakikadır konum gelmeyen, saat aralığıyla 60 dakikalık uzatması biten ve kendi
aralığının dışında başlamış seferleri kapatır; 30 günü geçen yoklama, sefer günleri, bildirim işaretleri, notlar ve "binmeyecek" işaretleri
silinir. Bunlar geçici veridir, yedeğe girmez; servis saatleri ve sıra yedeğe girer.

**Uçlar** (`/api/servis`, okul servisi kapattıysa 403 `ozellikKapali`):

| Uç | Kim | Ne yapar |
|---|---|---|
| `GET /api/servis` | öğrenci, veli, okul personeli, servisçi | Servis bilgisi; öğrencide `benim.bugun`, velide `cocuklar[].bugun`, yönetimde `servisler` (sıralarıyla), `saatler`, `saatDuzenleyebilir` |
| `GET /api/servis/harita?ogrenci=` | öğrenci, bağlı veli, servis yönetimi, o servisin servisçisi | Okul, ev, servis, süren sefer ve `bugun` (servis saati ve 60 dakikalık uzatması dışında sefer ve konum yok) |
| `GET /api/servis/yoklama[?servisId=]` | servisçi (kendi servisleri), servis yönetimi (salt okunur) | Dönem, aralık, sonraki aralık, sıradaki öğrenciler (durum, saatler, ev, veli işareti), sayılar, sefer, notlar, "binmeyecek"ler |
| `POST /api/servis/yoklama {servisId, ogrenciId, durum, donem?}` | servisçi | Tek işaret; 409 `aralikDisi`, `kapandi`, `donemDegisti`, `baslamadi` |
| `POST /api/servis/okula-vardik {servisId}` | servisçi | Sabah seferi biter, "okula vardı" bildirimleri (bir kez) |
| `POST /api/servis/sefer-basla {servisId}` | servisçi | Sefer yalnızca aralıkta; yön dönemden gelir; süren sefer varsa o döner |
| `POST /api/servis/konum`, `/sefer-bitir` | servisçi | Tarayıcının sefer konumu (dakikada 60) ve seferi bitirme |
| `POST /api/servis/sira {servisId, donem, sira: [ogrenciId...]}` | servisçi | Liste servisin öğrencileriyle birebir aynı olmalı |
| `POST /api/servis/not {servisId, ogrenciId?, tarih?, metin}` | servisçi | Not (saatte 60) |
| `POST /api/servis/not-sil {id}` | servisçi | Kendi servisinin notunu siler |
| `POST /api/servis/binmeyecek {ogrenciId, tarih?, sabah, aksam, not?}` | bağlı veli | İşaret; ikisi de `false` ise kalkar (saatte 60) |
| `POST /api/servis/saatler {sabahBas, sabahBit, aksamBas, aksamBit}` | müdür, servis yetkilisi | Servis saatleri |

`GET /api/servis/seferim` eski servisçi ekranının ucudur; sunucuda duruyor, yalnızca süren seferi
gösterir, site artık kullanmıyor.

**Tablolar** (şema 028): `okullar.servis_sabah_bas/_bit`, `servis_aksam_bas/_bit` (`SS:DD`, CHECK);
`servis_ogrencileri.sira_sabah`, `sira_aksam`; `servis_yoklamalari` (PK tarih, dönem, öğrenci; durum,
binme ve inme anı, işaretleyen), `servis_gunleri` (servisin o günkü seferinin başlama ve bitiş anı),
`servis_olaylari` (bildirim tekilliği), `servis_notlari`, `servis_binmeyecek`. Kod:
`sunucu/bolumler/okul-hayati.js`, `sunucu/veri/depo/servis-yoklama.js`; ön yüz
`public/js/parcalar/19i-servis-yoklama.js`. Testleri `testler/test-servis-yoklama.js`,
`testler/test-servis-pencere.js`, `testler/test-servis-konum.js`.

---

## Müdür yetkileri

Müdür, öğretmenin yapabildiği **her şeyi** yapabilir (ödev verme, sınav açma, not girme)
ve ek olarak:

- Öğretmeni kişi koduyla okula ekler (**Öğretmenler → Kodla ekle**), branşını düzenler,
  okuldan çıkarır
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

- 75 tablo (`sema_surumleri` dahil); başlıcaları: okullar, eğitim yılları, sınıflar, roller
  ve yetkileri, kullanıcılar, veli bağları, dersler, ders programı, ödevler, öğrencileri ve
  teslim dosyaları, ödev quizleri (soru, şık, deneme, cevap), sınav şablonları, sınavlar, ölçümler ve değerler, devamsızlık, etütler,
  mesajlar, alıcıları ve okunmaları, anketler (seçenek, hedef, oy), yemek listesi, servisler,
  öğrencileri ve seferleri, servis yoklaması, notları ve "binmeyecek" işaretleri, kulüpler ve
  üyeleri, takvim, hatırlatıcılar, bildirimler, oturumlar, telefon bildirimi abonelikleri ve
  cihaz anahtarları, Eğitim Evi Aile, işlem kaydı, site ayarları ve yönetim paneli çerezleri.
- Yabancı anahtarlar uygulamanın silme kuralını taşır: sınıf silinince dersleri ve
  programı gider (CASCADE), öğrenciler sınıfsız kalır (SET NULL).
- CHECK kısıtları geçersiz veriyi veritabanı katında da durdurur (telefon biçimi, puan
  aralığı, ödev sonucu türü...).
- Sorgular yalnızca `$1, $2` parametreleriyle yazılır; kullanıcıdan gelen değer SQL
  metnine karışmaz. `testler/sql-denetimi.js` bunu her çalıştırmada denetler.
- Toplu işler (Excel ile 300 hesap açma, yoklama, mesaj alıcıları) tek işlemde
  (transaction): yarıda hata olursa hiçbiri yazılmaz.
- Oturum anahtarının kendisi değil SHA-256 özeti saklanır: veritabanı sızsa bile
  açık oturumlar kullanılamaz. Telefon uygulamasının cihaz anahtarı ve yönetim paneli çerezi
  de öyle.
- Uygulama `postgres` süper kullanıcısıyla değil, yalnızca kendi veritabanına yetkili
  `egitimevi` kullanıcısıyla bağlanır.
- **Eski `data/db.json`** varsa ilk açılışta tek işlemde veritabanına aktarılır ve
  `db.json.tasindi` adıyla saklanır.
- **Yedek:** yönetim panelinde **Yedekleme** (günlük otomatik, 14 tane saklanır; en yeniler
  kalır). Adlar: `yedek-2026-09-26_0300.json` (otomatik), `yedek-elle-…` (elle alınan),
  `yedek-geri-alma-…` (geri yüklemeden hemen önceki hâl). Yedek elle okunabilir
  JSON'dur. Geri yüklemeden sonra oturumu yedekte de olan yöneticinin `/admin` çerezi korunur,
  sayfa yenilenir; oturumu yedekte yoksa (yedek o girişten önce alınmışsa) giriş sayfası açılır. Sunucuda bunun yanında
  günlük `pg_dump` alınır (belge/SUNUCUYA-KURULUM.md).
- **Ödev dosyaları** JSON yedeğe girmez (yalnızca bilgileri girer): dosyaların kendisi
  `data/dosyalar/` klasöründedir, sunucu yedeğinde bu klasör de alınmalı.
- **Site ayarları** (panelden kaydedilenler) JSON yedeğe girmez; yedekten geri yüklemede
  olduğu gibi kalır. `pg_dump` onları da alır.

Şifreler `scrypt` ile şifrelenmiş olarak saklanır — düz metin şifre hiçbir yerde tutulmaz
ve sunucudan dışarı çıkmaz.

**Sunucudaki korumalar:**

| Koruma | Ne yapar |
|---|---|
| Kaba kuvvet kilidi | Asıl koruma hesapta: 5 hatalı giriş sonrası o hesap o bağlantıdan 15 dakika kilitlenir (e-posta ile kullanıcı adını sırayla denemek kilidi aşmaz); hesaba her yerden 15 dakikada 20 hatalı giriş gelirse hesap, sahibinin son 30 günde girmediği bağlantılardan 15 dakika kilitlenir (birçok IP'den deneme). Sahibinin girdiği bağlantı "tanıdık"tır, bu kilide takılmaz: kullanıcı adını bilen biri başka bağlantılardan 20 yanlış deneyerek öğretmeni okulda ya da evinde dışarıda bırakamaz. Tanıdık bağlantılar bellekte tutulur, sunucu yeniden başlayınca boşalır; o zaman sahibi o bağlantıdan yeniden girene kadar bu kilit her bağlantıya uygulanır (açık oturumu etkilenmez). Kilidi yeni şifre kaldırır: "Şifremi unuttum" ya da e-postası olmayan öğrencide okulun verdiği yeni şifre (tek tek ya da toplu dağıtım). Bağlantı (IP) başına hatalı giriş sınırı 15 dakikada 50, o bağlantıdan girmiş her okul hesabı (öğrenci, servisçi) için 2 fazla, en çok 300 (okulun ağı 300'e çıkar, kimsenin girmediği bağlantı 50'de durur; herkesin kendisi açabildiği yetişkin hesabıyla girmek sınırı büyütmez); 5 dakikada 1200 deneme; 5 dakikada 25 yanlış giriş kodu |
| Genel hız sınırı | Asıl sınır oturumda: oturum başına dakikada 300 API isteği (aşan oturumun istekleri IP sayacına girmez, aynı ağdaki öbürleri etkilenmez). Okul ağından (tek IP) yüzlerce kişi gelebildiği için IP başına dakikada 6000 API ve 15000 dosya isteği (okul fotoğrafları dosya sayılır). 429 cevabındaki `sinir` hangisinin dolduğunu söyler: `oturum`, `ip`, `dosya` |
| Okul ağı (tek IP) | Aynı anda 300 öğrenci tek IP'den girer (NAT); hiçbiri "çok fazla istek" almamalı. Öbür IP sınırları da buna göre: okul adresi sorgusu dakikada 3000, okul fotoğrafı 4000, doğrulama sorusu 10 dakikada 1500, şifremi unuttum 15 dakikada 20 (aynı adrese ayrıca saatte 3). `testler/test-okul-agi.js` ölçer (aşağıda "Yük ve saldırı koruması") |
| Bot doğrulaması | Kayıt formunda toplama sorusu; cevap sunucuda tutulur, tarayıcıya gönderilmez; yalnızca hesap açılınca harcanır |
| Şifre değişimi | Şifre değişince o oturum dışındaki bütün oturumlar kapanır, telefonların cihaz anahtarları silinir |
| T.C. kimlik no | İsteğe bağlı, algoritmayla denetlenir; yalnızca kişinin kendisine gösterilir |
| Veli kodu sınırı | Hesap başına dakikada 5, bağlantı başına saatte 30 yanlış kod — çok hesap açıp denemek de sayılır |
| Kişi kodu sınırı | Müdürün **Kodla ekle**'si kullanıcı başına dakikada 30, yöneticinin **Bul**'u dakikada 30; ikisinde de bağlantı başına saatte 30 yanlış kod. Kod yenileme hesap başına saatte 10. Kod POST gövdesinde gider, adrese ve günlüğe düşmez |
| Oturum ömrü | Tarayıcıdaki oturum 7 gün, telefon uygulamasından açılan (girişte `uygulama: true`) 30 gün sonra kendiliğinden düşer (mutlak süre, kullandıkça uzamaz); eskiler temizlenir |
| Güvenlik başlıkları | CSP, X-Frame-Options, nosniff, Referrer-Policy — XSS ve çerçeveleme engeli |
| Girdi temizliği | Gelen JSON'daki `__proto__` gibi tehlikeli anahtarlar ve NUL karakteri ayıklanır |
| Hata gizliliği | Veritabanı hatasında tablo/kısıt adı istemciye gitmez; ayrıntı yalnızca günlükte |
| Gizli yönetim paneli | `/admin` yalnız yönetici çereziyle açılır, çerezsiz bilinmeyen adresle bayt bayt aynı 404 verir; yönetim ön yüzü herkese giden `app.js`'te yoktur; yönetici uçları yönetici olmayana bilinmeyen API adresi gibi 404 döner (yukarıda "Yönetim paneli") |
| Yavaş bağlantı koruması | Açık tutulan boş bağlantılar 20-30 sn sonra kapatılır (slowloris) |
| Şifre politikası | Yetişkin hesabında en az 8 karakter; büyük ve küçük harf, rakam ve özel karakter zorunlu. Öğrenci ve servisçide en az 8 karakter, harf ve rakam |
| İki adımlı giriş | E-postası olan hesapta her girişte e-posta ile 6 haneli kod — kapatılamaz |
| Dosya yükleme | Gövde okunmadan boyut/tür/kota/boş yer denetimi; 60 sn veri gelmezse kesilir; kişi başına aynı anda 3, saatte 60 yükleme |
| Dosya indirme | Her indirmede yetki; ek olarak (octet-stream, nosniff, sandbox); dosya adları temizlenir |
| Akıllı doğrulama sorusu | Girişte soru **yalnızca hatalı denemeden sonra** çıkar: o hesaba o bağlantıdan bir hata, hesaba her yerden 3 hata ya da o bağlantıdan 15 dakikada 50 hata (o zaman bağlantıdaki herkese). Normal kullanıcı hiç görmez; okulda birkaç kişinin yanlış yazması öbürlerini durdurmaz, en kötü soru çıkar. Soru (toplama) hazır araçları eler ama bir betik onu kolayca çözer: otomatik şifre taramasını soru değil hesap kilitleri ve bağlantının hata sınırı durdurur |
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
> `x-forwarded-for` zincirinde **en sondaki** adres alınır (Caddy'nin eklediği);
> baştakileri ziyaretçi kendisi yazabildiği için onlara güvenilmez.
> **Vekil arkasında değilken açma** — açıkken herkes başlığı uydurup sınırı aşar.

İnternete açılınca uygulama olarak kurma, telefon bildirimi ve servisçinin konum
göndermesi de çalışmaya başlar (üçü de HTTPS istiyor). `site.adres` `https://` ile
başlıyorsa (ya da güvenilen vekil `x-forwarded-proto: https` diyorsa) yönetim paneli çerezi
`Secure` işaretiyle yazılır: tarayıcı onu yalnız https bağlantıda gönderir.

### Yük ve saldırı koruması

Uygulamanın kendi korumaları (vekil olmasa da çalışır). Sayılar okul ağına göre seçildi:
büyük bir okulda 300 öğrenci aynı dakikada, okulun tek IP'sinden (NAT) girer.

| Sınır | Değer | Neden bu kadar |
|---|---|---|
| Oturum başına API | dakikada 300 | Tek kişiyi durduran asıl sınır; aşan oturumun istekleri IP sayacından geri düşülür. IP önce denetlenir: IP sınırı dolunca oturum sayacı açılmaz (uydurma anahtarlarla bellek şişirilemez); sayaç haritası en çok 100.000 kayıt |
| IP başına API | dakikada 6000 | 300 öğrencinin ilk açılışı ~3.100 API isteği (öğrenci başına ~10) |
| IP başına dosya | dakikada 15000 | İlk açılışta öğrenci başına ~24 dosya (sayfa, betik, yazı tipi, servis çalışanı, okul fotoğrafları) |
| Giriş, IP başına | 5 dakikada 1200 deneme; 15 dakikada 50 hata + o bağlantıdan son 30 günde girmiş okul hesabı (öğrenci, servisçi) başına 2, en çok 300; 50 hatadan sonra herkese soru | Okulun ağında yüzlerce öğrenci girer, sınır 300'e çıkar; kimsenin girmediği bağlantıdan şifre taraması 50'de durur. Kendi açılan yetişkin hesapları sayılmaz: tarayan biri hesap açıp girerek sınırını büyütemez |
| Giriş, hesap başına | bağlantıdan 5 hatada kilit; her yerden 3 hatada soru, 20 hatada sahibinin girmediği bağlantılardan kilit (yeni şifreyle kalkar) | Kaba kuvvet hesapta durur, okulun öbür öğrencileri etkilenmez; hedefli kilit sahibini tanıdık bağlantısında dışarıda bırakmaz (tanıdıklar bellekte: sunucu yeniden başlayınca boşalır) |
| Aynı anda süren API isteği | 1000 | 300 kişi aynı saniyede başlayınca ~500 (eskiden 400: 503 veriyordu) |
| Bağlantı | toplam 8192, vekil yokken IP başına 2048 | Tarayıcı başına 6'ya kadar bağlantı: 300 kişi ~1800 (ölçüldü: en çok 1800). Tek IP toplamın dörtte birini tutar, sunucuyu doldurmak için en az 4 adres gerekir (eskiden 256 / 1024). Doğrudan internete açık kurulum önerilmez: Caddy arkasında bu sınır uygulanmaz |

- Olay döngüsü ortalama 150 ms'den fazla gecikirse (sunucu boğuluyor) yeni API istekleri
  `503 Retry-After` ile geri çevrilir, statik dosyalar ve açık işler sürer.
- Gövdesi 30 saniyede gelmeyen istek kesilir (yavaş gönderim saldırısı).
- Dosya yüklemede okul başına aynı anda 20 yükleme ve en düşük hız sınırı.

**Ölçüm** (`testler/test-okul-agi.js`, 300 öğrenci tek IP'den, 30'u önce yanlış şifre; öğrenci
başına tarayıcıda ölçülen istek dizisi: okul adresinden ilk açılış, giriş, ana sayfa, Ödevler,
Program; toplam ~10.300 istek):

| Durum | Eski sınırlar | Yeni sınırlar |
|---|---|---|
| Vekilsiz, 10 sn'ye yayılarak | 5692 bağlantı kesildi (IP başına 256 bağlantı), 73/300 girdi | Hata yok, 300/300 girdi |
| Vekil arkasında, 10 sn'ye yayılarak | 3511 kez 429 (dosya 2400, API 872, okul fotoğrafı 239), 44/300 girdi | 429 yok, 300/300 girdi |
| Vekil arkasında, herkes 1 saniyede | 3572 kez 429, 452 kez 503 (400 süren istek), 0/300 girdi | 429 ve 503 yok, 300/300 girdi (girişlerin %95'i 1,3 sn içinde) |

Aynı pakette tek kötü niyetli kişi yine durur: tek oturumdan sel (dakikada 300'ü aşan
oturum 429 alır, aynı ağdaki öbürleri almaz), tek hesaba şifre denemesi (5. yanlışta kilit;
hesaba başka bağlantıdan da soru sorulur), bir hesaba 5 bağlantıdan 20 yanlış (hesap
tanımadığı bağlantılardan kilitlenir, sahibi okulun ağından girer; müdürün verdiği yeni şifre
kilidi kaldırır), çok hesaba şifre taraması (kimsenin girmediği bağlantı 50 hatada durur;
10 öğrencinin girdiği bağlantıda 50 hatadan sonra soru, 70 hatada durur; kendi açtığı 5 yetişkin
hesabıyla girilen bağlantı yine 50'de durur; okul ağı etkilenmez), oturumsuz sel (IP başına
6000'de durur).
Doğrulama sorusu betikle çözülür; taramayı soru değil bu sayılar durdurur. Tek IP'nin
sınırları okulun bütün kullanıcılarına ortaktır: aynı ağdan biri oturumsuz sel yaparsa ya da
300 hatalı giriş denerse o dakikalarda okulun girişleri de durur; buna karşı önlem vekil ve
CDN'dedir (aşağıda).

Bunlar tek sunucuyu korur; **gerçek DDoS'a** (binlerce makineden trafik) karşı sunucunun
önüne **Cloudflare** (ücretsiz plan) koy: alan adının DNS'ini Cloudflare'e taşı, turuncu
bulutu aç, SSL/TLS "Full (strict)", "Under Attack" modunu gerektiğinde aç. `/api/login`
için hız kuralı koyacaksan geniş tut: okul ağında yüzlerce öğrenci aynı IP'den aynı
dakikada girer, "dakikada 20" gibi dar bir kural bütün okulu durdurur (hatalı denemeleri
uygulama zaten hesap başına sayar). O zaman `vekil.guven: true` ve
`"baslik": "cf-connecting-ip"` yap. Ayrıntı **belge/SUNUCUYA-KURULUM.md**'de.

> **Vekil arkasında `vekil.guven` şart.** Kapalıysa her istek vekilin adresinden
> (`127.0.0.1`) gelmiş görünür: bütün site tek IP sayılır ve yukarıdaki IP sınırları
> 300 kişiye değil **bütün kullanıcılara** birden uygulanır; yoğun saatte herkes "çok fazla
> istek" alır.

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
node araclar/gorsel-veri.js      # çok rollü hesaplar, okul sayfası, etüt, servis, kulüp, anket, quiz
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
├── yapimcilar.json            ← "Yapımcılar" listesi (ad, GitHub kullanıcı adı, katkı); panelde liste kaydedilmemişse bu gösterilir
├── .gitignore                 ← data/ ve gizli dosyalar depoya girmez
│
├── sunucu/                    ← ARKA UÇ
│   ├── index.js               ← giriş noktası: veriyi yükler, HTTP sunucuyu açar
│   ├── api.js                 ← /api yönlendiricisi: isteği ilgili bölüme dağıtır
│   ├── yollar.js              ← klasör yolları, port, dinleme adresi (EE_DATA, PORT, HOST)
│   ├── ortak.js               ← sabitler ve küçük yardımcılar (ders listesi, iller, tarih, temizleme, kişi kodu)
│   ├── ayarlar.js             ← data/ayarlar.json (e-posta, site adresi, ters vekil)
│   ├── yonetici-dosyasi.js    ← data/admins.json: yönetici hesaplarını açar, dosyayı aralıkla yoklar
│   ├── yonetim-cerezi.js      ← gizli yönetim panelinin (/admin) çerezi
│   ├── veri/                  ← VERİ KATMANI (SQL yalnızca burada)
│   │   ├── index.js           ← tek giriş noktası: depo, bildir, açılış, yedek
│   │   ├── baglanti.js        ← bağlantı havuzu, sorgu(), islem() (transaction), hata çevirisi
│   │   ├── sema.js            ← şema dosyalarını sırayla uygular
│   │   ├── sema/001-ilk.sql   ← tablolar, anahtarlar, kısıtlar, indeksler
│   │   ├── sema/002...034     ← sonraki değişiklikler, sırayla (009 okul adresi ve hesaplar,
│   │   │                        010 servis konumu, 011 telefon bildirimi aboneliği,
│   │   │                        012 yetişkin hesabı ve okul rolleri, 013 hazır Öğretmen
│   │   │                        rolü + etütler + mesaj düzeltme, 014 "okul açtı" işareti,
│   │   │                        015 telefon ülke kodu, 016 e-posta onayı, 017 ödev yıldızı,
│   │   │                        018 okul sayfası, 019 yorumlar, 020 ekler, 021 öğrenci
│   │   │                        geçmişi, 022 okul özellikleri, 023 öğretmen yetkileri,
│   │   │                        024 hatırlatıcılar, 025 ödev başlama saati, 026 Eğitim Evi
│   │   │                        Aile, 027 kişi kodu ve müdür başvurusunun kalkması, 028 servis
│   │   │                        yoklaması, servis saatleri, cihaz anahtarı, uygulama oturumu,
│   │   │                        029 ödevin quizi: sorular, şıklar, denemeler, cevaplar,
│   │   │                        030 site ayarları ve yönetim paneli çerezleri, 031 aynı
│   │   │                        e-posta/kullanıcı adı/T.C. kuralları ve yönetici adı tetikleyicisi,
│   │   │                        032 kişi kodu 16 karakter, 4'erli tireli gruplar,
│   │   │                        033 ödevde öğrencinin dosya yükleme izni, okulun dosya alanı uyarısı,
│   │   │                        034 teslim dosyalarının en erken silinme anı)
│   │   ├── esleme.js          ← satır <-> uygulama nesnesi (ad_soyad <-> fullName)
│   │   ├── yazici.js          ← genel INSERT/UPDATE (ad doğrulamalı)
│   │   ├── depo/              ← tablo gruplarına göre sorgular (kullanıcılar, ödevler, sınavlar...)
│   │   ├── json-aktarim.js    ← eski db.json ve yedekler <-> veritabanı
│   │   └── yedek.js           ← günlük yedek, geri yükleme
│   ├── guvenlik.js            ← hız sınırı, kaba kuvvet kilidi, bot sorusu, 2FA, oturum
│   ├── sifre.js               ← scrypt ile şifre özetleme
│   ├── http.js                ← JSON cevap, gövde okuma, sıkıştırma, statik dosya, parça birleştirme, /admin
│   ├── yetki.js               ← roller, yetkiler, kapsam, dışarı verilen kullanıcı görünümü
│   ├── iliskiler.js           ← kim kimin öğretmeni; sınıf, ders, program yardımcıları
│   ├── okullar.js             ← MEB okul listesi ve arama
│   ├── hatirlatma.js          ← ders/ödev hatırlatma bildirimleri
│   ├── push.js                ← telefon bildirimi: RFC 8291 şifreleme, VAPID, gönderim kuyruğu
│   ├── site.js                ← /api/site: açılış sayfası rakamları; site ayarları (veritabanı > data/config.yml > varsayılan)
│   ├── bolumler/              ← her bölüm kendi uçlarını sunar (uclar(k))
│   │   ├── kayit.js           ← kayıt, giriş, şifre, profil, bildirimler
│   │   ├── kisilik.js         ← yetişkin hesabı: portallar, + Ekle, kişi kodu, hesap bilgisi, hesabı sil
│   │   ├── yonetici.js        ← /api/admin: müdürler, okullar, yedekler, yönetici dosyası
│   │   ├── site-ayarlari.js   ← /api/admin/site-ayarlari, okul-adresleri, okul-adres: Site Ayarları
│   │   ├── yonetici-okul.js   ← /api/admin/kisi-bul ve okul-ac: yöneticinin okulu kişi koduyla açması
│   │   ├── okul-sayfasi.js    ← /api/okul-sayfa, /api/okul-foto: okulun giriş sayfası
│   │   ├── okul.js            ← /api/school: sınıf, ders, program, roller, ders programı Excel'i
│   │   ├── hesaplar.js        ← /api/school: öğrenci/servisçi hesabı, öğretmeni kişi koduyla ekleme, veli bağlama, okul adresi
│   │   ├── kisi-aktarim.js    ← /api/school: kişi listesi şablonu, içeri/dışarı aktarım, metinden Excel
│   │   ├── okul-hayati.js     ← /api/yemek, /api/servis (harita, sefer, konum, yoklama, sıra, not, saatler), /api/kulupler
│   │   ├── cihaz.js           ← /api/cihaz: telefon uygulamasının cihaz anahtarı, bildirim yoklama, servis konumu
│   │   ├── anket.js           ← /api/anketler
│   │   ├── odev-dosya.js      ← /api/odev-dosya: teslim dosyası yükleme ve indirme
│   │   ├── push.js            ← /api/push: bildirim aboneliği
│   │   ├── odev.js            ← /api/assignments
│   │   ├── quiz.js            ← /api/assignments/:id/quiz...: ödevin quizi (düzenleme, çözme, süre, sonuç)
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
│       ├── hatirlatici-zaman.js ← Türkiye saatiyle gün ve an hesabı (hatırlatıcılar, servis saatleri)
│       ├── servis-pencere.js  ← okulun servis saat aralıkları: şu an hangi dönem, uzatma, sonraki aralık
│       ├── quiz.js            ← quizin saf işlevleri: yapıştırma ayrıştırıcısı, doğrulama, puan, süre
│       └── eposta.js          ← SMTP istemcisi
│
├── public/                    ← ÖN YÜZ (tarayıcıya giden her şey)
│   ├── index.html             ← giriş ekranı + uygulama iskeleti
│   ├── kvkk/kvkk.html         ← aydınlatma metni (egitimevi.org/kvkk/kvkk.html)
│   ├── kosullar/kosullar.html ← kullanım koşulları
│   ├── indir/indir.html       ← indirme sayfası (js/indir.js ile)
│   ├── 404.html, okul-bulunamadi.html ← "Sayfa bulunamadı" ve "Okul bulunamadı"
│   ├── manifest.json, sw.js   ← telefona kurulabilir uygulama (PWA)
│   ├── js/tema.js             ← açık/koyu tema; sayfa çizilmeden önce çalışır
│   ├── js/parcalar/           ← arayüz mantığı, 55 parça (00-durum ... 28-grafik; 14c-quiz, 19i-servis-yoklama)
│   ├── js/yonetim/            ← yönetim paneli ekranları, 4 parça (yalnız /admin/yonetim.js ile gider)
│   ├── css/parcalar/          ← stiller, 38 parça (00-temel: renk/tema değişkenleri)
│   └── yazitipi/              ← IBM Plex Sans ve Newsreader (woff2, kendi sunucumuzdan)
│
├── data/                      ← VERİ (depoya girmez)
│   ├── ayarlar.json           ← veritabanı bağlantısı ve e-posta (SMTP) ayarları
│   ├── push-anahtar.json      ← telefon bildirimi anahtar çifti (ilk açılışta üretilir; yedekle)
│   ├── dosyalar/              ← ödev teslim dosyaları
│   ├── okul-fotolari/         ← okul sayfalarının fotoğrafları (konum bilgisi silinmiş)
│   ├── config.yml             ← site ayarlarının dosyadaki değerleri: iletişim, Play Store, aralıklar
│   │                            (örneği belge/config.ornek.yml; panelde kaydedilen değer bunu ezer)
│   ├── admins.json            ← yönetici hesapları (isteğe bağlı; örneği belge/admins.ornek.json; chmod 600)
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
│   ├── gorsel-veri.js         ← ekran görüntüleri için ek veri: çok rollü hesaplar, okul sayfası, etüt, servis, quiz
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
│   ├── config.ornek.yml       ← data/config.yml örneği (iletişim, Play Store, aralıklar)
│   ├── admins.ornek.json      ← data/admins.json örneği (yönetici hesapları)
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

**Yönetim paketi.** Sistem yöneticisinin ekranları `public/js/yonetim/` altındadır ve herkese
giden `/js/app.js`'e girmez. Sunucu yalnız geçerli yönetici çereziyle
`/admin/yonetim.js` adresinden ayrı bir paket verir: `public/js/parcalar/` ile
`public/js/yonetim/` parçaları dosya adına göre tek sırada, tek IIFE içinde birleşir; yönetim
parçaları uygulamanın bütün işlevlerini ve `SAYFALAR`, `EYLEMLER` tablolarını görür. Ortak
parçalar yönetime yalnız `00-durum.js`'teki boş `YONETIM` kancasıyla bakar; kancayı yönetim
paketi doldurur. İki klasörde aynı adlı parça olmamalı (`testler/test-kucult.js` denetler).
Yönetim parçaları tarayıcıya tek tek gitmez; `/js/yonetim/...` adresleri de bilinmeyen adres
gibi 404 verir. `buton-denetimi`, `yazim-denetimi` ve `test-kucult` iki klasörü de okur.

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
- **Rol seçimi yok.** Kayıt formu "ne olarak kullanacaksın" diye sormaz; gövdede rol ya da
  okul gönderilse de yok sayılır. Herkes rolsüz bir yetişkin hesabı açar; veli, öğretmen ya
  da müdür olmak girişten sonra **+ Ekle** ile olur (yukarıda "Hesap türleri ve portallar").
  Hesap e-posta bağlantısıyla açıldığı anda kişi kodu da üretilir.
- **Doğum tarihi** öğrenciden istenir: okul hesabı açarken yazabilir, öğrenci Ayarlar'da
  girer (orada zorunludur); nakilde T.C. no ile birlikte eşleştirmede kullanılır. Yetişkin
  kaydında istenmez; daha önce girilmişse Ayarlar'da görünür ve silinebilir.
  Gelecek tarih, olmayan gün (30 Şubat) ve 1920 öncesi reddedilir.
- **Müdürlük başvurusu yoktur.** Yaş, doğum tarihi ya da beyan istenmez; okulu ve müdürünü
  sistem yöneticisi açar, kişiyi dışarıdan (telefon, e-posta) kendisi doğrular ve kişi
  koduyla müdür yapar (yukarıda "Admin: okul açma"). E-postası onaylanmamış hesap zaten
  yoktur; kodu tahmin etmeye karşı hız sınırları var.

### Aynı e-posta, kullanıcı adı ve T.C. (çakışmalar)

Kurallar bütün yollarda aynıdır: kayıt ve e-posta onayı, e-posta ya da kullanıcı adı
değiştirme, okulun açtığı öğrenci/servisçi (tek tek ya da Excel ile), nakil, kişi koduyla
öğretmen/müdür ekleme, veli bağlama, `data/admins.json` ve yedekten geri yükleme.

- **E-posta bütün sistemde tektir.** Karşılaştırmadan önce adres tek biçime getirilir:
  büyük/küçük harf, baştaki/sondaki boşluk, Türkçe büyük **İ** (i olur), tam genişlikli
  harfler (`ａｙｓｅ＠ｘ．ｃｏｍ`) ve görünmez karakterler (sıfır genişlikli boşluk, yumuşak
  tire) fark etmez: `Ayse@X.com`, ` AYSE@x.com ` ve `ayse@x.com` aynı hesaptır. Adreste
  yalnız İngilizce harf, rakam ve `. _ - +` gibi işaretler olabilir; `ı ş ğ ü ö ç`,
  aksanlı harf ya da Latin harfine benzeyen başka alfabeden harf (Kiril `а` gibi) kabul
  edilmez, görünüşte aynı iki adresle iki hesap açılamaz.
- **Kullanıcı adı** aynı biçimde karşılaştırılır (`İSMAİL` = `ismail`). Okul hesaplarında
  (müdür, öğretmen, öğrenci, servisçi) okul içinde, yetişkin/veli/yönetici hesaplarında
  kendi aralarında tektir: aynı ad iki okulda olabilir, giriş okul adresinden
  (`/school/<okul>`) ayrılır; adresiz girişte ad birden çok okulda varsa okul sorulur.
  **Sistem yöneticisinin kullanıcı adı hiçbir hesapla aynı olamaz** (hiçbir okulda da).
- **T.C. kimlik no** okulda tektir; öğrencinin T.C. no'su bütün sistemde tektir (başka
  okuldaki öğrenci yalnız nakille, doğum tarihiyle gelir); yetişkin hesabında yazılmışsa
  yetişkinler arasında tektir.
- **Aynı anda gelen istekler.** Her kural veritabanında da korunur (tekil indeksler;
  yönetici adı için tetikleyici, `031-cakismalar.sql`). İki istek "var mı" denetimini
  birlikte geçse de ikincisini veritabanı durdurur; kişi hangi alanın çakıştığını söyleyen
  açık bir ileti alır (cevapta `alan`: `eposta`/`email`, `kullaniciAdi`, `tc`, `okulNo`).
  Excel listesi bu yüzden durursa hiçbir hesap açılmaz, liste yeniden yüklenir.
- **Eski biçimde saklanmış e-posta.** Eski sürümler adresi yalnız kırpıp küçük harfe çevirerek
  saklardı: büyük **İ** ile yazılmış adres `i̇` (i + birleşik nokta) olarak dururdu. Böyle bir hesap
  bugün e-postayla giremez, şifresini sıfırlayamaz ve aynı adresle ikinci bir hesap açılabilirdi.
  Sunucu her açılışta bu adresleri bugünkü biçime getirir (pencereye kaç adres düzeltildiği
  yazılır). Bu, `data/admins.json` okunmadan önce yapılır: dosyaya aynı adres büyük İ ile
  yazılmış olsa da o satır "yönetici olmayan bir hesapta" diye atlanır, ikinci bir hesap açılmaz.
  Aynı biçimde başka bir hesap zaten varsa ikisine de dokunulmaz, açılış raporunda görünür.
- **Eski veri.** Şema dosyası var olan kayıtlara dokunmaz ve sunucuyu durdurmaz. Kurallara
  aykırı eski kayıt varsa (aynı T.C. ile iki okulda öğrenci, bir yöneticiyle aynı adlı hesap,
  yalnız harf farkıyla ayrılan e-postalar) sunucu açılışta pencereye yazar; yönetici elle
  düzeltir. Yedekten geri yüklemede kurala aykırı çift ayıklanır: T.C. no'su çakışan hesap
  T.C.'siz, yöneticinin adını taşıyan hesap başka adla yüklenir, e-postası çakışan hesap atlanır.

---

## Veli paneli

Veli çocuğunun portalına girmeden de her şeyi görür: **Ödevler**, **Devamsızlık**,
**İlerleyiş** ve **Takvim** bütün çocuklar için tek listede gelir, her satırın başında
hangi çocuğun olduğu yazar. Üstteki şeritten ya da sol menüdeki *Veli · çocuğun adı*
portalından tek çocuğa daraltılır. Öğrenciye gönderilen
her mesaj velisine de düşer; mesajda "Zeynep için" notu görünür. Eski yol da duruyor:
Çocuklarım → çocuğun kartı → portalı.

---

## Hız

- Sunucu API'si 1–1,5 ms cevap verir; `localhost` için IPv4+IPv6 birlikte dinlenir
  (yalnızca IPv4 dinlenince tarayıcı önce IPv6'yı deneyip ~200 ms bekliyordu).
- Betik ve stil adresleri kendi sürümünü taşır (`/js/app.js?v=…`): tarayıcı bir yıl
  saklar, dosya değişince adres değişir. İkinci açılışta yalnızca HTML sorulur.
- Yazı tipi ve simgeler de bir yıl önbellekte; arayüz kodu (`/js/app.js`, yorumsuz) brotli ile
  yaklaşık 680 KB → 155 KB, stil dosyası 170 KB → 29 KB. Yönetim paketi yalnız yöneticiye gider.

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

Yönetim paneli ve site ayarları için ayrı paketler: `test-admin-gizli.js` (çerezsiz `/admin`
ile bilinmeyen adresin bayt bayt karşılaştırması, çerez, `app.js`'te yönetim kodu olmaması,
yönetici uçlarının 404'ü), `test-site-ayarlari.js` (öncelik, doğrulama, sıfırlama, okul
adresi), `test-yonetici-dosyasi.js` (`admins.json`, canlı okuma; yalnız
`testler/testdata/` altında) ve `test-cakisma.js` (aynı e-posta, kullanıcı adı ve T.C.;
aynı anda gelen istekler). Hepsi `tumtest.sh` listesindedir.

`test-okul-agi.js`: okul ağı yük ve saldırı paketi. Test veritabanına 300 öğrenci yazar;
öğrenciler tek IP'den (`::1`), 5 saniyeye yayılarak tarayıcıda ölçülen istek dizisiyle
girer (her biri kendi 6 bağlantısıyla). 429, 503 ve kesilen bağlantı olmamalı. Ardından
tek oturumdan sel, tek hesaba şifre denemesi, bir hesaba birçok bağlantıdan deneme
(`127.0.0.11`-`16`: hesap tanımadığı bağlantıdan kilitli, sahibi okulun ağından giriyor;
`127.0.0.21`-`26`: müdürün verdiği yeni şifre kilidi kaldırıyor), kimsenin girmediği
(`127.0.0.3`), 10 öğrencinin girdiği (`127.0.0.4`) ve kendi açtığı 5 yetişkin hesabıyla girilen
(`127.0.0.5`) bağlantıdan şifre taraması ve oturumsuz sel (`127.0.0.1`) ayrı ayrı durdurulur. Başka bağlantılar `127.0.0.N`
kaynak adresinden gelir (bütün 127/8 geri döngüdür). Giriş sınırları ve genel istek sınırı
(uydurma oturum anahtarları sayaç açmıyor, sayaç haritası üst sınırda büyümüyor) ayrıca
sunucusuz denenir. Ölçüm için uzun sürüm (10 sn yayılma, gerçekçi bekleme, sonuç
tablosu ve `OLCUM` satırı):

```
EE_AG_OLCUM=1 EE_BASE=http://localhost:3200 EE_LOG=testler/test-sunucu.log node testler/test-okul-agi.js
```

`EE_AG_YAYILMA_MS=1000` ani yük (herkes bir saniyede), `EE_AG_SALDIRI=0` saldırısız,
`EE_AG_VEKIL=1` sunucu vekil arkasındayken (test ayarlarında `vekil.guven: true`, başlık
`x-forwarded-for`; öğrenciler vekil gibi ortak bir bağlantı havuzundan gelir).

Bir paketin sunucusu ek ortam değişkeniyle açılabilir (`tumtest.sh` `paket_ortami`):
`test-odev-dosya` okulun dosya alanını 1 MB'a indirir (`EE_OKUL_DOSYA_GB=0.001`) ki %80
uyarısı ve "doldu" küçük dosyalarla denensin. Tek başına çalıştırırken aynı değişkeni ver
(verilmezse o bölüm atlanır).

---

## Depo ve gizli bilgiler

Depo herkese açıktır; **`data/` asla girmez** (`.gitignore`): veritabanı bağlantısı,
e-posta şifresi, iletişim bilgileri (`config.yml`), yönetici hesapları dosyası
(`admins.json`), yedekler, yüklenen dosyalar ve telefon bildirimi anahtarı sunucuda kalır.
Commit atmadan önce `git status` çıktısında `data/` görünmediğini kontrol et.

---

## Henüz eklenmeyenler

- Tek Android uygulaması "Eğitim Evi" (yerel, WebView değil) hazırlanıyor; sunucu tarafı hazır
  (cihaz anahtarı, bildirim yoklama, servisçinin arka plan konumu, 30 günlük uygulama oturumu).
  Google Play'de yayın da henüz yok.
- Eğitim Evi Aile için iPhone sürümü (Apple'ın Screen Time izni gerekir).
- Quiz sorularına resim ya da formül eklemek. Yerel "Eğitim Evi" uygulamasında quiz ekranı: quiz bugün
  sitede ve telefona kurulan site uygulamasında çözülür; uçlar `/api/assignments/:id/quiz` altında hazır.
- Tanıtım sayfası, arama motoru ve bağlantı önizlemesi (internete çıkınca)
- Canlı ders, kitap kurdu, yılın öğrencisi (sonra ele alınacak)
