# Servis · Evin yerini işaretleme

**Durum:** Kodda var.

Öğrencinin, velisinin ya da okul yönetiminin servis haritasında evin yerine dokunarak (ya da "Bulunduğum yeri kullan" ile) işaretlediği
konum; servisçi bu yeri görür, yaklaşma bildirimi buna göre gider.

## Ne işe yarar

Kullanıcının sözü (26 Eylül): "haritada okulun ve öğrencinin adresi işaretli olucak şekilde veli onu seçerek girip ... yada öğrenci
kendisi durduğu bi yerde haritada evimi işaretleye basınca orası işaretlencek okulu zaten müdür yapcak". Ev işaretliyse:

- servis eve 500 m ve 100 m kala bildirim gider ([Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md)),
- velinin haritasında "eve yaklaşık 1,2 km" yazar,
- servisçinin listesinde **"Yol tarifi"** çıkar ve haritasında ev sıra numarasıyla durur.

İşaretleme isteğe bağlıdır.

## Nereden açılır

- **Öğrenci:** "Servisim" → "Servisin nerede?" kartı → **"Evimi işaretle"**.
- **Veli:** "Servis" → "Servis haritası" kartı (o çocuğun haritası seçili) → **"Evimi işaretle"** (yazı velide de aynıdır; çocuğun evi
  kastedilir).
- **Okul yönetimi:** "Servisler" → öğrencinin satırında **"Harita"** → penceredeki **"Evimi işaretle"**.
- Ev işaretliyse düğmenin adı **"Evin yerini değiştir"**, yanında **"Ev işaretini sil"**.

## Adım adım

### Öğrenci

1. **"Evimi işaretle"**ye bas. Harita seçim kipine geçer: altında konum simgesiyle "Haritada evinin olduğu yere dokun." ve üç düğme:
   **"Kaydet"** (yer seçilene kadar kapalı), **"Bulunduğum yeri kullan"**, **"Vazgeç"**. Seçim kipindeyken harita yenilenmez.
2. Haritada evinin olduğu yere kısaca dokun (sürüklemek seçmez). Turuncu seçim işareti konur: "Seçtiğin yer işaretlendi. Doğruysa
   kaydet." Yanlışsa başka yere dokun.
3. Ya da evdeysen **"Bulunduğum yeri kullan"** ("Konum alınıyor..."): telefon konumunu verir, harita oraya yakınlaşır. Konum 100 m'den
   kaba geldiyse: "Konum yaklaşık 250 m hassas; gerekirse haritada düzelt."
4. **"Kaydet"** ("Kaydediliyor..."): "Ev konumu kaydedildi." Harita yenilenir, ev işareti yeşil "Ev" olur.
5. **"Vazgeç"** seçimi bırakır, haritayı eski hâline döndürür.
6. Silmek için **"Ev işaretini sil"**: "Ev işareti silinsin mi? Servis yaklaşma bildirimi gelmez olur." → "Ev konumu silindi."

### Veli

Aynı adımlar, çocuğunun haritasında. Birden çok servisli çocuğun varsa önce haritanın üstündeki ad düğmesiyle doğru çocuğu seç; kayıt
haritası açık olan çocuğa gider.

### Müdür, öğretmen ve çalışan (servis yönetimi)

Öğrencinin "Harita" penceresinde aynı adımlarla işaretler, değiştirir, siler (ör. veli telefonla adres verdiyse).

### Servisçi

Evin yerini görür, değiştiremez: listede "ev işaretli değil" yazısı (işaretsizse), işaretliyse **"Yol tarifi"** ve haritada sıra
numaralı ev ([Yoklama sayfası](yoklama-sayfasi.md)).

### Tasarımda (Tasarım 1 önizlemesi)

Öğrencinin haritasının altında **"Evimi işaretle"** ve yanında "Ev işaretliyse servis eve 500 m ve 100 m kala bildirim gelir."
(kaydedilince "Ev konumun kaydedildi; servisçin görür."). "Bulunduğum yeri kullan" ile: "Şu an durduğun yer işaretlendi. Evin olarak
kaydedilsin mi?" ve "Yanlışsa haritada evinin olduğu yere dokun."; dokununca "Seçtiğin yer işaretlendi. Doğruysa kaydet."; düğmeler
**"Kaydet"**, **"Bulunduğum yeri kullan"**, **"Vazgeç"**. Önizlemede düğme yalnız öğrencinin ekranında; kullanıcının sözü veliyi de
saydığı için velinin işaretlemesi bugünkü gibi kalır.

## Kurallar ve sınırlar

- **Kim işaretler:** öğrencinin kendisi, bağlı velisi ve aynı okulun servis yönetimi (müdür ya da `servis.yonet`). Başkası: "Bu
  öğrencinin ev konumunu değiştiremezsin" (403). Servisçi yalnız görür.
- **Kim görür:** öğrencinin kendisi, velisi, servisinin servisçisi ve okul yönetimi (aydınlatma metninde "Öğrencinin evinin haritadaki
  yeri", isteğe bağlı).
- **Sıklık:** saatte en çok 30 değişiklik: "Çok sık değiştirdin. Biraz sonra dene." (429).
- **Geçerlilik:** enlem ±90, boylam ±180 içinde ve 0,0 olmayan bir nokta; değilse "Konum anlaşılmadı. Haritada evin olduğu yere dokun."
  Konum 6 ondalıkla saklanır.
- **"Bulunduğum yeri kullan"** yalnız güvenli bağlantıda ve konum izniyle çalışır: "Bu tarayıcı konumu veremiyor (güvenli bağlantı
  gerekir). Haritada dokunarak seç." ya da "Konum alınamadı. Konum iznini ver ya da haritada dokunarak seç." En çok 15 saniye bekler.
- **Silinince** yaklaşma bildirimi gitmez, servisçinin "Yol tarifi" kalkar.
- Ev konumu servis kaydından ayrıdır: öğrenci servisten çıksa da işaret durur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Canlı konum ve servis haritası](canli-konum-ve-harita.md) — işaretlemenin yapıldığı harita.
- [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md) — ev işaretine dayanır.
- [Servisim ve servis kartı](servisim.md), [Servisler sayfası](servisler-sayfasi.md) ("Harita" düğmesi).
- [Yoklama sayfası](yoklama-sayfasi.md) — servisçinin "Yol tarifi".

**İlgili:**

- [Okul konumu](../okul-sayfasi/okul-konumu.md) — okulun yeri (müdür ya da yetkili kişi seçer).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/servis/ev { ogrenciId?, enlem, boylam }`
  ve `{ sil: true }`, `haritaYetkisi` (`evDuzenle`), `koordinatAl`; `GET /api/servis/harita` cevabındaki `ev`, `evDuzenleyebilir`.
- Depo: [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md) — `evKonumu`, `evKonumuYaz`, `evKonumuSil`; tablo
  `ogrenci_konumlari` (öğrenci başına tek satır; işaretleyenin kimliği ve güncelleme zamanıyla).
- Ön yüz: [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) — `ev-sec`, `ev-buradayim`, `ev-kaydet`,
  `ev-vazgec`, `ev-sil`; dokunarak seçme [public/js/parcalar/19d-harita.md](../../public/js/parcalar/19d-harita.md) (`tiklaninca`).
- Testler: [testler/test-servis-konum.md](../../testler/test-servis-konum.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis haritası ve canlı konum" → "Ev konumu").

## Sık sorulanlar

- **Evimi işaretlemezsem ne olur?** Servisi yine görürsün; yalnız yaklaşma bildirimi gelmez ve servisçinin yol tarifi olmaz.
- **Servisçi evimin yerini değiştirebilir mi?** Hayır, yalnız görür.
- **Yanlış yeri kaydettim.** "Evin yerini değiştir"e bas, doğru yere dokun, kaydet.
- **"Bulunduğum yeri kullan" yanlış yer gösterdi.** Konum kaba gelmiş olabilir; haritada evinin olduğu yere dokunarak düzelt.

## Sırada

- Android yerel uygulama: öğrencinin ve velinin "Servis" sekmesinde evi işaretleme.
- Çok dil: düğme ve yönerge metinlerinin çeviri kataloğuna girmesi; "Evimi işaretle" yazısının velide ve yönetimde "Evin yerini işaretle"
  gibi uygun bir adla gösterilmesi (öneri).
