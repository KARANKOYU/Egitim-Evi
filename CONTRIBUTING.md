# Katkıda bulunma — Eğitim Evi

Eğitim Evi bir okul grup projesi olarak 28 Ağustos 2026'da başladı. Bu dosyada projeye nasıl katkıda bulunulacağı yazar.

## Katkıda bulunanlar

Kimin hangi fikirle katkı verdiği [README.md](README.md)'de yazar.

## Nasıl katkıda bulunulur

1. **Önce oku:** [TANITIM.md](TANITIM.md) projenin bütün düzenini ve belge haritasını anlatır. Değiştireceğin her kod dosyasının
   yanında aynı adlı bir `.md` vardır.
2. **Kurallar**
   - Node 24 ve PostgreSQL 17; tek npm bağımlılığı `pg`. Yeni bağımlılık ekleme.
   - Ön yüz ES5, çerçevesiz; `public/js/parcalar/*.js` ad sırasıyla tek dosyada birleşir.
   - SQL yalnız `sunucu/veri/depo/` altında ve her zaman parametreli.
   - Veritabanı değişikliği yeni numaralı bir şema dosyasıyla yapılır (`sunucu/veri/sema/NNN-ad.sql`); eski şema dosyaları değişmez.
   - Kişisel veri işleyen ya da gösteren her değişiklik aynı işte aydınlatma metnini (`public/kvkk/kvkk.html`) günceller ve
     `KVKK_SURUM`'u artırır.
   - Bir kod dosyasını değiştiren, yanındaki `.md`'nin ilgili bölümlerini ve "Son durum"unu da günceller.
   - `data/` klasörü, şifreler, anahtarlar ve kişisel bilgiler depoya girmez (`testler/test-gizli-dosyalar.js` bunu denetler).
   - Arayüz Türkçe; arayüzde emoji kullanılmaz.
3. **Test:** `bash testler/tumtest.sh` — bütün paketler `egitimevi_test` veritabanıyla 3200 portunda çalışır; sonuç `KALDI: 0` ve
   `DENETIM SORUNU: 0` olmalı. Yeni davranışa test ekle.
4. **Hata ve öneri:** GitHub'da bir issue aç: ne yaptın, ne bekledin, ne oldu. Güvenlik açığı bulduysan herkese açık yazma; proje
   sahibine doğrudan bildir.
5. **Değişiklik gönderme:** kendi dalında çalış, testleri çalıştır, ne değiştiğini ve nasıl denediğini açıklayan bir pull request aç.
