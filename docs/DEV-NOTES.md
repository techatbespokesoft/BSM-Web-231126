# START HERE (final handoff, v9)
This folder is the complete website. It is static HTML/CSS/JS: no build step, no framework, no server code.

**Deploy:** upload this folder as-is to Cloudflare Pages (Direct Upload, or connect a Git repo with build command empty and output directory `/`). Then point `bespokemarketing.asia` at the Pages project.

**Before go-live (5 items):**
1. `assets/logos/`: 8 client logos are in place as PNGs cropped from a slide (low resolution). Replace them with official SVG files under the same names when available, and add `central-group`, `highlands`, `phu-tho-tourist` plus partner logos, listing every file in `index.json` (see `assets/logos/README.md`). A client without a logo file is hidden; partners without files show as text.
2. `contact.html`: replace `REPLACE_WITH_FORM_ID` with the real Formspree/Tally endpoint. Until then the form opens the visitor's email client.
3. `privacy.html`: draft text, replace with the legally reviewed version.
4. Add an Open Graph share image (1200x630) and reference it with `<meta property="og:image">` on every page.
5. After deploy: open every page on desktop and mobile, submit the form once, check `sitemap.xml` and `robots.txt` resolve.

**Do not change without asking Steven:** copy, client names, figures, colours (Jade `#2AA880`), font (Switzer). Chart figures are modelled examples; the footer of every page says so. Replace them with BSM data only from approved exports.

**Navigation (v13):** floating pill navbar that shrinks on scroll, hides on scroll down and returns on scroll up, with a sliding hover highlight, a scroll progress line, a two-column mega menu with icons, and a full-screen mobile menu. Pattern after Aceternity UI Resizable Navbar and Floating Navbar, rebuilt in `assets/fx.js` / `fx.css`. **Page transitions:** cross-document View Transitions (`@view-transition`) with a fade fallback; the first section of every page rises in on arrival.

**Scroll-driven explorers (v14):** on desktop every multi-item chart block is sticky and advances item by item as the visitor scrolls (no clicks needed; clicking an item scrolls to it). On screens up to 900px each item is unrolled into its own panel with chart and text, so everything is visible by scrolling.

**Cookie consent (v15):** banner on first visit (Accept all / Reject non-essential / Settings with Analytics and Marketing toggles), reopened from "Cookie settings" in every footer. Google Consent Mode v2 defaults are set to denied in each page head. The choice is stored in localStorage as `bsp_consent` and fired as the DOM event `bsp:consent` ({analytics, marketing}). Load GA4 / Meta pixel / Google Ads tags only after consent (listen for the event, or read `window.bspConsent.get()`).

**v18:** Home: the full calculator moved to `benchmarks.html`; Home shows a benchmark teaser (six unit-cost tiles + link). The Go-to-market band is compacted (2x2 steps on mobile). Home insights are full-screen stacking cards (`.fsc`, logic in fx.js) that still open in the reader sheet.

**v37:**
- Canvas models on Home sized from layout size (clientWidth/Height + ResizeObserver), so chart text is never stretched or skewed; the tilt-in effect on model exhibits is replaced by a straight slide-up.
- Work page rebuilt: results band, featured case (UNIQLO) and a 3-column grid of all case studies, each with a generated cover (`assets/thumbs/case-<slug>.svg`) showing client and headline result. Covers also open each case page.
- Insights thumbnails regenerated with an editorial title on the left of each cover.

**v36:** Trust section (Home, About) rebuilt as a compact dark band with four icon cards. Systems data-pipeline model on phones: smaller engine box with a single "Engine" label. "Bespoke in one minute" cards 03 and 04 on phones show one short line instead of the lists, so each fits one screen.

**v35:** Home "Engagement model" rebuilt as one scroll-driven timeline card (`.egx`): a month counter runs to 18+, a value curve draws in, and a proportional bar fills stage by stage (Discovery 4 to 6 weeks, Build 2 to 4 months, Partnership 12 months+), with each stage's outcome shown as a chip. Remaining "Request a briefing" buttons now read "Book a meeting" and link to contact.html#book.

**v34:**
- Home go-to-market band rebuilt (`.gtx`): one headline ("Enter Southeast Asia. Prove it in 90 days."), a CTA, and a scroll-driven timeline. As you scroll, a day counter runs 00 to 90, the jade track fills, the four stages (Enter, Build, Launch, Prove) light up and the market chips VN, SG, MY, TH switch on.
- Canvas text can no longer spill outside its frame on small screens: a small guard at the top of viz.js (also inlined in the head of index.html) nudges any horizontal label back inside the canvas. The Systems data-pipeline model also sizes its columns from its label widths.

**v33:**
- Home models: no sticking, tabs or overlap on any screen. Each model reveals with scroll only: a jade line draws across the top of the card, the exhibit tilts up into place and the text writes in line by line (`--p` set per card by the inline script at the end of index.html). Large outline numbers 01, 02, 03 mark each layer.
- Zalo buttons now open the Bespoke Marketing Official Account: https://zalo.me/2722835767291363986.
- Mobile menu: "Book a meeting" button fixed (was dark text on dark).
- New "In the press" section on Home and About (CafeBiz feature, June 2026; Agency Vietnam profile). Add new coverage by copying a `.pr-c` card.

**v32:**
- Home models on phones: three-tab "control room" (01 Intelligence, 02 Systems, 03 Demand). Swipe or tap; it advances on its own every 6.5 s while in view and pauses when touched. Desktop keeps the stacking cards.
- Contact page: new "Book a meeting" section (`#book`) with three formats (30, 45, 60 min). Paste the Google Calendar appointment schedule links into `BSM_BOOKING` at the top of the booking script in contact.html. Until links are set, each format falls back to email and Zalo.
- All "Request a briefing" nav buttons now say "Book a meeting" and go to `contact.html#book`. Mobile menu second button is "Chat on Zalo" (zalo.me/84896325717). No phone number is shown anywhere.
- Addresses (footer on every page and contact page): Head office Fimexco Building, 231-244 Le Thanh Ton Street, Ben Thanh Ward, Ho Chi Minh City; Singapore: 7 Straits View, #04-01, Marina One East Tower, Singapore 018936.

**v31:** Polish pass.
- Home: model cards no longer stick on phones (nothing gets cut; CTA always visible); desktop keeps the smooth stack. The mobile section dock is removed.
- Home: client logos and the numbers band now sit right after the hero (50+ brands, 4 markets, 10 published case studies, 18 research pieces). Hero has a second CTA, "See our work".
- Sitewide: "LIVE MODEL" labels and fake terminal dots replaced by quiet "Exhibit" labels; code-style file names (e.g. intelligence / outlier_scan) rewritten as "Intelligence · Outlier scan".
- Footer on every page: "Est. 2022 · Ho Chi Minh City · Singapore".
- Full-screen insight cards on phones: shorter text so titles never cut.
- Removed a leftover template note in the Spot the Outlier article.

**v30:**
- insights.html rebuilt as one index: featured research, a sticky topic filter with counts, and a uniform grid of all 18 pieces (compact list with thumbnails on mobile). Thumbnails added for the 3 research articles.
- Home "Every layer, modelled": model cards now stack smoothly on all screens (sticky cards, previous card scales and dims; inline script at the end of index.html). The old fx.js stack is disabled. Mobile cards show the live model first, then compact text.
- Home mobile: a floating section dock (bottom centre) shows the current section and opens a one-tap jump menu to all 11 sections. The footprint map is hidden on mobile because it repeats the "Who it is for" map.

**v29:** Home "Bespoke in one minute" (mobile): new visuals for card 01 (`gl-what`: four channel sources feed a rotating engine that outputs a rising revenue curve) and card 02 (`gl-who`: dot-matrix map of Southeast Asia drawn from real coordinates, Ho Chi Minh City hub with arcs to Bangkok, Kuala Lumpur, Singapore, Jakarta and Manila). Visual area is taller on mobile.

**v28:**
- Nav: pages with a light top (articles, case studies) always show the dark pill nav (`body:has(.art-head)` in fx.css).
- Home: "Selected work" section removed (Work lives in the nav and work.html).
- Benchmarks calculator and Home teaser now in USD. Unit costs stay in VND in calc.js and convert at `FX = 26000` (VND per USD); budget input and chips are in USD.
- Work: 10 case studies. New: central-group-dyson, vinfast, pop-mart, my-kingdom, imv-group. UNIQLO and Sony no longer carry "Vietnam" in the name.
- `sitemap.xml` (42 URLs) and `robots.txt` regenerated.

**v27:**
- work.html: the anonymous "Long engagements" section is removed; "Published work" case studies now carry the page.
- Insights library: 15 articles in `/insights/` (6 earlier notes plus 9 migrated from the old site), listed on insights.html in a filterable "Library" section (`#library`).
- Every article has an on-brand cover/thumbnail generated as SVG in `assets/thumbs/<slug>.svg` (1200x630), plus charts and tools.
- Exhibits and tools are rendered by `assets/ex.js` + `assets/ex.css`. Charts: `<figure class="xb" data-x='{json}'>` with types hbar, bar, wf (waterfall), flow, layers, stats, matrix. Tools: `<div class="xt" data-tool="roi|gagsc|cod|otb|percap|ev|kpi|glide">`.
- `_redirects` covers all migrated URLs.

**v26:** Content migrated from the old site (rewritten in English, NDA notes kept):
- Case studies in `/work/`: uniqlo-vietnam, sony-vietnam, hdbank-vcf, vietcombank, valuence-holdings. Listed on work.html in a new "Published work" section (`#case-studies`) and linked from the Home work section.
- CEO Spotlight notes in `/insights/`: cross-border-ads-localisation, predictive-demand-forecasting, data-driven-merchandising, retail-kpi-stack, btl-inside-malls, nmv-net-sales-gap. Listed on insights.html in a new "Operator notes" section (`#ceo-spotlight`), opening in the reader sheet.
- Old URLs to redirect (Cloudflare `_redirects`): see `_redirects` in the package root.
- Home "Bespoke in one minute" now shows on mobile only; proof line removed.
- fx.js: cookie banner path prefix also covers `/work/`.

**v25:** Home "Selected work" reuses the full-screen stacking cards from the Insights section (`.fsc` with extra class `.wkc`, stacking logic already in fx.js). Each card keeps its animated canvas (`wk-ent`, `wk-mob`, `wk-koc`) and links to work.html; an NDA line with "Request a briefing" sits below the stack.

**v24:** Benchmarks calculator no longer pins the page. While it is on screen the four business-type scenarios auto-play (about 4 seconds each, budget 100M / 300M / 500M / 1.5B VND), the scenario dots are tappable, and any edit switches to "Your scenario" (calc.js, `data-tour`).

**v23:** Selected work no longer pins or scrolls sideways. Cases are stacked full-width cards (visual and text alternate sides on desktop; visual on top on mobile) that ease up and scale in as they enter the viewport, so scrolling never stops. The v22 rules are overridden by the v23 CSS block in index.html.

**v22:** Home "Selected work" (`#work`, class `.wk`) is now a pinned horizontal gallery: vertical scroll moves the case cards sideways (inline script at the end of index.html), with a progress line. Each case card has an animated canvas (`wk-ent`, `wk-mob`, `wk-koc` in viz.js), a "what we built" list by layer, and a final "Under NDA" card linking to the briefing. Reduced motion falls back to a swipeable row.

**v21:** Each "Bespoke in one minute" card has an animated canvas visual (`.gl-vis`, models `gl-what`, `gl-who`, `gl-how`, `gl-start` in viz.js): spend to revenue engine, Southeast Asia hub map, three-layer stack, discovery-to-revenue path. Decorative only (aria-hidden).

**v20:** Home hero is minimal again (no subline). On mobile (<=720px) the "Bespoke in one minute" cards (`.gl-c`) are full-screen sticky panels that stack over each other, with a large outline number (`.gl-big`); desktop keeps the 4-column grid.

**v19:** Compact nav (Harvey-style): desktop = Infrastructure ▾ / Benchmarks / Work / Insights / Company ▾ (About, Besonic, Contact; `.dd-sm` single column). Mobile menu = large-text accordion using `<details class="mi">` plus two bottom buttons (`.mn-cta`). Styles at the end of `assets/fx.css`; Company glyphs in fx.js. Home: hero subline + new "Bespoke in one minute" section (`#glance`) right after the hero. About: Leadership section removed. Addresses now read "Ho Chi Minh City, Vietnam" and "Singapore"; contact page shows VNO Building, 124 Dien Bien Phu Street, Dakao Ward (confirm before launch).

**v17:** scroll-driven tools: the budget simulator and the benchmark calculator pin on screen and play through scenarios as the visitor scrolls (`window.bspScrolly` in viz.js; calculator tour in calc.js, enabled by `data-tour`); any tap or slider move hands control to the visitor. The per-format breakdown sits below the pinned calculator. Insights use an editorial (NYT-style) layout and open in a reader sheet (iframe of the article with `?embed=1`, which hides site chrome); "Open full page" and the URL update keep articles shareable.

**v16:** calculator now covers 6 channels and 12 formats with business-type presets; each format is tagged Actual (DSP account, Aug to Oct 2026) or Rate card (BSM committed planning rates, July 2026); edit `CH` and `PRESETS` at the top of `assets/calc.js`. Home now carries the full calculator (`#bench`) and the budget return simulator (`#budget-return`). Benchmarks is a top-level nav item. Partner logos come from Simple Icons (CC0 SVGs) in `assets/logos/`, shown icon + name; Sony, UNIQLO and JCB client logos are Simple Icons SVGs too. Scroll effects: `[data-scrub]` word reveal, `[data-to]` counters, stacking model cards on Home (desktop).

**Media benchmark calculator (v15):** `benchmarks.html` (full tool) and a mini version on Home (`#bench`), both driven by `assets/calc.js`. Benchmarks live in the `BM` object at the top of calc.js: source is the DSP account (Meta, TikTok, Google Ads, Aug to Oct 2026, VND, ex VAT and 10% contractor tax), shown anonymised as "a leisure and entertainment brand in Ho Chi Minh City". Update the object when new benchmarks are approved.

**Chart controls (v11):** charts are chosen from the list beside them (click, or arrow keys); there are no on-chart buttons. Seven models are adjustable (slider under the chart, or drag on the chart): `q-marginal`, `i-audit`, `i-growth`, `z-monte`, `z-bayes`, `z-ltv`, `d-brand`. Any chart can be opened directly with `#m-<key>`, e.g. `method.html#m-z-bayes`. To make another model adjustable, add `V['key'].adj={label,min,max,val,fmt}` in `assets/viz.js` and read the fifth argument of the model function.

**Pages:** index, architecture, intelligence, systems, demand, method, go-to-market, benchmarks, engine, work, insights (+3 articles in `insights/`), about, contact, privacy, 404.
**Shared assets:** `assets/viz.js|css` (49 animated chart models, simulator, logo marquee), `assets/fx.js|css` (motion layer), `assets/brand/` (logo), `assets/svg/` (static chart exports).

---
(Older notes below are kept for history; where they conflict, this section wins.)

# Bespoke website: bàn giao cho dev

Website tĩnh (HTML/CSS/JS thuần), không cần build, không có framework. Toàn bộ animation (Signal Field, các mô hình, dashboard) viết bằng canvas + JavaScript, nằm sẵn trong từng file HTML.

## Cấu trúc thư mục

```
/index.html                         Trang chủ
/architecture.html                  The Architecture of Revenue (trang kể chuyện 6 chương)
/insights/spot-the-outlier.html     Bài Insights mẫu, đồng thời là template cho mọi bài sau
/404.html                           Trang lỗi
/favicon.svg
/robots.txt, /sitemap.xml
/assets/svg/                        16 chart và sơ đồ dạng SVG (dùng cho deck, social, bài viết mới)
```

## 1. Deploy lên Cloudflare Pages (khoảng 30 phút)

**Cách nhanh (không cần Git):**
1. Đăng nhập dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets.
2. Đặt tên project `bespoke-website`, kéo thả **cả thư mục này** (không kéo từng file).
3. Deploy. Site chạy ngay ở `bespoke-website.pages.dev` để duyệt.

**Cách khuyên dùng lâu dài (có lịch sử chỉnh sửa):**
1. Đẩy thư mục này lên một repo GitHub riêng tư.
2. Cloudflare Pages → Connect to Git → chọn repo.
3. Build command: để trống. Output directory: `/`.
4. Mỗi lần push lên nhánh `main` là site tự cập nhật. Nhánh khác tạo link preview để duyệt trước.

## 2. Trỏ tên miền

1. Cloudflare Pages → project → Custom domains → thêm `bespokemarketing.asia` và `www.bespokemarketing.asia`.
2. Nếu DNS đang ở nhà cung cấp khác: chuyển nameserver sang Cloudflare, hoặc tạo bản ghi CNAME theo hướng dẫn trên màn hình.
3. SSL tự cấp, không cần cấu hình.
4. **Trước khi trỏ:** giữ lại bản WordPress cũ ở một subdomain (ví dụ `old.bespokemarketing.asia`) cho đến khi xong bước 5, để không mất các trang tuyển dụng, knowledge base và link SEO đang có.

## 3. Việc dev cần làm thêm

| # | Việc | Gợi ý | Ưu tiên |
|---|---|---|---|
| 1 | Form "Request a briefing" | Hiện là `mailto:partners@bespokemarketing.asia`. Thay bằng form Tally hoặc Formspree (có gói miễn phí), gửi về email trên | Cao |
| 2 | Analytics | Bật Cloudflare Web Analytics (miễn phí, không cần cookie banner) hoặc gắn GA4 | Cao |
| 3 | Logo | Đã gắn logo chính thức (`assets/brand/logo-bespoke-light.svg`) và favicon từ chữ B. Cần thêm bản logo nền sáng nếu dùng cho trang trắng | Thấp |
| 4 | Ảnh Open Graph | Tạo ảnh 1200×630 (nền đen, chữ "Revenue, engineered.") và thêm thẻ `og:image` vào `<head>` mỗi trang | Trung bình |
| 5 | Redirect link cũ | Lập danh sách URL cũ đang có traffic (solutions, clients-partners, các bài tuyển dụng, kb-*) và tạo file `_redirects` để không mất SEO | Cao |
| 6 | Ngôn ngữ | Website chỉ dùng tiếng Anh (quyết định định vị). Không thêm nút chuyển ngôn ngữ | Đã chốt |
| 7 | Hiệu năng mobile | Kiểm tra Lighthouse trên mobile. Nếu chậm, giảm số điểm của Signal Field (biến `cols`, `rows` trong hàm `field`) | Trung bình |

## 3b. Logo khách hàng

Dải "Trusted by" trên trang chủ đang hiển thị tên khách hàng dạng chữ (Central Group, Vietcombank, UNIQLO, HDBank, FV Hospital, TTC Land), lấy từ các logo đang công khai trên website cũ. Thay từng tên bằng logo SVG đơn sắc màu xám (#8C8C8C), lấy từ thư viện media WordPress cũ, chiều cao khoảng 24px, hover chuyển trắng. Chỉ đưa lên logo đã được khách đồng ý công khai.

## 4. Quy tắc khi chỉnh sửa

- **Màu chủ đạo (Jade):** đổi duy nhất ở `:root{--sig-d:#2AA880;--sig-l:#0E8A63;--sig-soft:#9ED9C3}` đầu mỗi file. Canvas tự đọc lại biến `--sig-d`.
- **Font:** chỉ dùng Switzer (Google Fonts). Không thêm font khác.
- **Nội dung:** chỉ hiển thị tên/logo khách hàng đã đồng ý công khai (6 thương hiệu ở dải "Trusted by"). Case study vẫn ẩn danh. Không thêm số liệu chưa kiểm chứng. Mọi chart minh họa phải giữ nhãn "Illustrative data".
- **Văn phong:** tiếng Anh kiểu Anh (British English), không dùng dấu gạch ngang dài (em dash).
- **Bài Insights mới:** nhân bản `insights/spot-the-outlier.html`, đổi tiêu đề, meta description, nội dung, chart. Thêm URL mới vào `sitemap.xml` và thêm thẻ bài ở mục Insights trên trang chủ.

## 5. Checklist trước khi trỏ tên miền chính

- [ ] Form gửi thử thành công về email
- [ ] Analytics ghi nhận lượt xem
- [x] Logo và favicon chính thức
- [ ] Tất cả link trên menu và footer chạy đúng
- [ ] Kiểm tra trên iPhone, Android, Chrome, Safari
- [ ] File `_redirects` cho các URL cũ quan trọng
- [ ] Lighthouse mobile: Performance từ 80 trở lên

## Sitemap (v5)
| Page | File | Role in the story |
|---|---|---|
| Home | index.html | Hook: Revenue, engineered. |
| The Architecture of Revenue | architecture.html | Why: manifesto, 6 chapters |
| 01 Intelligence | intelligence.html | Layer 1: audit, analysis, attribution, growth model |
| 02 Systems | systems.html | Layer 2: tracking, reporting, CRM, Zalo OA, web, AI |
| 03 Demand | demand.html | Layer 3: media, KOC, e-commerce, SEO, social |
| Besonic | besonic.html | Proof of tech (LIVE / IN BUILD) |
| Work | work.html | Proof of results (anonymised, NDA) |
| Insights | insights.html + insights/*.html | Thought leadership |
| About | about.html | Story, principles, leadership, Holdings, Trust |
| Request a briefing | contact.html | Conversion |

TODO before launch:
- contact.html: replace `REPLACE_WITH_FORM_ID` with a real Formspree/Tally endpoint
- privacy.html: needs legal review before it is added
- about.html: add more leadership members if needed

## Visual models (v6)
- `assets/viz.js` + `assets/viz.css`: one shared library, no dependencies.
- Any `.svx` block = list of items (left) + one canvas (right). Each item has `data-k` = key of a model in viz.js.
- 27 models: intelligence (i-*), board questions (q-*), systems (s-*), before/after (sb-*), demand (d-*), sprint (sp-*), engine (en-*), home method (me-*), home engagement (eg-*).
- Auto-advances every 6 to 7s, pauses on hover, click to select, static under prefers-reduced-motion.
- All figures are labelled ILLUSTRATIVE DATA. Do not replace with client numbers without written consent.

## v7 additions
- New pages: `method.html` (The Quant Method, 8 models + budget simulator), `privacy.html` (DRAFT: needs legal review before launch), two new articles in `insights/`.
- Logo marquee (home, work, about): names render as text until official logo files are added. See `assets/logos/README.md`.
- 11 new quant models in `assets/viz.js` (keys `z-*`), plus `sim()` for the simulator and `logos()` for the marquee.
- `contact.html`: until `REPLACE_WITH_FORM_ID` is replaced, the form opens the visitor's email client addressed to partners@bespokemarketing.asia.
- Every page has canonical + Open Graph URL tags; `index.html` has Organization JSON-LD. Still to add: an Open Graph share image (1200x630).
- 404.html uses root-absolute links on purpose (it is served at any path depth).

## Motion layer (v8)
- `assets/fx.css` + `assets/fx.js`: vanilla CSS/JS rebuilds of seven free Aceternity UI patterns (Spotlight, Moving Border, Text Generate Effect, Lamp, Tracing Beam, Background Beams, Sticky Scroll rail). No React, no dependencies. Everything is attached by `fx.js` at load; no extra markup is needed in the pages.
