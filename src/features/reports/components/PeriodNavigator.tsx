"use client";

import { ReportPeriod } from "@/types";
import {
  formatMonth,
  formatWeek,
  prevMonth,
  nextMonth,
  prevWeek,
  nextWeek,
  currentMonth,
  currentWeek,
} from "@/lib/dateUtils";
import styles from "./PeriodNavigator.module.css";

interface PeriodNavigatorProps {
  period: ReportPeriod;
  value: string;
  onPeriodChange: (period: ReportPeriod) => void;
  onValueChange: (value: string) => void;
}

export function PeriodNavigator({
  period,
  value,
  onPeriodChange,
  onValueChange,
}: PeriodNavigatorProps) {
  const label =
    period === "monthly" ? formatMonth(value) : formatWeek(value);

  const isCurrentPeriod =
    period === "monthly"
      ? value === currentMonth()
      : value === currentWeek();

  function handlePrev() {
    onValueChange(
      period === "monthly" ? prevMonth(value) : prevWeek(value)
    );
  }

  function handleNext() {
    onValueChange(
      period === "monthly" ? nextMonth(value) : nextWeek(value)
    );
  }

  function handleToday() {
    onValueChange(
      period === "monthly" ? currentMonth() : currentWeek()
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${period === "monthly" ? styles.active : ""}`}
          onClick={() => {
            onPeriodChange("monthly");
            onValueChange(currentMonth());
          }}
        >
          Monthly
        </button>
        <button
          className={`${styles.tab} ${period === "weekly" ? styles.active : ""}`}
          onClick={() => {
            onPeriodChange("weekly");
            onValueChange(currentWeek());
          }}
        >
          Weekly
        </button>
      </div>

      <div className={styles.nav}>
        <button className={styles.arrowBtn} onClick={handlePrev} aria-label="Previous">
          ←
        </button>
        <span className={styles.periodLabel}>{label}</span>
        <button
          className={styles.arrowBtn}
          onClick={handleNext}
          disabled={isCurrentPeriod}
          aria-label="Next"
        >
          →
        </button>
        {!isCurrentPeriod && (
          <button className={styles.todayBtn} onClick={handleToday}>
            Today
          </button>
        )}
      </div>
    </div>
  );
}
