import type { Transaction, Category, MonthlyData, CategoryData, FinancialSummary, Forecast } from '@/types';

// Helper to get current date and generate relative dates
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const getDate = (yearOffset: number, monthOffset: number, day: number) => {
  const date = new Date(currentYear + yearOffset, currentMonth + monthOffset, day);
  return date.toISOString().split('T')[0];
};

export const categories: Category[] = [
  { id: '1', name: 'Salário', type: 'income', color: '#7cb342', icon: 'Wallet' },
  { id: '2', name: 'Bônus', type: 'income', color: '#aed581', icon: 'Gift' },
  { id: '3', name: 'Freelance', type: 'income', color: '#558b2f', icon: 'Briefcase' },
  { id: '4', name: 'Investimentos', type: 'income', color: '#4caf50', icon: 'TrendingUp' },
  { id: '5', name: 'Outros', type: 'income', color: '#81c784', icon: 'Plus' },
  { id: '6', name: 'Moradia', type: 'expense', color: '#ef5350', icon: 'Home' },
  { id: '7', name: 'Alimentação', type: 'expense', color: '#ff7043', icon: 'Utensils' },
  { id: '8', name: 'Transporte', type: 'expense', color: '#ffa726', icon: 'Car' },
  { id: '9', name: 'Saúde', type: 'expense', color: '#42a5f5', icon: 'Heart' },
  { id: '10', name: 'Lazer', type: 'expense', color: '#ab47bc', icon: 'Gamepad2' },
  { id: '11', name: 'Educação', type: 'expense', color: '#5c6bc0', icon: 'BookOpen' },
  { id: '12', name: 'Outros', type: 'expense', color: '#78909c', icon: 'MoreHorizontal' },
];

export const transactions: Transaction[] = [
  // Current month transactions
  { id: '1', date: getDate(0, 0, 1), description: 'Salário', amount: 3200, type: 'income', category: 'Salário', paymentMethod: 'Transferência' },
  { id: '2', date: getDate(0, 0, 5), description: 'Bônus trimestral', amount: 800, type: 'income', category: 'Bônus', paymentMethod: 'Transferência' },
  { id: '3', date: getDate(0, 0, 3), description: 'Renda', amount: 950, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '4', date: getDate(0, 0, 4), description: 'Supermercado', amount: 420, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
  { id: '5', date: getDate(0, 0, 6), description: 'Transporte', amount: 85, type: 'expense', category: 'Transporte', isEssential: true, paymentMethod: 'Crédito' },
  { id: '6', date: getDate(0, 0, 8), description: 'Cinema', amount: 45, type: 'expense', category: 'Lazer', isEssential: false, paymentMethod: 'Crédito' },
  { id: '7', date: getDate(0, 0, 10), description: 'Farmácia', amount: 95, type: 'expense', category: 'Saúde', isEssential: true, paymentMethod: 'Débito' },
  { id: '8', date: getDate(0, 0, 12), description: 'Curso online', amount: 120, type: 'expense', category: 'Educação', isEssential: false, paymentMethod: 'Crédito' },
  { id: '9', date: getDate(0, 0, 15), description: 'Restaurante', amount: 110, type: 'expense', category: 'Alimentação', isEssential: false, paymentMethod: 'Crédito' },
  { id: '10', date: getDate(0, 0, 18), description: 'Freelance projeto', amount: 650, type: 'income', category: 'Freelance', paymentMethod: 'Transferência' },
  { id: '11', date: getDate(0, 0, 20), description: 'Gasolina', amount: 180, type: 'expense', category: 'Transporte', isEssential: true, paymentMethod: 'Débito' },
  { id: '12', date: getDate(0, 0, 22), description: 'Netflix', amount: 15, type: 'expense', category: 'Lazer', isEssential: false, paymentMethod: 'Crédito' },
  { id: '13', date: getDate(0, 0, 25), description: 'Eletricidade', amount: 95, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '14', date: getDate(0, 0, 26), description: 'Ginásio', amount: 45, type: 'expense', category: 'Saúde', isEssential: false, paymentMethod: 'Débito' },
  { id: '15', date: getDate(0, 0, 28), description: 'Supermercado', amount: 280, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
  { id: '16', date: getDate(0, 0, 30), description: 'Dividendos', amount: 180, type: 'income', category: 'Investimentos', paymentMethod: 'Transferência' },
  
  // Previous month transactions
  { id: '17', date: getDate(0, -1, 1), description: 'Salário', amount: 3200, type: 'income', category: 'Salário', paymentMethod: 'Transferência' },
  { id: '18', date: getDate(0, -1, 3), description: 'Renda', amount: 950, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '19', date: getDate(0, -1, 5), description: 'Supermercado', amount: 480, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
  { id: '20', date: getDate(0, -1, 8), description: 'Transporte', amount: 75, type: 'expense', category: 'Transporte', isEssential: true, paymentMethod: 'Crédito' },
  { id: '21', date: getDate(0, -1, 10), description: 'Compras', amount: 220, type: 'expense', category: 'Lazer', isEssential: false, paymentMethod: 'Crédito' },
  { id: '22', date: getDate(0, -1, 12), description: 'Farmácia', amount: 65, type: 'expense', category: 'Saúde', isEssential: true, paymentMethod: 'Débito' },
  { id: '23', date: getDate(0, -1, 15), description: 'Freelance', amount: 850, type: 'income', category: 'Freelance', paymentMethod: 'Transferência' },
  { id: '24', date: getDate(0, -1, 18), description: 'Gasolina', amount: 165, type: 'expense', category: 'Transporte', isEssential: true, paymentMethod: 'Débito' },
  { id: '25', date: getDate(0, -1, 20), description: 'Água', amount: 55, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '26', date: getDate(0, -1, 25), description: 'Restaurante', amount: 145, type: 'expense', category: 'Alimentação', isEssential: false, paymentMethod: 'Crédito' },
  { id: '27', date: getDate(0, -1, 28), description: 'Internet', amount: 45, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  
  // Two months ago
  { id: '28', date: getDate(0, -2, 1), description: 'Salário', amount: 3100, type: 'income', category: 'Salário', paymentMethod: 'Transferência' },
  { id: '29', date: getDate(0, -2, 3), description: 'Renda', amount: 950, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '30', date: getDate(0, -2, 5), description: 'Supermercado', amount: 450, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
  { id: '31', date: getDate(0, -2, 8), description: 'Transporte', amount: 80, type: 'expense', category: 'Transporte', isEssential: true, paymentMethod: 'Crédito' },
  { id: '32', date: getDate(0, -2, 10), description: 'Concerto', amount: 120, type: 'expense', category: 'Lazer', isEssential: false, paymentMethod: 'Crédito' },
  { id: '33', date: getDate(0, -2, 12), description: 'Dentista', amount: 180, type: 'expense', category: 'Saúde', isEssential: true, paymentMethod: 'Débito' },
  { id: '34', date: getDate(0, -2, 15), description: 'Freelance', amount: 550, type: 'income', category: 'Freelance', paymentMethod: 'Transferência' },
  { id: '35', date: getDate(0, -2, 18), description: 'Gasolina', amount: 190, type: 'expense', category: 'Transporte', isEssential: true, paymentMethod: 'Débito' },
  { id: '36', date: getDate(0, -2, 20), description: 'Eletricidade', amount: 88, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '37', date: getDate(0, -2, 25), description: 'Livros', amount: 85, type: 'expense', category: 'Educação', isEssential: false, paymentMethod: 'Crédito' },
  { id: '38', date: getDate(0, -2, 28), description: 'Supermercado', amount: 320, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
  
  // Additional transactions for semester view
  { id: '39', date: getDate(0, -3, 1), description: 'Salário', amount: 3100, type: 'income', category: 'Salário', paymentMethod: 'Transferência' },
  { id: '40', date: getDate(0, -3, 3), description: 'Renda', amount: 950, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '41', date: getDate(0, -3, 10), description: 'Supermercado', amount: 400, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
  { id: '42', date: getDate(0, -3, 15), description: 'Freelance', amount: 400, type: 'income', category: 'Freelance', paymentMethod: 'Transferência' },
  { id: '43', date: getDate(0, -4, 1), description: 'Salário', amount: 3000, type: 'income', category: 'Salário', paymentMethod: 'Transferência' },
  { id: '44', date: getDate(0, -4, 3), description: 'Renda', amount: 950, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '45', date: getDate(0, -4, 10), description: 'Supermercado', amount: 380, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
  { id: '46', date: getDate(0, -5, 1), description: 'Salário', amount: 2950, type: 'income', category: 'Salário', paymentMethod: 'Transferência' },
  { id: '47', date: getDate(0, -5, 3), description: 'Renda', amount: 950, type: 'expense', category: 'Moradia', isEssential: true, paymentMethod: 'Débito' },
  { id: '48', date: getDate(0, -5, 10), description: 'Supermercado', amount: 350, type: 'expense', category: 'Alimentação', isEssential: true, paymentMethod: 'Crédito' },
];

// Generate month labels dynamically
const getMonthLabel = (offset: number) => {
  const date = new Date(currentYear, currentMonth + offset, 1);
  return date.toLocaleDateString('pt-PT', { month: 'short' }).replace('.', '');
};

export const monthlyData: MonthlyData[] = [
  { month: getMonthLabel(-5), income: 2950, expense: 2800, balance: 150 },
  { month: getMonthLabel(-4), income: 3000, expense: 2650, balance: 350 },
  { month: getMonthLabel(-3), income: 3500, expense: 2700, balance: 800 },
  { month: getMonthLabel(-2), income: 3650, expense: 2850, balance: 800 },
  { month: getMonthLabel(-1), income: 4050, expense: 2700, balance: 1350 },
  { month: getMonthLabel(0), income: 4830, expense: 2345, balance: 2485 },
];

export const categoryData: CategoryData[] = [
  { name: 'Moradia', value: 950, percentage: 35, color: '#ef5350' },
  { name: 'Alimentação', value: 700, percentage: 26, color: '#ff7043' },
  { name: 'Transporte', value: 265, percentage: 10, color: '#ffa726' },
  { name: 'Saúde', value: 140, percentage: 5, color: '#42a5f5' },
  { name: 'Lazer', value: 200, percentage: 7, color: '#ab47bc' },
  { name: 'Educação', value: 120, percentage: 4, color: '#5c6bc0' },
  { name: 'Outros', value: 350, percentage: 13, color: '#78909c' },
];

export const essentialBreakdown = {
  essential: 75,
  nonEssential: 25,
  essentialValue: 1760,
  nonEssentialValue: 585,
};

export const financialSummary: FinancialSummary = {
  totalBalance: 2485,
  totalIncome: 4830,
  totalExpense: 2345,
  savingsRate: 51.4,
  essentialExpenses: 1760,
  nonEssentialExpenses: 585,
};

export const forecast: Forecast = {
  nextMonth: 5200,
  trend: 'up',
  percentage: 8,
  alert: 'Aumento esperado em receitas',
};

export const recentTransactions = transactions.slice(0, 10);
