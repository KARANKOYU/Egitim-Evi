# Bildirimler · Zilin tazelenmesi (bildirim yoklama aralığı)

**Durum:** Kodda var; tasarımda ek olarak sayfa değiştirince de beklemeden sorma (tanımda yazılı, bugün kodda yok).

Açık Eğitim Evi sayfasının "yeni bildirim var mı?" diye sunucuya ne sıklıkla sorduğu ve sistem yöneticisinin bu aralığı nasıl
ayarladığı.

## Ne işe yarar

Zilin rozeti sayfa açıkken kendiliğinden güncellenir. Sık sormak sunucuyu yorar, seyrek sormak bildirimi geciktirir; bu yüzden aralık
bir site ayarıdır (varsayılan 5 dakika) ve soru ucuzdur: değişiklik yoksa cevap birkaç bayttır. Zamanı önemli bildirimler zaten
telefon bildirimiyle anında gider; sayfanın sorması yedektir ([Telefon bildirimi](telefon-bildirimi.md)).

## Nereden açılır

- Herkes için: bir ayar yoktur, kendiliğinden çalışır.
- Sistem yöneticisi: yönetim paneli → **Site ayarları** → **"Zamanlamalar"** kartı → **"Bildirim yoklama aralığı"**
  ([Site ayarları](../yonetim/site-ayarlari.md)).

## Adım adım

### Herkes — bugünkü site

1. Giriş yapınca sayfa hemen bir kez sorar; zilin rozeti okunmamış sayısını gösterir.
2. Sonra sitenin aralığıyla (varsayılan **5 dakikada bir**) sorar. Kutunda değişiklik yoksa liste gelmez, yalnız "değişmedi" cevabı
   gelir.
3. Beklemeden sorduğu anlar:
   - sekmeye geri dönünce (başka sekmeden ya da uygulamadan dönünce);
   - zile basınca;
   - üstteki **Yenile** ile sayfayı tazeleyince;
   - bir mesajı açınca, gönderince ya da silince.
4. Sekme arka plandayken hiç sormaz; öne gelince hemen sorar.
5. Panel açıkken yeni bildirim gelirse liste kendiliğinden yenilenir.
6. Aynı anda tek soru gider; önceki soru bitmeden yenisi başlamaz.

### Sistem yöneticisi

1. Yönetim paneli → Site ayarları → **"Zamanlamalar"** kartında **"Bildirim yoklama aralığı"** kutusu (yanında "dakika") ve
   altında açıklaması: "Açık sayfalar yeni bildirim var mı diye bu aralıkla sorar. Sekmeye dönülünce ve bildirim paneli açılınca
   beklemeden sorulur. 1–30 dakika; varsayılan 5." Altında değerin nereden geldiği de yazar (panelden kaydedildi, sunucunun ayar
   dosyası ya da varsayılan).
2. Dakika olarak yaz (1–30) ve satırın **"Kaydet"** düğmesine bas. İleti: **"Bildirim yoklama aralığı kaydedildi."**; değer
   aynıysa **"Bildirim yoklama aralığı zaten böyle."**
3. Hatalı değerde: **"Bildirim yoklama aralığı 1 ile 30 dakika arasında bir tam sayı olmalı."** (0, 31, 2,5 ya da harf reddedilir.)
4. Değer panelden kaydedilmişse yanında **"Varsayılana dön"** düğmesi çıkar; basınca ileti **"Bildirim yoklama aralığı panelden
   kaydedilen değeri bıraktı."** ve değer sunucunun ayar dosyasındaki ya da varsayılan değere döner.
5. Aynı karttaki **"Çevrimiçi sayma süresi"** bu aralıktan kısa olamaz: sunucu en az "yoklama aralığı + 1 dakika" kullanır; daha kısa
   bir değer kaydedilmişse kartta kullanılan değer ve nedeni yazar.
6. Değişiklik işlem kaydına yazılır ("Bildirim yoklama aralığı: 5 → 10 dk").

### Tasarımda (tanım)

- Optimizasyon tanımındaki karar: 5 dakikalık yoklama; sekme yeniden görünür olunca, **sayfa değiştirilince** ve panel açılınca
  hemen tazelenir. Bugün sayfa değiştirmek tek başına soru göndermez (yalnız Yenile ve mesaj işlemleri gönderir).
- Bildirim paneli sekmelere ayrılınca da sürümlü yoklama ve birkaç baytlık "değişmedi" cevabı korunur ([Bildirim sekmeleri](sekmeler.md)).
- Tasarım 1 önizlemesinde telefonda sayfa başlığının üstündeki "Yenile" düğmesi yeni bildirimleri de getirir
  ([Telefonda yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).

## Kurallar ve sınırlar

- **Aralık:** 1–30 dakika, tam sayı; varsayılan 5. Yönetici kaydedince kendi sekmesi hemen yeni aralığa geçer; öbür kişilerin açık
  sayfaları yeni aralığı yeniden girişte ya da sayfayı yeniden yükleyince alır.
- **"Değişmedi" cevabı:** sayfa son bildiği "sürümü" gönderir (bildirim sayısı · okunmamış sayısı · son bildirimin anı). Aynıysa liste
  gönderilmez. Okundu saymak da sürümü değiştirir ([Okundu sayma](okundu-sayma.md)).
- **Telefon bildirimine bağlı değil:** tarayıcının telefon bildirimi bildirim yazıldığı anda gider; Android uygulaması kendi
  aralığıyla (15 dakika, servis saatlerinde 1 dakika) sorar. İkisi de bu ayardan etkilenmez.
- **Çevrimiçi sayma:** her soru kişiyi "şu an açık" sayar; açılış sayfasındaki "şu an açık" sayısı bu yüzden yoklama aralığına
  bağlıdır.
- **Takılan soru:** bağlantı askıda kalırsa (telefonda ağ değişince) o soru bitene kadar o sekmede rozet tazelenmez (kod okumasına
  göre).

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim paneli](bildirim-paneli.md) · [Okundu sayma](okundu-sayma.md) · [Telefon bildirimi](telefon-bildirimi.md) ·
[Bildirim sekmeleri](sekmeler.md).

**İlgili:** [Site ayarları](../yonetim/site-ayarlari.md) · [Telefonda yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md) ·
[İşlem kaydı: neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) · [Açılış sayfasındaki rakamlar](../acilis-sayfasi/rakamlar.md)
("şu an açık" sayısı).

## Kod tarafı

- Ön yüz: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) —
  `bildirimleriYenile` (sürümlü soru, arka plandaki sekmede yok, aynı anda tek soru), `visibilitychange`, `bildirimAraligiAl`
  (1–30), `bildirimSayaciKur`; [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md)
  (`sayfayiYenile`); [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md) ve
  [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) (aralığın giriş, `/me` ve `/site`
  cevabından alınması); yönetim paketinde `public/js/yonetim/09b-site-ayarlari.js` ("Zamanlamalar" kartı).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`GET /api/notifications?surum=`), [sunucu/site.md](../../sunucu/site.md)
  (`bildirimAralikDk`: 1–30, varsayılan 5; çevrimiçi sayma en az aralık + 1),
  [sunucu/bolumler/site-ayarlari.md](../../sunucu/bolumler/site-ayarlari.md) (kaydetme, iletiler, işlem kaydı),
  [sunucu/api.md](../../sunucu/api.md) (her isteğin kişiyi "açık" sayması).
- Depo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`bildirimSurumu`).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (değişiklik yokken liste gelmemesi),
  [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md) (1–30, varsayılan 5, bozuk değerlerin reddi, çevrimiçi
  süresi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Bildirimler sayfaya nasıl gelir (yoklama aralığı)").

## Sık sorulanlar

- **Bildirim geldi ama rozet birkaç dakika sonra çıktı.** Sayfa varsayılan olarak 5 dakikada bir sorar. Zile basınca ya da sekmeye
  dönünce hemen sorar; anında haber için telefon bildirimini aç.
- **Aralığı 1 dakikaya indirsem olur mu?** Olur ama her açık sayfa dakikada bir sorar; okul saatlerinde sunucuya yük biner.
  Telefon bildirimi zaten anında gider.
- **Aralığı değiştirdim, öbür kullanıcılarda hemen geçerli mi?** Hayır; sayfayı yeniden yükleyince ya da yeniden girişte.

## Sırada

- Optimizasyon + saklama süreleri (iş 7): yoklamanın sunucu tarafında bellekte yanıtlanması (tanımdaki ölçüm işi); sayfa
  değişince sorma.
- Mesaj ayarları … (iş 8): sekmeli panelde aynı sürümlü yoklama.
