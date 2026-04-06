import type { AccountId, BudgetTemplate } from "./budget-types";
import { TEMPLATES_STORAGE_KEY } from "./budget-types";

export type PersistedTemplates = Record<AccountId, BudgetTemplate[]>;

const empty: PersistedTemplates = {
  business: [],
  personal: [],
};

export function loadTemplates(): PersistedTemplates {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as PersistedTemplates;
    if (!parsed.business || !parsed.personal) return empty;
    return {
      business: Array.isArray(parsed.business) ? parsed.business : [],
      personal: Array.isArray(parsed.personal) ? parsed.personal : [],
    };
  } catch {
    return empty;
  }
}

export function saveTemplates(data: PersistedTemplates): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(data));
}
