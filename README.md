# William G. Lewis — portfolio

A visual companion to my resume: one page that reframes itself around the role a
recruiter is actually hiring for, and hands them the matching resume file.

**Live pages:** enable GitHub Pages on this repository (Settings → Pages → deploy
from branch, root folder). No build step is required — the site is static.

## What it does

**Role lens.** I keep five tailored resume editions across four role tracks. The
lens control drives the whole page: the hero, the professional summary, core
competencies, selected impact, which capabilities are highlighted, and which
resume the download button hands over.

| Lens | Cleared / Government | Private Sector |
| --- | --- | --- |
| Cloud Platform | ✅ | ✅ |
| DevSecOps | — | ✅ |
| AI Infrastructure | — | ✅ |
| Zero Trust Security | ✅ | — |

Switching context also rewrites the experience section, because the government
and private-sector editions phrase the same roles differently.

**Deep links.** `?lens=zerotrust&for=gov` opens the page already framed for that
audience — useful when replying to a specific req.

**Architecture walkthrough.** An interactive diagram of the IL6 platform: how
infrastructure as code crosses a one-way data diode into an air-gapped enclave,
and why the retrieval index and the model that queries it have to live inside it.
Every component is focusable from the keyboard.

**Resume delivery.** Each edition offers the Word original and a `Print / PDF`
button. Printing renders a purpose-built, ATS-friendly one-page resume for the
selected edition — not a screenshot of the website.

**Command palette.** <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> (or <kbd>/</kbd>)
to jump to a section, switch lens, or grab a resume.

## Layout

```
index.html              markup + the hand-authored architecture SVG
assets/css/site.css     design tokens, layout, print stylesheet
assets/js/data.js       all content — every string comes from a resume edition
assets/js/site.js       lens state, rendering, diagram, palette, print builder
assets/resume/*.docx    the five resume editions
assets/img/favicon.svg
tools/build_artifact.py inlines CSS + JS into a single portable HTML file
```

## Editing content

Everything a visitor reads lives in `assets/js/data.js` — summaries, bullets,
metrics, capabilities, credentials, and the architecture annotations. Nothing is
hard-coded in the markup, so updating the site after a resume revision means
editing that one file.

To add a resume edition: drop the `.docx` into `assets/resume/`, then add an
entry under the relevant lens's `editions` in `data.js` with its `file` name.

## Design notes

- **Palette** — cool drafting-film neutrals carrying one accent at a time, set by
  the active lens: signal amber, teal, violet, clay. Light and dark themes are
  both defined at token level and follow the visitor's system setting, with a
  manual override in the header.
- **Type** — Archivo (variable width, set expanded) for display, IBM Plex Sans
  for body, IBM Plex Mono for labels and data.
- **Motion** — an ambient node field in the hero, scroll reveals, and counter
  animations, all disabled under `prefers-reduced-motion`.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Single-file build (for emailing or hosting the page on its own):

```sh
python3 tools/build_artifact.py dist/william-lewis.html
```
