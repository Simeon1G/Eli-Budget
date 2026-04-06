"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AccountId,
  EntryKind,
  Flow,
  Frequency,
} from "@/lib/budget-types";
import { ACCOUNTS } from "@/lib/budget-types";
import { bg } from "@/lib/bg";
import { useBudget, type ApplyRow } from "./budget-provider";

type Draft = {
  templateId: string;
  included: boolean;
  label: string;
  amount: string;
  flow: Flow;
  kind: EntryKind;
  frequency: Frequency;
};

function parseAmount(s: string): number | null {
  const n = parseFloat(s.replace(/,/g, ""));
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

type Props = {
  account: AccountId;
  open: boolean;
  onClose: () => void;
};

export function LoadTemplatesModal({ account, open, onClose }: Props) {
  const { templates, applyTemplateRows } = useBudget();
  const templatesRef = useRef(templates);
  templatesRef.current = templates;
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    if (!open) return;
    const list = templatesRef.current[account];
    setDrafts(
      list.map((t) => ({
        templateId: t.id,
        included: true,
        label: t.label,
        amount: String(t.amount),
        flow: t.flow,
        kind: t.kind,
        frequency: t.frequency ?? "monthly",
      })),
    );
  }, [open, account]);

  const meta = ACCOUNTS[account];
  const allExcluded = useMemo(
    () => drafts.length > 0 && drafts.every((d) => !d.included),
    [drafts],
  );

  function updateDraft(
    templateId: string,
    patch: Partial<Draft> | ((prev: Draft) => Partial<Draft>),
  ) {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.templateId !== templateId) return d;
        const p = typeof patch === "function" ? patch(d) : patch;
        return { ...d, ...p };
      }),
    );
  }

  function apply() {
    const rows: ApplyRow[] = [];
    for (const d of drafts) {
      if (!d.included) continue;
      const amt = parseAmount(d.amount);
      if (amt === null || !d.label.trim()) {
        alert(bg.loadModal.alertInvalid);
        return;
      }
      rows.push({
        flow: d.flow,
        label: d.label.trim(),
        amount: amt,
        kind: d.kind,
        ...(d.kind === "fixed" ? { frequency: d.frequency } : {}),
      });
    }
    if (rows.length === 0) {
      alert(bg.loadModal.alertNone);
      return;
    }
    applyTemplateRows(account, rows);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="load-templates-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-950">
        <div className="border-b border-stone-200 px-4 py-3 dark:border-stone-800 sm:px-6">
          <h2
            id="load-templates-title"
            className="text-lg font-semibold text-stone-900 dark:text-stone-50"
          >
            {bg.loadModal.title}
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {bg.loadModal.subtitle(meta.short, meta.label)}
          </p>
        </div>

        <div className="max-h-[min(60vh,520px)] overflow-y-auto px-4 py-3 sm:px-6">
          {drafts.length === 0 ? (
            <p className="py-8 text-center text-sm text-stone-500">
              {bg.loadModal.empty}
            </p>
          ) : (
            <ul className="space-y-3">
              {drafts.map((d) => (
                <li
                  key={d.templateId}
                  className={`rounded-xl border p-3 ${
                    d.included
                      ? "border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900/50"
                      : "border-stone-100 bg-stone-50/50 opacity-60 dark:border-stone-800 dark:bg-stone-900/30"
                  }`}
                >
                  <div className="mb-2 flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-stone-300"
                      checked={d.included}
                      onChange={(e) =>
                        updateDraft(d.templateId, { included: e.target.checked })
                      }
                      aria-label={bg.loadModal.include(d.label)}
                    />
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <label className="block text-xs">
                        <span className="text-stone-500">{bg.common.label}</span>
                        <input
                          className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-950"
                          value={d.label}
                          onChange={(e) =>
                            updateDraft(d.templateId, { label: e.target.value })
                          }
                          disabled={!d.included}
                        />
                      </label>
                      <label className="block text-xs">
                        <span className="text-stone-500">{bg.common.amount}</span>
                        <input
                          className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm tabular-nums dark:border-stone-700 dark:bg-stone-950"
                          inputMode="decimal"
                          value={d.amount}
                          onChange={(e) =>
                            updateDraft(d.templateId, { amount: e.target.value })
                          }
                          disabled={!d.included}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="ml-6 grid gap-2 sm:grid-cols-3">
                    <label className="block text-xs">
                      <span className="text-stone-500">{bg.common.type}</span>
                      <select
                        className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-950"
                        value={d.flow}
                        onChange={(e) =>
                          updateDraft(d.templateId, {
                            flow: e.target.value as Flow,
                          })
                        }
                        disabled={!d.included}
                      >
                        <option value="income">{bg.flow.income}</option>
                        <option value="expense">{bg.flow.expense}</option>
                      </select>
                    </label>
                    <label className="block text-xs">
                      <span className="text-stone-500">{bg.common.category}</span>
                      <select
                        className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-950"
                        value={d.kind}
                        onChange={(e) => {
                          const kind = e.target.value as EntryKind;
                          updateDraft(d.templateId, (prev) => ({
                            kind,
                            frequency:
                              kind === "fixed"
                                ? prev.frequency
                                : "monthly",
                          }));
                        }}
                        disabled={!d.included}
                      >
                        <option value="fixed">{bg.kind.fixed}</option>
                        <option value="variable">{bg.kind.variable}</option>
                      </select>
                    </label>
                    {d.kind === "fixed" && (
                      <label className="block text-xs">
                        <span className="text-stone-500">{bg.common.repeats}</span>
                        <select
                          className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-950"
                          value={d.frequency}
                          onChange={(e) =>
                            updateDraft(d.templateId, {
                              frequency: e.target.value as Frequency,
                            })
                          }
                          disabled={!d.included}
                        >
                          <option value="weekly">{bg.frequency.weekly}</option>
                          <option value="biweekly">{bg.frequency.biweekly}</option>
                          <option value="monthly">{bg.frequency.monthly}</option>
                          <option value="yearly">{bg.frequency.yearly}</option>
                        </select>
                      </label>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-stone-200 px-4 py-3 dark:border-stone-800 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm dark:border-stone-600"
          >
            {bg.common.cancel}
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={drafts.length === 0 || allExcluded}
            className="rounded-lg bg-orange-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-900/25 hover:bg-orange-950 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-800 dark:hover:bg-orange-700"
          >
            {bg.loadModal.addToBudget}
          </button>
        </div>
      </div>
    </div>
  );
}
