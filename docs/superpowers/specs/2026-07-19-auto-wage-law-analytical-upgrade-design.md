# Auto Wage Law Analytical Upgrade Design

**Status:** Internally approved for implementation under the user's express instruction to proceed end-to-end without check-ins.

**Current-law cutoff:** July 18, 2026

**Primary concepts:**

- `docs/design/analytical-home-v2.png`
- `docs/design/pay-system-analyzer-v2.png`
- `docs/design/wage-scenario-lab-v2.png`
- `docs/design/commission-ledger-v2.png`
- `docs/design/deep-article-v2.png`

## 1. The problem this upgrade must solve

The replacement repository fixed the original repositories' engineering problem: presentation, content, provenance, and verification are no longer fused into a single generator. It did not yet solve the product problem. The current site presents a polished shell around a legally thin model:

- Thirteen article bodies are only 123–166 words each. They identify sensible topics but rarely state the operative predicates, controlling distinctions, decision order, evidentiary implications, worked examples, or consequences.
- Every article is stamped `Reviewed` without identifying what was checked, against which authorities, or by whom. The interface therefore conveys more assurance than the editorial process can defend.
- The current Pay Plan Check collects a role but does not use it. It also treats absence of separately shown rest pay and absence of a written plan as method-neutral warnings even though the governing requirements differ across hourly, piece-rate, commission, salary, and mixed plans.
- The current Exposure Snapshot multiplies four inputs. Its disclaimers are responsible, but its name and visual prominence still invite users to mistake one wage-layer formula for an exposure analysis.
- Federal and California routes are mentioned together without consistently showing which question each rule decides and, equally important, what it does not decide.
- Records are treated as a checklist at the end rather than as the mechanism that connects factual assertions to legal predicates.

The upgraded product must teach and enforce disciplined analytical sequencing. It must be useful precisely because it refuses to collapse incomplete facts into a score, verdict, or claim value.

## 2. Product thesis

> Map the pay system before you judge the result.

Every substantive surface will use one common six-stage analysis:

1. **Facts — What work occurred?** Establish the employing entity, establishment, worksite, role, actual duties, workday, workweek, activities, and dates.
2. **Classify — What is each pay component?** Distinguish hourly wages, salary, piece/flat rate, commission, draw/advance, guarantee, bonus, spiff, premium, reimbursement, and deduction by substance rather than label.
3. **Measure — Which hours and rates control?** Reconcile worked time, productive output, rest/recovery, other nonproductive time, meals, daily/weekly overtime, earning periods, and applicable rates without borrowing compensation across units where the law does not permit it.
4. **Test — Which rule applies?** Run federal and California coverage/exemption routes separately, select the applicable wage order, and test every predicate of the chosen route.
5. **Verify — What proves or contradicts it?** Align the written plan, time record, pay detail, production/transaction record, system timestamps, and establishment facts for the same dates.
6. **Act — What changes next?** Identify the unresolved predicate, missing record, corrective control, preservation step, or fact-specific question. Do not infer liability or compliance.

This sequence is not decoration. It is the site's navigation model, article structure, tool output schema, evidence taxonomy, and visual signature.

## 3. Approaches considered

### A. Expand the existing articles

This would improve volume but retain the current disconnected architecture. Each article could still use different analytical shortcuts, and the tools would remain shallow. Rejected.

### B. Add more sophisticated calculators to the existing site

This would improve interactivity but risk encoding legal conclusions before the authority and evidence models were coherent. It would also repeat the original repository's mistake in a new form: complexity concentrated in isolated implementation units. Rejected.

### C. Build one analytical spine shared by content, tools, evidence, and authority

Selected. A small set of typed data modules will own stable concepts; normal Markdown will own prose; pure tested functions will own calculations/classifications; Astro components will own presentation. This provides depth without recreating a generator, CMS, or governance machine.

## 4. Scope

### Included

- A canonical analysis map and role-to-issue crosswalk.
- A role- and pay-method-sensitive Pay System Analyzer.
- A decomposed Wage Scenario Lab with low/base/high entered assumptions.
- A browser-local Commission & Draw Ledger for transaction-level reconciliation.
- A primary-authority registry with exact proposition labels, official URLs, pinpoints where useful, jurisdiction, source type, and source-check date.
- A Records & Evidence hub that aligns time, pay, output/transaction, plan, system, and establishment evidence.
- A substantial rewrite of all thirteen core guides around predicates, distinctions, evidence, worked examples, strategy, and limitations.
- A source-check and change log that replaces the misleading generic developments/review representation.
- Revised dealer and worker paths using the same analytical sequence from different operational perspectives.
- Automated tests, browser QA, print states, accessibility, source/link checks, and production deployment.

### Not included

- Individualized legal advice, a compliance determination, liability finding, settlement valuation, limitations-period selection, class certification analysis, or prediction of recoverable amounts.
- Local-rate coverage beyond warning that the location/date-specific applicable rate may exceed the statewide floor.
- User accounts, saved server-side data, analytics, tracking, a CMS, a database, a generic content generator, or AI-generated legal conclusions.
- Automatic import of payroll, DMS, CRM, repair-order, or deal-jacket data.

## 5. Authority and proposition model

### 5.1 Source hierarchy

1. Statutes and wage orders.
2. Regulations.
3. Published controlling court opinions.
4. Official agency materials, including opinion letters, FAQs, manuals, and classification guides, labeled as guidance rather than controlling authority.

Secondary commentary will not support a legal proposition in the product.

### 5.2 Authority registry

`src/data/authorities.ts` will export typed `Authority` objects:

```ts
type Authority = {
  id: string;
  shortLabel: string;
  title: string;
  jurisdiction: 'federal' | 'california';
  sourceType: 'statute' | 'regulation' | 'wage-order' | 'case' | 'agency-guidance';
  url: string;
  proposition: string;
  limits?: string;
  pinpoint?: string;
  checked: string;
  statusNote?: string;
};
```

Pages and tools reference authority IDs. They do not duplicate URLs or rewrite the proposition. The registry is intentionally small and explicit; it is not a source-ingestion pipeline.

### 5.3 Current numeric anchors

Each derived constant will include its formula and official source:

- California statewide minimum wage, effective January 1, 2026: **$16.90/hour**.
- Statewide 1.5× commission-exemption pay threshold: **$25.35/hour**, subject to the complete exemption test and any higher applicable rate.
- Statewide 2× hand-tool threshold: **$33.80/hour**, subject to the governing wage order, item category, and apprenticeship facts.
- California white-collar salary formula: **$70,304/year**, only one predicate of an exemption.
- Federal EAP standard salary level as of the cutoff: **$684/week** after the 2024 thresholds were vacated and the 2019 text restored. This value is explicitly date-sensitive.
- Federal section 7(i) regular-rate threshold: strictly greater than **$10.875/hour**, derived from 1.5 × the federal $7.25 minimum wage; the California route remains separate.

No page may present a derived number without the formula, effective date, jurisdictional limit, and source link.

### 5.4 High-value doctrinal guardrails

- Say “exempt from federal overtime,” never “exempt from wage law,” for sections 13(b)(10) and 7(i).
- Treat section 13(b)(10) as an establishment-and-actual-duty route, not a compensation route.
- Treat service-advisor coverage under *Encino Motorcars* as a federal rule; it does not decide California overtime, breaks, minimum wage, records, or commissions.
- Do not assume F&I employees fit section 13(b)(10); test section 7(i) and any white-collar route separately.
- Do not use California's minimum wage to calculate the federal section 7(i) threshold.
- Do not hard-code Wage Order 7. Dealer-connected repairs generally route to Order 7; standalone vehicle-repair garages generally route to Order 9. Establishment facts control.
- Do not treat every non-flagged minute as section 226.2 nonproductive time. First determine hours worked and whether the activity is directly related to the piece-paid unit.
- Do not treat a pay-period minimum-wage top-up as section 226.2(a)(7)'s hourly base paid for every hour in addition to piece earnings.
- Keep section 226.2 rest/recovery rate, overtime regular rate, and section 226.7 premium rate as three separate calculations.
- Do not infer a missed rest from lack of a rest punch; authorized rest periods need not be separately punched. A rest-pay statement line proves compensation, not that a compliant break occurred.
- Do not round meal punches. Do not state a categorical statewide answer for general neutral rounding while *Camp* remains unresolved as of the cutoff.
- Do not infer that a missing record proves liability. State whether it creates uncertainty, supports a reasonable inference, or raises a distinct recordkeeping question.
- Do not auto-stack wage-statement or waiting-time penalties from an underlying wage issue. Injury, knowledge/intent, willfulness, and good-faith disputes are separate nodes.
- Do not call a draw, commission, piece rate, spiff, bonus, pack, or chargeback what payroll calls it. Classify how it is calculated, earned, recovered, and documented.

## 6. Evidence architecture

Every finding will map to one or more evidence domains:

| Domain | Core records | What they can establish | What they do not establish alone |
| --- | --- | --- | --- |
| Time | Raw punches, edits/audit trail, schedule, meal punches, attestations | Recorded work intervals, facial meal timing, edits | Full controlled time, off-clock activity, rest authorization |
| System activity | DMS/CRM events, RO timestamps, OEM training, access/alarm, messages | Activity at a point, knowledge, sequence | Continuous work across gaps |
| Output/transaction | Flag ledger, repair orders, deal jackets, funding/cancellation proof | Units, transactions, reversals, output attribution | All worked time or legal classification |
| Pay | Payroll register, wage statement, earning codes, bonus tables, draw reconciliation | Amounts paid, rates used, statement presentation | Whether missing work occurred or a plan condition is valid |
| Plan | Signed commission plan, receipt, piece-rate formula, policies, amendments | Promised unit, earning condition, effective version | Actual practice or complete duties |
| Establishment/duties | Entity records, dealer connection, sales mix, job duties, actual time allocation | Wage-order and exemption predicates | Pay accuracy without period records |
| Expense | Required-item inventory, reimbursement policy, receipts, mileage/device records | Necessity, amount, method, reimbursement | Whether a separate wage-order tool exception applies without earnings/item facts |

The canonical record packet aligns these domains for identical dates:

`plan version → time → system/output/transaction → payroll calculation → wage statement → later debit/true-up → reimbursement`

## 7. Information architecture

### 7.1 Primary navigation

- Dealers
- Workers
- Analysis map
- Law library
- Tools

The primary action is “Analyze a pay system.” The old “Developments” top-level item is removed; source checks and changes remain accessible from the footer and authority hub.

### 7.2 Canonical routes

- `/analysis-map/`
- `/records/`
- `/authorities/`
- `/tools/pay-system-analyzer/`
- `/tools/wage-scenario-lab/`
- `/tools/commission-ledger/`
- Existing role and issue routes remain stable.
- `/tools/pay-plan-check/` redirects to `/tools/pay-system-analyzer/`.
- `/tools/exposure-snapshot/` redirects to `/tools/wage-scenario-lab/`.
- `/developments/` becomes the source-check/change log and retains its route.

## 8. Surface specifications

### 8.1 Homepage and Analysis Map

The opening viewport uses the exact headline:

> Map the pay system before you judge the result.

It introduces the six-stage sequence and links to the full analysis map. Below it, a role-to-issue crosswalk uses rows for technician, sales, service advisor, F&I, and parts/support; columns for time, pay method, coverage, and records. Nodes communicate common, possible, or exception-sensitive intersections. They are not risk scores and do not imply frequency from empirical data; labels therefore use “primary route,” “possible route,” and “exception-sensitive” rather than quantitative language.

The full `/analysis-map/` route expands each stage with:

- the question the stage answers;
- the common conflation it prevents;
- inputs and records needed;
- role-specific examples;
- links to issue guides and authorities.

### 8.2 Pay System Analyzer

The analyzer accepts one representative period and produces multiple independent findings.

#### Inputs

- Jurisdiction lane: California + federal orientation (no local rate calculation).
- Establishment context: dealer-connected repair, standalone repair business, other/unknown.
- Dealership role and actual-duty route.
- Primary and secondary pay methods.
- Actual recorded/worked hours and hours reflected as paid or separately compensated.
- Whether piece-rate work occurred in the period.
- Whether rest/recovery and other nonproductive time are separately shown where method-specific rules make those questions relevant.
- Whether a signed commission plan, piece/incentive formula, time record, production/transaction record, and current statement are available.
- Claimed federal/state overtime route, including “not sure.”

#### Output

Each `Finding` has:

```ts
type Finding = {
  id: string;
  dimension: 'facts' | 'classification' | 'measurement' | 'coverage' | 'records';
  status: 'reconcile' | 'predicate' | 'verify' | 'separate-test' | 'supported-by-inputs';
  title: string;
  enteredFact: string;
  basis: string;
  whyItMatters: string;
  proofToPull: string[];
  authorityIds: string[];
  limits: string;
};
```

The analyzer may compute a difference between worked/recorded hours and accounted hours, but it labels the result “hours to classify and reconcile,” not “unpaid hours.” A reassuring state is never “compliant” or “clear”; it is “no conflict surfaced by these inputs,” accompanied by missing scope.

Branching rules are method- and role-sensitive. For example:

- Separate rest/NPT statement lines are tested for piece-rate periods under section 226.2.
- Commission plans test section 2751 writing/receipt facts and separately test whether rest time is independently paid under the actual formula.
- Ordinary hourly plans do not receive a false-positive warning merely because rest pay lacks a separate statement line.
- Federal dealership exemptions are tested only after establishment and actual-duty predicates.
- Section 7(i) requires all three routes: retail/service establishment, week-specific regular-rate threshold, and more-than-half commission compensation over a representative period.

### 8.3 Wage Scenario Lab

The lab replaces “Exposure Snapshot.” It computes only entered wage layers:

#### Inputs

- Employees.
- Workweeks, labeled “illustrative duration,” never “lookback period.”
- Low/base/high weekly gap assumptions.
- Entered straight-time rate.
- Overtime share of the assumed gap.
- Overtime premium increment, default 0.5× and editable to avoid pretending the tool selected the governing method.
- Optional meal/rest premium hours per workweek and entered premium rate.

#### Per-scenario arithmetic

```text
straight-time layer = employees × workweeks × weekly gap × entered rate
overtime increment = employees × workweeks × weekly gap × OT share × entered rate × entered increment
premium-hours layer = employees × workweeks × entered premium hours × entered premium rate
entered total = selected layers summed
```

The tool does not choose whether hours are covered, whether straight time was already paid, the regular rate, a premium count, class size, limitation period, liability, recoverability, offsets, penalties, interest, fees, or defenses.

Low/base/high are sensitivity inputs, not probability or confidence estimates. Every result shows a decomposition table, the exact formula, and included/excluded categories.

### 8.4 Commission & Draw Ledger

The ledger is browser-local and begins with seeded example data that can be added to, edited, filtered, reset, and printed.

#### Setup

- Role.
- Plan version/effective period.
- Dealer payday fact.
- Pay period.
- Signed plan/receipt availability.

#### Transaction fields

- Deal/event identifier and dates.
- Component classification entered by the user.
- Written earning condition.
- Evidence of condition.
- Original credit and wage-statement line.
- Later debit and wage-statement line.
- Reason code.
- Plan acknowledgment.

#### Derived arithmetic

The ledger may total base/hourly wages, credits, draws, and debits. It may not decide whether a component is a true commission, an amount was earned, a dealer timing exception applies, or a debit is lawful. Instead it surfaces four independent questions: classification, earning event, payment timing, and debit/chargeback basis.

The product must distinguish:

- identified transaction + express pre-earning condition;
- advance/draw reconciliation;
- pooled or unidentified business loss;
- deduction from wages already earned;
- ordinary loss/simple negligence versus the narrower dishonesty/willfulness/gross-negligence route.

### 8.5 Records & Evidence hub

The hub provides one shared matrix with dealer and worker views. The facts do not change; the operational instruction does.

- Dealer view: data ownership, export format, retention, audit trail, control owner, reconciliation cadence, correction protocol.
- Worker view: matching-date packet, preservation, export/screenshots, personal time record, transaction identifiers, and specific questions a record can answer.

It explains that a missing record is not automatic proof of liability and that certain failures may change burdens or support reasonable inferences.

### 8.6 Authority hub

Authorities are filterable by jurisdiction, type, issue, and analysis stage. Each row shows:

- short label and official title;
- narrow proposition;
- what it does not decide;
- source type and jurisdiction;
- pinpoint/status note where material;
- source-check date;
- direct official link.

No confidence badges are used. The source type, proposition breadth, and limits do the epistemic work.

### 8.7 Deep guides

Each of the thirteen guides is rewritten to contain the following real sections when applicable:

1. **Question presented** — the bounded question, not a conclusion.
2. **Why the classification matters** — the concepts that are commonly conflated.
3. **Rule architecture** — parallel rules and what each does/does not decide.
4. **Decision sequence** — ordered predicates.
5. **Evidence map** — records tied to those predicates.
6. **Worked example** — a bounded fact pattern or computation with assumptions visible.
7. **Failure modes** — misleading shortcuts and alternative explanations.
8. **Strategic implications** — separate dealer and worker operational value.
9. **Primary authority** — registry-backed official links.
10. **Analysis limits** — remaining facts and current-law boundaries.

Guides should generally contain 900–1,800 useful words. Length is not a target independent of reasoning; duplicative background is removed.

### 8.8 Source-check/change log

The current generic “Reviewed” stamp is replaced with:

- **Source checked:** month/year.
- **Scope:** authorities checked for this page.
- **Material changes:** concise change note or “No material authority change identified.”
- **Next scheduled check:** date.

The interface never implies attorney review unless a named qualified reviewer actually performed it.

## 9. Content-specific correction requirements

- Service advisors: replace the categorical “Exempt from federal overtime” description with a conditional federal rule tied to qualifying dealership/service-advisor duties; separate California analysis.
- F&I: replace “Section 7(i) is available” with a predicate route; include the dealership opinion letter's factual limits and separate EAP route.
- Parts/support: remove “almost never” generalization and separate partsman, porter/detail, BDC, shuttle, office, vendor, contractor, and joint-employer routes.
- Minimum wage: actually show 2026 rates, the highest-applicable-rate caveat, Oman/no-borrowing analysis, and piece-rate distinctions.
- Regular rate: actually work at least three materially different methods—multiple hourly rates, piece/production earnings, and flat-sum bonus—while separating federal and California implications.
- Rest/NPT: actually work section 226.2 rest and NPT examples and distinguish a genuine hourly base in addition to piece earnings from a pay-period floor.
- Meal/rest: distinguish provision from payment, meal records from rest evidence, separate meal/rest premium categories, Donohue presumption, Augustus control, Ferra rate, and Naranjo penalty nodes.
- Off-clock: add control/suffer-or-permit, knowledge, capture feasibility, activity type, regularity, and current rounding status; no fixed-minute de minimis claim.
- Chargebacks: distinguish earning condition, advance, transaction-specific reversal, pooled loss, deduction, and final-pay timing.
- Tools/expenses: distinguish wage-order customary hand tools, shop equipment, uniforms/safety devices, and independent section 2802 necessary expenses.

## 10. Visual system

### 10.1 Art direction

The site is a **diagnostic ledger**: retail-automotive service-bulletin geometry combined with primary-source editorial precision. The single memorable device is the six-stage ruled analysis sequence. All other design is quiet enough to support it.

### 10.2 Color lock

- Canvas: true white `#ffffff`.
- Ink: `#10243e`.
- Text: `#303943`.
- Muted: `#66758a`.
- Cobalt: `#2457ff`.
- Cobalt dark: `#1740c9`.
- Mist: `#eaf1f8`.
- Paper blue: `#f5f8fc`.
- Rule: `#cbd7e5`.
- Signal: `#f05a47`, only for conflicts, exclusions, or unresolved boundaries.
- Positive: `#257b62`, only for a record-supported input state, never a compliance verdict.

No cream, beige, gradients, glass effects, or decorative glows.

### 10.3 Typography

- Display: Archivo Variable, condensed with restraint.
- Body: Source Sans 3 Variable.
- Utility/data/citations: IBM Plex Mono.
- Controls receive explicit family, weight, size, and line height; no browser-default typography.

### 10.4 Geometry and containers

- 1px blue-gray rules for structure; 2–3px ink/cobalt anchors for hierarchy.
- 0–3px radii.
- Open bands, ruled rows, ledgers, tables, and rails. No default card grids or nested rounded containers.
- Measurement ticks are reserved for instrument surfaces and major transitions.
- Icons are sparse, consistent 1.7–2px outline SVGs used only for navigation or analytical meaning.

### 10.5 Motion

- One orchestrated sequence reveal on the analysis map.
- Row selection, expansion, and focus transitions at 160–200ms.
- No ambient motion. `prefers-reduced-motion` removes nonessential transitions.

### 10.6 Responsive behavior

- Below 960px, tool input and findings stack; findings remain after the form in reading order.
- Tables become horizontally scrollable only when semantic column comparison must be preserved; transaction rows may become labeled stacked entries below 680px.
- The article's left sequence rail collapses to a horizontal current-step strip; the evidence/authority rail follows the main analysis.
- No body-level horizontal overflow at 320px.

## 11. Accessibility and usability

- Semantic headings, landmarks, tables, fieldsets, legends, and descriptions.
- Every input has a visible label and, where needed, help text connected with `aria-describedby`.
- Findings use text labels in addition to color.
- Expanders use native `details/summary` where practical or correctly managed `aria-expanded`/controls.
- Live result updates announce a concise summary without dumping full findings.
- Keyboard focus is unmistakable; touch targets are at least 44px where applicable.
- Print views include assumptions, source-check date, formulas, exclusions, and authority labels.
- WCAG 2.2 AA contrast targets are met.

## 12. Privacy, integrity, and security

- All tool data remains in memory in the browser. No network submission, analytics, tracking, cookies, or local storage.
- No tool accepts names, VINs, account numbers, employee IDs, or other personal identifiers; examples use synthetic labels.
- External links use safe attributes where needed.
- A regression test checks that tool scripts contain no `fetch`, `XMLHttpRequest`, `sendBeacon`, storage, or analytics integration.
- The site states exactly what it does: no inputs are transmitted. It does not claim that browser history, printing, screenshots, or a user's device are private.

## 13. Engineering boundaries

- Keep Astro static output, TypeScript, scoped/global CSS, and Markdown.
- Do not introduce React, Tailwind, a CMS, a database, or a new state library.
- Keep components focused. No giant application component and no generic renderer that hides legal/product semantics.
- Pure domain logic lives in `src/lib/` and is covered by Node tests.
- Content remains directly editable Markdown with typed frontmatter.
- The authority registry is typed data, not a generator.
- `dist/` remains uncommitted.

## 14. Test strategy

### Unit tests

- Authority IDs are unique; URLs are official HTTPS sources; referenced IDs exist.
- Derived constants equal source formulas.
- Pay System Analyzer branches by role, method, establishment context, and available proof.
- Hour differences are labeled “to reconcile,” never “unpaid.”
- Hourly plans do not receive piece-rate-only statement warnings.
- Commission plans test signed-plan/receipt facts separately from piece-rate formula facts.
- Federal exemptions never suppress California findings.
- Scenario Lab validates ranges and correctly decomposes every layer.
- Commission Ledger totals credits/draws/debits and never returns a legal-validity field.
- Content schema and guide section coverage are complete.

### Build/link tests

- `astro check`, unit tests, static build, internal-link scan, asset scan, redirect checks, authority-link format checks, and privacy regression check.

### Browser verification

- Desktop 1536×1024 against each concept.
- Small laptop around 1280×800.
- Mobile 390×844 and 320px width.
- Keyboard traversal, form validation, expand/collapse, filters, resets, print triggers, and back/forward navigation.
- No console errors, failed resources, clipped content, unintended wrapping, or body overflow.
- Final screenshots are inspected with `view_image` beside the accepted concepts and recorded in the fidelity ledger.

## 15. Success criteria

The upgrade is complete only when:

- the site teaches one coherent reasoning method across every core surface;
- every material proposition is tied to a primary official authority and a stated limit;
- no tool turns incomplete facts into a compliance, liability, risk, or value score;
- every tool exposes assumptions, formulas, evidence needs, and exclusions;
- all thirteen guides contain real analytical depth rather than expanded summaries;
- the known role/method logic defects are removed and regression-tested;
- source-check language is accurate and does not imply unnamed legal review;
- the implementation is visually faithful to all accepted concepts on desktop and mobile;
- all automated checks pass, the production deployment is verified, and the existing custom-domain rollback remains undisturbed unless route parity is separately established.

## 16. Spec self-review

- Placeholder scan: no TBD/TODO/future-fill requirements remain.
- Consistency: tools, content, authority, evidence, and visual architecture all use the same six-stage sequence.
- Scope: ambitious but bounded to a static educational product; no account, data-import, advice, or backend systems are introduced.
- Ambiguity resolved: “reviewed” becomes “source checked”; low/base/high are entered sensitivity assumptions; hour gaps are reconciliation values; federal and California tests remain separate; missing evidence produces an unresolved predicate rather than a verdict.
