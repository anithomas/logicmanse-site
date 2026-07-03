# Logicmanse Solutions — Website

Source code for [www.logicmanse.ca](https://www.logicmanse.ca). Built with
[Astro 5](https://astro.build) + [Tailwind CSS](https://tailwindcss.com). No
JavaScript framework, no client-side build step at runtime — the site
compiles down to plain, fast-loading HTML/CSS.

## Before you edit anything

You don't need to know how to code to make most changes:

- **Text on any page** — open the matching file in `src/pages/` (e.g.
  `src/pages/services.astro` is the Services page) and edit the text between
  quotes or between tags. Leave anything starting with `<` or `{` alone.
- **Business name, contact email, navigation links** — all in one place:
  `src/data/site.ts`.
- **Service descriptions** — all in one place: `src/data/services.ts`.

## Local setup (first time only)

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
```

## Run it locally

```bash
npm run dev
```

Then open the URL it prints (usually `http://localhost:4321`).

## Build for production

```bash
npm run build
```

This creates a `dist/` folder with the finished site. You will not normally
run this yourself — the included GitHub Actions workflow (see
`DEPLOYMENT.md`) runs it automatically every time you push to GitHub.

## Project structure

```
src/
  data/         business info + service copy (edit text here)
  layouts/      shared page shell (header, footer, fonts)
  components/   reusable pieces (buttons, cards, nav)
  pages/        one file per page — this is the site's structure
  styles/       global CSS
public/         static files copied as-is (favicon, etc.)
```

## Deployment

See `DEPLOYMENT.md` for the full, step-by-step guide to pushing this to
GitHub, turning on GitHub Pages, and pointing your GoDaddy domain at it.

## A note on the "Sample Projects" page

`src/pages/portfolio.astro` currently shows illustrative example projects,
clearly labeled as such. Replace them with real case studies as you complete
real client work — do not remove the "Sample Project" labeling from anything
that isn't a verified, permission-cleared real engagement.
