import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@/api/domain/order/order.entity';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  taskId: string;
}

export class OrderPageDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  pageNumber?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({ required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  _userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  _createStartTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  _createEndTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  _useStartTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  _useEndTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  _commodityIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  orderBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}

export class OrderVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNo: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: OrderStatus;

  @ApiProperty()
  task: {
    id: string;
    title: string;
    description: string;
  };

  @ApiProperty()
  consumer: {
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

  @ApiProperty({ required: false })
  paymentTime?: Date;

  @ApiProperty({ required: false })
  completionTime?: Date;

  @ApiProperty({ required: false })
  cancelTime?: Date;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  remarks?: string;

  @ApiProperty({ required: false })
  refundId?: string;

  @ApiProperty({ required: false })
  createTime?: string;

  @ApiProperty({ required: false })
  updateTime?: string;

  @ApiProperty({ required: false })
  refundTime?: string;

  @ApiProperty({ required: false })
  useTime?: string;

  @ApiProperty({ required: false })
  commodity?: any;

  @ApiProperty({ required: false })
  user?: any;

  @ApiProperty({ required: false })
  coupon?: any;
}

export class OrderTotalVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: any;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  prepayId?: string;

  @ApiProperty({ required: false })
  createTime?: string;

  @ApiProperty({ required: false })
  updateTime?: string;

  @ApiProperty({ required: false })
  payTime?: string;

  @ApiProperty()
  children: OrderVo[];
}
