# Anketler · Oy verme ve oyu geri alma

**Durum:** Kodda var; tasarımda ek olarak tek soruluk oy kartının yerini çok sorulu doldurma penceresi alır ("Kaydet, sonra devam et",
"Gönder", "Yanıtını değiştir") — [Çok sorulu anketi doldurma](anket-doldurma.md).

Hedefindeki açık ankette bir seçeneğe basarak oy vermek, bitişe kadar oyunu değiştirmek ya da geri almak.

## Ne işe yarar

Her kişinin bir ankette tek oyu vardır; anket bitene kadar fikrini değiştirebilir (KILAVUZ: "Hedefteki kişi bitişe kadar **bir** oy
verir; fikrini değiştirebilir ya da geri alabilir."). Sayfanın alt yazısı da bunu söyler: "Anket bitene kadar oyunu
değiştirebilirsin." Sonuç, hedefteki kişiye anket bitince açılır (kartın altında: "Sonuç anket bitince görünür.").

## Nereden açılır

- **Anketler** sayfasındaki açık anketin kartı; seçenekler kartın içinde büyük düğmelerdir ([Anketler sayfası](anketler-sayfasi.md)).
- **"Anket: <soru>"** bildirimi Anketler'i açar.
- Tasarımda: Anketler listesinde **"Yanıtla"** rozetli satır → anket penceresi ([Çok sorulu anketi doldurma](anket-doldurma.md)).

## Adım adım

### Öğrenci

**Bugün (kodda):**

1. Anketler'i aç. Açık anketin kartında seçenekler alt alta düğmelerdir; altında **"Henüz oy vermedin. Sonuç anket bitince
   görünür."**
2. Bir seçeneğe bas. İstek sürerken karttaki bütün seçenek düğmeleri kapanır; kayıt bitince sayfa sunucudan yeniden çizilir.
3. Seçtiğin düğme işaretlidir (solunda onay simgesi; ekran okuyucuya "basılı" bildirilir). Kartın altında: **"Oyun kaydedildi. Bitişe
   kadar değiştirebilirsin."**, bağlantı **"Oyumu geri al"** ve **"Sonuç anket bitince görünür."**
4. **Fikrini değiştirmek:** başka bir seçeneğe bas. Eski oyun yenisiyle değişir (oy zamanı da yenilenir); iki oy olmaz.
5. **Oyu geri almak:** **"Oyumu geri al"**a bas. Oyun silinir; kart yeniden "Henüz oy vermedin. Sonuç anket bitince görünür." olur.
6. Bir sorun olursa tarayıcının uyarı kutusunda ileti çıkar (ör. **"Bu anket kapandı."**) ve düğmeler yeniden açılır.
7. Anket bitince seçenekler düğme olmaktan çıkar, yerine sonuç çubukları gelir; oy vermediysen altında **"Bu ankete oy vermedin."**
   ([Sonuçlar](sonuclar.md#öğrenci)).

Ekranda ayrıca "oyun kaydedildi" iletisi çıkmaz; işaretli düğme ve kartın altındaki yazı kaydı gösterir.

**Tasarımda (Tasarım 1 önizlemesi):** satıra basınca pencere açılır; tek seçimli soru yuvarlak düğmelerle, öbür türler kutucuk, açılır
liste ya da yazı kutusuyla yanıtlanır; **"Kaydet, sonra devam et"** ve **"Gönder"**; gönderdikten sonra **"Yanıtını değiştir"**. "Oyumu geri
al"ın tasarımda bir karşılığı çizilmedi (gönderilen yanıt değiştirilebilir ama geri çekilmez); tanımda da yazmıyor. Ayrıntı
[Çok sorulu anketi doldurma](anket-doldurma.md).

### Veli

**Bugün (kodda):** öğrenciyle aynı. Anket çocuğun (sınıfı, "Öğrenciler" ya da bütün okul) için açıldıysa sen de hedeftesin ve kendi
oyunu verirsin; çocuğunun oyu ayrıdır, birbirinizinkini görmez, değiştiremezsiniz. Aynı ankette iki çocuğun için de hedefteysen tek
oyun vardır. Velisi olduğun çocukların okulları farklıysa bütün okulların anketleri aynı listededir.

**Tasarımda:** her çocuğun oturumunda o çocuğun anketleri ayrı yanıtlanır ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen

Müdür "Öğretmenler"e ya da bütün okula anket açtıysa hedeftesin; öğrenci gibi oy verirsin. Kendi açtığın ankette hedefte değilsin, o
ankete oy veremezsin (kartı da gelmez). Tasarımda: "Sana sorulan anketler" kutusundaki **"Oy ver"** rozetli satır.

### Çalışan

Öğretmen hesabıyla çalışan ek görevli öğretmen gibi oy verir. Tasarımda rolü olan çalışan öğretmen gibi; rolsüz çalışanın Anketler
sayfası yoktur.

### Müdür

Bir öğretmenin ya da öbür müdürün **bütün okula** açtığı ankette hedeftesin; kartı Anketler'in üstünde görür, oy verirsin. Rol grubundaki
"Öğretmenler" seçimi müdürü kapsamaz. Kendi açtığın ankete oy veremezsin.

## Kurallar ve sınırlar

- **Tek oy:** kişi başına bir oy; yeni seçim eskisinin yerine geçer.
- **Üç şart birden:** oy yalnız anket açıkken (bitmemiş ve erken bitirilmemiş), kişi hedef listesindeyse ve seçenek bu anketin
  seçeneğiyse yazılır; üçü tek bir veritabanı işleminde denetlenir, araya giren başka bir istek bunu bozamaz.
- **İletiler:** **"Bu anket kapandı."** (bitmiş ya da erken bitirilmiş anket; oyu geri almak da yapılmaz), **"Geçersiz seçenek"** (başka
  anketin seçeneği), **"Bu ankete oy veremezsin"** (hedef listesinde değilsin), **"Anket bulunamadı"** (silinmiş), **"Çok hızlı. Biraz
  bekle."** (kişi başına dakikada 120 istekten fazlası).
- **Bitiş anında yarış:** anket tam oy verirken biterse ileti "Bu anket kapandı." yerine "Bu ankete oy veremezsin" olabilir.
- **Sayılar açıkken gizli:** anket açıkken hedefteki kişiye sayılar hiç gönderilmez; yalnız kendi oyunu görürsün.
- **Geri alınan oy sayılmaz;** sonuçta ve katılım listesinde "oy vermedi" görünürsün.
- **Kimler:** öğrenci, veli, öğretmen ve müdür; servisçi ve yönetici giremez.
- **Kapalı bölüm:** okul "Anketler"i kapattıysa oy da verilemez.
- **Oyun kimde görünür:** gizli olmayan ankette anketi açan ve okulun müdürü kimin neyi seçtiğini ve oy zamanını görür; gizli ankette
  kimse görmez ([Gizli anket](gizli-anket.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Anketler sayfası](anketler-sayfasi.md) — kartların durduğu sayfa.
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — anket bitince çubuklar.
- [Gizli anket](gizli-anket.md) — oyunu kimin görebileceği.
- [Anketin kimlere gittiği](kimlere-gider.md) — hedef listesi.
- [Çok sorulu anketi doldurma](anket-doldurma.md) — tasarımdaki karşılığı.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — "Anket cevapları" satırı.
- [Telefon bildirimi](../bildirim/telefon-bildirimi.md) — "Anket: <soru>".

## Kod tarafı

- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (`anketKarti`, `EYLEMLER['anket-oy']` — boş
  `data-secenek` oyu geri alır; başarıda `SAYFALAR.anketler()` yeniden çağrılır),
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`hataGoster`: uyarı kutusu).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (`POST /api/anketler/oy { id, secenekId }`),
  [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md) (`oyVer` — tek `INSERT … SELECT … WHERE`, `oyGeriAl`),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 006: `anket_oylari` hedef listesine ve anketin seçeneğine bağlı).
- Testler: [testler/test-anket.md](../../testler/test-anket.md) (başka anketin seçeneği 400, hedefte olmayan öğretmen 403, değiştirme,
  geri alma, bitmiş ankete oy yazılmaması).

## Sık sorulanlar

- **Oyumu değiştirdim; eskisi de sayılır mı?** Hayır, yalnız son seçimin sayılır.
- **Oy verdim ama sonucu göremiyorum.** Sonuç anket bitince açılır.
- **Anket bitti, oy verebilir miyim?** Hayır; bitmiş ankete oy yazılmaz, oy da geri alınmaz.
- **Velim benim yerime oy verebilir mi?** Hayır. Velin ankette hedefteyse kendi oyunu verir; seninkini göremez ve değiştiremez.
- **Oyumu kim görür?** Gizli olmayan ankette anketi açan kişi ve müdür; gizli ankette kimse. Site SSS'sinde de yazar: "Gizli olmayan
  ankette anketi açan kişi ve müdür kimin neyi seçtiğini görür."

## Sırada

- Anket düzenleyici: tek soruluk oy kartı çok sorulu doldurma penceresine dönüşecek; bugünkü anketler tek soruluk form olarak
  korunacak.
- Velide her çocuk ayrı oturum.
- Android yerel uygulama: "Anketler (oy ver, sonuç)".
