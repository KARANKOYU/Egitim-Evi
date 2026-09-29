# sunucu/veri/depo/ogrenci-gecmisi.js

Nakil olan öğrencinin geçmiş okul dönemlerinin (`ogrenci_gecmisi`) SQL'i: öğrencinin geçmiş listesi, bir dönemi
yazma (tekrarsız), nakilde eski okulun etüt/kulüp/servis listelerinden çıkarma ve bütün satırlar.

## Bu dosya ne yapar?

Öğrenci hesabı okula değil KİŞİYE aittir: T.C. kimlik no bütün sistemde tek öğrencidedir. Başka bir okul aynı T.C. ile
öğrenci eklemek isterse doğum tarihi de eşleşirse hesap o okula taşınır (**nakil**). Eski okulun ödevleri, notları ve
devamsızlığı o okulun kaydı olarak kalır: yeni okul görmez; öğrenci ve velisi eğitim yılı seçicisinde
"2025-2026 · Eski Okul · 6-A" diye seçip salt okunur görür (şema 021).

Bu dosya o seçicideki geçmiş dönemleri tutar: taşınırken eski okulun her eğitim yılı için bir satır (okulda yıl tanımlı
değilse `yil_id` boş tek satır). Okul, yıl ve sınıf adları O ANKİ hâliyle saklanır: eski okul adını değiştirse de
öğrencinin geçmişi değişmez. Nakil kuralları [../../bolumler/nakil.md](../../bolumler/nakil.md)'de, yıl seçicisi ve
"kim hangi dönemi görebilir" [../../bolumler/egitim-yili.md](../../bolumler/egitim-yili.md)'dedir.

## İçinde neler var?

İç dönüştürücü `nesne(r)` → `{ id, ogrenciId, okulId, yilId ('' = yılsız), okulAdi, yilAdi, sinifAdi, ayrilis }`
([../esleme.md](../esleme.md) kullanılmaz).

- `listesi(ogrenciId)` — öğrencinin geçmiş dönemleri, yeniden eskiye: son ayrılınan okul ve onun en yeni yılı önce
  (`ORDER BY ayrilis DESC, yil_adi DESC`).
- `ekle(g)` — `g = { id, ogrenciId, okulId, yilId, okulAdi, yilAdi, sinifAdi }`. `INSERT … ON CONFLICT (ogrenci_id,
  okul_id, COALESCE(yil_id, '')) DO UPDATE SET sinif_adi = (yeni boş değilse yeni, yoksa eski), ayrilis = now()`: aynı
  okul ve yıl ikinci kez satır açmaz (öğrenci geri dönüp yeniden ayrılabilir); çakışma ifadesi `ogrenci_gecmisi_tekil`
  ifade indeksini hedefler. Boş yıl `NULL`, boş yıl/sınıf adı `''`.
- `okuldanCikar(ogrenciId, okulId)` — nakilde öğrenciyi eski okulun listelerinden çıkarır, dört `DELETE`:
  `etut_ogrencileri` (o okulun etütleri), `kulup_uyeleri` (o okulun kulüpleri), `servis_ogrencileri` (o okulun
  servisleri) ve öğrencinin servis için kaydedilmiş ev konumu `ogrenci_konumlari` (öğrenci başına tek satır, okuldan
  bağımsız). Yoklamalar ve notlar silinmez; eski okulda kayıt olarak kalır.
- `hepsi()` — bütün satırlar (öğrenci ve ayrılış sırasıyla). Yorumu "yedek için" der; **bugün hiçbir yerden
  çağrılmıyor** ([../json-aktarim.md](../json-aktarim.md) tabloyu kendi sorgusuyla okur).

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `ogrenci_gecmisi` (`ogrenci_id`, `okul_id`, `yil_id` üçü de `ON DELETE CASCADE`; `okul_adi`, `yil_adi`, `sinif_adi`, `ayrilis`; `ogrenci_gecmisi_tekil (ogrenci_id, okul_id, COALESCE(yil_id, ''))` tekil ifade indeksi), `kullanicilar.secili_gecmis` (baktığı geçmiş dönem, `ON DELETE SET NULL`), öğrencide T.C. tekliği (`kullanicilar_tc_ogrenci`, koşullu) | `021-ogrenci-gecmisi.sql` |
| `etut_ogrencileri` | `013-ogretmen-rolu-etut.sql` |
| `servis_ogrencileri`, `kulup_uyeleri` | `007-okul-hayati.sql` |
| `ogrenci_konumlari` | `010-servis-konum.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.ogrenciGecmisi`):
  - [../../bolumler/nakil.md](../../bolumler/nakil.md) — taşımanın işleminde: eski okulun her dönemi için `ekle`, sonra
    `okuldanCikar(öğrenci, eskiOkul)`, sonra öğrencinin okulu/sınıfı/kullanıcı adı güncellenir (hepsi tek `islem`).
  - [../../bolumler/egitim-yili.md](../../bolumler/egitim-yili.md) — `yilBilgisi(me)`: öğrenciyse `listesi` ile geçmiş
    dönemler yıl seçicisine eklenir (`"yıl · okul · sınıf"`).
- Tablolar: yazar `ogrenci_gecmisi`; siler `etut_ogrencileri`, `kulup_uyeleri`, `servis_ogrencileri`,
  `ogrenci_konumlari`.

## Nasıl çalışır (adım adım)?

```
Okul B, okul A'daki öğrenciyi T.C. + doğum tarihiyle ekler (nakil.js)
  denetimler (doğum eşleşmesi, B'de aynı T.C./okul no/kullanıcı adı) …
  satirlar = eski okulun yılları (her biri: yil_id, yil_adi, sinif_adi)
  islem {
    her satır: ogrenciGecmisi.ekle({ okul: A, okulAdi: A'nın şimdiki adı, … })   (varsa ayrılışı güncellenir)
    ogrenciGecmisi.okuldanCikar(öğrenci, A)      A'nın etüt, kulüp, servis listeleri + ev konumu
    kullanicilar.guncelle(öğrenci, { okul: B, sınıf, kullanıcı adı, seciliYil: '', seciliGecmis: '' })
  }
Öğrenci giriş yapar → egitim-yili.js yilBilgisi → B'nin yılları + listesi() → "2025-2026 · A · 6-A" seçilebilir
```

## Dikkat!

- **Kapsam çağıranda:** `listesi` ve `okuldanCikar` kimlikle çalışır. Geçmiş dönemi kimin seçebileceğini (öğrencinin
  kendisi, velisi; yeni okul SEÇEMEZ) [../../bolumler/egitim-yili.md](../../bolumler/egitim-yili.md) belirler.
- **İşlem çağıranda:** `ekle` ve `okuldanCikar` kendi başına işlem açmaz; nakil bunları öğrencinin güncellenmesiyle
  birlikte tek `islem` içinde çağırır. Ayrı çağrılırsa (ör. çıkarma yarıda kalırsa) öğrenci eski okulun bazı
  listelerinde kalabilir.
- **Ev konumu tamamen silinir:** `ogrenci_konumlari` öğrenci başına tek satırdır; nakilde okul fark etmeksizin silinir,
  yeni okulun servisi için konum yeniden girilmelidir.
- **Ad kopyaları bilinçli:** `okul_adi`, `yil_adi`, `sinif_adi` ayrılış anındaki adlardır; sonradan değişmez. Okul ya da
  yıl SİLİNİRSE (CASCADE) geçmiş satırı da gider — uygulama okul ve yıl silmediği için bugün olmaz.
- **Kullanılmayan işlev:** `hepsi` dışa açık ama çağıran yok.
- **Güvenlik:** bütün değerler parametreyle. Satırlar öğrencinin okul geçmişidir (kişisel veri); yalnız öğrenciye ve
  velisine gösterilir.

## Testleri

- `testler/test-nakil.js` — okul A'da ödev ve devamsızlık, doğum tarihi olmadan/yanlışken taşınmama (ve kilit),
  eşleşince okul B'ye taşınma, aynı kullanıcı adı ve şifreyle giriş, yıl listesinde önceki okulun görünmesi, önceki
  okula salt okunur bakma (eski ödev ve devamsızlık), şimdiki okula dönünce gizlenmesi, yeni okulun eski kayıtları ve
  önceki dönemi görememesi, eski okulun öğrenciyi görmemesi, velinin çocuğun önceki okulunu görmesi, ilgisiz kişinin
  bakamaması.
- `okuldanCikar`'ın etüt/kulüp/servis listelerinden çıkarmasını ayrıca sınayan bir test yok. Elle: öğrenciyi A'da bir
  etüde ve servise ekle, B'ye naklet → A'nın etüt ve servis listelerinde görünmemeli.

## Son durum

- Tek commit: `fb65e8d commit 422` (2026-09-26) — dosya 021 şema dosyasıyla bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): kullanılmayan `hepsi`, `okuldanCikar` için test olmaması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Tek kişi tek hesap + portallar öğrencide de"** bu dosyayı en çok
  etkileyecek iş: öğrenci aynı anda okul + dershane gibi birden çok kuruma bağlı olabilecek, T.C. + doğum tarihi
  eşleşince portal kendiliğinden düşecek — "nakil = eski okuldan ayrılma" varsayımı değişir. **"Yıl geçişi"** (mezunlar)
  ve **"Optimizasyon + saklama süreleri"** (öğrenci/veli yalnız son 1 geçmiş yılı görür) geçmiş dönemlerin ne kadar
  tutulacağını belirleyecek.
