"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Expense, ExpenseInput, EXPENSE_CATEGORIES } from "@/types";
import { todayString } from "@/lib/dateUtils";
import styles from "./ExpenseForm.module.css";

interface ExpenseFormProps {
  initialValues?: Expense;
  onSubmit: (input: ExpenseInput) => Promise<void>;
  onCancel: () => void;
}

export function ExpenseForm({
  initialValues,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState(
    initialValues ? String(initialValues.amount) : ""
  );
  const [category, setCategory] = useState(
    initialValues?.category ?? EXPENSE_CATEGORIES[0]
  );
  const [note, setNote] = useState(initialValues?.note ?? "");
  const [date, setDate] = useState(initialValues?.date ?? todayString());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialValues;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        amount: parsedAmount,
        category,
        note: note.trim() || undefined,
        date,
      });
    } catch {
      setError("Failed to save expense. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modal}
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{isEditing ? "Edit Expense" : "Add Expense"}</h2>
          <button className={styles.closeBtn} onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Amount</label>
            <div className={styles.amountWrapper}>
              <span className={styles.currencySymbol}>₱</span>
              <input
                className={styles.amountInput}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                autoFocus
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
              className={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Note <span className={styles.optional}>(optional)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was this for?"
              maxLength={200}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? "Saving…" : isEditing ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
