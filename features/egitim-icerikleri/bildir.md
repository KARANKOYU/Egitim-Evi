# Eğitim içerikleri · Videoyu bildir

**Durum:** Tasarlandı — henüz kodda yok

Her videonun altındaki "Bildir" düğmesi: neden seçip açıklama yazarak videoyu yönetici ve destek ekibine (ve eğitmene) bildirirsin;
kimin bildirdiği eğitmene söylenmez, sonucunu bildirim olarak alırsın.

## Ne işe yarar

Kullanıcının 28 Eylül sözü: "her videonun altında Bildir". Videolar ön onaysız yayına girdiği için (29 Eylül kararı) uygunsuz ya da
hatalı içeriği yakalamanın yolu budur; 5651 sayılı Kanun'a göre yer sağlayıcı olarak bildirim üzerine kaldırma sorumluluğu Eğitim
Evi'ndedir ([İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md)).

## Nereden açılır

İzleme sayfasında düğme satırının en sağı, uyarı simgeli **"Bildir"** ([İzleme sayfası](izleme-sayfasi.md)). YouTube'dan eklenen ve
Eğitim Evi'ne yüklenen her videoda var.

## Adım adım

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. **"Bildir"**e bas. **"Videoyu bildir"** penceresi açılır.
2. Nedeni seç (bir tane; Tasarım 1'deki seçenekler ve sırası):
   - **"Yanlış ya da eksik bilgi"**
   - **"Uygunsuz içerik"**
   - **"Telif hakkı"**
   - **"Ses ya da görüntü bozuk"**
   - **"Başka bir sorun"**
3. **"Açıklama"** kutusuna yaz (isteğe bağlı; yer tutucu **"Hangi dakikada, ne gördün?"**).
4. **"Gönder"**e bas. Neden seçmediysen: **"Bildirme nedenini seç."** Gönderilince ileti: **"Bildirimin eğitmene ve Eğitim Evi'ne
   iletildi. Teşekkürler."**
5. **"Vazgeç"** pencereyi kapatır.
6. Yönetici ya da destek bildirimi sonuçlandırınca sana sonuç bildirimi gelir (tanım).

### Ziyaretçi (giriş yapmamış)

**"Bildir"**e basınca **"Bunun için giriş yap"**; girince aynı videoya ve bildirim penceresine dönersin ([Girişsiz izleme](girissiz-izleme.md)).

**Tasarımda (Tasarım 1 önizlemesi):** ziyaretçide "Bildir" girişsiz açılıyor; tanım (29 Eylül, onaylı) giriş ister.

### Eğitmen

Kendi videosuna gelen bildirimleri panelinin **"Bildirilenler"** sayfasında görür (neden ve açıklama; bildirenin kim olduğu YOK)
([Bildirilenler](bildirilenler.md)).

### Yönetici ve destek

Bildirimler panelde kuyruğa düşer; video kaldırılır ya da bildirim reddedilir ([Bildirilenler](bildirilenler.md)).

## Kurallar ve sınırlar

- **Kimin bildirdiği yükleyene söylenmez.**
- **Bildirene sonuç bildirimi** gider (kaldırıldı / reddedildi).
- **Her işlem kayda geçer** (işlem kaydı).
- **Ön onay yok:** videolar yüklenince hemen yayındadır; denetim bildirimle olur.
- **Tanımla fark:** tanımın (28 Eylül) neden listesi "telif, uygunsuz, yanlış bilgi, kişisel veri, diğer" idi. Tasarım 1'de
  **"Kişisel veri"** yok, yerine **"Ses ya da görüntü bozuk"** var. KVKK yükümlülüğü yüzünden "Kişisel veri" (videoda bir öğrencinin
  izinsiz görünmesi gibi) seçeneğinin geri konması gerekir (kullanıcıya sorulacak).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Bildirilenler](bildirilenler.md) — eğitmen ve yönetim tarafı.
- [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md) — neden bildirim yolu var.
- [İzleme sayfası](izleme-sayfasi.md) — düğmenin yeri.
- [YouTube'dan kalkan videonun silinmesi](youtube-denetimi.md) — öbür kaldırma yolu.

**İlgili:**

- [Bu mesajı bildir](../mesaj/bu-mesaji-bildir.md) — mesajlardaki benzer bildirim.
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md) — sonuç bildirimi.
- [İşlem kaydı](../islem-kaydi/README.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- İşlem kaydı (`islemYaz`): [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).
- Bildirim tablosu ve telefon bildirimi: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md), [sunucu/push.md](../../sunucu/push.md).

## Sık sorulanlar

- **Bildirdiğimi eğitmen öğrenir mi?** Bildirimi görür ama kimin bildirdiğini görmez.
- **Bildirdim, ne olacak?** Yönetici ya da destek ekibi bakar; video kaldırılır ya da bildirim reddedilir, sonucu sana bildirilir.
- **Videoda ses kesiliyor; bildireyim mi?** Evet: "Ses ya da görüntü bozuk" ve açıklamaya dakikayı yaz.

## Sırada

- Eğitim içerikleri (iş 17): Bildir, kuyruk ve sonuç bildirimi.
- Neden listesine "Kişisel veri"nin geri konması kullanıcıya sorulacak.
