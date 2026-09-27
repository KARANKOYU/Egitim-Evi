# sunucu/sifre.js

Şifreleri scrypt ile özetler ve doğrular; toplu özetlemeyi iki kanala sıraya sokar.

## Bu dosya ne yapar?

Eğitim Evi hiçbir şifreyi düz metin saklamaz. Kayıtta, şifre değişiminde, okulun açtığı hesaplarda, Excel'le toplu
hesap açmada ve yönetici dosyasından hesap açmada şifre buradan geçip `tuz:özet` biçimine döner; girişte de yazılan
şifre aynı yoldan geçip saklanan özetle karşılaştırılır. scrypt bilerek yavaş ve belleği çok kullanan bir algoritma:
veritabanı çalınsa bile şifreleri tek tek denemek pahalı olsun diye.

## İçinde neler var?

- `SCRYPT_AYAR` — `{ N: 16384, r: 8, p: 1, maxmem: 72 MB }`. Özet uzunluğu 64 bayt.
- `scryptAsync(pw, salt)` → `Promise<Buffer>` — Node'un `crypto.scrypt`'inin söz (Promise) hâli.
- `hashPwSync(pw, salt?)` → `'tuz:özet'` (tuz verilmezse 16 rastgele bayt, onaltılık). Eşzamanlı; olay döngüsünü
  kilitler. Bugün sunucu kodunda çağıran yok (grep); eski yerlerden kalma, dışa açık duruyor.
- `hashPw(pw, salt?)` → `Promise<'tuz:özet'>` — asıl kullanılan, eşzamansız.
- `hashPwToplu(sifreler)` → `Promise<string[]>` — dizideki her şifreyi özetler, sırayı korur; ama aynı anda en çok
  `TOPLU_KANAL = 2` özet hesaplanır (bütün toplu işler bu iki kanalı paylaşır).
- `verifyPw(pw, stored)` → `Promise<boolean>` — `stored` `':'` içermiyorsa ya da özet kısmı boş/bozuksa `false`;
  değilse aynı tuzla hesaplar ve `crypto.timingSafeEqual` ile karşılaştırır (uzunluklar eşit değilse `false`).
- İç: `topluKanalAl()` / `topluKanalBirak()` — basit bir sıra (semafor).

## Kimle konuşur?

- Çağırdığı: yalnız Node `crypto`.
- Onu çağıranlar (grep):
  - `hashPw` / `verifyPw`: `sunucu/bolumler/kayit.js` (kayıt, giriş, şifre değiştirme/sıfırlama),
    `bolumler/kisilik.js`, `bolumler/hesaplar.js` (okulun açtığı hesap), `bolumler/okul.js`,
    `sunucu/veri/index.js` (ilk yönetici), `sunucu/yonetici-dosyasi.js` (admins.json'dan açılan yönetici);
  - `hashPwToplu`: `bolumler/kisi-aktarim.js` (Excel'le toplu hesap), `bolumler/okul.js` (toplu giriş bilgisi);
  - testler: `test-admin-gizli.js`, `test-cakisma.js`, `test-okul-agi.js` (şifreyi eski hâline döndürmek için
    `hashPw`); araç `yuk-testi.js`.
- Veri tablosuna kendisi yazmaz; özet `kullanicilar` tablosunun şifre alanına onu çağıran depo koduyla yazılır.

## Nasıl çalışır (adım adım)?

Özetleme: `tuz = 16 rastgele bayt (hex)` → `scrypt(şifre, tuz, 64, SCRYPT_AYAR)` → `tuz + ':' + özet(hex)`.

Doğrulama: `stored.split(':')` → `[tuz, özet]` → aynı tuzla yeniden hesapla → sabit sürede karşılaştır.

Toplu özetleme:

```
hashPwToplu([s1..s300])
  her şifre için: kanal al (2 doluysa sıraya gir) → hashPw → kanalı bırak (sıradakini uyandır)
```

## Dikkat!

- Neden toplu kanal? Excel'le yüzlerce hesap açılırken bütün özetler aynı anda başlatılsaydı libuv'nin dört iş
  parçacığı saniyelerce dolar; o sırada gelen girişler (onlar da scrypt kullanır) ve dosya işleri beklerdi. İki
  kanal, iki iş parçacığını her zaman başkalarına bırakır.
- Parametreleri (`SCRYPT_AYAR`) değiştirmeden önce düşün: saklanan metinde tuz var ama N/r/p yok; parametre
  değişirse bütün eski özetler artık doğrulanmaz, herkes şifresiz kalır. Değişecekse özet biçimine parametre
  eklemek ve eskileri eski ayarla doğrulamak gerekir.
- `timingSafeEqual` uzunluk eşit değilse hata atar; o yüzden önce uzunluk karşılaştırılıyor.
- Şifre kuralları (en az 8 karakter vb.) burada DEĞİL; onlar bölümlerde ve `ortak.js`'te.

## Testleri

- Doğrudan birim testi yok; her giriş yapan test paketi (`testler/giris.js` üzerinden hepsi) `verifyPw`'u, kayıt ve
  hesap açan paketler `hashPw`'u kullanır. `test-sifre.js` (şifremi unuttum), `test-aktarim.js` (Excel'le toplu
  hesap) ve `test-giris-bilgisi.js` (toplu giriş bilgisi), `test-okul-agi.js` (300 kişilik giriş yükü) özellikle bu yolları zorlar.
- `guvenlik-test.js` API cevaplarında `scryptAsync` gibi iç adların sızmadığını denetler.
- Elle: `node -e "require('./sunucu/sifre').hashPw('Deneme123!').then(console.log)"`.

## Son durum

- İki commit: `396113b commit 14` (ilk hâl) ve `89eb5fa commit 77` (2026-08-29). Son değişiklik toplu özetleme
  kanalını (`hashPwToplu`, iki kanallı sıra) ekledi.
- Açık iş yok. Güvenlik denetimi işinde (sıradaki işler listesinde 3.) "okulun verdiği her şifrede ilk girişte
  değiştirme" konusu var; o iş bu dosyayı değil bölümleri etkiler.
