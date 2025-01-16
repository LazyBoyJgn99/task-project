import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { User } from '../user/user.entity';

export enum TaskStatus {
  PENDING = 'pending',     // 待接单
  ACCEPTED = 'accepted',   // 已接单
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled'  // 已取消
}

@Entity()
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  deadline: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @ManyToOne(() => User)
  publisher: User;  // 发布者

  @ManyToOne(() => User, { nullable: true })
  worker: User;    // 接单者
} 