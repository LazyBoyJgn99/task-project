import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderDao } from '@/api/infrastructure/order/order.dao';
import { WxpayClient } from '@/api/infrastructure/wxpay/wxpay.client';
// import { WsGateway } from '@/api/infrastructure/ws/ws.gateway';
import { OrderTotal } from './order.total.entity';
import { ERROR_ORDER_NOT_FOUND } from '@/common/constant';
import { Order } from './order.entity';
import { UserDomainService } from '../user/user.domain.service';

@Injectable()
export class OrderDomainService {
  constructor(
    private readonly orderDao: OrderDao,
    private readonly wxpayClient: WxpayClient,
    private readonly userDomainService: UserDomainService,
    // private readonly wsGateway: WsGateway,
  ) {}

  /**
   * 创建订单
   */
  async Add(orderTotal: OrderTotal): Promise<OrderTotal> {
    // 如果使用了优惠券，需要消费优惠券
    orderTotal.children.forEach((order) => {
      order.ConsumCoupon();
    });
    const newOrderTotal = await this.orderDao.Save(orderTotal);
    // 创建微信订单，获得预支付id
    const prepayId = await this.wxpayClient.CreateOrderWX(newOrderTotal);
    if (prepayId) {
      // 创建订单成功
      newOrderTotal.prepayId = prepayId;
      return await this.orderDao.Save(newOrderTotal);
    } else {
      // 创建微信订单失败，把订单变成异常状态
      newOrderTotal.SetError();
      await this.orderDao.Save(newOrderTotal);
      throw new InternalServerErrorException('order creation failed');
    }
  }

  /**
   * 查询总订单列表
   */
  async Query(userId: string): Promise<OrderTotal[]> {
    return await this.orderDao.FindAll(userId);
  }

  /**
   * 查询总订单详情
   */
  async Detail(id: string): Promise<OrderTotal> {
    return await this.orderDao.FindOne(id);
  }

  /**
   * 更新备注
   */
  async UpdateRemarks(id: string, remarks: string) {
    const order = await this.orderDao.FindOneOrder(id);
    if (!order) throw new InternalServerErrorException(ERROR_ORDER_NOT_FOUND);
    order.remarks = remarks || null;
    return await this.orderDao.SaveOrder(order);
  }

  /**
   * 查询子订单详情
   */
  async DetailChild(id: string): Promise<Order> {
    return await this.orderDao.FindOneOrder(id);
  }

  /**
   * 支付成功
   */
  async PaySuccess(orderId: string): Promise<void> {
    const orderTotal = await this.orderDao.FindOne(orderId);
    if (!orderTotal)
      throw new InternalServerErrorException(ERROR_ORDER_NOT_FOUND);
    orderTotal.SetPaid();
    await this.orderDao.Save(orderTotal);
  }

  /**
   * 退款成功
   */
  async RefundsSuccess(refundId: string) {
    const refundsOrderTotal =
      await this.orderDao.FindRefundOrderTotal(refundId);
    if (!refundsOrderTotal)
      throw new InternalServerErrorException(ERROR_ORDER_NOT_FOUND);
    const refundOrderIds = refundsOrderTotal.children.map((order) => order.id);
    refundsOrderTotal.SetRefunded(refundOrderIds);
    await this.orderDao.Save(refundsOrderTotal);
  }

  /**
   * 订单取消
   */
  async Cancel(orderTotalId: string) {
    // 获取总订单
    const orderTotal = await this.orderDao.FindOne(orderTotalId);
    // 取消订单
    orderTotal.SetCancel();
    // 保存订单
    return await this.orderDao.Save(orderTotal);
  }

  /**
   * 发起退款
   */
  async Refunds(orderTotalId: string, orderIds: string[]) {
    // 获取总订单
    const orderTotal = await this.orderDao.FindOne(orderTotalId);
    // 退款订单
    const refundOrderTotal = orderTotal.clone();
    // 过滤掉本次退款外的子订单
    refundOrderTotal.children = refundOrderTotal.children.filter((order) =>
      orderIds.includes(order.id),
    );
    // 更新订单状态
    refundOrderTotal.SetRefunding(orderIds);
    // 调用微信退款能力
    const result = await this.wxpayClient.RefundedOrderWX(
      orderTotal,
      refundOrderTotal,
    );
    if (!result) {
      throw new InternalServerErrorException('refund failed');
    }
    // 保存订单
    return await this.orderDao.Save(refundOrderTotal);
  }

  /**
   * 核销订单
   */
  async Use(id: string) {
    // 订单状态改变
    const order = await this.orderDao.FindOneOrder(id);
    if (!order) throw new InternalServerErrorException(ERROR_ORDER_NOT_FOUND);
    order.SetUsed();
    await this.orderDao.SaveOrder(order);
    // 用户积分保存
    const user = order.user;
    const isLevelUp = user.addPointsByPrice(order.price);
    await this.userDomainService.Update(user);
    // 用户礼物发放
    if (isLevelUp)
      await this.userDomainService.GenerateRewardForVIP(
        user.id,
        user.getLevel(),
      );
    // this.wsGateway.sendToAllClients(id);
  }
}
