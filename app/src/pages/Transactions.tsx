import { useState } from 'react';
import { Row, Col, Button, Form, Table, Badge } from 'react-bootstrap';
import { Plus, Download, Search, Trash2, Edit2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { transactions } from '../data/mockData';
import type { Transaction } from '../types';

const categoryIcons: Record<string, string> = {
  'Salário': '💰', 'Bônus': '🎁', 'Freelance': '💼', 'Investimentos': '📈', 'Outros': '➕',
  'Moradia': '🏠', 'Alimentação': '🍽️', 'Transporte': '🚗', 'Saúde': '❤️', 'Lazer': '🎮', 'Educação': '📚',
};

export default function Transactions() {
  const [transactionList, setTransactionList] = useState<Transaction[]>(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactionList.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const downloadExcel = () => {
    const excelData = filteredTransactions.map(t => ({
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
    XLSX.writeFile(wb, `transacoes_jose_luiza_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDelete = (id: string) => {
    setTransactionList(transactionList.filter(t => t.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">Gerencie todas as suas transações financeiras</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={downloadExcel} className="btn-outline-custom">
            <Download size={18} />
            <span className="d-none d-md-inline">Exportar</span>
          </Button>
          <Button className="btn-primary-custom">
            <Plus size={18} />
            <span className="d-none d-md-inline">Nova</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="custom-card mb-4">
        <div className="grid-pattern" />
        <Row className="g-3 align-items-end">
          <Col md={5}>
            <Form.Label className="form-label-custom">Pesquisar</Form.Label>
            <div className="position-relative">
              <Search size={18} className="position-absolute" style={{ left: 12, top: 12, color: '#7a8a7a' }} />
              <Form.Control 
                type="text" 
                placeholder="Buscar por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control-custom ps-5"
              />
            </div>
          </Col>
          <Col md={4}>
            <Form.Label className="form-label-custom">Filtrar por Tipo</Form.Label>
            <div className="d-flex gap-2">
              <Button 
                variant={filterType === 'all' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'btn-primary-custom' : 'btn-outline-custom'}
                style={{ flex: 1 }}
              >
                Todas
              </Button>
              <Button 
                variant={filterType === 'income' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('income')}
                className={filterType === 'income' ? 'btn-primary-custom' : 'btn-outline-custom'}
                style={{ flex: 1 }}
              >
                Receitas
              </Button>
              <Button 
                variant={filterType === 'expense' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('expense')}
                className={filterType === 'expense' ? 'btn-primary-custom' : 'btn-outline-custom'}
                style={{ flex: 1 }}
              >
                Despesas
              </Button>
            </div>
          </Col>
          <Col md={3} className="text-md-end">
            <div className="text-muted small">
              Total: <span className="text-white fw-semibold">{filteredTransactions.length}</span> transações
            </div>
          </Col>
        </Row>
      </div>

      {/* Transactions Table */}
      <div className="custom-card p-0 overflow-hidden">
        <div className="grid-pattern" />
        <div className="table-responsive">
          <Table className="custom-table mb-0">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Essencial</th>
                <th className="text-end">Valor</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} style={{ backgroundColor: 'rgba(45, 74, 45, 0.4)' }}>
                  <td>{formatDate(t.date)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>{categoryIcons[t.category] || '💰'}</span>
                      <span>{t.description}</span>
                    </div>
                  </td>
                  <td>
                    <Badge bg="dark" style={{ background: 'rgba(45, 74, 45, 0.5)', fontWeight: 500 }}>
                      {t.category}
                    </Badge>
                  </td>
                  <td>
                    <Badge 
                      bg={t.type === 'income' ? 'success' : 'danger'}
                      style={{ 
                        background: t.type === 'income' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 83, 80, 0.2)',
                        color: t.type === 'income' ? '#4caf50' : '#ef5350',
                        fontWeight: 500
                      }}
                    >
                      {t.type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </td>
                  <td>
                    {t.isEssential === undefined ? (
                      <span className="text-muted">-</span>
                    ) : (
                      <Badge 
                        bg={t.isEssential ? 'success' : 'warning'}
                        style={{ 
                          background: t.isEssential ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 167, 38, 0.2)',
                          color: t.isEssential ? '#4caf50' : '#ffa726',
                          fontWeight: 500
                        }}
                      >
                        {t.isEssential ? 'Sim' : 'Não'}
                      </Badge>
                    )}
                  </td>
                  <td className="text-end">
                    <span style={{ color: t.type === 'income' ? '#4caf50' : '#ef5350', fontWeight: 600 }}>
                      {t.type === 'income' ? '+' : '-'}€ {t.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="text-center">
                    <Button variant="link" className="p-1 me-2" style={{ color: '#7cb342' }}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="link" className="p-1" style={{ color: '#ef5350' }} onClick={() => handleDelete(t.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted mb-2">🔍</div>
            <div className="text-muted">Nenhuma transação encontrada</div>
          </div>
        )}
      </div>
    </div>
  );
}
