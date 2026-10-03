# Anketler · Gizli anket

**Durum:** Kodda var; tasarımda ek olarak kutunun metni "Gizli anket (sonuçlarda kimin ne dediği görünmez)" olur, çok sorulu ankette
yazılı yanıtlar da kişiye bağlanmaz (Tasarım 1 önizlemesi) ve tanıma göre gizli ankette katılım listesinde kişi yer almaz.

Anketi açarken işaretlenen "Gizli anket": kimin neyi seçtiği hiç kimseye — anketi açana ve müdüre de — gönderilmez; sayılar da ancak
anket bitince görünür.

## Ne işe yarar

Memnuniyet, şikâyet ya da kişisel tercih gibi sorularda insanlar adlarının seçimleriyle görüneceğini bilirse çekinir. Gizli ankette
anketi açan kişi ve müdür yalnız toplam sayıları ve kimin oy verip vermediğini görür (KILAVUZ: "**Gizli anket:** kimin neyi seçtiği
hiç kimseye (açan dahil) gönderilmez"). Gizlilik ekranda değil sunucuda sağlanır: istenmeyen bilgi tarayıcıya hiç gelmez.

Sayıların anket bitene kadar gizlenmesi bir güvenlik incelemesinden sonra eklendi: yöneten anket açıkken sonuç penceresini sık sık
açsaydı, iki bakış arasında oy veren yeni kişiyle artan seçeneği eşleştirip kimin neyi seçtiğini çıkarabilirdi (kod yorumu: "sık sık
bakıp yeni oy verenle artan seçeneği eşleştirmek kimin neyi seçtiğini ele verirdi"). Bu yüzden gizli ankette oy zamanı da hiç
gönderilmez.

## Nereden açılır

- **Bugün:** Anketler → "Yeni anket" penceresinde, bitiş günü ve saatinin altında **"Gizli anket (kimin neyi seçtiğini ben de
  görmeyeyim)"** kutusu ([Anket açma](anket-acma.md)).
- **Tasarımda:** "Anket oluştur" → "Yayınla" kutusunda **"Gizli anket (sonuçlarda kimin ne dediği görünmez)"** ([Anket oluştur](anket-olustur.md)).

## Adım adım

### Müdür

**Bugün (kodda):**

1. "Yeni anket" penceresinde **"Gizli anket (kimin neyi seçtiğini ben de görmeyeyim)"** kutusunu işaretle ve **"Anketi aç"**.
2. Listede gizli anket öbürleri gibi görünür ("<hedef özeti> · 12 / 40 kişi oy verdi · bitiş …"): kaç kişinin oy verdiği her an
   bellidir.
3. Anket açıkken **"Sonuç"**: sayıların yerine mavi kutu **"Gizli ankette sayılar anket bitince görünür."**; **"12 / 40 kişi oy verdi"**;
   altında **"Gizli anket: kimin neyi seçtiği gösterilmez."** Katılım listesinde oy verenin sağında yalnız **"oy verdi"** yazar (seçim
   ve zaman yok); "Oy verenler" / "Vermeyenler" sekmeleri ve arama çalışır.
4. Anket bitince (süresi dolunca ya da "Bitir" ile) sonuç penceresinde sayılar ve çubuklar görünür; katılım listesi yine yalnız "oy
   verdi" / "oy vermedi" der.
5. Gizliliği açtıktan sonra kaldıramazsın (gizli olmayan anketi de gizliye çeviremezsin); anket açıldıktan sonra değiştirilemez.

Başka bir öğretmenin açtığı gizli anketi de müdür aynı biçimde görür: müdür olmak gizliliği açmaz.

**Tasarımda:** "Yayınla" kutusundaki **"Gizli anket (sonuçlarda kimin ne dediği görünmez)"**. Tasarım 1'in sonuç penceresinde gizli
anketin üst satırının sonuna **" · gizli anket"**, listedeki satıra **" · gizli"** eklenir. Çok sorulu ankette "kimin ne dediği" yazılı
yanıtları da kapsar: kısa ve uzun yanıtlar kişinin adı olmadan gösterilir (kutunun metni; önizlemede yalnız "8 yazılı yanıt" sayısı
çizildi). Tanım ayrıca sonuç ekranı için "katılım listesi (gizli ankette kişi yok)" diyor: bugünkü sitede yöneten gizli ankette de kimin
oy VERDİĞİNİ görüyor; tasarımda bunun kalkıp kalkmayacağı kodlamadan önce netleşmeli ([Açık noktalar](README.md#açık-noktalar)).

### Öğretmen

Anket açma yetkin varsa müdür gibi: açtığın gizli anketin seçimlerini sen de göremezsin.

### Çalışan

Ek rolündeki yetkiyle anket açan çalışan öğretmen gibi.

### Öğrenci

Gizli anketin kartında alt satırın sonuna eklenir: **"<açan> · bitiş 12.10.2026 23:59 · kimin neyi seçtiği görünmez"**. Oy verme, değiştirme, geri alma aynıdır
([Oy verme ve oyu geri alma](oy-verme.md)); anket bitince öbür anketler gibi sayıları ve kendi seçimini ("(senin seçimin)") görürsün.

### Veli

Öğrenciyle aynı.

## Kurallar ve sınırlar

- **Hiç gönderilmeyenler (her zaman):** kişinin seçtiği seçenek ve oy zamanı. Anketi açan, müdür ve yönetici dahil kimsenin
  ekranına gelmez.
- **Bitene kadar gönderilmeyenler:** seçenek başına sayılar — anketi açana ve müdüre de.
- **Görünenler:** kimin oy verdiği ve vermediği (yöneten için), toplam "12 / 40 kişi oy verdi".
- **Veritabanında:** oyunu değiştirebilmen ve sayım yapılabilmesi için seçimin kayıtlıdır; hiçbir ekran ve uç bunu kişiyle birlikte
  göstermez. Site yedeği (yönetici) gizli anketin oylarını da içerir ve geri yüklemede geri getirir.
- **Küçük gruplarda dikkat:** hedef çok küçükse (ör. 3 kişi) ya da herkes aynı seçeneği seçtiyse bitince sayılar kimin neyi seçtiğini
  tahmin ettirebilir; gizlilik sayıları değil, kişiyle seçimin eşleşmesini gizler.
- **Değişmez:** gizlilik yalnız açılışta seçilir; sonradan açılıp kapatılmaz.
- **KVKK:** aydınlatma metninde "Anket cevapları" satırı: "Anketin sorulduğu kişiler; gizli ankette kimin neyi seçtiği kimseye
  gösterilmez" ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Anket açma](anket-acma.md) — kutunun bulunduğu pencere.
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — gizli ankette sonuç penceresi.
- [Oy verme ve oyu geri alma](oy-verme.md).
- [Anket oluştur](anket-olustur.md) — tasarımdaki "Gizli anket" kutusu.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).
- [Sık sorulan sorular](../acilis-sayfasi/sss.md) — "Anketlerde oyumu kim görür?"
- [Site yedekleri](../yonetim/yedekler.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (`gizli` yalnız `true` gelirse; `GET /api/anketler/sonuc`: gizlide
  `secim` boş ve `tarih` yok, gizli ve açıkken `sayimlar` yok; "Dikkat!" bölümü),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 006, `anketler.gizli`),
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedekte anket ve oylar).
- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (`#aGizli`; kartta "· kimin neyi seçtiği
  görünmez"; sonuç penceresinde mavi bilgi kutusu ve "oy verdi"; "Dikkat!": gelmeyen alanı başka yoldan tamamlamaya çalışma).
- Testler: [testler/test-anket.md](../../testler/test-anket.md) (gizli ankette herkesin seçimi boş ve zamanı yok, açıkken sayı yok,
  bitince sayılar açılıyor), [testler/test-yedek.md](../../testler/test-yedek.md) (gizli anket ve oyu yedekten geri gelir).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Anketler ve duyuru okundu bilgisi".

## Sık sorulanlar

- **Gizli ankette müdür benim oyumu görür mü?** Hayır. Müdür ve anketi açan yalnız oy verip vermediğini ve anket bitince toplam sayıları
  görür. Açılış sayfasındaki SSS: "Gizli ankette kimin neyi seçtiği hiç kimseye, müdüre de gösterilmez; sayılar da anket bitince
  açılır."
- **Gizli anket açtım; neden sonuçları göremiyorum?** Gizli ankette sayılar anket bitince görünür. Erken görmek istersen "Bitir" ile
  bitirebilirsin (bir daha oy verilemez).
- **Oy vermeyenleri görebilir miyim?** Evet; "Vermeyenler" sekmesi gizli ankette de çalışır.
- **Açtığım anketi sonradan gizli yapabilir miyim?** Hayır; gizlilik yalnız açılışta seçilir.

## Sırada

- Anket düzenleyici: kutunun metni "Gizli anket (sonuçlarda kimin ne dediği görünmez)"; yazılı yanıtlar kişisiz.
- KVKK tam denetimi: yazılı yanıtlar eklenince aydınlatma metnindeki "Anket cevapları" satırı genişletilecek.
