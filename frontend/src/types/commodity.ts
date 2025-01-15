import { EnumTicketWorkStatus } from './ticket';

export class ICommodity {
  id: string;

  name: string;

  stock: number;

  status: EnumTicketWorkStatus;

  attribute?: any;

  date?: string;

  price: number;
}
