# Giriş ve hesap · İlk girişte kendi şifreni belirleme

**Durum:** Kodda var; tasarımda ek olarak tam sayfa "Yeni şifreni belirle" ekranı (sol üstte "← Çıkış yap"), okulun verdiği her şifrede (yalnız T.C.'li olanlarda değil), yönetici ya da destekçinin değiştirdiği şifrede ve destek ekibinin ilk girişinde zorunlu olması.

Şifresini okul ya da sistem yöneticisi vermiş kişinin, devam etmeden önce yalnızca kendisinin bildiği bir şifre koyması: pencere kapatılamaz, ya şifreni koyarsın ya çıkış yaparsın.

## Ne işe yarar

Okulun verdiği şifre (çoğu zaman T.C. kimlik numarası ya da dağıtılan bir şifre) başkaları tarafından da bilinebilir. Bu yüzden
o şifreyle giren kişi önce kendi şifresini belirler; sunucu da bu durumdaki kişinin öbür bütün isteklerini reddeder. Kullanıcının
28 Eylül sözü ("admin de birinin hesap penceresinde şifre değiştir yapabilsin, ama girince direkt değiştirmek zorunlu olsun")
kuralı yönetici ve destekçinin verdiği şifrelere de genişletir.

## Nereden açılır

Kendiliğinden açılır: girişten sonra, aydınlatma onayından hemen sonra ([Giriş](giris.md),
[Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md)). Uygulama açıkken de açılabilir: okul yönetimi bu arada
şifreni T.C.'ye döndürdüyse bir sonraki istekte ekran boşalır, pencere gelir.

## Adım adım

### Ekranın düzeni (bugünkü site)

Arkada boş sayfa, ortada pencere:

1. Başlık **"Kendi şifreni belirle"**.
2. "Okulunun verdiği şifreyle girdin. Devam etmeden önce yalnızca senin bildiğin bir şifre belirle; bundan sonra girişte onu
   kullanacaksın." (Yetişkin hesabında cümle "Sistem yöneticisinin verdiği şifreyle girdin…" diye başlar.)
3. **"Şu anki şifren"**; altında "Okulun sana verdiği şifre (çoğu zaman T.C. kimlik numaran)." (yetişkinde "Sistem yöneticisinin
   sana verdiği şifre.").
4. **"Yeni şifren"** ve kural listesi (öğrenci ve servisçide "En az 8 karakter", "En az bir harf", "En az bir rakam"; öbürlerinde
   beş satır) ([Şifre kuralları](sifre-kurallari.md)); altında "T.C. kimlik numaranı ya da kullanıcı adını içermesin."
5. **"Yeni şifren (tekrar)"** (Enter'a basınca kaydeder).
6. Düğmeler: **"Çıkış yap"** (gri) ve **"Şifremi kaydet"**. "Kapat" yok; pencerenin dışına tıklamak ve Esc pencereyi kapatmaz.

### Öğrenci ve servisçi

1. Okulunun sayfasından okulun verdiği kullanıcı adı (çoğu zaman T.C.) ve şifreyle gir ([Okulun sayfasından giriş](okulun-sayfasindan-giris.md)).
2. Aydınlatma metnini henüz onaylamadıysan önce onu onayla ("Aydınlatma metni" penceresi).
3. "Kendi şifreni belirle" penceresi açılır. "Şu anki şifren"e okulun verdiği şifreyi yaz.
4. Yeni şifreni iki kez yaz. Kurallar: en az 8 karakter, harf ve rakam; okulun verdiğiyle aynı olamaz; T.C. numaranı ya da
   (4 harf ya da uzunsa) kullanıcı adını içeremez.
5. **"Şifremi kaydet"** (düğme "Kaydediliyor..." olur). Başarılıysa pencere kapanır, portalın açılır.
6. Şimdi yapmak istemiyorsan **"Çıkış yap"**; bir dahaki girişte pencere yine gelir.

Hatalar (kutuların altında): "Şu anki şifreni yaz.", kural iletileri, "Yeni şifre okulun verdiğiyle aynı olamaz.", "Şifren T.C.
kimlik numaranı ya da kullanıcı adını içermesin.", "İki şifre birbirini tutmuyor."; sunucudan "Mevcut şifre yanlış" ("Şu anki
şifren" kutusunda), "Yeni şifre: <kural>", "Yeni şifre eskisiyle aynı olamaz.", "Yeni şifre T.C. kimlik numaranı ya da kullanıcı
adını içermesin." ("Yeni şifren" kutusunda); başka hata pencerenin altında.

### Yönetici

Yönetici dosyasından açılan yönetici ilk girişte bu pencereyi görür; şifresini koyunca yönetim çerezini alır ve sayfa yönetim
adresine geçer ([Yönetici dosyası](../yonetim/yonetici-dosyasi.md)). Şifresini değiştirmemiş yönetici yönetim ekranlarına
giremez. (Varsayılan ilk yönetici bugün zorlanmaz: şifresi terminale bir kez yazılır, Ayarlar'dan değiştirmesi önerilir.)

### Veli, öğretmen ve müdür

Bugün kendi kaydolduğun yetişkin hesabında bu pencere çıkmaz: şifreni sen koydun, okul yetişkin hesabının şifresini
değiştiremez ("Öğretmen şifresini kendi hesabından değiştirir; unuttuysa "Şifremi unuttum" ile yeniler."). Yalnız eski düzende
okulun açtığı, yetişkin hesabına bağlı olmayan öğretmen ya da müdür hesabında okul şifreyi yenileyince çıkar.

### Tahta

Tasarlandı — henüz kodda yok. Tahtaya bu kural **uygulanmaz**: şifresini yalnız müdür koyar ve değiştirir; aydınlatma onayı da
sorulmaz ([Tahtanın sınırları](../tahta/tahtanin-sinirlari.md)).

Tasarımda:

1. Pencere yerine **tam sayfa ekran** (Tasarım 1 önizlemesi): sol üstte kırmızımsı **"← Çıkış yap"**
   ([Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md)), ortada "Eğitim Evi" logosu, başlık **"Yeni şifreni
   belirle"**, açıklama: "Okulun şifreni sıfırladı; geçici şifreyle girdin. Devam etmek için kendi şifreni belirlemelisin. Bu adım
   atlanamaz; istersen sol üstten çıkış yapabilirsin."
2. **"Yeni şifre:"** (göz düğmeli) ve altında güç yazısı: "En az 8 karakter; harf ve rakam olsun." → yazınca "Güçlü bir şifre" ya
   da "En az 8 karakter; harf ve rakam olsun (N karakter)."; **"Yeni şifre (tekrar):"**; **"Kaydet ve devam et"**.
3. Hatalar: "Şifre en az 8 karakter olmalı; harf ve rakam içermeli.", "Yeni şifreler birbirini tutmuyor."; başarıda "Yeni şifren
   kaydedildi." Sonra, birden çok portal varsa "Oturumunu seç" ekranı gelir.
4. Önizlemede "Şu anki şifren" kutusu yok. Kullanıcı bu konuda bir şey söylemedi; bugünkü kural (şu anki şifre sorulur) kalır.
5. **Kimde zorunlu** (tanımlar):
   - okulun verdiği **her** şifre: tek tek ya da toplu hesap açma, yetkilinin şifre sıfırlaması, öğrenci ve servisçi hesapları
     (bugün yalnız T.C.'li ya da "değiştirsin" işaretli olanlar); değiştirmeden yalnız şifre değiştirme, çıkış ve "ben kimim"
     isteği çalışır;
   - yönetici ya da destekçinin bir kişinin hesap penceresinden şifre değiştirmesi ya da geçici şifre üretmesi;
   - destek dosyasından açılan destek hesabı;
   - ilk yönetici (yönetici dosyasından ya da varsayılan): önce şifre, sonra doğrulama uygulaması
     ([Doğrulama uygulaması](dogrulama-uygulamasi.md)).
6. Pencerenin "kim verdi" cümlesi buna göre düzenlenir ("okulun", "sistem yöneticisinin", "destek ekibinin").

## Kurallar ve sınırlar

- **Kime çıkar bugün**: hesabında "şifre değişmeli" işareti olan kişiye. Bu işareti koyanlar:
  - okulun T.C. ile açtığı hesap (şifre boş bırakıldıysa şifre T.C. olur; okul şifre olarak T.C.'yi yazdıysa da);
  - okul şifreyi boş bırakarak T.C.'ye döndürdüğünde ya da yeni şifreyi "değiştirsin" işaretiyle verdiğinde;
  - toplu giriş bilgisi dağıtımında yenilenen şifreler ([Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md));
  - yönetici dosyasından açılan yönetici.
  Okul T.C. olmayan bir şifre yazıp "değiştirsin"i işaretlemezse kişi o şifreyle devam eder (tasarımda bu da zorunlu olacak).
- **Sıra**: önce aydınlatma onayı, sonra şifre; sunucu da şifre değiştirmeyi onayı eski kişiye vermez.
- **Sunucu kapısı**: işaretli kişinin öbür istekleri "Sana verilen şifreyle girdin. Devam etmeden önce kendi şifreni belirle."
  diye reddedilir; yalnız giriş, çıkış, "ben kimim", aydınlatma onayı ve şifre değiştirme serbesttir.
- **Deneme sınırı**: hesap başına 15 dakikada 10 ("Çok fazla deneme. Biraz bekle.").
- **Şifre kaydedilince**: işaret kalkar, bu oturum dışındaki bütün oturumlar (telefonun cihaz anahtarları dahil) kapanır.
- **Pencere bir kez açılır**: art arda reddedilen istekler ikinci pencere açmaz.
- **Bilinen açık** (kod değiştirilmedi): cümle "yetişkin hesabı mı" diye bakıyor; yönetici dosyasından açılan yönetici bu yüzden
  "Okulunun verdiği şifreyle girdin" ve "Okulun sana verdiği şifre (çoğu zaman T.C. kimlik numaran)" görür; "Sistem
  yöneticisinin verdiği" dalı yalnız eski düzenden kalan, şifresini yöneticinin vermiş olduğu yetişkin hesabında çalışır (bugünkü
  akışların hiçbiri yetişkin hesabına bu işareti koymaz). "Yeni şifre okulun verdiğiyle aynı olamaz." iletisi de herkese "okul"
  der.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Giriş](giris.md) — pencereden önceki adımlar.
- [Şifre kuralları](sifre-kurallari.md) — yeni şifrenin kuralı.
- [T.C. kimlik numarası](tc-kimlik-no.md), [Kullanıcı adı](kullanici-adi.md) — şifrenin içeremeyecekleri.
- [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md) — "← Çıkış yap".
- [Çıkış yap](cikis-yap.md).

**İlgili:**

- [Onay ve yeniden onay](../kvkk-ve-gizlilik/onay-ve-yeniden-onay.md) — önce gelen pencere.
- [Öğrenci hesabı açma](../hesaplar/ogrenci-hesabi-acma.md), [Şifre işlemleri](../hesaplar/sifre-islemleri.md),
  [Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md) — işareti koyan okul işleri.
- [Yönetici dosyası](../yonetim/yonetici-dosyasi.md), [Hesaba müdahale](../yonetim/hesaba-mudahale.md).
- [Destek ekibi](../destek/destek-ekibi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) — `girisSonrasi`,
  `sifreBelirleIste`, `EYLEMLER['zorunlu-sifre-kaydet']`, `yonetimeGec`; [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md)
  — `api()` 403 "şifre değişmeli" gelince pencereyi açar.
- Sunucu: [sunucu/api.md](../../sunucu/api.md) — şifre kapısı (`SIFRE_SERBEST`); [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)
  — `POST /api/password`; [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — okulun hesap açması ve şifre
  yenilemesi (işaret); [sunucu/yonetici-dosyasi.md](../../sunucu/yonetici-dosyasi.md).
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) ("T.C. ile varsayılan giriş ve zorunlu şifre değişimi"),
  [testler/test-giris-bilgisi.md](../../testler/test-giris-bilgisi.md), [testler/test-yonetici-dosyasi.md](../../testler/test-yonetici-dosyasi.md),
  [testler/test-aktarim.md](../../testler/test-aktarim.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hesap türleri ve portallar" → okulun açtığı hesap,
  "Yönetici dosyası").

## Sık sorulanlar

- **İlk girişte neden şifremi değiştirmem isteniyor?** Okulun verdiği şifreyle (ör. T.C. kimlik no'su ya da dağıtılan şifre)
  girdin. Bu şifreyi başkaları da bilebileceği için devam etmeden önce yalnızca senin bildiğin bir şifre belirlemen gerekir
  (sitenin SSS'si).
- **"Şu anki şifren" ne?** Okulun sana verdiği şifre; çoğu zaman T.C. kimlik numaran.
- **Pencereyi kapatamıyorum.** Bilerek: ya şifreni koy ya "Çıkış yap".
- **Yeni şifrem neden kabul edilmiyor?** T.C. numaranı ya da kullanıcı adını içeriyor olabilir, ya da okulun verdiğiyle aynı.

## Sırada

- Güvenlik denetimi: okulun verdiği her şifre ilk girişte değişecek.
- Kullanıcı arama ve hesap penceresi: yöneticinin ve desteğin şifre değiştirmesinde ilk girişte değiştirme zorunlu; pencerenin
  "kim verdi" cümlesi.
- Paneller (destek ekibi) ve Sistem (ilk yöneticide önce şifre, sonra doğrulama uygulaması).
- Üst şerit sadeleştirme: tam sayfa ekran, sol üstte "← Çıkış yap".
- Toplantılar ve tahta hesabı: tahtaya bu kuralın uygulanmaması.
