"use client";

import { motion } from "framer-motion";
import { PeriodReport } from "@/types";
import { formatCurrency } from "@/lib/dateUtils";
import { CATEGORY_META } from "@/features/expenses/components/categoryMeta";
import styles from "./CategoryBreakdown.module.css";

interface CategoryBreakdownProps {
  report: PeriodReport;
}

export function CategoryBreakdown({ report }: CategoryBreakdownProps) {
  if (report.breakdown.length === 0) {
    return null;
  }

  const maxTotal = report.breakdown[0].total;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h3 className={styles.heading}>Category Breakdown</h3>

      {/* Stacked bar */}
      <div className={styles.stackedBar}>
        {report.breakdown.map((item) => {
          const meta = CATEGORY_META[item.category];
          return (
            <div
              key={item.category}
              className={styles.barSegment}
              style={{
                width: `${item.percentage}%`,
                background: meta.color,
              }}
              title={`${item.category}: ${item.percentage.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {/* List */}
      <div className={styles.list}>
        {report.breakdown.map((item, i) => {
          const meta = CATEGORY_META[item.category];
          const barWidth = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;

          return (
            <div key={item.category} className={styles.row}>
              <div className={styles.rowLeft}>
                <span className={styles.rank}>{i + 1}</span>
                <span
                  className={styles.dot}
                  style={{ background: meta.color }}
                />
                <span className={styles.name}>
                  {meta.emoji} {item.category}
                </span>
              </div>
              <div className={styles.rowRight}>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${barWidth}%`, background: meta.color }}
                  />
                </div>
                <span className={styles.pct}>{item.percentage.toFixed(1)}%</span>
                <span className={styles.amount}>
                  {formatCurrency(item.total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
