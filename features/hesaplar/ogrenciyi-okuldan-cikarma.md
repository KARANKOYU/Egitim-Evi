# Öğrenci hesapları · Öğrenciyi okuldan çıkarma

**Durum:** Tasarlandı — henüz kodda yok

Okuldan ayrılan ya da mezun olan öğrenciyi okulun listesinden çıkarmak: hesap silinmez, öğrencinin bu okuldaki oturumu "geçmiş"
(salt okunur) olur.

## Ne işe yarar

Öğrenci hesabı okula değil kişiye aittir; okul onu silemez (kullanıcı 26 Eylül: "Kişiye ait, eski notlar gizli"). Ama okuldan ayrılan
bir öğrenci okulun listelerinde, sayılarında, mesaj ve duyuru alıcılarında kalmamalıdır. Kullanıcının 28 Eylül kararına göre öğrenci
hesabı da "tek hesap, birden çok oturum" olunca nakil taşıma olmaktan çıkar: yeni kurum oturum ekler, **eski okul öğrenciyi okuldan
çıkarınca o oturum "geçmiş" olur**. Mezunlar için de aynısı geçerlidir (29 Eylül kararı: müdür mezunu "okuldan çıkar" diyebilir,
kart hemen "geçmiş" olur).

### Bugün ne var (kodda)

- Öğrencinin **Hesap** penceresinde "Hesabı sil" bölümü **yoktur** (servisçide vardır). Sunucu öğrenci hesabını silme isteğini
  reddeder: **"Bu işlem için yetkin yok"**.
- Okuldan ayrılan öğrenci **sınıfsız bırakılır** (Hesap penceresinde "Sınıf" → **"— sınıfsız —"** → "Bilgileri kaydet";
  [Hesap penceresi](hesap-penceresi.md)). Öğrenci okulun listesinde durmaya, okulun adresinden girebilmeye devam eder.
- Başka bir okul onu T.C. ve doğum tarihiyle alırsa hesap o okula taşınır ve bu okulun listesinden kendiliğinden çıkar
  ([Öğrenci nakli](ogrenci-nakli.md)).

## Nereden açılır

Tasarımda: müdürün öğrenci listesinde ve **"Mezunlar"** bölümünde öğrenci için **"okuldan çıkar"**
([Öğrenciler listesi](ogrenci-listesi.md), [Mezunlar](../egitim-yili/mezunlar.md)); yönetici tarafında kullanıcı sayfasında da
öğrenci için "hesabı sil" yerine "okuldan çıkar" önerilir ([Hesaba müdahale](../yonetim/hesaba-mudahale.md)). Düğmenin tam yeri,
adı ve onay metni tanımlarda yazılı değil; Tasarım 1 önizlemesinde de yok.

## Adım adım

### Müdür

Tasarımda:

1. Öğrenciyi listede (ya da yıl geçişinden sonra "Mezunlar" altında) bul, "okuldan çıkar" de.
2. Öğrencinin bu okuldaki oturumu hemen **"geçmiş"** olur; öğrenci okulun listelerinden, etüt ve servis listelerinden ve ders
   programından çıkar; okulun öğrenci sayısında ve istatistiklerinde sayılmaz.
3. Okulundaki kayıtları (ödev, not, sınav, devamsızlık, etüt yoklaması, quiz sonuçları) **silinmez**: okulun kaydıdır, okul
   yedeğinde de durur.
4. Başka kurumların (ör. dershane) bundan haberi olmaz; kurumlar birbirini görmez.

### Öğrenci

Tasarımda:

1. Ana ekranındaki **"Öğrenci · Test Ortaokulu"** kartı "geçmiş" olur (mezunsa **"Mezun · Test Ortaokulu"**, rozet "Mezun").
2. İçinde eski ödevlerin, notların, sınavların, devamsızlığın, etüt yoklaman ve quiz sonuçların **salt okunur** durur; yeni ödev,
   sınav, yoklama, mesaj yoktur; okulun duyuruları ve bildirimleri artık gelmez.
3. Kart **son 1 geçmiş yıl** kuralıyla görünür (çıkarıldığı yıl ve bir sonraki eğitim yılı); sonra ana ekrandan kalkar. Veri
   silinmez; **"Verilerimi indir"**de her zaman vardır ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).
4. Hesabın, öbür kurumlardaki oturumların ve kişiye bağlı şeylerin (başarılar, eğitim içerikleri listeleri, hatırlatıcılar,
   ayarlar) etkilenmez. Hiç etkin oturumun kalmasa da giriş yapabilirsin: ana ekranda geçmiş kartların ve **"Şu an kayıtlı olduğun
   bir kurum yok"** boş durumu.
5. Yeni bir okul seni T.C. ve doğum tarihinle eklediğinde yeni oturumun kendiliğinden düşer; eski kullanıcı adın ve şifrenle
   girersin ([Öğrenci nakli](ogrenci-nakli.md)).

### Veli

Tasarımda: veli bağı kişiye bağlıdır, **kopmaz**. Çocuğunun o okuldaki kısmı "geçmiş" ya da "Mezun" olarak salt okunur görünür (aynı
1 yıl kuralı); öbür kurumları devam eder. Bağı kaldırmak ayrı iştir ([Veli bağlama](veli-baglama.md), [Çocuklarım](../portallar/cocuklarim.md)).

## Kurallar ve sınırlar

- **Hesap silinmez;** yalnız bu okuldaki oturum geçmiş olur. Öğrenci kendi hesabını da silemez (bugün de tasarımda da; tasarımdaki
  Hesap ayarlarında "Hesabını silmek — Öğrenci hesabını okulun kapatır; okul yönetimine söyle." — [Hesabımı sil](../ayarlar/hesabimi-sil.md)).
  Hesabın bütünüyle silinmesi tasarımda yalnız yöneticinin kullanıcı sayfasındadır ([Hesaba müdahale](../yonetim/hesaba-mudahale.md));
  okulun "kapatması"nın okuldan çıkarmadan başka bir şey olup olmadığı tanımlarda yazılı değil.
- **Kayıtlar okulundur:** çıkarılan öğrencinin bu okuldaki kayıtları okulun kaydı olarak kalır; öğrenci ve velisi 1 yıl görür, kişi
  her zaman "Verilerimi indir" ile alır (KVKK'ya yazılacak).
- **Yeni yıl geri alınırsa** (açıldıktan sonraki 24 saat içinde) mezuniyet de geri alınır.
- **Okul yedeği geri yüklenirse** (kullanıcının 29 Eylül 19:00 kararı): yedekten sonra okuldan çıkarılmış öğrencinin kayıtları geri
  gelir ve o okuldaki oturumu kendiliğinden yeniden açılır (öğrencinin ana ekranına düşer); öğrenciye ve müdüre bildirim gider.
  Hesabını silmiş kişinin verisi geri gelmez ([Okul yedeği](../egitim-yili/okul-yedegi.md)). "Okuldan çıkar"ın bundan başka bir geri
  alması tanımlarda yazılı değil.
- **Açık sorular:** düğmenin yeri ve adı, onay metni, çift doğrulama isteyip istemediği, işlem kaydı ve öğrenciye/veliye bildirim
  metni tanımlarda yazılı değil.

## Kardeşler ve ilgili

**Kardeşler:** [Öğrenci nakli](ogrenci-nakli.md) · [Öğrenciler listesi](ogrenci-listesi.md) · [Hesap penceresi](hesap-penceresi.md) ·
[Veli bağlama](veli-baglama.md).

**İlgili:** [Mezunlar](../egitim-yili/mezunlar.md), [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md),
[Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md), [Hesaba müdahale](../yonetim/hesaba-mudahale.md),
[Verilerimi indir](../ayarlar/verilerimi-indir.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md),
[Haklar ve başvuru](../kvkk-ve-gizlilik/haklar-ve-basvuru.md), [Okuldan çıkarma (öğretmen)](../ogretmenler-calisanlar/okuldan-cikarma.md).

## Kod tarafı

Henüz kodda yok. Bugünkü davranışın yeri: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `hesap-sil`
(öğrenci için yetki yok), [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — öğrenci penceresinde
"Hesabı sil" bölümünün olmaması; [sunucu/veri/depo/ogrenci-gecmisi.md](../../sunucu/veri/depo/ogrenci-gecmisi.md) — nakilde eski
okulun listelerinden çıkarma (`okuldanCikar`), tasarımdaki çıkarmanın da dayanacağı iş. Test: [testler/test-yonetim.md](../../testler/test-yonetim.md)
(`hesap-sil`'in öğrenciyi reddetmesi).

## Sık sorulanlar

- **Öğrenci okuldan ayrıldı, hesabını nasıl silerim?** Silemezsin; hesap öğrenciye aittir. Bugün sınıfsız bırak; yeni okulu onu
  T.C. ve doğum tarihiyle alınca listenden kendiliğinden çıkar.
- **Çıkarılan öğrencinin notları ne olur?** Silinmez; okulunun kaydı olarak kalır.
- **Velisi ne görür?** Tasarımda çocuğunun o okuldaki geçmiş kayıtlarını 1 yıl salt okunur görür; bağı kopmaz.

## Sırada

- Tek kişi tek hesap ve öğrencide portallar: eski okulun "okuldan çıkar"ı ve "geçmiş" oturum (canlıdan önce).
- Yıl geçişi: "Mezunlar" bölümü, mezun kartı ve müdürün mezunu okuldan çıkarması.
