'use strict';
/* Roller, yetkiler ve kapsam.
   Müdürün tanımladığı özel roller, öğretmenin varsayılan yetkileri,
   ders/sınıf kapsamı ve dışarıya verilen kullanıcı görünümü (pub). */

const { bad } = require('./http');
const { SUBJECTS } = require('./ortak');
const { depo } = require('./veri');

