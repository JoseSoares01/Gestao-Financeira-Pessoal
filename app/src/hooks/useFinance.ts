import { useState, useEffect, useCallback } from 'react';
import type { Transaction, PeriodFilter, FinancialSummary, MonthlyData, CategoryData } from '@/types';
import * as api from '@/services/api';

export function useFinance() {
  const [period, setPeriod] = useState<PeriodFilter>('month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    savingsRate: 0,
    essentialExpenses: 0,
    nonEssentialExpenses: 0,
  });
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsData, summaryData, monthlyData, categoriesData] = await Promise.all([
        api.getTransactions(),
        api.getSummary(period),
        api.getMonthlyData(),
        api.getCategories(),
      ]);

      setTransactions(transactionsData);
      setSummary(summaryData);
      setChartData(monthlyData);
      setCategoryBreakdown(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Initial load and when period changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter transactions by period
  const filteredTransactions = transactions.filter(t => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const date = new Date(t.date);

    switch (period) {
      case 'day':
        return date.toDateString() === now.toDateString();
      case 'month':
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      case 'semester':
        const semesterStart = currentMonth < 6 ? 0 : 6;
        return date.getFullYear() === currentYear && date.getMonth() >= semesterStart && date.getMonth() < semesterStart + 6;
      case 'year':
        return date.getFullYear() === currentYear;
      default:
        return true;
    }
  });

  // Add new transaction
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await api.createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      // Reload summary after adding
      const newSummary = await api.getSummary(period);
      setSummary(newSummary);
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar transação');
      throw err;
    }
  }, [period]);

  // Update transaction
  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    try {
      const updated = await api.updateTransaction(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
      // Reload summary after updating
      const newSummary = await api.getSummary(period);
      setSummary(newSummary);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar transação');
      throw err;
    }
  }, [period]);

  // Delete transaction
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      // Reload summary after deleting
      const newSummary = await api.getSummary(period);
      setSummary(newSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir transação');
      throw err;
    }
  }, [period]);

  // Essential vs Non-essential breakdown
  const essentialData = {
    essential: summary.essentialExpenses > 0 && summary.totalExpense > 0 
      ? Math.round((summary.essentialExpenses / summary.totalExpense) * 100) 
      : 0,
    nonEssential: summary.nonEssentialExpenses > 0 && summary.totalExpense > 0 
      ? Math.round((summary.nonEssentialExpenses / summary.totalExpense) * 100) 
      : 0,
    essentialValue: summary.essentialExpenses,
    nonEssentialValue: summary.nonEssentialExpenses,
  };

  // Forecast data (calculated from summary)
  const forecastData = {
    nextMonth: Math.round(summary.totalBalance * 1.1),
    trend: summary.totalBalance > 0 ? 'up' as const : 'down' as const,
    percentage: 8,
    alert: 'Aumento esperado em receitas',
  };

  const periodLabel = (() => {
    switch (period) {
      case 'day':
        return 'Hoje';
      case 'month':
        return 'Este Mês';
      case 'semester':
        return 'Este Semestre';
      case 'year':
        return 'Este Ano';
      default:
        return 'Período';
    }
  })();

  return {
    period,
    setPeriod,
    periodLabel,
    transactions: filteredTransactions,
    allTransactions: transactions,
    summary,
    chartData,
    categoryBreakdown,
    essentialData,
    forecastData,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshData: loadData,
  };
}
