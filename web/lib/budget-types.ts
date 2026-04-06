export type AccountId = "business" | "personal";

export type EntryKind = "fixed" | "variable";

export type Frequency = "weekly" | "biweekly" | "monthly" | "yearly";

export type Flow = "income" | "expense";

export type BudgetEntry = {
  id: string;
  kind: EntryKind;
  label: string;
  /** Amount in the stated frequency for fixed; monthly estimate for variable */
  amount: number;
  /** Fixed entries repeat on this cadence; ignored for variable */
  frequency?: Frequency;
};

export type AccountBook = {
  incomes: BudgetEntry[];
  expenses: BudgetEntry[];
};

export type PersistedBudget = Record<AccountId, AccountBook>;

/** Saved recurring line — same shape as an entry, without being on the ledger yet */
export type BudgetTemplate = {
  id: string;
  label: string;
  amount: number;
  flow: Flow;
  kind: EntryKind;
  frequency?: Frequency;
};

export const ACCOUNTS: Record<
  AccountId,
  { label: string; short: string; accent: string }
> = {
  business: {
    label: "Delliesign",
    short: "Бизнес",
    accent: "amber",
  },
  personal: {
    label: "Елена",
    short: "Лично",
    accent: "rose",
  },
};

export const STORAGE_KEY = "budget-tracker-v1";

/** Per-month budget + tax insurance (see budget-storage.ts) */
export const STORAGE_KEY_V2 = "budget-tracker-v2";

export const TEMPLATES_STORAGE_KEY = "budget-templates-v1";

export const TRANSFERS_STORAGE_KEY = "budget-transfers-v1";

/** Бизнес → лично: създава разход при бизнеса и приход при личното */
export type SalaryTransfer = {
  id: string;
  amount: number;
  note: string;
  at: string;
  /** Кой месечен бюджет е засегнат (YYYY-MM); липсва при стари записи */
  monthKey?: string;
  businessExpenseId?: string;
  personalIncomeId?: string;
};

export function emptyBook(): AccountBook {
  return { incomes: [], expenses: [] };
}
