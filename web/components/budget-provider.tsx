"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AccountId,
  BudgetEntry,
  BudgetTemplate,
  EntryKind,
  Flow,
  Frequency,
  PersistedBudget,
  SalaryTransfer,
} from "@/lib/budget-types";
import { emptyBook } from "@/lib/budget-types";
import {
  emptyMonthPayload,
  ensureMonth,
  loadMonthsState,
  saveMonthsState,
  type MonthPayload,
  type MonthsState,
} from "@/lib/budget-storage";
import { loadTemplates, saveTemplates, type PersistedTemplates } from "@/lib/template-storage";
import { loadTransfers, saveTransfers } from "@/lib/transfer-storage";
import { bg } from "@/lib/bg";
import { currentMonthKey, isoToMonthKey } from "@/lib/month-key";
import { newId } from "@/lib/id";
import type { TaxInsuranceFields } from "@/lib/tax-insurance-types";
import { sumTaxInsuranceMonthly } from "@/lib/tax-insurance-types";

export type ApplyRow = {
  flow: Flow;
  label: string;
  amount: number;
  kind: EntryKind;
  frequency?: Frequency;
};

type BudgetContextValue = {
  data: PersistedBudget;
  taxInsurance: TaxInsuranceFields;
  businessTaxInsuranceMonthly: number;
  setTaxInsurance: (next: TaxInsuranceFields) => void;
  selectedMonth: string;
  setSelectedMonth: (key: string) => void;
  sortedMonthKeys: string[];
  addEmptyMonth: (key: string) => void;
  isCurrentCalendarMonth: boolean;
  templates: PersistedTemplates;
  ready: boolean;
  addEntry: (account: AccountId, flow: Flow, entry: BudgetEntry) => void;
  updateEntry: (
    account: AccountId,
    flow: Flow,
    id: string,
    patch: Partial<BudgetEntry>,
  ) => void;
  removeEntry: (account: AccountId, flow: Flow, id: string) => void;
  resetAccount: (account: AccountId) => void;
  addTemplate: (account: AccountId, template: BudgetTemplate) => void;
  updateTemplate: (
    account: AccountId,
    id: string,
    patch: Partial<Omit<BudgetTemplate, "id">>,
  ) => void;
  removeTemplate: (account: AccountId, id: string) => void;
  applyTemplateRows: (account: AccountId, rows: ApplyRow[]) => void;
  transfers: SalaryTransfer[];
  transfersForSelectedMonth: SalaryTransfer[];
  addSalaryTransfer: (amount: number, note: string) => void;
  removeSalaryTransfer: (id: string) => void;
};

const BudgetContext = createContext<BudgetContextValue | null>(null);

const emptyTemplates: PersistedTemplates = {
  business: [],
  personal: [],
};

function sortMonthKeysDesc(keys: string[]): string[] {
  return [...keys].sort((a, b) => b.localeCompare(a));
}

function normalizeTransfersOnLoad(list: SalaryTransfer[]): SalaryTransfer[] {
  return list.map((t) => ({
    ...t,
    monthKey: t.monthKey ?? isoToMonthKey(t.at),
  }));
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [months, setMonths] = useState<MonthsState>({});
  const [selectedMonth, setSelectedMonthState] = useState(currentMonthKey());
  const [templates, setTemplates] =
    useState<PersistedTemplates>(emptyTemplates);
  const [transfers, setTransfers] = useState<SalaryTransfer[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = loadMonthsState();
    const cm = currentMonthKey();
    ensureMonth(loaded, cm);
    setMonths(loaded);
    setSelectedMonthState(cm);
    setTemplates(loadTemplates());
    setTransfers(normalizeTransfersOnLoad(loadTransfers()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveMonthsState(months);
  }, [months, ready]);

  useEffect(() => {
    if (!ready) return;
    saveTemplates(templates);
  }, [templates, ready]);

  useEffect(() => {
    if (!ready) return;
    saveTransfers(transfers);
  }, [transfers, ready]);

  const setSelectedMonth = useCallback((key: string) => {
    if (!/^\d{4}-\d{2}$/.test(key)) return;
    setMonths((prev) => {
      const next = { ...prev };
      ensureMonth(next, key);
      return next;
    });
    setSelectedMonthState(key);
  }, []);

  const addEmptyMonth = useCallback((key: string) => {
    if (!/^\d{4}-\d{2}$/.test(key)) return;
    setMonths((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: emptyMonthPayload() };
    });
    setSelectedMonthState(key);
  }, []);

  const currentPayload: MonthPayload = useMemo(() => {
    return months[selectedMonth] ?? emptyMonthPayload();
  }, [months, selectedMonth]);

  const data = currentPayload.budget;
  const taxInsurance = currentPayload.taxInsurance;

  const setTaxInsurance = useCallback((next: TaxInsuranceFields) => {
    setMonths((prev) => {
      const p = prev[selectedMonth] ?? emptyMonthPayload();
      return {
        ...prev,
        [selectedMonth]: { ...p, taxInsurance: next },
      };
    });
  }, [selectedMonth]);

  const businessTaxInsuranceMonthly = useMemo(
    () => sumTaxInsuranceMonthly(taxInsurance),
    [taxInsurance],
  );

  const sortedMonthKeys = useMemo(
    () => sortMonthKeysDesc(Object.keys(months)),
    [months],
  );

  const isCurrentCalendarMonth = selectedMonth === currentMonthKey();

  const transfersForSelectedMonth = useMemo(
    () =>
      transfers.filter(
        (t) => (t.monthKey ?? isoToMonthKey(t.at)) === selectedMonth,
      ),
    [transfers, selectedMonth],
  );

  const patchMonthBudget = useCallback(
    (fn: (book: PersistedBudget) => PersistedBudget) => {
      setMonths((prev) => {
        const p = prev[selectedMonth] ?? emptyMonthPayload();
        return {
          ...prev,
          [selectedMonth]: { ...p, budget: fn(p.budget) },
        };
      });
    },
    [selectedMonth],
  );

  const addEntry = useCallback(
    (account: AccountId, flow: Flow, entry: BudgetEntry) => {
      patchMonthBudget((budget) => {
        const book = budget[account];
        const key = flow === "income" ? "incomes" : "expenses";
        return {
          ...budget,
          [account]: {
            ...book,
            [key]: [...book[key], entry],
          },
        };
      });
    },
    [patchMonthBudget],
  );

  const updateEntry = useCallback(
    (account: AccountId, flow: Flow, id: string, patch: Partial<BudgetEntry>) => {
      patchMonthBudget((budget) => {
        const book = budget[account];
        const key = flow === "income" ? "incomes" : "expenses";
        return {
          ...budget,
          [account]: {
            ...book,
            [key]: book[key].map((e) =>
              e.id === id ? { ...e, ...patch } : e,
            ),
          },
        };
      });
    },
    [patchMonthBudget],
  );

  const removeEntry = useCallback(
    (account: AccountId, flow: Flow, id: string) => {
      patchMonthBudget((budget) => {
        const book = budget[account];
        const k = flow === "income" ? "incomes" : "expenses";
        return {
          ...budget,
          [account]: {
            ...book,
            [k]: book[k].filter((e) => e.id !== id),
          },
        };
      });
    },
    [patchMonthBudget],
  );

  const resetAccount = useCallback(
    (account: AccountId) => {
      patchMonthBudget((budget) => ({
        ...budget,
        [account]: emptyBook(),
      }));
    },
    [patchMonthBudget],
  );

  const addTemplate = useCallback((account: AccountId, template: BudgetTemplate) => {
    setTemplates((prev) => ({
      ...prev,
      [account]: [...prev[account], template],
    }));
  }, []);

  const updateTemplate = useCallback(
    (
      account: AccountId,
      id: string,
      patch: Partial<Omit<BudgetTemplate, "id">>,
    ) => {
      setTemplates((prev) => ({
        ...prev,
        [account]: prev[account].map((t) =>
          t.id === id ? { ...t, ...patch } : t,
        ),
      }));
    },
    [],
  );

  const removeTemplate = useCallback((account: AccountId, id: string) => {
    setTemplates((prev) => ({
      ...prev,
      [account]: prev[account].filter((t) => t.id !== id),
    }));
  }, []);

  const addSalaryTransfer = useCallback(
    (amount: number, note: string) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      const noteTrim = note.trim();
      const transferId = newId();
      const businessExpenseId = newId();
      const personalIncomeId = newId();
      const expenseLabel =
        noteTrim.length > 0
          ? `${bg.transfer.entryBusinessExpense} (${noteTrim})`
          : bg.transfer.entryBusinessExpense;
      const incomeLabel =
        noteTrim.length > 0
          ? `${bg.transfer.entryPersonalIncome} (${noteTrim})`
          : bg.transfer.entryPersonalIncome;

      const businessExpense: BudgetEntry = {
        id: businessExpenseId,
        kind: "fixed",
        label: expenseLabel,
        amount,
        frequency: "monthly",
      };
      const personalIncome: BudgetEntry = {
        id: personalIncomeId,
        kind: "fixed",
        label: incomeLabel,
        amount,
        frequency: "monthly",
      };

      const t: SalaryTransfer = {
        id: transferId,
        amount,
        note: noteTrim,
        at: new Date().toISOString(),
        monthKey: selectedMonth,
        businessExpenseId,
        personalIncomeId,
      };

      setMonths((prev) => {
        const p = prev[selectedMonth] ?? emptyMonthPayload();
        return {
          ...prev,
          [selectedMonth]: {
            ...p,
            budget: {
              ...p.budget,
              business: {
                ...p.budget.business,
                expenses: [...p.budget.business.expenses, businessExpense],
              },
              personal: {
                ...p.budget.personal,
                incomes: [...p.budget.personal.incomes, personalIncome],
              },
            },
          },
        };
      });
      setTransfers((prev) => [t, ...prev]);
    },
    [selectedMonth],
  );

  const removeSalaryTransfer = useCallback((id: string) => {
    setTransfers((prev) => {
      const found = prev.find((x) => x.id === id);
      if (!found) return prev;
      const mk = found.monthKey ?? isoToMonthKey(found.at);
      const bid = found.businessExpenseId;
      const pid = found.personalIncomeId;
      if (bid && pid) {
        setMonths((mPrev) => {
          const p = mPrev[mk];
          if (!p) return mPrev;
          return {
            ...mPrev,
            [mk]: {
              ...p,
              budget: {
                ...p.budget,
                business: {
                  ...p.budget.business,
                  expenses: p.budget.business.expenses.filter((e) => e.id !== bid),
                },
                personal: {
                  ...p.budget.personal,
                  incomes: p.budget.personal.incomes.filter((e) => e.id !== pid),
                },
              },
            },
          };
        });
      }
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const applyTemplateRows = useCallback(
    (account: AccountId, rows: ApplyRow[]) => {
      patchMonthBudget((budget) => {
        const book = budget[account];
        const incomes = [...book.incomes];
        const expenses = [...book.expenses];
        for (const r of rows) {
          const entry: BudgetEntry = {
            id: newId(),
            kind: r.kind,
            label: r.label.trim(),
            amount: r.amount,
            ...(r.kind === "fixed"
              ? { frequency: r.frequency ?? "monthly" }
              : {}),
          };
          if (r.flow === "income") incomes.push(entry);
          else expenses.push(entry);
        }
        return {
          ...budget,
          [account]: { incomes, expenses },
        };
      });
    },
    [patchMonthBudget],
  );

  const value = useMemo(
    () => ({
      data,
      taxInsurance,
      businessTaxInsuranceMonthly,
      setTaxInsurance,
      selectedMonth,
      setSelectedMonth,
      sortedMonthKeys,
      addEmptyMonth,
      isCurrentCalendarMonth,
      templates,
      ready,
      addEntry,
      updateEntry,
      removeEntry,
      resetAccount,
      addTemplate,
      updateTemplate,
      removeTemplate,
      applyTemplateRows,
      transfers,
      transfersForSelectedMonth,
      addSalaryTransfer,
      removeSalaryTransfer,
    }),
    [
      data,
      taxInsurance,
      businessTaxInsuranceMonthly,
      setTaxInsurance,
      selectedMonth,
      setSelectedMonth,
      sortedMonthKeys,
      addEmptyMonth,
      isCurrentCalendarMonth,
      templates,
      ready,
      addEntry,
      updateEntry,
      removeEntry,
      resetAccount,
      addTemplate,
      updateTemplate,
      removeTemplate,
      applyTemplateRows,
      transfers,
      transfersForSelectedMonth,
      addSalaryTransfer,
      removeSalaryTransfer,
    ],
  );

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
}
