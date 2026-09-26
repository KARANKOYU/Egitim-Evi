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

