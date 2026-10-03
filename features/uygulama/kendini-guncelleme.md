# Uygulama ve indirme · Kendini güncelleme

**Durum:** Tasarlandı — henüz kodda yok

Android uygulamasının yeni sürüm çıktığını kendisi fark edip "Yeni sürüm var" diye haber vermesi ve tek dokunuşla güncellenmesi.
(Tarayıcıdan yüklenen Eğitim Evi bugün de her açılışta en yeni sürümle açılır; o kısım kodda var, aşağıda.)

## Ne işe yarar

Kimse İndir sayfasını açıp yeni sürüm var mı diye bakmasın. Kullanıcının istekleri (yazıldığı gibi): 29 Ağustos "veya .apk
güncellemesi hani eğer güncel değilse app e güncelle butonu kendini günceller pc ye de"; 26 Eylül "uygulamada kendini güncelleme
falan olcak". Bilgisayar ("pc ye de") 3 Ekim kararından beri tarayıcıdan yüklenir ve güncellemeyi kendiliğinden alır; Android'de
uygulama kendisi bakar.

## Nereden açılır

- **Android uygulaması (tasarım):** uygulama açılınca, yeni sürüm varsa ekranın üstünde şerit: **"Yeni sürüm var: 2.1.0 —
  Güncelle"** (sürüm numarası örnek) ve sürüm notu. Ayrı bir menü yok.
- **İndir sayfası:** tasarımdaki tablo başlığının yanında "Yeni sürüm çıkınca tablonun en üstüne eklenir. Uygulama açılınca yeni
  sürümü kendisi haber verir." ([İndir sayfası](indir-sayfasi.md)).
- **Bugün:** Android'de uygulama sürüm denetimi yapmaz; yeni sürümü İndir sayfasından indirip eskisinin üstüne kurarsın.

## Adım adım

### Android uygulamasını kullananlar

Öğrenci, veli, öğretmen, çalışan, müdür ve servisçi için aynı.

**Bugün:**

1. İndir sayfasını aç; en üstteki "Son sürüm …" telefondakinden yeniyse **"İndir (APK, …)"**.
2. İnen dosyayı aç, **Yükle**. Yeni sürüm eskisinin üstüne kurulur; "Güncellerken yeni sürümü aynı yolla kurarsın; bilgilerin
   silinmez." (oturumun, bildirim ayarın ve çocuğun telefonu bağlantısı kalır).
3. Telefondaki sürümü uygulamada **Ayarlar**'ın en altında görürsün ("Eğitim Evi 2.0.0" gibi).

Bugün yayımda olan Eğitim Evi Aile (1.0.x) de kendini güncellemez; tek uygulama "Eğitim Evi" yayımlanınca onu da İndir sayfasından
bir kez elle kurarsın (aynı paket olduğu için çocuğun telefonunun bağlantısı korunur;
[Android uygulaması](android-uygulamasi.md)).

**Tasarımda (.apk ile kurulan uygulama):**

1. Uygulama açılışta ve günde en çok bir kez yeni sürüm olup olmadığına bakar (İndir sayfasının kullandığı sürüm listesinden ya
   da sunucunun yeni bir sürüm ucundan: sürüm kodu, sürüm adı, notlar, APK adresi, SHA-256 özeti).
2. Yeni sürüm varsa üstte **"Yeni sürüm var: 2.1.0 — Güncelle"** şeridi ve sürüm notu çıkar.
3. **"Güncelle"**ye bas. APK arka planda iner; uygulama dosyanın SHA-256 özetini denetler, sonra Android'in kurulum ekranını açar.
4. Telefonda "bilinmeyen kaynaklardan yükleme" izni kapalıysa uygulama ne yapacağını anlatır ve seni o izin sayfasına götürür; izni
   verip geri dönersin.
5. Android'in ekranında **Yükle**'ye bas; kurulum bitince Eğitim Evi'ni yeniden açarsın, yeni sürümdesin.
6. Şimdi istemiyorsan **"Ertele"**: şerit kapanır (ne zaman yeniden sorulacağı tanımda yazılmadı; uygulama günde en çok bir kez
   baktığı için en erken bir sonraki bakışta).
7. Sunucu en düşük sürümü bildirmişse (tanımda "enAzSurum") ve senin sürümün ondan eskiyse güncelleme **zorunludur**: ertelenemez.

**Tasarımda (Google Play'den kurulan uygulama):** kendi kendine kurma düzeni kapalıdır (Play kuralları buna izin vermez); şeritte
yalnız **"Play Store'da güncelle"** bağlantısı çıkar, güncellemeyi Google Play yapar.

### Tarayıcıdan yükleyen herkes

Bilgisayarda, iPhone'da ya da iPad'de Eğitim Evi'ni tarayıcıdan yükleyen herkes (ziyaretçi dahil).

**Bugün (kodda var):** hiçbir şey yapman gerekmez. Uygulama her açılışta sayfayı ve dosyaları önce sunucudan ister; sunucuda yeni
sürüm varsa doğrudan onu açarsın. Arka plan bileşeninin yeni sürümü de açık pencereleri hemen devralır. Ağ yoksa son saklanan
sürüm açılır ([Ağ yokken açılış](cevrimdisi-acilis.md)).

**Tasarımda:** İndir sayfasında bilgisayar ve iOS için yalnız en yeni satırda "Yükle" vardır; eski satırlarda "—" ("Tarayıcıdan
yüklenen uygulama hep en yeni sürümle açılır"). Tablonun altında "… Bilgisayarda ve iPhone/iPad'de Eğitim Evi tarayıcıdan yüklenir,
güncellemeyi kendisi alır."

## Kurallar ve sınırlar

- **Sıklık (tasarım):** açılışta ve günde en çok bir kez.
- **Güvenlik (tasarım):** yalnız `https://` adresinden iner; SHA-256 özeti tutmayan dosya kurulmaz; Android de yalnız aynı imza
  anahtarıyla imzalanmış paketi güncelleme olarak kabul eder (bu yüzden uygulama hep aynı anahtarla imzalanır).
- **Sürüm sırası:** Android, telefondakinden küçük sürüm kodlu paketi güncelleme olarak kurmaz (eski sürüme dönülmez); yeni sürüm
  ancak sürüm kodu büyükse "yeni" sayılır, bu yüzden her yayında sürüm kodu artırılır.
- **Google Play paketi:** kendi kendine kurma yok; yalnız mağaza bağlantısı (paketin türüne göre).
- **Zorunlu güncelleme:** yalnız sunucu en düşük sürümü bildirirse. Bu değeri kimin, nereden gireceği tanımda yazılmadı (açık nokta).
- **Yeni sürümün kaynağı:** sürümler uygulamanın GitHub deposunda yayımlanır; İndir sayfası ve (tasarımda) uygulamanın kendisi
  oradan öğrenir. Taslak ve ön sürümler sayılmaz ([İndir sayfası](indir-sayfasi.md)).
- **Tarayıcıdan yüklenen uygulama:** sunucuya ulaşılabildiği sürece hep en yenisidir; ağ yavaşsa açılış sunucuyu bekler (zaman
  aşımı yok), ağ hiç yoksa saklanan sürüm açılır.
- **Tasarım 1 önizlemesi** sitenin tasarımıdır; Android'deki "Yeni sürüm var" şeridini çizmez. Şeridin metni ve davranışı
  uygulamanın tanımından.

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [İndir sayfası](indir-sayfasi.md) · [Android uygulaması](android-uygulamasi.md) ·
[Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md) · [Ağ yokken açılış](cevrimdisi-acilis.md) ·
[Doğrulayıcı](dogrulayici.md).

**İlgili:** [Site ayarları](../yonetim/site-ayarlari.md) (Play Store bağlantısı) ·
[Yenilikler penceresi](../menu-ve-arama/yenilikler-penceresi.md) (sitenin "neler yeni" penceresi).

## Kod tarafı

- **Bugün Android'de yok.** Kodlanınca Android deposunda yeni bir sürüm denetimi, indirme ve kurulum (yapı türüne göre Play
  paketinde kapalı); sunucuda gerekiyorsa yeni bir sürüm ucu. Sürüm listesinin bugünkü kaynağı:
  [sunucu/uygulama-surum.md](../../sunucu/uygulama-surum.md) (GitHub sürümleri, 15 dakika saklama), [sunucu/site.md](../../sunucu/site.md)
  (`GET /api/uygulama`).
- **Tarayıcıdan yüklenen uygulamanın güncel kalması:** [public/sw.md](../../public/sw.md) ("önce ağ" kuralı, yeni sürümün hemen
  devralması, önbellek sürümü).
- Testler: [testler/test-uygulama-surum.md](../../testler/test-uygulama-surum.md) (sürüm listesinin süzülmesi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (bölüm kodlanınca eklenecek); Android deposunun `TANITIM.md`'si
  ("Sürüm yayınlama").

## Sık sorulanlar

- **Uygulamayı güncellersem bilgilerim silinir mi?** Hayır; yeni sürüm eskisinin üstüne kurulur, oturumun ve ayarların kalır.
- **Hangi sürümü kullandığımı nereden görürüm?** Android uygulamasında Ayarlar'ın en altında.
- **Bilgisayarda yüklediğim Eğitim Evi'ni nasıl güncellerim?** Güncellemen gerekmez; her açılışta en yeni sürüm gelir.
- **"Güncelle"ye bastım, "bilinmeyen uygulamalar" izni istiyor (tasarım).** Uygulamanın gösterdiği izin sayfasında Eğitim Evi'ne
  izin ver, geri dön; kurulum devam eder. Google Play'den kurduysan bu soru çıkmaz.

## Sırada

- Android yerel uygulama işi: uygulamanın kendini güncellemesi (apk paketinde "Yeni sürüm var" şeridi, Play paketinde mağaza
  bağlantısı, ertele, zorunlu güncelleme).
- İndir sayfasının yeni hâli: "Uygulama açılınca yeni sürümü kendisi haber verir." yazısı uygulamadaki şeritle birlikte doğru olur.
