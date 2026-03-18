"use client";

import { PeriodReport, ReportPeriod } from "@/types";
import { formatCurrency, formatMonth, formatWeek } from "@/lib/dateUtils";
import { CATEGORY_META } from "@/features/expenses/components/categoryMeta";
import styles from "./SummaryCard.module.css";

interface SummaryCardProps {
  report: PeriodReport;
  period: ReportPeriod;
}

export function SummaryCard({ report, period }: SummaryCardProps) {
  const label =
    period === "monthly"
      ? formatMonth(report.period)
      : formatWeek(report.period);

  const topMeta = report.topCategory
    ? CATEGORY_META[report.topCategory.category]
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>{report.expenseCount} expenses</span>
      </div>

      <div className={styles.total}>
        <span className={styles.totalAmount}>
          {formatCurrency(report.totalSpending)}
        </span>
        <span className={styles.totalLabel}>total spent</span>
      </div>

      {report.topCategory && topMeta && (
        <div className={styles.topCategory}>
          <span className={styles.topLabel}>Most spent on</span>
          <div className={styles.topPill} style={{ borderColor: topMeta.color }}>
            <span
              className={styles.topDot}
              style={{ background: topMeta.color }}
            />
            <span className={styles.topName}>
              {topMeta.emoji} {report.topCategory.category}
            </span>
            <span className={styles.topAmount}>
              {formatCurrency(report.topCategory.total)}
            </span>
            <span className={styles.topPct}>
              {report.topCategory.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
