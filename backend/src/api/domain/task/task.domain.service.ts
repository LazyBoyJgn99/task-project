import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { TaskPageDto } from '@/api/application/task/task.dto';

@Injectable()
export class TaskDomainService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  async findById(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['publisher', 'worker']
    });
  }

  async findAll(pageDto?: TaskPageDto): Promise<[Task[], number]> {
    const skip = pageDto ? (pageDto.pageNumber - 1) * pageDto.pageSize : 0;
    const take = pageDto?.pageSize || 10;

    return await this.taskRepository.findAndCount({
      relations: ['publisher', 'worker'],
      skip,
      take,
      order: {
        createTime: 'DESC'
      }
    });
  }

  async update(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }

  async findByWorker(workerId: string, pageDto: TaskPageDto): Promise<[Task[], number]> {
    const skip = (pageDto.pageNumber - 1) * pageDto.pageSize;
    return await this.taskRepository.findAndCount({
      where: { worker: { id: workerId } },
      relations: ['publisher', 'worker'],
      skip,
      take: pageDto.pageSize,
      order: { createTime: 'DESC' }
    });
  }

  async findByPublisher(publisherId: string, pageDto: TaskPageDto): Promise<[Task[], number]> {
    const skip = (pageDto.pageNumber - 1) * pageDto.pageSize;
    return await this.taskRepository.findAndCount({
      where: { publisher: { id: publisherId } },
      relations: ['publisher', 'worker'],
      skip,
      take: pageDto.pageSize,
      order: { createTime: 'DESC' }
    });
  }

  async create(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }
} 