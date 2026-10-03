# Hesap ayarları · Bildirim ayarları

**Durum:** Kodda var; tasarımda ek olarak "Bildirimler" bölümünde "Bu cihazda bildirim" izin durumu ve "İzin ver", "Telefon bildirimleri" ve "E-posta bildirimleri" anahtarları; öğrenci ve velide "Ödev hatırlatmaları" bölümü.

Eğitim Evi kapalıyken de bildirimlerin bu cihaza (telefon ya da bilgisayar) gelmesini açıp kapattığın yer.

## Ne işe yarar

Uygulama açık değilken de servis eve yaklaşınca, yeni mesajda, yeni ödevde haberin olsun. Kullanıcının 25 Eylül sözü: "web site
bildirimler için izin isteyebilcek". Bildirim zilindeki bildirimler her zaman gelir; bu ayar yalnız **telefona (cihaza) düşmesini**
yönetir.

## Nereden açılır

- **Bugün:** Ayarlar → **"Telefon bildirimleri"** kartı (herkeste) ([Ayarlar sayfası](hesap-ayarlari-sayfasi.md)). Servisi olan öğrenci
  ve velinin servis sayfasında ayrıca "Servis yaklaşınca haber al" önerisi ve aynı **"Bildirimleri aç"** düğmesi
  ([Yaklaşma bildirimi](../servis/yaklasma-bildirimi.md)).
- **Telefon uygulamasında:** Ayarlar sekmesi → "TELEFON" → **"Telefon bildirimleri"**.
- **Tasarımda:** Hesap ayarları → **"Bildirimler"** bölümü; profil menüsünde **"Bildirimler — telefon ve e-posta"**; sayfaların üstünde
  bir kez çıkan **"Bildirimlere izin ver"** şeridi.

## Adım adım

### Bugün: herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, rolsüz yetişkin, yönetici)

"Telefon bildirimleri" kartı dört hâlden birini gösterir:

| Durum | Kartta yazan | Düğme |
|---|---|---|
| Bu cihazda açık | "Bu cihazda açık" — "Uygulama kapalıyken de bildirim gelir." | **"Kapat"** |
| Kapalı | "Bu cihazda kapalı" — "Servis eve yaklaşınca, yeni mesaj ve ödevde telefonuna bildirim gelsin." | **"Bildirimleri aç"** |
| İzin engellenmiş | "Bu cihazda kapalı" — "Tarayıcıda bu site için bildirim engellenmiş; site ayarlarından izin ver." | yok |
| Tarayıcı desteklemiyor | "Bu tarayıcı telefon bildirimini desteklemiyor. iPhone'da önce Paylaş > Ana Ekrana Ekle ile uygulamayı kur, oradan aç." (güvenli olmayan bağlantıda: "Telefon bildirimi yalnızca güvenli (https) bağlantıda çalışır.") | yok |

Açmak:

1. **"Bildirimleri aç"**a bas; düğme "Açılıyor..." olur.
2. Tarayıcı izin sorar; **izin ver**.
3. Başarıda kart "Bu cihazda açık" olur, altında yeşil **"Telefon bildirimleri açıldı."**
4. Hata iletileri (kartın altında kırmızı): "Bildirim izni verilmedi. Tarayıcının site ayarlarından izin verip tekrar dene.", "Uygulama
   bileşeni yüklenemedi. Sayfayı yenileyip tekrar dene.", sunucudan "Bu tarayıcının bildirim adresi tanınmadı.", "Bu tarayıcının
   bildirim anahtarı geçersiz.", "Çok sık denedin. Biraz sonra tekrar dene.", "Bu bildirim adresi başka bir abonelikte kayıtlı.
   Bildirimleri kapatıp yeniden aç."

Kapatmak: **"Kapat"** → "Kapatılıyor..." → kart "Bu cihazda kapalı" olur.

Bildirime dokununca Eğitim Evi açılır ve bildirimin götürdüğü sayfaya gidilir ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).

### Veli

Çocuğuna giden bildirimlerin kopyası başında çocuğun adıyla sana gelir; bu kopyayı ayrıca kapatma ayarı yoktur. Telefon bildirimini
kapatırsan yalnız telefona düşmez, zilde görmeye devam edersin ([Velinin bildirimleri](../bildirim/velinin-bildirimleri.md)).

### Okul rolündeyken (öğretmen, müdür)

Abonelik yetişkin hesabınındır: portal değiştirmek aboneliği değiştirmez; bütün portallarının bildirimleri aynı cihaza gelir.

### Telefon uygulamasında (bugün)

Ayarlar → "Telefon bildirimleri"nin altındaki yazı: izin yoksa (Android 13 ve sonrası) **"Kapalı: dokun ve izin ver"**; izin var ve
telefon tanıtılmışsa **"Açık: 15 dakikada bir, servis saatlerinde dakikada bir bakılır"**; yalnız izin varsa **"Açık"**. Dokununca izin
penceresi ya da telefonun bu uygulamaya ait bildirim ayarları açılır. Uygulamanın bildirimleri tarayıcı aboneliğiyle değil, uygulamanın
sunucuya sormasıyla gelir ([Android uygulaması](../uygulama/android-uygulamasi.md)).

### Tasarımda (Tasarım 1 önizlemesi): "Bildirimler" bölümü

1. **"Bu cihazda bildirim"** — tarayıcının izin durumu:
   - "İzin verildi" — "Bu cihazda yeni ödev, mesaj ve sınav sonucu bildirimi alırsın";
   - "Engellendi" — "Açmak için tarayıcının site ayarlarından bildirimlere izin ver";
   - "Henüz izin verilmedi" — "İzin verirsen bu cihazda bildirim alırsın" ve **"İzin ver"** düğmesi;
   - "Bu tarayıcı desteklemiyor" — "Telefonda Eğitim Evi uygulamasını kurarak bildirim alabilirsin".
   "İzin ver"e basınca: "Tarayıcının açtığı küçük pencereden "İzin ver"i seç."; sonuç: "Bildirimlere izin verildi; bu cihazda bildirim
   alacaksın.", "Bildirim izni engellendi. Açmak için tarayıcının site ayarlarından izin ver." ya da "İzin verilmedi; istediğin zaman
   Hesap ayarları → Bildirimler'den açabilirsin." Desteklemeyen tarayıcıda: "Bu tarayıcı bildirimleri desteklemiyor; telefonda Eğitim
   Evi uygulamasını kurabilirsin."
2. **"Telefon bildirimleri"** — "Eğitim Evi uygulamasında açık", altında "ödev, mesaj, sınav sonucu, devamsızlık"; açma/kapama anahtarı.
3. **"E-posta bildirimleri"** — "Yalnız önemli olanlar", altında "şifre değişikliği, okul duyuruları"; anahtar **kapalı** gelir
   ([Duyuru](../mesaj/duyuru.md)).
4. Öğrenci ve velide ayrı bir **"Ödev hatırlatmaları"** bölümü: "Son günden 1 gün önce 19:00" (hazır işaretli), "Son güne kadar her gün
   19:00", "Son gün 08:00", "Kapalı"; "Ödev başına" satırı ve "Kaydet" ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).

Sayfaların üstündeki şerit (izin henüz sorulmamışsa, bir kez): **"Bildirimlere izin ver"** — "Yeni ödev, mesaj ve sınav sonucu
geldiğinde bu cihazda bildirim alırsın." **"İzin ver"** / **"Şimdi değil"** ("İstediğin zaman Hesap ayarları → Bildirimler'den izin
verebilirsin."). Tahta hesabında çıkmaz.

## Kurallar ve sınırlar

- **Ayar cihaz başınadır:** her tarayıcıda, her telefonda ayrı açılır. Kişi başına en yeni 5 abonelik tutulur, eskiler silinir.
- **Çıkışta abonelik bırakılır:** aynı cihaza başka biri girerse önceki kişinin bildirimleri ona gelmez; açılışta da cihazdaki abonelik
  başka hesaba aitse bırakılır.
- **İzin bir kez engellenirse** tarayıcı bir daha sormaz; site ayarlarından açmak gerekir.
- **Güvenli bağlantı şart** (https); iPhone'da yalnız ana ekrana eklenmiş Eğitim Evi'nde çalışır (iOS 16.4 ve sonrası).
- **Sınırlar:** abonelik isteği kişi başına saatte 20; gönderim kişi başına dakikada en çok 20 bildirim.
- **Bildirim türü seçilmez (bugün):** bütün bildirimler aynı ayarla gelir; tek tek kapatma yok. E-posta ile bildirim gönderilmez (e-posta
  yalnız giriş kodu, onay ve şifre sıfırlama için).
- **Bilinen açıklar (kod değiştirilmedi):** sunucu aboneliği reddederse tarayıcıda kalan abonelik bir sonraki açılışa kadar "Bu cihazda
  açık" gösterebilir; servis sayfasındaki öneride düğme başarıdan sonra "Açılıyor..." kalır.
- **Tasarımda karar bekleyenler:** "E-posta bildirimleri" anahtarı ve "Telefon bildirimleri" anahtarı Tasarım 1'de çizildi; tanımlarda
  hangi bildirimlerin e-postayla gideceği ve anahtarın tam etkisi yazılı değil. Öneri: kodlanmadan önce kullanıcıya sorulur.
- **Saklama:** bildirimler 90 gün tutulur ([Saklama ve silinme](../bildirim/saklama-ve-silinme.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Görünüm ve dil](gorunum-ve-dil.md) ·
[Giriş bilgileri](giris-bilgileri.md) · [Hesabımı sil](hesabimi-sil.md) (hesap silinince abonelik de gider).

**İlgili:** [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Bildirim paneli](../bildirim/bildirim-paneli.md),
[Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md),
[Ders öncesi bildirim](../bildirim/ders-oncesi-bildirim.md), [Yaklaşma bildirimi](../servis/yaklasma-bildirimi.md),
[Ödev hatırlatmaları](../odev/hatirlatmalar.md), [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md),
[Bana kim yazabilir](../mesaj/bana-kim-yazabilir.md), [Android uygulaması](../uygulama/android-uygulamasi.md),
[Tarayıcıdan yükleme](../uygulama/tarayicidan-yukleme.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/04b-bildirim-izni.md](../../public/js/parcalar/04b-bildirim-izni.md) — `bildirimKartiCiz`, `bildirimAc`,
  `bildirimKapat`, `bildirimAboneligiBirak`, `bildirimEsitle`, `EYLEMLER['bildirim-ac' / 'bildirim-kapat']`;
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — kartın yeri (`#bildirimAyar`);
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — açılışta eşitleme, çıkışta bırakma;
  [public/sw.md](../../public/sw.md) — bildirimi gösteren servis çalışanı.
- Sunucu: [sunucu/bolumler/push.md](../../sunucu/bolumler/push.md) — `/api/push/anahtar`, `/abone`, `/durum`, `/iptal`;
  [sunucu/push.md](../../sunucu/push.md) — şifreleme ve gönderim; [sunucu/veri/depo/push.md](../../sunucu/veri/depo/push.md).
- Testler: [testler/test-push.md](../../testler/test-push.md), [testler/test-yetiskin.md](../../testler/test-yetiskin.md) (abonelik
  yetişkin hesabının).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Telefon bildirimi (Web Push)").

## Sık sorulanlar

- **Telefon bildirimleri gelmiyor.** Eğitim Evi'nde bildirimleri açtığından ve tarayıcıya izin verdiğinden emin ol. Telefonun
  ayarlarında tarayıcının (ya da uygulamanın) bildirimleri kapalı olabilir. iPhone'da bildirim yalnız ana ekrana eklenmiş Eğitim
  Evi'nden açılınca çalışır. Bildirimler güvenli (https) bağlantı ister.
- **Bilgisayarımda açtım, telefonuma da gelir mi?** Hayır; her cihazda ayrı açarsın.
- **Bazı bildirimleri kapatabilir miyim?** Bugün tür seçimi yok; telefonu kapatırsın, zilde görmeye devam edersin.

## Sırada

- Arayüz önizlemesi / Tasarım 1 → kod: "Bildirimler" bölümü (izin durumu, telefon ve e-posta anahtarları); e-posta bildirimlerinin
  kapsamı kullanıcıya sorulacak.
- Mesaj ayarları … ödev hatırlatma otomasyonu: "Ödev hatırlatmaları" ayarı; bildirim paneli sekmeleri.
