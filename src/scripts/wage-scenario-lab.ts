import { calculateWageScenarios, type ScenarioInput, type ScenarioId } from '../lib/tools/wage-scenario.ts';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

function replaceList(target: HTMLUListElement, values: string[]): void {
  target.replaceChildren(...values.map((value) => {
    const item = document.createElement('li');
    item.textContent = value;
    return item;
  }));
}

export function initializeWageScenarioLab(): void {
  document.querySelectorAll<HTMLElement>('[data-wage-scenario-lab]').forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('[data-scenario-form]');
    const output = root.querySelector<HTMLElement>('[data-scenario-output]');
    const error = root.querySelector<HTMLElement>('[data-scenario-error]');
    const status = root.querySelector<HTMLElement>('[data-scenario-status]');
    const exclusions = root.querySelector<HTMLUListElement>('[data-scenario-exclusions]');
    const boundary = root.querySelector<HTMLElement>('[data-interpretation-boundary]');
    if (!form || !output || !error || !status || !exclusions || !boundary) return;

    const render = (focus: boolean): void => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const input: ScenarioInput = {
        employees: Number(data.get('employees')),
        workweeks: Number(data.get('workweeks')),
        gaps: {
          low: Number(data.get('gapLow')),
          base: Number(data.get('gapBase')),
          high: Number(data.get('gapHigh')),
        },
        straightTimeRate: Number(data.get('straightTimeRate')),
        overtimeShare: Number(data.get('overtimeShare')) / 100,
        overtimeIncrement: Number(data.get('overtimeIncrement')),
        includeOvertime: data.get('includeOvertime') === 'on',
        premiumHoursPerWeek: Number(data.get('premiumHoursPerWeek')),
        premiumRate: Number(data.get('premiumRate')),
        includePremiumHours: data.get('includePremiumHours') === 'on',
      };

      try {
        const result = calculateWageScenarios(input);
        error.hidden = true;
        result.rows.forEach((row) => {
          const target = root.querySelector<HTMLTableRowElement>(`[data-scenario-row="${row.id as ScenarioId}"]`);
          if (!target) return;
          target.querySelector<HTMLElement>('[data-cell="gap"]')!.textContent = `${row.weeklyGapHours} hr`;
          target.querySelector<HTMLElement>('[data-cell="straight"]')!.textContent = money.format(row.straightTime);
          target.querySelector<HTMLElement>('[data-cell="overtime"]')!.textContent = money.format(row.overtimeIncrement);
          target.querySelector<HTMLElement>('[data-cell="premium"]')!.textContent = money.format(row.premiumHours);
          target.querySelector<HTMLElement>('[data-cell="total"]')!.textContent = money.format(row.enteredTotal);
        });
        root.querySelector<HTMLElement>('[data-formula="straight"]')!.textContent = result.formulas.straightTime;
        root.querySelector<HTMLElement>('[data-formula="overtime"]')!.textContent = result.formulas.overtimeIncrement;
        root.querySelector<HTMLElement>('[data-formula="premium"]')!.textContent = result.formulas.premiumHours;
        boundary.textContent = result.interpretationBoundary;
        replaceList(exclusions, result.excludedCategories);
        status.textContent = focus ? 'Recalculated from current entries' : 'Illustrative defaults';
        if (focus) output.focus();
      } catch (caught) {
        error.textContent = caught instanceof Error ? caught.message : 'Review the entered assumptions.';
        error.hidden = false;
        error.focus();
      }
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      render(true);
    });
    form.addEventListener('reset', () => window.setTimeout(() => render(false), 0));
    root.querySelector('[data-print-scenarios]')?.addEventListener('click', () => window.print());
    render(false);
  });
}
