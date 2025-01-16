import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderPo } from './order.po';
import { OrderAdapter } from './order.adapter';
import { OrderTotal } from '@/api/domain/order/order.total.entity';

@Injectable()
export class OrderDao {
  constructor(
    @InjectRepository(OrderPo)
    private readonly orderRepository: Repository<OrderPo>,
    private readonly orderAdapter: OrderAdapter,
  ) {}

  async save(order: OrderTotal): Promise<OrderTotal> {
    const po = this.orderAdapter.toPo(order);
    const savedPo = await this.orderRepository.save(po);
    return this.orderAdapter.toEntity(savedPo);
  }

  async findById(id: string): Promise<OrderTotal | null> {
    const po = await this.orderRepository.findOne({ where: { id } });
    return po ? this.orderAdapter.toEntity(po) : null;
  }

  async findByConsumer(consumerId: string): Promise<OrderTotal[]> {
    const pos = await this.orderRepository.find({ where: { consumerId } });
    return pos.map(po => this.orderAdapter.toEntity(po));
  }

  async findByWorker(workerId: string): Promise<OrderTotal[]> {
    const pos = await this.orderRepository.find({ where: { workerId } });
    return pos.map(po => this.orderAdapter.toEntity(po));
  }

  async findAll(): Promise<OrderTotal[]> {
    const pos = await this.orderRepository.find();
    return pos.map(po => this.orderAdapter.toEntity(po));
  }
}
