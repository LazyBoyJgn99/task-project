import { Coupon } from '@/api/domain/coupon/coupon.entity';
import { Injectable } from '@nestjs/common';
import { CouponAddDto, CouponVo, CouponUpdateDto } from './coupon.dto';
import { CouponStatus } from '@/api/domain/coupon/type';
import { User } from '@/api/domain/user/user.entity';
import { UserAdapter } from '../user/user.adapter';

@Injectable()
export class CouponAdapter {
  constructor(private readonly userAdapter: UserAdapter) {}

  ToEntityWhenAdd(couponAddDto: CouponAddDto, user: User) {
    const coupon = new Coupon();
    coupon.name = couponAddDto.name;
    coupon.status = CouponStatus.UNUSED;
    coupon.strategy = couponAddDto.strategy;
    coupon.canUseTime = couponAddDto.canUseTime;
    coupon.user = user;
    return coupon;
  }

  ToEntityWhenUpdate(couponUpdateDto: CouponUpdateDto, user: User) {
    const coupon = new Coupon();
    coupon.id = couponUpdateDto.id;
    coupon.name = couponUpdateDto.name;
    coupon.strategy = couponUpdateDto.strategy;
    coupon.canUseTime = couponUpdateDto.canUseTime;
    coupon.user = user;
    return coupon;
  }

  ToVo(coupon: Coupon) {
    const couponQueryVo = new CouponVo();
    couponQueryVo.id = coupon.id;
    couponQueryVo.name = coupon.name;
    couponQueryVo.status = coupon.status;
    couponQueryVo.strategy = coupon.strategy;
    couponQueryVo.canUseTime = coupon.canUseTime;
    couponQueryVo.user = this.userAdapter.ToVo(coupon.user);
    return couponQueryVo;
  }

  ToVoList(couponList: Coupon[]) {
    return couponList.map((coupon) => this.ToVo(coupon));
  }
}
