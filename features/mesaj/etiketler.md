# Mesajlar · Mesaj etiketleri (Şikâyet, Önemli, Durum)

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 30 Eylül kararı; Tasarım 1 önizlemesinde var).

Mesaj yazarken seçilen renkli etiket: listede rozet olarak görünür, gelen kutusu etikete göre süzülür.

## Ne işe yarar

Ayrı bir "şikâyet kutusu" yerine mesajın kendisini sınıflandırmak. Kullanıcı 30 Eylül'de grup arkadaşının (katkısı [CONTRIBUTING.md](../../CONTRIBUTING.md)'de yazılı)
şikâyet kutusu fikri için "mesaja şey ekleme: tag — şikâyet, durum, önemli gibi tag'lar; ona şikâyet tag'ını önerdi de" dedi.
Böylece okul yönetimine giden şikâyetler, acil bilgiler ve durum bildirimleri yüzlerce mesaj arasında kaybolmaz.

## Nereden açılır

- **Seçmek:** "Yeni mesaj" (ya da "Yanıtla") penceresinde **"Etiket:"** satırı ([Yeni mesaj ve alıcı seçimi](yeni-mesaj.md)).
- **Süzmek:** "Mesajlar"ın üst çubuğundaki etiket çipleri ([Gelen kutusu](kutu.md)).

## Adım adım

### Yazan — tasarım

1. "Yeni mesaj"ı aç; "Başlık:"ın altında **"Etiket:"** satırı: **"Etiketsiz"** (seçili gelir) · **"Şikâyet"** · **"Önemli"** ·
   **"Durum"** (her birinin önünde kendi renginde nokta; bir tanesi seçilir).
2. Birini seç, mesajı yaz, **"Gönder"**.
3. Mesaj "Gönderilen"de etiket rozetiyle durur.
4. Duyuru yazarken (müdürde "Tür: Duyuru") **"Şikâyet"** gizlenir; seçiliyse "Etiketsiz"e döner ([Duyuru](duyuru.md)).

### Alıcı — tasarım

1. Gelen kutusunda satırın başlığından önce renkli rozet: **"Şikâyet"**, **"Önemli"** ya da **"Durum"**.
2. Mesajı açınca **"Başlık:"** satırında aynı rozet.
3. Üst çubukta süzgeç çipleri: **"Hepsi"** · **"Şikâyet · 2"** · **"Önemli · 5"** · **"Durum · 1"** (sayı, açık kutudaki o
   etiketli mesaj sayısıdır; Gönderilen'de gönderdiklerinin sayısı). Birine basınca yalnız o etiketliler kalır; boşsa
   **"\"Önemli\" etiketli mesaj yok."**

### Etiketlerin anlamı

- **Şikâyet:** okul yönetimine (müdür ve yetkili) giden şikâyet; Gönderildi → Bakıldı → Çözüldü durumu ve silinme kuralları
  vardır ([Şikâyet etiketi](sikayet-etiketi.md)).
- **Önemli:** alıcının kutusunda üstte ve vurgulu durur; 3 Ekim kararıyla **acil duyuru gibi işler** (ayrı ve sesli telefon
  bildirimi, sayfanın üstünde şerit, okundu zorunlu izlenir) ([Önemli etiketi](onemli-etiketi.md)).
- **Durum:** anlamı kullanıcıya soruldu (bir durum bildirimi/bilgi mi, yoksa şikâyetin Bakıldı/Çözüldü durumu mu); cevap tanımlara
  işlenmedi. Tasarım 1 önizlemesinde bilgi niteliğindeki mesajlarda kullanılıyor (ör. "Etüt saati değişti"); şikâyetin durumu ise
  ayrı bir rozet olarak gösteriliyor.

## Kurallar ve sınırlar

Karara bağlananlar:

- Bir mesajın en çok bir etiketi olur (önizlemede seçim tek).
- Etiketler mesaj listesinde renkli rozet; gelen kutusunda etikete göre süzgeç (30 Eylül).
- Duyuru şikâyet olamaz (Tasarım 1).
- "Önemli": kötüye kullanıma karşı gönderen başına günde sınır (öneri 5; 30 Eylül); öğretmen, müdür ve yetkili çalışan koyar,
  öğrenci ve veli koyamaz (3 Ekim kararıyla yazılan öneri). Önizlemede (karardan önce yapıldı) etiket satırı her rolde var.
- Ayrı şikâyet kutusu YOK; şikâyet bir mesaj etiketidir (30 Eylül 18:35). Adsız şikâyet yok.
- 1 Ekim'deki ilk önizlemede süzgeçler "Hepsi, Önemli, Şikâyet, Duyuru" idi; sonradan "Duyuru" etiket olmaktan çıktı (duyuru bir
  mesaj türüdür; bugünkü sitede ve müdürün önizlemede gönderdiği duyuruda satırda kendi "Duyuru" rozetiyle görünür) ve yerine
  "Durum" geldi. Önizlemede eski "Duyuru" etiketli örnek mesajlar "Durum" etiketine çevrildi.

Tanımda henüz yazmayanlar:

- "Durum" etiketinin kesin anlamı ve kimin koyabileceği.
- Etiketin gönderdikten sonra değiştirilip değiştirilemeyeceği (bugünkü düzeltme yalnız konu ve metni değiştirir).
- Telefon uygulamasında etiketlerin görünümü.

## Kardeşler ve ilgili

**Kardeşler:** [Önemli etiketi](onemli-etiketi.md) · [Şikâyet etiketi](sikayet-etiketi.md) · [Gelen kutusu ve gönderilenler](kutu.md) ·
[Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [Duyuru](duyuru.md) · [Bu mesajı bildir](bu-mesaji-bildir.md).

**İlgili:** [Destek talepleri](../destek/README.md) (Eğitim Evi ekibine giden talepler ayrıdır) · [Bildirim paneli](../bildirim/bildirim-paneli.md) ·
[Servis](../servis/README.md) ("bugün servise binmedi" uyarısı "Önemli" önceliğinde gider).

## Kod tarafı

Bugün kodda yok: mesajda yalnız tür (`mesaj` | `duyuru`) var ve kutu türe göre süzülür ("Hepsi / Duyurular / Kişisel")
([sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md), [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md)
"Son durum"da etiket işi yazılı). Etiket sütunu, süzgeç ucu ve rozetler yapı belgesinde yazılacak (yeni şema dosyası).
Kodlanınca bu belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **Şikâyetimi nereye yazayım?** Ayrı bir kutu yok: "Yeni mesaj"da okul yönetimine yaz, "Etiket:"te "Şikâyet"i seç.
- **Her mesajıma "Önemli" koyabilir miyim?** Önemli etiketi acil haber içindir; gönderen başına günlük sınırı olacak (öneri 5) ve
  öğrenci ile veli koyamayacak (öneri).
- **Bütün şikâyetleri nasıl görürüm?** Gelen kutusunda "Şikâyet" çipine bas.

## Sırada

- Mesaj etiketleri (iş 28): Şikâyet, Önemli, Durum — yazarken seçim, listede rozet, etikete göre süzgeç.
- Duyuruyu okumayanlara hatırlatma ve "Önemli" etiketi (3 Ekim kararı).
- KVKK: şikâyetlerin saklanması ve kimin gördüğü aydınlatma metnine yazılacak.
