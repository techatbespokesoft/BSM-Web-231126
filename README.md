# Bespoke Marketing website

Static website for **bespokemarketing.asia**. Positioning: *Revenue Infrastructure for Asia's Market Leaders*.

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

## Structure

```
/                       Top-level pages (index, architecture, intelligence, systems, demand,
                        method, go-to-market, benchmarks, engine, work, insights, about,
                        contact, privacy, 404)
/work/                  10 case studies
/insights/              18 articles
/assets/
  fx.css, fx.js         Navigation, menu, page transitions, scroll effects, cookie consent
  viz.css, viz.js       Animated canvas charts (models) used across pages
  calc.js               Media benchmarks calculator (benchmarks.html)
  ex.css, ex.js         Article charts and calculators (figure.xb, div.xt)
  briefings.css/.js     "Strategic Briefings" email capture (home, Work, Method, case studies,
                        Insight articles). Posts to FormSubmit -> partners@bespokemarketing.asia
  thumbs/               Article and case-study covers (SVG, 1200x630)
  logos/                Client and partner logos (index.json controls what loads)
  brand/, svg/          Brand marks and icons
_redirects              Legacy URL map (single source of truth for redirects)
tools/build-redirects.py Generates redirect stubs from _redirects (needed on GitHub Pages)
_headers                Security and cache headers (Cloudflare Pages)
sitemap.xml, robots.txt SEO
docs/DEV-NOTES.md       Version notes and implementation details
```

## Run locally

```
python3 -m http.server 8080
```

Open http://localhost:8080.

## Legacy URLs and redirects

All legacy URLs live in `_redirects`. Cloudflare Pages and Netlify apply it as real 301s.
GitHub Pages ignores it, so each entry also has a small generated stub at the legacy path
(for example `ve-bsm/index.html`, `my-kingdom.html`) that forwards to the new page.

To add or change a redirect: edit `_redirects`, then run `python3 tools/build-redirects.py`
and commit the result. Do not edit stub files by hand.

## Deploy on Cloudflare Pages

1. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git, choose this repository.
2. Framework preset: **None**. Build command: *(empty)*. Build output directory: **/**.
3. Deploy. `_redirects` and `_headers` are applied automatically.
4. Custom domains: add `bespokemarketing.asia` and `www.bespokemarketing.asia`, then point DNS at Cloudflare.

Other static hosting works too (upload the repository root as the web root). On non-Cloudflare hosts, port `_redirects` to the host's redirect format.

## Configuration before go-live

| Item | Where |
|---|---|
| Google Calendar booking links (30, 45, 60 min) | `contact.html`, object `BSM_BOOKING` |
| Contact form endpoint | `contact.html` form `action` |
| GA4, Meta pixel, Google Ads tags | Load only after consent: listen for the `bsp:consent` event (see `assets/fx.js`) |
| Exchange rate for benchmarks | `assets/calc.js`, `FX` (VND per USD) |
| Zalo OA link | `https://zalo.me/2722835767291363986` (all pages) |

## QC checklist

- [ ] All pages load with no console errors (desktop and mobile).
- [ ] No horizontal scroll at 375px, 390px, 768px, 1440px.
- [ ] Navigation, mobile menu, "Book a meeting" and Zalo buttons work.
- [ ] Booking links open the correct Google Calendar schedules.
- [ ] Old URLs in `_redirects` return 301 to the new pages.
- [ ] Cookie banner: Accept / Reject / Settings; no tracking before consent.
- [ ] Lighthouse: Performance and Accessibility 90+ on Home.
- [ ] Client names and figures approved for publication (see open items in docs/DEV-NOTES.md).

## Content rules

English (British) only. No em dashes. Do not publish client names or results without written consent.

## Cache busting

After changing anything in `/assets`, run `python3 tools/bump-assets.py` before committing. It stamps CSS/JS links with `?v=<timestamp>` so visitors get the new files straight after deploy instead of a cached copy.
