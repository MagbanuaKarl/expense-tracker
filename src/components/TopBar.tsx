"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { signOut } from "@/features/auth/services/authService";
import styles from "./TopBar.module.css";

interface TopBarProps {
  isDemo?: boolean;
  onExitDemo?: () => void;
  currentPage?: "expenses" | "salary";
}

export function TopBar({ isDemo, onExitDemo, currentPage = "expenses" }: TopBarProps) {
  const { user } = useAuth();

  async function handleSignOut() {
    if (isDemo && onExitDemo) {
      onExitDemo();
      return;
    }

    await signOut();
  }

  if (!user && !isDemo) return null;

  const currentUser = user || {
    uid: "demo",
    displayName: "Demo User",
    photoURL: "",
  } as unknown as import("firebase/auth").User;

  return (
    <header className={styles.topBar}>
      <div className={styles.brand}>
        <span className={styles.brandSymbol}>◈</span>
        <span className={styles.brandName}>Ledger</span>
      </div>
      <div className={styles.userArea}>
        <img
          className={styles.avatar}
          src={
            currentUser.photoURL
              ? currentUser.photoURL
              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='46' fill='%237E7D88'/%3E%3Ccircle cx='48' cy='34' r='20' fill='%23F3F4F6'/%3E%3Cpath d='M24 78C24 62.536 36.536 50 52 50H44C59.464 50 72 62.536 72 78H24Z' fill='%23F3F4F6'/%3E%3C/svg%3E"
          }
          alt={currentUser.displayName ?? "User"}
          referrerPolicy="no-referrer"
        />
        <span className={styles.userName}>
          {isDemo ? "Demo" : currentUser.displayName?.split(" ")[0]}
        </span>
        <a
          href="/"
          className={`${styles.navBtn} ${currentPage === "expenses" ? styles.active : ""}`}
        >
          Expenses
        </a>
        <a
          href="/salary"
          className={`${styles.navBtn} ${currentPage === "salary" ? styles.active : ""}`}
        >
          Budget
        </a>
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          {isDemo ? "Exit demo" : "Sign out"}
        </button>
      </div>
    </header>
  );
}