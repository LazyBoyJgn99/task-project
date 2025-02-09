import { Entity, Column } from 'typeorm';
import { BasePo } from '@/common/base.po';
import { EnumCommodityStatus } from '@/api/domain/commodity/commodity.entity';

@Entity({
  name: 'commodity',
  comment: '商品',
})
export class CommodityPo extends BasePo {
  @Column({
    type: 'varchar',
    length: 20,
    comment: '商品名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 200,
    comment: '商品属性',
    nullable: true,
  })
  attribute: string;

  @Column({
    type: 'date',
    comment: '适用日期',
    nullable: true,
  })
  date: Date | string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    comment: '商品价格',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({
    type: 'int',
    comment: '库存',
  })
  stock: number;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '商品状态',
    nullable: true,
  })
  status: EnumCommodityStatus;
}
