import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsCustomStrategyFormat,
  IsCustomUseTimeFormat,
} from '@/utils/validation.pipe';
import { CouponStatus } from '@/api/domain/coupon/type';
import { UserVo } from '../user/user.dto';

export class CouponAddDto {
  @ApiProperty({
    description: '用户Id',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '优惠券名称',
    example: '生日优惠券',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '优惠策略,举例:discount-70,full-100-reduce-30',
    example: 'discount-70',
  })
  @IsCustomStrategyFormat()
  strategy: string;

  @ApiProperty({
    description: '适用商品Id列表,不传表示全场可用',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  commodityIdList?: string[];

  @ApiProperty({
    description: '适用时间,不传表示所以时间可用,举例:2024-09-05 to 2024-10-05',
    example: '2024-09-05 to 2024-10-05',
    required: false,
  })
  @IsCustomUseTimeFormat()
  @IsOptional()
  canUseTime?: string | null;
}

export class CouponUpdateDto extends CouponAddDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  @IsEnum(CouponStatus)
  status: string;
}

export class CouponQueryDto {
  @ApiProperty({
    description: '用户Id',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: '优惠券名称',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;
}

export class CouponQueryDetailDto {
  @ApiProperty({
    description: '优惠券id',
  })
  @IsString()
  id: string;
}

export class CouponVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  user: UserVo;

  @ApiProperty({
    description: '优惠券名称',
    example: '生日优惠券',
  })
  name: string;

  @ApiProperty({
    description: '优惠策略,举例:discount-70,full-100-reduce-30',
    example: 'discount-70',
  })
  strategy: string;

  @ApiProperty({
    description: '适用时间,不传表示所以时间可用,举例:2024-09-05 to 2024-10-05',
    example: '2024-09-05 to 2024-10-05',
    required: false,
  })
  canUseTime: string | null;
}

export class CouponDeleteDto {
  @ApiProperty()
  @IsString()
  id: string;
}
