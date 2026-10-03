# Giriş ve hesap · Şifre kuralları

**Durum:** Kodda var; tasarımda ek olarak kayıtta "Şifre (tekrar)" kutusu ve şifre alanlarının "Eski şifre:", "Yeni şifre:", "Yeni şifre (tekrar):" adlarıyla yazılması.

Yetişkin hesaplarında güçlü (8 karakter, büyük harf, küçük harf, rakam, özel karakter), öğrenci ve servisçide sade (8 karakter, harf ve rakam) şifre kuralı; şifre yazılan her kutuda göz düğmesi ve Caps Lock uyarısı.

## Ne işe yarar

Şifre yazılan her yerde (kayıt, ilk girişte şifre belirleme, şifremi unuttum, Ayarlar, okulun hesap açması) aynı kural geçer;
kişi yazarken hangi kuralı karşıladığını yeşil tiklerle görür. Yetişkin hesabı (veli, öğretmen, müdür, çalışan) ve sistem
yöneticisi daha çok şey yönettiği için güçlü kurala bağlıdır; öğrencinin ve servisçinin şifresini çoğu zaman okul verir ve
ilk girişte değiştirilir, onlarda harf ve rakam yeter.

## Nereden açılır

Bu ayrı bir ekran değil; şifre kutusu olan her ekranda geçerli:

- [Kayıt olma](kayit-olma.md) — "Şifre" kutusu ve beş satırlık liste.
- [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md) — "Yeni şifren" ve liste.
- [Şifremi unuttum](sifremi-unuttum.md) — "Yeni şifreni belirle" ekranı.
- Ayarlar → Şifre değiştir ([Şifre değiştirme](../ayarlar/sifre-degistirme.md)).
- Okulun öğrenci ya da servisçi hesabı açması ve şifre yenilemesi ([Şifre işlemleri](../hesaplar/sifre-islemleri.md)).
- Girişteki "Şifre" kutusu (yalnız göz düğmesi ve Caps Lock uyarısı) ([Giriş](giris.md)).

## Adım adım

### Herkes: şifre yazarken

1. Şifre kutusunun sağındaki göz düğmesine basarsan şifre görünür ("Şifreyi göster"), bir daha basarsan gizlenir ("Şifreyi
   gizle"). Göz düğmesine basınca imleç kutudan çıkmaz (telefonda klavye kapanmaz). Form sıfırlanınca görünen şifre yeniden
   gizlenir.
2. Caps Lock açıksa kutunun altında uyarı: "Büyük harf kilidi (Caps Lock) açık." Kutudan çıkınca kaybolur.
3. Kural listesi olan ekranlarda yazdıkça karşılanan satır yeşil tik alır.

### Veli, öğretmen, çalışan, müdür, eğitmen ve yönetici (güçlü kural)

Liste beş satır: "En az 8 karakter", "Büyük harf", "Küçük harf", "Rakam", "Özel karakter (! ? . *)".

Eksikse tek cümlede söylenir: "Şifrede bir büyük harf, bir özel karakter (! ? . * gibi) olmalı." (eksik olanlar sırayla: bir büyük
harf, bir küçük harf, bir rakam, bir özel karakter). Kısa ise "Şifre en az 8 karakter olmalı.", boşsa "Bir şifre belirle.".

Yetişkin hesabına bağlı okul rolündeyken (öğretmen@okul, müdür@okul) şifre yetişkin hesabınındır; aynı güçlü kural geçer.
Tasarımdaki destek hesabı da güçlü kurala bağlıdır.

### Öğrenci ve servisçi (sade kural)

Liste üç satır: "En az 8 karakter", "En az bir harf", "En az bir rakam". Eksikse "Şifre en az bir harf ve bir rakam içermeli.".

Okulun açtığı hesapta okul şifreyi boş bırakırsa şifre T.C. kimlik numarası olur ve ilk girişte değiştirilir
([İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md)).

### Tahta

Tasarlandı — henüz kodda yok. Tahtanın şifresini müdür koyar ve değiştirir; sitenin şifre kuralına uymalıdır (çok kısa ya da
tahmin edilir şifre reddedilir) ([Tahta hesabı açma](../tahta/tahta-hesabi-acma.md)).

Tasarımda (Tasarım 1 önizlemesi):

- Kayıtta "Şifre"nin altında **"Şifre (tekrar)"** kutusu; yazarken "Şifreler aynı." ya da "Şifreler birbirini tutmuyor."; boşsa
  "Şifreni bir kez daha yaz.". Kural tutmazsa "Şifre kuralların hepsini sağlamalı (yeşil işaretler).".
- Ayarlar'daki şifre formunun alanları iki noktalı: "Eski şifre:", "Yeni şifre:", "Yeni şifre (tekrar):" (kullanıcının 1 Ekim
  isteği) ([Şifre değiştirme](../ayarlar/sifre-degistirme.md)).
- Her şifre kutusunda göz düğmesi.
- İlk girişteki şifre ekranında güç yazısı: "En az 8 karakter; harf ve rakam olsun." → yazınca "Güçlü bir şifre" ya da "En az
  8 karakter; harf ve rakam olsun (N karakter)."

## Kurallar ve sınırlar

- **Güçlü kural kime**: öğrenci ve servisçi dışında herkese (yetişkin hesabı, okul rolündeki yetişkin, sistem yöneticisi; hesap
  bilinmiyorsa da güçlü).
- **Ne sayılır**: Türkçe harfler (ç, ğ, ı, ö, ş, ü ve büyükleri) harf sayılır; "özel karakter" harf, rakam ve boşluk dışındaki
  her şeydir (! ? . * - _ @ # gibi).
- **Üst sınır**: 200 karakter; aşılırsa sunucu "Şifre çok uzun" der (tarayıcı bu sınıra bakmaz).
- **Sunucunun iletileri** tarayıcınınkiyle aynıdır ama noktasızdır: "Şifre en az 8 karakter olmalı", "Şifre en az bir harf ve
  bir rakam içermeli", "Şifrede bir büyük harf, … olmalı".
- **Şifre değiştirirken ek kurallar** (Ayarlar ve ilk girişte şifre belirleme):
  - yeni şifre eskisiyle aynı olamaz ("Yeni şifre eskisiyle aynı olamaz."; ilk giriş penceresinde "Yeni şifre okulun verdiğiyle
    aynı olamaz.");
  - T.C. kimlik numaranı ya da (4 karakter ya da daha uzunsa) kullanıcı adını içeremez, büyük/küçük harf fark etmez ("Yeni şifre
    T.C. kimlik numaranı ya da kullanıcı adını içermesin."; pencerede "Şifren T.C. kimlik numaranı ya da kullanıcı adını
    içermesin.");
  - iki kutu aynı olmalı ("İki şifre birbirini tutmuyor.");
  - mevcut şifre doğru olmalı ("Mevcut şifre yanlış");
  - hesap başına 15 dakikada en çok 10 deneme ("Çok fazla deneme. Biraz bekle.").
- **Şifre değişince** bu oturum dışındaki bütün oturumların (telefon uygulamasının cihaz anahtarları dahil) kapanır.
- **Saklama**: hiçbir şifre düz metin saklanmaz; scrypt ile tuzlanmış özeti tutulur. Şifre işlem kaydına, yönetim paneline ya
  da günlüğe yazılmaz.
- **Bilinen açık** (kod değiştirilmedi): şifremi unuttum'un "Yeni şifreni belirle" ekranı tarayıcıda sade kuralla bakar ve
  ekranda "En az 8 karakter, harf ve rakam içermeli." yazar; sunucu ise hesabın kuralını (yetişkinde güçlü) uygular. Bu yüzden
  yalnız küçük harf ve rakamdan oluşan bir şifre yazan veli tarayıcıdan geçer, sunucudan "Şifrede bir büyük harf, bir özel karakter (! ? . * gibi) olmalı"
  alır; ileti kutunun altında değil kartın üstünde görünür ([Şifremi unuttum](sifremi-unuttum.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Kayıt olma](kayit-olma.md), [İlk girişte kendi şifreni belirleme](zorunlu-sifre-belirleme.md),
  [Şifremi unuttum](sifremi-unuttum.md) — şifre yazılan ekranlar.
- [Kullanıcı adı](kullanici-adi.md), [T.C. kimlik numarası](tc-kimlik-no.md) — şifrenin içeremeyecekleri.
- [Hatalı giriş ve kilit](hatali-giris-ve-kilit.md) — yanlış şifrenin sonuçları.

**İlgili:**

- [Şifre değiştirme](../ayarlar/sifre-degistirme.md) — Ayarlar'daki form.
- [Şifre işlemleri](../hesaplar/sifre-islemleri.md), [Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md) — okulun
  verdiği şifreler.
- [Yönetici dosyası](../yonetim/yonetici-dosyasi.md) — dosyadaki şifre de yetişkin kuralına uymalı.

## Kod tarafı

- Ön yüz: [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `sifreKurallari`, `sifreSorunuTR`,
  `gucluSifreli`, `sifreKuralListesi`, `sifreKurallariniIsaretle`; [public/js/parcalar/04a-form-alanlari.md](../../public/js/parcalar/04a-form-alanlari.md)
  — göz düğmesi (`sifreGozuEkle`, `sifreGoster`), Caps Lock uyarısı (`capsUyarisi`);
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) — ilk giriş penceresindeki ek kurallar.
- Sunucu: [sunucu/ortak.md](../../sunucu/ortak.md) — `sifreSorunu`, `gucluSifreli`; [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)
  — `POST /api/password`, `POST /api/sifre-yenile`; [sunucu/sifre.md](../../sunucu/sifre.md) — scrypt özeti.
- Testler: [testler/guvenlik-test.md](../../testler/guvenlik-test.md) (kısa ve rakamsız şifrenin reddi),
  [testler/test-yonetim.md](../../testler/test-yonetim.md) (T.C.'yi içeren ve eskisiyle aynı şifre),
  [testler/test-sifre.md](../../testler/test-sifre.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kayıt kuralları" → Şifre).

## Sık sorulanlar

- **Şifre kuralları neler?** Yetişkin hesabında şifre en az 8 karakterdir ve büyük harf, küçük harf, rakam ve özel karakter
  (! ? . * gibi) içerir. Öğrenci ve servisçi hesabında en az 8 karakter, en az bir harf ve bir rakam yeter (sitenin SSS'si).
- **Şifremde Türkçe harf olabilir mi?** Evet; Türkçe harfler harf sayılır.
- **Boşluk olur mu?** Olur ama özel karakter sayılmaz.
- **Şifrem doğru ama "yanlış" diyor.** Caps Lock açık olabilir; kutunun altındaki uyarıya bak ya da göz düğmesiyle yazdığını gör.

## Sırada

- Güvenlik denetimi: okulun verdiği her şifre ilk girişte değişecek (yalnız T.C. ile açılanlar değil).
- Toplantılar ve tahta hesabı: tahta şifresini müdür koyar, sitenin şifre kuralına uyar.
- Çok dil: kural satırları ve iletiler çeviri kataloğuna.
