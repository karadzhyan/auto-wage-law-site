import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateExposure } from '../src/lib/tools/exposure.ts';

test('calculates the exact approved wages-only fixture', () => {
  const result = calculateExposure({
    employeeCount: 12,
    weeklyGapHours: 2.5,
    regularRate: 28,
    lookbackYears: 3,
  });

  assert.equal(result.wagesOnly, 131_040);
  assert.equal(result.groupWeeklyGapHours, 30);
  assert.equal(result.weeks, 156);
});

test('returns zero when any exposure multiplier is zero', () => {
  const result = calculateExposure({
    employeeCount: 0,
    weeklyGapHours: 2,
    regularRate: 25,
    lookbackYears: 3,
  });

  assert.equal(result.wagesOnly, 0);
});

test('rounds the wages-only result to cents', () => {
  const result = calculateExposure({
    employeeCount: 3,
    weeklyGapHours: 1.25,
    regularRate: 22.73,
    lookbackYears: 1.5,
  });

  assert.equal(result.wagesOnly, 6_648.53);
});

test('names material categories excluded from the orientation', () => {
  const result = calculateExposure({
    employeeCount: 4,
    weeklyGapHours: 1,
    regularRate: 20,
    lookbackYears: 1,
  });

  assert.deepEqual(result.excludedCategories, [
    'penalties',
    'interest',
    'attorney fees and costs',
    'taxes and withholding',
    'premium-pay theories',
    'claim-specific defenses',
  ]);
});

test('rejects negative, non-finite, or fractional employee inputs', () => {
  assert.throws(
    () => calculateExposure({ employeeCount: -1, weeklyGapHours: 1, regularRate: 20, lookbackYears: 1 }),
    RangeError,
  );
  assert.throws(
    () => calculateExposure({ employeeCount: 1.5, weeklyGapHours: 1, regularRate: 20, lookbackYears: 1 }),
    RangeError,
  );
  assert.throws(
    () => calculateExposure({ employeeCount: 1, weeklyGapHours: 1, regularRate: Infinity, lookbackYears: 1 }),
    RangeError,
  );
});
