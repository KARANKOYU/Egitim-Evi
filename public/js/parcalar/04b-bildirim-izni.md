# public/js/parcalar/04b-bildirim-izni.js

Telefon/tarayıcı bildirimi (Web Push) aboneliği: izin isteme, aboneliği sunucuya yazma, kapatma, çıkışta bırakma, açılışta
"bu cihazdaki abonelik benim mi" eşitlemesi ve profildeki "Telefon bildirimleri" kartı.

## Bu dosya ne yapar?

Eğitim Evi kapalıyken de telefona bildirim gelebilir: servis eve yaklaşınca, yeni mesajda, yeni ödevde. Bunun için tarayıcı
bir "abonelik" üretir (push servisinin adresi `endpoint` ve iki şifreleme anahtarı). Bu dosya o aboneliği alır ve sunucuya
yazar; sunucu da bildirim olunca içeriği o anahtarlarla şifreleyip push servisine gönderir.

Dosyanın başındaki yorum iki güvenlik kararını söyler:

- Sunucu yalnız bu tarayıcının bildirim adresini ve açık anahtarını tutar; içerik o anahtarla şifrelenir.
- Abonelik tarayıcıya VE hesaba bağlıdır. **Çıkışta abonelik bırakılır:** aynı cihazda başka biri giriş yaparsa önceki
  kişinin bildirimleri ona gelmesin. Açılışta da, bu tarayıcıdaki abonelik başka bir hesaba aitse (ortak cihaz, çıkış
  yapılmadan kapanmış oturum) bırakılır.

Bildirimler servis çalışanı üzerinden gelir; yani bu dosya [04-pwa.md](04-pwa.md)'nin `/sw.js` kaydına dayanır.

## İçinde neler var?

### Destek ve dönüşümler

- `bildirimDestegi()` — güvenli bağlam (`https`/`localhost`) + `serviceWorker` + `PushManager` + `Notification` varsa
  `true`.
- `base64UrlDiziye(s)` — base64url metni → `Uint8Array` (sunucunun açık anahtarı `applicationServerKey` olarak böyle
  verilir).
- `diziBase64Url(tampon)` — tersi; var olan aboneliğin anahtarını sunucununkiyle karşılaştırmak için.
- `isciHazir(ms)` — `navigator.serviceWorker.ready`'yi en çok `ms` (varsayılan 8000) bekler; süre dolarsa "Uygulama bileşeni
  yüklenemedi. Sayfayı yenileyip tekrar dene." hatası. (Servis çalışanı kaydı başarısızsa `ready` hiç gelmez.)
- `mevcutAbonelik()` — bu tarayıcıdaki abonelik ya da `null`. `getRegistration('/')` kullanır, `ready`'yi BEKLEMEZ (çıkış
  gecikmesin); her hata `null`.
- `abonelikGovdesi(a)` — sunucuya gidecek gövde `{ endpoint, keys: { p256dh, auth } }`.

### Açma, kapama, bırakma, eşitleme

- `bildirimAc()` — adım adım (bir hata zinciri keser, ileti `Error.message`'dadır):
  1. destek yoksa: güvenli bağlamda "Bu tarayıcı telefon bildirimini desteklemiyor. iPhone'da önce Paylaş > Ana Ekrana
     Ekle ile uygulamayı kur, oradan aç.", değilse "Telefon bildirimi yalnızca güvenli (https) bağlantıda çalışır.";
  2. `Notification.requestPermission()` — `granted` değilse "Bildirim izni verilmedi. Tarayıcının site ayarlarından izin
     verip tekrar dene.";
  3. `GET /api/push/anahtar` → sunucunun açık VAPID anahtarı;
  4. servis çalışanı hazır mı (`isciHazir`);
  5. var olan abonelik aynı anahtarla açılmışsa o kullanılır; anahtar değiştiyse eskisi bırakılıp
     `pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })` ile yenisi alınır;
  6. `POST /api/push/abone` `{ endpoint, keys }`.
- `bildirimKapat()` — abonelik varsa `POST /api/push/iptal { endpoint }` (hatası yok sayılır), sonra tarayıcıda
  `unsubscribe()`.
- `bildirimAboneligiBirak()` — çıkış için: `bildirimKapat` gibi ama hiçbir hata dışarı çıkmaz ve en çok 3 saniye beklenir
  (`Promise.race`). Çıkış hiçbir koşulda takılmaz.
- `bildirimEsitle()` — açılışta: abonelik ve oturum varsa `POST /api/push/durum { endpoint }`; cevap `benim: false` ise
  tarayıcıdaki abonelik bırakılır. Hatalar yok sayılır.

### Profildeki kart ve düğmeler

- `bildirimKartiCiz()` — `#bildirimAyar` kutusunu çizer (yoksa hiçbir şey yapmaz):
  - destek yok → yukarıdaki iki açıklamadan biri (`.hint`);
  - abonelik var → "Bu cihazda açık · Uygulama kapalıyken de bildirim gelir." + **Kapat** (`data-act="bildirim-kapat"`);
  - abonelik yok, izin engellenmiş (`Notification.permission === 'denied'`) → "Bu cihazda kapalı · Tarayıcıda bu site için
    bildirim engellenmiş; site ayarlarından izin ver." (düğme yok);
  - abonelik yok → "Bu cihazda kapalı · Servis eve yaklaşınca, yeni mesaj ve ödevde telefonuna bildirim gelsin." +
    **Bildirimleri aç** (`data-act="bildirim-ac"`).
- `EYLEMLER['bildirim-ac']` — düğme "Açılıyor..." olur (`dugmeBekle`); başarıda kart yeniden çizilir ve
  `#bildirimAyarMesaj`'a "Telefon bildirimleri açıldı."; hatada düğme eski hâline döner (`dugmeBitir`), ileti kırmızı.
- `EYLEMLER['bildirim-kapat']` — "Kapatılıyor..."; başarıda kart yeniden çizilir; hatada düğme döner, ileti kırmızı.

## Kimle konuşur?

- Çağırdıkları: `api`, `$`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)), `ik('onay')` ([02-ikonlar.md](02-ikonlar.md)),
  `mesajGoster` ([03-mesaj-modal.md](03-mesaj-modal.md)), `S.token` ([00-durum.md](00-durum.md)), `dugmeBekle`/`dugmeBitir`
  (`05-giris.js`); tarayıcının `Notification`, `PushManager`, `navigator.serviceWorker`.
- Sunucu uçları ([../../../sunucu/bolumler/push.md](../../../sunucu/bolumler/push.md); hepsi oturum ister, rolsüz yetişkin
  de kullanabilir):
  - `GET /api/push/anahtar` → `{ anahtar }`;
  - üç `POST` ucunda da önce adres denetlenir: 10–1000 karakter ve bilinen bir push servisi değilse 400 "Bu tarayıcının
    bildirim adresi tanınmadı.";
  - `POST /api/push/abone` `{ endpoint, keys }` → `{ ok: true }`; saatte 20'den sık 429; geçersiz anahtar 400; adres başka
    anahtarla kayıtlıysa 409 "Bu bildirim adresi başka bir abonelikte kayıtlı. Bildirimleri kapatıp yeniden aç."; aynı
    adres aynı anahtarlarla başka hesapta kayıtlıysa kayıt bu hesaba geçer; kişi başına en yeni 5 abonelik kalır (eskiler
    silinir);
  - `POST /api/push/durum` `{ endpoint }` → `{ benim }`;
  - `POST /api/push/iptal` `{ endpoint }` → yalnız sahibinin kaydı silinir; adres geçerliyse (kayıt olsun olmasın)
    `{ ok: true }`.
  Aboneliğin sahibi yetişkin hesabının kendisidir (`anaHesapId || id`): portal değiştirmek aboneliği değiştirmez.
  Bildirimin şifrelenip gönderilmesi [../../../sunucu/push.md](../../../sunucu/push.md); telefona düşen bildirimi
  `public/sw.js` gösterir, tıklanınca uygulamayı açar.
- Onu kullananlar:
  - `26-baslat.js` — `uygulamayiBaslat`'ta `bildirimEsitle()`, `cikisYap`'ta `bildirimAboneligiBirak()`;
  - `23-veli-ayarlar.js` — profil sayfasında "Telefon bildirimleri" kartı (`#bildirimAyar`, `#bildirimAyarMesaj`) ve
    `bildirimKartiCiz()`; hesap silinince `bildirimAboneligiBirak()`;
  - `19e-servis-konum.js` — servis sayfasında "Servis yaklaşınca haber al" önerisi: `bildirimDestegi()` ve
    `mevcutAbonelik()` ile, abonelik yoksa `data-act="bildirim-ac"` düğmesi ve `#bildirimAyarMesaj`.
- CSS: kart genel `.kart`, `.satir`, `.buyu`, `.ad`, `.alt`, `.btn.kucuk` (`04-kartlar.css`, `02-form.css`); ileti `.msg`
  (`02-form.css`); servis önerisindeki ikon `.bildirim-oneri` (`27-harita-ortak.css`).
- Rol: herkes (profil kartı her rolün profilinde; servis önerisi servisi olan öğrenci/veli ekranında).

## Nasıl çalışır (adım adım)?

```
Açma (profil ya da servis sayfası, "Bildirimleri aç"):
  requestPermission ─ granted ─► GET /api/push/anahtar ─► serviceWorker.ready (≤ 8 sn)
     ─► getSubscription: aynı anahtar mı? ── evet ─► onu kullan
                                          └ hayır ─► unsubscribe + subscribe(userVisibleOnly, anahtar)
     ─► POST /api/push/abone { endpoint, keys } ─► kart yeniden çizilir, "Telefon bildirimleri açıldı."

Açılış (26-baslat uygulamayiBaslat):
  getSubscription ─► POST /api/push/durum ─► benim: false ─► tarayıcıda unsubscribe

Çıkış (26-baslat cikisYap):
  [servisçiyse seferi bitir] ─► bildirimAboneligiBirak (en çok 3 sn) ─► POST /api/logout ─► giriş ekranı
       POST /api/push/iptal ─► unsubscribe   (her hata yutulur)
```

## Dikkat!

- **Sunucu reddederse tarayıcı aboneliği kalır.** `bildirimAc`'ın 5. adımında tarayıcı abone olur; 6. adımda sunucu
  reddederse (429, 400, 409) abonelik tarayıcıda kalır ama sunucuda kaydı olmaz. Kart hata sonrası yeniden çizilmediği
  için o an "kapalı" görünür; fakat profil bir sonraki açılışta `mevcutAbonelik`'e bakıp "Bu cihazda açık" der, oysa
  bildirim gelmez. Uygulamanın bir sonraki açılışında `bildirimEsitle` (`benim: false`) aboneliği bırakır ve durum düzelir.
  Kod değiştirilmedi; hata dalında `unsubscribe` ya da kartı yeniden çizmek yeter.
- **Servis sayfasında başarıdan sonra düğme "Açılıyor..." kalır.** `bildirim-ac` başarıda yalnız `#bildirimAyar`'ı
  (profil kartı) yeniden çizer; servis sayfasında o kutu yok, öneri kartı ve devre dışı düğmesi yerinde kalır (ileti yine
  "açıldı" der). Sayfa yenilenince öneri kaybolur.
- **Eşitleme yalnız tarayıcıyı temizler.** `bildirimEsitle` başka hesaba ait aboneliği tarayıcıda bırakır; o hesabın
  sunucudaki kaydını bu kişi silemez (`iptal` yalnız sahibininkini siler). Sunucu sonraki gönderimde push servisinden
  404/410 alınca kaydı kendisi siler ([../../../sunucu/push.md](../../../sunucu/push.md)).
- **Güvenli bağlam şart.** `http://` LAN adresinde kart yalnız açıklama gösterir. iPhone'da Safari sekmesinde Web Push yok;
  site önce ana ekrana eklenmeli (ileti bunu söyler).
- **İzin "engellendi" ise tarayıcı bir daha sormaz.** Kod da düğmeyi göstermez; kişi site ayarlarından izni açmalı.
- **Çıkışın sırası önemli:** `bildirimAboneligiBirak` `/api/logout`'tan ÖNCE çalışır, çünkü `iptal` oturum ister.
- **Kapatmada sunucu hatası yutulur** ve tarayıcı yine abonelikten çıkar; sunucuda artık ölü bir kayıt kalabilir, ilk
  gönderimde silinir.
- **Hesap silmede `iptal` 401 alır.** `23-veli-ayarlar.js` önce `/api/hesap/sil`'i çağırır, sonra
  `bildirimAboneligiBirak()`'ı. O anda hesabın oturumları silinmiştir: `iptal` 401 döner, [01-yardimcilar.md](01-yardimcilar.md)'deki
  `api()` bu yüzden `cikisYap(true)`'yu bir kez burada çalıştırır, hata yutulur, tarayıcı aboneliği yine bırakılır; ardından
  `23-veli-ayarlar.js` `cikisYap(true)`'yu ikinci kez çağırır (zararsız). Sunucudaki abonelik satırı hesapla birlikte
  şemanın `ON DELETE CASCADE` kuralıyla zaten silinmiştir (`sunucu/veri/sema/011-push.sql`).

## Testleri

- `testler/test-push.js` (sunucusuz) — sunucunun şifreleme ve VAPID imzası, abonelik adresinin yalnız bilinen push
  servislerinden kabulü, tarayıcı anahtarlarının boyut/biçim denetimi (bu dosyanın gönderdiği `keys`'in doğrulandığı yer).
- `testler/test-yetiskin.js` — telefon bildirimi aboneliğinin yetişkin hesabına ait olması (portal değişiminde de).
- `testler/test-servis-konum.js` — bu dosyanın çağırdığı uçları gerçekten çağırır: `/api/push/anahtar` (oturumsuz
  reddedilir), `/api/push/abone` (yalnız bilinen push servisleri; aynı cihaz başka hesaba geçince eskisinden düşer; kişi
  başı 5 cihaz); ayrıca eve 500 m ve 100 m kala giden yaklaşma bildirimi.
- Bu dosyanın tarayıcıdaki akışının testi yok (izin penceresi başsız tarayıcıda denenemiyor).
- Elle (Chrome, `http://localhost:3200`): profil → Telefon bildirimleri → "Bildirimleri aç", izin ver → "Bu cihazda açık".
  Çıkış yap, başka bir hesapla gir → profilde "Bu cihazda kapalı" görmelisin. Geliştirici araçları → Application → Service
  Workers'ta "Push" ile deneme gönderilebilir.

## Son durum

- `git log`: 1 commit. Dosya `a1c5d41 commit 324` (2026-09-26) ile `sunucu/bolumler/push.js` ve `05-giris.js`'teki
  eklerle birlikte geldi ve o günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): sunucu reddinde kalan tarayıcı aboneliği, servis sayfasında "Açılıyor..." kalan
  düğme, hesap silmede iki kez çalışan sessiz çıkış (zararsız).
- Planlı işlerden bu dosyaya dokunması beklenenler: "Mesaj ayarları … Ajanda … sessiz saatlerde bildirim erteleme" ve
  "Sistem … yeni cihaz uyarısı" yeni bildirim türleri getirecek (sunucu tarafı; bu dosya aboneliği değiştirmeden taşır);
  "Mesaj ayarları" işindeki bildirim paneli sekmeleri ve kişinin bildirim tercihleri profildeki bu kartın yanına gelebilir.
  "Çok dil" işi kart metinlerini katalogdan alacak.
