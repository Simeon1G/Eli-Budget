"use client";

import { useMemo, useState } from "react";
import { bg } from "@/lib/bg";
import { APP_CURRENCY } from "@/lib/format-money";
import { formatMonthLabelBg, groupMonthKeysByYear } from "@/lib/month-key";
import { buildMonthReportData } from "@/lib/month-report";
import { useBudget } from "./budget-provider";

type PdfPrinterLike = {
  createPdf: (docDefinition: unknown) => { download: (filename?: string) => void };
  vfs?: Record<string, string>;
};

function amountLabel(value: number): string {
  return `${value.toFixed(2)} ${APP_CURRENCY}`;
}

async function triggerPdfDownload(filename: string, report: ReturnType<typeof buildMonthReportData>): Promise<void> {
  const [{ default: pdfMakeModule }, { default: pdfFontsModule }] = await Promise.all([
    import("pdfmake/build/pdfmake"),
    import("pdfmake/build/vfs_fonts"),
  ]);
  const pdfMake = pdfMakeModule as PdfPrinterLike;
  const fontsSource = pdfFontsModule as { pdfMake?: { vfs?: Record<string, string> }; vfs?: Record<string, string> };
  const vfs = fontsSource.pdfMake?.vfs ?? fontsSource.vfs;
  if (vfs) {
    pdfMake.vfs = vfs;
  }

  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [28, 30, 28, 30] as [number, number, number, number],
    content: [
      { text: report.title, style: "header" },
      { text: `Month: ${report.monthLabel}`, style: "meta" },
      { text: `Currency: ${APP_CURRENCY}`, style: "meta", margin: [0, 0, 0, 10] as [number, number, number, number] },
      { text: "Summary", style: "sectionTitle" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "*", "*", "*", "*"],
          body: [
            ["Account", "Total Income", "Total Expenses", "Tax Reserve", "Tax/Insurance", "Free Money"],
            ...report.summaryRows.map((row) => [
              row.account,
              amountLabel(row.totalIncome),
              amountLabel(row.totalExpenses),
              amountLabel(row.taxReserve),
              amountLabel(row.taxInsurance),
              amountLabel(row.freeMoney),
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
      { text: "Detailed Entries", style: "sectionTitle", margin: [0, 14, 0, 4] as [number, number, number, number] },
      {
        table: {
          headerRows: 1,
          widths: [60, 56, 58, "*", 58, 72, 80],
          body: [
            ["Account", "Section", "Type", "Label", "Frequency", "Amount", "Monthly Eq."],
            ...report.detailRows.map((row) => [
              row.account,
              row.section,
              row.type,
              row.label,
              row.frequency || "-",
              amountLabel(row.amount),
              amountLabel(row.monthlyEquivalent),
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      header: { fontSize: 16, bold: true },
      meta: { fontSize: 10, color: "#555555" },
      sectionTitle: { fontSize: 12, bold: true, margin: [0, 8, 0, 5] as [number, number, number, number] },
    },
    defaultStyle: {
      fontSize: 9,
    },
  };

  pdfMake.createPdf(docDefinition).download(filename);
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

  async function handleDownload(): Promise<void> {
    if (!downloadMonth) return;
    const payload = getMonthPayload(downloadMonth);
    const report = buildMonthReportData({
      monthKey: downloadMonth,
      data: payload.budget,
      taxInsurance: payload.taxInsurance,
    });
    await triggerPdfDownload(`budget-report-${downloadMonth}.pdf`, report);
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
