import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommodityDomainService } from '@/api/domain/commodity/commodity.domain.service';
import {
  ERROR_COMMODITY_EXIST,
  ERROR_TICKET_NOT_FOUND,
} from '@/common/constant';
import { DateInfo, TianClient } from '@/api/infrastructure/tian/tian.client';
import {
  Commodity,
  EnumCommodityStatus,
} from '@/api/domain/commodity/commodity.entity';
import {
  CommodityType,
  EnumCrowd,
} from '@/api/domain/commodity/attribute.ticket.vo';
import { DateToString, NewDate, Today } from '@/utils/time';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommodityDao } from '@/api/infrastructure/commodity/commodity.dao';
import { CommodityAdapter } from './commodity.adapter';
import {
  CommodityAddDto,
  CommodityQueryByDateDto,
  CommodityQueryDto,
  CommodityVo,
  CommodityUpdateDto,
  CommodityPageDto,
} from './commodity.dto';

// 票价
const USUAL_ADULT_PRICE = 158;
const USUAL_CHILD_PRICE = 88;
const WEDNESDAY_ADULT_PRICE = 98;
const WEDNESDAY_CHILD_PRICE = 88;
const HOLIDAY_ADULT_PRICE = 198;
const HOLIDAY_CHILD_PRICE = 98;
const GRASS_PRICE = 18;

// 初始库存
const INIT_STOCK_TICKET = 500;
const INIT_STOCK_GRASS = 1000;

const ADULT_TICKET = '成人票';
const CHILD_TICKET = '儿童票';
const USUAL_DAY = '平日';
const CRAZY_WEDNESDAY = '疯狂星期三';
const HILIDAY = '假期';
const HOLIDAY_LIST = [
  '元旦节',
  '中国元旦',
  '劳动节',
  '国际劳动节',
  '国庆节',
  '春节',
];

@Injectable()
export class CommodityService {
  constructor(
    private readonly commodityDomainService: CommodityDomainService,
    private readonly commodityAdapter: CommodityAdapter,
    private readonly commodityDao: CommodityDao,
    private readonly tianClient: TianClient,
  ) {}

  async Add(commodityAddDto: CommodityAddDto): Promise<void> {
    const commodity = this.commodityAdapter.ToEntity(commodityAddDto);
    await this.commodityDomainService.Add(commodity);
  }

  async Delete(id: string): Promise<void> {
    await this.commodityDomainService.Delete(id);
  }

  async Update(commodityUpdateDto: CommodityUpdateDto): Promise<void> {
    const oldCommodity = await this.commodityDomainService.Detail(
      commodityUpdateDto.id,
    );
    if (!oldCommodity) {
      throw new InternalServerErrorException(ERROR_TICKET_NOT_FOUND);
    }
    const commodity = this.commodityAdapter.ToEntityWhenUpdate(
      commodityUpdateDto,
      oldCommodity,
    );
    await this.commodityDomainService.Update(commodity);
    // 如果更新的是票，则需要同时更新另一种票的库存和状态
    if (commodity.attribute.type === CommodityType.Ticket) {
      const otherCommodityList = await this.commodityDomainService.Query(
        null,
        null,
        oldCommodity.date,
      );
      const _otherCommodity = otherCommodityList.find(
        (item) =>
          item.attribute.type === CommodityType.Ticket &&
          item.id !== commodity.id,
      );
      commodityUpdateDto.price = _otherCommodity.price; // 价格不变
      const otherCommodity = this.commodityAdapter.ToEntityWhenUpdate(
        commodityUpdateDto,
        _otherCommodity,
      );
      await this.commodityDomainService.Update(otherCommodity);
    }
  }

  async Query(commodityQueryDto: CommodityQueryDto): Promise<CommodityVo[]> {
    const date = NewDate(commodityQueryDto.date);
    const commodityList = await this.commodityDomainService.Query(
      commodityQueryDto.id,
      commodityQueryDto.name,
      date,
    );
    const commodityQueryVoList = this.commodityAdapter.ToVoList(commodityList);
    return commodityQueryVoList;
  }

  async Page(commodityPageDto: CommodityPageDto) {
    const { commodityList, total } =
      await this.commodityDao.PageAllCommodity(commodityPageDto);
    return this.commodityAdapter.ToPageVo(
      commodityList,
      commodityPageDto.pageSize,
      commodityPageDto.pageNumber,
      total,
    );
  }

  async QueryByDate(
    commodityQueryDto: CommodityQueryByDateDto,
  ): Promise<CommodityVo[]> {
    const date = NewDate(commodityQueryDto.date);
    const commodityList = await this.commodityDomainService.QueryByDate(date);
    const commodityQueryVoList = this.commodityAdapter.ToVoList(commodityList);
    return commodityQueryVoList;
  }

  async AddTicketByDate(dateString: string, status?: EnumCommodityStatus) {
    const date = NewDate(dateString);
    const existTickets = await this.commodityDomainService.Query(
      null,
      null,
      date,
    );
    if (existTickets && existTickets.length)
      throw new InternalServerErrorException(ERROR_COMMODITY_EXIST);
    const tickets = await this.ComputedTicket(date);
    // 用于提前设置休息日，门票状态为休息
    if (status) tickets.forEach((ticket) => (ticket.status = status));
    await this.commodityDomainService.BatchAdd(tickets);
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async AddTicketEveryday() {
    // 设置时间为15天后
    const date = Today();
    date.setDate(date.getDate() + 15);
    // 获取15天后的门票
    const existTickets = await this.commodityDomainService.Query(
      null,
      null,
      date,
    );
    // 如果门票已经存在，抛出异常
    if (existTickets && existTickets.length)
      throw new InternalServerErrorException(ERROR_COMMODITY_EXIST);
    // 生成15天后的门票
    const tickets = await this.ComputedTicket(date);
    await this.commodityDomainService.BatchAdd(tickets);
  }

  async ComputedTicket(date: Date) {
    // 计算date是否是节假日
    const dateString = DateToString(date);
    const dateInfo: DateInfo = await this.tianClient.DateInfo(dateString);

    for (const strategy of ticketStrategys) {
      if (strategy.check(dateInfo)) {
        return [...strategy.func(dateInfo), grassStrategy(dateInfo)];
      }
    }
  }
}

const ticketStrategys = [
  {
    // 节假日,
    check: (dateInfo: DateInfo) => HOLIDAY_LIST.includes(dateInfo.name),
    func: (dateInfo: DateInfo) => {
      // 成人票
      const ticketAdult = new Commodity();
      ticketAdult.name = `${HILIDAY}${ADULT_TICKET} ${dateInfo.date}`;
      ticketAdult.date = NewDate(dateInfo.date);
      ticketAdult.price = HOLIDAY_ADULT_PRICE;
      ticketAdult.stock = INIT_STOCK_TICKET;
      ticketAdult.status = EnumCommodityStatus.ON_SALE;
      ticketAdult.attribute = {
        type: CommodityType.Ticket,
        crowd: EnumCrowd.Adult,
        dayType: dateInfo.name,
      };
      // 儿童票
      const ticketChild = new Commodity();
      ticketChild.name = `${HILIDAY}${CHILD_TICKET} ${dateInfo.date}`;
      ticketChild.date = NewDate(dateInfo.date);
      ticketChild.price = HOLIDAY_CHILD_PRICE;
      ticketChild.stock = INIT_STOCK_TICKET;
      ticketChild.status = EnumCommodityStatus.ON_SALE;
      ticketChild.attribute = {
        type: CommodityType.Ticket,
        crowd: EnumCrowd.Child,
        dayType: dateInfo.name,
      };
      return [ticketAdult, ticketChild];
    },
  },
  {
    // 疯狂星期三
    check: (dateInfo: DateInfo) => dateInfo.weekday === 3,
    func: (dateInfo: DateInfo) => {
      // 成人票
      const ticketAdult = new Commodity();
      ticketAdult.name = `${CRAZY_WEDNESDAY}${ADULT_TICKET} ${dateInfo.date}`;
      ticketAdult.date = NewDate(dateInfo.date);
      ticketAdult.price = WEDNESDAY_ADULT_PRICE;
      ticketAdult.stock = INIT_STOCK_TICKET;
      ticketAdult.status = EnumCommodityStatus.ON_SALE;
      ticketAdult.attribute = {
        type: CommodityType.Ticket,
        crowd: EnumCrowd.Adult,
        dayType: CRAZY_WEDNESDAY,
      };
      // 儿童票
      const ticketChild = new Commodity();
      ticketChild.name = `${CRAZY_WEDNESDAY}${CHILD_TICKET} ${dateInfo.date}`;
      ticketChild.date = NewDate(dateInfo.date);
      ticketChild.price = WEDNESDAY_CHILD_PRICE;
      ticketChild.stock = INIT_STOCK_TICKET;
      ticketChild.status = EnumCommodityStatus.ON_SALE;
      ticketChild.attribute = {
        type: CommodityType.Ticket,
        crowd: EnumCrowd.Child,
        dayType: CRAZY_WEDNESDAY,
      };
      return [ticketAdult, ticketChild];
    },
  },
  {
    // 平日
    check: () => true,
    func: (dateInfo: DateInfo) => {
      // 成人票
      const ticketAdult = new Commodity();
      ticketAdult.name = `${ADULT_TICKET} ${dateInfo.date}`;
      ticketAdult.date = NewDate(dateInfo.date);
      ticketAdult.price = USUAL_ADULT_PRICE;
      ticketAdult.stock = INIT_STOCK_TICKET;
      ticketAdult.status = EnumCommodityStatus.ON_SALE;
      ticketAdult.attribute = {
        type: CommodityType.Ticket,
        crowd: EnumCrowd.Adult,
        dayType: USUAL_DAY,
      };
      // 儿童票
      const ticketChild = new Commodity();
      ticketChild.name = `${CHILD_TICKET} ${dateInfo.date}`;
      ticketChild.date = NewDate(dateInfo.date);
      ticketChild.price = USUAL_CHILD_PRICE;
      ticketChild.stock = INIT_STOCK_TICKET;
      ticketChild.status = EnumCommodityStatus.ON_SALE;
      ticketChild.attribute = {
        type: CommodityType.Ticket,
        crowd: EnumCrowd.Child,
        dayType: USUAL_DAY,
      };
      return [ticketAdult, ticketChild];
    },
  },
];

function grassStrategy(dateInfo: DateInfo) {
  const grass = new Commodity();
  grass.name = `草料 ${dateInfo.date}`;
  grass.date = NewDate(dateInfo.date);
  grass.price = GRASS_PRICE;
  grass.stock = INIT_STOCK_GRASS;
  grass.status = EnumCommodityStatus.ON_SALE;
  grass.attribute = {
    type: CommodityType.Grass,
  };
  return grass;
}
