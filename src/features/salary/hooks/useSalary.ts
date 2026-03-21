import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SalaryData, BudgetBreakdown } from "@/types";
import { SalaryService } from "../services/salaryFirebaseService";
import { SalaryCalculator } from "../services/salaryService";

export function useSalary() {
  const { user } = useAuth();
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSalaryData();
    } else {
      setSalaryData(null);
      setBudgetBreakdown(null);
      setLoading(false);
    }
  }, [user]);

  const loadSalaryData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await SalaryService.getSalaryData(user.uid);
      setSalaryData(data);

      if (data) {
        const breakdown = SalaryCalculator.calculateBudgetBreakdown(data);
        setBudgetBreakdown(breakdown);
      }
    } catch (error) {
      console.error("Error loading salary data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSalaryData = async (data: Omit<SalaryData, "createdAt" | "updatedAt">) => {
    if (!user) return;

    try {
      setSaving(true);
      await SalaryService.saveSalaryData(user.uid, data);
      await loadSalaryData(); // Reload to get updated data
    } catch (error) {
      console.error("Error saving salary data:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateSalaryData = async (updates: Partial<Omit<SalaryData, "createdAt" | "updatedAt">>) => {
    if (!user) return;

    try {
      setSaving(true);
      await SalaryService.updateSalaryData(user.uid, updates);
      await loadSalaryData(); // Reload to get updated data
    } catch (error) {
      console.error("Error updating salary data:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    salaryData,
    budgetBreakdown,
    loading,
    saving,
    saveSalaryData,
    updateSalaryData,
    hasSalaryData: !!salaryData,
  };
}