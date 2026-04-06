"use client";

import { useMemo, useState } from "react";
import { ACCOUNTS, type AccountId } from "@/lib/budget-types";
import { bg } from "@/lib/bg";
import { formatMoney } from "@/lib/format-money";
import { useBudget } from "./budget-provider";

const LOCALE = "bg-BG";

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(LOCALE, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

type Props = {
  account: AccountId;
};

export function TransferSection({ account }: Props) {
  const { transfers, addSalaryTransfer, removeSalaryTransfer } = useBudget();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const total = useMemo(
    () => transfers.reduce((s, t) => s + t.amount, 0),
    [transfers],
  );

  const isBusiness = account === "business";
  const other = isBusiness ? ACCOUNTS.personal : ACCOUNTS.business;

  function parseAmount(): number | null {
    const n = parseFloat(amount.replace(/,/g, ""));
    if (Number.isNaN(n) || n <= 0) return null;
    return n;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const a = parseAmount();
    if (a === null) return;
    addSalaryTransfer(a, note);
    setAmount("");
    setNote("");
  }

  return (
    <section
      className="mb-10 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950 sm:p-6"
      aria-labelledby="transfer-heading"
    >
      <h2
        id="transfer-heading"
        className="text-lg font-semibold text-stone-900 dark:text-stone-50"
      >
        {isBusiness
          ? bg.transfer.titleTo(other.short, other.label)
          : bg.transfer.titleFrom(other.short, other.label)}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-stone-500 dark:text-stone-400">
        {bg.transfer.intro}
      </p>

      <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/80 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/40">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          {isBusiness ? bg.transfer.totalOut : bg.transfer.totalIn}
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-900 dark:text-stone-50">
          {formatMoney(total)}
        </p>
      </div>

      {isBusiness && (
        <form
          onSubmit={submit}
          className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-4 dark:border-stone-700 dark:bg-stone-900/30 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <label className="block min-w-[8rem] flex-1 text-xs">
            <span className="text-stone-500">{bg.common.amount}</span>
            <input
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm tabular-nums dark:border-stone-700 dark:bg-stone-950"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              aria-label={bg.transfer.ariaAmount}
            />
          </label>
          <label className="block min-w-[12rem] flex-[2] text-xs">
            <span className="text-stone-500">{bg.transfer.noteOptional}</span>
            <input
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-950"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={bg.transfer.placeholderNote}
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-orange-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-900/25 hover:bg-orange-950 dark:bg-orange-800 dark:hover:bg-orange-700"
          >
            {bg.transfer.record}
          </button>
        </form>
      )}

      {!isBusiness && (
        <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
          {bg.transfer.hintPersonal}
        </p>
      )}

      <ul className="mt-4 divide-y divide-stone-100 dark:divide-stone-800">
        {transfers.length === 0 ? (
          <li className="py-6 text-center text-sm text-stone-400">
            {bg.transfer.empty}
          </li>
        ) : (
          transfers.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm first:pt-0"
            >
              <div className="min-w-0">
                <p className="font-medium tabular-nums text-stone-900 dark:text-stone-100">
                  {formatMoney(t.amount)}
                  <span className="ml-2 font-normal text-stone-500">
                    {isBusiness ? bg.transfer.arrowToPersonal : bg.transfer.arrowFromBusiness}
                  </span>
                </p>
                <p className="text-xs text-stone-500">{formatWhen(t.at)}</p>
                {t.note ? (
                  <p className="mt-0.5 text-stone-600 dark:text-stone-300">{t.note}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(bg.transfer.removeConfirm)) {
                    removeSalaryTransfer(t.id);
                  }
                }}
                className="shrink-0 rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
              >
                {bg.common.remove}
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
