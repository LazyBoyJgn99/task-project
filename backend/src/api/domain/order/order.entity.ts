import { InternalServerErrorException } from '@nestjs/common';
import { Coupon } from '../coupon/coupon.entity';
import { Commodity } from '../commodity/commodity.entity';
import { User } from '../user/user.entity';

// 类
export { Order };
// 类型
export { OrderStatus, OrderEvents };

class Order {
  id: string;

  /**
   * 订单状态
   */
  status: OrderStatus;

  /**
   * 用户
   */
  user: User;

  /**
   * 商品
   */
  commodity: Commodity;

  /**
   * 优惠券
   */
  coupon: Coupon;

  /**
   * 订单价格
   */
  price: number;

  /**
   * 订单创建时间
   */
  createTime: Date;

  /**
   * 订单更新时间
   */
  updateTime: Date;

  /**
   * 退款时间
   */
  refundTime: Date;

  /**
   * 使用时间
   */
  useTime: Date;

  /**
   * 退款单号
   */
  refundId: string;

  /**
   * 父订单Id
   */
  parentId: string;

  /**
   * 订单备注
   */
  remarks: string;

  /**
   * 订单状态机
   */
  private orderStatusTransitions = {
    [OrderStatus.UNPAID]: {
      [OrderEvents.PAY]: function () {
        this.status = OrderStatus.PAID;
      },
      [OrderEvents.CANCEL]: function () {
        this.status = OrderStatus.CANCELED;
      },
      [OrderEvents.ERROR]: function () {
        this.status = OrderStatus.EXCEPTION;
      },
    },
    [OrderStatus.PAID]: {
      [OrderEvents.REFUND]: function (refundId: string) {
        this.status = OrderStatus.REFUNDING;
        this.refundId = refundId;
        this.refundTime = new Date();
      },
      [OrderEvents.USE]: function () {
        this.status = OrderStatus.USED;
        this.useTime = new Date();
      },
      [OrderEvents.ERROR]: function () {
        this.status = OrderStatus.EXCEPTION;
      },
    },
    [OrderStatus.REFUNDING]: {
      [OrderEvents.REFUNDED]: function () {
        this.status = OrderStatus.REFUNDED;
      },
      [OrderEvents.ERROR]: function () {
        this.status = OrderStatus.EXCEPTION;
      },
    },
    [OrderStatus.CANCELED]: {},
    [OrderStatus.REFUNDED]: {},
    [OrderStatus.USED]: {},
    [OrderStatus.EXCEPTION]: {},
  };

  /**
   * 变更订单状态
   * @param event
   * @returns
   */
  private ChangeOrderStatus(event: OrderEvents, params?: any[]) {
    const transitions = this.orderStatusTransitions[this.status];
    if (!transitions || !transitions[event]) {
      throw new InternalServerErrorException(
        `${ERROR_EVENT_MAP[this.status]}, 订单ID：${this.id}`,
      );
    }
    transitions[event].apply(this, params);
  }

  /**
   * 判断是否有优惠
   */
  private HasCoupon() {
    return !!this.coupon;
  }

  /**
   * 消费优惠券
   */
  ConsumCoupon() {
    // 检查是否可用
    if (!this.HasCoupon()) return;
    // 计算价格
    const price = this.coupon.UseCoupon(this.price);
    // 更新订单价格
    this.price = price;
  }

  /**
   * 设置已支付
   */
  SetPaid() {
    this.ChangeOrderStatus(OrderEvents.PAY);
  }

  /**
   * 设置异常
   */
  SetError() {
    this.ChangeOrderStatus(OrderEvents.ERROR);
  }

  /**
   * 设置退款中
   */
  SetRefunding(refundId: string) {
    this.ChangeOrderStatus(OrderEvents.REFUND, [refundId]);
  }

  /**
   * 设置退款成功
   */
  SetRefunded() {
    this.ChangeOrderStatus(OrderEvents.REFUNDED);
    if (this.HasCoupon()) {
      this.coupon.setUnused();
    }
  }

  /**
   * 设置已使用
   */
  SetUsed() {
    this.ChangeOrderStatus(OrderEvents.USE);
  }

  /**
   * 设置已取消
   */
  SetCanceled() {
    this.ChangeOrderStatus(OrderEvents.CANCEL);
    if (this.HasCoupon()) {
      this.coupon.setUnused();
    }
  }

  clone() {
    const order = new Order();
    order.id = this.id;
    order.status = this.status;
    order.price = this.price;
    order.remarks = this.remarks;
    order.createTime = this.createTime;
    order.updateTime = this.updateTime;
    order.refundTime = this.refundTime;
    order.useTime = this.useTime;
    order.refundId = this.refundId;
    order.parentId = this.parentId;
    order.commodity = this.commodity?.clone();
    order.coupon = this.coupon?.clone();
    order.user = this.user?.clone();
    return order;
  }
}

enum OrderStatus {
  /**
   * 未支付
   */
  UNPAID = 'unpaid',
  /**
   * 已支付
   */
  PAID = 'paid',
  /**
   * 已取消
   */
  CANCELED = 'canceled',
  /**
   * 退款中
   */
  REFUNDING = 'refunding',
  /**
   * 已退款
   */
  REFUNDED = 'refunded',
  /**
   * 已使用
   */
  USED = 'used',
  /**
   * 异常
   */
  EXCEPTION = 'exception',
}

enum OrderEvents {
  /**
   * 支付
   */
  PAY = 'pay',
  /**
   * 取消
   */
  CANCEL = 'cancel',
  /**
   * 退款
   */
  REFUND = 'refund',
  /**
   * 退款完成
   */
  REFUNDED = 'refunded',
  /**
   * 使用
   */
  USE = 'use',
  /**
   * 异常
   */
  ERROR = 'error',
}

const ERROR_EVENT_MAP = {
  [OrderStatus.CANCELED]: '订单已取消',
  [OrderStatus.PAID]: '订单已支付',
  [OrderStatus.UNPAID]: '订单未支付',
  [OrderStatus.REFUNDING]: '订单退款中',
  [OrderStatus.REFUNDED]: '订单已退款',
  [OrderStatus.USED]: '订单已使用',
  [OrderStatus.EXCEPTION]: '订单异常',
};
