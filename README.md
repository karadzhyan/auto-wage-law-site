# Auto Wage Law

Auto Wage Law is a static, source-bounded analytical system for retail-automotive wage-and-hour questions. It organizes the work as:

`Facts -> Classify -> Measure -> Test -> Verify -> Act`

The site serves dealership operators and workers through the same fact, pay, authority, and evidence architecture. It does not produce risk scores, compliance grades, liability findings, or claim valuations.

## Local development

Requires Node 24.

```sh
  npm ci
  npm run dev
```

The permanent release gate is:

```sh
npm run check
```

That command runs Astro diagnostics, the Node tests, a production build, and generated-link/asset verification.

## Where things live

- `src/pages/` — canonical product routes and compatibility pages
- `src/components/` — the visual system, evidence/authority primitives, and instrument interfaces
- `src/content/articles/` — 13 directly owned, long-form analytical guides
- `src/lib/tools/` — pure, tested classification, scenario, and reconciliation models
- `src/data/authorities.ts` — official-source propositions, limits, pinpoints, and check dates
- `src/data/evidence.ts` — what each record domain can and cannot establish alone
- `src/data/analysis.ts` — the six-stage method and dealership role crosswalk
- `src/styles/` — global tokens and reading styles
- `docs/design/` — accepted visual references, rendered release evidence, and fidelity ledger
- `vercel.json` — permanent legacy-route migration and trailing-slash policy

There is no custom generator, CMS, database, committed build output, or inherited prototype layer. Add or edit legal content in Markdown; change presentation in the relevant Astro component or CSS file.

## Analytical instruments

The three canonical instruments are:

- `/tools/pay-system-analyzer/` — classifies entered pay-system facts into questions, predicates, authorities, and record pulls.
- `/tools/wage-scenario-lab/` — decomposes low/base/high entered assumptions into visible wage layers.
- `/tools/commission-ledger/` — reconciles synthetic transaction credits, advances, debits, and evidence gaps.

All inputs remain in browser memory. The instruments do not transmit or persist entries and do not state legal conclusions. Model changes belong in `src/lib/tools/` and require a failing test first.

## Content and source contract

Every core guide must include these sections: Question presented, Rule architecture, Decision sequence, Evidence map, Worked example, Strategic implications, Analysis limits, and Primary authority. Frontmatter identifies the analytical stage, jurisdictions, source-check scope, next check date, authority IDs, and evidence domains.

Official authorities are centralized rather than copied into page templates. Each record states both the proposition for which the source is used and the limit on that proposition. A source-check date is scope metadata—not a confidence score or a guarantee against later change.

## Release and migration

The production canonical is `https://www.autowagelaw.com`. Vercel preserves permanent successors for every HTML route emitted by the prior site, plus earlier v2 aliases and `/sitemap.xml`. Redirect-only Astro pages are excluded from the canonical sitemap.

Before release, run the gate under Node 24, validate the Vercel build, probe every legacy path for a real 308 response, then verify the public tools and console after domain assignment.
