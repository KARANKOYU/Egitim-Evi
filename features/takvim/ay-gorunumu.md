# Takvim ve ajanda · Ay görünümü

**Durum:** Kodda var; tasarımda ek olarak yıl okları ("«", "»") gelir, gün kutusunda kayıtların başlıkları yazar (en çok iki, fazlası "+2 daha"), sınavlar, toplantılar, etütler, duyurular, açık hatırlatıcılar ve okulun eğitim yılı günleri de kutulara düşer; "Bugün" düğmesi, yıl açılır listesi ve ders sayısı yoktur (Tasarım 1 önizlemesi).

Pazartesiyle başlayan aylık ızgara: her gün bir kutu; kutuda o günün tatili, ödevleri, okul etkinlikleri ve (bugün) ders sayısı.

## Ne işe yarar

Ayın bütününe bir bakışta göz atarsın: hangi gün tatil, hangi günlerde ödev teslimi ya da okul etkinliği var. Kullanıcı 29 Ağustos'ta
"normal bir takvim gibi ay, yıl, gün" olan ve "23 Nisan, 15 Temmuz gibi kullanışlı" günleri gösteren bir takvim istedi; 1 Ekim'de
günlerin tıklanabilir olmasını ve seçili günün "daha parlak" bir çerçeveyle belli olmasını istedi. Bir güne basınca o günün işleri
ayrı bir listede açılır ([Gün ayrıntısı](gun-ayrintisi.md)).

## Nereden açılır

- Sol menü → **"Takvim"** (öğrencinin portalında **"Takvimi"**) → sayfanın ana kartı ([Takvim sayfası](takvim-sayfasi.md)).
- Tasarımda Takvim sayfasının **"Takvim"** sekmesi (öbür sekme "Ajanda").
- Aynı veri (tatiller, okul etkinlikleri, ödevlerin son günleri) öğretmenin ödev verirken açtığı tarih seçicisinde de günlerin altında
  işaret olarak görünür ([Ödevin tarih ve saati](../odev/tarih-ve-saat.md)).

## Adım adım

### Bütün roller (bugünkü site)

1. Kartın üstündeki çubukta soldan sağa: **"‹"** (önceki ay), ay adı ve yıl (**"Ekim 2026"**), **"›"** (sonraki ay), **"Bugün"**,
   sağda **yıl seçici**, yetkiliysen **"Etkinlik ekle"** ([Takvime ekle](etkinlik-ekleme.md)).
   - **"‹" / "›":** bir ay geri ya da ileri; Ocak'tan geri basınca önceki yılın Aralık'ı, Aralık'tan ileri basınca sonraki yılın
     Ocak'ı. Seçili gün temizlenir, gün ayrıntısı kapanır.
   - **"Bugün":** bugünün ayına döner, bugünü seçer ve gün ayrıntısını açar.
   - **Yıl seçici:** gösterilen yılın 3 öncesinden 3 sonrasına (2026'dayken 2023–2029). Yıl değişir, ay aynı kalır.
2. Izgaranın başında gün adları: **"Pzt Sal Çar Per Cum Cmt Paz"** (Cmt ve Paz ana renkte). Hafta Pazartesi başlar; ayın ilk gününe
   kadar boş kutular.
3. Her gün bir düğmedir. İçinde:
   - **gün numarası;**
   - **ders sayısı** ("6 ders"): öğrencide sınıfının, öğretmende kendi programından o haftanın gününe düşen ders sayısı (velide
     çocuğun sınıfı; müdür ve servisçide yok);
   - **renkli noktalar** (en çok 4; her kayıt bir nokta, üstüne gelince başlığı görünür): turuncu ödev teslimi, ana renk tatil, mavi özel
     gün, yeşil etkinlik, kırmızı sınav, mor toplantı;
   - **tatil ya da özel günün adı** (ör. "Cumhuriyet Bayramı"), o gün birden çoksa ilki.
4. Kutuların görünüşü: hafta sonu açık gri zeminli, tatil günü ana rengin açık tonunda, **bugün** kalın ana renk çerçeveli (numarası da
   ana renkte), **seçili gün** ana renk çerçeve ve hafif gölgeyle.
5. Izgaranın altında renk açıklaması: **"Ödev teslimi"**, **"Tatil"**, **"Özel gün"**, **"Etkinlik"**, **"Sınav"** ("Toplantı"
   açıklamada yok; bilinen açık).
6. Bir güne bas → kutu seçili olur (ızgara yeniden çizilmez), altında gün ayrıntısı açılır.
7. Telefonda (720 piksel altı) kutular küçülür; tatil adı ve ders sayısı gizlenir, noktalar kalır.

### Tasarımda (Tasarım 1 önizlemesi; bütün takvimi olan roller)

1. Takvim kutusunun üst satırı: **"«"** (Önceki yıl), **"‹"** (Önceki ay), ortada **"Ekim 2026"**, **"›"** (Sonraki ay), **"»"**
   (Sonraki yıl). Düğmelerin üstüne gelince adları çıkar; ekran okuyucu ok düğmesini "Önceki ay: Eylül 2026" diye okur. Başka bir
   aya ya da yıla geçince seçili gün: o ay içinde bulunduğun aysa **bugün**, değilse **ayın 1'i**. "Bugün" düğmesi ve yıl açılır listesi
   yoktur; ok düğmeleri basılınca odak düğmede kalır.
2. Gün adları **"Pzt … Paz"**. Hafta sonu kutuları hafif gri; tatil gününün numarası ana renkte; **bugünün** numarası dolu yuvarlak
   içinde; **seçili gün** parlak, kalın ana renk çerçeveli ve hafif gölgeli (kullanıcının 1 Ekim isteği).
3. Kutuda o günün **en çok iki kaydının başlığı** renkli şerit olarak yazar; fazlası **"+2 daha"** gibi. Bir günün kayıtları: önce bütün
   gün süren kayıtlar (tatil, özel gün, bütün gün etkinlik), sonra saate göre.
4. Renkler: **Ödev** kırmızı, **Sınav** mavi, **Duyuru** yeşil, **Resmî tatil** ana renk, **Özel gün** turuncu, **Toplantı** lacivert,
   **Etkinlik** mor, **Etüt** camgöbeği, **Hatırlatıcı** gri.
5. Kutulara düşenler (rolüne göre; [Takvim kimin gözünden](kimin-takvimi.md)): ödevlerin son günü, sınavlar, toplantılar, etütler, okul
   etkinlikleri, ajandaya eklenmiş duyurular, resmî tatiller ve özel günler, okulun eğitim yılı günleri
   ([Tatiller ve özel günler](tatiller-ve-ozel-gunler.md)) ve **açık hatırlatıcılarının o aydaki her tekrarı**
   ([Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md)).
6. Ekran okuyucu her kutuyu "1 Ekim Perşembe, bugün, 3 kayıt" diye okur.
7. Güne bas → seçilir, sayfa **kaymaz**; seçili günün listesi yanda ya da altta yenilenir ([Gün ayrıntısı](gun-ayrintisi.md)).
8. Telefonda (640 piksel altı) başlıklar ince renkli çizgilere döner, "+2 daha" gizlenir.
9. Ajanda sekmesindeki süzgeç kutucukları ay görünümünü **etkilemez**; takvimde her şey görünür
   ([Ajandanın süzgeç kutucukları](ajanda-suzgeci.md)).

### Öğrenci

- **Bugünkü site:** kendi ödevlerinin son günleri (turuncu nokta), sınıfının ders sayısı, tatiller ve okulun kayıtları.
- **Tasarımda:** ödevlerin, sınavların, davetli olduğun toplantılar, etütlerin, duyurular ve hatırlatıcıların. Önizlemede 1 Ekim
  kutusunda iki ödev ve bir hatırlatıcı var: saat sırasıyla ilk ikisinin başlığı ve "+1 daha".

### Veli

- **Bugünkü site:** seçili çocuğunun (şeritte "Hepsi" seçiliyse ilk çocuğunun) takvimi; çocuğun sınıfının ders sayısı ve çocuğun
  okulunun kayıtları.
- **Tasarımda:** açık olduğun çocuk oturumunun takvimi; öbür çocuğunki onun oturumunda.

### Öğretmen ve ek görevli çalışan

- **Bugünkü site:** verdiğin ödevlerin son günleri ve kendi programından ders sayısı. Bir öğrencinin portalını açtıysan o öğrencinin
  takvimi.
- **Tasarımda:** verdiğin ödevler (başlıkta sınıf: "7-A · Kesirlerle toplama — alıştırma 3"), açtığın sınavlar, toplantılar, kendi
  etütlerin.

### Müdür

- **Bugünkü site:** okuldaki **bütün** ödevlerin son günleri (ders sayısı yok) ve okulun kayıtları; üst çubukta "Etkinlik ekle".
- **Tasarımda:** ödev yok (müdür ödev kontrol etmez); okulun sınavları, toplantıları, bütün etütler, okul etkinlikleri, gönderdiğin
  duyurular.

### Servisçi

- **Bugünkü site:** yalnız tatiller, özel günler ve okulun kayıtları (ödev ve ders yok).
- **Tasarımda:** tatiller, okul etkinlikleri ve sana gelen duyurular (ör. "Pazartesi sabah seferi 10 dakika erken").

## Kurallar ve sınırlar

- **Yıl ve ay sınırı:** sunucu yalnız 2000–2100 yıllarını ve 1–12 aylarını kabul eder; dışında **"Yıl (2000-2100) ve ay (1-12)
  gerekli"**.
- **Kutuda en çok 4 nokta** (bugünkü site). Kalabalık bir günün öbür kayıtları yalnız gün ayrıntısında görünür. Tasarımda iki başlık ve
  "+N daha".
- **Ödev noktası** yalnız son günü o ayın içinde olan ödevler içindir. Okulda "Ödevler" bölümü kapalıysa takvimde ödev yoktur. Ödevler
  baktığın eğitim yılına göre süzülür (geçmiş yıla bakarken o yılın ödevleri).
- **Ders sayısı haftalık programdan gelir:** tatil günlerinde de yazar (ör. 29 Ekim kutusunda "6 ders"); program o günün tatil olduğunu
  bilmez.
- **Çok günlük okul kaydı** (ör. 3 günlük gezi) her gününe ayrı nokta olarak düşer.
- **Okulun kayıtları yıla göre süzülmez:** geçmiş yıla bakan da o ayın bütün kayıtlarını görür (tarihler zaten yıla göre ayrık).
- **"Bugün" iki ayrı saatle hesaplanır:** ızgarada vurgulanan "bugün" sunucunun tarihidir; ilk açılışta gösterilen ay tarayıcının
  saatidir. "Bugün" düğmesi seçili günü dünya saatiyle (UTC) yazar: Türkiye saatiyle 00:00–02:59 arasında **dünü** seçer (bilinen
  açık; ayın 1'inde bu saatlerde ayrıntı önceki ayın son gününü anlatır).
- **Yıl seçici seçili günü silmez:** yıl değişince ızgara yeni yılı gösterir ama altta eski yılın seçili gününün ayrıntısı yeniden
  açılır (bilinen açık).
- **Tasarımda** hatırlatıcılar ay görünümünde her tekrarıyla görünür (her gün olan hatırlatıcı her kutuda); kapalı hatırlatıcı görünmez.

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Gün ayrıntısı](gun-ayrintisi.md) · [Takvim kimin gözünden](kimin-takvimi.md) ·
[Takvime ekle](etkinlik-ekleme.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) · [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) ·
[Ajanda](ajanda.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) · [Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Ödevin tarih ve saati](../odev/tarih-ve-saat.md) (ödev verirken açılan takvim) · [Ödev listesi](../odev/liste.md) ·
[Sınav planlama](../sinav/sinav-planlama.md) · [Toplantılar listesi](../toplanti/toplantilar.md) · [Etütlerim](../etut/etutlerim.md) ·
[Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md) · [Ders programım](../ders-programi/programim.md) ·
[Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (`SAYFALAR.takvim`: üst çubuk, ızgara, noktalar,
  açıklama satırı; `AY_ADLARI`, `GUN_BASLIK`), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  (`takvim-ay`, `takvim-bugun`, `takvim-gun`), [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`21-takvim.css`: renkler,
  `.bugun`, `.secili`, `.tatil`, 720 piksel kuralı).
- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`GET /api/takvim?yil=&ay=&studentId=`: `basSutun`, `gunler`,
  `dersSayisi`, `olaylar`, `tatil`, `bugun`, `yonetebilir`), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md)
  (`takvimAraligi`), [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) (`takvimIcin`),
  [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md) (ödevlerin yıla süzülmesi).
- Testler: [testler/test-takvim.md](../../testler/test-takvim.md) (Pazartesi başlangıcı, sabit günler, ders programının takvime
  düşmesi), [testler/test-ozellikler.md](../../testler/test-ozellikler.md) (ödev kapalıyken takvimde ödev yok).
- Tasarımdaki ok düğmeleri, başlıklı kutular ve yeni kayıt türleri Tasarım 1 önizlemesindedir; kodlanınca bu bölüm güncellenir.

## Sık sorulanlar

- **Bir günün bütün kayıtlarını neden göremiyorum?** Kutuya en çok 4 nokta sığar (tasarımda iki başlık ve "+N daha"). Güne bas; gün
  ayrıntısında hepsi listelenir.
- **Sınavım takvimde neden yok?** Bugünkü sitede takvimdeki "Sınav" yalnız müdürün elle eklediği bir kayıttır; Sınavlar bölümündeki
  sınavlar takvime kendiliğinden düşmez. Tasarımda planlanan her sınav takvime girer ([Sınav planlama](../sinav/sinav-planlama.md)).
- **29 Ekim'de neden "6 ders" yazıyor?** Ders sayısı haftalık programdan sayılır ve tatili bilmez. O gün ders yoktur.
- **"Bugün"e gece bastım, dün seçildi.** Bilinen açık: gece 03:00'e kadar "Bugün" düğmesi bir önceki günü seçer.

## Sırada

- Arayüz önizlemesi (Tasarım 1): yıl okları, başlıklı gün kutuları, parlak seçili gün, güne basınca sayfanın kaymaması.
- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: planlanan
  sınavlar ve ajandaya eklenen duyurular ızgaraya kendiliğinden düşer.
- Toplantılar + sınıfın uzaktan ders bağlantısı + tahta hesabı: açılan toplantılar takvime kendiliğinden girer.
- Etüt planlama: etütler takvime ve ajandaya girer.
- Güvenlik denetimi: takvimdeki "bugün" ve "yaklaşan" hesaplarının Türkiye saatine bağlanması.
- Çok dil: ay ve gün adlarının çevirisi.
