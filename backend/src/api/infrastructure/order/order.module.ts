import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPo } from './order.po';
import { OrderAdapter } from './order.adapter';
import { OrderDao } from './order.dao';

@Module({
  imports: [TypeOrmModule.forFeature([OrderPo])],
  providers: [OrderAdapter, OrderDao],
  exports: [OrderDao],
})
export class OrderModule {}
