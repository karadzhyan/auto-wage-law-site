import {
  analyzeTransactionEvidence,
  reconcileLedger,
  seedTransactions,
  type LedgerComponent,
  type LedgerQuestion,
  type LedgerStatus,
  type LedgerTransaction,
} from '../lib/tools/commission-ledger.ts';
import { getAuthority } from '../data/authorities.ts';

type LedgerFilter = 'all' | 'credits' | 'debits' | 'unresolved';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const statusLabels: Record<LedgerStatus, string> = {
  'trace-complete': 'Trace complete',
  'test-condition': 'Test condition',
  'verify-floor': 'Verify floor',
  'record-missing': 'Record missing',
};

const componentLabels: Record<LedgerComponent, string> = {
  'base-wage': 'Base wage',
  'commission-credit': 'Commission credit',
  draw: 'Draw / advance',
  debit: 'Debit',
  other: 'Other',
};

const cloneSeed = (): LedgerTransaction[] => seedTransactions.map((transaction) => ({ ...transaction }));

const money = (value: number) => currency.format(value);
const debitMoney = (value: number) => (value > 0 ? `−${money(value)}` : '—');
const creditMoney = (value: number) => (value > 0 ? money(value) : '—');
const displayDate = (value: string) => {
  const [, month = '', day = ''] = value.split('-');
  return month && day ? `${month}/${day}` : '—';
};

function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function proofList(values: string[], emptyText: string): HTMLElement {
  if (values.length === 0) return element('span', '', emptyText);
  const list = element('ul');
  for (const value of values) list.append(element('li', '', value));
  return list;
}

function proofRow(label: string, content: HTMLElement): HTMLDivElement {
  const row = element('div');
  row.append(element('dt', '', label), element('dd'));
  row.lastElementChild?.append(content);
  return row;
}

function evidenceQuestion(question: LedgerQuestion, index: number): HTMLDetailsElement {
  const details = element('details', `evidence-question evidence-question--${question.status}`);
  details.open = true;

  const summary = element('summary');
  const number = element('span', '', String(index + 1));
  const title = element('strong', '', question.title);
  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('aria-hidden', 'true');
  chevron.setAttribute('viewBox', '0 0 16 16');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm3 6 5 5 5-5');
  chevron.append(path);
  summary.append(number, title, chevron);

  const body = element('div', 'question-body');
  body.append(
    element('p', 'question-text', question.question),
    element('p', 'distinction', question.distinction),
  );

  const proof = element('dl', 'proof-grid');
  proof.append(
    proofRow('Proof present', proofList(question.proofPresent, 'None entered')),
    proofRow('Proof missing', proofList(question.proofMissing, 'No gap identified by the entered fields')),
  );

  const authorityLinks = element('div', 'authority-links');
  for (const authorityId of question.authorityIds) {
    const authority = getAuthority(authorityId);
    const link = element('a', '', authority.shortLabel);
    link.href = authority.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    authorityLinks.append(link);
  }
  proof.append(proofRow('Authority', authorityLinks));
  body.append(proof);
  details.append(summary, body);
  return details;
}

function transactionRow(transaction: LedgerTransaction, selected: boolean, expanded: boolean): HTMLTableRowElement {
  const row = element('tr');
  if (selected) row.classList.add('selected');

  const rowHeader = element('th');
  rowHeader.scope = 'row';
  const select = element('button', 'row-select');
  select.type = 'button';
  select.dataset.selectTransaction = transaction.id;
  select.setAttribute('aria-expanded', selected && expanded ? 'true' : 'false');
  select.setAttribute('aria-controls', 'transaction-editor');
  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('aria-hidden', 'true');
  chevron.setAttribute('viewBox', '0 0 16 16');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm5 3 5 5-5 5');
  chevron.append(path);
  select.append(chevron, element('span', '', transaction.eventLabel));
  rowHeader.append(select);

  const date = element('td', '', displayDate(transaction.eventDate));
  const component = element('td', '', componentLabels[transaction.component]);
  const planEvent = element('td', '', transaction.planEvent || '—');
  const credit = element('td', 'numeric', creditMoney(transaction.credit));
  const debit = element('td', `numeric${transaction.debit > 0 ? ' debit' : ''}`, debitMoney(transaction.debit));
  const statusCell = element('td');
  statusCell.append(element('span', `status status--${transaction.status}`, statusLabels[transaction.status]));
  row.append(rowHeader, date, component, planEvent, credit, debit, statusCell);
  return row;
}

function matchesFilter(transaction: LedgerTransaction, filter: LedgerFilter): boolean {
  if (filter === 'credits') return transaction.credit > 0;
  if (filter === 'debits') return transaction.debit > 0;
  if (filter === 'unresolved') return transaction.status !== 'trace-complete';
  return true;
}

export function initializeCommissionLedger(): void {
  document.querySelectorAll<HTMLElement>('[data-commission-ledger]').forEach((root) => {
    const rows = root.querySelector<HTMLTableSectionElement>('[data-ledger-rows]');
    const editor = root.querySelector<HTMLFormElement>('[data-transaction-editor]');
    const editorFields = root.querySelector<HTMLElement>('[data-editor-fields]');
    const editorTitle = root.querySelector<HTMLElement>('[data-editor-title]');
    const collapse = root.querySelector<HTMLButtonElement>('[data-collapse-editor]');
    const questions = root.querySelector<HTMLElement>('[data-evidence-questions]');
    const evidenceTransaction = root.querySelector<HTMLElement>('[data-evidence-transaction]');
    const entryCount = root.querySelector<HTMLElement>('[data-entry-count]');
    const unresolvedCount = root.querySelector<HTMLElement>('[data-unresolved-count]');
    const scope = root.querySelector<HTMLElement>('[data-reconciliation-scope]');
    const empty = root.querySelector<HTMLElement>('[data-filter-empty]');
    const liveStatus = root.querySelector<HTMLElement>('[data-ledger-status]');
    if (!rows || !editor || !editorFields || !editorTitle || !collapse || !questions || !evidenceTransaction || !entryCount || !unresolvedCount || !scope || !empty || !liveStatus) return;

    let transactions = cloneSeed();
    let selectedId = transactions.find(({ status }) => status === 'test-condition')?.id ?? transactions[0]?.id ?? '';
    let filter: LedgerFilter = 'all';
    let editorExpanded = true;

    const selectedTransaction = () => transactions.find(({ id }) => id === selectedId) ?? transactions[0];

    const announce = (message: string) => {
      liveStatus.textContent = '';
      window.setTimeout(() => { liveStatus.textContent = message; }, 20);
    };

    const updateEditor = () => {
      const transaction = selectedTransaction();
      if (!transaction) {
        editor.hidden = true;
        return;
      }

      editor.hidden = false;
      editorTitle.textContent = transaction.eventLabel;
      for (const field of Array.from(editor.elements)) {
        if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) continue;
        const key = field.name as keyof LedgerTransaction;
        if (!key || !(key in transaction)) continue;
        field.value = String(transaction[key]);
      }
      editorFields.hidden = !editorExpanded;
      collapse.setAttribute('aria-expanded', editorExpanded ? 'true' : 'false');
      collapse.firstChild && (collapse.firstChild.textContent = editorExpanded ? 'Collapse ' : 'Expand ');
    };

    const updateRows = () => {
      const visible = transactions.filter((transaction) => matchesFilter(transaction, filter));
      rows.replaceChildren(...visible.map((transaction) => transactionRow(transaction, transaction.id === selectedId, editorExpanded)));
      empty.hidden = visible.length > 0;
      entryCount.textContent = `${transactions.length} synthetic ${transactions.length === 1 ? 'entry' : 'entries'}`;
    };

    const updateEvidence = () => {
      const transaction = selectedTransaction();
      if (!transaction) {
        questions.replaceChildren();
        evidenceTransaction.textContent = 'No row selected';
        return;
      }
      const evidence = analyzeTransactionEvidence(transaction);
      evidenceTransaction.textContent = transaction.eventLabel;
      questions.replaceChildren(...evidence.map(evidenceQuestion));
    };

    const updateTotals = () => {
      const result = reconcileLedger(transactions);
      const totalKeys = ['baseWages', 'commissionCredits', 'draws', 'otherCredits', 'debits', 'netBeforeTaxes'] as const;
      for (const key of totalKeys) {
        const target = root.querySelector<HTMLElement>(`[data-total="${key}"]`);
        if (target) target.textContent = key === 'debits' && result.totals[key] > 0 ? `−${money(result.totals[key])}` : money(result.totals[key]);
      }
      unresolvedCount.textContent = `${result.unresolvedIds.length} ${result.unresolvedIds.length === 1 ? 'entry needs' : 'entries need'} a record or condition test`;
      scope.textContent = result.scope;
    };

    const render = (includeEditor = true) => {
      updateRows();
      updateTotals();
      updateEvidence();
      if (includeEditor) updateEditor();
    };

    root.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const rowButton = target?.closest<HTMLButtonElement>('[data-select-transaction]');
      if (rowButton?.dataset.selectTransaction) {
        const nextId = rowButton.dataset.selectTransaction;
        if (nextId === selectedId) editorExpanded = !editorExpanded;
        else {
          selectedId = nextId;
          editorExpanded = true;
        }
        render();
        if (editorExpanded) editor.querySelector<HTMLInputElement>('[name="eventLabel"]')?.focus();
        return;
      }

      const filterButton = target?.closest<HTMLButtonElement>('[data-ledger-filter]');
      if (filterButton?.dataset.ledgerFilter) {
        filter = filterButton.dataset.ledgerFilter as LedgerFilter;
        root.querySelectorAll<HTMLButtonElement>('[data-ledger-filter]').forEach((button) => {
          button.setAttribute('aria-pressed', button === filterButton ? 'true' : 'false');
        });
        updateRows();
        announce(`Showing ${filter} synthetic transactions.`);
        return;
      }

      if (target?.closest('[data-collapse-editor]')) {
        editorExpanded = !editorExpanded;
        updateRows();
        updateEditor();
        announce(editorExpanded ? 'Transaction editor expanded.' : 'Transaction editor collapsed.');
        return;
      }

      if (target?.closest('[data-add-transaction]')) {
        const sequence = transactions.length + 1;
        const transaction: LedgerTransaction = {
          id: `synthetic-${Date.now()}-${sequence}`,
          eventLabel: `Synthetic transaction ${sequence}`,
          eventDate: '',
          component: 'commission-credit',
          planEvent: '',
          credit: 0,
          debit: 0,
          status: 'record-missing',
          conditionText: '',
          conditionEvidence: '',
          originalStatementLine: '',
          debitStatementLine: '',
          reasonCode: '',
          acknowledgment: '',
        };
        transactions.push(transaction);
        selectedId = transaction.id;
        filter = 'all';
        editorExpanded = true;
        root.querySelectorAll<HTMLButtonElement>('[data-ledger-filter]').forEach((button) => {
          button.setAttribute('aria-pressed', button.dataset.ledgerFilter === 'all' ? 'true' : 'false');
        });
        render();
        editor.querySelector<HTMLInputElement>('[name="eventLabel"]')?.focus();
        announce('Added a blank synthetic transaction. Nothing was stored or transmitted.');
        return;
      }

      if (target?.closest('[data-reset-ledger]')) {
        transactions = cloneSeed();
        selectedId = transactions.find(({ status }) => status === 'test-condition')?.id ?? transactions[0]?.id ?? '';
        filter = 'all';
        editorExpanded = true;
        root.querySelectorAll<HTMLButtonElement>('[data-ledger-filter]').forEach((button) => {
          button.setAttribute('aria-pressed', button.dataset.ledgerFilter === 'all' ? 'true' : 'false');
        });
        root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-context-field]').forEach((field) => {
          if (field instanceof HTMLSelectElement) field.selectedIndex = 0;
          else if (field.dataset.contextField === 'plan') field.value = 'Synthetic 2026-Q2';
          else field.value = 'June–July 2026';
        });
        render();
        announce('Synthetic example restored.');
        return;
      }

      if (target?.closest('[data-print-ledger]')) window.print();
    });

    const updateFromEditor = (event: Event) => {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
      const transaction = selectedTransaction();
      if (!transaction) return;

      switch (field.name) {
        case 'eventLabel': transaction.eventLabel = field.value.trim() || 'Untitled synthetic transaction'; break;
        case 'eventDate': transaction.eventDate = field.value; break;
        case 'component': transaction.component = field.value as LedgerComponent; break;
        case 'planEvent': transaction.planEvent = field.value; break;
        case 'credit': transaction.credit = Math.max(0, Number(field.value) || 0); break;
        case 'debit': transaction.debit = Math.max(0, Number(field.value) || 0); break;
        case 'status': transaction.status = field.value as LedgerStatus; break;
        case 'conditionText': transaction.conditionText = field.value; break;
        case 'conditionEvidence': transaction.conditionEvidence = field.value; break;
        case 'originalStatementLine': transaction.originalStatementLine = field.value; break;
        case 'debitStatementLine': transaction.debitStatementLine = field.value; break;
        case 'reasonCode': transaction.reasonCode = field.value; break;
        case 'acknowledgment': transaction.acknowledgment = field.value; break;
        default: return;
      }

      editorTitle.textContent = transaction.eventLabel;
      render(false);
      announce('Synthetic ledger recalculated in this browser.');
    };

    editor.addEventListener('input', updateFromEditor);
    editor.addEventListener('change', updateFromEditor);
    editor.addEventListener('submit', (event) => event.preventDefault());
    render();
  });
}
