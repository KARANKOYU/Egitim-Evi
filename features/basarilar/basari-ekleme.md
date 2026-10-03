# Başarılar · Başarı ekle

**Durum:** Tasarlandı — henüz kodda yok

Müdürün (ya da "Başarı ekler" yetkisi olanın) bir öğrencinin hesabına başlık, tarih, açıklama ve belgenin fotoğrafını ya da
dosyasını eklediği pencere.

## Ne işe yarar

Kullanıcının 28 Eylül isteği: "müdür başlığa teşekkür belgesi … sınıf der, png'yi koyar, jpeg de olabilir; bunlar öğrencinin
hesabında durur." Okul, öğrencinin aldığı teşekkür, takdir, yarışma derecesi gibi belgeleri fotoğrafıyla birlikte öğrencinin
hesabına koyar; öğrenci ve velisi [Başarılarım ve Başarıları](basarilarim.md)'nda görür. Belgenin fotoğrafı telefonda çekilip
doğrudan konabilir. Kullanıcının 29 Eylül kararıyla belge okulun portalına değil öğrencinin kendisine bağlanır; kartta veren
kurumun adı yazar.

## Nereden açılır

- **Müdür:** sol menüde "Okul düzeni" → **"Başarılar"** → sağ üstte artı simgeli **"Başarı ekle"**
  ([Başarılar sayfası](basarilar-sayfasi.md)).
- **Müdür, öğrencinin penceresinden:** "Öğrenciler" → öğrenciye tıkla → açılan hesap penceresinde **"Başarılar"** satırı
  ("Belgeli başarı ekle") → **"Başarı ekle"** ([Hesap penceresi](../hesaplar/hesap-penceresi.md)).
- **"Başarı ekler" yetkisi olan çalışan ya da öğretmen:** tanıma göre müdürle aynı yol: "Başarılar" → "Başarı ekle"
  ([yetki](basari-ekleme-yetkisi.md)). Tasarım 1 önizlemesinde bu yol yalnız müdür hesabında çizildi.

## Adım adım

### Müdür

Pencerenin başlığı **"Başarı ekle"**. Alanlar yukarıdan aşağı:

| Alan | Türü | Ayrıntı |
|---|---|---|
| **"Sınıf"** | açılır liste | okulun sınıfları; değiştirince "Öğrenci" listesi o sınıfın öğrencileriyle yenilenir |
| **"Öğrenci"** | açılır liste | seçili sınıfın öğrencileri |
| **"Başlık"** | yazı kutusu, yer tutucu "ör. Teşekkür Belgesi" | altında hazır başlık düğmeleri: "Teşekkür Belgesi", "Takdir Belgesi", "Onur Belgesi", "Başarı Belgesi", "Katılım Belgesi" |
| **"Veren kurum"** | yazı kutusu | okulun adıyla dolu gelir; belgeyi başka bir kurum verdiyse onun adını yaz |
| **"Verildiği tarih"** | tarih seçici | geçmiş bir gün olabilir; bugünden sonrası seçilemez |
| **"Açıklama"** | ortak yazı düzenleyici | isteğe bağlı |
| **"Belge"** | dosya seçme alanı | kalın "Fotoğraf ya da dosya seç", altında "PNG, JPEG ya da PDF · telefonda fotoğrafını çekebilirsin" |

Altta **"Vazgeç"** ve yıldız simgeli **"Ekle"**.

1. **"Sınıf"**tan öğrencinin sınıfını, **"Öğrenci"**den öğrenciyi seç.
2. **"Başlık"** kutusuna başlığı yaz ya da hazır düğmelerden birine bas (ör. "Teşekkür Belgesi"); düğme başlığı kutuya
   yazar, sonra istersen değiştirirsin (ör. "İl birincisi — Matematik Olimpiyatı").
3. Belgeyi okulun dışında bir kurum verdiyse **"Veren kurum"**a onun adını yaz (ör. "İl Millî Eğitim Müdürlüğü").
4. **"Verildiği tarih"**ten belgenin verildiği günü seç (geçen yılın belgesi de olur).
5. İstersen **"Açıklama"** yaz (ör. "Okul satranç turnuvası, 32 öğrenci arasında birinci."). Alan, sitenin her uzun yazı
   alanındaki ortak yazı düzenleyicisidir ([Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md)).
6. **"Belge"** alanına tıkla, dosyayı seç. Telefonda kamera ya da galeri açılır; belgenin fotoğrafını çekip koyabilirsin.
   Seçince alanda önizleme görünür: resimse küçük resmi, PDF ise belge simgesi ve dosyanın adı.
7. **"Ekle"**ye bas. Eksik varsa formun altında kırmızı ileti çıkar, pencere kapanmaz:
   - başlık boşsa: "Başlık yaz ya da hazır başlıklardan birini seç."
   - belge seçilmediyse: "Belgenin fotoğrafını ya da dosyasını seç."
8. Her şey tamamsa pencere kapanır, ekranın altında birkaç saniye kısa bir ileti görünür (kalıbı: "<başlık>" <öğrencinin
   adı>'ın hesabına eklendi; öğrenciye ve velisine bildirim gitti.), ör.:

   > "Teşekkür Belgesi" Deniz Aydın'ın hesabına eklendi; öğrenciye ve velisine bildirim gitti.

   Belge [Başarılar sayfası](basarilar-sayfasi.md)'nın "Son eklenenler" listesinin ve öğrencinin "Başarılarım"ının en başına
   gelir. (Önizlemede ad ekinin "'ın" kalıbı sabit; kodlanırken ada göre "'ın / 'in / 'un / 'ün" uyumu gerekir.)
9. Vazgeçersen **"Vazgeç"** ya da sağ üstteki ×; hiçbir şey kaydedilmez.

Öğrencinin hesap penceresinden açtığında da aynı pencere gelir.

### Çalışan ve yetkili öğretmen

Rolünde "Başarı ekler" yetkisi varsa (hazır şablonlardan "Müdür yardımcısı", "Rehber öğretmen", "Sınıf öğretmeni")
müdürle aynı adımlar. Rolün "Sınıflar" kapsamı "Kendi sınıfları" (ya da seçili sınıflar) ise yalnız o sınıfların
öğrencilerine eklersin (tanım: "Sınıf öğretmeni" kendi sınıfı kapsamında; ekranda nasıl görüneceği belirlenmedi, bkz.
["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md)). Yetkin yoksa "Başarı ekle" düğmesi sende yok.

### Toplu ekleme (öneri — onaylanmadı)

Tanımdaki öneri: birden çok dosya birden seçilir; dosyanın adı öğrenci numarasıysa (ör. 214.png) belge o öğrenciye
kendiliğinden eşleşir, eşleşmeyenler bir önizlemede elle seçilir. Tasarım 1 önizlemesinde Başarılar sayfasının altında not
olarak geçer ("Toplu ekleme: birden çok dosya seç; dosya adı öğrenci numarasıysa (ör. 214.png) kendiliğinden eşleşir.")
ama "Başarı ekle" penceresi bugün tek dosya alıyor ve toplu ekleme ekranı çizilmedi. Kullanıcı bu öneriye ayrıca bir şey
demedi; kodlanmadan önce sorulmalı.

## Kurallar ve sınırlar

- **Kim ekler:** müdür her zaman; "Başarı ekler" yetkisi olan rol sahibi kapsamı içinde. Öğrenci, veli, servisçi ve
  yetkisiz öğretmen ekleyemez.
- **Zorunlu alanlar:** başlık ve belge. Sınıf, öğrenci, veren kurum ve tarih dolu gelir; açıklama isteğe bağlı.
- **Belge türleri:** PNG, JPEG ya da PDF; bir başarıya tek dosya.
- **Tarih:** bugün ya da geçmiş bir gün; ileri tarih seçilemez.
- **Belge kalıcıdır:** mesaj ve ödev eklerinin aksine 7 gün sonra silinmez; yıl geçişinde de silinmez
  ([Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md)).
- **Dosya altyapısı (tanım: bugünkü ek altyapısı):** fotoğraf yüklenmeden önce telefonda küçültülür (uzun kenar 2048 px —
  [Yüklemeden önce telefonda küçültme](../okul-disk/telefonda-kucultme.md)); resmin içindeki gizli bilgiler (konum, tarih,
  cihaz) silinir; dosya ekleyen okulun disk alanına sayılır ([Okulun dosya alanı](../okul-disk/doluluk.md)).
- **Boyut sınırı:** başarı belgesi için ayrıca yazılmadı. Bugünkü eklerde tek dosya en çok 50 MB.
- **Bildirim:** belge eklenince öğrenciye bildirim gider; bildirimin bir kopyası velilerine de gider
  ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).
- **Kişiye bağlı:** belge öğrencinin hesabına yazılır; öğrenci okuldan ayrılsa da kalır. Düzeltme ve silme hakkı yalnız
  ekleyen kurumdadır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Başarılar](README.md)):

- [Başarılar sayfası](basarilar-sayfasi.md) — "Başarı ekle" düğmesinin bulunduğu sayfa.
- ["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md) — müdürden başka kimin ekleyebileceği.
- [Başarılarım ve Başarıları](basarilarim.md), [Başarı penceresi](basari-penceresi.md) — eklenen belgenin göründüğü yerler.
- [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md), [Kimler görür](kimler-gorur.md).

**İlgili:**

- [Hesap penceresi](../hesaplar/hesap-penceresi.md) — öğrencinin penceresindeki "Başarılar" satırı.
- [Yazı düzenleyici](../yazi-yazma/nerelerde-var.md) — "Açıklama" alanı.
- [Telefonda küçültme](../okul-disk/telefonda-kucultme.md), [Sunucuda küçültme](../okul-disk/sunucuda-kucultme.md).
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Yükleme ve ek kutusu: [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md),
  [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) (taslak yükleme, disk sınırı; ama eklerin 7 günlük silinmesi
  başarı belgesine uygulanmaz).
- Telefonda küçültme: [public/js/parcalar/04f-resim-kucult.md](../../public/js/parcalar/04f-resim-kucult.md) — belge bu işi
  "PNG/JPEG/PDF belge ekleme mevcut dosya altyapısını (telefonda küçültme dahil) kullanacak" diye anıyor.
- Resmin güvenlik kapısı: [sunucu/yardimci/resim.md](../../sunucu/yardimci/resim.md) (PDF için ek tür denetimi gerekecek).
- Disk sınırı: [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md).
- Bildirim ve veliye kopya: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md).
- Müdür tarafı: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md),
  [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) (ikisi de bu işi sıradakiler arasında anıyor).

## Sık sorulanlar

- **Geçen yıl alınmış bir belgeyi ekleyebilir miyim?** Evet; "Verildiği tarih"ten geçmiş günü seç.
- **Belgeyi il müdürlüğü verdi, okul değil.** "Veren kurum"a il müdürlüğünü yaz. Kartta o yazar; ama belgeyi okulun eklediği
  için düzeltme ve silme yine okulunda kalır.
- **Telefondan ekleyebilir miyim?** Evet; "Belge" alanında kamera açılır, belgenin fotoğrafını çekersin.
- **Yanlış öğrenciye ekledim.** Belgeyi aç, "Sil" ile sil (onaylı), doğru öğrenciye yeniden ekle.
- **Aynı belgeyi bütün sınıfa vermek istiyorum.** Bugünkü tasarımda öğrenci öğrenci eklenir; toplu ekleme öneri olarak
  bekliyor.

## Sırada

- Başarılarım işi: pencere bu belgeye ve Tasarım 1 önizlemesine göre kodlanacak.
- Özel roller işi: "Başarı ekler" yetkisi ve hazır şablonlara eklenmesi (öneri, onay bekliyor).
- Toplu ekleme (öneri) kullanıcıya sorulacak.
- Sunucuda küçültme işi: başarı belgelerinin resimleri de sunucuda küçültülecek ve meta verisi silinecek.
- KVKK: kodlandığı işte aydınlatma metnine eklenecek.
