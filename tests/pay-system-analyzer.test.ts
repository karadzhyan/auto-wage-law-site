import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePaySystem, type AnalyzerInput } from '../src/lib/tools/pay-system-analyzer.ts';

const hourlyFixture: AnalyzerInput = {
  jurisdiction: 'california-federal',
  establishment: 'dealer-connected',
  role: 'support',
  primaryPayMethod: 'hourly',
  secondaryPayMethod: 'none',
  workedHours: 40,
  accountedHours: 40,
  pieceWorkOccurred: false,
  restCompensation: 'not-applicable',
  nonproductiveCompensation: 'not-applicable',
  signedCommissionPlan: 'not-applicable',
  formulaAvailable: true,
  timeRecordComplete: true,
  productionRecordAvailable: true,
  establishmentRecordsAvailable: true,
  dutiesEvidenceAvailable: true,
  representativePeriodAvailable: false,
  weeklyRateCalculationAvailable: true,
  salaryBasisRecordsAvailable: false,
  claimedOvertimeRoute: 'none',
};

test('ordinary hourly input does not receive piece-rate or commission-plan false positives', () => {
  const result = analyzePaySystem(hourlyFixture);
  const text = result.findings.map((finding) => `${finding.id} ${finding.title} ${finding.basis}`).join(' ');

  assert.equal(result.hoursToReconcile, 0);
  assert.doesNotMatch(text, /226\.2|piece-rate statement|signed commission plan/i);
  assert.ok(result.findings.some((finding) => finding.status === 'supported-by-inputs'));
  assert.match(result.summary, /1 independent dimension remains in scope/i);
});

test('piece-rate technician fixture surfaces separate classification, measurement, and record questions', () => {
  const result = analyzePaySystem({
    ...hourlyFixture,
    role: 'technician',
    primaryPayMethod: 'piece-rate',
    workedHours: 46,
    accountedHours: 38,
    pieceWorkOccurred: true,
    restCompensation: 'not-shown',
    nonproductiveCompensation: 'unknown',
    formulaAvailable: false,
    productionRecordAvailable: false,
    dutiesEvidenceAvailable: false,
    claimedOvertimeRoute: '13b10',
  });

  assert.equal(result.hoursToReconcile, 8);
  assert.ok(result.findings.some((finding) => finding.id === 'time-reconciliation'));
  assert.ok(result.findings.some((finding) => finding.id === 'piece-rate-rest'));
  assert.ok(result.findings.some((finding) => finding.id === 'piece-rate-npt'));
  assert.ok(result.findings.some((finding) => finding.id === 'piece-formula-record'));
  assert.ok(result.findings.some((finding) => finding.authorityIds.includes('ca-labor-226-2')));
  assert.match(result.summary, /8 hours to classify and reconcile/i);
  assert.doesNotMatch(result.summary, /8 (unpaid|owed) hours/i);
});

test('commission input tests section 2751 writing facts without importing piece-rate statement rules', () => {
  const result = analyzePaySystem({
    ...hourlyFixture,
    role: 'sales',
    primaryPayMethod: 'commission',
    secondaryPayMethod: 'hourly',
    restCompensation: 'unknown',
    nonproductiveCompensation: 'not-applicable',
    signedCommissionPlan: 'no',
    claimedOvertimeRoute: '7i',
    representativePeriodAvailable: false,
    weeklyRateCalculationAvailable: false,
  });

  const text = result.findings.map((finding) => `${finding.title} ${finding.basis}`).join(' ');
  assert.ok(result.findings.some((finding) => finding.id === 'commission-writing'));
  assert.ok(result.findings.some((finding) => finding.id === 'commission-rest-method'));
  assert.ok(result.findings.some((finding) => finding.id === 'federal-7i-route'));
  assert.doesNotMatch(text, /piece-rate statement|other nonproductive time under section 226\.2/i);
});

test('establishment context routes the wage-order question instead of hard-coding Order 7', () => {
  const dealer = analyzePaySystem({ ...hourlyFixture, establishment: 'dealer-connected' });
  const standalone = analyzePaySystem({ ...hourlyFixture, establishment: 'standalone-repair' });
  const unknown = analyzePaySystem({ ...hourlyFixture, establishment: 'unknown' });

  assert.equal(dealer.context.wageOrderRoute, 'Wage Order 7 starting route');
  assert.equal(standalone.context.wageOrderRoute, 'Wage Order 9 starting route');
  assert.equal(unknown.context.wageOrderRoute, 'Establishment facts required');
  assert.ok(unknown.findings.some((finding) => finding.id === 'wage-order-selection'));
});

test('service-advisor dealership route states Encino federal scope and preserves California as a separate test', () => {
  const result = analyzePaySystem({
    ...hourlyFixture,
    role: 'advisor',
    primaryPayMethod: 'mixed',
    secondaryPayMethod: 'commission',
    signedCommissionPlan: 'yes',
    claimedOvertimeRoute: '13b10',
  });

  const route = result.findings.find((finding) => finding.id === 'federal-13b10-route');
  assert.ok(route);
  assert.ok(route.authorityIds.includes('encino'));
  assert.match(route.whyItMatters, /federal overtime only/i);
  assert.match(route.limits, /California/i);
});

test('section 7(i) treats missing weekly-rate and representative-period records as evidence findings', () => {
  const result = analyzePaySystem({
    ...hourlyFixture,
    role: 'finance',
    primaryPayMethod: 'commission',
    signedCommissionPlan: 'yes',
    claimedOvertimeRoute: '7i',
    representativePeriodAvailable: false,
    weeklyRateCalculationAvailable: false,
  });

  const finding = result.findings.find((candidate) => candidate.id === 'federal-7i-route');
  assert.ok(finding);
  assert.match(finding.basis, /three predicates/i);
  assert.ok(finding.proofToPull.some((record) => /representative period/i.test(record)));
  assert.ok(finding.proofToPull.some((record) => /workweek/i.test(record)));
  assert.ok(finding.authorityIds.includes('cfr-516-16'));
});

test('all outputs remain questions and record reconciliations rather than legal conclusions', () => {
  const result = analyzePaySystem({ ...hourlyFixture, workedHours: 44, accountedHours: 40 });
  const serialized = JSON.stringify(result);

  assert.doesNotMatch(serialized, /\bcompliant\b|\bviolation\b|\billegal\b|risk score|claim value/i);
  assert.doesNotMatch(serialized, /potential unpaid|unpaid hours/i);
  assert.match(serialized, /no legal conclusion/i);
});

test('rejects incoherent or nonfinite period inputs', () => {
  assert.throws(() => analyzePaySystem({ ...hourlyFixture, workedHours: -1 }), RangeError);
  assert.throws(() => analyzePaySystem({ ...hourlyFixture, accountedHours: Number.NaN }), RangeError);
  assert.throws(
    () => analyzePaySystem({ ...hourlyFixture, pieceWorkOccurred: true, primaryPayMethod: 'hourly', secondaryPayMethod: 'none' }),
    /piece-rate pay method/i,
  );
});
