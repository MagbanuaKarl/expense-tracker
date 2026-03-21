"use client";

import { useState, useEffect } from "react";
import { SalaryData } from "@/types";
import styles from "./Salary.module.css";

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
      <h2 className={styles.title}>Budget Allocation</h2>
      <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
        Allocate your after-tax income across three categories. The percentages must total 100%.
      </p>

      <form onSubmit={handleSubmit} className={styles.container}>
        <div className={styles.gridTwo}>
          {[
            {
              key: 'necessities',
              label: 'Necessities',
              note: 'Essential expenses like food, housing, utilities, transportation, healthcare, etc.',
              value: necessities,
              setter: setNecessities,
            },
            {
              key: 'savings',
              label: 'Savings',
              note: 'Money set aside for emergencies, investments, and future goals.',
              value: savings,
              setter: setSavings,
            },
            {
              key: 'discretionary',
              label: 'Discretionary',
              note: 'Optional spending like entertainment, shopping, travel, and luxury items.',
              value: discretionary,
              setter: setDiscretionary,
            },
          ].map((item) => (
            <div key={item.key} className={styles.allocationCard}>
              <h3 className={styles.allocationCardHeader}>{item.label}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{item.note}</p>
              <div className={styles.flexRow} style={{ justifyContent: 'flex-start' }}>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  className={styles.input}
                  style={{ width: '4rem', textAlign: 'center' }}
                  min="0"
                  max="100"
                  step="1"
                  required
                />
                <span style={{ color: 'var(--text-primary)' }}>%</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.warningBox} ${isValid ? styles.warningValid : styles.warningInvalid}`}>
          <div className={styles.flexBetween}>
            <span className={styles.valuePrimary}>Total Allocation:</span>
            <span className={styles.valuePrimary}>{total}%</span>
          </div>
          {!isValid && (
            <p style={{ marginTop: '0.5rem', color: 'inherit' }}>
              {total < 100 ? 'Increase percentages to reach 100%.' : 'Decrease percentages to reach 100%.'}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !isValid}
          className={`${styles.btnPrimary} ${(saving || !isValid) ? styles.btnDisabled : ''}`}
          style={{ marginTop: '0.25rem' }}
        >
          {saving ? 'Saving...' : 'Save Allocation & View Budget Overview'}
        </button>
      </form>
    </div>
  );
}