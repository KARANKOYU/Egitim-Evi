# Hatırlatıcılar · Durdurma ve yeniden başlatma

**Durum:** Kodda var; tasarımda ek olarak satırdaki "Durdur" / "Başlat" düğmesinin yerine hatırlatıcının penceresinde "Hatırlatıcı
açık" anahtarı ve satırda "Açık" / "Kapalı" etiketi.

Bir hatırlatıcıyı silmeden susturmak ve istediğinde yeniden çalıştırmak.

## Ne işe yarar

Tatilde "Her gün · 07:00 — servis çantası" çalmasın ama okul açılınca yeniden kurmakla uğraşma. Durdurulan hatırlatıcı listede
kalır, bildirim göndermez; "Başlat" deyince kaldığı yerden değil, o andan itibaren yeniden sayar.

## Nereden açılır

- **Hatırlatıcılar** sayfasında her satırın sağındaki **"Durdur"** düğmesi; durdurulmuş satırda aynı yerde **"Başlat"**
  ([Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md)).
- **Tasarımda** (Tasarım 1 önizlemesi): satıra (ya da takvimde, ajandada hatırlatıcıya) basınca açılan **"Hatırlatıcı"**
  penceresindeki **"Hatırlatıcı açık"** anahtarı.

## Adım adım

### Durdur (herkes, bugünkü site)

1. Açık bir hatırlatıcının satırında **"Durdur"**a bas. Düğme beklerken kilitlenir.
2. Sayfa yeniden çizilir, üstte yeşil ileti **"Durduruldu."**
3. Satır soluklaşır, etiketi gri **"Durduruldu"** olur, düğme **"Başlat"**a döner. Bu hatırlatıcı için bildirim gelmez.

### Yeniden başlat (herkes, bugünkü site)

1. Durdurulmuş satırda **"Başlat"**a bas.
2. İleti **"Yeniden başladı."**; etiket mavi **"Sonraki: 13.10.2026 07:30"** olur.
3. Sayım o an yeniden başlar: durduğu sürede kaçan anlar topluca gelmez; bugünün saati geçmişse ilk hatırlatma bir sonraki uygun
   gündedir. Hatırlatıcı listenin en altına geçer.
4. **Bir kezlik** hatırlatıcının günü geçmişse (ya da zaten "Hatırlatıldı" olduysa ve günü geçtiyse) başlatılamaz; tarayıcının uyarı
   kutusunda: **"Bu hatırlatıcının günü geçti; düzenleyip yeni bir gün seç."** O zaman **"Düzenle"** ile ileri bir gün seçip kaydet
   ([Kurma, düzenleme ve silme](hatirlatici-kurma.md)).

### Dikkat: "Düzenle → Kaydet" de başlatır

Durdurulmuş bir hatırlatıcıyı düzenleyip kaydedersen hatırlatıcı yeniden açılır (pencere bunu söylemez). Yalnız başlığı ya da
açıklamayı düzeltmek istediysen kaydettikten sonra yeniden **"Durdur"**a bas.

### Öğrenci

Ör. yaz tatilinde "Her hafta Pzt, Çar · 07:30 — Beden eğitimi kıyafeti"ni durdurursun, eylülde başlatırsın.

### Veli

Ör. servis ücretini peşin ödediğin aylarda "Her ayın 1. günü — Servis ücreti"ni durdurursun.

### Öğretmen, çalışan ve müdür

Ör. dönem arasında haftalık "Zümre toplantısı" hatırlatıcısını durdurursun. Her okul portalının hatırlatıcıları ayrıdır; durdurma
yalnız o portaldakini etkiler.

### Servisçi ve yönetici

Aynı düğmeler, aynı kurallar.

### Tasarımda (Tasarım 1 önizlemesi)

1. Satıra bas → **"Hatırlatıcı"** penceresi. Yeni hatırlatıcı penceresinde ("Hatırlatıcı ekle") bu anahtar yoktur; yalnız var olan
   hatırlatıcıda **"Hatırlatıcı açık"** anahtarı görünür.
2. Anahtarı kapat: canlı satır **"Hatırlatıcı kapalı; bildirim gelmez."** olur.
3. **"Kaydet"** → kısa ileti **"Hatırlatıcı kaydedildi: her Salı 07:30."**; satırda **"Kapalı"**, zil simgesi koyulaşır, özetten
   "sıradaki" kalkar.
4. Kapalı hatırlatıcı takvimde ve ajandada görünmez ([Takvimde ve ajandada](takvimde-ve-ajandada.md)).
5. Yeniden açmak için aynı anahtarı aç ve kaydet; canlı satır "Sıradaki hatırlatma: …" der.
6. Önizlemedeki örnek: öğrencinin "Spor kıyafeti — her Salı 07:30" hatırlatıcısı kapalı.
7. Duyurudan gelen hatırlatıcıyı da (tanım) yalnız kendin için kapatabilirsin; gönderenin ve öbür alıcıların kaydı etkilenmez
   ([Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md)).

## Kurallar ve sınırlar

- **Yalnız sahibi** durdurur ve başlatır; başkasının hatırlatıcısı için sunucu "Hatırlatıcı bulunamadı" der.
- **Durdurulan hatırlatıcı 50 sınırına sayılır;** yer açmak için silmek gerekir.
- **Başlatınca baştan sayılır:** başlatma anından önceki hiçbir an için bildirim gitmez.
- **Günü geçmiş bir kezlik başlatılamaz:** "Bu hatırlatıcının günü geçti; düzenleyip yeni bir gün seç."
- **Hata nerede görünür:** durdur/başlat hatası pencere içinde değil, tarayıcının uyarı kutusunda çıkar; düğme yeniden açılır.
- **Hız sınırı:** durdurma ve başlatma da saatteki 120 değişiklik sınırına sayılır ("Çok sık değiştirdin. Biraz sonra dene.").
- **Bir kezlik gönderilince kendiliğinden kapanır** ve "Hatırlatıldı" yazar; bu bir durdurma değildir, ama aynı biçimde "Başlat"
  düğmesi görünür (günü geçtiği için başlatılamaz).

## Kardeşler ve ilgili

**Kardeşler:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) · [Kurma, düzenleme ve silme](hatirlatici-kurma.md) ·
[Sıklık](siklik.md) · [Hatırlatma bildirimi](hatirlatma-bildirimi.md) · [Takvimde ve ajandada](takvimde-ve-ajandada.md) ·
[Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) · [Kimler görür ve saklama](kimler-gorur-ve-saklama.md).

**İlgili:** [Ödev hatırlatmaları](../odev/hatirlatmalar.md) (ödeve özel "Bu ödev için kapalı" seçeneği) ·
[Bildirim ayarları](../ayarlar/bildirim-ayarlari.md) · [Tatiller ve özel günler](../takvim/tatiller-ve-ozel-gunler.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md) — `hatirlatici-durum` eylemi
  (`data-aktif`: açıkta 0, kapalıda 1), `hatirlaticiDurumu` ("Durduruldu", "Hatırlatıldı"), `soluk-satir`.
- Sunucu: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) — `POST /api/hatirlaticilar/<id>/durum { aktif }`
  ("Durduruldu." / "Yeniden başladı.", günü geçmiş bir kezlikte 400).
- Veri: [sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md) — `aktifYaz` (başlatırken kuruluş anını
  yeniler), `guncelle` (düzenleme hatırlatıcıyı açar).
- Zaman: [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) — kapalı hatırlatıcının `sonraki`si yok,
  `zamaniGeldi` kapalıyı atlar.
- Testler: [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md) (durdur → sonraki yok, başlat).

## Sık sorulanlar

- **Durdurduğum hatırlatıcı neden yeniden çaldı?** Büyük olasılıkla onu düzenleyip kaydettin; kaydetmek hatırlatıcıyı açar.
- **"Başlat" dedim, kaçırdığım hatırlatmalar gelecek mi?** Hayır; sayım başlattığın andan itibarendir.
- **"Hatırlatıldı" olan hatırlatıcıyı yeniden kullanmak istiyorum.** "Düzenle" ile ileri bir gün seç ve kaydet; "Başlat" günü geçtiği
  için olmaz.
- **Durdurmak ile silmek arasındaki fark?** Durdurulan listede kalır ve 50'ye sayılır; silinen tamamen gider.

## Sırada

- Arayüz önizlemesi (Tasarım 1): "Hatırlatıcı açık" anahtarı ve "Açık"/"Kapalı" etiketi.
- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: alıcının
  duyurudan gelen hatırlatıcıyı yalnız kendisi için kapatması.
