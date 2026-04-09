import React, { useState, useEffect } from 'react';
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
        <h2>No Raffle Configured</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>Please go to the Config section to setup your raffle first.</p>
      </div>
    );
  }

  const counts = engine.getTicketStatusCounts();

  return (
    <div>
      <div className="header">
        <h1>{config.name} - Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span className="badge badge-available">Available: {counts.available}</span>
          <span className="badge badge-sold">Sold: {counts.sold}</span>
          <span className="badge badge-paid">Paid: {counts.paid}</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Numbers Grid</h2>
        <div className="raffle-grid">
          {tickets.map(ticket => (
            <div 
              key={ticket.number}
              className={`raffle-number status-${ticket.status}`}
              title={ticket.buyerId ? `Buyer: ${buyers[ticket.buyerId]?.name}` : 'Available'}
            >
              {ticket.number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
