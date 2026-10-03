# Anketler · Saklama ve silinme

**Durum:** Kodda var; tasarımda ek olarak anketler bitişinden 1 yıl sonra kendiliğinden silinir ve anket cevaplarının "Verilerimi
indir"e girmesi önerildi.

Anketin, seçeneklerinin, hedef listesinin ve oyların ne kadar saklandığı; kim, ne zaman siler; hesap ya da okul silinince ne olur.

## Ne işe yarar

Anket cevapları kişisel veridir (aydınlatma metninde "Anket cevapları" satırı). Bugün anketler süresiz saklanır; yalnız anketi açan ya
da müdür elle siler. Kullanıcı 27 Eylül sabahı saklama süreleri istedi ("quiz ekleri de silinsin belli süre sonra ve eski mesajlar");
tanıma "mesajlar ve duyurular … gönderildikten 1 yıl sonra silinir … Anketler de bitişinden 1 yıl sonra silinir." diye işlendi. Bu belge bugünkü kuralları ve gelecek süreyi bir arada
anlatır.

## Nereden açılır

- **Elle silmek:** Anketler → "Açtığın anketler" / "Okulun anketleri" → **"Sil"**, ya da sonuç penceresinin altındaki **"Sil"**
  ([Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md)).
- **Tasarımda:** taslak için "Taslaklarım" → çöp kutusu ([Anket oluştur](anket-olustur.md)); süresi dolan anketler kendiliğinden silinir
  (ekranı yok).

## Adım adım

### Müdür

1. Okulundaki her anketi (kim açtıysa) **"Sil"** ile silebilirsin: onay **"Anket ve bütün oylar silinsin mi? Bu geri alınamaz."** → anket,
   seçenekleri, hedef listesi ve oylar birlikte gider.
2. **"Anketler"** bölümünü Özellikler'den kapatmak hiçbir şeyi silmez; bölüm yeniden açılınca anketler ve oylar eskisi gibi görünür
   ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).
3. Bir öğretmeni okuldan çıkarınca o öğretmenin açtığı anketler okulda kalır; listede açan **"Silinmiş kullanıcı"** görünür. Öğretmenin
   başka anketlerdeki hedef satırı ve oyu silinir.

### Öğretmen

1. Kendi açtığın anketi "Sil" ile silebilirsin.
2. Hesabını silersen ya da okuldan ayrılırsan açtığın anketler okulda kalır, açan **"Silinmiş kullanıcı"** görünür; müdür yönetmeye
   devam eder ([Hesabımı sil](../ayarlar/hesabimi-sil.md)).
3. Tasarımda taslaklarını "Taslaklarım"dan silersin: **"“<ad>” taslağı silinsin mi?"** / **"Taslak geri getirilemez."** → **"Taslak
   silindi."**

### Öğrenci ve veli

1. Açık ankette oyunu **"Oyumu geri al"** ile silebilirsin ([Oy verme ve oyu geri alma](oy-verme.md)); bitmiş ankette oyun kalır.
2. Hesap silinirse (öğrenci hesabını okul siler, veli kendi hesabını "Hesabımı sil" ile) hedef listesindeki satırın ve oyun da silinir;
   sonuçtaki sayılar o kadar azalır.
3. Tasarımda "Kaydet, sonra devam et" ile kaydettiğin taslak yanıt gönderince silinir; gönderilmeden anket biterse sayılmaz.

### Yönetici

- Sitenin günlük yedeği anketleri, seçenekleri, hedef listelerini ve oyları (gizli anketlerinki dahil) içerir; yedekten geri yüklenince
  anketler de geri gelir ([Site yedekleri](../yonetim/yedekler.md)).
- Bir okul silinirse o okulun bütün anketleri de silinir.

## Kurallar ve sınırlar

- **Bugün süre yok:** anketler, oylar ve hedef listeleri kendiliğinden silinmez (aydınlatma metninin 7. bölümünde anketlerin saklama
  süresi yazmıyor; [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- **Elle silme:** yalnız anketi açan ve okulun müdürü; geri alınamaz.
- **Bağlı kayıtlar:** anket silinince seçenekleri, hedef listesi ve oyları da silinir. Hesap silinince o kişinin hedef satırı ve oyu
  silinir. Anketi açan silinince anket kalır ("Silinmiş kullanıcı"). Okul silinince anketleri gider.
- **Bölüm kapatma silmez.** Eğitim yılı geçişi de anketlere dokunmaz (anketler eğitim yılına bağlı değil).
- **İşlem kaydı:** anket açma, bitirme ve silme işlem kaydına yazılmaz.
- **Liste sınırı silme değildir:** 80 / 100 satırlık liste sınırının dışında kalan anket veritabanında durur.
- **Tasarımda (iş 7, optimizasyon ve saklama):** anketler bitişinden **1 yıl** sonra kendiliğinden silinir (yazılı yanıtlar dahil);
  süre gelince aydınlatma metnine de yazılır.
- **Verilerimi indir (öneri):** mantık denetiminde "anket cevapları ve taslak anketler" kişinin indirme listesinde olmadığı yazıldı;
  "saklanan her şeyi içerir" kararına göre eklenmesi öneriliyor ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — "Sil" düğmesi.
- [Gizli anket](gizli-anket.md) — yedekte de gizli anketin oyları var.
- [Anket oluştur](anket-olustur.md) — taslakların silinmesi.
- [Çok sorulu anketi doldurma](anket-doldurma.md) — taslak yanıtlar.

**İlgili:**

- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).
- [Hesabımı sil](../ayarlar/hesabimi-sil.md), [Verilerimi indir](../ayarlar/verilerimi-indir.md).
- [Site yedekleri](../yonetim/yedekler.md), [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md).
- [Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (`POST /api/anketler/sil`, `gorunum` — açan silinmişse "Silinmiş
  kullanıcı"), [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md) (`sil`, `oyGeriAl`),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 006: okul silinince anket, anket silinince seçenek/hedef/oy, hesap
  silinince hedef ve oy silinir; açan silinince boş kalır), [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedekte
  anketler).
- Testler: [testler/test-anket.md](../../testler/test-anket.md) (silme, silinen anketin listeden düşmesi),
  [testler/test-yedek.md](../../testler/test-yedek.md) (anket ve oyu yedekten geri gelir).

## Sık sorulanlar

- **Bitmiş anketler ne kadar saklanıyor?** Bugün süresiz; tasarımda bitişinden 1 yıl sonra silinecek.
- **Hesabımı silersem oyum ne olur?** Silinir; sonuçtaki sayılar azalır.
- **Okul "Anketler"i kapatınca oylar gider mi?** Hayır; bölüm yeniden açılınca her şey eskisi gibi.
- **Yanlışlıkla sildiğim anketi geri getirebilir miyim?** Sitede geri alma yok; ancak site yöneticisi bütün siteyi bir yedeğe döndürebilir
  (o andan sonraki her şey de geri gider).

## Sırada

- Optimizasyon + saklama süreleri: anketlerin bitişinden 1 yıl sonra silinmesi; aydınlatma metnine sürenin yazılması.
- Anket düzenleyici: yazılı yanıtlar ve taslaklar için aynı süre.
- Hesap paneli / Verilerimi indir: anket cevaplarının ve taslak anketlerin listeye eklenmesi (öneri).
