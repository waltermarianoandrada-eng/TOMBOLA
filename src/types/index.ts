export type TicketStatus = 'available' | 'sold' | 'paid';

export interface Buyer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: number;
}

export interface Ticket {
  number: number;
  status: TicketStatus;
  buyerId?: string;
}

export interface RaffleConfig {
  name: string;
  totalNumbers: number;
  pricePerNumber: number;
  currency: string;
  cbuAlias?: string;
}

export interface Winner {
  number: number;
  buyerId: string;
  drawnAt: number;
}
