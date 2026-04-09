import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { storage } from '../services/storage';
import { engine } from '../services/engine';
import type { Winner, Buyer } from '../types';

export default function WinnerDraw() {
  const [buyers, setBuyers] = useState<Record<string, Buyer>>({});
  const [pastWinners, setPastWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<number | string>('?');
  const [winner, setWinner] = useState<Winner | null>(null);

  useEffect(() => {
    setBuyers(storage.getBuyers());
    setPastWinners(storage.getWinners());
  }, []);

  const handleDraw = () => {
    const counts = engine.getTicketStatusCounts();
    if (counts.paid === 0) {
      alert("There are no valid 'paid' tickets to draw a winner from.");
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    // Animation: randomly generate numbers for 3 seconds
    let interval: NodeJS.Timeout;
    const duration = 3000;
    const start = Date.now();

    interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed > duration) {
        clearInterval(interval);
        
        const newWinner = engine.drawWinner();
        if (newWinner) {
          setWinner(newWinner);
          setCurrentDisplay(newWinner.number);
          setPastWinners(storage.getWinners());
        } else {
          setCurrentDisplay('Error');
        }
        setIsDrawing(false);
      } else {
        // Random number between 1 and Total
        const config = storage.getConfig();
        const max = config ? config.totalNumbers : 999;
        setCurrentDisplay(Math.floor(Math.random() * max) + 1);
      }
    }, 100);
  };

  return (
    <div>
      <div className="header">
        <h1>Draw Winners</h1>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', marginBottom: '2rem' }}>
        <Trophy size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '2rem' }}>The Grand Draw</h2>
        
        <div 
          style={{
            fontSize: '6rem',
            fontWeight: 700,
            color: isDrawing ? 'var(--text-secondary)' : 'var(--primary)',
            textShadow: isDrawing ? 'none' : 'var(--shadow-glow)',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {currentDisplay}
        </div>

        {winner && !isDrawing && (
          <div style={{ animation: 'fadeIn 0.5s ease-in-out', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--success)' }}>We have a winner!</h3>
            <p style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>
              Congratulations to <strong>{buyers[winner.buyerId]?.name}</strong>!
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>Phone: {buyers[winner.buyerId]?.phone}</p>
          </div>
        )}

        <button 
          className="btn btn-primary" 
          style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}
          onClick={handleDraw}
          disabled={isDrawing}
        >
          {isDrawing ? 'Drawing...' : 'DRAW NOW'}
        </button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Past Winners</h2>
        {pastWinners.length > 0 ? (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem' }}>Winning No.</th>
                <th style={{ padding: '0.75rem' }}>Winner Name</th>
                <th style={{ padding: '0.75rem' }}>Drawn At</th>
              </tr>
            </thead>
            <tbody>
              {pastWinners.map((w, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>#{w.number}</td>
                  <td style={{ padding: '0.75rem' }}>{buyers[w.buyerId]?.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(w.drawnAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No winners have been drawn yet.</p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
