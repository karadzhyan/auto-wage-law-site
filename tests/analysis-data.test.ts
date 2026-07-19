import test from 'node:test';
import assert from 'node:assert/strict';
import { analysisStages, getAnalysisStage, roleCrosswalk } from '../src/data/analysis.ts';
import { evidenceDomains, getEvidenceDomains } from '../src/data/evidence.ts';

test('analysis sequence is complete, ordered, and question-led', () => {
  assert.deepEqual(analysisStages.map((stage) => stage.id), [
    'facts',
    'classify',
    'measure',
    'test',
    'verify',
    'act',
  ]);
  assert.deepEqual(analysisStages.map((stage) => stage.number), ['01', '02', '03', '04', '05', '06']);
  for (const stage of analysisStages) {
    assert.match(stage.question, /\?$/);
    assert.ok(stage.prevents.length > 30);
    assert.ok(stage.records.length >= 2);
  }
  assert.equal(getAnalysisStage('measure').label, 'Measure');
});

test('role crosswalk covers every core dealership role without numerical risk scoring', () => {
  assert.deepEqual(roleCrosswalk.map((row) => row.id), ['technician', 'sales', 'advisor', 'finance', 'support']);
  for (const row of roleCrosswalk) {
    assert.deepEqual(Object.keys(row.cells), ['time', 'pay', 'coverage', 'records']);
    for (const cell of Object.values(row.cells)) {
      assert.ok(['primary', 'possible', 'exception-sensitive', 'not-typical'].includes(cell.emphasis));
      assert.doesNotMatch(`${cell.label} ${cell.detail}`, /\b\d{1,3}\s*%|score|high risk|low risk/i);
      assert.ok(cell.href.startsWith('/'));
    }
  }
});

test('evidence model states both probative value and inferential limit', () => {
  assert.ok(evidenceDomains.length >= 7);
  for (const domain of evidenceDomains) {
    assert.ok(domain.records.length >= 2);
    assert.ok(domain.canEstablish.length >= 30);
    assert.ok(domain.cannotEstablishAlone.length >= 30);
  }
  assert.deepEqual(
    getEvidenceDomains(['time', 'pay']).map((domain) => domain.id),
    ['time', 'pay'],
  );
});
