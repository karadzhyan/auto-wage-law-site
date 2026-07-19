import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, projectRoot), 'utf8');

test('keeps the permanent dependency surface intentionally small', async () => {
  const packageJson = JSON.parse(await read('package.json'));
  const dependencies = Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies });
  const forbidden = ['react', 'next', 'tailwindcss', '@astrojs/react', 'vue', 'svelte'];

  for (const dependency of forbidden) assert.ok(!dependencies.includes(dependency), `${dependency} must not be added`);
  assert.ok(dependencies.length <= 7, `expected at most 7 direct dependencies, found ${dependencies.length}`);
});

test('publishes exactly five pay-plan articles and eight issue articles', async () => {
  const contentRoot = new URL('src/content/articles/', projectRoot);
  const payPlans = (await readdir(new URL('pay-plans/', contentRoot))).filter((file) => file.endsWith('.md'));
  const issues = (await readdir(new URL('issues/', contentRoot))).filter((file) => file.endsWith('.md'));

  assert.equal(payPlans.length, 5);
  assert.equal(issues.length, 8);
});

test('locks the approved analytical homepage copy', async () => {
  const homepage = await read('src/pages/index.astro');

  assert.match(homepage, /Map the pay system before you judge the result\./);
  assert.match(homepage, /A disciplined wage-and-hour review separates the work, the pay rule, the legal test, the records, and the consequence\./);
  assert.match(homepage, /Open the analysis map/);
  assert.match(homepage, /Start with a dealership role/);
});

test('keeps tool inputs browser-local and outputs educational', async () => {
  const files = await Promise.all([
    read('src/components/tools/PaySystemAnalyzer.astro'),
    read('src/components/tools/WageScenarioLab.astro'),
    read('src/components/tools/CommissionLedger.astro'),
  ]);
  const tools = files.join('\n');

  assert.match(tools, /browser|local|device/i);
  assert.match(tools, /legal conclusion|entered assumptions|transaction/i);
  assert.doesNotMatch(tools, /fetch\(|XMLHttpRequest|sendBeacon/);
});

test('includes every launch-critical page source', async () => {
  const required = [
    'src/pages/index.astro',
    'src/pages/dealers.astro',
    'src/pages/workers.astro',
    'src/pages/law-library.astro',
    'src/pages/developments.astro',
    'src/pages/analysis-map.astro',
    'src/pages/records.astro',
    'src/pages/authorities.astro',
    'src/pages/tools/index.astro',
    'src/pages/tools/pay-system-analyzer.astro',
    'src/pages/tools/wage-scenario-lab.astro',
    'src/pages/tools/commission-ledger.astro',
    'src/pages/pay-plans/index.astro',
    'src/pages/issues/index.astro',
    'src/pages/about.astro',
    'src/pages/disclaimer.astro',
    'src/pages/404.astro',
  ];

  await Promise.all(required.map(async (path) => assert.ok((await read(path)).length > 50, `${join(path)} is empty`)));
});
