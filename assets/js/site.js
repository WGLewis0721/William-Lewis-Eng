/* =========================================================================
   William G. Lewis — portfolio behaviour
   ========================================================================= */
(function () {
  'use strict';

  const { PROFILE, SECTORS, LENSES, MASTER, CLASSIFIED_PROFILE, PROJECTS, AFFILIATIONS,
          EXPERIENCE, METRICS, SKILL_DOMAINS, CREDENTIALS, ARCH_NODES } = SITE;

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

  /* Accent pairs: the bright hex reads on the dark ground, the deep hex holds
     contrast on the light ground. Both are written to the root on every swap. */
  const ACCENTS = {
    platform:  { bright: '#F2A93B', deep: '#8A5605' },
    devsecops: { bright: '#3FBFA2', deep: '#0B6A55' },
    ai:        { bright: '#A98CE8', deep: '#59389E' },
    zerotrust: { bright: '#E4715C', deep: '#A33420' }
  };

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pick = (v, sector) => (v && !Array.isArray(v) && typeof v === 'object' ? v[sector] : v);

  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(' ');
  };

  /* ---------------------------------------------------------------- state */
  const lensById = Object.fromEntries(LENSES.map((l) => [l.id, l]));
  const state = {
    lens: 'platform',
    sector: 'private'
  };

  const editionsOf = (lensId) => Object.keys(lensById[lensId].editions);
  const activeLens = () => lensById[state.lens];
  const activeEdition = () => activeLens().editions[state.sector];

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
  function paintThemeIcon() {
    themeIcon.innerHTML = currentlyDark() ? SUN : MOON;
  }
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
    const available = editionsOf(id);
    if (!available.includes(state.sector)) state.sector = available[0];
    render(opts);
  }
  function setSector(s, opts) {
    if (!editionsOf(state.lens).includes(s)) return;
    state.sector = s;
    render(opts);
  }

  /* ------------------------------------------------------------- rendering */
  const swaps = () => $$('.swap');

  function render(opts) {
    const animate = !(opts && opts.silent) && !reduced();
    if (animate) {
      swaps().forEach((el) => el.classList.add('is-out'));
      setTimeout(() => { paint(); swaps().forEach((el) => el.classList.remove('is-out')); }, 170);
    } else {
      paint();
    }
    paintControls();
  }

  function paintControls() {
    const available = editionsOf(state.lens);
    const acc = ACCENTS[state.lens];
    root.style.setProperty('--accent-bright', acc.bright);
    root.style.setProperty('--accent-deep', acc.deep);
    root.style.setProperty('--accent-bright-rgb', hexToRgb(acc.bright));
    root.style.setProperty('--accent-deep-rgb', hexToRgb(acc.deep));

    $$('[data-lens]', lensSeg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lens === state.lens)));
    $$('[data-sector]', sectorSeg).forEach((b) => {
      const ok = available.includes(b.dataset.sector);
      b.disabled = !ok;
      b.setAttribute('aria-pressed', String(ok && b.dataset.sector === state.sector));
      b.title = ok ? '' : `No ${SECTORS[b.dataset.sector].label.toLowerCase()} edition for the ${activeLens().label} lens`;
    });

    const note = $('#lens-note');
    note.innerHTML = available.length === 1
      ? `This track is written for <b>${esc(SECTORS[available[0]].label.toLowerCase())}</b> hiring only.`
      : `Both editions available — <b>${esc(SECTORS[state.sector].label.toLowerCase())}</b> shown.`;

    $('#clearance-line').textContent = state.sector === 'gov'
      ? PROFILE.clearance
      : 'Active TS clearance held · SCI eligible';
  }

  function paint() {
    const ed = activeEdition();

    $('#hero-role').textContent = ed.title;
    $('#hero-tagline').textContent = ed.tagline;
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
    $('#hero-download-label').textContent = 'Download this resume';

    $('#focus-title').textContent = ed.title;
    $('#focus-summary').textContent = ed.summary;
    $('#focus-comps').innerHTML = ed.competencies.map((c) => `<span class="chip chip--on">${esc(c)}</span>`).join('');
    $('#focus-impact').innerHTML = ed.impact.map((i) => `
      <article class="impact__card panel">
        <h3>${esc(i.title)}</h3>
        <p>${esc(i.body)}</p>
      </article>`).join('');

    paintTimeline();
    paintMetrics();
    paintCapEmphasis();
    paintResumeCards();
    buildPrintResume();
  }

  /* -------------------------------------------------------------- timeline */
  function paintTimeline() {
    const s = state.sector;
    $('#timeline').innerHTML = EXPERIENCE.map((job) => {
      const bullets = pick(job.bullets, s) || [];
      return `
      <article class="tl__row${job.current ? ' is-current' : ''}">
        <div class="tl__when">
          <span class="period">${esc(job.period)}</span>
          ${job.current ? '<span class="now">Current</span>' : ''}
        </div>
        <div class="tl__spine"><i></i></div>
        <div class="tl__what">
          <h3>${esc(pick(job.role, s))}</h3>
          <p class="tl__org">${esc(job.org)} <span class="ctx">· ${esc(pick(job.context, s))}</span></p>
          <ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          <div class="tl__stack">${job.stack.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        </div>
      </article>`;
    }).join('');
  }

  /* --------------------------------------------------------------- metrics */
  let metricsCounted = false;
  function paintMetrics() {
    const list = METRICS.filter((m) => !m.sector || m.sector === state.sector);
    $('#metrics').innerHTML = list.map((m, i) => {
      const shown = m.text || m.display || ((m.prefix || '') + m.value + (m.suffix || ''));
      const countable = !m.text && !m.display;
      return `
      <div class="metric">
        <div class="metric__v" ${countable ? `data-count="${m.value}" data-suffix="${m.suffix || ''}"` : ''}>${esc(countable && !metricsCounted ? '0' + (m.suffix || '') : shown)}</div>
        <div class="metric__l">${esc(m.label)}</div>
        <div class="metric__n">${esc(m.note)}</div>
      </div>`;
    }).join('');
    if (metricsCounted) $$('#metrics [data-count]').forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
  }

  function runCounters() {
    if (metricsCounted) return;
    metricsCounted = true;
    $$('#metrics [data-count]').forEach((el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduced()) { el.textContent = target + suffix; return; }
      const t0 = performance.now();
      const dur = 1100;
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* ---------------------------------------------------------- capabilities */
  $('#cap-grid').innerHTML = SKILL_DOMAINS.map((d) => `
    <section class="cap panel" data-domain="${d.id}">
      <div class="cap__h">
        <h3>${esc(d.name)}</h3>
        <span>${esc(d.note)}</span>
      </div>
      <div class="cap__list">
        ${d.skills.map((sk) => `<span class="chip" data-skill="${esc(sk.n.toLowerCase())}" data-lenses="${sk.l.join(' ')}">${esc(sk.n)}</span>`).join('')}
      </div>
    </section>`).join('');

  function paintCapEmphasis() {
    $$('#cap-grid .chip').forEach((chip) => {
      const on = chip.dataset.lenses.split(' ').includes(state.lens);
      chip.classList.toggle('chip--on', on);
      chip.classList.toggle('is-dim', !on);
    });
    updateCapCount();
  }

  const capSearch = $('#cap-search');
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
    updateCapCount();
  }
  function updateCapCount() {
    const total = $$('#cap-grid .chip').length;
    const shown = $$('#cap-grid .chip:not(.is-hidden)').length;
    const lit = $$('#cap-grid .chip.chip--on:not(.is-hidden)').length;
    $('#cap-count').textContent = capSearch.value.trim()
      ? `${shown} of ${total} match`
      : `${total} capabilities · ${lit} emphasized by this lens`;
  }
  capSearch.addEventListener('input', filterCaps);

  /* ------------------------------------------------------------- projects */
  $('#proj-grid').innerHTML = PROJECTS.map((pr) => `
    <article class="proj panel">
      <div class="proj__id">
        <h3>${esc(pr.name)}</h3>
        <p class="proj__ctx">${esc(pr.context)}</p>
        <span class="proj__status">${esc(pr.status)}</span>
      </div>
      <div class="proj__body">
        <p class="proj__lead">${esc(pr.lead)}</p>
        <p class="proj__detail">${esc(pr.body)}</p>
        <div class="proj__stack">${pr.stack.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      </div>
    </article>`).join('');

  /* ----------------------------------------------------------- credentials */
  const KIND = { cert: 'Certification', clearance: 'Clearance', education: 'Education' };
  $('#cred-grid').innerHTML = CREDENTIALS.map((c) => `
    <article class="cred panel">
      <span class="kind">${esc(KIND[c.kind])}</span>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.meta)}</p>
    </article>`).join('');

  $('#profile-list').innerHTML = CLASSIFIED_PROFILE.map((r) =>
    `<div><dt>${esc(r.k)}</dt><dd>${esc(r.v)}</dd></div>`).join('');
  $('#affiliations').textContent = AFFILIATIONS.join(' · ');

  /* --------------------------------------------------------- resume cards */
  const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 18.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5"/></svg>';
  const PR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V3h10v6M7 19H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M7 15h10v6H7z"/></svg>';

  const EDITION_LIST = LENSES.flatMap((l) =>
    Object.entries(l.editions).map(([sector, ed]) => ({ lens: l, sector, ed }))
  );

  function paintResumeCards() {
    $('#res-grid').innerHTML = EDITION_LIST.map(({ lens, sector, ed }) => {
      const isActive = lens.id === state.lens && sector === state.sector;
      const acc = ACCENTS[lens.id];
      return `
      <article class="res panel${isActive ? ' is-active' : ''}"
               style="--card-accent:${acc.bright};--card-ink:${acc.deep}">
        <div class="res__h">
          <span class="res__badge">${esc(SECTORS[sector].label)}</span>
          <h3>${esc(ed.title)}</h3>
          <p>${esc(ed.tagline)}</p>
        </div>
        <p class="res__sum">${esc(ed.summary.split('. ')[0])}.</p>
        <div class="res__acts">
          <a class="btn${isActive ? ' btn--primary' : ''}" href="${RESUME_BASE + encodeURIComponent(ed.file)}" ${linkAttrs(ed.file)}>${DL_ICON}Word</a>
          <button class="btn" type="button" data-print="${lens.id}" data-print-sector="${sector}">${PR_ICON}Print / PDF</button>
        </div>
        <p class="res__file">${esc(ed.file)}</p>
      </article>`;
    }).join('');
  }

  $('#res-master').innerHTML = `
    <article class="master panel">
      <div>
        <span class="master__badge">${esc(MASTER.badge)}</span>
        <h3>${esc(MASTER.title)}</h3>
        <p class="master__tag">${esc(MASTER.tagline)}</p>
        <div class="master__acts">
          <a class="btn btn--primary" href="${RESUME_BASE + encodeURIComponent(MASTER.file)}" ${linkAttrs(MASTER.file)}>${DL_ICON}Download complete resume</a>
        </div>
        <p class="master__file">${esc(MASTER.file)}</p>
      </div>
      <div style="display:grid;gap:.9rem">
        <p class="master__sum">${esc(MASTER.summary)}</p>
        <p class="master__note">${esc(MASTER.note)}</p>
      </div>
    </article>`;

  $('#res-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-print]');
    if (!b) return;
    setLens(b.dataset.print, { silent: true });
    setSector(b.dataset.printSector, { silent: true });
    setTimeout(() => window.print(), 60);
  });

  /* -------------------------------------------------------- print resume */
  function buildPrintResume() {
    const ed = activeEdition();
    const s = state.sector;
    const contact = [PROFILE.location, PROFILE.email, PROFILE.phone, PROFILE.linkedin.label, PROFILE.github.label].join(' | ');
    const certs = CREDENTIALS.filter((c) => c.kind !== 'education');
    const edu = CREDENTIALS.find((c) => c.kind === 'education');

    $('#print-resume').innerHTML = `
      <div class="pr">
        <h1>${esc(PROFILE.name.toUpperCase())}</h1>
        <div class="pr-role">${esc(ed.title)} | ${esc(ed.tagline.replace(/ · /g, ' | '))}</div>
        <div class="pr-meta">${esc(contact)}</div>
        ${s === 'gov' ? `<div class="pr-clear">${esc(PROFILE.clearance.replace(/ · /g, ' | '))}</div>` : ''}

        <h2>Professional Summary</h2>
        <p>${esc(ed.summary)}</p>

        <h2>Core Competencies</h2>
        <p class="pr-comp">${esc(ed.competencies.join(' | '))}</p>

        <h2>Selected Impact</h2>
        ${ed.impact.map((i) => `<p class="pr-impact"><b>${esc(i.title)}:</b> ${esc(i.body)}</p>`).join('')}

        <h2>Professional Experience</h2>
        ${EXPERIENCE.map((job) => `
          <div class="pr-job">
            <div class="pr-job-h">
              <strong>${esc(pick(job.role, s))}</strong>
              <span>${esc(job.period)}</span>
            </div>
            <div class="pr-org">${esc(job.org)}${s === 'gov' && job.id === 'oteemo' ? ', CNAP Program, Gunter AFB' : ''}</div>
            <ul>${(pick(job.bullets, s) || []).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          </div>`).join('')}

        <h2>Certifications &amp; Education</h2>
        <p>${esc(certs.filter((c) => s === 'gov' || c.kind === 'cert').map((c) => `${c.name} (${c.meta})`).join(' | '))}</p>
        <p>${esc(edu.name + ', ' + edu.meta)}</p>
      </div>`;
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

    const counter = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCounters(); counter.disconnect(); } });
    }, { threshold: 0.35 });
    counter.observe($('#metrics'));

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
    runCounters();
  }

  /* ------------------------------------------------------ command palette */
  const pal = $('#palette');
  const palInput = $('#pal-input');
  const palList = $('#pal-list');
  let palItems = [];
  let palIdx = 0;

  function commands() {
    const list = [
      { label: 'Focus', group: 'Go to', run: () => location.hash = '#focus' },
      { label: 'Architecture in practice', group: 'Go to', run: () => location.hash = '#architecture' },
      { label: 'Experience', group: 'Go to', run: () => location.hash = '#experience' },
      { label: 'Capabilities', group: 'Go to', run: () => location.hash = '#capabilities' },
      { label: 'Credentials', group: 'Go to', run: () => location.hash = '#credentials' },
      { label: 'Signature projects', group: 'Go to', run: () => location.hash = '#projects' },
      { label: 'Resume downloads', group: 'Go to', run: () => location.hash = '#resume' },
      { label: 'Contact', group: 'Go to', run: () => location.hash = '#contact' }
    ];
    LENSES.forEach((l) => list.push({ label: `Read as ${l.label}`, group: 'Lens', run: () => setLens(l.id) }));
    const grab = (file) => () => {
      const url = RESUME_BASE + encodeURIComponent(file);
      if (OFF_SITE) { window.open(url, '_blank', 'noopener'); return; }
      const a = document.createElement('a');
      a.href = url; a.download = file;
      document.body.appendChild(a); a.click(); a.remove();
    };
    list.push({ label: 'Complete resume — every project, nothing trimmed', group: 'Download', run: grab(MASTER.file) });
    EDITION_LIST.forEach(({ lens, sector, ed }) => list.push({
      label: `${ed.title} — ${SECTORS[sector].short}`,
      group: 'Download',
      run: grab(ed.file)
    }));
    list.push({ label: 'Print the current edition as PDF', group: 'Action', run: () => window.print() });
    list.push({ label: 'Switch color theme', group: 'Action', run: () => $('#theme-toggle').click() });
    list.push({ label: 'Email William', group: 'Action', run: () => location.href = 'mailto:' + PROFILE.email });
    return list;
  }
  const ALL_COMMANDS = commands();

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
  function openPal() {
    pal.setAttribute('open', '');
    palInput.value = '';
    renderPal();
    palInput.focus();
  }
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
    if (e.key === 'Escape') { closePal(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); movePal(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); movePal(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(); }
  });

  /* -------------------------------------------------------- ambient field */
  (function field() {
    const cv = $('#field');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, dpr = 1, nodes = [], packets = [], raf = null;

    function accent() {
      return getComputedStyle(root).getPropertyValue('--a-rgb').trim() || '242 169 59';
    }
    function inkColor() {
      return currentlyDark() ? '222 231 235' : '12 20 24';
    }
    function size() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(52, Math.round((w * h) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
        r: Math.random() * 1.3 + 0.7
      }));
      packets = Array.from({ length: 5 }, () => ({ a: 0, b: 1, t: Math.random(), speed: 0.0018 + Math.random() * 0.0022 }));
    }

    function draw(moving) {
      ctx.clearRect(0, 0, w, h);
      const ink = inkColor();
      const acc = accent();
      const LINK = 132;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgb(${ink} / ${(1 - d / LINK) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.fillStyle = `rgb(${ink} / .28)`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      });

      packets.forEach((p) => {
        const a = nodes[p.a % nodes.length], b = nodes[p.b % nodes.length];
        if (!a || !b) return;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.fillStyle = `rgb(${acc} / .85)`;
        ctx.beginPath(); ctx.arc(x, y, 2.1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgb(${acc} / .18)`;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      });

      if (!moving) return;
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = w + 10; if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10; if (n.y > h + 10) n.y = -10;
      });
      packets.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.a = Math.floor(Math.random() * nodes.length);
          p.b = Math.floor(Math.random() * nodes.length);
        }
      });
    }

    function loop() { draw(true); raf = requestAnimationFrame(loop); }
    function start() {
      if (raf) cancelAnimationFrame(raf);
      size();
      if (reduced()) draw(false); else loop();
    }
    let rt = null;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(start, 180); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
      else if (!document.hidden && !reduced() && !raf) loop();
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
