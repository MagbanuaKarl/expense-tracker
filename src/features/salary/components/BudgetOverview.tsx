"use client";

import { useMemo } from "react";
import { BudgetBreakdown, ALLOCATION_CATEGORIES, AllocationType, ExpenseFilters } from "@/types";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { currentMonth } from "@/lib/dateUtils";

interface BudgetOverviewProps {
  breakdown: BudgetBreakdown;
}

export function BudgetOverview({ breakdown }: BudgetOverviewProps) {
  const { user } = useAuth();

  const filters: ExpenseFilters = {
    period: "monthly",
    value: currentMonth(),
  };

  const { expenses, loading } = useExpenses(user?.uid || null, filters);

  const spendingByAllocation = useMemo(() => {
    if (!expenses) return { necessities: 0, savings: 0, discretionary: 0 };

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpenses = expenses.filter((expense) => expense.month === currentMonth);

    const spending: Record<AllocationType, number> = {
      necessities: 0,
      savings: 0,
      discretionary: 0,
    };

    monthlyExpenses.forEach((expense) => {
      for (const [allocationType, categories] of Object.entries(ALLOCATION_CATEGORIES)) {
        if (categories.includes(expense.category)) {
          spending[allocationType as AllocationType] += expense.amount;
          break;
        }
      }
    });

    return spending;
  }, [expenses]);

  const formatCurrency = (amount: number) => `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  if (loading) {
    return <div className="text-center py-8">Loading expense data...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Budget Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Net Monthly Income</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(breakdown.netMonthly)}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Total Allocated</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(breakdown.netMonthly)}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-900 mb-2">Total Spent This Month</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(
              (spendingByAllocation.necessities || 0) +
                (spendingByAllocation.savings || 0) +
                (spendingByAllocation.discretionary || 0)
            )}
          </p>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Monthly Budget Breakdown</h3>

        {Object.entries(ALLOCATION_CATEGORIES).map(([allocationType, categories]) => {
          const allocated = breakdown.allocations[allocationType as AllocationType];
          const spent = spendingByAllocation[allocationType as AllocationType] || 0;
          const remaining = allocated - spent;
          const percentage = (spent / allocated) * 100;

          return (
            <div key={allocationType} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium capitalize">{allocationType}</h4>
                  <p className="text-sm text-gray-600">
                    {categories.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(allocated)}</p>
                  <p className="text-sm text-gray-600">allocated</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Spent: {formatCurrency(spent)}</span>
                  <span>Remaining: {formatCurrency(remaining)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage > 100 ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {percentage.toFixed(1)}% of allocated budget used
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">💡 Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Track your expenses regularly to stay within your allocations</li>
          <li>• Adjust your allocations if your spending patterns change</li>
          <li>• Consider increasing savings if you're consistently under budget</li>
          <li>• Review your budget monthly and make adjustments as needed</li>
        </ul>
      </div>
    </div>
  );
}