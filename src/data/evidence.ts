export type EvidenceDomainId = 'time' | 'system' | 'output' | 'pay' | 'plan' | 'establishment' | 'expense';

export type EvidenceDomain = {
  id: EvidenceDomainId;
  label: string;
  records: string[];
  canEstablish: string;
  cannotEstablishAlone: string;
};

export const evidenceDomains: EvidenceDomain[] = [
  {
    id: 'time',
    label: 'Time proof',
    records: ['Raw punches and edit audit trail', 'Schedules, meal punches, attestations, and waivers'],
    canEstablish: 'Recorded work intervals, facial meal timing, schedule expectations, and who changed a punch for a stated reason.',
    cannotEstablishAlone: 'The complete span of controlled or suffered-permitted work, off-clock activity, or whether an authorized rest was actually provided.',
  },
  {
    id: 'system',
    label: 'System activity',
    records: ['DMS, CRM, repair-order, OEM training, access, and alarm timestamps', 'Messages, email, phone, device, and workstation events'],
    canEstablish: 'Activity at identified points, sequence, employer knowledge, regularity, and potential contradictions in the scheduled or recorded day.',
    cannotEstablishAlone: 'Continuous work between events, the legal character of every interval, or the amount of uncompensated time without a reasonable inferential method.',
  },
  {
    id: 'output',
    label: 'Output and transaction proof',
    records: ['Flag ledger, repair orders, parts tickets, and warranty events', 'Deal jackets, delivery, funding, cancellation, return, and reversal records'],
    canEstablish: 'Units produced, transactions, attribution, timing, identified reversals, and the output or deal events used by a pay formula.',
    cannotEstablishAlone: 'All hours worked, whether a component is legally a commission or piece rate, or whether a debit from pay is permitted.',
  },
  {
    id: 'pay',
    label: 'Pay proof',
    records: ['Payroll register, wage statements, earning codes, and rate tables', 'Draw reconciliations, bonus or spiff tables, premiums, and later true-ups'],
    canEstablish: 'Amounts paid, dates, rates and codes used, statement presentation, reconciliations, and changes between original and later payroll.',
    cannotEstablishAlone: 'Whether missing work occurred, whether every payment was correctly classified, or whether a written earning condition is valid and satisfied.',
  },
  {
    id: 'plan',
    label: 'Plan proof',
    records: ['Signed commission plan, receipt, effective versions, and amendments', 'Piece-rate or incentive formula, policies, guarantees, and deduction terms'],
    canEstablish: 'The promised pay unit, written earning condition, formula, effective version, receipt, and stated treatment of advances or later events.',
    cannotEstablishAlone: 'Actual practice, actual duties, complete hours, whether a condition occurred, or whether a term satisfies every applicable wage rule.',
  },
  {
    id: 'establishment',
    label: 'Establishment and duty proof',
    records: ['Legal entities, dealer or franchise connection, business activity and sales records', 'Job descriptions, actual-duty samples, schedules, and time allocation'],
    canEstablish: 'Facts used to select a wage order, retail-establishment status, dealership status, employer identity, and duty-based exemption route.',
    cannotEstablishAlone: 'Pay accuracy for a period, the regular rate, hours worked, or whether the written job description matches actual work.',
  },
  {
    id: 'expense',
    label: 'Expense proof',
    records: ['Required-item inventory, policies, receipts, mileage, device, and subscription records', 'Reimbursement calculations, payment lines, apprentice status, and employee earnings'],
    canEstablish: 'What the work required, employee expenditure, amount, reimbursement method, earnings threshold, item category, and payment made.',
    cannotEstablishAlone: 'Whether an expense was legally necessary or whether a wage-order hand-tool exception applies without direction, item, establishment, and earnings facts.',
  },
];

const evidenceById = new Map(evidenceDomains.map((domain) => [domain.id, domain]));

export function getEvidenceDomains(ids: readonly EvidenceDomainId[]): EvidenceDomain[] {
  return ids.map((id) => {
    const domain = evidenceById.get(id);
    if (!domain) throw new RangeError(`Unknown evidence domain: ${id}`);
    return domain;
  });
}

