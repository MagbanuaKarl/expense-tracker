"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "firebase/auth";
import { Expense, ExpenseCategory, ExpenseFilters, ReportPeriod } from "@/types";
import { currentMonth, currentWeek } from "@/lib/dateUtils";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { useReport } from "@/features/reports/hooks/useReport";
import { useSalary } from "@/features/salary";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { ExpenseList } from "@/features/expenses/components/ExpenseList";
import { SummaryCard } from "@/features/reports/components/SummaryCard";
import { CategoryBreakdown } from "@/features/reports/components/CategoryBreakdown";
import { PeriodNavigator } from "@/features/reports/components/PeriodNavigator";
import { signOut } from "@/features/auth/services/authService";
import { TopBar } from "@/components/TopBar";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  user: User;
  isDemo?: boolean;
  onExitDemo?: () => void;
}

export function Dashboard({ user, isDemo, onExitDemo }: DashboardProps) {
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
    refresh: refreshAll,
  } = useExpenses(user.uid, allFilters);

  // Fetch filtered expenses for list
  const {
    expenses,
    loading,
    error,
    addExpense,
    editExpense,
    removeExpense,
    refresh: refreshFiltered,
  } = useExpenses(user.uid, filters);

  const [notification, setNotification] = useState<string | null>(null);

  const report = useReport(allExpenses, periodValue);
  const { hasSalaryData } = useSalary();

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

  function showNotification(message: string) {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }

  async function handleFormSubmit(input: Parameters<typeof addExpense>[0]) {
    try {
      if (editingExpense) {
        await editExpense(editingExpense.id, input);
        showNotification("Expense updated successfully");
      } else {
        await addExpense(input);
        showNotification("Expense added successfully");
      }
      refreshAll();
      refreshFiltered();
    } catch (err) {
      console.error(err);
      showNotification("Something went wrong. Please try again.");
    } finally {
      handleCloseForm();
    }
  }

  async function handleDeleteExpense(id: string) {
    await removeExpense(id);
    refreshAll();
    refreshFiltered();
    showNotification("Expense deleted successfully");
  }

  async function handleSignOut() {
    if (isDemo && onExitDemo) {
      onExitDemo();
      return;
    }

    await signOut();
  }

  return (
    <div className={styles.shell}>
      <TopBar isDemo={isDemo} onExitDemo={onExitDemo} currentPage="expenses" />

      {/* Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          <AnimatePresence>
            {notification && (
              <motion.div
                className={styles.toast}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {notification}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Period navigation */}
          <PeriodNavigator
            period={period}
            value={periodValue}
            onPeriodChange={handlePeriodChange}
            onValueChange={handlePeriodValueChange}
          />

          {/* Salary Setup Notification */}
          {!hasSalaryData && (
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎯</span>
                    <h3 className="text-lg font-bold">Set up your salary and budget</h3>
                  </div>
                  <p className="text-blue-100 mb-4 leading-relaxed">
                    Create a personalized budget based on your after-tax income and track your spending against your financial goals.
                  </p>
                  <a
                    href="/salary"
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm"
                  >
                    <span className="mr-2">🚀</span>
                    Set up salary & budget
                  </a>
                </div>
                <div className="ml-6 flex-shrink-0 hidden sm:block">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              onDelete={handleDeleteExpense}
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
