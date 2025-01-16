import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { Coupon } from '../coupon/coupon.entity';
import { Commodity } from '../commodity/commodity.entity';

export enum OrderStatus {
  PENDING = 'pending',     // 待支付
  PAID = 'paid',          // 已支付
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled', // 已取消
  REFUNDED = 'refunded',   // 已退款
  REFUNDING = 'refunding'  // 退款中
}

@Entity()
export class Order extends BaseEntity {
  @Column()
  orderNo: string;  // 订单编号

  @Column('decimal')
  amount: number;   // 订单金额

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @ManyToOne(() => User)
  consumer: User;   // 消费者

  @ManyToOne(() => User)
  worker: User;     // 接单者

  @ManyToOne(() => Task)
  task: Task;       // 关联任务

  @Column({ nullable: true })
  paymentTime: Date;  // 支付时间

  @Column({ nullable: true })
  completionTime: Date;  // 完成时间

  @Column({ nullable: true })
  cancelTime: Date;  // 取消时间

  @Column({ nullable: true })
  refundId: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  refundTime: Date;

  @Column({ nullable: true })
  useTime: Date;

  @ManyToOne(() => Coupon, { nullable: true })
  coupon: Coupon;

  @ManyToOne(() => Commodity, { nullable: true })
  commodity: Commodity;

  get user(): User {
    return this.consumer;
  }

  get price(): number {
    return this.amount;
  }
}
