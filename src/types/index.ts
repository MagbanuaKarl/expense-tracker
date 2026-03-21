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

// ─── Salary and Budget Types ─────────────────────────────────────────────────

export interface SalaryDeductions {
  sss: number; // Social Security System
  philHealth: number; // PhilHealth
  pagIbig: number; // Pag-IBIG
}

export interface SalaryData {
  monthlySalary: number;
  customDeductions?: Partial<SalaryDeductions>; // Override standard deductions
  allocations: {
    necessities: number; // percentage
    savings: number; // percentage
    discretionary: number; // percentage
  };
  createdAt: Date;
  updatedAt: Date;
}

export type AllocationType = "necessities" | "savings" | "discretionary";

export const ALLOCATION_CATEGORIES: Record<AllocationType, ExpenseCategory[]> = {
  necessities: [
    "Food",
    "Transportation",
    "Bills",
    "Housing",
    "Utilities",
    "Healthcare",
    "Insurance",
    "Education",
    "Debt",
    "Subscriptions",
    "Personal Care",
  ],
  savings: ["Savings", "Investments"],
  discretionary: [
    "Shopping",
    "Entertainment",
    "Travel",
    "Gifts & Donations",
    "Miscellaneous",
    "Luxury",
  ],
};

export interface BudgetBreakdown {
  grossMonthly: number;
  standardDeductions: SalaryDeductions;
  actualDeductions: SalaryDeductions;
  annualTaxable: number;
  annualTax: number;
  monthlyTax: number;
  netMonthly: number;
  allocations: {
    necessities: number;
    savings: number;
    discretionary: number;
  };
}
