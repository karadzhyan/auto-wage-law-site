# Auto Wage Law Site — Product and Design Specification

Status: approved for autonomous execution by the owner on 2026-07-18. The owner explicitly authorized end-to-end implementation with no interim approval pauses.

## Objective

Build a new public website from a blank repository that makes California dealership wage-and-hour information easier to understand, navigate, and act on. Preserve useful reviewed substance from `auto-wage-law-v2`, but inherit none of its prototype extraction, generated presentation, committed build output, sprawling verification harness, or governance machinery.

The replacement must feel unmistakably designed, credible to operators and counsel, and usable by workers on a phone. It must also be straightforward for a future developer to change without learning a custom compiler.

## Product principles

1. Route people by the question they have, not by the architecture of the site.
2. Show assumptions, rules, and next steps beside every tool result.
3. Protect legal substance and calculations; keep presentation easy to change.
4. Prefer ordinary files and framework conventions over generators.
5. Design alternatives are visual artifacts. Architecture documents do not substitute for visible UI.
6. Red communicates an actual potential shortfall only; it is never decorative.

## Audience and jobs

- Dealer operators, controllers, and HR: identify where a pay plan deserves review and what records to gather.
- Technicians, advisors, salespeople, F&I personnel, and support staff: recognize whether the site addresses their pay structure and learn what to inspect.
- Counsel and other reviewers: reach controlling sources, assumptions, and limitations without decoding a marketing interface.

## Information architecture

Primary navigation:

- Dealers
- Workers
- Law library
- Tools
- Developments

Launch routes:

- `/`
- `/dealers/`
- `/workers/`
- `/law-library/`
- `/pay-plans/` and five role pages
- `/issues/` and eight high-value issue pages
- `/tools/`
- `/tools/pay-plan-check/`
- `/tools/exposure-snapshot/`
- `/developments/`
- `/about/`
- `/disclaimer/`

The launch must include redirect coverage for the most valuable v1/v2 aliases. Existing production remains available as rollback until the replacement passes production verification.

## Approved visual direction: Service Bulletin

The visual identity is inspired by manufacturer service bulletins, repair-order geometry, and technical field manuals—not automotive dashboards and not a dark developer console.

Accepted concept references:

- `docs/design/homepage-concept.png`
- `docs/design/pay-plan-tool-concept.png`
- `docs/design/article-concept.png`

### Tokens

- Canvas: `#FFFFFF`
- Ink: `#10243E`
- Text: `#303943`
- Muted: `#66758A`
- Cobalt: `#2457FF`
- Cobalt dark: `#1740C9`
- Mist: `#EAF1F8`
- Rule: `#CBD7E5`
- Signal coral: `#F05A47`
- Positive: `#257B62`

Typography:

- Display: Archivo Variable, weight 560–700, slightly condensed by face design rather than CSS distortion.
- Reading/UI: Source Sans 3 Variable, weight 400–700.
- Data/citations only: IBM Plex Mono, weight 400–600.

Layout:

- Maximum content width: 1240px.
- Reading measure: 46rem.
- Twelve-column desktop grid, collapsing to one flow below 760px.
- Section spacing: 72–104px desktop, 48–72px mobile.
- Borders and alignment rails provide structure; shadows are nearly absent.
- Radius: 2px for controls, 4px for the rare raised sheet.
- Cards are not a default container. Use bands, rows, lists, timelines, and a single findings sheet.

Signature motif:

The homepage contains a horizontal diagnostic ribbon connecting five dealership roles to issue families. The article template uses an annotated workday timeline. Tool pages use a worksheet/findings-sheet split. These are three applications of one alignment-and-causality system.

Motion:

- A single 240ms line-draw/reveal may introduce the diagnostic ribbon.
- Tool results transition once after calculation.
- All motion is disabled under `prefers-reduced-motion`.

## Homepage

Above-the-fold copy lock:

- Brand: `Auto Wage Law`
- Heading: `Dealership pay, measured against the law.`
- Support: `Independent guidance for the people who run dealerships and the people who work in them.`
- Actions: `Find your pay plan`; `Run a self-audit`

Sections, in order:

1. Quiet header and hero with diagnostic role/issue map.
2. Dealer/worker audience split.
3. Five-role pay-plan navigator.
4. Exposure snapshot preview with a clear illustrative-data label.
5. Open law-library index.
6. Developments list.
7. Restrained footer and legal notice.

## Article system

Articles are Markdown content rendered through one Astro layout. The layout provides breadcrumbs, title, description, reviewed date, confidence/source callouts, a sticky table of contents on desktop, related links, and print styles.

The initial flagship article is `Flag hours do not replace the clock.` Its timeline is code-native HTML/CSS, not an image. Existing reviewed prose may be migrated verbatim, but it must be edited into normal Markdown once and then owned directly by this repository.

## Tools

### Pay-plan check

The interface follows the approved tool concept: a five-step worksheet on the left and a findings sheet on the right. Launch fields cover role, pay method, time at the dealership, paid hours, separately shown rest-period pay, and written-plan availability.

The pure calculation module returns:

```ts
type PayPlanFinding = {
  severity: 'clear' | 'review' | 'gap';
  potentialGapHours: number;
  title: string;
  reasons: string[];
  nextSteps: string[];
};
```

It must never state that a violation occurred. It identifies inputs that merit review and explains the assumptions. Inputs stay in the browser and are not transmitted.

### Exposure snapshot

The second tool accepts employee count, estimated weekly gap per employee, average regular rate, and lookback years. It returns wages-only illustrative exposure before penalties, interest, fees, or claim-specific defenses. The result must label every excluded category and must not imply a legal valuation.

Both tools expose their math through small pure TypeScript modules with Node tests. UI code contains no duplicated formulas.

## Architecture

- Astro 7 static output.
- TypeScript.
- Plain Astro components and scoped CSS.
- Astro content collections for Markdown articles.
- Framework-free browser scripts for tool interactivity.
- No React, Next.js, Tailwind, component library, CMS, database, server functions, or custom generator.
- No committed `dist/`.
- No inherited `design/`, `reference/`, claims ledger, extraction pipeline, or custom template interpreter.
- Dependencies limited to Astro, `@astrojs/check`, `@astrojs/sitemap`, TypeScript, and the three local font packages.

## Content boundaries

Reuse only:

- reviewed positioning and audience copy;
- existing pay-plan and issue names/descriptions;
- reviewed disclaimer language;
- current legal constants and source URLs;
- calculation semantics that can be isolated and tested.

Do not import generated HTML, old CSS, committed `dist`, prototype templates, screenshot matrices, or governance documents.

## Quality gates

Permanent automated gate:

```text
npm run check
  astro check
  node --test
  astro build
```

Release QA additionally verifies:

- homepage, article, and both tools at 1440px and 390px;
- keyboard operation and visible focus;
- no horizontal overflow;
- working mobile navigation;
- calculation/reset/print flows;
- sitemap, canonical metadata, and a useful 404;
- no console errors or failed first-party assets;
- direct visual comparison against all three accepted concepts using `view_image`.

## Deployment

Create GitHub repository `karadzhyan/auto-wage-law-site`, deploy it as Vercel project `auto-wage-law-site`, and verify its production deployment. Keep the existing production project intact as rollback. Reassign the main domains only after route, tool, and visual verification is green; otherwise publish the finished replacement on its Vercel production URL without damaging the existing site.

