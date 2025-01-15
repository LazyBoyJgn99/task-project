import { EnumCommodityStatus } from '@/api/domain/commodity/commodity.entity';
import { PageDto } from '@/common/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CommodityAddDto {
  @ApiProperty({
    example: '成人票 2024-09-05',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '商品属性',
    example: { crowd: '成人', dayType: '平日' },
  })
  @IsObject()
  @IsOptional()
  attribute: any;

  @ApiProperty({
    description: '适用日期',
    default: '2024-09-05',
  })
  @IsDateString()
  @IsOptional()
  date: string;

  @ApiProperty({
    example: 198,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: '库存',
    example: 100,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    example: 'onsale',
  })
  @IsString()
  status: EnumCommodityStatus;
}

export class CommodityDeleteDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class CommodityUpdateDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({
    example: 198,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: '库存',
    example: 100,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: '门票状态',
    example: 'onsale',
  })
  @IsString()
  status: EnumCommodityStatus;
}

export class CommodityQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: '适用日期',
    default: '2024-09-05',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date: string;
}

export class CommodityPageDto extends PageDto {
  @ApiProperty({
    description: '适用日期',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date: string;
}

export class CommodityQueryByDateDto {
  @ApiProperty({
    description: '适用日期',
    default: '2024-09-05',
  })
  @IsDateString()
  date: string;
}

export class CommodityAddByDateDto {
  @ApiProperty({
    description: '日期',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: '门票状态',
    required: false,
  })
  @IsString()
  @IsOptional()
  status: EnumCommodityStatus;
}

export class CommodityVo extends CommodityAddDto {
  @ApiProperty()
  @IsString()
  id: string;
}
