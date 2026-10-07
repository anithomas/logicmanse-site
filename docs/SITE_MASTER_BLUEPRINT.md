# logicmanse.ca — Site Master Blueprint

The single reference for how the **logicmanse.ca** website is built, what lives where, and the rules every new page or book must follow. Keep this file current: when you add a page, a book, a store link or a rule, update the matching section in the same commit.

*Last updated: 2026-10-06.* Sibling documents: `README.md` (local setup), `DEPLOYMENT.md` (hosting and DNS history), and the company-level `Logicmanse_Solutions_Master_Blueprint.docx` (publishing business, outside this repo).

---

## 1. What the site is

The online home of **LogicManse Publications**, the imprint of Logicmanse Solutions Canada Inc. (Ontario, Canada). It publishes coloring and activity books, cookbooks, log/record books and journals, sold on Amazon (KDP) and Etsy. The site has three jobs:

1. **Sell:** product pages that send visitors to Amazon and Etsy.
2. **Welcome owners:** printed-QR landing pages, one per book, that readers reach from the URL on the back cover.
3. **Collect emails:** free companion downloads delivered through Hostinger Reach sign-up forms.

The site no longer sells software. Old software-business URLs (`/services/`, `/portfolio/`, `/trust-security/`, `/how-it-works/`) are kept as redirect pages so old links never 404.

## 2. Tech stack and hosting

| Piece | Choice |
|---|---|
| Framework | Astro 5 (static output, no client framework) |
| Styling | Tailwind CSS 3 + `src/styles/global.css` + `src/styles/qr-brand.css` |
| Fonts | Merriweather (headings), Inter (body) |
| Hosting | GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main` (served through Cloudflare) |
| Domain | `www.logicmanse.ca` (`public/CNAME`); registrar GoDaddy |
| Repo | `github.com/anithomas/logicmanse-site` |
| Forms and email | Hostinger Reach (embed script `https://cdn-reach.hostinger.com/js/embed.js`) |
| Sitemap / robots | Hand-written `public/sitemap.xml` and `public/robots.txt` |

**Deploy flow:** edit, run `npm run build` (must pass), commit, push to `main`. Live in about a minute. The project owner has said to push once verified, without asking first.

## 3. Brand rules (non-negotiable)

- **Palette:** navy `#0B1F3A` (headers, hero, footer), forest green `#1F6F4A` (buttons and accents), slate for body text, white or light-slate sections. Parchment and brass are print-only.
- **Every page keeps the site brand.** A book's own colours may appear only as a small accent (eyebrow line, step numbers, pull-quote bar, faint section tint), set through the `theme` field. Never on buttons, header, hero or footer.
- **Direction:** light, parent-friendly, institutional and trustworthy, with scroll-reveal motion (`fade-in-up`, `data-parallax`) and a plain navy hero over a fan of every real cover.
- **URLs:** every new URL is **lowercase**. The three printed QR URLs (`/LeiaColoringBook/`, `/RentalManagementLog/`, `/HeartHealthLog/`) are frozen, mixed-case on purpose.
- **Brand assets:** `public/about/brand-hero.jpg` (banner and default social-share image), `public/logicmanse-publications-logo.jpg` (full logo), `public/logo-mark-192.png` (header, footer and QR-page mark), `favicon.ico` / `favicon-48.png` / `apple-touch-icon.png` (all cropped from the logo). Source files live in the OneDrive folder `claude/logicmanse-platform/Etsy Shop/Shop Home/`.

## 4. Repository map

```
src/
  data/
    site.ts            site info, nav, store links, Reach forms, social links
    books.ts           every book's record (content for all book pages)
    social-icons.ts    icon paths for SOCIAL_LINKS
  layouts/
    BaseLayout.astro         page shell: head/meta, header, footer, scroll script
    BookProductLayout.astro  the one template for every /books/<slug>/ page
  components/
    Header, Footer, SocialIcons, CTAButton, SectionHeading,
    BuyButtons (Amazon .com to .ca swap for Canadians), PromoVideo,
    QrLogo (QR-page wordmark), ConstructionBanner, WatermarkOverlay
  pages/               one file per URL (see section 5)
  styles/              global.css, qr-brand.css
public/                static files copied as-is (covers, videos, redirects, sitemap)
docs/                  this blueprint
platform-docs/         unrelated bookkeeping-platform notes (not part of the site)
```

**Single sources of truth** (edit here, never hard-code elsewhere):

| What | File and name |
|---|---|
| Business name, email, location | `site.ts` → `SITE` |
| Header / footer nav | `site.ts` → `HEADER_NAV_LINKS`, `NAV_LINKS` |
| Where each book is sold | `site.ts` → `BOOK_LINKS` (an empty string means "coming soon"; the buttons switch on automatically) |
| Free-companion sign-up forms | `site.ts` → `REACH_FORMS` |
| Social profiles | `site.ts` → `SOCIAL_LINKS` |
| Under-construction banner and watermark | `site.ts` → `SITE_UNDER_CONSTRUCTION` (currently `false`) |
| Everything about a book | `books.ts` → `BOOKS` (home shelf and `/books/` list read `SHELF`) |

## 5. Page inventory

| URL | File | Purpose |
|---|---|---|
| `/` | `index.astro` | Home: navy hero with a fan of every real cover, credibility strip, shop video, categories, featured titles, final CTA |
| `/books/` | `books.astro` | Listing grouped by category (Coloring, Cookbook, Log Book) |
| `/books/leia-coloring-book/` | `books/leia-coloring-book.astro` | Product page (see section 6) |
| `/books/rental-property-record-book/` | `books/rental-property-record-book.astro` | Product page |
| `/books/heart-health-log-book/` | `books/heart-health-log-book.astro` | Product page |
| `/books/family-table-favorites-vol1/` | `books/family-table-favorites-vol1.astro` | Product page |
| `/books/renovation-repair-record-book/` | `books/renovation-repair-record-book.astro` | Product page; **unreleased** (noindex, no cover) |
| `/LeiaColoringBook/` | `LeiaColoringBook.astro` | Printed-QR landing page (frozen URL) |
| `/RentalManagementLog/` | `RentalManagementLog.astro` | Printed-QR landing page (frozen URL) |
| `/HeartHealthLog/` | `HeartHealthLog.astro` | Printed-QR landing page (frozen URL) |
| `/familytablefavorites-vol1/` | `familytablefavorites-vol1.astro` | Printed-QR landing page for the cookbook |
| `/about/` | `about.astro` | Brand story, banner image |
| `/contact/` | `contact.astro` | Hostinger Reach contact form embed (replaced an unconfigured Formspree form) |
| `/privacy-policy/` | `privacy-policy.astro` | Privacy policy |
| `/thank-you/` | `thank-you.astro` | Post-submit confirmation (not indexed) |
| `/services/`, `/portfolio/`, `/how-it-works/`, `/trust-security/` | same-named files | Redirects to `/books/` (or `/privacy-policy/`) |
| `*.html` stubs | `public/LeiaColoringBook.html` etc. | Redirect the exact printed no-slash URL to the page above |

The redirect stubs and `/thank-you/` stay out of the sitemap.

## 6. Book product page standard

All five product pages use `BookProductLayout`, filled from the book's `books.ts` record, so every title looks and behaves the same:

1. **Hero:** category chip, title, tagline, cover, store buttons.
2. **Promo video** (silent 1080×1080 slideshow, `promo-video.mp4` plus poster) and "What's inside" list.
3. **Choose your edition** (when `editions` is set): one row per real format and price.
4. **Free companion** ("Already own the book? Claim your free companion"): bullet list, one sign-up button, "How to use it" steps. Driven by `companion` + `companionOffer`.
5. **Closing:** buy buttons, "Already own it?" link to the QR page, review links (Amazon, Etsy).
6. **Footer** with social icons.

Per-book assets: `public/<book-slug>/` (`cover-front.jpg`, `interior-page.jpg`, `promo-video.mp4`, `video-poster.jpg`).

## 7. Printed-QR landing page standard

The URL printed on a book's back cover opens a standalone, no-navigation page for someone holding the book:

- Navy/forest brand via `qr-brand.css`, `QrLogo` wordmark at the top.
- Content: the free companion (a Reach sign-up form), where to buy each format, a review ask, a link to the full product page.
- Cookbook variant: leads with the embedded Reach form (`<div data-reach-form="…">` plus the Reach embed script at the end of `<body>`), then "Get the book" with every edition.
- Footer: social icons (`<SocialIcons />`), "A LogicManse Publication", link home.
- Because these pages have no site footer, **a new QR page must add `<SocialIcons />` itself.**

## 8. Free-companion funnel

Reader scans the QR code, lands on the QR page, adds an email in the Reach form, and gets the download link by email. The same form is linked from the product page's companion section, so both entry points use the same `REACH_FORMS` value. Forms: Leia colour pack, Rental tracker, Heart Health, Family Table Favorites free PDF. The Renovation book's companion is a direct file download (`public/renovation-repair-log/Renovation_Repair_Digital_Companion.xlsx`).

## 9. Social profiles

Instagram, Facebook, YouTube, TikTok and Pinterest, defined once in `SOCIAL_LINKS`. `SocialIcons.astro` renders them as icons (Simple Icons glyphs, `currentColor`). Shown in the site footer (every normal page) and on every QR landing page.

## 10. Titles at a glance

| Book | Category | Status |
|---|---|---|
| Super Leia to the Rescue! | Coloring & Activity | Live (Amazon, Etsy); QR `/LeiaColoringBook/` |
| Rental Property Record Book | Log Book | Live (Amazon, Etsy); QR `/RentalManagementLog/` |
| Heart Health Log Book | Log Book | Live (Amazon, Etsy); QR `/HeartHealthLog/` |
| Family Table Favorites, Vol. 1 | Cookbook | Live 27–30 Sep 2026: Kindle, paperback, hardcover (Amazon), digital PDF (Etsy); QR `/familytablefavorites-vol1/` |
| Renovation & Repair Record Book | Log Book | Unreleased; see launch steps in section 11 |

Exact prices and links live in `site.ts` and `books.ts` (re-check live listings before trusting an old figure).

## 11. How-tos

**Add a new book**
1. Add its record to `BOOKS` in `books.ts` (and the key to the `Book['key']` union, `BOOK_LINKS` and `REACH_FORMS` if needed).
2. Create `src/pages/books/<slug>.astro` (copy an existing one, a few lines) and put assets in `public/<slug>/`.
3. Build the QR landing page **before the book ships**: the back cover prints a logicmanse.ca URL, so that page must exist first. Use a lowercase filename; add a `public/<name>.html` redirect stub for the no-slash printed URL.
4. Add store links in `BOOK_LINKS` once live; drop `unreleased`; add both URLs to `public/sitemap.xml`.
5. Add `<SocialIcons />` to the QR page footer.

**Launch the Renovation book:** add the real Amazon/Etsy links to `BOOK_LINKS`, remove `unreleased` and add the cover in `books.ts`, build its QR page, add sitemap entries, rebuild.

**Change a social link, store link, nav item or contact detail:** edit the one file in section 4, build, push.

**Update the brand images:** replace the files named in section 3 (keep the same filenames), rebuild.

## 12. Known gaps / backlog

- Free companion for Family Table Favorites: its bullets are generic until the PDF's contents are confirmed.
- Renovation book QR page and launch steps (above).
- `README.md` still mentions `services.ts` and Formspree from the old software-site era; this blueprint supersedes those lines.
- The sitemap is hand-maintained: update it on every page change.
- Keep the Leia, Rental and Heart Health QR pages consistent with section 7 whenever one is edited.
