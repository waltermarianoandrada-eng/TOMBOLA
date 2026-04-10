import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { engine } from '../services/engine';
import type { Ticket, RaffleConfig, Buyer } from '../types';

export default function Dashboard() {
  const [config, setConfig] = useState<RaffleConfig | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [buyers, setBuyers] = useState<Record<string, Buyer>>({});

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

  return (
    <div>
      <div className="header">
        <div>
          <h1>{config.name} - Panel Principal</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Valor del número: {config.pricePerNumber} {config.currency}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span className="badge badge-available">Disponibles: {counts.available}</span>
          <span className="badge badge-sold">Vendidos: {counts.sold}</span>
          <span className="badge badge-paid">Pagados: {counts.paid}</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Cuadrícula de Números</h2>
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
