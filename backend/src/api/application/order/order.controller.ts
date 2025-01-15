import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Headers,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { WxpayClient } from '@/api/infrastructure/wxpay/wxpay.client';
import { Public } from '@/decorator/public';
import { OrderService } from './order.service';
import {
  OrderAddDto,
  OrderCancelDto,
  OrderDetailByChildDto,
  OrderDetailChildDto,
  OrderDetailDto,
  OrderPageDto,
  OrderQueryDto,
  OrderRefundsDto,
  OrderUpdateRemarksDto,
  OrderUseDto,
  OrderUseGrassDto,
  SignDto,
  WxCallbackDto,
} from './order.dto';

@Controller('order')
@ApiTags('订单模块')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly wxpayClient: WxpayClient,
  ) {}

  @Post()
  @ApiOperation({ summary: '新增订单' })
  async Add(@Body() orderAddDto: OrderAddDto) {
    return await this.orderService.Add(orderAddDto);
  }

  @Get()
  @ApiOperation({ summary: '查询订单' })
  async Query(@Query() orderQueryDto: OrderQueryDto) {
    return await this.orderService.Query(orderQueryDto);
  }

  @Get('page')
  @ApiOperation({ summary: '分页查询订单' })
  async Page(@Query() orderPageDto: OrderPageDto) {
    return await this.orderService.Page(orderPageDto);
  }

  @Get('detail')
  @ApiOperation({ summary: '订单详情' })
  async Detail(@Query() orderDetailDto: OrderDetailDto) {
    return await this.orderService.Detail(orderDetailDto);
  }

  @Get('detail/by-child')
  @ApiOperation({ summary: '订单详情，通过子订单id查询' })
  async DetailByChild(@Query() orderDetailByChildDto: OrderDetailByChildDto) {
    return await this.orderService.DetailByChild(orderDetailByChildDto);
  }

  @Get('detail/child')
  @ApiOperation({ summary: '子订单详情' })
  async DetailChild(@Query() orderDetailChildDto: OrderDetailChildDto) {
    return await this.orderService.DetailChild(orderDetailChildDto);
  }

  @Post('cancel')
  @ApiOperation({ summary: '订单取消' })
  async Cancel(@Body() orderCancelDto: OrderCancelDto) {
    return await this.orderService.Cancel(orderCancelDto);
  }

  @Post('refunds')
  @ApiOperation({ summary: '订单退款' })
  async Refunds(@Body() orderRefundsDto: OrderRefundsDto) {
    return await this.orderService.Refunds(orderRefundsDto);
  }

  @Post('use')
  @ApiOperation({ summary: '订单核销' })
  async Use(@Body() orderUseDto: OrderUseDto) {
    return await this.orderService.Use(orderUseDto);
  }

  @Post('use/grass')
  @ApiOperation({ summary: '订单核销-草料' })
  async UseGrass(@Body() orderUseGrassDto: OrderUseGrassDto) {
    return await this.orderService.UseGrass(orderUseGrassDto);
  }

  @Post('pay/sign')
  @ApiOperation({ summary: '获取支付签名' })
  async Sign(@Body() signDto: SignDto): Promise<string> {
    return await this.orderService.getSign(signDto);
  }

  @Public()
  @Post('pay/callback')
  @ApiOperation({ summary: '微信支付回调接口' })
  async PaySuccess(
    @Headers() headers: Record<string, string>,
    @Body() wxCallbackDto: WxCallbackDto,
  ): Promise<void> {
    if (!this.CheckWxSign(headers, wxCallbackDto)) return;
    await this.orderService.PaySuccess(wxCallbackDto);
  }

  @Public()
  @Post('refunds/callback')
  @ApiOperation({ summary: '微信退款回调接口' })
  async RefundsSuccess(
    @Headers() headers: Record<string, string>,
    @Body() wxCallbackDto: WxCallbackDto,
  ): Promise<void> {
    if (!this.CheckWxSign(headers, wxCallbackDto)) return;
    await this.orderService.RefundsSuccess(wxCallbackDto);
  }

  async CheckWxSign(headers: Record<string, string>, body: any) {
    return await this.wxpayClient.verifySign({
      timestamp: headers['wechatpay-timestamp'],
      nonce: headers['wechatpay-nonce'],
      body: body,
      serial: headers['wechatpay-serial'],
      signature: headers['wechatpay-signature'],
    });
  }

  @Patch('remarks')
  @ApiOperation({ summary: '更新订单备注' })
  async UpdateRemarks(@Body() orderUpdateRemarksDto: OrderUpdateRemarksDto) {
    await this.orderService.UpdateRemarks(orderUpdateRemarksDto);
  }
}
