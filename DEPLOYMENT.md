# Deployment Guide — logicmanse.ca (GitHub Pages)

Everything runs on GitHub — no Netlify, no Vercel, no separate hosting
account. Total cost: **$0/month** (you already own the domain via GoDaddy).

Every step below happens in **your own** GitHub/GoDaddy logins. I don't hold
credentials for either — that's both a security rule I follow and simply how
account access works.

---

## Step 1 — Create the GitHub repository

Already done: **github.com/anithomas/logicmanse-site** exists (public, empty).

Push the code to it from a terminal on your own computer, inside this
project folder (`logicmanse-site`). If the folder's `.git` metadata looks
odd (it may, since it synced through OneDrive) delete the hidden `.git`
folder first — the actual site files are untouched either way — then run:

```bash
git init
git add .
git commit -m "Initial site build"
git branch -M main
git remote add origin https://github.com/anithomas/logicmanse-site.git
git push -u origin main
```

GitHub will prompt you to sign in the first time. Use your own GitHub login;
never paste a GitHub token into chat with me — enter it only into GitHub's
own prompt.

---

## Step 2 — Turn on GitHub Pages, powered by the included workflow

This repo already includes `.github/workflows/deploy.yml`, which builds the
Astro site and publishes it every time you push to `main` — no manual build
step, no dashboard clicking after this one-time setup.

1. On your repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**
   (not "Deploy from a branch").
3. That's it for this step — the next push (or re-running the workflow from
   the **Actions** tab) will build and deploy automatically.
4. Watch it run under the **Actions** tab. When it finishes, GitHub shows a
   live URL like `https://<your-username>.github.io/logicmanse-site/` —
   confirm the site loads there before moving to the domain step.

---

## Step 3 — Point logicmanse.ca at GitHub Pages

**In GitHub:**

1. Still in **Settings → Pages**, under **Custom domain**, enter
   `www.logicmanse.ca` and save. (A `public/CNAME` file already sets this
   automatically too — this UI step is what makes GitHub verify and issue
   the HTTPS certificate.)

**In GoDaddy:**

2. Log into [godaddy.com](https://godaddy.com) → **My Products** → find
   `logicmanse.ca` → **DNS** (or **Manage Domain**).
3. Add/edit these records (current GitHub Pages values as of this writing —
   see [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) if you want to double-check before applying):

   | Type  | Name | Value                  |
   |-------|------|------------------------|
   | A     | @    | 185.199.108.153        |
   | A     | @    | 185.199.109.153        |
   | A     | @    | 185.199.110.153        |
   | A     | @    | 185.199.111.153        |
   | CNAME | www  | `<your-username>.github.io` |

   Four `A` records on the bare `@` (apex) domain point `logicmanse.ca`
   itself at GitHub Pages; the `CNAME` on `www` points `www.logicmanse.ca`
   at your GitHub Pages default address. Remove/replace any existing `A` or
   `CNAME` records for `@`/`www` that point elsewhere (e.g. GoDaddy's
   default parking page records) — leaving old ones in place is the most
   common cause of "it's not working."
4. Leave **Domain Lock** as-is; unlike a nameserver change, individual DNS
   records don't require unlocking.

**Back in GitHub:**

5. Return to **Settings → Pages** and check **Enforce HTTPS** once it
   becomes available (can take a few minutes to a few hours after DNS
   propagates) — this forces visitors onto the secure `https://` version.

DNS changes can take anywhere from a few minutes to 24-48 hours to fully
propagate. If `www.logicmanse.ca` doesn't load right away, that's expected —
check back later before assuming something's wrong.

---

## Step 4 — Set up your branded email (info@logicmanse.ca)

GitHub Pages only serves files — it has nothing to do with email. Use
GoDaddy's own email hosting (or Google Workspace, your choice):

1. In GoDaddy, go to **Email & Office** → create the mailbox
   `info@logicmanse.ca`.
2. `src/data/site.ts` already has `contactEmail: 'info@logicmanse.ca'` — no
   code change needed once the mailbox is live.

---

## Step 5 — Confirm the contact form works

The Contact page builds a pre-filled email in the visitor's own email app
when they click submit (see the comment in `src/pages/contact.astro`) — no
server, no third-party form service, works on any static host including
GitHub Pages. Test it yourself once live: fill out the form, confirm your
own email client opens with the right subject/body, and that it's addressed
to `info@logicmanse.ca`.

If you'd later prefer a proper backend inbox instead of relying on the
visitor's email client (e.g. to track leads in one place), a service like
[Formspree](https://formspree.io) can be dropped in without leaving GitHub
Pages — that's a small, optional follow-up, not required to launch.

---

## Ongoing workflow, once this is all set up

1. Edit files (usually just `src/data/site.ts`, `src/data/services.ts`, or a
   page in `src/pages/`).
2. `git add . && git commit -m "describe your change" && git push`
3. The GitHub Actions workflow rebuilds and redeploys automatically in
   roughly a minute. Done — no dashboard visits required.
