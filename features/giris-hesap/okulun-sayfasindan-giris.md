# Giriş ve hesap · Okulun sayfasından giriş

**Durum:** Kodda var; tasarımda ek olarak okulun sayfasından girince portal seçme ekranı çıkmadan o okuldaki portala geçiş ("Portallarıma dön" ile dönüş), Türkçe `/okul/<okul>` eş adresi ve tahta hesabının buradan girişi.

Her okulun kendi adresi (`egitimevi.org/school/<okulun-adı>`): okulun tanıtım sayfasının altındaki giriş kartı, kullanıcı adını o okulun içinde arar; `/login`'deki "okulunu seç" araması öğrenciyi ve servisçiyi buraya götürür.

## Ne işe yarar

Okulun açtığı hesaplarda (öğrenci, servisçi) kullanıcı adı bugün yalnız **okul içinde** tektir: iki okulda aynı ad olabilir,
çoğu zaman da ad kişinin T.C. numarasıdır. Bu yüzden öğrenci ve servisçi okulunun sayfasından girer; giriş o okulun içinde
aranır, T.C. numarasıyla giriş de yalnız orada çalışır. Okul bu adresi öğrencilere dağıtabilir; `/login` sayfasında da okulun
adıyla aranıp seçilir, son girilen okul bu tarayıcıda hatırlanır.

Kullanıcının sözleri: 26 Eylül "okul araması mükemmel düzeyde iyi olsun", yazım hatasıyla yazınca da doğru okulları bulsun;
29 Eylül "bir okulun /school'undan giderse oturum ekranı çıkmadan o okuldaki oturumuna (öğretmen vb. neyse) aktarılır, ama sonra
sol üstteki oturum sekmesine 'dön' ile döner".

## Nereden açılır

- Doğrudan adres: `egitimevi.org/school/<okulun-adı>` (ör. `egitimevi.org/school/test-ortaokulu`).
- `/login` sayfasında kartın altındaki **"Öğrenci ya da servisçiysen önce okulunu seç"** araması → okula basınca.
- `/login`'de **"Son girdiğin okul · <okulun adı> · Seç"** satırı.
- Girişteki "Bu kullanıcı adı birden çok okulda var…" iletisinin yanındaki **"Okulunu bul"** ([Giriş](giris.md)).
- Okul sayfasında kartın altındaki **"Başka bir okul seç"** `/login`'e geri götürür, arama kutusuna odaklanır.

Okulun adresini (3–40 karakter; Türkçe harfsiz küçük harf, rakam ve tire; tireyle başlayıp bitemez, iki tire yan yana olamaz;
`login`, `admin`, `giris` gibi sitenin kendi sayfa adları olamaz) okulu açarken yönetici verir, müdür "Okul Adresi ve Konumu"
sayfasından değiştirir ([Okulun sayfa adresi](../okul-sayfasi/sayfa-adresi.md)).

## Adım adım

### Ekranın düzeni (bugünkü site)

1. Üstte sitenin şeridi, en altta alt bilgi (açılış sayfasındakiyle aynı).
2. Okul kendi sayfasını düzenlediyse kartın üstünde okulun sayfası: kapak, logo, okulun adı, tanıtım yazısı, galeri
   ([Tanıtım ve fotoğraflar](../okul-sayfasi/tanitim-ve-fotograflar.md)).
3. Okulun sayfası yoksa kartın en üstünde okul simgesi, okulun adı ve altında "ilçe, il".
4. Kart: giriş kartının aynısı ([Giriş](giris.md)); "Kullanıcı adı" seçiliyken ipucu "Okulun verdiği kullanıcı adı; çoğu zaman
   T.C. kimlik numaran."; altta "Şifremi unuttum" ve **"Başka bir okul seç"**. Okulu seçme araması bu sayfada görünmez.
5. Tarayıcı sekmesinin başlığı "<okulun adı> — Eğitim Evi".

### Öğrenci ve servisçi

1. `/login`'e git. Kartın altındaki kutuya okulunun adını, ilini ya da ilçesini yaz (en az 2 harf).
2. Yazmayı bıraktıktan çeyrek saniye sonra "Aranıyor..." çıkar, sonra liste: her satırda okulun adı (yazdığın kelimelerin tuttuğu
   yer koyu) ve altında "ilçe, il".
   - Yazım hatasını sunucu düzeltirse üstte: '"<yazdığın>" yerine **"<düzeltme>"** diye aradık.'
   - Kelimelerin hepsini içeren okul yoksa: "Yazdığın kelimelerin hepsini içeren okul yok. En yakın sonuçlar:"
   - Hiç yoksa: "Bu adla Eğitim Evi'nde bir okul yok. Okulun henüz eklenmemiş olabilir; okul yönetimine sor."
3. Okuluna bas (Enter'a basarsan ilk sonuca gidilir). Okulun sayfası açılır.
4. Okulun verdiği kullanıcı adını ya da T.C. numaranı ve şifreni yaz, **"Giriş Yap"**. Öğrencide kod sorulmaz; servisçide yalnız
   e-postası varsa sorulur ([İki adımlı giriş](iki-adimli-giris.md)).
5. Bir dahaki sefere `/login`'de "Son girdiğin okul · <okulun adı> · Seç" satırına basman yeter.
6. Hesabın yoksa "Bu okulda bu kullanıcı adıyla bir hesap yok." yazar; yanında "Kayıt ol" kısa yolu **çıkmaz** (öğrenci
   hesabını okul açar).

### Veli, öğretmen, çalışan ve müdür

Okulun sayfasından da girebilirsin: e-postanla ya da kullanıcı adınla. Kullanıcı adın o okulun hesaplarında yoksa yetişkin
hesabın bulunur; okulda aynı adla bir öğrenci olsa bile şifren yetişkin hesabında da denenir. Bugün girişten sonra nereye
düşeceğin `/login`'dekiyle aynıdır (tek portal → o portal; birden çok portal → hesabının ana sayfası)
([Giriş](giris.md)).

Tasarımda (kullanıcının 29 Eylül kararı ve Tasarım 1 önizlemesi):

1. Okulun sayfasından girince **portal seçme ekranı çıkmaz**: o okuldaki portalına (öğretmen, müdür, öğrenci… neyse) doğrudan
   geçersin. Kısa bildirim: "<Okulun adı> · <portal> portalına geçildi."
2. O okulda portalın yoksa hesabının ana sayfası açılır: "Bu okulda portalın yok; hesabının ana sayfası açıldı." (tanımda: "Bu
   okulda bir portalın yok" + Portallarım).
3. Üst şeritte logonun yanında **"Portallarıma dön"** düğmesi (geri oku simgesiyle) çıkar; basınca portallarının listesi açılır
   ([Portallarım](../portallar/portallarim.md)). Başka bir portala geçince düğme kaybolur.
4. Kartın üstündeki okul satırında adın altında "ilçe, il · egitimevi.org/school/<kısa ad>" yazar.
5. "Bu cihazdaki oturumların" listesinde yalnız o okulda portalı olan hesaplar görünür ([Beni hatırla](beni-hatirla.md)).

### Tahta

Tasarlandı — henüz kodda yok. Akıllı tahta yalnız okulun sayfasından girer: "Kullanıcı adı" seçili, `tahta.` ile başlayan ad ve
müdürün koyduğu şifre. Genel `/login`'den girilemez ("Tahta hesapları okulun sayfasından girer"). Tahta adı okul içinde tektir
([Tahta girişi](../tahta/tahta-girisi.md)).

### Ziyaretçi

Okulun adresini açınca okulun tanıtım sayfasını görürsün; sayfa herkese açıktır. Adres yanlışsa ya da okulun adresi değiştiyse
"Okul bulunamadı" sayfası gelir ([Bulunamadı sayfaları](../acilis-sayfasi/bulunamadi-sayfalari.md)).

Tasarımda (Tasarım 1 önizlemesi), `/login`'deki arama:

- Yazdıkça sonuç: üstte "N okul bulundu" ya da (yalnız yakın eşleşmeler varsa) "Yazdığına en yakın N okul"; en çok 8 okul; her
  satırda okulun adı (tutan kelimeler koyu) ve "ilçe, il · egitimevi.org/school/<kısa ad>".
- Hiç yoksa: '"<yazdığın>" adıyla bir okul bulunamadı. Okulun adını, ilini ya da ilçesini yaz.'
- Arama kelimenin başından, içinden ve küçük yazım hatalarıyla (3 harfli kelimede tek harf, 4–6 harfte bir, 7 ve üstünde iki
  harf farkı) bulur; büyük/küçük harf ve Türkçe harf fark etmez.

## Kurallar ve sınırlar

- **Okul yalnız `/school/` ile başlayan adreste** aranır; `login`, `hakkinda` gibi sitenin kendi sayfa adları okul adresi
  olamaz.
- **Girişte arama sırası** (okulun sayfasında): önce o okulun hesabı (öğrenci, servisçi; eski düzende okulun açtığı öğretmen ve
  müdür) kullanıcı adıyla; yoksa ve 11 haneli bir sayı yazıldıysa o okulda T.C. numarasıyla; yoksa yetişkin hesabı (veli,
  öğretmen, müdür) ve yönetici. E-postayla girişte okul fark etmez.
- **Okulsuz girişte** (`/login`) okul hesabının adı yalnız bir okulda varsa yine girilir; birden çok okulda varsa "Bu kullanıcı
  adı birden çok okulda var. Önce okulunu seç, sonra giriş yap." + "Okulunu bul".
- **Okul adresi bulunamazsa** girişte: "Bu okul adresi bulunamadı. Ana sayfadan okulunu seç."; sayfa açılırken adres bu arada
  geçersizleştiyse adres `/login` olur ve kartın üstünde '"<kısa ad>" adresinde bir okul yok. Okulunu aşağıdan seç.'
- **Arama sınırları**: sorgu en az 2 harf; sunucu en çok 20 okul döndürür; bağlantı başına dakikada 3000 istek (okul ağında
  yüzlerce öğrenci aynı IP'den gelir). Yalnız onaylı ve adresi olan okullar aranır.
- **Son girilen okul** bu tarayıcıda yalnız okulun adı, kısa adı, ili ve ilçesiyle tutulur; kişinin kimliği yazılmaz.
- **Girişten sonra** okuldaki rolle girdiysen adres çubuğu `/school/<okul>` olur; sayfayı yenileyince aynı okulda kalırsın.
- **Çıkışta** okulun sayfasından girdiysen okulun giriş sayfasında kalırsın ([Çıkış yap](cikis-yap.md)).
- **Adres değişince** eski adres hemen çalışmaz ("Okul bulunamadı").
- **Bilinen açık** (kod değiştirilmedi): okul bilgisi 404 dışında bir hatayla gelemezse (ağ kesintisi) sayfa okul sayfası
  sayılır ama okul adı ve "Başka bir okul seç" görünmez, giriş okulsuz gider; sayfayı yenilemek düzeltir.

Tasarımda:

- **Kullanıcı adı site genelinde tek** olunca okulun sayfası "giriş okul içinde aranır" işini değil, **o okulun portalını seçili
  açma** işini yapar (29 Eylül kararı); giriş üç yoldan olur: `/login` "Giriş yap", okulun sayfası, `/login`'deki "Okul seç"
  (yalnız açık okullar).
- **Türkçe eş adres** `/okul/<okul>` (bugün yok; `/login` ↔ `/giris` gibi eklenecek).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Giriş](giris.md) — kartın kendisi, hata iletileri.
- [Kullanıcı adı](kullanici-adi.md) — okul içinde tek ad, site genelinde tek ad (tasarım).
- [T.C. kimlik numarası](tc-kimlik-no.md) — T.C. ile giriş.
- [Çıkış yap](cikis-yap.md) — çıkınca okulun sayfasında kalmak.

**İlgili:**

- [Okul sayfası](../okul-sayfasi/README.md) — sayfa adresi, tanıtım ve fotoğraflar, görünüm ve CSS.
- [Portallarım](../portallar/portallarim.md), [Portala geçiş](../portallar/portala-gecis.md) — "Portallarıma dön" (tasarım).
- [Tahta girişi](../tahta/tahta-girisi.md).
- [Adresler](../acilis-sayfasi/adresler.md), [Bulunamadı sayfaları](../acilis-sayfasi/bulunamadi-sayfalari.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) — `adrestenOkul`,
  `okulAdresiniYenile`, `okulBasligiCiz`, `vitrinAra`, `sonOkulCiz`, `okulYolunuAyarla`;
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `aramaSadeTR`, `aramaVurgula`, girişte `okul`
  alanı, `giristen-okul-sec`; [public/js/parcalar/19g-okul-sayfasi.md](../../public/js/parcalar/19g-okul-sayfasi.md) — kartın
  üstündeki okul sayfası.
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `GET /api/okul-adres`, `GET /api/okul-adres/ara`,
  `POST /api/login` (`okul` alanı, `okulSec`); [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) —
  `girisKimligiyle`; [sunucu/http.md](../../sunucu/http.md) — `/school/<okul>` adresi, "Okul bulunamadı" sayfası.
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md), [testler/test-okul-sayfasi.md](../../testler/test-okul-sayfasi.md),
  [testler/test-okul-agi.md](../../testler/test-okul-agi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Okul adresi (egitimevi.org/school/okulun-adi)").

## Sık sorulanlar

- **Nereden giriş yaparım?** Öğrenci ve servisçi okulunun adresinden girer: aynı kullanıcı adı başka bir okulda da olabileceği
  için giriş o okulun içinde aranır. Giriş sayfasında okulunu adıyla arayıp seçebilirsin; son girdiğin okul hatırlanır
  (sitenin SSS'si).
- **Okulumun adresi açılmıyor ("Okul bulunamadı").** Adres değişmiş olabilir: müdür ya da Eğitim Evi yöneticisi adresi
  değiştirince eski adres hemen çalışmaz. Giriş sayfasında okulunu adıyla arayıp seç; yeni adresi okul yönetiminden de
  öğrenebilirsin (sitenin SSS'si).
- **Okulumu aramada bulamıyorum.** Okulun henüz Eğitim Evi'nde açılmamış olabilir; okul yönetimine sor.
- **Veli olarak okulun sayfasından girebilir miyim?** Evet; e-postanla ya da kullanıcı adınla girersin.

## Sırada

- Tek kişi tek hesap + portallar öğrencide de: kullanıcı adı site genelinde tek; okulun sayfasından girince doğrudan o okulun
  portalı ve "Portallarıma dön"; `/login`'de "Okul seç".
- Toplantılar ve tahta hesabı: tahta girişinin yalnız okulun sayfasından olması; `/okul/<okul>` eş adresi.
- Arama motorunda görünme: okul sayfalarının başlık ve açıklamaları.
- Çok dil: metinler çeviri kataloğuna.
