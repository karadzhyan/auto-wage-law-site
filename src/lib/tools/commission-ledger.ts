import type { AuthorityId } from '../../data/authorities.ts';

export type LedgerComponent = 'base-wage' | 'commission-credit' | 'draw' | 'debit' | 'other';
export type LedgerStatus = 'trace-complete' | 'test-condition' | 'verify-floor' | 'record-missing';

export type LedgerTransaction = {
  id: string;
  eventLabel: string;
  eventDate: string;
  component: LedgerComponent;
  planEvent: string;
  credit: number;
  debit: number;
  status: LedgerStatus;
  conditionText: string;
  conditionEvidence: string;
  originalStatementLine: string;
  debitStatementLine: string;
  reasonCode: string;
  acknowledgment: string;
};

export type LedgerTotals = {
  baseWages: number;
  commissionCredits: number;
  draws: number;
  otherCredits: number;
  debits: number;
  netBeforeTaxes: number;
};

export type LedgerResult = {
  transactionCount: number;
  totals: LedgerTotals;
  unresolvedIds: string[];
  scope: string;
};

export type LedgerQuestion = {
  id: 'classification' | 'earning-event' | 'payment-timing' | 'debit-basis';
  title: string;
  question: string;
  status: 'record-present' | 'record-missing' | 'not-triggered';
  proofPresent: string[];
  proofMissing: string[];
  authorityIds: AuthorityId[];
  distinction: string;
};

export const seedTransactions: LedgerTransaction[] = [
  {
    id: 'base-june',
    eventLabel: 'June base wages',
    eventDate: '2026-06-30',
    component: 'base-wage',
    planEvent: 'Hours and base rate for the stated period',
    credit: 6_640,
    debit: 0,
    status: 'trace-complete',
    conditionText: 'Base wages are tied to the recorded period and stated rate.',
    conditionEvidence: 'Payroll register and time record.',
    originalStatementLine: '06/30 base wages $6,640.00',
    debitStatementLine: '',
    reasonCode: '',
    acknowledgment: 'Current pay plan receipt on file.',
  },
  {
    id: 'rowe-d18422',
    eventLabel: 'ROWE / D-18422',
    eventDate: '2026-06-06',
    component: 'commission-credit',
    planEvent: 'Delivered and funded',
    credit: 1_240,
    debit: 0,
    status: 'trace-complete',
    conditionText: 'Front-gross commission is credited after delivery and funding.',
    conditionEvidence: 'Delivery record and funding confirmation.',
    originalStatementLine: '06/30 front-gross commission $1,240.00',
    debitStatementLine: '',
    reasonCode: '',
    acknowledgment: '2026-Q2 plan receipt signed.',
  },
  {
    id: 'lee-d18497',
    eventLabel: 'LEE / D-18497',
    eventDate: '2026-06-18',
    component: 'commission-credit',
    planEvent: 'Product contract signed; later cancellation recorded',
    credit: 420,
    debit: 420,
    status: 'test-condition',
    conditionText: 'Product commission is credited when the customer signs the contract.',
    conditionEvidence: 'Signed buyer order and July 3 cancellation record.',
    originalStatementLine: '06/30 product commission credit $420.00',
    debitStatementLine: '07/31 product reversal −$420.00',
    reasonCode: 'Contract cancelled',
    acknowledgment: '2026-Q2 plan receipt signed.',
  },
  {
    id: 'monthly-draw',
    eventLabel: 'Monthly draw',
    eventDate: '2026-06-30',
    component: 'draw',
    planEvent: 'Period reconciliation',
    credit: 3_000,
    debit: 860,
    status: 'verify-floor',
    conditionText: 'The plan describes a recoverable monthly advance.',
    conditionEvidence: 'Period draw worksheet; underlying floor check not attached.',
    originalStatementLine: '06/30 draw $3,000.00',
    debitStatementLine: '06/30 draw carry −$860.00',
    reasonCode: 'Period reconciliation',
    acknowledgment: '2026-Q2 plan receipt signed.',
  },
  {
    id: 'memo-a01',
    eventLabel: 'Adjustment memo / A-01',
    eventDate: '2026-06-30',
    component: 'other',
    planEvent: 'Documentation-only memo',
    credit: 0,
    debit: 0,
    status: 'trace-complete',
    conditionText: 'No wage amount is attached to this synthetic memo.',
    conditionEvidence: 'Memo retained with the period packet.',
    originalStatementLine: '',
    debitStatementLine: '',
    reasonCode: 'Documentation note',
    acknowledgment: 'No separate acknowledgment entered.',
  },
];

const roundCurrency = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const present = (value: string) => value.trim().length > 0;

function validateTransactions(transactions: readonly LedgerTransaction[]): void {
  const ids = new Set<string>();
  for (const transaction of transactions) {
    if (!present(transaction.id)) throw new RangeError('Transaction id is required.');
    if (ids.has(transaction.id)) throw new RangeError(`Duplicate transaction id: ${transaction.id}`);
    ids.add(transaction.id);
    if (!present(transaction.eventLabel)) throw new RangeError('Event label is required.');
    if (!Number.isFinite(transaction.credit) || transaction.credit < 0) {
      throw new RangeError(`Credit for ${transaction.id} must be finite and nonnegative.`);
    }
    if (!Number.isFinite(transaction.debit) || transaction.debit < 0) {
      throw new RangeError(`Debit for ${transaction.id} must be finite and nonnegative.`);
    }
  }
}

export function reconcileLedger(transactions: readonly LedgerTransaction[]): LedgerResult {
  validateTransactions(transactions);

  const totals: LedgerTotals = {
    baseWages: 0,
    commissionCredits: 0,
    draws: 0,
    otherCredits: 0,
    debits: 0,
    netBeforeTaxes: 0,
  };

  for (const transaction of transactions) {
    if (transaction.component === 'base-wage') totals.baseWages += transaction.credit;
    else if (transaction.component === 'commission-credit') totals.commissionCredits += transaction.credit;
    else if (transaction.component === 'draw') totals.draws += transaction.credit;
    else totals.otherCredits += transaction.credit;
    totals.debits += transaction.debit;
  }

  totals.baseWages = roundCurrency(totals.baseWages);
  totals.commissionCredits = roundCurrency(totals.commissionCredits);
  totals.draws = roundCurrency(totals.draws);
  totals.otherCredits = roundCurrency(totals.otherCredits);
  totals.debits = roundCurrency(totals.debits);
  totals.netBeforeTaxes = roundCurrency(
    totals.baseWages + totals.commissionCredits + totals.draws + totals.otherCredits - totals.debits,
  );

  return {
    transactionCount: transactions.length,
    totals,
    unresolvedIds: transactions
      .filter((transaction) => transaction.status !== 'trace-complete')
      .map((transaction) => transaction.id),
    scope:
      'The totals reconcile entered credits and debits. They do not classify a payment, decide an earning condition, select a payday rule, or resolve a later debit.',
  };
}

function question(
  value: Omit<LedgerQuestion, 'status'>,
): LedgerQuestion {
  const status = value.proofMissing.length === 0 ? 'record-present' : 'record-missing';
  return { ...value, status };
}

export function analyzeTransactionEvidence(transaction: LedgerTransaction): LedgerQuestion[] {
  validateTransactions([transaction]);

  const classificationPresent: string[] = [];
  const classificationMissing: string[] = [];
  if (present(transaction.planEvent)) classificationPresent.push('Entered plan event');
  else classificationMissing.push('Plan event tied to the component');
  if (present(transaction.originalStatementLine)) classificationPresent.push('Original statement line');
  else if (transaction.credit > 0) classificationMissing.push('Original payroll or statement line');

  const earningPresent: string[] = [];
  const earningMissing: string[] = [];
  if (present(transaction.conditionText)) earningPresent.push('Written earning condition');
  else earningMissing.push('Written earning condition');
  if (present(transaction.conditionEvidence)) earningPresent.push('Evidence of the stated condition');
  else earningMissing.push('Evidence that the stated condition occurred');

  const timingPresent: string[] = [];
  const timingMissing: string[] = [];
  if (present(transaction.eventDate)) timingPresent.push('Entered event date');
  else timingMissing.push('Transaction event date');
  if (present(transaction.originalStatementLine)) timingPresent.push('Original statement date and line');
  else if (transaction.credit > 0) timingMissing.push('Payment date and statement line');
  if (present(transaction.acknowledgment)) timingPresent.push('Plan receipt or acknowledgment record');
  else timingMissing.push('Plan receipt or acknowledgment record');

  const debitPresent: string[] = [];
  const debitMissing: string[] = [];
  if (transaction.debit === 0) {
    debitPresent.push('No entered debit for this transaction');
  } else {
    if (present(transaction.debitStatementLine)) debitPresent.push('Debit statement line');
    else debitMissing.push('Debit statement line');
    if (present(transaction.reasonCode)) debitPresent.push('Identified debit reason');
    else debitMissing.push('Identified debit reason');
    if (/cancel|reversal|return|fund|advance|recover/i.test(transaction.conditionText)) {
      debitPresent.push('Plan language connecting the identified event to the debit');
    } else {
      debitMissing.push('Plan language connecting the identified event to the debit');
    }
  }

  return [
    question({
      id: 'classification',
      title: 'Classification',
      question: 'Is the component a true commission, another incentive, a base wage, or an advance?',
      proofPresent: classificationPresent,
      proofMissing: classificationMissing,
      authorityIds: ['ca-labor-204-1', 'ca-labor-2751'],
      distinction: 'The payroll label does not decide how the component is calculated, what it compensates, or which timing rule applies.',
    }),
    question({
      id: 'earning-event',
      title: 'Earning event',
      question: 'What exact written condition and transaction fact connect the event to the credit?',
      proofPresent: earningPresent,
      proofMissing: earningMissing,
      authorityIds: ['ca-labor-2751', 'ca-labor-221'],
      distinction: 'A stated pre-earning condition differs from a later deduction from wages already credited under the operative plan.',
    }),
    question({
      id: 'payment-timing',
      title: 'Payment timing',
      question: 'When did the relevant event, earning condition, pay period, and payment occur?',
      proofPresent: timingPresent,
      proofMissing: timingMissing,
      authorityIds: ['ca-labor-204-1', 'ca-labor-226', 'peabody'],
      distinction: 'Dealer monthly timing under section 204.1 addresses true commission wages, not every wage component in a mixed plan.',
    }),
    question({
      id: 'debit-basis',
      title: 'Debit / chargeback basis',
      question: 'Does the record connect an identified transaction and stated condition to the later debit?',
      proofPresent: debitPresent,
      proofMissing: debitMissing,
      authorityIds: ['ca-labor-221', 'ca-labor-224', 'wage-order-7'],
      distinction: 'An identified transaction and express condition differ from a pooled loss, ordinary business cost, or self-help against wages.',
    }),
  ];
}
