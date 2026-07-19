import { getAuthorities } from '../data/authorities.ts';
import {
  analyzePaySystem,
  type AnalyzerFinding,
  type AnalyzerInput,
  type AnalyzerResult,
} from '../lib/tools/pay-system-analyzer.ts';

const statusLabels: Record<AnalyzerFinding['status'], string> = {
  reconcile: 'Reconcile',
  predicate: 'Predicate',
  verify: 'Verify',
  'separate-test': 'Separate test',
  'supported-by-inputs': 'Inputs align',
};

function formValue<T extends string>(data: FormData, name: keyof AnalyzerInput): T {
  const value = data.get(name);
  if (typeof value !== 'string' || value.length === 0) {
    throw new RangeError(`Complete the ${String(name)} field.`);
  }
  return value as T;
}

function booleanValue(data: FormData, name: keyof AnalyzerInput): boolean {
  return formValue<'yes' | 'no'>(data, name) === 'yes';
}

function numberValue(data: FormData, name: keyof AnalyzerInput): number {
  const value = Number(formValue<string>(data, name));
  if (!Number.isFinite(value)) throw new RangeError(`Enter a valid number for ${String(name)}.`);
  return value;
}

function readInput(form: HTMLFormElement): AnalyzerInput {
  const data = new FormData(form);

  return {
    jurisdiction: formValue<AnalyzerInput['jurisdiction']>(data, 'jurisdiction'),
    establishment: formValue<AnalyzerInput['establishment']>(data, 'establishment'),
    role: formValue<AnalyzerInput['role']>(data, 'role'),
    primaryPayMethod: formValue<AnalyzerInput['primaryPayMethod']>(data, 'primaryPayMethod'),
    secondaryPayMethod: formValue<AnalyzerInput['secondaryPayMethod']>(data, 'secondaryPayMethod'),
    workedHours: numberValue(data, 'workedHours'),
    accountedHours: numberValue(data, 'accountedHours'),
    pieceWorkOccurred: booleanValue(data, 'pieceWorkOccurred'),
    restCompensation: formValue<AnalyzerInput['restCompensation']>(data, 'restCompensation'),
    nonproductiveCompensation: formValue<AnalyzerInput['nonproductiveCompensation']>(data, 'nonproductiveCompensation'),
    signedCommissionPlan: formValue<AnalyzerInput['signedCommissionPlan']>(data, 'signedCommissionPlan'),
    formulaAvailable: booleanValue(data, 'formulaAvailable'),
    timeRecordComplete: booleanValue(data, 'timeRecordComplete'),
    productionRecordAvailable: booleanValue(data, 'productionRecordAvailable'),
    establishmentRecordsAvailable: booleanValue(data, 'establishmentRecordsAvailable'),
    dutiesEvidenceAvailable: booleanValue(data, 'dutiesEvidenceAvailable'),
    representativePeriodAvailable: booleanValue(data, 'representativePeriodAvailable'),
    weeklyRateCalculationAvailable: booleanValue(data, 'weeklyRateCalculationAvailable'),
    salaryBasisRecordsAvailable: booleanValue(data, 'salaryBasisRecordsAvailable'),
    claimedOvertimeRoute: formValue<AnalyzerInput['claimedOvertimeRoute']>(data, 'claimedOvertimeRoute'),
  };
}

export function initializePaySystemAnalyzer(): void {
  document.querySelectorAll<HTMLElement>('[data-pay-system-analyzer]').forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('[data-analyzer-form]');
    const results = root.querySelector<HTMLElement>('[data-analyzer-results]');
    const error = root.querySelector<HTMLElement>('[data-form-error]');
    const findingCount = root.querySelector<HTMLElement>('[data-finding-count]');
    const resultStatus = root.querySelector<HTMLElement>('[data-result-status]');
    const resultSummary = root.querySelector<HTMLElement>('[data-result-summary]');
    const contextRoute = root.querySelector<HTMLElement>('[data-context-route]');
    const contextRole = root.querySelector<HTMLElement>('[data-context-role]');
    const contextMethods = root.querySelector<HTMLElement>('[data-context-methods]');
    const contextHours = root.querySelector<HTMLElement>('[data-context-hours]');
    const factsList = root.querySelector<HTMLUListElement>('[data-facts-list]');
    const predicatesList = root.querySelector<HTMLUListElement>('[data-predicates-list]');
    const recordsList = root.querySelector<HTMLUListElement>('[data-records-list]');
    const findingsList = root.querySelector<HTMLElement>('[data-findings-list]');
    const recordPullSummary = root.querySelector<HTMLElement>('[data-record-pull-summary]');
    const primaryMethod = root.querySelector<HTMLSelectElement>('[data-primary-method]');
    const secondaryMethod = root.querySelector<HTMLSelectElement>('[data-secondary-method]');
    const overtimeRoute = root.querySelector<HTMLSelectElement>('[data-overtime-route]');

    if (
      !form || !results || !error || !findingCount || !resultStatus || !resultSummary ||
      !contextRoute || !contextRole || !contextMethods || !contextHours || !factsList ||
      !predicatesList || !recordsList || !findingsList || !recordPullSummary ||
      !primaryMethod || !secondaryMethod || !overtimeRoute
    ) return;

    // Astro scopes component styles with a generated attribute. Apply that attribute to
    // nodes created after hydration so the live finding ledger keeps the authored styling.
    const scopeAttribute = Array.from(root.attributes)
      .map((attribute) => attribute.name)
      .find((name) => name.startsWith('data-astro-cid-'));

    const create = <K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K] => {
      const element = document.createElement(tag);
      if (scopeAttribute) element.setAttribute(scopeAttribute, '');
      return element;
    };

    const setSelectValue = (name: keyof AnalyzerInput, value: string) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLSelectElement) field.value = value;
    };

    const syncDisclosure = () => {
      const pieceSelected = primaryMethod.value === 'piece-rate' || secondaryMethod.value === 'piece-rate';
      const commissionSelected =
        primaryMethod.value === 'commission' ||
        primaryMethod.value === 'mixed' ||
        secondaryMethod.value === 'commission';
      const restMethodSelected = pieceSelected || commissionSelected;
      const selectedRoute = overtimeRoute.value;

      root.querySelectorAll<HTMLElement>('[data-when-piece]').forEach((row) => { row.hidden = !pieceSelected; });
      root.querySelectorAll<HTMLElement>('[data-when-commission]').forEach((row) => { row.hidden = !commissionSelected; });
      root.querySelectorAll<HTMLElement>('[data-when-rest-method]').forEach((row) => { row.hidden = !restMethodSelected; });
      root.querySelectorAll<HTMLElement>('[data-when-route]').forEach((row) => {
        const routes = row.dataset.whenRoute?.split(/\s+/) ?? [];
        row.hidden = !routes.includes(selectedRoute);
      });

      if (!pieceSelected) {
        setSelectValue('pieceWorkOccurred', 'no');
        setSelectValue('nonproductiveCompensation', 'not-applicable');
      }
      if (!restMethodSelected) setSelectValue('restCompensation', 'not-applicable');
      if (!commissionSelected) setSelectValue('signedCommissionPlan', 'not-applicable');
    };

    const replaceList = (target: HTMLUListElement, values: string[], emptyMessage: string) => {
      const items = values.length > 0 ? values : [emptyMessage];
      target.replaceChildren(...items.map((value) => {
        const item = create('li');
        item.textContent = value;
        return item;
      }));
    };

    const addTextCell = (heading: string, copy: string) => {
      const section = create('section');
      const title = create('h4');
      const paragraph = create('p');
      title.textContent = heading;
      paragraph.textContent = copy;
      section.append(title, paragraph);
      return section;
    };

    const renderFinding = (finding: AnalyzerFinding, index: number) => {
      const details = create('details');
      details.className = 'finding';
      details.dataset.status = finding.status;
      details.open = index === 0;

      const summary = create('summary');
      const number = create('span');
      const titleGroup = create('span');
      const title = create('strong');
      const enteredFact = create('small');
      const status = create('span');
      const icon = create('span');

      number.className = 'finding-number';
      number.textContent = String(index + 1).padStart(2, '0');
      titleGroup.className = 'finding-title';
      title.textContent = finding.title;
      enteredFact.textContent = finding.enteredFact;
      titleGroup.append(title, enteredFact);
      status.className = 'finding-status';
      status.textContent = statusLabels[finding.status];
      icon.className = 'disclosure-icon';
      icon.setAttribute('aria-hidden', 'true');
      summary.append(number, titleGroup, status, icon);

      const body = create('div');
      body.className = 'finding-body';
      body.append(
        addTextCell('Basis', finding.basis),
        addTextCell('Why it matters', finding.whyItMatters),
      );

      const proofSection = create('section');
      const proofHeading = create('h4');
      const proofList = create('ul');
      proofHeading.textContent = 'Proof to pull';
      proofList.append(...finding.proofToPull.map((record) => {
        const item = create('li');
        item.textContent = record;
        return item;
      }));
      proofSection.append(proofHeading, proofList);

      const authoritySection = create('section');
      const authorityHeading = create('h4');
      const authorityList = create('ul');
      authoritySection.className = 'authority-cell';
      authorityHeading.textContent = 'Primary authority';
      authorityList.append(...getAuthorities(finding.authorityIds).map((authority) => {
        const item = create('li');
        const link = create('a');
        link.href = authority.url;
        link.textContent = authority.shortLabel;
        link.rel = 'external noopener';
        link.target = '_blank';
        item.append(link);
        return item;
      }));
      authoritySection.append(authorityHeading, authorityList);

      const limit = create('aside');
      const limitHeading = create('strong');
      const limitCopy = create('p');
      limitHeading.textContent = 'Analytical limit';
      limitCopy.textContent = finding.limits;
      limit.append(limitHeading, limitCopy);

      body.append(proofSection, authoritySection, limit);
      details.append(summary, body);
      return details;
    };

    const render = (result: AnalyzerResult, userInitiated: boolean) => {
      findingCount.textContent = String(result.findings.length);
      resultStatus.textContent = userInitiated ? 'Updated from entered records' : 'Illustrative example';
      resultSummary.textContent = result.summary;
      contextRoute.textContent = result.context.wageOrderRoute;
      contextRole.textContent = result.context.role;
      contextMethods.textContent = result.context.payMethods.join(' + ');
      contextHours.textContent = String(result.hoursToReconcile);

      const factQuestions = result.findings
        .filter((finding) => ['facts', 'classification', 'measurement'].includes(finding.dimension))
        .map((finding) => finding.title);
      const predicateQuestions = result.findings
        .filter((finding) =>
          finding.dimension === 'coverage' ||
          finding.status === 'predicate' ||
          finding.status === 'separate-test',
        )
        .map((finding) => finding.title);

      replaceList(factsList, factQuestions, 'No additional fact-reconciliation finding surfaced from these inputs.');
      replaceList(predicatesList, predicateQuestions, 'No separate predicate finding surfaced from these inputs.');
      replaceList(recordsList, result.recordPull, 'No additional record item surfaced from these inputs.');
      findingsList.replaceChildren(...result.findings.map(renderFinding));
      recordPullSummary.textContent = result.recordPull.join(' · ');
      error.hidden = true;

      if (userInitiated) {
        results.focus({ preventScroll: true });
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const analyze = (userInitiated: boolean) => {
      syncDisclosure();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      try {
        render(analyzePaySystem(readInput(form)), userInitiated);
      } catch (caught) {
        error.textContent = caught instanceof Error ? caught.message : 'Review the entered facts and try again.';
        error.hidden = false;
        error.focus();
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      analyze(true);
    });
    form.addEventListener('reset', () => {
      window.setTimeout(() => {
        syncDisclosure();
        analyze(false);
      }, 0);
    });
    primaryMethod.addEventListener('change', syncDisclosure);
    secondaryMethod.addEventListener('change', syncDisclosure);
    overtimeRoute.addEventListener('change', syncDisclosure);
    root.querySelector('[data-print-analysis]')?.addEventListener('click', () => window.print());

    let printOpenStates: boolean[] = [];
    window.addEventListener('beforeprint', () => {
      const findings = Array.from(root.querySelectorAll<HTMLDetailsElement>('.finding'));
      printOpenStates = findings.map((finding) => finding.open);
      findings.forEach((finding) => { finding.open = true; });
    });
    window.addEventListener('afterprint', () => {
      root.querySelectorAll<HTMLDetailsElement>('.finding').forEach((finding, index) => {
        finding.open = printOpenStates[index] ?? finding.open;
      });
    });

    syncDisclosure();
  });
}
