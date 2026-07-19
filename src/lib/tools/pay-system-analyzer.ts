import type { AuthorityId } from '../../data/authorities.ts';

export type AnalyzerRole = 'technician' | 'sales' | 'advisor' | 'finance' | 'parts' | 'support';
export type AnalyzerPayMethod = 'hourly' | 'salary' | 'piece-rate' | 'commission' | 'mixed';
export type AnalyzerSecondaryPayMethod = 'none' | 'hourly' | 'piece-rate' | 'commission' | 'bonus';
export type EvidenceAnswer = 'yes' | 'no' | 'unknown' | 'not-applicable';
export type CompensationAnswer = 'shown' | 'not-shown' | 'unknown' | 'not-applicable';
export type OvertimeRoute = 'none' | '13b10' | '7i' | 'eap' | 'unknown';

export type AnalyzerInput = {
  jurisdiction: 'california-federal';
  establishment: 'dealer-connected' | 'standalone-repair' | 'other' | 'unknown';
  role: AnalyzerRole;
  primaryPayMethod: AnalyzerPayMethod;
  secondaryPayMethod: AnalyzerSecondaryPayMethod;
  workedHours: number;
  accountedHours: number;
  pieceWorkOccurred: boolean;
  restCompensation: CompensationAnswer;
  nonproductiveCompensation: CompensationAnswer;
  signedCommissionPlan: EvidenceAnswer;
  formulaAvailable: boolean;
  timeRecordComplete: boolean;
  productionRecordAvailable: boolean;
  establishmentRecordsAvailable: boolean;
  dutiesEvidenceAvailable: boolean;
  representativePeriodAvailable: boolean;
  weeklyRateCalculationAvailable: boolean;
  salaryBasisRecordsAvailable: boolean;
  claimedOvertimeRoute: OvertimeRoute;
};

export type FindingStatus =
  | 'reconcile'
  | 'predicate'
  | 'verify'
  | 'separate-test'
  | 'supported-by-inputs';

export type FindingDimension = 'facts' | 'classification' | 'measurement' | 'coverage' | 'records';

export type AnalyzerFinding = {
  id: string;
  dimension: FindingDimension;
  status: FindingStatus;
  title: string;
  enteredFact: string;
  basis: string;
  whyItMatters: string;
  proofToPull: string[];
  authorityIds: AuthorityId[];
  limits: string;
};

export type AnalyzerResult = {
  summary: string;
  scope: string;
  hoursToReconcile: number;
  findings: AnalyzerFinding[];
  recordPull: string[];
  context: {
    wageOrderRoute: 'Wage Order 7 starting route' | 'Wage Order 9 starting route' | 'Establishment facts required';
    role: AnalyzerRole;
    payMethods: string[];
  };
};

const roundHours = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function assertFiniteNonnegative(label: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite number at or above zero.`);
  }
}

function wageOrderRoute(
  establishment: AnalyzerInput['establishment'],
): AnalyzerResult['context']['wageOrderRoute'] {
  if (establishment === 'dealer-connected') return 'Wage Order 7 starting route';
  if (establishment === 'standalone-repair') return 'Wage Order 9 starting route';
  return 'Establishment facts required';
}

function finding(value: AnalyzerFinding): AnalyzerFinding {
  return value;
}

function methodLabel(input: AnalyzerInput): string[] {
  const methods = [input.primaryPayMethod];
  if (input.secondaryPayMethod !== 'none') methods.push(input.secondaryPayMethod);
  return methods;
}

export function analyzePaySystem(input: AnalyzerInput): AnalyzerResult {
  assertFiniteNonnegative('Worked hours', input.workedHours);
  assertFiniteNonnegative('Accounted hours', input.accountedHours);

  const pieceMethodSelected =
    input.primaryPayMethod === 'piece-rate' || input.secondaryPayMethod === 'piece-rate';
  if (input.pieceWorkOccurred && !pieceMethodSelected) {
    throw new RangeError('Piece work requires a selected piece-rate pay method for this period.');
  }

  const commissionMethodSelected =
    input.primaryPayMethod === 'commission' ||
    input.primaryPayMethod === 'mixed' ||
    input.secondaryPayMethod === 'commission';
  const route = wageOrderRoute(input.establishment);
  const hoursToReconcile = roundHours(Math.abs(input.workedHours - input.accountedHours));
  const findings: AnalyzerFinding[] = [];

  if (input.establishment === 'other' || input.establishment === 'unknown') {
    findings.push(
      finding({
        id: 'wage-order-selection',
        dimension: 'facts',
        status: 'predicate',
        title: 'Select the industry wage-order route from establishment facts.',
        enteredFact: `Establishment context entered as ${input.establishment}.`,
        basis: 'Dealer-connected vehicle repair generally begins with Wage Order 7; a standalone repair business generally begins with Wage Order 9.',
        whyItMatters: 'The applicable order supplies the state definitions, overtime, record, tool, meal, and rest framework.',
        proofToPull: ['Legal employing entity', 'Dealer or franchise connection', 'Primary business and worksite description'],
        authorityIds: ['dir-which-order', 'wage-order-7', 'wage-order-9'],
        limits: 'DIR’s guide is a fact-dependent starting point rather than a safe harbor.',
      }),
    );
  }

  if (hoursToReconcile === 0) {
    findings.push(
      finding({
        id: 'time-reconciliation',
        dimension: 'measurement',
        status: 'supported-by-inputs',
        title: 'The two entered hour totals match.',
        enteredFact: `${input.workedHours} worked hours and ${input.accountedHours} accounted hours were entered.`,
        basis: 'No numerical difference appears between these two user-entered totals.',
        whyItMatters: 'Matching totals narrow one reconciliation question but do not show how each activity or pay category was treated.',
        proofToPull: ['Raw time record', 'Payroll register for the same dates', 'Activity, production, or transaction detail'],
        authorityIds: ['ca-labor-1174', 'cfr-516-2'],
        limits: 'Matching totals do not establish complete time capture, correct rate treatment, or any coverage route.',
      }),
    );
  } else {
    const direction = input.workedHours > input.accountedHours ? 'fewer' : 'more';
    findings.push(
      finding({
        id: 'time-reconciliation',
        dimension: 'measurement',
        status: 'reconcile',
        title: `${hoursToReconcile} hours require classification and reconciliation.`,
        enteredFact: `${input.workedHours} worked hours and ${input.accountedHours} accounted hours were entered; the accounted total is ${direction} than the worked total.`,
        basis: 'The two period totals differ, but the difference does not identify the activity, pay category, rate, or reason.',
        whyItMatters: 'A numerical difference can affect minimum-wage, overtime, rest, nonproductive-time, and record questions only after the underlying intervals are classified.',
        proofToPull: ['Raw time punches and edits', 'Payroll register and wage statement', 'Schedule plus system, production, or deal timestamps'],
        authorityIds: ['ca-labor-1174', 'ca-labor-1197', 'cfr-516-2', 'cfr-785'],
        limits: 'The entered difference is not automatically work, uncompensated time, or a recoverable amount.',
      }),
    );
  }

  if (!input.timeRecordComplete) {
    findings.push(
      finding({
        id: 'time-record-completeness',
        dimension: 'records',
        status: 'verify',
        title: 'The time record is marked incomplete.',
        enteredFact: 'The user did not identify a complete time record for the period.',
        basis: 'Required hours records and activity evidence perform different functions and should be reconciled rather than substituted for one another.',
        whyItMatters: 'Missing required records can change the evidentiary path, but absence is not by itself a finding about the amount or legal character of work.',
        proofToPull: ['Original punches and edit history', 'Schedules and manager approvals', 'DMS, CRM, training, access, alarm, and message events'],
        authorityIds: ['ca-labor-1174', 'cfr-516-2', 'furry'],
        limits: 'A reasonable inference still requires a factual basis and must distinguish point events from continuous time.',
      }),
    );
  }

  if (input.pieceWorkOccurred) {
    findings.push(
      finding({
        id: 'pay-method-classification',
        dimension: 'classification',
        status: 'predicate',
        title: 'Identify the actual piece-paid unit before measuring other time.',
        enteredFact: 'Piece-rate work occurred during the entered period.',
        basis: 'Flat or book-rate output and hours worked answer different questions; the plan’s promised unit determines what activity falls inside or outside that compensation.',
        whyItMatters: 'Classification determines which intervals require separate treatment and prevents aggregate pay-period averaging from obscuring the promised unit.',
        proofToPull: ['Current piece-rate formula', 'Flag or production ledger', 'Repair-order activity definitions'],
        authorityIds: ['ca-labor-226-2', 'oman'],
        limits: 'A flag gap is not automatically other nonproductive time; directly related work and employer control still require classification.',
      }),
    );

    if (input.restCompensation !== 'shown') {
      findings.push(
        finding({
          id: 'piece-rate-rest',
          dimension: 'measurement',
          status: 'verify',
          title: 'Reconcile piece-rate rest and recovery compensation.',
          enteredFact: `Rest/recovery compensation was entered as ${input.restCompensation}.`,
          basis: 'Section 226.2 supplies a separate weekly rest/recovery rate and corresponding statement fields when piece-rate work occurs.',
          whyItMatters: 'The rest-rate numerator, divisor, minimum floor, hours, and gross amount differ from the overtime regular-rate calculation.',
          proofToPull: ['Rest/recovery hours and weekly rate calculation', 'Wage statement rest lines', 'Piece earnings, other compensation, and overtime premiums'],
          authorityIds: ['ca-labor-226-2', 'wage-order-7', 'wage-order-9'],
          limits: 'A payment line addresses compensation; it does not prove that a compliant off-duty rest period was provided.',
        }),
      );
    }

    if (input.nonproductiveCompensation !== 'shown') {
      findings.push(
        finding({
          id: 'piece-rate-npt',
          dimension: 'measurement',
          status: 'verify',
          title: 'Classify and reconcile other nonproductive time.',
          enteredFact: `Other nonproductive-time compensation was entered as ${input.nonproductiveCompensation}.`,
          basis: 'Section 226.2 treats employer-controlled time not directly related to the piece-paid activity as a distinct category, subject to an hourly-base route in subsection (a)(7).',
          whyItMatters: 'Waiting, training, meetings, cleanup, and repair-related documentation cannot be classified merely from the absence of a flag.',
          proofToPull: ['Time or reasonable-estimate method', 'Activity definitions and system timestamps', 'Any hourly base paid for every hour in addition to piece earnings'],
          authorityIds: ['ca-labor-226-2', 'oman'],
          limits: 'Not every non-flagged minute is other nonproductive time, and a pay-period floor is not the same as an additional hourly base.',
        }),
      );
    }

    if (!input.formulaAvailable || !input.productionRecordAvailable) {
      findings.push(
        finding({
          id: 'piece-formula-record',
          dimension: 'records',
          status: 'verify',
          title: 'Complete the formula and production record packet.',
          enteredFact: `Formula available: ${input.formulaAvailable ? 'yes' : 'no'}; production record available: ${input.productionRecordAvailable ? 'yes' : 'no'}.`,
          basis: 'The pay unit, units credited, statement fields, rest calculation, and other-time treatment cannot be reconciled from clock hours alone.',
          whyItMatters: 'A period-level audit requires the actual formula and output ledger behind the payroll result.',
          proofToPull: ['Formula and effective version', 'Accurate production or flag record', 'Payroll code mapping and wage statement'],
          authorityIds: ['ca-labor-226-2', 'wage-order-7', 'wage-order-9'],
          limits: 'A missing production record creates an evidence question rather than automatic proof about what was produced or paid.',
        }),
      );
    }
  }

  if (commissionMethodSelected) {
    if (input.signedCommissionPlan !== 'yes') {
      findings.push(
        finding({
          id: 'commission-writing',
          dimension: 'records',
          status: 'verify',
          title: 'Reconcile the written commission plan and signed receipt.',
          enteredFact: `Signed commission plan entered as ${input.signedCommissionPlan}.`,
          basis: 'Section 2751 requires a written commission contract that states computation and payment method, a signed copy, and a signed receipt.',
          whyItMatters: 'Plan version and earning language anchor transaction-level questions about credits, advances, reversals, and final pay.',
          proofToPull: ['Signed plan and employee receipt', 'Effective dates and amendments', 'Computation, payment, and earning-condition language'],
          authorityIds: ['ca-labor-2751', 'ca-labor-204-1'],
          limits: 'A written label does not establish that a component is a true commission or that every term governs actual practice.',
        }),
      );
    }

    if (input.restCompensation !== 'shown') {
      findings.push(
        finding({
          id: 'commission-rest-method',
          dimension: 'measurement',
          status: 'verify',
          title: 'Identify how the commission/activity plan pays rest time.',
          enteredFact: `Rest compensation was entered as ${input.restCompensation}; secondary method was ${input.secondaryPayMethod}.`,
          basis: 'A commission or recoverable draw does not necessarily pay rest time; an independent hourly component can materially change the analysis only if it actually pays rest time and is not later recovered.',
          whyItMatters: 'The actual formula, not the commission label, determines whether rest time received independent compensation.',
          proofToPull: ['Commission and draw formula', 'Hourly component and recovery treatment', 'Rest policy, payroll register, and wage statement'],
          authorityIds: ['vaquero', 'wage-order-7', 'ca-labor-226-7'],
          limits: 'This is a method question and does not require a separate rest statement line for every ordinary hourly plan.',
        }),
      );
    }
  }

  if (input.claimedOvertimeRoute === '13b10') {
    const roleLabel = input.role === 'advisor' ? 'service-advisor' : input.role;
    findings.push(
      finding({
        id: 'federal-13b10-route',
        dimension: 'coverage',
        status: input.establishmentRecordsAvailable && input.dutiesEvidenceAvailable ? 'separate-test' : 'verify',
        title: 'Test every federal dealership-exemption predicate.',
        enteredFact: `The federal section 13(b)(10) route was selected for the ${roleLabel} role.`,
        basis: 'The route depends on a qualifying nonmanufacturing establishment and actual duties as a qualifying salesman, partsman, or mechanic primarily engaged in selling or servicing qualifying vehicles.',
        whyItMatters: 'The route concerns federal overtime only; minimum wage, records, hours worked, and California obligations remain separate.',
        proofToPull: [
          'Establishment business and ultimate-purchaser sales facts',
          'Actual weekly duties and time allocation',
          ...(input.role === 'advisor' ? ['Service sales and servicing-process evidence'] : []),
        ],
        authorityIds: input.role === 'advisor' ? ['flsa-13b10', 'cfr-779-372', 'encino'] : ['flsa-13b10', 'cfr-779-372'],
        limits: 'A title, dealer location, or pay method does not establish the exemption, and the federal result does not answer California law.',
      }),
    );
  } else if (input.claimedOvertimeRoute === '7i') {
    findings.push(
      finding({
        id: 'federal-7i-route',
        dimension: 'coverage',
        status:
          input.establishmentRecordsAvailable &&
          input.representativePeriodAvailable &&
          input.weeklyRateCalculationAvailable
            ? 'separate-test'
            : 'verify',
        title: 'Test the federal retail commissioned-employee route by period.',
        enteredFact: `Section 7(i) was selected; representative-period records: ${input.representativePeriodAvailable ? 'present' : 'missing'}; weekly rate calculation: ${input.weeklyRateCalculationAvailable ? 'present' : 'missing'}.`,
        basis: 'Section 7(i) has three predicates: a retail or service establishment, a regular rate strictly above the federal threshold in each overtime workweek, and more than half commission compensation over a representative period.',
        whyItMatters: 'A salary, draw, or commission label cannot substitute for the workweek and representative-period calculations.',
        proofToPull: ['Retail-establishment records', 'Workweek hours and regular-rate calculation', 'Designated representative period and commission/noncommission totals'],
        authorityIds: ['flsa-7', 'cfr-779-410', 'cfr-516-16', 'dol-2026-4'],
        limits: 'This federal route removes only federal overtime and uses a threshold distinct from California’s commissioned-employee test.',
      }),
    );
  } else if (input.claimedOvertimeRoute === 'eap') {
    findings.push(
      finding({
        id: 'federal-eap-route',
        dimension: 'coverage',
        status: input.salaryBasisRecordsAvailable && input.dutiesEvidenceAvailable ? 'separate-test' : 'verify',
        title: 'Test duties, salary level, salary basis, and deductions independently.',
        enteredFact: `The federal EAP route was selected; salary-basis records: ${input.salaryBasisRecordsAvailable ? 'present' : 'missing'}; duty evidence: ${input.dutiesEvidenceAvailable ? 'present' : 'missing'}.`,
        basis: 'The federal white-collar route requires qualifying primary duties, the current salary level, and salary basis; additional commissions can coexist only under the regulation’s conditions.',
        whyItMatters: 'Manager titles, high total earnings, and salary-plus-commission labels do not answer the separate predicates.',
        proofToPull: ['Actual primary-duty evidence', 'Weekly guarantee and pay calculations', 'Deductions, draw reconciliations, and safe-harbor policy'],
        authorityIds: ['cfr-541-600', 'cfr-541-602', 'cfr-541-603', 'cfr-541-604', 'dol-salary-levels'],
        limits: 'The federal route remains separate from section 7(i), California exemptions, and manual-worker limitations.',
      }),
    );
  } else if (input.claimedOvertimeRoute === 'unknown') {
    findings.push(
      finding({
        id: 'overtime-route-selection',
        dimension: 'coverage',
        status: 'predicate',
        title: 'Name the overtime route before testing it.',
        enteredFact: 'The claimed overtime route was entered as unknown.',
        basis: 'Dealership, retail-commission, white-collar, and California routes have different establishment, duty, pay, period, and record predicates.',
        whyItMatters: 'Mixing predicates across routes can make an incomplete test appear complete.',
        proofToPull: ['Written classification rationale', 'Actual-duty and establishment records', 'Pay-period, workweek, and representative-period calculations'],
        authorityIds: ['flsa-13b10', 'flsa-7', 'ca-labor-510', 'wage-order-7'],
        limits: 'This screen identifies candidate routes and records; it does not select an exemption for a person.',
      }),
    );
  }

  const recordPull = Array.from(
    new Set(findings.flatMap((candidate) => candidate.proofToPull)),
  );
  const summary =
    hoursToReconcile > 0
      ? `${hoursToReconcile} hours to classify and reconcile across ${findings.length} independent dimensions.`
      : `No numerical hour difference appears in the entered totals; ${findings.length} independent dimensions remain in scope.`;

  return {
    summary,
    scope: 'Educational record reconciliation — no legal conclusion.',
    hoursToReconcile,
    findings,
    recordPull,
    context: {
      wageOrderRoute: route,
      role: input.role,
      payMethods: methodLabel(input),
    },
  };
}
