# Çocuğumun telefonu (Eğitim Evi Aile)

Velinin, çocuğunun Android telefonundan gelen konumu ve uygulama uygulama ekran süresini sitede görmesi. Telefon yalnız
öğrencinin kendi hesabıyla ve kendi açık onayıyla bağlanır; telefona hesaba giriş vermeyen, yalnız konum ve süre
göndermeye yarayan bir cihaz anahtarı verilir. Veli menüdeki "Çocuğumun telefonu" sayfasında son konumu haritada, bugünün
ve son 8 günün ekran süresini görür; konumun Wi-Fi'de ve mobil veride kaç dakikada bir geleceğini, paylaşımın açık olup
olmadığını, günlük toplam ve uygulama başına süre sınırını seçer. Sınır geçilince veliye günde bir kez bildirim gelir;
hiçbir uygulama kapatılmaz ya da kilitlenmez (kullanıcı 26 Eylül'de "uygulama kapatma zaten ağır olur" diyerek bunu
bıraktı). Okul (müdür, öğretmen) bu verileri görmez; konum ve süreler 7 gün sonra silinir, yedeğe girmez; okul bölümü
Özellikler'den kapatamaz; iPhone'da çalışmaz. Bugün yayımda olan uygulama "Eğitim Evi Aile" (1.0.x); hazırlanan tek
uygulama "Eğitim Evi"de aynı ekran öğrencinin Ayarlar'ındaki "Bu telefonu velimle paylaş" satırından açılır. Bütün
parçalar bugün kodda var. Tasarımda değişenler (Tasarım 1 önizlemesi ve kullanıcının 3 Ekim kararı): velide her çocuk ayrı
oturum olduğu için sayfa "Elif'in telefonu" gibi çocuğun adını taşır ve çocuk şeridi kalkar; telefon kartı (durum, pil,
konum sıklığı), dokunulan günün uygulama listesini açan 7 günlük ekran süresi grafiği ve "Sınır yok / Ortak (günlük toplam)
/ Uygulama başına" seçimli süre sınırı; velinin ana sayfasında telefon kutucuğu.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md) | Menüdeki yeri, sayfanın kartları ve sırası, çocuk seçimi, kim açabilir, kurulum kartı ile "Bağlı telefon" kartı | Kodda var; tasarımda ek olarak her çocuk ayrı oturum, ana sayfa kutucuğu ve yeni düzen |
| [Çocuğun telefonunu bağlama](telefonu-baglama.md) | Uygulamayı kurma, öğrencinin kendi hesabıyla ve onayıyla bağlaması, cihaz anahtarı, 3 telefon sınırı, hata iletileri | Kodda var |
| [Telefondaki izinler ve durum](izinler-ve-durum.md) | Bağlıyken telefondaki ekran: konum (her zaman), kullanım erişimi, bildirim, pil izni; son konum, son gönderim, bekleyen konum; arka plandaki iş | Kodda var |
| [Konum](konum.md) | "Konum" kartı: harita, son konum, ağ, doğruluk, pil, önceki noktalar, "Google Haritalar'da aç", "Servisi" | Kodda var; tasarımda ek olarak çocuğun adıyla iğne, durum ve pil satırları |
| [Ekran süresi](ekran-suresi.md) | "Ekran süresi" kartı: bugünün toplamı, son 8 günün çubukları, bugün en çok kullanılan 12 uygulama; telefonun süreyi nasıl ölçtüğü | Kodda var; tasarımda ek olarak dokunulan günün uygulama listesi ve "sınır geçti" rozetleri |
| [Süre sınırı ve aşım bildirimi](sure-siniri.md) | Günlük toplam (ortak) sınır, uygulama başına sınır, "Sınır ekle", günde bir bildirim, uygulamanın kapatılmaması | Kodda var; tasarımda ek olarak sınır türü seçimi ve dakika kutuları |
| [Paylaşım ayarları](paylasim-ayarlari.md) | "Konumu paylaş", "Wi-Fi'deyken" ve "Mobil veride" sıklığı, "Ekran süresini paylaş", "Kaydet", telefonun yeni ayarı alması | Kodda var; tasarımda ek olarak dokununca kaydedilen sıklık çipleri |
| [Bağlantıyı kaldırma](baglantiyi-kaldirma.md) | Velinin sitede "Bağlantıyı kaldır"ı, öğrencinin telefonda "Bu telefonun bağlantısını kaldır"ı, kendiliğinden düşen bağlantılar | Kodda var |
| [Aile bildirimleri](bildirimler.md) | "Telefonunu bağladı", "bağlantısını kaldırdı", toplam ve uygulama sınırı bildirimleri; nereye götürdükleri | Kodda var; tasarımda ek olarak başta çocuğun adı |
| [Kim görür, ne kadar saklanır](mahremiyet.md) | Okulun görmemesi, iki velinin ortak görmesi, 7 gün, yedek ve geri yükleme, aydınlatma metni, kullanım koşulları | Kodda var |

Okuma sırası: önce [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md) ve [Kim görür, ne kadar saklanır](mahremiyet.md);
telefonu kuracak olan [Çocuğun telefonunu bağlama](telefonu-baglama.md) ve [Telefondaki izinler ve durum](izinler-ve-durum.md);
veli sonra sayfadaki sırayla [Konum](konum.md), [Ekran süresi](ekran-suresi.md), [Paylaşım ayarları](paylasim-ayarlari.md),
[Süre sınırı ve aşım bildirimi](sure-siniri.md); en son [Aile bildirimleri](bildirimler.md) ve
[Bağlantıyı kaldırma](baglantiyi-kaldirma.md).

Planda olmayan dört belge bu klasöre eklendi: sayfanın kendisi, telefondaki izinler ve durum ekranı, bağlantıyı kaldırma ve
Aile bildirimleri (her biri ayrı bir ekran ya da ayrı bir iş olduğu için).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Çocuğumun telefonu sayfası | — (sitede yok; adresi yazarsa "Henüz çocuk eklenmedi…") ([bak](cocugumun-telefonu-sayfasi.md#öğrenci)) | [menüden açar, çocuğunu seçer](cocugumun-telefonu-sayfasi.md#veli) | [okul olarak göremez; kendi çocuğu için veli portalında](cocugumun-telefonu-sayfasi.md#öğretmen-müdür-ve-çalışan) | [öğretmenle aynı](cocugumun-telefonu-sayfasi.md#öğretmen-müdür-ve-çalışan) | [öğretmenle aynı](cocugumun-telefonu-sayfasi.md#öğretmen-müdür-ve-çalışan) | — | — | — |
| Çocuğun telefonunu bağlama | [kendi hesabıyla ve onayıyla bağlar](telefonu-baglama.md#öğrenci) | [uygulamayı kurdurur, kurulum kartını izler](telefonu-baglama.md#veli) | — (kendi hesabıyla bağlayamaz) | — | — | — | — | [indir sayfasında okur](telefonu-baglama.md#ziyaretçi) |
| Telefondaki izinler ve durum | [izinleri verir, durumu görür](izinler-ve-durum.md#öğrenci) | [çocuğuna yardım eder, "Son görülme"ye bakar](izinler-ve-durum.md#veli) | — | — | — | — | — | — |
| Konum | [telefonu gönderir](konum.md#öğrenci) | [haritada görür](konum.md#veli) | — (403) | — | — (403) | — | — | — |
| Ekran süresi | [telefonu gönderir](ekran-suresi.md#öğrenci) | [bugünü ve 8 günü görür](ekran-suresi.md#veli) | — (403) | — | — (403) | — | — | — |
| Süre sınırı ve aşım bildirimi | — (bildirim almaz) ([bak](sure-siniri.md#öğrenci)) | [sınır koyar, bildirim alır](sure-siniri.md#veli) | — | — | — | — | — | — |
| Paylaşım ayarları | [telefonda aralığı görür](paylasim-ayarlari.md#öğrenci) | [sıklığı ve aç/kapa'yı seçer](paylasim-ayarlari.md#veli) | — | — | — | — | — | — |
| Bağlantıyı kaldırma | [telefondan kaldırır](baglantiyi-kaldirma.md#öğrenci) | [sitede kaldırır](baglantiyi-kaldirma.md#veli) | — | — | — | — | — | — |
| Aile bildirimleri | — ([bak](bildirimler.md#öğrenci)) | [dört bildirimi alır](bildirimler.md#veli) | — | — | — | — | — | — |
| Kim görür, ne kadar saklanır | [neyin paylaşıldığını bilir](mahremiyet.md#öğrenci) | [kimin gördüğünü, 7 günü bilir](mahremiyet.md#veli) | [göremez](mahremiyet.md#öğretmen-müdür-ve-çalışan) | [göremez](mahremiyet.md#öğretmen-müdür-ve-çalışan) | [göremez](mahremiyet.md#öğretmen-müdür-ve-çalışan) | — | [görmez; site yedeğini geri yüklerse Aile verisi silinir](mahremiyet.md#yönetici) | [SSS'te ve aydınlatma metninde okur](mahremiyet.md#ziyaretçi) |

Öğretmen, müdür ve çalışan sütunları: okulun personeli olmak bu verileri görmeye yetmez (sunucu 403 "Bu öğrencinin velisi
değilsin" der). Aynı kişi kendi çocuğunun velisiyse, veli portalına geçince ([Portallarım](../portallar/portallarim.md))
veli sütunundaki her şeyi yapar. Destek, eğitmen ve tahta hesapları (tasarımdaki roller) bu bölümü kullanmaz.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Portallar](../portallar/README.md) — velide her çocuk ayrı oturum, Çocuklarım (veli koduyla çocuk ekleme ve kaldırma).
- [Servis](../servis/README.md) — sayfadaki "Servisi" düğmesinin götürdüğü yer; servis aracının konumu ayrı bir özelliktir.
- [Bildirimler](../bildirim/README.md) — zil, telefon bildirimi, bildirimin veli tarafı.
- [Uygulama ve indirme](../uygulama/README.md) — indir sayfası, Android uygulaması, uygulamanın kendini güncellemesi.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — aydınlatma metnindeki Aile satırları, saklama süreleri.
- [Ana sayfa](../ana-sayfa/README.md) — tasarımda velinin ana sayfasındaki telefon kutucuğu.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — veli menüsündeki "Çocuğumun telefonu" satırı.
- [Öğrenci hesapları](../hesaplar/README.md) — veli kodu ve okulun veli bağlaması (veriyi kimin göreceğini belirler).
- [Giriş ve hesap](../giris-hesap/README.md) — telefonda öğrencinin girişi, robot doğrulaması, ilk girişte şifre.
- [Okulun özellikleri](../ozellikler/README.md) — bu bölüm Özellikler listesinde yok, kapatılamaz.
- [Site yönetimi](../yonetim/README.md) — site yedeği ve geri yükleme (Aile verisi yedeğe girmez).
- [Dil ve çeviri](../dil/README.md) — sayfadaki metinlerin ve "'in" ekinin çevrilmesi.

## Kod belgeleri

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) (sayfa, kartlar, eylemler),
  [public/js/parcalar/19d-harita.md](../../public/js/parcalar/19d-harita.md) (harita),
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (çocuk seçimi),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menü satırı); CSS `33-aile.css`
  ([public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md)).
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) (`/api/aile/...`),
  [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) (tablolar, 7 günlük temizlik),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 026),
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedeğe girmeme),
  [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (telefon uygulamasının öteki anahtarı; Aile'ninkiyle karışmaz).
- Android (ayrı depo `Egitim-Evi-App`): `app/src/main/java/org/egitimevi/aile/AileEkrani.java` (bağlama, izinler, durum),
  `IzlemeServisi.java` (arka planda gönderim), `Kullanim.java` (ekran süresi), `Kuyruk.java` (internetsizken biriken
  konumlar), `AyarlarSayfasi.java` ("Bu telefonu velimle paylaş"); her birinin yanında aynı adlı `.md`.
- Testler: [testler/test-aile.md](../../testler/test-aile.md) (39 denetim),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Çocuğun telefonu (Eğitim Evi Aile)" bölümü).
