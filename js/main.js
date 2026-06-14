function setLang(lang) {
  document.body.classList.remove('lang-sr', 'lang-en');
  document.body.classList.add('lang-' + lang);
 document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'sr');

  var btnSr = document.getElementById('btn-sr');
  var btnEn = document.getElementById('btn-en');
  if (btnSr && btnEn) {
    btnSr.classList.toggle('active', lang === 'sr');
    btnEn.classList.toggle('active', lang === 'en');
    btnSr.setAttribute('aria-pressed', String(lang === 'sr'));
    btnEn.setAttribute('aria-pressed', String(lang === 'en'));
  }

  try { localStorage.setItem('ilicode-lang', lang); } catch(e) {}
}

document.addEventListener('DOMContentLoaded', function() {

  var saved;
  try { saved = localStorage.getItem('ilicode-lang'); } catch(e) {}
  if (saved === 'en') setLang('en');

  var btnSr = document.getElementById('btn-sr');
  var btnEn = document.getElementById('btn-en');
  if (btnSr) btnSr.addEventListener('click', function() { setLang('sr'); });
  if (btnEn) btnEn.addEventListener('click', function() { setLang('en'); });

  var nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

});
