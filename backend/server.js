// backend/server.js
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

// Inicializar Express
const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite chamadas sem Origin (Postman/curl/healthchecks)
      if (!origin) return callback(null, true);

      // Permite apenas origens na allowlist
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true
  })
);

// ⚠️ Express 5: NÃO use app.options('*'...) ou app.options('/*'...)
// O middleware cors() já lida com preflight OPTIONS automaticamente.
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de Gestão Financeira ativo' });
});

// Transactions routes
app.get('/api/transactions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    res.json({ data: data || [] });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

app.get('/api/transactions/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json({ data });
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json({ data });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json({ data });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

// Categories routes
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    // Format categories with value and percentage based on transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('category, amount, type')
      .eq('type', 'expense');

    const categoryMap = {};
    (transactions || []).forEach((t) => {
      if (!categoryMap[t.category]) categoryMap[t.category] = 0;
      categoryMap[t.category] += t.amount;
    });

    const totalExpense = Object.values(categoryMap).reduce((a, b) => a + b, 0);

    const formattedCategories = (data || []).map((cat) => ({
      ...cat,
      value: categoryMap[cat.name] || 0,
      percentage:
        totalExpense > 0
          ? (((categoryMap[cat.name] || 0) / totalExpense) * 100).toFixed(2)
          : 0
    }));

    res.json({ data: formattedCategories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Summary routes
app.get('/api/summary', async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*');

    if (error) throw error;

    const txs = transactions || [];
    const totalIncome = txs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = txs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    res.json({
      data: {
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpense: parseFloat(totalExpense.toFixed(2)),
        totalBalance: parseFloat((totalIncome - totalExpense).toFixed(2)),
        savingsRate:
          totalIncome > 0
            ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(2)
            : 0,
        essentialExpenses: parseFloat(
          txs
            .filter((t) => t.type === 'expense' && t.isEssential)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0)
            .toFixed(2)
        ),
        nonEssentialExpenses: parseFloat(
          txs
            .filter((t) => t.type === 'expense' && !t.isEssential)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0)
            .toFixed(2)
        ),
        transactionCount: txs.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar summary:', error);
    res.status(500).json({ error: 'Erro ao buscar summary' });
  }
});

// Monthly data routes
app.get('/api/monthly-data', async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('date, amount, type');

    if (error) throw error;

    const monthlyMap = {};
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Initialize months (últimos 6 meses)
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthIndex = date.getMonth();
      monthlyMap[months[monthIndex]] = { income: 0, expense: 0 };
    }

    // Populate data from transactions
    (transactions || []).forEach((t) => {
      const date = new Date(t.date);
      const monthName = months[date.getMonth()];

      if (monthlyMap[monthName]) {
        if (t.type === 'income') monthlyMap[monthName].income += parseFloat(t.amount);
        else monthlyMap[monthName].expense += parseFloat(t.amount);
      }
    });

    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      income: parseFloat(data.income.toFixed(2)),
      expense: parseFloat(data.expense.toFixed(2)),
      balance: parseFloat((data.income - data.expense).toFixed(2))
    }));

    res.json({ data: monthlyData });
  } catch (error) {
    console.error('Erro ao buscar dados mensais:', error);
    res.status(500).json({ error: 'Erro ao buscar dados mensais' });
  }
});

// Goals routes
app.get('/api/goals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) throw error;
    res.json({ data: data || [] });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    res.status(500).json({ error: 'Erro ao buscar metas' });
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ error: 'Erro ao criar meta' });
  }
});

app.put('/api/goals/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    res.json({ data });
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    res.status(500).json({ error: 'Erro ao atualizar meta' });
  }
});

app.delete('/api/goals/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    res.json({ data });
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    res.status(500).json({ error: 'Erro ao deletar meta' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log('Allowed origins:', allowedOrigins);
});