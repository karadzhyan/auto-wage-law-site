export type LibraryEntry = {
  slug: string;
  title: string;
  description: string;
  href: string;
  number: string;
  icon?: 'technician' | 'sales' | 'advisor' | 'finance' | 'support';
};

export const payPlans: LibraryEntry[] = [
  {
    slug: 'flat-rate-technicians',
    title: 'Flat-rate technicians',
    description:
      'Classify clock time, flag units, rest periods, other nonproductive time, and the records needed to test each category.',
    href: '/pay-plans/flat-rate-technicians/',
    number: '01',
    icon: 'technician',
  },
  {
    slug: 'commissioned-sales',
    title: 'Commissioned salespeople',
    description:
      'Trace gross, packs, minis, draws, earning events, timing, rest-pay method, and distinct state and federal routes.',
    href: '/pay-plans/commissioned-sales/',
    number: '02',
    icon: 'sales',
  },
  {
    slug: 'service-advisors',
    title: 'Service advisors',
    description:
      'Separate lane duties and sales-based pay from the federal Encino route, California tests, time, breaks, and proof.',
    href: '/pay-plans/service-advisors/',
    number: '03',
    icon: 'advisor',
  },
  {
    slug: 'fi-managers',
    title: 'F&I managers',
    description:
      'Test product compensation, salary or guarantee, draw and reversal mechanics, actual duties, time, and route-specific proof.',
    href: '/pay-plans/fi-managers/',
    number: '04',
    icon: 'finance',
  },
  {
    slug: 'parts-and-support',
    title: 'Parts & support staff',
    description:
      'Select the entity, establishment, actual duties, time unit, incentive method, expense path, and role-specific record set.',
    href: '/pay-plans/parts-and-support/',
    number: '05',
    icon: 'support',
  },
];

export const issues: LibraryEntry[] = [
  {
    slug: 'overtime-exemptions',
    title: 'The dealership exemptions',
    description: 'Route federal dealership, federal retail-commission, white-collar, and California tests without importing one into another.',
    href: '/issues/overtime-exemptions/',
    number: '01',
  },
  {
    slug: 'minimum-wage',
    title: 'Minimum wage under incentive pay',
    description: 'Select the applicable floor and period, then test each pay method without impermissible cross-period or cross-category borrowing.',
    href: '/issues/minimum-wage/',
    number: '02',
  },
  {
    slug: 'regular-rate',
    title: 'The regular rate',
    description: 'Classify remuneration, select the allocation period and divisor, and keep federal and California methods in their proper lanes.',
    href: '/issues/regular-rate/',
    number: '03',
  },
  {
    slug: 'rest-period-nonproductive-pay',
    title: 'Rest periods & nonproductive time',
    description: 'Distinguish paid rest periods, other nonproductive time, hourly-base methods, production units, and statement lines under section 226.2.',
    href: '/issues/rest-period-nonproductive-pay/',
    number: '04',
  },
  {
    slug: 'meal-rest-breaks',
    title: 'Meal & rest breaks',
    description: 'Separate provision, recording, authorization, control, and premium-rate questions for meals and rests.',
    href: '/issues/meal-rest-breaks/',
    number: '05',
  },
  {
    slug: 'off-the-clock',
    title: 'Off-the-clock work',
    description: 'Reconcile controlled or known work, point-event evidence, rounding, opening and closing activity, and the limits of inference.',
    href: '/issues/off-the-clock/',
    number: '06',
  },
  {
    slug: 'commission-chargebacks',
    title: 'Chargebacks, packs & draws',
    description: 'Separate classification, earning conditions, payment timing, advances, transaction-specific reversals, and wage deductions.',
    href: '/issues/commission-chargebacks/',
    number: '07',
  },
  {
    slug: 'tools-uniforms-expenses',
    title: 'Tools, uniforms & reimbursement',
    description: 'Test wage-order selection, required-item category, hand-tool threshold, apprenticeship facts, and necessary-expense reimbursement.',
    href: '/issues/tools-uniforms-expenses/',
    number: '08',
  },
];

export const developments = [
  {
    date: '2026-07-18',
    label: 'Analytical architecture',
    title: 'Facts → Classify → Measure → Test → Verify → Act',
    description: 'Every role map, issue guide, evidence register, authority record, and instrument now uses the same six-stage reasoning sequence.',
  },
  {
    date: '2026-07-18',
    label: 'Authority and editorial release',
    title: 'Thirteen guides rebuilt around questions, proof, and limits',
    description: 'Each guide now includes rule architecture, a decision sequence, evidence boundaries, a worked example, strategic implications, analysis limits, and proposition-matched primary authority.',
  },
  {
    date: '2026-07-18',
    label: 'Source infrastructure',
    title: 'A 55-record authority register with inferential limits',
    description: 'Every authority entry states the proposition it supports, what it does not decide, its official link, check date, and any current status note.',
  },
  {
    date: '2026-07-18',
    label: 'Instrument release',
    title: 'Three tested browser-local working papers',
    description: 'The Pay System Analyzer, Wage Scenario Lab, and Commission Ledger expose inputs, formulas, independent predicates, record pulls, and interpretation boundaries without retaining entries.',
  },
  {
    date: '2026-07-18',
    label: 'Threshold review',
    title: '2026 California and current federal constants re-verified',
    description: 'The statewide floor and formula-derived commission, hand-tool, and salary figures—plus current federal salary and section 7(i) thresholds—are stored with effective dates, formulas, sources, and limits.',
  },
];
