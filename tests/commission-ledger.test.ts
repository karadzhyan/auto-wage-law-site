import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeTransactionEvidence,
  reconcileLedger,
  seedTransactions,
  type LedgerTransaction,
} from '../src/lib/tools/commission-ledger.ts';

test('reconciles wage, commission, draw, debit, and net layers without classifying legality', () => {
  const result = reconcileLedger(seedTransactions);

  assert.deepEqual(result.totals, {
    baseWages: 6_640,
    commissionCredits: 1_660,
    draws: 3_000,
    otherCredits: 0,
    debits: 1_280,
    netBeforeTaxes: 10_020,
  });
  assert.equal(result.transactionCount, 5);
  assert.deepEqual(result.unresolvedIds, ['lee-d18497', 'monthly-draw']);
  assert.doesNotMatch(JSON.stringify(result), /lawful|unlawful|valid chargeback|earned commission|liability/i);
});

test('transaction evidence analysis separates four questions and identifies missing proof', () => {
  const transaction = seedTransactions.find((entry) => entry.id === 'lee-d18497');
  assert.ok(transaction);
  const questions = analyzeTransactionEvidence(transaction);

  assert.deepEqual(questions.map((question) => question.id), [
    'classification',
    'earning-event',
    'payment-timing',
    'debit-basis',
  ]);
  assert.ok(questions.every((question) => question.authorityIds.length > 0));
  assert.ok(questions.find((question) => question.id === 'earning-event')?.proofPresent.includes('Written earning condition'));
  assert.ok(questions.find((question) => question.id === 'debit-basis')?.proofMissing.includes('Plan language connecting the identified event to the debit'));
});

test('complete proof changes evidence status without deciding the legal result', () => {
  const complete: LedgerTransaction = {
    id: 'complete-1',
    eventLabel: 'Synthetic deal / C-100',
    eventDate: '2026-06-10',
    component: 'commission-credit',
    planEvent: 'Delivered and funded',
    credit: 500,
    debit: 100,
    status: 'trace-complete',
    conditionText: 'Commission is credited at delivery and subject to an identified cancellation condition.',
    conditionEvidence: 'Delivery record and cancellation record.',
    originalStatementLine: '06/30 commission credit $500',
    debitStatementLine: '07/31 identified reversal $100',
    reasonCode: 'Partial product cancellation',
    acknowledgment: 'Signed 2026 plan receipt.',
  };

  const questions = analyzeTransactionEvidence(complete);
  assert.ok(questions.every((question) => question.status === 'record-present'));
  assert.doesNotMatch(JSON.stringify(questions), /approved|permitted|prohibited|lawful|valid/i);
});

test('returns fresh result collections for each reconciliation', () => {
  const first = reconcileLedger(seedTransactions);
  first.unresolvedIds.push('mutation');
  const second = reconcileLedger(seedTransactions);
  assert.ok(!second.unresolvedIds.includes('mutation'));
});

test('rejects duplicate ids, negative amounts, nonfinite values, and missing labels', () => {
  assert.throws(() => reconcileLedger([...seedTransactions, seedTransactions[0]]), /duplicate transaction id/i);
  assert.throws(
    () => reconcileLedger([{ ...seedTransactions[0], id: 'negative', credit: -1 }]),
    RangeError,
  );
  assert.throws(
    () => reconcileLedger([{ ...seedTransactions[0], id: 'infinite', debit: Infinity }]),
    RangeError,
  );
  assert.throws(
    () => reconcileLedger([{ ...seedTransactions[0], id: 'blank', eventLabel: '   ' }]),
    /event label/i,
  );
});

test('seed data is synthetic and contains no personal identifiers', () => {
  const text = JSON.stringify(seedTransactions);
  assert.doesNotMatch(text, /@|\b\d{3}-\d{2}-\d{4}\b|VIN|employee id|account number/i);
  assert.ok(seedTransactions.every((transaction) => transaction.eventLabel.includes('/') || transaction.component === 'base-wage' || transaction.component === 'draw'));
});
