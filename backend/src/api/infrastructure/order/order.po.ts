import { Entity, Column } from 'typeorm';
import { BasePo } from '@/common/base.po';
import { OrderStatus } from '@/api/domain/order/order.entity';

@Entity({
  name: 'order',
  comment: '订单',
})
export class OrderPo extends BasePo {
  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 50,
    comment: '用户Id',
  })
  userId: string;

  @Column({
    name: 'commodity_id',
    type: 'varchar',
    length: 50,
    comment: '商品Id',
    nullable: true,
  })
  commodityId?: string;

  @Column({
    name: 'coupon_id',
    type: 'varchar',
    length: 50,
    comment: '优惠券Id',
    nullable: true,
  })
  couponId?: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '订单状态',
    nullable: true,
  })
  status?: OrderStatus;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    comment: '订单价格',
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price?: number;

  @Column({
    name: 'parent_id',
    type: 'varchar',
    length: 50,
    comment: '父订单Id',
    nullable: true,
  })
  parentId?: string;

  @Column({
    name: 'prepay_id',
    type: 'varchar',
    length: 50,
    comment: '微信预支付订单id',
    nullable: true,
  })
  prepayId?: string;

  @Column({
    name: 'refund_id',
    type: 'varchar',
    length: 50,
    comment: '微信退款订单id',
    nullable: true,
  })
  refundId?: string;

  @Column({
    name: 'pay_time',
    type: 'datetime',
    comment: '支付时间',
    nullable: true,
  })
  payTime?: Date;

  @Column({
    name: 'refund_time',
    type: 'datetime',
    comment: '退款时间',
    nullable: true,
  })
  refundTime?: Date;

  @Column({
    name: 'use_time',
    type: 'datetime',
    comment: '使用时间',
    nullable: true,
  })
  useTime?: Date;

  @Column({
    type: 'varchar',
    length: 200,
    comment: '订单备注',
    nullable: true,
  })
  remarks?: string;
}
