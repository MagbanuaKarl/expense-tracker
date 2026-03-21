"use client";

import { useState } from "react";
import { useSalary } from "../hooks/useSalary";
import { SalaryInputForm } from "./SalaryInputForm";
import { SalaryBreakdown } from "./SalaryBreakdown";
import { AllocationForm } from "./AllocationForm";
import { BudgetOverview } from "./BudgetOverview";
import { TopBar } from "@/components/TopBar";
import styles from "./Salary.module.css";

export function SalaryPage() {
  const { salaryData, budgetBreakdown, loading, saving, saveSalaryData, updateSalaryData, hasSalaryData } = useSalary();
  const [currentStep, setCurrentStep] = useState<"input" | "breakdown" | "allocation" | "overview">(
    hasSalaryData ? "overview" : "input"
  );

  if (loading) {
    return (
      <div className={styles.page}>
        <TopBar currentPage="salary" />
        <div className={styles.container}>
          <div className={styles.textCenter}>
            <div className={styles.spinner} />
            <p className={styles.subtitle}>Loading salary data...</p>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { key: "input", label: "Salary Input", icon: "1", description: "Enter your monthly salary" },
    { key: "breakdown", label: "Salary Breakdown", icon: "2", description: "Review deductions & tax" },
    { key: "allocation", label: "Budget Allocation", icon: "3", description: "Set spending percentages" },
    { key: "overview", label: "Budget Overview", icon: "4", description: "Track your progress" },
  ];

  return (
    <div className={styles.page}>
      <TopBar currentPage="salary" />
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.iconCircle}>
            <span>S</span>
          </div>
          <h1 className={styles.title}>Salary & Budget Planner</h1>
          <p className={styles.subtitle}>Take control of your finances with intelligent budget planning based on your after-tax income</p>
        </div>

        <div className={styles.stepper}>
          <div className={styles.stepperInner}>
            {steps.map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = hasSalaryData && (
                step.key === "input" ||
                (step.key === "breakdown" && currentStep !== "input") ||
                (step.key === "allocation" && ["allocation", "overview"].includes(currentStep)) ||
                (step.key === "overview" && currentStep === "overview")
              );
              const isAccessible = hasSalaryData || step.key === "input";

              return (
                <div key={step.key} className={styles.flexRow}>
                  <button
                    onClick={() => isAccessible && setCurrentStep(step.key as any)}
                    disabled={!isAccessible}
                    className={`${styles.stepBtn} ${isActive ? styles.stepBtnActive : ""} ${isCompleted ? styles.stepBtnCompleted : ""}`}
                  >
                    <span>{step.icon}</span>
                    <span>{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`${styles.stepConnector} ${isCompleted ? styles.stepConnectorComplete : ""}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.card}>
          {currentStep === "input" && (
            <SalaryInputForm
              initialData={salaryData}
              onSave={async (data) => {
                await saveSalaryData(data);
                setCurrentStep("breakdown");
              }}
              saving={saving}
            />
          )}

            {currentStep === "breakdown" && budgetBreakdown && (
              <SalaryBreakdown
                breakdown={budgetBreakdown}
                onUpdateDeductions={async (deductions) => {
                  if (salaryData) {
                    await updateSalaryData({ customDeductions: deductions });
                  }
                }}
                onNext={() => setCurrentStep("allocation")}
                saving={saving}
              />
            )}

            {currentStep === "allocation" && salaryData && (
              <AllocationForm
                allocations={salaryData.allocations}
                onSave={async (allocations) => {
                  await updateSalaryData({ allocations });
                  setCurrentStep("overview");
                }}
                saving={saving}
              />
            )}

            {currentStep === "overview" && budgetBreakdown && salaryData && (
              <BudgetOverview breakdown={budgetBreakdown} />
            )}
          </div>
        </div>

        <div className={styles.footerText}>
          <p>Securely stored and processed with your privacy in mind</p>
        </div>
      </div>
  );
}