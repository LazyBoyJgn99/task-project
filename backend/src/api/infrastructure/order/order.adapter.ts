import { Injectable } from '@nestjs/common';
import { OrderTotal } from '@/api/domain/order/order.total.entity';
import { OrderPo } from './order.po';

@Injectable()
export class OrderAdapter {
  toPo(order: OrderTotal): OrderPo {
    const po = new OrderPo();
    po.orderNo = order.orderNo;
    po.amount = order.amount;
    po.status = order.status;
    po.consumerId = order.consumer?.id;
    po.workerId = order.worker?.id;
    po.taskId = order.task?.id;
    po.paymentTime = order.paymentTime;
    po.completionTime = order.completionTime;
    po.cancelTime = order.cancelTime;
    return po;
  }

  toEntity(po: OrderPo): OrderTotal {
    const order = new OrderTotal();
    order.id = po.id;
    order.orderNo = po.orderNo;
    order.amount = po.amount;
    order.status = po.status;
    order.paymentTime = po.paymentTime;
    order.completionTime = po.completionTime;
    order.cancelTime = po.cancelTime;
    return order;
  }
}
