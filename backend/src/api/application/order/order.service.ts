import configuration from 'config/configuration';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommodityDomainService } from '@/api/domain/commodity/commodity.domain.service';
import { UserDomainService } from '@/api/domain/user/user.domain.service';
import { CouponDomainService } from '@/api/domain/coupon/coupon.domain.service';
import { OrderDomainService } from '@/api/domain/order/order.domain.service';
import { WxpayClient } from '@/api/infrastructure/wxpay/wxpay.client';
import { OrderAdapter as OrderDaoAdapter } from '@/api/infrastructure/order/order.adapter';
import { OrderAdapter } from './order.adapter';
import {
  ChooseCommodity,
  OrderAddDto,
  OrderCancelDto,
  OrderDetailChildDto,
  OrderDetailDto,
  OrderPageDto,
  OrderQueryDto,
  OrderRefundsDto,
  OrderUpdateRemarksDto,
  OrderUseDto,
  OrderUseGrassDto,
  SignDto,
  WxCallbackDto,
} from './order.dto';
import {
  ERROR_COMMODITY_NOT_FOUND,
  ERROR_COMMODITY_REST,
  ERROR_USER_NOT_FOUND,
} from '@/common/constant';
import { OrderDao } from '@/api/infrastructure/order/order.dao';
import { OrderStatus } from '@/api/domain/order/order.entity';
import { CommodityType } from '@/api/domain/commodity/attribute.ticket.vo';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IsToday, NewDate } from '@/utils/time';
import { EnumCommodityStatus } from '@/api/domain/commodity/commodity.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly commodityDomainService: CommodityDomainService,
    private readonly userDomainService: UserDomainService,
    private readonly couponDomainService: CouponDomainService,
    private readonly orderDomainService: OrderDomainService,
    private readonly orderDao: OrderDao,
    private readonly orderAdapter: OrderAdapter,
    private readonly orderDaoAdapter: OrderDaoAdapter,
    private readonly wxpayClient: WxpayClient,
  ) {}

  async Add(orderAddDto: OrderAddDto) {
    const user = await this.userDomainService.Detail(orderAddDto.userId);
    if (!user) throw new InternalServerErrorException(ERROR_USER_NOT_FOUND);
    const commodityCoupons = await this.GetCommodityCoupons(
      orderAddDto.chooseCommodityList,
    );
    // 减去库存
    await this.commodityDomainService.SubStock(
      commodityCoupons.map(([commodity]) => commodity),
    );
    // 生成订单
    const orderTotal = this.orderAdapter.ToEntity(commodityCoupons, user);
    const newOrderTotal = await this.orderDomainService.Add(orderTotal);
    return this.orderAdapter.ToVo(newOrderTotal);
  }

  async Query(orderQueryDto: OrderQueryDto) {
    const orderTotalList = await this.orderDomainService.Query(
      orderQueryDto.userId,
    );
    return this.orderAdapter.ToVoList(orderTotalList);
  }

  async Page(orderPageDto: OrderPageDto) {
    // 查询条件转换
    if (orderPageDto.phone) {
      const user = await this.userDomainService.DetailByPhone(
        orderPageDto.phone,
      );
      orderPageDto._userId = user?.id || 'no user';
    }
    if (orderPageDto.createStartTime)
      orderPageDto._createStartTime = new Date(orderPageDto.createStartTime);
    if (orderPageDto.createEndTime)
      orderPageDto._createEndTime = new Date(orderPageDto.createEndTime);
    if (orderPageDto.useStartTime)
      orderPageDto._useStartTime = new Date(orderPageDto.useStartTime);
    if (orderPageDto.useEndTime)
      orderPageDto._useEndTime = new Date(orderPageDto.useEndTime);
    if (orderPageDto.ticketTypes || orderPageDto.ticketDate) {
      const commodityList =
        await this.commodityDomainService.QueryByNamesAndDate(
          orderPageDto.ticketTypes?.split(','),
          NewDate(orderPageDto.ticketDate),
        );
      orderPageDto._commodityIds = commodityList.map(
        (commodity) => commodity.id,
      );
    }

    // 分页查询子订单
    const { data, total } = await this.orderDao.PageAllOrder(orderPageDto);
    // 获取相关用户
    const userIdList = new Set(data.map((order) => order.userId));
    const userList = await this.userDomainService.QueryByIds(userIdList);
    // 获取相关商品
    const commodityIdList = new Set(data.map((order) => order.commodityId));
    const commodityList =
      await this.commodityDomainService.QueryByIds(commodityIdList);
    // 获取相关优惠券
    const couponIdList = new Set(data.map((order) => order.couponId));
    const couponList = await this.couponDomainService.QueryByIds(couponIdList);
    // 拼装订单orderList
    const orderList = this.orderDaoAdapter.ToOrderEntityList(
      data,
      commodityList,
      couponList,
      userList,
    );
    // 返回分页数据
    return this.orderAdapter.ToOrderPageVo(
      orderList,
      orderPageDto.pageSize,
      orderPageDto.pageNumber,
      total,
    );
  }

  async Detail(orderDetailDto: OrderDetailDto) {
    const orderTotal = await this.orderDomainService.Detail(orderDetailDto.id);
    return this.orderAdapter.ToVo(orderTotal);
  }

  async UpdateRemarks(orderUpdateRemarksDto: OrderUpdateRemarksDto) {
    await this.orderDomainService.UpdateRemarks(
      orderUpdateRemarksDto.id,
      orderUpdateRemarksDto.remarks,
    );
  }

  async DetailByChild(orderDetailChildDto: OrderDetailChildDto) {
    const orderTotal = await this.orderDao.FindOneByChildId(
      orderDetailChildDto.id,
    );
    return this.orderAdapter.ToVo(orderTotal);
  }

  async DetailChild(orderDetailChildDto: OrderDetailChildDto) {
    const orderChild = await this.orderDomainService.DetailChild(
      orderDetailChildDto.id,
    );
    return this.orderAdapter.ToOrderVo(orderChild);
  }

  async Cancel(orderCancelDto: OrderCancelDto) {
    // 取消订单
    const orderTotal = await this.orderDomainService.Cancel(orderCancelDto.id);
    // 获取订单所有商品
    const commodityList = orderTotal.children.map(
      (orderChild) => orderChild.commodity,
    );
    // 修改库存
    await this.commodityDomainService.RecoverStock(commodityList);
  }

  async Refunds(orderRefundsDto: OrderRefundsDto) {
    const orderTotal = await this.orderDomainService.Refunds(
      orderRefundsDto.orderTotalId,
      orderRefundsDto.orderIds,
    );
    // 获取订单所有商品
    const commodityList = orderTotal.children.map(
      (orderChild) => orderChild.commodity,
    );
    // 修改库存
    await this.commodityDomainService.RecoverStock(commodityList);
  }

  async Use(orderUseDto: OrderUseDto) {
    await this.orderDomainService.Use(orderUseDto.id);
  }

  async UseGrass(orderUseGrassDto: OrderUseGrassDto) {
    // 分页查询子订单
    const orderTotalList = await this.orderDao.FindAll(orderUseGrassDto.id);
    const allChildOrderList = orderTotalList.flatMap(
      (orderTotal) => orderTotal.children,
    );
    const grassPaidOrderList = allChildOrderList.filter(
      (orderChild) =>
        IsToday(orderChild.commodity.date) &&
        orderChild.status === OrderStatus.PAID &&
        orderChild.commodity.attribute.type === CommodityType.Grass,
    );
    // 当草料订单数量不足时，返回剩余数量让前端提示
    if (orderUseGrassDto.number > grassPaidOrderList.length)
      return grassPaidOrderList.length;
    for (let i = 0; i < orderUseGrassDto.number; i++) {
      await this.orderDomainService.Use(grassPaidOrderList[i].id);
    }
  }

  /**
   * @param chooseCommodityList 选择的商品Id和优惠券Id
   * @returns 商品和优惠券的二维数组
   */
  async GetCommodityCoupons(chooseCommodityList: ChooseCommodity[]) {
    const allOrderPromises = chooseCommodityList.map((chooseCommodity) => {
      return Promise.all([
        this.commodityDomainService.Detail(chooseCommodity.commodityId),
        this.couponDomainService.Detail(chooseCommodity.couponId),
      ]);
    });
    const orderList = await Promise.all(allOrderPromises);
    orderList.forEach(([commodity]) => {
      // 校验商品是否存在
      if (!commodity)
        throw new InternalServerErrorException(ERROR_COMMODITY_NOT_FOUND);
      // 校验商品状态是否可购买
      if (commodity.status === EnumCommodityStatus.REST)
        throw new InternalServerErrorException(ERROR_COMMODITY_REST);
    });
    return orderList;
  }

  /**
   * 支付成功回调
   */
  async PaySuccess(wxCallbackDto: WxCallbackDto): Promise<void> {
    const paidDetail = this.wxpayClient.decipher_gcm(
      wxCallbackDto.resource.ciphertext,
      wxCallbackDto.resource.associated_data,
      wxCallbackDto.resource.nonce,
      configuration.wechat.apiV3Key,
    );
    if (paidDetail.trade_state !== 'SUCCESS') return;
    const orderId = paidDetail.out_trade_no;
    await this.orderDomainService.PaySuccess(orderId);
  }

  /**
   * 退款成功回调
   */
  async RefundsSuccess(wxCallbackDto: WxCallbackDto): Promise<void> {
    const refundsDetail = this.wxpayClient.decipher_gcm(
      wxCallbackDto.resource.ciphertext,
      wxCallbackDto.resource.associated_data,
      wxCallbackDto.resource.nonce,
      configuration.wechat.apiV3Key,
    );
    if (refundsDetail.refund_status !== 'SUCCESS') return;
    const refundId = refundsDetail.out_refund_no;
    await this.orderDomainService.RefundsSuccess(refundId);
  }

  /**
   * 获取签名
   */
  async getSign(signDto: SignDto): Promise<string> {
    return this.wxpayClient.getSignature(
      signDto.appId,
      signDto.timeStamp,
      signDto.nonceStr,
      signDto.package,
    );
  }

  /**
   * 把超时的订单状态变成取消
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async CancelTimeoutOrder() {
    const now = new Date();
    const orderPageDto = new OrderPageDto();
    orderPageDto.status = OrderStatus.UNPAID;
    orderPageDto.pageSize = 100;
    orderPageDto.pageNumber = 1;
    const orderTotalIdSet = new Set<string>();
    // 获取所有未支付的订单，使用分页接口，懒得重新写一个了
    const orderChildList = await this.orderDao.PageAllOrder(orderPageDto);
    orderChildList.data?.forEach((orderChild) => {
      // 筛选出10分钟内未支付的订单，把parentId放入set
      if (now.getTime() - orderChild.createTime.getTime() > 10 * 60 * 1000) {
        orderTotalIdSet.add(orderChild.parentId);
      }
    });
    // 循环取消订单
    for (const orderTotalId of orderTotalIdSet) {
      await this.Cancel({ id: orderTotalId });
    }
  }
}
