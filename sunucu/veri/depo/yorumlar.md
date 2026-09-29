# sunucu/veri/depo/yorumlar.js

Açılış sayfasındaki kullanıcı yorumlarının (`yorumlar`) SQL'i: hesabın yorumu, tek yorum, yazma (hesap başına tek,
upsert), silme, gizleme, açılışta görünenler + ortalama yıldız ve yönetici için bütün liste.

## Bu dosya ne yapar?

Eğitim Evi'ni kullanan yetişkinler (veli, öğretmen, müdür) bir yorum ve 0–5 yıldız bırakır; açılış sayfasının altında
görünür. Hesap başına TEK yorum vardır, sonradan değiştirilebilir. Ad tam yazılmaz, kısaltılır ("Ayşe Kaya" →
"Ay. Ka."); kısaltma ve kişinin etiketi ("Veli", "Öğretmen, veli") yazıldığı anda saklanır. Sistem yöneticisi bir yorumu
gizleyebilir: silinmez, açılışta görünmez olur (şema 019).

Kimin yazabileceği, adın nasıl kısaltıldığı, uygunsuz kelime ve bağlantı süzgeci, bir dakikalık önbellek
[../../bolumler/yorum.md](../../bolumler/yorum.md)'dedir; kelime listesi [../../yardimci/kufur-suzgeci.md](../../yardimci/kufur-suzgeci.md).

## İçinde neler var?

İç dönüştürücü `nesne(r)` → `{ id, hesapId, yildiz, metin, adKisa, rol, gizli, olusturma, guncelleme }` ya da `null`
([../esleme.md](../esleme.md) kullanılmaz).

- `hesabin(hesapId)` — hesabın yorumu ya da `null` (`hesap_id` tekil olduğu için en çok bir).
- `bul(id)` — kimlikle yorum ya da `null`.
- `yaz(y)` — `y = { id, hesapId, yildiz, metin, adKisa, rol }`. `INSERT … ON CONFLICT (hesap_id) DO UPDATE SET yildiz,
  metin, ad_kisa, rol, guncelleme = now()`: hesabın yorumu varsa değişir, yoksa eklenir. `gizli` DEĞİŞMEZ (gizlenmiş
  yorum düzenlenince gizli kalır) ve çakışmada `id` eskisi kalır. Şema: yıldız 0–5, metin 3–500, kısa ad ≤ 40, etiket
  ≤ 60 karakter (aykırıysa `23514`).
- `hesabinkiniSil(hesapId)` — hesabın yorumunu siler.
- `gizle(id, gizli)` — `gizli = !!gizli` (gizler ya da yeniden açar).
- `gorunenler(sinir)` — iki sorgu paralel: gizli olmayanların en yenileri (`ORDER BY guncelleme DESC LIMIT $1`;
  `yorumlar_gorunen` kısmi indeksiyle) ve gizli olmayanların sayısı + ortalama yıldızı (`count(*)::int`,
  `coalesce(avg(yildiz), 0)::float`). `{ yorumlar, sayi, ortalama }` döner.
- `hepsi(sinir)` — yönetici için gizliler dahil en yeniler.

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `yorumlar` (`hesap_id` `UNIQUE`, yetişkin ANA hesabı, silinince CASCADE; `yildiz` 0–5, `metin` 3–500, `ad_kisa` ≤ 40, `rol` ≤ 60, `gizli`, `olusturma`, `guncelleme`; `yorumlar_gorunen (guncelleme DESC) WHERE NOT gizli` indeksi) | `019-yorumlar.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`sorgu`, `tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.yorumlar`): yalnız [../../bolumler/yorum.md](../../bolumler/yorum.md) —
  `GET /api/yorumlar` (girişsiz; `gorunenler(12)`, bir dakika önbellekli), `/api/yorumlar/benim` (`hesabin`), `POST
  /api/yorumlar` (`hesabin` ile eski kimlik + `yaz`), `/sil` (`hesabinkiniSil`), yönetici `/hepsi` (`hepsi(300)`) ve
  `/gizle` (`bul` + `gizle`).
- Bu dosyadan geçmeden aynı tabloya dokunan: [../json-aktarim.md](../json-aktarim.md) (yorumları içeri aktarır ve dışa
  verirken okur).
- Tablo: `yorumlar`.

## Nasıl çalışır (adım adım)?

```
POST /api/yorumlar { yildiz, metin }
  bölüm: giriş var mı? ana hesap yetişkin mi, öğretmen/müdür rolü ya da çocuğu var mı? (etiket: "Öğretmen, veli")
         hız sınırı ; 0–5 yıldız ; 3–500 karakter ; bağlantı yok ; uygunsuz kelime yok
  eski = hesabin(ana) → yaz({ id: eski ? eski.id : yeni, hesapId: ana, …, adKisa: adKisalt(ad), rol })
  önbelleği boşalt → "gizlendiği için görünmüyor" ya da "görünüyor"

GET /api/yorumlar → (1 dk önbellek) gorunenler(12) → { sayi, ortalama (bir ondalık), yorumlar: [adKisa, rol, yıldız, metin, tarih] }
```

## Dikkat!

- **Yorum ANA hesaba bağlıdır:** bölüm `me.anaHesapId || me` ile yetişkin hesabını bulur; okul rolü satırı kimliğiyle
  yazılırsa aynı kişinin iki yorumu olabilirdi.
- **Açılışta kişi kimliği gitmez:** herkese açık liste yalnız kısa ad, etiket, yıldız, metin ve tarih taşır (test
  ediliyor). `hesap_id` ve `id` dışarı verilmez; yönetici listesi `id` içerir (gizlemek için).
- **Kısa ad saklanır:** kişi adını sonradan değiştirse de eski yorumunda eski kısa ad kalır, ta ki yorumunu yeniden
  kaydedene kadar.
- **Gizli yorum düzenlenince gizli kalır** (`yaz` `gizli`'ye dokunmaz); bölüm kişiye bunu söyler.
- **Yönetici uçları bölümde denetlenir** (`me.role === 'admin'`); bu dosya rol bilmez.
- **Güvenlik:** bütün değerler parametreyle; metin düz metin saklanır, ön yüz kaçışla basar. Uygunsuz kelime
  reddedilince yorum hiç yazılmaz (işlem kaydına yalnız kelime düşer).

## Testleri

- `testler/test-yorum-ek.js` (ilk yarısı) — açılış yorumlarının girişsiz açık olması, öğrencinin ve rolsüz/çocuksuz
  yetişkinin yazamaması, öğretmenin yazması ve adın kısaltılması, uygunsuz kelime (büyük harf, uzatılmış, harf harf),
  reddedilen yorumun kaydedilmemesi, internet adresi, 6 yıldız, çok kısa yorum, müdürün yazması, hesap başına tek yorum
  (güncelleme yeni satır açmaz), açılışta kişi kimliği olmaması, yönetici olmayanın gizleyememesi, gizlenen yorumun
  görünmemesi, kendi yorumunu silme. Dosyanın ikinci yarısı ekleri sınar ([ekler.md](ekler.md)).
- Elle: veli hesabıyla yorum yaz, açılış sayfasını yenile (önbellek boşaltıldığı için hemen) → kısa adınla görünmeli;
  yönetici gizleyince hemen kaybolmalı (gizleme de önbelleği boşaltır).

## Son durum

- Tek commit: `28e484d commit 410` (2026-09-26) — dosya 019 şema dosyasıyla bu hâliyle eklendi.
- Bilinen açıklar (kod değiştirilmedi): kodda hata bulunmadı. Şema dosyasının (019) ve bölümün yorumlarında ad
  kısaltma örneği olarak gerçek bir kişi adı geçiyor; depo herkese açık olduğu için uydurma bir adla değiştirilmesi
  önerilir (bu belgede uydurma ad kullanıldı).
- Sıradaki planlı işler (DEVAM.md 4. bölüm): "Android yerel uygulama" işindeki SOL MENÜ (giriş yapmadan: ana sayfa,
  **yorumlar** …) bu yorumları uygulamada da gösterecek (yorumun kapsamı §7'de soru olarak bekliyor); "Paneller"
  işindeki `/panel/admin` ve `/panel/destek` yorum gizleme ekranının yerini değiştirebilir.
