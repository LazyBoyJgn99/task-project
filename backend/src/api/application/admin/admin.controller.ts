import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/api/domain/user/user.entity';
import { AdminService } from './admin.service';
import { UpdateUserDto, UserQueryDto } from '../user/user.dto';

@Controller('admin')
@ApiTags('管理员模块')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: '查询用户列表' })
  async queryUsers(@Query() queryDto: UserQueryDto) {
    return await this.adminService.queryUsers(queryDto);
  }

  @Put('user')
  @ApiOperation({ summary: '更新用户信息' })
  async updateUser(@Body() updateDto: UpdateUserDto) {
    return await this.adminService.updateUser(updateDto);
  }

  @Get('tasks')
  @ApiOperation({ summary: '查询任务列表' })
  async queryTasks() {
    return await this.adminService.queryTasks();
  }
} 