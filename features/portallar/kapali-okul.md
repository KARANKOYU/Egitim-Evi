# Portallar · Kapalı okulun portalı

**Durum:** Kodda var; tasarımda ek olarak "okul kapalı", "Müdür bekliyor", "Giremiyor" gibi sözlerin kalkması, müdürsüz okulun
"Müdürü yok" diye anılması ve okulun yalnız son müdürü de giderse müdürsüz kalması.

Müdürü kaldırılmış bir okuldaki öğretmenlik ya da müdürlük portalının Portallarım'da soluk görünmesi ve yeni müdür atanana kadar
girilememesi.

## Ne işe yarar

Bir okulun müdürünü sistem yöneticisi kaldırınca okul silinmez: öğretmen ve öğrenci hesapları, ödevler, notlar durur. Ama okul
sahipsiz kalmasın diye "kapanır": yönetici yeni bir müdür atayana kadar o okulun portalına geçilemez. Bu belge kapalı okulun
portalının nasıl göründüğünü, hangi iletileri verdiğini ve nasıl yeniden açıldığını anlatır.

## Nereden açılır

Ayrı bir sayfası yoktur; portalın göründüğü her yerde etiketiyle çıkar:

- sol menüdeki **Portallarım** satırı ([Portallarım](portallarim.md));
- girişteki portal kartları ([Portal seçme ekranı](portal-secme-ekrani.md));
- **Ayarlar → "Portallarım"** kartı.

## Adım adım

### Öğretmen

1. Okulunun müdürü kaldırıldı. Sol menüde "Öğretmen · Test Ortaokulu" satırı **soluk** görünür; üzerine gelince "Okul şu an kapalı"
   yazar.
2. Girişteki kartında portalın adının ("Öğretmen") yanında turuncu **"okul kapalı"** etiketi; çizimi ve alt yazısı soluk.
3. Ayarlar → "Portallarım" kartında satırın yanında turuncu **"okul kapalı"** etiketi; **"Geç" düğmesi yoktur** ("Okuldan ayrıl"
   yine vardır).
4. Menüdeki satıra ya da karta basarsan tarayıcının uyarı kutusunda: "Bu okul şu an kapalı; sistem yöneticisi yeni müdürünü
   atayınca açılır."
5. Girişte kapalı okul "girilebilir" sayılmaz: tek portalın buysa doğrudan oraya girmezsin; hesabının ana sayfası o tek kartla açılır.
6. Yönetici okula yeni müdür atayınca satır normale döner, geçebilirsin.

Okulun adresi (`/school/<okul>`) kapalıyken çalışmaz ve okul, okul aramasında çıkmaz (yalnız açık okullar aranır) —
[Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md).

### Çalışan

Bugün öğretmenle aynı. Tasarımda "Çalışan · okul" portalı da aynı kurala uyar.

### Müdür

1. Yönetici seni müdürlükten kaldırırsa müdür hesabın (okuldaki müdür satırı) silinir, oturumların ve o satırın bildirimleri gider;
   okul kapanır.
2. Yetişkin hesabın ve öbür portalların durur.

Tasarımda (birden çok müdür): okul yalnız **son** müdür de kaldırılırsa müdürsüz kalır; son müdür panelden çıkarılamaz, kendisi
ayrılamaz. Son müdür hesabını silerse okul "Müdürü yok" olur; yöneticiye ve desteğe bildirim gider
([Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md), [Bu okuldan ayrıl](okuldan-ayrilma.md)).

### Yönetici

1. Yönetim → **Müdürler** listesinde müdürü siler: onay "Murat Şahin hesabı silinsin mi? (Test Ortaokulu) Okul kapanır, kimse
   giremez. Öğretmen ve öğrenci hesapları silinmez; Okullar > Okul aç ile okula yeni müdür atayabilirsin."
2. Okul "beklemede" duruma geçer. Yönetim panelinde müdürsüz okul **Okullar** listesinde turuncu **"Müdür bekliyor"**, onaylanmamış
   müdür satırı **Müdürler** listesinde turuncu **"Giremiyor"** etiketiyle görünür.
3. Yeni müdür atamak için **Okullar → "Okul aç"**: okulu yeniden seçer, yeni müdürün kişi koduyla "Bul" ve "Okulu aç". Sistem
   müdürsüz okulu tanır; okul eski adresini koruyabilir, disk sınırı verilmezse eskisi kalır. Okul yeniden açılır, müdüre "Test
   Ortaokulu okulunun müdürü olarak eklendin. Sol üstteki menüden okuluna geçebilirsin." bildirimi gider
   ([Okul açma](../yonetim/okul-acma.md), [Müdürler](../yonetim/mudurler.md)).
4. Kişinin o okulda zaten başka bir rolü varsa (ör. öğretmenlik) müdür yapılamaz: "Bu kişinin bu okulda zaten bir rolü var (ör.
   öğretmen). Önce o rolü okuldan çıkar."

Tasarımda (kullanıcı 29 Eylül: "onay bekleme değil, müdür atayarak"): müdürsüz okul okul gezgininde ve listede **"Müdürü yok"**
rozetiyle görünür, yanında **"Müdür ata"** (okulun düzenleme sayfasına, kişi koduyla) vardır; "bekliyor", "onay", "Giremiyor"
sözleri müdür ve okul için hiçbir ekranda ve iletide kalmaz; eski "beklemede" müdür ve okul kayıtları göçle "müdürü yok" durumuna
çevrilir (kişinin hesabı silinmez). Yeni müdürü yönetici ya da destek atar ([Okul gezgini](../yonetim/okul-gezgini.md),
[Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md)).

### Veli

Velinin portalları ("Veli · çocuğun adı") okul kapansa da her zaman girilebilir sayılır; "okul kapalı" etiketi yalnız okul
rollerinde (öğretmen, müdür) çıkar.

## Kurallar ve sınırlar

- **Ne zaman kapalı sayılır:** okulun durumu açık değilse (müdürü kaldırılmış). Ayrıca okul açık olsa da rol satırı onaylı değilse
  (eski usul başvurudan kalmış satır) portal yine girilemez.
- **İletiler** (portala geçerken, sunucu, 403):
  - "Bu okul şu an kapalı; sistem yöneticisi yeni müdürünü atayınca açılır." — okul kapalı;
  - "Bu role şu an girilemez." — okul açık ama satır onaylı değil.
- **Bilinen sorun:** "okul kapalı" etiketi ve "Okul şu an kapalı" ipucu, sebep ne olursa olsun girilemeyen her satırda çıkar; okul
  açık ama satırı onaysız (eski usul) kişide yanıltıcıdır. Bu kalıntılar planlı temizlikle kalkacak.
- **Kapalı satır basılabilir:** menüdeki ve ana sayfadaki kapalı satır/kart tıklanabilir; sonuç uyarı kutusudur. Ayarlar kartında
  "Geç" hiç çıkmaz.
- **Veri silinmez:** okul kapanınca öğretmen ve öğrenci hesapları, ödevler, notlar durur; okul yeniden açılınca kaldığı yerden
  sürer.
- **Tasarımda:** son müdür çıkarılamaz ve ayrılamaz; okul ancak son müdür hesabını silerse müdürsüz kalır.

Kullanıcı 1 Ekim'de çizilen oturum ekranında bu etiketleri sordu ("müdür ne onay bekliyor, okul kapalı ne" anlamında). Tasarım 1
önizlemesinin portal listesinde "okul kapalı" ya da "onay bekliyor" etiketi yoktur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Portallarım](portallarim.md), [Portal seçme ekranı](portal-secme-ekrani.md) — etiketin göründüğü yerler.
- [Portala geçiş](portala-gecis.md) — geçişte dönen iletiler.
- [Bu okuldan ayrıl](okuldan-ayrilma.md) — son müdürün ayrılamaması (tasarım).

**İlgili:**

- [Müdürler](../yonetim/mudurler.md), [Okul açma](../yonetim/okul-acma.md) — yöneticinin müdür kaldırması ve yeni müdür ataması.
- [Okul gezgini](../yonetim/okul-gezgini.md), [Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md) — tasarımdaki "Müdürü yok" ve
  "Müdür ata".
- [Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md), [Müdür yap](../ogretmenler-calisanlar/mudur-yapma.md).
- [Sayfa bulunamadı ve Okul bulunamadı](../acilis-sayfasi/bulunamadi-sayfalari.md) — kapalı okulun adresi.

## Kod tarafı

- Ön yüz: [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — `portalMenusu` (`kapali` sınıfı,
  `title="Okul şu an kapalı"`), `portalAnaSayfasi` ("okul kapalı" etiketi), `portalYonetimKarti` ("Geç" yok);
  [public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) — müdür silme onayı, "Giremiyor", "Müdür bekliyor";
  CSS `28-yetiskin-hesap.css` (`.portal-link.kapali`, `.portal-kart.kapali`).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `kisilikListesi` (`girilebilir`: satır onaylı VE okul açık),
  `girisOturumu`; [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `kisilik/gec`'teki 403 iletileri;
  [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md) — `principal-delete` (okul beklemeye, müdür satırı silinir);
  [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md) — müdürsüz okulu yeniden açma;
  [sunucu/veri/depo/okullar.md](../../sunucu/veri/depo/okullar.md) — adreste ve aramada yalnız açık okullar.
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) — okul açma ve müdür işleri.

## Sık sorulanlar

- **Okulumun satırı soluk, ne oldu?** Okulunun müdürü kaldırılmış. Sistem yöneticisi yeni müdür atayınca açılır; bu arada okulun
  verisi silinmez.
- **Okul kapalıyken okuldan ayrılabilir miyim?** Evet, Ayarlar → "Portallarım"daki "Okuldan ayrıl" kapalı okulda da durur.
- **Çocuğumun okulu kapandı, veli portalım ne olur?** Veli satırın etiketlenmez, girilebilir görünür.

## Sırada

- Paneller (iş 5): birden çok müdür (okul yalnız son müdür giderse müdürsüz), "Müdürü yok" rozeti ve "Müdür ata", "bekliyor / onay /
  Giremiyor" kalıntılarının kalkması, eski "beklemede" kayıtların göçü.
- Kullanıcının 29 Eylül kararı: son müdür hesabını silerse okul "Müdürü yok" olur, yöneticiye ve desteğe bildirim.
