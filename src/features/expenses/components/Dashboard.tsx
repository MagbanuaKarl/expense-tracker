"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { Expense, ExpenseCategory, ExpenseFilters, ReportPeriod } from "@/types";
import { currentMonth, currentWeek } from "@/lib/dateUtils";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { useReport } from "@/features/reports/hooks/useReport";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { ExpenseList } from "@/features/expenses/components/ExpenseList";
import { SummaryCard } from "@/features/reports/components/SummaryCard";
import { CategoryBreakdown } from "@/features/reports/components/CategoryBreakdown";
import { PeriodNavigator } from "@/features/reports/components/PeriodNavigator";
import { signOut } from "@/features/auth/services/authService";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [period, setPeriod] = useState<ReportPeriod>("monthly");
  const [periodValue, setPeriodValue] = useState(currentMonth());
  const [categoryFilter, setCategoryFilter] = useState<
    ExpenseCategory | undefined
  >(undefined);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const filters: ExpenseFilters = {
    period,
    value: periodValue,
    category: categoryFilter,
  };

  // Fetch all expenses for the period (without category filter) for report
  const allFilters: ExpenseFilters = { period, value: periodValue };
  const {
    expenses: allExpenses,
  } = useExpenses(user.uid, allFilters);

  // Fetch filtered expenses for list
  const { expenses, loading, error, addExpense, editExpense, removeExpense } =
    useExpenses(user.uid, filters);

  const report = useReport(allExpenses, periodValue);

  function handlePeriodChange(newPeriod: ReportPeriod) {
    setPeriod(newPeriod);
    setCategoryFilter(undefined);
    setPeriodValue(
      newPeriod === "monthly" ? currentMonth() : currentWeek()
    );
  }

  function handlePeriodValueChange(value: string) {
    setPeriodValue(value);
    setCategoryFilter(undefined);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingExpense(null);
  }

  async function handleFormSubmit(input: Parameters<typeof addExpense>[0]) {
    if (editingExpense) {
      await editExpense(editingExpense.id, input);
    } else {
      await addExpense(input);
    }
    handleCloseForm();
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className={styles.shell}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.brandSymbol}>◈</span>
          <span className={styles.brandName}>Ledger</span>
        </div>
        <div className={styles.userArea}>
          <img
            className={styles.avatar}
            src={user.photoURL ?? "/default-avatar.png"}
            alt={user.displayName ?? "User"}
            referrerPolicy="no-referrer"
          />
          <span className={styles.userName}>
            {user.displayName?.split(" ")[0]}
          </span>
          <button className={styles.signOutBtn} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Period navigation */}
          <PeriodNavigator
            period={period}
            value={periodValue}
            onPeriodChange={handlePeriodChange}
            onValueChange={handlePeriodValueChange}
          />

          {/* Summary + breakdown */}
          <div className={styles.reportGrid}>
            <SummaryCard report={report} period={period} />
            <CategoryBreakdown report={report} />
          </div>

          {/* Expense list section */}
          <div className={styles.listSection}>
            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>Transactions</h2>
              <button
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
              >
                + Add Expense
              </button>
            </div>

            <ExpenseList
              expenses={expenses}
              loading={loading}
              error={error}
              categoryFilter={categoryFilter}
              onCategoryFilter={setCategoryFilter}
              onEdit={handleEdit}
              onDelete={removeExpense}
            />
          </div>
        </div>
      </main>

      {/* Expense form modal */}
      {showForm && (
        <ExpenseForm
          initialValues={editingExpense ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
