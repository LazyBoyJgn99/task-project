import { Module } from '@nestjs/common';
import { DomainModule } from '@/api/domain/domain.module';
import { InfrastructureModule } from '@/api/infrastructure/infrastructure.module';
import { CommodityController } from './commodity.controllet';
import { CommodityService } from './commodity.service';
import { CommodityAdapter } from './commodity.adapter';

@Module({
  controllers: [CommodityController],
  imports: [DomainModule, InfrastructureModule],
  providers: [CommodityService, CommodityAdapter],
  exports: [CommodityAdapter],
})
export class CommodityModule {}
