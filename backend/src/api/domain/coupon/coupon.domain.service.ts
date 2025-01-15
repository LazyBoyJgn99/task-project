import { Injectable } from '@nestjs/common';
import { CouponDao } from '@/api/infrastructure/coupon/coupon.dao';
import { Coupon } from './coupon.entity';

@Injectable()
export class CouponDomainService {
  constructor(private readonly couponDao: CouponDao) {}

  async Add(coupon: Coupon): Promise<void> {
    await this.couponDao.Save(coupon);
  }

  async AddBatch(coupon: Coupon[]): Promise<void> {
    await this.couponDao.SaveBatch(coupon);
  }

  async Delete(id: string): Promise<void> {
    await this.couponDao.Remove(id);
  }

  async Update(coupon: Coupon): Promise<void> {
    await this.couponDao.Save(coupon);
  }

  async Query(userId?: string, name?: string): Promise<Coupon[]> {
    return await this.couponDao.FindAll(userId, name);
  }

  async QueryByIds(ids: Set<string>) {
    return await this.couponDao.FindAllByIds([...ids]);
  }

  async Detail(id: string): Promise<Coupon | null> {
    return await this.couponDao.FindOne(id);
  }
}
