import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { TaskDomainService } from '@/api/domain/task/task.domain.service';
import { 
  CreateTaskDto, 
  TaskPageDto,
  TaskDetailDto 
} from './task.dto';
import { Task, TaskStatus } from '@/api/domain/task/task.entity';
import { User } from '@/api/domain/user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskDomainService: TaskDomainService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    Object.assign(task, createTaskDto);
    task.publisher = user;
    task.status = TaskStatus.PENDING;
    return await this.taskDomainService.create(task);
  }

  async getMyPublished(pageDto: TaskPageDto, user: User) {
    const [tasks, total] = await this.taskDomainService.findByPublisher(user.id, pageDto);
    return {
      items: tasks,
      total,
      pageNumber: pageDto.pageNumber,
      pageSize: pageDto.pageSize
    };
  }

  async getMyAccepted(pageDto: TaskPageDto, user: User) {
    const [tasks, total] = await this.taskDomainService.findByWorker(user.id, pageDto);
    return {
      items: tasks,
      total,
      pageNumber: pageDto.pageNumber,
      pageSize: pageDto.pageSize
    };
  }

  async getDetail(detailDto: TaskDetailDto) {
    const task = await this.taskDomainService.findById(detailDto.id);
    if (!task) {
      throw new InternalServerErrorException('任务不存在');
    }
    return task;
  }

  async accept(taskId: string, user: User) {
    const task = await this.taskDomainService.findById(taskId);
    if (!task) {
      throw new InternalServerErrorException('任务不存在');
    }
    if (task.status !== TaskStatus.PENDING) {
      throw new InternalServerErrorException('任务状态不正确');
    }
    
    task.status = TaskStatus.ACCEPTED;
    task.worker = user;
    
    return await this.taskDomainService.update(task);
  }

  async complete(taskId: string, user: User) {
    const task = await this.taskDomainService.findById(taskId);
    if (!task) {
      throw new InternalServerErrorException('任务不存在');
    }
    if (task.status !== TaskStatus.ACCEPTED) {
      throw new InternalServerErrorException('任务状态不正确');
    }
    if (task.worker.id !== user.id) {
      throw new ForbiddenException('无权操作此任务');
    }
    
    task.status = TaskStatus.COMPLETED;
    return await this.taskDomainService.update(task);
  }
} 