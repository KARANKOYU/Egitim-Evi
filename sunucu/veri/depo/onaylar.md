# sunucu/veri/depo/onaylar.js

Bekleyen e-posta onay bağlantılarının (`eposta_onaylari`) SQL'i: kayıt ya da e-posta değişikliği için bekleyen satırı
yazma, anahtar özetiyle bulma, tek kullanımlık silme, aynı adresin ya da hesabın eski bağlantılarını düşürme ve süresi
geçenleri temizleme.

## Bu dosya ne yapar?

Bir hesap, e-postadaki bağlantıya tıklanmadan AÇILMAZ: kimse sahibi olmadığı bir adresle (başkasının ya da bir şirketin
adresiyle) hesap açamasın diye. Kayıt formu doldurulunca bilgiler bu tabloda bekler (şifre özetlenmiş hâlde), adrese
tek kullanımlık bir bağlantı gider; tıklanınca hesap açılır ve satır silinir. Yetişkin hesabında e-posta değiştirmek de
aynı yoldan geçer: yeni adrese giden bağlantı tıklanınca adres değişir. Bağlantıdaki anahtarın kendisi değil SHA-256
özeti saklanır; bağlantı 24 saat geçerlidir (şema 016).

Karıştırma: buradaki "onay" e-posta adresinin sahipliğinin onayıdır. Okul açma, müdür atama ya da kişinin okula
eklenmesi gibi onaylarla ilgisi yoktur (onlar [kullanicilar.md](kullanicilar.md) ve [okullar.md](okullar.md)
tarafındadır).

Bağlantının üretilmesi, postanın gönderilmesi ve tıklanınca hesabın açılması [../../bolumler/kayit.md](../../bolumler/kayit.md)'de,
e-posta değiştirme [../../bolumler/kisilik.md](../../bolumler/kisilik.md)'dedir.

## İçinde neler var?

Satırlar ham döner ([../esleme.md](../esleme.md) kullanılmaz): `anahtar_ozeti, tur ('kayit' | 'eposta'), eposta,
kullanici_id, kullanici_adi, ad_soyad, sifre_ozeti, telefon, tc_kimlik, adres, kvkk_surum, olusturma, bitis`.

- `suresiGecenleriSil()` — `DELETE FROM eposta_onaylari WHERE bitis < now()`; silinen sayıyı döner.
- `ekle(o)` — önce `suresiGecenleriSil()`, sonra `INSERT INTO eposta_onaylari (anahtar_ozeti, tur, eposta, kullanici_id,
  kullanici_adi, ad_soyad, sifre_ozeti, telefon, tc_kimlik, adres, kvkk_surum, bitis)`. `o = { ozet, tur, eposta,
  kullaniciId, kullaniciAdi, adSoyad, sifreOzeti, telefon, tc, adres, kvkkSurum, bitis }`; boş kimlik/ad/özet/T.C./sürüm
  `NULL`, boş telefon/adres `''`. Şema: `kayit` satırında kullanıcı adı, ad soyad, şifre özeti ve KVKK sürümü; `eposta`
  satırında hesap kimliği ZORUNLU (CHECK → `23514`); adres 3–254 karakter.
- `bul(ozet)` — süresi GEÇMEMİŞ satır (`anahtar_ozeti = $1 AND bitis > now()`) ya da `null`.
- `sil(ozet)` — satırı siler; silinen satır sayısını döner. Bağlantının tek kullanımlık olmasını bu sağlar: aynı
  bağlantıya aynı anda iki kez tıklanırsa yalnız biri `1` alır.
- `adresinkileriSil(eposta, tur)` — aynı adres ve türdeki bekleyen bütün bağlantıları siler ("son gönderilen geçerli";
  hesap açılınca da artık bekleyen kalmasın).
- `hesabinkileriSil(kullaniciId)` — hesabın bekleyen e-posta DEĞİŞİKLİĞİ bağlantılarını siler (yalnız `tur = 'eposta'`).

### Tablolar ve şema

| Tablo / indeks | Şema dosyası |
|---|---|
| `eposta_onaylari` (`anahtar_ozeti` birincil anahtar, `tur` kayit/eposta, `eposta` 3–254, `kullanici_id` `ON DELETE CASCADE`, bekleyen kayıt bilgileri, `kvkk_surum`, `olusturma`, `bitis`; türe göre zorunlu alanlar CHECK'i; `eposta_onaylari_eposta` ve `eposta_onaylari_bitis` indeksleri) | `016-eposta-onayi.sql` |

## Kimle konuşur?

- Çağırdıkları: [../baglanti.md](../baglanti.md) (`tek`, `calistir`).
- Çağıranlar ([../index.md](../index.md)'deki `depo.onaylar`):
  - [../../bolumler/kayit.md](../../bolumler/kayit.md) — kayıtta: `adresinkileriSil(email, 'kayit')`, bağlantıyı gönder,
    `ekle({ tur: 'kayit', …, bitis: şimdi + 24 saat })`; bağlantı tıklanınca (`epostaOnayi`): `bul(özet)`, `sil(özet)`
    (0 dönerse "geçersiz"), hesap açılınca `adresinkileriSil(o.eposta, 'kayit')`.
  - [../../bolumler/kisilik.md](../../bolumler/kisilik.md) — yetişkin e-postasını değiştirirken `hesabinkileriSil(ana.id)`
    + `ekle({ tur: 'eposta', eposta: yeni, kullaniciId })`.
  - [../../guvenlik.md](../../guvenlik.md) — `guvenlikTemizle` (10 dakikada bir) içinde `suresiGecenleriSil()`.
- Tablo: `eposta_onaylari`.

## Nasıl çalışır (adım adım)?

```
Kayıt formu → bölüm: denetimler, KVKK onayı, adrese saatte en çok 3 posta
  adresinkileriSil(adres, 'kayit')                  (eski bağlantılar düşer)
  anahtar = 32 rastgele bayt → posta gider
  ekle({ ozet: sha256(anahtar), tur: 'kayit', bilgiler, şifre özeti, bitis: +24 saat })   (önce süresi geçenler silinir)

Bağlantı tıklandı → epostaOnayi
  bul(sha256(anahtar))  yoksa/süresi geçtiyse → "geçersiz" (hatalı denemeler sayılır)
  sil(özet)             0 dönerse (öteki tıklama önce sildi) → "geçersiz"
  adres/kullanıcı adı/T.C. bu arada alındı mı? → alanlı hata
  tur 'eposta' → hesabın e-postasını değiştir
  tur 'kayit'  → hesabı aç (kişi kodu ile) → adresinkileriSil(adres, 'kayit')
```

## Dikkat!

- **Bekleyen satır kişisel veri taşır:** ad soyad, e-posta, telefon, adres, T.C. kimlik no ve şifre özeti 24 saate kadar
  bu tabloda bekler. Süre dolunca `guvenlikTemizle` (10 dakikada bir) ve her yeni `ekle` siler; bağlantı tıklanınca satır
  hemen silinir. KVKK denetiminde bu tablo da yazılmalı (Son durum).
- **Tek kullanımlık, yarışa dayanıklı:** `bul` ile `sil` ayrı sorgulardır ama asıl karar `sil`'in dönüşüdür: aynı
  bağlantıya aynı anda üç tıklama gelse de yalnız satırı silen devam eder. Aynı kullanıcı adıyla ya da T.C. ile bekleyen
  iki farklı kayıt aynı anda onaylanırsa kullanıcılar tablosunun tekil indeksleri birini durdurur (bölüm alanlı ileti
  verir).
- **Süre veritabanı saatiyle:** `bitis` uygulamada `şimdi + 24 saat` olarak hesaplanıp yazılır, geçerlilik ise `now()`
  ile karşılaştırılır.
- **Anahtar düz saklanmaz:** veritabanı sızsa bile bağlantılar kullanılamaz (yalnız özet var).
- **`hesabinkileriSil` yalnız e-posta değişikliği satırlarını siler;** kayıt satırlarında `kullanici_id` zaten boştur.
  Hesap silinirse bekleyen değişiklik satırı CASCADE ile gider.
- **Güvenlik:** bütün değerler parametreyle. Aynı adrese saatte en çok 3 posta, hatalı onay denemesi sınırı bölümdedir.

## Testleri

- `testler/test-giris-kayit.js` — kaydın e-posta onayı beklemesi (hesap henüz yok, onaysız giriş olmaz), uydurma anahtarın
  geçmemesi, tıklanınca hesabın açılması, bağlantının ikinci kez kullanılamaması, e-posta değişikliğinin onaylanana kadar
  olmaması ve tıklanınca değişmesi.
- `testler/test-cakisma.js` — aynı anda onaylarda tekillik (aynı kullanıcı adı, aynı T.C., aynı bağlantıya üç tıklama →
  tek hesap, iki kişinin aynı yeni adrese bağlantısı → adres birinde).
- `testler/test-sifre.js`, `testler/guvenlik-test.js`, `testler/yetki-denetimi.js` ve öbür paketler kendi hesaplarını
  kayıt + onay yoluyla açar (dolaylı).
- Elle: e-posta ayarlanmamışsa, adres deneme adresiyse ya da gönderim hata verirse posta gitmez, bağlantı sunucu
  konsoluna yazılır
  ([../../guvenlik.md](../../guvenlik.md) `onayKonsolaYaz`). Test sunucusunda kayıt ol → konsoldaki bağlantıyı aç → hesap
  açılmalı; aynı bağlantıyı yeniden aç → "Bağlantı geçersiz ya da süresi dolmuş".

## Son durum

- Son değişiklik `3f22fbe commit 382` (2026-09-26): `bul`, `sil`, `adresinkileriSil`, `hesabinkileriSil` eklendi
  (dosyanın ikinci yarısı). İlk hâli `c3343cb commit 381` (aynı gün): `suresiGecenleriSil` ve `ekle`. Toplam 2 commit.
- Bilinen açıklar (kod değiştirilmedi): bekleyen satırlarda T.C. no, telefon ve adresin 24 saate kadar düz metin
  durması (gerekli ama KVKK metninde anılmalı).
- Sıradaki planlı işler (DEVAM.md 4. bölüm): **"Kullanıcı arama … hesap penceresinde yöneticinin VE DESTEĞİN … e-posta
  (güvenceli) … değiştirmesi"** bu tabloyu yeni bir akışla kullanabilir; **"Tek kişi tek hesap"** (e-posta TEK kalır)
  kayıt adımlarını değiştirebilir; **"KVKK ve onay metinleri TAM denetimi"** bu tablodaki bekleyen kişisel verileri
  aydınlatma metniyle karşılaştıracak; "Sistem" işindeki "e-posta sağlığı + sayaç" gönderim tarafına dokunur.
