# Eğitim içerikleri · Ders süzgeci

**Durum:** Tasarlandı — henüz kodda yok

Süzgeç sütununun "Ders" bölümü: dersler kademe başlıklarının (İlkokul, Ortaokul, Lise) altında, katlanabilir gruplarda,
kutucuklu ve yanlarında o an kaç video geleceğini söyleyen sayıyla.

## Ne işe yarar

Kullanıcının 1 Ekim sözü: "1-12 ve inkılap var fizik var lisede … filtreler de derslerde lise ortaokul altında olacak". Ortaokul
ile lisenin dersleri farklıdır (lisede Fizik, Kimya, Biyoloji; ortaokulda Fen Bilimleri); aynı adlı ders (Matematik, T.C.
İnkılap Tarihi) iki kademede ayrı tutulur ki 8. sınıf öğrencisi lise matematiğine düşmesin.

## Nereden açılır

Eğitim içerikleri sayfasında süzgeç sütununun "Sınıf" bölümünün altı, başlığı **"Ders"**. Dar ekranda önce **"Süzgeçler"**
düğmesi ([Video listesi](video-listesi.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. **"Ders"** başlığının altında kademe grupları var. Her grubun başlık satırında: aşağı ok, kademenin adı, (seçili ders varsa)
   seçili ders sayısı rozeti ve sağda küçük yazıyla sınıf aralığı ("1–4. sınıf", "5–8. sınıf", "9–12. sınıf").
2. Grupların dersleri (Tasarım 1'deki sıra):
   - **İlkokul:** Türkçe, Matematik, Hayat Bilgisi, Fen Bilimleri, Sosyal Bilgiler, İngilizce.
   - **Ortaokul:** Türkçe, Matematik, Fen Bilimleri, Sosyal Bilgiler, T.C. İnkılap Tarihi, İngilizce, Din Kültürü.
   - **Lise:** Türk Dili ve Edebiyatı, Matematik, Fizik, Kimya, Biyoloji, Tarih, T.C. İnkılap Tarihi, Coğrafya, Felsefe,
     İngilizce.
3. Her ders satırında kutucuk, dersin adı ve sağda sayı (ör. "Matematik 4"). Sayı, o dersi de seçersen öbür süzgeçlerinle
   birlikte kaç video geleceğidir.
4. Kutucuğu işaretle: sonuçlar o derse iner, özet satırına **"Matematik · Ortaokul"** biçiminde çip gelir. Birden çok ders
   işaretleyebilirsin; videolar seçtiğin derslerden BİRİNDEN olur.
5. Grup başlığına basarak grubu katlarsın/açarsın (katlıyken dersler gizli; seçimler durur, rozet sayısı görünür).
6. Ders seçimi varken **"Ders"** başlığının sağında **"Temizle"** belirir; yalnız ders seçimlerini kaldırır.
7. Yukarıda bir sınıf seçtiysen yalnız o sınıfın kademesi görünür; altta "Seçtiğin sınıfların dersleri görünüyor." yazar.

### Eğitmen (video yüklerken)

Video yüklerken ve düzenlerken **"Ders"** açılır listesinde aynı dersler aynı kademe başlıkları altında gruplu durur; videonun
bir dersi olur ([Video bilgileri](video-bilgileri.md)). Tasarım 1'de varsayılan "Ortaokul · Matematik".

## Kurallar ve sınırlar

- **Ders = kademe + ad.** "Matematik · Ortaokul" ile "Matematik · Lise" ayrı seçeneklerdir; videonun kademesi sınıfından gelir
  (1–4 İlkokul, 5–8 Ortaokul, 9–12 Lise).
- **Seçimler "ya da"**, öbür süzgeçlerle "ve" ([Süzgeç mantığı](suzgec-mantigi.md)).
- **Sayılar canlı:** sınıf, arama ve bölüm değişince her dersin sayısı yeniden hesaplanır; ders süzgecinin kendisi sayıya
  katılmaz.
- **0 videolu ders soluk** görünür (seçiliyse soluk değildir); işaretlenebilir.
- **Gizlenen kademenin seçimi düşer:** sınıf seçimi bir kademeyi gizlerse o kademedeki ders seçimleri kalkar.
- **Ders listesi site geneli ve sabittir:** okulun kendi ders listesinden (bugün kodda 9 ders) ayrıdır; eğitim içerikleri
  okula bağlı değildir.
- **Dersin rengi:** her dersin bir rengi var (Matematik kırmızı, Türkçe ve Türk Dili ve Edebiyatı turuncu, Fen Bilimleri, Hayat
  Bilgisi ve Biyoloji yeşil, Sosyal Bilgiler mor, T.C. İnkılap Tarihi ve Tarih sarı, İngilizce ve Coğrafya mavi, Din Kültürü ve
  Kimya camgöbeği, Fizik lacivert, Felsefe gri); Tasarım 1'de kartın küçük resmi yerine bu renk kullanılır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Sınıf süzgeci](sinif-ve-kademe-suzgeci.md) — ders listesini daraltan sınıf seçimi.
- [Süzgeç mantığı](suzgec-mantigi.md) — birleşme kuralı ve canlı sayılar.
- [Etkin süzgeç çipleri](etkin-suzgecler.md) — "Matematik · Ortaokul" çipi.
- [Video bilgileri](video-bilgileri.md) — eğitmenin ders seçmesi.

**İlgili:**

- [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md) — okulların kendi ders listesi (ayrı liste).

## Kod tarafı

Bugün kodda yok. İlgili bugünkü parça:

- Okulun ders listesi `SUBJECTS` (9 ders, lise dersleri yok): [sunucu/ortak.md](../../sunucu/ortak.md). Eğitim içeriklerinin
  kademeli listesi bundan ayrı tutulacak.

## Sık sorulanlar

- **8. sınıf matematiğini arıyorum, lise matematiği de geliyor.** "Matematik · Ortaokul"u seç ya da yukarıdan 8. sınıfı seç.
- **T.C. İnkılap Tarihi iki yerde var.** Ortaokulda (8. sınıf) ve lisede ayrı derstir; ikisini de işaretleyebilirsin.
- **Fizik neden ortaokulda yok?** Ortaokulda "Fen Bilimleri" var; Fizik, Kimya, Biyoloji lisede.

## Sırada

- Eğitim içerikleri (iş 17): ders süzgeci.
- Listeye sonradan ders eklenmesi (ör. lisenin seçmeli dersleri) yönetimden mi yapılacak, sabit mi kalacak — tanımda yok.
