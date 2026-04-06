"use client";

import { useCallback, useMemo } from "react";
import type { TaxInsuranceFields } from "@/lib/tax-insurance-types";
import { sumTaxInsuranceMonthly } from "@/lib/tax-insurance-types";
import { bg } from "@/lib/bg";
import { formatMoney } from "@/lib/format-money";

function parseAmount(s: string): number {
  const t = s.trim().replace(/,/g, "");
  if (t === "") return 0;
  const n = parseFloat(t);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function displayValue(
  key: keyof TaxInsuranceFields,
  v: number,
): string {
  if ((key === "kd" || key === "dividendTax") && v === 0) return "";
  return String(v);
}

type Props = {
  value: TaxInsuranceFields;
  onChange: (next: TaxInsuranceFields) => void;
};

export function TaxInsuranceCard({ value, onChange }: Props) {
  const patch = useCallback(
    (key: keyof TaxInsuranceFields, raw: string) => {
      const n = parseAmount(raw);
      onChange({ ...value, [key]: n });
    },
    [onChange, value],
  );

  const total = useMemo(() => sumTaxInsuranceMonthly(value), [value]);

  const fields: { key: keyof TaxInsuranceFields; label: string }[] = [
    { key: "kd", label: bg.taxInsurance.kd },
    { key: "dividendTax", label: bg.taxInsurance.dividendTax },
    { key: "dzpo", label: bg.taxInsurance.dzpo },
    { key: "zo", label: bg.taxInsurance.zo },
    { key: "doo", label: bg.taxInsurance.doo },
    { key: "dod", label: bg.taxInsurance.dod },
  ];

  return (
    <div className="rounded-2xl border border-violet-200/90 bg-white p-4 shadow-md shadow-violet-900/5 dark:border-violet-900/50 dark:bg-stone-900/80 sm:p-5">
      <h2 className="font-display text-base font-bold text-violet-950 dark:text-violet-100">
        {bg.taxInsurance.title}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
        {bg.taxInsurance.intro}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(({ key, label }) => (
          <label
            key={key}
            className="flex flex-col gap-1 text-sm"
          >
            <span className="font-medium text-stone-700 dark:text-stone-200">
              {label}
            </span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={displayValue(key, value[key])}
              onChange={(e) => patch(key, e.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 font-medium tabular-nums text-stone-900 shadow-sm outline-none ring-orange-800/0 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-800/25 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-orange-500 dark:focus:ring-orange-500/20"
              aria-label={label}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
          {bg.taxInsurance.sumHint}
        </span>
        <span className="text-lg font-semibold tabular-nums text-violet-800 dark:text-violet-300">
          {formatMoney(total)}
        </span>
      </div>
    </div>
  );
}
