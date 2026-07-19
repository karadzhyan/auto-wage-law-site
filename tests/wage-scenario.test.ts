import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWageScenarios, type ScenarioInput } from '../src/lib/tools/wage-scenario.ts';

const fixture: ScenarioInput = {
  employees: 12,
  workweeks: 156,
  gaps: { low: 1, base: 2.5, high: 4 },
  straightTimeRate: 28,
  overtimeShare: 0.25,
  overtimeIncrement: 0.5,
  includeOvertime: true,
  premiumHoursPerWeek: 0,
  premiumRate: 31.4,
  includePremiumHours: false,
};

test('calculates three decomposed sensitivity rows from the entered assumptions', () => {
  const result = calculateWageScenarios(fixture);

  assert.deepEqual(result.rows.map((row) => row.id), ['low', 'base', 'high']);
  assert.deepEqual(result.rows[0], {
    id: 'low',
    weeklyGapHours: 1,
    straightTime: 52_416,
    overtimeIncrement: 6_552,
    premiumHours: 0,
    enteredTotal: 58_968,
  });
  assert.deepEqual(result.rows[1], {
    id: 'base',
    weeklyGapHours: 2.5,
    straightTime: 131_040,
    overtimeIncrement: 16_380,
    premiumHours: 0,
    enteredTotal: 147_420,
  });
  assert.deepEqual(result.rows[2], {
    id: 'high',
    weeklyGapHours: 4,
    straightTime: 209_664,
    overtimeIncrement: 26_208,
    premiumHours: 0,
    enteredTotal: 235_872,
  });
});

test('adds the optional premium-hours layer equally across gap sensitivities', () => {
  const result = calculateWageScenarios({
    ...fixture,
    includePremiumHours: true,
    premiumHoursPerWeek: 0.5,
  });

  assert.equal(result.rows[0].premiumHours, 29_390.4);
  assert.equal(result.rows[1].premiumHours, 29_390.4);
  assert.equal(result.rows[2].premiumHours, 29_390.4);
  assert.equal(result.rows[1].enteredTotal, 176_810.4);
});

test('removes an unselected layer without silently changing the other formulas', () => {
  const result = calculateWageScenarios({ ...fixture, includeOvertime: false });
  assert.equal(result.rows[1].straightTime, 131_040);
  assert.equal(result.rows[1].overtimeIncrement, 0);
  assert.equal(result.rows[1].enteredTotal, 131_040);
});

test('returns explicit formulas, inputs, and material exclusions', () => {
  const result = calculateWageScenarios(fixture);

  assert.match(result.formulas.straightTime, /employees.*workweeks.*weekly gap.*entered rate/i);
  assert.match(result.formulas.overtimeIncrement, /overtime share.*entered increment/i);
  assert.match(result.formulas.premiumHours, /premium hours.*premium rate/i);
  assert.deepEqual(result.excludedCategories, [
    'covered-hours determination',
    'applicable-rate determination',
    'class or group composition',
    'limitations-period selection',
    'penalties and liquidated damages',
    'interest',
    'attorney fees and costs',
    'taxes and withholding',
    'offsets and defenses',
    'local wage floors',
  ]);
  assert.match(result.interpretationBoundary, /arithmetic on entered assumptions/i);
});

test('uses low/base/high as ordered entered sensitivities, not probabilities', () => {
  assert.throws(
    () => calculateWageScenarios({ ...fixture, gaps: { low: 3, base: 2, high: 4 } }),
    /low.*base.*high/i,
  );
  assert.doesNotMatch(JSON.stringify(calculateWageScenarios(fixture)), /probability|likelihood|confidence|claim value|risk/i);
});

test('rejects invalid counts, ranges, rates, shares, and nonfinite values', () => {
  assert.throws(() => calculateWageScenarios({ ...fixture, employees: 1.5 }), RangeError);
  assert.throws(() => calculateWageScenarios({ ...fixture, workweeks: -1 }), RangeError);
  assert.throws(() => calculateWageScenarios({ ...fixture, straightTimeRate: Number.NaN }), RangeError);
  assert.throws(() => calculateWageScenarios({ ...fixture, overtimeShare: 1.01 }), RangeError);
  assert.throws(() => calculateWageScenarios({ ...fixture, overtimeIncrement: -0.5 }), RangeError);
  assert.throws(() => calculateWageScenarios({ ...fixture, premiumHoursPerWeek: Infinity }), RangeError);
});

test('returns zero layers for a zero-sized group without mutating shared exclusions', () => {
  const first = calculateWageScenarios({ ...fixture, employees: 0 });
  first.excludedCategories.push('mutation attempt');
  const second = calculateWageScenarios({ ...fixture, employees: 0 });

  assert.equal(second.rows[2].enteredTotal, 0);
  assert.ok(!second.excludedCategories.includes('mutation attempt'));
});
