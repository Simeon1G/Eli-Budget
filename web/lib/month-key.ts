/** Calendar month as YYYY-MM (local timezone). */
export type MonthKey = string;

const MONTH_NAMES_BG = [
  "Януари",
  "Февруари",
  "Март",
  "Април",
  "Май",
  "Юни",
  "Юли",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
] as const;

export function currentMonthKey(d = new Date()): MonthKey {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function parseMonthKey(key: MonthKey): { year: number; month: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(key);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function formatMonthLabelBg(key: MonthKey): string {
  const p = parseMonthKey(key);
  if (!p) return key;
  const name = MONTH_NAMES_BG[p.month - 1];
  return `${name} ${p.year}`;
}

/** Descending: newest first (2026-04 before 2026-03). */
export function sortMonthKeysDesc(keys: MonthKey[]): MonthKey[] {
  return [...keys].sort((a, b) => b.localeCompare(a));
}

export function groupMonthKeysByYear(
  keys: MonthKey[],
): { year: number; months: MonthKey[] }[] {
  const sorted = sortMonthKeysDesc(keys);
  const byYear = new Map<number, MonthKey[]>();
  for (const k of sorted) {
    const p = parseMonthKey(k);
    if (!p) continue;
    if (!byYear.has(p.year)) byYear.set(p.year, []);
    byYear.get(p.year)!.push(k);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => ({ year, months }));
}

/** Next calendar month key; wraps year. */
export function nextMonthKey(key: MonthKey): MonthKey {
  const p = parseMonthKey(key);
  if (!p) return currentMonthKey();
  let m = p.month + 1;
  let y = p.year;
  if (m > 12) {
    m = 1;
    y += 1;
  }
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function isoToMonthKey(iso: string): MonthKey {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return currentMonthKey();
    return currentMonthKey(d);
  } catch {
    return currentMonthKey();
  }
}
