(() => {
const C = CONFIG, $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ICONS = {
  grow: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.5 6 5"/>'
};
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 3400); };

document.querySelectorAll('[data-c]').forEach(e => e.textContent = C[e.dataset.c]);
$('#yr').textContent = new Date().getFullYear();
$('#photo').src = C.photo;

$('#aboutGrid').innerHTML = C.about.map(a => `<div class="card"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[a.icon] || ''}</svg><p>${esc(a.text)}</p></div>`).join('');

const R = C.repoint;
$('#rpH').textContent = R.heading; $('#rpIntro').textContent = R.intro; $('#rpCta').textContent = R.cta; $('#rpRisk').textContent = R.risk;
$('#rpImg').src = R.image;
$('#rpSteps').innerHTML = R.steps.map(s => `<li><b>${esc(s.t)}</b><span>${esc(s.d)}</span></li>`).join('');
$('#rpCta').onclick = () => { $('#form').s.selectedIndex = 0; };

function embed(u) {
  let m;
  if (m = u.match(/(?:youtu\.be\/|[?&]v=)([\w-]{6,})/)) return 'https://www.youtube.com/embed/' + m[1] + '?rel=0&autoplay=1';
  if (m = u.match(/aparat\.com\/v\/(\w+)/)) return 'https://www.aparat.com/video/video/embed/videohash/' + m[1] + '/vt/frame';
  return '';
}
const dlg = $('#dlg'), body = $('#dbody');
function open(v) {
  if (!v.url) {
    body.innerHTML = `<h3>${esc(v.title)}</h3><p class="note">${esc(v.logline || v.desc)}</p><ol>${(v.scenes || []).map(s => `<li><b>${esc(s.t)}:</b> ${esc(s.d)}</li>`).join('')}</ol><p class="note" style="margin-top:18px">این فقط یک طرح و سناریو است و ویدیوی تولیدشده نیست. برای افزودن ویدیوی واقعی، لینک را در url این کارت در config.js بنویسید.</p>`;
  } else {
    const e = embed(v.url);
    if (!e) { window.open(v.url, '_blank', 'noopener'); return; }
    body.innerHTML = `<h3>${esc(v.title)}</h3><iframe class="fr" src="${e}" title="${esc(v.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe><p class="note" style="margin-top:12px">اگر ویدیو پخش نشد، <a href="${esc(v.url)}" target="_blank" rel="noopener" style="color:var(--g2)">آن را در ${esc(v.platform)} باز کنید</a>.</p>`;
  }
  dlg.showModal();
}
dlg.addEventListener('close', () => body.innerHTML = '');
$('#dx').onclick = () => dlg.close();
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

C.videos.forEach(v => {
  const live = !!v.url, a = document.createElement('article');
  a.className = 'card vid';
  a.innerHTML = `<button class="th" type="button" aria-label="${live ? 'پخش' : 'مشاهده طرح'}: ${esc(v.title)}"><img src="${esc(v.thumb)}" alt="" loading="lazy"><span class="pf">${live ? esc(v.platform) : 'طرح و سناریو'}</span></button>
  <div class="vb"><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p><div class="row"><button class="btn sm main" type="button">${live ? 'مشاهده ویدیو' : 'مشاهده طرح و سناریو'}</button>${live ? `<a class="btn sm o" href="${esc(v.url)}" target="_blank" rel="noopener">باز کردن در ${esc(v.platform)}</a>` : '<span class="note">ویدیو هنوز تولید نشده است</span>'}</div></div>`;
  a.querySelectorAll('.th,.main').forEach(b => b.onclick = () => open(v));
  $('#vidGrid').append(a);
});

const K = C.contact;
$('#bWa').href = 'https://wa.me/' + K.whatsapp;
$('#bCh').href = K.telegramChannel;
$('#bMail').href = 'mailto:' + K.email;
$('#bTg').onclick = async () => {
  try { await navigator.clipboard.writeText(K.phone); toast('شماره کپی شد؛ آن را در تلگرام جستجو کنید'); }
  catch { toast('شماره: ' + K.phone); }
};
const F = $('#form');
function msg() {
  if (!F.reportValidity()) return null;
  const d = new FormData(F);
  return `سلام، درخواست ارتباط از وب‌سایت\nنام: ${d.get('n')}\nشماره تماس: ${d.get('p')}\nموضوع: ${d.get('s')}\nتوضیحات: ${d.get('m') || '-'}`;
}
$('#fw').onclick = () => { const t = msg(); if (t) window.open('https://wa.me/' + K.whatsapp + '?text=' + encodeURIComponent(t), '_blank', 'noopener'); };
$('#fe').onclick = () => { const t = msg(); if (t) location.href = 'mailto:' + K.email + '?subject=' + encodeURIComponent(F.s.value) + '&body=' + encodeURIComponent(t); };
})();
