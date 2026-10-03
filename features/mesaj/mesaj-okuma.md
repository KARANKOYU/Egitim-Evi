# Mesajlar · Mesajı okuma

**Durum:** Kodda var; tasarımda ek olarak üstte "Yanıtla" düğmesi, "Gönderen: / Alıcı: / Başlık: / Açıklama:" düzeni ve altta açılır "Ekler (N)" kutusu (Tasarım 1 önizlemesi, kullanıcının 1 Ekim kararı).

Kutudaki bir satıra basınca açılan pencere: kimden geldiği, ne zaman, metin, ekler ve (gönderense) kimin okuduğu.

## Ne işe yarar

Mesajın tamamını okumak, eklerini indirmek ve gerekiyorsa düzeltmek, silmek ya da kutundan kaldırmak için. Açtığın anda
mesaj "okundu" sayılır: gönderen bunu okundu listesinde saatiyle görür. Kullanıcı 1 Ekim'de mesaj ekranı için "bizde burada
Yanıtla ve altta Ekler butonu olacak; mesajlar için Alıcı: Gönderen: Başlık: Açıklama:" dedi.

## Nereden açılır

"Mesajlar" → "Gelen kutusu" ya da "Gönderilenler" → mesajın satırı ([Gelen kutusu ve gönderilenler](kutu.md)).

## Adım adım

### Alıcı (öğrenci, veli, öğretmen, müdür, servisçi) — bugünkü site

1. Satıra bas; pencerenin başlığı mesajın **konusu**.
2. Üstte gönderenin baş harfli yuvarlağı, **adı** ve **rolü** ("· Öğretmen", "· Müdür", "· Veli", "· Öğrenci",
   "· Servisçi"); sağda tarih ve saat ("12.10.2026 09:14"), düzeltildiyse **" · düzenlendi 12.10.2026 10:02"**.
3. Veliysen ve mesaj çocuğun için geldiyse mavi bilgi kutusu: **"Bu mesaj çocuğun Ada için gönderildi."**
   ([Velinin kopyası](velinin-kopyasi.md)).
4. Metin: satır sonları korunur, düz yazıdır (bağlantı ya da biçim yorumlanmaz).
5. Ek varsa **"Ekler"** başlıklı liste: dosya adı, "1,2 MB · 5 gün sonra silinir" ve **"İndir"** ([Mesaj ekleri](ekler.md)).
6. Alttaki düğmeler: **"Kutumdan kaldır"** (kırmızı) ve **"Kapat"** ([Düzeltme ve silme](duzeltme-ve-silme.md)).
7. Pencere açılınca mesaj okundu sayılır ve zildeki sayı yenilenir.

### Gönderen — bugünkü site

1. "Gönderilenler"de satıra bas; aynı pencere açılır.
2. Metnin altında **"12 / 28 kişi okudu"** ve doluluk çubuğu, altında ad ad liste ([Okundu bilgisi](okundu-bilgisi.md)).
3. Alttaki düğmeler: **"Mesajı sil"** (kırmızı), **"Düzelt"** ve **"Kapat"**.

### Müdür — duyuruda

Okulda yayımlanmış bir duyuruyu açabiliyorsan (alıcıları arasındaysan) gönderen gibi okundu listesini de görürsün.

### Tasarımda (Tasarım 1 önizlemesi)

- Pencerenin başlığı **"Mesaj"**; üstte sağda **"Yanıtla"** düğmesi ve kapatma (X).
- Bilgiler alt alta: **"Gönderen:"** ad + soluk yazıyla rolü/sınıfı ("· Öğretmen · Matematik"), **"Alıcı:"**, **"Başlık:"**
  (etiket varsa önünde renkli rozet: "Önemli", "Şikâyet", "Durum"), altında **"Açıklama:"** ve metin. Metin ortak yazı
  düzenleyicisiyle yazıldıysa biçimiyle (kalın, liste, bağlantı…) görünür; izin dışındaki kod düz yazı olarak kalır
  ([İzinli ve izinsiz kod](../yazi-yazma/izinli-ve-izinsiz-kod.md)).
- En altta tam genişlikte **"Ekler (N)"** düğmesi; basınca dosyalar altında açılır liste olarak çıkar ([Mesaj ekleri](ekler.md)).
  Gönderen izin verdiyse listenin altında **"Yükle"** de çıkar ([Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md)).
- **"Yanıtla"** → **"Yanıtla"** başlıklı yazma penceresi açılır: alıcı gönderen olarak hazır, başlık **"Ynt: <konu>"**
  ([Yeni mesaj ve alıcı seçimi](yeni-mesaj.md)). Bugünkü sitede yanıtlama yok; yanıt için yeni mesaj yazılır.
- Şikâyet etiketli mesajda bilgilerin altında durum şeridi **"Gönderildi · Bakıldı · Çözüldü"** ([Şikâyet etiketi](sikayet-etiketi.md)).
- Velide çocuğa giden kopyada bilgilerin altında not: **"Bu mesaj Ada'ya gönderildi; sana kopyası geldi."**
- Önizlemede pencerede okundu listesi, "Düzelt" ve tek mesaj silme çizilmemiş; bunların kaldırılması için bir karar yok
  (bugünkü düğmeler kalır; silme önizlemede listeden toplu yapılır).
- Tanıma göre alınan her mesajda alıcı **"Bildir"** ile mesajı okul yönetimine bildirebilir (önizlemede bu düğme henüz
  çizilmemiş; [Bu mesajı bildir](bu-mesaji-bildir.md)).

## Kurallar ve sınırlar

- **Kim açar:** yalnız mesajın alıcıları (veli kopyası dahil) ve göndereni. Başkası **"Bu mesajı görme yetkin yok"**; mesaj
  silinmişse **"Mesaj bulunamadı"** (tarayıcının uyarı kutusuyla).
- **Okundu:** yalnız alıcı ilk kez açınca yazılır; gönderenin kendi mesajını açması okundu sayılmaz. Okundu geri alınamaz
  ("Okunmadı olarak işaretle" yok).
- **Duyuru cevaplanmaz:** bugün hiçbir mesajda yanıt düğmesi yok; duyuru yeni mesaj penceresinde de "cevaplanmaz" diye anlatılır
  ([Duyuru](duyuru.md)). Tasarımda "Yanıtla" duyuruda da çizilmiş; duyuruya yanıt verilip verilmeyeceği yazılı değil.
- **Metin sınırı:** konu en çok 120, metin en çok 4000 karakter (yazarken kırpılır). Tasarım 1'de başlık kutusu 200 karakter.
- **Müdür ve başkasının duyurusu:** müdür kendisine gönderilmemiş (ör. bir öğretmenin yalnız 7-A'ya yayımladığı) duyuruyu
  pencerede açamaz ("Bu mesajı görme yetkin yok"), ama sunucu o duyurunun okundu listesini ona verir (kod okumasına göre küçük
  tutarsızlık).
- **Bilinen açık:** pencere kapanınca listedeki satır "yeni" kalır ([Gelen kutusu](kutu.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Gelen kutusu ve gönderilenler](kutu.md) · [Okundu bilgisi](okundu-bilgisi.md) · [Mesaj ekleri](ekler.md) ·
[Alıcıların dosya yüklemesi](alicilarin-dosya-yuklemesi.md) · [Düzeltme ve silme](duzeltme-ve-silme.md) ·
[Velinin kopyası](velinin-kopyasi.md) · [Bu mesajı bildir](bu-mesaji-bildir.md) · [Şikâyet etiketi](sikayet-etiketi.md) ·
[Ajandaya ve hatırlatıcıya ekle](ajandaya-ve-hatirlaticiya-ekle.md).

**İlgili:** [Bildirim paneli](../bildirim/bildirim-paneli.md), [Yazı düzenleyici](../yazi-yazma/README.md),
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Android geri tuşu](../uygulama/geri-tusu.md) (tasarımda açık mesajı önce kapatır).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) — `mesajAc` (`GET /api/mesajlar/<id>`,
  pencere, `S._acikMesaj`, `bildirimleriYenile`, `okumaYukle`), `ekListesiGoster`
  ([public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md)); pencere [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md).
- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) — `GET /api/mesajlar/<id>` (yetki, okundu yazma,
  `mesajOzeti`, `hedefinEkleri`, `okumaGorur`), `okumaGorebilir`.
- Depo: [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) — `bul`, `okundu`.
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md) (okundu işareti), [testler/test-etut.md](../../testler/test-etut.md)
  (alıcı düzeltilmiş metni görür).

## Sık sorulanlar

- **Gönderen mesajı okuduğumu görür mü?** Evet, okundu listesinde adının yanında okuma saatin yazar.
- **Mesaja nasıl cevap veririm?** Bugün "Yeni mesaj"la gönderene yazarsın. Tasarımda pencerede "Yanıtla" var.
- **Metindeki bağlantıya basamıyorum.** Bugün mesaj düz yazıdır; yazı düzenleyici gelince bağlantılar tıklanır olacak.

## Sırada

- Mesaj tasarımı (Tasarım 1): "Yanıtla", Gönderen/Alıcı/Başlık/Açıklama düzeni, açılır "Ekler (N)" kutusu.
- Düzenleyiciler: mesaj metni ortak yazı düzenleyicisiyle (biçimli gösterim).
- Mesaj ayarları, Bu mesajı bildir, Ajanda işi: alınan her mesajda "Bildir".
- Mesaj etiketleri: başlığın önünde etiket rozeti, şikâyette durum şeridi.
