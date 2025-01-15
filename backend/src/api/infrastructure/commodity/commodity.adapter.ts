import { Injectable } from '@nestjs/common';
import { Commodity } from '@/api/domain/commodity/commodity.entity';
import { CommodityPo } from './commodity.po';
import { NewDate } from '@/utils/time';

@Injectable()
export class CommodityAdapter {
  ToEntity(commodityPo: CommodityPo) {
    const commodity = new Commodity();
    commodity.id = commodityPo.id;
    commodity.name = commodityPo.name;
    commodity.price = commodityPo.price;
    commodity.stock = commodityPo.stock;
    commodity.status = commodityPo.status;
    commodity.date = NewDate(commodityPo.date);
    commodity.attribute =
      commodityPo.attribute && JSON.parse(commodityPo.attribute);
    return commodity;
  }

  ToEntityList(commodityPoList: CommodityPo[]) {
    return commodityPoList.map((commodityPo) => this.ToEntity(commodityPo));
  }

  ToPo(commodity: Commodity) {
    const commodityPo = new CommodityPo();
    commodityPo.id = commodity.id;
    commodityPo.name = commodity.name;
    commodityPo.price = commodity.price;
    commodityPo.date = commodity.date;
    commodityPo.stock = commodity.stock;
    commodityPo.status = commodity.status;
    commodityPo.attribute =
      commodity.attribute && JSON.stringify(commodity.attribute);
    return commodityPo;
  }

  ToPoList(commodityList: Commodity[]) {
    return commodityList.map((commodity) => this.ToPo(commodity));
  }
}
