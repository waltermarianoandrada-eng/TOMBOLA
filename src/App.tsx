import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Ticket, Users, Settings, Trophy } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BuyerManagement from './components/BuyerManagement';
import RaffleConfigView from './components/RaffleConfigView';
import WinnerDraw from './components/WinnerDraw';

function Navigation() {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Panel Principal', icon: Ticket },
    { path: '/buyers', label: 'Compradores', icon: Users },
    { path: '/config', label: 'Configuración', icon: Settings },
    { path: '/draw', label: 'Gran Sorteo', icon: Trophy },
  ];

  return (
    <nav className="sidebar">
      <h2 className="brand-title">Tómbola Pro</h2>
      <ul className="nav-list">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buyers" element={<BuyerManagement />} />
            <Route path="/config" element={<RaffleConfigView />} />
            <Route path="/draw" element={<WinnerDraw />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
