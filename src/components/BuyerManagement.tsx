import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { engine } from '../services/engine';
import type { Buyer, Ticket } from '../types';

export default function BuyerManagement() {
  const [buyers, setBuyers] = useState<Record<string, Buyer>>({});
  const [tickets, setTickets] = useState<Ticket[]>([]);
  
  // New Buyer Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Assign Ticket Form
  const [selectedBuyerId, setSelectedBuyerId] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketStatus, setTicketStatus] = useState<'sold' | 'paid'>('sold');

  useEffect(() => {
    setBuyers(storage.getBuyers());
    setTickets(storage.getTickets());
  }, []);

  const handleAddBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString(); // simple unique ID
    const newBuyer: Buyer = {
      id,
      name,
      phone,
      createdAt: Date.now()
    };
    
    const updatedBuyers = { ...buyers, [id]: newBuyer };
    storage.setBuyers(updatedBuyers);
    setBuyers(updatedBuyers);
    setName('');
    setPhone('');
    setSelectedBuyerId(id); // auto-select
  };

  const handleAssignTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(ticketNumber);
    if (isNaN(num)) return;

    if (!selectedBuyerId) {
      alert('Please select a buyer.');
      return;
    }

    const success = engine.buyTicket(num, selectedBuyerId, ticketStatus);
    if (success) {
      setTickets(storage.getTickets());
      setTicketNumber('');
    } else {
      alert(`Ticket ${num} is not available or does not exist.`);
    }
  };

  const handleStatusChange = (num: number, newStatus: 'available' | 'sold' | 'paid') => {
    engine.updateTicketStatus(num, newStatus);
    setTickets(storage.getTickets());
  };

  return (
    <div>
      <div className="header">
        <h1>Buyer Management</h1>
      </div>

      <div className="form-grid">
        {/* ADD BUYER */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add New Buyer</h2>
          <form onSubmit={handleAddBuyer}>
            <div className="input-group">
              <label className="input-label">Name</label>
              <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Phone</label>
              <input type="text" className="input" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Add Buyer</button>
          </form>
        </div>

        {/* ASSIGN TICKET */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Assign Ticket</h2>
          <form onSubmit={handleAssignTicket}>
            <div className="input-group">
              <label className="input-label">Select Buyer</label>
              <select 
                className="input" 
                value={selectedBuyerId} 
                onChange={e => setSelectedBuyerId(e.target.value)}
                required
              >
                <option value="">-- Choose Buyer --</option>
                {Object.values(buyers).map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.phone})</option>
                ))}
              </select>
            </div>
            
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="input-group">
                <label className="input-label">Ticket No.</label>
                <input type="number" className="input" value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} required />
              </div>
              
              <div className="input-group">
                <label className="input-label">Status</label>
                <select className="input" value={ticketStatus} onChange={e => setTicketStatus(e.target.value as 'sold'|'paid')}>
                  <option value="sold">Sold (Unpaid)</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Assign</button>
          </form>
        </div>
      </div>

      {/* SOLD TICKETS LIST */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Ticket Ledger</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem' }}>Ticket</th>
                <th style={{ padding: '0.75rem' }}>Buyer</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.filter(t => t.status !== 'available').map(t => (
                <tr key={t.number} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>#{t.number}</td>
                  <td style={{ padding: '0.75rem' }}>{t.buyerId ? buyers[t.buyerId]?.name : 'Unknown'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge badge-${t.status}`}>{t.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    {t.status === 'sold' && (
                      <button className="btn btn-success" onClick={() => handleStatusChange(t.number, 'paid')}>Mark Paid</button>
                    )}
                    <button className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleStatusChange(t.number, 'available')}>Free</button>
                  </td>
                </tr>
              ))}
              {tickets.filter(t => t.status !== 'available').length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No assigned tickets yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
