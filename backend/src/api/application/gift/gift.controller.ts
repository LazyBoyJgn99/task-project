import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GiftQueryDetailDto, GiftQueryDto, GiftUseDto } from './gift.dto';
import { GiftService } from './gift.service';

@Controller('gift')
@ApiTags('卡劵模块')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post('use')
  @ApiOperation({ summary: '使用卡劵' })
  async Use(@Body() params: GiftUseDto) {
    return await this.giftService.Use(params);
  }

  @Get()
  @ApiOperation({ summary: '查询卡劵' })
  async Query(@Query() params: GiftQueryDto) {
    return await this.giftService.Query(params);
  }

  @Get('detail')
  @ApiOperation({ summary: '查询卡劵详情' })
  async Detail(@Query() params: GiftQueryDetailDto) {
    return await this.giftService.Detail(params);
  }
}
