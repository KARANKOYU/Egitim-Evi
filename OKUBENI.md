# 🏫 Eğitim Evi

Okul yönetim ve eğitim takip sistemi. Öğrenci, veli, öğretmen ve müdür hesapları;
ödev takibi, sınav notları ve ilerleme grafikleri.

---

## ▶️ Nasıl çalıştırılır

**`baslat.bat`** dosyasına çift tıkla. Tarayıcı kendiliğinden açılır.

Kapatmak için açılan siyah pencereyi kapat.

> Node.js kurulu olmalı. Kurulu değilse: https://nodejs.org

**Telefondan bağlanmak için:** siyah pencerede yazan `Telefondan: http://192.168.x.x:3000`
adresini telefonunun tarayıcısına yaz. (Telefon ve bilgisayar aynı wifi'de olmalı.)

---

## 🔑 İlk giriş (admin)

İlk çalıştırmada otomatik bir yönetici hesabı oluşur:

```
E-posta : admin@egitimevi.com
Şifre   : admin123
```

**Önemli:** Giriş yaptıktan sonra **Ayarlar → Şifre değiştir** bölümünden bu şifreyi mutlaka değiştir.

---

## 🔐 İki adımlı giriş (2FA)

Giriş **her zaman iki adımlıdır** ve kapatılamaz:

1. E-posta + şifre girilir
2. Hesabın e-posta adresine **6 haneli kod** gider, o girilir

Kod 5 dakika geçerlidir, **tek kullanımlıktır**, 5 hatalı denemede iptal olur.
Kod hiçbir zaman tarayıcıya gönderilmez — sunucuda özetlenerek (SHA-256) tutulur
ve diske hiç yazılmaz.

### E-posta ayarlanmamışsa ne olur?

Sistem kimseyi dışarıda bırakmaz: kod **sunucu penceresine (siyah ekran)** yazılır.
Test ederken bu yeterli, ama gerçek kullanımda e-postayı ayarlaman gerekir.

### E-posta ayarlama (kolay yol)

**`eposta-ayarla.bat`** dosyasına çift tıkla. Sorulara sırayla cevap ver:
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
> `farukyildiz3207@gmail.com` olsa bile e-posta **"Eğitim Evi"**den gelmiş
> gibi görünür. Yeni hesap açmadan da kurumsal duruyor.

> Port 465 → `"guvenli": true` · Port 587 → `"guvenli": false` (STARTTLS)

> `data/ayarlar.json` web'den **servis edilmez**, şifre tarayıcıya sızmaz.
> Yine de dosyayı kimseyle paylaşma.

---

## 🏫 Okul listesi (MEB)

Sistemde **Millî Eğitim Bakanlığı'nın 53.118 okulu** hazır kayıtlı — 81 il, 896 ilçe.
Müdür kayıt olurken okulunu bu listeden arayıp seçer, elle yazmaz.

**Arama iki şekilde çalışır:**
- **İl seçmeden** okul adı yaz → Türkiye genelinde arar
- **İl (ve istersen ilçe) seç** → sadece orada arar

Okul türüne göre de süzebilirsin (Ortaokul, Lise, İlkokul, Anaokulu, Meslek Lisesi,
Sanat Okulu, Halk Eğitim Merkezi).

Arama Türkçe karakterlere esnek: `sisli` yazınca **Şişli Anadolu Lisesi** gelir.

> Listede olmayan (yeni açılmış) okullar için kayıt formunda
> **"Okulum listede yok"** bölümü var; adı elle yazılır, yönetici onaylar.

Bir okula **yalnızca bir müdür** kaydolabilir; ikincisi reddedilir.

### Listeyi yenilemek

Liste `data/okullar.json` dosyasında tutulur. Kaynak CSV güncellenirse:

```
node araclar/okullari-hazirla.js
```

Kaynak: `meb-okullar-master/meb-okullar.csv`

---

## 👥 Hesap türleri ve onay zinciri

| Hesap | Kayıtta ne seçer | Kim onaylar |
|---|---|---|
| 🎩 **Müdür** | İl, ilçe, okul adı | **Admin (sen)** |
| 👩‍🏫 **Öğretmen** | Okul + branş | Okulun müdürü |
| 👨‍🎓 **Öğrenci** | Okul + sınıf | Onay gerekmez, anında aktif |
| 👨‍👩‍👦 **Veli** | — | Onay gerekmez, veli kodu ile çocuğunu ekler |

### Sistemi ilk kez kurma sırası

1. `admin@egitimevi.com` ile gir.
2. Bir kişi **Müdür** olarak kayıt olsun (okul adını yazar).
3. Admin panelinde **Onay Bekleyenler** → Onayla. Okul artık listelerde görünür.
4. Öğretmenler ve öğrenciler bu okulu seçerek kayıt olur.
5. Müdür, **Öğretmenler** sayfasından öğretmenleri onaylar.
6. Müdür, **Öğrenciler** sayfasından her öğrenciye öğretmen atar.
7. Öğretmen artık ödev verebilir ve sınav açabilir.

> **Not:** Türkiye'deki tüm okulların hazır listesi yok (on binlerce okul var).
> Bunun yerine okullar müdür kaydıyla sisteme girer, admin onaylayınca listeye düşer.
> 81 il hazır tanımlı.

---

## 🏛️ Sınıflar ve ders programı

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

### ⚠️ Çakışma uyarısı

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

## 👤 Hesap yönetimi

### Müdür öğrenci hesabı açabilir

**Öğrenciler** sayfasında **Hesap aç** ile öğrencinin kendisi kaydolmadan hesap
açılır: ad soyad, kullanıcı adı (e-posta), şifre ve sınıf. Kaydedince kullanıcı
adı, şifre ve veli kodu **bir kez** ekranda gösterilir — kopyalayıp öğrenciye ilet.

### Kullanıcı adı ve şifre

Her öğrencinin satırındaki **Hesap** butonundan:

- Ad soyad ve **kullanıcı adı** değiştirilebilir
- **Şifre sıfırlanabilir** (elle yaz ya da **Rastgele üret**)
- **Veli kodu** görüntülenir, kopyalanır, gerekirse yenilenir

> **Şifreler görüntülenemez.** `scrypt` ile geri döndürülemez biçimde saklanıyor;
> sunucu bile mevcut şifreyi bilmiyor, yalnızca doğru olup olmadığını kontrol
> edebiliyor. Öğrenci şifresini unuttuysa yenisini belirlersin.

Şifre değişince o öğrencinin açık oturumları kapanır.

### Öğrenci portalına giriş

**Portalını aç** ile müdür, öğrencinin gördüğü ekranı birebir açar — ödevleri,
notları, ders programı. Menüdeki **Öğrenci Listesi** ile geri döner.

### Admin: müdür yönetimi

**Müdürler** sayfasında tüm müdür hesapları listelenir (okul, il, öğretmen ve
öğrenci sayısı, onay durumu). **Hesabı sil** ile müdür kaldırılır; okul
*beklemede* durumuna döner, öğretmen ve öğrenci hesapları silinmez, okula yeni
bir müdür başvurabilir.

---

## 🔔 Otomatik bildirimler

Sunucu beş dakikada bir kontrol eder:

| Bildirim | Kime | Ne zaman |
|---|---|---|
| ⏰ Ders başlıyor | Öğretmene | Dersten 15 dakika önce |
| 📌 Ödevin son günü yarın | Öğrenciye | Son günden bir gün önce |
| Ders programa eklendi | Öğretmene | Müdür programa ders koyunca |
| Sınıfa yerleştirildin | Öğrenciye | Müdür sınıfa atayınca |

Aynı bildirim iki kez gönderilmez. Ödevi zaten sonuçlanmış öğrenciye hatırlatma
gitmez.

---

## 📲 Telefona uygulama olarak kurma

Site bir **PWA** — telefona ya da bilgisayara uygulama gibi kurulabilir.
Kurulunca ayrı simgeyle açılır, tarayıcı çubuğu görünmez.

Üst çubuktaki **📲 Uygulamayı yükle** butonu, tarayıcı kuruluma izin verdiğinde
kendiliğinden çıkar. Çıkmazsa butona basınca elle kurulum adımları anlatılır.

> **Önemli:** Otomatik kurulum önerisi ve çevrimdışı çalışma **HTTPS** gerektirir.
> `http://192.168.x.x` ile telefondan girildiğinde tarayıcı kurulum önermez —
> ama yine de menüden **Ana ekrana ekle** diyebilirsin. Tam PWA deneyimi için
> siteyi HTTPS arkasına almak gerekir (ör. Cloudflare Tunnel).

Simgeleri yeniden üretmek için: `node araclar/simge-uret.js`
Simgeler üretiliyor...
  simge-192.png  (192x192, 1.4 KB)
  simge-512.png  (512x512, 4.1 KB)
  simge-maskeli-512.png  (512x512, 3.3 KB)

---

## 🔑 Roller ve yetkiler

Müdürün bütün yetkileri vardır ve bu değiştirilemez — okulda her şeyi
yapabilen en az bir kişi kalmalı.

Bunun dışında müdür **kendi rollerini tanımlar**: adını kendi koyar
("Müdür Yardımcısı", "Rehber Öğretmen", "Zümre Başkanı"), yetkilerini
tek tek seçer, sonra bir öğretmene verir. Rol verilen öğretmenin menüsü
kendiliğinden değişir, yeni bölümler açılır.

**Roller ve Yetkiler** sayfasından yönetilir.

### Yetki listesi

| Grup | Yetkiler |
|---|---|
| **Ders ve program** | Derse öğretmen olarak atanabilir · Ders programını düzenler · Sınıfa ders ekler/çıkarır · Derse öğretmen atar |
| **Sınıf ve öğrenci** | Sınıf açar/siler · Öğrenciyi sınıfa yerleştirir · Öğrenci hesabı açar · Öğrenci bilgilerini düzenler · Öğrenci şifresi sıfırlar · Öğrenci portalına girer |
| **Öğretmenler** | Başvuru onaylar · Bilgi ve branş düzenler · Okuldan çıkarır |
| **Ödev ve sınav** | Ödev verir · Ödev sonuçlandırır · Sınav oluşturur · Sınav notu girer |
| **Devamsızlık** | Yoklama alır · Okulun tüm devamsızlığını görür |
| **Mesajlaşma** | Sınıfa/gruba toplu mesaj · Herkese mesaj |
| **Yönetim** | Rol oluşturur · İşlem kaydını görür · Yedek alır · Excel/CSV aktarım |

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

### Her öğretmende varsayılan açık olanlar

Derse atanabilir · Ödev verir · Ödev sonuçlandırır · Sınav notu girer · Yoklama alır

Bunlar rol verilmese de çalışır, kapatılamaz. Rol penceresinde **varsayılan**
etiketiyle kilitli görünürler.

> Yetki kontrolü sunucuda yapılır. Rol silinince ya da yetki daraltılınca
> kişi anında o işlemi yapamaz hâle gelir.

---

## 📝 Ödev sistemi

- Öğretmen **Ödevler → Yeni ödev ver**: ders, ad, açıklama, tarih aralığı.
- **Kimlere gideceğini sen seçersin.** Sınıflar listelenir, altlarında öğrenciler
  onay kutusuyla durur. Sınıf kutusunu işaretleyince o sınıfın hepsi seçilir;
  bir öğrenciyi çıkarınca sınıf kutusu yarım işaretli olur.
  **Tümünü seç** ve **Tümünü kaldır** düğmeleri var, üstte kaç kişi seçili yazar.
- Birden fazla sınıfa aynı anda ödev verilebilir.
- Aynı anda **birden fazla aktif ödev** olabilir.
- Ödev bitince **Sonuçlandır** → her öğrenci için:
  ✅ Yaptı · ⚠️ Eksik · ❌ Yapmadı · 🏥 Gelmedi (izinli)
- Sonuçlananlar **Geçmiş Ödevler**'e düşer, silinmez.
- Öğrenci ve velisi sonucu anında görür.

### Müdürün ödev görünümü

Müdür ödev vermez — **Ödevler** sayfasında derse göre bakar. Her ders bloğunda
sınıf, ders adı, dersin öğretmeni ve haftalık saati yazar; altında o derse
verilmiş ödevler sıralanır: **kim verdi**, kaç öğrenciye, son teslim ne zaman,
açıklaması ne.

Üstteki sınıf seçiciyle tek sınıfa daraltılır.

### 🔍 Filtreleme ve arama

Ödevler sayfasının üstündeki çubuktan liste daraltılabilir:

| Filtre | Seçenekler |
|---|---|
| **Ders** | Listedeki derslerden biri (tek ders varsa gizlenir) |
| **Durum — öğrenci** | Aktif · Geçmiş · ✅ Yaptı · ❌ Yapmadı · ⚠️ Eksik · 🏥 İzinli · Değerlendirilmedi |
| **Durum — öğretmen** | Aktif · Sonuçlananlar · Süresi dolmuş ama sonuçlanmamış |
| **Tarih aralığı** | Son teslim tarihine göre başlangıç ve bitiş |

Üstteki **İçerik Ara** kutusu ödev adı, ders, öğretmen adı ve açıklamada arar.
Türkçe karakterler esnek eşleşir — `gunes` yazınca `Güneş sistemi maketi`,
`ayse` yazınca `Ayşe Kaya`'nın ödevleri gelir. Filtreler birlikte çalışır;
**Temizle** hepsini sıfırlar.

---

## 🧪 Sınav sistemi

1. **Sınav grubu** oluştur — örn. `Dönem 1 - Yarıyıl 1`
2. Grubun içine **sınav ekle** — örn. `1. Yazılı`, etki oranı **%50**
3. Sınava tıkla → her öğrenci için **0-100 arası not** gir.

**Ağırlıklı ortalama** otomatik hesaplanır:

```
1. Yazılı  → 80 puan, etki %50
2. Yazılı  → 100 puan, etki %50
Grup ortalaması = (80×50 + 100×50) / 100 = 90
```

Ortalama hem öğretmende hem öğrencinin **İlerleyişim** sayfasında görünür.

---

## 📈 İlerleyişim

- **Sütun grafiği:** her dersin üstünde ödev durumu (yeşil=yaptı, turuncu=eksik,
  kırmızı=yapmadı, gri=izinli). Sütunun üstündeki yüzde başarı oranıdır.
- **Sınav grubu ortalamaları:** ağırlıklı ortalamalar çubuk halinde.

İzinli gelmemek başarı oranını düşürmez.

---

## 👨‍👩‍👦 Veli tarafı

1. Öğrenci **Ayarlar** sayfasında **14 karakterlik veli kodunu** görür (örn. `w?+Ks@Pka7e@tJ`).
   Kod büyük harf, küçük harf, rakam ve özel işaret içerir; yanındaki **Kopyala**
   butonuyla panoya alınabilir.
2. Veli bu kodu **Çocuklarım → Çocuk ekle** kısmına girer.
   **Büyük/küçük harf duyarlıdır**, birebir yazılmalı.
3. Çocuğun kartına tıklayınca doğrudan onun portalı açılır:
   ilerleyiş, ödevler, sınavlar, başarılar.

Kod olmadan kimse başkasının çocuğunu göremez.

---

## 🎩 Müdür yetkileri

Müdür, öğretmenin yapabildiği **her şeyi** yapabilir (ödev verme, sınav açma, not girme)
ve ek olarak:

- Öğretmen başvurularını onaylar/reddeder
- Okuldaki tüm öğrencileri görür
- Öğrencileri öğretmenlere atar (bir öğrenci birden çok öğretmene atanabilir)
- Kendine de öğrenci atayıp ders işleyebilir

Öğretmen sadece kendi branşında ders açabilir; müdür istediği dersi seçebilir.

**Branşlar:** Matematik, Türkçe, İngilizce, Din Kültürü ve Ahlak Bilgisi,
Sosyal Bilgiler, Fen Bilimleri, Müzik, Resim, Beden Eğitimi.
Aynı branşta birden fazla öğretmen olabilir (2 fen öğretmeni gibi).

---

## 💾 Veriler

Her şey **`data/db.json`** dosyasında tutulur.

- **Yedek almak için:** bu dosyayı kopyala.
- **Her şeyi sıfırlamak için:** bu dosyayı sil, sunucuyu yeniden başlat.

Şifreler `scrypt` ile şifrelenmiş olarak saklanır — düz metin şifre hiçbir yerde tutulmaz
ve sunucudan dışarı çıkmaz.

**Sunucudaki korumalar:**

| Koruma | Ne yapar |
|---|---|
| Kaba kuvvet kilidi | 5 hatalı giriş sonrası o e-posta+cihaz 15 dakika kilitlenir |
| Genel hız sınırı | Tek bir cihazdan dakikada en fazla 300 istek (DDoS/istek yağmuru engeli) |
| Bot doğrulaması | Kayıt formunda toplama sorusu; cevap sunucuda tutulur, tarayıcıya gönderilmez |
| Veli kodu sınırı | Dakikada 5 kod denemesi — kod tahmin saldırısı engellenir |
| Oturum ömrü | Oturumlar 7 gün sonra kendiliğinden düşer, eskiler temizlenir |
| Güvenlik başlıkları | CSP, X-Frame-Options, nosniff, Referrer-Policy — XSS ve çerçeveleme engeli |
| Girdi temizliği | Gelen JSON'daki `__proto__` gibi tehlikeli anahtarlar ayıklanır |
| Yavaş bağlantı koruması | Açık tutulan boş bağlantılar 20-30 sn sonra kapatılır (slowloris) |
| Şifre politikası | En az 8 karakter, harf ve rakam zorunlu |
| İki adımlı giriş | Her girişte e-posta ile 6 haneli kod — zorunlu, kapatılamaz |
| Akıllı doğrulama sorusu | Girişte soru **yalnızca hatalı denemeden sonra** çıkar; normal kullanıcı hiç görmez, otomatik deneme aracı ikinci denemede takılır |
| Kod koruması | 5 dk ömür, tek kullanım, 5 hatalı denemede iptal, yeniden gönderme 60 sn kilitli |

Şifre doğrulama asenkron çalışır: çok sayıda eşzamanlı giriş denemesi sunucuyu kilitlemez.

---

## 🌐 İnternete açma

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

İnternete açılınca uygulama olarak kurma ve web bildirimleri de çalışmaya
başlar (ikisi de HTTPS istiyordu).

---

## 🌐 Uyumluluk

- Chrome, Firefox, Edge, Safari, Opera — hepsinde çalışır
- Adres çubuğu sayfayı takip eder (`#/program` gibi) — tarayıcı geri tuşu
  çalışır, sayfa yenilenince aynı yerde kalırsın
- Telefon, tablet ve bilgisayar uyumlu — sol menü her ekranda ☰ butonuyla açılıp kapanır
  (masaüstünde tercih hatırlanır)
- **Reklam yok**, dış servis yok, internet bağlantısı gerekmez
- Hiçbir npm paketi kullanılmaz — sadece Node.js'in kendi kütüphaneleri

---

## 📸 Ekran görüntüleri

`ekran-goruntuleri/` klasöründe her rolün gördüğü sayfaların gerçek görüntüleri
var. Klasördeki **`index.html`**'e çift tıklayınca albüm hâlinde gezilir.

Yeniden üretmek için (test sunucusu açıkken):

```
node araclar/zengin-veri.js
node araclar/ekran-goruntusu.js
node araclar/album-yap.js
```

Başsız Chrome kullanır; ayrı bir program kurmaya gerek yok.

---

## 🧪 Test örneği çalıştırma

Gerçek verine dokunmadan ayrı bir kopya çalıştırabilirsin:

```
set EE_DATA=C:\gecici\test-veri
set PORT=3200
node server.js
```

`EE_DATA` ayrı bir veri klasörü kullandırır, `PORT` farklı bir port açar.
Bu örnekte e-posta ayarı olmayacağı için giriş kodları pencereye yazılır.

---

## 📂 Dosyalar

```
eğitim evi/
├── OKUBENI.md                    ← bu dosya
├── SUNUCUYA-KURULUM.md           ← internete açma rehberi
├── ekran-goruntuleri/            ← her rolün ekranları + index.html albüm
├── baslat.bat                    ← çift tıkla, sistem açılır
├── eposta-ayarla.bat             ← çift tıkla, e-posta ayarlarını kur
├── server.js                     ← sunucu + API + veri yönetimi
├── eposta.js                     ← SMTP istemcisi (giriş kodu gönderimi)
├── araclar/
│   ├── okullari-hazirla.js       ← MEB CSV'sini okullar.json'a çevirir
│   └── eposta-ayarla.js          ← e-posta kurulum sihirbazı
├── meb-okullar-master/           ← kaynak okul verisi (MEB)
├── data/
│   ├── db.json                   ← tüm veriler (otomatik oluşur)
│   ├── ayarlar.json              ← e-posta (SMTP) ayarları
│   └── okullar.json              ← 53.118 okulluk arama listesi
└── public/
    ├── index.html                ← giriş ekranı + uygulama iskeleti
    ├── css/style.css             ← tasarım
    └── js/app.js                 ← arayüz mantığı
```

---

## ⏳ Henüz eklenmeyenler

- **Canlı Dersler**, **Kitap Kurdu** ve **Yılın Öğrencisi** bölümleri kaldırıldı
  (sonra ele alınacak)
- Mesajlaşma
- Devamsızlık takibi
- Sınavların müdür tarafından oluşturulması
- Öğretmeni müdürlüğe terfi ettirme
- Şifremi unuttum (e-posta gönderimi)
