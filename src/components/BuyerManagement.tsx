import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { storage } from '../services/storage';
import { engine } from '../services/engine';
import type { Buyer, Ticket } from '../types';

export default function BuyerManagement() {
  const location = useLocation();
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
    
    if (location.state?.selectedTicketNumber) {
      setTicketNumber(location.state.selectedTicketNumber.toString());
    }
  }, [location.state]);

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
      alert('Por favor selecciona un comprador.');
      return;
    }

    const success = engine.buyTicket(num, selectedBuyerId, ticketStatus);
    if (success) {
      setTickets(storage.getTickets());
      setTicketNumber('');
    } else {
      alert(`El boleto ${num} no está disponible o no existe.`);
    }
  };

  const handleStatusChange = (num: number, newStatus: 'available' | 'sold' | 'paid') => {
    engine.updateTicketStatus(num, newStatus);
    setTickets(storage.getTickets());
  };

  return (
    <div>
      <div className="header">
        <h1>Gestión de Compradores</h1>
      </div>

      <div className="form-grid">
        {/* ADD BUYER */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Añadir Nuevo Comprador</h2>
          <form onSubmit={handleAddBuyer}>
            <div className="input-group">
              <label className="input-label">Nombre completo</label>
              <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Teléfono</label>
              <input type="text" className="input" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Guardar Comprador</button>
          </form>
        </div>

        {/* ASSIGN TICKET */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Asignar Boleto</h2>
          <form onSubmit={handleAssignTicket}>
            <div className="input-group">
              <label className="input-label">Seleccionar Comprador</label>
              <select 
                className="input" 
                value={selectedBuyerId} 
                onChange={e => setSelectedBuyerId(e.target.value)}
                required
              >
                <option value="">-- Elegir Comprador --</option>
                {Object.values(buyers).map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.phone})</option>
                ))}
              </select>
            </div>
            
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="input-group">
                <label className="input-label">Nº Boleto</label>
                <input type="number" className="input" value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} required />
              </div>
              
              <div className="input-group">
                <label className="input-label">Estatus</label>
                <select className="input" value={ticketStatus} onChange={e => setTicketStatus(e.target.value as 'sold'|'paid')}>
                  <option value="sold">Vendido (Adeuda)</option>
                  <option value="paid">Pagado</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Asignar</button>
          </form>
        </div>
      </div>

      {/* SOLD TICKETS LIST */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Registro de Boletos</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem' }}>Boleto</th>
                <th style={{ padding: '0.75rem' }}>Comprador</th>
                <th style={{ padding: '0.75rem' }}>Estatus</th>
                <th style={{ padding: '0.75rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.filter(t => t.status !== 'available').map(t => (
                <tr key={t.number} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>#{t.number}</td>
                  <td style={{ padding: '0.75rem' }}>{t.buyerId ? buyers[t.buyerId]?.name : 'Desconocido'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge badge-${t.status}`}>
                      {t.status === 'sold' ? 'Vendido' : 'Pagado'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    {t.status === 'sold' && (
                      <button className="btn btn-success" onClick={() => handleStatusChange(t.number, 'paid')}>Marcar Pagado</button>
                    )}
                    <button className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleStatusChange(t.number, 'available')}>Liberar</button>
                  </td>
                </tr>
              ))}
              {tickets.filter(t => t.status !== 'available').length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Aún no hay boletos vendidos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
