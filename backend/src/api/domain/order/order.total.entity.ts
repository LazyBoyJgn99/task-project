import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { OrderStatus } from './order.entity';
import { Order } from './order.entity';

@Entity()
export class OrderTotal extends Order {
  @Column({ nullable: true })
  prepayId: string;

  @Column({ nullable: true })
  payTime: Date;

  children: OrderTotal[];

  get price(): number {
    return this.amount;
  }

  get user(): User {
    return this.consumer;
  }
}
