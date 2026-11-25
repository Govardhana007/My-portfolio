/* ===== main.js: GSAP ScrollSmoother page, reveals, typewriter, counters, form ===== */
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* 1. Split headings into words and characters */
$$('.split').forEach(el => {
  const t = el.textContent.trim();
  el.setAttribute('aria-label', t);
  el.innerHTML = t.split(' ').map(w => `<span class="w" aria-hidden="true">${[...w].map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
});

/* 2. Parallax depth (ScrollSmoother effects) - set BEFORE create() */
$$('.big,.title').forEach(e => e.dataset.speed = 0.9);
$$('.stat').forEach((e, k) => e.dataset.lag = 0.2 + k * 0.15);

/* 3. Smooth scroller (native scrolling underneath) - create FIRST */
const smoother = ScrollSmoother.create({ smooth: 1.4, effects: true });
const sections = $$('#smooth-content section'), dots = $$('.dots-nav button');
const goTo = i => smoother.scrollTo(sections[i], true, 'top top');
dots.forEach((b, k) => b.addEventListener('click', () => goTo(k)));
$$('[data-go]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); goTo(+a.dataset.go); }));

function setActive(i) {
  dots.forEach((b, k) => b.classList.toggle('on', k === i));
  $('#count').textContent = `0${i + 1} / 0${sections.length}`;
}

/* 4. Scroll-triggered reveals, active dot, counters, spiral on/off */
function init() {
  sections.forEach((s, i) => {
    gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 68%', toggleActions: 'play none none reverse' } })
      .from($$('.ch', s), { autoAlpha: 0, yPercent: 120, duration: 1, ease: 'power2', stagger: { each: 0.02, from: 'random' } })
      .from($$('.rv', s), { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power2.out', stagger: 0.1 }, 0.3);
    ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: t => t.isActive && setActive(i) });
  });
  ScrollTrigger.create({ trigger: sections[1], start: 'top 60%', once: true,
    onEnter: () => $$('[data-n]').forEach(n => gsap.fromTo(n, { textContent: 0 }, { textContent: +n.dataset.n, snap: { textContent: 1 }, duration: 1.6, ease: 'power1.out' })) });
  /* Certificates: cards fly in, then the section pins and scrolling spins the spiral */
  ScrollTrigger.create({ trigger: '.s4', start: 'top bottom', end: 'top top',
    onEnter: () => Spiral.set(true), onLeaveBack: () => Spiral.set(false) });
  ScrollTrigger.create({
  trigger: '.s4',
  start: 'top top',
  end: '+=700', // Increased scroll distance = slower rotation
  pin: true,
  onUpdate: s => Spiral.scroll(s.progress),
  onLeave: () => Spiral.set(false),
  onEnterBack: () => Spiral.set(true)
});
  ScrollTrigger.refresh();
}


/* Project cards: appear one by one, tap to open on touch screens */
gsap.set('.pc', { autoAlpha: 0 });
ScrollTrigger.batch('.pc', { start: 'top 90%', onEnter: b => gsap.fromTo(b, { autoAlpha: 0, y: 90, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out', overwrite: true }) });
$$('.pc').forEach(c => {
  const figure = $('.pc__figure', c);
  c.style.setProperty('--a', figure.style.getPropertyValue('--a'));
  c.style.setProperty('--b', figure.style.getPropertyValue('--b'));

  const tech = $('.pc__tech', c).textContent;
  const marquee = document.createElement('div');
  marquee.className = 'pc__marquee';
  marquee.setAttribute('aria-hidden', 'true');
  const text = `${tech} • Selected work • View project • `;
  marquee.innerHTML = `<div class="pc__marquee-track"><span>${text}</span><span>${text}</span><span>${text}</span><span>${text}</span></div>`;
  const info = $('.pc__info', c);
  info.insertBefore(marquee, $('.pc__links', c));

  c.addEventListener('pointermove', e => {
    if (matchMedia('(hover:hover)').matches) {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--rx', `${-y * 8}deg`);
      c.style.setProperty('--ry', `${x * 8}deg`);
    }
  });
  c.addEventListener('pointerleave', () => {
    c.style.setProperty('--rx', '0deg');
    c.style.setProperty('--ry', '0deg');
  });
  c.addEventListener('click', e => { if (!e.target.closest('a')) { $$('.pc.open').forEach(o => o !== c && o.classList.remove('open')); c.classList.toggle('open'); } });
});

/* 5. Typewriter */
const words = ['AI & ML projects.', 'full stack web apps.', 'clean, fast interfaces.', 'things that solve problems.'];
const typed = $('#typed'); let w = 0, c = 0, del = false;
(function type() {
  const word = words[w]; c += del ? -1 : 1; typed.textContent = word.slice(0, c);
  let t = del ? 35 : 70;
  if (!del && c === word.length) { del = true; t = 1400; } else if (del && c === 0) { del = false; w = (w + 1) % words.length; t = 300; }
  setTimeout(type, t);
})();

/* 6. Glass cards: light follows the cursor */
$$('.pcard,.card,.stat').forEach(card => card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', e.clientX - r.left + 'px'); card.style.setProperty('--my', e.clientY - r.top + 'px');
}));

/* 7. Contact form (Netlify Forms) */
const form = $('#form'), st = $('#status');
form.addEventListener('submit', async e => {
  e.preventDefault(); let ok = true;
  $$('.field', form).forEach(f => {
    const i = f.firstElementChild, bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
    f.classList.toggle('bad', bad); if (bad) ok = false;
  });
  st.className = 'status ' + (ok ? 'ok' : 'err');
  if (!ok) { st.textContent = 'Please fill every field with a valid email.'; return; }
  try {
    const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
    if (!r.ok) throw 0;
    st.textContent = 'Message sent. Thank you!'; form.reset();
  } catch { st.className = 'status err'; st.textContent = 'Could not send here. Email me at ramg2366@gmail.com.'; }
});
$('#year').textContent = new Date().getFullYear();

/* 8. Start */
addEventListener('load', () => { init(); setActive(0); setTimeout(() => $('#loader').classList.add('hide'), 500); });
