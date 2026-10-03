# Bildirimler

Eğitim Evi'nde bir şey olunca (öğretmen ödev verince, sonuç açıklanınca, derse gelinmeyince, mesaj ya da duyuru gelince, servis eve
yaklaşınca, okul seni ekleyince) ilgili kişiye kısa bir bildirim yazılır. Bildirimler sağ üstteki **zilde** toplanır: rozet okunmamış
sayısını gösterir, satıra basınca ilgili sayfa açılır; öğrenciye giden her bildirimin bir kopyası başında çocuğun adıyla onaylı
velisine de gider; bazı bildirimler (öğretmenin sabah ders özeti, "yarın ödevin var", servis yaklaşıyor, dosya alanı doldu) zamanı
gelince kendiliğinden gider. Telefon bildirimini açan kişiye aynı bildirim Eğitim Evi kapalıyken de telefonuna düşer (tarayıcıdan
Web Push ya da Android uygulamasının kendi yoklaması). Bunların hepsi bugün kodda var. Kullanıcının kararlaştırdığı tasarımda (Tasarım
1 önizlemesi ve tanımlar) ek olarak: zil büyük, arkası kararan bir panel olur ve **Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru ·
Servis** sekmelerine ayrılır (kullanıcı 25 Eylül: "daha düzenli sekmeler halinde"); zili açmak artık hepsini okundu saymaz, bildirimler
tek tek ya da "Tümünü okundu say" ile okunur; her satırda ayrıntı ve uzun tarih ("Ödev · 1 Ekim 2026 Perşembe 10:12") yazar; velide
her çocuk ayrı oturumdur ve bildirim kısa adla başlar ("Elif · …"); okul ve dershane gibi birden çok kurumda bildirimin başında kurum
adı yazar; öğretmene her dersten 10 dakika önce bildirim gelir; sayfanın başında "Bildirimlere izin ver" şeridi çıkar; "Önemli"
bildirimler telefonda ayrı, sesli bir kanaldan gelir; bildirimler 90 gün sonra silinir.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Bildirim paneli (zil)](bildirim-paneli.md) | Zil, rozet, liste, satıra basınca açılan sayfa, kapanma; tasarımda büyük panel | Kodda var; tasarımda ek olarak sekmeler, ayrıntı satırı, uzun tarih, büyük panel |
| [Bildirim sekmeleri](sekmeler.md) | Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis; rol rol sekmeler; tür belirleme | Tasarlandı — henüz kodda yok |
| [Okundu sayma](okundu-sayma.md) | Zili açınca hepsinin okundu sayılması; tasarımda tek tek ve "Tümünü okundu say" | Kodda var; tasarımda ek olarak tek tek okundu sayma |
| [Zilin tazelenmesi (yoklama aralığı)](yoklama-araligi.md) | 5 dakikada bir soru, "değişmedi" cevabı, yöneticinin aralık ayarı | Kodda var; tasarımda ek olarak sayfa değişince sorma |
| [Bildirim türleri ve metinleri](bildirim-metinleri.md) | Rol rol bütün bildirimler, metinleri aynen, basınca açılan sayfa | Kodda var; tasarımda ek olarak başlık + ayrıntı ve yeni bildirimler |
| [Otomatik bildirimler](otomatik-bildirimler.md) | Sabah ders özeti, "yarın ödevin var", quiz sonucu, servis yaklaşıyor, dosya alanı, Aile sınırı | Kodda var; tasarımda ek olarak ödev, sınav, toplantı hatırlatmaları |
| [Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md) | Bugün sabah özeti; tasarımda her dersten 10 dakika önce | Kodda var; tasarımda ek olarak her dersten 10 dakika önce |
| [Öğrencinin bildirimi veliye de](velinin-bildirimleri.md) | Çocuğun adıyla kopya, kendi metniyle gelenler, basınca o çocuğun sayfası | Kodda var; tasarımda ek olarak her çocuk ayrı oturum, kısa ad |
| [Birden çok kurumda kurum adı](kurum-adi.md) | Okul + dershane: tek zil, başta kurum adı, başka portala geçiş | Tasarlandı — henüz kodda yok |
| [Telefon bildirimi ve bildirim izni](telefon-bildirimi.md) | Ayarlar'daki kart, izin, abonelik, Android uygulaması, iPhone; tasarımda izin şeridi | Kodda var; tasarımda ek olarak izin şeridi, Hesap ayarları → Bildirimler, "Önemli" kanal |
| [Saklama ve silinme](saklama-ve-silinme.md) | Son 100, silinmeme, hesapla silinme, abonelik ömrü; tasarımda 90 gün | Kodda var; tasarımda ek olarak 90 gün sonra silinme |

Okuma sırası:

- **Öğrenci:** [Bildirim paneli](bildirim-paneli.md) → [Bildirim türleri ve metinleri](bildirim-metinleri.md) →
  [Otomatik bildirimler](otomatik-bildirimler.md) → [Telefon bildirimi](telefon-bildirimi.md) → [Okundu sayma](okundu-sayma.md) →
  tasarımda [Bildirim sekmeleri](sekmeler.md), [Kurum adı](kurum-adi.md).
- **Veli:** [Öğrencinin bildirimi veliye de](velinin-bildirimleri.md) → [Bildirim paneli](bildirim-paneli.md) →
  [Bildirim türleri ve metinleri](bildirim-metinleri.md) → [Telefon bildirimi](telefon-bildirimi.md) → tasarımda
  [Bildirim sekmeleri](sekmeler.md), [Kurum adı](kurum-adi.md).
- **Öğretmen:** [Bildirim paneli](bildirim-paneli.md) → [Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md) →
  [Bildirim türleri ve metinleri](bildirim-metinleri.md) → [Telefon bildirimi](telefon-bildirimi.md) → [Okundu sayma](okundu-sayma.md).
- **Çalışan:** öğretmen gibi; [Bildirim türleri ve metinleri](bildirim-metinleri.md)'nde rol ve tasarımdaki çalışan bildirimleri.
- **Müdür:** [Bildirim paneli](bildirim-paneli.md) → [Bildirim türleri ve metinleri](bildirim-metinleri.md) →
  [Otomatik bildirimler](otomatik-bildirimler.md) → [Saklama ve silinme](saklama-ve-silinme.md).
- **Servisçi:** [Bildirim paneli](bildirim-paneli.md) → [Bildirim türleri ve metinleri](bildirim-metinleri.md) ("binmeyecek") →
  [Telefon bildirimi](telefon-bildirimi.md).
- **Yönetici:** [Zilin tazelenmesi](yoklama-araligi.md) (aralık ayarı) → [Bildirim türleri ve metinleri](bildirim-metinleri.md)
  (dosya alanı) → [Telefon bildirimi](telefon-bildirimi.md) → [Saklama ve silinme](saklama-ve-silinme.md).
- **Destek ve eğitmen (tasarım):** [Bildirim paneli](bildirim-paneli.md) → [Bildirim türleri ve metinleri](bildirim-metinleri.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgeye gider). "—": bu rol kullanmaz. "(tasarım)": henüz kodda yok.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Destek | Eğitmen |
|---|---|---|---|---|---|---|---|---|---|
| Bildirim paneli | [zilini kullanır](bildirim-paneli.md) | [çocuğunun bildirimlerini görür, o çocuğun sayfasını açar](bildirim-paneli.md) | [bulunduğu portalın zili](bildirim-paneli.md) | [öğretmen hesabıyla kullanır; tasarımda rolsüz çalışan da](bildirim-paneli.md) | [zilini kullanır](bildirim-paneli.md) | [zilini kullanır](bildirim-paneli.md) | [dosya alanı uyarılarını görür](bildirim-paneli.md) | [zilini kullanır (tasarım)](bildirim-paneli.md) | [zilini kullanır (tasarım)](bildirim-paneli.md) |
| Bildirim sekmeleri | [7 sekme (tasarım)](sekmeler.md) | [7 sekme (tasarım)](sekmeler.md) | [Servis'siz sekmeler (tasarım)](sekmeler.md) | [öğretmenin sekmeleri (tasarım)](sekmeler.md) | [Ödev'siz sekmeler (tasarım)](sekmeler.md) | [Mesaj · Duyuru · Servis (tasarım)](sekmeler.md) | — (karar yok) | — (karar yok) | [Mesaj · Duyuru (tasarım)](sekmeler.md) |
| Okundu sayma | [zili açınca hepsi okundu; tasarımda tek tek](okundu-sayma.md) | [kendi kopyaları ayrı okunur](okundu-sayma.md) | [aynı](okundu-sayma.md) | [aynı](okundu-sayma.md) | [aynı](okundu-sayma.md) | [aynı](okundu-sayma.md) | [aynı](okundu-sayma.md) | [aynı (tasarım)](okundu-sayma.md) | [aynı (tasarım)](okundu-sayma.md) |
| Zilin tazelenmesi | [5 dakikada bir, sekmeye dönünce hemen](yoklama-araligi.md) | [aynı](yoklama-araligi.md) | [aynı](yoklama-araligi.md) | [aynı](yoklama-araligi.md) | [aynı](yoklama-araligi.md) | [aynı](yoklama-araligi.md) | [aralığı ayarlar (1–30 dakika)](yoklama-araligi.md) | [aynı (tasarım)](yoklama-araligi.md) | [aynı (tasarım)](yoklama-araligi.md) |
| Bildirim türleri ve metinleri | [ödev, sonuç, yoklama, mesaj, servis yaklaşıyor…](bildirim-metinleri.md) | [kopyalar ve kendi metinleri (devamsızlık, servis, Aile)](bildirim-metinleri.md) | [ders özeti, etüt, ders atama, rol, mesaj](bildirim-metinleri.md) | [rol verildi; tasarımda "çalışan olarak eklendin"](bildirim-metinleri.md) | [öğretmen ayrıldı, nakil, dosya alanı, okul adresi](bildirim-metinleri.md) | ["binmeyecek" işaretleri](bildirim-metinleri.md) | [okulların dosya alanı; tasarımda e-posta servisi ve müdür atama bildirimleri](bildirim-metinleri.md) | [müdürü kalmayan okul bildirimini alır; talebe yanıtı kullanıcıya bildirim olur (tasarım)](bildirim-metinleri.md) | [videoya bildir, YouTube'dan kalkan video (tasarım)](bildirim-metinleri.md) |
| Otomatik bildirimler | ["yarın ödevin var", quiz sonucu, servis yaklaşıyor](otomatik-bildirimler.md) | [kopyaları, servis yaklaşıyor, Aile sınırı](otomatik-bildirimler.md) | [sabah ders özeti; tasarımda 10 dk önce](otomatik-bildirimler.md) | [derse giriyorsa ders özeti](otomatik-bildirimler.md) | [dosya alanı; tasarımda eylül yeni yıl sorusu](otomatik-bildirimler.md) | [kendi hatırlatıcıları](otomatik-bildirimler.md) | [dosya alanı](otomatik-bildirimler.md) | — | [YouTube denetimi (tasarım)](otomatik-bildirimler.md) |
| Ders başlamadan bildirim | — | — | [sabah özeti alır; tasarımda her dersten 10 dk önce](ders-oncesi-bildirim.md) | [derse giriyorsa alır](ders-oncesi-bildirim.md) | — | — | — | — | — |
| Öğrencinin bildirimi veliye de | [bildirimleri velisine kopyalanır](velinin-bildirimleri.md) | [çocuğun adıyla alır; tasarımda çocuk oturumunda](velinin-bildirimleri.md) | [verdiği ödev ve sonuç velilere de gider](velinin-bildirimleri.md) | [öğretmen gibi](velinin-bildirimleri.md) | [veliyse veli portalında alır](velinin-bildirimleri.md) | [servis bildirimleri yalnız veliye gider](velinin-bildirimleri.md) | — | — | — |
| Kurum adı | [okul + dershane (tasarım)](kurum-adi.md) | [çocuğu iki kurumdaysa (tasarım)](kurum-adi.md) | [iki kurumda portalı varsa (tasarım)](kurum-adi.md) | [aynı (tasarım)](kurum-adi.md) | [aynı (tasarım)](kurum-adi.md) | — | — | — | — (Eğitim Evi kurum sayılmaz) |
| Telefon bildirimi | [açar; Servis sayfasında öneri](telefon-bildirimi.md) | [açar; bütün portalları tek telefonda](telefon-bildirimi.md) | [açar](telefon-bildirimi.md) | [açar](telefon-bildirimi.md) | [açar](telefon-bildirimi.md) | [açar; Android uygulaması](telefon-bildirimi.md) | [açar](telefon-bildirimi.md) | [açar (tasarım)](telefon-bildirimi.md) | [açar (tasarım)](telefon-bildirimi.md) |
| Saklama ve silinme | [son 100 görünür; tasarımda 90 gün](saklama-ve-silinme.md) | [aynı](saklama-ve-silinme.md) | [portaldan ayrılınca o portalın bildirimleri silinir](saklama-ve-silinme.md) | [aynı](saklama-ve-silinme.md) | [aynı](saklama-ve-silinme.md) | [aynı](saklama-ve-silinme.md) | [aynı](saklama-ve-silinme.md) | [aynı (tasarım)](saklama-ve-silinme.md) | [aynı (tasarım)](saklama-ve-silinme.md) |

Notlar:

- **Çalışan** sütunu: bugün kodda ek görevli kişi öğretmen hesabıyla bir ek rol taşır ve öğretmenin bildirimlerini alır; rol verilince
  "Sana "`<rol>`" rolü verildi. Menünde yeni bölümler görebilirsin." gelir. Tasarımdaki rolsüz çalışan "`<okul>` okuluna çalışan
  olarak eklendin. Görevini okul yönetimi verecek." ve "Sana Öğretmen görevi verildi." alır
  ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
- **Yönetici** (sistem yöneticisi) aynı üst şeridi kullanır; bugün yalnız okulların dosya alanı uyarılarını alır. **Destek** ve
  **eğitmen** hesapları tasarımdadır; destek için ayrı bir sekme listesi ya da bildirim metni tanımlarda yazılı değil (tanımlarda:
  müdürü kalmayan okul için yöneticiye ve desteğe bildirim, destek panelinde talep rozeti).
- **Tahta hesabı** (tasarım) bildirim almaz; zilinin listesi boştur ve izin şeridi ona çıkmaz. **Giriş yapmamış ziyaretçide** zil yoktur.
- **Yetişkin hesabında** her okul portalının (öğretmen, müdür) zili ayrıdır; veli portalı yetişkin hesabının kendisi olduğu için
  veli bildirimleri ve "okul seni ekledi" gibi hesap bildirimleri aynı zildedir. Telefona bütün portallarının bildirimleri düşer
  ([Bildirim paneli](bildirim-paneli.md), [Telefon bildirimi](telefon-bildirimi.md)).

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Destek](../roller/destek.md) · [Eğitmen](../roller/egitmen.md). Bütün özellikler:
[features/](../README.md).

## İlgili öbür klasörler

- [Mesajlar ve duyurular](../mesaj/README.md) — "`<gönderen>`: `<konu>`" ve "Duyuru: `<konu>`" bildirimleri; okundu bilgisi (zilin
  okundusundan ayrı); tasarımda "Önemli" etiketinin ayrı kanalı, okumayanlara hatırlatma, şikâyet bildirimleri, sessiz saatler.
- [Ödevler](../odev/README.md) — yeni ödev, ödev güncellendi, sonuç açıklandı, "yarın ödevin var"; tasarımda hatırlatma kuralları.
- [Quiz](../quiz/README.md) — "quizinin sonucu açıklandı".
- [Sınavlar](../sinav/README.md) — "sınavının sonucu açıklandı"; tasarımda sınav hatırlatması.
- [Devamsızlık ve yoklama](../devamsizlik/README.md) — öğrenciye ve veliye "Çocuğunuz … dersine gelmedi".
- [Etütler](../etut/README.md) — "etüdü sana verildi", etüt yoklaması bildirimi.
- [Servis](../servis/README.md) — servis yoklaması, yaklaşma, servisçinin notu, "binmeyecek".
- [Çocuğumun telefonu (Aile)](../aile/README.md) — velinin Aile bildirimleri.
- [Hatırlatıcılar](../hatirlatici/README.md) — "Hatırlatma: …".
- [Ders programı](../ders-programi/README.md) — sabah özeti ve "Ders programına yeni ders saatlerin eklendi."
- [Hesap ayarları](../ayarlar/README.md) — tasarımda Hesap ayarları → Bildirimler (telefon ve e-posta).
- [Uygulama](../uygulama/README.md) — Android uygulamasının bildirimleri, telefona kurma.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — zilin yeri, telefonda yenile düğmesi.
- [Portallar ve + Ekle](../portallar/README.md) — velide her çocuk ayrı oturum, öğrencide birden çok kurum, Portallarım'ın
  tazelenmesi.
- [Okulun dosya alanı](../okul-disk/README.md) — %80 ve "doldu" uyarıları.
- [Yönetim](../yonetim/README.md) — site ayarlarında bildirim yoklama aralığı.
- [Toplantılar](../toplanti/README.md) — tasarımda "Toplantı başladı · Katıl" ve hatırlatmalar.
- [Eğitim içerikleri](../egitim-icerikleri/README.md) — tasarımda eğitmenin video bildirimleri.
- [Takvim ve ajanda](../takvim/README.md) — tasarımda duyurudan ajandaya ve hatırlatıcıya ekleme.
- [Giriş ve hesap](../giris-hesap/README.md) — çıkışta telefon aboneliğinin bırakılması, tasarımda yeni cihaz uyarısı.
- [Okulun özellikleri](../ozellikler/README.md) — kapalı bölümün sekmesinin görünmemesi (tasarım).
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — veli kopyası cümlesi, telefon bildirimi, saklama süreleri.
- [Çok dil](../dil/README.md) — bildirim metinlerinin çevirisi (tasarım).

## Kod belgeleri

- Ön yüz: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) (zil, rozet, panel,
  yoklama, bildirime basınca), [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md) (telefon
  bildirimi izni ve aboneliği), [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) (Ayarlar'daki
  kart), [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) (Servis sayfasındaki öneri),
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (açılış, çıkış, `?k=` ile portala geçiş),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md), [public/sw.md](../../public/sw.md) (telefona düşen
  bildirim).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`/api/notifications`), [sunucu/bolumler/push.md](../../sunucu/bolumler/push.md)
  (`/api/push`), [sunucu/push.md](../../sunucu/push.md) (Web Push gönderimi), [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md)
  (Android uygulamasının bildirim yoklaması), [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) (sabah özeti, "yarın ödevin var"),
  [sunucu/site.md](../../sunucu/site.md) ve [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (yoklama
  aralığı).
- Depo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirim yazma, veli kopyası, sürüm, okundu, "ilk kez"
  işaretleri), [sunucu/veri/depo/push.md](../../sunucu/veri/depo/push.md), [sunucu/veri/depo/cihazlar.md](../../sunucu/veri/depo/cihazlar.md),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md), [testler/test-push.md](../../testler/test-push.md),
  [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/test-servis-konum.md](../../testler/test-servis-konum.md),
  [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md), [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Otomatik bildirimler", "Bildirimler sayfaya nasıl gelir",
  "Öğrencinin bildirimi veliye de gider", "Telefon bildirimi (Web Push)"). KILAVUZ'un "Otomatik bildirimler" tablosundaki
  "Ders başlıyor — dersten 15 dakika önce" satırı koda uymuyor ([Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md)).
