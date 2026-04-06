"use client";

import { useMemo, useState } from "react";
import type { BudgetEntry } from "@/lib/budget-types";
import { ACCOUNTS } from "@/lib/budget-types";
import { bg } from "@/lib/bg";
import { toMonthlyAmount } from "@/lib/budget-math";
import { formatMoney } from "@/lib/format-money";
import {
  snapshotBusiness,
  snapshotPersonal,
  type FinancialSnapshot,
} from "@/lib/financial-snapshot";
import { BUSINESS_TAX_RESERVE_RATE } from "@/lib/tax-reserve";
import { useBudget } from "./budget-provider";

function MetricRow({
  label,
  value,
  valueClass = "text-stone-900 dark:text-stone-100",
  sub,
}: {
  label: string;
  value: number;
  valueClass?: string;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-stone-100 py-2 last:border-0 dark:border-stone-800">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          {label}
        </p>
        {sub ? (
          <p className="mt-0.5 text-[11px] text-stone-400 dark:text-stone-500">
            {sub}
          </p>
        ) : null}
      </div>
      <p className={`text-right text-base font-semibold tabular-nums ${valueClass}`}>
        {formatMoney(value)}
      </p>
    </div>
  );
}

function IncomeExpenseBreakdown({
  entries,
  flow,
}: {
  entries: BudgetEntry[];
  flow: "income" | "expense";
}) {
  const lineClass =
    flow === "income"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";

  if (entries.length === 0) {
    return (
      <p className="text-xs text-stone-500 dark:text-stone-400">
        {bg.dashboard.breakdownEmpty}
      </p>
    );
  }

  return (
    <ul className="space-y-1.5 border-t border-stone-100 pt-2 dark:border-stone-800">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex justify-between gap-2 text-xs leading-snug sm:text-sm"
        >
          <span className="min-w-0 flex-1 truncate text-stone-600 dark:text-stone-300">
            {e.label}
          </span>
          <span className={`shrink-0 tabular-nums font-medium ${lineClass}`}>
            {formatMoney(toMonthlyAmount(e))}
            <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
              {bg.entry.perMonth}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ToggleMetricRow({
  label,
  value,
  valueClass,
  flow,
  entries,
  accent,
  open,
  onToggle,
  controlsId,
  regionLabel,
}: {
  label: string;
  value: number;
  valueClass: string;
  flow: "income" | "expense";
  entries: BudgetEntry[];
  accent: "orange" | "rose";
  open: boolean;
  onToggle: () => void;
  controlsId: string;
  regionLabel: string;
}) {
  const btnStyle =
    accent === "orange"
      ? "border-orange-300/90 text-orange-900 hover:bg-orange-50/90 dark:border-orange-700 dark:text-orange-100 dark:hover:bg-orange-950/50"
      : "border-rose-300/90 text-rose-900 hover:bg-rose-50/90 dark:border-rose-800 dark:text-rose-100 dark:hover:bg-rose-950/40";

  return (
    <div className="border-b border-stone-100 dark:border-stone-800">
      <div className="flex flex-wrap items-end justify-between gap-2 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            {label}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <p className={`text-right text-base font-semibold tabular-nums ${valueClass}`}>
            {formatMoney(value)}
          </p>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={controlsId}
            onClick={onToggle}
            className={`shrink-0 rounded-md border bg-white/80 px-2 py-1 text-[11px] font-semibold shadow-sm dark:bg-stone-900/60 ${btnStyle}`}
          >
            {open ? bg.dashboard.breakdownHide : bg.dashboard.breakdownShow}
          </button>
        </div>
      </div>
      {open ? (
        <div
          id={controlsId}
          role="region"
          aria-label={regionLabel}
          className="pb-2"
        >
          <IncomeExpenseBreakdown entries={entries} flow={flow} />
        </div>
      ) : null}
    </div>
  );
}

function TaxReserveToggleRow({
  snap,
  taxSub,
  accent,
  open,
  onToggle,
  controlsId,
}: {
  snap: FinancialSnapshot;
  taxSub?: string;
  accent: "orange" | "rose";
  open: boolean;
  onToggle: () => void;
  controlsId: string;
}) {
  const btnStyle =
    accent === "orange"
      ? "border-orange-300/90 text-orange-900 hover:bg-orange-50/90 dark:border-orange-700 dark:text-orange-100 dark:hover:bg-orange-950/50"
      : "border-rose-300/90 text-rose-900 hover:bg-rose-50/90 dark:border-rose-800 dark:text-rose-100 dark:hover:bg-rose-950/40";

  const taxValueClass =
    accent === "orange"
      ? "text-orange-800 dark:text-orange-300"
      : "text-amber-800 dark:text-amber-300";

  const ratePct = Math.round(BUSINESS_TAX_RESERVE_RATE * 100);
  const base = snap.income;
  const reserve = snap.taxReserve;

  return (
    <div className="border-b border-stone-100 dark:border-stone-800">
      <div className="flex flex-wrap items-end justify-between gap-2 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            {bg.financial.taxReserve}
          </p>
          {taxSub ? (
            <p className="mt-0.5 text-[11px] text-stone-400 dark:text-stone-500">
              {taxSub}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <p
            className={`text-right text-base font-semibold tabular-nums ${taxValueClass}`}
          >
            {formatMoney(reserve)}
          </p>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={controlsId}
            onClick={onToggle}
            className={`shrink-0 rounded-md border bg-white/80 px-2 py-1 text-[11px] font-semibold shadow-sm dark:bg-stone-900/60 ${btnStyle}`}
          >
            {open ? bg.dashboard.breakdownHide : bg.dashboard.breakdownShow}
          </button>
        </div>
      </div>
      {open ? (
        <div
          id={controlsId}
          role="region"
          aria-label={bg.financial.taxReserveBreakdownRegion}
          className="pb-2"
        >
          <div className="space-y-2 border-t border-stone-100 pt-2 text-xs leading-relaxed dark:border-stone-800">
            <p className="text-stone-600 dark:text-stone-400">
              {bg.financial.taxReserveBreakdownExplain}
            </p>
            <ul className="space-y-1.5 rounded-lg bg-stone-50/90 px-3 py-2.5 dark:bg-stone-950/80">
              <li className="flex justify-between gap-3">
                <span className="text-stone-600 dark:text-stone-400">
                  {bg.financial.taxReserveBaseLabel}
                </span>
                <span className="shrink-0 tabular-nums font-medium text-stone-900 dark:text-stone-100">
                  {formatMoney(base)}
                  <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
                    {bg.entry.perMonth}
                  </span>
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-stone-600 dark:text-stone-400">
                  {bg.financial.taxReserveRateLabel}
                </span>
                <span className="shrink-0 tabular-nums font-medium text-stone-900 dark:text-stone-100">
                  {ratePct}%
                </span>
              </li>
              <li className="flex justify-between gap-3 border-t border-stone-200 pt-2 dark:border-stone-700">
                <span className="font-semibold text-stone-700 dark:text-stone-200">
                  {bg.financial.taxReserveResultLabel}
                </span>
                <span
                  className={`shrink-0 tabular-nums font-semibold ${taxValueClass}`}
                >
                  {formatMoney(reserve)}
                  <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
                    {bg.entry.perMonth}
                  </span>
                </span>
              </li>
            </ul>
            <p className="rounded-md bg-orange-50/80 px-2 py-1.5 font-mono text-[11px] text-stone-800 dark:bg-orange-950/40 dark:text-stone-200">
              {ratePct}% × {formatMoney(base)} = {formatMoney(reserve)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FreeMoneyToggleRow({
  snap,
  cardKey,
  accent,
  open,
  onToggle,
  controlsId,
}: {
  snap: FinancialSnapshot;
  cardKey: "business" | "personal";
  accent: "orange" | "rose";
  open: boolean;
  onToggle: () => void;
  controlsId: string;
}) {
  const btnStyle =
    accent === "orange"
      ? "border-orange-300/90 text-orange-900 hover:bg-orange-50/90 dark:border-orange-700 dark:text-orange-100 dark:hover:bg-orange-950/50"
      : "border-rose-300/90 text-rose-900 hover:bg-rose-50/90 dark:border-rose-800 dark:text-rose-100 dark:hover:bg-rose-950/40";

  const income = snap.income;
  const expenses = snap.expenses;
  const taxIns = snap.businessTaxInsurance ?? 0;
  const reserve = snap.taxReserve;
  const free = snap.freeMoney;

  const formula =
    cardKey === "business"
      ? bg.financial.freeMoneyFormulaBusiness
      : bg.financial.freeMoneyFormulaPersonal;

  const moneyClass =
    free >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";

  const rowClass = "flex justify-between gap-3 text-xs sm:text-sm";
  const labelMuted = "text-stone-600 dark:text-stone-400";
  const valPlus = "tabular-nums font-medium text-emerald-600 dark:text-emerald-400";
  const valMinus = "tabular-nums font-medium text-rose-600 dark:text-rose-400";
  const valResult = `tabular-nums font-semibold ${moneyClass}`;

  let formulaMono = "";
  if (cardKey === "business") {
    formulaMono = `${formatMoney(income)} − ${formatMoney(expenses)} − ${formatMoney(taxIns)} − ${formatMoney(reserve)} = ${formatMoney(free)}`;
  } else {
    formulaMono = `${formatMoney(income)} − ${formatMoney(expenses)} = ${formatMoney(free)}`;
  }

  return (
    <div className="mt-2 rounded-xl bg-stone-50 px-3 py-2.5 dark:bg-stone-950/80">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-400">
            {bg.financial.freeMoney}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-stone-500 dark:text-stone-400">
            {formula}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <p className={`text-right text-lg font-semibold tabular-nums ${moneyClass}`}>
            {formatMoney(free)}
          </p>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={controlsId}
            onClick={onToggle}
            className={`shrink-0 rounded-md border bg-white/80 px-2 py-1 text-[11px] font-semibold shadow-sm dark:bg-stone-900/60 ${btnStyle}`}
          >
            {open ? bg.dashboard.breakdownHide : bg.dashboard.breakdownShow}
          </button>
        </div>
      </div>
      {open ? (
        <div
          id={controlsId}
          role="region"
          aria-label={bg.financial.freeMoneyBreakdownRegion}
          className="mt-3 border-t border-stone-200 pt-3 dark:border-stone-700"
        >
          <ul className="space-y-2">
            <li className={rowClass}>
              <span className={labelMuted}>{bg.financial.freeMoneyStepIncome}</span>
              <span className={valPlus}>
                + {formatMoney(income)}
                <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
                  {bg.entry.perMonth}
                </span>
              </span>
            </li>
            <li className={rowClass}>
              <span className={labelMuted}>{bg.financial.freeMoneyStepExpenses}</span>
              <span className={valMinus}>
                − {formatMoney(expenses)}
                <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
                  {bg.entry.perMonth}
                </span>
              </span>
            </li>
            {cardKey === "business" ? (
              <>
                <li className={rowClass}>
                  <span className={labelMuted}>
                    {bg.financial.freeMoneyStepTaxInsurance}
                  </span>
                  <span className={valMinus}>
                    − {formatMoney(taxIns)}
                    <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
                      {bg.entry.perMonth}
                    </span>
                  </span>
                </li>
                <li className={rowClass}>
                  <span className={labelMuted}>
                    {bg.financial.freeMoneyStepReserve}
                  </span>
                  <span className={valMinus}>
                    − {formatMoney(reserve)}
                    <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
                      {bg.entry.perMonth}
                    </span>
                  </span>
                </li>
              </>
            ) : null}
            <li
              className={`${rowClass} border-t border-stone-200 pt-2 dark:border-stone-700`}
            >
              <span className="font-semibold text-stone-800 dark:text-stone-100">
                {bg.financial.freeMoneyStepResult}
              </span>
              <span className={valResult}>
                {formatMoney(free)}
                <span className="ml-1 font-normal text-stone-500 dark:text-stone-400">
                  {bg.entry.perMonth}
                </span>
              </span>
            </li>
          </ul>
          <p
            className={`mt-3 rounded-md px-2 py-1.5 font-mono text-[11px] leading-relaxed ${
              accent === "orange"
                ? "bg-orange-50/90 text-stone-800 dark:bg-orange-950/40 dark:text-stone-200"
                : "bg-rose-50/90 text-stone-800 dark:bg-rose-950/35 dark:text-stone-200"
            }`}
          >
            {formulaMono}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function SnapshotCard({
  title,
  subtitle,
  snap,
  accent,
  taxSub,
  incomes,
  expenses,
  cardKey,
}: {
  title: string;
  subtitle: string;
  snap: FinancialSnapshot;
  accent: "orange" | "rose";
  taxSub?: string;
  incomes: BudgetEntry[];
  expenses: BudgetEntry[];
  cardKey: "business" | "personal";
}) {
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [taxReserveOpen, setTaxReserveOpen] = useState(false);
  const [freeMoneyOpen, setFreeMoneyOpen] = useState(false);

  const border =
    accent === "orange"
      ? "border-orange-200/90 shadow-orange-900/5 dark:border-orange-900/40"
      : "border-rose-200/90 shadow-rose-900/5 dark:border-rose-900/40";
  const head =
    accent === "orange"
      ? "text-orange-950 dark:text-orange-100"
      : "text-rose-950 dark:text-rose-100";

  const taxValueClass =
    accent === "orange"
      ? "text-orange-800 dark:text-orange-300"
      : "text-amber-800 dark:text-amber-300";

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-md sm:p-5 dark:bg-stone-900/80 ${border}`}
    >
      <h2 className={`font-display text-base font-bold ${head}`}>{title}</h2>
      <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>
      <div className="mt-3">
        <ToggleMetricRow
          label={bg.financial.totalIncome}
          value={snap.income}
          valueClass="text-emerald-600 dark:text-emerald-400"
          flow="income"
          entries={incomes}
          accent={accent}
          open={incomeOpen}
          onToggle={() => setIncomeOpen((v) => !v)}
          controlsId={`${cardKey}-income-breakdown`}
          regionLabel={bg.dashboard.breakdownRegionIncome}
        />
        <ToggleMetricRow
          label={bg.financial.totalExpenses}
          value={snap.expenses}
          valueClass="text-rose-600 dark:text-rose-400"
          flow="expense"
          entries={expenses}
          accent={accent}
          open={expenseOpen}
          onToggle={() => setExpenseOpen((v) => !v)}
          controlsId={`${cardKey}-expense-breakdown`}
          regionLabel={bg.dashboard.breakdownRegionExpense}
        />
        {cardKey === "business" && snap.businessTaxInsurance !== undefined ? (
          <MetricRow
            label={bg.financial.businessTaxInsuranceLabel}
            value={snap.businessTaxInsurance}
            valueClass="text-amber-800 dark:text-amber-300"
            sub={bg.financial.businessTaxInsuranceSub}
          />
        ) : null}
        {cardKey === "business" ? (
          <TaxReserveToggleRow
            snap={snap}
            taxSub={taxSub}
            accent={accent}
            open={taxReserveOpen}
            onToggle={() => setTaxReserveOpen((v) => !v)}
            controlsId={`${cardKey}-tax-reserve-breakdown`}
          />
        ) : (
          <MetricRow
            label={bg.financial.taxReserve}
            value={snap.taxReserve}
            valueClass={taxValueClass}
            sub={taxSub}
          />
        )}
        <FreeMoneyToggleRow
          snap={snap}
          cardKey={cardKey}
          accent={accent}
          open={freeMoneyOpen}
          onToggle={() => setFreeMoneyOpen((v) => !v)}
          controlsId={`${cardKey}-free-money-breakdown`}
        />
      </div>
    </div>
  );
}

export function FinancialOverview() {
  const { data, ready, businessTaxInsuranceMonthly } = useBudget();

  const business = useMemo(
    () => snapshotBusiness(data.business, businessTaxInsuranceMonthly),
    [data.business, businessTaxInsuranceMonthly],
  );
  const personal = useMemo(
    () => snapshotPersonal(data.personal),
    [data.personal],
  );

  if (!ready) return null;

  return (
    <section
      className="mb-10"
      aria-labelledby="financial-overview-heading"
    >
      <h2
        id="financial-overview-heading"
        className="font-display mb-3 text-xl font-bold text-stone-900 dark:text-stone-50"
      >
        {bg.financial.title}
      </h2>
      <p className="mb-5 max-w-3xl text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {bg.financial.intro}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <SnapshotCard
          title={ACCOUNTS.business.short}
          subtitle={ACCOUNTS.business.label}
          snap={business}
          accent="orange"
          taxSub={bg.financial.taxSubBusiness}
          incomes={data.business.incomes}
          expenses={data.business.expenses}
          cardKey="business"
        />
        <SnapshotCard
          title={ACCOUNTS.personal.short}
          subtitle={ACCOUNTS.personal.label}
          snap={personal}
          accent="rose"
          taxSub={bg.financial.taxSubPersonal}
          incomes={data.personal.incomes}
          expenses={data.personal.expenses}
          cardKey="personal"
        />
      </div>
    </section>
  );
}
