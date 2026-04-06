/** App-wide display currency */
export const APP_CURRENCY = "EUR";

const LOCALE = "bg-BG";

export function formatMoney(n: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: APP_CURRENCY,
    maximumFractionDigits: 0,
  }).format(n);
}
