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
| Focus | Professional summary and the three selected-impact statements for that track |
| Architecture in practice | Interactive diagram of the IL6 platform |
| Signature work | The three AI infrastructure projects |
| Experience | Timeline from Leidos in 2018 through the current SAIC / Oteemo role |
| Capabilities | The selected edition's core technical competencies, grouped as its resume groups them, searchable |
| Credentials | Certifications, clearance, education, classified environment profile, publications, affiliations |
| Resume | All ten tailored PDFs plus the full-detail master resume |
| Contact | Email, phone, LinkedIn, GitHub |

## The role lens

The central idea. Ten resume editions — five role tracks, each written once for
cleared government hiring and once for the private sector — and the lens control
at the top of the page drives all of it: the hero, the professional summary,
selected impact, the capability list, the order of the experience bullets, the
page's accent color, and which resume the download button hands over.

| Lens | id | Cleared / Government | Private Sector |
| --- | --- | --- | --- |
| Cloud Platform | `platform` | ✅ | ✅ |
| DevSecOps | `devsecops` | ✅ | ✅ |
| SRE & Reliability | `sre` | ✅ | ✅ |
| AI Infrastructure | `ai` | ✅ | ✅ |
| Zero Trust Security | `zerotrust` | ✅ | ✅ |

**Deep links.** `?lens=zerotrust&for=gov` opens the page already framed for that
audience — useful when replying to a specific req. `for` accepts `gov` or
`private`.

### What belongs to a lens, and what belongs to an edition

This split is the thing to understand before editing `data.js`, and it comes
straight from how the resumes are written:

| Belongs to the **lens** (identical in both editions) | Belongs to the **edition** (differs by context) |
| --- | --- |
| Job title, competencies, selected impact, bullet ordering, accent | Tagline, professional summary, clearance line, resume file |

The career history itself — role, organisation, dates, stack, and the bullet text
— is identical in all ten editions. Only the *order* of the bullets changes, so
each lens carries a `bulletOrder` and the timeline leads with whichever bullet
that track's resume leads with.

## Resume documents

Ten tailored PDFs, plus the master resume in Word:

| Track | Private sector | Cleared / government |
| --- | --- | --- |
| Principal Cloud & Platform Engineer | `…_Principal-Cloud-Platform-Engineer.pdf` | `…_Principal-Cloud-Platform-Engineer_Cleared.pdf` |
| Cloud & DevSecOps Architect | `…_Cloud-DevSecOps-Architect.pdf` | `…_Cloud-DevSecOps-Architect_Cleared.pdf` |
| Cloud SRE & Platform Reliability Engineer | `…_Cloud-SRE-Platform-Reliability.pdf` | `…_Cloud-SRE-Platform-Reliability_Cleared.pdf` |
| AI Infrastructure & LLMOps Engineer | `…_AI-Infrastructure-LLMOps-Engineer.pdf` | `…_AI-Infrastructure-LLMOps-Engineer_Cleared.pdf` |
| Cloud Security & Zero Trust Architect | `…_Cloud-Security-Zero-Trust-Architect.pdf` | `…_Cloud-Security-Zero-Trust-Architect_Cleared.pdf` |

All files are prefixed `William-G-Lewis`. The master edition is
`William-G-Lewis_Complete-Resume.docx`.

## Other behaviour

**Architecture walkthrough.** A hand-authored SVG of the IL6 platform: how
infrastructure as code is validated on the connected network, staged as
immutable versioned objects, and pushed through a one-way data diode into the
air-gapped enclave — and why the retrieval index and the model that queries it
have to live inside it. Every component is clickable and keyboard-focusable.

**Capability search.** The matrix filters as you type, and reports both how many
competencies the selected edition lists and how many exist across all five tracks.

**Command palette.** <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> (or <kbd>/</kbd>)
to jump to a section, switch lens or context, download any resume, or flip the theme.

**Theme.** Follows the visitor's system setting, with a manual override in the
header that persists in `localStorage`.

## Repository layout

```
index.html                 markup + the hand-authored architecture SVG
assets/css/site.css        design tokens, layout, print stylesheet
assets/js/data.js          all content — every string comes from a resume edition
assets/js/site.js          lens state, rendering, diagram, palette
assets/resume/             the ten tailored PDFs and the master Word resume
assets/img/favicon.svg
.claude/skills/            project skills, loaded in every Claude Code surface
resume-inbox/              staging area for new resume versions — see its README
tools/read_resumes.py      dumps the text of every .pdf/.docx in a folder
tools/build_standalone.py  inlines CSS + JS into one portable HTML file
.nojekyll                  serve assets/ verbatim on GitHub Pages
```

## Editing content

Everything a visitor reads lives in `assets/js/data.js` — summaries, bullets,
metrics, projects, competencies, credentials, and the architecture annotations.
Nothing is hard-coded in the markup, so updating the site after a resume revision
means editing that one file.

| Export | Drives |
| --- | --- |
| `LENSES` | The five tracks: title, competencies, impact, `bulletOrder`, accent, and the two editions |
| `MASTER` | The complete-resume card |
| `EXPERIENCE` | The timeline — shared across all ten editions |
| `PROJECTS` | Signature work |
| `METRICS` | The counters under the hero |
| `CREDENTIALS`, `CLASSIFIED_PROFILE`, `PUBLICATIONS`, `AFFILIATIONS` | Credentials |
| `ARCH_NODES` | The text for each diagram component |

**When a resume is revised:** drop the new file into `resume-inbox/` — that
folder's README covers the rest. Note that the site never reads the resume files
at runtime; they are download artifacts, so replacing one without updating
`data.js` leaves the page showing the old wording.

**To add a role track:** add a lens to `LENSES` with a unique `id`, an `accent`
and `accentInk` pair (bright enough for the dark ground, deep enough for the
light one), and both editions. Nothing else needs to change — the control,
palette, resume grid, and deep links all read from that array.

## Design notes

- **Palette** — cool drafting-film neutrals carrying one accent at a time, set by
  the active lens: signal amber, teal, steel blue, violet, clay. Both themes are
  defined at token level, including the un-stamped system-default state.
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
