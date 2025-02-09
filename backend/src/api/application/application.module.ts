import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommodityModule } from './commodity/commodity.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { TianModule } from '../infrastructure/tian/tian.module';
import { GiftModule } from './gift/gift.module';

@Module({
  imports: [
    UserModule,
    CommodityModule,
    CouponModule,
    OrderModule,
    GiftModule,
    TianModule,
  ],
})
export class ApiModule {}
