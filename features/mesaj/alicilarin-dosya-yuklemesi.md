# Mesajlar · Alıcıların dosya yüklemesi

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 1 Ekim 21:05 kararı; Tasarım 1 önizlemesinde var).

Gönderenin izin verdiği mesaja alıcının dosya yüklemesi: ör. öğretmen izin formunu gönderir, veli imzalı formun fotoğrafını aynı mesaja yükler.

## Ne işe yarar

Kullanıcı 1 Ekim'de mesaj eklerini anlatırken şunu istedi: mesaj yazarken bir onay kutusu olsun, işaretliyse karşı taraf
okurken "Ekler"in altında "Yükle" görsün (ör. imzalı izin formu) ve yüklediği dosyalar gönderene gitsin. İşaretsizse karşı
taraf yalnız listeyi ve "İndir"i görür. Aynı açılır liste ödevde "Teslim edilen dosyalar" için de kullanılır.

## Nereden açılır

- **Gönderen:** "Yeni mesaj" penceresinde Ekler kutusunun altındaki onay kutusu **"Alıcılar bu mesaja dosya yükleyebilsin"**.
- **Alıcı:** izinli mesajın penceresinde **"Ekler (N)"** → açılan listenin altındaki **"Yükle"**.

## Adım adım

### Gönderen (öğretmen, müdür; tasarımda yazı yazan herkes) — tasarım

1. "Yeni mesaj"ı aç, alıcıları, başlığı ve açıklamayı yaz; istersen izin formunu ekle.
2. Ekler kutusunun altında **"Alıcılar bu mesaja dosya yükleyebilsin"** kutusunu işaretle. Altında küçük yazı: **"ör. imzalı izin
   formu; yüklenen dosyaları yalnız sen görürsün"**.
3. **"Gönder"**.
4. Alıcılar dosya yükledikçe mesajın "Ekler" listesinde onların dosyalarını görür, indirirsin.

### Alıcı (veli, öğrenci, öğretmen…) — tasarım

1. Mesajı aç; açıklamada çoğunlukla gönderenin notu olur (önizlemedeki örnek: "Doldurduğunuz formu bu mesaja yükleyebilirsiniz.").
2. **"Ekler (N)"**e bas; liste açılır. Gönderenin dosyaları **"İndir"**le iner.
3. Listenin altında **"Yükle"** alanı: **"Dosyaları buraya bırak ya da [Dosya seç]"**, ipucu **"Gönderen dosya yüklemene izin
   verdi · en çok 10 dosya, toplam 50 MB · 7 gün sonra silinir"**.
4. Dosyayı seç ya da sürükle. Ekranda **"1 dosya eklendi; gönderen görebilir."**
5. Kendi yüklediğin dosyanın satırında **"· senin yüklediğin"** yazar ve yalnız onda **"Sil"** çıkar (onay: **"“form.jpg”
   kaldırılsın mı?"** — "Dosya bu listeden çıkarılır.").
6. Gönderen izin vermediyse "Yükle" alanı hiç çıkmaz; yalnız liste ve "İndir".

## Kurallar ve sınırlar

Karara bağlananlar (1 Ekim):

- İzin mesaj başınadır ve gönderen verir; varsayılan işaretsiz.
- Alıcının yüklediği dosyalar **gönderene** gider ("yüklenen dosyaları yalnız sen görürsün"); alıcılar birbirinin dosyasını görmez.
- Alıcı yalnız kendi yüklediğini silebilir.
- Aynı açılır liste düzeni ödevde "Teslim edilen dosyalar" için kullanılır (öğrencide "Yükle"; en çok 10 dosya / 50 MB;
  [Teslim](../odev/teslim.md)).
- Tasarım 1'deki sınır yazısı: en çok 10 dosya, toplam 50 MB; dosyalar 7 gün sonra silinir.

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı):

- 10 dosya / 50 MB sınırının her alıcı için ayrı mı, mesajın toplamı için mi olduğu.
- Alıcının yüklemesinin bir son tarihi olup olmayacağı; gönderenin izni sonradan kapatıp kapatamayacağı.
- Yükleme olunca gönderene bildirim gidip gitmeyeceği.
- Velinin kopyasına (öğrenciye giden mesaj) velinin de yükleyip yükleyemeyeceği; okulun "mesaja dosya ekleyebilenler" ayarı
  (öğrenci varsayılan kapalı, veli açık) bu izni kısıtlıyor mu ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).
- Toplu mesajda (ör. "7-A velileri") gönderenin hangi dosyayı kimin yüklediğini nasıl göreceği (önizlemede kişi kişi ayrılmamış).
- Bu dosyaların okulun dosya alanına sayılması (öbür ekler gibi yükleyenin okuluna sayılması beklenir).

## Kardeşler ve ilgili

**Kardeşler:** [Mesaj ekleri](ekler.md) · [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [Mesajı okuma](mesaj-okuma.md) ·
[Okulun mesaj ayarları](okulun-mesaj-ayarlari.md).

**İlgili:** [Dosya yükleme izni (ödev)](../odev/dosya-yukleme-izni.md) (ödevdeki benzer izin) · [Teslim](../odev/teslim.md) ·
[Okul disk sınırı](../okul-disk/disk-siniri.md) · [Anketi mesaja ekleme](../anket/odeve-mesaja-ekleme.md) (imza yerine onay formu).

## Kod tarafı

Bugün kodda yok: bugün ek yalnız gönderenin taslağı olarak yüklenir ve mesaj gönderilirken bağlanır; gönderilmiş mesaja kimse
dosya ekleyemez ([sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md): `yukle`, `ekleriDogrula`, `gorebilir`;
[public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md)). Ödevdeki benzer yol öğrencinin teslim dosyalarıdır
([sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md)). Mesajda iznin saklanacağı yer ve yükleme ucu yapı
belgesinde yazılacak; kodlanınca bu belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **İmzalı formu nereye yükleyeceğim?** Öğretmen izin verdiyse mesajın "Ekler" listesinin altındaki "Yükle"ye; izin yoksa yeni
  bir mesaja ek olarak gönder.
- **Yüklediğim dosyayı başka veliler görür mü?** Hayır; yalnız mesajı gönderen görür.

## Sırada

- Mesaj tasarımı (Tasarım 1): "Alıcılar bu mesaja dosya yükleyebilsin" ve alıcının "Yükle"si (kod Linux'ta yazılacak).
