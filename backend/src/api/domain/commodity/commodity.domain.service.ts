import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommodityDao } from '@/api/infrastructure/commodity/commodity.dao';
import { Commodity } from './commodity.entity';
import { ERROR_COMMODITY_STOCK_NOT_ENOUGH } from '@/common/constant';

@Injectable()
export class CommodityDomainService {
  constructor(private readonly commodityDao: CommodityDao) {}

  async Add(commodity: Commodity): Promise<void> {
    await this.commodityDao.Save(commodity);
  }

  async Delete(id: string): Promise<void> {
    await this.commodityDao.Remove(id);
  }

  async Update(commodity: Commodity): Promise<void> {
    await this.commodityDao.Save(commodity);
  }

  async Query(id?: string, name?: string, date?: Date): Promise<Commodity[]> {
    return await this.commodityDao.FindAll(id, name, date);
  }

  async QueryByNamesAndDate(names: string[], date: Date) {
    return await this.commodityDao.FindAllByNamesAndDate(names, date);
  }

  async QueryByIds(ids: Set<string>) {
    return await this.commodityDao.FindAllByIds([...ids]);
  }

  async QueryByDate(date: Date): Promise<Commodity[]> {
    return await this.commodityDao.FindAllByDate(date);
  }

  async Detail(id: string): Promise<Commodity | null> {
    return await this.commodityDao.FindOne(id);
  }

  async BatchAdd(commodityList: Commodity[]) {
    await this.commodityDao.BatchSave(commodityList);
  }

  async BatchUpdate(commodityList: Commodity[]) {
    await this.commodityDao.BatchSave(commodityList);
  }

  /**
   * 减去库存
   */
  async SubStock(commodityList: Commodity[]) {
    // 收集每种类型商品的库存和购买数量
    const stockMap = this.getCommodityStockObj(commodityList);
    // 判断库存是否足够
    this.checkStockObjAndSub(stockMap);
    // 更新库存，过滤相同的商品
    const updateCommodityList = await this.getUpdateCommodityList(
      commodityList[0].date,
      stockMap,
    );
    await this.BatchUpdate(updateCommodityList);
  }

  /**
   * 恢复库存
   */
  async RecoverStock(commodityList: Commodity[]) {
    const stockMap = this.getCommodityStockObj(commodityList);
    this.checkStockObjAndAdd(stockMap);
    const updateCommodityList = await this.getUpdateCommodityList(
      commodityList[0].date,
      stockMap,
    );
    await this.BatchUpdate(updateCommodityList);
  }

  getUpdateCommodityList = async (
    date: Date,
    stockMap: Map<string, StockObj>,
  ) => {
    const updateCommodityList: Commodity[] = [];
    // 传入的commodityList可能不全，补全当日商品列表
    const totalCommodityList = await this.QueryByDate(date);
    const commodityList = totalCommodityList.filter(
      (commodity) => commodity.date.getTime() === date.getTime(),
    );
    commodityList.forEach((commodity) => {
      // 这里用commodityType区分而不是id，是因为成人票和儿童票用同一个库存，所以要同减同加
      const commodityType = commodity.attribute.type;
      const stockObj = stockMap.get(commodityType);
      // 不涉及库存修改的商品，直接返回
      if (!stockObj) return;
      const newStock = stockObj.stock;
      commodity.stock = newStock;
      const isPush = !!updateCommodityList.find(
        (item) => item.id === commodity.id,
      );
      if (!isPush) {
        updateCommodityList.push(commodity);
      }
    });

    return updateCommodityList;
  };

  getCommodityStockObj = (commodityList: Commodity[]) => {
    const stockMap = new Map<string, StockObj>();
    commodityList.forEach((commodity) => {
      // 这里用commodityType区分而不是id，是因为成人票和儿童票用同一个库存，所以要同减同加
      const commodityType = commodity.attribute.type;
      const stockObj = stockMap.get(commodityType);
      if (stockObj) {
        stockObj.quantity++;
      } else {
        stockMap.set(commodityType, {
          stock: commodity.stock,
          quantity: 1,
        });
      }
    });
    return stockMap;
  };

  checkStockObjAndSub = (stockMap: Map<string, StockObj>) => {
    stockMap.forEach((stockObj) => {
      if (stockObj.stock < stockObj.quantity) {
        throw new InternalServerErrorException(
          ERROR_COMMODITY_STOCK_NOT_ENOUGH,
        );
      } else {
        stockObj.stock -= stockObj.quantity;
      }
    });
  };

  checkStockObjAndAdd = (stockMap: Map<string, StockObj>) => {
    stockMap.forEach((stockObj) => {
      stockObj.stock += stockObj.quantity;
    });
  };
}

interface StockObj {
  stock: number;
  quantity: number;
}
