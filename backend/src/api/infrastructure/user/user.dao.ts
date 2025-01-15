import { DataSource, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/api/domain/user/user.entity';
import { Gift } from '@/api/domain/gift/gift.entity';
import { Coupon } from '@/api/domain/coupon/coupon.entity';
import { UserPo } from './user.po';
import { UserAdapter } from './user.adapter';
import { GiftAdapter } from '../gift/gift.adapter';
import { CouponAdapter } from '../coupon/coupon.adapter';

@Injectable()
export class UserDao {
  constructor(
    @InjectRepository(UserPo)
    private readonly userRepository: Repository<UserPo>,
    private readonly userAdapter: UserAdapter,
    private readonly dataSource: DataSource,
    private readonly giftAdapter: GiftAdapter,
    private readonly couponAdapter: CouponAdapter,
  ) {}

  async Save(user: User) {
    const userPo = this.userAdapter.ToPo(user);
    const newUserPo = await this.userRepository.save(userPo);
    return this.userAdapter.ToEntity(newUserPo);
  }

  async FindOneByOpenId(openId: string): Promise<User | null> {
    const userPo = await this.userRepository.findOneBy({ openId });
    return userPo && this.userAdapter.ToEntity(userPo);
  }

  async FindOneByPhone(phone: string): Promise<User | null> {
    const userPo = await this.userRepository.findOneBy({ phone });
    return userPo && this.userAdapter.ToEntity(userPo);
  }

  async FindOne(id: string): Promise<User | null> {
    const userPo = await this.userRepository.findOneBy({ id });
    return userPo && this.userAdapter.ToEntity(userPo);
  }

  async FindAllByIds(ids: string[]) {
    const userPoList = await this.userRepository.find({
      where: { id: In(ids) },
    });
    return this.userAdapter.ToEntityList(userPoList);
  }

  async FindAll() {
    const userPoList = await this.userRepository.find();
    return this.userAdapter.ToEntityList(userPoList);
  }

  async GenerateReward(rewards: (Gift | Coupon)[]) {
    await this.dataSource.transaction(async (manager) => {
      for (const reward of rewards) {
        if (reward instanceof Gift) {
          await manager.save(this.giftAdapter.ToPo(reward));
        } else {
          await manager.save(this.couponAdapter.ToPo(reward));
        }
      }
    });
  }
}
