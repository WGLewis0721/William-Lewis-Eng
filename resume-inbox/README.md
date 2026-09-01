# Resume inbox

Drop new or revised resume files here — `.pdf` or `.docx`. This is a staging
area: nothing in this folder is served by the website. Once the content has been
pulled across into the site, the file is promoted into `assets/resume/` and
removed from here.

## Uploading from the browser

On github.com, open this folder → **Add file** → **Upload files** → drag the
files in → **Commit changes**. No local checkout needed.

## What to name them

Anything readable is fine — the promoted copy gets renamed. What matters is that
the file makes clear **which role track** it is for and **whether it is the
cleared/government or private-sector edition**, since that is what decides where
it lands on the site:

| Track | Lens id | Promoted filename (private / cleared) |
| --- | --- | --- |
| Principal Cloud & Platform Engineer | `platform` | `William-G-Lewis_Principal-Cloud-Platform-Engineer.pdf` / `…_Cleared.pdf` |
| Cloud & DevSecOps Architect | `devsecops` | `William-G-Lewis_Cloud-DevSecOps-Architect.pdf` / `…_Cleared.pdf` |
| Cloud SRE & Platform Reliability Engineer | `sre` | `William-G-Lewis_Cloud-SRE-Platform-Reliability.pdf` / `…_Cleared.pdf` |
| AI Infrastructure & LLMOps Engineer | `ai` | `William-G-Lewis_AI-Infrastructure-LLMOps-Engineer.pdf` / `…_Cleared.pdf` |
| Cloud Security & Zero Trust Architect | `zerotrust` | `William-G-Lewis_Cloud-Security-Zero-Trust-Architect.pdf` / `…_Cleared.pdf` |

A resume for a **new** role track is fine too — say so, and it becomes a sixth
lens rather than replacing one of the five.

## Reading what is in here

```sh
python3 tools/read_resumes.py
```

Prints the plain text of every `.pdf` and `.docx` in this folder, so the wording
can be diffed against what the site currently says. Reading PDFs needs `pypdf`
(`python3 -m pip install pypdf`).

## Updating the site from these files

The site reads none of its content from the resume files at runtime — they are
download artifacts only. Everything a visitor reads is transcribed into
`assets/js/data.js`. So a resume revision is a two-part change:

1. **Promote the file.** Move it to `assets/resume/` under the name in the table
   above, replacing the old version.
2. **Update `assets/js/data.js`.** Whatever changed in the document has to be
   edited into the matching structure there, or the page will keep showing the
   old wording next to the new download.

Where each part of a resume lands in `data.js`:

| Resume section | Goes to |
| --- | --- |
| Role line under the name | `LENSES[].title` (before the first `\|`) and `editions[].tagline` (the rest) |
| Professional summary | `editions[].summary` |
| Core technical competencies | `LENSES[].competencies` — keep the resume's own group names |
| Selected impact / projects | `LENSES[].impact` |
| Professional experience | `EXPERIENCE` (shared), with the per-track reading order in `LENSES[].bulletOrder` |
| Certifications, education | `CREDENTIALS` |
| Documentation & publications | `PUBLICATIONS` |
| Affiliations | `AFFILIATIONS` |

Remember the lens/edition split: competencies, impact, title and bullet ordering
are **the same** in a track's two editions — only the tagline, summary and file
differ. If a revision changes that assumption, the data model needs changing too.

Check afterwards that:

- every bullet on the page still traces to a line in one of the documents;
- `bulletOrder` is still a permutation of each job's bullet indices — every index
  exactly once, or bullets will silently vanish or duplicate;
- the file named in each `editions[].file` actually exists in `assets/resume/`;
- the page still renders with no console errors on all ten editions.

`../README.md` has the full map of which export drives which part of the page,
and `../copilot-instructions.md` has the same rules written for an AI assistant.
