# Bildirimler · Saklama ve silinme

**Durum:** Kodda var; tasarımda ek olarak bildirimlerin 90 gün sonra kendiliğinden silinmesi ve "Verilerimi indir"de son 90 günün
bildirimleri.

Bildirimlerin ne kadar durduğu, ne zaman silindiği; telefon bildirimi aboneliklerinin ve "bir kez gitsin" işaretlerinin ömrü.

## Ne işe yarar

Zilde geçmişe dönük ne kadar bildirim göreceğini ve kişisel verinin ne zaman silindiğini bilirsin. Kullanıcının isteği (25 Eylül):
"optimize … bu sayfa neden 1 yılda yükleniyor denmesin" — bildirim tablosu yıllarca büyümesin diye tasarımda saklama süresi var.

## Nereden açılır

Ayrı bir ekranı yok: zil ([Bildirim paneli](bildirim-paneli.md)) ve tasarımda Hesap ayarları → "Verilerimi indir"
([Verilerimi indir](../ayarlar/verilerimi-indir.md)).

## Adım adım

### Herkes — bugünkü site

1. Gelen her bildirim veritabanına yazılır ve **silinmez**; okunmuş olsa da durur.
2. Zil en yeni **100** bildirimi gösterir; daha eskiler görünmez ama silinmiş değildir.
3. Bildirimlerin şu durumlarda silinir:
   - hesabın silinince (yetişkin "Hesabımı sil" dediğinde, okul öğrenci ya da servisçi hesabını sildiğinde, yönetici sildiğinde)
     bütün bildirimleri hesapla birlikte silinir;
   - bir okul portalın kapanınca (okuldan ayrılınca, okul seni öğretmen listesinden çıkarınca) o portala gelmiş bildirimler o
     portalla birlikte silinir; yetişkin hesabının kendisine gelenler durur (kod okumasına göre).
4. Başka okula nakledilen öğrencinin hesabı aynı kaldığı için eski bildirimleri durur.
5. Bildirimler sunucunun yedeğine girer.

### Telefon bildirimi aboneliği

- Çıkış yapınca, "Kapat"a basınca ya da hesap silinince o cihazın aboneliği silinir.
- Kişi başına en çok 5 abonelik durur; yenisi gelince en eskisi silinir.
- Telefonun bildirim servisi aboneliği geçersiz sayarsa sunucu onu siler.
- Telefon kapalıysa bildirim servisi bildirimi en çok 1 gün bekletir; sonra telefona gelmez (zilde durur).
- Android uygulamasının cihaz anahtarı uygulamadan çıkışta, şifre değişince ya da hesap silinince silinir
  ([Telefon bildirimi](telefon-bildirimi.md)).

### "Bir kez gitsin" işaretleri

Aynı bildirim iki kez gitmesin diye tutulan işaretler (sabah ders özeti, "yarın ödevin var", sınav sonucunun ilk girişi, programa ders
eklenmesi) 30 gün sonra silinir. Servis olaylarının kaydı (bindi, okula vardı, eve bırakıldı…) da 30 gün sonra silinir; bu
kayıtların silinmesi zildeki bildirim satırlarını silmez.

### Tasarımda (tanımlar)

- **90 gün:** bildirimler 90 gün sonra kendiliğinden silinir (optimizasyon tanımı; kullanıcı öneriye itiraz etmedi). Zil daha kısa
  bir geçmiş gösterir.
- **Verilerimi indir:** kişinin indirdiği ZIP dosyasında son 90 günün bildirimleri de bulunur ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).
- **Saklama süreleri sayfası:** bütün süreler aydınlatma metninde ve saklama süreleri belgesinde tek yerde yazılır
  ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).

## Kurallar ve sınırlar

- **Panel sınırı:** 100 satır; sayfa sayfa gezme yok.
- **Kim silebilir:** bildirimi tek tek silmenin bir yolu yok (ne bugün ne tasarımda).
- **Kişisel veri:** bildirim metinleri kişisel veri içerir (çocuğun adı, devamsızlığı, notu). Bugünkü aydınlatma metninin "Ne kadar
  süre saklanıyor?" bölümünde zil bildirimlerinin saklama süresi yazmıyor; "veliye giden servis bildirimlerinin kaydı … 30 gün sonra
  silinir" cümlesi zildeki satırları değil, servis olaylarının kaydını anlatıyor (rapor edildi; tasarımdaki 90 günle birlikte metne
  girmeli) ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).
- **Kod okumasına göre bir açık:** sınav sonucunun "ilk kez" işareti 30 gün sonra silindiği için, ilk girişten 30 günden uzun süre
  sonra bir değer düzeltilirse "sonucu açıklandı" bildirimi yeniden gidebilir ([Bildirim türleri ve metinleri](bildirim-metinleri.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim paneli](bildirim-paneli.md) · [Telefon bildirimi](telefon-bildirimi.md) · [Okundu sayma](okundu-sayma.md) ·
[Otomatik bildirimler](otomatik-bildirimler.md).

**İlgili:** [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) · [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) ·
[Verilerimi indir](../ayarlar/verilerimi-indir.md) · [Hesabımı sil](../ayarlar/hesabimi-sil.md) ·
[Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md) · [Öğrenci nakli](../hesaplar/ogrenci-nakli.md).

## Kod tarafı

- Şema: `bildirimler` tablosu, kişi silinince bildirimleri de silinir (`ON DELETE CASCADE`); kişi ve tarih dizini
  ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Depo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — `bildirimleri` (en yeni 100), `ilkKezOlanlar` ve
  `hatirlatmaTemizle` (30 gün); [sunucu/veri/depo/push.md](../../sunucu/veri/depo/push.md) (abonelik silme, en yeni 5);
  [sunucu/veri/depo/cihazlar.md](../../sunucu/veri/depo/cihazlar.md).
- Sunucu: [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) (işaret temizliği), [sunucu/push.md](../../sunucu/push.md) (1 günlük
  bekleme, geçersiz aboneliğin silinmesi), [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) (portal ve hesap silme).
- Kullanıcıya dönük metin: `public/kvkk/kvkk.html` (7. bölüm "Ne kadar süre saklanıyor?").

## Sık sorulanlar

- **Geçen yılın bildirimlerini görebilir miyim?** Zil son 100 bildirimi gösterir; daha eskiler görünmez.
- **Bir bildirimi silebilir miyim?** Hayır.
- **Okuldan ayrıldım, o okulun bildirimleri nereye gitti?** O portalla birlikte silindi.

## Sırada

- Optimizasyon + saklama süreleri (iş 7): bildirimler 90 gün sonra silinir.
- Kullanıcı arama … Verilerimi indir (iş 6): indirilen dosyada son 90 günün bildirimleri.
- KVKK ve onay metinleri tam denetimi (iş 18): bildirimlerin saklama süresinin aydınlatma metnine yazılması.
