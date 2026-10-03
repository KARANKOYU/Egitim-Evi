# Bildirimler · Bildirim türleri ve metinleri

**Durum:** Kodda var; tasarımda ek olarak her bildirimin başlık + ayrıntı satırı ve türü, ayrıca yeni bildirimler (ders
değişikliği, ders başlamadan, yoklama düzeltmesi, "yoklama alınmadı", yeni teslim, toplantı, şikâyet, okumayanlara hatırlatma,
"bugün servise binmedi", çalışan, eğitmen, yıl geçişi, birden çok müdür ve sistem bildirimleri).

Hangi olayda kime hangi bildirimin, hangi metinle gittiği ve basınca nereye götürdüğü — bütün liste.

## Ne işe yarar

Bir bildirimin neden geldiğini ve basınca nereye gideceğini buradan bulursun. Metinler koddan aynen alındı; köşeli ayraç içindeki
yerler değişir (`<ödev adı>`), örnekler uydurma adlarla.

## Nereden açılır

- Sağ üstteki zil ([Bildirim paneli](bildirim-paneli.md)).
- Telefon bildirimini açtıysan aynı metin telefonuna da düşer; başlığı "Eğitim Evi"dir ([Telefon bildirimi](telefon-bildirimi.md)).

## Adım adım

Aşağıdaki tablolarda "Basınca" sütunu bildirime basınca açılan sayfadır; "—" yazan bildirim düz satırdır (bir yere götürmez).

### Öğrenci — bugünkü site

| Ne olunca | Bildirim metni | Basınca |
|---|---|---|
| Öğretmen ödev verince | "Yeni ödev: `<ödev adı>` (`<ders>`)" — ör. "Yeni ödev: Sayfa 42 (Matematik)" | Ödevler |
| Ödevin adı, son günü/saati değişince ya da süren ödevde dosya yükleme açılınca | "Ödev güncellendi: `<ödev adı>`", tarih değiştiyse arkasına " (son gün 12.10 15:00)", dosya yükleme açıldıysa ". Artık ödeve dosya yükleyebilirsin." | Ödevler |
| Ödev sonuçlandırılınca | "Matematik dersinden "Oran orantı" ödevi açıklandı: Yaptı" | Ödevler |
| Sonuç sonradan değişince | "Matematik dersinden "Oran orantı" ödevi sonucu değişti: Geç yaptı" | Ödevler |
| Quizin sonucu sana açılınca (bir kez) | "Matematik dersinden "Oran orantı" quizinin sonucu açıklandı." | Ödevler |
| Sınav sonucun ilk girilince | "Matematik dersinden "2. Yazılı" sınavının sonucu açıklandı." (dersi olmayan sınavda baştaki "Matematik dersinden" kısmı yazmaz) | Sınavlarım |
| Yarın son günü olan ödevin varsa (08:00'den sonra, günde bir) | "Yarın Matematik dersinden "Kesirler" ödevin var (son saat 12:00)." / birden çoksa "Yarın 3 ödevin var: Matematik "Kesirler", Türkçe "Paragraf", Fen "Hücre"." (4'ten fazlasında "… ve 2 ödev daha") | Ödevler |
| Ders yoklamasında gelmedi, geç geldi ya da izinli işaretlenince | "Bugün 09:20 Matematik dersi: Gelmedi" / "…: Geç geldi" / "…: İzinli"; başka bir gün için "12.10.2026 09:20 Matematik dersi: Gelmedi" | Devamsızlığım |
| Etüt yoklamasında gelmedi ya da izinli işaretlenince | "Etüt: Matematik etüdü (12.10.2026) — gelmedi (izinsiz)" / "… — gelmedi (izinli)" | Etütlerim |
| Mesaj gelince | "`<gönderenin adı>`: `<konu>`" — ör. "Ayşe Kaya: Gezi izin formu" | Mesajlar |
| Duyuru gelince | "Duyuru: `<konu>`" | Mesajlar |
| Anket açılınca | "Anket: `<soru>`" | Anketler |
| Servis evine yaklaşınca (500 m ve 100 m) | "Servis evine yaklaşıyor (yaklaşık 500 m)." / "Servis evine 100 metreden yakın, hazırlan." | Servisim |
| Kendi kurduğun hatırlatıcının zamanı gelince | "Hatırlatma: `<başlık>` — `<açıklama>`" (açıklama yoksa yalnız başlık) | Hatırlatıcılar |
| Müdür seni sınıfa yerleştirince | "7-A sınıfına yerleştirildin." | — |
| Okul şifreni değiştirince | "Şifren okul yönetimi tarafından değiştirildi." | — |
| Okul giriş bilgilerini toplu yenileyince | "Giriş bilgilerin okul yönetimi tarafından yenilendi. Şifreni Ayarlar sayfasından değiştirebilirsin." | Ayarlar |
| Bir veli hesabına bağlanınca | "`<velinin adı>` veli olarak hesabına bağlandı." | — |
| Başka okula nakledilince | "Hesabın `<yeni okul>` okuluna taşındı. Önceki okulunun kayıtlarını eğitim yılı seçicisinden görebilirsin." | — (telefonda ana sayfa) |

Ödev sonuç adları: **Yaptı · Geç yaptı · Eksik · Yapmadı · Gelmedi (izinli) · Gelmedi (izinsiz)**
([Sonuçlandırma](../odev/sonuclandirma.md)).

### Veli — bugünkü site

- Çocuğuna giden bildirimlerin çoğu sana da gelir, başında çocuğun adı soyadıyla: "Elif Yılmaz · Yeni ödev: Sayfa 42 (Matematik)";
  iki çocuğuna aynı şey gittiyse tek bildirim: "Elif Yılmaz, Can Yılmaz · Yeni ödev: …". Basınca o çocuğun sayfası açılır. Hangi
  bildirimin kopyalandığı, hangisinin kopyalanmadığı: [Öğrencinin bildirimi veliye de](velinin-bildirimleri.md).
- Sana kendi metniyle gelenler:

| Ne olunca | Bildirim metni | Basınca |
|---|---|---|
| Çocuğun derste gelmedi, izinli ya da geç geldi işaretlenince | "Çocuğunuz Elif Yılmaz bugün saat 09:20 Matematik dersine gelmedi (izinsiz)." / "… gelmedi (izinli)." / "… geç geldi."; başka gün için "… 12.10.2026 saat 09:20 …" | Çocuklarım |
| Etüt yoklamasında gelmedi ya da izinli | "Elif Yılmaz — Etüt: Matematik etüdü (12.10.2026) — gelmedi (izinsiz)" | Etütler |
| Servisçi sabah "Bindi" işaretleyince | "Elif 07:42'de servise bindi." (yalnız ilk ad; saatin eki kendiliğinden: 'de, 'da, 'te, 'ta) | Servis (o çocuk) |
| Servis okula varınca (servisçi "Okula vardık") | "Elif 08:05'te okula vardı." | Servis |
| Akşam okulda servise binince ("Geldi") | "Elif 15:41'de okuldan servise bindi." | Servis |
| Eve bırakılınca ("İndi") | "Elif 17:10'da eve bırakıldı." | Servis |
| Sabah "Binmedi" / akşam "Gelmedi" işaretlenince | "Elif bu sabah servise binmedi." / "Elif akşam servise gelmedi." ("binmeyecek" dediysen gitmez) | Servis |
| Önce "Bindi" deyip sonra "Binmedi"ye çevrilince (bir kez) | "Düzeltme: Elif bu sabah servise binmedi." (akşam: "Düzeltme: Elif akşam servise gelmedi.") | Servis |
| Servis eve yaklaşınca | "Elif Yılmaz: servis evine yaklaşıyor (yaklaşık 500 m)." / "Elif Yılmaz: servis evine 100 metreden yakın, hazırlan." | Servis |
| Servisçi not yazınca | "Servisçiden not: `<not>`" | Servis |
| Okul seni bir öğrencinin velisi olarak bağlayınca | "`<okul>` seni Elif Yılmaz adlı öğrencinin velisi olarak ekledi." | Çocuklarım |
| Çocuğun başka okula nakledilince | "Elif Yılmaz `<yeni okul>` okuluna taşındı. Önceki okulunun kayıtları yıl seçicisinde." | Çocuklarım |
| Eğitim Evi Aile (telefon bağlandı, bağlantı kaldırıldı, süre sınırı geçildi) | Dört metin: [Aile bildirimleri](../aile/bildirimler.md) | Çocuğumun telefonu |

- Mesaj, duyuru ve anket velilere doğrudan gider (veli de alıcıdır): metin öğrencininkiyle aynıdır, başında çocuğun adı yoktur
  ("Ayşe Kaya: Gezi izin formu").

### Öğretmen (ve ek görevli çalışan) — bugünkü site

| Ne olunca | Bildirim metni | Basınca |
|---|---|---|
| Sabah, o gün dersin varsa (07:00–12:00 arası, günde bir) | "Bugün 4 dersin var: 09:20 7-A Matematik, 10:10 7-B Matematik, 11:00 8-A Matematik, 11:50 8-B Matematik." (4'ten fazlasında "… ve 2 ders daha") | Ders Programım |
| Müdür programa ders saatin ekleyince (günde bir) | "Ders programına yeni ders saatlerin eklendi. Programından bakabilirsin." | Ders Programım |
| Bir ders sana atanınca | "7-A · Matematik dersi sana atandı." | — |
| Bir etüt sana verilince | `"Matematik etüdü" etüdü sana verildi (Salı 15:40–16:20).` (etüdün adı tırnak içinde) | Etütler |
| Sana özel rol verilince | "Sana "Müdür Yardımcısı" rolü verildi. Menünde yeni bölümler görebilirsin." | — |
| Eski düzendeki öğretmenlik başvurun karara bağlanınca | "Öğretmenlik başvurun müdür tarafından onaylandı." / "Öğretmenlik başvurun reddedildi." | — |
| Okul seni kişi kodunla eklediğinde (yetişkin hesabına) | "`<okul>` seni öğretmen olarak ekledi. Sol üstteki menüden okuluna geçebilirsin." | — |
| Okul seni öğretmen listesinden çıkarınca (yetişkin hesabına) | "`<okul>` seni öğretmen listesinden çıkardı." | — |
| Okulun açtığı öğretmen hesabında şifren değişince | "Şifren okul yönetimi tarafından değiştirildi." | — |
| Mesaj, duyuru, anket, hatırlatıcı | Öğrencideki metinlerin aynısı | Mesajlar / Anketler / Hatırlatıcılar |

### Müdür — bugünkü site

| Ne olunca | Bildirim metni | Basınca |
|---|---|---|
| Bir öğretmen okuldan kendisi ayrılınca | "`<öğretmenin adı>` okulun öğretmen listesinden ayrıldı." | Öğretmenler |
| Bir öğrencin başka okula nakledilince | "Elif Yılmaz başka bir okula nakledildi. Okulunuzdaki kayıtları sizde kalır." | Öğrenciler |
| Okulun dosya alanı %80'e varınca (bir kez) | "Okulun dosya alanının %80'i doldu (4 GB / 5 GB). Teslim dosyaları son teslimden 7 gün sonra, ekler 7 gün sonra kendiliğinden silinir." | — |
| Dosya alanı dolunca (bir kez) | "Okulun dosya alanı doldu (5 GB). Yeni dosya yüklenemiyor; eski dosyalar silindikçe yer açılır. Gerekirse sistem yöneticisinden alan isteyebilirsin." | — |
| Sistem yöneticisi okulun adresini değiştirince | "Okulunun adresi sistem yöneticisi tarafından değiştirildi: /school/yeni-ad. Eski adres artık açılmıyor." | — |
| Yönetici seni bir okulun müdürü yapınca (yetişkin hesabına) | "`<okul>` okulunun müdürü olarak eklendin. Sol üstteki menüden okuluna geçebilirsin." | — |
| Mesaj, duyuru, anket, hatırlatıcı | Öğrencideki metinlerin aynısı | |

Okulda birden çok müdür varsa disk ve adres bildirimleri hepsine gider; öğretmen ayrılma ve nakil bildirimi bugün okulun tek bir
müdürüne gider (kod okumasına göre).

### Servisçi — bugünkü site

| Ne olunca | Bildirim metni | Basınca |
|---|---|---|
| Veli "binmeyecek" işaretleyince | "Elif Yılmaz yarın sabah ve akşam servise binmeyecek. Velinin notu: Dişçiye gidecek." (gün: "bugün", "yarın" ya da "12 Ekim"; dönem: "sabah", "akşam", "sabah ve akşam"; not yoksa yalnız ilk cümle) | Yoklama |
| Veli işareti kaldırınca | "Elif Yılmaz için 12 Ekim "binmeyecek" işareti kaldırıldı." | Yoklama |
| Mesaj (öğretmen ya da müdür yazınca), duyuru, hatırlatıcı | Öğrencideki metinlerin aynısı | Mesajlar / Hatırlatıcılar |

### Sistem yöneticisi — bugünkü site

| Ne olunca | Bildirim metni |
|---|---|
| Bir okulun dosya alanı %80'e varınca | "Test Ortaokulu: dosya alanının %80'i doldu (4 GB / 5 GB)." |
| Dosya alanı dolunca | "Test Ortaokulu: dosya alanı doldu (5 GB), yeni dosya yüklenemiyor. Sınırı Okullar sayfasından büyütebilirsin." |

### Tasarımda (Tasarım 1 önizlemesi ve tanımlar)

**Biçim.** Her bildirim iki satırdır: kalın **başlık** ve altında **ayrıntı**, en altta tür ve tarih
("Ödev · 1 Ekim 2026 Perşembe 10:12"). Kullanıcının kalıpları korunur: "`<Ders>` dersinden `<ödev>` açıklandı: Yaptı",
"Yarın `<ders>` dersinden `<ödev>` ödevi var". Örnekler (önizlemeden):

- Öğrenci:
  - "Ayşe Kaya mesaj gönderdi: Gezi izin formu" / ayrıntı: mesajın ilk cümlesi;
  - "İngilizce dersinden Meb homework açıklandı: Yaptı" / "Mert Can · teslim ettiğin 2 sayfa kontrol edildi";
  - **"Ders değişikliği: Cuma 4. ders Türkçe yerine Matematik"** / "Selin Arı izinli; 2 Ekim Cuma 11:00–11:40 dersini Ayşe Kaya
    alacak" (yeni);
  - **"Yarın Matematik etüdün var"** / "2 Ekim Cuma 15:30–16:10 · 204 nolu sınıf · Ayşe Kaya" (yeni);
  - "Yarın Matematik dersinden Kesirlerle toplama — alıştırma 3 ödevi var" / "son gün 1 Ekim Perşembe 23:00 · quiz 10 soru";
  - "Matematik dersinden yeni ödev: Kesirlerle toplama — alıştırma 3" / "Ayşe Kaya · son gün 1 Ekim Perşembe 23:00";
  - "Matematik 1. yazılı sonucu açıklandı: 82" / "Ayşe Kaya · 23 Eylül Çarşamba sınavı" (puanla);
  - etüde gelmeyince "Matematik etüdüne gelmedin" / "`<etüdün günü>` · 15:30 · gelmedi (izinsiz)" (yeni biçim).
- Veli: çocuğun her bildirimi kısa adla başlar ("Elif · …") ve sana göre çevrilir ("Sınav sonucun açıklandı" → "Sınav sonucu
  açıklandı", "etüdün var" → "etüdü var"); yoklama başlığı kısa, ayrıntısı tam cümle: "Elif bugün Matematik dersine gelmedi" /
  "Çocuğunuz Elif Yılmaz bugün saat 10:10 Matematik dersine gelmedi (izinsiz)."; yeni olarak **yoklama düzeltmeleri**:
  "Yoklama düzeltildi: çocuğunuz Elif Yılmaz bugün saat 10:10 Matematik dersine geldi." ve "Yoklama güncellendi: çocuğunuz … dersine
  gelmedi (izinli)." (etütte "Etüt yoklaması düzeltildi: …"); "Servis eve 100 m kaldı" / "Servis 3 · eve dönüş"; toplantı
  "7-A veli toplantısı" / "Cuma 15:30 · konferans salonu" ([Öğrencinin bildirimi veliye de](velinin-bildirimleri.md)).
- Öğretmen: **"3. ders 10 dakika sonra başlıyor"** / "7-A · Matematik · 10:10–10:50"
  ([Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md)); **"Kesirler ödevine 3 yeni teslim"** / "7-A · 18 / 28 teslim";
  **"Yoklama alınmadı"** / "7-A · 3. ders (10:10–10:50)"; "Zeynep Yılmaz mesaj gönderdi" / "Ödev hakkında"; "Fen zümre toplantısı"
  / "Cuma 15:30".
- Müdür: **"3 sınıfta yoklama alınmadı"** / "2. ders · 6-B, 7-C, 8-A"; **"Yeni öğretmen eklendi"** / "Selin Arı · Türkçe";
  **"Excel aktarımı tamamlandı"** / "42 öğrenci hesabı açıldı"; **"Okul diski %72 dolu"** / "ödev dosyaları en çok yer tutuyor".
- Servisçi: "Can yarın akşam servise binmeyecek" / "Zeynep Yılmaz bildirdi · 2 Ekim · eve dönüş"; "Müdürden mesaj" /
  "Pazartesi sabah seferi".
- Eğitmen: **"Videona bildirim geldi"** / "`<video>` · "ses kesiliyor"" ([Bildir](../egitim-icerikleri/bildir.md));
  **"Bir videon YouTube'dan kaldırılmış"** / "`<video>` · yarın silinecek"; tanımda "YouTube'da kaldırıldığı için Eğitim
  içeriklerinden de kaldırıldı" ([YouTube denetimi](../egitim-icerikleri/youtube-denetimi.md)).
- Öğrencinin dershane portalı: "Deneme 4 için kayıtlar açıldı", "Deneme 3 sonucu açıklandı: `<puan>`" / "7. sınıf B grubunda 4.
  (26 öğrenci)" ([Kurum adı](kurum-adi.md)).
- Toplantı (davetlilere): **"Toplantı başladı · `<toplantı adı>`"** / "`<açan>` açtı · Katıl"; tanımda hatırlatma 1 gün önce ve
  15 dakika önce, bağlantısı kalmayan toplantının sahibine "`<toplantı>` toplantısının bağlantısı yok — yeni bağlantı seç", uzaktan
  derste gelmeyene "Dersin uzaktan bağlantısı açık — Katıl" ([Hatırlatma ve silinme](../toplanti/hatirlatma-ve-silinme.md),
  [Görüşme başlat ve ping](../toplanti/gorusme-baslat-ve-ping.md)).
- Şikâyet etiketi (gönderene): **"Şikâyetin çözüldü olarak işaretlendi"** / ""`<konu>`" · `<yetkili>`: `<yanıt>`";
  **"Şikâyetine bir hafta içinde bakılmadı ve silindi"** / ""`<konu>`" · İstersen yeniden gönderebilirsin."
  ([Şikâyet etiketi](../mesaj/sikayet-etiketi.md)).
- Duyuru (3 Ekim kararı): okumayanlara yeniden "Okumadığın duyuru: …" ([Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md));
  "Önemli" etiketli mesaj ve duyuru öncelikli bildirim olur ([Önemli etiketi](../mesaj/onemli-etiketi.md)).
- Servis (3 Ekim kararı): sabah seferi bitince binmeyen ve "binmeyecek" denmemiş öğrencinin velisine "Elif bugün sabah servise
  binmedi (Servis 3, 07:52)", akşam "Can akşam servisine binmedi" (okul idaresine de bilgi); "Önemli" önceliğinde
  ([Servis yaklaşıyor bildirimi](../servis/yaklasma-bildirimi.md), [Servis](../servis/README.md)).
- Çalışan (çalışan tanımı): eklenince "`<okul>` okuluna çalışan olarak eklendin. Görevini okul yönetimi verecek."; görev verilince
  "Sana Öğretmen görevi verildi." ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).
- Yıl geçişi (tanım): müdüre 1–15 Eylül arası bir kez "Yeni eğitim yılını açmak ister misin?"; yeni yıl açılınca öğretmenlere ve
  velilere "2026-2027 eğitim yılı başladı" ([Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md)).
- Güvenlik (tanım): yeni bir cihazdan girişte e-posta ve bildirim ([Yeni cihaz uyarısı](../giris-hesap/yeni-cihaz-uyarisi.md)).
- Sınav planlama (tanım): sınavın tarihi değişince öğrenciye ve veliye bildirim, sınavdan 1 gün önce 19:00 hatırlatma
  ([Sınav planlama](../sinav/sinav-planlama.md)).
- Destek (tanım): destek ekibi talebine yanıt verince kullanıcıya bildirim ([Talep yazışması](../destek/talep-yazismasi.md)).
- Birden çok müdür (paneller tanımı, kullanıcı onayladı): müdüre giden her bildirim okulun bütün müdürlerine gider (bugün öğretmen
  ayrılma ve nakil bildirimi tek müdüre gidiyor); bir müdür atanınca yöneticiye ve okulun öbür müdürlerine bildirim; son müdür de
  kalmayınca okul "Müdürü yok" olur, yöneticiye ve desteğe bildirim.
- Sistem (tanım): giriş kodu e-postası gönderilemiyorsa yöneticiye bildirim (saatte en çok bir); e-posta Gmail'le gidiyorsa günde
  400'ü geçince yöneticiye bir kez "Gmail'in günlük gönderim sınırına yaklaşıldı (~500). Giriş kodları gitmeyebilir."
- Eğitim içerikleri (tanım): bir videoyu "Bildir"en kişiye, yönetici ya da destek karar verince sonuç bildirimi; kimin bildirdiği
  yükleyene söylenmez ([Bildir](../egitim-icerikleri/bildir.md)).

## Kurallar ve sınırlar

- **Uzunluk:** metin en çok 300 harf; fazlası kesilir. Düz metindir.
- **Aynı olay iki kez gitmez:**
  - ödev sonucu yalnız sonucu yeni verilen ya da değişen öğrenciye gider; öğretmen aynı ekranı yeniden kaydedince yeniden gitmez;
  - sınav sonucu yalnız değer ilk girildiğinde gider; düzeltmede gitmez;
  - ders ve etüt yoklamasında yalnız durumu değişen öğrenciye gider; "Geldi" işareti bildirim üretmez (gelmedi → geldi düzeltmesinde
    bugün bildirim gitmez; tasarımda "Yoklama düzeltildi" gider);
  - programa ders saati eklenince öğretmene günde bir; quiz sonucu her öğrenciye bir kez; yaklaşma bildirimi her seferde öğrenci başına
    eşik başına bir kez; servis olayları (bindi, okula vardı, eve bırakıldı, binmedi, düzeltme) günde birer kez; dosya alanı her
    seviyede (80, 100) bir kez; Aile sınırı günde bir kez.
- **Servis bildirimleri yalnız veliye:** bindi, okula vardı, eve bırakıldı, binmedi, servisçinin notu öğrenciye gitmez. Yaklaşma
  bildirimi öğrenciye de gider. Yaklaşma bildirimi GPS doğruluğu 150 metreden kötüyse gitmez.
- **Kimin bildirimi:** okul rolündeki bildirim o rolün kendisine yazılır (öğretmen portalındaki öğretmen); "okul seni ekledi" gibi
  hesap bildirimleri yetişkin hesabının kendisine.
- **Telefona:** her bildirim yazıldığı anda telefon bildirimini açmış kişiye de gider; kişi başına dakikada en çok 20 telefon
  bildirimi (fazlası yalnız zile düşer) ([Telefon bildirimi](telefon-bildirimi.md)).
- **Saat:** zamanlı bildirimler sunucunun saatine göre (Türkiye saati) çalışır ([Otomatik bildirimler](otomatik-bildirimler.md)).
- **Kod okumasına göre bir açık:** sınav sonucunun "ilk kez" işareti 30 gün saklanır; ilk girişten 30 günden uzun süre sonra bir
  değer düzeltilirse "sonucu açıklandı" bildirimi yeniden gidebilir.
- **Velinin kopyasında ikinci kişi:** öğrenciye "sen" diye yazılmış bazı hesap bildirimleri veliye aynen kopyalanır
  ("Elif Yılmaz · Şifren okul yönetimi tarafından değiştirildi.", "Elif Yılmaz · 7-A sınıfına yerleştirildin.") (kod okumasına göre;
  tasarımda metin üçüncü kişiye çevrilir).

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim paneli](bildirim-paneli.md) · [Otomatik bildirimler](otomatik-bildirimler.md) ·
[Öğrencinin bildirimi veliye de](velinin-bildirimleri.md) · [Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md) ·
[Bildirim sekmeleri](sekmeler.md) · [Kurum adı](kurum-adi.md) · [Telefon bildirimi](telefon-bildirimi.md).

**İlgili:** [Ödev verme](../odev/odev-verme.md) · [Sonuçlandırma](../odev/sonuclandirma.md) ·
[Ödev hatırlatmaları](../odev/hatirlatmalar.md) · [Quiz sonuçları](../quiz/sonuclar.md) · [Not girişi](../sinav/not-girisi.md) ·
["Gelmedi" bildirimi](../devamsizlik/devamsizlik-bildirimi.md) · [Etüt yoklaması](../etut/etut-yoklamasi.md) ·
[Mesajlar](../mesaj/README.md) · [Anket açma](../anket/anket-acma.md) · [Servis yaklaşıyor](../servis/yaklasma-bildirimi.md) ·
[Servisçinin notu](../servis/gunluk-not.md) · [Binmeyecek](../servis/binmeyecek.md) ·
[Hatırlatma bildirimi](../hatirlatici/hatirlatma-bildirimi.md) · [Aile bildirimleri](../aile/bildirimler.md) ·
[Dosya alanı uyarıları](../okul-disk/uyarilar.md) · [Öğrenci nakli](../hesaplar/ogrenci-nakli.md) ·
[Kişi koduyla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md) · [Rol atama](../ogretmenler-calisanlar/rol-atama.md).

## Kod tarafı

- Bildirimi yazan ortak katman: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — `bildir`, `topluBildir`,
  `cokluBildir`, `yoneticilereBildir` (300 harf, veli kopyası, `ilkKezOlanlar`); [sunucu/veri/index.md](../../sunucu/veri/index.md).
- Metinlerin yazıldığı yerler: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (yeni ödev, güncellendi, sonuç),
  [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`sonuclariBildir`), [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md),
  [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) (`yoklamaMetni`, `devamsizlikBildir`),
  [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md), [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md),
  [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md), [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md),
  [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) (sabah özeti, yarın ödev), [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md)
  (servis), [sunucu/yardimci/servis-pencere.md](../../sunucu/yardimci/servis-pencere.md) (`ilkAd`, `saatEki`),
  [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md), [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md),
  [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md), [sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md),
  [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md), [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md),
  [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md), [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md),
  [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md); [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`dersEtiketi`, gün adları).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (tekrar gitmeme, veli kopyası).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Otomatik bildirimler", "Öğrencinin bildirimi veliye de
  gider", "Servis yoklaması").
- Tasarım: Tasarım 1 önizlemesi (herkes-a, öğrenci-veli, öğretmen, müdür, servisçi, eğitmen paketlerinin bildirim örnekleri).

## Sık sorulanlar

- **Velisiyim, mesaj bildiriminde çocuğumun adı yazmıyor.** Mesaj ve duyurular sana doğrudan gider (sen de alıcısın); çocuğun adı
  yalnız kopyalanan bildirimlerin başına yazılır.
- **Öğretmen notu düzeltti, yeni bildirim gelmedi.** Sınav sonucu bildirimi yalnız ilk girişte gider.
- **Yoklamada "Gelmedi" yanlıştı, "Geldi" yapıldı; düzeltme bildirimi gelmedi.** Bugün "Geldi" bildirim üretmez; tasarımda
  "Yoklama düzeltildi" bildirimi gelir.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu (iş 8):
  bildirimlere tür; sınav ve ödev hatırlatmaları; duyurudan hatırlatıcı.
- Mesaj etiketleri (iş 28) ve 3 Ekim kararı: şikâyet, "Önemli", okumayanlara hatırlatma bildirimleri.
- Toplantılar (iş 21): toplantı ve uzaktan ders bildirimleri.
- Çalışan olarak ekleme (iş 2), Yıl geçişi (iş 9), Sistem (iş 4: yeni cihaz uyarısı), Eğitim içerikleri (iş 17), Destek (iş 6):
  kendi bildirimleri.
- Çok dil (iş 22): bildirim metinleri alıcının diliyle.
