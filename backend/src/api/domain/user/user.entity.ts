import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

export enum UserRole {
  ADMIN = 'admin',     // 管理员
  CONSUMER = 'consumer', // 消费者
  WORKER = 'worker'    // 接单者
}

export enum UserStatus {
  ACTIVE = 'active',   // 正常
  BANNED = 'banned'    // 禁用
}

export enum EnumGender {
  MALE = 'M',
  FEMALE = 'F',
  UNKNOWN = 'U'
}

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONSUMER
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;

  @Column({ nullable: true })
  openId: string;

  @Column({ 
    type: 'enum',
    enum: EnumGender,
    default: EnumGender.UNKNOWN,
    nullable: true 
  })
  gender: EnumGender;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  cityCode: string;

  clone(): User {
    const user = new User();
    user.id = this.id;
    user.name = this.name;
    user.phone = this.phone;
    user.role = this.role;
    user.status = this.status;
    user.openId = this.openId;
    user.gender = this.gender;
    user.points = this.points;
    user.birthday = this.birthday;
    user.cityCode = this.cityCode;
    return user;
  }

  getLevel(): number {
    // 根据积分计算等级，例如每1000分一个等级
    return Math.floor(this.points / 1000) + 1;
  }
}
