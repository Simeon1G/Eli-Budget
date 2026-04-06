import type { AccountBook, AccountId } from "./budget-types";
import {
  STORAGE_KEY,
  STORAGE_KEY_V2,
  emptyBook,
  type PersistedBudget,
} from "./budget-types";
import { currentMonthKey } from "./month-key";
import type { TaxInsuranceFields } from "./tax-insurance-types";
import { defaultTaxInsurance } from "./tax-insurance-storage";

export type { PersistedBudget };

export type MonthPayload = {
  budget: PersistedBudget;
  taxInsurance: TaxInsuranceFields;
};

export type MonthsState = Record<string, MonthPayload>;

const defaultBudget: PersistedBudget = {
  business: emptyBook(),
  personal: emptyBook(),
};

function normalizeBook(book: Partial<AccountBook>): AccountBook {
  return {
    incomes: Array.isArray(book.incomes) ? book.incomes : [],
    expenses: Array.isArray(book.expenses) ? book.expenses : [],
  };
}

function normalizePersistedBudget(raw: Partial<PersistedBudget>): PersistedBudget {
  return {
    business: normalizeBook(raw.business ?? {}),
    personal: normalizeBook(raw.personal ?? {}),
  };
}

export function emptyMonthPayload(): MonthPayload {
  return {
    budget: {
      business: emptyBook(),
      personal: emptyBook(),
    },
    taxInsurance: defaultTaxInsurance(),
  };
}

function normalizeTaxInsurance(raw: unknown): TaxInsuranceFields {
  const d = defaultTaxInsurance();
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  const n = (v: unknown, fb: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fb;
  return {
    kd: n(o.kd, d.kd),
    dividendTax: n(o.dividendTax, d.dividendTax),
    dzpo: n(o.dzpo, d.dzpo),
    zo: n(o.zo, d.zo),
    doo: n(o.doo, d.doo),
    dod: n(o.dod, d.dod),
  };
}

function normalizeMonthPayload(raw: unknown): MonthPayload {
  if (!raw || typeof raw !== "object") return emptyMonthPayload();
  const o = raw as Record<string, unknown>;
  const b = o.budget;
  const budget =
    b && typeof b === "object"
      ? normalizePersistedBudget(b as Partial<PersistedBudget>)
      : defaultBudget;
  return {
    budget,
    taxInsurance: normalizeTaxInsurance(o.taxInsurance),
  };
}

function loadLegacyV1Budget(): PersistedBudget | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedBudget;
    if (!parsed.business || !parsed.personal) return null;
    return normalizePersistedBudget(parsed);
  } catch {
    return null;
  }
}

/** Standalone key used before per-month storage */
function loadLegacyStandaloneTax(): TaxInsuranceFields | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("budget-tax-insurance-v1");
    if (!raw) return null;
    return normalizeTaxInsurance(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function loadMonthsState(): MonthsState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_V2);
    if (raw) {
      const parsed = JSON.parse(raw) as { v?: number; months?: unknown };
      if (parsed.v === 2 && parsed.months && typeof parsed.months === "object") {
        const out: MonthsState = {};
        for (const [k, v] of Object.entries(
          parsed.months as Record<string, unknown>,
        )) {
          if (/^\d{4}-\d{2}$/.test(k)) {
            out[k] = normalizeMonthPayload(v);
          }
        }
        return out;
      }
    }

    const cm = currentMonthKey();
    const legacyBudget = loadLegacyV1Budget();
    const legacyTax = loadLegacyStandaloneTax();
    const merged: MonthsState = {};
    merged[cm] = {
      budget: legacyBudget ?? defaultBudget,
      taxInsurance: legacyTax ?? defaultTaxInsurance(),
    };
    window.localStorage.setItem(
      STORAGE_KEY_V2,
      JSON.stringify({ v: 2, months: merged }),
    );
    return merged;
  } catch {
    return { [currentMonthKey()]: emptyMonthPayload() };
  }
}

export function saveMonthsState(months: MonthsState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY_V2,
    JSON.stringify({ v: 2, months }),
  );
}

/** Ensure key exists (mutates map). */
export function ensureMonth(months: MonthsState, key: string): void {
  if (!months[key]) {
    months[key] = emptyMonthPayload();
  }
}
