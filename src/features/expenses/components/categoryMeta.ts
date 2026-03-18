import { ExpenseCategory } from "@/types";

interface CategoryMeta {
  color: string;
  emoji: string;
}

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  Food:             { color: "#f97316", emoji: "🍜" },
  Transportation:   { color: "#3b82f6", emoji: "🚗" },
  Bills:            { color: "#ef4444", emoji: "📄" },
  Housing:          { color: "#8b5cf6", emoji: "🏠" },
  Utilities:        { color: "#06b6d4", emoji: "💡" },
  Healthcare:       { color: "#10b981", emoji: "🏥" },
  Insurance:        { color: "#6366f1", emoji: "🛡️" },
  Education:        { color: "#f59e0b", emoji: "📚" },
  Shopping:         { color: "#ec4899", emoji: "🛍️" },
  Entertainment:    { color: "#a855f7", emoji: "🎬" },
  Travel:           { color: "#14b8a6", emoji: "✈️" },
  Savings:          { color: "#22c55e", emoji: "💰" },
  Investments:      { color: "#16a34a", emoji: "📈" },
  Debt:             { color: "#dc2626", emoji: "💳" },
  Subscriptions:    { color: "#7c3aed", emoji: "🔄" },
  "Personal Care":  { color: "#db2777", emoji: "✨" },
  "Gifts & Donations": { color: "#e11d48", emoji: "🎁" },
  Miscellaneous:    { color: "#6b7280", emoji: "📦" },
  Luxury:           { color: "#d97706", emoji: "💎" },
};
