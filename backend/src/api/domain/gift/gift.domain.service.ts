import { GiftDao } from '@/api/infrastructure/gift/gift.dao';
import { Injectable } from '@nestjs/common';
import { Gift } from './gift.entity';

@Injectable()
export class GiftDomainService {
  constructor(private readonly giftDao: GiftDao) {}

  async Use(id: string) {
    const gift = await this.giftDao.FindOne(id);
    gift.Use();
    await this.giftDao.Save(gift);
  }

  async Add(gift: Gift) {
    await this.giftDao.Save(gift);
  }

  async Query(userId: string) {
    return await this.giftDao.FindAll(userId);
  }

  async Detail(id: string) {
    return await this.giftDao.FindOne(id);
  }
}
