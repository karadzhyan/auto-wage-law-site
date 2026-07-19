import { evaluatePayPlan, type PayPlanInput } from '../lib/tools/pay-plan-check.ts';

function listItems(target: HTMLUListElement | HTMLOListElement, values: string[]) {
  target.replaceChildren(...values.map((value) => {
    const item = document.createElement('li');
    item.textContent = value;
    return item;
  }));
}

export function initializePayPlanCheck() {
  document.querySelectorAll<HTMLElement>('[data-pay-plan-tool]').forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('[data-pay-plan-form]');
    const results = root.querySelector<HTMLElement>('[data-pay-plan-results]');
    const error = root.querySelector<HTMLElement>('[data-form-error]');
    const gap = root.querySelector<HTMLElement>('[data-gap-hours]');
    const title = root.querySelector<HTMLElement>('[data-finding-title]');
    const severity = root.querySelector<HTMLElement>('[data-severity]');
    const reasons = root.querySelector<HTMLUListElement>('[data-reasons]');
    const nextSteps = root.querySelector<HTMLOListElement>('[data-next-steps]');
    const status = root.querySelector<HTMLElement>('[data-finding-status]');

    if (!form || !results || !error || !gap || !title || !severity || !reasons || !nextSteps || !status) return;

    const render = (focus: boolean) => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const input: PayPlanInput = {
        role: data.get('role') as PayPlanInput['role'],
        payMethod: data.get('payMethod') as PayPlanInput['payMethod'],
        onsiteHours: Number(data.get('onsiteHours')),
        paidHours: Number(data.get('paidHours')),
        restPayShown: data.get('restPayShown') === 'yes',
        writtenPlanAvailable: data.get('writtenPlanAvailable') === 'yes',
      };

      try {
        const finding = evaluatePayPlan(input);
        error.hidden = true;
        results.dataset.severity = finding.severity;
        gap.textContent = String(finding.potentialGapHours);
        title.textContent = finding.title;
        severity.textContent = finding.severity === 'gap' ? 'Potential gap' : finding.severity === 'review' ? 'Review point' : 'Inputs align';
        status.textContent = focus ? 'Updated from your inputs' : 'Illustrative result';
        listItems(reasons, finding.reasons);
        listItems(nextSteps, finding.nextSteps);
        if (focus) results.focus();
      } catch (caught) {
        error.textContent = caught instanceof Error ? caught.message : 'Check the entered values.';
        error.hidden = false;
        error.focus();
      }
    };

    form.addEventListener('submit', (event) => { event.preventDefault(); render(true); });
    form.addEventListener('reset', () => window.setTimeout(() => render(false), 0));
    root.querySelector('[data-print-results]')?.addEventListener('click', () => window.print());
    render(false);
  });
}
