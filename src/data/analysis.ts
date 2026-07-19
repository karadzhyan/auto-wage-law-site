export type AnalysisStageId = 'facts' | 'classify' | 'measure' | 'test' | 'verify' | 'act';

export type AnalysisStage = {
  id: AnalysisStageId;
  number: string;
  label: string;
  question: string;
  description: string;
  prevents: string;
  records: string[];
};

export const analysisStages: AnalysisStage[] = [
  {
    id: 'facts',
    number: '01',
    label: 'Facts',
    question: 'What work occurred?',
    description: 'Establish the employer, establishment, role, actual duties, dates, workday, workweek, and activities.',
    prevents: 'Prevents a title, schedule, or payroll label from substituting for the work and business facts that select the rule.',
    records: ['Schedules and raw time records', 'Job duties and establishment records', 'System and activity timestamps'],
  },
  {
    id: 'classify',
    number: '02',
    label: 'Classify',
    question: 'What is each pay component?',
    description: 'Classify hourly wages, salary, piece/flat rate, commission, draw, bonus, premium, reimbursement, and debit by substance.',
    prevents: 'Prevents payroll vocabulary—commission, flag, spiff, pack, draw, or chargeback—from deciding which rules apply.',
    records: ['Written plan and amendments', 'Payroll code dictionary', 'Production and transaction formulas'],
  },
  {
    id: 'measure',
    number: '03',
    label: 'Measure',
    question: 'Which hours and rates control?',
    description: 'Reconcile worked time, output, rests, nonproductive time, meals, overtime, earning periods, and applicable rates.',
    prevents: 'Prevents aggregate averaging, mismatched date ranges, and use of one rate or time unit to answer a different calculation.',
    records: ['Workweek-aligned time and payroll', 'Flag or deal ledgers', 'Rate and premium calculations'],
  },
  {
    id: 'test',
    number: '04',
    label: 'Test',
    question: 'Which rule applies?',
    description: 'Select the wage order and run federal and California coverage, exemption, and compensation routes separately.',
    prevents: 'Prevents one federal exemption, state label, or compensation threshold from resolving obligations outside its legal lane.',
    records: ['Establishment and sales facts', 'Actual-duty evidence', 'Representative-period and salary-basis records'],
  },
  {
    id: 'verify',
    number: '05',
    label: 'Verify',
    question: 'What proves or contradicts it?',
    description: 'Align the plan, time record, system activity, production or deal detail, payroll register, and statement for the same dates.',
    prevents: 'Prevents a single document, missing record, or isolated timestamp from carrying more inferential weight than it can support.',
    records: ['Matched-date record packet', 'Audit trails and edit reasons', 'Contradictory and corroborating evidence'],
  },
  {
    id: 'act',
    number: '06',
    label: 'Act',
    question: 'What changes next?',
    description: 'Identify the unresolved predicate, missing proof, preservation step, control change, correction, or fact-specific question.',
    prevents: 'Prevents an educational screen from converting incomplete inputs into a compliance verdict, liability finding, or claim value.',
    records: ['Correction and preservation log', 'Control owner and due date', 'Source-check and decision record'],
  },
];

export function getAnalysisStage(id: AnalysisStageId): AnalysisStage {
  const stage = analysisStages.find((candidate) => candidate.id === id);
  if (!stage) throw new RangeError(`Unknown analysis stage: ${id}`);
  return stage;
}

export type CrosswalkEmphasis = 'primary' | 'possible' | 'exception-sensitive' | 'not-typical';
export type CrosswalkCell = { label: string; detail: string; emphasis: CrosswalkEmphasis; href: string };
export type CrosswalkRow = {
  id: 'technician' | 'sales' | 'advisor' | 'finance' | 'support';
  label: string;
  cells: { time: CrosswalkCell; pay: CrosswalkCell; coverage: CrosswalkCell; records: CrosswalkCell };
};

export const roleCrosswalk: CrosswalkRow[] = [
  {
    id: 'technician',
    label: 'Technician',
    cells: {
      time: { label: 'Clock vs. flag', detail: 'Waiting, training, cleanup, rests, and repair activity occupy different time categories.', emphasis: 'primary', href: '/pay-plans/flat-rate-technicians/#evidence-map' },
      pay: { label: 'Piece / flat rate', detail: 'The production unit and every nonproduction category must be classified before measurement.', emphasis: 'primary', href: '/issues/rest-period-nonproductive-pay/' },
      coverage: { label: 'Two legal lanes', detail: 'Federal mechanic overtime treatment does not decide California pay, break, or record rules.', emphasis: 'primary', href: '/issues/overtime-exemptions/' },
      records: { label: 'RO + time + pay', detail: 'Repair orders, flag ledgers, timecards, and statements must cover the same dates.', emphasis: 'primary', href: '/records/#technician-packet' },
    },
  },
  {
    id: 'sales',
    label: 'Sales',
    cells: {
      time: { label: 'Floor and follow-up', detail: 'Opening, demos, delivery, remote contact, and required meetings may extend beyond deal events.', emphasis: 'possible', href: '/issues/off-the-clock/' },
      pay: { label: 'Commission + draw', detail: 'Earning conditions, guarantees, packs, bonuses, and debits require transaction-level tracing.', emphasis: 'primary', href: '/issues/commission-chargebacks/' },
      coverage: { label: 'Commission tests', detail: 'California and federal commissioned-employee exemptions use different periods and thresholds.', emphasis: 'possible', href: '/issues/overtime-exemptions/' },
      records: { label: 'Plan + deal + statement', detail: 'Signed plan versions, deal jackets, funding events, draw ledgers, and statements answer different questions.', emphasis: 'primary', href: '/records/#commission-packet' },
    },
  },
  {
    id: 'advisor',
    label: 'Service advisor',
    cells: {
      time: { label: 'Lane and follow-up', detail: 'Opening, closing, dispatch, customer calls, and break coverage remain time questions.', emphasis: 'primary', href: '/pay-plans/service-advisors/#evidence-map' },
      pay: { label: 'Sales-based mix', detail: 'Labor, parts, CSI, service-contract, salary, and bonus components may follow different rules.', emphasis: 'possible', href: '/pay-plans/service-advisors/' },
      coverage: { label: 'Encino is federal', detail: 'The federal service-advisor route does not decide California overtime or related obligations.', emphasis: 'exception-sensitive', href: '/issues/overtime-exemptions/' },
      records: { label: 'RO + schedule + pay', detail: 'Repair orders, lane schedules, customer contacts, time records, and payroll require alignment.', emphasis: 'primary', href: '/records/#advisor-packet' },
    },
  },
  {
    id: 'finance',
    label: 'F&I',
    cells: {
      time: { label: 'Back-end work time', detail: 'Deal completion, funding follow-up, cancellations, and opening/closing work can cross recorded shifts.', emphasis: 'possible', href: '/issues/off-the-clock/' },
      pay: { label: 'Commission + salary', detail: 'Product compensation, draws, chargebacks, and guarantees require separate classification.', emphasis: 'primary', href: '/pay-plans/fi-managers/' },
      coverage: { label: 'Several routes', detail: 'Section 7(i), white-collar rules, and California tests must each satisfy their own predicates.', emphasis: 'exception-sensitive', href: '/issues/overtime-exemptions/' },
      records: { label: 'Deal + plan + period', detail: 'Deal detail, signed plan, representative period, salary guarantee, and time records are all material.', emphasis: 'primary', href: '/records/#finance-packet' },
    },
  },
  {
    id: 'support',
    label: 'Parts & support',
    cells: {
      time: { label: 'Role-specific time', detail: 'Counter, shuttle, lot, BDC, detail, office, and vendor work cannot share one time assumption.', emphasis: 'exception-sensitive', href: '/pay-plans/parts-and-support/' },
      pay: { label: 'Hourly or incentive', detail: 'Unit, appointment, production, bonus, and ordinary hourly methods need separate classification.', emphasis: 'possible', href: '/issues/minimum-wage/' },
      coverage: { label: 'Duties and entity', detail: 'Partsman, employee/contractor, joint-employer, and ordinary nonexempt routes depend on different facts.', emphasis: 'exception-sensitive', href: '/issues/overtime-exemptions/' },
      records: { label: 'Entity + duty + time', detail: 'Vendor contracts, actual control, schedules, system activity, pay, and expenses must be kept distinct.', emphasis: 'primary', href: '/records/#support-packet' },
    },
  },
];

