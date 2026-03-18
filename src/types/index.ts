// ─── Expense Categories ───────────────────────────────────────────────────────

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Bills",
  "Housing",
  "Utilities",
  "Healthcare",
  "Insurance",
  "Education",
  "Shopping",
  "Entertainment",
  "Travel",
  "Savings",
  "Investments",
  "Debt",
  "Subscriptions",
  "Personal Care",
  "Gifts & Donations",
  "Miscellaneous",
  "Luxury",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export function isValidCategory(value: string): value is ExpenseCategory {
  return EXPENSE_CATEGORIES.includes(value as ExpenseCategory);
}

// ─── Expense Model ────────────────────────────────────────────────────────────

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string; // ISO date string: YYYY-MM-DD
  createdAt: Date;
  month: string; // YYYY-MM
  week: string;  // YYYY-W##
}

export type ExpenseInput = {
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string; // YYYY-MM-DD
};

// ─── Report Types ─────────────────────────────────────────────────────────────

export type ReportPeriod = "monthly" | "weekly";

export interface CategoryBreakdown {
  category: ExpenseCategory;
  total: number;
  percentage: number;
  count: number;
}

export interface PeriodReport {
  period: string;
  totalSpending: number;
  breakdown: CategoryBreakdown[];
  topCategory: CategoryBreakdown | null;
  expenseCount: number;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ExpenseFilters {
  period: ReportPeriod;
  value: string; // e.g. "2024-03" for monthly, "2024-W12" for weekly
  category?: ExpenseCategory;
}
