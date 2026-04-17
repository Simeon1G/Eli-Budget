import type { BudgetEntry, EntryKind, Flow, Frequency, PersistedBudget } from "./budget-types";
import { bg } from "./bg";
import { APP_CURRENCY } from "./format-money";
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

function escCsv(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
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

export function buildMonthReportCsv({
  monthKey,
  data,
  taxInsurance,
}: DownloadInput): string {
  const monthLabel = formatMonthLabelBg(monthKey);
  const businessTaxInsurance = sumTaxInsuranceMonthly(taxInsurance);
  const businessSnapshot = snapshotBusiness(data.business, businessTaxInsurance);
  const personalSnapshot = snapshotPersonal(data.personal);
  const detailRows = buildMonthReportRows(data);

  const lines: string[] = [];
  lines.push(escCsv(`Monthly Budget Report - ${monthLabel}`));
  lines.push(`${escCsv("Month")},${escCsv(monthLabel)}`);
  lines.push(`${escCsv("Currency")},${escCsv(APP_CURRENCY)}`);
  lines.push("");
  lines.push(`${escCsv("Account")},${escCsv("Total Income")},${escCsv("Total Expenses")},${escCsv("Tax Reserve")},${escCsv("Tax/Insurance")},${escCsv("Free Money")}`);
  lines.push(
    [
      escCsv("Business"),
      escCsv(businessSnapshot.income.toFixed(2)),
      escCsv(businessSnapshot.expenses.toFixed(2)),
      escCsv(businessSnapshot.taxReserve.toFixed(2)),
      escCsv((businessSnapshot.businessTaxInsurance ?? 0).toFixed(2)),
      escCsv(businessSnapshot.freeMoney.toFixed(2)),
    ].join(","),
  );
  lines.push(
    [
      escCsv("Personal"),
      escCsv(personalSnapshot.income.toFixed(2)),
      escCsv(personalSnapshot.expenses.toFixed(2)),
      escCsv(personalSnapshot.taxReserve.toFixed(2)),
      escCsv("0.00"),
      escCsv(personalSnapshot.freeMoney.toFixed(2)),
    ].join(","),
  );
  lines.push("");
  lines.push(
    [
      escCsv("Account"),
      escCsv("Section"),
      escCsv("Type"),
      escCsv("Label"),
      escCsv("Frequency"),
      escCsv("Amount"),
      escCsv("Monthly Equivalent"),
    ].join(","),
  );
  for (const row of detailRows) {
    lines.push(
      [
        escCsv(row.account),
        escCsv(row.section),
        escCsv(row.type),
        escCsv(row.label),
        escCsv(row.frequency),
        escCsv(row.amount.toFixed(2)),
        escCsv(row.monthlyEquivalent.toFixed(2)),
      ].join(","),
    );
  }

  return lines.join("\n");
}
