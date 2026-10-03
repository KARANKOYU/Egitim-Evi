# Devamsızlık ve yoklama · "Gelmedi" bildirimi

**Durum:** Kodda var; tasarımda ek olarak kısa başlık + tam cümle biçimi ("Elif bugün Matematik dersine gelmedi"), yanlış yoklama düzeltilince "Yoklama düzeltildi: …" ve durum değişince "Yoklama güncellendi: …" bildirimleri, velinin bildiriminin çocuğun "Devamsızlık" sayfasını açması, bildirim panelinde "Devamsızlık" sekmesi ve öğretmenin kayıttan sonra velilere giden bildirimleri görmesi.

Yoklamada gelmedi, geç geldi ya da izinli yazılan öğrenciye ve onaylı velilerine giden bildirim.

## Ne işe yarar

Veli çocuğunun derse girmediğini aynı gün, okulu aramadan öğrenir. Kullanıcının 26 Eylül sözü: yoklamada **"gelmedi" yazılırsa veliye
"çocuğunuz bugün şu derste (ders ismi) şu saatte gelmedi"** gitsin. Öğrenci de kendi kaydını bildirimden görür. Açılış sayfasındaki
tanıtım: "Geldi, gelmedi, izinli; veli aynı gün öğrenir."

## Nereden açılır

- Bildirimi kimse elle göndermez; şu üç kayıt kendiliğinden üretir:
  - öğretmenin **"Yoklama"** sayfasında **"Yoklamayı kaydet"** ([Ders yoklaması](ders-yoklamasi.md));
  - **"Ders Programım"**daki yoklama penceresinde **"Kaydet"** ([Ders programından yoklama](programdan-yoklama.md));
  - müdürün **"Devamsızlık"** ekranında bir ders saatinin açılır kutusunu değiştirmek ([Okulun devamsızlığı](okulun-devamsizligi.md)).
- Öğrenci ve veli bildirimi üst şeritteki **bildirim zili**nde ([Bildirim paneli](../bildirim/bildirim-paneli.md)) ve izin verdiyse
  telefon bildirimi olarak görür ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- Bildirime basınca: öğrencide **"Devamsızlığım"**, velide **"Çocuklarım"** açılır.

Tasarımda: öğretmenin bildirimi ürettiği tek yer ders programındaki yoklama penceresidir (ayrı "Yoklama" sayfası kalkar, kullanıcı
3 Ekim 19:20; [Ders programından yoklama](programdan-yoklama.md)); velinin bildirimi çocuğunun **"Devamsızlık"** sayfasını açar (her
çocuk ayrı oturum); bildirim panelinde **"Devamsızlık"** sekmesi vardır (öğrenci, veli, öğretmen ve müdürde) —
[Bildirim sekmeleri](../bildirim/sekmeler.md).

## Adım adım

### Öğrenci (bugünkü site)

Bildirim metni (ders saati yalnız ders programındaki pencereden kaydedilince yazar):

- **"Bugün 09:20 Matematik dersi: Gelmedi"**
- **"Bugün 09:20 Matematik dersi: Geç geldi"**
- **"Bugün 09:20 Matematik dersi: İzinli"**
- "Yoklama" sayfasından ya da müdürün düzeltmesinden: **"Bugün Matematik dersi: Gelmedi"** (saatsiz).
- Başka bir günün yoklaması: **"25.09.2026 Matematik dersi: Gelmedi"**.

Basınca **"Devamsızlığım"** açılır ([Devamsızlığım](devamsizligim.md)).

### Veli (bugünkü site)

Her onaylı veliye kendi metniyle:

- **"Çocuğunuz Elif Yılmaz bugün saat 09:20 Matematik dersine gelmedi (izinsiz)."**
- **"Çocuğunuz Elif Yılmaz bugün saat 09:20 Matematik dersine gelmedi (izinli)."**
- **"Çocuğunuz Elif Yılmaz bugün saat 09:20 Matematik dersine geç geldi."**
- Saatsiz kayıtta: **"Çocuğunuz Elif Yılmaz bugün Matematik dersine gelmedi (izinsiz)."**
- Başka günde: **"Çocuğunuz Elif Yılmaz 25.09.2026 Matematik dersine geç geldi."**

Basınca **"Çocuklarım"** açılır. Öğrenciye giden her bildirimin veliye giden genel kopyası ("Elif Yılmaz · …") bu bildirimde **gitmez**;
veli yalnız yukarıdaki kendi metnini alır ([Velinin bildirimleri](../bildirim/velinin-bildirimleri.md)).

### Öğretmen ve müdür (bugünkü site)

Bildirim almazlar; kaydın sonucunu ekranda görürler: "Yoklama" sayfasında **"3 devamsızlık kaydedildi."**, ders programı penceresinde
**"Yoklama kaydedildi. Gelmeyen 2 öğrencinin velisine bildirim gitti."**, müdür ekranında **"Kaydedildi."**

### Tasarımda (Tasarım 1 önizlemesi)

**Veli** — başlık kısa, ayrıntı tam cümle:

- **"Elif bugün Matematik dersine gelmedi"** / **"Çocuğunuz Elif Yılmaz bugün saat 10:10 Matematik dersine gelmedi (izinsiz)."**
- yanlış yoklama "Geldi"ye çevrilince: **"Elif'in yoklaması düzeltildi"** / **"Yoklama düzeltildi: çocuğunuz Elif Yılmaz bugün saat 10:10
  Matematik dersine geldi."**
- izinsiz ↔ izinli değişince: **"Yoklama güncellendi: çocuğunuz Elif Yılmaz bugün saat 10:10 Matematik dersine gelmedi (izinli)."**
- geç kalınca: **"Can derse geç kaldı"** / **"1. ders · 5 dakika"**.
- bu haftanın geçmiş bir günündeki ders ders programından alınınca ya da düzeltilince gün tarihle yazar: **"Elif 30 Eylül Çarşamba
  Matematik dersine gelmedi"** / **"Çocuğunuz Elif Yılmaz 30 Eylül Çarşamba saat 12:40 Matematik dersine gelmedi (izinli)."**
- Basınca o çocuğun **"Devamsızlık"** sayfası açılır; bildirim panelinde **"Devamsızlık"** sekmesinde durur. Velinin ana sayfasındaki
  **"Bugün olanlar"** kutusunda da görünür (**"Derse geç kaldı · 1. ders · 5 dakika · Geç"**).

**Öğretmen** — kaydettikten sonra **"Yoklama kaydedildi"** penceresinde **"Velilere giden bildirimler (2)"** listesi: her satırda
**"Veli · Elif Yılmaz"** ve giden metin; bildirim gitmediyse **"Değişiklik yok; veliye yeni bildirim gitmedi."** ya da **"Herkes geldi;
veliye bildirim gitmedi."** ([Ders programından yoklama](programdan-yoklama.md)). Bildirim yalnız durumu bir önceki kayda göre değişen
öğrencinin velisine gider: yeni "Gelmedi" → "Çocuğunuz … gelmedi (…)"; "Gelmedi" → "Geldi" → "Yoklama düzeltildi: …"; izinli ↔ izinsiz →
"Yoklama güncellendi: …".

**Öğrenci** — tanımda öğrenciye de gider; önizlemenin öğretmen penceresi yalnız velilere gidenleri listeler (öğrencinin bildirim metni
için ayrı karar yok; bugünkü metin geçerli sayılır).

## Kurallar ve sınırlar

- **Kime:** öğrencinin kendisine ve **onaylı** velilerine (birden çok veli varsa her birine). Velisi olmayan öğrencide yalnız öğrenciye.
- **Ne zaman:** yalnız yeni durum **Gelmedi, Geç geldi ya da İzinli** ise ve durum o dersin o günkü **önceki kaydından farklıysa**.
  - Aynı yoklamayı yeniden kaydetmek bildirim üretmez.
  - "Gelmedi"den "İzinli"ye çevirmek yeni bildirim üretir ("… gelmedi (izinli).").
  - "Gelmedi"den "Geldi"ye dönüşte bugün **bildirim gitmez** (tasarımda "Yoklama düzeltildi" gider).
- **Saat:** yalnız ders programındaki pencere dersin başlangıç saatini gönderir; "Yoklama" sayfası ve müdürün düzeltmesi göndermez
  (metin saatsiz).
- **"Bugün":** yoklamanın günü sunucunun bugünüyse "bugün", değilse `GG.AA.YYYY` yazar.
- **Uzunluk:** bildirim metni en çok 300 karakterde kesilir.
- **Telefon:** aynı metin telefon bildirimi (Web Push) olarak da gider; Android uygulaması bildirimleri cihaz anahtarıyla yoklayarak alır.
- **Saklama:** zil bildirimleri bugün süresizdir (zil en yeni 100'ü gösterir), tasarımda 90 gün sonra silinir; devamsızlık kaydının
  kendisi silinmez
  ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- **İletideki sayı:** ders programı penceresinin "Gelmeyen N öğrencinin velisine bildirim gitti" iletisi penceredeki işaretleri sayar;
  bildirim gerçekte yalnız durumu değişen ve velisi olan öğrenciye gider.
- **Bölüm kapalı:** okul "Devamsızlık"ı kapattıysa yoklama alınamadığı için bildirim de gitmez.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Ders yoklaması](ders-yoklamasi.md) · [Ders programından yoklama](programdan-yoklama.md) ·
[Okulun devamsızlığı](okulun-devamsizligi.md) · [Devamsızlığım](devamsizligim.md) · [Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md) ·
[Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md).

**İlgili:** [Bildirim metinleri](../bildirim/bildirim-metinleri.md) · [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md) ·
[Bildirim paneli](../bildirim/bildirim-paneli.md) · [Bildirim sekmeleri](../bildirim/sekmeler.md) ·
[Telefon bildirimi](../bildirim/telefon-bildirimi.md) · [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md) ·
[Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) · [Etüt yoklaması](../etut/etut-yoklamasi.md) (etütte kendi
metni) · [Servise binmedi uyarısı](../servis/servise-binmedi-uyarisi.md) (servis tarafındaki karşılığı).

## Kod tarafı

- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) — `yoklamaMetni` (öğrenci ve veli metni, `VELI_DURUM`:
  "gelmedi (izinsiz)", "gelmedi (izinli)", "geç geldi"), `devamsizlikBildir` (öğrenciye `#/devamsizligim`, veliye `#/cocuklarim`; genel
  veli kopyası kapalı), `POST /api/devamsizlik/yoklama` (önceki kayıtla karşılaştırma), `POST /api/devamsizlik/isaretle`.
- Bildirim yazımı ve yayımı: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`cokluBildir`), veliler
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) (`veliHaritasi`), telefon [sunucu/push.md](../../sunucu/push.md).
- Ön yüz: ders saatini gönderen pencere [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) (`py-kaydet`).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (tekrar kayıtta yeniden gitmemesi, veliye tek "Çocuğunuz …"),
  [testler/test-siniflarim.md](../../testler/test-siniflarim.md) (saatli metin, izinliye çevirme).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yoklama (ders programından)", "Öğrencinin bildirimi veliye
  de gider").
- Tasarım: Tasarım 1 önizlemesinin öğretmen modülü (kayıt penceresi, düzeltme metinleri), veli oturumları (bildirim listesi), bildirim
  paneli sekmeleri.

## Sık sorulanlar

- **Öğretmen "Gelmedi"yi "Geldi" yaptı, bana haber gelmedi.** Bugün "Geldi"ye dönüş bildirim üretmez; tasarımda "Yoklama düzeltildi"
  bildirimi gelir. Devamsızlık sayfasında kayıt kalkmıştır.
- **Aynı ders için iki bildirim aldım.** Durum değişmiştir (ör. önce "gelmedi (izinsiz)", sonra "gelmedi (izinli)").
- **Bildirimde saat yok.** Yoklama ders programındaki pencereden değil "Yoklama" sayfasından alınmış ya da müdür düzeltmiştir.
- **Telefonuma gelmiyor.** Bu cihazda bildirim izni verilmemiş olabilir ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- **Veliye hangi bildirimler gider?** (açılış sayfasının Sık sorulanları) Çocuk bir derse gelmediğinde ya da geç geldiğinde
  "Çocuğunuz (adı) bugün saat ... dersine gelmedi" gibi bir bildirim gelir; izinli yazılınca da "… gelmedi (izinli)." gelir.
- **Geç kaldı bildirimi ne zaman gelir?** Bugün öğretmen "Yoklama" sayfasında "Geç geldi"yi seçince ya da müdür düzeltince ("… dersine
  geç geldi."). Tasarımda öğretmenin penceresinde "Geç" seçeneği yok; "Can derse geç kaldı" metni önizlemede var, kimin işaretleyeceği
  kararlaştırılmadı ([Ders yoklaması](ders-yoklamasi.md)).

## Sırada

- **Yoklamaya ders programından girilir** (kullanıcı 3 Ekim 19:20) — bildirimi üreten pencere ders programına taşınır; bu haftanın geçmiş
  dersleri için tarihli metin.
- **Öğretmen ekranlarının tasarımı** (Tasarım 1): "Yoklama düzeltildi" / "Yoklama güncellendi" bildirimleri ve kayıttan sonra giden
  bildirimlerin listesi.
- **Bildirim paneli sekmeler hâlinde** (kullanıcı 25 Eylül) — "Devamsızlık" sekmesi.
- **Velide her çocuk ayrı oturum** (kullanıcı 3 Ekim) — bildirimin çocuğun Devamsızlık sayfasını açması.
- **Okulun ders saatleri** — bildirimde "3. ders" gibi ders numarası.
- **Toplantılar + uzaktan ders bağlantısı** — "Gelmedi" işaretlenene "Dersin uzaktan bağlantısı açık — Katıl" bildirimi.
- **Çok dil** — bildirim metinleri kataloğa.
