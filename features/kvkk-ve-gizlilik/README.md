# KVKK ve gizlilik

Eğitim Evi'nin kişisel verilerle ilgili bütün kuralları bu klasörde. Sitede herkese açık duran aydınlatma metni (`/kvkk/kvkk.html`,
bugün sürüm 1.16) hangi verinin kimden ve hangi amaçla alındığını, kimin gördüğünü, nereye gittiğini, ne kadar saklandığını ve
haklarını anlatır; kullanım koşulları (`/kosullar/kosullar.html`, sürüm 1.3) hizmetin "olduğu gibi" sunulduğunu ve yapımcıların
sorumluluğunun sınırını yazar. Kendisi kaydolan herkes ikisini kayıt formundaki tek kutuyla onaylar; okulun açtığı hesap (öğrenci,
servisçi) ilk girişte onaylar; metnin sürümü artınca herkes bir sonraki girişte yeniden onaylamadan uygulamayı kullanamaz (yalnız
sistem yöneticisi bu kapıdan muaftır). Veri sorumlusu okulun kendisidir; Eğitim Evi verileri okul adına, kendi sunucusunda işler; her
okulun verisi ayrıdır; reklam, analiz ya da satış için kimseye verilmez; dışarıya yalnız harita resimleri (OpenStreetMap), şifreli
telefon bildirimleri, e-postalar (sistemi kuranın seçtiği sağlayıcı üzerinden) ve senin bastığın Google Haritalar bağlantıları gider. Saklama süreleri bugün dosyalar ve ekler için 7 gün,
servis kayıtları için 30 gün, Eğitim Evi Aile için 7 gündür; öğrencinin ders kayıtları silinmez. Tasarımda (kullanıcının kararları ve
Tasarım 1 önizlemesi) bunlara Hesap ayarlarında "Gizlilik ve verilerim" bölümü ve kısa özet penceresi, "Verilerimi indir", bildirimler
için 90 gün, mesaj ve quiz için 1 yıl, öğrenci ve velinin yalnız son bir geçmiş yılı görmesi, destek ekibinin ve eğitmenin görecekleri
ve hukuki metinlerin her dilde Türkçe kalması eklenir. Kullanıcının kalıcı kuralı (28 Eylül, "KVKK ve onaylarda eksik metin olmasın"):
kişisel veri işleyen ya da gösteren her yeni özellik aynı işte aydınlatma metnini ve onay kutusunu günceller, sürümü artırır.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Aydınlatma metni](aydinlatma-metni.md) | `/kvkk/kvkk.html`: on bir bölüm, 37 satırlık veri tablosu, amaçlar, korunma önlemleri, sürüm geçmişi (1.2–1.16), metin ile kod arasındaki farklar | Kodda var; tasarımda ek olarak "Gizlilik ve verilerim"deki özet penceresi, kayıtta pencerede açılma, "yalnız Türkçe", yeni özelliklerin satırları |
| [Onay ve yeniden onay](onay-ve-yeniden-onay.md) | Kayıt kutusu, okulun açtığı hesabın ilk girişteki onayı, sürüm artınca "Aydınlatma metni güncellendi" penceresi, onaysız açık kalanlar, Android'deki onay sayfası | Kodda var; tasarımda ek olarak yeni hata iletisi, ayarlarda onay tarihi, T.C. adımı, tahtanın muaf olması, eklenti okul eki |
| [Kullanım koşulları](kullanim-kosullari.md) | `/kosullar/kosullar.html`: yedi bölüm, sorumluluğun sınırı, kendi sürüm sayısının olmaması | Kodda var; tasarımda ek olarak pencerede açılma, "yalnız Türkçe", eğitmenin "İçerik yükleme koşulları" |
| [Kim neyi görür](kim-neyi-gorur.md) | Veri × kişi tablosu; her rolün gördüğü ve göremediği; sunucunun ortak kuralları; metinde yazmayan görünürlükler | Kodda var; tasarımda ek olarak kullanıcı araması, destek, eğitmen, tahta, başarılar, "Bu mesajı bildir", son bir geçmiş yıl |
| [Saklama süreleri](saklama-sureleri.md) | Bugün kodda olan süreler tablosu, hiç silinmeyenler, tasarımdaki yeni süreler ve yeni özelliklerin süreleri | Kodda var; tasarımda ek olarak 90 gün bildirim, 1 yıl mesaj ve quiz, 2 yıl işlem kaydı, .tar.gz yedek, yeni özelliklerin süreleri |
| [Dışarı giden veriler](disari-giden-veriler.md) | OpenStreetMap, bildirim servisleri, Google Haritalar bağlantıları, e-posta sağlayıcısı, GitHub; metinde eksik olanlar | Kodda var; tasarımda ek olarak YouTube (nocookie), toplantı bağlantıları, eklentilerin dış adresleri |
| [Haklar ve başvuru](haklar-ve-basvuru.md) | KVKK 11. maddedeki sekiz hak ve Eğitim Evi'ndeki karşılıkları, başvurunun okula yapılması ve 30 gün, Hesabımı sil | Kodda var; tasarımda ek olarak Verilerimi indir, KVKK başvurusu konulu destek talebi, müdürün de hesabını silebilmesi |

Okuma sırası: önce [Aydınlatma metni](aydinlatma-metni.md) ve [Onay ve yeniden onay](onay-ve-yeniden-onay.md) (her hesabın karşılaştığı
iki şey), sonra merak ettiğin soruya göre [Kim neyi görür](kim-neyi-gorur.md), [Saklama süreleri](saklama-sureleri.md),
[Dışarı giden veriler](disari-giden-veriler.md); haklarını kullanmak için [Haklar ve başvuru](haklar-ve-basvuru.md); en son
[Kullanım koşulları](kullanim-kosullari.md).

Planda olmayan iki belge bu klasöre eklendi: [Dışarı giden veriler](disari-giden-veriler.md) (aydınlatma metninin 6. bölümü ve metinde
geçmeyen Google Haritalar ile e-posta gönderimi ayrı bir konu olduğu için) ve [Haklar ve başvuru](haklar-ve-basvuru.md) (9. bölüm,
başvurunun kime yapıldığı ve sistemin içinde kullanılan haklar; "Verilerimi indir" ile "Hesabımı sil"i birbirine bağlar).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz. Destek, eğitmen ve
tahta bugün kodda olmayan, tasarımdaki rollerdir.

| Alt özellik | Ziyaretçi | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Destek | Eğitmen | Tahta |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Aydınlatma metni | [girişsiz okur](aydinlatma-metni.md#ziyaretçi) | [kendi satırlarını bulur](aydinlatma-metni.md#öğrenci) | [çocuğunun verisi, veli onayı](aydinlatma-metni.md#veli) | [kişi kodu, quiz, sınıflar](aydinlatma-metni.md#öğretmen-ve-çalışan) | [yetkisine bağlı](aydinlatma-metni.md#öğretmen-ve-çalışan) | [veri sorumlusu okul](aydinlatma-metni.md#müdür) | [servis satırları](aydinlatma-metni.md#servisçi) | [metni ekrandan değiştirmez; kodla gördükleri](aydinlatma-metni.md#yönetici) | [kullanıcı araması metne girer](aydinlatma-metni.md#destek-eğitmen-ve-tahta) | [video satırları](aydinlatma-metni.md#destek-eğitmen-ve-tahta) | [tahta satırı](aydinlatma-metni.md#destek-eğitmen-ve-tahta) |
| Onay ve yeniden onay | [kayıtta kutuyu işaretler](onay-ve-yeniden-onay.md#ziyaretçi) | [ilk girişte onaylar](onay-ve-yeniden-onay.md#öğrenci-ve-servisçi) | [kayıtta ve sürüm artınca](onay-ve-yeniden-onay.md#herkes-metin-güncellenince) | [kayıtta ve sürüm artınca](onay-ve-yeniden-onay.md#herkes-metin-güncellenince) | [sürüm artınca](onay-ve-yeniden-onay.md#herkes-metin-güncellenince) | [kayıtta ve sürüm artınca](onay-ve-yeniden-onay.md#herkes-metin-güncellenince) | [ilk girişte onaylar](onay-ve-yeniden-onay.md#öğrenci-ve-servisçi) | [kapıdan muaf](onay-ve-yeniden-onay.md#yönetici) | [tanımda açık](onay-ve-yeniden-onay.md#destek-eğitmen-ve-tahta) | [onaylar](onay-ve-yeniden-onay.md#destek-eğitmen-ve-tahta) | [sorulmaz](onay-ve-yeniden-onay.md#destek-eğitmen-ve-tahta) |
| Kullanım koşulları | [girişsiz okur](kullanim-kosullari.md#ziyaretçi) | [ilk girişte kabul eder](kullanim-kosullari.md#öğrenci-ve-servisçi) | [Aile ve servis maddeleri](kullanim-kosullari.md#veli) | [kişi kodu, yazdıkları](kullanim-kosullari.md#öğretmen-ve-çalışan) | [kişi kodu, yazdıkları](kullanim-kosullari.md#öğretmen-ve-çalışan) | [okulun rolü](kullanim-kosullari.md#müdür) | [servis maddesi](kullanim-kosullari.md#öğrenci-ve-servisçi) | [hesap kapatır, içerik kaldırır](kullanim-kosullari.md#yönetici) | — | [içerik yükleme koşulları](kullanim-kosullari.md#eğitmen) | — |
| Kim neyi görür | [herkese açık olanlar](kim-neyi-gorur.md#ziyaretçi) | [yalnız kendini](kim-neyi-gorur.md#öğrenci) | [bağlı çocuğunu](kim-neyi-gorur.md#veli) | [ders verdiği sınıfları](kim-neyi-gorur.md#öğretmen) | [verilen yetki kadar](kim-neyi-gorur.md#çalışan) | [okulunun hepsi, sınırlarıyla](kim-neyi-gorur.md#müdür) | [kendi servisini](kim-neyi-gorur.md#servisçi) | [kodla ve müdür listesi](kim-neyi-gorur.md#yönetici) | [kullanıcı araması, gizli kimlik](kim-neyi-gorur.md#destek) | [herkese açık @ad, toplamlar](kim-neyi-gorur.md#eğitmen) | [sınıfın adları](kim-neyi-gorur.md#tahta) |
| Saklama süreleri | — | [dosya süreleri, son bir yıl](saklama-sureleri.md#öğrenci) | [servis 30, Aile 7 gün](saklama-sureleri.md#veli) | [teslim dosyaları](saklama-sureleri.md#öğretmen-ve-çalışan) | [teslim dosyaları](saklama-sureleri.md#öğretmen-ve-çalışan) | [ders kayıtları, işlem kaydı](saklama-sureleri.md#müdür) | [yoklama 30 gün](saklama-sureleri.md#servisçi) | [temizlik ve yedek](saklama-sureleri.md#yönetici) | [talepler 1 hafta](saklama-sureleri.md#destek-ve-eğitmen) | [videolar](saklama-sureleri.md#destek-ve-eğitmen) | — |
| Dışarı giden veriler | [GitHub bağlantıları](disari-giden-veriler.md#ziyaretçi) | [harita, Google bağlantıları](disari-giden-veriler.md#öğrenci) | [Aile haritası](disari-giden-veriler.md#veli) | [bildirim; toplantı](disari-giden-veriler.md#öğretmen-ve-çalışan) | [bildirim; toplantı](disari-giden-veriler.md#öğretmen-ve-çalışan) | [okul konumu, yurt dışı](disari-giden-veriler.md#müdür) | ["Yol tarifi"](disari-giden-veriler.md#servisçi) | [e-posta sağlayıcısı](disari-giden-veriler.md#yönetici) | — | [YouTube](disari-giden-veriler.md#eğitmen) | — |
| Haklar ve başvuru | [iletişim](haklar-ve-basvuru.md#ziyaretçi) | [okula başvurur](haklar-ve-basvuru.md#öğrenci) | [kendi hesabı ve çocuğu](haklar-ve-basvuru.md#veli) | [düzeltir, siler, ayrılır](haklar-ve-basvuru.md#öğretmen-ve-çalışan) | [düzeltir, siler, ayrılır](haklar-ve-basvuru.md#öğretmen-ve-çalışan) | [başvuruyu 30 günde sonuçlandırır](haklar-ve-basvuru.md#müdür) | [okula başvurur](haklar-ve-basvuru.md#servisçi) | [müdürlüğü kaldırır; tasarımda hesap siler, KVKK talebi](haklar-ve-basvuru.md#yönetici) | [KVKK başvurusu konusu](haklar-ve-basvuru.md#destek) | — | — |

Rol kapıları: [Ziyaretçi](../roller/ziyaretci.md) · [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) ·
[Öğretmen](../roller/ogretmen.md) · [Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Destek](../roller/destek.md) · [Eğitmen](../roller/egitmen.md) · [Tahta](../roller/tahta.md).
Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Giriş ve hesap](../giris-hesap/README.md) — kayıt formu ve onay kutusu, e-posta onayı, T.C. kimlik no, zorunlu şifre belirleme.
- [Hesap ayarları](../ayarlar/hesap-ayarlari-sayfasi.md) — kişisel bilgiler, Hesabımı sil, tasarımdaki "Gizlilik ve verilerim" ve
  "Verilerimi indir".
- [Açılış sayfası](../acilis-sayfasi/README.md) — alt bilgideki bağlantılar, adresler, SSS'in "Gizlilik" grubu, Hakkında.
- [Çocuğumun telefonu (Eğitim Evi Aile)](../aile/README.md) — okulun görmediği, 7 günlük veriler.
- [Servis](../servis/README.md) — konum, yoklama, ev konumu, 30 gün.
- [Ödev](../odev/README.md), [Quiz](../quiz/README.md), [Mesajlar](../mesaj/README.md), [Bildirimler](../bildirim/README.md) — kendi
  saklama ve görünürlük belgeleri.
- [İşlem kaydı](../islem-kaydi/README.md) — kim ne zaman ne yaptı; IP ve yetişkinin kişisel işlemleri.
- [Portallar](../portallar/README.md), [Öğrenci hesapları](../hesaplar/README.md), [Roller ve yetkiler](../roller-yetkiler/README.md) — kişi
  kodu, veli kodu, veli bağlama, yetkiler.
- [Site yönetimi](../yonetim/README.md), [Destek](../destek/README.md) — yedekler, kullanıcı arama, KVKK başvurusu konulu talep.
- [Eğitim yılı](../egitim-yili/README.md) — geçmiş yıllar, mezunlar, okul yedeği.
- [Eğitim içerikleri](../egitim-icerikleri/README.md), [Toplantılar](../toplanti/README.md), [Başarılar](../basarilar/README.md),
  [Tahta](../tahta/README.md), [Eklentiler](../eklentiler/README.md) — tasarımdaki özelliklerin KVKK satırları.
- [Dil ve çeviri](../dil/README.md) — hukuki metinlerin Türkçe kalması.
- [Uygulama ve indirme](../uygulama/README.md) — Android'deki onay sayfası ve bağlantılar.
- [Yorumlar](../yorumlar/README.md), [Okul sayfası](../okul-sayfasi/README.md) — herkese açık görünen kişisel veri.

## Kod belgeleri

- Metinler: [public/kvkk/KLASOR.md](../../public/kvkk/KLASOR.md) (`kvkk.html`), [public/kosullar/KLASOR.md](../../public/kosullar/KLASOR.md)
  (`kosullar.html`), [public/js/belge.md](../../public/js/belge.md) (düz sayfaların küçük betiği), [public/KLASOR.md](../../public/KLASOR.md)
  (`index.html`: kayıt kutusu, Hakkında, SSS, alt bilgi).
- Onay: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`KVKK_SURUM`, `kvkkGuncelMi`, `POST /api/kvkk-onay`),
  [sunucu/api.md](../../sunucu/api.md) (`KVKK_SERBEST`, 403 `kvkkGerek`), [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md)
  (`kvkkOnayIste`), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) ("Onaylıyorum", "Kaynakça"),
  [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) (sıra).
- Görünürlük: [sunucu/iliskiler.md](../../sunucu/iliskiler.md), [sunucu/yetki.md](../../sunucu/yetki.md).
- Saklama: [sunucu/index.md](../../sunucu/index.md) (temizlik zamanlayıcıları), [sunucu/guvenlik.md](../../sunucu/guvenlik.md),
  [sunucu/veri/yedek.md](../../sunucu/veri/yedek.md), [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md).
- Dışarı giden: [sunucu/http.md](../../sunucu/http.md) (güvenlik başlığı), [sunucu/push.md](../../sunucu/push.md),
  [public/js/parcalar/19d-harita.md](../../public/js/parcalar/19d-harita.md).
- Adresler: [sunucu/http.md](../../sunucu/http.md) (`YONLENDIRMELER`).
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md), [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md),
  [testler/test-adresler.md](../../testler/test-adresler.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Gizlilik ve güvenlik", "Veriler"; ikisinde de eski kalan
  cümleler var, ilgili belgelerin "Dikkat" maddelerinde yazıldı).
