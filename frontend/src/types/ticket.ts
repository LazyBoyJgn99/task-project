export interface ITicket {
  attribute: { type: EnumTicketType; crowd: EnumCrowd; dayType: string };
  date: string;
  id: string;
  name: string;
  price: number;
  stock: number;
  status: EnumTicketWorkStatus;
  _status?: string;
  _userId?: string;
  _orderId: string;
  // 用于计算草料票数
  _orderCount?: number;
}

export enum EnumTicketWorkStatus {
  ONSALE = 'onsale',
  REST = 'rest',
}

export interface IBuyTicket extends ITicket {
  num: number;
}

export enum EnumTicketStatus {
  EXPIRED = '已过期',
  CANUSED = '可使用',
}

export enum EnumTicketType {
  TICKET = '票',
  GRASS = '草',
}

export enum EnumCrowd {
  ADULT = '成人',
  CHILD = '儿童',
}
