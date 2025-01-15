import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPo } from './user.po';
import { UserDao } from './user.dao';
import { UserAdapter } from './user.adapter';
import { GiftModule } from '../gift/gift.module';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserPo]), GiftModule, CouponModule],
  providers: [UserAdapter, UserDao],
  exports: [UserDao],
})
export class UserModule {}
