'use strict';
/*
  Deneme okulu: elle denemek için aynı okula bağlı hesaplar kurar.

    Kullanıcı adı   E-posta                    Durum
    mudur           mudur@deneme.test          okulun müdürü (okul onaylı)
    ogretmen        ogretmen@deneme.test       Matematik öğretmeni (kendi hesabını açtı, müdür koduyla ekledi)
    ogrenci         ogrenci@deneme.test        öğrenci, SINIFSIZ (sınıfı müdür ekranından sen aç, yerleştir)
    veli            veli@deneme.test           öğrenciye bağlı veli (kendisi kaydoldu)
    servisci        —                          servisçi, "1. Servis"e atanmış; öğrenci bu serviste
    yeni.veli       yeni.veli@deneme.test      ROLSÜZ: kaydolmuş, henüz çocuğunu bağlamamış
    Şifre (hepsi): Deneme2026!
    (Güçlü şifre kuralından önce açılmış deneme hesaplarında: Deneme2026)

  Okulun adresi: /deneme-ortaokulu (öğretmen, öğrenci ve servisçi oradan girer).

  Hesaplar gerçek uçlardan (API) geçer: müdür, öğretmen ve veli yetişkin
  hesabı açar (aydınlatma onayı, bot sorusu aynen çalışır); müdür okulunu
  kaydeder, öğretmeni koduyla ekler, öğrenci ve servisçi hesabını açar;
  veli veli kodunu girer. Yalnızca müdürlük
  başvurusunun "yönetici onayı" adımı doğrudan veritabanında yapılır;
  yönetici şifresi bu araçta yok.

  Tekrar çalıştırılırsa var olan hesaplara dokunmaz, eksik olanı tamamlar.
  Sonunda her rol için bir oturum anahtarı yazar (tarayıcı sekmelerini
  hazır açmak için); anahtarlar 7 gün geçerlidir.

  Çalıştırma (sunucu açıkken, günlüğü sunucu.log dosyasına yazarak):
    node sunucu/index.js > sunucu.log
    EE_LOG=sunucu.log node araclar/deneme-okulu.js
*/

