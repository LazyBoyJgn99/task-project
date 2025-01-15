import { In, Repository } from 'typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '@/api/domain/coupon/coupon.entity';
import { CouponAdapter } from './coupon.adapter';
import { CouponPo } from './coupon.po';
import { UserDao } from '../user/user.dao';

@Injectable()
export class CouponDao {
  constructor(
    @InjectRepository(CouponPo)
    private readonly couponRepository: Repository<CouponPo>,
    private readonly couponAdapter: CouponAdapter,
    @Inject(forwardRef(() => UserDao))
    private readonly userDao: UserDao,
  ) {}

  async Save(coupon: Coupon) {
    const couponPo = this.couponAdapter.ToPo(coupon);
    const newCouponPo = await couponPo.save();
    return this.couponAdapter.ToEntity(newCouponPo, coupon.user);
  }

  async SaveBatch(coupon: Coupon[]) {
    const couponPo = this.couponAdapter.ToPoList(coupon);
    await this.couponRepository.save(couponPo);
  }

  async Remove(id: string) {
    await this.couponRepository.delete({ id });
  }

  async FindOne(id: string) {
    if (id === undefined) return null;
    const couponPo = await this.couponRepository.findOne({ where: { id } });
    if (!couponPo) return null;
    const user = await this.userDao.FindOne(couponPo.userId);
    return couponPo && this.couponAdapter.ToEntity(couponPo, user);
  }

  async FindAll(userId: string, name?: string) {
    const couponPoList = await this.couponRepository.find({
      where: { userId, name },
    });
    const user = await this.userDao.FindOne(userId);
    return this.couponAdapter.ToEntityList(couponPoList, user);
  }

  async FindAllByIds(ids: string[]) {
    const couponPoList = await this.couponRepository.find({
      where: { id: In(ids) },
    });
    if (!couponPoList.length) return [];
    const user = await this.userDao.FindOne(couponPoList[0].userId);
    return this.couponAdapter.ToEntityList(couponPoList, user);
  }
}
