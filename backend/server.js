const express = require('express');
const cors = require('cors');

// Inicializar Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Mock data
const mockTransactions = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    description: 'Salário',
    amount: 3000,
    type: 'income',
    category: 'Salário',
    paymentMethod: 'Transferência',
    isEssential: true
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0],
    description: 'Aluguel',
    amount: 1200,
    type: 'expense',
    category: 'Moradia',
    paymentMethod: 'Transferência',
    isEssential: true
  },
  {
    id: '3',
    date: new Date().toISOString().split('T')[0],
    description: 'Supermercado',
    amount: 250,
    type: 'expense',
    category: 'Alimentação',
    paymentMethod: 'Cartão',
    isEssential: true
  }
];

const mockCategories = [
  { name: 'Salário', value: 3000, percentage: 100, color: '#10b981' },
  { name: 'Moradia', value: 1200, percentage: 48, color: '#ef4444' },
  { name: 'Alimentação', value: 250, percentage: 10, color: '#f59e0b' }
];

const mockMonthlyData = [
  { month: 'Jan', income: 3000, expense: 1800, balance: 1200 },
  { month: 'Fev', income: 3000, expense: 1750, balance: 1250 },
  { month: 'Mar', income: 3000, expense: 1900, balance: 1100 },
  { month: 'Abr', income: 3000, expense: 1650, balance: 1350 },
  { month: 'Mai', income: 3000, expense: 1800, balance: 1200 },
  { month: 'Jun', income: 3000, expense: 1700, balance: 1300 }
];

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de Gestão Financeira ativo' });
});

// Transactions routes
app.get('/api/transactions', (req, res) => {
  try {
    res.json({ data: mockTransactions });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

app.get('/api/transactions/:id', (req, res) => {
  try {
    const transaction = mockTransactions.find(t => t.id === req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.json({ data: transaction });
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro ao buscar transação' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const newTransaction = {
      id: Date.now().toString(),
      ...req.body
    };
    mockTransactions.unshift(newTransaction);
    res.status(201).json({ data: newTransaction });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

app.put('/api/transactions/:id', (req, res) => {
  try {
    const idx = mockTransactions.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    mockTransactions[idx] = { ...mockTransactions[idx], ...req.body };
    res.json({ data: mockTransactions[idx] });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  try {
    const idx = mockTransactions.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    const deleted = mockTransactions.splice(idx, 1);
    res.json({ data: deleted[0] });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

// Categories routes
app.get('/api/categories', (req, res) => {
  try {
    res.json({ data: mockCategories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Summary routes
app.get('/api/summary', (req, res) => {
  try {
    const period = req.query.period || 'month';
    const totalIncome = mockTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = mockTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      data: {
        totalIncome,
        totalExpense,
        totalBalance: totalIncome - totalExpense,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(2) : 0,
        essentialExpenses: mockTransactions
          .filter(t => t.type === 'expense' && t.isEssential)
          .reduce((sum, t) => sum + t.amount, 0),
        nonEssentialExpenses: mockTransactions
          .filter(t => t.type === 'expense' && !t.isEssential)
          .reduce((sum, t) => sum + t.amount, 0),
        transactionCount: mockTransactions.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar summary:', error);
    res.status(500).json({ error: 'Erro ao buscar summary' });
  }
});

// Monthly data routes
app.get('/api/monthly-data', (req, res) => {
  try {
    res.json({ data: mockMonthlyData });
  } catch (error) {
    console.error('Erro ao buscar dados mensais:', error);
    res.status(500).json({ error: 'Erro ao buscar dados mensais' });
  }
});

// Goals routes
app.get('/api/goals', (req, res) => {
  try {
    res.json({ data: [] });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    res.status(500).json({ error: 'Erro ao buscar metas' });
  }
});

app.post('/api/goals', (req, res) => {
  try {
    const newGoal = {
      id: Date.now().toString(),
      ...req.body
    };
    res.status(201).json({ data: newGoal });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ error: 'Erro ao criar meta' });
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
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
