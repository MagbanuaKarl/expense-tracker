"use client";

import { useState } from "react";
import { BudgetBreakdown, SalaryDeductions } from "@/types";
import styles from "./Salary.module.css";

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
    <div className={styles.cardSpacing}>
      <div className={styles.textCenter}>
        <div className={styles.iconCircle}>
          <span>📊</span>
        </div>
        <h2 className={styles.title}>Salary Breakdown</h2>
        <p className={styles.subtitle}>
          Review your deductions and tax calculations. Customize if your actual contributions differ.
        </p>
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.allocationCard}>
          <h3 className={styles.allocationCardHeader}>
            <span style={{ marginRight: '0.5rem' }}>💰</span>
            Income & Deductions
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div className={styles.flexBetween} style={{ borderBottom: '1px solid #2b2f3a', paddingBottom: '0.5rem' }}>
              <span className={styles.textMuted}>Gross Monthly Salary:</span>
              <span className={`${styles.valuePrimary} ${styles.valueGreen}`}>{formatCurrency(breakdown.grossMonthly)}</span>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem', paddingTop: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Mandatory Deductions:</div>
              <div className={styles.flexBetween}>
                <span>SSS:</span>
                <strong>{formatCurrency(breakdown.actualDeductions.sss)}</strong>
              </div>
              <div className={styles.flexBetween}>
                <span>PhilHealth:</span>
                <strong>{formatCurrency(breakdown.actualDeductions.philHealth)}</strong>
              </div>
              <div className={styles.flexBetween}>
                <span>Pag-IBIG:</span>
                <strong>{formatCurrency(breakdown.actualDeductions.pagIbig)}</strong>
              </div>
              <div className={styles.flexBetween} style={{ borderTop: '1px solid #2b2f3a', paddingTop: '0.5rem' }}>
                <span>Total Deductions:</span>
                <span style={{ color: '#f87171' }}>
                  -{formatCurrency(breakdown.actualDeductions.sss + breakdown.actualDeductions.philHealth + breakdown.actualDeductions.pagIbig)}
                </span>
              </div>
            </div>

            <div className={styles.flexBetween} style={{ paddingTop: '0.5rem' }}>
              <span>Monthly Tax:</span>
              <span style={{ color: '#f87171' }}>-{formatCurrency(breakdown.monthlyTax)}</span>
            </div>

            <div className={styles.flexBetween} style={{ borderTop: '2px solid #34d399', paddingTop: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span style={{ color: '#0f766e' }}>Net Monthly Income:</span>
              <span style={{ color: '#22c55e' }}>{formatCurrency(breakdown.netMonthly)}</span>
            </div>
          </div>
        </div>

        <div className={styles.allocationCard}>
          <h3 className={styles.allocationCardHeader}>
            <span style={{ marginRight: '0.5rem' }}>⚙️</span>
            Customize Deductions
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            If your actual deductions differ from standard rates, enter your real amounts here.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {(['sss', 'philHealth', 'pagIbig'] as const).map((key) => {
              const name = key === 'sss' ? 'SSS (₱)' : key === 'philHealth' ? 'PhilHealth (₱)' : 'Pag-IBIG (₱)';
              const value = customDeductions[key] || '';
              const placeholder = `Standard: ${formatCurrency(breakdown.standardDeductions[key])}`;

              return (
                <div key={key}>
                  <label className={styles.label}>{name}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₱</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleDeductionChange(key, e.target.value)}
                      placeholder={placeholder}
                      className={`${styles.input} ${styles.inputFocus}`}
                      style={{ paddingLeft: '2rem' }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.textCenter}>
        <button onClick={handleSaveDeductions} disabled={saving} className={`${styles.btnPrimary} ${saving ? styles.btnDisabled : ""}`}>
          {saving ? 'Saving...' : 'Continue to Budget Allocation →'}
        </button>
      </div>
    </div>
  );
}