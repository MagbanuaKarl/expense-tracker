"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseInput, ExpenseFilters } from "@/types";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByMonth,
  getExpensesByWeek,
} from "../services/expenseService";
import { dateToMonth, dateToWeek } from "@/lib/dateUtils";

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (input: ExpenseInput) => Promise<void>;
  editExpense: (id: string, input: Partial<ExpenseInput>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  refresh: () => void;
}

const demoExpenseStore: Expense[] = [];

function filterDemoExpenses(
  data: Expense[],
  filters: ExpenseFilters
): Expense[] {
  const inPeriod = data.filter((e) =>
    filters.period === "monthly" ? e.month === filters.value : e.week === filters.value
  );

  return filters.category
    ? inPeriod.filter((e) => e.category === filters.category)
    : inPeriod;
}

function makeDemoExpense(input: ExpenseInput): Expense {
  const now = new Date();
  return {
    id: `demo-${Math.random().toString(36).slice(2)}-${Date.now()}`,
    userId: "demo",
    amount: input.amount,
    category: input.category,
    note: input.note,
    date: input.date,
    createdAt: now,
    month: dateToMonth(input.date),
    week: dateToWeek(input.date),
  };
}

export function useExpenses(
  userId: string | null,
  filters: ExpenseFilters
): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!userId) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const activeUserId = userId;

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchExpenses() {
      try {
        let data: Expense[] = [];

        if (activeUserId === "demo") {
          data = filterDemoExpenses(demoExpenseStore, filters);
        } else {
          const source =
            filters.period === "monthly"
              ? await getExpensesByMonth(activeUserId, filters.value)
              : await getExpensesByWeek(activeUserId, filters.value);

          data = filters.category
            ? source.filter((e) => e.category === filters.category)
            : source;
        }

        if (!cancelled) {
          setExpenses(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load expenses.");
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchExpenses();
    return () => {
      cancelled = true;
    };
  }, [userId, filters.period, filters.value, filters.category, tick]);

  const addExpense = useCallback(
    async (input: ExpenseInput) => {
      if (!userId) return;

      if (userId === "demo") {
        const newExpense = makeDemoExpense(input);
        demoExpenseStore.unshift(newExpense);
        setExpenses((prev) => [newExpense, ...prev]);
        refresh();
        return;
      }

      await createExpense(userId, input);
      refresh();
    },
    [userId, refresh]
  );

  const editExpense = useCallback(
    async (id: string, input: Partial<ExpenseInput>) => {
      if (!userId) return;

      if (userId === "demo") {
        const idx = demoExpenseStore.findIndex((e) => e.id === id);
        if (idx < 0) return;

        const item = demoExpenseStore[idx];
        const updated: Expense = {
          ...item,
          amount: input.amount ?? item.amount,
          category: input.category ?? item.category,
          note: input.note === undefined ? item.note : input.note,
          date: input.date ?? item.date,
          month: input.date ? dateToMonth(input.date) : item.month,
          week: input.date ? dateToWeek(input.date) : item.week,
        };

        demoExpenseStore[idx] = updated;
        setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
        refresh();
        return;
      }

      await updateExpense(id, input);
      refresh();
    },
    [userId, refresh]
  );

  const removeExpense = useCallback(
    async (id: string) => {
      if (userId === "demo") {
        const idx = demoExpenseStore.findIndex((e) => e.id === id);
        if (idx >= 0) {
          demoExpenseStore.splice(idx, 1);
          setExpenses((prev) => prev.filter((e) => e.id !== id));
        }
        return;
      }

      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [userId]
  );

  return { expenses, loading, error, addExpense, editExpense, removeExpense, refresh };
}
