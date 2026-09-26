/* Uygulama durumu: giriş anahtarı, kullanıcı, açık sayfa, filtreler. Her parça bu S nesnesini görür. */

var S = {
  token: null, user: null, children: [],
  meta: { cities: [], subjects: [] },
  page: 'ana',
  viewStudentId: null, viewStudentName: '',
  veliCocuk: null,          /* veli panelinde şeritten seçilen çocuk (null = hepsi) */
  /* Yetişkin hesabı: sol menüdeki "Portallarım" (okul rolleri ve çocuklar; öteki
     hesaplarda null), oturum yetişkin hesabının kendisinde mi, ve orada portal
     dışında mı (ana sayfası "Portalların"; 08c-kisilikler.js). */
  portallar: null, hesapAktif: false, portalDisi: false,
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
