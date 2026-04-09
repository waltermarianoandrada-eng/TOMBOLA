import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Ticket, Users, Settings, Trophy } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BuyerManagement from './components/BuyerManagement';
import RaffleConfigView from './components/RaffleConfigView';
import WinnerDraw from './components/WinnerDraw';

function Navigation() {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Ticket },
    { path: '/buyers', label: 'Buyers', icon: Users },
    { path: '/config', label: 'Config', icon: Settings },
    { path: '/draw', label: 'Draw Winner', icon: Trophy },
  ];

  return (
    <nav style={{ width: '250px', backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border)', padding: '2rem 1rem' }}>
      <h2 style={{ marginBottom: '2rem', paddingLeft: '1rem', color: 'var(--primary)' }}>Tombola Pro</h2>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link 
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  textDecoration: 'none',
                  color: isActive ? '#000' : 'var(--text-primary)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} />
                {item.label}
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
