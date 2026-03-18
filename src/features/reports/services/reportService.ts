import { Expense, CategoryBreakdown, PeriodReport, ExpenseCategory } from "@/types";

/**
 * Group expenses by category and compute totals, percentages.
 */
export function computeReport(
  expenses: Expense[],
  period: string
): PeriodReport {
  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = new Map<ExpenseCategory, { total: number; count: number }>();

  for (const expense of expenses) {
    const existing = categoryMap.get(expense.category);
    if (existing) {
      existing.total += expense.amount;
      existing.count += 1;
    } else {
      categoryMap.set(expense.category, { total: expense.amount, count: 1 });
    }
  }

  const breakdown: CategoryBreakdown[] = Array.from(categoryMap.entries())
    .map(([category, { total, count }]) => ({
      category,
      total,
      count,
      percentage: totalSpending > 0 ? (total / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const topCategory = breakdown.length > 0 ? breakdown[0] : null;

  return {
    period,
    totalSpending,
    breakdown,
    topCategory,
    expenseCount: expenses.length,
  };
}
