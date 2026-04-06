import type { TaxInsuranceFields } from "./tax-insurance-types";
import {
  TAX_INSURANCE_DEFAULTS,
  TAX_INSURANCE_STORAGE_KEY,
} from "./tax-insurance-types";

function normalizeField(v: unknown, fallback: number): number {
  if (typeof v !== "number" || !Number.isFinite(v)) return fallback;
  return v < 0 ? 0 : v;
}

export function defaultTaxInsurance(): TaxInsuranceFields {
  return { ...TAX_INSURANCE_DEFAULTS };
}

export function loadTaxInsurance(): TaxInsuranceFields {
  if (typeof window === "undefined") return defaultTaxInsurance();
  try {
    const raw = window.localStorage.getItem(TAX_INSURANCE_STORAGE_KEY);
    if (!raw) return defaultTaxInsurance();
    const p = JSON.parse(raw) as Partial<TaxInsuranceFields>;
    const d = TAX_INSURANCE_DEFAULTS;
    return {
      kd: normalizeField(p.kd, d.kd),
      dividendTax: normalizeField(p.dividendTax, d.dividendTax),
      dzpo: normalizeField(p.dzpo, d.dzpo),
      zo: normalizeField(p.zo, d.zo),
      doo: normalizeField(p.doo, d.doo),
      dod: normalizeField(p.dod, d.dod),
    };
  } catch {
    return defaultTaxInsurance();
  }
}

export function saveTaxInsurance(data: TaxInsuranceFields): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TAX_INSURANCE_STORAGE_KEY, JSON.stringify(data));
}
