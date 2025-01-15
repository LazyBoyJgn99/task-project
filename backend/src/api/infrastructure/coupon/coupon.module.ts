import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponAdapter } from './coupon.adapter';
import { CouponDao } from './coupon.dao';
import { CouponPo } from './coupon.po';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CouponPo]), forwardRef(() => UserModule)],
  providers: [CouponAdapter, CouponDao],
  exports: [CouponAdapter, CouponDao],
})
export class CouponModule {}
