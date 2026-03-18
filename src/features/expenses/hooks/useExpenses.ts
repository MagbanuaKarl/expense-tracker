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

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (input: ExpenseInput) => Promise<void>;
  editExpense: (id: string, input: Partial<ExpenseInput>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  refresh: () => void;
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

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchExpenses() {
      try {
        const data =
          filters.period === "monthly"
            ? await getExpensesByMonth(userId!, filters.value)
            : await getExpensesByWeek(userId!, filters.value);

        if (!cancelled) {
          const filtered = filters.category
            ? data.filter((e) => e.category === filters.category)
            : data;
          setExpenses(filtered);
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
    return () => { cancelled = true; };
  }, [userId, filters.period, filters.value, filters.category, tick]);

  const addExpense = useCallback(
    async (input: ExpenseInput) => {
      if (!userId) return;
      await createExpense(userId, input);
      refresh();
    },
    [userId, refresh]
  );

  const editExpense = useCallback(
    async (id: string, input: Partial<ExpenseInput>) => {
      await updateExpense(id, input);
      refresh();
    },
    [refresh]
  );

  const removeExpense = useCallback(
    async (id: string) => {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    []
  );

  return { expenses, loading, error, addExpense, editExpense, removeExpense, refresh };
}
