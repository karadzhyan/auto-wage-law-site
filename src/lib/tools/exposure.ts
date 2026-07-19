export type ExposureInput = {
  employeeCount: number;
  weeklyGapHours: number;
  regularRate: number;
  lookbackYears: number;
};

export type ExposureResult = {
  wagesOnly: number;
  groupWeeklyGapHours: number;
  weeks: number;
  excludedCategories: string[];
  formula: string;
};

const excludedCategories = [
  'penalties',
  'interest',
  'attorney fees and costs',
  'taxes and withholding',
  'premium-pay theories',
  'claim-specific defenses',
];

function validNonnegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateExposure(input: ExposureInput): ExposureResult {
  if (
    !Number.isInteger(input.employeeCount) ||
    !validNonnegative(input.employeeCount) ||
    !validNonnegative(input.weeklyGapHours) ||
    !validNonnegative(input.regularRate) ||
    !validNonnegative(input.lookbackYears)
  ) {
    throw new RangeError('Exposure inputs must be finite, nonnegative numbers; employee count must be whole.');
  }

  const groupWeeklyGapHours = input.employeeCount * input.weeklyGapHours;
  const weeks = input.lookbackYears * 52;

  return {
    wagesOnly: roundCurrency(groupWeeklyGapHours * input.regularRate * weeks),
    groupWeeklyGapHours,
    weeks,
    excludedCategories: [...excludedCategories],
    formula: 'employees × weekly gap hours × regular rate × 52 weeks × lookback years',
  };
}
