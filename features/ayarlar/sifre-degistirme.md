# Hesap ayarları · Şifre değiştirme

**Durum:** Kodda var; tasarımda ek olarak alanların adı "Eski şifre:", "Yeni şifre:", "Yeni şifre (tekrar):" (kullanıcının 1 Ekim isteği) ve formun üstünde "Son değişiklik: <tarih>".

Şifreni bildiğin hâlde yenisiyle değiştirdiğin form; değişince bu cihaz dışındaki bütün oturumların kapanır.

## Ne işe yarar

Şifren başkasının eline geçtiyse ya da sana verilen (okulun, yöneticinin dağıttığı) şifreyi kendi şifrenle değiştirmek istiyorsan.
Değişiklik bu oturum dışındaki bütün oturumları kapatır: şifreni bilen biri başka bir cihazda açık kalamaz. Kullanıcı 1 Ekim'de
alanların adını verdi: "şifre değiştirme yeri eski şifre: yeni şifre: yeni şifre(tekrar):".

## Nereden açılır

- **Bugün:** Ayarlar → **"Şifre değiştir"** kartı (herkeste) ([Ayarlar sayfası](hesap-ayarlari-sayfasi.md)).
- **Telefon uygulamasında:** Ayarlar sekmesi → "HESAP" → **"Şifre değiştir"**.
- **Tasarımda:** Hesap ayarları → **"Şifre ve güvenlik"** bölümünün başı; profil menüsünde **"Şifre ve güvenlik — şifre, iki adımlı
  giriş"**.
- Şifreni bilmiyorsan bu form değil, giriş ekranındaki "Şifremi unuttum" ([Şifremi unuttum](../giris-hesap/sifremi-unuttum.md)).

## Adım adım

### Bugün: herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, rolsüz yetişkin, yönetici)

1. **"Mevcut şifren"** kutusuna şu anki şifreni yaz.
2. **"Yeni şifren"** kutusuna yenisini yaz. Altındaki kural listesi yazdıkça işaretlenir (karşılanan satır yeşil tik alır):
   - yetişkin hesabında ve yöneticide beş satır: "En az 8 karakter", "Büyük harf", "Küçük harf", "Rakam", "Özel karakter (! ? . *)";
   - öğrencide ve servisçide üç satır: "En az 8 karakter", "En az bir harf", "En az bir rakam".
3. **"Yeni şifren (tekrar)"** kutusuna yeniden yaz.
4. **"Şifreyi değiştir"**e bas (istek sürerken düğme basılmaz olur).
5. Tarayıcının denetimi (ileti düğmenin altında kırmızı):
   - mevcut şifre boşsa **"Mevcut şifreni gir."**;
   - iki yeni şifre farklıysa **"Yeni şifreler birbirini tutmuyor."**;
   - yeni şifre eskisiyle aynıysa **"Yeni şifre eskisiyle aynı olamaz."**;
   - kurala uymuyorsa **"Bir şifre belirle."**, **"Şifre en az 8 karakter olmalı."**, öğrenci/serviste **"Şifre en az bir harf ve bir
     rakam içermeli."**, yetişkinde eksikler tek cümlede: **"Şifrede bir büyük harf, bir özel karakter (! ? . * gibi) olmalı."**
6. Başarıda yeşil **"Şifren değiştirildi."** ve üç kutu boşalır. Bu sekme açık kalır; başka sekmelerde, başka cihazlarda ve başka
   portallarında (öğretmen, müdür, veli) açık olan oturumların kapanır.
7. Her şifre kutusunun sağında göz düğmesi ("Şifreyi göster" / "Şifreyi gizle") vardır; Caps Lock açıksa kutunun altında "Büyük harf
   kilidi (Caps Lock) açık." yazar ([Şifre kuralları](../giris-hesap/sifre-kurallari.md)).

### Okul rolündeyken (öğretmen, çalışan, müdür portalında)

Değişen şifre yetişkin hesabınındır: bütün portallarında ve veli portalında aynı yeni şifreyle girersin. Güçlü kural geçer.

### Yönetici

Şifre değişince yönetim panelinin eski çerezleri (bu oturumunki dahil) geçersiz olur, yenisi hemen verilir; o an gizli yönetim
adresinde değilsen sayfa yönetim adresine geçer. Varsayılan ilk yönetici rastgele şifreyle açılır; sistem onu değiştirmeye
zorlamaz, girince hemen bu formdan değiştirmen önerilir. Yönetici dosyasıyla eklenen yönetici ise ilk girişte şifresini değiştirmek
zorundadır ([İlk girişte kendi şifreni belirleme](../giris-hesap/zorunlu-sifre-belirleme.md),
[Yönetici dosyası](../yonetim/yonetici-dosyasi.md)).

### Telefon uygulamasında (bugün)

Ayarlar → "Şifre değiştir": **"Şu anki şifren"**, **"Yeni şifre"** (altında "Şifreyi göster/gizle" ve kural ipucu: yetişkinde "En az 8
karakter; büyük harf, küçük harf, rakam ve özel karakter (! ? . * gibi).", öğrencide ve servisçide "En az 8 karakter; en az bir harf
ve bir rakam."), **"Yeni şifre (tekrar)"**, **"Şifreyi kaydet"**. Boşsa "Şifreni yaz.", iki yeni farklıysa "İki yeni şifre aynı değil.";
başarıda "Şifren değişti. Öbür cihazlardaki oturumlar kapandı." ve Ayarlar'a dönülür ([Android uygulaması](../uygulama/android-uygulamasi.md)).

### Tasarımda (Tasarım 1 önizlemesi)

1. "Şifre ve güvenlik" bölümünün ilk satırı **"Şifre değiştir"**, altında **"Son değişiklik: <tarih>"**.
2. Form: **"Eski şifre:"**, **"Yeni şifre:"**, **"Yeni şifre (tekrar):"** ve **"Şifreyi değiştir"**.
3. Eski ya da yeni şifre boşsa **"Eski ve yeni şifreni yaz."**; yeni şifreler farklıysa **"Yeni şifreler birbirini tutmuyor."**
4. Başarıda form boşalır ve **"Şifren değiştirildi. Öbür cihazlardaki oturumların kapandı."**
5. İki adımlı giriş açıksa şifre değişikliği onu kapatmaz (kullanıcının 29 Eylül kararı; [Şifre ve güvenlik](guvenlik.md)).

## Kurallar ve sınırlar

- **Giriş gerekir** (yoksa "Giriş yapmalısın").
- **Deneme sınırı:** hesap başına 15 dakikada 10 deneme: **"Çok fazla deneme. Biraz bekle."**
- **Sunucunun iletileri** (düğmenin altında):
  - **"Mevcut şifre yanlış"**;
  - kural: **"Yeni şifre: şifre en az 8 karakter olmalı"** gibi ("Yeni şifre: " ve kuralın cümlesi; 200 karakterden uzunsa "şifre çok uzun");
  - **"Yeni şifre eskisiyle aynı olamaz."**;
  - **"Yeni şifre T.C. kimlik numaranı ya da kullanıcı adını içermesin."** (kullanıcı adı 4 karakter ya da daha uzunsa).
- **Güçlü kural:** öğrenci ve servisçi dışındaki herkes (okul rolündeki yetişkin ve yönetici dahil); öğrenci ve servisçide 8 karakter,
  harf ve rakam yeter ([Şifre kuralları](../giris-hesap/sifre-kurallari.md)).
- **Değişince:** bu oturum dışındaki bütün oturumlar (okul rolleri dahil) kapanır; telefon uygulamasının bu hesaba bağlı cihaz
  anahtarları silinir; "ilk girişte şifreni değiştir" zorunluluğu kalkar.
- **Şifreler görüntülenemez:** sunucu şifreyi geri döndürülemez biçimde saklar; kimse senin şifreni göremez.
- **Okulun açtığı hesapta** okul yönetimi şifreni yeniden belirleyebilir ([Şifre işlemleri](../hesaplar/sifre-islemleri.md)); bu
  formdaki değişikliği okul görmez.
- **Tasarımda:** iki adımlı giriş açık hesapta şifreyi kim değiştirirse değiştirsin (okul, yönetici, destek) iki adım açık kalır;
  yeni şifreyle girişte yine kod sorulur.

## Kardeşler ve ilgili

**Kardeşler:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Şifre ve güvenlik](guvenlik.md) ·
[Açık oturumlar](acik-oturumlar.md) · [Giriş bilgileri](giris-bilgileri.md).

**İlgili:** [Şifre kuralları](../giris-hesap/sifre-kurallari.md), [Şifremi unuttum](../giris-hesap/sifremi-unuttum.md),
[İlk girişte kendi şifreni belirleme](../giris-hesap/zorunlu-sifre-belirleme.md), [Yeni cihaz uyarısı](../giris-hesap/yeni-cihaz-uyarisi.md)
(sen değilsen şifreni değiştir), [Çıkış yap](../giris-hesap/cikis-yap.md), [Şifre işlemleri](../hesaplar/sifre-islemleri.md),
[Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — "Şifre değiştir" kartı
  (`sifreKuralListesi`, `sifreKurallariniIsaretle`); [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) —
  `sifre-kaydet`; [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `sifreSorunuTR`, `gucluSifreli`;
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) — `yonetimeGec`;
  [public/js/parcalar/04a-form-alanlari.md](../../public/js/parcalar/04a-form-alanlari.md) — göz düğmesi, Caps Lock uyarısı.
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/password`; [sunucu/ortak.md](../../sunucu/ortak.md)
  — `sifreSorunu`; [sunucu/sifre.md](../../sunucu/sifre.md) — şifrenin saklanması; [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md).
- Depo: [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md) — `hesabinOturumlariniKapat`, `yonetimCerezleriniSil`.
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (değiştiren oturum açık, öbürü kapalı),
  [testler/test-yetiskin.md](../../testler/test-yetiskin.md) (müdür rolündeyken değişen şifre yetişkin hesabında),
  [testler/test-yonetim.md](../../testler/test-yonetim.md) (T.C. içeremez, eskisiyle aynı olamaz).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kayıt kuralları" → Şifre, "İlk giriş (admin)").

## Sık sorulanlar

- **Şifremi değiştirdim, telefonumdaki uygulamadan çıktım mı?** Evet; bu cihaz dışındaki bütün oturumların kapanır, uygulamada yeniden
  girersin.
- **Şifremi unuttum, buradan değiştirebilir miyim?** Hayır; bu form şu anki şifreni ister. Giriş ekranındaki "Şifremi unuttum"u kullan
  (e-postası olmayan öğrenci ve servisçide okul yeniler).
- **Yeni şifrem neden kabul edilmiyor?** T.C. numaranı ya da kullanıcı adını içeriyor olabilir ya da kurala uymuyordur; listedeki
  satırların hepsi yeşil olmalı.

## Sırada

- Arayüz önizlemesi / Tasarım 1 → kod: alan adları "Eski şifre:", "Yeni şifre:", "Yeni şifre (tekrar):" ve "Son değişiklik" tarihi;
  telefon uygulamasındaki adlar da aynı olacak.
- Tek kişi tek hesap + portallar öğrencide de: şifre değişikliği öğrencinin isteğe bağlı iki adımlı girişini kapatmaz.
