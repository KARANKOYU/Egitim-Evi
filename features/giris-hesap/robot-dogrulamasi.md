# Giriş ve hesap · Robot doğrulaması

**Durum:** Kodda var; tasarımda ek olarak girişte de her seferinde sorulması (bugün girişte yalnız hatalı denemeden sonra çıkar).

Kayıtta, şifremi unuttum'da ve gerekince girişte sorulan "7 + 4 = ?" gibi basit bir toplama sorusu; otomatik kayıt ve giriş denemelerini (botları) eler.

## Ne işe yarar

Kullanıcı 29 Ağustos'ta istedi: "her kayıt ve girişte captcha falan eklesen, oluyorsa bot doğrulaması önemli". Eğitim Evi dış
bir captcha servisi kullanmaz (giriş bilgileri Google'a ya da başka bir servise gitmez); sunucu kendi toplama sorusunu üretir,
cevabı tarayıcıya hiç göndermez. Soru insanı yormaz, basit araçları eler. Bir betik soruyu çözebilir; şifre taramasını asıl
durduran kilitler ve sayaçlardır ([Hatalı giriş ve kilit](hatali-giris-ve-kilit.md)).

## Nereden açılır

- [Kayıt olma](kayit-olma.md) formunun sonunda her zaman.
- [Şifremi unuttum](sifremi-unuttum.md) ekranında her zaman.
- [Giriş](giris.md) kartında: başta gizli; sunucu "soru gerekli" deyince şifre kutusunun altında açılır.
- Android uygulamasında aynı sorular (giriş, kayıt, şifremi unuttum ve çocuğun telefonunu bağlama)
  ([Telefonu bağlama](../aile/telefonu-baglama.md)).

## Adım adım

### Ekranın düzeni (bugünkü site)

- Etiket: **"Robot değilim doğrulaması"**.
- Satırda: soru ("7 + 4 = ?"; yüklenirken "yükleniyor...", alınamazsa "soru alınamadı"), cevap kutusu (yer tutucu "Cevap",
  yalnız sayı) ve yenile düğmesi (girişte ve şifremi unuttum'da **"Yenile"**, kayıtta **"↻"**; üzerine gelince "Yeni soru").
- Kayıtta altında: "Otomatik kayıt botlarını engellemek için soruyor."

### Ziyaretçi (kayıt ve şifremi unuttum)

1. Toplamanın sonucunu kutuya yaz.
2. Soruyu beğenmediysen yenile düğmesine bas; yeni soru gelir, kutu boşalır.
3. Boş bırakıp gönderirsen kutunun altında: "Sorunun cevabını yaz."
4. Yanlışsa sunucu: "Doğrulama sorusunun cevabı yanlış." Kayıtta yeni soru gelir; şifremi unuttum'da her hatada (hangi kutu hatalı
   olursa olsun) yeni soru gelir.
5. Kayıtta başka bir kutu hatalıysa (ör. kullanıcı adı alınmış) aynı soru geçerli kalır, yeniden çözmezsin.

### Öğrenci, veli, öğretmen, çalışan, müdür, servisçi ve yönetici (giriş)

1. Normal girişte soru görünmez.
2. Bir kez yanlış şifre girersen (ya da olmayan bir hesabı denersen) soru açılır ve taze bir soru gelir; bundan sonraki girişte
   cevaplaman gerekir.
3. Soru açıkken boş bırakırsan "Sorunun cevabını yaz."; yanlışsa "Doğrulama sorusunun cevabı yanlış."
4. Soruyu hiç görmeden (başkalarının hatalı denemeleri yüzünden) soru istenirse: "Devam etmek için doğrulama sorusunu
   cevapla." ve soru alanı açılır.
5. Doğru girişten sonra soru alanı yeniden gizlenir.

Tasarımda (Tasarım 1 önizlemesi):

- Soru **girişte de her zaman görünür ve zorunludur** (kullanıcının "her kayıt ve girişte" isteği); düğme her üç yerde
  **"Yenile"**.
- Boşsa "Doğrulama sorusunu cevapla.", yanlışsa "Cevap yanlış; yeni soruyu cevapla." ve hemen yeni soru gelir. Girişte şifre
  yanlış ya da hesap yoksa da soru yenilenir.
- Önizlemenin SSS'sindeki cevap: "Robot değilim doğrulaması: otomatik giriş ve kayıt denemelerini (botları) engellemek için her
  girişte, kayıtta ve şifre yenilemede basit bir toplama sorusu sorulur. Cevap yanlışsa yeni bir soru gelir; Yenile ile de
  soruyu değiştirebilirsin."

### Tahta

Tasarlandı — henüz kodda yok. Tahta da okulun sayfasındaki normal giriş kartını kullanır; robot sorusu kuralı aynıdır
([Tahta girişi](../tahta/tahta-girisi.md)).

## Kurallar ve sınırlar

- **Soru**: "a + b = ?"; a 3 ile 9, b 2 ile 9 arasında rastgele (sonuç 5–18). Soru kimliği 24 haneli rastgele bir değerdir;
  cevap yalnız sunucuda tutulur.
- **Ömür**: soru 5 dakika geçerlidir; süresi geçen soruya verilen cevap yanlış sayılır.
- **Tek kullanım**: doğru cevaplanan soru harcanır, ikinci kez kullanılamaz. Kayıtta soru yalnız başvuru geçince (onay postası
  gönderilince) harcanır; T.C. çakışmasında da harcanır ki "bu numara kayıtlı mı" diye aynı soruyla deneme yapılamasın.
- **Girişte ne zaman istenir** (bugün):
  - bu hesaba bu bağlantıdan (IP) en az bir hatalı deneme olduysa;
  - hesaba her yerden 15 dakikada 3 hatalı deneme olduysa;
  - bu bağlantıdan 15 dakikada 50 hatalı deneme olduysa (o bağlantıdan giren herkese).
  Sunucu "hesap yok" ve "şifre yanlış" cevaplarında her zaman "soru gerekli" der; tarayıcı alanı açar.
- **Sınır**: aynı bağlantı 10 dakikada en çok 1500 soru alır ("Çok fazla istek. Biraz bekle."); okul ağında bütün okul tek IP'den
  gelir, bu yüzden bol tutuldu. Bellekte en çok 5000 soru durur; dolunca önce süresi geçenler, yetmezse en eskiler silinir.
- **Sunucu yeniden başlarsa** bekleyen sorular geçersiz olur; yeni soru alınır.
- Şifremi unuttum'da soru yanlışsa ileti soru kutusunun altına düşer (iletide "doğrulama" sözcüğü geçtiği için).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Kayıt olma](kayit-olma.md), [Şifremi unuttum](sifremi-unuttum.md), [Giriş](giris.md) — sorunun çıktığı yerler.
- [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md) — soruyu açan hata sayaçları.
- [T.C. kimlik numarası](tc-kimlik-no.md) — çakışmada sorunun harcanması.

**İlgili:**

- [Telefonu bağlama](../aile/telefonu-baglama.md) — çocuğun telefonunda aynı soru ("Başka soru").
- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamanın doğrulama sorusu.

## Kod tarafı

- Sunucu: [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `botSoruUret`, `botCevapDogru`, `botSoruTuket`, `BOT_OMRU_MS`,
  `girisSoruLazim`; [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `GET /api/challenge`, kayıtta, girişte
  (`soruGerekli`) ve şifremi unuttum'da denetim.
- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `botSoruYukle`, `girisSoruYukle`,
  `girisSoruGoster`, `sifreSoruYukle`. HTML `public/index.html` (`.bot-alan`, `#kBot`, `#gBot`, `#sBot`).
- Testler: [testler/guvenlik-test.md](../../testler/guvenlik-test.md) (cevap istemciye sızmıyor, soru ikinci kez kullanılamıyor,
  hatadan sonra soru), [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (soru yalnız hesap açılınca harcanır),
  [testler/test-okul-agi.md](../../testler/test-okul-agi.md) (okul ağında soru sınırı).

## Sık sorulanlar

- **Girişte ve kayıtta neden bir toplama sorusu var?** Otomatik giriş ve kayıt denemelerini (botları) engellemek için. Cevap
  yanlışsa yeni soru gelir; "Yenile" ile soruyu değiştirebilirsin.
- **Normal girişte soru çıkmıyor, neden?** Bugün girişte soru yalnız hatalı bir denemeden sonra istenir; tasarımda her girişte
  sorulacak.
- **"soru alınamadı" yazıyor.** Bağlantın kesilmiş ya da sunucu çok yoğun olabilir; "Yenile"ye bas.

## Sırada

- Girişte sorunun her zaman gösterilmesi (Tasarım 1; kullanıcının "her kayıt ve girişte" isteği). Okul ağında 300 öğrencinin
  aynı dakikada girişinde soru sınırının yeniden ölçülmesi gerekir.
- Güvenlik denetimi: IPv6 adreslerinin /64 ağı olarak sayılması (soru sınırı dahil).
- Çok dil: etiketler ve iletiler çeviri kataloğuna.
