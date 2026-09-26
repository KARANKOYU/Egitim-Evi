# Eğitim Evi'ni internete açma (Linux VPS + egitimevi.org)

Bu belge, uygulamayı kiralık bir Linux sunucuya (VPS) kurup `https://egitimevi.org`
adresinden yayına almayı anlatır. Komutları sırayla kopyala-yapıştır yeterli; hepsi
sunucuda `root` olarak çalıştırılır (aksi yazılmadıkça).

---

## Neye ihtiyacın var

| Ne | Öneri | Yaklaşık fiyat (Eylül 2026) |
|---|---|---|
| Alan adı | `egitimevi.org` — Cloudflare Registrar (maliyetine satar, yenileme de aynı fiyat) ya da Namecheap | yılda ~10–13 $; **yenileme fiyatına bak** |
| VPS | **Hetzner Cloud CX23**: 2 vCPU, 4 GB RAM, 40 GB NVMe, 20 TB trafik; Almanya ya da Finlandiya | aylık 5,99 € (IPv4 dahil) + KDV |

**Neden bu VPS?** Uygulama hafif: bir okul için 1 vCPU / 2 GB RAM bile yeter; 4 GB
RAM, PostgreSQL ve birkaç okulla rahat nefes aldırır. Hetzner saatlik faturalar, aylık
tavanı aşmaz, anlık görüntü (snapshot) ve haftalık otomatik yedek (+%20) sunar.
CX23 stokta yoksa **CAX11** (ARM, 2 vCPU / 4 GB, 6,49 €) aynı işi görür; Node.js ve
PostgreSQL ARM'de sorunsuz çalışır. (Eylül 2026'da bu ucuz planlar zaman zaman "not
available" görünüyor; stok gelince açılıyor.) İşletim sistemi olarak **Ubuntu 24.04** seç.

**Türkiye'de sunucu** istersen: KVM sanallaştırma, root erişimi ve Ubuntu 24.04 kurulabilen,
en az 2 GB RAM'li bir VDS/VPS yeter. Almadan önce sağlayıcıya sor: sanallaştırma KVM mi,
disk NVMe mi, anlık görüntü (snapshot) ya da yedek var mı, fiyata KDV dahil mi, iade süresi
ne kadar. Aylık al, yıllığa bağlanma. Aldıktan sonra ilk gün işlemciyi ve diski dene:

```
nproc && lscpu | grep -i "model name\|mhz"
dd if=/dev/zero of=/root/deneme bs=1M count=1024 oflag=direct && rm /root/deneme
```

Disk yazma hızı saniyede 200 MB'ın çok altındaysa ya da işlemci söylenenden zayıfsa
iade süresi içinde vazgeç.

> **Gerçek okul verisiyle çalışacaksan sunucunun yerine dikkat:** sunucu Türkiye
> dışındaysa bu KVKK'nın 9. maddesine göre yurt dışına aktarımdır (aydınlatma
> metninin 6. bölümü bunu söylüyor). Proje tanıtımı ve deneme için Hetzner uygundur;
> okullar gerçekten kullanmaya başlayınca Türkiye'de veri merkezi olan bir sağlayıcıya
> (KVM sanallaştırma, NVMe disk, anlık görüntü desteği olan) geçmek işi kolaylaştırır.
> Taşıma: yedeği al, yeni sunucuda geri yükle (aşağıda "Yedekleme").

> **GoDaddy'nin barındırma (hosting) paketini alma.** O PHP içindir, Node.js çalıştırmaz.
> Alan adını al, sunucuyu ayrı kirala.

Fiyatlar değişir; satın almadan önce sağlayıcının sitesinden bak.

---

## 1. Alan adını sunucuya yönlendir

VPS'i kiralayınca sana bir **IP adresi** verilir (`203.0.113.45` gibi).
Alan adı panelinde iki DNS kaydı oluştur:

| Tür | Ad | Değer |
|---|---|---|
| A | `@` | VPS'in IP adresi |
| A | `www` | VPS'in IP adresi |

Yayılması 5 dakika ile birkaç saat sürebilir. Kontrol:

```
ping egitimevi.org
```

VPS'in IP'sini gösteriyorsa hazırdır.

---

## 2. Sunucuya bağlan

Kendi bilgisayarında bir terminal aç (Windows'ta PowerShell ya da Windows Terminal,
macOS ve Linux'ta Terminal):

```
ssh root@egitimevi.org
```

İlk bağlantıda parmak izi sorar, `yes` de. (Hetzner, sunucuyu açarken SSH anahtarı
eklemeni önerir; şifre yerine anahtarla girmek daha güvenlidir.)

---

## 3. Node.js ve PostgreSQL kur

```
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs git postgresql-common
/usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
apt install -y postgresql-17
systemctl enable --now postgresql
node --version
```

`v24.x` yazıyorsa tamam (en az v20 gerekir). PostgreSQL, Ubuntu'nun kendi deposunda
16 sürümüyle gelir; yukarıdaki betik PostgreSQL'in resmî deposunu ekler, 17 kurulur.
Veritabanı yalnızca sunucunun içinden (`127.0.0.1` ve yerel soket) dinler; 5432 dışarı açılmaz.

---

## 4. Uygulamayı yükle

Uygulama kendi kullanıcısıyla çalışır (`root` değil): bir açık bulunsa bile saldırgan
sunucunun geri kalanına dokunamaz.

```
useradd --system --home /opt/egitimevi --shell /usr/sbin/nologin egitimevi
git clone https://github.com/KARANKOYU/Egitim-Evi.git /opt/egitimevi
cd /opt/egitimevi
npm ci --omit=dev
mkdir -p data
```

**Okul listesi** (`data/okullar.json`, MEB'in 67 bin okulu) depoda yoktur. Kendi
bilgisayarından gönder (proje klasöründe, kendi bilgisayarının terminalinde):

```
scp data/okullar.json root@egitimevi.org:/opt/egitimevi/data/
```

### Veritabanını kur

Uygulamanın kendi kısıtlı veritabanı kullanıcısını ve veritabanlarını açar,
bağlantıyı `data/ayarlar.json`'a yazar (şifreyi araç rastgele üretir, ekrana yazmaz):

```
cd /opt/egitimevi
chown -R postgres data
sudo -u postgres node araclar/veritabani-kur.js --yerel-soket
chown -R egitimevi:egitimevi data
chmod 600 data/ayarlar.json
```

Sonra bir kez elle aç:

```
sudo -u egitimevi node sunucu/index.js
```

Şemalar (`sunucu/veri/sema/*.sql`) sırayla uygulanır, ilk yönetici hesabı oluşur ve
şifresi **yalnızca bu seferlik** ekrana yazılır; not al. "EGITIM EVI calisiyor" görünce
Ctrl+C ile kapat; kalıcı çalıştırma aşağıdaki systemd adımında.

> Kendi bilgisayarındaki veriyi taşımak istersen: orada admin → **Yedekleme** → yedek
> indir, dosyayı sunucuda `data/yedek/` altına kopyala, sunucuda aynı sayfadan o yedeğe
> geri dön. Sıfırdan başlıyorsan gerek yok.

---

## 5. Ayarları yap

```
nano /opt/egitimevi/data/ayarlar.json
```

Dosyada kurulum aracının yazdığı veritabanı bölümü var; **ona dokunma**, şu üç
bölümü yanına ekle (ya da varsa doldur):

```json
{
  "site": {
    "adres": "https://egitimevi.org"
  },
  "vekil": {
    "guven": true,
    "baslik": "x-forwarded-for"
  },
  "eposta": {
    "etkin": true,
    "sunucu": "smtp.gmail.com",
    "port": 465,
    "guvenli": true,
    "kullanici": "okulunuz.egitimevi@gmail.com",
    "sifre": "16-haneli-uygulama-sifresi",
    "gonderen": "okulunuz.egitimevi@gmail.com",
    "gorunenAd": "Eğitim Evi"
  }
}
```

Kaydet: `Ctrl+O`, `Enter`, `Ctrl+X`

> **`vekil.guven` neden önemli?** Ters vekil arkasında her isteğin IP'si
> `127.0.0.1` görünür. O hâlde bütün ziyaretçiler tek hız-sınırı sayacını
> paylaşır ve koruma işe yaramaz. `guven: true` gerçek adresi vekilin
> başlığından okutur.
>
> **Ters vekil arkasında değilken bunu açma.** Açıkken herkes başlığı
> uydurup hız sınırını aşabilir.

### İletişim bilgileri (sayfaların altı)

Sitenin altında ve Hakkında sayfasında görünecek e-posta ve telefon kodda değil,
`data/config.yml` dosyasındadır (depo herkese açık olduğu için):

```
cp /opt/egitimevi/belge/config.ornek.yml /opt/egitimevi/data/config.yml
nano /opt/egitimevi/data/config.yml
chown egitimevi:egitimevi /opt/egitimevi/data/config.yml
```

```yaml
iletisim:
  eposta: "iletisim@egitimevi.org"
  telefon: "+90 5xx xxx xx xx"
```

Boş bırakılan satır sitede görünmez. Değişiklik en geç 30 saniyede siteye yansır,
yeniden başlatmak gerekmez.

---

## 6. Servis olarak çalıştır

Uygulama arka planda, çökerse kendiliğinden yeniden başlasın diye:

```
nano /etc/systemd/system/egitimevi.service
```

İçine:

```ini
[Unit]
Description=Egitim Evi
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/egitimevi
ExecStart=/usr/bin/node sunucu/index.js
Environment=PORT=3000
Environment=HOST=127.0.0.1
Restart=always
RestartSec=5
User=egitimevi
Group=egitimevi
# Uygulama yalnızca kendi data/ klasörüne yazabilir; sistemin geri kalanı salt okunur.
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/egitimevi/data

[Install]
WantedBy=multi-user.target
```

> `HOST=127.0.0.1` sayesinde uygulama doğrudan internete açılmaz; yalnızca
> Caddy üzerinden erişilir.

Başlat:

```
systemctl daemon-reload
systemctl enable --now egitimevi
systemctl status egitimevi
```

Yeşil `active (running)` görmen lazım.

---

## 7. HTTPS (Caddy)

Caddy sertifikayı kendisi alır ve yeniler — uğraşmana gerek yok.

```
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy
```

Yapılandırma:

```
nano /etc/caddy/Caddyfile
```

İçindekileri sil, şunu yaz:

```
egitimevi.org, www.egitimevi.org {
    reverse_proxy 127.0.0.1:3000
    encode gzip
}
```

Başlat:

```
systemctl restart caddy
```

Bir dakika içinde `https://egitimevi.org` açılır. Sertifika otomatik gelir.

---

## 8. Güvenlik duvarı

Sadece gerekli kapılar açık kalsın:

```
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable
```

---

## 9. İlk giriş

İlk yönetici şifresi rastgele üretilir ve uygulamanın ilk açılışında (4. adımda elle
açtığında) yalnızca bir kez ekrana yazılır. Kaçırdıysan servis günlüğüne bak:

```
journalctl -u egitimevi | grep -A3 "İlk yönetici"
```

`https://egitimevi.org` adresine `admin@egitimevi.com` ve bu şifreyle gir.
**Girer girmez Ayarlar'dan şifreyi değiştir.**

---

## Yedekleme

Veri PostgreSQL'de; uygulama bunu kendisi yedekliyor — **kurman gereken bir şey yok.**
Günde bir kez veritabanının tamamını `data/yedek/` altına tek bir JSON dosyası olarak
yazar, son kopyaları saklar, eskileri siler. Admin hesabıyla **Yedekleme** sayfasından
elle kopya alabilir, indirebilir, istediğine geri dönebilirsin.

> Geri yükleme öncesi o anki hâl `yedek-elle-geri-alma-…` adıyla ayrıca
> saklanır; yanlış yedeği seçersen kaybolmazsın.

Yedek dosyasına girmeyen iki şey var, bunları da kopyala:

| Ne | Nerede | Kaybolursa |
|---|---|---|
| Ödev teslim dosyaları | `data/dosyalar/` | öğrencilerin yüklediği dosyalar gider |
| Okul sayfası fotoğrafları | `data/okul-fotolari/` | okulların kapak, logo ve galeri fotoğrafları gider |
| İletişim bilgileri | `data/config.yml` | sitenin altındaki e-posta ve telefon görünmez olur |
| Telefon bildirimi anahtarı | `data/push-anahtar.json` | herkesin bildirimleri yeniden açması gerekir |

**Ama bu tek başına yetmez.** Kopyalar sunucunun kendi diskinde duruyor;
disk giderse yedekler de gider. Ayda bir kendi bilgisayarına çek:

```
scp -r root@egitimevi.org:/opt/egitimevi/data/yedek ./egitimevi-yedek
scp -r root@egitimevi.org:/opt/egitimevi/data/dosyalar ./egitimevi-dosyalar
scp -r root@egitimevi.org:/opt/egitimevi/data/okul-fotolari ./egitimevi-fotolar
scp root@egitimevi.org:/opt/egitimevi/data/push-anahtar.json ./egitimevi-yedek/
```

Ek güvence olarak PostgreSQL'in kendi dökümü (haftalık, `crontab -e`):

```
0 4 * * 0 sudo -u postgres pg_dump egitimevi | gzip > /root/egitimevi-$(date +\%F).sql.gz
```

---

## Güncelleme

GitHub'a yeni sürüm gönderildikten sonra sunucuda:

```
cd /opt/egitimevi
git pull
npm ci --omit=dev
systemctl restart egitimevi
```

Yeni şema dosyaları (`sunucu/veri/sema/`) açılışta kendiliğinden uygulanır.
`data/` git'e girmediği için güncellemede dokunulmaz.

---

## İnternete açılınca ne değişiyor

| | LAN'da | İnternette |
|---|---|---|
| Uygulama olarak kurma | önerilmiyordu | **çalışır** (HTTPS geldi) |
| Telefon bildirimi (Web Push) | çalışmıyordu | **çalışır** |
| Servisçinin konum göndermesi | çalışmıyordu (konum HTTPS ister) | **çalışır** |
| Telefondan erişim | aynı wifi şart | her yerden |
| Saldırı yüzeyi | okul ağı | **tüm internet** |

Son satır önemli: artık gerçekten dışarıdayız. Zaten hazırdık — zorunlu
iki adımlı giriş, kaba kuvvet kilidi, hız sınırı, CSP, scrypt şifreleme.
Ama şu üçünü ihmal etme:

1. **Admin şifresini değiştir** (ilk iş)
2. **Yedeklemeyi kur** (yukarıdaki cron)
3. **E-postayı ayarla** — kurulmazsa giriş kodları sunucu günlüğüne yazılır,
   sen `journalctl -u egitimevi -f` ile bakmak zorunda kalırsın

---

## Saldırı ve aşırı yük (DDoS) koruması

Uygulama tek başına şunlara karşı korunur: IP ve oturum başına hız sınırı, girişte
kaba kuvvet kilidi ve bot sorusu, aynı anda en fazla 400 API isteği, sunucu boğulunca
yeni API isteklerini `503` ile geri çevirme, gövdesini yavaş gönderen isteği 30 saniyede
kesme, en fazla 1024 bağlantı. Bunlar **tek makineden gelen** saldırıyı durdurur.

Binlerce makineden gelen gerçek DDoS'u sunucuya ulaşmadan durdurmak için önüne
**Cloudflare** koy (ücretsiz plan yeter):

1. cloudflare.com'da hesap aç, **Add site** ile `egitimevi.org`'u ekle, ücretsiz planı seç.
2. Alan adı panelinde (GoDaddy vb.) ad sunucularını Cloudflare'in verdikleriyle değiştir.
3. Cloudflare **DNS**: `@` ve `www` A kayıtları VPS'in IP'si, **turuncu bulut açık** (Proxied).
4. **SSL/TLS → Overview: Full (strict)** (Caddy'nin sertifikası geçerli olduğu için).
5. **Security → WAF → Rate limiting rules**: `/api/login` ve `/api/register` için
   IP başına dakikada 20 istek, aşan 10 dakika engellensin.
6. Saldırı anında **Security → Settings → Under Attack Mode**'u aç.

Cloudflare arkasında `data/ayarlar.json` şöyle olmalı:

```json
"vekil": { "guven": true, "baslik": "cf-connecting-ip" }
```

Ve saldırgan Cloudflare'i atlayıp doğrudan sunucunun IP'sine gidemesin diye 443'ü
yalnızca Cloudflare'in adreslerine aç (liste: https://www.cloudflare.com/ips/):

```
ufw delete allow 443
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do ufw allow from $ip to any port 443 proto tcp; done
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do ufw allow from $ip to any port 443 proto tcp; done
```

> Caddy'nin sertifika yenilemesi 80. kapıyı kullanır; o açık kalsın.

---

## PostgreSQL şifresini unuttum

Sunucuda `postgres` kullanıcısının şifresine hiç gerek yok: kurulum aracı
`--yerel-soket` ile şifresiz bağlanır. Uygulamanın kendi şifresi `data/ayarlar.json`'da;
kaybolursa kurulum aracını yeniden çalıştır (şifreyi yeniler, veriye dokunmaz):

```
cd /opt/egitimevi && chown -R postgres data
sudo -u postgres node araclar/veritabani-kur.js --yerel-soket
chown -R egitimevi:egitimevi data && chmod 600 data/ayarlar.json && systemctl restart egitimevi
```

---

## Sorun çıkarsa

```
systemctl status egitimevi      # servis çalışıyor mu
journalctl -u egitimevi -n 50   # uygulama günlüğü
systemctl status caddy          # HTTPS katmanı
journalctl -u caddy -n 50       # sertifika hataları
```

Site açılmıyorsa sırayla bak: DNS doğru mu (`ping egitimevi.org`),
servis çalışıyor mu, Caddy ayakta mı, güvenlik duvarı 443'ü açtı mı.
