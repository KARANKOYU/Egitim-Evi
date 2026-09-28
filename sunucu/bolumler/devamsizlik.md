# sunucu/bolumler/devamsizlik.js

Yoklama ve devamsızlık (`/api/devamsizlik`): öğretmenin ders yoklaması, tek ders saatinin düzeltilmesi, öğrencinin,
velinin ve personelin dökümleri, okul geneli özet ve öğrenciye/veliye giden devamsızlık bildirimleri.

## Bu dosya ne yapar?

Öğretmen derse girer, "Yoklama" ekranında sınıf listesini görür ve her öğrenci için Geldi / Gelmedi / Geç geldi /
İzinli seçip kaydeder. Bu dosya o ekranın sunucusudur. Öğrenci kendi devamsızlığını, veli çocuğununkini, yetkili personel
okulun özetini buradan görür. Bir öğrenci derse gelmediğinde ya da geç kaldığında öğrenciye ve onaylı velilerine
bildirim gider ("Çocuğunuz Ayşe Yılmaz bugün saat 09:20 Matematik dersine gelmedi (izinsiz).").

Tablonun büyümemesi için "Geldi" kaydı TUTULMAZ: yalnız devamsızlıklar saklanır; kaydı olmayan öğrenci derse gelmiş
sayılır. Okulun "Devamsızlık" bölümü kapalıysa istek buraya hiç gelmez (`api.js` → [ozellikler.md](ozellikler.md),
`devamsizlik → devamsizlik`); geçmiş eğitim yılına bakan personelin yoklama yazması arşiv kapısında 409 alır
([api.md](../api.md)).

## İçinde neler var?

### Sabitler ve dışa açılan yardımcılar

- `DEVAM_DURUMLAR` — `['var', 'yok', 'gec', 'izinli']`.
- `DEVAM_AD` — ekrandaki adlar: `var` "Geldi", `yok` "Gelmedi", `gec` "Geç geldi", `izinli` "İzinli".
- `gunBicimi(metin)` — `YYYY-AA-GG` biçimindeyse metni, değilse `''` döner (takvim de kullanır).
- `bugun()` — sunucunun yerel saatine göre bugünün `YYYY-AA-GG`'si (takvim de kullanır).
- `yoklamaYetkisi(u, l)` — `u` kişisi `l` dersine yoklama alabilir mi. Önce `devamsizlik.al` yetkisi o ders ve sınıf
  kapsamında olmalı. Öğretmen değilse (müdür) bu yeter. Öğretmende ek şart: ders kendisinin (`l.teacherId === u.id`) ya da
  ek bir rolde bu ders/sınıf için AÇIK kapsam verilmiş (`yetkiKapsami` + `kapsamUyar`).
- `devamsizlikOzeti(ogrenciId, gunSayisi, bakan, ogrenci)` → `{ sayim: { yok, gec, izinli }, toplam, kayitlar: [{ id,
  tarih, durum, durumAd, ders, not, alan }] }`. Kayıtlar yeniden eskiye, en çok 200 satır (sayım hepsinden). `gunSayisi`
  verilirse son o kadar gün; `bakan` verilirse `bakisKisisi` + `yilSuz` ile bakılan eğitim yılına süzülür (veli çocuğun
  gözünden, yani çocuğun okulu ve geçmiş okulları; bkz. [egitim-yili.md](egitim-yili.md)). `alan` yoklamayı alanın adı.
- `uclar(k)` — aşağıdaki uçlar.

### İç işlevler

- `acikSinifKapsami(u, sinifId)` — ek rolde `devamsizlik.al` bu sınıf için açıkça kapsamlanmış mı.
- `yoklamaMetni(ogrenci, l, tarih, saat, durum)` → `{ ogrenci, metin, veliMetni }`. Öğrenciye: "Bugün 09:20 Matematik
  dersi: Gelmedi" (bugün değilse `GG.AA.YYYY`). Veliye (`VELI_DURUM`): "Çocuğunuz <ad> bugün saat 09:20 Matematik dersine
  gelmedi (izinsiz|izinli) / geç geldi."
- `devamsizlikBildir(liste)` — öğrenciye (`#/devamsizligim`) ve onaylı velilerine (`#/cocuklarim`) kendi metinleriyle
  bildirim; veliler tek sorguda (`veliHaritasi`), yazım tek sorguda (`depo.genel.cokluBildir(…, { veliye: false })` —
  genel veli kopyası kapatılır, veli metni burada yazıldı).
- `veliBakabilir(me, st)` — öğrenci değilse ve `st`'ye veli bağıyla bağlıysa (rolü ne olursa olsun: öğretmen de kendi
  çocuğunun velisidir).

### Uçlar

Hepsi `p === 'devamsizlik'`; önce `need()` (401/403), sonra `okulGerek` (okulsuz hesap 403). Hatalarda `bad` varsayılanı
400'dür.

- **`GET /api/devamsizlik/derslerim`** — yoklama alınabilecek dersler. `devamsizlik.al` yoksa 403 "Yoklama yetkin yok"
  (kod yorumu: öğrenci ve veliye boş liste dönmek denetimde yanlış izlenim veriyordu). Cevap `{ dersler: [{ id, ders,
  sinif, classId, ogrenciSayisi }] }` — okulun dersleri `yoklamaYetkisi`'nden geçenler, sınıf adı ve derse göre Türkçe
  sıralı (depo sıralar).
- **`GET /api/devamsizlik/yoklama?lessonId=&tarih=`** — yoklama ekranı. Ders yoksa ya da başka okulunsa 400 "Ders
  bulunamadı"; yetki yoksa 403 "Bu ders için yoklama yetkin yok". `tarih` bozuk/boşsa bugün. Cevap `{ ders: { id, ad,
  sinif }, tarih, durumlar: [{ k, ad }], ogrenciler: [{ id, ad, durum, not }] }` — sınıfın öğrencileri, kaydı olmayan
  `var`.
- **`POST /api/devamsizlik/yoklama`** — gövde `{ lessonId, tarih?, saat?, girisler: [{ ogrenciId, durum, not? }] }`.
  Ders/yetki denetimi yukarıdaki gibi; ileri tarih 400 "İleri tarihe yoklama alınamaz"; `girisler` boşsa 400 "Yoklama
  boş". Sınıfta olmayan öğrenci, ikinci kez gelen öğrenci ve geçersiz durum sessizce atlanır; `var` yazılmaz; `not`
  200 harf. O dersin o günkü BÜTÜN eski kayıtları silinip yenileri yazılır (tek işlem, `dersGunuYaz`). Kayıt yıl
  damgası alır (`yilDamgasi`). Bildirim yalnız durumu önceki kayda göre DEĞİŞEN öğrenciye ve velisine gider. `saat`
  (ör. programdan gelen "09:20") yalnız bildirim metnine girer. Cevap `{ yazilan, message }` ("3 devamsızlık
  kaydedildi." ya da "Yoklama kaydedildi — herkes derste.").
- **`GET /api/devamsizlik/benim?gun=`** — öğrencinin kendi dökümü (`devamsizlikOzeti`); öğrenci değilse 403 "Bu ekran
  öğrenciler için".
- **`GET /api/devamsizlik/ogrenci?studentId=&gun=`** — bir öğrencinin dökümü + `ogrenci: { id, ad }`. Öğrenci yoksa 400
  "Öğrenci bulunamadı". Kim görür: veli bağı olan (öğrenci hariç); ya da veli olmayan ve AYNI okuldaki kişi şu üçünden
  biriyle: `devamsizlik.gor`, `devamsizlik.al` + o sınıf için açık kapsam, öğrencinin derslerine giren öğretmen. Değilse
  403 "Bu öğrencinin devamsızlığını görme yetkin yok".
- **`GET /api/devamsizlik/gun?studentId=&tarih=`** — "şu öğrenci, şu gün": sınıfın o günkü programındaki her ders saati
  ve durumu: `{ ogrenci: { id, ad, classId }, tarih, gunAdi, durumlar, dersler: [{ sira, lessonId, ders, ogretmen, bas,
  bit, durum, not, duzenlenebilir }] }`. Öğrencinin kendisi, velisi, `devamsizlik.gor` sahibi ya da öğrencinin
  öğretmeni görür (değilse 403 "Bu öğrencinin kaydını görme yetkin yok"). `duzenlenebilir` = o ders için
  `yoklamaYetkisi`. Sınıfı yoksa `dersler` boş.
- **`POST /api/devamsizlik/isaretle`** — tek öğrencinin tek dersini değiştirir. Gövde `{ studentId, lessonId, tarih,
  durum, not?, saat? }`. Öğrenci yoksa 400; ders yoksa/başka okulunsa 400; yetki yoksa 403 "Bu ders için yetkin yok";
  `tarih` zorunlu (400 "Tarih gerekli"), ileri tarih 400; geçersiz durum 400 "Geçersiz durum". Öğrenci başka okuldaysa
  ya da dersin sınıfında değilse (ve o derste eski kaydı da yoksa) 404 "Öğrenci bu dersin sınıfında değil". Eski kayıt
  silinir, `var` değilse yenisi yazılır (tek işlem). Durum değiştiyse ve yeni durum `var` değilse bildirim gider.
  Cevap `{ durum, message: 'Kaydedildi.' }`.
- **`GET /api/devamsizlik/ozet?gun=30`** — okul geneli özet; `devamsizlik.gor` yoksa 403 "Okul geneli devamsızlığı görme
  yetkin yok". Son `gun` günün (varsayılan 30) kayıtları, bakılan yıla süzülür; öğrenci başına `{ id, ad, sinif, yok,
  gec, izinli, toplam }`, en çok "gelmedi"den aza sıralı, ilk 300 satır. Cevap `{ gun, toplamKayit, ogrenciSayisi,
  satirlar }`. Okuldan ayrılmış öğrencinin kaydı satırlara girmez ama `toplamKayit`'a sayılır.

## Kimle konuşur?

- Çağırdıkları:
  - `../http` → `bad`, `ok`;
  - `../iliskiler` → `GUN_ADLARI`, `saatDuzelt`, `sinifOgrencileri`, `teachersOfStudent`;
  - `../ortak` → `clean`, `now`, `uid` (kayıt kimliği `dv` önekli);
  - `../veri` → `depo`;
  - `../yetki` → `kapsamUyar`, `okulGerek`, `yetkiKapsami`, `yetkiVarMi`;
  - `./egitim-yili` → `yilDamgasi`, `yilSuz`, `bakisKisisi` ([egitim-yili.md](egitim-yili.md)).
- Depo ve tablolar:
  - `depo.devamsizlik` (`sunucu/veri/depo/devamsizlik.js`) → `devamsizlik` tablosu (+ ders adı için `dersler`, alanın adı
    için `kullanicilar`): `dersGunu`, `dersGunuYaz`, `ogrencinin`, `ogrenciGunu`, `ogrenciDersGunuYaz`,
    `okulunSonKayitlari`;
  - `depo.siniflar` → `dersler`, `siniflar`, `ders_programi`: `okulunDersleri`, `ozetleri`, `dersBul`,
    `sinifinProgrami`, `okulun`;
  - `depo.kullanicilar` → `bul`, `okulun`, `bagliMi`, `veliHaritasi` (`kullanicilar`, `veli_baglari`);
  - `depo.genel.cokluBildir` → `bildirimler`.
- Onu çağıranlar: `sunucu/api.js` (`BOLUM.devamsizlik`); [takvim.md](takvim.md) (`bugun`, `gunBicimi`).
- Ön yüz: `public/js/parcalar/18-devamsizlik.js` (bütün ekranlar), `22-programim.js` (programdaki dersten yoklamaya),
  `25-tiklama.js` (yoklama kaydı), `27-veli-panel.js` (velinin çocuk dökümü).
- Android uygulaması bu uçları çağırmıyor (grep).

## Nasıl çalışır (adım adım)?

```
Öğretmen "Yoklama":
  GET  derslerim          -> yetkili dersler
  GET  yoklama?lessonId   -> sınıf listesi + o günün kayıtları (kaydı yok = Geldi)
  POST yoklama {girisler} -> onceki = o ders+gün kayıtları
                             her giriş: sınıfta mı? tekrar mı? durum geçerli mi? var mı?
                             DELETE ders+gün ; INSERT yeni devamsızlıklar   (tek işlem)
                             durumu değişenlere bildirim (öğrenci + veliler)

Tek hücre düzeltme (öğrencinin günü ekranı):
  GET  gun?studentId&tarih -> programdaki dersler + durum + düzenlenebilir mi
  POST isaretle            -> DELETE öğrenci+ders+gün ; var değilse INSERT ; değiştiyse bildirim
```

## Dikkat!

- **Öğretmende kapsamsız yetki tek başına yetmez.** Hazır Öğretmen rolünde `devamsizlik.al` kapsamsız açık gelir; kod
  yorumu: tek başına bırakılırsa herhangi bir öğretmen hiç girmediği derste öğrenciyi devamsız yazabilirdi. Bu yüzden
  öğretmen yalnız kendi dersine ya da müdürün açıkça kapsam verdiği ders/sınıfa yoklama alır; dökümde de aynı kural
  (`acikSinifKapsami`).
- **Kayıt anahtarı ders + gün.** Dosya başındaki yorum "ders saati bazında" diyor, ama kayıtlar `ders_id + tarih` ile
  yazılıp silinir: aynı dersin aynı gündeki iki saati (blok ders) ayrı tutulmaz; `gun` ucunda iki saat aynı durumu
  gösterir. `saat` yalnız bildirim metnine girer.
- **`POST yoklama` o gün o dersin bütün kayıtlarını yeniden yazar.** `girisler`'de olmayan öğrencinin (ya da sınıftan
  ayrılmış öğrencinin) o günkü kaydı da silinir. Ön yüzün iki yoklama penceresi (`25-tiklama.js`, `22-programim.js`)
  ekrandaki listenin durumlarını birlikte gönderir; başka bir istemci yazarsan bunu bil. Tek öğrenci için `isaretle`'yi
  kullan.
- Aynı yoklama yeniden kaydedilince bildirim tekrar gitmez (`onceki` karşılaştırması); "Gelmedi"den "Geldi"ye dönüşte
  de bildirim gitmez.
- `bugun()` sunucunun yerel saatini kullanır; sunucu Türkiye saatinde değilse gece yarısına yakın "ileri tarih" kararı
  kayar.
- `ogrenci` ucunda kimlik denetimi `st.role === 'student'` ile yapılır; başka okulun öğrencisini yalnız velisi görebilir.
- `ozet` en çok 300 satır döner; `gun` sayısal değilse 30 olur.

## Testleri

- `testler/test-devamsizlik.js` — 10 bölüm: öğretmenin dersleri, yoklama ekranı, kayıt, öğrencinin kendi dökümü, velinin
  görmesi, öğrencinin başkasınınkini görememesi, üzerine yazma, ileri tarih, okul özeti, yetkisiz yoklama.
- `testler/test-bildirim.js` — devamsızlık bildirimi gidiyor; aynı yoklama yeniden kaydedilince bildirim yok; veliye
  bir kez "Çocuğunuz … gelmedi", ikinci kopya yok.
- `testler/test-egitim-yili.js` — eski yılda girilen devamsızlık yeni yılın özetinde görünmez.
- `testler/test-nakil.js` — nakil sonrası öğrencinin ve yeni okulun gördüğü döküm.
- `testler/test-ozellikler.js` — bölüm kapanınca veli de göremez (`ozellikKapali`).
- `testler/test-veli-coklu.js`, `test-siniflarim.js`, `test-servis-konum.js` (servisçi `derslerim`'e giremez),
  `yetki-denetimi.js`, `girdi-denetimi.js`.
- Elle: `testler/seed.js`'teki öğretmenle giriş yap, `GET /api/devamsizlik/derslerim`'den bir ders al,
  `POST /api/devamsizlik/yoklama` ile bir öğrenciyi `yok` yaz; öğrenci hesabının bildirimlerinde görünmeli.

## Son durum

- Son commit `8207ee3 commit 323` (2026-09-26): `devamsizlikBildir` işlevi eklendi (öğrenciye ve velilere tek sorguda,
  veliye kendi metniyle; genel veli kopyası kapalı). Ondan önceki hâlde işlev çağrılıyordu ama dosyada tanımlı değildi.
- `de781cf commit 38` (2026-08-28): `module.exports` eklendi (aynı commit ön yüzün `18-devamsizlik.js`'ini getirdi);
  `e4fe108 commit 37` dosyanın ilk hâli.
- Açık iş yok. Sıradaki işlerden "Optimizasyon + saklama süreleri" (öğrenci/veli yalnız son 1 geçmiş yıl) bu dosyanın
  dökümlerini etkileyebilir; "Yıl geçişi" işi yıl süzgecine dokunur.
