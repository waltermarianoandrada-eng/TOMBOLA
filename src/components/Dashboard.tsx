import { useState, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { engine } from '../services/engine';
import type { Ticket, RaffleConfig, Buyer } from '../types';

export default function Dashboard() {
  const [config, setConfig] = useState<RaffleConfig | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [buyers, setBuyers] = useState<Record<string, Buyer>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadedConfig = storage.getConfig();
    if (loadedConfig) {
      setConfig(loadedConfig);
      engine.initializeTickets(loadedConfig.totalNumbers);
      setTickets(storage.getTickets());
      setBuyers(storage.getBuyers());
    }
  }, []);

  if (!config) {
    return (
      <div className="empty-state">
        <h2>Rifa No Configurada</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>Por favor dirígete a la sección de Configuración para iniciar tu rifa primero.</p>
      </div>
    );
  }

  const counts = engine.getTicketStatusCounts();

  const captureGrid = async () => {
    if (!gridRef.current) return;
    try {
      // Usamos import dinamico para evitar fallos si la libreria falla al cargar de inicio
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: '#1E1E1E' // Color de fondo de la app
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `cuadricula-${config.name}.png`;
      link.click();
    } catch (err) {
      console.error('Error al capturar la cuadricula:', err);
      alert('Hubo un fallo al intentar capturar la imagen de la pantalla.');
    }
  };

  const copyAvailable = () => {
    const available = tickets.filter(t => t.status === 'available').map(t => t.number);
    let msg = `*Rifa: ${config.name}*\n`;
    msg += `Precio: ${config.pricePerNumber} ${config.currency}\n`;
    if (config.cbuAlias) {
      msg += `CBU/Alias: ${config.cbuAlias}\n`;
    }
    msg += `\n*Números Disponibles:*\n`;
    msg += available.length ? available.join(', ') : '¡Ya no quedan números!';
    
    navigator.clipboard.writeText(msg).then(() => {
      alert('¡Números disponibles listos para pegar!');
    }).catch(() => {
      alert('No se pudo copiar al portapapeles.');
    });
  };

  return (
    <div>
      <div className="header">
        <div>
          <h1>{config.name} - Panel Principal</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Valor del número: {config.pricePerNumber} {config.currency}
          </p>
          {config.cbuAlias && (
            <p style={{ color: 'var(--primary)', marginTop: '0.25rem', fontWeight: 'bold' }}>
              CBU/Alias: {config.cbuAlias}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="badge badge-available">Disponibles: {counts.available}</span>
          <span className="badge badge-sold">Vendidos: {counts.sold}</span>
          <span className="badge badge-paid">Pagados: {counts.paid}</span>
        </div>
      </div>

      <div className="card" ref={gridRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Cuadrícula de Números</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={copyAvailable} className="btn" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
              Copiar Disponibles
            </button>
            <button onClick={captureGrid} className="btn btn-primary">
              Descargar Captura
            </button>
          </div>
        </div>
        <div className="raffle-grid">
          {tickets.map(ticket => (
            <div 
              key={ticket.number}
              className={`raffle-number status-${ticket.status}`}
              title={ticket.buyerId ? `Comprador: ${buyers[ticket.buyerId]?.name}` : 'Disponible'}
            >
              {ticket.number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
