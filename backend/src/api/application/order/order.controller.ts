import { Controller, Get, Post, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderPageDto } from './order.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@/api/domain/user/user.entity';

@Controller('order')
@ApiTags('订单模块')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  @Roles(UserRole.CONSUMER)
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user) {
    return await this.orderService.create(createOrderDto, user);
  }

  @Get('my-consumer')
  @ApiOperation({ summary: '我的消费订单' })
  @Roles(UserRole.CONSUMER)
  async getMyConsumer(@Query() pageDto: OrderPageDto, @CurrentUser() user) {
    return await this.orderService.getMyConsumer(pageDto, user);
  }

  @Get('my-worker')
  @ApiOperation({ summary: '我的工作订单' })
  @Roles(UserRole.WORKER)
  async getMyWorker(@Query() pageDto: OrderPageDto, @CurrentUser() user) {
    return await this.orderService.getMyWorker(pageDto, user);
  }

  @Put('pay')
  @ApiOperation({ summary: '支付订单' })
  @Roles(UserRole.CONSUMER)
  async pay(@Body('orderId') orderId: string, @CurrentUser() user) {
    return await this.orderService.pay(orderId, user);
  }

  @Put('complete')
  @ApiOperation({ summary: '完成订单' })
  @Roles(UserRole.CONSUMER)
  async complete(@Body('orderId') orderId: string, @CurrentUser() user) {
    return await this.orderService.complete(orderId, user);
  }

  @Put('cancel')
  @ApiOperation({ summary: '取消订单' })
  @Roles(UserRole.CONSUMER)
  async cancel(@Body('orderId') orderId: string, @CurrentUser() user) {
    return await this.orderService.cancel(orderId, user);
  }

  @Put('refund')
  @ApiOperation({ summary: '申请退款' })
  @Roles(UserRole.CONSUMER)
  async refund(@Body('orderId') orderId: string, @CurrentUser() user) {
    return await this.orderService.refund(orderId, user);
  }
}
