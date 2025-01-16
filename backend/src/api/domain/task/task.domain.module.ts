import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskDomainService } from './task.domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskDomainService],
  exports: [TaskDomainService],
})
export class TaskDomainModule {} 