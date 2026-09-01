# William G. Lewis — portfolio

A visual companion to my resume: one page that reframes itself around the role a
recruiter is actually hiring for, and hands them the matching resume file.

Static HTML, CSS, and vanilla JavaScript. No framework, no build step, and no
dependency beyond the Google Fonts stylesheet.

## Deploying

GitHub Pages, from `main`, root folder (Settings → Pages → deploy from branch).
`.nojekyll` is committed so the `assets/` tree is served untouched. Nothing needs
to be compiled first — what is in the repository is what gets served.

## What a visitor sees

| Section | What it is |
| --- | --- |
| Hero | Name, current role framing, contact details, and the resume for the selected lens |
| Focus | Professional summary, core competencies, and selected impact — all lens-driven |
| Architecture in practice | Interactive diagram of the IL6 platform |
| Signature work | The three AI infrastructure projects |
| Experience | Timeline from Leidos in 2018 through the current SAIC / Oteemo role |
| Capabilities | Searchable matrix of every tool and control, grouped into eight domains |
| Credentials | Certifications, clearance, education, and the classified environment profile |
| Resume | The complete resume plus all five tailored editions |
| Contact | Email, phone, LinkedIn, GitHub |

## The role lens

The central idea. Alongside the complete resume I keep five editions tailored to
four role tracks, and the lens control at the top of the page drives all of it:
the hero, the professional summary, core competencies, selected impact, which
capabilities are highlighted, the page's accent color, and which resume the
download button hands over.

| Lens | Cleared / Government | Private Sector |
| --- | --- | --- |
| Cloud Platform | ✅ | ✅ |
| DevSecOps | — | ✅ |
| AI Infrastructure | — | ✅ |
| Zero Trust Security | ✅ | — |

Switching context also rewrites the experience section, because the government
and private-sector editions phrase the same roles differently — program context
and impact levels on one side, commercial framing on the other. Where a lens has
only one edition the unavailable context is disabled rather than hidden, and the
page says why.

The complete resume sits above the tailored grid and is always available,
whichever lens is selected.

**Deep links.** `?lens=zerotrust&for=gov` opens the page already framed for that
audience — useful when replying to a specific req. `lens` accepts `platform`,
`devsecops`, `ai`, or `zerotrust`; `for` accepts `gov` or `private`, and falls
back to whichever edition that lens actually has.

## Resume documents

| File | Lens | Context |
| --- | --- | --- |
| `William-G-Lewis_Complete-Resume.docx` | — | Master edition, full detail |
| `William-G-Lewis_Principal-Cloud-Platform-Engineer.docx` | Cloud Platform | Private sector |
| `William-G-Lewis_Principal-Cloud-Platform-Engineer_Cleared.docx` | Cloud Platform | Cleared / government |
| `William-G-Lewis_Cloud-DevSecOps-Architect.docx` | DevSecOps | Private sector |
| `William-G-Lewis_AI-Infrastructure-LLMOps-Engineer.docx` | AI Infrastructure | Private sector |
| `William-G-Lewis_Cloud-Security-Zero-Trust-Architect_Cleared.docx` | Zero Trust Security | Cleared / government |

Each tailored edition offers the Word original and a `Print / PDF` button.
Printing renders a purpose-built, ATS-friendly one-page resume for that edition
straight from the browser — not a screenshot of the website. All five fit on a
single Letter page.

## Other behaviour

**Architecture walkthrough.** A hand-authored SVG of the IL6 platform: how
infrastructure as code is validated on the connected network, staged as
immutable versioned objects, and pushed through a one-way data diode into the
air-gapped enclave — and why the retrieval index and the model that queries it
have to live inside it. Every component is clickable and keyboard-focusable.

**Capability search.** The matrix filters as you type, and reports how many
entries the current lens leans on.

**Command palette.** <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> (or <kbd>/</kbd>)
to jump to a section, switch lens, download any resume, print, or flip the theme.

**Theme.** Follows the visitor's system setting, with a manual override in the
header that persists in `localStorage`.

## Repository layout

```
index.html                 markup + the hand-authored architecture SVG
assets/css/site.css        design tokens, layout, print stylesheet
assets/js/data.js          all content — every string comes from a resume edition
assets/js/site.js          lens state, rendering, diagram, palette, print builder
assets/resume/*.docx       the complete resume plus five tailored editions
assets/img/favicon.svg
tools/build_standalone.py  inlines CSS + JS into one portable HTML file
.nojekyll                  serve assets/ verbatim on GitHub Pages
```

## Editing content

Everything a visitor reads lives in `assets/js/data.js` — summaries, bullets,
metrics, projects, capabilities, credentials, and the architecture annotations.
Nothing is hard-coded in the markup, so updating the site after a resume revision
means editing that one file.

The exports at the bottom of `data.js` map to the sections above:

| Export | Drives |
| --- | --- |
| `LENSES` | The four role tracks and their editions |
| `MASTER` | The complete resume card |
| `EXPERIENCE` | The timeline, with per-context wording |
| `PROJECTS` | Signature work |
| `SKILL_DOMAINS` | The capability matrix and its per-lens emphasis |
| `METRICS` | The counters under the hero |
| `CREDENTIALS`, `CLASSIFIED_PROFILE`, `AFFILIATIONS` | Credentials |
| `ARCH_NODES` | The text for each diagram component |

**To add a resume edition:** drop the `.docx` into `assets/resume/`, then add an
entry under the relevant lens's `editions` in `data.js` with its `file` name.

**To mark a skill as emphasised by a lens:** add that lens's id to the skill's
`l` array in `SKILL_DOMAINS`.

## Design notes

- **Palette** — cool drafting-film neutrals carrying one accent at a time, set by
  the active lens: signal amber, teal, violet, clay. Both themes are defined at
  token level, including the un-stamped system-default state.
- **Type** — Archivo (variable width, set expanded) for display, IBM Plex Sans
  for body, IBM Plex Mono for labels and data.
- **Motion** — an ambient node field in the hero, scroll reveals, and counter
  animations, all disabled under `prefers-reduced-motion`. The canvas also stops
  when the tab is hidden.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Single-file build, for emailing the page or hosting it on its own:

```sh
python3 tools/build_standalone.py dist/william-lewis.html
```

A copy that travels away from the repository leaves `assets/resume/` behind, so
point it at wherever the files are reachable. The page then opens them in a new
tab instead of using a download link, which only works same-origin:

```sh
python3 tools/build_standalone.py dist/william-lewis.html \
  --resume-base https://raw.githubusercontent.com/WGLewis0721/William-Lewis-Eng/refs/heads/main/assets/resume/
```
