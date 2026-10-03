# Hesap ayarları · Görünüm ve dil

**Durum:** Kodda var; tasarımda ek olarak "Görünüm ve dil" bölümü: "Cihaza göre" adı, "Boyut" (Sık / Normal) ve "Dil" seçimi. (Bugün kodda olan: Görünüm kartında Sistem · Açık · Koyu ve üst şeritte ay/güneş düğmesi.)

Eğitim Evi'nin açık mı koyu mu görüneceğini (tasarımda ayrıca ne kadar sık dizileceğini ve hangi dilde olacağını) seçtiğin yer.

## Ne işe yarar

Koyu görünüm akşam gözü yormaz; "Sistem" seçersen bilgisayarın ya da telefonun kendi ayarına uyar. Kullanıcının sözleri: 8 Eylül
"koyu açık modda olcak", 26 Eylül "bide üstte bir ay ve güneş basınca dark-light mode geçiş". Dil seçimi için 29 Eylül: "siteye dil
üstte olur, o an hangi dil varsa o olsun"; 2 Ekim: "tr en şeyi unutma çevirme sadece değişince eng yazsın".

## Nereden açılır

- **Bugün:**
  - Ayarlar → **"Görünüm"** kartı (herkeste) ([Ayarlar sayfası](hesap-ayarlari-sayfasi.md));
  - üst şeritteki **ay / güneş** düğmesi (üzerine gelince "Koyu ya da açık görünüm"): uygulamada ve giriş yapmadan açılış sayfasında,
    aydınlatma metni, kullanım koşulları, indir ve "bulunamadı" sayfalarında ([Üst şerit ve alt bilgi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md)).
- **Tasarımda:** Hesap ayarları → **"Görünüm ve dil"** bölümü; profil menüsünde **"Görünüm ve dil — tema, dil"**; üst şeritte dil
  seçici ("TR ▾") ve ay/güneş ([Dil seçici](../dil/dil-secici.md)).

## Adım adım

### Bugün: herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, rolsüz yetişkin, yönetici)

Ayarlar → "Görünüm":

1. Kartta: "Koyu tema akşam gözü yormaz. "Sistem" seçilirse bilgisayarın ya da telefonun kendi ayarına uyar."
2. Üç düğme: **"Sistem"**, **"Açık"**, **"Koyu"**. Seçili olan dolu, öbürleri gri.
3. Birine bas: görünüm hemen değişir, sayfa yeniden çizilir. Seçim bu tarayıcıda saklanır ve sessizce hesabına da yazılır (yazılamazsa
   tarayıcıdaki seçim yine geçerli).
4. Başka bir cihazdan girince hesabındaki seçim (Açık ya da Koyu) oraya da gelir. Hesabında "Sistem" kayıtlıysa o cihazın kendi seçimi
   kalır.

Üst şeritteki ay/güneş:

1. Açık görünümde **ay** görünür: basınca koyuya geçer. Koyuda **güneş**: basınca açığa geçer. "Sistem" seçiliyse şu an görünenin
   tersine geçer.
2. Girişliysen seçim hesabına da yazılır; Ayarlar açıksa "Görünüm" kartı da güncellenir.

### Bugün: ziyaretçi (giriş yapmadan)

Açılış sayfasında ve düz sayfalarda yalnız ay/güneş vardır; seçim bu tarayıcıda hatırlanır, seçmediysen cihazın ayarı kullanılır.

### Telefonda

Koyu görünümde telefonun adres çubuğu (kurulu uygulamada başlık çubuğu) koyu zemin rengine, açıkta markanın kırmızısına boyanır.

### Tasarımda (Tasarım 1 önizlemesi): "Görünüm ve dil" bölümü

1. **"Tema"** — üç düğme: **"Açık"**, **"Koyu"**, **"Cihaza göre"** (bugünkü "Sistem"). Seçili olan vurgulu; basınca hemen uygulanır.
2. **"Boyut"** — **"Sık"** / **"Normal"**, altında "Sık: her şey biraz küçük, ekrana daha çok sığar". Basınca kısa ileti: **"Sık görünüm:
   her şey biraz küçük."** ya da **"Normal boyut."** Seçim bu tarayıcıda hatırlanır; önizlemede "Sık" hazır gelir.
3. **"Dil"** — şu anki dil (ör. "Türkçe") ve **"Değiştir"**. Pencere **"Dil"**: "Türkçe" / "English" seçenekleri; not: "Menüler, düğmeler
   ve bildirimler bu dilde olur. Öğretmenlerin yazdığı ödev ve mesajlar çevrilmez." **"Kaydet"** → **"Dil: <dil>."**

Tanımdaki dil kuralları ([Dil seçici](../dil/dil-secici.md), [Çeviri kapsamı](../dil/ceviri-kapsami.md)):

- Üst şeridin sağında dil kodu ve aşağı ok ("TR ▾"; tire yok, bayrak yok). Açılınca her dil kendi adıyla ve çevrilme oranıyla ("English —
  %92" gibi); oranı düşük diller "(yarım)" rozetiyle, eksik metin Türkçe görünür.
- İlk açılışta tarayıcının dili (destekleniyorsa); seçim girişliyken hesapta, her zaman tarayıcıda saklanır. Girişsiz sayfalarda da çalışır.
- Arayüz metinleri, e-posta ve bildirim şablonları çevrilir; kullanıcının yazdıkları (mesaj, ödev metni, duyuru) çevrilmez.
- Sağdan sola diller (Arapça gibi) sayfayı sağdan sola çevirir ([Sağdan sola](../dil/sagdan-sola.md)).

## Kurallar ve sınırlar

- **Üç değer:** sistem, açık, koyu; başka değer "sistem" sayılır, sunucu "Geçersiz tema" der.
- **Önce tarayıcı, sonra hesap:** seçim önce bu tarayıcıda saklanır; girişte hesabında "Sistem" dışında bir değer varsa ve tarayıcıdakinden
  farklıysa hesaptaki uygulanır. Hesaptaki "Sistem" başka tarayıcıdaki "Koyu"yu ezmez.
- **Okul rolündeyken** seçim yetişkin hesabına ve bulunduğun rol satırına yazılır.
- **Beyaz yanıp sönme olmaz:** seçim sayfa çizilmeden önce uygulanır.
- **Sekmeler arası eşitleme yok:** bir sekmede değiştirince öbür açık sekmeler yenilenince değişir.
- **Tarayıcı depolaması kapalıysa** (bazı gizli pencereler) seçim her açılışta "Sistem"e döner; girişliysen hesaptaki her açılışta yeniden
  uygulanır.
- **Yazı tipleri** sunucudan gelir (başlıkta Newsreader, gövdede IBM Plex Sans), dışarıya istek gitmez. İşletim sisteminde "hareketi azalt"
  açıksa sayfa canlandırmaları kapanır.
- **Telefon uygulamasında** Ayarlar'da tema ve dil seçimi bugün yok; uygulama telefonun kendi açık/koyu ayarına uyar
  ([Android uygulaması](../uygulama/android-uygulamasi.md)).
- **Tasarımda karar bekleyen:** "Boyut" (Sık / Normal) kullanıcının 2 Ekim'deki "ve biraz hani ölçeklendirmesiz gibi" isteğine önizlemenin
  cevabıdır; kalıcı bir ayar olup olmayacağı kararlaştırılmadı. Bugün dil seçimi yok, site yalnız Türkçe.

## Kardeşler ve ilgili

**Kardeşler:** [Ayarlar sayfası](hesap-ayarlari-sayfasi.md) · [Bildirim ayarları](bildirim-ayarlari.md) ·
[Kişisel bilgiler](kisisel-bilgiler.md).

**İlgili:** [Üst şerit ve alt bilgi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md) (açılış sayfasının ay/güneşi),
[Üst şerit](../menu-ve-arama/ust-serit.md), [Profil menüsü](../menu-ve-arama/profil-menusu.md), [Dil seçici](../dil/dil-secici.md),
[Çeviri kapsamı](../dil/ceviri-kapsami.md), [Sağdan sola](../dil/sagdan-sola.md), [Sık sorulanlar](../acilis-sayfasi/sss.md).

## Kod tarafı

- Ön yüz: [public/js/tema.md](../../public/js/tema.md) — `window.temaAyarla`, `window.temaOku` (tarayıcıda `ee_tema`, adres çubuğu rengi);
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — "Görünüm" kartı;
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `tema-sec`, `tema-degis`;
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — girişte hesaptaki temanın uygulanması;
  [public/js/belge.md](../../public/js/belge.md) — düz sayfalardaki ay/güneş.
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/profile { tema }`; [sunucu/yetki.md](../../sunucu/yetki.md)
  — oturumla gelen `tema`.
- Görünüm: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`00-temel.css` renk değişkenleri, açık ve koyu palet).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Görünüm: açık/koyu tema ve yazı tipleri").

## Sık sorulanlar

- **Koyu görünüm var mı?** Evet. Üstteki ay düğmesiyle koyu, güneş düğmesiyle açık görünüme geçersin. Seçimin bu cihazda hatırlanır, giriş
  yaptıysan hesabına da yazılır; seçmediysen telefonunun ya da bilgisayarının ayarı kullanılır.
- **Telefonumda koyu seçtim, bilgisayarda açık görünüyor.** Bilgisayarda giriş yapınca hesabındaki seçim gelir; giriş yapmadan önce
  tarayıcının kendi seçimi geçerlidir.
- **Site İngilizce olabilir mi?** Bugün hayır; tasarımda üstteki dil seçiciyle.

## Sırada

- Çok dil: üstte "TR ▾" seçici, çeviri kataloğu, sağdan sola, çevirmen rolü.
- Arayüz önizlemesi / Tasarım 1 → kod: "Görünüm ve dil" bölümü ("Cihaza göre" adı; "Boyut" için karar beklenir).
- Üst şerit sadeleştirme: portalda üst şeritte dil ve tema düğmeleri kalır, öbürleri profil menüsüne taşınır.
