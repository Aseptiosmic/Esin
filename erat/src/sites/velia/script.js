document.documentElement.classList.add('js');

const VIDEOS = {
  "v-hero":  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261022_054532_4648c53b-8840-4872-b054-016a86833f5c.mp4",
  "v-bento": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261022_054543_65a4e3d3-ce77-45a9-8917-60ce35999ea7.mp4",
  "v-cta":   "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261022_054543_cc94675a-b1cc-47a8-8843-c55665b0f33b.mp4"
};

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // 1) background videos: fade the still out once the video actually plays
  Object.entries(VIDEOS).forEach(([id, url]) => {
    const v = document.getElementById(id);
    const still = document.querySelector('[data-fallback="' + id + '"]');
    if (!v) return;
    v.src = url;
    v.addEventListener('playing', () => {
      if (still) { still.style.transition = 'opacity 1.2s'; still.style.opacity = 0; }
    }, { once: true });
    v.play().catch(() => {});
  });

  // 2) split headings into words, keeping nested spans and <br>
  document.querySelectorAll('[data-split]').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });

  // 3) count-up
  const countUp = el => {
    const end = +el.dataset.count, t0 = performance.now(), dur = reduce ? 1 : 2000;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // 4) reveal on scroll (low threshold so tall blocks, like the stacked hero card on phones, still trigger)
  const reveal = el => {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(countUp);
    if (el.id === 'gauge-card') document.getElementById('g-arc').style.strokeDashoffset = 252 * (1 - .94);
    if (el.id === 'match-card') document.getElementById('ring-arc').style.strokeDashoffset = 163.4 * (1 - .94);
  };
  const targets = document.querySelectorAll('.rv,[data-split]');
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => io.observe(el));
  // safety net: reveal anything already on screen even if the observer is late
  const sweep = () => targets.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.94 && r.bottom > 0) reveal(el);
  });
  requestAnimationFrame(() => requestAnimationFrame(sweep));
  addEventListener('load', sweep);

  // 5) hero card: reserve each reply's final height, then run two independent sequences that start together
  document.querySelectorAll('#studio .ai-t').forEach(el => {
    el.innerHTML = '<span class="ghost"></span><span class="live"></span>';
    el.firstChild.textContent = el.dataset.text;
  });
  const typeInto = (el, text, speed = 14) => new Promise(res => {
    const live = el.querySelector('.live');
    if (reduce) { live.textContent = text; return res(); }
    live.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    setTimeout(() => {
      live.textContent = ''; let k = 0;
      const step = () => { k += 2; live.textContent = text.slice(0, k); k < text.length ? setTimeout(step, speed) : res(); };
      step();
    }, 650);
  });
  const runColumn = async (items, done) => {
    await wait(reduce ? 0 : 1500);
    for (const m of items) {
      m.classList.add('show');
      if (m.id === 'hero-fig') m.classList.add('in');
      const t = m.querySelector('.ai-t');
      if (t) await typeInto(t, t.dataset.text);
      else await wait(reduce ? 0 : 380);
    }
    if (done) done();
  };
  runColumn([...document.querySelectorAll('#studio .chat .msg')], () => {
    document.getElementById('hero-track').style.width = '84%';
  });
  runColumn([...document.querySelectorAll('#studio .prod .msg')]);

  // 6) smooth scroll + one scroll handler for nav state and hand parallax
  const nav = document.getElementById('nav');
  const hand = document.getElementById('hand-img');
  const stage = document.getElementById('stage');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 20);
    if (!reduce && hand && stage) {
      const r = stage.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      hand.style.transform = 'translate3d(0,' + (-p * 12).toFixed(2) + '%,0)';
    }
  };
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', onScroll);
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  } else {
    let ticking = false;
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
    }, { passive: true });
  }
  onScroll();

  // 7) anchor links + mobile menu
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    document.body.classList.remove('menu-open');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: 'smooth' });
  }));
  document.getElementById('burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
})();
