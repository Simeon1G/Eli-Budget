import type { AccountBook, AccountId } from "./budget-types";
import { STORAGE_KEY, emptyBook } from "./budget-types";

export type PersistedBudget = Record<AccountId, AccountBook>;

const defaultState: PersistedBudget = {
  business: emptyBook(),
  personal: emptyBook(),
};

export function loadBudget(): PersistedBudget {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as PersistedBudget;
    if (!parsed.business || !parsed.personal) return defaultState;
    return {
      business: normalizeBook(parsed.business),
      personal: normalizeBook(parsed.personal),
    };
  } catch {
    return defaultState;
  }
}

function normalizeBook(book: Partial<AccountBook>): AccountBook {
  return {
    incomes: Array.isArray(book.incomes) ? book.incomes : [],
    expenses: Array.isArray(book.expenses) ? book.expenses : [],
  };
}

export function saveBudget(data: PersistedBudget): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
