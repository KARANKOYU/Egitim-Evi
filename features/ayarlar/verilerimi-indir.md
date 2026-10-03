# Hesap ayarları · Verilerimi indir

**Durum:** Tasarlandı — henüz kodda yok.

Eğitim Evi'nde senin adına saklanan bütün bilgilerin bir kopyasını, destek talebine gerek kalmadan, tek bir ZIP dosyası olarak
indirdiğin yer; veli aynı yolla çocuğunun verilerini de indirir.

## Ne işe yarar

KVKK'da kişinin kendi verisine erişim hakkı var. Kullanıcı 27 Eylül'de önerilerden bunu seçti: ""Verilerimi indir" (Ayarlar) … Kişi
kendi bilgilerini tek tıkla bir dosya olarak indirir; destek talebiyle uğraşılmaz. bunu unuttum". 29 Eylül'de kapsamı kararlaştırdı:
indirilen dosya **sunucuda saklanan her şeyi** içerir; öğrenci ve veli ekranda yalnız etkin ve son bir geçmiş yılı görse de gizlenen
eski yıllar da dosyaya girer.

## Nereden açılır

- Hesap ayarları → **"Gizlilik ve verilerim"** bölümü → **"Verilerimi indir"** satırı: "Bütün bilgilerinin kopyası · tek ZIP dosyası",
  altında "Önce şifren sorulur · günde en çok 3 kez", düğme **"İndir"** (Tasarım 1 önizlemesi). O gün hazırladıysan satırda "Bugün N kez
  hazırladın; M hakkın kaldı" da yazar.
- Velide aynı bölümde **"Çocuğumun verilerini indir"**: çocuğun adı ve sınıfı, altında "Yasal temsilcisi olarak; tek ZIP dosyası",
  **"İndir"**.
- Profil menüsünde **"Gizlilik ve verilerim — aydınlatma metni"** kısayolu bu bölüme götürür.
- Tasarım 1'in Hesap ayarlarındaki aydınlatma metni özeti "Haklarını nasıl kullanırsın?" sorusunda bu yolu anlatır: "Verilerinin
  kopyasını Hesap ayarları → Gizlilik ve verilerim → "Verilerimi indir" ile kendin alabilirsin."; tanıma göre gerçek aydınlatma metninin
  "haklarınız" bölümüne de yazılacak ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

## Adım adım

### Herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. Hesap ayarları → Gizlilik ve verilerim → "Verilerimi indir" → **"İndir"**.
2. **"Verilerimi indir"** penceresi: "Eğitim Evi'nde senin adına saklanan bütün bilgilerin bir kopyası tek bir ZIP dosyası olarak iner.
   İçinde makinece okunur `veriler.json` ve yazdırılabilir `verilerim.html` olur." Altında içindekilerin listesi:
   - "Hesap bilgilerin: ad, kullanıcı adı, e-posta, telefon, T.C. kimlik no, doğum tarihi"
   - "Portalların ve rollerin, açık oturumların ve cihazların"
   - "Bildirim tercihlerin ve son 90 günün bildirimleri"
   - "Gönderdiğin ve aldığın mesajlar (eklerin yalnız listesi)"
   - "Hatırlatıcıların, Eğitim Evi yorumun ve destek taleplerin"

   Öğrencide ayrıca "Ödevlerin, sonuçları ve teslim dosyalarının listesi" ve "Sınav notların, devamsızlığın, etüt ve servis kayıtların";
   velide "Bağlı çocukların".
   Not: "Başka kişilerin bilgileri girmez (mesajlarda karşı tarafın yalnız adı). Güvenliğin için önce şifren sorulur. Bugün N hakkın
   kaldı."
3. **"Vazgeç"** ya da **"Devam"** (hakkın bittiyse "Devam" basılmaz).
4. **"Kimliğini doğrula"** ekranı: "Verilerini indirmek için önce şifreni yaz." (doğrulama uygulaması kuruluysa onun kodu da) →
   **"Doğrula ve devam et"**. Sol üstteki "← Vazgeç" ile vazgeçersen "Vazgeçildi; hiçbir şey değişmedi."
   ([Doğrulama ekranlarından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md)).
5. **"ZIP hazırlanıyor…"** — "Bilgilerin toplanıyor; bu en çok bir dakika sürer."
6. **"Dosyan hazır"** — dosyanın adı (ör. `egitim-evi-verilerim-<kullanıcı-adı>-<tarih>.zip`), boyutu ve "içinde veriler.json ve
   verilerim.html"; altında "Bugün N kez hazırladın; M hakkın kaldı."
7. **"İndir"** → "İndiriliyor: <dosya adı>"; ya da **"Kapat"**.
8. Dosyayı aç: `verilerim.html` tarayıcıda bölüm bölüm okunur ve yazdırılır; `veriler.json` başka bir programa aktarılabilir (alan adları
   Türkçe ve açıklamalı).

### Veli: "Çocuğumun verilerini indir"

1. Velide her çocuk ayrı oturumdur (3 Ekim kararı); düğme bulunduğun oturumun çocuğu içindir
   ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).
2. Pencere **"Çocuğumun verilerini indir"**: çocuğun adına saklanan bilgiler; liste: "Çocuğunun hesap bilgileri: ad, sınıf, okul numarası",
   "Ödevleri, sonuçları ve teslim dosyalarının listesi", "Sınav notları, devamsızlığı, etüt ve servis kayıtları", "Okulun ona gönderdiği
   mesajlar ve son 90 günün bildirimleri".
3. Kimlik doğrulama ("Çocuğunun verilerini indirmek için önce şifreni yaz.") ve aynı hazırlanma adımları; dosya adı
   `egitim-evi-cocugumun-verileri-<…>-<tarih>.zip` biçiminde.

### Öğrenci

Kendi verisini indirir; dosyada ayrıca ödevleri ve sonuçları, teslim dosyaları (dosyalar hâlâ duruyorsa ZIP'in içine, toplam 200 MB'ı
aşarsa yalnız listesi), sınav notları, devamsızlık, etüt yoklaması, quiz cevapları ve puanları, servis kayıtları (saklama süresi
içindekiler) olur. Mezun olduğu okulun kayıtları ekrandan kalksa da dosyada her zaman vardır ([Mezunlar](../egitim-yili/mezunlar.md)).

### Okul yönetimi, yönetici ve destek

Bu düğmeyle **başkasının** verisini indiremez. Bir kişinin KVKK talebi destek üzerinden gelirse yönetici kişinin hesap sayfasından
indirir; işlem kaydına yazılır ([Hesaba müdahale](../yonetim/hesaba-mudahale.md)).

## Kurallar ve sınırlar

- **Önce şifre** (doğrulama uygulaması kuruluysa onun kodu da): açık kalmış bir oturumdan başkası indiremesin.
- **Günde en çok 3 kez** (Tasarım 1: "Bugün N hakkın kaldı"; hak bitince "Devam" basılmaz).
- **İşlem kaydı:** yalnız "veri indirildi" yazılır, içerik yazılmaz ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Dosya:** ZIP (Windows'ta çift tıkla açılsın); içinde `veriler.json` (makinece okunur) ve `verilerim.html` (insanın okuyacağı, bölümlü,
  yazdırılabilir tek sayfa; dış kaynak yok). Projede zaten olan ZIP yazıcısıyla, dış paket olmadan üretilir.
- **Kapsam (tanım):** hesap bilgileri (T.C. kendi verisi olduğu için açık), açılış ve son giriş, portallar ve roller, veli bağları, açık
  oturumlar ve cihazlar (anahtarlar hariç), bildirim tercihleri; öğrencide ödevler, sonuçlar, teslim dosyaları, sınav notları,
  devamsızlık, etüt yoklaması, quiz cevapları ve puanları, servis kayıtları; herkeste gönderdiği ve aldığı mesajlar (ekler yalnız liste),
  hatırlatıcılar, son 90 günün bildirimleri, açılış sayfası yorumu, destek talepleri, velide çocuğunun telefonu verisi (7 günlük),
  işlem kaydında **kendi yaptığı** işlemler. Tasarlanan başka bölümlerin verisi de girer (başarılar, eklentilerin kişiye bağlı verisi).
- **Saklanan her şey** (29 Eylül kararı): ekranda gizlenen eski yılların verisi de dosyaya girer.
- **Başka kişilerin verisi girmez:** mesajlarda karşı tarafın yalnız adı; sınıf arkadaşlarının bilgisi yok.
- **Üretim:** sunucuyu yormasın diye bellekte değil akışla üretilir; en çok 1 dakika sürer, "hazırlanıyor" gösterilir.
- **KVKK:** aydınlatma metninin "haklarınız" bölümüne bu yol yazılır, sürüm artar; SSS'ye "Bilgilerimin bir kopyasını nasıl alırım?"
  eklenir.

## Kardeşler ve ilgili

**Kardeşler:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Hesabımı sil](hesabimi-sil.md) · [Kişisel bilgiler](kisisel-bilgiler.md) ·
[Şifre ve güvenlik](guvenlik.md) · [Açık oturumlar](acik-oturumlar.md).

**İlgili:** [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md),
[Çocuklarım](../portallar/cocuklarim.md), [Mezunlar](../egitim-yili/mezunlar.md),
[Bildirimlerin saklanması](../bildirim/saklama-ve-silinme.md), [Quiz verisinin saklanması](../quiz/saklama-ve-silinme.md),
[Başarıların kalıcılığı](../basarilar/kalicilik-ve-silme.md), [İşlem kaydının sınırları](../islem-kaydi/saklama-ve-sinirlar.md),
[Hesaba müdahale](../yonetim/hesaba-mudahale.md).

## Kod tarafı

Bugün kodda yok. Tanım: "Kullanıcı arama + hesap penceresi … destek talepleri, Verilerimi indir" işi. Kodlanınca:

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar'a "Verilerimi indir" ve velide
  "Çocuğumun verilerini indir").
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) (hesabın uçları; şifreyle yeniden doğrulama), ödev dosyalarının
  toplu indirmesindeki ZIP yazıcısı ([sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md)), işlem kaydı.
- Aydınlatma metni: [public/kvkk/KLASOR.md](../../public/kvkk/KLASOR.md) ("haklarınız" bölümü, sürüm).

## Sık sorulanlar

- **Bilgilerimin bir kopyasını nasıl alırım?** Hesap ayarları → Gizlilik ve verilerim → "Verilerimi indir". Şifren sorulur, dosya bir
  dakika içinde hazırlanır.
- **Dosyada başkalarının bilgileri var mı?** Hayır; mesajlarda yalnız karşı tarafın adı.
- **Bugün neden indiremiyorum?** Günde en çok 3 kez hazırlanır; yarın yeniden dene.
- **Çocuğumun verilerini nasıl alırım?** Çocuğunun oturumundayken "Çocuğumun verilerini indir".

## Sırada

- Kullanıcı arama + hesap penceresi … Verilerimi indir (yöneticinin KVKK talebiyle indirmesi dahil).
- Aydınlatma metni: "haklarınız" bölümüne bu yolun yazılması (sürüm artar); SSS sorusu.
