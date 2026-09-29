# sunucu/veri/depo/odev-dosyalari.js

Öğrencilerin ödev teslim dosyalarının kayıtları (`odev_dosyalari`): dosya bulma, bir ödevin dosyaları (silinme
anlarıyla), sınır denetimli kilitli ekleme, silme, disk süpürmesi için "kayıtlı mı" ve silinme anı gelenlerin silinmesi.

## Bu dosya ne yapar?

Öğrenci ödevine dosya (fotoğraf, PDF, sunum, video…) yükler; dosyanın kendisi diskte, `public` klasörünün dışında
`data/dosyalar/<id>` adıyla durur ve yalnız yetki denetimi yapan uçtan indirilir (şema 008). Bu dosya yalnız dosyanın
**bilgisini** tutar: hangi ödev, hangi öğrenci, ad, boyut, CRC32 (zip için), SHA-256, yüklenme zamanı.

İkinci önemli işi **silinme anı**dır. Teslim dosyası sonsuza dek saklanmaz; ne zaman silineceği her seferinde ödevden
hesaplanır (`SILINME` ifadesi, 033 ve 034): son teslim ileri alınınca ya da ödev yeniden açılınca silinme anı
kendiliğinden kayar. Yükleme kuralları (kim, ne zaman, hangi tür, kaç MB), indirme ve zip, süpürme
[../../bolumler/odev-dosya.md](../../bolumler/odev-dosya.md)'dedir. Mesaj ve ödev EKLERİ ayrı tablodadır:
[ekler.md](ekler.md).

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md) kullanmaz: okuma işlevleri **ham satır** döner (`id, odev_id, ogrenci_id, ad,
boyut, crc32, sha256, yuklenme`; `odevin`'de ayrıca `ogrenci_adi` ve `silinme`). `boyut` ve `crc32` `bigint` olduğu için
[../baglanti.md](../baglanti.md) bunları `Number`'a çevirir.

### `SILINME` — teslim dosyasının silinme anı (SQL ifadesi)

```
GREATEST(
  CASE WHEN o.bitis IS NOT NULL
         THEN (o.bitis + o.bitis_saati) AT TIME ZONE 'UTC' - make_interval(mins => $1) + 7 gün   ← son teslim + 7 gün
       WHEN o.durum = 'finished' AND o.sonuclanma IS NOT NULL
         THEN o.sonuclanma + 7 gün                                                            ← sonuçlanma + 7 gün
       ELSE d.yuklenme + 60 gün                                                               ← yüklemeden 60 gün
  END,
  o.dosya_saklama)                                                                            ← bundan önce ASLA
```

- Son teslim (`bitis` günü + `bitis_saati`) veritabanında saat dilimsiz yazılır ve sunucunun YEREL saatidir;
  `$1` sunucunun UTC'ye göre farkıdır (dakika). `yerelFark()` bunu Node'un saat diliminden hesaplar
  (`-new Date().getTimezoneOffset()`, Türkiye'de 180). Bu yüzden sunucu `TZ=Europe/Istanbul` ile çalışmalıdır.
- `dosya_saklama` (034): öğretmen son teslimi değiştirince, kaldırınca ya da ödevi yeniden açınca "şimdi + 7 gün"e
  çekilir. Son teslim yanlışlıkla geçmişe yazılsa bile dosyalar hemen silinmez. `GREATEST` boş değeri yok sayar.
- `SILINME` hangi sorguda kullanılırsa orada `$1` bu fark olmalıdır (iki kullanan sorgu da öyle kurulmuştur).

### İşlevler

- `bul(id)` — tek dosya kaydı (ham satır) ya da `null`. Kimlik süzmez.
- `odevin(odevId, ogrenciId)` — bir ödevin dosyaları; `ogrenciId` verilirse yalnız onunkiler (`$3 = '' OR
  d.ogrenci_id = $3`). `odevler` ve `kullanicilar` ile JOIN: her satıra `ogrenci_adi` ve `silinme` (ISO zaman) eklenir.
  Sıra öğrenci adı, sonra yüklenme (`ORDER BY k.ad_soyad, d.yuklenme`; Türkçe sıralama eki yok).
- `ekle(d, sinir)` — `d = { id, odevId, ogrenciId, ad, boyut, crc32, sha256 }`, `sinir = { adet, toplam }` (bölümdeki
  `OGRENCI_SINIR`). İşlemde:
  1. `SELECT 1 FROM odev_ogrencileri WHERE odev_id = $1 AND ogrenci_id = $2 FOR UPDATE` — öğrencinin ödev satırı
     KİLİTLENİR; yoksa `'yok'` (öğrenci ödevde değil);
  2. öğrencinin bu ödevdeki dosya sayısı ve toplam boyutu; sayı dolduysa `'sayi'`, sığmıyorsa `'boyut'`;
  3. `INSERT INTO odev_dosyalari …`; `'tamam'`.
  Kilit sayesinde aynı öğrencinin aynı anda gelen iki yüklemesi sınırı birlikte aşamaz (ikincisi birincinin işlemi
  bitene kadar bekler, sonra yeni toplamı görür).
- `sil(id)` — kaydı siler (dosyayı çağıran siler).
- `kayitlilar(idler)` — verilen kimliklerden kaydı olanlar (`Set`); süpürme, kaydı olmayan ve 1 saatten eski dosyaları
  siler. Boş listede sorgu atmaz.
- `eskileriSil()` — `DELETE FROM odev_dosyalari d USING odevler o WHERE o.id = d.odev_id AND SILINME <= now() RETURNING
  d.id`: silinme anı gelen kayıtları siler, kimliklerini döner (dosyalarını çağıran siler).

### Tablolar ve şema

| Tablo / sütun / indeks | Şema dosyası |
|---|---|
| `odev_dosyalari` (`id` `^[0-9a-f]{32}$` = diskteki ad, `ad` 1–150, `boyut` > 0, `crc32`, `sha256`, `yuklenme`; `(odev_id, ogrenci_id)` → `odev_ogrencileri` `ON DELETE CASCADE`; `odev_dosyalari_odev (odev_id, ogrenci_id)` indeksi) | `008-odev-dosyalari.sql` |
| `odevler.dosya_yukleme` (yükleme izni) — silinme anının ayrı sütunu olmadığı kararı | `033-odev-dosya-izni.sql` |
| `odevler.dosya_saklama` (bundan önce silinmez) | `034-odev-dosya-saklama.sql` |
| `odevler.bitis`, `bitis_saati` (varsayılan `'12:00'`), `durum`, `sonuclanma`; `odev_ogrencileri` | `001-ilk.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`, `islem`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.odevDosyalari`): yalnız
  [../../bolumler/odev-dosya.md](../../bolumler/odev-dosya.md) — yüklemede ön denetim (`odevin(a.id, me.id)`) ve kayıt
  (`ekle(…, OGRENCI_SINIR)`), erişim denetimi (`bul`), liste (`odevin`), zip (`odevin`), silme (`bul` + `sil`), saatlik
  `dosyaSupur` (`eskileriSil`, `kayitlilar`).
- Başka okuyan: [okul-disk.md](okul-disk.md) (okulun teslim dosyası toplamı ve mutabakat kayıtları).
- Tablolar: yazar `odev_dosyalari`; okur `odevler`, `odev_ogrencileri`, `kullanicilar`.

## Nasıl çalışır (adım adım)?

### Yükleme

```
POST /api/odev-dosya/yukle → bölüm: teslim açık mı, izin var mı, tür/boyut
  odevin(ödev, ben) → hızlı ön denetim (sayı / toplam)            (kilitsiz; asıl denetim aşağıda)
  okul alanı (okul-disk) → diske id.yukleniyor → ödev hâlâ açık mı? → id
  ekle(d, sinir): islem { odev_ogrencileri satırı FOR UPDATE ; say ; sığıyorsa INSERT }
     'tamam' → 200 | 'yok' 404 | 'sayi' 400 | 'boyut' 413  (tamam değilse dosya diskten silinir)
```

### Saatlik temizlik (bölümdeki `dosyaSupur`)

```
eskileriSil()  → SILINME ≤ now() olan kayıtlar silinir → her kimliğin dosyası diskten silinir
readdir(data/dosyalar) → kayitlilar(adlar) → kaydı olmayan (1 saatten eski) ve yarım .yukleniyor (2 saatten eski) silinir
```

## Dikkat!

- **Saat dilimine bağımlılık:** son teslim anı sunucunun yerel saatiyle yorumlanır. Sunucu UTC'de çalıştırılırsa
  `yerelFark()` 0 olur ve silinme anı ödevdeki son teslimden 3 saat kayar (Türkiye için). Kurulumda `TZ=Europe/Istanbul`
  şarttır. `yerelFark()` son teslimin değil ŞU ANIN farkını kullanır: yaz saati uygulanan bir saat diliminde son teslimle
  bugün arasında fark değişirse silinme anı bir saat kayardı (Türkiye'de yaz saati yok).
- **Veritabanı bağlantısı UTC'dedir** ([../baglanti.md](../baglanti.md) `timezone=UTC`); `AT TIME ZONE 'UTC'` bu yüzden
  doğrudur. İkisinden birini değiştirirsen `SILINME`'yi de gözden geçir.
- **Erişim bölümde:** `bul`, `odevin`, `sil` kimlikle çalışır; kimin görebileceği/silebileceği (öğrencinin kendisi, velisi,
  ödevi veren öğretmen, müdür) bölümdeki `gorebilir`/`yonetir` ile denetlenir.
- **Kilit ve ön denetim:** bölümün `odevin` ile yaptığı ilk denetim kilitsizdir, yalnız büyük dosyayı boşuna yüklememek
  içindir; asıl sınır `ekle`'deki kilitli sayımdır.
- **Öğrenci ödevden çıkarılınca ya da ödev silinince** kayıtlar CASCADE ile gider; diskteki dosyalar bir sonraki
  süpürmede ("kaydı yok, 1 saatten eski") silinir.
- **`eskileriSil` indekssiz ifade karşılaştırır:** `SILINME` her satır için hesaplanır; bütün teslim kayıtları taranır
  (saatte bir). Bugünkü boyutta sorun değil.
- **Eski şema yorumu:** `020-ekler.sql`'in başındaki yorum teslim dosyaları için "onlar da 150 MB ve 7 gün kuralına
  uyar" der; bugünkü kural farklıdır: bir öğrenci bir ödevde en çok 10 dosya / toplam 50 MB (`OGRENCI_SINIR`), silinme
  anı da yukarıdaki `SILINME`'dir. Yorumu değil kodu esas al.
- **Geri dönüşsüz:** `eskileriSil` kaydı ve dosyayı siler; yedek dışında geri gelmez. `dosya_saklama` bu yüzden var.
- **Güvenlik:** bütün değerler parametreyle; `SILINME` koddaki sabit bir SQL parçasıdır. Dosya adı düz metin saklanır;
  indirmede başlıklara bölüm güvenli biçimde yazar (`attachment`, `nosniff`, `sandbox`).

## Testleri

- `testler/test-odev-dosya.js` — yükleme (adındaki yol parçaları atılır, izinsiz tür, boş dosya, girişsiz, öğretmenin
  öğrenci yerine yükleyememesi, 50 MB sınırı), görme/indirme yetkileri (öğrenci, veli, başka öğrenci, ödevi vermeyen
  öğretmen), zip (CRC32 doğru), bir ödeve en çok 10 dosya, silme yetkileri, sonuçlandırılmış/süresi geçmiş ödev,
  tarayıcıda açma, dosya yükleme izni (033), silinme anı kuralları (son teslim + 7 gün, ileri alınınca yeniden hesap,
  son teslimsiz 60 gün, sonuçlanma + 7 gün, yeniden açılınca, geçmişe alınınca "şimdi + 7 gün" ve saatlik silme
  sorgusunun dosyayı silmemesi — `dosya_saklama`), okul alanı %80 ve "doldu".
- `testler/test-okul-disk.js` — teslim dosyalarının okul kullanımına sayılması.
- Elle: bir ödeve dosya yükle, öğretmen olarak son teslimi bir hafta ileri al → dosya listesindeki "silinme" tarihi de
  bir hafta ilerlemeli.

## Son durum

- Son değişiklik `40fc7e7 commit 525` (2026-09-27): okul alanına ait `okulToplami`, `uyariYaz`, `uyarilariSifirla` bu
  dosyadan çıkarıldı ([okul-disk.md](okul-disk.md)'ye taşındı). Öncesi `566b917 commit 524` (aynı gün): `SILINME`
  ifadesi ve `yerelFark` (silinme anı ödevden hesaplanıyor; eskiden sabit gün sayısıyla `eskileriSil(gun)`), `odevin`'e
  `silinme`, geçici olarak okul uyarı işlevleri. İlk hâli `942bcfd commit 363` (2026-09-26). Toplam 3 commit.
- Bilinen açıklar (kod değiştirilmedi): sunucu saat dilimine bağımlılık (kurulum belgesinde şart), `eskileriSil`'in
  bütün tabloyu taraması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Sunucuda küçültme … aynı dosya tek kopya"** bu dosyayı en çok
  etkileyecek iş: yüklenen resim/video sunucuda küçültülecek (`boyut` güncellenecek, meta veri silinecek), aynı dosya
  `sha256` ile tek kopya tutulacak (süpürme ve silme paylaşılan dosyayı hesaba katmalı). "Mesaj ayarları … ödev
  hatırlatma otomasyonu" ve "Yıl geçişi" ödev tarafını değiştirir; silinme anı ödevden hesaplandığı için onlardan
  etkilenebilir.
