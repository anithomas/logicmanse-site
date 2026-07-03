# Deployment Guide — logicmanse.ca

Every step below is something **you** do yourself, in your own browser, logged
into your own accounts. I don't hold logins, tokens, or payment details for
any of these services — that's intentional, both for your security and
because Anthropic access rules don't let me sign into third-party accounts on
your behalf.

Total cost to run this: **$0/month** (Netlify's free tier covers a site like
this; you already own the domain through GoDaddy).

---

## Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new).
2. Repository name: `logicmanse-site` (or anything you like).
3. Keep it **Private** if you don't want the code public, or **Public** if
   you'd like it visible as an Upwork portfolio proof point — either works.
4. Don't check "Add a README" (this project already has one).
5. Click **Create repository**. GitHub will show you commands — ignore them,
   use the commands below instead since the project is already built.

From a terminal on your own computer, inside this project folder:

```bash
git init
git add .
git commit -m "Initial site build"
git branch -M main
git remote add origin https://github.com/<your-username>/logicmanse-site.git
git push -u origin main
```

GitHub will prompt you to sign in the first time — use your own GitHub
credentials (or a personal access token if prompted). Never paste GitHub
tokens into a chat with me; enter them only directly into GitHub's own
prompts.

---

## Step 2 — Connect Netlify to that repository

1. Go to [app.netlify.com](https://app.netlify.com) and sign up / log in
   (GitHub sign-in is the fastest option).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize Netlify's GitHub app (this is Netlify asking
   GitHub for permission — a normal, expected OAuth step for this workflow),
   and select the `logicmanse-site` repository.
4. Build settings — Netlify should auto-detect Astro, but confirm:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**. In 1-2 minutes you'll get a live URL like
   `random-name-123.netlify.app` — that's your site, live on the internet,
   before you've touched GoDaddy at all.

From now on, every time you `git push` to GitHub, Netlify automatically
rebuilds and redeploys the site.

---

## Step 3 — Point your GoDaddy domain at Netlify

**In Netlify:**

1. On your site, go to **Site configuration → Domain management → Add a
   domain**.
2. Enter `logicmanse.ca` (and/or `www.logicmanse.ca`) and confirm ownership.
3. Netlify will show you **four nameserver values** (something like
   `dns1.p0X.nsone.net`) under DNS settings. Keep this page open.

**In GoDaddy:**

4. Log into [godaddy.com](https://godaddy.com) → **My Products** → find
   `logicmanse.ca` → **DNS** (or **Manage Domain**).
5. Check that **Domain Lock** is **off** (GoDaddy blocks nameserver changes
   while it's on).
6. Find **Nameservers** → **Change** → **Enter my own nameservers (advanced)**.
7. Enter the four values Netlify gave you, replacing GoDaddy's defaults.
   **Save.**

**Back in Netlify:**

8. Click **Verify DNS configuration**. Netlify will also automatically
   provision a free HTTPS certificate once DNS propagates.

DNS changes can take anywhere from a few minutes to 24-48 hours to fully
propagate worldwide. Don't panic if it's not instant.

> Alternative (if you'd rather not hand over full nameserver control to
> Netlify): keep GoDaddy as your DNS manager and instead add individual
> **A** and **CNAME** records pointing to Netlify's load balancer, per
> [Netlify's DNS docs](https://docs.netlify.com/manage/domains/get-started-with-domains/).
> Handing over nameservers (the steps above) is simpler and is what most
> small sites do.

---

## Step 4 — Set up your branded email (info@logicmanse.ca)

Since you're keeping GoDaddy as your registrar, the easiest path is GoDaddy's
own email hosting:

1. In your GoDaddy account, go to **Email & Office** (or search "Professional
   Email").
2. Choose a plan and create the mailbox `info@logicmanse.ca`.
3. Once created, open `src/data/site.ts` in this project and update:
   ```ts
   contactEmail: 'info@logicmanse.ca',
   ```
   (It's already set to this value — just confirm the mailbox itself is live
   before telling people to use it.)
4. Commit and push the change; Netlify redeploys automatically.

If you'd rather use Google Workspace or another provider for mail instead of
GoDaddy's, that's fine too — the only thing that matters for this site is
that `info@logicmanse.ca` actually receives mail somewhere.

---

## Step 5 — Confirm the contact form works

The Contact page (`src/pages/contact.astro`) uses **Netlify Forms** — no
extra sign-up needed, it activates automatically the first time Netlify
builds a page containing `data-netlify="true"`.

After your first deploy: go to **Netlify → your site → Forms**. You should
see a form named `contact` listed. Submit a real test through the live
Contact page and confirm it shows up there. You can turn on **email
notifications** for new submissions under **Forms → Settings →
Notifications**, pointed at your new `info@logicmanse.ca` inbox.

---

## Ongoing workflow, once this is all set up

1. Edit files (usually just `src/data/site.ts`, `src/data/services.ts`, or a
   page in `src/pages/`).
2. `git add . && git commit -m "describe your change" && git push`
3. Netlify rebuilds automatically in ~1 minute. Done.

No FTP, no manual uploads, no GoDaddy hosting plan required.
