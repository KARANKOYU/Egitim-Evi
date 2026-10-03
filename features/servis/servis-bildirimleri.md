# Servis · Servis bildirimleri

**Durum:** Kodda var; tasarımda ek olarak "bugün servise binmedi" uyarısı ("Önemli" öncelikli) ve bildirim panelinde servis bildirimlerini toplayan "Servis" sekmesi.

Servisle ilgili bütün bildirimlerin (kime, hangi metinle, ne zaman, kaç kez gittiği) tek yerde listesi.

## Ne işe yarar

Servis bölümünde bildirimler birkaç yerden doğar: servisçinin yoklama işaretleri, "Okula vardık", servisçinin notları, velinin "binmeyecek"
işareti ve aracın eve yaklaşması. Kullanıcının isteği (26 Eylül): "veliye .. servise bindi dicek" ve "aynı bildirimin birden fazla
atılmaz-sı vb gibi hatalar da olmasın": aynı bildirim iki kez gitmemeli. Bu belge hepsini bir arada gösterir; ayrıntılar ilgili alt özellik belgelerinde.

## Nereden açılır

Bildirimler sitenin bildirim panelinde (üst şeritteki zil) görünür; telefon bildirimi açıksa telefona düşer; Eğitim Evi Android
uygulaması da yoklayıp gösterir. Bildirime dokununca ilgili sayfa açılır (aşağıdaki tabloda "Açılan yer").

Tasarımda: bildirim panelinde öğrenci, veli, müdür ve servisçide **"Servis"** sekmesi (servis bildirimleri burada toplanır;
[Bildirim paneli](../bildirim/bildirim-paneli.md)).

## Adım adım

### Veli — gelen bildirimler

| Olay | Bildirim metni | Açılan yer |
|---|---|---|
| Sabah "Bindi" | "Zeynep 07:42'de servise bindi." | O çocuğun servis sayfası (`#/servis?c=<çocuk>`) |
| Sabah "Binmedi" | "Zeynep bu sabah servise binmedi." | aynı |
| "Bindi" sonra "Binmedi"ye çevrildi | "Düzeltme: Zeynep bu sabah servise binmedi." (bir kez) | aynı |
| "Okula vardık" | "Zeynep 08:05'te okula vardı." (yalnız "Bindi" işaretliler) | aynı |
| Akşam "Geldi" | "Zeynep 16:40'ta okuldan servise bindi." | aynı |
| Akşam "Gelmedi" | "Zeynep akşam servise gelmedi." | aynı |
| "Geldi" sonra "Gelmedi"ye çevrildi | "Düzeltme: Zeynep akşam servise gelmedi." (bir kez) | aynı |
| "İndi" | "Zeynep 17:10'da eve bırakıldı." | aynı |
| Servisçinin notu | "Servisçiden not: Yarın 07:35'te hazır ol." | aynı |
| Servis eve 500 m kala | "Zeynep Yılmaz: servis evine yaklaşıyor (yaklaşık 500 m)." | Servis sayfası (`#/servis`) |
| Servis eve 100 m kala | "Zeynep Yılmaz: servis evine 100 metreden yakın, hazırlan." | aynı |

Bildirime dokununca o çocuğun servis kartı seçilir; birden çok çocuğun varsa sayfa onun kartına kayar ([Servisim](servisim.md)).

### Öğrenci — gelen bildirimler

Yalnız yaklaşma bildirimleri: "Servis evine yaklaşıyor (yaklaşık 500 m)." ve "Servis evine 100 metreden yakın, hazırlan." Yoklama
bildirimleri ve servisçinin notu öğrenciye gitmez (notu kartında görür).

### Servisçi — gelen bildirimler

| Olay | Bildirim metni | Açılan yer |
|---|---|---|
| Veli "binmeyecek" koydu ya da değiştirdi | "Zeynep Yılmaz yarın sabah servise binmeyecek. Velinin notu: Doktor randevusu var." | Yoklama sayfası (`#/ana`) |
| Veli işareti kaldırdı | "Zeynep Yılmaz için yarın "binmeyecek" işareti kaldırıldı." | aynı |
| Okul şifresini değiştirdi | "Şifren okul yönetimi tarafından değiştirildi." | — |

### Müdür, öğretmen ve çalışan

Servis yoklamasından bildirim almazlar; kendi çocukları serviste ise veli olarak alırlar. Tasarımda akşam servisine binmeyen öğrenci için
okul idaresine (servis sorumlusu) bilgi gider ([Servise binmedi uyarısı](servise-binmedi-uyarisi.md)).

### Tasarımda (Tasarım 1 önizlemesi)

- Bildirim panelinde **"Servis"** sekmesi (öğrenci, veli, müdür, servisçi).
- Önizlemedeki örnek metinler: velide "Elif · Servis eve 100 m kaldı" (altında "Servis 3 · eve dönüş"); servisçide "Can yarın akşam
  servise binmeyecek" (altında "Zeynep Yılmaz bildirdi · 2 Ekim · eve dönüş"). Kullanıcı metinler için ayrıca karar vermediği için
  bugünkü metinler geçerlidir.
- 3 Ekim kararı: sefer bitince binmeyen öğrencinin velisine "Önemli" öncelikli "bugün servise binmedi" uyarısı
  ([Servise binmedi uyarısı](servise-binmedi-uyarisi.md)).

## Kurallar ve sınırlar

- **Yoklama bildirimleri yalnız velilere** gider; öğrenciye gitmez. Çocuğa giden bildirimlerin veliye kopyalanması kuralı burada
  kullanılmaz: veliye doğrudan kendi metni gider (yaklaşma bildiriminde de öğrenci ve veli ayrı metin alır).
- **Tekrar yok:** her olay (tarih, dönem, öğrenci, olay) için bir kez gider. Aynı işarete yeniden basmak, sayfayı yenileyip yeniden
  göndermek ya da iki telefondan basmak ikinci bildirim üretmez. Önceki deneme yarıda kaldıysa "Yeniden dene" eksik bildirimi tamamlar.
- **Düzeltme bir kez:** "Bindi" bildirildikten sonra "Binmedi"ye (akşam "Geldi"den "Gelmedi"ye) çevrilirse yalnız bir kez "Düzeltme: …"
  gider; sonra yeniden çevirmek yeni bildirim üretmez.
- **"Binmeyecek" varken** o dönem için "Binmedi" / "Gelmedi" bildirimi gitmez (önce "Bindi" bildirildiyse yalnız düzeltme gider).
- **Ad ve saat:** bildirimde öğrencinin yalnız ilk adı yazar (soyadı yok; "Ayşe Nur Yılmaz" → "Ayşe Nur"); yaklaşma bildiriminde velide tam
  ad. Saat Türkiye saatiyle, eki okunuşuna göre: "07:42'de", "08:05'te", "16:40'ta", "17:10'da", "07:30'da".
- **Kardeşler:** servisçinin notu bütün servise yazıldıysa kardeşlerin velisi tek bildirim alır. Yoklama bildirimleri her çocuk için ayrı
  gelir.
- **Servisçiye** "binmeyecek" bildirimi yalnız işaret ya da not gerçekten değiştiyse ve servise servisçi hesabı atanmışsa gider.
- **Nasıl ulaşır:** sitenin bildirim paneli; telefon bildirimi (Web Push) açıksa anında; Android uygulaması servis saatlerinde 1–3
  dakikada bir, başka zamanlarda 15 dakikada bir sorar ve aynı metni gösterir.
- **Saklama:** servis bildirimlerinin "gitti mi" kayıtları (olaylar) 30 gün; bildirimin kendisi bildirim kurallarına göre
  ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md) — yoklama bildirimlerinin kaynağı.
- [Velilere not](gunluk-not.md), [Binmeyecek](binmeyecek.md), [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md).
- [Servise binmedi uyarısı](servise-binmedi-uyarisi.md) — tasarım.
- [Servisim ve servis kartı](servisim.md) — bildirime dokununca açılan sayfa.

**İlgili:**

- [Bildirim paneli](../bildirim/bildirim-paneli.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md),
  [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md),
  [Telefon bildirimi](../bildirim/telefon-bildirimi.md).
- [Önemli etiketi](../mesaj/onemli-etiketi.md) — "Önemli" öncelik (tasarım).
- [Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `yoklamaBildir` (bindi, binmedi, düzeltme, geldi,
  gelmedi, indi), `servisVelilerineBildir` (`{ veliye: false }`, bağlantı `#/servis?c=`), "okula vardı" (`okula-vardik`), not
  (`servis/not`), "binmeyecek" (servisçiye, `#/ana`), `yaklasmaBildir`; saat eki ve ilk ad
  [sunucu/yardimci/servis-pencere.md](../../sunucu/yardimci/servis-pencere.md) (`saatEki`, `ilkAd`).
- Tekillik: [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md) (`servis_olaylari`, `olayIlkMi`, `olayVarMi`),
  [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) (`sefer_bildirimleri`).
- Gönderim: [sunucu/push.md](../../sunucu/push.md) (Web Push), [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) (telefon
  uygulamasının `GET /api/cihaz/bildirimler` yoklaması).
- Ön yüz: bildirimden gelinen çocuk [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`#/servis?c=`).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (tekrar yok, düzeltme bir kez, binmeyecek varken bildirim
  yok, servisçiye haber, telefona `/api/cihaz/bildirimler` ile gelme), [testler/test-servis-konum.md](../../testler/test-servis-konum.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Veliye giden bildirimler").

## Sık sorulanlar

- **Veliye hangi servis bildirimleri gider?** (sitenin SSS'si: "Veliye hangi bildirimler gider?") Servisçi yoklamayı işaretledikçe
  "… servise bindi.", "… okula vardı.", "… eve bırakıldı." gibi bildirimler, her biri bir kez; yanlışlıkla "Bindi" deyip "Binmedi"ye
  çevrilirse bir kez "Düzeltme: …"; servis eve 500 m ve 100 m kala ve servisçi not yazınca da haber gelir.
- **Çocuğuma da bildirim gidiyor mu?** Yalnız yaklaşma bildirimleri; yoklama bildirimleri yalnız veliye.
- **"Binmedi" bildirimi neden gelmedi?** O dönem için "binmeyecek" işareti koyduysan gitmez.
- **Aynı bildirim iki kez geldi.** Olay başına bir kez gider; iki ayrı bildirimse biri düzeltmedir ya da iki ayrı çocuk içindir.

## Sırada

- 3 Ekim kararı: "bugün servise binmedi" uyarısı "Önemli" önceliğinde (kodu Linux'ta).
- Mesaj ayarları (bildirim paneli sekmeleri): servis bildirimlerinin "Servis" sekmesinde toplanması; bağlantılar aynı kalır.
- Tek kişi tek hesap + portallar öğrencide de: bildirimde kurum adı.
- Çok dil: bildirim metinlerinin çeviri kataloğuna girmesi.
