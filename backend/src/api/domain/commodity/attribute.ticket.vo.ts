export enum EnumCrowd {
  Adult = '成人',
  Child = '儿童',
}
export enum CommodityType {
  Ticket = '票',
  Grass = '草',
}

export class AttributeTicketVo {
  /**
   * 商品类型
   */
  type: CommodityType;

  /**
   * 人群类型：成人、儿童
   */
  crowd?: EnumCrowd;

  /**
   * 日票类型，属于是节假日还是平日
   */
  dayType?: string;
}
