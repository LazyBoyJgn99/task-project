import { Injectable } from '@nestjs/common';
import { Commodity } from '@/api/domain/commodity/commodity.entity';
import { Order, OrderStatus } from '@/api/domain/order/order.entity';
import { User } from '@/api/domain/user/user.entity';
import { Coupon } from '@/api/domain/coupon/coupon.entity';
import { OrderTotal } from '@/api/domain/order/order.total.entity';
import { TimeToString } from '@/utils/time';
import { OrderTotalVo, OrderVo } from './order.dto';
import { UserAdapter } from '../user/user.adapter';
import { CommodityAdapter } from '../commodity/commodity.adapter';
import { CouponAdapter } from '../coupon/coupon.adapter';
import { PageVo } from '@/common/base.vo';

@Injectable()
export class OrderAdapter {
  constructor(
    private readonly userAdapter: UserAdapter,
    private readonly couponAdapter: CouponAdapter,
    private readonly commodityAdapter: CommodityAdapter,
  ) {}

  ToOrderPageVo(
    orders: Order[],
    pageSize: number,
    pageNumber: number,
    total: number,
  ) {
    const orderVos = orders.map((item) => this.ToOrderVo(item));
    const orderPageVo = new PageVo<OrderVo>();
    orderPageVo.pageSize = pageSize;
    orderPageVo.pageNumber = pageNumber;
    orderPageVo.total = total;
    orderPageVo.list = orderVos;
    return orderPageVo;
  }

  ToOrderEntity(commodity: Commodity, user: User, coupon: Coupon) {
    const order = new Order();
    order.commodity = commodity;
    order.user = user;
    order.coupon = coupon;
    order.status = OrderStatus.UNPAID;
    order.price = commodity.price;
    return order;
  }

  ToEntity(commodityCoupons: [Commodity, Coupon][], user: User) {
    const orderTotal = new OrderTotal();
    orderTotal.user = user;
    const children = [];
    commodityCoupons.forEach(([commodity, coupon]) => {
      const order = this.ToOrderEntity(commodity, user, coupon);
      children.push(order);
    });
    orderTotal.children = children;
    return orderTotal;
  }

  ToOrderVo(order: Order) {
    const orderVo = new OrderVo();
    orderVo.id = order.id;
    orderVo.status = order.status;
    orderVo.price = order.price;
    orderVo.remarks = order.remarks;
    orderVo.refundId = order.refundId;
    orderVo.createTime = TimeToString(order.createTime);
    orderVo.updateTime = TimeToString(order.updateTime);
    orderVo.refundTime = TimeToString(order.refundTime);
    orderVo.useTime = TimeToString(order.useTime);
    orderVo.commodity = this.commodityAdapter.ToVo(order.commodity);
    orderVo.user = this.userAdapter.ToVo(order.user);
    orderVo.coupon = order.coupon && this.couponAdapter.ToVo(order.coupon);
    return orderVo;
  }

  ToOrderVoList(orderList: Order[]) {
    return orderList.map((order) => this.ToOrderVo(order));
  }

  ToVo(orderTotal: OrderTotal) {
    const orderTotalVo = new OrderTotalVo();
    orderTotalVo.id = orderTotal.id;
    orderTotalVo.user = this.userAdapter.ToVo(orderTotal.user);
    orderTotalVo.price = orderTotal.price;
    orderTotalVo.prepayId = orderTotal.prepayId;
    orderTotalVo.createTime = TimeToString(orderTotal.createTime);
    orderTotalVo.updateTime = TimeToString(orderTotal.updateTime);
    orderTotalVo.payTime = TimeToString(orderTotal.payTime);
    orderTotalVo.children = this.ToOrderVoList(orderTotal.children);
    return orderTotalVo;
  }

  ToVoList(orderTotalList: OrderTotal[]) {
    return orderTotalList.map((orderTotal) => this.ToVo(orderTotal));
  }
}
