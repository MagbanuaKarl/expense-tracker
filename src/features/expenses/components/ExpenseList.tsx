"use client";

import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from "@/types";
import { ExpenseItem } from "./ExpenseItem";
import styles from "./ExpenseList.module.css";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  categoryFilter: ExpenseCategory | undefined;
  onCategoryFilter: (cat: ExpenseCategory | undefined) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({
  expenses,
  loading,
  error,
  categoryFilter,
  onCategoryFilter,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (loading) {
    return (
      <div className={styles.state}>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} style={{ opacity: 0.6 }} />
        <div className={styles.skeleton} style={{ opacity: 0.3 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.state}>
        <p className={styles.errorMsg}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button
          className={`${styles.filterChip} ${!categoryFilter ? styles.active : ""}`}
          onClick={() => onCategoryFilter(undefined)}
        >
          All
        </button>
        {EXPENSE_CATEGORIES.filter((c) =>
          expenses.some((e) => e.category === c)
        ).map((cat) => (
          <button
            key={cat}
            className={`${styles.filterChip} ${categoryFilter === cat ? styles.active : ""}`}
            onClick={() =>
              onCategoryFilter(categoryFilter === cat ? undefined : cat)
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {expenses.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No expenses yet</p>
          <p className={styles.emptySubtitle}>
            {categoryFilter
              ? `No ${categoryFilter} expenses for this period.`
              : "Add your first expense to get started."}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
