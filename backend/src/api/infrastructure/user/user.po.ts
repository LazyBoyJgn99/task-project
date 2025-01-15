import { Entity, Column } from 'typeorm';
import { BasePo } from '@/common/base.po';
import { EnumGender } from '@/api/domain/user/user.entity';

@Entity({
  name: 'user',
  comment: '用户',
})
export class UserPo extends BasePo {
  @Column({
    type: 'varchar',
    length: 20,
    comment: '用户名',
  })
  name: string;

  @Column({
    name: 'open_id',
    type: 'varchar',
    length: 50,
    comment: '微信小程序openId',
  })
  openId: string;

  @Column({
    type: 'varchar',
    length: 16,
    comment: '手机号',
  })
  phone: string;

  @Column({
    type: 'int',
    comment: '积分',
  })
  points: number;

  @Column({
    type: 'date',
    comment: '生日',
    nullable: true,
  })
  birthday: Date | string;

  @Column({
    type: 'varchar',
    length: 2,
    comment: '性别',
    nullable: true,
  })
  gender: EnumGender;

  @Column({
    name: 'city_code',
    type: 'varchar',
    length: 10,
    comment: '城市编码',
    nullable: true,
  })
  cityCode: string;
}
