import { Entity, Column } from 'typeorm';
import { BasePo } from '@/common/base.po';
import { CouponStatus } from '@/api/domain/coupon/type';

@Entity({
  name: 'coupon',
  comment: '优惠券',
})
export class CouponPo extends BasePo {
  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 50,
    comment: '用户Id',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '优惠券名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 12,
    comment: '使用状态',
  })
  status: CouponStatus;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '优惠策略',
  })
  strategy: string;

  @Column({
    name: 'can_use_time',
    type: 'varchar',
    length: 50,
    comment: '适用时间',
  })
  canUseTime: string;
}
