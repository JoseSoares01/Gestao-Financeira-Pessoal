export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  isEssential?: boolean;
  paymentMethod: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
  essentialExpenses: number;
  nonEssentialExpenses: number;
}

export interface Forecast {
  nextMonth: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  alert?: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  deadline: string;
}

export type PeriodFilter = 'day' | 'month' | 'semester' | 'year';

export interface PeriodData {
  label: string;
  transactions: Transaction[];
  summary: FinancialSummary;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
}
