import { SalaryData, SalaryDeductions, BudgetBreakdown } from "@/types";

export class SalaryCalculator {
  // Standard deduction rates (2024-2025)
  private static readonly STANDARD_RATES = {
    sss: 0.045, // 4.5%
    philHealth: 0.025, // 2.5%
    pagIbig: (salary: number) => (salary > 1500 ? 0.02 : 0.01), // 2% or 1%
  };

  // Maximum monthly deductions
  private static readonly MAX_DEDUCTIONS = {
    sss: 900, // ₱900
    philHealth: 100000 / 12, // Based on ₱100,000 annual ceiling
    pagIbig: Infinity, // No max specified
  };

  // Tax brackets (annual)
  private static readonly TAX_BRACKETS = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250001, max: 400000, rate: 0.15 },
    { min: 400001, max: 800000, rate: 0.20 },
    { min: 800001, max: 2000000, rate: 0.25 },
    { min: 2000001, max: 8000000, rate: 0.30 },
    { min: 8000001, max: Infinity, rate: 0.35 },
  ];

  static calculateStandardDeductions(monthlySalary: number): SalaryDeductions {
    const sss = Math.min(monthlySalary * this.STANDARD_RATES.sss, this.MAX_DEDUCTIONS.sss);
    const philHealth = Math.min(monthlySalary * this.STANDARD_RATES.philHealth, this.MAX_DEDUCTIONS.philHealth);
    const pagIbig = monthlySalary * this.STANDARD_RATES.pagIbig(monthlySalary);

    return { sss, philHealth, pagIbig };
  }

  static calculateAnnualTax(annualTaxableIncome: number): number {
    let tax = 0;
    let remainingIncome = annualTaxableIncome;

    for (const bracket of this.TAX_BRACKETS) {
      if (remainingIncome <= 0) break;

      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }

    return tax;
  }

  static calculateBudgetBreakdown(salaryData: SalaryData): BudgetBreakdown {
    const { monthlySalary, customDeductions, allocations } = salaryData;

    // Calculate deductions
    const standardDeductions = this.calculateStandardDeductions(monthlySalary);
    const actualDeductions: SalaryDeductions = {
      sss: customDeductions?.sss ?? standardDeductions.sss,
      philHealth: customDeductions?.philHealth ?? standardDeductions.philHealth,
      pagIbig: customDeductions?.pagIbig ?? standardDeductions.pagIbig,
    };

    const totalMonthlyDeductions = actualDeductions.sss + actualDeductions.philHealth + actualDeductions.pagIbig;
    const annualTaxableIncome = (monthlySalary - totalMonthlyDeductions) * 12;
    const annualTax = this.calculateAnnualTax(annualTaxableIncome);
    const monthlyTax = annualTax / 12;
    const netMonthly = monthlySalary - totalMonthlyDeductions - monthlyTax;

    // Calculate allocations
    const allocatedAmounts = {
      necessities: (netMonthly * allocations.necessities) / 100,
      savings: (netMonthly * allocations.savings) / 100,
      discretionary: (netMonthly * allocations.discretionary) / 100,
    };

    return {
      grossMonthly: monthlySalary,
      standardDeductions,
      actualDeductions,
      annualTaxable: annualTaxableIncome,
      annualTax,
      monthlyTax,
      netMonthly,
      allocations: allocatedAmounts,
    };
  }
}