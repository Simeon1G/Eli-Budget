"use client";

import { useState } from "react";
import type {
  AccountId,
  BudgetTemplate,
  EntryKind,
  Flow,
  Frequency,
} from "@/lib/budget-types";
import { bg, categoryLabelBg } from "@/lib/bg";
import { formatMoney } from "@/lib/format-money";
import { newId } from "@/lib/id";
import { useBudget } from "./budget-provider";
import { LoadTemplatesModal } from "./load-templates-modal";

const freqShort: Record<Frequency, string> = {
  weekly: bg.frequencyShort.weekly,
  biweekly: bg.frequencyShort.biweekly,
  monthly: bg.frequencyShort.monthly,
  yearly: bg.frequencyShort.yearly,
};

type Props = {
  account: AccountId;
};

export function TemplatesSection({ account }: Props) {
  const { templates, addTemplate, updateTemplate, removeTemplate } =
    useBudget();
  const [loadOpen, setLoadOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [flow, setFlow] = useState<Flow>("expense");
  const [kind, setKind] = useState<EntryKind>("fixed");
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const rows = templates[account];

  function resetForm() {
    setEditingId(null);
    setLabel("");
    setAmount("");
    setFlow("expense");
    setKind("fixed");
    setFrequency("monthly");
  }

  function parseAmount(): number | null {
    const n = parseFloat(amount.replace(/,/g, ""));
    if (Number.isNaN(n) || n < 0) return null;
    return n;
  }

  function submitTemplate(e: React.FormEvent) {
    e.preventDefault();
    const a = parseAmount();
    if (a === null || !label.trim()) return;

    if (editingId) {
      updateTemplate(account, editingId, {
        label: label.trim(),
        amount: a,
        flow,
        kind,
        ...(kind === "fixed" ? { frequency } : { frequency: undefined }),
      });
      resetForm();
      return;
    }

    const t: BudgetTemplate = {
      id: newId(),
      label: label.trim(),
      amount: a,
      flow,
      kind,
      ...(kind === "fixed" ? { frequency } : {}),
    };
    addTemplate(account, t);
    resetForm();
  }

  function startEdit(t: BudgetTemplate) {
    setEditingId(t.id);
    setLabel(t.label);
    setAmount(String(t.amount));
    setFlow(t.flow);
    setKind(t.kind);
    setFrequency(t.frequency ?? "monthly");
  }

  return (
    <section
      className="mb-10 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950 sm:p-6"
      aria-labelledby="templates-heading"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="templates-heading"
            className="text-lg font-semibold text-stone-900 dark:text-stone-50"
          >
            {bg.templates.title}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-stone-500 dark:text-stone-400">
            {bg.templates.intro}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setLoadOpen(true)}
          className="shrink-0 rounded-xl bg-orange-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-900/25 hover:bg-orange-950 dark:bg-orange-800 dark:hover:bg-orange-700"
        >
          {bg.templates.loadButton}
        </button>
      </div>

      <ul className="mb-4 divide-y divide-stone-100 dark:divide-stone-800">
        {rows.length === 0 ? (
          <li className="py-6 text-center text-sm text-stone-400">
            {bg.templates.empty}
          </li>
        ) : (
          rows.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm first:pt-0"
            >
              <div className="min-w-0">
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {t.label}
                </span>
                <span className="ml-2 text-stone-500">
                  {formatMoney(t.amount)}
                  {t.kind === "fixed" && t.frequency
                    ? freqShort[t.frequency]
                    : t.kind === "variable"
                      ? bg.entry.estPerMonth
                      : ""}
                </span>
                <span className="ml-2 rounded-md bg-stone-100 px-1.5 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                  {categoryLabelBg(t.flow, t.kind)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="rounded-md px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  {bg.common.edit}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(bg.templates.removeConfirm(t.label))) {
                      removeTemplate(account, t.id);
                      if (editingId === t.id) resetForm();
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

      <form
        onSubmit={submitTemplate}
        className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-900/40"
      >
        <p className="mb-3 text-xs font-medium text-stone-600 dark:text-stone-400">
          {editingId ? bg.templates.editTemplate : bg.templates.newTemplate}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs sm:col-span-2">
            <span className="text-stone-500">{bg.common.label}</span>
            <input
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={bg.templates.placeholderLabel}
              required
            />
          </label>
          <label className="block text-xs">
            <span className="text-stone-500">{bg.common.amount}</span>
            <input
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm tabular-nums dark:border-stone-700 dark:bg-stone-950"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label className="block text-xs">
            <span className="text-stone-500">{bg.common.type}</span>
            <select
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950"
              value={flow}
              onChange={(e) => setFlow(e.target.value as Flow)}
            >
              <option value="income">{bg.flow.income}</option>
              <option value="expense">{bg.flow.expense}</option>
            </select>
          </label>
          <label className="block text-xs">
            <span className="text-stone-500">{bg.common.category}</span>
            <select
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950"
              value={kind}
              onChange={(e) => {
                const k = e.target.value as EntryKind;
                setKind(k);
                if (k === "variable") setFrequency("monthly");
              }}
            >
              <option value="fixed">{bg.kind.fixed}</option>
              <option value="variable">{bg.kind.variable}</option>
            </select>
          </label>
          {kind === "fixed" && (
            <label className="block text-xs lg:col-span-2">
              <span className="text-stone-500">{bg.common.repeats}</span>
              <select
                className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950"
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value as Frequency)
                }
              >
                <option value="weekly">{bg.frequency.weekly}</option>
                <option value="biweekly">{bg.frequency.biweekly}</option>
                <option value="monthly">{bg.frequency.monthly}</option>
                <option value="yearly">{bg.frequency.yearly}</option>
              </select>
            </label>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-orange-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-950 dark:bg-orange-800"
          >
            {editingId ? bg.templates.saveTemplate : bg.templates.addTemplate}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm dark:border-stone-600"
            >
              {bg.common.cancel}
            </button>
          )}
        </div>
      </form>

      <LoadTemplatesModal
        account={account}
        open={loadOpen}
        onClose={() => setLoadOpen(false)}
      />
    </section>
  );
}
