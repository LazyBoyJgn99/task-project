import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { OrderDomainService } from '@/api/domain/order/order.domain.service';
import { TaskDomainService } from '@/api/domain/task/task.domain.service';
import { CreateOrderDto, OrderPageDto } from './order.dto';
import { Order, OrderStatus } from '@/api/domain/order/order.entity';
import { User } from '@/api/domain/user/user.entity';
import { TaskStatus } from '@/api/domain/task/task.entity';
import { MockPaymentService } from '@/test/mocks/payment.service.mock';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderDomainService: OrderDomainService,
    private readonly taskDomainService: TaskDomainService,
    private readonly paymentService: MockPaymentService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    // 查找任务
    const task = await this.taskDomainService.findById(createOrderDto.taskId);
    if (!task) {
      throw new InternalServerErrorException('任务不存在');
    }
    if (task.status !== TaskStatus.ACCEPTED) {
      throw new InternalServerErrorException('任务状态不正确');
    }

    // 创建订单
    const order = new Order();
    order.orderNo = `ORDER${Date.now()}`;  // 简单的订单号生成
    order.amount = task.price;
    order.status = OrderStatus.PENDING;
    order.consumer = user;
    order.worker = task.worker;
    order.task = task;

    return await this.orderDomainService.create(order);
  }

  async getMyConsumer(pageDto: OrderPageDto, user: User) {
    return await this.orderDomainService.findByConsumer(user.id);
  }

  async getMyWorker(pageDto: OrderPageDto, user: User) {
    return await this.orderDomainService.findByWorker(user.id);
  }

  // 支付订单
  async pay(orderId: string, user: User) {
    const order = await this.orderDomainService.findById(orderId);
    if (!order) {
      throw new InternalServerErrorException('订单不存在');
    }
    if (order.consumer.id !== user.id) {
      throw new ForbiddenException('无权操作此订单');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new InternalServerErrorException('订单状态不正确');
    }

    // 调用模拟支付接口
    const payResult = await this.paymentService.pay(order.amount, order.id);
    if (!payResult.success) {
      throw new InternalServerErrorException(payResult.error);
    }

    order.status = OrderStatus.PAID;
    order.paymentTime = new Date();
    return await this.orderDomainService.update(order);
  }

  // 完成订单
  async complete(orderId: string, user: User) {
    const order = await this.orderDomainService.findById(orderId);
    if (!order) {
      throw new InternalServerErrorException('订单不存在');
    }
    if (order.consumer.id !== user.id) {
      throw new ForbiddenException('无权操作此订单');
    }
    if (order.status !== OrderStatus.PAID) {
      throw new InternalServerErrorException('订单状态不正确');
    }

    // 更新任务状态
    const task = order.task;
    task.status = TaskStatus.COMPLETED;
    await this.taskDomainService.update(task);

    order.status = OrderStatus.COMPLETED;
    order.completionTime = new Date();
    return await this.orderDomainService.update(order);
  }

  // 取消订单
  async cancel(orderId: string, user: User) {
    const order = await this.orderDomainService.findById(orderId);
    if (!order) {
      throw new InternalServerErrorException('订单不存在');
    }
    if (order.consumer.id !== user.id) {
      throw new ForbiddenException('无权操作此订单');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new InternalServerErrorException('订单状态不正确');
    }

    // 更新任务状态
    const task = order.task;
    task.status = TaskStatus.PENDING;
    task.worker = null;
    await this.taskDomainService.update(task);

    order.status = OrderStatus.CANCELLED;
    order.cancelTime = new Date();
    return await this.orderDomainService.update(order);
  }

  // 申请退款
  async refund(orderId: string, user: User) {
    const order = await this.orderDomainService.findById(orderId);
    if (!order) {
      throw new InternalServerErrorException('订单不存在');
    }
    if (order.consumer.id !== user.id) {
      throw new ForbiddenException('无权操作此订单');
    }
    if (order.status !== OrderStatus.PAID) {
      throw new InternalServerErrorException('订单状态不正确');
    }

    // 调用模拟退款接口
    const refundResult = await this.paymentService.refund(
      order.amount,
      order.id,
      'mock_transaction_id'
    );
    if (!refundResult.success) {
      throw new InternalServerErrorException(refundResult.error);
    }

    order.status = OrderStatus.REFUNDED;
    return await this.orderDomainService.update(order);
  }
}
