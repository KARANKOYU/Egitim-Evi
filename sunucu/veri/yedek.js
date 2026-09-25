'use strict';
/* Yedekleme: bütün veri JSON dosyası olarak data/yedek/ altına yazılır.

   Neden pg_dump değil: JSON yedek uygulamanın kendi biçiminde, elle
   okunabiliyor, sürüm farkından etkilenmiyor ve yönetici panelinden tek
   tıkla geri yüklenebiliyor. Sunucuda ayrıca günlük pg_dump da alınır
   (belge/SUNUCUYA-KURULUM.md); ikisi birbirinin yedeği. */

const fs = require('fs');
const path = require('path');
const { DATA } = require('../yollar');
const { iceAktar, disaAktar } = require('./json-aktarim');

const YEDEK_KLASOR = path.join(DATA, 'yedek');
const YEDEK_SAKLA = 14;                       // kaç kopya tutulsun
const YEDEK_ARALIK_MS = 6 * 60 * 60 * 1000;   // 6 saatte bir kontrol

