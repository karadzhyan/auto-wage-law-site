import { calculateExposure, type ExposureInput } from '../lib/tools/exposure.ts';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const wholeMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function initializeExposureSnapshot() {
  document.querySelectorAll<HTMLElement>('[data-exposure-tool]').forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('[data-exposure-form]');
    const results = root.querySelector<HTMLElement>('[data-exposure-results]');
    const error = root.querySelector<HTMLElement>('[data-exposure-error]');
    const amount = root.querySelector<HTMLElement>('[data-exposure-amount]');
    const exclusions = root.querySelector<HTMLUListElement>('[data-exclusions]');

    if (!form || !results || !error || !amount || !exclusions) return;

    const render = (focus: boolean) => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const input: ExposureInput = {
        employeeCount: Number(data.get('employeeCount')),
        weeklyGapHours: Number(data.get('weeklyGapHours')),
        regularRate: Number(data.get('regularRate')),
        lookbackYears: Number(data.get('lookbackYears')),
      };

      try {
        const result = calculateExposure(input);
        error.hidden = true;
        amount.textContent = Number.isInteger(result.wagesOnly) ? wholeMoney.format(result.wagesOnly) : money.format(result.wagesOnly);
        root.querySelector<HTMLElement>('[data-formula-count]')!.textContent = `${input.employeeCount} employees`;
        root.querySelector<HTMLElement>('[data-formula-gap]')!.textContent = `${input.weeklyGapHours} hr/week`;
        root.querySelector<HTMLElement>('[data-formula-rate]')!.textContent = `${money.format(input.regularRate)}/hr`;
        root.querySelector<HTMLElement>('[data-formula-weeks]')!.textContent = `${result.weeks} weeks`;
        exclusions.replaceChildren(...result.excludedCategories.map((category) => {
          const item = document.createElement('li');
          item.textContent = category;
          return item;
        }));
        if (focus) results.focus();
      } catch (caught) {
        error.textContent = caught instanceof Error ? caught.message : 'Check the entered values.';
        error.hidden = false;
        error.focus();
      }
    };

    form.addEventListener('submit', (event) => { event.preventDefault(); render(true); });
    form.addEventListener('reset', () => window.setTimeout(() => render(false), 0));
    root.querySelector('[data-print-exposure]')?.addEventListener('click', () => window.print());
    render(false);
  });
}
