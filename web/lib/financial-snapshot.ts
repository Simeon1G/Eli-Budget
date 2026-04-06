import type { AccountBook } from "./budget-types";
import { sumMonthly } from "./budget-math";
import { monthlyTaxReserve } from "./tax-reserve";

export type FinancialSnapshot = {
  income: number;
  expenses: number;
  taxReserve: number;
  /** Бизнес: сума от картата „Данъци и осигуровки“ (месечно); не в списъка „Разходи“ */
  businessTaxInsurance?: number;
  freeMoney: number;
};

/**
 * Delliesign: 15% резерв върху пълния месечен бизнес приход.
 * `businessTaxInsuranceMonthly` се изважда от прихода (не е в разходите и не намалява основата за 15%).
 */
export function snapshotBusiness(
  book: AccountBook,
  businessTaxInsuranceMonthly = 0,
): FinancialSnapshot {
  const income = sumMonthly(book.incomes);
  const expenses = sumMonthly(book.expenses);
  const taxReserve = monthlyTaxReserve(income);
  const bt = Math.max(
    0,
    Number.isFinite(businessTaxInsuranceMonthly)
      ? businessTaxInsuranceMonthly
      : 0,
  );
  return {
    income,
    expenses,
    taxReserve,
    businessTaxInsurance: bt,
    freeMoney: income - expenses - bt - taxReserve,
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
