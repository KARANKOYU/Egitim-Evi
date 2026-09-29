# Eğitim Evi — katkıda bulunanlar

Eğitim Evi bir okul grup projesi olarak 28 Ağustos 2026'da başladı. Aşağıda kimin hangi fikirle katkı verdiği yazar.

## Enes — [@KARANKOYU](https://github.com/KARANKOYU) (proje sahibi)

Projenin yapısını kurdu, bütün ürün kararlarını verdi ve kodun yazımını yönetti. Kodun büyük bölümü yapay zekâ desteğiyle, Enes'in tarif
ettiği biçimde ve onun denetiminde yazıldı. Aşağıdakiler Enes'in fikirleri:

**Hesap, giriş ve oturum yapısı**
- Tek hesap, çok portal: aynı hesapla bir okulda öğretmen, başka okulda müdür, çocuğunun velisi; "Öğrenci · okul", "Müdür · okul" gibi portallar.
- Bir öğrencinin aynı anda okul ve dershane gibi birden çok kurumda olabilmesi; yeni kurum eklediğinde portalın kendiliğinden düşmesi; Excel'de "kayıt bulundu, eşleyelim mi?".
- Kullanıcı adının bütün sitede geçmesi; "Giriş yap", okulun kendi sayfasından doğrudan o okulun portalına giriş ve girişte "Okul seç".
- 16 haneli kişi kodu (tireleri kendisi koyan kutu, "Kopyala"); öğrencinin veli kodu.
- Zorunlu iki adımlı giriş (e-postaya 6 haneli kod); öğrencide isteğe bağlı iki adım (kod ya da doğrulama uygulaması), şifre değişse de süren doğrulama.
- Yönetici ve destek için doğrulama uygulaması (TOTP); önemli işlerde yeniden kod.
- Aynı T.C., e-posta ve kullanıcı adı çakışmalarının önlenmesi; bir e-postanın tek hesapta olması.
- Okula "çalışan" olarak katılma; müdürün başka bir çalışanı onaysız müdür yapması; müdür çıkarmada ortak karar.
- Beni hatırla, şifremi unuttum, şifrede göz, yanlış girişte kırmızı uyarı; her kayıt ve girişte bot doğrulaması.
- Okul bilgisayarlarında (okulda telefon yasak olduğu için) kodsuz giriş yapılabilen okul cihazları.
- Okulun tahtaları için "tahta." ile başlayan tahta hesapları.

**Okul yönetimi**
- Gizli yönetim paneli: yönetici değilsen `/admin` bilinmeyen sayfa gibi görünür; yönetici hesapları sunucu açıkken düzenlenebilen bir dosyadan; site ayarları (okul adresleri, yapımcılar, iletişim).
- Yönetici ve destek panelleri; okulların boş bir masaüstündeki dosyalar gibi durduğu, sürüklenip bırakılan okul gezgini; müdürün koyduğu okul simgesi (128×128, kare değilse beyaz dolgu).
- Destek ekibi, kullanıcı arama (`/users/<ad>`), hesap penceresinden şifre ve e-posta değiştirme; destek talepleri (aynı anda en çok 2, bir hafta, talep kısıtlama, yetkilinin adının gizli kalması).
- Müdürün sınıf açması, derse öğretmen ataması, ders programı (Pazartesi–Pazar, saat aralıklı, çakışma uyarısı); öğretmenin kendi programı.
- Özel roller: adını müdür koyar, yetkilerini seçer; Zümre Başkanı, Müdür Yardımcısı, Öğretmen, Kodlayıcı gibi hazır roller; öğrenci şifresi değiştirme, okul fotoğrafı ekleme gibi yetkiler.
- Okulun bölümleri (ödev, etüt, devamsızlık, servis…) kapatabilmesi.
- Excel ile içe ve dışa aktarım (xlsx, xls, CSV), boş şablon, alt alta yazılmış isimlerden aktarma.
- Okul disk sınırı; büyük dosyaların telefonda küçültülmesi; ödevde dosya yükleme izni (varsayılan kapalı) ve dosya silme kuralları.
- Eğitim yılı; öğrenci ve velinin yalnız son bir geçmiş yılı görmesi; eski mesaj ve quizlerin belli süre sonra silinmesi.
- Yıl sonu geçişi (sınıflar bir üst sınıfa geçsin mi), okul başına şifreli yedek (varsayılan sınır 1), günlük sunucu yedeği.
- Öğrenci hesabının kişiye ait olması ve T.C. + doğum tarihiyle yeni okula geçmesi.
- Türkçe ve İngilizce iki adlı sayfa adresleri (`/login` – `/giris`, `/indir` – `/download`, `/kvkk/kvkk.html`); "Sayfa bulunamadı" ve "Okul bulunamadı" sayfaları.

**Öğretmen, öğrenci ve veli**
- Quiz (çevrim içi sınav): doğru/yanlış, çoklu doğru, açık uçlu (puan verilmez, öğretmen değerlendirir), soru başına süre, tek deneme.
- Quiz soru düzenleyici: soruya resim, matematik yazımı, soru bankası.
- Anketler; Google Forms gibi anket düzenleyici (tek/çoklu seçim, açılır liste, zorunlu soru, taslağı kaydet).
- Sınavlar: "+ yeni değer ekle" (Doğru, Yanlış, Net…), formülle hesaplanan değerler, kaydırıcılı sınav grupları (üst değer, yüzdeler), Excel'den not aktarma.
- Ödev: yaptı / geç yaptı / eksik / yapmadı / gelmedi (izinli-izinsiz) sonuçları, süzgeçler, ödev serisi, açılmamış ödevin turuncu görünmesi, sonradan düzenleme.
- Ders programından yoklama ve velinin "dersine gelmedi" bildirimi; etüt (gün, saat, geldi/izinli/izinsiz).
- Etüt planlamada öğretmen ve öğrencilerin boş saatlerinin anında görülmesi.
- Başarılarım: öğrencinin belgeleri ve başarıları (müdür "Teşekkür Belgesi" gibi başlıkla ekler).
- Takvim ve özel günler; hatırlatıcılar; mesajlar ve duyurular; zengin yazı düzenleyici.
- Bildirimler (ödev, sınav, ders değişikliği) ve telefon bildirimi; veliye tek bildirim, çocuğun adıyla.
- Toplantılar (Zoom/Meet bağlantısı, zamanı gelince "Katıl"); gelmeyen öğrenci için sınıfın uzaktan ders bağlantısı.

**Eğitim içerikleri**
- EBA benzeri eğitim içerikleri: eğitmen rolü ve eğitmen paneli, YouTube'dan ya da doğrudan video (720p, tarayıcıda dönüşüm), kanal bağlantısı.
- Kendi oynatıcımız (0.25x–3x, kalite), altyazı, her videoda "Bildir", YouTube'dan kalkan videonun silinmesi.
- Beğeni, oynatma listeleri (kişi başına 2, eğitmene 4, paylaşılabilir), şifreli indirme ve "İndirilenler".
- Sınıf (1–12) ve etiket (LGS, TYT, AYT…) süzgeçleri; ana sitede giriş yapmadan izlenebilmesi.

**Servis ve aile**
- Servis yoklaması: sabah "bindi/binmedi", akşam "geldi"; müdürün belirlediği saatlerde sefer; servisin konumu ve eve yaklaşınca bildirim.
- Haritada okul, ev ve servis; "okula git", "eve git", "servisi takip et".
- Eğitim Evi Aile: velinin çocuğunun konumunu ve ekran süresini görmesi.
- WebView değil, özenle yazılmış yerel Android uygulaması; site ve uygulamada aynı indirme sayfası; uygulamanın kendini güncellemesi.

**Tasarım**
- Sayfa düzeni: sayfaların ve menülerin yerleşimi; yapay zekâ gibi görünmeyen, canlı renkli (kırmızı + turkuaz) tasarım.
- Sol üstte açılıp kapanan üç çizgili menü; sağ üstte "+ Ekle"; açık/koyu tema düğmesi.
- Açılış sayfası, Hakkında, SSS, yorumlar (yalnız yetişkinler, 0–5 yıldız).
- Kırmızı ev, baca ve aralık kapılı logo.
- Çok dil: üstte dil seçici ve çevirmenlerin çeviri yaptığı panel (`/panel/translate`).

**Güvenlik ve düzen**
- Saldırılara ve veri hırsızlığına karşı koruma; aynı okul ağından 300 kişinin sorunsuz girebilmesi.
- Gizli ve kişisel dosyaların GitHub'a hiç girmemesi; koda bakılarak hacklenememesi.
- KVKK aydınlatma metni ve eksiksiz onaylar.
- Her kod dosyasının yanında o dosyayı anlatan belge; kökte proje tanıtımı (`TANITIM.md`).
- Her şeyin tam hata ayıklaması (her rol ve her yetki tek tek).

## Selçuk — [@Selcuk30](https://github.com/Selcuk30)

- Okul içi şikâyet ve öneri kutusu fikri (tasarlandı, sırada).
- Menü tasarımında taslağı çizdi

## Mert — [@Manto0701](https://github.com/Manto0701)

- &nbsp;

## Atlas — [@Atlas1121](https://github.com/Atlas1121)

- &nbsp;

## Harun — [@HARUN-123](https://github.com/HARUN-123)

- &nbsp;

## Yapay zekâ

Kodun büyük bölümünü yazdı; testleri, belgeleri ve güvenlik denetimlerini yaptı. Önerip Enes'in onayladığı fikirlerden bazıları:

- Okul sayfası için görsel düzenleyici (CSS editörü) ve bloklarla sayfa düzeni.
- Hazır mesaj şablonları ({öğrenci}, {sınıf} alanlarıyla) ve ileri tarihli gönderim.
- Mezun olan öğrencinin portal düzeni ("Mezun · okul", veli bağının sürmesi).
- Servisçinin de portal olması; rakamdan oluşan kullanıcı adının hiçbir yerde görünmemesi.
- "Verilerimi indir" ve "Bu mesajı bildir".
- Yeni cihazdan giriş uyarısı ve açık oturumlar listesi; tarayıcı hata günlüğü; her sayfada "Yardım"; "Yenilikler" penceresi.
- Sistem durumu ve e-posta sağlığı ekranları; bakım modu.
- Ortak bilgisayar kipi (tarayıcı kapanınca çıkış); yeni hazır roller (Okul Sekreteri, BT Sorumlusu, Sınıf Öğretmeni…).
- Güvenlik: IPv6 ağ sınırı, okulun verdiği şifrenin ilk girişte değişmesi, yeni atanan müdürün 7 gün ortak karara katılamaması,
  eğitmen panelinde yalnız toplam sayılar (izleyenlerin adı görünmez).
- Sağdan sola diller (Arapça) için sayfa düzeni.
- Çelişki ve istek denetimleri; belgeleri koda karşı doğrulama.
