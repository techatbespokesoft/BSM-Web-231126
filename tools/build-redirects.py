#!/usr/bin/env python3
"""Generate static redirect stubs from _redirects.

_redirects is the single source of truth for legacy URLs. Cloudflare Pages and
Netlify read it natively. GitHub Pages does not, so this script writes a small
HTML stub at each legacy path that forwards to the new page (meta refresh,
canonical link and location.replace).

  /old-page.html  ->  old-page.html
  /old-page       ->  old-page/index.html   (serves /old-page and /old-page/)

Run from the repository root after editing _redirects:
  python3 tools/build-redirects.py
"""
from html import escape
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://bespokemarketing.asia"
MARKER = "<!-- bespoke:redirect-stub -->"

TEMPLATE = """<!DOCTYPE html>
{marker}
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="{canonical}">
  <meta http-equiv="refresh" content="0; url={target}">
  <script>window.location.replace({target_js});</script>
</head>
<body>
  <p>This page has moved to <a href="{target}">{canonical}</a>.</p>
</body>
</html>
"""


def stub_path(source: str) -> Path:
    rel = unquote(source).lstrip("/")
    if rel.endswith(".html"):
        return ROOT / rel
    return ROOT / rel / "index.html"


def main() -> None:
    rules = []
    for line in (ROOT / "_redirects").read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            source, target = line.split()[:2]
            rules.append((source, target))

    for source, target in rules:
        path = stub_path(source)
        if path.exists() and MARKER not in path.read_text(encoding="utf-8"):
            raise SystemExit(f"Refusing to overwrite real page: {path.relative_to(ROOT)}")
        path.parent.mkdir(parents=True, exist_ok=True)
        canonical = SITE + target.split("#")[0]
        path.write_text(
            TEMPLATE.format(
                marker=MARKER,
                canonical=escape(canonical),
                target=escape(target),
                target_js=repr(target).replace("'", '"'),
            ),
            encoding="utf-8",
        )
        print(f"{source} -> {target}")
    print(f"{len(rules)} redirect stubs written.")


if __name__ == "__main__":
    main()
