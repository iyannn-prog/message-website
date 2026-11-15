(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------- YOUR CARD CONTENT (edit here) ---------- */
  const data = {
    caption: 'Thank you for being my professor',
    name: 'Ma’am Roan',
    sig: 'Edrian',
    egg: '',
    msg: `Hi, Ma’am Roan! Alam niyo po ba na noong una, talagang iniiwasan ko po kayo? In fact, nagtanong pa po ako kay Ma’am Joana kung anong sections ang hawak niya para sana hindi po kayo ang maging ITWS professor ko. Siguro dahil na rin po sa mga naririnig kong rumors, at aminado naman po akong sobrang nagustuhan ko rin talaga si Ma’am Joana bilang professor.

But now that I’m in 2C, I can honestly say that I’m very thankful na nakilala ko po kayo—not because of what I heard from other people, but because of my own experience with you. I realized na sobrang bait niyo rin po pala, and you're actually one of those professors na ang gaan kasama at ang galing magturo. You make lessons easy to understand, to the point na kahit wala na kaming review, confident kaming sagutan ang quizzes and exams because of how well you teach us.

Kaya I hope po, Ma’am, na kahit may times na nadidisappoint kayo sa section namin, you won't let those moments make you doubt yourself as a teacher. I hope you know na you're doing a great job, and that your kindness and the way you handle your students make it easy for us to feel comfortable around you. Magaan po ang presence niyo, and I hope you continue to be open to building a closer relationship with your students.

Thank you so much po for teaching us, for your patience, and for making this semester memorable. It's funny how I initially hoped na hindi kayo ang maging professor ko, only to end up being genuinely grateful that you were. I guess sometimes, the people we least expect to appreciate are the ones who leave us with the best experiences.

I hope you never lose the passion and kindness that you bring into teaching, Ma’am. You deserve to know that you are appreciated. Thank you for making our semester truly unforgettable! ❤️`
  };
  const save = () => {};
  $('#fName').value = data.name; $('#fMsg').value = data.msg; $('#fSig').value = data.sig; $('#fEgg').value = data.egg;

  /* ---------- snow + particles ---------- */
  const cv = $('#fx'), cx = cv.getContext('2d');
  let flakes = [], parts = [];
  function size() {
    cv.width = innerWidth; cv.height = innerHeight;
    flakes = Array.from({ length: Math.min(110, innerWidth / 9 | 0) }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 2.4 + .7, s: Math.random() + .4, d: Math.random() * 6 }));
  }
  function burst(x, y, n = 60) {
    if (RM) n = Math.min(n, 10);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, v = Math.random() * 6 + 2;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, l: 1, c: Math.random() < .6 ? '#D4AF37' : '#FFF8E7' });
    }
  }
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  (function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    if (!RM) {
      cx.fillStyle = 'rgba(255,255,255,.85)';
      flakes.forEach(f => { f.y += f.s; f.d += .01; f.x += Math.sin(f.d) * .6; if (f.y > cv.height) { f.y = -5; f.x = Math.random() * cv.width; } cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 7); cx.fill(); });
    }
    parts = parts.filter(p => p.l > 0);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .12; p.vx *= .98; p.l -= .014; cx.globalAlpha = Math.max(p.l, 0); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, 2.4, 0, 7); cx.fill(); });
    cx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();
  addEventListener('resize', size); size();
  addEventListener('pointerdown', e => burst(e.clientX, e.clientY, 14)); // sparkle on every tap

  /* ---------- interactive lights ---------- */
  const cols = ['#A52A2A', '#D4AF37', '#FFF8E7', '#3aa57a'];
  for (let i = 0; i < 16; i++) {
    const b = document.createElement('button');
    b.className = 'bulb'; b.dataset.i = i % 4; b.setAttribute('aria-label', 'Light ' + (i + 1));
    b.style.setProperty('--b', cols[i % 4]);
    b.addEventListener('click', () => {
      let n = (+b.dataset.i + 1) % 5; b.dataset.i = n;
      b.classList.toggle('off', n === 4);
      if (n < 4) b.style.setProperty('--b', cols[n]);
      const [x, y] = center(b); burst(x, y + 10, 12);
    });
    $('#lights').appendChild(b);
  }

  /* ---------- stages ---------- */
  function go(n) {
    $$('.stage').forEach((s, i) => s.classList.toggle('on', i === n));
    scrollTo(0, 0);
    if (n === 2) setTimeout(() => burst(innerWidth / 2, innerHeight / 2, 70), 500);
    if (n === 3) setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 60), 300);
    if (n === 4) {
      const t = $('#tree'); t.classList.remove('grow'); void t.offsetWidth; t.classList.add('grow');
      setTimeout(() => burst(innerWidth / 2, t.getBoundingClientRect().top, 90), 2000);
    }
  }
  function fill() {
    const nm = data.name || 'Teacher';
    $('#capt').textContent = data.caption;
    $('#dear').textContent = 'Dear ' + nm; $('#forName').textContent = 'For ' + nm;
    $('#cmsg').textContent = data.msg; $('#csig').textContent = data.sig;
    $('#thanks').textContent = 'Thank you, ' + nm + '!';
    $('#from').textContent = 'With gratitude, ' + data.sig;
  }

  // Stage 0: setup
  $('#setup').addEventListener('submit', e => {
    e.preventDefault();
    const m = $('#fMsg').value.trim(), s = $('#fSig').value.trim();
    $('#eMsg').textContent = m.length < 10 ? 'Write your own message first (at least 10 characters).' : '';
    $('#eSig').textContent = s ? '' : 'Add your signature.';
    if (m.length < 10) return $('#fMsg').focus();
    if (!s) return $('#fSig').focus();
    Object.assign(data, { name: $('#fName').value.trim(), msg: m, sig: s, egg: $('#fEgg').value.trim() });
    save(); fill(); go(1);
  });

  // Stage 1: gift
  $('#giftBtn').addEventListener('click', e => {
    e.currentTarget.disabled = true;
    if (!music.on) music.toggle();
    $('#gift').classList.add('open');
    const [x, y] = center($('#gift'));
    burst(x, y, 90); setTimeout(() => burst(x, y - 60, 60), 600);
    setTimeout(() => go(2), 2000);
  });

  // Stage 2: envelope
  $('#seal').addEventListener('click', () => {
    const env = $('#env'); if (env.classList.contains('open')) return;
    const [x, y] = center($('#seal')); burst(x, y, 80);
    env.classList.add('open'); $('#sealHint').hidden = true;
    setTimeout(() => { $('#readBtn').hidden = false; $('#readBtn').focus({ preventScroll: true }); }, 1700);
  });
  $('#readBtn').addEventListener('click', () => go(3));

  // Stage 3: card (editable)
  let editing = false;
  $('#editBtn').addEventListener('click', e => {
    const els = [$('#cmsg'), $('#csig')];
    editing = !editing;
    if (editing) { els.forEach(x => x.contentEditable = 'true'); els[0].focus(); e.currentTarget.textContent = 'Save changes'; return; }
    els.forEach(x => x.contentEditable = 'false');
    data.msg = $('#cmsg').innerText.trim() || data.msg;
    data.sig = $('#csig').innerText.trim() || data.sig;
    save(); fill(); e.currentTarget.textContent = 'Edit message';
  });
  $('#nextBtn').addEventListener('click', () => { if (editing) $('#editBtn').click(); go(4); });

  // Stage 4: tree
  const tree = $('#tree');
  const oc = ['#A52A2A', '#D4AF37', '#FFF8E7'];
  for (let i = 0; i < 24; i++) {
    const o = document.createElement('i'), y = 18 + Math.random() * 68, half = 6 + y * .38;
    o.className = 'orn'; o.style.background = oc[i % 3];
    o.style.top = y + '%'; o.style.left = (50 + (Math.random() * 2 - 1) * half * .8) + '%';
    o.style.animationDelay = (2.2 + Math.random() * 1.5) + 's';
    tree.appendChild(o);
  }
  $('#replayBtn').addEventListener('click', () => {
    $('#gift').classList.remove('open'); $('#env').classList.remove('open');
    $('#giftBtn').disabled = false; $('#readBtn').hidden = true; $('#sealHint').hidden = false;
    go(1);
  });
  $('#backBtn').addEventListener('click', () => go(0));

  /* ---------- Easter egg ---------- */
  const modal = $('#modal');
  const closeEgg = () => { modal.hidden = true; };
  $$('.egg').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    $('#mtext').textContent = data.egg || ('Thank you, ' + (data.name || 'Teacher') + '! ❤️');
    modal.hidden = false; $('#mClose').focus();
    for (let i = 0; i < 6; i++) setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight * .6, 30), i * 150);
  }));
  $('#mClose').addEventListener('click', closeEgg);
  modal.addEventListener('click', e => { if (e.target === modal) closeEgg(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeEgg(); });

  /* ---------- music: assets/music/christmas.mp3, else a synthesized carol ---------- */
  const music = (() => {
    const file = new Audio('assets/music/christmas.mp3'); file.loop = true; file.volume = .5;
    let synth = false, ac = null, timer = null, i = 0;
    file.addEventListener('error', () => { synth = true; if (m.on) play(); });
    const tune = [[293.66,1],[392,1],[392,.5],[440,.5],[392,.5],[370,.5],[329.63,1],[329.63,1],[329.63,1],[440,1],[440,.5],[494,.5],[440,.5],[392,.5],[370,1],[293.66,1],[293.66,1],[494,1],[494,.5],[523,.5],[494,.5],[440,.5],[392,1],[329.63,1],[293.66,.5],[293.66,.5],[329.63,1],[440,1],[370,1],[392,2]];
    function step() {
      if (!m.on) return;
      const [f, b] = tune[i], d = b * .38, t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.1, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + d);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d);
      i = (i + 1) % tune.length;
      timer = setTimeout(step, d * 1000 + (i === 0 ? 1000 : 0));
    }
    function play() {
      if (!synth) { file.play().catch(() => { synth = true; if (m.on) play(); }); return; }
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = ac || new AC(); ac.resume(); clearTimeout(timer); step();
    }
    const m = {
      on: false,
      toggle() {
        m.on = !m.on;
        if (m.on) play(); else { file.pause(); clearTimeout(timer); }
        const b = $('#muteBtn'); b.textContent = m.on ? '🔊' : '🔇';
        b.setAttribute('aria-label', m.on ? 'Mute music' : 'Turn music on');
      }
    };
    return m;
  })();
  $('#muteBtn').addEventListener('click', () => music.toggle());

  fill(); go(1); // open straight on the gift scene
})();
