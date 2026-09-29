# sunucu/veri/depo/devamsizlik.js

Ders yoklamasının devamsızlık kayıtlarının (`devamsizlik`) SQL'i: bir dersin bir günü, öğrencinin dökümü, öğrencinin
bir günü, okulun son kayıtları ve yoklamanın (ders günü ya da tek öğrenci) silip yeniden yazılması.

## Bu dosya ne yapar?

Öğretmen her ders saatinde yoklama alır: `var` (geldi), `yok` (gelmedi), `gec` (geç geldi), `izinli`. Tabloya **yalnız
`var` DIŞINDAKİLER** yazılır: kaydı olmayan öğrenci o derste sayılır. Böylece tablo gereksiz büyümez (her ders × her
öğrenci × her gün yerine yalnız yoklukları tutar). Bir kayıt "bu öğrenci, bu ders, bu gün, bu durum, şu açıklama, şu
kişi aldı, şu eğitim yılı" der.

Kimin hangi derse yoklama alabileceği, bildirimler ve özetlerin hesabı [../../bolumler/devamsizlik.md](../../bolumler/devamsizlik.md)'dedir.
Etüt yoklaması ayrı tablodadır ([etutler.md](etutler.md)), servis yoklaması da ([servis-yoklama.md](servis-yoklama.md)).

## İçinde neler var?

Satır → nesne: [../esleme.md](../esleme.md)'deki `devamsizlik(r)` → `{ id, schoolId, classId, lessonId, ogrenciId,
tarih ('YYYY-AA-GG'), durum, not, alanId, yilId, createdAt }`; bu dosyanın `nesne(r)`'si buna `_ders` (dersin konusu) ve
`_alanAdi` (yoklamayı alanın adı) ekler.

### Ortak sorgu `SEC`

`devamsizlik v LEFT JOIN dersler d` (ders konusu) `LEFT JOIN kullanicilar a` (alanın adı).

### Okuma

- `dersGunu(dersId, tarih)` — bir dersin bir günkü kayıtları (`devamsizlik_ders_gun (ders_id, tarih)` indeksiyle).
  Sırasız.
- `ogrencinin(ogrenciId)` — öğrencinin BÜTÜN kayıtları (bütün okullar ve yıllar), yeniden eskiye (`ORDER BY v.tarih
  DESC, v.olusturma DESC`; `devamsizlik_ogrenci (ogrenci_id, tarih DESC)` indeksiyle). Hangi okul/yılın görüneceğini
  bölüm `yilSuz` ile süzer.
- `ogrenciGunu(ogrenciId, tarih)` — öğrencinin bir günkü kayıtları (bütün dersler). Sırasız.
- `okulunSonKayitlari(okulId, sinirTarih)` — okulun `tarih >= sinirTarih` kayıtları (okul özeti; `devamsizlik_okul_gun`
  indeksiyle). Sırasız.

### Yazma

- İç yardımcı `kayitEkle(k)` — `INSERT INTO devamsizlik (id, okul_id, sinif_id, ders_id, ogrenci_id, tarih, durum,
  aciklama, alan_id, yil_id, olusturma)`; boş sınıf/ders/alan/yıl `NULL`, boş açıklama `''`. Şema: `durum` dört değerden
  biri (`23514`), var olmayan öğrenci/ders/sınıf/yıl `23503`.
- `dersGunuYaz(dersId, tarih, kayitlar)` — tek işlemde: `DELETE FROM devamsizlik WHERE ders_id = $1 AND tarih = $2`,
  sonra her kayıt için `kayitEkle`. Yoklama yeniden kaydedilince eskisinin üzerine yazılır.
- `ogrenciDersGunuYaz(ogrenciId, dersId, tarih, kayit)` — tek öğrencinin tek ders saatini değiştirir, tek işlemde: o
  öğrencinin o dersteki o günkü kaydını siler; `kayit` `null` değilse yenisini ekler (`null` = "geldi").

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `devamsizlik` (`okul_id` `NOT NULL`, silinme kuralı yok; `sinif_id` ve `ders_id` `ON DELETE SET NULL`, `ogrenci_id` `ON DELETE CASCADE`, `durum` var/yok/gec/izinli, `aciklama`, `alan_id` `ON DELETE SET NULL`, `yil_id` → `egitim_yillari` `ON DELETE SET NULL`; `devamsizlik_ogrenci`, `devamsizlik_ders_gun`, `devamsizlik_okul_gun` indeksleri) | `001-ilk.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `calistir`, `islem`), [../esleme.md](../esleme.md)
  (`devamsizlik`, `bos`, `yokIse`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.devamsizlik`): yalnız
  [../../bolumler/devamsizlik.md](../../bolumler/devamsizlik.md) — öğrencinin dökümü (`ogrencinin` + `yilSuz`), ders
  yoklama ekranı (`dersGunu`), yoklamayı kaydetme (`dersGunu` ile önceki durumlar + `dersGunuYaz`), öğrencinin günü
  (`ogrenciGunu`), tek öğrenci düzeltme (`ogrenciGunu` + `ogrenciDersGunuYaz`), okul özeti (`okulunSonKayitlari` +
  `yilSuz`).
- Tablolar: yazar `devamsizlik`; okur `dersler`, `kullanicilar`.

## Nasıl çalışır (adım adım)?

### Bir dersin yoklaması

```
POST /api/devamsizlik (ders, tarih, girisler)
  bölüm: yoklama yetkisi (ders kendisinin ya da kapsam verilmiş), ileri tarih değil
         onceki = dersGunu(ders, tarih) → durumu değişenlere bildirim için
         girisler: yalnız sınıfın öğrencileri, tekrarsız; 'var' olanlar ATLANIR
  dersGunuYaz(ders, tarih, kayitlar): islem { DELETE o dersin o günü ; INSERT yokluklar }
  devamsizlikBildir(değişenler)
```

### Tek öğrencinin düzeltilmesi

```
eski = ogrenciGunu(öğrenci, tarih).find(ders)
ogrenciDersGunuYaz(öğrenci, ders, tarih, durum === 'var' ? null : kayıt)
   islem { DELETE bu öğrencinin bu dersteki bu günü ; (kayıt varsa) INSERT }
```

## Dikkat!

- **Tekillik kısıtı yok:** tabloda `(ogrenci_id, ders_id, tarih)` için `UNIQUE` yoktur; tekliği "önce sil, sonra yaz"
  sağlar. İki kişi aynı dersin aynı gününü AYNI ANDA kaydederse iki işlem de kendi satırlarını ekleyebilir: satır yoksa
  ikisi de beklemeden siler-yazar; satır varsa ikinci `DELETE` birincinin bitmesini bekler ama birincinin YENİ eklediği
  satırları görmez (PostgreSQL varsayılanı `READ COMMITTED`). Sonuçta aynı öğrenci için iki kayıt oluşur ve döküm iki
  devamsızlık sayar. Olasılık düşük (bir derse bir öğretmen), ama kısıt eklenirse ([../sema.md](../sema.md) — yeni şema
  dosyası) tamamen kapanır.
- **`dersGunuYaz` o günün BÜTÜN kayıtlarını siler:** bölüm yeni listeyi yalnız sınıfın ŞİMDİKİ öğrencilerinden kurar.
  Öğrenci sınıf değiştirdikten sonra eski sınıfının o günkü yoklaması yeniden kaydedilirse, öğrencinin o günkü eski
  kaydı da silinir (tek öğrenci düzeltme ucu bunu korur, toplu yoklama korumaz).
- **Ders silinince** kayıtlar kalır ama `ders_id` `NULL` olur: dökümde görünür, `dersGunu` ile bulunamaz ve o günün
  yoklaması yeniden alınırsa onlar silinmez.
- **Okul ve kişi kapsamı bölümde:** okuma işlevleri kimlikle çalışır; `ogrencinin` bütün okulları döndürür, hangi
  kaydın kime görüneceğini (veli: çocuğunun okulları ve geçmiş okulları; personel: kendi okulu) bölüm `bakisKisisi` ve
  `yilSuz` ile süzer.
- **`aciklama`'nın şemada uzunluk sınırı yok;** bölüm 200 karaktere kırpar.
- **`okul_id` CASCADE değildir** (001); okul satırı silinmediği için sorun çıkmaz.
- **Güvenlik:** bütün değerler parametreyle. Saklama süresi yok: kayıtlar süresiz durur.

## Testleri

- `testler/test-devamsizlik.js` — ders açma, öğretmenin kendi dersi, yoklama ekranı (varsayılan "geldi"), kaydetme
  (yalnız devamsızlık yazılır, "var" tutulmaz), öğrenci dökümü (ayrıntı, kim aldı, gelenin kaydı yok), velinin
  çocuğunu görmesi ve başkasınınkini görememesi, aynı günün yeniden alınması (eski kaydın üzerine yazılır, kayıt
  tekrarlanmaz — `dersGunuYaz`), ileri tarih reddi, müdürün okul özeti (öğrenciler, sınıf adı), öğrencinin özeti
  görememesi, başka öğretmenin ve öğrencinin yoklama alamaması.
- `testler/test-egitim-yili.js` — devamsızlık kayıtlarının yıla bağlanması ve yıla göre süzülmesi (dolaylı).
- Elle: bir derste iki öğrenciyi "gelmedi" işaretle, sonra birini "geldi" yapıp yeniden kaydet → dökümde yalnız öteki
  kalmalı.

## Son durum

- Tek commit: `e4fe108 commit 37` (2026-08-28) — dosya bu hâliyle eklendi; o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): tekillik kısıtının olmaması (eşzamanlı kayıtta çift satır), toplu yoklamanın
  sınıftan çıkmış öğrencinin o günkü kaydını silmesi, ders silinince `ders_id`'si boşalan kayıtlar.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Yıl geçişi" (yeni yıl sihirbazı, mezunlar) kayıtların `yil_id`'sine
  dayanır; "Optimizasyon + saklama süreleri" öğrenci/veli için "yalnız son 1 geçmiş yıl" kuralını getirecek (eski yılların
  devamsızlık kayıtları görünümden ya da tablodan düşer); "Güvenlik denetimi" tekillik kısıtını ele alabilir.
