/**
 * Данъци и осигуровки в бизнес бюджета: отделно от списъка „Разходи“;
 * не намаляват основата за 15% резерв върху прихода; се изваждат при „свободни пари“.
 * Сумите са месечни (лв.).
 */
export type TaxInsuranceFields = {
  kd: number;
  dividendTax: number;
  dzpo: number;
  zo: number;
  doo: number;
  dod: number;
};

/** Стартови стойности за ДЗПО, ЗО, ДОО, ДОД — ориентировъчни; редактируеми в UI. КД и данък дивидент са празни (0). */
export const TAX_INSURANCE_DEFAULTS: TaxInsuranceFields = {
  kd: 0,
  dividendTax: 0,
  dzpo: 63,
  zo: 52,
  doo: 280,
  dod: 0,
};

export const TAX_INSURANCE_STORAGE_KEY = "budget-tax-insurance-v1";

export function sumTaxInsuranceMonthly(f: TaxInsuranceFields): number {
  return (
    num(f.kd) +
    num(f.dividendTax) +
    num(f.dzpo) +
    num(f.zo) +
    num(f.doo) +
    num(f.dod)
  );
}

function num(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}
