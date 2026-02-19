import { useState } from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { Plus, Target, TrendingUp, PiggyBank, Edit2, Trash2 } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  deadline: string;
}

const initialGoals: Goal[] = [
  { id: '1', name: 'Fundo de Emergência', target: 10000, current: 6500, icon: '🛡️', color: '#7cb342', deadline: '2024-12-31' },
  { id: '2', name: 'Viagem de Férias', target: 3000, current: 1200, icon: '✈️', color: '#42a5f5', deadline: '2024-08-15' },
  { id: '3', name: 'Novo Carro', target: 25000, current: 8000, icon: '🚗', color: '#ffa726', deadline: '2025-06-30' },
  { id: '4', name: 'Entrada Casa', target: 50000, current: 15000, icon: '🏠', color: '#ab47bc', deadline: '2026-01-01' },
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', deadline: '', icon: '🎯', color: '#7cb342' });

  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: parseFloat(newGoal.current) || 0,
        icon: newGoal.icon,
        color: newGoal.color,
        deadline: newGoal.deadline,
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: '', target: '', current: '', deadline: '', icon: '🎯', color: '#7cb342' });
      setShowModal(false);
    }
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} dias restantes` : 'Prazo vencido';
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="page-title">Metas Financeiras</h1>
          <p className="page-subtitle">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Button className="btn-primary-custom" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span className="d-none d-md-inline">Nova Meta</span>
        </Button>
      </div>

      {/* Overall Progress */}
      <div className="custom-card mb-4" style={{ borderColor: 'rgba(124, 179, 66, 0.3)' }}>
        <div className="grid-pattern" />
        <div className="gradient-glow top-right" style={{ background: 'radial-gradient(circle, rgba(124, 179, 66, 0.2) 0%, transparent 70%)' }} />
        <Row className="align-items-center">
          <Col md={4}>
            <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
              <div className="p-3 rounded-3" style={{ background: 'rgba(124, 179, 66, 0.15)' }}>
                <Target size={32} color="#7cb342" />
              </div>
              <div>
                <div className="text-muted small">Progresso Geral</div>
                <div className="text-white fs-3 fw-bold">{overallProgress.toFixed(1)}%</div>
              </div>
            </div>
          </Col>
          <Col md={8}>
            <div className="progress-custom" style={{ height: 16 }}>
              <div 
                className="progress-bar-custom" 
                style={{ 
                  width: `${Math.min(overallProgress, 100)}%`, 
                  background: 'linear-gradient(90deg, #7cb342 0%, #aed581 100%)',
                }} 
              />
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span className="text-muted small">Guardado: <span className="text-white">€ {totalSaved.toLocaleString('pt-PT')}</span></span>
              <span className="text-muted small">Meta: <span className="text-white">€ {totalTarget.toLocaleString('pt-PT')}</span></span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Goals Grid */}
      <Row className="g-3">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <Col md={6} xl={4} key={goal.id}>
              <div className="custom-card h-100">
                <div className="grid-pattern" />
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="p-2 rounded-3"
                      style={{ background: `${goal.color}25`, fontSize: '1.5rem' }}
                    >
                      {goal.icon}
                    </div>
                    <div>
                      <div className="text-white fw-semibold">{goal.name}</div>
                      <div className="text-muted small">{getDaysRemaining(goal.deadline)}</div>
                    </div>
                  </div>
                  <div className="d-flex gap-1">
                    <Button variant="link" className="p-1" style={{ color: '#7cb342' }}>
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="link" className="p-1" style={{ color: '#ef5350' }} onClick={() => handleDelete(goal.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white fs-5 fw-bold">€ {goal.current.toLocaleString('pt-PT')}</span>
                    <span className="text-muted">/ € {goal.target.toLocaleString('pt-PT')}</span>
                  </div>
                  <div className="progress-custom">
                    <div 
                      className="progress-bar-custom" 
                      style={{ 
                        width: `${Math.min(progress, 100)}%`, 
                        backgroundColor: goal.color,
                      }} 
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <span className="text-muted small">{progress.toFixed(1)}% completo</span>
                    <span className="text-muted small">Faltam: € {(goal.target - goal.current).toLocaleString('pt-PT')}</span>
                  </div>
                </div>

                <div className="p-2 rounded-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                  <div className="text-muted small">Prazo: <span className="text-white">{formatDate(goal.deadline)}</span></div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Quick Stats */}
      <Row className="g-3 mt-1">
        <Col md={4}>
          <div className="custom-card text-center">
            <div className="grid-pattern" />
            <PiggyBank size={28} color="#7cb342" className="mb-2" />
            <div className="text-muted small">Total Guardado</div>
            <div className="text-white fs-4 fw-bold">€ {totalSaved.toLocaleString('pt-PT')}</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="custom-card text-center">
            <div className="grid-pattern" />
            <Target size={28} color="#42a5f5" className="mb-2" />
            <div className="text-muted small">Meta Total</div>
            <div className="text-white fs-4 fw-bold">€ {totalTarget.toLocaleString('pt-PT')}</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="custom-card text-center">
            <div className="grid-pattern" />
            <TrendingUp size={28} color="#ffa726" className="mb-2" />
            <div className="text-muted small">Metas Ativas</div>
            <div className="text-white fs-4 fw-bold">{goals.length}</div>
          </div>
        </Col>
      </Row>

      {/* Add Goal Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="modal-content-custom">
        <Modal.Header closeButton className="modal-header-custom border-0">
          <Modal.Title className="text-white">Nova Meta</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Nome da Meta</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Viagem de Férias"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="form-control-custom"
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Valor Meta (€)</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="0,00"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Valor Atual (€)</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="0,00"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">Prazo</Form.Label>
              <Form.Control 
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                className="form-control-custom"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom border-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="btn-outline-custom">
            Cancelar
          </Button>
          <Button onClick={handleAddGoal} className="btn-primary-custom">
            Criar Meta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
