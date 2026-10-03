# Eğitim içerikleri · İzleme geçmişi

**Durum:** Tasarlandı — henüz kodda yok

"İzleme geçmişim" bölümü: izlediğin videolar en son izlenen en üstte, her birinde kaldığın yer ya da "İzledin"; tek tek kaldırılır,
"Geçmişi temizle" ile hepsi silinir. Bunu yalnız sen görürsün.

## Ne işe yarar

Kullanıcının 29 Eylül sözü: "kaldığı yer ve izleme geçmişini yalnız kişinin kendisi görsün". Dün yarım bıraktığın videoyu bulursun;
geçmişini istediğin an silersin.

## Nereden açılır

- Eğitim içerikleri sayfasının bölüm çiplerinde **"İzleme geçmişim · N"** ([Video listesi](video-listesi.md)).
- Tanıma göre Ayarlar'da **"İzleme geçmişini temizle"** ([Hesap ayarları sayfası](../ayarlar/hesap-ayarlari-sayfasi.md)).

## Adım adım

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. **"İzleme geçmişim · N"** çipine bas. Kartlar yerine satır listesi gelir.
2. Listenin üstünde: **"Bunu yalnız sen görürsün."** ve sağda **"Geçmişi temizle"**.
3. Her satır (en son izlediğin en üstte):
   - dersin renginde küçük kapak, oynat simgesi ve altında izlediğin oran kadar dolu ince çubuk,
   - videonun adı, altında "7. sınıf · Matematik · @deniz.ak",
   - **"7:52 / 12:40 · kaldığın yer · bugün"** ya da bitirdiysen **"İzledin · 12:40 · 3 gün önce"**,
   - sağda × düğmesi (ipucu **"Geçmişten kaldır"**).
4. Satıra bas: video açılır, kaldığın yerden sürer ([Kaldığın yerden devam](kaldigi-yerden-devam.md)).
5. ×'e bas: o video geçmişten çıkar, ileti **"Geçmişten kaldırıldı."**
6. **"Geçmişi temizle"**: **"İzleme geçmişin silinsin mi?"** / "Kaldığın yerler de silinir." → **"Sil"**; ileti **"İzleme geçmişin
   silindi."**
7. Geçmiş boşsa: **"İzleme geçmişin boş."** ve "İzlediğin videolar ve kaldığın yer burada görünür; bunu yalnız sen görürsün."
   Süzgeçle hiç kalmadıysa: **"Bu süzgeçte geçmişte video yok."**

## Kurallar ve sınırlar

- **Yalnız kişinin kendisi görür;** eğitmen, öğretmen, veli, müdür ve yönetici göremez. Eğitmen yalnız toplam sayıları görür
  ([İstatistikler](istatistikler.md)).
- **Sıra:** her zaman en son izlediğin en üstte; "Sırala:" seçicisi bu bölümde sırayı değiştirmez. Sınıf, ders ve arama süzgeçleri
  çalışır.
- **Bir video geçmişe** oynatmaya başladığın an girer; oynarken yerin güncellenir.
- **Silmek kaldığın yeri de siler.**
- **Ziyaretçide yok** (giriş gerekir; girişsiz izlemede kişisel veri tutulmaz).
- **Saklama süresi** tanımda ayrıca yazılmamış; kişi istediği zaman siler, hesap silinince gider.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Kaldığın yerden devam](kaldigi-yerden-devam.md) — geçmişin tuttuğu yer.
- [Süzgeç mantığı](suzgec-mantigi.md) — "İzleme geçmişim" bir bölümdür.
- [Kaydet ve Kaydettiklerim](kaydedilenler.md), [İndir ve İndirdiklerim](indirdiklerim.md) — öbür kişisel bölümler.

**İlgili:**

- [Hesap ayarları sayfası](../ayarlar/hesap-ayarlari-sayfasi.md) — "İzleme geçmişini temizle".
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kişi + video başına (oran, son izleme) tutan tablo; Ayarlar'daki düğme bugünkü Ayarlar sayfasına eklenir:
[public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md).

## Sık sorulanlar

- **Öğretmenim neyi izlediğimi görür mü?** Hayır.
- **Geçmişimi nasıl silerim?** "İzleme geçmişim"de "Geçmişi temizle" ya da tek tek ×.
- **Velim izlediğim videoları görür mü?** Hayır; geçmiş yalnız hesabın sahibinde.

## Sırada

- Eğitim içerikleri (iş 17): izleme geçmişi ve Ayarlar'daki "İzleme geçmişini temizle".
