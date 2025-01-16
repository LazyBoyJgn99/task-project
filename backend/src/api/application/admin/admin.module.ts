import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserDomainModule } from '@/api/domain/user/user.domain.module';
import { TaskDomainModule } from '@/api/domain/task/task.domain.module';

@Module({
  imports: [
    UserDomainModule,
    TaskDomainModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {} 