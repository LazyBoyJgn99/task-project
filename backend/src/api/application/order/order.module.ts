import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/api/domain/order/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDomainService } from '@/api/domain/order/order.domain.service';
import { TaskModule } from '../task/task.module';
import { MockPaymentService } from '@/test/mocks/payment.service.mock';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TaskModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderDomainService, MockPaymentService],
  exports: [OrderService],
})
export class OrderModule {}
