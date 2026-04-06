"use client";

import { useMemo, useState } from "react";
import type {
  AccountId,
  BudgetEntry,
  EntryKind,
  Flow,
  Frequency,
} from "@/lib/budget-types";
import { bg } from "@/lib/bg";
import { sumMonthly, toMonthlyAmount } from "@/lib/budget-math";
import { formatMoney } from "@/lib/format-money";
import { newId } from "@/lib/id";
import { useBudget } from "./budget-provider";

const freqLabel: Record<Frequency, string> = {
  weekly: bg.frequencyShort.weekly,
  biweekly: bg.frequencyShort.biweekly,
  monthly: bg.frequencyShort.monthly,
  yearly: bg.frequencyShort.yearly,
};

type Props = {
  account: AccountId;
  flow: Flow;
  kind: EntryKind;
  title: string;
  description: string;
  entries: BudgetEntry[];
};

export function EntrySubsection({
  account,
  flow,
  kind,
  title,
  description,
  entries,
}: Props) {
  const { addEntry, updateEntry, removeEntry } = useBudget();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [editingId, setEditingId] = useState<string | null>(null);

  const monthlySubtotal = useMemo(() => sumMonthly(entries), [entries]);

  function parseAmount(): number | null {
    const n = parseFloat(amount.replace(/,/g, ""));
    if (Number.isNaN(n) || n < 0) return null;
    return n;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const a = parseAmount();
    if (a === null || !label.trim()) return;

    if (editingId) {
      updateEntry(account, flow, editingId, {
        label: label.trim(),
        amount: a,
        kind,
        ...(kind === "fixed" ? { frequency } : { frequency: undefined }),
      });
      setEditingId(null);
    } else {
      const entry: BudgetEntry = {
        id: newId(),
        kind,
        label: label.trim(),
        amount: a,
        ...(kind === "fixed" ? { frequency } : {}),
      };
      addEntry(account, flow, entry);
    }
    setLabel("");
    setAmount("");
    setFrequency("monthly");
  }

  function startEdit(entry: BudgetEntry) {
    setEditingId(entry.id);
    setLabel(entry.label);
    setAmount(String(entry.amount));
    setFrequency(entry.frequency ?? "monthly");
  }

  function cancelEdit() {
    setEditingId(null);
    setLabel("");
    setAmount("");
    setFrequency("monthly");
  }

  const isIncome = flow === "income";
  const accent = isIncome
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  return (
    <div className="rounded-xl border border-stone-200/80 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-900/40">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            {title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">{description}</p>
        </div>
        <p className={`text-sm font-medium tabular-nums ${accent}`}>
          ≈ {formatMoney(monthlySubtotal)}
          <span className="ml-1 font-normal text-stone-500">{bg.entry.perMonth}</span>
        </p>
      </div>

      <ul className="mb-3 space-y-1.5">
        {entries.length === 0 ? (
          <li className="rounded-lg border border-dashed border-stone-200 px-3 py-6 text-center text-sm text-stone-400 dark:border-stone-700">
            {bg.entry.empty}
          </li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-stone-950/60"
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {entry.label}
                </span>
                <span className="ml-2 text-stone-500 dark:text-stone-400">
                  {formatMoney(entry.amount)}
                  {entry.kind === "fixed" && entry.frequency
                    ? freqLabel[entry.frequency]
                    : kind === "variable"
                      ? bg.entry.estPerMonth
                      : ""}
                </span>
                {entry.kind === "fixed" && (
                  <span className="ml-2 text-xs text-stone-400">
                    {bg.entry.toMonthly(formatMoney(toMonthlyAmount(entry)))}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(entry)}
                  className="rounded-md px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  {bg.common.edit}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(bg.entry.removeConfirm(entry.label))) {
                      removeEntry(account, flow, entry.id);
                      if (editingId === entry.id) cancelEdit();
                    }
                  }}
                  className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  {bg.common.delete}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={submit} className="space-y-2 border-t border-stone-200 pt-3 dark:border-stone-800">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-stone-600 dark:text-stone-400">
              {bg.common.label}
            </span>
            <input
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-stone-400 focus:ring-2 dark:border-stone-700 dark:bg-stone-950"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={bg.entry.placeholderLabel}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-stone-600 dark:text-stone-400">
              {bg.common.amount}
            </span>
            <input
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm tabular-nums outline-none ring-stone-400 focus:ring-2 dark:border-stone-700 dark:bg-stone-950"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={bg.entry.placeholderAmount}
              required
            />
          </label>
        </div>
        {kind === "fixed" && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-stone-600 dark:text-stone-400">
              {bg.common.repeats}
            </span>
            <select
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-stone-400 focus:ring-2 dark:border-stone-700 dark:bg-stone-950"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
            >
              <option value="weekly">{bg.frequency.weekly}</option>
              <option value="biweekly">{bg.frequency.biweekly}</option>
              <option value="monthly">{bg.frequency.monthly}</option>
              <option value="yearly">{bg.frequency.yearly}</option>
            </select>
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-orange-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-900/25 hover:bg-orange-950 dark:bg-orange-800 dark:hover:bg-orange-700"
          >
            {editingId ? bg.common.save : bg.common.add}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm dark:border-stone-600"
            >
              {bg.common.cancel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
