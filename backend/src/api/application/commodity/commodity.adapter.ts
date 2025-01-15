import { Injectable } from '@nestjs/common';
import { Commodity } from '@/api/domain/commodity/commodity.entity';
import { DateToString, NewDate } from '@/utils/time';
import {
  CommodityAddDto,
  CommodityVo,
  CommodityUpdateDto,
} from './commodity.dto';
import { PageVo } from '@/common/base.vo';

@Injectable()
export class CommodityAdapter {
  ToEntity(commodityDto: CommodityAddDto) {
    const commodity = new Commodity();
    commodity.name = commodityDto.name;
    commodity.price = commodityDto.price;
    commodity.stock = commodityDto.stock;
    commodity.status = commodityDto.status;
    commodity.date = NewDate(commodityDto.date);
    commodity.attribute = commodityDto.attribute;
    return commodity;
  }

  ToEntityWhenUpdate(
    commodityDto: CommodityUpdateDto,
    oldCommodity: Commodity,
  ) {
    oldCommodity.price = commodityDto.price;
    oldCommodity.stock = commodityDto.stock;
    oldCommodity.status = commodityDto.status;
    return oldCommodity;
  }

  ToVo(commodity: Commodity) {
    const commodityQueryVo = new CommodityVo();
    commodityQueryVo.id = commodity.id;
    commodityQueryVo.name = commodity.name;
    commodityQueryVo.price = commodity.price;
    commodityQueryVo.stock = commodity.stock;
    commodityQueryVo.status = commodity.status;
    commodityQueryVo.date = commodity.date && DateToString(commodity.date);
    commodityQueryVo.attribute = commodity.attribute;
    return commodityQueryVo;
  }

  ToVoList(commodityList: Commodity[]) {
    return commodityList.map((commodity) => this.ToVo(commodity));
  }

  ToPageVo(
    commodityList: Commodity[],
    pageSize: number,
    pageNumber: number,
    total: number,
  ) {
    const commodityVoList = this.ToVoList(commodityList);
    const commodityPageVo = new PageVo<CommodityVo>();
    commodityPageVo.pageSize = pageSize;
    commodityPageVo.pageNumber = pageNumber;
    commodityPageVo.total = total;
    commodityPageVo.list = commodityVoList;
    return commodityPageVo;
  }
}
