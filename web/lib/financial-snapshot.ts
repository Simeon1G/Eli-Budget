import type { AccountBook } from "./budget-types";
import { sumMonthly } from "./budget-math";
import { monthlyTaxReserve } from "./tax-reserve";

export type FinancialSnapshot = {
  income: number;
  expenses: number;
  taxReserve: number;
  freeMoney: number;
};

/** Delliesign: 15% of monthly business income */
export function snapshotBusiness(book: AccountBook): FinancialSnapshot {
  const income = sumMonthly(book.incomes);
  const expenses = sumMonthly(book.expenses);
  const taxReserve = monthlyTaxReserve(income);
  return {
    income,
    expenses,
    taxReserve,
    freeMoney: income - expenses - taxReserve,
  };
}

/** Personal: no app tax reserve (set-aside is business-only) */
export function snapshotPersonal(book: AccountBook): FinancialSnapshot {
  const income = sumMonthly(book.incomes);
  const expenses = sumMonthly(book.expenses);
  const taxReserve = 0;
  return {
    income,
    expenses,
    taxReserve,
    freeMoney: income - expenses - taxReserve,
  };
}
