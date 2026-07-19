export const site = {
  name: 'Auto Wage Law',
  shortDescription: 'Wage & hour intelligence · retail automotive',
  description:
    'Independent guidance for the people who run dealerships and the people who work in them.',
  status: 'Independent educational resource — not legal advice.',
  reviewed: 'Source checked 2026-07',
  reviewDate: '2026-07-18',
};

export const legalConstants = {
  californiaMinimumWage: {
    value: 16.9,
    unit: 'dollars per hour',
    effective: '2026-01-01',
    formula: '$16.90 statewide floor',
    authorityIds: ['mw-2026'] as const,
    checked: '2026-07-18',
    limit: 'A higher local or industry rate may apply for the employee’s location, work, and date.',
  },
  californiaCommissionThreshold: {
    value: 25.35,
    unit: 'dollars per hour',
    effective: '2026-01-01',
    formula: '$16.90 × 1.5',
    authorityIds: ['mw-2026', 'wage-order-7'] as const,
    checked: '2026-07-18',
    limit: 'This statewide number is only one predicate of the California commissioned-employee overtime exemption.',
  },
  californiaHandToolThreshold: {
    value: 33.8,
    unit: 'dollars per hour',
    effective: '2026-01-01',
    formula: '$16.90 × 2',
    authorityIds: ['mw-2026', 'wage-order-7', 'wage-order-9'] as const,
    checked: '2026-07-18',
    limit: 'The narrow customary-hand-tool rule still depends on the wage order, item, earnings measurement, and apprenticeship facts.',
  },
  californiaSalaryThreshold: {
    value: 70_304,
    unit: 'dollars per year',
    effective: '2026-01-01',
    formula: '$16.90 × 2 × 40 hours × 52 weeks',
    authorityIds: ['mw-2026'] as const,
    checked: '2026-07-18',
    limit: 'This is only the compensation predicate; salary basis and qualifying duties remain necessary.',
  },
  federalSalaryWeekly: {
    value: 684,
    unit: 'dollars per week',
    effective: '2026-05-15',
    formula: '$684 weekly under restored 2019 regulatory text',
    authorityIds: ['cfr-541-600', 'dol-salary-levels'] as const,
    checked: '2026-07-18',
    limit: 'The threshold is time-sensitive and is only one part of a complete federal EAP exemption test.',
  },
  federal7iThreshold: {
    value: 10.875,
    unit: 'dollars per hour',
    effective: '2026-07-18',
    formula: '$7.25 federal minimum wage × 1.5; the regular rate must be strictly greater',
    authorityIds: ['flsa-7', 'cfr-779-410', 'dol-2026-4'] as const,
    checked: '2026-07-18',
    limit: 'This federal figure does not replace California’s separate commissioned-employee exemption threshold or other predicates.',
  },
};

export const disclaimerSections = [
  {
    title: 'Not legal advice.',
    body: 'Auto Wage Law is an independent educational resource about wage-and-hour law as it meets retail-automotive compensation. Nothing on this site — pages, instruments, dollar figures, checklists, or record maps — is legal advice, and none of it substitutes for advice from a lawyer who knows the facts.',
  },
  {
    title: 'No attorney–client relationship.',
    body: 'Reading this site, running its instruments, or contacting the project does not create an attorney–client relationship with anyone.',
  },
  {
    title: 'Instruments are orientation, not answers.',
    body: 'The analyzer, scenario lab, matrix, and ledger organize user-entered facts and perform bounded arithmetic. Their outputs are unresolved questions, record lists, and entered wage layers — not a valuation, forecast, compliance determination, liability finding, or safe harbor.',
  },
  {
    title: 'Time-sensitivity.',
    body: 'Wage floors, thresholds, regulations, and decisions change. A page’s source-check record identifies what was checked and when; it does not promise that no authority changed afterward or imply unnamed legal review.',
  },
  {
    title: 'Jurisdiction.',
    body: 'The site’s California analysis is California-specific; its federal analysis is federal. Neither maps automatically onto any other state, and local ordinances — county and city wage floors among them — are out of scope except where expressly noted.',
  },
  {
    title: 'Privacy of instrument inputs.',
    body: 'Everything you enter into an instrument stays in your browser. The site sets no analytics cookies and transmits no instrument inputs.',
  },
];
