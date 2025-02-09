import {request} from '@/utils/request';
import { 
  CreateOrderParams,
  OrderPageParams,
  Order,
  OrderPageResult,
  OrderStatus
} from '@/types/order.types';
import { UserRole, UserStatus } from '@/types/user.types';
import { TaskStatus } from '@/types/task.types';

// Mock 数据
const mockOrders: Order[] = [
  {
    id: 'mock-order-1',
    orderNo: 'ORDER202401160001',
    amount: 100,
    status: OrderStatus.PENDING,
    task: {
      id: 'mock-task-1',
      title: '测试任务1',
      description: '这是一个测试任务描述',
      price: 100,
      deadline: '2024-12-31',
      status: TaskStatus.PENDING,
      publisher: {
        id: 'mock-consumer',
        name: '测试用户',
        phone: '13800138000',
        role: UserRole.CONSUMER,
        status: UserStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    consumer: {
      id: 'mock-consumer',
      name: '测试用户',
      phone: '13800138000',
      role: UserRole.CONSUMER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    worker: {
      id: 'mock-worker',
      name: '测试接单员',
      phone: '13800138001',
      role: UserRole.WORKER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  },
  {
    id: 'mock-order-2',
    orderNo: 'ORDER202401160002',
    amount: 200,
    status: OrderStatus.PAID,
    task: {
      id: 'mock-task-2',
      title: '测试任务2',
      description: '这是另一个测试任务描述',
      price: 200,
      deadline: '2024-12-31',
      status: TaskStatus.IN_PROGRESS,
      publisher: {
        id: 'mock-consumer',
        name: '测试用户',
        phone: '13800138000',
        role: UserRole.CONSUMER,
        status: UserStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      worker: {
        id: 'mock-worker',
        name: '测试接单员',
        phone: '13800138001',
        role: UserRole.WORKER,
        status: UserStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    consumer: {
      id: 'mock-consumer',
      name: '测试用户',
      phone: '13800138000',
      role: UserRole.CONSUMER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    worker: {
      id: 'mock-worker',
      name: '测试接单员',
      phone: '13800138001',
      role: UserRole.WORKER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    paymentTime: new Date().toISOString(),
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
];

export const orderService = {
  // 创建订单
  create: (params: CreateOrderParams) => {
    return request<Order>({
      path: '/order',
      method: 'POST',
      data: params,
      mockData: {
        id: 'mock-order-' + Date.now(),
        orderNo: 'ORDER' + Date.now(),
        amount: mockOrders[0].task.price,
        status: OrderStatus.PENDING,
        task: mockOrders[0].task,
        consumer: mockOrders[0].consumer,
        worker: mockOrders[0].worker,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    });
  },

  // 获取我的消费订单
  getMyConsumer: (params: OrderPageParams) => {
    return request<OrderPageResult>({
      path: '/order/my-consumer',
      method: 'GET',
      data: params,
      mockData: {
        total: mockOrders.length,
        items: mockOrders,
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10
      }
    });
  },

  // 获取我的工作订单
  getMyWorker: (params: OrderPageParams) => {
    return request<OrderPageResult>({
      path: '/order/my-worker',
      method: 'GET',
      data: params,
      mockData: {
        total: mockOrders.length,
        items: mockOrders,
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 10
      }
    });
  },

  // 支付订单
  pay: (orderId: string) => {
    return request<Order>({
      path: '/order/pay',
      method: 'PUT',
      data: { orderId },
      mockData: {
        ...mockOrders[0],
        status: OrderStatus.PAID,
        paymentTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    });
  },

  // 完成订单
  complete: (orderId: string) => {
    return request<Order>({
      path: '/order/complete',
      method: 'PUT',
      data: { orderId },
      mockData: {
        ...mockOrders[0],
        status: OrderStatus.COMPLETED,
        completionTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    });
  },

  // 取消订单
  cancel: (orderId: string) => {
    return request<Order>({
      path: '/order/cancel',
      method: 'PUT',
      data: { orderId },
      mockData: {
        ...mockOrders[0],
        status: OrderStatus.CANCELLED,
        cancelTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    });
  },

  // 申请退款
  refund: (orderId: string) => {
    return request<Order>({
      path: '/order/refund',
      method: 'PUT',
      data: { orderId },
      mockData: {
        ...mockOrders[0],
        status: OrderStatus.REFUNDED,
        updateTime: new Date().toISOString()
      }
    });
  }
}; 