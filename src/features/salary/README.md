# Salary & Budget Feature

A comprehensive salary and budget planning feature for the expense tracker app.

## Overview

This feature allows users to:
- Input their monthly salary
- Calculate after-tax income using Philippine tax rates
- Customize mandatory deductions (SSS, PhilHealth, Pag-IBIG)
- Allocate budget percentages across necessities, savings, and discretionary spending
- Track spending against allocated budgets

## Architecture

```
src/features/salary/
├── components/          # React components
│   ├── SalaryPage.tsx          # Main page with step navigation
│   ├── SalaryInputForm.tsx     # Salary input form
│   ├── SalaryBreakdown.tsx     # Deductions and tax breakdown
│   ├── AllocationForm.tsx      # Budget allocation form
│   └── BudgetOverview.tsx      # Budget tracking overview
├── hooks/               # React hooks
│   └── useSalary.ts            # Salary data management hook
├── services/            # Business logic and data access
│   ├── salaryService.ts        # Tax and deduction calculations
│   └── salaryFirebaseService.ts # Firebase data operations
└── index.ts             # Feature exports
```

## Key Features

### Tax Calculation
- Implements Philippine graduated income tax rates (0%-35%)
- Calculates annual taxable income after deductions
- Handles mandatory contributions: SSS (4.5%), PhilHealth (2.5%), Pag-IBIG (2%/1%)

### Budget Allocation
- Three allocation categories: Necessities, Savings, Discretionary
- Automatic expense categorization mapping
- Real-time budget vs actual spending comparison

### Data Storage
- Firebase Firestore collection: `salaries`
- User-specific salary data with custom deductions and allocations
- Secure access control with user ID validation

## Usage

1. Navigate to `/salary` page
2. Enter monthly salary
3. Review and customize deductions
4. Set budget allocation percentages
5. View budget overview with spending tracking

## Firebase Rules

```javascript
match /salaries/{userId} {
  allow read, write: if request.auth != null
    && request.auth.uid == userId;
}
```

## Dependencies

- React hooks for state management
- Firebase Firestore for data persistence
- Tailwind CSS for styling
- Existing expense tracking infrastructure