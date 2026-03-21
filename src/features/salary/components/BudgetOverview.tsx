"use client";

import { useMemo } from "react";
import { BudgetBreakdown, ALLOCATION_CATEGORIES, AllocationType, ExpenseFilters } from "@/types";
import styles from "./Salary.module.css";
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
    return <div className={styles.textCenter} style={{ padding: '2rem 0' }}>Loading expense data...</div>;
  }

  return (
    <div>
      <h2 className={styles.title}>Budget Overview</h2>

      <div className={styles.gridTwo} style={{ marginBottom: '1.5rem' }}>
        <div className={styles.allocationCard}>
          <h3 className={styles.allocationCardHeader}>Net Monthly Income</h3>
          <p className={styles.valueBlue}>{formatCurrency(breakdown.netMonthly)}</p>
        </div>

        <div className={styles.allocationCard}>
          <h3 className={styles.allocationCardHeader}>Total Allocated</h3>
          <p className={styles.valueGreen}>{formatCurrency(breakdown.netMonthly)}</p>
        </div>

        <div className={styles.allocationCard}>
          <h3 className={styles.allocationCardHeader}>Total Spent This Month</h3>
          <p className={styles.valuePurple}>
            {formatCurrency((spendingByAllocation.necessities || 0) + (spendingByAllocation.savings || 0) + (spendingByAllocation.discretionary || 0))}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        <h3 className={styles.allocationCardHeader}>Monthly Budget Breakdown</h3>

        {Object.entries(ALLOCATION_CATEGORIES).map(([allocationType, categories]) => {
          const allocated = breakdown.allocations[allocationType as AllocationType];
          const spent = spendingByAllocation[allocationType as AllocationType] || 0;
          const remaining = allocated - spent;
          const percentage = (spent / allocated) * 100;

          const barClass = percentage > 100 ? styles.progressFillRed : percentage > 80 ? styles.progressFillYellow : styles.progressFillGreen;

          return (
            <div key={allocationType} className={styles.allocationCard}>
              <div className={styles.flexBetween} style={{ marginBottom: '0.6rem' }}>
                <div>
                  <h4 className={styles.allocationCardHeader} style={{ textTransform: 'capitalize', margin: 0 }}>{allocationType}</h4>
                  <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>{categories.join(', ')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>{formatCurrency(allocated)}</p>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>allocated</p>
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <div className={styles.flexBetween} style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  <span>Spent: {formatCurrency(spent)}</span>
                  <span>Remaining: {formatCurrency(remaining)}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={barClass} style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  {percentage.toFixed(1)}% of allocated budget used
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.allocationCard} style={{ marginTop: '1rem' }}>
        <h4 className={styles.allocationCardHeader} style={{ marginBottom: '0.5rem' }}>💡 Tips</h4>
        <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <li>• Track your expenses regularly to stay within your allocations</li>
          <li>• Adjust your allocations if your spending patterns change</li>
          <li>• Consider increasing savings if you're consistently under budget</li>
          <li>• Review your budget monthly and make adjustments as needed</li>
        </ul>
      </div>
    </div>
  );
}