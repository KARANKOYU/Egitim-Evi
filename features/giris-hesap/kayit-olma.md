# Giriş ve hesap · Kayıt olma

**Durum:** Kodda var; tasarımda ek olarak T.C. kimlik numarasının zorunlu olması, il ve ilçe seçimi, "Şifre (tekrar)" kutusu, yazarken canlı denetim ("Kullanılabilir.", "Geçerli adres." …) ve kayıttan sonra "E-postanı onayla" ekranı.

Veli, öğretmen, çalışan, müdür ve eğitmen olacak herkesin aynı tür yetişkin hesabını "Hesap Aç" formundan kendisinin açması; öğrenci ve servisçi kaydolmaz.

## Ne işe yarar

Eğitim Evi'nde kendi kendine açılan tek hesap türü **yetişkin hesabıdır**. Formda "ne olarak kullanacaksın" diye sorulmaz,
rol, okul, sınıf ya da branş seçilmez: hesap **rolsüz** açılır. Rol sonra gelir; girişten sonra sağ üstteki **"+ Ekle"** ile
çocuğunu veli koduyla eklersin, kişi kodunu okulunun müdürüne verip okula katılırsın ya da kişi kodunu Eğitim Evi
yöneticisine verip okulunu açtırırsın ([Ekle penceresi](../portallar/ekle-penceresi.md)). Tek hesapla birden çok portalın
olabilir: bir okulda öğretmen, başka bir okulda müdür, çocuğunun velisi.

Kayıt hemen hesap açmaz: e-posta adresine bir bağlantı gider, hesap o bağlantıya tıklanınca açılır
([E-posta onayı](eposta-onayi.md)). Böylece kimse başkasının ya da olmayan bir adresle hesap açamaz.

Kullanıcının sözleri: 26 Eylül "hesap açmada normal hesap açma olsun, öğretmen müdür olmasın"; 25 Eylül "hocada kayıt olurken
niye branş seçiyor, müdür ona bir şeyler atacak, ilk rolsüz olacak"; 29 Ağustos "kayıt olda phone number, adres, il ilçe
seçilir, adres de yazılı, gmail, kullanıcı adı, gerçek ad soyad olacak"; 26 Eylül'de kutularda örnek kişi adı
kullanılmamasını, yalnız "ad" yazılmasını istedi (bu yüzden kutularda örnek ad yok, yalnız "Ad", "Soyad").

## Nereden açılır

- Açılış sayfasının üst şeridinde **"Kayıt ol"** düğmesi → `egitimevi.org/signup` (eş adı `/kayit`).
- Giriş kartının üstündeki **"Hesap Aç"** sekmesi; sekmeler arasında kart soldurup kaydırarak geçer, adres `/login` ↔ `/signup`
  olur ("Hareketi azalt" açıksa canlandırmasız).
- Girişte "hesap yok" iletisinin yanındaki **"Kayıt ol"** kısa yolu (okulun sayfasında çıkmaz) ([Giriş](giris.md)).
- Android uygulamasının giriş ekranındaki "Hesap aç" ([Android uygulaması](../uygulama/android-uygulamasi.md)).

Tasarımda (Tasarım 1 önizlemesi): sekmenin adı **"Kayıt ol"**; "Giriş yap" ile arasında kart yana kayar (kullanıcının
29 Ağustos isteği: "kayıt ol, giriş yap havalı olsun, ... smooth").

## Adım adım

### Ekranın düzeni (bugünkü site)

1. Üstte mavi bilgi kutusu: "Herkes aynı hesabı açar: veli, öğretmen ya da müdür. Girişten sonra sağ üstteki **+ Ekle** ile
   çocuğunu eklersin, okuluna öğretmen olarak katılırsın ya da okulunu açtırırsın."
2. **"Ad"** (yer tutucu "Ad", en çok 60) ve **"Soyad"** (yer tutucu "Soyad", en çok 40) yan yana.
3. **"Kullanıcı adı"** (yer tutucu "kullanıcı adı", en çok 30); altında "Girişte e-posta yerine bunu da yazabilirsin. Harfle
   başlar; harf, rakam, nokta ve alt çizgi olabilir." Yazarken büyük harf küçüğe, "İ" "i"ye, boşluk noktaya döner
   ([Kullanıcı adı](kullanici-adi.md)).
4. **"E-posta"** (yer tutucu "e-posta adresin"); altında "Hesabın, bu adrese gelen bağlantıya tıklayınca açılır. Her girişte de
   buraya bir kod gelir (iki adımlı giriş)."
5. **"Şifre"** ve altında beş satırlık kural listesi: "En az 8 karakter", "Büyük harf", "Küçük harf", "Rakam", "Özel karakter
   (! ? . *)"; yazdıkça karşılanan satır yeşil tik alır. Sağda göz düğmesi ([Şifre kuralları](sifre-kurallari.md)).
6. **"Telefon"**: solda ülke kodu listesi (TR +90 hazır, 22 ülke), sağda numara (yer tutucu "532 123 45 67"); yazdıkça
   gruplanır, başa yazılan 0 atılır ([Telefon alanı](../../public/js/parcalar/04c-telefon.md)).
7. **"T.C. kimlik no (isteğe bağlı)"** (yer tutucu "11 haneli"; yalnız rakam, en çok 11); altında "Zorunlu değil. Yazarsan
   yalnızca sen görürsün; ileride okulun resmî kayıtla eşleştirmesi gerekirse kullanılır." ([T.C. kimlik numarası](tc-kimlik-no.md)).
8. **"Adres (isteğe bağlı)"** (iki satır, en çok 200; yer tutucu "Mahalle, sokak, no — ulaşılabilecek açık adres").
9. **"Robot değilim doğrulaması"**: "7 + 4 = ?" gibi bir soru, "Cevap" kutusu ve "↻" düğmesi (yeni soru); altında
   "Otomatik kayıt botlarını engellemek için soruyor." ([Robot doğrulaması](robot-dogrulamasi.md)).
10. Onay kutusu: "**Aydınlatma metnini** okudum, anladım ve kişisel verilerimin bu kapsamda işlenmesini kabul ediyorum.
    **Kullanım koşullarını** kabul ediyorum." (iki bağlantı yeni sekmede açılır).
11. Geniş **"Kayıt Ol"** düğmesi.
12. Altında: "Bir hesapla birden çok rolün olabilir: hem veli hem öğretmen gibi. Öğrenci ve servisçi hesabını okul açar."

### Veli, öğretmen, çalışan, müdür ve eğitmen adayı (ziyaretçi)

1. Açılış sayfasında **"Kayıt ol"**a bas.
2. Adını ve soyadını gerçek hâliyle yaz. Hepsini büyük ya da hepsini küçük yazarsan sunucu düzeltir ("SELİN KORKMAZ" →
   "Selin Korkmaz").
3. Bir kullanıcı adı seç; girişte e-posta yerine bunu da yazabileceksin.
4. E-posta adresini yaz. Gerçek ve senin okuduğun bir adres olmalı: hesabı açan bağlantı ve her girişteki kod buraya gelir.
5. Şifreni yaz; beş satırın hepsi yeşil olsun.
6. Telefonunu ülke koduyla yaz.
7. T.C. kimlik numarası ve adres bugün isteğe bağlı.
8. Robot sorusunu cevapla, onay kutusunu işaretle.
9. **"Kayıt Ol"**a bas (düğme "Kaydediliyor..." olur). Önce tarayıcı aynı kuralları denetler; hatalı her kutunun altında
   kırmızı ileti çıkar, hepsi birden, ilk hatalı kutuya gidilir.
10. Başarılıysa form temizlenir, kartın üstünde yeşil kutu: "**E-postanı kontrol et.** d***z@ornek.com adresine bir bağlantı
    gönderdik. Hesabını açmak için 24 saat içinde ona tıkla. Posta gelmediyse gereksiz klasörüne bak." Hesap henüz yoktur.
11. E-postandaki bağlantıya tıkla; hesap açılır, giriş kartında kullanıcı adın yazılı gelir
    ([E-posta onayı](eposta-onayi.md)).
12. İlk girişte "Henüz bir portalın yok" kartını ve büyük "+ Ekle" düğmesini görürsün
    ([Portalı olmayan hesap](../portallar/portalsiz-hesap.md)).

E-posta zaten kayıtlıysa kutunun altında "Bu e-posta zaten kayıtlı. Giriş yapmayı dene." ve yanında **"Giriş yap"** kısa yolu
çıkar: basınca giriş sekmesine, "E-posta" seçimine geçilir, adresin kutuya taşınır, imleç şifreye gider.

Eğitmen olacak kişi de bu formu doldurur; eğitmen rolünü sonra yönetici ya da destek verir
([Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)).

Tasarımda (Tasarım 1 önizlemesi):

1. Bilgi kutusu: "Herkes aynı normal hesabı açar: veli, öğretmen ya da müdür. Kayıtta rol, sınıf ya da branş seçilmez;
   hesabın ilk açıldığında rolsüzdür. Girişten sonra sağ üstteki **+ Ekle** ile çocuğunu eklersin, okuluna çalışan olarak
   katılırsın ya da okulunu açtırırsın."
2. Alanlar sırasıyla: "Ad", "Soyad"; "Kullanıcı adı"; "E-posta"; "Telefon" (ülke kodu + numara); **"İl"** ("İl seç") ve
   **"İlçe"** (il seçilene kadar "Önce il seç", sonra "İlçe seç"); "Açık adres (isteğe bağlı)" (yer tutucu "Mahalle, sokak, bina
   ve kapı no"); **"T.C. kimlik no"** (zorunlu); "Şifre" ve kural listesi; **"Şifre (tekrar)"**; robot sorusu ("Yenile");
   onay kutusu; **"Kayıt ol"** düğmesi; altında aynı not. Şifre kutularında göz düğmesi var.
3. Yazarken her kutunun altında canlı durum yazısı (yeşil ya da kırmızı):
   - Kullanıcı adı: "Harfle başlamalı.", "Yalnız harf, rakam, nokta ve alt çizgi olabilir (Türkçe harf yok).", "En az 3 karakter
     olmalı.", "Bu kullanıcı adı alınmış.", "Kullanılabilir."
   - E-posta: "Geçerli bir e-posta adresi yaz (ör. ad@eposta.com).", "Bu e-postayla açılmış bir hesap var. Giriş yap ya da şifreni
     yenile.", "Geçerli adres."
   - Telefon: "Telefon numaranı yaz.", "Cep telefonu 5 ile başlar (5xx xxx xx xx).", "Türkiye numarası 10 haneli olmalı (5xx xxx xx
     xx).", başka ülkede "Bu ülkenin numarası N haneli olmalı."; doğruysa "Geçerli: +90 532 123 45 67".
   - T.C.: hata ya da "Geçerli T.C. kimlik numarası." ([T.C. kimlik numarası](tc-kimlik-no.md)).
   - Şifre (tekrar): "Şifreler aynı." ya da "Şifreler birbirini tutmuyor."
4. **"Kayıt ol"**a basınca eksikler kutuların altında: "Adını yaz." / "Adını harflerle yaz.", "Soyadını yaz." / "Soyadını
   harflerle yaz." (en az 2 harf; yalnız harf, kesme, boşluk ve tire), "Bir kullanıcı adı seç.", "E-posta adresini yaz.",
   "İlini seç.", "İlçeni seç.", "Bir şifre belirle." / "Şifre kuralların hepsini sağlamalı (yeşil işaretler).", "Şifreni bir kez
   daha yaz.", "Şifreler birbirini tutmuyor.", robot için "Doğrulama sorusunu cevapla." / "Cevap yanlış; yeni soruyu cevapla.",
   onay için "Devam etmek için aydınlatma metnini ve kullanım koşullarını onayla."
5. Aydınlatma metni ve kullanım koşulları bağlantıları formdan çıkmadan **pencerede** açılır ("Kapat"); yazdıkların silinmez.
6. Gönderince kart **"E-postanı onayla"** ekranına kayar ([E-posta onayı](eposta-onayi.md)).
7. Kayıttan sonraki ilk girişte rolsüz boş ekran: "Hoş geldin, <Ad>. Hesabının henüz rolü yok."

İl ve ilçe Tasarım 1'de zorunludur ve kullanıcının 29 Ağustos sözüne dayanır; ama yetişkin kaydında il/ilçenin KVKK açısından
gerekli olup olmadığı kullanıcıya ayrıca sorulacak (açık soru). Bugün kayıtta il/ilçe yok; il ve ilçe yalnız Ayarlar'daki kişisel
bilgilerde var ([Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)).

### Öğrenci ve servisçi

Kaydolmazsın. Hesabını okulun açar (tek tek ya da Excel'den toplu), kullanıcı adını ve ilk şifreni okul yönetiminden alırsın
([Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md), [Servisçi hesabı](../servis/servisci-hesabi.md)). Kayıt formunu
doldurursan yetişkin hesabı açmış olursun; öğrencilik buradan gelmez.

## Kurallar ve sınırlar

- **Rol seçimi yok.** Gövdede rol ya da okul gönderilse de sunucu yok sayar; hesap rolsüz, onaylı açılır.
- **Ad ve soyad**: sunucu en az iki kelime ister: "Adını ve soyadını birlikte yaz." (ön yüzde "Adını yaz.", "Soyadını yaz.").
- **E-posta** (bütün sistemde tek):
  - boşsa "E-posta adresini yaz."; bozuksa "E-posta adresi eksik ya da hatalı görünüyor." (ön yüz) ya da "Geçerli bir e-posta
    adresi gir." (sunucu);
  - Türkçe ya da başka alfabeden harf: "E-posta adresinde Türkçe ya da başka alfabeden harf olamaz (ı, ş, ğ, ü, ö, ç gibi);
    İngilizce harflerle yaz.";
  - 254 karakterden uzunsa "E-posta adresi çok uzun.";
  - başka hesapta varsa "Bu e-posta zaten kayıtlı. Giriş yapmayı dene." (+ "Giriş yap");
  - e-posta ayarlıysa alan adının posta alıp almadığına bakılır: '"<alan adı>" alan adı e-posta almıyor. Adresi kontrol et.'
- **Kullanıcı adı**: kurala uymalı ve hiçbir yerde (okul hesapları dahil) kullanılmamış olmalı: "Bu kullanıcı adı alınmış.
  Başka bir ad dene." ([Kullanıcı adı](kullanici-adi.md)).
- **Şifre**: yetişkin kuralı (8 karakter, büyük harf, küçük harf, rakam, özel karakter) ([Şifre kuralları](sifre-kurallari.md)).
- **Telefon** zorunlu: "Telefon numaranı yaz.", "Telefon numarasını ülke koduyla yaz.", "Türkiye numarası 10 haneli olmalı (5xx
  xxx xx xx)." Sunucu numarayı uluslararası biçimde saklar (`+905321234567`).
- **T.C.** bugün isteğe bağlı; yazıldıysa geçerli ve tek olmalı ([T.C. kimlik numarası](tc-kimlik-no.md)).
- **Aydınlatma onayı** şart: ön yüz "Devam etmek için aydınlatma metnini onaylaman gerekiyor.", sunucu "Devam etmek için
  aydınlatma metnini okuyup onaylaman gerekiyor." Onayın tarihi ve metnin sürümü (bugün 1.16) hesapla saklanır
  ([Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)).
- **Sıra**: sunucu sırayla bakar ve ilk hatada durur: robot sorusu → ad → e-posta → kullanıcı adı → şifre → telefon → T.C. →
  onay. Tarayıcı ise gitmeden önce hepsini birden gösterir. Sunucunun iletisi hangi kutuya aitse onun altına yazılır, kutu
  bulunamazsa kartın üstüne.
- **Robot sorusu** yalnız başvuru geçince (ya da T.C. çakışmasında) harcanır; başka kutu hatalıysa aynı soru geçerli kalır.
- **Sınırlar**:
  - aynı bağlantıdan (IP) saatte 100 kayıt denemesi: "Çok fazla kayıt denemesi yapıldı. Bir saat sonra tekrar dene.";
  - aynı bağlantıdan saatte en çok 60 hesap (bir sınıf okul ağından birlikte kaydolabilsin): "Bu bağlantıdan bir saat içinde
    açılabilecek hesap sınırına ulaşıldı.";
  - aynı adrese saatte en çok 3 onay postası: "Bu adrese az önce bağlantı gönderdik. Gelen kutunu ve gereksiz klasörünü kontrol
    et."
- **Bekleyen kayıt**: bilgiler (şifrenin özeti dahil) 24 saat bekler; aynı adresle yeniden kayıt olunursa eskisi silinir.
- **Kişi kodu** hesap açıldığı anda üretilir ([Kişi kodu](../portallar/kisi-kodu.md)).
- **Doğum tarihi** yetişkin kaydında istenmez.
- Yetişkin hesabı e-postasız açılamaz. Eski düzenden kalan e-postasız yetişkine girişte bir kez "E-posta eklemek ister misin?"
  sorulur ([E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md)).
- **KVKK**: kayıtta alınan bilgiler aydınlatma metninde yazılıdır ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [E-posta onayı](eposta-onayi.md) — kayıttan sonraki bağlantı.
- [Kullanıcı adı](kullanici-adi.md), [Şifre kuralları](sifre-kurallari.md), [T.C. kimlik numarası](tc-kimlik-no.md).
- [Robot doğrulaması](robot-dogrulamasi.md) — formun sonundaki toplama sorusu.
- [Giriş](giris.md) — hesap açılınca.

**İlgili:**

- [Ekle penceresi](../portallar/ekle-penceresi.md), [Kişi kodu](../portallar/kisi-kodu.md),
  [Portalı olmayan hesap](../portallar/portalsiz-hesap.md) — kayıttan sonra rol edinmek.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md).
- [Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md), [Giriş bilgileri](../ayarlar/giris-bilgileri.md) — sonradan değiştirmek.
- [Adresler](../acilis-sayfasi/adresler.md) — `/signup`, `/kayit`.

## Kod tarafı

- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `kayitGovdesi`, `kayitDenetle`,
  `kayitBasarili`, `KAYIT_ALANLARI`, `kayittan-girise` kısa yolu, sekme geçişi (`sekmeGec`);
  [public/js/parcalar/04c-telefon.md](../../public/js/parcalar/04c-telefon.md) — telefon alanı;
  [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) — `/signup` adresi (`sekmeAdresiYaz`).
  Formun HTML'i `public/index.html` (`#formKayit`).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/register` (sıra, sınırlar, cevap
  `{ onayGerekli, eposta, message }`), `KVKK_SURUM`; [sunucu/ortak.md](../../sunucu/ortak.md) — `epostaSorunu`,
  `kullaniciAdiSorunu`, `sifreSorunu`, `telefonSorunu`, `tcSorunu`, `adDuzelt`; [sunucu/guvenlik.md](../../sunucu/guvenlik.md) —
  `onayBaglantisiGonder`, `epostaAlaniVarMi`, `kayitSayaci`; [sunucu/veri/depo/onaylar.md](../../sunucu/veri/depo/onaylar.md) —
  bekleyen kayıtlar (`eposta_onaylari`).
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md), [testler/test-cakisma.md](../../testler/test-cakisma.md),
  [testler/guvenlik-test.md](../../testler/guvenlik-test.md), [testler/test-yetiskin.md](../../testler/test-yetiskin.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kayıt kuralları", "Aynı e-posta, kullanıcı adı ve
  T.C. (çakışmalar)", "Hesap türleri ve portallar").
- Android: uygulamanın kayıt ekranı aynı ucu çağırır ([Android uygulaması](../uygulama/android-uygulamasi.md)).

## Sık sorulanlar

- **Kayıt olurken neden öğretmen, müdür, sınıf ya da branş seçmiyorum?** Herkes aynı hesabı açar; hesap ilk açıldığında
  rolsüzdür. Öğretmenliği ve branşı müdür verir, okulunu açtırmak için kişi kodunu yöneticiye verirsin.
- **Kayıttan sonra e-postama gelen bağlantı ne?** Hesabının gerçekten sana ait bir adrese açıldığını doğrular. Hesap,
  bağlantıya 24 saat içinde tıklayınca açılır; bağlantı bir kez kullanılır (sitenin SSS'si).
- **Aynı hesapla hem veli hem öğretmen olabilir miyim?** Evet. Tek hesapla birden çok rolün olur; portalların sol üstteki
  menüde alt alta durur.
- **Öğrenciyim, kayıt olabilir miyim?** Öğrenci hesabını okul açar; kayıt formundan öğrenci hesabı açılmaz.
- **Bağlantı gelmedi.** Gereksiz (spam) klasörüne bak. Aynı adresle yeniden kayıt olabilirsin (saatte en çok 3 posta); her yeni
  kayıt eskisini geçersiz kılar.

## Sırada

- T.C. kimlik no bütün hesaplarda zorunlu (iş 32): kayıtta alan zorunlu olacak, not metni "Hesapların doğru eşleşmesi için
  gerekli; okulla paylaşılmaz" olacak; Android kayıt ekranında da.
- Çalışan olarak ekleme: bilgi kutusunda "öğretmen olarak katılırsın" yerine "çalışan olarak katılırsın".
- Tek kişi tek hesap + portallar öğrencide de: kullanıcı adı site genelinde tek.
- Kayıtta il/ilçe seçimi: kullanıcıya sorulacak (Tasarım 1'de var).
- Çok dil: formun bütün metinleri çeviri kataloğuna.
