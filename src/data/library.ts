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
      'Flag hours vs. clock hours — piece-rate law, minimum-wage floors, and pay for the time between repair orders.',
    href: '/pay-plans/flat-rate-technicians/',
    number: '01',
    icon: 'technician',
  },
  {
    slug: 'commissioned-sales',
    title: 'Commissioned salespeople',
    description:
      'Front-end gross, packs, minis, and draws — and the overtime exemptions that may or may not cover the sales desk.',
    href: '/pay-plans/commissioned-sales/',
    number: '02',
    icon: 'sales',
  },
  {
    slug: 'service-advisors',
    title: 'Service advisors',
    description:
      'Federal and California exemption questions can point in different directions. Start with the work and the pay plan.',
    href: '/pay-plans/service-advisors/',
    number: '03',
    icon: 'advisor',
  },
  {
    slug: 'fi-managers',
    title: 'F&I managers',
    description:
      'Commission share, salary basis, chargebacks, and the proof needed for a claimed exemption.',
    href: '/pay-plans/fi-managers/',
    number: '04',
    icon: 'finance',
  },
  {
    slug: 'parts-and-support',
    title: 'Parts & support staff',
    description:
      'Parts, porters, detail, BDC, and office roles do not all travel under the same wage rules.',
    href: '/pay-plans/parts-and-support/',
    number: '05',
    icon: 'support',
  },
];

export const issues: LibraryEntry[] = [
  {
    slug: 'overtime-exemptions',
    title: 'The dealership exemptions',
    description: 'Federal dealership exemptions, commissioned-employee rules, and California’s different tests.',
    href: '/issues/overtime-exemptions/',
    number: '01',
  },
  {
    slug: 'minimum-wage',
    title: 'Minimum wage under incentive pay',
    description: 'The wage floor beneath piece-rate, commission, bonus, and draw systems.',
    href: '/issues/minimum-wage/',
    number: '02',
  },
  {
    slug: 'regular-rate',
    title: 'The regular rate',
    description: 'The computed rate underlying overtime and many premium-pay calculations.',
    href: '/issues/regular-rate/',
    number: '03',
  },
  {
    slug: 'rest-period-nonproductive-pay',
    title: 'Rest periods & nonproductive time',
    description: 'How a pay plan treats waiting, meetings, rest periods, and other unflagged time.',
    href: '/issues/rest-period-nonproductive-pay/',
    number: '04',
  },
  {
    slug: 'meal-rest-breaks',
    title: 'Meal & rest breaks',
    description: 'Scheduling, records, auto-deductions, coverage, and premium-pay questions.',
    href: '/issues/meal-rest-breaks/',
    number: '05',
  },
  {
    slug: 'off-the-clock',
    title: 'Off-the-clock work',
    description: 'Meetings, training, opening work, closing work, and time outside the recorded shift.',
    href: '/issues/off-the-clock/',
    number: '06',
  },
  {
    slug: 'commission-chargebacks',
    title: 'Chargebacks, packs & draws',
    description: 'When a commission is earned, what the written plan says, and how later adjustments work.',
    href: '/issues/commission-chargebacks/',
    number: '07',
  },
  {
    slug: 'tools-uniforms-expenses',
    title: 'Tools, uniforms & reimbursement',
    description: 'Who pays for required tools and business expenses, and which wage thresholds matter.',
    href: '/issues/tools-uniforms-expenses/',
    number: '08',
  },
];

export const developments = [
  {
    date: '2026-07-18',
    label: 'Editorial review',
    title: '2026 California thresholds re-verified',
    description: 'The site’s wage-floor constants and explanatory copy were checked for this release.',
  },
  {
    date: '2026-07-18',
    label: 'Product release',
    title: 'Pay Plan Check rebuilt as a browser-local worksheet',
    description: 'The new instrument shows assumptions, gaps, and next steps without transmitting inputs.',
  },
  {
    date: '2026-07-18',
    label: 'Site release',
    title: 'A cleaner way into dealership wage law',
    description: 'The library now begins with role and pay-system questions instead of a legal taxonomy.',
  },
];
