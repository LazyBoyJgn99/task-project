import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/decorator/public';
import { CommodityService } from './commodity.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CommodityAddDto,
  CommodityDeleteDto,
  CommodityQueryByDateDto,
  CommodityQueryDto,
  CommodityVo,
  CommodityUpdateDto,
  CommodityAddByDateDto,
  CommodityPageDto,
} from './commodity.dto';

@Controller('commodity')
@ApiTags('商品模块')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {}

  @Post()
  @ApiOperation({ summary: '新增商品' })
  async Add(@Body() commodityAddDto: CommodityAddDto): Promise<void> {
    await this.commodityService.Add(commodityAddDto);
  }

  @Delete()
  @ApiOperation({ summary: '删除商品' })
  async Delete(@Query() params: CommodityDeleteDto) {
    await this.commodityService.Delete(params.id);
  }

  @Patch()
  @ApiOperation({ summary: '更新商品' })
  async Update(@Body() commodityUpdateDto: CommodityUpdateDto) {
    await this.commodityService.Update(commodityUpdateDto);
  }

  @Get()
  @ApiOperation({ summary: '查询商品' })
  @ApiResponse({ type: CommodityVo, isArray: true })
  async Query(@Query() params: CommodityQueryDto) {
    return await this.commodityService.Query(params);
  }

  @Get('page')
  @ApiOperation({ summary: '分页查询商品' })
  async Page(@Query() commodityPageDto: CommodityPageDto) {
    return await this.commodityService.Page(commodityPageDto);
  }

  @Public()
  @Post('add-tickets-by-date')
  @ApiOperation({ summary: '新增某日的门票' })
  async AddTicketsByDate(@Body() params: CommodityAddByDateDto) {
    await this.commodityService.AddTicketByDate(params.date, params.status);
  }

  @Get('by-date')
  @ApiOperation({ summary: '查询商品某日之后的商品' })
  @ApiResponse({ type: CommodityVo, isArray: true })
  async QueryByDate(
    @Query() params: CommodityQueryByDateDto,
  ): Promise<CommodityVo[]> {
    return await this.commodityService.QueryByDate(params);
  }
}
