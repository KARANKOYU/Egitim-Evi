/* Uygulama durumu: giriş anahtarı, kullanıcı, açık sayfa, filtreler. Her parça bu S nesnesini görür. */

var S = {
  token: null, user: null, children: [],
  meta: { cities: [], subjects: [] },
  page: 'ana',
  viewStudentId: null, viewStudentName: '',
  veliCocuk: null,          /* veli panelinde şeritten seçilen çocuk (null = hepsi) */
  unread: 0,
  /* ödev filtreleri + sayfaya özel arama kancası */
  odevF: { ders: '', yildiz: '', durum: '', bas: '', bit: '', mod: 'ogrenci' },
  odevHam: [],
  araHook: null,
  /* ders programı ekranı */
  programSinif: '', programSiniflar: [], programVeri: null, programUyari: '',
  programGun: 0, programGorunum: 'gun', cakismaAcik: false,
  sinifBilgi: null, dersBilgi: null,
  bekleyenKayit: null,
  odevHedef: null, odevSinif: ''
};
