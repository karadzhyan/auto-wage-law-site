# Auto Wage Law

The clean, static Auto Wage Law website: dealership wage-and-hour orientation for the people who run stores and the people who work in them.

## Local development

Requires Node 24.

```sh
npm install
npm run dev
```

The permanent release gate is:

```sh
npm run check
```

That command runs Astro diagnostics, the Node tests, a production build, and generated-link/asset verification.

## Where things live

- `src/pages/` — ordinary routes
- `src/components/` — the visual system and tool interfaces
- `src/content/articles/` — directly owned Markdown articles
- `src/lib/tools/` — pure, tested tool calculations
- `src/data/` — small navigation and library registries
- `src/styles/` — global tokens and reading styles
- `docs/design/` — accepted visual references and fidelity notes

There is no custom generator, CMS, database, committed build output, or inherited prototype layer. Add or edit legal content in Markdown; change presentation in the relevant Astro component or CSS file.

## Instrument boundary

Both tools run entirely in the browser. They do not transmit inputs and do not state legal conclusions. Calculation changes belong in `src/lib/tools/` and require a failing test first.
