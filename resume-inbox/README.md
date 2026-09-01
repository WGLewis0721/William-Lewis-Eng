# Resume inbox

Drop new or revised resume `.docx` files here. This is a staging area — nothing
in this folder is served by the website. Once the content has been pulled across
into the site, the file gets promoted into `assets/resume/` and removed from
here.

## Uploading from the browser

On github.com, open this folder → **Add file** → **Upload files** → drag the
`.docx` in → **Commit changes**. No local checkout needed.

## What to name them

Anything readable is fine — the promoted copy gets renamed, so don't fuss over
it. What matters is that the file makes clear **which role track** it is for and
**whether it is the cleared/government or private-sector version**, since that
is what decides where it lands on the site:

| If the resume is for… | It belongs to lens | Promoted filename |
| --- | --- | --- |
| Principal / lead cloud & platform, commercial | `platform` / private | `William-G-Lewis_Principal-Cloud-Platform-Engineer.docx` |
| Principal / lead cloud & platform, cleared | `platform` / gov | `William-G-Lewis_Principal-Cloud-Platform-Engineer_Cleared.docx` |
| Cloud & DevSecOps architect | `devsecops` / private | `William-G-Lewis_Cloud-DevSecOps-Architect.docx` |
| AI infrastructure & LLMOps | `ai` / private | `William-G-Lewis_AI-Infrastructure-LLMOps-Engineer.docx` |
| Cloud security & Zero Trust, cleared | `zerotrust` / gov | `William-G-Lewis_Cloud-Security-Zero-Trust-Architect_Cleared.docx` |
| The full-detail master resume | — | `William-G-Lewis_Complete-Resume.docx` |

A resume for a **new** role track is fine too — say so, and it becomes a fifth
lens rather than replacing one of the four.

## Reading what is in here

```sh
python3 tools/read_resumes.py
```

Prints the plain text of every `.docx` in this folder, so the wording can be
diffed against what the site currently says.

## Updating the site from these files

The site reads none of its content from the `.docx` files at runtime — they are
download artifacts only. Everything a visitor reads is transcribed into
`assets/js/data.js`. So a resume revision is a two-part change:

1. **Promote the file.** Move it to `assets/resume/` under the name in the table
   above, replacing the old version.
2. **Update `assets/js/data.js`.** Whatever changed in the document — summary,
   competencies, selected impact, experience bullets, certifications, projects,
   metrics — has to be edited into the matching structure there, or the page will
   keep showing the old wording next to the new download.

Check afterwards that:

- every bullet on the page still traces to a line in one of the documents;
- each edition still prints to a single page (open the site, hit
  **Print / PDF** on that edition);
- the capability matrix covers any newly mentioned tools, with the right lens
  ids in each skill's `l` array.

`../README.md` has the full map of which export in `data.js` drives which part
of the page.
