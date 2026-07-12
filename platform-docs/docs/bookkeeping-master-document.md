# logicmanse.ca — Master Document (v4, Consolidated)
*logicmanse's flagship service: multi-tenant bookkeeping — clients capture, logicmanse runs the books*
*Deployed at the main domain logicmanse.ca (marketing homepage + /app + /office)*
*Supersedes: master-spec v1/v2, db-features-reports, tradespeople-niche-spec, pricing-capacity-mvp1*

---

# PART A — BUSINESS

## A1. Business Model
Two-sided platform:
- **Client app (tenant-facing):** small business owners (trades, stores, service businesses) capture receipts, log income, see simple dashboards. Deliberately minimal — three core actions.
- **Back office (logicmanse-facing):** consultant reviews queues across all tenants, corrects categorization, manages CRA compliance, generates filing packages. This is the bookkeeping service delivery console.

Revenue: monthly bookkeeping service fee per tenant. The app is the delivery vehicle, not the product.

## A2. Why Tenants Want This
- Their name and logo on it — feels like their system, not rented software
- Three-action simplicity — no accounting knowledge needed
- A human behind it — "we caught this before your HST deadline" is the retention driver software-only products can't match
- One monthly fee replaces software subscription + bookkeeper + tax-season panic

## A3. Pricing — Statistically Derived (flat monthly, CAD — not per-transaction; trades/stores have seasonal swings)

**Methodology:** tiers are a function of the Canadian market distribution for entry/basic-tier flat-rate monthly bookkeeping. Sample (n=14, published 2026 pricing across 8+ Canadian providers): 200, 250, 299, 300, 300, 300, 350, 350, 400, 425, 450, 500, 500, 500 → **μ ≈ $366/mo, σ ≈ $98/mo**. Tier function: `price(k) = μ − kσ`.

Prices snap to a $50 lattice. Entry tier is deliberately set below the statistical floor as an **acquisition tier** — its job is volume, with upgrades designed into the feature limits:

| Tier | SD anchor | Price/mo | Market position |
|---|---|---|---|
| **Starter** | ≈ μ − 2.7σ | **$100** | Below effectively the entire human-reviewed market — acquisition price |
| **Compliance** | ≈ μ − 1.7σ | **$200** | Below ~95% of basic-tier providers |
| **Full Books** | vs. standard band | **$350** | 30–50% undercut vs. $500–$1,200 standard-tier market for this scope |

### Feature Matrix & Purchase Psychology (why each tier gets bought)

| | Starter $100 | Compliance $200 | Full Books $350 |
|---|---|---|---|
| **Buyer's problem** | "Receipts are a shoebox mess and tax season is panic" | "I don't want to think about HST deadlines, ever" | "I have subs/vehicles/equipment and CRA complexity scares me" |
| **Purchase trigger** | Price is impulse-level; less than a phone bill for a human reviewing your books | First HST deadline stress, or first Starter month hitting the receipt cap | First subcontractor hired, CRA letter received, or year-end accountant bill shock |
| Receipt capture + human categorization review | ✔ (cap: 50 receipts/mo) | ✔ unlimited | ✔ unlimited |
| Monthly summary + month view | ✔ | ✔ | ✔ |
| HST set-aside tracking (estimate only) | ✔ | ✔ | ✔ |
| HST filing prep + filing calendar | — | ✔ | ✔ |
| Job costing OR daily sales module | — | ✔ (one) | ✔ (all modules) |
| Quarterly check-in call | — | ✔ | ✔ |
| T5018 + WSIB clearance tracking | — | — | ✔ |
| Vehicle mileage + CCA handling | — | — | ✔ |
| Year-end accountant package (PDF bundle) | — | — | ✔ |
| Priority support | — | — | ✔ |

**Upgrade mechanics built into Starter:** the 50-receipt cap and estimate-only HST are the two natural friction points; when hit, the app shows "your consultant can handle this — upgrade to Compliance," not a paywall error. Starter must feel generous, never crippled — the human review is included even at $100, because that's the differentiator no software competitor matches.

### Pricing Is a Back-Office Function (never hardcoded)
Prices, tier names, feature flags, and receipt caps live in Firestore, editable only by the consultant role:
```
backoffice/plans/{planId}
      name, priceMonthly, features: { hstFiling, jobCosting, dailySales,
        t5018Wsib, mileageCca, yearEndPackage, prioritySupport }: booleans
      receiptCapMonthly: number | null
      active: boolean
tenants/{tenantId}/config → planId: string, priceOverride?: number   // pilot discounts, grandfathering
```
Tenant app reads plan features at runtime; changing a price or running a promo is a back-office edit, not a deploy. Only `role == "consultant"` can write to `backoffice/plans`.

- Sales narrative: "$100 gets you a human reviewing your books every month — nobody else in Canada offers that under $200"
- Infra cost floor ~$6–16/tenant/month (OCR is the only meaningful per-unit cost) → 90%+ margin at every tier; real cost is consultant review time — measure minutes-per-tenant from the first pilot
- $100 Starter is an acquisition tier, accepted trade-off: below-market pricing can attract churn-prone bargain hunters — mitigated by the receipt cap and built-in upgrade friction; monitor Starter→Compliance conversion rate in the pilot, and if Starter fills with non-upgraders, raise it (a back-office edit, not a deploy)

**Audit additions (pricing pass):**
- **One-time onboarding fee: $250** (waivable as a promo lever) — every tenant arrives with backlog; the market charges $500–$3,000 for catch-up, and absorbing it silently destroys Starter margin
- **All prices displayed "+HST"** — logicmanse must charge 13% once past the $30K small-supplier threshold; advertise tax-exclusive from day one
- **Payment rails: pre-authorized debit (PAD) preferred (~1%) over card (~3%)** for recurring fees. Note: logicmanse *collecting* its own fees does not violate the no-financial-integration guardrail — that guardrail bars any access to *tenants'* accounts, which remains absolute
- **Dunning:** failed payment → 7-day grace with reminder → read-only mode (tenant keeps their data, capture pauses) — never delete a delinquent tenant's records

**Audit additions (marketing pass):**
- **Customer-language tier names** (stored in plans config, A/B-testable from back office): Starter → **"Shoebox"** ("your receipt mess, handled"), Compliance → **"Never Miss a Deadline"**, Full Books → **"CRA-Proof"**
- **Delivery guarantee:** "Monthly summary by the 10th, or that month is free" — the trust signal a $100 price point needs; costs nothing when operations are sound
- **Referral loop:** one month free per referred tenant who stays 3+ months — trades refer trades; cheapest acquisition channel available
- **Tier display:** middle tier badged "Most popular" and visually featured — it's the intended landing spot for upgraders

**Sales brochure (`brochure.html`) — core messaging locked:**
- Headline: "Snap a photo. We do your books." — outcome, not features
- Pain hook: shoebox of receipts, HST due "sometime soon, probably," April untangling fees
- Four trust pillars: Ontario-built (HST/WSIB/T5018), human review on every plan, **"Your bank stays yours — we never connect to your bank account, ever"** (the security guardrail as a selling point), job-level profitability
- Pricing rendered as literal receipts (memorable, on-theme); $250 setup and referral offer stated plainly in the closing CTA; all prices shown +HST
- CTA: free 15-minute call — low-commitment, fits how trades buy (conversation, not checkout)
- Re-run the μ/σ calculation annually against fresh market data; reprice if the market shifts more than 0.5σ
- Pilot: first 2–3 tenants at ~50% for 3 months for feedback + testimonial
- Annual prepay (2 months free) once proven

## A4. Market Context (GTA)
Anchor pricing against full-service GTA bookkeepers ($200–400+/mo) and generic software (QuickBooks+Dext, $60–100/mo, owner still does the work). Differentiation: Ontario-specific compliance (WSIB, 13% HST, Construction Act holdback awareness, T5018) that US-built generic tools miss. First distribution channels: trade associations (OGCA, union chapters), GTA trade/small-business community groups. Talk to 3–5 real GTA business owners before building past MVP1.

## A5. Before First Paying Tenant (legal/insurance — do during pilot)
- Engagement letter / service agreement (get legal review — professional liability)
- E&O insurance check for bookkeeping services
- Confirm logicmanse corporate structure covers this service line

---

# PART B — ARCHITECTURE

## B1. Stack
- **Frontend:** TypeScript + React + Vite — single SPA, role-based routing (tenant view vs. back office)
- **Styling:** Tailwind CSS, tenant-themeable at runtime from config
- **Hosting:** GitHub Pages (static, tracker pattern) serving the **main domain logicmanse.ca** — this is now the primary logicmanse service, not a subdomain. Site structure, one repo/one SPA:
  - `logicmanse.ca/` → marketing homepage (brochure content — headline service: bookkeeping)
  - `logicmanse.ca/app` → tenant app (auth-gated)
  - `logicmanse.ca/office` → back-office console (consultant role only)
  - DNS (GoDaddy): apex A records → GitHub Pages IPs, `www` CNAME → GitHub Pages; `tracker.logicmanse.ca` remains untouched on its existing Netlify setup
- No Netlify for this project.
- **Backend:** Firebase — Auth, Firestore, Storage (receipt images), Cloud Functions (role assignment, OCR proxy, scheduled jobs)
- **OCR:** Veryfi or Tabscanner via Cloud Function proxy — run a 20-receipt bake-off on real Ontario receipts (Costco, Home Depot, gas stations) before committing
- **Package manager:** pnpm

**Cloud Functions are required, not optional:** GitHub Pages is static; custom auth claims (tenantId, role) MUST be set server-side or any user could self-promote to admin, and the OCR API key must never reach the browser.

## B2. Firebase Capacity & Cost (answered: yes, easily)
Load model — 50 tenants × ~200 tx + ~100 receipt photos/month:
| Resource | Monthly load | Verdict |
|---|---|---|
| Writes | ~30K ops | Trivial |
| Reads | ~300–500K ops | Trivial |
| Storage | ~2.5 GB/mo growth | ~$1/mo year one |
| Functions | OCR proxy + claims + scheduled | Trivial |

Firestore scales orders of magnitude beyond this. Constraints:
1. **Blaze plan required day one** (outbound calls from Functions don't run on Spark). Billing alert at $25/mo; expected spend at 10 tenants < $10/mo.
2. **OCR ≈ $0.05–0.15/receipt** — the only line item that matters.

## B3. Security Architecture (non-negotiable)
- No bank/brokerage/payment integrations of any kind, for any tenant, ever
- No secrets in repo or client bundle — OCR keys in Cloud Function config only
- Custom claims: `{ tenantId: string, role: "owner" | "staff" | "consultant" }` — set ONLY via admin Cloud Function
- Tenant data fully isolated under `tenants/{tenantId}/`; consultant role reads across tenants, writes limited to review/correction + backoffice collections
- Receipt images: `tenants/{tenantId}/receipts/` in Storage with matching rules
- No PII in URL params; no third-party analytics with PII
- Audit trail: every consultant edit writes an audit log entry (who/what/when/before/after) — tenant-readable, tenant-unwritable; professional-liability protection

**Audit additions (security pass):**
- **EXIF/GPS stripping:** receipt photos carry location metadata — strip EXIF in the Cloud Function before Storage write (a receipt snapped at a client's home must not reveal that address)
- **Data residency:** pin Firestore/Storage to a Canadian region (northamerica-northeast1/2) at project creation — cannot be changed later
- **PIPEDA:** receipts sent to a third-party OCR vendor = personal data to a third party; disclose in the tenant service agreement, review the vendor's data-retention terms before the bake-off
- **Repo privacy:** GitHub Pages on the free plan requires a public repo (codebase exposed) — use a private source repo with paid-plan Pages, or deploy only the compiled bundle to a separate public repo
- **Backups:** scheduled Firestore exports (weekly minimum) to a locked Storage bucket — you are custodian of other businesses' books
- **Consultant auth:** MFA mandatory; email verification required for all tenant accounts

### Firestore Rules (core pattern)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isTenantMember(tenantId) {
      return request.auth != null && request.auth.token.tenantId == tenantId;
    }
    function isConsultant() {
      return request.auth != null && request.auth.token.role == "consultant";
    }
    match /tenants/{tenantId}/{document=**} {
      allow read: if isTenantMember(tenantId) || isConsultant();
      allow write: if isTenantMember(tenantId) || isConsultant();
    }
    match /backoffice/{document=**} {
      allow read, write: if isConsultant();
    }
  }
}
```
Refine per-collection during build. **Mandatory refinements (audit findings):** `config` (contains planId/priceOverride — tenant-writable config would allow self-upgrade), `auditLog`, and `filings` are consultant-write-only; tenants read-only. Receipt caps and plan feature gates enforced server-side (Cloud Function), never client-side only. Consultant account requires MFA (single point of failure across all tenants).

## B4. Firestore Schema
```
tenants/{tenantId}
  └─ config      // §B5 — white-label + modules
  └─ profile     // businessName, businessType, fiscalYearStart, hstNumber?, hstFilingFrequency

tenants/{tenantId}/transactions/{txId}
      date, vendor, category, type ("income"|"expense"), amount, hstIncluded
      jobId?, costType? ("labour"|"materials"|"subcontractor"|"overhead")   // jobCosting module
      receiptImageUrl?, ocrConfidence?
      verificationStatus: "auto-verified" | "pending-review" | "consultant-reviewed" | "manual"
      notes?, createdAt, updatedAt, createdBy

tenants/{tenantId}/jobs/{jobId}            // jobName, clientName, address, status, estimatedCost?, dates
tenants/{tenantId}/subcontractors/{subId}  // name, businessNumber?, wsibClearanceNumber?, wsibClearanceExpiry?, totalPaidYTD
tenants/{tenantId}/vehicles/{vehicleId}    // nickname, mileageLog[{date, kmDriven, jobId?, purpose}]
tenants/{tenantId}/recurringTemplates/{id} // vendor, category, type, amount, hstIncluded, frequency, dayOfMonth, active
tenants/{tenantId}/categories/{id}         // name, craMapping?, archived — seeded per businessType
tenants/{tenantId}/auditLog/{entryId}
tenants/{tenantId}/filings/{filingId}      // CRA module output

backoffice/tenantsIndex/{tenantId}         // status, plan, next filing due, open review count
backoffice/tasks/{taskId}                  // consultant workflow queue
backoffice/plans/{planId}                  // pricing/feature config — see §A3; consultant-writable only
```
Default category seed: Sales/Revenue, Supplies, Software & Subscriptions, Professional Fees, Travel, Meals & Entertainment (50% deductible flag), Rent & Utilities, Insurance, Advertising, Other.

## B5. Tenant Config (white-label; consultant-set)
```
tenants/{tenantId}/config
      branding: { logoUrl, businessDisplayName, primaryColor, accentColor }
      modules: { jobCosting, subcontractors, mileage, dailySales, recurring }   // booleans
      categorySet: "trades" | "retail" | "service" | "custom"
      locale: { currency: "CAD", taxLabel: "HST", taxRate: 0.13 }
      reviewPolicy: { autoPostThreshold: 0.90, alwaysReviewAbove: number? }     // force review on large amounts (rec: $1,000+)
```
One codebase; every tenant sees their own brand at runtime.

---

# PART C — PRODUCT

## C1. Tenant App — Three Core Actions
1. **Snap a receipt** → OCR → all key fields (vendor/date/amount/tax) ≥ threshold → auto-post `auto-verified`; else `pending-review` (consultant queue, not tenant burden)
2. **Log income** → quick-entry (or daily sales close-out for store tenants)
3. **See my month** → income, expenses, HST set-aside estimate, one simple chart

Everything else hidden from tenants. Optional per-tenant: job prompt at receipt capture (trades).

## C2. Receipt Pipeline
Photo → Cloud Function → OCR API → confidence routing → Firestore + Storage. Every image retained and linked to its transaction (CRA electronic recordkeeping). Weekly "unlinked receipts" nudge.

## C3. Back Office Console (logicmanse)
- Tenant list with health indicators: open review count, unlinked receipts, days to next filing
- Cross-tenant review queue (single flow through all pending-review items)
- Per-tenant drill-down: ledger, reports, config editor, audit log
- Onboarding wizard: create tenant → set config/branding/modules → invite owner (triggers claims Function)

## C4. CRA Tax Module (consultant-operated)
- **HST filing prep:** per-tenant period tracking (monthly/quarterly/annual per CRA election); collected vs. ITCs vs. net owing; flags un-designated transactions before period close
- **T5018 prep:** subcontractor YTD totals, $500 threshold flags, year-end summary
- **Meals & Entertainment:** 50% deductibility auto-split in P&L
- **CCA flagging:** equipment/tool purchases flagged capital vs. expense
- **Filing packages:** period close generates `filings/{filingId}` + PDF bundle (P&L, HST summary, transaction log, receipt index) — the deliverable to tenant's accountant
- **Filing calendar:** dashboard of every tenant's next due date — a bookkeeping service must never miss a deadline

## C5. Reports
P&L (monthly/quarterly/annual) · HST Remittance · Job Profitability (per job + portfolio) · T5018 Summary · WSIB Compliance (expired/missing clearances) · Vehicle Expense (km, business-use %, costs) · Year-End Package (bundled PDF)

**Out of scope permanently:** bank feed sync, invoicing/AR, automated fund movement.

---

# PART D — EXECUTION

## D1. MVP1 — Smallest Sellable Version
**In:**
- Security foundation: claims Cloud Function, tenant-isolated rules, two-tenant isolation test — never deferred
- Tenant app: manual quick-entry (income + expense), photo attach (stored, NOT OCR'd), simple month view
- Back office: tenant list, per-tenant ledger, edit/categorize, CSV export
- Branding: logo + business name only
- GitHub Pages deploy via Actions

**Deferred to MVP2+:** OCR pipeline, HST filing module, job costing, T5018/WSIB, mileage, PDF packages, recurring templates, audit-log viewer (the log itself writes from day one).

**Why photo-without-OCR first:** de-risks the biggest unknown — hand-process a few weeks of real receipts in the back office and learn exactly which fields/merchants matter before paying for an OCR vendor.

**MVP1 exit criteria (all must be true):**
1. Two-tenant isolation verified manually in both directions
2. One real pilot tenant entering data 2+ consecutive weeks unprompted
3. One real monthly summary produced from the back office
4. Time-per-tenant measured (drives pricing validation)

## D2. Build Phases (post-MVP1, iterative)
1. **Foundation** *(= MVP1 core)*: repo, Pages pipeline, Firebase project, claims Function, rules, config loader
2. **Tenant MVP** *(= MVP1)*: three core actions manual, themed UI
3. **Back office core**: review queue, onboarding wizard
4. **Receipt OCR**: Function proxy, confidence routing, Storage wiring
5. **CRA module**: HST prep, filing packages, calendar
6. **Niche modules**: job costing, subcontractors/T5018/WSIB, mileage, daily sales
7. **Polish**: audit-log UI, recurring, PDF generation, exports

## D3. Claude Code Handoff
**Artifacts to import (place in repo root or /docs):**
1. `bookkeeping-master-document.md` — this file; single source of truth
2. `CLAUDE.md` — project instructions Claude Code reads automatically every session
3. `first-prompt.md` — the exact Phase 1 kickoff prompt
4. `brochure.html` — becomes the homepage at `/` (adapt into the SPA or serve as static index)
5. `ledger-app.jsx` — tenant UI feel reference only, not final code

First prompt scope: scaffold Phase 1 exactly — Vite + TS project with three route trees (`/`, `/app`, `/office`), GitHub Actions deploy to Pages with custom-domain CNAME file, Firebase init (Canadian region), claims Cloud Function, rules from §B3. **Build no features until the security foundation passes the manual test: two test tenants, complete isolation verified both directions, plus tenant write attempts to own config/auditLog/filings all rejected.**

## D4. Open Decisions
- OCR vendor (bake-off in Phase 4, not before)
- Tenant "staff" role (employee snaps receipts, can't see financials) — v1 or later
- Tier limits (receipt caps) — set from pilot time-tracking data, not guesses
