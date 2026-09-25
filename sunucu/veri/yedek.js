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

