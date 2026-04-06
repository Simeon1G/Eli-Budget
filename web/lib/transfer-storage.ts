import type { SalaryTransfer } from "./budget-types";
import { TRANSFERS_STORAGE_KEY } from "./budget-types";

export function loadTransfers(): SalaryTransfer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TRANSFERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is SalaryTransfer =>
          typeof x === "object" &&
          x !== null &&
          typeof (x as SalaryTransfer).id === "string" &&
          typeof (x as SalaryTransfer).amount === "number" &&
          typeof (x as SalaryTransfer).at === "string",
      )
      .map((x) => ({
        ...x,
        note: typeof x.note === "string" ? x.note : "",
      }));
  } catch {
    return [];
  }
}

export function saveTransfers(list: SalaryTransfer[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRANSFERS_STORAGE_KEY, JSON.stringify(list));
}
