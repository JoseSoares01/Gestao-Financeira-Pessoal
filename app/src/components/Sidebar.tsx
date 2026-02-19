import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  BarChart3, 
  Target, 
  Settings, 
  LogOut,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'transactions', label: 'Transações', icon: Receipt, path: '/transactions' },
  { id: 'categories', label: 'Categorias', icon: PieChart, path: '/categories' },
  { id: 'reports', label: 'Relatórios', icon: BarChart3, path: '/reports' },
  { id: 'goals', label: 'Metas', icon: Target, path: '/goals' },
  { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileOpen ? 'show' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo">
            <div className="logo-icon">
              <TrendingUp size={22} color="white" />
            </div>
            <span className="logo-text">José Luiza</span>
          </NavLink>
          
          <button 
            className="toggle-btn d-none d-lg-flex"
            onClick={onToggle}
            title={isCollapsed ? 'Expandir' : 'Recolher'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                data-title={item.label}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className="nav-icon" size={22} />
                <span className="nav-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">JL</div>
            <div className="user-info">
              <div className="user-name">José Luiza</div>
              <div className="user-email">jose@email.com</div>
            </div>
            <button className="logout-btn" title="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
