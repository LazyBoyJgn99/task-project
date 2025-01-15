import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommodityPo } from './commodity.po';
import { CommodityAdapter } from './commodity.adapter';
import { CommodityDao } from './commodity.dao';

@Module({
  imports: [TypeOrmModule.forFeature([CommodityPo])],
  providers: [CommodityAdapter, CommodityDao],
  exports: [CommodityDao],
})
export class CommodityModule {}
