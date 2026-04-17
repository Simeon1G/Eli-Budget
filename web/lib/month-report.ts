import type { BudgetEntry, EntryKind, Flow, Frequency, PersistedBudget } from "./budget-types";
import { bg } from "./bg";
import { snapshotBusiness, snapshotPersonal } from "./financial-snapshot";
import { formatMonthLabelBg } from "./month-key";
import type { TaxInsuranceFields } from "./tax-insurance-types";
import { sumTaxInsuranceMonthly } from "./tax-insurance-types";
import { toMonthlyAmount } from "./budget-math";

export type ReportRow = {
  account: string;
  section: string;
  type: string;
  label: string;
  frequency: string;
  amount: number;
  monthlyEquivalent: number;
};

function frequencyLabel(freq?: Frequency): string {
  if (!freq) return "";
  return bg.frequency[freq] ?? freq;
}

function kindLabel(kind: EntryKind): string {
  return kind === "fixed" ? bg.categoryHelpers.fixed : bg.categoryHelpers.variable;
}

function flowLabel(flow: Flow): string {
  return flow === "income" ? bg.flow.income : bg.flow.expense;
}

function pushEntryRows(
  rows: ReportRow[],
  account: string,
  flow: Flow,
  entries: BudgetEntry[],
): void {
  for (const entry of entries) {
    rows.push({
      account,
      section: flowLabel(flow),
      type: kindLabel(entry.kind),
      label: entry.label,
      frequency: entry.kind === "fixed" ? frequencyLabel(entry.frequency) : "",
      amount: entry.amount,
      monthlyEquivalent: toMonthlyAmount(entry),
    });
  }
}

export function buildMonthReportRows(data: PersistedBudget): ReportRow[] {
  const rows: ReportRow[] = [];
  pushEntryRows(rows, "Business", "income", data.business.incomes);
  pushEntryRows(rows, "Business", "expense", data.business.expenses);
  pushEntryRows(rows, "Personal", "income", data.personal.incomes);
  pushEntryRows(rows, "Personal", "expense", data.personal.expenses);
  return rows;
}

type DownloadInput = {
  monthKey: string;
  data: PersistedBudget;
  taxInsurance: TaxInsuranceFields;
};

export type MonthReportSummaryRow = {
  account: string;
  totalIncome: number;
  totalExpenses: number;
  taxReserve: number;
  taxInsurance: number;
  freeMoney: number;
};

export type MonthReportData = {
  title: string;
  monthLabel: string;
  summaryRows: MonthReportSummaryRow[];
  detailRows: ReportRow[];
};

export function buildMonthReportData({
  monthKey,
  data,
  taxInsurance,
}: DownloadInput): MonthReportData {
  const monthLabel = formatMonthLabelBg(monthKey);
  const businessTaxInsurance = sumTaxInsuranceMonthly(taxInsurance);
  const businessSnapshot = snapshotBusiness(data.business, businessTaxInsurance);
  const personalSnapshot = snapshotPersonal(data.personal);
  return {
    title: `Monthly Budget Report - ${monthLabel}`,
    monthLabel,
    summaryRows: [
      {
        account: "Business",
        totalIncome: businessSnapshot.income,
        totalExpenses: businessSnapshot.expenses,
        taxReserve: businessSnapshot.taxReserve,
        taxInsurance: businessSnapshot.businessTaxInsurance ?? 0,
        freeMoney: businessSnapshot.freeMoney,
      },
      {
        account: "Personal",
        totalIncome: personalSnapshot.income,
        totalExpenses: personalSnapshot.expenses,
        taxReserve: personalSnapshot.taxReserve,
        taxInsurance: 0,
        freeMoney: personalSnapshot.freeMoney,
      },
    ],
    detailRows: buildMonthReportRows(data),
  };
}
