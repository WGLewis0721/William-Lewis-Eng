# Project skills

Skills committed here load in **any** Claude Code session that opens this
repository — the desktop app, the VS Code extension, claude.ai/code on the web,
and iOS. That is the only mechanism that reaches all of those surfaces, because
skills installed on one machine (`~/.claude/skills`) or via a local `/plugin`
install do not travel with you.

## What is here

| Skill | Why it is vendored |
| --- | --- |
| `frontend-design` | Visual direction for UI work — palette, typography, avoiding templated defaults. Exists in the claude.ai skill set but is **not** registered as a Claude Code skill, so it is unavailable unless committed here. |
| `brand-guidelines` | Keeping the personal brand consistent across the site and documents. |
| `theme-factory` | Building and adjusting colour themes; this site is fully token-driven in light and dark. |
| `algorithmic-art` | Generative visuals — the hero canvas is a hand-written particle field. |

All four are Apache-2.0. Their `LICENSE.txt` files are kept alongside them, as
that licence requires.

## What is deliberately *not* here

**Anthropic's proprietary skills** — `docx`, `pdf`, `pptx`, `xlsx`,
`file-reading`, `pdf-reading`, `chrome-browser`. Their licence reads "© Anthropic,
PBC. All rights reserved… governed by your agreement with Anthropic", which does
not grant redistribution. This repository is public, so copying them here would
be republishing them. They also do not need to be here: they sync automatically
from your Anthropic account into every surface, including cloud sessions.

**Skills with no licence file** — `import-memory`, `morning`, `pages`,
`deep-research`, `doc-coauthoring`, `setup-writing-style`. No explicit grant, so
they are treated as not redistributable.

**`canvas-design`** — Apache-2.0 and safe to vendor, but 5.4 MB across 83 files,
and the `design` skill already covers the same ground in Claude Code.

## Adding another skill

```sh
mkdir -p .claude/skills/<name>
# copy SKILL.md, LICENSE.txt, and any scripts/ or references/ the skill needs
```

`SKILL.md` needs YAML frontmatter with `name` and `description` or Claude Code
will not register it. Check the licence before committing anything: Apache-2.0
and similar permissive licences are fine, proprietary ones are not.

Restart the session (or reopen the repo) for a newly added skill to appear.

## Making a skill available in *every* project

This folder only covers this repository. For a skill you want everywhere,
regardless of which repo is open, enable it on your Anthropic account —
claude.ai → Settings → Capabilities → Skills. Account skills sync down to the
desktop app, VS Code, web, and iOS on their own; that is how `docx`, `pdf`,
`pptx`, `xlsx`, `skill-creator`, `web-artifacts-builder`, `import-memory` and
`morning` are already present here.
