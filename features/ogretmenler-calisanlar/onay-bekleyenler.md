# Öğretmenler ve çalışanlar · Onay bekleyenler (eski başvurular)

**Durum:** Kodda var

Öğretmenler sayfasında, kişi koduna geçilmeden önceki düzenden kalmış öğretmenlik başvurularının listesi ve "Onayla" / "Reddet"
düğmeleri; bugün yeni başvuru oluşmaz.

## Ne işe yarar

Eskiden öğretmen kayıt olurken okulunu kendisi seçiyor, müdür de başvurusunu onaylıyordu. Kullanıcının sonraki kararlarıyla bu düzen
kalktı: herkes rol seçmeden kaydolur, okula kişi koduyla eklenir ve onay beklenmez (kullanıcı 29 Eylül: "onay bekleme değil müdür
atayarak") ([Kodla ekleme](kodla-ekleme.md)). Veritabanında o dönemden **bekleyen** bir öğretmen satırı kalmışsa müdür onu bu
bölümde görür ve karara bağlar. Yeni kurulan bir okulda bu bölüm hiç çıkmaz.

## Nereden açılır

- **"Öğretmenler"** sayfasında, "Öğretmen ekle" kartının altında **"Onay bekleyenler (N)"** başlığı — yalnız bekleyen başvuru varsa
  ([Öğretmenler ve çalışanlar listesi](liste.md)).
- Müdürün ana sayfasındaki **"Öğretmenler"** kutucuğu bekleyen varken alt satırda **"N başvuru bekliyor"** yazar ve köşesinde sayı
  rozeti taşır ([Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md)).

Tasarım 1 önizlemesinde bu bölüm ve kutucuk metni yoktur.

## Adım adım

### Müdür

1. **"Öğretmenler"**i aç. **"Onay bekleyenler (1)"** altında her başvuru bir satır: öğretmen simgesiyle ad, altında "branş · kullanıcı
   adı" (ör. "Matematik · ayse.kaya").
2. **"Onayla"**: başvuru onaylanır, kişi "Okulun öğretmenleri" listesine geçer. Kişiye bildirim: **"Öğretmenlik başvurun müdür
   tarafından onaylandı."** İşlem kaydına **"Öğretmen onaylandı"** — kişinin adı.
3. **"Reddet"** (kırmızı): **onay sorulmadan** hemen reddedilir. Kişinin okul rolü, okulu, branşı ve ek rolü silinir; hesabı
   **kilitlenmez**, rolsüz yetişkin hesabına döner ve (yoksa) hemen bir kişi kodu üretilir. Kişiye bildirim: **"Öğretmenlik başvurun
   reddedildi."** (Ret işlem kaydına yazılmaz.)
4. Her iki düğmeden sonra sayfa yenilenir.

### Çalışan

Rolünde **"Okula öğretmen ekler, başvuru onaylar"** olan ek görevli öğretmen müdür gibi onaylar ya da reddeder. Kendi başvurusunu karara
bağlayamaz: "Kendi başvurunu karara bağlayamazsın."

### Öğretmen (başvuru sahibi)

- Onaylanınca bildirimi alır ve okulun öğretmeni olarak çalışır.
- Reddedilince bildirimi alır; hesabı rolsüz yetişkin hesabıdır: okula katılmak için "+ Ekle → Öğretmen"deki kişi kodunu müdüre verir
  ([Kodla ekleme](kodla-ekleme.md), [Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md)).

## Kurallar ve sınırlar

- **Yetki:** "Okula öğretmen ekler, başvuru onaylar" ("Bu işlem için yetkin yok", 403).
- **Yalnız bekleyen başvuru:** onaylı bir öğretmen bu yolla karara bağlanamaz, okuldan da çıkarılamaz: "Bu başvuru zaten karara
  bağlanmış." Başka okulun ya da olmayan kişi: "Öğretmen bulunamadı".
- **"Reddet" geri alınamaz** ve onay sormaz; kişi yeniden eklenmek için kişi koduyla gelir.
- **Yeni başvuru oluşmaz:** bugün kayıtta okul ve rol seçilmez; bu bölüm yalnız eski satırlar içindir.
- **Kutucuk:** bekleyen varsa müdürün "Öğretmenler" kutucuğu öğretmen sayısı yerine "N başvuru bekliyor" gösterir.
- **Tasarımda yok:** kullanıcının kararı "onay bekleme"yi kaldırdı; müdür ve okul için "bekliyor", "onay", "Giremiyor" sözleri hiçbir
  ekranda kalmayacak. Öğretmenlerdeki bu kalıntının kaldırılması "çok gerekli olmayanlar" öneri listesinde kullanıcıya sunulacak.

## Kardeşler ve ilgili

**Kardeşler:** [Öğretmenler ve çalışanlar listesi](liste.md) · [Kodla ekleme](kodla-ekleme.md) · [Rolsüz çalışan](rolsuz-calisan.md).

**İlgili:** [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md), [Kutucuklar](../ana-sayfa/kutucuklar.md),
[Kayıt olma](../giris-hesap/kayit-olma.md), [Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md),
[Bildirim metinleri](../bildirim/bildirim-metinleri.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — `SAYFALAR.ogretmenler` ("Onay bekleyenler", `pending`
  satırlar, `data-act="ogretmen-onay"`); [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `ogretmen-onay`
  (`POST /api/school/teacher-decide { userId, approve }`, onay sormaz); [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md)
  — kutucuktaki "başvuru bekliyor".
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `teacher-decide` (yalnız `pending`, kendi başvurusu yok, retle
  rolsüz yetişkin ve kişi kodu, bildirimler, işlem kaydı `ogretmen.onaylandi`), `ozet` (`bekleyen` sayısı);
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `okulSayimlari`.
- Testler: [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md) (reddedilen eski başvurunun rolsüz yetişkin hesabına dönmesi ve kişi
  kodunun hemen üretilmesi), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).

## Sık sorulanlar

- **"Onay bekleyenler" bölümünü görmüyorum.** Normal: bugün başvuru oluşmuyor; bölüm yalnız eski düzenden kalan satır varsa çıkar.
- **Yanlışlıkla "Reddet"e bastım.** Kişinin hesabı durur; ondan "+ Ekle → Öğretmen"deki kişi kodunu iste ve "Kodla ekle" ile ekle.

## Sırada

- Optimizasyon (iş 7, "çok gerekli olmayanlar" öneri listesi): "Onay bekleyenler" ve kutucuktaki "başvuru bekliyor" kalıntısının
  kaldırılması.
- Paneller (iş 5): müdür ve okul için "bekliyor/onay/Giremiyor" sözlerinin temizliği.
