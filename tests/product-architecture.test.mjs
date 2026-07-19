import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, projectRoot), 'utf8');

test('publishes the canonical analytical routes and shared components', async () => {
  const required = [
    'src/pages/analysis-map.astro',
    'src/pages/records.astro',
    'src/pages/authorities.astro',
    'src/components/AnalysisSequence.astro',
    'src/components/RoleIssueCrosswalk.astro',
    'src/components/EvidenceMap.astro',
    'src/components/AuthorityStack.astro',
    'src/components/SourceCheck.astro',
  ];

  await Promise.all(required.map(async (path) => assert.ok((await read(path)).length > 100, `${path} is missing or empty`)));
});

test('locks the upgraded homepage thesis and analytical sequence', async () => {
  const homepage = await read('src/pages/index.astro');

  assert.match(homepage, /Map the pay system before you judge the result\./);
  assert.match(homepage, /A disciplined wage-and-hour review separates the work, the pay rule, the legal test, the records, and the consequence\./);
  assert.match(homepage, /Open the analysis map/);
  assert.match(homepage, /Start with a dealership role/);
  assert.match(homepage, /AnalysisSequence/);
  assert.match(homepage, /RoleIssueCrosswalk/);
  assert.doesNotMatch(homepage, /ExposurePreview|risk score|overall exposure|high exposure|low exposure/i);
});

test('primary navigation uses the five product routes and canonical analyzer action', async () => {
  const navigation = await read('src/data/navigation.ts');
  const header = await read('src/components/SiteHeader.astro');

  for (const label of ['Dealers', 'Workers', 'Analysis map', 'Law library', 'Tools']) {
    assert.match(navigation, new RegExp(`label: '${label}'`));
  }
  assert.doesNotMatch(navigation, /label: 'Developments'/);
  assert.match(header, /Analyze a pay system/);
  assert.match(header, /\/tools\/pay-system-analyzer\//);
});

test('source-check UI replaces anonymous confidence or review stamps', async () => {
  const layout = await read('src/layouts/ArticleLayout.astro');
  assert.match(layout, /SourceCheck/);
  assert.doesNotMatch(layout, /Editorial status|High confidence|confidence/);
});

test('authority and evidence pages expose both proposition and inferential limit', async () => {
  const pages = `${await read('src/pages/authorities.astro')}\n${await read('src/pages/records.astro')}`;
  assert.match(pages, /What it does not decide|What this record cannot establish alone/);
  assert.match(pages, /source checked/i);
  assert.doesNotMatch(pages, /confidence badge|risk score/i);
});

test('dealer and worker paths use the same bounded analytical architecture', async () => {
  const dealer = await read('src/pages/dealers.astro');
  const worker = await read('src/pages/workers.astro');
  const split = await read('src/components/AudienceSplit.astro');
  const source = `${dealer}\n${worker}\n${split}`;

  assert.match(dealer, /Audit the pay system before a dispute defines it\./);
  assert.match(worker, /Reconstruct the work, the pay rule, and the record\./);
  assert.match(source, /\/tools\/pay-system-analyzer\//);
  assert.match(source, /\/tools\/wage-scenario-lab\//);
  assert.match(source, /\/records\//);
  assert.doesNotMatch(source, /Find the exposure|what your pay plan actually owes you|pay-plan-check|exposure-snapshot/i);
});

test('the role crosswalk leads the post-hero hierarchy and mobile reference rails collapse', async () => {
  const homepage = await read('src/pages/index.astro');
  const article = await read('src/layouts/ArticleLayout.astro');
  const timeline = await read('src/components/WorkdayTimeline.astro');

  assert.ok(homepage.indexOf('<RoleIssueCrosswalk') < homepage.indexOf('<AudienceSplit'));
  assert.match(article, /<details[^>]*class="mobile-context-section"/);
  assert.match(article, /<summary>Evidence boundaries/);
  assert.match(article, /<summary>Authority boundaries/);
  assert.match(timeline, /\.pay-point\s*\{[^}]*white-space:\s*nowrap/s);
});

test('article titles preserve whole words at narrow widths', async () => {
  const article = await read('src/layouts/ArticleLayout.astro');

  assert.doesNotMatch(article, /\.article-hero h1\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(article, /\.article-hero h1\s*\{[^}]*overflow-wrap:\s*normal[^}]*word-break:\s*normal/s);
  assert.match(article, /@media \(max-width:\s*56rem\)[\s\S]*\.article-hero h1\s*\{\s*font-size:\s*clamp\(2\.2rem,\s*11vw,\s*4\.4rem\)/);
});

test('semantic small-text tokens meet WCAG AA on every light product surface', async () => {
  const [tokens, ledger, analyzer] = await Promise.all([
    read('src/styles/tokens.css'),
    read('src/components/tools/CommissionLedger.astro'),
    read('src/components/tools/PaySystemAnalyzer.astro'),
  ]);
  const token = (name) => {
    const match = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'));
    assert.ok(match, `missing --${name}`);
    return match[1];
  };
  const luminance = (hex) => {
    const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => Number.parseInt(value, 16) / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (foreground, background) => {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };

  for (const foreground of [token('color-muted'), token('color-signal-text')]) {
    for (const background of ['#ffffff', '#f5f8fc', '#f2f7ff', '#eaf1f8']) {
      assert.ok(contrast(foreground, background) >= 4.5, `${foreground} fails AA on ${background}`);
    }
  }
  assert.doesNotMatch(`${ledger}\n${analyzer}`, /color:\s*var\(--color-signal\)/);
  assert.match(`${ledger}\n${analyzer}`, /color:\s*var\(--color-signal-text\)/);
});

test('the Spanish orientation route carries a localized global shell', async () => {
  const [base, header, footer, spanish] = await Promise.all([
    read('src/layouts/BaseLayout.astro'),
    read('src/components/SiteHeader.astro'),
    read('src/components/SiteFooter.astro'),
    read('src/pages/es/index.astro'),
  ]);

  assert.match(base, /<SiteHeader lang=\{lang\}/);
  assert.match(base, /<SiteFooter lang=\{lang\}/);
  assert.match(header, /Mapa de análisis/);
  assert.match(header, /Analizar un sistema de pago/);
  assert.match(footer, /Recurso educativo independiente/);
  assert.match(footer, /Fuentes verificadas/);
  assert.doesNotMatch(spanish, /<ArrowIcon/);
});
