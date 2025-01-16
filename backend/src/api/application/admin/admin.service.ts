import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDomainService } from '@/api/domain/user/user.domain.service';
import { TaskDomainService } from '@/api/domain/task/task.domain.service';
import { UpdateUserDto, UserQueryDto } from '../user/user.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly userDomainService: UserDomainService,
    private readonly taskDomainService: TaskDomainService,
  ) {}

  async queryUsers(queryDto: UserQueryDto) {
    return await this.userDomainService.findAll();
  }

  async updateUser(updateDto: UpdateUserDto) {
    const user = await this.userDomainService.findById(updateDto.id);
    if (!user) {
      throw new InternalServerErrorException('用户不存在');
    }

    if (updateDto.name) {
      user.name = updateDto.name;
    }
    if (updateDto.status) {
      user.status = updateDto.status;
    }

    return await this.userDomainService.update(user);
  }

  async queryTasks() {
    return await this.taskDomainService.findAll({
      pageNumber: 1,
      pageSize: 10
    });
  }
} 