import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, projectRoot), 'utf8');

test('publishes three canonical analytical instruments', async () => {
  const required = [
    'src/pages/tools/pay-system-analyzer.astro',
    'src/pages/tools/wage-scenario-lab.astro',
    'src/pages/tools/commission-ledger.astro',
    'src/components/tools/PaySystemAnalyzer.astro',
    'src/components/tools/WageScenarioLab.astro',
    'src/components/tools/CommissionLedger.astro',
    'src/scripts/pay-system-analyzer.ts',
    'src/scripts/wage-scenario-lab.ts',
    'src/scripts/commission-ledger.ts',
  ];

  await Promise.all(required.map(async (path) => assert.ok((await read(path)).length > 100, `${path} is missing or empty`)));
});

test('interfaces bind the tested domain models instead of duplicating their reasoning', async () => {
  const scripts = (
    await Promise.all([
      read('src/scripts/pay-system-analyzer.ts'),
      read('src/scripts/wage-scenario-lab.ts'),
      read('src/scripts/commission-ledger.ts'),
    ])
  ).join('\n');

  assert.match(scripts, /analyzePaySystem/);
  assert.match(scripts, /calculateWageScenarios/);
  assert.match(scripts, /reconcileLedger/);
  assert.match(scripts, /analyzeTransactionEvidence/);
});

test('tool inputs remain ephemeral and browser-local', async () => {
  const files = await Promise.all([
    read('src/components/tools/PaySystemAnalyzer.astro'),
    read('src/components/tools/WageScenarioLab.astro'),
    read('src/components/tools/CommissionLedger.astro'),
    read('src/scripts/pay-system-analyzer.ts'),
    read('src/scripts/wage-scenario-lab.ts'),
    read('src/scripts/commission-ledger.ts'),
  ]);
  const source = files.join('\n');

  assert.match(source, /browser|local|device/i);
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB/i);
  assert.doesNotMatch(source, /risk score|claim value|compliance verdict|liability finding/i);
});

test('each instrument states its analytical boundary in the visible interface', async () => {
  const analyzer = await read('src/components/tools/PaySystemAnalyzer.astro');
  const scenarios = await read('src/components/tools/WageScenarioLab.astro');
  const ledger = await read('src/components/tools/CommissionLedger.astro');

  assert.match(analyzer, /Facts to reconcile|Predicates to test|Records to pull/);
  assert.match(analyzer, /does not reach a legal conclusion/i);
  assert.match(scenarios, /Low|Base|High/);
  assert.match(scenarios, /arithmetic on entered assumptions/i);
  assert.match(ledger, /Classification|Earning event|Payment timing|Debit \/ chargeback basis/);
  assert.match(ledger, /synthetic/i);
});

test('legacy tool URLs redirect to the canonical instruments', async () => {
  const payPlan = await read('src/pages/tools/pay-plan-check.astro');
  const exposure = await read('src/pages/tools/exposure-snapshot.astro');
  const config = await read('astro.config.mjs');

  assert.match(payPlan, /Astro\.redirect\('\/tools\/pay-system-analyzer\/'/);
  assert.match(exposure, /Astro\.redirect\('\/tools\/wage-scenario-lab\/'/);
  assert.match(config, /'\/pay-plan-auditor': '\/tools\/pay-system-analyzer\/'/);
  assert.match(config, /'\/tools\/pay-plan-auditor': '\/tools\/pay-system-analyzer\/'/);
  assert.match(config, /'\/exposure-model': '\/tools\/wage-scenario-lab\/'/);
  assert.match(config, /'\/tools\/exposure-model': '\/tools\/wage-scenario-lab\/'/);
});

test('dense instruments preserve complete desktop output and mobile-sized controls', async () => {
  const scenarios = await read('src/components/tools/WageScenarioLab.astro');
  const ledger = await read('src/components/tools/CommissionLedger.astro');

  assert.match(scenarios, /table\s*\{[^}]*min-width:\s*39rem/s);
  assert.match(scenarios, /\.toggle\s*\{[^}]*min-height:\s*2\.75rem/s);
  assert.match(scenarios, /\.reset-button,[^{]+\{[^}]*min-height:\s*2\.75rem/s);
  assert.match(ledger, /\.tool-button,[^{]+\{[^}]*min-height:\s*2\.75rem/s);
  assert.match(ledger, /\.ledger-filters button\s*\{[^}]*min-height:\s*2\.75rem/s);
  assert.match(ledger, /\.row-select\s*\{[^}]*min-height:\s*2\.75rem/s);
});
