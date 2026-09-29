# sunucu/veri/depo/ekler.js

Mesaja ve öğretmenin verdiği ödeve eklenen dosyaların kayıtları (`ekler`): taslak ekleme, taslak toplamı, taslağı
mesaja/ödeve bağlama, bir hedefin ekleri, silme, 7 günlük süre dolumu ve disk süpürmesi için "yaşayan" kayıtlar.

## Bu dosya ne yapar?

Kullanıcı mesaj ya da ödev yazarken dosyayı seçer seçmez dosya yüklenir; o anda henüz hangi mesaja gideceği belli
olmadığı için ek önce **taslak**tır (`mesaj_id` ve `odev_id` boş) ve yalnız yükleyen görür. Mesaj gönderilince ya da
ödev kaydedilince taslak o mesaja/ödeve **bağlanır**. Dosya yüklendikten 7 gün sonra diskten silinir; satır `silindi`
diye kalır ki mesajda "süresi doldu" yazsın. Bağlanmayan taslak 6 saat sonra tümden silinir (şema 020).

Dosyanın kendisi diskte `data/ekler/<id>` adıyla durur; diske yazma, indirme bileti, kimin görebileceği ve süpürme
[../../bolumler/ekler.md](../../bolumler/ekler.md)'dedir. Bu dosya yalnız kayıtları tutar. Öğrencinin ödev TESLİM
dosyaları ayrı tablodadır: [odev-dosyalari.md](odev-dosyalari.md).

## İçinde neler var?

Bu dosya [../esleme.md](../esleme.md) kullanmaz; iç `nesne(r)` dönüştürücüsü:
`{ id, yukleyenId, okulId, tur ('mesaj' | 'odev'), mesajId, odevId, ad, boyut (Number), yuklenme, bitis, silindi }`
(boş kimlikler `''`; `sha256` nesneye girmez).

- `bul(id)` — tek ek ya da `null` (`SELECT * FROM ekler WHERE id = $1`). Kimlik süzmez.
- `ekle(e)` — `INSERT INTO ekler (id, yukleyen_id, okul_id, tur, ad, boyut, sha256, bitis)`; `bitis` SQL'de
  `now() + interval '7 days'` olarak yazılır, okulsuz yükleyende `okul_id` `NULL`. Şema: `id` 32 küçük onaltılık
  karakter (diskteki dosya adı), `ad` 1–150, `boyut` > 0, `sha256` 64 onaltılık (aykırıysa `23514`).
- `taslakToplami(yukleyenId)` — kişinin bağlanmamış, silinmemiş taslaklarının toplam boyutu (bayt, `Number`);
  `ekler_taslak` kısmi indeksiyle.
- `taslaklari(yukleyenId, tur, idler)` — verilen kimliklerden YALNIZ bu kişinin, bu türdeki, bağlanmamış, silinmemiş ve
  süresi dolmamış (`bitis > now()`) taslakları. Başkasının, bağlanmışı ya da süresi dolanı gelmez; bölüm dönen sayı
  istenenle tutmazsa reddeder. Boş listede sorgu atmaz.
- `bagla(tur, hedefId, idler)` — `UPDATE ekler SET mesaj_id (ya da odev_id) = $1 WHERE id = ANY($2::text[]) AND
  mesaj_id IS NULL AND odev_id IS NULL`: yalnız hâlâ bağlanmamış eki bağlar (aynı ek iki mesaja gidemez). Sütun adı
  `tur`'a göre koddan seçilir (`'mesaj'` → `mesaj_id`, başka her şey → `odev_id`). Boş listede bir şey yapmaz.
- `hedefin(tur, hedefId)` — bir mesajın ya da ödevin ekleri (silinenler dahil), yüklenme sırasıyla (`ekler_mesaj` /
  `ekler_odev` kısmi indeksleri).
- `odevlerin(odevIdler)` — birçok ödevin ekleri tek sorguda: `Map(odevId → [ek…])`.
- `sil(id)` — satırı siler (dosyayı çağıran siler ya da süpürme toplar).
- `suresiDolanlar()` — temizlik, iki sorgu: (1) `UPDATE ekler SET silindi = true WHERE NOT silindi AND bitis <= now()
  RETURNING id` (7 günü dolanlar; satır kalır); (2) `DELETE FROM ekler WHERE mesaj_id IS NULL AND odev_id IS NULL AND
  yuklenme < now() - interval '6 hours' RETURNING id` (bağlanmamış eski taslaklar). İki listenin kimliklerini birlikte
  döner: bunların dosyaları diskten silinecek.
- `yasayanlar(idler)` — diskteki dosya adlarından hâlâ kaydı olan VE silinmemiş olanlar (`Set`). Süpürme, bu kümede
  olmayan (ve 2 saatten eski) dosyaları siler. Boş listede sorgu atmaz.

### Tablolar ve şema

| Tablo / kısıt / indeks | Şema dosyası |
|---|---|
| `ekler` (`id` `^[0-9a-f]{32}$`, `yukleyen_id` / `okul_id` / `mesaj_id` / `odev_id` hepsi `ON DELETE CASCADE`, `tur` mesaj/odev ve türüyle uyumlu hedef CHECK'leri, `sha256`, `bitis`, `silindi`; `ekler_mesaj`, `ekler_odev`, `ekler_taslak`, `ekler_bitis` kısmi indeksleri) | `020-ekler.sql` |
| `ekler_okul` kısmi indeksi (okulun silinmemiş eklerini toplamak için) | `035-okul-disk-siniri.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.ekler`):
  - [../../bolumler/ekler.md](../../bolumler/ekler.md) — yükleme (`taslakToplami`, `ekle`), `ekleriDogrula`
    (`taslaklari`), `ekleriBagla` (`bagla`), `hedefinEkleri` (`hedefin`), `/api/ek/indir` ve `/api/ek/bilet` (`bul`),
    `/api/ek/sil` (`bul` + `sil`; yalnız yükleyen), saatlik `ekSupur` (`suresiDolanlar`, `yasayanlar`).
  - [../../bolumler/odev.md](../../bolumler/odev.md) — ödev düzeltmede var olan ekler (`hedefin('odev', …)`) ve
    kaldırılanların satırları (`sil`).
  - [../../bolumler/ilerleyis.md](../../bolumler/ilerleyis.md) — öğrencinin ödev listesinde ekler (`odevlerin`).
  - [../../bolumler/mesaj.md](../../bolumler/mesaj.md) — ek bağlama ve mesaj detayında ekler (bölümdeki `ekleriBagla`,
    `hedefinEkleri` üzerinden).
- Başka okuyan: [okul-disk.md](okul-disk.md) (silinmemiş eklerin boyut toplamı ve mutabakat kayıtları).
- Tablo: `ekler`.

## Nasıl çalışır (adım adım)?

### Bir ekin yaşamı

```
seçildi → yukle: taslakToplami (kişi başına 150 MB) + okul alanı → diske id.yukleniyor → id
          → ekle(...)  (taslak: mesaj_id = odev_id = NULL, bitis = şimdi + 7 gün)
gönder  → ekleriDogrula: taslaklari(me, tur, idler) sayısı tutuyor mu? toplam ≤ 50 MB?
          → islem { mesajlar.ekle ; bagla('mesaj', m.id, idler) }         (ödevde odev_id)
6 saat içinde bağlanmadıysa → suresiDolanlar: DELETE (satır gider) → dosya silinir
7 gün dolunca               → suresiDolanlar: silindi = true (satır kalır, "süresi doldu") → dosya silinir
mesaj/ödev silinince        → satır CASCADE ile gider → dosya bir sonraki süpürmede (kaydı yok, 2 saatten eski) silinir
```

### Saatlik süpürme (bölümdeki `ekSupur`)

```
suresiDolanlar() → her kimliğin dosyasını sil
readdir(data/ekler) → yasayanlar(adlar) → yaşamayan ve 2 saatten eski her dosyayı sil (yarım .yukleniyor'lar dahil)
```

## Dikkat!

- **Erişim bölümde:** `bul`, `hedefin`, `odevlerin`, `sil` kimlikle çalışır. Kimin görebileceğine (yükleyen; mesajda
  gönderen ya da alıcı; ödevde veren, okulun müdürü, öğrencisi ya da velisi) [../../bolumler/ekler.md](../../bolumler/ekler.md)
  karar verir; `/api/ek/sil` yalnız yükleyene izin verir.
- **`bagla` yükleyene bakmaz:** SQL yalnız "bağlanmamış mı" diye bakar. Başkasının taslağının bağlanmasını önleyen,
  bölümün önce `taslaklari(me.id, …)` ile her kimliğin kişinin kendi taslağı olduğunu doğrulamasıdır; `bagla`'yı bu
  denetim olmadan çağırma.
- **Doğrulama ile bağlama arasında kilit yok:** `taslaklari` ile `bagla` ayrı sorgulardır. Aynı taslak iki pencereden
  aynı anda iki mesaja bağlanmaya çalışılırsa `bagla`'nın `mesaj_id IS NULL` koşulu yalnız birinciye izin verir; ikinci
  mesaj eksiz gider (hata vermez).
- **İki temizlik sorgusu işlem dışında** ve aynı kimlik iki listede birden dönebilir (7 günü geçmiş bağlanmamış bir
  taslak — ancak temizlik uzun süre çalışmadıysa); sonuç yalnız aynı dosyayı iki kez silmeyi denemektir.
- **Süre veritabanı saatiyle:** `bitis` ve 6 saatlik taslak süresi `now()` ile hesaplanır.
- **Şema yorumu eski:** 020'deki yorum "bir mesajın ya da ödevin ekleri toplam 150 MB" der; bugünkü kural bölümde: bir
  mesaja/ödeve en çok 50 MB (`EK_SINIR`), kişinin bağlanmamış taslaklarının toplamı 150 MB (`TASLAK_SINIR`), en çok 20
  dosya.
- **`sha256` saklanıyor ama kullanılmıyor:** aynı dosyanın tek kopya tutulması için hazır duruyor (Son durum).
- **Ek, yükleyenin okulunun disk sınırına sayılır** ([okul-disk.md](okul-disk.md)); silinmiş ekler sayılmaz.
- **Güvenlik:** bütün değerler parametreyle; `hedefin`/`bagla`'daki sütun adı kullanıcıdan değil koddaki iki sabitten
  seçilir. Dosya adı (`ad`) düz metin saklanır; indirirken başlıklara bölüm güvenli biçimde yazar.

## Testleri

- `testler/test-yorum-ek.js` — öğrencinin ödeve ek koyamaması, izinsiz uzantı, 50 MB üstünün okunmadan reddi, taslak
  yükleme, taslağı yalnız yükleyenin indirebilmesi, ödeve ekle verme ve öğrencinin görüp indirmesi (silinme tarihiyle),
  ödevde olmayanın indirememesi, düzeltmede ek ekleme/kaldırma, mesaja ek, başkasının taslağının bağlanamaması,
  bağlanmış ekin ikinci mesaja bağlanamaması, başka pencerede taslak varken yeni mesaja ek, 50 MB üstünün
  bağlanamaması, biletsiz indirme olmaması.
- `testler/test-okul-disk.js` — eklerin okul kullanımına sayılması, silinen ekin sayımdan düşmesi, dolu okulda 507.
- Otomatik test olmayanlar: 6 saatlik taslak silme ve 7 günlük `silindi` işareti (zamana bağlı). Elle (yalnız test
  veritabanında): bir ekin `bitis`'ini geçmişe çek, test sunucusunda saatlik temizliği bekle → mesajda "süresi doldu"
  görünmeli, `data/ekler/<id>` silinmiş olmalı.

## Son durum

- Tek commit: `7daee9c commit 414` (2026-09-26) — dosya 020 şema dosyası ve bölümle birlikte bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): `bagla`'nın yükleyen koşulu taşımaması (bölüme güveniyor), 020 yorumundaki
  eski 150 MB bilgisi, kullanılmayan `sha256`.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Sunucuda küçültme … aynı dosya tek kopya"** bu dosyayı en çok
  etkileyecek iş: `sha256` ile aynı dosya tek kopya tutulacak (kayıt başına ayrı dosya yerine paylaşılan dosya), küçültme
  sonrası `boyut` güncellenecek; süpürme ve `yasayanlar` paylaşılan dosyayı hesaba katmalı. "Anket düzenleyici" anketi
  ödeve/mesaja ek olarak bağlayacak (yeni bir ek türü gerekebilir); "Optimizasyon + saklama süreleri" 7 günlük süreyi
  gözden geçirebilir.
