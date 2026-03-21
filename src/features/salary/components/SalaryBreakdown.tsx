"use client";

import { useState } from "react";
import { BudgetBreakdown, SalaryDeductions } from "@/types";

interface SalaryBreakdownProps {
  breakdown: BudgetBreakdown;
  onUpdateDeductions: (deductions: Partial<SalaryDeductions>) => Promise<void>;
  onNext: () => void;
  saving: boolean;
}

export function SalaryBreakdown({ breakdown, onUpdateDeductions, onNext, saving }: SalaryBreakdownProps) {
  const [customDeductions, setCustomDeductions] = useState<Partial<SalaryDeductions>>({});

  const handleDeductionChange = (key: keyof SalaryDeductions, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomDeductions((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const handleSaveDeductions = async () => {
    if (Object.keys(customDeductions).length > 0) {
      await onUpdateDeductions(customDeductions);
    }
    onNext();
  };

  const formatCurrency = (amount: number) => `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <span className="text-xl">📊</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Salary Breakdown</h2>
        <p className="text-gray-600">
          Review your deductions and tax calculations. Customize if your actual contributions differ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Salary Breakdown Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Income & Deductions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-green-200">
              <span className="text-gray-700">Gross Monthly Salary:</span>
              <span className="font-bold text-lg text-green-800">{formatCurrency(breakdown.grossMonthly)}</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Mandatory Deductions:</div>
              <div className="flex justify-between items-center text-sm">
                <span>SSS:</span>
                <span className="font-medium">{formatCurrency(breakdown.actualDeductions.sss)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>PhilHealth:</span>
                <span className="font-medium">{formatCurrency(breakdown.actualDeductions.philHealth)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Pag-IBIG:</span>
                <span className="font-medium">{formatCurrency(breakdown.actualDeductions.pagIbig)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-green-300 font-medium">
                <span>Total Deductions:</span>
                <span className="text-red-600">
                  -{formatCurrency(
                    breakdown.actualDeductions.sss +
                      breakdown.actualDeductions.philHealth +
                      breakdown.actualDeductions.pagIbig
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm py-2">
              <span>Monthly Tax:</span>
              <span className="text-red-600">-{formatCurrency(breakdown.monthlyTax)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-t-2 border-green-400 font-bold text-xl">
              <span className="text-green-900">Net Monthly Income:</span>
              <span className="text-green-700">{formatCurrency(breakdown.netMonthly)}</span>
            </div>
          </div>
        </div>

        {/* Custom Deductions Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <span className="mr-2">⚙️</span>
            Customize Deductions
          </h3>
          <p className="text-sm text-blue-700 mb-6">
            If your actual deductions differ from standard rates, enter your real amounts here.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">SSS (₱)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₱</span>
                </div>
                <input
                  type="number"
                  value={customDeductions.sss || ""}
                  onChange={(e) => handleDeductionChange("sss", e.target.value)}
                  placeholder={`Standard: ${formatCurrency(breakdown.standardDeductions.sss)}`}
                  className="w-full pl-8 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">PhilHealth (₱)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₱</span>
                </div>
                <input
                  type="number"
                  value={customDeductions.philHealth || ""}
                  onChange={(e) => handleDeductionChange("philHealth", e.target.value)}
                  placeholder={`Standard: ${formatCurrency(breakdown.standardDeductions.philHealth)}`}
                  className="w-full pl-8 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">Pag-IBIG (₱)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₱</span>
                </div>
                <input
                  type="number"
                  value={customDeductions.pagIbig || ""}
                  onChange={(e) => handleDeductionChange("pagIbig", e.target.value)}
                  placeholder={`Standard: ${formatCurrency(breakdown.standardDeductions.pagIbig)}`}
                  className="w-full pl-8 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSaveDeductions}
          disabled={saving}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <div className="flex items-center">
              Continue to Budget Allocation
              <span className="ml-2">→</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}