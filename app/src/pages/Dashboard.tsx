import { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { 
  Plus, 
  Download, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, Area, AreaChart as RechartsAreaChart } from 'recharts';
import * as XLSX from 'xlsx';
import { useFinance } from '../hooks/useFinance';
import type { PeriodFilter } from '../types';

const periodOptions = [
  { id: 'day' as PeriodFilter, label: 'Dia', icon: CalendarCheck },
  { id: 'month' as PeriodFilter, label: 'Mês', icon: CalendarDays },
  { id: 'semester' as PeriodFilter, label: 'Semestre', icon: CalendarRange },
  { id: 'year' as PeriodFilter, label: 'Ano', icon: Calendar },
];

const incomeCategories = ['Salário', 'Bônus', 'Freelance', 'Investimentos', 'Outros'];
const expenseCategories = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Outros'];

const categoryIcons: Record<string, string> = {
  'Salário': '💰', 'Bônus': '🎁', 'Freelance': '💼', 'Investimentos': '📈', 'Outros': '➕',
  'Moradia': '🏠', 'Alimentação': '🍽️', 'Transporte': '🚗', 'Saúde': '❤️', 'Lazer': '🎮', 'Educação': '📚',
};

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    isEssential: false,
    paymentMethod: 'Cartão',
  });

  const { 
    period, 
    setPeriod, 
    periodLabel, 
    transactions, 
    summary, 
    chartData, 
    categoryBreakdown, 
    essentialData,
    forecastData,
    loading,
    error,
    addTransaction,
    refreshData
  } = useFinance();

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const handleAddTransaction = async () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.category) {
      setIsSubmitting(true);
      try {
        await addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: newTransaction.description,
          amount: parseFloat(newTransaction.amount),
          type: newTransaction.type,
          category: newTransaction.category,
          isEssential: newTransaction.isEssential,
          paymentMethod: newTransaction.paymentMethod,
        });
        setNewTransaction({ description: '', amount: '', type: 'expense', category: '', isEssential: false, paymentMethod: 'Cartão' });
        setShowModal(false);
      } catch (err) {
        console.error('Error adding transaction:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const downloadExcel = () => {
    const excelData = transactions.map(t => ({
      'Data': t.date,
      'Descrição': t.description,
      'Categoria': t.category,
      'Tipo': t.type === 'income' ? 'Receita' : 'Despesa',
      'Essencial': t.isEssential === undefined ? '-' : (t.isEssential ? 'Sim' : 'Não'),
      'Método': t.paymentMethod,
      'Valor (€)': t.type === 'income' ? t.amount : -t.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 12 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');
    
    const summaryData = [
      { 'Métrica': 'Saldo Total', 'Valor': `€ ${summary.totalBalance.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}` },
      { 'Métrica': 'Total Receitas', 'Valor': `€ ${summary.totalIncome.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}` },
      { 'Métrica': 'Total Despesas', 'Valor': `€ ${summary.totalExpense.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}` },
      { 'Métrica': 'Taxa de Economia', 'Valor': `${summary.savingsRate.toFixed(1)}%` },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');

    XLSX.writeFile(wb, `controle_financeiro_jose_luiza_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
  };

  const chartDataWithTrends = chartData.map((item, index, arr) => {
    const incomeTrend = arr.slice(0, index + 1).reduce((sum, d) => sum + d.income, 0) / (index + 1);
    const expenseTrend = arr.slice(0, index + 1).reduce((sum, d) => sum + d.expense, 0) / (index + 1);
    return { ...item, incomeTrend, expenseTrend };
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Erro ao carregar dados</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={refreshData} variant="outline-danger">
              <RefreshCw size={18} className="me-2" />
              Tentar novamente
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in ${animated ? '' : 'opacity-0'}`}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="page-title">Controle Financeiro</h1>
          <p className="page-subtitle">José Luiza - Acompanhe suas finanças com clareza e controle</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <div className="period-filter">
            {periodOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  className={`period-btn ${period === opt.id ? 'active' : ''}`}
                  onClick={() => setPeriod(opt.id)}
                >
                  <Icon size={16} />
                  <span className="d-none d-sm-inline">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <Button variant="outline-secondary" onClick={downloadExcel} className="btn-outline-custom">
            <Download size={18} />
            <span className="d-none d-md-inline">Excel</span>
          </Button>
          <Button onClick={() => setShowModal(true)} className="btn-primary-custom">
            <Plus size={18} />
            <span className="d-none d-md-inline">Nova</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <div className="custom-card metric-card">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <div className="metric-content">
              <div className="metric-label">Saldo Total</div>
              <div className="metric-value">€ {summary.totalBalance.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
              <div className="metric-subtitle">{periodLabel}</div>
              <div className="metric-trend up">
                <TrendingUp size={14} /> +5,2%
              </div>
            </div>
            <div className="metric-icon-wrapper primary">
              <Wallet size={22} />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <div className="custom-card metric-card">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <div className="metric-content">
              <div className="metric-label">Receitas</div>
              <div className="metric-value">€ {summary.totalIncome.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
              <div className="metric-subtitle">Salário + Bônus + Freelance</div>
              <div className="metric-trend up">
                <TrendingUp size={14} /> +8,4%
              </div>
            </div>
            <div className="metric-icon-wrapper success">
              <TrendingUp size={22} />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <div className="custom-card metric-card">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <div className="metric-content">
              <div className="metric-label">Despesas</div>
              <div className="metric-value">€ {summary.totalExpense.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
              <div className="metric-subtitle">Essencial: € {summary.essentialExpenses} | Não: € {summary.nonEssentialExpenses}</div>
              <div className="metric-trend down">
                <TrendingDown size={14} /> -3,1%
              </div>
            </div>
            <div className="metric-icon-wrapper danger">
              <TrendingDown size={22} />
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <div className="custom-card metric-card">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <div className="metric-content">
              <div className="metric-label">Taxa de Economia</div>
              <div className="metric-value">{summary.savingsRate.toFixed(1)}%</div>
              <div className="metric-subtitle">Meta: 50%</div>
              <div className="metric-trend up">
                <TrendingUp size={14} /> +4,5%
              </div>
            </div>
            <div className="metric-icon-wrapper warning">
              <PiggyBank size={22} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <h5 className="mb-3 text-white">Receitas vs Despesas</h5>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartDataWithTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7cb342" />
                      <stop offset="100%" stopColor="#558b2f" />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef5350" />
                      <stop offset="100%" stopColor="#c62828" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d4a2d" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#7a8a7a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a8a7a', fontSize: 12 }} tickFormatter={(v) => `€${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: '#1a2e1a', border: '1px solid #2d4a2d', borderRadius: 8 }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => `€ ${value.toLocaleString('pt-PT')}`}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="income" name="Receitas" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="expense" name="Despesas" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} barSize={28} />
                  <Line type="monotone" dataKey="incomeTrend" name="Tendência Receitas" stroke="#7cb342" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="expenseTrend" name="Tendência Despesas" stroke="#ef5350" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <h5 className="mb-3 text-white">Evolução do Saldo</h5>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7cb342" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7cb342" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d4a2d" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#7a8a7a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a8a7a', fontSize: 12 }} tickFormatter={(v) => `€${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: '#1a2e1a', border: '1px solid #2d4a2d', borderRadius: 8 }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => `€ ${value.toLocaleString('pt-PT')}`}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#7cb342" strokeWidth={3} fill="url(#balanceGradient)" />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* Categories & Donut */}
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <h5 className="mb-4 text-white">Despesas por Categoria</h5>
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="mb-4">
                <div className="category-header">
                  <div className="category-name">
                    <span className="category-dot" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </div>
                  <div className="category-values">
                    <span className="category-amount">€ {cat.value}</span>
                    <span className="category-percent">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="progress-custom">
                  <div 
                    className="progress-bar-custom" 
                    style={{ 
                      width: `${cat.percentage}%`, 
                      backgroundColor: cat.color,
                      boxShadow: `0 0 10px ${cat.color}40`
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col lg={6}>
          <div className="custom-card text-center">
            <div className="grid-pattern" />
            <div className="gradient-glow top-right" />
            <h5 className="mb-3 text-white">Essencial vs Não Essencial</h5>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Total', essential: essentialData.essentialValue, nonEssential: essentialData.nonEssentialValue }]} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip 
                    contentStyle={{ background: '#1a2e1a', border: '1px solid #2d4a2d', borderRadius: 8 }}
                    formatter={(value: number, name: string) => [`€ ${value.toLocaleString('pt-PT')}`, name === 'essential' ? 'Essencial' : 'Não Essencial']}
                  />
                  <Bar dataKey="essential" stackId="a" fill="#7cb342" radius={[4, 0, 0, 4]} name="Essencial" barSize={40} />
                  <Bar dataKey="nonEssential" stackId="a" fill="#ffa726" radius={[0, 4, 4, 0]} name="Não Essencial" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="d-flex justify-content-center gap-4 mt-3">
              <div className="d-flex align-items-center gap-2">
                <span className="category-dot" style={{ backgroundColor: '#7cb342' }} />
                <span className="text-white">Essencial ({essentialData.essential}%)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="category-dot" style={{ backgroundColor: '#ffa726' }} />
                <span className="text-white">Não Essencial ({essentialData.nonEssential}%)</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Forecast */}
      <div className="custom-card mb-4" style={{ borderColor: 'rgba(124, 179, 66, 0.3)' }}>
        <div className="grid-pattern" />
        <div className="gradient-glow top-right" style={{ background: 'radial-gradient(circle, rgba(124, 179, 66, 0.2) 0%, transparent 70%)' }} />
        <div className="d-flex align-items-center gap-2 mb-3">
          <span style={{ color: '#7cb342' }}>✨</span>
          <h5 className="text-white mb-0">Previsão Financeira</h5>
        </div>
        <p className="text-muted mb-4">Projeção para o próximo mês baseada nos últimos 3 meses</p>
        <Row className="g-3">
          <Col md={4}>
            <div className="p-3 rounded-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
              <p className="text-muted small mb-1">Saldo Estimado</p>
              <p className="text-white fs-4 fw-bold">€ {forecastData.nextMonth.toLocaleString('pt-PT')}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-3 rounded-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
              <p className="text-muted small mb-1">Tendência</p>
              <div className="d-flex align-items-center gap-2">
                <TrendingUp size={18} color="#4caf50" />
                <span className="text-success fw-semibold">Crescente</span>
              </div>
              <p className="text-muted small mt-1">+{forecastData.percentage}% vs mês anterior</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-3 rounded-3" style={{ background: 'rgba(124, 179, 66, 0.1)', border: '1px solid rgba(124, 179, 66, 0.2)' }}>
              <div className="d-flex align-items-start gap-2">
                <span style={{ color: '#7cb342' }}>⚠️</span>
                <div>
                  <p className="text-xs text-primary font-medium mb-1" style={{ color: '#7cb342' }}>Alerta</p>
                  <p className="text-sm text-white">{forecastData.alert}</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Recent Transactions */}
      <div className="custom-card">
        <div className="grid-pattern" />
        <div className="gradient-glow top-right" />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="text-white mb-0">Transações Recentes</h5>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={downloadExcel} className="btn-outline-custom">
              <Download size={16} />
              Excel
            </Button>
            <Button variant="link" className="text-decoration-none" style={{ color: '#7cb342' }}>Ver todas</Button>
          </div>
        </div>
        <div>
          {transactions.slice(0, 6).map((t) => (
            <div key={t.id} className="transaction-item">
              <div className={`transaction-icon ${t.type}`}>
                {categoryIcons[t.category] || (t.type === 'income' ? '💰' : '💸')}
              </div>
              <div className="transaction-info">
                <div className="transaction-title">{t.description}</div>
                <div className="transaction-meta">
                  <span>{t.category}</span>
                  <span>•</span>
                  <span>{formatDate(t.date)}</span>
                  {t.isEssential !== undefined && (
                    <>
                      <span>•</span>
                      <span style={{ color: t.isEssential ? '#4caf50' : '#ffa726' }}>
                        {t.isEssential ? 'Essencial' : 'Não essencial'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className={`transaction-amount ${t.type}`}>
                {t.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {t.type === 'income' ? '+' : '-'}€ {t.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="modal-content-custom">
        <Modal.Header closeButton className="modal-header-custom border-0">
          <Modal.Title className="text-white">Nova Transação</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Descrição</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Supermercado"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Valor (€)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="0,00"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Tipo</Form.Label>
              <Form.Select 
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'income' | 'expense', category: ''})}
                className="form-control-custom"
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Categoria</Form.Label>
              <Form.Select 
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                className="form-control-custom"
              >
                <option value="">Selecione...</option>
                {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
            {newTransaction.type === 'expense' && (
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">Essencial?</Form.Label>
                <Form.Select 
                  value={newTransaction.isEssential ? 'yes' : 'no'}
                  onChange={(e) => setNewTransaction({...newTransaction, isEssential: e.target.value === 'yes'})}
                  className="form-control-custom"
                >
                  <option value="yes">Sim</option>
                  <option value="no">Não</option>
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom border-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="btn-outline-custom">
            Cancelar
          </Button>
          <Button onClick={handleAddTransaction} className="btn-primary-custom" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Salvando...
              </>
            ) : (
              'Adicionar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
