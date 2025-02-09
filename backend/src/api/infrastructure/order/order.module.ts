import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPo } from './order.po';
import { OrderDao } from './order.dao';
import { OrderAdapter } from './order.adapter';
import { CouponAdapter } from '../coupon/coupon.adapter';
import { UserModule } from '../user/user.module';
import { CouponModule } from '../coupon/coupon.module';
import { CommodityModule } from '../commodity/commodity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderPo]),
    UserModule,
    CouponModule,
    CommodityModule,
  ],
  providers: [OrderDao, OrderAdapter, CouponAdapter],
  exports: [OrderDao, OrderAdapter],
})
export class OrderModule {}
