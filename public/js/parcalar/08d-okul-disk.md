# public/js/parcalar/08d-okul-disk.js

Okulun dosya alanı (okul başına disk sınırı) görünümü: "3,2 GB / 5 GB" yazan doluluk çubuğu (%80'de turuncu, %95'te
kırmızı), dosya türlerine göre dağılım satırı ve müdürün ana sayfasındaki "Okulun dosya alanı" kartı.

## Bu dosya ne yapar?

Sunucunun diski bütün okullar arasında paylaşılır; bir okulun durmadan video yüklemesi öbür okullara yer bırakmasın diye
her okulun bir dosya alanı sınırı vardır ([../../../sunucu/bolumler/okul-disk.md](../../../sunucu/bolumler/okul-disk.md)).
Sınıra okulun dosyaları sayılır: öğrencilerin ödev teslim dosyaları, ödev ve mesaj ekleri, okul sayfası fotoğrafları.
Yazılar, notlar, yoklamalar (veritabanı) sayılmaz.

Bu küçük dosya o alanın ekrandaki hâlidir:

- Müdür ana sayfasında "Okulun dosya alanı" kartını görür: "Kullanılan 3,2 GB / 5 GB" çubuğu, "Ödev teslim dosyaları 2,1
  GB · Ekler 1 GB · Okul sayfası fotoğrafları 4 MB. Yazılar, notlar ve öbür kayıtlar bu alana sayılmaz." ve doluluğa göre
  uyarı: %80'i geçince turuncu "Alanın %85'i doldu. Teslim dosyaları son teslimden 7 gün sonra, ekler 7 gün sonra
  kendiliğinden silinir; …", dolunca kırmızı "Okulunun dosya alanı doldu. …".
- Sistem yöneticisi de aynı çubuğu ve dağılım satırını yönetim panelinin Okullar ekranında kullanır (tablo hücresinde
  sıkışık hâliyle ve okul düzenleme penceresinde); bayt → "GB/MB" yazan `diskYaz` yönetim ekranlarının her yerinde geçer.

Kim görür: müdür (ana sayfa kartı; sunucu `disk`'i yalnız müdüre gönderir) ve sistem yöneticisi (yönetim paketi).

## İçinde neler var?

- `OKUL_DISK_DOLU` — dolu alanın metni: "Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da
  yöneticiden alan isteyebilir." Sunucunun yükleme reddinde gönderdiği `OKUL_DOLU` ile harfi harfine aynı; yalnız bu
  dosyada (kartta) kullanılır.
- `diskYaz(n)` — bayt → metin: 1 GB ve üstü bir ondalıklı GB ("3,2 GB", "5 GB"); 10 MB ve üstü tam sayı MB ("820 MB");
  0'dan büyük ve 10 MB altı bir ondalık, en az "0,1 MB"; 0 (ya da sayı olmayan) → "0 MB". Sayılar `sayiTR` ile Türkçe
  (virgül ondalık, nokta binlik). Sunucudaki `boyutYaz` ile aynı kurallar.
- `okulDiskOrani(d)` — `kullanilan / sinir × 100` (ondalıklı); `d` ya da `sinir` yoksa 0.
- `okulDiskSinifi(d)` — renk sınıfı: oran ≥ 95 → `' dolu'` (kırmızı), ≥ 80 → `' az-kaldi'` (turuncu), altı `''` (yeşil).
- `okulDiskCubugu(d, etiket, kucuk)` — `d = { kullanilan, sinir }` (bayt). Döner:
  `div.doluluk.okul-disk[.az-kaldi|.dolu][.sikisik]` → üst satırda etiket (`esc`'li) ve "3,2 GB / 5 GB"; altında
  `role="progressbar"` çubuk (`aria-label` etiket, `aria-valuemin` 0, `aria-valuemax` 100, `aria-valuenow` yuvarlanmış
  yüzde, 0–100 arasına kırpılmış) ve dolan kısım `<i style="width:N%">`. `kucuk` doğruysa `sikisik` (tablo hücresi için).
- `okulDiskDagilimi(dag)` — "Ödev teslim dosyaları 2,1 GB · Ekler 1 GB · Okul sayfası fotoğrafları 4 MB" (`dag = {
  teslim, ek, foto }`, bayt; eksik alan "0 MB").
- `okulDiskKarti(d)` — müdürün kartı: `div.kart.okul-disk-kart`, başlık kutu simgesiyle "Okulun dosya alanı",
  `okulDiskCubugu(d, 'Kullanılan')`, dağılım + "Yazılar, notlar ve öbür kayıtlar bu alana sayılmaz."; sonra:
  - `kullanilan >= sinir` → `div.msg.hata[role="status"]` `OKUL_DISK_DOLU`;
  - değilse oran ≥ 80 → `div.msg.uyari` "Alanın %N'i doldu. Teslim dosyaları son teslimden 7 gün sonra, ekler 7 gün
    sonra kendiliğinden silinir; gerekirse sistem yöneticisinden alan isteyebilirsin." (N aşağı yuvarlanmış yüzde);
  - değilse ileti yok.

## Kimle konuşur?

- Çağırdıkları: `esc`, `sayiTR` ([01-yardimcilar.md](01-yardimcilar.md)), `ik('kutu')` ([02-ikonlar.md](02-ikonlar.md)).
  Sunucuya kendisi istek atmaz.
- Veri kaynağı:
  - Müdürün kartı: `GET /api/school/ozet` cevabındaki `disk` = `{ kullanilan, sinir, siniriMb, ozel, dagilim: { teslim,
    ek, foto }, oran }` — yalnız müdüre gelir ([../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md);
    hesap `okul-disk.js` `durum`).
  - Yönetim ekranları: `GET /api/admin/overview`'daki okulların `disk`'i
    ([../../../sunucu/bolumler/yonetici.md](../../../sunucu/bolumler/yonetici.md)).
- Onu kullananlar:
  - [08-ana-sayfa.md](08-ana-sayfa.md) — `okulDiskKarti(o.disk)` (müdürün ana sayfası, `o.disk` geldiyse).
  - `public/js/yonetim/09d-okul-disk.js` — `okulDiskCubugu` (Okullar tablosundaki sıkışık hücre "Özel sınır" /
    "Varsayılan"; Okullar → Düzenle penceresinde "Bu okula özel sınır" / "Varsayılan sınır"), `okulDiskDagilimi`
    ("… Veritabanı sayılmaz."), `diskYaz` (öneri yazısı, sistem kartı: ayrılan, kullanılan, diskteki boş yer,
    veritabanı, mutabakat).
  - `public/js/yonetim/09-yonetici.js` — `diskYaz` (okul açıldı penceresindeki "Disk sınırı").
  - `public/js/yonetim/09b-site-ayarlari.js` — `diskYaz` (varsayılan okul disk sınırının "kodun varsayılanı").
  - `OKUL_DISK_DOLU`, `okulDiskOrani`, `okulDiskSinifi` yalnız bu dosyada.
- Görünüm: `public/css/parcalar/02-form.css` (`.doluluk`, `.doluluk-ust`, `.doluluk-cubuk` ve `i`; ekler çubuğuyla aynı
  temel), `36-ayar-kartlari.css` (`.doluluk.okul-disk` yeşil, `.az-kaldi` turuncu, `.dolu` kırmızı; `.okul-disk-kart`;
  `.doluluk.sikisik`), `02-form.css` (`.msg.hata`, `.msg.uyari`), `04-kartlar.css` (`.kart`).
- Rol: müdür ve sistem yöneticisi.

## Nasıl çalışır (adım adım)?

```
müdür ana sayfası (08-ana-sayfa.js) ─► GET /api/school/ozet ─► o.disk = { kullanilan: 4 GB, sinir: 5 GB, dagilim }
  okulDiskKarti(o.disk)
    okulDiskOrani = 80 ─► okulDiskSinifi → ' az-kaldi' (turuncu çubuk)
    okulDiskCubugu(d, 'Kullanılan') ─► "Kullanılan  4 GB / 5 GB" + %80 çubuk
    okulDiskDagilimi ─► "Ödev teslim dosyaları … · Ekler … · Okul sayfası fotoğrafları …"
    kullanilan < sinir, oran ≥ 80 ─► turuncu "Alanın %80'i doldu. …"
```

Sınır sunucuda uygulanır: yükleme sığmıyorsa sunucu 507 ve `OKUL_DOLU` iletisiyle reddeder
([04d-ekler.md](04d-ekler.md), `14b-odev-teslim.js`, okul sayfası fotoğrafları). Bu dosya yalnız gösterir.

## Dikkat!

- **İki eşik iki farklı anlamda.** Çubuğun rengi %80'de turuncu, %95'te kırmızıdır; kart iletisi ise %80'de turuncu
  uyarı, ancak TAM dolunca (`kullanilan >= sinir`) kırmızı "doldu" der. %95–99 arasında çubuk kırmızı, ileti turuncudur;
  bilerek böyle (renk yaklaştığını, ileti gerçek durumu söyler). Sunucunun müdüre ve yöneticiye bildirimi ise iki
  seviyelidir, her biri bir kez: kaydedilen bir dosya kullanımı %80'in üstüne çıkarınca "%80'i doldu", bir yükleme
  SIĞMADIĞI için reddedilince "doldu" (`okul-disk.js` `doldu`; kullanım o an %100'ün altında olabilir).
- **Türkçe ek hatası.** "Alanın %N'i doldu" eki sabit "'i"dir; yalnız 80, 81, 85, 88, 91, 95, 98'de doğru. %82, %87,
  %92, %97'de "'si", %83, %84, %93, %94'te "'ü", %86 ve %96'da "'sı", %90'da "'ı", %89 ve %99'da "'u" olmalı. Metni
  "Alanın %N'i doldu" yerine "Alan %N dolu" gibi eksiz bir kalıba çevirmek önerilir (kod değiştirilmedi). Sunucunun
  "%80'i" bildirimi sabit 80 olduğu için doğru.
- **Dolu iletisi müdüre hitap etmiyor.** `OKUL_DISK_DOLU` aslında yükleyemeyen öğrenci/öğretmen için yazılmış ("Okul
  yönetimi eski dosyaları sildirebilir…"); müdürün kartında da aynısı çıkıyor, oysa okul yönetimi müdürün kendisi.
  Karta özel bir metin daha uygun olurdu.
- **"Doldu" iki yerde farklı anlamda.** Sunucu, sığmayan her yüklemeyi (alan %87 dolu olsa bile) "Okulunun dosya alanı
  doldu." diye reddeder ve aynı anda müdüre (bir kez) "Okulun dosya alanı doldu (<sınır>). Yeni dosya yüklenemiyor…"
  bildirimi gönderir; müdürün kartı ise kullanım tam sınıra ulaşmadıkça "Alanın %87'i doldu" der. Aynı anda öğretmen
  "doldu", müdür bildiriminde "doldu", kartında "%87" görebilir; küçük dosyalar hâlâ sığıyor olabilir. Kod okumasına
  göre (`testler/test-okul-disk.js` de "doldu" bildirimini sığmayan bir ekle tetikliyor).
- **`OKUL_DISK_DOLU` sunucuyla elle eşit tutulur.** Sunucudaki `OKUL_DOLU`'yu değiştirirsen burayı da değiştir.
- **Ön yüzde üç ayrı boyut yazıcısı var.** `boyutYaz` ([01-yardimcilar.md](01-yardimcilar.md): "812 B", "34 KB"),
  `boyutYazi`/`mbSayi` ([04d-ekler.md](04d-ekler.md): KB'yi de `sayiTR` ile, bayt yazmaz) ve buradaki `diskYaz` (GB/MB,
  KB yok). Her biri kendi yerinde doğru; yeni bir ekranda hangisinin sunucunun iletileriyle uyuşacağına bak (disk
  iletileri `diskYaz` gibi yazar).
- **Sınır 0 ya da küçültülmüş sınır.** `sinir` 0 ise oran 0 kabul edilir (sıfıra bölme yok) ama `kullanilan >= sinir`
  doğru olduğundan kart "doldu" der (sunucu sınırı en az 1 MB tuttuğu için beklenmez). Yönetici sınırı kullanımın
  altına indirirse çubuk %100'de kırpılır, ileti "doldu" olur; dosyalar silinmez, yalnız yeni yükleme durur.
- Yönetici ekranları bu dosyanın işlevlerini kullandığı için bunlar herkese giden pakette durur; içlerinde yönetici ucu
  ya da `/admin` adresi yoktur (`testler/test-admin-gizli.js` denetimi etkilenmez).

## Testleri

- `testler/test-okul-disk.js` — ekler, teslim dosyaları ve okul sayfası fotoğraflarının okulun kullanımına girip
  silinince düşmesi, dolunca yüklemenin 507 ve `OKUL_DOLU` ile reddi, %80 bildiriminin ve (sığmayan ekle tetiklenen)
  "doldu" bildiriminin birer kez gitmesi, kullanım %70'in altına inince %80 bildiriminin yeniden kurulması,
  müdürün `/school/ozet`'te `disk`'i (kullanılan, sınır, dağılım) görmesi, öğretmenin görmemesi, yöneticinin sınırı
  değiştirmesi. `tumtest.sh` bu paketi `EE_OKUL_DOSYA_GB=0.001` (1 MB varsayılan) ile açar ki küçük dosyalarla dolsun.
- Bu dosyanın biçim işlevlerini (`diskYaz` vb.) doğrudan deneyen bir test yok.
- Elle: test sunucusunda (`EE_OKUL_DOSYA_GB=0.001` ile) öğretmenle 900 KB'lık bir ek yükle → müdürün ana sayfasında
  çubuk turuncu ve "Alanın %87'i doldu"; 200 KB'lık bir ek daha dene → sığmadığı için 507 ile reddedilir, kart turuncu
  kalır (kullanım sınıra ulaşmadı) ama müdürün bildirimlerine "Okulun dosya alanı doldu" düşer. Kartta kırmızı "doldu"
  için kullanımın tam sınıra ulaşması gerekir.

## Son durum

- `git log`: 1 commit. Dosya `40fc7e7 commit 525` (2026-09-27, okul disk sınırı + telefonda küçültme) ile bugünkü
  hâliyle eklendi: `OKUL_DISK_DOLU`, `diskYaz`, `okulDiskOrani`, `okulDiskSinifi`, `okulDiskCubugu`,
  `okulDiskDagilimi`, `okulDiskKarti`. Aynı commit müdürün ana sayfasına kartı ve yönetim paneline sınır ekranlarını ekledi.
- Bilinen açıklar (kod değiştirilmedi): "%N'i" ek hatası, müdüre hitap etmeyen dolu iletisi, sunucunun "doldu"
  bildirimi/reddi ile kartın "%N" iletisinin aynı anda farklı şey söylemesi (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Sunucuda küçültme … aynı dosya tek kopya" (iş 1: kullanım hesabı değişir,
  kart aynı veriyi gösterir); "Paneller" (iş 5: okul gezgininde simgenin altında "27.09.2026 · 1,2 GB", `/duzenle` okul
  sayfalarında disk ve yedek sınırı alanları — bu çubuk ve `diskYaz` orada da kullanılacak); "Optimizasyon + saklama
  süreleri" (iş 7) ve "Yıl geçişi" (iş 9: okul yedeği) alanın dolma hızını ve dağılımını etkiler; "Çok dil" (iş 22).
