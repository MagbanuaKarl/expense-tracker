import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Expense,
  ExpenseInput,
  ExpenseCategory,
  isValidCategory,
} from "@/types";
import { dateToMonth, dateToWeek } from "@/lib/dateUtils";

const COLLECTION = "expenses";

function toExpense(id: string, data: Record<string, unknown>): Expense {
  const category = data.category as string;
  if (!isValidCategory(category)) {
    throw new Error(`Invalid category in Firestore: ${category}`);
  }
  return {
    id,
    userId: data.userId as string,
    amount: data.amount as number,
    category: category as ExpenseCategory,
    note: (data.note as string) || undefined,
    date: data.date as string,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    month: data.month as string,
    week: data.week as string,
  };
}

export async function createExpense(
  userId: string,
  input: ExpenseInput
): Promise<Expense> {
  if (!isValidCategory(input.category)) {
    throw new Error(`Invalid category: ${input.category}`);
  }
  if (input.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const data = {
    userId,
    amount: input.amount,
    category: input.category,
    note: input.note ?? "",
    date: input.date,
    month: dateToMonth(input.date),
    week: dateToWeek(input.date),
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COLLECTION), data);
  return {
    id: ref.id,
    ...data,
    createdAt: new Date(),
    note: input.note,
  };
}

export async function updateExpense(
  expenseId: string,
  input: Partial<ExpenseInput>
): Promise<void> {
  if (input.category && !isValidCategory(input.category)) {
    throw new Error(`Invalid category: ${input.category}`);
  }
  if (input.amount !== undefined && input.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  const updates: Record<string, unknown> = { ...input };

  if (input.date) {
    updates.month = dateToMonth(input.date);
    updates.week = dateToWeek(input.date);
  }

  const ref = doc(db, COLLECTION, expenseId);
  await updateDoc(ref, updates);
}

export async function deleteExpense(expenseId: string): Promise<void> {
  const ref = doc(db, COLLECTION, expenseId);
  await deleteDoc(ref);
}

export async function getExpensesByMonth(
  userId: string,
  month: string
): Promise<Expense[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    where("month", "==", month),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) =>
    toExpense(d.id, d.data() as Record<string, unknown>)
  );
}

export async function getExpensesByWeek(
  userId: string,
  week: string
): Promise<Expense[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    where("week", "==", week),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) =>
    toExpense(d.id, d.data() as Record<string, unknown>)
  );
}
