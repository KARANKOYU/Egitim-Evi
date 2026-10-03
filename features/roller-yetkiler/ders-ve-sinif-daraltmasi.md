# Roller ve yetkiler · Ders ve sınıf daraltması

**Durum:** Kodda var; tasarımda ek olarak daraltma yetki başına değil rol başına yapılır ("Kapsam": "Ders" ve "Sınıflar"
satırları), "Kendi dersleri" ve "Kendi sınıfları" seçenekleri gelir, hazır Öğretmen rolünün de kapsamı olur ("Kendi dersleri ·
kendi sınıfları"), daraltılan yetkiler arasına "Sınav grubu açar", "Sonuçlarını görür", "Devamsızlığı görür" ve "Etüt planlar"
girer, şablonlar kapsamı da doldurur ve kapsamın özeti listede ve yetkinin yanında yazar.

Bir rolün verdiği yetkiyi okulun tamamı yerine yalnız seçilen derslerde ve sınıflarda geçerli kılmak.

## Ne işe yarar

Her ek görev bütün okulu kapsamaz: matematik zümre başkanı yalnız Matematik'te, 7. sınıfların müdür yardımcısı yalnız 7-A ve 7-B'nin
programında yetkili olsun istersin. Daraltma bunu sağlar: kişi kapsam içinde işini yapar; kapsam dışındakini yapamaz, çoğu yerde
**göremez bile** (ör. 7-A ile daraltılmış "Ders programını düzenler" 8-A'nın programını açmaz).

## Nereden açılır

- **Müdür:** **"Roller ve Yetkiler"** → bir ek rolün **"Düzenle"**si ya da **"Rol oluştur"** → daraltılabilen bir yetkinin kutusunu
  işaretle → altında **"Dersler"** ve/veya **"Sınıflar"** kutusu açılır ([Rol ekle / düzenle](rol-duzenleyici.md)).
- Hazır Öğretmen rolünün penceresinde daraltma **yoktur**.
- Tasarımda: rolün penceresinde **"Kapsam"** alanı (Branş'ın altında, Yetkiler'in üstünde); hazır Öğretmen rolünde de vardır.

## Adım adım

### Müdür

**Hangi yetkiler daraltılır (bugün):**

| Yetki | Dersler | Sınıflar |
|---|---|---|
| "Derse öğretmen olarak atanabilir" | var | — |
| "Ödev sonuçlandırır" | var | — |
| "Ders programını düzenler" | — | var |
| "Sınıfa ders ekler ve çıkarır" | — | var |
| "Öğrenciyi sınıfa yerleştirir" | — | var |
| "Derse öğretmen atar" | var | var |
| "Ödev verir" | var | var |
| "Sınav oluşturur" | var | var |
| "Sınav notu girer" | var | var |
| "Yoklama alır" | var | var |

Öbür yetkiler (ör. "Öğrenci şifresi sıfırlar", "Okulun tüm devamsızlığını görür") hep okulun tamamında geçer.

**Kilitli yetkiler daraltılamaz.** Hazır Öğretmen rolünde açık olan bir yetki ek rol penceresinde kilitlidir ("Öğretmen rolünde
var") ve altında daraltma kutusu çıkmaz. Hazır rol ilk açık geldiği için ("Derse öğretmen olarak atanabilir", "Ödev verir", "Ödev
sonuçlandırır", "Sınav oluşturur", "Sınav notu girer", "Yoklama alır") bugün ek rolde daraltabildiğin yetkiler pratikte şunlardır:
"Ders programını düzenler", "Sınıfa ders ekler ve çıkarır", "Derse öğretmen atar", "Öğrenciyi sınıfa yerleştirir". Ötekileri
daraltmak için önce o yetkiyi hazır Öğretmen rolünden kapatman gerekir (o zaman ek rolü olmayan öğretmenlerden kalkar).

**Daraltmak:**

1. Ek rolün penceresinde yetkinin kutusunu işaretle. Altında kutu(lar) açılır; başlığında **"Tümü"** işaretli gelir.
2. **"Tümü"**nün işaretini kaldır: tek tek seçenekler görünür.
   - **"Dersler"**: bugünkü sabit ders listesi — "Matematik", "Türkçe", "İngilizce", "Din Kültürü ve Ahlak Bilgisi", "Sosyal
     Bilgiler", "Fen Bilimleri", "Müzik", "Resim", "Beden Eğitimi".
   - **"Sınıflar"**: okulun sınıfları (ör. "7-A", "7-B", "8-A").
3. İstediklerini işaretle (ör. Sınıflar'da "7-A" ve "7-B").
4. **"Kaydet"**. Listede rolün etiketi daraltmayı gösterir: **"Ders programını düzenler — 7-A, 7-B"**; ikisi birden daraltılmışsa
   "Ödev verir — Matematik / 7-A, 7-B" (önce dersler, "/" sonra sınıflar).
5. Geri almak için **"Tümü"**yü yeniden işaretle (tek tek işaretler silinir) ve kaydet.

**Örnek — 7. sınıflardan sorumlu müdür yardımcısı:** "Ders programını düzenler" → Sınıflar: 7-A, 7-B; "Öğrenciyi sınıfa
yerleştirir" → Sınıflar: 7-A, 7-B; "Derse öğretmen atar" → Dersler: Tümü, Sınıflar: 7-A, 7-B. Bu kişi 7-A ve 7-B'nin programını
düzenler, öğrencilerini bu iki sınıf arasında yerleştirir; 8-A'nın programını açamaz.

**Tasarımda:**

1. Rolün penceresinde **"Kapsam"** alanı iki satırdır:
   - **"Ders"**: **"Bütün dersler"**, **"Kendi dersleri"** ve okulun dersleri tek tek ("Dersler ve branşlar" sayfasındaki dersler;
     önizlemede "Matematik", "Türkçe", "Fen Bilimleri"…, "Seçmeli: Satranç");
   - **"Sınıflar"**: **"Bütün sınıflar"**, **"Kendi sınıfları"** ve okulun sınıfları tek tek ("5-A" … "8-D").
2. Tek tek seçimler çoklu yapılır (çipe basınca seçilir, yeniden basınca kalkar); hepsini kaldırırsan "Bütün …"a döner. "Bütün
   dersler" ya da "Kendi dersleri"ne basmak tek tek seçimleri bırakır.
3. Altında özet: **"Kapsam: Kendi dersleri · kendi sınıfları · "Derse atanabilir" gibi yetkiler yalnız bu ders ve sınıflarda
   geçer."**
4. Kapsam **rolün** bütün kapsama uyan yetkilerine birden uygulanır. Kapsama uyan yetkiler: "Derse atanabilir", "Ödev verir",
   "Sınav açar", "Sınav grubu açar", "Not girer", "Sonuçlarını görür", "Yoklama alır", "Devamsızlığı görür", "Etüt planlar". Bunlardan
   biri işaretliyken adının yanında kapsamın özeti yazar (ör. "Matematik · bütün sınıflar").
5. Rol listesinde her satırın ikinci satırında özet durur: "Bütün dersler · bütün sınıflar", "Kendi dersleri · kendi sınıfları",
   "Matematik · bütün sınıflar"; dörtten çok sınıf seçildiyse ilk dördü ve "+N" (ör. "5-A, 5-B, 5-C, 5-D +3").
6. Şablon seçince kapsam da dolar: "Öğretmen" ve "Sınıf öğretmeni" → Kendi dersleri · kendi sınıfları; "Zümre başkanı" →
   Matematik · bütün sınıflar; öbürleri → Bütün dersler · bütün sınıflar ([Hazır rol şablonları](hazir-sablonlar.md)).
7. Hazır **Öğretmen** rolünün kapsamı ilk değer olarak "Kendi dersleri · kendi sınıfları"dır; müdür değiştirebilir
   ([Hazır Öğretmen rolü](hazir-ogretmen-rolu.md)).

### Öğretmen

Hazır Öğretmen rolünden gelen yetkiler daraltılmaz (bugün); ama birçok iş zaten **kendi dersinle** sınırlıdır: ör. yoklamayı
yalnız sana atanmış derse alırsın ([Devamsızlık · Kim yoklama alır](../devamsizlik/yetki-ve-kapsam.md)). Tasarımda bu, hazır rolün
"Kendi dersleri · kendi sınıfları" kapsamıyla açıkça görünür.

### Çalışan

Daraltılmış bir ek rolün varsa:

- Kapsam içindeki ders ve sınıflarda işini yaparsın; dışındakini denersen sunucu **"Bu ders ya da sınıf için yetkin yok"** der.
- Kapsam dışındaki sınıfın programını açamazsın (okumak da kapsama bağlıdır).
- Öğrenci yerleştirirken öğrencinin **eski** sınıfı da kapsamında olmalı: **"Bu öğrencinin sınıfı için yetkin yok"**; sınıfsız
  öğrenci, sınıfla daraltılmış rolün kapsamı dışında sayılır.
- Ders programını Excel'den yüklerken kapsam dışındaki sınıfın satırı hata olur: **"7-C sınıfının programını düzenleme yetkin yok"**
  ([Programı Excel'den kurma](../ders-programi/excelden-program.md)).
- Derse öğretmen atarken seçtiğin öğretmenin **"Derse öğretmen olarak atanabilir"** kapsamı o dersi içermiyorsa: **"Ayşe Kaya bu
  derse atanamaz — rolündeki ders kapsamı izin vermiyor"**.

## Kurallar ve sınırlar

- **"Tümü" varsayılandır.** "Tümü"yü kaldırıp hiçbir şey seçmeden kaydetmek de "hepsi" demektir; daraltma istiyorsan en az bir ders
  ya da sınıf seç.
- **Birleşim:** bir yetki hazır Öğretmen rolünde açıksa ek rolün daraltması onu kısmaz; geniş olan geçer
  ([Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md)).
- **Daraltmasız ek-rol yoklaması başkasının dersini açmaz:** "Yoklama alır" ek rolde daraltmasız verilirse kişi yine yalnız kendi
  dersine yoklama alır; başkasının dersini açmak için ders ve/veya sınıf seçilmelidir (ve yetki hazır rolde açıksa ek rolde
  seçilemez; yukarıda).
- **Sunucu temizler:** yalnız rolde açık yetkilerin daraltması, gerçek ders adları ve okulun kendi sınıfları kaydedilir; ikisi de
  "Tümü" olan daraltma hiç yazılmaz. Okulun kendi açtığı bir ders adı bugün listede olmadığı için daraltmadan sessizce düşer.
- **Silinen sınıf:** daraltmadaki bir sınıf silinirse etikette "?" görünür.
- **Müdür kapsamdan etkilenmez.**
- **Denetim sunucuda;** ekranda gizlemek yetmez, kapsam dışı istek 403 döner.
- **Tasarımda:** kapsam rol başınadır; bir kişinin birden çok rolü olunca kapsamların nasıl birleşeceği tasarımda yazılı değil (açık
  nokta). "Kendi dersleri / sınıfları"nın tam tanımı (kişinin atandığı dersler mi, sınıf öğretmeni olduğu sınıflar mı) önizlemede
  belirtilmedi.

## Kardeşler ve ilgili

**Kardeşler:** [Rol ekle / düzenle](rol-duzenleyici.md) · [Yetki listesi](yetki-listesi.md) ·
[Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) · [Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) ·
[Hazır rol şablonları](hazir-sablonlar.md) · [Özel roller](ozel-roller.md) · [Role branş](rol-bransi.md).

**İlgili:**

- [Sınavlar · Yetkiler ve kapsam](../sinav/yetki-ve-kapsam.md), [Devamsızlık · Kim yoklama alır](../devamsizlik/yetki-ve-kapsam.md),
  [Ödev verme](../odev/odev-verme.md) — daraltmanın en çok işe yaradığı yerler.
- [Sınıfa ders ve öğretmen atama](../siniflar-dersler/ders-atama.md), [Program kurma](../ders-programi/program-kurma.md),
  [Programı Excel'den kurma](../ders-programi/excelden-program.md).
- [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md) — tasarımda ders listesinin kaynağı.

## Kod tarafı

- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — `kapsamSecici` ("Tümü" + seçenekler),
  `rolKapsamBagla`, `rolKapsamiTopla` (boş seçim `*` = hepsi), `yetkiEtiketleri` (" — Matematik / 7-A").
- Sunucu: [sunucu/yetki.md](../../sunucu/yetki.md) — `YETKILER`'deki `kapsam` alanı (hangi yetki daraltılır), `kapsamTemizle`,
  `yetkiKapsami`, `kapsamUyar`, `yetkiVarMi` (hazır roldeki yetki daraltılmaz), `ogrenciKapsamindaMi` (sınıfsız öğrenci kapsam
  dışı); uygulandığı yerler: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (program, ders, atama, yerleştirme),
  [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md), [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md).
- Veri: [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md) — `rol_yetki_kapsamlari` (tür "ders"/"sinif", değer ders adı,
  sınıf kimliği ya da `*`).
- Testler: [testler/test-kapsam.md](../../testler/test-kapsam.md) (birleşim, kapsam içi/dışı, ödev ve derse atanma kapsamı, müdürün
  kapsamdan etkilenmemesi).

## Sık sorulanlar

- **"Ödev verir"i Matematik'e daraltmak istiyorum ama kutusu yok.** Yetki hazır Öğretmen rolünde açık, ek rolde kilitli. Ya hazır
  rolden kapatırsın ya da bu kişinin yalnız kendi dersine ödev vermesi zaten yeterlidir.
- **8-A'yı göremiyor, normal mi?** Evet; rolü 7-A ve 7-B ile daraltılmışsa öbür sınıfların programını açamaz.
- **Hiçbir sınıf seçmeden kaydettim, rol hâlâ bütün okulda geçiyor.** Boş seçim "Tümü" demektir; en az bir sınıf seç.

## Sırada

- Özel roller (iş 24): rol başına kapsam, "Kendi dersleri" / "Kendi sınıfları", hazır rolün kapsamı, şablonla gelen kapsam.
- Özel branş / ders (iş 36): ders listesinin okulun kendi derslerinden gelmesi (bugün kendi dersi daraltmadan düşer).
- KILAVUZ düzeltmesi: "Ders ve sınıf daraltması" örneği hazır rolde kilitli yetkileri daraltıyor (raporlandı).
