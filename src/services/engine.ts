import { storage } from './storage';
import type { Ticket, TicketStatus, Winner } from '../types';

export const engine = {
  initializeTickets: (totalNumbers: number): void => {
    const existing = storage.getTickets();
    if (existing.length > 0) return; // Already initialized

    const tickets: Ticket[] = Array.from({ length: totalNumbers }, (_, i) => ({
      number: i + 1,
      status: 'available',
    }));
    storage.setTickets(tickets);
  },

  getTicketStatusCounts: () => {
    const tickets = storage.getTickets();
    return tickets.reduce(
      (acc, ticket) => {
        acc[ticket.status]++;
        return acc;
      },
      { available: 0, sold: 0, paid: 0 }
    );
  },

  buyTicket: (number: number, buyerId: string, status: 'sold' | 'paid'): boolean => {
    const tickets = storage.getTickets();
    const index = tickets.findIndex(t => t.number === number);
    
    if (index === -1) return false;
    if (tickets[index].status !== 'available') return false;

    // Add buyerId to the ticket and set to requested status
    tickets[index] = { ...tickets[index], status, buyerId };
    storage.setTickets(tickets);
    return true;
  },

  updateTicketStatus: (number: number, newStatus: TicketStatus): boolean => {
    const tickets = storage.getTickets();
    const index = tickets.findIndex(t => t.number === number);
    if (index === -1) return false;

    tickets[index] = { ...tickets[index], status: newStatus };
    if (newStatus === 'available') {
      delete tickets[index].buyerId;
    }
    
    storage.setTickets(tickets);
    return true;
  },

  drawWinner: (): Winner | null => {
    const tickets = storage.getTickets();
    // CRUCIAL: Exclusively select winners from "paid" tickets
    const paidTickets = tickets.filter(t => t.status === 'paid');
    
    if (paidTickets.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * paidTickets.length);
    const winningTicket = paidTickets[randomIndex];

    if (!winningTicket.buyerId) return null; // Should not happen for a paid ticket

    const winner: Winner = {
      number: winningTicket.number,
      buyerId: winningTicket.buyerId,
      drawnAt: Date.now(),
    };

    const winners = storage.getWinners();
    winners.push(winner);
    storage.setWinners(winners);

    return winner;
  }
};
