"use client";

import { useEffect, useMemo, useState } from "react";
import {
  currentMonthKey,
  formatMonthLabelBg,
  groupMonthKeysByYear,
  nextMonthKey,
  parseMonthKey,
} from "@/lib/month-key";
import { bg } from "@/lib/bg";
import { useBudget } from "./budget-provider";

export function MonthNavigator() {
  const {
    selectedMonth,
    setSelectedMonth,
    sortedMonthKeys,
    addEmptyMonth,
    isCurrentCalendarMonth,
  } = useBudget();

  const [monthPicker, setMonthPicker] = useState(() => selectedMonth);

  useEffect(() => {
    setMonthPicker(selectedMonth);
  }, [selectedMonth]);

  const groups = useMemo(
    () => groupMonthKeysByYear(sortedMonthKeys),
    [sortedMonthKeys],
  );

  const cm = currentMonthKey();

  function submitAddMonth(e: React.FormEvent) {
    e.preventDefault();
    const p = parseMonthKey(monthPicker);
    if (!p) return;
    addEmptyMonth(monthPicker);
  }

  function quickNextEmpty() {
    const first = sortedMonthKeys[0];
    const candidate = first ? nextMonthKey(first) : cm;
    let k = candidate;
    let guard = 0;
    while (sortedMonthKeys.includes(k) && guard < 240) {
      k = nextMonthKey(k);
      guard += 1;
    }
    setMonthPicker(k);
    addEmptyMonth(k);
  }

  return (
    <section
      className="mb-8 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900/80 sm:p-5"
      aria-labelledby="month-nav-heading"
    >
      <h2
        id="month-nav-heading"
        className="font-display text-base font-bold text-stone-900 dark:text-stone-50"
      >
        {bg.months.title}
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        {bg.months.intro}
      </p>
      <p className="mt-3 rounded-lg border border-orange-200/80 bg-orange-50/60 px-3 py-2 text-sm font-medium text-orange-950 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-100">
        {bg.months.selectedLabel(formatMonthLabelBg(selectedMonth))}
        {!isCurrentCalendarMonth ? (
          <span className="ml-2 font-normal text-stone-600 dark:text-stone-400">
            ({bg.months.notCalendarMonth})
          </span>
        ) : null}
      </p>

      <div className="mt-4 space-y-2">
        {groups.map(({ year, months }) => (
          <details
            key={year}
            className="group rounded-xl border border-stone-100 bg-stone-50/80 dark:border-stone-800 dark:bg-stone-950/50"
            open={year >= new Date().getFullYear() - 1}
          >
            <summary className="cursor-pointer list-none px-3 py-2.5 font-display text-sm font-semibold text-stone-800 marker:content-none dark:text-stone-100 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex w-full items-center justify-between gap-2">
                <span>{bg.months.yearHeading(year)}</span>
                <span className="text-xs font-normal text-stone-500 dark:text-stone-400">
                  {months.length}{" "}
                  {months.length === 1 ? bg.months.monthCountOne : bg.months.monthCountMany}
                </span>
              </span>
            </summary>
            <ul className="border-t border-stone-100 px-2 pb-2 pt-1 dark:border-stone-800">
              {months.map((key) => {
                const active = key === selectedMonth;
                const isCalCurrent = key === cm;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => setSelectedMonth(key)}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm transition ${
                        active
                          ? "bg-orange-600 font-semibold text-white shadow-sm dark:bg-orange-700"
                          : "text-stone-700 hover:bg-white dark:text-stone-200 dark:hover:bg-stone-900"
                      }`}
                    >
                      <span>{formatMonthLabelBg(key)}</span>
                      {isCalCurrent ? (
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100"
                          }`}
                        >
                          {bg.months.currentBadge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>

      <form
        onSubmit={submitAddMonth}
        className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-3 dark:border-stone-700 dark:bg-stone-900/30 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <label className="block min-w-[12rem] flex-1 text-xs">
          <span className="text-stone-500">{bg.months.pickMonth}</span>
          <input
            type="month"
            className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            value={monthPicker}
            onChange={(e) => setMonthPicker(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
        >
          {bg.months.addMonth}
        </button>
        <button
          type="button"
          onClick={quickNextEmpty}
          className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600"
        >
          {bg.months.addNextMonth}
        </button>
      </form>
    </section>
  );
}
