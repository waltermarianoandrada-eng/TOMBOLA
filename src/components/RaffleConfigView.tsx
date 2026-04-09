import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { engine } from '../services/engine';
import type { RaffleConfig } from '../types';

export default function RaffleConfigView() {
  const [config, setConfig] = useState<RaffleConfig | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [totalNumbers, setTotalNumbers] = useState(100);
  const [pricePerNumber, setPricePerNumber] = useState(10);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const loadedConfig = storage.getConfig();
    if (loadedConfig) {
      setConfig(loadedConfig);
      setName(loadedConfig.name);
      setTotalNumbers(loadedConfig.totalNumbers);
      setPricePerNumber(loadedConfig.pricePerNumber);
      setCurrency(loadedConfig.currency);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (config) {
      const confirmReset = window.confirm("Warning: Changing config may reset tickets if total numbers change in a way that is disruptive, though right now we strictly recommend not changing total numbers after sales. Proceed?");
      if (!confirmReset) return;
    }

    const newConfig: RaffleConfig = {
      name,
      totalNumbers,
      pricePerNumber,
      currency
    };
    
    storage.setConfig(newConfig);
    engine.initializeTickets(totalNumbers);
    setConfig(newConfig);
    alert('Configuration saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm("CRITICAL WARNING: This will delete ALL data (buyers, tickets, config, winners). Are you absolutely sure?")) {
      storage.clearAll();
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Raffle Configuration</h1>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Raffle Name</label>
            <input 
              type="text" 
              className="input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Total Numbers</label>
              <input 
                type="number" 
                className="input" 
                value={totalNumbers} 
                onChange={e => setTotalNumbers(Number(e.target.value))} 
                min="10" 
                max="10000" 
                required 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Price Per Number</label>
              <input 
                type="number" 
                className="input" 
                value={pricePerNumber} 
                onChange={e => setPricePerNumber(Number(e.target.value))} 
                min="0" 
                step="0.01" 
                required 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Currency Symbol</label>
              <input 
                type="text" 
                className="input" 
                value={currency} 
                onChange={e => setCurrency(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Save Configuration</button>
            <button type="button" className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={handleReset}>
              Danger: Reset All Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
