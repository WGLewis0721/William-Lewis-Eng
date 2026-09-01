/* =========================================================================
   William G. Lewis — portfolio behaviour

   The page is one document rendered through a role lens. This file owns the
   state (which lens, which hiring context), paints every lens-dependent
   region from data.js, and carries the four interactions worth having:
   the profile selector, the architecture drawing, the search palette, and
   the theme switch.
   ========================================================================= */
(function () {
  'use strict';

  const { PROFILE, SECTORS, LENSES, MASTER, CLASSIFIED_PROFILE, PROJECTS,
          PUBLICATIONS, AFFILIATIONS, EXPERIENCE, METRICS, CREDENTIALS,
          ARCH_NODES, ARCH_STORY } = SITE;

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
  const href = (file) => RESUME_BASE + encodeURIComponent(file);
  const fileKind = (f) => (f.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Word');

  /* ---------------------------------------------------------------- state */
  const lensById = Object.fromEntries(LENSES.map((l) => [l.id, l]));
  const state = { lens: 'platform', sector: 'private' };

  const editionsOf = (id) => Object.keys(lensById[id].editions);
  const activeLens = () => lensById[state.lens];
  const activeEdition = () => activeLens().editions[state.sector];

  const EDITION_LIST = LENSES.flatMap((l) =>
    Object.entries(l.editions).map(([sector, ed]) => ({ lens: l, sector, ed })));

  /* Counts quoted in the copy are derived, never typed twice. */
  const COUNT = {
    tracks: LENSES.length,
    editions: EDITION_LIST.length,
    files: EDITION_LIST.length + 1,
    skills: new Set(LENSES.flatMap((l) => l.competencies.flatMap((g) => g.items))).size,
    cases: PROJECTS.length
  };
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const spell = (n) => (n <= 10 ? words[n] : String(n));

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

  /* --------------------------------------------------- the profile selector */
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
      setTimeout(() => { paint(); $$('.swap').forEach((el) => el.classList.remove('is-out')); }, 150);
    } else {
      paint();
    }
    paintControls();
  }

  function paintControls() {
    const available = editionsOf(state.lens);
    const L = activeLens();
    /* The lens tints one index tick. The page palette does not move. */
    root.style.setProperty('--lens-bright', L.accent);
    root.style.setProperty('--lens-deep', L.accentInk);

    $$('[data-lens]', lensSeg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lens === state.lens)));
    $$('[data-sector]', sectorSeg).forEach((b) => {
      const ok = available.includes(b.dataset.sector);
      b.disabled = !ok;
      b.setAttribute('aria-pressed', String(ok && b.dataset.sector === state.sector));
    });

    $('#lens-note').innerHTML =
      `Showing the <b>${esc(SECTORS[state.sector].label.toLowerCase())}</b> edition.`;

    $('#tb-clearance').textContent = state.sector === 'gov'
      ? PROFILE.clearance
      : 'Active Top Secret · SCI eligible';
  }

  function paint() {
    const L = activeLens();
    const ed = activeEdition();

    $('#hero-role').textContent = L.title;
    $('#hero-summary').textContent = ed.summary;
    $('#tb-discipline').textContent = L.blurb;

    const heroDl = $('#hero-download');
    heroDl.href = href(ed.file);
    heroDl.setAttribute('aria-label', `Download the ${L.title} resume, ${SECTORS[state.sector].label} edition, ${fileKind(ed.file)}`);
    if (OFF_SITE) {
      heroDl.removeAttribute('download');
      heroDl.target = '_blank';
      heroDl.rel = 'noopener';
    } else {
      heroDl.setAttribute('download', ed.file);
    }
    $('#hero-download-label').textContent = 'Download this resume';

    $('#focus-title').textContent = L.title;
    $('#focus-summary').textContent = ed.summary;
    $('#focus-impact').innerHTML = L.impact.map((i) => `
      <li>
        <h3>${esc(i.title)}</h3>
        <p>${esc(i.body)}</p>
      </li>`).join('');

    paintTimeline();
    paintCapabilities();
    paintResume();
  }

  /* Copy that quotes a number reads it off the data. */
  $('#focus-lede').textContent =
    `${spell(COUNT.editions).replace(/^./, (c) => c.toUpperCase())} resume editions across ${spell(COUNT.tracks)} role tracks. ` +
    'Pick a profile above and this page — summary, impact, capabilities, the order of the experience bullets, and the resume you download — reframes to match the job you are hiring for.';
  $('#proj-lede').textContent =
    `${spell(COUNT.cases).replace(/^./, (c) => c.toUpperCase())} projects that put models into production — one of them inside a classified enclave with no commercial cloud dependency at all.`;
  $('#res-lede').textContent =
    `${spell(COUNT.editions).replace(/^./, (c) => c.toUpperCase())} tailored PDFs — ${spell(COUNT.tracks)} role tracks, each written once for cleared government hiring and once for the private sector — plus the full-detail master resume in Word.`;

  /* -------------------------------------------------------------- career */
  function paintTimeline() {
    const L = activeLens();
    $('#timeline').innerHTML = EXPERIENCE.map((job) => {
      const order = L.bulletOrder[job.id] || job.bullets.map((_, i) => i);
      const bullets = order.map((i) => job.bullets[i]).filter(Boolean);
      const context = (state.sector === 'gov' && job.program) ? job.program : job.context;
      return `
      <article class="job">
        <div class="job__when">
          <span class="job__period">${esc(job.period)}</span>
          ${job.current ? '<span class="job__now">Current</span>' : ''}
        </div>
        <div class="job__what">
          <h3>${esc(job.role)}</h3>
          <p class="job__org">${esc(job.org)} <span class="ctx">— ${esc(context)}</span></p>
          <ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
          <p class="job__stack">${esc(job.stack.join('  ·  '))}</p>
        </div>
      </article>`;
    }).join('');
  }

  /* -------------------------------------------------------------- record */
  $('#record').innerHTML = METRICS.map((m) => {
    const shown = m.text || m.display || ((m.prefix || '') + m.value + (m.suffix || ''));
    return `<div><dt>${esc(shown)}</dt><dd>${esc(m.label)}<span>${esc(m.note)}</span></dd></div>`;
  }).join('');

  /* ---------------------------------------------------------- capabilities */
  const capSearch = $('#cap-search');

  function paintCapabilities() {
    $('#cap-grid').innerHTML = activeLens().competencies.map((g) => `
      <section class="cap-group">
        <h3>${esc(g.group)}</h3>
        <p>${g.items.map((s) =>
          `<span class="sk" data-skill="${esc(s.toLowerCase())}">${esc(s)}</span>`
        ).join('<span class="sep"> · </span>')}</p>
      </section>`).join('');
    filterCaps();
  }

  function filterCaps() {
    const q = capSearch.value.trim().toLowerCase();
    $$('#cap-grid .cap-group').forEach((group) => {
      const items = $$('.sk', group);
      const seps = $$('.sep', group);
      let shownIdx = [];
      items.forEach((sk, i) => {
        const hit = !q || sk.dataset.skill.includes(q);
        sk.classList.toggle('is-hidden', !hit);
        sk.classList.toggle('is-hit', Boolean(q) && hit);
        if (hit) shownIdx.push(i);
      });
      /* A separator survives only between two visible items. */
      seps.forEach((sep, i) => {
        const keep = shownIdx.includes(i) && shownIdx.some((n) => n > i);
        sep.classList.toggle('is-hidden', !keep);
      });
      group.classList.toggle('is-empty', shownIdx.length === 0);
    });
    const total = $$('#cap-grid .sk').length;
    const shown = $$('#cap-grid .sk:not(.is-hidden)').length;
    $('#cap-count').textContent = q
      ? `${shown} of ${total} match on this edition`
      : `${total} on this edition · ${COUNT.skills} across all ${spell(COUNT.tracks)} tracks`;
  }
  capSearch.addEventListener('input', filterCaps);

  /* ---------------------------------------------------------- case studies */
  $('#proj-list').innerHTML = PROJECTS.map((pr, i) => `
    <article class="case">
      <div class="case__head">
        <span class="case__no">Case ${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(pr.name)}</h3>
        <span class="case__status">${esc(pr.status)}</span>
        <span class="case__ctx">${esc(pr.context)}</span>
      </div>
      <p class="case__lead">${esc(pr.lead)}</p>
      <dl class="story">
        ${pr.facets.map((f) => `<div><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('')}
      </dl>
      <p class="case__stack">${esc(pr.stack.join('  ·  '))}</p>
    </article>`).join('');

  /* ----------------------------------------------------------- credentials */
  const KIND = { cert: 'Certification', clearance: 'Clearance', education: 'Education' };
  $('#cred-grid').innerHTML = CREDENTIALS.map((c) => `
    <div>
      <dt><span class="kind">${esc(KIND[c.kind])}</span>${esc(c.name)}</dt>
      <dd>${esc(c.meta)}</dd>
    </div>`).join('');

  $('#profile-list').innerHTML = CLASSIFIED_PROFILE.map((r) =>
    `<div><dt>${esc(r.k)}</dt><dd>${esc(r.v)}</dd></div>`).join('');

  $('#publications').innerHTML = PUBLICATIONS.map((p) => `<li>${esc(p)}</li>`).join('');
  $('#affiliations').textContent = AFFILIATIONS.join(' · ');

  /* ------------------------------------------------------------ the resume */
  /* One recommended file, sized to the selected profile; every other edition
     stays one click away in the table underneath. */
  function paintResume() {
    const L = activeLens();
    const ed = activeEdition();
    $('#res-pick').innerHTML = `
      <div>
        <span class="pick__stamp">Recommended for this profile</span>
        <h3 class="pick__title">${esc(L.title)}</h3>
        <p class="pick__tag">${esc(SECTORS[state.sector].label)} edition · ${esc(ed.tagline)}</p>
        <p class="pick__sum">${esc(ed.summary.split('. ')[0])}.</p>
      </div>
      <div class="pick__side">
        <a class="btn btn--solid" href="${href(ed.file)}" ${linkAttrs(ed.file)}>Download ${esc(fileKind(ed.file))}</a>
        <span class="pick__file">${esc(ed.file)}</span>
      </div>`;

    $('#res-rows').innerHTML = LENSES.map((l) => {
      const cell = (sector) => {
        const e = l.editions[sector];
        if (!e) return '<td>—</td>';
        const on = l.id === state.lens && sector === state.sector;
        return `<td><a class="${on ? 'is-active' : ''}" href="${href(e.file)}" ${linkAttrs(e.file)}>Download ${esc(fileKind(e.file))}</a>${on ? '<span class="now">Selected</span>' : ''}</td>`;
      };
      return `<tr class="${l.id === state.lens ? 'is-active' : ''}">
        <th scope="row" style="--lens-mark:${esc(l.accent)}"><span></span>${esc(l.title)}</th>
        ${cell('gov')}${cell('private')}
      </tr>`;
    }).join('');
  }

  $('#res-master').innerHTML =
    `<a href="${href(MASTER.file)}" ${linkAttrs(MASTER.file)}>${esc(MASTER.badge)} — ${esc(fileKind(MASTER.file))}</a>. ${esc(MASTER.note)}`;

  /* ---------------------------------------------------------- architecture */
  $('#story-a').innerHTML = ARCH_STORY.before.map((r) =>
    `<div><dt>${esc(r.k)}</dt><dd>${esc(r.v)}</dd></div>`).join('');
  $('#story-b').innerHTML = ARCH_STORY.after.map((r) =>
    `<div><dt>${esc(r.k)}</dt><dd>${esc(r.v)}</dd></div>`).join('');

  const archNodes = $$('#arch-svg .n-hit');
  function selectNode(key) {
    const data = ARCH_NODES[key];
    if (!data) return;
    archNodes.forEach((n) => {
      const on = n.dataset.node === key;
      n.classList.toggle('is-active', on);
      n.setAttribute('aria-pressed', String(on));
    });
    $('#arch-side').textContent = data.side;
    $('#arch-name').textContent = data.name;
    $('#arch-body').textContent = data.body;
  }
  archNodes.forEach((n) => {
    n.addEventListener('click', () => selectNode(n.dataset.node));
    n.addEventListener('focus', () => selectNode(n.dataset.node));
    n.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.dataset.node); }
    });
  });
  selectNode('diode');

  /* -------------------------------------------------- section highlighting */
  const navLinks = $$('.mast__nav a');
  if ('IntersectionObserver' in window) {
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
  }

  /* ------------------------------------------------------- search palette */
  /* A keyboard convenience, not a feature of the page. Everything reachable
     here is reachable by scrolling and clicking as well. */
  const pal = $('#palette');
  const palInput = $('#pal-input');
  const palList = $('#pal-list');
  let palItems = [];
  let palIdx = 0;
  let palReturn = null;

  const grab = (file) => () => {
    const url = href(file);
    if (OFF_SITE) { window.open(url, '_blank', 'noopener'); return; }
    const a = document.createElement('a');
    a.href = url; a.download = file;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const ALL_COMMANDS = (function () {
    const list = [
      { label: 'Brief', group: 'Go to', run: () => { location.hash = '#focus'; } },
      { label: 'Architecture case study', group: 'Go to', run: () => { location.hash = '#architecture'; } },
      { label: 'Case studies', group: 'Go to', run: () => { location.hash = '#projects'; } },
      { label: 'Career', group: 'Go to', run: () => { location.hash = '#experience'; } },
      { label: 'Capabilities', group: 'Go to', run: () => { location.hash = '#capabilities'; } },
      { label: 'Credentials', group: 'Go to', run: () => { location.hash = '#credentials'; } },
      { label: 'Resume downloads', group: 'Go to', run: () => { location.hash = '#resume'; } },
      { label: 'Contact', group: 'Go to', run: () => { location.hash = '#contact'; } }
    ];
    LENSES.forEach((l) => list.push({ label: `View profile as ${l.label}`, group: 'Profile', run: () => setLens(l.id) }));
    list.push({ label: 'Hiring for the cleared / government sector', group: 'Profile', run: () => setSector('gov') });
    list.push({ label: 'Hiring for the private sector', group: 'Profile', run: () => setSector('private') });
    list.push({ label: 'Complete resume — every project, nothing trimmed', group: 'Download', run: grab(MASTER.file) });
    EDITION_LIST.forEach(({ lens, sector, ed }) => list.push({
      label: `${lens.title} — ${SECTORS[sector].short}`,
      group: 'Download',
      run: grab(ed.file)
    }));
    list.push({ label: 'Switch color theme', group: 'Action', run: () => $('#theme-toggle').click() });
    list.push({ label: 'Email William', group: 'Action', run: () => { location.href = 'mailto:' + PROFILE.email; } });
    return list;
  })();

  function renderPal() {
    const q = palInput.value.trim().toLowerCase();
    palItems = ALL_COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
    palIdx = 0;
    palList.innerHTML = palItems.length
      ? palItems.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === 0}">${esc(c.label)}<span class="g">${esc(c.group)}</span></li>`).join('')
      : '<li role="option" aria-selected="false">No match</li>';
  }
  function movePal(delta) {
    if (!palItems.length) return;
    palIdx = (palIdx + delta + palItems.length) % palItems.length;
    $$('#pal-list li').forEach((li, i) => li.setAttribute('aria-selected', String(i === palIdx)));
    const sel = palList.children[palIdx];
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  function openPal() {
    palReturn = document.activeElement;
    pal.setAttribute('open', '');
    palInput.value = '';
    renderPal();
    palInput.focus();
  }
  function closePal() {
    pal.removeAttribute('open');
    if (palReturn && palReturn.focus) palReturn.focus();
    palReturn = null;
  }
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
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPal(); return; }
    if (!pal.hasAttribute('open')) return;
    if (e.key === 'Escape') closePal();
    else if (e.key === 'ArrowDown') { e.preventDefault(); movePal(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); movePal(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(); }
    else if (e.key === 'Tab') { e.preventDefault(); palInput.focus(); }
  });

  /* ------------------------------------------------------------ deep links */
  const params = new URLSearchParams(location.search);
  if (params.get('lens') && lensById[params.get('lens')]) state.lens = params.get('lens');
  if (params.get('for') && SECTORS[params.get('for')]) state.sector = params.get('for');
  if (!editionsOf(state.lens).includes(state.sector)) state.sector = editionsOf(state.lens)[0];

  render({ silent: true });
})();
