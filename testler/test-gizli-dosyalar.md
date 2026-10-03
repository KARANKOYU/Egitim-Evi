# testler/test-gizli-dosyalar.js

Depo herkese açık olduğu için gizli ve kişisel dosyaların git'e giremeyeceğini, `.gitignore` kurallarına gerçekçi yol örnekleri
vererek deneyen sunucusuz paket (41 denetim).

## Bu dosya ne yapar?

Eğitim Evi'nin deposu GitHub'da herkese açık. Oysa çalışan bir kurulumun `data/` klasöründe veritabanı şifresi, yönetici
hesapları (`admins.json`), telefon bildirimi anahtarı, yedekler, öğrencilerin yüklediği ödev dosyaları ve mesaj ekleri durur.
Biri dalgınlıkla `git add .` derse bunların hepsi dünyaya açılır. Bunu önleyen tek şey kökteki `.gitignore`'dur; ama bir kural
yanlışlıkla silinir ya da daraltılırsa (ör. `/data/` yerine tek tek dosya adları yazılırsa) sunucunun sonradan yazdığı yeni bir
dosya korumasız kalır ve bunu kimse fark etmez.

Bu paket o sessiz bozulmayı yakalar. Yaptığı şey çok basit: korunması gereken her yer için uydurma ama gerçekçi bir yol verir
ve git'e "bu yol dışarıda mı?" diye sorar. Dosyanın diskte var olması gerekmez; git yalnız kurallara bakar, bu yüzden test
`data/`'nın içine hiç girmez. Sonra tersini dener: depoya girmesi gereken örnek dosyalar (ör. `belge/admins.ornek.json`) bir
kurala yanlışlıkla takılmamalı. En sonda da depoda zaten izlenen bir dosyanın gizli kurallara takılıp takılmadığına bakar
(takılıyorsa ya kural yanlış ya dosya sızmış).

Dosyanın başındaki yorum sözünü şöyle veriyor: "`.gitignore`'un her kuralı gerçek bir yol örneğiyle denenir; kural yanlışlıkla
silinir ya da daraltılırsa bu test kalır." (Bu sözün bugün tam tutmadığını "Dikkat!"te anlatıyorum.)

Kim kullanır: `testler/tumtest.sh` her tam koşuda sunucusuz paketlerin en sonunda çalıştırır; ayrıca kök belge
[../TANITIM.md](../TANITIM.md) kuralları arasında "commit'ten önce `git status`'ta `data/` görünmemeli ve bu paket geçmeli"
der.

## İçinde neler var?

### Yardımcılar

- `kontrol(ad, sart, detay)` — öteki paketlerdeki gibi: `GECTI` / `KALDI` satırı yazar, sayaçları artırır.
- `KOK` — proje kökü (`testler/`'in bir üstü). Git komutları hep bu klasörde çalışır; paketi hangi klasörden başlattığın önemli
  değildir.
- `disaridaMi(yol)` — `git check-ignore -q --no-index <yol>` çalıştırır. Çıkış kodu 0 ise yol bir kurala takılıyor demektir
  (`true`), 1 ise takılmıyor (`false`); başka bir kod (ör. 128: git hatası) gelirse hata yukarı fırlatılır. `--no-index`
  sayesinde dosya depoda izleniyor olsa bile yalnız kurallara bakılır.
- Git var mı: önce `git --version` denenir. Git yoksa ekrana `ATLANDI  git yok` ve `GECTI: 0   KALDI: 0` yazılır, çıkış kodu 0.

### `DISARIDA` — depoya GİREMEMESİ gereken 33 yol

| Örnek yollar | Onları yakalayan kural | Ne korunuyor |
|---|---|---|
| `data/ayarlar.json`, `data/admins.json`, `data/config.yml`, `data/push-anahtar.json`, `data/okullar.json`, `data/db.json`, `data/yedek/yedek-2026-09-27_0300.json`, `data/dosyalar/odev/a.pdf`, `data/ekler/ek.pdf`, `data/okul-fotolari/kapak.jpg`, `data/sonradan-eklenen-dosya.json` (11) | `/data/` | veri klasörünün tamamı; sonuncusu "sunucu yarın yeni bir dosya yazsa da" örneği |
| `veri/ayarlar.json` | `/veri/` | eski veri klasörü adı |
| `admins.json`, `sunucu/admins.json`, `belge/admins.json` | `admins.json` | yönetici hesapları dosyası yanlış yere kopyalansa bile |
| `.env`, `.env.local` | `.env`, `.env.*` | ortam değişkenleri |
| `sunucu.pem`, `ozel.key` | `*.pem`, `*.key` | sertifika ve anahtarlar |
| Android uygulamasının imzasıyla ilgili üç örnek yol (yerel imza dosyaları, depoya girmez) | üç ayrı kural | uygulama imzası |
| `id_rsa`, `.npmrc` | `id_rsa*`, `.npmrc` | SSH anahtarı, paket deposu belirteci |
| `yedek-elle-2026.json`, `dokum.sql.gz` | `yedek-*.json`, `*.sql.gz` | elle alınmış yedek ve veritabanı dökümü |
| `sunucu.log` | `*.log` | günlükler (e-posta ayarsızken iki adımlı kodlar ve onay anahtarları bunlara yazılır) |
| `testler/testdata/ayarlar.json` | `testler/testdata/` | test sunucusunun veri klasörü |
| `baslat.bat`, `araclar/okullari-cek.js` | `*.bat`, `araclar/okullari-cek.js` | yerel kısayollar, okul listesi aracı |
| `public/_deneme.html` | `public/_*` | yerel deneme sayfaları |
| `yapi/liste.xlsx`, `.claude/ayarlar.json` | `yapi/`, `.claude/` | kullanıcının örnek listeleri, yerel araç ayarları |

(`data/yedek/yedek-…json` hem `/data/` hem `yedek-*.json` kuralına takılır.)

### `IZLENIR` — depoya GİRMESİ gereken 7 yol

`belge/admins.ornek.json`, `belge/config.ornek.yml`, `sunucu/yonetici-dosyasi.js`, `public/index.html`,
`sunucu/veri/sema/001-ilk.sql`, `testler/test-gizli-dosyalar.js`, `package.json`. Seçilenlerin çoğu bir kurala çok yakın
duruyor: `belge/admins.ornek.json` `admins.json` kuralına, `001-ilk.sql` `*.sql.gz`'ye, bu dosyanın kendisi `testler/testdata/`
kuralının yanındaki klasöre. İlk ikisi `.gitignore`'un kendi yorumunda "örnekleri belge/ altında" diye anılan dosyalardır.

### Son denetim

`git ls-files -ci --exclude-standard` — depoda izlenen (`-c`) ve aynı zamanda kurallara takılan (`-i`) dosyaları listeler.
Liste boş olmalı; boş değilse `KALDI` satırına ilk beş dosya yazılır.

Toplam: 33 + 7 + 1 = 41 denetim. Sonunda boş satır ve `GECTI: 41   KALDI: 0`; `KALDI` varsa çıkış kodu 1.

## Kimle konuşur?

- **Çağırdıkları:** Node'un `child_process` (`execFileSync`) ve `path` modülleri; git'in yalnız okuyan üç komutu:
  `--version`, `check-ignore`, `ls-files`. Sunucu, veritabanı, ağ yok. Hiçbir dosya yazmaz.
- **Koruduğu dosya:** kökteki `.gitignore` (kendi `.md`'si yok; kök dosyaları [../TANITIM.md](../TANITIM.md) anlatır, depoda
  olmayanların listesi orada).
- **Veri klasörünü anlatan belgeler:** [../sunucu/yollar.md](../sunucu/yollar.md) (`data/` nereden gelir, `EE_DATA`),
  [../sunucu/ayarlar.md](../sunucu/ayarlar.md) (`data/ayarlar.json`), [../sunucu/yonetici-dosyasi.md](../sunucu/yonetici-dosyasi.md)
  (`admins.json`), [test-ayarlari.md](test-ayarlari.md) (`testler/testdata/` içine yazılan test ayarı).
- **Onu çalıştıran:** `testler/tumtest.sh` — sunucusuz paketler döngüsünün onuncu ve son paketi (`test-quiz-metin`'den sonra).
  Döngü çıktıdan `KALDI ` ya da `HATASI` geçen satırları ve son `GECTI:` satırını alır; özet satırı yoksa paketi
  "PAKET CALISMADI" diye yazar ve bir kaldı sayar.

## Nasıl çalışır (adım adım)?

```
git --version ── yok ─► "ATLANDI git yok", GECTI: 0 KALDI: 0, çıkış 0
      │ var
      ▼
33 yol: git check-ignore -q --no-index <yol>   (KOK'ta)
          çıkış 0 ─► GECTI "depoya giremez: …"
          çıkış 1 ─► KALDI
          başka   ─► hata fırlatılır (paket durur)
 7 yol: aynı komut, tersine: çıkış 1 ─► GECTI "depoya girer: …"
git ls-files -ci --exclude-standard ─► boş mu? ─► GECTI / KALDI (ilk 5 dosya)
GECTI: n   KALDI: m ─► çıkış kodu (m ? 1 : 0)
```

## Dikkat!

- **"Her kural denenir" sözü tam değil.** `.gitignore`'da 49 kural satırı var; paket bunlardan 21'ine örnek yol veriyor.
  Örneği olmayan 28 kural: `*.p12`, `*.pfx`, `id_ed25519*`, `.netrc`, `*.dump`, `*.backup`, `*.sqlite`, `*.sqlite3`,
  `*.bozuk-*`, `*.tasindi`, `npm-debug.log*`, `node_modules/`, `coverage/`, `belge/ekran-goruntuleri/`, `tasarim/ornekler/`,
  `araclar/chrome-profil/`, `araclar/chrome-profil-tema/`, `testler/chrome-*/`, `testler/deneme.xlsx`, `testler/*.birlesik.*`,
  `*.tmp`, `*.bak`, `*.swp`, `Thumbs.db`, `desktop.ini`, `.DS_Store`, `.vscode/`, `.idea/`. Bunlardan biri silinse paket yine
  geçer. Özellikle önemli olanlar: tarayıcı profili klasörleri (`.gitignore`'un kendi yorumuna göre içinde oturum çerezi kalır)
  ve `*.bozuk-*` / `*.tasindi` (commit 520'den önceki yorumda "içlerinde gerçek kişisel veri var" denen bozuk/taşınmış veri
  kopyaları; `data/` dışına düşerlerse yalnız bu kurallar korur). Kod değiştirilmedi; öneri: bu kurallara da birer örnek yol.
- **Sonuç bu bilgisayarın git ayarlarına da bağlı.** `check-ignore` ve `ls-files --exclude-standard` yalnız depodaki
  `.gitignore`'u değil, `.git/info/exclude`'u ve kişinin genel `core.excludesFile`'ını da okur. Bir kural yalnız bu
  bilgisayarın genel ayarında yazılıysa "depoya giremez" denetimi geçer ama depo (ve başka bilgisayardaki kopya) korumasız
  kalır; tersine, genel ayardaki geniş bir kural "depoya girer" denetimlerini bozabilir.
- **Git yoksa sessizce geçer.** `ATLANDI git yok` satırını `tumtest.sh` ekrana basmaz (yalnız `KALDI ` / `HATASI` satırlarını
  süzer); özet `GECTI: 0   KALDI: 0` olarak toplama eklenir, hiçbir uyarı çıkmaz.
- **Depo olmayan klasörde paket çöker.** Proje git deposu değilse (ör. GitHub'dan zip ile indirilmiş kopya) `check-ignore`
  128 ile döner, `disaridaMi` hatayı fırlatır, yakalayan yok: Node yığını yazar ve özet satırı çıkmaz. `tumtest.sh` bunu
  "PAKET CALISMADI" sayar (koddan çıkarım; denenmedi).
- **Sızmış dosyayı yakalar ama silmez.** `git add -f` ile zorla eklenmiş bir gizli dosya ya da sonradan eklenen bir kuralın
  kapsadığı izlenen dosya son denetimde `KALDI` verir. Kural eklemek dosyayı depodan çıkarmaz (`git rm --cached` gerekir) ve
  dosya geçmişte kalır; o yüzden bu paket commit'ten ÖNCE çalışmalı.
- **Yeni bir gizli dosya türü eklerken iki iş var:** `.gitignore`'a kural ve `DISARIDA`'ya o kuralı deneyen bir örnek yol.
  Yalnız birini yaparsan ya koruma yoktur ya da korumanın bozulduğunu kimse görmez.
- **Belgeler de denetlenir.** Her kod dosyasının yanına eklenen `.md`'ler depoda izlenir; son denetim her koşuda hiçbirinin
  bir kurala takılmadığını gösterir. `.claude/` kuralı ise yerel geliştirme notlarının hiç depoya girmemesini sağlar.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda çalıştırır. Sunucu gerekmez.
- Elle (Git Bash, proje kökünde): `node testler/test-gizli-dosyalar.js`. Commit'ten önce `git status`'a bakmakla birlikte
  çalıştırmak yeterlidir.
- 3 Ekim'de bu belge için çalıştırıldı (belgenin denetiminde bir kez daha): `GECTI: 41   KALDI: 0`, çıkış 0, 1–1,5 saniye;
  33 "depoya giremez", 7 "depoya girer" ve izlenen dosya denetiminin hepsi geçti. `.gitignore`'daki kural sayıları da
  denetimde yeniden sayıldı (49 kural, 21'i örnekli).
- Aynı alanı başka bir paket denemez. Bu paket dosya **adlarına** bakar; izlenen bir dosyanın **içine** gizli bilgi yazılmasını
  (ör. bir belgeye şifre) yakalamaz.

## Son durum

- `git log`: tek commit. Dosya `4f8e484 commit 520` (2026-09-27) ile 54 satır olarak eklendi ve o günden beri değişmedi.
  Aynı commit `.gitignore`'u baştan düzenledi: tek tek veri dosyası adları (`data/db.json`, `data/yedek/`, `data/config.yml` …)
  yerine `/data/` ve `/veri/` bütünüyle dışarıda; `admins.json` her yerde; sertifika, anahtar ve imza kuralları; döküm ve yedek
  kopyaları (`*.dump`, `*.backup`, `*.sqlite*`, `yedek-*.json` yeni; `*.bozuk-*` ve `*.tasindi` eskiden yalnız `data/` altındaydı);
  `public/_*.html|js|xlsx` yerine `public/_*`; `*.bak`, `*.swp`, `desktop.ini`, `.vscode/`, `.idea/`, `coverage/`,
  `npm-debug.log*`. Ayrıca `testler/tumtest.sh`'nin sunucusuz paket listesine bu paketi ekledi. `.gitignore` da o günden beri
  değişmedi.
- Bilinen açık (kod değiştirilmedi): örneği olmayan 28 kural ("Dikkat!").
- Planlı işlerden bu dosyayı etkileyecekler:
  - **"Optimizasyon + saklama süreleri … günlük yedek .tar.gz"** ve **"Yıl geçişi … okul yedeği (.7z + AES, imzalı)"** — yedekler
    `data/` altına yazılırsa zaten korunur; başka bir yere yazılırsa `.gitignore`'da `*.tar.gz` ya da `*.7z` kuralı yok (yalnız
    `*.sql.gz`): kural ve `DISARIDA`'ya örnek yol eklenmeli.
  - **"EKLENTİLER (.egitimevi paketi …)"** — tanım şimdilik kodsuz; yüklenen paketlerin nerede duracağı belli olunca aynı soru.
  - **Belgeleme** (kullanıcının önceliği) — kalan `.md`, `KLASOR.md` ve `features/` belgeleri izlenecek; son denetim onların
    hiçbir kurala takılmadığını gösterecek. Belgeleme işinin son parçasında yazılacak `testler/test-belgeler.js` bu paketin
    yanına, sunucusuz listeye girecek.
