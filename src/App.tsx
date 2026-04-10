import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Ticket, Users, Settings, Trophy, Download } from 'lucide-react';
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

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevenir que aparezca el prompt automático nativo
      e.preventDefault();
      // Guardar el evento para poder llamarlo más tarde con el botón
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

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

        {installPrompt && (
          <li style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button 
              onClick={handleInstallClick}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={20} />
              <span>Instalar App</span>
            </button>
          </li>
        )}
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
