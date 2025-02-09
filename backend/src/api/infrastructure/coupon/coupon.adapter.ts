import { Injectable } from '@nestjs/common';
import { Coupon } from '@/api/domain/coupon/coupon.entity';
import { CouponStatus } from '@/api/domain/coupon/type';
import { User } from '@/api/domain/user/user.entity';
import { CouponPo } from './coupon.po';

@Injectable()
export class CouponAdapter {
  ToPo(coupon: Coupon) {
    const couponPo = new CouponPo();
    couponPo.id = coupon.id;
    couponPo.userId = coupon.user.id;
    couponPo.name = coupon.name;
    couponPo.status = coupon.status;
    couponPo.strategy = coupon.strategy;
    couponPo.canUseTime = coupon.canUseTime;
    return couponPo;
  }

  ToPoList(couponList: Coupon[]) {
    return couponList.map((coupon) => this.ToPo(coupon));
  }

  ToEntity(couponPo: CouponPo, user: User) {
    const coupon = new Coupon();
    coupon.id = couponPo.id;
    coupon.user = user;
    coupon.name = couponPo.name;
    coupon.status = couponPo.status as CouponStatus;
    coupon.strategy = couponPo.strategy;
    coupon.canUseTime = couponPo.canUseTime;
    return coupon;
  }

  ToEntityList(couponPoList: CouponPo[], user: User) {
    return couponPoList.map((couponPo) => this.ToEntity(couponPo, user));
  }
}
