/* =========================================================================
   William G. Lewis — portfolio behaviour
   ========================================================================= */
(function () {
  'use strict';

  const { PROFILE, SECTORS, LENSES, MASTER, CLASSIFIED_PROFILE, PROJECTS,
          PUBLICATIONS, AFFILIATIONS, EXPERIENCE, METRICS, CREDENTIALS, ARCH_NODES } = SITE;

  /* Where the resume files live. Served from the repo they sit next to the
     page, which is the default. A copy of this page travelling on its own —
     the single-file build, say — sets data-resume-base on <html> to point back
     at wherever the files are actually hosted. */
  const RESUME_BASE = document.documentElement.dataset.resumeBase || 'assets/resume/';
  const OFF_SITE = /^https?:/i.test(RESUME_BASE);

  /* `download` only applies same-origin, so off-site copies open in a new tab. */
  const linkAttrs = (file) => OFF_SITE
    ? 'target="_blank" rel="noopener"'
    : `download="${esc(file)}"`;

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

  /* Every competency named anywhere, for the breadth figure in the caption. */
  const ALL_COMPETENCIES = new Set(LENSES.flatMap((l) => l.competencies.flatMap((g) => g.items)));

  /* ------------------------------------------------------------- theme */
  const root = document.documentElement;
  const themeIcon = $('#theme-icon');
  const MOON = '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"/>';
  const SUN = '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>';

  function currentlyDark() {
    const stamp = root.getAttribute('data-theme');
    if (stamp) return stamp === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paintThemeIcon() { themeIcon.innerHTML = currentlyDark() ? SUN : MOON; }

  try {
    const saved = localStorage.getItem('wgl-theme');
    if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  } catch (e) { /* storage unavailable — the system theme still applies */ }
  paintThemeIcon();

  $('#theme-toggle').addEventListener('click', () => {
    const next = currentlyDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('wgl-theme', next); } catch (e) {}
    paintThemeIcon();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintThemeIcon);

  /* --------------------------------------------------------- lens controls */
  const lensSeg = $('#lens-seg');
  const sectorSeg = $('#sector-seg');

  lensSeg.innerHTML = LENSES.map((l) =>
    `<button type="button" data-lens="${l.id}" aria-pressed="false" title="${esc(l.blurb)}">${esc(l.label)}</button>`
  ).join('');
  sectorSeg.innerHTML = ['private', 'gov'].map((s) =>
    `<button type="button" data-sector="${s}" aria-pressed="false">${esc(SECTORS[s].label)}</button>`
  ).join('');

  lensSeg.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lens]');
    if (b) setLens(b.dataset.lens);
  });
  sectorSeg.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sector]');
    if (b && !b.disabled) setSector(b.dataset.sector);
  });

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
      setTimeout(() => { paint(); $$('.swap').forEach((el) => el.classList.remove('is-out')); }, 170);
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

    $$('[data-lens]', lensSeg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lens === state.lens)));
    $$('[data-sector]', sectorSeg).forEach((b) => {
      const ok = available.includes(b.dataset.sector);
      b.disabled = !ok;
      b.setAttribute('aria-pressed', String(ok && b.dataset.sector === state.sector));
    });

    $('#lens-note').innerHTML =
      `Showing the <b>${esc(SECTORS[state.sector].label.toLowerCase())}</b> edition.`;

    $('#clearance-line').textContent = state.sector === 'gov'
      ? PROFILE.clearance
      : 'Active TS clearance held · SCI eligible';
  }

  function paint() {
    const L = activeLens();
    const ed = activeEdition();

    $('#hero-role').textContent = L.title;
    $('#hero-tagline').innerHTML = ed.tagline.split(' · ').map((s) => `<span>${esc(s)}</span>`).join('');
    $('#hero-summary').textContent = ed.summary;

    const heroDl = $('#hero-download');
    heroDl.href = RESUME_BASE + encodeURIComponent(ed.file);
    if (OFF_SITE) {
      heroDl.removeAttribute('download');
      heroDl.target = '_blank';
      heroDl.rel = 'noopener';
    } else {
      heroDl.setAttribute('download', ed.file);
    }

    $('#focus-title').textContent = L.title;
    $('#focus-summary').textContent = ed.summary;
    $('#focus-impact').innerHTML = L.impact.map((i) => `
      <article class="impact__card">
        <h3>${esc(i.title)}</h3>
        <p>${esc(i.body)}</p>
      </article>`).join('');

    paintTimeline();
    paintFigures();
    paintCapabilities();
    paintResume();
  }

  /* -------------------------------------------------------------- timeline */
  function paintTimeline() {
    const L = activeLens();
    $('#timeline').innerHTML = EXPERIENCE.map((job) => {
      const order = L.bulletOrder[job.id] || job.bullets.map((_, i) => i);
      const bullets = order.map((i) => job.bullets[i]).filter(Boolean);
      const context = (state.sector === 'gov' && job.program) ? job.program : job.context;
      return `
      <article class="tl__row${job.current ? ' is-current' : ''}">
        <div class="tl__when">
          <span class="period">${esc(job.period)}</span>
          ${job.current ? '<span class="now">Current</span>' : ''}
        </div>
        <div class="tl__spine"><i></i></div>
        <div class="tl__what">
          <h3>${esc(job.role)}</h3>
          <p class="tl__org">${esc(job.org)} <span class="ctx">· ${esc(context)}</span></p>
          <ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          <p class="tl__stack">${job.stack.map(esc).join(', ')}</p>
        </div>
      </article>`;
    }).join('');
  }

  /* --------------------------------------------------------------- figures */
  function paintFigures() {
    const list = METRICS.filter((m) => !m.sector || m.sector === state.sector);
    $('#figures').innerHTML = list.map((m) => {
      const shown = m.text || m.display || ((m.prefix || '') + m.value + (m.suffix || ''));
      return `
      <div class="figure">
        <span class="figure__v">${esc(shown)}</span>
        <span class="figure__l">${esc(m.label)} <span class="mono" style="opacity:.7">— ${esc(m.note)}</span></span>
      </div>`;
    }).join('');
  }

  /* ---------------------------------------------------------- capabilities */
  const capSearch = $('#cap-search');

  function paintCapabilities() {
    $('#cap-grid').innerHTML = activeLens().competencies.map((g) => `
      <section class="cap">
        <div class="cap__h">
          <h3>${esc(g.group)}</h3>
          <span>${g.items.length} listed</span>
        </div>
        <div class="cap__list">
          ${g.items.map((s) => `<span class="chip" data-skill="${esc(s.toLowerCase())}">${esc(s)}</span>`).join('')}
        </div>
      </section>`).join('');
    filterCaps();
  }

  function filterCaps() {
    const q = capSearch.value.trim().toLowerCase();
    $$('#cap-grid .cap').forEach((card) => {
      let visible = 0;
      $$('.chip', card).forEach((chip) => {
        const hit = !q || chip.dataset.skill.includes(q);
        chip.classList.toggle('is-hidden', !hit);
        if (hit) visible++;
      });
      card.classList.toggle('is-empty', visible === 0);
    });
    const total = $$('#cap-grid .chip').length;
    const shown = $$('#cap-grid .chip:not(.is-hidden)').length;
    $('#cap-count').textContent = q
      ? `${shown} of ${total} match on this edition`
      : `${total} on this edition · ${ALL_COMPETENCIES.size} across all five tracks`;
  }
  capSearch.addEventListener('input', filterCaps);

  /* ------------------------------------------------------------- projects */
  $('#proj-list').innerHTML = PROJECTS.map((pr) => `
    <article class="proj">
      <div class="proj__id">
        <h3>${esc(pr.name)}</h3>
        <p class="proj__ctx">${esc(pr.context)}</p>
        <span class="proj__status">${esc(pr.status)}</span>
      </div>
      <div class="proj__body">
        <p class="proj__lead">${esc(pr.lead)}</p>
        <p class="proj__detail">${esc(pr.body)}</p>
        <p class="proj__stack"><b>Built with —</b> ${pr.stack.map(esc).join(', ')}</p>
      </div>
    </article>`).join('');

  /* ----------------------------------------------------------- credentials */
  const KIND = { cert: 'Certification', clearance: 'Clearance', education: 'Education' };
  $('#cred-ledger').innerHTML = CREDENTIALS.map((c) => `
    <article class="cred">
      <span class="kind">${esc(KIND[c.kind])}</span>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.meta)}</p>
    </article>`).join('');

  $('#profile-list').innerHTML = CLASSIFIED_PROFILE.map((r) =>
    `<div><dt>${esc(r.k)}</dt><dd>${esc(r.v)}</dd></div>`).join('');

  $('#publications').innerHTML = PUBLICATIONS.map((p) => `<li>${esc(p)}</li>`).join('');
  $('#affiliations').textContent = AFFILIATIONS.join(' · ');

  /* --------------------------------------------------------- resume plates */
  const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 18.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5"/></svg>';

  const EDITION_LIST = LENSES.flatMap((l) =>
    Object.entries(l.editions).map(([sector, ed]) => ({ lens: l, sector, ed })));

  const fileKind = (f) => (f.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Word');

  function paintResume() {
    const L = activeLens();
    const ed = activeEdition();

    $('#res-recommended').innerHTML = `
      <article class="plate plate--marked res-recommended">
        <div>
          <span class="res-recommended__badge">Recommended for this view · ${esc(SECTORS[state.sector].label)}</span>
          <h3>${esc(L.title)}</h3>
          <p class="res-recommended__tag">${esc(ed.tagline)}</p>
          <div class="res-recommended__acts">
            <a class="btn btn--primary" href="${RESUME_BASE + encodeURIComponent(ed.file)}" ${linkAttrs(ed.file)}>${DL_ICON}Download ${fileKind(ed.file)}</a>
          </div>
          <p class="res-recommended__file">${esc(ed.file)}</p>
        </div>
        <p class="res-recommended__sum">${esc(ed.summary)}</p>
      </article>`;

    const rows = [{
      label: MASTER.title + ' — master edition',
      ctx: MASTER.tagline,
      file: MASTER.file,
      active: false
    }].concat(EDITION_LIST.map(({ lens, sector, ed: e }) => ({
      label: `${lens.title}`,
      ctx: `${lens.label} · ${SECTORS[sector].label}`,
      file: e.file,
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
  const archNodes = $$('#arch-svg .n-hit');
  function selectNode(key) {
    const data = ARCH_NODES[key];
    if (!data) return;
    archNodes.forEach((n) => n.classList.toggle('is-active', n.dataset.node === key));
    $('#arch-side').textContent = data.side;
    $('#arch-name').textContent = data.name;
    $('#arch-body').textContent = data.body;
  }
  archNodes.forEach((n) => {
    n.addEventListener('click', () => selectNode(n.dataset.node));
    n.addEventListener('mouseenter', () => selectNode(n.dataset.node));
    n.addEventListener('focus', () => selectNode(n.dataset.node));
    n.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.dataset.node); }
    });
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
    }, { rootMargin: '0px 0px -12% 0px' });
    $$('.rv').forEach((el) => revealer.observe(el));

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['focus', 'architecture', 'projects', 'experience', 'capabilities', 'credentials', 'resume'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  } else {
    $$('.rv').forEach((el) => el.classList.add('is-in'));
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
      { label: 'Focus', group: 'Go to', run: () => location.hash = '#focus' },
      { label: 'Architecture in practice', group: 'Go to', run: () => location.hash = '#architecture' },
      { label: 'Signature projects', group: 'Go to', run: () => location.hash = '#projects' },
      { label: 'Experience', group: 'Go to', run: () => location.hash = '#experience' },
      { label: 'Capabilities', group: 'Go to', run: () => location.hash = '#capabilities' },
      { label: 'Credentials', group: 'Go to', run: () => location.hash = '#credentials' },
      { label: 'Resume downloads', group: 'Go to', run: () => location.hash = '#resume' },
      { label: 'Contact', group: 'Go to', run: () => location.hash = '#contact' }
    ];
    LENSES.forEach((l) => list.push({ label: `Read as ${l.label}`, group: 'Lens', run: () => setLens(l.id) }));
    list.push({ label: 'Switch to the cleared / government edition', group: 'Context', run: () => setSector('gov') });
    list.push({ label: 'Switch to the private-sector edition', group: 'Context', run: () => setSector('private') });
    list.push({ label: 'Complete resume — every project, nothing trimmed', group: 'Download', run: grab(MASTER.file) });
    EDITION_LIST.forEach(({ lens, sector, ed }) => list.push({
      label: `${lens.title} — ${SECTORS[sector].short}`,
      group: 'Download',
      run: grab(ed.file)
    }));
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
      : '<li aria-selected="false" style="color:var(--ink-dim)">No match</li>';
  }
  function movePal(delta) {
    if (!palItems.length) return;
    palIdx = (palIdx + delta + palItems.length) % palItems.length;
    $$('#pal-list li').forEach((li, i) => li.setAttribute('aria-selected', String(i === palIdx)));
    const sel = palList.children[palIdx];
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  function openPal() { pal.setAttribute('open', ''); palInput.value = ''; renderPal(); palInput.focus(); }
  function closePal() { pal.removeAttribute('open'); }
  function runPal() {
    const c = palItems[palIdx];
    if (c) { closePal(); c.run(); }
  }

  $('#palette-open').addEventListener('click', openPal);
  palInput.addEventListener('input', renderPal);
  palList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-i]');
    if (li) { palIdx = Number(li.dataset.i); runPal(); }
  });
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

  /* ------------------------------------------------------------ deep links */
  const params = new URLSearchParams(location.search);
  if (params.get('lens') && lensById[params.get('lens')]) state.lens = params.get('lens');
  if (params.get('for') && SECTORS[params.get('for')]) state.sector = params.get('for');
  if (!editionsOf(state.lens).includes(state.sector)) state.sector = editionsOf(state.lens)[0];

  render({ silent: true });
})();
