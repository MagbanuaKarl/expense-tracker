import { format, getISOWeek, getYear, parseISO } from "date-fns";

/**
 * Convert a YYYY-MM-DD string to month key: "YYYY-MM"
 */
export function dateToMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

/**
 * Convert a YYYY-MM-DD string to ISO week key: "YYYY-W##"
 */
export function dateToWeek(dateStr: string): string {
  const date = parseISO(dateStr);
  const week = getISOWeek(date);
  const year = getYear(date);
  // Handle year boundary: Dec week 1 = next year
  const isoYear =
    week === 1 && date.getMonth() === 11
      ? year + 1
      : week >= 52 && date.getMonth() === 0
      ? year - 1
      : year;
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

/**
 * Get current month key: "YYYY-MM"
 */
export function currentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

/**
 * Get current week key: "YYYY-W##"
 */
export function currentWeek(): string {
  return dateToWeek(format(new Date(), "yyyy-MM-dd"));
}

/**
 * Get today as YYYY-MM-DD
 */
export function todayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Format a YYYY-MM month string to human readable: "March 2024"
 */
export function formatMonth(monthKey: string): string {
  return format(parseISO(`${monthKey}-01`), "MMMM yyyy");
}

/**
 * Format a YYYY-W## week string to human readable: "Week 12, 2024"
 */
export function formatWeek(weekKey: string): string {
  const [year, week] = weekKey.split("-W");
  return `Week ${week}, ${year}`;
}

/**
 * Get previous month key
 */
export function prevMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 2, 1);
  return format(date, "yyyy-MM");
}

/**
 * Get next month key
 */
export function nextMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month, 1);
  return format(date, "yyyy-MM");
}

/**
 * Get previous week key
 */
export function prevWeek(weekKey: string): string {
  const [year, weekNum] = weekKey.split("-W").map(Number);
  const date = new Date(year, 0, 1 + (weekNum - 2) * 7);
  return dateToWeek(format(date, "yyyy-MM-dd"));
}

/**
 * Get next week key
 */
export function nextWeek(weekKey: string): string {
  const [year, weekNum] = weekKey.split("-W").map(Number);
  const date = new Date(year, 0, 1 + weekNum * 7);
  return dateToWeek(format(date, "yyyy-MM-dd"));
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
