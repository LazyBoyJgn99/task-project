import { AttributeTicketVo } from './attribute.ticket.vo';

// 类
export { Commodity };
// 类型
export { EnumCommodityStatus };

class Commodity {
  id: string;

  /**
   * 商品名称
   */
  name: string;

  /**
   * 商品价格
   */
  price: number;

  /**
   * 商品库存
   */
  stock: number;

  /**
   * 商品属性
   */
  attribute?: AttributeTicketVo;

  /**
   * 适用日期
   */
  date?: Date;

  /**
   * 门票状态
   */
  status?: EnumCommodityStatus;

  clone() {
    const commodity = new Commodity();
    commodity.id = this.id;
    commodity.name = this.name;
    commodity.price = this.price;
    commodity.stock = this.stock;
    commodity.attribute = this.attribute;
    commodity.date = this.date;
    commodity.status = this.status;
    return commodity;
  }
}

enum EnumCommodityStatus {
  /**
   * 在售
   */
  ON_SALE = 'onsale',

  /**
   * 休息
   */
  REST = 'rest',
}
