import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { User } from '../user/user.entity';

@Injectable()
export class OrderDomainService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async create(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  async findById(id: string): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['consumer', 'worker', 'task']
    });
  }

  async findByConsumer(consumerId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { consumer: { id: consumerId } },
      relations: ['consumer', 'worker', 'task']
    });
  }

  async findByWorker(workerId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { worker: { id: workerId } },
      relations: ['consumer', 'worker', 'task']
    });
  }

  async update(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }
}
