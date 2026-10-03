# Eğitim içerikleri · Eğitmen serileri (herkese açık liste)

**Durum:** Tasarlandı — henüz kodda yok

Eğitmenin panelindeki "Oynatma listelerim": 4 liste hakkı, liste başına 100 video; bir liste "Herkese açık seri" işaretlenince Eğitim
içeriklerinde herkese görünür ve bağlantısı (`/watchlist/<kimlik>`) her zaman açıktır.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "eğitmene 4 liste hakkı". Tanımda eğitmen "herkese açık seri yapar; liste sırayla/otomatik sonraki videoyla
oynar". Eğitmen "LGS matematik kampı" gibi sıralı bir ders dizisi kurar; öğrenciler sırasıyla izler.

## Nereden açılır

- **Eğitmen:** panel → sol menü **"Oynatma listelerim"** ya da ana sayfadaki kutucuk ("3 / 4 liste") ([Eğitmen paneli](egitmen-paneli.md)).
  Sayfanın alt başlığı: "Eğitmene 4 liste · liste başına 100 video".
- **İzleyen (ziyaretçi dahil):** Eğitim içeriklerinde herkese açık seriler ve serinin bağlantısı `egitimevi.org/watchlist/<kimlik>`
  ([Adresler](adresler.md)).

## Adım adım

### Eğitmen

1. Sayfanın üstünde **"3 / 4 liste hakkı kullanılıyor"** ve **"Liste aç"** düğmesi. Dört liste varken düğme pasif, altında: "4 liste
   hakkının hepsini kullandın. Yeni liste açmak için önce bir listeyi sil."
2. **"Listeler"** kutusunda her liste: ad, "12 / 100 video · <açıklama>", durum (**"Herkese açık seri"** yeşil / **"Bağlantıyla paylaşıldı"**
   / **"Yalnız sen"**) ve **"Paylaş"**. Altta: "Herkese açık seri Eğitim içeriklerinde herkese görünür. Öbür listeler yalnız sana açıktır;
   “Paylaş” ile bağlantı verebilirsin." Hiç liste yoksa: **"Henüz listen yok."** "“Liste aç” ile başla."
3. **"Liste aç"** penceresi:
   - **"Liste adı"** (yer tutucu "ör. LGS matematik tekrar", en çok 60 karakter),
   - **"Açıklama"** (isteğe bağlı, en çok 200 karakter),
   - **"Görünürlük"**: kutu **"Herkese açık seri olarak yayımla"** — "Seri Eğitim içeriklerinde herkese görünür; bağlantısı her zaman açıktır.
     İşaretlemezsen liste yalnız sana açık olur; istersen sonra “Paylaş” ile bağlantı verirsin.",
   - not "Bu 4. listen olacak · eğitmene 4 liste, liste başına 100 video.",
   - **"Vazgeç"** / **"Aç"**. Hatalar: **"Listenin adını yaz."**, **"Bu adla bir listen var; başka bir ad yaz."**, **"4 liste hakkının hepsini
     kullandın."** Açılınca: **"“LGS matematik kampı” listesi açıldı ve herkese açık seri olarak yayımlandı. Video eklemek için listeye
     dokun."** (seri değilse "… listesi açıldı. Video eklemek için listeye dokun.").
4. **Listeye dokun** → listenin penceresi: "12 / 100 video · açıklama", **"Herkese açık seri"** anahtarı ("Eğitim içeriklerinde herkese
   görünür; bağlantısı her zaman açık"), numaralı video listesi (ad; "7. sınıf · Matematik · @deniz.ak · 12:40"; sağda × "Listeden
   çıkar"). Kaldırılmış video: **"Bu video kaldırıldı"** / "Artık izlenemez; listeden çıkarabilirsin." Boşsa "Listede video yok. “Video
   ekle” ile başla."
5. **"Video ekle"** → **"Eğitim içeriklerinde ara"** kutusu (yer tutucu "Video, ders, sınıf ya da etiket"); sonuçlarda en çok 8 video
   (önce kendi videoların), her birinde **"Ekle"** → ileti **"“…” listeye eklendi."** Fazlası varsa "N video daha var; aramayı daralt.";
   yoksa "Bu aramayla eklenecek video yok."; liste doluysa "Liste dolu: liste başına en çok 100 video."
6. **Anahtar:** "Herkese açık seri"yi aç → **"“…” herkese açık seri oldu; Eğitim içeriklerinde görünür."**; kapat → **"“…” artık seri değil;
   bağlantısı olanlar açmaya devam eder, “Paylaş”tan durdurabilirsin."**
7. Pencerenin altında: kırmızı **"Listeyi sil"** (**"“…” listesi silinsin mi?"** / "Videolar silinmez; yalnız liste kalkar. Paylaşılan
   bağlantı da artık açılmaz." → **"“…” listesi silindi."**), **"Paylaş"**, **"Tamam"**.
8. **"Paylaş"**: seri ise "Bu liste herkese açık seri: Eğitim içeriklerinde herkese görünür, bağlantısı her zaman çalışır." + bağlantı +
   **"Kopyala"** + "Seriyi kapatmak için listeyi açıp “Herkese açık seri” anahtarını kapat."; değilse [Listeyi paylaş](listeyi-paylas.md)
   (Bağlantı oluştur / Paylaşmayı durdur).

### İzleyen (herkes, ziyaretçi dahil)

1. Herkese açık seri Eğitim içeriklerinde görünür; serinin bağlantısı girişsiz açılır.
2. Seri sırayla oynar; bir video bitince sıradaki başlar (tanım).
3. Seriyi düzenleyemez; giriş yaptıysa videoları kendi Kaydettiklerim'ine ekler.

**Tasarımda (Tasarım 1 önizlemesi):** eğitmen tarafı tam; izleyici tarafında serilerin Eğitim içeriklerinde nerede ve nasıl göründüğü
(seri kartı, seri sayfası) ve sırayla oynatma çizilmedi.

## Kurallar ve sınırlar

- **Eğitmene 4 liste hakkı** (seriler de bu 4'ten; önceki "50 seri" sınırı kaldırıldı). Liste başına 100 video. Kaydettiklerim sayılmaz.
- **Herkese açık seri** her zaman açık bağlantılıdır (`/watchlist/<kimlik>`, 12 karakter rastgele); arama motorunda dizinlenebilir.
- **Seri kapatılınca** bağlantı ölmez: liste Eğitim içeriklerinden çekilir ve "Bağlantıyla paylaşıldı" olur; bağlantıyı da kapatmak için
  "Paylaş" → "Paylaşmayı durdur".
- **Eğitmenlik alınınca** fazla listeler silinmez, salt okunur kalır; yenisi açılamaz. **Hesap silinince** seriler de silinir.
- **Kaldırılan video** seride "Bu video kaldırıldı" satırı olur.
- **Liste adı** 60, açıklama 200 karakter; aynı adla iki liste olmaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatma listeleri](oynatma-listeleri.md) — herkesin 2 listesi (eğitmenin listeleri de aynı kurallarla).
- [Listeyi paylaş](listeyi-paylas.md) — bağlantı ve durdurma.
- [Adresler](adresler.md), [Girişsiz izleme](girissiz-izleme.md), [Eğitmen paneli](egitmen-paneli.md).

**İlgili:**

- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca liste tablosuna "seri" işareti ve paylaşım kimliği (yeni şema dosyası,
[sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).

## Sık sorulanlar

- **Beşinci listeyi açamıyorum (eğitmen).** Eğitmene 4 liste hakkı var; birini sil.
- **Seri ile paylaşılan liste farkı ne?** Seri Eğitim içeriklerinde herkese görünür; paylaşılan liste yalnız bağlantısı olana açılır.
- **Serimde başka eğitmenin videosu olabilir mi?** Evet; Eğitim içeriklerindeki her video eklenebilir.

## Sırada

- Eğitim içerikleri (iş 17): seriler, izleyici tarafındaki seri görünümü ve sırayla oynatma (önizlemede yok; HTML işinde çizilmeli).
