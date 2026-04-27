import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { engine } from '../services/engine';
import type { RaffleConfig } from '../types';

export default function RaffleConfigView() {
  const [config, setConfig] = useState<RaffleConfig | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [totalNumbers, setTotalNumbers] = useState(100);
  const [pricePerNumber, setPricePerNumber] = useState(1000);
  const [currency, setCurrency] = useState('Pesos Argentinos');
  const [cbuAlias, setCbuAlias] = useState('');

  useEffect(() => {
    const loadedConfig = storage.getConfig();
    if (loadedConfig) {
      setConfig(loadedConfig);
      setName(loadedConfig.name);
      setTotalNumbers(loadedConfig.totalNumbers);
      setPricePerNumber(loadedConfig.pricePerNumber);
      setCurrency(loadedConfig.currency);
      setCbuAlias(loadedConfig.cbuAlias || '');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (config) {
      const confirmReset = window.confirm("Advertencia: Al guardar esta nueva configuración, si cambiaste la cantidad total de números, la cuadrícula de boletos se reconstruirá y los boletos asignados podrían desvincularse. ¿Estás seguro de querer guardar los cambios?");
      if (!confirmReset) return;

      // Si cambió el total de números, reiniciamos los boletos en la base de datos
      if (totalNumbers !== config.totalNumbers) {
        storage.setTickets([]);
      }
    }

    const newConfig: RaffleConfig = {
      name,
      totalNumbers,
      pricePerNumber,
      currency,
      cbuAlias
    };
    
    storage.setConfig(newConfig);
    engine.initializeTickets(totalNumbers);
    setConfig(newConfig);
    alert('¡Configuración guardada exitosamente!');
  };

  const handleReset = () => {
    if (window.confirm("ADVERTENCIA CRÍTICA: Esto borrará TODOS los datos (compradores, boletos, historia, ganadores). ¿Estás completamente seguro?")) {
      storage.clearAll();
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Configuración de la Rifa</h1>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Nombre de la Rifa</label>
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
              <label className="input-label">Total de Números</label>
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
              <label className="input-label">Precio por Número</label>
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
              <label className="input-label">Moneda</label>
              <input 
                type="text" 
                className="input" 
                value={currency} 
                onChange={e => setCurrency(e.target.value)} 
              />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">CBU / Alias (Para transferencias)</label>
              <input 
                type="text" 
                className="input" 
                value={cbuAlias} 
                onChange={e => setCbuAlias(e.target.value)} 
                placeholder="Ej. mi.alias.mp" 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Guardar Configuración</button>
            <button type="button" className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={handleReset}>
              Peligro: Borrar Todos los Datos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
