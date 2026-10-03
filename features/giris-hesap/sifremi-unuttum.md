# Giriş ve hesap · Şifremi unuttum

**Durum:** Kodda var; tasarımda ek olarak gönderimden sonra "E-postana bak" ekranı ("Başka bir e-posta yaz") ve sol üstte geri oku.

E-posta adresini yazınca o adrese kayıtlı bir hesap varsa 1 saat geçerli sıfırlama bağlantısı gider; bağlantıyla yeni şifreni belirlersin. E-postası olmayan öğrenci ve servisçinin şifresini okul yönetimi yeniler.

## Ne işe yarar

Şifreni unuttuğunda kimseye sormadan yeni şifre koyarsın. Kullanıcının sözleri: 29 Ağustos "giriş yap'ın altında şifremi
unuttum", 25 Eylül "şifremi unuttum'a basınca e-posta yazacak, o e-postaya bir hesap varsa gidecek". Cevap her durumda aynıdır
("bu adres kayıtlıysa … gönderildi"): böylece bu ekran "şu adres kayıtlı mı" diye sormaya yaramaz.

## Nereden açılır

- Giriş kartının altındaki **"Şifremi unuttum"** ([Giriş](giris.md)).
- Şifre yanlış iletisinin yanındaki **"Şifremi unuttum"** kısa yolu.
- Kilit iletisi de bu yolu söyler: "… ya da "Şifremi unuttum" ile yeni şifre al." (bugün yeni şifre aynı bağlantının 5 hatalık
  kilidini kaldırmaz; ayrıntı [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md)).
- E-postadaki sıfırlama bağlantısı: `egitimevi.org/#/yeni-sifre?t=<64 haneli anahtar>` (anahtar adresin `#` kısmındadır, sunucu
  günlüklerine düşmez).
- Android uygulamasında giriş ekranındaki "Şifremi unuttum".

## Adım adım

### Veli, öğretmen, çalışan, müdür, eğitmen, yönetici (ve e-postası olan öğrenci ya da servisçi)

1. Giriş kartında **"Şifremi unuttum"**a bas. Kart değişir: anahtar simgesi, **"Şifreni mi unuttun?"** ve "Hesabının e-posta
   adresini yaz. O adrese kayıtlı bir hesap varsa sıfırlama bağlantısı gönderilir. E-postası olmayan hesaplarda şifreyi okul
   yönetimi yeniler." Üstteki "Giriş Yap / Hesap Aç" sekmeleri gizlenir.
2. **"E-posta"** kutusu (yer tutucu "e-posta adresin"); girişte e-posta yazdıysan kendiliğinden taşınır.
3. Robot sorusunu cevapla ([Robot doğrulaması](robot-dogrulamasi.md)).
4. **"Sıfırlama bağlantısı gönder"**e bas (düğme "Gönderiliyor..." olur).
5. Giriş kartına dönülür, üstte yeşil: "Bu adres kayıtlıysa şifre sıfırlama bağlantısı gönderildi. Gelen kutunu ve gereksiz
   posta klasörünü kontrol et."
6. Posta: konu "Eğitim Evi şifre sıfırlama"; "Merhaba <Ad Soyad>," / "Eğitim Evi hesabının şifresini sıfırlamak için aşağıdaki
   bağlantıya tıkla:" / bağlantı / "Bu bağlantı 1 saat geçerlidir ve yalnızca bir kez kullanılabilir." / "Şifre sıfırlama
   isteğini sen yapmadıysan bu postayı yok sayabilirsin;" / "şifren değişmeden kalır." / "Eğitim Evi".
7. Bağlantıya tıkla. Site açılır; bu tarayıcıda hatırlanan bir oturum varsa silinir. **"Yeni şifreni belirle"** ekranı: "En az
   8 karakter, harf ve rakam içermeli.", **"Yeni şifre"**, **"Yeni şifre (tekrar)"**, **"Şifreyi güncelle"** (beklerken
   "Kaydediliyor...") ve altta **"← Girişe dön"**.
8. Başarılıysa giriş kartına dönülür, adres çubuğundaki anahtar silinir, üstte yeşil: "Şifren güncellendi. Yeni şifrenle giriş
   yapabilirsin." Yeni şifrenle gir.

Vazgeçmek için iki ekranda da **"← Girişe dön"**.

İlk ekranın hataları (kutunun altında): boşsa "Hesabının e-posta adresini yaz."; `@` yoksa "Buraya kullanıcı adı değil e-posta
adresi yazılır. E-postası olmayan hesaplarda şifreyi okul yönetimi yeniler."; bozuksa "E-posta adresi eksik ya da hatalı
görünüyor."; soru boşsa "Sorunun cevabını yaz."; soru yanlışsa "Doğrulama sorusunun cevabı yanlış." (soru kutusunun altında).
Sunucu da kullanıcı adı yazılınca söyler: "Sıfırlama bağlantısı e-postaya gider; hesabının e-posta adresini yaz. E-postası
olmayan hesaplarda şifreyi okul yönetimi yeniler." Her hatada yeni soru gelir.

İkinci ekranın hataları: tarayıcı "Bir şifre belirle.", "Şifre en az 8 karakter olmalı.", "Şifre en az bir harf ve bir rakam
içermeli.", "İki şifre birbirini tutmuyor." (kutuların altında); sunucu "Bağlantı geçersiz ya da süresi dolmuş. Yeniden bağlantı
iste.", hesabın şifre kuralı (yetişkinde "Şifrede bir büyük harf, … olmalı"), "Hesap bulunamadı." (kartın üstünde). Bağlantı
harcanmadığı için düzeltip yeniden denersin.

### Öğrenci ve servisçi (e-postası yoksa)

Bu ekranı kullanamazsın; şifreni okul yönetimi yeniler (yeni şifre yazarak ya da T.C. numarana döndürerek). Yenileyince
hesabın her yerden sayılan hata kilidi (20 hata) kalkar. Okul şifreni T.C. numarana döndürdüyse ya da yeni şifreyi "değiştirsin"
işaretiyle verdiyse ilk girişte kendi şifreni belirlersin; işaretsiz verilen şifreyle doğrudan devam edersin
([Şifre işlemleri](../hesaplar/sifre-islemleri.md), [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md)).

Okul hesabına e-posta yazılmışsa sen de "Şifremi unuttum"u kullanırsın; sıfırlama okulun işlem kaydına "Şifre sıfırlandı
(kullanıcı)" diye düşer.

### Tahta

Tasarlandı — henüz kodda yok. Tahtanın e-postası yoktur; şifresini yalnız müdür değiştirir ([Tahta hesabı açma](../tahta/tahta-hesabi-acma.md)).

Tasarımda (Tasarım 1 önizlemesi):

1. Ekran kartın ikinci yüzü olarak kayar; sol üstte geri oku ("Girişe dön") ([Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md)).
2. Açıklama: "Hesabının e-posta adresini yaz. O adrese kayıtlı bir hesap varsa şifre yenileme bağlantısı gönderilir. E-postası
   olmayan öğrenci ve servisçi hesabında şifreyi okul yönetimi yeniler."
3. Hatalar: "E-posta adresini yaz.", "Geçerli bir e-posta adresi yaz (ör. ad@eposta.com).", robot için "Doğrulama sorusunu
   cevapla." / "Cevap yanlış; yeni soruyu cevapla."
4. Gönderince giriş kartına dönülmez; **"E-postana bak"** ekranı: "<adres> adresine kayıtlı bir hesap varsa şifre yenileme
   bağlantısını gönderdik. Birkaç dakika içinde gelmezse istenmeyen (spam) klasörüne bak." Altında **"Girişe dön"** ve
   **"Başka bir e-posta yaz"**.
5. Sıfırlama bağlantısıyla açılan "Yeni şifreni belirle" ekranı önizlemede ayrıca çizilmedi; bugünkü ekran kalır.

## Kurallar ve sınırlar

- **Yalnız e-postayla**: kullanıcı adı ya da T.C. ile sıfırlama yok.
- **Her durumda aynı cevap**: adres kayıtlı değilse, biçimi bozuksa, saatte 3'ten fazla istendiyse de "Bu adres kayıtlıysa şifre
  sıfırlama bağlantısı gönderildi…" denir. Bağlantı yalnız onaylı hesaba gider.
- **Sınırlar**: aynı bağlantıdan (IP) 15 dakikada 20 istek ("Çok fazla istek. 15 dakika sonra tekrar dene."); aynı adrese saatte
  3 posta; yeni şifre ekranında aynı bağlantıdan 15 dakikada 30 deneme ("Çok fazla deneme. Biraz bekle.").
- **Bağlantı**: 1 saat geçerli, tek kullanımlık; yeni bağlantı istenince eskisi geçersiz olur. Anahtar yalnız sunucunun
  belleğinde durur: sunucu yeniden başlarsa bekleyen bağlantılar geçersiz olur (bilerek).
- **Yeni şifre hesabın kuralına uymalı** (yetişkinde güçlü kural) ([Şifre kuralları](sifre-kurallari.md)).
- **Şifre değişince**: bu tarayıcıdaki dahil hesabın **bütün** oturumları ve telefon uygulamasının cihaz anahtarları kapanır;
  hesabın her yerden sayılan hata kilidi (20 hata) kalkar ve bu bağlantı "tanıdık" olur (hesabı başkaları kilitlediyse sahibi
  hemen girer); "kendi şifreni belirle" zorunluluğu varsa kalkar. Aynı bağlantıdan 5 yanlışla gelen 15 dakikalık kilit ise bugün
  kalkmaz ([Hatalı giriş ve kilit](hatali-giris-ve-kilit.md)).
- **İşlem kaydı**: "Şifre sıfırlandı (kullanıcı)", ayrıntısında "N oturum kapatıldı". Öğrenci ve servisçide okulun işlem
  kaydına düşer; yetişkin hesabında kayıt okulsuz yazılır, okul yönetimi görmez, yalnız sistem yöneticisi görür
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Sunucu günlüğü**: sıfırlamada sunucu penceresine "Şifre sıfırlandı: <e-posta> (N oturum kapatıldı)" yazılır.
- **E-posta ayarlı değilse** bağlantı sunucu penceresine yazılır (deneme ortamı).
- **Bilinen açık** (kod değiştirilmedi): "Yeni şifreni belirle" ekranı tarayıcıda sade kuralla bakar ve "En az 8 karakter, harf ve
  rakam içermeli." yazar; yetişkin hesabında sunucu güçlü kuralı ister, ileti kutunun altında değil kartın üstünde çıkar.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Giriş](giris.md) — "Şifremi unuttum" düğmesi.
- [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md) — kilidi hemen kaldırmak.
- [Şifre kuralları](sifre-kurallari.md) — yeni şifrenin kuralı.
- [Robot doğrulaması](robot-dogrulamasi.md) — ekrandaki soru.
- [E-posta onayı](eposta-onayi.md) — e-postaya giden öbür bağlantı.
- [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md) — "← Girişe dön".

**İlgili:**

- [Şifre işlemleri](../hesaplar/sifre-islemleri.md) — e-postası olmayan hesabın şifresini okulun yenilemesi.
- [Şifre değiştirme](../ayarlar/sifre-degistirme.md) — şifreni bildiğin hâlde değiştirmek.
- [Hesaba müdahale](../yonetim/hesaba-mudahale.md) — yönetici ya da destekçinin sıfırlama bağlantısı göndermesi (tasarım).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/sifre-unuttum`, `POST /api/sifre-yenile`;
  [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `sifirlamaGonder`, `sifirlamaKayit`, `SIFIRLAMA_OMRU_MS`, `girisBasarili`,
  `girisTanidik`; [sunucu/veri/depo/oturumlar.md](../../sunucu/veri/depo/oturumlar.md) — `hesabinOturumlariniKapat`.
- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `sifreEkraniAc`, `#formSifreUnuttum`,
  `yeniSifreEkraniAc`, `#formYeniSifre`, `girisEkraninaDon`; [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md)
  — `#/yeni-sifre?t=` anahtarını okuyup ekranı açma. HTML `public/index.html` (`#sifreEkran`, `#yeniSifreEkran`).
- Testler: [testler/test-sifre.md](../../testler/test-sifre.md) (uçtan uca; anahtar günlükten okunur),
  [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (kullanıcı adı → `alan: email`),
  [testler/test-okul-agi.md](../../testler/test-okul-agi.md) (yeni şifrenin kilidi kaldırması).
- Kullanıcıya dönük anlatım: sitenin SSS'si ("Şifremi unuttum, ne yapmalıyım?").
- Android: uygulamanın "Şifremi unuttum" ekranı ([Android uygulaması](../uygulama/android-uygulamasi.md)).

## Sık sorulanlar

- **Şifremi unuttum, ne yapmalıyım?** Hesabında e-posta adresi varsa (veli, öğretmen ve müdür hesabında hep vardır) giriş
  sayfasındaki Şifremi unuttum ile e-posta adresine yenileme bağlantısı gelir. E-postası olmayan öğrenci ve servisçi hesabının
  şifresini okul yönetimi yeniler (sitenin SSS'si).
- **Bağlantı gelmedi.** Gereksiz (spam) klasörüne bak. Aynı adrese saatte en çok 3 posta gider; biraz bekleyip yeniden iste.
- **Bağlantı "geçersiz" diyor.** 1 saat geçmiş, bağlantı kullanılmış ya da sonra yeni bir bağlantı istemişsin; en son geleni kullan
  ya da yeniden iste.
- **Şifremi sıfırladım, telefonumdaki uygulamadan çıkış oldu.** Doğru: şifre sıfırlanınca bütün cihazlardaki oturumlar kapanır;
  yeni şifreyle yeniden gir.

## Sırada

- Kullanıcı arama ve hesap penceresi: yönetici ve destekçinin bir kişiye sıfırlama bağlantısı göndermesi (önerilen yol) ya da
  geçici şifre üretmesi (ilk girişte değiştirme zorunlu).
- Üst şerit sadeleştirme: şifremi unuttum ekranında sol üstte "←".
- Çok dil: ekran ve posta metinleri çeviri kataloğuna.
