"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ACCOUNTS,
  type AccountId,
} from "@/lib/budget-types";
import { bg } from "@/lib/bg";
import { formatMonthLabelBg } from "@/lib/month-key";
import { useBudget } from "./budget-provider";
import { EntrySubsection } from "./entry-subsection";
import { TemplatesSection } from "./templates-section";
import { FinancialOverview } from "./financial-overview";
import { MonthNavigator } from "./month-navigator";
import { TaxInsuranceCard } from "./tax-insurance-card";
import { TransferSection } from "./transfer-section";
import { MonthReportExport } from "./month-report-export";

export function BudgetDashboard() {
  const { data, ready, resetAccount, selectedMonth, taxInsurance, setTaxInsurance } =
    useBudget();
  const [account, setAccount] = useState<AccountId>("business");

  const book = data[account];
  const meta = ACCOUNTS[account];

  const incomeFixed = useMemo(
    () => book.incomes.filter((e) => e.kind === "fixed"),
    [book.incomes],
  );
  const incomeVar = useMemo(
    () => book.incomes.filter((e) => e.kind === "variable"),
    [book.incomes],
  );
  const expenseFixed = useMemo(
    () => book.expenses.filter((e) => e.kind === "fixed"),
    [book.expenses],
  );
  const expenseVar = useMemo(
    () => book.expenses.filter((e) => e.kind === "variable"),
    [book.expenses],
  );

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center font-medium text-stone-500">
        {bg.common.loading}
      </div>
    );
  }

  const tabBase =
    "flex-1 rounded-xl px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-800/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950";
  const businessActive =
    account === "business"
      ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md shadow-orange-900/20 dark:from-orange-600 dark:to-orange-800"
      : "border border-transparent bg-white/70 text-stone-700 hover:bg-white dark:bg-stone-900/50 dark:text-stone-200 dark:hover:bg-stone-800/80";
  const personalActive =
    account === "personal"
      ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-900/20 dark:from-rose-600 dark:to-rose-700"
      : "border border-transparent bg-white/70 text-stone-700 hover:bg-white dark:bg-stone-900/50 dark:text-stone-200 dark:hover:bg-stone-800/80";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="relative mb-10 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/90 p-6 shadow-lg shadow-stone-900/[0.06] backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-none sm:p-8">
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-gradient-to-br from-orange-400/25 to-transparent blur-2xl dark:from-orange-500/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 left-1/4 h-36 w-36 rounded-full bg-gradient-to-tr from-rose-400/20 to-transparent blur-2xl dark:from-rose-500/15"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.35em] text-orange-800/90 dark:text-orange-300/90">
              {bg.dashboard.eyebrow}
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
              {bg.dashboard.title}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {bg.dashboard.subtitle(
                ACCOUNTS.business.label,
                ACCOUNTS.personal.label,
              )}
            </p>
          </div>
          <Link
            href="/how-to-use"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-orange-800/30 hover:bg-orange-50/80 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:border-orange-500/40 dark:hover:bg-stone-700"
          >
            {bg.dashboard.howToUse}
          </Link>
        </div>
      </header>

      <MonthNavigator />

      <MonthReportExport />

      <FinancialOverview />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex w-full max-w-md rounded-2xl border border-stone-200/90 bg-white/80 p-1.5 shadow-sm dark:border-stone-800 dark:bg-stone-900/60"
          role="tablist"
          aria-label={bg.dashboard.accountTabs}
        >
          <button
            type="button"
            role="tab"
            aria-selected={account === "business"}
            className={`${tabBase} ${businessActive}`}
            onClick={() => setAccount("business")}
          >
            <span className="block">{ACCOUNTS.business.short}</span>
            <span className="block text-xs opacity-90">
              {ACCOUNTS.business.label}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={account === "personal"}
            className={`${tabBase} ${personalActive}`}
            onClick={() => setAccount("personal")}
          >
            <span className="block">{ACCOUNTS.personal.short}</span>
            <span className="block text-xs opacity-90">
              {ACCOUNTS.personal.label}
            </span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                bg.dashboard.resetConfirmMonth(
                  meta.short,
                  meta.label,
                  formatMonthLabelBg(selectedMonth),
                ),
              )
            ) {
              resetAccount(account);
            }
          }}
          className="self-start text-sm font-medium text-stone-500 underline-offset-2 hover:text-rose-600 hover:underline dark:text-stone-400 dark:hover:text-rose-400"
        >
          {bg.dashboard.reset}
        </button>
      </div>

      {account === "business" ? (
        <div className="mb-8">
          <TaxInsuranceCard value={taxInsurance} onChange={setTaxInsurance} />
        </div>
      ) : null}

      <TemplatesSection account={account} />

      <TransferSection account={account} />

      <div className="space-y-10">
        <section aria-labelledby="incomes-heading">
          <h2
            id="incomes-heading"
            className="font-display mb-4 flex items-center gap-2 text-xl font-bold text-stone-900 dark:text-stone-50"
          >
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-600/40"
              aria-hidden
            />
            {bg.dashboard.incomes}
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <EntrySubsection
              account={account}
              flow="income"
              kind="fixed"
              title={bg.dashboard.incomeFixedTitle}
              description={bg.dashboard.incomeFixedDesc}
              entries={incomeFixed}
            />
            <EntrySubsection
              account={account}
              flow="income"
              kind="variable"
              title={bg.dashboard.incomeVarTitle}
              description={bg.dashboard.incomeVarDesc}
              entries={incomeVar}
            />
          </div>
        </section>

        <section aria-labelledby="expenses-heading">
          <h2
            id="expenses-heading"
            className="font-display mb-4 flex items-center gap-2 text-xl font-bold text-stone-900 dark:text-stone-50"
          >
            <span
              className="h-2 w-2 rounded-full bg-rose-500 shadow-sm shadow-rose-600/40"
              aria-hidden
            />
            {bg.dashboard.expenses}
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <EntrySubsection
              account={account}
              flow="expense"
              kind="fixed"
              title={bg.dashboard.expenseFixedTitle}
              description={bg.dashboard.expenseFixedDesc}
              entries={expenseFixed}
            />
            <EntrySubsection
              account={account}
              flow="expense"
              kind="variable"
              title={bg.dashboard.expenseVarTitle}
              description={bg.dashboard.expenseVarDesc}
              entries={expenseVar}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
