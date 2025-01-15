import { ICommodity } from './commodity';
import { ICoupon } from './coupon';
import { IUser } from './user';

export enum EnumOrderStatus {
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
  // 前端自己加的状态
  /**
   * 支付超时
   */
  TIME_OUT = 'time_out',
}

export enum EnumOrderTotalStatus {
  /**
   * 未支付
   */
  UNPAID = 'unpaid',
  /**
   * 支付超时
   */
  TIME_OUT = 'time_out',
  /**
   * 取消支付
   */
  CANCELED = 'canceled',
  /**
   * 待使用
   */
  UNUSED = 'unused',
  /**
   * 退款中
   */
  REFUNDING = 'refunding',
  /**
   * 已退款
   */
  REFUNDED = 'refunded',
  /**
   * 全部已使用
   */
  USED = 'used',
  /**
   * 异常
   */
  EXCEPTION = 'exception',
}

export interface IOrder {
  id: string;

  status: EnumOrderStatus;

  user: IUser;

  commodity: ICommodity;

  coupon?: any;

  price: number;

  createTime: string;

  updateTime: string;

  refundTime?: string;

  useTime?: string;

  refundId?: string;

  _status: EnumOrderStatus;
}

export interface IOrderTotal {
  id: string;

  user: IUser;

  price: number;

  prepayId?: string;

  createTime: string;

  updateTime: string;

  payTime?: string;

  _status: EnumOrderTotalStatus;

  children: IOrder[];
}

export function orderStatusFormat(status: EnumOrderStatus) {
  switch (status) {
    case EnumOrderStatus.UNPAID:
      return '待付款';
    case EnumOrderStatus.TIME_OUT:
      return '支付超时';
    case EnumOrderStatus.PAID:
      return '待使用';
    case EnumOrderStatus.CANCELED:
      return '已取消';
    case EnumOrderStatus.REFUNDING:
      return '退款中';
    case EnumOrderStatus.REFUNDED:
      return '已退款';
    case EnumOrderStatus.USED:
      return '已使用';
    case EnumOrderStatus.EXCEPTION:
      return '异常';
    default:
      return '';
  }
}

export function orderTotalStatusFormat(status: EnumOrderTotalStatus) {
  switch (status) {
    case EnumOrderTotalStatus.UNPAID:
      return '待付款';
    case EnumOrderTotalStatus.TIME_OUT:
      return '支付超时';
    case EnumOrderTotalStatus.CANCELED:
      return '已取消';
    case EnumOrderTotalStatus.UNUSED:
      return '待使用';
    case EnumOrderTotalStatus.REFUNDING:
      return '退款中';
    case EnumOrderTotalStatus.REFUNDED:
      return '已退款';
    case EnumOrderTotalStatus.USED:
      return '已使用';
    case EnumOrderTotalStatus.EXCEPTION:
      return '异常';
    default:
      return '';
  }
}

export interface IOrderDisplay {
  id: string;
  name: string;
  number: number;
  price: number;
  attribute?: any;
  coupon?: ICoupon;
  children?: IOrder[];
}

export interface IRefundDisplay extends IOrderDisplay {
  refundNumber: number;
}

export function getPaidStopTime(time: string) {
  time = time.replace(/-/g, '/');
  return new Date(time).getTime() + 10 * 60 * 1000;
}

export function computeOrderTotalStatus(orderTotal: IOrderTotal) {
  const statusList = orderTotal.children.map((order) => order.status);
  const now = new Date().getTime();
  const paidStopTime = getPaidStopTime(orderTotal.createTime);
  const isTimeOut = paidStopTime < now;
  if (statusList.includes(EnumOrderStatus.CANCELED)) {
    // 订单取消
    orderTotal._status = EnumOrderTotalStatus.CANCELED;
  } else if (statusList.includes(EnumOrderStatus.UNPAID)) {
    if (isTimeOut) {
      // 订单支付超时
      orderTotal._status = EnumOrderTotalStatus.TIME_OUT;
    } else {
      // 订单未支付
      orderTotal._status = EnumOrderTotalStatus.UNPAID;
    }
  } else if (statusList.includes(EnumOrderStatus.PAID)) {
    // 订单未使用
    orderTotal._status = EnumOrderTotalStatus.UNUSED;
  } else if (statusList.includes(EnumOrderStatus.REFUNDING)) {
    // 订单退款中
    orderTotal._status = EnumOrderTotalStatus.REFUNDING;
  } else if (statusList.includes(EnumOrderStatus.REFUNDED)) {
    // 订单已退款
    orderTotal._status = EnumOrderTotalStatus.REFUNDED;
  } else if (statusList.includes(EnumOrderStatus.USED)) {
    // 订单已使用
    orderTotal._status = EnumOrderTotalStatus.USED;
  } else {
    // 订单异常
    orderTotal._status = EnumOrderTotalStatus.EXCEPTION;
  }
}

export function computeOrderStatus(order: IOrder) {
  const now = new Date().getTime();
  const paidStopTime = getPaidStopTime(order.createTime);
  const isTimeOut = paidStopTime < now;
  if (order.status === EnumOrderStatus.UNPAID && isTimeOut) {
    order._status = EnumOrderStatus.TIME_OUT;
  } else {
    order._status = order.status;
  }
}

export enum DetailPageType {
  /**
   * 详情
   */
  DETAIL = 'detail',
  /**
   * 支付
   */
  PAY = 'pay',
}
