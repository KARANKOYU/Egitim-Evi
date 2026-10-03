# Giriş ve hesap · T.C. kimlik numarası

**Durum:** Kodda var; tasarımda ek olarak bütün hesaplarda zorunlu olması, yazarken canlı geçerlilik denetimi, T.C.'si olmayan eski yetişkin hesaplarından girişte istenmesi ve okulun veliyi T.C. ile bağlarken yalnız "var / yok" görmesi.

Kişileri doğru eşleştirmek (tek kişi tek hesap, veliyle çocuğu, okul değiştiren öğrenciyle kendi hesabı) için alınan 11 haneli numara; her girildiği yerde aynı geçerlilik kuralıyla denetlenir.

## Ne işe yarar

Bugün T.C. kimlik numarası okulun açtığı hesaplarda (öğrenci, servisçi) zorunludur: okul onu girer, boş bırakırsa ilk
kullanıcı adı ve ilk şifre olur, öğrenci okul değiştirince yeni okul T.C. ve doğum tarihiyle aynı hesabı alır. Yetişkin
hesabında (veli, öğretmen, müdür) bugün isteğe bağlıdır. Kullanıcı 2 Ekim'de karar verdi: "TC zorunlu olsun, bağlamayı
kolaylaştıran o; ve TC için 11 hane ve kural her yerde çalışsın, geçerli geçersiz anlasınlar." Aydınlatma metni (sürüm 1.15)
bunu şimdiden "bütün hesaplarda zorunlu" diye yazıyor; kodu Linux oturumunda yazılacak. (Kullanıcının 25 Eylül'deki "tc şu an
isteğe bağlı olsun, ileride bir okula ihtiyacı olabilir" sözü bu kararla değişti.)

## Nereden açılır

- Kayıtta **"T.C. kimlik no (isteğe bağlı)"** kutusu ([Kayıt olma](kayit-olma.md)).
- Ayarlar → Kişisel bilgiler ([Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)).
- Okulun "Öğrenci ekle", servisçi ekleme ve Excel aktarımı ([Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md),
  [İçe aktarım](../excel-aktarim/ice-aktarim.md)).
- Okulun sayfasından girişte kullanıcı adı yerine ([Okulun sayfasından giriş](okulun-sayfasindan-giris.md)).

## Adım adım

### Ziyaretçi (kayıt), veli, öğretmen, çalışan, müdür ve eğitmen

1. Kayıtta "T.C. kimlik no (isteğe bağlı)" kutusuna yaz ya da boş bırak. Kutu yalnız rakam alır, en çok 11. Altında: "Zorunlu
   değil. Yazarsan yalnızca sen görürsün; ileride okulun resmî kayıtla eşleştirmesi gerekirse kullanılır."
2. Yanlış yazdıysan "Kayıt Ol"a basınca kutunun altında: "T.C. kimlik numarası 11 haneli olmalı ve 0 ile başlamamalı." ya da
   "T.C. kimlik numarası geçersiz, rakamları kontrol et."
3. Numara başka bir hesapta varsa: "Bu T.C. kimlik numarası kullanılamıyor. Yanlış yazmadıysan okul yönetimine başvur ya da
   boş bırak." Bu durumda robot sorusu da yenilenir (aynı soruyla ikinci deneme yapılamaz).
4. Sonradan Ayarlar → Kişisel bilgiler'de "T.C. kimlik no (isteğe bağlı)" kutusundan ekler, değiştirir ya da silersin; altında
   "Yalnızca sen görürsün. Boş bırakabilirsin." ([Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)).

Tasarımda:

1. Kayıtta etiket **"T.C. kimlik no"** (isteğe bağlı yazısı yok); altında "Zorunlu. Yalnız seni doğru kişiyle eşleştirmek için
   kullanılır; okulunla paylaşılmaz." Boş bırakılamaz.
2. Yazarken kutunun altında canlı yazı (Tasarım 1 önizlemesi): "T.C. kimlik numaranı yaz.", "Yalnız rakam olmalı.", "11 hane
   olmalı (şu an 9).", "0 ile başlayamaz.", "Geçersiz numara: 10. hane tutmuyor.", "Geçersiz numara: 11. hane tutmuyor."; doğruysa
   yeşil "Geçerli T.C. kimlik numarası." Tanım ise 11. hane girilince hemen geçerli/geçersiz denmesini, geçerliyse yeşil işaret
   konmasını ve bugünkü iki iletinin korunmasını söylüyor; kodlanırken bu iki ileti grubundan biri seçilecek.
3. Ayarlar'da numara maskeli görünür (ör. "1••••••••34") ve "Düzenle" ile değişir.
4. T.C.'si olmayan **eski yetişkin hesabı** girişten sonra, aydınlatma metninin yeniden onayıyla aynı adımda "T.C. kimlik
   numaranı gir" ekranını görür; bu adım atlanamaz. Yönetici ve destek hesabı hariç.
5. Aynı kural Android uygulamasının kayıt ve Ayarlar ekranında da (aynı algoritma ve iletiler).

### Öğrenci ve servisçi

1. Numaranı okulun girer; zorunludur ("T.C. kimlik no gerekli").
2. Ayarlar'da numaran salt okunur görünür: "Yalnızca sen ve okul yönetimi görür. Yanlışsa okul yönetimine söyle."
   Değiştirmeye kalkarsan sunucu "T.C. kimlik numaranı okul yönetimi düzenler." der.
3. Okulun sayfasından girişte kullanıcı adı kutusuna T.C. numaranı yazarak da girebilirsin; okul kullanıcı adını boş bıraktıysa
   adın zaten T.C. numarandır, şifreyi boş bıraktıysa ilk şifren de odur (ilk girişte değiştirirsin).
4. Yeni şifren T.C. numaranı içeremez ([Şifre kuralları](sifre-kurallari.md)).

### Müdür (okulun hesap açması)

1. "Öğrenci ekle"de ve servisçi eklerken T.C. zorunludur; aynı kural ve iletiler.
2. Numara okulda başka bir hesapta varsa: "Bu T.C. kimlik no okulda başka bir hesapta kayıtlı".
3. Öğrencinin T.C.'si başka bir okuldaki öğrencideyse: "Bu T.C. kimlik no başka bir okulda kayıtlı bir öğrencinin. Öğrenciyi
   okuluna almak için "Öğrenci ekle"den doğum tarihiyle birlikte tek tek ekle" ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).
4. T.C.'yi Hesap penceresinde görür ve düzeltir ([Hesap penceresi](../hesaplar/hesap-penceresi.md)).

Tasarımda: okul bir veliyi çocuğuna bağlarken velinin numarasını yazar; sistem yalnız "Bu numarayla bir veli hesabı var:
De*** Ar****, bağla" ya da "Bu numarayla hesap yok" der; numarayı ve hesabın başka bilgisini göstermez
([Veli bağlama](../hesaplar/veli-baglama.md)).

Excel aktarımı bugün de aynı kuraldan geçer: yeni hesap açılacak her satır okulun tek tek hesap açtığı denetimle bakılır; numara
boşsa "T.C. kimlik no gerekli", kurala uymuyorsa yukarıdaki iletiler satır hatası olarak listelenir
([İçe aktarım](../excel-aktarim/ice-aktarim.md)).

## Kurallar ve sınırlar

- **Geçerlilik kuralı** (sunucu ve tarayıcıda aynı): 11 hane, ilk hane 0 olamaz; 10. hane = ((1.+3.+5.+7.+9. hane) × 7 −
  (2.+4.+6.+8. hane)) mod 10; 11. hane = ilk 10 hanenin toplamı mod 10. Kural yazım hatasını yakalar, numaranın gerçekten var
  olduğunu denetlemez.
- **Yazım temizliği**: boşluklar, görünmez karakterler ve tam genişlikli rakamlar silinir.
- **Tekillik**:
  - öğrencinin T.C.'si bütün sistemde tektir (öğrenci hesabı kişiye aittir);
  - okul hesaplarında okul içinde tektir;
  - yetişkin hesabında yazılmışsa yetişkinler arasında tektir.
- **Kayıtta çakışma**: robot sorusu harcanır ve aynı bağlantıdan saatte en çok 10 çakışma kabul edilir ("T.C. kimlik numarası
  şu an kaydedilemiyor. Bir saat sonra dene ya da boş bırak.") — "bu numara kayıtlı mı" diye deneme yapılamasın.
- **E-posta onayı sırasında** numara başka hesaba yazıldıysa hesap açılmaz: "Bu T.C. kimlik numarası kullanılamıyor. Yeniden
  kayıt ol; T.C. alanını boş bırakabilirsin." ([E-posta onayı](eposta-onayi.md)).
- **Ayarlar'da değiştirme**: hesap başına günde 5 değişiklik ("T.C. kimlik numarasını bugün çok kez değiştirdin. Yarın tekrar
  dene."); başkasında varsa "Bu T.C. kimlik numarası kullanılamıyor. Yanlış yazmadıysan okul yönetimine başvur."
- **Kim görür**: kişinin kendisi; okulun açtığı hesaplarda okul yönetimi. Yetişkinin numarası okulla paylaşılmaz. Öğretmenler ve
  öğrenciler kimsenin numarasını görmez. Numara kişinin kendi görünümü dışında hiçbir cevaba girmez
  ([Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md)).
- **Girişte**: okulun sayfasında 11 haneli bir sayı yazılırsa o okulda T.C. ile de aranır; genel `/login`'de T.C. ile giriş
  yoktur.
- **Bugünkü çelişki**: aydınlatma metni (1.15'ten beri) "bütün hesaplarda zorunlu" diyor, kod yetişkin kaydında ve Ayarlar'da
  hâlâ "isteğe bağlı". (Tanımdaki "Excel aktarımı numarayı yalnız temizliyor" notu koda uymuyor: aktarımda yeni hesap satırı
  okulun hesap açma denetiminden geçer, geçersiz ya da boş numara satır hatası olur.)
- **Yabancı uyruklu**: Yabancı Kimlik Numarası (99 ile başlar, 11 hane) aynı kuralla doğrulanıyor mu, Linux'ta resmî kaynaktan
  bakılacak; uymuyorsa ayrı bir "Yabancı kimlik no" seçeneği önerilip kullanıcıya sorulacak.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Kayıt olma](kayit-olma.md) — kayıttaki kutu.
- [Kullanıcı adı](kullanici-adi.md) — okul hesabında adın T.C. olması.
- [Okulun sayfasından giriş](okulun-sayfasindan-giris.md) — T.C. ile giriş.
- [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md), [Şifre kuralları](sifre-kurallari.md) — T.C.'li ilk şifre.
- [E-posta onayı](eposta-onayi.md) — onay sırasında çakışma.

**İlgili:**

- [Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md) — Ayarlar'daki kutu.
- [Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md), [Öğrenci nakli](../hesaplar/ogrenci-nakli.md),
  [Veli bağlama](../hesaplar/veli-baglama.md), [İçe aktarım](../excel-aktarim/ice-aktarim.md).
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Sunucu: [sunucu/ortak.md](../../sunucu/ortak.md) — `tcSorunu`, `normTc`; [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)
  — kayıtta T.C. ve çakışma (`yeniSoru`), `POST /api/profile` (Ayarlar, günde 5), `benimGorunum` (T.C. yalnız kişiye);
  [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — okul hesaplarında zorunlu T.C., kullanıcı adı ve ilk
  şifre; [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `tcVarMi`, girişte T.C. ile arama.
- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `tcSorunuTR`, kayıttaki rakam süzgeci;
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — Ayarlar'daki kutu.
- Aydınlatma metni: `public/kvkk/kvkk.html` (T.C. satırı, 2. ve 3. bölüm).
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (T.C.'nin yalnız kişiye gitmesi, okul hesabında
  değişmemesi, çakışmanın soruyu harcaması), [testler/test-cakisma.md](../../testler/test-cakisma.md),
  [testler/test-nakil.md](../../testler/test-nakil.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Aynı e-posta, kullanıcı adı ve T.C. (çakışmalar)").

## Sık sorulanlar

- **T.C. numaramı kim görür?** Sen ve (okulun açtığı hesaplarda) okul yönetimi. Yetişkin hesabındaki numaran okulla
  paylaşılmaz; öğretmenler ve öğrenciler kimsenin numarasını görmez.
- **"Bu T.C. kimlik numarası kullanılamıyor" diyor.** Numara başka bir hesapta kayıtlı. Yanlış yazmadıysan okul yönetimine
  başvur (öğrenciysen okulun eski hesabını yeni okuluna nakille alır).
- **Numaram doğru ama "geçersiz" diyor.** Rakamları tek tek kontrol et; kural son iki haneyi öncekilerden hesaplar.
- **Neden isteniyor?** Herkesin tek hesabı olsun, veli doğru çocuğa, okul değiştiren öğrenci kendi hesabına bağlansın diye;
  başka bir amaçla kullanılmaz (aydınlatma metni).

## Sırada

- T.C. kimlik no bütün hesaplarda zorunlu + her yerde geçerlilik kuralı (iş 32, Linux'ta): kayıt (site ve Android), Ayarlar,
  okulun hesap açması, Excel/JSON aktarımı, veli bağlama ve servisçi; eski hesaplarda zorunlu adım; testler.
- Tek kişi tek hesap + portallar öğrencide de: T.C. ve doğum tarihi eşleşince portal kendiliğinden düşer.
- Çok dil: iletiler çeviri kataloğuna.
