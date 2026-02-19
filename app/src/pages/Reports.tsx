import { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Download, Calendar, FileText, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import { monthlyData, categoryData } from '../data/mockData';

const reportTypes = [
  { id: 'monthly', label: 'Mensal', icon: Calendar },
  { id: 'quarterly', label: 'Trimestral', icon: FileText },
  { id: 'yearly', label: 'Anual', icon: BarChart3 },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');

  const downloadReport = () => {
    const data = monthlyData.map(m => ({
      'Mês': m.month,
      'Receitas (€)': m.income,
      'Despesas (€)': m.expense,
      'Saldo (€)': m.balance,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `relatorio_${selectedReport}_${selectedYear}.xlsx`);
  };

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
  const totalBalance = totalIncome - totalExpense;
  const avgMonthlyIncome = totalIncome / monthlyData.length;
  const avgMonthlyExpense = totalExpense / monthlyData.length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="page-title">Relatórios</h1>
          <p className="page-subtitle">Análise detalhada das suas finanças</p>
        </div>
        <Button variant="outline-secondary" onClick={downloadReport} className="btn-outline-custom">
          <Download size={18} />
          <span className="d-none d-md-inline">Exportar Relatório</span>
        </Button>
      </div>

      {/* Report Type Selector */}
      <div className="custom-card mb-4">
        <div className="grid-pattern" />
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Label className="form-label-custom">Tipo de Relatório</Form.Label>
            <div className="d-flex gap-2">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedReport === type.id ? 'primary' : 'outline-secondary'}
                    onClick={() => setSelectedReport(type.id)}
                    className={selectedReport === type.id ? 'btn-primary-custom' : 'btn-outline-custom'}
                    style={{ flex: 1 }}
                  >
                    <Icon size={16} className="me-1" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </Col>
          <Col md={3}>
            <Form.Label className="form-label-custom">Ano</Form.Label>
            <Form.Select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-control-custom"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col sm={6} xl={3}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <div className="text-muted small mb-1">Total Receitas</div>
            <div className="text-white fs-4 fw-bold">€ {totalIncome.toLocaleString('pt-PT')}</div>
            <div className="text-success small mt-1">
              <TrendingUp size={14} className="me-1" />
              Média: € {avgMonthlyIncome.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}/mês
            </div>
          </div>
        </Col>
        <Col sm={6} xl={3}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <div className="text-muted small mb-1">Total Despesas</div>
            <div className="text-white fs-4 fw-bold">€ {totalExpense.toLocaleString('pt-PT')}</div>
            <div className="text-danger small mt-1">
              <TrendingDown size={14} className="me-1" />
              Média: € {avgMonthlyExpense.toLocaleString('pt-PT', { maximumFractionDigits: 0 })}/mês
            </div>
          </div>
        </Col>
        <Col sm={6} xl={3}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <div className="text-muted small mb-1">Saldo Total</div>
            <div className="text-white fs-4 fw-bold">€ {totalBalance.toLocaleString('pt-PT')}</div>
            <div className="small mt-1" style={{ color: totalBalance >= 0 ? '#4caf50' : '#ef5350' }}>
              {totalBalance >= 0 ? '+' : ''}€ {(totalBalance / monthlyData.length).toLocaleString('pt-PT', { maximumFractionDigits: 0 })}/mês
            </div>
          </div>
        </Col>
        <Col sm={6} xl={3}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <div className="text-muted small mb-1">Taxa de Economia</div>
            <div className="text-white fs-4 fw-bold">{((totalBalance / totalIncome) * 100).toFixed(1)}%</div>
            <div className="text-muted small mt-1">Meta: 50%</div>
          </div>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <h5 className="mb-3 text-white">Evolução Mensal</h5>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7cb342" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7cb342" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef5350" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef5350" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d4a2d" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#7a8a7a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7a8a7a', fontSize: 12 }} tickFormatter={(v) => `€${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: '#1a2e1a', border: '1px solid #2d4a2d', borderRadius: 8 }}
                    formatter={(value: number) => `€ ${value.toLocaleString('pt-PT')}`}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="income" name="Receitas" stroke="#7cb342" fill="url(#incomeArea)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" name="Despesas" stroke="#ef5350" fill="url(#expenseArea)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col lg={4}>
          <div className="custom-card">
            <div className="grid-pattern" />
            <h5 className="mb-3 text-white">Despesas por Categoria</h5>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 80, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d4a2d" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#7a8a7a', fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#b8c5b8', fontSize: 11 }} width={70} />
                  <Tooltip 
                    contentStyle={{ background: '#1a2e1a', border: '1px solid #2d4a2d', borderRadius: 8 }}
                    formatter={(value: number) => `€ ${value.toLocaleString('pt-PT')}`}
                  />
                  <Bar dataKey="value" name="Valor" radius={[0, 4, 4, 0]} barSize={20}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* Monthly Breakdown */}
      <div className="custom-card">
        <div className="grid-pattern" />
        <h5 className="mb-4 text-white">Detalhamento Mensal</h5>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th className="text-end">Receitas</th>
                <th className="text-end">Despesas</th>
                <th className="text-end">Saldo</th>
                <th className="text-end">Economia</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m) => {
                const savingsRate = m.income > 0 ? ((m.balance / m.income) * 100).toFixed(1) : '0';
                return (
                  <tr key={m.month}>
                    <td className="text-white fw-medium">{m.month}</td>
                    <td className="text-end" style={{ color: '#4caf50' }}>€ {m.income.toLocaleString('pt-PT')}</td>
                    <td className="text-end" style={{ color: '#ef5350' }}>€ {m.expense.toLocaleString('pt-PT')}</td>
                    <td className="text-end text-white">€ {m.balance.toLocaleString('pt-PT')}</td>
                    <td className="text-end">
                      <span style={{ color: parseFloat(savingsRate) >= 0 ? '#4caf50' : '#ef5350' }}>
                        {savingsRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
