import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { Controller, Get, Query } from '@nestjs/common';
import { CouponQueryDetailDto, CouponQueryDto, CouponVo } from './coupon.dto';

@Controller('coupon')
@ApiTags('优惠券模块')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiOperation({ summary: '查询优惠券' })
  @ApiResponse({ type: CouponVo, isArray: true })
  async Query(@Query() params: CouponQueryDto) {
    return await this.couponService.Query(params);
  }

  @Get('detail')
  @ApiOperation({ summary: '查询优惠券详情' })
  @ApiResponse({ type: CouponVo })
  async Detail(@Query() params: CouponQueryDetailDto) {
    return await this.couponService.Detail(params);
  }
}
