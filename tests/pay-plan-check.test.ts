import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePayPlan } from '../src/lib/tools/pay-plan-check.ts';

test('reports no potential time gap when paid hours match onsite hours', () => {
  const finding = evaluatePayPlan({
    role: 'technician',
    payMethod: 'hourly',
    onsiteHours: 40,
    paidHours: 40,
    restPayShown: true,
    writtenPlanAvailable: true,
  });

  assert.equal(finding.severity, 'clear');
  assert.equal(finding.potentialGapHours, 0);
  assert.match(finding.title, /No time gap/i);
});

test('finds the exact eight-hour gap in the approved tool fixture', () => {
  const finding = evaluatePayPlan({
    role: 'technician',
    payMethod: 'piece-rate',
    onsiteHours: 46,
    paidHours: 38,
    restPayShown: false,
    writtenPlanAvailable: false,
  });

  assert.equal(finding.severity, 'gap');
  assert.equal(finding.potentialGapHours, 8);
  assert.ok(finding.reasons.some((reason) => /46.*38|38.*46/.test(reason)));
  assert.ok(finding.nextSteps.some((step) => /time record/i.test(step)));
});

test('rounds a fractional potential gap to two decimal places', () => {
  const finding = evaluatePayPlan({
    role: 'sales',
    payMethod: 'commission',
    onsiteHours: 43.337,
    paidHours: 40.111,
    restPayShown: true,
    writtenPlanAvailable: true,
  });

  assert.equal(finding.potentialGapHours, 3.23);
});

test('flags a missing written incentive-pay plan for review without declaring a violation', () => {
  const finding = evaluatePayPlan({
    role: 'finance',
    payMethod: 'commission',
    onsiteHours: 40,
    paidHours: 40,
    restPayShown: true,
    writtenPlanAvailable: false,
  });

  assert.equal(finding.severity, 'review');
  assert.ok(finding.reasons.some((reason) => /written plan/i.test(reason)));
  assert.doesNotMatch(`${finding.title} ${finding.reasons.join(' ')}`, /violation occurred|illegal/i);
});

test('rejects negative or non-finite hour inputs', () => {
  const base = {
    role: 'support' as const,
    payMethod: 'hourly' as const,
    restPayShown: true,
    writtenPlanAvailable: true,
  };

  assert.throws(() => evaluatePayPlan({ ...base, onsiteHours: -1, paidHours: 0 }), RangeError);
  assert.throws(() => evaluatePayPlan({ ...base, onsiteHours: 40, paidHours: Number.NaN }), RangeError);
});
