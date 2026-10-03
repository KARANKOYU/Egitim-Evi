# Mesajlar · Düzeltme, silme ve kutudan kaldırma

**Durum:** Kodda var; tasarımda ek olarak listeden WhatsApp gibi toplu seçip silme ("N mesaj seçili · Sil · Vazgeç") (Tasarım 1 önizlemesi; kullanıcının 1 Ekim kararı).

Gönderdiğin mesajın konusunu ve metnini sonradan düzeltmek, mesajı bütün alıcılardan silmek ya da gelen bir mesajı yalnız kendi kutundan kaldırmak.

## Ne işe yarar

Yanlış saat yazılmış bir duyuruyu herkese yeniden göndermeden düzeltmek, yanlışlıkla gönderilen mesajı geri almak ya da
kutuyu kalabalık eden mesajlardan kurtulmak için. Kullanıcı 1 Ekim'de "WhatsApp gibi mesajı select yapıp toplu silme" istedi.

## Nereden açılır

- Mesajın penceresindeki alt düğmeler: gönderende **"Düzelt"** ve **"Mesajı sil"**, alıcıda **"Kutumdan kaldır"** ([Mesajı okuma](mesaj-okuma.md)).
- Tasarımda kutudaki satırların seçim kutuları ve üstteki **"N mesaj seçili · Sil · Vazgeç"** şeridi ([Gelen kutusu](kutu.md)).

## Adım adım

### Gönderen — düzeltmek (bugünkü site)

1. "Gönderilenler"den mesajı aç → **"Düzelt"**.
2. **"Mesajı düzelt"** penceresi: **"Konu"** (en çok 120) ve **"Mesaj"** (en çok 4000) bugünkü metinle dolu; altında ipucu:
   **"Alıcılara yeniden bildirim gitmez; mesajın altında \"düzenlendi\" ve saati görünür."**
3. Değiştir → **"Kaydet"** (düğme **"Kaydediliyor..."** olur). **"Vazgeç"** mesajı yeniden açar.
4. Boş bırakırsan kutunun altında **"Konu yaz."** ya da **"Mesaj boş olamaz."**
5. Kaydedince mesaj yeni metniyle yeniden açılır; listede tarihin yanında **" · düzenlendi"**, alıcının penceresinde
   **" · düzenlendi 12.10.2026 10:02"** yazar. Hiçbir şey değişmediyse sunucu **"Değişiklik yok."** döner ve "düzenlendi"
   yazılmaz; bu ileti (başarıdaki "Mesaj düzeltildi." de) ekranda gösterilmez, pencere yalnız yeniden açılır.

### Gönderen — silmek (bugünkü site)

1. Mesajı aç → **"Mesajı sil"**.
2. "Gönderilenler"den açtıysan onay: **"Mesaj tüm alıcılardan silinsin mi?"** → Tamam.
3. Mesaj bütünüyle silinir (bütün alıcıların kutusundan, okundu kayıtları ve ekleriyle); pencere kapanır, liste ve zil yenilenir.

### Alıcı — kutudan kaldırmak (bugünkü site)

1. Mesajı aç → **"Kutumdan kaldır"**.
2. Onay: **"Mesaj kutundan kaldırılsın mı?"** → Tamam.
3. Mesaj yalnız senin kutundan kalkar; gönderenin "Gönderilenler"inde ve öbür alıcılarda durur. Velinin iki çocuğu için gelen
   kopyaları birlikte kalkar.

### Tasarımda (Tasarım 1 önizlemesi)

1. Kutuda satırların kutucuklarını işaretle ya da telefonda bir satıra basılı tut; üstte **"N mesaj seçili"** şeridi çıkar.
2. Seçimdeyken başka satırlara dokunarak ekle/çıkar; **"Hepsini seç"** görünenlerin hepsini seçer.
3. **"Sil"** → onay penceresi: **"3 mesaj silinsin mi?"** — **"Silinen mesajlar Çöp kutusuna gitmez; geri alınamaz."** —
   **"Vazgeç"** / **"Sil"**. Silince **"3 mesaj silindi."**
4. Hiç mesaj seçmeden "Sil"e basılırsa: **"Önce silinecek mesajları seç."**
5. **"Vazgeç"** seçimi kaldırır.
6. Önizlemede pencerede "Düzelt" ve tek mesaj silme çizilmemiş; kaldırılması için karar yok.

## Kurallar ve sınırlar

- **Kim düzeltir:** yalnız gönderen (başkası **"Yalnızca gönderen düzeltebilir"**). Yalnız konu ve metin değişir; alıcılar,
  ekler, tür (mesaj/duyuru) değişmez. Alıcılara yeni bildirim gitmez. Saatte en çok 60 düzeltme (**"Çok sık düzelttin. Biraz bekle."**).
  Boş konu **"Konu yaz"**, boş metin **"Mesaj metni boş olamaz"**. Başarılı kayıtta sunucu **"Mesaj düzeltildi."** döner
  (ekranda gösterilmez).
- **Kim siler:** gönderen mesajı herkesten siler (sunucu **"Mesaj silindi."** döner); alıcı yalnız kendi kutusundan kaldırır
  (**"Mesaj kutundan kaldırıldı."**). Bu iki ileti ekranda gösterilmez: pencere kapanır, liste yenilenir. İkisi de değilsen
  **"Yetkin yok"**; mesaj yoksa **"Mesaj bulunamadı"** (hatalar tarayıcının uyarı kutusuyla çıkar).
- **Geri alma yok:** silinen mesaj geri gelmez; çöp kutusu yok.
- **Okundu listesine etkisi:** alıcı kutusundan kaldırınca alıcılar listesinden de çıkar; gönderenin "N / M okudu" sayısında M
  azalır ([Okundu bilgisi](okundu-bilgisi.md)).
- **Ekler:** gönderen mesajı silince ekleri de gider; ekin dosyası saatlik temizlikte diskten kalkar.
- **Gönderenin hesabı silinmişse:** mesaj "Silinmiş kullanıcı" adıyla durur; son alıcı da kutusundan kaldırınca mesaj tümden silinir.
- **Tasarımda belirsiz olan:** toplu "Sil"in gönderilmiş mesajlarda (Gönderilen kutusunda) mesajı herkesten mi sileceği, yalnız
  gönderenin listesinden mi kaldıracağı önizlemede ayrılmamış (bugünkü kural: gönderen silince herkesten gider).
- **Bilinen açık** (kod okumasına göre): onay metni açık sekmeye bakar, düğme gönderene. Çocuğu okulda olan öğretmen ya da müdür
  kendi gönderdiği mesajın veli kopyasını gelen kutusunda görür; oradan açıp "Mesajı sil"e basınca onay **"Mesaj kutundan
  kaldırılsın mı?"** der ama sunucu mesajı bütün alıcılardan siler.

## Kardeşler ve ilgili

**Kardeşler:** [Mesajı okuma](mesaj-okuma.md) · [Gelen kutusu ve gönderilenler](kutu.md) · [Okundu bilgisi](okundu-bilgisi.md) ·
[Mesaj ekleri](ekler.md) · [Velinin kopyası](velinin-kopyasi.md) · [Şikâyet etiketi](sikayet-etiketi.md) (çözülen şikâyet 1 gün
sonra kendiliğinden silinir).

**İlgili:** [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) · [Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md)
(ödevde de "Sonradan düzeltme") · [Ajandaya ve hatırlatıcıya ekle](ajandaya-ve-hatirlaticiya-ekle.md) (tasarımda duyuru silinince
ajanda satırları ve hatırlatıcılar da silinir).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) — `EYLEMLER['mesaj-duzelt']`,
  `EYLEMLER['mesaj-duzelt-kaydet']` (`POST /api/mesajlar/duzenle`); [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  — `mesaj-sil` (onay metni `S.mesajKutu`'ya göre, `POST /api/mesajlar/sil`).
- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) — `POST /api/mesajlar/duzenle` (sahiplik, hız sınırı,
  "Değişiklik yok."), `POST /api/mesajlar/sil` (gönderen: sil; alıcı: `alicidanKaldir`).
- Depo: [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) — `duzelt` (`duzenlenme` zamanı), `sil`,
  `alicidanKaldir`; [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) (`ekSupur`).
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md) (silme: gönderen/alıcı), [testler/test-etut.md](../../testler/test-etut.md)
  bölüm 5 "Mesaj düzeltme".
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Sonradan düzeltme").

## Sık sorulanlar

- **Düzelttim, alıcıya haber gitti mi?** Hayır; yalnız mesajda "düzenlendi" ve saati görünür.
- **Kutumdan kaldırdığım mesaj gönderenden de silinir mi?** Hayır, yalnız senin kutundan kalkar.
- **Sildiğim mesajı geri getirebilir miyim?** Hayır; çöp kutusu yok.

## Sırada

- Mesaj tasarımı (Tasarım 1): toplu seçim ve toplu silme.
- Düzenleyiciler: düzeltme penceresi de ortak yazı düzenleyicisiyle.
- Optimizasyon ve saklama süreleri: mesajlar gönderildikten 1 yıl sonra kendiliğinden silinecek.
