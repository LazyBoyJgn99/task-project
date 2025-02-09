import { GenerateUUID } from '@/utils/uuid';
import { User } from '../user/user.entity';
import { Order } from './order.entity';

export class OrderTotal {
  id: string;

  /**
   * 用户
   */
  user: User;

  /**
   * 支付订单号
   */
  prepayId: string;

  /**
   * 订单创建时间
   */
  createTime: Date;

  /**
   * 订单更新时间
   */
  updateTime: Date;

  /**
   * 支付时间
   */
  payTime: Date;

  /**
   * 子订单
   */
  children: Order[];

  /**
   * 订单总价
   */
  get price(): number {
    const price = this.children.reduce((sum, order) => sum + order.price, 0);
    return Math.round(price * 100) / 100;
  }

  /**
   * 设置子订单已支付
   */
  SetPaid() {
    this.payTime = new Date();
    this.children.forEach((order) => {
      order.SetPaid();
    });
  }

  /**
   * 设置子订单异常
   */
  SetError() {
    this.children.forEach((order) => {
      order.SetError();
    });
  }

  /**
   * 设置子订单已取消
   */
  SetCancel() {
    this.children.forEach((order) => {
      order.SetCanceled();
    });
  }

  /**
   * 设置子订单退款中
   */
  SetRefunding(ids: string[]) {
    // 获取退款单号
    const refundId = GenerateUUID();
    this.children.forEach((order) => {
      if (ids.includes(order.id)) order.SetRefunding(refundId);
    });
  }

  /**
   * 设置子订单退款成功
   */
  SetRefunded(ids: string[]) {
    this.children.forEach((order) => {
      if (ids.includes(order.id)) order.SetRefunded();
    });
  }

  clone() {
    const orderTotal = new OrderTotal();
    orderTotal.id = this.id;
    orderTotal.user = this.user?.clone();
    orderTotal.prepayId = this.prepayId;
    orderTotal.createTime = this.createTime;
    orderTotal.updateTime = this.updateTime;
    orderTotal.payTime = this.payTime;
    orderTotal.children = this.children.map((child) => child.clone());
    return orderTotal;
  }
}
