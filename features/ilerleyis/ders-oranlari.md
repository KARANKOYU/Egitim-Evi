# İlerleyiş · Derslere göre başarı oranı

**Durum:** Kodda var

"Ödevler" kartının "Derslere göre" görünümü: her ders bir yığılmış sütun, sütunun üstünde o dersteki ödev başarı oranı
("%75").

## Ne işe yarar

[Ödev sonuçları grafiği](odev-grafigi.md) bütün ödevleri birlikte sayar; bu görünüm aynı sonuçları derslere ayırır:
"Matematik ödevlerimi yapıyorum ama Fen'de kaçırıyorum" gibi bir durumu gösterir. Her dersin sütunu sonuç renklerine
bölünür, üstünde tek bir sayı durur: o dersin başarı oranı.

Oranın kuralı ekranda da yazar: "Oran: yaptı tam, geç ve eksik yarım sayılır; izinli gelmemek oranı düşürmez."

## Nereden açılır

- [İlerleyişim sayfası](ilerleyisim.md)ndaki **"Ödevler"** kartında **"Derslere göre"** düğmesi.
- Velinin [İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md)nda her çocuğun "Ödevler" kartında aynı düğme.
- Müdür ve "Öğrenci portalına girer" yetkili öğretmen: öğrencinin portalında "İlerleyişi" → "Derslere göre".

Tasarım 1 önizlemesinde bu görünüm yok; önizlemedeki "Derslere göre ortalama" kutusu ödev oranını değil notları gösterir,
ayrı bir şeydir ([Derslere göre ortalama](derslere-gore-ortalama.md)). Kullanıcı bu görünümün kalkmasını söylemedi;
2 Ekim kararına göre (üzerine yorum yapmadığı ayrıntılar bugünkü site gibi) kalır.

## Adım adım

### Grafiğin düzeni (bugünkü site)

1. Her ders bir sütun; dersler adlarına göre alfabetik (Türkçe sırayla) soldan sağa.
2. Sütunun **üstünde** başarı oranı, ör. **"%75"**; hesaplanacak sonuç yoksa **"-"**.
3. Sütunun **içi** sonuç renklerine bölünür, alttan yukarı: Yaptı (yeşil), Geç yaptı (mavi), Eksik (turuncu), Yapmadı
   (kırmızı), Gelmedi izinli (gri), Gelmedi izinsiz (bordo). Her dilimin boyu o sonucun o dersteki payı kadar.
4. Sütunların **boyu** dersteki sonuçlu ödev sayısına göredir: en kalabalık ders en uzun (145 piksel), öbürleri ona oranla;
   sonuç yoksa 3 piksellik boş bir çubuk.
5. Sütunun **altında** dersin adı; 13 karakterden uzun adlarda yalnız ilk kelime ("Sosyal Bilgiler" → "Sosyal"). Tam ad
   fareyle sütunun üstüne gelince görünür.
6. Sütunların altında gösterge: "Yaptı", "Geç yaptı", "Eksik", "Yapmadı", "Gelmedi (izinli)", "Gelmedi (izinsiz)"; onun
   altında "Oran: yaptı tam, geç ve eksik yarım sayılır; izinli gelmemek oranı düşürmez."
7. Sonuçlanmış hiç ödev yoksa: "Henüz sonuçlanmış ödev yok."
8. Sütunlar yan yana 62 piksel genişliğinde; ders çoksa alan yatay kaydırılır.

### Öğrenci

1. [İlerleyişim](ilerleyisim.md)de "Ödevler" kartının başlığındaki **"Derslere göre"**ye bas. Görünüm anında değişir
   (sayfa yeniden yüklenmez); seçimin bu tarayıcıda hatırlanır, bir dahaki açılışta da bu görünüm gelir.
2. Her dersin üstündeki yüzdeye bak; dilimlerin renginden o derste hangi sonucu ne kadar aldığını gör.
3. Geri dönmek için **"Sonuçlara göre"**. **"Grafiği gizle"** bu görünümü de gizler.

Örnek: Matematik'te sonuçlanmış 6 ödevin var: 4 Yaptı, 1 Geç yaptı, 1 Yapmadı. Oran (4 + 1 × 0,5) / 6 = %75. Matematik en
kalabalık dersse sütunu en uzun olur; içinde yeşil dilim üçte ikisi, mavi ve kırmızı altıda birer.

### Veli

1. Menüde **"İlerleyiş"** → çocuğun "Ödevler" kartında **"Derslere göre"**.
2. Seçim bütün çocukların kartları için tek tercihtir: bir sonraki açılışta hepsi son seçilen görünümle gelir.

### Müdür, öğretmen ve çalışan

Öğrencinin portalında aynı görünüm. Yalnız okulunun kayıtlarındaki ödevler sayılır (nakil gelen öğrencinin eski okulu
girmez).

## Kurallar ve sınırlar

- **Formül (sunucuda hesaplanır):** oran = (Yaptı + (Eksik + Geç yaptı) × 0,5) / (Yaptı + Yapmadı + Eksik + Geç yaptı +
  Gelmedi izinsiz) × 100, tam sayıya yuvarlanır.
  - "Gelmedi (izinli)" paydaya girmez: izinli gelmemek oranı düşürmez.
  - "Gelmedi (izinsiz)" düşürür (paydada var, payda yok).
  - Bir derste yalnız izinli sonuç varsa oran hesaplanmaz, üstte "-" yazar.
- **Yalnız sonuçlanmış ödevler:** süren ödevler ve sonuç yazılmamış öğrenci bu görünümde sayılmaz (bunlar "Sonuçlara göre"de
  "Belirsiz"dir). Bir ders sonuçlanmış ödevi olduğu hâlde bu öğrenciye sonuç yazılmadıysa listede durur, sütunu boş ve "-"
  oranlıdır.
- **Eğitim yılı:** bakılan yılın ödevleri. Okulda "Ödevler" kapalıysa "Henüz sonuçlanmış ödev yok." yazar.
- **Seriyle farkı:** [ödev serisi](../odev/seri.md) "Yaptı" dışındaki her sonucu (izinli dahil) kaçırma sayar; başarı oranı
  izinliyi saymaz. İkisi ayrı kurallardır.
- **Kısaltılmış ad iki dersi aynı gösterebilir:** ilk kelimesi aynı iki uzun ders (ör. "Türk Dili ve Edebiyatı" ile
  uydurma "Türk Kültürü Tarihi") altta ikisi de "Türk" görünür; tam adı görmek için sütunun üstüne gel.
- **Quiz puanı girmez:** oran öğretmenin seçtiği sonuçtan hesaplanır.
- **Telefonda:** sütunlar sabit genişlikte kalır, sığmazsa alan yatay kaydırılır.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [Ödev sonuçları grafiği](odev-grafigi.md) — aynı kartın "Sonuçlara göre" görünümü ve "Grafiği gizle".
- [İlerleyişim sayfası](ilerleyisim.md), [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md).
- [Derslere göre ortalama](derslere-gore-ortalama.md) — tasarımda notların ders ders ortalaması (başka bir şey).
- [Sınav grafiği](sinav-grafigi.md), [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md),
  [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md).

**İlgili:**

- [Sonuçlandırma](../odev/sonuclandirma.md), [Sonuçları düzeltme](../odev/sonuclari-duzeltme.md), [Ödev serisi](../odev/seri.md).
- [Özel branş ve ders](../siniflar-dersler/ozel-brans-ve-ders.md) — ders adları buradan gelir.
- [Sınıflarım](../siniflar-dersler/siniflarim.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `progressOf` içinde `subjects: [{ subject,
  yapti, yapmadi, eksik, gec, izinli, gelmedi, toplam, oran }]` (ders adına göre Türkçe sıralı, `oran` formülü).
- Ön yüz: [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) — `ilerleyisKartlari`
  (`.g-ders`: yığılmış sütunlar düz HTML), `cubuk`, `kisalt`; görünüm değişimi
  [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md) (`odev-grafik-sekme`). Görünüm
  `public/css/parcalar/05-tablo-grafik.css` (`.grafik`, `.sutun-sar`, `.sutun-yigin`, `.sutun-us`, `.sutun-ad`,
  `.gosterge`) ve `25-grafik-sinav.css` (`.sutun-yigin i.gec`) ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: sunucu formülünü ayrıca deneyen bir test yok; [testler/test-ozellikler.md](../../testler/test-ozellikler.md)
  ödev kapalıyken listenin boş geldiğini dener.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İlerleyişim": "Başarı oranında yaptı tam, geç ve
  eksik yarım sayılır; izinli gelmemek oranı düşürmez.").

## Sık sorulanlar

- **İzinli gelmediğim ödev oranımı düşürür mü?** Hayır. İzinsiz gelmediğin düşürür.
- **Geç yaptığım ödev sayılmıyor mu?** Yarım sayılır (Eksik gibi).
- **Bir dersin üstünde "-" yazıyor.** O derste hesaba girecek sonuç yok (yalnız izinli ya da henüz sana sonuç yazılmamış).
- **Yüzde neden tam sayı?** Oran sunucuda tam sayıya yuvarlanır.

## Sırada

- Özel branş / ders (okulun kendi dersleri): ders sütunlarının sayısı artabilir; uzun adların kısaltması gözden geçirilmeli.
- Çok dil: gösterge ve oran açıklaması çeviri kataloğuna.
- Android yerel uygulama: İlerleyiş ekranında aynı oran.
