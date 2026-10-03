# testler/sql-denetimi.js

Sunucu kodunu metin olarak tarayıp SQL'in yalnız `sunucu/veri/` altında yazıldığını, veri katmanının istek nesnesini hiç
görmediğini, ters tırnaklı şablon metin kullanmadığını ve her `sorgu`/`tek`/`calistir`/`metinCalistir` çağrısında SQL metnine
yalnız sabit ve izinli parçaların karıştığını denetleyen sunucusuz denetim.

## Bu dosya ne yapar?

SQL enjeksiyonuna karşı projenin tek ve kesin kuralı şu: kullanıcıdan gelen hiçbir değer SQL metnine yapıştırılmaz, değerler
her zaman `$1, $2 …` parametresiyle gider ([../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)). Kural kâğıt üstünde
kalmasın diye bu dosya bütün sunucu kodunu her test koşusunda okuyup denetler. Dosyanın başındaki yorum dört kuralı sayar:

1. SQL yalnız `sunucu/veri/` altında yazılır. Bölümler (`sunucu/bolumler/`) ve öteki sunucu dosyaları veritabanına yalnız
   depo işlevleriyle gider.
2. `sunucu/veri/` istek nesnesini hiç görmez: `req`, `body.`, `q.get(` yok.
3. `sorgu` / `tek` / `calistir` / `metinCalistir` çağrılarının ilk argümanı (SQL metni) yalnız şunlardan birleştirilebilir:
   tırnak içindeki sabit metin, BÜYÜK_HARFLİ sabitler, `tr()` ve `AD_SIRASI()`, depo içinde sabit parçalardan kurulan
   `kosul`, `adDogrula(...)`'dan geçmiş tablo/sütun adları.
4. Ters tırnaklı şablon metin (`` `…${x}…` ``) veri katmanında yok.

Sunucu çalıştırmaz, veritabanına bağlanmaz; birkaç saniyede biter. `testler/tumtest.sh` onu en sonda, sunucusuz denetimlerin
üçüncüsü olarak çalıştırır; çıkış kodu 0 değilse "DENETIM SORUNU" sayılır. SQL yazan her iş kendi başına da koşmalı
(`node testler/sql-denetimi.js`).

## İçinde neler var?

Dışa açılan bir şey yok; yukarıdan aşağı çalışan bir betik.

### Yardımcılar

- `KOK`, `SUNUCU` (`sunucu/`), `VERI` (`sunucu/veri/`).
- `sonuc(ad, tamam, ayrinti)` — geçeni yalnız sayar; kalanı `  KALDI <ad>` ve altında girintili ayrıntıyla yazar.
- `dosyalar(klasor)` — klasördeki bütün `.js` dosyaları, alt klasörler dahil.
- `yorumsuz(kod)` — `//` ve `/* … */` yorumlarını siler (yorumdaki bir "SELECT" sözcüğü 1. kuralı yanıltmasın); tırnak
  içindeki metinlere dokunmaz. Düzenli ifadeleri kaba bir kuralla tanır: önceki anlamlı karakter `= ( , : ! & | ? { } ;`
  ise `/` bir düzenli ifade başlatır.
- `ilkArguman(kod, bas)` — açılan parantezden sonraki ilk argüman: üst düzeydeki ilk virgüle ya da kapanan paranteze kadar
  (tırnakları ve iç içe parantezleri izler).
- `toplamParcalari(ifade)` — ifadeyi üst düzeydeki `+` işaretlerinden böler: `"a + 'b' + c(d + e)"` → `a`, `'b'`, `c(d + e)`.
- `SABIT_METIN` — tek ya da çift tırnaklı düz metin (ters tırnak değil).
- `IZINLI` — SQL metnine karışmasına izin verilen parçalar:

  | Kalıp | Örnek | Bugün nerede kullanılıyor (3 Ekim'de denetimin kendi işlevleriyle sayıldı) |
  |---|---|---|
  | `^[A-Z][A-Z0-9_]*$` | `SEC`, `ALANLAR`, `PROGRAM_SIRA`, `YENI_ONCE` | 14 depo dosyası (ör. `depo/kullanicilar.js`, `depo/siniflar.js`, `depo/mesajlar.js`, `depo/odevler.js`, `depo/anketler.js`) |
  | `SABIT.join('…')` | `TABLOLAR.join(', ')` | `json-aktarim.js` |
  | `(secim ? 'sabit' : 'sabit')` | `(mesajMi ? 'mesaj_id' : 'odev_id')`, `(kilitleMi ? ' FOR UPDATE' : '')` | `depo/ekler.js`, `depo/hatirlaticilar.js`, `depo/quiz.js`, `depo/roller.js` |
  | `tr()` | Türkçe sıralama eki | altı depo dosyası (`etutler`, `kullanicilar`, `okullar`, `roller`, `sinavlar`, `siniflar`) |
  | `AD_SIRASI()`, `(sira \|\| AD_SIRASI())` | ad sırası | yalnız ikincisi, `depo/kullanicilar.js`'te; tek başına `AD_SIRASI()` bugün bir çağrının argümanında geçmiyor |
  | `kosul`, `kosul.join('…')` | sabit parçalardan kurulan WHERE | `kosul`: `depo/genel.js`, `depo/kullanicilar.js`, `depo/mesajlar.js`, `depo/odevler.js`; `kosul.join` bugün kullanılmıyor |
  | `adDogrula(x)`, `yaz.adDogrula(x)` | doğrulanmış tablo/sütun adı | `adDogrula`: `yazici.js`; `yaz.adDogrula`: `json-aktarim.js` |

- `DOSYA_IZNI` — yalnız `yazici.js` için ek izin: `adlar.join(', ')`, `yerler.join(', ')`, `atamalar.join(', ')`,
  `(adlar.length + 1)`. Orada sütun adları `adDogrula`'dan geçmiş, yer tutucular (`$1`, `$2`) sayıdan üretilmiştir
  ([../sunucu/veri/yazici.md](../sunucu/veri/yazici.md)).

### Denetimler

1. **SQL yalnız veri katmanında** — `sunucu/` altında `sunucu/veri/` dışındaki her `.js` için bir kontrol: yorumsuz metinde
   `SQL_KALIBI` (bir tırnağın hemen ardından `SELECT `, `INSERT INTO `, `UPDATE <tablo> SET `, `DELETE FROM `, `TRUNCATE `,
   `DROP `; büyük/küçük harf fark etmez) geçmemeli.
2. **İstek nesnesi veri katmanında yok** — `sunucu/veri/` altındaki her dosyada `req`, `body.`, `q.get(` geçmemeli.
3. **Şablon metin yok** — aynı dosyalarda `` `…${ `` geçmemeli.
4. **Parametreli sorgu** — her `sorgu(`, `tek(`, `calistir(`, `metinCalistir(` çağrısının ilk argümanı parçalara bölünür; her
   parça ya sabit metin ya da `IZINLI`/`DOSYA_IZNI` kalıplarından biri olmalı. Kalırsa `Parametreli sorgu: <dosya>:<satır>` ve
   "SQL metnine karışan: …". Atlananlar: işlevin kendi tanımı (`async function sorgu(`) ve ilk argümanı yalnız `metin` ya da
   `sql` olan çağrılar (yorum: "baglanti.js içindeki iletme").
5. **Gerçekten sorgu bulundu mu** — 50'den fazla çağrı incelenmiş olmalı (tarayıcı bir şeyi kaçırıp hiçbir şey bulamazsa
   "temiz" sanılmasın).

Çıktı: `--- SQL denetimi ---`, yalnız kalan kontroller, `  N sorgu çağrısı incelendi`, `GECTI: x  KALDI: y`; bir kontrol
bile kaldıysa çıkış 1.

### 3 Ekim'deki çıktı

Bu belge yazılırken çalıştırıldı: `485 sorgu çağrısı incelendi`, `GECTI: 619  KALDI: 0`, çıkış 0. 619 = veri katmanı dışındaki
63 dosya (1. kural) + veri katmanındaki 35 dosya × 2 (2. ve 3. kural) + 485 çağrı + 1 (sayı kontrolü).

## Kimle konuşur?

- **Çağırdıkları:** yalnız Node'un `fs` ve `path`'i; projeden hiçbir modül `require` etmez.
- **Taradığı dosyalar:** `sunucu/` altındaki bütün `.js` dosyaları. Veri katmanı: [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)
  (`sorgu`, `tek`, `calistir`, `metinCalistir` burada tanımlı), [../sunucu/veri/yazici.md](../sunucu/veri/yazici.md),
  [../sunucu/veri/json-aktarim.md](../sunucu/veri/json-aktarim.md), [../sunucu/veri/sema.md](../sunucu/veri/sema.md),
  [../sunucu/veri/index.md](../sunucu/veri/index.md), [../sunucu/veri/esleme.md](../sunucu/veri/esleme.md),
  [../sunucu/veri/yedek.md](../sunucu/veri/yedek.md) ve `sunucu/veri/depo/` altındaki 28 depo dosyası (ör.
  [../sunucu/veri/depo/kullanicilar.md](../sunucu/veri/depo/kullanicilar.md)). Geri kalanı (bölümler, yardımcılar, kök
  dosyalar) yalnız 1. kural için taranır.
- **Onu çalıştıran:** `testler/tumtest.sh` (sunucusuz denetimler döngüsü: `buton-denetimi`, `yazim-denetimi`, `sql-denetimi`).
  Çıktının son iki satırını gösterir; çıkış kodu 0 değilse `DENETIM_SORUN`'u bir artırır.
- **Onu anan belgeler:** [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md) "Dikkat!" ve "Testleri", [../TANITIM.md](../TANITIM.md)
  (kurallar ve güvenlik tablosu), bölüm ve depo belgelerinin "Testleri" bölümleri. Kodda da bir yerde adı geçer:
  `sunucu/veri/baglanti.js`'in baş yorumu ("testler/sql-denetimi.js bunu bütün kodda denetler").

## Nasıl çalışır (adım adım)?

```
sunucu/**/*.js (veri dışı)  ─► yorumsuz ─► SQL_KALIBI var mı?                       ─► 1. kural (dosya başına 1)
sunucu/veri/**/*.js         ─► yorumsuz ─► req / body. / q.get( var mı?             ─► 2. kural
                                         ─► `…${ var mı?                             ─► 3. kural
                                         ─► her sorgu( tek( calistir( metinCalistir(
                                              ilkArguman ─► toplamParcalari
                                              her parça: sabit metin mi? izinli kalıp mı?   ─► 4. kural (çağrı başına 1)
çağrı sayısı > 50 mi?                                                                ─► 5.
GECTI / KALDI ─► çıkış 0 ya da 1
```

Bir depo işlevi yazarken bilmen gereken: değeri `'… WHERE id = ' + id` diye birleştirirsen 4. kural "SQL metnine karışan:
id" der. Doğrusu `sorgu('… WHERE id = $1', [id])`. Tablo ya da sütun adını değişkenden almak zorundaysan
[../sunucu/veri/yazici.md](../sunucu/veri/yazici.md)'deki `adDogrula`'dan geçir.

## Dikkat!

- **Satır numarası kayar.** Rapordaki `<dosya>:<satır>`, yorumları silinmiş metinden sayılır; çok satırlı `/* … */` yorumlar
  satırlarıyla birlikte silindiği için gerçek satırdan küçük çıkar. 3 Ekim'de `sunucu/veri/depo/kullanicilar.js` üzerinde
  ölçüldü: denetimin 30, 34, 93 dediği çağrılar dosyada 34, 38, 110. satırlarda. Bir "KALDI" gördüğünde satıra değil, yazılan
  "SQL metnine karışan" parçaya göre ara. Kod değiştirilmedi.
- **İzinler adla verilir, içerik denetlenmez.** Büyük harfli her ad (`SEC`, `YENI_ONCE`), adı `kosul` olan her değişken ve
  ilk argümanı yalnız `metin` ya da `sql` olan her çağrı (dosya fark etmeksizin) güvenilir sayılır. Kuralın gücü bu adların
  gerçekten sabit parçalardan kurulmasına bağlıdır: büyük harfli bir sabiti ya da `kosul`'u kullanıcı değeriyle kurarsan
  denetim görmez. Bugün `metin`/`sql` muafiyeti yalnız [../sunucu/veri/baglanti.md](../sunucu/veri/baglanti.md)'deki iç iletme
  (`tek` → `sorgu(sql, …)`) ve [../sunucu/veri/sema.md](../sunucu/veri/sema.md)'deki şema dosyası çalıştırma
  (`metinCalistir(metin)`, metin diskteki `.sql` dosyasından) için kullanılıyor.
- **Yalnız dört işlev adı izlenir.** Doğrudan `….query(...)` çağrıları denetlenmez; `sunucu/` altında bugün yedi tane var,
  hepsi `baglanti.js`'in içinde: `islem`'deki `BEGIN`, `COMMIT`, `ROLLBACK`, Türkçe sıralama denetimindeki `pg_collation`
  sorgusu ve `sorgu`, `calistir`, `metinCalistir`'in kendi gövdeleri (`tek`, `sorgu`'yu çağırır).
- **Kapsam `sunucu/`.** `araclar/veritabani-kur.js`, `araclar/yuk-testi.js` ve doğrudan SQL yazan testler
  (`testler/test-cakisma.js`, `testler/test-okul-agi.js`) taranmaz; onlar kullanıcı girdisi almaz. `sunucu/veri/sema/*.sql`
  şema dosyaları da `.js` olmadığı için taranmaz.
- **1. kural her dosyada yalnız ilk eşleşmeyi gösterir** ve yalnız tırnağın hemen ardından gelen SQL sözcüklerini tanır
  (`WITH … SELECT`, parçalı yazılmış SQL ya da `ALTER`/`CREATE` görünmez).
- **Düzenli ifade tanıma kabadır.** `yorumsuz` düzenli ifadeyi yalnız önceki karaktere bakarak tanır. İçinde `/` geçen bir
  düzenli ifade (`/[/]/`) erken biter; `return` gibi bir sözcükten sonra gelen ve içinde tırnak olan bir düzenli ifade
  (`return /'/.test(x)`) tanınmaz, içindeki tırnak bir metin başlatmış sayılır. İki durumda da metin yanlış bölünür; sonuç ya
  fazladan bir "KALDI" ya da kaçan bir çağrı olur. Bugün böyle bir sorun yok (619/0).
- **Belgeler etkilemez.** Yalnız `.js` uzantılı dosyalar okunur; `sunucu/` altındaki `.md` belgeleri denetime girmez.

## Testleri

- Kendisi bir denetim. Koruduğu dosyalar: `sunucu/veri/**/*.js` (parametreli sorgu, istek nesnesinden bağımsızlık, şablon
  metin yasağı) ve `sunucu/` altındaki öteki bütün `.js` dosyaları (SQL yazmama).
- Elle (proje kökünde, sunucu gerekmez): `node testler/sql-denetimi.js` → `GECTI: … KALDI: 0`. Kuralı görmek istersen bir depo
  dosyasında geçici olarak `'… = $1', [x]` yerine `'… = ' + x` yaz: `KALDI Parametreli sorgu: … SQL metnine karışan: x`
  görmelisin (geri al).

## Son durum

- `git log`: 2 commit, ikisi de 2026-08-28. `8b95a19 commit 10` dosyanın ilk yarısını ekledi: kurallar yorumu, `sonuc`,
  `dosyalar`, `yorumsuz`, `ilkArguman`, `toplamParcalari`, `SABIT_METIN`, `IZINLI`, `DOSYA_IZNI`. `f7a8d33 commit 11` (aynı
  commit'te `araclar/veritabani-kur.js` de geldi) denetimlerin kendisini ekledi: 1. kural döngüsü, veri katmanında 2–4. kurallar,
  çağrı sayısı kontrolü, sonuç satırı ve çıkış kodu. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): kayan satır numarası; ada dayalı izinler.
- Planlı işlerden etkileyecekler: yeni tablo ve depo getiren her iş bu denetimden geçmek zorunda — "Optimizasyon + saklama
  süreleri" (silme sorguları), "Özel branş / ders" (yeni ders tablosu), "Toplantılar", "Destek talepleri", "Başarılarım",
  "Eğitim içerikleri", "Mesaj etiketleri". Yeni bir dinamik parça (ör. sıralama seçimi) gerekirse önce sabitlerden seçilen bir
  ifade olarak yaz; `IZINLI`'ye kalıp eklemek son çare olmalı. Belgeleme işinin sonunda gelecek `testler/test-belgeler.js`
  (her `.js`'in yanında `.md` var mı) bu dosyanın biçimini örnek alabilir.
