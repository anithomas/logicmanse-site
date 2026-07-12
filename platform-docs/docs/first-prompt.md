# First Prompt for Claude Code — paste this to start

Read CLAUDE.md and docs/bookkeeping-master-document.md fully before writing anything.

Scaffold Phase 1 ONLY (security foundation). Do not build any product features yet.

Deliverables for this session:

1. **Project scaffold**: Vite + TypeScript + React SPA, pnpm, Tailwind. Three route trees with placeholder pages: `/` (marketing shell — we will adapt brochure.html into it later), `/app` (tenant shell behind auth), `/office` (consultant shell behind auth + role check).

2. **Firebase setup**: initialize project config for Auth, Firestore, Storage, Functions. Region must be northamerica-northeast1 or northamerica-northeast2. Client config in env vars; no secrets in the bundle beyond the standard public Firebase web config.

3. **Claims Cloud Function**: an admin-only callable function `setUserClaims({ uid, tenantId, role })` that only an existing consultant (or the initial bootstrap admin, documented) can invoke. Roles: "owner" | "staff" | "consultant".

4. **Firestore security rules**: implement the pattern in master document §B3 including the mandatory refinements — `config`, `auditLog`, `filings` consultant-write-only / tenant-read-only; `backoffice/**` consultant-only. Write rules tests with @firebase/rules-unit-testing covering:
   - tenant A cannot read/write tenant B (both directions)
   - tenant cannot write own config / auditLog / filings
   - consultant can read both tenants and write to backoffice
   - unauthenticated access rejected everywhere

5. **Deploy pipeline**: GitHub Actions workflow — on push to main: install, test (rules tests must pass), build, deploy to GitHub Pages with a CNAME file for logicmanse.ca. Assume the repo is private; deploy compiled output only.

6. **README**: setup steps, how to run rules tests locally with the emulator, how to bootstrap the first consultant account, and the Phase 1 manual verification checklist from CLAUDE.md.

Constraints: follow every hard security rule in CLAUDE.md. No feature code, no OCR, no pricing UI. Stop after Phase 1 and print the manual verification checklist for me to run.
