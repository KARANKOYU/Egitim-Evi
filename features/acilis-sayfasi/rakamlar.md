# Açılış sayfası ve girişsiz sayfalar · Rakamlar

**Durum:** Kodda var; tasarımda ek olarak sayma süresi `/panel/admin`'deki "Site ayarları"ndan ayarlanır ve yöneticinin "Sistem durumu" ekranında da çevrimiçi kişi sayısı görünür

Açılış ve Hakkında sayfalarındaki üç sayı: kaç okulun Eğitim Evi'ni kullandığı, kaç kişinin kayıtlı olduğu, şu an kaç kişinin
sitesinin açık olduğu.

## Ne işe yarar

Siteye ilk gelen kişi Eğitim Evi'nin gerçekten kullanıldığını görür. Yalnız sayı gösterilir: hangi okullar, kimler ya da kimin şu an
açık olduğu hiçbir yerde dışarı verilmez.

## Nereden açılır

- **Açılış** (`/`): renkli bandın alt kenarına binen beyaz kart ([Açılış sayfası](acilis.md)).
- **Hakkında** (`/hakkinda`): sayfanın sonunda, yazıların altında aynı kart ([Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md)).
- **Yönetici için** (sayma süresini ayarlamak): yönetim panelinde **"Site Ayarları"** → **"Zamanlamalar"** kartı.

## Adım adım

### Ziyaretçi

1. Açılışı ya da Hakkında'yı aç. Kartta yan yana üç sütun; her birinin solunda renkli bir çizgi (kırmızı, sarı, camgöbeği), büyük
   sayı ve altında açıklama:
   - **"okul kullanıyor"** — Eğitim Evi'nde açık (onaylı) okul sayısı;
   - **"kayıtlı kişi"** — onaylı hesap sayısı;
   - **"kişi şu an açık"** — son birkaç dakikada sitesi açık olan farklı kişi sayısı.
2. Sayılar sunucudan gelene kadar "–" yazar; gelince binlik ayırıcıyla yazılır (ör. "1.234").
3. Sayılar gelemezse (ağ yok, sunucu cevap vermedi) kart tamamen gizlenir. Açılış, Hakkında, SSS arasında başka bir sayfaya geçince
   site bilgisi yeniden istenir ve gelirse iletişim ile yapımcılar dolar; ama gizlenen rakam kartı yeniden açılmaz, sayılar ancak
   sayfayı yenileyince görünür (bilinen açık; kod okumasına göre, denenmedi).

### Giriş yapmış herkes

- Her sayfa açılışın ve her kimlikli istek seni (yetişkin hesabınla ya da okul hesabınla) "şu an açık" sayısına katar; uygulama açık
  durdukça bildirim yoklamasıyla düzenli istek gittiği için açık kalırsın.
- **Bugünkü site:** rakam kartını giriş yapmışken görmezsin (açılış ve Hakkında yalnız girişsizdir).
- **Tasarımda:** "Ana siteye dön" ile açılışa ve Hakkında'ya gelince aynı kartı görürsün
  ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).

### Yönetici

**Bugünkü yönetim paneli** — "Site Ayarları" → **"Zamanlamalar"** kartı; iki satır bu sayıyı etkiler:

1. **"Çevrimiçi sayma süresi"** — sayı kutusu, yanında "dakika", **"Kaydet"** ve (panelden kaydedilmişse) **"Varsayılana dön"**.
   Altındaki açıklama: "Son bu kadar dakikada sayfası açık olan kişi açılış sayfasında "şu an açık" sayılır. Yoklama aralığından kısa
   olamaz: sunucu en az yoklama aralığı + 1 dakika kullanır. 1–60 dakika; varsayılan 5."
2. **"Bildirim yoklama aralığı"** — "Açık sayfalar yeni bildirim var mı diye bu aralıkla sorar. Sekmeye dönülünce ve bildirim paneli
   açılınca beklemeden sorulur. 1–30 dakika; varsayılan 5."
3. Her satırın altında **"Şu anki değer:"** ve kaynağı: **"Panelden kaydedildi"** (kaydeden ve zaman), **"data/config.yml"** ya da
   **"Varsayılan"**.
4. Kullanılan süre yazdığından farklıysa:
   - varsayılanlarla (5 ve 5) soluk bir not: "Kullanılan: 6 dakika (bildirim yoklama aralığı 5 dakika; çevrimiçi sayma süresi ondan en
     az 1 dakika uzun olmalı)."
   - senin kaydettiğin (ya da `data/config.yml`'deki) süre kullanılamıyorsa turuncu uyarı kutusu: "Kaydettiğin 3 dakika kullanılamıyor:
     bildirim yoklama aralığı 5 dakika olduğu için 6 dakika kullanılıyor." (sayılar örnek).
5. Kaydedince kartın altında yeşil ileti: "Çevrimiçi sayma süresi kaydedildi." (aynıysa "… zaten böyle.", dosyadaki değerle aynıysa
   "… panelden kaydedildi; değer aynı kaldı."). "Varsayılana dön" onay sorar: "Panelden kaydedilen değer silinsin mi? Ayar sunucudaki
   data/config.yml dosyasındaki değere, orada da yoksa varsayılana döner." Sonra "… panelden kaydedilen değeri bıraktı."
6. Değişiklik sunucu yeniden başlamadan geçerli olur; işlem kaydına `site.aralik` türüyle "eski → yeni" yazılır (okulsuz; müdürler
   görmez).

Yöneticinin panel ana sayfasındaki sayılar (okul, müdür, öğretmen, öğrenci, veli) başka bir sayımdır; bu karttaki "kayıtlı kişi" ile
aynı değildir.

**Tasarımda** (`/panel/admin`, Tasarım 1 önizlemesi — [Site ayarları](../yonetim/site-ayarlari.md)): "Zamanlamalar" kartında
**"Çevrimiçi sayma süresi (kullanan kişiyi ölçme)"**; açıklaması "Açılış sayfasındaki “kişi şu an açık” sayısı: son bu kadar dakikada
sitesi açık olanlar sayılır. 1–60 dakika; varsayılan 5." Aynı kartta yalnız "admins.json okuma aralığı" var; "Bildirim yoklama aralığı"
önizlemede bu kartta görünmüyor (kullanıcı bu ayarın kaldırılması hakkında bir şey demedi; "yoklama + 1 dakika" kuralı sunucuda
durur). Tanımda (Sistem durumu) yönetici
çevrimiçi kişi sayısını ve okul/kullanıcı sayılarını "Sistem durumu" ekranında da görür ([Sistem durumu](../yonetim/sistem-durumu.md)).

### Destek

Destek rolü bugün yok. Tasarımda destek sayma süresini değiştirmez; rakamları herkes gibi açılışta görür.

## Kurallar ve sınırlar

- **"okul kullanıyor"**: durumu onaylı olan okulların sayısı (onaylı olmayan, bekleyen ya da reddedilmiş okul sayılmaz).
- **"kayıtlı kişi"**: onaylı hesapların sayısı; bir yetişkinin okullardaki öğretmen ve müdür satırları (portalları) ayrıca sayılmaz,
  kişi yetişkin hesabıyla bir kez sayılır; sistem yöneticisi hesapları hiç sayılmaz. Öğrenci ve servisçi hesapları (ve eski düzende
  okulun açtığı öğretmen hesapları) sayılır.
- **"kişi şu an açık"**: son *etkin süre* içinde siteye kimlikli istek gönderen farklı kişi sayısı. Etkin süre = çevrimiçi sayma
  süresi ile (bildirim yoklama aralığı + 1 dakika)'nın büyüğü; varsayılanlarla 6 dakika. Sebep: açık sayfa ancak yoklama aralığıyla
  istek gönderir, süre ondan kısa olsaydı açık olan kişi iki yoklama arasında "kapalı" görünürdü.
- "Şu an açık" sayısı hiçbir zaman "kayıtlı kişi"den büyük gösterilmez.
- Okul ve kişi sayıları sunucuda **bir dakika** önbellekte durur; "şu an açık" her istekte bellekten sayılır. Sunucu yalnız kişinin son
  görülme zamanını bellekte tutar (veritabanına yazmaz, kim olduğunu dışarı vermez); eski kayıtları 10 dakikada bir siler.
- Girişsiz ziyaretçi "şu an açık"a sayılmaz (kimliği yok).
- Sayılar sayfa başına bir kez yüklenir; sayfa açık kaldıkça kendiliğinden tazelenmez.
- **Bilinen açık (kod değiştirilmedi; kod okumasına göre):** ilk yükleme başarısız olunca kart gizlenir; sonraki sayfa geçişindeki
  yeniden deneme sayıları yazar ama kartı yeniden göstermez.
- `/api/site` cevabı tarayıcıda saklanmaz (her yüklemede yenisi gelir).
- **Dar ekran** (560 px ve altı): kart küçülür (sayılar 28 px, açıklamalar daha küçük), üç sütun yan yana kalır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Açılış sayfası ve girişsiz sayfalar](README.md)):

- [Açılış sayfası](acilis.md) — kartın ana yeri.
- [Hakkında ve Yapımcılar](hakkinda-ve-yapimcilar.md) — ikinci yeri.
- [İletişim bilgileri](iletisim-bilgileri.md) — aynı sunucu cevabıyla (`/api/site`) gelir.
- [Açılışın üst şeridi ve alt bilgisi](ust-serit-ve-alt-bilgi.md).

**İlgili:**

- [Site yönetimi](../yonetim/README.md) — [Site ayarları](../yonetim/site-ayarlari.md), [Sistem durumu](../yonetim/sistem-durumu.md).
- [Bildirimler](../bildirim/README.md) — [Bildirim paneli](../bildirim/bildirim-paneli.md) (yoklama aralığı).
- [İşlem kaydı](../islem-kaydi/README.md) — `site.aralik`.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — "şu an açık"ta kişi tutulmaz.

## Kod tarafı

- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (`siteBilgisiYukle`, `sayilariCiz`,
  `sayiYaz`), [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md)
  (`bildirimAraligiAl`: yoklama aralığı).
- Sunucu: [sunucu/site.md](../../sunucu/site.md) (`GET /api/site`, `goruldu`, `acikSayisi`, `cevrimiciEtkinDk`, 1 dakikalık önbellek),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`siteSayilari`), [sunucu/api.md](../../sunucu/api.md) (her kimlikli
  istekte `goruldu`), [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (`not`, `uyari`, aralık doğrulaması).
- Yönetim: [public/js/yonetim/09b-site-ayarlari.md](../../public/js/yonetim/09b-site-ayarlari.md) ("Zamanlamalar" kartı).
- İşaretleme: `public/index.html` (`.v-sayilar`, `[data-sayi="okul|kisi|cevrimici"]`); biçim `29-dis-sayfalar.css` —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md) (çevrimiçi sürenin yoklama + 1 dakikadan kısa
  olamaması, değişikliğin yeniden başlatmadan `/api/site`'ye geçmesi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Açılış sayfası, giriş ve site ayarları" — "Şu an açık").

## Sık sorulanlar

- **"Şu an açık" gerçek zamanlı mı?** Hayır; son birkaç dakikada (varsayılanlarla 6) sitesi açık olanları sayar ve sayfa açıldığında
  bir kez alınır.
- **Kimlerin açık olduğunu görebilir miyim?** Hayır; yalnız sayı tutulur ve gösterilir, yönetici de kimin açık olduğunu görmez.
- **Kart neden görünmüyor?** Sayılar sunucudan alınamadı; sayfayı yenile (başka bir dış sayfaya geçip dönmek kartı geri getirmez).

## Sırada

- "Paneller /panel/admin ve /panel/destek" (DEVAM iş 5): sayma süresi ayarı `/panel/admin`'e taşınır.
- "Sistem" (iş 4): "Sistem durumu" ekranında çevrimiçi kişi sayısı, okul ve kullanıcı sayıları.
- "Optimizasyon … ölçek raporu" (iş 7): çok sayıda eş zamanlı kişide sayım ve önbelleklerin davranışı.
- Yukarıdaki bilinen açık (yeniden deneme başarılı olunca kartın yeniden gösterilmesi) TAM DEBUG işine (iş 27) not.
