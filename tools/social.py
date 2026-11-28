#!/usr/bin/env python3
"""Insert the BSM social icon row into every page footer.

Edit SOCIAL below, then run: python3 tools/social.py
The row sits between <!-- bespoke:social --> markers, so re-running replaces it.
Use --demo to render placeholder links for review; a live run refuses
until every URL is filled in.
"""
import pathlib, re, sys

SOCIAL = {  # order = display order
    "linkedin":  "https://www.linkedin.com/company/bespokeasia/",   # e.g. https://www.linkedin.com/company/<slug>
    "x":         "https://x.com/bsm_rev_infra",   # e.g. https://x.com/<handle>
    "facebook":  "https://www.facebook.com/bespokemarketing.asia",   # Meta / Facebook page URL
    "instagram": "https://www.instagram.com/bespokemarketing.asia/",   # e.g. https://www.instagram.com/<handle>
}

LABEL = {"linkedin": "LinkedIn", "x": "X", "facebook": "Facebook", "instagram": "Instagram"}
ICON = {
    "linkedin": '<path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.07-1.64-4.5-3.83-4.5a3.3 3.3 0 0 0-3 1.65V8.5h-3.37V20h3.37v-5.7c0-1.5.28-2.95 2.14-2.95 1.83 0 1.86 1.71 1.86 3.05V20h3.37v-6.6Z"/>',
    "x": '<path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z"/>',
    "facebook": '<path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46a21 21 0 0 0-2.3-.16c-2.3 0-3.8 1.4-3.8 3.97v2.23H8v3h2.5V21h3Z"/>',
    "instagram": '<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1"/>',
}
ANCHOR = "Est. 2022 · Ho Chi Minh City · Singapore</p>"
BLOCK = re.compile(r"\n?<!-- bespoke:social -->.*?<!-- /bespoke:social -->", re.S)

def row(demo):
    items = []
    for k, url in SOCIAL.items():
        href = url or f"#{k}"
        items.append(
            f'<a href="{href}" target="_blank" rel="noopener me" aria-label="Bespoke Marketing on {LABEL[k]} (opens in a new tab)">'
            f'<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">{ICON[k]}</svg></a>')
    return ('\n<!-- bespoke:social --><nav class="soc" aria-label="Bespoke Marketing on social media">'
            + "".join(items) + "</nav><!-- /bespoke:social -->")

def main():
    demo = "--demo" in sys.argv
    missing = [k for k, v in SOCIAL.items() if not v]
    if missing and not demo:
        sys.exit("Fill in SOCIAL for: " + ", ".join(missing) + " (or run with --demo)")
    root = pathlib.Path(__file__).resolve().parent.parent
    n = 0
    for p in root.rglob("*.html"):
        s = p.read_text(encoding="utf-8")
        if "bespoke:redirect-stub" in s or ANCHOR not in s:
            continue
        s = BLOCK.sub("", s).replace(ANCHOR, ANCHOR + row(demo), 1)
        p.write_text(s, encoding="utf-8"); n += 1
    print(f"Social row written to {n} pages" + (" (demo placeholders)" if missing else ""))

if __name__ == "__main__":
    main()
