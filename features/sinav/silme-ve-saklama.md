# Sınavlar · Silme, eğitim yılı ve saklama

**Durum:** Kodda var; tasarımda ek olarak öğrenci ve velinin yalnız aktif ve bir önceki yılı görmesi, mezunların eski sonuçlarını salt okunur görmesi, yıl sonu arşivinde ve okul yedeğinde sınavlar.

Sınav kayıtlarının ne zaman ve nasıl silindiği, hangi eğitim yılına ait olduğu, okul değiştiren öğrencinin notlarına ne olduğu ve
ne kadar saklandığı.

## Ne işe yarar

Sınav notu okulun resmî olmayan ama önemli kaydıdır: öğretmen yanlış açtığı sınavı silebilmeli, ama notlar kendiliğinden
kaybolmamalı. Kullanıcı 27 Eylül'de **"öğrenci dediğim şekilde ilk müdür açınca duracak"** dedi: öğrencinin ders kayıtları (ödev,
sınav, devamsızlık …) otomatik silinmez; ayrıca **"öğrenci geçmiş yılını da sadece son 1 yıl görebilecek"** dedi.

## Nereden açılır

- **Silme:** "Sınavlar" sayfasında sınavın **"Sil"**i, grubun **"Grubu sil"**i, şablonun **"Sil"**i, "Değer alanları"nda satırın
  **"Sil"**i ve değer tablosunda kutuyu boşaltmak ([Sınavlar listesi](sinavlar-listesi.md), [Sınav grupları](sinav-gruplari.md),
  [Şablonlar](sablonlar.md), [Ölçümler ve formül](olcumler-ve-formul.md), [Not (değer) girişi](not-girisi.md)).
- **Eğitim yılı:** üst şeritteki yıl seçicisi ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).

## Adım adım

### Öğretmen

**Neyi silebilirsin, ne olur**

| Ne | Nasıl | Ne gider |
|---|---|---|
| Bir değer | Kutuyu boşalt, "Kaydet" | Yalnız o öğrencinin o ölçümdeki değeri |
| Bir ölçüm (alan) | "Değer alanları"nda satırın "Sil"i, "Kaydet" | O ölçüm ve bütün öğrencilerin o ölçümdeki değerleri |
| Bir sınav | "Sil" → "Bu sınav ve girilmiş bütün değerleri silinsin mi?" | Sınav, ölçümleri, bütün değerleri |
| Bir grup | "Grubu sil" → "Sınav grubu ve içindeki tüm sınavlar silinsin mi?" | Grup, içindeki **bütün sınavlar**, ölçümleri ve değerleri |
| Bir şablon | "Sil" → "Şablon silinsin mi? …" | Yalnız hiç kullanılmamışsa şablon; kullanılmışsa silinmez |

Hiçbiri geri alınmaz; silinen sonuç için öğrenciye bildirim gitmez.

Tasarımda sınav silme penceresi ne gideceğini söyler: **"12 öğrencinin girilmiş değerleri de silinir."** ya da **"Sınav öğrencilerin
takviminden de kalkar."** ([Sınavlar listesi](sinavlar-listesi.md)).

**Eğitim yılı**

1. Açtığın sınav ve grup, açıldığı **eğitim yılına** damgalanır. Listeler üstteki yıl seçicide seçili yılın kayıtlarını gösterir.
2. Geçmiş bir yıl seçiliyken o yılın sınavlarına bakarsın ama değiştiremezsin: sınav ya da grup açmak, değer girmek, alan
   değiştirmek, silmek **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif
   yıla dön."** ile reddedilir.
3. Şablonlar yıla bağlı değildir: her yılda aynı şablonlar kullanılır, geçmiş yıla bakarken de düzenlenebilir.

### Müdür

- Bugünkü sitede yalnız kendi sınavlarını ve gruplarını siler; okulun şablonlarını (kullanılmamışsa) siler. Öğretmenin sınavını
  silemez.
- Yeni eğitim yılı açınca eski yılın sınavları arşivde kalır; okulun öğretmenleri ve müdür bütün yılları görür
  ([Yeni eğitim yılı açma ve aktif yıl](../egitim-yili/yil-acma.md)).
- Tasarımda (spec-yil-gecisi): yeni yıl açılırken biten yıl **yıl sonu arşivine** alınır (içindeki Excel'de "not/sınav sonuçları"
  sayfası; yalnız müdür ve "Eğitim yılı" yetkilisi indirir, her okulda en çok bir arşiv); **okul yedeği** sınavları ve notları da
  içerir ([Okul yedeği](../egitim-yili/okul-yedegi.md), [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md)).

### Öğrenci

- Bugün bütün yıllarının sınavlarını yıl seçiciden görürsün; okul değiştirdiysen **eski okullarının** sınavlarını da.
- Tasarımda (spec-optimizasyon, kullanıcının 27 Eylül isteği) yalnız **aktif yılı ve ondan bir önceki yılı** görürsün; daha eski yıl
  istenirse açık bir hata: **"Eski yıllar yalnız okul yönetimine açık"**. Kayıtlar silinmez, yalnız sana gösterilmez.
- Tasarımda mezun olunca eski okulunun portalı **"Mezun · <okul>"** olur; eski ödevler, notlar ve sınavlar **salt okunur** kalır, yeni
  sınav gelmez; kart mezun olduğun yıl ve bir sonraki yıl boyunca görünür ([Mezunlar](../egitim-yili/mezunlar.md)).
- Tasarımda "Verilerimi indir"in listesinde "Sınav notların, devamsızlığın, etüt ve servis kayıtların" da vardır
  ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).

### Veli

- Çocuğunun bütün okullarındaki sınavlarını görür; tasarımda öğrenciyle aynı "aktif + bir önceki yıl" kuralı.

## Kurallar ve sınırlar

- **Otomatik silme yok:** sınavlar, ölçümler ve değerler süreyle silinmez (okulun kaydı). Bildirimler ayrıdır (tasarımda 90 gün).
- **Silinince giden:** sınav silinince ölçümleri ve değerleri; grup silinince içindeki sınavlar, ölçümleri ve değerleri; ölçüm silinince
  değerleri (veritabanı zinciriyle).
- **Kullanılmış şablon silinmez:** öğrenci grafikleri şablona göre çizildiği için.
- **Öğrenci hesabı silinirse** o öğrencinin sınav değerleri de silinir.
- **Sınavı açanın hesabı silinirse** sınav kalır ama sahipsiz olur: öğrenciler sonucu görmeye devam eder, bugünkü ekranlarda kimse o
  sınavı açıp değiştiremez (kod okumasına göre). Şablonun açanı silinirse şablonu yalnız müdür değiştirir.
- **Nakil:** öğrenci başka okula geçince eski okulun sınavları eski okulda kalır; yeni okulun öğretmeni ve müdürü onları görmez (grafik ve
  listeler yalnız kendi okulunun sınavlarını getirir); öğrenci ve velisi hepsini görür ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).
- **Sınıf değişince:** değer tablosu öğretmenin bugünkü öğrencilerini gösterir; sınıfı değişen öğrencinin girilmiş değeri tabloda görünmez
  ama kayıtta durur ve öğrencinin Sınavlarım'ında görünür.
- **Geçmiş yıl salt okunur:** öğretmen ve müdürün sınav istekleri 409 ile reddedilir; şablonlar muaf.
- **Bölüm kapatma** kayıt silmez.
- **KVKK:** sınav notları aydınlatma metninde işlenen veriler arasında; saklama süreleri tablosu tasarımda bu kurallarla güncellenir
  ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Sınavlar listesi](sinavlar-listesi.md), [Sınav grupları](sinav-gruplari.md), [Şablonlar](sablonlar.md),
  [Ölçümler ve formül](olcumler-ve-formul.md), [Not (değer) girişi](not-girisi.md) — silme düğmeleri.
- [Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md).
- [Sınavlarım](sinavlarim.md) — öğrencinin gördüğü yıllar ve okullar.

**İlgili:**

- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Yeni eğitim yılı açma ve aktif yıl](../egitim-yili/yil-acma.md),
  [Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md), [Mezunlar](../egitim-yili/mezunlar.md),
  [Okul yedeği](../egitim-yili/okul-yedegi.md).
- [Öğrenci nakli](../hesaplar/ogrenci-nakli.md), [Verilerimi indir](../ayarlar/verilerimi-indir.md),
  [Hesabımı sil](../ayarlar/hesabimi-sil.md).
- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `POST /api/exams/<id>/delete`, `POST /api/examgroups/<id>/delete`,
  `POST /api/exams/sablonlar/<id>/delete` (`sablonunSinavSayisi`), `POST /api/exams/<id>/olcumler`; yıl damgası ve süzgeci
  [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md) (`yilDamgasi`, `yilSuz`, `bakisKisisi`); arşiv kapısı
  [sunucu/api.md](../../sunucu/api.md); öğrencinin görünümü [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md).
- Depo ve şema: [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`sil`, `grupSil`, `olcumleriYaz`, `degerleriYaz`);
  zincirleme silmeler ve "açan" alanının boşalması [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (`sinavlar.grup_id` →
  CASCADE, `sinav_olcumleri` ve `sinav_degerleri` → CASCADE, `ogretmen_id` → SET NULL).
- Testler: [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md), [testler/test-sinav.md](../../testler/test-sinav.md).

## Sık sorulanlar

- **Grubu sildim, sınavlar da gitti mi?** Evet; grup içindeki bütün sınavlarla birlikte silinir.
- **Notlar kaç yıl saklanıyor?** Süreyle silinmez. Tasarımda öğrenci ve veli yalnız aktif ve bir önceki yılı görür; okul hepsini görür.
- **Okul değiştirdim, eski notlarım nerede?** Sende ve velinde yıl seçiciden görünür; yeni okulun görmez.
- **Geçen yılın sınavını silmek istiyorum.** Geçmiş yıl salt okunurdur; silinemez.

## Sırada

- Optimizasyon + saklama süreleri (iş 7): öğrenci ve velinin yalnız aktif ve bir önceki yılı görmesi, bildirimlerin 90 gün sonra silinmesi.
- Yıl geçişi (iş 9): yeni yıl sihirbazı, mezunlar, yıl sonu arşivi, okul yedeği.
