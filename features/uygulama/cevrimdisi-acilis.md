# Uygulama ve indirme · Ağ yokken açılış

**Durum:** Kodda var

İnternet yokken Eğitim Evi'ni açınca ne olduğu: sitenin kabuğu (sayfa, görünüm, yazı tipleri, simgeler) cihazda saklandığı için
açılır; ama ödev, mesaj, not gibi veriler hiçbir zaman cihazda saklanmaz, sunucu olmadan gösterilmez.

## Ne işe yarar

Tarayıcıdan yüklenen Eğitim Evi'nin ([Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md)) ağ kesikken boş bir "bağlantı
yok" sayfası yerine kendi ekranıyla açılması ve her açılışta en yeni sürümü alması için arka planda küçük bir bileşen çalışır. Bu
bileşen bilerek sade tutuldu: verileri (sunucunun cevaplarını) **hiç saklamaz**, çünkü ders programı, not, giriş kodu gibi bilgiler
bayat olmamalı ve ortak bir cihazda başkasının eline geçmemeli. Bu belge plan listesinde yoktu; bugünkü kodda kullanıcının
karşılaştığı bir davranış olduğu için eklendi.

## Nereden açılır

Ayrı bir düğmesi yok; kendiliğinden çalışır:

- Eğitim Evi'ni `https://` ile bir kez açtığında (giriş yapmasan da) arka plan bileşeni kurulur ve kabuk dosyaları saklanır.
- Sonra ağ yokken sitenin adresini, ana ekrandaki ya da masaüstündeki Eğitim Evi simgesini açtığında devreye girer.
- Android uygulamasında ayrı bir düzen var (aşağıda).

## Adım adım

### Herkes (tarayıcıda ve tarayıcıdan yüklenen uygulamada)

1. İnternet varken Eğitim Evi'ni bir kez aç. (Okul ağında `http://192.168…` gibi şifresiz bir adresle açıldıysa bileşen kurulmaz;
   bu belgede anlatılanların hiçbiri olmaz.)
2. İnternet varken her açılışta sayfa ve dosyalar **önce sunucudan** istenir; gelen kopya bir kenara yazılır. Böylece hep en yeni
   sürümü görürsün.
3. İnternet yokken açarsan:
   - daha önce açtığın bir adresse saklanan kopyası açılır;
   - daha önce hiç açmadığın bir Eğitim Evi adresiyse ana sayfanın saklanan kopyası açılır;
   - saklanmamış bir dosya istenirse yerine düz yazıyla **"Çevrimdışısın"** gelir (bu yüzden kimi resimler görünmeyebilir).
4. Giriş yapmamışsan açılış ya da giriş ekranını görürsün; ama giriş yapamazsın, giriş için sunucu gerekir.
5. İnternet gelince sayfayı yenile.

### Giriş yapmış herkes

Öğrenci, veli, öğretmen, çalışan, müdür, servisçi ve yönetici için aynı:

- **İnternet yokken açarsan (bugünkü davranış, kod okumasına göre; denenmedi):** kabuk açılır, uygulama hesabını sunucuya soramaz ve
  bu cihazdaki oturumu kapatır: **giriş ekranı** gelir. "Beni hatırla" ile saklanmış oturumun da bu cihazdan silinir (sunucudaki
  oturum kendi süresi dolana kadar açık kalır). İnternet gelince yeniden giriş yaparsın (e-postan varsa kodla). Yani bugün "ağ yokken
  açılış" yalnız sayfanın açılmasıdır; veri gösterilmez.
- **Sayfa açıkken internet kesilirse:** açık sayfa olduğu gibi kalır; yeni bir şey istediğinde (başka sayfa, kaydet, gönder) işlem
  hata verir. Örneğin servis yoklamasında işaretlediğin satırın altında "Gönderilemedi: internet bağlantısı yok." yazar
  ([Yoklama sayfası](../servis/yoklama-sayfasi.md)). İnternet gelince yeniden dene ya da üst çubuktaki **Yenile**'ye bas
  ([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).
- **Verilerin:** hiçbir zaman cihazda saklanmaz. Ortak bir bilgisayarda ağ yokken başkası Eğitim Evi'ni açsa bile senin ödevlerini,
  mesajlarını ya da notlarını göremez.

### Android uygulamasında

Öğrenci, veli, öğretmen, müdür ve servisçi (2.0.0, henüz yayımlanmadı; [Android uygulaması](android-uygulamasi.md)):

- Uygulama ekranlarını kendisi çizdiği için internet yokken de açılır; oturumun **silinmez** (yalnız sunucu "oturum bitti" derse).
- Veri isteyen ekranlarda **"İnternet bağlantısı yok ya da Eğitim Evi'ne ulaşılamadı."** ve **"Yeniden dene"**. Üst çubuktaki
  **"Yenile"** de veriyi yeniden ister.
- Telefon bildirimleri için yapılan yoklama internet yokken bir sonraki zamana kalır; internet gelince birikenler gelir (bir soruşta
  en çok 20; daha fazlası birikmişse eskileri telefona düşmez, uygulamanın Bildirimler sayfasında durur;
  [Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- Servisçinin sefer konumu internet yokken gönderilemez; bir sonraki konumda yeniden denenir (arada kalanlar saklanmaz).

### Veli ve öğrenci (çocuğun telefonu)

Eğitim Evi Aile bağlı telefonda internet yokken konumlar **telefonda birikir** ve internet gelince gönderilir (en çok 5000 konum,
7 günden eskisi atılır). Veli bu sırada "Çocuğumun telefonu" sayfasında son gelen konumu görür
([Konum](../aile/konum.md)).

## Kurallar ve sınırlar

- **Güvenli bağlantı şart:** yalnız `https://` (ya da geliştirmede `localhost`) ile açılan sitede çalışır.
- **Veriler saklanmaz:** sunucunun veri cevapları (`/api/` ile başlayan her istek) hiçbir zaman saklanmaz. Sunucunun "saklama" dediği
  cevaplar (ör. gizli yönetim paneli) de diske yazılmaz.
- **Önce ağ:** internet varsa her zaman sunucudaki kopya kullanılır; saklanan kopya yalnız ağ hatasında devreye girer. Ağ yavaşsa
  (kopuk değilse) açılış sunucuyu bekler, saklanan kopyaya geçmez.
- **Yalnız Eğitim Evi'nin kendi dosyaları:** başka sitelerden gelen dosyalar (ör. harita döşemeleri) bu düzene girmez.
- **Sürüm değişince:** arka plan bileşeninin yeni sürümü gelince eski saklananlar silinir ve yeni bileşen açık pencereleri hemen
  devralır (açık sayfa yenilenmez; bir sonraki açılışta yeni sürüm gelir). Aynı sürüm içinde saklanan kopyalar kendiliğinden
  küçülmez.
- **Bilinen açıklar (kod okumasına göre):**
  - Ağ yokken açılışta oturum bu cihazda kapanır (yukarıda).
  - İlk ziyaretin hemen ardından tarayıcının önbelleği temizlenmişse ağ yokken sayfa açılır ama görünüm ve betik "Çevrimdışısın"
    alır: stilsiz, çalışmayan bir sayfa görünür.
  - Saklanacak kabuk dosyalarından biri sunucuda bulunamazsa hiçbiri saklanmaz (kurulum yine başarılı görünür).

## Kardeşler ve ilgili

**Kardeşler** ([Uygulama ve indirme](README.md)): [Tarayıcıdan uygulama olarak yükleme](tarayicidan-yukleme.md) ·
[Kendini güncelleme](kendini-guncelleme.md) · [Android uygulaması](android-uygulamasi.md) · [İndir sayfası](indir-sayfasi.md).

**İlgili:** [Beni hatırla](../giris-hesap/beni-hatirla.md) · [Çıkış yap](../giris-hesap/cikis-yap.md) ·
[Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md) · [Telefon bildirimi](../bildirim/telefon-bildirimi.md) ·
[Yoklama sayfası](../servis/yoklama-sayfasi.md) · [Konum](../aile/konum.md).

## Kod tarafı

- Arka plan bileşeni: [public/sw.md](../../public/sw.md) (saklanan kabuk listesi, "önce ağ", `/api/` hiç saklanmaz, `no-store`,
  "Çevrimdışısın" yedeği, sürüm değişince temizlik); kaydı [public/js/parcalar/04-pwa.md](../../public/js/parcalar/04-pwa.md).
- Ağsız açılışta oturumun kapanması: [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (açılışta hesabın
  sorulması başarısız olunca çıkış), [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) (cihazdaki oturumun
  silinmesi).
- Servis yoklamasındaki ileti: [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md).
- Android deposu (ayrı depo): `Ag.md` (internet yok iletisi), `Sayfa.md` ("Yeniden dene"), `Bildirimler.md`, `SeferServisi.md`,
  `Kuyruk.md` (çocuğun telefonunda bekleyen konumlar).
- Testler: [testler/test-adresler.md](../../testler/test-adresler.md) (arka plan bileşeni ve saklanan listede eski adres yok),
  [testler/test-okul-agi.md](../../testler/test-okul-agi.md) (açılışta istenen dosyalar). Ağsız açılışın otomatik testi yok.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Telefona uygulama olarak kurma": çevrimdışı çalışma
  HTTPS ister).

## Sık sorulanlar

- **İnternetim yokken ödevlerimi görebilir miyim?** Hayır; veriler cihazda saklanmaz, sunucu gerekir.
- **İnternet yokken açtım, giriş ekranı geldi.** Bugünkü sürümde ağ yokken açılışta oturum bu cihazda kapanır; internet gelince
  yeniden giriş yap.
- **Sayfada "Çevrimdışısın" yazıyor.** O dosya cihazda saklı değil ve internet yok. İnternet gelince sayfayı yenile.
- **Okul ağında `http://` ile giriyoruz, ağ yokken açılmıyor.** Arka plan bileşeni yalnız `https://` ile çalışır.

## Sırada

- Planlı bir iş yok. Öneri (onaylanmadı): ağ yokken açılışta oturumu silmemek, "İnternet bağlantısı yok" diye bir ekran göstermek.
