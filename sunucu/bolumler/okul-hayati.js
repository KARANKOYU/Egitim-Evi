'use strict';
/* Okul hayatı: yemek listesi (/api/yemek), servisler (/api/servis),
   kulüpler (/api/kulupler).

   Görme kuralları:
     yemek   — okuldaki herkes; veli (ve çocuğu olan öğretmen) çocuğunun okulunu
     servis  — yönetim bütün servisleri; öğrenci kendi servisini; veli
               yalnızca çocuğunun servisini (şoför telefonu dahil) görür
     kulüp   — okuldaki herkes kulüp listesini; üye listesini yalnızca yönetim
               ve kulübün danışman öğretmeni; veli çocuğunun kulüplerini
   Düzenleme müdüre ve ilgili yetkisi verilmiş öğretmene açık. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { saatDuzelt } = require('../iliskiler');
const { clean, normTelefon, telefonSorunu, uid } = require('../ortak');
const { depo, cokluBildirim } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');

/* İki nokta arası metre (haversine). */
function mesafe(a, b) {
  const r = 6371000, rad = x => x * Math.PI / 180;
  const dEn = rad(b.enlem - a.enlem), dBoy = rad(b.boylam - a.boylam);
  const h = Math.sin(dEn / 2) ** 2 + Math.cos(rad(a.enlem)) * Math.cos(rad(b.enlem)) * Math.sin(dBoy / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

/* Gelen koordinat: sayı (ya da sayı yazılmış metin) ve aralıkta olmalı;
   boş, nesne, dizi kabul edilmez. */
const sayiAl = v => typeof v === 'number' ? v
  : (typeof v === 'string' && /^\s*-?\d{1,3}(\.\d{1,12})?\s*$/.test(v) ? Number(v) : NaN);
function koordinatAl(body) {
  const en = sayiAl(body.enlem), boy = sayiAl(body.boylam);
  if (!isFinite(en) || !isFinite(boy) || Math.abs(en) > 90 || Math.abs(boy) > 180) return null;
  if (en === 0 && boy === 0) return null;
  return { enlem: Math.round(en * 1e6) / 1e6, boylam: Math.round(boy * 1e6) / 1e6 };
}

const GUN_MS = 86400000;
const TARIH = /^\d{4}-\d{2}-\d{2}$/;

/* Verilen günün haftasının pazartesisi ('YYYY-AA-GG'). */
function haftaBasi(gun) {
  const d = new Date((TARIH.test(gun || '') ? gun : new Date().toISOString().slice(0, 10)) + 'T12:00:00Z');
  if (isNaN(d.getTime())) return haftaBasi('');
  const fark = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - fark * GUN_MS).toISOString().slice(0, 10);
}
const gunEkle = (gun, n) => new Date(new Date(gun + 'T12:00:00Z').getTime() + n * GUN_MS).toISOString().slice(0, 10);

/* Kişinin çocukları (okullarıyla). Öğrenci ve yöneticide boş. */
async function cocuklar(me) {
  if (!me.role || me.role === 'student' || me.role === 'admin') return [];
  return depo.kullanicilar.cocuklari(me.id);
}

/* Telefonu isteğe bağlı alan: boşsa '', yazılmışsa doğru biçimde olmalı. */
function telefonAl(deger, ad) {
  const t = clean(deger, 30);
  if (!t) return { deger: '' };
  if (telefonSorunu(t)) return { hata: ad + ' telefonu: ' + telefonSorunu(t).charAt(0).toLocaleLowerCase('tr') + telefonSorunu(t).slice(1) };
  return { deger: normTelefon(t) };
}

/* Seçim listeleri için okulun öğrencileri: yalnızca ad ve sınıf. */
async function okulOgrencileri(okulId) {
  const [ogrenciler, siniflar] = await Promise.all([
    depo.kullanicilar.okulun(okulId, { rol: 'student', durum: 'approved' }), depo.siniflar.okulun(okulId)]);
  const sinifAdi = new Map(siniflar.map(c => [c.id, c.name]));
  return ogrenciler.map(u => ({ id: u.id, ad: u.fullName, sinif: sinifAdi.get(u.classId) || '' }))
    .sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') || a.ad.localeCompare(b.ad, 'tr'));
}

const kulupGorunumu = u => ({
  id: u.id, ad: u.ad, aciklama: u.aciklama, danismanId: u.danisman_id || '', danisman: u.danisman_adi || '',
  kontenjan: u.kontenjan || 0, uyeSayisi: u.uye_sayisi, basvuruAcik: u.basvuru_acik, gunSaat: u.gun_saat
});

module.exports = { uclar, haftaBasi };
