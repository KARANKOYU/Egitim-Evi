# Eğitim içerikleri · Oynatma listeleri (Listeye ekle)

**Durum:** Tasarlandı — henüz kodda yok

Kişinin kendi adlı video listeleri: videodaki "Listeye ekle" ile oluşturulur ve doldurulur; kişi başına 2 liste (eğitmende 4, destek
ve yöneticide sınırsız), liste başına 100 video; liste yalnız video kimliklerini tutar ve başta yalnız sahibine açıktır.

## Ne işe yarar

Kullanıcının 29 Eylül sözleri: "videoyu kaydet ve oynatma listesi mantığı", "oynatma listesi private ve 2 taneyle sınırlı, sadece link
tutar", "liste başına 100", "eğitmene 4 liste hakkı, destek vb. admin sınırsız" ve "optimize etmek için watch list direkt id tutar".
Öğrenci "LGS matematik" gibi kendi çalışma sırasını kurar.

## Nereden açılır

- İzleme sayfasında **"Listeye ekle"** düğmesi ([İzleme sayfası](izleme-sayfasi.md)) → **"Listeye ekle"** penceresi.
- Eğitim içerikleri sayfasının bölüm çiplerinde her liste: **"<liste adı> · N"** ([Video listesi](video-listesi.md)).
- Eğitmen listelerini panelinde **"Oynatma listelerim"**den yönetir ([Eğitmen serileri](egitmen-serileri.md)).

## Adım adım

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi; eğitmen, destek ve yönetici de)

**Listeye ekleme penceresi:**

1. Videoda **"Listeye ekle"**ye bas. **"Listeye ekle"** penceresi açılır.
2. Her listen bir satır: solda kutucuk (video listedeyse işaretli), listenin adı, altında **"N / 100 video"**; sağda
   **"Listeyi paylaş"** düğmesi ([Listeyi paylaş](listeyi-paylas.md)).
3. Kutucuğu işaretle: video listeye girer, ileti **"“LGS matematik” listesine eklendi."**; işareti kaldır: **"“LGS matematik” listesinden
   çıkarıldı."** Sayaç hemen güncellenir. Pencere açık kalır (birden çok listeye ekleyebilirsin).
4. Liste doluysa (100) işaret konmaz, ileti: **"“LGS matematik” dolu: liste başına en çok 100 video."**
5. Altta **"Yeni liste"** düğmesi: basınca **"Listenin adı"** kutusu ve **"Oluştur"** çıkar. Adı yaz, "Oluştur": liste açılır ve açık
   olan video içine eklenir; ileti **"“Fen tekrar” listesi açıldı ve video eklendi."**
6. Hatalar: ad boşsa **"Listeye bir ad ver."**; aynı adda listen varsa **"Bu adla bir listen var."**; hakkın dolmuşsa (2 liste)
   "Yeni liste"ye basınca: **"En çok 2 listen olabilir. Yeni liste açmak için Eğitim içeriklerinde bir listeni sil."**
7. Pencerenin altında: **"Kişi başına 2 liste · liste başına 100 video"** ve **"Tamam"**.

**Listeyi açma ve silme:**

1. Eğitim içerikleri sayfasında listenin çipine bas (ör. **"LGS matematik · 3"**): yalnız o listedeki videolar kalır.
2. Sonuçların başında listenin satırı: kalın ad, **"3 / 100 video"**, **"Listeyi paylaş"** ve **"Listeyi sil"**.
3. **"Listeyi sil"** sorar: **"“LGS matematik” listesi silinsin mi?"** / "Videolar silinmez; yalnız liste kalkar." → **"Sil"**; ileti
   **"“LGS matematik” listesi silindi."**, sayfa "Bütün videolar"a döner.

**Oynatma (tanım):** liste sırayla oynar; bir video bitince sıradaki kendiliğinden başlar.

### Ziyaretçi (giriş yapmamış)

**"Listeye ekle"**ye basınca **"Bunun için giriş yap"** ([Girişsiz izleme](girissiz-izleme.md)). Paylaşılmış bir listeyi açabilir,
oynatabilir ama düzenleyemez ([Listeyi paylaş](listeyi-paylas.md)).

## Kurallar ve sınırlar

- **Liste hakkı:** herkes 2; **eğitmen 4**; **destek ve yönetici sınırsız** (kötüye kullanıma karşı teknik tavan 1000).
  "Kaydettiklerim" hiçbirinde sayılmaz ([Kaydet ve Kaydettiklerim](kaydedilenler.md)).
- **Liste başına en çok 100 video** — herkes için aynı.
- **Yalnız kimlik tutar:** liste yalnız video kimliklerini saklar (kopya yok); tablo satırı (liste, video, sıra, eklenme), birincil
  anahtar (liste, video) → aynı video bir listeye iki kez giremez. Başlık ve küçük resim gösterilirken tek sorguyla videolardan gelir.
- **Başta yalnız sahibine açık;** "Listeyi paylaş" ile bağlantı verilir ([Listeyi paylaş](listeyi-paylas.md)).
- **Kaldırılan video:** listede **"Bu video kaldırıldı"** satırı olur (sessizce kaybolmaz); kişi o satırı listeden çıkarır.
- **Rol alınınca:** eğitmenliği alınan kişinin hakkını (2) aşan listeleri silinmez, salt okunur kalır; yenisi açılamaz (tanım).
  Destek ya da yönetici rolü alınınca da aynısı beklenir, ama tanımda yalnız eğitmenlik yazıyor.
- **Liste adı** en çok 60 karakter; aynı adla iki liste olmaz (büyük/küçük harf ve Türkçe harf farkı aynı sayılır).
- **Tasarımda (Tasarım 1 önizlemesi):** listenin "sırayla / otomatik sonraki" oynaması yok; liste yalnız süzgeç gibi videoları gösteriyor.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Kaydet ve Kaydettiklerim](kaydedilenler.md) — listeden ayrı "sonra izle".
- [Listeyi paylaş](listeyi-paylas.md) — bağlantı ve durdurma.
- [Eğitmen serileri](egitmen-serileri.md) — eğitmenin 4 listesi ve herkese açık seri.
- [Süzgeç mantığı](suzgec-mantigi.md) — liste bir bölümdür.

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca yeni tablolar (liste ve liste–video; yeni şema dosyası, [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).

## Sık sorulanlar

- **Üçüncü listeyi açamıyorum.** Kişi başına 2 liste var; birini sil ya da videoyu "Kaydet" ile Kaydettiklerim'e koy.
- **Listemdeki video "Bu video kaldırıldı" diyor.** Eğitmen videoyu kaldırmış ya da YouTube'dan silinmiş; satırı listeden çıkarabilirsin.
- **Listeyi silince videolar da silinir mi?** Hayır; yalnız liste kalkar.

## Sırada

- Eğitim içerikleri (iş 17): oynatma listeleri, sırayla oynatma ve "Bu video kaldırıldı" satırı.
