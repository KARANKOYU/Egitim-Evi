# Hesap ayarları · Açık oturumlarım

**Durum:** Tasarlandı — henüz kodda yok.

Hesabına hangi cihazlardan giriş yapılmış olduğunu (cihaz, tarayıcı ya da uygulama, ilk giriş, son görülme) gördüğün ve tanımadığın
cihazı tek tek ya da hepsini birden çıkardığın liste.

## Ne işe yarar

Telefonunu kaybettiysen, okulun ortak bilgisayarında çıkış yapmayı unuttuysan ya da "Yeni bir cihazdan girildi" uyarısı aldıysan o
oturumu şifreni değiştirmeden kapatırsın. Kullanıcı 27 Eylül'de önerilerden "3 4 5 6 7" diyerek üçüncüsünü seçti: yeni cihazdan giriş
uyarısı ve "Açık oturumlarım".

## Nereden açılır

- Hesap ayarları → **"Şifre ve güvenlik"** → **"Açık oturumlarım"** satırı: "<N> cihazda açık", altında "Hesabına giriş yapılmış
  cihazlar; tek tek çıkış", düğme **"Yönet"** (Tasarım 1 önizlemesi).
- Yeni cihaz uyarısındaki yönlendirme ([Yeni cihaz uyarısı](../giris-hesap/yeni-cihaz-uyarisi.md)).
- Bugün bu sayfa yok. Başka cihazlardaki oturumları kapatmanın bugünkü tek yolu şifreni değiştirmektir
  ([Şifre değiştirme](sifre-degistirme.md)).

## Adım adım

### Herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. Hesap ayarları → Şifre ve güvenlik → "Açık oturumlarım" → **"Yönet"**.
2. **"Açık oturumlarım"** penceresi açılır. Üstte: "Hesabına giriş yapılmış cihazlar. Tanımadığın bir cihaz görürsen çıkış yap ve şifreni
   değiştir."
3. Her oturum bir satır: cihaz simgesi, **"<cihaz> · <tarayıcı ya da uygulama>"** (ör. "Windows bilgisayar · Microsoft Edge", "iPhone ·
   Safari", "Android telefon · Eğitim Evi uygulaması"), altında **"İlk giriş: <tarih> · Son görülme: <tarih ya da "şu an">"**.
   Bulunduğun cihazın satırında yeşil **"bu cihaz"** rozeti vardır, onda düğme yoktur.
4. Tanımadığın bir oturumun satırında **"Çıkış yap"**a bas: satır listeden kalkar ve **"<cihaz> oturumu kapatıldı."** yazar.
5. Hepsini kapatmak için altta kırmızı **"Diğer bütün cihazlardan çık"**: önce **"Kimliğini doğrula"** ekranı açılır ("Diğer
   cihazlardaki oturumları kapatmak için önce şifreni yaz.", doğrulama uygulaması kuruluysa onun kodu da). Doğrulayınca yalnız bu cihaz
   kalır: **"<N> cihazdaki oturum kapatıldı; yalnız bu cihaz açık."** Tek oturumun varsa düğme basılmaz.
6. **"Kapat"** pencereyi kapatır. Ayarlar'daki "<N> cihazda açık" yazısı güncellenir.
7. Biri hesabına girdiyse oturumunu kapattıktan sonra şifreni de değiştir.

### Veli

Velide her çocuk ayrı oturumdur (kullanıcının 3 Ekim kararı); liste yetişkin hesabının oturumlarını gösterir: hangi portalda olursan
ol aynı liste ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen ve müdür

Portal değiştirmek yeni oturum demektir ama aynı cihazdır; liste cihaz cihaz gösterir. Okulun ortak bilgisayarında açık kalmış oturumu
buradan kapatırsın.

### Yönetici ve destek

Kendi oturumları için aynı liste. Ayrıca başkasının hesap sayfasında "kaç açık oturumu var" görür ve kişinin isteğiyle "oturumları
kapat" der (tasarım; [Hesaba müdahale](../yonetim/hesaba-mudahale.md)).

## Kurallar ve sınırlar

- **Cihaz tanıma** (tanım): oturuma kısa bir cihaz özeti yazılır — tarayıcı, işletim sistemi, uygulama mı. IP adresinin kendisi
  saklanmaz ve gösterilmez (yalnız özeti). Yer bilgisi IP'den çıkarılmaz.
- **Telefon uygulaması oturumları da listededir.**
- **Oturum süreleri (bugün):** tarayıcıda 7 gün, telefon uygulamasında 30 gün; kullandıkça uzamaz. Portal değişince açılan yeni oturum
  eskisinin süresini devralır. Bugün oturum kaydında cihaz bilgisi ve son görülme zamanı yoktur; liste bunlar eklenince yapılabilir.
- **Bugünkü kapanma yolları:** "Çıkış yap" yalnız o cihazdaki oturumu kapatır ([Çıkış yap](../giris-hesap/cikis-yap.md)); şifre
  değişince bu oturum dışındaki hepsi kapanır; hesap silinince hepsi gider.
- **"Diğer bütün cihazlardan çık"** önce kimlik doğrulama ister; tek bir oturumu kapatmak istemez (Tasarım 1).
- **Verilerimi indir** dosyasında açık oturumların ve cihazların da yer alır (anahtarlar hariç) ([Verilerimi indir](verilerimi-indir.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Şifre ve güvenlik](guvenlik.md) · [Şifre değiştirme](sifre-degistirme.md) ·
[Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Verilerimi indir](verilerimi-indir.md).

**İlgili:** [Yeni cihaz uyarısı](../giris-hesap/yeni-cihaz-uyarisi.md), [Çıkış yap](../giris-hesap/cikis-yap.md),
[Beni hatırla](../giris-hesap/beni-hatirla.md), [Doğrulama ekranlarından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md),
[Hesaba müdahale](../yonetim/hesaba-mudahale.md), [Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

Bugün kodda yok. Tanım: Sistem işi (yeni cihaz uyarısı + açık oturumlar). Kodlanınca değişecek yerler:

- Depo: [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md) (bugün oturum kaydı: anahtarın özeti, kişi, uygulama mı,
  açılış anı; cihaz özeti ve son görülme eklenecek), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (yeni şema dosyası).
- Sunucu: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) (oturum doğrulama), [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)
  (giriş ve şifre değişiminde kapanan oturumlar), [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (telefon uygulamasının
  cihaz anahtarı).
- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Güvenlik bölümü).

## Sık sorulanlar

- **Tanımadığım bir cihaz var.** Satırındaki "Çıkış yap"a bas, sonra şifreni değiştir.
- **Telefonumu kaybettim.** Bilgisayardan Açık oturumlarım'a gir, telefonun oturumunu kapat. Bugün bunun için şifreni değiştir.
- **Uygulamadan çıkarsam liste değişir mi?** Evet; çıkış yapılan oturum listeden kalkar.

## Sırada

- Sistem: yeni cihazdan giriş uyarısı + Açık oturumlarım (cihaz özeti, son görülme, tek tek çıkış, diğer bütün cihazlardan çık).
