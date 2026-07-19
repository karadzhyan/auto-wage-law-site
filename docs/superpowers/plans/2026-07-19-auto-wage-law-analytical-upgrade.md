# Auto Wage Law Analytical Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing polished but shallow static site into a coherent, primary-authority-grounded analytical product whose content, tools, evidence model, and visual structure all follow the same six-stage method.

**Architecture:** Keep Astro static output and direct Markdown ownership. Add small typed registries for authorities, analysis stages, evidence, and reviewed constants; pure tested domain functions for each tool; and focused Astro components for ledgers, matrices, and article scaffolding. Never use a generic legal-content generator or infer a legal conclusion from incomplete inputs.

**Tech Stack:** Astro 7, TypeScript 6, Node 24 test runner, scoped/global CSS, Markdown content, official primary-source URLs.

## Global Constraints

- Current-law cutoff is July 18, 2026.
- Keep federal and California routes separate.
- Use “source checked,” not anonymous “reviewed” or “high confidence.”
- Hour differences are “hours to classify and reconcile,” never automatically unpaid hours.
- Low/base/high scenario values are entered sensitivities, not probabilities.
- No compliance, liability, risk, claim-value, or recovery score.
- No React, Tailwind, CMS, database, analytics, tracking, cookies, storage, or network submission.
- Preserve true white `#ffffff`, ink `#10243e`, cobalt `#2457ff`, coral `#f05a47`, sharp ruled ledger geometry, Archivo/Source Sans 3/IBM Plex Mono, and 0–3px radii.
- Every changed behavior follows RED → GREEN → REFACTOR.
- Existing custom domains remain untouched during this release.

---

## File ownership map

### Domain data

- Create `src/data/authorities.ts`: official authority registry and lookup helpers.
- Create `src/data/analysis.ts`: six stages, role crosswalk, and route metadata.
- Create `src/data/evidence.ts`: evidence domains and record packets.
- Modify `src/data/site.ts`: source-checked constants with formulas and effective dates.

### Pure tool logic

- Replace `src/lib/tools/pay-plan-check.ts` with `src/lib/tools/pay-system-analyzer.ts`.
- Replace `src/lib/tools/exposure.ts` with `src/lib/tools/wage-scenario.ts`.
- Create `src/lib/tools/commission-ledger.ts`.
- Keep compatibility re-exports only where an old test or route needs them during migration.

### UI and routes

- Create `src/components/AnalysisSequence.astro`, `RoleIssueCrosswalk.astro`, `EvidenceMap.astro`, `AuthorityStack.astro`, and `SourceCheck.astro`.
- Create `src/components/tools/PaySystemAnalyzer.astro`, `WageScenarioLab.astro`, and `CommissionLedger.astro`.
- Create `src/scripts/pay-system-analyzer.ts`, `wage-scenario-lab.ts`, and `commission-ledger.ts`.
- Create `src/pages/analysis-map.astro`, `records.astro`, `authorities.astro`, and the three canonical tool pages.
- Convert old tool pages to redirects.
- Modify homepage, navigation, tools index, dealer/worker paths, article layout, and change log.

### Content

- Modify `src/content.config.ts` for question, stage, jurisdictions, source-check metadata, authority IDs, and evidence domains.
- Rewrite all thirteen Markdown guides in place; do not create a parallel generated corpus.

### Tests

- Create `tests/authorities.test.ts`, `analysis-data.test.ts`, `pay-system-analyzer.test.ts`, `wage-scenario.test.ts`, `commission-ledger.test.ts`, `content-depth.test.mjs`, and `privacy.test.mjs`.
- Modify route/link tests for canonical routes and redirects.

---

### Task 1: Authority registry, constants, analysis stages, and evidence model

**Files:**

- Create: `tests/authorities.test.ts`
- Create: `tests/analysis-data.test.ts`
- Create: `src/data/authorities.ts`
- Create: `src/data/analysis.ts`
- Create: `src/data/evidence.ts`
- Modify: `src/data/site.ts`

**Interfaces:**

- Produces `getAuthority(id: AuthorityId): Authority`, `getAuthorities(ids: AuthorityId[]): Authority[]`, `analysisStages`, `roleCrosswalk`, `evidenceDomains`, and formula-backed `legalConstants`.
- Later tasks consume authority IDs and never hard-code duplicate URLs.

- [ ] **Step 1: Write failing registry and constant tests**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { authorities, getAuthority } from '../src/data/authorities.ts';
import { legalConstants } from '../src/data/site.ts';

test('authority ids are unique and official https sources', () => {
  assert.equal(new Set(authorities.map((a) => a.id)).size, authorities.length);
  for (const authority of authorities) {
    assert.match(authority.url, /^https:\/\//);
    assert.ok(['statute', 'regulation', 'wage-order', 'case', 'agency-guidance'].includes(authority.sourceType));
    assert.ok(authority.proposition.length > 30);
  }
});

test('2026 California derived thresholds disclose formulas', () => {
  assert.equal(legalConstants.californiaMinimumWage.value, 16.9);
  assert.equal(legalConstants.californiaCommissionThreshold.value, 25.35);
  assert.equal(legalConstants.californiaHandToolThreshold.value, 33.8);
  assert.equal(legalConstants.californiaSalaryThreshold.value, 70304);
});
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/authorities.test.ts tests/analysis-data.test.ts`

Expected: FAIL because the new modules do not exist.

- [ ] **Step 3: Implement typed registries**

Create exact typed objects for official statutes, wage orders, regulations, cases, and agency guidance named in the specification. Every object includes `id`, `shortLabel`, `title`, `jurisdiction`, `sourceType`, `url`, `proposition`, `limits`, optional `pinpoint`, `checked: '2026-07-18'`, and an optional status note. Add six ordered analysis stages and five role crosswalk rows.

- [ ] **Step 4: Run GREEN and full test suite**

Run: `node --test tests/authorities.test.ts tests/analysis-data.test.ts && npm test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data tests/authorities.test.ts tests/analysis-data.test.ts
git commit -m "feat: establish authority and analysis model"
```

### Task 2: Pay System Analyzer domain model

**Files:**

- Create: `tests/pay-system-analyzer.test.ts`
- Create: `src/lib/tools/pay-system-analyzer.ts`
- Modify: `src/lib/tools/pay-plan-check.ts` only for a temporary compatibility export, then remove after route migration.

**Interfaces:**

```ts
export type AnalyzerInput = {
  jurisdiction: 'california-federal';
  establishment: 'dealer-connected' | 'standalone-repair' | 'other' | 'unknown';
  role: 'technician' | 'sales' | 'advisor' | 'finance' | 'parts' | 'support';
  primaryPayMethod: 'hourly' | 'salary' | 'piece-rate' | 'commission' | 'mixed';
  secondaryPayMethod: 'none' | 'hourly' | 'piece-rate' | 'commission' | 'bonus';
  workedHours: number;
  accountedHours: number;
  pieceWorkOccurred: boolean;
  restCompensation: 'shown' | 'not-shown' | 'unknown' | 'not-applicable';
  nonproductiveCompensation: 'shown' | 'not-shown' | 'unknown' | 'not-applicable';
  signedCommissionPlan: 'yes' | 'no' | 'unknown' | 'not-applicable';
  formulaAvailable: boolean;
  timeRecordComplete: boolean;
  productionRecordAvailable: boolean;
  claimedOvertimeRoute: 'none' | '13b10' | '7i' | 'eap' | 'unknown';
};

export function analyzePaySystem(input: AnalyzerInput): AnalyzerResult;
```

- [ ] **Step 1: Write failing branch tests**

Cover validation, reconciliation wording, no piece-rate warning for ordinary hourly input, section 226.2 findings when piece work occurred, section 2751 only for commissions, Wage Order 7/9 establishment routing, service-advisor federal route kept separate, section 7(i) evidence predicates, and never returning `compliant`, `violation`, `unpaid`, or `risk score`.

- [ ] **Step 2: Run RED**

Run: `node --test tests/pay-system-analyzer.test.ts`

Expected: FAIL because `analyzePaySystem` does not exist.

- [ ] **Step 3: Implement minimal branch engine**

Implement pure validation and deterministic `Finding[]`. Findings contain `dimension`, `status`, `title`, `enteredFact`, `basis`, `whyItMatters`, `proofToPull`, `authorityIds`, and `limits`. Use authority IDs from Task 1.

- [ ] **Step 4: Run GREEN, refactor repeated finding builders, and run all tests**

Run: `node --test tests/pay-system-analyzer.test.ts && npm test`

Expected: PASS with no warnings.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools tests/pay-system-analyzer.test.ts
git commit -m "feat: add method-sensitive pay system analysis"
```

### Task 3: Wage Scenario Lab domain model

**Files:**

- Create: `tests/wage-scenario.test.ts`
- Create: `src/lib/tools/wage-scenario.ts`

**Interfaces:**

```ts
export type ScenarioInput = {
  employees: number;
  workweeks: number;
  gaps: { low: number; base: number; high: number };
  straightTimeRate: number;
  overtimeShare: number;
  overtimeIncrement: number;
  includeOvertime: boolean;
  premiumHoursPerWeek: number;
  premiumRate: number;
  includePremiumHours: boolean;
};

export function calculateWageScenarios(input: ScenarioInput): ScenarioResult;
```

- [ ] **Step 1: Write failing arithmetic, range, and boundary tests**

Tests assert low ≤ base ≤ high validation, percentage normalization, currency rounding, optional layers, exact formulas, immutable exclusions, zero inputs, and rejection of negative/nonfinite values.

- [ ] **Step 2: Run RED**

Run: `node --test tests/wage-scenario.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the decomposed model**

Return three rows, each with `straightTime`, `overtimeIncrement`, `premiumHours`, and `enteredTotal`; return formula labels and excluded categories. Do not expose `lookback`, `exposure`, `claimValue`, `probability`, or `confidence` fields.

- [ ] **Step 4: Run GREEN and the full suite**

Run: `node --test tests/wage-scenario.test.ts && npm test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/wage-scenario.ts tests/wage-scenario.test.ts
git commit -m "feat: add decomposed wage scenario model"
```

### Task 4: Commission & Draw Ledger domain model

**Files:**

- Create: `tests/commission-ledger.test.ts`
- Create: `src/lib/tools/commission-ledger.ts`

**Interfaces:**

```ts
export type LedgerTransaction = {
  id: string;
  eventLabel: string;
  eventDate: string;
  component: 'base-wage' | 'commission-credit' | 'draw' | 'debit' | 'other';
  planEvent: string;
  credit: number;
  debit: number;
  conditionText: string;
  conditionEvidence: string;
  originalStatementLine: string;
  debitStatementLine: string;
  reasonCode: string;
  acknowledgment: string;
};

export function reconcileLedger(transactions: LedgerTransaction[]): LedgerResult;
export function analyzeTransactionEvidence(transaction: LedgerTransaction): LedgerQuestion[];
```

- [ ] **Step 1: Write failing reconciliation and non-conclusion tests**

Test stable totals, selected transaction questions, missing-proof fields, negative-value rejection, no duplicate IDs, and absence of `lawful`, `valid`, `earned`, `liability`, or `exempt` determinations.

- [ ] **Step 2: Run RED**

Run: `node --test tests/commission-ledger.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement pure ledger helpers and seeded synthetic example**

Use four independent question dimensions: classification, earning event, payment timing, and debit/chargeback. Each points to missing/present proof and authority IDs without classifying legal validity.

- [ ] **Step 4: Run GREEN and all tests**

Run: `node --test tests/commission-ledger.test.ts && npm test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/commission-ledger.ts tests/commission-ledger.test.ts
git commit -m "feat: add commission transaction reconciliation"
```

### Task 5: Content schema and deep-guide quality gate

**Files:**

- Create: `tests/content-depth.test.mjs`
- Modify: `src/content.config.ts`
- Modify: all thirteen files under `src/content/articles/`

**Interfaces:**

Frontmatter adds `question`, `analysisStep`, `jurisdictions`, `sourceChecked`, `checkScope`, `nextCheck`, `authorityIds`, and `evidenceDomains`; removes forced `confidence: reviewed` and duplicate source URLs.

- [ ] **Step 1: Write a failing content contract test**

The test scans every Markdown guide and requires the new fields, valid authority IDs, official source-check date, and substantive headings: Question presented, Rule architecture or Decision sequence, Evidence map, Worked example, Strategic implications, Analysis limits, Primary authority. It rejects categorical banned phrases and requires at least 700 body words as a floor, while editorial targets remain 900–1,800.

- [ ] **Step 2: Run RED**

Run: `node --test tests/content-depth.test.mjs`

Expected: FAIL for all current micro-articles.

- [ ] **Step 3: Update schema and rewrite guides in coherent batches**

Batch A: five role guides. Batch B: exemptions, minimum wage, regular rate, rest/NPT. Batch C: meals/rest, off-clock, chargebacks, tools/expenses. Each guide applies the exact correction requirements in the design spec and uses registry authority IDs.

- [ ] **Step 4: Run GREEN and Astro validation**

Run: `node --test tests/content-depth.test.mjs && npx astro check`

Expected: PASS with zero diagnostics.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/articles tests/content-depth.test.mjs
git commit -m "content: rebuild dealership wage analysis library"
```

### Task 6: Shared analytical UI and core information architecture

**Files:**

- Create: `src/components/AnalysisSequence.astro`
- Create: `src/components/RoleIssueCrosswalk.astro`
- Create: `src/components/EvidenceMap.astro`
- Create: `src/components/AuthorityStack.astro`
- Create: `src/components/SourceCheck.astro`
- Create: `src/pages/analysis-map.astro`
- Create: `src/pages/records.astro`
- Create: `src/pages/authorities.astro`
- Modify: `src/pages/index.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/data/navigation.ts`, `src/styles/tokens.css`, `src/styles/global.css`

**Interfaces:**

Components consume Tasks 1 and 5 data directly and render semantic rows/tables/rails without duplicating domain rules.

- [ ] **Step 1: Add route/content assertions to the existing site tests and run RED**

Require the three canonical pages, five-item nav, exact homepage headline, six stages, role rows, no risk gauge/score, and source-check language.

- [ ] **Step 2: Implement tokens and shared components to match `analytical-home-v2.png`**

Rebuild the homepage opening and crosswalk first; capture a browser screenshot and correct first-viewport drift before implementing downstream pages.

- [ ] **Step 3: Implement analysis, records, and authority pages**

Use open ledgers, matrices, and filters; no card grid. Filters may be plain client-side controls with URL-free local state.

- [ ] **Step 4: Run Astro check, tests, and build**

Run: `npx astro check && npm test && npm run build`

Expected: zero diagnostics and successful static generation.

- [ ] **Step 5: Commit**

```bash
git add src/components src/pages src/data/navigation.ts src/styles tests
git commit -m "feat: build the analytical navigation system"
```

### Task 7: Interactive tool interfaces

**Files:**

- Create: `src/components/tools/PaySystemAnalyzer.astro`
- Create: `src/components/tools/WageScenarioLab.astro`
- Create: `src/components/tools/CommissionLedger.astro`
- Create: `src/scripts/pay-system-analyzer.ts`
- Create: `src/scripts/wage-scenario-lab.ts`
- Create: `src/scripts/commission-ledger.ts`
- Create: `src/pages/tools/pay-system-analyzer.astro`
- Create: `src/pages/tools/wage-scenario-lab.astro`
- Create: `src/pages/tools/commission-ledger.astro`
- Modify: `src/pages/tools/index.astro`
- Convert: old tool routes to redirect pages.

**Interfaces:**

Scripts bind semantic forms to the pure functions from Tasks 2–4. They perform no domain calculations independently.

- [ ] **Step 1: Add failing static-route/privacy assertions**

Require the three canonical tools, redirect metadata, exact titles, browser-local copy, no `fetch`, storage, analytics, or personal identifier fields.

- [ ] **Step 2: Implement Pay System Analyzer against its accepted concept**

Support validation, reset, multi-finding output, expand/collapse, authority links, focus transfer, print, and method-dependent field relevance.

- [ ] **Step 3: Implement Wage Scenario Lab against its accepted concept**

Support low/base/high rows, selected row, optional layers, formula ledger, included/excluded strip, reset, validation, and print.

- [ ] **Step 4: Implement Commission & Draw Ledger against its accepted concept**

Support filter, select/expand, add/edit synthetic transaction rows in memory, period reconciliation, proof questions, reset, and print. Do not persist data.

- [ ] **Step 5: Run full checks**

Run: `npm run check`

Expected: all tests pass, zero Astro diagnostics, build/link scan passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/tools src/scripts src/pages/tools tests
git commit -m "feat: ship analytical wage instruments"
```

### Task 8: Deep article layout and audience paths

**Files:**

- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/styles/article.css`
- Modify: `src/components/WorkdayTimeline.astro`
- Modify: `src/pages/dealers.astro`, `src/pages/workers.astro`, `src/pages/developments.astro`, `src/pages/about.astro`, `src/pages/law-library.astro`

- [ ] **Step 1: Add failing rendered-content assertions**

Require left analysis sequence/current stage, main question band, right evidence/authority rail, source-check block, dealer/worker strategic headings, and removal of anonymous “Editorial status Reviewed.”

- [ ] **Step 2: Implement the article frame against `deep-article-v2.png`**

Render the shared sequence, evidence domains, authority stack, source-check metadata, TOC, and article content. Preserve semantic Markdown and print readability.

- [ ] **Step 3: Rebuild dealer/worker paths and change log**

Both audience paths use the same six stages with different operational instructions. The change log lists source checks and product changes separately.

- [ ] **Step 4: Run checks and commit**

Run: `npm run check`

```bash
git add src/layouts src/styles/article.css src/components src/pages
git commit -m "feat: deepen guides and audience workflows"
```

### Task 9: Full verification, fidelity, and release

**Files:**

- Modify: `docs/design/fidelity-ledger.md`
- Modify: `README.md` if routes or product description changed.

- [ ] **Step 1: Run automated release gate**

Run: `npm ci && npm run check && git status --short`

Expected: install succeeds, all checks pass, worktree contains only intentional documentation/QA updates.

- [ ] **Step 2: Verify in the built-in browser**

Test homepage, analysis map, one role guide, all three tools, records, authorities, dealer path, and worker path. Exercise every core control at 1536×1024, ~1280×800, 390×844, and 320px width. Confirm no console errors, failed assets, body overflow, keyboard trap, or clipped primary content.

- [ ] **Step 3: Capture and inspect final screenshots**

Use the browser's screenshot workflow, then `view_image` on each accepted concept and its matching latest render. Record at least five concrete comparisons per surface: copy, layout, typography, palette, container model, control density, responsive behavior, and interaction state.

- [ ] **Step 4: Repair every fixable mismatch and rerun gates**

Repeat browser and automated checks until agency-signoff quality is reached. Update `docs/design/fidelity-ledger.md` with evidence and intentional deviations only.

- [ ] **Step 5: Commit, push, and deploy production**

```bash
git add -A
git diff --cached --check
git commit -m "feat: ship the analytical Auto Wage Law replacement"
git push origin main
npx vercel build --prod --yes
npx vercel deploy --prebuilt --prod --yes
```

Verify the production URL, GitHub deployment SHA, canonical routes, tools, and console. Probe every route emitted by the prior production build and require a real 301/308 successor response rather than a 200/meta-refresh page. Only after that parity gate passes, move `www.autowagelaw.com` and `autowagelaw.com` to the verified replacement project, preserve `www` as canonical, keep the old READY deployment intact as the cross-project rollback target, and repeat the route probe on the custom domain.

---

## Plan self-review

- **Spec coverage:** Every specification section maps to Tasks 1–9: authority/evidence, three tools, thirteen guides, navigation, source governance, privacy, visual fidelity, and deployment.
- **Placeholder scan:** No TBD/TODO/fill-later step remains.
- **Type consistency:** `AuthorityId` flows from the authority registry into findings, content frontmatter, and rendering components. Tool scripts consume only their matching pure-function result types.
- **Execution choice:** Inline execution is selected under the user's no-check-in/full-authority instruction; no approval pause is required.
