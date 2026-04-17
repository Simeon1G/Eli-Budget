"use client";

import { useMemo, useState } from "react";
import { bg } from "@/lib/bg";
import { formatMonthLabelBg, groupMonthKeysByYear } from "@/lib/month-key";
import { buildMonthReportCsv } from "@/lib/month-report";
import { useBudget } from "./budget-provider";

function triggerCsvDownload(filename: string, csv: string): void {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function MonthReportExport() {
  const { selectedMonth, sortedMonthKeys, setSelectedMonth, getMonthPayload } = useBudget();
  const groups = useMemo(
    () => groupMonthKeysByYear(sortedMonthKeys),
    [sortedMonthKeys],
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(
    groups[0]?.year ?? null,
  );

  const monthsForYear = useMemo(() => {
    if (selectedYear == null) return [];
    return groups.find((g) => g.year === selectedYear)?.months ?? [];
  }, [groups, selectedYear]);

  const downloadMonth = monthsForYear.includes(selectedMonth)
    ? selectedMonth
    : monthsForYear[0];

  function handleDownload(): void {
    if (!downloadMonth) return;
    const payload = getMonthPayload(downloadMonth);
    const csv = buildMonthReportCsv({
      monthKey: downloadMonth,
      data: payload.budget,
      taxInsurance: payload.taxInsurance,
    });
    triggerCsvDownload(`budget-report-${downloadMonth}.csv`, csv);
  }

  if (groups.length === 0) return null;

  return (
    <section className="mb-8 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900/80 sm:p-5">
      <h2 className="font-display text-base font-bold text-stone-900 dark:text-stone-50">
        {bg.reports.title}
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{bg.reports.intro}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {groups.map(({ year }) => {
          const active = selectedYear === year;
          return (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                active
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
              }`}
            >
              {year}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {monthsForYear.map((monthKey) => {
          const active = monthKey === downloadMonth;
          return (
            <button
              key={monthKey}
              type="button"
              onClick={() => setSelectedMonth(monthKey)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-stone-900 bg-stone-900 text-white dark:border-stone-50 dark:bg-stone-50 dark:text-stone-900"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
              }`}
            >
              {formatMonthLabelBg(monthKey)}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!downloadMonth}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bg.reports.downloadButton}
        </button>
        {downloadMonth ? (
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {bg.reports.selectedMonth(formatMonthLabelBg(downloadMonth))}
          </span>
        ) : null}
      </div>
    </section>
  );
}
