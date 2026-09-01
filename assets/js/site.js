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
  const hoverCapable = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(' ');
  };

  /* ---------------------------------------------------------------- state */
  const lensById = Object.fromEntries(LENSES.map((l) => [l.id, l]));
  const lensIndex = Object.fromEntries(LENSES.map((l, i) => [l.id, i]));
  const state = { lens: 'platform', sector: 'private' };
  const editionsOf = (id) => Object.keys(lensById[id].editions);
  const activeLens = () => lensById[state.lens];
  const activeEdition = () => activeLens().editions[state.sector];

  /* ------------------------------------------------------------- theme */
  const root = document.documentElement;
  const themeIcon = $('#theme-icon');
  const MOON = '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"/>';
  const SUN = '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>';

  function currentlyDark() { return root.getAttribute('data-theme') !== 'light'; }
  function paintThemeIcon() { themeIcon.innerHTML = currentlyDark() ? SUN : MOON; }

  try {
    const saved = localStorage.getItem('wgl-theme');
    if (saved === 'light') root.setAttribute('data-theme', 'light');
  } catch (e) {}
  paintThemeIcon();

  $('#logo-mark').addEventListener('click', () => {
    document.getElementById('top').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  });

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
    flashTopologyLabel();
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
    $('#hero-pitch').textContent = ed.tagline.split(' · ')[0] + ' — ' + L.blurb;

    const heroDl = $('#hero-download');
    heroDl.href = RESUME_BASE + encodeURIComponent(ed.file);
    if (OFF_SITE) { heroDl.removeAttribute('download'); heroDl.target = '_blank'; heroDl.rel = 'noopener'; }
    else heroDl.setAttribute('download', ed.file);

    const proofBits = ['7+ Years', 'AWS · GovCloud', 'IL2–IL6'];
    $('#hero-proof').innerHTML = proofBits.map((b) => `<span><b>${esc(b)}</b></span>`).join('');

    $('#proof-title').textContent = L.title;
    $('#proof-summary').textContent = ed.summary.split(/(?<=\.)\s+/)[0];

    const stats = METRICS.filter((m) => !m.sector || m.sector === state.sector).slice(0, 3);
    $('#proof-stats').innerHTML = stats.map((m) => {
      const shown = m.text || m.display || ((m.prefix || '') + m.value + (m.suffix || ''));
      return `<div class="proof__stat"><div class="v">${esc(shown)}</div><div class="l">${esc(m.label)}</div></div>`;
    }).join('');

    paintCareerDetail();
    paintCapMap();
    paintWorkStage(activeWorkIndex);
    paintResume();
  }

  /* ---------------------------------------------------------------- work */
  const GLYPHS = [
    `<svg viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="8" y="50" width="52" height="34" rx="5" stroke-dasharray="3 3" opacity=".5"/><rect x="16" y="56" width="36" height="22" rx="3"/><text x="34" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">GPU</text><line x1="68" y1="67" x2="98" y2="67" marker-end="url(#gA)"/><rect x="100" y="52" width="44" height="30" rx="3"/><text x="122" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">INDEX</text><line x1="144" y1="67" x2="170" y2="67" marker-end="url(#gA)"/><rect x="170" y="46" width="26" height="42" rx="13"/><text x="183" y="70" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="currentColor" stroke="none">?</text><defs><marker id="gA" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8Z" fill="currentColor" stroke="none"/></marker></defs></svg>`,
    `<svg viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="20" y="18" width="160" height="26" rx="4"/><text x="100" y="35" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">LLM INTEGRATION LAYER</text><line x1="100" y1="44" x2="100" y2="56"/><rect x="20" y="58" width="160" height="26" rx="4"/><text x="100" y="75" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">OPENSEARCH QUERY GEN</text><line x1="100" y1="84" x2="100" y2="96"/><rect x="20" y="98" width="160" height="26" rx="4" stroke-dasharray="3 3"/><text x="100" y="115" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8" fill="currentColor" stroke="none">AWS GOVCLOUD</text></svg>`,
    `<svg viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="30" cy="65" r="20"/><text x="30" y="69" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="currentColor" stroke="none">API</text><line x1="50" y1="65" x2="76" y2="65" marker-end="url(#gB)"/><rect x="78" y="45" width="46" height="40" rx="6"/><text x="101" y="69" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7" fill="currentColor" stroke="none">LAMBDA</text><line x1="124" y1="65" x2="150" y2="65" marker-end="url(#gB)"/><rect x="152" y="48" width="40" height="34" rx="4"/><text x="172" y="69" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="6.5" fill="currentColor" stroke="none">DYNAMO</text><defs><marker id="gB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8Z" fill="currentColor" stroke="none"/></marker></defs></svg>`
  ];
  const WORK_TINT = ['signal', 'amber', 'signal'];
  let activeWorkIndex = 0;

  const workIndex = $('#work-index');
  workIndex.innerHTML = PROJECTS.map((pr, i) => `
    <div class="work-item${i === 0 ? ' is-active' : ''}" data-i="${i}">
      <button type="button" class="work-item__title" data-cursor="project" data-glyph="${i % GLYPHS.length}">
        <span class="work-item__n mono">0${i + 1}</span>
        <span class="work-item__name">${esc(pr.name)}</span>
      </button>
      <div class="work-item__mobile">
        <div class="work-glyph" style="--work-c-solid:var(--${WORK_TINT[i % WORK_TINT.length]});--work-c:var(--${WORK_TINT[i % WORK_TINT.length]}-rgb)">${GLYPHS[i % GLYPHS.length]}</div>
        <span class="work-stage__status mono">${esc(pr.status)}</span>
        <p style="color:var(--text);font-size:1rem">${esc(pr.lead)}</p>
        <p class="work-stage__stack">${pr.stack.map(esc).join(' · ')}</p>
        <details class="work-stage__more"><summary>Explore project</summary><p>${esc(pr.body)}</p></details>
      </div>
    </div>`).join('');

  function setActiveWork(i) {
    activeWorkIndex = i;
    workIndex.classList.add('has-active');
    $$('.work-item', workIndex).forEach((el) => el.classList.toggle('is-active', Number(el.dataset.i) === i));
    paintWorkStage(i);
  }
  function paintWorkStage(i) {
    const pr = PROJECTS[i];
    if (!pr) return;
    $('#work-stage').innerHTML = `
      <div class="work-glyph" style="--work-c-solid:var(--${WORK_TINT[i % WORK_TINT.length]});--work-c:var(--${WORK_TINT[i % WORK_TINT.length]}-rgb)">${GLYPHS[i % GLYPHS.length]}</div>
      <span class="work-stage__status mono">${esc(pr.status)}</span>
      <div class="work-stage__row">
        <div><span class="k">Context</span><span class="v">${esc(pr.context)}</span></div>
      </div>
      <p style="color:var(--text);font-size:1.05rem">${esc(pr.lead)}</p>
      <p class="work-stage__stack">${pr.stack.map(esc).join(' · ')}</p>
      <details class="work-stage__more"><summary>Explore project →</summary><p>${esc(pr.body)}</p></details>`;
  }
  $$('.work-item__title', workIndex).forEach((btn) => {
    const i = Number(btn.closest('.work-item').dataset.i);
    btn.addEventListener('focus', () => setActiveWork(i));
    btn.addEventListener('click', () => setActiveWork(i));
    if (hoverCapable()) btn.addEventListener('mouseenter', () => setActiveWork(i));
  });

  /* ------------------------------------------------------------- career */
  const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  function parsePoint(str) {
    if (/present/i.test(str)) { const d = new Date(); return d.getFullYear() + d.getMonth() / 12; }
    const m = str.trim().match(/^(\w+)\s+(\d{4})$/);
    if (!m) return null;
    return Number(m[2]) + (MONTHS[m[1]] || 0) / 12;
  }
  const jobPoints = EXPERIENCE.map((job) => {
    const [startStr, endStr] = job.period.split('—').map((s) => s.trim());
    return { job, start: parsePoint(startStr), end: parsePoint(endStr) };
  });
  const minPoint = Math.min(...jobPoints.map((p) => p.start));
  const maxPoint = Math.max(...jobPoints.map((p) => p.end));
  const pct = (v) => Math.max(0, Math.min(100, ((v - minPoint) / (maxPoint - minPoint)) * 100));

  $('#career-y0').textContent = String(Math.floor(minPoint));
  $('#career-y1').textContent = String(Math.ceil(maxPoint));
  $('#career-fill').style.width = '100%';

  let activeJobId = (EXPERIENCE.find((j) => j.current) || EXPERIENCE[0]).id;
  $('#career-stops').innerHTML = jobPoints.map(({ job, start }) => `
    <button type="button" class="career-stop${job.id === activeJobId ? ' is-active' : ''}" data-job="${job.id}" style="left:${pct(start)}%" aria-label="${esc(job.role)} at ${esc(job.org)}" title="${esc(job.role)} — ${esc(job.org)}"></button>`).join('');

  function setActiveJob(id) {
    activeJobId = id;
    $$('.career-stop').forEach((el) => el.classList.toggle('is-active', el.dataset.job === id));
    paintCareerDetail();
  }
  $('#career-stops').addEventListener('click', (e) => { const b = e.target.closest('[data-job]'); if (b) setActiveJob(b.dataset.job); });

  function paintCareerDetail() {
    const job = EXPERIENCE.find((j) => j.id === activeJobId);
    if (!job) return;
    const L = activeLens();
    const order = L.bulletOrder[job.id] || job.bullets.map((_, i) => i);
    const wins = order.map((i) => job.bullets[i]).filter(Boolean);
    const startYear = Math.floor(parsePoint(job.period.split('—')[0].trim()));
    $('#career-detail').innerHTML = `
      <div class="career-detail__year mono">${startYear}</div>
      <div class="career-detail__body">
        <h3 class="career-detail__role">${esc(job.role)}</h3>
        <p class="career-detail__org">${esc(job.org)} · ${esc(job.period)}${job.current ? ' · <span style="color:var(--signal)">CURRENT</span>' : ''}</p>
        <p class="career-detail__scope">${esc(job.context)}</p>
        ${wins[0] ? `<p class="career-detail__win">${esc(wins[0])}</p>` : ''}
        ${wins.length > 1 ? `<details class="career-detail__more"><summary>+ ${wins.length - 1} more from this role</summary><ul>${wins.slice(1).map((w) => `<li>${esc(w)}</li>`).join('')}</ul></details>` : ''}
      </div>`;
  }

  /* -------------------------------------------------------- capabilities */
  let activeCapIndex = 0;
  function paintCapMap() {
    const groups = activeLens().competencies;
    if (activeCapIndex >= groups.length) activeCapIndex = 0;
    $('#cap-map').innerHTML = `
      <div class="cap-index has-active" id="cap-index">
        ${groups.map((g, i) => `
        <div class="cap-idx-item${i === activeCapIndex ? ' is-active' : ''}" data-i="${i}">
          <button type="button"><span class="name">${esc(g.group)}</span><span class="n">${g.items.length}</span></button>
        </div>`).join('')}
      </div>
      <div class="cap-detail" id="cap-detail"></div>`;
    paintCapDetail(groups);
    const idx = $('#cap-index');
    $$('.cap-idx-item button', idx).forEach((btn) => {
      const i = Number(btn.closest('.cap-idx-item').dataset.i);
      const activate = () => {
        activeCapIndex = i;
        $$('.cap-idx-item', idx).forEach((el) => el.classList.toggle('is-active', Number(el.dataset.i) === i));
        paintCapDetail(groups);
      };
      btn.addEventListener('click', activate);
      btn.addEventListener('focus', activate);
      if (hoverCapable()) btn.addEventListener('mouseenter', activate);
    });
  }
  function paintCapDetail(groups) {
    const g = groups[activeCapIndex];
    $('#cap-detail').innerHTML = `
      <span class="cap-detail__label mono">${esc(g.group)} · ${g.items.length} listed</span>
      <div class="cap-detail__list">${g.items.map((s) => `<span>${esc(s)}</span>`).join('')}</div>`;
  }

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
          <a class="btn btn--primary" href="${RESUME_BASE + encodeURIComponent(ed.file)}" ${linkAttrs(ed.file)} data-cursor="download">${DL_ICON}Download ${fileKind(ed.file)}</a>
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

  /* -------------------------------------------- architecture: pinned story */
  const ARCH_NODES = SITE.ARCH_NODES;
  const archNodes = $$('#arch-svg .n-hit');
  const archEdges = $$('#arch-svg .e-edge');
  archNodes.forEach((n) => { n.dataset.cursor = 'inspect'; });

  const STATES = [
    { n: '01', title: 'Build', copy: 'Infrastructure as code is written, reviewed, and staged as a versioned artifact on the connected network.', nodes: ['repo', 'pipeline', 'staging'], edges: ['repo-pipeline', 'pipeline-staging'] },
    { n: '02', title: 'Cross', copy: 'The only way in is a physically one-way data diode. Complete, self-sufficient artifacts cross once — nothing is pulled on demand.', nodes: ['staging', 'diode', 'apply'], edges: ['staging-diode', 'diode-apply'] },
    { n: '03', title: 'Observe', copy: 'Workloads run behind an identity-brokered perimeter. Fluent Bit ships logs and security events into OpenSearch — the program’s first end-to-end visibility.', nodes: ['apply', 'workloads', 'edge', 'telemetry', 'compliance'], edges: ['apply-workloads', 'edge-workloads', 'workloads-telemetry', 'apply-compliance'] },
    { n: '04', title: 'Intelligence', copy: 'A GPU-hosted local model retrieves against that index. An analyst asks in plain language — nothing ever leaves the enclave.', nodes: ['telemetry', 'llm'], edges: ['telemetry-llm'] }
  ];

  function applyArchState(idx) {
    const s = STATES[idx];
    const nodeSet = new Set(s.nodes);
    const edgeSet = new Set(s.edges);
    archNodes.forEach((n) => {
      const on = nodeSet.has(n.dataset.node);
      n.classList.toggle('is-lit', on);
      n.classList.toggle('is-dim', !on);
      n.classList.remove('is-active');
    });
    archEdges.forEach((e) => {
      const on = edgeSet.has(e.dataset.edge);
      e.classList.toggle('is-lit', on);
      e.classList.toggle('is-dim', !on);
    });
    $('#arch-n').textContent = s.n;
    $('#arch-title').textContent = s.title;
    $('#arch-copy').textContent = s.copy;
    $$('#arch-progress i').forEach((dot, i) => dot.classList.toggle('is-on', i === idx));
  }

  function selectNode(key) {
    const data = ARCH_NODES[key];
    if (!data) return;
    archNodes.forEach((n) => {
      n.classList.toggle('is-active', n.dataset.node === key);
      n.classList.remove('is-dim', 'is-lit');
    });
    archEdges.forEach((e) => e.classList.remove('is-dim', 'is-lit'));
    $('#arch-title').textContent = data.name;
    $('#arch-copy').textContent = data.body;
    $('#arch-n').textContent = data.side.slice(0, 2).toUpperCase();
  }
  archNodes.forEach((n) => {
    n.addEventListener('click', () => selectNode(n.dataset.node));
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.dataset.node); } });
  });

  const archScenes = $('#arch-scenes');
  const archPinned = !reduced() && window.matchMedia('(min-width: 901px)').matches;
  if (!archPinned) {
    $('#arch-static').innerHTML = STATES.map((s) => `
      <div><span class="n mono">${s.n}</span><h4>${esc(s.title)}</h4><p>${esc(s.copy)}</p></div>`).join('');
    applyArchState(0);
  } else {
    applyArchState(0);
    let archTicking = false;
    function onArchScroll() {
      if (archTicking) return;
      archTicking = true;
      requestAnimationFrame(() => {
        const rect = archScenes.getBoundingClientRect();
        const total = archScenes.offsetHeight - window.innerHeight;
        const progress = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
        const idx = Math.min(STATES.length - 1, Math.floor(progress * STATES.length));
        if (archScenes.dataset.idx !== String(idx)) {
          archScenes.dataset.idx = String(idx);
          applyArchState(idx);
        }
        archTicking = false;
      });
    }
    window.addEventListener('scroll', onArchScroll, { passive: true });
    onArchScroll();
  }

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
  if (hoverCapable() && !reduced()) {
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

  /* ------------------------------------------------------------ command palette */
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
  function closePal() { pal.removeAttribute('open'); palInput.blur(); }
  function runPal() { const c = palItems[palIdx]; if (c) { closePal(); c.run(); } }

  $('#palette-open').addEventListener('click', openPal);
  palInput.addEventListener('input', renderPal);
  palList.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) { palIdx = Number(li.dataset.i); runPal(); } });
  $$('[data-close]', pal).forEach((el) => el.addEventListener('click', closePal));

  /* -------------------------------------------------------- easter egg */
  const toast = $('#toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2500);
  }
  let keyBuffer = '';
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPal(); return; }
    if (e.key === '/' && !typing) { e.preventDefault(); openPal(); return; }
    if (!typing && e.key.length === 1) {
      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-4);
      if (keyBuffer === 'sudo') {
        document.body.classList.toggle('diagnostic');
        showToast('System diagnostic mode — ' + (document.body.classList.contains('diagnostic') ? 'on' : 'off'));
      }
    }
    if (!pal.hasAttribute('open')) return;
    if (e.key === 'Escape') closePal();
    else if (e.key === 'ArrowDown') { e.preventDefault(); movePal(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); movePal(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(); }
  });

  /* ------------------------------------------------------------- cursor */
  (function cursor() {
    const cv = $('#cursor');
    if (!cv || !hoverCapable() || reduced()) return;
    document.body.classList.add('has-cursor');
    const dot = cv;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; cv.classList.add('is-on'); });
    (function loop() {
      x += (tx - x) * .22; y += (ty - y) * .22;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(loop);
    })();

    const LABELS = { explore: 'Explore', inspect: 'Inspect', download: 'Download', open: 'Open ↗', project: 'Explore' };
    const label = $('#cursor-label');
    const thumb = $('#cursor-thumb');

    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (!t) return;
      const mode = t.dataset.cursor;
      cv.classList.add('is-active');
      cv.classList.toggle('is-project', mode === 'project');
      label.textContent = LABELS[mode] || '';
      thumb.innerHTML = mode === 'project' ? (GLYPHS[Number(t.dataset.glyph) || 0] || '') : '';
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (!t) return;
      const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor]');
      if (to === t) return;
      cv.classList.remove('is-active', 'is-project');
      label.textContent = '';
      thumb.innerHTML = '';
    });
  })();

  /* ------------------------------------------------------- hero topology */
  let topologyDraw = null;
  function flashTopologyLabel() {
    const lbl = $('#topology-label');
    if (!lbl) return;
    const names = { platform: 'PLATFORM ROUTES', devsecops: 'DELIVERY ROUTES', sre: 'TELEMETRY ROUTES', ai: 'RETRIEVAL ROUTES', zerotrust: 'SECURITY ROUTES' };
    lbl.textContent = names[state.lens] || 'SYSTEM ROUTES';
    lbl.classList.add('is-on');
    clearTimeout(flashTopologyLabel._t);
    flashTopologyLabel._t = setTimeout(() => lbl.classList.remove('is-on'), 1400);
  }

  (function topology() {
    const cv = $('#topology');
    if (!cv) return;
    const box = cv.parentElement;
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, dpr = 1, clusters = [], routes = [], packets = [], raf = null;
    let pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const isTouch = !hoverCapable();

    const inkRgb = () => (currentlyDark() ? '243 246 249' : '11 15 21');
    const cssVar = (name, fallback) => (getComputedStyle(root).getPropertyValue(name).trim() || fallback);

    function layout() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const anchors = [
        { x: .30, y: .24 }, { x: .74, y: .18 }, { x: .22, y: .74 }, { x: .78, y: .70 }, { x: .52, y: .46 }
      ];
      clusters = anchors.map((a, ci) => {
        const cx = a.x * w, cy = a.y * h;
        const n = ci === 4 ? 3 : 4;
        const nodes = Array.from({ length: n }, (_, i) => {
          const ang = i * 2.399963 + ci;
          const rad = 22 + (i % 3) * 14;
          return { x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad, r: i === 0 ? 3.6 : 1.7, hub: i === 0 };
        });
        return { cx, cy, nodes, kind: ci };
      });

      routes = [];
      const trunkPairs = [[0, 4], [4, 1], [4, 2], [4, 3], [0, 2], [1, 3]];
      trunkPairs.forEach(([a, b]) => routes.push({ a: clusters[a], b: clusters[b], ak: a, bk: b }));

      packets = routes.map((rt, i) => ({ route: rt, t: (i / routes.length), speed: .00032 + (i % 3) * .00008 }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const ink = inkRgb(), sig = cssVar('--signal-rgb', '69 215 255'), amber = cssVar('--amber-rgb', '255 180 84');
      const activeKind = lensIndex[state.lens];
      const px = pointer.x * 14, py = pointer.y * 14;

      routes.forEach((rt) => {
        const on = rt.ak === activeKind || rt.bk === activeKind;
        ctx.strokeStyle = on ? `rgb(${sig} / .3)` : `rgb(${ink} / .07)`;
        ctx.lineWidth = on ? 1.3 : 1;
        ctx.beginPath();
        ctx.moveTo(rt.a.cx + px, rt.a.cy + py);
        ctx.lineTo(rt.b.cx + px, rt.b.cy + py);
        ctx.stroke();
      });

      clusters.forEach((c) => {
        const on = c.kind === activeKind;
        c.nodes.forEach((n) => {
          ctx.strokeStyle = on ? `rgb(${sig} / .35)` : `rgb(${ink} / .13)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(c.cx + px, c.cy + py);
          ctx.lineTo(n.x + px, n.y + py);
          ctx.stroke();
        });
        c.nodes.forEach((n) => {
          const color = on ? sig : ink;
          const alpha = n.hub ? (on ? .95 : .55) : (on ? .8 : .35);
          ctx.fillStyle = `rgb(${color} / ${alpha})`;
          if (on && n.hub) { ctx.shadowColor = `rgb(${sig} / .85)`; ctx.shadowBlur = 10; }
          ctx.beginPath(); ctx.arc(n.x + px, n.y + py, n.r, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      packets.forEach((p, i) => {
        const on = p.route.ak === activeKind || p.route.bk === activeKind;
        if (!on && i % 2 === 0) return;
        const { a, b } = p.route;
        const x = a.cx + (b.cx - a.cx) * p.t, y = a.cy + (b.cy - a.cy) * p.t;
        const color = on ? sig : amber;
        ctx.fillStyle = `rgb(${color} / ${on ? .95 : .5})`;
        ctx.shadowColor = `rgb(${color} / .8)`; ctx.shadowBlur = on ? 8 : 4;
        ctx.beginPath(); ctx.arc(x + px, y + py, on ? 2.2 : 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
    topologyDraw = draw;

    function step() {
      pointer.x += (pointer.tx - pointer.x) * .05;
      pointer.y += (pointer.ty - pointer.y) * .05;
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
      box.addEventListener('mousemove', (e) => {
        const r = box.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width - .5);
        pointer.ty = ((e.clientY - r.top) / r.height - .5);
        $('#topology-label').classList.add('is-on');
      });
      box.addEventListener('mouseleave', () => { $('#topology-label').classList.remove('is-on'); });
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
