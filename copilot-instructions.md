# Working on this repository

Instructions for AI coding assistants (GitHub Copilot, Codex, and similar) making
changes to this site.

## What this is

A static portfolio site for William G. Lewis — one page that reframes itself
around the role a recruiter is hiring for and hands them the matching resume.
Plain HTML, CSS, and vanilla JavaScript, served straight from the repository root
by GitHub Pages.

There is **no build step, no framework, no package manager, and no test suite.**
Do not add one. Do not introduce React, Tailwind, a bundler, TypeScript, or a
`package.json` — the whole point is that what is committed is what is served.

## The four files that matter

| File | What goes in it |
| --- | --- |
| `assets/js/data.js` | Every word a visitor reads. Almost all content edits belong here alone. |
| `assets/js/site.js` | State and rendering. Only touch for behaviour changes. |
| `assets/css/site.css` | Design tokens and layout. |
| `index.html` | Structure and the hand-authored architecture SVG. |

If a request is "update the wording / add a skill / fix a date", the answer is
almost always a `data.js` edit and nothing else.

## The content model

Ten resume editions: five role tracks (`platform`, `devsecops`, `sre`, `ai`,
`zerotrust`), each with a `gov` and a `private` edition. The split matters:

- **Lens-level** (identical in both editions of a track): `title`,
  `competencies`, `impact`, `bulletOrder`, `accent`, `accentInk`, `blurb`.
- **Edition-level** (differs by hiring context): `tagline`, `summary`, `file`.

`EXPERIENCE` is shared by all ten editions — same roles, dates, stack and bullet
text. Only the *order* changes, which each lens supplies via `bulletOrder`.

## Rules

**The resume files are download artifacts.** Nothing on the page is read from the
PDFs at runtime. Replacing a file in `assets/resume/` without updating the
matching text in `data.js` leaves the page showing old wording next to a new
download. Always do both.

**Never invent biographical content.** Every claim on this page traces to a line
in one of the resumes in `assets/resume/`. Do not add skills, employers, dates,
metrics, or certifications that are not in those documents, and do not
"improve" a metric. If asked for content that is not in a resume, say so and ask
for the source. `python3 tools/read_resumes.py assets/resume` prints their text.

**`bulletOrder` must stay a permutation.** Each `bulletOrder[jobId]` array holds
every index of that job's `bullets` array exactly once. Add a bullet to
`EXPERIENCE` and you must add its new index to all five lenses' orders, or
bullets will silently disappear from the timeline.

**Both themes, always.** Colors are CSS custom properties defined at token level
in three places: bare `:root` (light), `@media (prefers-color-scheme: dark)`
guarded with `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`.
Never write a literal color inside a component rule, and never define a color
only inside a media or `[data-theme]` block — the un-stamped system-default state
would miss it. Use the existing tokens (`--ink`, `--ink-2`, `--ink-dim`,
`--panel`, `--rule`, `--a`, `--a-mark`, `--a-rgb`).

**Accents come from the lens.** Page accent is set at runtime from the active
lens's `accent` / `accentInk`. Do not hard-code an accent anywhere.

**Escape interpolated content.** Everything rendered through template literals in
`site.js` goes through `esc()`. Keep it that way.

**Respect `prefers-reduced-motion`.** Any animation must be disabled under it, as
the existing ones are.

**No horizontal page scroll.** Wide content (the architecture diagram) scrolls
inside its own `overflow-x: auto` container, never the body.

## Common tasks

**Change wording** — edit `data.js`, nothing else.

**Add a competency** — add the string to the right `group` in that lens's
`competencies`. Only add it to a track whose resume actually lists it.

**Add a role track** — append to `LENSES` with a unique `id`, a bright/deep
accent pair, both editions, a full `competencies` and `impact` set, and a
`bulletOrder` covering every job. The lens control, command palette, resume grid,
and deep links all read from that array, so nothing else needs editing.

**Add a resume file** — put it in `assets/resume/` and point the matching
`editions[].file` at it. Filenames are
`William-G-Lewis_<Role-In-Kebab-Case>[_Cleared].<ext>`.

## Checking your work

There are no tests. Verify by hand:

```sh
node --check assets/js/data.js && node --check assets/js/site.js
python3 -m http.server 8000    # then open http://localhost:8000
```

Then confirm in the browser:

- the console is clean;
- every one of the ten editions renders (step through both context buttons for
  all five lenses);
- the download button points at a file that exists;
- the page holds up in both light and dark themes, and at a phone width.

## Conventions

- Two-space indent in JS and CSS; four in Python.
- Single quotes in JS, double in Python.
- British-or-American spelling: use **American** (`color`, `emphasized`), matching
  the resumes.
- Prefer editing data over adding code. Prefer adding a token over a literal.
- Commit messages: imperative subject, a blank line, then why the change was
  needed rather than a restatement of the diff.
