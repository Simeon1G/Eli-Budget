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
  SalaryTransfer,
} from "@/lib/budget-types";
import { loadBudget, saveBudget, type PersistedBudget } from "@/lib/budget-storage";
import { loadTemplates, saveTemplates, type PersistedTemplates } from "@/lib/template-storage";
import { loadTransfers, saveTransfers } from "@/lib/transfer-storage";
import { emptyBook } from "@/lib/budget-types";
import { bg } from "@/lib/bg";
import { newId } from "@/lib/id";

export type ApplyRow = {
  flow: Flow;
  label: string;
  amount: number;
  kind: EntryKind;
  frequency?: Frequency;
};

type BudgetContextValue = {
  data: PersistedBudget;
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
  addSalaryTransfer: (amount: number, note: string) => void;
  removeSalaryTransfer: (id: string) => void;
};

const BudgetContext = createContext<BudgetContextValue | null>(null);

const emptyTemplates: PersistedTemplates = {
  business: [],
  personal: [],
};

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PersistedBudget>(() => ({
    business: emptyBook(),
    personal: emptyBook(),
  }));
  const [templates, setTemplates] =
    useState<PersistedTemplates>(emptyTemplates);
  const [transfers, setTransfers] = useState<SalaryTransfer[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(loadBudget());
    setTemplates(loadTemplates());
    setTransfers(loadTransfers());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveBudget(data);
  }, [data, ready]);

  useEffect(() => {
    if (!ready) return;
    saveTemplates(templates);
  }, [templates, ready]);

  useEffect(() => {
    if (!ready) return;
    saveTransfers(transfers);
  }, [transfers, ready]);

  const addEntry = useCallback(
    (account: AccountId, flow: Flow, entry: BudgetEntry) => {
      setData((prev) => {
        const book = prev[account];
        const key = flow === "income" ? "incomes" : "expenses";
        return {
          ...prev,
          [account]: {
            ...book,
            [key]: [...book[key], entry],
          },
        };
      });
    },
    [],
  );

  const updateEntry = useCallback(
    (account: AccountId, flow: Flow, id: string, patch: Partial<BudgetEntry>) => {
      setData((prev) => {
        const book = prev[account];
        const key = flow === "income" ? "incomes" : "expenses";
        return {
          ...prev,
          [account]: {
            ...book,
            [key]: book[key].map((e) =>
              e.id === id ? { ...e, ...patch } : e,
            ),
          },
        };
      });
    },
    [],
  );

  const removeEntry = useCallback(
    (account: AccountId, flow: Flow, id: string) => {
      setData((prev) => {
        const book = prev[account];
        const k = flow === "income" ? "incomes" : "expenses";
        return {
          ...prev,
          [account]: {
            ...book,
            [k]: book[k].filter((e) => e.id !== id),
          },
        };
      });
    },
    [],
  );

  const resetAccount = useCallback((account: AccountId) => {
    setData((prev) => ({
      ...prev,
      [account]: emptyBook(),
    }));
  }, []);

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

  const addSalaryTransfer = useCallback((amount: number, note: string) => {
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
      businessExpenseId,
      personalIncomeId,
    };

    setData((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        expenses: [...prev.business.expenses, businessExpense],
      },
      personal: {
        ...prev.personal,
        incomes: [...prev.personal.incomes, personalIncome],
      },
    }));
    setTransfers((prev) => [t, ...prev]);
  }, []);

  const removeSalaryTransfer = useCallback((id: string) => {
    let businessExpenseId: string | undefined;
    let personalIncomeId: string | undefined;
    setTransfers((prev) => {
      const found = prev.find((x) => x.id === id);
      businessExpenseId = found?.businessExpenseId;
      personalIncomeId = found?.personalIncomeId;
      return prev.filter((x) => x.id !== id);
    });
    if (businessExpenseId && personalIncomeId) {
      setData((prev) => ({
        ...prev,
        business: {
          ...prev.business,
          expenses: prev.business.expenses.filter((e) => e.id !== businessExpenseId),
        },
        personal: {
          ...prev.personal,
          incomes: prev.personal.incomes.filter((e) => e.id !== personalIncomeId),
        },
      }));
    }
  }, []);

  const applyTemplateRows = useCallback(
    (account: AccountId, rows: ApplyRow[]) => {
      setData((prev) => {
        const book = prev[account];
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
          ...prev,
          [account]: { incomes, expenses },
        };
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      data,
      templates,
      transfers,
      ready,
      addEntry,
      updateEntry,
      removeEntry,
      resetAccount,
      addTemplate,
      updateTemplate,
      removeTemplate,
      applyTemplateRows,
      addSalaryTransfer,
      removeSalaryTransfer,
    }),
    [
      data,
      templates,
      transfers,
      ready,
      addEntry,
      updateEntry,
      removeEntry,
      resetAccount,
      addTemplate,
      updateTemplate,
      removeTemplate,
      applyTemplateRows,
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
