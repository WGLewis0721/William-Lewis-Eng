#!/usr/bin/env python3
"""Inline the stylesheet and scripts into a single portable HTML file.

The site itself is served straight from the repo root, so this build step is
only needed when the page has to travel as one file (a hosted preview, an
email attachment, an offline copy).

    python3 tools/build_standalone.py [output.html]
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "dist" / "william-lewis.html"

html = (ROOT / "index.html").read_text(encoding="utf-8")

css = (ROOT / "assets/css/site.css").read_text(encoding="utf-8")
html = html.replace(
    '<link rel="stylesheet" href="assets/css/site.css">',
    "<style>\n" + css + "\n</style>",
)

for src in ("assets/js/data.js", "assets/js/site.js"):
    js = (ROOT / src).read_text(encoding="utf-8")
    html = html.replace(f'<script src="{src}"></script>', "<script>\n" + js + "\n</script>")

# The favicon is a local file; inline it so the single-file build keeps its mark.
favicon = (ROOT / "assets/img/favicon.svg").read_text(encoding="utf-8")
data_uri = "data:image/svg+xml;utf8," + re.sub(r"\s+", " ", favicon).replace("#", "%23").replace('"', "'")
html = html.replace('href="assets/img/favicon.svg"', f'href="{data_uri}"')

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT} ({len(html):,} bytes)")
