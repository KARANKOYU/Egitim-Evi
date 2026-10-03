# Giriş ve hesap · Yeni cihaz uyarısı

**Durum:** Tasarlandı — henüz kodda yok.

Hesabına daha önce görülmemiş bir cihazdan ya da tarayıcıdan girilince e-postana ve bildirimlerine "Yeni bir cihazdan girildi … Sen değilsen şifreni değiştir." uyarısı gitmesi.

## Ne işe yarar

Şifren ve kodun bir şekilde başkasının eline geçse bile girişi hemen fark edersin. Kullanıcı 27 Eylül'de "3 4 5 6 7" diyerek
önerilerin üçüncüsünü seçti: yeni cihazdan giriş uyarısı ve "Açık oturumlarım". Uyarı yalnız haber verir; girişi engellemez.
Ne yapacağını söyler: sen değilsen şifreni değiştir (şifre değişince öbür bütün oturumlar kapanır) ya da Açık oturumlarım'dan o
cihazın oturumunu kapat.

## Nereden açılır

- E-posta kutun: yeni cihazdan girişte gelen posta.
- Eğitim Evi'nin bildirim zili ve telefon bildirimi ([Bildirim paneli](../bildirim/bildirim-paneli.md)).
- Ayarlar → Şifre ve güvenlik → **"Açık oturumlarım"** ([Açık oturumlar](../ayarlar/acik-oturumlar.md)).

## Adım adım

### E-postası olan herkes (veli, öğretmen, çalışan, müdür, eğitmen, yönetici, destek; e-postası olan öğrenci ve servisçi)

1. Yeni bir bilgisayardan, telefondan ya da tarayıcıdan girersin (kod adımı dahil her şey her zamanki gibi).
2. Giriş bitince e-postana ve bildirimlerine uyarı gelir. Tanımdaki örnek cümle: "Yeni bir cihazdan girildi: Chrome, Windows —
   27.09.2026 18:40. Sen değilsen şifreni değiştir."
3. Giren sensen bir şey yapmazsın.
4. Sen değilsen:
   1. hemen şifreni değiştir (Ayarlar → Şifre değiştir) ya da "Şifremi unuttum" ile yeni şifre koy: bu oturum dışındaki bütün
      oturumlar kapanır ([Şifremi unuttum](sifremi-unuttum.md));
   2. Ayarlar → Açık oturumlarım'da tanımadığın cihazın satırında **"Çıkış yap"**a bas ya da **"Diğer bütün cihazlardan çık"**
      ([Açık oturumlar](../ayarlar/acik-oturumlar.md)).

"Açık oturumlarım" penceresi (Tasarım 1 önizlemesi): "Hesabına giriş yapılmış cihazlar. Tanımadığın bir cihaz görürsen çıkış yap
ve şifreni değiştir." Her satırda cihaz ve tarayıcı ("Windows bilgisayar · Microsoft Edge", "iPhone · Safari", "Android telefon ·
Eğitim Evi uygulaması"), "İlk giriş: <tarih> · Son görülme: <tarih>", bulunduğun cihazda "bu cihaz" rozeti, öbürlerinde
**"Çıkış yap"**; altta **"Kapat"** ve kırmızı **"Diğer bütün cihazlardan çık"** (önce "Kimliğini doğrula"; sonra "N cihazdaki
oturum kapatıldı; yalnız bu cihaz açık."). Tasarım 1'de yeni cihaz e-postası ya da bildirimi ayrıca çizilmedi.

### Öğrenci ve servisçi (e-postası yoksa)

E-posta gelmez. Tanım uyarıyı "e-postası olan hesaba" yazıyor; e-postasız hesaba yalnız bildirim gidip gitmeyeceği yazılı
değil (kodlanırken netleşecek).

### Tahta

Tahta ortak bir cihazdır, kişiye ait değildir; uyarı tahtaya uygulanmaz (tanımda tahta için ayrı bir şey yazmıyor).

## Kurallar ve sınırlar

- **Cihaz nasıl tanınır**: her oturuma kısa bir cihaz özeti yazılır: tarayıcı + işletim sistemi + uygulama mı. Daha önce bu
  hesapta görülmemiş bir özetle girilince uyarı gider.
- **IP saklanmaz, gösterilmez** (yalnız cihaz özeti). Tanımdaki örnek cümlede bir şehir adı da geçiyor ama aynı satır "IP'den
  değil — yalnız tarayıcı/cihaz" diyor; IP saklanmadığı için konum bilgisi çıkarılamaz. Uyarıda şehir yazılıp yazılmayacağı
  kodlanırken kullanıcıya sorulacak.
- **Telefon uygulamasının oturumları** da Açık oturumlarım listesinde görünür.
- **Uyarı girişi durdurmaz**; korumayı iki adımlı giriş ve kilitler sağlar ([İki adımlı giriş](iki-adimli-giris.md),
  [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md)).
- **E-posta sağlığı**: uyarı postası giriş koduyla aynı yoldan gider; e-posta gönderilemiyorsa yöneticiye bildirim
  ([E-posta sağlığı](../yonetim/eposta-sagligi.md)).
- **KVKK**: cihaz özeti kişisel veridir; aydınlatma metnine eklenir, sürüm artar (kişisel veri işleyen her yeni özellik için kural).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Giriş](giris.md), [İki adımlı giriş](iki-adimli-giris.md) — uyarıyı tetikleyen giriş.
- [Beni hatırla](beni-hatirla.md) — cihazda saklanan oturum.
- [Şifremi unuttum](sifremi-unuttum.md) — "sen değilsen" yapılacak iş.
- [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md), [Çıkış yap](cikis-yap.md).

**İlgili:**

- [Açık oturumlar](../ayarlar/acik-oturumlar.md), [Şifre değiştirme](../ayarlar/sifre-degistirme.md).
- [Bildirim paneli](../bildirim/bildirim-paneli.md), [Telefon bildirimi](../bildirim/telefon-bildirimi.md).
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

Bugün kodda yok. Tanım: Sistem işi, 6. bölüm (3) "Yeni cihazdan giriş uyarısı + Açık oturumlarım". Kodlanınca değişecek yerler:

- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `oturumCevabi` (oturum açılırken cihaz özeti ve uyarı);
  [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md) — oturum tablosuna cihaz özeti;
  [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — e-posta gönderimi.
- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — Ayarlar'da Açık oturumlarım.
- Aydınlatma metni `public/kvkk/kvkk.html`.

## Sık sorulanlar

- **Yeni telefonumdan girdim, uyarı geldi; bir şey yapmalı mıyım?** Hayır; giren sensen yok say.
- **Uyarıyı ben açmadım, ne yapayım?** Şifreni hemen değiştir; öbür bütün oturumlar kapanır. Açık oturumlarım'dan tanımadığın
  cihazı da kapatabilirsin.
- **Uyarıda nereden girildiği yazar mı?** Tarayıcı, işletim sistemi ve zaman yazar; IP adresi saklanmaz.

## Sırada

- Sistem: yeni cihazdan giriş uyarısı (e-posta + bildirim) ve Açık oturumlarım (cihaz, ilk/son görülme, "bu cihaz", tek tek
  çıkış, "Diğer bütün cihazlardan çık"); aydınlatma metnine cihaz özeti.
