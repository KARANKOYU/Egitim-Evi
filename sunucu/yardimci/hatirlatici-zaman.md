# sunucu/yardimci/hatirlatici-zaman.js

Türkiye saatiyle gün ve an hesabı: bir hatırlatıcının hangi gün çalacağı, bir sonraki anı ve "şimdi gönderilmeli mi?" kararı
(veritabanı yok, saf işlevler).

## Bu dosya ne yapar?

Kullanıcı "her pazartesi 08:30'da hatırlat" dediğinde o 08:30 Türkiye'nin 08:30'udur. Ama sunucu çoğu VPS gibi UTC'de
çalışıyor olabilir; `new Date().getHours()` gibi yerel saate güvenen bir hesap orada üç saat kayar. Bu dosya bütün hesabı
sabit UTC+3 üzerinden yapar (Türkiye 2016'dan beri yaz saati uygulamıyor), böylece sunucunun saat dilimi ne olursa olsun
sonuç aynıdır.

İki iş görür:

1. Hatırlatıcılar (`sunucu/bolumler/hatirlatici.js`): sıradaki hatırlatma ne zaman, ve dakikalık döngüde "bu hatırlatıcının
   zamanı geldi mi?".
2. Başka bölümlerin "bugün Türkiye'de hangi gün?" ihtiyacı: `trGun` ve `gunEkle` aile, okul hayatı (servis) ve servis
   penceresi hesaplarında da kullanılır.

## İçinde neler var?

Hatırlatıcı nesnesi (`h`) şu alanları taşır: `siklik` (`'bir-kez'`, `'her-gun'`, `'her-hafta'`, `'her-ay'`), `tarih`
(`'YYYY-AA-GG'`, yalnız bir-kez için), `saat` (`'SS:DD'`), `gunler` (1 Pazartesi … 7 Pazar dizisi, haftalık için), `ayGunu`
(1–31, aylık için), `aktif`, `sonGonderim` (ISO ya da boş), `olusturma` (ISO).

### Sabitler (dışa açık değil)

- `TR` — 3 saat (ms). Türkiye'nin UTC'den farkı.
- `GUN` — 24 saat (ms).
- `GECIKME` — 6 saat (ms): sunucu kapalı kaldıysa en çok bu kadar geciken hatırlatma yine gönderilir.

### Dışa açık işlevler

- **`an(tarih, saat)`** — Türkiye'de o gün o saatin gerçek anı (ms). Örnek: `an('2026-09-28', '08:30')` →
  `2026-09-28T05:30:00.000Z`'nin ms değeri. İçeride `Date.parse(tarih + 'T' + saat + ':00+03:00')`; biçim bozuksa `NaN` döner
  (hata atmaz). Girdiyi denetlemez; denetim çağıranın işidir (hatirlatici.js saati ve tarihi önceden doğrular).
- **`trGun(ms)`** — bir anın Türkiye'deki günü, `'YYYY-AA-GG'`. Örnek: Türkiye'de gece 01:00 (UTC'de hâlâ önceki gün 22:00)
  → o günün tarihi. `ms` geçersizse `toISOString` `RangeError` atar.
- **`gunEkle(tarih, n)`** — `'YYYY-AA-GG'` tarihine `n` gün ekler (eksi olabilir). Ay ve yıl geçişlerini `Date` halleder.
  UTC gece yarısı üzerinden hesaplar, saat dilimi karışmaz.
- **`haftaGunu(tarih)`** — 1 Pazartesi … 7 Pazar. (JavaScript'in 0=Pazar düzeni burada 7'ye çevrilir.) Örnek:
  `haftaGunu('2026-09-28')` → 1.
- **`ayinSonGunu(tarih)`** — o ayın kaç çektiği: `ayinSonGunu('2027-02-10')` → 28.
- **`gunUyar(h, tarih)`** — hatırlatıcı o gün çalar mı?
  - bir-kez: `tarih === h.tarih`;
  - her-gun: her zaman `true`;
  - her-hafta: günün hafta günü `h.gunler` içinde mi (dizi yoksa hiçbir gün);
  - her-ay: ayın günü `min(h.ayGunu, ayın son günü)` mü — yani "ayın 31'i" seçildiyse 30 çeken ayda 30'unda, şubatta 28'inde
    (artık yılda 29'unda) çalar;
  - bilinmeyen sıklık: `false`.
- **`sonraki(h, simdi)`** — şimdiden SONRAKİ ilk hatırlatma anı (ms) ya da `null`. Pasif hatırlatıcıda `null`. Bugünden başlayıp
  400 güne kadar ileri bakar; o gün uyuyorsa ve an `simdi`'den büyükse onu döndürür. Bir-kez hatırlatıcının günü geçtiyse
  `null`. Tam o an (`a === simdi`) "sonraki" sayılmaz.
- **`zamaniGeldi(h, simdi)`** — şimdi gönderilmesi gereken an (ms) ya da `0`. Bugüne ve düne bakar; bir an şu dört şartı
  sağlıyorsa onu döndürür:
  1. an gelmiş (`a <= simdi`),
  2. en çok 6 saat gecikmiş (`simdi - a <= GECIKME`),
  3. bu an için daha gönderilmemiş (`a > sonGonderim`),
  4. hatırlatıcı bu andan ÖNCE kurulmuş (`a > olusturma`) — 10:00'da kurulan "her gün 08:30" o gün geriye dönüp çalmaz.

  Düne de bakması gece yarısını geçen durum içindir: 23:50 hatırlatması sunucu 00:05'te yoklasa da gider.

## Kimle konuşur?

Hiçbir şey çağırmaz (yalnız `Date`). Onu kullananlar:

- [../bolumler/hatirlatici.md](../bolumler/hatirlatici.md) — `sonraki` (`gorunum` içinde; listedeki her hatırlatıcının `sonraki` alanı olur: ISO metin, yoksa boş metin) ve `zamaniGeldi` (dakikalık
  `hatirlaticilariGonder` döngüsü; dönen an `depo.hatirlaticilar.gonderildi` ile `sonGonderim` olarak yazılır, bir-kez
  hatırlatıcı aynı anda pasifleşir).
- [../bolumler/aile.md](../bolumler/aile.md) — `trGun`, `gunEkle`: Türkiye'ye göre "bugün" ve geriye doğru bir haftalık gün listesi.
- [../bolumler/okul-hayati.md](../bolumler/okul-hayati.md) — `trGun` ve `gunEkle` (orada `trGunEkle` adıyla; dosyanın kendi
  `gunEkle`'si de var, ikisi ayrı): seferin Türkiye günü, "yarın" etiketi.
- [servis-pencere.md](servis-pencere.md) — `an`, `trGun`, `gunEkle`: servis yoklama penceresinin başlangıç ve bitişi.

Veritabanı tablosu kullanmaz; hatırlatıcı satırları (`hatirlaticilar` tablosu) çağıran bölüm tarafından okunup buraya düz nesne
olarak verilir.

## Nasıl çalışır (adım adım)?

Dakikalık gönderim (`zamaniGeldi`):

```
simdi ──> bugun = trGun(simdi)
          for t in [bugun, dün]:
              gunUyar(h, t)?  hayır → geç
              a = an(t, h.saat)
              a <= simdi  ve  simdi - a <= 6 sa  ve  a > sonGonderim  ve  a > olusturma ?
                  evet → a döner (gönder, sonGonderim = a)
          hiçbiri → 0
```

Aynı dakikada iki kez yoklanırsa ikincisinde `a > sonGonderim` bozulur, yani çift bildirim gitmez. Sunucu 5 saat kapalı
kaldıysa açılınca kaçan hatırlatma bir kez gider; 6 saatten eskiyse sessizce atlanır (sabah 08:30 hatırlatması akşam 15:00'te
gelmesin diye).

## Dikkat!

- Sabit +03:00 kasıtlıdır. Türkiye yeniden yaz saatine geçerse bu dosya tek yerden değişmeli (`TR` ve `an` içindeki `+03:00`).
- `an`, `trGun`, `gunEkle` girdi denetlemez. Bozuk tarih `an`'da `NaN`, `trGun`'da `RangeError` üretir. Bugünkü çağıranlar
  değerleri önceden doğruluyor; yeni bir çağıran eklerken bunu unutma.
- `zamaniGeldi` yalnız bugün ve dünü dener. Hatırlatıcının saati 6 saatlik pencereyle sınırlı olduğu için bu yeter; `GECIKME`
  24 saati aşacak biçimde büyütülürse döngünün de genişlemesi gerekir.
- `sonraki` 400 günde bir eşleşme bulamazsa `null` döner (ör. `gunler` boş haftalık hatırlatıcı). Arayüzde bu "sıradaki yok"
  demektir.
- `haftaGunu` günün öğlenini (`T12:00:00Z`) kullanır; gece yarısında olası kaymalardan kaçınmak için.

## Testleri

- `testler/test-hatirlatici-zaman.js` (sunucusuz; `node testler/test-hatirlatici-zaman.js`) — 08:30 TR = 05:30 UTC, gece
  01:00'in hâlâ o gün sayılması, hafta günü, şubatın son günü; `sonraki`: her gün (kurulduğu saatten sonra ilki yarın),
  haftalık Pzt/Çar, ayın 31'i (eylülde 30'u, şubatta son günü), bir-kez (geçtiyse `null`), pasif; `zamaniGeldi`: kurulduğu gün
  geçmiş saat gönderilmez, tam saatinde gelir, bir dakika önce gelmez, gönderilmiş an yinelenmez, 5 saat gecikme gider, 6
  saatten eskisi gitmez, gece yarısını geçen 23:50, haftalıkta yanlış/doğru gün.
- Hatırlatıcı uçları sunuculu testlerde ([../bolumler/hatirlatici.md](../bolumler/hatirlatici.md) Testleri bölümü) dolaylı
  olarak dener.
- Elle: `node -e "const z=require('./sunucu/yardimci/hatirlatici-zaman');console.log(new Date(z.an('2026-09-28','08:30')).toISOString())"`
  → `2026-09-28T05:30:00.000Z`.

## Son durum

- Dosya `630d9f2 commit 437` (2026-09-26) ile hatırlatıcılar bölümüyle ve ön yüz parçasıyla (`19h-hatirlaticilar.js`) birlikte
  eklendi, o günden beri değişmedi. Sonradan aile, okul hayatı ve servis penceresi `trGun`/`gunEkle` için bunu kullanmaya başladı.
- Açık iş yok. Sıradaki işlerden "Mesaj ayarları … Ajanda … duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu"
  hatırlatıcı zamanlarını yeniden kullanacak; bu dosyanın saf hesapları oraya taşınabilir.
