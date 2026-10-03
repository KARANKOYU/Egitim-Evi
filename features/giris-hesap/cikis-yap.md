# Giriş ve hesap · Çıkış yap

**Durum:** Kodda var; tasarımda ek olarak profil menüsünün en altında kırmızımsı "Çıkış yap", ondan ayrı bir "Ana siteye dön" düğmesi ve çıkıştan sonra tarayıcının geri/ileri tuşunun hesaba geri sokmaması.

Bu cihazdaki oturumunu kapatıp giriş sayfasına dönmek; bir kez gösterilen şifreler açıksa önce sorulur, servisçinin açık seferi biter, bu cihazın telefon bildirimi bırakılır.

## Ne işe yarar

Ortak bir bilgisayarda (okulda, öğretmenler odasında, kütüphanede) işin bitince arkandan gelen kişi senin hesabını görmesin.
Kullanıcı 30 Eylül'de vurguladı: "çıkış yap önemli ve mobil için önemli, unutma, öğretmenler çoğunlukla onu kullanacak"; aynı
gün de "ileri tuşu bir hesaptan çıktıktan sonra hesaba atmasın" dedi (bu ikincisi henüz kodda yok).

## Nereden açılır

Bugün:

- Sol menünün en altında, "Ayarlar"ın altında **"Çıkış Yap"** (kapıdan dışarı çıkan ok simgesiyle) ([Sol menü](../menu-ve-arama/sol-menu.md)).
  Telefonda sol üstteki üç çizgili menü düğmesiyle açılan menüde aynı yerde ([Telefonda menü](../menu-ve-arama/telefonda-menu.md)).
- Ayarlar sayfasının en altında kırmızı **"Çıkış yap"** düğmesi.
- "Kendi şifreni belirle" penceresinde **"Çıkış yap"** ([İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md)).
- Aydınlatma metni onay penceresinde **"Çıkış yap"** ([Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)).
- Android uygulamasında hesabın menüsü ([Android uygulaması](../uygulama/android-uygulamasi.md)).

Tasarımda (Tasarım 1 önizlemesi):

- **Profil menüsünün en altında** "Portallarım", "Uygulamayı indir", "Ana siteye dön"den sonra, ana renkte kalın **"Çıkış yap"**
  ([Profil menüsü](../menu-ve-arama/profil-menusu.md)).
- **Sol menünün en altında** "Ana siteye dön" ve **"Çıkış yap"**; telefonda sabit ve hep görünür.
- **"Oturumunu seç"** ekranının altında "Çıkış yap" bağlantısı ([Portal seçme ekranı](../portallar/portal-secme-ekrani.md)).
- Atlanamayan ekranların sol üstünde **"← Çıkış yap"** ([Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md)).
- Tahtada profil menüsünde "Çıkış yap".

## Adım adım

### Herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, yönetici)

1. **"Çıkış Yap"**a bas.
2. Ekranda bir kez gösterilen şifreler açıksa önce tarayıcının onay kutusu gelir:
   - giriş bilgileri listesi indirilmediyse: "Giriş bilgileri listesini indirmedin ya da yazdırmadın. Ayrılırsan bu şifreler bir
     daha gösterilmez. Ayrılınsın mı?";
   - yeni açılan bir hesabın şifresi ekrandaysa: "Yeni şifre ekranda ve bir daha gösterilmeyecek. Kişiye ilettiysen
     ayrılabilirsin. Ayrılınsın mı?";
   - Excel aktarımında açılan hesapların giriş bilgileri yazdırılmadıysa: "Açılan hesapların giriş bilgilerini yazdırmadın. Devam
     edersen bu şifreler bir daha gösterilmez. Devam edilsin mi?"
   "İptal" dersen çıkış olmaz, ekran yerinde kalır ([Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md)).
3. Sonra sırayla: servisçiysen açık seferin bitirilir; bu cihazın telefon bildirimi aboneliği bırakılır (başka biri bu cihazda
   girerse senin bildirimlerin gelmesin); sunucudaki oturumun silinir.
4. Ekran temizlenir: açık pencere kapanır, bildirim paneli boşalır, seçili öğrenci, yoklama dersi, ödev süzgeçleri, şifre
   listeleri gibi her şey sıfırlanır (sonraki kişi öncekinin ekranını görmesin).
5. Bu sekmenin oturumu silinir. Tarayıcıda "Beni hatırla" ile hatırlanan oturum yalnız seninse silinir; başka sekmede başka
   hesapla açık oturum yerinde kalır ([Beni hatırla](beni-hatirla.md)).
6. Giriş sayfası açılır: okulunun sayfasından girdiysen o okulun giriş sayfasında kalırsın, değilse `/login`.

Bağlantı kopmuş olsa bile tarayıcı tarafı yine temizlenir (sunucuya ulaşılamazsa ekran yine çıkış yapar).

### Servisçi

Açık bir seferin varken çıkış yaparsan sefer bitirilir ve konum gönderimi durur ([Sabah seferi](../servis/sabah-seferi.md),
[Akşam seferi](../servis/aksam-seferi.md)).

### Yönetici

Yönetim adresinden çıkış yapınca yönetim çerezi de silinir ve sayfa baştan, herkese giden dosyayla `/login` olarak açılır
(yönetim dosyası sayfada kalmasın) ([Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md)).

### Tahta

Tasarlandı — henüz kodda yok. Tahta okulun ortak cihazıdır; tanımda ortak bilgisayar, okul cihazı ve tahtada **"Çıkış yap"
düğmesinin üst şeritte hep görünür** olması öneriliyor (unutulan oturum en büyük risk).

Tasarımda (kullanıcının 30 Eylül kararları ve Tasarım 1 önizlemesi):

1. **İki ayrı simge**: "Ana siteye dön" kapıdan **sola** çıkan ok (oturum kapanmaz, açılış sayfasına gidilir; orada sağ üstteki
   "Hesaba gir" ile portala dönülür) ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)); "Çıkış yap" bugünkü kapıdan **sağa**
   çıkan ok, karışmasın diye kırmızımsı yazı. Bütün "Çıkış yap" düğmeleri aynı simgeyi taşır.
2. Çıkınca kısa bildirim: "Çıkış yapıldı." ve giriş sayfası.
3. **Çıkıştan sonra geri/ileri tuşu hesaba sokmaz**: eski bir portal adresine (`#/odevler` gibi) geri ya da ileri gidilirse
   giriş sayfası gelir; A çıkıp B girdiyse geri tuşu B'yi A'nın sayfasına götürmez, B'nin ana sayfasına düşer. Tanımdaki kurallar:
   (1) oturum yokken hiçbir portal sayfası açılmaz, adres giriş sayfasına çevrilir; (2) her geçmiş kaydına oturumun kimliği
   (rastgele, anahtar değil) yazılır, bugünkü oturumla tutmuyorsa o kayda gidilmez; (3) tarayıcı sayfayı önbellekten geri
   getirirse oturum yeniden sorulur, yoksa giriş; (4) uygulamanın kabuğu ve API cevapları önbelleğe alınmaz; (5) servis çalışanı
   API cevaplarını önbelleğe almaz. Aynı kural Android'in geri tuşunda ([Geri tuşu](../uygulama/geri-tusu.md)).
4. Telefonda: dokunma alanı en az 44 piksel; "Çıkış yap" sol menünün en altında sabit ve görünür.

## Kurallar ve sınırlar

- **Çıkış yalnız bu cihazdaki (bu sekmedeki) oturumu kapatır**; başka cihazlardaki oturumların açık kalır. Hepsini kapatmak için
  şifreni değiştir (öbür oturumlar kapanır) ya da tasarımdaki Açık oturumlarım'dan "Diğer bütün cihazlardan çık"
  ([Açık oturumlar](../ayarlar/acik-oturumlar.md)).
- **Bir kez gösterilen şifreler korunur**: indirilmemiş/yazdırılmamış şifre listesi açıkken çıkış, sayfa değiştirme, sayfayı
  yenileme ve sekmeyi kapatma önce sorar.
- **Sunucu tarafı**: oturum kaydı silinir; yöneticide yönetim çerezi de sildirilir. Çıkış her zaman serbesttir (aydınlatma onayı
  eski ya da şifresi değişmeli kişi de çıkabilir).
- **Android**: uygulama çıkışta önce kendi cihaz anahtarını siler, sonra oturumu kapatır.
- **Bilinen açık** (kod değiştirilmedi; kullanıcı "şimdi yazma, md'lere ekle" dedi): çıkıştan sonra tarayıcının ileri (ya da geri)
  tuşu eski portal adresine gider; sayfa değişikliğini dinleyen kod oturum yokken de sayfayı çizmeye çalışır.
- Çıkış okulun işlem kaydına yazılmaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Beni hatırla](beni-hatirla.md) — hangi anahtarın silindiği.
- [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md) — atlanamayan ekranda "← Çıkış yap".
- [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md) — pencerede "Çıkış yap".
- [Giriş](giris.md), [Okulun sayfasından giriş](okulun-sayfasindan-giris.md) — çıkıştan sonra açılan sayfa.
- [Yeni cihaz uyarısı](yeni-cihaz-uyarisi.md) — tanımadığın cihazdaki oturumu kapatmak.

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md), [Profil menüsü](../menu-ve-arama/profil-menusu.md),
  [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md), [Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md).
- [Açık oturumlar](../ayarlar/acik-oturumlar.md).
- [Telefon bildirimi](../bildirim/telefon-bildirimi.md) — çıkışta aboneliğin bırakılması.
- [Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md) — bir kez gösterilen şifreler.
- [Geri tuşu](../uygulama/geri-tusu.md) — Android.

## Kod tarafı

- Ön yüz: [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — `cikisYap`, `oturumDurumunuSifirla`;
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `tokenSil`; [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md)
  — bir kez gösterilen bilgiler (`TEK_SEFER`, `tekSeferAyrilabilir`); [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md)
  — sol menüdeki "Çıkış Yap"; [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — Ayarlar'daki
  düğme; [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `cikis` eylemi, geri/ileri tuşu (hashchange),
  sekme kapatırken sorma; [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md) — aboneliği bırakma;
  [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) — seferin durması.
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/logout`; [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md)
  — çerezin silinmesi.
- Testler: [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md) (yöneticinin çıkışında çerez silinir, öğretmende silme
  başlığı yok), [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (`cikis` eyleminin karşılığı).

## Sık sorulanlar

- **Çıkış yapmazsam ne olur?** "Beni hatırla" seçiliyse oturum o bilgisayarda 7 gün açık kalır. Ortak bilgisayarda mutlaka çık;
  unuttuysan başka bir cihazdan şifreni değiştir.
- **Çıkış yapınca telefonumdaki uygulamadan da çıkılır mı?** Hayır; yalnız bu cihazdan çıkarsın.
- **"Ayrılınsın mı?" diye soruyor.** Ekranda bir daha gösterilmeyecek şifreler var (giriş bilgileri listesi ya da yeni hesabın
  şifresi). Önce indir ya da yazdır, sonra çık.

## Sırada

- Üst şerit sadeleştirme (iş 29): profil menüsünün en altında "Çıkış", ayrı "Ana siteye dön", ortak bilgisayar / okul cihazı /
  tahtada şeritte hep görünen çıkış; çıkıştan sonra ileri/geri tuşunun hesaba sokmaması (Linux'ta).
- Android geri tuşu (iş 33): aynı kural uygulamada.
- Sistem: Açık oturumlarım'dan tek tek ve toplu çıkış.
