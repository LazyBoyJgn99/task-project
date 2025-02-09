import { Injectable } from '@nestjs/common';
import { Order } from '@/api/domain/order/order.entity';
import { OrderTotal } from '@/api/domain/order/order.total.entity';
import { Commodity } from '@/api/domain/commodity/commodity.entity';
import { Coupon } from '@/api/domain/coupon/coupon.entity';
import { User } from '@/api/domain/user/user.entity';
import { OrderPo } from './order.po';

@Injectable()
export class OrderAdapter {
  ToPo(orderTotal: OrderTotal) {
    const orderTotalPo = new OrderPo();
    orderTotalPo.id = orderTotal.id;
    orderTotalPo.userId = orderTotal.user?.id;
    orderTotalPo.prepayId = orderTotal.prepayId;
    orderTotalPo.createTime = orderTotal.createTime;
    orderTotalPo.updateTime = orderTotal.updateTime;
    orderTotalPo.payTime = orderTotal.payTime;
    return orderTotalPo;
  }

  ToEntity(orderTotalPo: OrderPo, user: User) {
    const orderTotal = new OrderTotal();
    orderTotal.id = orderTotalPo.id;
    orderTotal.prepayId = orderTotalPo.prepayId;
    orderTotal.createTime = orderTotalPo.createTime;
    orderTotal.updateTime = orderTotalPo.updateTime;
    orderTotal.payTime = orderTotalPo.payTime;
    orderTotal.user = user;
    return orderTotal;
  }

  ToOrderPo(order: Order): OrderPo {
    const orderPo = new OrderPo();
    orderPo.id = order.id;
    orderPo.parentId = order.parentId;
    orderPo.status = order.status;
    orderPo.price = order.price;
    orderPo.remarks = order.remarks;
    orderPo.createTime = order.createTime;
    orderPo.updateTime = order.updateTime;
    orderPo.refundTime = order.refundTime;
    orderPo.useTime = order.useTime;
    orderPo.refundId = order.refundId;
    orderPo.userId = order?.user.id;
    orderPo.commodityId = order.commodity?.id;
    orderPo.couponId = order.coupon?.id;
    return orderPo;
  }

  ToOrderEntity(
    orderPo: OrderPo,
    commodity: Commodity,
    coupon: Coupon,
    user: User,
  ) {
    const order = new Order();
    order.id = orderPo.id;
    order.status = orderPo.status;
    order.price = orderPo.price;
    order.remarks = orderPo.remarks;
    order.createTime = orderPo.createTime;
    order.updateTime = orderPo.updateTime;
    order.refundTime = orderPo.refundTime;
    order.useTime = orderPo.useTime;
    order.parentId = orderPo.parentId;
    order.refundId = orderPo.refundId;
    order.user = user;
    order.commodity = commodity;
    order.coupon = coupon;
    return order;
  }

  ToOrderEntityList(
    orderPoList: OrderPo[],
    commodityList: Commodity[],
    couponList: Coupon[],
    userList: User[],
  ) {
    return orderPoList.map((orderPo) => {
      const commodity = commodityList.find(
        (commodity) => commodity.id === orderPo.commodityId,
      );
      const coupon = couponList.find(
        (coupon) => coupon.id === orderPo.couponId,
      );
      const user = userList.find((user) => user.id === orderPo.userId);
      return this.ToOrderEntity(orderPo, commodity, coupon, user);
    });
  }

  ToEntityWhenSave(
    oldOrderTotal: OrderTotal,
    newOrderTotalPo: OrderPo,
    newOrderPos: OrderPo[],
  ): OrderTotal {
    oldOrderTotal.id = newOrderTotalPo.id;
    oldOrderTotal.prepayId = newOrderTotalPo.prepayId;
    oldOrderTotal.createTime = newOrderTotalPo.createTime;
    oldOrderTotal.updateTime = newOrderTotalPo.updateTime;
    oldOrderTotal.children = oldOrderTotal.children.map((order, index) => {
      order.id = newOrderPos[index].id;
      order.createTime = newOrderPos[index].createTime;
      order.updateTime = newOrderPos[index].updateTime;
      return order;
    });
    return oldOrderTotal;
  }

  ToEntityWhenQuery(
    orderTotalPo: OrderPo,
    orderPos: OrderPo[],
    commodityList: Commodity[],
    couponList: Coupon[],
    user: User,
  ) {
    const orderTotal = this.ToEntity(orderTotalPo, user);
    orderTotal.children = orderPos.map((orderPo) => {
      const commodity = commodityList.find(
        (commodity) => commodity.id === orderPo.commodityId,
      );
      const coupon = couponList.find(
        (coupon) => coupon.id === orderPo.couponId,
      );
      return this.ToOrderEntity(orderPo, commodity, coupon, user);
    });
    return orderTotal;
  }

  ToEntityListWhenQuery(
    orderTotalPoParent: OrderPo[],
    orderTotalPoChildren: OrderPo[],
    commodityList: Commodity[],
    couponList: Coupon[],
    user: User,
  ) {
    return orderTotalPoParent.map((poParent) => {
      const children = orderTotalPoChildren.filter(
        (item) => item.parentId === poParent.id,
      );
      return this.ToEntityWhenQuery(
        poParent,
        children,
        commodityList,
        couponList,
        user,
      );
    });
  }
}
