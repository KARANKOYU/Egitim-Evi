# sunucu/hatirlatma.js

Otomatik hatırlatmalar: öğretmene sabah günün dersleri, öğrenciye yarın teslimi olan ödevleri — kişi başına günde en
çok bir bildirim.

## Bu dosya ne yapar?

Kimse bir şey yapmadan giden iki bildirimi üretir:

- **Öğretmenin günlük ders özeti:** sabah 07:00–12:00 arasındaki ilk çalışmada, o gün dersi olan her öğretmene tek
  bildirim: "Bugün 4 dersin var: 09:20 7-A Matematik, 10:10 7-B Matematik, …". Bağlantı `#/programim`.
- **Öğrencinin yarınki ödevleri:** 08:00'den sonra, yarın son teslimi olan ve henüz sonucu olmayan ödevleri tek
  bildirimde: `Yarın Matematik dersinden "Kesirler" ödevin var (son saat 12:00).` ya da birden çoksa
  "Yarın 3 ödevin var: …". Bağlantı `#/odevler`.

Eskiden her dersten 15 dakika önce ayrı bildirim gidiyordu; günde 5–6 bildirim fazla bulundu, özet düzenine geçildi.
Kişisel hatırlatıcılar ("08:30'da hatırlat") bu dosyada değil, `sunucu/bolumler/hatirlatici.js`'te.

## İçinde neler var?

- `HATIRLATMA_ARALIK_MS` — 5 dakika; `index.js` bu aralıkla `hatirlatmalariCalistir`'ı çağırır.
- `yerelTarihAnahtari(d)` — sunucunun yerel saatiyle `YYYY-AA-GG`.
- `dersOzetleri(simdi)` → gönderilen sayısı — saat 7–12 dışında hemen 0. Günün (1 = Pazartesi … 7 = Pazar) bütün ders
  programı satırlarını `depo.siniflar.baslamakUzereOlanlar(gun, '00:00', '23:59')` ile alır, öğretmene göre toplar,
  saate göre sıralar; `gunluk-ders:<öğretmen>:<gün>` anahtarı ilk kez görülüyorsa bildirim hazırlar.
- `odevHatirlatmalari(simdi)` → gönderilen sayısı — saat 8'den önce 0. `depo.odevler.bitisiOlanlar(yarin)`; okulda
  ödevler kapalıysa (`depo.ozellikler.kapaliMi(okul, 'odev')`) atlar; sonucu olan öğrenciyi atlar; anahtar
  `odev-yarin:<öğrenci>:<yarın>`.
- `hatirlatmalariCalistir()` — ikisini sırayla çalıştırır, sonra 30 günden eski işaretleri siler
  (`depo.genel.hatirlatmaTemizle(30)`); her hatayı yakalar, günlüğe "Hatırlatma hatası:" yazar (sunucu düşmez).
- İç: `listeYaz(parcalar, birim)` — en çok 4 adı yazar, gerisi "ve 2 ders daha" / "ve 2 ödev daha" (`OZETTE_EN_FAZLA`).

## Kimle konuşur?

- Çağırdığı: `./veri` → `depo.siniflar.baslamakUzereOlanlar`, `depo.odevler.bitisiOlanlar`,
  `depo.ozellikler.kapaliMi`, `depo.genel.ilkKezOlanlar`, `depo.genel.cokluBildir`, `depo.genel.hatirlatmaTemizle`.
- Onu çağıran (grep): yalnız `sunucu/index.js` (5 dakikada bir ve açılıştan 10 sn sonra bir kez).
- Tablolar: ders programı ve ödevler (okuma), `hatirlatmalar` (gönderildi işaretleri), bildirimler (`cokluBildir`
  yazar; bildirim oradan telefona da gider — `sunucu/push.js`).

## Nasıl çalışır (adım adım)?

```
her 5 dk:
  dersOzetleri:  saat 7-12? → bugünün dersleri → öğretmen başına grupla
                 → ilkKezOlanlar('gunluk-ders:id:gün') → yalnız ilk kez olanlara → cokluBildir
  odevHatirlatmalari: saat ≥ 8? → yarın bitenler → okul ödevi kapattıysa atla
                 → sonucu olmayan öğrenciler → ilkKezOlanlar('odev-yarin:id:yarın') → cokluBildir
  hatirlatmaTemizle(30)
```

`ilkKezOlanlar` anahtarları tabloya yazıp "daha önce yoktu" olanları döndürür; böylece 5 dakikada bir çalışsa bile aynı
kişiye aynı gün ikinci bildirim gitmez, sunucu yeniden başlasa da.

## Dikkat!

- Saatler sunucunun YEREL saatiyle (`getHours`, `getDay`). Sunucu Türkiye saatinde değilse özetler yanlış saatte gider
  (`index.js` açılışta uyarır; kurulum `TZ=Europe/Istanbul` verir).
- Sabah penceresi 12:00'ye kadar: sunucu 07:00'de kapalıysa, 12:00'den önce açıldığında özet yine gider; sonra gitmez.
- Öğrenci bildirimi veliye de gider — bu kuralı bildirim katmanı uygular, bu dosya değil.
- Tatil/boş gün ayrımı yok: o gün ders programında satır varsa özet gider.

## Testleri

- Bu dosyayı doğrudan çağıran bir test paketi yok (grep: `dersOzetleri`, `odevHatirlatmalari` hiçbir testte geçmiyor).
  Dolaylı: `testler/test-bildirim.js` bildirimlerin kişiye (ve veliye) ulaşmasını, `testler/test-hatirlatici-zaman.js`
  Türkiye saati hesaplarını (kişisel hatırlatıcılar için) dener.
- Elle: test sunucusunda saat 08:00'den sonra yarın bitişli bir ödev aç, en geç 5 dk içinde (ya da açılıştan 10 sn
  sonra) öğrencinin bildirimlerine "Yarın … ödevin var" düşmeli; aynı gün ikinci kez gelmemeli.

## Son durum

- Son commit `fea9b63 commit 132` (2026-08-29): dosyanın `module.exports` bloğu bu commit'te eklendi
  (`HATIRLATMA_ARALIK_MS`, `yerelTarihAnahtari`, `dersOzetleri`, `odevHatirlatmalari`, `hatirlatmalariCalistir`);
  aynı commit `sunucu/index.js`'te 5 dakikalık zamanlayıcıyı kurdu. Dosya üç adımda yazıldı: `a619bee commit 130`
  (dosya ve öğretmenin günlük ders özeti; dersten 15 dk önceki tek tek bildirimlerin yerine), `25abe15 commit 131`
  (öğrencinin yarınki ödev hatırlatması), `fea9b63 commit 132` (dışa açma ve zamanlayıcıya bağlama).
- Bilinen açık: bu dosyanın doğrudan testi yok. Sıradaki "Mesaj ayarları / Ajanda" işindeki "ödev hatırlatma
  otomasyonu" bu dosyayı genişletebilir.
