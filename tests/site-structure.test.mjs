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

test('locks the approved above-the-fold homepage copy', async () => {
  const homepage = await read('src/pages/index.astro');

  assert.match(homepage, /Dealership pay,/);
  assert.match(homepage, /measured against the law\./);
  assert.match(homepage, /Independent guidance for the people who run dealerships and the people who work in them\./);
  assert.match(homepage, /Find your pay plan/);
  assert.match(homepage, /Run a self-audit/);
});

test('keeps tool inputs browser-local and outputs educational', async () => {
  const files = await Promise.all([
    read('src/components/tools/PayPlanCheck.astro'),
    read('src/components/tools/ExposureSnapshot.astro'),
  ]);
  const tools = files.join('\n');

  assert.match(tools, /Inputs stay in this browser|browser local/i);
  assert.match(tools, /does not decide whether any law was violated/i);
  assert.match(tools, /Not a claim valuation/i);
  assert.doesNotMatch(tools, /fetch\(|XMLHttpRequest|sendBeacon/);
});

test('includes every launch-critical page source', async () => {
  const required = [
    'src/pages/index.astro',
    'src/pages/dealers.astro',
    'src/pages/workers.astro',
    'src/pages/law-library.astro',
    'src/pages/developments.astro',
    'src/pages/tools/index.astro',
    'src/pages/tools/pay-plan-check.astro',
    'src/pages/tools/exposure-snapshot.astro',
    'src/pages/pay-plans/index.astro',
    'src/pages/issues/index.astro',
    'src/pages/about.astro',
    'src/pages/disclaimer.astro',
    'src/pages/404.astro',
  ];

  await Promise.all(required.map(async (path) => assert.ok((await read(path)).length > 50, `${join(path)} is empty`)));
});
