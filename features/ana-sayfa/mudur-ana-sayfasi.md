# Ana sayfa · Müdürün ana sayfası

**Durum:** Kodda var; tasarımda ek olarak başlıkta bugünün tarihi ve okulun sayıları, yedi kutucuk (Öğrenciler, Çalışanlar, bugünün Devamsızlığı, Sınıflar, Mesajlar, Servisler, Özellikler), "Bugün dikkat" listesi, okulun o günkü dersleri ("Bugünün dersleri") ve "Gün seç", e-postası olmayan müdüre sayfanın içinde "E-posta eklemek ister misin?" şeridi; ödev, "Kendi derslerim", sayaçlar ve Ders Programı / Excel Aktarım / Ayarlar kutucukları yoktur (Tasarım 1 önizlemesi; kullanıcının 29 Ağustos ve 2 Ekim sözleri).

Müdürün girişten sonra ilk gördüğü sayfa: okulun tamamına bakan kutucuklar, öğrenci-öğretmen-sınıf sayıları, okulun dosya alanı ve yeni kurulan okula "nereden başlarım" ipucu.

## Ne işe yarar

Müdür okulun bütününe bakar; ödev vermek, sınav açmak, kendi öğrencileri öğretmen işidir. Kullanıcı 29 Ağustos'ta
"ödevler müdürün front page de olmicaaaaaak" ve "kendi öğrencilerim falan olmicak … sadece o günkü dersler ders 1 ders 2
müdürünkinin editlenmeyen haliyle yazcak 9-a mat gibi … eğer isterse gün seç ten başka güne bakabilir" dedi; 2 Ekim'de
"müdürün niye kendi derslerim var" diye sordu. Bugünkü kodun ana sayfası da ödevle dolmaz; tasarımda müdür günün okul
durumunu (yoklaması alınmayan sınıflar, gelmeyenler, gecikmeler) ve okulun o günkü ders düzenini görür.

## Nereden açılır

- **Girişten sonra kendiliğinden.** Müdür yetişkin hesabıyla girer; tek oturumu varsa doğrudan okulun müdür oturumuna, birden
  çok oturumu varsa önce seçme ekranına düşer ([Portal seçme ekranı](../portallar/portal-secme-ekrani.md)).
- **Sol menünün ilk satırı:** **"Ana Sayfa"** (tasarımda **"Ana sayfa"**; [Sol menü](../menu-ve-arama/sol-menu.md)).

## Adım adım

### Müdür

**Bugünkü kodda:**

1. Başlık **"EĞİTİM EVİNE HOŞ GELDİNİZ"**, altında **"Merhaba Murat — Test Ortaokulu müdürü"**. Okulda birden çok eğitim yılı
   varsa en üstte "Eğitim yılı" seçicisi.
2. Yedi renkli kutucuk ([Kutucuklar](kutucuklar.md)):

   | Kutucuk | Renk | Alt yazı | Sağ üstteki sayı | Bastığında |
   |---|---|---|---|---|
   | **Öğretmenler** | yeşil | "28 öğretmen"; eski düzenden bekleyen başvuru varsa "2 başvuru bekliyor" | bekleyen başvuru sayısı | [Öğretmenler](../ogretmenler-calisanlar/liste.md) |
   | **Öğrenciler** | lacivert | "412 öğrenci" | — | [Öğrenciler](../hesaplar/ogrenci-listesi.md) |
   | **Sınıflar** | camgöbeği | "16 sınıf" | — | [Sınıflar](../siniflar-dersler/sinif-acma.md) |
   | **Ders Programı** | mavi | "Haftalık program ve ders atamaları" | — | [Ders programı kurma](../ders-programi/program-kurma.md) |
   | **Devamsızlık** | turuncu | "Okul geneli yoklama özeti" | — | [Okulun devamsızlığı](../devamsizlik/okulun-devamsizligi.md) |
   | **Excel Aktarım** | mor | "Toplu öğrenci ve program" | — | [İçe aktarım](../excel-aktarim/ice-aktarim.md) |
   | **Ayarlar** | gri | "Hesap bilgilerin" | — | [Ayarlar](../ayarlar/hesap-ayarlari-sayfasi.md) |

3. Üç sayaç: **"Öğrenci"**, **"Öğretmen"**, **"Sınıf"**.
4. **"Okulun dosya alanı"** kartı (yalnız müdürde): doluluk çubuğu **"Kullanılan 3,2 GB / 5 GB"** (%80'den sonra turuncu, %95'ten
   sonra kırmızı), altında dağılım **"Ödev teslim dosyaları 2,1 GB · Ekler 1 GB · Okul sayfası fotoğrafları 4 MB. Yazılar,
   notlar ve öbür kayıtlar bu alana sayılmaz."** %80'i geçince **"Alanın %83'i doldu. Teslim dosyaları son teslimden 7 gün
   sonra, ekler 7 gün sonra kendiliğinden silinir; gerekirse sistem yöneticisinden alan isteyebilirsin."**; dolunca kırmızı
   **"Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da yöneticiden alan isteyebilir."**
   ([Okulun dosya alanı](../okul-disk/doluluk.md), [Uyarılar](../okul-disk/uyarilar.md)).
5. Okul yeni kurulduysa mavi ipucu:
   - hiç sınıf yoksa **"Henüz sınıf açmadın. Sınıflar sayfasından başlayıp derslerini tanımla, sonra öğretmen ata."**;
   - sınıf var ama öğrenci yoksa **"Okulda kayıtlı öğrenci yok. Tek tek ekleyebilir ya da Excel Aktarım ile listeyi toplu
     yükleyebilirsin."**
6. E-postası olmayan hesapta girişten sonra bir kez **"E-posta eklemek ister misin?"** penceresi ("Bir daha sorma", "Sonra",
   "E-posta ekle"; [E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md)).
7. Ana sayfada ödev listesi yoktur. Müdürün menüsünün sonunda bugünkü kodda **"Kendi Derslerim"** başlığı altında "Sınavlar" ve
   "Yoklama" durur (ders veren müdür için); ana sayfaya girmez.

**Tasarımda (Tasarım 1 önizlemesi):**

1. Başlık bugünün tarihi (**"Perşembe, 1 Ekim"**), altında okulun adı ve sayıları: **"Test Ortaokulu · 412 öğrenci · 28 öğretmen"**.
2. E-postan yoksa başlığın altında bir şerit: **"E-posta eklemek ister misin?"** · "Şifreni unutursan sıfırlama bağlantısı,
   önemli işlerde de doğrulama kodu bu adrese gelir." · **"Sonra"** / **"Ekle"**. "Ekle" e-posta penceresini açar; "Sonra"
   şeridi kapatır ve "İstediğin zaman Hesap ayarları → Giriş bilgileri'nden ekleyebilirsin." der
   ([E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md)).
3. Yedi kutucuk, hepsi aynı boyda (geniş ekranda dört sütun):

   | Kutucuk | Renk | Alt yazı (örnek) | Sayı | Bastığında |
   |---|---|---|---|---|
   | **Öğrenciler** | mor | "412 öğrenci" | — | [Öğrenciler](../hesaplar/ogrenci-listesi.md) |
   | **Çalışanlar** | mavi | "31 çalışan" | — | [Çalışanlar](../ogretmenler-calisanlar/liste.md) |
   | **Devamsızlık** | kırmızı | "bugün 14 öğrenci" | bugün gelmeyen öğrenci sayısı | [Okulun devamsızlığı](../devamsizlik/okulun-devamsizligi.md) |
   | **Sınıflar** | turuncu | "16 sınıf" | — | [Sınıflar](../siniflar-dersler/sinif-acma.md) |
   | **Mesajlar** | yeşil | "4 okunmamış" | okunmamış sayısı | [Mesajlar](../mesaj/kutu.md) |
   | **Servisler** | sarı | "3 servis yolda" | — | [Servisler](../servis/servisler-sayfasi.md) |
   | **Özellikler** | gri | "8 bölüm açık" | — | [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md) |

   **Ödevler kutucuğu yoktur** (müdür ödev kontrol etmez; okulun ödevlerine menüdeki "Ödevler"den bakar:
   [Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md)). Ders Programı, Excel Aktarım ve Ayarlar menüde ya da profil
   menüsündedir. "N başvuru bekliyor" yazısı yoktur.
4. Kutucukların altında iki sütun (telefonda alt alta):
   - **Solda "Bugün dikkat"**: **"3 sınıfta yoklama alınmadı · 2. ders · 6-B, 7-C, 8-A"** ve **"Bak"**; **"14 öğrenci gelmedi
     · 9 izinli · 5 izinsiz"** ve **"Liste"** (ikisi de Devamsızlık'a); **"Servis 4 gecikiyor · 12 dakika · şoför bildirdi"**
     ve **"Ara"** (Servisler'e). ([Yoklama alınmadı uyarısı](../devamsizlik/yoklama-alinmadi-uyarisi.md))
   - **Sağda "Bugünün dersleri"**: okulun o günkü bütün dersleri, düzenlenemez. Her satırda solda ders numarası ve saati
     (**"1. ders"**, "08:30–09:10"; programdaki saatlerin dışında kalan ders **"Ek ders"**), sağda o saatte ders olan her sınıf
     için renkli bir etiket: **"7-A Mat"**, **"8-B Tür"** (sınıf + dersin kısaltması; üstüne gelince "7-A · Matematik").
     Başlığın sağında **"Gün seç"** (takvimli tarih kutusu; eğitim yılının ilk ve son günü arasında). Başka bir gün seçince
     başlık **"Cuma, 2 Ekim dersleri"** olur ve yanında bugüne dönen **"Bugün"** düğmesi çıkar. Tatil gününde **"Cumhuriyet
     Bayramı · ders yok"**, dersi olmayan günde **"Cumartesi günü ders yok."**
5. Menüde **"Kendi derslerim"** yoktur (Sınavlar ve Yoklama oradan kalkar; okulun bütün sınavları "Okul düzeni" altındaki
   "Sınavlar"dadır). Menüdeki "Öğretmenler" satırının adı **"Çalışanlar"**dır.
6. Okul bir bölümü kapattıysa o bölümün kutucuğu bütün rollerde olduğu gibi müdürün ana sayfasından da kalkar
   ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
7. Uygulamayı kurmamışsan **"Eğitim Evi'ni telefonuna kur"** kartı, bildirim izni verilmemişse **"Bildirimlere izin ver"**
   şeridi, başlığın önünde **"Yenile"**.
8. **Tanımda olup önizlemede çizilmeyenler** (Tasarlandı):
   - **"Hesabını daha güvenli yap"** kartı: müdüre doğrulama uygulaması (TOTP) önerilir; ana sayfada ve Ayarlar'da durur,
     kapatılabilir (sistem tanımı, 27 Eylül; [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md)).
   - Eğitim içerikleri öneri şeridi ([Ana sayfadaki öneri şeridi](../egitim-icerikleri/ana-sayfa-seridi.md)).
   - **"Okulun dosya alanı" kartı** önizlemenin müdür ana sayfasında çizilmemiştir (doluluk bildirimle gelir); kartı kaldıran bir
     karar yok, dosya alanı tanımı "Ayarlar ya da ana sayfa kartı" der. Kodlanırken nerede duracağı kullanıcıya sorulacak.
   - **Devamsızlık sınırı uyarısı** (kullanıcının 3 Ekim kararı): özürsüz devamsızlık sınırına yaklaşan öğrenci için müdüre de
     uyarı gider ve müdürün **"Sınıra yaklaşanlar"** listesi olur ([Devamsızlık sınırı uyarısı](../devamsizlik/devamsizlik-siniri-uyarisi.md)).
     Listenin ana sayfada ("Bugün dikkat"in yanında) mı yoksa Devamsızlık sayfasında mı duracağı tanımda yazılı değil.
   - **"Önemli" etiketli duyuru** (3 Ekim kararı): gelen "Önemli" mesaj ya da duyuru sayfanın üstünde kapatılana kadar şerit olarak
     durur; etiketi öğretmen, müdür ve yetkili çalışanlar koyabilir (tanımda öneri) ([Önemli etiketi](../mesaj/onemli-etiketi.md)).

## Kurallar ve sınırlar

- **Veri:** tek küçük istek, `GET /api/school/ozet` → öğrenci, sınıfsız öğrenci, öğretmen, bekleyen başvuru ve sınıf sayıları
  (yalnız müdüre `disk`). Okulun bütün öğrenci listesi bu sayfada indirilmez (720 öğrencilik okulda büyük olurdu).
- **Disk kartını yalnız müdür görür**; öğretmen ve öbür yetkililer görmez.
- **"Excel Aktarım" kutucuğu** "Excel ile içe ve dışa aktarım yapar" (`aktarim.yap`) yetkisine bağlıdır; müdürde her zaman
  vardır (ön yüzde müdür ve yönetici her yetkiyi taşır sayılır).
- **"N başvuru bekliyor"** eski düzenin kalıntısıdır: kişi koduna geçilmeden önceki öğretmen başvurularını sayar; bugün yeni
  başvuru oluşmaz ([Onay bekleyenler](../ogretmenler-calisanlar/onay-bekleyenler.md)). Planlı temizlikte kalkar.
- **Kapalı bölüm:** "Devamsızlık" kapalıysa Devamsızlık kutucuğu düşer; Öğretmenler, Öğrenciler, Sınıflar, Ders Programı,
  Excel Aktarım ve Ayarlar bir bölüme bağlı değildir, hep durur.

## Kardeşler ve ilgili

**Kardeşler:** [Kutucuklar](kutucuklar.md) · [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) ·
[Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) · [Velinin ana sayfası](veli-ana-sayfasi.md) ·
[Servisçinin ana sayfası](servisci-ana-sayfasi.md) · [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) ·
[Yöneticinin ana sayfası](yonetici-ana-sayfasi.md). Klasör: [Ana sayfa](README.md).

**İlgili:**

- [Öğretmenler ve çalışanlar listesi](../ogretmenler-calisanlar/liste.md), [Onay bekleyenler](../ogretmenler-calisanlar/onay-bekleyenler.md).
- [Öğrenci listesi](../hesaplar/ogrenci-listesi.md), [Sınıf açma](../siniflar-dersler/sinif-acma.md),
  [Ders programı kurma](../ders-programi/program-kurma.md), [İçe aktarım](../excel-aktarim/ice-aktarim.md).
- [Okulun devamsızlığı](../devamsizlik/okulun-devamsizligi.md), [Yoklama alınmadı uyarısı](../devamsizlik/yoklama-alinmadi-uyarisi.md).
- [Okulun dosya alanı](../okul-disk/doluluk.md), [Dosya alanı uyarıları](../okul-disk/uyarilar.md).
- [Servisler sayfası](../servis/servisler-sayfasi.md), [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md),
  [Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md).
- [E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md), [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md).
- Rol kapısı: [Müdür](../roller/mudur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — `SAYFALAR.ana`'nın müdür kolu,
  `stat`; [public/js/parcalar/08d-okul-disk.md](../../public/js/parcalar/08d-okul-disk.md) — `okulDiskKarti`;
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — `epostaOnerisi`;
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — müdürün menüsü ("Okul Düzeni", "Kendi Derslerim").
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`GET /api/school/ozet`),
  [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md) (disk hesabı).
- Görünüm: `public/css/parcalar/10-ana-sayfa-kutucuklari.css`, `04-kartlar.css`, `36-ayar-kartlari.css` (disk kartı) —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/test-okul-disk.md](../../testler/test-okul-disk.md) (müdür `ozet`'te diski görür, öğretmen görmez),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).

## Sık sorulanlar

- **Ana sayfamda neden ödevler yok?** Müdür ödev kontrol etmez; okulun ödevlerine menüdeki "Ödevler"den, ders ders bakarsın.
- **"2 başvuru bekliyor" ne demek?** Eski düzende öğretmenin kendi seçtiği okula yaptığı başvurular; "Öğretmenler" sayfasından
  onaylar ya da reddedersin. Bugün öğretmen kişi koduyla eklenir, yeni başvuru oluşmaz.
- **Dosya alanı dolarsa ne olur?** Yeni teslim dosyası, ek ve okul sayfası fotoğrafı yüklenemez; var olan dosyalar silinmez.
  Sistem yöneticisinden alan isteyebilirsin.
- **Başka bir günün derslerine nasıl bakarım?** Tasarımda "Bugünün dersleri"nin yanındaki "Gün seç"ten.

## Sırada

- Tasarım 1'deki ana sayfa (tarihli başlık, yedi kutucuk, "Bugün dikkat", "Bugünün dersleri" ve "Gün seç", e-posta şeridi;
  "Kendi derslerim"in kalkması) — Linux kodlaması.
- "Paneller" (iş 5): "başvuru bekliyor" kalıntısının temizliği.
- "Sistem" (iş 4) ve TOTP: "Hesabını daha güvenli yap" kartı.
- Disk kartının yeri (ana sayfa mı, Ayarlar mı) — kullanıcıya sorulacak.
- "Devamsızlık sınırı uyarısı" (3 Ekim kararı): "Sınıra yaklaşanlar" listesinin yeri — kullanıcıya sorulacak.
- Android uygulaması: müdürün ana sayfası (özet kutucukları: öğrenci/öğretmen sayısı, bugünkü devamsızlık, yaklaşan etkinlikler).
