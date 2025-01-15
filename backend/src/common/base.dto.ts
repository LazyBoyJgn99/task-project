import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export abstract class PageDto {
  @ApiProperty({
    description: '每页数量',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;

  @ApiProperty({
    description: '页码',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number;

  @ApiProperty({
    description: '排序字段',
    required: false,
  })
  @IsString()
  @IsOptional()
  orderBy: string;

  @ApiProperty({
    description: '排序方式',
    required: false,
  })
  @IsString()
  @IsOptional()
  order: 'ASC' | 'DESC';
}
