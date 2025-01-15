import { Between, DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderAdapter } from './order.adapter';
import { CouponAdapter } from '../coupon/coupon.adapter';
import { OrderTotal } from '@/api/domain/order/order.total.entity';
import { OrderPo } from './order.po';
import { UserDao } from '../user/user.dao';
import { CouponDao } from '../coupon/coupon.dao';
import { CommodityDao } from '../commodity/commodity.dao';
import { Order, OrderStatus } from '@/api/domain/order/order.entity';
import { OrderPageDto } from '@/api/application/order/order.dto';

@Injectable()
export class OrderDao {
  constructor(
    @InjectRepository(OrderPo)
    private readonly orderRepository: Repository<OrderPo>,
    private readonly orderAdapter: OrderAdapter,
    private readonly couponAdapter: CouponAdapter,
    private readonly dataSource: DataSource,
    private readonly userDao: UserDao,
    private readonly couponDao: CouponDao,
    private readonly commodityDao: CommodityDao,
  ) {}

  /**
   * 保存总订单和子订单，并更新优惠券
   * @param orderTotal 总订单
   * @returns OrderTotal
   */
  async Save(orderTotal: OrderTotal) {
    const orderTotalPo = this.orderAdapter.ToPo(orderTotal);
    let newOrderTotalPo: OrderPo;
    const newOrderPos = [];
    // 事务，保存总订单和子订单，更新优惠券
    await this.dataSource.transaction(async (manager) => {
      newOrderTotalPo = await manager.save(orderTotalPo);
      for (const order of orderTotal.children) {
        order.parentId = newOrderTotalPo.id;
        const orderPo = this.orderAdapter.ToOrderPo(order);
        newOrderPos.push(await manager.save(orderPo));
        if (order.coupon) {
          const couponPo = this.couponAdapter.ToPo(order.coupon);
          await manager.save(couponPo);
        }
      }
    });
    // 返回更新后的总订单
    return this.orderAdapter.ToEntityWhenSave(
      orderTotal,
      newOrderTotalPo,
      newOrderPos,
    );
  }

  /**
   * 更新子订单
   * 子订单不能单独创建，只能通过总订单创建
   * @param order Order
   */
  async SaveOrder(order: Order) {
    const orderPo = this.orderAdapter.ToOrderPo(order);
    await orderPo.save();
  }

  /**
   * 查询总订单列表
   * @param userId 用户id
   */
  async FindAll(userId: string) {
    const orderTotalPoList = await this.orderRepository.find({
      where: { userId },
      order: { createTime: 'DESC' },
    });
    if (!orderTotalPoList.length) return [];
    // 把总订单和子订单分开
    const orderTotalParent = orderTotalPoList.filter((item) => !item.parentId);
    const orderTotalChildren = orderTotalPoList.filter((item) => item.parentId);
    const commodityIdList = orderTotalChildren.map(
      (order) => order.commodityId,
    );
    const couponIdList = orderTotalChildren.map((order) => order.couponId);
    // 查询子订单相关的商品和优惠券
    const [commodityList, couponList, user] = await Promise.all([
      this.commodityDao.FindAllByIds(commodityIdList),
      this.couponDao.FindAllByIds(couponIdList),
      this.userDao.FindOne(orderTotalPoList[0].userId),
    ]);
    // 返回总订单列表
    return this.orderAdapter.ToEntityListWhenQuery(
      orderTotalParent,
      orderTotalChildren,
      commodityList,
      couponList,
      user,
    );
  }

  /**
   * 分页查询子订单列表
   */
  async PageAllOrder(orderPageDto: OrderPageDto) {
    const {
      pageNumber,
      pageSize,
      status,
      orderBy,
      order,
      _userId,
      _createStartTime,
      _createEndTime,
      _useStartTime,
      _useEndTime,
      _commodityIds,
    } = orderPageDto;
    const orderField = orderBy || 'createTime';
    const orderValue = order || 'DESC';
    const [data, total] = await this.orderRepository.findAndCount({
      where: {
        userId: _userId,
        status: status,
        createTime:
          _createStartTime && _createEndTime
            ? Between(_createStartTime, _createEndTime)
            : undefined,
        useTime:
          _useStartTime && _useEndTime
            ? Between(_useStartTime, _useEndTime)
            : undefined,
        parentId: Not(IsNull()),
        commodityId: _commodityIds ? In(_commodityIds) : undefined,
      },
      order: {
        [orderField]: orderValue,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    return {
      data,
      total,
    };
  }

  /**
   * 查询总订单详情
   * @param id 订单Id
   */
  async FindOne(id: string) {
    const orderTotalPo = await this.orderRepository.findOne({
      where: { id, parentId: null },
    });
    if (!orderTotalPo) return null;
    // 查询子订单
    const children = await this.orderRepository.find({
      where: { parentId: orderTotalPo.id },
    });
    const commodityIdList = children.map((order) => order.commodityId);
    const couponIdList = children.map((order) => order.couponId);
    // 查询子订单相关的商品和优惠券
    const [commodityList, couponList, user] = await Promise.all([
      this.commodityDao.FindAllByIds(commodityIdList),
      this.couponDao.FindAllByIds(couponIdList),
      this.userDao.FindOne(orderTotalPo.userId),
    ]);
    // 返回订单总信息
    return this.orderAdapter.ToEntityWhenQuery(
      orderTotalPo,
      children,
      commodityList,
      couponList,
      user,
    );
  }

  /**
   * 查询子订单
   * @param id 订单id
   */
  async FindOneOrder(id: string) {
    const orderPo = await this.orderRepository.findOne({ where: { id } });
    if (!orderPo) return null;
    const commodity = await this.commodityDao.FindOne(orderPo.commodityId);
    const user = await this.userDao.FindOne(orderPo.userId);
    const coupon = orderPo.couponId
      ? await this.couponDao.FindOne(orderPo.couponId)
      : null;
    return this.orderAdapter.ToOrderEntity(orderPo, commodity, coupon, user);
  }

  /**
   * @description 查询退款订单，一个退款单号对应一个或多个子订单
   * @description 过滤掉与本次退款无关的子订单
   * @description 过滤掉状态不是退款中的子订单，用于性能优化
   * @param refundId 退款单号
   */
  async FindRefundOrderTotal(refundId: string) {
    // 获取退款相关的所有子订单
    const orderPoList = await this.orderRepository.find({
      where: { refundId, status: OrderStatus.REFUNDING },
    });
    if (!orderPoList.length) return;
    const orderTotalId = orderPoList[0].parentId;
    // 获取总订单
    const orderTotal = await this.FindOne(orderTotalId);
    // 过滤掉与本次退款无关的子订单
    const refundOrderIds = orderPoList.map((order) => order.id);
    orderTotal.children = orderTotal.children.filter((order) =>
      refundOrderIds.includes(order.id),
    );
    return orderTotal;
  }

  async FindOneByChildId(childId: string) {
    const orderPo = await this.orderRepository.findOne({
      where: { id: childId },
    });
    return await this.FindOne(orderPo.parentId);
  }
}
