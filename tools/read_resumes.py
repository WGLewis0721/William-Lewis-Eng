#!/usr/bin/env python3
"""Print the plain text of every resume in a folder, ready to diff against the site.

Used when new resume versions land in resume-inbox/ and the content in
assets/js/data.js needs to catch up. Handles .pdf and .docx.

    python3 tools/read_resumes.py                  # reads resume-inbox/
    python3 tools/read_resumes.py assets/resume    # or any other folder

Reading .pdf needs pypdf:  python3 -m pip install pypdf
"""
import html
import pathlib
import re
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
folder = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "resume-inbox"

if not folder.is_dir():
    sys.exit(f"no such folder: {folder}")

files = sorted(p for p in folder.iterdir()
               if p.suffix.lower() in {".pdf", ".docx"} and not p.name.startswith("~$"))
if not files:
    sys.exit(f"no .pdf or .docx files in {folder}")


def tidy(text):
    lines = [ln.rstrip() for ln in text.split("\n")]
    return "\n".join(ln for ln in lines if ln.strip())


def from_docx(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    xml = xml.replace("</w:p>", "\n").replace("<w:tab/>", "\t").replace("<w:br/>", "\n")
    return tidy(html.unescape(re.sub(r"<[^>]+>", "", xml)))


def from_pdf(path):
    try:
        import pypdf
    except BaseException as exc:  # ImportError, or a broken native dependency
        # pyo3 panics (from a mismatched `cryptography` build) raise BaseException.
        sys.exit(f"could not load pypdf ({exc}).\n"
                 "Install it with: python3 -m pip install pypdf\n"
                 "If it is installed but fails to import, try a clean environment:\n"
                 "  python3 -m venv .venv && .venv/bin/pip install pypdf\n"
                 "  .venv/bin/python tools/read_resumes.py")
    reader = pypdf.PdfReader(str(path))
    # Word's bullet glyph comes through as a private-use character.
    text = "\n".join(page.extract_text() for page in reader.pages)
    return tidy(text.replace("", "- "))


for path in files:
    print("=" * 78)
    print(path.name)
    print("=" * 78)
    print(from_pdf(path) if path.suffix.lower() == ".pdf" else from_docx(path))
    print()
