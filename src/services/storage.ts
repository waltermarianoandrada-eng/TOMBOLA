import type { RaffleConfig, Buyer, Ticket, Winner } from '../types';

const PREFIX = 'raffle_spa_';

export const storage = {
  getConfig: (): RaffleConfig | null => {
    const data = localStorage.getItem(`${PREFIX}config`);
    return data ? JSON.parse(data) : null;
  },
  setConfig: (config: RaffleConfig) => {
    localStorage.setItem(`${PREFIX}config`, JSON.stringify(config));
  },
  
  getBuyers: (): Record<string, Buyer> => {
    const data = localStorage.getItem(`${PREFIX}buyers`);
    return data ? JSON.parse(data) : {};
  },
  setBuyers: (buyers: Record<string, Buyer>) => {
    localStorage.setItem(`${PREFIX}buyers`, JSON.stringify(buyers));
  },
  
  getTickets: (): Ticket[] => {
    const data = localStorage.getItem(`${PREFIX}tickets`);
    return data ? JSON.parse(data) : [];
  },
  setTickets: (tickets: Ticket[]) => {
    localStorage.setItem(`${PREFIX}tickets`, JSON.stringify(tickets));
  },
  
  getWinners: (): Winner[] => {
    const data = localStorage.getItem(`${PREFIX}winners`);
    return data ? JSON.parse(data) : [];
  },
  setWinners: (winners: Winner[]) => {
    localStorage.setItem(`${PREFIX}winners`, JSON.stringify(winners));
  },

  clearAll: () => {
    localStorage.removeItem(`${PREFIX}config`);
    localStorage.removeItem(`${PREFIX}buyers`);
    localStorage.removeItem(`${PREFIX}tickets`);
    localStorage.removeItem(`${PREFIX}winners`);
  }
};
