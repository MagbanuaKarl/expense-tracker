"use client";

import { useState, useEffect } from "react";
import { SalaryData } from "@/types";

interface AllocationFormProps {
  allocations: SalaryData["allocations"];
  onSave: (allocations: SalaryData["allocations"]) => Promise<void>;
  saving: boolean;
}

export function AllocationForm({ allocations, onSave, saving }: AllocationFormProps) {
  const [necessities, setNecessities] = useState(allocations.necessities.toString());
  const [savings, setSavings] = useState(allocations.savings.toString());
  const [discretionary, setDiscretionary] = useState(allocations.discretionary.toString());

  const total = (parseFloat(necessities) || 0) + (parseFloat(savings) || 0) + (parseFloat(discretionary) || 0);
  const isValid = total === 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      alert("Allocations must total 100%.");
      return;
    }

    await onSave({
      necessities: parseFloat(necessities),
      savings: parseFloat(savings),
      discretionary: parseFloat(discretionary),
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Budget Allocation</h2>
      <p className="text-gray-600 mb-6">
        Allocate your after-tax income across three categories. The percentages must total 100%.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Necessities */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Necessities</h3>
            <p className="text-sm text-blue-700 mb-3">
              Essential expenses like food, housing, utilities, transportation, healthcare, etc.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={necessities}
                onChange={(e) => setNecessities(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                min="0"
                max="100"
                step="1"
                required
              />
              <span className="text-sm">%</span>
            </div>
          </div>

          {/* Savings */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Savings</h3>
            <p className="text-sm text-green-700 mb-3">
              Money set aside for emergencies, investments, and future goals.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                min="0"
                max="100"
                step="1"
                required
              />
              <span className="text-sm">%</span>
            </div>
          </div>

          {/* Discretionary */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Discretionary</h3>
            <p className="text-sm text-purple-700 mb-3">
              Optional spending like entertainment, shopping, travel, and luxury items.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={discretionary}
                onChange={(e) => setDiscretionary(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                min="0"
                max="100"
                step="1"
                required
              />
              <span className="text-sm">%</span>
            </div>
          </div>
        </div>

        {/* Total Validation */}
        <div className={`p-4 rounded-lg ${isValid ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Allocation:</span>
            <span className="font-bold">{total}%</span>
          </div>
          {!isValid && (
            <p className="text-sm mt-1">
              {total < 100 ? "Increase percentages to reach 100%." : "Decrease percentages to reach 100%."}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !isValid}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Allocation & View Budget Overview"}
        </button>
      </form>
    </div>
  );
}