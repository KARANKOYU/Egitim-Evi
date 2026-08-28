'use strict';
/* Klasör yolları ve ortam ayarları.
   Projenin kökü, public/ ve data/ konumları, port ve dinlenecek adres
   burada tek yerden belirlenir. EE_DATA ile veri klasörü, PORT ile port,
   HOST ile dinleme adresi değiştirilebilir. */

const path = require('path');

/* Proje kökü: bu dosya sunucu/ içinde, kök bir üstte. */
const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
/* Veri klasörü: EE_DATA ile değiştirilebilir. Böylece gerçek veriye
   dokunmadan ayrı bir test örneği çalıştırılabilir. */
const DATA = process.env.EE_DATA ? path.resolve(process.env.EE_DATA) : path.join(ROOT, 'data');
const DBF = path.join(DATA, 'db.json');
const PORT = Number(process.env.PORT) || 3000;
/* Ters vekil (Caddy/nginx) arkasındayken sunucunun dışarıya açık olmasına
   gerek yok: HOST=127.0.0.1 verilirse yalnızca yerelden dinler. */
/* '::' hem IPv6 hem IPv4'ü dinler (çift yığın). Yalnızca 0.0.0.0 dinlenince
   "localhost" yazan tarayıcı önce IPv6'yı deniyor, başarısız olunca IPv4'e
   düşüyor; bu her istekte ~200 ms bekletebiliyor. IPv6 kapalı makinede
   sunucu kendiliğinden 0.0.0.0'a düşer (index.js). */
const HOST = process.env.HOST || '::';

module.exports = {
  ROOT,
  PUB,
  DATA,
  DBF,
  PORT,
  HOST
};
