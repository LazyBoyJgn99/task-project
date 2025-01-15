import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/api/infrastructure/infrastructure.module';
import { UserDomainService } from './user/user.domain.service';
import { CommodityDomainService } from './commodity/commodity.domain.service';
import { CouponDomainService } from './coupon/coupon.domain.service';
import { OrderDomainService } from './order/order.domain.service';
import { GiftDomainService } from './gift/gift.domain.service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    UserDomainService,
    CommodityDomainService,
    CouponDomainService,
    CommodityDomainService,
    OrderDomainService,
    GiftDomainService,
  ],
  exports: [
    UserDomainService,
    CommodityDomainService,
    CouponDomainService,
    CommodityDomainService,
    OrderDomainService,
    GiftDomainService,
  ],
})
export class DomainModule {}
