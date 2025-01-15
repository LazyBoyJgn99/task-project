import { Repository } from 'typeorm';
import { Gift } from '@/api/domain/gift/gift.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftAdapter } from './gift.adapter';
import { GiftPo } from './gift.po';
import { UserDao } from '../user/user.dao';

@Injectable()
export class GiftDao {
  constructor(
    @InjectRepository(GiftPo)
    private readonly giftRepository: Repository<GiftPo>,
    private readonly giftAdapter: GiftAdapter,
    @Inject(forwardRef(() => UserDao))
    private readonly userDao: UserDao,
  ) {}

  async Save(gift: Gift) {
    const giftPo = this.giftAdapter.ToPo(gift);
    const newGiftPo = await giftPo.save();
    return this.giftAdapter.ToEntity(newGiftPo, gift.user);
  }

  async FindOne(id: string) {
    const giftPo = await this.giftRepository.findOne({ where: { id } });
    if (!giftPo) return null;
    const user = await this.userDao.FindOne(giftPo.userId);
    return this.giftAdapter.ToEntity(giftPo, user);
  }

  async FindAll(userId: string) {
    const user = await this.userDao.FindOne(userId);
    const giftPoList = await this.giftRepository.find({
      where: { userId },
      order: { createTime: 'DESC' },
    });
    if (!giftPoList.length) return [];
    return this.giftAdapter.ToEntityList(giftPoList, user);
  }
}
