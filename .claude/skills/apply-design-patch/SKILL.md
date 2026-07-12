---
name: apply-design-patch
description: Apply a zip of design/code feedback (from another Claude session, a design tool, or a freelancer handoff) to the logicmanse-site repo and deploy it. Trigger this whenever the user gives a path to a .zip file of "feedback," "patch," "handoff," or fixed/updated site files — especially phrases like "apply this," "deploy," or a Windows path ending in .zip — even if they don't spell out what's inside. Also trigger on bare "deploy" once such a zip has been mentioned in the conversation. Do NOT trigger for requests to deploy the repo's current committed state with no new zip involved (that's just a plain git push).
---

# Applying a design-patch zip

Someone else — another Claude conversation, a design tool, a freelancer —
periodically hands back a zip of "fixed" or "redesigned" site files that
claims to be ready to commit and push. It never is, quite. The zip's own
description of what it contains is a claim, not a fact: treat it the way
you'd treat a pull request from a contributor you can't fully vouch for —
worth taking seriously, not worth taking on faith.

## Why this workflow exists

Across several rounds of this in one session, three failure modes showed
up repeatedly:

1. **Most of the zip is a no-op.** Tools that export "the whole component
   tree" often re-export files that never changed. Treating every file in
   the zip as a real diff produces noisy commits and makes real changes
   hard to spot.
2. **Some "fixes" are wrong or dangerous to ship blind.** A patch can look
   plausible and still reference data fields that don't exist, quietly
   revert content the user deliberately asked for earlier, or replace a
   working feature (e.g. a contact form) with one that only works after a
   manual setup step the zip doesn't do for you.
3. **Some "fixes" are subtly broken in ways that only show up at runtime.**
   Static review of the diff isn't enough — you have to build and actually
   look at the rendered page.

This skill exists to catch all three before anything reaches production,
while still moving fast — this user has explicitly asked for pushes to
`main` without a confirmation stop (this repo auto-deploys via GitHub
Actions on every push to `main`), so the judgment has to happen *before*
you commit, not by pausing to ask afterward.

## Steps

### 1. Locate and extract

The user gives a path (often something like
`C:\Users\<user>\Downloads\<Project Name> feedback.zip`). Check the file's
size and modified time first — if you've handled this same path before in
the conversation, compare against what you saw last time. A zip that
hasn't changed size/timestamp since you last processed it has nothing new
in it; say so instead of reprocessing.

Extract to a scratch directory (not into the repo). Some zips place files
at repo-relative paths directly (`src/pages/index.astro`); others nest
everything under a `handoff/<patch-name>/` folder with its own `README.md`
explaining what changed and how to apply it. If a README is present, read
it — it's useful context, but verify its claims in step 3 rather than
trusting them outright.

### 2. Diff every file against the real repo

For each file in the zip, compare it to the matching path in the repo.
**Ignore line-ending noise** — this repo's tracked files are CRLF, but
zips from other tools are often plain LF, which makes every line show as
changed even when the content is identical:

```bash
diff --strip-trailing-cr -u "<repo>/<path>" "<extracted>/<path>"
```

Sort files into three buckets:
- **Identical** (content matches once line endings are normalized) — skip
  entirely, don't touch, don't mention as a change.
- **Differs** — a real content change. This is what you review in step 3.
- **New** — not in the repo at all yet.

Don't skip this step even under time pressure — in past rounds, roughly
half the files in a given zip turned out to be no-ops, and the ones that
did change were a small enough set to review individually.

### 3. Review each real change before applying

For every file in the "Differs" or "New" bucket, read the diff and ask:

- **Does it reference something that doesn't exist?** E.g. a component
  reads `service.valueStat` — check the corresponding data file actually
  defines that field before assuming the change is safe.
- **Does it ship a non-functional placeholder in place of something that
  currently works?** A form endpoint like `YOUR_FORM_ID`, an API key
  placeholder, a `TODO` left in the critical path — these are fine to
  apply (the alternative is not shipping other real fixes bundled in the
  same patch), but they must be called out loudly to the user, both in
  your summary and in the commit message, as a required manual follow-up.
  Don't bury this in a wall of text.
- **Does it quietly undo something the user deliberately asked for?**
  Check recent git log / commit messages for content the patch is
  overwriting. A generic-sounding rewrite of a bio, name, or detail that
  was added in a commit with a message like "Add founder bio" or "Credit
  X by name" is a signal to flag explicitly, not silently accept.
- **Does it rely on a technique that doesn't actually do what it claims?**
  The one that's bitten this project before: an SVG meant to be
  recolored via CSS (`fill="currentColor"`) referenced through
  `<img src="logo.svg">`. This does not work — an `<img>`-loaded SVG is
  an opaque resource and cannot inherit page CSS or `currentColor` from
  its embedding document. If a patch does this, don't apply it as-is:
  inline the SVG markup directly into the `.astro`/`.jsx` component
  instead (same `fill="currentColor"` attribute now works, because
  inline SVG participates in the page's CSS cascade). Verify the fix
  worked in step 5 rather than assuming — this exact assumption failed
  silently once already.

If a change is large in scope (e.g. a full page redesign, a site-wide
visual change like a banner shown on every page, or anything that removes
working functionality without a clear replacement), summarize the scope to
the user in plain terms before applying — not because you need permission
for routine pushes, but because "what's actually in this batch" is
information the user can't get any other way, and a big unannounced visual
change to a live site is the kind of thing worth a heads-up even under a
"don't ask, just deploy" standing instruction. Small, well-scoped fixes
(copy tweaks, a component bugfix, an asset swap) don't need this — just
apply them.

### 4. Apply

Write each approved file into the repo, matching the **target file's
existing line-ending convention**, not the zip's. For this repo (CRLF):

```bash
sed 's/\r$//' "<extracted>/<path>" | sed 's/$/\r/' > "<repo>/<path>"
```

For binary/asset files (images, SVGs used as external assets rather than
inlined), a plain copy is fine — line endings don't apply.

If you changed something to fix a bug the patch itself had (like the
`currentColor`/`<img>` case), the file you write is your corrected
version, not a verbatim copy of the zip's — the zip is a starting point,
not a spec.

### 5. Verify before shipping

Run the project's build (`npm run build`; run `npm install` first if
`node_modules` is missing) and confirm it completes without errors.

If the change is visible in the UI, start the dev server via the
`astro-dev` preview config (`.claude/launch.json`) and check it for real
rather than trusting the diff. In this environment the browser
`screenshot`/`zoom` tools have been unreliable (they time out), so prefer
DOM- and computed-style checks via `javascript_tool` — e.g. confirm an
element's `getComputedStyle(...).fill` or `.color` actually matches what
the patch intended, confirm a redirect page's `location.href` after
navigating, confirm a form's `action` attribute — over relying on a
visual screenshot. If screenshots do work in a given session, use them
too; just don't treat their absence as a blocker.

Stop the preview server once you're done checking.

### 6. Commit and push

Stage only the files you actually changed (not the whole extracted zip,
and not unrelated files sitting in the working tree). Write a commit
message that's a real changelog: what changed, and — in its own clearly
visible line — any manual follow-up the user must still do (a real API
endpoint to paste in, an account to sign up for, content to reconsider).
Then push straight to `origin main`. Per this user's standing preference,
don't stop to ask for confirmation first — verifying in steps 3 and 5 is
what earns that trust, not a confirmation prompt at the end.

Pushing to `main` triggers this repo's GitHub Actions workflow
automatically — that *is* the deploy step. There's nothing further to do
once the push succeeds.

### 7. Report back

Tell the user, concisely:
- What was applied (real changes only — no need to list the no-op files
  individually, just note how many were skipped as identical).
- Any bug you caught and fixed in the patch itself, and why the original
  wouldn't have worked.
- Any required manual follow-up, stated plainly and first — this is the
  part most likely to get missed if it's buried at the end of a long
  summary.
