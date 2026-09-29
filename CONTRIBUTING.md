# Eğitim Evi — katkıda bulunanlar

Eğitim Evi bir okul grup projesi olarak 28 Ağustos 2026'da başladı. Aşağıda kimin hangi fikirle katkı verdiği ve projeye nasıl katkıda
bulunulacağı yazar.

## Enes — [@KARANKOYU](https://github.com/KARANKOYU) (proje sahibi)

Projenin yapısını kurdu, bütün ürün kararlarını verdi ve kodun yazımını yönetti. Kodun büyük bölümü yapay zekâ (Anthropic Claude)
desteğiyle, Enes'in tarif ettiği biçimde ve onun denetiminde yazıldı. Getirdiği fikirlerden bazıları:

**Hesap, giriş ve oturum yapısı**
- Tek hesap, çok portal: bir kişi aynı hesapla bir okulda öğretmen, başka okulda müdür, çocuğunun velisi olabilir; portallar arasında geçiş.
- Okulun kendi adresi (`/school/<okul>`) ve okul sayfasından doğrudan o okulun portalına giriş.
- 16 haneli kişi kodu (tireleri kendisi koyan kutu, "Kopyala").
- Zorunlu iki adımlı giriş (e-postaya 6 haneli kod); öğrencide isteğe bağlı iki adım, şifre değişse de süren doğrulama.
- Aynı T.C., e-posta ve kullanıcı adı çakışmalarının önlenmesi.
- Sağ üstte "+ Ekle" menüsü; sol üstte açılıp kapanan üç çizgili menü.

**Okul yönetimi**
- Gizli yönetim paneli: yönetici değilsen `/admin` bilinmeyen sayfa gibi görünür; yönetici hesapları sunucu açıkken düzenlenebilen bir dosyadan.
- Okul disk sınırı ve büyük dosyaların telefonda küçültülmesi.
- Ödevde dosya yükleme izni (varsayılan kapalı) ve dosya silme kuralları.
- Eğitim yılı; öğrenci ve velinin yalnız son bir geçmiş yılı görmesi; eski mesaj ve quizlerin belli süre sonra silinmesi.
- Türkçe ve İngilizce iki adlı sayfa adresleri (`/login` – `/giris`, `/indir` – `/download`, `/kvkk/kvkk.html`).

**Öğretmen, öğrenci ve veli**
- Quiz: açık uçlu sorulara puan verilmemesi, öğretmenin elle değerlendirmesi, doğru cevapların sonradan açılması.
- Ders yoklaması ve velinin "dersine gelmedi" bildirimi.
- Veli için tek bildirim (kardeşlerde aynı bildirimin iki kez gitmemesi).

**Servis ve aile**
- Servis yoklaması: sabah "bindi/binmedi", akşam "geldi"; müdürün belirlediği saatlerde açık sefer; servisin konumu ve yaklaşma bildirimi.
- Eğitim Evi Aile: velinin çocuğunun konumunu ve ekran süresini görmesi.
- WebView değil, özenle yazılmış yerel Android uygulaması; site ve uygulamada aynı indirme sayfası.

**Güvenlik ve düzen**
- Saldırılara ve veri hırsızlığına karşı koruma; aynı okul ağından 300 kişinin sorunsuz girebilmesi.
- Gizli ve kişisel dosyaların GitHub'a hiç girmemesi.
- Her kod dosyasının yanında o dosyayı anlatan belge; kökte proje tanıtımı (`TANITIM.md`).
- Kırmızı ev, baca ve aralık kapılı logo.

**Tasarlanan ve sırada olanlar**
- Destek talepleri (aynı anda en çok 2 talep, bir hafta sonra kapanma, talep kısıtlama, yetkilinin adının gizli kalması) ve "Verilerimi indir".
- Yönetici ve destek panelleri; okulların boş bir masaüstündeki dosyalar gibi dizildiği, sürüklenip bırakılan okul gezgini; müdürün koyduğu okul simgesi.
- Okula çalışan olarak katılma; müdürün başka bir çalışanı müdür yapması; müdür çıkarmada ortak karar.
- Bir öğrencinin aynı anda okul ve dershane gibi birden çok kurumda olabilmesi; mezunların durumu; yeni yıl sihirbazı ve şifreli okul yedeği.
- Google Forms gibi anket düzenleyici; formüllü sınav notları (Doğru–Yanlış–Net) ve kaydırıcılı sınav grupları; Excel'den not ve soru aktarma.
- Başarılarım: öğrencinin belgeleri ve başarıları.
- EBA benzeri eğitim içerikleri: eğitmen rolü, YouTube'dan ya da doğrudan video, kendi oynatıcı, oynatma listeleri, şifreli indirme.
- Toplantılar, gelmeyen öğrenci için uzaktan ders bağlantısı ve okulun tahta hesapları.
- Çok dil: üstte dil seçici ve çevirmenlerin çeviri yaptığı panel.
- Okul bilgisayarlarında (okulda telefon yasak olduğu için) kodsuz giriş yapılabilen okul cihazları.
- Etüt planlamada öğretmen ve öğrencilerin boş saatlerinin anında görülmesi.
- Yazı düzenleyici, hazır mesaj şablonları, ileri tarihli gönderim, okul sayfası için görsel düzenleyici.

## Selçuk — [@Selcuk30](https://github.com/Selcuk30)

- Okul içi şikâyet ve öneri kutusu fikri (tasarlandı, sırada).

## Mert — [@Manto0701](https://github.com/Manto0701)

- &nbsp;

## Atlas — [@Atlas1121](https://github.com/Atlas1121)

- &nbsp;

## Harun — [@HARUN-123](https://github.com/HARUN-123)

- &nbsp;


# Nasıl katkıda bulunulur

1. **Önce oku:** [TANITIM.md](TANITIM.md) projenin bütün düzenini ve belge haritasını anlatır. Değiştireceğin her kod dosyasının
   yanında aynı adlı bir `.md` vardır.
2. **Kurallar**
   - Node 24 ve PostgreSQL 17; tek npm bağımlılığı `pg`. Yeni bağımlılık ekleme.
   - Ön yüz ES5, çerçevesiz; `public/js/parcalar/*.js` ad sırasıyla tek dosyada birleşir.
   - SQL yalnız `sunucu/veri/depo/` altında ve her zaman parametreli.
   - Veritabanı değişikliği yeni numaralı bir şema dosyasıyla yapılır (`sunucu/veri/sema/NNN-ad.sql`); eski şema dosyaları değişmez.
   - Kişisel veri işleyen ya da gösteren her değişiklik aynı işte aydınlatma metnini (`public/kvkk/kvkk.html`) günceller ve
     `KVKK_SURUM`'u artırır.
   - Bir kod dosyasını değiştiren, yanındaki `.md`'nin ilgili bölümlerini ve "Son durum"unu da günceller.
   - `data/` klasörü, şifreler, anahtarlar ve kişisel bilgiler depoya girmez (`testler/test-gizli-dosyalar.js` bunu denetler).
   - Arayüz Türkçe; arayüzde emoji kullanılmaz.
3. **Test:** `bash testler/tumtest.sh` — bütün paketler `egitimevi_test` veritabanıyla 3200 portunda çalışır; sonuç `KALDI: 0` ve
   `DENETIM SORUNU: 0` olmalı. Yeni davranışa test ekle.
4. **Hata ve öneri:** GitHub'da bir issue aç: ne yaptın, ne bekledin, ne oldu. Güvenlik açığı bulduysan herkese açık yazma; proje
   sahibine doğrudan bildir.
5. **Değişiklik gönderme:** kendi dalında çalış, testleri çalıştır, ne değiştiğini ve nasıl denediğini açıklayan bir pull request aç.
