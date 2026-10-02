# araclar/eposta-ayarla.js

Sunucunun giriş kodlarını, e-posta onay ve şifre sıfırlama bağlantılarını göndereceği SMTP hesabını soru-cevapla kuran komut
satırı sihirbazı (`npm run eposta-ayarla`); istersen önce deneme postası gönderir, sonucu `data/ayarlar.json`'un `eposta`
bölümüne yazar.

## Bu dosya ne yapar?

E-posta ayarlı değilken sunucu kimseyi dışarıda bırakmaz: iki adımlı giriş kodunu, kayıttaki onay bağlantısını ve şifre
sıfırlama bağlantısını kendi penceresine (siyah ekran) yazar. Denerken bu yeter; ama gerçek kullanımda okulun müdürü ya da
velisi o pencereyi göremez, kodun e-postayla gitmesi gerekir. Bunun için sunucuya bir SMTP hesabı (Gmail, GMX, Brevo…)
tanıtılır.

JSON dosyasını elle doldurmak hataya açıktır: hangi sağlayıcı hangi sunucu adını ve portu kullanır, 465'te `guvenli` neden
`true` olmalı, Gmail neden normal şifreyi kabul etmez… Bu araç sırayla sorar:

1. Sağlayıcını listeden seç (sunucu, port ve güvenli bağlantı kendiliğinden dolar) ya da elle gir.
2. Kullanıcı adını ve şifreni yaz (şifre ekranda yıldızla görünür), gönderen adresi ve görünen adı onayla.
3. İstersen bir deneme postası gönder; gitmezse sık nedenleri sayar ve "yine de kaydedeyim mi?" diye sorar.
4. Ayarı `data/ayarlar.json`'a yazar, öteki bölümlere dokunmaz; sunucuyu yeniden başlatmanı söyler.

Kim kullanır: siteyi kuran kişi (kendi bilgisayarında ya da sunucuda). [belge/KILAVUZ.md](../belge/KILAVUZ.md) "E-posta
ayarlama (kolay yol)" bölümü bu aracı anlatır; aynı yerdeki "elle" yolu dosyayı doğrudan düzenlemektir.
[belge/SUNUCUYA-KURULUM.md](../belge/SUNUCUYA-KURULUM.md) ise sunucuda elle düzenlemeyi (`nano`) gösterir. Aracın kendi
ekran yazıları Türkçe karaktersizdir (ASCII), sunucunun konsola yazdığı kod blokları gibi; kodda nedeni yazmıyor. Sağlayıcı
notları ve hata iletileri ise Türkçe karakterli gelebilir (başka dosyadan).

## İçinde neler var?

### Sabitler

- `KOK` — proje kökü (`araclar/`'ın bir üstü).
- `DATA` — `KOK/data`. Dikkat: sunucunun kullandığı `sunucu/yollar.js`'teki `DATA` değil; `EE_DATA` ortam değişkenine
  bakmaz.
- `AYAR_DOSYA` — `data/ayarlar.json`.
- `rl` — `stdin`/`stdout` üzerinde tek bir `readline` arayüzü; bütün sorular bunu kullanır, iş bitince ya da iptal edilince
  kapanır.

### Yardımcılar

- `sor(soru, varsayilan)` — `"  Soru [varsayılan]: "` yazar; cevabın baş/son boşluğunu atar; boşsa varsayılanı (o da yoksa
  `''`) döner.
- `sifreSor(soru)` — şifre sorusu. `rl._writeToOutput`'u (Node'un `readline` iç işlevi) geçici olarak değiştirir: soruyu ve
  satır sonunu olduğu gibi yazar, öteki her yazışın yerine `*` basar. Cevap gelince eski işlevi geri koyar. Dönen: boşlukları
  atılmış şifre. (Silme tuşu sorunu "Dikkat!"te.)
- `baslik(metin)` — boş satır, girintili başlık ve altında aynı uzunlukta çizgi.
- `calistir()` — sihirbazın kendisi (aşağıda). Dosya yüklenince çağrılır; beklenmeyen hata olursa "Beklenmeyen hata: …"
  yazar, `rl`'yi kapatır, 1 koduyla çıkar.

Dışa açılan bir şey yok.

### Sağlayıcı listesi

Liste bu dosyada değil, [../sunucu/yardimci/eposta.md](../sunucu/yardimci/eposta.md)'deki `SAGLAYICILAR`'dadır; araç onu
numaralayıp gösterir, sona "Elle gir"i ekler:

| No | Sağlayıcı | Sunucu:port | Güvenli (TLS baştan) | Seçince yazılan not |
|---|---|---|---|---|
| 1 | GMX | `mail.gmx.com:587` | hayır (STARTTLS) | POP3/IMAP erişimini açman gerekir |
| 2 | Gmail | `smtp.gmail.com:465` | evet | 2 Adımlı Doğrulama + Uygulama Şifresi |
| 3 | Yandex | `smtp.yandex.com:465` | evet | uygulama şifresi gerekir |
| 4 | Zoho | `smtp.zoho.com:465` | evet | uygulama şifresi gerekir |
| 5 | Brevo | `smtp-relay.brevo.com:587` | hayır (STARTTLS) | kullanıcı adı SMTP kullanıcısı, şifre SMTP anahtarı |
| 6 | Mailjet | `in-v3.mailjet.com:587` | hayır (STARTTLS) | kullanıcı = API Key, şifre = Secret Key |
| 7 | SMTP2GO | `mail.smtp2go.com:587` | hayır (STARTTLS) | panelden SMTP kullanıcısı oluştur |
| 8 | Elle gir | sorulur (varsayılan `mail.gmx.com`, `587`) | port 465 ise evet | — |

`guvenli: false` düz metin demek değildir: bağlantı açılınca `STARTTLS` ile şifrelenir; `true` ise TLS baştan kurulur.
Varsayılan seçim 1'dir. Listede olmayan ya da sayı olmayan bir cevap (ör. `x`) "Elle gir" sayılır.

### Yazılan ayar

```json
"eposta": {
  "etkin": true,
  "sunucu": "smtp.gmail.com",
  "port": 465,
  "guvenli": true,
  "kullanici": "<SMTP kullanıcı adı>",
  "sifre": "<şifre ya da uygulama şifresi>",
  "gonderen": "<gönderen adres; varsayılan kullanıcı adı>",
  "gorunenAd": "<görünen ad; varsayılan Egitim Evi>"
}
```

Alanlar [../sunucu/ayarlar.md](../sunucu/ayarlar.md)'deki `VARSAYILAN_AYAR.eposta` ile birebir aynıdır. Dosyada `_aciklama`
yoksa "E-posta ayarlari. Degistirmek icin: node araclar/eposta-ayarla.js" eklenir (sunucunun ilk açılışta yazdığı dosyada
zaten bir `_aciklama` vardır; o korunur).

## Kimle konuşur?

- **Çağırdıkları:** Node'un `fs`, `path`, `readline`'ı; [../sunucu/yardimci/eposta.md](../sunucu/yardimci/eposta.md) →
  `SAGLAYICILAR` (liste) ve `gonder(ayar, alici, konu, govde)` (deneme postası; kendi SMTP istemcisi, dış paket yok).
- **Yazdığı dosya:** `data/ayarlar.json`. Aynı dosyayı sunucu açılırken [../sunucu/ayarlar.md](../sunucu/ayarlar.md)'deki
  `ayarlariYukle` okur (`eposta`, `vekil`, `site` bölümlerini varsayılanla birleştirir); `araclar/veritabani-kur.js` de aynı
  dosyaya `veritabani` bölümünü yazar. İki araç da `sunucu/ayarlar.js`'i kullanmadan dosyayı kendisi yazar.
- **Ayarı kullanan:** [../sunucu/guvenlik.md](../sunucu/guvenlik.md) — giriş kodu, şifre sıfırlama ve e-posta onayı
  postaları. `epostaKurulu()` (`sunucu/ayarlar.js`) `etkin`, `sunucu`, `kullanici`, `sifre` doluysa e-postayı kurulu sayar;
  `.test`, `.example`, `.invalid`, `.localhost` uzantılı adreslere yine gönderilmez. E-posta kurulu sayılınca iki şey daha
  değişir: kayıtta ve e-posta değişikliğinde adresin alan adı DNS'te denetlenir (`epostaAlaniVarMi`: MX, yoksa A kaydı;
  ikisi de yoksa `"<alan>" alan adı e-posta almıyor` hatası — [../sunucu/bolumler/kayit.md](../sunucu/bolumler/kayit.md),
  [../sunucu/bolumler/kisilik.md](../sunucu/bolumler/kisilik.md)), ve sunucu açılışta pencereye "Giris kodlari e-posta ile
  gonderilecek (<sunucu>)" yazar ([../sunucu/index.md](../sunucu/index.md)).
- **Onu çağıran:** `package.json` → `"eposta-ayarla": "node araclar/eposta-ayarla.js"`. Başka hiçbir dosya `require` etmez.
- Tabloya ve sunucuya dokunmaz; ağda yalnız deneme postası için seçilen SMTP sunucusuna bağlanır.

## Nasıl çalışır (adım adım)?

```
npm run eposta-ayarla
  ── karşılama: "Sifren SADECE bu bilgisayardaki data/ayarlar.json dosyasina yazilir"
  1) Saglayicini sec   1..7 → SAGLAYICILAR[k] (+ not)      8 / geçersiz → sunucu? port? (guvenli = port 465)
  2) Hesap bilgileri   kullanıcı adı (boşsa İPTAL) → şifre, yıldızlı (boşsa İPTAL)
                       → gönderen [kullanıcı] → görünen ad [Egitim Evi]
  3) Deneme e-postasi  (E/h, varsayılan E)
        E → alıcı [kullanıcı] → eposta.gonder(ayar, …)
              başarılı → "BASARILI: mail gonderildi -> …"
              hata     → ileti + sık nedenler → "Yine de kaydedeyim mi? (e/H)" → H ise KAYDETMEDEN çık
  kaydet: ayarlar.json'u oku (yoksa ya da bozuksa {}) → .eposta = ayar → _aciklama yoksa ekle → data/ oluştur → yaz
  "Kaydedildi -> data/ayarlar.json"  "Sunucu calisiyorsa KAPATIP yeniden baslat (npm start)."
```

Sunucu ayarları yalnız açılışta okur ([../sunucu/index.md](../sunucu/index.md) `ayarlariYukle()`); bu yüzden yeniden
başlatma şart.

## Dikkat!

- **Silme tuşu şifreyi gösterir.** `sifreSor` her tuşu `*` ile gösterir, ama yazarken bir karakter silince (geri tuşu)
  `readline` satırı baştan çizer ve bu çizim soruyu da içerdiği için olduğu gibi geçirilir: o ana kadar yazılan şifre ekranda
  açıkça görünür. 2 Ekim'de Node 24.19.0'da sahte bir uçbirimle iki ayrı kez denendi (belge yazılırken ve denetimde):
  `gizli12` yazıp bir harf silince ekrana önce yedi yıldız, sonra `Sifre (ekranda gorunmez): gizli1` düştü. Ayrıca yöntem Node'un belgelenmemiş `_writeToOutput` işlevine dayanıyor; Node
  sürümü değişince gizleme hiç çalışmayabilir. Şifreyi yazarken silme tuşuna basma; yanlış yazdıysan Enter'a bas, deneme
  postası başarısız olunca "kaydetme" de ve aracı yeniden çalıştır. (Kod değiştirilmedi.)
- **Bozuk `ayarlar.json` sessizce ezilir.** Dosya okunup JSON olarak çözülemezse `{}` ile başlanır ve dosya yalnız `eposta`
  (ve `_aciklama`) ile yeniden yazılır: `veritabani`, `site`, `vekil` bölümleri uyarısız kaybolur, sunucu bir sonraki açılışta
  veritabanına bağlanamaz. Çalıştırmadan önce dosyanın sağlam olduğundan emin ol ya da yedeğini al. (Kod değiştirilmedi.)
- **`EE_DATA`'ya bakmaz.** Araç her zaman proje kökündeki `data/ayarlar.json`'a yazar. Sunucuyu başka bir veri klasörüyle
  (`EE_DATA=…`) çalıştırıyorsan bu araç o sunucunun ayarını değiştirmez; o dosyayı elle düzenle. Tersi de önemli: test
  sunucusunun `testler/testdata/ayarlar.json`'u bu araçtan etkilenmez, testler e-postasız kalır.
- **Ayar kurulunca uydurma alan adlı kayıtlar reddedilir.** Kayıt, alan adını DNS'te arar (yukarıda); `@test.com` gibi
  MX'siz ve A kaydı olmayan adresler artık kaydolamaz. Bu yüzden test ve deneme araçlarını ([giris.md](giris.md)) e-postası
  ayarlı bir sunucuya karşı çalıştırma; deneme hesaplarında `.test` uzantısı kullan (DNS'e sorulmaz, posta gönderilmez).
- **Şifre düz metin olarak diske yazılır.** `data/` web'den sunulmaz ve depoya girmez (`.gitignore`;
  `testler/test-gizli-dosyalar.js` `data/ayarlar.json`'un dışarıda kaldığını denetler), ama dosya o bilgisayarda okunabilir. Sunucuda dosyayı ilk kez bu araç
  oluşturuyorsa izinleri varsayılan kalır: [belge/SUNUCUYA-KURULUM.md](../belge/SUNUCUYA-KURULUM.md)'deki gibi uygulamanın
  kullanıcısıyla çalıştır ve sonra `chmod 600 data/ayarlar.json` yap. Var olan dosyanın izinleri yazarken korunur.
- **Kullanıcı adı her sağlayıcıda e-posta değildir.** Soru "Kullanici adi (tam e-posta adresin)" diyor; Brevo, Mailjet ve
  SMTP2GO'da kullanıcı adı bir SMTP kullanıcısı ya da API anahtarıdır. O zaman "Gonderen adres" ve deneme alıcısı
  sorularında varsayılanı (kullanıcı adını) kabul etme: sağlayıcıda doğrulanmış gönderici adresini ve kendi e-posta adresini yaz.
- **Port ve güvenli bağlantı.** Listeden seçince doğru eşleşme gelir. Elle girerken güvenli yalnız port 465 ise açılır;
  465 dışında TLS'i baştan isteyen bir sunucuda bağlantı kurulamaz (araç bunu "Sik nedenler" listesinde söyler).
- **Deneme postası bu bilgisayardan gider.** Aracı kendi bilgisayarında çalıştırıp dosyayı sunucuya taşırsan, sunucunun
  ağından (güvenlik duvarı, kapalı 465/587) gönderim yine de başarısız olabilir; sunucuda bir kez giriş kodu isteyip dene.
- **Gmail sınırı.** Gmail ile günde yaklaşık 500 posta sınırı vardır; okul büyüdükçe bir posta servisine (Brevo, Mailjet…)
  geçmek gerekebilir. Kullanıcı servis seçimini sonraya bıraktı.

## Testleri

- Otomatik test yok: araç etkileşimlidir ve gerçek bir SMTP hesabı ister; testler hiç posta göndermez (test sunucusunun
  `ayarlar.json`'unda e-posta ayarsızdır, kodlar günlüğe yazılır — [giris.md](giris.md)).
- `testler/test-gizli-dosyalar.js` aracın yazdığı `data/ayarlar.json`'un depoya giremeyeceğini denetler.
- Elle: kendi SMTP bilgilerinle `npm run eposta-ayarla` → sağlayıcını seç → deneme postasını kendine gönder → gelen kutusunda
  (ve spam klasöründe) "Egitim Evi deneme e-postasi"nı gör → kaydet → sunucuyu yeniden başlat → giriş yap: kod artık sunucu
  penceresine değil e-postana gelmeli. Bu belge yazılırken araç çalıştırılmadı (gerçek bir SMTP hesabı ve `data/` gerekir);
  yalnız şifre gizleme davranışı ayrı bir kopyada denendi.

## Son durum

- `git log --follow`: 2 commit, ikisi de 2026-08-28. `4b887db commit 30`: dosyanın kendisi (159 satır; aynı commit
  `sunucu/yardimci/eposta.js`'e `SAGLAYICILAR`'ı ekledi). `1ee36ea commit 31`: dosyanın sonuna `calistir()` çağrısı ve
  beklenmeyen hata yakalayıcısı eklendi (o güne kadar dosya yalnız işlevleri tanımlıyordu; çalıştırınca hiçbir soru
  sormadan bekliyordu). O günden beri değişmedi.
- Bilinen açıklar ("Dikkat!"te, kod değiştirilmedi): silme tuşunda şifrenin görünmesi, bozuk `ayarlar.json`'un sessizce
  ezilmesi, `EE_DATA`'ya bakmaması.
- Planlı işlerden bu dosyayı etkileyecekler: "Sistem" işindeki "E-posta sağlığı" — yönetim panelinde e-postanın ayarlı olup
  olmadığı, son başarılı/başarısız gönderim ve "Test e-postası gönder" düğmesi gelecek (bu aracın deneme postasının panel
  karşılığı). Kullanıcı e-posta servisini seçmedi ("sonra bakarım"); seçilirse `SAGLAYICILAR`'a eklenir ve bu araçta
  kendiliğinden görünür.
