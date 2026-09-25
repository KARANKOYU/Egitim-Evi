'use strict';
/*
  Yük testi: bir yıllık, kalabalık bir okulun verisini test veritabanına
  doldurur ve her rolün ekranlarını gerçek HTTP istekleriyle ölçer.

  Doldurulan (varsayılan): 1 büyük okul — 24 sınıf x 30 öğrenci = 720 öğrenci,
  40 öğretmen, 600 veli; yılda ders başına 25 ödev (~144 bin öğrenci-ödev
  satırı), yazılılar ve LGS denemeleri (~50 bin değer), ~23 bin devamsızlık,
  duyuru ve sınıf mesajları, kişi başı ~200 bildirim (~280 bin); yanına 30
  küçük okul (yönetici ekranları için).

  Ölçülen: her uç için 1 ısınma + 5 ölçüm; ortanca ve en kötü süre, cevap
  boyutu. 150 ms üstü ya da 150 KB üstü "yavaş/ağır" işaretlenir. Yazma
  işlemleri (yoklama, ödev verme, not girme, okula duyuru) ve 10 eşzamanlı
  kullanıcı da ölçülür.

  Sunucunun hız sınırına (dakikada 300 istek) takılmamak için istekler
  aralıklı atılır.

  YALNIZCA test veritabanında çalışır (adı _test ile bitmeli). Çalıştırma:
    1. Test sunucusunu boş veritabanıyla aç:
       EE_DATA=testler/testdata EE_DB_SIFIRLA=1 PORT=3200 node server.js
    2. EE_DATA=testler/testdata EE_BASE=http://localhost:3200 node araclar/yuk-testi.js
*/

