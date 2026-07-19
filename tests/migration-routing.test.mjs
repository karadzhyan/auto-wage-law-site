import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

const legacySuccessors = {
  '/index.html': '/',
  '/about.html': '/about/',
  '/case-library.html': '/authorities/',
  '/compliance.html': '/dealers/',
  '/developments.html': '/developments/',
  '/disclaimer.html': '/disclaimer/',
  '/es/index.html': '/es/',
  '/faq.html': '/law-library/',
  '/glossary.html': '/law-library/',
  '/knowledge-base.html': '/law-library/',
  '/workers.html': '/workers/',
  '/analysis/index.html': '/analysis-map/',
  '/analysis/output-vs-time.html': '/analysis-map/',
  '/analysis/exposure-model.html': '/tools/wage-scenario-lab/',
  '/analysis/am-i-affected.html': '/tools/pay-system-analyzer/',
  '/analysis/authorities.html': '/authorities/',
  '/pay-plans/index.html': '/pay-plans/',
  '/pay-plans/commissioned-sales.html': '/pay-plans/commissioned-sales/',
  '/pay-plans/fi-managers.html': '/pay-plans/fi-managers/',
  '/pay-plans/flat-rate-technicians.html': '/pay-plans/flat-rate-technicians/',
  '/pay-plans/parts-and-support.html': '/pay-plans/parts-and-support/',
  '/pay-plans/service-advisors.html': '/pay-plans/service-advisors/',
  '/issues/index.html': '/issues/',
  '/issues/commission-chargebacks.html': '/issues/commission-chargebacks/',
  '/issues/meal-rest-breaks.html': '/issues/meal-rest-breaks/',
  '/issues/minimum-wage.html': '/issues/minimum-wage/',
  '/issues/off-the-clock.html': '/issues/off-the-clock/',
  '/issues/overtime-exemptions.html': '/issues/overtime-exemptions/',
  '/issues/regular-rate.html': '/issues/regular-rate/',
  '/issues/rest-period-nonproductive-pay.html': '/issues/rest-period-nonproductive-pay/',
  '/issues/tools-uniforms-expenses.html': '/issues/tools-uniforms-expenses/',
  '/issues/wage-statements.html': '/records/',
  '/issues/misclassification.html': '/analysis-map/',
  '/issues/paga-class-arbitration.html': '/analysis-map/',
  '/tools/index.html': '/tools/',
  '/tools/auditor.html': '/tools/pay-system-analyzer/',
  '/tools/back-pay-estimate.html': '/tools/wage-scenario-lab/',
  '/tools/deadlines.html': '/law-library/',
  '/tools/diagnostic.html': '/tools/pay-system-analyzer/',
  '/tools/hello-instrument.html': '/tools/',
  '/tools/lookback.html': '/tools/wage-scenario-lab/',
  '/tools/overtime.html': '/issues/overtime-exemptions/',
  '/tools/pay-plan-auditor.html': '/tools/pay-system-analyzer/',
  '/tools/regular-rate.html': '/issues/regular-rate/',
  '/tools/search.html': '/law-library/',
  '/tools/worked-week.html': '/analysis-map/',
};

const canonicalAliases = {
  '/pay-plan-auditor/': '/tools/pay-system-analyzer/',
  '/tools/pay-plan-auditor/': '/tools/pay-system-analyzer/',
  '/exposure-model/': '/tools/wage-scenario-lab/',
  '/tools/exposure-model/': '/tools/wage-scenario-lab/',
  '/coverage-matrix/': '/pay-plans/',
  '/resources/': '/law-library/',
  '/briefs/': '/law-library/',
  '/for-dealers/': '/dealers/',
  '/for-workers/': '/workers/',
  '/tools/exposure-snapshot/': '/tools/wage-scenario-lab/',
  '/tools/pay-plan-check/': '/tools/pay-system-analyzer/',
};

test('every emitted legacy page has an explicit permanent successor', async () => {
  const config = JSON.parse(await read('vercel.json'));
  const redirects = new Map(config.redirects.map((item) => [item.source, item]));

  assert.equal(Object.keys(legacySuccessors).length, 46);
  for (const [source, destination] of Object.entries(legacySuccessors)) {
    assert.deepEqual(redirects.get(source), { source, destination, permanent: true }, source);
  }
});

test('migration preserves the www canonical host and sitemap compatibility', async () => {
  const [astroConfig, robots, vercelConfig] = await Promise.all([
    read('astro.config.mjs'),
    read('public/robots.txt'),
    read('vercel.json').then(JSON.parse),
  ]);

  assert.match(astroConfig, /site:\s*'https:\/\/www\.autowagelaw\.com'/);
  assert.match(robots, /Sitemap:\s+https:\/\/www\.autowagelaw\.com\/sitemap-index\.xml/);
  assert.ok(
    vercelConfig.redirects.some(({ source, destination, permanent }) =>
      source === '/sitemap.xml' && destination === '/sitemap-index.xml' && permanent === true),
  );
});

test('redirect-only aliases intercept their trailing-slash production URLs', async () => {
  const config = JSON.parse(await read('vercel.json'));
  const redirects = new Map(config.redirects.map((item) => [item.source, item]));

  for (const [source, destination] of Object.entries(canonicalAliases)) {
    assert.deepEqual(redirects.get(source), { source, destination, permanent: true }, source);
  }
});

test('redirect-only Astro pages are excluded from the canonical sitemap', async () => {
  const config = await read('astro.config.mjs');
  for (const path of [
    '/pay-plan-auditor/',
    '/tools/pay-plan-auditor/',
    '/exposure-model/',
    '/tools/exposure-model/',
    '/coverage-matrix/',
    '/resources/',
    '/briefs/',
    '/for-dealers/',
    '/for-workers/',
    '/tools/exposure-snapshot/',
    '/tools/pay-plan-check/',
  ]) {
    assert.ok(config.includes(`'${path}'`), `missing sitemap exclusion for ${path}`);
  }
  assert.match(config, /sitemap\(\{\s*filter:/s);
});
