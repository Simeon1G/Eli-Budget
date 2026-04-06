/** Default estimated tax set-aside rate for business income (Delliesign). */
export const BUSINESS_TAX_RESERVE_RATE = 0.15;

export function monthlyTaxReserve(monthlyIncome: number): number {
  return monthlyIncome * BUSINESS_TAX_RESERVE_RATE;
}
