"use client";

import { useState } from "react";
import { SalaryData } from "@/types";

interface SalaryInputFormProps {
  initialData: SalaryData | null;
  onSave: (data: Omit<SalaryData, "createdAt" | "updatedAt">) => Promise<void>;
  saving: boolean;
}

export function SalaryInputForm({ initialData, onSave, saving }: SalaryInputFormProps) {
  const [monthlySalary, setMonthlySalary] = useState(initialData?.monthlySalary?.toString() || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const salary = parseFloat(monthlySalary);
    if (!salary || salary <= 0) {
      alert("Please enter a valid monthly salary.");
      return;
    }

    await onSave({
      monthlySalary: salary,
      allocations: initialData?.allocations || {
        necessities: 50,
        savings: 20,
        discretionary: 30,
      },
    });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
          <span className="text-xl">💰</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Monthly Salary</h2>
        <p className="text-gray-600">
          Let's start by understanding your income. We'll calculate your take-home pay and help you allocate it wisely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="monthlySalary" className="block text-sm font-semibold text-gray-700 mb-3">
            Monthly Salary (₱)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg">₱</span>
            </div>
            <input
              type="number"
              id="monthlySalary"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-4 text-xl border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min="0"
              step="0.01"
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This is your gross monthly salary before deductions and taxes.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  We'll calculate your after-tax income using Philippine tax rates
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  You'll see a breakdown of mandatory deductions (SSS, PhilHealth, Pag-IBIG)
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  You can customize these deductions if they differ from standard rates
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  You'll allocate percentages for necessities, savings, and discretionary spending
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            "Continue to Salary Breakdown →"
          )}
        </button>
      </form>
    </div>
  );
}