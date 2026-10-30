# logicmanse.ca — Design System

The visual rules every page, component and graphic for **LogicManse Publications** must follow. Use this before building or restyling anything. Brand rules in `SITE_MASTER_BLUEPRINT.md` section 3 still apply; this file adds the exact tokens and component rules.

**Live copy (editable, with component previews):** https://claude.ai/artifact/NHiVhnCXdd1CaBcRfEQYXX

*Snapshot taken 2026-10-30 from that artifact. If the two disagree, the artifact is newer: update this file in the same commit as any site change that touches a token.*

---

## 1. Content fundamentals

- Voice is plain, practical and first-person plural ("we read every message ourselves"). Address the reader as "you". No hype, no emoji.
- Headlines are short declaratives with a rule behind them: "Books Made to Be Used, Not Just Read.", "Four Kinds of Books, One Rule", "Real Books, Not Mockups". **Title Case** for headlines, sentence case for body and card copy.
- Eyebrow labels are uppercase and sit above a headline: "WHAT WE PUBLISH", "FEATURED TITLES", "A LOOK AT WHAT WE MAKE".
- Claims are concrete and checkable: "30 coloring pages, mazes, word searches", `8.5" × 11" · 106 pages · ages 4–8`. Show real covers and real pages, never stock photography or mockups.
- Calls to action are two to four words: "Browse Our Books", "Get in Touch", "Learn more →", "See All Books".

## 2. Visual foundations

- **Two grounds:** `navy` for the header and hero, `surface` for content, `surface-alt` for one alternating band. Headings on light grounds are `navy`; body is `ink`.
- **`green` is the only action color.** Primary buttons are `green` with an `on-navy` label. On navy, `green-tint` is the eyebrow and `green-bright` marks the active nav link and the "Publications" wordmark.
- **Type pairs a serif for display** (`h1`, `h2`, `h3`, Merriweather 700) **with a sans for everything else** (`body`, `nav`, `eyebrow`, `button`, Inter). Never set body copy in the serif.
- Buttons use `radius-md` (6px). Hero book covers are shown fanned and tilted, overlapping, with a soft drop shadow; real covers only.
- Spacing steps in use are 12, 16, 24 and 32px. Hairlines use `border`.
- **Known contrast gap:** `green-bright` on `navy` is about 3.8:1. It is a source value, kept exact, so limit it to the nav link and the wordmark. Never use it for body text.
- A book's own colours may appear only as a small accent (see Blueprint section 3); they never replace these tokens.

## 3. Color tokens

| Token | Value | Use |
|---|---|---|
| `surface` | `#ffffff` | Page background and card fill. Text on it: `ink`, `navy`. |
| `surface-alt` | `#f8fafc` | Alternating section band (the trust strip) under the hero. |
| `navy` | `#0b1f3a` | Header and hero background; heading text (h2, h3) on light grounds (about 16:1). |
| `ink` | `#334155` | Body copy on `surface` and `surface-alt` (about 10:1). |
| `on-navy` | `#ffffff` | Text, outline-button borders and wordmark on navy; label text on `green`. |
| `green` | `#1f6f4a` | Primary button fill (white label about 6:1). The one action color. |
| `green-bright` | `#2c8a5d` | Active nav link and "Publications" wordmark accent on navy only (about 3.8:1). |
| `green-tint` | `#8fd1ae` | Eyebrow label on navy (about 10:1). Not for use on white. |
| `border` | `#e5e7eb` | Hairline borders on `surface` (cards, dividers). |
| `border-on-navy` | `#ffffff66` | Outline of the secondary button on navy (white at 40%). |

## 4. Typography

Families: serif `Merriweather, Georgia, serif`; sans `Inter, system-ui, sans-serif`.

| Style | Family | Size / line | Weight | Use |
|---|---|---|---|---|
| `h1` | serif | 60 / 60px | 700 | Hero headline, white on navy. One per page. |
| `h2` | serif | 36 / 40px | 700 | Section headline, navy on surface. |
| `h3` | serif | 18 / 28px | 700 | Card and category titles, navy. |
| `body` | sans | 16 / 24px | 400 | Paragraphs in `ink`. |
| `nav` | sans | 14 / 20px | 500 | Header navigation links. |
| `eyebrow` | sans | 14 / 20px, 1.4px tracking | 600 | Uppercase label above a headline; `green-tint` on navy. |
| `button` | sans | 16 / 24px | 600 | Button labels. |

## 5. Spacing and radius

| Token | Value | Use |
|---|---|---|
| `space-3` | 12px | Vertical padding of the secondary button |
| `space-4` | 16px | Vertical padding of the primary button |
| `space-6` | 24px | Horizontal padding of the secondary button |
| `space-8` | 32px | Horizontal padding of the primary button |
| `radius-md` | 6px | Buttons (the only radius measured on the site) |

## 6. Components

**Button.** Two calls to action: a solid primary and an outline secondary for navy grounds. Label is two to four words, Title Case.
- Primary: `green` fill, `on-navy` label, `button` type, `radius-md`, `space-4` × `space-8` padding.
- Secondary: transparent, 1px `border-on-navy`, `space-3` × `space-6` padding, **only on `navy`**.
- Do: one primary per section. Don't: put the secondary on a light ground, add icons, or use other colors.

**SiteHeader.** A `navy` bar with the wordmark at left and navigation at right. Links: Home, Books, About, Community, Contact. Links use `nav`, white; the current page is `green-bright`. The last item is a primary-style "Get in Touch" button.
- Do: keep to five links plus the button. Don't: use `green-bright` for anything but the active link and wordmark accent.

**Hero.** Opens the page on `navy`: eyebrow (`green-tint`), `h1` (`on-navy`), one two-line paragraph in white, a primary and a secondary button, and a fan of real book covers at right.
- Do: use one `h1` that states the rule ("Books Made to Be Used, Not Just Read."). Don't: use stock photography or mockups.

**BookCard.** A featured-title block: category eyebrow, title in `h2`/`h3`, a one-sentence description, a spec line (trim size · pages · age range) and a "Learn more →" link. Title in `navy`, the rest in `ink` on `surface`.
- Do: keep the spec line factual. Don't: add ratings or badges.

## 7. Iconography and logo

No icon set exists on the site. The logo is a small open-book glyph beside the wordmark "LogicManse" (white, serif) and "Publications" (`green-bright`). The glyph is not yet in the design system; use `public/logo-mark-192.png` and `public/logicmanse-publications-logo.jpg` (see Blueprint section 3, Brand assets). Until the original glyph file is added to the artifact under `assets/Logos/`, set the name in plain serif type there.

## 8. How to use this in future work

1. Read this file (or the live artifact) before adding a page, component, email, social graphic or book landing page.
2. Use token names, not new hex values. If a design needs a new color, size or radius, add it to the live artifact and this file first.
3. Check text contrast: 4.5:1 for body text, 3:1 at 24px and above. Don't pair colors that differ only in hue.
4. Avoid gradients, emoji cards and left-border accent cards.
5. Where the site code differs from a token here (see `src/styles/global.css` and `tailwind.config`), the code is what is live: fix whichever is wrong and keep the two in step.
