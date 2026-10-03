# Giriş ve hesap · Doğrulama ekranlarından vazgeçme

**Durum:** Kodda var; tasarımda ek olarak her doğrulama ekranının sol üstünde "←" düğmesi ("Vazgeç", "Çıkış yap" ya da "Ana siteye dön"), Esc tuşu ve geri tuşunun önce ekranı kapatması.

Kod, şifre ya da kimlik soran bir ekrandan çıkmanın yolu: vazgeçilebilen ekranda geldiğin yere dönersin, atlanamayan ekranda (zorunlu şifre, aydınlatma onayı) yalnız çıkış yapabilirsin.

## Ne işe yarar

Bazı işler kimlik doğrulaması ister: girişteki kod, şifremi unuttum, önemli bir işten önce şifre. Kişi bu ekranlarda takılı
kalmamalı. Kullanıcı 30 Eylül'de istedi: "bazı işlemler auth istiyor ya, ondan vazgeçmek için sol üstte ok". Bugün her ekranın
altında bir dönüş bağlantısı var; tasarımda hepsinin yeri aynı olur: sol üst köşe.

## Nereden açılır

Ayrı bir sayfa değil; şu ekranların her birinde:

| Ekran | Bugün | Tasarımda (sol üstte) |
|---|---|---|
| İki adımlı giriş kodu ([İki adımlı giriş](iki-adimli-giris.md)) | altta "← Geri dön" | "←" (Vazgeç, girişe dön) + altta "← Geri dön" |
| Şifremi unuttum ([Şifremi unuttum](sifremi-unuttum.md)) | altta "← Girişe dön" | "←" (Girişe dön) + altta "← Girişe dön" |
| Yeni şifreni belirle (sıfırlama bağlantısı) | altta "← Girişe dön" | aynı |
| E-posta onayını bekleme ([E-posta onayı](eposta-onayi.md)) | ekran yok (kartın üstünde yeşil kutu) | "E-postanı onayla" ekranında altta "← Girişe dön" |
| Kendi şifreni belirle ([İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md)) | pencerede "Çıkış yap" | **"← Çıkış yap"** |
| Aydınlatma metni onayı ([Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)) | pencerede "Çıkış yap" | **"← Çıkış yap"** |
| Oturumunu seç ([Portal seçme ekranı](../portallar/portal-secme-ekrani.md)) | ekran yok (hesabın ana sayfasında kartlar) | **"← Ana siteye dön"** |
| Kimliğini doğrula (önemli işten önce) ([Çift doğrulama](../egitim-yili/cift-dogrulama.md)) | ekran yok | **"← Vazgeç"** |

## Adım adım

### Herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, yönetici; tasarımda destek ve eğitmen)

Bugün:

1. Kod ekranında **"← Geri dön"**e bas: giriş kartına dönersin, şifre kutusu boşalır, kodun geri sayımı durur.
2. Şifremi unuttum ya da "Yeni şifreni belirle" ekranında **"← Girişe dön"**: giriş kartına dönersin; sıfırlama anahtarı adres
   çubuğundan silinir.
3. "Kendi şifreni belirle" ya da aydınlatma onayı penceresinde **"Çıkış yap"**: oturum kapanır, giriş sayfasına dönersin
   ([Çıkış yap](cikis-yap.md)). Bu pencereler başka türlü kapanmaz (dışına tıklamak ve Esc işe yaramaz).

Tasarımda (kullanıcının 30 Eylül isteği; tanım ve Tasarım 1 önizlemesi):

1. Tam sayfa doğrulama ekranlarının en üstünde bir çubuk; sol başta simgeli düğme:
   - **"← Vazgeç"** — vazgeçilebilen ekranda: iki adımlı giriş kodu ve şifremi unuttum / e-posta onayı beklemesi giriş sayfasına
     döner; önemli işteki yeniden doğrulama işi iptal edip geldiğin sayfaya döner ve kısa bildirim "Vazgeçildi; hiçbir şey
     değişmedi." verir.
   - **"← Çıkış yap"** (kırmızımsı) — atlanamayan ekranda: zorunlu şifre değiştirme ve aydınlatma yeniden onayı. Geçilmez ama
     çıkılabilir.
   - **"← Ana siteye dön"** — oturum seçme ekranında: oturum kapanmaz, açılış sayfasına gidersin; oradan sağ üstteki "Hesaba gir"
     ile geri dönersin ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).
2. Ortada "Eğitim Evi" logosu, başlık ve açıklama; altında ekranın formu.
3. Vazgeçilebilen ekranda **Esc** tuşu da "Vazgeç" gibi çalışır; atlanamayan ekranda Esc bir şey yapmaz.
4. Tarayıcının (ya da uygulamanın) **geri tuşu** önce açık ekranı kapatır (yalnız vazgeçilebilen ekranı), sonra önceki sayfaya
   gider ([Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md)).
5. Giriş kartının içindeki kod ve şifremi unuttum ekranlarında da kartın sol üst köşesinde yuvarlak geri oku var; altta
   "← Geri dön" / "← Girişe dön" bağlantısı da kalır.

"Kimliğini doğrula" ekranı (Tasarım 1): "<İş> için önce şifreni yaz." (doğrulama uygulaması kuruluysa "…şifreni ve doğrulama
uygulamandaki kodu yaz."), **"Şifre:"**, gerekirse **"Doğrulama kodu:"**, **"Doğrula ve devam et"**; hatalar "Şifreni yaz.",
"Uygulamadaki 6 haneli kodu yaz.". Önizlemedeki işler: "Doğrulama uygulamasını kurmak", "Diğer cihazlardaki oturumları
kapatmak", "Okuldan ayrılmak", "Verilerini indirmek" / "Çocuğunun verilerini indirmek", "Yeni kurtarma kodları üretmek",
"Doğrulama uygulamasını kaldırmak".

### Tahta

Tahtada iki adımlı giriş, zorunlu şifre ve aydınlatma onayı olmadığı için bu ekranlar çıkmaz.

## Kurallar ve sınırlar

- **Vazgeçmek hiçbir şeyi değiştirmez**: kod ekranından dönünce o giriş denemesi biter (yeni girişte yeni kod gider); şifremi
  unuttum'dan dönünce bağlantı istenmemiş olur; önemli işten vazgeçince iş yapılmaz.
- **Atlanamayan ekran gerçekten atlanamaz**: sunucu da bu durumdaki kişinin öbür isteklerini reddeder (aydınlatma onayı eski ya da
  şifresi değişmeli kişi); tek kaçış çıkıştır.
- **Telefon önceliği** (kullanıcı 30 Eylül: "çıkış yap önemli ve mobil için önemli, öğretmenler çoğunlukla onu kullanacak"):
  düğmeler en az 44 piksel dokunma alanıyla; her değişiklik önce 375 piksel telefon boyunda denenir.
- **"Ana siteye dön" ile "Çıkış yap" ayrı simgelerdir**: ana siteye dön kapıdan **sola** çıkan ok, çıkış yap kapıdan **sağa**
  çıkan ok; karışmasın diye "Çıkış yap" kırmızımsı yazılır. Sağdan sola dillerde simgeler aynalanır.
- **Bilinen açık** (bugün): kod ekranında "Kodu tekrar gönder" hata alınca ekran kendiliğinden kapanmaz; "← Geri dön"e basmak
  gerekir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [İki adımlı giriş](iki-adimli-giris.md), [Şifremi unuttum](sifremi-unuttum.md), [E-posta onayı](eposta-onayi.md) — vazgeçilebilen
  ekranlar.
- [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md) — atlanamayan ekran.
- [Doğrulama uygulaması](dogrulama-uygulamasi.md) — "Kimliğini doğrula"daki kod.
- [Çıkış yap](cikis-yap.md).

**İlgili:**

- [Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md) — atlanamayan öbür ekran.
- [Portal seçme ekranı](../portallar/portal-secme-ekrani.md) — "Ana siteye dön".
- [Çift doğrulama](../egitim-yili/cift-dogrulama.md) — önemli işlerde yeniden doğrulama.
- [Geri, ileri ve ev](../menu-ve-arama/geri-ileri-ve-ev.md), [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md).
- [Geri tuşu](../uygulama/geri-tusu.md) — Android'de önce açık olanı kapat.

## Kod tarafı

- Ön yüz (bugün): [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `#kodVazgec` ("← Geri dön",
  `kodEkraniKapat`), `#sVazgec` ve `#yVazgec` ("← Girişe dön", `girisEkraninaDon`);
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) — pencerede "Çıkış yap",
  `data-zorunlu` perdesi; [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — `kvkkOnayIste` ("Çıkış yap" /
  "Onaylıyorum"); [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) — pencere (`modalAc`).
- Sunucu: [sunucu/api.md](../../sunucu/api.md) — aydınlatma ve şifre kapıları.
- Tasarım kodlanınca: üst çubuktaki "←" düğmesi bütün tam sayfa doğrulama ekranlarında tek bileşen olur.

## Sık sorulanlar

- **Kod ekranında takıldım, nasıl dönerim?** "← Geri dön"e bas; giriş kartına dönersin.
- **"Kendi şifreni belirle" penceresini kapatamıyorum.** Bilerek: şifreni koymadan devam edilmez. Şimdi istemiyorsan "Çıkış yap".
- **"Ana siteye dön" beni çıkarır mı?** Hayır (tasarım); oturumun açık kalır, açılış sayfasından "Hesaba gir" ile geri dönersin.

## Sırada

- Üst şerit sadeleştirme + gezinme + doğrulama ekranından vazgeçme (öneri sunuldu): sol üstte "←", "← Çıkış yap", geri tuşunun
  önce açık ekranı kapatması.
- Yıl geçişi: önemli işlerde çift doğrulama ekranı ("Kimliğini doğrula") ve vazgeçme.
- Çok dil: düğme yazıları çeviri kataloğuna; sağdan sola dillerde simgelerin aynalanması.
