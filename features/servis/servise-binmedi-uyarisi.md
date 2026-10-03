# Servis · "Bugün servise binmedi" uyarısı

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 3 Ekim kararı; kodu Linux yapacak, Tasarım 1 önizlemesine belgeler bitince eklenecek).

Sefer bitince servisin listesinde olup binmeyen ve velisi "binmeyecek" bildirmemiş öğrencinin velisine giden, "Önemli" öncelikli uyarı.

## Ne işe yarar

Veli çocuğunu servise bindirdiğini sanıyor ama çocuk binmemişse bunu hemen öğrenmeli. 3 Ekim'de kullanıcıya yedi fikir önerildi;
üçüncüsü buydu. Kullanıcı "2 3 5 6 eğer önemli tag ı sçeilirse 7 gibi işlesin" diyerek seçti (7. fikir ayrı bir "acil duyuru"ydu;
onun yerine "Önemli" etiketi acil duyuru gibi işleyecek): bu uyarı yapılacak ve "Önemli" önceliğiyle gidecek
([Önemli etiketi](../mesaj/onemli-etiketi.md)).

Bugünkü "Zeynep bu sabah servise binmedi." bildiriminden farkı: bugün bu bildirim yalnız servisçi "Binmedi"ye basarsa gider; servisçi
öğrenciyi hiç işaretlemeden "Okula vardık" derse veliye bir şey gitmez. Uyarı bu boşluğu kapatır ve öncelikli gider.

## Nereden açılır

Ayrı bir ekranı yok; bildirim olarak gelir. Velide "Önemli" önceliğiyle: telefonda ayrı bildirim kanalı ("Önemli duyurular", sesli),
sitede ve uygulamada öncelikli gösterim. Dokununca çocuğun servis sayfası açılır (öneri: bugünkü servis bildirimleri gibi
`#/servis?c=<çocuk>`).

## Adım adım

### Veli (tasarım)

1. **Sabah:** servisçi "Okula vardık" deyip sabah seferini bitirince, çocuğun o seferin listesindeyse ve
   - "Bindi" işaretlenmediyse (işaretsiz kaldıysa), ya da
   - servisçi "Binmedi" işaretlediyse (tanımda "Gelmedi" yazıyor; sabah yoklamasındaki düğmenin adı "Binmedi"dir),
   ve sen o gün için "binmeyecek" bildirmediysen hemen uyarı gelir. Tanımdaki örnek metin: "Elif bugün sabah servise binmedi (Servis 3,
   07:52)".
2. **Akşam:** servis okuldan çıkarken ("Başlat") çocuğun listede olup binmediyse (ve "binmeyecek" bildirilmediyse) uyarı gelir. Tanımdaki
   örnek metin: "Can akşam servisine binmedi".
3. Uyarı "Önemli" önceliğinde: telefonda "Önemli duyurular" kanalından sesli bildirim, sitede öncelikli.

### Okul idaresi (servis sorumlusu) (tasarım)

Akşam seferinde binmeyen öğrenci için okul idaresine (servis sorumlusu) de bilgi gider (tanım). Sabah için okul idaresine bilgi tanımda
yazmıyor.

### Servisçi (tasarım)

Ayrı bir şey yapmaz: uyarıyı "Okula vardık" (sabah) ve "Başlat" (akşam; tanımdaki "okuldan çıkarken" bugünkü ekranda "Başlat"a denk
gelir) adımları tetikler. "Binmedi" / "Gelmedi" işaretlemek ya da
işaretsiz bırakmak uyarının gidişini değiştirmez; velinin "binmeyecek" işareti varsa gitmez.

## Kurallar ve sınırlar

Karara bağlananlar (3 Ekim, tanım):

- **Sabah:** "Okula vardık"la sefer bitince; sefer listesinde olup "Bindi" işaretlenmemiş VE o gün için "binmeyecek" bildirilmemiş her
  öğrencinin velisine hemen; servisçi "Gelmedi" işaretlediyse de aynı bildirim (tanımın sözü; sabah yoklamasında bu düğme "Binmedi").
- **Akşam:** okuldan çıkarken listede olup binmeyen (ve "binmeyecek" bildirilmemiş) öğrencinin velisine "… akşam servisine binmedi" ve okul
  idaresine (servis sorumlusu) bilgi.
- **Öncelik:** "Önemli" önceliğinde ([Önemli etiketi](../mesaj/onemli-etiketi.md)).
- **"Binmeyecek" bildirilmişse gitmez** ([Binmeyecek](binmeyecek.md)).

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı; öneriler):

- **Bugünkü "Binmedi" / "Gelmedi" bildirimiyle ilişkisi:** servisçi "Binmedi"ye bastığında veli bugün zaten "Zeynep bu sabah servise
  binmedi." alıyor; sefer bitince ikinci bir uyarı gitmesi çift bildirim olur. Öneri: aynı öğrenci için tek uyarı — "Binmedi" bildirimi
  gittiyse uyarı onu "Önemli" önceliğe yükselterek tekrarlamasın; yalnız işaretsiz kalanlar için yeni uyarı gitsin.
- **Akşam "Başlat" anında** "Gelmedi" ile işaretsiz öğrenci ayrımı: işaretsiz öğrenci de "binmedi" sayılır mı? (Tanımın sözü: "listede olup
  binmeyen".)
- **"Okula vardık"a hiç basılmazsa** (sefer saatle kapanırsa) sabah uyarısının gidip gitmeyeceği.
- **Metin:** örneklerdeki servis adı ve saat (sabah "(Servis 3, 07:52)") hangi an — seferin bittiği an mı? Bugünkü bildirimlerdeki gibi
  yalnız ilk ad ve okunuşa göre saat eki kullanılmalı.
- **Okul idaresi** kimdir: müdür ve `servis.yonet` yetkilileri mi, yalnız "Servis Sorumlusu" rolündekiler mi?
- **Tekrar yok:** bugünkü servis bildirimleri gibi her (tarih, dönem, öğrenci) için bir kez (olay tablosuna yeni olay türü).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Sabah seferi](sabah-seferi.md) — "Okula vardık".
- [Akşam seferi](aksam-seferi.md) — "Başlat".
- [Binmeyecek](binmeyecek.md) — uyarıyı durduran işaret.
- [Servis bildirimleri](servis-bildirimleri.md) — bugünkü bildirimler.
- [Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md) — okul idaresinin baktığı yer.

**İlgili:**

- [Önemli etiketi](../mesaj/onemli-etiketi.md) — öncelikli bildirim, "Önemli duyurular" kanalı.
- [Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md) — aynı 3 Ekim kararının öbür maddesi.
- [Devamsızlık bildirimi](../devamsizlik/devamsizlik-bildirimi.md) — derse gelmeyen öğrenci için benzer bildirim.
- [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunulacak yerler (tahmin): [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md)
(`okula-vardik`, `sefer-basla`, `yoklamaBildir`), [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md)
(`servis_olaylari`), öncelikli bildirim için [sunucu/push.md](../../sunucu/push.md) ve Android uygulamasının bildirim kanalları;
test [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md).

## Sık sorulanlar

- **Çocuğum bugün servise binmeyecek; yine de uyarı gelir mi?** "Binmeyecek" işaretini koyduysan gelmez.
- **Servisçi çocuğu işaretlemeyi unuttu, uyarı yanlış mı gelir?** Uyarı "Bindi" işaretlenmemiş öğrenci için gider; servisçi "Okula
  vardık"tan önce işaretleri tamamlamalı ("Okula vardık" işaretlenmemiş öğrenci sayısını sorar).
- **Uyarı neden sesli geliyor?** "Önemli" önceliğinde gider; telefonda ayrı, sesli bildirim kanalıdır.

## Sırada

- Linux kodlaması: uyarının sunucu tarafı, "Önemli" öncelikli gönderim ve Android'deki "Önemli duyurular" kanalı.
- Tasarım 1 önizlemesine ekleme (belgeler bittikten sonraki HTML işi).
- Yukarıdaki açık soruların kullanıcıya sorulması (çift bildirim, okul idaresinin kim olduğu).
