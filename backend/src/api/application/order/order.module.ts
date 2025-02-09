import { Module } from '@nestjs/common';
import { DomainModule } from '@/api/domain/domain.module';
import { InfrastructureModule } from '@/api/infrastructure/infrastructure.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderAdapter } from './order.adapter';
import { UserModule } from '../user/user.module';
import { CouponModule } from '../coupon/coupon.module';
import { CommodityModule } from '../commodity/commodity.module';

@Module({
  controllers: [OrderController],
  imports: [
    DomainModule,
    InfrastructureModule,
    UserModule,
    CouponModule,
    CommodityModule,
  ],
  providers: [OrderService, OrderAdapter],
})
export class OrderModule {}
