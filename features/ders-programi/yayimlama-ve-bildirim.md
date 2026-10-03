# Ders programı · Programı yayımlama ve haber verme

**Durum:** Kodda var; tasarımda ek olarak "Kaydet ve yayımla" düğmesi, "taslak" / "yayımlandı" durumu, programın hangi tarihten geçerli olduğu ve yayımlanınca öğrencilere ve öğretmenlere giden bildirim.

Program değişince kimin, ne zaman ve nasıl haberdar olduğu: bugün değişiklik anında geçerli olur ve yalnız öğretmene ders eklendiğinde
haber gider; tasarımda program önce taslak kalır, "Kaydet ve yayımla" ile herkese duyurulur.

## Ne işe yarar

Kullanıcı 29 Ağustos'ta "ders başlamadan önce falan öğretmenede bilgi gelsin" dedi; öğretmen programını ve dersini kaçırmasın. Ama
program kurulurken yüzlerce küçük değişiklik olur; her birinde öğrencilere ve öğretmenlere bildirim gitse kimse zili okumaz. Kullanıcı
fazladan bildirim istemiyor (25 Eylül). Bugünkü site bu yüzden öğretmene günde en çok bir "programına ders eklendi" bildirimi gönderir.
Tasarımda müdür programı bitirince tek seferde yayımlar; bildirim de o zaman gider.

## Nereden açılır

- **Bugün:** ayrı bir düğme yok. [Ders programı kurma](program-kurma.md) sayfasında yaptığın her ekleme, değişiklik ve silme kaydedildiği
  anda herkesin programında görünür. Bildirimler zilde (bildirim paneli) ve telefon bildirimi açıksa telefonda çıkar
  ([Bildirim paneli](../bildirim/bildirim-paneli.md)).
- **Tasarımda (Tasarım 1 önizlemesi):** Ders programı sayfasında "Dersler" kutusunun altındaki **"Kaydet ve yayımla"** düğmesi.

## Adım adım

### Müdür

Bugünkü site:

1. Ders Programı sayfasında bir ders saati ekle ve "Kaydet".
2. Dersin öğretmeni atanmışsa o öğretmene bildirim gider:
   **"Ders programına yeni ders saatlerin eklendi. Programından bakabilirsin."**
3. Aynı gün aynı öğretmene yeni saatler eklemeye devam edersen ikinci bildirim gitmez (günde bir).
4. Ders saatini başka güne ya da saate taşıman, silmen, Excel'den toplu eklemen bildirim göndermez.
5. Programda bir "taslak" yoktur; eklediğin ders öğrencinin ve öğretmenin programında hemen görünür.

Tasarımda (Tasarım 1 önizlemesi):

1. Izgarada dersleri koy, taşı, kaldır; program kutusunun başlığında **"taslak"** yazar.
2. **"Kaydet ve yayımla"**ya bas.
3. Bütün dersler haftalık saatleri kadar yerleştiyse: **"7-A programı yayımlandı; 5 Ekim'den geçerli, öğrencilere ve öğretmenlere
   bildirim gitti."**
4. Eksik yerleşen ders varsa yine kaydedilir ama ileti uyarır: **"7-A kaydedildi; Matematik, Fen Bilimleri saatleri henüz tam
   yerleşmedi."**
5. Başlıkta **"yayımlandı · 10:41"** (yayımlanma saati) görünür.
6. İşlem kaydına **"… ders programını yayımladı"**, ayrıntı **"7-A · 5 Ekim'den geçerli"** yazılır.
7. Programın geçerli olduğu gün önizlemede sabit bir örnek tarihtir ("5 Ekim", önizlemenin "bugün"ü olan 1 Ekim Perşembe'den sonraki
   pazartesi); yayımlamada tarih seçilmez, nasıl belirleneceği kararlaştırılmadı. Excel'den yüklemede ise **"Geçerli"** tarihi seçilir
   ([Programı Excel'den kurma](excelden-program.md)).

### Çalışan

Programı kurma yetkisi olan çalışan (bugün ek rollü öğretmen) müdür gibi; onun eklediği ders saatleri için de öğretmene aynı bildirim
gider. Tasarımda o da "Kaydet ve yayımla"yı kullanır.

### Öğretmen

Bugünkü site:

- Programına ders eklenince zilinde **"Ders programına yeni ders saatlerin eklendi. Programından bakabilirsin."**; basınca **Ders
  Programım** açılır ([Ders programım](programim.md)).
- Her sabah dersin varsa tek özet: **"Bugün 4 dersin var: 09:20 7-A Matematik, 10:10 7-B Matematik, …"** (07:00–12:00 arası ilk
  çalışmada, günde bir; [Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md)).
- Bir derse öğretmen olarak atanınca (Sınıflar → Dersler): **"7-A · Matematik dersi sana atandı."**
  ([Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md)).
- Ders saatin taşınır ya da silinirse bildirim gelmez; programını açınca görürsün.

Tasarımda: program yayımlanınca bildirim; ayrıca her dersten 10 dakika önce **"3. ders 10 dakika sonra başlıyor"**
([Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md)).

### Öğrenci

Bugün programla ilgili bildirim almaz; programını "Ders Programı"nda görür. Sınıfa yerleştirilince gelen "7-A sınıfına yerleştirildin."
bildirimi programın değil sınıfın bildirimidir.

Tasarımda: program yayımlanınca bildirim alır. Önizlemedeki öğrenci bildirimlerinde bir de "Ders değişikliği: Cuma 4. ders Türkçe
yerine Matematik" ("Selin Arı izinli; 2 Ekim Cuma 11:00–11:40 dersini Ayşe Kaya alacak") örneği var; bu örnek veridir: tek bir dersi
bir günlüğüne değiştirme ekranı ne bugün var ne de kararlaştırılmış bir iş.

### Veli

Bugün programla ilgili bildirim almaz. Tasarımdaki yayımlama iletisi "öğrencilere ve öğretmenlere" der; veliye gidip gitmeyeceği
yazılmamış.

## Kurallar ve sınırlar

- **Kime:** yalnız dersin öğretmenine; öğretmeni atanmamış derste kimseye.
- **Ne zaman:** yalnız elle **ekleme**de ("Ders ekle" → "Kaydet"). Düzenleme (taşıma), silme ve Excel'den toplu ekleme bildirim
  göndermez.
- **Günde bir:** aynı öğretmene aynı gün yalnız ilk eklemede gider. "Gün" sunucuda UTC tarihine göre sayılır; Türkiye saatiyle gece
  03:00'te döner.
- **Bağlantı:** bildirime basınca `#/programim` (Ders Programım) açılır.
- **Sabah özeti:** öğretmen başına günde bir, 07:00–12:00 arasında; bugün tatil günlerine bakılmaz.
- **Taslak yok (bugün):** her kayıt anında geçerli; "geri al" yok.
- **Bildirimlerin saklanması ve telefona gitmesi** bildirim sisteminin genel kurallarına bağlı ([Otomatik bildirimler](../bildirim/otomatik-bildirimler.md),
  [Bildirim metinleri](../bildirim/bildirim-metinleri.md)).
- **İşlem kaydı:** bugün yayımlama diye bir kayıt yok; elle değişiklikler de yazılmaz (yalnız Excel'den ekleme).

Tasarımda: program "taslak"tan "yayımlandı"ya geçer; yayımlama işlem kaydına yazılır; eksik yerleşen dersler iletide adıyla sayılır.
Taslakken öğrencinin ve öğretmenin eski programı mı yoksa hiç program mı gördüğü önizlemede gösterilmiyor; kodlanırken netleşmeli.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Ders programı kurma](program-kurma.md) — bildirimi doğuran ekleme; tasarımdaki düğme.
- [Ders programım](programim.md) — bildirime basınca açılan sayfa.
- [Programı Excel'den kurma](excelden-program.md) — toplu eklemede bildirim yok; tasarımda "Geçerli" tarihi.
- [Okulun ders saatleri](ders-saatleri.md) — "3. ders 10 dakika sonra başlıyor".
- [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md), [Çakışma uyarısı](cakisma-uyarisi.md), [Programı Excel olarak indirme](programi-indirme.md).

**İlgili:**

- [Ders başlamadan öğretmene bildirim](../bildirim/ders-oncesi-bildirim.md), [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md),
  [Bildirim metinleri](../bildirim/bildirim-metinleri.md), [Bildirim paneli](../bildirim/bildirim-paneli.md).
- [Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `schedule-add`: `depo.genel.ilkKezOlanlar(['program:<öğretmen>:<UTC
  günü>'])` ile günde bir `bildir(…, 'Ders programına yeni ders saatlerin eklendi. Programından bakabilirsin.', '#/programim')`;
  `schedule-update`, `schedule-delete` ve `aktarim-ice` bildirmez; `lesson-update`: "… dersi sana atandı.".
- Sabah özeti: [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) (`dersOzetleri`, 07:00–12:00, en çok 4 ders adı, "ve N ders daha").
- Sabah özetinin okuduğu dersler: [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) (`baslamakUzereOlanlar`);
  bildirime basınca açılan sayfa: [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (üç ders saati eklenince öğretmene en çok bir bildirim).

## Sık sorulanlar

- **Programı değiştirdim, öğretmenler haberdar mı?** Yalnız yeni ders saati eklediysen ve o gün o öğretmene ilk eklemeyse. Taşıma ve
  silme için mesajla haber ver.
- **Öğrencilere programın hazır olduğunu nasıl duyururum?** Bugün otomatik bildirim yok; sınıfa duyuru gönder
  ([Duyuru](../mesaj/duyuru.md)). Tasarımda "Kaydet ve yayımla" bildirim gönderecek.
- **Programı yarım hâliyle öğrenciler görüyor mu?** Bugün evet; her ekleme hemen görünür.

## Sırada

- Tasarım 1: "Kaydet ve yayımla", "taslak" / "yayımlandı", geçerlilik tarihi, yayımlanınca öğrencilere ve öğretmenlere bildirim.
- Bildirim: her dersten 10 dakika önce öğretmene ayrı bildirim (tasarım; sabah özetiyle birlikte kalıp kalmayacağı yazılmadı).
- Mesaj ayarları ve ajanda işi: bildirim panelinin sekmeleri.
