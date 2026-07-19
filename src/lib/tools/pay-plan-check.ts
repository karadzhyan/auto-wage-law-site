export type PayPlanRole = 'technician' | 'sales' | 'advisor' | 'finance' | 'support';
export type PayMethod = 'hourly' | 'piece-rate' | 'commission' | 'salary' | 'mixed';

export type PayPlanInput = {
  role: PayPlanRole;
  payMethod: PayMethod;
  onsiteHours: number;
  paidHours: number;
  restPayShown: boolean;
  writtenPlanAvailable: boolean;
};

export type PayPlanFinding = {
  severity: 'clear' | 'review' | 'gap';
  potentialGapHours: number;
  title: string;
  reasons: string[];
  nextSteps: string[];
};

const incentiveMethods: PayMethod[] = ['piece-rate', 'commission', 'mixed'];

function validHours(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function roundHours(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function evaluatePayPlan(input: PayPlanInput): PayPlanFinding {
  if (!validHours(input.onsiteHours) || !validHours(input.paidHours)) {
    throw new RangeError('Hours must be finite numbers at or above zero.');
  }

  const potentialGapHours = roundHours(Math.max(0, input.onsiteHours - input.paidHours));
  const recordsDiffer = input.onsiteHours !== input.paidHours;
  const reasons: string[] = [];

  if (potentialGapHours > 0) {
    reasons.push(
      `The inputs show ${input.onsiteHours} onsite hours and ${input.paidHours} paid or separately accounted hours — a ${potentialGapHours}-hour difference.`,
    );
  } else if (recordsDiffer) {
    reasons.push('Paid or separately accounted hours exceed the onsite-hours input. Reconcile the two records.');
  } else {
    reasons.push('The onsite-hours and paid-hours inputs match for this period.');
  }

  if (incentiveMethods.includes(input.payMethod)) {
    reasons.push('Incentive pay should be reviewed beside the complete time record, not by production alone.');
  }
  if (!input.restPayShown) {
    reasons.push('The inputs do not identify separately shown rest-period pay.');
  }
  if (!input.writtenPlanAvailable && incentiveMethods.includes(input.payMethod)) {
    reasons.push('A written plan was not available for the incentive-pay terms entered here.');
  }

  const needsPlanReview =
    recordsDiffer ||
    !input.restPayShown ||
    (!input.writtenPlanAvailable && incentiveMethods.includes(input.payMethod));
  const severity = potentialGapHours > 0 ? 'gap' : needsPlanReview ? 'review' : 'clear';

  const titles = {
    clear: 'No time gap appears in these inputs.',
    review: 'The records deserve a closer reconciliation.',
    gap: 'The inputs show a potential time gap.',
  } as const;

  return {
    severity,
    potentialGapHours,
    title: titles[severity],
    reasons,
    nextSteps: [
      'Compare the time record and schedule with payroll detail for the same dates.',
      'Gather the written pay plan and the production, repair-order, or deal detail behind the pay.',
      'Treat this result as an orientation for a fact-specific review, not a compliance determination.',
    ],
  };
}
