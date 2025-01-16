import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@/api/domain/task/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskDomainService } from '@/api/domain/task/task.domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService, TaskDomainService],
  exports: [TaskService, TaskDomainService],
})
export class TaskModule {} 