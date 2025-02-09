import { Controller, Get, Post, Put, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { 
  CreateTaskDto, 
  TaskPageDto,
  TaskDetailDto 
} from './task.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@/api/domain/user/user.entity';

@Controller('task')
@ApiTags('任务模块')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建任务' })
  @Roles(UserRole.CONSUMER)
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user) {
    const task = await this.taskService.create(createTaskDto, user);
    return {
      code: HttpStatus.OK,
      message: '创建成功',
      data: task
    };
  }

  @Get('my-published')
  @ApiOperation({ summary: '我发布的任务' })
  @Roles(UserRole.CONSUMER)
  async getMyPublished(@Query() pageDto: TaskPageDto, @CurrentUser() user) {
    const result = await this.taskService.getMyPublished(pageDto, user);
    return {
      code: HttpStatus.OK,
      message: '查询成功',
      data: result
    };
  }

  @Get('my-accepted')
  @ApiOperation({ summary: '我接到的任务' })
  @Roles(UserRole.WORKER)
  async getMyAccepted(@Query() pageDto: TaskPageDto, @CurrentUser() user) {
    const result = await this.taskService.getMyAccepted(pageDto, user);
    return {
      code: HttpStatus.OK,
      message: '查询成功',
      data: result
    };
  }

  @Get('detail')
  @ApiOperation({ summary: '任务详情' })
  async getDetail(@Query() detailDto: TaskDetailDto) {
    const task = await this.taskService.getDetail(detailDto);
    return {
      code: HttpStatus.OK,
      message: '查询成功',
      data: task
    };
  }

  @Put('accept')
  @ApiOperation({ summary: '接受任务' })
  @Roles(UserRole.WORKER)
  async accept(@Body('taskId') taskId: string, @CurrentUser() user) {
    const task = await this.taskService.accept(taskId, user);
    return {
      code: HttpStatus.OK,
      message: '接受成功',
      data: task
    };
  }

  @Put('complete')
  @ApiOperation({ summary: '完成任务' })
  @Roles(UserRole.WORKER)
  async complete(@Body('taskId') taskId: string, @CurrentUser() user) {
    const task = await this.taskService.complete(taskId, user);
    return {
      code: HttpStatus.OK,
      message: '完成成功',
      data: task
    };
  }
} 