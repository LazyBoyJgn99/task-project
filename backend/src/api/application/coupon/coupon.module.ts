import { Module } from '@nestjs/common';
import { DomainModule } from '@/api/domain/domain.module';
import { InfrastructureModule } from '@/api/infrastructure/infrastructure.module';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponAdapter } from './coupon.adapter';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [CouponController],
  imports: [DomainModule, InfrastructureModule, UserModule],
  providers: [CouponService, CouponAdapter],
  exports: [CouponAdapter],
})
export class CouponModule {}
