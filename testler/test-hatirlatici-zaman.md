# testler/test-hatirlatici-zaman.js

Hatırlatıcıların Türkiye saatine göre ne zaman çalacağını hesaplayan `sunucu/yardimci/hatirlatici-zaman.js`'i sabit tarihlerle,
sunucusuz ve veritabanısız deneyen birim test paketi (22 denetim).

## Bu dosya ne yapar?

Bir öğrenci "her pazartesi ve çarşamba 07:45'te hatırlat" dediğinde o 07:45 Türkiye'nin 07:45'idir; oysa sunucu çoğu VPS gibi
UTC'de çalışıyor olabilir. Saat hesabındaki bir hata kimseye hata iletisi göstermez: hatırlatma üç saat geç gelir, aynı sabah
iki kez gelir, ayın 31'i seçilince eylülde hiç gelmez ya da sunucu yeniden başlayınca sabahki hatırlatma akşam düşer. Bunlar
ancak böyle bir testle görülür.

Paket, [../sunucu/yardimci/hatirlatici-zaman.md](../sunucu/yardimci/hatirlatici-zaman.md)'deki saf işlevleri doğrudan çağırır:
Türkiye saati dönüşümü (`an`, `trGun`, `haftaGunu`, `ayinSonGunu`), bir sonraki hatırlatma anı (`sonraki`) ve dakikalık döngünün
"şimdi gönderilmeli mi?" kararı (`zamaniGeldi`). Bütün anlar `+03:00` ekli sabit metinlerden kurulur (2026 Eylül–Ekim, 2027
Şubat); bu yüzden sonuç ne bu bilgisayarın saat dilimine ne de bugünün tarihine bağlıdır. Yaklaşık 0,1 saniye sürer.

## İçinde neler var?

### Yardımcılar ve örnek hatırlatıcılar

- `kontrol(ad, sart, detay)` — `GECTI` / `KALDI` satırı.
- `iso(ms)` — ms'yi ISO metne çevirir (karşılaştırma ve hata satırı için); `0` ya da `null` gelirse onu metin olarak yazar.
- `TR(s)` — `Date.parse(s + '+03:00')`: `"2026-09-28T08:30:00"` Türkiye saatiyle.
- `kur` — kuruluş anı: 26 Eylül 2026 Cumartesi 10:00 (Türkiye). Bütün örnekler `olusturma: iso(kur)` ve `aktif: true` taşır.
- Örnek hatırlatıcılar: `gunluk` (her gün 08:30), `haftalik` (her hafta, `gunler: [1, 3]` = Pazartesi ve Çarşamba, 07:45),
  `aylik` (her ay, `ayGunu: 31`, 09:00), `birKez` (5 Ekim 2026, 14:00).

### 1) Türkiye saati (5)

| Denetim | Beklenen |
|---|---|
| `an('2026-09-28', '08:30')` | `2026-09-28T05:30:00.000Z` |
| `trGun(TR('2026-09-28T01:00:00'))` — UTC'de hâlâ 27'si 22:00 | `'2026-09-28'` |
| `haftaGunu('2026-09-28')` | `1` (Pazartesi) |
| `haftaGunu('2026-10-04')` | `7` (Pazar; JavaScript'in 0'ı burada 7) |
| `ayinSonGunu('2027-02-10')` | `28` |

### 2) Sonraki hatırlatma anı — `sonraki(h, simdi)` (8)

- Her gün 08:30, cumartesi 10:00'da kurulunca ilki ertesi gün (27 Eylül) 08:30.
- Pazartesi + Çarşamba 07:45: cumartesiden bakınca ilki 28 Eylül Pazartesi 07:45; pazartesi 08:00'den (o günkü geçmiş) bakınca
  30 Eylül Çarşamba 07:45.
- Ayın 31'i 09:00: eylülde 30 Eylül 09:00 (ay kısa); 1 Şubat 2027'den bakınca 28 Şubat 2027 09:00.
- Bir kez: 5 Ekim 14:00; 5 Ekim 14:01'den bakınca `null`.
- Durdurulmuş (`aktif: false`) her gün hatırlatıcısı: `null`.

### 3) Zamanı geldi mi — `zamaniGeldi(h, simdi)` (9)

Dönen değer gönderilecek anın ms'si ya da `0`:

- Kurulduğu gün 10:05'te: `0` (08:30 kuruluştan önceydi; geriye dönüp çalmaz).
- Ertesi gün 08:30:20'de: 08:30 anı. 08:29'da: `0`.
- `sonGonderim` 27 Eylül 08:30 iken 09:00'da: `0` (aynı an ikinci kez gitmez).
- 13:29'da (4 saat 59 dakika gecikme; test adı "5 saat"): 08:30 anı yine gider — sunucu kapalı kalmış senaryosu.
- 15:00'te (6,5 saat): `0` — 6 saatten eski gecikme atılır.
- 23:50 hatırlatması, ertesi gün 00:05'te yoklanınca: önceki günün 23:50 anı (işlev dünü de dener).
- Haftalık (Pzt + Çar): salı 07:50'de `0`; çarşamba 07:50'de 07:45 anı.

Toplam 5 + 8 + 9 = 22. Sonunda boş satır ve `GECTI: 22   KALDI: 0`; `KALDI` varsa çıkış kodu 1.

## Kimle konuşur?

- **Çağırdığı tek modül:** `sunucu/yardimci/hatirlatici-zaman.js` →
  [../sunucu/yardimci/hatirlatici-zaman.md](../sunucu/yardimci/hatirlatici-zaman.md). Kullandığı işlevler: `an`, `trGun`,
  `haftaGunu`, `ayinSonGunu`, `sonraki`, `zamaniGeldi`. Sunucu, veritabanı, ağ, dosya yok.
- **Koruduğu kod:** o dosyanın tamamı; dolaylı olarak onu kullananlar — hatırlatıcı bölümü
  ([../sunucu/bolumler/hatirlatici.md](../sunucu/bolumler/hatirlatici.md): listedeki `sonraki` alanı ve dakikalık
  `hatirlaticilariGonder`), aile ekranı ([../sunucu/bolumler/aile.md](../sunucu/bolumler/aile.md): `trGun`, `gunEkle`), okul
  hayatı ([../sunucu/bolumler/okul-hayati.md](../sunucu/bolumler/okul-hayati.md): `trGun`, `gunEkle`) ve servis penceresi
  ([../sunucu/yardimci/servis-pencere.md](../sunucu/yardimci/servis-pencere.md): `an`, `trGun`, `gunEkle`).
- **Ön yüz:** sunucunun hesapladığı `sonraki`'yi gösteren [../public/js/parcalar/19h-hatirlaticilar.md](../public/js/parcalar/19h-hatirlaticilar.md).
- **Onu çalıştıran:** `testler/tumtest.sh` — sunucusuz paketler döngüsünün beşinci paketi (`test-resim-kucult`'tan sonra,
  `test-servis-pencere`'den önce).

## Nasıl çalışır (adım adım)?

```
require('../sunucu/yardimci/hatirlatici-zaman')
=== TÜRKİYE SAATİ ===   an / trGun / haftaGunu / ayinSonGunu     sabit girdi ─► sabit çıktı
=== SONRAKİ ===         kur = 26.09.2026 10:00 TR
                        gunluk, haftalik, aylik, birKez ─► sonraki(h, kur | başka an)
=== ZAMANI GELDİ Mİ === zamaniGeldi(h, an)  ─► an (ms) ya da 0
                        sonGonderim, 6 saat gecikme, dün, hafta günü
GECTI: n   KALDI: m ─► çıkış kodu
```

Hiçbir adım bir öncekine bağlı değil; bir denetim kalsa bile öbürleri çalışır.

## Dikkat!

- **Saat dilimi bağımsızlığı kasıtlı.** `TR()` ve `an()` sabit `+03:00` kullanır; bilgisayarın ya da sunucunun saat dilimi
  sonucu değiştirmez. Türkiye bir gün yaz saatine dönerse hem kaynak dosyadaki `+03:00` hem bu paketteki beklentiler birlikte
  değişmeli.
- **Denenmeyenler.** `gunEkle` ve `gunUyar` doğrudan çağrılmaz (`sonraki` / `zamaniGeldi` içinden dolaylı denenir;
  `gunEkle`'yi ayrıca `testler/test-servis-pencere.js` servis penceresi üzerinden kullanır). Bilinmeyen sıklık, artık yılın
  29 Şubat'ı, `sonraki`'nin 400 günlük arama sınırı (ör. günü seçilmemiş haftalık), tam o ana eşit `simdi` ve bozuk girdi
  (`NaN`, `RangeError`) bu pakette yok.
- **"5 saat gecikmeli" denetimi aslında 4 saat 59 dakikadır** (08:30 → 13:29). 6 saat sınırının tam kenarı (`simdi - a`
  tam 6 saat) denenmez; sınır `<=` olduğu için tam 6 saatteki hatırlatma gider (koddan).
- **Yalnız hesap denenir, gönderim değil.** Dakikalık döngünün gerçekten bildirim yazdığını ve aynı anı iki kez yazmadığını
  hiçbir paket denemez (`testler/` altında `hatirlaticilariGonder` geçmiyor); sunuculu [test-hatirlatici.md](test-hatirlatici.md)
  yalnız uçları dener.

## Testleri

- Bu dosyanın kendisi testtir; `testler/tumtest.sh` her tam koşuda sunucusuz paketler arasında çalıştırır.
- Elle (proje kökünde): `node testler/test-hatirlatici-zaman.js`. Sunucu ve veritabanı gerekmez.
- 3 Ekim'de bu belge için çalıştırıldı (belgenin denetiminde bir kez daha): `GECTI: 22   KALDI: 0`, çıkış 0, yaklaşık 0,1
  saniye.
- Aynı alanın sunuculu tarafı: [test-hatirlatici.md](test-hatirlatici.md) (uçlar, doğrulama, sahiplik, 50 sınırı).

## Son durum

- `git log`: tek commit. Dosya `6f68597 commit 438` (2026-09-26) ile 51 satır olarak, sunuculu `testler/test-hatirlatici.js`
  ve ön yüzdeki `19h-hatirlaticilar.js`'in eylemleri (`hatirlatici-yeni`, `-duzenle`, `-kaydet`, `-durum`, `-sil`) ile birlikte
  eklendi; o günden beri değişmedi. Test ettiği `hatirlatici-zaman.js` bir önceki commit'te (`630d9f2 commit 437`, aynı gün)
  geldi ve o da değişmedi.
- Açık iş yok; kod değiştirilmedi.
- Planlı işlerden **"Mesaj ayarları (çark), … Ajanda, … duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu"** bu
  dosyanın denediği zaman hesaplarını yeniden kullanacak; yeni bir sıklık ya da "ödev son tesliminden N saat önce" gibi bir
  kural gelirse beklentileri buraya eklenmeli. **"Optimizasyon + saklama süreleri"** dakikalık döngüyü değiştirirse
  `zamaniGeldi`'nin dün/bugün penceresi buradan korunur.
