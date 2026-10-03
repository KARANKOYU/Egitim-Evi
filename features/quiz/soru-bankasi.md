# Quiz · Soru bankası

**Durum:** Tasarlandı — henüz kodda yok

Öğretmenin quiz sorularını konu başlığıyla sakladığı ve yeni quize seçerek eklediği soru deposu; zümredeki öğretmenlerin
sorularını da gösterir.

## Ne işe yarar

Kullanıcının 28 Eylül akşamı onayladığı "quiz soru düzenleyici" önerisinin üçüncü parçası: "soru bankası (sakla, yeni quize seç;
zümre paylaşımı)". Öğretmen iyi bir soruyu bir kez yazar, bankaya kaydeder; sonraki yıl ya da başka sınıfa verdiği ödevin
quizinde bankadan seçip ekler. Aynı dersi veren öğretmenler (zümre) birbirinin bankaya koyduğu sorulardan da seçebilir.

## Nereden açılır

- **Öğretmen, bankadan seçmek için:** "Yeni ödev" ya da "Ödevi düzenle" → quiz bölümünde **"Quizi düzenle"** → düzenleyicinin üstündeki
  araç satırında **"Soru bankası"** (Tasarım 1 önizlemesi).
- **Öğretmen, bankaya kaydetmek için:** aynı düzenleyicide her soru kartının altındaki **"Bankaya kaydet"** düğmesi.

## Adım adım

### Öğretmen

**Soruyu bankaya kaydetmek** (Tasarım 1 önizlemesi)

1. Soruyu düzenleyicide yaz (metin, şıklar, doğru şık).
2. Kartın altındaki **"Bankaya kaydet"**e bas. Düğmenin yerine küçük bir satır açılır:
   - **"Konu"** açılır listesi: bankadaki konular (ör. "Kesirler", "Üslü sayılar") ve en sonda **"Yeni konu…"**;
   - "Yeni konu…" seçilince **"Yeni konunun adı"** kutusu açılır (en çok 40 karakter);
   - **"Kaydet"** ve **"Vazgeç"**.
3. **"Kaydet"**: soru metni boşsa kısa ileti **"Önce soruyu yaz."**; yeni konu seçilip adı yazılmadıysa **"Yeni konunun adını yaz."**
   Kaydedilince kısa ileti: **"Soru bankana kaydedildi (Kesirler)."** ve kartın altında yeşil rozet **"Bankada · Kesirler"** durur.
4. Bankaya sorunun türü, metni, şıkları ve doğru şık(lar)ı gider; soru başına süresi ve fotoğrafı gitmez.

**Bankadan soru eklemek**

1. Araç satırında **"Soru bankası"**na bas. Düzenleyicinin üstünde **"Soru bankası"** başlıklı panel açılır (sağ üstteki × ya da aynı
   düğme kapatır).
2. Üstte süzgeç çipleri: **"Hepsi"**, **"Benim"**, **"Zümre"** ve bankadaki her konu (ör. **"Kesirler"**, **"Üslü sayılar"**). Bir çip
   seçilince liste ona göre süzülür; o süzgeçte soru yoksa: **"Bu süzgeçte soru yok."**
3. Her satır bir kutucuk: kalın soru metni (matematik yazımı biçimli), altında **"Kesirler · Çoktan seçmeli · Deniz Aydın"** gibi konu,
   tür ve ekleyen (zümreden gelenlerde "zümre").
4. İstediğin soruların kutucuklarını işaretle. Alttaki düğme seçim sayısını gösterir: **"Seçilenleri quize ekle (3)"**; hiç seçim
   yoksa kapalıdır.
5. Düğmeye basınca sorular quizin sonuna eklenir, panel kapanır, kısa ileti: **"3 soru bankadan quize eklendi."** Eklenen soruların
   kartında **"Bankada · Kesirler"** rozeti görünür; soru başına sürede her biri 60 saniyeyle gelir. Eklenen soru quizde serbestçe
   değiştirilebilir (bankadaki asıl soru değişmez).

## Kurallar ve sınırlar

- Bankaya kaydetmek quizi kaydetmez; quiz yine "Ödevi ver" ya da "Kaydet" ile kaydedilir ([Ödeve quiz ekleme](quiz-ekleme.md)).
- Bankadan gelen soru quizin bütün sınırlarına uyar (en çok 100 soru vb.; [Soru türleri](soru-turleri.md)). Doğru şık bilgisi
  bankada saklanır; öğrenciye hiçbir yoldan gitmez.
- **"Benim"** öğretmenin kendi kaydettikleri; **"Zümre"** aynı dersi veren öğretmenlerinkiler (tanımın sözü: "zümre paylaşımı").
  Zümrenin tam tanımı (aynı okul ve aynı ders mi, okul dışı paylaşım var mı), soru silme ve düzeltme, bankanın okul değişince ne
  olacağı tanımda yazılı değil; kodlanmadan önce belirlenmeli.
- Kilitli quize (öğrenci başladıysa) bankadan soru eklenemez.
- Konu adı en çok 40 karakter (Tasarım 1 önizlemesi).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — bankanın açıldığı düzenleyici.
- [Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md) — aynı onaylı önerinin öbür parçaları.
- [Metinden ekle](metinden-ekle.md), [Soruları Excel'den aktarma](excelden-soru-aktarma.md) — soru eklemenin öbür yolları.

**İlgili:**

- [Özel roller](../roller-yetkiler/ozel-roller.md) — Zümre Başkanı rolü (zümre kavramının geçtiği yer).
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — öğretmenin dersleri (zümreyi belirleyecek bilgi).
- [Anketi ödeve ya da mesaja ekleme](../anket/odeve-mesaja-ekleme.md) — benzer biçimde "taslak sakla, sonra kullan" düzeni.

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (düzenleyici; Son durum bölümü "soru bankası (sakla,
  yeni quize seç; zümre paylaşımı)" planını anıyor).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (yeni banka uçları buraya ya da ayrı bir bölüme),
  [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (aynı doğrulama), [sunucu/yetki.md](../../sunucu/yetki.md) (zümre görünürlüğü).
- Veri: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (yeni banka tablosu).

## Sık sorulanlar

- **Bugün soru bankası var mı?** Hayır. Bugün aynı soruları başka bir quize "Metinden ekle" ile yapıştırarak taşıyabilirsin.
- **Bankadan aldığım soruyu değiştirirsem bankadaki de değişir mi?** Hayır; quize bir kopyası eklenir.
- **Zümredeki öğretmen benim sorularımı görür mü?** Tanıma göre evet ("zümre paylaşımı"); ayrıntısı kodlanmadan önce belirlenecek.

## Sırada

- Düzenleyiciler işi (onaylı, 28 Eylül): soru bankası (sakla, yeni quize seç; zümre paylaşımı). Zümrenin tanımı, bankadan silme ve
  düzeltme, saklama süresi bu işte netleşecek.
