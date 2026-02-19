import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Plus, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { essentialBreakdown } from '../data/mockData';

const incomeCategories = [
  { name: 'Salário', color: '#7cb342', icon: '💰', count: 6 },
  { name: 'Bônus', color: '#aed581', icon: '🎁', count: 2 },
  { name: 'Freelance', color: '#558b2f', icon: '💼', count: 3 },
  { name: 'Investimentos', color: '#4caf50', icon: '📈', count: 1 },
  { name: 'Outros', color: '#81c784', icon: '➕', count: 1 },
];

const expenseCategories = [
  { name: 'Moradia', color: '#ef5350', icon: '🏠', count: 6, budget: 1000, spent: 950 },
  { name: 'Alimentação', color: '#ff7043', icon: '🍽️', count: 8, budget: 800, spent: 700 },
  { name: 'Transporte', color: '#ffa726', icon: '🚗', count: 5, budget: 300, spent: 265 },
  { name: 'Saúde', color: '#42a5f5', icon: '❤️', count: 3, budget: 200, spent: 140 },
  { name: 'Lazer', color: '#ab47bc', icon: '🎮', count: 4, budget: 250, spent: 200 },
  { name: 'Educação', color: '#5c6bc0', icon: '📚', count: 2, budget: 150, spent: 120 },
  { name: 'Outros', color: '#78909c', icon: '📝', count: 3, budget: 400, spent: 350 },
];

export default function Categories() {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const donutData = [
    { name: 'Essencial', value: essentialBreakdown.essentialValue, color: '#7cb342' },
    { name: 'Não Essencial', value: essentialBreakdown.nonEssentialValue, color: '#ffa726' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-subtitle">Organize e gerencie suas categorias de receitas e despesas</p>
        </div>
        <Button className="btn-primary-custom">
          <Plus size={18} />
          <span className="d-none d-md-inline">Nova Categoria</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <Button 
          variant={activeTab === 'expense' ? 'primary' : 'outline-secondary'}
          onClick={() => setActiveTab('expense')}
          className={activeTab === 'expense' ? 'btn-primary-custom' : 'btn-outline-custom'}
        >
          <TrendingDown size={18} className="me-2" />
          Despesas
        </Button>
        <Button 
          variant={activeTab === 'income' ? 'primary' : 'outline-secondary'}
          onClick={() => setActiveTab('income')}
          className={activeTab === 'income' ? 'btn-primary-custom' : 'btn-outline-custom'}
        >
          <TrendingUp size={18} className="me-2" />
          Receitas
        </Button>
      </div>

      {activeTab === 'expense' ? (
        <Row className="g-3">
          {/* Categories List */}
          <Col lg={8}>
            <div className="custom-card">
              <div className="grid-pattern" />
              <div className="gradient-glow top-right" />
              <h5 className="mb-4 text-white">Categorias de Despesa</h5>
              {expenseCategories.map((cat) => {
                const percentage = (cat.spent / cat.budget) * 100;
                return (
                  <div key={cat.name} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                        <span className="text-white fw-medium">{cat.name}</span>
                        <span className="text-muted small">({cat.count} transações)</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-white">€ {cat.spent}</span>
                        <span className="text-muted">/ € {cat.budget}</span>
                        <Button variant="link" className="p-1" style={{ color: '#7cb342' }}>
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="progress-custom">
                      <div 
                        className="progress-bar-custom" 
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`, 
                          backgroundColor: percentage > 90 ? '#ef5350' : cat.color,
                        }} 
                      />
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <span className="text-muted small">{percentage.toFixed(0)}% do orçamento</span>
                      <span className="text-muted small">Restante: € {(cat.budget - cat.spent).toLocaleString('pt-PT')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>

          {/* Distribution Chart */}
          <Col lg={4}>
            <div className="custom-card text-center">
              <div className="grid-pattern" />
              <h5 className="mb-3 text-white">Distribuição</h5>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1a2e1a', border: '1px solid #2d4a2d', borderRadius: 8 }}
                      formatter={(value: number) => `€ ${value.toLocaleString('pt-PT')}`}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 p-3 rounded-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span>Total em Despesas</span>
                </div>
                <div className="text-white fs-5 fw-bold">
                  € {(essentialBreakdown.essentialValue + essentialBreakdown.nonEssentialValue).toLocaleString('pt-PT')}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="g-3">
          <Col lg={8}>
            <div className="custom-card">
              <div className="grid-pattern" />
              <div className="gradient-glow top-right" />
              <h5 className="mb-4 text-white">Categorias de Receita</h5>
              <Row className="g-3">
                {incomeCategories.map((cat) => (
                  <Col md={6} key={cat.name}>
                    <div className="p-3 rounded-3" style={{ background: 'rgba(26, 46, 26, 0.5)', border: '1px solid #2d4a2d' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                          <div>
                            <div className="text-white fw-medium">{cat.name}</div>
                            <div className="text-muted small">{cat.count} transações</div>
                          </div>
                        </div>
                        <Button variant="link" className="p-1" style={{ color: '#7cb342' }}>
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
          <Col lg={4}>
            <div className="custom-card">
              <div className="grid-pattern" />
              <h5 className="mb-3 text-white">Resumo</h5>
              <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                <div className="text-muted small mb-1">Total de Categorias</div>
                <div className="text-white fs-4 fw-bold">{incomeCategories.length}</div>
              </div>
              <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                <div className="text-muted small mb-1">Total de Transações</div>
                <div className="text-white fs-4 fw-bold">{incomeCategories.reduce((sum, c) => sum + c.count, 0)}</div>
              </div>
              <div className="p-3 rounded-3" style={{ background: 'rgba(124, 179, 66, 0.1)', border: '1px solid rgba(124, 179, 66, 0.2)' }}>
                <div className="text-muted small mb-1" style={{ color: '#7cb342' }}>Categoria Principal</div>
                <div className="text-white fs-5 fw-bold">Salário</div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}
