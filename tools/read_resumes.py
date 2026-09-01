#!/usr/bin/env python3
"""Print the plain text of every .docx in a folder, ready to diff against the site.

Used when new resume versions land in resume-inbox/ and the content in
assets/js/data.js needs to catch up.

    python3 tools/read_resumes.py                  # reads resume-inbox/
    python3 tools/read_resumes.py assets/resume    # or any other folder
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

files = sorted(p for p in folder.glob("*.docx") if not p.name.startswith("~$"))
if not files:
    sys.exit(f"no .docx files in {folder}")


def extract(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    xml = xml.replace("</w:p>", "\n")
    xml = xml.replace("<w:tab/>", "\t")
    xml = xml.replace("<w:br/>", "\n")
    text = html.unescape(re.sub(r"<[^>]+>", "", xml))
    lines = [ln.rstrip() for ln in text.split("\n")]
    return "\n".join(ln for ln in lines if ln.strip())


for path in files:
    print("=" * 78)
    print(path.name)
    print("=" * 78)
    print(extract(path))
    print()
