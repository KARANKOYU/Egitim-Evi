# sunucu/veri/depo/cihazlar.js

Telefon uygulamasının cihaz anahtarlarının (`cihaz_anahtarlari`) SQL'i: anahtar ekleme (hesap başına 5), özetten bulma,
görülme ve imleç yazma, silme, listeleme; ayrıca telefonun bildirim yoklaması için alıcılar, son imleç ve imleç
aralığındaki okunmamış bildirimler.

## Bu dosya ne yapar?

Eğitim Evi'nin yerel Android uygulaması girişten sonra oturumla bir kez **cihaz anahtarı** alır ve saklar. Bu anahtar
yalnız iki işe yarar: telefonun bildirimleri kendisinin yoklaması (Firebase yok; telefon "yeni bildirim var mı?" diye
sorar) ve servisçinin sefer konumunu arka planda göndermesi. Hesaba giriş VERMEZ; veritabanında anahtarın kendisi değil
SHA-256 özeti durur (şema 028). Anahtarın sahibi yetişkinin ANA hesabıdır (okul rolleri onun altında), ya da öğrenci /
servisçi hesabıdır.

Telefon yoklarken "en son nerede kaldım" bilgisini bir **imleç**le taşır: son verilen bildirimin zamanı (mikrosaniyeye
kadar, UTC) ve kimliği, `"2026-09-27T05:12:33.123456Z|n_…"` biçiminde. İmleç SQL'de üretilir çünkü JavaScript'in `Date`'i
milisaniyede keser; aynı milisaniyede yazılmış iki bildirim atlanmasın diye mikrosaniye + kimlik birlikte kullanılır.

Uçlar, anahtarın geçerliliği (hesap onaylı mı, aydınlatma metni onayı güncel mi), servis saatleri ve konum yazma
[../../bolumler/cihaz.md](../../bolumler/cihaz.md)'dedir. Eski Aile uygulamasının anahtarları ayrı tablodadır
([aile.md](aile.md)).

## İçinde neler var?

İç dönüştürücü `cihaz(r)` → `{ id, kullaniciId, ad, platform, surum, olusturma, sonGorulme, sonBildirim }` (özet
nesneye girmez). [../esleme.md](../esleme.md) kullanılmaz.

### Anahtarlar

- `HESAP_BASINA = 5` — hesap başına en çok anahtar (yalnız bu dosyada kullanılıyor).
- `ekle(c)` — `c = { id, kullaniciId, ozet, ad, platform, surum }`: `INSERT INTO cihaz_anahtarlari (id, kullanici_id,
  anahtar_ozeti, ad, platform, surum)`, sonra hesabın en yeni 5 anahtarı dışındakileri siler (`ORDER BY olusturma DESC,
  id DESC LIMIT $2`; eşit zamanda kimlik sırası belirleyici). Dönüş yok. Şema: `anahtar_ozeti` 64 karakter ve `UNIQUE`,
  `ad` ≤ 80, `platform`/`surum` ≤ 20.
- `ozetle(ozet)` — özetten anahtar ya da `null` (tekil kısıtın indeksiyle).
- `goruldu(id)` — `son_gorulme = now()`.
- `imlecYaz(id, imlec)` — `son_bildirim = $2` (telefona en son verilen imleç; ≤ 200 karakter).
- `sil(id)` — anahtarı siler.
- `sahibininSil(kullaniciId, id, ozet)` — `DELETE … WHERE kullanici_id = $1 AND (id = $2 OR anahtar_ozeti = $3)`:
  yalnız sahibinin anahtarını, kimliğiyle ya da özetiyle siler (boş değerler `''` olur, hiçbir satırla eşleşmez).
  Silinen sayıyı döner (0 → bölüm 404).
- `listesi(kullaniciId)` — hesabın anahtarları, en yeni önce.
- `hesabinkileriSil(kullaniciIdler)` — verilen kişilerin ve onlara bağlı okul rolü satırlarının (`ana_hesap_id`) bütün
  anahtarlarını siler. **Bugün hiçbir yerden çağrılmıyor:** aynı işi [oturumlar.md](oturumlar.md)'deki `hepsiniKapat`,
  `hesabinOturumlariniKapat` ve [kullanicilar.md](kullanicilar.md)'deki `topluSifreYaz` kendi `DELETE`'leriyle yapıyor.

### Bildirim yoklaması

- `alicilar(anaId)` — anahtarın bildirim alıcıları: sahibi ve (yetişkinse) ona bağlı okul rolü satırları, YALNIZ onaylı
  olanlar (`(k.id = $1 OR k.ana_hesap_id = $1) AND k.durum = 'approved'`); her biri `{ id, kisa_ad }` (okulun kısa adı;
  bildirim bağlantısı okul adresiyle kurulsun diye).
- `sonImlec(aliciIdler)` — alıcıların EN SON bildiriminin imleci `{ zaman, id }` (`ORDER BY olusturma DESC, id DESC
  LIMIT 1`); hiç bildirim yoksa (ya da alıcı listesi boşsa) şimdiki an ve boş kimlik. Zaman `IMLEC_ZAMANI` ifadesiyle:
  `to_char(olusturma AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`.
- `bildirimleri(aliciIdler, son, ust, adet)` — `(son, ust]` aralığındaki OKUNMAMIŞ bildirimler: `(olusturma, id) >
  ($2, $3) AND (olusturma, id) <= ($4, $5)` (satır karşılaştırması; zaman ve kimlik birlikte), en yeniden en eskiye,
  en çok `adet` (bölüm 20 verir). `{ id, kullanici_id, metin, baglanti, olusturma }` ham satırları.

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `cihaz_anahtarlari` (`kullanici_id` `ON DELETE CASCADE`, `anahtar_ozeti` `UNIQUE`, `son_gorulme`, `son_bildirim`; `cihaz_anahtarlari_kullanici` indeksi) | `028-servis-yoklama.sql` |
| `bildirimler` (`okundu`, `olusturma`; `bildirimler_kullanici (kullanici_id, olusturma DESC)` indeksi) | `001-ilk.sql` |
| `kullanicilar.ana_hesap_id` (yetişkin hesabı ↔ okul rolü satırları) | `012-yetiskin-hesap.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.cihazlar`): yalnız [../../bolumler/cihaz.md](../../bolumler/cihaz.md) —
  anahtarla gelen istekte `ozetle`, geçersizse `sil`, `goruldu`; `/api/cihaz/bildirimler` (`alicilar`, `sonImlec`,
  `bildirimleri`, `imlecYaz`); `/api/cihaz/sil` anahtarla (`sil`); oturumla `POST /api/cihaz` (`ekle`),
  `GET /api/cihaz` (`listesi`), `/api/cihaz/sil` (`sahibininSil`).
- Aynı tabloya başka dosyalardan dokunulan yerler: [oturumlar.md](oturumlar.md) (şifre değişince ya da hesap silinince
  anahtarları siler), [kullanicilar.md](kullanicilar.md) (okulun toplu şifre yenilemesinde), [../json-aktarim.md](../json-aktarim.md)
  (yedek/aktarım).
- Tablolar: yazar `cihaz_anahtarlari`; okur `kullanicilar`, `okullar`, `bildirimler`.

## Nasıl çalışır (adım adım)?

### Telefonun bildirim yoklaması

```
GET /api/cihaz/bildirimler?son=<imleç>        (X-Cihaz: <64 hex>)
  bölüm: ozetle(sha256(anahtar)) → yoksa 401
         hız sınırı (anahtar başına: servis konumu dakikada 60, öteki uçlar saatte 240) → aşarsa 429
         hesap onaylı + KVKK güncel mi? değilse sil + 403
  goruldu(id)
  alicilar(sahip)          → [ana hesap, okul rolü satırları] (onaylılar)
  ust = sonImlec(alicilar) → alıcıların en son bildirimi (yoksa "şimdi")
  son = imleç çözülebildi mi?
      hayır (ilk yoklama ya da bozuk) → bildirim YOK (kurulunca eskiler yağmasın)
      evet → bildirimleri(alicilar, son, ust, 20)   (son, ust] okunmamışlar
  yeni imleç = max(son, ust) → değiştiyse imlecYaz
  cevap: bildirimler eskiden yeniye, imleç, servis saatleri
```

### Anahtar alma ve bırakma

```
POST /api/cihaz (oturumla) → rastgele 32 bayt → ekle({ kullaniciId: ana hesap, ozet }) → 6. anahtar en eskiyi düşürür
POST /api/cihaz/sil        → oturumla: sahibininSil(sahip, id | özet) ; anahtarla: sil(id)
şifre değişince            → oturumlar.js hesabinOturumlariniKapat: ana hesap + rol satırlarının anahtarları silinir
```

## Dikkat!

- **Anahtar hesaba giriş vermez:** bu tablo `oturumlar`'dan ayrıdır; bölüm `X-Cihaz` başlığını yalnız kendi uçlarında
  kabul eder. Anahtarın sızması bildirim metinlerinin okunmasına yol açar; bu yüzden şifre değişince hepsi silinir.
- **Sahiplik:** anahtar ANA hesaba yazılır (`me.anaHesapId || me.id`). Silme `sahibininSil` ile sahiplik koşulu SQL'de;
  `sil(id)` ise koşulsuzdur ve yalnız anahtarın kendisiyle gelen istekte (anahtar zaten o cihazın) kullanılır.
- **5 anahtar sınırı işlem dışında:** ekleme ve fazlaları silme iki ayrı sorgudur; aynı anda iki anahtar alınırsa kısa
  bir an 6 anahtar olabilir, bir sonraki eklemede düzelir.
- **İmleç biçimi iki yerde:** SQL'deki `IMLEC_ZAMANI` ile bölümdeki `IMLEC` düzenli ifadesi (`…\.\d{6}Z|kimlik`) aynı
  biçimi beklemelidir; birini değiştirirsen öbürünü de değiştir. Bölüm takvimde olmayan anı (30 Şubat) veritabanına
  göndermeden reddeder.
- **Okunmuş bildirim telefona gitmez** (`NOT okundu`): kişi bildirimi sitede okuduysa telefonda yeniden çıkmaz; imleç
  yine ilerler.
- **20'den fazla birikmişse** yalnız en yeni 20'si gider (`ORDER BY … DESC LIMIT`), imleç `ust`'e atlar: aradaki eski
  bildirimler telefona hiç gelmez (bilinçli: "yağmur olmasın"). Hepsi sitenin bildirim panelinde durur.
- **Kullanılmayan işlev:** `hesabinkileriSil` dışa açık ama çağıran yok; aynı SQL [oturumlar.md](oturumlar.md)'de de var.
- **Performans:** `sonImlec` ve `bildirimleri` `bildirimler_kullanici (kullanici_id, olusturma DESC)` indeksini kullanır;
  alıcı sayısı küçük (ana hesap + birkaç rol satırı).
- **Güvenlik:** bütün değerler parametreyle; özetler bölümde hesaplanır. Liste ucu anahtarı ya da özeti döndürmez.

## Testleri

- `testler/test-servis-yoklama.js` — oturumla 64 haneli anahtar alma, oturumsuz alınamaması, anahtarın `/api/me`'de
  geçmemesi, bilinmeyen/biçimsiz anahtara 401, ilk yoklamada eski bildirim gelmemesi, yeni bildirimin gelmesi ve ikinci
  kez gelmemesi, okunmuşun gitmemesi (imleç ilerler), en çok 20 bildirim, bozuk imleç, okul rolüne gelen bildirimin
  bağlantısı, telefon listesi (anahtar dönmez), oturumla ve anahtarla kaldırma, hesap başına 5 anahtar, öğrencinin
  anahtarı, Aile uçlarında geçmemesi, şifre değişince ve hesap silinince iptal, servisçinin anahtarla sefer konumu
  göndermesi ve cihaz ayarı.
- `testler/test-aile.js` (Aile anahtarı bu uçlarda geçmez), `testler/test-ozellikler.js` (servis kapalıyken konum),
  `testler/test-yedek.js` (tablo yedekte), `testler/girdi-denetimi.js`, `testler/yetki-denetimi.js`.
- Elle: test sunucusunda `POST /api/cihaz` ile anahtar al, `GET /api/cihaz/bildirimler` (imleçsiz) → boş liste ve imleç;
  kendine bir bildirim düşür, imleçle yeniden sor → bildirim gelmeli.

## Son durum

- Tek commit: `24050a2 commit 518` (2026-09-27) — servis yoklaması, `/api/cihaz` ve 30 günlük uygulama oturumu işiyle
  (028) bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): kullanılmayan `hesabinkileriSil`, 5 anahtar sınırının işlem dışında olması.
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Android yerel uygulama (bütün roller) … uygulama kendini güncellesin"**
  bu tablonun istemcisidir (yeni uç ya da alan gerekirse buraya gelir); **"Sistem"** işindeki "yeni cihaz uyarısı + açık
  oturumlar" telefon anahtarlarını da listeleyip tek tek kapatmayı isteyebilir; "Mesaj ayarları … bildirim paneli
  sekmeler hâlinde" bildirim türü getirirse `bildirimleri`'nin süzmesi değişebilir.
