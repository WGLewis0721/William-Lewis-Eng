/* =========================================================================
   William G. Lewis — portfolio behaviour
   ========================================================================= */
(function () {
  'use strict';

  const { PROFILE, SECTORS, LENSES, MASTER, PROJECTS, EXPERIENCE, METRICS } = SITE;

  const RESUME_BASE = document.documentElement.dataset.resumeBase || 'assets/resume/';
  const OFF_SITE = /^https?:/i.test(RESUME_BASE);
  const linkAttrs = (file) => OFF_SITE ? 'target="_blank" rel="noopener"' : `download="${esc(file)}"`;

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(' ');
  };

  /* ---------------------------------------------------------------- state */
  const lensById = Object.fromEntries(LENSES.map((l) => [l.id, l]));
  const state = { lens: 'platform', sector: 'private' };
  const editionsOf = (id) => Object.keys(lensById[id].editions);
  const activeLens = () => lensById[state.lens];
  const activeEdition = () => activeLens().editions[state.sector];

  /* ------------------------------------------------------------- theme */
  const root = document.documentElement;
  const themeIcon = $('#theme-icon');
  const MOON = '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"/>';
  const SUN = '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>';

  /* Dark is the unconditional default identity — it does not defer to the
     system color-scheme preference. Only an explicit toggle (persisted)
     switches to light. */
  function currentlyDark() {
    return root.getAttribute('data-theme') !== 'light';
  }
  function paintThemeIcon() { themeIcon.innerHTML = currentlyDark() ? SUN : MOON; }

  try {
    const saved = localStorage.getItem('wgl-theme');
    if (saved === 'light') root.setAttribute('data-theme', 'light');
  } catch (e) {}
  paintThemeIcon();

  $('#theme-toggle').addEventListener('click', () => {
    const next = currentlyDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('wgl-theme', next); } catch (e) {}
    paintThemeIcon();
  });

  /* --------------------------------------------------------- lens controls */
  const lensSeg = $('#lens-seg');
  const sectorSeg = $('#sector-seg');

  lensSeg.innerHTML = LENSES.map((l) =>
    `<button type="button" data-lens="${l.id}" aria-pressed="false" title="${esc(l.blurb)}">${esc(l.label)}</button>`
  ).join('');
  sectorSeg.innerHTML = ['private', 'gov'].map((s) =>
    `<button type="button" data-sector="${s}" aria-pressed="false">${esc(SECTORS[s].short)}</button>`
  ).join('');

  lensSeg.addEventListener('click', (e) => { const b = e.target.closest('[data-lens]'); if (b) setLens(b.dataset.lens); });
  sectorSeg.addEventListener('click', (e) => { const b = e.target.closest('[data-sector]'); if (b && !b.disabled) setSector(b.dataset.sector); });

  function setLens(id, opts) {
    if (!lensById[id]) return;
    state.lens = id;
    if (!editionsOf(id).includes(state.sector)) state.sector = editionsOf(id)[0];
    render(opts);
  }
  function setSector(s, opts) {
    if (!editionsOf(state.lens).includes(s)) return;
    state.sector = s;
    render(opts);
  }

  /* ------------------------------------------------------------- rendering */
  function render(opts) {
    const animate = !(opts && opts.silent) && !reduced();
    if (animate) {
      $$('.swap').forEach((el) => el.classList.add('is-out'));
      setTimeout(() => { paint(); $$('.swap').forEach((el) => el.classList.remove('is-out')); }, 180);
    } else {
      paint();
    }
    paintControls();
  }

  function paintControls() {
    const available = editionsOf(state.lens);
    const L = activeLens();
    root.style.setProperty('--idx-bright', L.accent);
    root.style.setProperty('--idx-deep', L.accentInk);
    root.style.setProperty('--idx-bright-rgb', hexToRgb(L.accent));
    root.style.setProperty('--idx-deep-rgb', hexToRgb(L.accentInk));

    $$('[data-lens]', lensSeg).forEach((b) => {
      const isOn = b.dataset.lens === state.lens;
      b.setAttribute('aria-pressed', String(isOn));
      b.style.setProperty('--tab-c', isOn ? 'var(--idx)' : '');
    });
    $$('[data-sector]', sectorSeg).forEach((b) => {
      const ok = available.includes(b.dataset.sector);
      b.disabled = !ok;
      b.setAttribute('aria-pressed', String(ok && b.dataset.sector === state.sector));
    });
  }

  function paint() {
    const L = activeLens();
    const ed = activeEdition();

    $('#hero-role').textContent = L.title;
    $('#hero-tags').innerHTML = ed.tagline.split(' · ').map((s) => `<span>${esc(s)}</span>`).join('');

    const heroDl = $('#hero-download');
    heroDl.href = RESUME_BASE + encodeURIComponent(ed.file);
    if (OFF_SITE) { heroDl.removeAttribute('download'); heroDl.target = '_blank'; heroDl.rel = 'noopener'; }
    else heroDl.setAttribute('download', ed.file);

    $('#proof-title').textContent = L.title;
    $('#proof-summary').textContent = ed.summary.split(/(?<=\.)\s+/)[0];

    const stats = METRICS.filter((m) => !m.sector || m.sector === state.sector).slice(0, 3);
    $('#proof-stats').innerHTML = stats.map((m) => {
      const shown = m.text || m.display || ((m.prefix || '') + m.value + (m.suffix || ''));
      return `<div class="proof__stat"><div class="v">${esc(shown)}</div><div class="l">${esc(m.label)}</div></div>`;
    }).join('');

    paintHUD(L, ed);
    paintTimeline();
    paintCapabilities();
    paintResume();
  }

  function paintHUD(L, ed) {
    const bits = [
      { l: '7+ Years', k: 'EXP' },
      { l: 'AWS · GovCloud', k: 'CLOUD' },
      { l: 'IL2–IL6', k: 'ENV' },
      { l: 'Zero Trust', k: 'SEC' },
      { l: 'AI Infrastructure', k: 'AI' }
    ];
    $('#hero-hud').innerHTML = bits.map((b) => `<span class="hud-chip"><i></i><b>${esc(b.l)}</b></span>`).join('');
  }

  /* -------------------------------------------------------------- timeline */
  function paintTimeline() {
    const L = activeLens();
    $('#timeline').innerHTML = EXPERIENCE.map((job) => {
      const order = L.bulletOrder[job.id] || job.bullets.map((_, i) => i);
      const wins = order.slice(0, 2).map((i) => job.bullets[i]).filter(Boolean);
      return `
      <article class="tl__row${job.current ? ' is-current' : ''}">
        <div class="tl__when">
          <span class="period mono">${esc(job.period)}</span>
          ${job.current ? '<span class="now">Current</span>' : ''}
        </div>
        <div class="tl__spine"><i></i></div>
        <div class="tl__what">
          <h3>${esc(job.role)}</h3>
          <p class="tl__org">${esc(job.org)} · ${esc(job.context)}</p>
          <ul class="tl__wins">${wins.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        </div>
      </article>`;
    }).join('');
  }

  /* ---------------------------------------------------------- capabilities */
  function paintCapabilities() {
    $('#caps-list').innerHTML = activeLens().competencies.map((g, i) => `
      <details class="cap"${i === 0 ? ' open' : ''}>
        <summary>${esc(g.group)}<span class="n mono">${g.items.length}</span></summary>
        <div class="cap__list">${g.items.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      </details>`).join('');
  }

  /* ------------------------------------------------------------- projects */
  const GLYPHS = [
    // 0 — GPU + RAG + plain-language answers
    `<svg viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="8" y="50" width="52" height="34" rx="5" stroke-dasharray="3 3" opacity=".5"/><rect x="16" y="56" width="36" height="22" rx="3"/><text x="34" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">GPU</text><line x1="68" y1="67" x2="98" y2="67" marker-end="url(#gA)"/><rect x="100" y="52" width="44" height="30" rx="3"/><text x="122" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">INDEX</text><line x1="144" y1="67" x2="170" y2="67" marker-end="url(#gA)"/><rect x="170" y="46" width="26" height="42" rx="13"/><text x="183" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="currentColor" stroke="none">?</text><defs><marker id="gA" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8Z" fill="currentColor" stroke="none"/></marker></defs></svg>`,
    // 1 — layered POC: LLM / QUERY GEN / GOVCLOUD
    `<svg viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="20" y="18" width="160" height="26" rx="4"/><text x="100" y="35" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">LLM INTEGRATION LAYER</text><line x1="100" y1="44" x2="100" y2="56"/><rect x="20" y="58" width="160" height="26" rx="4"/><text x="100" y="75" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">OPENSEARCH QUERY GEN</text><line x1="100" y1="84" x2="100" y2="96"/><rect x="20" y="98" width="160" height="26" rx="4" stroke-dasharray="3 3"/><text x="100" y="115" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">AWS GOVCLOUD</text></svg>`,
    // 2 — serverless chain: API -> Lambda -> DynamoDB
    `<svg viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="30" cy="65" r="20"/><text x="30" y="69" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="currentColor" stroke="none">API</text><line x1="50" y1="65" x2="76" y2="65" marker-end="url(#gB)"/><rect x="78" y="45" width="46" height="40" rx="6"/><text x="101" y="69" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="currentColor" stroke="none">LAMBDA</text><line x1="124" y1="65" x2="150" y2="65" marker-end="url(#gB)"/><rect x="152" y="48" width="40" height="34" rx="4"/><text x="172" y="69" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="6.5" fill="currentColor" stroke="none">DYNAMO</text><defs><marker id="gB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8Z" fill="currentColor" stroke="none"/></marker></defs></svg>`
  ];
  const WORK_TINT = ['signal', 'signal-2', 'signal'];

  $('#work-list').innerHTML = PROJECTS.map((pr, i) => `
    <article class="work">
      <div class="work__glyph" style="--work-c-solid:var(--${WORK_TINT[i % WORK_TINT.length]});--work-c:var(--${WORK_TINT[i % WORK_TINT.length]}-rgb)">${GLYPHS[i % GLYPHS.length]}</div>
      <div class="work__body">
        <span class="work__status mono">${esc(pr.status)}</span>
        <h3>${esc(pr.name)}</h3>
        <div class="work__row">
          <div><span class="k">Context</span><span class="v">${esc(pr.context)}</span></div>
        </div>
        <p style="color:var(--text);font-size:1rem">${esc(pr.lead)}</p>
        <p class="work__stack">${pr.stack.map(esc).join(' · ')}</p>
        <details class="work__more">
          <summary>Explore project</summary>
          <p>${esc(pr.body)}</p>
        </details>
      </div>
    </article>`).join('');

  /* --------------------------------------------------------- resume plates */
  const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 18.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5"/></svg>';
  const EDITION_LIST = LENSES.flatMap((l) => Object.entries(l.editions).map(([sector, ed]) => ({ lens: l, sector, ed })));
  const fileKind = (f) => (f.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Word');

  function paintResume() {
    const L = activeLens();
    const ed = activeEdition();

    $('#res-recommended').innerHTML = `
      <div>
        <span class="res-plate__badge">Recommended for this view · ${esc(SECTORS[state.sector].label)}</span>
        <h3>${esc(L.title)}</h3>
        <p class="res-plate__tag mono">${esc(ed.tagline)}</p>
        <div class="res-plate__acts">
          <a class="btn btn--primary" href="${RESUME_BASE + encodeURIComponent(ed.file)}" ${linkAttrs(ed.file)}>${DL_ICON}Download ${fileKind(ed.file)}</a>
        </div>
        <p class="res-plate__file">${esc(ed.file)}</p>
      </div>
      <p class="res-plate__sum">${esc(ed.summary)}</p>`;

    const rows = [{ label: MASTER.title + ' — master edition', ctx: MASTER.tagline, file: MASTER.file, active: false }]
      .concat(EDITION_LIST.map(({ lens, sector, ed: e }) => ({
        label: lens.title, ctx: `${lens.label} · ${SECTORS[sector].label}`, file: e.file,
        active: lens.id === state.lens && sector === state.sector
      })));

    $('#res-register-body').innerHTML = rows.map((r) => `
      <tr class="${r.active ? 'is-active' : ''}">
        <td><span class="edition">${esc(r.label)}</span><span class="ctx">${esc(r.ctx)}</span></td>
        <td class="mono">${fileKind(r.file)}</td>
        <td><a href="${RESUME_BASE + encodeURIComponent(r.file)}" ${linkAttrs(r.file)}>Download</a></td>
      </tr>`).join('');
    $('#res-count').textContent = `(${rows.length})`;
  }

  /* ---------------------------------------------------------- architecture */
  const ADJACENCY = {
    repo: ['pipeline'], pipeline: ['repo', 'staging'], staging: ['pipeline', 'diode'],
    diode: ['staging', 'apply'], apply: ['diode', 'workloads', 'compliance'], edge: ['workloads'],
    workloads: ['apply', 'edge', 'telemetry'], compliance: ['apply'],
    telemetry: ['workloads', 'llm'], llm: ['telemetry']
  };
  const ARCH_NODES = SITE.ARCH_NODES;
  const archNodes = $$('#arch-svg .n-hit');
  const archEdges = $$('#arch-svg .e-edge');

  function selectNode(key) {
    const data = ARCH_NODES[key];
    if (!data) return;
    const related = new Set([key, ...(ADJACENCY[key] || [])]);
    archNodes.forEach((n) => {
      const k = n.dataset.node;
      n.classList.toggle('is-active', k === key);
      n.classList.toggle('is-lit', related.has(k) && k !== key);
      n.classList.toggle('is-dim', !related.has(k));
    });
    archEdges.forEach((e) => {
      const [a, b] = e.dataset.edge.split('-');
      const rel = a === key || b === key;
      e.classList.toggle('is-lit', rel);
      e.classList.toggle('is-dim', !rel);
    });
    $('#arch-side').textContent = data.side;
    $('#arch-name').textContent = data.name;
    $('#arch-body').textContent = data.body;
  }
  archNodes.forEach((n) => {
    n.addEventListener('click', () => selectNode(n.dataset.node));
    n.addEventListener('mouseenter', () => selectNode(n.dataset.node));
    n.addEventListener('focus', () => selectNode(n.dataset.node));
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.dataset.node); } });
  });
  selectNode('diode');

  /* ------------------------------------------------------- scroll niceties */
  const progress = $('#progress');
  const navLinks = $$('.bar__nav a');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealer.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.rv').forEach((el) => revealer.observe(el));

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id))); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['profile', 'architecture', 'work', 'career', 'capabilities', 'resume'].forEach((id) => {
      const el = document.getElementById(id); if (el) spy.observe(el);
    });
  } else {
    $$('.rv').forEach((el) => el.classList.add('is-in'));
  }

  /* --------------------------------------------------------- magnetic CTAs */
  if (window.matchMedia('(hover: hover)').matches && !reduced()) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .25;
        const y = (e.clientY - r.top - r.height / 2) * .4;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------ command palette */
  const pal = $('#palette');
  const palInput = $('#pal-input');
  const palList = $('#pal-list');
  let palItems = [];
  let palIdx = 0;

  const grab = (file) => () => {
    const url = RESUME_BASE + encodeURIComponent(file);
    if (OFF_SITE) { window.open(url, '_blank', 'noopener'); return; }
    const a = document.createElement('a');
    a.href = url; a.download = file;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const ALL_COMMANDS = (function () {
    const list = [
      { label: 'Profile', group: 'Go to', run: () => location.hash = '#profile' },
      { label: 'Architecture', group: 'Go to', run: () => location.hash = '#architecture' },
      { label: 'Selected work', group: 'Go to', run: () => location.hash = '#work' },
      { label: 'Career', group: 'Go to', run: () => location.hash = '#career' },
      { label: 'Capabilities', group: 'Go to', run: () => location.hash = '#capabilities' },
      { label: 'Resume', group: 'Go to', run: () => location.hash = '#resume' },
      { label: 'Contact', group: 'Go to', run: () => location.hash = '#contact' }
    ];
    LENSES.forEach((l) => list.push({ label: `Read as ${l.label}`, group: 'Lens', run: () => setLens(l.id) }));
    list.push({ label: 'Switch to the cleared / government edition', group: 'Context', run: () => setSector('gov') });
    list.push({ label: 'Switch to the private-sector edition', group: 'Context', run: () => setSector('private') });
    list.push({ label: 'Complete resume — every project, nothing trimmed', group: 'Download', run: grab(MASTER.file) });
    EDITION_LIST.forEach(({ lens, sector, ed }) => list.push({ label: `${lens.title} — ${SECTORS[sector].short}`, group: 'Download', run: grab(ed.file) }));
    list.push({ label: 'Switch color theme', group: 'Action', run: () => $('#theme-toggle').click() });
    list.push({ label: 'Email William', group: 'Action', run: () => location.href = 'mailto:' + PROFILE.email });
    return list;
  })();

  function renderPal() {
    const q = palInput.value.trim().toLowerCase();
    palItems = ALL_COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
    palIdx = 0;
    palList.innerHTML = palItems.length
      ? palItems.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === 0}">${esc(c.label)}<span class="g">${esc(c.group)}</span></li>`).join('')
      : '<li aria-selected="false" style="color:var(--text-dim)">No match</li>';
  }
  function movePal(delta) {
    if (!palItems.length) return;
    palIdx = (palIdx + delta + palItems.length) % palItems.length;
    $$('#pal-list li').forEach((li, i) => li.setAttribute('aria-selected', String(i === palIdx)));
    const sel = palList.children[palIdx]; if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  function openPal() { pal.setAttribute('open', ''); palInput.value = ''; renderPal(); palInput.focus(); }
  function closePal() { pal.removeAttribute('open'); }
  function runPal() { const c = palItems[palIdx]; if (c) { closePal(); c.run(); } }

  $('#palette-open').addEventListener('click', openPal);
  palInput.addEventListener('input', renderPal);
  palList.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) { palIdx = Number(li.dataset.i); runPal(); } });
  $$('[data-close]', pal).forEach((el) => el.addEventListener('click', closePal));

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPal(); return; }
    if (e.key === '/' && !typing) { e.preventDefault(); openPal(); return; }
    if (!pal.hasAttribute('open')) return;
    if (e.key === 'Escape') closePal();
    else if (e.key === 'ArrowDown') { e.preventDefault(); movePal(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); movePal(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(); }
  });

  /* ------------------------------------------------------- hero topology */
  (function topology() {
    const cv = $('#topology');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, dpr = 1, clusters = [], routes = [], packets = [], raf = null;
    let pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const isTouch = !window.matchMedia('(hover: hover)').matches;

    const inkRgb = () => (currentlyDark() ? '243 246 249' : '11 15 21');
    const signalRgb = () => getComputedStyle(root).getPropertyValue('--signal-rgb').trim() || '69 215 255';
    const signal2Rgb = () => getComputedStyle(root).getPropertyValue('--signal-2-rgb').trim() || '255 180 84';

    function layout() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const anchors = [
        { x: .16, y: .28, n: 5 }, { x: .82, y: .18, n: 4 },
        { x: .30, y: .78, n: 4 }, { x: .86, y: .68, n: 5 },
        { x: .55, y: .42, n: 3 }
      ];
      clusters = anchors.map((a, ci) => {
        const cx = a.x * w, cy = a.y * h;
        const nodes = Array.from({ length: a.n }, (_, i) => {
          const ang = i * 2.399963 + ci;
          const rad = 26 + (i % 3) * 16;
          return { x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad, r: i === 0 ? 3.4 : 1.6, hub: i === 0 };
        });
        return { cx, cy, nodes };
      });

      routes = [];
      const trunkPairs = [[0, 4], [4, 1], [4, 2], [4, 3], [0, 2], [1, 3]];
      trunkPairs.forEach(([a, b]) => routes.push({ a: clusters[a], b: clusters[b] }));

      packets = routes.slice(0, 5).map((rt, i) => ({ route: rt, t: (i / 5), speed: .00035 + (i % 3) * .00009 }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const ink = inkRgb(), sig = signalRgb(), sig2 = signal2Rgb();
      const px = pointer.x * 10, py = pointer.y * 10;

      // trunk routes
      routes.forEach((rt) => {
        ctx.strokeStyle = `rgb(${ink} / .08)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rt.a.cx + px, rt.a.cy + py);
        ctx.lineTo(rt.b.cx + px, rt.b.cy + py);
        ctx.stroke();
      });

      // clusters: intra-cluster mesh + nodes
      clusters.forEach((c) => {
        c.nodes.forEach((n) => {
          ctx.strokeStyle = `rgb(${ink} / .14)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(c.cx + px, c.cy + py);
          ctx.lineTo(n.x + px, n.y + py);
          ctx.stroke();
        });
        c.nodes.forEach((n) => {
          ctx.fillStyle = n.hub ? `rgb(${sig} / .9)` : `rgb(${ink} / .4)`;
          if (n.hub) { ctx.shadowColor = `rgb(${sig} / .8)`; ctx.shadowBlur = 8; }
          ctx.beginPath(); ctx.arc(n.x + px, n.y + py, n.r, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      // packets
      packets.forEach((p, i) => {
        const { a, b } = p.route;
        const x = a.cx + (b.cx - a.cx) * p.t, y = a.cy + (b.cy - a.cy) * p.t;
        const color = i % 3 === 0 ? sig2 : sig;
        ctx.fillStyle = `rgb(${color} / .9)`;
        ctx.shadowColor = `rgb(${color} / .8)`; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(x + px, y + py, 2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    function step() {
      pointer.x += (pointer.tx - pointer.x) * .04;
      pointer.y += (pointer.ty - pointer.y) * .04;
      packets.forEach((p) => { p.t += p.speed; if (p.t > 1) p.t = 0; });
      draw();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (raf) cancelAnimationFrame(raf);
      layout();
      if (reduced()) { draw(); return; }
      step();
    }

    if (!isTouch) {
      cv.parentElement.addEventListener('mousemove', (e) => {
        const r = cv.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width - .5);
        pointer.ty = ((e.clientY - r.top) / r.height - .5);
      });
    }

    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(start, 180); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
      else if (!document.hidden && !reduced() && !raf) step();
    });
    start();
  })();

  /* ------------------------------------------------------------ deep links */
  const params = new URLSearchParams(location.search);
  if (params.get('lens') && lensById[params.get('lens')]) state.lens = params.get('lens');
  if (params.get('for') && SECTORS[params.get('for')]) state.sector = params.get('for');
  if (!editionsOf(state.lens).includes(state.sector)) state.sector = editionsOf(state.lens)[0];

  render({ silent: true });
})();
