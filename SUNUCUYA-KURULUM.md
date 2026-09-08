# 🌐 Eğitim Evi'ni internete açma (VPS + egitimevi.org)

Bu belge, uygulamayı kiralık bir sunucuya (VPS) kurup `https://egitimevi.org`
adresinden yayına almayı anlatır. Komutları sırayla kopyala-yapıştır yeterli.

---

## Neye ihtiyacın var

| Ne | Nereden | Yaklaşık |
|---|---|---|
| Alan adı | GoDaddy, Namecheap, Cloudflare | yıllık, **yenileme fiyatına bak** |
| VPS | Hetzner, DigitalOcean, Contabo, Vultr | aylık, en küçüğü yeter |

**Ne kadar VPS?** Bu uygulama çok hafif: **1 çekirdek / 1 GB RAM / 20 GB disk**
bir okul için fazlasıyla yeter. Ubuntu 22.04 ya da 24.04 seç.

> **GoDaddy'nin barındırma paketini alma.** O PHP içindir, Node.js çalıştırmaz.
> Oradan sadece **alan adını** al; sunucuyu ayrı kirala.

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

Windows'ta PowerShell aç:

```
ssh root@egitimevi.org
```

İlk bağlantıda parmak izi sorar, `yes` de.

---

## 3. Node.js kur

```
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs git
node --version
```

`v22.x` yazıyorsa tamam.

---

## 4. Uygulamayı yükle

Kendi bilgisayarından dosyaları gönder (PowerShell'de, proje klasörünün
**üst** dizininde):

```
scp -r "eğitim evi" root@egitimevi.org:/opt/egitimevi
```

Sonra sunucuda:

```
cd /opt/egitimevi
node araclar/okullari-hazirla.js
```

> `data/db.json` dosyasını göndermek zorunda değilsin — sunucuda sıfırdan
> başlarsan ilk açılışta admin hesabı yeniden oluşur.

---

## 5. Ayarları yap

```
nano /opt/egitimevi/data/ayarlar.json
```

Şu üç bölümü doldur:

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
    "kullanici": "2farukyildiz@gmail.com",
    "sifre": "16-haneli-uygulama-sifresi",
    "gonderen": "2farukyildiz@gmail.com",
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
ExecStart=/usr/bin/node server.js
Environment=PORT=3000
Environment=HOST=127.0.0.1
Restart=always
RestartSec=5
User=root

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

`https://egitimevi.org` adresine gir:

```
admin@egitimevi.com / admin123
```

**Girer girmez Ayarlar'dan bu şifreyi değiştir.** Site artık internette;
varsayılan şifre açık kapı demektir.

---

## Yedekleme

Bütün veri tek dosyada: `/opt/egitimevi/data/db.json`

Uygulama bunu kendisi yedekliyor — **kurman gereken bir şey yok.** Günde bir
kez `data/yedek/` altına kopya alır, son 14 kopyayı saklar, eskileri siler.
Admin hesabıyla **Yedekleme** sayfasından elle kopya alabilir, indirebilir,
istediğine geri dönebilirsin.

> Geri yükleme öncesi o anki hâl `yedek-elle-geri-alma-…` adıyla ayrıca
> saklanır; yanlış yedeği seçersen kaybolmazsın.

**Ama bu tek başına yetmez.** Kopyalar sunucunun kendi diskinde duruyor;
disk giderse yedekler de gider. Ayda bir kendi bilgisayarına çek:

```
scp -r root@egitimevi.org:/opt/egitimevi/data/yedek ./egitimevi-yedek
```

Ya da otomatik olsun istersen, sunucuda `crontab -e` ile haftalık bir
kopyayı ev dizinine at (ayrı bölüm, en azından yanlış silmelere karşı):

```
0 4 * * 0 cp /opt/egitimevi/data/db.json /root/haftalik-$(date +\%F).json
```

---

## Güncelleme

Kendi bilgisayarından yeni dosyaları gönder, sonra:

```
systemctl restart egitimevi
```

---

## İnternete açılınca ne değişiyor

| | LAN'da | İnternette |
|---|---|---|
| Uygulama olarak kurma | önerilmiyordu | **çalışır** (HTTPS geldi) |
| Web bildirimleri | çalışmıyordu | **çalışır** |
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

## Sorun çıkarsa

```
systemctl status egitimevi      # servis çalışıyor mu
journalctl -u egitimevi -n 50   # uygulama günlüğü
systemctl status caddy          # HTTPS katmanı
journalctl -u caddy -n 50       # sertifika hataları
```

Site açılmıyorsa sırayla bak: DNS doğru mu (`ping egitimevi.org`),
servis çalışıyor mu, Caddy ayakta mı, güvenlik duvarı 443'ü açtı mı.
