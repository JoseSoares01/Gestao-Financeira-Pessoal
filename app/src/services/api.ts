import type { Transaction, Goal } from '../types';

// Base URL do backend (SEM /api)
// Em produção, configure VITE_API_URL no Render com: https://SEU-BACKEND.onrender.com
// Em dev, cai no localhost
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://gestao-financeira-pessoal-7s6o.onrender.com';

// Todas as rotas do seu backend começam com /api
const API_URL = `${BASE_URL}/api`;

// Helper function for API calls
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ==================== TRANSACTIONS API ====================

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetchAPI('/transactions');
  return response.data;
}

export async function getTransactionById(id: string): Promise<Transaction> {
  const response = await fetchAPI(`/transactions/${id}`);
  return response.data;
}

export async function createTransaction(
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const response = await fetchAPI('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
  return response.data;
}

export async function updateTransaction(
  id: string,
  transaction: Partial<Transaction>
): Promise<Transaction> {
  const response = await fetchAPI(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
  return response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await fetchAPI(`/transactions/${id}`, {
    method: 'DELETE',
  });
}

// ==================== SUMMARY API ====================

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  savingsRate: number;
  essentialExpenses: number;
  nonEssentialExpenses: number;
  transactionCount: number;
}

export async function getSummary(period?: string): Promise<Summary> {
  const query = period ? `?period=${period}` : '';
  const response = await fetchAPI(`/summary${query}`);
  return response.data;
}

// ==================== CATEGORIES API ====================

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export async function getCategories(): Promise<CategoryData[]> {
  const response = await fetchAPI('/categories');
  return response.data;
}

// ==================== MONTHLY DATA API ====================

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export async function getMonthlyData(): Promise<MonthlyData[]> {
  const response = await fetchAPI('/monthly-data');
  return response.data;
}

// ==================== GOALS API ====================

export async function getGoals(): Promise<Goal[]> {
  const response = await fetchAPI('/goals');
  return response.data;
}

export async function createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
  const response = await fetchAPI('/goals', {
    method: 'POST',
    body: JSON.stringify(goal),
  });
  return response.data;
}

export async function updateGoal(id: string, goal: Partial<Goal>): Promise<Goal> {
  const response = await fetchAPI(`/goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(goal),
  });
  return response.data;
}

export async function deleteGoal(id: string): Promise<void> {
  await fetchAPI(`/goals/${id}`, {
    method: 'DELETE',
  });
}

// ==================== HEALTH CHECK ====================
// Seu backend tem /health (SEM /api). Então aqui não deve usar fetchAPI.
export async function healthCheck(): Promise<{ ok: boolean; timestamp: string }> {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) throw new Error(`Healthcheck failed: ${response.status}`);
  return response.json();
}