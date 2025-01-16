import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '@/api/domain/task/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: '开发小程序' })
  @IsString()
  title: string;

  @ApiProperty({ example: '需要开发一个任务管理小程序...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '2024-04-01' })
  @IsDateString()
  deadline: Date;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}

export class TaskQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  workerId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  publisherId?: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}

export class TaskPageDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  pageNumber?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({ required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;
}

export class TaskDetailDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class TaskVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  status: TaskStatus;

  @ApiProperty()
  deadline: Date;

  @ApiProperty()
  publisher: {
    id: string;
    name: string;
    phone: string;
  };

  @ApiProperty({ required: false })
  worker?: {
    id: string;
    name: string;
    phone: string;
  };
} 