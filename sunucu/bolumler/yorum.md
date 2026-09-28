# sunucu/bolumler/yorum.js

Açılış sayfasındaki kullanıcı yorumları (`/api/yorumlar`): herkese açık son yorumlar ve ortalama yıldız, yetişkinin
kendi yorumunu yazması/değiştirmesi/silmesi, sistem yöneticisinin yorum gizlemesi.

## Bu dosya ne yapar?

Eğitim Evi'nin açılış sayfasında "Kullananlar ne diyor?" bölümü var: yıldız (0–5) ve kısa bir yorum. Bu dosya o bölümün
sunucusudur. Yorumu yalnız Eğitim Evi'ni gerçekten kullanan YETİŞKİNLER yazar: bir okulda onaylı öğretmen ya da müdür
rolü olan ya da hesabına bir çocuk eklemiş olan kişi. Öğrenci, servisçi ve sistem yöneticisi yazmaz (dosya başı yorumu).
Her hesabın tek yorumu olur; yeniden yazmak eskisini değiştirir.

Mahremiyet için ad tam gösterilmez: "Ayşe Yılmaz" → "Ay. Yı.", iki adlıysa "Ayşe Nur Yılmaz" → "A. N. Yı.". Yorumun
yanında yazarın rol etiketi durur ("Öğretmen, veli"). Uygunsuz kelime süzgeci (`sunucu/yardimci/kufur-suzgeci.js`,
kelime listesi depo kökündeki `badwordsfilter.json`) ve bağlantı (reklam) yasağı vardır.

## İçinde neler var?

### Sabitler

- `GORUNEN_SINIR` — 12: açılışta gösterilen en yeni yorum sayısı.
- `BAGLANTI` — internet adresi yakalayıcı: `http(s)://`, `www.` ya da `.com/.net/.org/.tr/.io/.info/.xyz/.biz` ile biten
  kelime.

### Dışa açılan işlevler

- `adKisalt(tamAd)` — tek kelime: ilk iki harf + "." ("Ay."); iki kelime: ad ve soyadın ilk iki harfi ("Ay. Yı."); üç ve
  daha çok: adların baş harfleri ve soyadın ilk iki harfi ("A. N. Yı."). Türkçe büyük/küçük harfle. Başka dosya
  kullanmıyor (grep).
- `uclar(k)` — aşağıdaki uçlar.

### İç işlevler

- `buyukBas(s)` — ilk harf büyük, gerisi küçük (Türkçe).
- `yazarBilgisi(me)` → `{ ana, rol }` ya da `{ ana?, neden }`. Kişi rol satırıyla girdiyse ANA (yetişkin) hesabı bulunur.
  Ana hesap yetişkin değilse (`depo.kullanicilar.yetiskinMi`: ana hesap altı değil ve rolü boş ya da `parent`; yani
  öğrenci, servisçi, yönetici) neden "Yorumları yalnızca veli, öğretmen ve müdür hesapları yazabilir.". Etiketler: onaylı
  müdür rolü → "Müdür", onaylı öğretmen rolü → "Öğretmen", bağlı çocuk → "Veli"; hiçbiri yoksa neden "Yorum yazmak için
  bir okulda öğretmen ya da müdür olman ya da çocuğunu eklemiş olman gerekiyor.". Etiket "Müdür, öğretmen, veli" gibi
  birleşir.
- `gorunenler()` — herkese açık liste; bellekte 1 dakika önbellek (`onbellek`). Yazma, silme ve gizleme önbelleği
  boşaltır (`onbellegiBosalt`).

### Uçlar

Hepsi `p === 'yorumlar'`. Bu bölüm `need()` kullanmaz; giriş gereken yerde yalnız `me` var mı bakılır. `yorumlar`
aydınlatma onayı beklenirken de açık yollardandır (`KVKK_SERBEST`) ve rolsüz yetişkine de açıktır.

- **`GET /api/yorumlar`** — HERKESE AÇIK (girişsiz): `{ sayi, ortalama (bir ondalık), yorumlar: [{ adKisa, rol, yildiz,
  metin, tarih }] }` — gizlenmemiş yorumların sayısı ve ortalaması, en son GÜNCELLENEN 12'si (sıra `guncelleme`
  sütunu: eski bir yorumu değiştiren kişi listenin başına çıkar; `tarih` da güncelleme zamanıdır). Kişi kimliği gitmez.
- **`GET /api/yorumlar/benim`** — girişsiz 401. `{ yazabilir, neden, adKisa, rol, yorum: { yildiz, metin, gizli, tarih }
  | null }`.
- **`POST /api/yorumlar`** — gövde `{ yildiz, metin }`. Girişsiz 401; `yazarBilgisi` nedeni varsa 403 o metinle; ana
  hesap başına saatte 10 (429 "Yorumunu çok sık değiştirdin. Biraz sonra dene."); `yildiz` 0–5 tam sayı (400); metin
  boşlukları teke indirilir, 3 harften kısa (400 "Yorumunu yaz (en az 3 harf).") ya da 500'den uzun (400) olamaz; adres
  varsa 400 "Yoruma internet adresi eklenemez."; uygunsuz kelime varsa işlem kaydına `yorum.reddedildi` yazılır ve 400
  "Yorumunda uygun olmayan bir kelime var. Düzeltip yeniden gönder." (yorum kaydedilmez). Geçerse hesabın yorumu
  eklenir ya da değiştirilir (`adKisa` ve `rol` o anki hâliyle saklanır). Cevap: yorum yönetici tarafından gizlenmişse
  "Yorumun güncellendi. Sistem yöneticisi gizlediği için açılışta görünmüyor.", değilse "Yorumun açılış sayfasında
  görünüyor. Teşekkürler!".
- **`POST /api/yorumlar/sil`** — girişsiz 401; ana hesabın yorumu silinir (yoksa da) "Yorumun silindi.".
- **`GET /api/yorumlar/hepsi`** — yönetici: gizliler dahil son güncellenen 300: `{ yorumlar: [{ id, adKisa, rol, yildiz, metin,
  gizli, tarih }] }`.
- **`POST /api/yorumlar/gizle`** — yönetici: gövde `{ id, gizli }`; yorum yoksa 404; `gizli` yalnız `true` gelirse
  gizler, başka her değer açar; işlem kaydı `yorum.gizlendi` / `yorum.acildi`. Cevap `{ ok: true }`.

Son ikisinde kodda "yönetici değilse 403" var, ama bu yollar `api.js`'in `yoneticiUcuMu` listesinde: yönetici olmayana
istek buraya hiç gelmez, bilinmeyen adresle aynı 404'ü alır ([api.md](../api.md)).

## Kimle konuşur?

- Çağırdıkları: `../http` (`bad`, `ok`); `../guvenlik` (`hizSinir`); `../ortak` (`clean`, `uid`: `yr` önekli);
  `../veri` (`depo`); `sunucu/yardimci/kufur-suzgeci.js` (`uygunsuzKelime`); `./islem-kaydi` (`islemYaz`,
  [islem-kaydi.md](islem-kaydi.md)).
- Depo ve tablolar: `depo.yorumlar` (`sunucu/veri/depo/yorumlar.js`, şema 019) → `yorumlar`: `gorunenler`, `hesabin`,
  `bul`, `yaz` (hesap başına tek), `hesabinkiniSil`, `gizle`, `hepsi`. `depo.kullanicilar` → `bul`, `yetiskinMi`,
  `rolleri`, `cocuklari` (`kullanicilar`, `veli_baglari`).
- Onu çağıran: yalnız `sunucu/api.js` (`BOLUM.yorumlar`).
- Ön yüz: `public/js/parcalar/05a-dis-sayfalar.js` (açılıştaki liste; `public/index.html`'deki yer),
  `23-veli-ayarlar.js` (ayarlarda "Yorumum": benim, yaz, sil), `public/js/yonetim/09-yonetici.js` (yönetim panelinde
  hepsi ve gizle).
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
Ziyaretçi:  GET /api/yorumlar ─> (1 dk önbellek) gizlenmemiş son güncellenen 12 + sayı + ortalama
Yetişkin:   POST /api/yorumlar {yildiz, metin}
              ana hesap ─ yazabilir mi (onaylı öğretmen/müdür rolü ya da çocuk)
              hız (10/saat) ─ yıldız ─ uzunluk ─ adres ─ uygunsuz kelime (işlem kaydı)
              yaz (varsa değiştir; adKisa + rol etiketi) ─ önbelleği boşalt
Yönetici:   GET hepsi ─ POST gizle {id, gizli}
```

## Dikkat!

- **Ad kısaltması yazarken saklanır.** Kişi adını değiştirse ya da rolü değişse açılıştaki `adKisa`/`rol` yorum yeniden
  yazılana kadar eski kalır.
- Açılış listesi 1 dakika önbellekte; yazma, silme ve gizleme önbelleği hemen boşaltır. Önbellek süreç içidir: birden
  çok sunucu süreci çalışsaydı her biri ayrı tutar, öteki süreçte değişiklik en geç 1 dakika sonra görünürdü.
- Uygunsuz kelime reddi işlem kaydına kelimeyle birlikte yazılır (kim, ne zaman); yorum metni kaydedilmez.
- `sil` ucu yorum olmasa da başarı döner.
- Gizlenen yorumu sahibi değiştirebilir, ama gizli kalır (`yaz` gizliliği değiştirmez; cevap bunu söyler).

## Testleri

- `testler/test-yorum-ek.js` — yorum bölümü: açılış girişsiz açık; öğrenci ve rolsüz/çocuksuz yetişkin yazamaz (nedeni
  söylenir); öğretmen yazabilir, ad kısaltılmış; uygunsuz kelime (büyük harf, uzatılmış, harf harf) reddi ve kaydedilmemesi;
  adres, 6 yıldız, çok kısa yorum reddi; masum kelimeler ("sık", "sıkıntı") geçer; müdür yazar; hesap başına tek yorum;
  açılışta kişi kimliği yok; yönetici olmayana gizleme ucu yok (404); gizlenen yorum açılışta yok; kendi yorumunu silme.
  Paketin geri kalanı ekleri dener ([ekler.md](ekler.md)).
- `testler/test-admin-gizli.js` — `/api/yorumlar/hepsi|gizle` yönetici olmayana bilinmeyen adresle aynı 404.
- `testler/yetki-denetimi.js`.
- Elle: öğretmen hesabıyla (`testler/seed.js`) Ayarlar → Yorumum; girişsiz `curl http://localhost:3200/api/yorumlar`.

## Son durum

- Tek commit: `7d59731 commit 411` (2026-09-26) — dosya bütünüyle geldi (145 satır) ve açılış sayfasının yorum
  parçası (`05a-dis-sayfalar.js`). O günden beri değişmedi.
- Açık iş yok. Sıradaki işlerden "Sistem: … site duyurusu…" ve "Paneller /panel/admin ve /panel/destek" işleri yönetim
  tarafındaki yorum ekranını taşıyabilir; bu dosya için yazılı bir plan yok.
