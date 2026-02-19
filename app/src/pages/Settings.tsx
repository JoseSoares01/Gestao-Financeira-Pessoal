import { useState } from 'react';
import { Row, Col, Button, Form, Nav } from 'react-bootstrap';
import { User, Bell, Shield, Globe, Moon, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    name: 'José Luiza',
    email: 'jose@email.com',
    currency: 'EUR',
    language: 'pt',
    notifications: true,
    emailAlerts: true,
    darkMode: true,
    twoFactor: false,
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">Personalize suas preferências e dados da conta</p>
      </div>

      <Row className="g-3">
        {/* Sidebar Tabs */}
        <Col lg={3}>
          <div className="custom-card p-0 overflow-hidden">
            <div className="grid-pattern" />
            <Nav variant="pills" className="flex-column settings-nav">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'profile'} 
                  onClick={() => setActiveTab('profile')}
                  className="d-flex align-items-center gap-2 py-3 px-4"
                  style={{ 
                    color: activeTab === 'profile' ? 'white' : '#b8c5b8',
                    background: activeTab === 'profile' ? 'linear-gradient(135deg, #7cb342 0%, #558b2f 100%)' : 'transparent',
                    borderRadius: 0,
                    borderLeft: activeTab === 'profile' ? '3px solid #7cb342' : '3px solid transparent',
                  }}
                >
                  <User size={18} />
                  Perfil
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'notifications'} 
                  onClick={() => setActiveTab('notifications')}
                  className="d-flex align-items-center gap-2 py-3 px-4"
                  style={{ 
                    color: activeTab === 'notifications' ? 'white' : '#b8c5b8',
                    background: activeTab === 'notifications' ? 'linear-gradient(135deg, #7cb342 0%, #558b2f 100%)' : 'transparent',
                    borderRadius: 0,
                    borderLeft: activeTab === 'notifications' ? '3px solid #7cb342' : '3px solid transparent',
                  }}
                >
                  <Bell size={18} />
                  Notificações
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'security'} 
                  onClick={() => setActiveTab('security')}
                  className="d-flex align-items-center gap-2 py-3 px-4"
                  style={{ 
                    color: activeTab === 'security' ? 'white' : '#b8c5b8',
                    background: activeTab === 'security' ? 'linear-gradient(135deg, #7cb342 0%, #558b2f 100%)' : 'transparent',
                    borderRadius: 0,
                    borderLeft: activeTab === 'security' ? '3px solid #7cb342' : '3px solid transparent',
                  }}
                >
                  <Shield size={18} />
                  Segurança
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'preferences'} 
                  onClick={() => setActiveTab('preferences')}
                  className="d-flex align-items-center gap-2 py-3 px-4"
                  style={{ 
                    color: activeTab === 'preferences' ? 'white' : '#b8c5b8',
                    background: activeTab === 'preferences' ? 'linear-gradient(135deg, #7cb342 0%, #558b2f 100%)' : 'transparent',
                    borderRadius: 0,
                    borderLeft: activeTab === 'preferences' ? '3px solid #7cb342' : '3px solid transparent',
                  }}
                >
                  <Globe size={18} />
                  Preferências
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Col>

        {/* Content */}
        <Col lg={9}>
          <div className="custom-card">
            <div className="grid-pattern" />
            
            {activeTab === 'profile' && (
              <div>
                <h5 className="mb-4 text-white">Informações do Perfil</h5>
                <div className="d-flex align-items-center gap-4 mb-4">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{ 
                      width: 80, 
                      height: 80, 
                      background: 'linear-gradient(135deg, #7cb342 0%, #558b2f 100%)',
                      fontSize: '2rem',
                      fontWeight: 600,
                    }}
                  >
                    JL
                  </div>
                  <div>
                    <Button variant="outline-secondary" size="sm" className="btn-outline-custom mb-2">
                      Alterar Foto
                    </Button>
                    <div className="text-muted small">JPG, PNG ou GIF. Máximo 2MB.</div>
                  </div>
                </div>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Nome Completo</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={settings.name}
                        onChange={(e) => setSettings({...settings, name: e.target.value})}
                        className="form-control-custom"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="form-control-custom"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Telefone</Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="+351 000 000 000"
                        className="form-control-custom"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">País</Form.Label>
                      <Form.Select className="form-control-custom">
                        <option value="PT">Portugal</option>
                        <option value="BR">Brasil</option>
                        <option value="ES">Espanha</option>
                        <option value="FR">França</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h5 className="mb-4 text-white">Configurações de Notificações</h5>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-2" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                    <div>
                      <div className="text-white fw-medium">Notificações Push</div>
                      <div className="text-muted small">Receber notificações no navegador</div>
                    </div>
                    <Form.Check 
                      type="switch" 
                      checked={settings.notifications}
                      onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-2" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                    <div>
                      <div className="text-white fw-medium">Alertas por Email</div>
                      <div className="text-muted small">Receber resumos e alertas por email</div>
                    </div>
                    <Form.Check 
                      type="switch" 
                      checked={settings.emailAlerts}
                      onChange={(e) => setSettings({...settings, emailAlerts: e.target.checked})}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                    <div>
                      <div className="text-white fw-medium">Lembretes de Pagamento</div>
                      <div className="text-muted small">Lembrar de contas a pagar</div>
                    </div>
                    <Form.Check type="switch" defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h5 className="mb-4 text-white">Segurança da Conta</h5>
                <div className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Senha Atual</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" className="form-control-custom" />
                  </Form.Group>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">Nova Senha</Form.Label>
                        <Form.Control type="password" placeholder="••••••••" className="form-control-custom" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">Confirmar Senha</Form.Label>
                        <Form.Control type="password" placeholder="••••••••" className="form-control-custom" />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                  <div>
                    <div className="text-white fw-medium">Autenticação de Dois Fatores</div>
                    <div className="text-muted small">Adicione uma camada extra de segurança</div>
                  </div>
                  <Form.Check 
                    type="switch" 
                    checked={settings.twoFactor}
                    onChange={(e) => setSettings({...settings, twoFactor: e.target.checked})}
                  />
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h5 className="mb-4 text-white">Preferências do Sistema</h5>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Moeda</Form.Label>
                      <Form.Select 
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        className="form-control-custom"
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dólar ($)</option>
                        <option value="BRL">Real (R$)</option>
                        <option value="GBP">Libra (£)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Idioma</Form.Label>
                      <Form.Select 
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                        className="form-control-custom"
                      >
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mt-3" style={{ background: 'rgba(26, 46, 26, 0.5)' }}>
                  <div className="d-flex align-items-center gap-3">
                    <Moon size={20} color="#7cb342" />
                    <div>
                      <div className="text-white fw-medium">Modo Escuro</div>
                      <div className="text-muted small">Tema escuro para melhor visualização</div>
                    </div>
                  </div>
                  <Form.Check 
                    type="switch" 
                    checked={settings.darkMode}
                    onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                  />
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid #2d4a2d' }}>
              <Button variant="outline-secondary" className="btn-outline-custom">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="btn-primary-custom">
                <Save size={18} className="me-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
