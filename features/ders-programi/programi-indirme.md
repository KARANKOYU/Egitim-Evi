# Ders programı · Programı Excel olarak indirme

**Durum:** Kodda var; tasarımda ek olarak "Kimin programı: Sınıf | Öğretmen" seçimi ve tek bir sınıfın (saatler × Pazartesi–Pazar tablosu) ya da tek bir öğretmenin programını indirme.

Okulun kurulu ders programını bir Excel dosyası olarak almak: yazdırmak, paylaşmak ya da düzenleyip geri yüklemek için.

## Ne işe yarar

Program sitede kurulur ama okulda çoğu zaman kâğıda da basılır, panoya asılır ya da başka bir programa aktarılır. İndirilen dosya
içeri aktarımla aynı sütunlardadır; satırları çoğaltıp sınıf adını değiştirerek bir şubenin programını öbürüne kopyalamak için de
kullanılır ([Programı Excel'den kurma](excelden-program.md)).

## Nereden açılır

Bugünkü site: **"Excel Aktarım"** (müdürde "Okul Düzeni" altında; öğretmende "Excel ile içe ve dışa aktarım yapar" yetkisiyle) →
**"Dışarı aktar"** sekmesi → **"Neyi indirmek istiyorsun?"** listesinde **"Ders programı"** ("Sınıf, gün, saat, ders, öğretmen") →
**"İndir"**.

Tasarımda (Tasarım 1 önizlemesi): **"Excel aktarım"** → **"Dışarı aktar"** → **"Ne indireceksin?"** → **"Ders programı"** ("sınıf ya
da öğretmen") → **"Excel"**.

## Adım adım

### Müdür

1. Excel Aktarım → **"Dışarı aktar"**. Kartın üstündeki not: "Şu anki kayıtlar Excel dosyası olarak iner. Kişi listesi içeri aktarımla
   aynı biçimdedir: düzenleyip geri yükleyebilirsin (şifreler dosyada olmaz)."
2. **"Ders programı"** satırında **"İndir"**e bas (iniş bitene kadar düğme kilitli).
3. `ders-programi.xlsx` iner. Tek sayfa, **"Ders programı"**; sütunlar **Sınıf | Gün | Başlangıç | Bitiş | Ders | Öğretmen**; okulun bütün
   sınıflarının bütün ders saatleri, sınıf adına, sonra güne ve saate göre sıralı. Ör.:
   ```
   Sınıf  Gün        Başlangıç  Bitiş  Ders       Öğretmen
   7-A    Pazartesi  09:20      10:00  Matematik  Ayşe Kaya
   7-A    Pazartesi  10:10      10:50  Türkçe     Selin Arı
   ```
   Öğretmeni atanmamış dersin "Öğretmen" hücresi boştur.
4. Bir sorun olursa ileti tarayıcının uyarı kutusunda çıkar.

### Öğretmen ve çalışan

"Excel ile içe ve dışa aktarım yapar" yetkisi olan öğretmen (tasarımda çalışan) aynı dosyayı indirir. Dosya her zaman **bütün okulun**
programıdır; "Ders programını düzenler" yetkisi bazı sınıflarla daraltılmış olsa da öbür sınıflar da dosyada gelir.

Kendi programını indirmek isteyen öğretmen için bugün ayrı bir düğme yok.

### Tasarımda (Tasarım 1 önizlemesi)

1. **"Excel"**e basınca pencere **"Ders programı · Excel"**:
   - **"Kimin programı"**: **"Sınıf"** | **"Öğretmen"**;
   - Sınıf seçiliyse **"Sınıf"** kutusu (açık olan sınıf gelir), Öğretmen seçiliyse **"Öğretmen"** kutusu (öğretmenler ad sırasıyla);
   - not: "Sütunlar: Sınıf: saatler ve Pazartesi–Pazar. Öğretmen: gün, saat, sınıf, ders. Dosya .xlsx olarak iner; Excel, LibreOffice ve
     Google E-Tablolar açar.";
   - **"Vazgeç"** / **"İndir (.xlsx)"**.
2. **Sınıf dosyası** `ders-programi-7-A.xlsx`: ilk sütun **"Saat"** ("1. ders 08:30–09:10", okulun ders saatleri dışındaki ders için
   "Ek saat 14:00–14:40"), sonra **Pazartesi … Pazar**; hücrede "Matematik (Ayşe Kaya)", öğretmensiz derste yalnız ders adı.
3. **Öğretmen dosyası** `ders-programi-ayse-kaya.xlsx`: **Gün | Saat | Sınıf | Ders**, güne ve saate göre sıralı.
4. Başarıda pencere kapanır: "ders-programi-7-A.xlsx indirildi · 7-A · 30 ders."; seçimde satır yoksa pencerede "Bu seçimle
   indirilecek satır yok."
5. Önizlemede indirme işlem kaydına "… Excel indirdi" ("ders-programi-7-A.xlsx · 7-A · 30 ders") diye yazılır; bunun için ayrı bir
   karar yok ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).

Tasarımdaki sınıf dosyası tablo biçimindedir (saatler × günler), içeri aktarımın satır satır biçimine uymaz; geri yüklemek için önce
satırlara çevrilmesi gerekir. Bu fark kodlanırken ele alınmalı.

## Kurallar ve sınırlar

- **Kim:** "Excel ile içe ve dışa aktarım yapar" (müdür her zaman). Yoksa "Bu işlem için yetkin yok". Bugünkü hazır "Müdür Yardımcısı"
  şablonunda bu yetki yok.
- **Kapsam:** bütün okul; sınıf ya da öğretmen seçimi yok (bugünkü site).
- **Eğitim yılı:** program yıla göre ayrılmadığı için geçmiş yıla bakarken de bugünkü program iner.
- **İşlem kaydı:** bugün indirme kaydedilmez.
- **Biçim:** `.xlsx`; Excel, LibreOffice ve Google E-Tablolar açar. Boş programda dosya yalnız başlık satırıyla iner.
- **Geri yükleme:** dosya içeri aktarımla aynı sütunlarda olduğu için düzenleyip "İçeri aktar"dan yüklenebilir; zaten programda olan
  satırlar "Atlandı" olur, yeni satırlar eklenir (var olan silinmez).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Ders programı](README.md)):

- [Programı Excel'den kurma](excelden-program.md) — indirilen dosyayı geri yüklemek.
- [Ders programı kurma](program-kurma.md), [Okulun ders saatleri](ders-saatleri.md) (tasarımdaki "Saat" sütunu),
  [Gün ve hafta görünümü](gun-ve-hafta-gorunumu.md), [Çakışma uyarısı](cakisma-uyarisi.md),
  [Programı yayımlama ve haber verme](yayimlama-ve-bildirim.md), [Ders programım](programim.md).

**İlgili:**

- [Dışarı aktarım](../excel-aktarim/disa-aktarim.md) — öğrenci, öğretmen ve kişi listeleriyle birlikte.
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) — `DISA_LISTE` (`program`: "Ders programı",
  `ders-programi.xlsx`), `disaKarti`, `aktarim-disa` (`dosyaIndir('/api/school/aktarim-disa?tur=program', …)`).
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `GET /api/school/aktarim-disa?tur=program` (`aktarim.yap`;
  `okulunProgrami` → Sınıf, Gün, Başlangıç, Bitiş, Ders, Öğretmen; `xlsxGonder`).
- Dosya yazımı: [sunucu/yardimci/aktarim.md](../../sunucu/yardimci/aktarim.md) (`disa`, `GUNLER`); sıralı okuma:
  [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) (`okulunProgrami`).
- Testler: [testler/test-aktarim.md](../../testler/test-aktarim.md) (dışa aktarım).

## Sık sorulanlar

- **Yalnız bir sınıfın programını indirebilir miyim?** Bugün hayır; dosya bütün okulu taşır, Excel'de süz. Tasarımda sınıf ya da
  öğretmen seçilecek.
- **Dosyayı panoya asmak için tablo biçiminde istiyorum.** Bugünkü dosya satır satırdır; Excel'in "Özet Tablo"suyla çevrilebilir.
  Tasarımdaki sınıf dosyası doğrudan tablo biçiminde.
- **Dosyada öğrencilerin adları var mı?** Hayır; yalnız sınıf, gün, saat, ders ve öğretmenin adı.

## Sırada

- Tasarım 1'deki "Ders programı · Excel" penceresi: sınıf ya da öğretmen seçimi, tablo biçimli sınıf dosyası.
- Okulun ders saatleri: dosyada "1. ders 08:30–09:10".
- Özel roller: dışarı aktarım yetkisini taşıyan yeni hazır şablonlar (öneri).
