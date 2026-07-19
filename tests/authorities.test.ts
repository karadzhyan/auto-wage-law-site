import test from 'node:test';
import assert from 'node:assert/strict';
import { authorities, getAuthorities, getAuthority } from '../src/data/authorities.ts';
import { legalConstants } from '../src/data/site.ts';

test('authority ids are unique and every record states a bounded official proposition', () => {
  assert.ok(authorities.length >= 30);
  assert.equal(new Set(authorities.map((authority) => authority.id)).size, authorities.length);

  for (const authority of authorities) {
    assert.match(authority.url, /^https:\/\//);
    assert.ok(
      ['statute', 'regulation', 'wage-order', 'case', 'agency-guidance'].includes(authority.sourceType),
      `${authority.id} has an unsupported source type`,
    );
    assert.ok(authority.proposition.length >= 35, `${authority.id} needs a substantive proposition`);
    assert.ok(authority.limits.length >= 20, `${authority.id} needs an explicit limit`);
    assert.equal(authority.checked, '2026-07-18');
  }
});

test('authority lookup is deterministic and rejects unknown ids', () => {
  const section2262 = getAuthority('ca-labor-226-2');
  assert.equal(section2262.shortLabel, 'Labor Code § 226.2');
  assert.match(section2262.proposition, /piece-rate/i);
  assert.throws(() => getAuthority('not-an-authority' as never), /Unknown authority/);
});

test('batch authority lookup preserves the requested order', () => {
  const result = getAuthorities(['flsa-13b10', 'encino', 'ca-labor-510']);
  assert.deepEqual(result.map((authority) => authority.id), ['flsa-13b10', 'encino', 'ca-labor-510']);
});

test('2026 California and federal constants disclose formulas, sources, and limits', () => {
  assert.equal(legalConstants.californiaMinimumWage.value, 16.9);
  assert.equal(legalConstants.californiaCommissionThreshold.value, 25.35);
  assert.equal(legalConstants.californiaHandToolThreshold.value, 33.8);
  assert.equal(legalConstants.californiaSalaryThreshold.value, 70_304);
  assert.equal(legalConstants.federalSalaryWeekly.value, 684);
  assert.equal(legalConstants.federal7iThreshold.value, 10.875);

  for (const constant of Object.values(legalConstants)) {
    assert.ok(constant.formula.length > 5);
    assert.ok(constant.authorityIds.length > 0);
    assert.ok(constant.limit.length > 20);
    assert.equal(constant.checked, '2026-07-18');
  }
});

