export type ScenarioId = 'low' | 'base' | 'high';

export type ScenarioInput = {
  employees: number;
  workweeks: number;
  gaps: Record<ScenarioId, number>;
  straightTimeRate: number;
  overtimeShare: number;
  overtimeIncrement: number;
  includeOvertime: boolean;
  premiumHoursPerWeek: number;
  premiumRate: number;
  includePremiumHours: boolean;
};

export type ScenarioRow = {
  id: ScenarioId;
  weeklyGapHours: number;
  straightTime: number;
  overtimeIncrement: number;
  premiumHours: number;
  enteredTotal: number;
};

export type ScenarioResult = {
  rows: ScenarioRow[];
  formulas: {
    straightTime: string;
    overtimeIncrement: string;
    premiumHours: string;
  };
  excludedCategories: string[];
  interpretationBoundary: string;
  inputs: ScenarioInput;
};

const exclusions = [
  'covered-hours determination',
  'applicable-rate determination',
  'class or group composition',
  'limitations-period selection',
  'penalties and liquidated damages',
  'interest',
  'attorney fees and costs',
  'taxes and withholding',
  'offsets and defenses',
  'local wage floors',
];

const scenarioIds: ScenarioId[] = ['low', 'base', 'high'];

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertNonnegative(label: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite number at or above zero.`);
  }
}

function validate(input: ScenarioInput): void {
  if (!Number.isInteger(input.employees) || input.employees < 0) {
    throw new RangeError('Employees must be a whole number at or above zero.');
  }
  if (!Number.isInteger(input.workweeks) || input.workweeks < 0) {
    throw new RangeError('Workweeks must be a whole number at or above zero.');
  }

  for (const id of scenarioIds) assertNonnegative(`${id} weekly gap`, input.gaps[id]);
  assertNonnegative('Straight-time rate', input.straightTimeRate);
  assertNonnegative('Overtime increment', input.overtimeIncrement);
  assertNonnegative('Premium hours per week', input.premiumHoursPerWeek);
  assertNonnegative('Premium rate', input.premiumRate);

  if (!Number.isFinite(input.overtimeShare) || input.overtimeShare < 0 || input.overtimeShare > 1) {
    throw new RangeError('Overtime share must be a finite proportion from zero through one.');
  }
  if (!(input.gaps.low <= input.gaps.base && input.gaps.base <= input.gaps.high)) {
    throw new RangeError('Entered gap sensitivities must be ordered low ≤ base ≤ high.');
  }
}

export function calculateWageScenarios(input: ScenarioInput): ScenarioResult {
  validate(input);

  const premiumHours = input.includePremiumHours
    ? roundCurrency(input.employees * input.workweeks * input.premiumHoursPerWeek * input.premiumRate)
    : 0;

  const rows = scenarioIds.map((id): ScenarioRow => {
    const weeklyGapHours = input.gaps[id];
    const straightTime = roundCurrency(
      input.employees * input.workweeks * weeklyGapHours * input.straightTimeRate,
    );
    const overtimeIncrement = input.includeOvertime
      ? roundCurrency(
          input.employees *
            input.workweeks *
            weeklyGapHours *
            input.overtimeShare *
            input.straightTimeRate *
            input.overtimeIncrement,
        )
      : 0;

    return {
      id,
      weeklyGapHours,
      straightTime,
      overtimeIncrement,
      premiumHours,
      enteredTotal: roundCurrency(straightTime + overtimeIncrement + premiumHours),
    };
  });

  return {
    rows,
    formulas: {
      straightTime: 'employees × workweeks × entered weekly gap × entered rate',
      overtimeIncrement:
        'employees × workweeks × entered weekly gap × entered overtime share × entered rate × entered increment',
      premiumHours:
        'employees × workweeks × entered premium hours per workweek × entered premium rate',
    },
    excludedCategories: [...exclusions],
    interpretationBoundary:
      'This is arithmetic on entered assumptions—not a conclusion about covered hours, applicable rates, group composition, time period, responsibility, or recoverable amounts.',
    inputs: {
      ...input,
      gaps: { ...input.gaps },
    },
  };
}
