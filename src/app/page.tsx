"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { Dashboard } from "@/features/expenses/components/Dashboard";

export default function Home() {
  const { user, loading } = useAuth();
  const [demoMode, setDemoMode] = useState(false);

  if (loading) {
    return <AppLoader />;
  }

  if (!user && !demoMode) {
    return <LoginPage onDemo={() => setDemoMode(true)} />;
  }

  const demoUser = {
    uid: "demo",
    displayName: "Demo User",
    photoURL: "",
  } as unknown as import("firebase/auth").User;

  return (
    <Dashboard
      user={user ?? demoUser}
      isDemo={demoMode}
      onExitDemo={() => setDemoMode(false)}
    />
  );
}

function AppLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
      }}
    >
      <span
        style={{
          fontSize: "28px",
          color: "var(--accent)",
          animation: "spin 1s linear infinite",
        }}
      >
        ◈
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
