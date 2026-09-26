'use strict';
/* Anketler (/api/anketler).
   Toplu mesaj yetkisi olan kişi (müdür ya da yetki verilmiş öğretmen) okula,
   rol grubuna ya da sınıflara tek soruluk anket açar. Hedefteki herkes
   bitişe kadar bir oy verir, fikrini değiştirebilir.

   Kurallar sunucuda ve veritabanında: hedef listesi açılışta çözülür, oy
   yalnızca açık ankette, listedeki kişi için ve o anketin seçeneğine yazılır.
   Sonuçları anketi açan ve okulun müdürü her an görür; oy verenler anket
   bitince görür. Gizli ankette kimin neyi seçtiği hiç kimseye gönderilmez. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { saatDuzelt } = require('../iliskiler');
const { clean, uid } = require('../ortak');
const { depo, topluBildir } = require('../veri');
const { okulGerek, yetkiVarMi } = require('../yetki');
const { mesajAlicilariCoz } = require('./mesaj');

const SECENEK_EN_AZ = 2;
const SECENEK_EN_FAZLA = 10;
const EN_UZUN_GUN = 90;

/* Anketi yönetebilir mi (sonuç, kapatma, silme): açan kişi ya da okulun müdürü. */
function yonetebilir(me, a) {
  if (!a || a.okul_id !== me.schoolId) return false;
  return a.olusturan_id === me.id || me.role === 'principal';
}

