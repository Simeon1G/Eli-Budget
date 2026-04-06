import type { BudgetEntry, Frequency } from "./budget-types";

/** Convert an amount to approximate monthly equivalent */
export function toMonthlyAmount(entry: BudgetEntry): number {
  if (entry.kind === "variable") {
    return Math.max(0, entry.amount);
  }
  const freq: Frequency = entry.frequency ?? "monthly";
  const a = entry.amount;
  switch (freq) {
    case "weekly":
      return (a * 52) / 12;
    case "biweekly":
      return (a * 26) / 12;
    case "monthly":
      return a;
    case "yearly":
      return a / 12;
    default:
      return a;
  }
}

export function sumMonthly(entries: BudgetEntry[]): number {
  return entries.reduce((s, e) => s + toMonthlyAmount(e), 0);
}
