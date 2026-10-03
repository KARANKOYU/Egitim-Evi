# Giriş ve hesap · Kullanıcı adı

**Durum:** Kodda var; tasarımda ek olarak kayıtta yazarken "Kullanılabilir." / "Bu kullanıcı adı alınmış." denetimi, kullanıcı adının site genelinde tek olması, "tahta." ile başlayan adların okul tahtalarına ayrılması ve yalnız rakamdan oluşan adın hiçbir yerde gösterilmemesi.

Girişte e-posta yerine yazabileceğin, harfle başlayan, Türkçe harfsiz kısa ad; yetişkin kendisi seçer, öğrenci ve servisçiye okul verir.

## Ne işe yarar

Kullanıcı adı girişin iki kimliğinden biridir (öbürü e-posta). Öğrenci ve servisçinin çoğu zaman e-postası olmadığı için
onlar yalnız kullanıcı adıyla girer; okul boş bırakırsa kullanıcı adı kişinin T.C. kimlik numarası olur. Yetişkin (veli,
öğretmen, müdür, çalışan) kayıtta kendisi seçer; ister e-postayla ister bu adla girer. Kullanıcının 29 Ağustos sözü: "kayıt
olda kullanıcı adı var dimi, bu serbest kullanıcı adı şeyi".

## Nereden açılır

- Kayıtta **"Kullanıcı adı"** kutusu ([Kayıt olma](kayit-olma.md)).
- Girişte "Kullanıcı adı" seçimi ([Giriş](giris.md)).
- Yetişkin: Ayarlar → Giriş bilgileri'nde değiştirir ([Giriş bilgileri](../ayarlar/giris-bilgileri.md)).
- Öğrenci ve servisçi: okul yönetimi hesabı açarken verir, Hesap penceresinde değiştirir
  ([Hesap penceresi](../hesaplar/hesap-penceresi.md)); toplu giriş bilgisi kâğıdında yazılıdır
  ([Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md)).

## Adım adım

### Veli, öğretmen, çalışan ve müdür

1. Kayıtta "Kullanıcı adı" kutusuna bir ad yaz. Kutu sen yazarken düzeltir: büyük harf küçüğe, "İ" "i"ye, boşluk noktaya döner
   (imleç yerinde kalır).
2. Kural dışıysa "Kayıt Ol"a basınca kutunun altında yazar (aşağıdaki iletiler).
3. Ad alınmışsa sunucu söyler: "Bu kullanıcı adı alınmış. Başka bir ad dene."
4. Sonradan değiştirmek için Ayarlar → Giriş bilgileri: yeni ad + mevcut şifre ([Giriş bilgileri](../ayarlar/giris-bilgileri.md)).
   Okullardaki rol satırların da yeni adı alır.

Tasarımda (Tasarım 1 önizlemesi): yazarken kutunun altında canlı yazı: "Harfle başlamalı.", "Yalnız harf, rakam, nokta ve alt
çizgi olabilir (Türkçe harf yok).", "En az 3 karakter olmalı.", "Bu kullanıcı adı alınmış." (kırmızı) ya da "Kullanılabilir."
(yeşil). Boş gönderilirse "Bir kullanıcı adı seç.". Ayarlar'daki değiştirme penceresinde de "alınmış mı" denetimi var.

### Öğrenci ve servisçi

1. Kullanıcı adını okulun verir. Okul boş bırakırsa adın T.C. kimlik numaran olur.
2. Okulunun sayfasından bu adla (ya da T.C. numaranla) girersin ([Okulun sayfasından giriş](okulun-sayfasindan-giris.md)).
3. Değiştirmek istersen okul yönetimine söylersin; Ayarlar'da kendin değiştiremezsin (sunucu: "Bu işlem yetişkin hesabıyla
   yapılır. Hesabını okul yönetimi düzenler.").

### Müdür (okulun açtığı hesaplar için)

Öğrenci ya da servisçi açarken kullanıcı adını yazar ya da boş bırakır (o zaman T.C. no olur). Kurallar aynıdır; ek olarak
rakamlardan oluşan ad yalnız kişinin kendi T.C. numarası olabilir ve ad okul içinde tek olmalıdır
([Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md)).

### Eğitmen

Tasarlandı — henüz kodda yok. Eğitmen olmak için harf içeren bir kullanıcı adı şarttır: yönetici ya da destekçinin "Eğitmen yap"
düğmesi bunu denetler, yoksa "Önce harf içeren bir kullanıcı adı seçmeli" der ([Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)).

### Tahta

Tasarlandı — henüz kodda yok. Tahta hesaplarının adı her zaman `tahta.` ile başlar (`tahta.1`, `tahta.7a`, `tahta.konferans`);
müdür yalnız noktadan sonrasını yazar. Tahta adı okul içinde tektir, başka okulda aynı `tahta.1` olabilir
([Tahta hesabı açma](../tahta/tahta-hesabi-acma.md)).

## Kurallar ve sınırlar

- **Biçim** (sunucu ve tarayıcı aynı kural; iletiler aynen):
  - boşsa "Bir kullanıcı adı belirle.";
  - 3 karakterden kısaysa "Kullanıcı adı en az 3 karakter olmalı.";
  - 30 karakterden uzunsa "Kullanıcı adı en fazla 30 karakter olabilir.";
  - Türkçe harf varsa "Kullanıcı adında Türkçe harf kullanma (ç yerine c, ş yerine s gibi).";
  - harfle başlamıyorsa "Kullanıcı adı bir harfle başlamalı.";
  - harf, rakam, nokta, alt çizgi dışında bir şey varsa "Kullanıcı adında yalnızca harf, rakam, nokta ve alt çizgi olabilir.".
- **Büyük/küçük harf fark etmez**: ad küçük harfle saklanır, "İSMAİL" ile "ismail" aynıdır; tam genişlikli harfler ve görünmez
  karakterler de temizlenir.
- **Tekillik bugün**:
  - yetişkin hesabının adı hiçbir yerde (okul hesapları dahil) kullanılmamış olmalı;
  - okul hesaplarında (öğrenci, servisçi; eski düzende okulun açtığı öğretmen ve müdür) ad **okul içinde** tektir: iki okulda
    aynı ad olabilir; bu yüzden öğrenci okulunun sayfasından girer, okulsuz girişte ad birden çok okulda varsa "Önce okulunu
    seç" denir ([Giriş](giris.md));
  - sistem yöneticisinin adı hiçbir hesapla (hiçbir okulda) aynı olamaz.
- **Rakamlardan oluşan ad** yalnız okul hesabında ve yalnız kişinin kendi T.C. numarasıysa olur ("Rakamlardan oluşan kullanıcı
  adı yalnızca kişinin T.C. kimlik no'su olabilir"). T.C. değişince adı eski T.C. olan hesabın adı da yenisine döner.
- **Okulda alınmış ad**: "Bu kullanıcı adı okulda alınmış".
- **Değiştirme sınırı** (yetişkin, Ayarlar): hesap başına saatte 10 değişiklik ("Çok sık değiştirdin. Biraz sonra dene.");
  mevcut şifre şart ("Mevcut şifre yanlış.").
- **Aynı anda iki kişi aynı adı alırsa** veritabanının tekil dizini ikincisini durdurur; kişi hangi alanın çakıştığını söyleyen
  açık bir ileti alır.
- **Şifre kullanıcı adını içeremez** (ad 4 karakter ya da uzunsa, şifre değiştirirken) ([Şifre kuralları](sifre-kurallari.md)).

Tasarımda (kullanıcının kararları):

- **Site genelinde tek** (29 Eylül: "kullanıcı adı her sitede çalışacak"): bugün okul içinde tek olan okul hesaplarının adları da
  tek olur. Veri taşımada çakışan okul hesaplarına ek gelir (`deniz.ak` → `deniz.ak2`); değişenler müdürün ekranında listelenir,
  yeni giriş kâğıdı basılır, kişiye bildirim gider.
- **Kullanıcı adı yalnız ana hesapta** tutulur; rol satırlarının ayrı adı kalkar (kullanıcı cevap vermedi, öneriyle ilerlendi).
- **`tahta.` ayrılmış önek** (29 Eylül): normal kullanıcı adı `tahta.` ile başlayamaz; kural sunucunun ve tarayıcının ad
  denetimine eklenir ("tahta. ile başlayan adlar okul tahtalarına ayrılmıştır"); mevcut böyle bir ad varsa veri taşımada ek alır.
  Genel `/login`'de `tahta.` ile başlayan ad yazılırsa "Tahta hesapları okulun sayfasından girer" denir.
- **Yalnız rakamdan oluşan ad hiçbir yerde gösterilmez** (29 Eylül): "Paylaşan" satırı, kullanıcı sayfasının başlığı,
  e-postalardaki "Bu e-posta @kullaniciadi hesabı içindir" satırı, bildirimler ve listelerde yerine "Deniz A." (ad + soyadın
  baş harfi) yazılır; böyle bir hesabın kullanıcı sayfası adla değil hesap kimliğiyle açılır, T.C. adrese ve günlüklere düşmez.
- **Öneri, karar yok**: `admin`, `yonetici`, `destek`, `egitmen`, `egitimevi`, `sistem` gibi adların hiçbir kullanıcıya
  verilmemesi (kimliğe bürünmeye karşı) — kullanıcıya soruldu.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Kayıt olma](kayit-olma.md) — adın seçildiği yer.
- [Giriş](giris.md), [Okulun sayfasından giriş](okulun-sayfasindan-giris.md) — adla giriş, okul seçme.
- [T.C. kimlik numarası](tc-kimlik-no.md) — okul hesabında adın T.C. olması.
- [Şifre kuralları](sifre-kurallari.md) — şifre adı içeremez.

**İlgili:**

- [Giriş bilgileri](../ayarlar/giris-bilgileri.md) — yetişkinin adını değiştirmesi.
- [Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md), [Hesap penceresi](../hesaplar/hesap-penceresi.md),
  [Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md) — okulun verdiği adlar.
- [Tahta hesabı açma](../tahta/tahta-hesabi-acma.md) — `tahta.` önekli adlar.
- [Kullanıcı arama](../yonetim/kullanici-arama.md) — `/users/<ad>` sayfası (tasarım).

## Kod tarafı

- Sunucu: [sunucu/ortak.md](../../sunucu/ortak.md) — `kullaniciAdiSorunu`, `normKullaniciAdi`;
  [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — kayıtta tekillik (`kullaniciAdiHerhangiYerde`);
  [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `POST /api/hesap/bilgi`;
  [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — okul hesaplarında ad (boşsa T.C.);
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `girisKimligiyle`, `kullaniciAdiVarMi`,
  `bosKullaniciAdi`.
- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `kullaniciAdiSorunuTR`, kayıttaki yazarken
  düzeltme.
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md), [testler/test-cakisma.md](../../testler/test-cakisma.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Aynı e-posta, kullanıcı adı ve T.C. (çakışmalar)",
  "Kullanıcı adı ve şifre").

## Sık sorulanlar

- **Kullanıcı adımda Türkçe harf olabilir mi?** Hayır; "ç" yerine "c", "ş" yerine "s" yaz.
- **Büyük harfle yazarsam olur mu?** Olur; ad küçük harfle saklanır, girişte büyük/küçük harf fark etmez.
- **Okulun verdiği kullanıcı adım bir sayı, neden?** Okul boş bırakınca adın T.C. kimlik numaran olur. Okul yönetiminden
  değiştirmesini isteyebilirsin.
- **Kullanıcı adımı unuttum.** E-postan varsa e-postanla gir. Yoksa okul yönetimine sor.

## Sırada

- Tek kişi tek hesap + portallar öğrencide de: kullanıcı adı site genelinde tek, veri taşıma ve yeni giriş kâğıtları.
- Toplantılar ve tahta hesabı: `tahta.` ayrılmış önek kuralı.
- Kullanıcı arama: rakamdan oluşan adın hiçbir yerde görünmemesi.
- Çok dil: iletiler çeviri kataloğuna.
