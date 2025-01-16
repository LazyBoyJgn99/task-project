import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '@/api/application/order/order.service';
import { OrderDomainService } from '@/api/domain/order/order.domain.service';
import { TaskDomainService } from '@/api/domain/task/task.domain.service';
import { MockPaymentService } from './mocks/payment.service.mock';
import { Order, OrderStatus } from '@/api/domain/order/order.entity';
import { Task, TaskStatus } from '@/api/domain/task/task.entity';
import { User, UserRole } from '@/api/domain/user/user.entity';

describe('OrderService', () => {
  let service: OrderService;
  let mockPaymentService: MockPaymentService;

  const mockOrder: Order = {
    id: '1',
    orderNo: 'ORDER123',
    amount: 100,
    status: OrderStatus.PENDING,
    consumer: { id: '1', name: 'consumer', role: UserRole.CONSUMER } as User,
    worker: { id: '2', name: 'worker', role: UserRole.WORKER } as User,
    task: { id: '1', title: 'Test Task', status: TaskStatus.ACCEPTED } as Task,
    createdAt: new Date(),
    updatedAt: new Date()
  } as Order;

  const mockUser: Partial<User> = {
    id: '1',
    name: 'consumer',
    role: UserRole.CONSUMER
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderDomainService,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockOrder),
            update: jest.fn().mockImplementation((order) => Promise.resolve(order)),
          },
        },
        {
          provide: TaskDomainService,
          useValue: {
            update: jest.fn().mockImplementation((task) => Promise.resolve(task)),
          },
        },
        {
          provide: MockPaymentService,
          useClass: MockPaymentService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    mockPaymentService = module.get<MockPaymentService>(MockPaymentService);
  });

  describe('pay', () => {
    it('should successfully pay for an order', async () => {
      const result = await service.pay('1', mockUser as User);
      expect(result.status).toBe(OrderStatus.PAID);
      expect(result.paymentTime).toBeDefined();
    });

    it('should throw error when order not found', async () => {
      jest.spyOn(service['orderDomainService'], 'findById').mockResolvedValue(null);
      await expect(service.pay('1', mockUser as User)).rejects.toThrow('订单不存在');
    });
  });

  describe('complete', () => {
    it('should successfully complete an order', async () => {
      const paidOrder = { ...mockOrder, status: OrderStatus.PAID };
      jest.spyOn(service['orderDomainService'], 'findById').mockResolvedValue(paidOrder);

      const result = await service.complete('1', mockUser as User);
      expect(result.status).toBe(OrderStatus.COMPLETED);
      expect(result.completionTime).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('should successfully cancel an order', async () => {
      const result = await service.cancel('1', mockUser as User);
      expect(result.status).toBe(OrderStatus.CANCELLED);
      expect(result.cancelTime).toBeDefined();
    });
  });

  describe('refund', () => {
    it('should successfully refund an order', async () => {
      const paidOrder = { ...mockOrder, status: OrderStatus.PAID };
      jest.spyOn(service['orderDomainService'], 'findById').mockResolvedValue(paidOrder);

      const result = await service.refund('1', mockUser as User);
      expect(result.status).toBe(OrderStatus.REFUNDED);
    });
  });
}); 