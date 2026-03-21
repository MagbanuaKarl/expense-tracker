"use client";

import { useState } from "react";
import { useSalary } from "../hooks/useSalary";
import { SalaryInputForm } from "./SalaryInputForm";
import { SalaryBreakdown } from "./SalaryBreakdown";
import { AllocationForm } from "./AllocationForm";
import { BudgetOverview } from "./BudgetOverview";

export function SalaryPage() {
  const { salaryData, budgetBreakdown, loading, saving, saveSalaryData, updateSalaryData, hasSalaryData } = useSalary();
  const [currentStep, setCurrentStep] = useState<"input" | "breakdown" | "allocation" | "overview">(
    hasSalaryData ? "overview" : "input"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading salary data...</div>
        </div>
      </div>
    );
  }

  const steps = [
    { key: "input", label: "Salary Input", icon: "💰", description: "Enter your monthly salary" },
    { key: "breakdown", label: "Salary Breakdown", icon: "📊", description: "Review deductions & tax" },
    { key: "allocation", label: "Budget Allocation", icon: "🎯", description: "Set spending percentages" },
    { key: "overview", label: "Budget Overview", icon: "📈", description: "Track your progress" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Salary & Budget Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take control of your finances with intelligent budget planning based on your after-tax income
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 bg-white rounded-full p-2 shadow-lg">
              {steps.map((step, index) => {
                const isActive = currentStep === step.key;
                const isCompleted = hasSalaryData && (
                  (step.key === "input") ||
                  (step.key === "breakdown" && currentStep !== "input") ||
                  (step.key === "allocation" && ["allocation", "overview"].includes(currentStep)) ||
                  (step.key === "overview" && currentStep === "overview")
                );
                const isAccessible = hasSalaryData || step.key === "input";

                return (
                  <div key={step.key} className="flex items-center">
                    <button
                      onClick={() => isAccessible && setCurrentStep(step.key as any)}
                      disabled={!isAccessible}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : isAccessible
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-sm">{step.icon}</span>
                      <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
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

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Securely stored and processed with your privacy in mind</p>
        </div>
      </div>
    </div>
  );
}