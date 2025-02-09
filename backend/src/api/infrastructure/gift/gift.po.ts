import { GiftStatus } from '@/api/domain/gift/gift.entity';
import { BasePo } from '@/common/base.po';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'gift',
  comment: '卡劵',
})
export class GiftPo extends BasePo {
  @Column({
    type: 'varchar',
    length: 20,
    comment: '卡劵名称',
  })
  name: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 50,
    comment: '用户Id',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 12,
    comment: '卡劵状态',
  })
  status: GiftStatus;

  @Column({
    name: 'can_use_time',
    type: 'varchar',
    length: 50,
    comment: '适用时间',
  })
  canUseTime: string;
}
