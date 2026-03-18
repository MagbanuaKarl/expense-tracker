# ◈ Ledger — Expense Tracker

A clean, scalable expense tracker built with **Next.js 14 (App Router)**, **Firebase Authentication**, **Firestore**, and deployed on **Vercel**.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Decisions](#architecture-decisions)
5. [Getting Started](#getting-started)
6. [Firebase Setup](#firebase-setup)
7. [Deploying to Vercel](#deploying-to-vercel)
8. [Firestore Data Model](#firestore-data-model)
9. [Reporting System](#reporting-system)
10. [Categories](#categories)
11. [Scaling Guide](#scaling-guide)

---

## Features

- **Google Authentication** via Firebase Auth
- **Add / Edit / Delete** expenses with validation
- **19 fixed categories** — strictly validated, no custom entries
- **Monthly & Weekly views** — navigate any past period
- **Dashboard** — total spending, category breakdown with visual bars, top spending category
- **Category filter** on the transaction list
- **Indexed Firestore queries** — fast even with thousands of records
- **Feature-based architecture** — each domain owns its components, hooks, and services

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | Next.js 14 (App Router)           |
| Language       | TypeScript (strict)               |
| Auth           | Firebase Authentication (Google)  |
| Database       | Cloud Firestore                   |
| Deployment     | Vercel                            |
| Date utilities | date-fns                          |
| Styling        | CSS Modules                       |

No global state library. No chart library. No unnecessary abstraction.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — mounts AuthProvider
│   ├── page.tsx            # Entry: shows Login or Dashboard
│   └── globals.css         # Design tokens + global reset
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── AuthProvider.tsx       # Context provider
│   │   │   ├── LoginPage.tsx          # Google sign-in UI
│   │   │   └── LoginPage.module.css
│   │   ├── hooks/
│   │   │   └── useAuth.ts             # AuthContext + useAuthState
│   │   └── services/
│   │       └── authService.ts         # All Firebase Auth calls
│   │
│   ├── expenses/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx          # Main page layout
│   │   │   ├── Dashboard.module.css
│   │   │   ├── ExpenseForm.tsx        # Add/Edit modal
│   │   │   ├── ExpenseForm.module.css
│   │   │   ├── ExpenseItem.tsx        # Single row
│   │   │   ├── ExpenseItem.module.css
│   │   │   ├── ExpenseList.tsx        # List + category filter
│   │   │   ├── ExpenseList.module.css
│   │   │   └── categoryMeta.ts        # Colors + emojis per category
│   │   ├── hooks/
│   │   │   └── useExpenses.ts         # Fetch, add, edit, delete
│   │   └── services/
│   │       └── expenseService.ts      # All Firestore calls
│   │
│   └── reports/
│       ├── components/
│       │   ├── SummaryCard.tsx        # Total + top category hero
│       │   ├── SummaryCard.module.css
│       │   ├── CategoryBreakdown.tsx  # Stacked bar + ranked list
│       │   ├── CategoryBreakdown.module.css
│       │   ├── PeriodNavigator.tsx    # Month/Week switcher + arrows
│       │   └── PeriodNavigator.module.css
│       ├── hooks/
│       │   └── useReport.ts           # Memoized report from expenses
│       └── services/
│           └── reportService.ts       # Pure computation (no Firebase)
│
├── lib/
│   ├── firebase.ts         # Firebase app initialization (singleton)
│   └── dateUtils.ts        # Date helpers: month/week keys, formatting
│
└── types/
    └── index.ts            # Expense, ExpenseInput, PeriodReport, etc.
```

---

## Architecture Decisions

### Service Layer Isolation
Firebase is **never called directly from UI components**. All Firestore operations live in `*Service.ts` files. Components call hooks; hooks call services.

```
Component → Hook → Service → Firebase SDK
```

This makes it trivial to swap Firestore for another backend, or mock services in tests.

### Precomputed `month` and `week` Fields
Rather than doing range queries on `date`, each expense stores:
- `month: "2024-03"` — for monthly views
- `week: "2024-W12"` — for weekly views

This enables simple equality queries (`where("month", "==", "2024-03")`) that Firestore can satisfy with a composite index, keeping reads fast and cheap.

### No Global State Library
Auth state lives in React Context (one level). All other state is local to `Dashboard.tsx` or derived via hooks. There's no need for Redux/Zustand at this scale, and the architecture makes it easy to add one later if needed.

### Report as Pure Computation
`reportService.ts` contains only pure functions — no Firebase, no side effects. `useReport` is just `useMemo` wrapping the pure function. This makes reporting logic fully testable in isolation.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project (free Spark plan works)
- A Vercel account (free)

### 1. Clone and install

```bash
git clone https://github.com/MagbanuaKarl/expense-tracker.git
cd expense-tracker
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Firebase values (see [Firebase Setup](#firebase-setup) below).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Firebase Setup

### Step 1 — Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → give it a name → continue
3. Disable Google Analytics if not needed → **Create project**

### Step 2 — Enable Google Authentication

1. In the left sidebar: **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in providers**, click **Google** → toggle **Enable**
4. Set a support email → **Save**

### Step 3 — Create Firestore Database

1. In the left sidebar: **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll add rules next)
4. Pick your nearest region → **Enable**

### Step 4 — Deploy Firestore Rules

In the Firebase Console → Firestore → **Rules** tab, paste the contents of `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      allow read, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;

      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.amount is number
        && request.resource.data.amount > 0
        && request.resource.data.category is string
        && request.resource.data.date is string
        && request.resource.data.month is string
        && request.resource.data.week is string
        && request.resource.data.createdAt is timestamp;

      allow update: if request.auth != null
        && resource.data.userId == request.auth.uid
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.amount is number
        && request.resource.data.amount > 0
        && request.resource.data.category is string
        && request.resource.data.date is string;
    }
  }
}
```

Click **Publish**.

### Step 5 — Create Firestore Indexes

In the Firebase Console → Firestore → **Indexes** tab → **Composite** → **Add index** for each of the following:

| Collection | Fields | Order |
|------------|--------|-------|
| `expenses` | `userId` ASC, `month` ASC, `date` DESC | — |
| `expenses` | `userId` ASC, `week` ASC, `date` DESC | — |
| `expenses` | `userId` ASC, `date` DESC | — |

> **Tip:** Alternatively, install the Firebase CLI (`npm i -g firebase-tools`), run `firebase login`, then `firebase deploy --only firestore:indexes` using the provided `firestore.indexes.json`.

### Step 6 — Register a Web App

1. In Firebase Console → **Project Overview** → click the **</>** (Web) icon
2. Give the app a nickname (e.g. "ledger-web") → **Register app**
3. Copy the `firebaseConfig` object values into your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

### Step 7 — Add Authorized Domain for Auth

When deploying to Vercel, you need to whitelist your production domain:

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain**
3. Enter your Vercel domain: `your-app.vercel.app`

---

## Deploying to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts. When asked about environment variables, add each `NEXT_PUBLIC_FIREBASE_*` key.

### Option B — GitHub integration

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add all six `NEXT_PUBLIC_FIREBASE_*` keys
5. Click **Deploy**

### After Deploying

1. Copy your Vercel URL (e.g. `https://ledger-abc123.vercel.app`)
2. Add it to Firebase Auth authorized domains (see Step 7 above)
3. Visit your URL and sign in with Google ✓

---

## Firestore Data Model

### Collection: `expenses`

Each document represents one expense:

```typescript
{
  id:        string,     // Firestore auto-generated document ID
  userId:    string,     // Firebase Auth UID — used for all queries
  amount:    number,     // Positive float, e.g. 12.50
  category:  string,     // One of the 19 fixed categories
  note:      string,     // Optional free text, max 200 chars
  date:      string,     // "YYYY-MM-DD" — the expense date
  createdAt: Timestamp,  // Firestore server timestamp — for audit
  month:     string,     // Precomputed "YYYY-MM" for monthly queries
  week:      string,     // Precomputed "YYYY-W##" for weekly queries
}
```

### Why precompute `month` and `week`?

Firestore doesn't support range queries on multiple fields efficiently. By precomputing these values at write time, we can use fast equality queries:

```typescript
// Monthly view
query(collection(db, "expenses"),
  where("userId", "==", uid),
  where("month", "==", "2024-03"),   // ← simple equality
  orderBy("date", "desc")
)

// Weekly view
query(collection(db, "expenses"),
  where("userId", "==", uid),
  where("week", "==", "2024-W12"),   // ← simple equality
  orderBy("date", "desc")
)
```

Both are satisfied by the composite indexes in `firestore.indexes.json`.

---

## Reporting System

Reports are computed **client-side from already-fetched data** — no extra Firestore reads.

### Data flow

```
Firestore → useExpenses (fetch) → expenses[]
                                      ↓
                               useReport (useMemo)
                                      ↓
                               PeriodReport {
                                 totalSpending,
                                 breakdown: CategoryBreakdown[],
                                 topCategory,
                                 expenseCount
                               }
```

### `computeReport` (pure function in `reportService.ts`)

1. Sums all amounts → `totalSpending`
2. Groups by category → `Map<category, { total, count }>`
3. For each category: computes `percentage = (total / totalSpending) * 100`
4. Sorts by `total` descending → `breakdown[]`
5. `topCategory = breakdown[0]`

The function is side-effect-free and can be unit tested without any Firebase setup.

---

## Categories

The 19 fixed categories are defined once in `src/types/index.ts` as a `const` tuple:

```typescript
export const EXPENSE_CATEGORIES = [
  "Food", "Transportation", "Bills", "Housing", "Utilities",
  "Healthcare", "Insurance", "Education", "Shopping", "Entertainment",
  "Travel", "Savings", "Investments", "Debt", "Subscriptions",
  "Personal Care", "Gifts & Donations", "Miscellaneous", "Luxury",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
```

Validation happens at three layers:
1. **TypeScript** — `ExpenseCategory` type prevents invalid values at compile time
2. **Service layer** — `isValidCategory()` guard throws at runtime before any Firestore write
3. **Firestore rules** — server-side `category is string` check (extend to an allow-list if needed)

---

## Scaling Guide

The architecture is designed to grow. Here's how to add common features:

### Add Budgets

1. Create `src/features/budgets/` with the same structure
2. Add a `budgets` Firestore collection: `{ userId, category, amount, month }`
3. In `Dashboard.tsx`, fetch budgets alongside expenses
4. In `CategoryBreakdown`, compare spending vs budget per category

### Add Analytics / Charts

1. Install `recharts` or `chart.js`
2. Create `src/features/reports/components/SpendingChart.tsx`
3. Pass `report.breakdown` as data — no data model changes needed

### Add Push Notifications / Reminders

1. Enable Firebase Cloud Messaging
2. Add a `src/features/notifications/` feature
3. Use a Cloud Function to send reminders based on spending patterns

### Add Multi-currency

1. Add `currency: string` to `ExpenseInput` and the Firestore model
2. Store amounts in a base currency, add a `originalAmount` and `exchangeRate` field
3. Adjust `computeReport` to normalize before summing

### Add Recurring Expenses

1. Add `recurring: boolean` and `recurrenceRule: string` to the model
2. Create a Cloud Function that auto-creates expenses on a schedule
3. Show recurring expenses with a badge in `ExpenseItem`

---

## Local Development Tips

```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Use Firebase Emulator (optional, for offline dev)
npm i -g firebase-tools
firebase emulators:start --only firestore,auth
```

To use the emulator, add to `.env.local`:
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

Then in `src/lib/firebase.ts`, conditionally connect:
```typescript
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

---

## License

MIT
