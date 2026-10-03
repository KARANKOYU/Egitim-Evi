# Etütler · Etüdü düzenleme ve silme

**Durum:** Kodda var

Var olan bir etüdün gününü, saatini, yerini, adını ya da öğretmenini değiştirdiğin "Düzenle" penceresi ve etüdü bütün yoklamalarıyla
kaldıran "Sil" düğmesi.

## Ne işe yarar

Okulda etütler dönem içinde değişir: Salı etüdü Perşembe'ye alınır, öğretmen değişir, kütüphane doluysa yer değişir, dönem bitince
etüt kalkar. "Düzenle" etüdü yeniden açmadan değiştirir; öğrenci listesi ve geçmiş yoklamalar yerinde kalır. "Sil" ise etüdü, öğrenci
listesini ve **bütün yoklamalarını** siler; geri alınamaz.

## Nereden açılır

[Etütler sayfası](etutler-sayfasi.md) → etüdün satırındaki **"Düzenle"** (gri) ve **"Sil"** (kırmızı). İkisi de yalnız etüt düzenleme
yetkisi olana çıkar (müdür her zaman; rolünde "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" olan kişi).
"Düzenle"nin penceresinin başlığı **"Etüdü düzenle"**.

Tasarımda (Tasarım 1 önizlemesi): satırlarda "Düzenle" ve "Sil" yok; satıra basınca [etüt ayrıntısı](etut-ayrintisi.md) açılır ve
orada yalnız "Etüt yoklaması" düğmesi vardır (önizlemenin eski bir hâlinde ayrıntıda "Etüt planla" penceresini açan bir "Düzenle"
vardı; 3 Ekim'deki son hâlde kalktı). Kullanıcı bu iki düğme için bir şey söylemedi; 2 Ekim'de doğruladığı kurala göre üzerine yorum
yapmadığı ekranlar bugünkü site gibi kalır.

## Adım adım

### Müdür — düzenleme

1. Menüden "Okul Düzeni" → **"Etütler"** → etüdün satırında **"Düzenle"**.
2. Açılan **"Etüdü düzenle"** penceresi [Etüt açma](etut-acma.md)daki pencerenin aynısıdır, alanlar etüdün bugünkü değerleriyle dolu
   gelir: **"Adı"**, **"Gün"**, **"Yer (isteğe bağlı)"**, **"Başlangıç"**, **"Bitiş"**, **"Öğretmeni"** ("— sonra seçerim —" ya da
   seçili öğretmen) ve ipucu "Etüdün öğretmeni kendi etüdünde, etüt günü yoklama alır."
3. Değiştireceğin alanı değiştir.
4. **"Kaydet"**e bas. Düğme "Kaydediliyor..." olur; bitince pencere kapanır, liste yeniden çizilir ve üstte yeşil **"Etüt
   kaydedildi."** çıkar (6 saniye sonra kaybolur). Gün ya da saat değiştiyse satır listede yeni yerine geçer (liste gün, saat, ad
   sırasıyla).
5. Öğretmeni **başka birine** değiştirdiysen yeni öğretmene bildirim gider: `"8. sınıf Matematik etüdü" etüdü sana verildi (Perşembe
   15:40–16:20).` ([Etüt bildirimleri](etut-bildirimleri.md)). Eski öğretmene haber gitmez; bütün etütleri görme yetkisi yoksa etüt
   onun listesinden düşer.
6. Hata olursa pencere açık kalır: alanın altında kırmızı (ör. "Bitiş başlangıçtan sonra olmalı.") ya da pencerenin altında kırmızı
   sunucu iletisi (ör. "Bir etüt 6 saatten uzun olamaz."). Kurallar [Etüt açma](etut-acma.md)dakiyle aynı.
7. **"Vazgeç"** hiçbir şeyi değiştirmez.

### Müdür — silme

1. Etüdün satırında kırmızı **"Sil"**e bas.
2. Tarayıcının onay kutusu çıkar: **"8. sınıf Matematik etüdü silinsin mi? Yoklamaları da silinir."**
3. **"Tamam"** dersen düğme kilitlenir; etüt silinir, liste yeniden çizilir ve üstte yeşil **""8. sınıf Matematik etüdü" etüdü silindi;
   yoklamaları da silindi."** çıkar. **"İptal"** hiçbir şey yapmaz.
4. Bir sorun olursa (ör. etüdü bu arada başkası sildiyse) tarayıcının uyarı kutusunda ileti çıkar (**"Etüt bulunamadı"**) ve düğme
   yeniden açılır.

### Öğretmen

Müdür sana "Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler" yetkisini verdiyse adımlar müdürünkiyle aynı. Yetkin
yoksa "Düzenle" ve "Sil" çıkmaz; etüdün öğretmeni olsan da saatini değiştiremezsin.

Öğretmeni olduğun etüt başka birine verilirse etüt senin "Etütler" listenden düşer (bütün etütleri görme yetkin yoksa); bildirim
gelmez.

### Çalışan

Bugün kodda: etüt sorumlusu ve müdür yardımcısı öğretmen hesabındaki ek rolüyle düzenler ve siler; nöbetçi öğretmen ("Bütün etütlerde
yoklama alır") düzenleyemez. Tasarımda (çalışan tanımı) özel rolünde etüt yetkisi olan çalışan öğretmen olmasa da düzenler.

### Öğrenci ve veli

Bir şey yapmaz. Düzenlenen etüt [Etütlerim](etutlerim.md)'de yeni gün, saat ve yerle görünür; silinen etüt kalkar. Bugün iki
durumda da bildirim gitmez.

## Kurallar ve sınırlar

- **Kim:** yalnız etüt düzenleme yetkisi olan. Yetkisiz istek **"Etüt düzenleme yetkin yok"**; başka okulun etüdü
  **"Etüt bulunamadı"**.
- **Düzenleme kuralları** açmadakiyle aynı: ad 1–80 harf, gün Pazartesi–Pazar, saat SS:DD, bitiş başlangıçtan sonra ve en çok 6 saat,
  yer en çok 60 harf, öğretmen okulun onaylı öğretmeni ya da müdürü ("Seçilen öğretmen bu okulda değil.").
- **Pencere listedeki bilgiyle açılır:** "Düzenle" sunucudan yeniden okumaz, son yüklenen listenin değerlerini koyar. Bu arada başka biri
  etüdü değiştirdiyse önce üst şeritteki **"Yenile"**ye bas; yoksa kaydettiğin değerler onunkinin üstüne yazılır.
- **Öğrenci listesi ve yoklamalar düzenlemede korunur.** Gün değişirse eski günlerin yoklamaları eski tarihleriyle kalır ve öğrencinin
  dökümünde görünür; ama yoklama sayfası yalnız yeni günün tarihlerini açtığından eski günlerin kaydı artık açılıp düzeltilemez
  (elle istenirse sunucu "Bu etüt Perşembe günleri yapılıyor; seçilen gün Salı." der).
- **Bildirim:** yalnız öğretmen yeni bir kişiyle değiştiğinde yeni öğretmene gider. Gün, saat, yer ya da ad değişince ne öğretmene ne
  öğrenciye ne veliye bildirim gider; değişikliği öğrencilere mesajla duyurman gerekir.
- **Silme geri alınamaz:** etüt, öğrenci listesi ve o etüdün **bütün yoklamaları** silinir; öğrencilerin "Etütlerim"indeki o etüde ait
  "Gelmediği günler" de gider. Sunucu onaysız silme isteğini reddeder: **"Silmeyi onaylaman gerekiyor."**
- **Silinen etüt bildirilmez:** öğretmene, öğrenciye ve veliye bildirim gitmez.
- **İşlem kaydı:** düzenlemede **"Etüt değiştirildi"**, silmede **"Etüt silindi"** ve etüdün adı
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Aday listesi oturum boyunca saklanır:** "Öğretmeni" listesi ilk açılıştaki hâliyle kalır; yeni gelen öğretmen için tarayıcıyı yenile.
- **Eğitim yılı:** etütler yıla bağlı değil; geçmiş yıla bakarken de düzenlenir ve silinir.
- **Bölüm kapalıysa** düzenleme ve silme olmaz: **"Etütler bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."** Kapatmak
  etütleri silmez.
- **Öğretmen okuldan çıkarılırsa** ya da hesabı silinirse etüt kalır, öğretmeni boşalır ("Öğretmen seçilmedi"); "Düzenle"den yeni
  öğretmen seçersin.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etütler sayfası](etutler-sayfasi.md) — "Düzenle" ve "Sil" düğmelerinin yeri.
- [Etüt açma](etut-acma.md) — aynı pencerenin "Yeni etüt" hâli ve alan kuralları.
- [Etüdün öğrencilerini seçme](ogrenci-secme.md) — öğrenci listesi ayrı pencerede değişir.
- [Etüt yoklaması](etut-yoklamasi.md) — gün değişince eski günlerin yoklaması.
- [Etüt bildirimleri](etut-bildirimleri.md) — "… etüdü sana verildi".
- [Etüt yetkileri ve hazır roller](etut-yetkileri.md), [Etütlerim](etutlerim.md), [Etüt ayrıntısı](etut-ayrintisi.md).

**İlgili:**

- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Etüt değiştirildi", "Etüt silindi".
- [Yeni mesaj ve alıcı seçimi](../mesaj/yeni-mesaj.md) — saat değişikliğini öğrencilere duyurmak için.
- [Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md) — öğretmeni çıkarılan etüt.
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `EYLEMLER['etut-duzenle']` (`etutModal(etutBul(id))`:
  "Etüdü düzenle", değerler `ETUT.liste`'den), `EYLEMLER['etut-kaydet']` (`data-id` doluysa düzenleme), `EYLEMLER['etut-sil']`
  (`confirm`, `POST /api/etut/sil { id, onay: true }`, hata `hataGoster` → uyarı kutusu).
- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — `POST /api/etut/kaydet` `id` ile (`depo.etutler.guncelle`, işlem
  kaydı `etut.degistirildi`, öğretmen değiştiyse yeni öğretmene bildirim), `POST /api/etut/sil` (`onay === true` şartı, işlem kaydı
  `etut.silindi`, ileti `"<ad>" etüdü silindi; yoklamaları da silindi.`).
- Depo ve tablolar: [sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md) — `guncelle`, `sil`; `etut_ogrencileri` ve
  `etut_yoklamalari` etüde `ON DELETE CASCADE` ile bağlı ([SEMA.md](../../sunucu/veri/sema/SEMA.md), şema 013).
- İşlem kaydı adları: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`'etut.degistirildi': 'Etüt
  değiştirildi'`, `'etut.silindi': 'Etüt silindi'`).
- Testler: [testler/test-etut.md](../../testler/test-etut.md) (yetkisiz ve onaysız silme reddi),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (`etut-duzenle`, `etut-sil`).

## Sık sorulanlar

- **Etüdün saatini değiştirdim; öğrencilere haber gitti mi?** Hayır. Bugün yalnız öğretmen değişince yeni öğretmene bildirim gider.
  Öğrencilere ve velilere mesajla duyur.
- **Etüdü silmeden bir süre durdurabilir miyim?** Ayrı bir "durdur" yok. Öğrenci listesini boşaltabilir ya da öğretmeni "— sonra
  seçerim —" yapabilirsin; geçmiş yoklamalar kalır. Silersen yoklamalar da gider.
- **Yanlışlıkla sildim, geri gelir mi?** Hayır; etüt ve yoklamaları kalıcı olarak silinir. Etüdü yeniden açıp öğrencilerini yeniden
  seçmen gerekir; eski yoklamalar dönmez.
- **Etüdün gününü değiştirdim, eski yoklamalar ne oldu?** Kayıtlı kalır ve öğrencinin dökümünde görünür; etüdün yoklama sayfası artık
  yeni güne göre açılır.
- **Düzenle'yi açtım, değerler eski görünüyor.** Liste en son yüklendiği hâlde; "Yenile"ye basıp yeniden aç.

## Sırada

- Etüt planlama (öneri, 29 Eylül): planlama penceresinde haftalık ya da tek seferlik etüt; etüt ajandaya girdiği için düzenleme
  ajandaya da yansıyacak. Tanımdaki "öğretmene ve öğrenciye/veliye bildirim" yeni etüt içindir; etüdün günü, saati ya da yeri
  değişince bildirim gidip gitmeyeceği tanımda ve önizlemede yok, kodlanırken kararlaşacak.
- Yıl geçişi: yeni yıl sihirbazında etütler "geçen yıldan kopyala" ya da "sıfırdan başla" seçeneğiyle taşınacak.
- Çok dil: onay ve ileti metinleri çeviri kataloğuna girecek.
