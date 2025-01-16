import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CouponDomainService } from '@/api/domain/coupon/coupon.domain.service';
import { UserDomainService } from '@/api/domain/user/user.domain.service';
import { CouponAdapter } from './coupon.adapter';
import {
  CouponAddDto,
  CouponQueryDto,
  CouponVo,
  CouponUpdateDto,
  CouponQueryDetailDto,
} from './coupon.dto';
import {
  ERROR_COUPON_NOT_FOUND,
  ERROR_USER_NOT_FOUND,
} from '@/common/constant';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponDomainService: CouponDomainService,
    private readonly couponAdapter: CouponAdapter,
    private readonly userDomainService: UserDomainService,
  ) {}

  async Add(couponAddDto: CouponAddDto): Promise<void> {
    const user = await this.userDomainService.findById(couponAddDto.userId);
    if (!user) throw new InternalServerErrorException(ERROR_USER_NOT_FOUND);
    const coupon = this.couponAdapter.ToEntityWhenAdd(couponAddDto, user);
    await this.couponDomainService.Add(coupon);
  }

  async Delete(id: string): Promise<void> {
    await this.couponDomainService.Delete(id);
  }

  async Update(couponUpdateDto: CouponUpdateDto): Promise<void> {
    const oldCoupon = await this.couponDomainService.Detail(couponUpdateDto.id);
    if (!oldCoupon)
      throw new InternalServerErrorException(ERROR_COUPON_NOT_FOUND);
    const coupon = this.couponAdapter.ToEntityWhenUpdate(
      couponUpdateDto,
      oldCoupon.user,
    );
    await this.couponDomainService.Update(coupon);
  }

  async Query(couponQueryDto: CouponQueryDto): Promise<CouponVo[]> {
    const couponList = await this.couponDomainService.Query(
      couponQueryDto.userId,
      couponQueryDto.name,
    );
    const couponQueryVoList = this.couponAdapter.ToVoList(couponList);
    return couponQueryVoList;
  }

  async Detail(couponQueryDetailDto: CouponQueryDetailDto): Promise<CouponVo> {
    const coupon = await this.couponDomainService.Detail(
      couponQueryDetailDto.id,
    );
    return this.couponAdapter.ToVo(coupon);
  }
}
