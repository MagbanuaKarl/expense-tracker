"use client";

import { useState } from "react";
import { SalaryData } from "@/types";
import styles from "./Salary.module.css";

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
    <div className={styles.cardSpacing}>
      <div className={styles.textCenter}>
        <div className={styles.iconCircle}>
          <span>💰</span>
        </div>
        <h2 className={styles.title}>Enter Your Monthly Salary</h2>
        <p className={styles.subtitle}>
          Let's start by understanding your income. We'll calculate your take-home pay and help you allocate it wisely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.container}>
        <div className={styles.cardSpacing}>
          <label htmlFor="monthlySalary" className={styles.label}>
            Monthly Salary (₱)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={styles.textMuted}>₱</span>
            </div>
            <input
              type="number"
              id="monthlySalary"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="0.00"
              className={`${styles.input} ${styles.inputFocus}`}
              min="0"
              step="0.01"
              required
            />
          </div>
          <p className={styles.textMuted}>
            This is your gross monthly salary before deductions and taxes.
          </p>
        </div>

        <div className={styles.helpCard}>
          <div className={styles.flexRow}>
            <div className={styles.iconCircle} style={{ width: '40px', height: '40px' }}>
              <span>ℹ️</span>
            </div>
            <div>
              <h3 className={styles.allocationCardHeader}>What happens next?</h3>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                <li style={{ marginBottom: '0.35rem' }}>• We'll calculate your after-tax income using Philippine tax rates</li>
                <li style={{ marginBottom: '0.35rem' }}>• You'll see a breakdown of mandatory deductions (SSS, PhilHealth, Pag-IBIG)</li>
                <li style={{ marginBottom: '0.35rem' }}>• You can customize these deductions if they differ from standard rates</li>
                <li>• You'll allocate percentages for necessities, savings, and discretionary spending</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`${styles.btnPrimary} ${saving ? styles.btnDisabled : ""}`}
        >
          {saving ? (
            <div className={styles.flexRow}>
              <div className={styles.spinner} style={{ width: '1rem', height: '1rem', borderWidth: '2px', borderBottomColor: '#fff', marginRight: '0.5rem' }} />
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