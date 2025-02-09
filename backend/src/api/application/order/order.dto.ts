import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserVo } from '../user/user.dto';
import { CommodityVo } from '../commodity/commodity.dto';
import { CouponVo } from '../coupon/coupon.dto';
import { PageDto } from '@/common/base.dto';
import { OrderStatus } from '@/api/domain/order/order.entity';

export class ChooseCommodity {
  @ApiProperty({
    description: '商品Id',
  })
  @IsString()
  commodityId: string;

  @ApiProperty({
    description: '优惠券Id',
  })
  @IsString()
  @IsOptional()
  couponId: string;
}
export class OrderAddDto {
  @ApiProperty({
    description: '用户Id',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '选择的商品列表',
    type: ChooseCommodity,
    isArray: true,
  })
  @IsArray()
  @Type(() => ChooseCommodity)
  @ValidateNested({ each: true })
  chooseCommodityList: ChooseCommodity[];
}

export class WxCallbackDto {
  id: string;

  create_time: string;

  event_type: string;

  resource_type: string;

  summary: string;

  resource: {
    original_type: string;

    algorithm: string;

    ciphertext: string;

    associated_data: string;

    nonce: string;
  };
}

export class SuccessPay {
  @ApiProperty({
    description: '订单id',
  })
  @IsString()
  orderId: string;
}

export class SignDto {
  @ApiProperty({
    description: '小程序appId',
  })
  @IsString()
  appId: string;

  @ApiProperty({
    description: '时间戳',
  })
  @IsString()
  timeStamp: string;

  @ApiProperty({
    description: '不长于32位的随机字符串',
  })
  @IsString()
  nonceStr: string;

  @ApiProperty({
    description: 'prepay_id=***',
  })
  @IsString()
  package: string;
}

export class OrderQueryDto {
  @ApiProperty({
    description: '用户Id',
  })
  @IsString()
  userId: string;
}

export class OrderPageDto extends PageDto {
  @ApiProperty({
    description: '用户手机号',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: '订单状态',
    required: false,
  })
  @IsString()
  @IsOptional()
  status: OrderStatus;

  @ApiProperty({
    description: '创建开始时间',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  createStartTime: string;

  @ApiProperty({
    description: '创建结束时间',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  createEndTime: string;

  @ApiProperty({
    description: '核销开始时间',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  useStartTime: string;

  @ApiProperty({
    description: '核销结束时间',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  useEndTime: string;

  @ApiProperty({
    description: '门票日期',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  ticketDate: string;

  @ApiProperty({
    description: '门票类型',
    required: false,
  })
  @IsString()
  @IsOptional()
  ticketTypes: string;

  _userId?: string;
  _createStartTime?: Date;
  _createEndTime?: Date;
  _useStartTime?: Date;
  _useEndTime?: Date;
  _commodityIds?: string[];
}

export class OrderDetailDto {
  @ApiProperty({
    description: '总订单Id',
  })
  @IsString()
  id: string;
}

export class OrderDetailByChildDto {
  @ApiProperty({
    description: '子订单Id',
  })
  @IsString()
  id: string;
}

export class OrderDetailChildDto {
  @ApiProperty({
    description: '子订单Id',
  })
  @IsString()
  id: string;
}

export class OrderRefundsDto {
  @ApiProperty({
    description: '总订单id',
  })
  @IsString()
  orderTotalId: string;

  @ApiProperty({
    description: '子订单Ids',
  })
  @IsArray()
  @IsString({ each: true })
  orderIds: string[];
}

export class OrderCancelDto {
  @ApiProperty({
    description: '订单Id',
  })
  @IsString()
  id: string;
}

export class OrderUseDto {
  @ApiProperty({
    description: '订单Id',
  })
  @IsString()
  id: string;
}

export class OrderUseGrassDto {
  @ApiProperty({
    description: '用户Id',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '核销数量',
  })
  @IsInt()
  number: number;
}

export class OrderVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  user: UserVo;

  @ApiProperty()
  commodity: CommodityVo;

  @ApiProperty()
  coupon: CouponVo;

  @ApiProperty()
  price: number;

  @ApiProperty()
  createTime: string;

  @ApiProperty()
  updateTime: string;

  @ApiProperty()
  refundTime: string;

  @ApiProperty()
  useTime: string;

  @ApiProperty()
  refundId: string;

  @ApiProperty()
  remarks: string;
}

export class OrderTotalVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: UserVo;

  @ApiProperty()
  price: number;

  @ApiProperty()
  prepayId: string;

  @ApiProperty()
  createTime: string;

  @ApiProperty()
  updateTime: string;

  @ApiProperty()
  payTime: string;

  @ApiProperty()
  children: OrderVo[];
}

export class OrderUpdateRemarksDto {
  @ApiProperty({
    description: '订单Id',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '备注',
  })
  @IsString()
  remarks: string;
}
