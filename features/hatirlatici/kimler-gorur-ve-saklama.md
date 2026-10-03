# Hatırlatıcılar · Kimler görür, hangi portala ait, ne zaman silinir

**Durum:** Kodda var; tasarımda ek olarak velide her çocuk oturumunun ayrı hatırlatıcıları, öğrencide hatırlatıcıların kişiye bağlı
olması (mezuniyetten ve kurum değişikliğinden etkilenmez), gönderilmiş tek seferlik hatırlatıcıların 30 gün sonra silinmesi,
"Verilerimi indir"e girmesi ve okul eklentilerine kapalı olması.

Hatırlatıcının gizliliği: yalnız kuranın görmesi, yetişkin hesabında her portalın listesinin ayrı olması ve kaydın ne zaman silindiği.

## Ne işe yarar

Hatırlatıcı kişisel bir nottur ("ilacımı al", "doktor randevusu" bile olabilir). Öğretmen, müdür ya da veli onu görmemeli; okul
kapatamamalı; sen silene kadar durmalı. Sistem yöneticisinin de ekranda başkasının hatırlatıcısını gösteren bir yeri yoktur, ama
sitenin yedek dosyasını indirebilir ve yedekte herkesin hatırlatıcısı vardır (aşağıda "Yedek").

## Nereden açılır

Ayrı bir ekranı yok; kurallar **Hatırlatıcılar** sayfasında, hatırlatma bildiriminde ve hesap silme, okuldan ayrılma gibi işlerde
geçerlidir ([Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md)). Aydınlatma metninde "Kişisel hatırlatıcılar" satırı
([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

## Adım adım

### Herkes: kim görür (bugünkü site)

1. Hatırlatıcılar sayfası yalnız **senin** kurduklarını listeler.
2. Başkası adresle senin hatırlatıcını açmaya, düzeltmeye ya da silmeye kalkarsa sunucu **"Hatırlatıcı bulunamadı"** der: kaydın var
   olduğu bile belli olmaz. Bu öğretmen, müdür ve veli için de böyledir.
3. Hatırlatma bildirimi yalnız sana gider; öğrencinin kurduğu hatırlatma velisine kopyalanmaz
   ([Hatırlatma bildirimi](hatirlatma-bildirimi.md)).
4. Sistem yöneticisinin de başkasının hatırlatıcılarını gösteren bir ekranı yoktur. Ancak yönetim panelinin **"Yedekleme"**
   sayfasında yedeği **"İndir"** ile alabilir; yedek dosyasında bütün hatırlatıcılar (başlık ve açıklama dahil) bulunur.

### Öğrenci

Hesabın tek; hatırlatıcıların bu hesaptadır. Velin, öğretmenlerin ve müdürün göremez. Velin senin portalına girdiğinde menüde
"Hatırlatıcılar" yoktur.

### Veli

Veli portalı yetişkin hesabının kendisidir: veli portalındaki hatırlatıcılar ile hesabın henüz okula bağlı değilken "Başlangıç"ın
yanındaki "Hatırlatıcılar"da kurdukların **aynı liste**dir. Çocuğunun hatırlatıcılarını göremezsin.

### Öğretmen, çalışan ve müdür

Yetişkin hesabındaki her okul rolü (A okulunda öğretmen, B okulunda müdür) ayrı bir portaldır ve **her portalın hatırlatıcıları ayrı**
tutulur: A okulunda kurduğun hatırlatıcı B okulundaki portalında ya da veli portalında görünmez; hatırlatması da o portalın ziline
gelir. Telefon bildirimi ise kişiye ait olduğu için hepsi aynı telefona düşer.

### Servisçi

Okulun açtığı servisçi hesabının hatırlatıcıları bu hesaptadır; okul hesabı silerse hatırlatıcılar da silinir.

### Yönetici

Sistem yöneticisi hesabının kendi hatırlatıcıları; başkasınınkini ekranda göremez. Hatırlatıcılar sitenin yedek dosyasına girer
(aşağıda).

### Ne zaman silinir (bugünkü site)

| Ne olunca | Hatırlatıcılara ne olur |
|---|---|
| Sen "Sil"e basınca | O hatırlatıcı kalıcı olarak silinir ([Kurma, düzenleme ve silme](hatirlatici-kurma.md)). |
| Bir kezlik gönderilince | Silinmez; kapanır, "Hatırlatıldı" olarak listede kalır. |
| Hesabını silince ("Hesabımı sil") | Bütün portallarının hatırlatıcılarıyla birlikte silinir ([Hesabımı sil](../ayarlar/hesabimi-sil.md)). |
| Okuldan ayrılınca (Ayarlar → Portallarım'da öğretmen portalının yanındaki **"Okuldan ayrıl"**; müdür rolünde bu düğme yok) | O okuldaki portalın hatırlatıcıları silinir; öbür portalların durur ([Okuldan ayrılma](../portallar/okuldan-ayrilma.md)). |
| Okul seni öğretmen listesinden çıkarınca | Yalnız o okuldaki portalın hatırlatıcıları silinir; yetişkin hesabın ve öbür portalların durur ([Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md)). |
| Okul servisçi hesabını silince | Servisçinin hatırlatıcıları silinir ([Servisçi hesabı](../servis/servisci-hesabi.md)). |
| Yeni eğitim yılı açılınca ya da yıl seçiciyle geçmiş yıla bakınca | Hiçbir şey: hatırlatıcılar eğitim yılına bağlı değildir. |

### Tasarımda (Tasarım 1 önizlemesi ve tanımlar)

- **Velide her çocuk ayrı oturum** (3 Ekim kararı: "hesap = kişi, oturum = rol"; ekranda "portal" kelimesi kalkar, yerine yalnız
  "oturum" yazar): her çocuk oturumunun hatırlatıcıları ayrıdır; Elif'in oturumunda kurduğun Can'ın oturumunda görünmez
  ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)). Bu belgede bugünkü site için geçen "portal" tasarımda
  "oturum" olur.
- **Öğrencide kişiye bağlı** (yıl geçişi tanımı): hatırlatıcılar Başarılarım ve Eğitim içerikleri gibi kişiye bağlı bölümlerdendir;
  öğrenci mezun olunca ya da başka kuruma geçince etkilenmez; hiçbir aktif portalı kalmasa da girişte Hatırlatıcılar'ı görür
  ([Mezunlar](../egitim-yili/mezunlar.md)). Okul ve dershane gibi iki kurumda oturumu olan öğrencide hatırlatıcıların oturumlar
  arasında ortak mı, ayrı mı olacağı tanımlarda açık değil (önizlemenin hatırlatıcı bölümü "her oturumun kendi hatırlatıcıları"
  diyor ama önizlemedeki "Öğrenci · Örnek Dershanesi" oturumunun menüsünde Hatırlatıcılar hiç yok; yıl geçişi tanımı "kişiye bağlı"
  diyor).
- **Henüz oturumu olmayan hesap:** bugünkü sitede portalı olmayan yetişkinin menüsünde "Hatırlatıcılar" var; Tasarım 1
  önizlemesinde bu hesabın menüsünde yalnız "Ana sayfa" var. Tanımlarda Hatırlatıcılar'ın buradan kaldırılacağına dair bir karar
  yok; kodlanmadan önce kullanıcıya sorulmalı.
- **30 gün:** gönderilmiş ve kapanmış tek seferlik hatırlatıcılar ("Hatırlatıldı") 30 gün sonra kendiliğinden silinir
  ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- **Verilerimi indir:** indirilen veride "Hatırlatıcıların, Eğitim Evi yorumun ve destek taleplerin" maddesi
  ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).
- **Eklentiler:** okul eklentileri kişiye bağlı bölümlere (Başarılarım, eğitim içerikleri, hatırlatıcılar) erişemez
  ([Eklentilerin sınırları](../eklentiler/sinirlar.md)).
- **Duyurudan gelen hatırlatıcılar** duyuruyla birlikte silinir ([Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md)).

## Kurallar ve sınırlar

- **Aydınlatma metnindeki satır** (aynen): "Kişisel hatırlatıcılar — İsteğe bağlı; kişi kendine kurar (başlık, açıklama, gün ve
  saat). Yalnızca kişinin kendisi görür; zamanı gelince ona bildirim gider. Kişi istediği zaman siler; hesap silinince silinir."
  ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md)).
- **Okul kapatamaz, okul göremez:** hatırlatıcılar "Özellikler"de yoktur; okulun hiçbir rolü ya da yetkisi başkasının
  hatırlatıcısını açmaz ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).
- **Saklama (bugün):** sen silene ya da hesap (portal) silinene kadar; süre sınırı yok. Kapanmış bir kezlikler de 50 sınırına sayılır.
- **Yedek:** hatırlatıcılar sitenin yedeklerine girer ve yedekten geri yüklenince geri gelir ([Site yedekleri](../yonetim/yedekler.md)).
  Sistem yöneticisi yedeği indirebilir; sildiğin hatırlatıcı, silmeden önce alınmış yedeklerde o yedekler silinene kadar durur.
- **Veriler dışarı gitmez:** hatırlatıcı içeriği yalnız bildirim olarak sana ve telefon bildirimi açıksa, şifreli olarak telefonuna
  (aradaki bildirim servisi okuyamaz) gider ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) · [Kurma, düzenleme ve silme](hatirlatici-kurma.md) ·
[Sıklık](siklik.md) · [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) · [Hatırlatma bildirimi](hatirlatma-bildirimi.md) ·
[Takvimde ve ajandada](takvimde-ve-ajandada.md) · [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md).

**İlgili:** [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) · [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) ·
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) · [Portalı olmayan yetişkin](../portallar/portalsiz-hesap.md) ·
[Portallarım](../portallar/portallarim.md) · [Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md) ·
[Verilerimi indir](../ayarlar/verilerimi-indir.md) · [Hesabımı sil](../ayarlar/hesabimi-sil.md).

## Kod tarafı

- Sahiplik ve 404: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) (`h.kullaniciId !== me.id` → "Hatırlatıcı
  bulunamadı"; bildirimde `veliye: false`).
- Portal başına ayrı kayıt: okul rolleri yetişkin hesabına bağlı ayrı kullanıcı satırlarıdır
  ([sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md)); okuldan ayrılma ve çıkarma rol satırını siler
  ([sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md)).
- Silinme: `hatirlaticilar.kullanici_id` `ON DELETE CASCADE`, günler de CASCADE
  ([sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Yedek: [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (`hatirlaticilar`, `hatirlatici_gunleri`).
- Rolsüz kapısı: [sunucu/api.md](../../sunucu/api.md) (`ROLSUZ_SERBEST`); okulun kapattığı bölümlerle ilgisi yok.
- Aydınlatma metni: [public/kvkk/kvkk.html](../../public/kvkk/kvkk.html) ("Kişisel hatırlatıcılar" satırı).
- Testler: [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md) ("Yalnız sahibi": başkası göremez, düzeltemez, silemez —
  öğretmen dahil).

## Sık sorulanlar

- **Okul müdürü hatırlatıcılarımı görebilir mi?** Hayır; hiçbir rol ya da yetki başkasının hatırlatıcısını açmaz.
- **Velim benim hatırlatıcılarımı görür mü?** Hayır; ne listeyi ne de bildirimleri.
- **Okuldan ayrıldım; o okulda kurduğum hatırlatıcılar ne oldu?** O portalla birlikte silindi; öbür portallarının hatırlatıcıları
  durur.
- **Yeni eğitim yılında hatırlatıcılarım silinir mi?** Hayır; hatırlatıcılar eğitim yılına bağlı değildir.
- **"Hatırlatıldı" olanlar ne zaman silinir?** Bugün sen silene kadar durur; tasarımda 30 gün sonra kendiliğinden silinir.

## Sırada

- Optimizasyon + saklama süreleri: gönderilmiş ve kapanmış tek seferlik hatırlatıcılar 30 gün sonra silinir.
- Kullanıcı arama … Verilerimi indir: hatırlatıcılar indirilen veriye girer.
- Tek kişi tek hesap + portallar öğrencide de: öğrencide hatırlatıcıların kişiye bağlı olması.
- Yıl geçişi: mezun olan öğrencinin hatırlatıcıları etkilenmez.
- Arayüz önizlemesi (Tasarım 1): velide her çocuk oturumunun ayrı hatırlatıcıları.
- Eklentiler (yalnız belge): okul eklentilerinin hatırlatıcılara erişememesi.
