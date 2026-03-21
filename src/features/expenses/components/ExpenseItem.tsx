"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Expense } from "@/types";
import { formatCurrency } from "@/lib/dateUtils";
import { CATEGORY_META } from "./categoryMeta";
import styles from "./ExpenseItem.module.css";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [confirming, setConfirming] = useState(false);
  const meta = CATEGORY_META[expense.category];

  function handleDelete() {
    if (confirming) {
      onDelete(expense.id);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 2500);
    }
  }

  return (
    <motion.div
      className={styles.item}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.007 }}
      transition={{ duration: 0.18 }}
    >
      <div className={styles.categoryDot} style={{ background: meta.color }} />
      <div className={styles.info}>
        <div className={styles.top}>
          <span className={styles.category}>{expense.category}</span>
          <span className={styles.amount}>{formatCurrency(expense.amount)}</span>
        </div>
        <div className={styles.bottom}>
          {expense.note && <span className={styles.note}>{expense.note}</span>}
          <span className={styles.date}>{expense.date}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(expense)}
          aria-label="Edit expense"
        >
          Edit
        </button>
        <button
          className={`${styles.deleteBtn} ${confirming ? styles.confirming : ""}`}
          onClick={handleDelete}
          aria-label={confirming ? "Confirm delete" : "Delete expense"}
        >
          {confirming ? "Sure?" : "Delete"}
        </button>
      </div>
    </motion.div>
  );
}
