# CLAUDE.md — logicmanse.ca Bookkeeping Platform

## What this project is
Multi-tenant bookkeeping platform at logicmanse.ca. Tenants (Ontario trades/small shops) snap receipts and log income; the logicmanse back office (consultant role) reviews, categorizes, and handles CRA compliance. Full spec: `docs/bookkeeping-master-document.md` — it is the single source of truth. When in doubt, follow the master document.

## Stack (do not deviate)
- TypeScript + React + Vite, single SPA with three route trees: `/` (marketing), `/app` (tenant, auth-gated), `/office` (consultant only)
- Tailwind CSS; tenant theming loaded at runtime from Firestore config
- Firebase: Auth, Firestore, Storage, Cloud Functions — region northamerica-northeast1 or -northeast2 (Canadian residency, mandatory)
- Hosting: GitHub Pages via GitHub Actions; custom domain logicmanse.ca (CNAME file in build output). No Netlify. No other hosts.
- Package manager: pnpm (functions may use npm if required by Firebase tooling)

## Hard security rules (never violate, never "temporarily" relax)
1. NO bank, brokerage, or payment-platform integrations touching tenant accounts — ever. Data enters via manual entry, photo, or CSV only.
2. NO secrets in the repo or client bundle. OCR keys and admin credentials live in Cloud Function config / environment only. `.env` is gitignored.
3. Custom auth claims (`tenantId`, `role`) are set ONLY by the admin Cloud Function — never client-side.
4. Firestore rules: tenants read/write only their own `tenants/{tenantId}/` tree; EXCEPTIONS that are consultant-write-only, tenant-read-only: `config`, `auditLog`, `filings`. `backoffice/**` is consultant-only.
5. Plan feature gates and receipt caps are enforced server-side. Client-side checks are UX sugar, not security.
6. Strip EXIF/GPS from receipt images in the Cloud Function before Storage write.
7. Every consultant edit to tenant data writes an auditLog entry (who/what/when/before/after).
8. Never hard-delete tenant financial records — soft-delete/archive only. Dunning = read-only mode, never data loss.
9. Consultant accounts require MFA. Tenant accounts require email verification.
10. No PII in URL parameters or query strings. No third-party analytics receiving PII.

## Definition of done for Phase 1 (before ANY feature work)
- Two test tenants created; complete data isolation verified in both directions
- Tenant write attempts to own `config`, `auditLog`, `filings` all rejected by rules
- Tenant read attempt on another tenant's tree rejected; consultant read on both succeeds
- Deploy pipeline green: push to main → build → GitHub Pages at custom domain

## Conventions
- Firestore schema, plans collection, and pricing model are defined in the master document §B4/§A3 — implement them exactly; pricing values are data (backoffice/plans), never constants in code
- Commit style: conventional commits (feat:, fix:, chore:, docs:)
- Every Cloud Function gets input validation and explicit error responses; no silent failures
- Tests: rules tests via @firebase/rules-unit-testing are required for every rules change
