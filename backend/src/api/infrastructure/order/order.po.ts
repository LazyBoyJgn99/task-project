import { Entity, Column } from 'typeorm';
import { BasePo } from '@/common/base.po';
import { OrderStatus } from '@/api/domain/order/order.entity';

@Entity('order')
export class OrderPo extends BasePo {
  @Column()
  orderNo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ nullable: true })
  consumerId: string;

  @Column({ nullable: true })
  workerId: string;

  @Column({ nullable: true })
  taskId: string;

  @Column({ nullable: true })
  paymentTime: Date;

  @Column({ nullable: true })
  completionTime: Date;

  @Column({ nullable: true })
  cancelTime: Date;
}
