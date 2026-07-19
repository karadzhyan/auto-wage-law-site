# Auto Wage Law Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a clean, visually elevated Auto Wage Law replacement website from a blank repository.

**Architecture:** Astro renders static pages from directly owned components and Markdown. Two browser-only tools call small pure calculation modules. There is no custom generator, committed output, or inherited presentation layer.

**Tech Stack:** Astro 7, TypeScript, scoped CSS, Astro content collections, Node test runner, Vercel.

## Global Constraints

- Follow `docs/superpowers/specs/2026-07-18-auto-wage-law-site-design.md` and the three accepted concept PNGs.
- Use true white `#FFFFFF`, ink `#10243E`, cobalt `#2457FF`, mist `#EAF1F8`, rule `#CBD7E5`, coral `#F05A47` only for real warnings.
- Use Archivo Variable for display, Source Sans 3 Variable for reading/UI, and IBM Plex Mono only for data/citations.
- Do not import any v2 generated HTML, CSS, `dist`, prototype templates, template interpreter, screenshot matrix, or governance machinery.
- Do not commit `dist/` or `.astro/`.
- No React, Next.js, Tailwind, UI kit, CMS, database, server function, or custom build generator.
- Tool results must be framed as educational review prompts, never determinations of legal liability.
- Inputs remain browser-local.
- Keep the permanent gate to `astro check`, Node tests, and `astro build`.

---

### Task 1: Repository foundation and design system

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.nvmrc`
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/article.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces global tokens and `BaseLayout` consumed by every later route.

- [ ] Create the Astro package configuration with scripts `dev`, `build`, `preview`, `test`, and `check`.
- [ ] Install only the dependencies permitted by the specification.
- [ ] Implement the accepted palette, typography, grid, buttons, focus states, print baseline, and reduced-motion behavior.
- [ ] Add canonical/OG metadata support to `BaseLayout`.
- [ ] Run `npm run check`; expected result: zero type errors, tests passing, and a successful static build.
- [ ] Commit as `chore: establish clean Astro foundation`.

### Task 2: Shared shell and content model

**Files:**
- Create: `src/components/SiteHeader.astro`, `SiteFooter.astro`, `ArrowIcon.astro`, `RoleIcon.astro`
- Create: `src/content.config.ts`
- Create: `src/data/site.ts`, `src/data/navigation.ts`, `src/data/library.ts`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/pages/404.astro`, `src/pages/about.astro`, `src/pages/disclaimer.astro`

**Interfaces:**
- Produces `ArticleLayout` plus typed `payPlans` and `issues` registries.

- [ ] Add an accessible desktop/mobile header with one navigation model and a working disclosure button.
- [ ] Add the restrained footer, reviewed date, and reviewed disclaimer propositions.
- [ ] Configure a typed `articles` content collection.
- [ ] Implement article breadcrumbs, reading measure, table of contents, authority callout, related links, and print behavior.
- [ ] Add a useful 404 plus complete About and Disclaimer pages.
- [ ] Run `npm run check`; expected result: all routes build and the mobile menu script type-checks.
- [ ] Commit as `feat: add shared site shell and article system`.

### Task 3: Homepage and audience routes

**Files:**
- Create: `src/components/DiagnosticRibbon.astro`, `AudienceSplit.astro`, `RoleNavigator.astro`, `ExposurePreview.astro`, `LibraryIndex.astro`, `DevelopmentsList.astro`
- Create: `src/pages/index.astro`, `src/pages/dealers.astro`, `src/pages/workers.astro`, `src/pages/law-library.astro`, `src/pages/developments.astro`

**Interfaces:**
- Consumes typed registries from Task 2.
- Produces the primary discovery paths used by detail routes and tools.

- [ ] Implement the approved homepage copy and exact section order.
- [ ] Build the code-native role/issue diagnostic ribbon with one purposeful load reveal and a reduced-motion fallback.
- [ ] Implement dealer and worker pages as open action rows, not card grids.
- [ ] Implement the law-library and developments indexes.
- [ ] Verify links point only to routes delivered by this plan.
- [ ] Run `npm run check`; expected result: successful build with no broken internal hrefs in generated pages.
- [ ] Commit as `feat: build the Auto Wage Law discovery experience`.

### Task 4: Pay-plan and issue content

**Files:**
- Create: `src/content/articles/pay-plans/*.md` for five roles
- Create: `src/content/articles/issues/*.md` for overtime, minimum wage, regular rate, rest and nonproductive time, meal/rest periods, off-clock work, deductions/chargebacks, and tools/expenses
- Create: `src/pages/pay-plans/index.astro`, `src/pages/issues/index.astro`, `src/pages/[section]/[slug].astro`
- Create: `src/components/WorkdayTimeline.astro`, `AuthorityCallout.astro`, `Checklist.astro`

**Interfaces:**
- Markdown frontmatter supplies `title`, `description`, `section`, `reviewed`, `confidence`, `related`, and `sources`.

- [ ] Migrate the five role names, descriptions, and bounded reviewed explanations into normal Markdown.
- [ ] Migrate eight high-value issue explanations without changing substantive claims.
- [ ] Implement the flagship flat-rate article and code-native annotated timeline matching `article-concept.png`.
- [ ] Generate pay-plan and issue indexes from the content collection.
- [ ] Generate detail routes from the same collection with no per-route boilerplate.
- [ ] Run `npm run check`; expected result: all 13 articles render and appear in the sitemap.
- [ ] Commit as `feat: publish the core pay-plan and issue library`.

### Task 5: Pure tool logic with tests

**Files:**
- Create: `src/lib/tools/pay-plan-check.ts`, `src/lib/tools/exposure.ts`
- Create: `tests/pay-plan-check.test.ts`, `tests/exposure.test.ts`

**Interfaces:**
- Produces `evaluatePayPlan(input): PayPlanFinding` and `calculateExposure(input): ExposureResult`.

- [ ] Write failing tests covering zero-gap, gap, invalid negative values, rounding, excluded categories, and the exact illustrative fixtures used by the pages.
- [ ] Run `npm test`; expected result: failures because the modules do not exist.
- [ ] Implement the smallest pure functions that satisfy the tests and return explicit assumptions.
- [ ] Run `npm test`; expected result: all tool tests pass.
- [ ] Commit as `feat: add tested educational calculation models`.

### Task 6: Tool interfaces

**Files:**
- Create: `src/components/tools/PayPlanCheck.astro`, `src/components/tools/ExposureSnapshot.astro`
- Create: `src/pages/tools/index.astro`, `src/pages/tools/pay-plan-check.astro`, `src/pages/tools/exposure-snapshot.astro`
- Create: `src/scripts/pay-plan-check.ts`, `src/scripts/exposure-snapshot.ts`

**Interfaces:**
- Consumes Task 5 pure functions; browser scripts only read form state and render returned objects.

- [ ] Implement the worksheet/findings-sheet Pay Plan Check screen matching the accepted concept.
- [ ] Implement the exposure form with clearly excluded categories and an illustrative-data state.
- [ ] Add calculation, validation, reset, and print flows plus browser-local privacy copy.
- [ ] Ensure every field has a label, errors are announced, and keyboard focus moves to results after calculation.
- [ ] Run `npm run check`; expected result: type-safe scripts, passing tests, and successful build.
- [ ] Commit as `feat: ship the pay-plan and exposure tools`.

### Task 7: Release verification and publication

**Files:**
- Create: `scripts/check-links.mjs`, `tests/site-structure.test.mjs`
- Modify: `package.json`, `astro.config.mjs`, `.github/workflows/ci.yml`
- Create during QA then remove: temporary browser screenshots outside tracked source

**Interfaces:**
- Produces the GitHub repository and verified Vercel production deployment.

- [ ] Add a small link/route structure test and include it in `npm run check`.
- [ ] Run `npm run check`; expected result: zero errors and a successful production build.
- [ ] Serve the production build and verify homepage, article, mobile navigation, both tool workflows, reset, and print at 1440px and 390px.
- [ ] Capture final screenshots and compare them with all three accepted concepts using `view_image`; fix all agency-signoff issues.
- [ ] Run a final above-the-fold copy diff against the specification.
- [ ] Create GitHub repository `karadzhyan/auto-wage-law-site`, push `main`, and confirm CI.
- [ ] Create Vercel project `auto-wage-law-site`, deploy production, and verify the public URL for console/network/asset failures.
- [ ] Preserve the old Vercel project as rollback; reassign custom domains only if critical-route verification is green.
- [ ] Commit any release fixes as `fix: complete production verification` and push.

