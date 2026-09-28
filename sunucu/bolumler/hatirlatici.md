# sunucu/bolumler/hatirlatici.js

Kişisel hatırlatıcılar (`/api/hatirlaticilar`): herkesin kendine kurduğu "bir kez / her gün / haftanın günleri / ayda
bir" hatırlatmaları ve zamanı gelenlere dakikada bir bildirim gönderen zamanlayıcı işi.

## Bu dosya ne yapar?

Öğrenci "her pazartesi 07:30: spor çantası", veli "ayın 1'i 09:00: servis ücreti", öğretmen "yarın 15:00: veli
toplantısı" gibi hatırlatıcılar kurar. Başlık, açıklama, sıklık ve saat seçilir; zamanı gelince kişiye bildirim gider
(site bildirimleri; telefon uygulaması da aynı bildirimleri yoklar — [cihaz.md](cihaz.md)). Hatırlatıcı YALNIZ sahibine
görünür. Herkes kurabilir: öğrenci, veli, öğretmen, müdür, servisçi ve henüz rolü olmayan yetişkin (dosya başı yorumu;
`hatirlaticilar` `api.js`'in `ROLSUZ_SERBEST` listesinde).

Zaman hesabı ayrı ve saf bir dosyada: `sunucu/yardimci/hatirlatici-zaman.js`. Saatler TÜRKİYE saatidir (UTC+3, yaz saati
yok): sunucu başka saat diliminde çalışsa da "08:30" Türkiye'de 08:30'dur.

## İçinde neler var?

### Sabitler

- `SINIR` — 50: kişi başına en çok hatırlatıcı.
- `SIKLIKLAR` — `['bir-kez', 'her-gun', 'her-hafta', 'her-ay']`.

### Dışa açılan işlevler

- `dogrula(body)` → `{ h: { baslik, aciklama, siklik, saat, tarih, ayGunu, gunler } }` ya da `{ hata, alan }`:
  - `baslik` zorunlu, 120 harf ("Başlık yaz."); `aciklama` 1000 harf;
  - `siklik` listede olmalı ("Ne sıklıkla hatırlatılacağını seç.");
  - `saat` `saatDuzelt`'ten geçmeli ("Saati seç (ör. 08:30).");
  - `bir-kez`: `tarih` (`tarihCoz` ile) zorunlu ("Günü seç.") ve o gün+saat gelecekte olmalı ("Bu gün ve saat geçti; ileri
    bir zaman seç.");
  - `her-hafta`: `gunler` 1 (Pazartesi)–7 (Pazar), tekilleştirilmiş, sıralı, en az biri ("Haftanın en az bir gününü seç.");
  - `her-ay`: `ayGunu` 1–31 ("Ayın kaçında hatırlatılacağını seç (1-31)."). 31 seçilirse kısa aylarda ayın son günü.
  Başka dosya çağırmıyor (grep); `alan` bilgisi uçta cevaba konmuyor (yalnız `error` metni gider).
- `hatirlaticilariGonder(simdi)` — `sunucu/index.js` dakikada bir çağırır. Açık hatırlatıcıların her biri için
  `zaman.zamaniGeldi`'ye sorar; zamanı gelmişse önce "gönderildi" yazar (bir kezlik olan kapanır), sonra sahibine
  "Hatırlatma: <başlık> — <açıklama>" bildirimi (`#/hatirlaticilar`, `{ veliye: false }` — kod yorumu: kişinin kendi
  kurduğu hatırlatma yalnız ona gider, öğrenciyse velisine kopya gitmez). Gönderilen sayısını döner. `calisiyor`
  bayrağıyla iki tur üst üste binmez.
- `uclar(k)` — aşağıdaki uçlar.

### İç işlev

- `gorunum(h)` → `{ id, baslik, aciklama, siklik, tarih, saat, ayGunu, gunler, aktif, sonGonderim, sonraki }` —
  `sonraki` bir sonraki hatırlatma anı (ISO; durdurulmuşsa ya da bir kezliğin günü geçmişse `''`).

### Uçlar

Hepsi `p === 'hatirlaticilar'`; önce `need()` (401/403).

- **`GET /api/hatirlaticilar`** → `{ hatirlaticilar: [...gorunum], sinir: 50 }` (yalnız kendininkiler).

Listeden sonraki her istek kişi başına saatte 120 sınırına sayılır (429 "Çok sık değiştirdin. Biraz sonra dene.").

- **`POST /api/hatirlaticilar`** — yeni; 50'yi doldurduysa 400 "En fazla 50 hatırlatıcı kurabilirsin; kullanmadığını
  sil."; `dogrula` hatası 400. Kimlik `h` önekli. Cevap `{ hatirlatici, message: 'Hatırlatıcı kuruldu.' }`.
- **`POST /api/hatirlaticilar/<id>`** — düzenle (`dogrula` ile aynı alanlar). Başkasınınki ya da olmayan 404
  "Hatırlatıcı bulunamadı" (kod yorumu: başkasınınki "yok" sayılır). Düzenleme sayacı baştan başlatır (yeni saat bugün
  geçmişse ilk hatırlatma yarın). Cevap `{ hatirlatici, message: 'Kaydedildi.' }`.
- **`POST /api/hatirlaticilar/<id>/durum`** — gövde `{ aktif }`; yalnız `true` açar. Günü geçmiş bir kezliği açmak 400
  "Bu hatırlatıcının günü geçti; düzenleyip yeni bir gün seç.". Yeniden açınca da baştan sayılır (geçmiş anlar topluca
  gelmesin — depo yorumu). Cevap `{ hatirlatici, message: 'Yeniden başladı.' | 'Durduruldu.' }`.
- **`POST /api/hatirlaticilar/<id>/sil`** — `{ message: 'Silindi.' }`.
- Başka yol/yöntem 404 "Böyle bir adres yok".

## Kimle konuşur?

- Çağırdıkları: `../http` (`bad`, `ok`); `../guvenlik` (`hizSinir`); `../ortak` (`clean`, `tarihCoz`, `uid`);
  `../iliskiler` (`saatDuzelt`); `../veri` (`depo`, `bildir`); `sunucu/yardimci/hatirlatici-zaman.js` (`an`, `sonraki`,
  `zamaniGeldi`).
- Depo ve tablolar: `depo.hatirlaticilar` (`sunucu/veri/depo/hatirlaticilar.js`, şema 024) → `hatirlaticilar` ve
  `hatirlatici_gunleri` (haftalık günler): `kisinin`, `bul`, `sayisi`, `aktifler`, `ekle`, `guncelle`, `aktifYaz`, `sil`,
  `gonderildi`. Bildirim → `bildirimler`.
- Onu çağıranlar: `sunucu/api.js` (`BOLUM.hatirlaticilar`); `sunucu/index.js` (`hatirlaticilariGonder`, dakikada bir).
  Ders/ödev/sınav hatırlatmaları AYRI bir iştir: `sunucu/hatirlatma.js` ([hatirlatma.md](../hatirlatma.md)).
- Ön yüz: `public/js/parcalar/19h-hatirlaticilar.js` (liste, kur/düzenle penceresi, durdur/başlat, sil).
- Android uygulaması bu uçları çağırmıyor (grep); bildirimleri `/api/cihaz/bildirimler` ile alır.

## Nasıl çalışır (adım adım)?

```
Kişi:   POST /api/hatirlaticilar {baslik, siklik, saat, tarih|gunler|ayGunu}
          hız (120/saat) ─ en çok 50 ─ dogrula ─ ekle

index.js her 60 sn:  hatirlaticilariGonder()
   aktifler ─ her biri: zamaniGeldi(h, şimdi)?
       bugün ya da dün, gün kurala uyuyor, an <= şimdi, en çok 6 saat gecikmiş,
       son gönderimden ve kuruluştan sonra  ─> an
   gonderildi(id, an, bir kezlik mi) ─> bildir(sahip, "Hatırlatma: ...", veliye: false)
```

## Dikkat!

- **Önce "gönderildi", sonra bildirim.** Bildirim yazılamazsa hatırlatma yine gönderilmiş sayılır (tekrar denenmez);
  bunun karşılığında aynı hatırlatma iki kez gitmez.
- **Sunucu kapalı kaldıysa** 6 saate kadar geciken hatırlatma açılışta yine gider, daha eskisi gitmez
  (`hatirlatici-zaman.js`). Kurulmadan önceki anlar sayılmaz.
- Düzenleme ve yeniden başlatma sayacı `olusturma = now()` ile sıfırlar: bugün geçmiş bir saat için hemen bildirim
  gelmez. Düzenleme ayrıca hatırlatıcıyı AÇAR (`aktif = true`, `son_gonderim` boşalır): durdurulmuş bir hatırlatıcıyı
  düzenlemek onu yeniden başlatır.
- Zamanlayıcı her dakika bütün açık hatırlatıcıları okur (kişi başına en çok 50). Çok büyük kurulumda sorgu büyür;
  "Optimizasyon" işine not.
- Hız sınırı, listeden sonraki HER isteğe (başarısız olanlar dahil) sayılır.
- Bir kezlik hatırlatıcı gönderilince kapanır (`aktif = false`); listede durur, kişi silebilir ya da yeni günle düzenler.

## Testleri

- `testler/test-hatirlatici.js` — öğrenci, öğretmen, müdür ve rolsüz yetişkin kurabiliyor; haftalık/bir kez/her gün/ayda
  bir ve sonraki an (Türkiye saati); başlık, gün seçimi, geçersiz gün, geçersiz saat, geçmiş gün, ayın 32'si reddi;
  başlık yerine nesne 400 (500 değil); başkası göremez, düzeltemez, silemez; düzenle, durdur (sonraki an yok), başlat,
  sil; kişi başına 50.
- `testler/test-hatirlatici-zaman.js` — `hatirlatici-zaman.js`'in birim testleri (sunucusuz): gün uyumu, ay sonu, 6 saat
  gecikme, sonraki an.
- Elle: herhangi bir test hesabıyla (`testler/seed.js`) 2 dakika sonrasına bir kezlik hatırlatıcı kur; dakika dolunca
  bildirimlerde "Hatırlatma: …" görünmeli.

## Son durum

- Tek commit: `630d9f2 commit 437` (2026-09-26) — dosya (123 satır), `hatirlatici-zaman.js` ve ön yüzün
  `19h-hatirlaticilar.js`'i birlikte geldi. O günden beri değişmedi.
- Açık iş yok. Sıradaki planlı değişiklik: "Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, … duyurudan ajanda +
  hatırlatıcı, ödev hatırlatma otomasyonu" işi duyurudan hatırlatıcı kurmayı buraya bağlayacak.
