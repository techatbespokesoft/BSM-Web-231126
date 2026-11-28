#!/usr/bin/env python3
"""Stamp local CSS/JS references with ?v=<stamp> so browsers fetch fresh files after a deploy.

Run before each commit that changes anything in /assets:  python3 tools/bump-assets.py
"""
import pathlib, re, time
root = pathlib.Path(__file__).resolve().parent.parent
stamp = time.strftime("%Y%m%d%H%M")
pat = re.compile(r'((?:href|src)="(?:\.\./|/)?assets/[^"?#]+\.(?:css|js))(?:\?v=[0-9]+)?"')
n = 0
for p in root.rglob("*.html"):
    s = p.read_text(encoding="utf-8")
    if "bespoke:redirect-stub" in s:
        continue
    s2 = pat.sub(lambda m: f'{m.group(1)}?v={stamp}"', s)
    if s2 != s:
        p.write_text(s2, encoding="utf-8"); n += 1
print(f"Asset version {stamp} stamped on {n} pages")
