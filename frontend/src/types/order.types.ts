import { User } from './user.types';
import { Task } from './task.types';

// 订单状态
export enum OrderStatus {
  PENDING = 'pending',     // 待支付
  PAID = 'paid',          // 已支付
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
  REFUNDED = 'refunded'   // 已退款
}

// 订单信息
export interface Order {
  id: string;
  orderNo: string;
  amount: number;
  status: OrderStatus;
  task: Task;
  consumer: User;
  worker: User;
  paymentTime?: string;
  completionTime?: string;
  cancelTime?: string;
  createTime: string;
  updateTime: string;
}

// 创建订单参数
export interface CreateOrderParams {
  taskId: string;
}

// 订单查询参数
export interface OrderPageParams {
  pageNumber?: number;
  pageSize?: number;
  status?: OrderStatus;
}

// 分页结果
export interface OrderPageResult {
  items: Order[];
  total: number;
  pageNumber: number;
  pageSize: number;
} 