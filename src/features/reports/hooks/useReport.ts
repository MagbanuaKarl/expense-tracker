"use client";

import { useMemo } from "react";
import { Expense, PeriodReport } from "@/types";
import { computeReport } from "../services/reportService";

export function useReport(expenses: Expense[], period: string): PeriodReport {
  return useMemo(
    () => computeReport(expenses, period),
    [expenses, period]
  );
}
